import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Server } from "bun";
import { defaultConfig } from "../config.ts";
import { DEFAULT_GROK_CONFIG } from "../grok/types.ts";
import {
	PLUGIN_ID,
	type AppliedSettings,
	type Runner,
	type SetupPaths,
	type SetupState,
	apply,
	applySettings,
	plannedEnv,
	refresh,
	renderUnit,
	rollback,
	rollbackSettings,
} from "./claude.ts";

const PLUGIN_ROOT = "/opt/aio-plugin";
const ENV = {
	ANTHROPIC_BASE_URL: "http://127.0.0.1:41417",
	ANTHROPIC_DEFAULT_HAIKU_MODEL: "grok-4.6",
};

function realShapedSettings(): Record<string, unknown> {
	return {
		model: "claude-fable-5-1[1m]",
		enabledPlugins: { "hypergrok@hypergrok": true },
		extraKnownMarketplaces: {
			hypergrok: { source: { source: "directory", path: "/root/src/repos/hypergrok" } },
		},
	};
}

function stateFrom(result: AppliedSettings): SetupState {
	return {
		appliedAt: "2026-01-01T00:00:00.000Z",
		backupPath: "",
		previousEnv: result.previousEnv,
		previousPlugin: result.previousPlugin,
		unitInstalled: false,
	};
}

describe("applySettings", () => {
	test("adds env, marketplace, and plugin without touching the rest and records absent previous values", () => {
		const original = realShapedSettings();
		const { next, previousEnv, previousPlugin } = applySettings(original, ENV, PLUGIN_ROOT);

		expect(next.model).toBe("claude-fable-5-1[1m]");
		expect(next.env).toEqual(ENV);
		expect(next.extraKnownMarketplaces).toEqual({
			hypergrok: { source: { source: "directory", path: "/root/src/repos/hypergrok" } },
			aio: { source: { source: "directory", path: PLUGIN_ROOT } },
		});
		expect(next.enabledPlugins).toEqual({ "hypergrok@hypergrok": true, [PLUGIN_ID]: true });
		expect(previousEnv).toEqual({ ANTHROPIC_BASE_URL: null, ANTHROPIC_DEFAULT_HAIKU_MODEL: null });
		expect(previousPlugin).toEqual({ enabled: null, marketplace: null });
		expect(original).toEqual(realShapedSettings());
	});

	test("records existing values so a differing prior config can be restored", () => {
		const settings = {
			env: { ANTHROPIC_BASE_URL: "https://api.anthropic.com", OTHER: "keep" },
			enabledPlugins: { [PLUGIN_ID]: false },
			extraKnownMarketplaces: { aio: { source: { source: "github", repo: "x/y" } } },
		};
		const { next, previousEnv, previousPlugin } = applySettings(settings, ENV, PLUGIN_ROOT);
		expect(previousEnv).toEqual({ ANTHROPIC_BASE_URL: "https://api.anthropic.com", ANTHROPIC_DEFAULT_HAIKU_MODEL: null });
		expect(previousPlugin).toEqual({ enabled: false, marketplace: { source: { source: "github", repo: "x/y" } } });
		expect((next.env as Record<string, string>).OTHER).toBe("keep");
		expect(rollbackSettings(next, stateFrom({ next, previousEnv, previousPlugin }))).toEqual(settings);
	});

	test("is idempotent", () => {
		const first = applySettings(realShapedSettings(), ENV, PLUGIN_ROOT);
		const second = applySettings(first.next, ENV, PLUGIN_ROOT);
		expect(second.next).toEqual(first.next);
	});
});

describe("rollbackSettings", () => {
	test("inverts applySettings back to the original file shape", () => {
		const original = realShapedSettings();
		const applied = applySettings(original, ENV, PLUGIN_ROOT);
		const restored = rollbackSettings(applied.next, stateFrom(applied));
		expect(restored).toEqual(original);
		expect("env" in restored).toBe(false);
	});

	test("restores an empty starting file to empty", () => {
		const applied = applySettings({}, ENV, PLUGIN_ROOT);
		expect(rollbackSettings(applied.next, stateFrom(applied))).toEqual({});
	});
});

describe("renderUnit", () => {
	test("runs the proxy under bun with restart-always", () => {
		const unit = renderUnit({ bun: "/usr/local/bin/bun", pluginRoot: PLUGIN_ROOT, home: "/root" });
		expect(unit).toContain(`ExecStart=/usr/local/bin/bun ${PLUGIN_ROOT}/src/grok/proxy.ts`);
		expect(unit).toContain("Restart=always");
		expect(unit).toContain("Environment=HOME=/root");
		expect(unit).toContain(`WorkingDirectory=${PLUGIN_ROOT}`);
		expect(unit).toContain("WantedBy=multi-user.target");
	});
});

