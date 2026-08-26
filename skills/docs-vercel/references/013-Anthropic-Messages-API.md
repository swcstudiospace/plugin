# Anthropic Messages API

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api

---
title: Anthropic Messages API
product: vercel
url: /docs/ai-gateway/sdks-and-apis/anthropic-messages-api
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis
- /docs/ai-gateway
related:
- /docs/ai-gateway/coding-agents/claude-code
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/messages
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/streaming
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/tool-calling
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/reasoning
summary: Use the Anthropic Messages API with AI Gateway for seamless integration with Anthropic SDK tools.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Anthropic Messages API
AI Gateway provides Anthropic Messages API endpoints, so you can use the Anthropic SDK and tools like [Claude Code](https://www.claude.com/product/claude-code) through a unified gateway with only a URL change.
The Anthropic Messages API implements the same specification as the [Anthropic Messages API](https://docs.anthropic.com/en/api/messages).
For more on using AI Gateway with Claude Code, see the [Claude Code instructions](/docs/ai-gateway/coding-agents/claude-code).
## Base URL
The Anthropic Messages API is available at the following base URL:
```
https://ai-gateway.vercel.sh
```
## Authentication
The Anthropic Messages API supports the same authentication methods as the main AI Gateway:
- \*\*API key\*\*: Use your AI Gateway API key with the `x-api-key` header or `Authorization: Bearer ` header
- \*\*OIDC token\*\*: Use your Vercel OIDC token with the `Authorization: Bearer ` header
You only need to use one of these forms of authentication. If an API key is specified it will take precedence over any OIDC token, even if the API key is invalid.
## Supported endpoints
The AI Gateway supports the following Anthropic Messages API endpoints:
- [`POST /v1/messages`](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/messages) - Create messages, with support for [streaming](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/streaming), [tool calling](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/tool-calling), [extended thinking](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/reasoning), [structured outputs](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/structured-outputs), and [images](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/images)
- `POST /v1/messages/count\_tokens` - [Count tokens](https://docs.anthropic.com/en/docs/build-with-claude/token-counting) in a message before sending it to Claude, for managing context windows and costs
For advanced features, see:
- [Extended thinking](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/reasoning) - Configure how much Claude thinks before answering
- [Advanced features](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/advanced) - Web search, provider timeouts, and automatic caching
- [Structured outputs](/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/structured-outputs) - JSON Schema-constrained responses
## Configuring Claude Code
[Claude Code](https://code.claude.com/docs) is Anthropic's agentic coding tool. You can configure it to use Vercel AI Gateway, enabling you to:
- Route requests through multiple AI providers
- Monitor traffic and spend in your AI Gateway Overview
- View detailed traces in Vercel Observability under AI
- Use any model available through the gateway
- ### Configure environment variables
Configure Claude Code to use the AI Gateway by setting these [environment variables](https://code.claude.com/docs/en/settings#environment-variables):
| Variable | Value |
| ---------------------- | ------------------------------ |
| `ANTHROPIC\_BASE\_URL` | `https://ai-gateway.vercel.sh` |
| `ANTHROPIC\_AUTH\_TOKEN` | Your AI Gateway API key |
| `ANTHROPIC\_API\_KEY` | `""` (empty string) |
> \*\*💡 Note:\*\* Setting `ANTHROPIC\_API\_KEY` to an empty string is important. Claude Code
> checks this variable first, and if it's set to a non-empty value, it will use
> that instead of `ANTHROPIC\_AUTH\_TOKEN`.
#### Option 1: Shell alias (simplest)
Add this alias to your `~/.zshrc` (or `~/.bashrc`):
```bash
alias claude-vercel='ANTHROPIC\_BASE\_URL="https://ai-gateway.vercel.sh" ANTHROPIC\_AUTH\_TOKEN="your-api-key-here" ANTHROPIC\_API\_KEY="" claude'
```
Then reload your shell:
```bash
source ~/.zshrc
```
#### Option 2: Wrapper script
For more flexibility (e.g., adding additional logic), create a wrapper script at `~/bin/claude-vercel`:
```bash filename="claude-vercel"
#!/usr/bin/env bash
# Routes Claude Code through Vercel AI Gateway
ANTHROPIC\_BASE\_URL="https://ai-gateway.vercel.sh" \
ANTHROPIC\_AUTH\_TOKEN="your-api-key-here" \
ANTHROPIC\_API\_KEY="" \
claude "$@"
```
Make it executable and ensure `~/bin` is in your PATH:
```bash
mkdir -p ~/bin
chmod +x ~/bin/claude-vercel
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```
- ### Run Claude Code
Run `claude-vercel` to start Claude Code with AI Gateway:
```bash
claude-vercel
```
Your requests will now be routed through Vercel AI Gateway.
## Integration with Anthropic SDK
You can use the AI Gateway's Anthropic Messages API with the official [Anthropic SDK](https://docs.anthropic.com/en/api/client-sdks). Point your client to the AI Gateway's base URL and use your AI Gateway [API key](/docs/ai-gateway/authentication#api-key) or [OIDC token](/docs/ai-gateway/authentication#oidc-token) for authentication.
> \*\*💡 Note:\*\* The examples and content in this section are not comprehensive. For complete
> documentation on available parameters, response formats, and advanced
> features, refer to the [Anthropic Messages
> API](https://docs.anthropic.com/en/api/messages) documentation.
#### cURL
```bash filename="client.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/messages" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-opus-5",
"max\_tokens": 1024,
"messages": [
{
"role": "user",
"content": "Hello, world!"
}
]
}'
```
#### TypeScript
```typescript filename="client.ts"
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({
apiKey: process.env.AI\_GATEWAY\_API\_KEY,
baseURL: 'https://ai-gateway.vercel.sh',
});
const message = await anthropic.messages.create({
model: 'anthropic/claude-opus-5',
max\_tokens: 1024,
messages: [{ role: 'user', content: 'Hello, world!' }],
});
```
#### Python
```python filename="client.py"
import os
import anthropic
client = anthropic.Anthropic(
api\_key=os.getenv('AI\_GATEWAY\_API\_KEY'),
base\_url='https://ai-gateway.vercel.sh'
)
message = client.messages.create(
model='anthropic/claude-opus-5',
max\_tokens=1024,
messages=[
{'role': 'user', 'content': 'Hello, world!'}
]
)
```
## Parameters
The messages endpoint supports the following parameters:
### Required parameters
- `model` (string): The model to use (e.g., `anthropic/claude-opus-5`)
- `max\_tokens` (integer): Maximum number of tokens to generate
- `messages` (array): Array of message objects with `role` and `content` fields
### Optional parameters
- `stream` (boolean): Whether to stream the response. Defaults to `false`
- `temperature` (number): Controls randomness in the output. Range: 0-1
- `top\_p` (number): Nucleus sampling parameter. Range: 0-1
- `top\_k` (integer): Top-k sampling parameter
- `stop\_sequences` (array): Stop sequences for the generation
- `tools` (array): Array of tool definitions for function calling
- `tool\_choice` (object): Controls which tools are called
- `thinking` (object): Extended thinking configuration
- `system` (string or array): System prompt
## Prompt caching
The gateway passes through the `cache\_control` parameter to Anthropic's [prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) feature. This is explicit caching: you specify cache breakpoints, and Anthropic handles storing and reusing cached content automatically.
> \*\*💡 Note:\*\* The `cache\_control` parameter is passed through to \*\*Anthropic\*\*, \*\*Vertex AI Anthropic\*\*, and \*\*Amazon Bedrock Anthropic\*\* models for explicit caching. Other providers or models with implicit caching work automatically without any configuration.
Example request
#### cURL
```bash filename="prompt-caching.sh"
CONTRACT=$(sed 's/"/\\"/g' contract.txt | tr '\n' ' ')
curl -X POST "https://ai-gateway.vercel.sh/v1/messages" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-opus-5",
"max\_tokens": 1024,
"system": [
{ "type": "text", "text": "You are a helpful assistant that analyzes documents." },
{
"type": "text",
"text": "'"$CONTRACT"'",
"cache\_control": { "type": "ephemeral" }
}
],
"messages": [
{ "role": "user", "content": "Summarize the key points from this document." }
]
}'
```
#### TypeScript
```typescript filename="caching.ts"
import fs from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const anthropic = new Anthropic({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh',
});
// Caching only pays off above a provider minimum, currently 1024 tokens for
// most Claude models. A short string is silently not cached.
const longDocumentContent = fs.readFileSync('./contract.txt', 'utf8');
const message = await anthropic.messages.create({
model: 'anthropic/claude-opus-5',
max\_tokens: 1024,
system: [
{
type: 'text',
text: 'You are a helpful assistant that analyzes documents.',
},
{
type: 'text',
text: longDocumentContent,
cache\_control: { type: 'ephemeral' },
},
],
messages: [
{
role: 'user',
content: 'Summarize the key points from this document.',
},
],
});
console.log(message.usage);
// {
// input\_tokens: 50,
// output\_tokens: 200,
// cache\_creation\_input\_tokens: 10000, // Tokens written to cache
// cache\_read\_input\_tokens: 0 // Tokens read from cache
// }
```
#### Python
```python filename="caching.py"
import os
import anthropic
api\_key = os.getenv('AI\_GATEWAY\_API\_KEY') or os.getenv('VERCEL\_OIDC\_TOKEN')
client = anthropic.Anthropic(
api\_key=api\_key,
base\_url='https://ai-gateway.vercel.sh'
)
# Caching only pays off above a provider minimum, currently 1024 tokens for
# most Claude models. A short string is silently not cached.
with open('contract.txt') as f:
long\_document\_content = f.read()
message = client.messages.create(
model='anthropic/claude-opus-5',
max\_tokens=1024,
system=[
{
'type': 'text',
'text': 'You are a helpful assistant that analyzes documents.',
},
{
'type': 'text',
'text': long\_document\_content, # Large content to cache
'cache\_control': {'type': 'ephemeral'},
},
],
messages=[
{
'role': 'user',
'content': 'Summarize the key points from this document.'
}
],
)
print(message.usage)
# {
# 'input\_tokens': 50,
# 'output\_tokens': 200,
# 'cache\_creation\_input\_tokens': 10000, # Tokens written to cache
# 'cache\_read\_input\_tokens': 0 # Tokens read from cache
# }
```
### Where to place cache breakpoints
Add `cache\_control: { type: 'ephemeral' }` to mark content that should be cached. You can place cache breakpoints on system messages, user message content, tool definitions, tool results, and assistant message content. Anthropic also supports automatic caching, where a single top-level `cache\_control` field automatically applies to the last cacheable block.
For the full list of cacheable locations and automatic caching details, see the [Anthropic prompt caching docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching).
### Cache behavior
- \*\*First request\*\*: Content up to the breakpoint is cached (`cache\_creation\_input\_tokens`)
- \*\*Subsequent requests\*\*: Matching prefixes are read from cache (`cache\_read\_input\_tokens`)
- \*\*TTL\*\*: Cached content expires after 5 minutes, refreshed on each cache hit
## Configuring the Claude Agent SDK
The [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) (`@anthropic-ai/claude-agent-sdk`) lets you build agents with the same tools and agentic loop that power Claude Code. Because the SDK spawns Claude Code as a subprocess, it inherits the same `ANTHROPIC\_\*` environment variables described above, so your agent code needs no gateway-specific configuration:
```ts filename="agent.ts"
import { query } from '@anthropic-ai/claude-agent-sdk';
for await (const message of query({
prompt: 'Find and fix the bug in auth.ts',
options: { allowedTools: ['Read', 'Edit', 'Bash'] },
})) {
console.log(message);
}
```
Refer to the [Claude Agent SDK documentation](https://code.claude.com/docs/en/agent-sdk/quickstart) for more details.
### Passing AI Gateway options
The Agent SDK respects any [environment variable the Claude Code CLI reads](https://code.claude.com/docs/en/env-vars), including these two for working with AI Gateway:
| Variable | Purpose |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLAUDE\_CODE\_DISABLE\_EXPERIMENTAL\_BETAS` | Strips Anthropic-specific `anthropic-beta` headers and beta tool-schema fields from requests. Set to `1` when routing through providers like Bedrock or Vertex AI that reject those fields. |
| `CLAUDE\_CODE\_EXTRA\_BODY` | Merges a JSON object into the top level of every request body. Use it to pass [`providerOptions`](/docs/ai-gateway/models-and-providers/provider-options) like [`order`, `only`, and `sort`](/docs/ai-gateway/models-and-providers/provider-options#provider-filtering-ordering-and-sorting). |
For example, to restrict requests to Amazon Bedrock only, set these alongside the `ANTHROPIC\_\*` variables in your environment:
```bash
CLAUDE\_CODE\_DISABLE\_EXPERIMENTAL\_BETAS=1
CLAUDE\_CODE\_EXTRA\_BODY='{"providerOptions":{"gateway":{"only":["bedrock"]}}}'
```
## Error handling
The API returns standard HTTP status codes and error responses:
### Common error codes
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid or missing authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Model or endpoint not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
### Error response format
```json
{
"type": "error",
"error": {
"type": "invalid\_request\_error",
"message": "Invalid request: missing required parameter 'max\_tokens'"
}
}
```
---
[View full sitemap](/docs/sitemap)
