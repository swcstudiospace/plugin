# OpenAI Responses Compatibility

Source: https://docs.parallel.ai/responses-api/openai-compatibility.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# OpenAI Responses Compatibility
> Field-by-field compatibility reference for the OpenAI Responses wire format
The Responses API models the canonical OpenAI Responses request
(`POST https://api.parallel.ai/v1/responses`), so a stock `openai` SDK client works by
changing only `base\_url`, `api\_key`, and `model`. This page documents exactly which fields
are honored, which are accepted for SDK compatibility but ignored, and which are rejected.
## Request fields
### Honored
| Field | Type | Meaning |
| ---------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model` | `string` | Must be `"parallel"` — the only model. The tier is chosen via `reasoning.effort`. |
| `input` | `string` \| `message[]` | The question, or a list of `{role, content}` messages. \*\*Text only.\*\* Must be non-empty and contain at least one `user` message. |
| `reasoning` | `{"effort": "low" \| "medium" \| "high"}` | Selects the tier. Defaults to `medium`. |
| `instructions` | `string` | System instructions prepended to the request. |
| `text` | `object` | Text-output config, including [structured output](/responses-api/features/structured-outputs) — structured content is returned JSON-encoded in the output text. |
| `stream` | `boolean` | [SSE streaming](/responses-api/features/streaming-events). The answer currently arrives as a single text delta, not token-by-token. |
| `previous\_response\_id` | `string` | Prior response id, for [multi-turn context](/responses-api/features/statefulness). |
| `metadata` | `{string: string}` | Arbitrary tags echoed back on the response. Max 16 keys, ≤64 chars/key, ≤512 chars/value. |
### Accepted but ignored (for SDK compatibility)
`tools`, `tool\_choice`, `parallel\_tool\_calls`, `temperature`, `top\_p`, `max\_output\_tokens`,
`truncation`, `store`, `user`, `include`.
These are part of the OpenAI contract so a stock SDK client's payload never fails
validation, but the backend does not act on them today. Notably you do not pass
`tools: [{"type": "web\_search"}]` — grounding is automatic. `store` is likewise ignored:
responses are always stored so they can be referenced via `previous\_response\_id` (see
[Statefulness](/responses-api/features/statefulness)). Unknown top-level fields are
silently dropped, so newer OpenAI SDK versions won't break.
Ignored fields come back on the response object with their \*\*default values\*\*
(`temperature: null`, `tools: []`, `tool\_choice: "auto"`), not the values you sent.
### Rejected
| Request | Error |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `background: true` | `400` — "background mode is not supported on /v1/responses; submit long-running work via the [Task API](/task-api/task-quickstart) (POST /v1/tasks/runs) instead." |
| Non-text (multimodal) input parts | `400` — "input contains unsupported non-text content parts: input\\_image (this endpoint only accepts text input today)" |
| Empty `input` | `400` — "input must not be empty." |
| `input` with no `user` message | `400` — "input must contain at least one user message." |
| Any `model` other than `parallel` | `400` — "The Responses API only supports model 'parallel'." |
Errors use the standard OpenAI error envelope:
```json theme={"system"}
{
"error": {
"message": "The Responses API only supports model 'parallel'.",
"type": "invalid\_request\_error",
"param": null,
"code": null
}
}
```
Requests over your quota return `429` — back off and retry, and see
[rate limits](/getting-started/rate-limits) for current limits.
## Response fields
A standard OpenAI Responses object. The fields you'll typically read:
| Field | Meaning |
| ------------- | ----------------------------------------------------------------------- |
| `output\_text` | The final answer string (SDK convenience accessor). |
| `output[]` | Output items; the `message` item's `content[]` carries the answer text. |
| `usage` | Token counts (`input\_tokens`, `output\_tokens`, `total\_tokens`). |
| `id` | Response id — pass as `previous\_response\_id` for follow-ups. |
| `metadata` | Your request metadata, echoed back. |
`reasoning` and `text` are echoed as `null` on the response even when they were sent and
honored — read the tier from your request, not the response. Source citations are returned
as `url\_citation` annotations on the output text — see
[Citations](/responses-api/features/citations).
