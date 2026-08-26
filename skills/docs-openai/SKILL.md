---
name: docs-openai
description: Offline documentation skill for OpenAI / Developers (https://developers.openai.com/docs/). Use when answering questions about OpenAI / Developers APIs, guides, configuration, or best practices. Prefer references/ and cite Source URLs.
version: 0.1.0
metadata:
  openclaw:
    emoji: "📘"
    requires:
      bins: [python3]
  hermes:
    tags: [docs, openai, software-engineering]
---

# OpenAI / Developers docs

Offline documentation package for **OpenAI / Developers**.

- Source site: https://developers.openai.com/docs/
- Pages packaged: 80
- Local hybrid corpus DB (this VPS): `/root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-openai.sqlite`

## When to use
Answer engineering questions about OpenAI / Developers using files under `references/`.
Each reference file starts with a **Source:** URL — cite it.

## How to answer
1. Search `references/` for relevant pages (filename + content).
2. Prefer official wording; do not invent APIs not present in references.
3. Optional deeper retrieval against the live corpus:

```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
python scripts/query.py "your question" --db /root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-openai.sqlite -k 8 --mode hybrid
```

## Refresh
```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
python scripts/batch_docs_skills.py --only openai
```

## Safety
Public docs only. Respect ToS/redistribution if publishing outside this VPS.
