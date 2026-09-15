# [n7] Execution plan
## Node
`n7` · synthesize · deps: n1,n2,n3,n4,n5,n6

## Question
What is the final ordered plan the coding agent should execute: PATH/CLI probe, fresh whoami/status and env-key presence check, branch per n3 without forcing re-login, run or defer `greptile login`, re-verify identity, then output the n6 operator report with no product-feature work and no slash-command invention?

## Chain of Thought
Execute in this order; stop at the first hard block. Do not invent flags, installers, `/greptile`, keys, or org names. No repo writes.

    1. PATH: `command -v greptile` (or `which greptile`). Empty → CLI_MISSING: report CLI not on PATH, login cannot proceed; optionally note GREPTILE_API_KEY set/unset only; skip login/whoami.
    2. Env (presence only): test whether GREPTILE_API_KEY is set; report set/unset; never print/write the value.
    3. Discover verbs: `greptile --help` and/or `greptile help`. Capture version only if already printed. Use the identity command the binary shows (likely whoami or status). Help fail → AMBIGUOUS_STATUS (stderr + exit); do not login.
    4. Fresh preflight identity: run that whoami/status once. Record signed-in, account, org only if printed. MCP/plugin signedIn or auth-blocked only if that output (or another help-listed status command) shows it; else MCP unknown. Ignore prior-turn account/`signedIn: true`.
    5. Branch (n3): missing CLI already stopped; ambiguous error → report stderr/exit, stop; valid usable session → skip login (ALREADY_SIGNED_IN); unsigned/invalid + interactive host that can open a browser and wait for Approve → run exactly `greptile login`; unsigned/invalid + non-interactive → NEEDS_USER_TERMINAL: do not start PKCE; tell the user to run `greptile login` locally. Do not logout, pick an org, or set keys.
    6. Failures: browser not opened / no Approve → fail closed, keep prior session. Unexpected CLI exit → report stderr/exit. Network/IdP: one retry of `greptile login` only if clearly transient; otherwise stop. Never construct keys or edit unknown config.
    7. Re-verify: after login, skip, or user confirmation they ran login locally, re-run the same whoami/status. Claim signed-in only if that output shows a usable identity. Re-check MCP/plugin auth if queryable.
    8. Operator report (n6 only): signed-in true/false; account; org if printed; auth mode (browser session vs env key set/unset); CLI version if printed; browser flow started|skipped|deferred; MCP blocked|not blocked|unknown; blocking error verbatim if any. If deferred: next action is user runs `greptile login`, then re-whoami.

    Coding agent checks: PATH probe; env-key presence (no value); `greptile --help`/`help`; whoami/status twice around any login. No product-feature work.

parent: mtd4rnms

<!-- aio-id: greptile-login-5cbafaae/n7 -->
## Links
- tissue: mtd4rnmz
