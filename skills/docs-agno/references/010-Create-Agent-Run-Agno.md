# Create Agent Run - Agno

Source: https://docs.agno.com/api-reference/agents/create-agent-run

Create Agent Run

cURL

```
curl --request POST \
  --url https://api.example.com/agents/{agent_id}/runs \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: multipart/form-data' \
  --form 'message=<string>' \
  --form stream=true \
  --form 'session_id=<string>' \
  --form 'user_id=<string>' \
  --form 'files=<string>' \
  --form 'version=<string>' \
  --form background=false \
  --form 'factory_input=<string>' \
  --form files.0.items='@example-file'
```

```
import requests

url = "https://api.example.com/agents/{agent_id}/runs"

files = { "files.0.items": ("example-file", open("example-file", "rb")) }
payload = {
    "message": "<string>",
    "stream": "true",
    "session_id": "<string>",
    "user_id": "<string>",
    "files": "<string>",
    "version": "<string>",
    "background": "false",
    "factory_input": "<string>"
}
headers = {"Authorization": "Bearer <token>"}

response = requests.post(url, data=payload, files=files, headers=headers)

print(response.text)
```

```
const form = new FormData();
form.append('message', '<string>');
form.append('stream', 'true');
form.append('session_id', '<string>');
form.append('user_id', '<string>');
form.append('files', '<string>');
form.append('version', '<string>');
form.append('background', 'false');
form.append('factory_input', '<string>');
form.append('files.0.items', '{
  "fileName": "example-file"
}');

const options = {method: 'POST', headers: {Authorization: 'Bearer <token>'}};

options.body = form;

fetch('https://api.example.com/agents/{agent_id}/runs', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/agents/{agent_id}/runs",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"message\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"stream\"\r\n\r\ntrue\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"session_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"user_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"version\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"background\"\r\n\r\nfalse\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"factory_input\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files.0.items\"; filename=\"example-file\"\r\nContent-Type: application/octet-stream\r\n\r\n{\r\n  \"fileName\": \"example-file\"\r\n}\r\n-----011000010111000001101001--",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer <token>",
    "Content-Type: multipart/form-data"
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

	url := "https://api.example.com/agents/{agent_id}/runs"

	payload := strings.NewReader("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"message\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"stream\"\r\n\r\ntrue\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"session_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"user_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"version\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"background\"\r\n\r\nfalse\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"factory_input\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files.0.items\"; filename=\"example-file\"\r\nContent-Type: application/octet-stream\r\n\r\n{\r\n  \"fileName\": \"example-file\"\r\n}\r\n-----011000010111000001101001--")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Authorization", "Bearer <token>")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.post("https://api.example.com/agents/{agent_id}/runs")
  .header("Authorization", "Bearer <token>")
  .body("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"message\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"stream\"\r\n\r\ntrue\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"session_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"user_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"version\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"background\"\r\n\r\nfalse\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"factory_input\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files.0.items\"; filename=\"example-file\"\r\nContent-Type: application/octet-stream\r\n\r\n{\r\n  \"fileName\": \"example-file\"\r\n}\r\n-----011000010111000001101001--")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/agents/{agent_id}/runs")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'
request.body = "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"message\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"stream\"\r\n\r\ntrue\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"session_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"user_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"version\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"background\"\r\n\r\nfalse\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"factory_input\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files.0.items\"; filename=\"example-file\"\r\nContent-Type: application/octet-stream\r\n\r\n{\r\n  \"fileName\": \"example-file\"\r\n}\r\n-----011000010111000001101001--"

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

Try it

Create Agent Run

cURL

```
curl --request POST \
  --url https://api.example.com/agents/{agent_id}/runs \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: multipart/form-data' \
  --form 'message=<string>' \
  --form stream=true \
  --form 'session_id=<string>' \
  --form 'user_id=<string>' \
  --form 'files=<string>' \
  --form 'version=<string>' \
  --form background=false \
  --form 'factory_input=<string>' \
  --form files.0.items='@example-file'
