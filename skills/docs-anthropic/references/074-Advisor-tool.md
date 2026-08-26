# Advisor tool

Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool.md

# Advisor tool
Pair a faster executor model with a higher-intelligence advisor model that provides strategic guidance mid-generation.
---
The advisor tool lets a faster, lower-cost \*\*executor model\*\* consult a higher-intelligence \*\*advisor model\*\* mid-generation for strategic guidance. The advisor reads the full conversation, produces a plan or course correction, and the executor continues with the task.
This pattern fits long-horizon agentic workloads (coding agents, computer use, multistep research pipelines) where most turns are mechanical but having an excellent plan is crucial. You get close to advisor-solo quality while the bulk of token generation happens at executor-model rates.
```mermaid
sequenceDiagram
participant U as Your application
participant E as Executor model
participant A as Advisor model
U->>E: Request with advisor tool
note over E: Executor begins the task
E->>A: server\_tool\_use (server-side)
note over A: Reads the full transcript,
returns strategic guidance
A-->>E: advisor\_tool\_result
note over E: Executor continues,
informed by the advice
E-->>U: Response
```
For how zero data retention (ZDR) applies to this feature, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
## When to use it
The advisor fits these configurations:
\* \*\*You currently use Sonnet on complex tasks:\*\* Add a higher-tier advisor. Opus keeps total cost similar or lower; Claude Fable 5 maximizes the quality lift.
\* \*\*You currently use Haiku and want a step up in intelligence:\*\* Add an Opus or Fable advisor. Expect higher cost than Haiku alone, but lower than switching the executor to a larger model.
Results are task-dependent. Evaluate on your own workload.
The advisor is a weaker fit for single-turn Q\&A (nothing to plan), pure pass-through model pickers where your users already choose their own cost and quality tradeoff, or workloads where every turn genuinely requires the advisor model's full capability.
## Quick start
The advisor tool is in beta. Include the beta header `advisor-tool-2026-03-01` in your requests.

