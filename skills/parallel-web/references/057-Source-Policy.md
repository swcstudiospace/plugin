# Source Policy

Source: https://docs.parallel.ai/resources/source-policy.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Source Policy
> Control which sources are used in web research, including domain allow/deny lists and a freshness start date.

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

The Source Policy feature allows you to precisely control which domains Parallel processors can
access during web research and to apply a freshness constraint. It's available for both Tasks and
Web Tools and lets you tailor search results by specifying domains to include or exclude and by
setting a start date so results are limited to recent content.
Source policies can significantly reduce result quality by excluding relevant pages from retrieval. Use `include\_domains` and `exclude\_domains` only when absolutely necessary — for compliance-bound corpora, tasks that require a single known publisher, or when specific sources must be blocked. When you only want to \*prefer\* certain sources, steer in the `objective` instead (e.g., "prefer official documentation").
## Configuration
You can configure source control by setting the following parameters:
| Parameter | Type | Supported | Description |
| ----------------- | -------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `include\_domains` | array\[string] | Task API, Search API | List of domains to \*\*allow\*\*. Only sources from these domains will be included in results. The combined number of domains in `include\_domains` and `exclude\_domains` cannot exceed 200. |
| `exclude\_domains` | array\[string] | Task API, Search API | List of domains to \*\*block\*\*. Sources from these domains will be excluded from results. The combined number of domains in `include\_domains` and `exclude\_domains` cannot exceed 200. |
| `after\_date` | string\ | Search API | Optional start date for filtering results. Results are limited to content published on or after this date. Provided as an RFC 3339 date string (`YYYY-MM-DD`). |
Specifying an apex domain such as `example.com` will automatically include all its
subdomains (e.g., `www.example.com`, `blog.example.com`, `api.example.com`).
### Domain Limit
\*\*Hard limit: Combined total of 200 domains per request.\*\* You can specify up to 200 domains in total across `include\_domains` and `exclude\_domains`. Exceeding this limit will raise a validation error.
## Example
```bash Task API theme={"system"}
curl -X POST "https://api.parallel.ai/v1/tasks/runs" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"input": "How many employees does Parallel Web Systems have?",
"processor": "core",
"source\_policy": {
"include\_domains": ["linkedin.com"]
}
}'
```
```bash Search API theme={"system"}
curl https://api.parallel.ai/v1/search \
-H "Content-Type: application/json" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-d '{
"objective": "Which open source LLMs were released recently and how do they benchmark?",
"search\_queries": ["open source LLMs"],
"advanced\_settings": {
"source\_policy": {
"exclude\_domains": ["reddit.com"],
"after\_date": "2026-01-01"
}
}
}'
```
## Best Practices
\* Use either `include\_domains` or `exclude\_domains` in a single query. Specifying `exclude\_domains` is redundant when `include\_domains` is set, as only `include\_domains` will be applied.
\* Use an apex domain such as `example.com` to match that domain and all its subdomains, or specify a subdomain such as `docs.example.com` to match that subdomain and any deeper subdomains. A leading `www.` is normalized away.
\* Use a bare domain extension beginning with a period, such as `.org`, `.gov`, or `.co.uk`, to match that extension. Literal wildcard syntax such as `\*.org` is not supported.
\* Do not include schemes (`http://`, `https://`), paths (`example.com/blog`), or ports (`example.com:443`).
\* Although there is a maximum limit of 200 domains, carefully using specific and targeted domains will give better results.
