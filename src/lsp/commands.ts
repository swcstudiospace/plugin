export function parseLspArgs(args: string): { cmd: string; rest: string } {
	const trimmed = args.trim();
	if (!trimmed) return { cmd: "status", rest: "" };
	const parts = trimmed.split(/\s+/);
	return { cmd: parts[0]!.toLowerCase(), rest: parts.slice(1).join(" ") };
}

export const LSP_COMPLETIONS: Array<{ value: string; label: string }> = [
	{ value: "status", label: "status — live language server status" },
	{ value: "diagnostics", label: "diagnostics — current diagnostic digest" },
];
