# Server tools

Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools.md

# Server tools
Work with Anthropic-executed tools: server\_tool\_use blocks, pause\_turn continuation, mixed server and client tool turns, and domain filtering.
---
Server-executed tools share these mechanics: the `server\_tool\_use` block, `pause\_turn` continuation, turns that mix server and client tools, Zero Data Retention (ZDR) eligibility, and domain filtering. For individual tools, see the [tool reference](/docs/en/agents-and-tools/tool-use/tool-reference).
## The server\\_tool\\_use block
The `server\_tool\_use` block appears in Claude's response when a server-executed tool runs. Its `id` field uses the `srvtoolu\_` prefix to distinguish it from client tool calls:
```json
{
"type": "server\_tool\_use",
"id": "srvtoolu\_01A2B3C4D5E6F7G8H9",
"name": "web\_search",
"input": { "query": "latest quantum computing breakthroughs" }
}
```
The API executes the tool internally. You see the call and its result in the response, but you don't handle execution. Unlike client `tool\_use` blocks, you don't need to respond with a `tool\_result`. The tool's result block (for example, `web\_search\_tool\_result` for web search) follows the `server\_tool\_use` block in the same assistant turn, paired by `tool\_use\_id`. If Claude calls one of your client tools at the same time, the `server\_tool\_use` block appears without its result, and the response ends with `stop\_reason: "tool\_use"`. The API runs the tool when you return the client `tool\_result` blocks in your next request.
## The server-side loop and pause\\_turn
When using server tools such as web search, the API executes tool calls in a server-side agentic loop. On a long-running turn, the API might pause that loop and return a `pause\_turn` stop reason.
Here's how to handle the `pause\_turn` stop reason:
```bash cURL
# Initial request. If "stop\_reason" in the response is "pause\_turn", continue
# the turn by re-sending the request with the assistant content appended to messages.
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"messages": [
{
"role": "user",
"content": "Search for comprehensive information about quantum computing breakthroughs in 2025"
}
],
"tools": [{"type": "web\_search\_20250305", "name": "web\_search", "max\_uses": 10}]
}' | jq '{stop\_reason, content}'
```
```bash CLI
# Initial request. If "stop\_reason" in the output is "pause\_turn", re-run with
# the assistant content appended to messages (see the SDK tabs).
ant messages create --format json <<'YAML' | jq '{stop\_reason, content}'
model: claude-opus-5
max\_tokens: 1024
tools:
- {type: web\_search\_20250305, name: web\_search, max\_uses: 10}
messages:
- {role: user, content: "Search for comprehensive information about quantum computing breakthroughs in 2025"}
YAML
```
```python Python
client = anthropic.Anthropic()
# Initial request with web search
response = client.messages.create(
model="claude-opus-5",
max\_tokens=1024,
messages=[
{
"role": "user",
"content": "Search for comprehensive information about quantum computing breakthroughs in 2025",
}
],
tools=[{"type": "web\_search\_20250305", "name": "web\_search", "max\_uses": 10}],
)
# Check if the response has pause\_turn stop reason
if response.stop\_reason == "pause\_turn":
# Continue the conversation with the paused content
messages = [
{
"role": "user",
"content": "Search for comprehensive information about quantum computing breakthroughs in 2025",
},
{"role": "assistant", "content": response.content},
]
# Send the continuation request
continuation = client.messages.create(
model="claude-opus-5",
max\_tokens=1024,
messages=messages,
tools=[{"type": "web\_search\_20250305", "name": "web\_search", "max\_uses": 10}],
)
print(continuation)
else:
print(response)
```
```typescript TypeScript
const client = new Anthropic();
// Initial request with web search
const response = await client.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
messages: [
{
role: "user",
content:
"Search for comprehensive information about quantum computing breakthroughs in 2025"
}
],
tools: [
{
type: "web\_search\_20250305",
name: "web\_search",
max\_uses: 10
}
]
});
// Check if the response has pause\_turn stop reason
if (response.stop\_reason === "pause\_turn") {
// Continue the conversation with the paused content
const messages: Anthropic.MessageParam[] = [
{
role: "user",
content:
"Search for comprehensive information about quantum computing breakthroughs in 2025"
},
{ role: "assistant", content: response.content }
];
// Send the continuation request
const continuation = await client.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
messages,
tools: [
{
type: "web\_search\_20250305",
name: "web\_search",
max\_uses: 10
}
]
});
console.log(continuation);
} else {
console.log(response);
}
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Messages = [
new() {
Role = Role.User,
Content = "Search for comprehensive information about quantum computing breakthroughs in 2025"
}
],
Tools = [new ToolUnion(new WebSearchTool20250305 { MaxUses = 10 })]
};
var response = await client.Messages.Create(parameters);
if (response.StopReason?.Value() == StopReason.PauseTurn)
{
// Continue the conversation with the paused content
var continuationParams = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Messages = [
new() {
Role = Role.User,
Content = "Search for comprehensive information about quantum computing breakthroughs in 2025"
},
new() {
Role = Role.Assistant,
Content = response.Content.Select(block => new ContentBlockParam(block.Json)).ToList()
}
],
Tools = [new ToolUnion(new WebSearchTool20250305 { MaxUses = 10 })]
};
var continuation = await client.Messages.Create(continuationParams);
Console.WriteLine(continuation);
}
else
{
Console.WriteLine(response);
}
```
```go Go
client := anthropic.NewClient()
webSearchTool := []anthropic.ToolUnionParam{
{OfWebSearchTool20250305: &anthropic.WebSearchTool20250305Param{
MaxUses: anthropic.Int(10),
}},
}
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("Search for comprehensive information about quantum computing breakthroughs in 2025")),
},
Tools: webSearchTool,
})
if err != nil {
log.Fatal(err)
}
if response.StopReason == anthropic.StopReasonPauseTurn {
// Pass the paused response back as-is so Claude can continue the turn
continuation, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("Search for comprehensive information about quantum computing breakthroughs in 2025")),
response.ToParam(),
},
Tools: webSearchTool,
})
if err != nil {
log.Fatal(err)
}
fmt.Println(continuation)
} else {
fmt.Println(response)
}
```
```java Java
import com.anthropic.models.messages.StopReason;
import com.anthropic.models.messages.WebSearchTool20250305;
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addUserMessage("Search for comprehensive information about quantum computing breakthroughs in 2025")
.addTool(WebSearchTool20250305.builder()
.maxUses(10L)
.build())
.build();
Message response = client.messages().create(params);
if (response.stopReason().isPresent()
&& response.stopReason().get().equals(StopReason.PAUSE\_TURN)) {
MessageCreateParams continuationParams = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addUserMessage("Search for comprehensive information about quantum computing breakthroughs in 2025")
.addMessage(response)
.addTool(WebSearchTool20250305.builder()
.maxUses(10L)
.build())
.build();
Message continuation = client.messages().create(continuationParams);
IO.println(continuation);
} else {
IO.println(response);
}
}
```
```php PHP
$client = new Client();
$response = $client->messages->create(
maxTokens: 1024,
messages: [
[
'role' => 'user',
'content' => 'Search for comprehensive information about quantum computing breakthroughs in 2025'
]
],
model: 'claude-opus-5',
tools: [
[
'type' => 'web\_search\_20250305',
'name' => 'web\_search',
'max\_uses' => 10
]
],
);
if ($response->stopReason === 'pause\_turn') {
$messages = [
[
'role' => 'user',
'content' => 'Search for comprehensive information about quantum computing breakthroughs in 2025'
],
[
'role' => 'assistant',
'content' => $response->content
]
];
$continuation = $client->messages->create(
maxTokens: 1024,
messages: $messages,
model: 'claude-opus-5',
tools: [
[
'type' => 'web\_search\_20250305',
'name' => 'web\_search',
'max\_uses' => 10
]
],
);
echo $continuation;
} else {
echo $response;
}
```
```ruby Ruby
client = Anthropic::Client.new
response = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
messages: [
{
role: "user",
content:
"Search for comprehensive information about quantum computing breakthroughs in 2025"
}
],
tools: [
{
type: "web\_search\_20250305",
name: "web\_search",
max\_uses: 10
}
]
)
if response.stop\_reason == :pause\_turn
messages = [
{
role: "user",
content: "Search for comprehensive information about quantum computing breakthroughs in 2025"
},
{
role: "assistant",
content: response.content
}
]
continuation = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
messages: messages,
tools: [
{
type: "web\_search\_20250305",
name: "web\_search",
max\_uses: 10
}
]
)
puts continuation
else
puts response
end
```
When handling `pause\_turn`:
\* \*\*Continue the conversation:\*\* Pass the paused response back as-is in a subsequent request to let Claude continue its turn.
\* \*\*Preserve tool state:\*\* Include the same tools in the continuation request. A paused turn can end with a `server\_tool\_use` block whose tool has not run yet, and the API returns a validation error if that tool is missing from the continuation.
\* \*\*Repeat as needed:\*\* A continued turn can pause again. Check `stop\_reason` on each response and continue until you get a different stop reason, capping the number of continuations as you would any retry loop.
For the other `stop\_reason` values and general handling patterns, see [Stop reasons and fallback](/docs/en/build-with-claude/handling-stop-reasons).
## Mixing server tools and client tools in one turn
Claude can call a server tool and a client tool in the same group of parallel tool calls, for example, `web\_fetch` together with a user-defined tool. A client tool is any tool that your code executes and that produces a `tool\_use` block, whether it is user-defined or an Anthropic-schema client tool such as the [Bash tool](/docs/en/agents-and-tools/tool-use/bash-tool). When that happens, the API does not run the server tool. It returns immediately so that you can run the client tool first:
\* `stop\_reason` is `"tool\_use"`, not `"pause\_turn"`.
\* `content` contains the `server\_tool\_use` block and the client `tool\_use` block, but no result block for the server tool: that call is not finished.
\* There is no other marker. Detect the state by looking for a `server\_tool\_use` block whose `id` has no matching result block in the response. An `mcp\_tool\_use` block from the [MCP connector](/docs/en/agents-and-tools/mcp-connector) behaves the same way. Server tool calls that already have their result block in the same response are complete and need nothing from you.
With [programmatic tool calling](/docs/en/agents-and-tools/tool-use/programmatic-tool-calling), the same response shape means something different. The client `tool\_use` block comes from code that is running in the `code\_execution` tool rather than from Claude directly, and its `caller` field names the `code\_execution` block that called it. That code has already started: it is paused waiting for your `tool\_result` blocks, and sending them resumes the execution instead of starting a deferred tool. The `code\_execution` block's own result block arrives once the code finishes, which can take more than one round of tool results. The follow-up user message itself is the same in both cases; with programmatic tool calling, also pass back the `id` from the response's `container` field, as that page shows.
```json
{
"stop\_reason": "tool\_use",
"content": [
{
"type": "text",
"text": "I'll fetch the article and check your system at the same time."
},
{
"type": "server\_tool\_use",
"id": "srvtoolu\_01HxbWnMRmbWyMfUtJKC45rA",
"name": "web\_fetch",
"input": { "url": "https://example.com/article" }
},
{
"type": "tool\_use",
"id": "toolu\_01PjgRJLbXrXEMZwDNYLnBqk",
"name": "run\_command",
"input": { "command": "uname -a" }
}
]
}
```
To continue the turn, run the client tools and send a user message whose content is only the `tool\_result` blocks, one for each `tool\_use` block in that response. Keep the same `tools` array: a resume request that no longer defines the waiting server tool fails with a 400 whose message ends ``but no `web\_fetch` tool was provided``.
```json
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01PjgRJLbXrXEMZwDNYLnBqk",
"content": "Linux demo-host 6.8.0-52-generic x86\_64 GNU/Linux"
}
]
}
```
The API attaches your results to the still-open assistant turn, runs the deferred server tool (for paused code execution, resumes it), and then lets Claude continue. For a server tool Claude called directly, the next response begins with the result block that answers the previous response's `server\_tool\_use` `id`, followed by the newly generated content and a fresh `stop\_reason`:
```json
{
"stop\_reason": "end\_turn",
"content": [
{
"type": "web\_fetch\_tool\_result",
"tool\_use\_id": "srvtoolu\_01HxbWnMRmbWyMfUtJKC45rA",
"content": {
"type": "web\_fetch\_result",
"url": "https://example.com/article",
"content": {
"type": "document",
"source": {
"type": "text",
"media\_type": "text/plain",
"data": "Full text content of the article..."
}
}
}
},
{
"type": "text",
"text": "The article argues that... and your machine is running Linux..."
}
]
}
```
A `server\_tool\_use` block and its result block pair up by `tool\_use\_id`, not by position: in this flow they arrive in two different responses, and the `server\_tool\_use` block is not repeated in the second one. On later requests, keep the whole exchange in your `messages` array in order: the first response as an `assistant` message, the `tool\_result` user message, and then the next response as another `assistant` message, the same way you accumulate any other tool-use exchange.
The follow-up user message must contain nothing except `tool\_result` blocks. A block added after the results, such as text, tells the API that the assistant turn is over. For a server tool Claude called directly, that leaves the turn with an unresolved server tool call, and the request fails with a 400 `invalid\_request\_error`:
```text wrap
`web\_fetch` tool use with id `srvtoolu\_01HxbWnMRmbWyMfUtJKC45rA` was found without a corresponding `web\_fetch\_tool\_result` block
```
A follow-up that puts content before the results, answers only some of the client `tool\_use` IDs, or contains no `tool\_result` blocks at all fails earlier, with the client tool error described in [Handle tool calls](/docs/en/agents-and-tools/tool-use/handle-tool-calls):
```text wrap
`tool\_use` ids were found without `tool\_result` blocks immediately after: toolu\_01PjgRJLbXrXEMZwDNYLnBqk. Each `tool\_use` block must have a corresponding `tool\_result` block in the next message.
```
To give Claude more input, send it as a separate user message after the turn completes.
\*\*How this differs from `pause\_turn`:\*\* A [`pause\_turn` response](#the-server-side-loop-and-pause-turn) can also end with a `server\_tool\_use` block that has not run, but it never leaves a client `tool\_use` block waiting on you, so you continue it by re-sending the assistant content as-is. A response that leaves a client `tool\_use` block waiting on you never has a `stop\_reason` of `pause\_turn`: when Claude stops to call your tools, `stop\_reason` is `tool\_use`, and you continue it by sending the client `tool\_result` blocks rather than by re-sending the response. In both cases the API runs the pending server tool at the start of the next request.
The following example enables web fetch together with a user-defined `run\_command` tool and handles the mixed response:
```bash cURL
# If "stop\_reason" is "tool\_use" and a server\_tool\_use block has no matching
# result block, that call is not finished. Run the client tools, then POST
# again with one more user message containing only their tool\_result blocks
# and the same tools array (see the SDK tabs).
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-4-8",
"max\_tokens": 1024,
"messages": [
{
"role": "user",
"content": "Summarize https://example.com/article and run uname -a to tell me what system this is on."
}
],
"tools": [
{"type": "web\_fetch\_20250910", "name": "web\_fetch", "max\_uses": 5},
{
"name": "run\_command",
"description": "Run a shell command on this computer and return its output.",
"input\_schema": {
"type": "object",
"properties": {"command": {"type": "string", "description": "The command to run"}},
"required": ["command"]
}
}
]
}' | jq '{stop\_reason, content}'
```
```bash CLI
# If "stop\_reason" is "tool\_use" and a server\_tool\_use block has no matching
# result block, run the client tools and re-run with a user message of only
# their tool\_result blocks appended (see the SDK tabs).
ant messages create --format json <<'YAML' | jq '{stop\_reason, content}'
model: claude-opus-4-8
max\_tokens: 1024
messages:
- role: user
content: "Summarize https://example.com/article and run uname -a to tell me what system this is on."
tools:
- {type: web\_fetch\_20250910, name: web\_fetch, max\_uses: 5}
- name: run\_command
description: Run a shell command on this computer and return its output.
input\_schema:
type: object
properties:
command: {type: string, description: The command to run}
required: [command]
YAML
```
```python Python
client = anthropic.Anthropic()
tools = [
{"type": "web\_fetch\_20250910", "name": "web\_fetch", "max\_uses": 5},
{
"name": "run\_command",
"description": "Run a shell command on this computer and return its output.",
"input\_schema": {
"type": "object",
"properties": {
"command": {"type": "string", "description": "The command to run"}
},
"required": ["command"],
},
},
]
messages = [
{
"role": "user",
"content": "Summarize https://example.com/article and run uname -a to tell me what system this is on.",
}
]
response = client.messages.create(
model="claude-opus-4-8", max\_tokens=1024, tools=tools, messages=messages
)
tool\_results = [
{
"type": "tool\_result",
"tool\_use\_id": block.id,
# Run your tool here. This example returns a fixed string.
"content": "Linux demo-host 6.8.0-52-generic x86\_64 GNU/Linux",
}
for block in response.content
if block.type == "tool\_use"
]
if response.stop\_reason == "tool\_use" and tool\_results:
# A server\_tool\_use block with no result block in this response is not finished; its result arrives in a later response.
# Send back only the client tool\_result blocks, with the same tools.
continuation = client.messages.create(
model="claude-opus-4-8",
max\_tokens=1024,
tools=tools,
messages=[
\*messages,
{"role": "assistant", "content": response.content},
{"role": "user", "content": tool\_results},
],
)
# If a web\_fetch was deferred, it runs on this request and its
# web\_fetch\_tool\_result is the first block of continuation.content.
print(continuation)
else:
print(response)
```
```typescript TypeScript
const client = new Anthropic();
const webFetchTool = {
type: "web\_fetch\_20250910",
name: "web\_fetch",
max\_uses: 5
} as const;
const runCommandTool: Anthropic.Tool = {
name: "run\_command",
description: "Run a shell command on this computer and return its output.",
input\_schema: {
type: "object" as const,
properties: {
command: { type: "string", description: "The command to run" }
},
required: ["command"]
}
};
const messages: Anthropic.MessageParam[] = [
{
role: "user",
content:
"Summarize https://example.com/article and run uname -a to tell me what system this is on."
}
];
const response = await client.messages.create({
model: "claude-opus-4-8",
max\_tokens: 1024,
tools: [webFetchTool, runCommandTool],
messages
});
const toolResults: Anthropic.ToolResultBlockParam[] = [];
for (const block of response.content) {
if (block.type === "tool\_use") {
toolResults.push({
type: "tool\_result",
tool\_use\_id: block.id,
// Run your tool here. This example returns a fixed string.
content: "Linux demo-host 6.8.0-52-generic x86\_64 GNU/Linux"
});
}
}
if (response.stop\_reason === "tool\_use" && toolResults.length > 0) {
// A server\_tool\_use block with no result block in this response is not finished; its result arrives in a later response.
// Send back only the client tool\_result blocks, with the same tools.
const continuation = await client.messages.create({
model: "claude-opus-4-8",
max\_tokens: 1024,
tools: [webFetchTool, runCommandTool],
messages: [
...messages,
{ role: "assistant", content: response.content },
{ role: "user", content: toolResults }
]
});
// If a web\_fetch was deferred, it runs on this request and its
// web\_fetch\_tool\_result is the first block of continuation.content.
console.log(continuation);
} else {
console.log(response);
}
```
```csharp C#
AnthropicClient client = new();
List tools =
[
new ToolUnion(new WebFetchTool20250910() { MaxUses = 5 }),
new ToolUnion(new Tool()
{
Name = "run\_command",
Description = "Run a shell command on this computer and return its output.",
InputSchema = new InputSchema()
{
Properties = new Dictionary
{
["command"] = JsonSerializer.SerializeToElement(
new { type = "string", description = "The command to run" }
),
},
Required = ["command"],
},
}),
];
MessageParam userMessage = new()
{
Role = Role.User,
Content = "Summarize https://example.com/article and run uname -a to tell me what system this is on."
};
var response = await client.Messages.Create(new MessageCreateParams
{
Model = Model.ClaudeOpus4\_8,
MaxTokens = 1024,
Tools = tools,
Messages = [userMessage]
});
var toolResults = new List();
foreach (var block in response.Content)
{
if (block.TryPickToolUse(out var toolUse))
{
toolResults.Add(new ContentBlockParam(new ToolResultBlockParam()
{
ToolUseID = toolUse.ID,
// Run your tool here. This example returns a fixed string.
Content = "Linux demo-host 6.8.0-52-generic x86\_64 GNU/Linux",
}));
}
}
if (response.StopReason?.Value() == StopReason.ToolUse && toolResults.Count > 0)
{
// A server\_tool\_use block with no result block in this response is not finished; its result arrives in a later response.
// Send back only the client tool\_result blocks, with the same tools.
var continuation = await client.Messages.Create(new MessageCreateParams
{
Model = Model.ClaudeOpus4\_8,
MaxTokens = 1024,
Tools = tools,
Messages =
[
userMessage,
new()
{
Role = Role.Assistant,
Content = response.Content.Select(block => new ContentBlockParam(block.Json)).ToList()
},
new() { Role = Role.User, Content = new MessageParamContent(toolResults) }
]
});
// If a web\_fetch was deferred, it runs on this request and its
// web\_fetch\_tool\_result is the first block of continuation.Content.
Console.WriteLine(continuation);
}
else
{
Console.WriteLine(response);
}
```
```go Go
client := anthropic.NewClient()
tools := []anthropic.ToolUnionParam{
{OfWebFetchTool20250910: &anthropic.WebFetchTool20250910Param{
MaxUses: anthropic.Int(5),
}},
{OfTool: &anthropic.ToolParam{
Name: "run\_command",
Description: anthropic.String("Run a shell command on this computer and return its output."),
InputSchema: anthropic.ToolInputSchemaParam{
Properties: map[string]any{
"command": map[string]any{
"type": "string",
"description": "The command to run",
},
},
Required: []string{"command"},
},
}},
}
userMessage := anthropic.NewUserMessage(anthropic.NewTextBlock("Summarize https://example.com/article and run uname -a to tell me what system this is on."))
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus4\_8,
MaxTokens: 1024,
Tools: tools,
Messages: []anthropic.MessageParam{userMessage},
})
if err != nil {
log.Fatal(err)
}
var toolResults []anthropic.ContentBlockParamUnion
for \_, block := range response.Content {
if toolUse, ok := block.AsAny().(anthropic.ToolUseBlock); ok {
// Run your tool here. This example returns a fixed string.
output := "Linux demo-host 6.8.0-52-generic x86\_64 GNU/Linux"
toolResults = append(toolResults, anthropic.NewToolResultBlock(toolUse.ID, output, false))
}
}
if response.StopReason == anthropic.StopReasonToolUse && len(toolResults) > 0 {
// A server\_tool\_use block with no result block in this response is not finished; its result arrives in a later response.
// Send back only the client tool\_result blocks, with the same tools.
continuation, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus4\_8,
MaxTokens: 1024,
Tools: tools,
Messages: []anthropic.MessageParam{
userMessage,
response.ToParam(),
anthropic.NewUserMessage(toolResults...),
},
})
if err != nil {
log.Fatal(err)
}
// If a web\_fetch was deferred, it runs on this request and its
// web\_fetch\_tool\_result is the first block of continuation.Content.
fmt.Println(continuation)
} else {
fmt.Println(response)
}
```
```java Java
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
Tool runCommandTool = Tool.builder()
.name("run\_command")
.description("Run a shell command on this computer and return its output.")
.inputSchema(Tool.InputSchema.builder()
.properties(JsonValue.from(Map.of(
"command", Map.of("type", "string", "description", "The command to run")
)))
.putAdditionalProperty("required", JsonValue.from(List.of("command")))
.build())
.build();
String prompt = "Summarize https://example.com/article and run uname -a to tell me what system this is on.";
Message response = client.messages().create(MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_4\_8)
.maxTokens(1024L)
.addTool(WebFetchTool20250910.builder().maxUses(5L).build())
.addTool(runCommandTool)
.addUserMessage(prompt)
.build());
List toolResults = new ArrayList<>();
for (ContentBlock block : response.content()) {
block.toolUse().ifPresent(toolUse -> toolResults.add(ContentBlockParam.ofToolResult(
ToolResultBlockParam.builder()
.toolUseId(toolUse.id())
// Run your tool here. This example returns a fixed string.
.content("Linux demo-host 6.8.0-52-generic x86\_64 GNU/Linux")
.build()
)));
}
boolean isToolUse = response.stopReason()
.map(StopReason.TOOL\_USE::equals)
.orElse(false);
if (isToolUse && !toolResults.isEmpty()) {
// A server\_tool\_use block with no result block in this response is not finished; its result arrives in a later response.
// Send back only the client tool\_result blocks, with the same tools.
Message continuation = client.messages().create(MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_4\_8)
.maxTokens(1024L)
.addTool(WebFetchTool20250910.builder().maxUses(5L).build())
.addTool(runCommandTool)
.addUserMessage(prompt)
.addMessage(response)
.addUserMessageOfBlockParams(toolResults)
.build());
// If a web\_fetch was deferred, it runs on this request and its
// web\_fetch\_tool\_result is the first block of continuation.content().
IO.println(continuation);
} else {
IO.println(response);
}
}
```
```php PHP
$client = new Client();
$tools = [
['type' => 'web\_fetch\_20250910', 'name' => 'web\_fetch', 'max\_uses' => 5],
[
'name' => 'run\_command',
'description' => 'Run a shell command on this computer and return its output.',
'input\_schema' => [
'type' => 'object',
'properties' => [
'command' => ['type' => 'string', 'description' => 'The command to run']
],
'required' => ['command']
]
]
];
$userMessage = ['role' => 'user', 'content' => 'Summarize https://example.com/article and run uname -a to tell me what system this is on.'];
$response = $client->messages->create(
maxTokens: 1024,
messages: [$userMessage],
model: 'claude-opus-4-8',
tools: $tools,
);
$toolResults = [];
foreach ($response->content as $block) {
if ($block->type === 'tool\_use') {
$toolResults[] = [
'type' => 'tool\_result',
'tool\_use\_id' => $block->id,
// Run your tool here. This example returns a fixed string.
'content' => 'Linux demo-host 6.8.0-52-generic x86\_64 GNU/Linux'
];
}
}
if ($response->stopReason === 'tool\_use' && count($toolResults) > 0) {
// A server\_tool\_use block with no result block in this response is not finished; its result arrives in a later response.
// Send back only the client tool\_result blocks, with the same tools.
$continuation = $client->messages->create(
maxTokens: 1024,
messages: [
$userMessage,
['role' => 'assistant', 'content' => $response->content],
['role' => 'user', 'content' => $toolResults],
],
model: 'claude-opus-4-8',
tools: $tools,
);
// If a web\_fetch was deferred, it runs on this request and its
// web\_fetch\_tool\_result is the first block of $continuation->content.
echo $continuation;
} else {
echo $response;
}
```
```ruby Ruby
client = Anthropic::Client.new
tools = [
{ type: "web\_fetch\_20250910", name: "web\_fetch", max\_uses: 5 },
{
name: "run\_command",
description: "Run a shell command on this computer and return its output.",
input\_schema: {
type: "object",
properties: {
command: { type: "string", description: "The command to run" }
},
required: ["command"]
}
}
]
user\_message = {
role: "user",
content: "Summarize https://example.com/article and run uname -a to tell me what system this is on."
}
response = client.messages.create(
model: "claude-opus-4-8",
max\_tokens: 1024,
tools: tools,
messages: [user\_message]
)
tool\_results = []
response.content.each do |block|
next unless block.type == :tool\_use
tool\_results << {
type: "tool\_result",
tool\_use\_id: block.id,
# Run your tool here. This example returns a fixed string.
content: "Linux demo-host 6.8.0-52-generic x86\_64 GNU/Linux"
}
end
if response.stop\_reason == :tool\_use && !tool\_results.empty?
# A server\_tool\_use block with no result block in this response is not finished; its result arrives in a later response.
# Send back only the client tool\_result blocks, with the same tools.
continuation = client.messages.create(
model: "claude-opus-4-8",
max\_tokens: 1024,
tools: tools,
messages: [
user\_message,
{ role: "assistant", content: response.content },
{ role: "user", content: tool\_results }
]
)
# If a web\_fetch was deferred, it runs on this request and its
# web\_fetch\_tool\_result is the first block of continuation.content.
puts continuation
else
puts response
end
```
This code is also correct when Claude does not mix the two kinds of call. A turn with only client `tool\_use` blocks takes the same continuation path, and a turn with only server tool calls needs no client `tool\_result` blocks from you: its result blocks are normally already present, and one that comes back suspended, such as a [`pause\_turn` response](#the-server-side-loop-and-pause-turn), is re-sent as-is instead.
## ZDR and allowed\\_callers
The basic versions of web search (`web\_search\_20250305`) and web fetch (`web\_fetch\_20250910`) are eligible for [Zero Data Retention (ZDR)](/docs/en/manage-claude/api-and-data-retention).
The `\_20260209` and later versions with dynamic filtering are \*\*not\*\* ZDR-eligible by default because dynamic filtering relies on code execution internally.
To use a `\_20260209` or later server tool with ZDR, disable dynamic filtering by setting `"allowed\_callers": ["direct"]` on the tool:
```json
{
"type": "web\_search\_20260209",
"name": "web\_search",
"allowed\_callers": ["direct"]
}
```
This restricts the tool to direct invocation only, bypassing the internal code execution step.
`allowed\_callers` controls how a tool can be invoked: directly by Claude (`"direct"`), from inside a code execution container (for example, `"code\_execution\_20260120"`), or both. The `\_20260209` versions of the web tools default to the code execution caller only; earlier versions default to `["direct"]`. On models that don't support programmatic tool calling, these versions require `allowed\_callers: ["direct"]`; without it the API returns a validation error that says to set it.
Even when web fetch is used in a ZDR-eligible configuration, website publishers might retain any parameters passed to the URL if Claude fetches content from their site.
## Domain filtering
Server tools that access the web accept `allowed\_domains` and `blocked\_domains` parameters to control which domains Claude can reach. Both are fields on the tool object:
```json
{
"type": "web\_search\_20250305",
"name": "web\_search",
"allowed\_domains": ["example.com", "docs.python.org"]
}
```
When using domain filters:
\* Domains should not include the HTTP/HTTPS scheme (use `example.com` instead of `https://example.com`).
\* Subdomains are automatically included (`example.com` covers `docs.example.com`).
\* Specific subdomains restrict results to only that subdomain (`docs.example.com` returns only results from that subdomain, not from `example.com` or `api.example.com`).
\* Subpaths are supported for web search and match anything after the path (`example.com/blog` matches `example.com/blog/post-1`).
\* Web fetch matches on the domain only: an entry that includes a path never matches a web fetch URL.
\* You can use either `allowed\_domains` or `blocked\_domains`, but not both in the same request.
\*\*Wildcard support:\*\*
\* Wildcards (`\*`) are not allowed in the domain itself, only in the path after it.
\* Valid: `example.com/\*`, `example.com/\*/articles`
\* Invalid: `\*.example.com`, `ex\*.com`
Invalid domain formats are rejected at request time with a 400 `invalid\_request\_error`.
Request-level domain restrictions work together with any organization-level domain restrictions configured in Claude Console. Request-level `allowed\_domains` must be a subset of the organization-level allowed list; entries outside it cause the API to return a validation error. Domains your organization blocks are removed from a request-level allowed list rather than returning an error.

Unicode characters in domain names can bypass domain filters through homograph attacks: `аmazon.com` (with a Cyrillic `а`) looks identical to `amazon.com` but is a different domain. Use ASCII-only domain names in allow and block lists, and audit existing entries for non-ASCII characters.
## Dynamic filtering with code execution
The `\_20260209` and later versions of web search and web fetch use code execution internally to apply dynamic filters against search results.
You don't need to add a `code\_execution` tool for these versions: when dynamic filtering runs, the API provisions code execution for the request automatically, and both tools share a single execution container. If you do include one, use `code\_execution\_20260120` or later; the API rejects older code execution versions alongside these web tool versions.
## Streaming server-tool events
Server-tool events stream as part of the normal server-sent events (SSE) flow. A `server\_tool\_use` block that Claude calls directly streams like a client `tool\_use` block: a `content\_block\_start` event followed by `input\_json\_delta` events. The result block arrives complete in a single `content\_block\_start` event, with no deltas.
See [Streaming](/docs/en/build-with-claude/streaming) for the full event reference. Individual tool pages document tool-specific event names where they differ.
## Batch requests
All server tools support batch processing. In a batch, the agentic loop runs just as it does for synchronous requests, with a higher per-turn iteration limit. If the loop reaches that limit, the response ends with `stop\_reason: "pause\_turn"`; you can continue it by submitting a follow-up request with the returned content. See [Server tools and the agentic loop](/docs/en/build-with-claude/batch-processing#server-tools-and-the-agentic-loop) for details.
Common batch workloads include enriching a dataset with information from the web, checking a large set of documents against current sources, and running analysis code over many files.
## Next steps

Fix the most common tool-use errors with symptom-to-fix diagnostic tables.

Search the web and cite results.

Fetch and read content from specific URLs to augment Claude's context with live web content.

Run Python and bash code in a sandboxed container to analyze data, generate files, and iterate on solutions.

Discover and load tools on demand.
