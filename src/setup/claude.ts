/**
 * Reversible local Claude Code setup for the Grok thinking engine.
 *
 * `apply` registers this checkout as the `aio` marketplace, installs the
 * plugin, installs a systemd unit for the proxy, and only once `/healthz`
 * answers points Claude Code's Haiku tier at the proxy (settings.json env) —
 * so a dead `ANTHROPIC_BASE_URL` is never written. Every change is recorded
 * in `<stateDir>/setup-state.json` next to a byte-for-byte backup of
 * settings.json so `rollback` is a single command.
 *
 * The pure helpers (`applySettings`, `rollbackSettings`, `renderUnit`,
 * `plannedEnv`) never touch the filesystem; `apply`/`refresh`/`rollback`/
 * `status` wire them to disk, systemd, and the `claude` CLI through an
 * injectable `run`.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { defaultStateDir } from "../claude/state.ts";
import type { AioConfig } from "../config.ts";
import { grokAuthStatus } from "../grok/auth.ts";

export interface SetupPaths {
	claudeDir: string;
	settingsPath: string;
	stateDir: string;
	pluginRoot: string;
	unitPath: string;
}

export interface SetupState {
	appliedAt: string;
	/** Empty when settings.json did not exist at apply time. */
	backupPath: string;
	claudeVersion?: string;
	previousEnv: Record<string, string | null>;
	previousPlugin: { enabled: boolean | null; marketplace: unknown | null };
	unitInstalled: boolean;
}

export type Runner = (cmd: string[]) => Promise<{ code: number; out: string }>;

export interface ApplyOptions {
	/** How long `apply`/`refresh` wait for `/healthz` before giving up (default 5000). */
	healthzTimeoutMs?: number;
}

export interface RollbackOptions {
	/** Restore the pre-apply backup byte-for-byte instead of reverting the owned keys of the current file. */
	snapshot?: boolean;
}

/** Thrown by `apply` after the state file is written when the proxy never answered `/healthz`. */
export class EnvNotAppliedError extends Error {
	constructor(
		url: string,
		readonly lines: string[],
	) {
		super(`proxy not reachable on ${url}; env not applied`);
		this.name = "EnvNotAppliedError";
	}
}

export const UNIT_NAME = "aio-grok-proxy.service";
export const PLUGIN_ID = "all-in-one@aio";
const MARKETPLACE_KEY = "aio";
const ENV_KEYS = [
	"ANTHROPIC_BASE_URL",
	"ANTHROPIC_DEFAULT_HAIKU_MODEL",
	"ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME",
	"ANTHROPIC_DEFAULT_HAIKU_MODEL_DESCRIPTION",
] as const;

export function defaultSetupPaths(env: Record<string, string | undefined> = process.env): SetupPaths {
	const claudeDir = env.CLAUDE_CONFIG_DIR?.trim() || join(homedir(), ".claude");
	return {
		claudeDir,
		settingsPath: join(claudeDir, "settings.json"),
		stateDir: defaultStateDir(env),
		pluginRoot: resolve(import.meta.dir, "..", ".."),
		unitPath: `/etc/systemd/system/${UNIT_NAME}`,
	};
}

export function proxyUrl(config: AioConfig): string {
	return `http://${config.grok.proxy.host}:${config.grok.proxy.port}`;
}

export function plannedEnv(config: AioConfig): Record<string, string> {
	return {
		ANTHROPIC_BASE_URL: proxyUrl(config),
		ANTHROPIC_DEFAULT_HAIKU_MODEL: config.grok.proxy.haikuModel,
		ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME: "Grok 4.6 Ultra",
		ANTHROPIC_DEFAULT_HAIKU_MODEL_DESCRIPTION: "Grok 4.6 @ xhigh via SuperGrok Heavy OAuth · thinking + background model",
	};
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return undefined;
	return value as Record<string, unknown>;
}

export interface AppliedSettings {
	next: Record<string, unknown>;
	previousEnv: Record<string, string | null>;
	previousPlugin: SetupState["previousPlugin"];
}

