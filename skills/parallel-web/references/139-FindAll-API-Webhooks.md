# FindAll API Webhooks

Source: https://docs.parallel.ai/findall-api/features/findall-webhook.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# FindAll API Webhooks
> Receive real-time notifications on FindAll runs and candidates using webhooks

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

\*\*Prerequisites:\*\* Before implementing FindAll webhooks, read \*\*[Webhook Setup & Verification](/resources/webhook-setup)\*\* for critical information on:
\* Recording your webhook secret
\* Verifying HMAC signatures
\* Security best practices
\* Retry policies
This guide focuses on FindAll-specific webhook events and payloads.
## Overview
Webhooks allow you to receive real-time notifications when candidates are discovered, evaluated, or when your FindAll runs complete, eliminating the need for constant polling—especially useful for long-running FindAll operations that may process many candidates over time.
## Setup
To register a webhook for a FindAll run, include a `webhook` parameter in your FindAll run creation request:
```bash cURL theme={"system"}
curl --request POST \
--url https://api.parallel.ai/v1beta/findall/runs \
--header "Content-Type: application/json" \
--header "x-api-key: $PARALLEL\_API\_KEY" \
--data '{
"objective": "Find all portfolio companies of Khosla Ventures",
"entity\_type": "companies",
"match\_conditions": [
{
"name": "khosla\_ventures\_portfolio\_check",
"description": "Company must be a portfolio company of Khosla Ventures."
}
],
"generator": "core",
"match\_limit": 100,
"webhook": {
"url": "https://your-domain.com/webhooks/findall",
"event\_types": [
"findall.candidate.generated",
"findall.candidate.matched",
"findall.candidate.enriched",
"findall.run.completed",
"findall.run.cancelled",
"findall.run.failed"
]
}
}
```
```python Python theme={"system"}
import os
import requests
response = requests.post(
"https://api.parallel.ai/v1beta/findall/runs",
headers={"x-api-key": os.environ["PARALLEL\_API\_KEY"]},
json={
"objective": "Find all portfolio companies of Khosla Ventures",
"entity\_type": "companies",
"match\_conditions": [
{
"name": "khosla\_ventures\_portfolio\_check",
"description": "Company must be a portfolio company of Khosla Ventures."
}
],
"generator": "core",
"match\_limit": 100,
"webhook": {
"url": "https://your-domain.com/webhooks/findall",
"event\_types": [
"findall.candidate.generated",
"findall.candidate.matched",
"findall.candidate.enriched",
"findall.run.completed",
"findall.run.cancelled",
"findall.run.failed"
]
}
},
)
response.raise\_for\_status()
findall\_run = response.json()
```
```typescript TypeScript theme={"system"}
const response = await fetch("https://api.parallel.ai/v1beta/findall/runs", {
method: "POST",
headers: {
"Content-Type": "application/json",
"x-api-key": process.env.PARALLEL\_API\_KEY!,
},
body: JSON.stringify({
objective: "Find all portfolio companies of Khosla Ventures",
entity\_type: "companies",
match\_conditions: [
{
name: "khosla\_ventures\_portfolio\_check",
description: "Company must be a portfolio company of Khosla Ventures."
}
],
generator: "core",
match\_limit: 100,
webhook: {
url: "https://your-domain.com/webhooks/findall",
event\_types: [
"findall.candidate.generated",
"findall.candidate.matched",
"findall.candidate.enriched",
"findall.run.completed",
"findall.run.cancelled",
"findall.run.failed"
]
}
}),
});
if (!response.ok) {
throw new Error(`FindAll request failed: ${response.status}`);
}
const run = await response.json();
```
### Webhook Parameters
| Parameter | Type | Required | Description |
| ------------- | -------------- | -------- | ------------------------------------------------------------ |
| `url` | string | Yes | Your HTTPS webhook endpoint URL. |
| `event\_types` | array\[string] | Yes | Array of event types to subscribe to. See Event Types below. |
## Event Types
FindAll supports the following webhook event types:
| Event Type | Description |
| ----------------------------- | ------------------------------------------------------------------- |
| `findall.candidate.generated` | Emitted when a new candidate is generated and queued for evaluation |
| `findall.candidate.matched` | Emitted when a candidate successfully matches all match conditions |
| `findall.candidate.enriched` | Emitted when enrichment data has been extracted for a candidate |
| `findall.run.completed` | Emitted when a FindAll run reaches `completed` status |
| `findall.run.cancelled` | Emitted when a FindAll run is cancelled |
| `findall.run.failed` | Emitted when a FindAll run fails due to an error |
You can subscribe to any combination of these event types in your webhook configuration.
The webhook request schema also accepts `findall.candidate.unmatched` and `findall.candidate.cancelled` for compatibility, but current FindAll V1 processing does not emit either webhook event. Use [SSE](/findall-api/features/findall-sse) to receive unmatched candidate updates.

