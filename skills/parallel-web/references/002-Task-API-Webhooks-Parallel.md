# Task API Webhooks - Parallel

Source: https://docs.parallel.ai/task-api/webhooks

**Prerequisites:** Before implementing Task API webhooks, read **[Webhook Setup & Verification](/resources/webhook-setup)** for critical information on:

- Recording your webhook secret
- Verifying HMAC signatures
- Security best practices
- Retry policies

This guide focuses on Task API-specific webhook events and payloads.

## [​](#overview) Overview

Webhooks allow you to receive real-time notifications when your task runs complete, eliminating the need for constant polling—especially useful for long-running or research-intensive tasks.

## [​](#setup) Setup

To register a webhook for a task run, include a `webhook` parameter in your task run creation request:

cURL

TypeScript (SDK)

Python

```
curl --request POST \
  --url https://api.parallel.ai/v1/tasks/runs \
  --header "Content-Type: application/json" \
  --header "x-api-key: $PARALLEL_API_KEY" \
  --data '{
    "task_spec": {
      "output_schema": "Find the GDP of the specified country and year"
    },
    "input": "France (2023)",
    "processor": "core",
    "metadata": {
      "key": "value"
    },
    "webhook": {
      "url": "https://your-domain.com/webhooks/parallel",
      "event_types": ["task_run.status"]
    }
  }'
```

```
import Parallel from "parallel-web";

const client = new Parallel({
  apiKey: process.env["PARALLEL_API_KEY"],
});

const taskRun = await client.taskRun.create({
  task_spec: {
    output_schema: "Find the GDP of the specified country and year",
  },
  input: "France (2023)",
  processor: "core",
  metadata: {
    key: "value",
  },
  webhook: {
    url: "https://your-domain.com/webhooks/parallel",
    event_types: ["task_run.status"],
  },
});

console.log(taskRun.run_id);
```

```
import requests

url = "https://api.parallel.ai/v1/tasks/runs"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "PARALLEL_API_KEY",
}

payload = {
    "task_spec": {
        "output_schema": "Find the GDP of the specified country and year"
    },
    "input": "France (2023)",
    "processor": "core",
    "metadata": {
        "key": "value"
    },
    "webhook": {
        "url": "https://your-domain.com/webhooks/parallel",
        "event_types": ["task_run.status"],
    }
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

### [​](#webhook-parameters) Webhook Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Your webhook endpoint URL. Can be any domain. |
| `event_types` | array[string] | Yes | Currently only `["task_run.status"]` is supported. |

## [​](#event-types) Event Types

Task API currently supports the following webhook event type:

| Event Type | Description |
| --- | --- |
| `task_run.status` | Emitted when a task run completes (success or failure) |

## [​](#webhook-payload-structure) Webhook Payload Structure

Each webhook payload contains:

- `timestamp`: ISO 8601 timestamp of when the event occurred
- `type`: Event type
- `data`: Event-specific payload. For the ‘task\_run.status’ event, it is the complete [Task Run object](/api-reference/tasks/retrieve-task-run)

### [​](#example-payloads) Example Payloads

Success

```
{
  "timestamp": "2025-04-23T20:21:48.037943Z",
  "type": "task_run.status",
  "data": {
    "run_id": "trun_9907962f83aa4d9d98fd7f4bf745d654",
    "status": "completed",
    "is_active": false,
    "warnings": null,
    "error": null,
    "processor": "core",
    "metadata": {
      "key": "value"
    },
    "created_at": "2025-04-23T20:21:48.037943Z",
    "modified_at": "2025-04-23T20:21:48.037943Z"
  }
}
```

Failure

```
{
  "timestamp": "2025-04-23T20:21:48.037943Z",
  "type": "task_run.status",
  "data": {
    "run_id": "trun_9907962f83aa4d9d98fd7f4bf745d654",
    "status": "failed",
    "is_active": false,
    "warnings": null,
    "error": {
      "message": "Task execution failed",
      "details": "Additional error details"
    },
    "processor": "core",
    "metadata": {
      "key": "value"
    },
    "created_at": "2025-04-23T20:21:48.037943Z",
    "modified_at": "2025-04-23T20:21:48.037943Z"
  }
}
```

## [​](#security-&-verification) Security & Verification

For information on HMAC signature verification, including code examples in multiple languages, see the [Webhook Setup Guide - Security & Verification](/resources/webhook-setup#security--verification) section.

## [​](#retry-policy) Retry Policy

See the [Webhook Setup Guide - Retry Policy](/resources/webhook-setup#retry-policy) for details on webhook delivery retry configuration.

## [​](#best-practices) Best Practices

For webhook implementation best practices, including signature verification, handling duplicates, and async processing, see the [Webhook Setup Guide - Best Practices](/resources/webhook-setup#best-practices) section.

[Enrichment](/task-api/examples/task-enrichment)[Task Group](/task-api/group-api)

⌘I
