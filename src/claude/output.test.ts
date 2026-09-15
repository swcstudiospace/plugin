import { describe, expect, test } from "bun:test";
import type { Clarification } from "../hitl/types.ts";
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
const clarifications: Clarification[] = [
	{
		id: "q1",
		question: "Which database?",
		header: "Database",
		why: "Schema depends on it",
		options: [{ label: "Postgres" }, { label: "SQLite" }],
		default: "Postgres",
		blocking: true,
	},
	{
		id: "q2",
		question: "Keep the old API?",
		header: "Old API",
		why: "Affects removal scope",
		options: [{ label: "Yes" }, { label: "No" }],
		default: "No",
		blocking: false,
		answer: "No",
		answeredAt: 1,
		source: "user",
	},
];

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

	test("adds the HITL addendum after the think addendum when clarifications exist", () => {
		const out = formatPromptContext({ result, graph: FALLBACK_GRAPH, clarifications, tree });
		expect(out).toContain("## Clarifications (HITL)");
		expect(out.indexOf("## Graph of Thought")).toBeLessThan(out.indexOf("## Clarifications (HITL)"));
		expect(out.indexOf("## Clarifications (HITL)")).toBeLessThan(out.indexOf("parent p1 Goal"));
		expect(formatPromptContext({ result, clarifications: [] })).not.toContain("## Clarifications (HITL)");
	});

	test("truncates oversized xml at a line boundary and points at the spec file", () => {
		const big = { ...result, xml: Array.from({ length: 500 }, (_, i) => `<L${i}>${"y".repeat(100)}</L${i}>`).join("\n") };
		const out = formatPromptContext({ result: big, specPath: "/s/big.xml", maxChars: 8_000 });
		expect(out.length).toBeLessThan(8_300);
		expect(out).toContain("truncated by Prompt Uplift. Full specification: /s/big.xml");
		expect(truncateXml("short", 100)).toBe("short");
	});
});

describe("truncateXml", () => {
	const node = (id: string, thinking: number) =>
		`\t<NODE id="${id}">\n\t\t<THINKING>${"t".repeat(thinking)}</THINKING>\n\t\t<CONCLUSION>done ${id}</CONCLUSION>\n\t</NODE>`;
	const tail = [
		"\t<WORKFLOW>",
		'\t\t<WAVE n="1" parallel="true">n1, n2</WAVE>',
		"\t</WORKFLOW>",
		"</GRAPH_OF_THOUGHT>",
		"<CLARIFICATIONS>",
		'\t<CLARIFICATION id="q1" header="Auth" blocking="true"><QUESTION>Which auth?</QUESTION></CLARIFICATION>',
		"</CLARIFICATIONS>",
		"</BUILD_PROMPT>",
	].join("\n");
	const spec = (thinking: number, nodes = 3) =>
		["<BUILD_PROMPT>", "<ORIGINAL>x</ORIGINAL>", "<GRAPH_OF_THOUGHT>", ...Array.from({ length: nodes }, (_, i) => node(`n${i + 1}`, thinking)), tail].join("\n");

	test("small xml is returned untouched", () => {
		const xml = spec(50);
		expect(truncateXml(xml, 10_000)).toBe(xml);
		expect(truncateXml("short", 100)).toBe("short");
	});

	test("over budget, THINKING bodies are elided first and the WORKFLOW + CLARIFICATIONS tail survives", () => {
		const out = truncateXml(spec(5_000), 4_000, "/s/x.xml");
		expect(out.length).toBeLessThanOrEqual(4_000);
		expect(out).not.toContain("ttttt");
		expect(out.match(/<THINKING>\(omitted — full text in the specification file\)<\/THINKING>/g)).toHaveLength(3);
		expect(out).toContain("done n3");
		expect(out).toContain('<WAVE n="1" parallel="true">n1, n2</WAVE>');
		expect(out).toContain("<CLARIFICATIONS>");
		expect(out).toContain("Which auth?");
		expect(out.endsWith("</BUILD_PROMPT>")).toBe(true);
		expect(out).not.toContain("truncated by Prompt Uplift");
	});

	test("still over budget after eliding, the tail is cut at a line boundary with the marker", () => {
		const out = truncateXml(spec(5_000, 40), 2_000, "/s/x.xml");
		expect(out.length).toBeLessThan(2_100);
		expect(out).not.toContain("ttttt");
		expect(out).toContain("(omitted — full text in the specification file)");
		expect(out.endsWith("<!-- truncated by Prompt Uplift. Full specification: /s/x.xml -->")).toBe(true);
		expect(out).not.toContain("<CLARIFICATIONS>");
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

	test("adds engine, open HITL count and engine error bits only when provided", () => {
		expect(
			formatSummary({
				result,
				engine: "grok-4.6@xhigh",
				graph: FALLBACK_GRAPH,
				clarifications,
				engineError: "grok timed out after 5ms",
				elapsedMs: 1_000,
			}),
		).toBe(
			"Prompt Uplift · BUILD_PROMPT · llm · grok-4.6@xhigh · Graph of Thought · 5 nodes · HITL · 1 question(s) · Engine error · grok timed out after 5ms · 1.0s",
		);
		expect(formatSummary({ result, clarifications: [] })).toBe("Prompt Uplift · BUILD_PROMPT · llm");
	});
});
