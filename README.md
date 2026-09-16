# omp-all-in-one

OMP plugin. **Prompt Uplift** expands every user prompt into a nested XML specification before the coding agent runs — the same density as a production build prompt (role, context, constraints, named feature sections, acceptance, out of scope).

Default **on**. Each rewrite is echoed in the transcript (root, source, full XML) so you can audit what the agent received. Prefix `raw:` to send a prompt unchanged. `/uplift off` disables.

## Install

```bash
omp plugin link /root/src/repos/plugin
```

Confirm with `omp plugin list` — you should see `● omp-all-in-one@0.2.0`.

Extension modules load at **session start**. `/reload-plugins` does not pick up `omp.extensions`. Quit omp and start a new session.
TUI widgets (LSP section, uplift chrome) load the same way.

One-off without a permanent install:

```bash
omp -e /root/src/repos/plugin
```

Local marketplace:

```bash
omp plugin marketplace add /root/src/repos/plugin
omp plugin install all-in-one@aio
```

## Claude Code plugin

The same pipeline runs inside Claude Code as a plugin, as a two-stage pipeline. A `UserPromptSubmit` hook fires at the start of every prompt:

**Stage 1 — thinking on Grok 4.6 Ultra** (`grok-4.6` @ `xhigh` reasoning). The hook uses the SuperGrok Heavy OAuth session that `grok login` stores in `~/.grok/auth.json`; the plugin calls the Grok CLI chat proxy `/responses` endpoint directly with that session — no API key, no `grok` process per call. It produces:

1. **Prompt Uplift** — the request rewritten as the nested XML spec.
2. **Graph of Thought** (4-8 nodes) and **Chain of Thought** per node in dependency order, independent nodes in parallel. The graph carries a `WORKFLOW` of parallel waves (file-disjoint units per wave) and the synthesize node's conclusion names the waves plus the verification commands.
3. **HITL clarifications** — the questions a senior engineer would ask before starting, injected as `<CLARIFICATIONS>` into the spec (see below).
4. **Issues** — a Tissue parent issue plus one sub-issue per node under `issues/`, synced to the ktui board when `ktui` is on PATH.

**Stage 2 — coding on the session model.** The spec, graph, workflow, clarifications, and issue tree go back to Claude as hook context, framed as your own elaborated request. Claude Code's own model (`claude-fable-5-1` via its built-in PKCE login) is untouched: it plans from the graph, dispatches the wave units as parallel `Task` subagents, and runs the named verification. A `Stop` hook moves the cards to done when the turn ends.

Claude Code 2.1.x hooks cannot replace the prompt text itself, so the XML rides alongside your message as `additionalContext`; the `ORIGINAL` element always holds your verbatim words.

**Fail visibly, never downgrade.** When Grok is not logged in or the session has expired the hook prints `Prompt Uplift skipped · Grok 4.6 login required (run grok login)` and the prompt passes through unchanged. `grok.fallbackToClaude: true` opts into the old behaviour (thinking on a headless `claude -p` child, summary tagged `engine: claude (grok fallback)`).

Requires `bun`, the `claude` CLI, and a logged-in `grok` CLI (`grok login`) on PATH.

```bash
# try it for one session
claude --plugin-dir /root/src/repos/plugin

# or install from the local marketplace
claude plugin marketplace add /root/src/repos/plugin
claude plugin install all-in-one@aio

# or the reversible full setup (settings env + marketplace + plugin + proxy unit)
bun scripts/claude-setup.ts apply
```

Commands: `/all-in-one:uplift on|off|skip|status|last`, `/all-in-one:uplift think on|off|last`, `/all-in-one:uplift hitl on|off|last|status`, `/all-in-one:grok status|engine grok|engine claude|proxy status`, `/all-in-one:issues list|status|sync|on|off`.
Prefix a prompt with `raw:` to send it untouched. Slash commands (including Claude Code `<command-name>` expansions) and trivial replies (`ok`, `lgtm`, ...) are never uplifted: the hook exits with no JSON so UserPromptExpansion and Skill dispatch still run. After an uplifted turn, those commands stay invocable by you and by Claude.

Config is read from `~/.omp/agent/all-in-one.json`, then `~/.claude/all-in-one.json`, then `<project>/.claude/all-in-one.json` (later wins). `think.engine` picks the Stage 1 engine; `grok` configures it and the proxy; `claude` controls the fallback child calls; `hitl` the clarifier:

