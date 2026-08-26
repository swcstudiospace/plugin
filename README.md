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

Prefixes: `uplift:` force · `raw:` skip.

Flags: `--aio-uplift-off` starts the session with uplift disabled. `--aio-issues-off` starts with issue tracking disabled.

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
  }
}
```

Prompts longer than `maxChars` skip the LLM and use fallback wrap. Set `echo` to `false` to hide the per-turn XML transcript (the agent still receives the rewrite; `/uplift last` still shows it).

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

