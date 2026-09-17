import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { ThoughtGraph } from "../think/types.ts";
import type { KtuiRunner } from "./kanban.ts";
import {
	advanceTrackedIssues,
	createBoardLaneController,
	isTerminalAgentEnd,
	refreshSnapshot,
	syncAllIssues,
	trackedTaskIds,
	trackThoughtGraph,
	trackUpliftedPrompt,
	workUnitId,
} from "./track.ts";
import { DEFAULT_BOARD_NAME, type GraphSyncResult, type SyncResult } from "./types.ts";

const tempDirs: string[] = [];

function tmp(): string {
	const dir = mkdtempSync(join(tmpdir(), "aio-track-"));
	tempDirs.push(dir);
	return dir;
}

afterEach(() => {
	for (const dir of tempDirs.splice(0)) {
		rmSync(dir, { recursive: true, force: true });
	}
});

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

const COLUMN_JSON = JSON.stringify([
	{ column_id: 1, name: "Ready", visible: true, position: 1, board_id: 1 },
]);

describe("trackUpliftedPrompt", () => {
	test("creates md file with tissue: id and calls task create", async () => {
		const root = tmp();
		const run = mockRunner((argv) => {
			if (argv[0] === "board" && argv[1] === "list") return { stdout: BOARD_JSON };
			if (argv[0] === "category" && argv[1] === "list") {
				return { stdout: JSON.stringify([{ category_id: 7, name: "acme/app" }]) };
			}
			if (argv[0] === "task" && argv[1] === "list") return { stdout: "No tasks created yet." };
			if (argv[0] === "task" && argv[1] === "create") {
				return { stdout: "Created task `Ship the widget` with task_id = 3." };
			}
			throw new Error(`unexpected ${argv.join(" ")}`);
		});
		const original = "Ship the widget\n\nPlease implement the widget.";
		const result = await trackUpliftedPrompt({
			root,
			original,
			run,
			boardName: DEFAULT_BOARD_NAME,
			github: { slug: "acme/app", remoteUrl: "https://github.com/acme/app" },
		});
		expect(result.created).toBe(true);
		expect(result.skipped).toBe(false);
		expect(result.taskId).toBe(3);
		expect(result.issue.title).toBe("Ship the widget");
		const md = readFileSync(result.issue.path, "utf8");
		expect(md).toContain(`tissue: ${result.issue.id}`);
		expect(md).toContain("#prompt @omp");
		expect(md).toContain("github: https://github.com/acme/app");
		expect(md).toContain("repo: acme/app");
		expect(run.calls.some((argv) => argv[0] === "task" && argv[1] === "create")).toBe(true);
	});

	test("second sync skips", async () => {
		const root = tmp();
		const tasks: Array<{ task_id: number; title: string; column: number; description: string }> = [];
		const run = mockRunner((argv) => {
			if (argv[0] === "board" && argv[1] === "list") return { stdout: BOARD_JSON };
			if (argv[0] === "task" && argv[1] === "list") {
				return { stdout: tasks.length > 0 ? JSON.stringify(tasks) : "No tasks created yet." };
			}
			if (argv[0] === "task" && argv[1] === "create") {
				const desc = argv[argv.indexOf("--description") + 1] ?? "";
				tasks.push({ task_id: 3, title: String(argv[2]), column: 1, description: desc });
				return { stdout: "Created task `Ship the widget` with task_id = 3." };
			}
			throw new Error(`unexpected ${argv.join(" ")}`);
		});
		const first = await trackUpliftedPrompt({
			root,
			original: "Ship the widget",
			run,
			boardName: DEFAULT_BOARD_NAME,
		});
		expect(first.created).toBe(true);
		const second = await syncAllIssues(root, run, DEFAULT_BOARD_NAME);
		expect(second).toHaveLength(1);
		expect(second[0]).toMatchObject({
			taskId: 3,
			created: false,
			skipped: true,
			reason: "already synced",
		});
		expect(run.calls.filter((argv) => argv[0] === "task" && argv[1] === "create")).toHaveLength(1);
	});

	test("never throws and uses Untitled prompt fallback", async () => {
		const result = await trackUpliftedPrompt({
			root: tmp(),
			original: "\n  \n",
			run: async () => {
				throw new Error("ktui exploded");
			},
			boardName: DEFAULT_BOARD_NAME,
		});
		expect(result.skipped).toBe(true);
		expect(result.created).toBe(false);
		expect(result.issue.title).toBe("Untitled prompt");
		expect(result.reason).toBe("ktui exploded");
	});
});

