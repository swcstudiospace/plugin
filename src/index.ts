import { join } from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@oh-my-pi/pi-coding-agent";
import { completePrompt, recentConversation } from "./complete.ts";
import { applyCommand, formatStatus, formatUpliftEcho, parseAioArgs } from "./commands.ts";
import { loadConfig } from "./config.ts";
import { parseShipArgs, PR_COMPLETIONS } from "./mcp/commands.ts";
import { createGithub } from "./mcp/github.ts";
import { createGreptile } from "./mcp/greptile.ts";
import { defaultCliRunner } from "./mcp/run.ts";
import { createBoardComponent } from "./issues/board-ui.ts";
import {
	ISSUE_COMPLETIONS,
	KANBAN_COMPLETIONS,
	applyIssueToggle,
	parseIssueArgs,
} from "./issues/commands.ts";
import {
	formatBoardHud,
	formatBoardList,
	formatIssueEcho,
	formatIssueList,
} from "./issues/format.ts";
import { resolveGithub } from "./issues/github.ts";
import { defaultKtuiRunner } from "./issues/kanban.ts";
import { ensureRepo, listIssues } from "./issues/tissue.ts";
import { refreshSnapshot, syncAllIssues, trackUpliftedPrompt } from "./issues/track.ts";
import { importedSkillCount } from "./skills/import.ts";
import type { IssueTrackState, SyncResult } from "./issues/types.ts";
import type { UpliftResult, UpliftState } from "./types.ts";
import type { ThoughtGraph } from "./think/types.ts";
import { decideUplift } from "./uplift/detect.ts";
import { SYSTEM_ADDENDUM } from "./uplift/prompt.ts";
import { runUplift } from "./uplift/run.ts";
import { applyThinkToggle, parseThinkArgs, THINK_COMPLETIONS } from "./think/commands.ts";
import { formatThinkEcho, formatThinkStatus } from "./think/format.ts";
import { runThink, type ThinkResult } from "./think/pipeline.ts";
import { THINK_ADDENDUM } from "./think/prompts.ts";
import { LspHub, injectLspNote, resolveMutationPath } from "./lsp/hub.ts";
import { registerLspTools } from "./lsp/tools.ts";
import { parseLspArgs, LSP_COMPLETIONS } from "./lsp/commands.ts";

const COMPLETIONS = [
	{ value: "on", label: "on — enable Prompt Uplift" },
	{ value: "off", label: "off — disable" },
	{ value: "status", label: "status — show current mode" },
	{ value: "skip", label: "skip — skip the next prompt" },
	{ value: "last", label: "last — show the last uplifted XML" },
];

const ISSUE_ADDENDUM = `## Issue tracking

This turn is tracked as a Tissue markdown file under issues/ and synced to the Spectrum Web Co board. Use the ktui MCP tool via args such as task list --json --board 1 when you need board state. Do not reprint the issue file. Persist with git add issues/; do not run gh issue create.
`;

function filterCompletions(
	prefix: string,
	extra: { value: string; label: string }[] = [],
): { value: string; label: string }[] | null {
	const needle = prefix.trim().toLowerCase();
	const filtered = [...extra, ...COMPLETIONS].filter((item) => item.value.startsWith(needle));
	return filtered.length > 0 ? filtered : null;
}

function filterNamed(
	prefix: string,
	items: { value: string; label: string }[],
): { value: string; label: string }[] | null {
	const needle = prefix.trim().toLowerCase();
	const filtered = items.filter((item) => item.value.startsWith(needle));
	return filtered.length > 0 ? filtered : null;
}

function findCustom<T>(entries: readonly { type: string }[], customType: string): T | undefined {
	for (let i = entries.length - 1; i >= 0; i--) {
		const entry = entries[i];
		if (!entry || entry.type !== "custom") continue;
		if (!("customType" in entry)) continue;
		if ((entry as { customType?: string }).customType !== customType) continue;
		return (entry as { data?: T }).data;
	}
}

