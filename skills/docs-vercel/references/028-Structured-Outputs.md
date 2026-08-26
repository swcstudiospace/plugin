# Structured Outputs

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/responses/structured-outputs

---
title: Structured Outputs
product: vercel
url: /docs/ai-gateway/sdks-and-apis/responses/structured-outputs
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/responses/structured-outputs"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/responses
- /docs/ai-gateway/sdks-and-apis
related:
[]
summary: Constrain a response to a JSON schema with the OpenAI Responses API.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Structured Outputs
Use `text.format` to constrain the model's output to a JSON schema:
#### \['cURL'
```bash filename="structured-output.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/responses" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "openai/gpt-5.6-sol",
"input": "List 3 colors with their hex codes.",
"text": {
"format": {
"type": "json\_schema",
"name": "colors",
"strict": true,
"schema": {
"type": "object",
"properties": {
"colors": {
"type": "array",
"items": {
"type": "object",
"properties": {
"name": {
"type": "string"
},
"hex": {
"type": "string"
}
},
"required": [
"name",
"hex"
],
"additionalProperties": false
}
}
},
"required": [
"colors"
],
"additionalProperties": false
}
}
}
}'
```
#### 'TypeScript'
```typescript filename="structured.ts"
import OpenAI from 'openai';
const client = new OpenAI({
apiKey: process.env.AI\_GATEWAY\_API\_KEY,
baseURL: 'https://ai-gateway.vercel.sh/v1',
});
const response = await client.responses.create({
model: 'openai/gpt-5.6-sol',
input: 'List 3 colors with their hex codes.',
text: {
format: {
type: 'json\_schema',
name: 'colors',
strict: true,
schema: {
type: 'object',
properties: {
colors: {
type: 'array',
items: {
type: 'object',
properties: {
name: { type: 'string' },
hex: { type: 'string' },
},
required: ['name', 'hex'],
additionalProperties: false,
},
},
},
required: ['colors'],
additionalProperties: false,
},
},
},
});
const data = JSON.parse(response.output\_text);
console.log(data.colors);
```
#### 'Python']
```python filename="structured.py"
import os
import json
from openai import OpenAI
client = OpenAI(
api\_key=os.getenv('AI\_GATEWAY\_API\_KEY'),
base\_url='https://ai-gateway.vercel.sh/v1',
)
response = client.responses.create(
model='openai/gpt-5.6-sol',
input='List 3 colors with their hex codes.',
text={
'format': {
'type': 'json\_schema',
'name': 'colors',
'strict': True,
'schema': {
'type': 'object',
'properties': {
'colors': {
'type': 'array',
'items': {
'type': 'object',
'properties': {
'name': {'type': 'string'},
'hex': {'type': 'string'},
},
'required': ['name', 'hex'],
'additionalProperties': False,
},
},
},
'required': ['colors'],
'additionalProperties': False,
},
},
},
)
data = json.loads(response.output\_text)
print(data['colors'])
```
---
[View full sitemap](/docs/sitemap)
