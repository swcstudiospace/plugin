---
name: parallel-common
description: >-
  Shared Parallel Web Systems client (auth, HTTP, polling). Load with any
  parallel-* API skill. PARALLEL_API_KEY required for live calls.
version: 1.0.0
metadata:
  hermes:
    tags: [parallel, api, auth, shared]
---

# parallel-common

Shared library for all **Parallel** API skills on this VPS.

## Auth
```bash
# Preferred
export PARALLEL_API_KEY="..."   # platform.parallel.ai

# Also auto-loaded (mode 600):
#   /root/.config/parallel/api.env
#   /root/.hermes/.env
```

**Never print or commit the key.**

## Base URL
`https://api.parallel.ai` (override with `PARALLEL_API_BASE`)

## Headers
| Surface | Auth header |
|---------|-------------|
| Search, Extract, Tasks, FindAll, Monitor | `x-api-key: $PARALLEL_API_KEY` |
| Responses, Chat Completions | `Authorization: Bearer $PARALLEL_API_KEY` |

## Client module
```bash
python3 /root/agent-skills/parallel-common/scripts/client.py  # import-only helper
# Skills import: from client import request, load_api_key, print_json, poll_until
```

## Rate limits (defaults)
| Product | Default |
|---------|---------|
| Search / Extract / Entity Search | 600/min |
| Tasks create | 2000/min |
| Chat | 300/min |
| FindAll create | 300/hour |
| Monitor create | 300/min |

GET/status polls usually do not count as create quotas.

## Sibling skills
`parallel-web` (docs corpus), `parallel-search`, `parallel-extract`, `parallel-task`,
`parallel-findall`, `parallel-monitor`, `parallel-responses`, `parallel-chat`