```json
{
  "think": { "enabled": true, "engine": "grok", "minNodes": 3, "maxNodes": 8 },
  "grok": {
    "enabled": true,
    "baseUrl": "https://cli-chat-proxy.grok.com/v1",
    "model": "grok-4.6",
    "reasoningEffort": "xhigh",
    "transport": "http",
    "bin": "grok",
    "home": "",
    "callTimeoutMs": 0,
    "fallbackToClaude": false,
    "proxy": {
      "enabled": true,
      "host": "127.0.0.1",
      "port": 41417,
      "upstream": "https://api.anthropic.com",
      "haikuModel": "grok-4.6",
      "routeModels": ["grok-"],
      "stripThinking": true
    }
  },
  "hitl": { "enabled": true, "maxQuestions": 4 },
  "claude": {
    "model": "sonnet",
    "thinking": false,
    "concurrency": 3,
    "callTimeoutMs": 0,
    "budgetMs": 0,
    "echo": true
  },
  "issues": { "enabled": true, "boardName": "Spectrum Web Co" }
}
```

Grok 4.6 Ultra (`xhigh`) plus Graph of Thought and per-node Chain of Thought is slow by design: the spec is ~3-4k output tokens and each node is another call (≈18 s per 1k output tokens). The Claude Code `UserPromptSubmit` hook waits up to **86400 s (24 h)** so that work can finish; if the host times out it **discards** the spec. `"reasoningEffort": "high"` is faster; `"think": { "enabled": false }` keeps only the uplift and a single tracked issue. Everything is fail-open: on any failure your original prompt still goes through. `claude.budgetMs` (default `0`) is an optional internal abort; `0` means run until the host hook timeout. Per-call `callTimeoutMs` of `0` means no per-call timer. Set `AIO_DEBUG=1` to see progress on stderr. State (last spec, per-session issue tree, clarifications) lives in `~/.claude/aio/`.

### Thinking engine

`think.engine` is `"grok"` (default) or `"claude"`. `/all-in-one:grok engine grok|claude` switches it for the machine without editing config; `/all-in-one:grok status` prints `Engine: grok-4.6@xhigh (SuperGrok OAuth: <email>, expires <ISO>)` or `claude:<model>` — never a token.

| `grok` key | Default | Meaning |
|---|---|---|
| `enabled` | `true` | Engine available |
| `baseUrl` | `https://cli-chat-proxy.grok.com/v1` | Grok CLI chat proxy |
| `model` | `grok-4.6` | Model override header |
| `reasoningEffort` | `xhigh` | `low` / `medium` / `high` / `xhigh` — **Grok 4.6 Ultra** is `grok-4.6` @ `xhigh` |
| `transport` | `http` | `http` calls `/responses` directly with the stored session. `cli` spawns `grok -p … --tools none --disallowed-tools … --permission-mode plan --deny Bash/Edit/Write --max-turns 1` per call from a scratch cwd: same login and no tool access, but ~100k tokens and ~35 s per call because the CLI loads its own harness (skills, rules, system prompt). Fallback only; a run that stops for any reason other than `end_turn` is treated as a failure |
| `bin` | `grok` | Binary for `transport: "cli"` |
| `home` | `""` | `$GROK_HOME` or `~/.grok` (`auth.json`, `version.json`) |
| `callTimeoutMs` | `0` | Per call; `0` = no timer |
| `fallbackToClaude` | `false` | Silently use the `claude` engine when Grok is not logged in |

The session is read from `~/.grok/auth.json` (first entry: access token, `expires_at`, `email`); `~/.grok/version.json` supplies the `x-grok-client-version` header the proxy insists on. Expired or missing sessions fail visibly (see above). Nothing is printed or persisted from the token: error bodies pass through `redactSecrets` before they reach a log line or the summary.

### Grok proxy — Haiku-tier on Grok

`src/grok/proxy.ts` is a local Anthropic-compatible router, **aio-grok-proxy** on `http://127.0.0.1:41417`. Every request is a transparent pass-through to `https://api.anthropic.com` (same method, headers, streaming body), so Claude Code's PKCE OAuth session keeps working unchanged. Only requests whose `model` starts with a `grok.proxy.routeModels` prefix (`grok-`) are rerouted to the Grok CLI proxy `/v1/messages` with the SuperGrok session:

