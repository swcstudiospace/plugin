#!/usr/bin/env bun
/**
 * Claude Code UserPromptSubmit hook entry (and `--ctl` control CLI).
 *
 * stdin: hook JSON from Claude Code. stdout: hook JSON with additionalContext.
 * Always exits 0 so the user's prompt is never blocked by a plugin failure.
 */
import { claudeConfigPaths, loadConfig, type AioConfig } from "../src/config.ts";
import { grokAuthStatusFresh, redactSecrets } from "../src/grok/auth.ts";
import { createGrokCompleter } from "../src/grok/complete.ts";
import { formatHitlEcho } from "../src/hitl/format.ts";
import { formatIssueEcho, formatIssueList } from "../src/issues/format.ts";
import { resolveGithub } from "../src/issues/github.ts";
import { defaultKtuiRunner } from "../src/issues/kanban.ts";
import { listIssues } from "../src/issues/tissue.ts";
import { syncAllIssues } from "../src/issues/track.ts";
import { formatThinkEcho } from "../src/think/format.ts";
import { type ClaudeCompleter, createClaudeCompleter, isChildInvocation } from "../src/claude/complete.ts";
import { runPromptSubmit, type PromptSubmitInput } from "../src/claude/hook.ts";
import { type ControlState, defaultStateDir, readControl, readLast, writeControl } from "../src/claude/state.ts";
import { recentConversationFromTranscript } from "../src/claude/transcript.ts";

const CTL_SCOPES = ["think", "issues", "hitl", "grok"] as const;
type CtlScope = (typeof CTL_SCOPES)[number] | "uplift";

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

interface Engine {
	label: string;
	complete: ClaudeCompleter;
	/** First error the completer threw, redacted; undefined until one happens. */
	error: () => string | undefined;
}

/** Grok selected but nobody is logged in and fallback is off: fail visibly, never swap silently. */
const GROK_LOGIN_REQUIRED = "Prompt Uplift skipped · Grok 4.6 login required (run `grok login`)";

function captureFirstError(label: string, complete: ClaudeCompleter): Engine {
	let first: string | undefined;
	return {
		label,
		complete: async (system, user, signal) => {
			try {
				return await complete(system, user, signal);
			} catch (error) {
				first ??= redactSecrets(error instanceof Error ? error.message : String(error));
				throw error;
			}
		},
		error: () => first,
	};
}

function claudeEngine(config: AioConfig, cwd: string, suffix = ""): Engine {
	return captureFirstError(
		`claude:${config.claude.model || "session default"}${suffix}`,
		createClaudeCompleter({
			bin: config.claude.bin,
			model: config.claude.model || undefined,
			settingSources: config.claude.settingSources,
			thinking: config.claude.thinking,
			cwd,
			timeoutMs: config.claude.callTimeoutMs,
		}),
	);
}

async function selectEngine(config: AioConfig, state: ControlState, cwd: string): Promise<Engine | { skipped: string }> {
	const engine = state.engine ?? config.think.engine;
	if (engine !== "grok" || !config.grok.enabled) return claudeEngine(config, cwd);
	const auth = await grokAuthStatusFresh({ home: config.grok.home || undefined, bin: config.grok.bin });
	if (!auth.loggedIn || auth.expired) {
		if (config.grok.fallbackToClaude) return claudeEngine(config, cwd, " (grok fallback)");
		return { skipped: GROK_LOGIN_REQUIRED };
	}
	return captureFirstError(
		`${config.grok.model}@${config.grok.reasoningEffort}`,
		createGrokCompleter({
			baseUrl: config.grok.baseUrl,
			model: config.grok.model,
			reasoningEffort: config.grok.reasoningEffort,
			timeoutMs: config.grok.callTimeoutMs,
			home: config.grok.home || undefined,
			transport: config.grok.transport,
			bin: config.grok.bin,
			cwd,
		}),
	);
}

function engineLabel(config: AioConfig, state: ControlState): string {
	const engine = state.engine ?? config.think.engine;
	return engine === "grok" && config.grok.enabled
		? `${config.grok.model}@${config.grok.reasoningEffort}`
		: `claude:${config.claude.model || "session default"}`;
}

async function grokOauthLine(config: AioConfig): Promise<string> {
	const auth = await grokAuthStatusFresh({ home: config.grok.home || undefined, bin: config.grok.bin });
	if (!auth.loggedIn) return "SuperGrok OAuth: not logged in (run grok login)";
	if (auth.expired) return "SuperGrok OAuth: expired (run grok login)";
	return `SuperGrok OAuth: ${auth.email ?? "logged in"}${auth.expiresAt ? ` · expires ${auth.expiresAt}` : ""}`;
}

async function proxyLine(config: AioConfig): Promise<string> {
	const { host, port, upstream } = config.grok.proxy;
	const url = `http://${host}:${port}`;
	try {
		const res = await fetch(`${url}/healthz`, { signal: AbortSignal.timeout(1500) });
		if (res.ok) return `Proxy: listening on ${url} → ${upstream}`;
	} catch {
		// not reachable
	}
	return `Proxy: not reachable on ${url}`;
}

async function control(args: string[]): Promise<string> {
	const cwd = process.cwd();
	const stateDir = defaultStateDir();
	const config = loadConfig(claudeConfigPaths(cwd));
	const [scope, verb, arg]: [CtlScope, string, string | undefined] = (CTL_SCOPES as readonly string[]).includes(args[0] ?? "")
		? [args[0] as CtlScope, args[1] ?? "status", args[2]]
		: ["uplift", args[0] ?? "status", args[1]];
	const state = readControl(stateDir);
	const flag = (value: boolean | undefined, fallback: boolean): string => ((value ?? fallback) ? "on" : "off");

	if (scope === "hitl") {
		switch (verb) {
			case "on":
			case "off":
				writeControl(stateDir, { hitlEnabled: verb === "on" });
				return `HITL clarifications ${verb}`;
			case "last":
				return formatHitlEcho(readLast(stateDir)?.clarifications ?? []);
			default:
				return `HITL clarifications ${flag(state.hitlEnabled, config.hitl.enabled)} · max ${config.hitl.maxQuestions}`;
		}
	}
	if (scope === "grok") {
		switch (verb) {
			case "engine": {
				if (arg !== "grok" && arg !== "claude") return "Usage: grok engine grok|claude";
				writeControl(stateDir, { engine: arg });
				return `Thinking engine set to ${engineLabel(config, { ...state, engine: arg })}`;
			}
			case "proxy":
				return proxyLine(config);
			default:
				return [
					`Engine: ${engineLabel(config, state)}`,
					await grokOauthLine(config),
					await proxyLine(config),
					`Haiku-tier model: ${config.grok.proxy.haikuModel}`,
				].join("\n");
		}
	}

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
				`Engine: ${engineLabel(config, state)}`,
				await grokOauthLine(config),
				`Graph of Thought ${flag(state.thinkEnabled, config.think.enabled)}`,
				`HITL clarifications ${flag(state.hitlEnabled, config.hitl.enabled)} · max ${config.hitl.maxQuestions}`,
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
	const state = readControl(stateDir);
	const engine = await selectEngine(config, state, cwd);
	if ("skipped" in engine) {
		log("skipped: grok engine selected but not logged in (fallbackToClaude=false)");
		process.stdout.write(JSON.stringify({ systemMessage: engine.skipped }));
		return;
	}

	const result = await runPromptSubmit(input, {
		config,
		control: state,
		complete: engine.complete,
		engine: engine.label,
		engineError: engine.error,
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
