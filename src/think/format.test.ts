import { describe, expect, test } from "bun:test";
import { formatThinkEcho, formatThinkStatus } from "./format.ts";
import { FALLBACK_GRAPH } from "./types.ts";

describe("formatThinkEcho", () => {
	test("includes goal and a table of id kind title conclusion", () => {
		const graph = {
			goal: "Ship it",
			nodes: [{ ...FALLBACK_GRAPH.nodes[0]!, conclusion: "User wants a list page" }],
		};
		const out = formatThinkEcho(graph);
		expect(out).toContain("Ship it");
		expect(out).toContain("id  kind  title  conclusion");
		expect(out).toContain("n1  understand  Understand  User wants a list page");
	});

	test("clips a long conclusion", () => {
		const conclusion = "word ".repeat(40).trim();
		const out = formatThinkEcho({
			goal: "g",
			nodes: [{ ...FALLBACK_GRAPH.nodes[0]!, conclusion }],
		});
		expect(out.includes(conclusion)).toBe(false);
		expect(out).toContain("…");
	});
});

describe("formatThinkStatus", () => {
	test("reports off when disabled", () => {
		expect(formatThinkStatus(false)).toBe("Think off");
		expect(formatThinkStatus(false, FALLBACK_GRAPH)).toBe("Think off");
	});

	test("reports on and node count when graph present", () => {
		expect(formatThinkStatus(true)).toBe("Think on");
		expect(formatThinkStatus(true, FALLBACK_GRAPH)).toBe("Think on · 5 nodes");
	});
});
