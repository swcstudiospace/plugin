#!/usr/bin/env bun
/**
 * Claude Code SessionStart hook: make sure the local aio-grok-proxy (Haiku-tier →
 * Grok 4.6) is listening. If it is not, spawn it detached and wait briefly. Only
 * speaks up when the proxy still cannot be reached; always exits 0.
 */
import { mkdirSync, openSync } from "node:fs";
import { dirname, join } from "node:path";
import { claudeConfigPaths, loadConfig } from "../src/config.ts";
import { isChildInvocation } from "../src/claude/complete.ts";
import { defaultStateDir } from "../src/claude/state.ts";

const POLL_MS = 250;
const WAIT_MS = 3_000;

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

	const deadline = Date.now() + WAIT_MS;
	while (Date.now() < deadline) {
		await Bun.sleep(POLL_MS);
		if (await healthy()) return;
	}
	process.stdout.write(
		JSON.stringify({
			systemMessage: `aio-grok-proxy not reachable on http://${host}:${port}; Haiku-tier calls will fail until it runs (bun scripts/claude-setup.ts status)`,
		}),
	);
}

main().catch(() => process.exit(0));
