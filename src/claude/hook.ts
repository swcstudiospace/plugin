/**
 * Orchestrates one UserPromptSubmit event for the Claude Code plugin path.
 *
 * Mirrors the OMP `input` handler in src/index.ts: decide → uplift → Graph of Thought
 * with per-node Chain of Thought → HITL clarifications → write a Tissue parent plus one
 * sub-issue per node → sync to the kanban → return the spec as hook context. Everything
 * after "decide" is fail-open: the user's prompt always goes through.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { AioConfig } from "../config.ts";
import { injectClarificationsXml } from "../hitl/format.ts";
import { normalizeQuestion, type RunClarifyOptions, runClarify } from "../hitl/pipeline.ts";
import type { Clarification } from "../hitl/types.ts";
import type { KtuiRunner } from "../issues/kanban.ts";
import { advanceTrackedIssues, trackThoughtGraph, trackUpliftedPrompt } from "../issues/track.ts";
import type { GithubAssoc, GraphSyncResult, SyncResult } from "../issues/types.ts";
import { runThink } from "../think/pipeline.ts";
import type { ThoughtGraph } from "../think/types.ts";
import type { UpliftResult, UpliftState } from "../types.ts";
import { decideUplift } from "../uplift/detect.ts";
import { runUplift } from "../uplift/run.ts";
import type { ClaudeCompleter } from "./complete.ts";
import { kickoffSwarm, SWARM_CONTEXT, type KickoffResult } from "../swarm/kickoff.ts";
import { formatPromptContext, formatSummary } from "./output.ts";
import { type ControlState, readSession, type SessionRecord, sessionPath, writeControl, writeSession } from "./state.ts";

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
	/** Thinking engine label recorded and echoed, e.g. "grok-4.6@xhigh" or "claude:sonnet". */
	engine: string;
	ktui: KtuiRunner;
	stateDir: string;
	clarify?: (opts: RunClarifyOptions) => Promise<Clarification[]>;
	/** First error the completer threw (already redacted), surfaced in the summary. */
	engineError?: () => string | undefined;
	github?: (cwd: string) => GithubAssoc | undefined;
	conversation?: (transcriptPath?: string) => string;
	now?: () => number;
	log?: (message: string) => void;
	/** Tests inject this to avoid detaching a real swarm_run. */
	swarmKickoff?: (input: { cwd: string; prompt: string }) => KickoffResult;
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

		/** Answered clarifications from an earlier turn of this session survive; stale open ones are dropped. */
		let clarifications: Clarification[] = (readSession(deps.stateDir, sessionId)?.clarifications ?? []).filter(
			(c) => c.answer,
		);
		const hitlOn = deps.control.hitlEnabled ?? deps.config.hitl.enabled;
		if (hitlOn && !controller.signal.aborted) {
			try {
				const fresh = await (deps.clarify ?? runClarify)({
					uplift: result,
					graph,
					conversation,
					answered: clarifications,
					complete: deps.complete,
					signal: controller.signal,
					maxQuestions: deps.config.hitl.maxQuestions,
					onProgress: log,
				});
				const seen = new Set(clarifications.map((c) => normalizeQuestion(c.question)));
				clarifications = [...clarifications, ...fresh.filter((c) => !seen.has(normalizeQuestion(c.question)))];
			} catch (error) {
				log(`clarify failed: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
		if (clarifications.length > 0) {
			result = { ...result, xml: injectClarificationsXml(result.xml, clarifications) };
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

		const record: SessionRecord = {
			sessionId,
			at: now(),
			engine: deps.engine,
			result,
			graph,
			clarifications,
			tree,
			last,
			lane: "doing",
		};
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

		let extra = "";
		try {
			const kick =
				deps.swarmKickoff?.({ cwd, prompt: original }) ??
				kickoffSwarm({ cwd, prompt: original, config: deps.config.swarm });
			if (kick.kicked) extra = `\n\n${SWARM_CONTEXT}`;
			else log(`swarm kickoff skipped: ${kick.reason ?? "unknown"}`);
		} catch (error) {
			log(`swarm kickoff failed: ${error instanceof Error ? error.message : String(error)}`);
		}

		const output: HookOutput = {
			hookSpecificOutput: {
				hookEventName: "UserPromptSubmit",
				additionalContext:
					formatPromptContext({ result, graph, clarifications, tree, last, specPath }) + extra,
			},
		};
		if (deps.config.claude.echo) {
			output.systemMessage = formatSummary({
				result,
				engine: deps.engine,
				graph,
				clarifications,
				tree,
				last,
				engineError: deps.engineError?.(),
				elapsedMs: now() - started,
			});
		}
		return { output, record };
	} finally {
		clearTimeout(budget);
	}
}