describe("plannedEnv", () => {
	test("derives base URL and haiku model from the proxy config", () => {
		const config = defaultConfig();
		config.grok = {
			...DEFAULT_GROK_CONFIG,
			proxy: { ...DEFAULT_GROK_CONFIG.proxy, host: "127.0.0.2", port: 5555, haikuModel: "grok-4.6-mini" },
		};
		const env = plannedEnv(config);
		expect(env.ANTHROPIC_BASE_URL).toBe("http://127.0.0.2:5555");
		expect(env.ANTHROPIC_DEFAULT_HAIKU_MODEL).toBe("grok-4.6-mini");
		expect(env.ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME).toBe("Grok 4.6 Ultra");
	});
});

describe("apply / refresh / rollback", () => {
	const dirs: string[] = [];
	const servers: Server<undefined>[] = [];
	afterEach(() => {
		for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
		for (const server of servers.splice(0)) server.stop(true);
	});

	function paths(): SetupPaths {
		const root = mkdtempSync(join(tmpdir(), "aio-setup-"));
		dirs.push(root);
		return {
			claudeDir: join(root, "claude"),
			settingsPath: join(root, "claude", "settings.json"),
			stateDir: join(root, "state"),
			pluginRoot: PLUGIN_ROOT,
			unitPath: join(root, "systemd", "aio-grok-proxy.service"),
		};
	}

	/** Fake `run`: `systemctl is-active` answers the given codes in order (last one repeats); everything else succeeds. */
	function fakeRunner(isActive: number[] = [3, 0], onInstall?: () => void) {
		const calls: string[][] = [];
		const codes = [...isActive];
		const run: Runner = async (cmd) => {
			calls.push(cmd);
			if (cmd[0] === "claude" && cmd[1] === "--version") return { code: 0, out: "2.1.272 (Claude Code)" };
			if (cmd[0] === "claude" && cmd[2] === "install") onInstall?.();
			if (cmd[0] === "systemctl" && cmd[1] === "is-active") return { code: codes.length > 1 ? (codes.shift() as number) : codes[0], out: "" };
			return { code: 0, out: "" };
		};
		return { run, calls, joined: () => calls.map((cmd) => cmd.join(" ")) };
	}

	/** Config whose proxy URL answers `/healthz` (a local server) or points at a closed port. */
	function configFor(healthy: boolean) {
		const config = defaultConfig();
		if (healthy) {
			const server = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: () => new Response("ok") });
			servers.push(server);
			config.grok.proxy.port = server.port ?? 0;
		} else {
			config.grok.proxy.port = 1;
		}
		return config;
	}

	function writeOriginal(p: SetupPaths): string {
		const original = `${JSON.stringify(realShapedSettings(), null, 2)}\n`;
		mkdirSync(p.claudeDir, { recursive: true });
		writeFileSync(p.settingsPath, original);
		return original;
	}

	function readJson<T>(path: string): T {
		return JSON.parse(readFileSync(path, "utf8")) as T;
	}

	type Settings = { model?: string; env?: Record<string, string>; enabledPlugins?: Record<string, boolean> };

	test("a second apply keeps the first pre-change snapshot, restarts the live unit, and rollback returns to the original", async () => {
		const p = paths();
		const original = writeOriginal(p);
		const { run, joined } = fakeRunner([3, 0]);
		const config = configFor(true);

		await apply(p, config, run, { healthzTimeoutMs: 0 });
		const firstState = readJson<SetupState>(join(p.stateDir, "setup-state.json"));
		expect(readFileSync(firstState.backupPath, "utf8")).toBe(original);
		expect(firstState.previousEnv.ANTHROPIC_BASE_URL).toBeNull();
		let cmds = joined();
		expect(cmds).not.toContain(`claude plugin uninstall ${PLUGIN_ID}`);
		expect(cmds).toContain("systemctl enable --now aio-grok-proxy.service");
		// plugin install lands before the unit is started, and the env is written only after healthz.
		expect(cmds.indexOf(`claude plugin install ${PLUGIN_ID}`)).toBeLessThan(cmds.indexOf("systemctl daemon-reload"));

		const lines = await apply(p, config, run, { healthzTimeoutMs: 0 });
		const secondState = readJson<SetupState>(join(p.stateDir, "setup-state.json"));
		expect(secondState.backupPath).toBe(firstState.backupPath);
		expect(secondState.appliedAt).toBe(firstState.appliedAt);
		expect(lines.some((line) => line.includes("keeping its pre-change snapshot"))).toBe(true);
		cmds = joined();
		expect(cmds).toContain(`claude plugin uninstall ${PLUGIN_ID}`);
		expect(cmds).toContain("systemctl restart aio-grok-proxy.service");
		const applied = readJson<Settings>(p.settingsPath);
		expect(applied.env?.ANTHROPIC_DEFAULT_HAIKU_MODEL).toBe(DEFAULT_GROK_CONFIG.proxy.haikuModel);
		expect(applied.env?.ANTHROPIC_BASE_URL).toBe(`http://127.0.0.1:${config.grok.proxy.port}`);

		await rollback(p, run);
		expect(readJson<Settings>(p.settingsPath)).toEqual(realShapedSettings());
		expect(existsSync(join(p.stateDir, "setup-state.json"))).toBe(false);
		expect(existsSync(p.unitPath)).toBe(false);
	});

	test("a never-healthy proxy enables the plugin but never writes ANTHROPIC_BASE_URL, then throws after saving state", async () => {
		const p = paths();
		writeOriginal(p);
		// The claude CLI rewrites settings.json during install; that change must survive our write.
		const { run } = fakeRunner([3], () => {
			const current = readJson<Settings>(p.settingsPath);
			current.enabledPlugins = { ...current.enabledPlugins, "other@x": true };
			writeFileSync(p.settingsPath, JSON.stringify(current, null, 2));
		});
		const config = configFor(false);

		await expect(apply(p, config, run, { healthzTimeoutMs: 0 })).rejects.toThrow("proxy not reachable on http://127.0.0.1:1; env not applied");

		const settings = readJson<Settings>(p.settingsPath);
		expect(settings.env?.ANTHROPIC_BASE_URL).toBeUndefined();
		expect(settings.enabledPlugins?.[PLUGIN_ID]).toBe(true);
		expect(settings.enabledPlugins?.["other@x"]).toBe(true);
		expect(existsSync(join(p.stateDir, "setup-state.json"))).toBe(true);
		expect(existsSync(`${p.settingsPath}.tmp`)).toBe(false);

		// A broken re-apply after a healthy one must drop the stale env instead of leaving it dead.
		writeFileSync(p.settingsPath, JSON.stringify({ ...settings, env: { ANTHROPIC_BASE_URL: "http://127.0.0.1:1", KEEP: "1" } }, null, 2));
		await expect(apply(p, config, run, { healthzTimeoutMs: 0 })).rejects.toThrow("env not applied");
		expect(readJson<Settings>(p.settingsPath).env).toEqual({ KEEP: "1" });
	});

	test("rollback reverts only the owned keys by default, keeping a model changed after apply", async () => {
		const p = paths();
		writeOriginal(p);
		const { run } = fakeRunner();
		await apply(p, configFor(true), run, { healthzTimeoutMs: 0 });

		const edited = readJson<Settings>(p.settingsPath);
		edited.model = "claude-opus-4-1";
		writeFileSync(p.settingsPath, `${JSON.stringify(edited, null, 2)}\n`);

		const lines = await rollback(p, run);
		expect(lines.some((line) => line.includes("reverted key-by-key"))).toBe(true);
		expect(readJson<Settings>(p.settingsPath)).toEqual({ ...realShapedSettings(), model: "claude-opus-4-1" });
	});

	test("rollback --snapshot restores the exact pre-apply bytes", async () => {
		const p = paths();
		const original = writeOriginal(p);
		const { run } = fakeRunner();
		await apply(p, configFor(true), run, { healthzTimeoutMs: 0 });

		const edited = readJson<Settings>(p.settingsPath);
		edited.model = "claude-opus-4-1";
		writeFileSync(p.settingsPath, JSON.stringify(edited));

		const lines = await rollback(p, run, { snapshot: true });
		expect(lines.some((line) => line.includes("byte-for-byte"))).toBe(true);
		expect(readFileSync(p.settingsPath, "utf8")).toBe(original);
	});

	test("refresh reinstalls the plugin and restarts the unit without touching settings", async () => {
		const p = paths();
		const original = writeOriginal(p);
		mkdirSync(join(p.unitPath, ".."), { recursive: true });
		writeFileSync(p.unitPath, "[Unit]\n");
		const { run, joined } = fakeRunner();

		await refresh(p, configFor(false), run, { healthzTimeoutMs: 0 });
		expect(joined()).toEqual([
			`claude plugin uninstall ${PLUGIN_ID}`,
			`claude plugin install ${PLUGIN_ID}`,
			"systemctl restart aio-grok-proxy.service",
		]);
		expect(readFileSync(p.settingsPath, "utf8")).toBe(original);
	});
});
