import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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

describe("apply / rollback", () => {
	const dirs: string[] = [];
	afterEach(() => {
		for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
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

	test("a second apply keeps the first pre-change snapshot so rollback returns to the original file", async () => {
		const p = paths();
		const original = `${JSON.stringify(realShapedSettings(), null, 2)}\n`;
		mkdirSync(p.claudeDir, { recursive: true });
		writeFileSync(p.settingsPath, original);
		const calls: string[][] = [];
		const run: Runner = async (cmd) => {
			calls.push(cmd);
			return { code: 0, out: cmd[0] === "claude" && cmd[1] === "--version" ? "2.1.272 (Claude Code)" : "" };
		};
		const config = defaultConfig();
		config.grok.proxy.port = 1; // nothing listens: healthz wait must not throw

		await apply(p, config, run);
		const firstState = JSON.parse(readFileSync(join(p.stateDir, "setup-state.json"), "utf8")) as SetupState;
		expect(readFileSync(firstState.backupPath, "utf8")).toBe(original);
		expect(firstState.previousEnv.ANTHROPIC_BASE_URL).toBeNull();
		expect(calls.some((cmd) => cmd.join(" ") === `claude plugin uninstall ${PLUGIN_ID}`)).toBe(false);

		const lines = await apply(p, config, run);
		const secondState = JSON.parse(readFileSync(join(p.stateDir, "setup-state.json"), "utf8")) as SetupState;
		expect(secondState.backupPath).toBe(firstState.backupPath);
		expect(secondState.appliedAt).toBe(firstState.appliedAt);
		expect(lines.some((line) => line.includes("keeping its pre-change snapshot"))).toBe(true);
		expect(calls.some((cmd) => cmd.join(" ") === `claude plugin uninstall ${PLUGIN_ID}`)).toBe(true);
		const applied = JSON.parse(readFileSync(p.settingsPath, "utf8")) as { env?: Record<string, string> };
		expect(applied.env?.ANTHROPIC_DEFAULT_HAIKU_MODEL).toBe(DEFAULT_GROK_CONFIG.proxy.haikuModel);

		await rollback(p, run);
		expect(readFileSync(p.settingsPath, "utf8")).toBe(original);
		expect(existsSync(join(p.stateDir, "setup-state.json"))).toBe(false);
		expect(existsSync(p.unitPath)).toBe(false);
	}, 30_000);
});
