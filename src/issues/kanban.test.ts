import { describe, expect, test } from "bun:test";
import { DEFAULT_BOARD_NAME, type TissueIssue } from "./types.ts";
import {
	type KtuiRunner,
	boardSnapshot,
	ensureBoard,
	listBoards,
	listCategories,
	listTasks,
	syncIssue,
} from "./kanban.ts";

function issue(overrides?: Partial<TissueIssue>): TissueIssue {
	return {
		id: "m1issue",
		title: "Ship kanban sync",
		description: "Wire tissue onto the board.",
		path: "issues/m1issue-Ship kanban sync.md",
		fileName: "m1issue-Ship kanban sync.md",
		...overrides,
	};
}

function mockRunner(
	script: (argv: string[]) => { stdout?: string; stderr?: string; code?: number },
): KtuiRunner & { calls: string[][] } {
	const calls: string[][] = [];
	const run: KtuiRunner = async (argv) => {
		calls.push(argv);
		const result = script(argv);
		return { stdout: result.stdout ?? "", stderr: result.stderr ?? "", code: result.code ?? 0 };
	};
	return Object.assign(run, { calls });
}

const BOARD_JSON = JSON.stringify([
	{ board_id: 1, name: DEFAULT_BOARD_NAME, icon: ":books:", creation_date: "2026-01-01T00:00:00" },
]);

const CATEGORY_JSON = JSON.stringify([{ category_id: 7, name: "acme/app", color: "#ff0000" }]);

const COLUMN_JSON = JSON.stringify([
	{ column_id: 1, name: "Ready", visible: true, position: 1, board_id: 1 },
	{ column_id: 2, name: "Doing", visible: true, position: 2, board_id: 1 },
]);

describe("empty list parsing", () => {
	test("treats empty ktui list text as no items", async () => {
		expect(await listBoards(async () => ({ stdout: "No boards created yet.", stderr: "", code: 0 }))).toEqual([]);
		expect(await listCategories(async () => ({ stdout: "No categories created yet.", stderr: "", code: 0 }))).toEqual([]);
		expect(await listTasks(async () => ({ stdout: "No tasks created yet.", stderr: "", code: 0 }), 1)).toEqual([]);
	});

	test("extracts a JSON array after the active-board banner", async () => {
		const boards = await listBoards(async () => ({
			stdout: `--- Active Board has board_id = 1 ---\n${BOARD_JSON}`,
			stderr: "",
			code: 0,
		}));
		expect(boards).toEqual([{ board_id: 1, name: DEFAULT_BOARD_NAME }]);
	});
});

describe("ensureBoard", () => {
	test("reuses an existing board and does not create", async () => {
		const run = mockRunner((argv) => {
			if (argv[0] === "board" && argv[1] === "list") return { stdout: BOARD_JSON };
			throw new Error(`unexpected ${argv.join(" ")}`);
		});
		await expect(ensureBoard(run)).resolves.toEqual({ boardId: 1, created: false });
		expect(run.calls.some((argv) => argv[1] === "create")).toBe(false);
		expect(run.calls.every((argv) => !argv.includes("--scope"))).toBe(true);
	});

	test("creates a missing board and parses board_id from stdout", async () => {
		const run = mockRunner((argv) => {
			if (argv[0] === "board" && argv[1] === "list") return { stdout: "No boards created yet." };
			if (argv[0] === "board" && argv[1] === "create") {
				expect(argv).toEqual(["board", "create", DEFAULT_BOARD_NAME, "--icon", ":books:", "--set-active"]);
				return { stdout: `Created board \`${DEFAULT_BOARD_NAME}\` with board_id = 4.` };
			}
			throw new Error(`unexpected ${argv.join(" ")}`);
		});
		await expect(ensureBoard(run)).resolves.toEqual({ boardId: 4, created: true });
	});
});

