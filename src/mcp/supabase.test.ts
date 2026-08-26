import { afterEach, describe, expect, test } from "bun:test";
import { createSupabase, sanitize } from "./supabase.ts";
import type { HttpFn } from "./supabase.ts";

const ENV_KEYS = [
	"SUPABASE_ACCESS_TOKEN",
	"SUPABASE_URL",
	"SUPABASE_SERVICE_KEY",
	"SUPABASE_SERVICE_ROLE_KEY",
] as const;

const savedEnv: Record<string, string | undefined> = {};
for (const key of ENV_KEYS) savedEnv[key] = process.env[key];

function clearEnv() {
	for (const key of ENV_KEYS) delete process.env[key];
}

afterEach(() => {
	for (const key of ENV_KEYS) {
		const prev = savedEnv[key];
		if (prev === undefined) delete process.env[key];
		else process.env[key] = prev;
	}
});

function mockHttp(
	script: (req: {
		method: string;
		url: string;
		headers: Record<string, string>;
		body?: string;
	}) => { status: number; text: string } | Promise<{ status: number; text: string }>,
): HttpFn & {
	calls: Array<{ method: string; url: string; headers: Record<string, string>; body?: string }>;
} {
	const calls: Array<{ method: string; url: string; headers: Record<string, string>; body?: string }> = [];
	const http: HttpFn = async (req) => {
		calls.push(req);
		return script(req);
	};
	return Object.assign(http, { calls });
}

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.signaturepad";

