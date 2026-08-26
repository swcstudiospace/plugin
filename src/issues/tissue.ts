import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import type { GithubAssoc, TissueIssue } from "./types.ts";
import { TISSUE_DIR, TISSUE_MARKER, TISSUE_VERSION } from "./types.ts";

const TITLE_MAX = 80;
const CONTROL_RE = /[\u0000-\u001f\u007f]/g;
const PATH_SEP_RE = /[/\\]/g;

function sanitizeFileTitle(title: string): string {
	return title.replace(PATH_SEP_RE, "").replace(CONTROL_RE, "").trim().slice(0, TITLE_MAX);
}

export function isRepo(root: string): boolean {
	return existsSync(join(root, TISSUE_DIR, TISSUE_MARKER));
}

export function ensureRepo(root: string): void {
	const dir = join(root, TISSUE_DIR);
	mkdirSync(dir, { recursive: true });
	const marker = join(dir, TISSUE_MARKER);
	if (existsSync(marker)) return;
	writeFileSync(marker, `${JSON.stringify({ version: TISSUE_VERSION })}\n`);
}

export function issueLinks(id: string, github?: GithubAssoc): string {
	const lines = ["## Links", `- tissue: ${id}`];
	if (github) {
		if (github.remoteUrl) lines.push(`- github: ${github.remoteUrl}`);
		if (github.slug) lines.push(`- repo: ${github.slug}`);
	}
	return `${lines.join("\n")}\n`;
}

export function formatIssueBody(input: {
	title: string;
	description: string;
	github?: GithubAssoc;
	extra?: string;
}): string {
	const parts = [`# ${input.title}`];
	const description = input.description.replace(/\n+$/, "");
	if (description) parts.push(description);
	const extra = input.extra?.replace(/\n+$/, "") ?? "";
	if (extra) parts.push(extra);
	if (input.github) {
		const links = ["## Links"];
		if (input.github.remoteUrl) links.push(`- github: ${input.github.remoteUrl}`);
		if (input.github.slug) links.push(`- repo: ${input.github.slug}`);
		if (links.length > 1) parts.push(links.join("\n"));
	}
	return `${parts.join("\n")}\n`;
}

export function parseIssueFile(path: string): TissueIssue | undefined {
	try {
		const fileName = basename(path);
		if (!fileName.endsWith(".md")) return undefined;
		const dash = fileName.indexOf("-");
		if (dash <= 0) return undefined;
		const id = fileName.slice(0, dash);
		const content = readFileSync(path, "utf8");
		const nl = content.indexOf("\n");
		const first = (nl === -1 ? content : content.slice(0, nl)).replace(/\r$/, "");
		const title = first.replace(/^#\s?/, "").trimEnd();
		const rest = nl === -1 ? "" : content.slice(nl + 1);
		const description = rest.replace(/\n+$/, "");
		return {
			id,
			title,
			description,
			path: resolve(path),
			fileName,
		};
	} catch {
		return undefined;
	}
}

export function listIssues(root: string): TissueIssue[] {
	const dir = join(root, TISSUE_DIR);
	try {
		const entries = readdirSync(dir, { withFileTypes: true });
		const issues: TissueIssue[] = [];
		for (const entry of entries) {
			if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
			const parsed = parseIssueFile(join(dir, entry.name));
			if (parsed) issues.push(parsed);
		}
		issues.sort((a, b) => a.fileName.localeCompare(b.fileName));
		return issues;
	} catch {
		return [];
	}
}

export function readIssue(root: string, id: string): TissueIssue | undefined {
	const dir = join(root, TISSUE_DIR);
	let names: string[];
	try {
		names = readdirSync(dir);
	} catch {
		return undefined;
	}
	const prefix = `${id}-`;
	const name = names.find((entry) => entry.startsWith(prefix) && entry.endsWith(".md"));
	if (!name) return undefined;
	return parseIssueFile(join(dir, name));
}

export function createIssue(
	root: string,
	title: string,
	description: string,
	opts?: { now?: () => number },
): TissueIssue {
	ensureRepo(root);
	const now = opts?.now ?? Date.now;
	const id = now().toString(36);
	const fileName = `${id}-${sanitizeFileTitle(title)}.md`;
	const path = resolve(join(root, TISSUE_DIR, fileName));
	writeFileSync(path, formatIssueBody({ title, description }));
	return {
		id,
		title,
		description,
		path,
		fileName,
	};
}
