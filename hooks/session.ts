#!/usr/bin/env bun
/**
 * Claude Code SessionStart hook: make sure the local aio-grok-proxy (Haiku-tier →
 * Grok 4.6) is listening. If it is not, start the systemd unit when one is installed,
 * otherwise spawn the proxy detached; wait briefly either way. Only speaks up when
 * the proxy still cannot be reached; always exits 0.
 */
import { existsSync, mkdirSync, openSync } from "node:fs";
import { dirname, join } from "node:path";
import { claudeConfigPaths, loadConfig } from "../src/config.ts";
import { isChildInvocation } from "../src/claude/complete.ts";
import { defaultStateDir } from "../src/claude/state.ts";

const POLL_MS = 250;
const WAIT_MS = 3_000;
const UNIT = "aio-grok-proxy.service";
const UNIT_PATH = `/etc/systemd/system/${UNIT}`;

async function main(): Promise<void> {
	if (isChildInvocation()) return;
	let input: { cwd?: string } = {};
	try {
		input = JSON.parse(await new Response(Bun.stdin.stream()).text()) as typeof input;
	} catch {
		// stdin is optional here; a missing or malformed payload only loses cwd
	}
	const cwd = input.cwd?.trim() || process.cwd();
	const config = loadConfig(claudeConfigPaths(cwd));
	if (!config.grok.enabled || !config.grok.proxy.enabled) return;

	const { host, port } = config.grok.proxy;
	const url = `http://${host}:${port}/healthz`;
	async function healthy(): Promise<boolean> {
		try {
			return (await fetch(url, { signal: AbortSignal.timeout(800) })).status === 200;
		} catch {
			return false;
		}
	}
	if (await healthy()) return;

	async function waitHealthy(): Promise<boolean> {
		const deadline = Date.now() + WAIT_MS;
		while (Date.now() < deadline) {
			await Bun.sleep(POLL_MS);
			if (await healthy()) return true;
		}
		return false;
	}

	if (existsSync(UNIT_PATH)) {
		try {
			await Bun.spawn(["systemctl", "start", UNIT], { stdin: "ignore", stdout: "ignore", stderr: "ignore" }).exited;
		} catch {
			// systemctl missing or refused; fall through to the self-spawn
		}
		if (await waitHealthy()) return;
	}

	const pluginRoot = dirname(dirname(import.meta.path));
	const logDir = join(defaultStateDir(), "proxy");
	mkdirSync(logDir, { recursive: true });
	const log = openSync(join(logDir, "proxy.log"), "a");
	const proc = Bun.spawn([process.execPath, join(pluginRoot, "src", "grok", "proxy.ts")], {
		cwd: pluginRoot,
		stdin: "ignore",
		stdout: log,
		stderr: log,
		detached: true,
		env: process.env,
	});
	proc.unref();

	if (await waitHealthy()) return;
	process.stdout.write(
		JSON.stringify({
			systemMessage: `aio-grok-proxy not reachable on http://${host}:${port}; Haiku-tier calls will fail until it runs (bun scripts/claude-setup.ts status)`,
		}),
	);
}

main().catch(() => process.exit(0));
