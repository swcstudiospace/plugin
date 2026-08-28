import {
	DEFAULT_BOARD_NAME,
	TISSUE_ID_PREFIX,
	type BoardSnapshot,
	type GithubAssoc,
	type KanbanColumn,
	type KanbanTask,
	type SyncResult,
	type TissueIssue,
} from "./types.ts";

export type KtuiRunner = (argv: string[]) => Promise<{ stdout: string; stderr: string; code: number }>;

const EMPTY_LIST_MARKERS = ["No tasks created yet.", "No categories created yet.", "No boards created yet."];

export function defaultKtuiRunner(bin: string): KtuiRunner {
	return async (argv) => {
		const proc = Bun.spawn([bin, ...argv], {
			stdout: "pipe",
			stderr: "pipe",
			stdin: "ignore",
		});
		const [stdout, stderr, code] = await Promise.all([
			new Response(proc.stdout).text(),
			new Response(proc.stderr).text(),
			proc.exited,
		]);
		return { stdout, stderr, code };
	};
}

function extractJsonArray(text: string): unknown[] {
	const trimmed = text.trim();
	if (!trimmed || EMPTY_LIST_MARKERS.some((marker) => trimmed.includes(marker))) return [];
	const start = text.indexOf("[");
	const end = text.lastIndexOf("]");
	if (start === -1 || end === -1 || end < start) return [];
	try {
		const parsed: unknown = JSON.parse(text.slice(start, end + 1));
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function parseCreatedId(stdout: string, key: "board_id" | "task_id" | "category_id"): number | undefined {
	const start = stdout.indexOf("{");
	const end = stdout.lastIndexOf("}");
	if (start !== -1 && end > start) {
		try {
			const parsed: unknown = JSON.parse(stdout.slice(start, end + 1));
			if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
				const value = (parsed as Record<string, unknown>)[key];
				if (typeof value === "number" && Number.isFinite(value)) return value;
			}
		} catch {
			// fall through to text form
		}
	}
	const match = new RegExp(`${key}\\s*=\\s*(\\d+)`).exec(stdout);
	if (!match) return undefined;
	return Number(match[1]);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return undefined;
	return value as Record<string, unknown>;
}

function asBoard(value: unknown): { board_id: number; name: string } | undefined {
	const o = asRecord(value);
	if (!o || typeof o.board_id !== "number" || typeof o.name !== "string") return undefined;
	return { board_id: o.board_id, name: o.name };
}

function asColumn(value: unknown): KanbanColumn | undefined {
	const o = asRecord(value);
	if (
		!o ||
		typeof o.column_id !== "number" ||
		typeof o.name !== "string" ||
		typeof o.visible !== "boolean" ||
		typeof o.position !== "number" ||
		typeof o.board_id !== "number"
	) {
		return undefined;
	}
	return {
		column_id: o.column_id,
		name: o.name,
		visible: o.visible,
		position: o.position,
		board_id: o.board_id,
	};
}

function asTask(value: unknown): KanbanTask | undefined {
	const o = asRecord(value);
	if (!o || typeof o.task_id !== "number" || typeof o.title !== "string" || typeof o.column !== "number") {
		return undefined;
	}
	const task: KanbanTask = {
		task_id: o.task_id,
		title: o.title,
		column: o.column,
		description: typeof o.description === "string" ? o.description : "",
	};
	if (typeof o.category === "number") task.category = o.category;
	return task;
}

function asCategory(value: unknown): { category_id: number; name: string } | undefined {
	const o = asRecord(value);
	if (!o || typeof o.category_id !== "number" || typeof o.name !== "string") return undefined;
	return { category_id: o.category_id, name: o.name };
}


export async function listBoards(run: KtuiRunner): Promise<Array<{ board_id: number; name: string }>> {
	const result = await run(["board", "list", "--json"]);
	if (result.code !== 0) return [];
	return extractJsonArray(result.stdout).map(asBoard).filter((b): b is { board_id: number; name: string } => b !== undefined);
}

export async function listColumns(run: KtuiRunner, boardId: number): Promise<KanbanColumn[]> {
	const result = await run(["column", "list", "--json", "--board", String(boardId)]);
	if (result.code !== 0) return [];
	return extractJsonArray(result.stdout).map(asColumn).filter((c): c is KanbanColumn => c !== undefined);
}

export async function listTasks(run: KtuiRunner, boardId: number): Promise<KanbanTask[]> {
	const result = await run(["task", "list", "--json", "--board", String(boardId)]);
	if (result.code !== 0) return [];
	return extractJsonArray(result.stdout).map(asTask).filter((t): t is KanbanTask => t !== undefined);
}

export async function listCategories(run: KtuiRunner): Promise<Array<{ category_id: number; name: string }>> {
	const result = await run(["category", "list", "--json"]);
	if (result.code !== 0) return [];
	return extractJsonArray(result.stdout)
		.map(asCategory)
		.filter((c): c is { category_id: number; name: string } => c !== undefined);
}

export async function ensureBoard(
	run: KtuiRunner,
	name = DEFAULT_BOARD_NAME,
): Promise<{ boardId: number; created: boolean }> {
	const boards = await listBoards(run);
	const existing = boards.find((board) => board.name === name);
	if (existing) return { boardId: existing.board_id, created: false };

	const created = await run(["board", "create", name, "--icon", ":books:", "--set-active"]);
	if (created.code !== 0) {
		throw new Error(created.stderr.trim() || created.stdout.trim() || "ktui board create failed");
	}
	const boardId = parseCreatedId(created.stdout, "board_id");
	if (boardId === undefined) throw new Error("failed to parse board_id");
	return { boardId, created: true };
}

export async function ensureCategory(run: KtuiRunner, slug: string): Promise<number | null> {
	if (!slug) return null;
	const categories = await listCategories(run);
	const existing = categories.find((category) => category.name === slug);
	if (existing) return existing.category_id;

	const created = await run(["category", "create", slug]);
	if (created.code !== 0) return null;
	return parseCreatedId(created.stdout, "category_id") ?? null;
}

function taskDescription(issue: TissueIssue, github?: GithubAssoc): string {
	const lines = [`${TISSUE_ID_PREFIX}${issue.id}`];
	if (github) {
		lines.push(`github:${github.remoteUrl}`);
		lines.push(`repo:${github.slug}`);
	}
	lines.push(`path:issues/${issue.fileName}`);
	const excerpt = issue.description.trim();
	return excerpt ? `${lines.join("\n")}\n\n${excerpt}` : lines.join("\n");
}

function skipped(
	issue: TissueIssue,
	reason: string,
	ids?: { taskId?: number | null; boardId?: number | null; categoryId?: number | null },
): SyncResult {
	return {
		issue,
		taskId: ids?.taskId ?? null,
		boardId: ids?.boardId ?? null,
		categoryId: ids?.categoryId ?? null,
		created: false,
		skipped: true,
		reason,
	};
}

export async function syncIssue(
	run: KtuiRunner,
	issue: TissueIssue,
	opts: { boardName?: string; github?: GithubAssoc; columnId?: number } = {},
): Promise<SyncResult> {
	let boardId: number | null = null;
	let categoryId: number | null = null;
	try {
		const board = await ensureBoard(run, opts.boardName ?? DEFAULT_BOARD_NAME);
		boardId = board.boardId;
		if (opts.github?.slug) {
			categoryId = await ensureCategory(run, opts.github.slug);
		}

		const tasks = await listTasks(run, boardId);
		const marker = `${TISSUE_ID_PREFIX}${issue.id}`;
		const existing = tasks.find((task) => task.description.includes(marker));
		if (existing) {
			return skipped(issue, "already synced", { taskId: existing.task_id, boardId, categoryId });
		}

		const argv = [
			"task",
			"create",
			issue.title,
			"--description",
			taskDescription(issue, opts.github),
			"--column",
			String(opts.columnId ?? 1),
		];
		if (categoryId !== null) {
			argv.push("--category", String(categoryId));
		}

		const created = await run(argv);
		if (created.code !== 0) {
			return skipped(issue, created.stderr.trim() || created.stdout.trim() || `ktui task create failed (${created.code})`, {
				boardId,
				categoryId,
			});
		}
		const taskId = parseCreatedId(created.stdout, "task_id");
		if (taskId === undefined) {
			return skipped(issue, "failed to parse task_id", { boardId, categoryId });
		}
		return {
			issue,
			taskId,
			boardId,
			categoryId,
			created: true,
			skipped: false,
		};
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		return skipped(issue, reason, { boardId, categoryId });
	}
}

export async function boardSnapshot(
	run: KtuiRunner,
	opts?: { boardName?: string; slug?: string },
): Promise<BoardSnapshot | undefined> {
	try {
		const boardName = opts?.boardName ?? DEFAULT_BOARD_NAME;
		const boards = await listBoards(run);
		const board = boards.find((item) => item.name === boardName);
		if (!board) return undefined;

		const [columns, tasks] = await Promise.all([listColumns(run, board.board_id), listTasks(run, board.board_id)]);
		let categoryId: number | null = null;
		if (opts?.slug) {
			const categories = await listCategories(run);
			categoryId = categories.find((category) => category.name === opts.slug)?.category_id ?? null;
		}

		const snapshot: BoardSnapshot = {
			boardId: board.board_id,
			boardName: board.name,
			columns: columns.map((column) => ({
				...column,
				count: tasks.filter((task) => task.column === column.column_id).length,
			})),
			tasks,
			categoryId,
		};
		if (opts?.slug) snapshot.slug = opts.slug;
		return snapshot;
	} catch {
		return undefined;
	}
}

export type BoardLane = "ready" | "doing" | "done";

export async function resolveLaneColumn(
	run: KtuiRunner,
	boardId: number,
	lane: BoardLane,
): Promise<number | undefined> {
	const columns = await listColumns(run, boardId);
	return columns.find((column) => column.name.trim().toLowerCase() === lane)?.column_id;
}

export async function moveTask(run: KtuiRunner, taskId: number, columnId: number): Promise<boolean> {
	try {
		const result = await run(["task", "move", String(taskId), String(columnId)]);
		return result.code === 0;
	} catch {
		return false;
	}
}

export async function moveTasksToLane(
	run: KtuiRunner,
	taskIds: number[],
	lane: BoardLane,
	boardName?: string,
): Promise<{ moved: number; skipped: number; reason?: string }> {
	const ids: number[] = [];
	const seen = new Set<number>();
	for (const id of taskIds) {
		if (!Number.isFinite(id) || id <= 0 || seen.has(id)) continue;
		seen.add(id);
		ids.push(id);
	}
	if (ids.length === 0) return { moved: 0, skipped: 0 };

	try {
		const { boardId } = await ensureBoard(run, boardName ?? DEFAULT_BOARD_NAME);
		await run(["board", "activate", String(boardId)]).catch(() => undefined);

		const columnId = await resolveLaneColumn(run, boardId, lane);
		if (columnId === undefined) {
			return { moved: 0, skipped: ids.length, reason: "lane column unresolved" };
		}

		const tasks = await listTasks(run, boardId);
		const byId = new Map(tasks.map((task) => [task.task_id, task]));
		let moved = 0;
		let skipped = 0;
		for (const id of ids) {
			const task = byId.get(id);
			if (!task || task.column === columnId) {
				skipped += 1;
				continue;
			}
			if (await moveTask(run, id, columnId)) moved += 1;
			else skipped += 1;
		}
		return { moved, skipped };
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		return { moved: 0, skipped: ids.length, reason };
	}
}

