# Mid-conversation system messages and tool changes

Source: https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages.md

# Mid-conversation system messages and tool changes
Change system instructions or tool availability partway through a conversation without invalidating the cached prefix that came before them.
---
For how zero data retention (ZDR) applies to this feature, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
System instructions normally live in the top-level `system` field, ahead of every message in the conversation. That position is great for [prompt caching](/docs/en/build-with-claude/prompt-caching): the system prompt is part of the stable prefix, so subsequent turns hit the cache. It is a poor position for instructions you only discover you need partway through a session, because editing the top-level `system` field changes the very beginning of the prompt and invalidates the cache for everything that follows.
Mid-conversation system messages close that gap. You append a `{"role": "system"}` message at the point in the conversation where the new instruction becomes relevant, instead of editing the top-level `system` field. The cached prefix stays the same, so the next request still reads it from cache, and the new instruction is still applied as a system instruction rather than as ordinary user text.
This page covers two features: mid-conversation system messages, which are generally available, and [mid-conversation tool changes](#mid-conversation-tool-changes), a beta introduced with Claude Opus 5 that applies the same approach to the `tools` array.
Mid-conversation system messages are available on the Claude API, [Claude in Amazon Bedrock](/docs/en/build-with-claude/claude-in-amazon-bedrock), and [Google Cloud](/docs/en/build-with-claude/claude-on-vertex-ai).
This feature is available on Claude Fable 5, [Claude Mythos 5](https://anthropic.com/glasswing), Claude Opus 4.8, and Claude Opus 5. No beta header is required for mid-conversation system messages. This feature is not available on Claude Sonnet 5; use the top-level `system` field instead.
Mid-conversation tool changes are in beta and require the `mid-conversation-tool-changes-2026-07-01` beta header. They are available on Claude Fable 5, Claude Mythos 5, Claude Opus 4.8, and Claude Opus 5, on the Claude API, Amazon Bedrock, and Google Cloud.
## Mid-conversation tool changes
The `tools` array sits even earlier in the hashed request prefix than the top-level `system` field, so editing it invalidates the [prompt cache](/docs/en/build-with-claude/prompt-caching) for the entire conversation. Mid-conversation tool changes, a beta introduced with Claude Opus 5, are the tools counterpart to mid-conversation system messages. Instead of fixing the tool list for the lifetime of the conversation, you change which tools are offered to the model between turns: declare the full tool set in `tools` up front, then use `tool\_addition` and `tool\_removal` blocks to offer a tool to the model, or withdraw it, from a specific point in the conversation onward. The `tools` array itself never changes, so the cached prefix stays intact.
`tool\_addition` and `tool\_removal` are content blocks in the `content` array of a `role: "system"` message, and they can be mixed with `text` blocks in the same message. The message follows the same placement rules as any mid-conversation system message (see [Limitations](#limitations)), and the change applies from that point in the conversation onward. Each block's `tool` field references a tool rather than defining one: `{"type": "tool\_reference", "name": "..."}` names a tool declared in the request's `tools` array, and [MCP connector](/docs/en/agents-and-tools/mcp-connector) tools can be referenced individually with `mcp\_tool\_reference` (`server\_name` and `name`) or as a whole toolset with `mcp\_toolset\_reference` (`server\_name`). Referencing a name that is not declared in `tools` returns a 400 error.
Every tool declared in `tools` is offered to the model from the start of the conversation unless it is declared with `defer\_loading: true`, which keeps it withheld until a `tool\_addition` block surfaces it. `tool\_addition` also re-offers a tool that an earlier `tool\_removal` withdrew.
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: mid-conversation-tool-changes-2026-07-01" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"tools": [
{
"name": "get\_weather",
"description": "Get the current weather for a location.",
"input\_schema": {
"type": "object",
"properties": {
"location": {"type": "string", "description": "City name"}
},
"required": ["location"]
}
}
],
"messages": [
{
"role": "user",
"content": "Say OK."
},
{
"role": "system",
"content": [
{
"type": "tool\_removal",
"tool": {"type": "tool\_reference", "name": "get\_weather"}
}
]
}
]
}'
```
```bash CLI
ant beta:messages create --beta mid-conversation-tool-changes-2026-07-01 \
--transform 'content.#(type=="text").text' --raw-output <<'YAML'
model: claude-opus-5
max\_tokens: 1024
tools:
- name: get\_weather
description: Get the current weather for a location.
input\_schema:
type: object
properties:
location:
type: string
description: City name
required:
- location
messages:
- role: user
content: Say OK.
- role: system
content:
- type: tool\_removal
tool:
type: tool\_reference
name: get\_weather
YAML
```
```python Python
client = anthropic.Anthropic()
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=1024,
betas=["mid-conversation-tool-changes-2026-07-01"],
# The full tool set is declared up front and never changes, so the
# cached prefix stays intact.
tools=[
{
"name": "get\_weather",
"description": "Get the current weather for a location.",
"input\_schema": {
"type": "object",
"properties": {
"location": {"type": "string", "description": "City name"},
},
"required": ["location"],
},
},
],
messages=[
{
"role": "user",
"content": "Say OK.",
},
# Withdraw get\_weather from this point onward. The block references
# the tool by name instead of editing `tools`, so earlier turns stay
# byte-identical and the cache still hits.
{
"role": "system",
"content": [
{
"type": "tool\_removal",
"tool": {"type": "tool\_reference", "name": "get\_weather"},
},
],
},
],
)
for block in response.content:
if block.type == "text":
print(block.text)
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
betas: ["mid-conversation-tool-changes-2026-07-01"],
// The full tool set is declared up front and never changes, so the
// cached prefix stays intact.
tools: [
{
name: "get\_weather",
description: "Get the current weather for a location.",
input\_schema: {
type: "object",
properties: {
location: {
type: "string",
description: "City name"
}
},
required: ["location"]
}
}
],
messages: [
{ role: "user", content: "Say OK." },
// Withdraw get\_weather from this point onward. The block references the
// tool by name instead of editing `tools`, so earlier turns stay
// byte-identical and the cache still hits.
{
role: "system",
content: [
{
type: "tool\_removal",
tool: { type: "tool\_reference", name: "get\_weather" }
}
]
}
]
});
for (const block of response.content) {
if (block.type === "text") {
console.log(block.text);
}
}
```
```csharp C#
using Anthropic.Models.Beta.Messages;
using Messages = Anthropic.Models.Messages;
AnthropicClient client = new();
var response = await client.Beta.Messages.Create(new MessageCreateParams
{
Model = Messages::Model.ClaudeOpus5,
MaxTokens = 1024,
Betas = ["mid-conversation-tool-changes-2026-07-01"],
// The full tool set is declared up front and never changes, so the
// cached prefix stays intact.
Tools =
[
new BetaTool
{
Name = "get\_weather",
Description = "Get the current weather for a location.",
InputSchema = new InputSchema
{
Properties = new Dictionary
{
["location"] = JsonSerializer.SerializeToElement(new { type = "string", description = "City name" }),
},
Required = ["location"],
},
},
],
Messages =
[
new() { Role = Role.User, Content = "Say OK." },
// Withdraw get\_weather from this point onward. The block references
// the tool by name instead of editing `Tools`, so earlier turns stay
// byte-identical and the cache still hits.
new()
{
Role = Role.System,
Content = new(
[
new BetaRequestToolRemovalBlock
{
Tool = new BetaToolChangeToolReference { Name = "get\_weather" },
},
]),
},
],
});
foreach (var block in response.Content)
{
if (block.TryPickText(out var text))
{
Console.WriteLine(text.Text);
}
}
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Betas: []anthropic.AnthropicBeta{"mid-conversation-tool-changes-2026-07-01"},
// The full tool set is declared up front and never changes, so the
// cached prefix stays intact.
Tools: []anthropic.BetaToolUnionParam{
{OfTool: &anthropic.BetaToolParam{
Name: "get\_weather",
Description: anthropic.String("Get the current weather for a location."),
InputSchema: anthropic.BetaToolInputSchemaParam{
Properties: map[string]any{
"location": map[string]any{
"type": "string",
"description": "City name",
},
},
Required: []string{"location"},
},
}},
},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Say OK.")),
// Withdraw get\_weather from this point onward. The block references
// the tool by name instead of editing Tools, so earlier turns stay
// byte-identical and the cache still hits.
{
Role: anthropic.BetaMessageParamRoleSystem,
Content: []anthropic.BetaContentBlockParamUnion{
anthropic.NewBetaToolRemovalBlock(anthropic.BetaToolChangeToolReferenceParam{
Name: "get\_weather",
}),
},
},
},
})
if err != nil {
log.Fatal(err)
}
for \_, block := range response.Content {
if textBlock, ok := block.AsAny().(anthropic.BetaTextBlock); ok {
fmt.Println(textBlock.Text)
}
}
```
```java Java
import com.anthropic.models.beta.messages.BetaContentBlockParam;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.BetaMessageParam;
import com.anthropic.models.beta.messages.BetaRequestToolRemovalBlock;
import com.anthropic.models.beta.messages.BetaTool;
import com.anthropic.models.beta.messages.MessageCreateParams;
// ...
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
// The full tool set is declared up front and never changes, so the
// cached prefix stays intact.
BetaTool weatherTool = BetaTool.builder()
.name("get\_weather")
.description("Get the current weather for a location.")
.inputSchema(BetaTool.InputSchema.builder()
.properties(BetaTool.InputSchema.Properties.builder()
.putAdditionalProperty("location", JsonValue.from(Map.of(
"type", "string",
"description", "City name")))
.build())
.addRequired("location")
.build())
.build();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024)
.addBeta("mid-conversation-tool-changes-2026-07-01")
.addTool(weatherTool)
.addUserMessage("Say OK.")
// Withdraw get\_weather from this point onward. The block references
// the tool by name instead of editing `tools`, so earlier turns stay
// byte-identical and the cache still hits.
.addMessage(BetaMessageParam.builder()
.role(BetaMessageParam.Role.SYSTEM)
.contentOfBetaContentBlockParams(List.of(
BetaContentBlockParam.ofToolRemoval(BetaRequestToolRemovalBlock.builder()
.referenceTool("get\_weather")
.build())))
.build())
.build();
BetaMessage response = client.beta().messages().create(params);
response.content().stream()
.flatMap(block -> block.text().stream())
.forEach(textBlock -> IO.println(textBlock.text()));
```
```php PHP
$client = new Client();
$response = $client->beta->messages->create(
model: 'claude-opus-5',
maxTokens: 1024,
betas: ['mid-conversation-tool-changes-2026-07-01'],
// The full tool set is declared up front and never changes, so the
// cached prefix stays intact.
tools: [
[
'name' => 'get\_weather',
'description' => 'Get the current weather for a location.',
'input\_schema' => [
'type' => 'object',
'properties' => [
'location' => [
'type' => 'string',
'description' => 'City name',
],
],
'required' => ['location'],
],
],
],
messages: [
['role' => 'user', 'content' => 'Say OK.'],
// Withdraw get\_weather from this point onward. The block references
// the tool by name instead of editing `tools`, so earlier turns stay
// byte-identical and the cache still hits.
[
'role' => 'system',
'content' => [
[
'type' => 'tool\_removal',
'tool' => ['type' => 'tool\_reference', 'name' => 'get\_weather'],
],
],
],
],
);
foreach ($response->content as $block) {
if ($block->type === 'text') {
echo $block->text, PHP\_EOL;
}
}
```
```ruby Ruby
client = Anthropic::Client.new
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
betas: ["mid-conversation-tool-changes-2026-07-01"],
# The full tool set is declared up front and never changes, so the
# cached prefix stays intact.
tools: [
{
name: "get\_weather",
description: "Get the current weather for a location.",
input\_schema: {
type: "object",
properties: {
location: { type: "string", description: "City name" }
},
required: ["location"]
}
}
],
messages: [
{ role: "user", content: "Say OK." },
# Withdraw get\_weather from this point onward. The block references
# the tool by name instead of editing `tools`, so earlier turns stay
# byte-identical and the cache still hits.
{
role: "system",
content: [
{
type: "tool\_removal",
tool: { type: "tool\_reference", name: "get\_weather" }
}
]
}
]
)
response.content.each do |block|
puts block.text if block.type == :text
end
```
Mid-conversation tool changes are in beta. To use them, include the beta header `mid-conversation-tool-changes-2026-07-01` in your requests. They are available on Claude Fable 5, Claude Mythos 5, Claude Opus 4.8, and Claude Opus 5, on the Claude API, Amazon Bedrock, and Google Cloud.
## When to use a mid-conversation system message
[Prompt caching](/docs/en/build-with-claude/prompt-caching) hashes the request prefix in order: `tools`, then `system`, then `messages`. A cache hit requires the prefix to match a recent request exactly, byte for byte, up to the cache breakpoint.
That ordering means the top-level `system` field sits near the very start of the hashed prefix. Any change to it, even appending a sentence, produces a different hash, and the request misses the cache for the system prompt and every cached message after it.
Mid-conversation system messages let you add the instruction at the \*\*end\*\* of the message history instead. Everything before the new instruction is unchanged, so the existing cache entry still matches, and only the new message is processed as fresh input.
A few situations where this matters:
\* \*\*Mid-session policy or persona changes.\*\* A long agentic session needs a new constraint ("from now on, write all SQL as parameterized queries") after dozens of cached turns. Adding it to the top-level `system` field would re-process the entire history.
\* \*\*Per-turn context that must be authoritative.\*\* You want to inject a freshness note, a session deadline, or a tool-availability change with system-level weight, and it changes too often to live in the cached prefix.
\* \*\*State changes your application observes.\*\* Your application notices something Claude should treat as an operator-level fact: files changed on disk, the user toggled an auto-approve setting, available tools changed, or the remaining token budget dropped below a threshold.
\* \*\*User input that should not interrupt an agentic loop.\*\* A user types a follow-up while Claude is still executing tools for the previous request. Relaying it as a system message after the next tool result lets Claude fold the new input into the work it is already doing, instead of treating it as a fresh request to switch to. See [Placement after tool results](#placement-after-tool-results) below.
\* \*\*Mode switches that grant standing permissions.\*\* A session-level mode can use a mid-conversation system message to grant standing consent to an expensive capability, such as automatically launching multiagent workflows, with a short refresher every several turns and an exit notice when the mode is turned off. For a worked example, see [Build an orchestration mode](/docs/en/build-with-claude/mid-conversation-effort-example).
In all of these cases you could put the instruction in a regular `user` message, and Claude does follow instructions that arrive in user turns. The difference is priority: a `user` message is treated as coming from the end user, while a `system` message is treated as coming from you, the application operator. When the two conflict, system instructions take precedence, so use the `system` role for operator-level facts and constraints that should hold even if the end user asks for something different. A mid-conversation system message keeps that operator-level priority without paying the cache-miss cost of editing the top-level `system` field.
## How it works
Add a message with `"role": "system"` to the `messages` array. Use a plain string or content blocks for `content`, the same as a `user` or `assistant` turn. The instruction applies from that point in the conversation onward. When instructions conflict, later system messages take precedence over earlier ones, and mid-conversation system messages take precedence over the top-level `system` field for the turns that follow them.
You can still set the top-level `system` field for instructions that should apply to the entire conversation. Reserve mid-conversation system messages for instructions that only become relevant later, or that you want to add without invalidating the cached prefix.
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"cache\_control": {"type": "ephemeral"},
"system": "You are a code review assistant. Be concise.",
"messages": [
{
"role": "user",
"content": "Review process() in utils.py for performance issues."
},
{
"role": "assistant",
"content": "The list comprehension is fine for small inputs. For large inputs, consider a generator to avoid materializing the full list."
},
{
"role": "user",
"content": "Now review the calling code that invokes process()."
},
{
"role": "system",
"content": "From now on, every suggestion must include explicit type annotations."
}
]
}'
```
```bash CLI
ant messages create --transform 'content.#(type=="text").text' --raw-output <<'YAML'
model: claude-opus-5
max\_tokens: 1024
cache\_control:
type: ephemeral
system: You are a code review assistant. Be concise.
messages:
- role: user
content: Review process() in utils.py for performance issues.
- role: assistant
content: >-
The list comprehension is fine for small inputs. For large inputs,
consider a generator to avoid materializing the full list.
- role: user
content: Now review the calling code that invokes process().
- role: system
content: From now on, every suggestion must include explicit type annotations.
YAML
```
```python Python
client = anthropic.Anthropic()
response = client.messages.create(
model="claude-opus-5",
max\_tokens=1024,
# Automatic prompt caching: each request caches the conversation so far,
# and the next request reads the unchanged prefix from cache.
cache\_control={"type": "ephemeral"},
system="You are a code review assistant. Be concise.",
messages=[
{
"role": "user",
"content": "Review process() in utils.py for performance issues.",
},
{
"role": "assistant",
"content": "The list comprehension is fine for small inputs. For large inputs, consider a generator to avoid materializing the full list.",
},
{
"role": "user",
"content": "Now review the calling code that invokes process().",
},
# The reviewer realizes mid-session that all suggestions must
# also pass the team's strict typing policy. Appending the
# instruction here keeps earlier turns byte-identical, so the
# prefix cached by the previous request is still read from cache.
{
"role": "system",
"content": "From now on, every suggestion must include explicit type annotations.",
},
],
)
for block in response.content:
if block.type == "text":
print(block.text)
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
// Automatic prompt caching: each request caches the conversation so far,
// and the next request reads the unchanged prefix from cache.
cache\_control: { type: "ephemeral" },
system: "You are a code review assistant. Be concise.",
messages: [
{
role: "user",
content: "Review process() in utils.py for performance issues."
},
{
role: "assistant",
content:
"The list comprehension is fine for small inputs. For large inputs, consider a generator to avoid materializing the full list."
},
{
role: "user",
content: "Now review the calling code that invokes process()."
},
// The reviewer realizes mid-session that all suggestions must also pass
// the team's strict typing policy. Appending the instruction here keeps
// earlier turns byte-identical, so the prefix cached by the previous
// request is still read from cache.
{
role: "system",
content: "From now on, every suggestion must include explicit type annotations."
}
]
});
const textBlock = response.content.find(
(block): block is Anthropic.TextBlock => block.type === "text"
);
console.log(textBlock?.text);
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
// Automatic prompt caching: each request caches the conversation so far,
// and the next request reads the unchanged prefix from cache.
CacheControl = new CacheControlEphemeral(),
System = "You are a code review assistant. Be concise.",
Messages =
[
new()
{
Role = Role.User,
Content = "Review process() in utils.py for performance issues."
},
new()
{
Role = Role.Assistant,
Content = "The list comprehension is fine for small inputs. For large inputs, consider a generator to avoid materializing the full list."
},
new()
{
Role = Role.User,
Content = "Now review the calling code that invokes process()."
},
// The reviewer realizes mid-session that all suggestions must also pass
// the team's strict typing policy. Appending the instruction here keeps
// earlier turns byte-identical, so the prefix cached by the previous
// request is still read from cache.
new()
{
Role = Role.System,
Content = "From now on, every suggestion must include explicit type annotations."
}
]
};
var response = await client.Messages.Create(parameters);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
// Automatic prompt caching: each request caches the conversation so far,
// and the next request reads the unchanged prefix from cache.
CacheControl: anthropic.NewCacheControlEphemeralParam(),
System: []anthropic.TextBlockParam{
{Text: "You are a code review assistant. Be concise."},
},
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("Review process() in utils.py for performance issues.")),
anthropic.NewAssistantMessage(anthropic.NewTextBlock("The list comprehension is fine for small inputs. For large inputs, consider a generator to avoid materializing the full list.")),
anthropic.NewUserMessage(anthropic.NewTextBlock("Now review the calling code that invokes process().")),
// The reviewer realizes mid-session that all suggestions must also
// pass the team's strict typing policy. Appending the instruction
// here keeps earlier turns byte-identical, so the prefix cached by
// the previous request is still read from cache.
{
Role: anthropic.MessageParamRoleSystem,
Content: []anthropic.ContentBlockParamUnion{
anthropic.NewTextBlock("From now on, every suggestion must include explicit type annotations."),
},
},
},
})
if err != nil {
log.Fatal(err)
}
for \_, block := range response.Content {
if textBlock, ok := block.AsAny().(anthropic.TextBlock); ok {
fmt.Println(textBlock.Text)
}
}
```
```java Java
import com.anthropic.models.messages.CacheControlEphemeral;
// ...
import com.anthropic.models.messages.MessageParam;
// ...
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024)
// Automatic prompt caching: each request caches the conversation so far,
// and the next request reads the unchanged prefix from cache.
.cacheControl(CacheControlEphemeral.builder().build())
.system("You are a code review assistant. Be concise.")
.addUserMessage("Review process() in utils.py for performance issues.")
.addAssistantMessage("The list comprehension is fine for small inputs. For large inputs, consider a generator to avoid materializing the full list.")
.addUserMessage("Now review the calling code that invokes process().")
// The reviewer realizes mid-session that all suggestions must also pass
// the team's strict typing policy. Appending the instruction here keeps
// earlier turns byte-identical, so the prefix cached by the previous
// request is still read from cache.
.addMessage(MessageParam.builder()
.role(MessageParam.Role.SYSTEM)
.content("From now on, every suggestion must include explicit type annotations.")
.build())
.build();
Message response = client.messages().create(params);
response.content().stream()
.flatMap(block -> block.text().stream())
.forEach(textBlock -> IO.println(textBlock.text()));
```
```php PHP
use Anthropic\Messages\CacheControlEphemeral;
// ...
$client = new Client();
$response = $client->messages->create(
maxTokens: 1024,
messages: [
['role' => 'user', 'content' => 'Review process() in utils.py for performance issues.'],
['role' => 'assistant', 'content' => 'The list comprehension is fine for small inputs. For large inputs, consider a generator to avoid materializing the full list.'],
['role' => 'user', 'content' => 'Now review the calling code that invokes process().'],
// The reviewer realizes mid-session that all suggestions must also pass
// the team's strict typing policy. Appending the instruction here keeps
// earlier turns byte-identical, so the prefix cached by the previous
// request is still read from cache.
['role' => 'system', 'content' => 'From now on, every suggestion must include explicit type annotations.']
],
model: 'claude-opus-5',
// Automatic prompt caching: each request caches the conversation so far,
// and the next request reads the unchanged prefix from cache.
cacheControl: CacheControlEphemeral::with(),
system: 'You are a code review assistant. Be concise.',
);
foreach ($response->content as $block) {
if ($block->type === 'text') {
echo $block->text, PHP\_EOL;
}
}
```
```ruby Ruby
client = Anthropic::Client.new
response = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
# Automatic prompt caching: each request caches the conversation so far,
# and the next request reads the unchanged prefix from cache.
cache\_control: { type: "ephemeral" },
system: "You are a code review assistant. Be concise.",
messages: [
{ role: "user", content: "Review process() in utils.py for performance issues." },
{ role: "assistant", content: "The list comprehension is fine for small inputs. For large inputs, consider a generator to avoid materializing the full list." },
{ role: "user", content: "Now review the calling code that invokes process()." },
# The reviewer realizes mid-session that all suggestions must also pass
# the team's strict typing policy. Appending the instruction here keeps
# earlier turns byte-identical, so the prefix cached by the previous
# request is still read from cache.
{ role: "system", content: "From now on, every suggestion must include explicit type annotations." }
]
)
response.content.each do |block|
puts block.text if block.type == :text
end
```
This example enables [automatic caching](/docs/en/build-with-claude/prompt-caching#automatic-caching) with the top-level `cache\_control` field. Prompt caching is opt-in: if a request has no `cache\_control` field (automatic or an [explicit breakpoint](/docs/en/build-with-claude/prompt-caching#explicit-cache-breakpoints)), nothing is cached and every request pays the regular input token price for the full conversation. With caching enabled, appending the system message leaves the already-cached turns unchanged, so the request that carries the new instruction still reads them from cache instead of processing them again. Caching also requires the conversation to meet the [minimum cacheable prompt length](/docs/en/build-with-claude/prompt-caching#cache-limitations); an example as short as this one falls below it, so `cache\_creation\_input\_tokens` and `cache\_read\_input\_tokens` stay at 0 until the conversation grows.
A mid-conversation system message must immediately follow a `user` turn (or an `assistant` turn ending in a server tool result), and must either be the last entry in `messages` or be immediately followed by an `assistant` turn. A `user` message that carries `tool\_result` blocks counts: in an agentic loop you can place the system message right after the tool results, before Claude's next turn. Any other position, including between an `assistant` `tool\_use` block and the `tool\_result` that answers it, returns a 400 error.
### Placement after tool results
In an [agentic loop](/docs/en/agents-and-tools/tool-use/overview), the system message goes after the `user` message that delivers the tool results. This is also where your application can relay input that the user typed while Claude was working, so the new context is absorbed without restarting the turn:
```json
[
{ "role": "user", "content": "Run the test suite and fix any failures." },
{
"role": "assistant",
"content": [{ "type": "tool\_use", "id": "toolu\_01", "name": "run\_tests", "input": {} }]
},
{
"role": "user",
"content": [
{ "type": "tool\_result", "tool\_use\_id": "toolu\_01", "content": "12 passed, 0 failed" }
]
},
{
"role": "system",
"content": "The user sent the following message while you were working: also update the changelog before you finish."
}
]
```
Phrase the system content as context rather than as a command that overrides the user. State the fact ("new input arrived from the user: X", "the remaining token budget is now Y") and let Claude act on it. Claude is trained to resist instructions that appear to work against the user, and that protection still applies to the system role, so language such as "ignore what the user said" is less effective than stating what changed.
This pattern is for relaying input from the conversation's own end user. Do not use it to pass tool output, retrieved documents, or other third-party content; keep that content in `tool\_result` blocks (see [Limitations](#limitations)).
## Combining with prompt caching
Mid-conversation system messages and [prompt caching](/docs/en/build-with-claude/prompt-caching) are designed to be used together:
\* \*\*Enable caching explicitly.\*\* Caching only happens when the request includes `cache\_control`, either the top-level [automatic caching](/docs/en/build-with-claude/prompt-caching#automatic-caching) field or an [explicit breakpoint](/docs/en/build-with-claude/prompt-caching#explicit-cache-breakpoints) on a content block. A mid-conversation system message does not create a cache entry on its own, and without caching enabled there are no savings to preserve.
\* \*\*Cache the stable prefix as usual.\*\* Place `cache\_control` on the last block that stays the same across requests, whether that is the end of the top-level `system` field, the end of your tool definitions, or a stable point in the message history.
\* \*\*Append the system message after the breakpoint.\*\* Because it comes after the cached prefix, it does not change the prefix hash and the cache still hits.
\* \*\*A mid-conversation system message is itself cacheable.\*\* Once it is in the conversation, it becomes part of the stable history. On the next turn you can move your cache breakpoint past it (or rely on [automatic caching](/docs/en/build-with-claude/prompt-caching#automatic-caching) to do so) and the system message is read from cache like any other turn.
Avoid editing or removing a mid-conversation system message that has already been sent. Like any other change to earlier messages, that invalidates the cache from that point forward. If the instruction needs to evolve, append a new system message rather than rewriting the old one. Consecutive system messages are accepted and treated as a single system section, which follows the same placement rule as a whole.
## Limitations
\* \*\*Not for the first message.\*\* A `system` message cannot be the first entry in `messages`. Use the top-level `system` field for instructions that apply from the very start.
\* \*\*Placement is constrained.\*\* A `system` message must immediately follow a `user` turn (including a `user` turn that carries `tool\_result` blocks) or an `assistant` turn ending in a server tool result, and must precede an `assistant` turn or end the array. It cannot sit between a `tool\_use` block and its `tool\_result`. Placing it elsewhere returns a 400 error.
\* \*\*Not a place for untrusted content.\*\* Claude treats system content as operator instructions and follows it. Do not place text from outside the conversation, such as raw tool output, retrieved documents, or web content, directly in a system message; doing so gives that text operator-level authority. Keep that data in `tool\_result` blocks and continue to follow [Mitigate jailbreaks and prompt injections](/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks).
## Related

How caching works, where to place breakpoints, and how to read cache usage fields.

Find out exactly where two requests diverged when a cache hit you expected does not happen.

Message structure, multi-turn conversations, and the `system` field.

Writing effective prompts and system instructions.

How `tool\_use` and `tool\_result` blocks are structured in the `messages` array.
