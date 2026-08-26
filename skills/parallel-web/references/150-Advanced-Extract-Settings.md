# Advanced Extract Settings

Source: https://docs.parallel.ai/extract/advanced-extract-settings.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Advanced Extract Settings
> Advanced configuration for fetch policy, excerpt settings, and full content extraction

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

The `advanced\_settings` object on the Extract API lets you tune fetch behavior (cached vs live), excerpt sizing, and full content extraction. Most callers don't need it — the defaults return focused excerpts from the cached index, which works well for the majority of tool-calling and research use cases.
## Fields
| Field | Type | Notes | Example |
| ----------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| fetch\\_policy | object | Controls when to return indexed content (faster) vs fetching live content (fresher). Default is to use cached content from the index. Enabling live fetch significantly increases latency. For more info including field details, see [Fetch Policy](#fetch-policy) below. | `{"max\_age\_seconds": 3600}` |
| excerpt\\_settings | object | Controls excerpt sizes. Provide `max\_chars\_per\_result` for fine-grained control, or omit to use defaults. | `{"max\_chars\_per\_result": 10000}` |
| full\\_content | bool or object | Controls full content extraction. Defaults to `false` (disabled). Set to `true` to enable with defaults, or provide a settings object. | `false` or `{"max\_chars\_per\_result": 50000}` |
## Fetch Policy
The `fetch\_policy` parameter controls when to return indexed content (faster) or fetch
fresh content from the source (fresher). Fetching fresh content may take up to a minute
and is subject to rate limits to manage the load on source websites.
| Field | Type | Default | Notes |
| ------------------------ | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| max\\_age\\_seconds | int | dynamic | Maximum age of indexed content in seconds. If older, fetches live. Minimum 600 (10 minutes). If unspecified, uses dynamic policy based on URL and objective. |
| timeout\\_seconds | number | dynamic | Timeout for fetching live content. If unspecified, uses a dynamic timeout based on URL and content type (typically 15s-60s). |
| disable\\_cache\\_fallback | bool | false | If `true`, returns an error when live fetch fails. If `false`, falls back to older indexed content. |
## Excerpt and Full Content Settings
Both `excerpt\_settings` and `full\_content` are configured inside the `advanced\_settings` object.
\*\*Enable full content with custom excerpt sizes:\*\*
```json wrap theme={"system"}
{
"urls": ["https://example.com"],
"advanced\_settings": {
"excerpt\_settings": {
"max\_chars\_per\_result": 5000
},
"full\_content": {
"max\_chars\_per\_result": 50000
}
}
}
```
\*\*Enable full content with default excerpts:\*\*
```json wrap theme={"system"}
{
"urls": ["https://example.com"],
"advanced\_settings": {
"full\_content": true
}
}
```
\*\*Notes:\*\*
\* When `full\_content` is enabled, you'll receive both excerpts and full content in the response
\* Excerpts are always focused on relevance; full content always starts from the beginning
\* Without `objective` or `search\_queries`, excerpts will be redundant with full content. The request still succeeds, but may return less relevant content and may include a warning.
\* `max\_chars\_total` (top-level) controls total excerpt size but does not affect full content
