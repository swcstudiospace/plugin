# Notion PR Tracking + `<ISSUES>` Tag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `<ISSUES>` XML tag to the uplifted spec (mirroring the existing `<CLARIFICATIONS>` pattern), and a new `src/notion/` module that mirrors the local Tissue issue tree into a Notion "PRs" database whenever this plugin's own MCP server creates or merges a GitHub PR.

**Architecture:** Two independent pieces sharing one plan for context. Part 1 (Tasks 1–2) adds `<ISSUES>` injection to the spec XML, following `hitl/format.ts:injectClarificationsXml` exactly. Part 2 (Tasks 3–10) adds a Notion sync module (`src/notion/`) with a low-level HTTP client (mirrors `src/mcp/supabase.ts`'s injectable-`HttpFn` pattern) and an orchestration layer (mirrors `src/issues/kanban.ts` + `track.ts`'s client/orchestration split), wired to two new fail-open `PostToolUse` hooks (mirrors `hooks/answers.ts`/`hooks/stop.ts`). Part 1 can ship and be committed independently of Part 2 — they don't depend on each other at runtime.

**Tech Stack:** TypeScript, Bun (`bun test`, `Bun.spawn`), no new dependencies (Notion talked to via raw `fetch`, same as Supabase).

**Spec:** `docs/superpowers/specs/2026-09-16-notion-pr-tracking-design.md`

## Global Constraints

- Every new code path is **fail-open**: catch all errors, never throw out of a hook, never block PR creation/merge or any Claude Code action.
- Notion auth is an **internal integration token read from an env var** (name configurable via `notion.apiKeyEnv`, default `NOTION_API_KEY`) — never the OAuth connector, never written to the JSON config file.
- The Notion "PRs" database is **created lazily** on first sync (find-or-create), never via a separate provisioning script.
- Issues/Sub-issues nest under a PR as **Notion sub-pages** (page nesting), not a second database.
- Idempotency uses the **same marker convention** already in this codebase: an HTML-comment marker line appended to the Tissue issue's markdown body (mirrors `<!-- aio-id: ... -->` in `src/issues/track.ts`).
- Notion API version header: `Notion-Version: 2022-06-28`. Base URL: `https://api.notion.com/v1`.
- Follow existing test conventions: `*.test.ts` beside each module, `bun:test` (`describe`/`test`/`expect`), injected fakes (`HttpFn`/`KtuiRunner`-style) instead of real network calls.

---

## Part 1 — `<ISSUES>` XML tag

### Task 1: `issuesToXml` / `injectIssuesXml` in `src/issues/format.ts`

**Files:**
- Modify: `src/issues/format.ts`
- Test: `src/issues/format.test.ts` (new file — none exists today)

**Interfaces:**
- Consumes: `GraphSyncResult`, `SyncResult` from `src/issues/types.ts` (already defined); `escapeXml` from `src/uplift/xml.ts` (already exported).
- Produces: `issuesToXml(input: { tree?: GraphSyncResult; last?: SyncResult }): string` and `injectIssuesXml(upliftXml: string, input: { tree?: GraphSyncResult; last?: SyncResult }): string`, both exported from `src/issues/format.ts`. Task 2 imports both.

- [ ] **Step 1: Write the failing tests**

