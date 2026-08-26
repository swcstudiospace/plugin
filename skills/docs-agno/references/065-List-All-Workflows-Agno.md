# List All Workflows - Agno

Source: https://docs.agno.com/reference-api/schema/workflows/list-all-workflows

List All Workflows

cURL

```
curl --request GET \
  --url https://api.example.com/workflows \
  --header 'Authorization: Bearer <token>'
```

```
import requests

url = "https://api.example.com/workflows"

headers = {"Authorization": "Bearer <token>"}

response = requests.get(url, headers=headers)

print(response.text)
```

```
const options = {method: 'GET', headers: {Authorization: 'Bearer <token>'}};

fetch('https://api.example.com/workflows', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/workflows",
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

	url := "https://api.example.com/workflows"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("Authorization", "Bearer <token>")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.get("https://api.example.com/workflows")
  .header("Authorization", "Bearer <token>")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/workflows")

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
    "id": "content-creation-workflow",
    "name": "Content Creation Workflow",
    "description": "Automated content creation from blog posts to social media",
    "db_id": "123"
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

workflows

Try it

List All Workflows

cURL

```
curl --request GET \
  --url https://api.example.com/workflows \
  --header 'Authorization: Bearer <token>'
```

```
import requests

url = "https://api.example.com/workflows"

headers = {"Authorization": "Bearer <token>"}

response = requests.get(url, headers=headers)

print(response.text)
```

```
const options = {method: 'GET', headers: {Authorization: 'Bearer <token>'}};

fetch('https://api.example.com/workflows', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/workflows",
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

	url := "https://api.example.com/workflows"

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("Authorization", "Bearer <token>")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.get("https://api.example.com/workflows")
  .header("Authorization", "Bearer <token>")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/workflows")

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
    "id": "content-creation-workflow",
    "name": "Content Creation Workflow",
    "description": "Automated content creation from blog posts to social media",
    "db_id": "123"
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

List of workflows retrieved successfully

[​](#response-items-id-one-of-0)

id

string | null

Unique identifier for the workflow

[​](#response-items-name-one-of-0)

name

string | null

Name of the workflow

[​](#response-items-description-one-of-0)

description

string | null

Description of the workflow

[​](#response-items-db-id-one-of-0)

db\_id

string | null

Database identifier

[​](#response-items-is-factory)

is\_factory

boolean

default:false

Whether this workflow is a factory

[​](#response-items-factory-input-schema-one-of-0)

factory\_input\_schema

Factory Input Schema · object | null

JSON Schema for factory\_input

[​](#response-items-is-component)

is\_component

boolean

default:false

Whether this workflow was created via Builder

[​](#response-items-current-version-one-of-0)

current\_version

integer | null

Current published version number

[​](#response-items-stage-one-of-0)

stage

string | null

Stage of the loaded config (draft/published)

⌘I
