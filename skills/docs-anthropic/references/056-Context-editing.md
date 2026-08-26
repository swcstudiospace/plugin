# Context editing

Source: https://platform.claude.com/docs/en/build-with-claude/context-editing.md

# Context editing
Automatically manage conversation context as it grows with context editing.
---
For how zero data retention (ZDR) applies to this feature, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
## Overview
For most use cases, [server-side compaction](/docs/en/build-with-claude/compaction) is the primary strategy for managing context in long-running conversations. The strategies on this page are useful for specific scenarios where you need more fine-grained control over what content is cleared.
Context editing allows you to selectively clear specific content from conversation history as it grows. Beyond optimizing costs and staying within limits, this is about actively curating what Claude sees: context is a finite resource with diminishing returns, and irrelevant content degrades model focus. Context editing gives you fine-grained runtime control over that curation. For the broader principles behind context management, see [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). This page covers:
\* \*\*Tool result clearing\*\* - Best for agentic workflows with heavy tool use where old tool results are no longer needed
\* \*\*Thinking block clearing\*\* - For managing thinking blocks when using extended thinking, with options to preserve recent thinking for context continuity
\* \*\*Client-side SDK compaction\*\* - An SDK-based alternative for summary-based context management (server-side compaction is generally preferred)
| Approach | Where it runs | Strategies | How it works |
| --------------- | ------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| \*\*Server-side\*\* | API | Tool result clearing (`clear\_tool\_uses\_20250919`) Thinking block clearing (`clear\_thinking\_20251015`) | Applied before the prompt reaches Claude. Clears specific content from conversation history. Each strategy can be configured independently. |
| \*\*Client-side\*\* | SDK | Compaction | Available in [Python, TypeScript, and Ruby SDKs](/docs/en/cli-sdks-libraries/overview) when using [`tool\_runner`](/docs/en/agents-and-tools/tool-use/tool-runner). Generates a summary and replaces full conversation history. See [Client-side compaction](#client-side-compaction-sdk). |
## Server-side strategies
Context editing is in beta with support for tool result clearing and thinking block clearing. To enable it, use the beta header `context-management-2025-06-27` in your API requests.
Share feedback on this feature through the [feedback form](https://forms.gle/YXC2EKGMhjN1c4L88).
### Tool result clearing
The `clear\_tool\_uses\_20250919` strategy clears tool results when conversation context grows beyond your configured threshold. This is particularly useful for agentic workflows with heavy tool use. Older tool results (like file contents or search results) are no longer needed once Claude has processed them.
When activated, the API automatically clears the oldest tool results in chronological order. The API replaces each cleared result with placeholder text so Claude knows it was removed. By default, only tool results are cleared. You can optionally clear both tool results and tool calls (the tool use parameters) by setting `clear\_tool\_inputs` to true.
### Thinking block clearing
The `clear\_thinking\_20251015` strategy manages `thinking` blocks in conversations when extended thinking is enabled. This strategy gives you control over thinking preservation: you can choose to keep more thinking blocks to maintain reasoning continuity, or clear them more aggressively to save context space.
\*\*Default behavior:\*\* The default varies by model class.
| Model class | Keep all prior thinking | Keep only the last turn's thinking |
| ----------- | --------------------------- | ---------------------------------------- |
| Opus | Claude Opus 4.5 and later | Claude Opus 4.1 (deprecated) and earlier |
| Sonnet | Claude Sonnet 4.6 and later | Claude Sonnet 4.5 and earlier |
| Haiku | (none) | All models through Claude Haiku 4.5 |
Use this strategy to override the default. If your code runs across multiple model tiers, set `keep` explicitly rather than relying on the per-model default.
An assistant conversation turn may include multiple content blocks (for example, when using tools) and multiple thinking blocks (for example, with [interleaved thinking](/docs/en/build-with-claude/thinking#interleaved-thinking)).
### Context editing happens server-side
Context editing is applied server-side before the prompt reaches Claude. Your client application maintains the full, unmodified conversation history. You do not need to sync your client state with the edited version. Continue managing your full conversation history locally as you normally would.
### Context editing and prompt caching
Context editing's interaction with [prompt caching](/docs/en/build-with-claude/prompt-caching) varies by strategy:
\* \*\*Tool result clearing\*\*: Invalidates cached prompt prefixes when content is cleared. To account for this, clear enough tokens to make the cache invalidation worthwhile. Use the `clear\_at\_least` parameter to ensure a minimum number of tokens is cleared each time. You'll incur cache write costs each time content is cleared, but subsequent requests can reuse the newly cached prefix.
\* \*\*Thinking block clearing\*\*: When thinking blocks are \*\*kept\*\* in context (not cleared), the prompt cache is preserved, enabling cache hits and reducing input token costs. When thinking blocks are \*\*cleared\*\*, the cache is invalidated at the point where clearing occurs. Configure the `keep` parameter based on whether you want to prioritize cache performance or context window availability.
## Supported models
Context editing is available on all supported Claude models.
## Tool result clearing usage
The simplest way to enable tool result clearing is to specify only the strategy type. All other [configuration options](#configuration-options-for-tool-result-clearing) use their default values:
```bash cURL
curl https://api.anthropic.com/v1/messages \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "content-type: application/json" \
--header "anthropic-beta: context-management-2025-06-27" \
--data '{
"model": "claude-opus-5",
"max\_tokens": 4096,
"messages": [
{
"role": "user",
"content": "Search for recent developments in AI"
}
],
"tools": [
{
"type": "web\_search\_20250305",
"name": "web\_search"
}
],
"context\_management": {
"edits": [
{"type": "clear\_tool\_uses\_20250919"}
]
}
}'
```
```bash CLI
ant beta:messages create --beta context-management-2025-06-27 <<'YAML'
model: claude-opus-5
max\_tokens: 4096
messages:
- role: user
content: Search for recent developments in AI
tools:
- type: web\_search\_20250305
name: web\_search
context\_management:
edits:
- type: clear\_tool\_uses\_20250919
YAML
```
```python Python
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=4096,
messages=[{"role": "user", "content": "Search for recent developments in AI"}],
tools=[{"type": "web\_search\_20250305", "name": "web\_search"}],
betas=["context-management-2025-06-27"],
context\_management={"edits": [{"type": "clear\_tool\_uses\_20250919"}]},
)
```
```typescript TypeScript
const anthropic = new Anthropic({
apiKey: process.env.ANTHROPIC\_API\_KEY
});
const response = await anthropic.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 4096,
messages: [
{
role: "user",
content: "Search for recent developments in AI"
}
],
tools: [
{
type: "web\_search\_20250305",
name: "web\_search"
}
],
context\_management: {
edits: [{ type: "clear\_tool\_uses\_20250919" }]
},
betas: ["context-management-2025-06-27"]
});
```
```csharp C#
using Anthropic;
using Anthropic.Models.Beta;
using Anthropic.Models.Beta.Messages;
using Messages = Anthropic.Models.Messages;
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Messages::Model.ClaudeOpus5,
MaxTokens = 4096,
Messages = [
new() { Role = Role.User, Content = "Search for recent developments in AI" }
],
Tools = [
new BetaWebSearchTool20250305()
],
ContextManagement = new BetaContextManagementConfig
{
Edits = [new BetaClearToolUses20250919Edit()]
},
Betas = [AnthropicBeta.ContextManagement2025\_06\_27]
};
var response = await client.Beta.Messages.Create(parameters);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 4096,
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Search for recent developments in AI")),
},
Tools: []anthropic.BetaToolUnionParam{
{OfWebSearchTool20250305: &anthropic.BetaWebSearchTool20250305Param{}},
},
ContextManagement: anthropic.BetaContextManagementConfigParam{
Edits: []anthropic.BetaContextManagementConfigEditUnionParam{
{OfClearToolUses20250919: &anthropic.BetaClearToolUses20250919EditParam{}},
},
},
Betas: []anthropic.AnthropicBeta{
anthropic.AnthropicBetaContextManagement2025\_06\_27,
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
import com.anthropic.models.beta.messages.BetaWebSearchTool20250305;
import com.anthropic.models.beta.messages.BetaContextManagementConfig;
import com.anthropic.models.beta.messages.BetaClearToolUses20250919Edit;
import com.anthropic.models.beta.AnthropicBeta;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addUserMessage("Search for recent developments in AI")
.addTool(BetaWebSearchTool20250305.builder().build())
.contextManagement(BetaContextManagementConfig.builder()
.addEdit(BetaClearToolUses20250919Edit.builder().build())
.build())
.addBeta(AnthropicBeta.CONTEXT\_MANAGEMENT\_2025\_06\_27)
.build();
BetaMessage response = client.beta().messages().create(params);
IO.println(response);
}
```
```php PHP
$client = new Client();
$response = $client->beta->messages->create(
maxTokens: 4096,
messages: [
['role' => 'user', 'content' => 'Search for recent developments in AI']
],
model: 'claude-opus-5',
betas: ['context-management-2025-06-27'],
tools: [
['type' => 'web\_search\_20250305', 'name' => 'web\_search']
],
contextManagement: [
'edits' => [
['type' => 'clear\_tool\_uses\_20250919']
]
],
);
echo $response;
```
```ruby Ruby
client = Anthropic::Client.new
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
messages: [
{ role: "user", content: "Search for recent developments in AI" }
],
tools: [
{ type: "web\_search\_20250305", name: "web\_search" }
],
context\_management: {
edits: [
{ type: "clear\_tool\_uses\_20250919" }
]
},
betas: ["context-management-2025-06-27"]
)
puts response
```
### Advanced configuration
You can customize the tool result clearing behavior with additional parameters:
```bash cURL
curl https://api.anthropic.com/v1/messages \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "content-type: application/json" \
--header "anthropic-beta: context-management-2025-06-27" \
--data '{
"model": "claude-opus-5",
"max\_tokens": 4096,
"messages": [
{
"role": "user",
"content": "Create a simple command line calculator app using Python"
}
],
"tools": [
{
"type": "text\_editor\_20250728",
"name": "str\_replace\_based\_edit\_tool",
"max\_characters": 10000
},
{
"type": "web\_search\_20250305",
"name": "web\_search",
"max\_uses": 3
}
],
"context\_management": {
"edits": [
{
"type": "clear\_tool\_uses\_20250919",
"trigger": {
"type": "input\_tokens",
"value": 30000
},
"keep": {
"type": "tool\_uses",
"value": 3
},
"clear\_at\_least": {
"type": "input\_tokens",
"value": 5000
},
"exclude\_tools": ["web\_search"]
}
]
}
}'
```
```bash CLI
ant beta:messages create --beta context-management-2025-06-27 <<'YAML'
model: claude-opus-5
max\_tokens: 4096
messages:
- role: user
content: Create a simple command line calculator app using Python
tools:
- type: text\_editor\_20250728
name: str\_replace\_based\_edit\_tool
max\_characters: 10000
- type: web\_search\_20250305
name: web\_search
max\_uses: 3
context\_management:
edits:
- type: clear\_tool\_uses\_20250919
trigger:
type: input\_tokens
value: 30000
keep:
type: tool\_uses
value: 3
clear\_at\_least:
type: input\_tokens
value: 5000
exclude\_tools:
- web\_search
YAML
```
```python Python
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=4096,
messages=[
{
"role": "user",
"content": "Create a simple command line calculator app using Python",
}
],
tools=[
{
"type": "text\_editor\_20250728",
"name": "str\_replace\_based\_edit\_tool",
"max\_characters": 10000,
},
{"type": "web\_search\_20250305", "name": "web\_search", "max\_uses": 3},
],
betas=["context-management-2025-06-27"],
context\_management={
"edits": [
{
"type": "clear\_tool\_uses\_20250919",
# Trigger clearing when threshold is exceeded
"trigger": {"type": "input\_tokens", "value": 30000},
# Number of tool uses to keep after clearing
"keep": {"type": "tool\_uses", "value": 3},
# Optional: Clear at least this many tokens
"clear\_at\_least": {"type": "input\_tokens", "value": 5000},
# Exclude these tools from being cleared
"exclude\_tools": ["web\_search"],
}
]
},
)
```
```typescript TypeScript
const anthropic = new Anthropic({
apiKey: process.env.ANTHROPIC\_API\_KEY
});
const response = await anthropic.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 4096,
messages: [
{
role: "user",
content: "Create a simple command line calculator app using Python"
}
],
tools: [
{
type: "text\_editor\_20250728",
name: "str\_replace\_based\_edit\_tool",
max\_characters: 10000
},
{
type: "web\_search\_20250305",
name: "web\_search",
max\_uses: 3
}
],
betas: ["context-management-2025-06-27"],
context\_management: {
edits: [
{
type: "clear\_tool\_uses\_20250919",
// Trigger clearing when threshold is exceeded
trigger: {
type: "input\_tokens",
value: 30000
},
// Number of tool uses to keep after clearing
keep: {
type: "tool\_uses",
value: 3
},
// Optional: Clear at least this many tokens
clear\_at\_least: {
type: "input\_tokens",
value: 5000
},
// Exclude these tools from being cleared
exclude\_tools: ["web\_search"]
}
]
}
});
```
```csharp C#
using Anthropic;
using Anthropic.Models.Beta;
using Anthropic.Models.Beta.Messages;
using Messages = Anthropic.Models.Messages;
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Messages::Model.ClaudeOpus5,
MaxTokens = 4096,
Messages = [
new() { Role = Role.User, Content = "Create a simple command line calculator app using Python" }
],
Tools = [
new BetaToolTextEditor20250728 { MaxCharacters = 10000 },
new BetaWebSearchTool20250305 { MaxUses = 3 }
],
Betas = [AnthropicBeta.ContextManagement2025\_06\_27],
ContextManagement = new BetaContextManagementConfig
{
Edits = [
new BetaClearToolUses20250919Edit
{
Trigger = new BetaInputTokensTrigger(30000),
Keep = new BetaToolUsesKeep(3),
ClearAtLeast = new BetaInputTokensClearAtLeast(5000),
ExcludeTools = ["web\_search"]
}
]
}
};
var response = await client.Beta.Messages.Create(parameters);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 4096,
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Create a simple command line calculator app using Python")),
},
Tools: []anthropic.BetaToolUnionParam{
{OfTextEditor20250728: &anthropic.BetaToolTextEditor20250728Param{
MaxCharacters: anthropic.Int(10000),
}},
{OfWebSearchTool20250305: &anthropic.BetaWebSearchTool20250305Param{
MaxUses: anthropic.Int(3),
}},
},
Betas: []anthropic.AnthropicBeta{anthropic.AnthropicBetaContextManagement2025\_06\_27},
ContextManagement: anthropic.BetaContextManagementConfigParam{
Edits: []anthropic.BetaContextManagementConfigEditUnionParam{
{OfClearToolUses20250919: &anthropic.BetaClearToolUses20250919EditParam{
Trigger: anthropic.BetaClearToolUses20250919EditTriggerUnionParam{
OfInputTokens: &anthropic.BetaInputTokensTriggerParam{
Value: 30000,
},
},
Keep: anthropic.BetaToolUsesKeepParam{
Value: 3,
},
ClearAtLeast: anthropic.BetaInputTokensClearAtLeastParam{
Value: 5000,
},
ExcludeTools: []string{"web\_search"},
}},
},
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
import com.anthropic.models.beta.messages.BetaToolTextEditor20250728;
import com.anthropic.models.beta.messages.BetaWebSearchTool20250305;
import com.anthropic.models.beta.messages.BetaContextManagementConfig;
import com.anthropic.models.beta.messages.BetaClearToolUses20250919Edit;
import com.anthropic.models.beta.messages.BetaInputTokensTrigger;
import com.anthropic.models.beta.messages.BetaInputTokensClearAtLeast;
import com.anthropic.models.beta.messages.BetaToolUsesKeep;
import com.anthropic.models.beta.AnthropicBeta;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addUserMessage("Create a simple command line calculator app using Python")
.addTool(BetaToolTextEditor20250728.builder()
.maxCharacters(10000L)
.build())
.addTool(BetaWebSearchTool20250305.builder()
.maxUses(3L)
.build())
.addBeta(AnthropicBeta.CONTEXT\_MANAGEMENT\_2025\_06\_27)
.contextManagement(BetaContextManagementConfig.builder()
.addEdit(BetaClearToolUses20250919Edit.builder()
.trigger(BetaInputTokensTrigger.builder()
.value(30000L)
.build())
.keep(BetaToolUsesKeep.builder()
.value(3L)
.build())
.clearAtLeast(BetaInputTokensClearAtLeast.builder()
.value(5000L)
.build())
.addExcludeTool("web\_search")
.build())
.build())
.build();
BetaMessage response = client.beta().messages().create(params);
IO.println(response);
}
```
```php PHP
$client = new Client();
$response = $client->beta->messages->create(
maxTokens: 4096,
messages: [
[
'role' => 'user',
'content' => 'Create a simple command line calculator app using Python'
]
],
model: 'claude-opus-5',
betas: ['context-management-2025-06-27'],
tools: [
[
'type' => 'text\_editor\_20250728',
'name' => 'str\_replace\_based\_edit\_tool',
'max\_characters' => 10000
],
[
'type' => 'web\_search\_20250305',
'name' => 'web\_search',
'max\_uses' => 3
]
],
contextManagement: [
'edits' => [
[
'type' => 'clear\_tool\_uses\_20250919',
'trigger' => [
'type' => 'input\_tokens',
'value' => 30000
],
'keep' => [
'type' => 'tool\_uses',
'value' => 3
],
'clear\_at\_least' => [
'type' => 'input\_tokens',
'value' => 5000
],
'exclude\_tools' => ['web\_search']
]
]
],
);
echo $response;
```
```ruby Ruby
client = Anthropic::Client.new
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
messages: [
{
role: "user",
content: "Create a simple command line calculator app using Python"
}
],
tools: [
{
type: "text\_editor\_20250728",
name: "str\_replace\_based\_edit\_tool",
max\_characters: 10000
},
{
type: "web\_search\_20250305",
name: "web\_search",
max\_uses: 3
}
],
betas: ["context-management-2025-06-27"],
context\_management: {
edits: [
{
type: "clear\_tool\_uses\_20250919",
trigger: {
type: "input\_tokens",
value: 30000
},
keep: {
type: "tool\_uses",
value: 3
},
clear\_at\_least: {
type: "input\_tokens",
value: 5000
},
exclude\_tools: ["web\_search"]
}
]
}
)
puts response
```
## Thinking block clearing usage
Enable thinking block clearing to manage context and prompt caching effectively when extended thinking is enabled:
```bash cURL
curl https://api.anthropic.com/v1/messages \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "content-type: application/json" \
--header "anthropic-beta: context-management-2025-06-27" \
--data '{
"model": "claude-opus-5",
"max\_tokens": 16000,
"messages": [{"role": "user", "content": "Hello"}],
"context\_management": {
"edits": [
{
"type": "clear\_thinking\_20251015",
"keep": {
"type": "thinking\_turns",
"value": 2
}
}
]
}
}'
```
```bash CLI
ant beta:messages create --beta context-management-2025-06-27 <<'YAML'
model: claude-opus-5
max\_tokens: 16000
messages:
- role: user
content: Hello
context\_management:
edits:
- type: clear\_thinking\_20251015
keep:
type: thinking\_turns
value: 2
YAML
```
```python Python
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=16000,
messages=[{"role": "user", "content": "Hello"}],
betas=["context-management-2025-06-27"],
context\_management={
"edits": [
{
"type": "clear\_thinking\_20251015",
"keep": {"type": "thinking\_turns", "value": 2},
}
]
},
)
```
```typescript TypeScript
const anthropic = new Anthropic({
apiKey: process.env.ANTHROPIC\_API\_KEY
});
const response = await anthropic.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 16000,
messages: [{ role: "user", content: "Hello" }],
betas: ["context-management-2025-06-27"],
context\_management: {
edits: [
{
type: "clear\_thinking\_20251015",
keep: {
type: "thinking\_turns",
value: 2
}
}
]
}
});
```
```csharp C#
using Anthropic;
using Anthropic.Models.Beta;
using Anthropic.Models.Beta.Messages;
using Messages = Anthropic.Models.Messages;
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Messages::Model.ClaudeOpus5,
MaxTokens = 16000,
Messages = [
new() { Role = Role.User, Content = "Hello" }
],
Betas = [AnthropicBeta.ContextManagement2025\_06\_27],
ContextManagement = new BetaContextManagementConfig
{
Edits = [
new BetaClearThinking20251015Edit
{
Keep = new BetaThinkingTurns(2)
}
]
}
};
var response = await client.Beta.Messages.Create(parameters);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 16000,
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Hello")),
},
Betas: []anthropic.AnthropicBeta{anthropic.AnthropicBetaContextManagement2025\_06\_27},
ContextManagement: anthropic.BetaContextManagementConfigParam{
Edits: []anthropic.BetaContextManagementConfigEditUnionParam{
{OfClearThinking20251015: &anthropic.BetaClearThinking20251015EditParam{
Keep: anthropic.BetaClearThinking20251015EditKeepUnionParam{
OfThinkingTurns: &anthropic.BetaThinkingTurnsParam{
Value: 2,
},
},
}},
},
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
import com.anthropic.models.beta.messages.BetaContextManagementConfig;
import com.anthropic.models.beta.messages.BetaClearThinking20251015Edit;
import com.anthropic.models.beta.messages.BetaThinkingTurns;
import com.anthropic.models.beta.AnthropicBeta;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(16000L)
.addUserMessage("Hello")
.addBeta(AnthropicBeta.CONTEXT\_MANAGEMENT\_2025\_06\_27)
.contextManagement(BetaContextManagementConfig.builder()
.addEdit(BetaClearThinking20251015Edit.builder()
.keep(BetaThinkingTurns.builder()
.value(2L)
.build())
.build())
.build())
.build();
BetaMessage response = client.beta().messages().create(params);
IO.println(response);
}
```
```php PHP
$client = new Client();
$response = $client->beta->messages->create(
maxTokens: 16000,
messages: [
['role' => 'user', 'content' => 'Hello']
],
model: 'claude-opus-5',
betas: ['context-management-2025-06-27'],
contextManagement: [
'edits' => [
[
'type' => 'clear\_thinking\_20251015',
'keep' => [
'type' => 'thinking\_turns',
'value' => 2
]
]
]
],
);
echo $response;
```
```ruby Ruby
client = Anthropic::Client.new
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 16000,
messages: [{ role: "user", content: "Hello" }],
betas: ["context-management-2025-06-27"],
context\_management: {
edits: [
{
type: "clear\_thinking\_20251015",
keep: {
type: "thinking\_turns",
value: 2
}
}
]
}
)
puts response
```
### Configuration options for thinking block clearing
The `clear\_thinking\_20251015` strategy supports the following configuration:
| Configuration option | Default | Description |
| -------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keep` | Model-specific | Defines how many recent assistant turns with thinking blocks to preserve. Use `{type: "thinking\_turns", value: N}` where N must be > 0 to keep the last N turns, or `"all"` to keep all thinking blocks. Opus 4.5+ and Sonnet 4.6+: all turns. Earlier Opus/Sonnet and all Haiku: last turn only. |
\*\*Example configurations:\*\*
Keep thinking blocks from the last 3 assistant turns:
```bash cURL
curl https://api.anthropic.com/v1/messages \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "content-type: application/json" \
--header "anthropic-beta: context-management-2025-06-27" \
--data '{
"model": "claude-opus-5",
"max\_tokens": 16000,
"messages": [{"role": "user", "content": "Hello"}],
"context\_management": {
"edits": [
{
"type": "clear\_thinking\_20251015",
"keep": {
"type": "thinking\_turns",
"value": 3
}
}
]
}
}'
```
```bash CLI
ant beta:messages create --beta context-management-2025-06-27 <<'YAML'
model: claude-opus-5
max\_tokens: 16000
messages:
- role: user
content: Hello
context\_management:
edits:
- type: clear\_thinking\_20251015
keep:
type: thinking\_turns
value: 3
YAML
```
```python Python
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=16000,
messages=[{"role": "user", "content": "Hello"}],
betas=["context-management-2025-06-27"],
context\_management={
"edits": [
{
"type": "clear\_thinking\_20251015",
"keep": {"type": "thinking\_turns", "value": 3},
}
]
},
)
```
```typescript TypeScript
const anthropic = new Anthropic({
apiKey: process.env.ANTHROPIC\_API\_KEY
});
const response = await anthropic.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 16000,
messages: [{ role: "user", content: "Hello" }],
betas: ["context-management-2025-06-27"],
context\_management: {
edits: [
{
type: "clear\_thinking\_20251015",
keep: {
type: "thinking\_turns",
value: 3
}
}
]
}
});
```
```csharp C#
using Anthropic;
using Anthropic.Models.Beta;
using Anthropic.Models.Beta.Messages;
using Messages = Anthropic.Models.Messages;
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Messages::Model.ClaudeOpus5,
MaxTokens = 16000,
Messages = [
new() { Role = Role.User, Content = "Hello" }
],
Betas = [AnthropicBeta.ContextManagement2025\_06\_27],
ContextManagement = new BetaContextManagementConfig
{
Edits = [
new BetaClearThinking20251015Edit
{
Keep = new BetaThinkingTurns(3)
}
]
}
};
var response = await client.Beta.Messages.Create(parameters);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 16000,
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Hello")),
},
Betas: []anthropic.AnthropicBeta{anthropic.AnthropicBetaContextManagement2025\_06\_27},
ContextManagement: anthropic.BetaContextManagementConfigParam{
Edits: []anthropic.BetaContextManagementConfigEditUnionParam{
{OfClearThinking20251015: &anthropic.BetaClearThinking20251015EditParam{
Keep: anthropic.BetaClearThinking20251015EditKeepUnionParam{
OfThinkingTurns: &anthropic.BetaThinkingTurnsParam{
Value: 3,
},
},
}},
},
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
.maxTokens(16000L)
.addUserMessage("Hello")
.addBeta(AnthropicBeta.CONTEXT\_MANAGEMENT\_2025\_06\_27)
.contextManagement(BetaContextManagementConfig.builder()
.addEdit(BetaClearThinking20251015Edit.builder()
.keep(BetaThinkingTurns.builder()
.value(3L)
.build())
.build())
.build())
.build();
BetaMessage response = client.beta().messages().create(params);
IO.println(response);
```
```php PHP
$client = new Client();
$response = $client->beta->messages->create(
maxTokens: 16000,
messages: [
['role' => 'user', 'content' => 'Hello']
],
model: 'claude-opus-5',
betas: ['context-management-2025-06-27'],
contextManagement: [
'edits' => [
[
'type' => 'clear\_thinking\_20251015',
'keep' => [
'type' => 'thinking\_turns',
'value' => 3
]
]
]
],
);
echo $response;
```
```ruby Ruby
client = Anthropic::Client.new
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 16000,
messages: [{ role: "user", content: "Hello" }],
betas: ["context-management-2025-06-27"],
context\_management: {
edits: [
{
type: "clear\_thinking\_20251015",
keep: {
type: "thinking\_turns",
value: 3
}
}
]
}
)
puts response
```
Keep all thinking blocks (maximizes cache hits):
```bash cURL
curl https://api.anthropic.com/v1/messages \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "content-type: application/json" \
--header "anthropic-beta: context-management-2025-06-27" \
--data '{
"model": "claude-opus-5",
"max\_tokens": 16000,
"messages": [{"role": "user", "content": "Hello"}],
"context\_management": {
"edits": [
{
"type": "clear\_thinking\_20251015",
"keep": "all"
}
]
}
}'
```
```bash CLI
ant beta:messages create --beta context-management-2025-06-27 <<'YAML'
model: claude-opus-5
max\_tokens: 16000
messages:
- role: user
content: Hello
context\_management:
edits:
- type: clear\_thinking\_20251015
keep: all
YAML
```
```python Python
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=16000,
messages=[{"role": "user", "content": "Hello"}],
betas=["context-management-2025-06-27"],
context\_management={
"edits": [
{
"type": "clear\_thinking\_20251015",
"keep": "all",
}
]
},
)
```
```typescript TypeScript
const anthropic = new Anthropic({
apiKey: process.env.ANTHROPIC\_API\_KEY
});
const response = await anthropic.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 16000,
messages: [{ role: "user", content: "Hello" }],
betas: ["context-management-2025-06-27"],
context\_management: {
edits: [
{
type: "clear\_thinking\_20251015",
keep: "all"
}
]
}
});
```
```csharp C#
using Anthropic;
using Anthropic.Models.Beta;
using Anthropic.Models.Beta.Messages;
using Messages = Anthropic.Models.Messages;
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Messages::Model.ClaudeOpus5,
MaxTokens = 16000,
Messages = [
new() { Role = Role.User, Content = "Hello" }
],
Betas = [AnthropicBeta.ContextManagement2025\_06\_27],
ContextManagement = new BetaContextManagementConfig
{
Edits = [
new BetaClearThinking20251015Edit
{
Keep = new All()
}
]
}
};
var response = await client.Beta.Messages.Create(parameters);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 16000,
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Hello")),
},
Betas: []anthropic.AnthropicBeta{anthropic.AnthropicBetaContextManagement2025\_06\_27},
ContextManagement: anthropic.BetaContextManagementConfigParam{
Edits: []anthropic.BetaContextManagementConfigEditUnionParam{
{OfClearThinking20251015: &anthropic.BetaClearThinking20251015EditParam{
Keep: anthropic.BetaClearThinking20251015EditKeepUnionParam{
OfAll: constant.ValueOf[constant.All](),
},
}},
},
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
.maxTokens(16000L)
.addUserMessage("Hello")
.addBeta(AnthropicBeta.CONTEXT\_MANAGEMENT\_2025\_06\_27)
.contextManagement(BetaContextManagementConfig.builder()
.addEdit(BetaClearThinking20251015Edit.builder()
.keepAll()
.build())
.build())
.build();
BetaMessage response = client.beta().messages().create(params);
IO.println(response);
```
```php PHP
$client = new Client();
$response = $client->beta->messages->create(
maxTokens: 16000,
messages: [
['role' => 'user', 'content' => 'Hello']
],
model: 'claude-opus-5',
betas: ['context-management-2025-06-27'],
contextManagement: [
'edits' => [
[
'type' => 'clear\_thinking\_20251015',
'keep' => 'all'
]
]
],
);
echo $response;
```
```ruby Ruby
client = Anthropic::Client.new
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 16000,
messages: [{ role: "user", content: "Hello" }],
betas: ["context-management-2025-06-27"],
context\_management: {
edits: [
{
type: "clear\_thinking\_20251015",
keep: "all"
}
]
}
)
puts response
```
### Combining strategies
You can use both thinking block clearing and tool result clearing together:
When using multiple strategies, the `clear\_thinking\_20251015` strategy must be listed first in the `edits` array.

```bash cURL
curl https://api.anthropic.com/v1/messages \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "content-type: application/json" \
--header "anthropic-beta: context-management-2025-06-27" \
--data '{
"model": "claude-opus-5",
"max\_tokens": 16000,
"messages": [
{
"role": "user",
"content": "Search for the latest developments in quantum error correction and summarize the key breakthroughs."
}
],
"tools": [
{
"type": "web\_search\_20250305",
"name": "web\_search",
"max\_uses": 5
}
],
"context\_management": {
"edits": [
{
"type": "clear\_thinking\_20251015",
"keep": {
"type": "thinking\_turns",
"value": 2
}
},
{
"type": "clear\_tool\_uses\_20250919",
"trigger": {
"type": "input\_tokens",
"value": 50000
},
"keep": {
"type": "tool\_uses",
"value": 5
}
}
]
}
}'
```
```bash CLI
ant beta:messages create --beta context-management-2025-06-27 <<'YAML'
model: claude-opus-5
max\_tokens: 16000
messages:
- role: user
content: Search for the latest developments in quantum error correction and summarize the key breakthroughs.
tools:
- type: web\_search\_20250305
name: web\_search
max\_uses: 5
context\_management:
edits:
- type: clear\_thinking\_20251015
keep:
type: thinking\_turns
value: 2
- type: clear\_tool\_uses\_20250919
trigger:
type: input\_tokens
value: 50000
keep:
type: tool\_uses
value: 5
YAML
```
```python Python
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=16000,
messages=[
{
"role": "user",
"content": "Search for the latest developments in quantum error correction and summarize the key breakthroughs.",
}
],
tools=[
{
"type": "web\_search\_20250305",
"name": "web\_search",
"max\_uses": 5,
}
],
betas=["context-management-2025-06-27"],
context\_management={
"edits": [
{
"type": "clear\_thinking\_20251015",
"keep": {"type": "thinking\_turns", "value": 2},
},
{
"type": "clear\_tool\_uses\_20250919",
"trigger": {"type": "input\_tokens", "value": 50000},
"keep": {"type": "tool\_uses", "value": 5},
},
]
},
)
print(response)
```
```typescript TypeScript
const anthropic = new Anthropic({
apiKey: process.env.ANTHROPIC\_API\_KEY
});
const response = await anthropic.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 16000,
messages: [
{
role: "user",
content:
"Search for the latest developments in quantum error correction and summarize the key breakthroughs."
}
],
tools: [
{
type: "web\_search\_20250305",
name: "web\_search",
max\_uses: 5
}
],
betas: ["context-management-2025-06-27"],
context\_management: {
edits: [
{
type: "clear\_thinking\_20251015",
keep: {
type: "thinking\_turns",
value: 2
}
},
{
type: "clear\_tool\_uses\_20250919",
trigger: {
type: "input\_tokens",
value: 50000
},
keep: {
type: "tool\_uses",
value: 5
}
}
]
}
});
console.log(response);
```
```csharp C#
using Anthropic;
using Anthropic.Models.Beta;
using Anthropic.Models.Beta.Messages;
using Messages = Anthropic.Models.Messages;
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Messages::Model.ClaudeOpus5,
MaxTokens = 16000,
Messages = [
new() { Role = Role.User, Content = "Search for the latest developments in quantum error correction and summarize the key breakthroughs." }
],
Tools = [
new BetaWebSearchTool20250305 { MaxUses = 5 }
],
Betas = [AnthropicBeta.ContextManagement2025\_06\_27],
ContextManagement = new BetaContextManagementConfig
{
Edits = [
new BetaClearThinking20251015Edit
{
Keep = new BetaThinkingTurns(2)
},
new BetaClearToolUses20250919Edit
{
Trigger = new BetaInputTokensTrigger(50000),
Keep = new BetaToolUsesKeep(5)
}
]
}
};
var response = await client.Beta.Messages.Create(parameters);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 16000,
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Search for the latest developments in quantum error correction and summarize the key breakthroughs.")),
},
Tools: []anthropic.BetaToolUnionParam{
{OfWebSearchTool20250305: &anthropic.BetaWebSearchTool20250305Param{
MaxUses: anthropic.Int(5),
}},
},
Betas: []anthropic.AnthropicBeta{
anthropic.AnthropicBetaContextManagement2025\_06\_27,
},
ContextManagement: anthropic.BetaContextManagementConfigParam{
Edits: []anthropic.BetaContextManagementConfigEditUnionParam{
{OfClearThinking20251015: &anthropic.BetaClearThinking20251015EditParam{
Keep: anthropic.BetaClearThinking20251015EditKeepUnionParam{
OfThinkingTurns: &anthropic.BetaThinkingTurnsParam{
Value: 2,
},
},
}},
{OfClearToolUses20250919: &anthropic.BetaClearToolUses20250919EditParam{
Trigger: anthropic.BetaClearToolUses20250919EditTriggerUnionParam{
OfInputTokens: &anthropic.BetaInputTokensTriggerParam{
Value: 50000,
},
},
Keep: anthropic.BetaToolUsesKeepParam{
Value: 5,
},
}},
},
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
import com.anthropic.models.beta.messages.BetaWebSearchTool20250305;
import com.anthropic.models.beta.messages.BetaContextManagementConfig;
import com.anthropic.models.beta.messages.BetaClearThinking20251015Edit;
import com.anthropic.models.beta.messages.BetaClearToolUses20250919Edit;
import com.anthropic.models.beta.messages.BetaThinkingTurns;
import com.anthropic.models.beta.messages.BetaInputTokensTrigger;
import com.anthropic.models.beta.messages.BetaToolUsesKeep;
import com.anthropic.models.beta.AnthropicBeta;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(16000L)
.addUserMessage("Search for the latest developments in quantum error correction and summarize the key breakthroughs.")
.addTool(BetaWebSearchTool20250305.builder()
.maxUses(5L)
.build())
.addBeta(AnthropicBeta.CONTEXT\_MANAGEMENT\_2025\_06\_27)
.contextManagement(BetaContextManagementConfig.builder()
.addEdit(BetaClearThinking20251015Edit.builder()
.keep(BetaThinkingTurns.builder()
.value(2L)
.build())
.build())
.addEdit(BetaClearToolUses20250919Edit.builder()
.trigger(BetaInputTokensTrigger.builder()
.value(50000L)
.build())
.keep(BetaToolUsesKeep.builder()
.value(5L)
.build())
.build())
.build())
.build();
BetaMessage response = client.beta().messages().create(params);
IO.println(response);
}
```
```php PHP
$client = new Client();
$response = $client->beta->messages->create(
maxTokens: 16000,
messages: [
[
'role' => 'user',
'content' => 'Search for the latest developments in quantum error correction and summarize the key breakthroughs.'
]
],
model: 'claude-opus-5',
betas: ['context-management-2025-06-27'],
tools: [
[
'type' => 'web\_search\_20250305',
'name' => 'web\_search',
'max\_uses' => 5
]
],
contextManagement: [
'edits' => [
[
'type' => 'clear\_thinking\_20251015',
'keep' => [
'type' => 'thinking\_turns',
'value' => 2
]
],
[
'type' => 'clear\_tool\_uses\_20250919',
'trigger' => [
'type' => 'input\_tokens',
'value' => 50000
],
'keep' => [
'type' => 'tool\_uses',
'value' => 5
]
]
]
],
);
echo $response;
```
```ruby Ruby
client = Anthropic::Client.new
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 16000,
messages: [
{
role: "user",
content: "Search for the latest developments in quantum error correction and summarize the key breakthroughs."
}
],
tools: [
{
type: "web\_search\_20250305",
name: "web\_search",
max\_uses: 5
}
],
betas: ["context-management-2025-06-27"],
context\_management: {
edits: [
{
type: "clear\_thinking\_20251015",
keep: {
type: "thinking\_turns",
value: 2
}
},
{
type: "clear\_tool\_uses\_20250919",
trigger: {
type: "input\_tokens",
value: 50000
},
keep: {
type: "tool\_uses",
value: 5
}
}
]
}
)
puts response
```
## Configuration options for tool result clearing
| Configuration option | Default | Description |
| -------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger` | 100,000 input tokens | Defines when the context editing strategy activates. Once the prompt exceeds this threshold, clearing will begin. You can specify this value in either `input\_tokens` or `tool\_uses`. |
| `keep` | 3 tool uses | Defines how many recent tool use/result pairs to keep after clearing occurs. The API removes the oldest tool interactions first, preserving the most recent ones. |
| `clear\_at\_least` | None | Ensures a minimum number of tokens is cleared each time the strategy activates. If the API can't clear at least the specified amount, the strategy will not be applied. This helps determine if context clearing is worth breaking your prompt cache. |
| `exclude\_tools` | None | List of tool names whose tool uses and results should never be cleared. Useful for preserving important context. |
| `clear\_tool\_inputs` | `false` | Controls whether the tool call parameters are cleared along with the tool results. By default, only the tool results are cleared while keeping Claude's original tool calls visible. |
## Context editing response
You can see which context edits were applied to your request using the `context\_management` response field, along with helpful statistics about the content and input tokens cleared.
```json Output
{
"id": "msg\_013Zva2CMHLNnXjNJJKqJ2EF",
"type": "message",
"role": "assistant",
"content": [
// ...
],
"usage": {
// ...
},
"context\_management": {
"applied\_edits": [
// When using `clear\_thinking\_20251015`
{
"type": "clear\_thinking\_20251015",
"cleared\_thinking\_turns": 3,
"cleared\_input\_tokens": 15000
},
// When using `clear\_tool\_uses\_20250919`
{
"type": "clear\_tool\_uses\_20250919",
"cleared\_tool\_uses": 8,
"cleared\_input\_tokens": 50000
}
]
}
}
```
For streaming responses, the context edits are included in the final `message\_delta` event:
```json Streaming Response
{
"type": "message\_delta",
"delta": {
"stop\_reason": "end\_turn",
"stop\_sequence": null
},
"usage": {
"output\_tokens": 1024
},
"context\_management": {
"applied\_edits": [
// ...
]
}
}
```
## Token counting
The [token counting](/docs/en/build-with-claude/token-counting) endpoint supports context management, allowing you to preview how many tokens your prompt will use after context editing is applied.
```bash cURL
curl https://api.anthropic.com/v1/messages/count\_tokens \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "content-type: application/json" \
--header "anthropic-beta: context-management-2025-06-27" \
--data '{
"model": "claude-opus-5",
"messages": [
{
"role": "user",
"content": "Continue our conversation..."
}
],
"context\_management": {
"edits": [
{
"type": "clear\_tool\_uses\_20250919",
"trigger": {
"type": "input\_tokens",
"value": 30000
},
"keep": {
"type": "tool\_uses",
"value": 5
}
}
]
}
}'
```
```bash CLI
cat > request.yaml <<'YAML'
model: claude-opus-5
messages:
- role: user
content: Continue our conversation...
context\_management:
edits:
- type: clear\_tool\_uses\_20250919
trigger:
type: input\_tokens
value: 30000
keep:
type: tool\_uses
value: 5
YAML
ORIGINAL=$(ant beta:messages count-tokens \
--beta context-management-2025-06-27 \
--transform context\_management.original\_input\_tokens \
--raw-output < request.yaml)
INPUT\_TOKENS=$(ant beta:messages count-tokens \
--beta context-management-2025-06-27 \
--transform input\_tokens --raw-output < request.yaml)
printf 'Original tokens: %s\n' "$ORIGINAL"
printf 'After clearing: %s\n' "$INPUT\_TOKENS"
printf 'Savings: %s tokens\n' "$((ORIGINAL - INPUT\_TOKENS))"
```
```python Python
response = client.beta.messages.count\_tokens(
model="claude-opus-5",
messages=[{"role": "user", "content": "Continue our conversation..."}],
betas=["context-management-2025-06-27"],
context\_management={
"edits": [
{
"type": "clear\_tool\_uses\_20250919",
"trigger": {"type": "input\_tokens", "value": 30000},
"keep": {"type": "tool\_uses", "value": 5},
}
]
},
)
print(f"Original tokens: {response.context\_management.original\_input\_tokens}")
print(f"After clearing: {response.input\_tokens}")
print(
f"Savings: {response.context\_management.original\_input\_tokens - response.input\_tokens} tokens"
)
```
```typescript TypeScript
const anthropic = new Anthropic({
apiKey: process.env.ANTHROPIC\_API\_KEY
});
const response = await anthropic.beta.messages.countTokens({
model: "claude-opus-5",
messages: [
{
role: "user",
content: "Continue our conversation..."
}
],
betas: ["context-management-2025-06-27"],
context\_management: {
edits: [
{
type: "clear\_tool\_uses\_20250919",
trigger: {
type: "input\_tokens",
value: 30000
},
keep: {
type: "tool\_uses",
value: 5
}
}
]
}
});
console.log(`Original tokens: ${response.context\_management?.original\_input\_tokens}`);
console.log(`After clearing: ${response.input\_tokens}`);
console.log(
`Savings: ${
(response.context\_management?.original\_input\_tokens || 0) - response.input\_tokens
} tokens`
);
```
```csharp C#
using Anthropic;
using Anthropic.Models.Beta;
using Anthropic.Models.Beta.Messages;
using Messages = Anthropic.Models.Messages;
AnthropicClient client = new();
var parameters = new MessageCountTokensParams
{
Model = Messages::Model.ClaudeOpus5,
Messages = [new() { Role = Role.User, Content = "Continue our conversation..." }],
Betas = [AnthropicBeta.ContextManagement2025\_06\_27],
ContextManagement = new BetaContextManagementConfig
{
Edits = [
new BetaClearToolUses20250919Edit
{
Trigger = new BetaInputTokensTrigger(30000),
Keep = new BetaToolUsesKeep(5)
}
]
}
};
var response = await client.Beta.Messages.CountTokens(parameters);
Console.WriteLine($"Original tokens: {response.ContextManagement?.OriginalInputTokens}");
Console.WriteLine($"After clearing: {response.InputTokens}");
Console.WriteLine($"Savings: {(response.ContextManagement?.OriginalInputTokens ?? 0) - response.InputTokens} tokens");
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.CountTokens(context.TODO(), anthropic.BetaMessageCountTokensParams{
Model: anthropic.ModelClaudeOpus5,
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Continue our conversation...")),
},
Betas: []anthropic.AnthropicBeta{
anthropic.AnthropicBetaContextManagement2025\_06\_27,
},
ContextManagement: anthropic.BetaContextManagementConfigParam{
Edits: []anthropic.BetaContextManagementConfigEditUnionParam{
{OfClearToolUses20250919: &anthropic.BetaClearToolUses20250919EditParam{
Trigger: anthropic.BetaClearToolUses20250919EditTriggerUnionParam{
OfInputTokens: &anthropic.BetaInputTokensTriggerParam{
Value: 30000,
},
},
Keep: anthropic.BetaToolUsesKeepParam{
Value: 5,
},
}},
},
},
})
if err != nil {
log.Fatal(err)
}
fmt.Printf("Original tokens: %d\n", response.ContextManagement.OriginalInputTokens)
fmt.Printf("After clearing: %d\n", response.InputTokens)
fmt.Printf("Savings: %d tokens\n", response.ContextManagement.OriginalInputTokens-response.InputTokens)
```
```java Java
import com.anthropic.models.beta.messages.BetaMessageTokensCount;
import com.anthropic.models.beta.messages.MessageCountTokensParams;
import com.anthropic.models.beta.messages.BetaContextManagementConfig;
import com.anthropic.models.beta.messages.BetaClearToolUses20250919Edit;
import com.anthropic.models.beta.messages.BetaInputTokensTrigger;
import com.anthropic.models.beta.messages.BetaToolUsesKeep;
import com.anthropic.models.beta.AnthropicBeta;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCountTokensParams params = MessageCountTokensParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.addUserMessage("Continue our conversation...")
.addBeta(AnthropicBeta.CONTEXT\_MANAGEMENT\_2025\_06\_27)
.contextManagement(BetaContextManagementConfig.builder()
.addEdit(BetaClearToolUses20250919Edit.builder()
.trigger(BetaInputTokensTrigger.builder()
.value(30000L)
.build())
.keep(BetaToolUsesKeep.builder()
.value(5L)
.build())
.build())
.build())
.build();
BetaMessageTokensCount response = client.beta().messages().countTokens(params);
IO.println("Original tokens: " + response.contextManagement().get().originalInputTokens());
IO.println("After clearing: " + response.inputTokens());
IO.println("Savings: " + (response.contextManagement().get().originalInputTokens() - response.inputTokens()) + " tokens");
}
```
```php PHP
$client = new Client();
$response = $client->beta->messages->countTokens(
messages: [
['role' => 'user', 'content' => 'Continue our conversation...']
],
model: 'claude-opus-5',
betas: ['context-management-2025-06-27'],
contextManagement: [
'edits' => [
[
'type' => 'clear\_tool\_uses\_20250919',
'trigger' => [
'type' => 'input\_tokens',
'value' => 30000
],
'keep' => [
'type' => 'tool\_uses',
'value' => 5
]
]
]
],
);
echo "Original tokens: " . $response->contextManagement->originalInputTokens . "\n";
echo "After clearing: " . $response->inputTokens . "\n";
echo "Savings: " . ($response->contextManagement->originalInputTokens - $response->inputTokens) . " tokens\n";
```
```ruby Ruby
client = Anthropic::Client.new
response = client.beta.messages.count\_tokens(
model: "claude-opus-5",
messages: [
{ role: "user", content: "Continue our conversation..." }
],
betas: ["context-management-2025-06-27"],
context\_management: {
edits: [
{
type: "clear\_tool\_uses\_20250919",
trigger: {
type: "input\_tokens",
value: 30000
},
keep: {
type: "tool\_uses",
value: 5
}
}
]
}
)
puts "Original tokens: #{response.context\_management.original\_input\_tokens}"
puts "After clearing: #{response.input\_tokens}"
puts "Savings: #{response.context\_management.original\_input\_tokens - response.input\_tokens} tokens"
```
```json Output
{
"input\_tokens": 25000,
"context\_management": {
"original\_input\_tokens": 70000
}
}
```
The response shows both the final token count after context management is applied (`input\_tokens`) and the original token count before any clearing occurred (`original\_input\_tokens`).
## Using with the memory tool
Context editing can be combined with the [memory tool](/docs/en/agents-and-tools/tool-use/memory-tool). When your conversation context approaches the configured clearing threshold, Claude receives an automatic warning to preserve important information. This enables Claude to save tool results or context to its memory files before they're cleared from the conversation history.
This combination allows you to:
\* \*\*Preserve important context:\*\* Claude can write essential information from tool results to memory files before those results are cleared
\* \*\*Maintain long-running workflows:\*\* Enable agentic workflows that would otherwise exceed context limits by offloading information to persistent storage
\* \*\*Access information on demand:\*\* Claude can look up previously cleared information from memory files when needed, rather than keeping everything in the active context window
For example, in a file editing workflow where Claude performs many operations, Claude can summarize completed changes to memory files as the context grows. When tool results are cleared, Claude retains access to that information through its memory system and can continue working effectively.
To use both features together, enable them in your API request:
```bash cURL
curl https://api.anthropic.com/v1/messages \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "content-type: application/json" \
--header "anthropic-beta: context-management-2025-06-27" \
--data '{
"model": "claude-opus-5",
"max\_tokens": 4096,
"messages": [
{
"role": "user",
"content": "Hello"
}
],
"tools": [
{
"type": "memory\_20250818",
"name": "memory"
}
],
"context\_management": {
"edits": [
{"type": "clear\_tool\_uses\_20250919"}
]
}
}'
```
```bash CLI
ant beta:messages create --beta context-management-2025-06-27 <<'YAML'
model: claude-opus-5
max\_tokens: 4096
messages:
- role: user
content: Hello
tools:
- type: memory\_20250818
name: memory
context\_management:
edits:
- type: clear\_tool\_uses\_20250919
YAML
```
```python Python
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=4096,
messages=[{"role": "user", "content": "Hello"}],
tools=[{"type": "memory\_20250818", "name": "memory"}],
betas=["context-management-2025-06-27"],
context\_management={"edits": [{"type": "clear\_tool\_uses\_20250919"}]},
)
```
```typescript TypeScript
const anthropic = new Anthropic({
apiKey: process.env.ANTHROPIC\_API\_KEY
});
const response = await anthropic.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 4096,
messages: [{ role: "user", content: "Hello" }],
tools: [
{
type: "memory\_20250818",
name: "memory"
}
],
betas: ["context-management-2025-06-27"],
context\_management: {
edits: [{ type: "clear\_tool\_uses\_20250919" }]
}
});
```
```csharp C#
using Anthropic;
using Anthropic.Models.Beta;
using Anthropic.Models.Beta.Messages;
using Messages = Anthropic.Models.Messages;
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Messages::Model.ClaudeOpus5,
MaxTokens = 4096,
Messages = [
new() { Role = Role.User, Content = "Hello" }
],
Tools = [
new BetaMemoryTool20250818()
],
Betas = [AnthropicBeta.ContextManagement2025\_06\_27],
ContextManagement = new BetaContextManagementConfig
{
Edits = [new BetaClearToolUses20250919Edit()]
}
};
var response = await client.Beta.Messages.Create(parameters);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 4096,
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Hello")),
},
Tools: []anthropic.BetaToolUnionParam{
{OfMemoryTool20250818: &anthropic.BetaMemoryTool20250818Param{}},
},
Betas: []anthropic.AnthropicBeta{anthropic.AnthropicBetaContextManagement2025\_06\_27},
ContextManagement: anthropic.BetaContextManagementConfigParam{
Edits: []anthropic.BetaContextManagementConfigEditUnionParam{
{OfClearToolUses20250919: &anthropic.BetaClearToolUses20250919EditParam{}},
},
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
import com.anthropic.models.beta.messages.BetaMemoryTool20250818;
import com.anthropic.models.beta.messages.BetaContextManagementConfig;
import com.anthropic.models.beta.messages.BetaClearToolUses20250919Edit;
import com.anthropic.models.beta.AnthropicBeta;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addUserMessage("Hello")
.addTool(BetaMemoryTool20250818.builder().build())
.addBeta(AnthropicBeta.CONTEXT\_MANAGEMENT\_2025\_06\_27)
.contextManagement(BetaContextManagementConfig.builder()
.addEdit(BetaClearToolUses20250919Edit.builder().build())
.build())
.build();
BetaMessage response = client.beta().messages().create(params);
IO.println(response);
}
```
```php PHP
$client = new Client();
$response = $client->beta->messages->create(
maxTokens: 4096,
messages: [
['role' => 'user', 'content' => 'Hello']
],
model: 'claude-opus-5',
betas: ['context-management-2025-06-27'],
tools: [
[
'type' => 'memory\_20250818',
'name' => 'memory'
]
],
contextManagement: [
'edits' => [
['type' => 'clear\_tool\_uses\_20250919']
]
],
);
echo $response;
```
```ruby Ruby
client = Anthropic::Client.new
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
messages: [{ role: "user", content: "Hello" }],
tools: [
{
type: "memory\_20250818",
name: "memory"
}
],
betas: ["context-management-2025-06-27"],
context\_management: {
edits: [
{ type: "clear\_tool\_uses\_20250919" }
]
}
)
puts response
```
For the full memory tool reference including commands and examples, see [Memory tool](/docs/en/agents-and-tools/tool-use/memory-tool).
## Client-side compaction (SDK)
\*\*Anthropic recommends server-side compaction over SDK compaction.\*\* [Server-side compaction](/docs/en/build-with-claude/compaction) handles context management automatically with less integration complexity, better token usage calculation, and no client-side limitations. Use SDK compaction only if you specifically need client-side control over the summarization process.
The `compaction\_control` parameter is deprecated in the Python, TypeScript, and Ruby SDKs and will be removed in a future version. The SDKs emit a deprecation warning when it is enabled. To use server-side compaction with a tool runner, pass the `compact\_20260112` edit in the request's `context\_management` parameter.

