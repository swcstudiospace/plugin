# MCP connectors & secrets — GitHub / Linear / Greptile

How `/master` (and any prompt that reads issues/PRs) reaches external systems.
All auth shapes below were **verified live 2026-08-24** (curl status codes) on
srv1778002 against the real endpoints.

## Where credentials live (two places, different jobs)

| File | Holds | Consumed by |
|---|---|---|
| `~/.forge/.mcp.json` | Per-server HTTP `headers.Authorization` (`oauth: false`) | MCP tool calls (`mcp_github_tool_*`, `mcp_linear_tool_*`, `mcp_greptile_tool_*`) |
| `~/.config/aimee/secrets.env` (mode 600) | `LINEAR_API_KEY`, `GREPTILE_API_KEY` env vars | In-process GraphQL/API fallbacks in `crates/aimee_main/src/ui.rs` (`file_linear_graphql`, loaded by `load_aimee_secrets()` at startup) |

Fixing one does not fix the other: the Linear GraphQL fallback and the Linear
MCP server authenticate independently. Project-local `.mcp.json` (cwd or base
path, see `aimee_domain/src/env.rs`) merges over the user-level file.

## Connector inventory (user-level `~/.forge/.mcp.json`)

- `github` → `https://api.githubcopilot.com/mcp` (~44 tools) — `Authorization: Bearer ghp_…`
- `linear` → `https://mcp.linear.app/mcp` (~58 tools) — `Authorization: Bearer lin_api_…`
- `greptile` → `https://api.greptile.com/mcp` (~16 tools) — `Authorization: Bearer sk_…` (Greptile API key, not OpenAI)

## Auth shapes (verified)

- **Linear MCP requires the `Bearer ` prefix.** Raw `lin_api_…` → HTTP 401;
  `Bearer lin_api_…` → 200. Do not "fix" a working entry by stripping the prefix.
- GitHub Copilot MCP and Greptile MCP both take standard `Bearer <key>` headers
  with `"oauth": false`. The GitHub PAT also validates directly against
  `https://api.github.com/user` (200) — useful to confirm a key is alive
  independent of the MCP layer.
- Linear's classic GraphQL (`https://api.linear.app/graphql`) takes the **raw**
  key with no prefix (200) — opposite convention from its MCP endpoint.

## Diagnostic: tool listing ≠ auth health

`aimee mcp list` showed healthy tool counts (44/58/16) **while every GitHub
tool call failed auth**. Remote MCP servers hand out their tool manifests to
unauthenticated clients; authentication happens per tool call. So:

1. A green `mcp list` proves connectivity only, never auth.
2. To prove auth end-to-end, make a real cheap call through the CLI (e.g. a
   single-issue Linear read or a PR read) — not just reload + list.
3. `initialize` probe over curl (needs `Accept: application/json,
   text/event-stream` alongside Content-Type JSON) returns 200 even for valid
   auth on some servers — prefer a genuine tool call as the oracle.

## Known failure mode: stored token is itself a redaction artifact

Found in the wild: the github entry's Authorization value was literally
`Bearer ghp_nM...9bGH` — a previous redaction pass was saved over the real PAT.
Symptom signature: exactly one server fails all tool calls while its listing
looks fine and sibling servers work. When you see that, read the config file
directly (redact before echoing anywhere) and check whether the stored value is
a truncation rather than a wrong-but-complete key.

## Applying new/rotated keys

1. Edit `~/.forge/.mcp.json` (keep mode 600; keep `oauth: false`).
2. Update `~/.config/aimee/secrets.env` for LINEAR/GREPTILE fallback parity.
3. `aimee mcp reload`.
4. Prove with one real tool call per repaired server.
5. Keys that transited chat should be rotated afterward; drop replacements into
   the same two files.

Hermes workflow note: terminal commands that embed a raw credential trigger the
security-scan approval gate. If the approval prompt times out, stop and ask the
user — never retry the same command or a rephrased variant (the runtime treats
that as circumventing consent).

## `/master` data-source contract

From `commands/master.md`: Linear reads go through `mcp_linear_tool_list_issues`
(**requires explicit filters**, e.g. `{"team": "SWC", "limit": N}` — empty args
return empty results), `mcp_linear_tool_get_issue`, `mcp_linear_tool_save_comment`;
GitHub reads/writes through `mcp_github_tool_list_pull_requests`,
`mcp_github_tool_pull_request_read`, `mcp_github_tool_issue_read`,
`mcp_github_tool_create_pull_request`. If those tools error with auth failures,
work this reference top-down: config file first, then secrets.env, then probes.
