# [n2] Inspect environment capabilities
## Node
`n2` · decompose · deps: n1

## Question
Which real tools exist now to inspect Greptile identity and MCP: greptile CLI on PATH (whoami/identity/status/login), MCP status payloads, env presence of GREPTILE_API_KEY without printing its value, editor/plugin MCP registration, and an agent-controlled browser that can finish official OAuth versus a host with no display?

## Chain of Thought
Working assumption: this graph pass cannot execute tools; the coding agent must run the probes below and treat missing binaries/tools as EMPTY_OR_MISSING_CLI / NO_BROWSER_TOOL, not as signed-out.

    Run only these capability checks (record stdout/stderr, redact any token/cookie/code):
    - CLI: `command -v greptile`; if found, `greptile --help` (or `--version`) and try only documented/help-listed identity commands such as `whoami` / `status` / `identity` if they appear—do not guess extra subcommands.
    - Env: test whether `GREPTILE_API_KEY` is set (`[ -n "${GREPTILE_API_KEY+x}" ]` or equivalent); report set/unset only.
    - MCP: list tools/servers actually available in this agent session; note any Greptile MCP tool and any `signedIn`/auth-blocked payload. Search the workspace for MCP registration only if a file is already open or clearly named in the environment—do not assume `.cursor/mcp.json`, Claude, or VS Code paths.
    - Browser/host: list whether a browser/computer-use tool exists in this session; check `DISPLAY` / headless (no display). If no browser tool or no display, OAuth cannot be agent-completed.
    - Stop after inventory. Do not start `greptile login` or a second PKCE in this inspect step.

parent: mtd4y4ec

<!-- aio-id: orchestrate-ultrathink-please-us-5c845379/n2 -->
## Links
- tissue: mtd4y4ee