export function applySettings(
	settings: Record<string, unknown>,
	env: Record<string, string>,
	pluginRoot: string,
): AppliedSettings {
	const next = structuredClone(settings);
	const currentEnv = asRecord(next.env) ?? {};
	const previousEnv: Record<string, string | null> = {};
	for (const key of Object.keys(env)) {
		const before = currentEnv[key];
		previousEnv[key] = typeof before === "string" ? before : null;
	}
	next.env = { ...currentEnv, ...env };

	const marketplaces = asRecord(next.extraKnownMarketplaces) ?? {};
	const previousMarketplace = MARKETPLACE_KEY in marketplaces ? structuredClone(marketplaces[MARKETPLACE_KEY]) : null;
	next.extraKnownMarketplaces = {
		...marketplaces,
		[MARKETPLACE_KEY]: { source: { source: "directory", path: pluginRoot } },
	};

	const plugins = asRecord(next.enabledPlugins) ?? {};
	const previousEnabled = typeof plugins[PLUGIN_ID] === "boolean" ? (plugins[PLUGIN_ID] as boolean) : null;
	next.enabledPlugins = { ...plugins, [PLUGIN_ID]: true };

	return { next, previousEnv, previousPlugin: { enabled: previousEnabled, marketplace: previousMarketplace } };
}

function restoreKey(container: Record<string, unknown>, key: string, previous: unknown): void {
	if (previous === null || previous === undefined) delete container[key];
	else container[key] = structuredClone(previous);
}

function dropIfEmpty(settings: Record<string, unknown>, key: string): void {
	const record = asRecord(settings[key]);
	if (record && Object.keys(record).length === 0) delete settings[key];
}

function revertEnv(settings: Record<string, unknown>, previousEnv: Record<string, string | null>): void {
	const env = asRecord(settings.env);
	if (!env) return;
	for (const [key, previous] of Object.entries(previousEnv)) restoreKey(env, key, previous);
	settings.env = env;
	dropIfEmpty(settings, "env");
}

export function rollbackSettings(settings: Record<string, unknown>, state: SetupState): Record<string, unknown> {
	const next = structuredClone(settings);
	revertEnv(next, state.previousEnv);

	const marketplaces = asRecord(next.extraKnownMarketplaces);
	if (marketplaces) {
		restoreKey(marketplaces, MARKETPLACE_KEY, state.previousPlugin.marketplace);
		next.extraKnownMarketplaces = marketplaces;
		dropIfEmpty(next, "extraKnownMarketplaces");
	}

	const plugins = asRecord(next.enabledPlugins);
	if (plugins) {
		restoreKey(plugins, PLUGIN_ID, state.previousPlugin.enabled);
		next.enabledPlugins = plugins;
		dropIfEmpty(next, "enabledPlugins");
	}

	return next;
}

export function renderUnit(opts: { bun: string; pluginRoot: string; home: string }): string {
	return [
		"[Unit]",
		"Description=AIO Grok proxy (Anthropic-compatible router: Haiku-tier → grok-4.6)",
		"After=network-online.target",
		"Wants=network-online.target",
		"",
		"[Service]",
		"Type=simple",
		`Environment=HOME=${opts.home}`,
		`WorkingDirectory=${opts.pluginRoot}`,
		`ExecStart=${opts.bun} ${join(opts.pluginRoot, "src/grok/proxy.ts")}`,
		"Restart=always",
		"RestartSec=2",
		"",
		"[Install]",
		"WantedBy=multi-user.target",
		"",
	].join("\n");
}

export const defaultRunner: Runner = async (cmd) => {
	try {
		const proc = Bun.spawn(cmd, { stdout: "pipe", stderr: "pipe", stdin: "ignore" });
		const [stdout, stderr, code] = await Promise.all([
			new Response(proc.stdout).text(),
			new Response(proc.stderr).text(),
			proc.exited,
		]);
		return { code, out: `${stdout}${stderr}`.trim() };
	} catch (error) {
		return { code: 127, out: error instanceof Error ? error.message : String(error) };
	}
};

function firstLine(text: string): string {
	return text.split("\n").find((line) => line.trim().length > 0)?.trim() ?? "";
}

function readSettings(path: string): Record<string, unknown> {
	if (!existsSync(path)) return {};
	const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
	const record = asRecord(parsed);
	if (!record) throw new Error(`${path} is not a JSON object`);
	return record;
}

/** Indentation of an existing JSON file (first indented line), so a rewrite keeps the user's formatting. */
function detectIndent(path: string): string {
	if (!existsSync(path)) return "\t";
	const match = readFileSync(path, "utf8").match(/\n([ \t]+)\S/);
	return match?.[1] ?? "\t";
}

/** Write via `<path>.tmp` + rename so a crash mid-write never leaves a truncated settings.json. */
function writeAtomic(path: string, data: string | Buffer): void {
	mkdirSync(dirname(path), { recursive: true });
	const tmp = `${path}.tmp`;
	writeFileSync(tmp, data);
	renameSync(tmp, path);
}

function writeSettings(path: string, settings: Record<string, unknown>): void {
	const indent = detectIndent(path);
	writeAtomic(path, `${JSON.stringify(settings, null, indent)}\n`);
}

