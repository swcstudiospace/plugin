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
	const owner = input.tool_input?.owner;
	const repo = input.tool_input?.repo;
	if (!result || typeof prNumber !== "number" || !owner || !repo) return;

	const cwd = input.cwd?.trim() || process.cwd();
	const config = loadConfig(claudeConfigPaths(cwd)).notion;
	if (!config.enabled || !config.parentPageId) return;

	const apiKey = process.env[config.apiKeyEnv];
	if (!apiKey) return;

	try {
		const client = createNotion({ apiKey });
		await syncPrReviewed(client, {
			parentPageId: config.parentPageId,
			repoSlug: `${owner}/${repo}`,
			prNumber,
			merged: result.merged,
			gate: { ok: result.ok, confidence: result.review?.confidence },
		});
	} catch {
		// fail-open
	}
}

main().catch(() => process.exit(0));