Compaction is available in the [Python, TypeScript, and Ruby SDKs](/docs/en/cli-sdks-libraries/overview) when using the [`tool\_runner` method](/docs/en/agents-and-tools/tool-use/tool-runner).
Compaction is an SDK feature that automatically manages conversation context by generating summaries when token usage grows too large. Unlike server-side context editing strategies that clear content, compaction instructs Claude to summarize the conversation history, then replaces the full history with that summary. This allows Claude to continue working on long-running tasks that would otherwise exceed the [context window](/docs/en/build-with-claude/context-windows).
### How compaction works
When compaction is enabled, the SDK monitors token usage after each model response:
1. \*\*Threshold check:\*\* The SDK calculates total tokens as `input\_tokens + cache\_creation\_input\_tokens + cache\_read\_input\_tokens + output\_tokens`.
2. \*\*Summary generation:\*\* When the threshold is exceeded, a summary prompt is injected as a user turn, and Claude generates a structured summary wrapped in `` tags.
3. \*\*Context replacement:\*\* The SDK extracts the summary and replaces the entire message history with it.
4. \*\*Continuation:\*\* The conversation resumes from the summary, with Claude picking up where it left off.
### Using compaction
Add `compaction\_control` to your `tool\_runner` call to enable automatic summarization when token usage exceeds the threshold.