```

```
import requests

url = "https://api.example.com/agents/{agent_id}/runs"

files = { "files.0.items": ("example-file", open("example-file", "rb")) }
payload = {
    "message": "<string>",
    "stream": "true",
    "session_id": "<string>",
    "user_id": "<string>",
    "files": "<string>",
    "version": "<string>",
    "background": "false",
    "factory_input": "<string>"
}
headers = {"Authorization": "Bearer <token>"}

response = requests.post(url, data=payload, files=files, headers=headers)

print(response.text)
```

```
const form = new FormData();
form.append('message', '<string>');
form.append('stream', 'true');
form.append('session_id', '<string>');
form.append('user_id', '<string>');
form.append('files', '<string>');
form.append('version', '<string>');
form.append('background', 'false');
form.append('factory_input', '<string>');
form.append('files.0.items', '{
  "fileName": "example-file"
}');

const options = {method: 'POST', headers: {Authorization: 'Bearer <token>'}};

options.body = form;

fetch('https://api.example.com/agents/{agent_id}/runs', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/agents/{agent_id}/runs",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"message\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"stream\"\r\n\r\ntrue\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"session_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"user_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"version\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"background\"\r\n\r\nfalse\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"factory_input\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files.0.items\"; filename=\"example-file\"\r\nContent-Type: application/octet-stream\r\n\r\n{\r\n  \"fileName\": \"example-file\"\r\n}\r\n-----011000010111000001101001--",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer <token>",
    "Content-Type: multipart/form-data"
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

	url := "https://api.example.com/agents/{agent_id}/runs"

	payload := strings.NewReader("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"message\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"stream\"\r\n\r\ntrue\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"session_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"user_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"version\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"background\"\r\n\r\nfalse\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"factory_input\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files.0.items\"; filename=\"example-file\"\r\nContent-Type: application/octet-stream\r\n\r\n{\r\n  \"fileName\": \"example-file\"\r\n}\r\n-----011000010111000001101001--")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("Authorization", "Bearer <token>")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.post("https://api.example.com/agents/{agent_id}/runs")
  .header("Authorization", "Bearer <token>")
  .body("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"message\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"stream\"\r\n\r\ntrue\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"session_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"user_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"version\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"background\"\r\n\r\nfalse\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"factory_input\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files.0.items\"; filename=\"example-file\"\r\nContent-Type: application/octet-stream\r\n\r\n{\r\n  \"fileName\": \"example-file\"\r\n}\r\n-----011000010111000001101001--")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/agents/{agent_id}/runs")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'
request.body = "-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"message\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"stream\"\r\n\r\ntrue\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"session_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"user_id\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"version\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"background\"\r\n\r\nfalse\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"factory_input\"\r\n\r\n<string>\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"files.0.items\"; filename=\"example-file\"\r\nContent-Type: application/octet-stream\r\n\r\n{\r\n  \"fileName\": \"example-file\"\r\n}\r\n-----011000010111000001101001--"

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

#### Body

multipart/form-data

[​](#body-message)

message

string

required

The input message or prompt to send to the agent

[​](#body-stream)

stream

boolean

default:true

Enable streaming responses via Server-Sent Events (SSE)

[​](#body-session-id-one-of-0)

session\_id

string | null

Session ID for conversation continuity. If not provided, a new session is created

[​](#body-user-id-one-of-0)

user\_id

string | null

User identifier for tracking and personalization

[​](#body-files-one-of-0)

files

file[] | null

Files to upload (images, audio, video, or documents)

[​](#body-version-one-of-0)

version

string | null

Agent version to use for this run

[​](#body-background)

background

boolean

default:false

Run in background and return immediately with run metadata (requires database)

[​](#body-factory-input-one-of-0)

factory\_input

string | null

JSON object with factory-specific parameters for dynamic agent construction

#### Response

200

application/json

Agent run executed successfully

⌘I
