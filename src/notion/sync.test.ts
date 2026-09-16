import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { appendNotionMarker, ensureDatabase, hasNotionMarker, syncPrCreated, syncPrReviewed, unsyncedIssuesForRepo } from "./sync.ts";
import type { NotionClient } from "./client.ts";
import type { TissueIssue } from "../issues/types.ts";

function fakeClient(overrides: Partial<NotionClient> = {}): NotionClient {
	return {
		findDatabase: async () => ({ id: null }),
		createDatabase: async () => ({ id: "new-db" }),
		queryDatabase: async () => ({ results: [] }),
		createPage: async () => ({ id: "new-page" }),
		updatePageProperties: async () => ({ id: "updated" }),
		...overrides,
	};
}

describe("ensureDatabase", () => {
	test("returns the existing database id without creating one", async () => {
		const client = fakeClient({ findDatabase: async () => ({ id: "existing-db" }) });
		expect(await ensureDatabase(client, "page1")).toBe("existing-db");
	});

	test("creates the database when none exists", async () => {
		const calls: string[] = [];
		const client = fakeClient({
			findDatabase: async () => ({ id: null }),
			createDatabase: async (parentPageId, title) => {
				calls.push(`${parentPageId}:${title}`);
				return { id: "new-db" };
			},
		});
		expect(await ensureDatabase(client, "page1")).toBe("new-db");
		expect(calls).toEqual(["page1:PRs"]);
	});

	test("throws when findDatabase fails", async () => {
		const client = fakeClient({ findDatabase: async () => ({ error: "missing_credentials" }) });
		await expect(ensureDatabase(client, "page1")).rejects.toThrow();
	});

	test("throws when createDatabase fails", async () => {
		const client = fakeClient({
			findDatabase: async () => ({ id: null }),
			createDatabase: async () => ({ error: "upstream_error", status: 500, detail: "boom" }),
		});
		await expect(ensureDatabase(client, "page1")).rejects.toThrow();
	});
});

