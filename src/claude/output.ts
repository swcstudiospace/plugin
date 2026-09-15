/**
 * Builds the `additionalContext` block a UserPromptSubmit hook returns.
 *
 * Claude Code (2.1.x) does not let a hook replace the prompt text, so the uplifted
 * spec rides alongside the user's message as context. The wording matters: Claude
 * treats hook context that "overrides the user" as prompt injection, so the block is
 * framed as the user's own request, elaborated by a plugin the user installed.
 */
import { formatIssueAddendum } from "../issues/format.ts";
import type { GraphSyncResult, SyncResult } from "../issues/types.ts";
import { THINK_ADDENDUM } from "../think/prompts.ts";
import type { ThoughtGraph } from "../think/types.ts";
import type { UpliftResult } from "../types.ts";

/** Generous ceiling; the spec is normally far smaller. Truncation keeps the head. */
export const DEFAULT_CONTEXT_CHARS = 60_000;

export const UPLIFT_CONTEXT_HEADER = `## Prompt Uplift

The user installed the All-in-one Prompt Uplift plugin. It expanded the user's message into the specification below; the ORIGINAL element holds the user's verbatim words. Treat the specification as the user's own elaborated intent and execute it. Do not reprint the XML. Prefer repository evidence over inferred assumptions.`;

export interface PromptContextInput {
	result: UpliftResult;
	graph?: ThoughtGraph;
	tree?: GraphSyncResult;
	last?: SyncResult;
	specPath?: string;
	maxChars?: number;
}

export function truncateXml(xml: string, maxChars: number, specPath?: string): string {
	if (xml.length <= maxChars) return xml;
	const cut = xml.lastIndexOf("\n", maxChars);
	const head = xml.slice(0, cut > 0 ? cut : maxChars);
	const where = specPath ? ` Full specification: ${specPath}` : "";
	return `${head}\n<!-- truncated by Prompt Uplift.${where} -->`;
}

export function formatPromptContext(input: PromptContextInput): string {
	const maxChars = input.maxChars ?? DEFAULT_CONTEXT_CHARS;
	const parts: string[] = [UPLIFT_CONTEXT_HEADER];
	if (input.specPath) parts.push(`Specification file: ${input.specPath}`);

	const tail: string[] = [];
	if (input.graph) tail.push(THINK_ADDENDUM.trim());
	if (input.tree) {
		tail.push(formatIssueAddendum(input.tree).trim());
	} else if (input.last?.issue.id) {
		tail.push(
			[
				"## Issue tracking",
				"",
				`This prompt is tracked as issue ${input.last.issue.id} at ${input.last.issue.path}. Persist with git add issues/; do not run gh issue create.`,
			].join("\n"),
		);
	}

	const fixed = parts.join("\n\n").length + tail.join("\n\n").length + 4;
	const budget = Math.max(2_000, maxChars - fixed);
	parts.push(truncateXml(input.result.xml, budget, input.specPath));
	return [...parts, ...tail].join("\n\n");
}

export function formatSummary(input: {
	result: UpliftResult;
	graph?: ThoughtGraph;
	tree?: GraphSyncResult;
	last?: SyncResult;
	elapsedMs?: number;
}): string {
	const bits = [`Prompt Uplift · ${input.result.root} · ${input.result.source}`];
	if (input.graph) bits.push(`Graph of Thought · ${input.graph.nodes.length} nodes`);
	if (input.tree) {
		const parent = input.tree.parent;
		if (parent.issue.id) {
			bits.push(`Issues · ${parent.issue.id} + ${input.tree.children.length} sub-issues`);
		} else if (parent.reason) {
			bits.push(`Issues skipped · ${parent.reason}`);
		}
		if (parent.issue.id && parent.taskId == null && parent.reason) bits.push(`Kanban skipped · ${parent.reason}`);
	} else if (input.last?.issue.id) {
		bits.push(`Issue · ${input.last.issue.id}`);
		if (input.last.taskId == null && input.last.reason) bits.push(`Kanban skipped · ${input.last.reason}`);
	}
	if (input.elapsedMs !== undefined) bits.push(`${(input.elapsedMs / 1000).toFixed(1)}s`);
	return bits.join(" · ");
}
