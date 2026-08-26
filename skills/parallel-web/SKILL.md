---
name: parallel-web
description: >-
  Parallel Web Systems umbrella: offline docs corpus + map of all Parallel API
  skills (Search, Extract, Task, FindAll, Monitor, Responses, Chat). Load for
  product overview, pricing/limits, or when unsure which Parallel API to use.
version: 1.1.0
metadata:
  openclaw:
    emoji: "⚡"
    requires:
      bins: [python3]
  hermes:
    tags: [parallel, web-search, extract, research, api, findall, monitor, umbrella]
---

# parallel-web (umbrella)

State-of-the-art Parallel stack on this VPS: **offline docs** + **live API skills**.

## Choose an API
| Need | Skill | Script |
|------|-------|--------|
| Web excerpts for grounding | **parallel-search** | `scripts/search.py` |
| URL → markdown/excerpts | **parallel-extract** | `scripts/extract.py` |
| Deep research / structured enrichment | **parallel-task** | `scripts/task.py` |
| Entity lists (companies/people) | **parallel-findall** | `scripts/findall.py` |
| Continuous change alerts | **parallel-monitor** | `scripts/monitor.py` |
| Fast cited Q&A (~5–60s) | **parallel-responses** | `scripts/responses.py` |
| OpenAI Chat Completions shape | **parallel-chat** | `scripts/chat.py` |
| Shared auth client | **parallel-common** | `scripts/client.py` |

## Auth
```bash
export PARALLEL_API_KEY="..."   # or source /root/.config/parallel/api.env
# also loaded from /root/.hermes/.env
```
Never commit or print the key. Header: **`x-api-key`** for most REST; **Bearer** for Responses/Chat.

## Offline corpus (docs.parallel.ai)
```bash
cd /root/.openclaw/workspace/projects/docs-scraper && source .venv/bin/activate
DB=data/db/parallel-web.sqlite
python scripts/query.py "your question" --db "$DB" -k 8 --mode hybrid
python scripts/stats.py --db "$DB"
```
Skill package `references/` holds ~200 markdown pages with Source URLs (see `README.md` index).

## Typical agent pipelines
1. **Ground then answer:** Search → (optional Extract on top URLs) → model synthesis  
2. **One-shot researched answer:** Responses (`effort=low|medium|high`)  
3. **Structured CRM enrich:** Task with JSON `output_schema`  
4. **Market map:** FindAll ingest/run → filter matched → enrich  
5. **Watch topic:** Monitor + webhook  

## Rate limits (defaults)
Search/Extract 600/min · Tasks 2000/min · Chat 300/min · FindAll 300/hour · Monitor 300/min  
(GET polls generally free of create quotas.)

## Install layout
```text
/root/agent-skills/
  parallel-web/          # this umbrella + references/
  parallel-common/
  parallel-search|extract|task|findall|monitor|responses|chat/
```

## Rebuild docs export
```bash
cd /root/.openclaw/workspace/projects/docs-scraper && source .venv/bin/activate
python scripts/crawl.py --config configs/parallel-web.yaml --resume --embed
python scripts/export_skill.py --db data/db/parallel-web.sqlite \
  --name parallel-web --max-pages 200 --out-dir data/exports/skills
# re-apply this SKILL.md umbrella overlay after export if overwritten
```
