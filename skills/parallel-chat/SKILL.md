---
name: parallel-chat
description: >-
  Parallel Chat Completions API (beta) — OpenAI Chat Completions compatible
  research chat (models: speed, lite, base, core).
version: 1.0.0
metadata:
  hermes:
    tags: [parallel, chat, completions, beta]
---

# parallel-chat

**Docs:** https://docs.parallel.ai/chat-api/chat-quickstart  
**Endpoint:** `POST https://api.parallel.ai/v1beta/chat/completions`  
**Auth:** `Authorization: Bearer $PARALLEL_API_KEY`

## Models
| Model | Role |
|-------|------|
| `speed` | Fast conversational / light research |
| `lite` / `base` / `core` | Research-grade (basis/citations; slower, costlier) |

Prefer **`parallel-responses`** for new “one-shot researched answer” tools unless you specifically need Chat Completions shape.

## Run
```bash
source /root/.config/parallel/api.env
python3 /root/agent-skills/parallel-chat/scripts/chat.py \
  "Summarize what Parallel Search API is for" \
  --model speed
```

## Best practices
1. Beta — pin behavior with tests; schemas may change.
2. For production research Q&A, **Responses** is usually the better fit.
3. Rate limit default: **300/min** creates.

## Offline references
`parallel-web` → `references/*Chat*`
