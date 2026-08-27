import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import type { ThoughtGraph, ThoughtNode } from "../think/types.ts";
import type { KtuiRunner } from "./kanban.ts";
import { boardSnapshot, syncIssue } from "./kanban.ts";
import { createIssue, ensureRepo, formatIssueBody, issueLinks, listIssues, parseIssueFile } from "./tissue.ts";
import type { BoardSnapshot, GithubAssoc, GraphSyncResult, SyncResult, TissueIssue } from "./types.ts";

const TITLE_MAX = 80;

function titleFromPrompt(original: string): string {
	for (const line of original.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (trimmed) return trimmed.slice(0, TITLE_MAX);
	}
	return "Untitled prompt";
}

export function workUnitId(original: string): string {
	let slug = "";
	for (const line of original.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		slug = trimmed
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "")
			.slice(0, 32);
		break;
	}
	if (!slug) slug = "untitled";
	const hash = createHash("sha256").update(original, "utf8").digest("hex").slice(0, 8);
	return `${slug}-${hash}`;
}

function aioMarker(id: string): string {
	return `<!-- aio-id: ${id} -->`;
}

function findByMarker(root: string, id: string): TissueIssue | undefined {
	const needle = aioMarker(id);
	return listIssues(root).find((issue) => issue.description.includes(needle));
}

function writeTrackedIssue(
	root: string,
	title: string,
	description: string,
	github: GithubAssoc | undefined,
	existing?: TissueIssue,
	now?: () => number,
): TissueIssue {
	if (existing) {
		writeFileSync(
			existing.path,
			formatIssueBody({
				title,
				description,
				extra: issueLinks(existing.id, github),
			}),
		);
		return parseIssueFile(existing.path) ?? { ...existing, title, description };
	}
	const created = createIssue(root, title, description, now ? { now } : undefined);
	writeFileSync(
		created.path,
		formatIssueBody({
			title,
			description,
			extra: issueLinks(created.id, github),
		}),
	);
	return parseIssueFile(created.path) ?? created;
}

function parentTitle(original: string, graph: ThoughtGraph): string {
	const goal = graph.goal.trim();
	if (goal) return goal.slice(0, TITLE_MAX);
	return titleFromPrompt(original);
}

function childTitle(node: ThoughtNode): string {
	return `[${node.id}] ${node.title}`.slice(0, TITLE_MAX);
}

function parentDescription(
	graph: ThoughtGraph,
	unitId: string,
	parentId: string,
	childIds: Record<string, string>,
): string {
	const rows = graph.nodes.map((node) => {
		const deps = node.dependsOn.length > 0 ? node.dependsOn.join(",") : "—";
		const child = childIds[node.id] ?? "pending";
		return `| ${node.id} | ${node.title} | ${node.kind} | ${deps} | ${child} |`;
	});
	return [
		"## Goal",
		graph.goal,
		"",
		"## Graph of Thought",
		"| id | title | kind | deps | child |",
		"|---|---|---|---|---|",
		...rows,
		"",
		"## Status",
		`- nodes: ${graph.nodes.length}`,
		`- parent: ${parentId}`,
		"",
		aioMarker(unitId),
	].join("\n");
}

function childDescription(node: ThoughtNode, unitId: string, parentId: string): string {
	const deps = node.dependsOn.length > 0 ? node.dependsOn.join(",") : "none";
	const cot = node.conclusion?.trim() ? node.conclusion : "(pending)";
	return [
		"## Node",
		`\`${node.id}\` · ${node.kind} · deps: ${deps}`,
		"",
		"## Question",
		node.question,
		"",
		"## Chain of Thought",
		cot,
		"",
		`parent: ${parentId}`,
		"",
		aioMarker(`${unitId}/${node.id}`),
	].join("\n");
}

function skippedResult(issue: TissueIssue, reason: string): SyncResult {
	return {
		issue,
		taskId: null,
		boardId: null,
		categoryId: null,
		created: false,
		skipped: true,
		reason,
	};
}

