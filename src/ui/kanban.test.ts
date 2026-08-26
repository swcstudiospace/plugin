import { describe, expect, test } from "bun:test";
import type { Component } from "@oh-my-pi/pi-tui";
import { createBoardComponent } from "../issues/board-ui.ts";
import type { BoardSnapshot, KanbanColumn, SyncResult, TissueIssue } from "../issues/types.ts";
import { createKanbanWidget } from "./kanban.ts";
import { paint, type PaintTheme } from "./paint.ts";

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
			{ task_id: 3, title: "Triage bugs", column: 1, description: "" },
			{ task_id: 4, title: "Hidden extra", column: 1, description: "" },
			{ task_id: 5, title: "Sync board", column: 2, description: "" },
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

function mockTheme(fg: PaintTheme["fg"] = (_color, text) => text): PaintTheme {
	return { fg };
}

function rendered(component: Component, width = 80): string[] {
	return [...component.render(width)];
}

function joined(component: Component, width = 80): string {
	return rendered(component, width).join("\n");
}

describe("paint", () => {
	test("returns themed text and never throws", () => {
		expect(paint(mockTheme((_, text) => `[${text}]`), "accent", "Ready")).toBe("[Ready]");
		expect(
			paint(
				mockTheme(() => {
					throw new Error("bad color");
				}),
				"accent",
				"Ready",
			),
		).toBe("Ready");
	});
});

describe("createKanbanWidget", () => {
	test("returns a factory, not string[]", () => {
		const factory = createKanbanWidget(snap(), sync());
		expect(typeof factory).toBe("function");
		expect(Array.isArray(factory)).toBe(false);
		const component = factory(null, mockTheme());
		expect(typeof component.render).toBe("function");
	});

	test("offline widget paints accent title and warning", () => {
		const factory = createKanbanWidget();
		const lines = rendered(factory(null, mockTheme()));
		expect(lines.join("\n")).toContain("Spectrum Web Co");
		expect(lines.join("\n")).toContain("board offline");
		expect(lines.length).toBeLessThanOrEqual(10);
	});

	test("online factory(null, mock).render(80) contains board name and Ready", () => {
		const factory = createKanbanWidget(snap(), sync());
		const lines = factory(null, mockTheme()).render(80);
		const text = [...lines].join("\n");
		expect(text).toContain("Spectrum Web Co");
		expect(text).toContain("Ready");
		expect(text).toContain("Last: m1n2o3 Fix login");
		expect(text).toContain("/kanban  /issues");
		expect(text.includes("Archive")).toBe(false);
		expect(lines.length).toBeLessThanOrEqual(10);
	});

	test("shows at most three task titles", () => {
		const text = joined(createKanbanWidget(snap())(null, mockTheme()));
		expect(text).toContain("Fix login");
		expect(text).toContain("Add HUD");
		expect(text).toContain("Triage bugs");
		expect(text.includes("Hidden extra")).toBe(false);
	});

	test("survives theme.fg throwing", () => {
		const factory = createKanbanWidget(snap());
		const text = joined(
			factory(
				null,
				mockTheme(() => {
					throw new Error("unknown color");
				}),
			),
		);
		expect(text).toContain("Spectrum Web Co");
		expect(text).toContain("Ready");
	});

	test("caps render lines with many columns", () => {
		const columns = Array.from({ length: 20 }, (_, i) =>
			column({ column_id: i + 1, name: `Col${i + 1}`, position: i + 1 }, i),
		);
		const lines = rendered(createKanbanWidget(snap({ columns }), sync())(null, mockTheme()));
		expect(lines.length).toBeLessThanOrEqual(10);
		expect(lines.join("\n")).toContain("/kanban  /issues");
	});
});

describe("createBoardComponent", () => {
	test("paints board name and Ready and keeps q/esc close", () => {
		let closed = 0;
		const component = createBoardComponent(snap(), () => {
			closed += 1;
		}, mockTheme());
		const text = joined(component);
		expect(text).toContain("Spectrum Web Co");
		expect(text).toContain("Ready");
		expect(text).toContain("q / esc to close");
		component.handleInput?.("q");
		expect(closed).toBe(1);
		component.handleInput?.("\x1b");
		expect(closed).toBe(1);
	});
});
