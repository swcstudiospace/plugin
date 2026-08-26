import type { UpliftState } from "./types.ts";

export function parseAioArgs(args: string): { cmd: string; rest: string } {
	const trimmed = args.trim();
	if (!trimmed) return { cmd: "toggle", rest: "" };
	const parts = trimmed.split(/\s+/);
	if (parts[0]?.toLowerCase() === "uplift") parts.shift();
	if (parts.length === 0) return { cmd: "toggle", rest: "" };
	return { cmd: parts[0]!.toLowerCase(), rest: parts.slice(1).join(" ") };
}

export function formatStatus(
	state: UpliftState,
	last?: { root: string; source: string } | null,
): string {
	const skip = state.skipOnce ? " (skip next)" : "";
	let text = `Prompt Uplift ${state.enabled ? "on" : "off"}${skip}`;
	if (last) text += `\nLast: ${last.root} (${last.source})`;
	return text;
}

export function formatUpliftEcho(result: { root: string; source: string; xml: string }): string {
	return `Prompt Uplift · ${result.root} · ${result.source}\n\n${result.xml}`;
}

export function applyCommand(
	state: UpliftState,
	cmd: string,
): { state: UpliftState; message: string; showLast?: boolean } {
	switch (cmd.trim().toLowerCase()) {
		case "":
		case "toggle":
			state.enabled = !state.enabled;
			return { state, message: `Prompt Uplift ${state.enabled ? "on" : "off"}` };
		case "on":
			state.enabled = true;
			return { state, message: "Prompt Uplift on" };
		case "off":
			state.enabled = false;
			return { state, message: "Prompt Uplift off" };
		case "skip":
			state.skipOnce = true;
			return { state, message: "Prompt Uplift will skip the next prompt" };
		case "status":
			return { state, message: formatStatus(state) };
		case "last":
			return { state, message: "No last uplift in this session yet", showLast: true };
		default:
			return { state, message: "Usage: /uplift [on|off|status|skip|last]" };
	}
}
