#!/usr/bin/env bun
/**
 * Claude Code PostToolUse hook (matcher: the merge-with-review tool this plugin's own
 * "aio" MCP server registers): update the PR's Notion row with the merge/review
 * outcome, whether or not the merge gate passed. Silent and fail-open.
 */
import { claudeConfigPaths, loadConfig } from "../src/config.ts";
import { isChildInvocation } from "../src/claude/complete.ts";
import { createNotion } from "../src/notion/client.ts";
import { syncPrReviewed } from "../src/notion/sync.ts";
import { createGithub } from "../src/mcp/github.ts";
import { defaultCliRunner } from "../src/mcp/run.ts";

interface McpTextBlock {
	type?: string;
	text?: string;
}

interface MergeResult {
	ok: boolean;
	merged: boolean;
	reason: string;
	review?: { confidence: number };
}

interface HookInput {
	tool_name?: string;
	tool_input?: { number?: number; owner?: string; repo?: string };
	tool_response?: McpTextBlock[];
	cwd?: string;
}

function parseMergeResult(response: HookInput["tool_response"]): MergeResult | undefined {
	const text = Array.isArray(response) ? response[0]?.text : undefined;
	if (typeof text !== "string") return undefined;
	try {
		return JSON.parse(text) as MergeResult;
	} catch {
		return undefined;
	}
}

async function main(): Promise<void> {
	if (isChildInvocation()) return;
	let input: HookInput = {};
	try {
		input = JSON.parse(await new Response(Bun.stdin.stream()).text()) as HookInput;
	} catch {
		return;
	}

	const result = parseMergeResult(input.tool_response);
	const prNumber = input.tool_input?.number;
	if (!result || typeof prNumber !== "number") return;

	const cwd = input.cwd?.trim() || process.cwd();
	const fullConfig = loadConfig(claudeConfigPaths(cwd));
	const config = fullConfig.notion;
	if (!config.enabled || !config.parentPageId) return;

	const apiKey = process.env[config.apiKeyEnv];
	if (!apiKey) return;

	try {
		let owner = input.tool_input?.owner;
		let repo = input.tool_input?.repo;
		if (!owner || !repo) {
			// github_merge_pull_request's owner/repo are optional — the tool itself
			// falls back to the current gh repo via resolveOwnerRepo (src/mcp/github.ts).
			// Mirror that fallback so this hook still syncs on the natural, documented
			// call `github_merge_pull_request({ number })`.
			const current = await createGithub({ run: defaultCliRunner }).currentRepo(cwd);
			if (!current.ok) return;
			owner = owner || current.owner;
			repo = repo || current.repo;
		}

		const client = createNotion({ apiKey });
		await syncPrReviewed(client, {
			parentPageId: config.parentPageId,
			repoSlug: `${owner}/${repo}`,
			prNumber,
			merged: result.merged,
			gate: { confidence: result.review?.confidence, minConfidence: fullConfig.greptile.minConfidence },
		});
	} catch {
		// fail-open
	}
}

main().catch(() => process.exit(0));
