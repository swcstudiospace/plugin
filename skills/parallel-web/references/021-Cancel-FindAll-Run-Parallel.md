# Cancel FindAll Run - Parallel

Source: https://docs.parallel.ai/api-reference/findall/cancel-findall-run

Python

Python

```
from parallel import Parallel

client = Parallel()

client.beta.findall.cancel(
    findall_id="findall_56ccc4d188fb41a0803a935cf485c774",
)

print("FindAll run cancelled.")
```

```
import Parallel from "parallel-web";

const client = new Parallel();

await client.beta.findall.cancel("findall_56ccc4d188fb41a0803a935cf485c774");

console.log("FindAll run cancelled.");
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1beta/findall/runs/{findall_id}/cancel")
  .header("x-api-key", "<api-key>")
  .asString();
```

```
curl --request POST \
  --url https://api.parallel.ai/v1beta/findall/runs/{findall_id}/cancel \
  --header 'x-api-key: <api-key>'
```

404

409

422

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "FindAll run not found"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Cannot cancel a terminated FindAll run"
  }
}
```

```
{
  "detail": [
    {
      "loc": [
        "<string>"
      ],
      "msg": "<string>",
      "type": "<string>"
    }
  ]
}
```

POST

/

v1beta

/

findall

/

runs

/

{findall\_id}

/

cancel

Try it

Python

Python

```
from parallel import Parallel

client = Parallel()

client.beta.findall.cancel(
    findall_id="findall_56ccc4d188fb41a0803a935cf485c774",
)

print("FindAll run cancelled.")
```

```
import Parallel from "parallel-web";

const client = new Parallel();

await client.beta.findall.cancel("findall_56ccc4d188fb41a0803a935cf485c774");

console.log("FindAll run cancelled.");
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1beta/findall/runs/{findall_id}/cancel")
  .header("x-api-key", "<api-key>")
  .asString();
```

```
curl --request POST \
  --url https://api.parallel.ai/v1beta/findall/runs/{findall_id}/cancel \
  --header 'x-api-key: <api-key>'
```

404

409

422

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "FindAll run not found"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Cannot cancel a terminated FindAll run"
  }
}
```

```
{
  "detail": [
    {
      "loc": [
        "<string>"
      ],
      "msg": "<string>",
      "type": "<string>"
    }
  ]
}
```

#### Authorizations

[​](#authorization-x-api-key)

x-api-key

string

header

required

#### Headers

[​](#parameter-one-of-0)

parallel-beta

string | null

deprecated

#### Path Parameters

[​](#parameter-findall-id)

findall\_id

string

required

#### Response

204

FindAll run cancelled successfully.

[Retrieve FindAll Run Status](/api-reference/findall/retrieve-findall-run-status)[Add Enrichment to FindAll Run](/api-reference/findall/add-enrichment-to-findall-run)

⌘I
