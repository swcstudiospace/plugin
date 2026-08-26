# Thinking

Source: https://platform.claude.com/docs/en/build-with-claude/thinking.md

# Thinking
Understand how Claude's thinking works: turn it on, read thinking output, steer thinking depth with effort, and use thinking with tools, caching, and streaming.
---
For how zero data retention (ZDR) applies to this feature, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
A model that answers in a single pass has to get everything right on the first try: no scratch work, no checking, no changing course halfway through. For a proof, a tricky bug, or a long agentic task, the first approach is often not the best one.
Thinking removes that constraint. When thinking is active, Claude works through the problem in its own words before answering: it restates what is being asked, tries approaches, checks intermediate results, and abandons paths that do not hold up. That reasoning arrives in `thinking` content blocks ahead of the response, and Claude draws on it to produce the final answer. This is why thinking improves performance on complex tasks like math, coding, analysis, and long-running agentic work, where the quality of the answer depends on intermediate work that would otherwise be compressed into the response itself or skipped.
Thinking has a cost: the tokens Claude spends reasoning are billed as output tokens, even when the thinking text isn't returned to you, and they count toward `max\_tokens` alongside the response text. This page covers how thinking behaves across the API surface: turning it on, reading its output, and managing its interactions with tools, streaming, caching, and the context window.
## How thinking works
![Diagram of how thinking works: Claude evaluates the request and decides whether to think; with tool use, thinking can recur between tool calls; one response returns thinking blocks, then text blocks](/docs/images/how-thinking-works.svg)
Whether Claude thinks on a given request, and how deeply, depends on your thinking configuration and the complexity of the request.
Here is what thinking looks like in a response: one or more `thinking` content blocks arrive before the `text` blocks. The thinking block is still generated content, like the `text` block that follows it, but it is separated from the canonical response. Each thinking block also carries a `signature` field, an encrypted copy of the full reasoning that you pass back unchanged in multi-turn and tool-use conversations (see [Thinking encryption](#thinking-encryption)):
```json
{
"content": [
{
"type": "thinking",
"thinking": "Let me break this down. The question has two parts, so I'll start with the simpler one and use its result to constrain the second...",
"signature": "WaUjzkypQ2mUEVM36O2Txu...."
},
{
"type": "text",
"text": "Based on my analysis..."
}
]
}
```
You don't always see this text, and what you see is never the raw chain of thought: the text in a thinking block is a [summary of Claude's reasoning](#summarized-thinking). The `display` field on the thinking configuration controls whether that summary is returned at all: `"summarized"` returns it, while `"omitted"`, the default on the newest models, returns thinking blocks with an empty `thinking` field. Either way the block is billed the same and passed back the same in multi-turn conversations; see [Controlling thinking display](#controlling-thinking-display) for per-model defaults and details.
If Claude uses tools, thinking can also appear between tool calls; see [Thinking with tool use](#thinking-with-tool-use). For the full response format, see the [Messages API reference](/docs/en/api/messages/create).
## Configuring thinking
On current models, thinking is on by default or one parameter away. Which configuration each model accepts, and what it defaults to, is listed in the [per-model configuration table](/docs/en/build-with-claude/thinking-troubleshooting#supported-models) on the Troubleshooting page.
On Claude Opus 5, Claude Sonnet 5, Claude Fable 5, Claude Mythos 5, and Claude Mythos Preview, thinking is already on: no configuration needed. The first thing most developers need on these models is to see the thinking text, since `display` defaults to `"omitted"` there. Opt in with `thinking: {"type": "adaptive", "display": "summarized"}`, which is exactly the following request with the model string swapped.
On Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, and Claude Sonnet 4.6, thinking is off until you set `thinking: {type: "adaptive"}` in your request. The following examples do that, set `display: "summarized"` so the thinking text is visible, and use a roomy `max\_tokens`:
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-4-8",
"max\_tokens": 16000,
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
ant messages create \
--model claude-opus-4-8 \
--max-tokens 16000 \
--thinking '{type: adaptive, display: summarized}' \
--message '{role: user, content: "What is the greatest common divisor of 1071 and 462?"}' \
--transform content \
--format yaml
```
```python Python
client = anthropic.Anthropic()
response = client.messages.create(
model="claude-opus-4-8",
max\_tokens=16000,
thinking={"type": "adaptive", "display": "summarized"},
messages=[
{
"role": "user",
"content": "What is the greatest common divisor of 1071 and 462?",
}
],
)
for block in response.content:
if block.type == "thinking":
print(f"\nThinking: {block.thinking}")
elif block.type == "text":
print(f"\nResponse: {block.text}")
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.messages.create({
model: "claude-opus-4-8",
max\_tokens: 16000,
thinking: {
type: "adaptive",
display: "summarized"
},
messages: [
{
role: "user",
content: "What is the greatest common divisor of 1071 and 462?"
}
]
});
for (const block of response.content) {
if (block.type === "thinking") {
console.log(`\nThinking: ${block.thinking}`);
} else if (block.type === "text") {
console.log(`\nResponse: ${block.text}`);
}
}
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus4\_8,
MaxTokens = 16000,
Thinking = new ThinkingConfigAdaptive { Display = Display.Summarized },
Messages = [
new() {
Role = Role.User,
Content = "What is the greatest common divisor of 1071 and 462?"
}
]
};
var message = await client.Messages.Create(parameters);
foreach (var block in message.Content)
{
if (block.TryPickThinking(out ThinkingBlock? thinking))
{
Console.WriteLine($"\nThinking: {thinking.Thinking}");
}
else if (block.TryPickText(out TextBlock? text))
{
Console.WriteLine($"\nResponse: {text.Text}");
}
}
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus4\_8,
MaxTokens: 16000,
Thinking: anthropic.ThinkingConfigParamUnion{
OfAdaptive: &anthropic.ThinkingConfigAdaptiveParam{
Display: anthropic.ThinkingConfigAdaptiveDisplaySummarized,
},
},
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("What is the greatest common divisor of 1071 and 462?")),
},
})
if err != nil {
log.Fatal(err)
}
for \_, block := range response.Content {
switch v := block.AsAny().(type) {
case anthropic.ThinkingBlock:
fmt.Printf("\nThinking: %s", v.Thinking)
case anthropic.TextBlock:
fmt.Printf("\nResponse: %s", v.Text)
}
}
```
```java Java
import com.anthropic.models.messages.ThinkingConfigAdaptive;
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_4\_8)
.maxTokens(16000L)
.thinking(ThinkingConfigAdaptive.builder()
.display(ThinkingConfigAdaptive.Display.SUMMARIZED)
.build())
.addUserMessage("What is the greatest common divisor of 1071 and 462?")
.build();
Message response = client.messages().create(params);
response.content().forEach(block -> {
block.thinking().ifPresent(thinkingBlock ->
IO.println("\nThinking: " + thinkingBlock.thinking())
);
block.text().ifPresent(textBlock ->
IO.println("\nResponse: " + textBlock.text())
);
});
}
```
```php PHP
$client = new Client();
$message = $client->messages->create(
maxTokens: 16000,
messages: [
[
'role' => 'user',
'content' => 'What is the greatest common divisor of 1071 and 462?'
]
],
model: 'claude-opus-4-8',
thinking: ['type' => 'adaptive', 'display' => 'summarized'],
);
foreach ($message->content as $block) {
if ($block->type === 'thinking') {
echo "\nThinking: " . $block->thinking;
} elseif ($block->type === 'text') {
echo "\nResponse: " . $block->text;
}
}
```
```ruby Ruby
client = Anthropic::Client.new
message = client.messages.create(
model: "claude-opus-4-8",
max\_tokens: 16000,
thinking: {
type: "adaptive",
display: "summarized"
},
messages: [
{
role: "user",
content: "What is the greatest common divisor of 1071 and 462?"
}
]
)
message.content.each do |block|
case block.type
when :thinking
puts "\nThinking: #{block.thinking}"
when :text
puts "\nResponse: #{block.text}"
end
end
```
Running the example prints the summarized thinking, then the answer:
```text Output wrap
Thinking: Use Euclidean algorithm.
1071 = 2\*462 + 147
462 = 3\*147 + 21
147 = 7\*21 + 0
GCD = 21
Response: ## Finding GCD of 1071 and 462
I'll use the \*\*Euclidean algorithm\*\*, repeatedly dividing and taking remainders...
```
Thinking tokens count toward `max\_tokens`, so set it high enough to leave room for both the thinking and the response text. See [Cost control](/docs/en/build-with-claude/thinking-steering-and-cost#cost-control) on the steering page and [Thinking and the context window](#thinking-and-the-context-window).
### Turning thinking off
On Claude Sonnet 5, where thinking is on by default, you can turn it off:
```python
client = anthropic.Anthropic()
response = client.messages.create(
model="claude-sonnet-5",
max\_tokens=4096,
thinking={"type": "disabled"},
messages=[{"role": "user", "content": "Summarize this article in one sentence."}],
)
```
Claude Opus 5 also has thinking on by default and accepts `thinking: {type: "disabled"}` at [effort](/docs/en/build-with-claude/effort) `high` or below. At `xhigh` or `max` effort, thinking cannot be turned off: requests that combine `thinking: {type: "disabled"}` with those effort levels return a 400 error. This restriction applies to Claude Opus 5 and later models and is enforced on each request. With thinking disabled, Claude Opus 5 can occasionally emit tool calls as plain text or include internal XML tags in its visible output; see [Running with thinking disabled](/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5#running-with-thinking-disabled) for prompting mitigations.
Claude Fable 5, Claude Mythos 5, and Claude Mythos Preview reject `thinking: {type: "disabled"}`: thinking cannot be turned off on these models.
If your model supports only extended thinking (see the [per-model configuration table](/docs/en/build-with-claude/thinking-troubleshooting#supported-models)), configure it with `type: "enabled"` and a `budget\_tokens` value instead; the [Extended thinking](/docs/en/build-with-claude/extended-thinking) page covers that configuration. And if any thinking configuration comes back with a 400 error, [Troubleshooting thinking](/docs/en/build-with-claude/thinking-troubleshooting) matches each error message to its fix.
## Reading thinking output
### Controlling thinking display
The `display` field on the thinking configuration controls how thinking content is returned in API responses. `display` works in both modes: set it alongside `type: "adaptive"` or `type: "enabled"`. It accepts two values:
\* `"summarized"`: thinking blocks contain [summarized thinking](#summarized-thinking) text, a readable summary of Claude's reasoning. This is the default on Claude Opus 4.6, Claude Sonnet 4.6, and earlier models.
\* `"omitted"`: thinking blocks are returned with an empty `thinking` field. The `signature` field still carries the encrypted full thinking for multi-turn continuity (see [Thinking encryption](#thinking-encryption)). This is the default on Claude Fable 5, Claude Mythos 5, Claude Opus 5, Claude Sonnet 5, Claude Opus 4.8, Claude Opus 4.7, and [Claude Mythos Preview](https://anthropic.com/glasswing).
Set `display: "omitted"` when your application doesn't surface thinking content to users. The primary benefit is \*\*faster time-to-first-text-token when streaming\*\*: the server skips streaming thinking tokens entirely and delivers only the signature, so the final text response begins streaming sooner.
With `display: "omitted"`, the response contains `thinking` blocks with an empty `thinking` field:
```json Output
{
"content": [
{
"type": "thinking",
"thinking": "",
"signature": "EosnCkYICxIMMb3LzNrMu..."
},
{
"type": "text",
"text": "The answer is 12,231."
}
]
}
```
Keep the following in mind when working with omitted thinking:
\* You're still charged for the full thinking tokens. Omitting reduces latency, not cost.
\* If you pass thinking blocks back in multi-turn conversations, pass them unchanged. The server decrypts the `signature` to reconstruct the original thinking for prompt construction (see [Preserving thinking blocks](#preserving-thinking-blocks)). Any text you place in the `thinking` field of a round-tripped omitted block is ignored.
\* `display` is invalid with `thinking.type: "disabled"` (there is nothing to display).
\* When using `thinking.type: "adaptive"` and the model skips thinking for a simple request, no thinking block is produced regardless of `display`.
\* When streaming with `display: "omitted"`, no `thinking\_delta` events are emitted; see [Streaming thinking](#streaming-thinking) for the event sequence.
The `signature` field is identical whether `display` is `"summarized"` or `"omitted"`. Switching `display` values between turns in a conversation is supported.
In the Ruby SDK, set this field as `display\_:` (with a trailing underscore) to avoid shadowing Ruby's `Kernel#display`; the wire field is still `display`.
### Summarized thinking
When `display` is `"summarized"`, the thinking text you receive is a summary of Claude's full thinking process rather than the raw chain of thought. Summarized thinking provides the full intelligence benefits of thinking while preventing misuse. No `display` setting returns the raw chain of thought.
Keep the following in mind when working with summarized thinking:
\* You're charged for the full thinking tokens generated by the original request, not the summary tokens. The billed output token count does \*\*not match\*\* the count of tokens you see in the response.
\* On Claude Opus 4.6, Claude Sonnet 4.6, and earlier models, the first few lines of thinking output are more verbose, providing detailed reasoning that's particularly helpful for prompt engineering purposes. [Claude Mythos Preview](https://anthropic.com/glasswing) summarizes from the first token, so its thinking blocks do not show this verbose preamble.
\* Summarization preserves the key ideas of Claude's thinking process with minimal added latency, enabling a streamable user experience.
\* Summarization is processed by a different model than the one you target in your requests. The thinking model does not see the summarized output.
\* As Anthropic seeks to improve the thinking feature, summarization behavior is subject to change.
In rare cases where you need access to full thinking output, [contact Anthropic sales](mailto:sales@anthropic.com).
### Streaming thinking
Thinking works with [streaming](/docs/en/build-with-claude/streaming). Thinking blocks stream as `thinking\_delta` events inside `content\_block\_delta` events, followed by a single `signature\_delta` event just before the block's `content\_block\_stop`. Text blocks stream afterward as usual.
![Diagram of the streaming event sequence with thinking: the thinking block opens, thinking deltas stream only when display is summarized, a single signature delta closes the block, then text deltas stream](/docs/images/how-thinking-streams.svg)
The following examples stream a response with adaptive thinking, printing thinking and text deltas as they arrive:
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-4-8",
"max\_tokens": 16000,
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
ant messages create \
--model claude-opus-4-8 \
--max-tokens 16000 \
--thinking '{type: adaptive, display: summarized}' \
--message '{role: user, content: "What is the greatest common divisor of 1071 and 462?"}' \
--stream \
--format jsonl
```
```python Python
client = anthropic.Anthropic()
with client.messages.stream(
model="claude-opus-4-8",
max\_tokens=16000,
thinking={"type": "adaptive", "display": "summarized"},
messages=[
{
"role": "user",
"content": "What is the greatest common divisor of 1071 and 462?",
}
],
) as stream:
for event in stream:
if event.type == "content\_block\_start":
print(f"\nStarting {event.content\_block.type} block...")
elif event.type == "content\_block\_delta":
if event.delta.type == "thinking\_delta":
print(event.delta.thinking, end="", flush=True)
elif event.delta.type == "text\_delta":
print(event.delta.text, end="", flush=True)
```
```typescript TypeScript
const client = new Anthropic();
const stream = client.messages.stream({
model: "claude-opus-4-8",
max\_tokens: 16000,
thinking: { type: "adaptive", display: "summarized" },
messages: [{ role: "user", content: "What is the greatest common divisor of 1071 and 462?" }]
});
for await (const event of stream) {
if (event.type === "content\_block\_start") {
console.log(`\nStarting ${event.content\_block.type} block...`);
} else if (event.type === "content\_block\_delta") {
if (event.delta.type === "thinking\_delta") {
process.stdout.write(event.delta.thinking);
} else if (event.delta.type === "text\_delta") {
process.stdout.write(event.delta.text);
}
}
}
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus4\_8,
MaxTokens = 16000,
Thinking = new ThinkingConfigAdaptive { Display = Display.Summarized },
Messages = [new() { Role = Role.User, Content = "What is the greatest common divisor of 1071 and 462?" }]
};
await foreach (var rawEvent in client.Messages.CreateStreaming(parameters))
{
if (rawEvent.TryPickContentBlockStart(out var start))
{
Console.WriteLine($"\nStarting {start.ContentBlock.Type} block...");
}
else if (rawEvent.TryPickContentBlockDelta(out var delta))
{
if (delta.Delta.TryPickThinking(out var thinkingDelta))
{
Console.Write(thinkingDelta.Thinking);
}
else if (delta.Delta.TryPickText(out var textDelta))
{
Console.Write(textDelta.Text);
}
}
}
```
```go Go
client := anthropic.NewClient()
stream := client.Messages.NewStreaming(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus4\_8,
MaxTokens: 16000,
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
case anthropic.ContentBlockStartEvent:
fmt.Printf("\nStarting %s block...\n", eventVariant.ContentBlock.Type)
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
import com.anthropic.models.messages.ThinkingConfigAdaptive;
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_4\_8)
.maxTokens(16000L)
.thinking(ThinkingConfigAdaptive.builder()
.display(ThinkingConfigAdaptive.Display.SUMMARIZED)
.build())
.addUserMessage("What is the greatest common divisor of 1071 and 462?")
.build();
try (var streamResponse = client.messages().createStreaming(params)) {
streamResponse.stream().forEach(event -> {
if (event.contentBlockStart().isPresent()) {
var startEvent = event.contentBlockStart().get();
var block = startEvent.contentBlock();
if (block.isThinking()) {
IO.println("\nStarting thinking block...");
} else if (block.isText()) {
IO.println("\nStarting text block...");
}
} else if (event.contentBlockDelta().isPresent()) {
var deltaEvent = event.contentBlockDelta().get();
deltaEvent.delta().thinking().ifPresent(td ->
IO.print(td.thinking())
);
deltaEvent.delta().text().ifPresent(td ->
IO.print(td.text())
);
}
});
}
}
```
```php PHP
$client = new Client();
$stream = $client->messages->createStream(
maxTokens: 16000,
messages: [
['role' => 'user', 'content' => 'What is the greatest common divisor of 1071 and 462?']
],
model: 'claude-opus-4-8',
thinking: ['type' => 'adaptive', 'display' => 'summarized'],
);
foreach ($stream as $event) {
if ($event->type === 'content\_block\_start') {
echo "\nStarting {$event->contentBlock->type} block...\n";
} elseif ($event->type === 'content\_block\_delta') {
if ($event->delta->type === 'thinking\_delta') {
echo $event->delta->thinking;
} elseif ($event->delta->type === 'text\_delta') {
echo $event->delta->text;
}
}
}
```
```ruby Ruby
client = Anthropic::Client.new
stream = client.messages.stream(
model: "claude-opus-4-8",
max\_tokens: 16000,
thinking: { type: "adaptive", display: "summarized" },
messages: [
{ role: "user", content: "What is the greatest common divisor of 1071 and 462?" }
]
)
stream.each do |event|
case event
when Anthropic::Streaming::ThinkingEvent
print event.thinking
when Anthropic::Streaming::TextEvent
print event.text
end
end
```

```sse Output
event: message\_start
data: {"type": "message\_start", "message": {"id": "msg\_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-opus-4-8", "stop\_reason": null, "stop\_sequence": null}}
event: content\_block\_start
data: {"type": "content\_block\_start", "index": 0, "content\_block": {"type": "thinking", "thinking": "", "signature": ""}}
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 0, "delta": {"type": "thinking\_delta", "thinking": "I need to find the GCD of 1071 and 462 using the Euclidean algorithm.\n\n1071 = 2 × 462 + 147"}}
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 0, "delta": {"type": "thinking\_delta", "thinking": "\n462 = 3 × 147 + 21\n147 = 7 × 21 + 0\n\nSo GCD(1071, 462) = 21"}}
// Additional thinking deltas...
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 0, "delta": {"type": "signature\_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b..."}}
event: content\_block\_stop
data: {"type": "content\_block\_stop", "index": 0}
event: content\_block\_start
data: {"type": "content\_block\_start", "index": 1, "content\_block": {"type": "text", "text": ""}}
event: content\_block\_delta
data: {"type": "content\_block\_delta", "index": 1, "delta": {"type": "text\_delta", "text": "The greatest common divisor of 1071 and 462 is \*\*21\*\*."}}
// Additional text deltas...
event: content\_block\_stop
data: {"type": "content\_block\_stop", "index": 1}
event: message\_delta
data: {"type": "message\_delta", "delta": {"stop\_reason": "end\_turn", "stop\_sequence": null}}
event: message\_stop
data: {"type": "message\_stop"}
```
When `display: "omitted"` is set, the thinking block opens, a single `signature\_delta` arrives, and the block closes without any `thinking\_delta` events. Text streaming begins immediately after:
```sse Output
event: content\_block\_start
data: {"type":"content\_block\_start","index":0,"content\_block":{"type":"thinking","thinking":"","signature":""}}
event: content\_block\_delta
data: {"type":"content\_block\_delta","index":0,"delta":{"type":"signature\_delta","signature":"EosnCkYICxIMMb3LzNrMu..."}}
event: content\_block\_stop
data: {"type":"content\_block\_stop","index":0}
event: content\_block\_start
data: {"type":"content\_block\_start","index":1,"content\_block":{"type":"text","text":""}}
```
When using streaming with thinking enabled, you might notice that text sometimes arrives in larger chunks alternating with smaller, token-by-token delivery. This is expected behavior, especially for thinking content.
The streaming system needs to process content in batches for optimal performance, which can result in this "chunky" delivery pattern, with possible delays between streaming events.
For general streaming mechanics, see [Streaming Messages](/docs/en/build-with-claude/streaming).
## Thinking and effort
The `thinking` parameter controls whether Claude thinks in [thinking blocks](/docs/en/build-with-claude/thinking) before answering; the `effort` parameter controls how much work Claude puts into the whole response, which in adaptive mode includes how often and how deeply it thinks. Don't pass `adaptive` as an `effort` value: `adaptive` is a thinking mode, not an effort level.
For what each effort level does to thinking behavior, see the [per-level thinking behavior table](/docs/en/build-with-claude/thinking-steering-and-cost#effort-levels) on the [Steering thinking](/docs/en/build-with-claude/thinking-steering-and-cost) page; the [Effort](/docs/en/build-with-claude/effort) page documents the parameter itself, including which levels each model supports. On Claude Opus 4.5, the only extended-thinking-only model that supports effort, effort composes with `budget\_tokens`; see [Budget rules and tuning](/docs/en/build-with-claude/extended-thinking#budget-rules-and-tuning).
With the two controls separated this way, pick the one that matches your goal:
\* \*\*Lower cost or latency on a thinking-enabled workload:\*\* lower `effort` first. It scales the whole response down, thinking included.
\* \*\*Claude is thinking too rarely or too shallowly:\*\* raise `effort`, or see [Steering how often Claude thinks](/docs/en/build-with-claude/thinking-steering-and-cost#tuning-thinking-behavior) on the steering page.
\* \*\*You need thinking fully off:\*\* use `thinking: {type: "disabled"}` on models that allow it (see the [per-model configuration table](/docs/en/build-with-claude/thinking-troubleshooting#supported-models)).
\* \*\*You need a hard ceiling on spend:\*\* use `max\_tokens`. Effort is soft guidance; `max\_tokens` is a strict limit.
## Thinking with tool use
Thinking works alongside [tool use](/docs/en/agents-and-tools/tool-use/overview), letting Claude reason through tool selection and process tool results. Two constraints apply:
1. \*\*Tool choice limitation (manual mode)\*\*: tool use with manual extended thinking (`thinking: {type: "enabled"}`) only supports `tool\_choice: {"type": "auto"}` (the default) or `tool\_choice: {"type": "none"}`. Using `tool\_choice: {"type": "any"}` or `tool\_choice: {"type": "tool", "name": "..."}` results in an error because these options force tool use, which is incompatible with manual extended thinking. Adaptive thinking, including on models where thinking is on by default, supports forced tool use.
2. \*\*Preserving thinking blocks\*\*: when you return tool results, you must pass the thinking blocks from the assistant message back to the API, complete and unmodified. See [Preserving thinking blocks](#preserving-thinking-blocks).
\*\*A tool-use loop is one assistant turn.\*\* From the model's perspective, an assistant turn doesn't complete until Claude finishes its full response, which may include multiple tool calls and results. This whole sequence is a single assistant turn:
```text wrap
User: "What's the weather in Paris?"
Assistant: [thinking] + [tool\_use: get\_weather]
User: [tool\_result: "20°C, sunny"]
Assistant: [text: "The weather in Paris is 20°C and sunny"]
```
The entire turn runs in a single thinking mode: you can't toggle thinking in the middle of a turn, including during the tool-use loop. In extended (manual) mode, the API additionally enforces that the final assistant turn of a thinking-enabled request begins with a thinking block. Adaptive mode relaxes this: no assistant turn needs to start with one.
\*\*Mid-turn conflicts degrade gracefully.\*\* If you toggle thinking mid-turn (for example, between sending a tool call and returning its result), the API doesn't error. Instead, it silently disables thinking for that request. To preserve model quality, the API may strip thinking blocks that would create an invalid turn structure, or disable thinking when the conversation history is incompatible with thinking being enabled. To confirm whether thinking was active, check for the presence of `thinking` blocks in the response.
\*\*Toggle between turns, not within them.\*\* Plan your thinking strategy at the start of each turn. Complete the assistant turn, then change the thinking configuration for the next one:
```text wrap
User: "What's the weather?"
Assistant: [tool\_use] (thinking disabled)
User: [tool\_result]
Assistant: [text: "It's sunny"]
User: "What about tomorrow?"
Assistant: [thinking] + [text: "..."] (thinking enabled - new turn)
```
Note that toggling thinking modes also invalidates prompt caching; see [Thinking and prompt caching](#thinking-and-prompt-caching).
### Preserving thinking blocks
When Claude invokes a tool, it pauses construction of its response to await external information. When you return the tool result, Claude continues building that same response, so its earlier reasoning must still be present. Pass every `thinking` block back to the API complete and unmodified, alongside the `tool\_use` block it accompanied. This matters for two reasons:
1. \*\*Reasoning continuity\*\*: the thinking blocks capture the step-by-step reasoning that led to the tool requests. Including them lets Claude continue reasoning from where it left off.
2. \*\*Context maintenance\*\*: tool results appear as user messages in the API structure, but they're part of one continuous reasoning flow. Preserving thinking blocks maintains that flow across API calls.
In short:
\* \*\*Required:\*\* within a tool-use turn, pass thinking blocks back.
\* \*\*Recommended:\*\* across turns, pass everything back.
\* \*\*Allowed:\*\* outside tool use, omit prior turns' thinking.
You don't need to prune old thinking yourself. Pass all thinking blocks back in multi-turn conversations, and the API automatically filters them, keeps the blocks needed to preserve the model's reasoning, and bills input tokens only for the blocks actually shown to Claude. Which prior-turn blocks are kept is per-model; see [Thinking block preservation by model](#thinking-block-preservation-by-model). To override the default, use the [`clear\_thinking\_20251015` context-editing strategy](/docs/en/build-with-claude/context-editing#thinking-block-clearing).
Within the latest assistant message, the sequence of consecutive `thinking` blocks must match what the model generated in the original request: you can't rearrange, edit, or partially drop them. This includes [`redacted\_thinking` blocks](#redacted-thinking-blocks).
Modified thinking blocks are rejected with a 400 error; see [A 400 error says thinking blocks cannot be modified](/docs/en/build-with-claude/thinking-troubleshooting#error-thinking-blocks-modified) for the exact message, the common causes, and the fix. The one exception: text placed in the empty `thinking` field of an [omitted](#controlling-thinking-display) block is ignored rather than rejected.
For a complete two-turn walkthrough with code in every SDK, see [Thinking in tool and multi-turn workflows](/docs/en/build-with-claude/thinking-tool-workflows#two-turn-tool-use-round-trip). It defines a tool, receives a thinking-plus-tool-use response, and echoes the assistant turn back with the tool result.
### Interleaved thinking
Interleaved thinking lets Claude think between tool calls, reasoning about each tool result before acting on it. With interleaved thinking, Claude can:
\* Reason about the results of a tool call before deciding what to do next
\* Chain multiple tool calls with reasoning steps in between
\* Make more nuanced decisions based on intermediate results
Consecutive tool calls do not require interleaved thinking. Claude can chain tool calls with or without interleaved thinking; interleaving changes where thinking blocks appear between tool calls, not whether tool calls can chain.
With adaptive thinking, interleaved thinking is automatic on every model that supports adaptive thinking; no beta header is needed. On Claude Fable 5, Claude Mythos 5, Claude Mythos Preview, Claude Opus 5, Claude Opus 4.8, and Claude Opus 4.7, reasoning between tool calls always appears in thinking blocks. Claude Haiku 4.5 does not support interleaved thinking. On models using manual extended thinking, interleaving requires a beta header and changes how the thinking budget is counted; [Interleaved thinking in manual mode](/docs/en/build-with-claude/extended-thinking#interleaved-thinking) covers the per-model rules and platform-specific header behavior.
With interleaved thinking, the thinking allocation can span the entire assistant turn rather than a single response. Interleaved thinking is only supported for [tools used through the Messages API](/docs/en/agents-and-tools/tool-use/overview).
For a worked comparison showing what interleaved thinking changes in a two-tool workflow, see [How interleaved thinking changes the flow](/docs/en/build-with-claude/thinking-tool-workflows#how-interleaved-thinking-changes-the-flow).
### Thinking block preservation by model
Whether thinking blocks from previous assistant turns stay in context by default depends on the model:
\* \*\*Keep all prior turns:\*\* Claude Opus 4.5 and later Opus models, Claude Sonnet 4.6 and later Sonnet models, Claude Fable 5, Claude Mythos 5, and Claude Mythos Preview.
\* \*\*Keep the last turn only:\*\* earlier Opus and Sonnet models, and all Haiku models through Claude Haiku 4.5. When you pass older thinking blocks back, the API strips them automatically; you don't need to remove them yourself.
Preservation brings two benefits:
\* \*\*Cache optimization\*\*: preserved thinking blocks enable cache hits during tool use, as they are passed back with tool results and cached incrementally across the assistant turn, resulting in token savings in multistep workflows.
\* \*\*No intelligence impact\*\*: preserving thinking blocks has no negative effect on model performance.
The tradeoff is context usage: long conversations consume more context space on keep-all models, since retained thinking blocks count as input like any other conversation history (see [Thinking and the context window](#thinking-and-the-context-window)). The behavior is automatic in both regimes; no code changes or beta headers are required, and you should keep passing complete, unmodified thinking blocks back as described in [Preserving thinking blocks](#preserving-thinking-blocks). To override the default in either direction, use [thinking block clearing](/docs/en/build-with-claude/context-editing#thinking-block-clearing).
\*\*Switching models mid-conversation.\*\* When you switch between any two models, for example after a [classifier refusal fallback](/docs/en/build-with-claude/refusals-and-fallback), strip `thinking` and `redacted\_thinking` blocks from prior assistant turns. Thinking blocks are tied to the model that produced them. Other models silently ignore them rather than rejecting the request, but ignored blocks still add input tokens.
## Thinking and prompt caching
[Prompt caching](/docs/en/build-with-claude/prompt-caching) interacts with thinking in a few specific ways. The following rules apply in both thinking modes.
\*\*Configuration changes invalidate caching.\*\* The thinking configuration and the resolved [`effort`](/docs/en/build-with-claude/effort) level are rendered into the prompt itself, so changing any of them starts a new cache prefix. Switching between `adaptive`, `enabled`, and `disabled`, changing `budget\_tokens`, and changing the effort value all invalidate cache breakpoints: message-level breakpoints always miss, and tool and system-prompt breakpoints can miss too, depending on where the model renders the configuration. Treat any thinking or effort change as starting the cache over. Consecutive requests that keep the same configuration preserve the cache, and setting a parameter explicitly to its default value is equivalent to omitting it. A worked demonstration with usage output is on the [Steering thinking](/docs/en/build-with-claude/thinking-steering-and-cost#prompt-caching) page.
\*\*Thinking blocks are cached with tool results.\*\* During a tool-use loop, caching occurs when you make a follow-up request that includes tool results. At that point the previous conversation history, including its thinking blocks, can be cached, and those cached thinking blocks count as input tokens in your usage metrics when read from the cache. This happens automatically, even without explicit `cache\_control` markers, and behaves the same for regular and interleaved thinking. The tradeoff: thinking blocks you never see again in responses still contribute to input token usage when read from cache.
\*\*Whether prior blocks are in context at all is per-model.\*\* The [preservation default](#thinking-block-preservation-by-model) governs this. On keep-all models, previous turns' thinking blocks stay cached and in context. On last-turn-only models, once you send a user message that isn't a tool result, all previous thinking blocks are stripped from context. On those models, a conversation like this:
```text wrap
User: ["What's the weather in Paris?"],
Assistant: [thinking\_block\_1] + [tool\_use block 1],
User: [tool\_result\_1, cache=True],
Assistant: [thinking\_block\_2] + [text block 2],
User: [Text response, cache=True]
```
is processed as if the thinking blocks were never there:
```text wrap
User: ["What's the weather in Paris?"],
Assistant: [tool\_use block 1],
User: [tool\_result\_1, cache=True],
Assistant: [text block 2],
User: [Text response, cache=True]
```
On keep-all models, the same request keeps `thinking\_block\_1` and `thinking\_block\_2` in context and in the cache.
\*\*Degradation strips thinking from the cacheable history.\*\* If thinking becomes disabled mid-turn and you pass thinking content in the current tool-use turn, the thinking content is stripped and thinking remains disabled for that request (see [graceful degradation](#thinking-with-tool-use)). [Interleaved thinking](#interleaved-thinking) amplifies cache invalidation effects, since thinking blocks can occur between multiple tool calls.
Thinking-heavy tasks often take longer than the default 5-minute cache lifetime to complete. Consider the [1-hour cache duration](/docs/en/build-with-claude/prompt-caching#1-hour-cache-duration) to maintain cache hits across longer thinking sessions and multistep workflows.
## Thinking and the context window
`max\_tokens`, which includes all thinking Claude generates in the current turn, is enforced as a strict limit. On Claude 4.5 models and newer, if input tokens plus `max\_tokens` exceeds the context window size, the API accepts the request; if generation then reaches the context window limit, it stops with `stop\_reason: "model\_context\_window\_exceeded"` instead of returning an error. On earlier models, the API returns a validation error instead. See [Handling stop reasons](/docs/en/build-with-claude/handling-stop-reasons).
How thinking counts against the window depends on when it was generated:
\* \*\*Current-turn thinking\*\* always counts toward `max\_tokens`, is billed as output tokens, and occupies context window space for the turn that generated it.
\* \*\*Prior-turn thinking\*\* depends on the [preservation default](#thinking-block-preservation-by-model). On [models that keep all prior turns](#thinking-block-preservation-by-model), previous thinking blocks remain in context, count toward the window, and are billed as input tokens like the rest of the conversation history. On models that keep only the last turn, the API strips older thinking blocks automatically when you pass them back, so they don't consume window space or input tokens.
In practice:
\* On keep-all models, budget your context window as if thinking were ordinary conversation history, because it is. Long agentic sessions accumulate thinking in context; use [thinking block clearing](/docs/en/build-with-claude/context-editing#thinking-block-clearing) if you need to reclaim space.
\* On last-turn-only models, thinking is a per-turn cost only: each turn's thinking counts against that turn's `max\_tokens` and then drops out of the window.
The following diagrams illustrate the last-turn-only (stripping) regime. The first shows a multi-turn conversation: each turn's thinking block is generated in the output but not carried into later turns' input.
![Diagram of thinking on a model that strips previous thinking blocks: each turn's thinking block is generated in the output and not carried into later turns' input](/docs/images/context-window-thinking.svg)
The second shows the same regime with tool use: thinking stays in context alongside its tool result for the duration of the assistant turn, then drops out on the next user turn.
![Diagram of thinking with tool use on a model that strips previous thinking blocks: thinking is kept with its tool result, then dropped on the next user turn](/docs/images/context-window-thinking-tools.svg)
Use the [token counting API](/docs/en/build-with-claude/token-counting) to get accurate counts for your specific use case, especially for multi-turn conversations that include thinking.
## Thinking encryption
Full thinking content is encrypted and returned in the `signature` field on each thinking block. The API uses the signature to verify that thinking blocks were generated by Claude when you pass them back.
Keep the following in mind when working with signatures:
\* It is only strictly necessary to send back thinking blocks when [using tools with thinking](#thinking-with-tool-use). Otherwise you can omit thinking blocks from previous turns. If you do pass them back, whether the API keeps or strips them depends on the model (see [Thinking block preservation by model](#thinking-block-preservation-by-model)); use [context editing](/docs/en/build-with-claude/context-editing) to configure this.
\* When sending back thinking blocks, pass everything back exactly as you received it, for consistency and to avoid potential issues.
\* When [streaming responses](#streaming-thinking), the signature arrives as a `signature\_delta` inside a `content\_block\_delta` event just before the `content\_block\_stop` event.
\* `signature` values are significantly longer in Claude 4 and later models than in previous models.
\* The `signature` field is opaque: don't interpret or parse it.
\* `signature` values are compatible across platforms (Claude APIs, [Amazon Bedrock](/docs/en/build-with-claude/claude-in-amazon-bedrock), and [Google Cloud](/docs/en/build-with-claude/claude-on-vertex-ai)). Values generated on one platform work on another.
## Redacted thinking blocks
In addition to regular `thinking` blocks, the API may return `redacted\_thinking` blocks when portions of Claude's reasoning are safety-redacted. A `redacted\_thinking` block contains encrypted thinking content in a `data` field, with no readable text:
```json
{
"type": "redacted\_thinking",
"data": "..."
}
```
The `data` field is opaque and encrypted. Like the `signature` field on regular thinking blocks, pass `redacted\_thinking` blocks back to the API unchanged when continuing a multi-turn conversation with [tools](#thinking-with-tool-use).
If your code filters content blocks by type (for example, `block.type == "thinking"`) when round-tripping responses with tool use, also include `redacted\_thinking` blocks. Filtering on `block.type == "thinking"` alone silently drops `redacted\_thinking` blocks and breaks the multi-turn protocol described in [Preserving thinking blocks](#preserving-thinking-blocks).

`redacted\_thinking` blocks are a distinct content block type returned when thinking is safety-redacted. This is separate from the [`display: "omitted"`](#controlling-thinking-display) option, which returns regular `thinking` blocks with an empty `thinking` field.
## Thinking output on Claude Fable 5 and Claude Mythos 5
On Claude Fable 5 and Claude Mythos 5, the raw chain of thought is never returned; the blocks you receive are regular `thinking` blocks, not `redacted\_thinking`, and the [`display` setting](#controlling-thinking-display) works the same as on other models ([summarized](#summarized-thinking) text, or an empty `thinking` field when omitted, the default here). For the response shape of thinking blocks, see the [Messages API reference](/docs/en/api/messages/create).
When continuing a conversation on the same model, pass each thinking block back to the API exactly as received, including blocks whose `thinking` field is empty. Don't edit or reconstruct them. Reading the summary text for display is fine: the API rejects blocks whose returned content has been modified, not blocks you have read. Text placed in an empty omitted `thinking` field is [ignored rather than rejected](#controlling-thinking-display).
For what happens to thinking blocks when you switch models mid-conversation, see [Thinking block preservation by model](#thinking-block-preservation-by-model).
Two exceptions, covered in [Fallback credit](/docs/en/build-with-claude/fallback-credit):
\* Fallback-credit retries must echo the refused request body unchanged.
\* `fallback` blocks from a mid-output fallback stay where they appeared.
To get visibility into the model's reasoning, read the `thinking` blocks described on this page rather than prompting for reasoning in the response text. On Claude Fable 5, a request that attempts to elicit the model's internal reasoning as part of the response text can be refused with `stop\_details.category: "reasoning\_extraction"`. See [Refusal categories](/docs/en/build-with-claude/refusals-and-fallback#refusal-response) for the field reference and handling guidance.
## Limits and feature compatibility
\*\*Sampling parameters.\*\* On Claude Fable 5, Claude Mythos 5, Claude Mythos Preview, Claude Opus 5, Claude Opus 4.8, Claude Opus 4.7, and Claude Sonnet 5, non-default `temperature`, `top\_p`, or `top\_k` values return a 400 error on every request, regardless of whether thinking is used. On older models, the restriction applies only while thinking is on: `temperature` and `top\_k` are incompatible with thinking, and `top\_p` is allowed at values between 0.95 and 1.
\*\*Response prefill and forced tool use.\*\* You can't pre-fill the assistant response while thinking is on. Forced tool use (`tool\_choice: {"type": "any"}` or `{"type": "tool", ...}`) is incompatible with manual extended thinking but works with adaptive thinking; see [Thinking with tool use](#thinking-with-tool-use).
\*\*Output limits.\*\* Claude Fable 5, Claude Mythos 5, Claude Mythos Preview, Claude Opus 5, Claude Opus 4.8, Claude Opus 4.7, Claude Sonnet 5, Claude Opus 4.6, and Claude Sonnet 4.6 support up to 128k output tokens per request. Claude Haiku 4.5, Claude Sonnet 4.5, and Claude Opus 4.5 support up to 64k. On the [Message Batches API](/docs/en/build-with-claude/batch-processing#extended-output-beta), the `output-300k-2026-03-24` [beta header](/docs/en/api/beta-headers) raises the limit to 300k for Claude Opus 5, Claude Opus 4.8, Claude Opus 4.7, Claude Sonnet 5, Claude Opus 4.6, and Claude Sonnet 4.6. See the [models overview](/docs/en/about-claude/models/overview) for limits on legacy models.
\*\*Long requests.\*\* The SDKs require streaming when `max\_tokens` is greater than 21,333, to avoid HTTP timeouts on long-running requests. This is a client-side validation, not an API restriction. If you don't need to process events incrementally, use `.stream()` with `.get\_final\_message()` (Python) or `.finalMessage()` (TypeScript) to get the complete `Message` object without handling individual events; see [Streaming Messages](/docs/en/build-with-claude/streaming#get-the-final-message-without-handling-events). Expect longer response times when thinking is active, since generating thinking blocks adds processing time. For workloads that push thinking above roughly 32k tokens per request, use [batch processing](/docs/en/build-with-claude/batch-processing) to avoid networking issues: such requests can run long enough to hit system timeouts and open connection limits.
## Next steps

Tune when and how deeply Claude thinks: effort levels, prompt-based steering, cost control, and pricing.

Walk through a complete two-turn tool-use round trip and see what interleaved thinking changes.

Match thinking configuration 400s, empty thinking fields, and cache misses to their causes and fixes.

Control how many tokens Claude spends across text, tool calls, and thinking with the effort parameter.
