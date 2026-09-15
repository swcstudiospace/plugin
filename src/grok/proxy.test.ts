import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type EnsureFreshOptions, type GrokAuth, readGrokAuth } from "./auth.ts";
import { createProxyHandler, isGrokModel, sanitizeGrokMessagesBody, type ProxyOptions } from "./proxy.ts";

const TOKEN = "tok.tok.tok";
const BASE_URL = "https://grok.example/v1";
const UPSTREAM = "https://anthropic.example";

interface Call {
	url: string;
	method: string;
	headers: Headers;
	body: string;
}

function writeAuth(home: string, expiresAt: string, token = TOKEN): void {
	writeFileSync(
		join(home, "auth.json"),
		JSON.stringify({ "https://auth.x.ai::cid": { key: token, expires_at: expiresAt, email: "me@example.com" } }),
	);
	writeFileSync(join(home, "version.json"), JSON.stringify({ version: "1.0.25" }));
}

function makeFake(reply: (call: Call) => Response) {
	const calls: Call[] = [];
	const fake = (async (input: string | URL | Request, init?: RequestInit) => {
		const url = String(input instanceof Request ? input.url : input);
		const body = init?.body === undefined || init.body === null ? "" : await new Response(init.body).text();
		const call: Call = { url, method: init?.method ?? "GET", headers: new Headers(init?.headers), body };
		calls.push(call);
		return reply(call);
	}) as typeof fetch;
	return { calls, fake };
}

function messagesRequest(body: unknown, path = "/v1/messages", extraHeaders: Record<string, string> = {}): Request {
	return new Request(`http://127.0.0.1:41417${path}`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			authorization: "Bearer client-oauth",
			"x-api-key": "sk-client",
			"anthropic-beta": "foo",
			"anthropic-version": "2023-06-01",
			...extraHeaders,
		},
		body: JSON.stringify(body),
	});
}

const GROK_JSON = {
	type: "message",
	content: [
		{ type: "thinking", thinking: "…", signature: "" },
		{ type: "text", text: "hello" },
	],
	stop_reason: "end_turn",
};

const GROK_SSE =
	'event: content_block_start\ndata: {"type":"content_block_start","index":0,"content_block":{"type":"thinking","thinking":""}}\n\n' +
	'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"thinking_delta","thinking":"x"}}\n\n' +
	'event: content_block_stop\ndata: {"type":"content_block_stop","index":0}\n\n' +
	'event: content_block_start\ndata: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}\n\n' +
	'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"hi"}}\n\n' +
	'event: content_block_stop\ndata: {"type":"content_block_stop","index":0}\n\n' +
	'event: message_stop\ndata: {"type":"message_stop"}\n\n';

