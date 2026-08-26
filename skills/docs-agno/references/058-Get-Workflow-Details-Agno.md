# Get Workflow Details - Agno

Source: https://docs.agno.com/reference-api/schema/workflows/get-workflow-details

Get Workflow Details

cURL

```
curl --request GET \
  --url https://api.example.com/workflows/{workflow_id} \
  --header 'Authorization: Bearer <token>'
```

```
import requests

url = "https://api.example.com/workflows/{workflow_id}"

headers = {"Authorization": "Bearer <token>"}

response = requests.get(url, headers=headers)

print(response.text)
```

```
const options = {method: 'GET', headers: {Authorization: 'Bearer <token>'}};

fetch('https://api.example.com/workflows/{workflow_id}', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/workflows/{workflow_id}",
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

	url := "https://api.example.com/workflows/{workflow_id}"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("Authorization", "Bearer <token>")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.get("https://api.example.com/workflows/{workflow_id}")
  .header("Authorization", "Bearer <token>")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/workflows/{workflow_id}")

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
{
  "id": "content-creation-workflow",
  "name": "Content Creation Workflow",
  "description": "Automated content creation from blog posts to social media",
  "db_id": "123"
}
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

workflows

/

{workflow\_id}

Try it

Get Workflow Details

cURL

```
curl --request GET \
  --url https://api.example.com/workflows/{workflow_id} \
  --header 'Authorization: Bearer <token>'
```

```
import requests

url = "https://api.example.com/workflows/{workflow_id}"

headers = {"Authorization": "Bearer <token>"}

response = requests.get(url, headers=headers)

print(response.text)
```

```
const options = {method: 'GET', headers: {Authorization: 'Bearer <token>'}};

fetch('https://api.example.com/workflows/{workflow_id}', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/workflows/{workflow_id}",
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

	url := "https://api.example.com/workflows/{workflow_id}"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("Authorization", "Bearer <token>")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.get("https://api.example.com/workflows/{workflow_id}")
  .header("Authorization", "Bearer <token>")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/workflows/{workflow_id}")

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
{
  "id": "content-creation-workflow",
  "name": "Content Creation Workflow",
  "description": "Automated content creation from blog posts to social media",
  "db_id": "123"
}
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

#### Path Parameters

[​](#parameter-workflow-id)

workflow\_id

string

required

#### Query Parameters

[​](#parameter-one-of-0)

version

integer | null

Workflow version to retrieve

#### Response

200

application/json

Workflow details retrieved successfully

[​](#response-id-one-of-0)

id

string | null

Unique identifier for the workflow

[​](#response-name-one-of-0)

name

string | null

Name of the workflow

[​](#response-db-id-one-of-0)

db\_id

string | null

Database identifier

[​](#response-description-one-of-0)

description

string | null

Description of the workflow

[​](#response-input-schema-one-of-0)

input\_schema

Input Schema · object | null

Input schema for the workflow

[​](#response-steps-one-of-0)

steps

Steps · object[] | null

List of workflow steps

[​](#response-agent-one-of-0)

agent

AgentResponse · object | null

Agent configuration if used

Show child attributes

[​](#response-team-one-of-0)

team

TeamResponse · object | null

Team configuration if used

Show child attributes

[​](#response-metadata-one-of-0)

metadata

Metadata · object | null

Additional metadata

[​](#response-workflow-agent)

workflow\_agent

boolean

default:false

Whether this workflow uses a WorkflowAgent

[​](#response-is-factory)

is\_factory

boolean

default:false

Whether this workflow is a factory

[​](#response-factory-input-schema-one-of-0)

factory\_input\_schema

Factory Input Schema · object | null

JSON Schema for factory\_input

[​](#response-is-component)

is\_component

boolean

default:false

Whether this workflow was created via Builder

[​](#response-current-version-one-of-0)

current\_version

integer | null

Current published version number

[​](#response-stage-one-of-0)

stage

string | null

Stage of the loaded config (draft/published)

⌘I
