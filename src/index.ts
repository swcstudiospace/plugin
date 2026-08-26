import type { ExtensionAPI, ExtensionContext } from "@oh-my-pi/pi-coding-agent";
import { completePrompt, recentConversation } from "./complete.ts";
import { applyCommand, formatStatus, formatUpliftEcho, parseAioArgs } from "./commands.ts";
import { loadConfig } from "./config.ts";
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
import type { IssueTrackState, SyncResult } from "./issues/types.ts";
import type { UpliftResult, UpliftState } from "./types.ts";
import { decideUplift } from "./uplift/detect.ts";
import { SYSTEM_ADDENDUM } from "./uplift/prompt.ts";
import { runUplift } from "./uplift/run.ts";

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

export default function allInOne(pi: ExtensionAPI): void {
	pi.setLabel("All-in-one");
	if (process.env.PI_AIO_CHILD === "1" || process.env.PI_ULTRATHINK_CHILD === "1") return;
	pi.logger.info("all-in-one: Prompt Uplift loaded");

	const config = loadConfig();
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

	function persist(): void {
		pi.appendEntry("aio-state", { enabled: state.enabled, issuesEnabled: issueState.enabled });
	}

	function applyFlag(): void {
		if (pi.getFlag("aio-uplift-off") === true) state.enabled = false;
		if (pi.getFlag("aio-issues-off") === true) issueState.enabled = false;
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
		injectIssueAddendum = true;
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

	async function handleCommand(args: string, ctx: ExtensionContext): Promise<void> {
		const { cmd, rest } = parseAioArgs(args);
		if (cmd === "issues" || cmd === "kanban") {
			await handleIssueKind(cmd, rest, ctx);
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

	pi.registerCommand("aio", {
		description: "All-in-one plugin commands",
		getArgumentCompletions: (prefix) => {
			const issues = prefix.trimStart().match(/^issues(?:\s+|$)(.*)$/i);
			if (issues) return filterNamed(issues[1] ?? "", ISSUE_COMPLETIONS);
			const kanban = prefix.trimStart().match(/^kanban(?:\s+|$)(.*)$/i);
			if (kanban) return filterNamed(kanban[1] ?? "", KANBAN_COMPLETIONS);
			const nested = prefix.trimStart().match(/^uplift(?:\s+|$)(.*)$/i);
			if (nested) return filterCompletions(nested[1] ?? "");
			return filterCompletions(prefix, [
				{ value: "issues", label: "issues — Tissue issue tracking" },
				{ value: "kanban", label: "kanban — Spectrum Web Co board" },
				{ value: "uplift", label: "uplift — Prompt Uplift commands" },
			]);
		},
		handler: handleCommand,
	});

	pi.on("session_start", (event, ctx) => {
		applyFlag();
		const manager = ctx.sessionManager;
		const entries =
			typeof manager.getBranch === "function" ? manager.getBranch() : manager.getEntries();
		const saved = findCustom<{ enabled?: boolean; issuesEnabled?: boolean }>(entries, "aio-state");
		if (typeof saved?.enabled === "boolean") state.enabled = saved.enabled;
		if (typeof saved?.issuesEnabled === "boolean") issueState.enabled = saved.issuesEnabled;
		applyFlag();
		const last = findCustom<UpliftResult>(entries, "aio-uplift-last");
		if (last && typeof last.xml === "string" && typeof last.root === "string") lastResult = last;
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
		try {
			const result = await runUplift({
				original: decision.text,
				conversation: recentConversation(ctx),
				complete: (system, user, completeSignal) =>
					completePrompt(ctx, system, user, { images: event.images, signal: completeSignal ?? signal }),
				signal,
				maxChars: config.uplift.maxChars,
			});
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
		if (!injectAddendum && !injectIssueAddendum) return;
		const parts = Array.isArray(event.systemPrompt)
			? [...event.systemPrompt]
			: [String(event.systemPrompt ?? "")];
		let joined = parts.join("\n");
		if (injectAddendum && !joined.includes("## Prompt Uplift")) {
			parts.push(SYSTEM_ADDENDUM);
			joined = parts.join("\n");
		}
		if (injectIssueAddendum && !joined.includes("## Issue tracking")) {
			parts.push(ISSUE_ADDENDUM);
		}
		injectAddendum = false;
		injectIssueAddendum = false;
		return { systemPrompt: parts };
	});
}
