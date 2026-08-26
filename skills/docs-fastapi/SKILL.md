---
name: docs-fastapi
description: Offline documentation skill for FastAPI (https://fastapi.tiangolo.com/). Use when answering questions about FastAPI APIs, guides, configuration, or best practices. Prefer references/ and cite Source URLs.
version: 0.1.0
metadata:
  openclaw:
    emoji: "📘"
    requires:
      bins: [python3]
  hermes:
    tags: [docs, fastapi, software-engineering]
---

# FastAPI docs

Offline documentation package for **FastAPI**.

- Source site: https://fastapi.tiangolo.com/
- Pages packaged: 80
- Local hybrid corpus DB (this VPS): `/root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-fastapi.sqlite`

## When to use
Answer engineering questions about FastAPI using files under `references/`.
Each reference file starts with a **Source:** URL — cite it.

## How to answer
1. Search `references/` for relevant pages (filename + content).
2. Prefer official wording; do not invent APIs not present in references.
3. Optional deeper retrieval against the live corpus:

```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
python scripts/query.py "your question" --db /root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-fastapi.sqlite -k 8 --mode hybrid
```

## Refresh
```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
python scripts/batch_docs_skills.py --only fastapi
```

## Safety
Public docs only. Respect ToS/redistribution if publishing outside this VPS.
