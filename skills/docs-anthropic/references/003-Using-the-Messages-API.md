# Using the Messages API

Source: https://platform.claude.com/docs/en/build-with-claude/working-with-messages.md

# Using the Messages API
Practical patterns and examples for using the Messages API effectively
---
Anthropic offers two ways to build with Claude, each suited to different use cases:
| | Messages API | Claude Managed Agents |
| -------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| \*\*What it is\*\* | Direct model prompting access | Pre-built, configurable agent harness that runs in managed infrastructure |
| \*\*Best for\*\* | Custom agent loops and fine-grained control | Long-running tasks and asynchronous work |
| \*\*Learn more\*\* | [Messages API docs](/docs/en/build-with-claude/working-with-messages) | [Claude Managed Agents docs](/docs/en/managed-agents/overview) |
This guide covers common patterns for working with the Messages API, including basic requests, multi-turn conversations, prefill techniques, and vision capabilities. For complete API specifications, see the [Messages API reference](/docs/en/api/messages/create).
For how zero data retention (ZDR) applies to this feature, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
## Basic request and response
The `temperature`, `top\_p`, and `top\_k` sampling parameters are not supported on Claude 4.7 and later models and Claude Mythos Preview. Setting them to a non-default value returns a 400 error. Omit them from request payloads and use prompting to guide the model's behavior instead. See the [migration guide](/docs/en/about-claude/models/migration-guide#migrating-from-claude-opus-47).

