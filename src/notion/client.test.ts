import { describe, expect, test } from "bun:test";
import { createNotion } from "./client.ts";
import type { HttpFn } from "./client.ts";

function mockHttp(
	script: (req: { method: string; url: string; headers: Record<string, string>; body?: string }) =>
		{ status: number; text: string } | Promise<{ status: number; text: string }>,
): HttpFn & { calls: Array<{ method: string; url: string; headers: Record<string, string>; body?: string }> } {
	const calls: Array<{ method: string; url: string; headers: Record<string, string>; body?: string }> = [];
	const http: HttpFn = async (req) => {
		calls.push(req);
		return script(req);
	};
	return Object.assign(http, { calls });
}

describe("createNotion", () => {
	test("missing_credentials when no apiKey is configured", async () => {
		const notion = createNotion({ http: mockHttp(() => ({ status: 200, text: "{}" })) });
		expect(await notion.findDatabase("page1", "PRs")).toEqual({ error: "missing_credentials" });
	});

	test("findDatabase sends a search request with auth + version headers and returns a match by parent + title", async () => {
		const http = mockHttp(() => ({
			status: 200,
			text: JSON.stringify({ results: [{ id: "db1", parent: { page_id: "page1" }, title: [{ plain_text: "PRs" }] }] }),
		}));
		const notion = createNotion({ http, apiKey: "secret_abc" });
		const result = await notion.findDatabase("page1", "PRs");
		expect(result).toEqual({ id: "db1" });
		expect(http.calls[0]?.url).toBe("https://api.notion.com/v1/search");
		expect(http.calls[0]?.headers.Authorization).toBe("Bearer secret_abc");
		expect(http.calls[0]?.headers["Notion-Version"]).toBe("2022-06-28");
	});

	test("findDatabase returns id: null when nothing matches", async () => {
		const http = mockHttp(() => ({ status: 200, text: JSON.stringify({ results: [] }) }));
		const notion = createNotion({ http, apiKey: "secret_abc" });
		expect(await notion.findDatabase("page1", "PRs")).toEqual({ id: null });
	});

	test("createDatabase posts to /databases and returns the new id", async () => {
		const http = mockHttp(() => ({ status: 200, text: JSON.stringify({ id: "db2" }) }));
		const notion = createNotion({ http, apiKey: "secret_abc" });
		const result = await notion.createDatabase("page1", "PRs");
		expect(result).toEqual({ id: "db2" });
		expect(http.calls[0]?.method).toBe("POST");
		expect(http.calls[0]?.url).toBe("https://api.notion.com/v1/databases");
		const body = JSON.parse(http.calls[0]?.body ?? "{}");
		expect(body.parent).toEqual({ type: "page_id", page_id: "page1" });
		expect(body.properties.Status.select.options.map((o: { name: string }) => o.name)).toEqual(["Open", "Merged", "Closed"]);
	});

	test("queryDatabase posts a filter and returns results", async () => {
		const http = mockHttp(() => ({ status: 200, text: JSON.stringify({ results: [{ id: "row1" }] }) }));
		const notion = createNotion({ http, apiKey: "secret_abc" });
		const result = await notion.queryDatabase("db1", { property: "PR #", number: { equals: 42 } });
		expect(result).toEqual({ results: [{ id: "row1" }] });
		expect(http.calls[0]?.url).toBe("https://api.notion.com/v1/databases/db1/query");
	});

	test("createPage posts to /pages with parent + properties + optional children", async () => {
		const http = mockHttp(() => ({ status: 200, text: JSON.stringify({ id: "page9" }) }));
		const notion = createNotion({ http, apiKey: "secret_abc" });
		const result = await notion.createPage({
			parent: { database_id: "db1" },
			properties: { Title: { title: [{ text: { content: "x" } }] } },
		});
		expect(result).toEqual({ id: "page9" });
		expect(http.calls[0]?.url).toBe("https://api.notion.com/v1/pages");
	});

	test("updatePageProperties patches /pages/{id}", async () => {
		const http = mockHttp(() => ({ status: 200, text: JSON.stringify({ id: "page9" }) }));
		const notion = createNotion({ http, apiKey: "secret_abc" });
		const result = await notion.updatePageProperties("page9", { Status: { select: { name: "Merged" } } });
		expect(result).toEqual({ id: "page9" });
		expect(http.calls[0]?.method).toBe("PATCH");
		expect(http.calls[0]?.url).toBe("https://api.notion.com/v1/pages/page9");
	});

	test("upstream_error on a >=400 response, upstream_unreachable when the request throws", async () => {
		const failing = createNotion({ http: mockHttp(() => ({ status: 401, text: "unauthorized" })), apiKey: "bad" });
		expect(await failing.findDatabase("p", "PRs")).toEqual({ error: "upstream_error", status: 401, detail: "unauthorized" });

		const unreachable = createNotion({
			http: async () => { throw new Error("network down"); },
			apiKey: "secret_abc",
		});
		expect(await unreachable.findDatabase("p", "PRs")).toEqual({ error: "upstream_unreachable", message: "network down" });
	});
});
