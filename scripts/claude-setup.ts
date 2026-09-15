#!/usr/bin/env bun
/**
 * Reversible local Claude Code setup for the Grok thinking engine.
 *
 *   bun scripts/claude-setup.ts apply     # settings.json env + marketplace + plugin + systemd unit
 *   bun scripts/claude-setup.ts status    # what is configured right now (never prints tokens)
 *   bun scripts/claude-setup.ts rollback  # restore the byte-for-byte backup and remove the unit
 */
import { claudeConfigPaths, loadConfig } from "../src/config.ts";
import { apply, defaultSetupPaths, rollback, status } from "../src/setup/claude.ts";

const USAGE = "usage: bun scripts/claude-setup.ts apply|rollback|status";

async function main(): Promise<number> {
	const [verb = "status"] = process.argv.slice(2);
	const paths = defaultSetupPaths();
	const config = loadConfig(claudeConfigPaths(process.cwd()));
	let lines: string[];
	switch (verb) {
		case "apply":
			lines = await apply(paths, config);
			break;
		case "rollback":
			lines = await rollback(paths);
			break;
		case "status":
			lines = await status(paths, config);
			break;
		default:
			process.stderr.write(`${USAGE}\n`);
			return 2;
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
