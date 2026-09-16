import { describe, expect, test } from "bun:test";
import { formatIssueAddendum, formatIssueEcho, formatIssueList, injectIssuesXml, issuesToXml } from "./format.ts";
import type { GraphSyncResult, SyncResult, TissueIssue } from "./types.ts";

function issue(init?: Partial<TissueIssue>): TissueIssue {
	return {
		id: "m1n2o3",
		title: "Fix login",
		description: "desc",
		path: "issues/m1n2o3-Fix login.md",
		fileName: "m1n2o3-Fix login.md",
		...init,
	};
}

function sync(init?: Partial<SyncResult>): SyncResult {
	return {
		issue: issue(),
		taskId: 12,
		boardId: 1,
		categoryId: 1,
		created: true,
		skipped: false,
		...init,
	};
}

describe("formatIssueEcho", () => {
	test("includes tissue id, path, and task id", () => {
		expect(formatIssueEcho(sync())).toBe("m1n2o3  issues/m1n2o3-Fix login.md  task 12");
	});

	test("includes skip reason instead of task id", () => {
		expect(formatIssueEcho(sync({ skipped: true, taskId: null, reason: "already on board" }))).toBe(
			"m1n2o3  issues/m1n2o3-Fix login.md  already on board",
		);
	});
});

describe("formatIssueList", () => {
	test("empty list", () => {
		expect(formatIssueList([])).toBe("No issues");
	});

	test("id and title per issue", () => {
		expect(formatIssueList([issue(), issue({ id: "abc", title: "Other" })])).toBe("m1n2o3  Fix login\nabc  Other");
	});
});

describe("formatIssueAddendum", () => {
	test("mentions Tissue tree, graph nodes, and git add issues/", () => {
		const text = formatIssueAddendum();
		expect(text).toContain("Tissue");
		expect(text).toContain("graph node");
		expect(text).toContain("git add issues/");
		expect(text).toContain("gh issue create");
	});

	test("lists parent and child when tree is passed", () => {
		const tree: GraphSyncResult = {
			workUnitId: "ship-the-widget-abcd1234",
			parent: sync({ issue: issue({ id: "p1", title: "Ship the widget" }) }),
			children: [
				sync({ issue: issue({ id: "c1", title: "[n1] Understand" }) }),
				sync({ issue: issue({ id: "c2", title: "[n2] Decompose" }) }),
			],
		};
		const text = formatIssueAddendum(tree);
		expect(text).toContain("parent p1 Ship the widget");
		expect(text).toContain("child c1 [n1] Understand");
		expect(text).toContain("child c2 [n2] Decompose");
	});
});

function xmlIssue(id: string, title: string, taskId: number | null): SyncResult {
	return {
		issue: { id, title, description: "", path: `issues/${id}.md`, fileName: `${id}.md` },
		taskId,
		boardId: taskId != null ? 1 : null,
		categoryId: null,
		created: taskId != null,
		skipped: taskId == null,
	};
}

const xmlTree: GraphSyncResult = {
	workUnitId: "unit-1",
	parent: xmlIssue("p1", "Build the thing", 100),
	children: [xmlIssue("c1", "[n1] Understand", 101), xmlIssue("c2", "[n2] Decompose", 102)],
};

describe("issuesToXml", () => {
	test("renders parent with nested SUBISSUE per child, node id extracted from the [n1] title tag", () => {
		const xml = issuesToXml({ tree: xmlTree });
		expect(xml.startsWith("<ISSUES>")).toBe(true);
		expect(xml).toContain('<ISSUE id="p1" title="Build the thing" taskId="100">');
		expect(xml).toContain('<SUBISSUE id="c1" nodeId="n1" title="Understand" taskId="101"/>');
		expect(xml).toContain('<SUBISSUE id="c2" nodeId="n2" title="Decompose" taskId="102"/>');
		expect(xml.endsWith("</ISSUES>")).toBe(true);
	});

	test("self-closes the ISSUE element when there are no children", () => {
		const solo: GraphSyncResult = { workUnitId: "u2", parent: xmlIssue("p2", "Solo", 200), children: [] };
		expect(issuesToXml({ tree: solo })).toBe('<ISSUES>\n\t<ISSUE id="p2" title="Solo" taskId="200"/>\n</ISSUES>');
	});

	test("omits taskId attribute when null, and escapes title text", () => {
		const noTask: GraphSyncResult = { workUnitId: "u3", parent: xmlIssue("p3", 'A & "B"', null), children: [] };
		expect(issuesToXml({ tree: noTask })).toBe('<ISSUES>\n\t<ISSUE id="p3" title="A &amp; &quot;B&quot;"/>\n</ISSUES>');
	});

	test("falls back to `last` (no graph) when there is no tree", () => {
		const last = xmlIssue("s1", "Untitled prompt", 300);
		expect(issuesToXml({ last })).toBe('<ISSUES>\n\t<ISSUE id="s1" title="Untitled prompt" taskId="300"/>\n</ISSUES>');
	});

	test("empty when neither tree nor a synced last issue is given", () => {
		expect(issuesToXml({})).toBe("");
		expect(issuesToXml({ last: xmlIssue("", "x", null) })).toBe("");
	});
});

describe("injectIssuesXml", () => {
	const base = "<BUILD_PROMPT>\n<ORIGINAL>x</ORIGINAL>\n</BUILD_PROMPT>";

	test("inserts before the root close and replaces an existing block", () => {
		const once = injectIssuesXml(base, { tree: xmlTree });
		expect(once.endsWith("</ISSUES>\n</BUILD_PROMPT>")).toBe(true);
		expect(once).toContain("<ORIGINAL>x</ORIGINAL>");

		const solo: GraphSyncResult = { workUnitId: "u2", parent: xmlIssue("p2", "Solo", 200), children: [] };
		const twice = injectIssuesXml(once, { tree: solo });
		expect(twice.match(/<ISSUES>/g)).toHaveLength(1);
		expect(twice).not.toContain('id="p1"');
		expect(twice).toContain('id="p2"');
	});

	test("empty input removes an existing block and leaves input without one unchanged", () => {
		expect(injectIssuesXml(base, {})).toBe(base);
		const removed = injectIssuesXml(injectIssuesXml(base, { tree: xmlTree }), {});
		expect(removed).not.toContain("<ISSUES");
		expect(removed).toContain("</BUILD_PROMPT>");
	});

	test("appends when there is no root close", () => {
		expect(injectIssuesXml("plain text", { tree: xmlTree })).toBe(`plain text\n${issuesToXml({ tree: xmlTree })}`);
	});
});
