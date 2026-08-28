import { join, resolve } from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@oh-my-pi/pi-coding-agent";
import { completePrompt, recentConversation } from "./complete.ts";
import { applyCommand, formatStatus, formatUpliftEcho, parseAioArgs } from "./commands.ts";
import { loadConfig } from "./config.ts";
import { parseShipArgs, parseSupabaseArgs, PR_COMPLETIONS, SUPABASE_COMPLETIONS } from "./mcp/commands.ts";
import { createGithub } from "./mcp/github.ts";
import { createGreptile } from "./mcp/greptile.ts";
import { createSupabase } from "./mcp/supabase.ts";
import { defaultCliRunner } from "./mcp/run.ts";
import { createBoardComponent } from "./issues/board-ui.ts";
import { createChromeWidget, type ChromeState } from "./ui/chrome.ts";
import { createKanbanWidget } from "./ui/kanban.ts";
import { createLspWidget } from "./ui/lsp.ts";
import { registerAioRenderers } from "./ui/renderers.ts";

import {
	ISSUE_COMPLETIONS,
	KANBAN_COMPLETIONS,
	applyIssueToggle,
	parseIssueArgs,
} from "./issues/commands.ts";
import {
	formatBoardHud,
	formatBoardList,
	formatIssueAddendum,
	formatIssueEcho,
	formatIssueList,
} from "./issues/format.ts";
import { resolveGithub } from "./issues/github.ts";
import { defaultKtuiRunner } from "./issues/kanban.ts";
import { ensureRepo, listIssues } from "./issues/tissue.ts";
import { createBoardLaneController, refreshSnapshot, syncAllIssues, trackThoughtGraph, trackUpliftedPrompt } from "./issues/track.ts";
import { registerIssueTools } from "./issues/tools.ts";
import { importedSkillCount } from "./skills/import.ts";
import type { GraphSyncResult, IssueTrackState, SyncResult } from "./issues/types.ts";
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
import { bootPod, diagnosePod } from "./pod/boot.ts";
import { parsePodArgs, POD_COMPLETIONS } from "./pod/commands.ts";
import { formatPodDoctor } from "./pod/format.ts";
import { registerPodTools } from "./pod/tools.ts";
import type { PodSession } from "./pod/types.ts";
import { isAllowedPath, wrapBashCommand, workspaceIdFor } from "./pod/workspace.ts";

const COMPLETIONS = [
	{ value: "on", label: "on — enable Prompt Uplift" },
	{ value: "off", label: "off — disable" },
	{ value: "status", label: "status — show current mode" },
	{ value: "skip", label: "skip — skip the next prompt" },
	{ value: "last", label: "last — show the last uplifted XML" },
];

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

function supabaseFault(result: unknown): string | null {
	if (!result || typeof result !== "object" || !("error" in result)) return null;
	const rec = result as { error: unknown; message?: unknown; status?: unknown };
	if (typeof rec.error !== "string") return "supabase error";
	const parts = [rec.error];
	if (typeof rec.message === "string" && rec.message) parts.push(rec.message);
	else if (typeof rec.status === "number") parts.push(String(rec.status));
	return parts.join(": ");
}

function listNames(items: unknown): string[] {
	if (!Array.isArray(items)) return [];
	const names: string[] = [];
	for (const item of items) {
		if (typeof item === "string") {
			if (item) names.push(item);
			continue;
		}
		if (!item || typeof item !== "object") continue;
		const rec = item as Record<string, unknown>;
		const name = rec.name ?? rec.table_name;
		if (typeof name === "string" && name) names.push(name);
	}
	return names;
}

function formatNamedCount(noun: string, result: unknown, key: string): string {
	const rec = result && typeof result === "object" ? (result as Record<string, unknown>) : {};
	const names = listNames(rec[key]);
	const count = typeof rec.count === "number" ? rec.count : names.length;
	const head = `${count} ${noun}${count === 1 ? "" : "s"}`;
	return names.length > 0 ? `${head}\n${names.join("\n")}` : head;
}

function formatAuthUsers(result: unknown): string {
	const rec = result && typeof result === "object" ? (result as Record<string, unknown>) : {};
	const users = Array.isArray(rec.users) ? rec.users : [];
	const count = typeof rec.count === "number" ? rec.count : users.length;
	const labels: string[] = [];
	for (const user of users) {
		if (!user || typeof user !== "object") continue;
		const row = user as Record<string, unknown>;
		if (typeof row.email === "string" && row.email) labels.push(row.email);
		else if (typeof row.id === "string" && row.id) labels.push(row.id);
	}
	const head = `${count} user${count === 1 ? "" : "s"}`;
	return labels.length > 0 ? `${head}\n${labels.join("\n")}` : head;
}

