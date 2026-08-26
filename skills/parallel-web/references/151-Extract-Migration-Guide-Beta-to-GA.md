# Extract Migration Guide: Beta to GA

Source: https://docs.parallel.ai/extract/extract-migration-guide.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Extract Migration Guide: Beta to GA
> Migrate from Beta to GA (V1) Extract API

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

This guide helps you migrate from the Beta Extract API (`/v1beta`) to the GA version (`/v1`).
Both the Beta and V1 APIs continue to be supported. Using the Beta API will result in warnings and no breaking errors in production until at least June 2026. We recommend migrating to the V1 API for the latest features and improvements.
## Highlights
1. \*\*Excerpts are always returned\*\* — The top-level `excerpts` field (bool or settings object) is removed. Excerpts are now always returned in the response; size is controlled via `advanced\_settings.excerpt\_settings.max\_chars\_per\_result`. You can no longer disable excerpts by setting `excerpts: false`.
2. \*\*Settings reorganized under `advanced\_settings`\*\* — `fetch\_policy`, excerpt settings, and `full\_content` are now nested under a single new `advanced\_settings` wrapper object (previously top-level fields). See [Advanced Settings](/extract/advanced-extract-settings) for the full list.
3. \*\*Larger request capacity\*\* — `urls` now accepts up to \*\*20 URLs per request\*\*, and `objective` now accepts up to \*\*5000 characters\*\*.
## Overview of Changes
| Component | Beta | V1 |
| ------------------------ | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| \*\*Endpoint\*\* | `/v1beta/extract` | `/v1/extract` |
| \*\*SDK method\*\* | `client.beta.extract()` | `client.extract()` |
| \*\*`urls` limit\*\* | Up to 10 URLs per request | Up to 20 URLs per request |
| \*\*`objective` limit\*\* | Up to 3000 characters | Up to 5000 characters |
| \*\*Excerpts\*\* | Configurable via top-level `excerpts` (bool or object); can be disabled with `excerpts: false` | Always returned; size controlled via `advanced\_settings.excerpt\_settings.max\_chars\_per\_result` (cannot be disabled) |
| \*\*`max\_chars\_total`\*\* | Inside `excerpts` object | Promoted to top-level request field (controls total excerpt size; does not affect `full\_content`) |
| \*\*`client\_model`\*\* (new) | — | Top-level field for model-specific optimizations |
| \*\*`session\_id`\*\* (new) | — | Top-level field for grouping related Search and Extract calls made by an agent as part of the same task. Server returns one on every response if not provided. |
| \*\*`advanced\_settings`\*\* | — | New object nesting `fetch\_policy`, `excerpt\_settings`, and `full\_content` |
## Migration Example
### Before (Beta)
```bash cURL theme={"system"}
curl https://api.parallel.ai/v1beta/extract \
-H "Content-Type: application/json" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-d '{
"urls": ["https://www.un.org/en/about-us/history-of-the-un"],
"objective": "When was the United Nations established?",
"excerpts": {
"max\_chars\_per\_result": 5000,
"max\_chars\_total": 50000
},
"full\_content": {
"max\_chars\_per\_result": 50000
}
}'
```
```python Python theme={"system"}
from parallel import Parallel
import os
client = Parallel(api\_key=os.environ["PARALLEL\_API\_KEY"])
extract = client.beta.extract(
urls=["https://www.un.org/en/about-us/history-of-the-un"],
objective="When was the United Nations established?",
excerpts={"max\_chars\_per\_result": 5000, "max\_chars\_total": 50000},
full\_content={"max\_chars\_per\_result": 50000},
)
print(extract.results)
```
```typescript TypeScript theme={"system"}
import Parallel from "parallel-web";
const client = new Parallel({ apiKey: process.env.PARALLEL\_API\_KEY });
const extract = await client.beta.extract({
urls: ["https://www.un.org/en/about-us/history-of-the-un"],
objective: "When was the United Nations established?",
excerpts: { max\_chars\_per\_result: 5000, max\_chars\_total: 50000 },
full\_content: { max\_chars\_per\_result: 50000 },
});
console.log(extract.results);
```
### After (V1)
```bash cURL theme={"system"}
curl https://api.parallel.ai/v1/extract \
-H "Content-Type: application/json" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-d '{
"urls": ["https://www.un.org/en/about-us/history-of-the-un"],
"objective": "When was the United Nations established?",
"max\_chars\_total": 50000,
"advanced\_settings": {
"excerpt\_settings": {
"max\_chars\_per\_result": 5000
},
"full\_content": {
"max\_chars\_per\_result": 50000
}
}
}'
```
```python Python theme={"system"}
from parallel import Parallel
import os
client = Parallel(api\_key=os.environ["PARALLEL\_API\_KEY"])
extract = client.extract(
urls=["https://www.un.org/en/about-us/history-of-the-un"],
objective="When was the United Nations established?",
max\_chars\_total=50000,
advanced\_settings={
"excerpt\_settings": {"max\_chars\_per\_result": 5000},
"full\_content": {"max\_chars\_per\_result": 50000},
},
)
print(extract.results)
```
```typescript TypeScript theme={"system"}
import Parallel from "parallel-web";
const client = new Parallel({ apiKey: process.env.PARALLEL\_API\_KEY });
const extract = await client.extract({
urls: ["https://www.un.org/en/about-us/history-of-the-un"],
objective: "When was the United Nations established?",
max\_chars\_total: 50000,
advanced\_settings: {
excerpt\_settings: { max\_chars\_per\_result: 5000 },
full\_content: { max\_chars\_per\_result: 50000 },
},
});
console.log(extract.results);
```
## Additional Resources
\* [Extract Quickstart](/extract/extract-quickstart) - Get started with the V1 Extract API
\* [Best Practices](/extract/best-practices) - Optimize your extract requests
\* [API Reference](/api-reference/extract/extract) - Complete parameter specifications
Questions? Contact [support@parallel.ai](mailto:support@parallel.ai).
