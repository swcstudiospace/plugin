# Search - Parallel

Source: https://docs.parallel.ai/api-reference/legacy/search-beta/search

Python

Python

```
from parallel import Parallel

client = Parallel()

search = client.beta.search(
    objective="Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
)
print(search.results)
```

```
import Parallel from "parallel-web";

const client = new Parallel();

const search = await client.beta.search({
    objective: "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
});
console.log(search.results);
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1beta/search")
  .header("x-api-key", "<api-key>")
  .header("Content-Type", "application/json")
  .body("{\n  \"mode\": \"one-shot\",\n  \"objective\": \"<string>\",\n  \"search_queries\": [\n    \"<string>\"\n  ],\n  \"max_results\": 123,\n  \"max_chars_per_result\": 123,\n  \"excerpts\": {\n    \"max_chars_per_result\": 123,\n    \"max_chars_total\": 123\n  },\n  \"location\": \"us\",\n  \"source_policy\": {\n    \"include_domains\": [\n      \"<string>\"\n    ],\n    \"exclude_domains\": [\n      \"<string>\"\n    ],\n    \"after_date\": \"2024-01-01\"\n  },\n  \"fetch_policy\": {\n    \"max_age_seconds\": 86400,\n    \"timeout_seconds\": 60,\n    \"disable_cache_fallback\": false\n  },\n  \"session_id\": \"<string>\",\n  \"client_model\": \"claude-opus-4-7\"\n}")
  .asString();
```

```
curl --request POST \
    --url https://api.parallel.ai/v1beta/search \
    --header 'Content-Type: application/json' \
    --header 'x-api-key: <api-key>' \
    --data '{
    "objective": "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements."
}'
```

200

422

```
{
  "search_id": "search_fcb2b4f3c75e418687bccaa1a8381331",
  "results": [
    {
      "url": "https://www.example.com",
      "title": "Sample webpage title",
      "publish_date": "2024-01-15",
      "excerpts": [
        "Sample excerpt 1",
        "Sample excerpt 2"
      ]
    }
  ]
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "search_fcb2b4f3c75e418687bccaa1a8381331",
    "message": "Request validation error"
  }
}
```

POST

/

v1beta

/

search

Try it

Python

Python

```
from parallel import Parallel

client = Parallel()

search = client.beta.search(
    objective="Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
)
print(search.results)
```

```
import Parallel from "parallel-web";

const client = new Parallel();

const search = await client.beta.search({
    objective: "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
});
console.log(search.results);
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1beta/search")
  .header("x-api-key", "<api-key>")
  .header("Content-Type", "application/json")
  .body("{\n  \"mode\": \"one-shot\",\n  \"objective\": \"<string>\",\n  \"search_queries\": [\n    \"<string>\"\n  ],\n  \"max_results\": 123,\n  \"max_chars_per_result\": 123,\n  \"excerpts\": {\n    \"max_chars_per_result\": 123,\n    \"max_chars_total\": 123\n  },\n  \"location\": \"us\",\n  \"source_policy\": {\n    \"include_domains\": [\n      \"<string>\"\n    ],\n    \"exclude_domains\": [\n      \"<string>\"\n    ],\n    \"after_date\": \"2024-01-01\"\n  },\n  \"fetch_policy\": {\n    \"max_age_seconds\": 86400,\n    \"timeout_seconds\": 60,\n    \"disable_cache_fallback\": false\n  },\n  \"session_id\": \"<string>\",\n  \"client_model\": \"claude-opus-4-7\"\n}")
  .asString();
```

```
curl --request POST \
    --url https://api.parallel.ai/v1beta/search \
    --header 'Content-Type: application/json' \
    --header 'x-api-key: <api-key>' \
    --data '{
    "objective": "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements."
}'
```

200

422

```
{
  "search_id": "search_fcb2b4f3c75e418687bccaa1a8381331",
  "results": [
    {
      "url": "https://www.example.com",
      "title": "Sample webpage title",
      "publish_date": "2024-01-15",
      "excerpts": [
        "Sample excerpt 1",
        "Sample excerpt 2"
      ]
    }
  ]
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "search_fcb2b4f3c75e418687bccaa1a8381331",
    "message": "Request validation error"
  }
}
```

#### Authorizations

[​](#authorization-x-api-key)

x-api-key

string

header

required

#### Headers

[​](#parameter-one-of-0)

parallel-beta

string | null

deprecated

#### Body

application/json

Request to Search API.

[​](#body-mode-one-of-0)

mode

enum<string> | null

default:one-shot

Presets default values for parameters for different use cases.

- `one-shot` returns more comprehensive results and longer excerpts to answer questions from a single response
- `agentic` returns more concise, token-efficient results for use in an agentic loop
- `fast` trades some quality for lower latency, with best results when used with concise and high-quality objective and keyword queries

Available options:

`one-shot`,

`agentic`,

`fast`

[​](#body-objective-one-of-0)

objective

string | null

Natural-language description of what the web search is trying to find. May include guidance about preferred sources or freshness. At least one of objective or search\_queries must be provided.

[​](#body-search-queries-one-of-0)

search\_queries

string[] | null

Optional list of traditional keyword search queries to guide the search. May contain search operators. At least one of objective or search\_queries must be provided.

[​](#body-processor-one-of-0)

processor

enum<string> | null

deprecated

DEPRECATED: use `mode` instead.

Available options:

`base`,

`pro`

[​](#body-max-results-one-of-0)

max\_results

integer | null

Upper bound on the number of results to return. Defaults to 10 if not provided.

[​](#body-max-chars-per-result-one-of-0)

max\_chars\_per\_result

integer | null

deprecated

DEPRECATED: Use `excerpts.max_chars_per_result` instead.

[​](#body-excerpts)

excerpts

ExcerptSettings · object

Optional settings to configure excerpt generation.

Show child attributes

[​](#body-location-one-of-0)

location

string | null

ISO 3166-1 alpha-2 country code for geo-targeted search results.

Example:

`"us"`

[​](#body-source-policy-one-of-0)

source\_policy

SourcePolicy · object | null

Optional source policy governing domain and date preferences in search results.

Show child attributes

[​](#body-fetch-policy-one-of-0)

fetch\_policy

FetchPolicy · object | null

Fetch policy: determines when to return cached content from the index (faster) vs fetching live content (fresher). Default is to disable live fetch and return cached content from the index.

Show child attributes

[​](#body-session-id-one-of-0)

session\_id

string | null

Session identifier to track calls across separate search and extract calls, to be used as part of a larger task. Specifying it may give better contextual results for subsequent API calls.

Maximum string length: `1000`

[​](#body-client-model-one-of-0)

client\_model

string | null

The model generating this request and consuming the results. Enables optimizations and tailors default settings for the model's capabilities.

Example:

`"claude-opus-4-7"`

#### Response

200

application/json

Successful Response

Output for the Search API.

[​](#response-search-id)

search\_id

string

required

Search ID. Example: `search_cad0a6d2dec046bd95ae900527d880e7`

[​](#response-results)

results

WebSearchResult · object[]

required

A list of WebSearchResult objects, ordered by decreasing relevance.

Show child attributes

[​](#response-warnings-one-of-0)

warnings

Warning · object[] | null

Warnings for the search request, if any.

Show child attributes

[​](#response-usage-one-of-0)

usage

UsageItem · object[] | null

Usage metrics for the search request.

Show child attributes

[Extract](/api-reference/legacy/extract-beta/extract)

⌘I
