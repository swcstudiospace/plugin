import type { GithubAssoc } from "./types.ts";

const SSH_RE = /^git@([^:]+):([^/]+)\/([^/]+?)(?:\.git)?\/?$/;
const HTTPS_RE = /^https?:\/\/([^/]+)\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/i;

function isGithubHost(host: string): boolean {
	const h = host.toLowerCase();
	return h === "github.com" || h === "www.github.com" || h.endsWith(".github.com");
}

export function parseGitRemote(url: string): GithubAssoc | undefined {
	const trimmed = url.trim();
	if (!trimmed) return undefined;

	const ssh = SSH_RE.exec(trimmed);
	if (ssh) {
		const host = ssh[1]!;
		const slug = `${ssh[2]}/${ssh[3]}`;
		return {
			slug,
			remoteUrl: isGithubHost(host) ? `https://${host === "www.github.com" ? "github.com" : host}/${slug}` : trimmed,
		};
	}

	const https = HTTPS_RE.exec(trimmed);
	if (https) {
		const host = https[1]!;
		const slug = `${https[2]}/${https[3]}`;
		return {
			slug,
			remoteUrl: isGithubHost(host) ? `https://${host === "www.github.com" ? "github.com" : host}/${slug}` : trimmed,
		};
	}

	return undefined;
}

function defaultGitRun(cmd: string[], cwd: string): { stdout: string; code: number } {
	const proc = Bun.spawnSync(cmd, { cwd, stdout: "pipe", stderr: "pipe" });
	return {
		stdout: proc.stdout?.toString() ?? "",
		code: proc.exitCode ?? 1,
	};
}

export function resolveGithub(
	root: string,
	run?: (cmd: string[], cwd: string) => { stdout: string; code: number },
): GithubAssoc | undefined {
	try {
		const result = (run ?? defaultGitRun)(["git", "remote", "get-url", "origin"], root);
		if (result.code !== 0) return undefined;
		return parseGitRemote(result.stdout);
	} catch {
		return undefined;
	}
}
