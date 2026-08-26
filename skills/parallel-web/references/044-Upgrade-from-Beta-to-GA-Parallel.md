# Upgrade from Beta to GA - Parallel

Source: https://docs.parallel.ai/search/search-migration-guide

This guide helps you migrate from the Beta Search API (`/v1beta`) to the GA version (`/v1`).

The V1 Search API is generally available and recommended for all new integrations. This guide explains how to migrate existing Beta integrations to V1’s current modes and request fields.

## [​](#highlights) Highlights

1. **`search_queries` is now required** — At least one non-empty query must be provided. In Beta, only one of `objective` or `search_queries` was required.
2. **Settings reorganized under `advanced_settings`** — `source_policy`, `fetch_policy`, excerpt settings, and `max_results` are now nested under a single new `advanced_settings` object (previously top-level fields). See [Advanced Settings](/search/advanced-search-settings) for more details.
3. **New `location` field** — Set `advanced_settings.location` to an ISO 3166-1 alpha-2 country code (e.g., `"us"`, `"gb"`, `"de"`, `"jp"`) to geo-target search results. Only a subset of countries are currently supported; unsupported or invalid values are ignored with a warning.
4. **Updated modes** — V1 has three modes (`turbo`, `basic`, `advanced`), with `advanced` as the new default. The Beta mapping is unchanged: map both `fast` and `one-shot` to `basic`, and map `agentic` to `advanced`. `turbo` is new in V1 and has no Beta equivalent.
   - **`basic`**: The V1 equivalent of Beta `fast` and `one-shot`. Offers lower latency and works best with 2-3 high-quality search\_queries. The right choice for most applications.
   - **`advanced`** (default): The V1 equivalent of Beta `agentic`. Provides higher quality with more advanced retrieval and compression. Best for complex queries where result quality matters more than latency.
   - **`turbo`** (new in V1): Lowest latency and cost for simple, high-volume lookups. See [Search Modes](/search/modes).

## [​](#overview-of-changes) Overview of Changes

| Component | Beta | V1 |
| --- | --- | --- |
| **Endpoint** | `/v1beta/search` | `/v1/search` |
| **Modes** | `fast`, `one-shot`, `agentic` (default `one-shot`) | `turbo`, `basic`, `advanced` (default `advanced`). `fast` and `one-shot` map to `basic`, `agentic` maps to `advanced`, and `turbo` is new with no Beta equivalent |
| **SDK method** | `client.beta.search()` (`parallel-web` before 1.0) | `client.search()` (`parallel-web` 1.0+) |
| **`search_queries`** | Optional (one of `objective` or `search_queries` required) | Required (at least one non-empty query) |
| **`objective`** | Required if `search_queries` omitted | Optional |
| **`max_chars_total`** | Inside `excerpts` object | Promoted to top-level request field |
| **`client_model`** (new) | — | Top-level field for model-specific optimizations |
| **`location`** (new) | — | `advanced_settings.location` — ISO 3166-1 alpha-2 country code for geo-targeted results |
| **`advanced_settings`** (new) | — | New object nesting `source_policy`, `fetch_policy`, `excerpt_settings`, `max_results`, and `location` |

If your integration uses `client.beta.search()`, upgrade to the latest `parallel-web` release and replace it with `client.search()`.

## [​](#migration-example) Migration Example

### [​](#before-beta) Before (Beta)

cURL

```
curl https://api.parallel.ai/v1beta/search \
  -H "Content-Type: application/json" \
  -H "x-api-key: $PARALLEL_API_KEY" \
  -d '{
    "objective": "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
    "search_queries": ["Parallel Web Systems products", "Parallel Web Systems announcements"],
    "mode": "fast",
    "excerpts": {
      "max_chars_per_result": 10000,
      "max_chars_total": 50000
    }
  }'
```

### [​](#after-v1) After (V1)

cURL

Python

TypeScript

```
curl https://api.parallel.ai/v1/search \
  -H "Content-Type: application/json" \
  -H "x-api-key: $PARALLEL_API_KEY" \
  -d '{
    "objective": "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
    "search_queries": ["Parallel Web Systems products", "Parallel Web Systems announcements"],
    "mode": "basic",
    "max_chars_total": 50000,
    "advanced_settings": {
      "excerpt_settings": {
        "max_chars_per_result": 10000
      }
    }
  }'
```

```
from parallel import Parallel
import os

client = Parallel(api_key=os.environ["PARALLEL_API_KEY"])

search = client.search(
    objective="Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
    search_queries=["Parallel Web Systems products", "Parallel Web Systems announcements"],
    mode="basic",
    max_chars_total=50000,
    advanced_settings={"excerpt_settings": {"max_chars_per_result": 10000}},
)

print(search.results)
```

```
import Parallel from "parallel-web";

const client = new Parallel({ apiKey: process.env.PARALLEL_API_KEY });

const search = await client.search({
    objective: "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
    search_queries: ["Parallel Web Systems products", "Parallel Web Systems announcements"],
    mode: "basic",
    max_chars_total: 50000,
    advanced_settings: { excerpt_settings: { max_chars_per_result: 10000 } },
});

console.log(search.results);
```

## [​](#additional-resources) Additional Resources

- [Search Quickstart](/search/search-quickstart) - Get started with the Search API
- [Best Practices](/search/best-practices) - Optimize your search requests
- [Search MCP](/integrations/mcp/search-mcp) - Use Search via Model Context Protocol
- [API Reference](/api-reference/search/search) - Complete parameter specifications

Questions? Contact [support@parallel.ai](mailto:support@parallel.ai).

[Search MCP](/search/search-mcp)[Quickstart](/extract/extract-quickstart)

⌘I
