#!/usr/bin/env bun
/**
 * Reversible local Claude Code setup for the Grok thinking engine.
 *
 *   bun scripts/claude-setup.ts apply                 # marketplace + plugin + systemd unit; env only once /healthz answers
 *   bun scripts/claude-setup.ts refresh               # reinstall the plugin from this checkout + restart the proxy
 *   bun scripts/claude-setup.ts status                # what is configured right now (never prints tokens)
 *   bun scripts/claude-setup.ts rollback [--snapshot] # revert the owned keys (or restore the backup byte-for-byte)
 *
 * Exit codes: 0 ok · 1 error · 2 usage, or apply finished but the proxy never answered (env not applied).
 */
import { claudeConfigPaths, loadConfig } from "../src/config.ts";
import { EnvNotAppliedError, apply, defaultSetupPaths, refresh, rollback, status } from "../src/setup/claude.ts";

const USAGE = "usage: bun scripts/claude-setup.ts apply | refresh | status | rollback [--snapshot]";

function usage(): number {
	process.stderr.write(`${USAGE}\n`);
	return 2;
}

async function main(): Promise<number> {
	const [verb = "status", ...flags] = process.argv.slice(2);
	if (flags.length > 0 && (verb !== "rollback" || flags.some((flag) => flag !== "--snapshot"))) return usage();
	const paths = defaultSetupPaths();
	const config = loadConfig(claudeConfigPaths(process.cwd()));
	let lines: string[];
	switch (verb) {
		case "apply":
			try {
				lines = await apply(paths, config);
			} catch (error) {
				if (!(error instanceof EnvNotAppliedError)) throw error;
				process.stdout.write(`${error.lines.join("\n")}\n`);
				process.stderr.write(`${error.message}\n`);
				return 2;
			}
			break;
		case "refresh":
			lines = await refresh(paths, config);
			break;
		case "rollback":
			lines = await rollback(paths, undefined, { snapshot: flags.includes("--snapshot") });
			break;
		case "status":
			lines = await status(paths, config);
			break;
		default:
			return usage();
	}
	process.stdout.write(`${lines.join("\n")}\n`);
	return 0;
}

main().then(
	(code) => process.exit(code),
	(error: unknown) => {
		process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
		process.exit(1);
	},
);
