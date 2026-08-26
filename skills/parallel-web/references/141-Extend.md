# Extend

Source: https://docs.parallel.ai/findall-api/features/findall-extend.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Extend
> Increase the match limit of existing FindAll runs to get more results without changing query criteria

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

## Overview
Extend allows you to increase the `match\_limit` of an existing FindAll run to get more results using the same evaluation criteria—without paying the fixed cost again. Start with a small limit (10-20) to validate your criteria, then extend to get more matches.
```bash cURL theme={"system"}
curl -X POST "https://api.parallel.ai/v1beta/findall/runs/findall\_40e0ab8c10754be0b7a16477abb38a2f/extend" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{ "additional\_match\_limit": 40 }'
```
```python Python theme={"system"}
from parallel import Parallel
client = Parallel(api\_key="YOUR\_API\_KEY")
client.beta.findall.extend(
findall\_id="findall\_40e0ab8c10754be0b7a16477abb38a2f",
additional\_match\_limit=40
)
```
```typescript TypeScript theme={"system"}
import Parallel from 'parallel-web';
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY
});
await client.beta.findall.extend(
"findall\_40e0ab8c10754be0b7a16477abb38a2f",
{
additional\_match\_limit: 40
}
);
```
### How Extend Works
\* \*\*Increases match limit:\*\* The `additional\_match\_limit` you set is the \*\*incremental\*\* number of matches to add (not the total). For example, to go from 10 to 50 matches, set `additional\_match\_limit: 40`, not `50`.
\* \*\*Continues the same evaluation:\*\* The \*\*objective\*\*, \*\*entity type\*\*, \*\*generator\*\*, and \*\*match conditions\*\* stay the same. Existing enrichments continue to run on new matches.
\* \*\*Handles run status automatically:\*\*
\* If the run is \*active\*, it continues seamlessly up to the new match limit.
\* If the run is \*completed\*, it automatically "respawns" and resumes until reaching the new limit.
\* \*\*Pricing:\*\* Extending has \*\*no fixed cost—you only pay for the additional matches beyond the original run\*\*. For example, extending from 10 to 100 matches means paying for 90 additional matches (plus evaluation costs).
### Limitations
\* \*\*Preview runs:\*\* Cannot be extended. Use a full generator (`base`, `core`, or `pro`) if you plan to extend.
\* \*\*Total limit:\*\* The current `match\_limit` plus `additional\_match\_limit` cannot exceed 1,000.
\* \*\*Termination reason:\*\* A completed run can be extended only when `termination\_reason` is `match\_limit\_met`. Runs stopped for low match rate, exhausted candidates, insufficient funds, cancellation, timeout, or error must be replaced with a new run.
\* \*\*Fixed parameters:\*\* Extend changes only `match\_limit`. Use `/enrich` to add an enrichment; start a new run to change the objective, entity type, generator, match conditions, or an existing enrichment definition.
## Related Topics
\* \*\*[Preview](/findall-api/features/findall-preview)\*\*: Test queries with 5–10 evaluated candidates before running full searches
\* \*\*[Generators and Pricing](/findall-api/core-concepts/findall-generator-pricing)\*\*: Understand generator options and pricing
\* \*\*[Enrichments](/findall-api/features/findall-enrich)\*\*: Extract additional structured data for matched candidates
\* \*\*[Streaming Events](/findall-api/features/findall-sse)\*\*: Receive real-time updates via Server-Sent Events
\* \*\*[Webhooks](/findall-api/features/findall-webhook)\*\*: Configure HTTP callbacks for run completion and matches
\* \*\*[Run Lifecycle](/findall-api/core-concepts/findall-lifecycle)\*\*: Understand run statuses and how to cancel runs
\* \*\*[API Reference](/api-reference/findall/extend-findall-run)\*\*: Complete endpoint documentation
