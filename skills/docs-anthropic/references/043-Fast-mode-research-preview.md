# Fast mode (research preview)

Source: https://platform.claude.com/docs/en/build-with-claude/fast-mode.md

# Fast mode (research preview)
Get up to 2.5x higher output tokens per second from supported Claude Opus models.
---
Fast mode delivers up to 2.5x higher output tokens per second from Claude Opus 5 and Claude Opus 4.8 at premium pricing. Set `speed: "fast"` with the `fast-mode-2026-02-01` beta header on your request to opt in.
Fast mode is in research preview. Contact your account manager to request access. If you do not have an account manager, [join the waitlist](https://claude.com/fast-mode) for fast mode.

For how zero data retention (ZDR) applies to this feature, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
## Supported models
Fast mode is supported on the following models:
\* Claude Opus 5 (claude-opus-5)
\* Claude Opus 4.8 (claude-opus-4-8)
Fast mode for Claude Opus 5 and Claude Opus 4.8 is available as a research preview on the Claude API, including [Claude Managed Agents](/docs/en/managed-agents/overview), only. It is not available on Amazon Bedrock, Google Cloud, or Microsoft Foundry.

Fast mode is not available on Claude Opus 4.7. Requests to `claude-opus-4-7` with `speed: "fast"` return an error; unlike Claude Opus 4.6 (see the following note), requests do not fall back to standard speed. The model itself remains available at standard speed. To continue using fast mode, migrate to [Claude Opus 5](/docs/en/about-claude/models/migration-guide#migrating-from-claude-opus-47) or Claude Opus 4.8.

Fast mode is not available on Claude Opus 4.6. Requests to `claude-opus-4-6` with `speed: "fast"` do not return an error: they run at standard speed and are billed at [standard rates](/docs/en/about-claude/pricing) rather than fast mode's premium rates, and the response reports [`usage.speed: "standard"`](#checking-which-speed-was-used). To continue using fast mode, migrate to [Claude Opus 5](/docs/en/about-claude/models/migration-guide#migrating-from-claude-opus-46) or Claude Opus 4.8.
## How fast mode works
Fast mode runs the same model with a faster inference configuration. There is no change to intelligence or capabilities.
\* Up to 2.5x higher output tokens per second compared to standard speed
\* Speed benefits are focused on output tokens per second (OTPS), not time to first token (TTFT)
\* Same model weights and behavior (not a different model)
\* Compatible with [streaming](/docs/en/build-with-claude/streaming), where the OTPS gain is most visible
## Basic usage
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: fast-mode-2026-02-01" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 4096,
"speed": "fast",
"messages": [{
"role": "user",
"content": "Refactor this module to use dependency injection"
}]
}'
```
```bash CLI
ant beta:messages create \
--beta fast-mode-2026-02-01 \
--transform 'content.#(type=="text").text' \
--raw-output <<'YAML'
model: claude-opus-5
max\_tokens: 4096
speed: fast
messages:
- role: user
content: Refactor this module to use dependency injection
YAML
```
```python Python
client = anthropic.Anthropic()
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=4096,
speed="fast",
betas=["fast-mode-2026-02-01"],
messages=[
{"role": "user", "content": "Refactor this module to use dependency injection"}
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
max\_tokens: 4096,
speed: "fast",
betas: ["fast-mode-2026-02-01"],
messages: [
{
role: "user",
content: "Refactor this module to use dependency injection"
}
]
});
const textBlock = response.content.find(
(block): block is Anthropic.Beta.Messages.BetaTextBlock => block.type === "text"
);
console.log(textBlock?.text);
```
```csharp C#
AnthropicClient client = new();
var response = await client.Beta.Messages.Create(new MessageCreateParams
{
Model = "claude-opus-5",
MaxTokens = 4096,
Speed = Speed.Fast,
Betas = ["fast-mode-2026-02-01"],
Messages = [
new() { Role = Role.User, Content = "Refactor this module to use dependency injection" }
],
});
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 4096,
Speed: anthropic.BetaMessageNewParamsSpeedFast,
Betas: []anthropic.AnthropicBeta{anthropic.AnthropicBetaFastMode2026\_02\_01},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Refactor this module to use dependency injection")),
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
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
BetaMessage response = client.beta().messages().create(
MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.speed(MessageCreateParams.Speed.FAST)
.addBeta(AnthropicBeta.FAST\_MODE\_2026\_02\_01)
.addUserMessage("Refactor this module to use dependency injection")
.build());
response.content().stream()
.flatMap(block -> block.text().stream())
.forEach(textBlock -> IO.println(textBlock.text()));
```
```php PHP
$client = new Client();
$response = $client->beta->messages->create(
model: 'claude-opus-5',
maxTokens: 4096,
speed: 'fast',
betas: ['fast-mode-2026-02-01'],
messages: [
['role' => 'user', 'content' => 'Refactor this module to use dependency injection'],
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
max\_tokens: 4096,
speed: "fast",
betas: ["fast-mode-2026-02-01"],
messages: [{role: "user", content: "Refactor this module to use dependency injection"}]
)
response.content.each do |block|
puts block.text if block.type == :text
end
```
## Pricing
Fast mode is priced at a multiplier on standard rates across the full context window, including requests over 200k input tokens. The following table shows fast mode pricing for the supported models:
| Model | Input | Output |
| ------------------------------- | -------------- | -------------- |
| Claude Opus 5 / Claude Opus 4.8 | $10 USD / MTok | $50 USD / MTok |
Fast mode pricing stacks with other pricing modifiers:
\* [Prompt caching multipliers](/docs/en/about-claude/pricing#prompt-caching) apply on top of fast mode pricing
\* [Data residency](/docs/en/manage-claude/data-residency) multipliers apply on top of fast mode pricing
For complete pricing details, see the [Pricing](/docs/en/about-claude/pricing#fast-mode-pricing) page.
## Rate limits
Fast mode has a dedicated rate limit that is separate from standard Opus rate limits. When your fast mode rate limit is exceeded, the API returns a `429` error with a `retry-after` header indicating when capacity will be available.
The response includes headers that indicate your fast mode rate limit status:
| Header | Description |
| ---------------------------------------- | ------------------------------------------------- |
| `anthropic-fast-input-tokens-limit` | Maximum fast mode input tokens per minute |
| `anthropic-fast-input-tokens-remaining` | Remaining fast mode input tokens |
| `anthropic-fast-input-tokens-reset` | Time when the fast mode input token limit resets |
| `anthropic-fast-output-tokens-limit` | Maximum fast mode output tokens per minute |
| `anthropic-fast-output-tokens-remaining` | Remaining fast mode output tokens |
| `anthropic-fast-output-tokens-reset` | Time when the fast mode output token limit resets |
For tier-specific rate limits, see the [Rate limits](/docs/en/api/rate-limits) page.
## Checking which speed was used
The response `usage` object includes a `speed` field that indicates which speed was used, either `"fast"` or `"standard"`. Requesting `speed: "fast"` on a [model that doesn't support fast mode](#supported-models) returns an error, and so does exceeding fast mode's rate limits or capacity (a `429` or `529`). When a request with `speed: "fast"` succeeds, `usage.speed` is `"fast"`. If you are using Claude Opus 4.6 and request fast mode, its behavior is unique. Instead of returning an error like other models that don't support fast mode, it silently switches to standard speed. Though there is no error with Opus 4.6, the `speed` field accurately shows `"standard"`.
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: fast-mode-2026-02-01" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"speed": "fast",
"messages": [{"role": "user", "content": "Hello"}]
}'
```
```bash CLI
ant beta:messages create \
--beta fast-mode-2026-02-01 \
--transform usage.speed \
--raw-output <<'YAML'
model: claude-opus-5
max\_tokens: 1024
speed: fast
messages:
- role: user
content: Hello
YAML
```
```python Python
client = anthropic.Anthropic()
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=1024,
speed="fast",
betas=["fast-mode-2026-02-01"],
messages=[{"role": "user", "content": "Hello"}],
)
print(response.usage.speed) # "fast" or "standard"
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
speed: "fast",
betas: ["fast-mode-2026-02-01"],
messages: [{ role: "user", content: "Hello" }]
});
console.log(response.usage.speed); // "fast" or "standard"
```
```csharp C#
AnthropicClient client = new();
var response = await client.Beta.Messages.Create(new MessageCreateParams
{
Model = "claude-opus-5",
MaxTokens = 1024,
Speed = Speed.Fast,
Betas = ["fast-mode-2026-02-01"],
Messages = [new() { Role = Role.User, Content = "Hello" }],
});
Console.WriteLine(response.Usage.Speed); // "fast" or "standard"
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Speed: anthropic.BetaMessageNewParamsSpeedFast,
Betas: []anthropic.AnthropicBeta{anthropic.AnthropicBetaFastMode2026\_02\_01},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Hello")),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response.Usage.Speed) // "fast" or "standard"
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.speed(MessageCreateParams.Speed.FAST)
.addBeta(AnthropicBeta.FAST\_MODE\_2026\_02\_01)
.addUserMessage("Hello")
.build();
BetaMessage response = client.beta().messages().create(params);
IO.println(response.usage().speed()); // "fast" or "standard"
```
```php PHP
$client = new Client();
$response = $client->beta->messages->create(
model: 'claude-opus-5',
maxTokens: 1024,
speed: 'fast',
betas: ['fast-mode-2026-02-01'],
messages: [['role' => 'user', 'content' => 'Hello']],
);
echo $response->usage->speed; // "fast" or "standard"
```
```ruby Ruby
client = Anthropic::Client.new
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
speed: "fast",
betas: ["fast-mode-2026-02-01"],
messages: [{ role: "user", content: "Hello" }]
)
puts(response.usage.speed) # "fast" or "standard"
```
```json Output
{
"id": "msg\_01XFDUDYJgAACzvnptvVoYEL",
"type": "message",
"role": "assistant",
// ...
"usage": {
"input\_tokens": 8,
"output\_tokens": 12,
"speed": "fast"
}
}
```
To track fast mode usage and costs across your organization, see the [Usage and Cost API](/docs/en/manage-claude/usage-cost-api).
## Retries and fallback
### Automatic retries
When fast mode rate limits are exceeded, the API returns a `429` error with a `retry-after` header. The Anthropic SDKs automatically retry these requests up to 2 times by default (configurable with `max\_retries`), waiting for the server-specified delay before each retry. Because fast mode uses continuous token replenishment, the `retry-after` delay is typically short and requests succeed once capacity is available.
### Falling back to standard speed
This section covers an opt-in client-side fallback when fast mode is rate limited. It is separate from the behavior on [Claude Opus 4.6](#supported-models), where fast mode is not available and requests run at standard speed automatically.
If you'd prefer to fall back to standard speed rather than wait for fast mode capacity, catch the rate limit error and retry without `speed: "fast"`. Set `max\_retries` to `0` on the initial fast request to skip automatic retries and fail immediately on rate limit errors.
Falling back from fast to standard speed will result in a [prompt cache](/docs/en/build-with-claude/prompt-caching) miss. Requests at different speeds do not share cached prefixes.
Because setting `max\_retries` to `0` also disables retries for other transient errors (overloaded, internal server errors), the following examples reissue the original request with default retries for those cases.
```bash CLI
# `ant` retries 429/5xx automatically and has no per-request max\_retries
# override, so on a fast-mode 429 the fallback runs after the built-in
# retries exhaust. --transform-error surfaces error.type for branching.
create\_message\_with\_fast\_fallback() {
local speed="$1" max\_attempts="${2:-3}" body out
body=${3:-$(cat)}
out=$(
ant beta:messages create --beta fast-mode-2026-02-01 \
${speed:+--speed "$speed"} \
--transform-error error.type --format-error yaml <<<"$body" 2>/dev/null
) && { printf '%s\n' "$out"; return; }
case "$out" in
rate\_limit\_error)
if [[ -n "$speed" ]]; then
create\_message\_with\_fast\_fallback "" "$max\_attempts" "$body"
return
fi ;;
overloaded\_error | api\_error | "")
if (( max\_attempts > 1 )); then
create\_message\_with\_fast\_fallback "$speed" $((max\_attempts - 1)) "$body"
return
fi ;;
esac
printf '%s\n' "${out:-connection\_error}" >&2
return 1
}
MESSAGE=$(
create\_message\_with\_fast\_fallback fast <<'YAML'
model: claude-opus-5
max\_tokens: 1024
messages:
- role: user
content: Hello
YAML
)
```
```python Python
client = anthropic.Anthropic()
def create\_message\_with\_fast\_fallback(max\_retries=0, max\_attempts=3, \*\*params):
try:
return client.with\_options(max\_retries=max\_retries).beta.messages.create(
\*\*params
)
except anthropic.RateLimitError:
if params.get("speed") == "fast":
del params["speed"]
return create\_message\_with\_fast\_fallback(max\_retries=max\_retries, \*\*params)
raise
except (
anthropic.APIStatusError,
anthropic.APIConnectionError,
) as error:
if isinstance(error, anthropic.APIStatusError) and error.status\_code < 500:
raise
if max\_attempts > 1:
return create\_message\_with\_fast\_fallback(
max\_retries=max\_retries, max\_attempts=max\_attempts - 1, \*\*params
)
raise
message = create\_message\_with\_fast\_fallback(
model="claude-opus-5",
max\_tokens=1024,
messages=[{"role": "user", "content": "Hello"}],
betas=["fast-mode-2026-02-01"],
speed="fast",
max\_retries=0,
)
```
```typescript TypeScript
const client = new Anthropic();
async function createMessageWithFastFallback(
params: Anthropic.Beta.MessageCreateParams,
requestOptions?: Anthropic.RequestOptions,
maxAttempts: number = 3
): Promise {
try {
return (await client.beta.messages.create(
params,
requestOptions
)) as Anthropic.Beta.Messages.BetaMessage;
} catch (e) {
if (e instanceof Anthropic.RateLimitError && params.speed === "fast") {
const { speed, ...rest } = params;
return createMessageWithFastFallback(rest);
}
if (
e instanceof Anthropic.InternalServerError ||
e instanceof Anthropic.APIConnectionError
) {
if (maxAttempts > 1) {
return createMessageWithFastFallback(params, undefined, maxAttempts - 1);
}
}
throw e;
}
}
const message = await createMessageWithFastFallback(
{
model: "claude-opus-5",
max\_tokens: 1024,
messages: [{ role: "user", content: "Hello" }],
betas: ["fast-mode-2026-02-01"],
speed: "fast"
},
{ maxRetries: 0 }
);
```
```csharp C#
AnthropicClient client = new();
async Task CreateMessageWithFastFallback(
MessageCreateParams parameters,
int? maxRetries = null,
int maxAttempts = 3)
{
try
{
var requestClient = maxRetries is int retries
? client.WithOptions(options => options with { MaxRetries = retries })
: client;
return await requestClient.Beta.Messages.Create(parameters);
}
catch (AnthropicRateLimitException)
{
if (parameters.Speed is not null)
{
return await CreateMessageWithFastFallback(
parameters with { Speed = null });
}
throw;
}
catch (Anthropic5xxException)
{
if (maxAttempts > 1)
{
return await CreateMessageWithFastFallback(
parameters, maxAttempts: maxAttempts - 1);
}
throw;
}
}
var message = await CreateMessageWithFastFallback(
new MessageCreateParams
{
Model = "claude-opus-5",
MaxTokens = 1024,
Messages = [new() { Role = Role.User, Content = "Hello" }],
Betas = ["fast-mode-2026-02-01"],
Speed = Speed.Fast,
},
maxRetries: 0);
```
```go Go
func createMessageWithFastFallback(
ctx context.Context,
client \*anthropic.Client,
params anthropic.BetaMessageNewParams,
maxAttempts int,
opts ...option.RequestOption,
) (\*anthropic.BetaMessage, error) {
message, err := client.Beta.Messages.New(ctx, params, opts...)
if err != nil {
var apierr \*anthropic.Error
if errors.As(err, &apierr) && apierr.StatusCode == 429 && params.Speed != "" {
params.Speed = ""
return createMessageWithFastFallback(ctx, client, params, maxAttempts)
}
if (errors.As(err, &apierr) && apierr.StatusCode >= 500) || !errors.As(err, &apierr) {
if maxAttempts > 1 {
return createMessageWithFastFallback(ctx, client, params, maxAttempts-1)
}
}
return nil, err
}
return message, nil
}
func main() {
client := anthropic.NewClient()
message, err := createMessageWithFastFallback(
context.TODO(),
&client,
anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Hello")),
},
Speed: anthropic.BetaMessageNewParamsSpeedFast,
Betas: []anthropic.AnthropicBeta{anthropic.AnthropicBetaFastMode2026\_02\_01},
},
3,
option.WithMaxRetries(0),
)
if err != nil {
panic(err)
}
fmt.Println(message)
}
```
```java Java
import com.anthropic.errors.InternalServerException;
import com.anthropic.errors.RateLimitException;
// ...
// Disable SDK auto-retry so the fallback logic below handles it
AnthropicClient client =
AnthropicOkHttpClient.builder().fromEnv().maxRetries(0).build();
BetaMessage createMessageWithFastFallback(
MessageCreateParams params, int maxAttempts) {
try {
return client.beta().messages().create(params);
} catch (RateLimitException e) {
if (params.speed().isPresent()) {
MessageCreateParams retryParams = params.toBuilder()
.speed(Optional.empty())
.build();
return createMessageWithFastFallback(retryParams, maxAttempts);
}
throw e;
} catch (InternalServerException e) {
if (maxAttempts > 1) {
return createMessageWithFastFallback(params, maxAttempts - 1);
}
throw e;
}
}
void main() {
BetaMessage message = createMessageWithFastFallback(
MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addUserMessage("Hello")
.addBeta(AnthropicBeta.FAST\_MODE\_2026\_02\_01)
.speed(MessageCreateParams.Speed.FAST)
.build(),
3);
message.content().stream()
.flatMap(block -> block.text().stream())
.forEach(textBlock -> IO.println(textBlock.text()));
}
```
```php PHP
use Anthropic\Core\Exceptions\APIConnectionException;
use Anthropic\Core\Exceptions\InternalServerException;
use Anthropic\Core\Exceptions\RateLimitException;
use Anthropic\RequestOptions;
// ...
$client = new Client();
function createMessageWithFastFallback(
Client $client,
array $params,
?RequestOptions $requestOptions = null,
int $maxAttempts = 3,
) {
try {
return $client->beta->messages->create(
...$params,
requestOptions: $requestOptions,
);
} catch (RateLimitException $e) {
if (isset($params['speed'])) {
unset($params['speed']);
return createMessageWithFastFallback($client, $params);
}
throw $e;
} catch (InternalServerException | APIConnectionException $e) {
if ($maxAttempts > 1) {
return createMessageWithFastFallback(
$client, $params, maxAttempts: $maxAttempts - 1
);
}
throw $e;
}
}
$message = createMessageWithFastFallback(
$client,
[
'model' => 'claude-opus-5',
'maxTokens' => 1024,
'messages' => [['role' => 'user', 'content' => 'Hello']],
'betas' => ['fast-mode-2026-02-01'],
'speed' => 'fast',
],
RequestOptions::with(maxRetries: 0),
);
```
```ruby Ruby
anthropic = Anthropic::Client.new
def create\_message\_with\_fast\_fallback(client, request\_options: {}, max\_attempts: 3, \*\*params)
client.beta.messages.create(\*\*params, request\_options: request\_options)
rescue Anthropic::Errors::RateLimitError
raise unless params[:speed] == "fast"
params.delete(:speed)
create\_message\_with\_fast\_fallback(client, \*\*params)
rescue Anthropic::Errors::InternalServerError, Anthropic::Errors::APIConnectionError
raise unless max\_attempts > 1
create\_message\_with\_fast\_fallback(client, max\_attempts: max\_attempts - 1, \*\*params)
end
message = create\_message\_with\_fast\_fallback(
anthropic,
model: "claude-opus-5",
max\_tokens: 1024,
messages: [{ role: "user", content: "Hello" }],
betas: ["fast-mode-2026-02-01"],
speed: "fast",
request\_options: { max\_retries: 0 }
)
```
## Considerations
\* \*\*Prompt caching:\*\* Switching between fast and standard speed invalidates the prompt cache. Requests at different speeds do not share cached prefixes.
\* \*\*Supported models:\*\* Fast mode is supported on Claude Opus 5 and Claude Opus 4.8. See [Supported models](#supported-models).
\* \*\*TTFT:\*\* Fast mode's benefits are focused on output tokens per second (OTPS), not time to first token (TTFT).
\* \*\*Batch API:\*\* Fast mode is not available with the [Batch API](/docs/en/build-with-claude/batch-processing).
\* \*\*Priority Tier:\*\* Fast mode is not available with a [Priority Tier](/docs/en/api/service-tiers) commitment.
\* \*\*Claude Platform on AWS:\*\* Fast mode is not currently available on [Claude Platform on AWS](/docs/en/build-with-claude/claude-platform-on-aws).
## Next steps

Get validated JSON results from agent workflows.

Learn about Anthropic's pricing structure for models and features.

Control how many tokens Claude uses when responding with the effort parameter, trading off between response thoroughness and token efficiency.

Stream Messages API responses incrementally with server-sent events, including text, tool use, and extended thinking deltas.
