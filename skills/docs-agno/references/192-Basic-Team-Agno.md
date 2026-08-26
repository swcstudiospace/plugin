# Basic Team - Agno

Source: https://docs.agno.com/teams/usage/basic-team

A basic team with two specialized agents:

1. **HackerNews Researcher** - Gets trending stories from HackerNews
2. **Finance Agent** - Gets stock prices and financial data

The team leader coordinates by delegating to the appropriate agent based on the user’s request.

1

Create a Python file

basic\_team.py

```
from agno.agent import Agent
from agno.models.openai import OpenAIResponses
from agno.team import Team
from agno.tools.hackernews import HackerNewsTools
from agno.tools.yfinance import YFinanceTools

hn_researcher = Agent(
    name="HackerNews Researcher",
    model=OpenAIResponses(id="gpt-5.2"),
    role="Gets trending stories from HackerNews.",
    tools=[HackerNewsTools()],
)

finance_agent = Agent(
    name="Finance Agent",
    model=OpenAIResponses(id="gpt-5.2"),
    role="Gets stock prices and financial data.",
    tools=[YFinanceTools()],
)

team = Team(
    name="Research Team",
    model=OpenAIResponses(id="gpt-5.2"),
    members=[hn_researcher, finance_agent],
    instructions=[
        "Delegate to the HackerNews Researcher for tech news and trends.",
        "Delegate to the Finance Agent for stock prices and financial data.",
        "Synthesize the results into a clear summary.",
    ],
    markdown=True,
    show_members_responses=True,
)

team.print_response(
    input="What are the top AI stories on HackerNews and how is NVDA doing?",
    stream=True
)
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
uv pip install -U agno openai yfinance
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
python basic_team.py
```

⌘I
