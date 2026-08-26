import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import type { CliResult, CliRunner } from "../mcp/types.ts";
import { bootPod, probeAnda, upWorkspace } from "./boot.ts";
import { workspaceIdFor } from "./workspace.ts";

function runner(
	impl: (bin: string, args: string[], cwd?: string) => CliResult | Promise<CliResult>,
): CliRunner & { calls: Array<{ bin: string; args: string[]; cwd?: string }> } {
	const calls: Array<{ bin: string; args: string[]; cwd?: string }> = [];
	const run: CliRunner = async (bin, args, cwd) => {
		calls.push({ bin, args, cwd });
		return impl(bin, args, cwd);
	};
	return Object.assign(run, { calls });
}

describe("probeAnda", () => {
	test("mock fetch 200 is active", async () => {
		const probe = await probeAnda("http://127.0.0.1:8091", async () => ({ ok: true, status: 200 }));
		expect(probe.active).toBe(true);
		expect(probe.nexusUrl).toBe("http://127.0.0.1:8091");
	});

	test("thrown fetch is inactive", async () => {
		const probe = await probeAnda("http://127.0.0.1:8091", async () => {
			throw new Error("ECONNREFUSED");
		});
		expect(probe.active).toBe(false);
		expect(probe.nexusUrl).toBe("http://127.0.0.1:8091");
	});
});

describe("bootPod", () => {
	test("mkdir extra, calls up then list, connected when up exits 0", async () => {
		const cwd = mkdtempSync(join(tmpdir(), "omp-pod-boot-"));
		const id = workspaceIdFor(cwd);
		const run = runner(async (_bin, args) => {
			if (args[0] === "list") {
				return {
					stdout: JSON.stringify([{ id, source: { localFolder: cwd } }]),
					stderr: "",
					code: 0,
				};
			}
			return { stdout: "ok", stderr: "", code: 0 };
		});
		try {
			const session = await bootPod({
				run,
				cwd,
				config: { enabled: true, extraDirs: ["scratch"] },
				fetchFn: async () => ({ ok: true, status: 200 }),
				env: {},
			});
			expect(existsSync(resolve(cwd, "scratch"))).toBe(true);
			expect(run.calls.map((c) => c.args[0])).toEqual(["up", "list"]);
			expect(run.calls[0]?.args).toEqual(["up", cwd, "--id", id, "--open-ide=false"]);
			expect(run.calls[1]?.args).toEqual(["list", "--output", "json"]);
			expect(session.connected).toBe(true);
			expect(session.enabled).toBe(true);
			expect(session.dtee).toBe(false);
			expect(session.engineActive).toBe(true);
			expect(session.localFolder).toBe(cwd);
			expect(session.extraDirs).toEqual([resolve(cwd, "scratch")]);
			expect(session.workspaceId).toBe(id);
		} finally {
			rmSync(cwd, { recursive: true, force: true });
		}
	});

	test("missing bin code 127 is connected false and never throws", async () => {
		const cwd = mkdtempSync(join(tmpdir(), "omp-pod-miss-"));
		const run = runner(async () => ({ stdout: "", stderr: "devpod: not found", code: 127 }));
		try {
			const session = await bootPod({
				run,
				cwd,
				config: { enabled: true, extraDirs: ["scratch"] },
				env: {},
			});
			expect(session.connected).toBe(false);
			expect(session.enabled).toBe(true);
			expect(session.dtee).toBe(false);
			expect(session.reason).toContain("not found");
			expect(existsSync(resolve(cwd, "scratch"))).toBe(true);
			expect(session.extraDirs).toEqual([resolve(cwd, "scratch")]);
			expect(session.localFolder).toBe(cwd);
		} finally {
			rmSync(cwd, { recursive: true, force: true });
		}
	});

	test("throwing runner is connected false and never throws", async () => {
		const cwd = mkdtempSync(join(tmpdir(), "omp-pod-throw-"));
		const run = runner(async () => {
			throw new Error("spawn devpod ENOENT");
		});
		try {
			const session = await bootPod({
				run,
				cwd,
				config: { enabled: true },
				env: {},
			});
			expect(session.connected).toBe(false);
			expect(session.reason).toContain("ENOENT");
		} finally {
			rmSync(cwd, { recursive: true, force: true });
		}
	});
});

describe("upWorkspace", () => {
	test("never throws and reports ok from exit code", async () => {
		const ok = await upWorkspace({
			run: runner(async () => ({ stdout: "", stderr: "", code: 0 })),
			bin: "devpod",
			source: "/tmp/src",
			id: "omp-src",
		});
		expect(ok.ok).toBe(true);
		expect(ok.code).toBe(0);

		const miss = await upWorkspace({
			run: runner(async () => {
				throw new Error("missing");
			}),
			bin: "devpod",
			source: "/tmp/src",
			id: "omp-src",
		});
		expect(miss.ok).toBe(false);
		expect(miss.code).toBe(127);
	});
});
