# Tool use with Claude

Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview.md

# Tool use with Claude
Connect Claude to external tools and APIs. See where tools execute, when Claude calls them, and which tool fits your task.
---
Tool use lets Claude call functions that you define or that Anthropic provides. Claude determines when to call a tool based on the user's request and the tool's description. It then returns a structured call that your application executes (client tools) or that Anthropic executes (server tools).
Here's a minimal example using a server tool, the [Web search tool](/docs/en/agents-and-tools/tool-use/web-search-tool), which Anthropic executes for you:
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"tools": [{"type": "web\_search\_20260209", "name": "web\_search"}],
"messages": [{"role": "user", "content": "What'\''s the latest on the Mars rover?"}]
}'
```
```bash CLI
ant messages create --transform content --format yaml \
--model claude-opus-5 \
--max-tokens 1024 \
--tool '{type: web\_search\_20260209, name: web\_search}' \
--message '{role: user, content: "What is the latest on the Mars rover?"}'
```
```python Python
client = anthropic.Anthropic()
response = client.messages.create(
model="claude-opus-5",
max\_tokens=1024,
tools=[{"type": "web\_search\_20260209", "name": "web\_search"}],
messages=[{"role": "user", "content": "What's the latest on the Mars rover?"}],
)
print(response.content)
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
tools: [{ type: "web\_search\_20260209", name: "web\_search" }],
messages: [{ role: "user", content: "What's the latest on the Mars rover?" }]
});
console.log(response.content);
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Tools = [new ToolUnion(new WebSearchTool20260209())],
Messages = [new() { Role = Role.User, Content = "What's the latest on the Mars rover?" }]
};
var message = await client.Messages.Create(parameters);
Console.WriteLine(message.Content);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Tools: []anthropic.ToolUnionParam{
{OfWebSearchTool20260209: &anthropic.WebSearchTool20260209Param{}},
},
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("What's the latest on the Mars rover?")),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response.Content)
```
```java Java
import com.anthropic.models.messages.WebSearchTool20260209;
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addTool(WebSearchTool20260209.builder().build())
.addUserMessage("What's the latest on the Mars rover?")
.build();
Message response = client.messages().create(params);
IO.println(response.content());
}
```
```php PHP
$client = new Client();
$message = $client->messages->create(
model: 'claude-opus-5',
maxTokens: 1024,
tools: [
['type' => 'web\_search\_20260209', 'name' => 'web\_search'],
],
messages: [
['role' => 'user', 'content' => "What's the latest on the Mars rover?"],
],
);
echo $message;
```
```ruby Ruby
client = Anthropic::Client.new
message = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
tools: [{ type: "web\_search\_20260209", name: "web\_search" }],
messages: [{ role: "user", content: "What's the latest on the Mars rover?" }]
)
puts message.content
```
Claude runs the search on Anthropic's infrastructure and returns the cited results in the same response. To have Claude call a function that you define, pass a tool with an `input\_schema`, then execute the call when Claude returns a `tool\_use` block. [How tool use works](#how-tool-use-works) shows that round trip end to end. Learn more about [defining tools](/docs/en/agents-and-tools/tool-use/define-tools) and [handling tool calls](/docs/en/agents-and-tools/tool-use/handle-tool-calls).
## How tool use works
Tools differ primarily by where the code executes. \*\*Client tools\*\* (including user-defined tools and tools with Anthropic-defined schemas, such as `bash` and `text\_editor`) run in your application. Claude responds with `stop\_reason: "tool\_use"` and one or more `tool\_use` blocks. Your code executes the operation and sends back a `tool\_result`. \*\*Server tools\*\* (such as `web\_search`, `web\_fetch`, `code\_execution`, and `tool\_search`) run on Anthropic's infrastructure: you see the results directly without handling execution, unless Claude calls the tool in the same group of parallel tool calls as one of your client tools (see [Stop reasons and fallback](/docs/en/build-with-claude/handling-stop-reasons#tool-use)).
Here's that round trip in full for a client tool. The first request defines a `get\_weather` tool, and Claude answers the question by calling it: the response carries a `tool\_use` block, your code runs the lookup, and a second request sends the result back in a `tool\_result` block so Claude can reply with the answer.
```bash cURL
# Claude replies with a tool\_use block naming the tool and its arguments.
TOOLS='[
{
"name": "get\_weather",
"description": "Get the current weather for a given location.",
"input\_schema": {
"type": "object",
"properties": {
"location": {"type": "string", "description": "City and state, e.g. San Francisco, CA"}
},
"required": ["location"]
}
}
]'
USER\_MSG="What's the weather in San Francisco?"
RESPONSE=$(curl -s https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-d "$(jq -n --argjson tools "$TOOLS" --arg msg "$USER\_MSG" '{
model: "claude-opus-5",
max\_tokens: 1024,
tools: $tools,
# Ask for at most one tool call per turn.
tool\_choice: {type: "auto", disable\_parallel\_tool\_use: true},
messages: [{role: "user", content: $msg}]
}')")
TOOL\_USE=$(echo "$RESPONSE" | jq '.content[] | select(.type == "tool\_use")')
echo "Claude called $(echo "$TOOL\_USE" | jq -r '.name') with $(echo "$TOOL\_USE" | jq -c '.input')"
# Run the tool, then send the result back in a tool\_result block.
WEATHER="15 degrees Celsius, partly cloudy"
FOLLOWUP=$(curl -s https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-d "$(jq -n \
--argjson tools "$TOOLS" \
--arg msg "$USER\_MSG" \
--argjson assistant "$(echo "$RESPONSE" | jq '.content')" \
--arg tool\_use\_id "$(echo "$TOOL\_USE" | jq -r '.id')" \
--arg weather "$WEATHER" \
'{
model: "claude-opus-5",
max\_tokens: 1024,
tools: $tools,
tool\_choice: {type: "auto", disable\_parallel\_tool\_use: true},
messages: [
{role: "user", content: $msg},
{role: "assistant", content: $assistant},
{role: "user", content: [
{type: "tool\_result", tool\_use\_id: $tool\_use\_id, content: $weather}
]}
]
}')")
# Claude uses the result to answer the original question.
echo "$FOLLOWUP" | jq -r '.content[] | select(.type == "text") | .text'
```
```bash CLI
# ant reads the request body as YAML on stdin; jq carries the conversation
# state into the second request.
USER\_MSG="What's the weather in San Francisco?"
MESSAGES=$(jq -n --arg msg "$USER\_MSG" '[{role: "user", content: $msg}]')
call\_api() {
{
cat <<'YAML'
model: claude-opus-5
max\_tokens: 1024
# Ask for at most one tool call per turn.
tool\_choice: {type: auto, disable\_parallel\_tool\_use: true}
tools:
- name: get\_weather
description: Get the current weather for a given location.
input\_schema:
type: object
properties:
location: {type: string, description: "City and state, e.g. San Francisco, CA"}
required: [location]
YAML
printf 'messages: %s\n' "$MESSAGES"
} | ant messages create --format json
}
# Claude replies with a tool\_use block naming the tool and its arguments.
RESPONSE=$(call\_api)
TOOL\_USE=$(jq '.content[] | select(.type == "tool\_use")' <<<"$RESPONSE")
echo "Claude called $(jq -r '.name' <<<"$TOOL\_USE") with $(jq -c '.input' <<<"$TOOL\_USE")"
# Run the tool, then send the result back in a tool\_result block.
WEATHER="15 degrees Celsius, partly cloudy"
MESSAGES=$(jq \
--argjson assistant "$(jq '.content' <<<"$RESPONSE")" \
--arg tool\_use\_id "$(jq -r '.id' <<<"$TOOL\_USE")" \
--arg weather "$WEATHER" \
'. + [
{role: "assistant", content: $assistant},
{role: "user", content: [
{type: "tool\_result", tool\_use\_id: $tool\_use\_id, content: $weather}
]}
]' <<<"$MESSAGES")
FOLLOWUP=$(call\_api)
# Claude uses the result to answer the original question.
jq -r '.content[] | select(.type == "text") | .text' <<<"$FOLLOWUP"
```
```python Python
client = anthropic.Anthropic()
tools = [
{
"name": "get\_weather",
"description": "Get the current weather for a given location.",
"input\_schema": {
"type": "object",
"properties": {
"location": {
"type": "string",
"description": "City and state, e.g. San Francisco, CA",
}
},
"required": ["location"],
},
}
]
messages = [{"role": "user", "content": "What's the weather in San Francisco?"}]
# Claude replies with a tool\_use block naming the tool and its arguments.
response = client.messages.create(
model="claude-opus-5",
max\_tokens=1024,
tools=tools,
# Ask for at most one tool call per turn.
tool\_choice={"type": "auto", "disable\_parallel\_tool\_use": True},
messages=messages,
)
tool\_use = next(block for block in response.content if block.type == "tool\_use")
print(f"Claude called {tool\_use.name} with {json.dumps(tool\_use.input)}")
# Run the tool, then send the result back in a tool\_result block.
weather = "15 degrees Celsius, partly cloudy" # your weather lookup goes here
messages += [
{"role": "assistant", "content": response.content},
{
"role": "user",
"content": [
{"type": "tool\_result", "tool\_use\_id": tool\_use.id, "content": weather}
],
},
]
followup = client.messages.create(
model="claude-opus-5",
max\_tokens=1024,
tools=tools,
tool\_choice={"type": "auto", "disable\_parallel\_tool\_use": True},
messages=messages,
)
# Claude uses the result to answer the original question.
final\_text = next(block for block in followup.content if block.type == "text")
print(final\_text.text)
```
```typescript TypeScript
const client = new Anthropic();
const tools: Anthropic.Tool[] = [
{
name: "get\_weather",
description: "Get the current weather for a given location.",
input\_schema: {
type: "object",
properties: {
location: { type: "string", description: "City and state, e.g. San Francisco, CA" }
},
required: ["location"]
}
}
];
const messages: Anthropic.MessageParam[] = [
{ role: "user", content: "What's the weather in San Francisco?" }
];
// Claude replies with a tool\_use block naming the tool and its arguments.
const response = await client.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
tools,
// Ask for at most one tool call per turn.
tool\_choice: { type: "auto", disable\_parallel\_tool\_use: true },
messages
});
const toolUse = response.content.find(
(block): block is Anthropic.ToolUseBlock => block.type === "tool\_use"
)!;
console.log(`Claude called ${toolUse.name} with ${JSON.stringify(toolUse.input)}`);
// Run the tool, then send the result back in a tool\_result block.
const weather = "15 degrees Celsius, partly cloudy"; // your weather lookup goes here
messages.push(
{ role: "assistant", content: response.content },
{
role: "user",
content: [{ type: "tool\_result", tool\_use\_id: toolUse.id, content: weather }]
}
);
const followup = await client.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
tools,
tool\_choice: { type: "auto", disable\_parallel\_tool\_use: true },
messages
});
// Claude uses the result to answer the original question.
const finalText = followup.content.find(
(block): block is Anthropic.TextBlock => block.type === "text"
)!;
console.log(finalText.text);
```
```csharp C#
AnthropicClient client = new();
List tools =
[
new ToolUnion(new Tool()
{
Name = "get\_weather",
Description = "Get the current weather for a given location.",
InputSchema = new InputSchema()
{
Properties = new Dictionary
{
["location"] = JsonSerializer.SerializeToElement(new
{
type = "string",
description = "City and state, e.g. San Francisco, CA",
}),
},
Required = ["location"],
},
}),
];
// Ask for at most one tool call per turn.
var toolChoice = new ToolChoice(new ToolChoiceAuto { DisableParallelToolUse = true });
const string userPrompt = "What's the weather in San Francisco?";
// Claude replies with a tool\_use block naming the tool and its arguments.
var response = await client.Messages.Create(new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Tools = tools,
ToolChoice = toolChoice,
Messages = [new() { Role = Role.User, Content = userPrompt }],
});
ToolUseBlock? toolUse = null;
foreach (var block in response.Content)
{
if (block.TryPickToolUse(out var picked))
{
toolUse = picked;
break;
}
}
Console.WriteLine($"Claude called {toolUse!.Name} with {JsonSerializer.Serialize(toolUse.Input)}");
// Run the tool, then send the result back in a tool\_result block.
var weather = "15 degrees Celsius, partly cloudy";
List toolResults =
[
new ContentBlockParam(new ToolResultBlockParam()
{
ToolUseID = toolUse.ID,
Content = weather,
}),
];
var followup = await client.Messages.Create(new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Tools = tools,
ToolChoice = toolChoice,
Messages =
[
new() { Role = Role.User, Content = userPrompt },
new() { Role = Role.Assistant, Content = response.Content.Select(block => new ContentBlockParam(block.Json)).ToList() },
new() { Role = Role.User, Content = new MessageParamContent(toolResults) },
],
});
// Claude uses the result to answer the original question.
foreach (var block in followup.Content)
{
if (block.TryPickText(out var text))
{
Console.WriteLine(text.Text);
}
}
```
```go Go
client := anthropic.NewClient()
ctx := context.Background()
tools := []anthropic.ToolUnionParam{
{OfTool: &anthropic.ToolParam{
Name: "get\_weather",
Description: anthropic.String("Get the current weather for a given location."),
InputSchema: anthropic.ToolInputSchemaParam{
Properties: map[string]any{
"location": map[string]any{
"type": "string",
"description": "City and state, e.g. San Francisco, CA",
},
},
Required: []string{"location"},
},
}},
}
// Ask for at most one tool call per turn.
toolChoice := anthropic.ToolChoiceUnionParam{
OfAuto: &anthropic.ToolChoiceAutoParam{DisableParallelToolUse: anthropic.Bool(true)},
}
messages := []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("What's the weather in San Francisco?")),
}
// Claude replies with a tool\_use block naming the tool and its arguments.
response, err := client.Messages.New(ctx, anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Tools: tools,
ToolChoice: toolChoice,
Messages: messages,
})
if err != nil {
log.Fatal(err)
}
var toolUse anthropic.ContentBlockUnion
for \_, block := range response.Content {
if block.Type == "tool\_use" {
toolUse = block
break
}
}
fmt.Printf("Claude called %s with %s\n", toolUse.Name, string(toolUse.Input))
// Run the tool, then send the result back in a tool\_result block.
weather := "15 degrees Celsius, partly cloudy"
var assistantContent []anthropic.ContentBlockParamUnion
for \_, block := range response.Content {
assistantContent = append(assistantContent, block.ToParam())
}
messages = append(messages,
anthropic.NewAssistantMessage(assistantContent...),
anthropic.NewUserMessage(anthropic.NewToolResultBlock(toolUse.ID, weather, false)),
)
followup, err := client.Messages.New(ctx, anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Tools: tools,
ToolChoice: toolChoice,
Messages: messages,
})
if err != nil {
log.Fatal(err)
}
// Claude uses the result to answer the original question.
for \_, block := range followup.Content {
if block.Type == "text" {
fmt.Println(block.Text)
}
}
```
```java Java
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.ContentBlockParam;
// ...
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;
import com.anthropic.models.messages.ToolChoiceAuto;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlock;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
Tool weatherTool = Tool.builder()
.name("get\_weather")
.description("Get the current weather for a given location.")
.inputSchema(InputSchema.builder()
.properties(JsonValue.from(Map.of(
"location", Map.of(
"type", "string",
"description", "City and state, e.g. San Francisco, CA"
)
)))
.required(List.of("location"))
.build())
.build();
// Ask for at most one tool call per turn.
ToolChoiceAuto toolChoice = ToolChoiceAuto.builder()
.disableParallelToolUse(true)
.build();
String userPrompt = "What's the weather in San Francisco?";
// Claude replies with a tool\_use block naming the tool and its arguments.
Message response = client.messages().create(MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addTool(weatherTool)
.toolChoice(toolChoice)
.addUserMessage(userPrompt)
.build());
ToolUseBlock toolUse = response.content().stream()
.flatMap(block -> block.toolUse().stream())
.findFirst()
.orElseThrow();
IO.println("Claude called " + toolUse.name() + " with " + toolUse.\_input());
// Run the tool, then send the result back in a tool\_result block.
String weather = "15 degrees Celsius, partly cloudy";
Message followup = client.messages().create(MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addTool(weatherTool)
.toolChoice(toolChoice)
.addUserMessage(userPrompt)
.addMessage(response)
.addUserMessageOfBlockParams(List.of(ContentBlockParam.ofToolResult(
ToolResultBlockParam.builder()
.toolUseId(toolUse.id())
.content(weather)
.build())))
.build());
// Claude uses the result to answer the original question.
followup.content().stream()
.flatMap(block -> block.text().stream())
.forEach(textBlock -> IO.println(textBlock.text()));
}
```
```php PHP
use Anthropic\Messages\ToolChoiceAuto;
$client = new Client();
$tools = [
[
'name' => 'get\_weather',
'description' => 'Get the current weather for a given location.',
'input\_schema' => [
'type' => 'object',
'properties' => [
'location' => [
'type' => 'string',
'description' => 'City and state, e.g. San Francisco, CA',
],
],
'required' => ['location'],
],
],
];
$userMessage = ['role' => 'user', 'content' => "What's the weather in San Francisco?"];
// Ask for at most one tool call per turn.
$toolChoice = ToolChoiceAuto::with(disableParallelToolUse: true);
// Claude replies with a tool\_use block naming the tool and its arguments.
$response = $client->messages->create(
model: 'claude-opus-5',
maxTokens: 1024,
tools: $tools,
toolChoice: $toolChoice,
messages: [$userMessage],
);
$toolUse = null;
foreach ($response->content as $block) {
if ($block->type === 'tool\_use') {
$toolUse = $block;
break;
}
}
printf("Claude called %s with %s\n", $toolUse->name, json\_encode($toolUse->input));
// Run the tool, then send the result back in a tool\_result block.
$weather = '15 degrees Celsius, partly cloudy';
$followup = $client->messages->create(
model: 'claude-opus-5',
maxTokens: 1024,
tools: $tools,
toolChoice: $toolChoice,
messages: [
$userMessage,
['role' => 'assistant', 'content' => $response->content],
[
'role' => 'user',
'content' => [
[
'type' => 'tool\_result',
'tool\_use\_id' => $toolUse->id,
'content' => $weather,
],
],
],
],
);
// Claude uses the result to answer the original question.
foreach ($followup->content as $block) {
if ($block->type === 'text') {
echo $block->text, "\n";
}
}
```
```ruby Ruby
client = Anthropic::Client.new
tools = [
{
name: "get\_weather",
description: "Get the current weather for a given location.",
input\_schema: {
type: "object",
properties: {
location: {type: "string", description: "City and state, e.g. San Francisco, CA"}
},
required: ["location"]
}
}
]
messages = [{role: "user", content: "What's the weather in San Francisco?"}]
# Claude replies with a tool\_use block naming the tool and its arguments.
response = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
tools: tools,
# Ask for at most one tool call per turn.
tool\_choice: {type: "auto", disable\_parallel\_tool\_use: true},
messages: messages
)
tool\_use = response.content.find { |block| block.type == :tool\_use }
puts "Claude called #{tool\_use.name} with #{JSON.generate(tool\_use.input)}"
# Run the tool, then send the result back in a tool\_result block.
weather = "15 degrees Celsius, partly cloudy"
messages += [
{role: "assistant", content: response.content},
{
role: "user",
content: [
{type: "tool\_result", tool\_use\_id: tool\_use.id, content: weather}
]
}
]
followup = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
tools: tools,
tool\_choice: {type: "auto", disable\_parallel\_tool\_use: true},
messages: messages
)
# Claude uses the result to answer the original question.
final\_text = followup.content.find { |block| block.type == :text }
puts final\_text.text
```
```text Output wrap
Claude called get\_weather with {"location": "San Francisco, CA"}
The current weather in San Francisco is 15 degrees Celsius with partly cloudy skies.
```
[Handle tool calls](/docs/en/agents-and-tools/tool-use/handle-tool-calls) covers each step in detail, including result formatting and error signaling; [Parallel tool use](/docs/en/agents-and-tools/tool-use/parallel-tool-use) covers responses that call several tools at once. To skip writing this round trip yourself, use [Tool Runner](/docs/en/agents-and-tools/tool-use/tool-runner): the SDKs execute your tools and send the results back automatically.
For the full conceptual model including the agentic loop and when to choose each approach, see [How tool use works](/docs/en/agents-and-tools/tool-use/how-tool-use-works).
For connecting to Model Context Protocol (MCP) servers, see the [MCP connector](/docs/en/agents-and-tools/mcp-connector). For building your own MCP client, see the Model Context Protocol guide to [building an MCP client](https://modelcontextprotocol.io/docs/develop/build-client).
## When Claude uses tools
With the default `tool\_choice` of `{"type": "auto"}`, Claude determines on each turn whether to call a tool or respond directly. It calls a tool when the request maps to that tool's described capability and the answer isn't already in context. It responds directly for stable knowledge, creative tasks, and conversational turns.
This boundary is steerable through your system prompt. If Claude isn't calling tools when you expect, a light instruction such as `"Use the tools to investigate before responding."` increases tool use. A stronger form such as `"Always call a tool first before responding."` pushes further. Conversely, `"Use your judgment about whether to call a tool or respond directly."` keeps triggering behavior conservative.
To require a tool call rather than rely on prompting, set [`tool\_choice`](/docs/en/agents-and-tools/tool-use/define-tools#forcing-tool-use).
\*\*Guarantee schema conformance with strict tool use\*\*
Add `strict: true` to your custom tool definitions to ensure Claude's tool calls always match your schema exactly. See [Strict tool use](/docs/en/agents-and-tools/tool-use/strict-tool-use).
Each server tool's page describes its own trigger boundary in more detail.
If the user's prompt doesn't include enough information to fill all the required parameters for a tool, Claude Opus is much more likely to recognize that a parameter is missing and ask for it. Claude Sonnet might ask, especially when prompted to think before outputting a tool request. But it might also infer a reasonable value.
For example, given a `get\_weather` tool that requires a `location` parameter, if you ask Claude "What's the weather?" without specifying a location, Claude (particularly Claude Sonnet) might guess values you didn't supply:
```json JSON
{
"type": "tool\_use",
"id": "toolu\_01A09q90qw90lq917835lq9",
"name": "get\_weather",
"input": { "location": "New York, NY", "unit": "fahrenheit" }
}
```
This behavior is not guaranteed, especially for more ambiguous prompts and for less capable models.
## Choose a tool
For `type` strings, versions, and beta headers, see [Tool reference](/docs/en/agents-and-tools/tool-use/tool-reference).
### Your own tools
For tools you define, you write the schema and your application executes each call.

Specify tool schemas, write descriptions, and control when Claude calls your tools.

Parse `tool\_use` blocks, format `tool\_result` responses, and handle errors.
### Anthropic-schema client tools
Anthropic publishes the schema and trains Claude on it. Your application still executes each call and returns the `tool\_result`.

Store and retrieve information across conversations in files you control.

Run shell commands in a persistent session that maintains state.

View and modify text files to debug, fix, and improve code.

Take screenshots and control the mouse and keyboard in a desktop environment.
### Server tools
Server tools run on Anthropic's infrastructure, with no handler code in your application. See [Server tools](/docs/en/agents-and-tools/tool-use/server-tools) for the mechanics they share.

Search the web for information beyond the knowledge cutoff, with cited sources.

Retrieve the full content of specified web pages and PDF documents.

Run Python and bash code in a sandboxed container to analyze data and generate files.

Let a faster executor model consult a higher-intelligence advisor model mid-generation.

Work with thousands of tools by discovering and loading them on demand.

Connect to remote MCP servers from the Messages API without a separate MCP client.

[Claude Managed Agents](/docs/en/managed-agents/overview) provides a built-in toolset that Claude uses autonomously within a session. For that toolset and the Managed Agents way to add custom tools, see its [Tools](/docs/en/managed-agents/tools) page.
## Pricing
Tool use requests are priced based on:
1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)
Client-side tools are priced the same as any other Claude API request, while server-side tools may incur additional charges based on their specific usage.
The additional tokens from tool use come from:
\* The `tools` parameter in API requests (tool names, descriptions, and schemas)
\* `tool\_use` content blocks in API requests and responses
\* `tool\_result` content blocks in API requests
When you use `tools`, the API also automatically includes a special system prompt for the model which enables tool use. The number of tool use tokens required for each model are listed below (excluding the additional tokens listed above). Note that the table assumes at least 1 tool is provided. If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.
| Model | Tool choice | Tool use system prompt token count |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------ | ---------------------------------- |
| Claude Opus 5 | `auto`, `none`\*\*\*`any`, `tool` | 286 tokens\*\*\*406 tokens |
| Claude Opus 4.8 | `auto`, `none`\*\*\*`any`, `tool` | 290 tokens\*\*\*410 tokens |
| Claude Opus 4.7 | `auto`, `none`\*\*\*`any`, `tool` | 675 tokens\*\*\*804 tokens |
| Claude Opus 4.6 | `auto`, `none`\*\*\*`any`, `tool` | 497 tokens\*\*\*589 tokens |
| Claude Opus 4.5 | `auto`, `none`\*\*\*`any`, `tool` | 496 tokens\*\*\*588 tokens |
| Claude Opus 4.1 ([deprecated](/docs/en/about-claude/model-deprecations)) | `auto`, `none`\*\*\*`any`, `tool` | 313 tokens\*\*\*315 tokens |
| Claude Opus 4 ([retired, except on Google Cloud](/docs/en/about-claude/model-deprecations)) | `auto`, `none`\*\*\*`any`, `tool` | 313 tokens\*\*\*315 tokens |
| Claude Sonnet 5 | `auto`, `none`\*\*\*`any`, `tool` | 354 tokens\*\*\*474 tokens |
| Claude Sonnet 4.6 | `auto`, `none`\*\*\*`any`, `tool` | 497 tokens\*\*\*589 tokens |
| Claude Sonnet 4.5 | `auto`, `none`\*\*\*`any`, `tool` | 496 tokens\*\*\*588 tokens |
| Claude Sonnet 4 ([retired, except on Bedrock and Google Cloud](/docs/en/about-claude/model-deprecations)) | `auto`, `none`\*\*\*`any`, `tool` | 313 tokens\*\*\*315 tokens |
| Claude Haiku 4.5 | `auto`, `none`\*\*\*`any`, `tool` | 496 tokens\*\*\*588 tokens |
| Claude Haiku 3.5 ([retired, except on Bedrock and Google Cloud](/docs/en/about-claude/model-deprecations)) | `auto`, `none`\*\*\*`any`, `tool` | 264 tokens\*\*\*355 tokens |
These token counts are added to your normal input and output tokens to calculate the total cost of a request.
See the [Models overview](/docs/en/about-claude/models/overview#latest-models-comparison) table for current per-model prices.
When you send a tool use prompt, like any other API request, the response includes both input and output token counts in the reported `usage` metrics.
Some server tools add usage-based charges on top of tokens: see [Web search tool](/docs/en/agents-and-tools/tool-use/web-search-tool#usage-and-pricing) and [Code execution tool](/docs/en/agents-and-tools/tool-use/code-execution-tool#usage-and-pricing) for their rates.
## Next steps

Understand the tool use loop, where tools execute, and when to use tools instead of prose.

A guided walkthrough from a single tool call to a production-ready agentic loop.

Directory of Anthropic-provided tools and reference for optional tool definition properties.
