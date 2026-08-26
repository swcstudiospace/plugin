# Extract - Parallel

Source: https://docs.parallel.ai/api-reference/legacy/extract-beta/extract

Python

Python

```
from parallel import Parallel

client = Parallel()

extract = client.beta.extract(
    urls=["https://www.example.com"],
    excerpts=True,
    full_content=True
)
print(extract.results)
```

```
import Parallel from "parallel-web";

const client = new Parallel();

const extract = await client.beta.extract({
    urls: ["https://www.example.com"],
    excerpts: true,
    full_content: true
});
console.log(extract.results);
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1beta/extract")
  .header("x-api-key", "<api-key>")
  .header("Content-Type", "application/json")
  .body("{\n  \"urls\": [\n    \"<string>\"\n  ]\n}")
  .asString();
```

```
curl --request POST \
    --url https://api.parallel.ai/v1beta/extract \
    --header 'Content-Type: application/json' \
    --header 'x-api-key: <api-key>' \
    --data '{
    "urls": ["https://www.example.com"],
    "excerpts": true,
    "full_content": true
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
  ]
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

v1beta

/

extract

Try it

Python

Python

```
from parallel import Parallel

client = Parallel()

extract = client.beta.extract(
    urls=["https://www.example.com"],
    excerpts=True,
    full_content=True
)
print(extract.results)
```

```
import Parallel from "parallel-web";

const client = new Parallel();

const extract = await client.beta.extract({
    urls: ["https://www.example.com"],
    excerpts: true,
    full_content: true
});
console.log(extract.results);
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1beta/extract")
  .header("x-api-key", "<api-key>")
  .header("Content-Type", "application/json")
  .body("{\n  \"urls\": [\n    \"<string>\"\n  ]\n}")
  .asString();
```

```
curl --request POST \
    --url https://api.parallel.ai/v1beta/extract \
    --header 'Content-Type: application/json' \
    --header 'x-api-key: <api-key>' \
    --data '{
    "urls": ["https://www.example.com"],
    "excerpts": true,
    "full_content": true
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
  ]
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

#### Headers

[​](#parameter-one-of-0)

parallel-beta

string | null

deprecated

#### Body

application/json

Extract request.

[​](#body-urls)

urls

string[]

required

[​](#body-objective-one-of-0)

objective

string | null

If provided, focuses extracted content on the specified search objective.

[​](#body-search-queries-one-of-0)

search\_queries

string[] | null

If provided, focuses extracted content on the specified keyword search queries.

[​](#body-fetch-policy-one-of-0)

fetch\_policy

FetchPolicy · object | null

Fetch policy: determines when to return cached content from the index (faster) vs fetching live content (fresher). Default is to use a dynamic policy based on the search objective and url.

Show child attributes

[​](#body-excerpts-one-of-0)

excerpts

default:true

Include excerpts from each URL relevant to the search objective and queries. Note that if neither objective nor search\_queries is provided, excerpts are redundant with full content.

[​](#body-full-content-one-of-0)

full\_content

default:false

Include full content from each URL. Note that if neither objective nor search\_queries is provided, excerpts are redundant with full content.

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

Fetch result.

[​](#response-extract-id)

extract\_id

string

required

Extract request ID, e.g. `extract_cad0a6d2dec046bd95ae900527d880e7`

[​](#response-results)

results

ExtractResult · object[]

required

Successful extract results.

Show child attributes

[​](#response-errors)

errors

ExtractError · object[]

required

Extract errors: requested URLs not in the results.

Show child attributes

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

[Search](/api-reference/legacy/search-beta/search)[Create Task Group](/api-reference/legacy/tasks/create-task-group)

⌘I
