# Add Enrichment to FindAll Run - Parallel

Source: https://docs.parallel.ai/api-reference/findall/add-enrichment-to-findall-run

Python

Python

```
from parallel import Parallel

client = Parallel()

# Tip: If using Pydantic models, you can generate the schema automatically:
# class CompanyEnrichment(BaseModel):
#     ceo_name: str = Field(description="Name of the CEO")
#     founding_year: str = Field(description="Year the company was founded")
# output_schema = {"type": "json", "json_schema": CompanyEnrichment.model_json_schema()}

schema = client.beta.findall.enrich(
    findall_id="findall_40e0ab8c10754be0b7a16477abb38a2f",
    processor="core",
    output_schema={
        "type": "json",
        "json_schema": {
            "type": "object",
            "properties": {
                "ceo_name": {
                    "type": "string",
                    "description": "Name of the CEO"
                },
                "founding_year": {
                    "type": "string",
                    "description": "Year the company was founded"
                }
            },
            "required": ["ceo_name", "founding_year"],
            "additionalProperties": False
        }
    }
)

print(f"Enrichment added, schema: {schema.model_dump_json(indent=2)}")
```

```
import Parallel from "parallel-web";

const client = new Parallel();

const schema = await client.beta.findall.enrich(
    "findall_40e0ab8c10754be0b7a16477abb38a2f",
    {
        processor: "core",
        output_schema: {
            type: "json",
            json_schema: {
                type: "object",
                properties: {
                    ceo_name: {
                        type: "string",
                        description: "Name of the CEO"
                    },
                    founding_year: {
                        type: "string",
                        description: "Year the company was founded"
                    }
                },
                required: ["ceo_name", "founding_year"],
                additionalProperties: false
            }
        }
    }
);

console.log(`Enrichment added, schema: ${JSON.stringify(schema, null, 2)}`);
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1beta/findall/runs/{findall_id}/enrich")
  .header("x-api-key", "<api-key>")
  .header("Content-Type", "application/json")
  .body("{\n  \"output_schema\": {\n    \"json_schema\": {},\n    \"type\": \"json\"\n  }\n}")
  .asString();
```

```
curl --request POST \
  --url https://api.parallel.ai/v1beta/findall/runs/{findall_id}/enrich \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '
{
  "output_schema": {
    "json_schema": {},
    "type": "json"
  }
}
'
```

200

404

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
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "FindAll run not found"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Validation error"
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

/

{findall\_id}

/

enrich

Try it

Python

Python

```
from parallel import Parallel

client = Parallel()

# Tip: If using Pydantic models, you can generate the schema automatically:
# class CompanyEnrichment(BaseModel):
#     ceo_name: str = Field(description="Name of the CEO")
#     founding_year: str = Field(description="Year the company was founded")
# output_schema = {"type": "json", "json_schema": CompanyEnrichment.model_json_schema()}

schema = client.beta.findall.enrich(
    findall_id="findall_40e0ab8c10754be0b7a16477abb38a2f",
    processor="core",
    output_schema={
        "type": "json",
        "json_schema": {
            "type": "object",
            "properties": {
                "ceo_name": {
                    "type": "string",
                    "description": "Name of the CEO"
                },
                "founding_year": {
                    "type": "string",
                    "description": "Year the company was founded"
                }
            },
            "required": ["ceo_name", "founding_year"],
            "additionalProperties": False
        }
    }
)

print(f"Enrichment added, schema: {schema.model_dump_json(indent=2)}")
```

```
import Parallel from "parallel-web";

const client = new Parallel();

const schema = await client.beta.findall.enrich(
    "findall_40e0ab8c10754be0b7a16477abb38a2f",
    {
        processor: "core",
        output_schema: {
            type: "json",
            json_schema: {
                type: "object",
                properties: {
                    ceo_name: {
                        type: "string",
                        description: "Name of the CEO"
                    },
                    founding_year: {
                        type: "string",
                        description: "Year the company was founded"
                    }
                },
                required: ["ceo_name", "founding_year"],
                additionalProperties: false
            }
        }
    }
);

console.log(`Enrichment added, schema: ${JSON.stringify(schema, null, 2)}`);
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1beta/findall/runs/{findall_id}/enrich")
  .header("x-api-key", "<api-key>")
  .header("Content-Type", "application/json")
  .body("{\n  \"output_schema\": {\n    \"json_schema\": {},\n    \"type\": \"json\"\n  }\n}")
  .asString();
```

```
curl --request POST \
  --url https://api.parallel.ai/v1beta/findall/runs/{findall_id}/enrich \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '
{
  "output_schema": {
    "json_schema": {},
    "type": "json"
  }
}
'
```

200

404

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
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "FindAll run not found"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Validation error"
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

#### Path Parameters

[​](#parameter-findall-id)

findall\_id

string

required

#### Body

application/json

Input model for FindAll enrich.

[​](#body-output-schema)

output\_schema

JsonSchema · object

required

JSON schema for the enrichment output schema for the FindAll run.

Show child attributes

[​](#body-processor)

processor

string

default:core

Processor to use for the task.

[​](#body-mcp-servers-one-of-0)

mcp\_servers

McpServer · object[] | null

List of MCP servers to use for the task.

Show child attributes

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

[Cancel FindAll Run](/api-reference/findall/cancel-findall-run)[Stream FindAll Events](/api-reference/findall/stream-findall-events)

⌘I
