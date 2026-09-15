/**
 * Local Anthropic-compatible proxy: Claude Code talks to it via ANTHROPIC_BASE_URL.
 *
 * - `/v1/messages` with a Grok model (`routeModels` prefix) → Grok CLI chat proxy
 *   using the SuperGrok OAuth session from `~/.grok/auth.json`; responses are
 *   normalized (block indices fixed, thinking optionally stripped).
 * - everything else → transparent pass-through to the real Anthropic API, so the
 *   main Claude model keeps its own OAuth untouched.
 *
 * Runs as `bun src/grok/proxy.ts` (config from src/config.ts).
 */

import type { Server } from "bun";
import { claudeConfigPaths, loadConfig } from "../config.ts";
import {
	type EnsureFreshOptions,
	ensureFreshGrokAuth,
	type GrokAuth,
	grokAuthStatus,
	grokClientVersion,
	grokHeaders,
	isGrokAuthExpired,
	redactSecrets,
} from "./auth.ts";
import { createAnthropicSseNormalizer, normalizeMessageJson } from "./sse.ts";

export interface ProxyOptions {
	host: string;
	port: number;
	upstream: string;
	grok: {
		baseUrl: string;
		home?: string;
		routeModels: string[];
		stripThinking: boolean;
		/** Test seam for the CLI-driven token refresh; default `ensureFreshGrokAuth`. */
		refresh?: (opts: EnsureFreshOptions) => Promise<GrokAuth | undefined>;
	};
	fetch?: typeof fetch;
	log?: (line: string) => void;
}

const JSON_HEADERS = { "content-type": "application/json" };

/** True when `model` is a string starting with any of `routeModels` (case-insensitive). */
export function isGrokModel(model: unknown, routeModels: string[]): boolean {
	if (typeof model !== "string") return false;
	const name = model.trim().toLowerCase();
	if (!name) return false;
	return routeModels.some((prefix) => {
		const p = prefix.trim().toLowerCase();
		return p !== "" && name.startsWith(p);
	});
}

/** A Messages API content block; only `type`/`text` are inspected, the rest is relayed. */
type ContentBlock = Record<string, unknown>;

function toBlocks(content: unknown): ContentBlock[] {
	if (typeof content === "string") return [{ type: "text", text: content }];
	if (!Array.isArray(content)) return [];
	return content.filter((block): block is ContentBlock => typeof block === "object" && block !== null);
}

/**
 * Deep clone of a JSON schema made acceptable to Grok's validator: object entries whose value
 * is `null` are removed (array elements are kept), and every `type: "object"` schema without an
 * array `required` gets `required: []` — Grok reads a missing `required` as `null`.
 */
function normalizeSchema(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(normalizeSchema);
	if (typeof value !== "object" || value === null) return value;
	const out: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry !== null) out[key] = normalizeSchema(entry);
	}
	if (out.type === "object" && !Array.isArray(out.required)) out.required = [];
	return out;
}

/**
 * Rewrites a Claude Code request so the Grok Messages endpoint accepts it. Returns a new object.
 *
 * - drops `stop_sequences`, `top_k`, `output_config`, `context_management` (rejected upstream)
 * - drops `thinking` unless it is `{ type: "enabled" }` (Grok rejects `adaptive`)
 * - folds `messages[]` entries with `role: "system"` into the top-level `system` block list
 * - merges consecutive same-role messages so roles alternate
 * - normalizes every `tools[].input_schema` for Grok's schema validator (see `normalizeSchema`)
 */
export function sanitizeGrokMessagesBody(body: Record<string, unknown>): Record<string, unknown> {
	const {
		stop_sequences: _stop,
		top_k: _topK,
		output_config: _outputConfig,
		context_management: _contextManagement,
		thinking,
		...rest
	} = body;
	if (thinkingRequested(body)) rest.thinking = thinking;
	if (Array.isArray(body.tools)) {
		rest.tools = body.tools.map((tool: unknown) =>
			typeof tool === "object" && tool !== null && "input_schema" in tool
				? { ...tool, input_schema: normalizeSchema(tool.input_schema) }
				: tool,
		);
	}
	if (!Array.isArray(body.messages)) return rest;

	const systemBlocks = toBlocks(rest.system);
	let foldedSystem = false;
	const messages: Record<string, unknown>[] = [];
	for (const raw of body.messages) {
		if (typeof raw !== "object" || raw === null) continue;
		const message = raw as Record<string, unknown>;
		if (message.role === "system") {
			systemBlocks.push(...toBlocks(message.content));
			foldedSystem = true;
			continue;
		}
		const previous = messages[messages.length - 1];
		if (previous && previous.role === message.role) {
			previous.content = [...toBlocks(previous.content), ...toBlocks(message.content)];
			continue;
		}
		messages.push({ ...message });
	}
	rest.messages = messages;
	if (foldedSystem) rest.system = systemBlocks;
	return rest;
}

