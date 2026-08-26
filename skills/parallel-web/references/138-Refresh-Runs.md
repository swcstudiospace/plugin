# Refresh Runs

Source: https://docs.parallel.ai/findall-api/features/findall-refresh.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Refresh Runs
> Rerun the same FindAll query with exclude\_list to discover net new entities over time

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

## Overview
Scheduled jobs allow you to run the same FindAll query on a regular basis to discover newly emerging entities. This is useful for ongoing discovery workflows such as market intelligence, lead generation, and competitive tracking.
Rather than manually re-running queries, you can programmatically create new FindAll runs using a previous run's schema, while excluding candidates you've already discovered.
## Use Cases
Scheduled FindAll jobs are particularly useful for:
\* \*\*Market monitoring\*\*: Track new companies entering a market space over time
\* \*\*Lead generation\*\*: Continuously discover new potential customers matching your criteria
\* \*\*Competitive intelligence\*\*: Discover emerging competitors
\* \*\*Investment research\*\*: Track new companies meeting specific investment criteria
\* \*\*Regulatory compliance\*\*: Discover new entities that may require compliance review
## How It Works
Creating a scheduled FindAll job involves three steps:
1. \*\*Retrieve the search schema\*\* from a previous run and load the original enrichment request payloads from your own storage
2. \*\*Create a new run\*\* using that schema, with an exclude list of previously discovered candidates
3. \*\*Reapply enrichments\*\* using the original saved request payloads through the enrichment endpoint
This approach ensures:
\* \*\*Consistent criteria\*\*: Reuse the same objective, entity type, and match conditions across runs
\* \*\*Fewer repeats\*\*: Exclude candidates returned by earlier runs
\* \*\*Focused discovery\*\*: Direct each new run toward candidates that are not already in your saved exclusion set
## Step 1: Retrieve the Search Schema
Get the schema from an existing FindAll run to reuse its `objective`, `entity\_type`, `match\_conditions`, `generator`, and `match\_limit`:
The schema response is not a lossless store of the original `/enrich` requests. In particular, MCP server configuration can be omitted or redacted. When you first call `/enrich`, persist the exact request payload in secure application storage and replay that saved payload for refresh runs. Do not treat `schema.enrichments` as the source of truth for requests that may contain `mcp\_servers` or other sensitive configuration.
The schema response also omits the original run's `metadata` and `webhook`. Supply new values when creating the refreshed run if you need them.

