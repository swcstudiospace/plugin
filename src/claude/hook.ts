/**
 * Orchestrates one UserPromptSubmit event for the Claude Code plugin path.
 *
 * Mirrors the OMP `input` handler in src/index.ts: decide → uplift → Graph of Thought
 * with per-node Chain of Thought → write a Tissue parent plus one sub-issue per node →
 * sync to the kanban → return the spec as hook context. Everything after "decide" is
 * fail-open: the user's prompt always goes through.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { AioConfig } from "../config.ts";
import type { KtuiRunner } from "../issues/kanban.ts";
import { advanceTrackedIssues, trackThoughtGraph, trackUpliftedPrompt } from "../issues/track.ts";
import type { GithubAssoc, GraphSyncResult, SyncResult } from "../issues/types.ts";
import { runThink } from "../think/pipeline.ts";
import type { ThoughtGraph } from "../think/types.ts";
import type { UpliftResult, UpliftState } from "../types.ts";
import { decideUplift } from "../uplift/detect.ts";
import { runUplift } from "../uplift/run.ts";
import type { ClaudeCompleter } from "./complete.ts";
import { formatPromptContext, formatSummary } from "./output.ts";
import { type ControlState, type SessionRecord, sessionPath, writeControl, writeSession } from "./state.ts";

export interface PromptSubmitInput {
	session_id?: string;
	transcript_path?: string;
	cwd?: string;
	prompt?: string;
	hook_event_name?: string;
}

export interface HookOutput {
	hookSpecificOutput: { hookEventName: "UserPromptSubmit"; additionalContext: string };
	systemMessage?: string;
}

export interface HookDeps {
	config: AioConfig;
	control: ControlState;
	complete: ClaudeCompleter;
	ktui: KtuiRunner;
	stateDir: string;
	github?: (cwd: string) => GithubAssoc | undefined;
	conversation?: (transcriptPath?: string) => string;
	now?: () => number;
	log?: (message: string) => void;
}

export interface PromptSubmitResult {
	output?: HookOutput;
	record?: SessionRecord;
	skipped?: string;
}

function specFile(stateDir: string, sessionId: string): string {
	return sessionPath(stateDir, sessionId).replace(/\.json$/, ".xml");
}

export async function runPromptSubmit(input: PromptSubmitInput, deps: HookDeps): Promise<PromptSubmitResult> {
	const now = deps.now ?? Date.now;
	const started = now();
	const log = deps.log ?? (() => {});
	const cwd = input.cwd?.trim() || process.cwd();
	const sessionId = input.session_id?.trim() || "unknown";

	const state: UpliftState = {
		enabled: deps.control.enabled ?? deps.config.uplift.enabled,
		skipOnce: deps.control.skipOnce === true,
		skipTrivial: deps.config.uplift.skipTrivial,
	};
	const decision = decideUplift({ text: input.prompt ?? "", source: "user", idle: true }, state);
	if (deps.control.skipOnce && !state.skipOnce) {
		try {
			writeControl(deps.stateDir, { skipOnce: false });
		} catch {
			// fail-open
		}
	}
	if (decision.action !== "uplift") return { skipped: decision.action };

	const controller = new AbortController();
	const budget = setTimeout(() => controller.abort(), deps.config.claude.budgetMs);
	try {
		const original = decision.text;
		const conversation = deps.conversation?.(input.transcript_path) ?? "";
		let result: UpliftResult;
		try {
			result = await runUplift({
				original,
				conversation,
				complete: deps.complete,
				signal: controller.signal,
				maxChars: deps.config.uplift.maxChars,
			});
		} catch (error) {
			log(`uplift failed: ${error instanceof Error ? error.message : String(error)}`);
			return { skipped: "uplift-failed" };
		}

		let graph: ThoughtGraph | undefined;
		const thinkOn = deps.control.thinkEnabled ?? deps.config.think.enabled;
		if (thinkOn && !controller.signal.aborted) {
			try {
				const thought = await runThink({
					uplift: result,
					complete: deps.complete,
					signal: controller.signal,
					minNodes: deps.config.think.minNodes,
					maxNodes: deps.config.think.maxNodes,
					concurrency: deps.config.claude.concurrency,
					onProgress: log,
				});
				result = thought;
				graph = thought.graph;
			} catch (error) {
				log(`think failed: ${error instanceof Error ? error.message : String(error)}`);
			}
		}

		let tree: GraphSyncResult | undefined;
		let last: SyncResult | undefined;
		const issuesOn = deps.control.issuesEnabled ?? deps.config.issues.enabled;
		if (issuesOn) {
			const github = deps.github?.(cwd);
			try {
				if (graph) {
					tree = await trackThoughtGraph({
						root: cwd,
						original,
						graph,
						run: deps.ktui,
						boardName: deps.config.issues.boardName,
						github,
					});
					last = tree.parent;
				} else {
					last = await trackUpliftedPrompt({
						root: cwd,
						original,
						run: deps.ktui,
						boardName: deps.config.issues.boardName,
						github,
					});
				}
				await advanceTrackedIssues({
					run: deps.ktui,
					boardName: deps.config.issues.boardName,
					lane: "doing",
					tree,
					last,
				});
			} catch (error) {
				log(`issues failed: ${error instanceof Error ? error.message : String(error)}`);
			}
		}

		const record: SessionRecord = { sessionId, at: now(), result, graph, tree, last, lane: "doing" };
		let specPath: string | undefined;
		try {
			specPath = specFile(deps.stateDir, sessionId);
			mkdirSync(dirname(specPath), { recursive: true });
			writeFileSync(specPath, `${result.xml}\n`);
			writeSession(deps.stateDir, record);
		} catch (error) {
			log(`state write failed: ${error instanceof Error ? error.message : String(error)}`);
			specPath = undefined;
		}

		const output: HookOutput = {
			hookSpecificOutput: {
				hookEventName: "UserPromptSubmit",
				additionalContext: formatPromptContext({ result, graph, tree, last, specPath }),
			},
		};
		if (deps.config.claude.echo) {
			output.systemMessage = formatSummary({ result, graph, tree, last, elapsedMs: now() - started });
		}
		return { output, record };
	} finally {
		clearTimeout(budget);
	}
}
