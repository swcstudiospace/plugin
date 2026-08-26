export function parseShipArgs(kind: "pr" | "review" | "merge", args: string): { cmd: string; rest: string } {
	const trimmed = args.trim();
	if (kind === "pr") {
		if (!trimmed) return { cmd: "list", rest: "" };
		const parts = trimmed.split(/\s+/);
		return { cmd: parts[0]!.toLowerCase(), rest: parts.slice(1).join(" ") };
	}
	if (kind === "review") {
		if (!trimmed) return { cmd: "review", rest: "" };
		const parts = trimmed.split(/\s+/);
		return { cmd: "review", rest: parts[0]! };
	}
	if (!trimmed) return { cmd: "merge", rest: "" };
	const parts = trimmed.split(/\s+/);
	return { cmd: "merge", rest: parts[0]! };
}

export const PR_COMPLETIONS: Array<{ value: string; label: string }> = [
	{ value: "create", label: "create — open a pull request" },
	{ value: "list", label: "list — list pull requests" },
];
