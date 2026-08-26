export function parsePodArgs(args: string): { cmd: string; rest: string } {
	const trimmed = args.trim();
	if (!trimmed) return { cmd: "status", rest: "" };
	const parts = trimmed.split(/\s+/);
	return { cmd: parts[0]!.toLowerCase(), rest: parts.slice(1).join(" ") };
}

export const POD_COMPLETIONS: Array<{ value: string; label: string }> = [
	{ value: "status", label: "status — pod workspace status" },
	{ value: "up", label: "up — start the pod workspace" },
	{ value: "connect", label: "connect — connect to the pod workspace" },
	{ value: "doctor", label: "doctor — diagnose pod workspace" },
	{ value: "on", label: "on — enable pod boot" },
	{ value: "off", label: "off — disable pod boot" },
];
