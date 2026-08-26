import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { pathToFileURL } from "node:url";
import type { LspLanguageSpec } from "./registry.ts";
import type { LspLanguage, LspSeverity } from "./types.ts";

export interface LspDiagnostic {
	uri: string;
	path: string;
	severity: LspSeverity;
	line: number;
	character: number;
	source?: string;
	code?: string;
	message: string;
	identity: string;
}

interface Pending {
	resolve: (value: unknown) => void;
	reject: (error: Error) => void;
}

const SEVERITY: Record<number, LspSeverity> = {
	1: "error",
	2: "warning",
	3: "info",
	4: "hint",
};

export class LspClient {
	readonly language: LspLanguage;
	readonly root: string;
	readonly specialist: string;
	ready = false;
	error?: string;
	private proc?: ChildProcessWithoutNullStreams;
	private buf = Buffer.alloc(0);
	private nextId = 1;
	private pending = new Map<number, Pending>();
	private versions = new Map<string, number>();
	private docs = new Map<string, string>();
	readonly diagnostics = new Map<string, LspDiagnostic[]>();
	private waiters = new Map<string, Array<() => void>>();
	private incremental = false;

	constructor(
		readonly spec: LspLanguageSpec,
		root: string,
		private readonly command: string,
		private readonly args: string[],
	) {
		this.language = spec.id;
		this.root = root;
		this.specialist = spec.specialist;
	}

	async start(initTimeoutMs: number): Promise<void> {
		this.proc = spawn(this.command, this.args, {
			cwd: this.root,
			stdio: ["pipe", "pipe", "pipe"],
			env: { ...process.env, RUST_BACKTRACE: "0" },
		});
		this.proc.stdout.on("data", (chunk: Buffer) => this.onData(chunk));
		this.proc.stderr.on("data", () => undefined);
		this.proc.on("exit", () => {
			this.ready = false;
			this.error = this.error ?? "exited";
			for (const pending of this.pending.values()) pending.reject(new Error("lsp exited"));
			this.pending.clear();
		});
		this.proc.on("error", (error) => {
			this.error = error.message;
		});

		const rootUri = pathToFileURL(this.root).href;
		try {
			const result = await this.request(
				"initialize",
				{
					processId: process.pid,
					rootUri,
					rootPath: this.root,
					capabilities: {
						workspace: { workspaceFolders: true },
						textDocument: {
							synchronization: { didSave: true, dynamicRegistration: false },
							publishDiagnostics: { relatedInformation: false },
						},
					},
					workspaceFolders: [{ uri: rootUri, name: this.spec.id }],
					initializationOptions: {},
				},
				initTimeoutMs,
			);
			this.incremental = isIncremental(textDocumentSyncOf(result));
			await this.notify("initialized", {});
			this.ready = true;
			this.error = undefined;
		} catch (error) {
			this.error = error instanceof Error ? error.message : String(error);
			this.ready = false;
			await this.kill();
			throw error;
		}
	}

	async openOrChange(absPath: string, text: string, languageId: string, debounceMs: number): Promise<void> {
		const uri = pathToFileURL(absPath).href;
		const previous = this.docs.get(uri);
		if (previous === undefined) {
			this.docs.set(uri, text);
			this.versions.set(uri, 1);
			await this.notify("textDocument/didOpen", {
				textDocument: { uri, languageId, version: 1, text },
			});
			return;
		}
		if (previous === text) return;
		await delay(debounceMs);
		const version = (this.versions.get(uri) ?? 1) + 1;
		this.versions.set(uri, version);
		const change = this.incremental ? incrementalChange(previous, text) : { text };
		this.docs.set(uri, text);
		await this.notify("textDocument/didChange", {
			textDocument: { uri, version },
			contentChanges: [change],
		});
	}

	async save(absPath: string): Promise<void> {
		const uri = pathToFileURL(absPath).href;
		if (!this.docs.has(uri)) return;
		await this.notify("textDocument/didSave", { textDocument: { uri } });
	}