Create `src/issues/format.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { injectIssuesXml, issuesToXml } from "./format.ts";
import type { GraphSyncResult, SyncResult } from "./types.ts";

function issue(id: string, title: string, taskId: number | null): SyncResult {
	return {
		issue: { id, title, description: "", path: `issues/${id}.md`, fileName: `${id}.md` },
		taskId,
		boardId: taskId != null ? 1 : null,
		categoryId: null,
		created: taskId != null,
		skipped: taskId == null,
	};
}

const tree: GraphSyncResult = {
	workUnitId: "unit-1",
	parent: issue("p1", "Build the thing", 100),
	children: [issue("c1", "[n1] Understand", 101), issue("c2", "[n2] Decompose", 102)],
};

describe("issuesToXml", () => {
	test("renders parent with nested SUBISSUE per child, node id extracted from the [n1] title tag", () => {
		const xml = issuesToXml({ tree });
		expect(xml.startsWith("<ISSUES>")).toBe(true);
		expect(xml).toContain('<ISSUE id="p1" title="Build the thing" taskId="100">');
		expect(xml).toContain('<SUBISSUE id="c1" nodeId="n1" title="Understand" taskId="101"/>');
		expect(xml).toContain('<SUBISSUE id="c2" nodeId="n2" title="Decompose" taskId="102"/>');
		expect(xml.endsWith("</ISSUES>")).toBe(true);
	});

	test("self-closes the ISSUE element when there are no children", () => {
		const solo: GraphSyncResult = { workUnitId: "u2", parent: issue("p2", "Solo", 200), children: [] };
		expect(issuesToXml({ tree: solo })).toBe('<ISSUES>\n\t<ISSUE id="p2" title="Solo" taskId="200"/>\n</ISSUES>');
	});

	test("omits taskId attribute when null, and escapes title text", () => {
		const noTask: GraphSyncResult = { workUnitId: "u3", parent: issue("p3", 'A & "B"', null), children: [] };
		expect(issuesToXml({ tree: noTask })).toBe('<ISSUES>\n\t<ISSUE id="p3" title="A &amp; &quot;B&quot;"/>\n</ISSUES>');
	});

	test("falls back to `last` (no graph) when there is no tree", () => {
		const last = issue("s1", "Untitled prompt", 300);
		expect(issuesToXml({ last })).toBe('<ISSUES>\n\t<ISSUE id="s1" title="Untitled prompt" taskId="300"/>\n</ISSUES>');
	});

	test("empty when neither tree nor a synced last issue is given", () => {
		expect(issuesToXml({})).toBe("");
		expect(issuesToXml({ last: issue("", "x", null) })).toBe("");
	});
});

describe("injectIssuesXml", () => {
	const base = "<BUILD_PROMPT>\n<ORIGINAL>x</ORIGINAL>\n</BUILD_PROMPT>";

	test("inserts before the root close and replaces an existing block", () => {
		const once = injectIssuesXml(base, { tree });
		expect(once.endsWith("</ISSUES>\n</BUILD_PROMPT>")).toBe(true);
		expect(once).toContain("<ORIGINAL>x</ORIGINAL>");

		const solo: GraphSyncResult = { workUnitId: "u2", parent: issue("p2", "Solo", 200), children: [] };
		const twice = injectIssuesXml(once, { tree: solo });
		expect(twice.match(/<ISSUES>/g)).toHaveLength(1);
		expect(twice).not.toContain('id="p1"');
		expect(twice).toContain('id="p2"');
	});

	test("empty input removes an existing block and leaves input without one unchanged", () => {
		expect(injectIssuesXml(base, {})).toBe(base);
		const removed = injectIssuesXml(injectIssuesXml(base, { tree }), {});
		expect(removed).not.toContain("<ISSUES");
		expect(removed).toContain("</BUILD_PROMPT>");
	});

	test("appends when there is no root close", () => {
		expect(injectIssuesXml("plain text", { tree })).toBe(`plain text\n${issuesToXml({ tree })}`);
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test src/issues/format.test.ts`
Expected: FAIL — `issuesToXml`/`injectIssuesXml` are not exported from `./format.ts`.

- [ ] **Step 3: Implement `issuesToXml` and `injectIssuesXml`**

Add to the top of `src/issues/format.ts`:

```ts
import { escapeXml } from "../uplift/xml.ts";
```

Add at the end of `src/issues/format.ts`:

```ts
const ISSUES_BLOCK_RE = /<ISSUES\b[\s\S]*?<\/ISSUES>/i;
const NODE_TAG_RE = /^\[([^\]]+)\]\s*(.*)$/;

function issueAttrs(id: string, title: string, taskId: number | null): string {
	const parts = [` id="${escapeXml(id)}"`, ` title="${escapeXml(title)}"`];
	if (taskId != null) parts.push(` taskId="${taskId}"`);
	return parts.join("");
}

function subIssueTag(child: SyncResult): string {
	const tagged = NODE_TAG_RE.exec(child.issue.title);
	const nodeId = tagged?.[1];
	const title = tagged ? (tagged[2] ?? "") : child.issue.title;
	const parts = [` id="${escapeXml(child.issue.id)}"`];
	if (nodeId) parts.push(` nodeId="${escapeXml(nodeId)}"`);
	parts.push(` title="${escapeXml(title)}"`);
	if (child.taskId != null) parts.push(` taskId="${child.taskId}"`);
	return `\t<SUBISSUE${parts.join("")}/>`;
}

export function issuesToXml(input: { tree?: GraphSyncResult; last?: SyncResult }): string {
	if (input.tree) {
		const { parent, children } = input.tree;
		if (!parent.issue.id) return "";
		const attrs = issueAttrs(parent.issue.id, parent.issue.title, parent.taskId);
		if (children.length === 0) return ["<ISSUES>", `\t<ISSUE${attrs}/>`, "</ISSUES>"].join("\n");
		return ["<ISSUES>", `\t<ISSUE${attrs}>`, ...children.map(subIssueTag), "\t</ISSUE>", "</ISSUES>"].join("\n");
	}
	if (input.last?.issue.id) {
		const attrs = issueAttrs(input.last.issue.id, input.last.issue.title, input.last.taskId);
		return ["<ISSUES>", `\t<ISSUE${attrs}/>`, "</ISSUES>"].join("\n");
	}
	return "";
}

export function injectIssuesXml(upliftXml: string, input: { tree?: GraphSyncResult; last?: SyncResult }): string {
	const block = issuesToXml(input);
	if (ISSUES_BLOCK_RE.test(upliftXml)) {
		if (!block) return upliftXml.replace(/\n?[ \t]*<ISSUES\b[\s\S]*?<\/ISSUES>/i, "");
		return upliftXml.replace(ISSUES_BLOCK_RE, block);
	}
	if (!block) return upliftXml;

	const trimmed = upliftXml.trim();
	const open = trimmed.match(/^<([A-Za-z_][\w.-]*)\b([^>]*)>/);
	if (!open) return trimmed ? `${trimmed}\n${block}` : block;

	const tag = open[1]!;
	const closeRe = new RegExp(`</${tag}\\s*>\\s*$`, "i");
	if (!closeRe.test(trimmed)) return `${trimmed}\n${block}`;
	return trimmed.replace(closeRe, `\n${block}\n</${tag}>`);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test src/issues/format.test.ts`
