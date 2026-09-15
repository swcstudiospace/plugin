import { describe, expect, test } from "bun:test";
import { formatIssueAddendum, formatIssueEcho, formatIssueList } from "./format.ts";
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
