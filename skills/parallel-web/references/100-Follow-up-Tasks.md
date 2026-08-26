# Follow-up Tasks

Source: https://docs.parallel.ai/monitor-api/monitor-task.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Follow-up Tasks
> Trigger Task API enrichment or deep research from a monitor event

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

Monitor events can feed directly into a Task API call to go deeper on any detected signal. Use follow-up tasks to enrich a signal with structured fields or launch a full research report—without any manual handoff. The flow is the same in both cases: receive a webhook, fetch the event, pass its `output.content` as the `input` and its `event\_id` as `previous\_interaction\_id` to a new Task Run.
Passing `event\_id` as `previous\_interaction\_id` carries the monitor event's full context forward into the Task run, preserving provenance through every step of the chain. See [Interactions](/task-api/guides/interactions) for details.
## Scenario 1: Structured Enrichment on a Detected Event
Use this when you want to extract machine-readable fields from a detected event—for example, pulling `company`, `amount`, and `round` from a funding announcement.
```bash cURL theme={"system"}
# 1. Fetch the event
EVENT=$(curl --silent \
--url "https://api.parallel.ai/v1/monitors/${MONITOR\_ID}/events?event\_group\_id=${EVENT\_GROUP\_ID}" \
--header "x-api-key: $PARALLEL\_API\_KEY")
OUTPUT=$(echo $EVENT | jq -r '.events[0].output.content')
EVENT\_ID=$(echo $EVENT | jq -r '.events[0].event\_id')
# 2. Enrich with structured extraction
curl --request POST \
--url https://api.parallel.ai/v1/tasks/runs \
--header 'Content-Type: application/json' \
--header "x-api-key: $PARALLEL\_API\_KEY" \
--data @- <
See [Task Enrichment](/task-api/examples/task-enrichment) for full details on structured extraction, output schemas, and polling.
## Scenario 2: Deep Research on a Detected Event
Use this when you want a comprehensive report on a detected signal—for example, analyzing the strategic implications of a regulatory ruling or a competitor announcement.
```bash cURL theme={"system"}
# 1. Fetch the event
EVENT=$(curl --silent \
--url "https://api.parallel.ai/v1/monitors/${MONITOR\_ID}/events?event\_group\_id=${EVENT\_GROUP\_ID}" \
--header "x-api-key: $PARALLEL\_API\_KEY")
OUTPUT=$(echo $EVENT | jq -r '.events[0].output.content')
EVENT\_ID=$(echo $EVENT | jq -r '.events[0].event\_id')
# 2. Launch deep research
curl --request POST \
--url https://api.parallel.ai/v1/tasks/runs \
--header 'Content-Type: application/json' \
--header "x-api-key: $PARALLEL\_API\_KEY" \
--data @- <
Deep research runs are asynchronous. Poll `GET /v1/tasks/runs/{run\_id}` or use a Task webhook to receive the completed report. See [Deep Research](/task-api/examples/task-deep-research) for full details.
## Related
\* \*\*[Interactions](/task-api/guides/interactions)\*\*: How `previous\_interaction\_id` chains context across API calls.
\* \*\*[Task Enrichment](/task-api/examples/task-enrichment)\*\*: Structured data extraction at scale.
\* \*\*[Deep Research](/task-api/examples/task-deep-research)\*\*: Multi-step research reports from natural language prompts.
\* \*\*[Research Basis](/task-api/guides/access-research-basis)\*\*: Citations and reasoning on Task API outputs.
\* \*\*[Events](./monitor-events)\*\*: Event model and retrieval options.
