import { escapeXml } from "../uplift/xml.ts";
import type { GraphSyncResult, SyncResult, TissueIssue } from "./types.ts";

export function formatIssueEcho(result: SyncResult): string {
	const head = `${result.issue.id}  ${result.issue.path}`;
	if (result.skipped) {
		return result.reason ? `${head}  ${result.reason}` : `${head}  skipped`;
	}
	if (result.taskId != null) {
		return `${head}  task ${result.taskId}`;
	}
	return head;
}

export function formatIssueList(issues: TissueIssue[]): string {
	if (issues.length === 0) return "No issues";
	return issues.map((issue) => `${issue.id}  ${issue.title}`).join("\n");
}


export function formatIssueAddendum(tree?: GraphSyncResult): string {
	const lines = [
		"## Issue tracking",
		"",
		"Execute the Tissue tree: one parent plus one sub-issue per graph node, in dependency order. Persist with git add issues/; do not run gh issue create. Do not reprint the issue files.",
	];
	if (tree) {
		lines.push("", `parent ${tree.parent.issue.id} ${tree.parent.issue.title}`);
		for (const child of tree.children) {
			const tagged = /^\[([^\]]+)\]\s*(.*)$/.exec(child.issue.title);
			if (tagged) {
				lines.push(`child ${child.issue.id} [${tagged[1]}] ${tagged[2]}`);
			} else {
				lines.push(`child ${child.issue.id} ${child.issue.title}`);
			}
		}
	}
	return `${lines.join("\n")}\n`;
}

const ISSUES_BLOCK_RE = /<ISSUES\b[\s\S]*?<\/ISSUES>/i;
const NODE_TAG_RE = /^\[([^\]]+)\]\s*(.*)$/;

function issueAttrs(id: string, title: string, taskId: number | null): string {
	const parts = [` id="${escapeXml(id)}"`, ` title="${escapeXml(title)}"`];
	if (taskId != null) parts.push(` taskId="${taskId}"`);
	return parts.join("");
}

function subIssueTag(child: SyncResult): string {
	const tagged = NODE_TAG_RE.exec(child.issue.title);
	const nodeId = tagged?.[1];
	const title = tagged ? (tagged[2] ?? "") : child.issue.title;
	const parts = [` id="${escapeXml(child.issue.id)}"`];
	if (nodeId) parts.push(` nodeId="${escapeXml(nodeId)}"`);
	parts.push(` title="${escapeXml(title)}"`);
	if (child.taskId != null) parts.push(` taskId="${child.taskId}"`);
	return `\t<SUBISSUE${parts.join("")}/>`;
}

export function issuesToXml(input: { tree?: GraphSyncResult; last?: SyncResult }): string {
	if (input.tree) {
		const { parent, children } = input.tree;
		if (!parent.issue.id) return "";
		const attrs = issueAttrs(parent.issue.id, parent.issue.title, parent.taskId);
		if (children.length === 0) return ["<ISSUES>", `\t<ISSUE${attrs}/>`, "</ISSUES>"].join("\n");
		return ["<ISSUES>", `\t<ISSUE${attrs}>`, ...children.map(subIssueTag), "\t</ISSUE>", "</ISSUES>"].join("\n");
	}
	if (input.last?.issue.id) {
		const attrs = issueAttrs(input.last.issue.id, input.last.issue.title, input.last.taskId);
		return ["<ISSUES>", `\t<ISSUE${attrs}/>`, "</ISSUES>"].join("\n");
	}
	return "";
}

export function injectIssuesXml(upliftXml: string, input: { tree?: GraphSyncResult; last?: SyncResult }): string {
	const block = issuesToXml(input);
	if (ISSUES_BLOCK_RE.test(upliftXml)) {
		if (!block) return upliftXml.replace(/\n?[ \t]*<ISSUES\b[\s\S]*?<\/ISSUES>/i, "");
		return upliftXml.replace(ISSUES_BLOCK_RE, block);
	}
	if (!block) return upliftXml;

	const trimmed = upliftXml.trim();
	const open = trimmed.match(/^<([A-Za-z_][\w.-]*)\b([^>]*)>/);
	if (!open) return trimmed ? `${trimmed}\n${block}` : block;

	const tag = open[1]!;
	const closeRe = new RegExp(`</${tag}\\s*>\\s*$`, "i");
	if (!closeRe.test(trimmed)) return `${trimmed}\n${block}`;
	return trimmed.replace(closeRe, `\n${block}\n</${tag}>`);
}
