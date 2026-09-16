# Notion PR tracking — design

**Date:** 2026-09-16
**Status:** Approved for implementation planning
**Author:** Claude (brainstormed with the repo owner)

## Problem

This plugin (`all-in-one`) already tracks work at the **prompt level**: every
uplifted prompt gets a Tissue parent issue plus one sub-issue per Graph-of-Thought
node under `issues/`, synced to a local ktui Kanban board (`src/issues/`). There is
no tracking at the **PR level**, and no shared, org-visible view of that work — the
ktui board is local to one machine.

Separately, `src/uplift/xml.ts` and `src/hitl/format.ts` establish a pattern of
injecting structured `<TAG>` blocks into the uplifted XML spec (`<ORIGINAL>`,
`<CLARIFICATIONS>`). Issue-tracking data is currently only surfaced as a markdown
tail section (`formatIssueAddendum`, in `additionalContext`) — never as XML inside
the spec itself.

This design adds:
1. An `<ISSUES>` XML tag, following the existing `<CLARIFICATIONS>` injection pattern.
2. A Notion-backed **PRs database**, one row per actual GitHub PR, with the local
   Tissue issue tree nested underneath each PR as Notion sub-pages. This is the
   shared, PR-level Kanban view; the local ktui board remains the per-prompt,
   per-repo board. The two are deliberately different tiers, not duplicates.

## Non-goals

- Replacing or removing the local ktui board.
- A generic "sync any Notion database" capability — this is scoped to one
  purpose-built "PRs" database.
- Real-time/two-way sync (editing Notion does not write back to `issues/` or ktui).
- Automated Notion-side reminders, notifications, or additional views beyond the
  Board view described below.

## Decisions made during brainstorming