describe("refreshSnapshot", () => {
	test("returns undefined on failure", async () => {
		const snap = await refreshSnapshot(
			async () => {
				throw new Error("offline");
			},
			DEFAULT_BOARD_NAME,
		);
		expect(snap).toBeUndefined();
	});

	test("returns a board snapshot", async () => {
		const run = mockRunner((argv) => {
			if (argv[0] === "board" && argv[1] === "list") return { stdout: BOARD_JSON };
			if (argv[0] === "column" && argv[1] === "list") return { stdout: COLUMN_JSON };
			if (argv[0] === "task" && argv[1] === "list") return { stdout: "No tasks created yet." };
			throw new Error(`unexpected ${argv.join(" ")}`);
		});
		const snap = await refreshSnapshot(run, DEFAULT_BOARD_NAME);
		expect(snap?.boardId).toBe(1);
		expect(snap?.boardName).toBe(DEFAULT_BOARD_NAME);
	});
});

function mdFiles(root: string): string[] {
	return readdirSync(join(root, "issues")).filter((name) => name.endsWith(".md"));
}

function graphOfThree(): ThoughtGraph {
	return {
		goal: "Ship the widget",
		nodes: [
			{ id: "n1", title: "Understand", kind: "understand", question: "What is asked?", dependsOn: [] },
			{ id: "n2", title: "Decompose", kind: "decompose", question: "What are the parts?", dependsOn: ["n1"] },
			{ id: "n3", title: "Plan", kind: "synthesize", question: "What is the plan?", dependsOn: ["n2"] },
		],
	};
}

function boardRunner(): KtuiRunner & { calls: string[][]; tasks: Array<{ task_id: number; title: string; column: number; description: string }> } {
	const tasks: Array<{ task_id: number; title: string; column: number; description: string }> = [];
	let nextId = 1;
	const columns = [
		{ column_id: 1, name: "Ready", visible: true, position: 1, board_id: 1 },
		{ column_id: 2, name: "Doing", visible: true, position: 2, board_id: 1 },
		{ column_id: 3, name: "Done", visible: true, position: 3, board_id: 1 },
	];
	const run = mockRunner((argv) => {
		if (argv[0] === "board" && argv[1] === "list") return { stdout: BOARD_JSON };
		if (argv[0] === "board" && argv[1] === "activate") return { stdout: "" };
		if (argv[0] === "column" && argv[1] === "list") return { stdout: JSON.stringify(columns) };
		if (argv[0] === "task" && argv[1] === "list") {
			return { stdout: tasks.length > 0 ? JSON.stringify(tasks) : "No tasks created yet." };
		}
		if (argv[0] === "task" && argv[1] === "create") {
			const desc = argv[argv.indexOf("--description") + 1] ?? "";
			const taskId = nextId++;
			tasks.push({ task_id: taskId, title: String(argv[2]), column: 1, description: desc });
			return { stdout: `Created task \`${argv[2]}\` with task_id = ${taskId}.` };
		}
		if (argv[0] === "task" && argv[1] === "move") {
			const taskId = Number(argv[2]);
			const columnId = Number(argv[3]);
			const task = tasks.find((item) => item.task_id === taskId);
			if (task) task.column = columnId;
			return { stdout: "" };
		}
		throw new Error(`unexpected ${argv.join(" ")}`);
	});
	return Object.assign(run, { tasks });
}

describe("workUnitId", () => {
	test("stable for same original, different originals differ", () => {
		const a = workUnitId("Ship the widget\n\nPlease implement.");
		const b = workUnitId("Ship the widget\n\nPlease implement.");
		const c = workUnitId("Other prompt");
		expect(a).toBe(b);
		expect(a).not.toBe(c);
		expect(a.startsWith("ship-the-widget-")).toBe(true);
		expect(a.split("-").at(-1)?.length).toBe(8);
	});
});

