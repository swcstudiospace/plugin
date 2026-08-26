import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defaultConfig, loadConfig } from "./config.ts";
import { DEFAULT_BOARD_NAME } from "./issues/types.ts";
import { DEFAULT_LSP_CONFIG } from "./lsp/types.ts";
import { DEFAULT_POD_CONFIG } from "./pod/types.ts";


const ISSUES = {
	enabled: true,
	boardName: DEFAULT_BOARD_NAME,
	ktuiBin: "ktui",
	echo: true,
};
const THINK = { enabled: true, minNodes: 3, maxNodes: 8 };
const GITHUB = { org: "swcstudiospace", autoPr: true };
const GREPTILE = { requiredForMerge: true, bin: "greptile", minConfidence: 5 };
const SUPABASE = { enabled: true };
const LSP = DEFAULT_LSP_CONFIG;
const POD = DEFAULT_POD_CONFIG;

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
			issues: ISSUES,
			think: THINK,
			github: GITHUB,
			greptile: GREPTILE,
			supabase: SUPABASE,
			lsp: LSP,
			pod: POD,
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
			issues: ISSUES,
			think: THINK,
			github: GITHUB,
			greptile: GREPTILE,
			supabase: SUPABASE,
			lsp: LSP,
			pod: POD,
		});

		withAgentDir(JSON.stringify({ uplift: { maxChars: 50 } }));
		expect(loadConfig()).toEqual({
			uplift: { enabled: true, skipTrivial: true, maxChars: 50, echo: true },
			issues: ISSUES,
			think: THINK,
			github: GITHUB,
			greptile: GREPTILE,
			supabase: SUPABASE,
			lsp: LSP,
			pod: POD,
		});

		withAgentDir(JSON.stringify({ uplift: { skipTrivial: false, extra: true }, ignored: 1 }));
		expect(loadConfig()).toEqual({
			uplift: { enabled: true, skipTrivial: false, maxChars: 20000, echo: true },
			issues: ISSUES,
			think: THINK,
			github: GITHUB,
			greptile: GREPTILE,
			supabase: SUPABASE,
			lsp: LSP,
			pod: POD,
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
			issues: ISSUES,
			think: THINK,
			github: GITHUB,
			greptile: GREPTILE,
			supabase: SUPABASE,
			lsp: LSP,
			pod: POD,
		});
	});

	test("issues partial JSON merges onto defaults", () => {
		withAgentDir(JSON.stringify({ issues: { enabled: false } }));
		expect(loadConfig()).toEqual({
			uplift: { enabled: true, skipTrivial: true, maxChars: 20000, echo: true },
			issues: { ...ISSUES, enabled: false },
			think: THINK,
			github: GITHUB,
			greptile: GREPTILE,
			supabase: SUPABASE,
			lsp: LSP,
			pod: POD,
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
		expect(loadConfig().think).toEqual({ enabled: true, minNodes: 3, maxNodes: 5 });
	});

	test("pod extraDirs merge from JSON", () => {
		withAgentDir(JSON.stringify({ pod: { extraDirs: ["tmp", "", "cache", 1, "notes"] } }));
		expect(loadConfig().pod).toEqual({
			...POD,
			extraDirs: ["tmp", "cache", "notes"],
		});
	});

});