function statePath(paths: SetupPaths): string {
	return join(paths.stateDir, "setup-state.json");
}

function readState(paths: SetupPaths): SetupState | undefined {
	const path = statePath(paths);
	if (!existsSync(path)) return undefined;
	const parsed = asRecord(JSON.parse(readFileSync(path, "utf8")));
	if (!parsed || !asRecord(parsed.previousEnv) || !asRecord(parsed.previousPlugin)) {
		throw new Error(`${path} is malformed`);
	}
	return parsed as unknown as SetupState;
}

async function healthz(url: string, timeoutMs: number): Promise<boolean> {
	try {
		const response = await fetch(`${url}/healthz`, { signal: AbortSignal.timeout(timeoutMs) });
		return response.ok;
	} catch {
		return false;
	}
}

async function waitHealthz(url: string, totalMs: number, stepMs = 500): Promise<boolean> {
	const deadline = Date.now() + totalMs;
	while (true) {
		if (await healthz(url, stepMs)) return true;
		if (Date.now() >= deadline) return false;
		await Bun.sleep(stepMs);
	}
}

async function claudeVersion(run: Runner): Promise<string | undefined> {
	const result = await run(["claude", "--version"]);
	if (result.code !== 0) return undefined;
	return firstLine(result.out).split(/\s+/)[0] || undefined;
}

/** Run one command and record `<label> → <code> <first output line>`; non-zero is reported, never thrown. */
async function step(lines: string[], run: Runner, cmd: string[], label = cmd.join(" ")): Promise<{ code: number; out: string }> {
	const result = await run(cmd);
	lines.push(`${label} → ${result.code}${result.code === 0 ? "" : " (warning)"} ${firstLine(result.out)}`.trimEnd());
	return result;
}

/**
 * `claude plugin update` is version-gated and skips a same-version directory source, so uninstall + install is
 * the only way to push edited plugin files into Claude Code's plugin cache.
 */
async function reinstallPlugin(lines: string[], run: Runner, reinstall: boolean): Promise<void> {
	if (reinstall) await step(lines, run, ["claude", "plugin", "uninstall", PLUGIN_ID], `claude plugin uninstall ${PLUGIN_ID} (refresh)`);
	await step(lines, run, ["claude", "plugin", "install", PLUGIN_ID]);
}

/** `enable --now` is a no-op for a running unit, so a live unit is restarted to pick up the rewritten file. */
async function startUnit(lines: string[], run: Runner): Promise<void> {
	await step(lines, run, ["systemctl", "daemon-reload"]);
	const active = await run(["systemctl", "is-active", UNIT_NAME]);
	await step(lines, run, active.code === 0 ? ["systemctl", "restart", UNIT_NAME] : ["systemctl", "enable", "--now", UNIT_NAME]);
}

