# [n3] Choose connect path
## Node
`n3` · compare · deps: n2

## Question
Given live inspect results, which state applies and which single path should run: already MCP signed-in and usable (stop), CLI signed-in but MCP not wired (docs-only connect), signed-out with a real browser tool (one official PKCE/OAuth), signed-out with no browser (one CLI authorize URL plus human approve), empty/missing CLI (official install/connect docs only), or waiting-on-user (do not start a second OAuth)?

## Chain of Thought
Apply the first true branch only after n2 inventory (do not login in this node). A WAITING_ON_USER_APPROVE: CLI/session already shows a pending authorize/callback → do not start a second PKCE; keep that one URL; wait for human approve/paste-back; re-check identity. B ALREADY_CONNECTED: Greptile MCP tool present, signedIn/usable, not auth-blocked → stop; report status only. C SIGNED_IN_MCP_NOT_WIRED: help-listed whoami/status/identity shows a session but MCP missing/unsigned/auth-blocked → no new login; official MCP connect docs only. D EMPTY_OR_MISSING_CLI: `command -v greptile` fails and no Greptile MCP server in-session → official install+connect docs only; do not invent packages/paths. E SIGNED_OUT + browser tool + display → exactly one official CLI/OAuth in the agent browser (reuse existing account/org if the UI asks; no password harvest in chat). F SIGNED_OUT + no browser tool or no DISPLAY → exactly one CLI authorize URL + human approve (then docs for MCP if still unwired). G ERROR: quote exact stderr; one retry only if transient; then stop.

    Working assumption: inventory not yet run, so no path is “connected.” After this pass the coding agent must run only: `command -v greptile`; `greptile --help`/`--version` and help-listed identity commands; `GREPTILE_API_KEY` set vs unset (never print value); list in-session MCP tools/servers and any signedIn/auth-blocked payload; browser-tool presence and DISPLAY/headless. Do not search assumed mcp.json paths. Do not start `greptile login` until A–G is chosen from that output.

parent: mtd4y4ec

<!-- aio-id: orchestrate-ultrathink-please-us-5c845379/n3 -->
## Links
- tissue: mtd4y4ef
