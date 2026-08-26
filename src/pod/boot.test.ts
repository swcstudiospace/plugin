import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import type { CliResult, CliRunner } from "../mcp/types.ts";
import { bootPod, probeAnda, probeDtee, upWorkspace, waitUntilReady } from "./boot.ts";
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

function readyRunner(id: string, cwd: string, statusStates: string[] = ["Running"]) {
	let statusCalls = 0;
	return runner(async (_bin, args) => {
		if (args[0] === "status") {
			const state = statusStates[Math.min(statusCalls, statusStates.length - 1)] ?? "Busy";
			statusCalls += 1;
			return { stdout: JSON.stringify({ id, state }), stderr: "", code: 0 };
		}
		if (args[0] === "ssh") {
			return { stdout: "", stderr: "", code: 0 };
		}
		if (args[0] === "list") {
			return {
				stdout: JSON.stringify([{ id, source: { localFolder: cwd } }]),
				stderr: "",
				code: 0,
			};
		}
		return { stdout: "ok", stderr: "", code: 0 };
	});
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

describe("probeDtee", () => {
	test("mock fetch 200 is active", async () => {
		const probe = await probeDtee("http://127.0.0.1:8443", async () => ({ ok: true, status: 200 }));
		expect(probe.active).toBe(true);
		expect(probe.dteeUrl).toBe("http://127.0.0.1:8443");
	});

	test("thrown fetch is inactive", async () => {
		const probe = await probeDtee("http://127.0.0.1:8443", async () => {
			throw new Error("ECONNREFUSED");
		});
		expect(probe.active).toBe(false);
		expect(probe.dteeUrl).toBe("http://127.0.0.1:8443");
	});
});

describe("waitUntilReady", () => {
	test("Busy then Running then ssh 0 is ready", async () => {
		const run = readyRunner("omp-ws", "/tmp/ws", ["Busy", "Running"]);
		const ready = await waitUntilReady({
			run,
			bin: "devpod",
			id: "omp-ws",
			timeoutMs: 50,
			pollMs: 1,
			sleep: async () => {},
		});
		expect(ready.ready).toBe(true);
		expect(run.calls.map((c) => c.args[0])).toEqual(["status", "status", "ssh"]);
	});
});

describe("bootPod", () => {
	test("mkdir extra, calls up then list, connected when up exits 0", async () => {
		const cwd = mkdtempSync(join(tmpdir(), "omp-pod-boot-"));
		const id = workspaceIdFor(cwd);
		const run = readyRunner(id, cwd);
		try {
			const session = await bootPod({
				run,
				cwd,
				config: { enabled: true, extraDirs: ["scratch"] },
				fetchFn: async (url) => {
					if (url.includes("8443")) throw new Error("ECONNREFUSED");
					return { ok: true, status: 200 };
				},
				env: {},
			});
			expect(existsSync(resolve(cwd, "scratch"))).toBe(true);
			expect(run.calls.map((c) => c.args[0])).toEqual(["up", "status", "ssh", "list"]);
			expect(run.calls[0]?.args).toEqual(["up", cwd, "--id", id, "--open-ide=false"]);
			expect(run.calls[1]?.args).toEqual(["status", id, "--output", "json"]);
			expect(run.calls[2]?.args).toEqual(["ssh", id, "--command", "true"]);
			expect(run.calls[3]?.args).toEqual(["list", "--output", "json"]);
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

	test("Busy status then Running then ssh 0 is connected", async () => {
		const cwd = mkdtempSync(join(tmpdir(), "omp-pod-busy-"));
		const id = workspaceIdFor(cwd);
		const run = readyRunner(id, cwd, ["Busy", "Running"]);
		const progress: string[] = [];
		try {
			const session = await bootPod({
				run,
				cwd,
				config: { enabled: true, pollMs: 1, readyTimeoutMs: 50 },
				fetchFn: async (url) => {
					if (url.includes("8443")) throw new Error("ECONNREFUSED");
					return { ok: true, status: 200 };
				},
				env: {},
				sleep: async () => {},
				onProgress: (msg) => progress.push(msg),
			});
			expect(session.connected).toBe(true);
			expect(run.calls.map((c) => c.args[0])).toEqual(["up", "status", "status", "ssh", "list"]);
			expect(progress).toContain("waiting for codespace…");
		} finally {
			rmSync(cwd, { recursive: true, force: true });
		}
	});

	test("status never Running within timeout is connected false", async () => {
		const cwd = mkdtempSync(join(tmpdir(), "omp-pod-timeout-"));
		const id = workspaceIdFor(cwd);
		const run = readyRunner(id, cwd, ["Busy"]);
		let t = 0;
		try {
			const session = await bootPod({
				run,
				cwd,
				config: { enabled: true, pollMs: 1, readyTimeoutMs: 5 },
				env: {},
				sleep: async () => {},
				now: () => t++,
			});
			expect(session.connected).toBe(false);
			expect(session.reason).toContain("not ready");
			expect(run.calls.some((c) => c.args[0] === "list")).toBe(false);
		} finally {
			rmSync(cwd, { recursive: true, force: true });
		}
	});

	test("dtee fetch 200 is true and throw is false", async () => {
		const cwd = mkdtempSync(join(tmpdir(), "omp-pod-dtee-"));
		const id = workspaceIdFor(cwd);
		try {
			const ok = await bootPod({
				run: readyRunner(id, cwd),
				cwd,
				config: { enabled: true },
				fetchFn: async () => ({ ok: true, status: 200 }),
				env: {},
			});
			expect(ok.connected).toBe(true);
			expect(ok.dtee).toBe(true);
			expect(ok.engineActive).toBe(true);

			const miss = await bootPod({
				run: readyRunner(id, cwd),
				cwd,
				config: { enabled: true },
				fetchFn: async () => {
					throw new Error("ECONNREFUSED");
				},
				env: {},
			});
			expect(miss.connected).toBe(true);
			expect(miss.dtee).toBe(false);
			expect(miss.engineActive).toBe(false);
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
