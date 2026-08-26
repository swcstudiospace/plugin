# Troubleshooting tool use

Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use.md

# Troubleshooting tool use
Fix the most common tool-use errors with symptom-to-fix diagnostic tables.
---
Symptom-to-fix tables for the most common tool-use errors. Each fix cross-references the page that owns the feature.
## Claude calls the wrong tool
| Symptom | Likely cause | Fix |
| ------------------------------------------ | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude calls tool A when you wanted tool B | Description ambiguity | Sharpen descriptions. Differentiate tools by WHEN to use them, not only WHAT they do. See [Define tools](/docs/en/agents-and-tools/tool-use/define-tools). |
| Claude never calls your tool | Tool name collision or overly-generic schema | Check for duplicate names across your tool list. Add `input\_examples` to make the intended use concrete. |
| Claude calls with wrong parameter types | Model guessing at ambiguous schema | Add `strict: true` (if your schema is in the supported subset) or add `input\_examples`. |
## Claude invents tool parameters
| Symptom | Likely cause | Fix |
| ------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Parameter that doesn't exist in your schema | Model over-generation without strict mode | Add `strict: true` if your schema is in the [supported subset](/docs/en/agents-and-tools/tool-use/strict-tool-use). |
| Parameter values outside your enum | Missing strict mode or too-large enum | Shrink the enum or add `input\_examples` showing valid choices. |
## Parallel tool calls don't work
| Symptom | Likely cause | Fix |
| ------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude calls tools sequentially when parallel would be better | Message history formatting | Send multiple `tool\_result` blocks in ONE user message, not one per turn. See [Parallel tool use](/docs/en/agents-and-tools/tool-use/parallel-tool-use). |
| `disable\_parallel\_tool\_use` seems ignored | Set too late in the conversation | Must be set on the request that returns `tool\_use`. Setting it on a later request has no effect on earlier tool calls. |
## Cache keeps invalidating
| Symptom | Likely cause | Fix |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Every request is a cache miss | `tool\_choice`, the thinking configuration, or `output\_config.effort` varying between requests | Keep `tool\_choice` stable or place the `cache\_control` breakpoint before the variation point; hold the thinking configuration and effort level constant for the life of a cached conversation. See [Tool use with prompt caching](/docs/en/agents-and-tools/tool-use/tool-use-with-prompt-caching) and [Thinking and prompt caching](/docs/en/build-with-claude/thinking#thinking-and-prompt-caching). |
| Adding a tool mid-conversation breaks cache | Tool prepended to the tools array | Use `defer\_loading: true` with tool search to append the tool inline instead of modifying the array head. |
## Errors at request time
| Error | Cause | Fix |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tool\_use ids were found without tool\_result blocks immediately after` | Missing `tool\_result` for some `tool\_use` ids, or `tool\_result` is not the first content block in the user message | Return one `tool\_result` for every `tool\_use` block in the assistant response. Put `tool\_result` blocks before any text. See [Handle tool calls](/docs/en/agents-and-tools/tool-use/handle-tool-calls) and [Parallel tool use](/docs/en/agents-and-tools/tool-use/parallel-tool-use). |
| `was found without a corresponding \_tool\_result block` | The previous assistant turn has a `server\_tool\_use` block with no result block (most often, Claude called it alongside a client tool), and either your next user message ended that turn (for example, with text after the `tool\_result` blocks) or the resume request no longer defines that server tool (the message then ends with `but no  tool was provided`) | Send a user message containing only the `tool\_result` blocks for the client `tool\_use` ids and keep the same `tools` array. See [Stop reasons and fallback](/docs/en/build-with-claude/handling-stop-reasons#tool-use). |
| `Input schema is not compatible with strict mode: string patterns are not supported` | Using `pattern` with `strict: true` | Remove the pattern or drop `strict: true`. The `pattern` keyword is not in the supported JSON Schema subset yet. |
| `All tools have defer\_loading: true` | No tools visible to the model | At least one tool must be immediately loaded. The tool search tool itself must never have `defer\_loading: true`. |
## Error: thinking blocks cannot be modified
If a request fails with a 400 `invalid\_request\_error` whose message contains `` `thinking` or `redacted\_thinking` blocks in the latest assistant message cannot be modified `` when continuing a conversation after a tool call, your application is altering the assistant's thinking blocks before sending them back. Send the entire assistant message back unchanged, then append your `tool\_result`.
See [Thinking blocks cannot be modified](/docs/en/api/errors#thinking-blocks-cannot-be-modified) for the full error and fix steps.
## Claude flags tool results as prompt injection
| Symptom | Likely cause | Fix |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude refuses to act on a tool result, or asks the user to confirm instructions that came from it | Your own instructions are being delivered inside the `tool\_result` content | Claude is trained to treat instructions inside tool results as potentially untrusted third-party content. Move your instructions out of the tool result: send them in a `user` turn after the `tool\_result` block, or, on supported models, in a [mid-conversation system message](/docs/en/build-with-claude/mid-conversation-system-messages). Keep the tool result to just the data. See [Mitigate jailbreaks and prompt injections](/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks#indirect-prompt-injection). |
## JSON escaping differences (Opus 4.6+)
| Symptom | Cause | Fix |
| -------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| String comparison on tool inputs fails with newer models | Unicode and forward-slash escaping differs between model versions | Parse with `json.loads()` or `JSON.parse()`. Never do raw string matching on serialized input. |
## Next steps

Write schemas and descriptions that steer Claude toward the right tool.

Execute tools and return results in the required message format.

Full directory of Anthropic-schema tools and their version strings.
