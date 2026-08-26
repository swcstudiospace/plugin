# Monitor Migration Guide: Alpha to GA

Source: https://docs.parallel.ai/monitor-api/monitor-migration-guide.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Monitor Migration Guide: Alpha to GA
> Migrate from the Alpha Monitor API (/v1alpha) to the GA version (/v1)

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

This guide enumerates the contract differences between the Alpha Monitor API (`/v1alpha/monitors`) and the GA version (`/v1/monitors`), and outlines the steps required to migrate.
All ongoing development targets V1. The Alpha endpoints remain reachable but receive no new features:
\* Capabilities introduced after Alpha — `snapshot` monitors, structured `output` with `basis`, `advanced\_settings.location`, and `processor` selection — are V1-only.
\* The Python and TypeScript SDKs expose typed bindings (`client.monitor.\*`) only for V1. Alpha is reachable solely via the low-level HTTP client (`client.post("/v1alpha/monitors", ...)`).
\* The [Parallel CLI](/integrations/cli) targets V1 endpoints exclusively.
## Highlights
\* \*\*Required `type` discriminant\*\* — `"event\_stream"` (default Alpha behavior) or new `"snapshot"`; determines the `settings` shape. See [Snapshot Quickstart](/monitor-api/quickstart-snapshot).
\* \*\*Nested `settings` / `advanced\_settings`\*\* — `query`, `output\_schema`, `include\_backfill` move under `settings`; `source\_policy` and the new ISO 3166-1 `location` move under `settings.advanced\_settings`. See [Advanced Settings](/monitor-api/monitor-quickstart#advanced-settings).
\* \*\*`processor` selection\*\* — Top-level `"lite"` (default) or `"base"`. `base` increases recall and breadth for harder queries, at higher cost. See [Monitor Quickstart](/monitor-api/monitor-quickstart).
\* \*\*Endpoint renames\*\* — Update → `POST /{id}/update`; Cancel → `POST /{id}/cancel`. New `POST /{id}/trigger` enqueues off-schedule one-off runs.
\* \*\*Unified events endpoint\*\* — `GET /events` supersedes both Alpha endpoints with cursor pagination and an optional `event\_group\_id` filter. See [Events](/monitor-api/monitor-events).
\* \*\*Restructured event payload\*\* — Stable `event\_id`, `event\_type` discriminator, and typed `output` with `basis` (citations, reasoning, confidence) replace the deprecated `output` string and the `result` object. See [Events](/monitor-api/monitor-events) and [Research Basis](/task-api/guides/access-research-basis).
\* \*\*V1-only SDKs and CLI\*\* — Typed `client.monitor.\*` bindings and the [Parallel CLI](/integrations/cli) target V1 exclusively.
## Overview of Changes
### Endpoints
| Operation | Alpha | V1 |
| --------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| \*\*Base path\*\* | `/v1alpha/monitors` | `/v1/monitors` |
| \*\*Create\*\* | `POST /v1alpha/monitors` | `POST /v1/monitors` |
| \*\*List (paginated)\*\* | `GET /v1alpha/monitors/list` | `GET /v1/monitors`; cursor-paginated; supports `type` and `status` query filters |
| \*\*Retrieve\*\* | `GET /v1alpha/monitors/{monitor\_id}` | `GET /v1/monitors/{monitor\_id}` |
| \*\*Update\*\* | `POST /v1alpha/monitors/{monitor\_id}` | `POST /v1/monitors/{monitor\_id}/update` |
| \*\*Cancel\*\* | `DELETE /v1alpha/monitors/{monitor\_id}` | `POST /v1/monitors/{monitor\_id}/cancel` |
| \*\*Trigger one-off run\*\* | — | `POST /v1/monitors/{monitor\_id}/trigger` |
| \*\*List events\*\* | `GET /v1alpha/monitors/{monitor\_id}/events?lookback\_period=10d` | `GET /v1/monitors/{monitor\_id}/events?cursor=&limit=&include\_completions=` |
| \*\*Single execution events\*\* | `GET /v1alpha/monitors/{monitor\_id}/event\_groups/{event\_group\_id}` | `GET /v1/monitors/{monitor\_id}/events?event\_group\_id=...` |
| \*\*Simulate event\*\* | `POST /v1alpha/monitors/{monitor\_id}/simulate\_event` | Removed; closest analogue is `POST /{monitor\_id}/trigger`, which executes a real run rather than dispatching a synthetic event |
### Create Request
| Concept | Alpha | V1 |
| --------------------------- | ------------------------------------ | ------------------------------------------------------------------------------- |
| \*\*Monitor type\*\* | implicit; search-query monitors only | `type: "event\_stream"` or `type: "snapshot"` (required) |
| \*\*Search query\*\* | top-level `query` | `settings.query` (event\\_stream only) |
| \*\*Output schema\*\* | top-level `output\_schema` | `settings.output\_schema` (event\\_stream only) |
| \*\*Backfill\*\* | top-level `include\_backfill` | `settings.include\_backfill` (event\\_stream only) |
| \*\*Source policy\*\* | top-level `source\_policy` | `settings.advanced\_settings.source\_policy` (event\\_stream only) |
| \*\*Geo (`location`)\*\* (new) | — | `settings.advanced\_settings.location` (ISO 3166-1 alpha-2, e.g. `"us"`, `"gb"`) |
| \*\*Snapshot baseline\*\* (new) | — | `settings.task\_run\_id` (snapshot only) |
| \*\*Processor\*\* (new) | — | top-level `processor: "lite" \| "base"` (defaults to `"lite"`) |
| \*\*Frequency\*\* | top-level `frequency` (`1h`–`30d`) | unchanged |
| \*\*Webhook\*\* | top-level `webhook` | unchanged |
| \*\*Metadata\*\* | top-level `metadata` | unchanged |
### Response
| Field | Alpha | V1 |
| ------------------------ | ------------------------------------------------ | ------------------------------------------------------- |
| `type` | — | new — `"event\_stream"` or `"snapshot"` |
| `query` | top-level | now at `settings.query` |
| `output\_schema` | top-level | now at `settings.output\_schema` |
| `source\_policy` | top-level | now at `settings.advanced\_settings.source\_policy` |
| `include\_backfill` | top-level | now at `settings.include\_backfill` |
| `cadence` | top-level (deprecated; `daily`/`weekly`/etc.) | removed; use `frequency` |
| `status` | `"active"` \| `"canceled"` (single-`l` spelling) | `"active"` \| `"cancelled"` (double-`l` spelling) |
| `last\_run\_at` | present | unchanged |
| `output` (snapshot only) | — | new; latest snapshot value for `type=snapshot` monitors |
### Events
V1 unifies the Alpha `MonitorEventDetail` shape into a single typed event with a stable `event\_id`, a structured `output` object, and a `basis` array carrying per-field citations, reasoning, and confidence.
| Field | Alpha | V1 |
| --------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Discriminator | `type: "event"` | `event\_type: "event\_stream" \| "snapshot"` |
| `event\_id` | — | new; stable per-event identifier; safe for idempotent client-side dedup |
| `event\_group\_id` | present | unchanged |
| `event\_date` | present | unchanged |
| `output` (string) | deprecated string field | removed |
| `result: { type, content }` | top-level (Text or JSON) | merged into `output: { type, content, basis }` |
| `source\_urls` | top-level array | removed; URLs surface via `output.basis[].citations[].url` |
| `basis` | — | new; per-field citations, reasoning, and confidence (see [Research Basis](/task-api/guides/access-research-basis)) |
Webhook event types (`monitor.event.detected`, `monitor.execution.completed`, `monitor.execution.failed`) are unchanged. The webhook payload still wraps an `event\_group\_id` to be resolved against the events endpoint.
### SDK and CLI Surface
V1 exposes typed bindings in both the Python and TypeScript SDKs and is the only version supported by the [Parallel CLI](/integrations/cli). Alpha has no typed or CLI surface — it is reachable only via the low-level HTTP client.
| Operation | Alpha (Python) | V1 (Python) |
| --------- | -------------------------------------------------- | ---------------------------------------- |
| Create | `client.post("/v1alpha/monitors", body=...)` | `client.monitor.create(...)` |
| List | `client.get("/v1alpha/monitors/list", ...)` | `client.monitor.list(...)` |
| Retrieve | `client.get("/v1alpha/monitors/{id}", ...)` | `client.monitor.retrieve(monitor\_id)` |
| Update | `client.post("/v1alpha/monitors/{id}", body=...)` | `client.monitor.update(monitor\_id, ...)` |
| Cancel | `client.delete("/v1alpha/monitors/{id}", ...)` | `client.monitor.cancel(monitor\_id)` |
| Trigger | — | `client.monitor.trigger(monitor\_id)` |
| Events | `client.get("/v1alpha/monitors/{id}/events", ...)` | `client.monitor.events(monitor\_id, ...)` |
## Migration Example
### Before (Alpha)
```bash cURL theme={"system"}
curl https://api.parallel.ai/v1alpha/monitors \
-H "Content-Type: application/json" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-d '{
"query": "AI startup funding announcements",
"frequency": "1d",
"include\_backfill": false,
"source\_policy": {
"include\_domains": ["techcrunch.com", "bloomberg.com"]
},
"webhook": {
"url": "https://example.com/webhook",
"event\_types": ["monitor.event.detected"]
},
"metadata": { "external\_id": "acme-monitor-001" }
}'
```
```python Python theme={"system"}
import os
from httpx import Response
from parallel import Parallel
client = Parallel(api\_key=os.environ["PARALLEL\_API\_KEY"])
monitor = client.post(
"/v1alpha/monitors",
cast\_to=Response,
body={
"query": "AI startup funding announcements",
"frequency": "1d",
"include\_backfill": False,
"source\_policy": {
"include\_domains": ["techcrunch.com", "bloomberg.com"],
},
"webhook": {
"url": "https://example.com/webhook",
"event\_types": ["monitor.event.detected"],
},
"metadata": {"external\_id": "acme-monitor-001"},
},
).json()
print(f"Monitor ID: {monitor['monitor\_id']}")
```
```typescript TypeScript theme={"system"}
import Parallel from "parallel-web";
const client = new Parallel({ apiKey: process.env.PARALLEL\_API\_KEY });
const monitor = (await client.post("/v1alpha/monitors", {
body: {
query: "AI startup funding announcements",
frequency: "1d",
include\_backfill: false,
source\_policy: {
include\_domains: ["techcrunch.com", "bloomberg.com"],
},
webhook: {
url: "https://example.com/webhook",
event\_types: ["monitor.event.detected"],
},
metadata: { external\_id: "acme-monitor-001" },
},
})) as { monitor\_id: string; status: string };
console.log(`Monitor ID: ${monitor.monitor\_id}`);
```
### After (V1)
```bash cURL theme={"system"}
curl https://api.parallel.ai/v1/monitors \
-H "Content-Type: application/json" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-d '{
"type": "event\_stream",
"frequency": "1d",
"processor": "lite",
"settings": {
"query": "AI startup funding announcements",
"include\_backfill": false,
"advanced\_settings": {
"source\_policy": {
"include\_domains": ["techcrunch.com", "bloomberg.com"]
},
"location": "us"
}
},
"webhook": {
"url": "https://example.com/webhook",
"event\_types": ["monitor.event.detected"]
},
"metadata": { "external\_id": "acme-monitor-001" }
}'
```
```python Python theme={"system"}
import os
from parallel import Parallel
client = Parallel(api\_key=os.environ["PARALLEL\_API\_KEY"])
monitor = client.monitor.create(
type="event\_stream",
frequency="1d",
processor="lite",
settings={
"query": "AI startup funding announcements",
"include\_backfill": False,
"advanced\_settings": {
"source\_policy": {
"include\_domains": ["techcrunch.com", "bloomberg.com"],
},
"location": "us",
},
},
webhook={
"url": "https://example.com/webhook",
"event\_types": ["monitor.event.detected"],
},
metadata={"external\_id": "acme-monitor-001"},
)
print(f"Monitor ID: {monitor.monitor\_id}")
```
```typescript TypeScript theme={"system"}
import Parallel from "parallel-web";
const client = new Parallel({ apiKey: process.env.PARALLEL\_API\_KEY });
const monitor = await client.monitor.create({
type: "event\_stream",
frequency: "1d",
processor: "lite",
settings: {
query: "AI startup funding announcements",
include\_backfill: false,
advanced\_settings: {
source\_policy: {
include\_domains: ["techcrunch.com", "bloomberg.com"],
},
location: "us",
},
},
webhook: {
url: "https://example.com/webhook",
event\_types: ["monitor.event.detected"],
},
metadata: { external\_id: "acme-monitor-001" },
});
console.log(`Monitor ID: ${monitor.monitor\_id}`);
```
## Migration Checklist
### Required changes
\* Update the base path from `/v1alpha/monitors` to `/v1/monitors`.
\* Add the `type` discriminant (`"event\_stream"` or `"snapshot"`) to every `CreateMonitorRequest`.
\* Move `query`, `output\_schema`, and `include\_backfill` from top-level into `settings`.
\* Move `source\_policy` from top-level into `settings.advanced\_settings.source\_policy`.
\* Migrate Update calls from `POST /{id}` to `POST /{id}/update`.
\* Migrate Cancel calls from `DELETE /{id}` to `POST /{id}/cancel`.
\* Replace `GET /{id}/event\_groups/{event\_group\_id}` with `GET /{id}/events?event\_group\_id=...`.
\* Replace the `lookback\_period` query parameter with cursor-based pagination (`cursor`, `limit`).
\* Update the status enum check from `"canceled"` to `"cancelled"` (double `l`).
\* Replace reads of `result.content` and `source\_urls` with `output.content` and `output.basis[].citations[].url`.
\* Drop the deprecated top-level string `output` field on event records.
### Optional enhancements
\* Set `processor: "base"` for harder queries that need higher recall and breadth.
\* Set `settings.advanced\_settings.location` to scope retrieval to a single country.
\* Replace low-level `client.post(...)` calls with `client.monitor.\*` SDK bindings.
\* Use `event\_id` for idempotent client-side dedup across pagination and webhook retries.
\* Consume `output.basis` for per-field citations, reasoning, and confidence.
\* Issue `POST /{id}/trigger` for off-schedule one-off executions.
\* Pass `include\_completions=true` to enumerate executions that produced no events (useful for audit traces).
\* Adopt `type=snapshot` for field-level diffing of structured Task Run outputs (see [Snapshot Quickstart](/monitor-api/quickstart-snapshot)).
## Additional Resources
\* [Monitor Quickstart](/monitor-api/monitor-quickstart) — V1 monitor lifecycle and webhook walkthrough
\* [Snapshot Quickstart](/monitor-api/quickstart-snapshot) — `type=snapshot` walkthrough
\* [Events](/monitor-api/monitor-events) — V1 event schemas and retrieval semantics
\* [Webhooks](/monitor-api/monitor-webhooks) — payload schemas and HMAC verification
\* [V1 API Reference](/api-reference/monitor/create-monitor) — generated from `public-openapi.json`
\* [Legacy Alpha API Reference](/api-reference/legacy/monitor-alpha/create-monitor) — `/v1alpha/monitors` endpoint reference
Questions? Contact [support@parallel.ai](mailto:support@parallel.ai).