describe("trackThoughtGraph", () => {
	test("3-node graph creates parent plus children with markers", async () => {
		const root = tmp();
		const run = boardRunner();
		const original = "Ship the widget\n\nPlease implement the widget.";
		const graph = graphOfThree();
		const result = await trackThoughtGraph({
			root,
			original,
			graph,
			run,
			boardName: DEFAULT_BOARD_NAME,
		});
		expect(mdFiles(root)).toHaveLength(4);
		expect(result.workUnitId).toBe(workUnitId(original));
		expect(result.parent.created).toBe(true);
		expect(result.children).toHaveLength(3);
		expect(result.children.every((child) => child.created)).toBe(true);
		const parentMd = readFileSync(result.parent.issue.path, "utf8");
		expect(parentMd).toContain(`<!-- aio-id: ${result.workUnitId} -->`);
		expect(parentMd).toContain("| id | title | kind | deps | child |");
		for (const child of result.children) {
			expect(parentMd).toContain(child.issue.id);
			const childMd = readFileSync(child.issue.path, "utf8");
			expect(childMd).toMatch(new RegExp(`<!-- aio-id: ${result.workUnitId}/n[123] -->`));
			expect(childMd).toContain(`parent: ${result.parent.issue.id}`);
		}
		expect(run.calls.filter((argv) => argv[0] === "task" && argv[1] === "create")).toHaveLength(4);
	});

	test("second trackThoughtGraph is idempotent and skips sync", async () => {
		const root = tmp();
		const run = boardRunner();
		const original = "Ship the widget";
		const graph = graphOfThree();
		const first = await trackThoughtGraph({
			root,
			original,
			graph,
			run,
			boardName: DEFAULT_BOARD_NAME,
		});
		expect(mdFiles(root)).toHaveLength(4);
		const second = await trackThoughtGraph({
			root,
			original,
			graph,
			run,
			boardName: DEFAULT_BOARD_NAME,
		});
		expect(mdFiles(root)).toHaveLength(4);
		expect(second.parent.issue.id).toBe(first.parent.issue.id);
		expect(second.parent.skipped).toBe(true);
		expect(second.parent.reason).toBe("already synced");
		expect(second.children).toHaveLength(3);
		expect(second.children.every((child) => child.skipped && child.reason === "already synced")).toBe(true);
		expect(run.calls.filter((argv) => argv[0] === "task" && argv[1] === "create")).toHaveLength(4);
	});

	test("empty throwing run returns skipped parent and never throws", async () => {
		const result = await trackThoughtGraph({
			root: tmp(),
			original: "",
			graph: { goal: "", nodes: [] },
			run: async () => {
				throw new Error("ktui exploded");
			},
			boardName: DEFAULT_BOARD_NAME,
		});
		expect(result.parent.skipped).toBe(true);
		expect(result.parent.created).toBe(false);
		expect(result.parent.reason).toBe("ktui exploded");
		expect(result.children).toHaveLength(0);
	});
});

function fakeSync(taskId: number | null): SyncResult {
	return {
		issue: { id: "i", title: "t", description: "", path: "", fileName: "" },
		taskId,
		boardId: 1,
		categoryId: null,
		created: false,
		skipped: false,
	};
}

describe("trackedTaskIds", () => {
	test("dedupes parent+children+last and ignores null/0", () => {
		const tree: GraphSyncResult = {
			workUnitId: "unit",
			parent: fakeSync(10),
			children: [fakeSync(11), fakeSync(10), fakeSync(null), fakeSync(0)],
		};
		expect(trackedTaskIds(tree, fakeSync(12))).toEqual([10, 11, 12]);
		expect(trackedTaskIds(tree, fakeSync(10))).toEqual([10, 11]);
		expect(trackedTaskIds(undefined, fakeSync(0))).toEqual([]);
		expect(trackedTaskIds(undefined, fakeSync(null))).toEqual([]);
		expect(trackedTaskIds()).toEqual([]);
	});
});

describe("advanceTrackedIssues", () => {
	test("doing moves all tree task ids to column 2", async () => {
		const root = tmp();
		const run = boardRunner();
		const tree = await trackThoughtGraph({
			root,
			original: "Ship the widget",
			graph: graphOfThree(),
			run,
			boardName: DEFAULT_BOARD_NAME,
		});
		const ids = trackedTaskIds(tree);
		expect(ids).toHaveLength(4);
		const result = await advanceTrackedIssues({
			run,
			boardName: DEFAULT_BOARD_NAME,
			lane: "doing",
			tree,
		});
		expect(result.moved).toBe(4);
		for (const id of ids) {
			expect(run.tasks.find((task) => task.task_id === id)?.column).toBe(2);
		}
	});

	test("never throws", async () => {
		const result = await advanceTrackedIssues({
			run: async () => {
				throw new Error("ktui exploded");
			},
			boardName: DEFAULT_BOARD_NAME,
			lane: "doing",
			last: fakeSync(1),
		});
		expect(result.moved).toBe(0);
		expect(result.skipped).toBe(1);
		expect(result.reason).toBe("ktui exploded");
	});
});

