---
name: docs-cloudflare
description: Offline documentation skill for Cloudflare Developers (https://developers.cloudflare.com/). Use when answering questions about Cloudflare Developers APIs, guides, configuration, or best practices. Prefer references/ and cite Source URLs.
version: 0.1.0
metadata:
  openclaw:
    emoji: "📘"
    requires:
      bins: [python3]
  hermes:
    tags: [docs, cloudflare, software-engineering]
---

# Cloudflare Developers docs

Offline documentation package for **Cloudflare Developers**.

- Source site: https://developers.cloudflare.com/
- Pages packaged: 80
- Local hybrid corpus DB (this VPS): `/root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-cloudflare.sqlite`

## When to use
Answer engineering questions about Cloudflare Developers using files under `references/`.
Each reference file starts with a **Source:** URL — cite it.

## How to answer
1. Search `references/` for relevant pages (filename + content).
2. Prefer official wording; do not invent APIs not present in references.
3. Optional deeper retrieval against the live corpus:

```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
python scripts/query.py "your question" --db /root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-cloudflare.sqlite -k 8 --mode hybrid
```

## Refresh
```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
python scripts/batch_docs_skills.py --only cloudflare
```

## Safety
Public docs only. Respect ToS/redistribution if publishing outside this VPS.
