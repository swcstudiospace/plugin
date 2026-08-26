# Task budgets

Source: https://platform.claude.com/docs/en/build-with-claude/task-budgets.md

# Task budgets
Give Claude an advisory token budget for the full agentic loop to help the model self-regulate on long agentic tasks.
---
Task budgets let you tell Claude how many tokens it has for a full agentic loop, including thinking, tool calls, tool results, and output. The model sees a running countdown and uses it to prioritize work and finish gracefully as the budget is consumed.
Task budgets are in beta on Claude Opus 5, Claude Fable 5, Claude Mythos 5, Claude Opus 4.8, and Claude Opus 4.7. Set the `task-budgets-2026-03-13` beta header to opt in.
## When to use task budgets
Task budgets work best for agentic workflows where Claude makes multiple tool calls and decisions before finalizing its output to await the next human response. Use them when:
\* You want Claude to self-regulate token spend on long-horizon tasks.
\* You have a predictable per-task cost or latency ceiling to enforce.
\* You want the model to finish gracefully (summarize findings, report progress) as it approaches the budget rather than cutting off mid-action.
Task budgets complement the [effort parameter](/docs/en/build-with-claude/effort): effort controls how thoroughly Claude reasons about each step, while task budgets cap the total work Claude can do across an agentic loop.
## Setting a task budget
Add `task\_budget` to `output\_config` and include the beta header:
```bash cURL
curl https://api.anthropic.com/v1/messages \
-N \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: task-budgets-2026-03-13" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 128000,
"stream": true,
"messages": [{
"role": "user",
"content": "Review the codebase and propose a refactor plan."
}],
"output\_config": {
"effort": "high",
"task\_budget": {"type": "tokens", "total": 64000}
}
}'
```
```bash CLI
ant beta:messages create --beta task-budgets-2026-03-13 \
--stream --format jsonl <<'YAML' | jq 'select(.type == "message\_delta").usage'
model: claude-opus-5
max\_tokens: 128000
messages:
- role: user
content: Review the codebase and propose a refactor plan.
output\_config:
effort: high
task\_budget:
type: tokens
total: 64000
YAML
```
```python Python
client = anthropic.Anthropic()
with client.beta.messages.stream(
model="claude-opus-5",
max\_tokens=128000,
output\_config={
"effort": "high",
"task\_budget": {"type": "tokens", "total": 64000},
},
messages=[
{"role": "user", "content": "Review the codebase and propose a refactor plan."}
],
betas=["task-budgets-2026-03-13"],
) as stream:
response = stream.get\_final\_message()
print(response.usage)
```
```typescript TypeScript
const client = new Anthropic();
const stream = client.beta.messages.stream({
model: "claude-opus-5",
max\_tokens: 128000,
output\_config: {
effort: "high",
task\_budget: { type: "tokens", total: 64000 }
},
messages: [{ role: "user", content: "Review the codebase and propose a refactor plan." }],
betas: ["task-budgets-2026-03-13"]
});
const response = await stream.finalMessage();
console.log(response.usage);
```
```csharp C#
var client = new AnthropicClient();
var responseUpdates = client.Beta.Messages.CreateStreaming(new MessageCreateParams
{
Model = Messages::Model.ClaudeOpus5,
MaxTokens = 128000,
Messages = [new() { Role = Role.User, Content = "Review the codebase and propose a refactor plan." }],
OutputConfig = new BetaOutputConfig
{
Effort = Effort.High,
TaskBudget = new BetaTokenTaskBudget { Total = 64000 },
},
Betas = ["task-budgets-2026-03-13"],
});
var response = await responseUpdates.Aggregate();
Console.WriteLine(response.Usage);
```
```go Go
client := anthropic.NewClient()
stream := client.Beta.Messages.NewStreaming(context.TODO(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 128000,
Betas: []anthropic.AnthropicBeta{"task-budgets-2026-03-13"},
Messages: []anthropic.BetaMessageParam{{
Role: anthropic.BetaMessageParamRoleUser,
Content: []anthropic.BetaContentBlockParamUnion{{
OfText: &anthropic.BetaTextBlockParam{Text: "Review the codebase and propose a refactor plan."},
}},
}},
OutputConfig: anthropic.BetaOutputConfigParam{
Effort: anthropic.BetaOutputConfigEffortHigh,
TaskBudget: anthropic.BetaTokenTaskBudgetParam{
Total: 64000,
},
},
})
message := anthropic.BetaMessage{}
for stream.Next() {
event := stream.Current()
if err := message.Accumulate(event); err != nil {
panic(err)
}
}
if stream.Err() != nil {
panic(stream.Err())
}
fmt.Printf("Usage: input\_tokens=%d, output\_tokens=%d\n", message.Usage.InputTokens, message.Usage.OutputTokens)
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(128000L)
.addUserMessage("Review the codebase and propose a refactor plan.")
.outputConfig(BetaOutputConfig.builder()
.effort(BetaOutputConfig.Effort.HIGH)
.taskBudget(BetaTokenTaskBudget.builder().total(64000L).build())
.build())
.addBeta("task-budgets-2026-03-13")
.build();
BetaMessageAccumulator accumulator = BetaMessageAccumulator.create();
try (StreamResponse stream =
client.beta().messages().createStreaming(params)) {
stream.stream().forEach(accumulator::accumulate);
}
BetaMessage response = accumulator.message();
IO.println(response.usage());
```
```php PHP
use Anthropic\Beta\Messages\BetaRawMessageDeltaEvent;
$client = new Client();
$stream = $client->beta->messages->createStream(
model: 'claude-opus-5',
maxTokens: 128000,
messages: [
['role' => 'user', 'content' => 'Review the codebase and propose a refactor plan.'],
],
outputConfig: [
'effort' => 'high',
'taskBudget' => ['type' => 'tokens', 'total' => 64000],
],
betas: ['task-budgets-2026-03-13'],
);
// The final message\_delta event carries the cumulative token usage for the request.
$usage = null;
foreach ($stream as $event) {
if ($event instanceof BetaRawMessageDeltaEvent) {
$usage = $event->usage;
}
}
echo $usage;
```
```ruby Ruby
client = Anthropic::Client.new
stream = client.beta.messages.stream(
model: "claude-opus-5",
max\_tokens: 128\_000,
messages: [
{ role: "user", content: "Review the codebase and propose a refactor plan." }
],
output\_config: {
effort: :high,
task\_budget: { type: :tokens, total: 64\_000 }
},
betas: ["task-budgets-2026-03-13"]
)
response = stream.accumulated\_message
puts response.usage
```
The `task\_budget` object has three fields:
\* `type`: always `"tokens"`.
\* `total`: the number of tokens Claude can spend across the agentic loop, including thinking, tool calls, tool results, and output.
\* `remaining` (optional): the budget remainder carried over from a prior request. Defaults to `total` when omitted.
## How the budget countdown works
Claude sees a budget-countdown marker injected server-side throughout the conversation. The marker shows how many tokens remain in the current agentic loop and updates as the model generates thinking, tool calls, and output, and as it processes tool results. Claude uses this signal to pace itself and finish gracefully as the budget is consumed.
\*\*The countdown is visible only to the model.\*\* API responses do not include a remaining-budget field: there is no `task\_budget` information in the response `usage` object, and SDKs have no accessor for it. To track spend client-side, sum token usage across the requests in your loop as shown in [Measure your current usage](#measure-your-current-usage), or pass your own figure forward with `remaining` when [carrying a budget across compaction](#carrying-a-budget-across-compaction-with-remaining).

\*\*The countdown reflects tokens Claude has processed in the current agentic loop, not tokens you resend between turns.\*\* If your client sends the full conversation history on every follow-up request, your client-side token count may differ from the budget Claude is tracking. If you also decrement `remaining` while resending full history, the model sees an under-reported budget and the countdown drops faster than it should, causing Claude to wrap up earlier than the budget actually allows. Set a generous budget and let the model self-regulate against the countdown rather than trying to mirror it client-side.
### Worked example: budget counting across turns
The task budget counts what Claude \*\*sees\*\* (thinking, tool calls and results, and text), not what's in your request payload. In an agentic loop your client resends the full conversation on every request, so the payload grows turn over turn, but the budget only decrements by the tokens Claude sees this turn.
Consider a loop with `task\_budget: {type: "tokens", total: 100000}` and a single `bash` tool.
\*\*Turn 1.\*\* You send the initial request:
```json
{
"messages": [
{ "role": "user", "content": "Audit this repo for security issues and report findings." }
]
}
```
Claude thinks, then emits a tool call and stops with `stop\_reason: "tool\_use"`:
```json
{
"role": "assistant",
"content": [
{
"type": "thinking",
"thinking": "I'll start by listing dependencies to look for known-vulnerable packages..."
},
{
"type": "tool\_use",
"id": "toolu\_01",
"name": "bash",
"input": { "command": "cat package.json && npm audit --json" }
}
]
}
```
Suppose this assistant turn (thinking plus the tool call) totals 5,000 generated tokens. The countdown Claude saw during generation ended near `remaining` ≈ 95,000.
\*\*Turn 2.\*\* Your client runs the tool, then resends the full history with the tool result appended:
```json
{
"messages": [
{ "role": "user", "content": "Audit this repo for security issues and report findings." },
{
"role": "assistant",
"content": [
{ "type": "thinking", "thinking": "I'll start by listing dependencies..." },
{
"type": "tool\_use",
"id": "toolu\_01",
"name": "bash",
"input": { "command": "cat package.json && npm audit --json" }
}
]
},
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01",
"content": "<2,800 tokens of npm audit output>"
}
]
}
]
}
```
The resent turn-1 user and assistant messages are not counted again, but the 2,800-token tool result is new content Claude sees this turn and counts against the budget. Claude spends another 4,000 tokens on thinking and a second tool call (`grep -rn "eval(" src/`). The countdown ends near `remaining` ≈ 88,200.
\*\*Turn 3.\*\* Full history resent again with the second tool result (1,200 tokens of grep output) appended. Claude writes a 6,000-token final findings report and stops with `stop\_reason: "end\_turn"`. `remaining` ≈ 81,000.
Putting the three turns side by side makes the distinction between payload size and budget spend explicit:
| Turn | Request payload (approx. input tokens you sent) | Tokens counted against budget this turn | Budget `remaining` after |
| --------- | ----------------------------------------------- | --------------------------------------------------------- | ------------------------ |
| 1 | \~20 | 5,000 (thinking + `tool\_use`) | \~95,000 |
| 2 | \~7,800 (turn 1 history + tool result) | 6,800 (2,800 tool result + 4,000 thinking and `tool\_use`) | \~88,200 |
| 3 | \~13,000 (full history + second tool result) | 7,200 (1,200 tool result + 6,000 `text`) | \~81,000 |
| \*\*Total\*\* | \*\*\~20,820 sent across requests\*\* | \*\*19,000 counted against budget\*\* | N/A |
Your client sent the turn-1 user message three times and the turn-1 assistant message twice, but each was counted once. The budget spent 19,000 of 100,000 tokens, even though the cumulative payload your client transmitted was larger and the prompt-cached input on turns 2 and 3 was larger still.
### Carrying a budget across compaction with `remaining`
If your agentic loop compacts or rewrites context between requests (for example, by summarizing earlier turns), the server has no memory of how much budget was spent before compaction. Pass `remaining` on the next request so the countdown continues from where you left off rather than resetting to `total`:
```python Python
# Tokens spent before compaction, tracked client-side
tokens\_spent\_so\_far = 45000
output\_config = {
"effort": "high",
"task\_budget": {
"type": "tokens",
"total": 128000,
"remaining": 128000 - tokens\_spent\_so\_far,
},
}
```
```typescript TypeScript
// Tokens spent before compaction, tracked client-side
const tokensSpentSoFar = 45000;
const outputConfig = {
effort: "high",
task\_budget: {
type: "tokens",
total: 128000,
remaining: 128000 - tokensSpentSoFar
}
};
```
```csharp C#
// Tokens spent before compaction, tracked client-side
var tokensSpentSoFar = 45000;
var outputConfig = new BetaOutputConfig
{
Effort = Effort.High,
TaskBudget = new BetaTokenTaskBudget
{
Total = 128000,
Remaining = 128000 - tokensSpentSoFar,
},
};
```
```go Go
// Tokens spent before compaction, tracked client-side
tokensSpentSoFar := int64(45000)
outputConfig := anthropic.BetaOutputConfigParam{
Effort: anthropic.BetaOutputConfigEffortHigh,
TaskBudget: anthropic.BetaTokenTaskBudgetParam{
Total: 128000,
Remaining: anthropic.Int(128000 - tokensSpentSoFar),
},
}
```
```java Java
// Tokens spent before compaction, tracked client-side
long tokensSpentSoFar = 45000;
BetaOutputConfig outputConfig = BetaOutputConfig.builder()
.effort(BetaOutputConfig.Effort.HIGH)
.taskBudget(BetaTokenTaskBudget.builder()
.total(128000L)
.remaining(128000L - tokensSpentSoFar)
.build())
.build();
```
```php PHP
// Tokens spent before compaction, tracked client-side
$tokensSpentSoFar = 45000;
$outputConfig = [
'effort' => 'high',
'taskBudget' => [
'type' => 'tokens',
'total' => 128000,
'remaining' => 128000 - $tokensSpentSoFar,
],
];
```
```ruby Ruby
# Tokens spent before compaction, tracked client-side
tokens\_spent\_so\_far = 45\_000
output\_config = {
effort: :high,
task\_budget: {
type: :tokens,
total: 128\_000,
remaining: 128\_000 - tokens\_spent\_so\_far
}
}
```
For loops that resend the full uncompacted history on every turn, omit `remaining` and let the server track the countdown.
## Changing the budget mid-conversation
`task\_budget` is a request-level setting. To change the budget partway through a task, for example to extend it when the user broadens the request, set a new `task\_budget` in `output\_config` on the next request. Keep the caching consequence in mind: the budget value participates in the rendered prompt, so a changed value does not match cache entries created under the old one (see [Feature support](#feature-support) below).
## Task budgets are advisory, not enforced
Task budgets are a \*\*soft hint, not a hard cap\*\*. Claude may occasionally exceed the budget if it is in the middle of an action that would be more disruptive to interrupt than to finish. The enforced limit on total output tokens is still `max\_tokens`, which truncates the response with `stop\_reason: "max\_tokens"` when reached.
For a hard cap on cost or latency, combine task budgets with a reasonable `max\_tokens` value:
\* Use `task\_budget` to give Claude a target to pace against.
\* Use `max\_tokens` as the absolute ceiling that prevents runaway generation.
Because `task\_budget` spans the full agentic loop (potentially many requests) while `max\_tokens` caps each individual request, the two values are independent; one is not required to be at or below the other.
\*\*A budget that is too small for the task can cause refusal-like behavior.\*\* When Claude sees a budget that is clearly insufficient for the work being asked (for example, a 20,000-token budget for a multihour agentic coding task), it may decline to attempt the task at all, scope it down aggressively, or stop early with a partial result rather than start work it cannot finish. If you observe unexpected refusals or premature stops after setting a budget, raise the budget before debugging other parameters. Size budgets against your actual task-length distribution rather than a fixed default; see [Choosing a budget](#choosing-a-budget).
## Choosing a budget
The right budget depends on how much work your agentic loop currently does. Rather than guessing, measure your existing token usage first and then tune from there.
### Measure your current usage
Run a representative sample of tasks \*\*without\*\* `task\_budget` set and record the total tokens Claude spends per task. For an agentic loop, sum `usage.output\_tokens` across every request in the loop, plus the tokens of the tool results you append between requests:
```bash CLI
ant messages create --transform 'usage.output\_tokens' <<'YAML'
model: claude-opus-5
max\_tokens: 4096
messages:
- role: user
content: Review the codebase and propose a refactor plan.
YAML
```
```python Python
client = anthropic.Anthropic()
response = client.messages.create(
model="claude-opus-5",
max\_tokens=4096,
messages=[
{"role": "user", "content": "Review the codebase and propose a refactor plan."}
],
)
# Sum output\_tokens (text + thinking + tool calls) across every request in your loop.
print(response.usage.output\_tokens)
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.messages.create({
model: "claude-opus-5",
max\_tokens: 4096,
messages: [{ role: "user", content: "Review the codebase and propose a refactor plan." }]
});
// Sum output\_tokens (text + thinking + tool calls) across every request in your loop.
console.log(response.usage.output\_tokens);
```
```csharp C#
var client = new AnthropicClient();
var response = await client.Messages.Create(new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 4096,
Messages = [new() { Role = Role.User, Content = "Review the codebase and propose a refactor plan." }],
});
// Sum OutputTokens (text + thinking + tool calls) across every request in your loop.
Console.WriteLine(response.Usage.OutputTokens);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 4096,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("Review the codebase and propose a refactor plan.")),
},
})
if err != nil {
log.Fatal(err)
}
// Sum OutputTokens (text + thinking + tool calls) across every request in your loop.
fmt.Println(response.Usage.OutputTokens)
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addUserMessage("Review the codebase and propose a refactor plan.")
.build();
Message response = client.messages().create(params);
// Sum outputTokens (text + thinking + tool calls) across every request in your loop.
IO.println(response.usage().outputTokens());
```
```php PHP
$client = new Client();
$response = $client->messages->create(
model: 'claude-opus-5',
maxTokens: 4096,
messages: [
['role' => 'user', 'content' => 'Review the codebase and propose a refactor plan.'],
],
);
// Sum outputTokens (text + thinking + tool calls) across every request in your loop.
echo $response->usage->outputTokens . "\n";
```
```ruby Ruby
client = Anthropic::Client.new
response = client.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
messages: [
{ role: "user", content: "Review the codebase and propose a refactor plan." }
]
)
# Sum output\_tokens (text + thinking + tool calls) across every request in your loop.
puts response.usage.output\_tokens
```
Run this across a representative set of tasks and record the distribution. Start with the p99 of your per-task token spend to understand how providing the model with a task budget might modify the model's behavior, then test up or down as needed.
The minimum accepted `task\_budget.total` is model-specific; on every model that currently supports task budgets (see [Feature support](#feature-support)) it is \*\*20,000 tokens\*\*, and values below the minimum return a 400 error.
## Interaction with other parameters
\* \*\*`max\_tokens`:\*\* Orthogonal to task budgets. `max\_tokens` is a hard per-request cap on generated tokens, while `task\_budget` is an advisory cap across the full agentic loop (potentially spanning many requests). At `xhigh` or `max` effort, set `max\_tokens` to at least 64k to give Claude room to think and act on each request.
\* \*\*[Effort](/docs/en/build-with-claude/effort):\*\* Effort controls how deeply Claude reasons per step. Task budgets control how much total work Claude does across an agentic loop. The two are complementary: effort tunes depth, task budgets tune breadth.
\* \*\*[Adaptive thinking](/docs/en/build-with-claude/thinking):\*\* Task budgets include thinking tokens in the count, so adaptive thinking naturally scales down as the budget depletes.
\* \*\*[Prompt caching](/docs/en/build-with-claude/prompt-caching):\*\* The budget-countdown marker is injected server-side per turn, so it does not match across requests. If your client decrements `task\_budget.remaining` on each follow-up request, the changed value invalidates any cache prefix that contains it. To preserve caching, set the budget once on the initial request and let the model self-regulate against the server-side countdown rather than mutating the budget client-side.
## Feature support
| Model | Support |
| ----------------- | ------------------------------------------- |
| Claude Opus 5 | Beta (set `task-budgets-2026-03-13` header) |
| Claude Fable 5 | Beta (set `task-budgets-2026-03-13` header) |
| Claude Mythos 5 | Beta (set `task-budgets-2026-03-13` header) |
| Claude Sonnet 5 | Not supported |
| Claude Opus 4.8 | Beta (set `task-budgets-2026-03-13` header) |
| Claude Opus 4.7 | Beta (set `task-budgets-2026-03-13` header) |
| Claude Opus 4.6 | Not supported |
| Claude Sonnet 4.6 | Not supported |
| Claude Haiku 4.5 | Not supported |
Task budgets are not supported on [Claude Code](https://code.claude.com/docs/en/overview) or Cowork surfaces. Use task budgets directly through the Messages API on a [supported model](#feature-support).
## Next steps

Control how thoroughly Claude reasons about each step of an agentic loop.

Let Claude decide when and how much to use extended thinking.

Manage context in long-running conversations with server-side compaction.

Reduce cost and latency on repeated prompts by caching prompt prefixes.
