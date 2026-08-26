# Streaming

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/openresponses/streaming

---
title: Streaming
product: vercel
url: /docs/ai-gateway/sdks-and-apis/openresponses/streaming
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/openresponses/streaming"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/openresponses
- /docs/ai-gateway/sdks-and-apis
related:
- /docs/ai-gateway/sdks-and-apis/openresponses
summary: Stream responses token by token using the OpenResponses API.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Streaming
The [OpenResponses API](/docs/ai-gateway/sdks-and-apis/openresponses) supports streaming to receive tokens as they're generated instead of waiting for the complete response. Set `stream: true` in your request, then read the response body as a stream of server-sent events. Each event contains a response chunk that you can display incrementally.
#### \['cURL'
```bash filename="stream.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/responses" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "google/gemini-3.1-pro-preview",
"input": [
{
"type": "message",
"role": "user",
"content": "Write a haiku about debugging code."
}
],
"stream": true
}'
```
#### 'TypeScript'
```typescript filename="stream.ts"
const apiKey = process.env.AI\_GATEWAY\_API\_KEY;
const response = await fetch('https://ai-gateway.vercel.sh/v1/responses', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
Authorization: `Bearer ${apiKey}`,
},
body: JSON.stringify({
model: 'google/gemini-3.1-pro-preview',
input: [
{
type: 'message',
role: 'user',
content: 'Write a haiku about debugging code.',
},
],
stream: true,
}),
});
const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';
while (true) {
const { done, value } = await reader.read();
if (done) break;
buffer += decoder.decode(value, { stream: true });
// Keep the trailing fragment in the buffer: a read can end mid-line, and
// parsing a half-received event throws.
const lines = buffer.split('\n');
buffer = lines.pop() ?? '';
for (const line of lines) {
if (!line.startsWith('data:')) continue;
const data = line.slice(5).trim();
if (!data || data === '[DONE]') continue;
const event = JSON.parse(data);
if (event.type === 'response.output\_text.delta') {
process.stdout.write(event.delta);
}
}
}
```
#### 'Python']
```python filename="stream.py"
import os
from openai import OpenAI
client = OpenAI(
api\_key=os.getenv('AI\_GATEWAY\_API\_KEY'),
base\_url='https://ai-gateway.vercel.sh/v1',
)
stream = client.responses.create(
model='google/gemini-3.1-pro-preview',
input=[
{
'type': 'message',
'role': 'user',
'content': 'Write a haiku about debugging code.',
},
],
stream=True,
)
for event in stream:
if event.type == 'response.output\_text.delta':
print(event.delta, end='', flush=True)
```
## Streaming events
- `response.created` - Response initialized
- `response.output\_text.delta` - Text chunk received
- `response.output\_text.done` - Text generation complete
- `response.completed` - Full response complete with usage stats
---
[View full sitemap](/docs/sitemap)
