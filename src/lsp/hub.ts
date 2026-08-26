import { readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import { filePathFromUri, LspClient, type LspDiagnostic } from "./client.ts";
import {
	findRoot,
	languageIdFor,
	LSP_LANGUAGES,
	probeLanguage,
	specForExtension,
	type LspLanguage,
	type LspLanguageSpec,
} from "./registry.ts";
import type { LspConfig, LspSeverity } from "./types.ts";

interface ClientSlot {
	client?: LspClient;
	starting?: Promise<LspClient | undefined>;
	fails: number[];
	openUntil: number;
	circuitUntil: number;
	lastHash?: string;
}

const MAX_LIVE_CLIENTS = 8;
const SKIP_DIR = /(\/|^)(node_modules|target|dist|vendor|__pycache__|\.git|\.venv)(\/|$)/;
const SKIP_FILE = /(^|\/)\.env($|\.)|secrets|credentials|id_rsa|auth\.json|connector\.env/i;
const BASH_HINT =
	/\b(dotnet|cargo|mvn|gradle|pytest|tsc|mix|dune|phpunit|npm\s+(test|run)|yarn\s+test|composer\s+test)\b/i;
const DIGEST_HEADER = /^LSP \[|^Advisor \(ox-alpha\)/;

export class LspHub {
	private slots = new Map<string, ClientSlot>();
	private lastParentHash?: string;
	private lastBashAt = 0;
	cwd = process.cwd();

	constructor(private readonly config: LspConfig) {}

	setCwd(cwd: string): void {
		this.cwd = cwd;
	}

	probeMatrix(): Array<{
		language: LspLanguage;
		command: string;
		found: boolean;
		status: string;
		specialist: string;
	}> {
		return LSP_LANGUAGES.map((spec) => {
			const probe = probeLanguage(spec);
			const slot = [...this.slots.values()].find((item) => item.client?.language === spec.id);
			let status = probe.found ? "found (idle until first file)" : "not found";
			if (slot?.client?.ready) status = "initialize ok";
			else if (slot?.client?.error) status = `fail: ${slot.client.error}`;
			else if (slot && slot.circuitUntil > Date.now()) status = "circuit-open";
			return {
				language: spec.id,
				command: probe.command ? [probe.command, ...probe.args].join(" ") : (spec.candidates[0]?.join(" ") ?? ""),
				found: probe.found,
				status,
				specialist: spec.specialist,
			};
		});
	}

	formatStatus(): string {
		return this.probeMatrix()
			.map((row) => `${row.language}: ${row.found ? row.command : "(missing)"} — ${row.status} → ${row.specialist}`)
			.join("\n");
	}

	allDiagnostics(severities: LspSeverity[]): LspDiagnostic[] {
		const out: LspDiagnostic[] = [];
		for (const slot of this.slots.values()) {
			if (!slot.client) continue;
			for (const list of slot.client.diagnostics.values()) {
				for (const diag of list) {
					if (severities.includes(diag.severity)) out.push(diag);
				}
			}
		}
		return out;
	}

	digest(severities: LspSeverity[], topN: number, maxBytes: number): string {
		const diags = this.allDiagnostics(severities)
			.sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
			.slice(0, topN);
		if (diags.length === 0) return "";
		const lines = [`LSP [${diags.length} ${severities.join("|")}]`];
		for (const diag of diags) {
			const rel = safeRel(this.cwd, diag.path);
			const code = diag.code ? ` ${diag.code}` : "";
			lines.push(
				`${diag.severity} ${rel}:${diag.line}:${diag.character} [${diag.source ?? diag.path.split("/").pop()}${code}] ${diag.message}`,
			);
		}
		let text = lines.join("\n");
		if (Buffer.byteLength(text, "utf8") > maxBytes) text = `${text.slice(0, maxBytes)}\n[truncated]`;
		return text;
	}

	parentDigest(): string {
		return this.digest(this.config.parentSeverities, this.config.parentTopN, this.config.parentMaxBytes);
	}

	identityHash(severities: LspSeverity[]): string {
		return this.allDiagnostics(severities)
			.map((diag) => diag.identity)
			.sort()
			.join("\n");
	}

	async onFileMutation(absPath: string): Promise<string> {
		if (!this.config.enabled) return "";
		if (shouldSkipPath(absPath, this.config.maxDocBytes)) return "";
		try {
			const client = await this.ensureForFile(absPath);
			if (!client) return "";
			const text = readIfAllowed(absPath, this.config.maxDocBytes);
			if (text === undefined) return "";
			await client.openOrChange(absPath, text, languageIdFor(client.spec, absPath), this.config.debounceMs);
			await client.save(absPath);
			const deadline = Date.now() + 8000;
			while (Date.now() < deadline) {
				const uriDiags = [...client.diagnostics.values()].some((list) => list.length > 0);
				if (uriDiags) break;
				await client.waitForUri(absPath, 400);
			}
			this.touch(client);
			return this.parentDigest();
		} catch {
			return "";
		}
	}

	async onBash(command: string): Promise<void> {
		if (!this.config.enabled) return;
		if (!BASH_HINT.test(command)) return;
		const now = Date.now();
		if (now - this.lastBashAt < 2000) return;
		this.lastBashAt = now;
		for (const slot of this.slots.values()) {
			if (!slot.client?.ready) continue;
			for (const uri of slot.client.diagnostics.keys()) {
				try {
					await slot.client.save(filePathFromUri(uri));
				} catch {
					// ignore
				}
			}
		}
	}

	shouldInjectParent(): string | undefined {
		const digest = this.parentDigest();
		if (!digest) {
			this.lastParentHash = this.identityHash(this.config.parentSeverities);
			return undefined;
		}
		const hash = this.identityHash(this.config.parentSeverities);
		if (hash === this.lastParentHash) return undefined;
		this.lastParentHash = hash;
		return digest;
	}

	async close(): Promise<void> {
		const clients = [...this.slots.values()].map((slot) => slot.client).filter(Boolean) as LspClient[];
		this.slots.clear();
		await Promise.all(clients.map((client) => client.shutdown().catch(() => undefined)));
	}

	reapIdle(): void {
		const now = Date.now();
		for (const [key, slot] of this.slots) {
			if (slot.client && slot.openUntil && slot.openUntil < now && slot.client.openCount() === 0) {
				void slot.client.shutdown();
				this.slots.delete(key);
			}
		}
	}

	private key(spec: LspLanguageSpec, root: string): string {
		return `${spec.id}:${root}`;
	}

	private async ensureForFile(absPath: string): Promise<LspClient | undefined> {
		const spec = specForExtension(absPath);
		if (!spec) return undefined;
		const root = findRoot(dirname(absPath), spec.rootMarkers, this.cwd);
		const key = this.key(spec, root);
		let slot = this.slots.get(key);
		if (!slot) {
			slot = { fails: [], openUntil: 0, circuitUntil: 0 };
			this.slots.set(key, slot);
		}
		if (slot.circuitUntil > Date.now()) return undefined;
		if (slot.client?.ready) return slot.client;
		if (slot.starting) return slot.starting;
		slot.starting = this.spawn(spec, root, slot);
		try {
			return await slot.starting;
		} finally {
			slot.starting = undefined;
		}
	}

	private async spawn(spec: LspLanguageSpec, root: string, slot: ClientSlot): Promise<LspClient | undefined> {
		const live = [...this.slots.values()].filter((item) => item.client?.ready).length;
		if (live >= MAX_LIVE_CLIENTS) return undefined;
		const probe = probeLanguage(spec);
		if (!probe.found || !probe.command) return undefined;
		const client = new LspClient(spec, root, probe.command, probe.args);
		try {
			await client.start(this.config.initTimeoutMs);
			slot.client = client;
			slot.fails = [];
			this.touch(client);
			return client;
		} catch {
			await client.kill().catch(() => undefined);
			const now = Date.now();
			slot.fails = [...slot.fails.filter((ts) => now - ts < this.config.restartWindowMs), now];
			if (slot.fails.length >= this.config.maxRestarts) {
				slot.circuitUntil = now + this.config.restartWindowMs;
			}
			return undefined;
		}
	}

	private touch(client: LspClient): void {
		const key = this.key(client.spec, client.root);
		const slot = this.slots.get(key);
		if (slot) slot.openUntil = Date.now() + this.config.idleTimeoutMs;
	}

}

export function shouldSkipPath(absPath: string, maxDocBytes: number): boolean {
	if (SKIP_DIR.test(absPath) || SKIP_FILE.test(absPath)) return true;
	try {
		const stat = statSync(absPath);
		if (!stat.isFile() || stat.size > maxDocBytes) return true;
	} catch {
		return true;
	}
	return false;
}

function readIfAllowed(absPath: string, maxDocBytes: number): string | undefined {
	if (shouldSkipPath(absPath, maxDocBytes)) return undefined;
	try {
		const text = readFileSync(absPath, "utf8");
		if (DIGEST_HEADER.test(text.trim())) return undefined;
		return text;
	} catch {
		return undefined;
	}
}

function severityRank(severity: LspSeverity): number {
	if (severity === "error") return 0;
	if (severity === "warning") return 1;
	if (severity === "info") return 2;
	return 3;
}

function safeRel(cwd: string, absPath: string): string {
	const rel = relative(cwd, absPath);
	return rel && !rel.startsWith("..") ? rel : absPath;
}

export function resolveMutationPath(cwd: string, input: Record<string, unknown>): string | undefined {
	const path = typeof input.path === "string" ? input.path : undefined;
	if (!path) return undefined;
	return resolve(cwd, path);
}

export function injectLspNote(pi: ExtensionAPI, digest: string): void {
	try {
		pi.sendMessage(
			{ customType: "aio-lsp", content: digest, display: true },
			{ deliverAs: "steer", triggerTurn: false },
		);
	} catch {
		// fail-open
	}
}

export { findRoot } from "./registry.ts";
