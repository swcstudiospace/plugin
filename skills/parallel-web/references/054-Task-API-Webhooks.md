# Task API Webhooks

Source: https://docs.parallel.ai/task-api/webhooks.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Task API Webhooks
> Webhook events for task run completions

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

\*\*Prerequisites:\*\* Before implementing Task API webhooks, read \*\*[Webhook Setup & Verification](/resources/webhook-setup)\*\* for critical information on:
\* Recording your webhook secret
\* Verifying HMAC signatures
\* Security best practices
\* Retry policies
This guide focuses on Task API-specific webhook events and payloads.
## Overview
Webhooks allow you to receive real-time notifications when your task runs complete, eliminating the need for constant polling—especially useful for long-running or research-intensive tasks.
## Setup
To register a webhook for a task run, include a `webhook` parameter in your task run creation request:
```bash cURL theme={"system"}
curl --request POST \
--url https://api.parallel.ai/v1/tasks/runs \
--header "Content-Type: application/json" \
--header "x-api-key: $PARALLEL\_API\_KEY" \
--data '{
"task\_spec": {
"output\_schema": "Find the GDP of the specified country and year"
},
"input": "France (2023)",
"processor": "core",
"metadata": {
"key": "value"
},
"webhook": {
"url": "https://your-domain.com/webhooks/parallel",
"event\_types": ["task\_run.status"]
}
}'
```
```typescript TypeScript (SDK) theme={"system"}
import Parallel from "parallel-web";
const client = new Parallel({
apiKey: process.env["PARALLEL\_API\_KEY"],
});
const taskRun = await client.taskRun.create({
task\_spec: {
output\_schema: "Find the GDP of the specified country and year",
},
input: "France (2023)",
processor: "core",
metadata: {
key: "value",
},
webhook: {
url: "https://your-domain.com/webhooks/parallel",
event\_types: ["task\_run.status"],
},
});
console.log(taskRun.run\_id);
```
```python Python theme={"system"}
import requests
url = "https://api.parallel.ai/v1/tasks/runs"
headers = {
"Content-Type": "application/json",
"x-api-key": "PARALLEL\_API\_KEY",
}
payload = {
"task\_spec": {
"output\_schema": "Find the GDP of the specified country and year"
},
"input": "France (2023)",
"processor": "core",
"metadata": {
"key": "value"
},
"webhook": {
"url": "https://your-domain.com/webhooks/parallel",
"event\_types": ["task\_run.status"],
}
}
response = requests.post(url, json=payload, headers=headers)
print(response.json())
```
### Webhook Parameters
| Parameter | Type | Required | Description |
| ------------- | -------------- | -------- | -------------------------------------------------- |
| `url` | string | Yes | Your webhook endpoint URL. Can be any domain. |
| `event\_types` | array\[string] | Yes | Currently only `["task\_run.status"]` is supported. |
## Event Types
Task API currently supports the following webhook event type:
| Event Type | Description |
| ----------------- | ------------------------------------------------------ |
| `task\_run.status` | Emitted when a task run completes (success or failure) |
## Webhook Payload Structure
Each webhook payload contains:
\* `timestamp`: ISO 8601 timestamp of when the event occurred
\* `type`: Event type
\* `data`: Event-specific payload. For the 'task\\_run.status' event, it is the complete [Task Run object](/api-reference/tasks/retrieve-task-run)
### Example Payloads
```json Success theme={"system"}
{
"timestamp": "2025-04-23T20:21:48.037943Z",
"type": "task\_run.status",
"data": {
"run\_id": "trun\_9907962f83aa4d9d98fd7f4bf745d654",
"status": "completed",
"is\_active": false,
"warnings": null,
"error": null,
"processor": "core",
"metadata": {
"key": "value"
},
"created\_at": "2025-04-23T20:21:48.037943Z",
"modified\_at": "2025-04-23T20:21:48.037943Z"
}
}
```
```json Failure theme={"system"}
{
"timestamp": "2025-04-23T20:21:48.037943Z",
"type": "task\_run.status",
"data": {
"run\_id": "trun\_9907962f83aa4d9d98fd7f4bf745d654",
"status": "failed",
"is\_active": false,
"warnings": null,
"error": {
"message": "Task execution failed",
"details": "Additional error details"
},
"processor": "core",
"metadata": {
"key": "value"
},
"created\_at": "2025-04-23T20:21:48.037943Z",
"modified\_at": "2025-04-23T20:21:48.037943Z"
}
}
```
## Security & Verification
For information on HMAC signature verification, including code examples in multiple languages, see the [Webhook Setup Guide - Security & Verification](/resources/webhook-setup#security--verification) section.
## Retry Policy
See the [Webhook Setup Guide - Retry Policy](/resources/webhook-setup#retry-policy) for details on webhook delivery retry configuration.
## Best Practices
For webhook implementation best practices, including signature verification, handling duplicates, and async processing, see the [Webhook Setup Guide - Best Practices](/resources/webhook-setup#best-practices) section.
