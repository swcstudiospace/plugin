---
name: parallel-findall
description: >-
  Parallel FindAll + Entity Search — web-scale entity discovery (companies/people)
  with match conditions and enrichment; fast entity-search for low-latency lists.
version: 1.0.0
metadata:
  hermes:
    tags: [parallel, findall, entity-search, leads, companies, people]
---

# parallel-findall

**Docs:** https://docs.parallel.ai/findall-api/findall-quickstart  
**Beta:** FindAll endpoints under `/v1beta/findall/…`  
**Auth:** `x-api-key`

## Two modes
| Mode | Use when | Latency |
|------|----------|---------|
| **Entity Search** | Fast people/company list, recall over precision | seconds |
| **FindAll run** | Precision match + optional enrichments + citations | async (minutes) |

## Workflow (FindAll)
1. **Ingest** NL → schema (`entity_type`, `match_conditions`)
2. **Run** generator
3. **Poll** status
4. **Result** candidate snapshot (`matched` / `unmatched`)
5. Optional **enrich** matched candidates via Task orchestration

## Run
```bash
source /root/.config/parallel/api.env

# Fast entity search
python3 /root/agent-skills/parallel-findall/scripts/findall.py entity-search \
  "AI infrastructure startups that raised Series B in 2025"

# Schema only
python3 /root/agent-skills/parallel-findall/scripts/findall.py ingest \
  "FindAll portfolio companies of Khosla Ventures founded after 2020"

# Full run (may take long / cost more — avoid --wait unless intentional)
python3 /root/agent-skills/parallel-findall/scripts/findall.py run \
  "FindAll YC W24 AI companies in SF" 
# add --wait --timeout 900 only for deliberate jobs
```

## Best practices
1. Prefer **Entity Search** when the agent only needs a shortlist quickly.
2. Write match conditions as clear natural language constraints.
3. Filter result snapshot on `match_status == matched`.
4. Enrich only after match — don’t pay to enrich unmatched candidates.
5. Create quota is **300 FindAll runs/hour** (default) — don’t spam.

## Offline references
`parallel-web` → `references/*FindAll*`, `*Entity-Search*`
