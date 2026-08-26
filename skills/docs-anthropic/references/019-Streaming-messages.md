# Streaming messages

Source: https://platform.claude.com/docs/en/build-with-claude/streaming.md

# Streaming messages
Stream Messages API responses incrementally with server-sent events, including text, tool use, and extended thinking deltas.
---
When creating a Message, you can set `"stream": true` to incrementally stream the response using [server-sent events](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents) (SSE).
## Streaming with SDKs
The [Python SDK](https://github.com/anthropics/anthropic-sdk-python) and [TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript) offer multiple ways of streaming. The [PHP SDK](https://github.com/anthropics/anthropic-sdk-php) provides streaming through `createStream()`. The Python SDK allows both sync and async streams. See the documentation in each SDK for details.
```bash CLI
ant messages create --stream --format jsonl \
--model claude-opus-5 \
--max-tokens 1024 \
--message '{role: user, content: "Hello"}' \
| jq -rj 'select(.delta.type? == "text\_delta") | .delta.text'
```
```python Python
client = anthropic.Anthropic()
with client.messages.stream(
max\_tokens=1024,
messages=[{"role": "user", "content": "Hello"}],
model="claude-opus-5",
) as stream:
for text in stream.text\_stream:
print(text, end="", flush=True)
```
```typescript TypeScript
const client = new Anthropic();
await client.messages
.stream({
messages: [{ role: "user", content: "Hello" }],
model: "claude-opus-5",
max\_tokens: 1024
})
.on("text", (text) => {
console.log(text);
});
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Messages = [new() { Role = Role.User, Content = "Hello" }]
};
await foreach (var msg in client.Messages.CreateStreaming(parameters))
{
Console.Write(msg);
}
```
```go Go
client := anthropic.NewClient()
stream := client.Messages.NewStreaming(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("Hello")),
},
})
for stream.Next() {
event := stream.Current()
switch eventVariant := event.AsAny().(type) {
case anthropic.ContentBlockDeltaEvent:
switch deltaVariant := eventVariant.Delta.AsAny().(type) {
case anthropic.TextDelta:
fmt.Print(deltaVariant.Text)
}
}
}
if err := stream.Err(); err != nil {
log.Fatal(err)
}
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addUserMessage("Hello")
.build();
try (var streamResponse = client.messages().createStreaming(params)) {
streamResponse.stream().forEach(event -> {
event.contentBlockDelta().ifPresent(deltaEvent ->
deltaEvent.delta().text().ifPresent(td ->
System.out.print(td.text())
)
);
});
}
```
```php PHP
$client = new Client();
$stream = $client->messages->createStream(
maxTokens: 1024,
messages: [
['role' => 'user', 'content' => 'Hello']
],
model: 'claude-opus-5',
);
foreach ($stream as $message) {
echo $message;
}
```
```ruby Ruby
client = Anthropic::Client.new
stream = client.messages.stream(
model: "claude-opus-5",
max\_tokens: 1024,
messages: [{ role: "user", content: "Hello" }]
)
stream.text.each { |text| print(text) }
```
## Get the final message without handling events
If you don't need to process text as it arrives, the SDKs provide a way to use streaming internally while returning the complete `Message` object, identical to what `.create()` returns. This is especially useful for requests with large `max\_tokens` values, where the SDKs require streaming to avoid HTTP timeouts.
```bash CLI
# The ant CLI's --stream flag emits one event per line and does not
# accumulate into a final Message. For long generations, stream the
# raw events:
ant messages create --stream --format jsonl <<'YAML'
model: claude-opus-5
max\_tokens: 128000
messages:
- role: user
content: Write a detailed analysis...
YAML
```
```python Python
client = anthropic.Anthropic()
with client.messages.stream(
max\_tokens=128000,
messages=[{"role": "user", "content": "Write a detailed analysis..."}],
model="claude-opus-5",
) as stream:
message = stream.get\_final\_message()
for block in message.content:
if block.type == "text":
print(block.text)
```
```typescript TypeScript
const client = new Anthropic();
const stream = client.messages.stream({
max\_tokens: 128000,
messages: [{ role: "user", content: "Write a detailed analysis..." }],
model: "claude-opus-5"
});
const message = await stream.finalMessage();
const textBlock = message.content.find((block) => block.type === "text");
if (textBlock && textBlock.type === "text") {
console.log(textBlock.text);
}
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 128000,
Messages = [new() { Role = Role.User, Content = "Write a detailed analysis..." }]
};
var fullText = "";
await foreach (var msg in client.Messages.CreateStreaming(parameters))
{
fullText += msg;
}
Console.WriteLine(fullText);
```
```go Go
client := anthropic.NewClient()
stream := client.Messages.NewStreaming(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 128000,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("Write a detailed analysis...")),
},
})
message := anthropic.Message{}
for stream.Next() {
event := stream.Current()
if err := message.Accumulate(event); err != nil {
log.Fatal(err)
}
}
if err := stream.Err(); err != nil {
log.Fatal(err)
}
for \_, block := range message.Content {
if textBlock, ok := block.AsAny().(anthropic.TextBlock); ok {
fmt.Println(textBlock.Text)
}
}
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(128000L)
.addUserMessage("Write a detailed analysis...")
.build();
MessageAccumulator accumulator = MessageAccumulator.create();
try (var streamResponse = client.messages().createStreaming(params)) {
streamResponse.stream().forEach(accumulator::accumulate);
}
Message message = accumulator.message();
message.content().stream()
.flatMap(block -> block.text().stream())
.forEach(textBlock -> System.out.println(textBlock.text()));
```
```php PHP
$client = new Client();
$stream = $client->messages->createStream(
maxTokens: 128000,
messages: [
['role' => 'user', 'content' => 'Write a detailed analysis...']
],
model: 'claude-opus-5',
);
$fullText = '';
foreach ($stream as $event) {
if ($event->type === 'content\_block\_delta' && $event->delta->type === 'text\_delta') {
$fullText .= $event->delta->text;
}
}
echo $fullText;
```
```ruby Ruby
client = Anthropic::Client.new
message = client.messages.stream(
model: "claude-opus-5",
max\_tokens: 128000,
messages: [{ role: "user", content: "Write a detailed analysis..." }]
).accumulated\_message
message.content.each do |block|
puts block.text if block.type == :text
end
```
The `.stream()` call keeps the HTTP connection alive with server-sent events, then `.get\_final\_message()` (Python) or `.finalMessage()` (TypeScript) accumulates all events and returns the complete `Message` object. In Go, you call `message.Accumulate(event)` inside the stream loop to build the same complete `Message`. In Java, use `MessageAccumulator.create()` and call `accumulator.accumulate(event)` on each event. In C#, await the stream's `.Aggregate()` extension method to get the complete `Message`, or pass a `MessageContentAggregator` to `.CollectAsync()` to aggregate while handling events. In Ruby, call `.accumulated\_message` on the stream. In the PHP SDK, you iterate over stream events manually to accumulate the response.
## Event types
Each server-sent event includes a named event type and associated JSON data. Each event uses an SSE event name (for example, `event: message\_stop`), and includes the matching event `type` in its data.
Each stream uses the following event flow:
1. `message\_start`: contains a `Message` object with empty `content`.
2. A series of content blocks, each of which has a `content\_block\_start`, one or more `content\_block\_delta` events, and a `content\_block\_stop` event. Each content block has an `index` that corresponds to its index in the final Message `content` array. One exception: during [server-side fallback](/docs/en/build-with-claude/refusals-and-fallback#server-side-fallback) responses, a `fallback` content block arrives at each model boundary as a `content\_block\_start` and `content\_block\_stop` pair with no deltas in between.
3. One or more `message\_delta` events, indicating top-level changes to the final `Message` object.
4. A final `message\_stop` event.
The token counts shown in the `usage` field of the `message\_delta` event are \*cumulative\*.
### Ping events
Event streams may also include any number of `ping` events.
### Error events
The API may occasionally send [errors](/docs/en/api/errors) in the event stream. For example, during periods of high usage, you may receive an `overloaded\_error`, which would normally correspond to an HTTP 529 in a non-streaming context:
```sse Example error
event: error
data: {"type": "error", "error": {"type": "overloaded\_error", "message": "Overloaded"}}
```
### Other events
In accordance with the [versioning policy](/docs/en/api/versioning), new event types may be added, and your code should handle unknown event types gracefully.
## Content block delta types
Each `content\_block\_delta` event contains a `delta` of a type that updates the `content` block at a given `index`.
### Text delta
A `text` content block delta looks like:
```sse Text delta
event: content\_block\_delta
data: {"type": "content\_block\_delta","index": 0,"delta": {"type": "text\_delta", "text": "ello frien"}}
```
### Input JSON delta
The deltas for `tool\_use` content blocks correspond to updates for the `input` field of the block. To support maximum granularity, the deltas are \*partial JSON strings\*, whereas the final `tool\_use.input` is always an \*object\*.
You can accumulate the string deltas and parse the JSON once you receive a `content\_block\_stop` event, by using a library like [Pydantic](https://docs.pydantic.dev/latest/concepts/json/#partial-json-parsing) to do partial JSON parsing, or by using the [SDKs](/docs/en/cli-sdks-libraries/overview), which provide helpers to access parsed incremental values.
A `tool\_use` content block delta looks like:
```sse Input JSON delta
event: content\_block\_delta
data: {"type": "content\_block\_delta","index": 1,"delta": {"type": "input\_json\_delta","partial\_json": "{\"location\": \"San Fra"}}}
```
Note: Current models only support emitting one complete key and value property from `input` at a time. As such, when using tools, there may be delays between streaming events while the model is working. Once an `input` key and value are accumulated, they are emitted as multiple `content\_block\_delta` events with chunked partial JSON so that the format can automatically support finer granularity in future models.
### Thinking delta
When using [thinking](/docs/en/build-with-claude/thinking#streaming-thinking) with streaming enabled, you'll receive thinking content through `thinking\_delta` events. These deltas correspond to the `thinking` field of the `thinking` content blocks.
For thinking content, a special `signature\_delta` event is sent just before the `content\_block\_stop` event. This signature is used to verify the integrity of the thinking block.
When `display: "omitted"` is set on the thinking configuration, no `thinking\_delta` events are sent. The thinking block opens, receives a single `signature\_delta`, and closes. See [Controlling thinking display](/docs/en/build-with-claude/thinking#controlling-thinking-display).
A typical thinking delta looks like:
```sse Thinking delta
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 0, "delta": {"type": "thinking\_delta", "thinking": "I need to find the GCD of 1071 and 462 using the Euclidean algorithm.\n\n1071 = 2 × 462 + 147"}}
```
The signature delta looks like:
```sse Signature delta
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 0, "delta": {"type": "signature\_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}
```
## Full HTTP stream response
Use the [client SDKs](/docs/en/cli-sdks-libraries/overview) when using streaming mode. However, if you are building a direct API integration, you need to handle these events yourself.
A stream response consists of:
1. A `message\_start` event
2. Potentially multiple content blocks, each of which contains:
\* A `content\_block\_start` event
\* Potentially multiple `content\_block\_delta` events
\* A `content\_block\_stop` event
3. One or more `message\_delta` events
4. A `message\_stop` event
There may be `ping` events dispersed throughout the response as well. See [Event types](#event-types) for more details on the format.
### Basic streaming request
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-d '{
"model": "claude-opus-5",
"messages": [{"role": "user", "content": "Hello"}],
"max\_tokens": 256,
"stream": true
}'
```
```bash CLI
ant messages create --stream --format jsonl \
--model claude-opus-5 \
--max-tokens 256 \
--message '{role: user, content: Hello}'
```
```python Python
client = anthropic.Anthropic()
with client.messages.stream(
model="claude-opus-5",
messages=[{"role": "user", "content": "Hello"}],
max\_tokens=256,
) as stream:
for text in stream.text\_stream:
print(text, end="", flush=True)
```
```typescript TypeScript
const client = new Anthropic();
const stream = client.messages.stream({
model: "claude-opus-5",
messages: [{ role: "user", content: "Hello" }],
max\_tokens: 256
});
for await (const event of stream) {
if (event.type === "content\_block\_delta" && event.delta.type === "text\_delta") {
process.stdout.write(event.delta.text);
}
}
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 256,
Messages = [new() { Role = Role.User, Content = "Hello" }]
};
await foreach (var msg in client.Messages.CreateStreaming(parameters))
{
Console.Write(msg);
}
```
```go Go
client := anthropic.NewClient()
stream := client.Messages.NewStreaming(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 256,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("Hello")),
},
})
for stream.Next() {
event := stream.Current()
switch eventVariant := event.AsAny().(type) {
case anthropic.ContentBlockDeltaEvent:
switch deltaVariant := eventVariant.Delta.AsAny().(type) {
case anthropic.TextDelta:
fmt.Print(deltaVariant.Text)
}
}
}
if err := stream.Err(); err != nil {
log.Fatal(err)
}
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(256L)
.addUserMessage("Hello")
.build();
try (var streamResponse = client.messages().createStreaming(params)) {
streamResponse.stream().forEach(event -> {
event.contentBlockDelta().ifPresent(deltaEvent ->
deltaEvent.delta().text().ifPresent(td ->
System.out.print(td.text())
)
);
});
}
```
```php PHP
$client = new Client();
$stream = $client->messages->createStream(
maxTokens: 256,
messages: [
['role' => 'user', 'content' => 'Hello']
],
model: 'claude-opus-5',
);
foreach ($stream as $message) {
echo $message;
}
```
```ruby Ruby
client = Anthropic::Client.new
stream = client.messages.stream(
model: "claude-opus-5",
messages: [{ role: "user", content: "Hello" }],
max\_tokens: 256
)
stream.text.each { |text| print(text) }
```
```sse Response
event: message\_start
data: {"type": "message\_start", "message": {"id": "msg\_1nZdL29xx5MUA1yADyHTEsnR8uuvGzszyY", "type": "message", "role": "assistant", "content": [], "model": "claude-opus-5", "stop\_reason": null, "stop\_sequence": null, "usage": {"input\_tokens": 25, "output\_tokens": 1}}}
event: content\_block\_start
data: {"type": "content\_block\_start", "index": 0, "content\_block": {"type": "text", "text": ""}}
event: ping
data: {"type": "ping"}
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 0, "delta": {"type": "text\_delta", "text": "Hello"}}
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 0, "delta": {"type": "text\_delta", "text": "!"}}
event: content\_block\_stop
data: {"type": "content\_block\_stop", "index": 0}
event: message\_delta
data: {"type": "message\_delta", "delta": {"stop\_reason": "end\_turn", "stop\_sequence":null}, "usage": {"output\_tokens": 15}}
event: message\_stop
data: {"type": "message\_stop"}
```
### Streaming request with tool use
Tool use supports [fine-grained streaming](/docs/en/agents-and-tools/tool-use/fine-grained-tool-streaming) for parameter values. Enable it per tool with `eager\_input\_streaming`.
This request asks Claude to use a tool to report the weather.
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"tools": [
{
"name": "get\_weather",
"description": "Get the current weather in a given location",
"input\_schema": {
"type": "object",
"properties": {
"location": {
"type": "string",
"description": "The city and state, e.g. San Francisco, CA"
}
},
"required": ["location"]
}
}
],
"tool\_choice": {"type": "any"},
"messages": [
{
"role": "user",
"content": "What is the weather like in San Francisco?"
}
],
"stream": true
}'
```
```bash CLI
ant messages create --stream --format jsonl <<'YAML'
model: claude-opus-5
max\_tokens: 1024
tools:
- name: get\_weather
description: Get the current weather in a given location
input\_schema:
type: object
properties:
location:
type: string
description: The city and state, e.g. San Francisco, CA
required:
- location
tool\_choice:
type: any
messages:
- role: user
content: What is the weather like in San Francisco?
YAML
```
```python Python
client = anthropic.Anthropic()
tools = [
{
"name": "get\_weather",
"description": "Get the current weather in a given location",
"input\_schema": {
"type": "object",
"properties": {
"location": {
"type": "string",
"description": "The city and state, e.g. San Francisco, CA",
}
},
"required": ["location"],
},
}
]
with client.messages.stream(
model="claude-opus-5",
max\_tokens=1024,
tools=tools,
tool\_choice={"type": "any"},
messages=[
{"role": "user", "content": "What is the weather like in San Francisco?"}
],
) as stream:
for text in stream.text\_stream:
print(text, end="", flush=True)
```
```typescript TypeScript
const client = new Anthropic();
const tools: Anthropic.Tool[] = [
{
name: "get\_weather",
description: "Get the current weather in a given location",
input\_schema: {
type: "object",
properties: {
location: {
type: "string",
description: "The city and state, e.g. San Francisco, CA"
}
},
required: ["location"]
}
}
];
const stream = client.messages.stream({
model: "claude-opus-5",
max\_tokens: 1024,
tools: tools,
tool\_choice: { type: "any" },
messages: [
{
role: "user",
content: "What is the weather like in San Francisco?"
}
]
});
for await (const event of stream) {
if (event.type === "content\_block\_delta" && event.delta.type === "text\_delta") {
process.stdout.write(event.delta.text);
}
}
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Tools = [
new ToolUnion(new Tool()
{
Name = "get\_weather",
Description = "Get the current weather in a given location",
InputSchema = new InputSchema()
{
Properties = new Dictionary
{
["location"] = JsonSerializer.SerializeToElement(new { type = "string", description = "The city and state, e.g. San Francisco, CA" }),
},
Required = ["location"],
},
}),
],
ToolChoice = new ToolChoiceAny(),
Messages = [
new() { Role = Role.User, Content = "What is the weather like in San Francisco?" }
]
};
await foreach (var msg in client.Messages.CreateStreaming(parameters))
{
Console.Write(msg);
}
```
```go Go
client := anthropic.NewClient()
stream := client.Messages.NewStreaming(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Tools: []anthropic.ToolUnionParam{
{OfTool: &anthropic.ToolParam{
Name: "get\_weather",
Description: anthropic.String("Get the current weather in a given location"),
InputSchema: anthropic.ToolInputSchemaParam{
Properties: map[string]any{
"location": map[string]any{
"type": "string",
"description": "The city and state, e.g. San Francisco, CA",
},
},
Required: []string{"location"},
},
}},
},
ToolChoice: anthropic.ToolChoiceUnionParam{OfAny: &anthropic.ToolChoiceAnyParam{}},
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("What is the weather like in San Francisco?")),
},
})
for stream.Next() {
event := stream.Current()
switch eventVariant := event.AsAny().(type) {
case anthropic.ContentBlockDeltaEvent:
switch deltaVariant := eventVariant.Delta.AsAny().(type) {
case anthropic.TextDelta:
fmt.Print(deltaVariant.Text)
}
}
}
if err := stream.Err(); err != nil {
log.Fatal(err)
}
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addTool(Tool.builder()
.name("get\_weather")
.description("Get the current weather in a given location")
.inputSchema(Tool.InputSchema.builder()
.properties(JsonValue.from(Map.of(
"location", Map.of(
"type", "string",
"description", "The city and state, e.g. San Francisco, CA"
)
)))
.putAdditionalProperty("required", JsonValue.from(List.of("location")))
.build())
.build())
.toolChoice(ToolChoice.ofAny(ToolChoiceAny.builder().build()))
.addUserMessage("What is the weather like in San Francisco?")
.build();
try (var streamResponse = client.messages().createStreaming(params)) {
streamResponse.stream().forEach(event -> {
event.contentBlockDelta().ifPresent(deltaEvent ->
deltaEvent.delta().text().ifPresent(td ->
System.out.print(td.text())
)
);
});
}
```
```php PHP
$client = new Client();
$stream = $client->messages->createStream(
maxTokens: 1024,
messages: [
['role' => 'user', 'content' => 'What is the weather like in San Francisco?']
],
model: 'claude-opus-5',
toolChoice: ['type' => 'any'],
tools: [
[
'name' => 'get\_weather',
'description' => 'Get the current weather in a given location',
'input\_schema' => [
'type' => 'object',
'properties' => [
'location' => [
'type' => 'string',
'description' => 'The city and state, e.g. San Francisco, CA'
]
],
'required' => ['location']
]
]
],
);
foreach ($stream as $message) {
echo $message;
}
```
```ruby Ruby
client = Anthropic::Client.new
tools = [
{
name: "get\_weather",
description: "Get the current weather in a given location",
input\_schema: {
type: "object",
properties: {
location: {
type: "string",
description: "The city and state, e.g. San Francisco, CA"
}
},
required: ["location"]
}
}
]
stream = client.messages.stream(
model: "claude-opus-5",
max\_tokens: 1024,
tools: tools,
tool\_choice: { type: "any" },
messages: [
{ role: "user", content: "What is the weather like in San Francisco?" }
]
)
stream.text.each { |text| print(text) }
```
```sse Response
event: message\_start
data: {"type":"message\_start","message":{"id":"msg\_014p7gG3wDgGV9EUtLvnow3U","type":"message","role":"assistant","model":"claude-opus-5","stop\_sequence":null,"usage":{"input\_tokens":472,"output\_tokens":2},"content":[],"stop\_reason":null}}
event: content\_block\_start
data: {"type":"content\_block\_start","index":0,"content\_block":{"type":"text","text":""}}
event: ping
data: {"type": "ping"}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":"Okay"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":","}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":" let"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":"'s"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":" check"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":" the"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":" weather"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":" for"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":" San"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":" Francisco"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":","}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":" CA"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":":"}}
event: content\_block\_stop
data: {"type":"content\_block\_stop","index":0}
event: content\_block\_start
data: {"type":"content\_block\_start","index":1,"content\_block":{"type":"tool\_use","id":"toolu\_01T1x1fJ34qAmk2tNTrN7Up6","name":"get\_weather","input":{}}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":1,"delta":{"type":"input\_json\_delta","partial\_json":""}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":1,"delta":{"type":"input\_json\_delta","partial\_json":"{\"location\":"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":1,"delta":{"type":"input\_json\_delta","partial\_json":" \"San"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":1,"delta":{"type":"input\_json\_delta","partial\_json":" Francisc"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":1,"delta":{"type":"input\_json\_delta","partial\_json":"o,"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":1,"delta":{"type":"input\_json\_delta","partial\_json":" CA\"}"}}
event: content\_block\_stop
data: {"type":"content\_block\_stop","index":1}
event: message\_delta
data: {"type":"message\_delta","delta":{"stop\_reason":"tool\_use","stop\_sequence":null},"usage":{"output\_tokens":89}}
event: message\_stop
data: {"type":"message\_stop"}
```
### Streaming request with thinking
This request enables thinking with streaming. The `display: "summarized"` setting streams a condensed summary of Claude's reasoning rather than the full chain of thought.
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 20000,
"stream": true,
"thinking": {
"type": "adaptive",
"display": "summarized"
},
"messages": [
{
"role": "user",
"content": "What is the greatest common divisor of 1071 and 462?"
}
]
}'
```
```bash CLI
ant messages create --stream --format jsonl \
--model claude-opus-5 \
--max-tokens 20000 \
--thinking '{type: adaptive, display: summarized}' \
--message '{role: user, content: What is the greatest common divisor of 1071 and 462?}'
```
```python Python
client = anthropic.Anthropic()
with client.messages.stream(
model="claude-opus-5",
max\_tokens=20000,
thinking={"type": "adaptive", "display": "summarized"},
messages=[
{
"role": "user",
"content": "What is the greatest common divisor of 1071 and 462?",
}
],
) as stream:
for event in stream:
if event.type == "content\_block\_delta":
if event.delta.type == "thinking\_delta":
print(event.delta.thinking, end="", flush=True)
elif event.delta.type == "text\_delta":
print(event.delta.text, end="", flush=True)
```
```typescript TypeScript
const client = new Anthropic();
const stream = client.messages.stream({
model: "claude-opus-5",
max\_tokens: 20000,
thinking: { type: "adaptive", display: "summarized" },
messages: [
{
role: "user",
content: "What is the greatest common divisor of 1071 and 462?"
}
]
});
for await (const event of stream) {
if (event.type === "content\_block\_delta") {
if (event.delta.type === "thinking\_delta") {
process.stdout.write(event.delta.thinking);
} else if (event.delta.type === "text\_delta") {
process.stdout.write(event.delta.text);
}
}
}
```
```csharp C#
using Anthropic;
using Anthropic.Models.Messages;
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 20000,
Thinking = new ThinkingConfigAdaptive { Display = Display.Summarized },
Messages = [new() { Role = Role.User, Content = "What is the greatest common divisor of 1071 and 462?" }]
};
await foreach (var msg in client.Messages.CreateStreaming(parameters))
{
Console.Write(msg);
}
```
```go Go
client := anthropic.NewClient()
stream := client.Messages.NewStreaming(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 20000,
Thinking: anthropic.ThinkingConfigParamUnion{
OfAdaptive: &anthropic.ThinkingConfigAdaptiveParam{
Display: anthropic.ThinkingConfigAdaptiveDisplaySummarized,
},
},
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("What is the greatest common divisor of 1071 and 462?")),
},
})
for stream.Next() {
event := stream.Current()
switch eventVariant := event.AsAny().(type) {
case anthropic.ContentBlockDeltaEvent:
switch deltaVariant := eventVariant.Delta.AsAny().(type) {
case anthropic.ThinkingDelta:
fmt.Print(deltaVariant.Thinking)
case anthropic.TextDelta:
fmt.Print(deltaVariant.Text)
}
}
}
if err := stream.Err(); err != nil {
log.Fatal(err)
}
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(20000L)
.thinking(ThinkingConfigAdaptive.builder()
.display(ThinkingConfigAdaptive.Display.SUMMARIZED)
.build())
.addUserMessage("What is the greatest common divisor of 1071 and 462?")
.build();
try (var streamResponse = client.messages().createStreaming(params)) {
streamResponse.stream().forEach(event -> {
event.contentBlockDelta().ifPresent(deltaEvent -> {
deltaEvent.delta().thinking().ifPresent(td ->
IO.print(td.thinking())
);
deltaEvent.delta().text().ifPresent(td ->
IO.print(td.text())
);
});
});
}
```
```php PHP
$client = new Client();
$stream = $client->messages->createStream(
maxTokens: 20000,
messages: [
['role' => 'user', 'content' => 'What is the greatest common divisor of 1071 and 462?']
],
model: 'claude-opus-5',
thinking: ['type' => 'adaptive', 'display' => 'summarized'],
);
foreach ($stream as $message) {
echo $message;
}
```
```ruby Ruby
client = Anthropic::Client.new
stream = client.messages.stream(
model: "claude-opus-5",
max\_tokens: 20000,
thinking: { type: "adaptive", display: "summarized" },
messages: [
{ role: "user", content: "What is the greatest common divisor of 1071 and 462?" }
]
)
stream.each do |event|
if event.type == :content\_block\_delta
if event.delta.type == :thinking\_delta
print(event.delta.thinking)
elsif event.delta.type == :text\_delta
print(event.delta.text)
end
end
end
```
```sse Response
event: message\_start
data: {"type": "message\_start", "message": {"id": "msg\_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-opus-5", "stop\_reason": null, "stop\_sequence": null}}
event: content\_block\_start
data: {"type": "content\_block\_start", "index": 0, "content\_block": {"type": "thinking", "thinking": "", "signature": ""}}
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 0, "delta": {"type": "thinking\_delta", "thinking": "I need to find the GCD of 1071 and 462 using the Euclidean algorithm.\n\n1071 = 2 × 462 + 147"}}
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 0, "delta": {"type": "thinking\_delta", "thinking": "\n462 = 3 × 147 + 21"}}
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 0, "delta": {"type": "thinking\_delta", "thinking": "\n147 = 7 × 21 + 0"}}
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 0, "delta": {"type": "thinking\_delta", "thinking": "\nThe remainder is 0, so GCD(1071, 462) = 21."}}
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 0, "delta": {"type": "signature\_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}
event: content\_block\_stop
data: {"type": "content\_block\_stop", "index": 0}
event: content\_block\_start
data: {"type": "content\_block\_start", "index": 1, "content\_block": {"type": "text", "text": ""}}
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 1, "delta": {"type": "text\_delta", "text": "The greatest common divisor of 1071 and 462 is \*\*21\*\*."}}
event: content\_block\_stop
data: {"type": "content\_block\_stop", "index": 1}
event: message\_delta
data: {"type": "message\_delta", "delta": {"stop\_reason": "end\_turn", "stop\_sequence": null}}
event: message\_stop
data: {"type": "message\_stop"}
```
### Streaming request with web search tool use
This request asks Claude to search the web for current weather information.
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"stream": true,
"tools": [
{
"type": "web\_search\_20250305",
"name": "web\_search",
"max\_uses": 5
}
],
"messages": [
{
"role": "user",
"content": "What is the weather like in New York City today?"
}
]
}'
```
```bash CLI
ant messages create --stream --format jsonl \
--model claude-opus-5 \
--max-tokens 1024 \
--tool '{type: web\_search\_20250305, name: web\_search, max\_uses: 5}' \
--message '{role: user, content: What is the weather like in New York City today?}'
```
```python Python
client = anthropic.Anthropic()
with client.messages.stream(
model="claude-opus-5",
max\_tokens=1024,
tools=[{"type": "web\_search\_20250305", "name": "web\_search", "max\_uses": 5}],
messages=[
{"role": "user", "content": "What is the weather like in New York City today?"}
],
) as stream:
for text in stream.text\_stream:
print(text, end="", flush=True)
```
```typescript TypeScript
const client = new Anthropic();
const stream = client.messages.stream({
model: "claude-opus-5",
max\_tokens: 1024,
tools: [{ type: "web\_search\_20250305", name: "web\_search", max\_uses: 5 }],
messages: [{ role: "user", content: "What is the weather like in New York City today?" }]
});
for await (const event of stream) {
if (event.type === "content\_block\_delta" && event.delta.type === "text\_delta") {
process.stdout.write(event.delta.text);
}
}
```
```csharp C#
using Anthropic;
using Anthropic.Models.Messages;
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Tools = [new ToolUnion(new WebSearchTool20250305() { MaxUses = 5 })],
Messages = [new() { Role = Role.User, Content = "What is the weather like in New York City today?" }]
};
await foreach (var msg in client.Messages.CreateStreaming(parameters))
{
Console.Write(msg);
}
```
```go Go
client := anthropic.NewClient()
stream := client.Messages.NewStreaming(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Tools: []anthropic.ToolUnionParam{
{
OfWebSearchTool20250305: &anthropic.WebSearchTool20250305Param{
MaxUses: anthropic.Int(5),
},
},
},
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("What is the weather like in New York City today?")),
},
})
for stream.Next() {
event := stream.Current()
switch eventVariant := event.AsAny().(type) {
case anthropic.ContentBlockDeltaEvent:
switch deltaVariant := eventVariant.Delta.AsAny().(type) {
case anthropic.TextDelta:
fmt.Print(deltaVariant.Text)
}
}
}
if err := stream.Err(); err != nil {
log.Fatal(err)
}
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addTool(WebSearchTool20250305.builder()
.maxUses(5L)
.build())
.addUserMessage("What is the weather like in New York City today?")
.build();
try (var streamResponse = client.messages().createStreaming(params)) {
streamResponse.stream().forEach(event -> {
event.contentBlockDelta().ifPresent(deltaEvent ->
deltaEvent.delta().text().ifPresent(td ->
System.out.print(td.text())
)
);
});
}
```
```php PHP
$client = new Client();
$stream = $client->messages->createStream(
maxTokens: 1024,
messages: [
['role' => 'user', 'content' => 'What is the weather like in New York City today?']
],
model: 'claude-opus-5',
tools: [
['type' => 'web\_search\_20250305', 'name' => 'web\_search', 'max\_uses' => 5]
],
);
foreach ($stream as $message) {
echo $message;
}
```
```ruby Ruby
client = Anthropic::Client.new
stream = client.messages.stream(
model: :"claude-opus-5",
max\_tokens: 1024,
tools: [
{
type: "web\_search\_20250305",
name: "web\_search",
max\_uses: 5
}
],
messages: [
{
role: "user",
content: "What is the weather like in New York City today?"
}
]
)
stream.text.each { |text| print(text) }
```
```sse Response
event: message\_start
data: {"type":"message\_start","message":{"id":"msg\_01G...","type":"message","role":"assistant","model":"claude-opus-5","content":[],"stop\_reason":null,"stop\_sequence":null,"usage":{"input\_tokens":2679,"cache\_creation\_input\_tokens":0,"cache\_read\_input\_tokens":0,"output\_tokens":3}}}
event: content\_block\_start
data: {"type":"content\_block\_start","index":0,"content\_block":{"type":"text","text":""}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":"I'll check"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":" the current weather in New York City for you"}}
event: ping
data: {"type": "ping"}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"text\_delta","text":"."}}
event: content\_block\_stop
data: {"type":"content\_block\_stop","index":0}
event: content\_block\_start
data: {"type":"content\_block\_start","index":1,"content\_block":{"type":"server\_tool\_use","id":"srvtoolu\_014hJH82Qum7Td6UV8gDXThB","name":"web\_search","input":{}}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":1,"delta":{"type":"input\_json\_delta","partial\_json":""}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":1,"delta":{"type":"input\_json\_delta","partial\_json":"{\"query"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":1,"delta":{"type":"input\_json\_delta","partial\_json":"\":"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":1,"delta":{"type":"input\_json\_delta","partial\_json":" \"weather"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":1,"delta":{"type":"input\_json\_delta","partial\_json":" NY"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":1,"delta":{"type":"input\_json\_delta","partial\_json":"C to"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":1,"delta":{"type":"input\_json\_delta","partial\_json":"day\"}"}}
event: content\_block\_stop
data: {"type":"content\_block\_stop","index":1 }
event: content\_block\_start
data: {"type":"content\_block\_start","index":2,"content\_block":{"type":"web\_search\_tool\_result","tool\_use\_id":"srvtoolu\_014hJH82Qum7Td6UV8gDXThB","content":[{"type":"web\_search\_result","title":"Weather in New York City in May 2025 (New York) - detailed Weather Forecast for a month","url":"https://world-weather.info/forecast/usa/new\_york/may-2025/","encrypted\_content":"Ev0DCioIAxgCIiQ3NmU4ZmI4OC1k...","page\_age":null},...]}}
event: content\_block\_stop
data: {"type":"content\_block\_stop","index":2}
event: content\_block\_start
data: {"type":"content\_block\_start","index":3,"content\_block":{"type":"text","text":""}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":3,"delta":{"type":"text\_delta","text":"Here's the current weather information for New York"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":3,"delta":{"type":"text\_delta","text":" City:\n\n# Weather"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":3,"delta":{"type":"text\_delta","text":" in New York City"}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":3,"delta":{"type":"text\_delta","text":"\n\n"}}
...
event: content\_block\_stop
data: {"type":"content\_block\_stop","index":17}
event: message\_delta
data: {"type":"message\_delta","delta":{"stop\_reason":"end\_turn","stop\_sequence":null},"usage":{"input\_tokens":10682,"cache\_creation\_input\_tokens":0,"cache\_read\_input\_tokens":0,"output\_tokens":510,"server\_tool\_use":{"web\_search\_requests":1}}}
event: message\_stop
data: {"type":"message\_stop"}
```
## Error recovery
### Claude 4.5 and earlier
For Claude 4.5 models and earlier, you can recover a streaming request that was interrupted due to network issues, timeouts, or other errors by resuming from where the stream was interrupted. This approach saves you from re-processing the entire response.
The basic recovery strategy involves:
1. \*\*Capture the partial response:\*\* Save all content that was successfully received before the error occurred.
2. \*\*Construct a continuation request:\*\* Create a new API request that includes the partial assistant response as the beginning of a new assistant message.
3. \*\*Resume streaming:\*\* Continue receiving the rest of the response from where it was interrupted.
### Claude 4.6 and later
For Claude 4.6 and later models, the same capture-and-resume strategy applies, but step 2 changes: instead of placing the partial response in an assistant message, add a user message that instructs the model to continue from where it left off.
1. \*\*Capture the partial response:\*\* Save all content that was successfully received before the error occurred.
2. \*\*Construct a continuation request:\*\* Create a new API request with a user message containing the partial response and an instruction to continue, for example:
```text Sample prompt wrap
Your previous response was interrupted and ended with [previous\_response]. Continue from where you left off.
```
3. \*\*Resume streaming:\*\* Continue receiving the rest of the response from where it was interrupted.
### Error recovery best practices
1. \*\*Use SDK features:\*\* Leverage the SDK's built-in message accumulation and error handling capabilities.
2. \*\*Handle content types:\*\* Be aware that messages can contain multiple content blocks (`text`, `tool\_use`, `thinking`). Tool use and extended thinking blocks cannot be partially recovered. You can resume streaming from the most recent text block.
## Next steps

Handle each `stop\_reason` value once a stream completes.

Stream tool input JSON without server-side buffering for lower latency.

Stream thinking output with `thinking\_delta` and `signature\_delta` events.

Use the official SDKs, which handle streaming, accumulation, and reconnection for you.

Process large volumes of requests asynchronously when you don't need real-time responses.