Expected: PASS (all cases in Step 1).

- [ ] **Step 5: Type-check and commit**

Run: `bunx tsc --noEmit`
Expected: no errors.

```bash
git add src/issues/format.ts src/issues/format.test.ts
git commit -m "feat(issues): add <ISSUES> XML injection, mirroring <CLARIFICATIONS>"
```

---

### Task 2: Wire `<ISSUES>` injection into the hook pipeline

**Files:**
- Modify: `src/claude/hook.ts:161-196` (the `issuesOn` block)
- Modify: `src/claude/hook.test.ts`

**Interfaces:**
- Consumes: `injectIssuesXml` from `src/issues/format.ts` (Task 1).
- Produces: `result.xml` (and therefore the persisted spec file and `record.result.xml`) now includes `<ISSUES>` whenever `tree` or `last` is set.

- [ ] **Step 1: Write the failing test**

Find the existing test in `src/claude/hook.test.ts` that asserts on `deps.config.issues` behavior (search for `issuesEnabled` or `trackThoughtGraph` fakes) and add, in the same `describe` block:

```ts
test("injects <ISSUES> into the persisted spec XML when issue tracking succeeds", async () => {
	const deps = baseDeps(); // use this suite's existing fixture-builder
	// ensure deps.config.issues.enabled (or deps.control.issuesEnabled) is true and
	// deps.ktui / the tracked issue fakes are configured so trackUpliftedPrompt or
	// trackThoughtGraph resolves with a non-empty `last`/`tree`, matching how this
	// file's existing "issues" tests already stub that path.
	const result = await runPromptSubmit({ session_id: "s1", prompt: "add a widget" }, deps);
	expect(result.output?.hookSpecificOutput.additionalContext).toContain("<ISSUES>");
	expect(result.record?.result.xml).toContain("<ISSUES>");
});
```

Match this test's setup to whatever fixture/fake pattern the file already uses for its other `issues`-related tests — do not invent a new fixture style.

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test src/claude/hook.test.ts -t "injects <ISSUES>"`
Expected: FAIL — `additionalContext`/`result.xml` do not contain `<ISSUES>` yet.

- [ ] **Step 3: Wire the injection**

In `src/claude/hook.ts`, add to the imports:

```ts
import { injectIssuesXml } from "../issues/format.ts";
```

Immediately after the existing `issuesOn` block closes (after the `catch` that logs `"issues failed: ..."`, i.e. right before `const record: SessionRecord = {`), add:

```ts
if (tree || last) {
	result = { ...result, xml: injectIssuesXml(result.xml, { tree, last }) };
}
```

This runs whether tracking succeeded (`tree`/`last` set from `trackThoughtGraph`/`trackUpliftedPrompt`) and mirrors exactly where the `<CLARIFICATIONS>` injection already happens earlier in the same function (`result = { ...result, xml: injectClarificationsXml(result.xml, clarifications) };`).

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test src/claude/hook.test.ts`
Expected: PASS, including all pre-existing tests in this file (this change must not alter behavior when `issuesOn` is false or tracking fails — `tree`/`last` stay `undefined` in that case, so `issuesToXml` returns `""` and `injectIssuesXml` is a no-op).

- [ ] **Step 5: Type-check and commit**

```bash
bunx tsc --noEmit
git add src/claude/hook.ts src/claude/hook.test.ts
git commit -m "feat(hook): inject <ISSUES> into the uplifted spec after issue tracking"
```

---

## Part 2 — Notion PR tracking

### Task 3: `NotionConfig` and `src/config.ts` wiring

**Files:**
- Create: `src/notion/types.ts`
- Modify: `src/config.ts`
- Modify: `src/config.test.ts`

**Interfaces:**
- Produces: `NotionConfig` interface, `DEFAULT_NOTION_CONFIG` constant (exported from `src/notion/types.ts`); `AioConfig.notion: NotionConfig` (exported from `src/config.ts`). Tasks 4–9 consume `NotionConfig`.

- [ ] **Step 1: Write the failing config tests**

In `src/config.test.ts`, add near the other `const X = {...}` fixtures (after `const SWARM = DEFAULT_SWARM_CONFIG;`):

```ts
import { DEFAULT_NOTION_CONFIG } from "./notion/types.ts";
const NOTION = DEFAULT_NOTION_CONFIG;
```

Add `notion: NOTION,` to every existing `toEqual({ ... swarm: SWARM, })` object literal in this file — run:

```bash
sed -i 's/\(\t\t\tswarm: SWARM,\)/\1\n\t\t\tnotion: NOTION,/' src/config.test.ts
```

Then add a new `describe` block, placed after the existing `describe("loadConfig", ...)` block's `"issues wrong-typed fields fall back to defaults"` test (mirror that test's shape exactly):

