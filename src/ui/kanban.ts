import { Box, Text, type Component } from "@oh-my-pi/pi-tui";
import { DEFAULT_BOARD_NAME, type BoardSnapshot, type SyncResult } from "../issues/types.ts";
import { paint, type PaintTheme } from "./paint.ts";

const MAX_LINES = 10;
const MAX_TASKS = 3;

export function createKanbanWidget(
	snap?: BoardSnapshot,
	last?: SyncResult,
): (tui: unknown, theme: PaintTheme) => Component {
	return (_tui: unknown, theme: PaintTheme): Component => {
		const box = new Box(0, 0);
		for (const line of widgetLines(snap, last, theme)) {
			box.addChild(new Text(line, 0, 0));
		}
		return box;
	};
}

function widgetLines(snap: BoardSnapshot | undefined, last: SyncResult | undefined, theme: PaintTheme): string[] {
	if (!snap) {
		return [
			paint(theme, "accent", `Issue tracking · ${DEFAULT_BOARD_NAME}`),
			paint(theme, "warning", "board offline"),
		];
	}

	const body: string[] = [paint(theme, "accent", snap.boardName)];
	const columns = snap.columns.filter((column) => column.visible).sort((a, b) => a.position - b.position);
	let tasksShown = 0;
	for (const column of columns) {
		body.push(`${paint(theme, "borderMuted", column.name)}  ${paint(theme, "success", String(column.count))}`);
		if (tasksShown >= MAX_TASKS) continue;
		for (const task of snap.tasks.filter((item) => item.column === column.column_id)) {
			if (tasksShown >= MAX_TASKS) break;
			body.push(`  ${task.title}`);
			tasksShown += 1;
		}
	}

	const tail: string[] = [];
	if (last) {
		tail.push(`Last: ${last.issue.id} ${last.issue.title}`);
	}
	tail.push("/kanban  /issues");

	const room = Math.max(1, MAX_LINES - tail.length);
	return [...body.slice(0, room), ...tail].slice(0, MAX_LINES);
}