function errorResponse(status: number, type: string, message: string): Response {
	return Response.json({ type: "error", error: { type, message } }, { status });
}

/** Response headers that describe the transport encoding of the upstream body and must not be re-sent. */
const HOP_BY_HOP_RESPONSE = ["content-encoding", "content-length", "transfer-encoding"];

function copyRequestIds(from: Headers, to: Headers): void {
	for (const name of ["request-id", "x-request-id"]) {
		const value = from.get(name);
		if (value) to.set(name, value);
	}
}

function thinkingRequested(body: Record<string, unknown>): boolean {
	const thinking = body.thinking;
	return (
		typeof thinking === "object" &&
		thinking !== null &&
		"type" in thinking &&
		thinking.type === "enabled"
	);
}

export function createProxyHandler(opts: ProxyOptions): (req: Request) => Promise<Response> {
	const doFetch = opts.fetch ?? fetch;
	const home = opts.grok.home;
	const refresh = opts.grok.refresh ?? ensureFreshGrokAuth;

	const logLine = (req: Request, url: URL, route: "grok" | "upstream", status: number, started: number) => {
		opts.log?.(`${req.method} ${url.pathname} → ${route} ${status} ${Date.now() - started}ms`);
	};

	async function forwardToGrok(
		req: Request,
		url: URL,
		body: Record<string, unknown>,
		model: string,
		started: number,
	): Promise<Response> {
		if (url.pathname === "/v1/messages/count_tokens") {
			const estimate = Math.ceil(JSON.stringify(body).length / 4);
			logLine(req, url, "grok", 200, started);
			return Response.json({ input_tokens: estimate }, { status: 200 });
		}

		const auth = await refresh({ home });
		if (!auth || isGrokAuthExpired(auth)) {
			logLine(req, url, "grok", 401, started);
			return errorResponse(401, "authentication_error", "Grok login required: run `grok login`");
		}
		const version = grokClientVersion(home);
		const payload = JSON.stringify(sanitizeGrokMessagesBody(body));
		const stripThinking = opts.grok.stripThinking && !thinkingRequested(body);

		// Headers are built from scratch: the client's x-api-key / authorization / anthropic-beta never reach Grok.
		const send = (session: GrokAuth): Promise<Response> => {
			const headers = new Headers(grokHeaders(session, model, version));
			headers.set("content-type", "application/json");
			headers.set("anthropic-version", req.headers.get("anthropic-version") ?? "2023-06-01");
			headers.set("accept", req.headers.get("accept") ?? "application/json");
			return doFetch(`${opts.grok.baseUrl}/messages`, { method: "POST", headers, body: payload });
		};

		let res: Response;
		try {
			res = await send(auth);
			if (res.status === 401 || res.status === 403) {
				// The stored token may have been revoked before its expiry; let the CLI refresh it once.
				const refreshed = await refresh({ home, force: true });
				if (refreshed && refreshed.token !== auth.token && !isGrokAuthExpired(refreshed)) {
					await res.body?.cancel();
					res = await send(refreshed);
				}
			}
		} catch (error) {
			logLine(req, url, "grok", 502, started);
			return errorResponse(502, "api_error", redactSecrets(error instanceof Error ? error.message : String(error)));
		}

		const contentType = res.headers.get("content-type") ?? "";
		const outHeaders = new Headers();
		copyRequestIds(res.headers, outHeaders);
		logLine(req, url, "grok", res.status, started);

		if (contentType.includes("text/event-stream") && res.body) {
			outHeaders.set("content-type", contentType);
			outHeaders.set("cache-control", "no-cache");
			return new Response(res.body.pipeThrough(createAnthropicSseNormalizer({ stripThinking })), {
				status: res.status,
				headers: outHeaders,
			});
		}
		if (contentType.includes("application/json")) {
			let json: unknown;
			try {
				json = await res.json();
			} catch (error) {
				return errorResponse(502, "api_error", redactSecrets(error instanceof Error ? error.message : String(error)));
			}
			outHeaders.set("content-type", "application/json");
			return new Response(JSON.stringify(normalizeMessageJson(json, { stripThinking })), {
				status: res.status,
				headers: outHeaders,
			});
		}
		if (contentType) outHeaders.set("content-type", contentType);
		return new Response(res.body, { status: res.status, headers: outHeaders });
	}

	async function passThrough(req: Request, url: URL, started: number, bodyText?: string): Promise<Response> {
		const target = new URL(url.pathname + url.search, opts.upstream);
		const headers = new Headers(req.headers);
		headers.delete("host");
		const hasBody = req.method !== "GET" && req.method !== "HEAD";
		const body = hasBody ? (bodyText ?? req.body) : undefined;
		if (hasBody && bodyText === undefined) headers.delete("content-length");
		// `duplex` is required by the Fetch spec for streaming request bodies but is not in Bun's RequestInit type.
		const init = {
			method: req.method,
			headers,
			body,
			duplex: "half",
			redirect: "manual",
		} as RequestInit;

		let res: Response;
		try {
			res = await doFetch(target, init);
		} catch (error) {
			logLine(req, url, "upstream", 502, started);
			return errorResponse(502, "api_error", redactSecrets(error instanceof Error ? error.message : String(error)));
		}
		const outHeaders = new Headers(res.headers);
		for (const name of HOP_BY_HOP_RESPONSE) outHeaders.delete(name);
		logLine(req, url, "upstream", res.status, started);
		return new Response(res.body, { status: res.status, statusText: res.statusText, headers: outHeaders });
	}

	return async (req: Request): Promise<Response> => {
		const started = Date.now();
		const url = new URL(req.url);

		if (req.method === "GET" && url.pathname === "/healthz") {
			opts.log?.(`GET /healthz → local 200 ${Date.now() - started}ms`);
			return Response.json({ ok: true, upstream: opts.upstream, grok: grokAuthStatus(home) }, { headers: JSON_HEADERS });
		}

		const isMessages = url.pathname === "/v1/messages" || url.pathname === "/v1/messages/count_tokens";
		if (req.method !== "POST" || !isMessages) return passThrough(req, url, started);

		const text = await req.text();
		let body: unknown;
		try {
			body = JSON.parse(text);
		} catch {
			return passThrough(req, url, started, text);
		}
		if (typeof body !== "object" || body === null || Array.isArray(body)) return passThrough(req, url, started, text);
		// Parsed client JSON; only `model` and `thinking` are inspected, everything else is relayed as-is.
		const record = body as Record<string, unknown>;
		if (!isGrokModel(record.model, opts.grok.routeModels)) return passThrough(req, url, started, text);
		return forwardToGrok(req, url, record, record.model as string, started);
	};
}

