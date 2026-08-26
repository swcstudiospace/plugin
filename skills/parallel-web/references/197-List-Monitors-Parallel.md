# List Monitors - Parallel

Source: https://docs.parallel.ai/api-reference/legacy/monitor-alpha/list-monitors-1

List Monitors

Python

```
import requests

url = "https://api.parallel.ai/v1alpha/monitors/list"

headers = {"x-api-key": "<api-key>"}

response = requests.get(url, headers=headers)

print(response.text)
```

```
const options = {method: 'GET', headers: {'x-api-key': '<api-key>'}};

fetch('https://api.parallel.ai/v1alpha/monitors/list', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
HttpResponse<String> response = Unirest.get("https://api.parallel.ai/v1alpha/monitors/list")
  .header("x-api-key", "<api-key>")
  .asString();
```

```
curl --request GET \
  --url https://api.parallel.ai/v1alpha/monitors/list \
  --header 'x-api-key: <api-key>'
```

200

401

422

```
{
  "data": [
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
  ],
  "next_cursor": "eyJjYSI6ICIyMDI1LTA0LTIzVDIwOjIxOjQ4WiIsICJtaWQiOiAibW9uXzEyMyJ9"
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

list

Try it

List Monitors

Python

```
import requests

url = "https://api.parallel.ai/v1alpha/monitors/list"

headers = {"x-api-key": "<api-key>"}

response = requests.get(url, headers=headers)

print(response.text)
```

```
const options = {method: 'GET', headers: {'x-api-key': '<api-key>'}};

fetch('https://api.parallel.ai/v1alpha/monitors/list', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
HttpResponse<String> response = Unirest.get("https://api.parallel.ai/v1alpha/monitors/list")
  .header("x-api-key", "<api-key>")
  .asString();
```

```
curl --request GET \
  --url https://api.parallel.ai/v1alpha/monitors/list \
  --header 'x-api-key: <api-key>'
```

200

401

422

```
{
  "data": [
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
  ],
  "next_cursor": "eyJjYSI6ICIyMDI1LTA0LTIzVDIwOjIxOjQ4WiIsICJtaWQiOiAibW9uXzEyMyJ9"
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

cursor

string | null

Opaque pagination token returned as `next_cursor` in a previous response. Omit to start from the most recently created monitor.

[​](#parameter-one-of-0)

limit

integer | null

Maximum number of monitors to return. Defaults to 100. Between 1 and 10000.

Required range: `1 <= x <= 10000`

#### Response

200

application/json

Successful Response

Paginated list of monitors with an opaque cursor for fetching the next page.

[​](#response-data)

data

V0MonitorResponse · object[]

required

List of monitors, sorted by creation time descending.

Show child attributes

[​](#response-next-cursor-one-of-0)

next\_cursor

string | null

Opaque pagination token. Pass as `cursor` to retrieve the next page. Absent when there are no more results.

[Create Monitor](/api-reference/legacy/monitor-alpha/create-monitor)[Retrieve Monitor](/api-reference/legacy/monitor-alpha/retrieve-monitor)

⌘I
