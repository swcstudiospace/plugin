# Enrichments

Source: https://docs.parallel.ai/findall-api/features/findall-enrich.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Enrichments
> Add non-boolean enrichment data to FindAll candidates without affecting match conditions

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

\*\*Built on Task API\*\*: FindAll enrichments use Task API [processors](/task-api/guides/choose-a-processor), [JSON output schemas](/task-api/guides/specify-a-task#output-schema), and pricing. FindAll supplies the candidate input and handles orchestration automatically, running a task on each matched candidate.
## Overview
FindAll enrichments allow you to extract additional non-boolean information about candidates that should not be used as filters for matches. For example, if you're finding companies, you might want to extract the CEO name as pure enrichment data—something you want to know about each match, but not something that should affect whether a candidate matches your criteria.
## Match Conditions vs. Enrichments
Understanding the distinction between match conditions and enrichments is fundamental to using FindAll effectively.
| | \*\*Match Conditions\*\* | \*\*Enrichments\*\* |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| \*\*Purpose\*\* | Required criteria that determine whether a candidate is a match | Additional data fields extracted only for matched candidates |
| \*\*When Executed\*\* | During FindAll generation and evaluation process | \*\*Only on matched candidates\*\* using the Task API |
| \*\*Output format\*\* | Boolean match decision + extracted value | Structured JSON values defined by `output\_schema` |
| \*\*Type of Criteria\*\* | Must be boolean/filterable (yes/no questions) | Can be any type of data extraction |
| \*\*Affects Matching?\*\* | ✅ Yes - determines which candidates reach `matched` status | ❌ No - does not affect which candidates match |
| \*\*When to Add\*\* | Must be defined when creating the run | Add after the run is created through `/enrich`; the endpoint can be called multiple times |
| \*\*Example Questions\*\* | • "Is the company founded after 2020?"
• "Has the company raised Series A funding?"
• "Is the company in the healthcare industry?" | • "What is the CEO's name?"
• "What is the company's revenue?"
• "What products does the company offer?" |
### Why This Separation Matters
This two-stage approach is efficient and cost-effective:
1. \*\*Filter first\*\*: Match conditions quickly narrow down candidates to relevant matches
2. \*\*Enrich selectively\*\*: Extract detailed data only from the matches that matter
This means you don't pay to enrich hundreds of candidates that won't match your criteria.
## Adding Enrichments
Enrichments can be added anytime after a FindAll run is created, even for completed runs. Once added:
\* Enrichments will run on \*\*all matches\*\* (both ones that exist when the request is made and all future matches)
\* If enrichments are present, \*\*extend\*\* will also perform the same set of enrichments on all extended matches
Adding an enrichment to a terminal run requeues the run while FindAll schedules and processes the enrichment.
## Creating Enrichments
\*\*Task API Concepts Apply Here\*\*: Enrichments use the same [task spec](/task-api/guides/specify-a-task) structure as Task API runs. You'll define:
\* \*\*[Processors](/task-api/guides/choose-a-processor)\*\*: Choose any supported Task API processor
\* \*\*[Output Schema](/task-api/guides/specify-a-task#output-schema)\*\*: Define structured JSON output (same format as Task API)
\* \*\*[Pricing](/task-api/guides/execute-task-run#pricing)\*\*: Charged according to Task API processor pricing
You don't define `input\_schema`. FindAll supplies `entity\_name`, `entity\_url`, and `entity\_description` for each matched candidate; `entity\_name` is always present.
### Quick Example
```bash cURL theme={"system"}
curl -X POST "https://api.parallel.ai/v1beta/findall/runs/findall\_40e0ab8c10754be0b7a16477abb38a2f/enrich" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"processor": "core",
"output\_schema": {
"type": "json",
"json\_schema": {
"type": "object",
"properties": {
"ceo\_name": {
"type": "string",
"description": "Name of the CEO"
},
"founding\_year": {
"type": "string",
"description": "Year the company was founded"
}
},
"required": ["ceo\_name", "founding\_year"],
"additionalProperties": false
}
}
}'
```
```python Python theme={"system"}
from parallel import Parallel
from pydantic import BaseModel, Field
client = Parallel(api\_key="YOUR\_API\_KEY")
class CompanyEnrichment(BaseModel):
ceo\_name: str = Field(
description="Name of the CEO"
)
founding\_year: str = Field(
description="Year the company was founded"
)
client.beta.findall.enrich(
findall\_id="findall\_40e0ab8c10754be0b7a16477abb38a2f",
processor="core",
output\_schema={
"type": "json",
"json\_schema": CompanyEnrichment.model\_json\_schema()
}
)
```
```typescript TypeScript theme={"system"}
import Parallel from 'parallel-web';
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY
});
await client.beta.findall.enrich(
"findall\_40e0ab8c10754be0b7a16477abb38a2f",
{
processor: "core",
output\_schema: {
type: "json",
json\_schema: {
type: "object",
properties: {
ceo\_name: {
type: "string",
description: "Name of the CEO"
},
founding\_year: {
type: "string",
description: "Year the company was founded"
}
},
required: ["ceo\_name", "founding\_year"],
additionalProperties: false
}
}
}
);
```
## Retrieving Enrichment Results
You can access enrichment results through multiple methods:
\* \*\*[Streaming Events](/findall-api/features/findall-sse)\*\* (`/events`): Enrichment results stream in real-time as they complete
\* \*\*[Webhooks](/findall-api/features/findall-webhook)\*\*: Subscribe to `findall.candidate.enriched` events to receive enrichment results via HTTP callbacks
\* \*\*Result endpoint\*\* (`/result`): Enrichment data is included in candidate snapshots once it is available; the endpoint works while a run is active and after it stops
Enrichment data is added to the candidate's `output` object with `type: "enrichment"`. See [Candidates](/findall-api/core-concepts/findall-candidates) for details on how enrichments appear in the candidate structure.
## Related Topics
### Task API Foundation
Enrichments are built on Task API, so these guides will help you understand how they work:
\* \*\*[Task API Quickstart](/task-api/task-quickstart)\*\*: Learn the Task API that powers enrichments
\* \*\*[Specify a Task](/task-api/guides/specify-a-task)\*\*: Master task\\_spec structure and best practices
\* \*\*[Choose a Task Processor](/task-api/guides/choose-a-processor)\*\*: Understand Task API processor options
\* \*\*[Execute Task Runs](/task-api/guides/execute-task-run)\*\*: Learn about pricing and execution patterns
### FindAll Features
\* \*\*[Preview](/findall-api/features/findall-preview)\*\*: Test queries with 5–10 evaluated candidates before running full searches
\* \*\*[Extend Runs](/findall-api/features/findall-extend)\*\*: Increase match limits without paying new fixed costs
\* \*\*[Streaming Events](/findall-api/features/findall-sse)\*\*: Receive real-time updates via Server-Sent Events
\* \*\*[Webhooks](/findall-api/features/findall-webhook)\*\*: Configure HTTP callbacks for run completion and matches
\* \*\*[Run Lifecycle](/findall-api/core-concepts/findall-lifecycle)\*\*: Understand run statuses and how to cancel runs
\* \*\*[API Reference](/api-reference/findall/add-enrichment-to-findall-run)\*\*: Complete endpoint documentation