```ts
test("notion partial JSON merges onto defaults", () => {
	withAgentDir(JSON.stringify({ notion: { enabled: false } }));
	expect(loadConfig().notion).toEqual({ ...NOTION, enabled: false });

	withAgentDir(JSON.stringify({ notion: { apiKeyEnv: "  MY_TOKEN  ", parentPageId: "  abc123  " } }));
	expect(loadConfig().notion).toEqual({ enabled: true, apiKeyEnv: "MY_TOKEN", parentPageId: "abc123" });
});

test("notion wrong-typed fields fall back to defaults", () => {
	withAgentDir(JSON.stringify({ notion: { enabled: "no", apiKeyEnv: 1, parentPageId: 2 } }));
	expect(loadConfig().notion).toEqual(NOTION);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test src/config.test.ts`
Expected: FAIL — `./notion/types.ts` does not exist; `AioConfig` has no `notion` field.

- [ ] **Step 3: Create `src/notion/types.ts`**

```ts
export interface NotionConfig {
	enabled: boolean;
	/** Name of the env var holding the Notion internal-integration secret. Never the secret itself. */
	apiKeyEnv: string;
	/** ID of the Notion page shared with the integration; the "PRs" database is created as its child. */
	parentPageId: string;
}

export const DEFAULT_NOTION_CONFIG: NotionConfig = {
	enabled: true,
	apiKeyEnv: "NOTION_API_KEY",
	parentPageId: "",
};

export const NOTION_DATABASE_TITLE = "PRs";
export const NOTION_API_VERSION = "2022-06-28";
export const NOTION_API_BASE = "https://api.notion.com/v1";
```

- [ ] **Step 4: Wire into `src/config.ts`**

Add import (alongside the other subsystem imports at the top):

```ts
import { DEFAULT_NOTION_CONFIG, type NotionConfig } from "./notion/types.ts";
```

Add `notion: NotionConfig;` to the `AioConfig` interface (after `swarm: SwarmConfig;`).

Add `notion: { ...DEFAULT_NOTION_CONFIG },` to `defaultConfig()`'s returned object (after `swarm: { ...DEFAULT_SWARM_CONFIG },`).

Add a merge function (placed near `mergeSwarm`):

```ts
function mergeNotion(notion: Record<string, unknown> | undefined, defaults: NotionConfig): NotionConfig {
	if (!notion) return defaults;
	return {
		enabled: typeof notion.enabled === "boolean" ? notion.enabled : defaults.enabled,
		apiKeyEnv: typeof notion.apiKeyEnv === "string" && notion.apiKeyEnv.trim() ? notion.apiKeyEnv.trim() : defaults.apiKeyEnv,
		parentPageId: typeof notion.parentPageId === "string" ? notion.parentPageId.trim() : defaults.parentPageId,
	};
}
```

Add `notion: mergeNotion(asRecord(file.notion), base.notion),` to `mergeConfig()`'s returned object (after the `swarm:` line).

- [ ] **Step 5: Run tests to verify they pass**

Run: `bun test src/config.test.ts`
Expected: PASS.

- [ ] **Step 6: Type-check and commit**

```bash
bunx tsc --noEmit
git add src/notion/types.ts src/config.ts src/config.test.ts
git commit -m "feat(config): add notion config section"
```

---

### Task 4: Low-level Notion API client (`src/notion/client.ts`)

**Files:**
- Create: `src/notion/client.ts`
- Test: `src/notion/client.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks except `NOTION_API_BASE`/`NOTION_API_VERSION` (Task 3).
- Produces: `HttpFn` type, `createNotion(options?: { http?: HttpFn; apiKey?: string }): NotionClient`, where `NotionClient` exposes `findDatabase`, `createDatabase`, `queryDatabase`, `createPage`, `updatePageProperties`. Task 6/7 consume this client.

- [ ] **Step 1: Write the failing tests**

Create `src/notion/client.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test src/notion/client.test.ts`
Expected: FAIL — `./client.ts` does not exist.

- [ ] **Step 3: Implement `src/notion/client.ts`**

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test src/notion/client.test.ts`
Expected: PASS.

