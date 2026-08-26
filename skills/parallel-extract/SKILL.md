---
name: parallel-extract
description: >-
  Parallel Extract API — turn public URLs (HTML/JS/PDF) into clean markdown or
  objective-focused excerpts for LLMs.
version: 1.0.0
metadata:
  hermes:
    tags: [parallel, extract, markdown, scrape, url]
---

# parallel-extract

**Docs:** https://docs.parallel.ai/extract/extract-quickstart  
**Endpoint:** `POST https://api.parallel.ai/v1/extract`  
**Auth:** `x-api-key`

## When to use
- You already have URLs and need LLM-ready content
- JS-heavy pages or PDFs that plain `curl` can’t parse well
- Want excerpts aligned to an `objective` (cheaper/context-efficient)

**Not for:** discovering which URLs matter → Search first; continuous watch → Monitor.

## Run
```bash
source /root/.config/parallel/api.env
python3 /root/agent-skills/parallel-extract/scripts/extract.py \
  "https://docs.parallel.ai/getting-started/overview" \
  -o "What products does Parallel offer?"
```

## cURL
```bash
curl https://api.parallel.ai/v1/extract \
  -H "Content-Type: application/json" \
  -H "x-api-key: $PARALLEL_API_KEY" \
  -d '{
    "urls": ["https://example.com/page"],
    "objective": "Key pricing facts"
  }'
```

## Best practices
1. Always pass a tight `objective` when you don’t need the whole page.
2. Batch related URLs in one call when possible.
3. Respect site ToS / robots for redistribution; Extract is for agent consumption.
4. Pipeline: Search → pick URLs → Extract → reason.

## Offline references
`parallel-web` → `references/*Extract*`