export interface ProxyServer {
	server: Server<undefined>;
	url: string;
	stop(): void;
}

export function startProxy(opts: ProxyOptions): ProxyServer {
	const server = Bun.serve({
		hostname: opts.host,
		port: opts.port,
		idleTimeout: 255,
		fetch: createProxyHandler(opts),
	});
	return {
		server,
		url: `http://${opts.host}:${opts.port}`,
		stop: () => {
			server.stop(true);
		},
	};
}

if (import.meta.main) {
	const config = loadConfig(claudeConfigPaths(process.cwd()));
	const grok = config.grok;
	const opts: ProxyOptions = {
		host: grok.proxy.host,
		port: grok.proxy.port,
		upstream: grok.proxy.upstream,
		grok: {
			baseUrl: grok.baseUrl,
			home: grok.home || undefined,
			routeModels: grok.proxy.routeModels,
			stripThinking: grok.proxy.stripThinking,
		},
		log: (line) => console.log(line),
	};
	const proxy = startProxy(opts);
	console.log(
		`aio-grok-proxy listening on ${proxy.url} → ${opts.upstream}; grok models [${opts.grok.routeModels.join(", ")}] → ${opts.grok.baseUrl}`,
	);
	const shutdown = () => {
		proxy.stop();
		process.exit(0);
	};
	process.on("SIGINT", shutdown);
	process.on("SIGTERM", shutdown);
}
