# Verified remote MCP endpoints (2026-08-23)

All probed live with curl and confirmed working through `aimee mcp list`.
Re-probe if a connection fails — hosted MCP endpoints migrate transports
without notice.

## Endpoint / auth matrix

| Server   | URL | Auth header | Verified tools |
|----------|-----|-------------|----------------|
| GitHub   | `https://api.githubcopilot.com/mcp` | `Authorization: Bearer <classic PAT ghp_…>` | 44 (issues, PRs, reviews, search, files, releases, teams) |
| Linear   | `https://mcp.linear.app/mcp` | `Authorization: Bearer lin_api_…` | 58 (issues CRUD, comments, projects, teams, cycles, milestones, labels) |
| Greptile | `https://api.greptile.com/mcp` | `Authorization: Bearer skp…` (keys from app.greptile.com/settings/organization/api) | 16 (PR review/query surface; empty results until repos are indexed at app.greptile.com) |

## Curl probe recipes

Streamable HTTP servers speak JSON-RPC over POST. Two shapes:

**Initialize handshake** (GitHub, Linear — proves URL + auth + protocol):

```bash
curl -sS -X POST https://api.githubcopilot.com/mcp \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"probe","version":"0.1.0"}}}'
```

Expect HTTP 200 with an SSE-framed `event: message` containing serverInfo.

**Plain ping** (Greptile):

```bash
curl -sS -X POST https://api.greptile.com/mcp \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"ping"}'
```

Expect `{"jsonrpc":"2.0","id":1,"result":{}}`.

## Findings that cost a round trip

- Linear's legacy SSE endpoint `https://mcp.linear.app/sse` returns **404**
  (checked 2026-08-23). Only the streamable `/mcp` path exists.
- GitHub's remote MCP accepts a classic PAT (`ghp_…`) directly as the
  bearer token — no OAuth dance needed for personal use. Confirm the PAT's
  reach separately via REST:
  `curl https://api.github.com/user -H "Authorization: Bearer $PAT"` for
  identity, then `GET /repos/<owner>/<repo>` → `.permissions` for what it
  can actually do on the target repo (auth ≠ authorization).
