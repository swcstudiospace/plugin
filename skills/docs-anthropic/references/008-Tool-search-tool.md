# Tool search tool

Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool.md

# Tool search tool
Scale to hundreds or thousands of tools by letting Claude search your tool catalog and load only the tools it needs.
---
The tool search tool lets Claude work with hundreds or thousands of tools by discovering and loading them on demand. Instead of loading all tool definitions into the context window up front, Claude searches your tool catalog (including tool names, descriptions, argument names, and argument descriptions) and loads only the tools it needs.
Loading every tool definition up front causes two problems as a tool library grows:
\* \*\*Context bloat:\*\* A typical multiserver setup (GitHub, Slack, Sentry, Grafana, and Splunk) can consume \~55k tokens in definitions before Claude does any work. Tool search typically reduces this by over 85 percent, loading only the 3–5 tools Claude needs for a given request.
\* \*\*Tool selection accuracy:\*\* Claude's ability to pick the right tool degrades once you exceed 30–50 available tools. Because tool search loads only a focused set of relevant tools on demand, selection accuracy stays high even across thousands of tools.
Tool search is generally available on the Claude API. For supported models, see [Model compatibility](#model-compatibility).
For background on the scaling challenges that tool search solves, see [Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use). Tool search's on-demand loading is also an instance of the broader just-in-time retrieval principle described in [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).
Tool search runs as a server-side tool, but you can also implement your own client-side tool search. See [Custom tool search implementation](#custom-tool-search-implementation) for details.
Share feedback on this feature through the [feedback form](https://forms.gle/MhcGFFwLxuwnWTkYA).

For how zero data retention (ZDR) applies to this feature, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).

On Amazon Bedrock, server-side tool search is available only through the [InvokeModel API](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-runtime\_example\_bedrock-runtime\_InvokeModel\_AnthropicClaude\_section.html), not the Converse API.

On [Claude Platform on AWS](/docs/en/build-with-claude/claude-platform-on-aws), server-side tool search works identically to the Claude API. Claude Platform on AWS uses the Anthropic Messages API directly, so there is no InvokeModel or Converse distinction.
## Model compatibility
Both tool search variants are available on the following models:
| Model | Tool versions |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| Claude Fable 5 (claude-fable-5) | `tool\_search\_tool\_regex\_20251119`, `tool\_search\_tool\_bm25\_20251119` |
| Claude Mythos 5 (claude-mythos-5) | `tool\_search\_tool\_regex\_20251119`, `tool\_search\_tool\_bm25\_20251119` |
| Claude Opus 5 (claude-opus-5) | `tool\_search\_tool\_regex\_20251119`, `tool\_search\_tool\_bm25\_20251119` |
| Claude Opus 4.8 (claude-opus-4-8) | `tool\_search\_tool\_regex\_20251119`, `tool\_search\_tool\_bm25\_20251119` |
| Claude Opus 4.7 (claude-opus-4-7) | `tool\_search\_tool\_regex\_20251119`, `tool\_search\_tool\_bm25\_20251119` |
| Claude Opus 4.6 (claude-opus-4-6) | `tool\_search\_tool\_regex\_20251119`, `tool\_search\_tool\_bm25\_20251119` |
| Claude Sonnet 4.6 (claude-sonnet-4-6) | `tool\_search\_tool\_regex\_20251119`, `tool\_search\_tool\_bm25\_20251119` |
| Claude Opus 4.5 (claude-opus-4-5-20251101) | `tool\_search\_tool\_regex\_20251119`, `tool\_search\_tool\_bm25\_20251119` |
| Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) | `tool\_search\_tool\_regex\_20251119`, `tool\_search\_tool\_bm25\_20251119` |
| Claude Haiku 4.5 (claude-haiku-4-5-20251001) | `tool\_search\_tool\_regex\_20251119`, `tool\_search\_tool\_bm25\_20251119` |
Claude Opus 4.1 and earlier models don't support the tool search tool.
## How tool search works
There are two tool search variants:
\* \*\*Regex\*\* (`tool\_search\_tool\_regex\_20251119`): Claude constructs regex patterns to search for tools.
\* \*\*BM25\*\* (`tool\_search\_tool\_bm25\_20251119`): Claude uses natural language queries to search for tools.
When you enable the tool search tool:
1. You include a tool search tool (for example, `tool\_search\_tool\_regex\_20251119` or `tool\_search\_tool\_bm25\_20251119`) in your `tools` list.
2. You provide every tool definition in the `tools` array and set `defer\_loading: true` on the tools that shouldn't load up front. At least one tool, normally the tool search tool itself, must stay non-deferred.
3. Initially, Claude's context contains only the tool search tool and any non-deferred tools.
4. When Claude needs additional tools, it searches using a tool search tool.
5. The API runs the search and returns the matching tools as `tool\_reference` blocks (up to 5 by default).
6. The API automatically expands these references into full tool definitions.
7. Claude selects from the discovered tools and calls them.
## Quick start
The following example includes the tool search tool and two deferred tools:
```bash cURL
curl https://api.anthropic.com/v1/messages \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "content-type: application/json" \
--data '{
"model": "claude-opus-5",
"max\_tokens": 2048,
"messages": [
{
"role": "user",
"content": "What is the weather in San Francisco?"
}
],
"tools": [
{
"type": "tool\_search\_tool\_regex\_20251119",
"name": "tool\_search\_tool\_regex"
},
{
"name": "get\_weather",
"description": "Get the weather at a specific location",
"input\_schema": {
"type": "object",
"properties": {
"location": {"type": "string"},
"unit": {
"type": "string",
"enum": ["celsius", "fahrenheit"]
}
},
"required": ["location"]
},
"defer\_loading": true
},
{
"name": "search\_files",
"description": "Search through files in the workspace",
"input\_schema": {
"type": "object",
"properties": {
"query": {"type": "string"},
"file\_types": {
"type": "array",
"items": {"type": "string"}
}
},
"required": ["query"]
},
"defer\_loading": true
}
]
}'
```
```bash CLI
ant messages create <<'YAML'
model: claude-opus-5
max\_tokens: 2048
messages:
- role: user
content: What is the weather in San Francisco?
tools:
- type: tool\_search\_tool\_regex\_20251119
name: tool\_search\_tool\_regex
- name: get\_weather
description: Get the weather at a specific location
input\_schema:
type: object
properties:
location:
type: string
unit:
type: string
enum: [celsius, fahrenheit]
required: [location]
defer\_loading: true
- name: search\_files
description: Search through files in the workspace
input\_schema:
type: object
properties:
query:
type: string
file\_types:
type: array
items:
type: string
required: [query]
defer\_loading: true
YAML
```
```python Python
client = anthropic.Anthropic()
response = client.messages.create(
model="claude-opus-5",
max\_tokens=2048,
messages=[{"role": "user", "content": "What is the weather in San Francisco?"}],
tools=[
{"type": "tool\_search\_tool\_regex\_20251119", "name": "tool\_search\_tool\_regex"},
{
"name": "get\_weather",
"description": "Get the weather at a specific location",
"input\_schema": {
"type": "object",
"properties": {
"location": {"type": "string"},
"unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
},
"required": ["location"],
},
"defer\_loading": True,
},
{
"name": "search\_files",
"description": "Search through files in the workspace",
"input\_schema": {
"type": "object",
"properties": {
"query": {"type": "string"},
"file\_types": {"type": "array", "items": {"type": "string"}},
},
"required": ["query"],
},
"defer\_loading": True,
},
],
)
print(response)
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.messages.create({
model: "claude-opus-5",
max\_tokens: 2048,
messages: [
{
role: "user",
content: "What is the weather in San Francisco?"
}
],
tools: [
{
type: "tool\_search\_tool\_regex\_20251119",
name: "tool\_search\_tool\_regex"
},
{
name: "get\_weather",
description: "Get the weather at a specific location",
input\_schema: {
type: "object" as const,
properties: {
location: { type: "string" },
unit: {
type: "string",
enum: ["celsius", "fahrenheit"]
}
},
required: ["location"]
},
defer\_loading: true
},
{
name: "search\_files",
description: "Search through files in the workspace",
input\_schema: {
type: "object" as const,
properties: {
query: { type: "string" },
file\_types: {
type: "array",
items: { type: "string" }
}
},
required: ["query"]
},
defer\_loading: true
}
]
});
console.log(response);
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 2048,
Messages = [
new() {
Role = Role.User,
Content = "What is the weather in San Francisco?"
}
],
Tools = [
new ToolUnion(new ToolSearchToolRegex20251119
{
Type = ToolSearchToolRegex20251119Type.ToolSearchToolRegex20251119
}),
new ToolUnion(new Tool()
{
Name = "get\_weather",
Description = "Get the weather at a specific location",
InputSchema = new InputSchema()
{
Properties = new Dictionary
{
["location"] = JsonSerializer.SerializeToElement(new { type = "string" }),
["unit"] = JsonSerializer.SerializeToElement(new { type = "string", @enum = new[] { "celsius", "fahrenheit" } }),
},
Required = ["location"],
},
DeferLoading = true,
}),
new ToolUnion(new Tool()
{
Name = "search\_files",
Description = "Search through files in the workspace",
InputSchema = new InputSchema()
{
Properties = new Dictionary
{
["query"] = JsonSerializer.SerializeToElement(new { type = "string" }),
["file\_types"] = JsonSerializer.SerializeToElement(new { type = "array", items = new { type = "string" } }),
},
Required = ["query"],
},
DeferLoading = true,
}),
]
};
var message = await client.Messages.Create(parameters);
Console.WriteLine(message);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 2048,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("What is the weather in San Francisco?")),
},
Tools: []anthropic.ToolUnionParam{
{OfToolSearchToolRegex20251119: &anthropic.ToolSearchToolRegex20251119Param{
Type: anthropic.ToolSearchToolRegex20251119TypeToolSearchToolRegex20251119,
}},
{OfTool: &anthropic.ToolParam{
Name: "get\_weather",
Description: anthropic.String("Get the weather at a specific location"),
InputSchema: anthropic.ToolInputSchemaParam{
Properties: map[string]any{
"location": map[string]any{"type": "string"},
"unit": map[string]any{
"type": "string",
"enum": []string{"celsius", "fahrenheit"},
},
},
Required: []string{"location"},
},
DeferLoading: anthropic.Bool(true),
}},
{OfTool: &anthropic.ToolParam{
Name: "search\_files",
Description: anthropic.String("Search through files in the workspace"),
InputSchema: anthropic.ToolInputSchemaParam{
Properties: map[string]any{
"query": map[string]any{"type": "string"},
"file\_types": map[string]any{"type": "array", "items": map[string]any{"type": "string"}},
},
Required: []string{"query"},
},
DeferLoading: anthropic.Bool(true),
}},
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
import com.anthropic.models.messages.ToolSearchToolRegex20251119;
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
InputSchema weatherSchema = InputSchema.builder()
.properties(JsonValue.from(Map.of(
"location", Map.of("type", "string"),
"unit", Map.of(
"type", "string",
"enum", List.of("celsius", "fahrenheit")
)
)))
.putAdditionalProperty("required", JsonValue.from(List.of("location")))
.build();
InputSchema searchSchema = InputSchema.builder()
.properties(JsonValue.from(Map.of(
"query", Map.of("type", "string"),
"file\_types", Map.of(
"type", "array",
"items", Map.of("type", "string")
)
)))
.putAdditionalProperty("required", JsonValue.from(List.of("query")))
.build();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(2048L)
.addUserMessage("What is the weather in San Francisco?")
.addTool(ToolSearchToolRegex20251119.builder()
.type(ToolSearchToolRegex20251119.Type.TOOL\_SEARCH\_TOOL\_REGEX\_20251119)
.build())
.addTool(Tool.builder()
.name("get\_weather")
.description("Get the weather at a specific location")
.inputSchema(weatherSchema)
.deferLoading(true)
.build())
.addTool(Tool.builder()
.name("search\_files")
.description("Search through files in the workspace")
.inputSchema(searchSchema)
.deferLoading(true)
.build())
.build();
Message response = client.messages().create(params);
IO.println(response);
}
```
```php PHP
$client = new Client();
$message = $client->messages->create(
maxTokens: 2048,
messages: [
['role' => 'user', 'content' => 'What is the weather in San Francisco?'],
],
model: 'claude-opus-5',
tools: [
[
'type' => 'tool\_search\_tool\_regex\_20251119',
'name' => 'tool\_search\_tool\_regex',
],
[
'name' => 'get\_weather',
'description' => 'Get the weather at a specific location',
'input\_schema' => [
'type' => 'object',
'properties' => [
'location' => ['type' => 'string'],
'unit' => [
'type' => 'string',
'enum' => ['celsius', 'fahrenheit'],
],
],
'required' => ['location'],
],
'defer\_loading' => true,
],
[
'name' => 'search\_files',
'description' => 'Search through files in the workspace',
'input\_schema' => [
'type' => 'object',
'properties' => [
'query' => ['type' => 'string'],
'file\_types' => [
'type' => 'array',
'items' => ['type' => 'string'],
],
],
'required' => ['query'],
],
'defer\_loading' => true,
],
],
);
echo $message;
```
```ruby Ruby
client = Anthropic::Client.new
message = client.messages.create(
model: "claude-opus-5",
max\_tokens: 2048,
messages: [
{ role: "user", content: "What is the weather in San Francisco?" }
],
tools: [
{
type: "tool\_search\_tool\_regex\_20251119",
name: "tool\_search\_tool\_regex"
},
{
name: "get\_weather",
description: "Get the weather at a specific location",
input\_schema: {
type: "object",
properties: {
location: { type: "string" },
unit: {
type: "string",
enum: ["celsius", "fahrenheit"]
}
},
required: ["location"]
},
defer\_loading: true
},
{
name: "search\_files",
description: "Search through files in the workspace",
input\_schema: {
type: "object",
properties: {
query: { type: "string" },
file\_types: {
type: "array",
items: { type: "string" }
}
},
required: ["query"]
},
defer\_loading: true
}
]
)
puts message
```
Claude searches the catalog, discovers `get\_weather`, and calls it. The response ends with `stop\_reason: "tool\_use"`. Execute the discovered tool and return a `tool\_result` as in [Handle tool calls](/docs/en/agents-and-tools/tool-use/handle-tool-calls). [Response format](#response-format) shows the blocks you get back and what to send next.
## Tool definition
The tool search tool has two variants:
```json JSON
{
"type": "tool\_search\_tool\_regex\_20251119",
"name": "tool\_search\_tool\_regex"
}
```
```json JSON
{
"type": "tool\_search\_tool\_bm25\_20251119",
"name": "tool\_search\_tool\_bm25"
}
```
\*\*Regex variant query format: Python regex, not natural language\*\*
With `tool\_search\_tool\_regex\_20251119`, Claude writes Python `re.search()` patterns, not natural language queries. Matching is case-insensitive. Common patterns include the following:
\* `"weather"`: matches tool names and descriptions containing "weather"
\* `"get\_.\*\_data"`: matches tools such as `get\_user\_data` and `get\_weather\_data`
\* `"database.\*query|query.\*database"`: matches either word order
Maximum pattern length: 200 characters

\*\*BM25 variant query format: natural language\*\*
With `tool\_search\_tool\_bm25\_20251119`, Claude searches with natural language queries. Maximum query length: 500 characters.
### Deferred tool loading
Mark tools for on-demand loading by adding `defer\_loading: true`:
```json JSON
{
"name": "get\_weather",
"description": "Get current weather for a location",
"input\_schema": {
"type": "object",
"properties": {
"location": { "type": "string" },
"unit": { "type": "string", "enum": ["celsius", "fahrenheit"] }
},
"required": ["location"]
},
"defer\_loading": true
}
```
`defer\_loading` controls what enters the context window, not what you send in the request:
\* You still send every tool's full definition in the `tools` array on every request, including the deferred ones. The API needs them server-side to run the search and expand `tool\_reference` blocks.
\* Tools without `defer\_loading` load into context immediately.
\* Tools with `defer\_loading: true` load only when Claude discovers them through search.
\* Never set `defer\_loading: true` on the tool search tool itself.
\* Keep your 3–5 most frequently used tools non-deferred so Claude can call them without searching first.
Both tool search variants (`regex` and `bm25`) search tool names, descriptions, argument names, and argument descriptions.
Internally, the API excludes deferred tools from the system-prompt prefix. When Claude discovers a deferred tool through tool search, the API appends a `tool\_reference` block inline in the conversation, then expands it into the full tool definition before passing it to Claude. The prefix is untouched, so prompt caching is preserved. The grammar for [strict mode](/docs/en/agents-and-tools/tool-use/strict-tool-use) (the rules that constrain tool-call output to match your schemas) builds from the full toolset, so `defer\_loading` and strict mode compose without grammar recompilation.
## Response format
When Claude uses the tool search tool, the response includes the following block types:
```json JSON
{
"role": "assistant",
"content": [
{
"type": "text",
"text": "I'll search for tools to help with the weather information."
},
{
"type": "server\_tool\_use",
"id": "srvtoolu\_01ABC123",
"name": "tool\_search\_tool\_regex",
"input": {
"pattern": "weather"
}
},
{
"type": "tool\_search\_tool\_result",
"tool\_use\_id": "srvtoolu\_01ABC123",
"content": {
"type": "tool\_search\_tool\_search\_result",
"tool\_references": [{ "type": "tool\_reference", "tool\_name": "get\_weather" }]
}
},
{
"type": "text",
"text": "I found a weather tool. Let me get the weather for San Francisco."
},
{
"type": "tool\_use",
"id": "toolu\_01XYZ789",
"name": "get\_weather",
"input": { "location": "San Francisco", "unit": "fahrenheit" }
}
],
"stop\_reason": "tool\_use"
}
```
### Understanding the response
\* \*\*`server\_tool\_use`:\*\* Claude's call to the tool search tool. The search runs on Anthropic's servers. Never return a `tool\_result` for its `srvtoolu\_...` ID.
\* \*\*`tool\_search\_tool\_result`:\*\* the search results, in a nested `tool\_search\_tool\_search\_result` object. Keep it in the message history as is.
\* \*\*`tool\_references`:\*\* an array of `tool\_reference` objects pointing to discovered tools. The API expands these for Claude. You never expand them yourself.
\* \*\*`tool\_use`:\*\* Claude's call to a discovered tool. Execute it and return a `tool\_result` exactly as in standard tool use.
The API automatically expands `tool\_reference` blocks into full tool definitions before showing them to Claude. You don't need to handle this expansion yourself, as long as you provide all matching tool definitions in the `tools` parameter.
### Continuing the conversation
On the next request, pass the assistant's content back unchanged, including the `server\_tool\_use` and `tool\_search\_tool\_result` blocks. Add your `tool\_result` for the discovered tool in a user message, and send the same `tools` array: the search tool plus every deferred definition. Don't return a `tool\_result` for the `srvtoolu\_...` ID: the API rejects the request. The API expands `tool\_reference` blocks throughout the conversation history, so Claude can reuse discovered tools in later turns without re-searching. A search that matches nothing returns a `tool\_search\_tool\_search\_result` with an empty `tool\_references` array, not an error.
## MCP integration
If your tools come from MCP servers through the [MCP connector](/docs/en/agents-and-tools/mcp-connector), you don't set `defer\_loading` on individual tool definitions. Instead, set it once on the `mcp\_toolset` entry's `default\_config` for the whole server, or per tool in its `configs`. See [MCP toolset configuration](/docs/en/agents-and-tools/mcp-connector#mcp-toolset-configuration).
## Custom tool search implementation
You can implement your own tool search logic (for example, using embeddings or semantic search) by returning `tool\_reference` blocks from a custom tool. When Claude calls your custom search tool, return a standard `tool\_result` with `tool\_reference` blocks in the content array:
```json JSON
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_your\_tool\_id",
"content": [{ "type": "tool\_reference", "tool\_name": "discovered\_tool\_name" }]
}
```
Every tool referenced must have a corresponding tool definition in the top-level `tools` parameter, normally with `defer\_loading: true`. This lets you use search methods the built-in variants don't provide, such as embedding-based retrieval, and the API expands the returned `tool\_reference` blocks the same way.
The `tool\_search\_tool\_result` format shown in the [Response format](#response-format) section is the server-side format used internally by Anthropic's built-in tool search. For custom client-side implementations, always use the standard `tool\_result` format with `tool\_reference` content blocks as shown in the preceding example.
For a complete example using embeddings, see the [tool search with embeddings](https://platform.claude.com/cookbook/tool-use-tool-search-with-embeddings) recipe.
## Error handling
[Tool use examples](/docs/en/agents-and-tools/tool-use/define-tools#providing-tool-use-examples) work with tool search: when Claude discovers a deferred tool, the API expands its `input\_examples` along with its definition.
### HTTP errors (400 status)
These errors prevent the API from processing the request:
\*\*All tools deferred:\*\*
```json
{
"type": "error",
"error": {
"type": "invalid\_request\_error",
"message": "At least one tool must have defer\_loading=false. All tools cannot be deferred."
}
}
```
\*\*Missing tool definition:\*\*
```json
{
"type": "error",
"error": {
"type": "invalid\_request\_error",
"message": "Tool reference 'unknown\_tool' not found in available tools"
}
}
```
### Tool result errors (200 status)
When a tool search operation fails during execution, the API returns a 200 response with the error in the body:
```json JSON
{
"type": "tool\_search\_tool\_result",
"tool\_use\_id": "srvtoolu\_01ABC123",
"content": {
"type": "tool\_search\_tool\_result\_error",
"error\_code": "invalid\_tool\_input",
"error\_message": "Invalid regular expression pattern: missing ) at position 1"
}
}
```
The `error\_code` field has four possible values:
\* `invalid\_tool\_input`: the search input was invalid, for example a malformed regex pattern or a pattern over the 200-character limit
\* `unavailable`: the search couldn't run, for example because it timed out or the service was unavailable
\* `too\_many\_requests`: rate limit exceeded for tool search operations
\* `execution\_time\_exceeded`: the search exceeded its execution time limit
### Common mistakes
\*\*Cause:\*\* You set `defer\_loading: true` on every tool, including the tool search tool.
\*\*Fix:\*\* Remove `defer\_loading` from the tool search tool:
```json
{
"type": "tool\_search\_tool\_regex\_20251119",
"name": "tool\_search\_tool\_regex"
}
```

\*\*Cause:\*\* A `tool\_reference` points to a tool not in your `tools` array.
\*\*Fix:\*\* Ensure every tool that could be discovered has a complete definition:
```json
{
"name": "my\_tool",
"description": "Full description here",
"input\_schema": {
"type": "object"
},
"defer\_loading": true
}
```

\*\*Cause:\*\* The regex pattern doesn't match the tool's name, description, argument names, or argument descriptions.
\*\*Debugging steps:\*\*
1. Check tool name, description, argument names, and argument descriptions. Claude searches all of these fields.
2. Test your pattern: `import re; re.search(r"your\_pattern", "tool\_name", re.IGNORECASE)`.
3. Matching is case-insensitive, so casing differences aren't the problem.
4. Claude uses broad patterns such as `".\*weather.\*"`, not exact matches.
\*\*Tip:\*\* Add common keywords to tool descriptions to improve discoverability.
## Prompt caching
For how `defer\_loading` preserves prompt caching, see [Tool use with prompt caching](/docs/en/agents-and-tools/tool-use/tool-use-with-prompt-caching).
A tool with `defer\_loading: true` can't also carry `cache\_control`: the API returns a 400. Put the cache breakpoint on a non-deferred tool.
## Streaming
With streaming enabled, you'll receive tool search events as part of the stream:
```sse
event: content\_block\_start
data: {"type": "content\_block\_start", "index": 1, "content\_block": {"type": "server\_tool\_use", "id": "srvtoolu\_xyz789", "name": "tool\_search\_tool\_regex"}}
// Search pattern streamed
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 1, "delta": {"type": "input\_json\_delta", "partial\_json": "{\"pattern\":\"weather\"}"}}
// Pause while search executes
// Search results streamed
event: content\_block\_start
data: {"type": "content\_block\_start", "index": 2, "content\_block": {"type": "tool\_search\_tool\_result", "tool\_use\_id": "srvtoolu\_xyz789", "content": {"type": "tool\_search\_tool\_search\_result", "tool\_references": [{"type": "tool\_reference", "tool\_name": "get\_weather"}]}}}
// Claude continues with discovered tools
```
## Batch requests
You can include the tool search tool in the [Messages Batches API](/docs/en/build-with-claude/batch-processing).
## Limits and best practices
### Limits
\* \*\*Maximum deferred tools:\*\* 10,000 tools with `defer\_loading: true` per request
\* \*\*Search results:\*\* each search returns up to 5 matching tools by default
\* \*\*Pattern and query length:\*\* maximum 200 characters for regex patterns and 500 characters for BM25 queries
\* \*\*Model support:\*\* see [Model compatibility](#model-compatibility)
### When to use tool search
Use tool search when any of the following apply:
\* You have 10 or more tools available.
\* Your tool definitions consume more than 10k tokens.
\* Tool selection accuracy drops as your toolset grows.
\* You aggregate multiple MCP servers (200+ tools).
\* Your tool library grows over time.
Standard tool calling, without tool search, is a better fit when you have fewer than 10 tools, every tool is used in every request, or your tool definitions are small (less than 100 tokens total).
### Optimization tips
\* Keep your 3–5 most frequently used tools non-deferred.
\* Write clear, descriptive tool names and descriptions.
\* Use consistent namespacing in tool names: prefix by service or resource (for example, `github\_`, `slack\_`) so one search matches the whole group.
\* Use keywords in descriptions that match how users describe tasks.
\* Add a system prompt section describing available tool categories: "You can search for tools to interact with Slack, GitHub, and Jira."
\* Monitor which tools Claude discovers to refine your descriptions.
## Usage
Tool search isn't metered as a separate server tool. The response's `usage.server\_tool\_use` object has no tool search field, and the tool definitions that search loads into context count as input tokens like any other tool definition.
## Next steps

Let Claude store and retrieve information across conversations by implementing the memory tool's file operations in your application.

Directory of Anthropic-provided tools and reference for optional tool definition properties.

Configure MCP toolsets with deferred loading.

Cache tool definitions across turns and understand what invalidates your cache.

Specify tool schemas, write effective descriptions, and control when Claude calls your tools.
