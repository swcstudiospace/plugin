# Task API Quickstart

Source: https://docs.parallel.ai/task-api/task-quickstart.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Task API Quickstart
> Transform complex knowledge work into programmable, repeatable operations powered by AI web research

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

The \*\*Task API\*\* combines AI inference with web search and live crawling to turn complex research tasks into repeatable workflows. Define what you need in plain language or JSON, and the Task API handles the research, synthesis, and structured output—complete with citations and confidence levels.
See [Pricing](/getting-started/pricing) for a detailed schedule of rates.
## What you can build
The Task API is designed for maximum extensibility. Create a task spec for any research need:
\* \*\*Data enrichment\*\*: Enhance CRM records, company databases, or contact lists with web intelligence
\* \*\*Market research\*\*: Generate comprehensive reports on industries, competitors, or trends
\* \*\*Due diligence\*\*: Automate compliance checks, background research, and verification workflows
\* \*\*Content generation\*\*: Create research-backed reports, summaries, and analyses
## Prerequisites
Generate your API key on [Platform](https://platform.parallel.ai). Then, set up with the TypeScript SDK, Python SDK or with cURL:
```bash cURL theme={"system"}
echo "Install curl and jq via brew, apt, or your favorite package manager"
export PARALLEL\_API\_KEY="PARALLEL\_API\_KEY"
```
```bash Python theme={"system"}
pip install parallel-web
export PARALLEL\_API\_KEY="PARALLEL\_API\_KEY"
```
```bash TypeScript theme={"system"}
npm install parallel-web
export PARALLEL\_API\_KEY="PARALLEL\_API\_KEY"
```
## Quick start
Every Task API workflow follows three steps: \*\*create\*\* a task run, \*\*wait\*\* for completion, and \*\*retrieve\*\* the result.
```python theme={"system"}
from parallel import Parallel
client = Parallel(api\_key="PARALLEL\_API\_KEY")
# 1. Create a task run
task\_run = client.task\_run.create(
input="Stripe",
task\_spec={"output\_schema": "The founding year and total funding raised"},
processor="base"
)
# 2-3. Retrieve the result (blocks until complete)
run\_result = client.task\_run.result(task\_run.run\_id, api\_timeout=3600)
print(run\_result.output)
```
For complete end-to-end examples with all languages, polling, and response handling, see:

Enrich structured data with web intelligence — includes cURL, Python, TypeScript, and async examples

Generate comprehensive reports — includes polling, webhooks, and SSE approaches
## Core concepts
Before diving in, understand these key concepts:

Define your research task using input/output schemas in plain language or JSON

Choose the right processor tier based on research depth and latency requirements

Every output includes citations, reasoning, and confidence levels for verification
### Output schema types
The Task API supports four output schema types:
| Type | Description | When to Use |
| --------------- | ---------------------------------------------------------------------- | ----------------------------------------------------- |
| \*\*Text string\*\* | Plain text description (e.g., `"The founding date in MM-YYYY format"`) | Simple lookups, single-field answers |
| \*\*JSON schema\*\* | `{"type": "json", "json\_schema": {...}}` | Structured enrichment with multiple typed fields |
| \*\*Text schema\*\* | `{"type": "text"}` with optional `description` | Markdown reports with inline citations |
| \*\*Auto\*\* | `{"type": "auto"}`, or omit `task\_spec` entirely | Let the processor determine the best output structure |
See [Specify a Task](/task-api/guides/specify-a-task) for schema best practices and [Processors](/task-api/guides/choose-a-processor) for choosing the right processor tier. For Python SDK users, these correspond to `TaskSpecParam`, `JsonSchemaParam`, and `TextSchemaParam` types from `parallel.types`.
## Input and output patterns
The Task API supports flexible input/output combinations to match your use case:
### Question in → Answer out
The simplest pattern: ask a question, get a researched answer.
```python theme={"system"}
task\_run = client.task\_run.create(
input="What is the founding date of the United Nations?",
task\_spec={"output\_schema": "The founding date in MM-YYYY format"},
processor="base"
)
# Output: "10-1945"
```
### Question in → Report out
Generate comprehensive markdown reports with inline citations.
```python theme={"system"}
from parallel.types import TaskSpecParam, TextSchemaParam
task\_run = client.task\_run.create(
input="Create a market research report on the HVAC industry in the USA",
processor="ultra",
task\_spec=TaskSpecParam(output\_schema=TextSchemaParam())
)
# Output: Multi-page markdown report with citations
```
### Question in → Auto-structured output
Let the processor automatically determine the best output structure.
```python theme={"system"}
task\_run = client.task\_run.create(
input="Research the top 5 AI infrastructure companies and their recent funding",
processor="ultra"
)
# Output: Automatically structured JSON with company profiles, funding details, etc.
```
### Structured input → Structured output
Define explicit input and output schemas for precise control over data enrichment.
```python theme={"system"}
task\_run = client.task\_run.create(
input={"company\_name": "Stripe", "website": "stripe.com"},
task\_spec={
"input\_schema": {
"type": "json",
"json\_schema": {
"type": "object",
"properties": {
"company\_name": {"type": "string"},
"website": {"type": "string"}
}
}
},
"output\_schema": {
"type": "json",
"json\_schema": {
"type": "object",
"properties": {
"founding\_year": {"type": "string"},
"employee\_count": {"type": "string"},
"total\_funding": {"type": "string"}
}
}
}
},
processor="core"
)
```
## Use cases

Enhance structured data with web intelligence. Start with a spreadsheet or database, add new columns with researched data.

Conduct open-ended research without structured input. Generate comprehensive reports on any topic.
## Next steps
\* [\*\*Enrichment quickstart:\*\*](/task-api/examples/task-enrichment) Learn how to enrich structured data at scale
\* [\*\*Deep Research quickstart:\*\*](/task-api/examples/task-deep-research) Generate comprehensive research reports
\* [\*\*Task Groups:\*\*](/task-api/group-api) Run multiple tasks concurrently with batch tracking
\* [\*\*Streaming Events:\*\*](/task-api/task-sse) Monitor long-running tasks with real-time progress updates
\* [\*\*Webhooks:\*\*](/task-api/webhooks) Configure HTTP callbacks for task completion notifications
\* [\*\*API Reference:\*\*](/api-reference/tasks/create-task-run) Complete endpoint documentation
## Rate limits
See [Rate Limits](/resources/rate-limits) for default quotas and how to request higher limits.
