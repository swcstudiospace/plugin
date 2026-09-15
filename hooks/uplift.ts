#!/usr/bin/env bun
/**
 * Claude Code UserPromptSubmit hook entry (and `--ctl` control CLI).
 *
 * stdin: hook JSON from Claude Code. stdout: hook JSON with additionalContext.
 * Always exits 0 so the user's prompt is never blocked by a plugin failure.
 */
import { claudeConfigPaths, loadConfig } from "../src/config.ts";
import { formatIssueEcho, formatIssueList } from "../src/issues/format.ts";
import { resolveGithub } from "../src/issues/github.ts";
import { defaultKtuiRunner } from "../src/issues/kanban.ts";
import { listIssues } from "../src/issues/tissue.ts";
import { syncAllIssues } from "../src/issues/track.ts";
import { formatThinkEcho } from "../src/think/format.ts";
import { createClaudeCompleter, isChildInvocation } from "../src/claude/complete.ts";
import { runPromptSubmit, type PromptSubmitInput } from "../src/claude/hook.ts";
import { defaultStateDir, readControl, readLast, writeControl } from "../src/claude/state.ts";
import { recentConversationFromTranscript } from "../src/claude/transcript.ts";

function log(message: string): void {
	if (process.env.AIO_DEBUG === "1") process.stderr.write(`[aio] ${message}\n`);
}

async function readStdin(): Promise<string> {
	try {
		return await new Response(Bun.stdin.stream()).text();
	} catch {
		return "";
	}
}

function parseInput(raw: string): PromptSubmitInput {
	try {
		const parsed: unknown = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? (parsed as PromptSubmitInput) : {};
	} catch {
		return {};
	}
}

async function control(args: string[]): Promise<string> {
	const cwd = process.cwd();
	const stateDir = defaultStateDir();
	const config = loadConfig(claudeConfigPaths(cwd));
	const [scope, verb] = args[0] === "think" || args[0] === "issues" ? [args[0], args[1] ?? "status"] : ["uplift", args[0] ?? "status"];
	const state = readControl(stateDir);
	const flag = (value: boolean | undefined, fallback: boolean): string => ((value ?? fallback) ? "on" : "off");

	if (scope === "issues") {
		switch (verb) {
			case "list":
				return formatIssueList(listIssues(cwd));
			case "sync": {
				const results = await syncAllIssues(cwd, defaultKtuiRunner(config.issues.ktuiBin), config.issues.boardName, resolveGithub(cwd));
				return [`Synced ${results.length} issue${results.length === 1 ? "" : "s"}`, ...results.map(formatIssueEcho)].join("\n");
			}
			case "on":
			case "off":
				writeControl(stateDir, { issuesEnabled: verb === "on" });
				return `Issue tracking ${verb}`;
			default: {
				const last = readLast(stateDir);
				const lines = [`Issue tracking ${flag(state.issuesEnabled, config.issues.enabled)}`, `Board: ${config.issues.boardName}`];
				if (last?.last) lines.push(formatIssueEcho(last.last));
				return lines.join("\n");
			}
		}
	}
	if (scope === "think") {
		switch (verb) {
			case "on":
			case "off":
				writeControl(stateDir, { thinkEnabled: verb === "on" });
				return `Graph of Thought ${verb}`;
			case "last": {
				const last = readLast(stateDir);
				return last?.graph ? formatThinkEcho(last.graph) : "No thought graph recorded yet";
			}
			default:
				return `Graph of Thought ${flag(state.thinkEnabled, config.think.enabled)}`;
		}
	}
	switch (verb) {
		case "on":
		case "off":
			writeControl(stateDir, { enabled: verb === "on" });
			return `Prompt Uplift ${verb}`;
		case "skip":
			writeControl(stateDir, { skipOnce: true });
			return "Prompt Uplift will skip the next prompt";
		case "last": {
			const last = readLast(stateDir);
			return last ? `${last.result.root} · ${last.result.source}\n\n${last.result.xml}` : "No uplift recorded yet";
		}
		default: {
			const last = readLast(stateDir);
			const lines = [
				`Prompt Uplift ${flag(state.enabled, config.uplift.enabled)}${state.skipOnce ? " (skipping next prompt)" : ""}`,
				`Graph of Thought ${flag(state.thinkEnabled, config.think.enabled)}`,
				`Issue tracking ${flag(state.issuesEnabled, config.issues.enabled)} · board ${config.issues.boardName}`,
				`Model: ${config.claude.model || "session default"} · concurrency ${config.claude.concurrency}`,
				`State: ${stateDir}`,
			];
			if (last) lines.push(`Last: ${last.result.root} · ${last.result.source}${last.graph ? ` · ${last.graph.nodes.length} nodes` : ""}`);
			return lines.join("\n");
		}
	}
}

async function main(): Promise<void> {
	const argv = process.argv.slice(2);
	if (argv[0] === "--ctl") {
		process.stdout.write(`${await control(argv.slice(1))}\n`);
		return;
	}
	if (isChildInvocation()) return;

	const input = parseInput(await readStdin());
	if (input.hook_event_name && input.hook_event_name !== "UserPromptSubmit") return;
	const cwd = input.cwd?.trim() || process.cwd();
	const config = loadConfig(claudeConfigPaths(cwd));
	const stateDir = defaultStateDir();

	const result = await runPromptSubmit(input, {
		config,
		control: readControl(stateDir),
		complete: createClaudeCompleter({
			bin: config.claude.bin,
			model: config.claude.model || undefined,
			settingSources: config.claude.settingSources,
			thinking: config.claude.thinking,
			cwd,
			timeoutMs: config.claude.callTimeoutMs,
		}),
		ktui: defaultKtuiRunner(config.issues.ktuiBin),
		stateDir,
		github: resolveGithub,
		conversation: recentConversationFromTranscript,
		log,
	});
	if (result.skipped) log(`skipped: ${result.skipped}`);
	if (result.output) process.stdout.write(JSON.stringify(result.output));
}

main().catch((error) => {
	log(`fatal: ${error instanceof Error ? error.message : String(error)}`);
	process.exit(0);
});
