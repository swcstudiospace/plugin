import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	CLAUDE_USER_PROMPT_HOOK_TIMEOUT_SEC,
	DEFAULT_CLAUDE_CONFIG,
	claudeConfigPaths,
	defaultConfig,
	loadConfig,
} from "./config.ts";
import { DEFAULT_GROK_CONFIG } from "./grok/types.ts";
import { DEFAULT_HITL_CONFIG } from "./hitl/types.ts";
import { DEFAULT_BOARD_NAME } from "./issues/types.ts";
import { DEFAULT_LSP_CONFIG } from "./lsp/types.ts";
import { DEFAULT_POD_CONFIG } from "./pod/types.ts";
import { DEFAULT_SWARM_CONFIG } from "./swarm/types.ts";

const ISSUES = {
	enabled: true,
	boardName: DEFAULT_BOARD_NAME,
	ktuiBin: "ktui",
	echo: true,
};
const THINK = { enabled: true, minNodes: 3, maxNodes: 8, engine: "grok" as const };
const CLAUDE = DEFAULT_CLAUDE_CONFIG;
const GROK = DEFAULT_GROK_CONFIG;
const HITL = DEFAULT_HITL_CONFIG;
const GITHUB = { org: "swcstudiospace", autoPr: true };
const GREPTILE = { requiredForMerge: true, bin: "greptile", minConfidence: 5 };
const SUPABASE = { enabled: true };
const LSP = DEFAULT_LSP_CONFIG;
const POD = DEFAULT_POD_CONFIG;
const SWARM = DEFAULT_SWARM_CONFIG;

const prevDir = process.env.PI_CODING_AGENT_DIR;
const tempDirs: string[] = [];

function withAgentDir(contents?: string): string {
	const dir = mkdtempSync(join(tmpdir(), "aio-config-"));
	tempDirs.push(dir);
	process.env.PI_CODING_AGENT_DIR = dir;
	if (contents !== undefined) writeFileSync(join(dir, "all-in-one.json"), contents);
	return dir;
}

afterEach(() => {
	if (prevDir === undefined) delete process.env.PI_CODING_AGENT_DIR;
	else process.env.PI_CODING_AGENT_DIR = prevDir;
	for (const dir of tempDirs.splice(0)) {
		rmSync(dir, { recursive: true, force: true });
	}
});