Compaction runs client-side in the SDK `tool\_runner` helpers, so it has no direct HTTP equivalent. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead, which handles compaction on Anthropic's servers.

The CLI does not include a `tool\_runner` helper. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead, which handles compaction on Anthropic's servers without SDK-side integration.

```python Python
client = anthropic.Anthropic()
runner = client.beta.messages.tool\_runner(
model="claude-opus-5",
max\_tokens=1024,
tools=[read\_file],
messages=[{"role": "user", "content": "What's in config.json?"}],
compaction\_control={"enabled": True, "context\_token\_threshold": 100000},
)
for message in runner:
print(f"Tokens used: {message.usage.input\_tokens}")
```

```typescript TypeScript
const client = new Anthropic();
const runner = client.beta.messages.toolRunner({
model: "claude-opus-5",
max\_tokens: 1024,
tools: [readFile],
messages: [{ role: "user", content: "What's in config.json?" }],
compactionControl: { enabled: true, contextTokenThreshold: 100000 }
});
for await (const message of runner) {
console.log(`Tokens used: ${message.usage.input\_tokens}`);
}
```

The C# SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

The Go SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

The Java SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

The PHP SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

```ruby Ruby
client = Anthropic::Client.new
runner = client.beta.messages.tool\_runner(
model: "claude-opus-5",
max\_tokens: 1024,
tools: [ReadFile.new],
messages: [{ role: "user", content: "What's in config.json?" }],
compaction\_control: { enabled: true, context\_token\_threshold: 100000 }
)
runner.each\_message do |message|
puts "Tokens used: #{message.usage.input\_tokens}"
end
```
#### What occurs during compaction
As the conversation grows, the message history accumulates:
\*\*Before compaction (approaching 100k tokens):\*\*
```json
[
{ "role": "user", "content": "Analyze all files and write a report..." },
{ "role": "assistant", "content": "I'll help. Let me start by reading..." },
{
"role": "user",
"content": [{ "type": "tool\_result", "tool\_use\_id": "...", "content": "..." }]
},
{ "role": "assistant", "content": "Based on file1.txt, I see..." },
{
"role": "user",
"content": [{ "type": "tool\_result", "tool\_use\_id": "...", "content": "..." }]
},
{ "role": "assistant", "content": "After analyzing file2.txt..." }
// ... 50 more exchanges like this ...
]
```
When tokens exceed the threshold, the SDK injects a summary request and Claude generates a summary. The entire history is then replaced:
\*\*After compaction (back to \~2–3k tokens):\*\*
```json
[
{
"role": "assistant",
"content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
}
]
```
Claude continues working from this summary as if it were the original conversation history.
### Configuration options
| Parameter | Type | Required | Default | Description |
| ------------------------- | ------- | -------- | ----------------------------------------------------- | ---------------------------------------- |
| `enabled` | boolean | Yes | - | Whether to enable automatic compaction |
| `context\_token\_threshold` | number | No | 100,000 | Token count at which compaction triggers |
| `model` | string | No | Same as main model | Model to use for generating summaries |
| `summary\_prompt` | string | No | See [Default summary prompt](#default-summary-prompt) | Custom prompt for summary generation |
#### Choosing a token threshold
The threshold determines when compaction occurs. A lower threshold means more frequent compactions with smaller context windows. A higher threshold allows more context but risks hitting limits.

Compaction runs client-side in the SDK `tool\_runner` helpers, so it has no direct HTTP equivalent. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead, which handles compaction on Anthropic's servers.

The CLI does not include a `tool\_runner` helper. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead, which handles compaction on Anthropic's servers without SDK-side integration.

```python Python
client = anthropic.Anthropic()
runner = client.beta.messages.tool\_runner(
model="claude-opus-5",
max\_tokens=1024,
tools=[read\_file],
messages=[{"role": "user", "content": "What's in config.json?"}],
# Lower values compact more often; raise to 150000 when the task needs more context
compaction\_control={"enabled": True, "context\_token\_threshold": 50000},
)
for message in runner:
print(f"Tokens used: {message.usage.input\_tokens}")
```

```typescript TypeScript
const client = new Anthropic();
const runner = client.beta.messages.toolRunner({
model: "claude-opus-5",
max\_tokens: 1024,
tools: [readFile],
messages: [{ role: "user", content: "What's in config.json?" }],
// Lower values compact more often; raise to 150000 when the task needs more context
compactionControl: { enabled: true, contextTokenThreshold: 50000 }
});
for await (const message of runner) {
console.log(`Tokens used: ${message.usage.input\_tokens}`);
}
```

The C# SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

The Go SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

The Java SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

The PHP SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

```ruby Ruby
client = Anthropic::Client.new
runner = client.beta.messages.tool\_runner(
model: "claude-opus-5",
max\_tokens: 1024,
tools: [ReadFile.new],
messages: [{ role: "user", content: "What's in config.json?" }],
# Lower values compact more often; raise to 150000 when the task needs more context
compaction\_control: { enabled: true, context\_token\_threshold: 50000 }
)
runner.each\_message do |message|
puts "Tokens used: #{message.usage.input\_tokens}"
end
```
#### Using a different model for summaries
You can use a faster or cheaper model for generating summaries:

Compaction runs client-side in the SDK `tool\_runner` helpers, so it has no direct HTTP equivalent. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead, which handles compaction on Anthropic's servers.

The CLI does not include a `tool\_runner` helper. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead, which handles compaction on Anthropic's servers without SDK-side integration.

```python Python
client = anthropic.Anthropic()
runner = client.beta.messages.tool\_runner(
model="claude-opus-5",
max\_tokens=1024,
tools=[read\_file],
messages=[{"role": "user", "content": "What's in config.json?"}],
compaction\_control={
"enabled": True,
"context\_token\_threshold": 100000,
"model": "claude-haiku-4-5",
},
)
for message in runner:
print(f"Tokens used: {message.usage.input\_tokens}")
```

```typescript TypeScript
const client = new Anthropic();
const runner = client.beta.messages.toolRunner({
model: "claude-opus-5",
max\_tokens: 1024,
tools: [readFile],
messages: [{ role: "user", content: "What's in config.json?" }],
compactionControl: {
enabled: true,
contextTokenThreshold: 100000,
model: "claude-haiku-4-5"
}
});
for await (const message of runner) {
console.log(`Tokens used: ${message.usage.input\_tokens}`);
}
```

The C# SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

The Go SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

The Java SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

The PHP SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

```ruby Ruby
client = Anthropic::Client.new
runner = client.beta.messages.tool\_runner(
model: "claude-opus-5",
max\_tokens: 1024,
tools: [ReadFile.new],
messages: [{ role: "user", content: "What's in config.json?" }],
compaction\_control: {
enabled: true,
context\_token\_threshold: 100000,
model: "claude-haiku-4-5"
}
)
runner.each\_message do |message|
puts "Tokens used: #{message.usage.input\_tokens}"
end
```
#### Custom summary prompts
You can provide a custom prompt for domain-specific needs. Your prompt should instruct Claude to wrap its summary in `` tags.

Compaction runs client-side in the SDK `tool\_runner` helpers, so it has no direct HTTP equivalent. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead, which handles compaction on Anthropic's servers.

The CLI does not include a `tool\_runner` helper. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead, which handles compaction on Anthropic's servers without SDK-side integration.

```python Python
client = anthropic.Anthropic()
runner = client.beta.messages.tool\_runner(
model="claude-opus-5",
max\_tokens=1024,
tools=[read\_file],
messages=[{"role": "user", "content": "What's in config.json?"}],
compaction\_control={
"enabled": True,
"context\_token\_threshold": 100000,
"summary\_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps
Wrap your summary in  tags.""",
},
)
for message in runner:
print(f"Tokens used: {message.usage.input\_tokens}")
```

```typescript TypeScript
const client = new Anthropic();
const runner = client.beta.messages.toolRunner({
model: "claude-opus-5",
max\_tokens: 1024,
tools: [readFile],
messages: [{ role: "user", content: "What's in config.json?" }],
compactionControl: {
enabled: true,
contextTokenThreshold: 100000,
summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps
Wrap your summary in  tags.`
}
});
for await (const message of runner) {
console.log(`Tokens used: ${message.usage.input\_tokens}`);
}
```

The C# SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

The Go SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

The Java SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

The PHP SDK includes a tool runner, but it does not support client-side `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead: it works with the tool runner by passing the `compact\_20260112` edit in the request's `context\_management` parameter.

