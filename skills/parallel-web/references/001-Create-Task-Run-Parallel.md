# Create Task Run - Parallel

Source: https://docs.parallel.ai/api-reference/tasks/create-task-run

Python

Python

```
from parallel import Parallel

client = Parallel()

task_run = client.task_run.create(
    input="What was the GDP of France in 2023?",
    processor="base",
)
print(task_run.run_id)
```

```
import Parallel from "parallel-web";

const client = new Parallel();

const taskRun = await client.taskRun.create({
    input: 'What was the GDP of France in 2023?',
    processor: 'base',
});
console.log(taskRun.run_id);
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1/tasks/runs")
  .header("x-api-key", "<api-key>")
  .header("Content-Type", "application/json")
  .body("{\n  \"processor\": \"<string>\",\n  \"input\": \"What was the GDP of France in 2023?\"\n}")
  .asString();
```

```
curl --request POST \
  --url https://api.parallel.ai/v1/tasks/runs \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '
{
  "processor": "<string>",
  "input": "What was the GDP of France in 2023?"
}
'
```

202

401

402

403

422

429

```
{
  "run_id": "trun_9907962f83aa4d9d98fd7f4bf745d654",
  "interaction_id": "trun_9907962f83aa4d9d98fd7f4bf745d654",
  "status": "queued",
  "is_active": true,
  "processor": "core",
  "metadata": {
    "my_key": "my_value"
  },
  "created_at": "2025-04-23T20:21:48.037943Z",
  "modified_at": "2025-04-23T20:21:48.037943Z"
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Unauthorized: invalid or missing credentials"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Payment required: insufficient credit in account"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Forbidden: invalid processor in request"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Unprocessable content: request validation error"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Too many requests: quota temporarily exceeded"
  }
}
```

POST

/

v1

/

tasks

/

runs

Try it

Python

Python

```
from parallel import Parallel

client = Parallel()

task_run = client.task_run.create(
    input="What was the GDP of France in 2023?",
    processor="base",
)
print(task_run.run_id)
```

```
import Parallel from "parallel-web";

const client = new Parallel();

const taskRun = await client.taskRun.create({
    input: 'What was the GDP of France in 2023?',
    processor: 'base',
});
console.log(taskRun.run_id);
```

```
HttpResponse<String> response = Unirest.post("https://api.parallel.ai/v1/tasks/runs")
  .header("x-api-key", "<api-key>")
  .header("Content-Type", "application/json")
  .body("{\n  \"processor\": \"<string>\",\n  \"input\": \"What was the GDP of France in 2023?\"\n}")
  .asString();
```

```
curl --request POST \
  --url https://api.parallel.ai/v1/tasks/runs \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '
{
  "processor": "<string>",
  "input": "What was the GDP of France in 2023?"
}
'
```

202

401

402

403

422

429

```
{
  "run_id": "trun_9907962f83aa4d9d98fd7f4bf745d654",
  "interaction_id": "trun_9907962f83aa4d9d98fd7f4bf745d654",
  "status": "queued",
  "is_active": true,
  "processor": "core",
  "metadata": {
    "my_key": "my_value"
  },
  "created_at": "2025-04-23T20:21:48.037943Z",
  "modified_at": "2025-04-23T20:21:48.037943Z"
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Unauthorized: invalid or missing credentials"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Payment required: insufficient credit in account"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Forbidden: invalid processor in request"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Unprocessable content: request validation error"
  }
}
```

```
{
  "type": "error",
  "error": {
    "ref_id": "fcb2b4f3-c75e-4186-87bc-caa1a8381331",
    "message": "Too many requests: quota temporarily exceeded"
  }
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

#### Body

application/json

Request to run a task.

[​](#body-processor)

processor

string

required

Processor to use for the task.

Example:

`"base"`

[​](#body-input-one-of-0)

input

required

Input to the task, either text or a JSON object.

Example:

`"What was the GDP of France in 2023?"`

[​](#body-metadata-one-of-0)

metadata

Metadata · object | null

User-provided metadata stored with the run. Keys and values must be strings with a maximum length of 16 and 512 characters respectively.

Show child attributes

[​](#body-source-policy-one-of-0)

source\_policy

SourcePolicy · object | null

Optional source policy governing preferred and disallowed domains in web search results.

Show child attributes

[​](#body-advanced-settings-one-of-0)

advanced\_settings

TaskAdvancedSettings · object | null

Advanced search configuration for the task run.

Show child attributes

[​](#body-task-spec-one-of-0)

task\_spec

TaskSpec · object | null

Task specification. If unspecified, defaults to auto output schema.

Show child attributes

[​](#body-previous-interaction-id-one-of-0)

previous\_interaction\_id

string | null

Interaction ID to use as context for this request.

[​](#body-mcp-servers-one-of-0)

mcp\_servers

McpServer · object[] | null

Optional list of MCP servers to use for the run.

Show child attributes

[​](#body-enable-events-one-of-0)

enable\_events

boolean | null

Controls tracking of task run execution progress. When set to true, progress events are recorded and can be accessed via the [Task Run events](https://docs.parallel.ai/api-reference) endpoint. When false, no progress events are tracked. Note that progress tracking cannot be enabled after a run has been created. The flag is set to true by default for premium processors (pro and above).

[​](#body-webhook-one-of-0)

webhook

Webhook · object | null

Callback URL (webhook endpoint) that will receive an HTTP POST when the run completes.
This feature is not available via the Python SDK.

Show child attributes

#### Response

202

application/json

Successful Response

Status of a task run.

[​](#response-run-id)

run\_id

string

required

ID of the task run.

Example:

`"trun_e0083b6aac0544eb8686e8d2a76533d2"`

[​](#response-interaction-id)

interaction\_id

string

required

Identifier for this interaction. Pass this value as `previous_interaction_id` to reuse context for a future request.

Example:

`"trun_e0083b6aac0544eb8686e8d2a76533d2"`

[​](#response-status)

status

enum<string>

required

Status of the run.

Available options:

`queued`,

`action_required`,

`running`,

`completed`,

`failed`,

`cancelling`,

`cancelled`

Examples:

`"queued"`

`"action_required"`

`"running"`

`"completed"`

`"failed"`

`"cancelling"`

`"cancelled"`

[​](#response-is-active)

is\_active

boolean

required

Whether the run is currently active, i.e. status is one of {'cancelling', 'queued', 'running'}.

[​](#response-processor)

processor

string

required

Processor used for the run.

Example:

`"base"`

[​](#response-created-at-one-of-0)

created\_at

string | null

required

Timestamp of the creation of the task, as an RFC 3339 string.

Example:

`"2025-04-24T18:56:22.513132Z"`

[​](#response-modified-at-one-of-0)

modified\_at

string | null

required

Timestamp of the last modification to the task, as an RFC 3339 string.

Example:

`"2025-04-24T18:56:22.513132Z"`

[​](#response-warnings-one-of-0)

warnings

Warning · object[] | null

Warnings for the run, if any.

Show child attributes

Example:

```
[]
```

[​](#response-error-one-of-0)

error

Error · object | null

Error for the run, present only if status is 'failed'.

Show child attributes

[​](#response-metadata-one-of-0)

metadata

Metadata · object | null

User-provided metadata stored with the run.

Show child attributes

Example:

```
{}
```

[​](#response-taskgroup-id-one-of-0)

taskgroup\_id

string | null

ID of the taskgroup to which the run belongs.

[Retrieve Task Group Run](/api-reference/tasks/retrieve-task-group-run)[Retrieve Task Run](/api-reference/tasks/retrieve-task-run)

⌘I
