# Retrieve Monitor - Parallel

Source: https://docs.parallel.ai/api-reference/legacy/monitor-alpha/retrieve-monitor

Retrieve Monitor

Python

```
import requests

url = "https://api.parallel.ai/v1alpha/monitors/{monitor_id}"

headers = {"x-api-key": "<api-key>"}

response = requests.get(url, headers=headers)

print(response.text)
```

```
const options = {method: 'GET', headers: {'x-api-key': '<api-key>'}};

fetch('https://api.parallel.ai/v1alpha/monitors/{monitor_id}', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
HttpResponse<String> response = Unirest.get("https://api.parallel.ai/v1alpha/monitors/{monitor_id}")
  .header("x-api-key", "<api-key>")
  .asString();
```

```
curl --request GET \
  --url https://api.parallel.ai/v1alpha/monitors/{monitor_id} \
  --header 'x-api-key: <api-key>'
```

200

401

404

422

```
{
  "monitor_id": "monitor_b0079f70195e4258a3b982c1b6d8bd3a",
  "query": "Extract recent news about AI",
  "status": "active",
  "frequency": "1d",
  "metadata": {
    "key": "value"
  },
  "webhook": {
    "url": "https://example.com/webhook",
    "event_types": [
      "monitor.event.detected"
    ]
  },
  "created_at": "2025-04-23T20:21:48.037943Z"
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Unauthorized: invalid or missing credentials"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Schedule not found"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Request validation error"
  }
}
```

GET

/

v1alpha

/

monitors

/

{monitor\_id}

Try it

Retrieve Monitor

Python

```
import requests

url = "https://api.parallel.ai/v1alpha/monitors/{monitor_id}"

headers = {"x-api-key": "<api-key>"}

response = requests.get(url, headers=headers)

print(response.text)
```

```
const options = {method: 'GET', headers: {'x-api-key': '<api-key>'}};

fetch('https://api.parallel.ai/v1alpha/monitors/{monitor_id}', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
HttpResponse<String> response = Unirest.get("https://api.parallel.ai/v1alpha/monitors/{monitor_id}")
  .header("x-api-key", "<api-key>")
  .asString();
```

```
curl --request GET \
  --url https://api.parallel.ai/v1alpha/monitors/{monitor_id} \
  --header 'x-api-key: <api-key>'
```

200

401

404

422

```
{
  "monitor_id": "monitor_b0079f70195e4258a3b982c1b6d8bd3a",
  "query": "Extract recent news about AI",
  "status": "active",
  "frequency": "1d",
  "metadata": {
    "key": "value"
  },
  "webhook": {
    "url": "https://example.com/webhook",
    "event_types": [
      "monitor.event.detected"
    ]
  },
  "created_at": "2025-04-23T20:21:48.037943Z"
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Unauthorized: invalid or missing credentials"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Schedule not found"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
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

#### Path Parameters

[​](#parameter-monitor-id)

monitor\_id

string

required

#### Response

200

application/json

Successful Response

Response object for a monitor, including its status, cadence and metadata.

[​](#response-monitor-id)

monitor\_id

string

required

ID of the monitor.

[​](#response-query)

query

string

required

The query being monitored.

Example:

`"Recent news about LLM models."`

[​](#response-status)

status

enum<string>

required

Status of the monitor.

Available options:

`active`,

`canceled`

Examples:

`"active"`

`"canceled"`

[​](#response-frequency)

frequency

string

required

Frequency of the monitor. Format: '' where unit is 'h' (hours), 'd' (days), or 'w' (weeks). Must be between 1h and 30d (inclusive).

Examples:

`"1d"`

`"1w"`

`"1h"`

`"2w"`

[​](#response-created-at)

created\_at

string<date-time>

required

Timestamp of the creation of the monitor.

Example:

`"2025-01-15T10:30:00Z"`

[​](#response-cadence-one-of-0)

cadence

enum<string> | null

deprecated

Deprecated: use 'frequency' field instead.

Available options:

`daily`,

`weekly`,

`hourly`,

`every_two_weeks`

Example:

`"daily"`

[​](#response-metadata-one-of-0)

metadata

Metadata · object | null

User-provided metadata stored with the monitor. Returned in webhook notifications and GET requests, enabling you to map responses to corresponding objects in your application.

Show child attributes

Example:

```
{
  "slack_thread_id": "1234567890.123456",
  "user_id": "U123ABC"
}
```

[​](#response-webhook-one-of-0)

webhook

MonitorWebhook · object | null

Webhook configuration for the monitor.

Show child attributes

[​](#response-output-schema-one-of-0)

output\_schema

JsonSchema · object | null

Output schema for the monitor event.

Show child attributes

[​](#response-source-policy-one-of-0)

source\_policy

SourcePolicy · object | null

Source policy governing preferred and disallowed domains in web search results.

Show child attributes

Example:

```
{
  "exclude_domains": ["reddit.com", "x.com", ".ai"],
  "include_domains": ["wikipedia.org", "usa.gov", ".edu"]
}
```

[​](#response-last-run-at-one-of-0)

last\_run\_at

string | null

Timestamp of the last run for the monitor.

Example:

`"2025-01-15T10:30:00Z"`

[​](#response-include-backfill-one-of-0)

include\_backfill

boolean | null

If true, the first execution includes historical events matching the query. Subsequent executions return only new events since the previous run.

[List Monitors](/api-reference/legacy/monitor-alpha/list-monitors-1)[Update Monitor](/api-reference/legacy/monitor-alpha/update-monitor)

⌘I
