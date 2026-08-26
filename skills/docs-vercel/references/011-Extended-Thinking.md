# Extended Thinking

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/reasoning

---
title: Extended Thinking
product: vercel
url: /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/reasoning
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/reasoning"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api
- /docs/ai-gateway/sdks-and-apis
related:
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/messages
- /docs/ai-gateway/models-and-providers/reasoning
- /docs/ai-gateway/sdks-and-apis/openai-chat-completions/reasoning
- /docs/ai-gateway/models-and-providers/reasoning/anthropic
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/advanced
summary: Configure how much Claude thinks before answering, using the Anthropic Messages API thinking parameter.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Extended Thinking
Anthropic calls reasoning \*\*extended thinking\*\*. Configure it with the `thinking` parameter on a [Messages](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/messages) request. Other API surfaces call the same capability reasoning: see [Reasoning](/docs/ai-gateway/models-and-providers/reasoning) for the cross-provider reference, or [Chat Completions reasoning](/docs/ai-gateway/sdks-and-apis/openai-chat-completions/reasoning) for the OpenAI-shaped equivalent.
Configure thinking for models that support chain-of-thought reasoning. The `thinking` parameter allows you to control how reasoning tokens are generated and returned. There are two modes:
- \*\*Adaptive thinking\*\*: Set `thinking: { type: 'adaptive' }`. The model decides when and how much to think. Available on Claude 4.6 and later. Required on Claude Opus 4.7 and later.
- \*\*Extended thinking with a token budget\*\*: Set `thinking: { type: 'enabled', budget\_tokens: N }` for a fixed token budget. Available on Claude 4.6 and earlier. Deprecated on Claude 4.6. Returns a 400 error on Claude Opus 4.7 and later.
See the [Anthropic reasoning reference](/docs/ai-gateway/models-and-providers/reasoning/anthropic#supported-models) for the full model support matrix.
The `thinking` parameter works with any reasoning model, not just Anthropic models. AI Gateway maps it to the target provider's native reasoning configuration, so you can set a thinking budget on a request to an OpenAI or Google model too.
## Adaptive thinking (Claude 4.6 and later)
On Claude Opus 4.7 and later, set `display: 'summarized'` to receive thinking text, which is omitted by default:
#### cURL
```bash filename="adaptive-thinking.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/messages" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-opus-5",
"max\_tokens": 2048,
"thinking": {
"type": "adaptive",
"display": "summarized"
},
"messages": [
{
"role": "user",
"content": "Explain quantum entanglement in simple terms."
}
]
}'
```
#### TypeScript
```typescript filename="thinking-adaptive.ts"
import Anthropic from '@anthropic-ai/sdk';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const anthropic = new Anthropic({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh',
});
const message = await anthropic.messages.create({
model: 'anthropic/claude-opus-5',
max\_tokens: 2048,
thinking: {
type: 'adaptive',
display: 'summarized',
},
messages: [
{
role: 'user',
content: 'Explain quantum entanglement in simple terms.',
},
],
});
for (const block of message.content) {
if (block.type === 'thinking') {
console.log('🧠 Thinking:', block.thinking);
} else if (block.type === 'text') {
console.log('💬 Response:', block.text);
}
}
```
#### Python
```python filename="thinking\_adaptive.py"
import os
import anthropic
api\_key = os.getenv('AI\_GATEWAY\_API\_KEY') or os.getenv('VERCEL\_OIDC\_TOKEN')
client = anthropic.Anthropic(
api\_key=api\_key,
base\_url='https://ai-gateway.vercel.sh'
)
message = client.messages.create(
model='anthropic/claude-opus-5',
max\_tokens=2048,
thinking={
'type': 'adaptive',
'display': 'summarized',
},
messages=[
{
'role': 'user',
'content': 'Explain quantum entanglement in simple terms.'
}
],
)
for block in message.content:
if block.type == 'thinking':
print('🧠 Thinking:', block.thinking)
elif block.type == 'text':
print('💬 Response:', block.text)
```
## Extended thinking with a token budget (Claude 4.6 and earlier)
For pre-4.7 models, use `type: 'enabled'` with a `budget\_tokens` value:
#### cURL
```bash filename="extended-thinking.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/messages" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-sonnet-4.5",
"max\_tokens": 8192,
"thinking": {
"type": "enabled",
"budget\_tokens": 5000
},
"messages": [
{
"role": "user",
"content": "Explain quantum entanglement in simple terms."
}
]
}'
```
#### TypeScript
```typescript filename="thinking.ts"
import Anthropic from '@anthropic-ai/sdk';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const anthropic = new Anthropic({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh',
});
const message = await anthropic.messages.create({
model: 'anthropic/claude-sonnet-4.5',
max\_tokens: 8192,
thinking: {
type: 'enabled',
budget\_tokens: 5000,
},
messages: [
{
role: 'user',
content: 'Explain quantum entanglement in simple terms.',
},
],
});
for (const block of message.content) {
if (block.type === 'thinking') {
console.log('🧠 Thinking:', block.thinking);
} else if (block.type === 'text') {
console.log('💬 Response:', block.text);
}
}
```
#### Python
```python filename="thinking.py"
import os
import anthropic
api\_key = os.getenv('AI\_GATEWAY\_API\_KEY') or os.getenv('VERCEL\_OIDC\_TOKEN')
client = anthropic.Anthropic(
api\_key=api\_key,
base\_url='https://ai-gateway.vercel.sh'
)
message = client.messages.create(
model='anthropic/claude-sonnet-4.5',
max\_tokens=8192,
thinking={
'type': 'enabled',
'budget\_tokens': 5000,
},
messages=[
{
'role': 'user',
'content': 'Explain quantum entanglement in simple terms.'
}
],
)
for block in message.content:
if block.type == 'thinking':
print('🧠 Thinking:', block.thinking)
elif block.type == 'text':
print('💬 Response:', block.text)
```
## Thinking parameters
- \*\*`type`\*\*: Set to `'adaptive'` (Claude 4.6 and later) or `'enabled'` (Claude 4.6 and earlier)
- \*\*`budget\_tokens`\*\*: Maximum number of tokens to allocate for thinking. Only valid with `type: 'enabled'`
- \*\*`display`\*\*: With `type: 'adaptive'`, set to `'summarized'` to include thinking text in the response. On Claude Opus 4.7 and later, thinking text is omitted by default
## Response with thinking
When thinking is enabled, the response includes thinking blocks:
```json
{
"id": "msg\_123",
"type": "message",
"role": "assistant",
"content": [
{
"type": "thinking",
"thinking": "Let me think about how to explain quantum entanglement...",
"signature": "anthropic-signature-xyz"
},
{
"type": "text",
"text": "Quantum entanglement is like having two magic coins..."
}
],
"model": "anthropic/claude-opus-5",
"stop\_reason": "end\_turn",
"usage": {
"input\_tokens": 15,
"output\_tokens": 150
}
}
```
## Next steps
- [Reasoning](/docs/ai-gateway/models-and-providers/reasoning) - Per-provider effort levels and model support
- [Advanced](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/advanced) - Web search, provider timeouts, and automatic caching
---
[View full sitemap](/docs/sitemap)
