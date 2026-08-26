# Supabase

Source: https://docs.parallel.ai/data-integrations/supabase.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Supabase
> Enrich your Supabase data with live web intelligence using Edge Functions and Parallel

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

Enrich your Supabase data with live web intelligence using [Supabase Edge Functions](https://supabase.com/docs/guides/functions) and Parallel's Task API.
Check out the [Parallel integration on Supabase](https://supabase.com/partners/integrations/parallel-company-enrichment) for more information.
## Getting Started
We provide a complete cookbook with Supabase Edge Functions, a Next.js frontend, and step-by-step setup instructions.
Complete working example showing how to build a data enrichment pipeline with Supabase and Parallel.
The cookbook includes:
\* \*\*Supabase Edge Functions\*\* that call Parallel's Task API
\* \*\*Next.js frontend\*\* with live updates via Supabase Realtime
\* \*\*SQL schemas\*\* for storing enrichment data
\* \*\*Polling pattern\*\* for handling long-running enrichments
## Example Usage
The Edge Function uses the `parallel-web` SDK to call Parallel's Task API:
```typescript theme={"system"}
import Parallel from "npm:parallel-web@1.0.1";
const parallel = new Parallel({ apiKey: Deno.env.get("PARALLEL\_API\_KEY") });
const taskRun = await parallel.taskRun.create({
input: {
company\_name: "Stripe",
website: "stripe.com",
},
processor: "base-fast",
task\_spec: {
output\_schema: {
type: "json",
json\_schema: {
type: "object",
properties: {
industry: { type: "string" },
employee\_count: { type: "string" },
headquarters: { type: "string" },
description: { type: "string" },
},
},
},
},
});
const result = await parallel.taskRun.result(taskRun.run\_id, { timeout: 30 });
```
For detailed configuration and advanced features, see the [Task API Quickstart](/task-api/task-quickstart).
\*\*Links:\*\*
\* [Supabase + Parallel Cookbook](https://github.com/parallel-web/parallel-cookbook/tree/main/typescript-recipes/parallel-supabase-enrichment)
\* [Parallel on Supabase Integrations](https://supabase.com/partners/integrations/parallel-company-enrichment)
\* [parallel-web npm package](https://www.npmjs.com/package/parallel-web)
