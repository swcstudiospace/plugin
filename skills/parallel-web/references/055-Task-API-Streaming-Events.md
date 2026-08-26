# Task API Streaming Events

Source: https://docs.parallel.ai/task-api/task-sse.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Task API Streaming Events
> SSE for Task Runs

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

## Overview
Task Runs support Server-Sent Events (SSE) at the run level, allowing you to receive real-time
updates on ongoing research conducted by our processors during execution.
For streaming events related to Task Groups, see the [streaming endpoints on the Task Group API](./group-api#stream-group-results).
Task Group events provide aggregate updates at the group level, while Task Run events represent updates for individual task runs.
For a more comprehensive list of differences, [see here.](#differences-between-task-group-events-and-task-run-events)
### Enabling Events Streaming
To enable periodic event publishing for a task run, set the `enable\_events` flag to `true`
when creating the task run. If not specified, events may still be available, but frequent updates are not guaranteed.
Create a Task Run with events aggregation enabled explicitly:
```bash Task API theme={"system"}
curl -X POST "https://api.parallel.ai/v1/tasks/runs" \
-H "x-api-key: ${PARALLEL\_API\_KEY}" \
-H "Content-Type: application/json" \
--data '{
"input": "What is the latest in AI research?",
"processor": "lite",
"enable\_events": true
}'
```
To access the event stream for a specific run, use the `/v1/tasks/runs/{run\_id}/events` endpoint:
```bash Access event stream theme={"system"}
curl -X GET "https://api.parallel.ai/v1/tasks/runs/trun\_6eb64c73e4324b15af2a351bef6d0190/events" \
-H "x-api-key: ${PARALLEL\_API\_KEY}" \
-H "Accept: text/event-stream"
```
This is what a sample stream looks like:
```bash Event stream theme={"system"}
event: task\_run.state
data: {"type":"task\_run.state","event\_id":null,"input":null,"run":{"run\_id":"trun\_aa9c7a780c9d4d4b9aa0ca064f61a6f7","status":"running","is\_active":true,"warnings":null,"error":null,"processor":"pro","metadata":{},"taskgroup\_id":null,"created\_at":"2025-08-06T00:52:58.619503Z","modified\_at":"2025-08-06T00:52:59.495063Z"},"output":null}
event: task\_run.progress\_msg.exec\_status
data: {"type":"task\_run.progress\_msg.exec\_status","message":"Starting research","timestamp":"2025-08-06T00:52:59.786126Z"}
event: task\_run.progress\_msg.plan
data: {"type":"task\_run.progress\_msg.plan","message":"I'm working on gathering information about Google's hiring in 2024, including where most jobs were created and any official announcements. I'll review recent news, reports, and Google's own statements to provide a comprehensive answer.","timestamp":"2025-08-06T00:53:19.281306Z"}
event: task\_run.progress\_msg.tool
data: {"type":"task\_run.progress\_msg.tool","message":"I've looked into Google's hiring activity in 2024, focusing on locations and official statements. I'll compile the findings and share a clear update with you shortly.","timestamp":"2025-08-06T00:53:28.282905Z"}
event: task\_run.progress\_msg.search
data: {"type":"task\_run.progress\_msg.search","message":"Objective: Find where Google created the most jobs in 2024","timestamp":"2025-08-06T00:53:30.114920Z"}
event: task\_run.progress\_msg.search
data: {"type":"task\_run.progress\_msg.search","message":"Query: Google hiring 2024","timestamp":"2025-08-06T00:53:30.114981Z"}
event: task\_run.progress\_msg.search
data: {"type":"task\_run.progress\_msg.search","message":"Query: Google 2024 job openings by location","timestamp":"2025-08-06T00:53:30.115044Z"}
event: task\_run.progress\_stats
data: {"type":"task\_run.progress\_stats","source\_stats":{"num\_sources\_considered":223,"num\_sources\_read":22,"sources\_read\_sample":["http://stcloudlive.com/business/19-layoffs-coming-in-mid-march-at-st-cloud-arctic-cat-facility-company-says","http://snowgoer.com/snowmobiles/arctic-cat-sleds/putting-the-arctic-cat-layoffs-production-stop-in-context/32826","http://25newsnow.com/2024/07/26/cat-deere-cyclical-layoff-mode-say-industry-experts","http://citizen.org/article/big-tech-lobbying-update","http://businessalabama.com/women-in-tech-23-for-23","http://itif.org/publications/2019/10/28/policymakers-guide-techlash","http://distributech.com/","http://newyorker.com/magazine/2019/09/30/four-years-in-startups"]}}
...
```
\*\*Notes:\*\*
\* All [Task API processors](/task-api/guides/choose-a-processor) starting from `pro` and above have event streaming enabled by default.
\* Event streams remain open for 570 seconds. After this period, the stream is closed.
## Stream Behavior
When a stream is started, some earlier events are also re-sent in addition to new updates. This allows developers to build stateless applications more easily, since the API can be relied on without persisting every streamed update. It also supports scenarios where clients can disconnect and later reconnect without missing important events.
### For Running Tasks
When connecting to a stream for a task that is still running:
\* \*\*Complete reasoning trace:\*\* You receive all reasoning messages (`task\_run.progress\_msg.\*`) from the beginning of the task execution, regardless of when you connect to the stream
\* \*\*Latest progress stats:\*\* You receive only the current aggregate state via `task\_run.progress\_stats` events, not historical progress snapshots
\* \*\*Real-time updates:\*\* As the task continues, you'll receive new reasoning messages and updated progress statistics
\* \*\*Final result:\*\* The stream concludes with a `task\_run.state` event containing the complete task output when execution finishes
### For Completed Tasks
When connecting to a stream for a task that has already completed:
\* \*\*Complete reasoning trace:\*\* You receive the full sequence of reasoning messages that occurred during the original execution
\* \*\*Final progress stats:\*\* You receive the final aggregate statistics from when the task completed
\* \*\*Immediate result:\*\* The stream ends with a `task\_run.state` event that includes the complete task output in the `output` field. This is useful so you don't also need to use the result endpoint.
### Reconnection Behavior
\* Event streams are \*\*not resumable\*\* - there are no sequence numbers or cursors to resume from a specific point
\* If you disconnect and reconnect to the same task:
\* \*\*Running tasks:\*\* You get the complete reasoning trace again plus current progress stats
\* \*\*Completed tasks:\*\* You get the same complete sequence as the first connection
\* Every connection starts with a `task\_run.state` event indicating the current status
### Supported Events
Currently, four types of events are supported:
\* \*\*Run Status Events (`task\_run.state`):\*\* Indicate the current status of the run. These are sent at the beginning of every stream and when the run transitions to a non-active status.
\* \*\*Progress Statistics Events (`task\_run.progress\_stats`):\*\* Provide point-in-time updates on the number of sources considered and other aggregate statistics. Only the current state is provided, not historical snapshots.
\* \*\*Message Events (`task\_run.progress\_msg.\*`):\*\* Communicate progress at various stages of task run execution. The complete sequence from the beginning of execution is always provided. Subtypes include `.plan` (planning), `.tool` (tool use), `.result` (intermediate findings), `.exec\_status` (execution status), and `.search` (search activity).
\* \*\*Search events (`task\_run.progress\_msg.search`)\*\* record what the run searched for. Each `message` is prefixed `Objective:` (the goal being researched at that step) or `Query:` (a web search query that was run). A search step typically produces one `Objective:` line followed by one or more `Query:` lines. Reasoning messages such as `.plan` / `.tool` may be limited on `lite`; search events are emitted on `base` and above.
\* \*\*Error Events (`error`):\*\* Report errors that occur during execution.
Surfaced search queries reflect what the engine searched for at each step, for auditability and observability. When a step issues no explicit query, only the `Objective:` line appears.
\*\*Additional Notes:\*\*
\* Event streams always start with a status event and end with a status event (for completed tasks)
\* The final status event for completed tasks always includes the complete output in the `output` field
\* Events within the reasoning trace maintain their original timestamps, allowing you to understand the execution timeline
\* After the event has completed, reasoning traces may not get streamed anymore.
For the full specification of each event, see the examples above.
### Differences Between Task Group Events and Task Run Events
Currently, the events returned by Task Groups is not a strict superset of events returned by Task Runs. See the list of differences below:
| | Task Run Events | Task Group Events |
| --------------------- | ----------------------------------------------------------------- | ---------------------------------- |
| \*\*Purpose\*\* | Events for a single Task Run. | Events for an entire Task Group. |
| \*\*Run-level events\*\* | Progress updates, messages, status changes. | Only run status changes. |
| \*\*Resumable streams\*\* | No | Yes, using `event\_id`. |
| \*\*Events supported\*\* | Progress updates, messages, status changes for an individual run. | Group status and run terminations. |
| \*\*Reasoning trace\*\* | Complete trace always provided when connecting. | Not available. |
| \*\*Final results\*\* | Always included in final status event. | Available through separate API. |
