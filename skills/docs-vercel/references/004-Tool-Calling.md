# Tool Calling

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/openresponses/tool-calling

---
title: Tool Calling
product: vercel
url: /docs/ai-gateway/sdks-and-apis/openresponses/tool-calling
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/openresponses/tool-calling"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/openresponses
- /docs/ai-gateway/sdks-and-apis
related:
- /docs/ai-gateway/sdks-and-apis/openresponses
summary: Define tools the model can call using the OpenResponses API.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Tool Calling
The [OpenResponses API](/docs/ai-gateway/sdks-and-apis/openresponses) supports tool calling to give models access to external functions. Define tools in your request with a name, description, and JSON schema for parameters. When the model determines it needs a tool to answer the user's question, it returns a `function\_call` output with the tool name and arguments for you to execute.
#### \['cURL'
```bash filename="tool-calls.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/responses" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "openai/gpt-5.6-sol",
"input": [
{
"type": "message",
"role": "user",
"content": "What is the weather like in New York?"
}
],
"tools": [
{
"type": "function",
"name": "get\_weather",
"description": "Get the current weather in a location",
"parameters": {
"type": "object",
"properties": {
"location": {
"type": "string",
"description": "The city and state, e.g. San Francisco, CA"
}
},
"required": [
"location"
]
}
}
],
"tool\_choice": "auto"
}'
```
#### 'TypeScript'
```typescript filename="tool-calls.ts"
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
content: 'What is the weather like in New York?',
},
],
tools: [
{
type: 'function',
name: 'get\_weather',
description: 'Get the current weather in a location',
parameters: {
type: 'object',
properties: {
location: {
type: 'string',
description: 'The city and state, e.g. San Francisco, CA',
},
},
required: ['location'],
},
},
],
tool\_choice: 'auto',
}),
});
```
#### 'Python']
```python filename="tool-calls.py"
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
'content': 'What is the weather like in New York?',
},
],
tools=[
{
'type': 'function',
'name': 'get\_weather',
'description': 'Get the current weather in a location',
'parameters': {
'type': 'object',
'properties': {
'location': {
'type': 'string',
'description': 'The city and state, e.g. San Francisco, CA',
},
},
'required': ['location'],
},
},
],
tool\_choice='auto',
)
```
## Tool call response
When the model decides to call a tool, the response includes a `function\_call` output:
```json
{
"output": [
{
"type": "function\_call",
"name": "get\_weather",
"arguments": "{\"location\": \"New York, NY\"}",
"call\_id": "call\_abc123"
}
]
}
```
## Tool choice options
- `auto` - The model decides whether to call a tool
- `required` - The model must call at least one tool
- `none` - The model cannot call any tools
---
[View full sitemap](/docs/sitemap)
