# Streaming

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/responses/streaming

---
title: Streaming
product: vercel
url: /docs/ai-gateway/sdks-and-apis/responses/streaming
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/responses/streaming"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/responses
- /docs/ai-gateway/sdks-and-apis
related:
[]
summary: Stream tokens as they are generated with the OpenAI Responses API.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Streaming
Set `stream: true` to receive tokens as they're generated. The SDK returns an async iterator of server-sent events:
#### \['cURL'
```bash filename="stream.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/responses" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "openai/gpt-5.6-sol",
"input": "Write a haiku about programming.",
"stream": true
}'
```
#### 'TypeScript'
```typescript filename="stream.ts"
import OpenAI from 'openai';
const client = new OpenAI({
apiKey: process.env.AI\_GATEWAY\_API\_KEY,
baseURL: 'https://ai-gateway.vercel.sh/v1',
});
const stream = await client.responses.create({
model: 'openai/gpt-5.6-sol',
input: 'Write a haiku about programming.',
stream: true,
});
for await (const event of stream) {
if (event.type === 'response.output\_text.delta') {
process.stdout.write(event.delta);
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
model='openai/gpt-5.6-sol',
input='Write a haiku about programming.',
stream=True,
)
for event in stream:
if event.type == 'response.output\_text.delta':
print(event.delta, end='', flush=True)
```
---
[View full sitemap](/docs/sitemap)