- `stop_sequences` (and `top_k`) are stripped — Grok rejects them.
- SSE `content_block_*` indices are renumbered (Grok emits every block as index 0 and omits it on deltas).
- `thinking` blocks are stripped unless the request enabled thinking (`grok.proxy.stripThinking`).
- `POST /v1/messages/count_tokens` for a Grok model is answered locally.
- `GET /healthz` → `{ ok, upstream, grok: { loggedIn, expired, email, expiresAt } }` — never a token.

`ANTHROPIC_BASE_URL=http://127.0.0.1:41417` plus `ANTHROPIC_DEFAULT_HAIKU_MODEL=grok-4.6` in `~/.claude/settings.json` `env` make Claude Code's Haiku tier (background summaries, title generation, small subagents) hit Grok 4.6 while Sonnet/Opus-tier calls continue to Anthropic. The proxy is started detached by the `SessionStart` hook when it is not already listening, and permanently by the `aio-grok-proxy.service` systemd unit that `claude-setup.ts apply` installs (`deploy/aio-grok-proxy.service` is a rendered example). `/all-in-one:grok proxy status` reports whether it is listening.

### HITL clarifications

After the graph, the clarifier (same Grok engine) asks for up to `hitl.maxQuestions` (default 4) questions that would change the plan — scope boundaries, conflicting constraints, unstated targets — each with a short header (≤12 chars), 2-4 options, a recommended default, a `why`, and a `blocking` flag. They land in the spec as `<CLARIFICATIONS>` and in the hook context as a `## Clarifications (HITL)` addendum that tells Claude to:

1. resolve what it can from the repo first;
2. for blocking open questions, call **AskUserQuestion once** with the given headers/options (recommended default first) — the Cowork-style question card;
3. for non-blocking ones, proceed with the default and state the assumption;
4. never re-ask items listed under `Answered:`.

A `PostToolUse` hook on `AskUserQuestion` (`hooks/answers.ts`) captures the answers, writes them into the session state and back into the spec's `<CLARIFICATIONS>` (`<ANSWER source="user">`), and prints `HITL · N answer(s) recorded`. Answered clarifications carry over to the next prompt in the same session so nothing is asked twice. Non-interactive runs (`claude -p`, no AskUserQuestion) proceed with the defaults.

`/all-in-one:uplift hitl on|off|last|status` toggles the clarifier and echoes the last question set. Config: `hitl.enabled`, `hitl.maxQuestions`.

### Install on this machine

```bash
bun scripts/claude-setup.ts status               # what is configured; never prints tokens
bun scripts/claude-setup.ts apply                # reversible setup (exit 2 if the proxy never answers)
bun scripts/claude-setup.ts refresh              # reinstall the plugin from this checkout + restart the proxy
bun scripts/claude-setup.ts rollback             # revert the keys apply owns; everything else in settings.json stays
bun scripts/claude-setup.ts rollback --snapshot  # restore the pre-apply settings.json byte-for-byte
```

`apply` (root, systemd host) is ordered so a dead `ANTHROPIC_BASE_URL` is never written:

1. Backs up `~/.claude/settings.json` byte-for-byte to `~/.claude/aio/backups/settings.json.<timestamp>` and records the current value of every key it is about to change.
2. `claude plugin marketplace add <root>`, then `claude plugin install all-in-one@aio` (`uninstall` first on a re-apply; non-zero exit is a warning, e.g. already installed).
3. Writes `/etc/systemd/system/aio-grok-proxy.service` (rendered with the running `bun` and this plugin root), `systemctl daemon-reload`, then `enable --now` — or `restart` when the unit is already active, since `enable --now` is a no-op for a running unit. Without write access to `/etc/systemd/system` the unit is skipped and the SessionStart hook starts the proxy instead.
4. Waits up to 5 s for `/healthz`.
5. Re-reads `settings.json` (the `claude` CLI rewrites `enabledPlugins` itself during install) and writes it atomically (`settings.json.tmp` + rename, indentation preserved): `extraKnownMarketplaces.aio` and `enabledPlugins["all-in-one@aio"] = true` always; the `env` keys `ANTHROPIC_BASE_URL`, `ANTHROPIC_DEFAULT_HAIKU_MODEL`, `ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME` (`Grok 4.6 Ultra`), `ANTHROPIC_DEFAULT_HAIKU_MODEL_DESCRIPTION` **only when the proxy answered**. Everything else in the file (your `model`, other plugins and marketplaces) is preserved.
6. Records what it changed (previous values per key, backup path, unit installed, claude version) in `~/.claude/aio/setup-state.json`.

