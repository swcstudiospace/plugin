import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defaultConfig, loadConfig } from "./config.ts";

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
		});

		withAgentDir(JSON.stringify({ uplift: { maxChars: 50 } }));
		expect(loadConfig()).toEqual({
			uplift: { enabled: true, skipTrivial: true, maxChars: 50, echo: true },
		});

		withAgentDir(JSON.stringify({ uplift: { skipTrivial: false, extra: true }, ignored: 1 }));
		expect(loadConfig()).toEqual({
			uplift: { enabled: true, skipTrivial: false, maxChars: 20000, echo: true },
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
		});
	});
});
