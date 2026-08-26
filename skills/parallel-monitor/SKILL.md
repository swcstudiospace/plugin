---
name: parallel-monitor
description: >-
  Parallel Monitor API — continuous web change tracking with scheduled queries
  and webhooks (event streams / snapshot monitors). Not for historical research.
version: 1.0.0
metadata:
  hermes:
    tags: [parallel, monitor, webhooks, alerts, tracking]
---

# parallel-monitor

**Docs:** https://docs.parallel.ai/monitor-api/monitor-quickstart  
**Create:** `POST /v1/monitors` (fallback `/v1alpha/monitors`)  
**Auth:** `x-api-key`

## When to use
- Ongoing signals: funding, exec changes, pricing, regulatory updates
- Webhook push into your systems (no DIY cron + dedupe)

**Not for:** one-shot historical research → Task / Responses.

## Frequencies
`1h` | `1d` (default sweet spot) | `1w`  
Processors: `lite` (default) | `base` (harder queries, higher cost)

## Query style
| Avoid | Prefer |
|-------|--------|
| Boolean keyword soup | Intentful NL: “Parallel Web Systems funding or launch announcements” |
| “All news since 2020” | Forward-looking topic without fake history windows |

## Run
```bash
source /root/.config/parallel/api.env

# Preview body only
python3 /root/agent-skills/parallel-monitor/scripts/monitor.py create \
  "AI startup funding announcements" --dry-run-body

# Create (prefer with your webhook)
python3 /root/agent-skills/parallel-monitor/scripts/monitor.py create \
  "Parallel Web Systems product launches" \
  --frequency 1d --processor lite \
  --webhook-url "https://example.com/hooks/parallel"

python3 /root/agent-skills/parallel-monitor/scripts/monitor.py list
python3 /root/agent-skills/parallel-monitor/scripts/monitor.py get MONITOR_ID
python3 /root/agent-skills/parallel-monitor/scripts/monitor.py cancel MONITOR_ID
```

## Best practices
1. Always set a **webhook** in production.
2. **Cancel** unused monitors to stop spend.
3. Snapshot monitors need a baseline Task run — see docs quickstart-snapshot.
4. Don’t create monitors in tight agent loops.

## Offline references
`parallel-web` → `references/*Monitor*`
