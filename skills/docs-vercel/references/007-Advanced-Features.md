# Advanced Features

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/advanced

---
title: Advanced Features
product: vercel
url: /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/advanced
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/advanced"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api
- /docs/ai-gateway/sdks-and-apis
related:
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/reasoning
- /docs/ai-gateway/models-and-providers/provider-timeouts
- /docs/ai-gateway/models-and-providers/automatic-caching
summary: Advanced Anthropic API features including web search, provider timeouts, and automatic caching.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Advanced Features
Give Claude access to the web, bound how long a provider may take, and cache prompt prefixes between calls. For controlling how much Claude thinks before answering, see [Extended thinking](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/reasoning).
## Web search
Use the built-in web search tool to give the model access to current information from the web.
Example request
#### cURL
```bash filename="web-search.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/messages" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-opus-5",
"max\_tokens": 2048,
"tools": [
{
"type": "web\_search\_20250305",
"name": "web\_search"
}
],
"messages": [
{
"role": "user",
"content": "What are the latest developments in quantum computing?"
}
]
}'
```
#### TypeScript
```typescript filename="web-search.ts"
import Anthropic from '@anthropic-ai/sdk';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const anthropic = new Anthropic({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh',
});
const message = await anthropic.messages.create({
model: 'anthropic/claude-opus-5',
max\_tokens: 2048,
tools: [
{
type: 'web\_search\_20250305',
name: 'web\_search',
},
],
messages: [
{
role: 'user',
content: 'What are the latest developments in quantum computing?',
},
],
});
for (const block of message.content) {
if (block.type === 'text') {
console.log(block.text);
} else if (block.type === 'web\_search\_tool\_result') {
console.log('Search results received');
}
}
```
#### Python
```python filename="web-search.py"
import os
import anthropic
api\_key = os.getenv('AI\_GATEWAY\_API\_KEY') or os.getenv('VERCEL\_OIDC\_TOKEN')
client = anthropic.Anthropic(
api\_key=api\_key,
base\_url='https://ai-gateway.vercel.sh'
)
message = client.messages.create(
model='anthropic/claude-opus-5',
max\_tokens=2048,
tools=[
{
'type': 'web\_search\_20250305',
'name': 'web\_search',
}
],
messages=[
{
'role': 'user',
'content': 'What are the latest developments in quantum computing?'
}
],
)
for block in message.content:
if block.type == 'text':
print(block.text)
elif block.type == 'web\_search\_tool\_result':
print('Search results received')
```
## Provider timeouts
You can set per-provider timeouts for BYOK credentials to trigger fast failover when a provider is slow to respond. Pass `providerTimeouts` in `providerOptions.gateway`:
```json
"providerOptions": {
"gateway": {
"providerTimeouts": {
"byok": { "anthropic": 3000, "bedrock": 5000 }
}
}
}
```
For full details, limits, and response metadata, see [Provider Timeouts](/docs/ai-gateway/models-and-providers/provider-timeouts).
## Automatic caching
Use `caching: 'auto'` in `providerOptions.gateway` to let AI Gateway automatically add `cache\_control` breakpoints for Anthropic models. This removes the need to manually mark cacheable content.
For full details, supported providers, and examples, see [Automatic Caching](/docs/ai-gateway/models-and-providers/automatic-caching).
---
[View full sitemap](/docs/sitemap)