export async function apply(
	paths: SetupPaths,
	config: AioConfig,
	run: Runner = defaultRunner,
	opts: ApplyOptions = {},
): Promise<string[]> {
	const lines: string[] = [];

	const settings = readSettings(paths.settingsPath);
	lines.push(existsSync(paths.settingsPath) ? `read ${paths.settingsPath}` : `${paths.settingsPath} absent; starting from {}`);

	// A second apply (after editing the plugin) must keep the ORIGINAL pre-change snapshot so rollback still
	// restores the state before the first apply, not the already-applied one.
	const existing = readState(paths);
	const appliedAt = existing?.appliedAt ?? new Date().toISOString();
	let backupPath = existing?.backupPath ?? "";
	if (existing) {
		lines.push(`setup state exists (applied ${existing.appliedAt}); keeping its pre-change snapshot`);
	} else if (existsSync(paths.settingsPath)) {
		const backupDir = join(paths.stateDir, "backups");
		mkdirSync(backupDir, { recursive: true });
		backupPath = join(backupDir, `settings.json.${appliedAt.replace(/:/g, "-")}`);
		writeFileSync(backupPath, readFileSync(paths.settingsPath));
		lines.push(`backup → ${backupPath}`);
	}

	// Previous values are captured from the file as it was BEFORE anything below touches it.
	const env = plannedEnv(config);
	const before = applySettings(settings, env, paths.pluginRoot);
	const previousEnv = existing?.previousEnv ?? before.previousEnv;
	const previousPlugin = existing?.previousPlugin ?? before.previousPlugin;

	await step(lines, run, ["claude", "plugin", "marketplace", "add", paths.pluginRoot]);
	await reinstallPlugin(lines, run, existing !== undefined);

	let unitInstalled = false;
	const unit = renderUnit({ bun: process.execPath, pluginRoot: paths.pluginRoot, home: homedir() });
	try {
		mkdirSync(dirname(paths.unitPath), { recursive: true });
		writeFileSync(paths.unitPath, unit);
		unitInstalled = true;
		lines.push(`unit → ${paths.unitPath}`);
	} catch (error) {
		const code = (error as NodeJS.ErrnoException).code ?? "error";
		lines.push(`unit not written (${code}): ${paths.unitPath}; run the proxy from the SessionStart hook instead`);
	}
	if (unitInstalled) await startUnit(lines, run);

	const url = proxyUrl(config);
	const healthy = await waitHealthz(url, opts.healthzTimeoutMs ?? 5000);
	lines.push(healthy ? `proxy listening on ${url}` : `proxy not listening on ${url}`);

	// The claude CLI rewrites settings.json (enabledPlugins) during install/uninstall: re-read so its changes
	// survive, then add our keys. The env keys are written only once the proxy answers; a stale copy of them
	// from an earlier apply is reverted so Claude Code never carries a dead ANTHROPIC_BASE_URL.
	const applied = applySettings(readSettings(paths.settingsPath), healthy ? env : {}, paths.pluginRoot);
	if (!healthy) revertEnv(applied.next, previousEnv);
	writeSettings(paths.settingsPath, applied.next);
	if (healthy) for (const [key, value] of Object.entries(env)) lines.push(`settings env ${key}=${value}`);
	else lines.push("settings env: not applied (proxy unreachable)");
	lines.push(`settings extraKnownMarketplaces.${MARKETPLACE_KEY} → ${paths.pluginRoot}`);
	lines.push(`settings enabledPlugins["${PLUGIN_ID}"] = true`);

	const state: SetupState = {
		appliedAt,
		backupPath,
		claudeVersion: await claudeVersion(run),
		previousEnv,
		previousPlugin,
		unitInstalled,
	};
	mkdirSync(paths.stateDir, { recursive: true });
	writeFileSync(statePath(paths), `${JSON.stringify(state, null, "\t")}\n`);
	lines.push(`state → ${statePath(paths)}`);

	if (!healthy) {
		lines.push(
			`proxy not reachable on ${url}; ANTHROPIC_BASE_URL not applied — fix the unit (journalctl -u aio-grok-proxy) and re-run apply`,
		);
		throw new EnvNotAppliedError(url, lines);
	}
	return lines;
}

/** Push the current checkout into Claude Code's plugin cache and restart the proxy; settings.json is untouched. */
export async function refresh(
	paths: SetupPaths,
	config: AioConfig,
	run: Runner = defaultRunner,
	opts: ApplyOptions = {},
): Promise<string[]> {
	const lines: string[] = [];
	await reinstallPlugin(lines, run, true);
	if (existsSync(paths.unitPath)) await step(lines, run, ["systemctl", "restart", UNIT_NAME]);
	else lines.push(`unit ${paths.unitPath} absent; proxy not restarted`);
	const url = proxyUrl(config);
	lines.push((await waitHealthz(url, opts.healthzTimeoutMs ?? 5000)) ? `proxy listening on ${url}` : `proxy not listening on ${url}`);
	return lines;
}

function restoreSettings(lines: string[], paths: SetupPaths, state: SetupState, snapshot: boolean): void {
	if (snapshot && state.backupPath && existsSync(state.backupPath)) {
		writeAtomic(paths.settingsPath, readFileSync(state.backupPath));
		lines.push(`settings restored byte-for-byte from ${state.backupPath} (--snapshot)`);
		return;
	}
	if (snapshot) {
		lines.push(state.backupPath ? `backup ${state.backupPath} missing; reverting key-by-key` : "no pre-apply file; reverting key-by-key");
	}
	if (!existsSync(paths.settingsPath)) {
		lines.push("settings.json absent; nothing to restore");
		return;
	}
	const restored = rollbackSettings(readSettings(paths.settingsPath), state);
	if (!state.backupPath && Object.keys(restored).length === 0) {
		rmSync(paths.settingsPath, { force: true });
		lines.push("settings removed (did not exist before apply)");
		return;
	}
	writeSettings(paths.settingsPath, restored);
	lines.push(
		`settings reverted key-by-key; other keys kept${state.backupPath ? ` (--snapshot restores ${state.backupPath} byte-for-byte)` : ""}`,
	);
}

