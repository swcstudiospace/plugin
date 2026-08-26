import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export interface AioConfig {
	uplift: { enabled: boolean; skipTrivial: boolean; maxChars: number; echo: boolean };
}

export function defaultConfig(): AioConfig {
	return {
		uplift: {
			enabled: true,
			skipTrivial: true,
			maxChars: 20000,
			echo: true,
		},
	};
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return undefined;
	return value as Record<string, unknown>;
}

function readJson(path: string): unknown {
	try {
		if (!existsSync(path)) return undefined;
		return JSON.parse(readFileSync(path, "utf8")) as unknown;
	} catch {
		return undefined;
	}
}

export function loadConfig(): AioConfig {
	const defaults = defaultConfig();
	const dir = process.env.PI_CODING_AGENT_DIR?.trim() || join(homedir(), ".omp", "agent");
	const file = asRecord(readJson(join(dir, "all-in-one.json")));
	if (!file) return defaults;
	const uplift = asRecord(file.uplift);
	if (!uplift) return defaults;
	return {
		uplift: {
			enabled: typeof uplift.enabled === "boolean" ? uplift.enabled : defaults.uplift.enabled,
			skipTrivial: typeof uplift.skipTrivial === "boolean" ? uplift.skipTrivial : defaults.uplift.skipTrivial,
			maxChars:
				typeof uplift.maxChars === "number" && Number.isFinite(uplift.maxChars) && uplift.maxChars >= 0
					? uplift.maxChars
					: defaults.uplift.maxChars,
			echo: typeof uplift.echo === "boolean" ? uplift.echo : defaults.uplift.echo,
		},
	};
}
