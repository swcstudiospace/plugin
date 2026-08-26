# Token counting

Source: https://platform.claude.com/docs/en/build-with-claude/token-counting.md

# Token counting
Count the tokens in a message before you send it to Claude. Use token counts to manage rate limits and costs, make model routing decisions, and fit prompts to a target length.
---
Token counting lets you determine the number of tokens in a message before you send it to Claude. This helps you make informed decisions about your prompts and usage. With token counting, you can:
\* Proactively manage rate limits and costs
\* Make smart model routing decisions
\* Optimize prompts to a specific length
For how zero data retention (ZDR) applies to this feature, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
\*\*\*
## How to count message tokens
The [token counting](/docs/en/api/messages-count-tokens) endpoint accepts the same structured list of inputs for creating a message, including support for system prompts, [tools](/docs/en/agents-and-tools/tool-use/overview), [images](/docs/en/build-with-claude/vision), and [PDFs](/docs/en/build-with-claude/pdf-support). The response contains the total number of input tokens.
The token count is an \*\*estimate\*\*. In some cases, the actual number of input tokens used when creating a message might differ by a small amount.
Token counts may include tokens added automatically by Anthropic for system optimizations. \*\*You are not billed for system-added tokens\*\*. Billing reflects only your content.
### Supported models
All [active models](/docs/en/about-claude/models/overview) support token counting, including Claude Opus 5 and Claude Sonnet 5.
Claude 4.7 and later models and Claude Mythos Preview use a newer tokenizer. The same input text produces approximately 30 percent more tokens than on earlier models. The exact increase depends on the content and workload shape. Recount prompts against the model you plan to use rather than reusing counts measured against earlier models.
### Count tokens in basic messages
```bash cURL
curl https://api.anthropic.com/v1/messages/count\_tokens \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "content-type: application/json" \
-H "anthropic-version: 2023-06-01" \
-d '{
"model": "claude-opus-5",
"system": "You are a scientist",
"messages": [{
"role": "user",
"content": "Hello, Claude"
}]
}'
```
```bash CLI
ant messages count-tokens \
--model claude-opus-5 \
--system "You are a scientist" \
--message '{role: user, content: "Hello, Claude"}'
```
```python Python
client = anthropic.Anthropic()
response = client.messages.count\_tokens(
model="claude-opus-5",
system="You are a scientist",
messages=[{"role": "user", "content": "Hello, Claude"}],
)
print(response.json())
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.messages.countTokens({
model: "claude-opus-5",
system: "You are a scientist",
messages: [
{
role: "user",
content: "Hello, Claude"
}
]
});
console.log(response);
```
```csharp C#
using System;
using System.Threading.Tasks;
using Anthropic;
using Anthropic.Models.Messages;
AnthropicClient client = new();
var parameters = new MessageCountTokensParams
{
Model = Model.ClaudeOpus5,
System = "You are a scientist",
Messages = [new() { Role = Role.User, Content = "Hello, Claude" }]
};
var response = await client.Messages.CountTokens(parameters);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.CountTokens(context.TODO(), anthropic.MessageCountTokensParams{
Model: anthropic.ModelClaudeOpus5,
System: anthropic.MessageCountTokensParamsSystemUnion{
OfString: anthropic.String("You are a scientist"),
},
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
import com.anthropic.models.messages.MessageCountTokensParams;
import com.anthropic.models.messages.MessageTokensCount;
// ...
public class CountTokensExample {
public static void main(String[] args) {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCountTokensParams params = MessageCountTokensParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.system("You are a scientist")
.addUserMessage("Hello, Claude")
.build();
MessageTokensCount count = client.messages().countTokens(params);
System.out.println(count);
}
}
```
```php PHP
$client = new Client();
$response = $client->messages->countTokens(
messages: [
['role' => 'user', 'content' => 'Hello, Claude']
],
model: 'claude-opus-5',
system: 'You are a scientist',
);
echo json\_encode($response);
```
```ruby Ruby
client = Anthropic::Client.new
response = client.messages.count\_tokens(
model: "claude-opus-5",
system: "You are a scientist",
messages: [
{ role: "user", content: "Hello, Claude" }
]
)
puts response
```
```json Output
{ "input\_tokens": 14 }
```
### Count tokens in messages with tools
[Server tool](/docs/en/agents-and-tools/tool-use/server-tools) token counts only apply to the first sampling call.

