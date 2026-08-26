# Upgrade from Beta to GA

Source: https://docs.parallel.ai/search/search-migration-guide.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Upgrade from Beta to GA
> Migrate from Beta to GA (V1) Search API

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

This guide helps you migrate from the Beta Search API (`/v1beta`) to the GA version (`/v1`).
The V1 Search API is generally available and recommended for all new integrations. This guide explains how to migrate existing Beta integrations to V1's current modes and request fields.
## Highlights
1. \*\*`search\_queries` is now required\*\* — At least one non-empty query must be provided. In Beta, only one of `objective` or `search\_queries` was required.
2. \*\*Settings reorganized under `advanced\_settings`\*\* — `source\_policy`, `fetch\_policy`, excerpt settings, and `max\_results` are now nested under a single new `advanced\_settings` object (previously top-level fields). See [Advanced Settings](/search/advanced-search-settings) for more details.
3. \*\*New `location` field\*\* — Set `advanced\_settings.location` to an ISO 3166-1 alpha-2 country code (e.g., `"us"`, `"gb"`, `"de"`, `"jp"`) to geo-target search results. Only a subset of countries are currently supported; unsupported or invalid values are ignored with a warning.
4. \*\*Updated modes\*\* — V1 has three modes (`turbo`, `basic`, `advanced`), with `advanced` as the new default. The Beta mapping is unchanged: map both `fast` and `one-shot` to `basic`, and map `agentic` to `advanced`. `turbo` is new in V1 and has no Beta equivalent.
\* \*\*`basic`\*\*: The V1 equivalent of Beta `fast` and `one-shot`. Offers lower latency and works best with 2-3 high-quality search\\_queries. The right choice for most applications.
\* \*\*`advanced`\*\* (default): The V1 equivalent of Beta `agentic`. Provides higher quality with more advanced retrieval and compression. Best for complex queries where result quality matters more than latency.
\* \*\*`turbo`\*\* (new in V1): Lowest latency and cost for simple, high-volume lookups. See [Search Modes](/search/modes).
## Overview of Changes
| Component | Beta | V1 |
| ----------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| \*\*Endpoint\*\* | `/v1beta/search` | `/v1/search` |
| \*\*Modes\*\* | `fast`, `one-shot`, `agentic` (default `one-shot`) | `turbo`, `basic`, `advanced` (default `advanced`). `fast` and `one-shot` map to `basic`, `agentic` maps to `advanced`, and `turbo` is new with no Beta equivalent |
| \*\*SDK method\*\* | `client.beta.search()` (`parallel-web` before 1.0) | `client.search()` (`parallel-web` 1.0+) |
| \*\*`search\_queries`\*\* | Optional (one of `objective` or `search\_queries` required) | Required (at least one non-empty query) |
| \*\*`objective`\*\* | Required if `search\_queries` omitted | Optional |
| \*\*`max\_chars\_total`\*\* | Inside `excerpts` object | Promoted to top-level request field |
| \*\*`client\_model`\*\* (new) | — | Top-level field for model-specific optimizations |
| \*\*`location`\*\* (new) | — | `advanced\_settings.location` — ISO 3166-1 alpha-2 country code for geo-targeted results |
| \*\*`advanced\_settings`\*\* (new) | — | New object nesting `source\_policy`, `fetch\_policy`, `excerpt\_settings`, `max\_results`, and `location` |
If your integration uses `client.beta.search()`, upgrade to the latest `parallel-web` release and replace it with `client.search()`.
## Migration Example
### Before (Beta)
```bash cURL theme={"system"}
curl https://api.parallel.ai/v1beta/search \
-H "Content-Type: application/json" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-d '{
"objective": "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
"search\_queries": ["Parallel Web Systems products", "Parallel Web Systems announcements"],
"mode": "fast",
"excerpts": {
"max\_chars\_per\_result": 10000,
"max\_chars\_total": 50000
}
}'
```
### After (V1)
```bash cURL theme={"system"}
curl https://api.parallel.ai/v1/search \
-H "Content-Type: application/json" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-d '{
"objective": "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
"search\_queries": ["Parallel Web Systems products", "Parallel Web Systems announcements"],
"mode": "basic",
"max\_chars\_total": 50000,
"advanced\_settings": {
"excerpt\_settings": {
"max\_chars\_per\_result": 10000
}
}
}'
```
```python Python theme={"system"}
from parallel import Parallel
import os
client = Parallel(api\_key=os.environ["PARALLEL\_API\_KEY"])
search = client.search(
objective="Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
search\_queries=["Parallel Web Systems products", "Parallel Web Systems announcements"],
mode="basic",
max\_chars\_total=50000,
advanced\_settings={"excerpt\_settings": {"max\_chars\_per\_result": 10000}},
)
print(search.results)
```
```typescript TypeScript theme={"system"}
import Parallel from "parallel-web";
const client = new Parallel({ apiKey: process.env.PARALLEL\_API\_KEY });
const search = await client.search({
objective: "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
search\_queries: ["Parallel Web Systems products", "Parallel Web Systems announcements"],
mode: "basic",
max\_chars\_total: 50000,
advanced\_settings: { excerpt\_settings: { max\_chars\_per\_result: 10000 } },
});
console.log(search.results);
```
## Additional Resources
\* [Search Quickstart](/search/search-quickstart) - Get started with the Search API
\* [Best Practices](/search/best-practices) - Optimize your search requests
\* [Search MCP](/integrations/mcp/search-mcp) - Use Search via Model Context Protocol
\* [API Reference](/api-reference/search/search) - Complete parameter specifications
Questions? Contact [support@parallel.ai](mailto:support@parallel.ai).