For a complete guide to candidate object structure, states, and fields, see [Candidates](/findall-api/core-concepts/findall-candidates).
## Webhook Payload Structure
Each webhook payload contains:
\* `timestamp`: ISO 8601 timestamp of when the event occurred
\* `type`: Event type
\* `data`: Event-specific payload (FindAll Candidate or Run object)
### Candidate Events
```json findall.candidate.generated theme={"system"}
{
"type": "findall.candidate.generated",
"timestamp": "2025-10-27T14:56:05.619331Z",
"data": {
"findall\_id": "findall\_40e0ab8c10754be0b7a16477abb38a2f",
"candidate\_id": "candidate\_2edf2301-f80d-46b9-b17a-7b4a9d577296",
"name": "Anthropic",
"url": "https://www.anthropic.com/",
"description": "Anthropic is an AI safety and research company founded in 2021...",
"match\_status": "generated"
}
}
```
```json findall.candidate.matched theme={"system"}
{
"type": "findall.candidate.matched",
"timestamp": "2025-10-27T14:57:15.421087Z",
"data": {
"findall\_id": "findall\_40e0ab8c10754be0b7a16477abb38a2f",
"candidate\_id": "candidate\_478fb5ca-4581-4411-9acb-6b78b4cb5bcf",
"name": "Vivodyne",
"url": "https://vivodyne.com/",
"description": "Vivodyne is a biotechnology company...",
"match\_status": "matched",
"output": {
"founded\_after\_2020\_check": {
"value": "2021",
"type": "match\_condition",
"is\_matched": true
}
},
"basis": [
{
"field": "founded\_after\_2020\_check",
"citations": [
{
"title": "Vivodyne - Crunchbase Company Profile & Funding",
"url": "https://www.crunchbase.com/organization/vivodyne",
"excerpts": ["Founded in 2021"]
}
],
"reasoning": "Multiple sources indicate that Vivodyne was founded in 2021...",
"confidence": "high"
}
]
}
}
```
### Run Events
```json findall.run.completed theme={"system"}
{
"type": "findall.run.completed",
"timestamp": "2025-10-27T14:58:39.421087Z",
"data": {
"findall\_id": "findall\_40e0ab8c10754be0b7a16477abb38a2f",
"status": {
"status": "completed",
"is\_active": false,
"metrics": {
"generated\_candidates\_count": 5,
"matched\_candidates\_count": 1
},
"termination\_reason": "match\_limit\_met"
},
"generator": "core",
"metadata": {},
"created\_at": "2025-10-27T14:56:05.619331Z",
"modified\_at": "2025-10-27T14:58:39.421087Z"
}
}
```
```json findall.run.cancelled theme={"system"}
{
"type": "findall.run.cancelled",
"timestamp": "2025-10-27T14:57:00.123456Z",
"data": {
"findall\_id": "findall\_40e0ab8c10754be0b7a16477abb38a2f",
"status": {
"status": "cancelled",
"is\_active": false,
"metrics": {
"generated\_candidates\_count": 3,
"matched\_candidates\_count": 0
},
"termination\_reason": "user\_cancelled"
},
"generator": "core",
"metadata": {},
"created\_at": "2025-10-27T14:56:05.619331Z",
"modified\_at": "2025-10-27T14:57:00.123456Z"
}
}
```
```json findall.run.failed theme={"system"}
{
"type": "findall.run.failed",
"timestamp": "2025-10-27T14:57:30.789012Z",
"data": {
"findall\_id": "findall\_40e0ab8c10754be0b7a16477abb38a2f",
"status": {
"status": "failed",
"is\_active": false,
"metrics": {
"generated\_candidates\_count": 2,
"matched\_candidates\_count": 0
},
"termination\_reason": "error\_occurred"
},
"generator": "core",
"metadata": {},
"created\_at": "2025-10-27T14:56:05.619331Z",
"modified\_at": "2025-10-27T14:57:30.789012Z"
}
}
```
## Security & Verification
For information on HMAC signature verification, including code examples in multiple languages, see the [Webhook Setup Guide - Security & Verification](/resources/webhook-setup#security--verification) section.
## Retry Policy
See the [Webhook Setup Guide - Retry Policy](/resources/webhook-setup#retry-policy) for details on webhook delivery retry configuration.
## Best Practices
For webhook implementation best practices, including signature verification, handling duplicates, and async processing, see the [Webhook Setup Guide - Best Practices](/resources/webhook-setup#best-practices) section.
## Related Topics
\* \*\*[Preview](/findall-api/features/findall-preview)\*\*: Test queries with 5–10 evaluated candidates before running full searches
\* \*\*[Generators and Pricing](/findall-api/core-concepts/findall-generator-pricing)\*\*: Understand generator options and pricing
\* \*\*[Enrichments](/findall-api/features/findall-enrich)\*\*: Extract additional structured data for matched candidates
\* \*\*[Extend Runs](/findall-api/features/findall-extend)\*\*: Increase match limits without paying new fixed costs
\* \*\*[Streaming Events](/findall-api/features/findall-sse)\*\*: Receive real-time updates via Server-Sent Events
\* \*\*[Run Lifecycle](/findall-api/core-concepts/findall-lifecycle)\*\*: Understand run statuses and how to cancel runs
\* \*\*[API Reference](/api-reference/findall/create-findall-run#body-webhook)\*\*: Complete endpoint documentation