describe("createSupabase", () => {
	test("missing_credentials for management and data", async () => {
		clearEnv();
		const sb = createSupabase({ http: mockHttp(() => ({ status: 200, text: "[]" })) });
		expect(await sb.projectsList()).toEqual({
			error: "missing_credentials",
			service: "supabase",
			envVar: "SUPABASE_ACCESS_TOKEN",
		});
		expect(await sb.projectGet("abc")).toEqual({
			error: "missing_credentials",
			service: "supabase",
			envVar: "SUPABASE_ACCESS_TOKEN",
		});
		expect(await sb.tablesList()).toEqual({
			error: "missing_credentials",
			service: "supabase-data",
			envVars: ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"],
		});
		expect(await sb.rowsRead({ table: "users" })).toEqual({
			error: "missing_credentials",
			service: "supabase-data",
			envVars: ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"],
		});
		expect(await sb.rpcCall({ function: "fn" })).toEqual({
			error: "missing_credentials",
			service: "supabase-data",
			envVars: ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"],
		});
		expect(await sb.authUsersList()).toEqual({
			error: "missing_credentials",
			service: "supabase-data",
			envVars: ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"],
		});
	});

	test("projectsList GET management API with Bearer and mapped fields", async () => {
		const http = mockHttp(() => ({
			status: 200,
			text: JSON.stringify([
				{
					id: "proj_1",
					name: "app",
					region: "us-east-1",
					organization_id: "org_1",
					status: "ACTIVE_HEALTHY",
					created_at: "2024-01-01T00:00:00Z",
					extra: "drop",
				},
			]),
		}));
		const sb = createSupabase({ http, accessToken: "mgmt-token" });
		const result = await sb.projectsList();
		expect(http.calls).toEqual([
			{
				method: "GET",
				url: "https://api.supabase.com/v1/projects",
				headers: { Authorization: "Bearer mgmt-token" },
			},
		]);
		expect(result).toEqual({
			service: "supabase",
			count: 1,
			projects: [
				{
					id: "proj_1",
					name: "app",
					region: "us-east-1",
					organization_id: "org_1",
					status: "ACTIVE_HEALTHY",
					created_at: "2024-01-01T00:00:00Z",
				},
			],
		});
	});

	test("tablesList keeps OpenAPI /users and drops /rpc and /", async () => {
		const http = mockHttp(() => ({
			status: 200,
			text: JSON.stringify({
				paths: {
					"/users": { get: {} },
					"/rpc/foo": { post: {} },
					"/": { get: {} },
				},
			}),
		}));
		const sb = createSupabase({
			http,
			url: "https://abc.supabase.co/",
			serviceKey: "service-role",
		});
		const result = await sb.tablesList();
		expect(http.calls).toHaveLength(1);
		expect(http.calls[0]?.method).toBe("GET");
		expect(http.calls[0]?.url).toBe("https://abc.supabase.co/rest/v1/");
		expect(http.calls[0]?.headers.Accept).toBe("application/openapi+json");
		expect(http.calls[0]?.headers.apikey).toBe("service-role");
		expect(http.calls[0]?.headers.Authorization).toBe("Bearer service-role");
		expect(result).toEqual({
			service: "supabase-data",
			schema: "public",
			count: 1,
			tables: ["users"],
		});
	});

	test("rowsRead maps filters to PostgREST eq and rejects invalid table", async () => {
		const http = mockHttp(() => ({
			status: 200,
			text: JSON.stringify([{ id: 1, email: "a@b.com" }]),
		}));
		const sb = createSupabase({
			http,
			url: "https://abc.supabase.co",
			serviceKey: "service-role",
		});
		const result = await sb.rowsRead({ table: "users", filters: { email: "a@b.com" } });
		expect(http.calls).toHaveLength(1);
		const reqUrl = new URL(http.calls[0]!.url);
		expect(reqUrl.origin + reqUrl.pathname).toBe("https://abc.supabase.co/rest/v1/users");
		expect(reqUrl.searchParams.get("email")).toBe("eq.a@b.com");
		expect(result).toEqual({
			service: "supabase-data",
			table: "users",
			count: 1,
			rows: [{ id: 1, email: "a@b.com" }],
		});
		expect(await sb.rowsRead({ table: "users;drop" })).toEqual({
			error: "invalid_args",
			message: "table name is required (letters/digits/_/. only)",
		});
		expect(http.calls).toHaveLength(1);
	});

	test("rpcCall POSTs rpc/fn with JSON {}", async () => {
		const http = mockHttp(() => ({ status: 200, text: JSON.stringify({ ok: true }) }));
		const sb = createSupabase({
			http,
			url: "https://abc.supabase.co",
			serviceKey: "service-role",
		});
		const result = await sb.rpcCall({ function: "fn" });
		expect(http.calls).toEqual([
			{
				method: "POST",
				url: "https://abc.supabase.co/rest/v1/rpc/fn",
				headers: {
					apikey: "service-role",
					Authorization: "Bearer service-role",
					"Content-Type": "application/json",
				},
				body: "{}",
			},
		]);
		expect(result).toEqual({ service: "supabase-data", rpc: "fn", result: { ok: true } });
	});

	test("authUserCreate POSTs email_confirm and authUserDelete DELETEs", async () => {
		const http = mockHttp((req) => {
			if (req.method === "DELETE") return { status: 200, text: "" };
			return { status: 200, text: JSON.stringify({ id: "u1", email: "a@b.com" }) };
		});
		const sb = createSupabase({
			http,
			url: "https://abc.supabase.co",
			serviceKey: "service-role",
		});
		const created = await sb.authUserCreate({ email: "a@b.com" });
		expect(http.calls[0]?.method).toBe("POST");
		expect(http.calls[0]?.url).toBe("https://abc.supabase.co/auth/v1/admin/users");
		expect(JSON.parse(http.calls[0]!.body ?? "")).toEqual({
			email: "a@b.com",
			email_confirm: true,
		});
		expect(created).toEqual({
			service: "supabase-auth",
			user: { id: "u1", email: "a@b.com" },
		});

		const deleted = await sb.authUserDelete({ id: "u1" });
		expect(http.calls[1]?.method).toBe("DELETE");
		expect(http.calls[1]?.url).toBe("https://abc.supabase.co/auth/v1/admin/users/u1");
		expect(http.calls[1]?.headers.apikey).toBe("service-role");
		expect(http.calls[1]?.headers.Authorization).toBe("Bearer service-role");
		expect(deleted).toEqual({ service: "supabase-auth", deleted: "u1", user: null });
	});

	test("401 is upstream_error and thrown http is upstream_unreachable", async () => {
		const unauthorized = createSupabase({
			http: mockHttp(() => ({ status: 401, text: "nope" })),
			accessToken: "mgmt-token",
		});
		expect(await unauthorized.projectsList()).toEqual({
			error: "upstream_error",
			status: 401,
			detail: "nope",
		});

		const unreachable = createSupabase({
			http: async () => {
				throw new Error("offline");
			},
			accessToken: "mgmt-token",
		});
		expect(await unreachable.projectsList()).toEqual({
			error: "upstream_unreachable",
			message: "offline",
		});
	});

	test("status configured booleans and JWT in row is masked", async () => {
		clearEnv();
		const empty = createSupabase({});
		expect(empty.status()).toEqual({ configured: { management: false, data: false } });

		process.env.SUPABASE_ACCESS_TOKEN = "later-token";
		expect(empty.status()).toEqual({ configured: { management: true, data: false } });

		process.env.SUPABASE_URL = "https://abc.supabase.co/";
		process.env.SUPABASE_SERVICE_ROLE_KEY = "role-key";
		expect(empty.status()).toEqual({ configured: { management: true, data: true } });

		const http = mockHttp(() => ({
			status: 200,
			text: JSON.stringify([{ token: JWT }]),
		}));
		const sb = createSupabase({
			http,
			url: "https://abc.supabase.co",
			serviceKey: "service-role",
		});
		const result = await sb.rowsRead({ table: "users" });
		expect(result).toEqual({
			service: "supabase-data",
			table: "users",
			count: 1,
			rows: [{ token: `${JWT.slice(0, 12)}…${JWT.slice(-4)}` }],
		});
		expect(sanitize({ nested: [JWT], keep: "short" })).toEqual({
			nested: [`${JWT.slice(0, 12)}…${JWT.slice(-4)}`],
			keep: "short",
		});
	});

	test("default http is fetch-shaped without calling the network", async () => {
		clearEnv();
		const calls: Array<{ input: unknown; init: RequestInit | undefined }> = [];
		const original = globalThis.fetch;
		globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
			calls.push({ input, init });
			return new Response("[]", { status: 200, headers: { "Content-Type": "application/json" } });
		}) as typeof fetch;
		try {
			const sb = createSupabase({ accessToken: "mgmt-token" });
			const result = await sb.projectsList();
			expect(calls).toHaveLength(1);
			expect(String(calls[0]?.input)).toBe("https://api.supabase.com/v1/projects");
			expect(calls[0]?.init?.method).toBe("GET");
			expect((calls[0]?.init?.headers as Record<string, string>).Authorization).toBe("Bearer mgmt-token");
			expect(result).toEqual({ service: "supabase", count: 0, projects: [] });
		} finally {
			globalThis.fetch = original;
		}
	});
});
