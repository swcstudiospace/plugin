---
name: parallel-search
description: >-
  Parallel Search API — natural-language web search returning LLM-ready excerpts.
  Use for agent grounding, multi-query research, or replacing keyword SERP calls.
version: 1.0.0
metadata:
  hermes:
    tags: [parallel, search, web-search, grounding]
---

# parallel-search

**Docs:** https://docs.parallel.ai/search/search-quickstart  
**Endpoint:** `POST https://api.parallel.ai/v1/search`  
**Auth:** `x-api-key`

## When to use
- Need web evidence / excerpts for an LLM (not a full synthesized report)
- Broad or multi-faceted objectives (“what shipped”, “competitors”, “pricing changes”)
- Prefer **one** call with `objective` + optional `search_queries` over many keyword searches

**Not for:** people/company entity lists → use `parallel-findall` entity-search; long reports → `parallel-task` or `parallel-responses`.

## Run (this VPS)
```bash
source /root/.config/parallel/api.env  # or export PARALLEL_API_KEY
python3 /root/agent-skills/parallel-search/scripts/search.py \
  "Find latest Parallel Web Systems product announcements" \
  -q "Parallel Web Systems" -q "Parallel AI Search API"
```

## cURL
```bash
curl https://api.parallel.ai/v1/search \
  -H "Content-Type: application/json" \
  -H "x-api-key: $PARALLEL_API_KEY" \
  -d '{
    "objective": "…",
    "search_queries": ["…", "…"]
  }'
```

## Python SDK
```python
from parallel import Parallel
import os
client = Parallel(api_key=os.environ["PARALLEL_API_KEY"])
search = client.search(objective="…", search_queries=["…"])
```

## Best practices
1. Write **intent-heavy** objectives, not boolean keyword soup.
2. Add 1–5 focused `search_queries` when you know good anchors.
3. Cap what you pass to the model: titles + top excerpts first.
4. Offline deep dives: query corpus  
   `python /root/.openclaw/workspace/projects/docs-scraper/scripts/query.py "Search modes" --db …/parallel-web.sqlite -k 5 --mode hybrid`

## Offline references
See `parallel-web` skill `references/*Search*` (quickstart, modes, best practices, API ref).
