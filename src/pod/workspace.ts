import { mkdirSync } from "node:fs";
import { basename, resolve, sep } from "node:path";
import type { WrapBashOpts } from "./types.ts";

export function workspaceIdFor(cwd: string): string {
	const slug = basename(cwd)
		.toLowerCase()
		.replace(/[^a-z0-9-]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
	const id = `omp-${slug || "workspace"}`;
	return id.slice(0, 40).replace(/-$/, "");
}

export function upArgs(source: string, id: string): string[] {
	return [source, "--id", id, "--open-ide=false"];
}

export function parseLocalFolder(listJson: string, id: string): string | undefined {
	try {
		const parsed: unknown = JSON.parse(listJson);
		const rows = Array.isArray(parsed) ? parsed : [];
		for (const row of rows) {
			if (!row || typeof row !== "object") continue;
			const rec = row as Record<string, unknown>;
			if (rec.id !== id) continue;
			const source = rec.source;
			if (!source || typeof source !== "object") continue;
			const folder = (source as Record<string, unknown>).localFolder;
			if (typeof folder === "string" && folder) return folder;
		}
	} catch {
		return undefined;
	}
	return undefined;
}

export function wrapBashCommand(command: string, opts: WrapBashOpts): string {
	if (command.trim().startsWith(opts.bin)) return command;
	return `${opts.bin} ssh ${opts.id} --command ${command}`;
}

export function isAllowedPath(absPath: string, roots: string[]): boolean {
	const resolved = resolve(absPath);
	for (const root of roots) {
		const r = resolve(root);
		if (resolved === r || resolved.startsWith(r + sep)) return true;
	}
	return false;
}

export function ensureExtraDirs(cwd: string, extraDirs: string[]): string[] {
	const out: string[] = [];
	for (const dir of extraDirs) {
		if (!dir.trim()) continue;
		const abs = resolve(cwd, dir);
		mkdirSync(abs, { recursive: true });
		out.push(abs);
	}
	return out;
}
