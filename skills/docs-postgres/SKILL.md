---
name: docs-postgres
description: Offline documentation skill for PostgreSQL (https://www.postgresql.org/docs/current/). Use when answering questions about PostgreSQL APIs, guides, configuration, or best practices. Prefer references/ and cite Source URLs.
version: 0.1.0
metadata:
  openclaw:
    emoji: "📘"
    requires:
      bins: [python3]
  hermes:
    tags: [docs, postgres, software-engineering]
---

# PostgreSQL docs

Offline documentation package for **PostgreSQL**.

- Source site: https://www.postgresql.org/docs/current/
- Pages packaged: 80
- Local hybrid corpus DB (this VPS): `/root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-postgres.sqlite`

## When to use
Answer engineering questions about PostgreSQL using files under `references/`.
Each reference file starts with a **Source:** URL — cite it.

## How to answer
1. Search `references/` for relevant pages (filename + content).
2. Prefer official wording; do not invent APIs not present in references.
3. Optional deeper retrieval against the live corpus:

```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
python scripts/query.py "your question" --db /root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-postgres.sqlite -k 8 --mode hybrid
```

## Refresh
```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
python scripts/batch_docs_skills.py --only postgres
```

## Safety
Public docs only. Respect ToS/redistribution if publishing outside this VPS.
