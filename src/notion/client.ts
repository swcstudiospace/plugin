import { NOTION_API_BASE, NOTION_API_VERSION } from "./types.ts";

export type HttpFn = (req: {
	method: string;
	url: string;
	headers: Record<string, string>;
	body?: string;
}) => Promise<{ status: number; text: string }>;

export interface CreateNotionOptions {
	http?: HttpFn;
	apiKey?: string;
}

export type NotionFail =
	| { error: "missing_credentials" }
	| { error: "upstream_error"; status: number; detail: string }
	| { error: "upstream_unreachable"; message: string }
	| { error: "invalid_json"; status: number; body: string };

export interface NotionClient {
	findDatabase(parentPageId: string, title: string): Promise<{ id: string | null } | NotionFail>;
	createDatabase(parentPageId: string, title: string): Promise<{ id: string } | NotionFail>;
	queryDatabase(databaseId: string, filter: unknown): Promise<{ results: unknown[] } | NotionFail>;
	createPage(input: {
		parent: { database_id: string } | { page_id: string };
		properties: Record<string, unknown>;
		children?: unknown[];
	}): Promise<{ id: string } | NotionFail>;
	updatePageProperties(pageId: string, properties: Record<string, unknown>): Promise<{ id: string } | NotionFail>;
}

async function defaultHttp(req: { method: string; url: string; headers: Record<string, string>; body?: string }) {
	const res = await fetch(req.url, { method: req.method, headers: req.headers, body: req.body });
	return { status: res.status, text: await res.text() };
}

type HttpOk = { status: number; data: unknown };
type HttpFailure = Exclude<NotionFail, { error: "missing_credentials" }>;

async function callHttp(http: HttpFn, req: { method: string; url: string; headers: Record<string, string>; body?: string }): Promise<HttpOk | HttpFailure> {
	let res: { status: number; text: string };
	try {
		res = await http(req);
	} catch (error) {
		return { error: "upstream_unreachable", message: error instanceof Error ? error.message : String(error) };
	}
	if (res.status >= 400) return { error: "upstream_error", status: res.status, detail: res.text.slice(0, 2000) };
	if (!res.text.trim()) return { status: res.status, data: null };
	try {
		return { status: res.status, data: JSON.parse(res.text) as unknown };
	} catch {
		return { error: "invalid_json", status: res.status, body: res.text.slice(0, 2000) };
	}
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
	if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
	return value as Record<string, unknown>;
}

function plainTitle(title: unknown): string {
	const arr = Array.isArray(title) ? title : [];
	return arr.map((t) => asRecord(t)?.plain_text ?? "").join("").trim();
}

function databaseSchema(parentPageId: string, title: string) {
	return {
		parent: { type: "page_id", page_id: parentPageId },
		title: [{ type: "text", text: { content: title } }],
		properties: {
			Title: { title: {} },
			"PR #": { number: {} },
			Repo: { rich_text: {} },
			Status: { select: { options: [{ name: "Open" }, { name: "Merged" }, { name: "Closed" }] } },
			"Claude CI Review": { select: { options: [{ name: "Pending" }, { name: "Pass" }, { name: "Fail" }] } },
			URL: { url: {} },
			Branch: { rich_text: {} },
			Opened: { date: {} },
		},
	};
}

export function createNotion(options: CreateNotionOptions = {}): NotionClient {
	const http = options.http ?? defaultHttp;

	function apiKey(): string {
		return options.apiKey ?? "";
	}

	function headers(): Record<string, string> {
		return {
			Authorization: `Bearer ${apiKey()}`,
			"Notion-Version": NOTION_API_VERSION,
			"Content-Type": "application/json",
		};
	}

	async function findDatabase(parentPageId: string, title: string): Promise<{ id: string | null } | NotionFail> {
		if (!apiKey()) return { error: "missing_credentials" };
		const res = await callHttp(http, {
			method: "POST",
			url: `${NOTION_API_BASE}/search`,
			headers: headers(),
			body: JSON.stringify({ query: title, filter: { property: "object", value: "database" } }),
		});
		if ("error" in res) return res;
		const results = Array.isArray(asRecord(res.data)?.results) ? (asRecord(res.data)?.results as unknown[]) : [];
		const match = results
			.map((r) => asRecord(r))
			.find((r) => r?.id && asRecord(r?.parent)?.page_id === parentPageId && plainTitle(r?.title) === title);
		return { id: (match?.id as string | undefined) ?? null };
	}

	async function createDatabase(parentPageId: string, title: string): Promise<{ id: string } | NotionFail> {
		if (!apiKey()) return { error: "missing_credentials" };
		const res = await callHttp(http, {
			method: "POST",
			url: `${NOTION_API_BASE}/databases`,
			headers: headers(),
			body: JSON.stringify(databaseSchema(parentPageId, title)),
		});
		if ("error" in res) return res;
		const id = asRecord(res.data)?.id;
		if (typeof id !== "string") return { error: "invalid_json", status: res.status, body: JSON.stringify(res.data).slice(0, 2000) };
		return { id };
	}

	async function queryDatabase(databaseId: string, filter: unknown): Promise<{ results: unknown[] } | NotionFail> {
		if (!apiKey()) return { error: "missing_credentials" };
		const res = await callHttp(http, {
			method: "POST",
			url: `${NOTION_API_BASE}/databases/${databaseId}/query`,
			headers: headers(),
			body: JSON.stringify({ filter }),
		});
		if ("error" in res) return res;
		const results = asRecord(res.data)?.results;
		return { results: Array.isArray(results) ? results : [] };
	}

	async function createPage(input: {
		parent: { database_id: string } | { page_id: string };
		properties: Record<string, unknown>;
		children?: unknown[];
	}): Promise<{ id: string } | NotionFail> {
		if (!apiKey()) return { error: "missing_credentials" };
		const res = await callHttp(http, {
			method: "POST",
			url: `${NOTION_API_BASE}/pages`,
			headers: headers(),
			body: JSON.stringify({ parent: input.parent, properties: input.properties, children: input.children ?? [] }),
		});
		if ("error" in res) return res;
		const id = asRecord(res.data)?.id;
		if (typeof id !== "string") return { error: "invalid_json", status: res.status, body: JSON.stringify(res.data).slice(0, 2000) };
		return { id };
	}

	async function updatePageProperties(pageId: string, properties: Record<string, unknown>): Promise<{ id: string } | NotionFail> {
		if (!apiKey()) return { error: "missing_credentials" };
		const res = await callHttp(http, {
			method: "PATCH",
			url: `${NOTION_API_BASE}/pages/${pageId}`,
			headers: headers(),
			body: JSON.stringify({ properties }),
		});
		if ("error" in res) return res;
		const id = asRecord(res.data)?.id;
		if (typeof id !== "string") return { error: "invalid_json", status: res.status, body: JSON.stringify(res.data).slice(0, 2000) };
		return { id };
	}

	return { findDatabase, createDatabase, queryDatabase, createPage, updatePageProperties };
}
