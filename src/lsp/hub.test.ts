import { resolve } from "node:path";
import { describe, expect, test } from "bun:test";
import type { LspDiagnostic } from "./client.ts";
import { LspHub, resolveMutationPath, shouldSkipPath } from "./hub.ts";
import { DEFAULT_LSP_CONFIG } from "./types.ts";

type HubSlots = {
	slots: Map<
		string,
		{
			client?: { diagnostics: Map<string, LspDiagnostic[]> };
			fails: number[];
			openUntil: number;
			circuitUntil: number;
		}
	>;
};

function diag(partial: Partial<LspDiagnostic> & Pick<LspDiagnostic, "severity" | "identity">): LspDiagnostic {
	return {
		uri: "file:///work/src/lib.rs",
		path: "/work/src/lib.rs",
		line: 1,
		character: 1,
		message: "x",
		...partial,
	};
}

function seed(hub: LspHub, diags: LspDiagnostic[]): void {
	// LspHub.slots is private; tests inject a snapshot so we never start a server.
	const internals: HubSlots = hub as unknown as HubSlots;
	internals.slots.set("rust:/work", {
		client: { diagnostics: new Map([["file:///work/src/lib.rs", diags]]) },
		fails: [],
		openUntil: 0,
		circuitUntil: 0,
	});
}

describe("digest", () => {
	test("sorts errors first", () => {
		const hub = new LspHub(DEFAULT_LSP_CONFIG);
		hub.setCwd("/work");
		seed(hub, [
			diag({ severity: "warning", identity: "w", message: "unused", line: 4 }),
			diag({ severity: "error", identity: "e", message: "missing", line: 2 }),
		]);
		const lines = hub.digest(["error", "warning"], 12, 2500).split("\n");
		expect(lines[0]).toBe("LSP [2 error|warning]");
		expect(lines[1]?.startsWith("error ")).toBe(true);
		expect(lines[2]?.startsWith("warning ")).toBe(true);
	});
});

describe("shouldInjectParent", () => {
	test("second call with the same identity returns undefined", () => {
		const hub = new LspHub(DEFAULT_LSP_CONFIG);
		hub.setCwd("/work");
		seed(hub, [diag({ severity: "error", identity: "e1", message: "boom" })]);
		const first = hub.shouldInjectParent();
		expect(first).toContain("LSP [");
		expect(hub.shouldInjectParent()).toBeUndefined();
	});
});

describe("shouldSkipPath", () => {
	test("skips node_modules and .env", () => {
		expect(shouldSkipPath("/repo/node_modules/pkg/index.ts", DEFAULT_LSP_CONFIG.maxDocBytes)).toBe(true);
		expect(shouldSkipPath("/repo/.env", DEFAULT_LSP_CONFIG.maxDocBytes)).toBe(true);
	});
});

describe("resolveMutationPath", () => {
	test("joins cwd", () => {
		expect(resolveMutationPath("/cwd", { path: "src/lib.rs" })).toBe(resolve("/cwd", "src/lib.rs"));
	});
});
