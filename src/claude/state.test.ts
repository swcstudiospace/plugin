import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	defaultStateDir,
	readControl,
	readLast,
	readSession,
	sessionPath,
	writeControl,
	writeSession,
} from "./state.ts";

const dirs: string[] = [];
function tempDir(): string {
	const dir = mkdtempSync(join(tmpdir(), "aio-state-"));
	dirs.push(dir);
	return join(dir, "aio");
}
afterEach(() => {
	for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("defaultStateDir", () => {
	test("prefers AIO_STATE_DIR, then CLAUDE_CONFIG_DIR, then ~/.claude", () => {
		expect(defaultStateDir({ AIO_STATE_DIR: "/x" })).toBe("/x");
		expect(defaultStateDir({ CLAUDE_CONFIG_DIR: "/cfg" })).toBe(join("/cfg", "aio"));
		expect(defaultStateDir({}).endsWith(join(".claude", "aio"))).toBe(true);
	});
});

describe("control state", () => {
	test("missing file is empty; write merges and persists", () => {
		const dir = tempDir();
		expect(readControl(dir)).toEqual({});
		expect(writeControl(dir, { enabled: false })).toEqual({ enabled: false });
		expect(writeControl(dir, { skipOnce: true })).toEqual({ enabled: false, skipOnce: true });
		expect(readControl(dir)).toEqual({ enabled: false, skipOnce: true });
	});
});

describe("session records", () => {
	test("round-trips and mirrors to last.json; ids are sanitized", () => {
		const dir = tempDir();
		const record = {
			sessionId: "abc/../evil",
			at: 1,
			result: { xml: "<X/>", original: "x", root: "X", source: "llm" as const },
		};
		writeSession(dir, record);
		expect(existsSync(sessionPath(dir, "abc/../evil"))).toBe(true);
		expect(sessionPath(dir, "abc/../evil")).toContain("abc_.._evil.json");
		expect(readSession(dir, "abc/../evil")).toEqual(record);
		expect(readLast(dir)).toEqual(record);
		expect(readSession(dir, "nope")).toBeUndefined();
	});
});
