import { describe, expect, test } from "bun:test";
import type { GraphSyncResult, SyncResult } from "../issues/types.ts";
import { FALLBACK_GRAPH } from "../think/types.ts";
import { formatPromptContext, formatSummary, truncateXml, UPLIFT_CONTEXT_HEADER } from "./output.ts";

const result = { xml: "<BUILD_PROMPT>\n<ORIGINAL>x</ORIGINAL>\n</BUILD_PROMPT>", original: "x", root: "BUILD_PROMPT", source: "llm" as const };
function sync(id: string, title: string, extra: Partial<SyncResult> = {}): SyncResult {
	return {
		issue: { id, title, description: "", path: `/p/issues/${id}-${title}.md`, fileName: `${id}-${title}.md` },
		taskId: null,
		boardId: null,
		categoryId: null,
		created: true,
		skipped: false,
		...extra,
	};
}
const tree: GraphSyncResult = {
	workUnitId: "u",
	parent: sync("p1", "Goal", { taskId: 7 }),
	children: [sync("c1", "[n1] Understand"), sync("c2", "[n2] Plan")],
};

describe("formatPromptContext", () => {
	test("frames the spec as the user's intent, includes xml, graph and issue addenda", () => {
		const out = formatPromptContext({ result, graph: FALLBACK_GRAPH, tree, specPath: "/s/x.xml" });
		expect(out.startsWith(UPLIFT_CONTEXT_HEADER)).toBe(true);
		expect(out).toContain("Specification file: /s/x.xml");
		expect(out).toContain(result.xml);
		expect(out).toContain("## Graph of Thought");
		expect(out).toContain("parent p1 Goal");
		expect(out).toContain("child c1 [n1] Understand");
		expect(out).not.toMatch(/ignore the user/i);
	});

	test("single tracked issue without a graph mentions the issue path", () => {
		const out = formatPromptContext({ result, last: sync("i1", "T") });
		expect(out).toContain("tracked as issue i1 at /p/issues/i1-T.md");
		expect(out).not.toContain("## Graph of Thought");
	});

	test("truncates oversized xml at a line boundary and points at the spec file", () => {
		const big = { ...result, xml: Array.from({ length: 500 }, (_, i) => `<L${i}>${"y".repeat(100)}</L${i}>`).join("\n") };
		const out = formatPromptContext({ result: big, specPath: "/s/big.xml", maxChars: 8_000 });
		expect(out.length).toBeLessThan(8_300);
		expect(out).toContain("truncated by Prompt Uplift. Full specification: /s/big.xml");
		expect(truncateXml("short", 100)).toBe("short");
	});
});

describe("formatSummary", () => {
	test("reports root, source, nodes, issues and kanban skips", () => {
		const skippedTree = { ...tree, parent: sync("p1", "Goal", { reason: "ktui not found" }) };
		expect(formatSummary({ result, graph: FALLBACK_GRAPH, tree: skippedTree, elapsedMs: 12_345 })).toBe(
			"Prompt Uplift · BUILD_PROMPT · llm · Graph of Thought · 5 nodes · Issues · p1 + 2 sub-issues · Kanban skipped · ktui not found · 12.3s",
		);
		expect(formatSummary({ result, last: sync("i1", "T", { taskId: 3 }) })).toBe("Prompt Uplift · BUILD_PROMPT · llm · Issue · i1");
	});
});
