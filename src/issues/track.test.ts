import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { KtuiRunner } from "./kanban.ts";
import { refreshSnapshot, syncAllIssues, trackUpliftedPrompt } from "./track.ts";
import { DEFAULT_BOARD_NAME } from "./types.ts";

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
