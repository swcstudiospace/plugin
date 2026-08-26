import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { DEFAULT_BOARD_NAME, type IssuesConfig } from "./issues/types.ts";

export interface AioConfig {
	uplift: { enabled: boolean; skipTrivial: boolean; maxChars: number; echo: boolean };
	issues: IssuesConfig;
}

export function defaultConfig(): AioConfig {
	return {
		uplift: {
			enabled: true,
			skipTrivial: true,
			maxChars: 20000,
			echo: true,
		},
		issues: {
			enabled: true,
			boardName: DEFAULT_BOARD_NAME,
			ktuiBin: "ktui",
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

function mergeUplift(
	uplift: Record<string, unknown> | undefined,
	defaults: AioConfig["uplift"],
): AioConfig["uplift"] {
	if (!uplift) return defaults;
	return {
		enabled: typeof uplift.enabled === "boolean" ? uplift.enabled : defaults.enabled,
		skipTrivial: typeof uplift.skipTrivial === "boolean" ? uplift.skipTrivial : defaults.skipTrivial,
		maxChars:
			typeof uplift.maxChars === "number" && Number.isFinite(uplift.maxChars) && uplift.maxChars >= 0
				? uplift.maxChars
				: defaults.maxChars,
		echo: typeof uplift.echo === "boolean" ? uplift.echo : defaults.echo,
	};
}

function mergeIssues(issues: Record<string, unknown> | undefined, defaults: IssuesConfig): IssuesConfig {
	if (!issues) return defaults;
	return {
		enabled: typeof issues.enabled === "boolean" ? issues.enabled : defaults.enabled,
		boardName:
			typeof issues.boardName === "string" && issues.boardName.trim()
				? issues.boardName.trim()
				: defaults.boardName,
		ktuiBin:
			typeof issues.ktuiBin === "string" && issues.ktuiBin.trim() ? issues.ktuiBin.trim() : defaults.ktuiBin,
		echo: typeof issues.echo === "boolean" ? issues.echo : defaults.echo,
	};
}

export function loadConfig(): AioConfig {
	const defaults = defaultConfig();
	const dir = process.env.PI_CODING_AGENT_DIR?.trim() || join(homedir(), ".omp", "agent");
	const file = asRecord(readJson(join(dir, "all-in-one.json")));
	if (!file) return defaults;
	return {
		uplift: mergeUplift(asRecord(file.uplift), defaults.uplift),
		issues: mergeIssues(asRecord(file.issues), defaults.issues),
	};
}