```ruby Ruby
client = Anthropic::Client.new
runner = client.beta.messages.tool\_runner(
model: "claude-opus-5",
max\_tokens: 1024,
tools: [ReadFile.new],
messages: [{ role: "user", content: "What's in config.json?" }],
compaction\_control: {
enabled: true,
context\_token\_threshold: 100000,
summary\_prompt: <<~PROMPT
Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps
Wrap your summary in  tags.
PROMPT
}
)
runner.each\_message do |message|
puts "Tokens used: #{message.usage.input\_tokens}"
end
```
### Default summary prompt
The built-in summary prompt instructs Claude to create a structured continuation summary including:
1. \*\*Task Overview:\*\* The user's core request, success criteria, and constraints.
2. \*\*Current State:\*\* What has been completed, files modified, and artifacts produced.
3. \*\*Important Discoveries:\*\* Technical constraints, decisions made, errors resolved, and failed approaches.
4. \*\*Next Steps:\*\* Specific actions needed, blockers, and priority order.
5. \*\*Context to Preserve:\*\* User preferences, domain-specific details, and commitments made.
This structure enables Claude to resume work efficiently without losing important context or repeating mistakes.
```text wrap
You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:
1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified
2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced
3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)
4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain
5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user
Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.
Wrap your summary in  tags.
```
### Limitations
#### Server-side tools
Compaction requires special consideration when using server-side tools such as [web search](/docs/en/agents-and-tools/tool-use/web-search-tool) or [web fetch](/docs/en/agents-and-tools/tool-use/web-fetch-tool).
When using server-side tools, the SDK may incorrectly calculate token usage, causing compaction to trigger at the wrong time.
For example, after a web search operation, the API response might show:
```json Output
{
"usage": {
"input\_tokens": 63000,
"cache\_creation\_input\_tokens": 0,
"cache\_read\_input\_tokens": 270000,
"output\_tokens": 1400
}
}
```
The SDK calculates total usage as 63,000 + 0 + 270,000 + 1,400 = 334,400 tokens. However, the `cache\_read\_input\_tokens` value includes accumulated reads from multiple internal API calls made by the server-side tool, not your actual conversation context. Your real context length might only be the 63,000 `input\_tokens`, but the SDK sees 334k and triggers compaction prematurely.
\*\*Workarounds:\*\*
\* Use the [token counting](/docs/en/build-with-claude/token-counting) endpoint to get accurate context length
\* Avoid compaction when using server-side tools extensively
#### Tool use edge cases
When the SDK triggers compaction while a tool use response is pending, it removes the tool use block from the message history before generating the summary. Claude will re-issue the tool call after resuming from the summary if still needed.
### Monitoring compaction
Understanding when compaction triggers helps you tune thresholds and verify expected behavior.

