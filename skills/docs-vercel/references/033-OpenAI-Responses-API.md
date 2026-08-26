# OpenAI Responses API

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/responses

---
title: OpenAI Responses API
product: vercel
url: /docs/ai-gateway/sdks-and-apis/responses
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/responses"
last\_updated: 2026-07-27
type: reference
prerequisites:
- /docs/ai-gateway/sdks-and-apis
- /docs/ai-gateway
related:
- /docs/ai-gateway/sdks-and-apis/openai-chat-completions
- /docs/ai-gateway/sdks-and-apis/responses/text-generation
- /docs/ai-gateway/sdks-and-apis/responses/streaming
- /docs/ai-gateway/sdks-and-apis/responses/tool-calling
- /docs/ai-gateway/sdks-and-apis/responses/structured-outputs
summary: Use the OpenAI Responses API with AI Gateway to generate text, call tools, stream tokens, and more across any supported provider.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# OpenAI Responses API
The [OpenAI Responses API](https://developers.openai.com/api/reference/responses/overview) is a modern alternative to the [Chat Completions API](/docs/ai-gateway/sdks-and-apis/openai-chat-completions). Point your OpenAI SDK to AI Gateway's base URL and use `provider/model` identifiers to route requests to OpenAI, Anthropic, Google, and more.
## Base URL
```
https://ai-gateway.vercel.sh/v1
```
## Authentication
The Responses API supports the same authentication methods as the main AI Gateway:
- \*\*API key\*\*: Use your AI Gateway API key with the `Authorization: Bearer ` header
- \*\*OIDC token\*\*: Use your Vercel OIDC token with the `Authorization: Bearer ` header
You only need to use one of these forms of authentication. If an API key is specified it will take precedence over any OIDC token, even if the API key is invalid.
## Getting started
Set your SDK's base URL to AI Gateway and use your API key for authentication. See [Text generation](/docs/ai-gateway/sdks-and-apis/responses/text-generation) for a complete first request.
## Supported features
- [Text generation](/docs/ai-gateway/sdks-and-apis/responses/text-generation) - Generate text responses from prompts
- [Streaming](/docs/ai-gateway/sdks-and-apis/responses/streaming) - Stream tokens as they're generated
- [Tool calling](/docs/ai-gateway/sdks-and-apis/responses/tool-calling) - Define tools the model can call
- [Structured outputs](/docs/ai-gateway/sdks-and-apis/responses/structured-outputs) - Constrain the response to a JSON schema
- [Reasoning](/docs/ai-gateway/sdks-and-apis/responses/reasoning) - Control how much a model thinks before answering
- [Images](/docs/ai-gateway/sdks-and-apis/responses/images) - Send images for analysis
## Streaming
Set `stream: true` to receive tokens as they're generated. See [Streaming](/docs/ai-gateway/sdks-and-apis/responses/streaming).
### WebSocket mode
For agent loops that make many requests in a row, you can hold one connection open and send each turn as a frame instead of opening a new HTTP request per turn. See [Responses API over WebSocket](/docs/ai-gateway/sdks-and-apis/responses/websockets).
## Tool calling
Define tools in `tools` and the model returns `function\_call` items you execute. See [Tool calling](/docs/ai-gateway/sdks-and-apis/responses/tool-calling).
## Structured output
Constrain the response to a JSON schema with `text.format`. See [Structured outputs](/docs/ai-gateway/sdks-and-apis/responses/structured-outputs).
## Reasoning
Set `reasoning.effort` to control how much the model thinks before answering. See [Reasoning](/docs/ai-gateway/sdks-and-apis/responses/reasoning).
## Parameters
### Required
| Parameter | Type | Description |
| --------- | --------------- | ------------------------------------------------------------------------------------------- |
| `model` | string | Model ID in `provider/model` format (e.g., `openai/gpt-5.6-sol`, `anthropic/claude-sonnet-5`) |
| `input` | string or array | A text string or array of input items (messages, function calls, function call outputs) |
### Optional
| Parameter | Type | Description |
| ---------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stream` | boolean | Stream tokens via server-sent events. Defaults to `false` |
| `max\_output\_tokens` | integer | Maximum number of tokens to generate |
| `temperature` | number | Controls randomness (0-2). Lower values are more deterministic |
| `top\_p` | number | Nucleus sampling (0-1) |
| `presence\_penalty` | number | Penalizes tokens that already appear in the text so far |
| `frequency\_penalty` | number | Penalizes tokens based on their frequency in the text so far |
| `instructions` | string | System-level instructions for the model |
| `tools` | array | Tool definitions for function calling |
| `tool\_choice` | string or object | Tool selection: `auto`, `required`, `none`, or a specific function |
| `parallel\_tool\_calls` | boolean | Allows the model to call multiple tools in a single turn |
| `allowed\_tools` | array | Subset of tool names the model can use for this request |
| `reasoning` | object | Reasoning config with `effort` (`none`, `minimal`, `low`, `medium`, `high`, `xhigh`). OpenAI models also support `summary` (`detailed`, `auto`, `concise`) to receive a text summary of the model's reasoning |
| `text` | object | Output format config, including `json\_schema` and `json\_object` for structured output |
| `truncation` | string | Truncation strategy for long inputs: `auto` or `disabled` |
| `previous\_response\_id` | string | ID of a previous response for multi-turn conversations |
| `store` | boolean | Stores the response for later retrieval |
| `metadata` | object | Up to 16 key-value pairs for tracking (keys max 64 chars, values max 512 chars) |
| `caching` | string | Enables [automatic prompt caching](/docs/ai-gateway/models-and-providers/automatic-caching). Only `auto` is supported |
| `cache\_anchor\_items` | integer | Declares how many leading input items stay unchanged so automatic caching can add a stable-prefix [cache anchor](/docs/ai-gateway/models-and-providers/automatic-caching#cache-anchor) |
| `cache\_ttl` | string | Sets the automatic [cache lifetime](/docs/ai-gateway/models-and-providers/automatic-caching#cache-lifetime). Accepts `5m` (five minutes) or `1h` (one hour) and requires `caching: 'auto'` |
| `prompt\_cache\_key` | string | Key to identify cached prompts (max 64 characters) |
## Error handling
The API returns standard HTTP status codes and error responses.
### Common error codes
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Invalid or missing authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Model or endpoint not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
### Error response format
When an error occurs, the API returns a JSON object with details about what went wrong.
```json
{
"error": {
"type": "invalid\_request\_error",
"message": "At least one user message is required in the input"
}
}
```
---
[View full sitemap](/docs/sitemap)
