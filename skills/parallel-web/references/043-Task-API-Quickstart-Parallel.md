# Task API Quickstart - Parallel

Source: https://docs.parallel.ai/task-api/task-quickstart

The **Task API** combines AI inference with web search and live crawling to turn complex research tasks into repeatable workflows. Define what you need in plain language or JSON, and the Task API handles the research, synthesis, and structured output—complete with citations and confidence levels.

See [Pricing](/getting-started/pricing) for a detailed schedule of rates.

## [​](#what-you-can-build) What you can build

The Task API is designed for maximum extensibility. Create a task spec for any research need:

- **Data enrichment**: Enhance CRM records, company databases, or contact lists with web intelligence
- **Market research**: Generate comprehensive reports on industries, competitors, or trends
- **Due diligence**: Automate compliance checks, background research, and verification workflows
- **Content generation**: Create research-backed reports, summaries, and analyses

## [​](#prerequisites) Prerequisites

Generate your API key on [Platform](https://platform.parallel.ai). Then, set up with the TypeScript SDK, Python SDK or with cURL:

cURL

Python

TypeScript

```
echo "Install curl and jq via brew, apt, or your favorite package manager"
export PARALLEL_API_KEY="PARALLEL_API_KEY"
```

```
pip install parallel-web
export PARALLEL_API_KEY="PARALLEL_API_KEY"
```

```
npm install parallel-web
export PARALLEL_API_KEY="PARALLEL_API_KEY"
```

## [​](#quick-start) Quick start

Every Task API workflow follows three steps: **create** a task run, **wait** for completion, and **retrieve** the result.

```
from parallel import Parallel

client = Parallel(api_key="PARALLEL_API_KEY")

# 1. Create a task run
task_run = client.task_run.create(
    input="Stripe",
    task_spec={"output_schema": "The founding year and total funding raised"},
    processor="base"
)

# 2-3. Retrieve the result (blocks until complete)
run_result = client.task_run.result(task_run.run_id, api_timeout=3600)
print(run_result.output)
```

For complete end-to-end examples with all languages, polling, and response handling, see:

## Enrichment Quickstart

Enrich structured data with web intelligence — includes cURL, Python, TypeScript, and async examples

## Deep Research Quickstart

Generate comprehensive reports — includes polling, webhooks, and SSE approaches

## [​](#core-concepts) Core concepts

Before diving in, understand these key concepts:

## Task specs

Define your research task using input/output schemas in plain language or JSON

## Processors

Choose the right processor tier based on research depth and latency requirements

## Research Basis

Every output includes citations, reasoning, and confidence levels for verification

### [​](#output-schema-types) Output schema types

The Task API supports four output schema types:

| Type | Description | When to Use |
| --- | --- | --- |
| **Text string** | Plain text description (e.g., `"The founding date in MM-YYYY format"`) | Simple lookups, single-field answers |
| **JSON schema** | `{"type": "json", "json_schema": {...}}` | Structured enrichment with multiple typed fields |
| **Text schema** | `{"type": "text"}` with optional `description` | Markdown reports with inline citations |
| **Auto** | `{"type": "auto"}`, or omit `task_spec` entirely | Let the processor determine the best output structure |

See [Specify a Task](/task-api/guides/specify-a-task) for schema best practices and [Processors](/task-api/guides/choose-a-processor) for choosing the right processor tier. For Python SDK users, these correspond to `TaskSpecParam`, `JsonSchemaParam`, and `TextSchemaParam` types from `parallel.types`.

## [​](#input-and-output-patterns) Input and output patterns

The Task API supports flexible input/output combinations to match your use case:

### [​](#question-in-→-answer-out) Question in → Answer out

The simplest pattern: ask a question, get a researched answer.

```
task_run = client.task_run.create(
    input="What is the founding date of the United Nations?",
    task_spec={"output_schema": "The founding date in MM-YYYY format"},
    processor="base"
)
# Output: "10-1945"
```

### [​](#question-in-→-report-out) Question in → Report out

Generate comprehensive markdown reports with inline citations.

```
from parallel.types import TaskSpecParam, TextSchemaParam

task_run = client.task_run.create(
    input="Create a market research report on the HVAC industry in the USA",
    processor="ultra",
    task_spec=TaskSpecParam(output_schema=TextSchemaParam())
)
# Output: Multi-page markdown report with citations
```

### [​](#question-in-→-auto-structured-output) Question in → Auto-structured output

Let the processor automatically determine the best output structure.

```
task_run = client.task_run.create(
    input="Research the top 5 AI infrastructure companies and their recent funding",
    processor="ultra"
)
# Output: Automatically structured JSON with company profiles, funding details, etc.
```

### [​](#structured-input-→-structured-output) Structured input → Structured output

Define explicit input and output schemas for precise control over data enrichment.

```
task_run = client.task_run.create(
    input={"company_name": "Stripe", "website": "stripe.com"},
    task_spec={
        "input_schema": {
            "type": "json",
            "json_schema": {
                "type": "object",
                "properties": {
                    "company_name": {"type": "string"},
                    "website": {"type": "string"}
                }
            }
        },
        "output_schema": {
            "type": "json",
            "json_schema": {
                "type": "object",
                "properties": {
                    "founding_year": {"type": "string"},
                    "employee_count": {"type": "string"},
                    "total_funding": {"type": "string"}
                }
            }
        }
    },
    processor="core"
)
```

## [​](#use-cases) Use cases

## Enrichment

Enhance structured data with web intelligence. Start with a spreadsheet or database, add new columns with researched data.

## Deep Research

Conduct open-ended research without structured input. Generate comprehensive reports on any topic.

## [​](#next-steps) Next steps

- [**Enrichment quickstart:**](/task-api/examples/task-enrichment) Learn how to enrich structured data at scale
- [**Deep Research quickstart:**](/task-api/examples/task-deep-research) Generate comprehensive research reports
- [**Task Groups:**](/task-api/group-api) Run multiple tasks concurrently with batch tracking
- [**Streaming Events:**](/task-api/task-sse) Monitor long-running tasks with real-time progress updates
- [**Webhooks:**](/task-api/webhooks) Configure HTTP callbacks for task completion notifications
- [**API Reference:**](/api-reference/tasks/create-task-run) Complete endpoint documentation

## [​](#rate-limits) Rate limits

See [Rate Limits](/resources/rate-limits) for default quotas and how to request higher limits.

[Extract Migration Guide](/extract/extract-migration-guide)[Best Practices](/task-api/best-practices)

⌘I
