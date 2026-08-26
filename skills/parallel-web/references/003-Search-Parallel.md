# Search - Parallel

Source: https://docs.parallel.ai/api-reference/search/search

Python

Python

```
from parallel import Parallel

client = Parallel()

search = client.search(
    objective="Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
    search_queries=["Parallel Web Systems products", "Parallel Web Systems announcements"],
)
print(search.results)
```

```
import Parallel from "parallel-web";

const client = new Parallel();

const search = await client.search({
    objective: "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
    search_queries: ["Parallel Web Systems products", "Parallel Web Systems announcements"],
});
console.log(search.results);
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1/search")
  .header("x-api-key", "<api-key>")
  .header("Content-Type", "application/json")
  .body("{\n  \"search_queries\": [\n    \"<string>\"\n  ]\n}")
  .asString();
```

```
curl --request POST \
    --url https://api.parallel.ai/v1/search \
    --header 'Content-Type: application/json' \
    --header 'x-api-key: <api-key>' \
    --data '{
    "objective": "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
    "search_queries": ["Parallel Web Systems products", "Parallel Web Systems announcements"]
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
  ],
  "session_id": "session_fcb2b4f3c75e418687bccaa1a8381331"
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

v1

/

search

Try it

Python

Python

```
from parallel import Parallel

client = Parallel()

search = client.search(
    objective="Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
    search_queries=["Parallel Web Systems products", "Parallel Web Systems announcements"],
)
print(search.results)
```

```
import Parallel from "parallel-web";

const client = new Parallel();

const search = await client.search({
    objective: "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
    search_queries: ["Parallel Web Systems products", "Parallel Web Systems announcements"],
});
console.log(search.results);
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1/search")
  .header("x-api-key", "<api-key>")
  .header("Content-Type", "application/json")
  .body("{\n  \"search_queries\": [\n    \"<string>\"\n  ]\n}")
  .asString();
```

```
curl --request POST \
    --url https://api.parallel.ai/v1/search \
    --header 'Content-Type: application/json' \
    --header 'x-api-key: <api-key>' \
    --data '{
    "objective": "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
    "search_queries": ["Parallel Web Systems products", "Parallel Web Systems announcements"]
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
  ],
  "session_id": "session_fcb2b4f3c75e418687bccaa1a8381331"
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

#### Body

application/json

Search request.

[​](#body-search-queries)

search\_queries

string[]

required

Concise keyword search queries, 3-6 words each. At least one query is required, provide 2-3 for best results. Used together with objective to focus results on the most relevant content.

[​](#body-objective-one-of-0)

objective

string | null

Natural-language description of the underlying question or goal driving the search. Used together with search\_queries to focus results on the most relevant content. Should be self-contained with enough context to understand the intent of the search.

[​](#body-mode-one-of-0)

mode

enum<string> | null

Search mode preset: supported values are `turbo`, `basic`, and `advanced`. Turbo mode is optimized for the fastest responses. Basic mode offers low latency and works best with 2-3 high-quality search\_queries. Advanced mode provides higher quality with more advanced retrieval and compression. Defaults to `advanced` when omitted.

Available options:

`turbo`,

`basic`,

`advanced`

[​](#body-max-chars-total-one-of-0)

max\_chars\_total

integer | null

Upper bound on total characters across excerpts from all results.

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

[​](#body-advanced-settings-one-of-0)

advanced\_settings

AdvancedSearchSettings · object | null

Advanced configuration for source policy, fetch policy, and excerpt settings. May impact result quality and latency unless used carefully. When omitted, excerpts are enabled by default.

Show child attributes

#### Response

200

application/json

Successful Response

Search response.

[​](#response-search-id)

search\_id

string

required

Search ID. Example: `search_cad0a6d2dec046bd95ae900527d880e7`

[​](#response-results)

results

V1WebSearchResult · object[]

required

A list of search results, ordered by decreasing relevance.

Show child attributes

[​](#response-session-id)

session\_id

string

required

Session identifier, echoed back from the request if provided, otherwise generated by the server. Should be passed to future search and extract calls made by the agent as part of the same larger task.

Example:

`"session_8a911eb27c7a4afaa20d0d9dc98d07c0"`

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

[Extract](/api-reference/extract/extract)

⌘I
