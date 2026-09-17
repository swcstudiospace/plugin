/**
 * After the all-in-one UserPromptSubmit hook uplifts a prompt, start AgentSwarm
 * without waiting for the parent model to spawn subagents.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { SwarmConfig } from "./types.ts";

const POSITIVE = [
	"implement",
	"feature",
	"bug",
	"fix",
	"refactor",
	"release",
	"deploy",
	"hotfix",
	"requirements",
	"architecture",
	"code review",
	"security audit",
	"run the swarm",
	"agent-swarm",
	"a01-orchestrator",
	"build a",
	"build me",
];
const NEGATIVE = ["/uplift", "/think", "what is", "explain only", "/all-in-one:"];

export const SWARM_CONTEXT = `## AgentSwarm orchestration (mandatory)

Prompt Uplift finished. AgentSwarm is starting autonomously (orch_plan + swarm_run detached) from the uplifted spec.
Load skill \`agent-swarm-orchestrate\`. Do not implement domain work in the parent session.
A01 owns the plan and spawns a02–a15. The detached runner uses \`python3 scripts/swarm_run.py --runtime auto\`.
`;

export function isSdlcPrompt(prompt: string): boolean {
	const low = prompt.toLowerCase();
	if (NEGATIVE.some((n) => low.includes(n))) return false;
	return POSITIVE.some((p) => low.includes(p));
}

export function resolveSwarmRoot(cwd: string, configured: string): string {
	if (configured.trim()) return configured.trim();
	const env = process.env.SWARM_ROOT?.trim();
	if (env) return env;
	const nested = join(cwd, "agent-swarm");
	if (existsSync(join(nested, "scripts", "swarm_run.py"))) return nested;
	const fallback = "/root/src/repos/agent-swarm";
	if (existsSync(join(fallback, "scripts", "swarm_run.py"))) return fallback;
	return nested;
}

export interface KickoffInput {
	cwd: string;
	/** The user's original prompt: used only to decide whether this is SDLC work. */
	prompt: string;
	/** Uplifted XML spec on disk; when present A01 plans from it instead of the raw prompt. */
	specPath?: string;
	config: SwarmConfig;
	spawn?: (argv: string[], cwd: string) => void;
}

export interface KickoffResult {
	kicked: boolean;
	reason?: string;
	root?: string;
}

export function defaultSpawn(argv: string[], cwd: string): void {
	const child = spawn(argv[0]!, argv.slice(1), {
		cwd,
		detached: true,
		stdio: "ignore",
		env: process.env,
	});
	child.unref();
}

export function kickoffSwarm(input: KickoffInput): KickoffResult {
	if (!input.config.enabled) return { kicked: false, reason: "disabled" };
	if (process.env.AIO_SWARM === "0") return { kicked: false, reason: "disabled-env" };
	if (!isSdlcPrompt(input.prompt)) return { kicked: false, reason: "not-sdlc" };
	const root = resolveSwarmRoot(input.cwd, input.config.root);
	const script = join(root, "hooks", "autonomous_run.py");
	if (!existsSync(script)) return { kicked: false, reason: "missing-runner" };
	const argv = [
		"python3",
		script,
		"--cwd",
		input.cwd,
		"--brief",
		input.prompt,
		"--runtime",
		input.config.runtime,
		"--swarm-root",
		root,
	];
	if (input.specPath?.trim()) argv.push("--spec", input.specPath.trim());
	if (input.config.dryRun) argv.push("--dry-run");
	try {
		(input.spawn ?? defaultSpawn)(argv, root);
	} catch (error) {
		return { kicked: false, reason: error instanceof Error ? error.message : String(error), root };
	}
	return { kicked: true, root };
}
