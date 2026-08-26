# Ollama Tool Calling

Source: https://docs.parallel.ai/integrations/ollama-tool-calling.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Ollama Tool Calling
> Use Parallel Search as a tool with local Ollama models for real-time web access

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

Give locally-hosted models running under [Ollama](https://ollama.com) real-time web search by registering Parallel Search as a tool. This guide uses Ollama's native Python SDK, which derives the tool schema directly from your function signature and docstring.
## Overview
Modern Ollama models (Qwen 3.5, Gemma 4, Llama 3.1+) support [native tool calling](https://docs.ollama.com/capabilities/tool-calling): you pass `tools=[...]` on a chat call, the model emits structured `tool\_calls`, your code executes them, and you feed results back in a follow-up turn. By registering Parallel Search as a tool, your local model can:
\* Search the web for current information
\* Access real-time news, research, and facts
\* Cite sources with URLs in responses
This guide uses the native `ollama` Python SDK. If your application already speaks the OpenAI Chat Completions API — including TypeScript apps using `openai` — point your existing client at `http://localhost:11434/v1` and follow the [OpenAI Tool Calling](/integrations/openai-tool-calling) guide unchanged.
## Prerequisites
1. Install [Ollama](https://ollama.com/download) and start the daemon (`ollama serve`)
2. Pull a tool-capable model (Qwen 3.5 has the most reliable tool calls)
3. Get your Parallel API key from [Platform](https://platform.parallel.ai)
4. Install the Python SDKs
```bash theme={"system"}
ollama pull qwen3.5:0.8b
pip install ollama parallel-web
export PARALLEL\_API\_KEY="your-parallel-api-key"
```
## Define the Search Tool
The Ollama Python SDK accepts plain Python functions as tools. It reads the parameter type hints and docstring (Google-style) to build the JSON schema automatically — no separate schema object required. See [Search Tool Definition](/search/best-practices#search-tool-definition) for the recommended objective + queries shape.
```python theme={"system"}
import os
from parallel import Parallel
parallel\_client = Parallel(api\_key=os.environ["PARALLEL\_API\_KEY"])
def search\_web(objective: str, search\_queries: list[str]) -> dict:
"""Searches the web for current and factual information using Parallel.
Args:
objective: A concise, self-contained search query. Must include the
key entity or topic being searched for.
search\_queries: Exactly 3 keyword queries, each 3-6 words. Must be
diverse — vary entity names, synonyms, and angles. Each query must
include the key entity. Never write sentences or use site: operators.
Returns:
A dict with a `results` list, each containing url, title, and excerpts.
"""
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
This example uses the default `advanced` mode, which prioritizes result quality for tool use. For lower-latency responses, consider `"turbo"` (p50 \~200ms) or `"basic"`. To switch, add `mode="turbo"` to the search call inside your `search\_web` handler. The tool schema the model sees stays unchanged. See [Search Modes](/search/modes).
## Process Tool Calls
Pass the function directly in `tools`, then dispatch any returned calls and append the results as `role: "tool"` messages:
```python theme={"system"}
available\_tools = {"search\_web": search\_web}
def process\_tool\_calls(tool\_calls):
"""Execute each tool call and return tool-result messages."""
results = []
for call in tool\_calls:
fn = available\_tools.get(call.function.name)
if fn is None:
continue
# Ollama returns arguments as a parsed dict, not a JSON string.
result = fn(\*\*call.function.arguments)
results.append({
"role": "tool",
"tool\_name": call.function.name,
"content": str(result),
})
return results
```
## Complete Example
End-to-end: a chat loop that lets the model decide when to search.
```python theme={"system"}
import os
from ollama import chat
from parallel import Parallel
parallel\_client = Parallel(api\_key=os.environ["PARALLEL\_API\_KEY"])
def search\_web(objective: str, search\_queries: list[str]) -> dict:
"""Searches the web for current and factual information using Parallel.
Args:
objective: A concise, self-contained search query. Must include the
key entity or topic being searched for.
search\_queries: Exactly 3 keyword queries, each 3-6 words. Must be
diverse — vary entity names, synonyms, and angles. Each query must
include the key entity. Never write sentences or use site: operators.
"""
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
def chat\_with\_search(user\_message: str, model: str = "qwen3.5:0.8b") -> str:
messages = [
{
"role": "system",
"content": "You are a helpful research assistant. Use search\_web "
"for current information. Cite sources with URLs.",
},
{"role": "user", "content": user\_message},
]
available = {"search\_web": search\_web}
while True:
response = chat(model=model, messages=messages, tools=[search\_web])
messages.append(response.message)
if not response.message.tool\_calls:
return response.message.content
for call in response.message.tool\_calls:
fn = available.get(call.function.name)
result = fn(\*\*call.function.arguments) if fn else "unknown tool"
messages.append({
"role": "tool",
"tool\_name": call.function.name,
"content": str(result),
})
if \_\_name\_\_ == "\_\_main\_\_":
print(chat\_with\_search("What's new with Parallel Web Systems?"))
```
## Tool Parameters
| Parameter | Type | Required | Description |
| ---------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `objective` | string | Yes | A concise, self-contained search query. Must include the key entity or topic being searched for. |
| `search\_queries` | string\[] | Yes | Exactly 3 keyword search queries, each 3-6 words. Must be diverse — vary entity names, synonyms, and angles. |
## Choosing a Model
Tool calling reliability varies sharply by model. From most to least dependable for this workflow:
| Model | Notes |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `qwen3.5:0.8b` – `qwen3.5:9b` | Native tool calling across all sizes; the 0.8b runs on a laptop CPU. Recommended starting point. |
| `qwen3:8b` and up | Stable tool calling, slightly older generation. |
| `gemma4:e4b` | Native function calling; good quality if already pulled. |
| `llama3.1:8b` | Works but more prone to malformed arguments at smaller sizes. |
Smaller models (under \~7B) occasionally hallucinate parameters or skip required fields. If you see flaky calls, jump up a size before tuning prompts.
## Differences from the OpenAI Client
If you're porting code from the [OpenAI Tool Calling](/integrations/openai-tool-calling) guide, three things change:
| | OpenAI client | Ollama native SDK |
| ------------------------- | ------------------------------------------ | --------------------------------- |
| Tool definition | Manual JSON schema object | Pass the Python function directly |
| `tool\_calls` arguments | JSON-encoded \*\*string\*\* (use `json.loads`) | Parsed \*\*dict\*\* |
| Tool result message field | `tool\_call\_id` | `tool\_name` |
The OpenAI-compatible endpoint at `http://localhost:11434/v1` follows the OpenAI conventions instead — useful if you want to keep one code path across providers. Note that `tool\_choice` is not supported on that endpoint.
## Related Resources
\* [OpenAI Tool Calling](/integrations/openai-tool-calling)
\* [Search API Quickstart](/search/search-quickstart)
\* [Search Best Practices](/search/best-practices)
\* [Ollama tool calling documentation](https://docs.ollama.com/capabilities/tool-calling)
