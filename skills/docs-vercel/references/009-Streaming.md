# Streaming

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/streaming

---
title: Streaming
product: vercel
url: /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/streaming
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/streaming"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api
- /docs/ai-gateway/sdks-and-apis
related:
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/messages
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/tool-calling
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/reasoning
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/advanced
summary: Stream Anthropic Messages API responses token by token as they are generated.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Streaming
Set `stream: true` on a [Messages](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/messages) request to receive tokens as the model produces them, instead of waiting for the complete response.
Create a streaming message that delivers tokens as they are generated.
#### cURL
```bash filename="stream.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/messages" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-opus-5",
"max\_tokens": 150,
"messages": [
{
"role": "user",
"content": "Write a one-sentence bedtime story about a unicorn."
}
],
"temperature": 0.7,
"stream": true
}'
```
#### TypeScript
```typescript filename="stream.ts"
import Anthropic from '@anthropic-ai/sdk';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const anthropic = new Anthropic({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh',
});
const stream = await anthropic.messages.create({
model: 'anthropic/claude-opus-5',
max\_tokens: 150,
messages: [
{
role: 'user',
content: 'Write a one-sentence bedtime story about a unicorn.',
},
],
temperature: 0.7,
stream: true,
});
for await (const event of stream) {
if (event.type === 'content\_block\_delta') {
if (event.delta.type === 'text\_delta') {
process.stdout.write(event.delta.text);
}
}
}
```
#### Python
```python filename="stream.py"
import os
import anthropic
api\_key = os.getenv('AI\_GATEWAY\_API\_KEY') or os.getenv('VERCEL\_OIDC\_TOKEN')
client = anthropic.Anthropic(
api\_key=api\_key,
base\_url='https://ai-gateway.vercel.sh'
)
with client.messages.stream(
model='anthropic/claude-opus-5',
max\_tokens=150,
messages=[
{
'role': 'user',
'content': 'Write a one-sentence bedtime story about a unicorn.'
}
],
temperature=0.7,
) as stream:
for text in stream.text\_stream:
print(text, end='', flush=True)
```
## Streaming event types
Streaming responses use [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent\_events). The key event types are:
- `message\_start` - Initial message metadata
- `content\_block\_start` - Start of a content block (text, tool use, etc.)
- `content\_block\_delta` - Incremental content updates
- `content\_block\_stop` - End of a content block
- `message\_delta` - Final message metadata (stop reason, usage)
- `message\_stop` - End of the message
## Next steps
- [Tool calling](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/tool-calling) - Stream a response that calls your functions
- [Extended thinking](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/reasoning) - Configure how much Claude thinks before answering
- [Advanced](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/advanced) - Web search, provider timeouts, and automatic caching
---
[View full sitemap](/docs/sitemap)
