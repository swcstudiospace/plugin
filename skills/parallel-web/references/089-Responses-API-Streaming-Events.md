# Responses API Streaming Events

Source: https://docs.parallel.ai/responses-api/features/streaming-events.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Responses API Streaming Events
> Stream Responses API results as server-sent events
Set `stream: true` to receive the response as server-sent events (SSE,
`Content-Type: text/event-stream`) following the standard OpenAI Responses event sequence.
The stock OpenAI SDK's streaming interface works unchanged.
## Event sequence
```
response.created
response.in\_progress
response.output\_item.added
response.content\_part.added
response.output\_text.delta
response.output\_text.annotation.added (one per citation)
response.output\_text.done
response.content\_part.done
response.output\_item.done
response.completed
```
Today the full answer text arrives as a single `response.output\_text.delta` once research
completes — there is no token-by-token streaming yet. The early `response.created` and
`response.in\_progress` events still arrive up front, so streaming works well as a connection
acknowledgment during longer requests. Consume deltas in a loop rather than assuming one
chunk; granularity may become finer in the future.
## Usage
```bash cURL theme={"system"}
# -N disables buffering so events print as they arrive
curl -N https://api.parallel.ai/v1/responses \
-H "Authorization: Bearer $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "parallel",
"input": "Who is the current CEO of Nvidia?",
"reasoning": {"effort": "low"},
"stream": true
}'
```
```python Python theme={"system"}
import os
from openai import OpenAI
client = OpenAI(
api\_key=os.environ["PARALLEL\_API\_KEY"],
base\_url="https://api.parallel.ai/v1",
)
stream = client.responses.create(
model="parallel",
input="Who is the current CEO of Nvidia?",
reasoning={"effort": "low"},
stream=True,
)
for event in stream:
if event.type == "response.output\_text.delta":
print(event.delta, end="", flush=True)
elif event.type == "response.completed":
print() # final Response object is on event.response
```
```typescript TypeScript theme={"system"}
import OpenAI from "openai";
const client = new OpenAI({
apiKey: process.env.PARALLEL\_API\_KEY,
baseURL: "https://api.parallel.ai/v1",
});
const stream = await client.responses.create({
model: "parallel",
input: "Who is the current CEO of Nvidia?",
reasoning: { effort: "low" },
stream: true,
});
for await (const event of stream) {
if (event.type === "response.output\_text.delta") {
process.stdout.write(event.delta);
} else if (event.type === "response.completed") {
process.stdout.write("\n"); // final Response object is on event.response
}
}
```
The `response.completed` event carries the complete final Response object — the same shape
a non-streaming request returns, including `usage`.
Source citations arrive as `response.output\_text.annotation.added` events after the text
delta — see [Citations](/responses-api/features/citations).
