---
name: remote-mcp-wiring
description: Wire hosted MCP servers into any agent CLI via .mcp.json.
version: 1.0.0
metadata:
  hermes:
    tags: [mcp, integrations, configuration, aimee]
---

# Remote MCP wiring for agent CLIs

Class-level procedure for connecting an agent CLI to third-party SaaS via
their hosted MCP servers. Validated end-to-end 2026-08-23 against GitHub,
Linear, and Greptile from the Aimee Codes CLI.

## Workflow

1. **Check native support before proposing code.** Most agent CLIs already
   ship an MCP client. Search the tree for the client implementation
   (`mcp_client.rs` in Aimee) and the config loader before concluding "we
   have nowhere to build this". The task is almost always configuration,
   not a connector project.
2. **Probe each endpoint live with curl BEFORE writing config.** Initialize
   handshake (streamable) or `ping` (plain) proves URL + auth header shape
   in one round trip. This beats docs: docs lag transport migrations (see
   Pitfalls). Recipe in `references/endpoints.md`.
3. **Choose scope deliberately.**
   - *User scope* (`<base_path>/.mcp.json`) — no startup trust prompt,
     applies to every project. Default choice for personal API keys.
   - *Project scope* (`$PWD/.mcp.json`) — team-shareable but triggers an
     interactive Accept/Reject gate whose hash is stored in
     `<base_path>/.mcp_trust.json`; any later edit re-prompts. NEVER use
     when the working tree is shared with another automated agent
     (keys would sit in a committed-adjacent file others touch).
4. **Write config with the right auth mode.** For static bearer/API tokens
   set `"oauth": false` — otherwise auto-detect treats any 401 as a signal
   to start an interactive OAuth browser flow. Header values accept
   Handlebars templates `{{.env.VAR_NAME}}` resolved from process env;
   plain literals work too. Known-good skeleton:
   `templates/user-mcp-config.example.json`.
5. **Verify by enumerating tools, not just connecting.** In Aimee:
   `aimee mcp list` actually connects to every server and lists each
   tool (`--porcelain` for one line per server). A green connect with zero
   tools is a failure state (e.g. Greptile with no indexed repos).
6. **Lock down and confirm authorization.**
   `chmod 600 <config>`; then confirm the credential can see the actual
   resources (auth ≠ authorization): for GitHub check `GET /user` +
   repo-level `permissions` via REST with the same token.
7. **Restart or reload.** Long-running TUI sessions load MCP config at
   startup — run `aimee mcp reload` or restart before expecting the tools
   in-session.

## Pitfalls

- **Legacy SSE paths die silently.** Linear's `https://mcp.linear.app/sse`
  returns 404; only the streamable `/mcp` path works. Probe the exact URL
  you will configure.
- **Auth success ≠ resource access.** A valid PAT can still lack repo
  scopes. Verify permissions against the target repo, not just token
  identity.
- **Keys in shared trees.** If a second autonomous agent edits the repo,
  project-local config puts secrets in contested files. User-scope config
  outside every git tree avoids both the trust prompt and the collision.
- **web_search outages (provider credit exhaustion).** Don't block on it —
  direct curl probes against documented URLs are faster AND stronger
  evidence than search snippets.
- **Templating syntax is mustache-flavored** (`{{.env.VAR}}`), not
  `${VAR}`. The latter passes through literally and leaks a broken header.

## References

- `references/endpoints.md` — verified endpoint/auth matrix for GitHub,
  Linear, Greptile MCP + curl probe recipes.
- `references/aimee-cli.md` — Aimee-specific: config paths, base_path
  resolution, `aimee mcp` subcommands, header templating internals.
- `templates/user-mcp-config.example.json` — copy-paste starter config.

## Overlap note

Distinct from `openclaw-mcp-connectors` (builds MCP ingress INTO OpenClaw);
this skill consumes hosted MCP servers from a client CLI.
