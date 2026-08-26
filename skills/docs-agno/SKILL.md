---
name: docs-agno
description: Offline documentation skill for Agno (https://docs.agno.com/). Use for Agno agents, teams, workflows, AgentOS, models, tools, memory, knowledge, database, deploy, and API reference.
version: 1.0.0
metadata:
  hermes:
    tags: [docs, agno, agents, agentos, workflows]
---

# docs-agno

Offline corpus of **[Agno](https://docs.agno.com/)** public docs (SDK + AgentOS + Control Plane).

## When to use
- Building/running Agno `Agent`, `Team`, `Workflow`
- AgentOS (FastAPI runtime, interfaces, auth, tracing, MCP)
- Models, tools, knowledge, memory, database providers
- Deploy, evals, multimodal, HITL, guardrails

## How to answer
1. Prefer files under `references/` and cite the **Source:** URL in each file.
2. For broader recall, query the SQLite corpus:
   ```bash
   cd /root/.openclaw/workspace/projects/docs-scraper && source .venv/bin/activate
   python scripts/query.py "your question" --db data/db/skills/docs-agno.sqlite -k 8 --mode fts
   ```
3. Do **not** invent APIs missing from references/corpus.

## Corpus stats
- Source: https://docs.agno.com/ (Mintlify)
- Full DB: `data/db/skills/docs-agno.sqlite` (~5k pages; FTS indexed)
- Skill package references: curated core pages (examples tree mostly stays in DB only)
- Scraped: 2026-08-07
- Excluded from index as too large: `/llms-full.txt`, `/reference-api/openapi.yaml`

## Notes
- Docs site has ~3.9k sitemap URLs; crawl also followed llms links (duplicates with/without `.md` may exist).
- Live docs may change; re-crawl with `python scripts/crawl.py --config configs/agno-docs.yaml --resume` or fresh DB.