export async function trackThoughtGraph(opts: {
	root: string;
	original: string;
	graph: ThoughtGraph;
	run: KtuiRunner;
	boardName: string;
	github?: GithubAssoc;
}): Promise<GraphSyncResult> {
	const unitId = workUnitId(opts.original);
	const title = parentTitle(opts.original, opts.graph);
	const emptyIssue = (): TissueIssue => ({
		id: "",
		title,
		description: opts.original,
		path: "",
		fileName: "",
	});
	try {
		ensureRepo(opts.root);
		let tick = Date.now();
		const now = (): number => {
			tick += 1;
			return tick;
		};
		const existingParent = findByMarker(opts.root, unitId);
		let parent = writeTrackedIssue(
			opts.root,
			title,
			parentDescription(opts.graph, unitId, existingParent?.id ?? "pending", {}),
			opts.github,
			existingParent,
			now,
		);
		const children: TissueIssue[] = [];
		const childIds: Record<string, string> = {};
		for (const node of opts.graph.nodes) {
			const existingChild = findByMarker(opts.root, `${unitId}/${node.id}`);
			const child = writeTrackedIssue(
				opts.root,
				childTitle(node),
				childDescription(node, unitId, parent.id),
				opts.github,
				existingChild,
				now,
			);
			children.push(child);
			childIds[node.id] = child.id;
		}
		parent = writeTrackedIssue(
			opts.root,
			title,
			parentDescription(opts.graph, unitId, parent.id, childIds),
			opts.github,
			parent,
		);
		const parentSync = await syncIssue(opts.run, parent, { boardName: opts.boardName, github: opts.github });
		const childSyncs: SyncResult[] = [];
		for (const child of children) {
			childSyncs.push(await syncIssue(opts.run, child, { boardName: opts.boardName, github: opts.github }));
		}
		return { workUnitId: unitId, parent: parentSync, children: childSyncs };
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		return {
			workUnitId: unitId,
			parent: skippedResult(emptyIssue(), reason),
			children: [],
		};
	}
}

export async function trackUpliftedPrompt(opts: {
	root: string;
	original: string;
	run: KtuiRunner;
	boardName: string;
	github?: GithubAssoc;
}): Promise<SyncResult> {
	const title = titleFromPrompt(opts.original);
	try {
		ensureRepo(opts.root);
		const description = `${opts.original}\n\n#prompt @omp`;
		const created = createIssue(opts.root, title, description);
		writeFileSync(
			created.path,
			formatIssueBody({
				title,
				description,
				extra: issueLinks(created.id, opts.github),
			}),
		);
		const issue = parseIssueFile(created.path) ?? created;
		return await syncIssue(opts.run, issue, { boardName: opts.boardName, github: opts.github });
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		return {
			issue: {
				id: "",
				title,
				description: opts.original,
				path: "",
				fileName: "",
			},
			taskId: null,
			boardId: null,
			categoryId: null,
			created: false,
			skipped: true,
			reason,
		};
	}
}

export async function refreshSnapshot(
	run: KtuiRunner,
	boardName: string,
	slug?: string,
): Promise<BoardSnapshot | undefined> {
	try {
		return await boardSnapshot(run, { boardName, slug });
	} catch {
		return undefined;
	}
}

export async function syncAllIssues(
	root: string,
	run: KtuiRunner,
	boardName: string,
	github?: GithubAssoc,
): Promise<SyncResult[]> {
	const issues = listIssues(root);
	const results: SyncResult[] = [];
	for (const issue of issues) {
		try {
			results.push(await syncIssue(run, issue, { boardName, github }));
		} catch (error) {
			const reason = error instanceof Error ? error.message : String(error);
			results.push({
				issue,
				taskId: null,
				boardId: null,
				categoryId: null,
				created: false,
				skipped: true,
				reason,
			});
		}
	}
	return results;
}
