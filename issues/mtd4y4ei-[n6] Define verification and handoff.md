# [n6] Define verification and handoff
## Node
`n6` · refine · deps: n5

## Question
After at most one login or MCP-connect attempt, which observable checks prove success or name the blocker (CLI identity/whoami, MCP signedIn/usable, API-key-env set vs unset, auth-blocked MCP tools), and if OAuth needs a human browser, what single authorize URL or paste-back code request should be surfaced without rotating PKCE state?

## Chain of Thought
After at most one login or MCP-connect attempt, treat live command/MCP payloads as truth. Run (only if present on PATH/tools; do not invent names): `greptile` identity/whoami/status; MCP `signedIn`/usable; boolean whether `GREPTILE_API_KEY` is set (never print value); whether any Greptile MCP tool still fails solely with auth. Connected = signed-in identity plus MCP usable and not auth-blocked. Else name one blocker: signed-out; waiting on browser approve; CLI missing; identity OK but MCP not registered; key required and unset; org/SSO/network error.

    Human OAuth: if a challenge is already pending or this host has no display, surface that single authorize URL once; ask for paste-back code only if the official CLI callback requires it. Do not start another `greptile login`. After user approve/paste, re-run the same status checks. Coding agent next: PATH/`greptile --help`, env presence of `GREPTILE_API_KEY` without dumping it, MCP tool list/auth errors—no repo files, no new OAuth if a URL is already outstanding.

parent: mtd4y4ec

<!-- aio-id: orchestrate-ultrathink-please-us-5c845379/n6 -->
## Links
- tissue: mtd4y4ei
