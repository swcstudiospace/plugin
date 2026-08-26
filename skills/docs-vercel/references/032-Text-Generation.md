# Text Generation

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/responses/text-generation

---
title: Text Generation
product: vercel
url: /docs/ai-gateway/sdks-and-apis/responses/text-generation
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/responses/text-generation"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/responses
- /docs/ai-gateway/sdks-and-apis
related:
[]
summary: Generate text responses with the OpenAI Responses API through AI Gateway.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Text Generation
Set your SDK's base URL to AI Gateway and use your API key for authentication:
#### \['cURL'
```bash filename="basic.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/responses" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-sonnet-5",
"input": "What is the capital of France?"
}'
```
#### 'TypeScript'
```typescript filename="basic.ts"
import OpenAI from 'openai';
const client = new OpenAI({
apiKey: process.env.AI\_GATEWAY\_API\_KEY,
baseURL: 'https://ai-gateway.vercel.sh/v1',
});
const response = await client.responses.create({
model: 'anthropic/claude-sonnet-5',
input: 'What is the capital of France?',
});
console.log(response.output\_text);
```
#### 'Python']
```python filename="basic.py"
import os
from openai import OpenAI
client = OpenAI(
api\_key=os.getenv('AI\_GATEWAY\_API\_KEY'),
base\_url='https://ai-gateway.vercel.sh/v1',
)
response = client.responses.create(
model='anthropic/claude-sonnet-5',
input='What is the capital of France?',
)
print(response.output\_text)
```
---
[View full sitemap](/docs/sitemap)
