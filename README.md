# omp-all-in-one

OMP plugin. **Prompt Uplift** expands every user prompt into a nested XML specification before the coding agent runs — the same density as a production build prompt (role, context, constraints, named feature sections, acceptance, out of scope).

Default **on**. Each rewrite is echoed in the transcript (root, source, full XML) so you can audit what the agent received. Prefix `raw:` to send a prompt unchanged. `/uplift off` disables.

## Install

```bash
omp plugin link /root/src/repos/plugin
```

Confirm with `omp plugin list` — you should see `● omp-all-in-one@0.1.0`.

Extension modules load at **session start**. `/reload-plugins` does not pick up `omp.extensions`. Quit omp and start a new session.

One-off without a permanent install:

```bash
omp -e /root/src/repos/plugin
```

Local marketplace:

```bash
omp plugin marketplace add /root/src/repos/plugin
omp plugin install all-in-one@aio
```

## What it does
1. You type a short request.
2. The plugin calls the session model to rewrite it as XML (`BUILD_PROMPT`, `FIX_PROMPT`, `RESEARCH_PROMPT`, `CHANGE_PROMPT`, or `UPLIFTED_PROMPT`).
3. Nested sections are named after the work, not a flat generic list.
4. The rewritten XML is shown in the session (`Prompt Uplift · ROOT · llm|fallback`) before the agent runs.
5. The agent receives the XML plus a short system addendum: treat it as the spec, do not reprint it.
6. If the model fails, a conservative fallback XML still wraps the original request. That wrap is echoed too.

Skipped automatically: slash commands, trivial acknowledgements (`ok`, `lgtm`, …), already-uplifted XML, extension-sourced / steer messages, Ultrathink/swarm child sessions.

## Commands

| Command | Effect |
|---|---|
| `/uplift` | Toggle |
| `/uplift on` / `off` | Enable / disable |
| `/uplift status` | Current mode |
| `/uplift skip` | Skip the next prompt |
| `/uplift last` | Show the last uplifted XML |
| `/aio` | Same as `/uplift` (plugin root command) |
| `/aio uplift …` | Delegate to `/uplift` |
| `/issues` | Issue tracking status / last Tissue → ktui sync |
| `/kanban` | Overlay of the Spectrum Web Co board (not the Textual TUI) |
| `/aio issues` | Same as `/issues` |
| `/aio kanban` | Same as `/kanban` |
| `/think` | Graph of Thought on / off / status / last |
| `/lsp` | Live LSP status / diagnostics |
| `/pr create [title…]` | Open a GitHub PR (title defaults to the current branch) |
| `/pr list` | List pull requests in the current repo |
| `/review [base]` | Run Greptile CLI review; notify confidence and comment count |
| `/merge <n>` | Greptile-gated squash merge (blocked until 5/5 and zero comments) |
| `/aio pr …` | Same as `/pr` |
| `/aio review …` | Same as `/review` |
| `/aio merge …` | Same as `/merge` |
| `/aio think …` | Same as `/think` |
| `/supabase` | `status` / `projects` / `tables` / `users` |

Prefixes: `uplift:` force · `raw:` skip.

Flags: `--aio-uplift-off` starts the session with uplift disabled. `--aio-issues-off` starts with issue tracking disabled. `--aio-think-off` starts with Graph of Thought disabled. `--aio-lsp-off` starts with Live LSP disabled.

## Graph of Thought

After XML uplift, Graph of Thought (3–8 nodes) then sequential Chain of Thought per node.

The agent receives the uplifted XML plus a `GRAPH_OF_THOUGHT` block with `THINKING` / `CONCLUSION` per node.

Commands: `/think` `on` | `off` | `status` | `last` (also `/aio think …`). Flag: `--aio-think-off`. Config: `think: { enabled, minNodes, maxNodes }` in `all-in-one.json`.

`raw:` and `/uplift skip` still skip the whole pre-pass, including think.

