# FindAll Migration Guide

Source: https://docs.parallel.ai/findall-api/findall-migration-guide.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# FindAll Migration Guide
> Guide for migrating from V0 to V1 FindAll API

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

\*\*Timeline\*\*: V1 is now the default for the FindAll API. Requests no longer need the `parallel-beta: "findall-2025-09-15"` header — requests without it use V1. The header is still accepted for backwards compatibility but no longer changes behavior. Existing V0 runs remain retrievable by their original run IDs.
## Why Migrate to V1?
V1 delivers significant improvements across pricing, performance, and capabilities:
1. \*\*[Pay-per-Match Pricing](/findall-api/core-concepts/findall-generator-pricing)\*\*: Charges based on matches found, not candidates evaluated
2. \*\*[Task-Powered Enrichments](/findall-api/features/findall-enrich)\*\*: Flexible enrichments via Task API with expanded processor options
3. \*\*Enhanced Capabilities:\*\*
\* [Extend](/findall-api/features/findall-extend) and [Cancel](/findall-api/features/findall-cancel) endpoints, plus the [Preview](/findall-api/features/findall-preview) generator
\* [Real-time streaming](/findall-api/features/findall-sse) with incremental updates
\* [Exclude candidates](/findall-api/core-concepts/findall-candidates) from evaluation
\* Match conditions return both `value` and `is\_matched` boolean
\* Explicit `match\_limit` range from 5 to 1,000
4. \*\*Better Performance\*\*: Improved latency and match quality across all stages
\*\*Breaking Changes\*\*: V0 and V1 request and response contracts are not interchangeable. Existing V0 run IDs remain retrievable through the status endpoint, but V1-only schemas and features such as `/result`, `/extend`, and `/enrich` do not apply to those runs. Parameter names, response schemas, and pricing have changed.
## Key Differences
### Request Structure
V0 used a nested `findall\_spec` object. V1 flattens this structure:
| \*\*Concept\*\* | \*\*V0 API\*\* | \*\*V1 API\*\* |
| ------------------- | ---------------------------------------- | ------------------------------ |
| \*\*Search Goal\*\* | `query` | `objective` |
| \*\*Entity Type\*\* | `findall\_spec.name` | `entity\_type` |
| \*\*Filter Criteria\*\* | `findall\_spec.columns` (type=constraint) | `match\_conditions` |
| \*\*Model Selection\*\* | `processor` | `generator` |
| \*\*Max Results\*\* | `result\_limit` (default: 200) | `match\_limit` (range: 5-1,000) |
### Response Structure
V0 included results in poll responses. V1 separates status and results:
| \*\*Concept\*\* | \*\*V0 API\*\* | \*\*V1 API\*\* |
| ----------------- | ------------------------------------------------------ | -------------------------------------- |
| \*\*Status Check\*\* | `is\_active` + `are\_enrichments\_active` | `status.is\_active` |
| \*\*Get Results\*\* | `GET /v1beta/findall/runs/{id}` (included in response) | `GET /v1beta/findall/runs/{id}/result` |
| \*\*Results Array\*\* | `results` | `candidates` |
| \*\*Match Data\*\* | `filter\_results` (array) | `output` (object) |
| \*\*Field Access\*\* | Loop through array to find key | Direct: `output[field\_name]["value"]` |
### Enrichment Handling
V0 included enrichments in initial spec. V1 adds them via separate endpoint:
| \*\*Aspect\*\* | \*\*V0 API\*\* | \*\*V1 API\*\* |
| --------------------- | ----------------------------------------- | ----------------------------------------------------------- |
| \*\*Definition\*\* | Part of `columns` array (type=enrichment) | Separate `POST /v1beta/findall/runs/{id}/enrich` call |
| \*\*Timing\*\* | At run creation only | Anytime after run creation (multiple enrichments supported) |
| \*\*Output Format\*\* | Separate `enrichment\_results` array | Merged into `output` object with type=enrichment |
| \*\*Processor Options\*\* | Limited to FindAll processors | All Task API processors available |
## End-to-End Migration Example
This example shows the complete workflow migration, including enrichments:
```python V0 API [expandable] theme={"system"}
import requests
import time
API\_KEY = "your\_api\_key"
BASE\_URL = "https://api.parallel.ai"
# Step 1: Ingest query
ingest\_response = requests.post(
f"{BASE\_URL}/v1beta/findall/ingest",
headers={"x-api-key": API\_KEY},
json={"query": "Find AI companies that raised Series A in 2024 and get CEO names"}
)
findall\_spec = ingest\_response.json()
# Step 2: Create run (constraints + enrichments together)
run\_response = requests.post(
f"{BASE\_URL}/v1beta/findall/runs",
headers={"x-api-key": API\_KEY},
json={
"findall\_spec": findall\_spec,
"processor": "core",
"result\_limit": 100
}
)
findall\_id = run\_response.json()["findall\_id"]
# Step 3: Poll until both flags are false
while True:
poll\_response = requests.get(
f"{BASE\_URL}/v1beta/findall/runs/{findall\_id}",
headers={"x-api-key": API\_KEY}
)
result = poll\_response.json()
if not result["is\_active"] and not result["are\_enrichments\_active"]:
break
time.sleep(15)
# Step 4: Access results from poll response
for entity in result["results"]:
print(f"{entity['name']}: Score {entity['score']}")
# Loop through arrays to find values
for filter\_result in entity["filter\_results"]:
print(f" {filter\_result['key']}: {filter\_result['value']}")
for enrichment in entity["enrichment\_results"]:
print(f" {enrichment['key']}: {enrichment['value']}")
```
```python V1 API [expandable] theme={"system"}
import requests
import time
API\_KEY = "your\_api\_key"
BASE\_URL = "https://api.parallel.ai"
headers = {
"x-api-key": API\_KEY
}
# Step 1: Ingest objective
ingest\_response = requests.post(
f"{BASE\_URL}/v1beta/findall/ingest",
headers=headers,
json={"objective": "Find AI companies that raised Series A in 2024 and get CEO names"}
)
ingest\_data = ingest\_response.json()
# Step 2: Create run (constraints only, flattened)
run\_response = requests.post(
f"{BASE\_URL}/v1beta/findall/runs",
headers=headers,
json={
"objective": ingest\_data["objective"],
"entity\_type": ingest\_data["entity\_type"],
"match\_conditions": ingest\_data["match\_conditions"],
"generator": "core",
"match\_limit": 50
}
)
findall\_id = run\_response.json()["findall\_id"]
# Step 3: Add each suggested enrichment through the separate endpoint
for enrichment in ingest\_data.get("enrichments") or []:
enrichment\_payload = {
"processor": enrichment.get("processor", "core"),
"output\_schema": enrichment["output\_schema"],
}
enrich\_response = requests.post(
f"{BASE\_URL}/v1beta/findall/runs/{findall\_id}/enrich",
headers=headers,
json=enrichment\_payload
)
enrich\_response.raise\_for\_status()
# Step 4: Poll until completed
while True:
status\_response = requests.get(
f"{BASE\_URL}/v1beta/findall/runs/{findall\_id}",
headers=headers
)
run\_status = status\_response.json()["status"]
if not run\_status["is\_active"]:
if run\_status["status"] != "completed":
raise RuntimeError(f"FindAll run stopped with status: {run\_status['status']}")
break
time.sleep(10)
# Step 5: Fetch results from separate endpoint
result\_response = requests.get(
f"{BASE\_URL}/v1beta/findall/runs/{findall\_id}/result",
headers=headers
)
result = result\_response.json()
# Step 6: Access results with direct object access
for candidate in result["candidates"]:
if candidate["match\_status"] == "matched":
print(candidate["name"])
# Direct access to all fields (constraints + enrichments merged)
for field\_name, field\_data in candidate["output"].items():
print(f" {field\_name}: {field\_data['value']}")
```
## Migration Checklist
Complete these steps to migrate from V0 to V1:
### Core Changes
\* Change ingest parameter: `query` → `objective`
\* Flatten run request: extract `objective`, `entity\_type`, `match\_conditions` from `findall\_spec`
\* Rename: `result\_limit` → `match\_limit`, `processor` → `generator`
\* Update status check: poll while `status.is\_active`, then inspect the terminal `status.status`
\* Fetch results from separate `/result` endpoint
\* Update result parsing: `results` → `candidates`
\* Change field access: direct object access (`output[field]`) vs array iteration
### Enrichment Changes (if applicable)
\* Move enrichments to separate `POST /enrich` call after run creation
\* Convert enrichment columns to `output\_schema` format (see [Task API](/task-api/guides/specify-a-task#output-schema))
\* Update result access: enrichments now merged into `output` object
### Optional Enhancements
\* Implement streaming via `/events` endpoint for real-time updates
\* Add `exclude\_list` to filter out specific candidates
\* Use `generator: "preview"` for testing queries before full runs
\* Implement `/extend` endpoint to increase match limits dynamically
\* Implement `/cancel` endpoint to stop runs early
### Testing
\* Validate queries in development environment
\* Review pricing impact with generator-based model
\* Update error handling for new response schemas
\* Monitor performance metrics
## Related Topics
### Core Concepts
\* \*\*[Quickstart](/findall-api/findall-quickstart)\*\*: Get started with V1 FindAll API
\* \*\*[Candidates](/findall-api/core-concepts/findall-candidates)\*\*: Understand candidate object structure and states
\* \*\*[Generators and Pricing](/findall-api/core-concepts/findall-generator-pricing)\*\*: Understand generator options and pricing
\* \*\*[Run Lifecycle](/findall-api/core-concepts/findall-lifecycle)\*\*: Understand run statuses and termination
### Features
\* \*\*[Preview](/findall-api/features/findall-preview)\*\*: Test queries with 5–10 evaluated candidates before running full searches
\* \*\*[Enrichments](/findall-api/features/findall-enrich)\*\*: Extract additional structured data for matched candidates
\* \*\*[Extend Runs](/findall-api/features/findall-extend)\*\*: Increase match limits without paying new fixed costs
\* \*\*[Cancel Runs](/findall-api/features/findall-cancel)\*\*: Stop runs early to save costs
\* \*\*[Streaming Events](/findall-api/features/findall-sse)\*\*: Receive real-time updates via Server-Sent Events
\* \*\*[Webhooks](/findall-api/features/findall-webhook)\*\*: Configure HTTP callbacks for run completion and matches
