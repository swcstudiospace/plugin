# Stream FindAll Events - Parallel

Source: https://docs.parallel.ai/api-reference/findall/stream-findall-events

Python

Python

```
from parallel import Parallel

client = Parallel()

# Event types: findall.candidate.generated, findall.candidate.matched,
# findall.candidate.unmatched, findall.candidate.discarded,
# findall.candidate.enriched
events = client.beta.findall.events(
    findall_id="findall_56ccc4d188fb41a0803a935cf485c774",
)

for event in events:
    print(f"Event [{event.type}]: {event.model_dump_json()}")
```

```
import Parallel from "parallel-web";

const client = new Parallel();

// Event types: findall.candidate.generated, findall.candidate.matched,
// findall.candidate.unmatched, findall.candidate.discarded,
// findall.candidate.enriched
const events = await client.beta.findall.events("findall_56ccc4d188fb41a0803a935cf485c774");

for await (const event of events) {
    console.log(`Event [${event.type}]: ${JSON.stringify(event)}`);
}
```

```
HttpResponse<String> response = Unirest.get("https://api.parallel.ai/v1beta/findall/runs/{findall_id}/events")
  .header("x-api-key", "<api-key>")
  .asString();
```

```
curl --request GET \
  --url https://api.parallel.ai/v1beta/findall/runs/{findall_id}/events \
  --header 'x-api-key: <api-key>'
```

200

404

422

```
{
  "type": "findall.candidate.generated",
  "timestamp": "2025-09-10T21:02:08.626446Z",
  "event_id": "56cee734dbc84172bfc491327f2a0183",
  "data": {
    "candidate_id": "candidate_52e1e30b-4e0a-49d8-82eb-79e64e0ed015",
    "name": "Pika",
    "url": "pika.art",
    "description": "Pika is an AI video generation platform that creates and edits videos from text prompts or images.",
    "match_status": "generated"
  }
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

events

Try it

Python

Python

```
from parallel import Parallel

client = Parallel()

# Event types: findall.candidate.generated, findall.candidate.matched,
# findall.candidate.unmatched, findall.candidate.discarded,
# findall.candidate.enriched
events = client.beta.findall.events(
    findall_id="findall_56ccc4d188fb41a0803a935cf485c774",
)

for event in events:
    print(f"Event [{event.type}]: {event.model_dump_json()}")
```

```
import Parallel from "parallel-web";

const client = new Parallel();

// Event types: findall.candidate.generated, findall.candidate.matched,
// findall.candidate.unmatched, findall.candidate.discarded,
// findall.candidate.enriched
const events = await client.beta.findall.events("findall_56ccc4d188fb41a0803a935cf485c774");

for await (const event of events) {
    console.log(`Event [${event.type}]: ${JSON.stringify(event)}`);
}
```

```
HttpResponse<String> response = Unirest.get("https://api.parallel.ai/v1beta/findall/runs/{findall_id}/events")
  .header("x-api-key", "<api-key>")
  .asString();
```

```
curl --request GET \
  --url https://api.parallel.ai/v1beta/findall/runs/{findall_id}/events \
  --header 'x-api-key: <api-key>'
```

200

404

422

```
{
  "type": "findall.candidate.generated",
  "timestamp": "2025-09-10T21:02:08.626446Z",
  "event_id": "56cee734dbc84172bfc491327f2a0183",
  "data": {
    "candidate_id": "candidate_52e1e30b-4e0a-49d8-82eb-79e64e0ed015",
    "name": "Pika",
    "url": "pika.art",
    "description": "Pika is an AI video generation platform that creates and edits videos from text prompts or images.",
    "match_status": "generated"
  }
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

#### Query Parameters

[​](#parameter-one-of-0)

last\_event\_id

string | null

[​](#parameter-one-of-0)

timeout

number | null

#### Response

200

text/event-stream

Successful Response

- FindAllSchemaUpdatedEvent
- FindAllRunStatusEvent
- FindAllCandidateMatchStatusEvent
- ErrorEvent

Event containing full snapshot of FindAll run state.

[​](#response-one-of-0-type)

type

enum<string>

required

Event type; always 'findall.schema.updated'.

Available options:

`findall.schema.updated`

Allowed value: `"findall.schema.updated"`

[​](#response-one-of-0-timestamp)

timestamp

string<date-time>

required

Timestamp of the event.

[​](#response-one-of-0-event-id)

event\_id

string

required

Unique event identifier for the event.

[​](#response-one-of-0-data)

data

FindAllSchema · object

required

Updated FindAll schema.

Show child attributes

[Add Enrichment to FindAll Run](/api-reference/findall/add-enrichment-to-findall-run)[Extend FindAll Run](/api-reference/findall/extend-findall-run)

⌘I
