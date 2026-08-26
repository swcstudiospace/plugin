# Messages

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/messages

---
title: Messages
product: vercel
url: /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/messages
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/messages"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api
- /docs/ai-gateway/sdks-and-apis
related:
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/streaming
summary: Create messages using the Anthropic Messages API format with support for streaming.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Messages
Create messages using the Anthropic Messages API format.
Endpoint
```
POST /v1/messages
```
### Basic message
Create a non-streaming message.
Example request
#### cURL
```bash filename="generate.sh"
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
"temperature": 0.7
}'
```
#### TypeScript
```typescript filename="generate.ts"
import Anthropic from '@anthropic-ai/sdk';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const anthropic = new Anthropic({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh',
});
const message = await anthropic.messages.create({
model: 'anthropic/claude-opus-5',
max\_tokens: 150,
messages: [
{
role: 'user',
content: 'Write a one-sentence bedtime story about a unicorn.',
},
],
temperature: 0.7,
});
console.log('Response:', message.content[0].text);
console.log('Usage:', message.usage);
```
#### Python
```python filename="generate.py"
import os
import anthropic
api\_key = os.getenv('AI\_GATEWAY\_API\_KEY') or os.getenv('VERCEL\_OIDC\_TOKEN')
client = anthropic.Anthropic(
api\_key=api\_key,
base\_url='https://ai-gateway.vercel.sh'
)
message = client.messages.create(
model='anthropic/claude-opus-5',
max\_tokens=150,
messages=[
{
'role': 'user',
'content': 'Write a one-sentence bedtime story about a unicorn.'
}
],
temperature=0.7,
)
print('Response:', message.content[0].text)
print('Usage:', message.usage)
```
Response format
```json
{
"id": "msg\_123",
"type": "message",
"role": "assistant",
"content": [
{
"type": "text",
"text": "Once upon a time, a gentle unicorn with a shimmering silver mane danced through moonlit clouds, sprinkling stardust dreams upon sleeping children below."
}
],
"model": "anthropic/claude-opus-5",
"stop\_reason": "end\_turn",
"usage": {
"input\_tokens": 15,
"output\_tokens": 28
}
}
```
### Streaming messages
Set `stream: true` to receive tokens as they are generated. See [Streaming](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/streaming) for the full example and the list of server-sent event types.
---
[View full sitemap](/docs/sitemap)
