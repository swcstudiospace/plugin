---
name: docs-kubernetes
description: Offline documentation skill for Kubernetes (https://kubernetes.io/docs/home/). Use when answering questions about Kubernetes APIs, guides, configuration, or best practices. Prefer references/ and cite Source URLs.
version: 0.1.0
metadata:
  openclaw:
    emoji: "📘"
    requires:
      bins: [python3]
  hermes:
    tags: [docs, kubernetes, software-engineering]
---

# Kubernetes docs

Offline documentation package for **Kubernetes**.

- Source site: https://kubernetes.io/docs/home/
- Pages packaged: 80
- Local hybrid corpus DB (this VPS): `/root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-kubernetes.sqlite`

## When to use
Answer engineering questions about Kubernetes using files under `references/`.
Each reference file starts with a **Source:** URL — cite it.

## How to answer
1. Search `references/` for relevant pages (filename + content).
2. Prefer official wording; do not invent APIs not present in references.
3. Optional deeper retrieval against the live corpus:

```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
python scripts/query.py "your question" --db /root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-kubernetes.sqlite -k 8 --mode hybrid
```

## Refresh
```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
python scripts/batch_docs_skills.py --only kubernetes
```

## Safety
Public docs only. Respect ToS/redistribution if publishing outside this VPS.
