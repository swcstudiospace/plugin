# Building Teams - Agno

Source: https://docs.agno.com/teams/building-teams

Start simple: a model, team members, and instructions. Add functionality as needed.

## [​](#minimal-example) Minimal Example

research\_team.py

```
from agno.team import Team
from agno.agent import Agent
from agno.models.openai import OpenAIResponses
from agno.tools.hackernews import HackerNewsTools
from agno.tools.yfinance import YFinanceTools

news_agent = Agent(
    name="News Agent",
    role="Get trending tech news from HackerNews",
    tools=[HackerNewsTools()]
)

finance_agent = Agent(
    name="Finance Agent",
    role="Get stock prices and financial data",
    tools=[YFinanceTools()]
)

team = Team(
    name="Research Team",
    members=[news_agent, finance_agent],
    model=OpenAIResponses(id="gpt-5.4-mini"),
    instructions="Delegate to the appropriate agent based on the request."
)

team.print_response("What are the trending AI stories and how is NVDA stock doing?", stream=True)
```

## [​](#team-modes) Team Modes

Teams default to coordinate mode (leader delegates and synthesizes). Set `mode` to change how the leader collaborates with members.

```
from agno.team.mode import TeamMode
from agno.models.openai import OpenAIResponses

team = Team(
    name="Language Router",
    members=[...],
    model=OpenAIResponses(id="gpt-5.4-mini"),
    mode=TeamMode.route
)
```

| Mode | Configuration | Use case |
| --- | --- | --- |
| **Coordinate** | `mode=TeamMode.coordinate` (default) | Decompose work, delegate to members, synthesize results |
| **Route** | `mode=TeamMode.route` | Route to a single specialist and return their response directly |
| **Broadcast** | `mode=TeamMode.broadcast` | Delegate the same task to all members and synthesize |
| **Tasks** | `mode=TeamMode.tasks` | Run a task list loop until the goal is complete |

Tasks mode runs an iterative task loop. Use `max_iterations` to cap how many cycles the leader can run.

```
from agno.team.mode import TeamMode
from agno.models.openai import OpenAIResponses

team = Team(
    name="Ops Team",
    members=[...],
    model=OpenAIResponses(id="gpt-5.4-mini"),
    mode=TeamMode.tasks,
    max_iterations=6
)
```

## [​](#team-members) Team Members

Each member should have a `name` and `role`. The team leader uses these to decide who handles what.

```
news_agent = Agent(
    name="News Agent",                              # Identifies the agent
    role="Get trending tech news from HackerNews",  # Tells the leader what this agent does
    tools=[HackerNewsTools()]
)
```

For better tracing, also set an `id`:

```
news_agent = Agent(
    id="news-agent",
    name="News Agent",
    role="Get trending tech news from HackerNews",
    tools=[HackerNewsTools()]
)
```

When both `id` and `name` are set on a member, team delegation uses `id` as the member identifier.

Members must be native Agno `Agent` or `Team` instances. External-framework
adapters (`ClaudeAgent`, `LangGraphAgent`, `DSPyAgent`) can be served by
AgentOS as standalone agents but cannot be a member agent of an Agno Team or an agent of a Workflow Step yet. See
[Multi-Framework Support](/agent-os/multi-framework/overview).

## [​](#nested-teams) Nested Teams

Teams can contain other teams. The top-level leader delegates to sub-team leaders, who delegate to their members.

```
from agno.team import Team
from agno.agent import Agent

team = Team(
    name="Language Team",
    members=[
        Agent(name="English Agent", role="Answer in English"),
        Agent(name="Chinese Agent", role="Answer in Chinese"),
        Team(
            name="Germanic Team",
            role="Handle German and Dutch questions",
            members=[
                Agent(name="German Agent", role="Answer in German"),
                Agent(name="Dutch Agent", role="Answer in Dutch"),
            ],
        ),
    ],
)
```

## [​](#model-inheritance) Model Inheritance

Agent members inherit the parent team’s `model` when their own model is unset. Nested teams initialize their own model unless you set one explicitly.

```
from agno.team import Team
from agno.agent import Agent
from agno.models.openai import OpenAIResponses
from agno.models.anthropic import Claude

# This agent uses its own model (Claude)
agent_with_model = Agent(
    name="Claude Agent",
    model=Claude(id="claude-sonnet-4-5"),
    role="Research with Claude"
)

# This agent inherits gpt-5.4-mini from the team
agent_without_model = Agent(
    name="Inherited Agent",
    role="Research with inherited model"
)

team = Team(
    name="Research Team",
    model=OpenAIResponses(id="gpt-5.4-mini"),  # Default for team and members without a model
    members=[agent_with_model, agent_without_model]
)
```