export default function allInOne(pi: ExtensionAPI): void {
	pi.setLabel("All-in-one");
	if (process.env.PI_AIO_CHILD === "1" || process.env.PI_ULTRATHINK_CHILD === "1") return;
	pi.logger.info("all-in-one: Prompt Uplift loaded");
	const hermesSkills = importedSkillCount(join(import.meta.dir, "..", "skills"));
	if (hermesSkills > 0) pi.logger.info(`all-in-one: ${hermesSkills} Hermes skills`);

	const config = loadConfig();
	registerAioRenderers(pi);

	let podSession: PodSession | undefined;
	const lsp = new LspHub(config.lsp);
	const github = createGithub({ run: defaultCliRunner, org: config.github.org });
	const greptile = createGreptile({ run: defaultCliRunner, ...config.greptile });
	const supabase = createSupabase();
	const state: UpliftState = {
		enabled: config.uplift.enabled,
		skipOnce: false,
		skipTrivial: config.uplift.skipTrivial,
	};
	const issueState: IssueTrackState = { enabled: config.issues.enabled };
	const run = defaultKtuiRunner(config.issues.ktuiBin);
	let hudCtx: ExtensionContext | undefined;
	let lastResult: UpliftResult | undefined;
	let injectAddendum = false;
	let injectIssueAddendum = false;
	let issueTree: GraphSyncResult | undefined;
	const boardLanes = createBoardLaneController({
		run,
		boardName: () => config.issues.boardName,
		enabled: () => issueState.enabled,
		tree: () => issueTree,
		last: () => issueState.last,
		onMoved: async () => {
			if (hudCtx) await refreshHud(hudCtx);
		},
	});
	let sessionCwd = process.cwd();
	const thinkState = { enabled: config.think.enabled };
	let lastGraph: ThoughtGraph | undefined;
	let injectThinkAddendum = false;
	let lastTool: string | undefined;

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
	pi.registerFlag("aio-pod-off", {
		description: "Disable pod codespace boot",
		type: "boolean",
		default: false,
	});

	function persist(): void {
		pi.appendEntry("aio-state", {
			enabled: state.enabled,
			issuesEnabled: issueState.enabled,
			thinkEnabled: thinkState.enabled,
			podEnabled: config.pod.enabled,
		});
	}

	function applyFlag(): void {
		if (pi.getFlag("aio-uplift-off") === true) state.enabled = false;
		if (pi.getFlag("aio-issues-off") === true) issueState.enabled = false;
		if (pi.getFlag("aio-think-off") === true) thinkState.enabled = false;
		if (pi.getFlag("aio-lsp-off") === true) config.lsp.enabled = false;
		if (pi.getFlag("aio-pod-off") === true) config.pod.enabled = false;
	}

	function notify(ctx: ExtensionContext, message: string, level: "info" | "warning" | "error" = "info"): void {
		if (ctx.hasUI) ctx.ui.notify(message, level);
	}

	function chromeState(): ChromeState {
		return {
			upliftOn: state.enabled,
			lastRoot: lastResult?.root,
			lastSource: lastResult?.source,
			thinkOn: thinkState.enabled,
			thinkNodes: lastGraph?.nodes.length,
			lastTool,
			pod: {
				enabled: config.pod.enabled,
				connected: Boolean(podSession?.connected),
				workspaceId: podSession?.workspaceId,
				anda: Boolean(podSession?.engineActive),
			},
		};
	}


	async function refreshHud(ctx: ExtensionContext): Promise<void> {
		if (!ctx.hasUI) return;
		ctx.ui.setWidget("aio-chrome", createChromeWidget(chromeState()), { placement: "aboveEditor" });
		if (!issueState.enabled) {
			ctx.ui.setWidget("aio-kanban", undefined);
		} else {
			try {
				const snap = await refreshSnapshot(run, config.issues.boardName);
				ctx.ui.setWidget("aio-kanban", createKanbanWidget(snap, issueState.last), {
					placement: "aboveEditor",
				});
			} catch {
				ctx.ui.setWidget("aio-kanban", createKanbanWidget(undefined, issueState.last), {
					placement: "aboveEditor",
				});
			}
		}
		if (config.lsp.enabled) {
			ctx.ui.setWidget(
				"aio-lsp",
				createLspWidget({ digest: lsp.parentDigest() || undefined, statusLine: undefined }),
				{ placement: "belowEditor" },
			);
		} else {
			ctx.ui.setWidget("aio-lsp", undefined);
		}
	}


	async function bootPodSession(ctx: ExtensionContext): Promise<void> {
		try {
			podSession = await bootPod({
				run: defaultCliRunner,
				cwd: ctx.cwd,
				config: config.pod,
				env: process.env,
				onProgress: (msg) => {
					if (ctx.hasUI) ctx.ui.setWorkingMessage(msg);
				},
			});
			if (podSession.connected) {
				notify(ctx, `Pod connected — ${podSession.workspaceId}`);
			} else {
				notify(ctx, podSession.reason || "Pod not connected", "warning");
			}
		} catch {
			notify(ctx, "Pod boot failed — jailed to workspace", "warning");
		} finally {
			if (ctx.hasUI) ctx.ui.setWorkingMessage();
		}
		await refreshHud(ctx);
	}

	function recordIssue(ctx: ExtensionContext, result: SyncResult, tree?: GraphSyncResult): void {
		issueState.last = result;
		if (tree) issueTree = tree;
		injectIssueAddendum = Boolean(result.issue.id);
		try {
			pi.appendEntry("aio-issue-last", result);
			if (tree) pi.appendEntry("aio-issue-tree", tree);
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
						(_tui, theme, _kb, done) =>
							createBoardComponent(
								snap ?? {
									boardId: 0,
									boardName: config.issues.boardName,
									columns: [],
									tasks: [],
									categoryId: null,
								},
								done,
								theme,
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

	async function runDoctor(cwd = sessionCwd) {
		return diagnosePod({
			run: defaultCliRunner,
			bin: process.env.AIMEE_POD_BIN?.trim() || config.pod.bin,
			id: config.pod.workspaceId || podSession?.workspaceId || workspaceIdFor(cwd),
			nexusUrl: process.env.ANDA_NEXUS_URL?.trim() || config.pod.nexusUrl,
			dteeUrl:
				process.env.DTEE_GATEWAY_URL?.trim() ||
				process.env.IC_TEE_GATEWAY_URL?.trim() ||
				config.pod.dteeUrl,
			enabled: config.pod.enabled,
			session: podSession,
		});
	}

	async function handlePod(args: string, ctx: ExtensionContext): Promise<void> {
		const { cmd } = parsePodArgs(args);
		if (cmd === "on") {
			config.pod.enabled = true;
			persist();
			notify(ctx, "Pod boot on");
			await refreshHud(ctx);
			return;
		}
		if (cmd === "off") {
			config.pod.enabled = false;
			persist();
			notify(ctx, "Pod boot off");
			await refreshHud(ctx);
			return;
		}
		if (cmd === "status" || cmd === "doctor") {
			try {
				notify(ctx, formatPodDoctor(await runDoctor(ctx.cwd)));
			} catch {
				notify(ctx, "Pod doctor failed", "warning");
			}
			return;
		}
		if (cmd === "up" || cmd === "connect") {
			config.pod.enabled = true;
			persist();
			await bootPodSession(ctx);
			return;
		}
		notify(ctx, "Usage: /pod [status|up|connect|doctor|on|off]");
	}

	async function handleSupabase(args: string, ctx: ExtensionContext): Promise<void> {
		if (!config.supabase.enabled) {
			notify(ctx, "Supabase disabled", "warning");
			return;
		}
		try {
			const { cmd } = parseSupabaseArgs(args);
			if (cmd === "status") {
				notify(ctx, JSON.stringify(await supabase.status()));
				return;
			}
			if (cmd === "projects") {
				const listed = await supabase.projectsList();
				const fault = supabaseFault(listed);
				if (fault) {
					notify(ctx, fault, "error");
					return;
				}
				notify(ctx, formatNamedCount("project", listed, "projects"));
				return;
			}
			if (cmd === "tables") {
				const listed = await supabase.tablesList();
				const fault = supabaseFault(listed);
				if (fault) {
					notify(ctx, fault, "error");
					return;
				}
				notify(ctx, formatNamedCount("table", listed, "tables"));
				return;
			}
			if (cmd === "users") {
				const listed = await supabase.authUsersList();
				const fault = supabaseFault(listed);
				if (fault) {
					notify(ctx, fault, "error");
					return;
				}
				notify(ctx, formatAuthUsers(listed));
				return;
			}
			notify(ctx, "Usage: /supabase [status|projects|tables|users]");
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			notify(ctx, message, "error");
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
		if (cmd === "supabase") {
			await handleSupabase(rest, ctx);
			return;
		}
		if (cmd === "pod") {
			await handlePod(rest, ctx);
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
	registerIssueTools(pi, {
		enabled: () => issueState.enabled,
		list: () => listIssues(sessionCwd),
		tree: () => issueTree,
		last: () => issueState.last,
		snapshot: () => refreshSnapshot(run, config.issues.boardName),
	});

	pi.registerCommand("lsp", {
		description: "Live LSP status / diagnostics",
		getArgumentCompletions: (prefix) => filterNamed(prefix, LSP_COMPLETIONS),
		handler: handleLsp,
	});

	pi.registerCommand("supabase", {
		description: "Supabase databases and auth",
		getArgumentCompletions: (prefix) => filterNamed(prefix, SUPABASE_COMPLETIONS),
		handler: handleSupabase,
	});

	registerPodTools(pi, {
		enabled: () => config.pod.enabled,
		session: () => podSession,
		doctor: () => runDoctor(),
	});

	pi.registerCommand("pod", {
		description: "DevPod codespace",
		getArgumentCompletions: (prefix) => filterNamed(prefix, POD_COMPLETIONS),
		handler: handlePod,
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
			const supabaseArgs = prefix.trimStart().match(/^supabase(?:\s+|$)(.*)$/i);
			if (supabaseArgs) return filterNamed(supabaseArgs[1] ?? "", SUPABASE_COMPLETIONS);
			const podArgs = prefix.trimStart().match(/^pod(?:\s+|$)(.*)$/i);
			if (podArgs) return filterNamed(podArgs[1] ?? "", POD_COMPLETIONS);
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
				{ value: "supabase", label: "supabase — databases and auth" },
				{ value: "pod", label: "pod — DevPod codespace" },
			]);
		},
		handler: handleCommand,
	});

	pi.on("session_start", async (event, ctx) => {
		hudCtx = ctx;
		sessionCwd = ctx.cwd;
		applyFlag();
		lsp.setCwd(ctx.cwd);
		const manager = ctx.sessionManager;
		const entries =
			typeof manager.getBranch === "function" ? manager.getBranch() : manager.getEntries();
		const saved = findCustom<{
			enabled?: boolean;
			issuesEnabled?: boolean;
			thinkEnabled?: boolean;
			podEnabled?: boolean;
		}>(entries, "aio-state");
		if (typeof saved?.enabled === "boolean") state.enabled = saved.enabled;
		if (typeof saved?.issuesEnabled === "boolean") issueState.enabled = saved.issuesEnabled;
		if (typeof saved?.thinkEnabled === "boolean") thinkState.enabled = saved.thinkEnabled;
		if (typeof saved?.podEnabled === "boolean") config.pod.enabled = saved.podEnabled;
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
		const lastTree = findCustom<GraphSyncResult>(entries, "aio-issue-tree");
		if (
			lastTree?.parent?.issue &&
			typeof lastTree.parent.issue.id === "string" &&
			Array.isArray(lastTree.children)
		) {
			issueTree = lastTree;
		}
		const reason = (event as { reason?: string }).reason;
		if (issueState.enabled) {
			try {
				ensureRepo(ctx.cwd);
			} catch {
				// fail-open: never block session start
			}
		}
		void refreshHud(ctx);

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
			if (config.supabase.enabled) {
				notify(ctx, "Supabase on — databases and auth via /supabase");
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
		if (config.pod.enabled) {
			notify(ctx, "Pod boot — codespace up…");
			await bootPodSession(ctx);
		}
	});

	pi.on("input", async (event, ctx) => {
		hudCtx = ctx;
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
					if ("graph" in result && result.graph) {
						const tracked = await trackThoughtGraph({
							root: ctx.cwd,
							original: decision.text,
							graph: result.graph,
							run,
							boardName: config.issues.boardName,
							github: resolveGithub(ctx.cwd),
						});
						recordIssue(ctx, tracked.parent, tracked);
						notify(ctx, `Issue tracking · parent + ${tracked.children.length} sub-issues`);
					} else {
						issueTree = undefined;
						const tracked = await trackUpliftedPrompt({
							root: ctx.cwd,
							original: decision.text,
							run,
							boardName: config.issues.boardName,
							github: resolveGithub(ctx.cwd),
						});
						recordIssue(ctx, tracked);
					}
				} catch {
					// fail-open: never change the uplifted return
				}
			}
			void refreshHud(ctx);

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
		boardLanes.onAgentStart();
		let lspDigest = "";
		if (config.lsp.enabled) {
			try {
				lspDigest = lsp.parentDigest();
			} catch {
				lspDigest = "";
			}
		}
		const persistThink = thinkState.enabled && Boolean(lastGraph);
		const persistIssue = issueState.enabled && Boolean(issueTree || issueState.last);
		const persistPod = config.pod.enabled;
		if (!injectAddendum && !injectIssueAddendum && !injectThinkAddendum && !lspDigest && !persistThink && !persistIssue && !persistPod) return;
		const parts = Array.isArray(event.systemPrompt)
			? [...event.systemPrompt]
			: [String(event.systemPrompt ?? "")];
		let joined = parts.join("\n");
		if (injectAddendum && !joined.includes("## Prompt Uplift")) {
			parts.push(SYSTEM_ADDENDUM);
			joined = parts.join("\n");
		}
		if (persistThink && !joined.includes("## Graph of Thought")) {
			parts.push(THINK_ADDENDUM);
			joined = parts.join("\n");
		}
		if (persistIssue && !joined.includes("## Issue tracking")) {
			parts.push(formatIssueAddendum(issueTree));
			joined = parts.join("\n");
		}
		if (lspDigest && !joined.includes("## Live LSP")) {
			parts.push(`## Live LSP\n${lspDigest}\nUse lsp_diagnostics / lsp_status.`);
		}
		if (persistPod && !joined.includes("## Pod sandbox")) {
			parts.push(
				"## Pod sandbox\nFile tools are jailed to the workspace and extraDirs. Bash runs in the codespace when connected. Do not read files outside. dTEE is the ldclabs IC-TEE gateway probe (DTEE_GATEWAY_URL), not an invented enclave. Codespace is not ready until DevPod status is Running and ssh works.",
			);
		}
		injectAddendum = false;
		injectIssueAddendum = false;
		injectThinkAddendum = false;
		return { systemPrompt: parts };
	});

	pi.on("tool_call", (event, ctx) => {
		if (!config.pod.enabled) return;
		const roots = [podSession?.localFolder || ctx.cwd, ...(podSession?.extraDirs ?? [])];
		const input = event.input as Record<string, unknown>;
		if (event.toolName === "read" || event.toolName === "write" || event.toolName === "edit") {
			if (typeof input.path === "string" && !isAllowedPath(resolve(ctx.cwd, input.path), roots)) {
				return { block: true, reason: "path is outside the pod workspace" };
			}
			return;
		}
		if (event.toolName === "grep" || event.toolName === "glob") {
			const pathVal = typeof input.path === "string" ? input.path : undefined;
			const targetVal = typeof input.target === "string" ? input.target : undefined;
			const candidate = pathVal ?? targetVal;
			if (candidate && !isAllowedPath(resolve(ctx.cwd, candidate), roots)) {
				return { block: true, reason: "path is outside the pod workspace" };
			}
			return;
		}
		if (event.toolName === "bash" && podSession?.connected && typeof input.command === "string") {
			return {
				input: {
					...input,
					command: wrapBashCommand(input.command, {
						bin: config.pod.bin,
						id: podSession.workspaceId,
					}),
				},
			};
		}
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

	pi.on("tool_execution_start", (event, ctx) => {
		lastTool = event.toolName;
		if (ctx.hasUI) {
			ctx.ui.setStatus("aio-tool", event.toolName);
			void refreshHud(ctx);
		}
	});

	pi.on("tool_execution_end", (event, ctx) => {
		if (lastTool === event.toolName) lastTool = undefined;
		if (ctx.hasUI) {
			ctx.ui.setStatus("aio-tool", undefined);
			void refreshHud(ctx);
		}
	});


	pi.on("turn_end", (event, ctx) => {
		if (ctx) hudCtx = ctx;
		boardLanes.onTurnEnd();
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
