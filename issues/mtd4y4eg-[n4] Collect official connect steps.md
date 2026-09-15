# [n4] Collect official connect steps
## Node
`n4` · generate · deps: n3

## Question
If login or MCP wiring is still needed, what operational steps do current official Greptile docs describe for CLI login, MCP client connection, and OAuth/callback behavior, excluding marketing, third-party credential instructions, invented config filenames, API routes, package names, and any parallel unofficial auth scheme?

## Chain of Thought
Working assumption: no live Greptile page was retrieved here. Do not invent npm/brew names, mcp.json paths, or API routes. After inventory chooses A–G, fetch only official docs (queries: “Greptile MCP connect”, “Greptile CLI login”, “Greptile MCP client configuration”, “Greptile OAuth CLI callback”; domains: docs.greptile.com, greptile.com) and overlay CLI --help. Ignore marketing and unofficial credential posts.

    Path-gated steps (apply the first true branch only): A WAITING_ON_USER_APPROVE — keep the existing authorize/callback URL; human approve or paste-back once; no second PKCE; then whoami/status. B ALREADY_CONNECTED — no login/docs apply. C SIGNED_IN_MCP_NOT_WIRED — skip login; follow official MCP client wiring only (editor MCP UI vs CLI plugin vs documented remote MCP URL, whichever docs name); reuse the CLI/browser session; add GREPTILE_API_KEY only if those docs require a key and env is unset; never write keys into the repo. D EMPTY_OR_MISSING_CLI — official install+connect page only; do not guess a package manager. E SIGNED_OUT + agent browser — one help-listed login (expect `greptile login` only if --help lists it); complete org/account in that browser; no chat passwords. F SIGNED_OUT + no browser/DISPLAY — one CLI authorize URL + human approve; then MCP docs if still unwired. G ERROR — quote stderr; one transient retry; stop.

    OAuth: official PKCE/callback only; do not rewrite redirect URIs or intercept codes except the CLI’s own paste-back. Success is a later status/whoami/MCP signedIn check, not a login URL.

    Coding agent next (this order): `command -v greptile`; `greptile --help`/`--version` and help-listed identity/status; `GREPTILE_API_KEY` set vs unset (never print value); in-session MCP tools/servers + signedIn/auth-blocked; browser-tool + DISPLAY/headless; then official-doc search above. Do not start login or write config until A–G is chosen from that output. Do not search assumed mcp.json paths.

parent: mtd4y4ec

<!-- aio-id: orchestrate-ultrathink-please-us-5c845379/n4 -->
## Links
- tissue: mtd4y4eg
