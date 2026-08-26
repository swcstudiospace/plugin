import { writeFileSync } from "node:fs";
import type { KtuiRunner } from "./kanban.ts";
import { boardSnapshot, syncIssue } from "./kanban.ts";
import { createIssue, ensureRepo, formatIssueBody, issueLinks, listIssues, parseIssueFile } from "./tissue.ts";
import type { BoardSnapshot, GithubAssoc, SyncResult } from "./types.ts";

const TITLE_MAX = 80;

function titleFromPrompt(original: string): string {
	for (const line of original.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (trimmed) return trimmed.slice(0, TITLE_MAX);
	}
	return "Untitled prompt";
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