	async close(absPath: string): Promise<void> {
		const uri = pathToFileURL(absPath).href;
		if (!this.docs.has(uri)) return;
		this.docs.delete(uri);
		this.versions.delete(uri);
		await this.notify("textDocument/didClose", { textDocument: { uri } });
	}

	openCount(): number {
		return this.docs.size;
	}

	async waitForUri(absPath: string, timeoutMs: number): Promise<void> {
		const uri = pathToFileURL(absPath).href;
		if (this.diagnostics.has(uri)) return;
		const { promise, resolve } = Promise.withResolvers<void>();
		const list = this.waiters.get(uri) ?? [];
		list.push(resolve);
		this.waiters.set(uri, list);
		setTimeout(resolve, timeoutMs);
		await promise;
	}

	async shutdown(): Promise<void> {
		try {
			await this.request("shutdown", null, 2000);
			await this.notify("exit", undefined);
		} catch {
			// ignore
		}
		await this.kill();
	}

	async kill(): Promise<void> {
		const proc = this.proc;
		this.proc = undefined;
		this.ready = false;
		if (!proc || proc.killed) return;
		proc.kill("SIGTERM");
		await delay(2000);
		if (!proc.killed) proc.kill("SIGKILL");
	}

	private async request(method: string, params: unknown, timeoutMs: number): Promise<unknown> {
		const id = this.nextId++;
		const payload = { jsonrpc: "2.0", id, method, params };
		this.write(payload);
		const { promise, resolve, reject } = Promise.withResolvers<unknown>();
		const timer = setTimeout(() => {
			this.pending.delete(id);
			reject(new Error(`${method} timed out`));
		}, timeoutMs);
		this.pending.set(id, {
			resolve: (value) => {
				clearTimeout(timer);
				resolve(value);
			},
			reject: (error) => {
				clearTimeout(timer);
				reject(error);
			},
		});
		return await promise;
	}

	private async notify(method: string, params: unknown): Promise<void> {
		this.write({ jsonrpc: "2.0", method, params });
	}

	private write(msg: unknown): void {
		if (!this.proc?.stdin.writable) return;
		const json = JSON.stringify(msg);
		const body = Buffer.from(json, "utf8");
		this.proc.stdin.write(`Content-Length: ${body.length}\r\n\r\n`);
		this.proc.stdin.write(body);
	}

	private onData(chunk: Buffer): void {
		this.buf = Buffer.concat([this.buf, chunk]);
		while (true) {
			const headerEnd = this.buf.indexOf("\r\n\r\n");
			if (headerEnd < 0) return;
			const header = this.buf.slice(0, headerEnd).toString("utf8");
			const match = header.match(/Content-Length:\s*(\d+)/i);
			if (!match?.[1]) {
				this.buf = this.buf.slice(headerEnd + 4);
				continue;
			}
			const length = Number(match[1]);
			const start = headerEnd + 4;
			if (this.buf.length < start + length) return;
			const body = this.buf.slice(start, start + length).toString("utf8");
			this.buf = this.buf.slice(start + length);
			try {
				this.dispatch(JSON.parse(body) as Record<string, unknown>);
			} catch {
				// ignore malformed
			}
		}
	}

	private dispatch(msg: Record<string, unknown>): void {
		if (typeof msg.id === "number" && this.pending.has(msg.id)) {
			const pending = this.pending.get(msg.id);
			this.pending.delete(msg.id);
			if (msg.error) {
				pending?.reject(new Error(JSON.stringify(msg.error)));
			} else {
				pending?.resolve(msg.result);
			}
			return;
		}
		if (msg.method === "textDocument/publishDiagnostics") {
			const params = publishParams(msg.params);
			if (!params) return;
			const path = filePathFromUri(params.uri);
			const mapped = params.diagnostics.map((raw) => mapPublished(params.uri, path, raw));
			this.diagnostics.set(params.uri, mapped);
			const waiters = this.waiters.get(params.uri) ?? [];
			this.waiters.delete(params.uri);
			for (const waiter of waiters) waiter();
		}
	}
}

