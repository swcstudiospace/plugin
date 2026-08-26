# Running Agents

Source: https://docs.agno.com/agents/running-agents.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Running Agents
> Run agents and process their output.
Run your Agent by calling `Agent.run()` or `Agent.arun()`. The execution flow:
1. The agent builds context to send to the model (system message, user message, chat history, user memories, session state, and other relevant inputs).
2. The agent sends this context to the model.
3. The model responds with either a message or a tool call.
4. If the model makes a tool call, the agent executes it and returns results to the model.
5. The model processes the updated context, repeating this loop until it produces a final message without tool calls.
6. The agent returns this final response to the caller.
## Basic Execution
`Agent.run()` returns a `RunOutput` object, or a stream of `RunOutputEvent` objects when `stream=True`:
```python theme={null}
from agno.agent import Agent, RunOutput
from agno.models.anthropic import Claude
from agno.tools.hackernews import HackerNewsTools
from agno.utils.pprint import pprint\_run\_response
agent = Agent(
model=Claude(id="claude-sonnet-4-5"),
tools=[HackerNewsTools()],
instructions="Write a report on the topic. Output only the report.",
markdown=True,
)
# Run agent and return the response as a variable
response: RunOutput = agent.run("Trending startups and products.")
# Print the response in markdown format
pprint\_run\_response(response, markdown=True)
```
Run the agent asynchronously using `Agent.arun()`. See this [example](/examples/agents/advanced/concurrent-execution).
## Run Input
The `input` parameter can be a string, list, dictionary, message, Pydantic model, or list of messages:
```python theme={null}
from agno.agent import Agent, RunOutput
from agno.models.anthropic import Claude
from agno.tools.hackernews import HackerNewsTools
from agno.utils.pprint import pprint\_run\_response
agent = Agent(
model=Claude(id="claude-sonnet-4-5"),
tools=[HackerNewsTools()],
instructions="Write a report on the topic. Output only the report.",
markdown=True,
)
# Run agent with input="Trending startups and products."
response: RunOutput = agent.run(input="Trending startups and products.")
# Print the response in markdown format
pprint\_run\_response(response, markdown=True)
```
See [Input & Output](/input-output/overview) for structured input and output.
## Run Output
`Agent.run()` returns a `RunOutput` object when not streaming. Core attributes:
\* `run\_id`: The ID of the run.
\* `agent\_id`: The ID of the agent.
\* `agent\_name`: The name of the agent.
\* `session\_id`: The ID of the session.
\* `user\_id`: The ID of the user.
\* `content`: The response content.
\* `content\_type`: The type of content. For structured output, this is the class name of the Pydantic model.
\* `reasoning\_content`: The reasoning content.
\* `messages`: The list of messages sent to the model.
\* `metrics`: The metrics of the run. See [Metrics](/sessions/metrics/overview).
\* `model`: The model used for the run.
See [RunOutput reference](/reference/agents/run-response) for full documentation.
## Streaming
Set `stream=True` to return an iterator of `RunOutputEvent` objects:
```python theme={null}
from typing import Iterator
from agno.agent import Agent, RunOutputEvent, RunEvent
from agno.models.anthropic import Claude
from agno.tools.hackernews import HackerNewsTools
agent = Agent(
model=Claude(id="claude-sonnet-4-5"),
tools=[HackerNewsTools()],
instructions="Write a report on the topic. Output only the report.",
markdown=True,
)
# Run agent and return the response as a stream
stream: Iterator[RunOutputEvent] = agent.run("Trending products", stream=True)
for chunk in stream:
if chunk.event == RunEvent.run\_content:
print(chunk.content)
```
For asynchronous streaming, see this [example](/examples/agents/advanced/basic-agent-events).
## Streaming Events
By default, only `RunContent` events (model responses) are streamed.
To stream all events (tool calls, reasoning, memory updates, etc.), set `stream\_events=True`:
```python theme={null}
response\_stream: Iterator[RunOutputEvent] = agent.run(
"Trending products",
stream=True,
stream\_events=True
)
```
## Handling Events
Process events as they arrive:
```python theme={null}
from agno.agent import Agent, RunEvent
from agno.models.anthropic import Claude
from agno.tools.hackernews import HackerNewsTools
agent = Agent(
model=Claude(id="claude-sonnet-4-5"),
tools=[HackerNewsTools()],
instructions="Write a report on the topic. Output only the report.",
markdown=True,
)
stream = agent.run("Trending products", stream=True, stream\_events=True)
for chunk in stream:
if chunk.event == RunEvent.run\_content:
print(f"Content: {chunk.content}")
elif chunk.event == RunEvent.tool\_call\_started:
print(f"Tool call started: {chunk.tool.tool\_name}")
elif chunk.event == RunEvent.reasoning\_step:
print(f"Reasoning step: {chunk.reasoning\_content}")
```
Run events expose each step of the run as it happens. Use them for live UI updates and debugging.
## Event Types
Events yielded by `Agent.run()` and `Agent.arun()`, depending on agent configuration:
### Core Events
| Event Type | Description |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `RunStarted` | Indicates the start of a run |
| `RunContent` | Contains the model's response text as individual chunks |
| `RunContentCompleted` | Signals completion of content streaming |
| `RunIntermediateContent` | Contains the model's intermediate response text as individual chunks. Used when `output\_model` is set. |
| `RunCompleted` | Signals successful completion of the run |
| `RunError` | Indicates an error occurred during the run |
| `RunCancelled` | Signals that the run was cancelled |
### Control Flow Events
| Event Type | Description |
| -------------- | -------------------------------------------- |
| `RunPaused` | Indicates the run has been paused |
| `RunContinued` | Signals that a paused run has been continued |
### Tool Events
| Event Type | Description |
| ------------------- | -------------------------------------------------------------- |
| `ToolCallStarted` | Indicates the start of a tool call |
| `ToolCallCompleted` | Signals completion of a tool call, including tool call results |
| `ToolCallError` | Indicates a tool call failed, including the error |
### Reasoning Events
| Event Type | Description |
| ----------------------- | ---------------------------------------------------- |
| `ReasoningStarted` | Indicates the start of the agent's reasoning process |
| `ReasoningStep` | Contains a single step in the reasoning process |
| `ReasoningContentDelta` | Contains a chunk of streamed reasoning content |
| `ReasoningCompleted` | Signals completion of the reasoning process |
### Memory Events
| Event Type | Description |
| ----------------------- | ----------------------------------------------- |
| `MemoryUpdateStarted` | Indicates that the agent is updating its memory |
| `MemoryUpdateCompleted` | Signals completion of a memory update |
### Session Summary Events
| Event Type | Description |
| ------------------------- | ------------------------------------------------- |
| `SessionSummaryStarted` | Indicates the start of session summary generation |
| `SessionSummaryCompleted` | Signals completion of session summary generation |
### Pre-Hook Events
| Event Type | Description |
| ------------------ | ---------------------------------------------- |
| `PreHookStarted` | Indicates the start of a pre-run hook |
| `PreHookCompleted` | Signals completion of a pre-run hook execution |
### Post-Hook Events
| Event Type | Description |
| ------------------- | ----------------------------------------------- |
| `PostHookStarted` | Indicates the start of a post-run hook |
| `PostHookCompleted` | Signals completion of a post-run hook execution |
### Parser Model Events
| Event Type | Description |
| ------------------------------ | ------------------------------------------------ |
| `ParserModelResponseStarted` | Indicates the start of the parser model response |
| `ParserModelResponseCompleted` | Signals completion of the parser model response |
### Output Model Events
| Event Type | Description |
| ------------------------------ | ------------------------------------------------ |
| `OutputModelResponseStarted` | Indicates the start of the output model response |
| `OutputModelResponseCompleted` | Signals completion of the output model response |
### Model Request Events
| Event Type | Description |
| ----------------------- | -------------------------------------------------------------- |
| `ModelRequestStarted` | Indicates the start of a model request |
| `ModelRequestCompleted` | Signals completion of a model request, including token metrics |
### Compression Events
| Event Type | Description |
| ---------------------- | ---------------------------------------------- |
| `CompressionStarted` | Indicates the start of tool result compression |
| `CompressionCompleted` | Signals completion of tool result compression |
### Followup Events
| Event Type | Description |
| -------------------- | -------------------------------------------------------------------- |
| `FollowupsStarted` | Indicates the start of followup suggestion generation |
| `FollowupsCompleted` | Signals completion of followup generation, including the suggestions |
### Custom Events
Create custom events by extending `CustomEvent`:
```python theme={null}
from dataclasses import dataclass
from agno.run.agent import CustomEvent
from typing import Optional
@dataclass
class CustomerProfileEvent(CustomEvent):
"""CustomEvent for customer profile."""
customer\_name: Optional[str] = None
customer\_email: Optional[str] = None
customer\_phone: Optional[str] = None
```
Yield custom events from your tool:
```python theme={null}
from agno.tools import tool
@tool()
async def get\_customer\_profile():
"""Example custom tool that simply yields a custom event."""
yield CustomerProfileEvent(
customer\_name="John Doe",
customer\_email="john.doe@example.com",
customer\_phone="1234567890",
)
```
## Specify Run User and Session
Pass `user\_id` and `session\_id` to associate a run with a specific user and session:
```python theme={null}
agent.run("Tell me a 5 second short story about a robot", user\_id="john@example.com", session\_id="session\_123")
```
See [Agent Sessions](/sessions/overview) for more details.
## Passing Images / Audio / Video / Files
Pass media via `images`, `audio`, `videos`, or `files` parameters:
```python theme={null}
from agno.media import Image
agent.run("Tell me a 5 second short story about this image", images=[Image(url="https://example.com/image.jpg")])
```
See [Multimodal Agents](/multimodal/overview) for more details.
## Passing Output Schema
Pass an output schema for structured output:
```python theme={null}
from pydantic import BaseModel
from agno.agent import Agent
from agno.models.openai import OpenAIResponses
class TVShow(BaseModel):
title: str
episodes: int
agent = Agent(model=OpenAIResponses(id="gpt-5.2"))
agent.run("Create a TV show", output\_schema=TVShow)
```
See [Input & Output](/input-output/overview) for more details.
## Pausing and Continuing a Run
An agent run can be paused for human-in-the-loop flows. Continue execution with `Agent.continue\_run()`.
See [Human-in-the-Loop](/hitl/overview) for more details.
## Cancelling a Run
Cancel a run with `Agent.cancel\_run()`.
See [Cancelling a Run](/run-cancellation/overview) for more details.
## Background Execution
Run agents in the background with `Agent.arun(background=True)`. The agent continues running even if the client disconnects. Combine with `stream=True` for resumable SSE streaming with automatic event buffering and reconnection.
See [Background Execution](/background-execution/overview) for polling, resumable streaming, and the `/resume` endpoint.
## Developer Resources
\* [Agent reference](/reference/agents/agent)
\* [RunOutput schema](/reference/agents/run-response)
