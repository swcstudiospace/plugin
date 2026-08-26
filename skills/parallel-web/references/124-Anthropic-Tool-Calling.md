# Anthropic Tool Calling

Source: https://docs.parallel.ai/integrations/anthropic-tool-calling.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Anthropic Tool Calling
> Use Parallel Search as a tool with Anthropic's Claude models for real-time web access

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

Give your Claude-powered applications real-time web search by registering Parallel Search as a tool. This guide shows how to define Parallel Search using Anthropic's Messages API and handle the tool-call loop.
## Overview
Anthropic's [tool use](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview) lets Claude emit a structured `tool\_use` block when it wants to call a function you've defined. Your application executes the function and returns a `tool\_result` block in a follow-up `user` message. By registering Parallel Search as a tool, Claude can:
\* Search the web for current information
\* Access real-time news, research, and facts
\* Cite sources with URLs in responses
The Anthropic SDKs also ship a higher-level [Tool Runner](https://docs.claude.com/en/docs/agents-and-tools/tool-use/tool-runner) helper (currently in beta) that runs the loop for you. The example below uses the manual loop so the request/response shapes are explicit; once you understand them, switch to Tool Runner for less boilerplate.
## Prerequisites
1. Get your Parallel API key from [Platform](https://platform.parallel.ai)
2. Get your Anthropic API key from [Anthropic Console](https://console.anthropic.com/)
3. Install the required SDKs:
```bash Python theme={"system"}
pip install anthropic parallel-web
export PARALLEL\_API\_KEY="your-parallel-api-key"
export ANTHROPIC\_API\_KEY="your-anthropic-api-key"
```
```bash TypeScript theme={"system"}
npm install @anthropic-ai/sdk parallel-web
export PARALLEL\_API\_KEY="your-parallel-api-key"
export ANTHROPIC\_API\_KEY="your-anthropic-api-key"
```
## Define the Search Tool
Anthropic tool definitions use `name`, `description`, and `input\_schema` (no outer `function` wrapper, and the schema field is `input\_schema` rather than OpenAI's `parameters`). See [Search Tool Definition](/search/best-practices#search-tool-definition) for a framework-agnostic, copy-paste-ready version.
```python Python theme={"system"}
parallel\_search\_tool = {
"name": "search\_web",
"description": "Searches the web for current and factual information, returning relevant results with titles, URLs, and content snippets.",
"input\_schema": {
"type": "object",
"properties": {
"objective": {
"type": "string",
"description": "A concise, self-contained search query. Must include the key entity or topic being searched for."
},
"search\_queries": {
"type": "array",
"description": "Exactly 3 keyword search queries, each 3-6 words. Must be diverse — vary entity names, synonyms, and angles. Each query must include the key entity or topic. NEVER write sentences, instructions, or use site: operators.",
"items": {"type": "string"},
"minItems": 3,
"maxItems": 3
}
},
"required": ["objective", "search\_queries"]
}
}
```
```typescript TypeScript theme={"system"}
import Anthropic from "@anthropic-ai/sdk";
const parallelSearchTool: Anthropic.Tool = {
name: "search\_web",
description:
"Searches the web for current and factual information, returning relevant results with titles, URLs, and content snippets.",
input\_schema: {
type: "object",
properties: {
objective: {
type: "string",
description:
"A concise, self-contained search query. Must include the key entity or topic being searched for.",
},
search\_queries: {
type: "array",
description:
"Exactly 3 keyword search queries, each 3-6 words. Must be diverse — vary entity names, synonyms, and angles. Each query must include the key entity or topic. NEVER write sentences, instructions, or use site: operators.",
items: { type: "string" },
minItems: 3,
maxItems: 3,
},
},
required: ["objective", "search\_queries"],
},
};
```

Add `"strict": true` to the tool definition to enable [strict tool use](https://docs.claude.com/en/docs/agents-and-tools/tool-use/strict-tool-use), which guarantees that Claude's tool inputs conform to your schema exactly.
## Implement the Search Function
Create a function that calls the Parallel Search API when Claude requests it:
```python Python theme={"system"}
import os
from parallel import Parallel
parallel\_client = Parallel(api\_key=os.environ["PARALLEL\_API\_KEY"])
def search\_web(objective: str, search\_queries: list[str]) -> dict:
"""Execute a search using the Parallel Search API."""
response = parallel\_client.search(
objective=objective,
search\_queries=search\_queries,
)
return {
"results": [
{"url": r.url, "title": r.title, "excerpts": r.excerpts[:3] if r.excerpts else []}
for r in response.results
]
}
```
```typescript TypeScript theme={"system"}
import Parallel from "parallel-web";
const parallel = new Parallel({ apiKey: process.env.PARALLEL\_API\_KEY });
interface SearchParams {
objective: string;
search\_queries: string[];
}
async function searchWeb(params: SearchParams) {
const response = await parallel.search({
objective: params.objective,
search\_queries: params.search\_queries,
});
return {
results: response.results.map((r) => ({
url: r.url,
title: r.title,
excerpts: r.excerpts?.slice(0, 3) || [],
})),
};
}
```
## Process Tool Calls
Claude returns one or more `tool\_use` blocks inside `response.content` whenever `stop\_reason == "tool\_use"`. Execute each call and reply with a `user` message whose content is a list of `tool\_result` blocks:
```python Python theme={"system"}
import json
def process\_tool\_calls(content\_blocks):
"""Build tool\_result blocks for every tool\_use block in the response."""
results = []
for block in content\_blocks:
if block.type == "tool\_use" and block.name == "search\_web":
result = search\_web(
objective=block.input["objective"],
search\_queries=block.input["search\_queries"],
)
results.append({
"type": "tool\_result",
"tool\_use\_id": block.id,
"content": json.dumps(result),
})
return results
```
```typescript TypeScript theme={"system"}
async function processToolCalls(
contentBlocks: Anthropic.ContentBlock[]
): Promise {
const results: Anthropic.ToolResultBlockParam[] = [];
for (const block of contentBlocks) {
if (block.type === "tool\_use" && block.name === "search\_web") {
const input = block.input as SearchParams;
const result = await searchWeb(input);
results.push({
type: "tool\_result",
tool\_use\_id: block.id,
content: JSON.stringify(result),
});
}
}
return results;
}
```

Anthropic requires that `tool\_result` blocks come \*\*first\*\* in the content array of the user message that follows a `tool\_use` response — any free-form text must come after them.
## Complete Example
End-to-end: a loop that lets Claude call `search\_web` until it has enough information to answer.
```python Python theme={"system"}
import os
import json
from anthropic import Anthropic
from parallel import Parallel
anthropic\_client = Anthropic()
parallel\_client = Parallel(api\_key=os.environ["PARALLEL\_API\_KEY"])
parallel\_search\_tool = {
"name": "search\_web",
"description": "Searches the web for current and factual information, returning relevant results with titles, URLs, and content snippets.",
"input\_schema": {
"type": "object",
"properties": {
"objective": {
"type": "string",
"description": "A concise, self-contained search query. Must include the key entity or topic being searched for."
},
"search\_queries": {
"type": "array",
"description": "Exactly 3 keyword search queries, each 3-6 words. Must be diverse — vary entity names, synonyms, and angles. Each query must include the key entity or topic. NEVER write sentences, instructions, or use site: operators.",
"items": {"type": "string"},
"minItems": 3,
"maxItems": 3
}
},
"required": ["objective", "search\_queries"]
}
}
def search\_web(objective: str, search\_queries: list[str]) -> dict:
response = parallel\_client.search(
objective=objective,
search\_queries=search\_queries,
)
return {
"results": [
{"url": r.url, "title": r.title, "excerpts": r.excerpts[:3] if r.excerpts else []}
for r in response.results
]
}
def chat\_with\_search(user\_message: str, model: str = "claude-opus-4-7") -> str:
messages = [{"role": "user", "content": user\_message}]
system = (
"You are a helpful research assistant. Use the search\_web tool to find "
"current information. Always cite sources with URLs."
)
while True:
response = anthropic\_client.messages.create(
model=model,
max\_tokens=4096,
system=system,
tools=[parallel\_search\_tool],
messages=messages,
)
# Append the assistant turn verbatim so tool\_use ids stay aligned.
messages.append({"role": "assistant", "content": response.content})
if response.stop\_reason != "tool\_use":
return "".join(b.text for b in response.content if b.type == "text")
tool\_results = []
for block in response.content:
if block.type == "tool\_use" and block.name == "search\_web":
result = search\_web(
objective=block.input["objective"],
search\_queries=block.input["search\_queries"],
)
tool\_results.append({
"type": "tool\_result",
"tool\_use\_id": block.id,
"content": json.dumps(result),
})
messages.append({"role": "user", "content": tool\_results})
if \_\_name\_\_ == "\_\_main\_\_":
print(chat\_with\_search("What are the latest developments in quantum computing?"))
```
```typescript TypeScript theme={"system"}
import Anthropic from "@anthropic-ai/sdk";
import Parallel from "parallel-web";
const anthropic = new Anthropic();
const parallel = new Parallel({ apiKey: process.env.PARALLEL\_API\_KEY });
const parallelSearchTool: Anthropic.Tool = {
name: "search\_web",
description:
"Searches the web for current and factual information, returning relevant results with titles, URLs, and content snippets.",
input\_schema: {
type: "object",
properties: {
objective: {
type: "string",
description:
"A concise, self-contained search query. Must include the key entity or topic being searched for.",
},
search\_queries: {
type: "array",
description:
"Exactly 3 keyword search queries, each 3-6 words. Must be diverse — vary entity names, synonyms, and angles. Each query must include the key entity or topic. NEVER write sentences, instructions, or use site: operators.",
items: { type: "string" },
minItems: 3,
maxItems: 3,
},
},
required: ["objective", "search\_queries"],
},
};
interface SearchParams {
objective: string;
search\_queries: string[];
}
async function searchWeb(params: SearchParams) {
const response = await parallel.search({
objective: params.objective,
search\_queries: params.search\_queries,
});
return {
results: response.results.map((r) => ({
url: r.url,
title: r.title,
excerpts: r.excerpts?.slice(0, 3) || [],
})),
};
}
async function chatWithSearch(
userMessage: string,
model: string = "claude-opus-4-7"
): Promise {
const messages: Anthropic.MessageParam[] = [
{ role: "user", content: userMessage },
];
const system =
"You are a helpful research assistant. Use the search\_web tool to find " +
"current information. Always cite sources with URLs.";
while (true) {
const response = await anthropic.messages.create({
model,
max\_tokens: 4096,
system,
tools: [parallelSearchTool],
messages,
});
messages.push({ role: "assistant", content: response.content });
if (response.stop\_reason !== "tool\_use") {
return response.content
.filter((b): b is Anthropic.TextBlock => b.type === "text")
.map((b) => b.text)
.join("");
}
const toolResults: Anthropic.ToolResultBlockParam[] = [];
for (const block of response.content) {
if (block.type === "tool\_use" && block.name === "search\_web") {
const result = await searchWeb(block.input as SearchParams);
toolResults.push({
type: "tool\_result",
tool\_use\_id: block.id,
content: JSON.stringify(result),
});
}
}
messages.push({ role: "user", content: toolResults });
}
}
async function main() {
console.log(await chatWithSearch("What are the latest developments in quantum computing?"));
}
main().catch(console.error);
```
## Tool Parameters
| Parameter | Type | Required | Description |
| ---------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `objective` | string | Yes | A concise, self-contained search query. Must include the key entity or topic being searched for. |
| `search\_queries` | string\[] | Yes | Exactly 3 keyword search queries, each 3-6 words. Must be diverse — vary entity names, synonyms, and angles. |
This example uses the default `advanced` mode, which prioritizes result quality for tool use. For lower-latency responses, consider `"turbo"` (p50 \~200ms) or `"basic"`. To switch, set the search `mode` to `"turbo"` inside your `search\_web` handler. The tool schema the model sees stays unchanged. See [Search Modes](/search/modes).
## Differences from the OpenAI Client
If you're porting from the [OpenAI Tool Calling](/integrations/openai-tool-calling) guide, the main shape changes are:
| | OpenAI client | Anthropic client |
| --------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------ |
| Tool wrapper | `{type: "function", function: {...}}` | Flat `{name, description, input\_schema}` |
| Schema field | `parameters` | `input\_schema` |
| Tool call in response | `message.tool\_calls[i].function.arguments` (JSON string) | `content[i]` block where `type == "tool\_use"` (parsed dict) |
| Tool result message | `{role: "tool", tool\_call\_id, content}` | `{role: "user", content: [{type: "tool\_result", tool\_use\_id, content}]}` |
| Tool-call signal | `finish\_reason == "tool\_calls"` | `stop\_reason == "tool\_use"` |
## Related Resources
\* [OpenAI Tool Calling](/integrations/openai-tool-calling)
\* [Search API Quickstart](/search/search-quickstart)
\* [Search Best Practices](/search/best-practices)
\* [Anthropic tool use overview](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview)
