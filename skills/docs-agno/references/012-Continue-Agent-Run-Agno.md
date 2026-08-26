# Continue Agent Run - Agno

Source: https://docs.agno.com/api-reference/agents/continue-agent-run

Continue Agent Run

cURL

```
curl --request POST \
  --url https://api.example.com/agents/{agent_id}/runs/{run_id}/continue \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data tools= \
  --data 'input=<string>' \
  --data continue_from=end \
  --data fork=false \
  --data regenerate=false \
  --data replace_original=true \
  --data 'additional_instructions=<string>' \
  --data 'session_id=<string>' \
  --data 'user_id=<string>' \
  --data stream=true \
  --data background=false
```

```
import requests

url = "https://api.example.com/agents/{agent_id}/runs/{run_id}/continue"

payload = {
    "tools": "",
    "input": "<string>",
    "continue_from": "end",
    "fork": "false",
    "regenerate": "false",
    "replace_original": "true",
    "additional_instructions": "<string>",
    "session_id": "<string>",
    "user_id": "<string>",
    "stream": "true",
    "background": "false"
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
  body: new URLSearchParams({
    tools: '',
    input: '<string>',
    continue_from: 'end',
    fork: 'false',
    regenerate: 'false',
    replace_original: 'true',
    additional_instructions: '<string>',
    session_id: '<string>',
    user_id: '<string>',
    stream: 'true',
    background: 'false'
  })
};

fetch('https://api.example.com/agents/{agent_id}/runs/{run_id}/continue', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/agents/{agent_id}/runs/{run_id}/continue",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "tools=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false",
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

	url := "https://api.example.com/agents/{agent_id}/runs/{run_id}/continue"

	payload := strings.NewReader("tools=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false")

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
HttpResponse<String> response = Unirest.post("https://api.example.com/agents/{agent_id}/runs/{run_id}/continue")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/x-www-form-urlencoded")
  .body("tools=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/agents/{agent_id}/runs/{run_id}/continue")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'
request["Content-Type"] = 'application/x-www-form-urlencoded'
request.body = "tools=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false"

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

agents

/

{agent\_id}

/

runs

/

{run\_id}

/

continue

Try it

Continue Agent Run

cURL

```
curl --request POST \
  --url https://api.example.com/agents/{agent_id}/runs/{run_id}/continue \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data tools= \
  --data 'input=<string>' \
  --data continue_from=end \
  --data fork=false \
  --data regenerate=false \
  --data replace_original=true \
  --data 'additional_instructions=<string>' \
  --data 'session_id=<string>' \
  --data 'user_id=<string>' \
  --data stream=true \
  --data background=false
```

```
import requests

url = "https://api.example.com/agents/{agent_id}/runs/{run_id}/continue"

payload = {
    "tools": "",
    "input": "<string>",
    "continue_from": "end",
    "fork": "false",
    "regenerate": "false",
    "replace_original": "true",
    "additional_instructions": "<string>",
    "session_id": "<string>",
    "user_id": "<string>",
    "stream": "true",
    "background": "false"
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
  body: new URLSearchParams({
    tools: '',
    input: '<string>',
    continue_from: 'end',
    fork: 'false',
    regenerate: 'false',
    replace_original: 'true',
    additional_instructions: '<string>',
    session_id: '<string>',
    user_id: '<string>',
    stream: 'true',
    background: 'false'
  })
};

fetch('https://api.example.com/agents/{agent_id}/runs/{run_id}/continue', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/agents/{agent_id}/runs/{run_id}/continue",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "tools=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false",
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

	url := "https://api.example.com/agents/{agent_id}/runs/{run_id}/continue"

	payload := strings.NewReader("tools=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false")

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
HttpResponse<String> response = Unirest.post("https://api.example.com/agents/{agent_id}/runs/{run_id}/continue")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/x-www-form-urlencoded")
  .body("tools=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/agents/{agent_id}/runs/{run_id}/continue")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'
request["Content-Type"] = 'application/x-www-form-urlencoded'
request.body = "tools=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false"

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

[​](#parameter-agent-id)

agent\_id

string

required

[​](#parameter-run-id)

run\_id

string

required

#### Body

application/x-www-form-urlencoded

[​](#body-tools)

tools

string

default:""

JSON string of tool call results to continue the paused run

[​](#body-input-one-of-0)

input

string | null

Optional new user-message text to append to the run before resuming. Use for continuing a COMPLETED run with a follow-up, or adding context to a RUNNING/ERROR resume.

[​](#body-continue-from)

continue\_from

string

default:end

Continuation boundary. Use 'end', 'last\_user', or a numeric message index.

[​](#body-fork)

fork

boolean

default:false

When true, clone the run with a new `run_id` before resuming. The original is untouched; the clone becomes a sibling within the same session, with `forked_from_run_id` set.

[​](#body-regenerate)

regenerate

boolean

default:false

Sugar: regenerate the last response of this run. Auto-computes `continue_from='last_user'` to land just after the last user message. Pair with `additional_instructions` to steer the new output. By default the original response is hidden from history (replaced); pass `replace_original=false` to keep both the original and the regenerated response visible side by side.

[​](#body-replace-original-one-of-0)

replace\_original

boolean | null

Only valid with `regenerate=true`. Controls history visibility of the original response; the original run is always retained in storage. Defaults to true: the original is marked REGENERATED and hidden from history so the new response replaces it. Pass false to keep both the original and regenerated responses visible.

[​](#body-additional-instructions-one-of-0)

additional\_instructions

string | null

Only valid with `regenerate=true`: extra guidance appended as a user message before re-generation. Friendly alias for `input`.

[​](#body-session-id-one-of-0)

session\_id

string | null

Session ID for the paused run

[​](#body-user-id-one-of-0)

user\_id

string | null

User identifier for tracking and personalization

[​](#body-stream)

stream

boolean

default:true

Enable streaming responses via Server-Sent Events (SSE)

[​](#body-background)

background

boolean

default:false

Run continue in background (survives client disconnect). Requires database. Use /resume to reconnect.

#### Response

200

application/json

Agent run continued successfully

⌘I
