---
name: docs-scraper
description: Bulk-crawl technical documentation sites into a local agentic corpus (markdown, code blocks, images) and hybrid-query/export skills. Use when the user wants to scrape docs, build documentation skills, index API docs, or create a Firecrawl-like offline docs pipeline.
version: 0.2.1
metadata:
  openclaw:
    emoji: "📚"
    requires:
      bins:
        - python3
  hermes:
    tags: [docs, scraper, crawl, corpus, rag, skill-export, sqlite]
---

# docs-scraper

Enterprise-oriented documentation crawler shared by **OpenClaw** and **Hermes**.
Turns technical sites into a **queryable local corpus** (FTS5 + optional local vectors) and optional **exported skills**.

## Shared install (this VPS)

Canonical skill path (edit once, both apps see it):

```
~/agent-skills/docs-scraper/SKILL.md
```

Project code lives at:

```
/root/.openclaw/workspace/projects/docs-scraper/
```

Wired via:
- Hermes: `skills.external_dirs` → `/root/agent-skills` (+ symlink `~/.hermes/skills/docs-scraper`)
- OpenClaw: `skills.load.extraDirs` → `/root/agent-skills` (+ workspace/managed skill symlinks)

## Status
P2 complete: crawl → FTS + hybrid RRF (fastembed + sqlite-vec) → export skill. Resume + content_hash refresh + chrome strip included.

## Quick commands
```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate

python scripts/db_init.py
python scripts/crawl.py --config configs/httpbin-html.yaml
python scripts/query.py "Herman Melville"
python scripts/export_skill.py --name demo-docs --query "Melville"
python scripts/stats.py
```

### Hybrid vectors
```bash
pip install fastembed sqlite-vec   # once, if not already in venv
python scripts/embed_index.py
python scripts/query.py "how to configure a logging handler" -k 5 --mode hybrid
# modes: auto (default) | fts | vector | hybrid
```

### Real docs (polite, tiny)
```bash
python scripts/crawl.py --config configs/python-docs-tiny.yaml --max-pages 3
python scripts/query.py "logging handler" -k 5
```

### New site recipe
```bash
cp configs/source.example.yaml configs/my-docs.yaml
# edit name, root_url, allowed_prefixes, max_pages, delay_ms
python scripts/crawl.py --config configs/my-docs.yaml --max-pages 50
python scripts/embed_index.py
python scripts/export_skill.py --name my-docs --query "core topics" --max-pages 40
# Exported skill package → data/exports/skills/my-docs/
# Optional: ln -sfn .../data/exports/skills/my-docs ~/agent-skills/my-docs
```

### Resume / incremental
```bash
python scripts/crawl.py --config configs/python-docs-tiny.yaml --resume
# skip unchanged content_hash/ETag by default; force with --force-refetch
```

### Crawl4AI (optional JS)
```bash
bash scripts/bootstrap_crawl4ai.sh
python scripts/crawl.py --config configs/crawl4ai-example.yaml
```

## Safety
1. Path allowlists in YAML configs
2. robots.txt when enabled
3. Direct egress default; static DC list optional
4. No public free-proxy lists
5. Confirm redistribution rights before publishing exported skills

## Architecture pointer
See project `docs/ARCHITECTURE.md` and `docs/ROADMAP.md`.
