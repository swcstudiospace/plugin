# Batch processing

Source: https://platform.claude.com/docs/en/build-with-claude/batch-processing.md

# Batch processing
Process large volumes of Messages requests asynchronously with the Message Batches API, cutting costs by 50% and increasing throughput.
---
Batch processing is a powerful approach for handling large volumes of requests efficiently. Instead of processing requests one at a time with immediate responses, batch processing allows you to submit multiple requests together for asynchronous processing. This pattern is particularly useful when:
\* You need to process large volumes of data
\* Immediate responses are not required
\* You want to optimize for cost efficiency
\* You're running large-scale evaluations or analyses
The Message Batches API is Anthropic's first implementation of this pattern.
For how zero data retention (ZDR) applies to this feature, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
# Message Batches API
The Message Batches API is a powerful, cost-effective way to asynchronously process large volumes of [Messages](/docs/en/api/messages/create) requests. This approach is well-suited to tasks that do not require immediate responses, with most batches finishing in less than 1 hour while reducing costs by 50% and increasing throughput.
You can [explore the API reference directly](/docs/en/api/messages/batches/create), in addition to this guide.
## How the Message Batches API works
When you send a request to the Message Batches API:
1. The system creates a new Message Batch with the provided Messages requests.
2. The batch is then processed asynchronously, with each request handled independently.
3. You can poll for the status of the batch and retrieve results when processing has ended for all requests.
This is especially useful for bulk operations that don't require immediate results, such as:
\* Large-scale evaluations: Process thousands of test cases efficiently.
\* Content moderation: Analyze large volumes of user-generated content asynchronously.
\* Data analysis: Generate insights or summaries for large datasets.
\* Bulk content generation: Create large amounts of text for various purposes (for example, product descriptions, article summaries).
### Batch limitations
\* A Message Batch is limited to either 100,000 Message requests or 256 MB in size, whichever is reached first.
\* The system processes each batch as fast as possible, with most batches completing within 1 hour. You can access batch results when all messages have completed or after 24 hours, whichever comes first. Batches expire if processing does not complete within 24 hours.
\* Batch results are available for 29 days after creation. After that, you may still view the Batch, but its results will no longer be available for download.
\* Batches are scoped to a [Workspace](/settings/workspaces). You may view all batches (and their results) that were created within the Workspace that your API key belongs to.
\* Rate limits apply to both Batches API HTTP requests and the number of requests within a batch waiting to be processed. See [Message Batches API rate limits](/docs/en/api/rate-limits#message-batches-api). Additionally, processing may be slowed down based on current demand and your request volume. In that case, you may see more requests expiring after 24 hours.
\* Because of high throughput and concurrent processing, batches may go slightly over your Workspace's configured [spend limit](/settings/limits).
\* Each batched request must have `max\_tokens` of at least `1`. `max\_tokens: 0` ([cache pre-warming](/docs/en/build-with-claude/prompt-caching#pre-warming-the-cache)) is not supported inside a batch, because an ephemeral cache entry written during batch processing would likely expire before the follow-up request runs.
### Supported models
All [active models](/docs/en/about-claude/models/overview) support the Message Batches API.
### What can be batched
Almost any request you can make to the Messages API can be included in a batch. This includes:
\* Vision
\* Tool use, including all [server tools](/docs/en/agents-and-tools/tool-use/server-tools) (web search, web fetch, code execution, MCP connectors, advisor, and tool search)
\* System messages
\* Multi-turn conversations
\* Extended thinking
\* Most beta features
Because each request in the batch is processed independently, you can mix different types of requests within a single batch.
A small number of Messages API parameters are \*\*not\*\* supported in batch requests. Including any of these returns a validation error:
| Parameter | Why |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `stream: true` | Batch results come back as a single file, not a stream. |
| `speed` ([Fast mode](/docs/en/build-with-claude/fast-mode)) | Fast mode tunes synchronous latency, which doesn't apply to asynchronous batch processing. |
| `store` / `previous\_thread\_event\_id` (Threads) | Threads are stateful; batch requests are not. |
| `cache\_hint` / `context\_hint` | These routing hints apply to synchronous request scheduling only. |
| `max\_tokens: 0` | See [Batch limitations](#batch-limitations). |
| `research\_preview\_2026\_02: "active"` | Research preview mode is not available on the batch path. |
Because batches can take longer than 5 minutes to process, consider using the [1-hour cache duration](/docs/en/build-with-claude/prompt-caching#1-hour-cache-duration) with prompt caching for better cache hit rates when processing batches with shared context.
## Pricing
The Batches API offers significant cost savings. All usage is charged at 50% of the standard API prices.
| Model | Batch input | Batch output |
| ------------------------------------------------------------------------------------------------------------- | ------------ | ------------- |
| Claude Fable 5 | $5 / MTok | $25 / MTok |
| Claude Mythos 5 ([limited availability](https://anthropic.com/glasswing)) | $5 / MTok | $25 / MTok |
| Claude Opus 5 | $2.50 / MTok | $12.50 / MTok |
| Claude Opus 4.8 | $2.50 / MTok | $12.50 / MTok |
| Claude Opus 4.7 | $2.50 / MTok | $12.50 / MTok |
| Claude Opus 4.6 | $2.50 / MTok | $12.50 / MTok |
| Claude Opus 4.5 | $2.50 / MTok | $12.50 / MTok |
| Claude Opus 4.1 ([deprecated](/docs/en/about-claude/model-deprecations)) | $7.50 / MTok | $37.50 / MTok |
| Claude Opus 4 ([retired, except on Google Cloud](/docs/en/about-claude/model-deprecations)) | $7.50 / MTok | $37.50 / MTok |
| Claude Sonnet 5 [through August 31, 2026](/docs/en/about-claude/pricing#claude-sonnet-5-introductory-pricing) | $1 / MTok | $5 / MTok |
| Claude Sonnet 5 starting September 1, 2026 | $1.50 / MTok | $7.50 / MTok |
| Claude Sonnet 4.6 | $1.50 / MTok | $7.50 / MTok |
| Claude Sonnet 4.5 | $1.50 / MTok | $7.50 / MTok |
| Claude Sonnet 4 ([retired, except on Bedrock and Google Cloud](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok | $7.50 / MTok |
| Claude Haiku 4.5 | $0.50 / MTok | $2.50 / MTok |
| Claude Haiku 3.5 ([retired, except on Bedrock and Google Cloud](/docs/en/about-claude/model-deprecations)) | $0.40 / MTok | $2 / MTok |
## How to use the Message Batches API
### Prepare and create your batch
A Message Batch is composed of a list of requests to create a Message. The shape of an individual request comprises:
\* A unique `custom\_id` for identifying the Messages request. Must be 1 to 64 characters and contain only alphanumeric characters, hyphens, and underscores (matching `^[a-zA-Z0-9\_-]{1,64}$`).
\* A `params` object with the standard [Messages API](/docs/en/api/messages/create) parameters
You can [create a batch](/docs/en/api/messages/batches/create) by passing this list into the `requests` parameter:
```bash cURL
curl https://api.anthropic.com/v1/messages/batches \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "content-type: application/json" \
--data \
'{
"requests": [
{
"custom\_id": "my-first-request",
"params": {
"model": "claude-opus-5",
"max\_tokens": 1024,
"messages": [
{"role": "user", "content": "Hello, world"}
]
}
},
{
"custom\_id": "my-second-request",
"params": {
"model": "claude-opus-5",
"max\_tokens": 1024,
"messages": [
{"role": "user", "content": "Hi again, friend"}
]
}
}
]
}'
```
```bash CLI
ant messages:batches create <<'YAML'
requests:
- custom\_id: my-first-request
params:
model: claude-opus-5
max\_tokens: 1024
messages:
- role: user
content: Hello, world
- custom\_id: my-second-request
params:
model: claude-opus-5
max\_tokens: 1024
messages:
- role: user
content: Hi again, friend
YAML
```
```python Python
from anthropic.types.message\_create\_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch\_create\_params import Request
client = anthropic.Anthropic()
message\_batch = client.messages.batches.create(
requests=[
Request(
custom\_id="my-first-request",
params=MessageCreateParamsNonStreaming(
model="claude-opus-5",
max\_tokens=1024,
messages=[
{
"role": "user",
"content": "Hello, world",
}
],
),
),
Request(
custom\_id="my-second-request",
params=MessageCreateParamsNonStreaming(
model="claude-opus-5",
max\_tokens=1024,
messages=[
{
"role": "user",
"content": "Hi again, friend",
}
],
),
),
]
)
print(message\_batch)
```
```typescript TypeScript
const client = new Anthropic();
const messageBatch = await client.messages.batches.create({
requests: [
{
custom\_id: "my-first-request",
params: {
model: "claude-opus-5",
max\_tokens: 1024,
messages: [{ role: "user", content: "Hello, world" }]
}
},
{
custom\_id: "my-second-request",
params: {
model: "claude-opus-5",
max\_tokens: 1024,
messages: [{ role: "user", content: "Hi again, friend" }]
}
}
]
});
console.log(messageBatch);
```
```csharp C#
using Anthropic;
using Anthropic.Models.Messages;
using Anthropic.Models.Messages.Batches;
AnthropicClient client = new();
var batch = await client.Messages.Batches.Create(new BatchCreateParams
{
Requests =
[
new()
{
CustomID = "my-first-request",
Params = new()
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Messages =
[
new() { Role = Role.User, Content = "Hello, world" }
]
}
},
new()
{
CustomID = "my-second-request",
Params = new()
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Messages =
[
new() { Role = Role.User, Content = "Hi again, friend" }
]
}
}
]
});
Console.WriteLine(batch);
```
```go Go
client := anthropic.NewClient()
batch, \_ := client.Messages.Batches.New(context.Background(),
anthropic.MessageBatchNewParams{
Requests: []anthropic.MessageBatchNewParamsRequest{
{
CustomID: "my-first-request",
Params: anthropic.MessageBatchNewParamsRequestParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(
anthropic.NewTextBlock("Hello, world"),
),
},
},
},
{
CustomID: "my-second-request",
Params: anthropic.MessageBatchNewParamsRequestParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(
anthropic.NewTextBlock("Hi again, friend"),
),
},
},
},
},
})
fmt.Println(batch.ID)
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
BatchCreateParams params = BatchCreateParams.builder()
.addRequest(
BatchCreateParams.Request.builder()
.customId("my-first-request")
.params(
BatchCreateParams.Request.Params.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024)
.addUserMessage("Hello, world")
.build()
)
.build()
)
.addRequest(
BatchCreateParams.Request.builder()
.customId("my-second-request")
.params(
BatchCreateParams.Request.Params.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024)
.addUserMessage("Hi again, friend")
.build()
)
.build()
)
.build();
MessageBatch messageBatch = client.messages().batches().create(params);
System.out.println(messageBatch);
```
```php PHP
$client = new Client();
$batch = $client->messages->batches->create(
requests: [
[
'custom\_id' => 'my-first-request',
'params' => [
'model' => 'claude-opus-5',
'max\_tokens' => 1024,
'messages' => [
['role' => 'user', 'content' => 'Hello, world']
]
]
],
[
'custom\_id' => 'my-second-request',
'params' => [
'model' => 'claude-opus-5',
'max\_tokens' => 1024,
'messages' => [
['role' => 'user', 'content' => 'Hi again, friend']
]
]
]
],
);
echo $batch->id;
```
```ruby Ruby
client = Anthropic::Client.new
batch = client.messages.batches.create(
requests: [
{
custom\_id: "my-first-request",
params: {
model: "claude-opus-5",
max\_tokens: 1024,
messages: [
{ role: "user", content: "Hello, world" }
]
}
},
{
custom\_id: "my-second-request",
params: {
model: "claude-opus-5",
max\_tokens: 1024,
messages: [
{ role: "user", content: "Hi again, friend" }
]
}
}
]
)
puts batch
```
In this example, two separate requests are batched together for asynchronous processing. Each request has a unique `custom\_id` and contains the standard parameters you'd use for a Messages API call.
\*\*Test your batch requests with the Messages API\*\*
Validation of the `params` object for each message request is performed asynchronously, and validation errors are returned when processing of the entire batch has ended. You can ensure that you are building your input correctly by verifying your request shape with the [Messages API](/docs/en/api/messages/create) first.
When a batch is first created, the response has a processing status of `in\_progress`.
```json Output
{
"id": "msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d",
"type": "message\_batch",
"processing\_status": "in\_progress",
"request\_counts": {
"processing": 2,
"succeeded": 0,
"errored": 0,
"canceled": 0,
"expired": 0
},
"ended\_at": null,
"created\_at": "2024-09-24T18:37:24.100435Z",
"expires\_at": "2024-09-25T18:37:24.100435Z",
"cancel\_initiated\_at": null,
"results\_url": null
}
```
### Tracking your batch
The Message Batch's `processing\_status` field indicates the stage of processing the batch is in. It starts as `in\_progress`, then updates to `ended` once all the requests in the batch have finished processing, and results are ready. You can monitor the state of your batch by visiting the [Console](/settings/workspaces/default/batches), or using the [retrieval endpoint](/docs/en/api/retrieving-message-batches).
#### Polling for Message Batch completion
To poll a Message Batch, you'll need its `id`, which is provided in the response when creating a batch or by listing batches. You can implement a polling loop that checks the batch status periodically until processing has ended:
```bash cURL
#!/bin/sh
# ...
# Check the status; repeat until processing\_status is "ended"
curl -s "https://api.anthropic.com/v1/messages/batches/$MESSAGE\_BATCH\_ID" \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
| jq -r '.processing\_status'
```
```bash CLI
#!/bin/bash
# ...
# Check the status; repeat until processing\_status is "ended"
ant messages:batches retrieve \
--message-batch-id "$MESSAGE\_BATCH\_ID" \
--transform processing\_status --raw-output
```
```python Python
import time
client = anthropic.Anthropic()
MESSAGE\_BATCH\_ID = "msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d"
message\_batch = None
while True:
message\_batch = client.messages.batches.retrieve(MESSAGE\_BATCH\_ID)
if message\_batch.processing\_status == "ended":
break
print(f"Batch {MESSAGE\_BATCH\_ID} is still processing...")
time.sleep(60)
print(message\_batch)
```
```typescript TypeScript
const client = new Anthropic();
const messageBatchId = "msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d";
let messageBatch;
while (true) {
messageBatch = await client.messages.batches.retrieve(messageBatchId);
if (messageBatch.processing\_status === "ended") {
break;
}
console.log(`Batch ${messageBatchId} is still processing... waiting`);
await new Promise((resolve) => setTimeout(resolve, 60\_000));
}
console.log(messageBatch);
```
```csharp C#
AnthropicClient client = new();
string messageBatchId = Environment.GetEnvironmentVariable("MESSAGE\_BATCH\_ID");
MessageBatch messageBatch = null;
while (true)
{
messageBatch = await client.Messages.Batches.Retrieve(messageBatchId);
if (messageBatch.ProcessingStatus == "ended")
{
break;
}
Console.WriteLine($"Batch {messageBatchId} is still processing...");
await Task.Delay(60000);
}
Console.WriteLine(messageBatch);
```
```go Go
client := anthropic.NewClient()
messageBatchID := os.Getenv("MESSAGE\_BATCH\_ID")
var messageBatch \*anthropic.MessageBatch
for {
var err error
messageBatch, err = client.Messages.Batches.Get(context.TODO(), messageBatchID)
if err != nil {
log.Fatal(err)
}
if messageBatch.ProcessingStatus == "ended" {
break
}
fmt.Printf("Batch %s is still processing...\n", messageBatchID)
time.Sleep(60 \* time.Second)
}
fmt.Println(messageBatch)
```
```java Java
import com.anthropic.models.messages.batches.MessageBatch;
// ...
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
String messageBatchId = "msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d";
MessageBatch messageBatch = null;
while (true) {
messageBatch = client.messages().batches().retrieve(messageBatchId);
if (messageBatch.processingStatus().equals(MessageBatch.ProcessingStatus.ENDED)) {
break;
}
System.out.println("Batch " + messageBatchId + " is still processing...");
Thread.sleep(60000);
}
System.out.println(messageBatch);
```
```php PHP
$client = new Client();
$messageBatchId = getenv("MESSAGE\_BATCH\_ID");
$messageBatch = null;
while (true) {
$messageBatch = $client->messages->batches->retrieve(
messageBatchID: $messageBatchId,
);
if ($messageBatch->processingStatus === "ended") {
break;
}
echo "Batch {$messageBatchId} is still processing...\n";
sleep(60);
}
echo json\_encode($messageBatch, JSON\_PRETTY\_PRINT);
```
```ruby Ruby
client = Anthropic::Client.new
message\_batch\_id = ENV["MESSAGE\_BATCH\_ID"]
message\_batch = nil
loop do
message\_batch = client.messages.batches.retrieve(message\_batch\_id)
break if message\_batch.processing\_status == :ended
puts "Batch #{message\_batch\_id} is still processing..."
sleep 60
end
puts message\_batch
```
### Listing all Message Batches
You can list all Message Batches in your Workspace using the [list endpoint](/docs/en/api/listing-message-batches). The API supports pagination, automatically fetching additional pages as needed:
```bash cURL
#!/bin/sh
# Fetches one page. While the response's has\_more is true, pass its
# last\_id as after\_id to fetch the next page. (The SDKs and the CLI
# perform automatic pagination.)
curl -s "https://api.anthropic.com/v1/messages/batches?limit=20" \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01"
```
```bash CLI
# Automatically fetches more pages as needed
ant messages:batches list --limit 20
```
```python Python
client = anthropic.Anthropic()
# Automatically fetches more pages as needed.
for message\_batch in client.messages.batches.list(limit=20):
print(message\_batch)
```
```typescript TypeScript
const client = new Anthropic();
// Automatically fetches more pages as needed.
for await (const messageBatch of client.messages.batches.list({
limit: 20
})) {
console.log(messageBatch);
}
```
```csharp C#
AnthropicClient client = new();
var parameters = new BatchListParams
{
Limit = 20
};
// Automatically fetches more pages as needed
var page = await client.Messages.Batches.List(parameters);
await foreach (var messageBatch in page.Paginate())
{
Console.WriteLine(messageBatch);
}
```
```go Go
client := anthropic.NewClient()
// Automatically fetches more pages as needed
iter := client.Messages.Batches.ListAutoPaging(context.TODO(), anthropic.MessageBatchListParams{
Limit: anthropic.Int(20),
})
for iter.Next() {
messageBatch := iter.Current()
fmt.Println(messageBatch)
}
if err := iter.Err(); err != nil {
log.Fatal(err)
}
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
// Automatically fetches more pages as needed
for (MessageBatch messageBatch : client
.messages()
.batches()
.list(BatchListParams.builder().limit(20).build())
.autoPager()) {
System.out.println(messageBatch);
}
```
```php PHP
$client = new Client();
// Automatically fetches more pages as needed
foreach ($client->messages->batches->list(limit: 20)->pagingEachItem() as $messageBatch) {
echo $messageBatch->id . "\n";
}
```
```ruby Ruby
client = Anthropic::Client.new
# Automatically fetches more pages as needed
client.messages.batches.list(limit: 20).auto\_paging\_each do |message\_batch|
puts message\_batch
end
```
### Retrieving batch results
Once batch processing has ended, each Messages request in the batch has a result. There are four result types:
| Result type | Description |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `succeeded` | Request was successful. Includes the message result. |
| `errored` | Request encountered an error and a message was not created. Possible errors include invalid requests and internal server errors. You will not be billed for these requests. |
| `canceled` | User canceled the batch before this request could be sent to the model. You will not be billed for these requests. |
| `expired` | Batch reached its 24-hour expiration before this request could be sent to the model. You will not be billed for these requests. |
The batch's `request\_counts` shows an overview of your results, indicating how many requests reached each of these four states.
Results of the batch are available for download at the `results\_url` property on the Message Batch, and if the organization permission allows, in the Console. Because of the potentially large size of the results, it's recommended to [stream results](/docs/en/api/messages/batches/results) back rather than download them all at once.
```bash cURL
#!/bin/sh
# Fetch the batch's results\_url, then stream the .jsonl results it
# points to. For per-result handling (retries, validation errors),
# use the SDK examples in the other tabs.
RESULTS\_URL=$(curl -s "https://api.anthropic.com/v1/messages/batches/msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d" \
--header "anthropic-version: 2023-06-01" \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
| jq -r '.results\_url')
curl -s "$RESULTS\_URL" \
--header "anthropic-version: 2023-06-01" \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
| jq -r '"\(.result.type): \(.custom\_id)"'
```
```bash CLI
# Prints one line per result, e.g. `{"custom\_id":"test-1","type":"succeeded",…}`.
# For per-result handling (retries, validation errors), use the SDK
# examples in the other tabs.
ant messages:batches results \
--message-batch-id msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d \
--transform '{custom\_id,"type":result.type,"error":result.error.error.type}' \
--format jsonl
```
```python Python
client = anthropic.Anthropic()
# Stream results file in memory-efficient chunks, processing one at a time
for result in client.messages.batches.results(
"msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d",
):
match result.result.type:
case "succeeded":
print(f"Success! {result.custom\_id}")
case "errored":
if result.result.error.error.type == "invalid\_request\_error":
# Request body must be fixed before re-sending request
print(f"Validation error {result.custom\_id}")
else:
# Request can be retried directly
print(f"Server error {result.custom\_id}")
case "expired":
print(f"Request expired {result.custom\_id}")
```
```typescript TypeScript
const client = new Anthropic();
// Stream results file in memory-efficient chunks, processing one at a time
for await (const result of await client.messages.batches.results(
"msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d"
)) {
switch (result.result.type) {
case "succeeded":
console.log(`Success! ${result.custom\_id}`);
break;
case "errored":
if (result.result.error.type === "invalid\_request\_error") {
// Request body must be fixed before re-sending request
console.log(`Validation error: ${result.custom\_id}`);
} else {
// Request can be retried directly
console.log(`Server error: ${result.custom\_id}`);
}
break;
case "expired":
console.log(`Request expired: ${result.custom\_id}`);
break;
}
}
```
```csharp C#
AnthropicClient client = new();
await foreach (var result in client.Messages.Batches.ResultsStreaming("msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d"))
{
switch (result.Result.Type)
{
case "succeeded":
Console.WriteLine($"Success! {result.CustomID}");
break;
case "errored":
if (result.Result.Error?.Type == "invalid\_request")
{
Console.WriteLine($"Validation error: {result.CustomID}");
}
else
{
Console.WriteLine($"Server error: {result.CustomID}");
}
break;
case "expired":
Console.WriteLine($"Request expired: {result.CustomID}");
break;
}
}
```
```go Go
client := anthropic.NewClient()
stream := client.Messages.Batches.ResultsStreaming(context.TODO(), "msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d")
for stream.Next() {
result := stream.Current()
switch variant := result.Result.AsAny().(type) {
case anthropic.MessageBatchSucceededResult:
fmt.Printf("Success! %s\n", result.CustomID)
case anthropic.MessageBatchErroredResult:
fmt.Printf("Error: %s - %s\n", result.CustomID, variant.Error.Error.Message)
case anthropic.MessageBatchExpiredResult:
fmt.Printf("Request expired: %s\n", result.CustomID)
}
}
if err := stream.Err(); err != nil {
log.Fatal(err)
}
```
```java Java
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.messages.batches.BatchResultsParams;
import com.anthropic.models.messages.batches.MessageBatchIndividualResponse;
// ...
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
// Stream results file in memory-efficient chunks, processing one at a time
try (
StreamResponse streamResponse = client
.messages()
.batches()
.resultsStreaming(
BatchResultsParams.builder()
.messageBatchId("msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d")
.build()
)
) {
streamResponse
.stream()
.forEach(result -> {
if (result.result().isSucceeded()) {
System.out.println("Success! " + result.customId());
} else if (result.result().isErrored()) {
if (result.result().asErrored().error().error().isInvalidRequestError()) {
// Request body must be fixed before re-sending request
System.out.println("Validation error: " + result.customId());
} else {
// Request can be retried directly
System.out.println("Server error: " + result.customId());
}
} else if (result.result().isExpired()) {
System.out.println("Request expired: " + result.customId());
}
});
}
```
```php PHP
$client = new Client();
foreach ($client->messages->batches->resultsStream(messageBatchID: 'msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d') as $result) {
switch ($result->result->type) {
case "succeeded":
echo "Success! {$result->customID}\n";
break;
case "errored":
if ($result->result->error->error->type === "invalid\_request\_error") {
echo "Validation error: {$result->customID}\n";
} else {
echo "Server error: {$result->customID}\n";
}
break;
case "expired":
echo "Request expired: {$result->customID}\n";
break;
}
}
```
```ruby Ruby
client = Anthropic::Client.new
client.messages.batches.results\_streaming("msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d").each do |result|
case result.result.type
when :succeeded
puts "Success! #{result.custom\_id}"
when :errored
if result.result.error.type == :invalid\_request
puts "Validation error: #{result.custom\_id}"
else
puts "Server error: #{result.custom\_id}"
end
when :expired
puts "Request expired: #{result.custom\_id}"
end
end
```
The results are in `.jsonl` format, where each line is a valid JSON object representing the result of a single request in the Message Batch. For each streamed result, you can do something different depending on its `custom\_id` and result type. Here is an example set of results:
```jsonl .jsonl file
{"custom\_id":"my-second-request","result":{"type":"succeeded","message":{"id":"msg\_014VwiXbi91y3JMjcpyGBHX5","type":"message","role":"assistant","model":"claude-opus-5","content":[{"type":"text","text":"Hello again! It's nice to see you. How can I assist you today? Is there anything specific you'd like to chat about or any questions you have?"}],"stop\_reason":"end\_turn","stop\_sequence":null,"usage":{"input\_tokens":11,"output\_tokens":36}}}}
{"custom\_id":"my-first-request","result":{"type":"succeeded","message":{"id":"msg\_01FqfsLoHwgeFbguDgpz48m7","type":"message","role":"assistant","model":"claude-opus-5","content":[{"type":"text","text":"Hello! How can I assist you today? Feel free to ask me any questions or let me know if there's anything you'd like to chat about."}],"stop\_reason":"end\_turn","stop\_sequence":null,"usage":{"input\_tokens":10,"output\_tokens":34}}}}
```
If your result has an error, its `result.error` will be set to the standard [error shape](/docs/en/api/errors#error-shapes).
\*\*Batch results may not match input order\*\*
Batch results can be returned in any order, and may not match the ordering of requests when the batch was created. In the preceding example, the result for the second batch request is returned before the first. To correctly match results with their corresponding requests, always use the `custom\_id` field.
### Canceling a Message Batch
You can cancel a Message Batch that is currently processing using the [cancel endpoint](/docs/en/api/canceling-message-batches). Immediately after cancellation, a batch's `processing\_status` will be `canceling`. You can use the same polling technique described earlier to wait until cancellation is finalized. Canceled batches end up with a status of `ended` and may contain partial results for requests that were processed before cancellation.
```bash cURL
#!/bin/sh
# ...
curl --request POST https://api.anthropic.com/v1/messages/batches/$MESSAGE\_BATCH\_ID/cancel \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01"
```
```bash CLI
#!/bin/bash
# ...
ant messages:batches cancel --message-batch-id "$MESSAGE\_BATCH\_ID"
```
```python Python
client = anthropic.Anthropic()
MESSAGE\_BATCH\_ID = "msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d"
message\_batch = client.messages.batches.cancel(
MESSAGE\_BATCH\_ID,
)
print(message\_batch)
```
```typescript TypeScript
const client = new Anthropic();
const messageBatch = await client.messages.batches.cancel(MESSAGE\_BATCH\_ID);
console.log(messageBatch);
```
```csharp C#
AnthropicClient client = new();
string messageBatchId = Environment.GetEnvironmentVariable("MESSAGE\_BATCH\_ID");
var messageBatch = await client.Messages.Batches.Cancel(messageBatchId);
Console.WriteLine(messageBatch);
```
```go Go
client := anthropic.NewClient()
messageBatchID := os.Getenv("MESSAGE\_BATCH\_ID")
messageBatch, err := client.Messages.Batches.Cancel(context.TODO(), messageBatchID)
if err != nil {
log.Fatal(err)
}
fmt.Println(messageBatch)
```
```java Java
import com.anthropic.models.messages.batches.\*;
// ...
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageBatch messageBatch = client
.messages()
.batches()
.cancel("msgbatch\_01HkcTjaV5uDC8jWR4ZsDV8d");
System.out.println(messageBatch);
```
```php PHP
$client = new Client();
$messageBatch = $client->messages->batches->cancel(
messageBatchID: 'msgbatch\_example\_id',
);
echo $messageBatch;
```
```ruby Ruby
client = Anthropic::Client.new
message\_batch\_id = ENV.fetch("MESSAGE\_BATCH\_ID")
message\_batch = client.messages.batches.cancel(message\_batch\_id)
puts message\_batch
```
The response shows the batch in a `canceling` state:
```json Output
{
"id": "msgbatch\_013Zva2CMHLNnXjNJJKqJ2EF",
"type": "message\_batch",
"processing\_status": "canceling",
"request\_counts": {
"processing": 2,
"succeeded": 0,
"errored": 0,
"canceled": 0,
"expired": 0
},
"ended\_at": null,
"created\_at": "2024-09-24T18:37:24.100435Z",
"expires\_at": "2024-09-25T18:37:24.100435Z",
"cancel\_initiated\_at": "2024-09-24T18:39:03.114875Z",
"results\_url": null
}
```
### Using prompt caching with Message Batches
The Message Batches API supports prompt caching, allowing you to potentially reduce costs and processing time for batch requests. The pricing discounts from prompt caching and Message Batches can stack, providing even greater cost savings when both features are used together. However, because batch requests are processed asynchronously and concurrently, cache hits are provided on a best-effort basis. Users typically experience cache hit rates ranging from 30% to 98%, depending on their traffic patterns.
To maximize the likelihood of cache hits in your batch requests:
1. Include identical `cache\_control` blocks in every Message request within your batch.
2. Maintain a steady stream of requests to prevent cache entries from expiring after their 5-minute lifetime.
3. Structure your requests to share as much cached content as possible.
Example of implementing prompt caching in a batch:
```bash cURL
curl https://api.anthropic.com/v1/messages/batches \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "content-type: application/json" \
--data \
'{
"requests": [
{
"custom\_id": "my-first-request",
"params": {
"model": "claude-opus-5",
"max\_tokens": 1024,
"system": [
{
"type": "text",
"text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
},
{
"type": "text",
"text": "",
"cache\_control": {"type": "ephemeral"}
}
],
"messages": [
{"role": "user", "content": "Analyze the major themes in Pride and Prejudice."}
]
}
},
{
"custom\_id": "my-second-request",
"params": {
"model": "claude-opus-5",
"max\_tokens": 1024,
"system": [
{
"type": "text",
"text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
},
{
"type": "text",
"text": "",
"cache\_control": {"type": "ephemeral"}
}
],
"messages": [
{"role": "user", "content": "Write a summary of Pride and Prejudice."}
]
}
}
]
}'
```
```bash CLI
ant messages:batches create <<'YAML'
requests:
- custom\_id: my-first-request
params:
model: claude-opus-5
max\_tokens: 1024
system:
- type: text
text: >
You are an AI assistant tasked with analyzing literary works. Your
goal is to provide insightful commentary on themes, characters, and
writing style.
- type: text
text: ""
cache\_control:
type: ephemeral
messages:
- role: user
content: Analyze the major themes in Pride and Prejudice.
- custom\_id: my-second-request
params:
model: claude-opus-5
max\_tokens: 1024
system:
- type: text
text: >
You are an AI assistant tasked with analyzing literary works. Your
goal is to provide insightful commentary on themes, characters, and
writing style.
- type: text
text: ""
cache\_control:
type: ephemeral
messages:
- role: user
content: Write a summary of Pride and Prejudice.
YAML
```
```python Python
from anthropic.types.message\_create\_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch\_create\_params import Request
client = anthropic.Anthropic()
message\_batch = client.messages.batches.create(
requests=[
Request(
custom\_id="my-first-request",
params=MessageCreateParamsNonStreaming(
model="claude-opus-5",
max\_tokens=1024,
system=[
{
"type": "text",
"text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
},
{
"type": "text",
"text": "",
"cache\_control": {"type": "ephemeral"},
},
],
messages=[
{
"role": "user",
"content": "Analyze the major themes in Pride and Prejudice.",
}
],
),
),
Request(
custom\_id="my-second-request",
params=MessageCreateParamsNonStreaming(
model="claude-opus-5",
max\_tokens=1024,
system=[
{
"type": "text",
"text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
},
{
"type": "text",
"text": "",
"cache\_control": {"type": "ephemeral"},
},
],
messages=[
{
"role": "user",
"content": "Write a summary of Pride and Prejudice.",
}
],
),
),
]
)
```
```typescript TypeScript
const client = new Anthropic();
const messageBatch = await client.messages.batches.create({
requests: [
{
custom\_id: "my-first-request",
params: {
model: "claude-opus-5",
max\_tokens: 1024,
system: [
{
type: "text",
text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
},
{
type: "text",
text: "",
cache\_control: { type: "ephemeral" }
}
],
messages: [
{ role: "user", content: "Analyze the major themes in Pride and Prejudice." }
]
}
},
{
custom\_id: "my-second-request",
params: {
model: "claude-opus-5",
max\_tokens: 1024,
system: [
{
type: "text",
text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
},
{
type: "text",
text: "",
cache\_control: { type: "ephemeral" }
}
],
messages: [{ role: "user", content: "Write a summary of Pride and Prejudice." }]
}
}
]
});
```
```csharp C#
using Anthropic;
using Anthropic.Models.Messages;
using Anthropic.Models.Messages.Batches;
AnthropicClient client = new()
{
ApiKey = Environment.GetEnvironmentVariable("ANTHROPIC\_API\_KEY")
};
var messageBatch = await client.Messages.Batches.Create(new BatchCreateParams
{
Requests =
[
new()
{
CustomID = "my-first-request",
Params = new()
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
System = new List
{
new()
{
Text = "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
},
new()
{
Text = "",
CacheControl = new()
}
},
Messages =
[
new() { Role = Role.User, Content = "Analyze the major themes in Pride and Prejudice." }
]
}
},
new()
{
CustomID = "my-second-request",
Params = new()
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
System = new List
{
new()
{
Text = "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
},
new()
{
Text = "",
CacheControl = new()
}
},
Messages =
[
new() { Role = Role.User, Content = "Write a summary of Pride and Prejudice." }
]
}
}
]
});
```
```go Go
client := anthropic.NewClient()
messageBatch, err := client.Messages.Batches.New(context.TODO(), anthropic.MessageBatchNewParams{
Requests: []anthropic.MessageBatchNewParamsRequest{
{
CustomID: "my-first-request",
Params: anthropic.MessageBatchNewParamsRequestParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
System: []anthropic.TextBlockParam{
{
Text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
},
{
Text: "",
CacheControl: anthropic.NewCacheControlEphemeralParam(),
},
},
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("Analyze the major themes in Pride and Prejudice.")),
},
},
},
{
CustomID: "my-second-request",
Params: anthropic.MessageBatchNewParamsRequestParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
System: []anthropic.TextBlockParam{
{
Text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
},
{
Text: "",
CacheControl: anthropic.NewCacheControlEphemeralParam(),
},
},
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("Write a summary of Pride and Prejudice.")),
},
},
},
},
})
if err != nil {
log.Fatal(err)
}
log.Printf("%+v\n", messageBatch)
```
```java Java
import com.anthropic.models.messages.CacheControlEphemeral;
// ...
import com.anthropic.models.messages.batches.\*;
// ...
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
BatchCreateParams createParams = BatchCreateParams.builder()
.addRequest(
BatchCreateParams.Request.builder()
.customId("my-first-request")
.params(
BatchCreateParams.Request.Params.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024)
.systemOfTextBlockParams(
List.of(
TextBlockParam.builder()
.text(
"You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
)
.build(),
TextBlockParam.builder()
.text("")
.cacheControl(CacheControlEphemeral.builder().build())
.build()
)
)
.addUserMessage("Analyze the major themes in Pride and Prejudice.")
.build()
)
.build()
)
.addRequest(
BatchCreateParams.Request.builder()
.customId("my-second-request")
.params(
BatchCreateParams.Request.Params.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024)
.systemOfTextBlockParams(
List.of(
TextBlockParam.builder()
.text(
"You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
)
.build(),
TextBlockParam.builder()
.text("")
.cacheControl(CacheControlEphemeral.builder().build())
.build()
)
)
.addUserMessage("Write a summary of Pride and Prejudice.")
.build()
)
.build()
)
.build();
MessageBatch messageBatch = client.messages().batches().create(createParams);
```
```php PHP
$client = new Client();
$messageBatch = $client->messages->batches->create(
requests: [
[
'custom\_id' => 'my-first-request',
'params' => [
'model' => 'claude-opus-5',
'max\_tokens' => 1024,
'system' => [
[
'type' => 'text',
'text' => 'You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n'
],
[
'type' => 'text',
'text' => '',
'cache\_control' => ['type' => 'ephemeral']
]
],
'messages' => [
['role' => 'user', 'content' => 'Analyze the major themes in Pride and Prejudice.']
]
]
],
[
'custom\_id' => 'my-second-request',
'params' => [
'model' => 'claude-opus-5',
'max\_tokens' => 1024,
'system' => [
[
'type' => 'text',
'text' => 'You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n'
],
[
'type' => 'text',
'text' => '',
'cache\_control' => ['type' => 'ephemeral']
]
],
'messages' => [
['role' => 'user', 'content' => 'Write a summary of Pride and Prejudice.']
]
]
]
],
);
```
```ruby Ruby
client = Anthropic::Client.new
message\_batch = client.messages.batches.create(
requests: [
{
custom\_id: "my-first-request",
params: {
model: "claude-opus-5",
max\_tokens: 1024,
system: [
{
type: "text",
text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
},
{
type: "text",
text: "",
cache\_control: { type: "ephemeral" }
}
],
messages: [
{ role: "user", content: "Analyze the major themes in Pride and Prejudice." }
]
}
},
{
custom\_id: "my-second-request",
params: {
model: "claude-opus-5",
max\_tokens: 1024,
system: [
{
type: "text",
text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
},
{
type: "text",
text: "",
cache\_control: { type: "ephemeral" }
}
],
messages: [
{ role: "user", content: "Write a summary of Pride and Prejudice." }
]
}
}
]
)
```
In this example, both requests in the batch include identical system messages and the full text of Pride and Prejudice marked with `cache\_control` to increase the likelihood of cache hits.
### Server tools and the agentic loop
All [server tools](/docs/en/agents-and-tools/tool-use/server-tools) (web search, web fetch, code execution, MCP connectors, advisor, and tool search) work in batch requests. The batch worker runs the same server-side agentic loop as the synchronous Messages API.
Because there is no open connection to maintain, the batch loop runs \*\*more iterations per turn\*\* than a synchronous request before it returns `stop\_reason: "pause\_turn"`. If a batch result comes back with `pause\_turn`, the turn did not finish; you can continue it by submitting the paused assistant content in a follow-up request (batch or synchronous) exactly as shown in the [pause\\_turn continuation pattern](/docs/en/agents-and-tools/tool-use/server-tools#the-server-side-loop-and-pause-turn).
The batch worker additionally throttles `web\_search` per organization so that highly concurrent batch processing does not exhaust your organization's web-search rate limit. The batch retries throttled requests automatically; you don't need to handle this yourself, but very large web-search batches might take longer to complete.
### Extended output (beta)
The `output-300k-2026-03-24` beta header raises the `max\_tokens` cap to 300,000 for batch requests using Claude Opus 5, Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, Claude Sonnet 5, or Claude Sonnet 4.6. Include the header to generate outputs far longer than the standard 128k `max\_tokens` limit in a single turn.
Extended output is available on the Message Batches API only, not the synchronous Messages API. It is supported on the Claude API and Claude Platform on AWS, and is not currently available on Amazon Bedrock, Google Cloud, or Microsoft Foundry.
Use extended output for long-form generation such as book-length drafts and technical documentation, exhaustive structured data extraction, large code-generation scaffolds, and long reasoning chains.
A single 300k-token generation can take over an hour to complete, so plan your batch submissions with the 24-hour processing window in mind. Standard batch pricing (50% of standard API prices) applies.
```bash cURL
curl https://api.anthropic.com/v1/messages/batches \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "anthropic-beta: output-300k-2026-03-24" \
--header "content-type: application/json" \
--data \
'{
"requests": [
{
"custom\_id": "long-form-request",
"params": {
"model": "claude-opus-5",
"max\_tokens": 300000,
"messages": [
{"role": "user", "content": "Write a comprehensive technical guide to building distributed systems, covering architecture patterns, consistency models, fault tolerance, and operational best practices."}
]
}
}
]
}'
```
```bash CLI
ant beta:messages:batches create --beta output-300k-2026-03-24 <<'YAML'
requests:
- custom\_id: long-form-request
params:
model: claude-opus-5
max\_tokens: 300000
messages:
- role: user
content: >-
Write a comprehensive technical guide to building distributed
systems, covering architecture patterns, consistency models,
fault tolerance, and operational best practices.
YAML
```
```python Python
from anthropic.types.beta.message\_create\_params import MessageCreateParamsNonStreaming
from anthropic.types.beta.messages.batch\_create\_params import Request
client = anthropic.Anthropic()
message\_batch = client.beta.messages.batches.create(
betas=["output-300k-2026-03-24"],
requests=[
Request(
custom\_id="long-form-request",
params=MessageCreateParamsNonStreaming(
model="claude-opus-5",
max\_tokens=300\_000,
messages=[
{
"role": "user",
"content": "Write a comprehensive technical guide to building distributed systems, covering architecture patterns, consistency models, fault tolerance, and operational best practices.",
}
],
),
),
],
)
print(message\_batch)
```
```typescript TypeScript
const client = new Anthropic();
const messageBatch = await client.beta.messages.batches.create({
betas: ["output-300k-2026-03-24"],
requests: [
{
custom\_id: "long-form-request",
params: {
model: "claude-opus-5",
max\_tokens: 300000,
messages: [
{
role: "user",
content:
"Write a comprehensive technical guide to building distributed systems, covering architecture patterns, consistency models, fault tolerance, and operational best practices."
}
]
}
}
]
});
console.log(messageBatch);
```
```csharp C#
using Anthropic;
using Anthropic.Models.Beta.Messages;
using Anthropic.Models.Beta.Messages.Batches;
using Model = Anthropic.Models.Messages.Model;
AnthropicClient client = new();
var batch = await client.Beta.Messages.Batches.Create(new BatchCreateParams
{
Betas = ["output-300k-2026-03-24"],
Requests =
[
new()
{
CustomID = "long-form-request",
Params = new()
{
Model = Model.ClaudeOpus5,
MaxTokens = 300\_000,
Messages =
[
new() { Role = Role.User, Content = "Write a comprehensive technical guide to building distributed systems, covering architecture patterns, consistency models, fault tolerance, and operational best practices." }
]
}
}
]
});
Console.WriteLine(batch);
```
```go Go
client := anthropic.NewClient()
batch, err := client.Beta.Messages.Batches.New(context.Background(),
anthropic.BetaMessageBatchNewParams{
Betas: []anthropic.AnthropicBeta{"output-300k-2026-03-24"},
Requests: []anthropic.BetaMessageBatchNewParamsRequest{
{
CustomID: "long-form-request",
Params: anthropic.BetaMessageBatchNewParamsRequestParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 300\_000,
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(
anthropic.NewBetaTextBlock("Write a comprehensive technical guide to building distributed systems, covering architecture patterns, consistency models, fault tolerance, and operational best practices."),
),
},
},
},
},
})
if err != nil {
panic(err)
}
fmt.Println(batch.ID)
```
```java Java
import com.anthropic.models.beta.messages.batches.\*;
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
BatchCreateParams params = BatchCreateParams.builder()
.addBeta("output-300k-2026-03-24")
.addRequest(
BatchCreateParams.Request.builder()
.customId("long-form-request")
.params(
BatchCreateParams.Request.Params.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(300\_000L)
.addUserMessage("Write a comprehensive technical guide to building distributed systems, covering architecture patterns, consistency models, fault tolerance, and operational best practices.")
.build()
)
.build()
)
.build();
BetaMessageBatch messageBatch = client.beta().messages().batches().create(params);
IO.println(messageBatch);
}
```
```php PHP
$client = new Client();
$batch = $client->beta->messages->batches->create(
betas: ['output-300k-2026-03-24'],
requests: [
[
'custom\_id' => 'long-form-request',
'params' => [
'model' => 'claude-opus-5',
'max\_tokens' => 300\_000,
'messages' => [
['role' => 'user', 'content' => 'Write a comprehensive technical guide to building distributed systems, covering architecture patterns, consistency models, fault tolerance, and operational best practices.']
]
]
]
],
);
echo $batch->id;
```
```ruby Ruby
client = Anthropic::Client.new
batch = client.beta.messages.batches.create(
betas: ["output-300k-2026-03-24"],
requests: [
{
custom\_id: "long-form-request",
params: {
model: "claude-opus-5",
max\_tokens: 300\_000,
messages: [
{ role: "user", content: "Write a comprehensive technical guide to building distributed systems, covering architecture patterns, consistency models, fault tolerance, and operational best practices." }
]
}
}
]
)
puts batch
```
### Best practices for effective batching
To get the most out of the Batches API:
\* Monitor batch processing status regularly and implement appropriate retry logic for failed requests.
\* Use meaningful `custom\_id` values to easily match results with requests, since order is not guaranteed.
\* Consider breaking very large datasets into multiple batches for better manageability.
\* Dry run a single request shape with the Messages API to avoid validation errors.
### Troubleshooting common issues
If experiencing unexpected behavior:
\* Verify that the total batch request size doesn't exceed 256 MB. If the request size is too large, you may get a 413 `request\_too\_large` error.
\* Check that you're using [supported models](#supported-models) for all requests in the batch.
\* Ensure each request in the batch has a unique `custom\_id`.
\* Ensure that it has been less than 29 days since batch `created\_at` (not processing `ended\_at`) time. If over 29 days have passed, results will no longer be viewable.
\* Confirm that the batch has not been canceled.
Note that the failure of one request in a batch does not affect the processing of other requests.
## Batch storage and privacy
\* \*\*Workspace isolation\*\*: Batches are isolated within the Workspace they are created in. They can only be accessed by API keys associated with that Workspace, or users with permission to view Workspace batches in the Console.
\* \*\*Result availability\*\*: Batch results are available for 29 days after the batch is created, allowing ample time for retrieval and processing.
## Data retention
Batch processing stores request and response data for up to 29 days after batch creation. You can delete a message batch at any time after processing using the `DELETE /v1/messages/batches/{batch\_id}` endpoint. To delete an in-progress batch, cancel it first. Asynchronous processing requires server-side storage of both inputs and outputs until batch completion and result retrieval.
For ZDR eligibility across all features, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
## FAQ

Batches may take up to 24 hours for processing, but many finish sooner. Actual processing time depends on the size of the batch, current demand, and your request volume. It is possible for a batch to expire and not complete within 24 hours.

See [Supported models](#supported-models) for the list of supported models.

Yes, the Message Batches API supports nearly all features available in the Messages API, including most beta features. A small number of parameters (`stream`, `speed`, `store`, `previous\_thread\_event\_id`, `cache\_hint`, `context\_hint`, `max\_tokens: 0`, and `research\_preview\_2026\_02`) are not supported. See [What can be batched](#what-can-be-batched) for the full list.

The Message Batches API offers a 50% discount on all usage compared to standard API prices. This applies to input tokens, output tokens, and any special tokens. For more on pricing, visit the [pricing page](https://claude.com/pricing#anthropic-api).

No, once a batch has been submitted, it cannot be modified. If you need to make changes, you should cancel the current batch and submit a new one. Note that cancellation may not take immediate effect.

The Message Batches API has HTTP requests-based rate limits in addition to limits on the number of requests in need of processing. See [Message Batches API rate limits](/docs/en/api/rate-limits#message-batches-api). Usage of the Batches API does not affect rate limits in the Messages API.

When you retrieve the results, each request has a `result` field indicating whether it `succeeded`, `errored`, was `canceled`, or `expired`. For `errored` results, additional error information is provided. View the error response object in the [API reference](/docs/en/api/messages/batches/create).

The Message Batches API is designed with strong privacy and data separation measures:
1. Batches and their results are isolated within the Workspace in which they were created. This means they can only be accessed by API keys from that same Workspace.
2. Each request within a batch is processed independently, with no data leakage between requests.
3. Results are only available for a limited time (29 days), and follow Anthropic's [data retention policy](https://support.claude.com/en/articles/7996866-how-long-do-you-store-personal-data).
4. Downloading batch results in the Console can be disabled on the organization-level or on a per-workspace basis.

Yes, it is possible to use prompt caching with Message Batches API. However, because asynchronous batch requests can be processed concurrently and in any order, cache hits are provided on a best-effort basis.
## Next steps

Enable natural citations for RAG applications by providing search results with source attribution.

Reduce cost and latency by caching prompt prefixes shared across requests in a batch.
