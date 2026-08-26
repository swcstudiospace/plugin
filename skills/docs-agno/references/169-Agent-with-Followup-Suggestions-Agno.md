# Agent with Followup Suggestions - Agno

Source: https://docs.agno.com/agents/usage/agent-with-followup-suggestions

Set `followups=True` to generate prompt suggestions when a run returns content. Agno makes a second model call using the user input and response.

1

Create a Python file

followup\_suggestions.py

```
from agno.agent import Agent
from agno.models.openai import OpenAIResponses

agent = Agent(
    model=OpenAIResponses(id="gpt-5.4-mini"),
    followups=True,
    num_followups=3,
)

response = agent.run("What is quantum computing?")

print(response.content)
print("\nFollowup suggestions:")
for i, suggestion in enumerate(response.followups or [], 1):
    print(f"  {i}. {suggestion}")
```

2

Set up your virtual environment

Mac

Windows

```
uv venv --python 3.12
source .venv/bin/activate
```

```
uv venv --python 3.12
.venv\Scripts\activate
```

3

Install dependencies

```
uv pip install -U agno openai
```

4

Export your OpenAI API key

Mac/Linux

Windows

```
export OPENAI_API_KEY="your_openai_api_key_here"
```

```
$Env:OPENAI_API_KEY="your_openai_api_key_here"
```

5

Run Agent

```
python followup_suggestions.py
```

## [​](#options) Options

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `followups` | `bool` | `False` | Enable followup suggestion generation |
| `num_followups` | `int` | `3` | Number of suggestions to generate (minimum 1) |
| `followup_model` | `Model | str` | `None` | Model used for followups. `None` reuses the agent’s model. |

## [​](#streaming) Streaming

Followup suggestions are available via events when streaming. The `FollowupsCompleted` event carries the suggestions after the main response finishes.

followup\_suggestions\_streaming.py

```
import asyncio

from agno.agent import Agent, RunEvent
from agno.models.openai import OpenAIResponses

agent = Agent(
    model=OpenAIResponses(id="gpt-5.4-mini"),
    followups=True,
    num_followups=3,
)

async def main():
    async for event in agent.arun(
        "What is quantum computing?",
        stream=True,
        stream_events=True,
    ):
        if event.event == RunEvent.run_content and event.content:
            print(event.content, end="", flush=True)

        if event.event == RunEvent.followups_completed:
            print("\n\nFollowup suggestions:")
            for i, suggestion in enumerate(event.followups or [], 1):
                print(f"  {i}. {suggestion}")

asyncio.run(main())
```

## [​](#using-a-separate-model) Using a separate model

Use `followup_model` to run followup generation with a separate model.

```
from agno.agent import Agent
from agno.models.openai import OpenAIResponses

agent = Agent(
    model=OpenAIResponses(id="gpt-5.4-mini"),
    followups=True,
    num_followups=3,
    followup_model=OpenAIResponses(id="gpt-4o-mini"),
)
```

## [​](#developer-resources) Developer Resources

- [Agent reference](/reference/agents/agent)
- [RunOutput reference](/reference/agents/run-response)

⌘I
