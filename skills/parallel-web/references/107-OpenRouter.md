# OpenRouter

Source: https://docs.parallel.ai/integrations/openrouter.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# OpenRouter
> Use Parallel as a web search engine on OpenRouter
Parallel is available as a web search engine on [OpenRouter](https://openrouter.ai), enabling any model to use Parallel-powered web search results. Select Parallel as the engine in the OpenRouter `web\_search` server tool to ground AI responses with real-time web data.
Read OpenRouter's official documentation [here](https://openrouter.ai/docs/guides/features/server-tools/web-search).
## How it works
OpenRouter's `web\_search` server tool lets the model decide when and how often to search the web. When you select Parallel as the engine, OpenRouter routes the search request through Parallel's Search API and returns the results as annotations on the model response.
This works with \*\*any model\*\* on OpenRouter, regardless of the provider.
OpenRouter's older `web` plugin is deprecated. New integrations should use the `openrouter:web\_search` server tool shown below.
## Quick start
Set the `engine` to `"parallel"` in the `openrouter:web\_search` server tool:
```json theme={"system"}
{
"model": "openai/gpt-5.5",
"messages": [
{
"role": "user",
"content": "What are the latest developments in quantum computing?"
}
],
"tools": [
{
"type": "openrouter:web\_search",
"parameters": {
"engine": "parallel"
}
}
]
}
```
## Configuration options
Customize the server tool with additional parameters:
```json theme={"system"}
{
"model": "openai/gpt-5.5",
"tools": [
{
"type": "openrouter:web\_search",
"parameters": {
"engine": "parallel",
"max\_results": 5,
"max\_total\_results": 20,
"search\_context\_size": "medium",
"allowed\_domains": ["arxiv.org", "nature.com"]
}
}
]
}
```
| Parameter | Type | Default | Description |
| --------------------- | --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `engine` | string | — | Set to `"parallel"` to use Parallel search |
| `max\_results` | integer | 5 | Results per search call (range 1–25) |
| `max\_total\_results` | integer | — | Cap on cumulative results across multiple searches in a single response |
| `search\_context\_size` | string | `medium` | `low`, `medium`, or `high`. For Parallel, controls the total characters returned across all results |
| `allowed\_domains` | string\[] | — | Only include results from these domains |
| `excluded\_domains` | string\[] | — | Exclude results from these domains |
`allowed\_domains` and `excluded\_domains` are mutually exclusive when using Parallel as the engine — you cannot use both in the same request.
## Domain filtering
Restrict which domains appear in search results:
```json theme={"system"}
{
"model": "anthropic/claude-opus-4.7",
"tools": [
{
"type": "openrouter:web\_search",
"parameters": {
"engine": "parallel",
"allowed\_domains": ["arxiv.org", ".github.io"]
}
}
]
}
```
Both fields accept plain domains (e.g., `parallel.ai`) or bare domain extensions starting with a period (e.g., `.edu`, `.gov`).
## Parsing search results
Web search results are returned as annotations in the OpenAI Chat Completion format:
```json theme={"system"}
{
"message": {
"role": "assistant",
"content": "Here's what I found: ...",
"annotations": [
{
"type": "url\_citation",
"url\_citation": {
"url": "https://www.example.com/article",
"title": "Article Title",
"content": "Relevant content from the page",
"start\_index": 100,
"end\_index": 200
}
}
]
}
}
```
## Pricing
When using Parallel as the engine on OpenRouter, pricing has two components:
1. \*\*Web search costs\*\* — \$4 per 1,000 results, billed in OpenRouter credits (different from [Parallel's direct pricing](/getting-started/pricing))
2. \*\*LLM usage costs\*\* — charged by OpenRouter for the additional prompt tokens from search results
