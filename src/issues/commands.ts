export function parseIssueArgs(kind: "issues" | "kanban", args: string): { cmd: string; rest: string } {
	const trimmed = args.trim();
	if (!trimmed) return { cmd: kind === "kanban" ? "board" : "list", rest: "" };
	const parts = trimmed.split(/\s+/);
	return { cmd: parts[0]!.toLowerCase(), rest: parts.slice(1).join(" ") };
}

export const ISSUE_COMPLETIONS: Array<{ value: string; label: string }> = [
	{ value: "list", label: "list — show tissue issues" },
	{ value: "status", label: "status — tracking status" },
	{ value: "sync", label: "sync — sync issues to the board" },
	{ value: "last", label: "last — show the last synced issue" },
	{ value: "on", label: "on — enable issue tracking" },
	{ value: "off", label: "off — disable issue tracking" },
];

export const KANBAN_COMPLETIONS: Array<{ value: string; label: string }> = [
	{ value: "board", label: "board — show the kanban board" },
	{ value: "sync", label: "sync — sync issues to the board" },
	{ value: "open", label: "open — open the board overlay" },
	{ value: "status", label: "status — board status" },
];

export function applyIssueToggle(
	state: { enabled: boolean },
	cmd: string,
): { enabled: boolean; message: string } {
	switch (cmd.trim().toLowerCase()) {
		case "on":
			state.enabled = true;
			return { enabled: true, message: "Issue tracking on" };
		case "off":
			state.enabled = false;
			return { enabled: false, message: "Issue tracking off" };
		case "toggle":
			state.enabled = !state.enabled;
			return { enabled: state.enabled, message: `Issue tracking ${state.enabled ? "on" : "off"}` };
		default:
			return { enabled: state.enabled, message: `Issue tracking ${state.enabled ? "on" : "off"}` };
	}
}
