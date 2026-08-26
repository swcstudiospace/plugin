---
name: parallel-responses
description: >-
  Parallel Responses API — OpenAI Responses-compatible endpoint that answers
  with live web research + citations in ~5–60s (reasoning.effort low|medium|high).
version: 1.0.0
metadata:
  hermes:
    tags: [parallel, responses, research, openai-compatible, citations]
---

# parallel-responses

**Docs:** https://docs.parallel.ai/responses-api/responses-quickstart  
**Endpoint:** `POST https://api.parallel.ai/v1/responses`  
**Auth:** `Authorization: Bearer $PARALLEL_API_KEY`  
**Model:** `parallel` only; tier via `reasoning.effort`

## Effort tiers
| effort | Latency | Use |
|--------|---------|-----|
| `low` | ~5–10s | Simple facts |
| `medium` | ~15–20s | Multi-hop (default) |
| `high` | ~30–60s | Deep synthesis (raise client timeout) |

Grounding is **automatic** — do not pass OpenAI `web_search` tools.

## When to use
- One question → one cited answer for an agent tool/subagent
- OpenAI Responses migration (swap base_url + key + model)

**Not for:** bulk URL markdown → Extract; structured multi-field enrichment → Task.

## Run
```bash
source /root/.config/parallel/api.env
python3 /root/agent-skills/parallel-responses/scripts/responses.py \
  "Who is the current CEO of the largest cloud provider by revenue?" \
  --effort low
```

## OpenAI SDK
```python
from openai import OpenAI
import os
client = OpenAI(api_key=os.environ["PARALLEL_API_KEY"], base_url="https://api.parallel.ai/v1")
r = client.responses.create(
    model="parallel",
    input="…",
    reasoning={"effort": "low"},
)
print(r.output_text)
```

## Best practices
1. Default agents to **`low`** unless quality needs more research.
2. Use as a **research subagent tool**: one complete question in, answer out.
3. Structured outputs: see docs Responses structured-outputs reference.

## Offline references
`parallel-web` → `references/*Responses*`