describe("isGrokModel / sanitizeGrokMessagesBody", () => {
	test("matches prefixes case-insensitively and rejects everything else", () => {
		expect(isGrokModel("grok-4.6", ["grok-"])).toBe(true);
		expect(isGrokModel("  GROK-4.6 ", ["grok-"])).toBe(true);
		expect(isGrokModel("claude-haiku", ["grok-"])).toBe(false);
		expect(isGrokModel("grok-4.6", [])).toBe(false);
		expect(isGrokModel(undefined, ["grok-"])).toBe(false);
		expect(isGrokModel(42, ["grok-"])).toBe(false);
	});

	test("drops stop_sequences and top_k without mutating the input", () => {
		const body = { model: "grok-4.6", stop_sequences: ["x"], top_k: 3, max_tokens: 10 };
		expect(sanitizeGrokMessagesBody(body)).toEqual({ model: "grok-4.6", max_tokens: 10 });
		expect(body.stop_sequences).toEqual(["x"]);
	});

	/** Shaped like a captured Claude Code 2.1.272 request. */
	const CLAUDE_CODE_BODY = {
		model: "grok-4.6",
		max_tokens: 512,
		system: [{ type: "text", text: "You are Claude Code.", cache_control: { type: "ephemeral", ttl: "1h" } }],
		messages: [
			{ role: "user", content: [{ type: "text", text: "hello" }] },
			{ role: "system", content: [{ type: "text", text: "# Environment\ncwd: /root" }] },
		],
		thinking: { type: "adaptive", display: "omitted" },
		output_config: { effort: "high" },
		context_management: { edits: [{ type: "clear_thinking_20251015", keep: "all" }] },
		metadata: { user_id: "u1" },
	};

	test("folds system-role messages into system and drops unsupported Claude Code fields", () => {
		const out = sanitizeGrokMessagesBody(CLAUDE_CODE_BODY);
		expect(out).toEqual({
			model: "grok-4.6",
			max_tokens: 512,
			system: [
				{ type: "text", text: "You are Claude Code.", cache_control: { type: "ephemeral", ttl: "1h" } },
				{ type: "text", text: "# Environment\ncwd: /root" },
			],
			messages: [{ role: "user", content: [{ type: "text", text: "hello" }] }],
			metadata: { user_id: "u1" },
		});
		expect(CLAUDE_CODE_BODY.messages).toHaveLength(2);
		expect(CLAUDE_CODE_BODY.thinking.type).toBe("adaptive");
	});

	test("keeps enabled thinking, string system/content become text blocks, same-role runs merge", () => {
		const out = sanitizeGrokMessagesBody({
			model: "grok-4.6",
			system: "base",
			thinking: { type: "enabled", budget_tokens: 1024 },
			messages: [
				{ role: "user", content: "a" },
				{ role: "system", content: "env" },
				{ role: "user", content: [{ type: "text", text: "b" }] },
				{ role: "assistant", content: "c" },
				{ role: "assistant", content: [{ type: "tool_use", id: "t1", name: "x", input: {} }] },
				{ role: "user", content: [{ type: "tool_result", tool_use_id: "t1", content: "ok" }] },
			],
		});
		expect(out.thinking).toEqual({ type: "enabled", budget_tokens: 1024 });
		expect(out.system).toEqual([
			{ type: "text", text: "base" },
			{ type: "text", text: "env" },
		]);
		expect(out.messages).toEqual([
			{ role: "user", content: [{ type: "text", text: "a" }, { type: "text", text: "b" }] },
			{ role: "assistant", content: [{ type: "text", text: "c" }, { type: "tool_use", id: "t1", name: "x", input: {} }] },
			{ role: "user", content: [{ type: "tool_result", tool_use_id: "t1", content: "ok" }] },
		]);
	});

	test("leaves string system and messages untouched when nothing needs folding", () => {
		const out = sanitizeGrokMessagesBody({ system: "s", messages: [{ role: "user", content: "hi" }] });
		expect(out).toEqual({ system: "s", messages: [{ role: "user", content: "hi" }] });
	});

	test("normalizes tool input schemas for Grok without mutating the input", () => {
		const tools = [
			{
				name: "CronList",
				description: "List cron jobs",
				input_schema: {
					type: "object",
					properties: {
						x: { type: "string", default: null, enum: ["a", null] },
						nested: { type: "object", properties: { z: { type: "boolean" } } },
						strict: { type: "object", properties: { w: { type: "string" } }, required: ["w"] },
					},
					required: null,
					additionalProperties: false,
				},
			},
			{ name: "NoSchema" },
		];
		const out = sanitizeGrokMessagesBody({ model: "grok-4.6", tools, messages: [] });
		expect(out.tools).toEqual([
			{
				name: "CronList",
				description: "List cron jobs",
				input_schema: {
					type: "object",
					properties: {
						x: { type: "string", enum: ["a", null] },
						nested: { type: "object", properties: { z: { type: "boolean" } }, required: [] },
						strict: { type: "object", properties: { w: { type: "string" } }, required: ["w"] },
					},
					required: [],
					additionalProperties: false,
				},
			},
			{ name: "NoSchema" },
		]);
		expect(tools[0]!.input_schema).toHaveProperty("required", null);
		expect(tools[0]!.input_schema!.properties!.x).toHaveProperty("default", null);
		expect(tools[0]!.input_schema!.properties!.nested).not.toHaveProperty("required");
	});

	test("adds required: [] to an object schema that has no required key at all", () => {
		const out = sanitizeGrokMessagesBody({
			tools: [{ name: "EnterWorktree", input_schema: { type: "object", properties: {} } }],
		});
		expect(out.tools).toEqual([{ name: "EnterWorktree", input_schema: { type: "object", properties: {}, required: [] } }]);
	});
});

