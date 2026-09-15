# [n5] Graceful blockers and retries
## Node
`n5` · refine · deps: n3

## Question
If whoami works but interactive `greptile login` cannot run (no TTY/browser), or login succeeds while MCP still reports signed-out, or a transient network error occurs: keep any existing session, tell the user to run `greptile login` in their own terminal then re-check whoami, retry whoami/login at most once, report both CLI and MCP signals without editing MCP config, and mark missing org as unknown?

## Chain of Thought
Yes. Treat CLI whoami as source of truth and degrade without extra product work:

    - whoami succeeds, no TTY/browser for `greptile login` → LOGIN_BLOCKED. Keep the existing session. Do not start/automate PKCE. Tell the user to run `greptile login` in their own terminal, then re-check `greptile whoami`. Do not loop.
    - Login CLI-success but MCP still signed-out → LOGIN_SUCCESS for CLI; report both signals. Do not edit MCP config, env, or plugin files.
    - Transient network/non-zero/malformed → retry the same command once (whoami or login). Second failure → ERROR, stderr-safe, stop. No unbounded retries.
    - Account printed, org missing → report account; mark org unknown. Do not reuse prior-chat org IDs.
    - GREPTILE_API_KEY: report set vs unset only; never print the value.

    Coding agent after this pass: `command -v greptile`; if present `greptile whoami`; `[ -n "${GREPTILE_API_KEY+x}" ]`; login only if unsigned/expired and a TTY/browser is available; otherwise hand off and stop.

parent: mtd4r4p2

<!-- aio-id: greptile-login-c35e403f/n5 -->
## Links
- tissue: mtd4r4p7
