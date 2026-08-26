# Get FindAll Run Schema - Parallel

Source: https://docs.parallel.ai/api-reference/findall/get-findall-run-schema

Python

Python

```
from parallel import Parallel

client = Parallel()

schema = client.beta.findall.schema(
    findall_id="findall_56ccc4d188fb41a0803a935cf485c774",
)

print(f"Schema: {schema.model_dump_json(indent=2)}")
```

```
import Parallel from "parallel-web";

const client = new Parallel();

const schema = await client.beta.findall.schema("findall_56ccc4d188fb41a0803a935cf485c774");

console.log(`Schema: ${JSON.stringify(schema, null, 2)}`);
```

```
HttpResponse<String> response = Unirest.get("https://api.parallel.ai/v1beta/findall/runs/{findall_id}/schema")
  .header("x-api-key", "<api-key>")
  .asString();
```

```
curl --request GET \
  --url https://api.parallel.ai/v1beta/findall/runs/{findall_id}/schema \
  --header 'x-api-key: <api-key>'
```

200

422

```
{
  "objective": "Find all AI companies that raised Series A funding in 2024",
  "entity_type": "companies",
  "match_conditions": [
    {
      "name": "developing_ai_products_check",
      "description": "Company must be developing artificial intelligence (AI) products"
    }
  ],
  "enrichments": [
    {
      "processor": "core",
      "output_schema": {
        "json_schema": {
          "type": "object",
          "properties": {
            "ceo_name": {
              "type": "string",
              "description": "Name of the current CEO of the company. If the CEO is not publicly known, provide the name of the highest-ranking executive or founder. If no information is available, return null."
            }
          }
        },
        "type": "json"
      }
    }
  ],
  "generator": "core",
  "match_limit": 50
}
```

```
{
  "detail": [
    {
      "loc": [
        "<string>"
      ],
      "msg": "<string>",
      "type": "<string>"
    }
  ]
}
```

GET

/

v1beta

/

findall

/

runs

/

{findall\_id}

/

schema

Try it

Python

Python

```
from parallel import Parallel

client = Parallel()

schema = client.beta.findall.schema(
    findall_id="findall_56ccc4d188fb41a0803a935cf485c774",
)

print(f"Schema: {schema.model_dump_json(indent=2)}")
```

```
import Parallel from "parallel-web";

const client = new Parallel();

const schema = await client.beta.findall.schema("findall_56ccc4d188fb41a0803a935cf485c774");

console.log(`Schema: ${JSON.stringify(schema, null, 2)}`);
```

```
HttpResponse<String> response = Unirest.get("https://api.parallel.ai/v1beta/findall/runs/{findall_id}/schema")
  .header("x-api-key", "<api-key>")
  .asString();
```

```
curl --request GET \
  --url https://api.parallel.ai/v1beta/findall/runs/{findall_id}/schema \
  --header 'x-api-key: <api-key>'
```

200

422

```
{
  "objective": "Find all AI companies that raised Series A funding in 2024",
  "entity_type": "companies",
  "match_conditions": [
    {
      "name": "developing_ai_products_check",
      "description": "Company must be developing artificial intelligence (AI) products"
    }
  ],
  "enrichments": [
    {
      "processor": "core",
      "output_schema": {
        "json_schema": {
          "type": "object",
          "properties": {
            "ceo_name": {
              "type": "string",
              "description": "Name of the current CEO of the company. If the CEO is not publicly known, provide the name of the highest-ranking executive or founder. If no information is available, return null."
            }
          }
        },
        "type": "json"
      }
    }
  ],
  "generator": "core",
  "match_limit": 50
}
```

```
{
  "detail": [
    {
      "loc": [
        "<string>"
      ],
      "msg": "<string>",
      "type": "<string>"
    }
  ]
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

#### Path Parameters

[​](#parameter-findall-id)

findall\_id

string

required

#### Response

200

application/json

Successful Response

Response model for FindAll ingest.

[​](#response-objective)

objective

string

required

Natural language objective of the FindAll run.

Example:

`"Find all AI companies that raised Series A funding in 2024"`

[​](#response-entity-type)

entity\_type

string

required

Type of the entity for the FindAll run.

[​](#response-match-conditions)

match\_conditions

MatchCondition · object[]

required

List of match conditions for the FindAll run.

Show child attributes

[​](#response-enrichments-one-of-0)

enrichments

FindAllEnrichInput · object[] | null

List of enrichment inputs for the FindAll run.

Show child attributes

[​](#response-generator)

generator

enum<string>

default:core

The generator of the FindAll run.

Available options:

`base`,

`core`,

`pro`,

`preview`

[​](#response-match-limit-one-of-0)

match\_limit

integer | null

Max number of candidates to evaluate

[FindAll Run Result](/api-reference/findall/findall-run-result)[List Monitors](/api-reference/monitor/list-monitors)

⌘I
