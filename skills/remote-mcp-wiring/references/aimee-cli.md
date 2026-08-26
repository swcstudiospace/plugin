# Aimee Codes CLI — MCP client internals (session notes, 2026-08-23)

Source of truth is the code: `crates/aimee_infra/src/mcp_client.rs`,
`crates/aimee_domain/src/mcp.rs`, `crates/aimee_domain/src/env.rs`,
`crates/aimee_services/src/mcp/manager.rs`. Re-read if these notes
disagree with the tree.

## Config locations

- User scope: `<base_path>/.mcp.json`
- Project scope: `$PWD/.mcp.json`
- Trust store: `<base_path>/.mcp_trust.json` (path → content hash; any edit
  to a project-local config revokes trust and re-prompts on next start)

`base_path` resolution (`ConfigReader::base_path`, `aimee_config/src/reader.rs`):
1. `$AIMEE_CONFIG` or legacy `$OMEGA_CONFIG`
2. First existing of `~/aimee ~/.aimee ~/omega ~/.omega ~/forge ~/.forge`
3. Default `~/.aimee`

On this VPS the active base path is `/root/.forge` (Forge legacy layout),
so user-scope MCP config = `/root/.forge/.mcp.json`.

## Config format

Claude Code-compatible `.mcp.json`: `{"mcpServers": {"<name>": {...}}}`.
Each server is either:

```json
{"command": "...", "args": [...], "env": {}}          // stdio
{"url": "https://…", "headers": {"Authorization": "Bearer …"}, "oauth": false}  // http
```

HTTP extras: `"timeout"` seconds per tool call (default 300,
env `AIMEE_MCP_TIMEOUT`), `"disable": true` to park a server without
deleting it. Header values are Handlebars templates with env nested under
`env` → write `{{.env.GITHUB_TOKEN}}`; resolved at connect time from the
process environment (`std::env::vars()`), which includes vars sourced from
`.env` files walked up from cwd.

OAuth field semantics: absent → auto-detect (plain connect first, falls
back to OAuth flow on 401-ish errors); `false` → headers-only, never
OAuth; object → explicit config. **For static API keys always set
`"oauth": false`.**

## CLI surface

```
aimee mcp import '{"mcpServers":{...}}' [-s local|user]
aimee mcp list [--porcelain]   # CONNECTS to every server + lists tools
aimee mcp remove <name> [-s scope]
aimee mcp show <name>
aimee mcp reload               # rebuild caches without restart
aimee mcp login|logout <name>  # interactive OAuth only
```

Import merges into the chosen scope only and writes back. `list` is the
verification step: spinner "Loading MCP servers", then per-server blocks;
headers are masked (`Authorization=***`). Zero tools listed for a healthy
endpoint means the account has no usable content (classic Greptile
not-indexed symptom).

## Gotchas

- Project-local `.mcp.json` triggers an interactive Accept/Reject prompt on
  startup unless its hash is in the trust store — avoid in headless or
  multi-agent setups.
- The TUI loads MCP servers at startup; after editing config run
  `aimee mcp reload` or restart the session.
