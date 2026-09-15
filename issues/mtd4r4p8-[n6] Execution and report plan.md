# [n6] Execution and report plan
## Node
`n6` · synthesize · deps: n3,n4,n5

## Question
What ordered plan should the coding agent execute and what short status must it emit: commands (`which`/`command -v greptile`, `greptile whoami`, conditional `greptile login`, whoami again); no files/wrappers/secrets created; identity fields limited to CLI-printed account/org plus whether an API key env is set; and exactly one outcome among already signed in (with local re-login switch hint), newly signed in, blocked pending user-terminal browser approval, or failed with a concrete CLI/environment reason?

## Chain of Thought
Execute in this order and stop at the first terminal state. Do not create files, wrappers, slash commands, env keys, or MCP edits. Do not print secrets.

    1. `command -v greptile` (or `which greptile`). If missing/unexecutable → CLI_MISSING: high-level “install the Greptile CLI, then run `greptile login` in your terminal”; invent no install path/package manager.
    2. If present: `greptile whoami` (retry that same command once on transient network/non-zero/malformed). Then `[ -n "${GREPTILE_API_KEY+x}" ]` — report set vs unset only.
    3. Branch on live whoami only:
       - Account printed → ALREADY_AUTHENTICATED: do not run login. Report signed-in, CLI-printed account, org or unknown, key set/unset, MCP signedIn as secondary. Hint: switch accounts by running `greptile login` in the user’s terminal, then `greptile whoami`.
       - Unsigned/expired and TTY/browser available → LOGIN_REQUIRED: run only `greptile login` (no scrape/automate Approve). On CLI success, `greptile whoami` again. If identity matches → LOGIN_SUCCESS (newly signed in). If MCP still signed-out, report both; do not fix MCP.
       - Unsigned/expired but no TTY/browser → LOGIN_BLOCKED: do not start/automate PKCE; keep any existing session; tell user to run `greptile login` locally then re-check `greptile whoami`.
       - Second whoami/login failure → ERROR: stderr-safe reason, stop.

    Emit one short status with exactly one outcome: already signed in (plus local re-login hint); newly signed in; blocked pending user-terminal browser approval; CLI missing; or failed with a concrete CLI/environment reason. Fields: signed-in or not; account if printed; org if printed else unknown; API key set/unset; MCP secondary only. Redact any secret-shaped output.

parent: mtd4r4p2

<!-- aio-id: greptile-login-c35e403f/n6 -->
## Links
- tissue: mtd4r4p8
