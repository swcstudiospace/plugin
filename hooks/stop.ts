#!/usr/bin/env bun
/**
 * Claude Code Stop hook: when the agent finishes a turn, move the cards this
 * session opened on the kanban board to the done lane. Silent and fail-open.
 */
import { claudeConfigPaths, loadConfig } from "../src/config.ts";
import { defaultKtuiRunner } from "../src/issues/kanban.ts";
import { advanceTrackedIssues } from "../src/issues/track.ts";
import { isChildInvocation } from "../src/claude/complete.ts";
import { defaultStateDir, readSession, writeSession } from "../src/claude/state.ts";

async function main(): Promise<void> {
	if (isChildInvocation()) return;
	let input: { session_id?: string; cwd?: string; stop_hook_active?: boolean } = {};
	try {
		input = JSON.parse(await new Response(Bun.stdin.stream()).text()) as typeof input;
	} catch {
		return;
	}
	if (input.stop_hook_active || !input.session_id) return;
	const stateDir = defaultStateDir();
	const record = readSession(stateDir, input.session_id);
	if (!record || record.lane === "done" || (!record.tree && !record.last)) return;
	const config = loadConfig(claudeConfigPaths(input.cwd?.trim() || process.cwd()));
	await advanceTrackedIssues({
		run: defaultKtuiRunner(config.issues.ktuiBin),
		boardName: config.issues.boardName,
		lane: "done",
		tree: record.tree,
		last: record.last,
	});
	writeSession(stateDir, { ...record, lane: "done" });
}

main().catch(() => process.exit(0));