function textDocumentSyncOf(result: unknown): unknown {
	if (!result || typeof result !== "object" || !("capabilities" in result)) return undefined;
	const capabilities = result.capabilities;
	if (!capabilities || typeof capabilities !== "object" || !("textDocumentSync" in capabilities)) return undefined;
	return capabilities.textDocumentSync;
}

function isIncremental(sync: unknown): boolean {
	if (sync === 2) return true;
	if (sync && typeof sync === "object" && "change" in sync) return sync.change === 2;
	return false;
}

function publishParams(value: unknown): { uri: string; diagnostics: unknown[] } | undefined {
	if (!value || typeof value !== "object" || !("uri" in value) || typeof value.uri !== "string" || !value.uri) {
		return undefined;
	}
	const diagnostics = "diagnostics" in value && Array.isArray(value.diagnostics) ? value.diagnostics : [];
	return { uri: value.uri, diagnostics };
}

function mapPublished(uri: string, path: string, raw: unknown): LspDiagnostic {
	const rec = raw && typeof raw === "object" ? raw : undefined;
	const range = rec && "range" in rec && rec.range && typeof rec.range === "object" ? rec.range : undefined;
	const start = range && "start" in range && range.start && typeof range.start === "object" ? range.start : undefined;
	const line = ((start && "line" in start && typeof start.line === "number" ? start.line : 0) + 1);
	const character = ((start && "character" in start && typeof start.character === "number" ? start.character : 0) + 1);
	const severityNum = rec && "severity" in rec && typeof rec.severity === "number" ? rec.severity : 1;
	const severity = SEVERITY[severityNum] ?? "error";
	const source = rec && "source" in rec && typeof rec.source === "string" ? rec.source : undefined;
	const codeRaw = rec && "code" in rec ? rec.code : undefined;
	const code = typeof codeRaw === "string" || typeof codeRaw === "number" ? String(codeRaw) : undefined;
	const messageRaw = rec && "message" in rec && typeof rec.message === "string" ? rec.message : "";
	const message = messageRaw.replace(/\s+/g, " ").trim();
	return {
		uri,
		path,
		severity,
		line,
		character,
		source,
		code,
		message,
		identity: `${uri}|${line}|${character}|${severity}|${source ?? ""}|${code ?? ""}|${message}`,
	};
}

function incrementalChange(
	previous: string,
	next: string,
): { range: { start: { line: number; character: number }; end: { line: number; character: number } }; text: string } | { text: string } {
	let start = 0;
	const min = Math.min(previous.length, next.length);
	while (start < min && previous[start] === next[start]) start++;
	let endOld = previous.length;
	let endNew = next.length;
	while (endOld > start && endNew > start && previous[endOld - 1] === next[endNew - 1]) {
		endOld--;
		endNew--;
	}
	if (start === 0 && endOld === previous.length) return { text: next };
	return {
		range: { start: offsetToPos(previous, start), end: offsetToPos(previous, endOld) },
		text: next.slice(start, endNew),
	};
}

function offsetToPos(text: string, offset: number): { line: number; character: number } {
	let line = 0;
	let last = 0;
	for (let i = 0; i < offset && i < text.length; i++) {
		if (text[i] === "\n") {
			line++;
			last = i + 1;
		}
	}
	return { line, character: offset - last };
}

export function filePathFromUri(uri: string): string {
	if (uri.startsWith("file://")) {
		try {
			return decodeURIComponent(uri.slice("file://".length));
		} catch {
			return uri.slice("file://".length);
		}
	}
	return uri;
}

function delay(ms: number): Promise<void> {
	const { promise, resolve } = Promise.withResolvers<void>();
	setTimeout(resolve, ms);
	return promise;
}