describe("createProxyHandler", () => {
	let home: string;
	let logs: string[];

	beforeEach(() => {
		home = mkdtempSync(join(tmpdir(), "aio-grok-proxy-"));
		logs = [];
	});
	afterEach(() => rmSync(home, { recursive: true, force: true }));

	function options(fake: typeof fetch, overrides: Partial<ProxyOptions["grok"]> = {}): ProxyOptions {
		return {
			host: "127.0.0.1",
			port: 41417,
			upstream: UPSTREAM,
			grok: { baseUrl: BASE_URL, home, routeModels: ["grok-"], stripThinking: true, refresh: noRefresh, ...overrides },
			fetch: fake,
			log: (line) => logs.push(line),
		};
	}

	/** Reads auth.json without ever spawning the real CLI. */
	const noRefresh = async (opts: EnsureFreshOptions): Promise<GrokAuth | undefined> => readGrokAuth(opts.home);

	test("routes grok models to the Grok Messages endpoint with Grok headers only", async () => {
		writeAuth(home, new Date(Date.now() + 3_600_000).toISOString());
		const { calls, fake } = makeFake(() => Response.json(GROK_JSON, { headers: { "request-id": "req_1" } }));
		const handler = createProxyHandler(options(fake));

		const res = await handler(
			messagesRequest({ model: "grok-4.6", max_tokens: 10, stop_sequences: ["END"], messages: [] }),
		);
		expect(res.status).toBe(200);
		expect(res.headers.get("request-id")).toBe("req_1");
		expect(await res.json()).toEqual({ type: "message", content: [{ type: "text", text: "hello" }], stop_reason: "end_turn" });

		expect(calls).toHaveLength(1);
		const call = calls[0]!;
		expect(call.url).toBe(`${BASE_URL}/messages`);
		expect(call.method).toBe("POST");
		expect(call.headers.get("authorization")).toBe(`Bearer ${TOKEN}`);
		expect(call.headers.get("x-xai-token-auth")).toBe("xai-grok-cli");
		expect(call.headers.get("x-grok-model-override")).toBe("grok-4.6");
		expect(call.headers.get("x-grok-client-version")).toBe("1.0.25");
		expect(call.headers.get("anthropic-version")).toBe("2023-06-01");
		expect(call.headers.get("content-type")).toBe("application/json");
		expect(call.headers.get("x-api-key")).toBeNull();
		expect(call.headers.get("anthropic-beta")).toBeNull();
		expect(JSON.parse(call.body)).toEqual({ model: "grok-4.6", max_tokens: 10, messages: [] });
		expect(logs).toEqual([expect.stringMatching(/^POST \/v1\/messages → grok 200 \d+ms$/)]);
		expect(logs.join("\n")).not.toContain(TOKEN);
	});

	test("retries once with a refreshed token after Grok rejects the stored one", async () => {
		writeAuth(home, new Date(Date.now() + 3_600_000).toISOString());
		const refreshCalls: EnsureFreshOptions[] = [];
		const refresh = async (opts: EnsureFreshOptions): Promise<GrokAuth | undefined> => {
			refreshCalls.push(opts);
			if (opts.force) writeAuth(home, new Date(Date.now() + 3_600_000).toISOString(), "fresh.tok.en");
			return noRefresh(opts);
		};
		const { calls, fake } = makeFake((call) =>
			call.headers.get("authorization") === "Bearer fresh.tok.en"
				? Response.json(GROK_JSON)
				: new Response('{"error":"expired"}', { status: 401, headers: { "content-type": "application/json" } }),
		);
		const handler = createProxyHandler(options(fake, { refresh }));
		const res = await handler(messagesRequest({ model: "grok-4.6", messages: [] }));
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ type: "message", content: [{ type: "text", text: "hello" }], stop_reason: "end_turn" });
		expect(calls.map((c) => c.headers.get("authorization"))).toEqual([`Bearer ${TOKEN}`, "Bearer fresh.tok.en"]);
		expect(refreshCalls).toEqual([{ home }, { home, force: true }]);
		expect(logs).toEqual([expect.stringMatching(/^POST \/v1\/messages → grok 200 \d+ms$/)]);
	});

	test("surfaces the upstream 401 without retrying when the refresh leaves the token unchanged", async () => {
		writeAuth(home, new Date(Date.now() + 3_600_000).toISOString());
		const { calls, fake } = makeFake(() => new Response('{"error":"expired"}', { status: 401, headers: { "content-type": "application/json" } }));
		const res = await createProxyHandler(options(fake))(messagesRequest({ model: "grok-4.6", messages: [] }));
		expect(res.status).toBe(401);
		expect(calls).toHaveLength(1);
	});

	test("keeps thinking blocks when the client enabled thinking", async () => {
		writeAuth(home, new Date(Date.now() + 3_600_000).toISOString());
		const { fake } = makeFake(() => Response.json(GROK_JSON));
		const handler = createProxyHandler(options(fake));
		const res = await handler(
			messagesRequest({ model: "grok-4.6", thinking: { type: "enabled", budget_tokens: 1024 }, messages: [] }),
		);
		expect(((await res.json()) as typeof GROK_JSON).content).toHaveLength(2);
	});

	test("normalizes SSE responses from Grok", async () => {
		writeAuth(home, new Date(Date.now() + 3_600_000).toISOString());
		const { fake } = makeFake(
			() => new Response(GROK_SSE, { headers: { "content-type": "text/event-stream; charset=utf-8" } }),
		);
		const handler = createProxyHandler(options(fake));
		const res = await handler(messagesRequest({ model: "grok-4.6", stream: true, messages: [] }, "/v1/messages?beta=true"));
		expect(res.headers.get("content-type")).toContain("text/event-stream");
		const text = await res.text();
		expect(text).not.toContain("thinking");
		expect(text).toContain('"type":"content_block_delta","delta":{"type":"text_delta","text":"hi"},"index":0');
		expect(text).toContain('event: message_stop\ndata: {"type":"message_stop"}\n\n');
	});

	test("passes non-grok /v1/messages through to upstream with the client auth intact", async () => {
		writeAuth(home, new Date(Date.now() + 3_600_000).toISOString());
		const { calls, fake } = makeFake(
			() => new Response('{"ok":1}', { status: 201, headers: { "content-type": "application/json", "content-length": "8" } }),
		);
		const handler = createProxyHandler(options(fake));
		const body = { model: "claude-fable-5-1", messages: [{ role: "user", content: "hi" }], stop_sequences: ["x"] };
		const res = await handler(messagesRequest(body, "/v1/messages?beta=true"));

		expect(res.status).toBe(201);
		expect(await res.text()).toBe('{"ok":1}');
		expect(res.headers.get("content-length")).toBeNull();
		const call = calls[0]!;
		expect(call.url).toBe(`${UPSTREAM}/v1/messages?beta=true`);
		expect(call.headers.get("authorization")).toBe("Bearer client-oauth");
		expect(call.headers.get("x-api-key")).toBe("sk-client");
		expect(call.headers.get("host")).toBeNull();
		expect(call.body).toBe(JSON.stringify(body));
		expect(logs).toEqual([expect.stringMatching(/^POST \/v1\/messages → upstream 201 \d+ms$/)]);
	});

	test("passes GET requests through unchanged", async () => {
		const { calls, fake } = makeFake(() => Response.json({ data: [] }));
		const handler = createProxyHandler(options(fake));
		const res = await handler(
			new Request("http://127.0.0.1:41417/v1/models?limit=5", { headers: { authorization: "Bearer client-oauth" } }),
		);
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ data: [] });
		expect(calls[0]?.url).toBe(`${UPSTREAM}/v1/models?limit=5`);
		expect(calls[0]?.method).toBe("GET");
		expect(calls[0]?.headers.get("authorization")).toBe("Bearer client-oauth");
	});

	test("healthz reports auth status without the token", async () => {
		writeAuth(home, "2030-01-01T00:00:00.000Z");
		const { calls, fake } = makeFake(() => new Response("unused"));
		const res = await createProxyHandler(options(fake))(new Request("http://127.0.0.1:41417/healthz"));
		const text = await res.text();
		expect(res.status).toBe(200);
		expect(text).not.toContain(TOKEN);
		expect(JSON.parse(text)).toEqual({
			ok: true,
			upstream: UPSTREAM,
			grok: { loggedIn: true, expired: false, email: "me@example.com", expiresAt: "2030-01-01T00:00:00.000Z", home },
		});
		expect(calls).toHaveLength(0);
	});

	test("returns 401 authentication_error when auth is missing or expired", async () => {
		const { calls, fake } = makeFake(() => new Response("unused"));
		const handler = createProxyHandler(options(fake));
		const missing = await handler(messagesRequest({ model: "grok-4.6", messages: [] }));
		expect(missing.status).toBe(401);
		expect(await missing.json()).toEqual({
			type: "error",
			error: { type: "authentication_error", message: "Grok login required: run `grok login`" },
		});

		writeAuth(home, new Date(Date.now() - 1_000).toISOString());
		const expired = await handler(messagesRequest({ model: "grok-4.6", messages: [] }));
		expect(expired.status).toBe(401);
		expect(calls).toHaveLength(0);
	});

	test("estimates count_tokens locally for grok models", async () => {
		const { calls, fake } = makeFake(() => new Response("unused"));
		const body = { model: "grok-4.6", messages: [{ role: "user", content: "hello world" }] };
		const res = await createProxyHandler(options(fake))(messagesRequest(body, "/v1/messages/count_tokens"));
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ input_tokens: Math.ceil(JSON.stringify(body).length / 4) });
		expect(calls).toHaveLength(0);
	});

	test("maps network failures to a 502 api_error with secrets redacted", async () => {
		writeAuth(home, new Date(Date.now() + 3_600_000).toISOString());
		const { fake } = makeFake(() => {
			throw new Error(`connect failed for Bearer ${TOKEN}`);
		});
		const handler = createProxyHandler(options(fake));
		const res = await handler(messagesRequest({ model: "grok-4.6", messages: [] }));
		expect(res.status).toBe(502);
		const json = (await res.json()) as { error: { type: string; message: string } };
		expect(json.error.type).toBe("api_error");
		expect(json.error.message).not.toContain(TOKEN);

		const upstream = await handler(new Request("http://127.0.0.1:41417/v1/models"));
		expect(upstream.status).toBe(502);
	});
});
