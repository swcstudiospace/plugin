# Advanced Search Settings

Source: https://docs.parallel.ai/search/advanced-search-settings.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Advanced Search Settings
> Advanced configuration for source policy, fetch policy, excerpt settings, location, and result count

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

The `advanced\_settings` object on the Search API lets you tune source selection, freshness, excerpt sizing, geo-targeting, and result count. Most callers don't need it — the defaults are chosen to produce the best results for typical requests, and setting these knobs unnecessarily can hurt quality or latency.
## Fields
| Field | Type | Notes | Example |
| ----------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| source\\_policy | [SourcePolicy](/resources/source-policy) | Controls your sources: include/exclude specific domains and optionally set a start date for freshness control via `after\_date`. Can significantly reduce result quality by excluding relevant pages — use only when absolutely necessary. See [Using include\\_domains](#using-include\_domains) below. | [Source policy example](/resources/source-policy#example) |
| fetch\\_policy | object | Controls when to return indexed content (faster) vs fetching live content (fresher). Default is to use cached content from the index. Enabling live fetch significantly increases latency. For more info including field details, see [Fetch Policy](/extract/advanced-extract-settings#fetch-policy). | `{"max\_age\_seconds": 3600}` |
| excerpt\\_settings | object | Controls excerpt sizes. Provide `max\_chars\_per\_result` for fine-grained control, or omit to use defaults. | `{"max\_chars\_per\_result": 10000}` |
| location | string | ISO 3166-1 alpha-2 country code for geo-targeted search results. Only a subset of countries are currently supported; unsupported or invalid values (e.g., `"uk"`) are ignored with a warning. | `"us"`, `"gb"`, `"de"`, `"jp"` |
| max\\_results | int | Upper bound on the number of results to return. Must be greater than 0 and defaults to 10. Public Search modes currently cap results at 20; higher requested values are reduced to 20 with an input validation warning. The API may return fewer results. | 10 |
## Using include\\_domains
Source policies can significantly reduce result quality by excluding relevant pages from retrieval. Use `include\_domains` and `exclude\_domains` only when absolutely necessary — for compliance-bound corpora, tasks that require a single known publisher, or when specific sources must be blocked.
[`include\_domains`](/resources/source-policy) restricts retrieval so that \*\*only\*\* those domains can appear in results—the rest of the web is not searched. Treat it as a hard allow list, not a soft preference.
\*\*Best practice:\*\* Set `include\_domains` only when answers must come \*\*exclusively\*\* from those domains (for example, internal or compliance-bound corpora, or when the task truly requires a single known publisher). If the model or user might still need the open web, avoid `include\_domains` and instead steer sources in the \*\*`objective`\*\* (e.g. "prefer official documentation") or use \*\*`exclude\_domains`\*\* when you only need to block specific sites. Full parameter details: [Source policy](/resources/source-policy).
