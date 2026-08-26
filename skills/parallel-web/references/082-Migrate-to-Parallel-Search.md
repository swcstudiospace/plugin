# Migrate to Parallel Search

Source: https://docs.parallel.ai/search/migrate-to-parallel.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Migrate to Parallel Search
> Move from Exa, Tavily, SERP APIs, or built-in model search to the Parallel Search API

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

This guide maps the request you make today to its Parallel Search equivalent. Parallel Search takes keyword `search\_queries`, plus an optional natural language `objective`, and returns ranked, LLM-optimized excerpts in a single call. `search\_queries` is the only required field, so most migrations are a one-field change. Picking a [mode](/search/modes) is optional; requests default to `advanced`.
| Coming from | Closest Parallel equivalent |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Exa `instant` or `fast` | Search with `mode: "turbo"` |
| Exa `auto` | Search with `mode: "basic"` |
| Exa `deep-lite` or `deep` | [Task API](/task-api/task-quickstart) or [Chat API](/chat-api/chat-quickstart) (synthesized output) |
| Exa `deep-reasoning` | [Task API](/task-api/task-quickstart) |
| Tavily `fast` or `ultra-fast` | Search with `mode: "turbo"` |
| Tavily `basic` | Search with `mode: "basic"` |
| Tavily `advanced` | Search with `mode: "advanced"` |
| SERP API | Search with `mode: "turbo"` or `"basic"` (one call, ranked excerpts) |
| Built-in model search (e.g. OpenAI `web\_search`) | Search as a function tool, any mode ([OpenAI](/integrations/openai-tool-calling), [Anthropic](/integrations/anthropic-tool-calling)) |
## Start with one field
Exa, Tavily, and SERP APIs all center on a single query string. The fastest migration is to pass that string as one entry in `search\_queries`. That alone is a complete, valid request, since `mode` is optional and defaults to `advanced`:
```json theme={"system"}
{ "search\_queries": ["latest developments in solid state batteries"] }
```
For the lowest latency and cost, add `"mode": "turbo"`. For better results, also add an optional `objective`, a natural language description of your full intent, and split the query into 2-3 short keyword queries:
```json theme={"system"}
{
"objective": "Latest developments in solid state batteries. Focus on manufacturing progress and commercialization timelines.",
"search\_queries": ["solid state battery progress", "solid state battery commercialization"],
"mode": "turbo"
}
```
See [Best Practices](/search/best-practices) for how to write objectives and queries.
## From Exa
| Exa parameter | Parallel equivalent |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `query` | `search\_queries` (the only required field); optionally add an `objective` describing your full intent |
| `type: "instant"` or `"fast"` | `mode: "turbo"` |
| `type: "auto"` | `mode: "basic"` |
| `type: "deep-lite"` or `"deep"` | Use the [Task API](/task-api/task-quickstart) or [Chat API](/chat-api/chat-quickstart) (both return synthesized output) |
| `type: "deep-reasoning"` | Use the [Task API](/task-api/task-quickstart) |
| `numResults` | `advanced\_settings.max\_results` |
| `additionalQueries` | Add them as extra entries in `search\_queries`; Parallel searches multiple queries in one call |
| `includeDomains` / `excludeDomains` | `advanced\_settings.source\_policy.include\_domains` / `exclude\_domains` |
| `startPublishedDate` | `advanced\_settings.source\_policy.after\_date` (YYYY-MM-DD) |
| `userLocation` | `advanced\_settings.location` (ISO 3166-1 alpha-2 country code) |
| `contents.text` (full page text) | Search returns compressed excerpts, not full page bodies. For full page contents, use the [Extract API](/extract/extract-quickstart) |
| `category: "company"` or `"people"` | Consider [Entity Search](/findall-api/entity-search) |
| `outputSchema` / `summary` | Structured, synthesized outputs are the [Task API](/task-api/task-quickstart) or [Chat API](/chat-api/chat-quickstart) |
Before and after:
```bash Exa theme={"system"}
curl https://api.exa.ai/search \
-H "x-api-key: $EXA\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"query": "latest developments in solid state batteries",
"type": "fast",
"numResults": 10,
"contents": { "text": { "maxCharacters": 1500 } }
}'
```
```bash Parallel theme={"system"}
curl https://api.parallel.ai/v1/search \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"search\_queries": ["latest developments in solid state batteries"],
"mode": "turbo"
}'
```
Excerpts are on by default and sized dynamically, so most requests need no excerpt configuration at all. Add `advanced\_settings` knobs only when you have a specific product constraint. Restrictive settings can reduce result quality.
## From Tavily
Tavily's `search\_depth` tiers map one-to-one onto Parallel modes.
| Tavily parameter | Parallel equivalent |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `query` | `search\_queries` (the only required field); optionally add an `objective` describing your full intent |
| `search\_depth: "fast"` or `"ultra-fast"` | `mode: "turbo"` |
| `search\_depth: "basic"` | `mode: "basic"` |
| `search\_depth: "advanced"` | `mode: "advanced"` |
| `max\_results` | `advanced\_settings.max\_results` |
| `include\_domains` / `exclude\_domains` | `advanced\_settings.source\_policy.include\_domains` / `exclude\_domains` |
| `start\_date` | `advanced\_settings.source\_policy.after\_date` (YYYY-MM-DD). Tavily `time\_range` (relative, e.g. `week`) has no direct equivalent; convert to an absolute date first |
| `country` | `advanced\_settings.location` (ISO 3166-1 alpha-2; convert Tavily's country name to a code) |
| `topic: "news"` or `"finance"` | State the focus in your `objective` (for example "recent news about..." or "latest financial results for...") |
| `include\_answer` | Search returns excerpts for your model to reason over. For grounded completions, use the [Chat API](/chat-api/chat-quickstart) |
| `include\_raw\_content` | Full page contents are the [Extract API](/extract/extract-quickstart) |
Before and after:
```bash Tavily theme={"system"}
curl https://api.tavily.com/search \
-H "Authorization: Bearer $TAVILY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"query": "latest developments in solid state batteries",
"search\_depth": "fast",
"max\_results": 10
}'
```
```bash Parallel theme={"system"}
curl https://api.parallel.ai/v1/search \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"search\_queries": ["latest developments in solid state batteries"],
"mode": "turbo"
}'
```
Parallel authenticates with an `x-api-key` header rather than `Authorization: Bearer`, so a request that keeps the Tavily-style Bearer header returns 401.
## From a SERP API
A SERP API returns a ranked list of links and snippets, but you must make subsequent fetches to extract usable information.
Parallel Search combines everything into a single call. Instead of links you fetch and process, you get ranked, compressed excerpts sized for a model, so there is no fetch round and no chunking or ranking to build yourself. If a workflow still needs a specific page's full contents, use the [Extract API](/extract/extract-quickstart).

You search, then fetch and process each result in your own code:
```python theme={"system"}
import os, requests
from bs4 import BeautifulSoup
# split\_into\_chunks() and rank\_by\_relevance() are helpers you write and maintain
query = "solid state battery developments"
# Step 1: search returns links + snippets, no page content
hits = requests.get("https://serpapi.com/search", params={
"q": query, "api\_key": os.environ["SERPAPI\_KEY"],
}).json()["organic\_results"][:10]
# Step 2: fetch every result URL yourself, one at a time
pages = []
for h in hits:
try:
html = requests.get(h["link"], timeout=10).text
except requests.RequestException:
continue # dead links, timeouts, bot blocks: your problem to handle
text = BeautifulSoup(html, "html.parser").get\_text(" ", strip=True)
# (a scraper that returns markdown lets you skip this HTML parsing)
pages.append(text)
# Step 3: chunk and rank locally so it fits the model context
chunks = [c for p in pages for c in split\_into\_chunks(p)]
context = rank\_by\_relevance(chunks, query)[:15]
```
Parallel does it in one call:
```python theme={"system"}
import os
from parallel import Parallel
client = Parallel(api\_key=os.environ["PARALLEL\_API\_KEY"])
# one call returns ranked, model-ready excerpts
search = client.search(search\_queries=["solid state battery developments"], mode="turbo")
context = [ex for r in search.results for ex in r.excerpts]
```

You search, then fetch each result:
```bash theme={"system"}
# Step 1: search returns links + snippets, no page content
curl "https://serpapi.com/search?q=solid+state+battery+developments&api\_key=$SERPAPI\_KEY"
# Step 2: fetch each result URL for its content (repeat for every link),
# then strip HTML, chunk, and rank in your own code
curl -L "https://"
curl -L "https://"
```
Parallel does it in one call:
```bash theme={"system"}
curl https://api.parallel.ai/v1/search \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{ "search\_queries": ["solid state battery developments"], "mode": "turbo" }'
```
## From built-in model search
"Built-in model search" splits into two cases that migrate differently.
\*\*Building on the API.\*\* If you call a provider's hosted search tool in your own app (for example OpenAI's `web\_search` in the Responses API), the provider runs the search inside its own walls. Migrate by registering Parallel Search as a function tool your app executes, which gives you mode control (Turbo today), the excerpts, and the provider choice.
```python theme={"system"}
def search\_web(search\_queries: list[str], objective: str | None = None) -> dict:
return parallel\_client.search(
search\_queries=search\_queries,
objective=objective,
mode="turbo",
)
```
The model decides when to search. Your handler decides how. Full walkthroughs with the tool schema and the tool-result loop live on the [OpenAI](/integrations/openai-tool-calling), [Anthropic](/integrations/anthropic-tool-calling), and [Ollama](/integrations/ollama-tool-calling) pages.
\*\*Inside the ChatGPT app (no code).\*\* If you rely on web search in ChatGPT itself rather than building on the API, add Parallel as a connector through the [Search MCP](/integrations/mcp/search-mcp).
## What you parse now
Parallel returns a `results` array. Each item has a `url`, `title`, `publish\_date`, and `excerpts` (the compressed, relevant snippets your model reads), with a top-level `warnings` field worth checking on early calls:
```json theme={"system"}
{
"results": [
{ "url": "https://...", "title": "...", "publish\_date": null, "excerpts": ["..."] }
],
"warnings": null
}
```
If your current integration expects a field Search does not return, here is where that capability lives:
| If your integration expects | With Parallel Search | Next step |
| -------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| a relevance `score` to sort on | results come back already ranked | preserve the returned order; there is no per-result score |
| full page text (Exa `text`, Tavily `raw\_content`) | you get compressed excerpts, not full page bodies | use the [Extract API](/extract/extract-quickstart) for full contents |
| a synthesized answer or report (Tavily `include\_answer`, Exa `summary` / `deep`) | Search returns excerpts for your model to reason over | use the [Chat API](/chat-api/chat-quickstart) for grounded answers, or the [Task API](/task-api/task-quickstart) for multi-step research |
| a list of people or companies (Exa `category`) | Search retrieves pages and excerpts across the web | use [Entity Search](/findall-api/entity-search) |
| `images` | not returned | — |
## Verify your migration
Before moving production traffic, run your top queries in the [Playground](https://platform.parallel.ai/play/search) and start with the mapped mode. On your first calls, check the response `warnings` field for any parameters that were adjusted or ignored, and confirm [Pricing](/getting-started/pricing) and [Rate Limits](/getting-started/rate-limits) for your volume.
