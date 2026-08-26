# Extract - Parallel

Source: https://docs.parallel.ai/api-reference/extract/extract

Python

Python

```
from parallel import Parallel

client = Parallel()

extract = client.extract(
    urls=["https://www.example.com"],
    objective="Summarize the page",
)
print(extract.results)
```

```
import Parallel from "parallel-web";

const client = new Parallel();

const extract = await client.extract({
    urls: ["https://www.example.com"],
    objective: "Summarize the page",
});
console.log(extract.results);
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1/extract")
  .header("x-api-key", "<api-key>")
  .header("Content-Type", "application/json")
  .body("{\n  \"urls\": [\n    \"<string>\"\n  ]\n}")
  .asString();
```

```
curl --request POST \
    --url https://api.parallel.ai/v1/extract \
    --header 'Content-Type: application/json' \
    --header 'x-api-key: <api-key>' \
    --data '{
    "urls": ["https://www.example.com"],
    "objective": "Summarize the page"
}'
```

200

422

```
{
  "extract_id": "extract_8a911eb27c7a4afaa20d0d9dc98d07c0",
  "results": [
    {
      "url": "https://www.example.com",
      "title": "Example Title",
      "excerpts": [
        "Excerpted text ..."
      ],
      "full_content": "Full content ..."
    }
  ],
  "errors": [
    {
      "url": "https://www.example.com",
      "error_type": "fetch_error",
      "http_status_code": 500,
      "content": "Error fetching content from https://www.example.com"
    }
  ],
  "session_id": "session_8a911eb27c7a4afaa20d0d9dc98d07c0"
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "extract_8a911eb27c7a4afaa20d0d9dc98d07c0",
    "message": "Request validation error"
  }
}
```

POST

/

v1

/

extract

Try it

Python

Python

```
from parallel import Parallel

client = Parallel()

extract = client.extract(
    urls=["https://www.example.com"],
    objective="Summarize the page",
)
print(extract.results)
```

```
import Parallel from "parallel-web";

const client = new Parallel();

const extract = await client.extract({
    urls: ["https://www.example.com"],
    objective: "Summarize the page",
});
console.log(extract.results);
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1/extract")
  .header("x-api-key", "<api-key>")
  .header("Content-Type", "application/json")
  .body("{\n  \"urls\": [\n    \"<string>\"\n  ]\n}")
  .asString();
```

```
curl --request POST \
    --url https://api.parallel.ai/v1/extract \
    --header 'Content-Type: application/json' \
    --header 'x-api-key: <api-key>' \
    --data '{
    "urls": ["https://www.example.com"],
    "objective": "Summarize the page"
}'
```

200

422

```
{
  "extract_id": "extract_8a911eb27c7a4afaa20d0d9dc98d07c0",
  "results": [
    {
      "url": "https://www.example.com",
      "title": "Example Title",
      "excerpts": [
        "Excerpted text ..."
      ],
      "full_content": "Full content ..."
    }
  ],
  "errors": [
    {
      "url": "https://www.example.com",
      "error_type": "fetch_error",
      "http_status_code": 500,
      "content": "Error fetching content from https://www.example.com"
    }
  ],
  "session_id": "session_8a911eb27c7a4afaa20d0d9dc98d07c0"
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "extract_8a911eb27c7a4afaa20d0d9dc98d07c0",
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

Extract request.

[​](#body-urls)

urls

string[]

required

URLs to extract content from. Up to 20 URLs.

[​](#body-objective-one-of-0)

objective

string | null

As in SearchRequest, a natural-language description of the underlying question or goal driving the request. Used together with search\_queries to focus excerpts on the most relevant content.

[​](#body-search-queries-one-of-0)

search\_queries

string[] | null

Optional keyword search queries, as in SearchRequest. Used together with objective to focus excerpts on the most relevant content.

[​](#body-max-chars-total-one-of-0)

max\_chars\_total

integer | null

Upper bound on total characters across excerpts from all extracted results.

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

AdvancedExtractSettings · object | null

Advanced configuration for fetch policy, excerpt settings, and full content settings. May impact result quality and latency unless used carefully. When omitted, excerpts are enabled and full content is disabled by default.

Show child attributes

#### Response

200

application/json

Successful Response

Extract response.

[​](#response-extract-id)

extract\_id

string

required

Extract request ID, e.g. `extract_cad0a6d2dec046bd95ae900527d880e7`

[​](#response-results)

results

V1ExtractResult · object[]

required

Successful extract results.

Show child attributes

[​](#response-errors)

errors

ExtractError · object[]

required

Extract errors: requested URLs not in the results.

Show child attributes

[​](#response-session-id)

session\_id

string

required

Session identifier. Echoed back from the request if provided, otherwise generated by the server. Should be passed to future search and extract calls made by the agent as part of the same larger task.

Example:

`"session_8a911eb27c7a4afaa20d0d9dc98d07c0"`

[​](#response-warnings-one-of-0)

warnings

Warning · object[] | null

Warnings for the extract request, if any.

Show child attributes

[​](#response-usage-one-of-0)

usage

UsageItem · object[] | null

Usage metrics for the extract request.

Show child attributes

[Search](/api-reference/search/search)[Create Task Group](/api-reference/tasks/create-task-group)

⌘I
