import type { Component } from "@oh-my-pi/pi-tui";
import type { BoardSnapshot } from "./types.ts";

function clip(text: string, width: number): string {
	if (width <= 0) return "";
	if (text.length <= width) return text;
	if (width === 1) return "…";
	return `${text.slice(0, width - 1)}…`;
}

export function createBoardComponent(
	snap: BoardSnapshot,
	done: (result: "close") => void,
): Component {
	let closed = false;

	function close(): void {
		if (closed) return;
		closed = true;
		done("close");
	}

	return {
		render(width: number): readonly string[] {
			const lines: string[] = [clip(snap.boardName, width), ""];
			const columns = snap.columns
				.filter((column) => column.visible)
				.sort((a, b) => a.position - b.position);

			for (const column of columns) {
				const tasks = snap.tasks.filter((task) => task.column === column.column_id);
				lines.push(clip(`${column.name} (${column.count})`, width));
				if (tasks.length === 0) {
					lines.push(clip("  (empty)", width));
				} else {
					for (const task of tasks) {
						lines.push(clip(`  ${task.title}`, width));
					}
				}
				lines.push("");
			}

			lines.push(clip("q / esc to close", width));
			return lines;
		},
		handleInput(data: string): void {
			if (
				data === "q" ||
				data === "Q" ||
				data === "\x1b" ||
				data === "\x1b\x1b" ||
				data === "\x1b[27u" ||
				data === "\x1b[27;1u"
			) {
				close();
			}
		},
	};
}
