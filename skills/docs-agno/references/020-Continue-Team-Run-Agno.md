# Continue Team Run - Agno

Source: https://docs.agno.com/api-reference/teams/continue-team-run

Continue Team Run

cURL

```
curl --request POST \
  --url https://api.example.com/teams/{team_id}/runs/{run_id}/continue \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data requirements= \
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

url = "https://api.example.com/teams/{team_id}/runs/{run_id}/continue"

payload = {
    "requirements": "",
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
    requirements: '',
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

fetch('https://api.example.com/teams/{team_id}/runs/{run_id}/continue', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/teams/{team_id}/runs/{run_id}/continue",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "requirements=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false",
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

	url := "https://api.example.com/teams/{team_id}/runs/{run_id}/continue"

	payload := strings.NewReader("requirements=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false")

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
HttpResponse<String> response = Unirest.post("https://api.example.com/teams/{team_id}/runs/{run_id}/continue")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/x-www-form-urlencoded")
  .body("requirements=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/teams/{team_id}/runs/{run_id}/continue")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'
request["Content-Type"] = 'application/x-www-form-urlencoded'
request.body = "requirements=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false"

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

continue

Try it

Continue Team Run

cURL

```
curl --request POST \
  --url https://api.example.com/teams/{team_id}/runs/{run_id}/continue \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data requirements= \
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

url = "https://api.example.com/teams/{team_id}/runs/{run_id}/continue"

payload = {
    "requirements": "",
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
    requirements: '',
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

fetch('https://api.example.com/teams/{team_id}/runs/{run_id}/continue', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/teams/{team_id}/runs/{run_id}/continue",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "requirements=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false",
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

	url := "https://api.example.com/teams/{team_id}/runs/{run_id}/continue"

	payload := strings.NewReader("requirements=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false")

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
HttpResponse<String> response = Unirest.post("https://api.example.com/teams/{team_id}/runs/{run_id}/continue")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/x-www-form-urlencoded")
  .body("requirements=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/teams/{team_id}/runs/{run_id}/continue")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'
request["Content-Type"] = 'application/x-www-form-urlencoded'
request.body = "requirements=&input=%3Cstring%3E&continue_from=end&fork=false&regenerate=false&replace_original=true&additional_instructions=%3Cstring%3E&session_id=%3Cstring%3E&user_id=%3Cstring%3E&stream=true&background=false"

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

[​](#body-requirements)

requirements

string

default:""

[​](#body-input-one-of-0)

input

string | null

[​](#body-continue-from)

continue\_from

string

default:end

Continuation boundary. Use 'end', 'last\_user', or a numeric message index.

[​](#body-fork)

fork

boolean

default:false

[​](#body-regenerate)

regenerate

boolean

default:false

[​](#body-replace-original-one-of-0)

replace\_original

boolean | null

[​](#body-additional-instructions-one-of-0)

additional\_instructions

string | null

[​](#body-session-id-one-of-0)

session\_id

string | null

[​](#body-user-id-one-of-0)

user\_id

string | null

[​](#body-stream)

stream

boolean

default:true

[​](#body-background)

background

boolean

default:false

#### Response

200

application/json

Team run continued successfully

⌘I