describe("loadConfig", () => {
	test("missing file returns defaults and does not throw", () => {
		withAgentDir();
		expect(loadConfig()).toEqual(defaultConfig());
		expect(defaultConfig()).toEqual({
			uplift: { enabled: true, skipTrivial: true, maxChars: 20000, echo: true },
			claude: CLAUDE,
			grok: GROK,
			hitl: HITL,
			issues: ISSUES,
			think: THINK,
			github: GITHUB,
			greptile: GREPTILE,
			supabase: SUPABASE,
			lsp: LSP,
			pod: POD,
			swarm: SWARM,
		});
	});

	test("invalid JSON returns defaults and does not throw", () => {
		withAgentDir("{not json");
		expect(loadConfig()).toEqual(defaultConfig());
		withAgentDir("[1, 2]");
		expect(loadConfig()).toEqual(defaultConfig());
		withAgentDir("null");
		expect(loadConfig()).toEqual(defaultConfig());
	});

	test("partial JSON merges onto defaults", () => {
		withAgentDir(JSON.stringify({ uplift: { enabled: false } }));
		expect(loadConfig()).toEqual({
			uplift: { enabled: false, skipTrivial: true, maxChars: 20000, echo: true },
			claude: CLAUDE,
			grok: GROK,
			hitl: HITL,
			issues: ISSUES,
			think: THINK,
			github: GITHUB,
			greptile: GREPTILE,
			supabase: SUPABASE,
			lsp: LSP,
			pod: POD,
			swarm: SWARM,
		});

		withAgentDir(JSON.stringify({ uplift: { maxChars: 50 } }));
		expect(loadConfig()).toEqual({
			uplift: { enabled: true, skipTrivial: true, maxChars: 50, echo: true },
			claude: CLAUDE,
			grok: GROK,
			hitl: HITL,
			issues: ISSUES,
			think: THINK,
			github: GITHUB,
			greptile: GREPTILE,
			supabase: SUPABASE,
			lsp: LSP,
			pod: POD,
			swarm: SWARM,
		});

		withAgentDir(JSON.stringify({ uplift: { skipTrivial: false, extra: true }, ignored: 1 }));
		expect(loadConfig()).toEqual({
			uplift: { enabled: true, skipTrivial: false, maxChars: 20000, echo: true },
			claude: CLAUDE,
			grok: GROK,
			hitl: HITL,
			issues: ISSUES,
			think: THINK,
			github: GITHUB,
			greptile: GREPTILE,
			supabase: SUPABASE,
			lsp: LSP,
			pod: POD,
			swarm: SWARM,
		});
	});

	test("wrong-typed fields fall back to defaults", () => {
		withAgentDir(JSON.stringify({ uplift: { enabled: "no", skipTrivial: 1, maxChars: "big" } }));
		expect(loadConfig()).toEqual(defaultConfig());
	});

	test("echo false merges onto defaults", () => {
		withAgentDir(JSON.stringify({ uplift: { echo: false } }));
		expect(loadConfig()).toEqual({
			uplift: { enabled: true, skipTrivial: true, maxChars: 20000, echo: false },
			claude: CLAUDE,
			grok: GROK,
			hitl: HITL,
			issues: ISSUES,
			think: THINK,
			github: GITHUB,
			greptile: GREPTILE,
			supabase: SUPABASE,
			lsp: LSP,
			pod: POD,
			swarm: SWARM,
		});
	});

	test("issues partial JSON merges onto defaults", () => {
		withAgentDir(JSON.stringify({ issues: { enabled: false } }));
		expect(loadConfig()).toEqual({
			uplift: { enabled: true, skipTrivial: true, maxChars: 20000, echo: true },
			claude: CLAUDE,
			grok: GROK,
			hitl: HITL,
			issues: { ...ISSUES, enabled: false },
			think: THINK,
			github: GITHUB,
			greptile: GREPTILE,
			supabase: SUPABASE,
			lsp: LSP,
			pod: POD,
			swarm: SWARM,
		});

		withAgentDir(JSON.stringify({ issues: { boardName: "  Other Board  ", ktuiBin: "/bin/ktui" } }));
		expect(loadConfig().issues).toEqual({
			enabled: true,
			boardName: "Other Board",
			ktuiBin: "/bin/ktui",
			echo: true,
		});
	});

	test("issues wrong-typed fields fall back to defaults", () => {
		withAgentDir(JSON.stringify({ issues: { enabled: "no", boardName: 1, ktuiBin: "", echo: 0 } }));
		expect(loadConfig().issues).toEqual(ISSUES);
	});

	test("think partial JSON merges onto defaults", () => {
		withAgentDir(JSON.stringify({ think: { enabled: false } }));
		expect(loadConfig().think).toEqual({ ...THINK, enabled: false });
		withAgentDir(JSON.stringify({ think: { maxNodes: 5 } }));
		expect(loadConfig().think).toEqual({ enabled: true, minNodes: 3, maxNodes: 5, engine: "grok" });
	});

	test("pod extraDirs merge from JSON", () => {
		withAgentDir(JSON.stringify({ pod: { extraDirs: ["tmp", "", "cache", 1, "notes"] } }));
		expect(loadConfig().pod).toEqual({
			...POD,
			extraDirs: ["tmp", "cache", "notes"],
		});
	});

	test("pod readyTimeoutMs and dteeUrl merge from JSON", () => {
		withAgentDir(JSON.stringify({ pod: { readyTimeoutMs: 1000, dteeUrl: "http://example:9" } }));
		expect(loadConfig().pod).toEqual({
			...POD,
			readyTimeoutMs: 1000,
			dteeUrl: "http://example:9",
		});
	});

	test("defaults include the grok engine at xhigh, proxy port 41417 and HITL max 4", () => {
		withAgentDir();
		const config = loadConfig();
		expect(config.think.engine).toBe("grok");
		expect(config.grok.enabled).toBe(true);
		expect(config.grok.model).toBe("grok-4.6");
		expect(config.grok.reasoningEffort).toBe("xhigh");
		expect(config.grok.fallbackToClaude).toBe(false);
		expect(config.grok.proxy.port).toBe(41417);
		expect(config.grok.proxy.haikuModel).toBe("grok-4.6");
		expect(config.hitl).toEqual({ enabled: true, maxQuestions: 4 });
		// defaults are copies, never the shared constant
		config.grok.proxy.routeModels.push("x-");
		expect(DEFAULT_GROK_CONFIG.proxy.routeModels).toEqual(["grok-"]);
	});

	test("grok, hitl and think.engine overrides are honored", () => {
		withAgentDir(
			JSON.stringify({
				think: { engine: "claude" },
				grok: {
					reasoningEffort: "high",
					baseUrl: " https://example.test/v1/ ",
					transport: "cli",
					home: "/tmp/grok-home",
					fallbackToClaude: true,
					proxy: { port: 5000, upstream: "https://up.example/", routeModels: ["grok-", " ", "x-"], stripThinking: false },
				},
				hitl: { maxQuestions: 2, enabled: false },
			}),
		);
		const config = loadConfig();
		expect(config.think.engine).toBe("claude");
		expect(config.grok).toEqual({
			...GROK,
			reasoningEffort: "high",
			baseUrl: "https://example.test/v1",
			transport: "cli",
			home: "/tmp/grok-home",
			fallbackToClaude: true,
			proxy: { ...GROK.proxy, port: 5000, upstream: "https://up.example", routeModels: ["grok-", "x-"], stripThinking: false },
		});
		expect(config.hitl).toEqual({ enabled: false, maxQuestions: 2 });
	});

	test("invalid grok, hitl and engine values fall back to defaults", () => {
		withAgentDir(
			JSON.stringify({
				think: { engine: "gpt" },
				grok: {
					enabled: "yes",
					reasoningEffort: "ultra",
					transport: "ssh",
					model: "",
					callTimeoutMs: -5,
					proxy: { port: 0, host: "", routeModels: [1, ""], haikuModel: 7 },
				},
				hitl: { maxQuestions: 9, enabled: "on" },
			}),
		);
		const config = loadConfig();
		expect(config.think.engine).toBe("grok");
		expect(config.grok).toEqual(GROK);
		expect(config.hitl).toEqual(HITL);
		withAgentDir(JSON.stringify({ grok: { proxy: { port: 70000 } }, hitl: { maxQuestions: 2.5 } }));
		expect(loadConfig().grok.proxy.port).toBe(41417);
		expect(loadConfig().hitl.maxQuestions).toBe(4);
	});

	test("later files win for grok and hitl sections", () => {
		const dir = withAgentDir(JSON.stringify({ grok: { reasoningEffort: "low", proxy: { port: 5000 } }, hitl: { maxQuestions: 1 } }));
		const override = join(dir, "override.json");
		writeFileSync(override, JSON.stringify({ grok: { reasoningEffort: "medium" }, hitl: { maxQuestions: 3 }, think: { engine: "claude" } }));
		const config = loadConfig([join(dir, "all-in-one.json"), override]);
		expect(config.grok.reasoningEffort).toBe("medium");
		expect(config.grok.proxy.port).toBe(5000);
		expect(config.hitl.maxQuestions).toBe(3);
		expect(config.think.engine).toBe("claude");
	});

});