describe("isTerminalAgentEnd", () => {
	test("absent and false are terminal; true is a continuation", () => {
		expect(isTerminalAgentEnd({})).toBe(true);
		expect(isTerminalAgentEnd({ willContinue: false })).toBe(true);
		expect(isTerminalAgentEnd({ willContinue: true })).toBe(false);
	});
});

describe("createBoardLaneController", () => {
	test("onAgentStart then onAgentEnd moves doing before done", async () => {
		const root = tmp();
		const run = boardRunner();
		const tree = await trackThoughtGraph({
			root,
			original: "Ship the widget",
			graph: graphOfThree(),
			run,
			boardName: DEFAULT_BOARD_NAME,
		});
		const controller = createBoardLaneController({
			run,
			boardName: () => DEFAULT_BOARD_NAME,
			enabled: () => true,
			tree: () => tree,
			last: () => undefined,
		});
		controller.onAgentStart();
		await controller.pending();
		for (const id of trackedTaskIds(tree)) {
			expect(run.tasks.find((task) => task.task_id === id)?.column).toBe(2);
		}
		controller.onAgentEnd();
		await controller.pending();
		for (const id of trackedTaskIds(tree)) {
			expect(run.tasks.find((task) => task.task_id === id)?.column).toBe(3);
		}
		const moves = run.calls.filter((argv) => argv[0] === "task" && argv[1] === "move");
		const lastDoing = moves.reduce((idx, argv, i) => (argv[3] === "2" ? i : idx), -1);
		const firstDone = moves.findIndex((argv) => argv[3] === "3");
		expect(lastDoing).toBeGreaterThanOrEqual(0);
		expect(firstDone).toBeGreaterThan(lastDoing);
	});

	test("onAgentEnd without onAgentStart does not move tasks", async () => {
		const root = tmp();
		const run = boardRunner();
		const tree = await trackThoughtGraph({
			root,
			original: "Ship the widget",
			graph: graphOfThree(),
			run,
			boardName: DEFAULT_BOARD_NAME,
		});
		const controller = createBoardLaneController({
			run,
			boardName: () => DEFAULT_BOARD_NAME,
			enabled: () => true,
			tree: () => tree,
			last: () => undefined,
		});
		controller.onAgentEnd();
		await controller.pending();
		expect(run.calls.filter((argv) => argv[0] === "task" && argv[1] === "move")).toHaveLength(0);
		for (const task of run.tasks) expect(task.column).toBe(1);
	});

	test("enabled false makes no ktui calls", async () => {
		const run = mockRunner(() => {
			throw new Error("unexpected ktui");
		});
		const controller = createBoardLaneController({
			run,
			boardName: () => DEFAULT_BOARD_NAME,
			enabled: () => false,
			tree: () => undefined,
			last: () => fakeSync(9),
		});
		controller.onAgentStart();
		controller.onAgentEnd();
		await controller.pending();
		expect(run.calls).toHaveLength(0);
	});

	test("continuation agent_end leaves cards in doing until terminal", async () => {
		const root = tmp();
		const run = boardRunner();
		const tree = await trackThoughtGraph({
			root,
			original: "Ship the widget",
			graph: graphOfThree(),
			run,
			boardName: DEFAULT_BOARD_NAME,
		});
		const controller = createBoardLaneController({
			run,
			boardName: () => DEFAULT_BOARD_NAME,
			enabled: () => true,
			tree: () => tree,
			last: () => undefined,
		});
		controller.onAgentStart();
		await controller.pending();
		if (isTerminalAgentEnd({ willContinue: true })) controller.onAgentEnd();
		await controller.pending();
		for (const id of trackedTaskIds(tree)) {
			expect(run.tasks.find((task) => task.task_id === id)?.column).toBe(2);
		}
		if (isTerminalAgentEnd({ willContinue: false })) controller.onAgentEnd();
		await controller.pending();
		for (const id of trackedTaskIds(tree)) {
			expect(run.tasks.find((task) => task.task_id === id)?.column).toBe(3);
		}
	});
});
