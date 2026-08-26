# Resume Team Run Stream - Agno

Source: https://docs.agno.com/api-reference/teams/resume-team-run-stream

Resume Team Run Stream

cURL

```
curl --request POST \
  --url https://api.example.com/teams/{team_id}/runs/{run_id}/resume \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data last_event_index=123 \
  --data 'session_id=<string>'
```

```
import requests

url = "https://api.example.com/teams/{team_id}/runs/{run_id}/resume"

payload = {
    "last_event_index": "123",
    "session_id": "<string>"
}
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/x-www-form-urlencoded"
}

response = requests.post(url, data=payload, headers=headers)

print(response.text)
```

```
const options = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer <token>',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({last_event_index: '123', session_id: '<string>'})
};

fetch('https://api.example.com/teams/{team_id}/runs/{run_id}/resume', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/teams/{team_id}/runs/{run_id}/resume",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "last_event_index=123&session_id=%3Cstring%3E",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer <token>",
    "Content-Type: application/x-www-form-urlencoded"
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}
```

```
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.example.com/teams/{team_id}/runs/{run_id}/resume"

	payload := strings.NewReader("last_event_index=123&session_id=%3Cstring%3E")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Authorization", "Bearer <token>")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.post("https://api.example.com/teams/{team_id}/runs/{run_id}/resume")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/x-www-form-urlencoded")
  .body("last_event_index=123&session_id=%3Cstring%3E")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/teams/{team_id}/runs/{run_id}/resume")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'
request["Content-Type"] = 'application/x-www-form-urlencoded'
request.body = "last_event_index=123&session_id=%3Cstring%3E"

response = http.request(request)
puts response.read_body
```

400

401

404

422

500

```
{
  "detail": "Bad request",
  "error_code": "BAD_REQUEST"
}
```

```
{
  "detail": "Unauthenticated access",
  "error_code": "UNAUTHENTICATED"
}
```

```
{
  "detail": "Not found",
  "error_code": "NOT_FOUND"
}
```

```
{
  "detail": "Validation error",
  "error_code": "VALIDATION_ERROR"
}
```

```
{
  "detail": "Internal server error",
  "error_code": "INTERNAL_SERVER_ERROR"
}
```

POST

/

teams

/

{team\_id}

/

runs

/

{run\_id}

/

resume

Try it

Resume Team Run Stream

cURL

```
curl --request POST \
  --url https://api.example.com/teams/{team_id}/runs/{run_id}/resume \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data last_event_index=123 \
  --data 'session_id=<string>'
```

```
import requests

url = "https://api.example.com/teams/{team_id}/runs/{run_id}/resume"

payload = {
    "last_event_index": "123",
    "session_id": "<string>"
}
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/x-www-form-urlencoded"
}

response = requests.post(url, data=payload, headers=headers)

print(response.text)
```

```
const options = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer <token>',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({last_event_index: '123', session_id: '<string>'})
};

fetch('https://api.example.com/teams/{team_id}/runs/{run_id}/resume', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/teams/{team_id}/runs/{run_id}/resume",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "last_event_index=123&session_id=%3Cstring%3E",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer <token>",
    "Content-Type: application/x-www-form-urlencoded"
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}
```

```
package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "https://api.example.com/teams/{team_id}/runs/{run_id}/resume"

	payload := strings.NewReader("last_event_index=123&session_id=%3Cstring%3E")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Authorization", "Bearer <token>")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.post("https://api.example.com/teams/{team_id}/runs/{run_id}/resume")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/x-www-form-urlencoded")
  .body("last_event_index=123&session_id=%3Cstring%3E")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/teams/{team_id}/runs/{run_id}/resume")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'
request["Content-Type"] = 'application/x-www-form-urlencoded'
request.body = "last_event_index=123&session_id=%3Cstring%3E"

response = http.request(request)
puts response.read_body
```

400

401

404

422

500

```
{
  "detail": "Bad request",
  "error_code": "BAD_REQUEST"
}
```

```
{
  "detail": "Unauthenticated access",
  "error_code": "UNAUTHENTICATED"
}
```

```
{
  "detail": "Not found",
  "error_code": "NOT_FOUND"
}
```

```
{
  "detail": "Validation error",
  "error_code": "VALIDATION_ERROR"
}
```

```
{
  "detail": "Internal server error",
  "error_code": "INTERNAL_SERVER_ERROR"
}
```

#### Authorizations

[​](#authorization-authorization)

Authorization

string

header

required

Bearer authentication header of the form `Bearer <token>`, where `<token>` is your auth token.

#### Path Parameters

[​](#parameter-team-id)

team\_id

string

required

[​](#parameter-run-id)

run\_id

string

required

#### Body

application/x-www-form-urlencoded

[​](#body-last-event-index-one-of-0)

last\_event\_index

integer | null

Index of last event received by client (0-based)

[​](#body-session-id-one-of-0)

session\_id

string | null

Session ID for database fallback

#### Response

200

application/json

SSE stream of catch-up and/or live events

⌘I
