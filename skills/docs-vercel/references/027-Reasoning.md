# Reasoning

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/responses/reasoning

---
title: Reasoning
product: vercel
url: /docs/ai-gateway/sdks-and-apis/responses/reasoning
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/responses/reasoning"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/responses
- /docs/ai-gateway/sdks-and-apis
related:
[]
summary: Control how much a model thinks before answering with the OpenAI Responses API.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Reasoning
For models that support reasoning, set the `reasoning` parameter to control how much effort the model spends thinking:
#### \['cURL'
```bash filename="reasoning.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/responses" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-sonnet-5",
"input": "Explain the Monty Hall problem step by step.",
"reasoning": {
"effort": "high"
},
"max\_output\_tokens": 2048
}'
```
#### 'TypeScript'
```typescript filename="reasoning.ts"
import OpenAI from 'openai';
const client = new OpenAI({
apiKey: process.env.AI\_GATEWAY\_API\_KEY,
baseURL: 'https://ai-gateway.vercel.sh/v1',
});
const response = await client.responses.create({
model: 'anthropic/claude-sonnet-5',
input: 'Explain the Monty Hall problem step by step.',
reasoning: {
effort: 'high',
},
max\_output\_tokens: 2048,
});
console.log(response.output\_text);
```
#### 'Python']
```python filename="reasoning.py"
import os
from openai import OpenAI
client = OpenAI(
api\_key=os.getenv('AI\_GATEWAY\_API\_KEY'),
base\_url='https://ai-gateway.vercel.sh/v1',
)
response = client.responses.create(
model='anthropic/claude-sonnet-5',
input='Explain the Monty Hall problem step by step.',
reasoning={
'effort': 'high',
},
max\_output\_tokens=2048,
)
print(response.output\_text)
```
The `effort` parameter accepts `none`, `minimal`, `low`, `medium`, `high`, or `xhigh`. AI Gateway maps this to provider-specific reasoning settings.
---
[View full sitemap](/docs/sitemap)
