---
name: parallel-task
description: >-
  Parallel Task API — deep research / structured enrichment with processors
  (lite→ultra), task specs, citations and research basis. Async create + result.
version: 1.0.0
metadata:
  hermes:
    tags: [parallel, task, deep-research, enrichment, structured-output]
---

# parallel-task

**Docs:** https://docs.parallel.ai/task-api/task-quickstart  
**Create:** `POST /v1/tasks/runs`  
**Result:** `GET /v1/tasks/runs/{run_id}/result`  
**Auth:** `x-api-key`

## When to use
- Structured enrichment (“founding year + funding for Stripe”)
- Deep multi-source research reports with citations
- Repeatable research workflows (task_spec + processor tier)

**Not for:** sub-minute Q&A → `parallel-responses`; pure URL fetch → Extract; entity lists → FindAll.

## Processors (increasing depth/cost)
`lite` → `base` → `core` → (higher tiers per docs: `pro` / `ultra` if enabled)

Start with **`lite`** for smoke tests; use **`base`/`core`** for real research.

## Output schema patterns
| Pattern | `task_spec.output_schema` |
|---------|---------------------------|
| Plain field | `"founding year as YYYY"` |
| Markdown report | `{"type":"text","description":"…"}` |
| JSON fields | `{"type":"json","json_schema":{…}}` |
| Auto | omit or `{"type":"auto"}` |

## Run
```bash
source /root/.config/parallel/api.env

# Create only
python3 /root/agent-skills/parallel-task/scripts/task.py create "Stripe" \
  --processor lite \
  --output-schema "Founding year and HQ city"

# Create + wait for result
python3 /root/agent-skills/parallel-task/scripts/task.py create \
  "What is Parallel Web Systems?" \
  --processor lite \
  --output-schema "One-paragraph company summary" \
  --wait --timeout 300

python3 /root/agent-skills/parallel-task/scripts/task.py get RUN_ID
python3 /root/agent-skills/parallel-task/scripts/task.py result RUN_ID
```

## Python SDK
```python
from parallel import Parallel
client = Parallel(api_key=os.environ["PARALLEL_API_KEY"])
run = client.task_run.create(
    input="Stripe",
    task_spec={"output_schema": "Founding year and total funding"},
    processor="base",
)
result = client.task_run.result(run.run_id, api_timeout=3600)
```

## Best practices
1. Prefer **specific output schemas** over open-ended essays when you need structure.
2. Use webhooks/SSE for production fleets; CLI poll is fine for agent one-shots.
3. Read **research basis** / citations before trusting numbers.
4. Task Groups for batch enrichment — see docs `Task Group` references.

## Offline references
`parallel-web` → `references/*Task*`, Deep Research / Enrichment quickstarts.
