export interface SwarmConfig {
	/** After Prompt Uplift succeeds, detach orch_plan + swarm_run. */
	enabled: boolean;
	/** Agent-swarm checkout. Empty = SWARM_ROOT, else <cwd>/agent-swarm, else /root/src/repos/agent-swarm. */
	root: string;
	runtime: "auto" | "claude" | "grok";
	/** When true, swarm_run --dry-run (no live LLM). */
	dryRun: boolean;
}

export const DEFAULT_SWARM_CONFIG: SwarmConfig = {
	enabled: true,
	root: "",
	runtime: "auto",
	dryRun: false,
};
