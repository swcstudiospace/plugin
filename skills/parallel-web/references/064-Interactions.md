# Interactions

Source: https://docs.parallel.ai/task-api/guides/interactions.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Interactions
> Chain context across multiple API calls using interaction IDs

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

## Overview
Interactions let you chain context between API calls. Each response includes an `interaction\_id`, which you can pass as `previous\_interaction\_id` in a subsequent request to carry forward the context from the previous call. This enables multi-turn research workflows like follow-up questions, iterative refinement, and conversational agents.
Interactions work across both the [Task API](/task-api/task-quickstart) and [Chat API](/chat-api/chat-quickstart).
## How It Works
1. \*\*Make an initial request\*\* — the response includes an `interaction\_id`
2. \*\*Pass it forward\*\* — include that value as `previous\_interaction\_id` in your next request
3. \*\*Continue the chain\*\* — each new response returns its own `interaction\_id`, so you can keep building on prior context
![Diagram of multi-turn interactions chaining context across API calls](https://mintcdn.com/parallel-6fabab31-mtje7p526we/0oYmis0NG3aekxml/images/multi_turn.jpg?fit=max&auto=format&n=0oYmis0NG3aekxml&q=85&s=d3e7dc759ed9b5ffe6f22d093f031a95)
## Request and Response Fields
| Field | Location | Description |
| ------------------------- | ------------------ | --------------------------------------------------------------------------------- |
| `previous\_interaction\_id` | Request (optional) | Interaction ID from a prior call to use as context |
| `interaction\_id` | Response | Identifier for this interaction — pass as `previous\_interaction\_id` in follow-ups |
These fields are available on both Task API (`BetaTaskRunInput`) and Chat API (`ChatCompletionRequest`) requests, and their corresponding responses.
## Task API Usage
```python Python theme={"system"}
from parallel import Parallel
from parallel.types import TaskSpecParam, TextSchemaParam
client = Parallel()
# Initial request
task\_run = client.task\_run.create(
input="What are the main pricing models used by SaaS companies?",
processor="core",
task\_spec=TaskSpecParam(output\_schema=TextSchemaParam()),
)
result = client.task\_run.result(task\_run.run\_id, api\_timeout=3600)
# Follow-up using the interaction ID
followup = client.task\_run.create(
input="Which of these works best for enterprise customers?",
processor="core",
previous\_interaction\_id=task\_run.interaction\_id,
task\_spec=TaskSpecParam(output\_schema=TextSchemaParam()),
)
followup\_result = client.task\_run.result(followup.run\_id, api\_timeout=3600)
```
```typescript TypeScript theme={"system"}
import Parallel from "parallel-web";
const client = new Parallel();
async function pollResult(runId: string) {
for (let i = 0; i < 20; i++) {
try {
return await client.taskRun.result(runId, { timeout: 25 });
} catch (error) {
if (i === 19) throw error;
await new Promise((resolve) => setTimeout(resolve, 1000));
}
}
}
// Initial request
const taskRun = await client.taskRun.create({
input: "What are the main pricing models used by SaaS companies?",
processor: "core",
task\_spec: { output\_schema: { type: "text" } },
});
const result = await pollResult(taskRun.run\_id);
// Follow-up using the interaction ID
const followup = await client.taskRun.create({
input: "Which of these works best for enterprise customers?",
processor: "core",
previous\_interaction\_id: taskRun.interaction\_id,
task\_spec: { output\_schema: { type: "text" } },
});
const followupResult = await pollResult(followup.run\_id);
```
```bash cURL theme={"system"}
# Initial request
RUN\_JSON=$(curl -s "https://api.parallel.ai/v1/tasks/runs" \
-H "x-api-key: ${PARALLEL\_API\_KEY}" \
-H "Content-Type: application/json" \
-d '{
"input": "What are the main pricing models used by SaaS companies?",
"processor": "core",
"task\_spec": { "output\_schema": { "type": "text" } }
}')
INTERACTION\_ID=$(echo "$RUN\_JSON" | jq -r '.interaction\_id')
RUN\_ID=$(echo "$RUN\_JSON" | jq -r '.run\_id')
# Poll for result...
# Follow-up using the interaction ID
curl -s "https://api.parallel.ai/v1/tasks/runs" \
-H "x-api-key: ${PARALLEL\_API\_KEY}" \
-H "Content-Type: application/json" \
-d "{
\"input\": \"Which of these works best for enterprise customers?\",
\"processor\": \"core\",
\"previous\_interaction\_id\": \"${INTERACTION\_ID}\",
\"task\_spec\": { \"output\_schema\": { \"type\": \"text\" } }
}"
```
## Cross-Processor Interactions
You can chain interactions across different processors of the Task API.
Interactions are \*\*not available\*\* for Zero Data Retention (ZDR) customers.
## Next Steps
\* [\*\*Interactive Research:\*\*](/task-api/examples/interactive-research) Build an interactive research app using interactions
\* [\*\*Deep Research:\*\*](/task-api/examples/task-deep-research) Comprehensive single-turn research
\* [\*\*Enrichment:\*\*](/task-api/examples/task-enrichment) Structured data enrichment