- [ ] **Step 5: Type-check and commit**

```bash
bunx tsc --noEmit
git add src/notion/client.ts src/notion/client.test.ts
git commit -m "feat(notion): add low-level Notion API client"
```

---

### Task 5: `ensureDatabase` (`src/notion/sync.ts`, part 1)

**Files:**
- Create: `src/notion/sync.ts`
- Test: `src/notion/sync.test.ts`

**Interfaces:**
- Consumes: `NotionClient` (Task 4), `NOTION_DATABASE_TITLE` (Task 3).
- Produces: `ensureDatabase(client: NotionClient, parentPageId: string): Promise<string>` (returns the database id; throws on failure — callers in Tasks 6/7 and the hook scripts in Tasks 8/9 catch). Tasks 6/7 consume this.

- [ ] **Step 1: Write the failing tests**

Create `src/notion/sync.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test src/notion/sync.test.ts`
Expected: FAIL — `./sync.ts` does not exist.

- [ ] **Step 3: Implement `ensureDatabase` in `src/notion/sync.ts`**

```ts
import type { NotionClient } from "./client.ts";
import { NOTION_DATABASE_TITLE } from "./types.ts";

export async function ensureDatabase(client: NotionClient, parentPageId: string): Promise<string> {
	const found = await client.findDatabase(parentPageId, NOTION_DATABASE_TITLE);
	if ("error" in found) throw new Error(`notion findDatabase failed: ${found.error}`);
	if (found.id) return found.id;

	const created = await client.createDatabase(parentPageId, NOTION_DATABASE_TITLE);
	if ("error" in created) throw new Error(`notion createDatabase failed: ${created.error}`);
	return created.id;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test src/notion/sync.test.ts`
Expected: PASS.

- [ ] **Step 5: Type-check and commit**

```bash
bunx tsc --noEmit
git add src/notion/sync.ts src/notion/sync.test.ts
git commit -m "feat(notion): add ensureDatabase find-or-create"
```

---

### Task 6: Issue markers + `syncPrCreated` (`src/notion/sync.ts`, part 2)

**Files:**
- Modify: `src/notion/sync.ts`
- Modify: `src/notion/sync.test.ts`

**Interfaces:**
- Consumes: `listIssues` from `src/issues/tissue.ts` (existing, signature `listIssues(root: string): TissueIssue[]`); `TissueIssue` from `src/issues/types.ts`; `ensureDatabase` (Task 5).
- Produces: `hasNotionMarker(issue: TissueIssue): boolean`, `appendNotionMarker(issue: TissueIssue, pageId: string): void`, `unsyncedIssuesForRepo(root: string, repoSlug: string): TissueIssue[]`, `syncPrCreated(client: NotionClient, opts: { root: string; parentPageId: string; pr: NotionPr }): Promise<{ databaseId: string; prPageId: string; nested: number }>`. Task 8's hook script consumes `syncPrCreated`.

- [ ] **Step 1: Write the failing tests**

Append to `src/notion/sync.test.ts`:

```ts
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { appendNotionMarker, hasNotionMarker, syncPrCreated, unsyncedIssuesForRepo } from "./sync.ts";
import type { TissueIssue } from "../issues/types.ts";

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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test src/notion/sync.test.ts`
Expected: FAIL — `hasNotionMarker`, `appendNotionMarker`, `unsyncedIssuesForRepo`, `syncPrCreated` are not exported.

- [ ] **Step 3: Implement**

Add to `src/notion/sync.ts`:

```ts
import { readFileSync, writeFileSync } from "node:fs";
import { listIssues } from "../issues/tissue.ts";
import type { TissueIssue } from "../issues/types.ts";

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
```

Note: `issuePageProperties` uses the property name `title` (lowercase) because a Notion **page** whose parent is another **page** (not a database) only has a single `title`-typed property, always named `title`. This differs from `prProperties`, whose parent is a **database** with the custom property names defined in `databaseSchema` (Task 4) — a page under a database parent uses those property names (`Title`, `PR #`, etc.), a page under a page parent uses the fixed `title` property.

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test src/notion/sync.test.ts`
Expected: PASS.

- [ ] **Step 5: Type-check and commit**

```bash
bunx tsc --noEmit
git add src/notion/sync.ts src/notion/sync.test.ts
git commit -m "feat(notion): sync PR creation, nesting unsynced repo issues as sub-pages"
```

---

### Task 7: `syncPrReviewed` (`src/notion/sync.ts`, part 3)

**Files:**
- Modify: `src/notion/sync.ts`
- Modify: `src/notion/sync.test.ts`

**Interfaces:**
- Consumes: `ensureDatabase` (Task 5), `NotionClient` (Task 4).
- Produces: `syncPrReviewed(client: NotionClient, opts: { parentPageId: string; repoSlug: string; prNumber: number; merged: boolean; gate: { ok: boolean; confidence?: number } }): Promise<{ updated: boolean }>`. Task 9's hook script consumes this.

- [ ] **Step 1: Write the failing tests**

Append to `src/notion/sync.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test src/notion/sync.test.ts`
Expected: FAIL — `syncPrReviewed` is not exported.

- [ ] **Step 3: Implement**

Add to `src/notion/sync.ts`:

```ts
function asRecord(value: unknown): Record<string, unknown> | undefined {
	if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
	return value as Record<string, unknown>;
}

