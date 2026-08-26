# Team with Followup Suggestions - Agno

Source: https://docs.agno.com/teams/usage/team-with-followup-suggestions

Set `followups=True` on a Team to generate followup prompt suggestions when the main response has content. Followup generation makes a second model call and works with all team modes.

1

Create a Python file

team\_followup\_suggestions.py

```
from agno.agent import Agent
from agno.models.openai import OpenAIResponses
from agno.team import Team, TeamMode

researcher = Agent(
    name="Researcher",
    role="Research topics thoroughly",
    model=OpenAIResponses(id="gpt-5.4-mini"),
)

team = Team(
    name="Research Team",
    model=OpenAIResponses(id="gpt-5.4-mini"),
    mode=TeamMode.coordinate,
    members=[researcher],
    followups=True,
    num_followups=3,
)

response = team.run("What are the latest advances in fusion energy?")

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

Run Team

```
python team_followup_suggestions.py
```

## [​](#options) Options

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `followups` | `bool` | `False` | Enable followup suggestion generation |
| `num_followups` | `int` | `3` | Number of suggestions to generate (minimum 1) |
| `followup_model` | `Model | str` | `None` | Model used for followups. When unset, the team’s model is used. |

If the followup model call fails, the team response still completes and `response.followups` can be `None`.

## [​](#streaming) Streaming

Followup suggestions are available via events when streaming.

team\_followup\_streaming.py

```
import asyncio

from agno.agent import Agent
from agno.models.openai import OpenAIResponses
from agno.team import Team, TeamMode, TeamRunEvent

researcher = Agent(
    name="Researcher",
    role="Research topics thoroughly",
    model=OpenAIResponses(id="gpt-5.4-mini"),
)

team = Team(
    name="Research Team",
    model=OpenAIResponses(id="gpt-5.4-mini"),
    mode=TeamMode.coordinate,
    members=[researcher],
    followups=True,
    num_followups=3,
)

async def main():
    async for event in team.arun(
        "What are the latest advances in fusion energy?",
        stream=True,
        stream_events=True,
    ):
        if event.event == TeamRunEvent.run_content and event.content:
            print(event.content, end="", flush=True)

        if event.event == TeamRunEvent.followups_completed:
            print("\n\nFollowup suggestions:")
            for i, suggestion in enumerate(event.followups or [], 1):
                print(f"  {i}. {suggestion}")

asyncio.run(main())
```

## [​](#developer-resources) Developer Resources

- [Agent followup suggestions](/agents/usage/agent-with-followup-suggestions)
- [Team reference](/reference/teams/team)
- [TeamRunOutput reference](/reference/teams/team-response)

⌘I
