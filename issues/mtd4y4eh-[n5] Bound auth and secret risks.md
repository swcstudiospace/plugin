# [n5] Bound auth and secret risks
## Node
`n5` · critique · deps: n3,n4

## Question
What must the coding agent refuse or avoid while connecting: spawning multiple PKCE attempts, harvesting passwords in chat, printing tokens/cookies/codes, writing GREPTILE_API_KEY or env files into the repo, claiming MCP connected from a login URL alone, inventing MCP config paths, and building review bots or custom MCP servers?

## Chain of Thought
Hard refusals for the coding agent after inventory chooses A–G (do not weaken them if login fails):
    - PKCE: at most one active authorize/callback. If a URL/challenge is already pending (state A), do not run `greptile login` again. No extra OAuth loops, no rewritten redirect URIs, no harvesting/intercepting codes except the CLI’s own paste-back once.
    - Secrets: never ask for a password in chat if browser/SSO/PKCE can proceed. Never print access/refresh tokens, cookies, API keys, or authorization codes (redact if a tool dumps them). Never commit or write `GREPTILE_API_KEY`, `.env`, or token files into the repo. Set a key only if official docs require it and env is unset—runtime only.
    - Success claims: a login URL, browser page, or config snippet is not connected. Report connected only after live whoami/status/MCP `signedIn` (or equivalent) shows usable and not auth-blocked.
    - Invention/scope: do not guess mcp.json paths, package managers, API routes, or product behavior. Do not implement review bots, custom MCP servers/proxies, or a `/greptile` command. Stay on the official CLI/MCP path for the existing account/org unless live auth proves it unusable.

parent: mtd4y4ec

<!-- aio-id: orchestrate-ultrathink-please-us-5c845379/n5 -->
## Links
- tissue: mtd4y4eh