export async function syncPrReviewed(
	client: NotionClient,
	opts: {
		parentPageId: string;
		repoSlug: string;
		prNumber: number;
		merged: boolean;
		gate: { ok: boolean; confidence?: number };
	},
): Promise<{ updated: boolean }> {
	const databaseId = await ensureDatabase(client, opts.parentPageId);
	const found = await client.queryDatabase(databaseId, {
		and: [
			{ property: "Repo", rich_text: { equals: opts.repoSlug } },
			{ property: "PR #", number: { equals: opts.prNumber } },
		],
	});
	if ("error" in found) throw new Error(`notion queryDatabase failed: ${found.error}`);
	const row = asRecord(found.results[0]);
	if (!row?.id || typeof row.id !== "string") return { updated: false };

	const status = opts.merged ? "Merged" : "Closed";
	const review = opts.gate.ok ? "Pass" : "Fail";
	const updated = await client.updatePageProperties(row.id, {
		Status: { select: { name: status } },
		"Claude CI Review": { select: { name: review } },
	});
	if ("error" in updated) throw new Error(`notion updatePageProperties failed: ${updated.error}`);
	return { updated: true };
}
```

`opts.merged: false` with `gate.ok: false` maps to `Status: "Closed"` per the tests above. This is a deliberate v1 simplification: `syncPrReviewed` only fires from the `github_merge_pull_request` tool (Task 9), so "reviewed, not merged" here means a merge attempt was refused by the gate — the PR is still open on GitHub, but marking it "Closed" in Notion is wrong terminology for that case. Accept this as a known v1 gap (a rejected merge attempt reads as "Closed" rather than "Open, review failed") rather than adding a third `merged`/`gate.ok` distinction now — flag it to the user after this task if they want it split into `Open` (gate failed, PR still live) vs `Closed` (someone closed it without merging), since the latter isn't observable from this tool's result at all.

- [ ] **Step 4: Run tests to verify they pass**

Run: `bun test src/notion/sync.test.ts`
Expected: PASS.

- [ ] **Step 5: Type-check and commit**

```bash
bunx tsc --noEmit
git add src/notion/sync.ts src/notion/sync.test.ts
git commit -m "feat(notion): sync PR review/merge outcome to the Notion row"
```

---

### Task 8: `hooks/notion-pr-created.ts` + hook wiring

**Files:**
- Create: `hooks/notion-pr-created.ts`
- Modify: `hooks/hooks.json`

**Interfaces:**
- Consumes: `syncPrCreated` (Task 6), `createNotion` (Task 4), `loadConfig`/`claudeConfigPaths` (existing, `src/config.ts`), `isChildInvocation` (existing, `src/claude/complete.ts`).
- Produces: a runnable hook script; no exports consumed by later tasks.

- [ ] **Step 1: Write the hook script**

Create `hooks/notion-pr-created.ts`:

```ts
#!/usr/bin/env bun
/**
 * Claude Code PostToolUse hook (matcher: the PR-creation tool this plugin's own
 * "aio" MCP server registers): mirror the new PR, plus every not-yet-synced
 * Tissue issue for its repo, into the Notion "PRs" database. Silent and fail-open.
 */
import { claudeConfigPaths, loadConfig } from "../src/config.ts";
import { isChildInvocation } from "../src/claude/complete.ts";
import { createNotion } from "../src/notion/client.ts";
import { syncPrCreated } from "../src/notion/sync.ts";

interface PullResult {
	number: number;
	title: string;
	htmlUrl: string;
	headRef: string;
	baseRef: string;
}

interface HookInput {
	tool_name?: string;
	tool_input?: { owner?: string; repo?: string };
	tool_response?: PullResult | string;
	cwd?: string;
}

function repoSlug(input: HookInput, pr: PullResult): string | undefined {
	if (input.tool_input?.owner && input.tool_input.repo) return `${input.tool_input.owner}/${input.tool_input.repo}`;
	const match = /github\.com\/([^/]+\/[^/]+)\/pull\//.exec(pr.htmlUrl);
	return match?.[1];
}

