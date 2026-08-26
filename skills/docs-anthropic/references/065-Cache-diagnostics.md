# Cache diagnostics

Source: https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics.md

# Cache diagnostics
Diagnose unexpected prompt cache misses by comparing consecutive requests and identifying exactly where the prompt prefix diverged.
---
For how zero data retention (ZDR) applies to this feature, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
[Prompt caching](/docs/en/build-with-claude/prompt-caching) cuts latency and cost significantly, but only when the beginning of your prompt is byte-for-byte identical to a recent request. A reordered tool, a timestamp interpolated into your system prompt, or an edit to an earlier message can silently invalidate the cache. Without cache diagnostics, the only signal is `usage.cache\_read\_input\_tokens` dropping to zero, with no indication of what changed.
Cache diagnostics closes that gap. Pass the `id` of your previous response, and the API compares the two requests and tells you where they diverged (the model, the system prompt, the tools, or the message history) so you can fix the root cause instead of guessing.
Cache diagnostics is in beta. Include the [beta header](/docs/en/api/beta-headers) `cache-diagnosis-2026-04-07` in your API requests to use this feature.
Cache diagnostics is currently available on the Claude API only. It is not supported on Amazon Bedrock or Google Cloud.
## How cache diagnostics works
When the beta header is present, the API stores a lightweight fingerprint of each request, keyed by the response `id`. On your next request, include that `id` as `diagnostics.previous\_message\_id`. The API rebuilds the fingerprint for the new request, compares it against the stored one, and attaches a `diagnostics` object to the response describing the first point of divergence.
The comparison is about request structure, independent of whether the cache actually hit. See [Reading diagnostics alongside usage](#reading-diagnostics-alongside-usage) for how to combine the `diagnostics` result with `usage.cache\_read\_input\_tokens`.
Fingerprints contain only hashes and token-count estimates (never raw prompt content), are retained for a limited time, are scoped to your organization and workspace, and are not used for any other purpose.
## Basic usage
Send the beta header on every turn. On the first turn, pass `"previous\_message\_id": null` to opt in without a prior message to compare against. On subsequent turns, pass the `id` from the previous response.
```bash cURL
# Turn 1: establish the cache and opt in to diagnostics
response=$(curl -sS --fail-with-body https://api.anthropic.com/v1/messages \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "anthropic-beta: cache-diagnosis-2026-04-07" \
--header "content-type: application/json" \
--data '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"cache\_control": {"type": "ephemeral"},
"system": "You are an AI assistant analyzing a large document. ...",
"messages": [{"role": "user", "content": "Summarize section 1."}],
"diagnostics": {"previous\_message\_id": null}
}')
jq '{id, diagnostics}' <<< "$response"
message\_id=$(jq -r '.id' <<< "$response")
# Turn 2: reference the previous turn so the API can compare prefixes
curl -sS --fail-with-body https://api.anthropic.com/v1/messages \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "anthropic-beta: cache-diagnosis-2026-04-07" \
--header "content-type: application/json" \
--data @- <...",
"messages": [
{"role": "user", "content": "Summarize section 1."},
{"role": "assistant", "content": "Section 1 covers..."},
{"role": "user", "content": "Now summarize section 2."}
],
"diagnostics": {"previous\_message\_id": "$message\_id"}
}
EOF
```
```bash CLI
# Turn 1
turn1=$(ant beta:messages create \
--beta cache-diagnosis-2026-04-07 \
--transform '{id,usage,diagnostics}' <<'YAML'
model: claude-opus-5
max\_tokens: 1024
cache\_control:
type: ephemeral
system: "You are an AI assistant analyzing a large document. ..."
messages:
- role: user
content: Summarize section 1.
diagnostics:
previous\_message\_id: null
YAML
)
printf '%s\n' "$turn1"
# Turn 2: pass the id from turn 1 as previous\_message\_id
message\_id=$(jq -r '.id' <<<"$turn1")
ant beta:messages create \
--beta cache-diagnosis-2026-04-07 \
--transform '{id,usage,diagnostics}' <..."
messages:
- role: user
content: Summarize section 1.
- role: assistant
content: Section 1 covers...
- role: user
content: Now summarize section 2.
diagnostics:
previous\_message\_id: $message\_id
YAML
```
```python Python
client = anthropic.Anthropic()
SYSTEM = "You are an AI assistant analyzing a large document. ..."
# Turn 1: opt in with previous\_message\_id=None
r1 = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=1024,
cache\_control={"type": "ephemeral"},
system=SYSTEM,
messages=[{"role": "user", "content": "Summarize section 1."}],
diagnostics={"previous\_message\_id": None},
betas=["cache-diagnosis-2026-04-07"],
)
# Turn 2: reference the previous response id
r2 = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=1024,
cache\_control={"type": "ephemeral"},
system=SYSTEM,
messages=[
{"role": "user", "content": "Summarize section 1."},
{"role": "assistant", "content": r1.content},
{"role": "user", "content": "Now summarize section 2."},
],
diagnostics={"previous\_message\_id": r1.id},
betas=["cache-diagnosis-2026-04-07"],
)
diagnostics = r2.diagnostics
if diagnostics is None:
print("No divergence detected.")
elif diagnostics.cache\_miss\_reason is None:
print("Comparison still pending.")
else:
print(f"cache\_miss\_reason: {diagnostics.cache\_miss\_reason.type}")
```
```typescript TypeScript
const client = new Anthropic();
const SYSTEM = "You are an AI assistant analyzing a large document. ...";
// Turn 1: opt in with previous\_message\_id: null
const r1 = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
cache\_control: { type: "ephemeral" },
system: SYSTEM,
messages: [{ role: "user", content: "Summarize section 1." }],
diagnostics: { previous\_message\_id: null },
betas: ["cache-diagnosis-2026-04-07"]
});
// Turn 2: reference the previous response id
const r2 = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
cache\_control: { type: "ephemeral" },
system: SYSTEM,
messages: [
{ role: "user", content: "Summarize section 1." },
{ role: "assistant", content: r1.content },
{ role: "user", content: "Now summarize section 2." }
],
diagnostics: { previous\_message\_id: r1.id },
betas: ["cache-diagnosis-2026-04-07"]
});
if (r2.diagnostics === null) {
console.log("No divergence detected.");
} else if (r2.diagnostics.cache\_miss\_reason === null) {
console.log("Comparison still pending.");
} else {
console.log(`cache\_miss\_reason: ${r2.diagnostics.cache\_miss\_reason.type}`);
}
```
```csharp C#
AnthropicClient client = new();
var system = "You are an AI assistant analyzing a large document. ...";
var r1 = await client.Beta.Messages.Create(
new()
{
Model = Messages::Model.ClaudeOpus5,
MaxTokens = 1024,
CacheControl = new(),
System = system,
Messages =
[
new() { Role = Role.User, Content = "Summarize section 1." },
],
Diagnostics = new() { PreviousMessageID = null },
Betas = [AnthropicBeta.CacheDiagnosis2026\_04\_07],
}
);
var r2 = await client.Beta.Messages.Create(
new()
{
Model = Messages::Model.ClaudeOpus5,
MaxTokens = 1024,
CacheControl = new(),
System = system,
Messages =
[
new() { Role = Role.User, Content = "Summarize section 1." },
new()
{
Role = Role.Assistant,
Content = r1.Content.Select(block => new BetaContentBlockParam(block.Json)).ToList(),
},
new() { Role = Role.User, Content = "Now summarize section 2." },
],
Diagnostics = new() { PreviousMessageID = r1.ID },
Betas = [AnthropicBeta.CacheDiagnosis2026\_04\_07],
}
);
Console.WriteLine(r2.Diagnostics switch
{
null => "No divergence detected.",
{ CacheMissReason: null } => "Comparison still pending.",
{ CacheMissReason.Type: var type } => $"cache\_miss\_reason: {type.GetString()}",
});
```
```go Go
client := anthropic.NewClient()
ctx := context.Background()
system := []anthropic.BetaTextBlockParam{
{Text: "You are an AI assistant analyzing a large document. ..."},
}
r1, err := client.Beta.Messages.New(ctx, anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
CacheControl: anthropic.BetaCacheControlEphemeralParam{},
System: system,
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Summarize section 1.")),
},
Diagnostics: anthropic.BetaDiagnosticsParam{
PreviousMessageID: param.Null[string](),
},
Betas: []anthropic.AnthropicBeta{anthropic.AnthropicBetaCacheDiagnosis2026\_04\_07},
})
if err != nil {
panic(err)
}
r2, err := client.Beta.Messages.New(ctx, anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
CacheControl: anthropic.BetaCacheControlEphemeralParam{},
System: system,
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Summarize section 1.")),
r1.ToParam(),
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Now summarize section 2.")),
},
Diagnostics: anthropic.BetaDiagnosticsParam{
PreviousMessageID: anthropic.String(r1.ID),
},
Betas: []anthropic.AnthropicBeta{anthropic.AnthropicBetaCacheDiagnosis2026\_04\_07},
})
if err != nil {
panic(err)
}
switch {
case !r2.JSON.Diagnostics.Valid():
fmt.Println("No divergence detected.")
case !r2.Diagnostics.JSON.CacheMissReason.Valid():
fmt.Println("Comparison still pending.")
default:
fmt.Printf("cache\_miss\_reason: %s\n", r2.Diagnostics.CacheMissReason.Type)
}
```
```java Java
var client = AnthropicOkHttpClient.fromEnv();
var system = "You are an AI assistant analyzing a large document. ...";
var r1 = client.beta().messages().create(
MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024)
.cacheControl(BetaCacheControlEphemeral.builder().build())
.system(system)
.addUserMessage("Summarize section 1.")
// Pass null on the first turn to opt in without a prior message to compare.
.diagnostics(BetaDiagnosticsParam.builder().previousMessageId((String) null).build())
.addBeta(AnthropicBeta.CACHE\_DIAGNOSIS\_2026\_04\_07)
.build()
);
var r2 = client.beta().messages().create(
MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024)
.cacheControl(BetaCacheControlEphemeral.builder().build())
.system(system)
.addUserMessage("Summarize section 1.")
.addMessage(r1)
.addUserMessage("Now summarize section 2.")
.diagnostics(BetaDiagnosticsParam.builder().previousMessageId(r1.id()).build())
.addBeta(AnthropicBeta.CACHE\_DIAGNOSIS\_2026\_04\_07)
.build()
);
if (r2.diagnostics().isEmpty()) {
IO.println("No divergence detected.");
} else if (r2.diagnostics().get().cacheMissReason().isEmpty()) {
IO.println("Comparison still pending.");
} else {
var reason = r2.diagnostics().get().cacheMissReason().get();
// CacheMissReason doesn't expose a typed .type() accessor; read it from the raw JSON.
@SuppressWarnings("unchecked")
var json = (Map) reason.\_json().orElseThrow().asObject().orElseThrow();
IO.println("cache\_miss\_reason: " + json.get("type").asStringOrThrow());
}
```
```php PHP
$client = new Client();
$system = 'You are an AI assistant analyzing a large document. ...';
$r1 = $client->beta->messages->create(
model: Model::CLAUDE\_OPUS\_5,
maxTokens: 1024,
cacheControl: new BetaCacheControlEphemeral,
system: $system,
messages: [
['role' => 'user', 'content' => 'Summarize section 1.'],
],
diagnostics: (new BetaDiagnosticsParam)->withPreviousMessageID(null),
betas: [AnthropicBeta::CACHE\_DIAGNOSIS\_2026\_04\_07],
);
$r2 = $client->beta->messages->create(
model: Model::CLAUDE\_OPUS\_5,
maxTokens: 1024,
cacheControl: new BetaCacheControlEphemeral,
system: $system,
messages: [
['role' => 'user', 'content' => 'Summarize section 1.'],
['role' => 'assistant', 'content' => $r1->content],
['role' => 'user', 'content' => 'Now summarize section 2.'],
],
diagnostics: (new BetaDiagnosticsParam)->withPreviousMessageID($r1->id),
betas: [AnthropicBeta::CACHE\_DIAGNOSIS\_2026\_04\_07],
);
echo match (true) {
$r2->diagnostics === null => "No divergence detected.\n",
$r2->diagnostics->cacheMissReason === null => "Comparison still pending.\n",
default => "cache\_miss\_reason: {$r2->diagnostics->cacheMissReason->type}\n",
};
```
```ruby Ruby
client = Anthropic::Client.new
SYSTEM = "You are an AI assistant analyzing a large document. ..."
r1 = client.beta.messages.create(
model: :"claude-opus-5",
max\_tokens: 1024,
cache\_control: {type: "ephemeral"},
system\_: SYSTEM,
messages: [
{role: "user", content: "Summarize section 1."}
],
diagnostics: {previous\_message\_id: nil},
betas: ["cache-diagnosis-2026-04-07"]
)
r2 = client.beta.messages.create(
model: :"claude-opus-5",
max\_tokens: 1024,
cache\_control: {type: "ephemeral"},
system\_: SYSTEM,
messages: [
{role: "user", content: "Summarize section 1."},
{role: "assistant", content: r1.content},
{role: "user", content: "Now summarize section 2."}
],
diagnostics: {previous\_message\_id: r1.id},
betas: ["cache-diagnosis-2026-04-07"]
)
case r2.diagnostics
in nil
puts "No divergence detected."
in {cache\_miss\_reason: nil}
puts "Comparison still pending."
in {cache\_miss\_reason: {type:}}
puts "cache\_miss\_reason: #{type}"
end
```
## Streaming
In streaming responses, `diagnostics` appears on the `message\_start` event.
```bash cURL
# Turn 2: stream the response. diagnostics arrives on the message\_start event;
# a null value means no divergence was found.
curl -sS --fail-with-body https://api.anthropic.com/v1/messages \
--header "x-api-key: $ANTHROPIC\_API\_KEY" \
--header "anthropic-version: 2023-06-01" \
--header "anthropic-beta: cache-diagnosis-2026-04-07" \
--header "content-type: application/json" \
--data @- <...",
"messages": [
{"role": "user", "content": "Summarize section 1."},
{"role": "assistant", "content": "Section 1 covers..."},
{"role": "user", "content": "Now summarize section 2."}
],
"diagnostics": {"previous\_message\_id": "$message\_id"}
}
EOF
```
```bash CLI
# Turn 2: stream. With --stream the CLI emits each SSE event as one JSON object.
# diagnostics arrives on the message\_start event; pick it out with jq.
ant beta:messages create \
--beta cache-diagnosis-2026-04-07 \
--stream --format jsonl <..."
messages:
- role: user
content: Summarize section 1.
- role: assistant
content: Section 1 covers...
- role: user
content: Now summarize section 2.
diagnostics:
previous\_message\_id: $message\_id
YAML
jq -c 'select(.type == "message\_start") | .message | {id,usage,diagnostics}'
```
```python Python
# Turn 2: stream, referencing the previous response id
with client.beta.messages.stream(
model="claude-opus-5",
max\_tokens=1024,
cache\_control={"type": "ephemeral"},
system=SYSTEM,
messages=[
{"role": "user", "content": "Summarize section 1."},
{"role": "assistant", "content": r1.content},
{"role": "user", "content": "Now summarize section 2."},
],
diagnostics={"previous\_message\_id": r1.id},
betas=["cache-diagnosis-2026-04-07"],
) as stream:
for text in stream.text\_stream:
print(text, end="", flush=True)
print()
r2 = stream.get\_final\_message()
diagnostics = r2.diagnostics
if diagnostics is None:
print("No divergence detected.")
elif diagnostics.cache\_miss\_reason is None:
print("Comparison still pending.")
else:
print(f"cache\_miss\_reason: {diagnostics.cache\_miss\_reason.type}")
```
```typescript TypeScript
const stream = client.beta.messages.stream({
model: "claude-opus-5",
max\_tokens: 1024,
cache\_control: { type: "ephemeral" },
system: SYSTEM,
messages: [
{ role: "user", content: "Summarize section 1." },
{ role: "assistant", content: r1.content },
{ role: "user", content: "Now summarize section 2." }
],
diagnostics: { previous\_message\_id: r1.id },
betas: ["cache-diagnosis-2026-04-07"]
});
for await (const event of stream) {
if (event.type === "content\_block\_delta" && event.delta.type === "text\_delta") {
process.stdout.write(event.delta.text);
}
}
process.stdout.write("\n");
// diagnostics arrives on message\_start and is carried through to the final message
const r2 = await stream.finalMessage();
if (r2.diagnostics === null) {
console.log("No divergence detected.");
} else if (r2.diagnostics.cache\_miss\_reason === null) {
console.log("Comparison still pending.");
} else {
console.log(`cache\_miss\_reason: ${r2.diagnostics.cache\_miss\_reason.type}`);
}
```
```csharp C#
// Turn 2: stream, referencing the previous response id
BetaDiagnostics? diagnostics = null;
var stream = client.Beta.Messages.CreateStreaming(
new()
{
Model = Messages::Model.ClaudeOpus5,
MaxTokens = 1024,
CacheControl = new(),
System = system,
Messages =
[
new() { Role = Role.User, Content = "Summarize section 1." },
new()
{
Role = Role.Assistant,
Content = r1.Content.Select(block => new BetaContentBlockParam(block.Json)).ToList(),
},
new() { Role = Role.User, Content = "Now summarize section 2." },
],
Diagnostics = new() { PreviousMessageID = r1.ID },
Betas = [AnthropicBeta.CacheDiagnosis2026\_04\_07],
}
);
await foreach (var streamEvent in stream)
{
if (streamEvent.TryPickStart(out var start))
{
// diagnostics arrives on the message\_start event
diagnostics = start.Message.Diagnostics;
}
else if (streamEvent.TryPickContentBlockDelta(out var delta) && delta.Delta.TryPickText(out var textDelta))
{
Console.Write(textDelta.Text);
}
}
Console.WriteLine();
Console.WriteLine(diagnostics switch
{
null => "No divergence detected.",
{ CacheMissReason: null } => "Comparison still pending.",
{ CacheMissReason.Type: var type } => $"cache\_miss\_reason: {type.GetString()}",
});
```
```go Go
// Turn 2: stream, referencing the previous response id
stream := client.Beta.Messages.NewStreaming(ctx, anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
CacheControl: anthropic.BetaCacheControlEphemeralParam{},
System: system,
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Summarize section 1.")),
r1.ToParam(),
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Now summarize section 2.")),
},
Diagnostics: anthropic.BetaDiagnosticsParam{
PreviousMessageID: anthropic.String(r1.ID),
},
Betas: []anthropic.AnthropicBeta{anthropic.AnthropicBetaCacheDiagnosis2026\_04\_07},
})
defer stream.Close()
// diagnostics arrives on message\_start; Accumulate carries it into r2
var r2 anthropic.BetaMessage
for stream.Next() {
if err := r2.Accumulate(stream.Current()); err != nil {
panic(err)
}
}
if err := stream.Err(); err != nil {
panic(err)
}
switch {
case !r2.JSON.Diagnostics.Valid():
fmt.Println("No divergence detected.")
case !r2.Diagnostics.JSON.CacheMissReason.Valid():
fmt.Println("Comparison still pending.")
default:
fmt.Printf("cache\_miss\_reason: %s\n", r2.Diagnostics.CacheMissReason.Type)
}
```
```java Java
// Turn 2: stream, referencing the previous response id
var params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024)
.cacheControl(BetaCacheControlEphemeral.builder().build())
.system(system)
.addUserMessage("Summarize section 1.")
.addMessage(r1)
.addUserMessage("Now summarize section 2.")
.diagnostics(BetaDiagnosticsParam.builder().previousMessageId(r1.id()).build())
.addBeta(AnthropicBeta.CACHE\_DIAGNOSIS\_2026\_04\_07)
.build();
var accumulator = BetaMessageAccumulator.create();
try (var streamResponse = client.beta().messages().createStreaming(params)) {
streamResponse.stream()
.peek(accumulator::accumulate)
.flatMap(event -> event.contentBlockDelta().stream())
.flatMap(deltaEvent -> deltaEvent.delta().text().stream())
.forEach(textDelta -> IO.print(textDelta.text()));
IO.println("");
}
// diagnostics arrives on message\_start and is carried through to the accumulated message
var diagnostics = accumulator.message().diagnostics();
if (diagnostics.isEmpty()) {
IO.println("No divergence detected.");
} else if (diagnostics.get().cacheMissReason().isEmpty()) {
IO.println("Comparison still pending.");
} else {
var reason = diagnostics.get().cacheMissReason().get();
// CacheMissReason doesn't expose a typed .type() accessor; read it from the raw JSON.
@SuppressWarnings("unchecked")
var json = (Map) reason.\_json().orElseThrow().asObject().orElseThrow();
IO.println("cache\_miss\_reason: " + json.get("type").asStringOrThrow());
}
```
```php PHP
// Turn 2: stream, referencing the previous response id
$stream = $client->beta->messages->createStream(
model: Model::CLAUDE\_OPUS\_5,
maxTokens: 1024,
cacheControl: new BetaCacheControlEphemeral,
system: $system,
messages: [
['role' => 'user', 'content' => 'Summarize section 1.'],
['role' => 'assistant', 'content' => $r1->content],
['role' => 'user', 'content' => 'Now summarize section 2.'],
],
diagnostics: (new BetaDiagnosticsParam)->withPreviousMessageID($r1->id),
betas: [AnthropicBeta::CACHE\_DIAGNOSIS\_2026\_04\_07],
);
$diagnostics = null;
foreach ($stream as $event) {
if ($event instanceof BetaRawMessageStartEvent) {
// diagnostics arrives on the message\_start event's embedded BetaMessage
$diagnostics = $event->message->diagnostics;
} elseif ($event instanceof BetaRawContentBlockDeltaEvent && $event->delta instanceof BetaTextDelta) {
echo $event->delta->text;
}
}
echo PHP\_EOL;
echo match (true) {
$diagnostics === null => "No divergence detected.\n",
$diagnostics->cacheMissReason === null => "Comparison still pending.\n",
default => "cache\_miss\_reason: {$diagnostics->cacheMissReason->type}\n",
};
```
```ruby Ruby
# Turn 2: stream, referencing the previous response id
stream = client.beta.messages.stream(
model: :"claude-opus-5",
max\_tokens: 1024,
cache\_control: {type: "ephemeral"},
system\_: SYSTEM,
messages: [
{role: "user", content: "Summarize section 1."},
{role: "assistant", content: r1.content},
{role: "user", content: "Now summarize section 2."}
],
diagnostics: {previous\_message\_id: r1.id},
betas: ["cache-diagnosis-2026-04-07"]
)
stream.each do |event|
print(event.text) if event.is\_a?(Anthropic::Streaming::TextEvent)
end
puts
# diagnostics arrives on message\_start and is retained on the accumulated message
r2 = stream.accumulated\_message
case r2.diagnostics
in nil
puts "No divergence detected."
in {cache\_miss\_reason: nil}
puts "Comparison still pending."
in {cache\_miss\_reason: {type:}}
puts "cache\_miss\_reason: #{type}"
end
```
The `message\_start` event carries the full `diagnostics` field; see [Response format](#response-format) for the possible values.
## Threading diagnostics through a conversation loop
In a multi-turn conversation, carry the latest response `id` forward as `previous\_message\_id` on every turn. The first iteration passes `null` to opt in; each subsequent iteration passes the `id` from the previous response.

This workflow doesn't translate well to a one-off shell command. See the SDK tabs for the loop pattern; the per-turn HTTP request is identical to [Basic usage](#basic-usage).

This workflow doesn't translate well to a one-off shell command. See the SDK tabs for the loop pattern; the per-turn CLI invocation is identical to [Basic usage](#basic-usage).

```python
client = anthropic.Anthropic()
SYSTEM = "You are an AI assistant analyzing a large document. ..."
messages = []
prev\_id = None
for i, user\_message in enumerate(
["Summarize section 1.", "Now section 2.", "Now section 3."]
):
messages.append({"role": "user", "content": user\_message})
r = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=1024,
cache\_control={"type": "ephemeral"},
system=SYSTEM,
messages=messages,
diagnostics={"previous\_message\_id": prev\_id},
betas=["cache-diagnosis-2026-04-07"],
)
if r.diagnostics is not None and r.diagnostics.cache\_miss\_reason is not None:
print(f"Turn {i + 1} cache\_miss\_reason: {r.diagnostics.cache\_miss\_reason.type}")
messages.append({"role": "assistant", "content": r.content})
prev\_id = r.id
```

```typescript
const client = new Anthropic();
const SYSTEM = "You are an AI assistant analyzing a large document. ...";
const prompts = ["Summarize section 1.", "Now section 2.", "Now section 3."];
const messages: BetaMessageParam[] = [];
let prevId: string | null = null;
for (const [i, prompt] of prompts.entries()) {
messages.push({ role: "user", content: prompt });
const r: BetaMessage = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
cache\_control: { type: "ephemeral" },
system: SYSTEM,
messages,
diagnostics: { previous\_message\_id: prevId },
betas: ["cache-diagnosis-2026-04-07"]
});
if (r.diagnostics?.cache\_miss\_reason) {
console.log(`Turn ${i + 1} cache\_miss\_reason: ${r.diagnostics.cache\_miss\_reason.type}`);
}
messages.push({ role: "assistant", content: r.content });
prevId = r.id;
}
```

```csharp
AnthropicClient client = new();
var system = "You are an AI assistant analyzing a large document. ...";
List messages = [];
string? prevId = null;
string[] prompts = ["Summarize section 1.", "Now section 2.", "Now section 3."];
for (int i = 0; i < prompts.Length; i++)
{
messages.Add(new() { Role = Role.User, Content = prompts[i] });
var r = await client.Beta.Messages.Create(
new()
{
Model = Messages::Model.ClaudeOpus5,
MaxTokens = 1024,
CacheControl = new(),
System = system,
Messages = messages,
Diagnostics = new() { PreviousMessageID = prevId },
Betas = [AnthropicBeta.CacheDiagnosis2026\_04\_07],
}
);
if (r.Diagnostics?.CacheMissReason is { Type: var type })
{
Console.WriteLine($"Turn {i + 1} cache\_miss\_reason: {type.GetString()}");
}
messages.Add(
new()
{
Role = Role.Assistant,
Content = r.Content.Select(block => new BetaContentBlockParam(block.Json)).ToList(),
}
);
prevId = r.ID;
}
```

```go
client := anthropic.NewClient()
ctx := context.Background()
system := []anthropic.BetaTextBlockParam{
{Text: "You are an AI assistant analyzing a large document. ..."},
}
prompts := []string{"Summarize section 1.", "Now section 2.", "Now section 3."}
var messages []anthropic.BetaMessageParam
prevID := param.Null[string]()
for turn, prompt := range prompts {
messages = append(messages, anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock(prompt)))
r, err := client.Beta.Messages.New(ctx, anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
CacheControl: anthropic.BetaCacheControlEphemeralParam{},
System: system,
Messages: messages,
Diagnostics: anthropic.BetaDiagnosticsParam{
PreviousMessageID: prevID,
},
Betas: []anthropic.AnthropicBeta{anthropic.AnthropicBetaCacheDiagnosis2026\_04\_07},
})
if err != nil {
panic(err)
}
if r.JSON.Diagnostics.Valid() && r.Diagnostics.JSON.CacheMissReason.Valid() {
fmt.Printf("Turn %d cache\_miss\_reason: %s\n", turn+1, r.Diagnostics.CacheMissReason.Type)
}
messages = append(messages, r.ToParam())
prevID = anthropic.String(r.ID)
}
```

```java
var client = AnthropicOkHttpClient.fromEnv();
var system = "You are an AI assistant analyzing a large document. ...";
var prompts = List.of("Summarize section 1.", "Now section 2.", "Now section 3.");
var messages = new ArrayList();
String prevId = null;
for (var turn = 0; turn < prompts.size(); turn++) {
messages.add(
BetaMessageParam.builder()
.role(BetaMessageParam.Role.USER)
.content(prompts.get(turn))
.build()
);
var r = client.beta().messages().create(
MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024)
.cacheControl(BetaCacheControlEphemeral.builder().build())
.system(system)
.messages(messages)
.diagnostics(BetaDiagnosticsParam.builder().previousMessageId(prevId).build())
.addBeta(AnthropicBeta.CACHE\_DIAGNOSIS\_2026\_04\_07)
.build()
);
if (r.diagnostics().isPresent() && r.diagnostics().get().cacheMissReason().isPresent()) {
var reason = r.diagnostics().get().cacheMissReason().get();
// CacheMissReason doesn't expose a typed .type() accessor; read it from the raw JSON.
@SuppressWarnings("unchecked")
var json = (Map) reason.\_json().orElseThrow().asObject().orElseThrow();
IO.println("Turn " + (turn + 1) + " cache\_miss\_reason: " + json.get("type").asStringOrThrow());
}
messages.add(r.toParam());
prevId = r.id();
}
```

```php
$client = new Client();
$system = 'You are an AI assistant analyzing a large document. ...';
$messages = [];
$prevId = null;
foreach (['Summarize section 1.', 'Now section 2.', 'Now section 3.'] as $i => $userMsg) {
$turn = $i + 1;
$messages[] = ['role' => 'user', 'content' => $userMsg];
$r = $client->beta->messages->create(
model: Model::CLAUDE\_OPUS\_5,
maxTokens: 1024,
cacheControl: new BetaCacheControlEphemeral,
system: $system,
messages: $messages,
diagnostics: (new BetaDiagnosticsParam)->withPreviousMessageID($prevId),
betas: [AnthropicBeta::CACHE\_DIAGNOSIS\_2026\_04\_07],
);
if ($r->diagnostics?->cacheMissReason !== null) {
echo "Turn {$turn} cache\_miss\_reason: {$r->diagnostics->cacheMissReason->type}\n";
}
$messages[] = ['role' => 'assistant', 'content' => $r->content];
$prevId = $r->id;
}
```

```ruby
client = Anthropic::Client.new
SYSTEM = "You are an AI assistant analyzing a large document. ..."
messages = []
prev\_id = nil
["Summarize section 1.", "Now section 2.", "Now section 3."].each\_with\_index do |user\_msg, i|
messages << {role: "user", content: user\_msg}
r = client.beta.messages.create(
model: :"claude-opus-5",
max\_tokens: 1024,
cache\_control: {type: "ephemeral"},
system\_: SYSTEM,
messages: messages,
diagnostics: {previous\_message\_id: prev\_id},
betas: ["cache-diagnosis-2026-04-07"]
)
if (reason = r.diagnostics&.cache\_miss\_reason)
puts "Turn #{i + 1} cache\_miss\_reason: #{reason.type}"
end
messages << {role: "assistant", content: r.content}
prev\_id = r.id
end
```
## Response format
The `diagnostics` field on the response `Message` has four possible states:
| Value | Meaning |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| field absent | The request did not include `diagnostics`, or the beta header was missing. |
| `null` | Either `previous\_message\_id` was `null` (first turn, nothing to compare), or a comparison ran and found no divergence. |
| `{"cache\_miss\_reason": null}` | The comparison was still running when the response was serialized. This can happen when the response starts very quickly. Treat it as inconclusive and check the next turn. |
| `{"cache\_miss\_reason": {...}}` | A `cache\_miss\_reason` is attached. For `\*\_changed` types this identifies the first divergence point; `previous\_message\_not\_found` and `unavailable` are cases where no comparison was produced. |
When `cache\_miss\_reason` is non-null, it looks like this:
```json
{
"id": "msg\_01Xyz...",
"type": "message",
"role": "assistant",
"content": [{ "type": "text", "text": "..." }],
"usage": {
"input\_tokens": 42,
"cache\_read\_input\_tokens": 0,
"cache\_creation\_input\_tokens": 41850,
"output\_tokens": 210
},
"diagnostics": {
"cache\_miss\_reason": {
"type": "system\_changed",
"cache\_missed\_input\_tokens": 41850
}
}
}
```
## Cache miss reason types
`cache\_miss\_reason` is a discriminated union on `type`. The response reports the earliest divergence only, so fix it first; later ones may be hidden behind it.
| Type | What it means | What to change |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model\_changed` | The `model` differs from the previous request (for example, a router, A/B test, or fallback selected a different model). The cache is per-model. | Hold the model constant within a cached conversation. |
| `system\_changed` | The `system` parameter differs. Typically a timestamp, request ID, or other per-request value was interpolated into the system prompt. | Make the system prompt a byte-stable constant and move dynamic data into the first `user` message after your cache breakpoint. |
| `tools\_changed` | The `tools` array differs: tools were added, removed, or reordered between turns, or tool `input\_schema` JSON was serialized non-deterministically. | Send the same tool list on every turn in a fixed order with deterministically serialized schemas (for example, sort keys). |
| `messages\_changed` | The model, system, and tools all match, but an earlier entry in `messages` was altered, reordered, or removed rather than appended to. Typically conversation history was truncated or edited, or assistant turns and `tool\_result` blocks were re-serialized differently on resend. | Treat the history as append-only; echo assistant `content` and tool results back verbatim. |
| `previous\_message\_not\_found` | No stored fingerprint exists for the supplied `previous\_message\_id`. This is not evidence that your request changed. Typically the previous request did not carry the beta header, it came from a different workspace, or too much time has passed since it was sent. | Send the beta header on every turn and keep consecutive turns close together in time. |
| `unavailable` | Diagnostic information was not available for this request. This includes the case where `model`, `system`, and `tools` match but another prompt-affecting request parameter (`tool\_choice`, `thinking`, `context\_management`, `output\_config`, `output\_format`, or the set of active `anthropic-beta` headers) differs, and very long conversations where the divergence is beyond the comparison horizon. Your request was processed normally. | Keep the prompt-affecting request parameters constant for the lifetime of a cached conversation. If persistent, apply the manual checks under [Troubleshooting common issues](/docs/en/build-with-claude/prompt-caching#troubleshooting-common-issues) on the prompt caching page. |
The four `\*\_changed` types also carry a `cache\_missed\_input\_tokens` integer: an estimate of how many input tokens fell after the divergence point, giving you a sense of how much cacheable prefix was lost. It is derived from byte lengths before tokenization, so treat it as a magnitude indicator rather than a billing number. It can differ from (and occasionally exceed) `usage.input\_tokens`.
## Reading diagnostics alongside usage
`diagnostics` answers "did my request change?" while `usage.cache\_read\_input\_tokens` answers "did the cache hit?". Combining them tells you where to look.
This matrix applies to turns where you passed a real `previous\_message\_id`. On the first turn (`previous\_message\_id: null`), `diagnostics` is always `null` and `cache\_read\_input\_tokens` is normally zero because the cache is being written, not read; no troubleshooting is needed. The matrix also does not apply when `cache\_miss\_reason` is `null` (the comparison is still pending; check the next turn) or when its `type` is `previous\_message\_not\_found` or `unavailable` (no comparison was produced).
| Diagnostics result | Cache read tokens | Interpretation |
| ----------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `null` | high | Working as expected. Your prefix is stable and the cache hit. |
| `null` | low or zero | Your requests match but the cache entry was no longer available. Consider shortening gaps between turns or using the [1-hour cache TTL](/docs/en/build-with-claude/prompt-caching#1-hour-cache-duration). |
| `cache\_miss\_reason` is a `\*\_changed` type | low or zero | Your bug. The request changed; fix the cause indicated by `type`. |
| `cache\_miss\_reason` is a `\*\_changed` type | high | Rare. A change occurred late in the prompt but an earlier `cache\_control` breakpoint still hit. Worth fixing, but low impact. |
## Limitations
\* \*\*Beta:\*\* Field names and semantics may change before general availability.
\* \*\*Claude API only:\*\* Not available on Amazon Bedrock or Google Cloud.
\* \*\*Limited retention:\*\* Fingerprints for `previous\_message\_id` lookup expire after a short period. Run diagnostic comparisons between closely spaced requests.
\* \*\*Same workspace:\*\* The previous request must have been made with an API key from the same organization and workspace.
\* \*\*Comparison horizon:\*\* For very long conversations where the only change is deep in the message list, the response may be `unavailable` rather than a precise location.
\* \*\*Best-effort:\*\* Diagnostics never blocks or fails your request. If diagnostic information is not available, the response returns `unavailable`, or `cache\_miss\_reason: null` when the comparison was still running.
## Data retention
Cache diagnostics is ZDR eligible (qualified). Anthropic does not store the raw text of your prompts or Claude's outputs for this feature.
The fingerprint stored for each request consists only of cryptographic hashes and token-count estimates, keyed by the response `id` and scoped to your organization and workspace. Fingerprints expire after a short period and are not used for any other purpose.
For ZDR eligibility across all features, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
## See also
\* [Prompt caching](/docs/en/build-with-claude/prompt-caching)
\* [Token counting](/docs/en/build-with-claude/token-counting)
\* [Beta headers](/docs/en/api/beta-headers)
