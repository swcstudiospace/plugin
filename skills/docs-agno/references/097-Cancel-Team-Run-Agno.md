# Cancel Team Run - Agno

Source: https://docs.agno.com/api-reference/teams/cancel-team-run

Cancel Team Run

cURL

```
curl --request POST \
  --url https://api.example.com/teams/{team_id}/runs/{run_id}/cancel \
  --header 'Authorization: Bearer <token>'
```

```
import requests

url = "https://api.example.com/teams/{team_id}/runs/{run_id}/cancel"

headers = {"Authorization": "Bearer <token>"}

response = requests.post(url, headers=headers)

print(response.text)
```

```
const options = {method: 'POST', headers: {Authorization: 'Bearer <token>'}};

fetch('https://api.example.com/teams/{team_id}/runs/{run_id}/cancel', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/teams/{team_id}/runs/{run_id}/cancel",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
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

	url := "https://api.example.com/teams/{team_id}/runs/{run_id}/cancel"

	req, _ := http.NewRequest("POST", url, nil)

	req.Header.Add("Authorization", "Bearer <token>")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.post("https://api.example.com/teams/{team_id}/runs/{run_id}/cancel")
  .header("Authorization", "Bearer <token>")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/teams/{team_id}/runs/{run_id}/cancel")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'

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

cancel

Try it

Cancel Team Run

cURL

```
curl --request POST \
  --url https://api.example.com/teams/{team_id}/runs/{run_id}/cancel \
  --header 'Authorization: Bearer <token>'
```

```
import requests

url = "https://api.example.com/teams/{team_id}/runs/{run_id}/cancel"

headers = {"Authorization": "Bearer <token>"}

response = requests.post(url, headers=headers)

print(response.text)
```

```
const options = {method: 'POST', headers: {Authorization: 'Bearer <token>'}};

fetch('https://api.example.com/teams/{team_id}/runs/{run_id}/cancel', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

```
<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.example.com/teams/{team_id}/runs/{run_id}/cancel",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
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

	url := "https://api.example.com/teams/{team_id}/runs/{run_id}/cancel"

	req, _ := http.NewRequest("POST", url, nil)

	req.Header.Add("Authorization", "Bearer <token>")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}
```

```
HttpResponse<String> response = Unirest.post("https://api.example.com/teams/{team_id}/runs/{run_id}/cancel")
  .header("Authorization", "Bearer <token>")
  .asString();
```

```
require 'uri'
require 'net/http'

url = URI("https://api.example.com/teams/{team_id}/runs/{run_id}/cancel")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'

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

#### Query Parameters

[​](#parameter-one-of-0)

session\_id

string | null

Session ID the run belongs to. Required for non-admin JWT users.

#### Response

200

application/json

Successful Response

⌘I
