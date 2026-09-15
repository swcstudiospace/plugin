# [n3] Compare auth branches
## Node
`n3` · compare · deps: n2

## Question
Given preflight, which branch is correct: skip `greptile login` and report current account/org if whoami shows a valid session; run only `greptile login` if unsigned/expired then re-run whoami; fail with high-level install/login guidance if the binary is missing; or hand off if this agent environment cannot complete browser PKCE/Approve?

## Chain of Thought
Exclusive branch after n2 mapping (never login before the map):
    - whoami shows an account → ALREADY_AUTHENTICATED: skip login; report account/org (unknown if unprinted); report GREPTILE_API_KEY set/unset only; MCP signedIn is secondary; switching = user runs `greptile login` locally then whoami.
    - binary present, whoami unsigned/expired → LOGIN_REQUIRED: run only `greptile login`, then re-run whoami. If this session cannot finish browser PKCE/Approve → LOGIN_BLOCKED: tell user to run `greptile login` in their own terminal; do not automate the browser; do not retry unbounded.
    - no/unexecutable binary → CLI_MISSING: stop with high-level install/login guidance; invent nothing.
    - non-zero/network/malformed after one retry → ERROR, stderr-safe, stop.
    Coding agent next: `command -v greptile` (or `which greptile`); if present, `greptile whoami` then `[ -n "${GREPTILE_API_KEY+x}" ]`; branch per above. Do not run login until whoami result is known.

parent: mtd4r4p2

<!-- aio-id: greptile-login-c35e403f/n3 -->
## Links
- tissue: mtd4r4p5
