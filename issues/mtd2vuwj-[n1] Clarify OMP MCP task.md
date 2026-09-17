# [n1] Clarify OMP MCP task
## Node
`n1` · understand · deps: none

## Question
What exactly must the coding agent change: locate the canonical user OMP MCP file (expected ~/.omp/agent/mcp.json), preserve the existing Relume Streamable HTTP entry (type http, url https://relume-library-mcp.relume.io/mcp, mode 600), add Greptile as a separate MCP server in that same file, then reload/reauth/verify via OMP MCP list/probe rather than greptile CLI whoami?

## Chain of Thought
Change only the user-level OMP MCP config: locate the canonical file (expected ~/.omp/agent/mcp.json; confirm via OMP MCP docs/skill before write; one file only). Read first; merge in place. Keep Relume unchanged (type "http", url https://relume-library-mcp.relume.io/mcp). Add a separate name-only server key greptile whose transport is discovered, not guessed. Atomic write, valid JSON, chmod 600.

    After write: documented OMP MCP reload, list both relume and greptile, then probe/reauth that MCP. Success is name-resolve plus auth-or-explicit-OAuth-block. Do not treat greptile CLI/plugin whoami as registration proof. Do not touch Relume OAuth, PRs, plugin lanes, or invent URLs. If discovery fails closed, leave Relume intact and report what is still needed.

parent: mtd2vuwi

<!-- aio-id: add-the-greptile-mcp-into-this-o-5cf338ed/n1 -->
## Links
- tissue: mtd2vuwj
- github: https://github.com/swcstudiospace/plugin
- repo: swcstudiospace/plugin
