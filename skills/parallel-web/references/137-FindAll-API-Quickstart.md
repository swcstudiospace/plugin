# FindAll API Quickstart

Source: https://docs.parallel.ai/findall-api/findall-quickstart.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# FindAll API Quickstart
> Discover and enrich entities from the web using natural language queries with the FindAll API

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

\*\*Beta Notice\*\*: Parallel FindAll is currently in public beta. Endpoints and request/response formats are subject to change. We will provide 30 days notice before any breaking changes.
## What is FindAll?
FindAll is a web-scale entity discovery system that turns natural language queries into structured, enriched databases of companies, people, and other real-world entities. It answers questions like "FindAll AI companies that raised Series A funding in the last 3 months" by combining intelligent search, evaluation, and enrichment capabilities.
Unlike traditional search APIs that return a fixed set of results, FindAll generates candidates from web data, validates them against your criteria, and optionally enriches matches with additional structured information—all from a single natural language query.
\*\*Need results in seconds?\*\* [Entity Search](/findall-api/entity-search) is FindAll's fast, synchronous counterpart for people-and-company search, optimized for recall and speed where FindAll is optimized for precision. It returns a set of matching results in seconds, without FindAll's verification, enrichment, or citations. Use it when latency matters more than precision.
## Key Features & Use Cases
FindAll excels at entity discovery and research tasks that require both breadth and depth:
\* \*\*Natural Language Input\*\*: Express complex search criteria in plain English
\* \*\*Intelligent Entity Discovery\*\*: Automatically generates and validates potential matches
\* \*\*Structured Enrichment\*\*: Extract specific attributes for each discovered entity
\* \*\*Citation-backed Results\*\*: Evaluated fields can include reasoning and source citations through `basis`
\* \*\*Asynchronous Processing\*\*: Handle large-scale searches without blocking your application
## Pricing
See [Pricing](/getting-started/pricing) for a detailed schedule of rates.
### Common Use Cases
\* \*\*Market Mapping\*\*: "FindAll fintech companies offering earned-wage access in Brazil."
\* \*\*Competitive Intelligence\*\*: "FindAll AI infrastructure providers that raised Series B funding in the last 6 months."
\* \*\*Lead Generation\*\*: "FindAll residential roofing companies in Charlotte, NC."
\* \*\*People Search & Recruiting\*\*: "FindAll engineering leaders at Series B fintech companies headquartered in Berlin."
\* \*\*Financial Research\*\*: "FindAll S\&P 500 stocks that dropped X% in last 30 days and listed tariffs as a key risk."
### What Happens During a Run
When you create a FindAll run, the system executes three key stages:
1. \*\*Generate Candidates from Web Data\*\*: FindAll searches across the web to identify potential entities that might match your query. Each candidate enters the `generated` status.
2. \*\*Evaluate Candidates Based on Match Conditions\*\*: Each generated candidate is evaluated against your match conditions. Candidates that satisfy all conditions reach `matched` status; those that do not become `unmatched`. The result snapshot can include both groups, so filter on `match\_status` when you need only successful matches.
3. \*\*Extract Enrichments for Matched Candidates\*\*: After you add an enrichment through `/enrich`, FindAll uses the Task API to extract those fields for matched candidates and handles the orchestration automatically.
This three-stage approach ensures efficiency: you only pay to enrich candidates that actually match your criteria.
## Quick Example
Here's a complete example that finds portfolio companies. The workflow consists of four steps: converting natural language to a schema, starting the run, polling for completion, and retrieving results.
### The Basic Workflow
The FindAll API follows a simple four-step workflow:
1. \*\*Ingest\*\*: Convert your natural language query into a structured schema
2. \*\*Run\*\*: Start the findall run to discover and match candidates
3. \*\*Poll\*\*: Check status until the run reaches a terminal state
4. \*\*Fetch\*\*: Retrieve the current candidate snapshot and any available reasoning and citations
```text theme={"system"}
Natural Language Query → Structured Schema → findall\_id → Candidate Snapshot
```
### Step 1: Ingest
\*\*Purpose\*\*: Converts your natural language query into a structured schema with `entity\_type` and `match\_conditions`.
The ingest endpoint automatically extracts:
\* What type of entities to search for (companies, people, products, etc.)
\* Match conditions that must be satisfied
\* Optional enrichment suggestions
\*\*Request:\*\*
```bash cURL theme={"system"}
curl -X POST "https://api.parallel.ai/v1beta/findall/ingest" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"objective": "FindAll portfolio companies of Khosla Ventures founded after 2020"
}'
```
```python Python theme={"system"}
from parallel import Parallel
client = Parallel(api\_key="YOUR\_API\_KEY")
findall\_run = client.beta.findall.ingest(
objective="FindAll portfolio companies of Khosla Ventures founded after 2020"
)
```
```typescript TypeScript theme={"system"}
import Parallel from 'parallel-web';
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY
});
const run = await client.beta.findall.ingest({
objective: "FindAll portfolio companies of Khosla Ventures founded after 2020"
});
```
\*\*Response:\*\*
```json theme={"system"}
{
"objective": "FindAll portfolio companies of Khosla Ventures founded after 2020",
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
"generator": "core"
}
```
### Customizing the ingest schema
The ingest endpoint generates a suggested schema, but you can (and should) review and modify it before creating a run. Common modifications include:
\* \*\*Relaxing temporal conditions\*\*: Ingest may interpret phrases like "founded after 2023" strictly (e.g., "within the last 1 year"). You can broaden the description to be more inclusive.
\* \*\*Adjusting match condition descriptions\*\*: Make descriptions more or less specific to control match rates.
\* \*\*Adding or removing match conditions\*\*: Tailor the schema to your exact needs.
\* \*\*Changing the entity type\*\*: Correct the entity type if ingest misidentified it.
For example, if ingest generated a strict condition like `"Company must have been founded within the last 1 year"`, you might change it to `"Company must have been founded in 2025 or later"` for more reliable matching.
The ingest schema is a starting point, not a final answer. Editing `match\_conditions` between the ingest and create steps is the recommended way to refine your query for better results.
### Step 2: Create FindAll Run
\*\*Purpose\*\*: Starts the asynchronous findall process to generate and evaluate candidates.
You can use the schema from ingest directly, or modify it before passing it to the create endpoint. Key parameters:
\* `generator`: Choose `preview`, `base`, `core`, or `pro` based on your needs (see [Generators and Pricing](/findall-api/core-concepts/findall-generator-pricing))
\* `match\_limit`: For `base`, `core`, and `pro`, the maximum number of matches to find. For `preview`, the number of candidates to evaluate (5–10).
\*\*Request:\*\*
```bash cURL theme={"system"}
curl -X POST "https://api.parallel.ai/v1beta/findall/runs" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"objective": "FindAll portfolio companies of Khosla Ventures founded after 2020",
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
"match\_limit": 5
}'
```
```python Python theme={"system"}
from parallel import Parallel
client = Parallel(api\_key="YOUR\_API\_KEY")
findall\_run = client.beta.findall.create(
objective="FindAll portfolio companies of Khosla Ventures founded after 2020",
entity\_type="companies",
match\_conditions=[
{
"name": "khosla\_ventures\_portfolio\_check",
"description": "Company must be a portfolio company of Khosla Ventures."
},
{
"name": "founded\_after\_2020\_check",
"description": "Company must have been founded after 2020."
}
],
generator="core",
match\_limit=5
)
```
```typescript TypeScript theme={"system"}
import Parallel from 'parallel-web';
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY
});
const run = await client.beta.findall.create({
objective: "FindAll portfolio companies of Khosla Ventures founded after 2020",
entity\_type: "companies",
match\_conditions: [
{
name: "khosla\_ventures\_portfolio\_check",
description: "Company must be a portfolio company of Khosla Ventures."
},
{
name: "founded\_after\_2020\_check",
description: "Company must have been founded after 2020."
}
],
generator: "core",
match\_limit: 5
});
```
\*\*Response:\*\*
```json theme={"system"}
{
"findall\_id": "findall\_40e0ab8c10754be0b7a16477abb38a2f",
"status": {
"status": "queued",
"is\_active": true,
"metrics": {
"generated\_candidates\_count": 0,
"matched\_candidates\_count": 0
}
},
"generator": "core",
"metadata": {},
"created\_at": "2025-11-03T20:47:21.580909Z",
"modified\_at": "2025-11-03T20:47:21.580909Z"
}
```
### Step 3: Poll for Status
\*\*Purpose\*\*: Monitor progress and wait for completion.
\*\*Request:\*\*
```bash cURL theme={"system"}
curl -X GET "https://api.parallel.ai/v1beta/findall/runs/findall\_40e0ab8c10754be0b7a16477abb38a2f" \
-H "x-api-key: $PARALLEL\_API\_KEY"
```
```python Python theme={"system"}
from parallel import Parallel
client = Parallel(api\_key="YOUR\_API\_KEY")
run\_status = client.beta.findall.retrieve(
findall\_id="findall\_40e0ab8c10754be0b7a16477abb38a2f"
)
```
```typescript TypeScript theme={"system"}
import Parallel from 'parallel-web';
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY
});
const runStatus = await client.beta.findall.retrieve("findall\_40e0ab8c10754be0b7a16477abb38a2f");
```
\*\*Response:\*\*
```json theme={"system"}
{
"findall\_id": "findall\_40e0ab8c10754be0b7a16477abb38a2f",
"status": {
"status": "running",
"is\_active": true,
"metrics": {
"generated\_candidates\_count": 3,
"matched\_candidates\_count": 1
}
},
"generator": "core",
"metadata": {},
"created\_at": "2025-11-03T20:47:21.580909Z",
"modified\_at": "2025-11-03T20:47:22.024269Z"
}
```
### Step 4: Get Results
\*\*Purpose\*\*: Retrieve a snapshot of the run and the candidates available at request time, with match details and any available reasoning and citations. While a run is active, the snapshot can include `generated` candidates that have not finished evaluation. You can call this endpoint while the run is active or after it finishes.
To understand the complete candidate object structure, see [Candidates](/findall-api/core-concepts/findall-candidates).
\*\*Request:\*\*
```bash cURL theme={"system"}
curl -X GET "https://api.parallel.ai/v1beta/findall/runs/findall\_40e0ab8c10754be0b7a16477abb38a2f/result" \
-H "x-api-key: $PARALLEL\_API\_KEY"
```
```python Python theme={"system"}
from parallel import Parallel
client = Parallel(api\_key="YOUR\_API\_KEY")
result = client.beta.findall.result(
findall\_id="findall\_40e0ab8c10754be0b7a16477abb38a2f",
)
```
```typescript TypeScript theme={"system"}
import Parallel from 'parallel-web';
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY
});
const result = await client.beta.findall.result("findall\_40e0ab8c10754be0b7a16477abb38a2f");
```
\*\*Response:\*\*
The example below shows one candidate from the full snapshot for brevity.
```json [expandable] theme={"system"}
{
"run": {
"findall\_id": "findall\_40e0ab8c10754be0b7a16477abb38a2f",
"status": {
"status": "completed",
"is\_active": false,
"metrics": {
"generated\_candidates\_count": 8,
"matched\_candidates\_count": 5
},
"termination\_reason": "match\_limit\_met"
},
"generator": "core",
"metadata": {},
"created\_at": "2025-11-03T20:47:21.580909Z",
"modified\_at": "2025-11-03T20:50:38.901124Z"
},
"candidates": [
{
"candidate\_id": "candidate\_a062dd17-d77a-4b1b-ad0e-de113e82f838",
"name": "Figure AI",
"url": "https://www.figure.ai",
"description": "AI robotics company building general purpose humanoid robots",
"match\_status": "matched",
"output": {
"khosla\_ventures\_portfolio\_check": {
"value": "Khosla Ventures led the Series B round",
"type": "match\_condition",
"is\_matched": true
},
"founded\_after\_2020\_check": {
"value": "2022",
"type": "match\_condition",
"is\_matched": true
}
},
"basis": [
{
"field": "khosla\_ventures\_portfolio\_check",
"citations": [
{
"title": "Figure AI raises $675M",
"url": "https://techcrunch.com/2024/02/29/figure-ai-funding/",
"excerpts": ["Khosla Ventures led the Series B round..."]
}
],
"reasoning": "Figure AI is backed by Khosla Ventures as confirmed by multiple funding announcements.",
"confidence": "high"
},
{
"field": "founded\_after\_2020\_check",
"citations": [
{
"title": "Figure AI - Company Profile",
"url": "https://www.figure.ai/about",
"excerpts": ["Founded in 2022 to build general purpose humanoid robots..."]
}
],
"reasoning": "Multiple sources confirm that Figure AI was founded in 2022, which is after 2020.",
"confidence": "high"
}
]
}
],
"last\_event\_id": "642c949cfbdcf"
}
```
## Troubleshooting
This typically happens when match conditions are too strict for the candidate pool. Try these fixes:
1. \*\*Relax match condition descriptions\*\*: The ingest endpoint may generate overly strict conditions, especially for temporal queries. Edit condition descriptions to be more inclusive before creating the run.
2. \*\*Use a stronger generator\*\*: `preview` evaluates 5–10 candidates according to `match\_limit`, `base` searches broadly, `core` searches deeper, and `pro` is the most thorough. A stronger generator evaluates more candidates, increasing the chance of finding matches.
3. \*\*Check temporal language\*\*: Phrases like "founded after 2023" may be interpreted as "within the last year." Use explicit ranges (e.g., "founded in 2025 or later") for more predictable behavior.
4. \*\*Broaden your query\*\*: If your criteria are very specific, consider starting broad, adding [enrichments](/findall-api/features/findall-enrich), and filtering the enriched results in your application.
5. \*\*Start with preview\*\*: Always run with `generator: "preview"` first to validate your schema and see how conditions are being evaluated before committing to a full run.

