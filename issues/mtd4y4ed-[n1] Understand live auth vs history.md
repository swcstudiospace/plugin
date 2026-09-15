# [n1] Understand live auth vs history
## Node
`n1` · understand · deps: none

## Question
What does this session actually require for Greptile MCP (usable signed-in MCP, not a product feature or /greptile command), and which prior facts must be treated as stale until rechecked: oveshen.govender@gmail.com / Spectrum Web Co, CLI browser session rather than GREPTILE_API_KEY, MCP signedIn true, later PKCE login blocked by no-display host?

## Chain of Thought
Require a live, official Greptile MCP that is signed-in and usable in this agent session: inspect current CLI/MCP identity, complete at most one official browser or documented CLI OAuth path if unsigned, then re-verify status. Do not build features, `/greptile`, custom servers, or store secrets.

    Treat as stale until rechecked this run: account `oveshen.govender@gmail.com`, org Spectrum Web Co, CLI browser session (not `GREPTILE_API_KEY`), prior MCP `signedIn: true`, and the later PKCE flow blocked by a headless host. Coding agent next: run identity/whoami/MCP status (and whether `GREPTILE_API_KEY` is set, redacted), list whether a browser tool exists, then only if unsigned start one official `greptile login`/MCP connect—do not assume old session or spawn a second PKCE.

parent: mtd4y4ec

<!-- aio-id: orchestrate-ultrathink-please-us-5c845379/n1 -->
## Links
- tissue: mtd4y4ed
