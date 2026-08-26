# Continue Workflow Run - Agno

Source: https://docs.agno.com/api-reference/workflows/continue-workflow-run

Continue Workflow Run

cURL

```
curl --request POST \
  --url https://api.example.com/workflows/{workflow_id}/runs/{run_id}/continue \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data step_requirements= \
  --data 'session_id=<string>' \
  --data 'user_id=<string>' \
  --data stream=true \
  --data 'factory_input=<string>'
```

```
import requests

url = "https://api.example.com/workflows/{workflow_id}/runs/{run_id}/continue"

payload = {
    "step_requirements": "",
    "session_id": "<string>",
    "user_id": "<string>",
    "stream": "true",
    "factory_input": "<string>"
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
    step_requirements: '',
    session_id: '<string>',
    user_id: '<string>',
    stream: 'true',
    factory_input: '<string>'
  })
};

fetch('https://api.example.com/workflows/{workflow_id}/runs/{run_id}/continue', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/workflows/{workflow_id}/runs/{run_id}/continue",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "step_requirements=&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&factory_input=%3Cstring%3E",
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

	url := "https://api.example.com/workflows/{workflow_id}/runs/{run_id}/continue"

	payload := strings.NewReader("step_requirements=&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&factory_input=%3Cstring%3E")

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
HttpResponse<String> response = Unirest.post("https://api.example.com/workflows/{workflow_id}/runs/{run_id}/continue")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/x-www-form-urlencoded")
  .body("step_requirements=&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&factory_input=%3Cstring%3E")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/workflows/{workflow_id}/runs/{run_id}/continue")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'
request["Content-Type"] = 'application/x-www-form-urlencoded'
request.body = "step_requirements=&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&factory_input=%3Cstring%3E"

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

workflows

/

{workflow\_id}

/

runs

/

{run\_id}

/

continue

Try it

Continue Workflow Run

cURL

```
curl --request POST \
  --url https://api.example.com/workflows/{workflow_id}/runs/{run_id}/continue \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data step_requirements= \
  --data 'session_id=<string>' \
  --data 'user_id=<string>' \
  --data stream=true \
  --data 'factory_input=<string>'
```

```
import requests

url = "https://api.example.com/workflows/{workflow_id}/runs/{run_id}/continue"

payload = {
    "step_requirements": "",
    "session_id": "<string>",
    "user_id": "<string>",
    "stream": "true",
    "factory_input": "<string>"
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
    step_requirements: '',
    session_id: '<string>',
    user_id: '<string>',
    stream: 'true',
    factory_input: '<string>'
  })
};

fetch('https://api.example.com/workflows/{workflow_id}/runs/{run_id}/continue', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/workflows/{workflow_id}/runs/{run_id}/continue",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "step_requirements=&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&factory_input=%3Cstring%3E",
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

	url := "https://api.example.com/workflows/{workflow_id}/runs/{run_id}/continue"

	payload := strings.NewReader("step_requirements=&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&factory_input=%3Cstring%3E")

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
HttpResponse<String> response = Unirest.post("https://api.example.com/workflows/{workflow_id}/runs/{run_id}/continue")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/x-www-form-urlencoded")
  .body("step_requirements=&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&factory_input=%3Cstring%3E")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/workflows/{workflow_id}/runs/{run_id}/continue")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'
request["Content-Type"] = 'application/x-www-form-urlencoded'
request.body = "step_requirements=&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&factory_input=%3Cstring%3E"

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

[​](#parameter-workflow-id)

workflow\_id

string

required

[​](#parameter-run-id)

run\_id

string

required

#### Body

application/x-www-form-urlencoded

[​](#body-step-requirements)

step\_requirements

string

default:""

JSON string of step requirement objects with resolution status

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

[​](#body-factory-input-one-of-0)

factory\_input

string | null

JSON object with factory-specific parameters for dynamic workflow reconstruction

#### Response

200

application/json

Workflow run continued successfully

⌘I
