import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defaultConfig } from "../config.ts";
import { clarifySystemPrompt } from "../hitl/prompts.ts";
import type { Clarification } from "../hitl/types.ts";
import type { KtuiRunner } from "../issues/kanban.ts";
import { COT_SYSTEM_PROMPT, GRAPH_SYSTEM_PROMPT } from "../think/prompts.ts";
import { UPLIFT_SYSTEM_PROMPT } from "../uplift/prompt.ts";
import { runPromptSubmit } from "./hook.ts";
import { readControl, readLast, readSession, writeControl, writeSession } from "./state.ts";

const dirs: string[] = [];
function tempDir(prefix: string): string {
	const dir = mkdtempSync(join(tmpdir(), prefix));
	dirs.push(dir);
	return dir;
}
afterEach(() => {
	for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const noKtui: KtuiRunner = async () => {
	throw new Error("ktui not found");
};

function graphJson(): string {
	return JSON.stringify({
		goal: "Ship the login page",
		nodes: [
			{ id: "n1", title: "Understand", kind: "understand", question: "q1", depends_on: [] },
			{ id: "n2", title: "Options", kind: "generate", question: "q2", depends_on: ["n1"] },
			{ id: "n3", title: "Plan", kind: "synthesize", question: "q3", depends_on: ["n2"] },
		],
	});
}

function clarifyJson(): string {
	return JSON.stringify({
		questions: [
			{
				id: "q1",
				question: "Which auth provider should the login page use?",
				header: "Auth",
				why: "Determines the SDK and callback routes",
				options: [
					{ label: "Supabase", description: "already configured" },
					{ label: "Custom JWT", description: "more code" },
				],
				default: "Supabase",
				blocking: true,
			},
			{
				id: "q2",
				question: "Should the page support magic links?",
				header: "Magic links",
				why: "Adds an email flow",
				options: [{ label: "No" }, { label: "Yes" }],
				default: "No",
				blocking: false,
			},
		],
	});
}

const CLARIFY_PROMPT = clarifySystemPrompt(defaultConfig().hitl.maxQuestions);

function fakeComplete(calls: string[]) {
	return async (system: string, user: string): Promise<string> => {
		calls.push(system);
		if (system === UPLIFT_SYSTEM_PROMPT) {
			return `<BUILD_PROMPT><ORIGINAL>build a login page</ORIGINAL><SCOPE>login</SCOPE><CONTEXT>${user.includes("<conversation>") ? "with-conv" : "no-conv"}</CONTEXT></BUILD_PROMPT>`;
		}
		if (system === GRAPH_SYSTEM_PROMPT) return graphJson();
		if (system === COT_SYSTEM_PROMPT) {
			const id = user.match(/current_node id="([^"]+)"/)?.[1] ?? "?";
			return `<node><thinking>t</thinking><conclusion>done ${id}</conclusion></node>`;
		}
		if (system === CLARIFY_PROMPT) return clarifyJson();
		throw new Error(`unexpected system prompt`);
	};
}

describe("runPromptSubmit", () => {
	test("full path: uplift, graph, per-node CoT, parent + sub-issues, context and summary", async () => {
		const cwd = tempDir("aio-hook-cwd-");
		const stateDir = join(tempDir("aio-hook-state-"), "aio");
		const calls: string[] = [];
		const logs: string[] = [];
		const config = defaultConfig();
		const out = await runPromptSubmit(
			{ session_id: "s1", cwd, prompt: "build a login page", transcript_path: "/nope" },
			{
				config,
				control: {},
				complete: fakeComplete(calls),
				engine: "test-engine",
				ktui: noKtui,
				stateDir,
				conversation: () => "User: earlier context",
				log: (m) => logs.push(m),
			},
		);

		expect(out.skipped).toBeUndefined();
		expect(calls.filter((s) => s === UPLIFT_SYSTEM_PROMPT)).toHaveLength(1);
		expect(calls.filter((s) => s === GRAPH_SYSTEM_PROMPT)).toHaveLength(1);
		expect(calls.filter((s) => s === COT_SYSTEM_PROMPT)).toHaveLength(3);
		expect(calls.filter((s) => s === CLARIFY_PROMPT)).toHaveLength(1);
		expect(logs.some((m) => m.startsWith("Clarifications"))).toBe(true);

		const ctx = out.output?.hookSpecificOutput.additionalContext ?? "";
		expect(out.output?.hookSpecificOutput.hookEventName).toBe("UserPromptSubmit");
		expect(ctx).toContain("<CONTEXT>with-conv</CONTEXT>");
		expect(ctx).toContain("<GRAPH_OF_THOUGHT>");
		expect(ctx).toContain("done n3");
		expect(ctx).toContain("## Clarifications (HITL)");
		expect(ctx).toContain("<CLARIFICATIONS");
		expect(ctx).toContain("Which auth provider should the login page use?");
		expect(ctx).toContain("## Issue tracking");
		expect(out.output?.systemMessage).toContain("Prompt Uplift · BUILD_PROMPT · llm");
		expect(out.output?.systemMessage).toContain("test-engine");
		expect(out.output?.systemMessage).toContain("3 nodes");
		expect(out.output?.systemMessage).toContain("HITL · 2 question(s)");
		expect(out.output?.systemMessage).toContain("Kanban skipped");

		const files = readdirSync(join(cwd, "issues")).filter((f) => f.endsWith(".md")).sort();
		expect(files).toHaveLength(4);
		const parent = files.find((f) => f.includes("Ship the login page"));
		expect(parent).toBeDefined();
		const parentBody = readFileSync(join(cwd, "issues", parent!), "utf8");
		expect(parentBody).toContain("## Graph of Thought");
		expect(parentBody).toContain("| n1 | Understand | understand |");
		const child = files.find((f) => f.includes("[n2] Options"));
		expect(readFileSync(join(cwd, "issues", child!), "utf8")).toContain("done n2");
		expect(ctx).toContain(`parent ${out.record?.tree?.parent.issue.id}`);
		expect(ctx).toContain("child");

		const record = readSession(stateDir, "s1");
		expect(record?.graph?.nodes).toHaveLength(3);
		expect(record?.engine).toBe("test-engine");
		expect(record?.clarifications).toHaveLength(2);
		expect(record?.clarifications?.[0]?.blocking).toBe(true);
		expect(record?.result.xml).toContain("<CLARIFICATIONS");
		expect(record?.lane).toBe("doing");
		expect(readLast(stateDir)?.sessionId).toBe("s1");
		expect(existsSync(join(stateDir, "sessions", "s1.xml"))).toBe(true);
	});

	test("skips slash commands, trivial replies, disabled state, and consumes skipOnce", async () => {
		const cwd = tempDir("aio-hook-cwd-");
		const stateDir = join(tempDir("aio-hook-state-"), "aio");
		const calls: string[] = [];
		const deps = { config: defaultConfig(), control: {}, complete: fakeComplete(calls), engine: "test-engine", ktui: noKtui, stateDir };

		expect((await runPromptSubmit({ cwd, prompt: "/help" }, deps)).skipped).toBe("skip");
		expect((await runPromptSubmit({ cwd, prompt: "ok" }, deps)).skipped).toBe("skip");
		expect((await runPromptSubmit({ cwd, prompt: "raw: keep this" }, deps)).skipped).toBe("passthrough");
		expect((await runPromptSubmit({ cwd, prompt: "do work" }, { ...deps, control: { enabled: false } })).skipped).toBe("skip");

		writeControl(stateDir, { skipOnce: true });
		expect((await runPromptSubmit({ cwd, prompt: "do work" }, { ...deps, control: readControl(stateDir) })).skipped).toBe("skip");
		expect(readControl(stateDir).skipOnce).toBe(false);
		expect(calls).toHaveLength(0);
		expect(existsSync(join(cwd, "issues"))).toBe(false);
	});

	test("think off yields a single tracked issue; issues off writes nothing", async () => {
		const cwd = tempDir("aio-hook-cwd-");
		const stateDir = join(tempDir("aio-hook-state-"), "aio");
		const calls: string[] = [];
		const base = { config: defaultConfig(), complete: fakeComplete(calls), engine: "test-engine", ktui: noKtui, stateDir };

		const single = await runPromptSubmit({ session_id: "s2", cwd, prompt: "build a login page" }, { ...base, control: { thinkEnabled: false } });
		expect(calls.filter((s) => s === GRAPH_SYSTEM_PROMPT)).toHaveLength(0);
		expect(single.output?.hookSpecificOutput.additionalContext).toContain("tracked as issue");
		expect(readdirSync(join(cwd, "issues")).filter((f) => f.endsWith(".md"))).toHaveLength(1);

		const cwd2 = tempDir("aio-hook-cwd-");
		const none = await runPromptSubmit({ session_id: "s3", cwd: cwd2, prompt: "build a login page" }, { ...base, control: { issuesEnabled: false } });
		expect(none.output?.hookSpecificOutput.additionalContext).not.toContain("## Issue tracking");
		expect(existsSync(join(cwd2, "issues"))).toBe(false);
	});

	test("llm failure falls back to the heuristic uplift instead of skipping", async () => {
		const cwd = tempDir("aio-hook-cwd-");
		const stateDir = join(tempDir("aio-hook-state-"), "aio");
		const out = await runPromptSubmit(
			{ session_id: "s4", cwd, prompt: "build a login page" },
			{
				config: defaultConfig(),
				control: { thinkEnabled: false, issuesEnabled: false },
				complete: async () => {
					throw new Error("claude exited 1");
				},
				engine: "test-engine",
				engineError: () => "claude exited 1",
				ktui: noKtui,
				stateDir,
			},
		);
		expect(out.record?.result.source).toBe("fallback");
		expect(out.output?.systemMessage).toContain("fallback");
		expect(out.output?.systemMessage).toContain("Engine error · claude exited 1");
	});

	test("answered clarifications from a prior record carry forward; stale open ones are dropped", async () => {
		const cwd = tempDir("aio-hook-cwd-");
		const stateDir = join(tempDir("aio-hook-state-"), "aio");
		const calls: string[] = [];
		const answered: Clarification = {
			id: "q1",
			question: "Which auth provider should the login page use?",
			header: "Auth",
			why: "Determines the SDK",
			options: [{ label: "Supabase" }, { label: "Custom JWT" }],
			default: "Supabase",
			blocking: true,
			answer: "Custom JWT",
			answeredAt: 1,
			source: "user",
		};
		const stale: Clarification = { ...answered, id: "q9", question: "Stale open question?", answer: undefined };
		writeSession(stateDir, {
			sessionId: "s5",
			at: 1,
			result: { xml: "<BUILD_PROMPT><ORIGINAL>old</ORIGINAL></BUILD_PROMPT>", original: "old", root: "BUILD_PROMPT", source: "llm" },
			clarifications: [answered, stale],
		});

		let seenAnswered: Clarification[] | undefined;
		const out = await runPromptSubmit(
			{ session_id: "s5", cwd, prompt: "build a login page" },
			{
				config: defaultConfig(),
				control: { thinkEnabled: false, issuesEnabled: false },
				complete: fakeComplete(calls),
				engine: "test-engine",
				ktui: noKtui,
				stateDir,
				clarify: async (opts) => {
					seenAnswered = opts.answered;
					return JSON.parse(clarifyJson()).questions as Clarification[];
				},
			},
		);

		expect(seenAnswered?.map((c) => c.id)).toEqual(["q1"]);
		const ids = out.record?.clarifications?.map((c) => c.question) ?? [];
		expect(ids).toEqual(["Which auth provider should the login page use?", "Should the page support magic links?"]);
		expect(out.record?.clarifications?.[0]?.answer).toBe("Custom JWT");
		const ctx = out.output?.hookSpecificOutput.additionalContext ?? "";
		expect(ctx).toContain("Answered");
		expect(ctx).toContain("Custom JWT");
		expect(ctx).not.toContain("Stale open question?");
		expect(out.output?.systemMessage).toContain("HITL · 1 question(s)");
	});

	test("hitlEnabled false in control skips the clarify call", async () => {
		const cwd = tempDir("aio-hook-cwd-");
		const stateDir = join(tempDir("aio-hook-state-"), "aio");
		const calls: string[] = [];
		const out = await runPromptSubmit(
			{ session_id: "s6", cwd, prompt: "build a login page" },
			{
				config: defaultConfig(),
				control: { hitlEnabled: false, issuesEnabled: false },
				complete: fakeComplete(calls),
				engine: "test-engine",
				ktui: noKtui,
				stateDir,
			},
		);
		expect(calls.filter((s) => s === CLARIFY_PROMPT)).toHaveLength(0);
		expect(calls.filter((s) => s === GRAPH_SYSTEM_PROMPT)).toHaveLength(1);
		expect(out.record?.clarifications).toEqual([]);
		expect(out.output?.hookSpecificOutput.additionalContext).not.toContain("## Clarifications (HITL)");
		expect(out.output?.systemMessage).not.toContain("HITL ·");
	});
});
