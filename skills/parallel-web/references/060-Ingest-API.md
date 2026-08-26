# Ingest API

Source: https://docs.parallel.ai/task-api/ingest-api.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Ingest API
> API reference for creating awesome tasks

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

## API Overview
The Parallel Ingest API provides endpoints for creating intelligent task runs that can perform web research and data extraction. The API is built around a stateful architecture where task creation and result retrieval are separate operations.
## Endpoints
### Suggest Task
`POST /v1beta/tasks/suggest`
Generate a task specification based on user intent. This endpoint helps you create properly structured tasks by analyzing your requirements and suggesting appropriate schemas.
#### Request Parameters
| Parameter | Type | Required | Description |
| --------------- | ------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `user\_intent` | string | Yes | Natural language description of what you want to accomplish |
| `previous\_task` | `SuggestedTaskSpec` | No | Previous task specification to iterate upon and improve, or to restrict input columns to a predefined set (see [example](#select-input-columns-from-a-predefined-set) below) |
#### Response Schema
Returns a `SuggestedTaskSpec` object with the following fields:
| Field | Type | Description |
| --------------- | ------ | ----------------------------------------------------------- |
| `input\_schema` | object | JSON schema defining expected input structure |
| `output\_schema` | object | JSON schema defining expected output structure |
| `inputs` | array | Sample input data, if provided in the user intent |
| `title` | string | Suggested title for the task |
| `warnings` | array | Optional list of warnings about the generated specification |
\*\*Warning Types:\*\*
| Warning Type | Description |
| ----------------------- | ------------------------------------------------------------- |
| `schema\_generalization` | Some fields were generalized to create a more reusable schema |
| `unparsable\_input` | User-provided input data couldn't be fully parsed |
| `unattainable\_task` | The requested task cannot be created exactly as specified |
#### Example Request

```bash theme={"system"}
curl -X POST "https://api.parallel.ai/v1beta/tasks/suggest" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"user\_intent": "Find the CEOs of tech companies"
}'
```
\*\*With previous task iteration:\*\*
```bash theme={"system"}
curl -X POST "https://api.parallel.ai/v1beta/tasks/suggest" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"user\_intent": "I want to also include the company website and founding year in the output schema",
"previous\_task": {
"input\_schema": {
"type": "object",
"properties": {
"company\_name": {
"type": "string",
"description": "Name of the company"
}
},
"required": ["company\_name"]
},
"output\_schema": {
"type": "object",
"properties": {
"ceo\_name": {
"type": "string",
"description": "Current CEO of the company"
}
}
}
}
}'
```

```python theme={"system"}
import requests
url = "https://api.parallel.ai/v1beta/tasks/suggest"
headers = {
"x-api-key": "PARALLEL\_API\_KEY",
"Content-Type": "application/json"
}
data = {
"user\_intent": "Find the CEOs of tech companies"
}
response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)
```
\*\*With previous task iteration:\*\*
```python theme={"system"}
import requests
url = "https://api.parallel.ai/v1beta/tasks/suggest"
headers = {
"x-api-key": "PARALLEL\_API\_KEY",
"Content-Type": "application/json"
}
data = {
"user\_intent": "I want to also include the company website and founding year in the output",
"previous\_task": {
"input\_schema": {
"type": "object",
"properties": {
"company\_name": {
"type": "string",
"description": "Name of the company"
}
},
"required": ["company\_name"]
},
"output\_schema": {
"type": "object",
"properties": {
"ceo\_name": {
"type": "string",
"description": "Current CEO of the company"
}
}
}
}
}
response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)
```

```typescript theme={"system"}
const response = await fetch('https://api.parallel.ai/v1beta/tasks/suggest', {
method: 'POST',
headers: {
"x-api-key": "PARALLEL\_API\_KEY",
"Content-Type": "application/json"
},
body: JSON.stringify({
user\_intent: 'Find the CEOs of tech companies'
})
});
const result = await response.json();
console.log(result);
```
\*\*With previous task iteration:\*\*
```typescript theme={"system"}
const response = await fetch('https://api.parallel.ai/v1beta/tasks/suggest', {
method: 'POST',
headers: {
"x-api-key": "PARALLEL\_API\_KEY",
"Content-Type": "application/json"
},
body: JSON.stringify({
user\_intent: 'I want to also include the company website and founding year',
previous\_task: {
input\_schema: {
type: 'object',
properties: {
company\_name: {
type: 'string',
description: 'Name of the company'
}
},
required: ['company\_name']
},
output\_schema: {
type: 'object',
properties: {
ceo\_name: {
type: 'string',
description: 'Current CEO of the company'
}
}
}
}
})
});
const result = await response.json();
console.log(result);
```
#### Example Response
```json theme={"system"}
{
"input\_schema": {
"type": "object",
"properties": {
"company\_name": {
"type": "string",
"description": "Name of the company"
}
},
"required": ["company\_name"]
},
"output\_schema": {
"type": "object",
"properties": {
"ceo\_name": {
"type": "string",
"description": "Current CEO of the company"
},
"appointed\_date": {
"type": "string",
"description": "Date when the CEO was appointed"
}
}
},
"inputs": [],
"title": "Find Company CEO Information"
}
```
### Suggest Processor
`POST /v1beta/tasks/suggest-processor`
Enhance and optimize a task specification by suggesting the most appropriate processor and refining the schemas.
#### Suggest Processor Request Parameters
| Parameter | Type | Required | Description |
| ------------------------ | ------ | -------- | --------------------------------------------------------------------------------------------------- |
| `task\_spec` | object | Yes | Task specification object to be processed |
| `choose\_processors\_from` | array | No | List of processors to choose from. If not provided, the API will consider all available processors. |
\*\*Valid values:\*\* `base`, `base-fast`, `core`, `core-fast`, `core2x`, `core2x-fast`, `pro`, `pro-fast`, `ultra`, `ultra-fast`, `ultra2x`, `ultra2x-fast`, `ultra4x`, `ultra4x-fast`, `ultra8x`, `ultra8x-fast`
The `lite` and `lite-fast` processors are available for task execution but will never be returned by this endpoint.
See [Processors](/task-api/guides/choose-a-processor) for details on each processor.
#### Suggest Processor Example Request

```bash theme={"system"}
curl -X POST "https://api.parallel.ai/v1beta/tasks/suggest-processor" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"task\_spec": {
"input\_schema": {
"type": "object",
"properties": {
"company\_name": {
"type": "string"
}
}
},
"output\_schema": {
"type": "object",
"properties": {
"ceo\_name": {
"type": "string"
}
}
}
},
"choose\_processors\_from": ["base", "core", "core2x", "pro", "ultra"]
}'
```

```python theme={"system"}
import requests
url = "https://api.parallel.ai/v1beta/tasks/suggest-processor"
headers = {
"x-api-key": "PARALLEL\_API\_KEY",
"Content-Type": "application/json"
}
data = {
"task\_spec": {
"input\_schema": {
"type": "object",
"properties": {
"company\_name": {
"type": "string"
}
}
},
"output\_schema": {
"type": "object",
"properties": {
"ceo\_name": {
"type": "string"
}
}
}
},
"choose\_processors\_from": ["base", "core", "core2x", "pro", "ultra"]
}
response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)
```

```typescript theme={"system"}
const response = await fetch('https://api.parallel.ai/v1beta/tasks/suggest-processor', {
method: 'POST',
headers: {
"x-api-key": "PARALLEL\_API\_KEY",
"Content-Type": "application/json"
},
body: JSON.stringify({
task\_spec: {
input\_schema: {
type: 'object',
properties: {
company\_name: {
type: 'string'
}
}
},
output\_schema: {
type: 'object',
properties: {
ceo\_name: {
type: 'string'
}
}
}
},
choose\_processors\_from: ["base", "core", "core2x", "pro", "ultra"]
})
});
const result = await response.json();
console.log(result);
```
#### Suggest Processor Response Schema
| Field | Type | Description |
| ------------------------ | ----- | --------------------------------------------------------------------------------------- |
| `recommended\_processors` | array | List of recommended processors in priority order. We recommend using the first element. |
Returns an enhanced task specification with additional fields and optimizations.
#### Suggest Processor Example Response
```json theme={"system"}
{
"recommended\_processors": ["pro"]
}
```
#### How Processor Suggestion Works
The `/suggest-processor` endpoint analyzes your task specification to recommend the most appropriate processor. The algorithm considers:
1. \*\*Task Complexity\*\* - Number of output fields, depth of research required
2. \*\*Research Pattern\*\* - Whether the task requires single-step lookups, multi-step reasoning, or parallel breadth-first research
3. \*\*Data Sources\*\* - How many disparate sources need to be consulted
4. \*\*Special Tools\*\* - Whether the task requires specialized capabilities like entity ranking
The recommendation balances task requirements against processor capabilities, selecting the lowest-cost processor that can reliably complete your task.
The first processor in `recommended\_processors` is always the best recommendation. The API may return multiple processors if several could handle the task, but we recommend using the first one.
## Examples
### Select Input Columns from a Predefined Set
Sometimes you have a specific dataset with fixed columns and need to create a task that works exclusively with those columns. The `previous\_task` parameter allows you to constrain the API to generate task specifications that match your exact data structure.
\*\*When to use this approach:\*\*
\* You have a fixed dataset schema that cannot be modified
\* You want to ensure the task only uses your specific input columns
\* You need to provide examples that match your exact data format
\* You want to prevent the API from suggesting additional input fields
\*\*The workflow:\*\*
1. \*\*Define Your Schema\*\*: Specify exactly which columns you want to use as inputs with their descriptions
2. \*\*Provide Sample Data\*\*: Include examples that match your exact data format
3. \*\*Generate a `SuggestedTaskSpec`\*\*: Use the helper function to create a properly formatted `SuggestedTaskSpec` object
4. \*\*Refine with API\*\*: Pass this as `previous\_task` to get a refined task spec that respects your column constraints
The API will use your predefined input schema as a foundation and refine the output schema while preserving your input columns. This guarantees the final task specification integrates seamlessly with your existing dataset.
```python [expandable] theme={"system"}
import requests
import json
if \_\_name\_\_ == "\_\_main\_\_":
user\_intent = "Find the CEO, investments, and customer details for the company"
columns\_with\_descriptions = [
("company\_id", "The unique identifier of the company to retrieve executive, investment, and customer details for."),
("company\_name", "The name of the company to identify and gather detailed information about."),
("company\_website", "The domain of the company's website to assist in identifying the correct organization."),
("industry", "The primary industry the company operates in."),
("employee\_count", "The exact number of employees at the company.")
]
examples = [
{
"company\_id": "comp\_001",
"company\_name": "Parallel AI",
"company\_website": "parallel.ai",
"industry": "AI",
"employee\_count": "25"
},
{
"company\_id": "comp\_002",
"company\_name": "Google",
"company\_website": "google.com",
"industry": "Software",
"employee\_count": "125000"
}
]
def get\_suggested\_task\_spec(columns\_with\_descriptions, examples, title):
all\_valid\_columns = {
column\_name: {
"type": "string",
"description": description
}
for column\_name, description in columns\_with\_descriptions
}
return {
"input\_schema": {
"type": "object",
"properties": all\_valid\_columns
},
"output\_schema": {
"type": "object",
"properties": {
"answer": {
"type": "string",
"description": "answer to the question"
}
},
"required": ["answer"],
},
"inputs": examples,
"title": title
}
suggested\_task\_spec = get\_suggested\_task\_spec(
columns\_with\_descriptions=columns\_with\_descriptions,
examples=examples,
title="Company executive, investments, and customer details"
)
url = "https://api.parallel.ai/v1beta/tasks/suggest"
headers = {
"x-api-key": "PARALLEL\_API\_KEY",
"Content-Type": "application/json"
}
data = {
"user\_intent": f"{user\_intent}. Improve output\_schema to include more descriptive fields, and only keep input fields that are relevant to answering the question.",
"previous\_task": suggested\_task\_spec
}
response = requests.post(url, headers=headers, json=data)
result = response.json()
print(json.dumps(result, indent=2))
```
### End-to-End Ingest to Task Execution
The following Python script demonstrates the complete workflow of the Ingest API, from task suggestion to result retrieval:
```python [expandable] theme={"system"}
#!/usr/bin/env python3
"""
End-to-end test script for Parallel Ingest API
This script demonstrates the complete workflow:
1. Suggest a task based on user intent
2. Suggest a processor for the task
3. Create and run the task
4. Retrieve the results
Usage:
python test\_ingest\_api.py
Make sure to set your PARALLEL\_API\_KEY environment variable or update the script directly.
"""
import os
import requests
import json
import time
from typing import Dict, Any, Optional
# Configuration
API\_KEY = "PARALLEL\_API\_KEY"
BASE\_URL = "https://api.parallel.ai"
class IngestAPITester:
def \_\_init\_\_(self, api\_key: str, base\_url: str):
self.api\_key = api\_key
self.base\_url = base\_url
self.headers = {
"x-api-key": api\_key,
"Content-Type": "application/json"
}
def suggest\_task(self, user\_intent: str) -> Optional[Dict[str, Any]]:
"""Step 1: Suggest a task based on user intent"""
print(f"🔍 Step 1: Suggesting task for intent: '{user\_intent}'")
url = f"{self.base\_url}/v1beta/tasks/suggest"
data = {"user\_intent": user\_intent}
try:
response = requests.post(url, headers=self.headers, json=data)
response.raise\_for\_status()
result = response.json()
print("✅ Task suggestion successful!")
print(f" Title: {result.get('title', 'N/A')}")
print(f" Input schema: {json.dumps(result.get('input\_schema', {}), indent=2)}")
print(f" Output schema: {json.dumps(result.get('output\_schema', {}), indent=2)}")
print()
return result
except requests.exceptions.RequestException as e:
print(f"❌ Error suggesting task: {e}")
if hasattr(e, 'response') and e.response is not None:
print(f" Response: {e.response.text}")
return None
def suggest\_processor(self, task\_spec: Dict[str, Any]) -> Optional[Dict[str, Any]]:
"""Step 2: Suggest a processor for the task"""
print("🔧 Step 2: Suggesting processor for the task")
url = f"{self.base\_url}/v1beta/tasks/suggest-processor"
data = {
"task\_spec": task\_spec,
"choose\_processors\_from": ["base", "core", "core2x", "pro", "ultra"]
}
try:
response = requests.post(url, headers=self.headers, json=data)
response.raise\_for\_status()
result = response.json()
print("✅ Processor suggestion successful!")
# Extract the first recommended processor
recommended\_processors = result.get('recommended\_processors', [])
if recommended\_processors:
selected\_processor = recommended\_processors[0]
print(f" Recommended processors: {recommended\_processors}")
print(f" Selected processor: {selected\_processor}")
result['selected\_processor'] = selected\_processor
else:
print(" ⚠️ No processors recommended, defaulting to 'core'")
result['selected\_processor'] = 'core'
print(f" Enhanced task spec received")
print()
return result
except requests.exceptions.RequestException as e:
print(f"❌ Error suggesting processor: {e}")
if hasattr(e, 'response') and e.response is not None:
print(f" Response: {e.response.text}")
return None
def create\_task\_run(self, input\_data: Any, processor: str = "core", task\_spec: Optional[Dict] = None) -> Optional[str]:
"""Step 3: Create a task run"""
print(f"🚀 Step 3: Creating task run with processor '{processor}'")
url = f"{self.base\_url}/v1/tasks/runs"
data = {
"input": input\_data,
"processor": processor
}
if task\_spec:
# Format the task\_spec according to the documentation
# Schemas need to be wrapped with type and json\_schema fields
formatted\_task\_spec = {}
if "input\_schema" in task\_spec:
formatted\_task\_spec["input\_schema"] = {
"type": "json",
"json\_schema": task\_spec["input\_schema"]
}
if "output\_schema" in task\_spec:
formatted\_task\_spec["output\_schema"] = {
"type": "json",
"json\_schema": task\_spec["output\_schema"]
}
data["task\_spec"] = formatted\_task\_spec
try:
response = requests.post(url, headers=self.headers, json=data)
response.raise\_for\_status()
result = response.json()
run\_id = result.get("run\_id")
status = result.get("status")
print(f"✅ Task run created successfully!")
print(f" Run ID: {run\_id}")
print(f" Status: {status}")
print()
return run\_id
except requests.exceptions.RequestException as e:
print(f"❌ Error creating task run: {e}")
if hasattr(e, 'response') and e.response is not None:
print(f" Response: {e.response.text}")
return None
def get\_task\_result(self, run\_id: str, max\_attempts: int = 30, wait\_time: int = 10) -> Optional[Dict[str, Any]]:
"""Step 4: Get task results (with polling)"""
print(f"📊 Step 4: Retrieving results for run {run\_id}")
url = f"{self.base\_url}/v1/tasks/runs/{run\_id}/result"
headers = {"x-api-key": self.api\_key} # No Content-Type needed for GET
for attempt in range(max\_attempts):
try:
response = requests.get(url, headers=headers)
if response.status\_code == 200:
result = response.json()
status = result.get("run", {}).get("status")
if status == "completed":
print("✅ Task completed successfully!")
output = result.get("output", {})
print(f" Content: {output.get('content', 'N/A')}")
# Show citations if available
citations = output.get("citations", [])
if citations:
print(f" Citations: {len(citations)} sources")
for i, citation in enumerate(citations[:3], 1): # Show first 3
print(f" {i}. {citation}")
return result
elif status == "failed":
print("❌ Task failed!")
return result
else:
print(f"⏳ Task still {status}... (attempt {attempt + 1}/{max\_attempts})")
time.sleep(wait\_time)
elif response.status\_code == 404:
print(f"❌ Task run not found: {run\_id}")
return None
else:
response.raise\_for\_status()
except requests.exceptions.RequestException as e:
print(f"❌ Error getting task result: {e}")
if hasattr(e, 'response') and e.response is not None:
print(f" Response: {e.response.text}")
return None
print(f"⏰ Task did not complete within {max\_attempts \* wait\_time} seconds")
return None
def run\_end\_to\_end\_test(self, user\_intent: str, sample\_input: Any):
"""Run the complete end-to-end test"""
print("=" \* 60)
print("🧪 PARALLEL INGEST API - END-TO-END TEST")
print("=" \* 60)
print()
# Step 1: Suggest task
task\_suggestion = self.suggest\_task(user\_intent)
if not task\_suggestion:
print("❌ Test failed at task suggestion step")
return
# Step 2: Suggest processor
processor\_suggestion = self.suggest\_processor(task\_suggestion)
if not processor\_suggestion:
print("❌ Test failed at processor suggestion step")
return
# Step 3: Create task run
selected\_processor = processor\_suggestion.get('selected\_processor', 'core')
run\_id = self.create\_task\_run(
input\_data=sample\_input,
processor=selected\_processor,
task\_spec=task\_suggestion # Use original task suggestion, not processor suggestion
)
if not run\_id:
print("❌ Test failed at task creation step")
return
# Step 4: Get results
result = self.get\_task\_result(run\_id)
if result:
print("🎉 End-to-end test completed successfully!")
else:
print("❌ Test failed at result retrieval step")
def main():
"""Main function to run the test"""
# Check API key
if API\_KEY == "PARALLEL\_API\_KEY":
print("⚠️ Please set your PARALLEL\_API\_KEY environment variable or update the script")
print(" Example: export PARALLEL\_API\_KEY=your\_actual\_api\_key")
return
# Initialize tester
tester = IngestAPITester(API\_KEY, BASE\_URL)
# Test configuration
user\_intent = "Given company\_name and company\_website, find the CEO information for technology companies"
# Use object input that matches the expected schema
sample\_input = {
"company\_name": "Google",
"company\_website": "https://www.google.com"
}
# Run the test
tester.run\_end\_to\_end\_test(user\_intent, sample\_input)
if \_\_name\_\_ == "\_\_main\_\_":
main()
```
Running the Example
```bash theme={"system"}
PARALLEL\_API\_KEY="PARALLEL\_API\_KEY" python3 ingest\_script.py
```
This example demonstrates the complete workflow:
1. \*\*Suggest Task\*\*: Generate a task specification from natural language intent
2. \*\*Suggest Processor\*\*: Get processor recommendations and enhanced schemas
3. \*\*Create Task Run\*\*: Submit the task for processing with proper schema formatting
4. \*\*Get Results\*\*: Poll for completion and retrieve the final results
The script includes proper error handling, status polling, and demonstrates the correct format for task specifications required by the API.
