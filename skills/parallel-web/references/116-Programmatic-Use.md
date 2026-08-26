# Programmatic Use

Source: https://docs.parallel.ai/integrations/mcp/programmatic-use.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Programmatic Use
> How to use the MCP servers Programmatically

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

When building an agent or chat experiences that requires search, deep research, or batch task processing capabilities, it can be a good choice to integrate with our MCPs. When you desire more control over the reasoning and tool descriptions for niche use-cases (if the system prompt isn't sufficient) or want to limit or simplify the tools, it may be better to use the APIs directly to build your own tools, for example using the [AI SDK](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling). Using the [MCP-to-AI-SDK](https://github.com/vercel-labs/mcp-to-ai-sdk) is an excellent starting point in that case.
## Authentication
| Server | Default endpoint | API key required? |
| -------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| \*\*Search MCP\*\* | `https://search.parallel.ai/mcp` | \*\*No.\*\* Free to use without an `Authorization` header. Pass a Parallel API key as a Bearer token only if you want higher rate limits. OAuth is not available here — clients that do OAuth discovery will not find metadata on this endpoint. |
| \*\*Search MCP (OAuth / auth-enforced)\*\* | `https://search.parallel.ai/mcp-oauth` | Yes. Bearer API key or OAuth. Anonymous requests return `401`. Use this endpoint if you want OAuth sign-in or enforced auth. |
| \*\*Task MCP\*\* | `https://task-mcp.parallel.ai/mcp` | Yes. Either perform the [OAuth flow](/integrations/oauth-provider) or pass your Parallel API key as a Bearer token. |
When passing a Parallel API key, use the provider-specific field:
\* \*\*OpenAI Responses API\*\* — `headers: { Authorization: "Bearer " }` on the MCP tool.
\* \*\*Anthropic Messages API\*\* — `authorization\_token: ""` on the MCP server entry.
The Search MCP examples below include the `Authorization` header / `authorization\_token` field to show the higher-rate-limit variant. \*\*Remove that line entirely for the free, no-auth default\*\* — it's not required for the server to accept the request.
## OpenAI Integration
### Search MCP with OpenAI
The `Authorization` header on the MCP tool is \*\*optional\*\* — the Search MCP is free to use without it. Include a Parallel API key only to unlock higher rate limits.
```bash cURL theme={"system"}
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI\_API\_KEY" \
-d '{
"model": "gpt-5",
"tools": [
{
"type": "mcp",
"server\_label": "parallel\_web\_search",
"server\_url": "https://search.parallel.ai/mcp",
"headers": {
"Authorization": "Bearer YOUR\_PARALLEL\_API\_KEY"
},
"require\_approval": "never"
}
],
"input": "Who is the CEO of Apple?"
}'
```
```python Python theme={"system"}
import os
from openai import OpenAI
from openai.types import responses as openai\_responses
client = OpenAI() # reads OPENAI\_API\_KEY from environment
tools = [
openai\_responses.tool\_param.Mcp(
server\_label="parallel\_web\_search",
server\_url="https://search.parallel.ai/mcp",
# Optional — omit `headers` entirely to call the Search MCP for free.
# Include a Parallel API key only for higher rate limits.
headers={"Authorization": f"Bearer {os.environ['PARALLEL\_API\_KEY']}"},
type="mcp",
require\_approval="never",
)
]
response = client.responses.create(
model="gpt-5",
input="Who is the CEO of Apple?",
tools=tools,
)
print(response.output\_text)
```
```typescript TypeScript theme={"system"}
import OpenAI from "openai";
import { ResponseTool } from "openai/resources/responses";
const client = new OpenAI({ apiKey: process.env.OPENAI\_API\_KEY });
const response = await client.responses.create({
model: "gpt-5",
tools: [
{
type: "mcp",
server\_label: "parallel\_web\_search",
server\_url: "https://search.parallel.ai/mcp",
// Optional — omit `headers` entirely to call the Search MCP for free.
// Include a Parallel API key only for higher rate limits.
headers: { Authorization: `Bearer ${process.env.PARALLEL\_API\_KEY}` },
require\_approval: "never",
} as ResponseTool.Mcp,
],
input: "Who is the CEO of Apple?",
});
console.log(response.output\_text);
```
### Task MCP with OpenAI
```bash cURL theme={"system"}
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI\_API\_KEY" \
-d '{
"model": "gpt-5",
"tools": [
{
"type": "mcp",
"server\_label": "parallel\_task",
"server\_url": "https://task-mcp.parallel.ai/mcp",
"headers": {
"Authorization": "Bearer YOUR\_PARALLEL\_API\_KEY"
},
"require\_approval": "never"
}
],
"input": "Create a deep research task about the latest developments in AI safety research"
}'
```
```python Python theme={"system"}
import os
from openai import OpenAI
from openai.types import responses as openai\_responses
client = OpenAI() # reads OPENAI\_API\_KEY from environment
tools = [
openai\_responses.tool\_param.Mcp(
server\_label="parallel\_task",
server\_url="https://task-mcp.parallel.ai/mcp",
headers={"Authorization": f"Bearer {os.environ['PARALLEL\_API\_KEY']}"},
type="mcp",
require\_approval="never",
)
]
response = client.responses.create(
model="gpt-5",
input="Create a deep research task about the latest developments in AI safety research",
tools=tools,
)
print(response.output\_text)
```
```typescript TypeScript theme={"system"}
import OpenAI from "openai";
import { ResponseTool } from "openai/resources/responses";
const client = new OpenAI({
apiKey: process.env.OPENAI\_API\_KEY,
});
const parallelApiKey = process.env.PARALLEL\_API\_KEY;
const response = await client.responses.create({
model: "gpt-5",
tools: [
{
type: "mcp",
server\_label: "parallel\_task",
server\_url: "https://task-mcp.parallel.ai/mcp",
headers: { Authorization: `Bearer ${parallelApiKey}` },
require\_approval: "never",
} as ResponseTool.Mcp,
],
input:
"Create a deep research task about the latest developments in AI safety research",
});
console.log(response.output\_text);
```
## Anthropic Integration
### Search MCP with Anthropic
The `authorization\_token` on the MCP server entry is \*\*optional\*\* — the Search MCP is free to use without it. Include a Parallel API key only to unlock higher rate limits.
```bash cURL theme={"system"}
curl https://api.anthropic.com/v1/messages \
-H "Content-Type: application/json" \
-H "X-API-Key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: mcp-client-2025-04-04" \
-d '{
"model": "claude-sonnet-4-5",
"max\_tokens": 8000,
"messages": [
{
"role": "user",
"content": "What is the latest in AI research?"
}
],
"mcp\_servers": [
{
"type": "url",
"url": "https://search.parallel.ai/mcp",
"name": "parallel-search",
"authorization\_token": "YOUR\_PARALLEL\_API\_KEY"
}
]
}'
```
```python Python theme={"system"}
import os
import anthropic
client = anthropic.Anthropic() # reads ANTHROPIC\_API\_KEY from environment
response = client.beta.messages.create(
model="claude-sonnet-4-5",
messages=[{
"role": "user",
"content": "What is the latest in AI research?"
}],
max\_tokens=8000,
mcp\_servers=[{
"type": "url",
"url": "https://search.parallel.ai/mcp",
"name": "parallel-search",
# Optional — omit `authorization\_token` entirely to call the Search MCP for free.
# Include a Parallel API key only for higher rate limits.
"authorization\_token": os.environ["PARALLEL\_API\_KEY"],
}],
betas=["mcp-client-2025-04-04"]
)
print(response)
```
```typescript TypeScript theme={"system"}
import { Anthropic } from "@anthropic-ai/sdk";
const anthropic = new Anthropic({
apiKey: process.env.ANTHROPIC\_API\_KEY,
});
const response = await anthropic.beta.messages.create({
model: "claude-sonnet-4-5",
messages: [
{
role: "user",
content: "What is the latest in AI research?",
},
],
max\_tokens: 8000,
mcp\_servers: [
{
type: "url",
url: "https://search.parallel.ai/mcp",
name: "parallel-search",
// Optional — omit `authorization\_token` entirely to call the Search MCP for free.
// Include a Parallel API key only for higher rate limits.
authorization\_token: process.env.PARALLEL\_API\_KEY,
},
],
betas: ["mcp-client-2025-04-04"],
});
console.log(response);
```
### Task MCP with Anthropic
```bash cURL theme={"system"}
curl https://api.anthropic.com/v1/messages \
-H "Content-Type: application/json" \
-H "X-API-Key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: mcp-client-2025-04-04" \
-d '{
"model": "claude-sonnet-4-5",
"max\_tokens": 8000,
"messages": [
{
"role": "user",
"content": "Create a deep research task about the latest developments in AI safety research"
}
],
"mcp\_servers": [
{
"type": "url",
"url": "https://task-mcp.parallel.ai/mcp",
"name": "parallel-task",
"authorization\_token": "YOUR\_PARALLEL\_API\_KEY"
}
]
}'
```
```python Python theme={"system"}
import os
import anthropic
client = anthropic.Anthropic() # reads ANTHROPIC\_API\_KEY from environment
response = client.beta.messages.create(
model="claude-sonnet-4-5",
messages=[{
"role": "user",
"content": "Create a deep research task about the latest developments in AI safety research"
}],
max\_tokens=8000,
mcp\_servers=[{
"type": "url",
"url": "https://task-mcp.parallel.ai/mcp",
"name": "parallel-task",
"authorization\_token": os.environ["PARALLEL\_API\_KEY"],
}],
betas=["mcp-client-2025-04-04"]
)
print(response)
```
```typescript TypeScript theme={"system"}
import { Anthropic } from "@anthropic-ai/sdk";
const anthropic = new Anthropic({
apiKey: process.env.ANTHROPIC\_API\_KEY,
});
const parallelApiKey = process.env.PARALLEL\_API\_KEY;
const response = await anthropic.beta.messages.create({
model: "claude-sonnet-4-5",
messages: [
{
role: "user",
content:
"Create a deep research task about the latest developments in AI safety research",
},
],
max\_tokens: 8000,
mcp\_servers: [
{
type: "url",
url: "https://task-mcp.parallel.ai/mcp",
name: "parallel-task",
authorization\_token: parallelApiKey,
},
],
betas: ["mcp-client-2025-04-04"],
});
console.log(response);
```
## Limitations
### Context Window Constraints
The Task MCP is designed for smaller parallel tasks and experimentation, constrained by:
\* \*\*Context window size\*\* - Large datasets may overflow the available context
\* \*\*Max output tokens\*\* - Results must fit within model output limitations
\* \*\*Data source size\*\* - Initial data should be appropriately sized for the model
For large-scale operations, consider using the Parallel APIs directly or other integration methods.
### Asynchronous Nature
Due to current MCP/LLM client limitations:
\* Tasks run asynchronously but don't automatically wait for completion
\* Users must explicitly request results in follow-up turns
\* Multiple workflow steps require manual progression through conversation turns
### Model Requirements
\* \*\*Search MCP\*\* - Works well with smaller models (GPT OSS 20B+)
\* \*\*Task MCP\*\* - Requires larger models with strong reasoning capabilities (e.g. GPT-5, Claude Sonnet 4.5)
\* Smaller models may result in degraded output quality for complex tasks
Reach out to be among the first to overcome current limitations as we continue improving the platform.
