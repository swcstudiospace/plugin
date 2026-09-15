import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { DEFAULT_BOARD_NAME, type IssuesConfig } from "./issues/types.ts";
import { DEFAULT_GITHUB_ORG, type GithubConfig, type GreptileConfig, type SupabaseConfig } from "./mcp/types.ts";
import { MAX_NODES, MIN_NODES, type ThinkConfig } from "./think/types.ts";
import { DEFAULT_LSP_CONFIG, type LspConfig } from "./lsp/types.ts";
import { DEFAULT_POD_CONFIG, type PodConfig } from "./pod/types.ts";

export interface ClaudeConfig {
	/** `claude` binary used for headless completions. */
	bin: string;
	/** Model alias/name for the uplift and thinking calls; empty inherits the user default. */
	model: string;
	/** Allow extended thinking in child calls (slower). */
	thinking: boolean;
	/** `--setting-sources` for child calls; empty loads none (fastest, no nested hooks). */
	settingSources: string;
	/** Per-call timeout for one headless completion. */
	callTimeoutMs: number;
	/** Whole-hook budget; the hook returns whatever it has when this is exhausted. */
	budgetMs: number;
	/** Parallel Chain-of-Thought fills per dependency level. */
	concurrency: number;
	/** Print a one-line summary to the user after each uplift. */
	echo: boolean;
}

export const DEFAULT_CLAUDE_CONFIG: ClaudeConfig = {
	bin: "claude",
	model: "sonnet",
	thinking: false,
	settingSources: "",
	callTimeoutMs: 120_000,
	budgetMs: 540_000,
	concurrency: 3,
	echo: true,
};

