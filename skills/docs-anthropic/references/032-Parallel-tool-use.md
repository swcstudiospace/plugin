# Parallel tool use

Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use.md

# Parallel tool use
Enable, format, and disable parallel tool calls, with message-history guidance and troubleshooting.
---
By default, Claude may call multiple tools in a single response. This page covers how to run those calls, how to format the message history so parallelism keeps working, and how to disable parallel tool use when you need to. For the single-call flow, see [Handle tool calls](/docs/en/agents-and-tools/tool-use/handle-tool-calls).
## Execution semantics
When Claude calls tools, the response has a `stop\_reason` of `tool\_use` and can contain several `tool\_use` blocks in a single assistant turn. How you run those calls is your decision. The API doesn't prescribe an execution order: you can run the calls concurrently (`Promise.all`, `asyncio.gather`), sequentially in the order they appear, or in any combination that suits your tools.
Choose the strategy based on what your tools do. Independent, read-only operations are usually safe to run in parallel for lower latency. Tools with side effects, shared state, or ordering requirements might be better run sequentially.
Whichever strategy you use, return one `tool\_result` for each `tool\_use` block, all together in the next user message. Match each result to its call with `tool\_use\_id`, and put every `tool\_result` block before any text content in that message. See [Handle tool calls](/docs/en/agents-and-tools/tool-use/handle-tool-calls) for the full formatting rules. If you choose not to run a particular call (for example, because you ran the batch sequentially and an earlier call failed), still return a `tool\_result` for it with `is\_error: true` and a brief explanation.
```json
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_02",
"is\_error": true,
"content": "Not executed: the preceding write\_file call failed."
}
```
## Test parallel tool calls
\*\*Use the Tool Runner for most applications:\*\* the SDK [Tool Runner](/docs/en/agents-and-tools/tool-use/tool-runner) handles responses with multiple tool calls and formats the results for you, so you don't write this handling yourself. Use the manual pattern on this page when you need direct control over how the calls run, such as custom batching, ordering, or error handling.
The following script sends a request that should trigger parallel tool calls, verifies the response contains them, and formats the tool results so parallelism keeps working. Run it with `ANTHROPIC\_API\_KEY` set in your environment:
```bash cURL
# This end-to-end test flow doesn't translate well to a one-off shell command.
# See the SDK tabs for the full flow. The underlying HTTP request is a standard
# tool use request with multiple tools defined.
```
```bash CLI
# This end-to-end test flow doesn't translate well to a one-off shell command.
# See the SDK tabs for the full flow.
```
```python Python
client = Anthropic()
# Define tools
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
},
{
"name": "get\_time",
"description": "Get the current time in a given timezone",
"input\_schema": {
"type": "object",
"properties": {
"timezone": {
"type": "string",
"description": "The timezone, e.g. America/New\_York",
}
},
"required": ["timezone"],
},
},
]
# Test conversation with parallel tool calls
messages = [
{
"role": "user",
"content": "What's the weather in SF and NYC, and what time is it there?",
}
]
# Make initial request
print("Requesting parallel tool calls...")
response = client.messages.create(
model="claude-opus-5", max\_tokens=1024, messages=messages, tools=tools
)
# Check for parallel tool calls
tool\_uses = [block for block in response.content if block.type == "tool\_use"]
print(f"\n✓ Claude made {len(tool\_uses)} tool calls")
if len(tool\_uses) > 1:
print("✓ Parallel tool calls detected!")
for tool in tool\_uses:
print(f" - {tool.name}: {tool.input}")
else:
print("✗ No parallel tool calls detected")
# Simulate tool execution and format results correctly
tool\_results = []
for tool\_use in tool\_uses:
if tool\_use.name == "get\_weather":
if "San Francisco" in str(tool\_use.input):
result = "San Francisco: 68°F, partly cloudy"
else:
result = "New York: 45°F, clear skies"
else: # get\_time
if "Los\_Angeles" in str(tool\_use.input):
result = "2:30 PM PST"
else:
result = "5:30 PM EST"
tool\_results.append(
{"type": "tool\_result", "tool\_use\_id": tool\_use.id, "content": result}
)
# Continue conversation with tool results
messages.extend(
[
{"role": "assistant", "content": response.content},
{"role": "user", "content": tool\_results}, # All results in one message!
]
)
# Get final response
print("\nGetting final response...")
final\_response = client.messages.create(
model="claude-opus-5", max\_tokens=1024, messages=messages, tools=tools
)
final\_text = next(
block.text for block in final\_response.content if block.type == "text"
)
print(f"\nClaude's response:\n{final\_text}")
# Verify formatting
print("\n--- Verification ---")
print(f"✓ Tool results sent in single user message: {len(tool\_results)} results")
print("✓ No text before tool results in content array")
print("✓ Conversation formatted correctly for future parallel tool use")
```
```typescript TypeScript
const client = new Anthropic();
// Define tools
const tools: Anthropic.Tool[] = [
{
name: "get\_weather",
description: "Get the current weather in a given location",
input\_schema: {
type: "object" as const,
properties: {
location: {
type: "string",
description: "The city and state, e.g. San Francisco, CA"
}
},
required: ["location"]
}
},
{
name: "get\_time",
description: "Get the current time in a given timezone",
input\_schema: {
type: "object" as const,
properties: {
timezone: {
type: "string",
description: "The timezone, e.g. America/New\_York"
}
},
required: ["timezone"]
}
}
];
// Make initial request
console.log("Requesting parallel tool calls...");
const response = await client.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
messages: [
{
role: "user",
content: "What's the weather in SF and NYC, and what time is it there?"
}
],
tools: tools
});
// Check for parallel tool calls
const toolUses = response.content.filter((block) => block.type === "tool\_use");
console.log(`\n✓ Claude made ${toolUses.length} tool calls`);
if (toolUses.length > 1) {
console.log("✓ Parallel tool calls detected!");
for (const tool of toolUses) {
if (tool.type === "tool\_use") {
console.log(` - ${tool.name}: ${JSON.stringify(tool.input)}`);
}
}
} else {
console.log("✗ No parallel tool calls detected");
}
// Simulate tool execution and format results correctly
const toolResults: Anthropic.ToolResultBlockParam[] = toolUses
.filter((block): block is Anthropic.ToolUseBlock => block.type === "tool\_use")
.map((toolUse) => {
const input = toolUse.input as Record;
let result: string;
if (toolUse.name === "get\_weather") {
result = input.location?.includes("San Francisco")
? "San Francisco: 68F, partly cloudy"
: "New York: 45F, clear skies";
} else {
result = input.timezone?.includes("Los\_Angeles") ? "2:30 PM PST" : "5:30 PM EST";
}
return {
type: "tool\_result" as const,
tool\_use\_id: toolUse.id,
content: result
};
});
// Get final response with correct formatting
console.log("\nGetting final response...");
const finalResponse = await client.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
messages: [
{
role: "user",
content: "What's the weather in SF and NYC, and what time is it there?"
},
{ role: "assistant", content: response.content },
{ role: "user", content: toolResults }
],
tools: tools
});
for (const block of finalResponse.content) {
if (block.type === "text") {
console.log(`\nClaude's response:\n${block.text}`);
}
}
// Verify formatting
console.log("\n--- Verification ---");
console.log(`✓ Tool results sent in single user message: ${toolResults.length} results`);
console.log("✓ No text before tool results in content array");
console.log("✓ Conversation formatted correctly for future parallel tool use");
```
```csharp C#
AnthropicClient client = new();
var tools = new List
{
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
new ToolUnion(new Tool()
{
Name = "get\_time",
Description = "Get the current time in a given timezone",
InputSchema = new InputSchema()
{
Properties = new Dictionary
{
["timezone"] = JsonSerializer.SerializeToElement(new { type = "string", description = "The timezone, e.g. America/New\_York" }),
},
Required = ["timezone"],
},
}),
};
Console.WriteLine("Requesting parallel tool calls...");
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Messages = [new() { Role = Role.User, Content = "What's the weather in SF and NYC, and what time is it there?" }],
Tools = tools
};
var response = await client.Messages.Create(parameters);
var toolUses = new List();
foreach (var block in response.Content)
{
if (block.TryPickToolUse(out var toolUse))
{
toolUses.Add(toolUse);
}
}
Console.WriteLine($"\n✓ Claude made {toolUses.Count} tool calls");
if (toolUses.Count > 1)
{
Console.WriteLine("✓ Parallel tool calls detected!");
foreach (var tool in toolUses)
{
Console.WriteLine($" - {tool.Name}: {JsonSerializer.Serialize(tool.Input)}");
}
}
else
{
Console.WriteLine("✗ No parallel tool calls detected");
}
var toolResults = new List();
foreach (var toolUse in toolUses)
{
string result;
if (toolUse.Name == "get\_weather")
{
result = JsonSerializer.Serialize(toolUse.Input).Contains("San Francisco")
? "San Francisco: 68°F, partly cloudy"
: "New York: 45°F, clear skies";
}
else
{
result = JsonSerializer.Serialize(toolUse.Input).Contains("Los\_Angeles")
? "2:30 PM PST"
: "5:30 PM EST";
}
toolResults.Add(new ContentBlockParam(new ToolResultBlockParam()
{
ToolUseID = toolUse.ID,
Content = result,
}));
}
Console.WriteLine("\nGetting final response...");
var finalParameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Messages = [
new() { Role = Role.User, Content = "What's the weather in SF and NYC, and what time is it there?" },
new() { Role = Role.Assistant, Content = response.Content.Select(block => new ContentBlockParam(block.Json)).ToList() },
new() { Role = Role.User, Content = new MessageParamContent(toolResults) }
],
Tools = tools
};
var finalResponse = await client.Messages.Create(finalParameters);
var text = finalResponse.Content.Select(b => b.Value).OfType().FirstOrDefault();
Console.WriteLine($"\nClaude's response:\n{text?.Text}");
Console.WriteLine("\n--- Verification ---");
Console.WriteLine($"✓ Tool results sent in single user message: {toolResults.Count} results");
Console.WriteLine("✓ No text before tool results in content array");
Console.WriteLine("✓ Conversation formatted correctly for future parallel tool use");
```
```go Go
client := anthropic.NewClient()
tools := []anthropic.ToolUnionParam{
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
{OfTool: &anthropic.ToolParam{
Name: "get\_time",
Description: anthropic.String("Get the current time in a given timezone"),
InputSchema: anthropic.ToolInputSchemaParam{
Properties: map[string]any{
"timezone": map[string]any{
"type": "string",
"description": "The timezone, e.g. America/New\_York",
},
},
Required: []string{"timezone"},
},
}},
}
fmt.Println("Requesting parallel tool calls...")
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("What's the weather in SF and NYC, and what time is it there?")),
},
Tools: tools,
})
if err != nil {
log.Fatal(err)
}
// Find tool use blocks using type switch
type toolUseInfo struct {
ID string
Name string
Input json.RawMessage
}
var toolUses []toolUseInfo
for \_, block := range response.Content {
switch variant := block.AsAny().(type) {
case anthropic.ToolUseBlock:
toolUses = append(toolUses, toolUseInfo{
ID: variant.ID,
Name: variant.Name,
Input: variant.Input,
})
}
}
fmt.Printf("\n✓ Claude made %d tool calls\n", len(toolUses))
if len(toolUses) > 1 {
fmt.Println("✓ Parallel tool calls detected!")
for \_, tool := range toolUses {
fmt.Printf(" - %s: %s\n", tool.Name, string(tool.Input))
}
} else {
fmt.Println("✗ No parallel tool calls detected")
}
// Build tool results
var toolResults []anthropic.ContentBlockParamUnion
for \_, toolUse := range toolUses {
var result string
inputStr := string(toolUse.Input)
if toolUse.Name == "get\_weather" {
if strings.Contains(inputStr, "San Francisco") {
result = "San Francisco: 68°F, partly cloudy"
} else {
result = "New York: 45°F, clear skies"
}
} else {
if strings.Contains(inputStr, "Los\_Angeles") {
result = "2:30 PM PST"
} else {
result = "5:30 PM EST"
}
}
toolResults = append(toolResults, anthropic.NewToolResultBlock(toolUse.ID, result, false))
}
fmt.Println("\nGetting final response...")
finalResponse, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("What's the weather in SF and NYC, and what time is it there?")),
response.ToParam(),
anthropic.NewUserMessage(toolResults...),
},
Tools: tools,
})
if err != nil {
log.Fatal(err)
}
var finalText string
for \_, block := range finalResponse.Content {
if textBlock, ok := block.AsAny().(anthropic.TextBlock); ok {
finalText = textBlock.Text
break
}
}
fmt.Printf("\nClaude's response:\n%s\n", finalText)
fmt.Println("\n--- Verification ---")
fmt.Printf("✓ Tool results sent in single user message: %d results\n", len(toolResults))
fmt.Println("✓ No text before tool results in content array")
fmt.Println("✓ Conversation formatted correctly for future parallel tool use")
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
Tool weatherTool = Tool.builder()
.name("get\_weather")
.description("Get the current weather in a given location")
.inputSchema(InputSchema.builder()
.properties(JsonValue.from(Map.of(
"location", Map.of(
"type", "string",
"description", "The city and state, e.g. San Francisco, CA"
)
)))
.putAdditionalProperty("required", JsonValue.from(List.of("location")))
.build())
.build();
Tool timeTool = Tool.builder()
.name("get\_time")
.description("Get the current time in a given timezone")
.inputSchema(InputSchema.builder()
.properties(JsonValue.from(Map.of(
"timezone", Map.of(
"type", "string",
"description", "The timezone, e.g. America/New\_York"
)
)))
.putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
.build())
.build();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addTool(weatherTool)
.addTool(timeTool)
.addUserMessage("What's the weather in SF and NYC, and what time is it there?")
.build();
IO.println("Requesting parallel tool calls...");
Message response = client.messages().create(params);
List toolUses = new ArrayList<>();
for (ContentBlock block : response.content()) {
if (block.toolUse().isPresent()) {
toolUses.add(block.toolUse().get());
}
}
IO.println("\n✓ Claude made " + toolUses.size() + " tool calls");
if (toolUses.size() > 1) {
IO.println("✓ Parallel tool calls detected!");
for (ToolUseBlock tool : toolUses) {
IO.println(" - " + tool.name() + ": " + tool.\_input());
}
} else {
IO.println("✗ No parallel tool calls detected");
}
List toolResults = new ArrayList<>();
for (ToolUseBlock toolUse : toolUses) {
String result;
if (toolUse.name().equals("get\_weather")) {
String location = toolUse.\_input().toString();
result = location.contains("San Francisco")
? "San Francisco: 68°F, partly cloudy"
: "New York: 45°F, clear skies";
} else {
String timezone = toolUse.\_input().toString();
result = timezone.contains("Los\_Angeles")
? "2:30 PM PST"
: "5:30 PM EST";
}
toolResults.add(ContentBlockParam.ofToolResult(
ToolResultBlockParam.builder()
.toolUseId(toolUse.id())
.content(result)
.build()
));
}
IO.println("\nGetting final response...");
MessageCreateParams finalParams = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addTool(weatherTool)
.addTool(timeTool)
.addUserMessage("What's the weather in SF and NYC, and what time is it there?")
.addMessage(response)
.addUserMessageOfBlockParams(toolResults)
.build();
Message finalResponse = client.messages().create(finalParams);
finalResponse.content().stream()
.flatMap(block -> block.text().stream())
.forEach(textBlock -> IO.println("\nClaude's response:\n" + textBlock.text()));
IO.println("\n--- Verification ---");
IO.println("✓ Tool results sent in single user message: " + toolResults.size() + " results");
IO.println("✓ No text before tool results in content array");
IO.println("✓ Conversation formatted correctly for future parallel tool use");
```
```php PHP
$client = new Client();
$tools = [
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
],
[
'name' => 'get\_time',
'description' => 'Get the current time in a given timezone',
'input\_schema' => [
'type' => 'object',
'properties' => [
'timezone' => [
'type' => 'string',
'description' => 'The timezone, e.g. America/New\_York'
]
],
'required' => ['timezone']
]
]
];
echo "Requesting parallel tool calls...\n";
$response = $client->messages->create(
maxTokens: 1024,
messages: [
['role' => 'user', 'content' => "What's the weather in SF and NYC, and what time is it there?"]
],
model: 'claude-opus-5',
tools: $tools,
);
$toolUses = array\_filter($response->content, fn($block) => $block->type === 'tool\_use');
echo "\n✓ Claude made " . count($toolUses) . " tool calls\n";
if (count($toolUses) > 1) {
echo "✓ Parallel tool calls detected!\n";
foreach ($toolUses as $tool) {
echo " - {$tool->name}: " . json\_encode($tool->input) . "\n";
}
} else {
echo "✗ No parallel tool calls detected\n";
}
$toolResults = [];
foreach ($toolUses as $toolUse) {
if ($toolUse->name === 'get\_weather') {
$result = str\_contains(json\_encode($toolUse->input), 'San Francisco')
? 'San Francisco: 68°F, partly cloudy'
: 'New York: 45°F, clear skies';
} else {
$result = str\_contains(json\_encode($toolUse->input), 'Los\_Angeles')
? '2:30 PM PST'
: '5:30 PM EST';
}
$toolResults[] = [
'type' => 'tool\_result',
'tool\_use\_id' => $toolUse->id,
'content' => $result
];
}
echo "\nGetting final response...\n";
$finalResponse = $client->messages->create(
maxTokens: 1024,
messages: [
['role' => 'user', 'content' => "What's the weather in SF and NYC, and what time is it there?"],
['role' => 'assistant', 'content' => $response->content],
['role' => 'user', 'content' => $toolResults]
],
model: 'claude-opus-5',
tools: $tools,
);
$textBlock = array\_find($finalResponse->content, static fn ($block): bool => $block->type === 'text');
echo "\nClaude's response:\n{$textBlock->text}\n";
echo "\n--- Verification ---\n";
echo "✓ Tool results sent in single user message: " . count($toolResults) . " results\n";
echo "✓ No text before tool results in content array\n";
echo "✓ Conversation formatted correctly for future parallel tool use\n";
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
},
{
name: "get\_time",
description: "Get the current time in a given timezone",
input\_schema: {
type: "object",
properties: {
timezone: {
type: "string",
description: "The timezone, e.g. America/New\_York"
}
},
required: ["timezone"]
}
}
]
puts "Requesting parallel tool calls..."
response = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
messages: [
{ role: "user", content: "What's the weather in SF and NYC, and what time is it there?" }
],
tools: tools
)
tool\_uses = response.content.select { |block| block.type == :tool\_use }
puts "\n✓ Claude made #{tool\_uses.length} tool calls"
if tool\_uses.length > 1
puts "✓ Parallel tool calls detected!"
tool\_uses.each do |tool|
puts " - #{tool.name}: #{tool.input}"
end
else
puts "✗ No parallel tool calls detected"
end
tool\_results = tool\_uses.map do |tool\_use|
result = if tool\_use.name == "get\_weather"
location = tool\_use.input[:location].to\_s
location.include?("San Francisco") ? "San Francisco: 68°F, partly cloudy" : "New York: 45°F, clear skies"
else
timezone = tool\_use.input[:timezone].to\_s
timezone.include?("Los\_Angeles") ? "2:30 PM PST" : "5:30 PM EST"
end
{
type: "tool\_result",
tool\_use\_id: tool\_use.id,
content: result
}
end
puts "\nGetting final response..."
final\_response = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
messages: [
{ role: "user", content: "What's the weather in SF and NYC, and what time is it there?" },
{ role: "assistant", content: response.content },
{ role: "user", content: tool\_results }
],
tools: tools
)
final\_text = final\_response.content.find { |block| block.type == :text }
puts "\nClaude's response:\n#{final\_text.text}"
puts "\n--- Verification ---"
puts "✓ Tool results sent in single user message: #{tool\_results.length} results"
puts "✓ No text before tool results in content array"
puts "✓ Conversation formatted correctly for future parallel tool use"
```
The summary lines at the end restate the two formatting rules that keep parallelism working: every tool result returns in a single user message, and no text content appears before the tool results in that message.
## Maximizing parallel tool use
Claude 4 and later models make parallel tool calls by default when a request benefits from multiple tools. For all models, you can increase the likelihood of parallel tool calls with targeted prompting:

For Claude 4 and later models, add this to your system prompt:
```text wrap
For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
```
For even stronger parallel tool use (recommended if the default isn't sufficient), use:
```text wrap
For maximum efficiency, whenever you perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially. Prioritize calling tools in parallel whenever possible. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. When running multiple read-only commands like `ls` or `list\_dir`, always run all of the commands in parallel. Err on the side of maximizing parallel tool calls rather than running too many tools sequentially.
```

You can also encourage parallel tool use within specific user messages:
```text wrap
Instead of:
"What's the weather in Paris? Also check London."
Use:
"Check the weather in Paris and London simultaneously."
Or be explicit:
"Please use parallel tool calls to get the weather for Paris, London, and Tokyo at the same time."
```
## Disable parallel tool use
Parallel tool use is on by default. To turn it off, set `disable\_parallel\_tool\_use: true` inside the [`tool\_choice`](/docs/en/agents-and-tools/tool-use/define-tools#forcing-tool-use) object. It is not a top-level request parameter. The effect depends on the `tool\_choice` type.
### At most one tool call
When `tool\_choice` type is `auto` (the default), setting `disable\_parallel\_tool\_use: true` means Claude calls at most one tool per response. Claude can still answer in plain text without calling any tool. The highlighted lines are the only change from a standard tool use request:
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"tools": [{
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
}],
"tool\_choice": {"type": "auto", "disable\_parallel\_tool\_use": true},
"messages": [
{"role": "user", "content": "What is the weather in San Francisco and New York?"}
]
}'
```
```bash CLI
ant messages create <<'YAML'
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
required: [location]
tool\_choice:
type: auto
disable\_parallel\_tool\_use: true
messages:
- role: user
content: What is the weather in San Francisco and New York?
YAML
```
```python Python
client = Anthropic()
response = client.messages.create(
model="claude-opus-5",
max\_tokens=1024,
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
tool\_choice={"type": "auto", "disable\_parallel\_tool\_use": True},
messages=[
{
"role": "user",
"content": "What is the weather in San Francisco and New York?",
}
],
)
print(response.content)
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
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
tool\_choice: { type: "auto", disable\_parallel\_tool\_use: true },
messages: [{ role: "user", content: "What is the weather in San Francisco and New York?" }]
});
console.log(response.content);
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
ToolChoice = new ToolChoiceAuto { DisableParallelToolUse = true },
Messages = [new() { Role = Role.User, Content = "What is the weather in San Francisco and New York?" }]
};
var response = await client.Messages.Create(parameters);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
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
ToolChoice: anthropic.ToolChoiceUnionParam{
OfAuto: &anthropic.ToolChoiceAutoParam{
DisableParallelToolUse: anthropic.Bool(true),
},
},
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("What is the weather in San Francisco and New York?")),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response.Content)
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
InputSchema schema = InputSchema.builder()
.properties(
JsonValue.from(
Map.of(
"location", Map.of(
"type", "string",
"description", "The city and state, e.g. San Francisco, CA"
)
)
)
)
.putAdditionalProperty("required", JsonValue.from(List.of("location")))
.build();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addTool(
Tool.builder()
.name("get\_weather")
.description("Get the current weather in a given location")
.inputSchema(schema)
.build()
)
.toolChoice(ToolChoiceAuto.builder().disableParallelToolUse(true).build())
.addUserMessage("What is the weather in San Francisco and New York?")
.build();
Message response = client.messages().create(params);
IO.println(response.content());
```
```php PHP
$client = new Client();
$response = $client->messages->create(
maxTokens: 1024,
messages: [
['role' => 'user', 'content' => 'What is the weather in San Francisco and New York?']
],
model: 'claude-opus-5',
toolChoice: ['type' => 'auto', 'disableParallelToolUse' => true],
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
echo $response;
```
```ruby Ruby
client = Anthropic::Client.new
response = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
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
tool\_choice: { type: "auto", disable\_parallel\_tool\_use: true },
messages: [
{ role: "user", content: "What is the weather in San Francisco and New York?" }
]
)
puts response.content
```
### Exactly one tool call
When `tool\_choice` type is `any` or `tool`, setting `disable\_parallel\_tool\_use: true` means Claude calls exactly one tool. The following example uses `any`. The same field works with `tool`:
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"tools": [{
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
}],
"tool\_choice": {"type": "any", "disable\_parallel\_tool\_use": true},
"messages": [
{"role": "user", "content": "What is the weather in San Francisco and New York?"}
]
}'
```
```bash CLI
ant messages create <<'YAML'
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
required: [location]
tool\_choice:
type: any
disable\_parallel\_tool\_use: true
messages:
- role: user
content: What is the weather in San Francisco and New York?
YAML
```
```python Python
client = Anthropic()
response = client.messages.create(
model="claude-opus-5",
max\_tokens=1024,
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
tool\_choice={"type": "any", "disable\_parallel\_tool\_use": True},
messages=[
{
"role": "user",
"content": "What is the weather in San Francisco and New York?",
}
],
)
print(response.content)
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
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
tool\_choice: { type: "any", disable\_parallel\_tool\_use: true },
messages: [{ role: "user", content: "What is the weather in San Francisco and New York?" }]
});
console.log(response.content);
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
ToolChoice = new ToolChoiceAny { DisableParallelToolUse = true },
Messages = [new() { Role = Role.User, Content = "What is the weather in San Francisco and New York?" }]
};
var response = await client.Messages.Create(parameters);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
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
ToolChoice: anthropic.ToolChoiceUnionParam{
OfAny: &anthropic.ToolChoiceAnyParam{
DisableParallelToolUse: anthropic.Bool(true),
},
},
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("What is the weather in San Francisco and New York?")),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response.Content)
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
InputSchema schema = InputSchema.builder()
.properties(
JsonValue.from(
Map.of(
"location", Map.of(
"type", "string",
"description", "The city and state, e.g. San Francisco, CA"
)
)
)
)
.putAdditionalProperty("required", JsonValue.from(List.of("location")))
.build();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addTool(
Tool.builder()
.name("get\_weather")
.description("Get the current weather in a given location")
.inputSchema(schema)
.build()
)
.toolChoice(ToolChoiceAny.builder().disableParallelToolUse(true).build())
.addUserMessage("What is the weather in San Francisco and New York?")
.build();
Message response = client.messages().create(params);
IO.println(response.content());
```
```php PHP
$client = new Client();
$response = $client->messages->create(
maxTokens: 1024,
messages: [
['role' => 'user', 'content' => 'What is the weather in San Francisco and New York?']
],
model: 'claude-opus-5',
toolChoice: ['type' => 'any', 'disableParallelToolUse' => true],
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
echo $response;
```
```ruby Ruby
client = Anthropic::Client.new
response = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
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
tool\_choice: { type: "any", disable\_parallel\_tool\_use: true },
messages: [
{ role: "user", content: "What is the weather in San Francisco and New York?" }
]
)
puts response.content
```
## Troubleshooting
If Claude isn't making parallel tool calls when expected, check these common issues:
\*\*1. Incorrect tool result formatting\*\*
The most common issue is formatting tool results incorrectly in the conversation history. This "teaches" Claude to avoid parallel calls.
Specifically for parallel tool use:
\* \*\*Wrong:\*\* a separate user message for each tool result
\* \*\*Correct:\*\* all tool results together in a single user message
```json
// Wrong: separate user messages reduce parallel tool use
[
{"role": "assistant", "content": [tool\_use\_1, tool\_use\_2]},
{"role": "user", "content": [tool\_result\_1]},
{"role": "user", "content": [tool\_result\_2]} // Separate message
]
// Correct: one user message with all results maintains parallel tool use
[
{"role": "assistant", "content": [tool\_use\_1, tool\_use\_2]},
{"role": "user", "content": [tool\_result\_1, tool\_result\_2]} // Single message
]
```
See [Handle tool calls](/docs/en/agents-and-tools/tool-use/handle-tool-calls) for other formatting rules.
\*\*2. Weak prompting\*\*
Default prompting might not be sufficient. Use the stronger system prompt from [Maximizing parallel tool use](#maximizing-parallel-tool-use).
\*\*3. Measuring parallel tool usage\*\*
To verify parallel tool calls are working:
```bash cURL
# Measuring parallel tool use is client-side analysis of responses you've already
# collected, so it doesn't translate to a one-off shell command. See the SDK tabs.
```
```bash CLI
# Measuring parallel tool use is client-side analysis of responses you've already
# collected, so it doesn't translate to a one-off shell command. See the SDK tabs.
```
```python Python
messages = [] # Message objects returned by client.messages.create across your run
tool\_call\_messages = [
msg for msg in messages if any(block.type == "tool\_use" for block in msg.content)
]
total\_tool\_calls = sum(
len([block for block in msg.content if block.type == "tool\_use"])
for msg in tool\_call\_messages
)
avg\_tools\_per\_message = (
total\_tool\_calls / len(tool\_call\_messages) if tool\_call\_messages else 0.0
)
print(f"Average tools per message: {avg\_tools\_per\_message}")
# Should be > 1.0 if parallel calls are working
```
```typescript TypeScript
const messages: Anthropic.Message[] = []; // Message objects returned by client.messages.create across your run
const toolCallMessages = messages.filter((message) =>
message.content.some((block) => block.type === "tool\_use")
);
const totalToolCalls = toolCallMessages.reduce(
(sum, message) => sum + message.content.filter((block) => block.type === "tool\_use").length,
0
);
const avgToolsPerMessage =
toolCallMessages.length > 0 ? totalToolCalls / toolCallMessages.length : 0;
console.log(`Average tools per message: ${avgToolsPerMessage}`);
// Should be > 1.0 if parallel calls are working
```
```csharp C#
List messages = []; // Message objects returned by client.Messages.Create across your run
var toolCallMessages = messages
.Where(message => message.Content.Any(block => block.TryPickToolUse(out \_)))
.ToList();
var totalToolCalls = toolCallMessages
.Sum(message => message.Content.Count(block => block.TryPickToolUse(out \_)));
var avgToolsPerMessage = toolCallMessages.Count > 0 ? (double)totalToolCalls / toolCallMessages.Count : 0.0;
Console.WriteLine($"Average tools per message: {avgToolsPerMessage}");
// Should be > 1.0 if parallel calls are working
```
```go Go
var messages []anthropic.Message // Message values returned by client.Messages.New across your run
toolCallMessageCount := 0
totalToolCalls := 0
for \_, message := range messages {
callsInMessage := 0
for \_, block := range message.Content {
if block.Type == "tool\_use" {
callsInMessage++
}
}
if callsInMessage > 0 {
toolCallMessageCount++
totalToolCalls += callsInMessage
}
}
avgToolsPerMessage := 0.0
if toolCallMessageCount > 0 {
avgToolsPerMessage = float64(totalToolCalls) / float64(toolCallMessageCount)
}
fmt.Println("Average tools per message:", avgToolsPerMessage)
// Should be > 1.0 if parallel calls are working
```
```java Java
List messages = List.of(); // Message objects returned by client.messages().create() across your run
List toolCallMessages = messages.stream()
.filter(message -> message.content().stream().anyMatch(ContentBlock::isToolUse))
.toList();
long totalToolCalls = toolCallMessages.stream()
.mapToLong(message -> message.content().stream().filter(ContentBlock::isToolUse).count())
.sum();
double avgToolsPerMessage = toolCallMessages.isEmpty() ? 0.0 : (double) totalToolCalls / toolCallMessages.size();
IO.println("Average tools per message: " + avgToolsPerMessage);
// Should be > 1.0 if parallel calls are working
```
```php PHP
// $messages: Message objects returned by $client->messages->create() across your run
$messages = [];
$toolCallMessages = array\_values(array\_filter(
$messages,
fn ($message) => count(array\_filter($message->content, fn ($block) => $block->type === 'tool\_use')) > 0
));
$totalToolCalls = array\_sum(array\_map(
fn ($message) => count(array\_filter($message->content, fn ($block) => $block->type === 'tool\_use')),
$toolCallMessages
));
$avgToolsPerMessage = count($toolCallMessages) > 0 ? $totalToolCalls / count($toolCallMessages) : 0.0;
echo "Average tools per message: {$avgToolsPerMessage}\n";
// Should be > 1.0 if parallel calls are working
```
```ruby Ruby
messages = [] # Message objects returned by client.messages.create across your run
tool\_call\_messages = messages.select { |message| message.content.any? { |block| block.type == :tool\_use } }
total\_tool\_calls = tool\_call\_messages.sum { |message| message.content.count { |block| block.type == :tool\_use } }
avg\_tools\_per\_message = tool\_call\_messages.empty? ? 0.0 : total\_tool\_calls.to\_f / tool\_call\_messages.size
puts "Average tools per message: #{avg\_tools\_per\_message}"
# Should be > 1.0 if parallel calls are working
```
\*\*4. Calls in a batch appear to depend on each other\*\*
Execution order is your choice. If your tools have ordering dependencies, running the batch sequentially and stopping on the first failure is a valid strategy: return `is\_error: true` for any call you didn't run. If you run in parallel and a call fails because its prerequisite hadn't completed, return `is\_error: true` with the natural error message. Claude will reissue the call on the next turn. To reduce dependent calls appearing together, add this to your system prompt: "Only batch tool calls that are independent of each other."
## Next steps

Use the SDK's Tool Runner abstraction to handle the agentic loop, error wrapping, and type safety automatically.

Parse tool\\_use blocks, format tool\\_result responses, and handle errors with is\\_error.

Specify tool schemas, write effective descriptions, and control when Claude calls your tools.
