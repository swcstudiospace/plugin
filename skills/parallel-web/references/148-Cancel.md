# Cancel

Source: https://docs.parallel.ai/findall-api/features/findall-cancel.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Cancel
> Stop FindAll runs early to control costs

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

Stop a running FindAll search when you have enough matches or need to control costs. Results found before cancellation are preserved.
```bash cURL theme={"system"}
curl -X POST \
https://api.parallel.ai/v1beta/findall/runs/findall\_40e0ab8c10754be0b7a16477abb38a2f/cancel \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json"
```
```python Python theme={"system"}
from parallel import Parallel
client = Parallel(api\_key="YOUR\_API\_KEY")
client.beta.findall.cancel(
findall\_id="findall\_40e0ab8c10754be0b7a16477abb38a2f"
)
```
```typescript TypeScript theme={"system"}
import Parallel from 'parallel-web';
const client = new Parallel({
apiKey: process.env.PARALLEL\_API\_KEY,
});
await client.beta.findall.cancel("findall\_40e0ab8c10754be0b7a16477abb38a2f");
```
## How Cancellation Works
The cancel endpoint marks the run `cancelled` and returns `204 No Content`. The orchestrator then detects that terminal state and stops scheduling more work:
\* Work already in flight may finish before orchestration shuts down
\* Candidates already persisted remain accessible through `/result`
\* Cancellation does not reverse charges for work that already completed
\* Current FindAll runs move directly to `cancelled`; they do not emit an intermediate `cancelling` status (see \*\*[Run Lifecycle](/findall-api/core-concepts/findall-lifecycle)\*\*)
Cancelled runs \*\*cannot be extended\*\*. Results found before cancellation remain available. Adding an enrichment to a terminal run requeues it, so create a new run instead if you want an independent search.
## Common Use Cases
\* Control costs when a run takes longer than expected
\* Stop after finding enough matches (monitor via [webhooks](/findall-api/features/findall-webhook) or [SSE](/findall-api/features/findall-sse))
\* Iterate quickly with refined queries instead of waiting for completion
## Related Topics
\* \*\*[Generators and Pricing](/findall-api/core-concepts/findall-generator-pricing)\*\*: Understand generator options and pricing
\* \*\*[Preview](/findall-api/features/findall-preview)\*\*: Test queries with 5–10 evaluated candidates before running full searches
\* \*\*[Enrichments](/findall-api/features/findall-enrich)\*\*: Extract additional structured data for matched candidates
\* \*\*[Extend Runs](/findall-api/features/findall-extend)\*\*: Increase match limits without paying new fixed costs
\* \*\*[Streaming Events](/findall-api/features/findall-sse)\*\*: Receive real-time updates via Server-Sent Events
\* \*\*[Webhooks](/findall-api/features/findall-webhook)\*\*: Configure HTTP callbacks for run completion and matches
\* \*\*[API Reference](/api-reference/findall/cancel-findall-run)\*\*: Complete endpoint documentation
