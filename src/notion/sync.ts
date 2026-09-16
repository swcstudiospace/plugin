import { readFileSync, writeFileSync } from "node:fs";
import type { NotionClient } from "./client.ts";
import { NOTION_DATABASE_TITLE } from "./types.ts";
import { listIssues } from "../issues/tissue.ts";
import type { TissueIssue } from "../issues/types.ts";

export async function ensureDatabase(client: NotionClient, parentPageId: string): Promise<string> {
	const found = await client.findDatabase(parentPageId, NOTION_DATABASE_TITLE);
	if ("error" in found) throw new Error(`notion findDatabase failed: ${found.error}`);
	if (found.id) return found.id;

	const created = await client.createDatabase(parentPageId, NOTION_DATABASE_TITLE);
	if ("error" in created) throw new Error(`notion createDatabase failed: ${created.error}`);
	return created.id;
}

export interface NotionPr {
	number: number;
	title: string;
	htmlUrl: string;
	repoSlug: string;
	headRef: string;
	baseRef: string;
}

function notionMarker(pageId: string): string {
	return `<!-- notion-id: ${pageId} -->`;
}

export function hasNotionMarker(issue: TissueIssue): boolean {
	return issue.description.includes("<!-- notion-id:");
}

export function appendNotionMarker(issue: TissueIssue, pageId: string): void {
	const content = readFileSync(issue.path, "utf8").replace(/\n+$/, "");
	writeFileSync(issue.path, `${content}\n\n${notionMarker(pageId)}\n`);
}

export function unsyncedIssuesForRepo(root: string, repoSlug: string): TissueIssue[] {
	const marker = `- repo: ${repoSlug}`;
	return listIssues(root).filter((issue) => issue.description.includes(marker) && !hasNotionMarker(issue));
}

function prProperties(pr: NotionPr) {
	return {
		Title: { title: [{ text: { content: pr.title } }] },
		"PR #": { number: pr.number },
		Repo: { rich_text: [{ text: { content: pr.repoSlug } }] },
		Status: { select: { name: "Open" } },
		"Claude CI Review": { select: { name: "Pending" } },
		URL: { url: pr.htmlUrl },
		Branch: { rich_text: [{ text: { content: `${pr.headRef} → ${pr.baseRef}` } }] },
		Opened: { date: { start: new Date().toISOString() } },
	};
}

function issuePageProperties(title: string) {
	return { title: { title: [{ text: { content: title } }] } };
}

export async function syncPrCreated(
	client: NotionClient,
	opts: { root: string; parentPageId: string; pr: NotionPr },
): Promise<{ databaseId: string; prPageId: string; nested: number }> {
	const databaseId = await ensureDatabase(client, opts.parentPageId);

	const prPage = await client.createPage({ parent: { database_id: databaseId }, properties: prProperties(opts.pr) });
	if ("error" in prPage) throw new Error(`notion createPage (PR) failed: ${prPage.error}`);

	const issues = unsyncedIssuesForRepo(opts.root, opts.pr.repoSlug);
	let nested = 0;
	for (const issue of issues) {
		const page = await client.createPage({
			parent: { page_id: prPage.id },
			properties: issuePageProperties(issue.title),
		});
		if ("error" in page) continue; // fail-open: skip this issue, keep going
		appendNotionMarker(issue, page.id);
		nested += 1;
	}

	return { databaseId, prPageId: prPage.id, nested };
}
