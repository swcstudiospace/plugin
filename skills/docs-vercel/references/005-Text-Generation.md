# Text Generation

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/openresponses/text-generation

---
title: Text Generation
product: vercel
url: /docs/ai-gateway/sdks-and-apis/openresponses/text-generation
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/openresponses/text-generation"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/openresponses
- /docs/ai-gateway/sdks-and-apis
related:
- /docs/ai-gateway/sdks-and-apis/openresponses
summary: Generate text responses using the OpenResponses API.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Text Generation
Use the [OpenResponses API](/docs/ai-gateway/sdks-and-apis/openresponses) to generate text responses from AI models. The `input` array contains message objects with a `role` (user or assistant) and `content` field. The model processes the input and returns a response with the generated text.
#### \['cURL'
```bash filename="text-generation.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/responses" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "openai/gpt-5.6-sol",
"input": [
{
"type": "message",
"role": "user",
"content": "Why do developers prefer dark mode?"
}
]
}'
```
#### 'TypeScript'
```typescript filename="generate.ts"
const apiKey = process.env.AI\_GATEWAY\_API\_KEY;
const response = await fetch('https://ai-gateway.vercel.sh/v1/responses', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
Authorization: `Bearer ${apiKey}`,
},
body: JSON.stringify({
model: 'openai/gpt-5.6-sol',
input: [
{
type: 'message',
role: 'user',
content: 'Why do developers prefer dark mode?',
},
],
}),
});
const result = await response.json();
```
#### 'Python']
```python filename="generate.py"
import os
from openai import OpenAI
client = OpenAI(
api\_key=os.getenv('AI\_GATEWAY\_API\_KEY'),
base\_url='https://ai-gateway.vercel.sh/v1',
)
response = client.responses.create(
model='openai/gpt-5.6-sol',
input=[
{
'type': 'message',
'role': 'user',
'content': 'Why do developers prefer dark mode?',
},
],
)
message = next(item for item in response.output if item.type == 'message')
print(message.content[0].text)
```
## Response format
The response includes the generated text in the `output` array, along with token usage information.
```json
{
"id": "resp\_abc123",
"object": "response",
"model": "openai/gpt-5.6-sol",
"output": [
{
"type": "message",
"role": "assistant",
"content": [
{
"type": "output\_text",
"text": "Habit and aesthetics reinforce the preference, but ergonomics and contrast are the primary drivers."
}
]
}
],
"usage": {
"input\_tokens": 14,
"output\_tokens": 18
}
}
```
---
[View full sitemap](/docs/sitemap)
