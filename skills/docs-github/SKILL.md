---
name: docs-github
description: Offline documentation skill for GitHub Docs (https://docs.github.com/en). Use when answering questions about GitHub Docs APIs, guides, configuration, or best practices. Prefer references/ and cite Source URLs.
version: 0.1.0
metadata:
  openclaw:
    emoji: "📘"
    requires:
      bins: [python3]
  hermes:
    tags: [docs, github, software-engineering]
---

# GitHub Docs docs

Offline documentation package for **GitHub Docs**.

- Source site: https://docs.github.com/en
- Pages packaged: 78
- Local hybrid corpus DB (this VPS): `/root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-github.sqlite`

## When to use
Answer engineering questions about GitHub Docs using files under `references/`.
Each reference file starts with a **Source:** URL — cite it.

## How to answer
1. Search `references/` for relevant pages (filename + content).
2. Prefer official wording; do not invent APIs not present in references.
3. Optional deeper retrieval against the live corpus:

```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
python scripts/query.py "your question" --db /root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-github.sqlite -k 8 --mode hybrid
```

## Refresh
```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
python scripts/batch_docs_skills.py --only github
```

## Safety
Public docs only. Respect ToS/redistribution if publishing outside this VPS.
