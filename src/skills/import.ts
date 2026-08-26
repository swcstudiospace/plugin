import { createHash } from "node:crypto";
import {
	existsSync,
	lstatSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, extname, join, relative, sep } from "node:path";

const SKIP_DIR_NAMES: Record<string, true> = {
	node_modules: true,
	".git": true,
	__pycache__: true,
	".venv": true,
	".hub": true,
	".curator_backups": true,
	".curator_state": true,
};

const SECRET_FILE_NAMES: Record<string, true> = {
	".env": true,
	"auth.json": true,
	credentials: true,
	"credentials.json": true,
	id_rsa: true,
	id_ed25519: true,
	"nous_auth.json": true,
};

const SECRET_NAME_RE = /^\.env(\..+)?$|\.(pem|key|p12|pfx)$/i;
const SECRET_BODY_RE =
	/\b(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-live-[A-Za-z0-9]+|sk-ant-[A-Za-z0-9-]+|AKIA[0-9A-Z]{16}|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY)\b/;
const BODY_SCAN_EXT: Record<string, true> = {
	".py": true,
	".sh": true,
	".bash": true,
	".js": true,
	".ts": true,
	".json": true,
	".yml": true,
	".yaml": true,
	".toml": true,
};
const MAX_FILE_BYTES = 2_000_000;


export interface ImportedSkillRecord {
	name: string;
	hermesPath: string;
	sha256: string;
	files: string[];
	skippedFiles: string[];
}

export interface ImportReport {
	source: string;
	dest: string;
	imported: string[];
	updated: string[];
	unchanged: string[];
	skipped: Array<{ name: string; reason: string }>;
	conflicted: Array<{ name: string; reason: string }>;
	redacted: Array<{ path: string; reason: string }>;
	skills: Record<string, ImportedSkillRecord>;
}

export interface ImportOptions {
	sourceDir: string;
	destDir: string;
	previous?: ImportReport | null;
}

export function defaultHermesSkillsDir(): string {
	const home = process.env.HERMES_HOME?.trim() || join(homedir(), ".hermes");
	return join(home, "skills");
}

export function loadReport(path: string): ImportReport | undefined {
	try {
		if (!existsSync(path)) return undefined;
		return JSON.parse(readFileSync(path, "utf8")) as ImportReport;
	} catch {
		return undefined;
	}
}

function isSecretFileName(name: string): boolean {
	if (SECRET_FILE_NAMES[name]) return true;
	return SECRET_NAME_RE.test(name);
}

function hasSkillDescription(content: string): boolean {
	const fence = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content);
	if (!fence) return false;
	return /(?:^|\n)description\s*:/i.test(fence[1]!);
}

function listSkillRoots(sourceDir: string): Array<{ name: string; abs: string; rel: string }> {
	const found: Array<{ name: string; abs: string; rel: string }> = [];
	const walk = (dir: string): void => {
		let entries;
		try {
			entries = readdirSync(dir, { withFileTypes: true });
		} catch {
			return;
		}
		for (const entry of entries) {
			if (entry.name.startsWith(".")) continue;
			if (SKIP_DIR_NAMES[entry.name]) continue;
			const abs = join(dir, entry.name);
			let isDir = entry.isDirectory();
			if (entry.isSymbolicLink()) {
				try {
					isDir = statSync(abs).isDirectory();
				} catch {
					continue;
				}
			}
			if (!isDir) continue;
			const skillMd = join(abs, "SKILL.md");
			if (existsSync(skillMd) && statSync(skillMd).isFile()) {
				found.push({
					name: basename(abs),
					abs,
					rel: relative(sourceDir, abs).split(sep).join("/"),
				});
				continue;
			}
			walk(abs);
		}
	};
	walk(sourceDir);
	found.sort((a, b) => a.name.localeCompare(b.name));
	return found;
}

function collectFiles(root: string): string[] {
	const files: string[] = [];
	const walk = (dir: string): void => {
		let entries;
		try {
			entries = readdirSync(dir, { withFileTypes: true });
		} catch {
			return;
		}
		for (const entry of entries) {
			if (entry.name.startsWith(".")) continue;
			if (SKIP_DIR_NAMES[entry.name]) continue;
			const abs = join(dir, entry.name);
			if (entry.isSymbolicLink()) continue;
			if (entry.isDirectory()) {
				walk(abs);
				continue;
			}
			if (!entry.isFile()) continue;
			files.push(relative(root, abs).split(sep).join("/"));
		}
	};
	walk(root);
	files.sort();
	return files;
}

function fingerprint(root: string, files: string[]): string {
	const hash = createHash("sha256");
	for (const file of files) {
		hash.update(file);
		hash.update("\0");
		hash.update(readFileSync(join(root, file)));
		hash.update("\0");
	}
	return hash.digest("hex");
}

function destFingerprint(dest: string, files: string[]): string | undefined {
	try {
		return fingerprint(dest, files);
	} catch {
		return undefined;
	}
}

