export function parseThinkArgs(args: string): { cmd: string; rest: string } {
	const trimmed = args.trim();
	if (!trimmed) return { cmd: "status", rest: "" };
	const parts = trimmed.split(/\s+/);
	return { cmd: parts[0]!.toLowerCase(), rest: parts.slice(1).join(" ") };
}

export const THINK_COMPLETIONS: Array<{ value: string; label: string }> = [
	{ value: "on", label: "on — enable Graph of Thought" },
	{ value: "off", label: "off — disable Graph of Thought" },
	{ value: "toggle", label: "toggle — toggle Graph of Thought" },
	{ value: "status", label: "status — Graph of Thought status" },
	{ value: "last", label: "last — show the last thought graph" },
];

export function applyThinkToggle(
	state: { enabled: boolean },
	cmd: string,
): { enabled: boolean; message: string } {
	switch (cmd.trim().toLowerCase()) {
		case "on":
			state.enabled = true;
			return { enabled: true, message: "Graph of Thought on" };
		case "off":
			state.enabled = false;
			return { enabled: false, message: "Graph of Thought off" };
		case "toggle":
			state.enabled = !state.enabled;
			return { enabled: state.enabled, message: `Graph of Thought ${state.enabled ? "on" : "off"}` };
		default:
			return { enabled: state.enabled, message: `Graph of Thought ${state.enabled ? "on" : "off"}` };
	}
}
