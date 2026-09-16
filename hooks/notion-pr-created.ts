#!/usr/bin/env bun
/**
 * Claude Code PostToolUse hook (matcher: the PR-creation tool this plugin's own
 * "aio" MCP server registers): mirror the new PR, plus every not-yet-synced
 * Tissue issue for its repo, into the Notion "PRs" database. Silent and fail-open.
 *
 * `github_create_pull_request`'s tool_response only carries `{ok, htmlUrl}` (see
 * `createPull` in src/mcp/github.ts) — the PR number, title and branches aren't in
 * it, so this hook follows up with its own `getPull` call to fetch the full record.
 */
import { claudeConfigPaths, loadConfig } from "../src/config.ts";
import { isChildInvocation } from "../src/claude/complete.ts";
import { createNotion } from "../src/notion/client.ts";
import { syncPrCreated } from "../src/notion/sync.ts";
import { createGithub } from "../src/mcp/github.ts";
import { defaultCliRunner } from "../src/mcp/run.ts";

interface McpTextBlock {
	type?: string;
	text?: string;
}

interface CreatePullResponse {
	ok?: boolean;
	htmlUrl?: string;
}

interface HookInput {
	tool_name?: string;
	tool_input?: { owner?: string; repo?: string };
	tool_response?: McpTextBlock[];
	cwd?: string;
}

function parseCreatePullResponse(response: HookInput["tool_response"]): CreatePullResponse | undefined {
	const text = Array.isArray(response) ? response[0]?.text : undefined;
	if (typeof text !== "string") return undefined;
	try {
		return JSON.parse(text) as CreatePullResponse;
	} catch {
		return undefined;
	}
}

function prNumberFromUrl(htmlUrl: string): number | undefined {
	const match = /\/pull\/(\d+)\/?$/.exec(htmlUrl);
	return match ? Number(match[1]) : undefined;
}

function repoSlugFromUrl(htmlUrl: string): { owner: string; repo: string } | undefined {
	const match = /github\.com\/([^/]+)\/([^/]+)\/pull\//.exec(htmlUrl);
	return match ? { owner: match[1], repo: match[2] } : undefined;
}

async function main(): Promise<void> {
	if (isChildInvocation()) return;
	let input: HookInput = {};
	try {
		input = JSON.parse(await new Response(Bun.stdin.stream()).text()) as HookInput;
	} catch {
		return;
	}

	const created = parseCreatePullResponse(input.tool_response);
	if (!created?.ok || !created.htmlUrl) return;

	const number = prNumberFromUrl(created.htmlUrl);
	if (!number) return;

	const fromUrl = repoSlugFromUrl(created.htmlUrl);
	const owner = input.tool_input?.owner || fromUrl?.owner;
	const repo = input.tool_input?.repo || fromUrl?.repo;
	if (!owner || !repo) return;

	const cwd = input.cwd?.trim() || process.cwd();
	const config = loadConfig(claudeConfigPaths(cwd)).notion;
	if (!config.enabled || !config.parentPageId) return;

	const apiKey = process.env[config.apiKeyEnv];
	if (!apiKey) return;

	try {
		const github = createGithub({ run: defaultCliRunner });
		const fetched = await github.getPull({ number, owner, repo });
		if (!fetched.ok) return;

		const client = createNotion({ apiKey });
		await syncPrCreated(client, {
			root: cwd,
			parentPageId: config.parentPageId,
			pr: {
				number: fetched.pull.number,
				title: fetched.pull.title,
				htmlUrl: fetched.pull.htmlUrl,
				repoSlug: `${owner}/${repo}`,
				headRef: fetched.pull.headRef,
				baseRef: fetched.pull.baseRef,
			},
		});
	} catch {
		// fail-open
	}
}

main().catch(() => process.exit(0));