If the proxy never answers, `apply` still finishes steps 5–6 (plugin enabled, state saved, so `rollback` works), prints `proxy not reachable on <url>; ANTHROPIC_BASE_URL not applied — fix the unit (journalctl -u aio-grok-proxy) and re-run apply`, and exits **2**. Any stale `ANTHROPIC_BASE_URL` from an earlier apply is reverted at the same time. `status` prints a `BROKEN:` line whenever `ANTHROPIC_BASE_URL` is set but the proxy is not listening — Claude Code cannot reach the API in that state; `systemctl start aio-grok-proxy.service` or `rollback` fixes it.

Claude Code copies a directory-sourced plugin into `~/.claude/plugins/cache/aio/all-in-one/<version>/` at install time and `claude plugin update` skips a same-version source, so **after editing this checkout run `bun scripts/claude-setup.ts refresh`**: `claude plugin uninstall` + `install` so the cache matches the checkout, `systemctl restart aio-grok-proxy.service` so the proxy picks up `src/grok/` changes, and a `/healthz` wait. `refresh` never touches `settings.json`. A second `apply` does the same plus the settings/unit rewrite and keeps the original pre-change snapshot, so `rollback` still returns to the state before the first apply.

`rollback` reverts the current `settings.json` key-by-key from the recorded previous values (safe when you changed `model` or other settings after apply — they stay), `systemctl disable --now` + removes the unit + `daemon-reload`, `claude plugin uninstall all-in-one@aio` best-effort, and deletes `setup-state.json`. `rollback --snapshot` instead restores the pre-apply backup byte-for-byte, discarding anything changed since apply (falls back to key-by-key when the backup is gone). `$CLAUDE_CONFIG_DIR` is honoured for the Claude directory and `$AIO_STATE_DIR` for the state directory.

After a successful Prompt Uplift on an SDLC-shaped prompt (`implement`, `feature`, `build a`, …), the hook **detaches AgentSwarm** (`hooks/autonomous_run.py` → `orch_plan.py` then `swarm_run.py --runtime auto`) so A01–A15 run without waiting for the parent model. Config: `swarm: { enabled, root, runtime, dryRun }` in `all-in-one.json`. Disable with `AIO_SWARM=0`. Dedup lock: `$SWARM_DIR/kickoffs/*.lock`.

Automation: `claude -p` runners (cron jobs, CI) should set `AIO_UPLIFT=0` in the environment to skip the uplift pre-pass for the whole process, the same way a `raw:` prefix skips it for one prompt. The hook returns immediately and exits 0.

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
| `/aio issues` | Same as `/issues` |
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
| `/pod` | `status` / `up` / `connect` / `doctor` / `on` / `off` |

Prefixes: `uplift:` force · `raw:` skip.

Flags: `--aio-uplift-off` starts the session with uplift disabled. `--aio-issues-off` starts with issue tracking disabled. `--aio-think-off` starts with Graph of Thought disabled. `--aio-lsp-off` starts with Live LSP disabled. `--aio-pod-off` starts with pod boot disabled.

## TUI chrome

Interactive OMP keeps persistent chrome around the editor (not a flash of working-message or default cards):

- **Uplift chrome** (`aio-chrome`) above the editor — Uplift on/off and last root/source; Think on and node count; Tools idle or `▶ {tool}`; Pod connected / not connected / disabled; `Anda active` when the nexus probe succeeds.
- **LSP section** below the editor — always visible. Shows `LSP clean` or an error/warning digest.

Transcript cards are custom labeled Box + Text for `aio-uplift`, `aio-think`, `aio-issue`, and `aio-lsp`. Uplift shows `Prompt Uplift · root · source` plus the first lines of XML when expanded, not a raw dump.


Chrome loads with `omp.extensions` at **session start**. Quit omp and open a new session after linking the plugin; `/reload-plugins` does not pick it up.

