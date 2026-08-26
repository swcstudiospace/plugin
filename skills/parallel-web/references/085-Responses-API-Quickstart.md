# Responses API Quickstart

Source: https://docs.parallel.ai/responses-api/responses-quickstart.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Responses API Quickstart
> Answer questions with live web research in seconds
The Parallel Responses API is an OpenAI Responses-compatible endpoint that answers a
question using live web research within a latency budget of \~5–60 seconds. The API automatically handles running multi-step web searches, fetching live pages,
and cross-checking sources to return a \*\*synthesized answer with citations\*\*.
Because it is OpenAI compatible, you can invoke the Responses API with OpenAI's Typescript or Python SDKs. Just change three parameters: `base\_url`, `api\_key`, and `model`.
## Model and reasoning tiers
There is one model id — `parallel` — and `reasoning.effort` selects the reasoning tier:
| `reasoning.effort` | Latency | Designed for | Example |
| ------------------ | -------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `low` | \~5–10s | Simple fact-retrieval questions | "What's the current U.S. federal funds rate?" |
| `medium` (default) | \~15–20s | More complex, multi-hop fact-retrieval questions | "Which G7 country has the highest corporate tax rate?" |
| `high` | \~30–60s | Deep-research questions requiring extensive search and synthesis | "How have G7 corporate tax rates shifted since 2020, and what's driving the trend?" |
Every tier grounds its answer in live web search, but higher tiers do more web research before producing an answer. If you omit `reasoning`, effort defaults to `medium`. `high` requests can take up to a minute, so give your client timeout headroom (e.g. `timeout=120.0` in the Python SDK).
## Prerequisites
Get an API key from [Parallel Settings](https://platform.parallel.ai) and set it as
`PARALLEL\_API\_KEY`. If you are using an SDK, install the OpenAI SDK:
```bash cURL theme={"system"}
export PARALLEL\_API\_KEY="your-api-key"
```
```bash Python theme={"system"}
pip install openai
```
```bash TypeScript theme={"system"}
npm install openai
```
## Make your first request
```bash cURL theme={"system"}
curl https://api.parallel.ai/v1/responses \
-H "Authorization: Bearer $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "parallel",
"input": "Who is the current CEO of the largest cloud provider by revenue?",
"reasoning": {"effort": "low"}
}'
```
```python Python theme={"system"}
import os
from openai import OpenAI
client = OpenAI(
api\_key=os.environ["PARALLEL\_API\_KEY"],
base\_url="https://api.parallel.ai/v1",
)
response = client.responses.create(
model="parallel",
input="Who is the current CEO of the largest cloud provider by revenue?",
reasoning={"effort": "low"}, # low | medium | high
)
print(response.output\_text)
```
```typescript TypeScript theme={"system"}
import OpenAI from "openai";
const client = new OpenAI({
apiKey: process.env.PARALLEL\_API\_KEY,
baseURL: "https://api.parallel.ai/v1",
});
const response = await client.responses.create({
model: "parallel",
input: "Who is the current CEO of the largest cloud provider by revenue?",
reasoning: { effort: "low" },
});
console.log(response.output\_text);
```
Read the answer from `output\_text` (convenience accessor), or walk `output[]` — the
`message` item's `content[]` carries the answer text.
## Migrate from OpenAI
Migrating an existing OpenAI Responses integration is a three-line diff: point `base\_url`
at Parallel, swap the key, set `model="parallel"`, and drop the `web\_search` tool
(grounding is automatic):
```diff theme={"system"}
- client = OpenAI(api\_key=OPENAI\_API\_KEY)
+ client = OpenAI(api\_key=PARALLEL\_API\_KEY, base\_url="https://api.parallel.ai/v1")
response = client.responses.create(
- model="gpt-5.4-mini",
+ model="parallel",
input=PROMPT,
reasoning={"effort": "low"},
- tools=[{"type": "web\_search"}],
)
```
See [OpenAI Responses Compatibility](/responses-api/openai-compatibility) for the full
field-by-field compatibility reference.
## Use it as a research subagent
You can use the Responses API as a web research tool for your own agent by creating a
tool that wraps the Responses API. Each tool call your agent makes is delegated to an
autonomous research subagent that returns a finished, cited answer — not raw search results
your agent has to read through.
```python theme={"system"}
def web\_research(query: str, effort: str = "low") -> dict:
"""Tool handler: one complete question in, one researched answer out."""
r = parallel.responses.create(
model="parallel", input=query, reasoning={"effort": effort}
)
return {"answer": r.output\_text}
```
Your agent plans and decomposes; Parallel researches. See
[Using It as a Research Subagent](/responses-api/examples/research-subagent) for the tool
definition, best practices for writing the tool description, and a full orchestrator loop.
## Features

Multi-turn conversations via `previous\_response\_id`

JSON answers conforming to your schema

Server-sent events with the standard Responses event sequence

Source annotations for grounded answers
## Examples

Call it directly: questions, deep research, enrichment, follow-ups

Expose it as a web-research tool of another LLM
## Next steps
\* Review [OpenAI Responses Compatibility](/responses-api/openai-compatibility) for honored,
ignored, and rejected request fields
\* For long-running or batch research, use the [Task API](/task-api/task-quickstart) — the
Responses API is synchronous only
\* Check [pricing](/getting-started/pricing) and [rate limits](/getting-started/rate-limits)
