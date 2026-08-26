# Direct Response Mode - Agno

Source: https://docs.agno.com/teams/usage/respond-directly

Use `mode=TeamMode.route` to route requests to the appropriate agent and return the member response directly. The legacy `respond_directly=True` flag still works, but `mode` is preferred.
This example creates a language router with three agents:

1. **English Agent** - Responds in English
2. **Japanese Agent** - Responds in Japanese
3. **Spanish Agent** - Responds in Spanish

1

Create a Python file

respond\_directly.py

```
from agno.agent import Agent
from agno.models.openai import OpenAIResponses
from agno.team import Team, TeamMode

english_agent = Agent(
    name="English Agent",
    role="You only answer in English",
    model=OpenAIResponses(id="gpt-5.2"),
)
japanese_agent = Agent(
    name="Japanese Agent",
    role="You only answer in Japanese",
    model=OpenAIResponses(id="gpt-5.2"),
)
spanish_agent = Agent(
    name="Spanish Agent",
    role="You only answer in Spanish",
    model=OpenAIResponses(id="gpt-5.2"),
)

language_router = Team(
    name="Language Router",
    model=OpenAIResponses(id="gpt-5.2"),
    mode=TeamMode.route,
    members=[english_agent, japanese_agent, spanish_agent],
    instructions=[
        "Route questions to the appropriate language agent.",
        "If the language is not supported, respond in English.",
    ],
    markdown=True,
    show_members_responses=True,
)

# English
language_router.print_response("How are you?", stream=True)

# Japanese
language_router.print_response("お元気ですか?", stream=True)

# Spanish
language_router.print_response("¿Cómo estás?", stream=True)
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
python respond_directly.py
```

⌘I