```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: advisor-tool-2026-03-01" \
-H "content-type: application/json" \
-d '{
"model": "claude-sonnet-5",
"max\_tokens": 4096,
"tools": [
{
"type": "advisor\_20260301",
"name": "advisor",
"model": "claude-fable-5"
}
],
"messages": [{
"role": "user",
"content": "Build a concurrent worker pool in Go with graceful shutdown."
}]
}'
```
```bash CLI
ant beta:messages create --beta advisor-tool-2026-03-01 <<'YAML'
model: claude-sonnet-5
max\_tokens: 4096
tools:
- type: advisor\_20260301
name: advisor
model: claude-fable-5
messages:
- role: user
content: Build a concurrent worker pool in Go with graceful shutdown.
YAML
```
```python Python
client = anthropic.Anthropic()
response = client.beta.messages.create(
model="claude-sonnet-5",
max\_tokens=4096,
betas=["advisor-tool-2026-03-01"],
tools=[
{
"type": "advisor\_20260301",
"name": "advisor",
"model": "claude-fable-5",
}
],
messages=[
{
"role": "user",
"content": "Build a concurrent worker pool in Go with graceful shutdown.",
}
],
)
print(response)
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.beta.messages.create({
model: "claude-sonnet-5",
max\_tokens: 4096,
betas: ["advisor-tool-2026-03-01"],
tools: [
{
type: "advisor\_20260301",
name: "advisor",
model: "claude-fable-5"
}
],
messages: [
{
role: "user",
content: "Build a concurrent worker pool in Go with graceful shutdown."
}
]
});
console.log(response);
```
```csharp C#
using Anthropic.Models.Beta.Messages;
using Messages = Anthropic.Models.Messages;
var client = new AnthropicClient();
var parameters = new MessageCreateParams
{
Model = Messages::Model.ClaudeSonnet5,
MaxTokens = 4096,
Tools = new BetaToolUnion[]
{
new BetaAdvisorTool20260301
{
Model = Messages::Model.ClaudeFable5
}
},
Messages =
[
new BetaMessageParam
{
Role = Role.User,
Content = "Build a concurrent worker pool in Go with graceful shutdown."
}
],
Betas = ["advisor-tool-2026-03-01"]
};
var response = await client.Beta.Messages.Create(parameters);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeSonnet5,
MaxTokens: 4096,
Tools: []anthropic.BetaToolUnionParam{
{OfAdvisorTool20260301: &anthropic.BetaAdvisorTool20260301Param{
Model: anthropic.ModelClaudeFable5,
}},
},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Build a concurrent worker pool in Go with graceful shutdown.")),
},
Betas: []anthropic.AnthropicBeta{
anthropic.AnthropicBetaAdvisorTool2026\_03\_01,
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
import com.anthropic.models.beta.messages.BetaAdvisorTool20260301;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_SONNET\_5)
.maxTokens(4096L)
.addTool(BetaAdvisorTool20260301.builder()
.model(Model.CLAUDE\_FABLE\_5)
.build())
.addUserMessage("Build a concurrent worker pool in Go with graceful shutdown.")
.addBeta("advisor-tool-2026-03-01")
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
'content' => 'Build a concurrent worker pool in Go with graceful shutdown.',
],
],
model: 'claude-sonnet-5',
tools: [
[
'type' => 'advisor\_20260301',
'name' => 'advisor',
'model' => 'claude-fable-5',
],
],
betas: ['advisor-tool-2026-03-01'],
);
echo $response;
```
```ruby Ruby
client = Anthropic::Client.new
response = client.beta.messages.create(
model: "claude-sonnet-5",
max\_tokens: 4096,
tools: [
{
type: "advisor\_20260301",
name: "advisor",
model: "claude-fable-5"
}
],
messages: [
{
role: "user",
content: "Build a concurrent worker pool in Go with graceful shutdown."
}
],
betas: ["advisor-tool-2026-03-01"]
)
puts response
```
The response `content` includes an `advisor\_tool\_result` block carrying the advisor's guidance. With Claude Opus 5, Claude Fable 5, or Claude Mythos 5 as the advisor, the block's `content` field is an `advisor\_redacted\_result` variant (encrypted; the executor reads it server-side, but your client does not). To see the advice text directly in your response, use `claude-opus-4-8` as the advisor model instead, which returns the plaintext `advisor\_result` variant. See [Result variants](#result-variants) for both shapes and [Model compatibility](#model-compatibility) for the full list of valid pairs.
## How it works
When you add the advisor tool to your `tools` array, the executor model determines when to call it, like any other tool. When the executor calls the advisor:
1. The executor emits a [`server\_tool\_use`](/docs/en/agents-and-tools/tool-use/server-tools) block with `name: "advisor"` and an empty `input`. The executor signals timing, and the server supplies context.
2. Anthropic runs a separate inference pass on the advisor model server-side. The advisor runs under its own Anthropic-supplied system prompt and receives the executor's full transcript as quoted context in its input. That transcript includes your system prompt, the tool definitions, the prior turns and tool results, and the text the executor has produced so far in this turn.
3. The advisor's response returns to the executor as an `advisor\_tool\_result` block.
4. The executor continues generating, informed by the advice.
All of this occurs inside a single `/v1/messages` request, with no extra round trips on your side. The exception is a turn that pauses mid-call, which you resume with a follow-up request (see [Resuming a paused turn](#resuming-a-paused-turn)).
The advisor itself runs without tools and without context management. Its thinking blocks are dropped before the result returns. Only the advice text reaches the executor.
## Tool parameters
| Parameter | Type | Default | Description |
| ------------ | -------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type` | string | \*required\* | Must be `"advisor\_20260301"`. |
| `name` | string | \*required\* | Must be `"advisor"`. |
| `model` | string | \*required\* | The advisor model ID, such as claude-fable-5. Billed at this model's rates for the sub-inference. |
| `max\_uses` | integer | unlimited | Maximum number of advisor calls allowed in a single request. Once the executor reaches this cap, further advisor calls return an `advisor\_tool\_result\_error` with `error\_code: "max\_uses\_exceeded"` and the executor continues without further advice. This is a per-request cap, not a per-conversation cap. See [Cost control](#cost-control) for conversation-level limits. |
| `max\_tokens` | integer | advisor model's output cap | Caps the advisor's total output (thinking plus text) per call. Minimum 1024. See [Capping advisor output](#capping-advisor-output). |
| `caching` | object \| null | `null` (off) | Enables [prompt caching](/docs/en/build-with-claude/prompt-caching) for the advisor's own transcript across calls within a conversation. See [Advisor prompt caching](#advisor-prompt-caching). |
The `caching` object has the shape `{"type": "ephemeral", "ttl": "5m" | "1h"}`. Unlike `cache\_control` on content blocks, this is not a breakpoint marker. It is an on/off switch. The server determines where cache boundaries go.
The advisor tool also accepts the generic properties available on any tool definition: `cache\_control`, `allowed\_callers`, `defer\_loading`, and `strict` (covered in [structured outputs](/docs/en/build-with-claude/structured-outputs)). See the [Tool reference](/docs/en/agents-and-tools/tool-use/tool-reference#tool-definition-properties) for their semantics.
## Response structure
### Successful advisor call
When the advisor is called, a `server\_tool\_use` block is followed by an `advisor\_tool\_result` block in the assistant's content. The following example shows the plaintext `advisor\_result` variant returned by a Claude Opus 4.8 advisor. The [Quick start](#quick-start) uses Claude Fable 5, which returns the encrypted `advisor\_redacted\_result` variant instead; see [Result variants](#result-variants).
```json
{
"role": "assistant",
"content": [
{
"type": "text",
"text": "Let me consult the advisor on this."
},
{
"type": "server\_tool\_use",
"id": "srvtoolu\_abc123",
"name": "advisor",
"input": {}
},
{
"type": "advisor\_tool\_result",
"tool\_use\_id": "srvtoolu\_abc123",
"content": {
"type": "advisor\_result",
"text": "Use a channel-based coordination pattern. The tricky part is draining in-flight work during shutdown: close the input channel first, then wait on a WaitGroup..."
}
},
{
"type": "text",
"text": "Here's the implementation. I'm using a channel-based coordination pattern to avoid writer starvation..."
}
]
}
```
The `server\_tool\_use.input` is always empty. The server constructs the advisor's view from the full transcript automatically. Nothing the executor puts in `input` reaches the advisor.
### Result variants
The `advisor\_tool\_result.content` field is a discriminated union. For successful calls, the variant depends on the advisor model:
| Variant | Fields | Returned when |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------------- |
| `advisor\_result` | `text`, `stop\_reason` | The advisor model returns plaintext (for example, Claude Opus 4.8). |
| `advisor\_redacted\_result` | `encrypted\_content`, `stop\_reason` | The advisor model returns encrypted output. |
Claude Opus 5, Claude Fable 5, and Claude Mythos 5 advisors return `advisor\_redacted\_result`. The other advisor models in the [compatibility table](#model-compatibility) return `advisor\_result`.
Both result variants carry a `stop\_reason` field when you set [`max\_tokens`](#capping-advisor-output) on the tool definition, and omit it when you do not. It holds the advisor sub-call's stop reason, typically `"end\_turn"`, or `"max\_tokens"` when the cap is hit. The values match the top-level Messages API [`stop\_reason`](/docs/en/build-with-claude/handling-stop-reasons).
With `advisor\_result`, the `text` field contains human-readable advice. With `advisor\_redacted\_result`, the `encrypted\_content` field contains an opaque blob that you cannot read. On the next turn, the server decrypts it and renders the plaintext into the executor's prompt.
In both cases, round-trip the content verbatim on subsequent turns. If you switch advisor models mid-conversation, branch on `content.type` to handle both shapes.
### Error results
If the advisor call fails, the result carries an error:
```json
{
"type": "advisor\_tool\_result",
"tool\_use\_id": "srvtoolu\_abc123",
"content": {
"type": "advisor\_tool\_result\_error",
"error\_code": "overloaded"
}
}
```
The executor sees the error and continues without further advice. The request itself does not fail.
| `error\_code` | Meaning |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `max\_uses\_exceeded` | The request reached the `max\_uses` cap set on the tool definition. Further advisor calls in the same request return this error. |
| `too\_many\_requests` | The advisor sub-inference was rate-limited. |
| `overloaded` | The advisor sub-inference hit capacity limits. |
| `prompt\_too\_long` | The transcript exceeded the advisor model's context window. |
| `execution\_time\_exceeded` | The advisor sub-inference timed out. |
| `unavailable` | Any other advisor failure. |
Advisor rate limits draw from the same per-model bucket as direct calls to the advisor model. A rate limit on the advisor appears as `too\_many\_requests` inside the tool result. A rate limit on the executor fails the whole request with HTTP 429.
## Multi-turn conversations
Pass the full assistant content, including `advisor\_tool\_result` blocks, back to the API on subsequent turns. This example uses `claude-opus-4-8` as the advisor so the plaintext advice is visible in `response.content`; the mechanics are identical for any advisor model.
```python Python
client = anthropic.Anthropic()
tools = [
{
"type": "advisor\_20260301",
"name": "advisor",
"model": "claude-opus-4-8",
}
]
messages = [
{
"role": "user",
"content": "Build a concurrent worker pool in Go with graceful shutdown.",
}
]
response = client.beta.messages.create(
model="claude-sonnet-5",
max\_tokens=1024,
betas=["advisor-tool-2026-03-01"],
tools=tools,
messages=messages,
)
# Append the full response content, including any advisor\_tool\_result blocks
messages.append({"role": "assistant", "content": response.content})
# Continue the conversation
messages.append({"role": "user", "content": "Now add a max-in-flight limit of 10."})
response = client.beta.messages.create(
model="claude-sonnet-5",
max\_tokens=1024,
betas=["advisor-tool-2026-03-01"],
tools=tools,
messages=messages,
)
```
```typescript TypeScript
const client = new Anthropic();
const tools: Anthropic.Beta.Messages.BetaToolUnion[] = [
{
type: "advisor\_20260301",
name: "advisor",
model: "claude-opus-4-8"
}
];
const messages: Anthropic.Beta.Messages.BetaMessageParam[] = [
{
role: "user",
content: "Build a concurrent worker pool in Go with graceful shutdown."
}
];
const response = await client.beta.messages.create({
model: "claude-sonnet-5",
max\_tokens: 1024,
betas: ["advisor-tool-2026-03-01"],
tools,
messages
});
// Append the full response content, including any advisor\_tool\_result blocks
messages.push({ role: "assistant", content: response.content });
// Continue the conversation
messages.push({ role: "user", content: "Now add a max-in-flight limit of 10." });
const followUp = await client.beta.messages.create({
model: "claude-sonnet-5",
max\_tokens: 1024,
betas: ["advisor-tool-2026-03-01"],
tools,
messages
});
```
```csharp C#
using Anthropic.Models.Beta.Messages;
using Messages = Anthropic.Models.Messages;
var client = new AnthropicClient();
var tools = new BetaToolUnion[]
{
new BetaAdvisorTool20260301 { Model = Messages::Model.ClaudeOpus4\_8 }
};
var messages = new List
{
new() { Role = Role.User, Content = "Build a concurrent worker pool in Go with graceful shutdown." }
};
var response = await client.Beta.Messages.Create(new MessageCreateParams
{
Model = Messages::Model.ClaudeSonnet5,
MaxTokens = 1024,
Tools = tools,
Messages = messages,
Betas = ["advisor-tool-2026-03-01"]
});
// Append the full response content, including any advisor\_tool\_result blocks
messages.Add(new BetaMessageParam
{
Role = Role.Assistant,
Content = response.Content.Select(block => new BetaContentBlockParam(block.Json)).ToList()
});
// Continue the conversation
messages.Add(new BetaMessageParam { Role = Role.User, Content = "Now add a max-in-flight limit of 10." });
var followUp = await client.Beta.Messages.Create(new MessageCreateParams
{
Model = Messages::Model.ClaudeSonnet5,
MaxTokens = 1024,
Tools = tools,
Messages = messages,
Betas = ["advisor-tool-2026-03-01"]
});
```
```java Java
import com.anthropic.models.beta.messages.BetaAdvisorTool20260301;
import com.anthropic.models.beta.messages.BetaContentBlock;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.BetaMessageParam;
import com.anthropic.models.beta.messages.BetaToolUnion;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
List tools = List.of(
BetaToolUnion.ofAdvisorTool20260301(
BetaAdvisorTool20260301.builder().model(Model.CLAUDE\_OPUS\_4\_8).build()));
List messages = new ArrayList<>();
messages.add(BetaMessageParam.builder()
.role(BetaMessageParam.Role.USER)
.content("Build a concurrent worker pool in Go with graceful shutdown.")
.build());
BetaMessage response = client.beta().messages().create(MessageCreateParams.builder()
.model(Model.CLAUDE\_SONNET\_5)
.maxTokens(4096L)
.tools(tools)
.messages(messages)
.addBeta("advisor-tool-2026-03-01")
.build());
// Append the full response content, including any advisor\_tool\_result blocks
messages.add(BetaMessageParam.builder()
.role(BetaMessageParam.Role.ASSISTANT)
.contentOfBetaContentBlockParams(
response.content().stream().map(BetaContentBlock::toParam).toList())
.build());
// Continue the conversation
messages.add(BetaMessageParam.builder()
.role(BetaMessageParam.Role.USER)
.content("Now add a max-in-flight limit of 10.")
.build());
BetaMessage followUp = client.beta().messages().create(MessageCreateParams.builder()
.model(Model.CLAUDE\_SONNET\_5)
.maxTokens(4096L)
.tools(tools)
.messages(messages)
.addBeta("advisor-tool-2026-03-01")
.build());
}
```
```php PHP
$client = new Client();
$tools = [
[
'type' => 'advisor\_20260301',
'name' => 'advisor',
'model' => 'claude-opus-4-8',
],
];
$messages = [
[
'role' => 'user',
'content' => 'Build a concurrent worker pool in Go with graceful shutdown.',
],
];
$response = $client->beta->messages->create(
maxTokens: 1024,
messages: $messages,
model: 'claude-sonnet-5',
tools: $tools,
betas: ['advisor-tool-2026-03-01'],
);
// Append the full response content, including any advisor\_tool\_result blocks
$messages[] = ['role' => 'assistant', 'content' => $response->content];
// Continue the conversation
$messages[] = ['role' => 'user', 'content' => 'Now add a max-in-flight limit of 10.'];
$response = $client->beta->messages->create(
maxTokens: 1024,
messages: $messages,
model: 'claude-sonnet-5',
tools: $tools,
betas: ['advisor-tool-2026-03-01'],
);
```
```ruby Ruby
client = Anthropic::Client.new
tools = [
{
type: "advisor\_20260301",
name: "advisor",
model: "claude-opus-4-8"
}
]
messages = [
{
role: "user",
content: "Build a concurrent worker pool in Go with graceful shutdown."
}
]
response = client.beta.messages.create(
model: "claude-sonnet-5",
max\_tokens: 1024,
tools: tools,
messages: messages,
betas: ["advisor-tool-2026-03-01"]
)
# Append the full response content, including any advisor\_tool\_result blocks
messages << { role: "assistant", content: response.content }
# Continue the conversation
messages << { role: "user", content: "Now add a max-in-flight limit of 10." }
response = client.beta.messages.create(
model: "claude-sonnet-5",
max\_tokens: 1024,
tools: tools,
messages: messages,
betas: ["advisor-tool-2026-03-01"]
)
```
If you omit the advisor tool from `tools` on a follow-up turn while the message history still contains `advisor\_tool\_result` blocks, the API returns a `400 invalid\_request\_error`.
The advisor tool has no built-in conversation-level cap. To limit advisor calls across a conversation, count them client-side. When you reach your ceiling, remove the advisor tool from your `tools` array \*\*and\*\* strip all `advisor\_tool\_result` blocks from your message history to avoid a `400 invalid\_request\_error`.
### Resuming a paused turn
A response can end with `stop\_reason: "pause\_turn"` while an advisor call is still pending. When that occurs, the response contains the advisor's `server\_tool\_use` block with no `advisor\_tool\_result` for it. To resume, append that assistant message to `messages` with its content unchanged, keeping the `server\_tool\_use` block, and send the request again with the same advisor tool and beta header. You do not need to add a user message or a `tool\_result` block. The API runs the pending advisor call and continues the executor's turn in the new response. A resumed turn can pause again. If it does, repeat the same step. Omitting the advisor tool from the resume request returns a `400 invalid\_request\_error`. If instead the executor called one of your tools in the same turn, the response ends with `stop\_reason: "tool\_use"` while the advisor call is still pending. Send the `tool\_result` blocks as usual, and the pending advisor call runs at the start of that next request. See [Mixing server tools and client tools in one turn](/docs/en/agents-and-tools/tool-use/server-tools#mixing-server-tools-and-client-tools-in-one-turn).
### Mid-conversation nudge for under-calling executors
If a Haiku executor has not called the advisor in its first assistant turn, append a short reminder as an additional user message before the second assistant turn. In Anthropic's internal behavioral evaluation this raised task pass rates by roughly 7 percentage points on Haiku executors. On Sonnet executors, the plain-text nudge had no measurable effect in Anthropic's testing. The call-timing considerations that follow are especially relevant for Sonnet. Do not apply the nudge to Opus executors: On Opus it slightly lowered pass rates.
With the default `NUDGE\_TURN` of 2, the reminder typically arrives after the model has oriented on the task but before it has committed to an approach.
```python Python
client = anthropic.Anthropic()
NUDGE\_TURN = 2 # inject before this assistant turn if no advisor call yet
NUDGE\_TEXT = (
"You have not consulted the advisor yet. If the task has a non-obvious "
"design decision or a failure mode you haven't ruled out, call advisor "
"now before committing to an approach."
)
MAX\_TURNS = 10 # agent loop cap
def run\_your\_tools(content):
# Replace with your tool dispatch. Returns one tool\_result block per tool\_use block.
return [
{
"type": "tool\_result",
"tool\_use\_id": block.id,
"content": "Replace with your tool output.",
}
for block in content
if block.type == "tool\_use"
]
tools = [
{"type": "advisor\_20260301", "name": "advisor", "model": "claude-fable-5"},
# ... your other tools
]
task = "Build a concurrent worker pool in Go with graceful shutdown."
messages = [{"role": "user", "content": task}]
advisor\_called = False
for turn in range(1, MAX\_TURNS + 1):
response = client.beta.messages.create(
model="claude-haiku-4-5",
max\_tokens=4096,
betas=["advisor-tool-2026-03-01"],
tools=tools,
messages=messages,
)
messages.append({"role": "assistant", "content": response.content})
advisor\_called = advisor\_called or any(
block.type == "server\_tool\_use" and block.name == "advisor"
for block in response.content
)
if response.stop\_reason == "end\_turn":
break
if response.stop\_reason == "pause\_turn":
continue # server tool pending; re-send to let the API complete it
results = run\_your\_tools(response.content) # list of tool\_result blocks
if results:
messages.append({"role": "user", "content": results})
# Skip this if your system prompt already tells the model to call sparingly.
if turn == NUDGE\_TURN - 1 and not advisor\_called:
messages.append({"role": "user", "content": NUDGE\_TEXT})
```
```typescript TypeScript
const client = new Anthropic();
const NUDGE\_TURN = 2; // inject before this assistant turn if no advisor call yet
const NUDGE\_TEXT =
"You have not consulted the advisor yet. If the task has a non-obvious " +
"design decision or a failure mode you haven't ruled out, call advisor " +
"now before committing to an approach.";
const MAX\_TURNS = 10; // agent loop cap
function runYourTools(
content: Anthropic.Beta.Messages.BetaContentBlock[]
): Anthropic.Beta.Messages.BetaToolResultBlockParam[] {
// Replace with your tool dispatch. Returns one tool\_result block per tool\_use block.
return content
.filter((block) => block.type === "tool\_use")
.map((block) => ({
type: "tool\_result" as const,
tool\_use\_id: block.id,
content: "Replace with your tool output."
}));
}
const tools: Anthropic.Beta.Messages.BetaToolUnion[] = [
{ type: "advisor\_20260301", name: "advisor", model: "claude-fable-5" }
// ... your other tools
];
const task = "Build a concurrent worker pool in Go with graceful shutdown.";
const messages: Anthropic.Beta.Messages.BetaMessageParam[] = [{ role: "user", content: task }];
let advisorCalled = false;
for (let turn = 1; turn <= MAX\_TURNS; turn++) {
const response = await client.beta.messages.create({
model: "claude-haiku-4-5",
max\_tokens: 4096,
betas: ["advisor-tool-2026-03-01"],
tools,
messages
});
messages.push({ role: "assistant", content: response.content });
advisorCalled =
advisorCalled ||
response.content.some(
(block) => block.type === "server\_tool\_use" && block.name === "advisor"
);
if (response.stop\_reason === "end\_turn") {
break;
}
if (response.stop\_reason === "pause\_turn") {
continue; // server tool pending; re-send to let the API complete it
}
const results = runYourTools(response.content); // list of tool\_result blocks
if (results.length > 0) {
messages.push({ role: "user", content: results });
}
// Skip this if your system prompt already tells the model to call sparingly.
if (turn === NUDGE\_TURN - 1 && !advisorCalled) {
messages.push({ role: "user", content: NUDGE\_TEXT });
}
}
```
```csharp C#
using Anthropic.Models.Beta.Messages;
using Messages = Anthropic.Models.Messages;
var client = new AnthropicClient();
const int NudgeTurn = 2; // inject before this assistant turn if no advisor call yet
const string NudgeText =
"You have not consulted the advisor yet. If the task has a non-obvious "
+ "design decision or a failure mode you haven't ruled out, call advisor "
+ "now before committing to an approach.";
const int MaxTurns = 10; // agent loop cap
// Replace with your tool dispatch. Returns one tool\_result block per tool\_use block.
List RunYourTools(IReadOnlyList content)
{
List results = [];
foreach (var block in content)
{
if (block.TryPickToolUse(out var toolUse))
{
results.Add(new BetaToolResultBlockParam
{
ToolUseID = toolUse.ID,
Content = "Replace with your tool output."
});
}
}
return results;
}
var tools = new BetaToolUnion[]
{
new BetaAdvisorTool20260301 { Model = Messages::Model.ClaudeFable5 }
// ... your other tools
};
var task = "Build a concurrent worker pool in Go with graceful shutdown.";
var messages = new List { new() { Role = Role.User, Content = task } };
var advisorCalled = false;
for (var turn = 1; turn <= MaxTurns; turn++)
{
var response = await client.Beta.Messages.Create(new MessageCreateParams
{
Model = Messages::Model.ClaudeHaiku4\_5,
MaxTokens = 4096,
Tools = tools,
Messages = messages,
Betas = ["advisor-tool-2026-03-01"]
});
messages.Add(new BetaMessageParam
{
Role = Role.Assistant,
Content = response.Content.Select(block => new BetaContentBlockParam(block.Json)).ToList()
});
advisorCalled =
advisorCalled
|| response.Content.Any(block =>
block.TryPickServerToolUse(out var serverToolUse)
&& serverToolUse.Name.Value() == Name.Advisor
);
if (response.StopReason == BetaStopReason.EndTurn)
{
break;
}
if (response.StopReason == BetaStopReason.PauseTurn)
{
continue; // server tool pending; re-send to let the API complete it
}
var results = RunYourTools(response.Content); // list of tool\_result blocks
if (results.Count > 0)
{
messages.Add(new BetaMessageParam { Role = Role.User, Content = results });
}
// Skip this if your system prompt already tells the model to call sparingly.
if (turn == NudgeTurn - 1 && !advisorCalled)
{
messages.Add(new BetaMessageParam { Role = Role.User, Content = NudgeText });
}
}
```
```java Java
import com.anthropic.models.beta.messages.BetaAdvisorTool20260301;
import com.anthropic.models.beta.messages.BetaContentBlock;
import com.anthropic.models.beta.messages.BetaContentBlockParam;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.BetaMessageParam;
import com.anthropic.models.beta.messages.BetaServerToolUseBlock;
import com.anthropic.models.beta.messages.BetaStopReason;
import com.anthropic.models.beta.messages.BetaToolResultBlockParam;
import com.anthropic.models.beta.messages.BetaToolUnion;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
static final int NUDGE\_TURN = 2; // inject before this assistant turn if no advisor call yet
static final String NUDGE\_TEXT =
"You have not consulted the advisor yet. If the task has a non-obvious "
+ "design decision or a failure mode you haven't ruled out, call advisor "
+ "now before committing to an approach.";
static final int MAX\_TURNS = 10; // agent loop cap
// Replace with your tool dispatch. Returns one tool\_result block per tool\_use block.
List runYourTools(List content) {
List results = new ArrayList<>();
for (BetaContentBlock block : content) {
if (block.isToolUse()) {
results.add(BetaContentBlockParam.ofToolResult(
BetaToolResultBlockParam.builder()
.toolUseId(block.asToolUse().id())
.content("Replace with your tool output.")
.build()));
}
}
return results;
}
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
List tools = List.of(
BetaToolUnion.ofAdvisorTool20260301(
BetaAdvisorTool20260301.builder().model(Model.CLAUDE\_FABLE\_5).build())
// ... your other tools
);
String task = "Build a concurrent worker pool in Go with graceful shutdown.";
List messages = new ArrayList<>();
messages.add(BetaMessageParam.builder()
.role(BetaMessageParam.Role.USER)
.content(task)
.build());
boolean advisorCalled = false;
for (int turn = 1; turn <= MAX\_TURNS; turn++) {
BetaMessage response = client.beta().messages().create(MessageCreateParams.builder()
.model(Model.CLAUDE\_HAIKU\_4\_5)
.maxTokens(4096L)
.tools(tools)
.messages(messages)
.addBeta("advisor-tool-2026-03-01")
.build());
messages.add(BetaMessageParam.builder()
.role(BetaMessageParam.Role.ASSISTANT)
.contentOfBetaContentBlockParams(
response.content().stream().map(BetaContentBlock::toParam).toList())
.build());
advisorCalled = advisorCalled
|| response.content().stream().anyMatch(block ->
block.isServerToolUse()
&& block.asServerToolUse().name().equals(BetaServerToolUseBlock.Name.ADVISOR));
BetaStopReason stopReason = response.stopReason().orElse(null);
if (BetaStopReason.END\_TURN.equals(stopReason)) {
break;
}
if (BetaStopReason.PAUSE\_TURN.equals(stopReason)) {
continue; // server tool pending; re-send to let the API complete it
}
List results = runYourTools(response.content()); // list of tool\_result blocks
if (!results.isEmpty()) {
messages.add(BetaMessageParam.builder()
.role(BetaMessageParam.Role.USER)
.contentOfBetaContentBlockParams(results)
.build());
}
// Skip this if your system prompt already tells the model to call sparingly.
if (turn == NUDGE\_TURN - 1 && !advisorCalled) {
messages.add(BetaMessageParam.builder()
.role(BetaMessageParam.Role.USER)
.content(NUDGE\_TEXT)
.build());
}
}
}
```
```php PHP
$client = new Client();
const NUDGE\_TURN = 2; // inject before this assistant turn if no advisor call yet
const NUDGE\_TEXT = "You have not consulted the advisor yet. If the task has a non-obvious "
. "design decision or a failure mode you haven't ruled out, call advisor "
. "now before committing to an approach.";
const MAX\_TURNS = 10; // agent loop cap
// Replace with your tool dispatch. Returns one tool\_result block per tool\_use block.
function runYourTools(array $content): array
{
$results = [];
foreach ($content as $block) {
if ($block->type === 'tool\_use') {
$results[] = [
'type' => 'tool\_result',
'tool\_use\_id' => $block->id,
'content' => 'Replace with your tool output.',
];
}
}
return $results;
}
$tools = [
['type' => 'advisor\_20260301', 'name' => 'advisor', 'model' => 'claude-fable-5'],
// ... your other tools
];
$task = 'Build a concurrent worker pool in Go with graceful shutdown.';
$messages = [['role' => 'user', 'content' => $task]];
$advisorCalled = false;
for ($turn = 1; $turn <= MAX\_TURNS; $turn++) {
$response = $client->beta->messages->create(
maxTokens: 4096,
messages: $messages,
model: 'claude-haiku-4-5',
tools: $tools,
betas: ['advisor-tool-2026-03-01'],
);
$messages[] = ['role' => 'assistant', 'content' => $response->content];
foreach ($response->content as $block) {
if ($block->type === 'server\_tool\_use' && $block->name === 'advisor') {
$advisorCalled = true;
}
}
if ($response->stopReason === 'end\_turn') {
break;
}
if ($response->stopReason === 'pause\_turn') {
continue; // server tool pending; re-send to let the API complete it
}
$results = runYourTools($response->content); // list of tool\_result blocks
if ($results !== []) {
$messages[] = ['role' => 'user', 'content' => $results];
}
// Skip this if your system prompt already tells the model to call sparingly.
if ($turn === NUDGE\_TURN - 1 && !$advisorCalled) {
$messages[] = ['role' => 'user', 'content' => NUDGE\_TEXT];
}
}
```
```ruby Ruby
client = Anthropic::Client.new
NUDGE\_TURN = 2 # inject before this assistant turn if no advisor call yet
NUDGE\_TEXT =
"You have not consulted the advisor yet. If the task has a non-obvious " \
"design decision or a failure mode you haven't ruled out, call advisor " \
"now before committing to an approach."
MAX\_TURNS = 10 # agent loop cap
# Replace with your tool dispatch. Returns one tool\_result block per tool\_use block.
def run\_your\_tools(content)
content.filter\_map do |block|
next unless block.type == :tool\_use
{ type: "tool\_result", tool\_use\_id: block.id, content: "Replace with your tool output." }
end
end
tools = [
{ type: "advisor\_20260301", name: "advisor", model: "claude-fable-5" }
# ... your other tools
]
task = "Build a concurrent worker pool in Go with graceful shutdown."
messages = [{ role: "user", content: task }]
advisor\_called = false
(1..MAX\_TURNS).each do |turn|
response = client.beta.messages.create(
model: "claude-haiku-4-5",
max\_tokens: 4096,
tools: tools,
messages: messages,
betas: ["advisor-tool-2026-03-01"]
)
messages << { role: "assistant", content: response.content }
advisor\_called ||= response.content.any? do |block|
block.type == :server\_tool\_use && block.name == :advisor
end
break if response.stop\_reason == :end\_turn
next if response.stop\_reason == :pause\_turn # server tool pending; re-send to let the API complete it
results = run\_your\_tools(response.content) # list of tool\_result blocks
messages << { role: "user", content: results } unless results.empty?
# Skip this if your system prompt already tells the model to call sparingly.
messages << { role: "user", content: NUDGE\_TEXT } if turn == NUDGE\_TURN - 1 && !advisor\_called
end
```
Append the nudge as its own user message after the tool results rather than as a sibling block in the same message. Consecutive user messages are valid. In Anthropic's testing on Haiku and Sonnet executors they behaved equivalently to a sibling block. The separate-message shape also keeps the reminder clearly distinct from tool output.
\*\*Trade-offs:\*\* The nudge raises the call rate, which can push trivially simple tasks into an unnecessary consult. If your workload mixes simple and complex tasks, consider raising `NUDGE\_TURN` to 3 so two-turn tasks complete before the nudge fires, or gate the nudge on a task-complexity signal you already compute. If your system prompt already contains restraint language ("reserve the advisor for genuine uncertainty"), skip the nudge entirely, because the two instructions conflict.
The plain-text nudge is highly salient on Haiku and Sonnet executors: 74 percent (Sonnet) to 98 percent (Haiku) of nudged attempts in Anthropic's testing called the advisor immediately at turn 2. If that lands before your executor has read the problem or gathered context, the resulting advisor call is low-context and can displace a better-timed later call. Measure your executor's baseline first-call turn before adding the nudge. If the executor already calls the advisor reliably and its first call typically lands at turn N, set `NUDGE\_TURN` greater than N. In Anthropic's testing, a turn-2 nudge on workloads where the baseline first call was turn 7 or later correlated with a 3 to 4 percentage-point task-performance drop. On a browse workload where the baseline call rate was 86 percent, the same nudge raised engagement with no task-performance cost.
To force a consult on a specific request instead of nudging, set `tool\_choice` to `{"type": "tool", "name": "advisor"}`, subject to the constraints in [Forcing tool use](/docs/en/agents-and-tools/tool-use/define-tools#forcing-tool-use). Forcing tool use cannot be combined with manual extended thinking (`thinking: {type: "enabled"}`): the API returns a `400 invalid\_request\_error` if you enable both. Adaptive thinking supports forced tool use.
## Streaming
The advisor sub-inference does not stream. The executor's stream pauses while the advisor runs, then the full result arrives in a single event.
The `server\_tool\_use` block with `name: "advisor"` signals that an advisor call is starting. The pause begins when that block closes (`content\_block\_stop`). During the pause, the stream is quiet except for standard SSE `ping` keepalives emitted roughly every 30 seconds. Short advisor calls might show no pings.
When the advisor finishes, the `advisor\_tool\_result` arrives fully formed in a single `content\_block\_start` event (no deltas). Executor output then resumes streaming.
A `message\_delta` event follows with the updated `usage.iterations` array reflecting the advisor's token counts.
## Usage and billing
Advisor calls run as a separate sub-inference billed at the advisor model's rates. Usage is reported in the `usage.iterations[]` array:
```json
{
"usage": {
"input\_tokens": 412,
"cache\_read\_input\_tokens": 0,
"cache\_creation\_input\_tokens": 0,
"output\_tokens": 531,
"iterations": [
{
"type": "message",
"input\_tokens": 412,
"cache\_read\_input\_tokens": 0,
"cache\_creation\_input\_tokens": 0,
"output\_tokens": 89
},
{
"type": "advisor\_message",
"model": "claude-fable-5",
"input\_tokens": 823,
"cache\_read\_input\_tokens": 0,
"cache\_creation\_input\_tokens": 0,
"output\_tokens": 1612
},
{
"type": "message",
"input\_tokens": 1348,
"cache\_read\_input\_tokens": 412,
"cache\_creation\_input\_tokens": 0,
"output\_tokens": 442
}
]
}
}
```
Top-level `usage` fields reflect executor tokens only. Advisor tokens are not rolled into the top-level totals because they are billed at a different rate. Iterations with `type: "advisor\_message"` are billed at the advisor model's rates, and iterations with `type: "message"` are billed at the executor model's rates.
The aggregation rules differ by field. Top-level `output\_tokens` is the sum of all executor iterations. Top-level `input\_tokens` and `cache\_read\_input\_tokens` reflect the first executor iteration only. Subsequent executor iterations' inputs are not re-summed because they include prior output tokens. Use `usage.iterations` for a full per-iteration breakdown when building cost-tracking logic.
Advisor output is typically 400 to 700 text tokens, or 1,400 to 1,800 tokens total including thinking. The cost savings come from the advisor not generating your full final output. The executor does that at its lower rate.
The top-level `max\_tokens` applies to executor output only. It does not bound advisor sub-inference tokens. To cap advisor output directly, set [`max\_tokens` on the tool definition](#capping-advisor-output). The advisor's tokens also do not draw from any [task budget](/docs/en/build-with-claude/task-budgets) applied to the executor.
[Priority Tier](/docs/en/api/service-tiers) applies to each model independently. A Priority Tier commitment on the executor model does not extend to the advisor. Advisor calls run at Priority Tier only if your organization also holds a commitment on the advisor model.
## Advisor prompt caching
There are two independent caching layers.
### Executor-side caching
The `advisor\_tool\_result` block is cacheable like any other content block. A `cache\_control` breakpoint placed after it on a subsequent turn hits. The executor's prompt always contains the plaintext advice regardless of whether your client received `text` or `encrypted\_content`, so caching behavior is identical for both result variants.
### Advisor-side caching
Set `caching` on the tool definition to enable prompt caching for the advisor's own transcript across calls within the same conversation:
```python
tools = [
{
"type": "advisor\_20260301",
"name": "advisor",
"model": "claude-fable-5",
"caching": {"type": "ephemeral", "ttl": "5m"},
}
]
```
The advisor's prompt on the Nth call is the (N-1)th call's prompt with one more segment appended, so the prefix is stable across calls. With `caching` enabled, each advisor call writes a cache entry, and the next call reads up to that point and pays only for the delta. You'll see `cache\_read\_input\_tokens` become non-zero on the second and later `advisor\_message` iterations.
\*\*When to enable it:\*\* The cache write costs more than the reads save when the advisor is called two or fewer times per conversation. Caching breaks even at roughly three advisor calls and improves from there. Enable it for long agent loops, and keep it off for short tasks.
\*\*Keep it consistent:\*\* Set `caching` once and leave it for the whole conversation. Toggling it off and on mid-conversation causes cache misses.
[`clear\_thinking`](/docs/en/build-with-claude/context-editing) with a `keep` value other than `"all"` shifts the advisor's quoted transcript each turn, causing advisor-side cache misses. This is a cost degradation only. Advice quality is unaffected. When extended thinking is enabled without explicit `clear\_thinking` configuration, the API defaults to `keep: {type: "thinking\_turns", value: 1}`, which triggers this behavior (the default on earlier Opus/Sonnet models and all Haiku models, whereas on Opus 4.5+ and Sonnet 4.6+ the default is to keep all turns). Set `keep: "all"` to preserve advisor cache stability.
## Combining with other tools
The advisor tool composes with other server-side and client-side tools. Add them all to the same `tools` array:
```python
tools = [
{
"type": "web\_search\_20250305",
"name": "web\_search",
"max\_uses": 5,
},
{
"type": "advisor\_20260301",
"name": "advisor",
"model": "claude-fable-5",
},
{
"name": "run\_bash",
"description": "Run a bash command",
"input\_schema": {
"type": "object",
"properties": {"command": {"type": "string"}},
},
},
]
```
The executor can search the web, call the advisor, and use your custom tools in the same turn. The advisor's plan can inform which tools the executor reaches for next.
| Feature | Interaction |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Batch processing](/docs/en/build-with-claude/batch-processing) | Supported. `usage.iterations` is reported per item. |
| [Token counting](/docs/en/build-with-claude/token-counting) | Returns the executor's first-iteration input tokens only. For a rough advisor estimate, call `count\_tokens` with `model` set to the advisor model and the same messages. |
| [Context editing](/docs/en/build-with-claude/context-editing) | `clear\_tool\_uses` is not fully compatible with advisor tool blocks. With `clear\_thinking`, see the earlier caching warning. |
| `pause\_turn` | A dangling advisor call ends the response with `stop\_reason: "pause\_turn"` and a `server\_tool\_use` block with no result when no client `tool\_use` block is awaiting your result in the same turn. The advisor runs on resumption. If the executor also called one of your tools in that turn, the response ends with `stop\_reason: "tool\_use"` instead, and the pending advisor call runs at the start of your next request, after you send the `tool\_result` blocks. See [Resuming a paused turn](#resuming-a-paused-turn), [Mixing server tools and client tools in one turn](/docs/en/agents-and-tools/tool-use/server-tools#mixing-server-tools-and-client-tools-in-one-turn), and [Server tools](/docs/en/agents-and-tools/tool-use/server-tools#the-server-side-loop-and-pause-turn). |
## Best practices
### Prompting for coding and agent tasks
The advisor tool ships with a built-in description that nudges the executor to call it near the start of complex tasks and when it hits difficulty. For research tasks, no additional prompting is typically needed.
On coding and agent tasks, the advisor produces higher intelligence at similar cost when it reduces total tool calls and conversation length. Two timings drive this improvement:
1. An early first advisor call, after a few exploratory reads are in the transcript.
2. For difficult tasks, a final advisor call after file writes and test outputs are in the transcript.
If your agent exposes other planner-like tools (for example, a todo list tool), prompt the model to call the advisor before those tools so the advisor's plan funnels into them. The [suggested system prompt](#suggested-system-prompt-for-coding-tasks) reinforces the early-call pattern. Add your own funnel-in sentence pointing at whichever planner tools your agent exposes.
#### Suggested system prompt for coding tasks
Without system-prompt steering, the executor tends to under-call the advisor in some domains, particularly coding tasks. For coding tasks where you want consistent advisor timing and around two to three calls for each task, prepend the following blocks to your executor system prompt before any other sentences that mention the advisor.
Timing guidance:
```text wrap
You have access to an `advisor` tool backed by a stronger reviewer model. It takes NO parameters — when you call advisor(), your entire conversation history is automatically forwarded. They see the task, every tool call you've made, every result you've seen.
Call advisor BEFORE substantive work — before writing, before committing to an interpretation, before building on an assumption. If the task requires orientation first (finding files, fetching a source, seeing what's there), do that, then call advisor. Orientation is not substantive work. Writing, editing, and declaring an answer are.
Also call advisor:
- When you believe the task is complete. BEFORE this call, make your deliverable durable: write the file, save the result, commit the change. The advisor call takes time; if the session ends during it, a durable result persists and an unwritten one doesn't.
- When stuck — errors recurring, approach not converging, results that don't fit.
- When considering a change of approach.
On tasks longer than a few steps, call advisor at least once before committing to an approach and once before declaring done. On short reactive tasks where the next action is dictated by tool output you just read, you don't need to keep calling — the advisor adds most of its value on the first call, before the approach crystallizes.
```
How the executor should treat the advice (place directly after the timing block):
```text wrap
Give the advice serious weight. If you follow a step and it fails empirically, or you have primary-source evidence that contradicts a specific claim (the file says X, the paper states Y), adapt. A passing self-test is not evidence the advice is wrong — it's evidence your test doesn't check what the advice is checking.
If you've already retrieved data pointing one way and the advisor points another: don't silently switch. Surface the conflict in one more advisor call — "I found X, you suggest Y, which constraint breaks the tie?" The advisor saw your evidence but may have underweighted it; a reconcile call is cheaper than committing to the wrong branch.
```
#### Alternative system prompt for Haiku on coding workloads
Claude Haiku 4.5 applies the default advisor guidance conservatively. That keeps its call rate appropriately low on research and lookup workloads but gives up quality on coding workloads, where an early advisor consult reliably pays for itself. On an internal coding benchmark, a close variant of the following block (the read-only carve-out in the Hard rule was added after measurement) raised Haiku pass rates by roughly 7.5 percentage points over the built-in default.
Use this block in place of the earlier timing and advice blocks when your Haiku executor runs predominantly coding or write-task workloads:
```text wrap
Consult a stronger reviewer who sees your full conversation transcript.
No parameters. When you call advisor(), your entire history -- task, every tool call and result, your reasoning -- is automatically forwarded. The advisor sees exactly what you've done.
Call advisor BEFORE substantive work -- before writing, before committing to an interpretation, before building on an assumption. If the task requires orientation first (finding files, fetching a source, seeing what's there), do that, then call advisor. Orientation is not substantive work. Writing, editing, and declaring an answer are.
Also call advisor:
- When you believe the task is complete. BEFORE this call, make your deliverable durable: write the file, save the result, commit the change. The advisor call takes time; if the session ends during it, a durable result persists and an unwritten one doesn't.
- When stuck -- errors recurring, approach not converging, results that don't fit.
- When considering a change of approach.
On tasks longer than a few steps, call advisor at least once before committing to an approach and once before declaring done. On short reactive tasks where the next action is dictated by tool output you just read, you don't need to keep calling -- the advisor adds most of its value on the first call, before the approach crystallizes.
Give the advice serious weight. If you follow a step and it fails empirically, or you have primary-source evidence that contradicts a specific claim (the file says X, the paper states Y), adapt. A passing self-test is not evidence the advice is wrong -- it's evidence your test doesn't check what the advice is checking.
If you've already retrieved data pointing one way and the advisor points another: don't silently switch. Surface the conflict in one more advisor call -- "I found X, you suggest Y, which constraint breaks the tie?" The advisor saw your evidence but may have underweighted it; a reconcile call is cheaper than committing to the wrong branch.
Call advisor for design, architecture, and risk questions where you won't touch a file. If your response would be analysis or a recommendation with no other tool calls, call advisor first -- that judgment call is exactly where a second opinion is highest-value.
Hard rule: your first write\_file, edit\_file, or state-changing bash call on a task must be preceded by an advisor call in the same or an earlier turn. Read-only orientation commands (ls, cat, grep, find) are not state-changing. This is a checkpoint, not a difficulty judgment. It applies to one-line edits too.
```
\*\*Caveat:\*\* On an internal browse-comprehension benchmark (n = 1,266), a close variant of this block cost roughly 4 percentage points of accuracy relative to the built-in default. If your workload mixes coding with substantial lookup or retrieval, stay with the [suggested blocks](#suggested-system-prompt-for-coding-tasks), or gate the swap on a workload-type signal you already compute.
#### Increasing advisor calls on Opus executors
Opus executors typically call the advisor at an appropriate rate without additional prompting. If your Opus executor is under-calling on your workload, add the following checkpoint to your system prompt:
```text wrap
Call advisor for design, architecture, and risk questions where you won't touch a file. If your response would be analysis or a recommendation with no other tool calls, call advisor first. That judgment call is exactly where a second opinion is highest-value. (This does not apply to simple factual lookups or arithmetic; those you answer directly.)
Hard rule: your first write\_file, edit\_file, or state-changing bash call on a task must be preceded by an advisor call in the same or an earlier turn. Read-only orientation commands (ls, cat, grep, find) are not state-changing. This is a checkpoint, not a difficulty judgment. It applies to one-line edits too.
```
\*\*Caveat:\*\* In Anthropic's testing, a close variant of this block (the read-only carve-out in the Hard rule was added after measurement) raised pass rates on under-calling tasks by roughly 7 to 10 percentage points but caused Opus to over-call on tasks whose first action needs no planning. The net effect was roughly flat on a mixed workload. Only add it if you have observed Opus skipping the advisor on tasks where a consult would have helped. Do not add it as a default.
#### Trimming advisor output length
Advisor output is the advisor's largest cost driver, and the top-level `max\_tokens` does not bound it. The advisor sees both your system prompt and your user messages as quoted context about the executor's task, so instructions that address the advisor directly are followed much more reliably than third-person descriptions. The most effective placement Anthropic tested is a line in the user message:
```text wrap
(Advisor: please keep your guidance under 80 words — I need a focused starting point, not a comprehensive plan.)
```
This line can be prefixed programmatically by your agent framework before sending the request. The limit is a soft constraint. The advisor occasionally exceeds it, so ask for roughly 80 percent of your true ceiling.
In Anthropic's testing this line also increased how often the executor consults the advisor, but the net effect was still lower total cost (more consults, each shorter).
Pair this approach with the timing guidance in [Suggested system prompt for coding tasks](#suggested-system-prompt-for-coding-tasks) (or the [alternative Haiku block](#alternative-system-prompt-for-haiku-on-coding-workloads) if you swapped it in) for the strongest cost-versus-quality tradeoff. For a hard ceiling rather than a soft request, see [Capping advisor output](#capping-advisor-output).
### Capping advisor output
Set `max\_tokens` on the tool definition to cap the advisor's total output (thinking plus text) per call:
```python
tools = [
{
"type": "advisor\_20260301",
"name": "advisor",
"model": "claude-opus-4-8",
"max\_tokens": 2048,
}
]
```
The minimum value is 1024. Setting `max\_tokens` above the advisor model's own output cap returns a 400 error. The cap applies to each advisor call independently and is not shared across calls in the same request.
This is not a hard truncation alone. The server also passes the advisor its remaining-token budget, so the advisor shapes its response to fit.
\*\*Recommended starting point:\*\* `max\_tokens: 2048`. In Anthropic's testing on a hard reasoning benchmark (n = 40 per configuration), this reduced mean advisor output by roughly 7x compared with leaving the cap unset, with near-zero truncation and no detectable quality degradation. The minimum value of 1024 reduced output roughly 10x but truncated around 10 percent of calls. Accuracy differences across all configurations were within noise at this sample size. Validate on your own workload.
| `max\_tokens` | Mean advisor output tokens | Calls truncated |
| ------------ | -------------------------- | --------------- |
| unset | \~4,200 to 5,900 | n/a |
| 2048 | \~630 to 840 | \~0% |
| 1024 | \~370 to 480 | \~10% |
Hard reasoning tasks elicit substantially longer advisor output than the [typical 1,400 to 1,800 tokens](#usage-and-billing) quoted earlier for lighter workloads. Use this table to size the savings ratio, not as a universal baseline for advisor output.
When the advisor does hit the cap, the result block carries `stop\_reason: "max\_tokens"`. The API also appends `[Advisor output truncated at max\_tokens=2048.]` (naming your cap) to the advice text, so the executor sees the truncation in its own context. Use `stop\_reason` to detect truncated advice and decide whether to raise the cap or let the executor proceed with partial guidance. Both signals appear only when you set `max\_tokens` on the tool definition.
```json
{
"type": "advisor\_tool\_result",
"tool\_use\_id": "srvtoolu\_abc123",
"content": {
"type": "advisor\_result",
"text": "Use a channel-based coordination pattern. The tricky part is\n\n[Advisor output truncated at max\_tokens=2048.]",
"stop\_reason": "max\_tokens"
}
}
```
Check `output\_tokens` on the corresponding `advisor\_message` entry in `usage.iterations` to see how close each call came to its cap.
Compared with the [prompt-based approach](#trimming-advisor-output-length), `max\_tokens` is a hard ceiling rather than a soft request. Use `max\_tokens` when you need a guaranteed bound for cost or latency. Use the prompt-based approach (or both together) when you want to bias toward brevity without risking a mid-thought cut.
### Pairing with effort settings
For coding tasks, pairing a Sonnet executor at medium [effort](/docs/en/build-with-claude/effort) with an Opus advisor achieves intelligence comparable to Sonnet at default effort, at lower cost. For maximum intelligence, keep the executor at default effort.
### Cost control
\* For conversation-level budgets, count advisor calls client-side. When you reach your cap, remove the advisor tool from `tools` \*\*and\*\* strip all `advisor\_tool\_result` blocks from your message history to avoid a `400 invalid\_request\_error` (see the note in [Multi-turn conversations](#multi-turn-conversations)).
\* Enable `caching` only for conversations where you expect three or more advisor calls.
## Model compatibility
The executor model (the top-level `model` field) and the advisor model (the `model` field inside the tool definition) must form a valid pair. The advisor must be Claude Sonnet 4.6 or a more capable model, and it must be at least as capable as the executor. Models of equal capability (for example, Claude Opus 4.7 and Claude Opus 4.8) can advise each other.
| Executor models | Advisor models |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Haiku 4.5 (claude-haiku-4-5) | Claude Fable 5 (claude-fable-5) Claude Mythos 5 (claude-mythos-5) Claude Opus 5 (claude-opus-5) Claude Opus 4.8 (claude-opus-4-8) Claude Opus 4.7 (claude-opus-4-7) Claude Opus 4.6 (claude-opus-4-6) Claude Sonnet 4.6 (claude-sonnet-4-6) |
| Claude Sonnet 4.6 (claude-sonnet-4-6) | Claude Fable 5 (claude-fable-5) Claude Mythos 5 (claude-mythos-5) Claude Opus 5 (claude-opus-5) Claude Opus 4.8 (claude-opus-4-8) Claude Opus 4.7 (claude-opus-4-7) Claude Opus 4.6 (claude-opus-4-6) Claude Sonnet 4.6 (claude-sonnet-4-6) |
| Claude Sonnet 5 (claude-sonnet-5) | Claude Fable 5 (claude-fable-5) Claude Mythos 5 (claude-mythos-5) Claude Opus 5 (claude-opus-5) Claude Opus 4.8 (claude-opus-4-8) Claude Opus 4.7 (claude-opus-4-7) |
| Claude Opus 4.6 (claude-opus-4-6) | Claude Fable 5 (claude-fable-5) Claude Mythos 5 (claude-mythos-5) Claude Opus 5 (claude-opus-5) Claude Opus 4.8 (claude-opus-4-8) Claude Opus 4.7 (claude-opus-4-7) Claude Opus 4.6 (claude-opus-4-6) |
| Claude Opus 4.7 (claude-opus-4-7) | Claude Fable 5 (claude-fable-5) Claude Mythos 5 (claude-mythos-5) Claude Opus 5 (claude-opus-5) Claude Opus 4.8 (claude-opus-4-8) Claude Opus 4.7 (claude-opus-4-7) |
| Claude Opus 4.8 (claude-opus-4-8) | Claude Fable 5 (claude-fable-5) Claude Mythos 5 (claude-mythos-5) Claude Opus 5 (claude-opus-5) Claude Opus 4.8 (claude-opus-4-8) Claude Opus 4.7 (claude-opus-4-7) |
| Claude Opus 5 (claude-opus-5) | Claude Fable 5 (claude-fable-5) Claude Mythos 5 (claude-mythos-5) Claude Opus 5 (claude-opus-5) |
| Claude Fable 5 (claude-fable-5) | Claude Fable 5 (claude-fable-5) Claude Opus 5 (claude-opus-5) |
| Claude Mythos 5 (claude-mythos-5) | Claude Mythos 5 (claude-mythos-5) Claude Opus 5 (claude-opus-5) |
If you request an invalid pair, the API returns a `400 invalid\_request\_error` naming the unsupported combination.
### Platform availability
The advisor tool is available in beta on the Claude API and on [Claude Platform on AWS](/docs/en/build-with-claude/claude-platform-on-aws). It is not currently available on Amazon Bedrock, Google Cloud, or Microsoft Foundry.
## Next steps

Store and retrieve information across conversations with a client-side memory directory.

Work with Anthropic-executed tools: server\\_tool\\_use blocks, pause\\_turn continuation, and domain filtering.

Directory of Anthropic-provided tools and reference for optional tool definition properties.

Control how many tokens Claude uses when responding with the effort parameter, trading off between response thoroughness and token efficiency.
