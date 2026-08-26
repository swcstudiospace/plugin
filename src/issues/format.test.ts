import { describe, expect, test } from "bun:test";
import { formatBoardHud, formatBoardList, formatIssueEcho, formatIssueList } from "./format.ts";
import type { BoardSnapshot, KanbanColumn, SyncResult, TissueIssue } from "./types.ts";

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

function column(
	init: Partial<KanbanColumn> & Pick<KanbanColumn, "column_id" | "name">,
	count: number,
): KanbanColumn & { count: number } {
	return {
		visible: true,
		position: init.column_id,
		board_id: 1,
		...init,
		count,
	};
}

function snap(init?: Partial<BoardSnapshot>): BoardSnapshot {
	return {
		boardId: 1,
		boardName: "Spectrum Web Co",
		columns: [
			column({ column_id: 1, name: "Ready", position: 1 }, 2),
			column({ column_id: 2, name: "Doing", position: 2 }, 1),
			column({ column_id: 3, name: "Done", position: 3 }, 0),
			column({ column_id: 4, name: "Archive", position: 4, visible: false }, 5),
		],
		tasks: [
			{ task_id: 1, title: "Fix login", column: 1, description: "" },
			{ task_id: 2, title: "Add HUD", column: 1, description: "" },
			{ task_id: 3, title: "Sync board", column: 2, description: "" },
		],
		categoryId: 1,
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

describe("formatBoardHud", () => {
	test("offline snapshot is two fixed lines", () => {
		const lines = formatBoardHud(undefined);
		expect(lines).toEqual(["Issue tracking · Spectrum Web Co", "board offline — ktui MCP not ready"]);
		expect(lines.length).toBeLessThanOrEqual(8);
	});

	test("online snapshot is at most 8 lines with counts last and hint", () => {
		const lines = formatBoardHud(snap(), sync());
		expect(lines.length).toBeLessThanOrEqual(8);
		expect(lines[0]).toBe("Spectrum Web Co");
		expect(lines).toContain("Ready 2  Doing 1  Done 0");
		expect(lines.some((line) => line.includes("Archive"))).toBe(false);
		expect(lines).toContain("Last: m1n2o3 Fix login");
		expect(lines.at(-1)).toBe("/kanban  /issues");
	});

	test("many visible columns still cap at 8 lines", () => {
		const columns = Array.from({ length: 20 }, (_, i) =>
			column({ column_id: i + 1, name: `Col${i + 1}`, position: i + 1 }, i),
		);
		const lines = formatBoardHud(snap({ columns }), sync());
		expect(lines.length).toBeLessThanOrEqual(8);
	});
});

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

describe("formatBoardList", () => {
	test("visible columns with task titles", () => {
		const text = formatBoardList(snap());
		expect(text).toContain("Spectrum Web Co");
		expect(text).toContain("Ready (2)");
		expect(text).toContain("  Fix login");
		expect(text).toContain("  Add HUD");
		expect(text).toContain("Doing (1)");
		expect(text).toContain("  Sync board");
		expect(text).toContain("Done (0)");
		expect(text).not.toContain("Archive");
	});
});
