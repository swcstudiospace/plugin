import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
	ensureExtraDirs,
	isAllowedPath,
	parseLocalFolder,
	upArgs,
	workspaceIdFor,
	wrapBashCommand,
} from "./workspace.ts";

describe("workspaceIdFor", () => {
	test("slugs basename to omp- prefix, max 40, [a-z0-9-]", () => {
		const id = workspaceIdFor("/tmp/My Repo");
		expect(id.startsWith("omp-")).toBe(true);
		expect(id).toContain("my-repo");
		expect(id.length).toBeLessThanOrEqual(40);
		expect(id).toMatch(/^[a-z0-9-]+$/);
		expect(id).toBe("omp-my-repo");
	});
});

describe("upArgs", () => {
	test("returns source, id, and --open-ide=false", () => {
		expect(upArgs("/tmp/My Repo", "omp-my-repo")).toEqual([
			"/tmp/My Repo",
			"--id",
			"omp-my-repo",
			"--open-ide=false",
		]);
	});
});

describe("parseLocalFolder", () => {
	test("reads source.localFolder from matching id in JSON array", () => {
		const json = JSON.stringify([
			{ id: "other", source: { localFolder: "/tmp/other" } },
			{ id: "omp-my-repo", source: { localFolder: "/tmp/My Repo" } },
		]);
		expect(parseLocalFolder(json, "omp-my-repo")).toBe("/tmp/My Repo");
		expect(parseLocalFolder(json, "missing")).toBeUndefined();
		expect(parseLocalFolder("not-json", "omp-my-repo")).toBeUndefined();
	});
});

describe("isAllowedPath", () => {
	const root = "/work/app";
	const extra = "/tmp/pod-extra";

	test("allows paths under the workspace root", () => {
		expect(isAllowedPath("/work/app/src", [root])).toBe(true);
		expect(isAllowedPath("/work/app", [root])).toBe(true);
	});

	test("denies /etc/passwd", () => {
		expect(isAllowedPath("/etc/passwd", [root, extra])).toBe(false);
	});

	test("allows extraDir roots", () => {
		expect(isAllowedPath("/tmp/pod-extra/cache", [root, extra])).toBe(true);
	});

	test("denies .. escape", () => {
		expect(isAllowedPath("/work/app/src/../../etc/passwd", [root])).toBe(false);
		expect(isAllowedPath(resolve(root, "..", "other"), [root])).toBe(false);
	});
});

describe("wrapBashCommand", () => {
	test("wraps unless the command already starts with the bin", () => {
		expect(wrapBashCommand("ls -la", { bin: "devpod", id: "omp-my-repo" })).toBe(
			"devpod ssh omp-my-repo --command ls -la",
		);
		expect(wrapBashCommand("devpod ssh omp-my-repo --command ls", { bin: "devpod", id: "omp-my-repo" })).toBe(
			"devpod ssh omp-my-repo --command ls",
		);
		expect(wrapBashCommand("  devpod up .", { bin: "devpod", id: "omp-my-repo" })).toBe("  devpod up .");
	});
});

describe("ensureExtraDirs", () => {
	test("mkdirs relative extra dirs and skips empty", () => {
		const cwd = mkdtempSync(join(tmpdir(), "omp-pod-ws-"));
		try {
			const dirs = ensureExtraDirs(cwd, ["scratch", "", "  ", "nested/cache"]);
			expect(dirs).toEqual([resolve(cwd, "scratch"), resolve(cwd, "nested/cache")]);
			expect(existsSync(dirs[0]!)).toBe(true);
			expect(existsSync(dirs[1]!)).toBe(true);
		} finally {
			rmSync(cwd, { recursive: true, force: true });
		}
	});
});
