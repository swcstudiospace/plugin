export type HttpFn = (req: {
	method: string;
	url: string;
	headers: Record<string, string>;
	body?: string;
}) => Promise<{ status: number; text: string }>;

export interface CreateSupabaseOptions {
	http?: HttpFn;
	accessToken?: string;
	url?: string;
	serviceKey?: string;
}

export interface SupabaseProject {
	id?: string;
	name?: string;
	region?: string;
	organization_id?: string;
	status?: string;
	created_at?: string;
}

export type SupabaseFail =
	| { error: "missing_credentials"; service: "supabase"; envVar: "SUPABASE_ACCESS_TOKEN" }
	| { error: "missing_credentials"; service: "supabase-data"; envVars: ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"] }
	| { error: "upstream_error"; status: number; detail: string }
	| { error: "upstream_unreachable"; message: string }
	| { error: "invalid_json"; status: number; body: string }
	| { error: "invalid_args"; message: string };

export interface SupabaseClient {
	status(): { configured: { management: boolean; data: boolean } };
	projectsList(): Promise<{ service: "supabase"; count: number; projects: SupabaseProject[] } | SupabaseFail>;
	projectGet(projectId: string): Promise<({ service: "supabase" } & SupabaseProject) | SupabaseFail>;
	tablesList(input?: { limit?: number }): Promise<{ service: "supabase-data"; schema: "public"; count: number; tables: string[] } | SupabaseFail>;
	rowsRead(input: {
		table: string;
		limit?: number;
		order?: string;
		filters?: Record<string, string>;
	}): Promise<{ service: "supabase-data"; table: string; count: number; rows: unknown } | SupabaseFail>;
	rpcCall(input: {
		function: string;
		args?: Record<string, unknown>;
	}): Promise<{ service: "supabase-data"; rpc: string; result: unknown } | SupabaseFail>;
	authUsersList(input?: {
		page?: number;
		perPage?: number;
	}): Promise<{ service: "supabase-auth"; count: number; users: unknown } | SupabaseFail>;
	authUserGet(input: { id: string }): Promise<{ service: "supabase-auth"; user: unknown } | SupabaseFail>;
	authUserCreate(input: {
		email: string;
		password?: string;
		emailConfirm?: boolean;
	}): Promise<{ service: "supabase-auth"; user: unknown } | SupabaseFail>;
	authUserDelete(input: { id: string }): Promise<{ service: "supabase-auth"; deleted: string; user: unknown } | SupabaseFail>;
}

const MGMT_BASE = "https://api.supabase.com/v1";
const TABLE_NAME = /^[A-Za-z0-9_.]+$/;
const FUNCTION_NAME = /^[A-Za-z0-9_]+$/;
const TABLE_LIMIT_MAX = 200;
const ROW_LIMIT_MAX = 1000;

export function sanitize(value: unknown): unknown {
	if (typeof value === "string") {
		if (value.length >= 24 && value.split(".").length === 3) {
			return `${value.slice(0, 12)}…${value.slice(-4)}`;
		}
		return value;
	}
	if (Array.isArray(value)) return value.map(sanitize);
	if (value && typeof value === "object") {
		const out: Record<string, unknown> = {};
		for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
			out[key] = sanitize(nested);
		}
		return out;
	}
	return value;
}

async function defaultHttp(req: {
	method: string;
	url: string;
	headers: Record<string, string>;
	body?: string;
}): Promise<{ status: number; text: string }> {
	const res = await fetch(req.url, {
		method: req.method,
		headers: req.headers,
		body: req.body,
	});
	return { status: res.status, text: await res.text() };
}


function clamp(value: number | undefined, fallback: number, max: number): number {
	if (value === undefined || !Number.isFinite(value)) return fallback;
	return Math.max(1, Math.min(Math.trunc(value), max));
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
	if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
	return value as Record<string, unknown>;
}

function str(value: unknown): string | undefined {
	return typeof value === "string" ? value : undefined;
}

function missingManagement() {
	return { error: "missing_credentials" as const, service: "supabase", envVar: "SUPABASE_ACCESS_TOKEN" };
}

function missingData() {
	return {
		error: "missing_credentials" as const,
		service: "supabase-data",
		envVars: ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"],
	};
}

function invalidArgs(message: string) {
	return { error: "invalid_args" as const, message };
}

type HttpFailure =
	| { error: "upstream_unreachable"; message: string }
	| { error: "upstream_error"; status: number; detail: string }
	| { error: "invalid_json"; status: number; body: string };

