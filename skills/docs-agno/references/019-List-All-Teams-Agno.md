# List All Teams - Agno

Source: https://docs.agno.com/reference-api/schema/teams/list-all-teams

List All Teams

cURL

```
curl --request GET \
  --url https://api.example.com/teams \
  --header 'Authorization: Bearer <token>'
```

```
import requests

url = "https://api.example.com/teams"

headers = {"Authorization": "Bearer <token>"}

response = requests.get(url, headers=headers)

print(response.text)
```

```
const options = {method: 'GET', headers: {Authorization: 'Bearer <token>'}};

fetch('https://api.example.com/teams', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/teams",
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

	url := "https://api.example.com/teams"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("Authorization", "Bearer <token>")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.get("https://api.example.com/teams")
  .header("Authorization", "Bearer <token>")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/teams")

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
    "team_id": "basic-team",
    "name": "Basic Team",
    "mode": "coordinate",
    "model": {
      "name": "OpenAIChat",
      "model": "gpt-4o",
      "provider": "OpenAI"
    },
    "tools": [
      {
        "name": "transfer_task_to_member",
        "description": "Use this function to transfer a task to the selected team member.\nYou must provide a clear and concise description of the task the member should achieve AND the expected output.",
        "parameters": {
          "type": "object",
          "properties": {
            "member_id": {
              "type": "string",
              "description": "(str) The ID of the member to transfer the task to. Use only the ID of the member, not the ID of the team followed by the ID of the member."
            },
            "task_description": {
              "type": "string",
              "description": "(str) A clear and concise description of the task the member should achieve."
            },
            "expected_output": {
              "type": "string",
              "description": "(str) The expected output from the member (optional)."
            }
          },
          "additionalProperties": false,
          "required": [
            "member_id",
            "task_description"
          ]
        }
      }
    ],
    "members": [
      {
        "agent_id": "basic-agent",
        "name": "Basic Agent",
        "model": {
          "name": "OpenAIChat",
          "model": "gpt-4o",
          "provider": "OpenAI gpt-4o"
        },
        "memory": {
          "app_name": "Memory",
          "model": {
            "name": "OpenAIChat",
            "model": "gpt-4o",
            "provider": "OpenAI"
          }
        },
        "session_table": "agno_sessions",
        "memory_table": "agno_memories"
      }
    ],
    "enable_agentic_context": false,
    "memory": {
      "app_name": "agno_memories",
      "app_url": "/memory/1",
      "model": {
        "name": "OpenAIChat",
        "model": "gpt-4o",
        "provider": "OpenAI"
      }
    },
    "async_mode": false,
    "session_table": "agno_sessions",
    "memory_table": "agno_memories"
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

teams

Try it

List All Teams

cURL

```
curl --request GET \
  --url https://api.example.com/teams \
  --header 'Authorization: Bearer <token>'
```

```
import requests

url = "https://api.example.com/teams"

headers = {"Authorization": "Bearer <token>"}

response = requests.get(url, headers=headers)

print(response.text)
```

```
const options = {method: 'GET', headers: {Authorization: 'Bearer <token>'}};

fetch('https://api.example.com/teams', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/teams",
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

	url := "https://api.example.com/teams"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("Authorization", "Bearer <token>")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.get("https://api.example.com/teams")
  .header("Authorization", "Bearer <token>")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/teams")

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
    "team_id": "basic-team",
    "name": "Basic Team",
    "mode": "coordinate",
    "model": {
      "name": "OpenAIChat",
      "model": "gpt-4o",
      "provider": "OpenAI"
    },
    "tools": [
      {
        "name": "transfer_task_to_member",
        "description": "Use this function to transfer a task to the selected team member.\nYou must provide a clear and concise description of the task the member should achieve AND the expected output.",
        "parameters": {
          "type": "object",
          "properties": {
            "member_id": {
              "type": "string",
              "description": "(str) The ID of the member to transfer the task to. Use only the ID of the member, not the ID of the team followed by the ID of the member."
            },
            "task_description": {
              "type": "string",
              "description": "(str) A clear and concise description of the task the member should achieve."
            },
            "expected_output": {
              "type": "string",
              "description": "(str) The expected output from the member (optional)."
            }
          },
          "additionalProperties": false,
          "required": [
            "member_id",
            "task_description"
          ]
        }
      }
    ],
    "members": [
      {
        "agent_id": "basic-agent",
        "name": "Basic Agent",
        "model": {
          "name": "OpenAIChat",
          "model": "gpt-4o",
          "provider": "OpenAI gpt-4o"
        },
        "memory": {
          "app_name": "Memory",
          "model": {
            "name": "OpenAIChat",
            "model": "gpt-4o",
            "provider": "OpenAI"
          }
        },
        "session_table": "agno_sessions",
        "memory_table": "agno_memories"
      }
    ],
    "enable_agentic_context": false,
    "memory": {
      "app_name": "agno_memories",
      "app_url": "/memory/1",
      "model": {
        "name": "OpenAIChat",
        "model": "gpt-4o",
        "provider": "OpenAI"
      }
    },
    "async_mode": false,
    "session_table": "agno_sessions",
    "memory_table": "agno_memories"
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

List of teams retrieved successfully

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

[​](#response-items-mode-one-of-0)

mode

string | null

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

[​](#response-items-response-settings-one-of-0)

response\_settings

Response Settings · object | null

[​](#response-items-introduction-one-of-0)

introduction

string | null

[​](#response-items-streaming-one-of-0)

streaming

Streaming · object | null

[​](#response-items-members-one-of-0)

members

AgentResponse · object[] | null

Show child attributes

[​](#response-items-metadata-one-of-0)

metadata

Metadata · object | null

[​](#response-items-input-schema-one-of-0)

input\_schema

Input Schema · object | null

[​](#response-items-is-factory)

is\_factory

boolean

default:false

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
