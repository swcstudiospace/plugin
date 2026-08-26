import type { ExtensionAPI, ExtensionContext } from "@oh-my-pi/pi-coding-agent";
import { completePrompt, recentConversation } from "./complete.ts";
import { applyCommand, formatStatus, parseAioArgs } from "./commands.ts";
import { loadConfig } from "./config.ts";
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

function filterCompletions(
	prefix: string,
	extra: { value: string; label: string }[] = [],
): { value: string; label: string }[] | null {
	const needle = prefix.trim().toLowerCase();
	const filtered = [...extra, ...COMPLETIONS].filter((item) => item.value.startsWith(needle));
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

	const config = loadConfig();
	const state: UpliftState = {
		enabled: config.uplift.enabled,
		skipOnce: false,
		skipTrivial: config.uplift.skipTrivial,
	};
	let lastResult: UpliftResult | undefined;
	let injectAddendum = false;

	pi.registerFlag("aio-uplift-off", {
		description: "Disable Prompt Uplift",
		type: "boolean",
		default: false,
	});

	function persist(): void {
		pi.appendEntry("aio-state", { enabled: state.enabled });
	}

	function applyFlag(): void {
		if (pi.getFlag("aio-uplift-off") === true) state.enabled = false;
	}

	function notify(ctx: ExtensionContext, message: string, level: "info" | "warning" | "error" = "info"): void {
		if (ctx.hasUI) ctx.ui.notify(message, level);
	}

	async function handleCommand(args: string, ctx: ExtensionContext): Promise<void> {
		const { cmd } = parseAioArgs(args);
		const result = applyCommand(state, cmd);
		if (cmd === "on" || cmd === "off" || cmd === "toggle") persist();
		if (result.showLast) {
			if (!lastResult) {
				notify(ctx, result.message, "warning");
				return;
			}
			notify(ctx, lastResult.xml);
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

	pi.registerCommand("aio", {
		description: "All-in-one plugin commands",
		getArgumentCompletions: (prefix) => {
			const nested = prefix.trimStart().match(/^uplift(?:\s+|$)(.*)$/i);
			if (nested) return filterCompletions(nested[1] ?? "");
			return filterCompletions(prefix, [{ value: "uplift", label: "uplift — Prompt Uplift commands" }]);
		},
		handler: handleCommand,
	});

	pi.on("session_start", (event, ctx) => {
		applyFlag();
		const manager = ctx.sessionManager;
		const entries =
			typeof manager.getBranch === "function" ? manager.getBranch() : manager.getEntries();
		const saved = findCustom<{ enabled?: boolean }>(entries, "aio-state");
		if (typeof saved?.enabled === "boolean") state.enabled = saved.enabled;
		applyFlag();
		const last = findCustom<UpliftResult>(entries, "aio-uplift-last");
		if (last && typeof last.xml === "string" && typeof last.root === "string") lastResult = last;
		const reason = (event as { reason?: string }).reason;
		if (ctx.hasUI && (reason === "startup" || reason === "new")) {
			notify(
				ctx,
				state.enabled
					? "Prompt Uplift on — prefix raw: to skip."
					: "Prompt Uplift off — /uplift on to enable.",
			);
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
		if (!injectAddendum) return;
		injectAddendum = false;
		const parts = Array.isArray(event.systemPrompt)
			? [...event.systemPrompt]
			: [String(event.systemPrompt ?? "")];
		if (parts.join("\n").includes("## Prompt Uplift")) return;
		parts.push(SYSTEM_ADDENDUM);
		return { systemPrompt: parts };
	});
}
