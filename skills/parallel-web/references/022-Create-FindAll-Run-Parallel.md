# Create FindAll Run - Parallel

Source: https://docs.parallel.ai/api-reference/findall/create-findall-run

Python

Python

```
from parallel import Parallel

client = Parallel()

# Use the output from the ingest step, or provide your own values
ingest = client.beta.findall.ingest(
    objective="Find all AI companies that raised Series A funding in 2024",
)

run = client.beta.findall.create(
    objective=ingest.objective,
    entity_type=ingest.entity_type,
    match_conditions=[mc.model_dump() for mc in ingest.match_conditions],
    generator="base",
    match_limit=10,
)

print(f"FindAll run {run.findall_id} created, response:")
print(run.model_dump_json(indent=2))
```

```
import Parallel from "parallel-web";

const client = new Parallel();

// Use the output from the ingest step, or provide your own values
const ingest = await client.beta.findall.ingest({
    objective: "Find all AI companies that raised Series A funding in 2024",
});

const run = await client.beta.findall.create({
    objective: ingest.objective,
    entity_type: ingest.entity_type,
    match_conditions: ingest.match_conditions,
    generator: "base",
    match_limit: 10,
});

console.log(`FindAll run ${run.findall_id} created, response:`);
console.log(JSON.stringify(run, null, 2));
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1beta/findall/runs")
  .header("x-api-key", "<api-key>")
  .header("Content-Type", "application/json")
  .body("{\n  \"objective\": \"<string>\",\n  \"entity_type\": \"<string>\",\n  \"match_conditions\": [\n    {\n      \"name\": \"<string>\",\n      \"description\": \"<string>\"\n    }\n  ],\n  \"match_limit\": 123\n}")
  .asString();
```

```
curl --request POST \
  --url https://api.parallel.ai/v1beta/findall/runs \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '
{
  "objective": "<string>",
  "entity_type": "<string>",
  "match_conditions": [
    {
      "name": "<string>",
      "description": "<string>"
    }
  ],
  "match_limit": 123
}
'
```

200

402

422

429

```
{
  "findall_id": "findall_56ccc4d188fb41a0803a935cf485c774",
  "status": {
    "status": "queued",
    "is_active": true,
    "metrics": {
      "generated_candidates_count": 0,
      "matched_candidates_count": 0
    }
  },
  "generator": "base",
  "metadata": {},
  "created_at": "2025-09-10T21:02:08.626446Z",
  "modified_at": "2025-09-10T21:02:08.627376Z"
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Payment required: insufficient credit in account"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Unprocessable content: request validation error"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Too many requests: quota temporarily exceeded"
  }
}
```

POST

/

v1beta

/

findall

/

runs

Try it

Python

Python

```
from parallel import Parallel

client = Parallel()

# Use the output from the ingest step, or provide your own values
ingest = client.beta.findall.ingest(
    objective="Find all AI companies that raised Series A funding in 2024",
)

run = client.beta.findall.create(
    objective=ingest.objective,
    entity_type=ingest.entity_type,
    match_conditions=[mc.model_dump() for mc in ingest.match_conditions],
    generator="base",
    match_limit=10,
)

print(f"FindAll run {run.findall_id} created, response:")
print(run.model_dump_json(indent=2))
```

```
import Parallel from "parallel-web";

const client = new Parallel();

// Use the output from the ingest step, or provide your own values
const ingest = await client.beta.findall.ingest({
    objective: "Find all AI companies that raised Series A funding in 2024",
});

const run = await client.beta.findall.create({
    objective: ingest.objective,
    entity_type: ingest.entity_type,
    match_conditions: ingest.match_conditions,
    generator: "base",
    match_limit: 10,
});

console.log(`FindAll run ${run.findall_id} created, response:`);
console.log(JSON.stringify(run, null, 2));
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1beta/findall/runs")
  .header("x-api-key", "<api-key>")
  .header("Content-Type", "application/json")
  .body("{\n  \"objective\": \"<string>\",\n  \"entity_type\": \"<string>\",\n  \"match_conditions\": [\n    {\n      \"name\": \"<string>\",\n      \"description\": \"<string>\"\n    }\n  ],\n  \"match_limit\": 123\n}")
  .asString();
```

```
curl --request POST \
  --url https://api.parallel.ai/v1beta/findall/runs \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '
{
  "objective": "<string>",
  "entity_type": "<string>",
  "match_conditions": [
    {
      "name": "<string>",
      "description": "<string>"
    }
  ],
  "match_limit": 123
}
'
```

200

402

422

429

```
{
  "findall_id": "findall_56ccc4d188fb41a0803a935cf485c774",
  "status": {
    "status": "queued",
    "is_active": true,
    "metrics": {
      "generated_candidates_count": 0,
      "matched_candidates_count": 0
    }
  },
  "generator": "base",
  "metadata": {},
  "created_at": "2025-09-10T21:02:08.626446Z",
  "modified_at": "2025-09-10T21:02:08.627376Z"
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Payment required: insufficient credit in account"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Unprocessable content: request validation error"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Too many requests: quota temporarily exceeded"
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

Input model for FindAll run.

[​](#body-objective)

objective

string

required

Natural language objective of the FindAll run.

[​](#body-entity-type)

entity\_type

string

required

Type of the entity for the FindAll run.

[​](#body-match-conditions)

match\_conditions

MatchCondition · object[]

required

List of match conditions for the FindAll run.

Show child attributes

[​](#body-generator)

generator

enum<string>

required

Generator for the FindAll run. One of base, core, pro, preview.

Available options:

`base`,

`core`,

`pro`,

`preview`

[​](#body-match-limit)

match\_limit

integer

required

Maximum number of matches to find for this FindAll run. Must be between 5 and 1000 (inclusive). May return fewer results.

[​](#body-exclude-list-one-of-0)

exclude\_list

ExcludeCandidate · object[] | null

List of entity names/IDs to exclude from results. At most 10,000 entries are allowed.

Maximum array length: `10000`

Show child attributes

[​](#body-metadata-one-of-0)

metadata

Metadata · object | null

Metadata for the FindAll run.

Show child attributes

[​](#body-webhook-one-of-0)

webhook

Webhook · object | null

Webhook for the FindAll run.

Show child attributes

#### Response

200

application/json

Successful Response

FindAll run object with status and metadata.

[​](#response-findall-id)

findall\_id

string

required

ID of the FindAll run.

[​](#response-status)

status

FindAllRunStatus · object

required

Status object for the FindAll run.

Show child attributes

[​](#response-generator)

generator

enum<string>

required

Generator for the FindAll run.

Available options:

`base`,

`core`,

`pro`,

`preview`

[​](#response-metadata-one-of-0)

metadata

Metadata · object | null

Metadata for the FindAll run.

Show child attributes

[​](#response-created-at-one-of-0)

created\_at

string | null

Timestamp of the creation of the run, in RFC 3339 format.

[​](#response-modified-at-one-of-0)

modified\_at

string | null

Timestamp of the latest modification to the FindAll run result, in RFC 3339 format.

[Ingest FindAll Run](/api-reference/findall/ingest-findall-run)[Retrieve FindAll Run Status](/api-reference/findall/retrieve-findall-run-status)

⌘I
