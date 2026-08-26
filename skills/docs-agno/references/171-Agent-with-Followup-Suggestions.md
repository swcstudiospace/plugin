# Agent with Followup Suggestions

Source: https://docs.agno.com/agents/usage/agent-with-followup-suggestions.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Agent with Followup Suggestions
> Generate followup prompts after agent responses.
Set `followups=True` to generate prompt suggestions when a run returns content. Agno makes a second model call using the user input and response.

```python followup\_suggestions.py theme={null}
from agno.agent import Agent
from agno.models.openai import OpenAIResponses
agent = Agent(
model=OpenAIResponses(id="gpt-5.4-mini"),
followups=True,
num\_followups=3,
)
response = agent.run("What is quantum computing?")
print(response.content)
print("\nFollowup suggestions:")
for i, suggestion in enumerate(response.followups or [], 1):
print(f" {i}. {suggestion}")
```

```bash theme={null}
uv pip install -U agno openai
```

```bash Mac/Linux theme={null}
export OPENAI\_API\_KEY="your\_openai\_api\_key\_here"
```
```powershell Windows theme={null}
$Env:OPENAI\_API\_KEY="your\_openai\_api\_key\_here"
```

```bash theme={null}
python followup\_suggestions.py
```
## Options
| Parameter | Type | Default | Description |
| ---------------- | -------------- | ------- | ---------------------------------------------------------- |
| `followups` | `bool` | `False` | Enable followup suggestion generation |
| `num\_followups` | `int` | `3` | Number of suggestions to generate (minimum 1) |
| `followup\_model` | `Model \| str` | `None` | Model used for followups. `None` reuses the agent's model. |
## Streaming
Followup suggestions are available via events when streaming. The `FollowupsCompleted` event carries the suggestions after the main response finishes.
```python followup\_suggestions\_streaming.py theme={null}
import asyncio
from agno.agent import Agent, RunEvent
from agno.models.openai import OpenAIResponses
agent = Agent(
model=OpenAIResponses(id="gpt-5.4-mini"),
followups=True,
num\_followups=3,
)
async def main():
async for event in agent.arun(
"What is quantum computing?",
stream=True,
stream\_events=True,
):
if event.event == RunEvent.run\_content and event.content:
print(event.content, end="", flush=True)
if event.event == RunEvent.followups\_completed:
print("\n\nFollowup suggestions:")
for i, suggestion in enumerate(event.followups or [], 1):
print(f" {i}. {suggestion}")
asyncio.run(main())
```
## Using a separate model
Use `followup\_model` to run followup generation with a separate model.
```python theme={null}
from agno.agent import Agent
from agno.models.openai import OpenAIResponses
agent = Agent(
model=OpenAIResponses(id="gpt-5.4-mini"),
followups=True,
num\_followups=3,
followup\_model=OpenAIResponses(id="gpt-4o-mini"),
)
```
## Developer Resources
\* [Agent reference](/reference/agents/agent)
\* [RunOutput reference](/reference/agents/run-response)