Compaction runs client-side in the SDK `tool\_runner` helpers, so it has no direct HTTP equivalent. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead, which handles compaction on Anthropic's servers.

The CLI does not include a `tool\_runner` helper. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead, which handles compaction on Anthropic's servers without SDK-side integration.

The Python SDK logs compaction events at the INFO level. Enable the `anthropic.lib.tools` logger:
```python Python
import logging
logging.basicConfig(level=logging.INFO)
logging.getLogger("anthropic.lib.tools").setLevel(logging.INFO)
# Logs will show:
# INFO: Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
# INFO: Compaction complete. New token usage: 2500
```

The TypeScript SDK's `toolRunner` supports compaction but does not log events. Detect compaction by watching `runner.params.messages.length` shrink between turns:
```typescript TypeScript
let prevMsgCount = 0;
for await (const message of runner) {
const currMsgCount = runner.params.messages.length;
if (currMsgCount < prevMsgCount) {
console.log(`Compaction occurred: ${prevMsgCount} -> ${currMsgCount} messages`);
console.log(`Input tokens after compaction: ${message.usage.input\_tokens}`);
}
prevMsgCount = currMsgCount;
}
```

The C# SDK's tool runner does not support `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead.

The Go SDK's tool runner does not support `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead.

The Java SDK's tool runner does not support `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead.