| Question | Decision |
|---|---|
| What does a Notion "PR Task" map to? | One row per **actual GitHub PR** (not per prompt) |
| Sync trigger | Automatic, via a new `PostToolUse` Claude Code hook — no reliance on the agent remembering to sync |
| Issue→PR scoping | Repo-level (matches existing Kanban scoping), via a sync marker, not branch-level |
| Notion auth | Internal integration token via env var + direct REST calls (a headless hook cannot use the interactive claude.ai OAuth connector — hooks run as detached subprocesses with no access to the agent's tool-calling loop or its browser session) |
| Database provisioning | Lazy, created on first sync (mirrors `ensureBoard`/`ensureCategory` in `src/issues/kanban.ts`) |
| Issues/Sub-issues under a PR | Notion sub-pages (page nesting), not a second linked database |
| Extra PR properties | Add a "Claude CI Review" status, sourced from the **existing** Greptile merge gate (`mergeAfterReview` in `src/mcp/server.ts`) — no new review mechanism |

## Architecture

### 1. `<ISSUES>` XML tag

Added to `src/issues/format.ts` (or a new `src/issues/xml.ts`, decided at
implementation time), following `hitl/format.ts:injectClarificationsXml`'s exact
mechanic: replace an existing `<ISSUES>` block if present, else insert before the
root element's closing tag; empty tree removes the block.

```xml
<ISSUES>
  <ISSUE id="tissue-id" title="..." taskId="123">
    <SUBISSUE id="tissue-id" title="..." kind="..." taskId="124"/>
  </ISSUE>
</ISSUES>
```

Wired into `src/claude/hook.ts` right after the existing `trackThoughtGraph` /
`trackUpliftedPrompt` block resolves (`tree`/`last`), the same place
`injectClarificationsXml` already runs for HITL. This is additive:

- The markdown `## Issue tracking` tail (`formatIssueAddendum`, appended to
  `additionalContext`) is unchanged — that's what instructs the agent.
- The XML tag is the structured record that now also lives in the persisted spec
  file (`specFile`) and session record, for any future consumer (including, later,
  debugging what a given turn's issue tree looked like).

The Notion sync itself does **not** read this tag — Notion sync runs later, in a
separate hook process triggered by PR creation, with no access to this turn's
in-memory state. It reads directly from `issues/*.md` on disk (see below), the same
way `syncAllIssues` already does.

### 2. Notion schema

One database, **"PRs"**, created as a child of a Notion page the user has shared
with the integration (`notion.parentPageId` in config). One row per GitHub PR:

| Property | Type | Source |
|---|---|---|
| Title | title | PR title |
| PR # | number | `github.createPull` / `github.getPull` result |
| Repo | rich text | `owner/repo` |
| Status | select: `Open` / `Merged` / `Closed` | `Open` at creation; updated by the review hook below |
| Claude CI Review | select: `Pending` / `Pass` / `Fail` | `Pending` at creation; set from `mergeAfterReview`'s `gate.ok` + `review.confidence` at merge-attempt time |
| URL | url | PR `htmlUrl` |
| Branch | rich text | `${headRef} → ${baseRef}` |
| Opened | date | sync time |

Viewed as a Notion **Board view** grouped by `Status`, this is the cross-repo,
org-visible Kanban board the user wants — distinct from, not a replacement for, the
local per-prompt ktui board.

**Issues/Sub-issues nest as Notion sub-pages** under the PR page — one child page
per Tissue parent Issue tracked against that repo, each with its own child pages
per Sub-issue (Graph node). No second database, no relation property: this content
doesn't need independent filtering, it's detail attached to a PR.

**Idempotency** reuses the existing Tissue marker convention exactly
(`aioMarker`/`TISSUE_ID_PREFIX` in `src/issues/track.ts` and
`src/issues/types.ts`): once an Issue's markdown file is nested into Notion, a
`notion-id: <page_id>` marker line is appended to its body (mirrors the existing
`<!-- aio-id: ... -->` marker used for Kanban dedup). A sync only nests issues
without that marker yet.

### 3. Module layout — `src/notion/`

Mirrors the existing `kanban.ts` (low-level client) / `track.ts` (orchestration)
split in `src/issues/`:

- **`types.ts`** — `NotionConfig`, database/page property shapes.
- **`client.ts`** — direct `fetch` wrapper against `api.notion.com` (query
  database, create database, create page, append block children, update page
  properties). Token read from `process.env[config.apiKeyEnv]`, same convention as
  `src/mcp/supabase.ts` (`SUPABASE_ACCESS_TOKEN`). No OAuth, no CLI subprocess.
- **`sync.ts`** — orchestration:
  - `ensureDatabase(client, parentPageId)` — find-or-create the "PRs" database
    (mirrors `ensureBoard`/`ensureCategory`).
  - `syncPrCreated(client, pr, repoRoot)` — create the PR row; scan
    `issues/` (via `listIssues`, same as `syncAllIssues`) for issues matching this
    repo (`github:`/`repo:` lines already written by `taskDescription` in
    `kanban.ts`) without a `notion-id` marker; nest them as sub-pages; write the
    marker back.
  - `syncPrReviewed(client, pr, gateResult)` — query the database by Repo + PR#
    (no local state dependency — works even if merge happens in a different
    session/machine than PR creation) and update `Status`/`Claude CI Review`.

### 4. Config

New `notion` section in `AioConfig` (`src/config.ts`), following the exact
`DEFAULT_*_CONFIG` + `mergeX` pattern every other section uses:

```ts
export interface NotionConfig {
  enabled: boolean;
  apiKeyEnv: string;      // default "NOTION_API_KEY" — never the secret itself
  parentPageId: string;   // default "" — required for sync to run; fail-open (skip) if empty
}
```

### 5. Hook wiring

Two new entries in `hooks/hooks.json`, both `PostToolUse`, following the existing
`answers.ts`/`stop.ts` pattern exactly: read `tool_name`/`tool_response` from
stdin, guard with `isChildInvocation()`, fail-open (never throw, never block the
tool result), silent unless emitting a `systemMessage`.

- `hooks/notion-pr-created.ts` — matcher on the `github_create_pull_request` tool
  → `syncPrCreated`.
- `hooks/notion-pr-reviewed.ts` — matcher on the `github_merge_pull_request` tool
  → `syncPrReviewed`, regardless of whether the merge gate passed (a failed review
  should still show up in Notion).

The exact Claude Code matcher string for an MCP tool (bare tool name vs.
`mcp__aio__github_create_pull_request`) is an implementation detail to confirm
against Claude Code's hook-matching behavior during implementation, not a design
decision — `answers.ts` already establishes the pattern for a built-in tool
(`AskUserQuestion`); the plan should verify the MCP-qualified form before wiring.

### 6. Manual setup (user-facing, one time)

1. Create a Notion internal integration at `notion.so/my-integrations`; copy its
   secret.
2. Share a parent Notion page with that integration (`•••` → Connections).
3. Set the integration secret as an env var (name matches `notion.apiKeyEnv`,
   default `NOTION_API_KEY`) — never written to the JSON config file.
4. Set `notion.parentPageId` in `~/.claude/all-in-one.json` (or the OMP/project
   config file, per the existing `claudeConfigPaths` precedence) to that page's ID.
5. First PR created after setup triggers `ensureDatabase`, which creates the "PRs"
   database under that page automatically.

## Error handling

Every new code path is fail-open, matching this repo's stated philosophy
("Everything is fail-open" — README) and the existing hook precedents: a
missing/invalid token, missing `parentPageId`, or any Notion API error is caught,
logged (via the existing `log`/`AIO_DEBUG` convention), and never blocks PR
creation, merge, or any other Claude Code action. `notion.enabled: false` (or an
empty `parentPageId`) skips sync entirely with no attempted network call.

## Testing

Follows this repo's existing test convention (`*.test.ts` beside each module,
`bun test`, injected fakes rather than real network/CLI calls):

- `src/notion/client.test.ts` — request shaping against a fake `fetch`.
- `src/notion/sync.test.ts` — `ensureDatabase`/`syncPrCreated`/`syncPrReviewed`
  against a fake client, covering: first-run database creation, idempotent reuse,
  marker-based issue dedup, repo-scoping (issues from a different repo excluded),
  and fail-open behavior on client errors.
- `src/issues/format.test.ts` (or new `xml.test.ts`) — `<ISSUES>` injection:
  insert-when-absent, replace-when-present, empty-tree removal — mirroring
  `hitl/format.test.ts`'s existing coverage of `injectClarificationsXml`.
- Hook scripts (`notion-pr-created.ts`, `notion-pr-reviewed.ts`) stay thin
  (stdin parse → call `sync.ts` → optional systemMessage), consistent with
  `answers.ts`/`stop.ts` being thin wrappers with the real logic under `src/`.

## Open items for the implementation plan

- Confirm the exact `PostToolUse` matcher string Claude Code expects for an
  MCP-registered tool.
- Decide the Notion API version pin (`Notion-Version` header) at implementation
  time against current Notion API docs.
- Decide where the `NOTION_API_KEY` env var itself gets set for users (shell
  profile vs. a `.env` loaded by `bun`) — likely documented in README alongside
  the existing Grok/Supabase env var instructions, not enforced by code.