type HttpOk = { status: number; data: unknown; text: string };

async function callHttp(http: HttpFn, req: {
	method: string;
	url: string;
	headers: Record<string, string>;
	body?: string;
}): Promise<HttpOk | HttpFailure> {
	let res: { status: number; text: string };
	try {
		res = await http(req);
	} catch (error) {
		return { error: "upstream_unreachable", message: error instanceof Error ? error.message : String(error) };
	}
	if (res.status >= 400) {
		return { error: "upstream_error", status: res.status, detail: res.text.slice(0, 2000) };
	}
	if (!res.text.trim()) {
		return { status: res.status, data: null, text: res.text };
	}
	try {
		return { status: res.status, data: JSON.parse(res.text) as unknown, text: res.text };
	} catch {
		return { error: "invalid_json", status: res.status, body: res.text.slice(0, 2000) };
	}
}

function mapProject(raw: Record<string, unknown>) {
	return {
		id: str(raw.id),
		name: str(raw.name),
		region: str(raw.region),
		organization_id: str(raw.organization_id) ?? str(raw.owner_id),
		status: str(raw.status),
		created_at: str(raw.created_at),
	};
}


export function createSupabase(options: CreateSupabaseOptions = {}): SupabaseClient {
	const http = options.http ?? defaultHttp;

	function accessToken(): string {
		return options.accessToken ?? process.env.SUPABASE_ACCESS_TOKEN ?? "";
	}

	function projectUrl(): string {
		return (options.url ?? process.env.SUPABASE_URL ?? "").replace(/\/+$/, "");
	}

	function serviceKey(): string {
		return options.serviceKey ?? process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
	}

	function dataHeaders(): Record<string, string> {
		const key = serviceKey();
		return {
			apikey: key,
			Authorization: `Bearer ${key}`,
		};
	}

	function status() {
		return {
			configured: {
				management: Boolean(accessToken()),
				data: Boolean(projectUrl() && serviceKey()),
			},
		};
	}

	async function projectsList() {
		const token = accessToken();
		if (!token) return missingManagement();
		const res = await callHttp(http, {
			method: "GET",
			url: `${MGMT_BASE}/projects`,
			headers: { Authorization: `Bearer ${token}` },
		});
		if ("error" in res) return res;
		if (!Array.isArray(res.data)) {
			return { error: "invalid_json" as const, status: res.status, body: res.text.slice(0, 2000) };
		}
		const projects = res.data.map((item) => mapProject(asRecord(item) ?? {}));
		return { service: "supabase" as const, count: projects.length, projects };
	}

	async function projectGet(projectId: string) {
		if (!projectId) return invalidArgs("project id is required");
		const token = accessToken();
		if (!token) return missingManagement();
		const res = await callHttp(http, {
			method: "GET",
			url: `${MGMT_BASE}/projects/${projectId}`,
			headers: { Authorization: `Bearer ${token}` },
		});
		if ("error" in res) return res;
		const raw = asRecord(res.data);
		if (!raw) return { error: "invalid_json" as const, status: res.status, body: res.text.slice(0, 2000) };
		return { service: "supabase" as const, ...mapProject(raw) };
	}

	async function tablesList(input: { limit?: number } = {}) {
		const url = projectUrl();
		const key = serviceKey();
		if (!url || !key) return missingData();
		const res = await callHttp(http, {
			method: "GET",
			url: `${url}/rest/v1/`,
			headers: {
				...dataHeaders(),
				Accept: "application/openapi+json",
			},
		});
		if ("error" in res) return res;
		const spec = asRecord(res.data);
		const paths = asRecord(spec?.paths);
		const names: string[] = [];
		for (const path of Object.keys(paths ?? {})) {
			if (path === "/" || path.startsWith("/rpc")) continue;
			const name = path.replace(/^\/+/, "");
			if (!name || name.startsWith("rpc") || !TABLE_NAME.test(name)) continue;
			names.push(name);
		}
		const tables = names.slice(0, clamp(input.limit, 50, TABLE_LIMIT_MAX));
		return { service: "supabase-data" as const, schema: "public", count: tables.length, tables };
	}

	async function rowsRead(input: {
		table: string;
		limit?: number;
		order?: string;
		filters?: Record<string, string>;
	}) {
		const url = projectUrl();
		const key = serviceKey();
		if (!url || !key) return missingData();
		if (!input.table || !TABLE_NAME.test(input.table)) {
			return invalidArgs("table name is required (letters/digits/_/. only)");
		}
		const params = new URLSearchParams();
		params.set("limit", String(clamp(input.limit, 20, ROW_LIMIT_MAX)));
		if (input.order) params.set("order", input.order);
		for (const [col, value] of Object.entries(input.filters ?? {})) {
			const text = String(value);
			params.set(col, /^[A-Za-z]+[.=]/.test(text) ? text : `eq.${text}`);
		}
		const res = await callHttp(http, {
			method: "GET",
			url: `${url}/rest/v1/${input.table}?${params.toString()}`,
			headers: dataHeaders(),
		});
		if ("error" in res) return res;
		const rows = Array.isArray(res.data) ? res.data : [];
		return {
			service: "supabase-data" as const,
			table: input.table,
			count: rows.length,
			rows: sanitize(rows),
		};
	}

	async function rpcCall(input: { function: string; args?: Record<string, unknown> }) {
		const url = projectUrl();
		const key = serviceKey();
		if (!url || !key) return missingData();
		if (!input.function || !FUNCTION_NAME.test(input.function)) {
			return invalidArgs("function name is required (letters/digits/_ only)");
		}
		const res = await callHttp(http, {
			method: "POST",
			url: `${url}/rest/v1/rpc/${input.function}`,
			headers: {
				...dataHeaders(),
				"Content-Type": "application/json",
			},
			body: JSON.stringify(input.args ?? {}),
		});
		if ("error" in res) return res;
		return { service: "supabase-data" as const, rpc: input.function, result: sanitize(res.data) };
	}

	async function authUsersList(input: { page?: number; perPage?: number } = {}) {
		const url = projectUrl();
		const key = serviceKey();
		if (!url || !key) return missingData();
		const params = new URLSearchParams();
		if (input.page !== undefined) params.set("page", String(input.page));
		if (input.perPage !== undefined) params.set("per_page", String(input.perPage));
		const qs = params.toString();
		const res = await callHttp(http, {
			method: "GET",
			url: `${url}/auth/v1/admin/users${qs ? `?${qs}` : ""}`,
			headers: dataHeaders(),
		});
		if ("error" in res) return res;
		const raw = asRecord(res.data);
		const list = Array.isArray(res.data) ? res.data : Array.isArray(raw?.users) ? raw.users : [];
		const users = sanitize(list);
		return {
			service: "supabase-auth" as const,
			count: Array.isArray(users) ? users.length : 0,
			users,
		};
	}

	async function authUserGet(input: { id: string }) {
		const url = projectUrl();
		const key = serviceKey();
		if (!url || !key) return missingData();
		if (!input.id) return invalidArgs("user id is required");
		const res = await callHttp(http, {
			method: "GET",
			url: `${url}/auth/v1/admin/users/${input.id}`,
			headers: dataHeaders(),
		});
		if ("error" in res) return res;
		return { service: "supabase-auth" as const, user: sanitize(res.data) };
	}

	async function authUserCreate(input: { email: string; password?: string; emailConfirm?: boolean }) {
		const url = projectUrl();
		const key = serviceKey();
		if (!url || !key) return missingData();
		if (!input.email) return invalidArgs("email is required");
		const payload: Record<string, unknown> = {
			email: input.email,
			email_confirm: input.emailConfirm ?? true,
		};
		if (input.password !== undefined) payload.password = input.password;
		const res = await callHttp(http, {
			method: "POST",
			url: `${url}/auth/v1/admin/users`,
			headers: {
				...dataHeaders(),
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		if ("error" in res) return res;
		return { service: "supabase-auth" as const, user: sanitize(res.data) };
	}

	async function authUserDelete(input: { id: string }) {
		const url = projectUrl();
		const key = serviceKey();
		if (!url || !key) return missingData();
		if (!input.id) return invalidArgs("user id is required");
		const res = await callHttp(http, {
			method: "DELETE",
			url: `${url}/auth/v1/admin/users/${input.id}`,
			headers: dataHeaders(),
		});
		if ("error" in res) return res;
		return { service: "supabase-auth" as const, deleted: input.id, user: sanitize(res.data) };
	}

	return {
		status,
		projectsList,
		projectGet,
		tablesList,
		rowsRead,
		rpcCall,
		authUsersList,
		authUserGet,
		authUserCreate,
		authUserDelete,
	};
}