export async function rollback(paths: SetupPaths, run: Runner = defaultRunner, opts: RollbackOptions = {}): Promise<string[]> {
	const lines: string[] = [];
	const state = readState(paths);
	if (!state) throw new Error(`nothing to roll back: ${statePath(paths)} missing`);

	restoreSettings(lines, paths, state, opts.snapshot === true);

	if (state.unitInstalled || existsSync(paths.unitPath)) {
		await step(lines, run, ["systemctl", "disable", "--now", UNIT_NAME]);
		try {
			rmSync(paths.unitPath, { force: true });
			lines.push(`unit removed: ${paths.unitPath}`);
		} catch (error) {
			lines.push(`unit not removed (${(error as NodeJS.ErrnoException).code ?? "error"}): ${paths.unitPath}`);
		}
		await step(lines, run, ["systemctl", "daemon-reload"]);
	}

	await step(lines, run, ["claude", "plugin", "uninstall", PLUGIN_ID]);

	rmSync(statePath(paths), { force: true });
	lines.push(`state removed: ${statePath(paths)}`);
	return lines;
}

function spawnSyncText(cmd: string[]): { code: number; out: string } | undefined {
	try {
		const result = Bun.spawnSync(cmd, { stdout: "pipe", stderr: "pipe", stdin: "ignore" });
		return { code: result.exitCode, out: `${result.stdout.toString()}${result.stderr.toString()}`.trim() };
	} catch {
		return undefined;
	}
}

export async function status(paths: SetupPaths, config: AioConfig): Promise<string[]> {
	const lines: string[] = [];
	const version = spawnSyncText(["claude", "--version"]);
	lines.push(version && version.code === 0 ? `claude: ${firstLine(version.out)}` : "claude: not found on PATH");

	let settings: Record<string, unknown> = {};
	try {
		settings = readSettings(paths.settingsPath);
		lines.push(`settings: ${paths.settingsPath}${existsSync(paths.settingsPath) ? "" : " (absent)"}`);
	} catch (error) {
		lines.push(`settings: ${paths.settingsPath} unreadable (${error instanceof Error ? error.message : String(error)})`);
	}
	const env = asRecord(settings.env) ?? {};
	const planned = plannedEnv(config);
	for (const key of ENV_KEYS) {
		const value = env[key];
		if (typeof value !== "string") lines.push(`  env ${key}: absent`);
		else lines.push(`  env ${key}=${value}${value === planned[key] ? "" : ` (planned: ${planned[key]})`}`);
	}
	const marketplace = asRecord(settings.extraKnownMarketplaces)?.[MARKETPLACE_KEY];
	const marketplacePath = asRecord(asRecord(marketplace)?.source)?.path;
	lines.push(
		marketplace
			? `  marketplace ${MARKETPLACE_KEY}: ${typeof marketplacePath === "string" ? marketplacePath : JSON.stringify(marketplace)}`
			: `  marketplace ${MARKETPLACE_KEY}: absent`,
	);
	const enabled = asRecord(settings.enabledPlugins)?.[PLUGIN_ID];
	lines.push(`  plugin ${PLUGIN_ID}: ${enabled === undefined ? "absent" : enabled === true ? "enabled" : "disabled"}`);

	const state = existsSync(statePath(paths));
	lines.push(state ? `setup state: applied (${statePath(paths)})` : "setup state: not applied");

	if (existsSync(paths.unitPath)) {
		const active = spawnSyncText(["systemctl", "is-active", UNIT_NAME]);
		lines.push(`unit: ${paths.unitPath} present · ${active ? firstLine(active.out) || `exit ${active.code}` : "systemctl unavailable"}`);
	} else {
		lines.push(`unit: ${paths.unitPath} absent`);
	}

	const url = proxyUrl(config);
	const listening = await healthz(url, 1500);
	lines.push(listening ? `proxy: listening on ${url}` : `proxy: not listening on ${url}`);
	if (!listening && typeof env.ANTHROPIC_BASE_URL === "string") {
		lines.push(
			`BROKEN: ANTHROPIC_BASE_URL set but proxy not listening → Claude Code cannot reach the API; run systemctl start ${UNIT_NAME} or bun scripts/claude-setup.ts rollback`,
		);
	}

	const auth = grokAuthStatus(config.grok.home || undefined);
	if (!auth.loggedIn) lines.push(`SuperGrok OAuth: not logged in (run grok login) · ${auth.home}`);
	else if (auth.expired) lines.push(`SuperGrok OAuth: expired${auth.email ? ` (${auth.email})` : ""} · run grok login`);
	else lines.push(`SuperGrok OAuth: ${auth.email ?? "logged in"} · expires ${auth.expiresAt ?? "unknown"}`);

	lines.push(`engine: ${config.grok.model}@${config.grok.reasoningEffort}`);
	lines.push("planned env:");
	for (const [key, value] of Object.entries(planned)) lines.push(`  ${key}=${value}`);
	return lines;
}