export interface AioConfig {
	uplift: { enabled: boolean; skipTrivial: boolean; maxChars: number; echo: boolean };
	claude: ClaudeConfig;
	issues: IssuesConfig;
	think: ThinkConfig;
	github: GithubConfig;
	greptile: GreptileConfig;
	supabase: SupabaseConfig;
	lsp: LspConfig;
	pod: PodConfig;
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
		think: {
			enabled: true,
			minNodes: MIN_NODES,
			maxNodes: MAX_NODES,
		},
		github: {
			org: DEFAULT_GITHUB_ORG,
			autoPr: true,
		},
		greptile: {
			requiredForMerge: true,
			bin: "greptile",
			minConfidence: 5,
		},
		supabase: {
			enabled: true,
		},
		claude: { ...DEFAULT_CLAUDE_CONFIG },
		lsp: { ...DEFAULT_LSP_CONFIG },
		pod: { ...DEFAULT_POD_CONFIG },
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

function mergeThink(think: Record<string, unknown> | undefined, defaults: ThinkConfig): ThinkConfig {
	if (!think) return defaults;
	const minNodes =
		typeof think.minNodes === "number" && Number.isInteger(think.minNodes) && think.minNodes >= 1
			? think.minNodes
			: defaults.minNodes;
	const maxNodes =
		typeof think.maxNodes === "number" && Number.isInteger(think.maxNodes) && think.maxNodes >= minNodes
			? Math.min(think.maxNodes, MAX_NODES)
			: defaults.maxNodes;
	return {
		enabled: typeof think.enabled === "boolean" ? think.enabled : defaults.enabled,
		minNodes: Math.min(minNodes, maxNodes),
		maxNodes,
	};
}

function mergeClaude(claude: Record<string, unknown> | undefined, defaults: ClaudeConfig): ClaudeConfig {
	if (!claude) return defaults;
	const positive = (value: unknown, fallback: number): number =>
		typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
	return {
		bin: typeof claude.bin === "string" && claude.bin.trim() ? claude.bin.trim() : defaults.bin,
		model: typeof claude.model === "string" ? claude.model.trim() : defaults.model,
		thinking: typeof claude.thinking === "boolean" ? claude.thinking : defaults.thinking,
		settingSources: typeof claude.settingSources === "string" ? claude.settingSources.trim() : defaults.settingSources,
		callTimeoutMs: positive(claude.callTimeoutMs, defaults.callTimeoutMs),
		budgetMs: positive(claude.budgetMs, defaults.budgetMs),
		concurrency: Math.max(1, Math.floor(positive(claude.concurrency, defaults.concurrency))),
		echo: typeof claude.echo === "boolean" ? claude.echo : defaults.echo,
	};
}

function mergeGithub(github: Record<string, unknown> | undefined, defaults: GithubConfig): GithubConfig {
	if (!github) return defaults;
	return {
		org: typeof github.org === "string" && github.org.trim() ? github.org.trim() : defaults.org,
		autoPr: typeof github.autoPr === "boolean" ? github.autoPr : defaults.autoPr,
	};
}

function mergeGreptile(greptile: Record<string, unknown> | undefined, defaults: GreptileConfig): GreptileConfig {
	if (!greptile) return defaults;
	const minConfidence =
		typeof greptile.minConfidence === "number" && Number.isFinite(greptile.minConfidence)
			? Math.min(5, Math.max(1, greptile.minConfidence))
			: defaults.minConfidence;
	return {
		requiredForMerge:
			typeof greptile.requiredForMerge === "boolean" ? greptile.requiredForMerge : defaults.requiredForMerge,
		bin: typeof greptile.bin === "string" && greptile.bin.trim() ? greptile.bin.trim() : defaults.bin,
		minConfidence,
	};
}

function mergeSupabase(supabase: Record<string, unknown> | undefined, defaults: SupabaseConfig): SupabaseConfig {
	if (!supabase) return defaults;
	return {
		enabled: typeof supabase.enabled === "boolean" ? supabase.enabled : defaults.enabled,
	};
}

function mergeLsp(lsp: Record<string, unknown> | undefined, defaults: LspConfig): LspConfig {
	if (!lsp) return defaults;
	return {
		...defaults,
		enabled: typeof lsp.enabled === "boolean" ? lsp.enabled : defaults.enabled,
	};
}

function mergePod(pod: Record<string, unknown> | undefined, defaults: PodConfig): PodConfig {
	if (!pod) return defaults;
	const extraDirs = Array.isArray(pod.extraDirs)
		? pod.extraDirs.filter((dir): dir is string => typeof dir === "string" && dir.length > 0)
		: defaults.extraDirs;
	return {
		enabled: typeof pod.enabled === "boolean" ? pod.enabled : defaults.enabled,
		bin: typeof pod.bin === "string" && pod.bin.trim() ? pod.bin.trim() : defaults.bin,
		workspaceId: typeof pod.workspaceId === "string" ? pod.workspaceId : defaults.workspaceId,
		extraDirs,
		nexusUrl:
			typeof pod.nexusUrl === "string" && pod.nexusUrl.trim() ? pod.nexusUrl.trim() : defaults.nexusUrl,
		readyTimeoutMs:
			typeof pod.readyTimeoutMs === "number" &&
			Number.isFinite(pod.readyTimeoutMs) &&
			pod.readyTimeoutMs > 0
				? pod.readyTimeoutMs
				: defaults.readyTimeoutMs,
		pollMs:
			typeof pod.pollMs === "number" && Number.isFinite(pod.pollMs) && pod.pollMs > 0
				? pod.pollMs
				: defaults.pollMs,
		dteeUrl: typeof pod.dteeUrl === "string" && pod.dteeUrl.trim() ? pod.dteeUrl.trim() : defaults.dteeUrl,
	};
}

export function mergeConfig(file: Record<string, unknown> | undefined, base: AioConfig): AioConfig {
	if (!file) return base;
	return {
		uplift: mergeUplift(asRecord(file.uplift), base.uplift),
		claude: mergeClaude(asRecord(file.claude), base.claude),
		issues: mergeIssues(asRecord(file.issues), base.issues),
		think: mergeThink(asRecord(file.think), base.think),
		github: mergeGithub(asRecord(file.github), base.github),
		greptile: mergeGreptile(asRecord(file.greptile), base.greptile),
		supabase: mergeSupabase(asRecord(file.supabase), base.supabase),
		lsp: mergeLsp(asRecord(file.lsp), base.lsp),
		pod: mergePod(asRecord(file.pod), base.pod),
	};
}

export function ompConfigPath(env: Record<string, string | undefined> = process.env): string {
	const dir = env.PI_CODING_AGENT_DIR?.trim() || join(homedir(), ".omp", "agent");
	return join(dir, "all-in-one.json");
}

/** Config files for the Claude Code plugin path, lowest precedence first. */
export function claudeConfigPaths(cwd: string, env: Record<string, string | undefined> = process.env): string[] {
	const home = env.CLAUDE_CONFIG_DIR?.trim() || join(homedir(), ".claude");
	return [ompConfigPath(env), join(home, "all-in-one.json"), join(cwd, ".claude", "all-in-one.json")];
}

/** Loads config from `files` in order (later files win). Defaults to the OMP file only. */
export function loadConfig(files: string[] = [ompConfigPath()]): AioConfig {
	let config = defaultConfig();
	for (const file of files) {
		config = mergeConfig(asRecord(readJson(file)), config);
	}
	return config;
}