```bash cURL
#!/bin/sh
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"messages": [
{"role": "user", "content": "Hello, Claude"}
]
}'
```
```bash CLI
ant messages create \
--model claude-opus-5 \
--max-tokens 1024 \
--message '{role: user, content: "Hello, Claude"}'
```
```python Python
message = anthropic.Anthropic().messages.create(
model="claude-opus-5",
max\_tokens=1024,
messages=[{"role": "user", "content": "Hello, Claude"}],
)
print(message)
```
```typescript TypeScript
const anthropic = new Anthropic();
const message = await anthropic.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
messages: [{ role: "user", content: "Hello, Claude" }]
});
console.log(message);
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Messages = [new() { Role = Role.User, Content = "Hello, Claude" }]
};
var message = await client.Messages.Create(parameters);
Console.WriteLine(message);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("Hello, Claude")),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addUserMessage("Hello, Claude")
.build();
Message response = client.messages().create(params);
System.out.println(response);
```
```php PHP
$client = new Client();
$message = $client->messages->create(
maxTokens: 1024,
messages: [['role' => 'user', 'content' => 'Hello, Claude']],
model: 'claude-opus-5',
);
echo json\_encode($message, JSON\_PRETTY\_PRINT), PHP\_EOL;
```
```ruby Ruby
client = Anthropic::Client.new
message = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
messages: [
{ role: "user", content: "Hello, Claude" }
]
)
puts message
```
```json Output
{
"id": "msg\_01XFDUDYJgAACzvnptvVoYEL",
"type": "message",
"role": "assistant",
"content": [
{
"type": "text",
"text": "Hello!"
}
],
"model": "claude-opus-5",
"stop\_reason": "end\_turn",
"stop\_sequence": null,
"usage": {
"input\_tokens": 12,
"output\_tokens": 6
}
}
```
Refusal responses (`stop\_reason: "refusal"`) also include a `stop\_details` object identifying the policy category that triggered the refusal, on every model. See [Handling stop reasons](/docs/en/build-with-claude/refusals-and-fallback#refusal-response) for the field reference and example handling code.
## Multiple conversational turns
The Messages API is stateless, which means that you always send the full conversational history to the API. You can use this pattern to build up a conversation over time. Earlier conversational turns don't necessarily need to actually originate from Claude. You can use synthetic `assistant` messages.
```bash cURL
#!/bin/sh
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"messages": [
{"role": "user", "content": "Hello, Claude"},
{"role": "assistant", "content": "Hello!"},
{"role": "user", "content": "Can you describe LLMs to me?"}
]
}'
```
```bash CLI
ant messages create \
--model claude-opus-5 \
--max-tokens 1024 \
--message '{role: user, content: "Hello, Claude"}' \
--message '{role: assistant, content: "Hello!"}' \
--message '{role: user, content: "Can you describe LLMs to me?"}'
```
```python Python
message = anthropic.Anthropic().messages.create(
model="claude-opus-5",
max\_tokens=1024,
messages=[
{"role": "user", "content": "Hello, Claude"},
{"role": "assistant", "content": "Hello!"},
{"role": "user", "content": "Can you describe LLMs to me?"},
],
)
print(message)
```
```typescript TypeScript
const anthropic = new Anthropic();
const message = await anthropic.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
messages: [
{ role: "user", content: "Hello, Claude" },
{ role: "assistant", content: "Hello!" },
{ role: "user", content: "Can you describe LLMs to me?" }
]
});
console.log(message);
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Messages =
[
new() { Role = Role.User, Content = "Hello, Claude" },
new() { Role = Role.Assistant, Content = "Hello!" },
new() { Role = Role.User, Content = "Can you describe LLMs to me?" }
]
};
var message = await client.Messages.Create(parameters);
Console.WriteLine(message);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("Hello, Claude")),
anthropic.NewAssistantMessage(anthropic.NewTextBlock("Hello!")),
anthropic.NewUserMessage(anthropic.NewTextBlock("Can you describe LLMs to me?")),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addUserMessage("Hello, Claude")
.addAssistantMessage("Hello!")
.addUserMessage("Can you describe LLMs to me?")
.build();
Message response = client.messages().create(params);
System.out.println(response);
```
```php PHP
$client = new Client();
$message = $client->messages->create(
maxTokens: 1024,
messages: [
['role' => 'user', 'content' => 'Hello, Claude'],
['role' => 'assistant', 'content' => 'Hello!'],
['role' => 'user', 'content' => 'Can you describe LLMs to me?'],
],
model: 'claude-opus-5',
);
echo json\_encode($message, JSON\_PRETTY\_PRINT), PHP\_EOL;
```
```ruby Ruby
client = Anthropic::Client.new
message = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
messages: [
{ role: "user", content: "Hello, Claude" },
{ role: "assistant", content: "Hello!" },
{ role: "user", content: "Can you describe LLMs to me?" }
]
)
puts message
```
```json Output
{
"id": "msg\_018gCsTGsXkYJVqYPxTgDHBU",
"type": "message",
"role": "assistant",
"content": [
{
"type": "text",
"text": "Sure, I'd be happy to provide..."
}
],
"model": "claude-opus-5",
"stop\_reason": "end\_turn",
"stop\_sequence": null,
"usage": {
"input\_tokens": 30,
"output\_tokens": 309
}
}
```
### System role in messages
On Claude Fable 5, [Claude Mythos 5](https://anthropic.com/glasswing), Claude Opus 4.8, and Claude Opus 5, you can include messages with `"role": "system"` after a user turn (subject to [placement rules](/docs/en/build-with-claude/mid-conversation-system-messages#limitations)) to add a new system instruction partway through a conversation. A `system` message cannot be the first entry in `messages`; use the top-level `system` field for instructions that apply from the start.
A mid-conversation system message has the same authority as the top-level `system` field, but because it is appended to the end of the message history, it does not invalidate any cached prefix that came before it. Use the top-level `system` field for instructions that should apply from the very first turn, and a mid-conversation system message for instructions that only become relevant later.
See [Mid-conversation system messages](/docs/en/build-with-claude/mid-conversation-system-messages) for the complete guide, including how to combine it with [prompt caching](/docs/en/build-with-claude/prompt-caching).
## Prefilling Claude's response
You can pre-fill part of Claude's response in the last position of the input messages list. Use this technique to shape Claude's response. The following example uses `"max\_tokens": 1` to get a single multiple choice answer from Claude.
Prefilling is not supported on Claude 4.6 and later models and [Claude Mythos Preview](https://anthropic.com/glasswing). Requests using prefill with these models return a 400 error. Use [structured outputs](/docs/en/build-with-claude/structured-outputs) on models that support it, or system prompt instructions, instead. See the [migration guide](/docs/en/about-claude/models/migration-guide) for migration patterns.

```bash cURL
#!/bin/sh
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-d '{
"model": "claude-sonnet-4-5",
"max\_tokens": 1,
"messages": [
{"role": "user", "content": "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"},
{"role": "assistant", "content": "The answer is ("}
]
}'
```
```bash CLI
ant messages create <<'YAML'
model: claude-sonnet-4-5
max\_tokens: 1
messages:
- role: user
content: "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"
- role: assistant
content: "The answer is ("
YAML
```
```python Python
message = anthropic.Anthropic().messages.create(
model="claude-sonnet-4-5",
max\_tokens=1,
messages=[
{
"role": "user",
"content": "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae",
},
{"role": "assistant", "content": "The answer is ("},
],
)
print(message)
```
```typescript TypeScript
const anthropic = new Anthropic();
const message = await anthropic.messages.create({
model: "claude-sonnet-4-5",
max\_tokens: 1,
messages: [
{
role: "user",
content: "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"
},
{ role: "assistant", content: "The answer is (" }
]
});
console.log(message);
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeSonnet4\_5,
MaxTokens = 1,
Messages = [
new() { Role = Role.User, Content = "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae" },
new() { Role = Role.Assistant, Content = "The answer is (" }
]
};
var message = await client.Messages.Create(parameters);
Console.WriteLine(message);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeSonnet4\_5,
MaxTokens: 1,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae")),
anthropic.NewAssistantMessage(anthropic.NewTextBlock("The answer is (")),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_SONNET\_4\_5)
.maxTokens(1L)
.addUserMessage("What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae")
.addAssistantMessage("The answer is (")
.build();
Message response = client.messages().create(params);
System.out.println(response);
```
```php PHP
$client = new Client();
$message = $client->messages->create(
maxTokens: 1,
messages: [
['role' => 'user', 'content' => 'What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae'],
['role' => 'assistant', 'content' => 'The answer is ('],
],
model: 'claude-sonnet-4-5',
);
echo $message->content[0]->text;
```
```ruby Ruby
client = Anthropic::Client.new
message = client.messages.create(
model: "claude-sonnet-4-5",
max\_tokens: 1,
messages: [
{
role: "user",
content: "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"
},
{ role: "assistant", content: "The answer is (" }
]
)
puts message
```
```json Output
{
"id": "msg\_01Q8Faay6S7QPTvEUUQARt7h",
"type": "message",
"role": "assistant",
"content": [
{
"type": "text",
"text": "C"
}
],
"model": "claude-sonnet-4-5",
"stop\_reason": "max\_tokens",
"stop\_sequence": null,
"usage": {
"input\_tokens": 42,
"output\_tokens": 1
}
}
```
## Vision
Claude can read both text and images in requests. You can supply images using the `base64`, `url`, or `file` source types. The `file` source type references an image uploaded through the [Files API](/docs/en/build-with-claude/files). Supported media types are `image/jpeg`, `image/png`, `image/gif`, and `image/webp`. See the [vision guide](/docs/en/build-with-claude/vision) for more details.
```bash cURL
#!/bin/sh
# Option 1: Base64-encoded image
IMAGE\_URL="https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus\_flavomarginatus\_ant.jpg"
IMAGE\_MEDIA\_TYPE="image/jpeg"
IMAGE\_BASE64=$(curl "$IMAGE\_URL" | base64 | tr -d '\n')
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-d @- <
{
new ContentBlockParam(new ImageBlockParam(
new ImageBlockParamSource(new Base64ImageSource()
{
Data = imageData,
MediaType = MediaType.ImageJpeg,
})
)),
new ContentBlockParam(new TextBlockParam("What is in the above image?")),
}),
}
]
};
var message = await client.Messages.Create(parameters);
Console.WriteLine(message);
// Option 2: URL-referenced image
var parametersFromUrl = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Messages =
[
new()
{
Role = Role.User,
Content = new MessageParamContent(new List
{
new ContentBlockParam(new ImageBlockParam(
new ImageBlockParamSource(new UrlImageSource()
{
Url = new Uri("https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus\_flavomarginatus\_ant.jpg"),
})
)),
new ContentBlockParam(new TextBlockParam("What is in the above image?")),
}),
}
]
};
var messageFromUrl = await client.Messages.Create(parametersFromUrl);
Console.WriteLine(messageFromUrl);
```
```go Go
client := anthropic.NewClient()
// Option 1: Base64-encoded image
imageURL := "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus\_flavomarginatus\_ant.jpg"
req, err := http.NewRequest("GET", imageURL, nil)
if err != nil {
log.Fatal(err)
}
req.Header.Set("User-Agent", "AnthropicDocsBot/1.0")
resp, err := http.DefaultClient.Do(req)
if err != nil {
log.Fatal(err)
}
defer resp.Body.Close()
imageBytes, err := io.ReadAll(resp.Body)
if err != nil {
log.Fatal(err)
}
imageData := base64.StdEncoding.EncodeToString(imageBytes)
message, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(
anthropic.NewImageBlockBase64("image/jpeg", imageData),
anthropic.NewTextBlock("What is in the above image?"),
),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(message)
// Option 2: URL-referenced image
messageFromURL, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(
anthropic.NewImageBlock(anthropic.URLImageSourceParam{
URL: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus\_flavomarginatus\_ant.jpg",
}),
anthropic.NewTextBlock("What is in the above image?"),
),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(messageFromURL)
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
// Option 1: Base64-encoded image
String imageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus\_flavomarginatus\_ant.jpg";
HttpClient httpClient = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder().uri(URI.create(imageUrl)).build();
HttpResponse response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
String imageData = Base64.getEncoder().encodeToString(response.body());
List base64Content = List.of(
ContentBlockParam.ofImage(
ImageBlockParam.builder()
.source(Base64ImageSource.builder()
.data(imageData)
.mediaType(Base64ImageSource.MediaType.IMAGE\_JPEG)
.build())
.build()),
ContentBlockParam.ofText(
TextBlockParam.builder()
.text("What is in the above image?")
.build())
);
Message message = client.messages().create(
MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addUserMessageOfBlockParams(base64Content)
.build());
System.out.println(message);
// Option 2: URL-referenced image
List urlContent = List.of(
ContentBlockParam.ofImage(
ImageBlockParam.builder()
.source(UrlImageSource.builder()
.url("https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus\_flavomarginatus\_ant.jpg")
.build())
.build()),
ContentBlockParam.ofText(
TextBlockParam.builder()
.text("What is in the above image?")
.build())
);
Message messageFromUrl = client.messages().create(
MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addUserMessageOfBlockParams(urlContent)
.build());
System.out.println(messageFromUrl);
```
```php PHP
$client = new Client();
// Option 1: Base64-encoded image
$image\_url = 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus\_flavomarginatus\_ant.jpg';
$image\_media\_type = "image/jpeg";
$image\_data = base64\_encode(file\_get\_contents($image\_url));
$message = $client->messages->create(
maxTokens: 1024,
messages: [
[
'role' => 'user',
'content' => [
[
'type' => 'image',
'source' => [
'type' => 'base64',
'media\_type' => $image\_media\_type,
'data' => $image\_data,
],
],
[
'type' => 'text',
'text' => 'What is in the above image?',
],
],
],
],
model: 'claude-opus-5',
);
echo $message;
// Option 2: URL-referenced image
$message\_from\_url = $client->messages->create(
maxTokens: 1024,
messages: [
[
'role' => 'user',
'content' => [
[
'type' => 'image',
'source' => [
'type' => 'url',
'url' => 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus\_flavomarginatus\_ant.jpg',
],
],
[
'type' => 'text',
'text' => 'What is in the above image?',
],
],
],
],
model: 'claude-opus-5',
);
echo $message\_from\_url;
```
```ruby Ruby
require "base64"
require "net/http"
client = Anthropic::Client.new
# Option 1: Base64-encoded image
image\_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus\_flavomarginatus\_ant.jpg"
image\_media\_type = "image/jpeg"
image\_data = Base64.strict\_encode64(Net::HTTP.get(URI(image\_url)))
message = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
messages: [
{
role: "user",
content: [
{
type: "image",
source: {
type: "base64",
media\_type: image\_media\_type,
data: image\_data
}
},
{
type: "text",
text: "What is in the above image?"
}
]
}
]
)
puts message
# Option 2: URL-referenced image
message\_from\_url = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
messages: [
{
role: "user",
content: [
{
type: "image",
source: {
type: "url",
url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus\_flavomarginatus\_ant.jpg"
}
},
{
type: "text",
text: "What is in the above image?"
}
]
}
]
)
puts message\_from\_url
```
```json Output
{
"id": "msg\_01EcyWo6m4hyW8KHs2y2pei5",
"type": "message",
"role": "assistant",
"content": [
{
"type": "text",
"text": "This image shows an ant, specifically a close-up view of an ant. The ant is shown in detail, with its distinct head, antennae, and legs clearly visible. The image is focused on capturing the intricate details and features of the ant, likely taken with a macro lens to get an extreme close-up perspective."
}
],
"model": "claude-opus-5",
"stop\_reason": "end\_turn",
"stop\_sequence": null,
"usage": {
"input\_tokens": 1551,
"output\_tokens": 71
}
}
```
## Next steps

Handle each `stop\_reason` value and decide what to do when a response ends.

Give Claude tools to call external services and APIs from within the Messages API.

Control desktop computer environments with the Messages API.

Get guaranteed, schema-validated JSON output from Claude.

Set an advisory token budget across a full agentic loop with `output\_config.task\_budget`.
