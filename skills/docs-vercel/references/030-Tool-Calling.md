# Tool Calling

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/responses/tool-calling

---
title: Tool Calling
product: vercel
url: /docs/ai-gateway/sdks-and-apis/responses/tool-calling
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/responses/tool-calling"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/responses
- /docs/ai-gateway/sdks-and-apis
related:
[]
summary: Define tools the model can call with the OpenAI Responses API.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Tool Calling
Define tools with JSON Schema parameters. The model can call them, and you can feed the results back in a follow-up request:
#### \['cURL'
```bash filename="tool-calls.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/responses" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "openai/gpt-5.6-sol",
"input": "What is the weather in San Francisco?",
"tools": [
{
"type": "function",
"name": "get\_weather",
"description": "Get the current weather for a location",
"strict": true,
"parameters": {
"type": "object",
"properties": {
"location": {
"type": "string"
}
},
"required": [
"location"
],
"additionalProperties": false
}
}
]
}'
```
#### 'TypeScript'
```typescript filename="tools.ts"
import OpenAI from 'openai';
const client = new OpenAI({
apiKey: process.env.AI\_GATEWAY\_API\_KEY,
baseURL: 'https://ai-gateway.vercel.sh/v1',
});
const response = await client.responses.create({
model: 'openai/gpt-5.6-sol',
input: 'What is the weather in San Francisco?',
tools: [
{
type: 'function',
name: 'get\_weather',
description: 'Get the current weather for a location',
strict: true,
parameters: {
type: 'object',
properties: {
location: { type: 'string' },
},
required: ['location'],
additionalProperties: false,
},
},
],
});
// The model returns function\_call items in the output
for (const item of response.output) {
if (item.type === 'function\_call') {
console.log(`Call: ${item.name}(${item.arguments})`);
}
}
```
#### 'Python']
```python filename="tools.py"
import os
import json
from openai import OpenAI
client = OpenAI(
api\_key=os.getenv('AI\_GATEWAY\_API\_KEY'),
base\_url='https://ai-gateway.vercel.sh/v1',
)
response = client.responses.create(
model='openai/gpt-5.6-sol',
input='What is the weather in San Francisco?',
tools=[
{
'type': 'function',
'name': 'get\_weather',
'description': 'Get the current weather for a location',
'strict': True,
'parameters': {
'type': 'object',
'properties': {
'location': {'type': 'string'},
},
'required': ['location'],
'additionalProperties': False,
},
},
],
)
for item in response.output:
if item.type == 'function\_call':
print(f'Call: {item.name}({item.arguments})')
```
To continue the conversation with tool results, include the function call and its output in the next request's `input` array:
#### \['cURL'
```bash filename="tool-followup.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/responses" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "openai/gpt-5.6-sol",
"input": [
{ "role": "user", "content": "What is the weather in San Francisco?" },
{
"type": "function\_call",
"call\_id": "call\_abc123",
"name": "get\_weather",
"arguments": "{\"location\": \"San Francisco, CA\"}"
},
{
"type": "function\_call\_output",
"call\_id": "call\_abc123",
"output": "{\"temperature\": 68, \"condition\": \"Sunny\"}"
}
],
"tools": [
{
"type": "function",
"name": "get\_weather",
"description": "Get the current weather for a location",
"parameters": {
"type": "object",
"properties": {
"location": { "type": "string" }
},
"required": ["location"]
}
}
]
}'
```
#### 'TypeScript'
```typescript
const functionCall = response.output.find(
(item) => item.type === 'function\_call',
);
const followup = await client.responses.create({
model: 'openai/gpt-5.6-sol',
input: [
{ role: 'user', content: 'What is the weather in San Francisco?' },
{
type: 'function\_call',
id: functionCall.id,
call\_id: functionCall.call\_id,
name: functionCall.name,
arguments: functionCall.arguments,
},
{
type: 'function\_call\_output',
call\_id: functionCall.call\_id,
output: JSON.stringify({ temperature: 68, condition: 'Sunny' }),
},
],
tools: [
/\* same tools as above \*/
],
});
console.log(followup.output\_text);
```
#### 'Python']
```python
import json
function\_call = next(
item for item in response.output if item.type == 'function\_call'
)
followup = client.responses.create(
model='openai/gpt-5.6-sol',
input=[
{'role': 'user', 'content': 'What is the weather in San Francisco?'},
{
'type': 'function\_call',
'id': function\_call.id,
'call\_id': function\_call.call\_id,
'name': function\_call.name,
'arguments': function\_call.arguments,
},
{
'type': 'function\_call\_output',
'call\_id': function\_call.call\_id,
'output': json.dumps({'temperature': 68, 'condition': 'Sunny'}),
},
],
tools=[
# same tools as above
],
)
print(followup.output\_text)
```
---
[View full sitemap](/docs/sitemap)
