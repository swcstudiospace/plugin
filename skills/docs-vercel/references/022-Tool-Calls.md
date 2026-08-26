# Tool Calls

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions/tool-calling

---
title: Tool Calls
product: vercel
url: /docs/ai-gateway/sdks-and-apis/openai-chat-completions/tool-calling
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions/tool-calling"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/openai-chat-completions
- /docs/ai-gateway/sdks-and-apis
related:
[]
summary: Use function calling with the Chat Completions API to enable models to call tools and functions through AI Gateway.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Tool Calls
The Chat Completions API supports function calling, allowing models to call tools and functions. This follows the same specification as the [OpenAI Function Calling API](https://platform.openai.com/docs/guides/function-calling).
#### Basic tool calls
#### cURL
```bash filename="tool-calls.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/chat/completions" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-opus-5",
"messages": [
{ "role": "user", "content": "What is the weather like in San Francisco?" }
],
"tools": [
{
"type": "function",
"function": {
"name": "get\_weather",
"description": "Get the current weather in a given location",
"parameters": {
"type": "object",
"properties": {
"location": {
"type": "string",
"description": "The city and state, e.g. San Francisco, CA"
},
"unit": {
"type": "string",
"enum": ["celsius", "fahrenheit"],
"description": "The unit for temperature"
}
},
"required": ["location"]
}
}
}
],
"tool\_choice": "auto",
"stream": false
}'
```
#### TypeScript
```typescript filename="tool-calls.ts"
import OpenAI from 'openai';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const openai = new OpenAI({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh/v1',
});
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
{
type: 'function',
function: {
name: 'get\_weather',
description: 'Get the current weather in a given location',
parameters: {
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
},
];
const completion = await openai.chat.completions.create({
model: 'anthropic/claude-opus-5',
messages: [
{
role: 'user',
content: 'What is the weather like in San Francisco?',
},
],
tools: tools,
tool\_choice: 'auto',
stream: false,
});
console.log('Assistant:', completion.choices[0].message.content);
console.log('Tool calls:', completion.choices[0].message.tool\_calls);
```
#### Python
```python filename="tool-calls.py"
import os
from openai import OpenAI
api\_key = os.getenv('AI\_GATEWAY\_API\_KEY') or os.getenv('VERCEL\_OIDC\_TOKEN')
client = OpenAI(
api\_key=api\_key,
base\_url='https://ai-gateway.vercel.sh/v1'
)
tools = [
{
'type': 'function',
'function': {
'name': 'get\_weather',
'description': 'Get the current weather in a given location',
'parameters': {
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
}
]
completion = client.chat.completions.create(
model='anthropic/claude-opus-5',
messages=[
{
'role': 'user',
'content': 'What is the weather like in San Francisco?'
}
],
tools=tools,
tool\_choice='auto',
stream=False,
)
print('Assistant:', completion.choices[0].message.content)
print('Tool calls:', completion.choices[0].message.tool\_calls)
```
> \*\*💡 Note:\*\* \*\*Controlling tool selection:\*\* By default, `tool\_choice` is set to `'auto'`, allowing the model to decide when to use tools. You can also:\* Set to `'none'` to disable tool calls
> \* Force a specific tool with: `tool\_choice: { type: 'function', function: { name: 'your\_function\_name' } }`
#### Tool call response format
When the model makes tool calls, the response includes tool call information:
```json
{
"id": "chatcmpl-123",
"object": "chat.completion",
"created": 1677652288,
"model": "anthropic/claude-opus-5",
"choices": [
{
"index": 0,
"message": {
"role": "assistant",
"content": null,
"tool\_calls": [
{
"id": "call\_123",
"type": "function",
"function": {
"name": "get\_weather",
"arguments": "{\"location\": \"San Francisco, CA\", \"unit\": \"celsius\"}"
}
}
]
},
"finish\_reason": "tool\_calls"
}
],
"usage": {
"prompt\_tokens": 82,
"completion\_tokens": 18,
"total\_tokens": 100
}
}
```
---
[View full sitemap](/docs/sitemap)
