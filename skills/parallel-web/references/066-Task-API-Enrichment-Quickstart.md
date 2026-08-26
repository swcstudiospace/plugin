# Task API Enrichment Quickstart

Source: https://docs.parallel.ai/task-api/examples/task-enrichment.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Task API Enrichment Quickstart
> Enrich your structured data with web intelligence using the Task API

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

## What is Enrichment?
Enrichment is when you have existing structured data—like a list of companies, products, or contacts—and want to enhance it with additional information from the web. The Task API makes it easy to define what data you have and what additional fields you need, then automatically researches and populates those fields at scale.
## How Enrichment Works
With enrichment, you define two schemas:
1. \*\*Input Schema\*\*: The data fields you already have (e.g., company name, website)
2. \*\*Output Schema\*\*: The new fields you want to add (e.g., employee count, funding sources, founding date)
The Task API researches the web and populates your output fields with accurate, cited information.
## 1. Set up Prerequisites
Generate your API key on [Platform](https://platform.parallel.ai). Then, set up with the TypeScript SDK, Python SDK or with cURL:
```bash cURL theme={"system"}
echo "Install curl and jq via brew, apt, or your favorite package manager"
export PARALLEL\_API\_KEY="PARALLEL\_API\_KEY"
```
```bash Python theme={"system"}
pip install parallel-web
export PARALLEL\_API\_KEY="PARALLEL\_API\_KEY"
```
```bash TypeScript theme={"system"}
npm install parallel-web
export PARALLEL\_API\_KEY="PARALLEL\_API\_KEY"
```
```bash Python (Async) theme={"system"}
pip install parallel-web
export PARALLEL\_API\_KEY="PARALLEL\_API\_KEY"
```
## 2. Execute your First Enrichment Task
Let's enrich a simple company record. We'll start with just a company name and enrich it with a founding date:
{" "}
You can learn about our available Processors [here →](/task-api/guides/choose-a-processor){" "}

```bash cURL theme={"system"}
echo "Creating the run:"
RUN\_JSON=$(curl -s "https://api.parallel.ai/v1/tasks/runs" \
-H "x-api-key: ${PARALLEL\_API\_KEY}" \
-H "Content-Type: application/json" \
-d '{
"task\_spec": {
"output\_schema": "The founding date of the company in the format MM-YYYY"
},
"input": "United Nations",
"processor": "base"
}')
echo "$RUN\_JSON" | jq .
RUN\_ID=$(echo "$RUN\_JSON" | jq -r '.run\_id')
echo "Retrieving the run result, blocking until the result is available:"
curl -s "https://api.parallel.ai/v1/tasks/runs/${RUN\_ID}/result" \
-H "x-api-key: ${PARALLEL\_API\_KEY}" | jq .
```
```python Python theme={"system"}
import os
from parallel import Parallel
from parallel.types import TaskSpecParam
client = Parallel(api\_key=os.environ["PARALLEL\_API\_KEY"])
task\_run = client.task\_run.create(
input="United Nations",
task\_spec=TaskSpecParam(
output\_schema="The founding date of the company in the format MM-YYYY"
),
processor="base"
)
print(f"Run ID: {task\_run.run\_id}")
run\_result = client.task\_run.result(task\_run.run\_id, api\_timeout=3600)
print(run\_result.output)
```
```typescript TypeScript theme={"system"}
import Parallel from "parallel-web";
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY,
});
const taskRun = await client.taskRun.create({
input: "United Nations",
task\_spec: {
output\_schema: "The founding date of the company in the format MM-YYYY",
},
processor: "base",
});
console.log(`Run ID: ${taskRun.run\_id}`);
// Poll for results with 25-second timeout, retry up to 144 times (1 hour total)
let runResult;
for (let i = 0; i < 144; i++) {
try {
runResult = await client.taskRun.result(taskRun.run\_id, { timeout: 25 });
break;
} catch (error) {
if (i === 143) throw error; // Last attempt failed
await new Promise((resolve) => setTimeout(resolve, 1000));
}
}
console.log(runResult.output);
```
```python Python (Async) theme={"system"}
import asyncio
import os
from parallel import AsyncParallel
from parallel.types import TaskSpecParam
client = AsyncParallel(api\_key=os.environ["PARALLEL\_API\_KEY"])
async def run\_task():
task\_run = await client.task\_run.create(
input="United Nations",
task\_spec=TaskSpecParam(
output\_schema="The founding date of the company in the format MM-YYYY"
),
processor="base"
)
print(f"Run ID: {task\_run.run\_id}")
run\_result = await client.task\_run.result(task\_run.run\_id, api\_timeout=3600)
return run\_result
run\_result = asyncio.run(run\_task())
print(run\_result.output)
```
### Sample Response
Immediately after a Task Run is created, the Task Run object, including the status of the Task Run, is returned. On completion, the Task Run Result object is returned.
[Basis](/task-api/guides/access-research-basis), including citations, reasoning, confidence, and excerpts - is returned with every Task Run Result.
```json Task Run Creation theme={"system"}
{
"run\_id": "trun\_9907962f83aa4d9d98fd7f4bf745d654",
"status": "queued",
"is\_active": true,
"warnings": null,
"processor": "base",
"metadata": null,
"created\_at": "2025-04-23T20:21:48.037943Z",
"modified\_at": "2025-04-23T20:21:48.037943Z"
}
```
```json Task Run Result [expandable] theme={"system"}
{
"run": {
"run\_id": "trun\_9907962f83aa4d9d98fd7f4bf745d654",
"status": "completed",
"is\_active": false,
"warnings": null,
"processor": "base",
"metadata": null,
"created\_at": "2025-04-23T20:21:48.037943Z",
"modified\_at": "2025-04-23T20:22:47.819416Z"
},
"output": {
"content": "10-1945",
"basis": [
{
"field": "output",
"citations": [
{
"title": null,
"url": "https://www.un.org/en/about-us/history-of-the-un",
"excerpts": []
},
{
"title": null,
"url": "https://history.state.gov/milestones/1937-1945/un",
"excerpts": []
},
{
"title": null,
"url": "https://en.wikipedia.org/wiki/United\_Nations",
"excerpts": []
},
{
"title": null,
"url": "https://research.un.org/en/unmembers/founders",
"excerpts": []
}
],
"reasoning": "The founding date of the United Nations is derived from multiple sources indicating that it officially began on October 24, 1945. This date is consistently mentioned across the explored URLs including the official UN history page and other reputable references, confirming the founding date as 10-1945.",
"confidence": ""
}
],
"type": "text"
}
}
```
## 3. From Simple to Rich Enrichment
The Task API supports increasingly sophisticated enrichment patterns:

The simplest enrichment: take one piece of data (like a company name) and add one new field (like founding date). This straightforward approach is illustrated above.

Enrich a single input field with multiple new data points. For example, pass in a company name and receive founding date, employee count, and funding sources.
```bash cURL [expandable] theme={"system"}
echo "Creating the run:"
RUN\_JSON=$(curl -s 'https://api.parallel.ai/v1/tasks/runs' \
-H "x-api-key: ${PARALLEL\_API\_KEY}" \
-H 'Content-Type: application/json' \
-d '{
"input": "United Nations",
"processor": "core",
"task\_spec": {
"output\_schema": {
"type": "json",
"json\_schema": {
"type": "object",
"properties": {
"founding\_date": {
"type": "string",
"description": "The official founding date of the company in the format MM-YYYY"
},
"employee\_count": {
"type": "string",
"enum": [
"1-10 employees",
"11-50 employees",
"51-200 employees",
"201-500 employees",
"501-1000 employees",
"1001-5000 employees",
"5001-10000 employees",
"10001+ employees"
],
"description": "The range of employees working at the company. Choose the most accurate range possible and make sure to validate across multiple sources."
},
"funding\_sources": {
"type": "string",
"description": "A detailed description, containing 1-4 sentences, of the company's funding sources, including their estimated value."
}
},
"required": ["founding\_date", "employee\_count", "funding\_sources"],
"additionalProperties": false
}
}
}
}')
echo "$RUN\_JSON" | jq .
RUN\_ID=$(echo "$RUN\_JSON" | jq -r '.run\_id')
echo "Retrieving the run result, blocking until the result is available:"
curl -s "https://api.parallel.ai/v1/tasks/runs/${RUN\_ID}/result" \
-H "x-api-key: ${PARALLEL\_API\_KEY}" | jq .
```
```typescript TypeScript [expandable] theme={"system"}
import Parallel from 'parallel-web';
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY,
});
const taskRun = await client.taskRun.create({
input: 'United Nations',
processor: 'core',
task\_spec: {
output\_schema: {
type: 'json',
json\_schema: {
type: 'object',
properties: {
founding\_date: {
type: 'string',
description: 'The official founding date of the company in the format MM-YYYY',
},
employee\_count: {
type: 'string',
enum: [
'1-10 employees',
'11-50 employees',
'51-200 employees',
'201-500 employees',
'501-1000 employees',
'1001-5000 employees',
'5001-10000 employees',
'10001+ employees',
],
description: 'The range of employees working at the company. Choose the most accurate range possible and make sure to validate across multiple sources.',
},
funding\_sources: {
type: 'string',
description: "A detailed description, containing 1-4 sentences, of the company's funding sources, including their estimated value.",
},
},
required: ['founding\_date', 'employee\_count', 'funding\_sources'],
additionalProperties: false,
},
},
},
});
console.log(`Run ID: ${taskRun.run\_id}`);
// Poll for results with 25-second timeout, retry up to 144 times (1 hour total)
let runResult;
for (let i = 0; i < 144; i++) {
try {
runResult = await client.taskRun.result(taskRun.run\_id, { timeout: 25 });
break;
} catch (error) {
if (i === 143) throw error; // Last attempt failed
await new Promise((resolve) => setTimeout(resolve, 1000));
}
}
console.log(runResult.output);
```
```python Python [expandable] theme={"system"}
import os
from parallel import Parallel
from pydantic import BaseModel, Field
from typing import Literal
class CompanyOutput(BaseModel):
founding\_date: str = Field(
description="The official founding date of the company in the format MM-YYYY"
)
employee\_count: Literal[
"1-10 employees",
"11-50 employees",
"51-200 employees",
"201-500 employees",
"501-1000 employees",
"1001-5000 employees",
"5001-10000 employees",
"10001+ employees"
] = Field(
description="The range of employees working at the company. Choose the most accurate range possible and make sure to validate across multiple sources."
)
funding\_sources: str = Field(
description="A detailed description, containing 1-4 sentences, of the company's funding sources, including their estimated value."
)
def main():
client = Parallel(api\_key="PARALLEL\_API\_KEY")
task\_run = client.task\_run.create(
input="United Nations",
task\_spec={
"output\_schema":{
"type":"json",
"json\_schema":CompanyOutput.model\_json\_schema()
}
},
processor="core"
)
print(f"Run ID: {task\_run.run\_id}")
run\_result = client.task\_run.result(task\_run.run\_id, api\_timeout=3600)
print(run\_result.output)
if \_\_name\_\_ == "\_\_main\_\_":
main()
```
```python Python (Async) [expandable] theme={"system"}
import asyncio
import os
from parallel import AsyncParallel
from pydantic import BaseModel, Field
from typing import Literal
class CompanyOutput(BaseModel):
founding\_date: str = Field(
description="The official founding date of the company in the format MM-YYYY"
)
employee\_count: Literal[
"1-10 employees",
"11-50 employees",
"51-200 employees",
"201-500 employees",
"501-1000 employees",
"1001-5000 employees",
"5001-10000 employees",
"10001+ employees"
] = Field(
description="The range of employees working at the company. Choose the most accurate range possible and make sure to validate across multiple sources."
)
funding\_sources: str = Field(
description="A detailed description, containing 1-4 sentences, of the company's funding sources, including their estimated value."
)
async def main():
client = AsyncParallel(api\_key="PARALLEL\_API\_KEY")
task\_run = await client.task\_run.create(
input="United Nations",
task\_spec={
"output\_schema":{
"type":"json",
"json\_schema":CompanyOutput.model\_json\_schema()
}
},
processor="core"
)
print(f"Run ID: {task\_run.run\_id}")
run\_result = await client.task\_run.result(task\_run.run\_id, api\_timeout=3600)
print(run\_result.output)
if \_\_name\_\_ == "\_\_main\_\_":
asyncio.run(main())
```

The full enrichment pattern: define both input and output schemas. Provide multiple data fields you already have (company name and website) and specify all the fields you want to enrich. This is the most common pattern for enriching CRM data, compliance checks, and other structured workflows.
```bash cURL [expandable] theme={"system"}
echo "Creating the run:"
RUN\_JSON=$(curl -s 'https://api.parallel.ai/v1/tasks/runs' \
-H "x-api-key: ${PARALLEL\_API\_KEY}" \
-H 'Content-Type: application/json' \
-d '{
"input": {
"company\_name": "United Nations",
"company\_website": "www.un.org"
},
"processor": "core",
"task\_spec": {
"output\_schema": {
"type": "json",
"json\_schema": {
"type": "object",
"properties": {
"founding\_date": {
"type": "string",
"description": "The official founding date of the company in the format MM-YYYY"
},
"employee\_count": {
"type": "string",
"enum":[
"1-10 employees",
"11-50 employees",
"51-200 employees",
"201-500 employees",
"501-1000 employees",
"1001-5000 employees",
"5001-10000 employees",
"10001+ employees"
],
"description": "The range of employees working at the company. Choose the most accurate range possible and make sure to validate across multiple sources."
},
"funding\_sources": {
"type": "string",
"description": "A detailed description, containing 1-4 sentences, of the company's funding sources, including their estimated value."
}
},
"required": ["founding\_date", "employee\_count", "funding\_sources"],
"additionalProperties": false
}
},
"input\_schema": {
"type": "json",
"json\_schema": {
"type": "object",
"properties": {
"company\_name": {
"type": "string",
"description": "The name of the company to research"
},
"company\_website": {
"type": "string",
"description": "The website of the company to research"
}
},
"required": ["company\_name", "company\_website"]
}
}
}
}')
echo "$RUN\_JSON" | jq .
RUN\_ID=$(echo "$RUN\_JSON" | jq -r '.run\_id')
echo "Retrieving the run result, blocking until the result is available:"
curl -s "https://api.parallel.ai/v1/tasks/runs/${RUN\_ID}/result" \
-H "x-api-key: ${PARALLEL\_API\_KEY}" | jq .
```
```typescript TypeScript [expandable] theme={"system"}
import Parallel from 'parallel-web';
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY,
});
// Define input and output schemas
const inputSchema = {
type: 'object' as const,
properties: {
company\_name: {
type: 'string' as const,
description: 'The name of the company to research',
},
company\_website: {
type: 'string' as const,
description: 'The website of the company to research',
},
},
required: ['company\_name', 'company\_website'],
};
const outputSchema = {
type: 'object' as const,
properties: {
founding\_date: {
type: 'string' as const,
description: 'The official founding date of the company in the format MM-YYYY',
},
employee\_count: {
type: 'string' as const,
enum: [
'1-10 employees',
'11-50 employees',
'51-200 employees',
'201-500 employees',
'501-1000 employees',
'1001-5000 employees',
'5001-10000 employees',
'10001+ employees',
],
description: 'The range of employees working at the company. Choose the most accurate range possible and validate across multiple sources.',
},
funding\_sources: {
type: 'string' as const,
description: "A detailed description, containing 1–4 sentences, of the company's funding sources, including their estimated value.",
},
},
required: ['founding\_date', 'employee\_count', 'funding\_sources'],
additionalProperties: false,
};
const taskRun = await client.taskRun.create({
input: {
company\_name: 'United Nations',
company\_website: 'www.un.org',
},
processor: 'core',
task\_spec: {
input\_schema: {
type: 'json',
json\_schema: inputSchema,
},
output\_schema: {
type: 'json',
json\_schema: outputSchema,
},
},
});
console.log(`Run ID: ${taskRun.run\_id}`);
// Poll for results with 25-second timeout, retry up to 144 times (1 hour total)
let runResult;
for (let i = 0; i < 144; i++) {
try {
runResult = await client.taskRun.result(taskRun.run\_id, { timeout: 25 });
break;
} catch (error) {
if (i === 143) throw error; // Last attempt failed
await new Promise((resolve) => setTimeout(resolve, 1000));
}
}
console.log(runResult.output);
```
```python Python [expandable] theme={"system"}
import os
from typing import Literal
from parallel import Parallel
from parallel.lib.\_parsing.\_task\_run\_result import task\_run\_result\_parser
from parallel.types import TaskSpecParam
from pydantic import BaseModel, Field
class CompanyInput(BaseModel):
"""Input schema for the company research task."""
company\_name: str = Field(description="The name of the company to research")
company\_website: str = Field(description="The website of the company to research")
class CompanyOutput(BaseModel):
"""Output schema for the company research task."""
founding\_date: str = Field(
description="The official founding date of the company in the format MM-YYYY"
)
employee\_count: Literal[
"1-10 employees",
"11-50 employees",
"51-200 employees",
"201-500 employees",
"501-1000 employees",
"1001-5000 employees",
"5001-10000 employees",
"10001+ employees",
] = Field(
description="The range of employees working at the company. Choose the most accurate range possible and validate across multiple sources."
)
funding\_sources: str = Field(
description="A detailed description, containing 1–4 sentences, of the company's funding sources, including their estimated value."
)
def build\_task\_spec\_param(
input\_schema: type[BaseModel], output\_schema: type[BaseModel]
) -> TaskSpecParam:
"""Build a TaskSpecParam from an input and output schema."""
return {
"input\_schema": {
"type": "json",
"json\_schema": input\_schema.model\_json\_schema(),
},
"output\_schema": {
"type": "json",
"json\_schema": output\_schema.model\_json\_schema(),
},
}
client = Parallel(api\_key=os.environ.get("PARALLEL\_API\_KEY"))
# Prepare structured input
input\_data = CompanyInput(
company\_name="United Nations", company\_website="htt"
)
task\_spec = build\_task\_spec\_param(CompanyInput, CompanyOutput)
task\_run = client.task\_run.create(
input=input\_data.model\_dump(),
task\_spec=task\_spec,
processor="core",
)
print(f"Run ID: {task\_run.run\_id}")
run\_result = client.task\_run.result(task\_run.run\_id, api\_timeout=3600)
parsed\_result = task\_run\_result\_parser(run\_result, CompanyOutput)
print(parsed\_result.output.parsed)
```
```python Python (Async) [expandable] theme={"system"}
import asyncio
import os
from typing import Literal
from parallel import AsyncParallel
from parallel.lib.\_parsing.\_task\_run\_result import task\_run\_result\_parser
from parallel.types import TaskSpecParam
from pydantic import BaseModel, Field
class CompanyInput(BaseModel):
"""Input schema for the company research task."""
company\_name: str = Field(description="The name of the company to research")
company\_website: str = Field(description="The website of the company to research")
class CompanyOutput(BaseModel):
"""Output schema for the company research task."""
founding\_date: str = Field(
description="The official founding date of the company in the format MM-YYYY"
)
employee\_count: Literal[
"1-10 employees",
"11-50 employees",
"51-200 employees",
"201-500 employees",
"501-1000 employees",
"1001-5000 employees",
"5001-10000 employees",
"10001+ employees",
] = Field(
description="The range of employees working at the company. Choose the most accurate range possible and validate across multiple sources."
)
funding\_sources: str = Field(
description="A detailed description, containing 1–4 sentences, of the company's funding sources, including their estimated value."
)
def build\_task\_spec\_param(
input\_schema: type[BaseModel], output\_schema: type[BaseModel]
) -> TaskSpecParam:
"""Build a TaskSpecParam from an input and output schema."""
return {
"input\_schema": {
"type": "json",
"json\_schema": input\_schema.model\_json\_schema(),
},
"output\_schema": {
"type": "json",
"json\_schema": output\_schema.model\_json\_schema(),
},
}
async def main():
# Initialize the Parallel client
client = AsyncParallel(api\_key="PARALLEL\_API\_KEY")
# Prepare structured input
input\_data = CompanyInput(
company\_name="United Nations", company\_website="www.un.org"
)
task\_spec = build\_task\_spec\_param(CompanyInput, CompanyOutput)
task\_run = await client.task\_run.create(
input=input\_data.model\_dump(),
task\_spec=task\_spec,
processor="core",
)
print(f"Run ID: {task\_run.run\_id}")
run\_result = await client.task\_run.result(task\_run.run\_id, api\_timeout=3600)
parsed\_result = task\_run\_result\_parser(run\_result, CompanyOutput)
print(parsed\_result.output.parsed)
if \_\_name\_\_ == "\_\_main\_\_":
asyncio.run(main())
```

\*\*Writing Effective Task Specs\*\*: For best practices on defining input and output schemas that produce high-quality results, see our [Task Spec Best Practices guide](/task-api/guides/specify-a-task#task-spec-best-practices).
### Sample Enrichment Result
```json [expandable] theme={"system"}
{
"run": {
"run\_id": "trun\_0824bb53c79c407b89614ba22e9db51c",
"status": "completed",
"is\_active": false,
"warnings": [],
"processor": "core",
"metadata": null,
"created\_at": "2025-04-24T16:05:03.403102Z",
"modified\_at": "2025-04-24T16:05:33.099450Z"
},
"output": {
"content": {
"funding\_sources": "The United Nations' funding comes from governments, multilateral partners, and other non-state entities. This funding is acquired through assessed and voluntary contributions from its member states.",
"employee\_count": "10001+ employees",
"founding\_date": "10-1945"
},
"basis": [
{
"field": "funding\_sources",
"citations": [
{
"title": "Funding sources",
"url": "https://www.financingun.report/un-financing/un-funding/funding-entity",
"excerpts": [
"The UN system is funded by a diverse set of partners: governments, multilateral partners, and other non-state funding."
]
},
{
"title": "US Funding for the UN",
"url": "https://betterworldcampaign.org/us-funding-for-the-un",
"excerpts": [
"Funding from Member States for the UN system comes from two main sources: assessed and voluntary contributions."
]
}
],
"reasoning": "The United Nations' funding is derived from a diverse set of partners, including governments, multilateral organizations, and other non-state entities, as stated by financingun.report. According to betterworldcampaign.org, the funding from member states is acquired through both assessed and voluntary contributions.",
"confidence": "high"
},
{
"field": "employee\_count",
"citations": [
{
"title": "Funding sources",
"url": "https://www.financingun.report/un-financing/un-funding/funding-entity",
"excerpts": []
}
],
"reasoning": "The UN employs approximately 37,000 people, with a total personnel count of 133,126 in 2023.",
"confidence": "low"
},
{
"field": "founding\_date",
"citations": [
{
"title": "Funding sources",
"url": "https://www.financingun.report/un-financing/un-funding/funding-entity",
"excerpts": []
},
{
"title": "History of the United Nations",
"url": "https://www.un.org/en/about-us/history-of-the-un",
"excerpts": [
"The United Nations officially began, on 24 October 1945, when it came into existence after its Charter had been ratified by China, France, the Soviet Union, ..."
]
},
{
"title": "The Formation of the United Nations, 1945",
"url": "https://history.state.gov/milestones/1937-1945/un",
"excerpts": [
"The United Nations came into existence on October 24, 1945, after 29 nations had ratified the Charter. Table of Contents. 1937–1945: Diplomacy and the Road to ..."
]
}
],
"reasoning": "The United Nations officially began on October 24, 1945, as stated in multiple sources including the UN's official history and the US Department of State's historical milestones. This date is when the UN came into existence after its Charter was ratified by key member states.",
"confidence": "high"
}
],
"type": "json"
}
}
```
## Next Steps
\* [\*\*Task Groups:\*\*](/task-api/group-api) Enrich multiple records concurrently with parallel execution and batch tracking
\* [\*\*Task Spec Best Practices:\*\*](/task-api/guides/specify-a-task) Optimize your input and output schemas for accuracy and speed
\* [\*\*Choose a Processor:\*\*](/task-api/guides/choose-a-processor) Select the right processor tier for your enrichment use case
\* [\*\*Access Research Basis:\*\*](/task-api/guides/access-research-basis) Understand citations, confidence levels, and reasoning for every enriched field
\* [\*\*Deep Research:\*\*](/task-api/examples/task-deep-research) Explore open-ended research without structured input data
\* [\*\*Streaming Events:\*\*](/task-api/task-sse) Receive real-time updates via Server-Sent Events for long-running enrichments
\* [\*\*Webhooks:\*\*](/task-api/webhooks) Configure HTTP callbacks for task completion notifications
\* [\*\*API Reference:\*\*](/api-reference/tasks/create-task-run) Complete endpoint documentation for the Task API
## Rate Limits
See [Rate Limits](/getting-started/rate-limits) for default quotas and how to request higher limits.
