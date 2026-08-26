---
name: docs-nodejs
description: Offline documentation skill for Node.js (https://nodejs.org/api/). Use when answering questions about Node.js APIs, guides, configuration, or best practices. Prefer references/ and cite Source URLs.
version: 0.1.0
metadata:
  openclaw:
    emoji: "📘"
    requires:
      bins: [python3]
  hermes:
    tags: [docs, nodejs, software-engineering]
---

# Node.js docs

Offline documentation package for **Node.js**.

- Source site: https://nodejs.org/api/
- Pages packaged: 70
- Local hybrid corpus DB (this VPS): `/root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-nodejs.sqlite`

## When to use
Answer engineering questions about Node.js using files under `references/`.
Each reference file starts with a **Source:** URL — cite it.

## How to answer
1. Search `references/` for relevant pages (filename + content).
2. Prefer official wording; do not invent APIs not present in references.
3. Optional deeper retrieval against the live corpus:

```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
python scripts/query.py "your question" --db /root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-nodejs.sqlite -k 8 --mode hybrid
```

## Refresh
```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
python scripts/batch_docs_skills.py --only nodejs
```

## Safety
Public docs only. Respect ToS/redistribution if publishing outside this VPS.