## Graph of Thought

After XML uplift, Graph of Thought (3–8 nodes) then sequential Chain of Thought per node.

The agent receives the uplifted XML plus a `GRAPH_OF_THOUGHT` block with `THINKING` / `CONCLUSION` per node.

When think produced a graph, the plugin writes **one parent** Tissue issue plus **one sub-issue per graph node** under `issues/`, then syncs each to Spectrum Web Co. Idempotent via `<!-- aio-id: … -->` markers — re-running the same prompt updates in place. Think off (or think failed) still writes **one** issue from the prompt.

Commands: `/think` `on` | `off` | `status` | `last` (also `/aio think …`). Flag: `--aio-think-off`. Config: `think: { enabled, engine, minNodes, maxNodes }` in `all-in-one.json` — `engine` (`grok` | `claude`) selects the Claude Code Stage 1 engine (see [Thinking engine](#thinking-engine)).

`raw:` and `/uplift skip` still skip the whole pre-pass, including think.

## Live LSP

Lazy stdio language servers feed diagnostics into the session. Fail-open: missing binaries stay disabled (no auto-install). The **LSP section** below the editor always shows `LSP clean` or a digest. Never blocks the agent.

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

## Pod boot (codespace)

When `pod.enabled` is true (default **false**), **omp open** (`session_start`) boots an isolated DevPod codespace, then attaches:

1. Create `pod.extraDirs` on load (relative paths resolve against session cwd).
2. DevPod `up` (`devpod up <cwd> --id <workspaceId> --open-ide=false`). Exit 0 is **not** SSH-ready.
3. Wait until ready (DevPod `startWait` equivalent): poll `devpod status <id> --output json` until `state`/`Status` is `Running` (Busy/empty: sleep `pollMs`, default 2s), then `devpod ssh <id> --command true` until exit 0. `connected` is true only after SSH works. Timeout `readyTimeoutMs` (default 300000 / 5 min); on timeout `connected` stays false and the reason includes "not ready".
4. Anda Engine probe (`ANDA_NEXUS_URL` / `pod.nexusUrl`, default `http://127.0.0.1:8091`).
5. dTEE probe — **ldclabs** (not iclabs) [IC-TEE](https://github.com/ldclabs/ic-tee) gateway reachability. `anda_web3_client` feature `tee` wraps `ic_tee_gateway_sdk` `TeeClient`. HTTP probe of `DTEE_GATEWAY_URL` || `IC_TEE_GATEWAY_URL` || `pod.dteeUrl` (default `http://127.0.0.1:8443`). Not an invented enclave. Missing daemon → `dtee: false`.

File tools (`read`, `write`, `edit`, `grep` path, rooted `glob`) are jailed to the workspace plus those extra dirs. When the pod is connected, bash is rewritten to `` `${bin} ssh ${id} --command ${JSON.stringify(command)}` `` (`wrapBashCommand` quotes `--command`). Missing binary is fail-open: notify, still jail to cwd + extraDirs, no fake ssh.

Child Ultrathink / swarm sessions (`PI_AIO_CHILD` / `PI_ULTRATHINK_CHILD`) do not boot a nested pod.

Bin: `AIMEE_POD_BIN` || `pod.bin` || `devpod`. Nexus: `ANDA_NEXUS_URL` || `pod.nexusUrl` || `http://127.0.0.1:8091`. dTEE gateway: `DTEE_GATEWAY_URL` || `IC_TEE_GATEWAY_URL` || `pod.dteeUrl` || `http://127.0.0.1:8443`. Flag: `--aio-pod-off`. Commands: `/pod` `status` | `up` | `connect` | `doctor` | `on` | `off`. `/pod on` enables without booting. `/pod up` and `/pod connect` enable then `devpod up`. `/pod doctor` and `/pod status` live-probe DevPod (`version` / `list` / `status`) plus Anda and dTEE — they never call `up` or `ssh`. Failed boot still probes Anda so `engineActive` can be true while `connected` is false.

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
    "engine": "grok",
    "minNodes": 3,
    "maxNodes": 8
  },
  "grok": {
    "enabled": true,
    "model": "grok-4.6",
    "reasoningEffort": "xhigh",
    "transport": "http",
    "fallbackToClaude": false,
    "proxy": { "enabled": true, "host": "127.0.0.1", "port": 41417, "haikuModel": "grok-4.6" }
  },
  "hitl": {
    "enabled": true,
    "maxQuestions": 4
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
  },
  "pod": {
    "enabled": false,
    "bin": "devpod",
    "workspaceId": "",
    "extraDirs": [],
    "nexusUrl": "http://127.0.0.1:8091",
    "dteeUrl": "http://127.0.0.1:8443",
    "readyTimeoutMs": 300000,
    "pollMs": 2000
  }
}
```

Prompts longer than `maxChars` skip the LLM and use fallback wrap. Set `echo` to `false` to hide the per-turn XML transcript (the agent still receives the rewrite; `/uplift last` still shows it). `raw:` and skip still skip the whole pre-pass, including Graph of Thought.

`supabase.enabled` defaults to true. Unset env vars make tools return `missing_credentials`. `lsp.enabled` defaults to true. Missing language-server binaries stay disabled; nothing is auto-installed. `pod.enabled` defaults to false — only configured sessions pay `devpod up` on open. `/pod up` turns it on for the session. Missing DevPod is fail-open (notify, jail to cwd + extraDirs, no fake ssh). Codespace is not connected until `status --output json` is Running and `ssh --command true` succeeds (`readyTimeoutMs` default 5 min). `/pod doctor` reports Anda independently of the codespace. dTEE is an **ldclabs** IC-TEE gateway probe (`dtee: boolean`); missing daemon → `dtee: false`.

## Verify

```bash
cd /root/src/repos/plugin
bun install
bun test
bun run check
```

1. Start a **new** omp session. `/uplift` should autocomplete. Uplift chrome should sit above the editor; the LSP section below should show `LSP clean` or a digest.
2. Type a one-line feature request. The transcript should show a custom `Prompt Uplift · …` card plus the XML; the agent should receive that XML, not the one-liner.
3. `raw: do this exactly` should reach the agent un-uplifted.

## Issue tracking

On session start in a git/project folder, the plugin ensures an `issues/` Tissue repo in **that folder** (session cwd) — not the plugin package unless you opened it. Marker is `issues/tissue.json`.

Each uplifted prompt with a Graph of Thought writes one parent markdown issue plus one child per graph node under `issues/`. Think off → one issue from the prompt. Skipped, `raw:`, and trivial prompts do not.

Idempotent: `<!-- aio-id: {workUnitId} -->` on the parent and `<!-- aio-id: {workUnitId}/{node.id} -->` on each child. A re-run of the same prompt rewrites those files in place; it does not add extra `.md` files.

`## Issue tracking` is attached on **every** agent start while a tree (or last issue) exists, so building stays on the board — not a one-shot addendum. Persist with `git add issues/`. Do not `gh issue create`.

Issues sync to the existing ktui board **Spectrum Web Co** via the `ktui` CLI. The plugin moves the current work-unit cards Ready → Doing when the agent starts and Doing → Done on terminal `agent_end` (`willContinue !== true`). Mid-run `turn_end` events do not complete the cards. Agent tools come from MCP `ktui mcp --start-server` (tool `mcp__ktui_ktui`). This plugin's `.mcp.json` starts that server; no `--scope`.


GitHub association is the `origin` remote URL stored on the issue (plus a category named `owner/repo`).

Tools: `issues_status` (last parent id/title + child count; never secrets) / `issues_list`. Commands: `/issues` (also `/aio issues`). Config: `issues` key in `all-in-one.json`. Flag: `--aio-issues-off`.

## Hermes skills

The plugin ships a flattened copy of the Hermes Agent skill library under `skills/<name>/SKILL.md` so OMP discovers them (first-level skill dirs only). Nested Hermes categories (`software-development/clippyos-development`) become `skills/clippyos-development`.

This is a **one-way import**. `~/.hermes` is not modified. Auth, tokens, session dumps, databases, and `.env` are not copied. Re-run:

```bash
bun run import:hermes
```

Idempotent: unchanged skills are left alone; locally edited imports are not overwritten (see `skills/.hermes-import-report.md`).

Not imported: `auth.json`, `mcp-tokens/`, `.env`, `state.db`, session dumps, memories (`USER.md` has private channel ids), `SOUL.md` identity.

