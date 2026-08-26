import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import type { TSchema } from "@oh-my-pi/pi-ai";
import { Type } from "typebox";
import { formatIssueList } from "./format.ts";
import type { BoardSnapshot, GraphSyncResult, SyncResult, TissueIssue } from "./types.ts";

export function registerIssueTools(
	pi: ExtensionAPI,
	deps: {
		enabled: () => boolean;
		list: () => TissueIssue[];
		tree: () => GraphSyncResult | undefined;
		last: () => SyncResult | undefined;
		snapshot: () => Promise<BoardSnapshot | undefined>;
	},
): void {
	pi.registerTool({
		name: "issues_status",
		label: "Issue Status",
		description: "Show last parent, sub-issue count, and board name. Never includes tokens.",
		parameters: Type.Object({}) as unknown as TSchema,
		loadMode: "essential",
		approval: "read",
		async execute() {
			try {
				if (!deps.enabled()) {
					return { content: [{ type: "text", text: "Issue tracking off" }] };
				}
				const lines: string[] = [];
				const last = deps.last();
				if (last) lines.push(`${last.issue.id}  ${last.issue.title}`);
				const tree = deps.tree();
				if (tree) lines.push(`${tree.children.length} sub-issues`);
				const snap = await deps.snapshot();
				lines.push(snap?.boardName ?? "board offline");
				return { content: [{ type: "text", text: lines.join("\n") }] };
			} catch {
				return { content: [{ type: "text", text: "" }] };
			}
		},
	});

	pi.registerTool({
		name: "issues_list",
		label: "Issue List",
		description: "List Tissue issues in this workspace.",
		parameters: Type.Object({}) as unknown as TSchema,
		loadMode: "essential",
		approval: "read",
		async execute() {
			try {
				if (!deps.enabled()) {
					return { content: [{ type: "text", text: "Issue tracking off" }] };
				}
				return { content: [{ type: "text", text: formatIssueList(deps.list()) }] };
			} catch {
				return { content: [{ type: "text", text: "" }] };
			}
		},
	});
}
