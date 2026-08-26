# Handle streaming refusals

Source: https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals.md

# Handle streaming refusals
Detect and handle refusal stop reasons in streaming responses, and retry refused requests on a fallback model.
---
Starting with Claude 4 models, streaming responses from Claude's API return \*\*`stop\_reason`: `"refusal"`\*\* when streaming classifiers intervene to handle potential policy violations. This safety feature helps maintain content compliance during real-time streaming.
This page covers how refusals appear in streaming responses. For every `stop\_reason` value and how to handle it, see [Stop reasons and fallback](/docs/en/build-with-claude/handling-stop-reasons). To retry refused requests on another Claude model, see [Refusals and fallback](/docs/en/build-with-claude/refusals-and-fallback).
## API response format
When streaming classifiers detect content that violates Anthropic's policies, the API returns this response:
```json
{
"role": "assistant",
"content": [
{
"type": "text",
"text": "Hello.."
}
],
"stop\_reason": "refusal",
"stop\_details": {
"type": "refusal",
"category": "cyber",
"explanation": "This request was declined because it could enable cyber harm."
}
}
```
In the event stream, `stop\_details` arrives on the `message\_delta` event alongside `stop\_reason`.
A `refusal` response from streaming classifiers includes a `stop\_details` object with a `category` and a human-readable `explanation` that you can surface to the user. See [Refusals and fallback](/docs/en/build-with-claude/refusals-and-fallback#refusal-response) for the full response shape and the available categories.
On a refusal the `stop\_details` object is always present, but its `category` and `explanation` fields can be `null`, for example when the refusal maps to no named category. Branch on `stop\_reason` or `stop\_details.type` rather than assuming `category` and `explanation` are populated, and provide your own user-facing messaging when they are `null`.
## Reset context after refusal
When you receive \*\*`stop\_reason`: `refusal`\*\*, you must reset the conversation context before continuing. You can remove or rephrase the turn that triggered the refusal, or clear the conversation history entirely. Attempting to continue without resetting will result in continued refusals.
Usage metrics are still provided in the response, even when the response is refused.
When a refusal arrives before Claude generates any output, you are not billed for the request on the Claude API, and the usage counts in that response are informational only. When Claude generates output before the refusal, you are billed for that request.

Resetting context is not the only way to recover. You can also retry the refused request on a different Claude model, and the [Refusals and fallback](/docs/en/build-with-claude/refusals-and-fallback) page shows how to set that up with server-side fallback, the SDK middleware, or a manual retry.
## Implementation guide
Here's how to detect and handle streaming refusals in your application:
```bash cURL
# Stream request and check for refusal
response=$(curl -N https://api.anthropic.com/v1/messages \
-H "anthropic-version: 2023-06-01" \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-d '{
"model": "claude-opus-5",
"messages": [{"role": "user", "content": "Hello"}],
"max\_tokens": 1024,
"stream": true
}')
# Check for refusal in the stream
if echo "$response" | grep -q '"stop\_reason":"refusal"'; then
echo "Response refused - resetting conversation context"
# Reset your conversation state here
fi
```
```python Python
client = anthropic.Anthropic()
messages = []
def reset\_conversation():
"""Reset conversation context after refusal"""
global messages
messages = []
print("Conversation reset due to refusal")
try:
with client.messages.stream(
max\_tokens=1024,
messages=messages + [{"role": "user", "content": "Hello"}],
model="claude-opus-5",
) as stream:
for event in stream:
# Check for refusal in message delta
if event.type == "message\_delta":
if event.delta.stop\_reason == "refusal":
reset\_conversation()
break
except Exception as e:
print(f"Error: {e}")
```
```typescript TypeScript
const client = new Anthropic();
let messages: any[] = [];
function resetConversation() {
// Reset conversation context after refusal
messages = [];
console.log("Conversation reset due to refusal");
}
try {
const stream = await client.messages.stream({
messages: [...messages, { role: "user", content: "Hello" }],
model: "claude-opus-5",
max\_tokens: 1024
});
for await (const event of stream) {
// Check for refusal in message delta
if (event.type === "message\_delta" && event.delta.stop\_reason === "refusal") {
resetConversation();
break;
}
}
} catch (error) {
console.error("Error:", error);
}
```
```csharp C#
List messages = new();
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Messages = [new() { Role = Role.User, Content = "Hello" }]
};
try
{
await foreach (var msg in client.Messages.CreateStreaming(parameters))
{
if (msg.Type == "message\_delta" && msg.Delta?.StopReason == "refusal")
{
ResetConversation();
break;
}
}
}
catch (Exception e)
{
Console.WriteLine($"Error: {e.Message}");
}
void ResetConversation()
{
messages.Clear();
Console.WriteLine("Conversation reset due to refusal");
}
```
```go Go
var messages []anthropic.MessageParam
func resetConversation() {
messages = []anthropic.MessageParam{}
fmt.Println("Conversation reset due to refusal")
}
// ...
client := anthropic.NewClient()
stream := client.Messages.NewStreaming(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("Hello")),
},
})
streamLoop:
for stream.Next() {
event := stream.Current()
switch eventVariant := event.AsAny().(type) {
case anthropic.MessageDeltaEvent:
if eventVariant.Delta.StopReason == "refusal" {
resetConversation()
break streamLoop
}
}
}
if err := stream.Err(); err != nil {
log.Fatal(err)
}
```
```java Java
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.messages.RawMessageStreamEvent;
import com.anthropic.models.messages.StopReason;
// ...
List messages = new ArrayList<>();
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addUserMessage("Hello")
.build();
try (StreamResponse stream = client.messages().createStreaming(params)) {
stream.stream().forEach(event -> {
event.messageDelta().ifPresent(deltaEvent -> {
deltaEvent.delta().stopReason().ifPresent(stopReason -> {
if (stopReason.equals(StopReason.REFUSAL)) {
resetConversation();
}
});
});
});
} catch (Exception e) {
System.err.println("Error: " + e.getMessage());
}
}
void resetConversation() {
messages.clear();
IO.println("Conversation reset due to refusal");
}
```
```php PHP
$client = new Client();
$messages = [];
function resetConversation(&$messages) {
$messages = [];
echo "Conversation reset due to refusal\n";
}
try {
$stream = $client->messages->createStream(
maxTokens: 1024,
messages: [
['role' => 'user', 'content' => 'Hello']
],
model: 'claude-opus-5',
);
foreach ($stream as $event) {
if (isset($event->type) && $event->type === 'message\_delta') {
if (isset($event->delta->stopReason) && $event->delta->stopReason === 'refusal') {
resetConversation($messages);
break;
}
}
}
} catch (Exception $e) {
echo "Error: " . $e->getMessage() . "\n";
}
```
```ruby Ruby
client = Anthropic::Client.new
messages = []
def reset\_conversation(messages)
messages.clear
puts "Conversation reset due to refusal"
end
begin
stream = client.messages.stream(
model: :"claude-opus-5",
max\_tokens: 1024,
messages: [{ role: "user", content: "Hello" }]
)
stream.each do |event|
if event.type == :message\_delta && event.delta.stop\_reason == :refusal
reset\_conversation(messages)
break
end
end
rescue => e
puts "Error: #{e.message}"
end
```
## Current refusal types
The API currently handles refusals in three different ways:
| Refusal type | Response format | When it occurs |
| ---------------------------------- | ---------------------------- | ----------------------------------------------- |
| Streaming classifier refusals | \*\*`stop\_reason`: `refusal`\*\* | During streaming when content violates policies |
| API input and copyright validation | 400 error codes | When input fails validation checks |
| Model-generated refusals | Standard text responses | When the model itself refuses |
## Best practices
\* \*\*Monitor for refusals:\*\* Include \*\*`stop\_reason`: `refusal`\*\* checks in your error handling
\* \*\*Reset automatically:\*\* Implement automatic context reset when refusals are detected
\* \*\*Fall back to another model:\*\* Configure [server-side fallback or the SDK middleware](/docs/en/build-with-claude/refusals-and-fallback) so refused requests are retried on another Claude model instead of surfacing a refusal to the user
\* \*\*Redeem fallback credit on manual retries:\*\* If you build the retry yourself, pass the refusal's [fallback credit](/docs/en/build-with-claude/fallback-credit) token so the retry doesn't pay the prompt-cache cost twice
\* \*\*Provide custom messaging:\*\* Create user-friendly messages for better UX when refusals occur
\* \*\*Track refusal patterns:\*\* Monitor refusal frequency to identify potential issues with your prompts
## Migration notes
If you built refusal handling when this feature first shipped, or you're adding it to an existing integration, check the following:
\* \*\*Refusals are responses, not errors.\*\* A refusal arrives as a successful HTTP 200 response with `stop\_reason`: `"refusal"`, so monitoring built only on error rates won't surface it. Track refusals as their own signal.
\* \*\*Refusals include structured detail.\*\* On every model, a refusal also includes a `stop\_details` object that identifies the policy category behind the decline. See [Refusals and fallback](/docs/en/build-with-claude/refusals-and-fallback#refusal-response) for the full response shape.
\* \*\*Retry on a different model.\*\* Re-sending a refused request to the same model usually results in another refusal. Instead of only resetting context, retry on a fallback model with [server-side fallback, the SDK middleware, or a manual retry](/docs/en/build-with-claude/refusals-and-fallback), and redeem [fallback credit](/docs/en/build-with-claude/fallback-credit) when you build the retry yourself.
\* \*\*Check batch results for refusals.\*\* A refused request in a [Message Batch](/docs/en/build-with-claude/batch-processing) is returned as a succeeded result with `stop\_reason`: `"refusal"`, not as an errored result.
\* \*\*Centralize handling on `stop\_reason`.\*\* The API continues to consolidate refusal handling around `stop\_reason`: `"refusal"`, so branch on the stop reason rather than on model-specific behavior.
## Next steps

Retry refused requests on another Claude model, server-side or in your client.

Every `stop\_reason` value and how to handle it.

Stream responses and read `stop\_reason` from `message\_delta` events as they arrive.

Serve users across languages with Claude's cross-lingual capabilities.