describe("claude config", () => {
	test("later files win and claude section merges with validation", () => {
		const dir = withAgentDir(JSON.stringify({ uplift: { enabled: false }, claude: { model: "haiku", concurrency: 0 } }));
		const override = join(dir, "override.json");
		writeFileSync(override, JSON.stringify({ uplift: { enabled: true }, claude: { concurrency: 2.7, callTimeoutMs: -1 } }));
		const config = loadConfig([join(dir, "all-in-one.json"), override, join(dir, "missing.json")]);
		expect(config.uplift.enabled).toBe(true);
		expect(config.claude).toEqual({ ...CLAUDE, model: "haiku", concurrency: 2 });
	});

	test("claudeConfigPaths lists omp, claude home, then project", () => {
		const paths = claudeConfigPaths("/proj", { CLAUDE_CONFIG_DIR: "/cfg", PI_CODING_AGENT_DIR: "/omp" });
		expect(paths).toEqual(["/omp/all-in-one.json", "/cfg/all-in-one.json", "/proj/.claude/all-in-one.json"]);
	});

	test("zero callTimeoutMs and budgetMs mean no timer", () => {
		withAgentDir(JSON.stringify({ claude: { callTimeoutMs: 0, budgetMs: 0 }, grok: { callTimeoutMs: 0 } }));
		const config = loadConfig();
		expect(config.claude.callTimeoutMs).toBe(0);
		expect(config.claude.budgetMs).toBe(0);
		expect(config.grok.callTimeoutMs).toBe(0);
	});

	test("UserPromptSubmit hook timeout matches CLAUDE_USER_PROMPT_HOOK_TIMEOUT_SEC", () => {
		const hooks = JSON.parse(readFileSync(join(import.meta.dir, "..", "hooks", "hooks.json"), "utf8")) as {
			hooks: { UserPromptSubmit: Array<{ hooks: Array<{ timeout: number }> }> };
		};
		expect(hooks.hooks.UserPromptSubmit[0]?.hooks[0]?.timeout).toBe(CLAUDE_USER_PROMPT_HOOK_TIMEOUT_SEC);
	});
});