function withTempRepo(files: Record<string, string>): { root: string; cleanup: () => void } {
	const root = mkdtempSync(join(tmpdir(), "aio-notion-"));
	const dir = join(root, "issues");
	mkdirSync(dir, { recursive: true });
	for (const [name, content] of Object.entries(files)) writeFileSync(join(dir, name), content);
	return { root, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

describe("issue markers", () => {
	test("hasNotionMarker is false until appendNotionMarker writes one", () => {
		const { root, cleanup } = withTempRepo({
			"a1-Do the thing.md": "# Do the thing\nsome body\n\n## Links\n- tissue: a1\n- repo: acme/widgets\n",
		});
		try {
			const issue: TissueIssue = {
				id: "a1",
				title: "Do the thing",
				description: "some body\n\n## Links\n- tissue: a1\n- repo: acme/widgets",
				path: join(root, "issues", "a1-Do the thing.md"),
				fileName: "a1-Do the thing.md",
			};
			expect(hasNotionMarker(issue)).toBe(false);
			appendNotionMarker(issue, "page-xyz");
			const reloaded = unsyncedIssuesForRepo(root, "acme/widgets");
			expect(reloaded).toEqual([]);
		} finally {
			cleanup();
		}
	});
});

describe("unsyncedIssuesForRepo", () => {
	test("returns only issues for the given repo without a notion-id marker", () => {
		const { root, cleanup } = withTempRepo({
			"a1-One.md": "# One\nbody\n\n## Links\n- tissue: a1\n- repo: acme/widgets\n",
			"a2-Two.md": "# Two\nbody\n\n## Links\n- tissue: a2\n- repo: other/repo\n",
			"a3-Three.md": "# Three\nbody\n\n## Links\n- tissue: a3\n- repo: acme/widgets\n\n<!-- notion-id: already-synced -->\n",
		});
		try {
			const issues = unsyncedIssuesForRepo(root, "acme/widgets");
			expect(issues.map((i) => i.id)).toEqual(["a1"]);
		} finally {
			cleanup();
		}
	});
});

describe("syncPrCreated", () => {
	test("creates the PR page and nests every unsynced repo issue as a sub-page, marking each one", async () => {
		const { root, cleanup } = withTempRepo({
			"a1-One.md": "# One\nbody\n\n## Links\n- tissue: a1\n- repo: acme/widgets\n",
			"a2-Two.md": "# Two\nbody\n\n## Links\n- tissue: a2\n- repo: other/repo\n",
		});
		try {
			const created: Array<{ parent: unknown }> = [];
			const client = fakeClient({
				findDatabase: async () => ({ id: "db1" }),
				createPage: async (input) => {
					created.push({ parent: input.parent });
					return { id: created.length === 1 ? "pr-page" : `sub-page-${created.length}` };
				},
			});
			const pr = { number: 7, title: "Add widget", htmlUrl: "https://github.com/acme/widgets/pull/7", repoSlug: "acme/widgets", headRef: "feat/widget", baseRef: "main" };
			const result = await syncPrCreated(client, { root, parentPageId: "page1", pr });
			expect(result).toEqual({ databaseId: "db1", prPageId: "pr-page", nested: 1 });
			expect(created).toHaveLength(2);
			expect(created[0]?.parent).toEqual({ database_id: "db1" });
			expect(created[1]?.parent).toEqual({ page_id: "pr-page" });

			const remaining = unsyncedIssuesForRepo(root, "acme/widgets");
			expect(remaining).toEqual([]);
		} finally {
			cleanup();
		}
	});
});

describe("syncPrReviewed", () => {
	test("queries by repo + PR#, and updates Status/Claude CI Review on the matching row", async () => {
		const patched: Array<{ id: string; properties: unknown }> = [];
		const client = fakeClient({
			findDatabase: async () => ({ id: "db1" }),
			queryDatabase: async (_databaseId, filter) => {
				expect(filter).toEqual({
					and: [{ property: "Repo", rich_text: { equals: "acme/widgets" } }, { property: "PR #", number: { equals: 7 } }],
				});
				return { results: [{ id: "pr-page" }] };
			},
			updatePageProperties: async (id, properties) => {
				patched.push({ id, properties });
				return { id };
			},
		});
		const result = await syncPrReviewed(client, {
			parentPageId: "page1",
			repoSlug: "acme/widgets",
			prNumber: 7,
			merged: true,
			gate: { ok: true, confidence: 5 },
		});
		expect(result).toEqual({ updated: true });
		expect(patched).toEqual([
			{
				id: "pr-page",
				properties: { Status: { select: { name: "Merged" } }, "Claude CI Review": { select: { name: "Pass" } } },
			},
		]);
	});

	test("Fail review status and Closed status when not merged", async () => {
		const patched: Array<{ properties: unknown }> = [];
		const client = fakeClient({
			findDatabase: async () => ({ id: "db1" }),
			queryDatabase: async () => ({ results: [{ id: "pr-page" }] }),
			updatePageProperties: async (_id, properties) => {
				patched.push({ properties });
				return { id: "pr-page" };
			},
		});
		await syncPrReviewed(client, {
			parentPageId: "page1",
			repoSlug: "acme/widgets",
			prNumber: 7,
			merged: false,
			gate: { ok: false, confidence: 2 },
		});
		expect(patched[0]?.properties).toEqual({
			Status: { select: { name: "Closed" } },
			"Claude CI Review": { select: { name: "Fail" } },
		});
	});

	test("no-op (updated: false) when no matching row is found", async () => {
		const client = fakeClient({ findDatabase: async () => ({ id: "db1" }), queryDatabase: async () => ({ results: [] }) });
		const result = await syncPrReviewed(client, {
			parentPageId: "page1",
			repoSlug: "acme/widgets",
			prNumber: 7,
			merged: false,
			gate: { ok: false },
		});
		expect(result).toEqual({ updated: false });
	});
});
