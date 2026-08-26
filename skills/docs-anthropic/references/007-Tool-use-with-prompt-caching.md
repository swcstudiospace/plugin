# Tool use with prompt caching

Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-use-with-prompt-caching.md

# Tool use with prompt caching
Cache tool definitions across turns and understand what invalidates your cache.
---
This page covers prompt caching for tool definitions: where to place `cache\_control` breakpoints, how `defer\_loading` preserves your cache, and what invalidates it. For general prompt caching, see [Prompt caching](/docs/en/build-with-claude/prompt-caching).
## cache\\_control on tool definitions
Place `cache\_control: {"type": "ephemeral"}` on the last tool in your `tools` array. This caches the entire tool-definitions prefix, from the first tool through the marked breakpoint:
```json
{
"tools": [
{
"name": "get\_weather",
"description": "Get the current weather in a given location",
"input\_schema": {
"type": "object",
"properties": {
"location": { "type": "string" }
},
"required": ["location"]
}
},
{
"name": "get\_time",
"description": "Get the current time in a given time zone",
"input\_schema": {
"type": "object",
"properties": {
"timezone": { "type": "string" }
},
"required": ["timezone"]
},
"cache\_control": { "type": "ephemeral" }
}
]
}
```
For `mcp\_toolset`, the `cache\_control` breakpoint lands on the last tool in the set. You don't control tool order within an MCP toolset, so place the breakpoint on the `mcp\_toolset` entry itself and the API applies it to the final expanded tool.
## defer\\_loading and cache preservation
Deferred tools are not included in the system-prompt prefix. When the model discovers a deferred tool through [tool search](/docs/en/agents-and-tools/tool-use/tool-search-tool), the definition is appended inline as a `tool\_reference` block in the conversation history. The prefix is untouched, so prompt caching is preserved.
This means adding tools dynamically through tool search does not break your cache. You can start a conversation with a small set of always-loaded tools (cached), let the model discover additional tools as needed, and keep the same cache hit across every turn.
`defer\_loading` also acts independently of grammar construction for [strict mode](/docs/en/agents-and-tools/tool-use/strict-tool-use). The grammar builds from the full toolset regardless of which tools are deferred, so prompt caching and grammar caching are both preserved when tools load dynamically.
## What invalidates your cache
The cache follows a prefix hierarchy (`tools` → `system` → `messages`), so a change at one level invalidates that level and everything after it:
| Change | Invalidates |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modifying tool definitions | Entire cache (tools, system, messages) |
| Toggling web search or citations | System and messages caches |
| Changing `tool\_choice` | Messages cache |
| Changing `disable\_parallel\_tool\_use` | Messages cache |
| Toggling images present/absent | Messages cache |
| Changing thinking parameters | Messages cache always; tool and system caches too on models that render the thinking configuration ahead of them ([details](/docs/en/build-with-claude/thinking#thinking-and-prompt-caching)) |
| Changing `output\_config.effort` | Same as thinking parameters; setting the model's default explicitly is equivalent to omitting it |
If you need to vary `tool\_choice` mid-conversation, consider placing cache breakpoints before the variation point.
## Server tool results are cached automatically
When your request has prompt caching enabled and Claude uses a [server tool](/docs/en/agents-and-tools/tool-use/server-tools) such as web search, web fetch, or code execution, the API automatically places a cache breakpoint on the server tool result before running the next iteration of the agentic loop. This lets later iterations within the same request read the growing prefix from cache instead of reprocessing it.
This automatic breakpoint always uses the default 5-minute TTL, independent of any TTL you set on your own `cache\_control` markers. In the response `usage`, these writes appear under `cache\_creation.ephemeral\_5m\_input\_tokens`, so you may see 5-minute cache writes even when every `cache\_control` you set uses a 1-hour TTL.
This behavior only applies when your request already has at least one `cache\_control` marker. Requests without prompt caching do not receive the automatic breakpoint.
## Per-tool interaction table
| Tool | Caching considerations |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| [Web search](/docs/en/agents-and-tools/tool-use/web-search-tool) | Enabling or disabling invalidates the system and messages caches |
| [Web fetch](/docs/en/agents-and-tools/tool-use/web-fetch-tool) | Enabling or disabling invalidates the system and messages caches |
| [Code execution](/docs/en/agents-and-tools/tool-use/code-execution-tool) | Container state is independent of prompt cache |
| [Tool search](/docs/en/agents-and-tools/tool-use/tool-search-tool) | Discovered tools load as `tool\_reference` blocks, preserving prefix cache |
| [Computer use](/docs/en/agents-and-tools/tool-use/computer-use-tool) | Screenshot presence affects messages cache |
| [Text editor](/docs/en/agents-and-tools/tool-use/text-editor-tool) | Standard client tool, no special caching interaction |
| [Bash](/docs/en/agents-and-tools/tool-use/bash-tool) | Standard client tool, no special caching interaction |
| [Memory](/docs/en/agents-and-tools/tool-use/memory-tool) | Standard client tool, no special caching interaction |
## Next steps

Learn the full prompt caching model, including TTLs and pricing.

Load tools on demand without breaking your cache.

Browse all available tools and their parameters.
