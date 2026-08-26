# List All Agents - Agno

Source: https://docs.agno.com/reference-api/schema/agents/list-all-agents

List All Agents

cURL

```
curl --request GET \
  --url https://api.example.com/agents \
  --header 'Authorization: Bearer <token>'
```

```
import requests

url = "https://api.example.com/agents"

headers = {"Authorization": "Bearer <token>"}

response = requests.get(url, headers=headers)

print(response.text)
```

```
const options = {method: 'GET', headers: {Authorization: 'Bearer <token>'}};

fetch('https://api.example.com/agents', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/agents",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer <token>"
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
	"net/http"
	"io"
)

func main() {

	url := "https://api.example.com/agents"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("Authorization", "Bearer <token>")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.get("https://api.example.com/agents")
  .header("Authorization", "Bearer <token>")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/agents")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["Authorization"] = 'Bearer <token>'

response = http.request(request)
puts response.read_body
```

200

400

401

404

422

500

```
[
  {
    "id": "main-agent",
    "name": "Main Agent",
    "db_id": "c6bf0644-feb8-4930-a305-380dae5ad6aa",
    "model": {
      "name": "OpenAIChat",
      "model": "gpt-4o",
      "provider": "OpenAI"
    },
    "sessions": {
      "session_table": "agno_sessions"
    },
    "knowledge": {
      "knowledge_table": "main_knowledge"
    },
    "system_message": {
      "markdown": true,
      "add_datetime_to_context": true
    }
  }
]
```

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

GET

/

agents

Try it

List All Agents

cURL

```
curl --request GET \
  --url https://api.example.com/agents \
  --header 'Authorization: Bearer <token>'
```

```
import requests

url = "https://api.example.com/agents"

headers = {"Authorization": "Bearer <token>"}

response = requests.get(url, headers=headers)

print(response.text)
```

```
const options = {method: 'GET', headers: {Authorization: 'Bearer <token>'}};

fetch('https://api.example.com/agents', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/agents",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer <token>"
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
	"net/http"
	"io"
)

func main() {

	url := "https://api.example.com/agents"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("Authorization", "Bearer <token>")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.get("https://api.example.com/agents")
  .header("Authorization", "Bearer <token>")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/agents")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["Authorization"] = 'Bearer <token>'

response = http.request(request)
puts response.read_body
```

200

400

401

404

422

500

```
[
  {
    "id": "main-agent",
    "name": "Main Agent",
    "db_id": "c6bf0644-feb8-4930-a305-380dae5ad6aa",
    "model": {
      "name": "OpenAIChat",
      "model": "gpt-4o",
      "provider": "OpenAI"
    },
    "sessions": {
      "session_table": "agno_sessions"
    },
    "knowledge": {
      "knowledge_table": "main_knowledge"
    },
    "system_message": {
      "markdown": true,
      "add_datetime_to_context": true
    }
  }
]
```

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

#### Response

200

application/json

List of agents retrieved successfully

[​](#response-items-id-one-of-0)

id

string | null

[​](#response-items-name-one-of-0)

name

string | null

[​](#response-items-db-id-one-of-0)

db\_id

string | null

[​](#response-items-description-one-of-0)

description

string | null

[​](#response-items-role-one-of-0)

role

string | null

[​](#response-items-is-factory)

is\_factory

boolean

default:false

[​](#response-items-model-one-of-0)

model

ModelResponse · object | null

Show child attributes

[​](#response-items-tools-one-of-0)

tools

Tools · object | null

[​](#response-items-sessions-one-of-0)

sessions

Sessions · object | null

[​](#response-items-knowledge-one-of-0)

knowledge

Knowledge · object | null

[​](#response-items-memory-one-of-0)

memory

Memory · object | null

[​](#response-items-reasoning-one-of-0)

reasoning

Reasoning · object | null

[​](#response-items-default-tools-one-of-0)

default\_tools

Default Tools · object | null

[​](#response-items-system-message-one-of-0)

system\_message

System Message · object | null

[​](#response-items-extra-messages-one-of-0)

extra\_messages

Extra Messages · object | null

[​](#response-items-response-settings-one-of-0)

response\_settings

Response Settings · object | null

[​](#response-items-introduction-one-of-0)

introduction

string | null

[​](#response-items-streaming-one-of-0)

streaming

Streaming · object | null

[​](#response-items-metadata-one-of-0)

metadata

Metadata · object | null

[​](#response-items-input-schema-one-of-0)

input\_schema

Input Schema · object | null

[​](#response-items-factory-input-schema-one-of-0)

factory\_input\_schema

Factory Input Schema · object | null

[​](#response-items-is-component)

is\_component

boolean

default:false

[​](#response-items-current-version-one-of-0)

current\_version

integer | null

[​](#response-items-stage-one-of-0)

stage

string | null

⌘I