async function branchTitle(cwd: string): Promise<string> {
	try {
		const result = await defaultCliRunner("git", ["rev-parse", "--abbrev-ref", "HEAD"], cwd);
		const branch = result.stdout.trim();
		if (result.code === 0 && branch && branch !== "HEAD") return branch;
	} catch {
		// fail-open
	}
	return "Update";
}

export default function allInOne(pi: ExtensionAPI): void {
	pi.setLabel("All-in-one");
	if (process.env.PI_AIO_CHILD === "1" || process.env.PI_ULTRATHINK_CHILD === "1") return;
	pi.logger.info("all-in-one: Prompt Uplift loaded");
	const hermesSkills = importedSkillCount(join(import.meta.dir, "..", "skills"));
	if (hermesSkills > 0) pi.logger.info(`all-in-one: ${hermesSkills} Hermes skills`);

	const config = loadConfig();
	const lsp = new LspHub(config.lsp);
	const github = createGithub({ run: defaultCliRunner, org: config.github.org });
	const greptile = createGreptile({ run: defaultCliRunner, ...config.greptile });
	const state: UpliftState = {
		enabled: config.uplift.enabled,
		skipOnce: false,
		skipTrivial: config.uplift.skipTrivial,
	};
	const issueState: IssueTrackState = { enabled: config.issues.enabled };
	const run = defaultKtuiRunner(config.issues.ktuiBin);
	let lastResult: UpliftResult | undefined;
	let injectAddendum = false;
	let injectIssueAddendum = false;
	const thinkState = { enabled: config.think.enabled };
	let lastGraph: ThoughtGraph | undefined;
	let injectThinkAddendum = false;
	let greptileSignedOutNotified = false;

	pi.registerFlag("aio-uplift-off", {
		description: "Disable Prompt Uplift",
		type: "boolean",
		default: false,
	});
	pi.registerFlag("aio-issues-off", {
		description: "Disable issue tracking",
		type: "boolean",
		default: false,
	});
	pi.registerFlag("aio-think-off", {
		description: "Disable Graph of Thought",
		type: "boolean",
		default: false,
	});
	pi.registerFlag("aio-lsp-off", {
		description: "Disable Live LSP",
		type: "boolean",
		default: false,
	});

	function persist(): void {
		pi.appendEntry("aio-state", {
			enabled: state.enabled,
			issuesEnabled: issueState.enabled,
			thinkEnabled: thinkState.enabled,
		});
	}

	function applyFlag(): void {
		if (pi.getFlag("aio-uplift-off") === true) state.enabled = false;
		if (pi.getFlag("aio-issues-off") === true) issueState.enabled = false;
		if (pi.getFlag("aio-think-off") === true) thinkState.enabled = false;
		if (pi.getFlag("aio-lsp-off") === true) config.lsp.enabled = false;
	}

	function notify(ctx: ExtensionContext, message: string, level: "info" | "warning" | "error" = "info"): void {
		if (ctx.hasUI) ctx.ui.notify(message, level);
	}

	async function refreshHud(ctx: ExtensionContext): Promise<void> {
		if (!ctx.hasUI) return;
		if (!issueState.enabled) {
			ctx.ui.setWidget("aio-kanban", undefined);
			return;
		}
		try {
			const snap = await refreshSnapshot(run, config.issues.boardName);
			ctx.ui.setWidget("aio-kanban", formatBoardHud(snap, issueState.last), { placement: "aboveEditor" });
		} catch {
			ctx.ui.setWidget("aio-kanban", formatBoardHud(undefined, issueState.last), { placement: "aboveEditor" });
		}
	}

	function recordIssue(ctx: ExtensionContext, result: SyncResult): void {
		issueState.last = result;
		injectIssueAddendum = Boolean(result.issue.id);
		try {
			pi.appendEntry("aio-issue-last", result);
		} catch {
			// fail-open
		}
		if (config.issues.echo) {
			try {
				pi.sendMessage(
					{
						customType: "aio-issue",
						content: formatIssueEcho(result),
						display: true,
					},
					{ triggerTurn: false },
				);
			} catch {
				// fail-open: never block the rewritten prompt
			}
			notify(ctx, formatIssueEcho(result));
		}
		void refreshHud(ctx);
	}

	async function runSync(ctx: ExtensionContext): Promise<void> {
		try {
			const results = await syncAllIssues(
				ctx.cwd,
				run,
				config.issues.boardName,
				resolveGithub(ctx.cwd),
			);
			notify(ctx, `Synced ${results.length} issue${results.length === 1 ? "" : "s"}`);
			await refreshHud(ctx);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			notify(ctx, `Issue sync failed (${message})`, "error");
		}
	}

	function openBoard(ctx: ExtensionContext): void {
		void (async () => {
			const snap = await refreshSnapshot(run, config.issues.boardName);
			if (!ctx.hasUI) {
				notify(ctx, snap ? formatBoardList(snap) : formatBoardHud(undefined).join("\n"), snap ? "info" : "warning");
				return;
			}
			if (!snap) notify(ctx, "board offline — ktui MCP not ready", "warning");
			try {
				void ctx.ui
					.custom(
						(_tui, _theme, _kb, done) =>
							createBoardComponent(
								snap ?? {
									boardId: 0,
									boardName: config.issues.boardName,
									columns: [],
									tasks: [],
									categoryId: null,
								},
								done,
							),
						{ overlay: true },
					)
					.catch(() => {
						notify(ctx, "run ktui in another terminal for the real TUI", "warning");
					});
			} catch {
				notify(ctx, "run ktui in another terminal for the real TUI", "warning");
			}
		})();
	}

	async function handleIssueKind(kind: "issues" | "kanban", args: string, ctx: ExtensionContext): Promise<void> {
		const { cmd } = parseIssueArgs(kind, args);
		if (kind === "issues") {
			switch (cmd) {
				case "list":
					notify(ctx, formatIssueList(listIssues(ctx.cwd)));
					return;
				case "status": {
					const lines = [
						`Issue tracking ${issueState.enabled ? "on" : "off"}`,
						`Board: ${config.issues.boardName}`,
					];
					if (issueState.last) lines.splice(1, 0, formatIssueEcho(issueState.last));
					notify(ctx, lines.join("\n"));
					return;
				}
				case "last":
					if (!issueState.last) {
						notify(ctx, "No last issue in this session yet", "warning");
						return;
					}
					notify(ctx, formatIssueEcho(issueState.last));
					return;
				case "sync":
					await runSync(ctx);
					return;
				case "on":
				case "off":
				case "toggle": {
					const toggled = applyIssueToggle(issueState, cmd);
					persist();
					notify(ctx, toggled.message);
					await refreshHud(ctx);
					return;
				}
				default:
					notify(ctx, "Usage: /issues [list|status|sync|last|on|off]");
					return;
			}
		}

		switch (cmd) {
			case "board":
			case "open":
				openBoard(ctx);
				return;
			case "sync":
				await runSync(ctx);
				return;
			case "status": {
				const snap = await refreshSnapshot(run, config.issues.boardName);
				notify(ctx, formatBoardHud(snap, issueState.last).join("\n"));
				return;
			}
			default:
				notify(ctx, "Usage: /kanban [board|open|sync|status]");
		}
	}

	async function handleThink(args: string, ctx: ExtensionContext): Promise<void> {
		const { cmd } = parseThinkArgs(args);
		if (cmd === "on" || cmd === "off" || cmd === "toggle") {
			const toggled = applyThinkToggle(thinkState, cmd);
			persist();
			notify(ctx, toggled.message);
			return;
		}
		if (cmd === "status") {
			notify(ctx, formatThinkStatus(thinkState.enabled, lastGraph));
			return;
		}
		if (cmd === "last") {
			if (!lastGraph) {
				notify(ctx, "No last thought graph in this session yet", "warning");
				return;
			}
			notify(ctx, formatThinkEcho(lastGraph));
			return;
		}
		notify(ctx, "Usage: /think [on|off|toggle|status|last]");
	}

	async function handleLsp(args: string, ctx: ExtensionContext): Promise<void> {
		try {
			const { cmd } = parseLspArgs(args);
			if (cmd === "diagnostics") {
				notify(ctx, lsp.parentDigest() || "none");
				return;
			}
			if (cmd === "status") {
				notify(ctx, lsp.formatStatus());
				return;
			}
			notify(ctx, "Usage: /lsp [status|diagnostics]");
		} catch {
			// fail-open
		}
	}

	async function handleShipKind(kind: "pr" | "review" | "merge", args: string, ctx: ExtensionContext): Promise<void> {
		const { cmd, rest } = parseShipArgs(kind, args);
		try {
			if (kind === "pr") {
				if (cmd === "create") {
					const title = rest || (await branchTitle(ctx.cwd));
					const created = await github.createPull({ title, cwd: ctx.cwd });
					if (!created.ok) {
						notify(ctx, created.error, "error");
						return;
					}
					notify(ctx, created.htmlUrl);
					return;
				}
				if (cmd === "list") {
					const current = await github.currentRepo(ctx.cwd);
					if (!current.ok) {
						notify(ctx, current.error, "error");
						return;
					}
					const listed = await github.listPulls({ owner: current.owner, repo: current.repo });
					if (!listed.ok) {
						notify(ctx, listed.error, "error");
						return;
					}
					if (listed.pulls.length === 0) {
						notify(ctx, "No pull requests");
						return;
					}
					notify(
						ctx,
						listed.pulls.map((pull) => `#${pull.number} ${pull.title} ${pull.htmlUrl}`).join("\n"),
					);
					return;
				}
				notify(ctx, "Usage: /pr [create|list]");
				return;
			}
			if (kind === "review") {
				const review = await greptile.review({ cwd: ctx.cwd, base: rest || undefined });
				const n = review.comments.length;
				notify(ctx, `Greptile review · confidence ${review.confidence} · ${n} comment${n === 1 ? "" : "s"}`);
				if (!review.signedIn) {
					notify(ctx, "Greptile CLI signed out — run greptile login", "warning");
				}
				return;
			}
			const number = Number.parseInt(rest, 10);
			if (!Number.isFinite(number) || number <= 0) {
				notify(ctx, "Usage: /merge <n>", "warning");
				return;
			}
			const review = await greptile.review({ cwd: ctx.cwd });
			const gate = greptile.allowsMerge(review);
			if (!gate.ok) {
				notify(ctx, gate.reason, "warning");
				return;
			}
			const current = await github.currentRepo(ctx.cwd);
			if (!current.ok) {
				notify(ctx, current.error, "error");
				return;
			}
			const merged = await github.mergePull({ number, owner: current.owner, repo: current.repo });
			if (!merged.ok) {
				notify(ctx, merged.error, "error");
				return;
			}
			notify(ctx, `Merged #${number}`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			notify(ctx, message, "error");
		}
	}

	async function handleCommand(args: string, ctx: ExtensionContext): Promise<void> {
		const { cmd, rest } = parseAioArgs(args);
		if (cmd === "issues" || cmd === "kanban") {
			await handleIssueKind(cmd, rest, ctx);
			return;
		}
		if (cmd === "think") {
			await handleThink(rest, ctx);
			return;
		}
		if (cmd === "lsp") {
			await handleLsp(rest, ctx);
			return;
		}
		if (cmd === "pr" || cmd === "review" || cmd === "merge") {
			await handleShipKind(cmd, rest, ctx);
			return;
		}
		const result = applyCommand(state, cmd);
		if (cmd === "on" || cmd === "off" || cmd === "toggle") persist();
		if (result.showLast) {
			if (!lastResult) {
				notify(ctx, result.message, "warning");
				return;
			}
			notify(ctx, formatUpliftEcho(lastResult));
			return;
		}
		if (cmd === "status") {
			notify(
				ctx,
				formatStatus(state, lastResult ? { root: lastResult.root, source: lastResult.source } : null),
			);
			return;
		}
		notify(ctx, result.message);
	}

	pi.registerCommand("uplift", {
		description: "Toggle Prompt Uplift",
		getArgumentCompletions: (prefix) => filterCompletions(prefix),
		handler: handleCommand,
	});

	pi.registerCommand("issues", {
		description: "Tissue issue tracking",
		getArgumentCompletions: (prefix) => filterNamed(prefix, ISSUE_COMPLETIONS),
		handler: (args, ctx) => handleIssueKind("issues", args, ctx),
	});

	pi.registerCommand("kanban", {
		description: "Spectrum Web Co board",
		getArgumentCompletions: (prefix) => filterNamed(prefix, KANBAN_COMPLETIONS),
		handler: (args, ctx) => handleIssueKind("kanban", args, ctx),
	});

	pi.registerCommand("think", {
		description: "Graph of Thought + Chain of Thought",
		getArgumentCompletions: (prefix) => filterNamed(prefix, THINK_COMPLETIONS),
		handler: handleThink,
	});

	pi.registerCommand("pr", {
		description: "GitHub pull requests",
		getArgumentCompletions: (prefix) => filterNamed(prefix, PR_COMPLETIONS),
		handler: (args, ctx) => handleShipKind("pr", args, ctx),
	});

	pi.registerCommand("review", {
		description: "Greptile code review",
		handler: (args, ctx) => handleShipKind("review", args, ctx),
	});

	pi.registerCommand("merge", {
		description: "Merge a pull request after a clean Greptile review",
		handler: (args, ctx) => handleShipKind("merge", args, ctx),
	});

	registerLspTools(pi, lsp);

	pi.registerCommand("lsp", {
		description: "Live LSP status / diagnostics",
		getArgumentCompletions: (prefix) => filterNamed(prefix, LSP_COMPLETIONS),
		handler: handleLsp,
	});

	pi.registerCommand("aio", {
		description: "All-in-one plugin commands",
		getArgumentCompletions: (prefix) => {
			const issues = prefix.trimStart().match(/^issues(?:\s+|$)(.*)$/i);
			if (issues) return filterNamed(issues[1] ?? "", ISSUE_COMPLETIONS);
			const kanban = prefix.trimStart().match(/^kanban(?:\s+|$)(.*)$/i);
			if (kanban) return filterNamed(kanban[1] ?? "", KANBAN_COMPLETIONS);
			const think = prefix.trimStart().match(/^think(?:\s+|$)(.*)$/i);
			if (think) return filterNamed(think[1] ?? "", THINK_COMPLETIONS);
			const lspArgs = prefix.trimStart().match(/^lsp(?:\s+|$)(.*)$/i);
			if (lspArgs) return filterNamed(lspArgs[1] ?? "", LSP_COMPLETIONS);
			const pr = prefix.trimStart().match(/^pr(?:\s+|$)(.*)$/i);
			if (pr) return filterNamed(pr[1] ?? "", PR_COMPLETIONS);
			const nested = prefix.trimStart().match(/^uplift(?:\s+|$)(.*)$/i);
			if (nested) return filterCompletions(nested[1] ?? "");
			return filterCompletions(prefix, [
				{ value: "issues", label: "issues — Tissue issue tracking" },
				{ value: "kanban", label: "kanban — Spectrum Web Co board" },
				{ value: "uplift", label: "uplift — Prompt Uplift commands" },
				{ value: "think", label: "think — Graph of Thought + Chain of Thought" },
				{ value: "lsp", label: "lsp — Live LSP status / diagnostics" },
				{ value: "pr", label: "pr — GitHub pull requests" },
				{ value: "review", label: "review — Greptile code review" },
				{ value: "merge", label: "merge — Greptile-gated squash merge" },
			]);
		},
		handler: handleCommand,
	});

	pi.on("session_start", (event, ctx) => {
		applyFlag();
		lsp.setCwd(ctx.cwd);
		const manager = ctx.sessionManager;
		const entries =
			typeof manager.getBranch === "function" ? manager.getBranch() : manager.getEntries();
		const saved = findCustom<{ enabled?: boolean; issuesEnabled?: boolean; thinkEnabled?: boolean }>(
			entries,
			"aio-state",
		);
		if (typeof saved?.enabled === "boolean") state.enabled = saved.enabled;
		if (typeof saved?.issuesEnabled === "boolean") issueState.enabled = saved.issuesEnabled;
		if (typeof saved?.thinkEnabled === "boolean") thinkState.enabled = saved.thinkEnabled;
		applyFlag();
		const last = findCustom<UpliftResult & { graph?: ThoughtGraph }>(entries, "aio-uplift-last");
		if (last && typeof last.xml === "string" && typeof last.root === "string") lastResult = last;
		if (last?.graph) lastGraph = last.graph;
		else {
			const lastThink = findCustom<ThoughtGraph>(entries, "aio-think-last");
			if (lastThink) lastGraph = lastThink;
		}
		const lastIssue = findCustom<SyncResult>(entries, "aio-issue-last");
		if (lastIssue?.issue && typeof lastIssue.issue.id === "string") issueState.last = lastIssue;
		const reason = (event as { reason?: string }).reason;
		if (issueState.enabled) {
			try {
				ensureRepo(ctx.cwd);
				void refreshHud(ctx);
			} catch {
				// fail-open: never block session start
			}
		}
		if (ctx.hasUI && (reason === "startup" || reason === "new")) {
			notify(
				ctx,
				state.enabled
					? "Prompt Uplift on — prefix raw: to skip."
					: "Prompt Uplift off — /uplift on to enable.",
			);
			if (issueState.enabled) {
				notify(ctx, "Issue tracking on — Tissue + Spectrum Web Co");
			}
			if (thinkState.enabled) {
				notify(ctx, "Graph of Thought on — sequential CoT per node.");
			}
			if (config.lsp.enabled) {
				notify(ctx, "Live LSP on — diagnostics steer the session.");
			}
		}
		if (!greptileSignedOutNotified) {
			void (async () => {
				try {
					const me = await greptile.whoami();
					if (!me.signedIn && !greptileSignedOutNotified) {
						greptileSignedOutNotified = true;
						notify(
							ctx,
							"Greptile CLI signed out — /review and merge stay blocked until greptile login",
							"warning",
						);
					}
				} catch {
					// fail-open
				}
			})();
		}
	});

	pi.on("input", async (event, ctx) => {
		const idle = typeof ctx.isIdle === "function" ? ctx.isIdle() : true;
		const decision = decideUplift(
			{
				text: event.text,
				source: event.source,
				idle,
			},
			state,
		);
		if (decision.action === "skip") return;
		if (decision.action === "passthrough") return { text: decision.text, images: event.images };

		if (ctx.hasUI) ctx.ui.setWorkingMessage("Uplifting prompt…");
		const signal = (ctx as ExtensionContext & { signal?: AbortSignal }).signal;
		const complete = (system: string, user: string, completeSignal?: AbortSignal) =>
			completePrompt(ctx, system, user, { images: event.images, signal: completeSignal ?? signal });
		try {
			const upliftResult = await runUplift({
				original: decision.text,
				conversation: recentConversation(ctx),
				complete,
				signal,
				maxChars: config.uplift.maxChars,
			});
			let result: UpliftResult | ThinkResult = upliftResult;
			if (thinkState.enabled) {
				try {
					const thought = await runThink({
						uplift: result,
						complete,
						signal,
						minNodes: config.think.minNodes,
						maxNodes: config.think.maxNodes,
						onProgress: (message) => {
							if (ctx.hasUI) ctx.ui.setWorkingMessage(message);
						},
					});
					result = thought;
					lastGraph = thought.graph;
					injectThinkAddendum = true;
					pi.appendEntry("aio-think-last", thought.graph);
				} catch (error) {
					if (error instanceof Error && error.name === "AbortError") throw error;
				}
			}
			lastResult = result;
			injectAddendum = true;
			pi.appendEntry("aio-uplift-last", result);
			if (config.uplift.echo) {
				try {
					pi.sendMessage(
						{
							customType: "aio-uplift",
							content: formatUpliftEcho(result),
							display: true,
						},
						{ triggerTurn: false },
					);
				} catch {
					// fail-open: never block the rewritten prompt
				}
				notify(ctx, `Prompt Uplift · ${result.root} · ${result.source}`);
				if (lastGraph && injectThinkAddendum) {
					try {
						pi.sendMessage(
							{
								customType: "aio-think",
								content: formatThinkEcho(lastGraph),
								display: true,
							},
							{ triggerTurn: false },
						);
					} catch {
						// fail-open: never block the rewritten prompt
					}
					notify(ctx, `Graph of Thought · ${lastGraph.nodes.length} nodes`);
				}
			}
			if (issueState.enabled) {
				try {
					const tracked = await trackUpliftedPrompt({
						root: ctx.cwd,
						original: decision.text,
						run,
						boardName: config.issues.boardName,
						github: resolveGithub(ctx.cwd),
					});
					recordIssue(ctx, tracked);
				} catch {
					// fail-open: never change the uplifted return
				}
			}
			return { text: result.xml, images: event.images };
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") {
				notify(ctx, "Prompt Uplift cancelled — sending original prompt", "warning");
				return { text: decision.text, images: event.images };
			}
			const message = error instanceof Error ? error.message : String(error);
			notify(ctx, `Prompt Uplift failed (${message}) — sending original prompt`, "error");
			return { text: decision.text, images: event.images };
		} finally {
			if (ctx.hasUI) ctx.ui.setWorkingMessage();
		}
	});

	pi.on("before_agent_start", (event) => {
		let lspDigest = "";
		if (config.lsp.enabled) {
			try {
				lspDigest = lsp.parentDigest();
			} catch {
				lspDigest = "";
			}
		}
		if (!injectAddendum && !injectIssueAddendum && !injectThinkAddendum && !lspDigest) return;
		const parts = Array.isArray(event.systemPrompt)
			? [...event.systemPrompt]
			: [String(event.systemPrompt ?? "")];
		let joined = parts.join("\n");
		if (injectAddendum && !joined.includes("## Prompt Uplift")) {
			parts.push(SYSTEM_ADDENDUM);
			joined = parts.join("\n");
		}
		if (injectThinkAddendum && !joined.includes("## Graph of Thought")) {
			parts.push(THINK_ADDENDUM);
			joined = parts.join("\n");
		}
		if (injectIssueAddendum && !joined.includes("## Issue tracking")) {
			parts.push(ISSUE_ADDENDUM);
			joined = parts.join("\n");
		}
		if (lspDigest && !joined.includes("## Live LSP")) {
			parts.push(`## Live LSP\n${lspDigest}\nUse lsp_diagnostics / lsp_status.`);
		}
		injectAddendum = false;
		injectIssueAddendum = false;
		injectThinkAddendum = false;
		return { systemPrompt: parts };
	});

	pi.on("tool_result", (event, ctx) => {
		try {
			if (event.toolName === "write" || event.toolName === "edit") {
				const path = resolveMutationPath(ctx.cwd, event.input);
				if (path) void lsp.onFileMutation(path);
			} else if (event.toolName === "bash") {
				const command = typeof event.input.command === "string" ? event.input.command : "";
				void lsp.onBash(command);
			}
		} catch {
			// fail-open
		}
	});

	pi.on("turn_end", () => {
		try {
			const digest = lsp.shouldInjectParent();
			if (digest) injectLspNote(pi, digest);
			lsp.reapIdle();
		} catch {
			// fail-open
		}
	});

	pi.on("session_stop", () => {
		void lsp.close();
	});
}
