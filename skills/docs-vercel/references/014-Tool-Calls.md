# Tool Calls

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/tool-calling

---
title: Tool Calls
product: vercel
url: /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/tool-calling
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/tool-calling"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api
- /docs/ai-gateway/sdks-and-apis
related:
[]
summary: Use function calling with the Anthropic Messages API to allow models to call tools and functions.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Tool Calls
The Anthropic Messages API supports function calling, allowing models to call tools and functions.
Example request
#### cURL
```bash filename="tool-calls.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/messages" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-opus-5",
"max\_tokens": 1024,
"tools": [
{
"name": "get\_weather",
"description": "Get the current weather in a given location",
"input\_schema": {
"type": "object",
"properties": {
"location": {
"type": "string",
"description": "The city and state, e.g. San Francisco, CA"
},
"unit": {
"type": "string",
"enum": [
"celsius",
"fahrenheit"
],
"description": "The unit for temperature"
}
},
"required": [
"location"
]
}
}
],
"messages": [
{
"role": "user",
"content": "What is the weather like in San Francisco?"
}
]
}'
```
#### TypeScript
```typescript filename="tool-calls.ts"
import Anthropic from '@anthropic-ai/sdk';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const anthropic = new Anthropic({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh',
});
const message = await anthropic.messages.create({
model: 'anthropic/claude-opus-5',
max\_tokens: 1024,
tools: [
{
name: 'get\_weather',
description: 'Get the current weather in a given location',
input\_schema: {
type: 'object',
properties: {
location: {
type: 'string',
description: 'The city and state, e.g. San Francisco, CA',
},
unit: {
type: 'string',
enum: ['celsius', 'fahrenheit'],
description: 'The unit for temperature',
},
},
required: ['location'],
},
},
],
messages: [
{
role: 'user',
content: 'What is the weather like in San Francisco?',
},
],
});
console.log('Response:', JSON.stringify(message.content, null, 2));
```
#### Python
```python filename="tool-calls.py"
import os
import anthropic
api\_key = os.getenv('AI\_GATEWAY\_API\_KEY') or os.getenv('VERCEL\_OIDC\_TOKEN')
client = anthropic.Anthropic(
api\_key=api\_key,
base\_url='https://ai-gateway.vercel.sh'
)
message = client.messages.create(
model='anthropic/claude-opus-5',
max\_tokens=1024,
tools=[
{
'name': 'get\_weather',
'description': 'Get the current weather in a given location',
'input\_schema': {
'type': 'object',
'properties': {
'location': {
'type': 'string',
'description': 'The city and state, e.g. San Francisco, CA'
},
'unit': {
'type': 'string',
'enum': ['celsius', 'fahrenheit'],
'description': 'The unit for temperature'
}
},
'required': ['location']
}
}
],
messages=[
{
'role': 'user',
'content': 'What is the weather like in San Francisco?'
}
],
)
print('Response:', message.content)
```
Tool call response format
When the model makes tool calls, the response includes tool use blocks:
```json
{
"id": "msg\_123",
"type": "message",
"role": "assistant",
"content": [
{
"type": "tool\_use",
"id": "toolu\_123",
"name": "get\_weather",
"input": {
"location": "San Francisco, CA",
"unit": "fahrenheit"
}
}
],
"model": "anthropic/claude-opus-5",
"stop\_reason": "tool\_use",
"usage": {
"input\_tokens": 82,
"output\_tokens": 45
}
}
```
---
[View full sitemap](/docs/sitemap)
