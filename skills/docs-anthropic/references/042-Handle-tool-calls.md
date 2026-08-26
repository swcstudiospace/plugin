# Handle tool calls

Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls.md

# Handle tool calls
Parse tool\_use blocks, format tool\_result responses, and handle errors with is\_error.
---
This page covers the tool-call lifecycle: reading `tool\_use` blocks from Claude's response, formatting `tool\_result` blocks in your reply, and signaling errors. For the SDK abstraction that handles this automatically, see [Tool Runner](/docs/en/agents-and-tools/tool-use/tool-runner).
\*\*Simpler with Tool Runner\*\*: The manual tool handling described on this page is automatically managed by [Tool Runner](/docs/en/agents-and-tools/tool-use/tool-runner). Use this page when you need custom control over tool execution.
Claude's response differs based on whether it uses a [client or server tool](/docs/en/agents-and-tools/tool-use/overview#how-tool-use-works).
## Handling results from client tools
The response will have a `stop\_reason` of `tool\_use` and one or more `tool\_use` content blocks that include:
\* `id`: A unique identifier for this particular tool use block. This will be used to match up the tool results later.
\* `name`: The name of the tool being used.
\* `input`: An object containing the input being passed to the tool, conforming to the tool's `input\_schema`.
```json JSON
{
"id": "msg\_01Aq9w938a90dw8q",
"model": "claude-opus-5",
"stop\_reason": "tool\_use",
"role": "assistant",
"content": [
{
"type": "text",
"text": "I'll check the current weather in San Francisco for you."
},
{
"type": "tool\_use",
"id": "toolu\_01A09q90qw90lq917835lq9",
"name": "get\_weather",
"input": { "location": "San Francisco, CA", "unit": "celsius" }
}
]
}
```
When you receive a tool use response for a client tool, you should:
1. Extract the `name`, `id`, and `input` from the `tool\_use` block.
2. Run the actual tool in your codebase corresponding to that tool name, passing in the tool `input`.
3. Continue the conversation by sending a new message with the `role` of `user`, and a `content` block containing the `tool\_result` type and the following information:
\* `tool\_use\_id`: The `id` of the tool use request this is a result for.
\* `content` (optional): The result of the tool, as a string (for example, `"content": "15 degrees"`), a list of nested content blocks (for example, `"content": [{"type": "text", "text": "15 degrees"}]`), or a list of document blocks (for example, `"content": [{"type": "document", "source": {"type": "text", "media\_type": "text/plain", "data": "15 degrees"}}]`). These content blocks can use the `text`, `image`, `document`, or [`search\_result`](/docs/en/build-with-claude/search-results) types.
\* `is\_error` (optional): Set to `true` if the tool execution resulted in an error.
\*\*Important formatting requirements\*\*:
\* Tool result blocks must immediately follow their corresponding tool use blocks in the message history. You cannot include any messages between the assistant's tool use message and the user's tool result message.
\* In the user message containing tool results, the tool\\_result blocks must come FIRST in the content array. Any text must come AFTER all tool results.
\* If the assistant turn also called a [server tool](/docs/en/agents-and-tools/tool-use/server-tools) that has no result block yet, the user message must contain only `tool\_result` blocks. Text after the results ends the turn early; for a server tool Claude called directly, the request then fails with a 400 error that names the unresolved server tool. See [Stop reasons and fallback](/docs/en/build-with-claude/handling-stop-reasons#tool-use).
For example, this will cause a 400 error:
```json
{
"role": "user",
"content": [
{ "type": "text", "text": "Here are the results:" }, // ❌ Text before tool\_result
{ "type": "tool\_result", "tool\_use\_id": "toolu\_01" /\* ... \*/ }
]
}
```
This is correct when the assistant turn calls only client tools:
```json
{
"role": "user",
"content": [
{ "type": "tool\_result", "tool\_use\_id": "toolu\_01" /\* ... \*/ },
{ "type": "text", "text": "What should I do next?" } // ✅ Text after tool\_result
]
}
```
If you receive an error like "tool\\_use ids were found without tool\\_result blocks immediately after", check that your tool results are formatted correctly.

Tool results often carry content from sources outside your control: web pages, inbound email, user uploads, third-party APIs. Treat that content as untrusted: an attacker who can influence it may embed instructions that try to redirect Claude (indirect prompt injection). Keep untrusted content inside `tool\_result` blocks rather than `system` prompts or plain user `text` blocks, and see [Mitigate jailbreaks and prompt injections](/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks#indirect-prompt-injection) for further hardening.

```json JSON
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01A09q90qw90lq917835lq9",
"content": "15 degrees"
}
]
}
```

```json JSON
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01A09q90qw90lq917835lq9",
"content": [
{ "type": "text", "text": "15 degrees" },
{
"type": "image",
"source": {
"type": "base64",
"media\_type": "image/jpeg",
"data": "/9j/4AAQSkZJRg..."
}
}
]
}
]
}
```

```json JSON
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01A09q90qw90lq917835lq9"
}
]
}
```

```json JSON
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01A09q90qw90lq917835lq9",
"content": [
{ "type": "text", "text": "The weather is" },
{
"type": "document",
"source": {
"type": "text",
"media\_type": "text/plain",
"data": "15 degrees"
}
}
]
}
]
}
```
After receiving the tool result, Claude will use that information to continue generating a response to the original user prompt.
## Handling results from server tools
Claude executes the tool internally and incorporates the results directly into its response without requiring additional user interaction.
A response can contain both a client `tool\_use` block and a `server\_tool\_use` block that has no result block. That server tool call is not finished yet, and its result block arrives in a later response. Reply with a user message that contains only the `tool\_result` blocks for the client tools and keep the same `tools` array; for a server tool Claude called directly, the API runs it on that request and the next response starts with its result block. See [Stop reasons and fallback](/docs/en/build-with-claude/handling-stop-reasons#tool-use).

\*\*Differences from other APIs\*\*
Unlike APIs that separate tool use or use special roles like `tool` or `function`, the Claude API integrates tools directly into the `user` and `assistant` message structure.
Messages contain arrays of `text`, `image`, `tool\_use`, and `tool\_result` blocks. `user` messages include client content and `tool\_result`, while `assistant` messages contain AI-generated content and `tool\_use`.
## Handling errors with is\\_error
There are a few different types of errors that can occur when using tools with Claude:

If the tool itself throws an error during execution (for example, a network error when fetching weather data), you can return the error message in the `content` along with `"is\_error": true`:
```json JSON
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01A09q90qw90lq917835lq9",
"content": "ConnectionError: the weather service API is not available (HTTP 500)",
"is\_error": true
}
]
}
```
Claude will then incorporate this error into its response to the user. For example: "I'm sorry, I was unable to retrieve the current weather because the weather service API is not available. Please try again later."
Write instructive error messages. Instead of generic errors like `"failed"`, include what went wrong and what Claude should try next, e.g., `"Rate limit exceeded. Retry after 60 seconds."` This gives Claude the context it needs to recover or adapt without guessing.

If Claude's attempted use of a tool is invalid (for example, missing required parameters), it usually means that there wasn't enough information for Claude to use the tool correctly. Your best bet during development is to try the request again with more-detailed `description` values in your tool definitions.
However, you can also continue the conversation forward with a `tool\_result` that indicates the error, and Claude will try to use the tool again with the missing information filled in:
```json JSON
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01A09q90qw90lq917835lq9",
"content": "Error: Missing required 'location' parameter",
"is\_error": true
}
]
}
```
If a tool request is invalid or missing parameters, Claude will retry 2-3 times with corrections before apologizing to the user.
To eliminate invalid tool calls entirely, use [strict tool use](/docs/en/agents-and-tools/tool-use/strict-tool-use) with `strict: true` on your tool definitions. This guarantees that tool inputs will always match your schema exactly, preventing missing parameters and type mismatches.

When server tools encounter errors (for example, network issues with Web Search), Claude will transparently handle these errors and attempt to provide an alternative response or explanation to the user. Unlike client tools, you do not need to handle `is\_error` results for server tools.
For web search specifically, possible error codes include:
\* `too\_many\_requests`: Rate limit exceeded
\* `invalid\_input`: Invalid search query parameter
\* `max\_uses\_exceeded`: Maximum web search tool uses exceeded
\* `query\_too\_long`: Query exceeds maximum length
\* `unavailable`: An internal error occurred
## Next steps

Handle responses where Claude calls several tools in a single turn.

Let the SDK manage the `tool\_use` loop, result formatting, and retries for you.

Write schemas and descriptions that steer Claude toward the right tool.
