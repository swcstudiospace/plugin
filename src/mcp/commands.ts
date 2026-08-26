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

export function parseSupabaseArgs(args: string): { cmd: string; rest: string } {
	const trimmed = args.trim();
	if (!trimmed) return { cmd: "status", rest: "" };
	const parts = trimmed.split(/\s+/);
	return { cmd: parts[0]!.toLowerCase(), rest: parts.slice(1).join(" ") };
}

export const SUPABASE_COMPLETIONS: Array<{ value: string; label: string }> = [
	{ value: "status", label: "status — management and data credentials" },
	{ value: "projects", label: "projects — list Supabase projects" },
	{ value: "tables", label: "tables — list Data API tables" },
	{ value: "users", label: "users — summarize Auth Admin users" },
];