describe("syncIssue", () => {
	test("skips create when a task already carries tissue:{id}", async () => {
		const run = mockRunner((argv) => {
			if (argv[0] === "board" && argv[1] === "list") return { stdout: BOARD_JSON };
			if (argv[0] === "category" && argv[1] === "list") return { stdout: CATEGORY_JSON };
			if (argv[0] === "task" && argv[1] === "list") {
				return {
					stdout: JSON.stringify([
						{
							task_id: 9,
							title: "Ship kanban sync",
							column: 1,
							description: "tissue:m1issue\npath:issues/m1issue-Ship kanban sync.md",
						},
					]),
				};
			}
			throw new Error(`unexpected ${argv.join(" ")}`);
		});
		const result = await syncIssue(run, issue(), { github: { slug: "acme/app", remoteUrl: "https://github.com/acme/app" } });
		expect(result).toMatchObject({
			taskId: 9,
			boardId: 1,
			categoryId: 7,
			created: false,
			skipped: true,
			reason: "already synced",
		});
		expect(run.calls.some((argv) => argv[0] === "task" && argv[1] === "create")).toBe(false);
	});

	test("creates a task with the tissue description block", async () => {
		const run = mockRunner((argv) => {
			if (argv[0] === "board" && argv[1] === "list") return { stdout: BOARD_JSON };
			if (argv[0] === "category" && argv[1] === "list") return { stdout: CATEGORY_JSON };
			if (argv[0] === "task" && argv[1] === "list") return { stdout: "No tasks created yet." };
			if (argv[0] === "task" && argv[1] === "create") {
				return { stdout: "Created task `Ship kanban sync` with task_id = 12." };
			}
			throw new Error(`unexpected ${argv.join(" ")}`);
		});
		const result = await syncIssue(run, issue(), {
			github: { slug: "acme/app", remoteUrl: "https://github.com/acme/app" },
		});
		expect(result).toEqual({
			issue: issue(),
			taskId: 12,
			boardId: 1,
			categoryId: 7,
			created: true,
			skipped: false,
		});
		const create = run.calls.find((argv) => argv[0] === "task" && argv[1] === "create");
		expect(create).toBeDefined();
		expect(create![2]).toBe("Ship kanban sync");
		expect(create).toContain("--description");
		const desc = create![create!.indexOf("--description") + 1];
		expect(desc).toContain("tissue:m1issue");
		expect(desc).toContain("github:https://github.com/acme/app");
		expect(desc).toContain("repo:acme/app");
		expect(desc).toContain("path:issues/m1issue-Ship kanban sync.md");
		expect(desc).toContain("Wire tissue onto the board.");
		expect(create).toContain("--column");
		expect(create).toContain("1");
		expect(create).toContain("--category");
		expect(create).toContain("7");
		expect(create!.includes("--scope")).toBe(false);
	});

	test("returns skipped on runner throw and never throws", async () => {
		const result = await syncIssue(async () => {
			throw new Error("ktui exploded");
		}, issue());
		expect(result.skipped).toBe(true);
		expect(result.created).toBe(false);
		expect(result.taskId).toBeNull();
		expect(result.reason).toBe("ktui exploded");
	});

	test("returns skipped on nonzero create", async () => {
		const run = mockRunner((argv) => {
			if (argv[0] === "board" && argv[1] === "list") return { stdout: BOARD_JSON };
			if (argv[0] === "task" && argv[1] === "list") return { stdout: "No tasks created yet." };
			if (argv[0] === "task" && argv[1] === "create") return { stdout: "", stderr: "disk full", code: 2 };
			throw new Error(`unexpected ${argv.join(" ")}`);
		});
		const result = await syncIssue(run, issue());
		expect(result).toMatchObject({
			created: false,
			skipped: true,
			taskId: null,
			boardId: 1,
			reason: "disk full",
		});
	});
});

describe("boardSnapshot", () => {
	test("counts tasks per column and resolves category by slug", async () => {
		const run = mockRunner((argv) => {
			if (argv[0] === "board" && argv[1] === "list") return { stdout: BOARD_JSON };
			if (argv[0] === "column" && argv[1] === "list") return { stdout: COLUMN_JSON };
			if (argv[0] === "task" && argv[1] === "list") {
				return {
					stdout: JSON.stringify([
						{ task_id: 1, title: "A", column: 1, description: "tissue:a" },
						{ task_id: 2, title: "B", column: 1, description: "tissue:b" },
						{ task_id: 3, title: "C", column: 2, description: "tissue:c" },
					]),
				};
			}
			if (argv[0] === "category" && argv[1] === "list") return { stdout: CATEGORY_JSON };
			throw new Error(`unexpected ${argv.join(" ")}`);
		});
		const snapshot = await boardSnapshot(run, { slug: "acme/app" });
		expect(snapshot?.boardId).toBe(1);
		expect(snapshot?.boardName).toBe(DEFAULT_BOARD_NAME);
		expect(snapshot?.slug).toBe("acme/app");
		expect(snapshot?.categoryId).toBe(7);
		expect(snapshot?.columns.map((column) => [column.name, column.count])).toEqual([
			["Ready", 2],
			["Doing", 1],
		]);
		expect(snapshot?.tasks).toHaveLength(3);
	});
});