The PHP SDK's tool runner does not support `compaction\_control`. Use [server-side compaction](/docs/en/build-with-claude/compaction) instead.

The Ruby SDK supports an `on\_compact:` callback that fires when compaction occurs. Add it to your `compaction\_control` configuration:
```ruby Ruby
client = Anthropic::Client.new
runner = client.beta.messages.tool\_runner(
model: "claude-opus-5",
max\_tokens: 1024,
tools: [ReadFile.new],
messages: [{ role: "user", content: "What's in config.json?" }],
compaction\_control: {
enabled: true,
context\_token\_threshold: 100000,
on\_compact: ->(tokens\_before, tokens\_after) do
puts "Compaction occurred: #{tokens\_before} -> #{tokens\_after} tokens"
end
}
)
runner.each\_message do |message|
puts "Tokens: #{message.usage.input\_tokens}"
end
```
### When to use compaction
\*\*Good use cases:\*\*
\* Long-running agent tasks that process many files or data sources
\* Research workflows that accumulate large amounts of information
\* Multistep tasks with clear, measurable progress
\* Tasks that produce artifacts (files, reports) that persist outside the conversation
\*\*Less ideal use cases:\*\*
\* Tasks requiring precise recall of early conversation details
\* Workflows using server-side tools extensively
\* Tasks that need to maintain exact state across many variables
## Next steps

Manage long conversations with server-side compaction, the recommended strategy for most use cases.

Reduce cost and latency by caching prompt prefixes, and learn how context editing interacts with the cache.