async function main(): Promise<void> {
	if (isChildInvocation()) return;
	let input: HookInput = {};
	try {
		input = JSON.parse(await new Response(Bun.stdin.stream()).text()) as HookInput;
	} catch {
		return;
	}
	const pr = typeof input.tool_response === "object" ? input.tool_response : undefined;
	if (!pr || typeof pr.number !== "number") return;

	const cwd = input.cwd?.trim() || process.cwd();
	const config = loadConfig(claudeConfigPaths(cwd)).notion;
	if (!config.enabled || !config.parentPageId) return;

	const slug = repoSlug(input, pr);
	if (!slug) return;

	const apiKey = process.env[config.apiKeyEnv];
	if (!apiKey) return;

	try {
		const client = createNotion({ apiKey });
		await syncPrCreated(client, {
			root: cwd,
			parentPageId: config.parentPageId,
			pr: { number: pr.number, title: pr.title, htmlUrl: pr.htmlUrl, repoSlug: slug, headRef: pr.headRef, baseRef: pr.baseRef },
		});
	} catch {
		// fail-open
	}
}

main().catch(() => process.exit(0));
```

- [ ] **Step 2: Wire the hook into `hooks/hooks.json`**

Add a new `PostToolUse` entry (alongside the existing `AskUserQuestion` one) — the matcher must be verified against how Claude Code names this plugin's own MCP-registered tool at hook-match time (see the note below):

```json
{
	"matcher": "github_create_pull_request",
	"hooks": [
		{
			"type": "command",
			"command": "bun \"${CLAUDE_PLUGIN_ROOT}/hooks/notion-pr-created.ts\"",
			"timeout": 30
		}
	]
}
```

**Verification step (do this before considering the task done):** start a Claude Code session with this plugin loaded (`claude --plugin-dir /root/src/repos/plugin`), call the `github_create_pull_request` tool once (or inspect a transcript that already called it), and confirm what `tool_name` Claude Code's `PostToolUse` hook payload actually reports for an MCP-registered tool — it may be the bare registered name (`github_create_pull_request`, as used above, matching how this repo's own `answers.ts` matches the bare built-in name `AskUserQuestion`) or the fully qualified `mcp__aio__github_create_pull_request`. If it's the qualified form, update the `matcher` value above to match exactly.

- [ ] **Step 3: Manual smoke test**

```bash
echo '{"tool_name":"github_create_pull_request","tool_input":{"owner":"acme","repo":"widgets"},"tool_response":{"number":7,"title":"Add widget","htmlUrl":"https://github.com/acme/widgets/pull/7","headRef":"feat/widget","baseRef":"main"},"cwd":"'"$(pwd)"'"}' | bun hooks/notion-pr-created.ts
echo "exit: $?"
```

Expected: exits 0 (no crash) whether or not `notion.parentPageId`/`NOTION_API_KEY` are configured — with them unset, this exercises the fail-open early return in Step 1's `main()`.

- [ ] **Step 4: Commit**

```bash
git add hooks/notion-pr-created.ts hooks/hooks.json
git commit -m "feat(notion): add PostToolUse hook syncing new PRs to Notion"
```

---

### Task 9: `hooks/notion-pr-reviewed.ts` + hook wiring

**Files:**
- Create: `hooks/notion-pr-reviewed.ts`
- Modify: `hooks/hooks.json`

**Interfaces:**
- Consumes: `syncPrReviewed` (Task 7), `createNotion` (Task 4).
- Produces: a runnable hook script.

- [ ] **Step 1: Write the hook script**

Create `hooks/notion-pr-reviewed.ts`:

```ts
#!/usr/bin/env bun
/**
 * Claude Code PostToolUse hook (matcher: this plugin's merge-with-review tool):
 * update the PR's Notion row with the merge/review outcome, whether or not the
 * merge gate passed. Silent and fail-open.
 */
import { claudeConfigPaths, loadConfig } from "../src/config.ts";
import { isChildInvocation } from "../src/claude/complete.ts";
import { createNotion } from "../src/notion/client.ts";
import { syncPrReviewed } from "../src/notion/sync.ts";

interface MergeResult {
	ok: boolean;
	merged: boolean;
	reason: string;
	review?: { confidence: number };
}

interface HookInput {
	tool_name?: string;
	tool_input?: { number?: number; owner?: string; repo?: string };
	tool_response?: MergeResult | string;
	cwd?: string;
}

async function main(): Promise<void> {
	if (isChildInvocation()) return;
	let input: HookInput = {};
	try {
		input = JSON.parse(await new Response(Bun.stdin.stream()).text()) as HookInput;
	} catch {
		return;
	}
	const result = typeof input.tool_response === "object" ? input.tool_response : undefined;
	const prNumber = input.tool_input?.number;
	const owner = input.tool_input?.owner;
	const repo = input.tool_input?.repo;
	if (!result || typeof prNumber !== "number" || !owner || !repo) return;

	const cwd = input.cwd?.trim() || process.cwd();
	const config = loadConfig(claudeConfigPaths(cwd)).notion;
	if (!config.enabled || !config.parentPageId) return;

	const apiKey = process.env[config.apiKeyEnv];
	if (!apiKey) return;

	try {
		const client = createNotion({ apiKey });
		await syncPrReviewed(client, {
			parentPageId: config.parentPageId,
			repoSlug: `${owner}/${repo}`,
			prNumber,
			merged: result.merged,
			gate: { ok: result.ok, confidence: result.review?.confidence },
		});
	} catch {
		// fail-open
	}
}

