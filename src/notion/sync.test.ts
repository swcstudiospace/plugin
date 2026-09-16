import { describe, expect, test } from "bun:test";
import { ensureDatabase } from "./sync.ts";
import type { NotionClient } from "./client.ts";

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