export function importHermesSkills(opts: ImportOptions): ImportReport {
	const report: ImportReport = {
		source: "skills",
		dest: "skills",
		imported: [],
		updated: [],
		unchanged: [],
		skipped: [],
		conflicted: [],
		redacted: [],
		skills: {},
	};

	if (!existsSync(opts.sourceDir)) {
		report.skipped.push({ name: "(source)", reason: "Hermes skills directory missing" });
		return report;
	}

	mkdirSync(opts.destDir, { recursive: true });
	const previous = opts.previous?.skills ?? {};
	const usedNames = new Set<string>();

	for (const root of listSkillRoots(opts.sourceDir)) {
		let name = root.name;
		if (usedNames.has(name)) name = root.rel.replaceAll("/", "-");
		if (usedNames.has(name)) {
			report.skipped.push({ name: root.rel, reason: "duplicate skill name" });
			continue;
		}
		usedNames.add(name);

		let skillMd: string;
		try {
			skillMd = readFileSync(join(root.abs, "SKILL.md"), "utf8");
		} catch {
			report.skipped.push({ name, reason: "unreadable SKILL.md" });
			continue;
		}
		if (!hasSkillDescription(skillMd)) {
			report.skipped.push({ name, reason: "SKILL.md missing description frontmatter" });
			continue;
		}

		const allFiles = collectFiles(root.abs);
		const copied: string[] = [];
		const skippedFiles: string[] = [];
		for (const file of allFiles) {
			const base = basename(file);
			if (isSecretFileName(base)) {
				report.redacted.push({ path: `${root.rel}/${file}`, reason: "secret filename" });
				skippedFiles.push(file);
				continue;
			}
			const abs = join(root.abs, file);
			let st;
			try {
				st = lstatSync(abs);
			} catch {
				skippedFiles.push(file);
				continue;
			}
			if (st.size > MAX_FILE_BYTES) {
				report.redacted.push({ path: `${root.rel}/${file}`, reason: "file too large" });
				skippedFiles.push(file);
				continue;
			}
			const ext = extname(base).toLowerCase();
			if (BODY_SCAN_EXT[ext] && st.size > 0 && st.size < 512_000) {
				try {
					const text = readFileSync(abs, "utf8");
					if (SECRET_BODY_RE.test(text)) {
						report.redacted.push({ path: `${root.rel}/${file}`, reason: "secret-like content" });
						skippedFiles.push(file);
						continue;
					}
				} catch {
					// binary
				}
			}
			copied.push(file);
		}

		if (!copied.includes("SKILL.md")) {
			report.skipped.push({ name, reason: "SKILL.md redacted or missing" });
			continue;
		}

		const sourceHash = fingerprint(root.abs, copied);
		const dest = join(opts.destDir, name);
		const prev = previous[name];

		if (existsSync(dest)) {
			const destHash = destFingerprint(dest, prev?.files ?? copied);
			if (prev && destHash && destHash !== prev.sha256) {
				report.conflicted.push({ name, reason: "destination edited since last import" });
				continue;
			}
			if (prev && prev.sha256 === sourceHash && destHash === sourceHash) {
				report.unchanged.push(name);
				report.skills[name] = prev;
				continue;
			}
			rmSync(dest, { recursive: true, force: true });
			report.updated.push(name);
		} else {
			report.imported.push(name);
		}

		for (const file of copied) {
			const from = join(root.abs, file);
			const to = join(dest, file);
			mkdirSync(dirname(to), { recursive: true });
			writeFileSync(to, readFileSync(from));
		}

		report.skills[name] = {
			name,
			hermesPath: root.rel,
			sha256: sourceHash,
			files: copied,
			skippedFiles,
		};
	}

	return report;
}

export function writeReport(destDir: string, report: ImportReport): void {
	mkdirSync(destDir, { recursive: true });
	writeFileSync(join(destDir, ".hermes-import.json"), `${JSON.stringify(report, null, "\t")}\n`);
	const kept = report.imported.length + report.updated.length + report.unchanged.length;
	const lines = [
		"# Hermes skill import",
		"",
		`One-way copy of Hermes skills (${kept} kept). \`~/.hermes\` was not modified.`,
		"Secrets and credential files were not copied.",
		"",
		`Imported: ${report.imported.length}`,
		`Updated: ${report.updated.length}`,
		`Unchanged: ${report.unchanged.length}`,
		`Skipped: ${report.skipped.length}`,
		`Conflicted: ${report.conflicted.length}`,
		`Redacted files: ${report.redacted.length}`,
		"",
		"## Skipped",
		...(report.skipped.length === 0 ? ["- (none)"] : report.skipped.map((row) => `- ${row.name}: ${row.reason}`)),
		"",
		"## Conflicted",
		...(report.conflicted.length === 0
			? ["- (none)"]
			: report.conflicted.map((row) => `- ${row.name}: ${row.reason}`)),
		"",
		"## Redacted",
		...(report.redacted.length === 0 ? ["- (none)"] : report.redacted.map((row) => `- ${row.path}: ${row.reason}`)),
		"",
	];
	writeFileSync(join(destDir, ".hermes-import-report.md"), `${lines.join("\n")}\n`);
}

export function importedSkillCount(destDir: string): number {
	const report = loadReport(join(destDir, ".hermes-import.json"));
	if (!report) return 0;
	return Object.keys(report.skills).length;
}