## Live LSP

Lazy stdio language servers feed diagnostics into the session. Fail-open: missing binaries stay disabled (no auto-install). Quiet when clean. Never blocks the agent.

| Language | Server (PATH) |
|---|---|
| C# | csharp-ls |
| Rust | rust-analyzer |
| Java | jdtls |
| Python | pyright-langserver |
| TypeScript | typescript-language-server |
| Elixir | elixir-ls |
| OCaml | ocamllsp |
| PHP | intelephense |

After `write` / `edit`, diagnostics sync. A changed error set is injected at `turn_end` (`aio-lsp`) and as `## Live LSP` on `before_agent_start`.

Tools: `lsp_status` / `lsp_diagnostics` (optional `path` to sync first). Command: `/lsp` `status` | `diagnostics`. Flag: `--aio-lsp-off`. Config: `lsp.enabled` in `all-in-one.json`.

## GitHub org MCP + Greptile gate

Stdio MCP server **`./bin/aio-mcp`** (`.mcp.json` key `aio`, relative command, no cwd) talks to GitHub org **swcstudiospace** and the Greptile CLI. Merge is **forbidden** until Greptile review is clean (confidence ≥ 5 and zero comments). There is no force-merge tool.

Slash commands call the same libraries as the MCP server (they do not spawn a second MCP). PRs are created only via MCP tools or `/pr` / `/aio pr` — session start does **not** silently open a PR, even when `github.autoPr` is true. The plugin does not auto-commit.

`greptile login` is required for CLI review. If the CLI is signed out, session start notifies once: `/review` and merge stay blocked until `greptile login`.

Tools (text results, no tokens):

| Tool | Input |
|---|---|
| `github_list_repos` | `{ org? }` |
| `github_create_repo` | `{ name, private? }` |
| `github_create_pull_request` | `{ title, body?, base?, owner?, repo? }` |
| `github_list_pull_requests` | `{ owner?, repo?, state? }` |
| `github_get_pull_request` | `{ number, owner?, repo? }` |
| `github_merge_pull_request` | `{ number, owner?, repo? }` — runs Greptile review; refuses unless the gate passes |
| `greptile_whoami` | `{}` |
| `greptile_review` | `{ base? }` (cwd = process cwd) |
| `aio_status` | `{}` — org + Greptile `signedIn`; never tokens |

Optional hosted Greptile HTTP MCP at `https://api.greptile.com/mcp` with `GREPTILE_API_KEY`. **Do not commit a Bearer key.** This plugin does not ship that server in `.mcp.json`.

## Supabase

The same stdio MCP server **`./bin/aio-mcp`** (`.mcp.json` key `aio`) also talks to Supabase: Management API (projects), Data API (tables/rows/rpc), and Auth Admin (list/get/create/delete users). Credentials are **env only** — never a config-file secret. **Do not add a hosted Supabase MCP URL to `.mcp.json`.**

Slash commands call the same libraries as the MCP tools (they do not spawn a second MCP). Commands: `/supabase` `status` | `projects` | `tables` | `users`.

Config: `supabase.enabled` (default `true`). If `enabled` is false, tools return `{ error: "disabled" }`. If env vars are unset, tools return `{ error: "missing_credentials" }` — they never throw.

Keys never appear in tool results. JWT-shaped strings are masked (`first12…last4`).

Env:

| Variable | Used for |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | Management API (`https://api.supabase.com/v1`) |
| `SUPABASE_URL` | Data + Auth (no trailing slash) |
| `SUPABASE_SERVICE_KEY` or `SUPABASE_SERVICE_ROLE_KEY` | Data + Auth service role |

Tools (text results, no tokens):

