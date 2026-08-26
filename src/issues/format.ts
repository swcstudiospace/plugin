import { DEFAULT_BOARD_NAME, type BoardSnapshot, type SyncResult, type TissueIssue } from "./types.ts";

const HUD_MAX_LINES = 8;

export function formatBoardHud(snap: BoardSnapshot | undefined, last?: SyncResult): string[] {
	if (!snap) {
		return [`Issue tracking · ${DEFAULT_BOARD_NAME}`, "board offline — ktui MCP not ready"];
	}

	const lines: string[] = [snap.boardName];
	const columns = snap.columns.filter((column) => column.visible).sort((a, b) => a.position - b.position);
	if (columns.length > 0) {
		lines.push(columns.map((column) => `${column.name} ${column.count}`).join("  "));
	}
	if (last) {
		lines.push(`Last: ${last.issue.id} ${last.issue.title}`);
	}
	lines.push("/kanban  /issues");
	return lines.slice(0, HUD_MAX_LINES);
}

export function formatIssueEcho(result: SyncResult): string {
	const head = `${result.issue.id}  ${result.issue.path}`;
	if (result.skipped) {
		return result.reason ? `${head}  ${result.reason}` : `${head}  skipped`;
	}
	if (result.taskId != null) {
		return `${head}  task ${result.taskId}`;
	}
	return head;
}

export function formatIssueList(issues: TissueIssue[]): string {
	if (issues.length === 0) return "No issues";
	return issues.map((issue) => `${issue.id}  ${issue.title}`).join("\n");
}

export function formatBoardList(snap: BoardSnapshot): string {
	const lines: string[] = [snap.boardName];
	for (const column of snap.columns.filter((col) => col.visible).sort((a, b) => a.position - b.position)) {
		const tasks = snap.tasks.filter((task) => task.column === column.column_id);
		lines.push(`${column.name} (${column.count})`);
		for (const task of tasks) {
			lines.push(`  ${task.title}`);
		}
	}
	return lines.join("\n");
}
