# Interactive Research

Source: https://docs.parallel.ai/task-api/examples/interactive-research.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Interactive Research
> Build an interactive research app with multi-turn context chaining

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

## Overview
This guide walks through building an interactive research application using [interactions](/task-api/guides/interactions). By chaining `interaction\_id` values across requests, each follow-up question automatically has the full context of prior turns — so you can drill deeper into a topic without restating what was already researched.
## Example: Multi-Turn Research Session
Consider a research session where each question builds on the last:
1. \*\*"Which country won the most Winter Olympics gold medals in 2026?"\*\* — initial broad question
2. \*\*"How many medals did they win?"\*\* — a follow-up that only makes sense with context from step 1
3. \*\*"How does that compare to the second place country?"\*\* — drills deeper into the same thread
Without interactions, each request would be independent and the API wouldn't know what "they" or "second place" refers to. With interactions, context carries forward automatically.
```python Python theme={"system"}
import os
from parallel import Parallel
from parallel.types import TaskSpecParam, TextSchemaParam
client = Parallel(api\_key=os.environ["PARALLEL\_API\_KEY"])
# Turn 1: Initial question
run1 = client.task\_run.create(
input="Which country won the most Winter Olympics gold medals in 2026?",
processor="lite",
task\_spec=TaskSpecParam(output\_schema=TextSchemaParam()),
)
result1 = client.task\_run.result(run1.run\_id, api\_timeout=3600)
print(f"Turn 1: {result1.output.content}")
# Turn 2: Follow-up — "they" refers to the country from Turn 1
run2 = client.task\_run.create(
input="How many medals did they win?",
processor="lite",
previous\_interaction\_id=run1.interaction\_id,
task\_spec=TaskSpecParam(output\_schema=TextSchemaParam()),
)
result2 = client.task\_run.result(run2.run\_id, api\_timeout=3600)
print(f"Turn 2: {result2.output.content}")
# Turn 3: Drill deeper — context from both prior turns is available
run3 = client.task\_run.create(
input="How does that compare to the second place country?",
processor="lite",
previous\_interaction\_id=run2.interaction\_id,
task\_spec=TaskSpecParam(output\_schema=TextSchemaParam()),
)
result3 = client.task\_run.result(run3.run\_id, api\_timeout=3600)
print(f"Turn 3: {result3.output.content}")
```
```typescript TypeScript theme={"system"}
import Parallel from "parallel-web";
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY,
});
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
// Turn 1: Initial question
const run1 = await client.taskRun.create({
input: "Which country won the most Winter Olympics gold medals in 2026?",
processor: "lite",
task\_spec: { output\_schema: { type: "text" } },
});
const result1 = await pollResult(run1.run\_id);
console.log(`Turn 1: ${result1.output.content}`);
// Turn 2: Follow-up — "they" refers to the country from Turn 1
const run2 = await client.taskRun.create({
input: "How many medals did they win?",
processor: "lite",
previous\_interaction\_id: run1.interaction\_id,
task\_spec: { output\_schema: { type: "text" } },
});
const result2 = await pollResult(run2.run\_id);
console.log(`Turn 2: ${result2.output.content}`);
// Turn 3: Drill deeper — context from both prior turns is available
const run3 = await client.taskRun.create({
input: "How does that compare to the second place country?",
processor: "lite",
previous\_interaction\_id: run2.interaction\_id,
task\_spec: { output\_schema: { type: "text" } },
});
const result3 = await pollResult(run3.run\_id);
console.log(`Turn 3: ${result3.output.content}`);
```
```bash cURL theme={"system"}
# Turn 1: Initial question
echo "Turn 1: Which country won the most Winter Olympics gold medals in 2026?"
RUN\_JSON=$(curl -s "https://api.parallel.ai/v1/tasks/runs" \
-H "x-api-key: ${PARALLEL\_API\_KEY}" \
-H "Content-Type: application/json" \
-d '{
"input": "Which country won the most Winter Olympics gold medals in 2026?",
"processor": "lite",
"task\_spec": { "output\_schema": { "type": "text" } }
}')
RUN\_ID=$(echo "$RUN\_JSON" | jq -r '.run\_id')
INTERACTION\_ID=$(echo "$RUN\_JSON" | jq -r '.interaction\_id')
RESULT=$(curl -s "https://api.parallel.ai/v1/tasks/runs/${RUN\_ID}/result" \
-H "x-api-key: ${PARALLEL\_API\_KEY}")
echo "$RESULT" | jq -r .output.content
# Turn 2: Follow-up — "they" refers to the country from Turn 1
echo "Turn 2: How many medals did they win?"
RUN\_JSON=$(curl -s "https://api.parallel.ai/v1/tasks/runs" \
-H "x-api-key: ${PARALLEL\_API\_KEY}" \
-H "Content-Type: application/json" \
-d "{
\"input\": \"How many medals did they win?\",
\"processor\": \"lite\",
\"previous\_interaction\_id\": \"${INTERACTION\_ID}\",
\"task\_spec\": { \"output\_schema\": { \"type\": \"text\" } }
}")
RUN\_ID=$(echo "$RUN\_JSON" | jq -r '.run\_id')
INTERACTION\_ID=$(echo "$RUN\_JSON" | jq -r '.interaction\_id')
RESULT=$(curl -s "https://api.parallel.ai/v1/tasks/runs/${RUN\_ID}/result" \
-H "x-api-key: ${PARALLEL\_API\_KEY}")
echo "$RESULT" | jq -r .output.content
# Turn 3: Drill deeper — context from both prior turns is available
echo "Turn 3: How does that compare to the second place country?"
RUN\_JSON=$(curl -s "https://api.parallel.ai/v1/tasks/runs" \
-H "x-api-key: ${PARALLEL\_API\_KEY}" \
-H "Content-Type: application/json" \
-d "{
\"input\": \"How does that compare to the second place country?\",
\"processor\": \"lite\",
\"previous\_interaction\_id\": \"${INTERACTION\_ID}\",
\"task\_spec\": { \"output\_schema\": { \"type\": \"text\" } }
}")
RUN\_ID=$(echo "$RUN\_JSON" | jq -r '.run\_id')
RESULT=$(curl -s "https://api.parallel.ai/v1/tasks/runs/${RUN\_ID}/result" \
-H "x-api-key: ${PARALLEL\_API\_KEY}")
echo "$RESULT" | jq -r .output.content
```
## Building a Research Chat Loop
Wrap the interaction pattern in a loop to create a fully interactive research agent. Each user question chains off the previous answer's context.
```python Python theme={"system"}
import os
from parallel import Parallel
from parallel.types import TaskSpecParam, TextSchemaParam
client = Parallel(api\_key=os.environ["PARALLEL\_API\_KEY"])
interaction\_id = None
while True:
user\_input = input("You: ")
if user\_input.lower() in ("exit", "quit"):
break
task\_run = client.task\_run.create(
input=user\_input,
processor="lite",
task\_spec=TaskSpecParam(output\_schema=TextSchemaParam()),
\*\*({"previous\_interaction\_id": interaction\_id} if interaction\_id else {}),
)
result = client.task\_run.result(task\_run.run\_id, api\_timeout=3600)
interaction\_id = task\_run.interaction\_id
print(f"\nAgent: {result.output.content}\n")
```
```typescript TypeScript theme={"system"}
import Parallel from "parallel-web";
import \* as readline from "readline";
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY,
});
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
});
function ask(prompt: string): Promise {
return new Promise((resolve) => rl.question(prompt, resolve));
}
let interactionId: string | undefined;
while (true) {
const userInput = await ask("You: ");
if (["exit", "quit"].includes(userInput.toLowerCase())) break;
const taskRun = await client.taskRun.create({
input: userInput,
processor: "lite",
task\_spec: { output\_schema: { type: "text" } },
...(interactionId ? { previous\_interaction\_id: interactionId } : {}),
});
let result;
for (let i = 0; i < 20; i++) {
try {
result = await client.taskRun.result(taskRun.run\_id, { timeout: 25 });
break;
} catch (error) {
if (i === 19) throw error;
await new Promise((resolve) => setTimeout(resolve, 1000));
}
}
interactionId = taskRun.interaction\_id;
console.log(`\nAgent: ${result.output.content}\n`);
}
rl.close();
```
## Next Steps
\* [\*\*Deep Research:\*\*](/task-api/examples/task-deep-research) Comprehensive single-turn research — includes an example of chatting with deep research results
\* [\*\*Interactions:\*\*](/task-api/guides/interactions) Full reference for the `interaction\_id` and `previous\_interaction\_id` fields
\* [\*\*Enrichment:\*\*](/task-api/examples/task-enrichment) Structured data enrichment
\* [\*\*Streaming Events:\*\*](/task-api/task-sse) Monitor long-running research tasks in real time