| Tool | Input |
|---|---|
| `supabase_status` | `{}` — `{ configured: { management, data } }`; no secrets |
| `supabase_projects_list` | `{}` |
| `supabase_project_get` | `{ projectId }` |
| `supabase_tables_list` | `{ limit? }` |
| `supabase_rows_read` | `{ table, limit?, order?, filters? }` |
| `supabase_rpc_call` | `{ function, args? }` |
| `supabase_auth_users_list` | `{ page?, perPage? }` |
| `supabase_auth_user_get` | `{ id }` |
| `supabase_auth_user_create` | `{ email, password?, emailConfirm? }` |
| `supabase_auth_user_delete` | `{ id }` |

`aio_status` also includes `supabase: { management, data }` booleans.

## Config

`~/.omp/agent/all-in-one.json` (or `$PI_CODING_AGENT_DIR/all-in-one.json`). All keys optional.

```json
{
  "uplift": {
    "enabled": true,
    "skipTrivial": true,
    "maxChars": 20000,
    "echo": true
  },
  "issues": {
    "enabled": true,
    "boardName": "Spectrum Web Co",
    "ktuiBin": "ktui",
    "echo": true
  },
  "think": {
    "enabled": true,
    "minNodes": 3,
    "maxNodes": 8
  },
  "github": {
    "org": "swcstudiospace",
    "autoPr": true
  },
  "greptile": {
    "requiredForMerge": true,
    "bin": "greptile",
    "minConfidence": 5
  },
  "supabase": {
    "enabled": true
  },
  "lsp": {
    "enabled": true
  }
}
```

Prompts longer than `maxChars` skip the LLM and use fallback wrap. Set `echo` to `false` to hide the per-turn XML transcript (the agent still receives the rewrite; `/uplift last` still shows it). `raw:` and skip still skip the whole pre-pass, including Graph of Thought.

`supabase.enabled` defaults to true. Unset env vars make tools return `missing_credentials`. `lsp.enabled` defaults to true. Missing language-server binaries stay disabled; nothing is auto-installed.

## Verify

```bash
cd /root/src/repos/plugin
bun install
bun test
bun run check
```

1. Start a **new** omp session. `/uplift` should autocomplete.
2. Type a one-line feature request. The transcript should show `Prompt Uplift · …` plus the XML; the agent should receive that XML, not the one-liner.
3. `raw: do this exactly` should reach the agent un-uplifted.

## Issue tracking

On session start in a git/project folder, the plugin ensures an `issues/` Tissue repo in **that folder** (session cwd) — not the plugin package unless you opened it. Marker is `issues/tissue.json`.

Each uplifted prompt writes one markdown issue under `issues/`. Skipped, `raw:`, and trivial prompts do not.

Issues sync to the existing ktui board **Spectrum Web Co** via the `ktui` CLI. Agent tools come from MCP `ktui mcp --start-server` (tool `mcp__ktui_ktui`). This plugin's `.mcp.json` starts that server; no `--scope`.

OMP shows a HUD plus a `/kanban` overlay. That is **not** the real Textual TUI — run `ktui` in another terminal for that.

GitHub association is the `origin` remote URL stored on the issue (plus a category named `owner/repo`). Push later with `git add issues/` — this does not call `gh issue create`.

Commands: `/issues`, `/kanban` (also `/aio issues` / `/aio kanban`). Config: `issues` key in `all-in-one.json`. Flag: `--aio-issues-off`.

## Hermes skills

The plugin ships a flattened copy of the Hermes Agent skill library under `skills/<name>/SKILL.md` so OMP discovers them (first-level skill dirs only). Nested Hermes categories (`software-development/clippyos-development`) become `skills/clippyos-development`.

This is a **one-way import**. `~/.hermes` is not modified. Auth, tokens, session dumps, databases, and `.env` are not copied. Re-run:

```bash
bun run import:hermes
```

Idempotent: unchanged skills are left alone; locally edited imports are not overwritten (see `skills/.hermes-import-report.md`).

Not imported: `auth.json`, `mcp-tokens/`, `.env`, `state.db`, session dumps, memories (`USER.md` has private channel ids), `SOUL.md` identity.

