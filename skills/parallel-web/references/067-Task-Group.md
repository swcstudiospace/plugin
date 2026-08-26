# Task Group

Source: https://docs.parallel.ai/task-api/group-api.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Task Group
> Batch process Tasks at scale with the Parallel Task Group API

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

The Parallel Task Group API enables you to batch process hundreds or thousands of Tasks efficiently. Instead of running Tasks one by one, you can organize them into groups, monitor their progress collectively, and retrieve results in bulk. The API is comprised of the following endpoints:
\*\*Creation\*\*: To run a batch of tasks in a group, you first need to create a task group, after which you can add runs to it, which will be queued and processed.
\* `POST /v1/tasks/groups` (Create task-group)
\* `POST /v1/tasks/groups/{taskgroup\_id}/runs` (Add runs. Up to 1,000 runs per POST request.)
\*\*Progress Snapshot\*\*: At any moment during the task, you can get an instant snapshot of the state of it using `GET /{taskgroup\_id}` and `GET /{taskgroup\_id}/runs`. Please note that the runs endpoint streams back the requested runs instantly (using SSE) to allow for large payloads without pagination, and it doesn't wait for runs to complete. Runs in a task group are stored indefinitely, so unless you have high performance requirements, you may not need to keep your own state of the intermediate results. However, it's recommended to still do so after the task group is completed.
\* `GET /v1/tasks/groups/{taskgroup\_id}` (Get task-group summary)
\* `GET /v1/tasks/groups/{taskgroup\_id}/runs` (Fetch task group runs)
\*\*Realtime updates\*\*: You may want to provide efficient real-time updates to your app. For a high-level summary and run completion events, you can use `GET /{taskgroup\_id}/events`. To also retrieve the task run result upon completion you can use the [task run endpoint](/api-reference/tasks/retrieve-task-run-result)
\* `GET /v1/tasks/groups/{taskgroup\_id}/events` (Stream task-group events)
\* `GET /v1/tasks/runs/{run\_id}/result` (Get task-run result)
To determine whether a task group is fully completed, you can either use realtime update events, or you can poll the task-group summary endpoint. You can also keep adding runs to your task group indefinitely.
## Key Concepts
### Task Groups
A Task Group is a container that organizes multiple task runs. Each group has:
\* A unique `taskgroup\_id` for identification
\* A status object with `is\_active` (boolean) and `task\_run\_status\_counts` (counts by status)
\* The ability to add new Tasks dynamically
### Group Status
Track progress with real-time status updates:
\* Total number of task runs
\* Count of runs by status (queued, running, completed, failed)
\* Whether the group is still active (`is\_active` becomes `false` when all runs finish)
\* Human-readable status messages
## Quick Start
### 1. Define Types and Task Structure
```bash cURL theme={"system"}
# Define task specification as a variable
TASK\_SPEC='{
"input\_schema": {
"json\_schema": {
"type": "object",
"properties": {
"company\_name": {
"type": "string",
"description": "Name of the company"
},
"company\_website": {
"type": "string",
"description": "Company website URL"
}
},
"required": ["company\_name", "company\_website"]
}
},
"output\_schema": {
"json\_schema": {
"type": "object",
"properties": {
"key\_insights": {
"type": "array",
"items": {"type": "string"},
"description": "Key business insights"
},
"market\_position": {
"type": "string",
"description": "Market positioning analysis"
}
},
"required": ["key\_insights", "market\_position"]
}
}
}'
```
```python Python theme={"system"}
import pydantic
from parallel import AsyncParallel
from parallel.types import TaskSpecParam, JsonSchemaParam
from parallel.types.run\_input\_param import RunInputParam
# Define your input and output models
class CompanyInput(pydantic.BaseModel):
company\_name: str = pydantic.Field(description="Name of the company")
company\_website: str = pydantic.Field(description="Company website URL")
class CompanyOutput(pydantic.BaseModel):
key\_insights: list[str] = pydantic.Field(description="Key business insights")
market\_position: str = pydantic.Field(description="Market positioning analysis")
# Create reusable task specification
task\_spec = TaskSpecParam(
input\_schema=JsonSchemaParam(json\_schema=CompanyInput.model\_json\_schema()),
output\_schema=JsonSchemaParam(json\_schema=CompanyOutput.model\_json\_schema()),
)
```
```typescript TypeScript theme={"system"}
import Parallel from "parallel-web";
// Define your input and output types
interface CompanyInput {
company\_name: string;
company\_website: string;
}
interface CompanyOutput {
key\_insights: string[];
market\_position: string;
}
// Use SDK types for Task Group API
type TaskGroupObject = Parallel.TaskGroup;
type TaskGroupStatus = Parallel.TaskGroupStatus;
type TaskGroupRunResponse = Parallel.TaskGroupRunResponse;
type TaskGroupEventsResponse = Parallel.TaskGroupEventsResponse;
type TaskGroupGetRunsResponse = Parallel.TaskGroupGetRunsResponse;
// Create reusable task specification using SDK types
const taskSpec: Parallel.TaskSpec = {
input\_schema: {
type: "json",
json\_schema: {
type: "object",
properties: {
company\_name: {
type: "string",
description: "Name of the company",
},
company\_website: {
type: "string",
description: "Company website URL",
},
},
required: ["company\_name", "company\_website"],
},
},
output\_schema: {
type: "json",
json\_schema: {
type: "object",
properties: {
key\_insights: {
type: "array",
items: { type: "string" },
description: "Key business insights",
},
market\_position: {
type: "string",
description: "Market positioning analysis",
},
},
required: ["key\_insights", "market\_position"],
},
},
};
```
### 2. Create a Task Group
```bash cURL theme={"system"}
# Create task group and capture the ID
response=$(curl --request POST \
--url https://api.parallel.ai/v1/tasks/groups \
--header 'Content-Type: application/json' \
--header "x-api-key: ${PARALLEL\_API\_KEY}" \
--data '{}')
# Extract taskgroup\_id from response
TASKGROUP\_ID=$(echo $response | jq -r '.taskgroup\_id')
echo "Created task group: $TASKGROUP\_ID"
```
```python Python theme={"system"}
# Initialize the client
client = AsyncParallel(api\_key="PARALLEL\_API\_KEY")
# Create a new task group
task\_group = await client.task\_group.create()
taskgroup\_id = task\_group.task\_group\_id
print(f"Created task group: {taskgroup\_id}")
```
```typescript TypeScript theme={"system"}
// Initialize the client
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY,
});
// Create a new task group
const groupResponse = await client.taskGroup.create({});
const taskgroupId = groupResponse.taskgroup\_id;
console.log(`Created task group: ${taskgroupId}`);
```
### 3. Add Tasks to the Group
By default, the response refreshes and returns the latest status of all runs in the group. If you're adding tasks at scale and don't need a fresh status on each response, set `refresh\_status` to `false` for faster responses — the response will still include a cached status. You can retrieve the latest status at any time via the [GET task-group endpoint](/api-reference/tasks/retrieve-task-group).
```bash cURL theme={"system"}
curl --request POST \
--url https://api.parallel.ai/v1/tasks/groups/${TASKGROUP\_ID}/runs \
--header 'Content-Type: application/json' \
--header "x-api-key: ${PARALLEL\_API\_KEY}" \
--data '{
"default\_task\_spec": '$TASK\_SPEC',
"inputs": [
{
"input": {
"company\_name": "Acme Corp",
"company\_website": "https://acme.com"
},
"processor": "pro"
},
{
"input": {
"company\_name": "TechStart",
"company\_website": "https://techstart.io"
},
"processor": "pro"
}
]
}'
```
```python Python theme={"system"}
# Prepare your inputs
companies = [
{"company\_name": "Acme Corp", "company\_website": "https://acme.com"},
{"company\_name": "TechStart", "company\_website": "https://techstart.io"},
# ... more companies
]
# Create task run inputs
run\_inputs = [
RunInputParam(
input=CompanyInput(\*\*company).model\_dump(),
processor="pro",
)
for company in companies
]
# Add runs to the group
response = await client.task\_group.add\_runs(
taskgroup\_id,
inputs=run\_inputs,
default\_task\_spec=task\_spec,
)
print(f"Added {len(response.run\_ids)} Tasks to group")
```
```typescript TypeScript theme={"system"}
// Prepare your inputs
const companies = [
{ company\_name: "Acme Corp", company\_website: "https://acme.com" },
{ company\_name: "TechStart", company\_website: "https://techstart.io" },
// ... more companies
];
// Create task run inputs using SDK types
const runInputs: Array = companies.map((company) => ({
input: {
company\_name: company.company\_name,
company\_website: company.company\_website,
},
processor: "pro",
}));
// Add runs to the group
const response = await client.taskGroup.addRuns(taskgroupId, {
default\_task\_spec: taskSpec,
inputs: runInputs,
});
console.log(`Added ${response.run\_ids.length} Tasks to group`);
```
### 4. Monitor Progress
```bash cURL theme={"system"}
# Get status of the group
curl --request GET \
--url https://api.parallel.ai/v1/tasks/groups/${TASKGROUP\_ID} \
--header "x-api-key: ${PARALLEL\_API\_KEY}"
# Get status of all runs in the group
curl --request GET \
--no-buffer \
--url https://api.parallel.ai/v1/tasks/groups/${TASKGROUP\_ID}/runs \
--header "x-api-key: ${PARALLEL\_API\_KEY}"
```
```python Python theme={"system"}
import asyncio
async def wait\_for\_completion(client: AsyncParallel, taskgroup\_id: str) -> None:
while True:
task\_group = await client.task\_group.retrieve(taskgroup\_id)
status = task\_group.status
print(f"Status: {status.task\_run\_status\_counts}")
if not status.is\_active:
print("All tasks completed!")
break
await asyncio.sleep(10)
asyncio.run(wait\_for\_completion(client, taskgroup\_id))
```
```typescript TypeScript theme={"system"}
async function waitForCompletion(
client: Parallel,
taskgroupId: string
): Promise {
while (true) {
const response = await client.taskGroup.retrieve(taskgroupId);
const status = response.status;
console.log("Status:", status.task\_run\_status\_counts);
if (!status.is\_active) {
console.log("All tasks completed!");
break;
}
// Wait 10 seconds before checking again
await new Promise((resolve) => setTimeout(resolve, 10000));
}
}
async function main() {
const client = new Parallel({ apiKey: process.env["PARALLEL\_API\_KEY"] });
// ... create task group and get taskgroupId ...
await waitForCompletion(client, taskgroupId);
}
main();
```
### 5. Retrieve Results
The `getRuns` endpoint returns a \*\*Server-Sent Events stream\*\*, not a simple JSON response. It emits one event per run currently in the group (a snapshot of each run's state), then closes. To pick up runs added after that snapshot, resume from the last `event\_id` via the `last\_event\_id` parameter.
Each event in the stream has:
\* `type`: Either `"task\_run.state"` or `"error"`
\* `event\_id`: Cursor for resuming the stream via the `last\_event\_id` parameter
\* `run`: The `TaskRun` object with `run\_id`, `status`, and `is\_active`
\* `input`: The original input (only included when `include\_input=true`)
\* `output`: The result output (only included when `include\_output=true` \*\*and\*\* the run completed successfully)
If you want a live stream of completion transitions and group-level status updates instead of a snapshot, use the `/events` endpoint shown below the `getRuns` examples.
```bash cURL theme={"system"}
# Snapshot of each run's current state (matches the Python/TS getRuns examples)
curl --request GET \
--no-buffer \
--url "https://api.parallel.ai/v1/tasks/groups/${TASKGROUP\_ID}/runs?include\_input=true&include\_output=true" \
--header "x-api-key: ${PARALLEL\_API\_KEY}"
# Live stream of run-completion + group-status events (stays open while runs are active)
curl --request GET \
--no-buffer \
--url https://api.parallel.ai/v1/tasks/groups/${TASKGROUP\_ID}/events \
--header "x-api-key: ${PARALLEL\_API\_KEY}"
```
```python Python theme={"system"}
from parallel.types.task\_run\_event import TaskRunEvent
from parallel.types.error\_event import ErrorEvent
# Stream all results from the group
async def get\_all\_results(client: AsyncParallel, taskgroup\_id: str):
results = []
run\_stream = await client.task\_group.get\_runs(
taskgroup\_id,
include\_input=True,
include\_output=True,
)
async for event in run\_stream:
if isinstance(event, TaskRunEvent) and event.output:
company\_output = CompanyOutput.model\_validate(event.output.content)
results.append(
{
"company": event.input.input["company\_name"],
"insights": company\_output.key\_insights,
"market\_position": company\_output.market\_position,
}
)
elif isinstance(event, ErrorEvent):
print(f"Error: {event.error}")
return results
results = await get\_all\_results(client, taskgroup\_id)
print(f"Processed {len(results)} companies successfully")
```
```typescript TypeScript theme={"system"}
// Stream all results from the group
async function getAllResults(
client: Parallel,
taskgroupId: string
): Promise<
Array<{ company: string; insights: string[]; market\_position: string }>
> {
const results: Array<{
company: string;
insights: string[];
market\_position: string;
}> = [];
// Use the SDK's streaming API
const runStream = await client.taskGroup.getRuns(taskgroupId, {
include\_input: true,
include\_output: true,
});
for await (const event of runStream) {
// Handle task run events
if (event.type === "task\_run.state" && event.output) {
const input = event.input?.input as CompanyInput;
const output = (event.output as Parallel.TaskRunJsonOutput)
.content as unknown as CompanyOutput;
results.push({
company: input.company\_name,
insights: output.key\_insights,
market\_position: output.market\_position,
});
}
}
return results;
}
const results = await getAllResults(client, taskgroupId);
console.log(`Processed ${results.length} companies successfully`);
```
## Batch Processing Pattern
For large datasets, process Tasks in batches to optimize performance. Setting `refresh\_status` to `false` is recommended when adding tasks in bulk, as it skips refreshing the group status on each request for faster responses:
```python Python theme={"system"}
async def process\_companies\_in\_batches(
client: AsyncParallel,
taskgroup\_id: str,
companies: list[dict[str, str]],
batch\_size: int = 500,
) -> None:
total\_created = 0
for i in range(0, len(companies), batch\_size):
batch = companies[i : i + batch\_size]
# Create run inputs for this batch
run\_inputs = [
RunInputParam(
input=CompanyInput(\*\*company).model\_dump(),
processor="pro",
)
for company in batch
]
# Add batch to group (skip status refresh for faster bulk adds)
response = await client.task\_group.add\_runs(
taskgroup\_id,
inputs=run\_inputs,
default\_task\_spec=task\_spec,
refresh\_status=False,
)
total\_created += len(response.run\_ids)
print(f"Processed {i + len(batch)} companies. Created {total\_created} Tasks.")
```
```typescript TypeScript theme={"system"}
async function processCompaniesInBatches(
client: Parallel,
taskgroupId: string,
companies: Array<{ company\_name: string; company\_website: string }>,
batchSize: number = 500
): Promise {
let totalCreated = 0;
for (let i = 0; i < companies.length; i += batchSize) {
const batch = companies.slice(i, i + batchSize);
// Create run inputs for this batch using SDK types
const runInputs: Array = batch.map((company) => ({
input: {
company\_name: company.company\_name,
company\_website: company.company\_website,
},
processor: "pro",
}));
// Add batch to group (skip status refresh for faster bulk adds)
const response = await client.taskGroup.addRuns(taskgroupId, {
default\_task\_spec: taskSpec,
inputs: runInputs,
refresh\_status: false,
});
totalCreated += response.run\_ids.length;
console.log(
`Processed ${i + batch.length} companies. Created ${totalCreated} Tasks.`
);
}
}
```
## Error Handling
The Group API provides robust error handling:
```python Python theme={"system"}
async def process\_with\_error\_handling(client: AsyncParallel, taskgroup\_id: str):
successful\_results = []
failed\_results = []
run\_stream = await client.task\_group.get\_runs(
taskgroup\_id,
include\_input=True,
include\_output=True,
)
async for event in run\_stream:
if isinstance(event, ErrorEvent):
failed\_results.append(event)
continue
if isinstance(event, TaskRunEvent) and event.output:
try:
# Validate the result
company\_output = CompanyOutput.model\_validate(event.output.content)
successful\_results.append(event)
except Exception as e:
print(f"Validation error: {e}")
failed\_results.append(event)
elif isinstance(event, TaskRunEvent):
# Run failed or was cancelled (no output)
failed\_results.append(event)
print(f"Success: {len(successful\_results)}, Failed: {len(failed\_results)}")
return successful\_results, failed\_results
```
```typescript TypeScript theme={"system"}
async function processWithErrorHandling(
client: Parallel,
taskgroupId: string
): Promise<{
successful: Array;
failed: Array;
}> {
const successful: Array = [];
const failed: Array = [];
const runStream = await client.taskGroup.getRuns(taskgroupId, {
include\_input: true,
include\_output: true,
});
for await (const event of runStream) {
if (event.type === "error") {
failed.push(event);
continue;
}
if (event.type === "task\_run.state") {
try {
// Validate the result
const input = event.input?.input as CompanyInput;
const output = event.output
? ((event.output as Parallel.TaskRunJsonOutput)
.content as CompanyOutput)
: null;
if (input && output) {
successful.push(event);
}
} catch (e) {
console.error("Validation error:", e);
failed.push(event);
}
}
}
console.log(`Success: ${successful.length}, Failed: ${failed.length}`);
return { successful, failed };
}
```
## Complete Example
Here's a complete script that demonstrates the full workflow, including all of
the setup code above.
```python Python [expandable] theme={"system"}
import asyncio
import pydantic
from parallel import AsyncParallel
from parallel.types import TaskSpecParam, JsonSchemaParam
from parallel.types.run\_input\_param import RunInputParam
from parallel.types.task\_run\_event import TaskRunEvent
from parallel.types.error\_event import ErrorEvent
# Define your input and output models
class CompanyInput(pydantic.BaseModel):
company\_name: str = pydantic.Field(description="Name of the company")
company\_website: str = pydantic.Field(description="Company website URL")
class CompanyOutput(pydantic.BaseModel):
key\_insights: list[str] = pydantic.Field(description="Key business insights")
market\_position: str = pydantic.Field(description="Market positioning analysis")
# Create reusable task specification
task\_spec = TaskSpecParam(
input\_schema=JsonSchemaParam(json\_schema=CompanyInput.model\_json\_schema()),
output\_schema=JsonSchemaParam(json\_schema=CompanyOutput.model\_json\_schema()),
)
async def wait\_for\_completion(client: AsyncParallel, taskgroup\_id: str) -> None:
while True:
task\_group = await client.task\_group.retrieve(taskgroup\_id)
status = task\_group.status
print(f"Status: {status.task\_run\_status\_counts}")
if not status.is\_active:
print("All tasks completed!")
break
await asyncio.sleep(10)
async def get\_all\_results(client: AsyncParallel, taskgroup\_id: str):
results = []
run\_stream = await client.task\_group.get\_runs(
taskgroup\_id,
include\_input=True,
include\_output=True,
)
async for event in run\_stream:
if isinstance(event, TaskRunEvent) and event.output:
company\_output = CompanyOutput.model\_validate(event.output.content)
results.append(
{
"company": event.input.input["company\_name"],
"insights": company\_output.key\_insights,
"market\_position": company\_output.market\_position,
}
)
elif isinstance(event, ErrorEvent):
print(f"Error: {event.error}")
return results
async def batch\_company\_research():
client = AsyncParallel(api\_key="PARALLEL\_API\_KEY")
# Create task group
task\_group = await client.task\_group.create()
taskgroup\_id = task\_group.task\_group\_id
print(f"Created taskgroup id {taskgroup\_id}")
# Define companies to research
companies = [
{"company\_name": "Stripe", "company\_website": "https://stripe.com"},
{"company\_name": "Shopify", "company\_website": "https://shopify.com"},
{"company\_name": "Salesforce", "company\_website": "https://salesforce.com"},
]
# Add Tasks to group
run\_inputs = [
RunInputParam(
input=CompanyInput(\*\*company).model\_dump(),
processor="pro",
)
for company in companies
]
response = await client.task\_group.add\_runs(
taskgroup\_id,
inputs=run\_inputs,
default\_task\_spec=task\_spec,
)
print(f"Added {len(response.run\_ids)} runs to taskgroup {taskgroup\_id}")
# Wait for completion and get results
await wait\_for\_completion(client, taskgroup\_id)
results = await get\_all\_results(client, taskgroup\_id)
print(f"Successfully processed {len(results)} companies")
return results
# Run the batch job
results = asyncio.run(batch\_company\_research())
```
```typescript TypeScript [expandable] theme={"system"}
import Parallel from "parallel-web";
// Define your input and output types
interface CompanyInput {
company\_name: string;
company\_website: string;
}
interface CompanyOutput {
key\_insights: string[];
market\_position: string;
}
// Use SDK types for Task Group API
type TaskGroupObject = Parallel.TaskGroup;
type TaskGroupGetRunsResponse = Parallel.TaskGroupGetRunsResponse;
// Create reusable task specification using SDK types
const taskSpec: Parallel.TaskSpec = {
input\_schema: {
type: "json",
json\_schema: {
type: "object",
properties: {
company\_name: {
type: "string",
description: "Name of the company",
},
company\_website: {
type: "string",
description: "Company website URL",
},
},
required: ["company\_name", "company\_website"],
},
},
output\_schema: {
type: "json",
json\_schema: {
type: "object",
properties: {
key\_insights: {
type: "array",
items: { type: "string" },
description: "Key business insights",
},
market\_position: {
type: "string",
description: "Market positioning analysis",
},
},
required: ["key\_insights", "market\_position"],
},
},
};
async function waitForCompletion(
client: Parallel,
taskgroupId: string
): Promise {
while (true) {
const response = await client.taskGroup.retrieve(taskgroupId);
const status = response.status;
console.log("Status:", status.task\_run\_status\_counts);
if (!status.is\_active) {
console.log("All tasks completed!");
break;
}
await new Promise((resolve) => setTimeout(resolve, 10000));
}
}
async function getAllResults(
client: Parallel,
taskgroupId: string
): Promise<
Array<{ company: string; insights: string[]; market\_position: string }>
> {
const results: Array<{
company: string;
insights: string[];
market\_position: string;
}> = [];
const runStream = await client.taskGroup.getRuns(taskgroupId, {
include\_input: true,
include\_output: true,
});
for await (const event of runStream) {
if (event.type === "task\_run.state" && event.output) {
const input = event.input?.input as CompanyInput;
const output = (event.output as Parallel.TaskRunJsonOutput)
.content as CompanyOutput;
results.push({
company: input.company\_name,
insights: output.key\_insights,
market\_position: output.market\_position,
});
}
}
return results;
}
async function batchCompanyResearch(): Promise<
Array<{ company: string; insights: string[]; market\_position: string }>
> {
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY,
});
// Create task group
const groupResponse = await client.taskGroup.create({});
const taskgroupId = groupResponse.taskgroup\_id;
console.log(`Created taskgroup id ${taskgroupId}`);
// Define companies to research
const companies = [
{ company\_name: "Stripe", company\_website: "https://stripe.com" },
{ company\_name: "Shopify", company\_website: "https://shopify.com" },
{ company\_name: "Salesforce", company\_website: "https://salesforce.com" },
];
// Add Tasks to group
const runInputs: Array = companies.map((company) => ({
input: {
company\_name: company.company\_name,
company\_website: company.company\_website,
},
processor: "pro",
}));
const response = await client.taskGroup.addRuns(taskgroupId, {
default\_task\_spec: taskSpec,
inputs: runInputs,
});
console.log(
`Added ${response.run\_ids.length} runs to taskgroup ${taskgroupId}`
);
// Wait for completion and get results
await waitForCompletion(client, taskgroupId);
const results = await getAllResults(client, taskgroupId);
console.log(`Successfully processed ${results.length} companies`);
return results;
}
// Run the batch job
const results = await batchCompanyResearch();
```