main().catch(() => process.exit(0));
```

`input.tool_input.owner`/`repo` are optional on the underlying `github_merge_pull_request` tool (see `src/mcp/server.ts:198-210` — they default to "the current gh repo" when omitted). If a caller invokes it without them, this hook has no way to resolve the repo slug and skips (the `!owner || !repo` guard above) — this is an accepted gap for v1 fail-open behavior, not a bug to fix here.

- [ ] **Step 2: Wire the hook into `hooks/hooks.json`**

Add a second `PostToolUse` entry:

```json
{
	"matcher": "github_merge_pull_request",
	"hooks": [
		{
			"type": "command",
			"command": "bun \"${CLAUDE_PLUGIN_ROOT}/hooks/notion-pr-reviewed.ts\"",
			"timeout": 30
		}
	]
}
```

Apply the same matcher-name verification called out in Task 8, Step 2.

- [ ] **Step 3: Manual smoke test**

```bash
echo '{"tool_name":"github_merge_pull_request","tool_input":{"number":7,"owner":"acme","repo":"widgets"},"tool_response":{"ok":true,"merged":true,"reason":"gate passed","review":{"confidence":5}},"cwd":"'"$(pwd)"'"}' | bun hooks/notion-pr-reviewed.ts
echo "exit: $?"
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add hooks/notion-pr-reviewed.ts hooks/hooks.json
git commit -m "feat(notion): add PostToolUse hook syncing PR review/merge outcome to Notion"
```

---

### Task 10: README documentation

**Files:**
- Modify: `README.md`

**Interfaces:** None — documentation only.

- [ ] **Step 1: Add a "Notion PR tracking" section to README.md**

Add a new section after the existing `### Thinking engine` table (or wherever the existing `issues`/kanban documentation lives — match that section's placement), containing:

```markdown
### Notion PR tracking

When a PR opens (via this plugin's `github_create_pull_request` tool) or is
reviewed/merged (`github_merge_pull_request`), a "PRs" Notion database is kept in
sync — one row per PR, with every Tissue issue tracked against that repo nested
underneath as Notion sub-pages.

Setup (one time):

1. Create a Notion internal integration at `notion.so/my-integrations`; copy its secret.
2. Share a parent page with that integration (`•••` → Connections on the page).
3. Set the integration secret as an env var, `NOTION_API_KEY` by default:
   ```bash
   export NOTION_API_KEY=ntn_...
   ```
4. Add to your `all-in-one.json`:
   ```json
   { "notion": { "enabled": true, "parentPageId": "your-page-id" } }
   ```

The "PRs" database is created automatically under that page the first time a PR
syncs. `notion.apiKeyEnv` (default `NOTION_API_KEY`) lets you point at a
differently-named env var. Everything here is fail-open: without
`parentPageId`/the env var set, sync is silently skipped.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: document Notion PR tracking setup"
```

---

## Self-review notes

- **Spec coverage:** `<ISSUES>` tag → Tasks 1–2. Notion schema/database → Tasks 3–6. Auth via env var → Tasks 3–4, 8–9. Lazy provisioning → Task 5. Sub-page nesting → Task 6. Marker-based repo-scoped idempotency → Task 6. Claude CI Review from the existing Greptile gate → Task 7. Two `PostToolUse` hooks → Tasks 8–9. Manual setup instructions → Task 10.
- **Type consistency check:** `NotionClient` (Task 4) is the type every `sync.ts` function (Tasks 5–7) and both hook scripts (Tasks 8–9) consume by that exact name; `NotionPr` (introduced in Task 6) is the type both `syncPrCreated` (Task 6) and the `notion-pr-created.ts` hook (Task 8) use for the PR payload — field names (`repoSlug`, `headRef`, `baseRef`) confirmed consistent across both.
- **Known open risk, called out inline rather than hidden:** the exact `PostToolUse` matcher string for an MCP-registered tool is unverified against live Claude Code behavior (flagged in the spec's "Open items" and repeated as an explicit verification step in Task 8). This is the one piece of this plan that cannot be nailed down from reading source alone — mark it and move on rather than guessing silently.
- **Fixed during self-review:** Task 1's original draft had a buggy `subIssueTag` using `.splice()` on a single-element array; the code shown above is already the corrected version (no separate "buggy then fixed" steps left in the task).
