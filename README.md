# omp-all-in-one

OMP plugin. **Prompt Uplift** expands every user prompt into a nested XML specification before the coding agent runs — the same density as a production build prompt (role, context, constraints, named feature sections, acceptance, out of scope).

Default **on**. Prefix `raw:` to send a prompt unchanged.

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
4. The agent receives the XML plus a short system addendum: treat it as the spec, do not reprint it.
5. If the model fails, a conservative fallback XML still wraps the original request.

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

Prefixes: `uplift:` force · `raw:` skip.

Flag: `--aio-uplift-off` starts the session with uplift disabled.

## Config

`~/.omp/agent/all-in-one.json` (or `$PI_CODING_AGENT_DIR/all-in-one.json`). All keys optional.

```json
{
  "uplift": {
    "enabled": true,
    "skipTrivial": true,
    "maxChars": 20000
  }
}
```

Prompts longer than `maxChars` skip the LLM and use fallback wrap.

## Verify

```bash
cd /root/src/repos/plugin
bun install
bun test
bun run check
```

1. Start a **new** omp session. `/uplift` should autocomplete.
2. Type a one-line feature request. The agent should receive nested XML, not the one-liner.
3. `raw: do this exactly` should reach the agent un-uplifted.