## [​](#callable-factories) Callable Factories

Pass a function instead of a static list for `members`, `tools`, or `knowledge`. The function is called at the start of each run, so the composition can vary per user or session.

team\_callable\_members.py

```
from agno.agent import Agent
from agno.models.openai import OpenAIResponses
from agno.team import Team

writer = Agent(
    name="Writer",
    role="Content writer",
    model=OpenAIResponses(id="gpt-5-mini"),
    instructions=["Write clear, concise content."],
)

researcher = Agent(
    name="Researcher",
    role="Research analyst",
    model=OpenAIResponses(id="gpt-5-mini"),
    instructions=["Research topics and summarize findings."],
)

def pick_members(session_state: dict):
    if session_state.get("needs_research", False):
        return [researcher, writer]
    return [writer]

team = Team(
    name="Content Team",
    model=OpenAIResponses(id="gpt-5-mini"),
    members=pick_members,
    cache_callables=False,
)

team.print_response(
    "Write a haiku about Python",
    session_state={"needs_research": False},
    stream=True,
)

team.print_response(
    "Research the history of Python and write a short summary",
    session_state={"needs_research": True},
    stream=True,
)
```

The same pattern works for `tools` and `knowledge`. Agents also support callable factories for `tools` and `knowledge`.

### [​](#injected-parameters) Injected Parameters

Name your factory function parameters to receive context automatically:

| Parameter | Type | Description |
| --- | --- | --- |
| `agent` | `Agent` | The current Agent instance |
| `team` | `Team` | The current Team instance |
| `run_context` | `RunContext` | Run context with `user_id`, `session_id`, `session_state` |
| `session_state` | `dict` | Session state dict directly (defaults to `{}` if `None`) |

Use any combination. A zero-argument factory also works.

### [​](#add_tool-and-set_tools) `add_tool` and `set_tools`

`add_tool()` raises `RuntimeError` when `tools` is a callable factory. Use `set_tools()` to replace the factory entirely:

```
team = Team(members=[...], tools=tools_for_user)

team.add_tool(some_tool)              # raises RuntimeError

team.set_tools(new_factory)           # replace with a new factory
team.set_tools([DuckDuckGoTools()])   # replace with a static list
```

### [​](#callable-caching-settings) Callable Caching Settings

Factory results are cached by default. The cache key is resolved in this order: custom key function > `user_id` > `session_id`. If none are available, caching is skipped and the factory runs every time.

| Setting | Default | Description |
| --- | --- | --- |
| `cache_callables` | `True` | Enable or disable caching for all callable factories |
| `callable_tools_cache_key` | `None` | Custom cache key function for tools factory |
| `callable_knowledge_cache_key` | `None` | Custom cache key function for knowledge factory |
| `callable_members_cache_key` | `None` | Custom cache key function for members factory (Team only) |

Set `cache_callables=False` when `session_state` changes between runs and the factory should re-evaluate each time.
Clear cached results programmatically:

```
from agno.utils.callables import clear_callable_cache

clear_callable_cache(team)                            # Clear all caches
clear_callable_cache(team, kind="tools")              # Clear tools cache only
clear_callable_cache(team, kind="tools", close=True)  # Clear and call .close() on cached resources
```

Use `aclear_callable_cache()` in async code.

## [​](#team-features) Team Features

Teams support the same features as agents:

| Feature | Description |
| --- | --- |
| Instructions | Guide the team leader on how to coordinate |
| Mode | Choose the coordination strategy (`coordinate`, `route`, `broadcast`, `tasks`) |
| Database | Persist session history and state |
| Reasoning | Enable the leader to plan before delegating |
| Knowledge | Give the leader access to a knowledge base |
| Memory | Store and recall information across sessions |
| Tools | Give the leader tools to use directly |
| Skills | Give the leader domain expertise via instructions, scripts, and references |

See the guides below to add these features.

## [​](#next-steps) Next Steps

| Task | Guide |
| --- | --- |
| Run teams | [Running Teams](/teams/running-teams) |
| Control delegation | [Delegation](/teams/delegation) |
| Add skills | [Team Skills](/skills/team-skills) |
| Add chat history | [Chat History](/history/team/overview) |
| Manage sessions | [Sessions](/sessions/overview) |
| Handle input/output | [Input and Output](/input-output/overview) |
| Add knowledge | [Knowledge](/knowledge/overview) |
| Add guardrails | [Guardrails](/guardrails/overview) |

## [​](#developer-resources) Developer Resources

- [Team reference](/reference/teams/team)
- [Team examples](/examples/teams/overview)

⌘I