The ingest endpoint interprets natural language heuristically. If the generated `match\_conditions` don't match your intent:
1. \*\*Modify the conditions\*\* before passing them to the create endpoint — see [Customizing the ingest schema](#customizing-the-ingest-schema) above.
2. \*\*Skip ingest entirely\*\* and construct your own schema directly with `objective`, `entity\_type`, and `match\_conditions`.
3. \*\*Use the schema endpoint\*\* on an existing run (`GET /v1beta/findall/runs/{findall\_id}/schema`) to see what schema was used, then iterate on it.
## Next Steps
\* \*\*[Entity Search](/findall-api/entity-search)\*\*: Fast, synchronous people-and-company search for latency-sensitive workflows
\* \*\*[Candidates](/findall-api/core-concepts/findall-candidates)\*\*: Understand candidate object structure, states, and exclusion
\* \*\*[Generators and Pricing](/findall-api/core-concepts/findall-generator-pricing)\*\*: Understand generator options and pricing
\* \*\*[Preview](/findall-api/features/findall-preview)\*\*: Test queries with 5–10 evaluated candidates before running full searches
\* \*\*[Enrichments](/findall-api/features/findall-enrich)\*\*: Extract additional structured data for matched candidates
\* \*\*[Extend Runs](/findall-api/features/findall-extend)\*\*: Increase match limits without paying new fixed costs
\* \*\*[Streaming Events](/findall-api/features/findall-sse)\*\*: Receive real-time updates via Server-Sent Events
\* \*\*[Webhooks](/findall-api/features/findall-webhook)\*\*: Configure HTTP callbacks for run completion and matches
\* \*\*[API Reference](/api-reference/findall/create-findall-run)\*\*: Complete endpoint documentation
## Rate Limits
See [Rate Limits](/getting-started/rate-limits) for default quotas and how to request higher limits.
