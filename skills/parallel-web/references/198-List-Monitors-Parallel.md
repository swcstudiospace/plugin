# List Monitors - Parallel

Source: https://docs.parallel.ai/api-reference/legacy/monitor-alpha/list-monitors

List Monitors

Python

```
import requests

url = "https://api.parallel.ai/v1alpha/monitors"

headers = {"x-api-key": "<api-key>"}

response = requests.get(url, headers=headers)

print(response.text)
```

```
const options = {method: 'GET', headers: {'x-api-key': '<api-key>'}};

fetch('https://api.parallel.ai/v1alpha/monitors', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
HttpResponse<String> response = Unirest.get("https://api.parallel.ai/v1alpha/monitors")
  .header("x-api-key", "<api-key>")
  .asString();
```

```
curl --request GET \
  --url https://api.parallel.ai/v1alpha/monitors \
  --header 'x-api-key: <api-key>'
```

200

401

422

```
[
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
  },
  {
    "monitor_id": "monitor_b0179f70195e4258a3b982c1b6d8bd3a",
    "query": "Extract recent news about AI",
    "status": "canceled",
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
]
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
    "message": "Request validation error"
  }
}
```

GET

/

v1alpha

/

monitors

Try it

List Monitors

Python

```
import requests

url = "https://api.parallel.ai/v1alpha/monitors"

headers = {"x-api-key": "<api-key>"}

response = requests.get(url, headers=headers)

print(response.text)
```

```
const options = {method: 'GET', headers: {'x-api-key': '<api-key>'}};

fetch('https://api.parallel.ai/v1alpha/monitors', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
HttpResponse<String> response = Unirest.get("https://api.parallel.ai/v1alpha/monitors")
  .header("x-api-key", "<api-key>")
  .asString();
```

```
curl --request GET \
  --url https://api.parallel.ai/v1alpha/monitors \
  --header 'x-api-key: <api-key>'
```

200

401

422

```
[
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
  },
  {
    "monitor_id": "monitor_b0179f70195e4258a3b982c1b6d8bd3a",
    "query": "Extract recent news about AI",
    "status": "canceled",
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
]
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

#### Query Parameters

[​](#parameter-one-of-0)

monitor\_id

string | null

Monitor ID to start listing after (for pagination). Returns monitors starting with this ID in lexicographic order.

[​](#parameter-one-of-0)

limit

integer | null

Maximum number of monitors to return. Defaults to returning all monitors.

Required range: `1 <= x <= 10000`

#### Response

200

application/json

Successful Response

[​](#response-items-monitor-id)

monitor\_id

string

required

ID of the monitor.

[​](#response-items-query)

query

string

required

The query being monitored.

Example:

`"Recent news about LLM models."`

[​](#response-items-status)

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

[​](#response-items-frequency)

frequency

string

required

Frequency of the monitor. Format: '' where unit is 'h' (hours), 'd' (days), or 'w' (weeks). Must be between 1h and 30d (inclusive).

Examples:

`"1d"`

`"1w"`

`"1h"`

`"2w"`

[​](#response-items-created-at)

created\_at

string<date-time>

required

Timestamp of the creation of the monitor.

Example:

`"2025-01-15T10:30:00Z"`

[​](#response-items-cadence-one-of-0)

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

[​](#response-items-metadata-one-of-0)

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

[​](#response-items-webhook-one-of-0)

webhook

MonitorWebhook · object | null

Webhook configuration for the monitor.

Show child attributes

[​](#response-items-output-schema-one-of-0)

output\_schema

JsonSchema · object | null

Output schema for the monitor event.

Show child attributes

[​](#response-items-source-policy-one-of-0)

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

[​](#response-items-last-run-at-one-of-0)

last\_run\_at

string | null

Timestamp of the last run for the monitor.

Example:

`"2025-01-15T10:30:00Z"`

[​](#response-items-include-backfill-one-of-0)

include\_backfill

boolean | null

If true, the first execution includes historical events matching the query. Subsequent executions return only new events since the previous run.

[Get FindAll Run Schema](/api-reference/legacy/findall/get-findall-run-schema)[Create Monitor](/api-reference/legacy/monitor-alpha/create-monitor)

⌘I