```bash cURL theme={"system"}
curl -X GET "https://api.parallel.ai/v1beta/findall/runs/findall\_40e0ab8c10754be0b7a16477abb38a2f/schema" \
-H "x-api-key: $PARALLEL\_API\_KEY"
```
```python Python theme={"system"}
from parallel import Parallel
client = Parallel(api\_key="YOUR\_API\_KEY")
schema = client.beta.findall.schema(
findall\_id="findall\_40e0ab8c10754be0b7a16477abb38a2f"
)
```
```typescript TypeScript theme={"system"}
import Parallel from 'parallel-web';
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY
});
const schema = await client.beta.findall.schema("findall\_40e0ab8c10754be0b7a16477abb38a2f");
```
\*\*Response:\*\*
```json theme={"system"}
{
"objective": "Find all portfolio companies of Khosla Ventures founded after 2020",
"entity\_type": "companies",
"match\_conditions": [
{
"name": "khosla\_ventures\_portfolio\_check",
"description": "Company must be a portfolio company of Khosla Ventures."
},
{
"name": "founded\_after\_2020\_check",
"description": "Company must have been founded after 2020."
}
],
"enrichments": [
{
"processor": "core",
"output\_schema": {
"type": "json",
"json\_schema": {
"type": "object",
"properties": {
"funding\_amount": {
"type": "string",
"description": "Total funding raised by the company in USD"
}
}
}
}
}
],
"generator": "core",
"match\_limit": 50
}
```
## Step 2: Create a New Run and Replay Saved Enrichment Requests
Use the retrieved search criteria to create a new FindAll run, adding an `exclude\_list` parameter to skip candidates you've already discovered. The create endpoint does not accept `enrichments`; after creation, send each original enrichment request that you persisted in your application.
```bash cURL theme={"system"}
curl -X POST "https://api.parallel.ai/v1beta/findall/runs" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"objective": "Find all portfolio companies of Khosla Ventures founded after 2020",
"entity\_type": "companies",
"match\_conditions": [
{
"name": "khosla\_ventures\_portfolio\_check",
"description": "Company must be a portfolio company of Khosla Ventures."
},
{
"name": "founded\_after\_2020\_check",
"description": "Company must have been founded after 2020."
}
],
"generator": "core",
"match\_limit": 50,
"exclude\_list": [
{
"name": "Anthropic",
"url": "https://www.anthropic.com/"
},
{
"name": "Adept AI",
"url": "https://adept.ai/"
},
{
"name": "Liquid AI",
"url": "https://www.liquid.ai/"
}
]
}'
# Replay the exact original /enrich payload from secure application storage
curl -X POST "https://api.parallel.ai/v1beta/findall/runs/findall\_NEW\_RUN\_ID/enrich" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"processor": "core",
"output\_schema": {
"type": "json",
"json\_schema": {
"type": "object",
"properties": {
"funding\_amount": {
"type": "string",
"description": "Total funding raised by the company in USD"
}
}
}
}
}'
```
```python Python theme={"system"}
from parallel import Parallel
client = Parallel(api\_key="YOUR\_API\_KEY")
# Persist this exact payload securely when you first add the enrichment.
# Load it from your database or secrets manager in production.
SAVED\_ENRICHMENT\_REQUESTS = [
{
"processor": "core",
"output\_schema": {
"type": "json",
"json\_schema": {
"type": "object",
"properties": {
"funding\_amount": {
"type": "string",
"description": "Total funding raised by the company in USD"
}
}
}
}
}
]
schema = client.beta.findall.schema(
findall\_id="findall\_40e0ab8c10754be0b7a16477abb38a2f"
)
findall\_run = client.beta.findall.create(
objective=schema.objective,
entity\_type=schema.entity\_type,
match\_conditions=[condition.to\_dict() for condition in schema.match\_conditions],
generator=schema.generator or "core",
match\_limit=schema.match\_limit or 50,
exclude\_list=[
{
"name": "Anthropic",
"url": "https://www.anthropic.com/"
},
{
"name": "Adept AI",
"url": "https://adept.ai/"
},
{
"name": "Liquid AI",
"url": "https://www.liquid.ai/"
}
]
)
for enrichment\_request in SAVED\_ENRICHMENT\_REQUESTS:
client.beta.findall.enrich(
findall\_run.findall\_id,
\*\*enrichment\_request
)
```
```typescript TypeScript theme={"system"}
import Parallel from 'parallel-web';
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY
});
// Persist these exact payloads securely when you first add the enrichments.
// Load them from your database or secrets manager in production.
const savedEnrichmentRequests = [
{
processor: "core",
output\_schema: {
type: "json" as const,
json\_schema: {
type: "object",
properties: {
funding\_amount: {
type: "string",
description: "Total funding raised by the company in USD"
}
}
}
}
}
];
const schema = await client.beta.findall.schema("findall\_40e0ab8c10754be0b7a16477abb38a2f");
const run = await client.beta.findall.create({
objective: schema.objective,
entity\_type: schema.entity\_type,
match\_conditions: schema.match\_conditions,
generator: schema.generator,
match\_limit: schema.match\_limit ?? 50,
exclude\_list: [
{
name: "Anthropic",
url: "https://www.anthropic.com/"
},
{
name: "Adept AI",
url: "https://adept.ai/"
},
{
name: "Liquid AI",
url: "https://www.liquid.ai/"
}
]
});
for (const enrichmentRequest of savedEnrichmentRequests) {
await client.beta.findall.enrich(run.findall\_id, enrichmentRequest);
}
```
### Exclude List Parameters
The `exclude\_list` is an array of candidate objects to exclude. Each object contains:
| Parameter | Type | Required | Description |
| --------- | ------ | -------- | -------------------------------- |
| `name` | string | Yes | Name of the candidate to exclude |
| `url` | string | Yes | URL of the candidate to exclude |
\*\*How exclusions work:\*\*
\* Candidates matching any entry in the `exclude\_list` will be skipped during generation
\* This prevents those entities from being returned or evaluated in the refreshed run
\* FindAll uses both `name` and `url` to deduplicate and disambiguate exclusions; use the entity's official name and canonical URL for best results
\* A request can contain at most 10,000 exclusion entries
## Building Your Exclude List
To construct the `exclude\_list` from previous runs, retrieve candidates and extract their `name` and `url` fields:
```bash cURL theme={"system"}
curl -X GET "https://api.parallel.ai/v1beta/findall/runs/findall\_40e0ab8c10754be0b7a16477abb38a2f/result" \
-H "x-api-key: $PARALLEL\_API\_KEY"
```
The example below shows matched candidates:
```json theme={"system"}
{
"run": {
"findall\_id": "findall\_40e0ab8c10754be0b7a16477abb38a2f",
"status": {
"status": "completed",
"is\_active": false,
"metrics": {
"generated\_candidates\_count": 8,
"matched\_candidates\_count": 2
}
},
"generator": "core"
},
"candidates": [
{
"candidate\_id": "candidate\_abc123",
"name": "Anthropic",
"url": "https://www.anthropic.com/",
"match\_status": "matched"
},
{
"candidate\_id": "candidate\_def456",
"name": "Adept AI",
"url": "https://adept.ai/",
"match\_status": "matched"
}
],
"last\_event\_id": "642c949cfbdcf"
}
```
Store these candidates and pass them as the `exclude\_list` array in subsequent runs. Excluding only `matched` candidates prevents previous matches from being returned again while allowing earlier nonmatches to be reconsidered as web data changes. If you want the refreshed run to consider only entities that have never reached evaluation, save and exclude every candidate returned by `/result` instead.
Deduplicate the accumulated list before each request and fail explicitly if it exceeds 10,000 entries. Do not silently truncate it: truncation makes the refresh policy dependent on list order and can reintroduce older entities.
## Example: Weekly Scheduled Job
Here's a complete example showing how to set up a weekly FindAll job:
```python Python theme={"system"}
import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path
import requests
PARALLEL\_API\_KEY = os.environ["PARALLEL\_API\_KEY"]
BASE\_URL = "https://api.parallel.ai/v1beta"
HEADERS = {
"x-api-key": PARALLEL\_API\_KEY,
"Content-Type": "application/json"
}
ORIGINAL\_FINDALL\_ID = "findall\_40e0ab8c10754be0b7a16477abb38a2f"
STATE\_FILE = Path("findall-refresh-state.json")
MAX\_EXCLUSIONS = 10\_000
# Save the exact original /enrich request payloads in secure configuration.
# Include mcp\_servers here if the original enrichment used them.
SAVED\_ENRICHMENT\_REQUESTS = [
{
"processor": "core",
"output\_schema": {
"type": "json",
"json\_schema": {
"type": "object",
"properties": {
"funding\_amount": {
"type": "string",
"description": "Total funding raised by the company in USD"
}
}
}
}
}
]
def get\_schema(findall\_id):
response = requests.get(
f"{BASE\_URL}/findall/runs/{findall\_id}/schema",
headers=HEADERS
)
response.raise\_for\_status()
return response.json()
def get\_matched\_candidates(findall\_id):
"""Get all matched candidates from a run"""
response = requests.get(
f"{BASE\_URL}/findall/runs/{findall\_id}/result",
headers=HEADERS
)
response.raise\_for\_status()
candidates = response.json().get("candidates", [])
return [c for c in candidates if c.get("match\_status") == "matched"]
def deduplicate\_exclusions(candidates):
unique = {}
for candidate in candidates:
name = candidate["name"].strip()
url = candidate["url"].strip()
unique[(name, url.rstrip("/"))] = {"name": name, "url": url}
return list(unique.values())
def load\_exclusions():
if not STATE\_FILE.exists():
return []
state = json.loads(STATE\_FILE.read\_text())
return deduplicate\_exclusions(state.get("exclude\_list", []))
def save\_exclusions(exclusions):
# Replace the state file atomically so an interrupted write does not erase it.
temporary\_file = STATE\_FILE.with\_suffix(".tmp")
temporary\_file.write\_text(json.dumps({"exclude\_list": exclusions}, indent=2))
temporary\_file.replace(STATE\_FILE)
def create\_scheduled\_run(schema, exclusions):
if len(exclusions) > MAX\_EXCLUSIONS:
raise RuntimeError(
f"Saved exclusion set has {len(exclusions)} entries; "
f"FindAll accepts at most {MAX\_EXCLUSIONS}."
)
payload = {
"objective": schema["objective"],
"entity\_type": schema["entity\_type"],
"match\_conditions": schema["match\_conditions"],
"generator": schema.get("generator", "core"),
"match\_limit": schema.get("match\_limit") or 50,
"exclude\_list": exclusions
}
response = requests.post(
f"{BASE\_URL}/findall/runs",
headers=HEADERS,
json=payload
)
response.raise\_for\_status()
findall\_id = response.json()["findall\_id"]
for enrichment\_request in SAVED\_ENRICHMENT\_REQUESTS:
enrich\_response = requests.post(
f"{BASE\_URL}/findall/runs/{findall\_id}/enrich",
headers=HEADERS,
json=enrichment\_request
)
enrich\_response.raise\_for\_status()
return findall\_id
def wait\_for\_completion(findall\_id):
while True:
response = requests.get(
f"{BASE\_URL}/findall/runs/{findall\_id}",
headers=HEADERS
)
response.raise\_for\_status()
run\_status = response.json()["status"]
if not run\_status["is\_active"]:
if run\_status["status"] != "completed":
raise RuntimeError(
f"FindAll run stopped with status: {run\_status['status']}"
)
return
time.sleep(30)
def run\_weekly\_job():
print(f"Starting scheduled job at {datetime.now(timezone.utc).isoformat()}")
schema = get\_schema(ORIGINAL\_FINDALL\_ID)
exclusions = load\_exclusions()
if not exclusions:
original\_matches = get\_matched\_candidates(ORIGINAL\_FINDALL\_ID)
exclusions = deduplicate\_exclusions(original\_matches)
new\_findall\_id = create\_scheduled\_run(schema, exclusions)
print(f"Created new run: {new\_findall\_id}")
wait\_for\_completion(new\_findall\_id)
new\_candidates = get\_matched\_candidates(new\_findall\_id)
print(f"Found {len(new\_candidates)} new candidates")
updated\_exclusions = deduplicate\_exclusions(exclusions + new\_candidates)
save\_exclusions(updated\_exclusions)
if len(updated\_exclusions) > MAX\_EXCLUSIONS:
print("The saved exclusion set now exceeds the API limit; choose a rotation policy before the next run.")
return new\_candidates
if \_\_name\_\_ == "\_\_main\_\_":
run\_weekly\_job()
```
```typescript TypeScript theme={"system"}
import { readFile, rename, writeFile } from 'node:fs/promises';
const PARALLEL\_API\_KEY = process.env.PARALLEL\_API\_KEY;
if (!PARALLEL\_API\_KEY) throw new Error('PARALLEL\_API\_KEY is required');
const BASE\_URL = 'https://api.parallel.ai/v1beta';
const HEADERS = {
'x-api-key': PARALLEL\_API\_KEY,
'Content-Type': 'application/json',
};
const ORIGINAL\_FINDALL\_ID = 'findall\_40e0ab8c10754be0b7a16477abb38a2f';
const STATE\_FILE = 'findall-refresh-state.json';
const MAX\_EXCLUSIONS = 10\_000;
type Exclusion = { name: string; url: string };
// Save the exact original /enrich request payloads in secure configuration.
// Include mcp\_servers here if the original enrichment used them.
const savedEnrichmentRequests = [
{
processor: 'core',
output\_schema: {
type: 'json',
json\_schema: {
type: 'object',
properties: {
funding\_amount: {
type: 'string',
description: 'Total funding raised by the company in USD',
},
},
},
},
},
];
async function requestJson(path: string, init: RequestInit = {}) {
const response = await fetch(`${BASE\_URL}${path}`, {
...init,
headers: HEADERS,
});
if (!response.ok) {
throw new Error(`Parallel API request failed: ${response.status} ${await response.text()}`);
}
return response.json();
}
async function getSchema(findallId: string) {
return requestJson(`/findall/runs/${findallId}/schema`);
}
async function getMatchedCandidates(findallId: string) {
const result: any = await requestJson(`/findall/runs/${findallId}/result`);
return (result.candidates ?? []).filter((candidate: any) => candidate.match\_status === 'matched');
}
function deduplicateExclusions(candidates: Exclusion[]) {
const unique = new Map();
for (const candidate of candidates) {
const name = candidate.name.trim();
const url = candidate.url.trim();
unique.set(JSON.stringify([name, url.replace(/\/$/, '')]), { name, url });
}
return [...unique.values()];
}
async function loadExclusions(): Promise {
try {
const state = JSON.parse(await readFile(STATE\_FILE, 'utf8'));
return deduplicateExclusions(state.exclude\_list ?? []);
} catch (error: any) {
if (error.code === 'ENOENT') return [];
throw error;
}
}
async function saveExclusions(exclusions: Exclusion[]) {
const temporaryFile = `${STATE\_FILE}.tmp`;
await writeFile(temporaryFile, JSON.stringify({ exclude\_list: exclusions }, null, 2));
await rename(temporaryFile, STATE\_FILE);
}
async function createScheduledRun(
schema: any,
exclusions: Exclusion[]
) {
if (exclusions.length > MAX\_EXCLUSIONS) {
throw new Error(
`Saved exclusion set has ${exclusions.length} entries; FindAll accepts at most ${MAX\_EXCLUSIONS}.`
);
}
const payload = {
objective: schema.objective,
entity\_type: schema.entity\_type,
match\_conditions: schema.match\_conditions,
generator: schema.generator ?? 'core',
match\_limit: schema.match\_limit ?? 50,
exclude\_list: exclusions,
};
const run: any = await requestJson('/findall/runs', {
method: 'POST',
body: JSON.stringify(payload),
});
for (const enrichmentRequest of savedEnrichmentRequests) {
await requestJson(`/findall/runs/${run.findall\_id}/enrich`, {
method: 'POST',
body: JSON.stringify(enrichmentRequest),
});
}
return run.findall\_id;
}
async function waitForCompletion(findallId: string) {
while (true) {
const run: any = await requestJson(`/findall/runs/${findallId}`);
if (!run.status.is\_active) {
if (run.status.status !== 'completed') {
throw new Error(`FindAll run stopped with status: ${run.status.status}`);
}
return;
}
await new Promise(resolve => setTimeout(resolve, 30\_000));
}
}
async function runWeeklyJob() {
console.log(`Starting scheduled job at ${new Date()}`);
const schema = await getSchema(ORIGINAL\_FINDALL\_ID);
let exclusions = await loadExclusions();
if (exclusions.length === 0) {
const originalCandidates = await getMatchedCandidates(ORIGINAL\_FINDALL\_ID);
exclusions = deduplicateExclusions(originalCandidates.map((candidate: any) => ({
name: candidate.name,
url: candidate.url,
})));
}
const newFindallId = await createScheduledRun(schema, exclusions);
console.log(`Created new run: ${newFindallId}`);
await waitForCompletion(newFindallId);
const newCandidates = await getMatchedCandidates(newFindallId);
console.log(`Found ${newCandidates.length} new candidates`);
const updatedExclusions = deduplicateExclusions([
...exclusions,
...newCandidates.map((candidate: any) => ({
name: candidate.name,
url: candidate.url,
})),
]);
await saveExclusions(updatedExclusions);
if (updatedExclusions.length > MAX\_EXCLUSIONS) {
console.warn('The saved exclusion set now exceeds the API limit; choose a rotation policy before the next run.');
}
return newCandidates;
}
await runWeeklyJob();
```
## Best Practices
### Schema Modifications
While you should keep `match\_conditions` consistent across runs, you can adjust:
\* \*\*`objective`\*\*: Update to reflect the current time period (e.g., "founded in 2024" → "founded in 2025")
\* \*\*Enrichment requests\*\*: Replay the original request payloads from secure application storage—or add new enrichments—through `/enrich` after creating the new run
\* \*\*`match\_limit`\*\*: Adjust based on expected growth rate
\* \*\*`generator`\*\*: Change generators if needed (though this may affect result quality)
### Exclude List Management
\* \*\*Persist candidates\*\*: Store discovered candidate objects (name and URL) in a database or file for long-term tracking
\* \*\*Deduplicate before sending\*\*: Remove repeated name-and-URL pairs before building each request
\* \*\*Normalize URLs\*\*: Ensure consistent URL formatting (trailing slashes, protocols, etc.) across runs
\* \*\*Periodic resets\*\*: Consider occasionally running without exclusions to catch entities that may have changed
\* \*\*Respect the limit\*\*: An exclude list can contain at most 10,000 candidates; define a rotation or reset policy before the saved set reaches that size
### Scheduling
\* \*\*Frequency\*\*: Choose intervals based on your domain's update rate (daily, weekly, monthly)
\* \*\*Off-peak hours\*\*: Schedule jobs during low-traffic periods if possible
\* \*\*Durable state\*\*: Use transactional database storage rather than a local file when multiple scheduler instances may run concurrently
\* \*\*Webhooks\*\*: Use [webhooks](/findall-api/features/findall-webhook) to get notified when jobs complete
\* \*\*Error handling\*\*: Implement retry logic for failed runs
### Cost Optimization
\* \*\*Start small\*\*: Use lower `match\_limit` values initially, then [extend](/findall-api/features/findall-extend) if needed
\* \*\*Preview first\*\*: Test schema changes with [preview](/findall-api/features/findall-preview) before running full jobs
\* \*\*Monitor metrics\*\*: Track `generated\_candidates\_count` vs `matched\_candidates\_count` to optimize criteria
## Related Topics
\* \*\*[Preview](/findall-api/features/findall-preview)\*\*: Test queries with 5–10 evaluated candidates before running full searches
\* \*\*[Generators and Pricing](/findall-api/core-concepts/findall-generator-pricing)\*\*: Understand generator options and pricing
\* \*\*[Enrichments](/findall-api/features/findall-enrich)\*\*: Extract additional structured data for matched candidates
\* \*\*[Extend Runs](/findall-api/features/findall-extend)\*\*: Increase match limits without paying new fixed costs
\* \*\*[Webhooks](/findall-api/features/findall-webhook)\*\*: Configure HTTP callbacks for run completion and matches
\* \*\*[Streaming Events](/findall-api/features/findall-sse)\*\*: Receive real-time updates via Server-Sent Events
\* \*\*[Run Lifecycle](/findall-api/core-concepts/findall-lifecycle)\*\*: Understand run statuses and how to cancel runs
\* \*\*[API Reference](/api-reference/findall/get-findall-run-schema)\*\*: Complete endpoint documentation