```bash cURL
curl https://api.anthropic.com/v1/messages/count\_tokens \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "content-type: application/json" \
-H "anthropic-version: 2023-06-01" \
-d '{
"model": "claude-opus-5",
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
"messages": [
{
"role": "user",
"content": "What'\''s the weather like in San Francisco?"
}
]
}'
```
```bash CLI
ant messages count-tokens <<'YAML'
model: claude-opus-5
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
messages:
- role: user
content: What's the weather like in San Francisco?
YAML
```
```python Python
client = anthropic.Anthropic()
response = client.messages.count\_tokens(
model="claude-opus-5",
tools=[
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
],
messages=[{"role": "user", "content": "What's the weather like in San Francisco?"}],
)
print(response.json())
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.messages.countTokens({
model: "claude-opus-5",
tools: [
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
],
messages: [{ role: "user", content: "What's the weather like in San Francisco?" }]
});
console.log(response);
```
```csharp C#
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Anthropic;
using Anthropic.Models.Messages;
AnthropicClient client = new();
var parameters = new MessageCountTokensParams
{
Model = Model.ClaudeOpus5,
Tools =
[
new MessageCountTokensTool(new Tool()
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
Messages = [new() { Role = Role.User, Content = "What's the weather like in San Francisco?" }]
};
var count = await client.Messages.CountTokens(parameters);
Console.WriteLine(count);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.CountTokens(context.TODO(), anthropic.MessageCountTokensParams{
Model: anthropic.ModelClaudeOpus5,
Tools: []anthropic.MessageCountTokensToolUnionParam{
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
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("What's the weather like in San Francisco?")),
},
})
if err != nil {
log.Fatal(err)
}
jsonData, \_ := json.MarshalIndent(response, "", " ")
fmt.Println(string(jsonData))
```
```java Java
import com.anthropic.models.messages.MessageCountTokensParams;
import com.anthropic.models.messages.MessageTokensCount;
// ...
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
InputSchema schema = InputSchema.builder()
.properties(
JsonValue.from(
Map.of(
"location",
Map.of(
"type",
"string",
"description",
"The city and state, e.g. San Francisco, CA"
)
)
)
)
.putAdditionalProperty("required", JsonValue.from(List.of("location")))
.build();
MessageCountTokensParams params = MessageCountTokensParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.addTool(
Tool.builder()
.name("get\_weather")
.description("Get the current weather in a given location")
.inputSchema(schema)
.build()
)
.addUserMessage("What's the weather like in San Francisco?")
.build();
MessageTokensCount count = client.messages().countTokens(params);
System.out.println(count);
```
```php PHP
$client = new Client();
$response = $client->messages->countTokens(
messages: [
['role' => 'user', 'content' => "What's the weather like in San Francisco?"]
],
model: 'claude-opus-5',
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
echo json\_encode($response, JSON\_PRETTY\_PRINT);
```
```ruby Ruby
client = Anthropic::Client.new
response = client.messages.count\_tokens(
model: "claude-opus-5",
tools: [
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
],
messages: [
{ role: "user", content: "What's the weather like in San Francisco?" }
]
)
puts response
```
```json Output
{ "input\_tokens": 403 }
```
### Count tokens in messages with images
```bash cURL
#!/bin/sh
IMAGE\_URL="https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus\_flavomarginatus\_ant.jpg"
IMAGE\_MEDIA\_TYPE="image/jpeg"
IMAGE\_BASE64=$(curl -s "$IMAGE\_URL" | base64 | tr -d '\n')
curl https://api.anthropic.com/v1/messages/count\_tokens \
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
new ContentBlockParam(new TextBlockParam("Describe this image")),
}),
}
]
};
var count = await client.Messages.CountTokens(parameters);
Console.WriteLine(count);
```
```go Go
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
client := anthropic.NewClient()
response, err := client.Messages.CountTokens(context.TODO(), anthropic.MessageCountTokensParams{
Model: anthropic.ModelClaudeOpus5,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(
anthropic.NewImageBlockBase64("image/jpeg", imageData),
anthropic.NewTextBlock("Describe this image"),
),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
import com.anthropic.models.messages.Base64ImageSource;
// ...
import com.anthropic.models.messages.MessageCountTokensParams;
import com.anthropic.models.messages.MessageTokensCount;
// ...
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
String imageUrl =
"https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus\_flavomarginatus\_ant.jpg";
String imageMediaType = "image/jpeg";
HttpClient httpClient = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder().uri(URI.create(imageUrl)).build();
byte[] imageBytes = httpClient
.send(request, HttpResponse.BodyHandlers.ofByteArray())
.body();
String imageBase64 = Base64.getEncoder().encodeToString(imageBytes);
ContentBlockParam imageBlock = ContentBlockParam.ofImage(
ImageBlockParam.builder()
.source(
Base64ImageSource.builder()
.mediaType(Base64ImageSource.MediaType.IMAGE\_JPEG)
.data(imageBase64)
.build()
)
.build()
);
ContentBlockParam textBlock = ContentBlockParam.ofText(
TextBlockParam.builder().text("Describe this image").build()
);
MessageCountTokensParams params = MessageCountTokensParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.addUserMessageOfBlockParams(List.of(imageBlock, textBlock))
.build();
MessageTokensCount count = client.messages().countTokens(params);
System.out.println(count);
```
```php PHP
$imageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus\_flavomarginatus\_ant.jpg";
$imageMediaType = "image/jpeg";
$imageData = base64\_encode(file\_get\_contents($imageUrl));
$client = new Client();
$response = $client->messages->countTokens(
messages: [
[
'role' => 'user',
'content' => [
[
'type' => 'image',
'source' => [
'type' => 'base64',
'media\_type' => $imageMediaType,
'data' => $imageData
]
],
['type' => 'text', 'text' => 'Describe this image']
]
]
],
model: 'claude-opus-5',
);
print\_r($response);
```
```ruby Ruby
require "base64"
require "net/http"
image\_url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus\_flavomarginatus\_ant.jpg"
image\_media\_type = "image/jpeg"
uri = URI(image\_url)
image\_data = Base64.strict\_encode64(Net::HTTP.get(uri))
client = Anthropic::Client.new
response = client.messages.count\_tokens(
model: "claude-opus-5",
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
{ type: "text", text: "Describe this image" }
]
}
]
)
puts response
```
```json Output
{ "input\_tokens": 1551 }
```
### Count tokens in messages with thinking
See [Thinking and the context window](/docs/en/build-with-claude/thinking#thinking-and-the-context-window) for more details.
\* Thinking blocks from \*\*previous\*\* assistant turns are ignored and \*\*do not\*\* count toward your input tokens
\* \*\*Current\*\* assistant turn thinking \*\*does\*\* count toward your input tokens

```bash cURL
curl https://api.anthropic.com/v1/messages/count\_tokens \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "content-type: application/json" \
-H "anthropic-version: 2023-06-01" \
-d '{
"model": "claude-sonnet-4-6",
"thinking": {
"type": "enabled",
"budget\_tokens": 16000
},
"messages": [
{
"role": "user",
"content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
},
{
"role": "assistant",
"content": [
{
"type": "thinking",
"thinking": "This is a nice number theory question. Lets think about it step by step...",
"signature": "EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV..."
},
{
"type": "text",
"text": "Yes, there are infinitely many prime numbers p such that p mod 4 = 3..."
}
]
},
{
"role": "user",
"content": "Can you write a formal proof?"
}
]
}'
```
```bash CLI
ant messages count-tokens <<'YAML'
model: claude-sonnet-4-6
thinking:
type: enabled
budget\_tokens: 16000
messages:
- role: user
content: Are there an infinite number of prime numbers such that n mod 4 == 3?
- role: assistant
content:
- type: thinking
thinking: >-
This is a nice number theory question. Lets think about it step by step...
signature: >-
EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV...
- type: text
text: Yes, there are infinitely many prime numbers p such that p mod 4 = 3...
- role: user
content: Can you write a formal proof?
YAML
```
```python Python
client = anthropic.Anthropic()
response = client.messages.count\_tokens(
model="claude-sonnet-4-6",
thinking={"type": "enabled", "budget\_tokens": 16000},
messages=[
{
"role": "user",
"content": "Are there an infinite number of prime numbers such that n mod 4 == 3?",
},
{
"role": "assistant",
"content": [
{
"type": "thinking",
"thinking": "This is a nice number theory question. Let's think about it step by step...",
"signature": "EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV...",
},
{
"type": "text",
"text": "Yes, there are infinitely many prime numbers p such that p mod 4 = 3...",
},
],
},
{"role": "user", "content": "Can you write a formal proof?"},
],
)
print(response.json())
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.messages.countTokens({
model: "claude-sonnet-4-6",
thinking: {
type: "enabled",
budget\_tokens: 16000
},
messages: [
{
role: "user",
content: "Are there an infinite number of prime numbers such that n mod 4 == 3?"
},
{
role: "assistant",
content: [
{
type: "thinking",
thinking:
"This is a nice number theory question. Let's think about it step by step...",
signature:
"EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV..."
},
{
type: "text",
text: "Yes, there are infinitely many prime numbers p such that p mod 4 = 3..."
}
]
},
{
role: "user",
content: "Can you write a formal proof?"
}
]
});
console.log(response);
```
```csharp C#
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Anthropic;
using Anthropic.Models.Messages;
AnthropicClient client = new()
{
ApiKey = Environment.GetEnvironmentVariable("ANTHROPIC\_API\_KEY")
};
var parameters = new MessageCountTokensParams
{
Model = Model.ClaudeSonnet4\_6,
Thinking = new ThinkingConfigEnabled(budgetTokens: 16000),
Messages =
[
new()
{
Role = Role.User,
Content = "Are there an infinite number of prime numbers such that n mod 4 == 3?"
},
new()
{
Role = Role.Assistant,
Content = new MessageParamContent(new List
{
new ContentBlockParam(new ThinkingBlockParam()
{
Thinking = "This is a nice number theory question. Let's think about it step by step...",
Signature = "EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV...",
}),
new ContentBlockParam(new TextBlockParam("Yes, there are infinitely many prime numbers p such that p mod 4 = 3...")),
}),
},
new()
{
Role = Role.User,
Content = "Can you write a formal proof?"
}
]
};
var response = await client.Messages.CountTokens(parameters);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
thinkingBlock := anthropic.NewThinkingBlock(
"EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV...",
"This is a nice number theory question. Let's think about it step by step...",
)
textBlock := anthropic.NewTextBlock(
"Yes, there are infinitely many prime numbers p such that p mod 4 = 3...",
)
response, err := client.Messages.CountTokens(context.TODO(), anthropic.MessageCountTokensParams{
Model: anthropic.ModelClaudeSonnet4\_6,
Thinking: anthropic.ThinkingConfigParamOfEnabled(16000),
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("Are there an infinite number of prime numbers such that n mod 4 == 3?")),
anthropic.NewAssistantMessage(thinkingBlock, textBlock),
anthropic.NewUserMessage(anthropic.NewTextBlock("Can you write a formal proof?")),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Printf("%+v\n", response)
```
```java Java
import com.anthropic.models.messages.MessageCountTokensParams;
import com.anthropic.models.messages.MessageTokensCount;
// ...
import com.anthropic.models.messages.ThinkingBlockParam;
// ...
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
List assistantBlocks = List.of(
ContentBlockParam.ofThinking(
ThinkingBlockParam.builder()
.thinking(
"This is a nice number theory question. Let's think about it step by step..."
)
.signature(
"EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV..."
)
.build()
),
ContentBlockParam.ofText(
TextBlockParam.builder()
.text("Yes, there are infinitely many prime numbers p such that p mod 4 = 3...")
.build()
)
);
MessageCountTokensParams params = MessageCountTokensParams.builder()
.model(Model.CLAUDE\_SONNET\_4\_6)
.enabledThinking(16000)
.addUserMessage("Are there an infinite number of prime numbers such that n mod 4 == 3?")
.addAssistantMessageOfBlockParams(assistantBlocks)
.addUserMessage("Can you write a formal proof?")
.build();
MessageTokensCount count = client.messages().countTokens(params);
System.out.println(count);
```
```php PHP
$client = new Client();
$response = $client->messages->countTokens(
messages: [
[
'role' => 'user',
'content' => 'Are there an infinite number of prime numbers such that n mod 4 == 3?'
],
[
'role' => 'assistant',
'content' => [
[
'type' => 'thinking',
'thinking' => 'This is a nice number theory question. Let\'s think about it step by step...',
'signature' => 'EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV...'
],
[
'type' => 'text',
'text' => 'Yes, there are infinitely many prime numbers p such that p mod 4 = 3...'
]
]
],
[
'role' => 'user',
'content' => 'Can you write a formal proof?'
]
],
model: 'claude-sonnet-4-6',
thinking: [
'type' => 'enabled',
'budget\_tokens' => 16000
],
);
echo json\_encode($response);
```
```ruby Ruby
client = Anthropic::Client.new
response = client.messages.count\_tokens(
model: "claude-sonnet-4-6",
thinking: {
type: "enabled",
budget\_tokens: 16000
},
messages: [
{
role: "user",
content: "Are there an infinite number of prime numbers such that n mod 4 == 3?"
},
{
role: "assistant",
content: [
{
type: "thinking",
thinking: "This is a nice number theory question. Let's think about it step by step...",
signature: "EuYBCkQYAiJAgCs1le6/Pol5Z4/JMomVOouGrWdhYNsH3ukzUECbB6iWrSQtsQuRHJID6lWV..."
},
{
type: "text",
text: "Yes, there are infinitely many prime numbers p such that p mod 4 = 3..."
}
]
},
{
role: "user",
content: "Can you write a formal proof?"
}
]
)
puts response
```
```json Output
{ "input\_tokens": 88 }
```
### Count tokens in messages with PDFs
Token counting supports PDFs with the same [PDF support limitations](/docs/en/build-with-claude/pdf-support#pdf-support-limitations) as the Messages API.

```bash cURL
curl https://api.anthropic.com/v1/messages/count\_tokens \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "content-type: application/json" \
-H "anthropic-version: 2023-06-01" \
-d @- <
{
new ContentBlockParam(new DocumentBlockParam(
new DocumentBlockParamSource(new Base64PdfSource()
{
Data = pdfBase64,
})
)),
new ContentBlockParam(new TextBlockParam("Please summarize this document.")),
}),
}
]
};
var count = await client.Messages.CountTokens(parameters);
Console.WriteLine(count);
```
```go Go
client := anthropic.NewClient()
pdfBytes, err := os.ReadFile("/path/to/document.pdf")
if err != nil {
log.Fatal(err)
}
pdfBase64 := base64.StdEncoding.EncodeToString(pdfBytes)
response, err := client.Messages.CountTokens(context.TODO(), anthropic.MessageCountTokensParams{
Model: anthropic.ModelClaudeOpus5,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(
anthropic.NewDocumentBlock(anthropic.Base64PDFSourceParam{
Data: pdfBase64,
}),
anthropic.NewTextBlock("Please summarize this document."),
),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
import com.anthropic.models.messages.Base64PdfSource;
// ...
import com.anthropic.models.messages.DocumentBlockParam;
import com.anthropic.models.messages.MessageCountTokensParams;
import com.anthropic.models.messages.MessageTokensCount;
// ...
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
byte[] fileBytes = Files.readAllBytes(Path.of("/path/to/document.pdf"));
String pdfBase64 = Base64.getEncoder().encodeToString(fileBytes);
ContentBlockParam documentBlock = ContentBlockParam.ofDocument(
DocumentBlockParam.builder()
.source(Base64PdfSource.builder().data(pdfBase64).build())
.build()
);
ContentBlockParam textBlock = ContentBlockParam.ofText(
TextBlockParam.builder().text("Please summarize this document.").build()
);
MessageCountTokensParams params = MessageCountTokensParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.addUserMessageOfBlockParams(List.of(documentBlock, textBlock))
.build();
MessageTokensCount count = client.messages().countTokens(params);
System.out.println(count);
```
```php PHP
$client = new Client();
$pdfBase64 = base64\_encode(file\_get\_contents("/path/to/document.pdf"));
$response = $client->messages->countTokens(
messages: [
[
'role' => 'user',
'content' => [
[
'type' => 'document',
'source' => [
'type' => 'base64',
'media\_type' => 'application/pdf',
'data' => $pdfBase64
]
],
[
'type' => 'text',
'text' => 'Please summarize this document.'
]
]
]
],
model: 'claude-opus-5',
);
echo json\_encode($response);
```
```ruby Ruby
require "base64"
client = Anthropic::Client.new
pdf\_base64 = Base64.strict\_encode64(File.binread("/path/to/document.pdf"))
response = client.messages.count\_tokens(
model: "claude-opus-5",
messages: [
{
role: "user",
content: [
{
type: "document",
source: {
type: "base64",
media\_type: "application/pdf",
data: pdf\_base64
}
},
{
type: "text",
text: "Please summarize this document."
}
]
}
]
)
puts response
```
```json Output
{ "input\_tokens": 2188 }
```
\*\*\*
## Token counts on Claude Fable 5 and Claude Mythos 5
Claude Fable 5 and Claude Mythos 5 use the tokenizer introduced with Claude Opus 4.7, which produces roughly 30 percent more tokens than models before Claude Opus 4.7 for the same text. The exact increase depends on the content and workload shape. The token counting endpoint returns the count under the tokenizer of the `model` you pass, so to measure the difference for your workload, count the same request twice: once with your current model and once with `model: "claude-fable-5"` (or `"claude-mythos-5"`), and compare the two `input\_tokens` values.
\*\*Billing and migration:\*\* Usage and billing on Claude Fable 5 and Claude Mythos 5 reflect this tokenizer's counts. If you're migrating from a model before Claude Opus 4.7, the same content consumes roughly 30 percent more tokens. The exact increase depends on the content and workload shape. When migrating a workload to Claude Fable 5 and Claude Mythos 5, don't reuse token counts measured on a model before Claude Opus 4.7 to estimate costs or context window fit. Count your prompts with `model: "claude-fable-5"` (or `"claude-mythos-5"`).
\*\*\*
## Pricing and rate limits
Token counting is \*\*free to use\*\* but subject to requests per minute rate limits based on your [usage tier](/docs/en/api/rate-limits#rate-limits). If you need higher limits, use \*\*Request rate limit increase\*\* on the [Limits](/settings/limits) page.
| Usage tier | Requests per minute (RPM) |
| ---------- | ------------------------- |
| Start | 2,000 |
| Build | 4,000 |
| Scale | 8,000 |
Token counting and message creation have separate and independent rate limits. Usage of one does not count against the limits of the other.
\*\*\*
## FAQ

No, token counting provides an estimate without using caching logic. Although you may provide `cache\_control` blocks in your token counting request, prompt caching only occurs during actual message creation.
\*\*\*
## Next steps

Read the full API reference for the token counting endpoint.

Use token counts to keep prompts within a model's context window.

Check token counts before you send a request to stay within your usage tier.

Reduce cost and latency on repeated prompts by caching prompt prefixes.
