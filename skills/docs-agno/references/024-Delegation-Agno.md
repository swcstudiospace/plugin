# Delegation - Agno

Source: https://docs.agno.com/teams/delegation

When you call `run()` on a team, the leader decides how to handle the request: respond directly, use tools, or delegate to members.
![Team delegation flow](https://mintcdn.com/agno-v2/i4nXCaAsJR5zgHQd/images/teams/team-delegate-light.png?fit=max&auto=format&n=i4nXCaAsJR5zgHQd&q=85&s=2ee1ac8bf7774125e30b2f8a8ba5e0e5)
![Team delegation flow](https://mintcdn.com/agno-v2/i4nXCaAsJR5zgHQd/images/teams/team-delegate-dark.png?fit=max&auto=format&n=i4nXCaAsJR5zgHQd&q=85&s=75634aa1f580bf358dafee8c7e114d85)
The default flow:

1. Team receives user input
2. Leader analyzes the input and decides which members to delegate to
3. Leader formulates a task for each selected member
4. Members execute and return results. Multiple async member calls can run concurrently.
5. Leader synthesizes results into a final response

Modes define whether the leader delegates, routes to one member, broadcasts to all members, or runs a task loop.
Modes are explicit orchestration patterns you can swap without changing member logic.
Members can also be provided by callable factories and resolved at run time. See [Callable Factories](/teams/overview#callable-factories).
You can customize this flow with team modes:

| Mode | Configuration | Behavior |
| --- | --- | --- |
| **Coordinate** (default) | `mode=TeamMode.coordinate` (or omit `mode`) | Leader selects members, formulates tasks, synthesizes results |
| **Route** | `mode=TeamMode.route` | When delegating, the leader routes to one member and returns that response directly |
| **Broadcast** | `mode=TeamMode.broadcast` | When delegating, the leader sends the same task to every member |
| **Tasks** | `mode=TeamMode.tasks` | Leader builds and executes a shared task list until the goal is complete |

Use `TeamMode` from `agno.team.mode` to set the mode explicitly. The leader can still answer directly or use its own tools. The legacy flags still work, but `mode` is the recommended approach.
Member selection and run tracking use member IDs. Set explicit `id` values on members for stable delegation identity.

## [​](#coordinate-mode-default) Coordinate Mode (Default)

The leader selects members, writes their tasks, and combines their outputs.

```
from agno.team import Team
from agno.agent import Agent
from agno.team.mode import TeamMode
from agno.models.openai import OpenAIResponses
from agno.tools.hackernews import HackerNewsTools
from agno.tools.yfinance import YFinanceTools

team = Team(
    name="Research Team",
    model=OpenAIResponses(id="gpt-5.4-mini"),
    members=[
        Agent(name="News Agent", role="Get tech news", tools=[HackerNewsTools()]),
        Agent(name="Finance Agent", role="Get stock data", tools=[YFinanceTools()])
    ],
    mode=TeamMode.coordinate,
    instructions="Research the topic thoroughly, then synthesize findings into a clear report."
)

team.print_response("What's happening with AI companies and their stock prices?")
```

Use this when:

- Tasks need decomposition into subtasks
- You want quality control over the final output
- The leader should add context or reasoning to member outputs

## [​](#route-mode) Route Mode

The leader selects which member handles the request and returns the member’s response directly. By default the leader can still craft the task; set `determine_input_for_members=False` to pass the user input through unchanged.
![Route mode flow](https://mintcdn.com/agno-v2/i4nXCaAsJR5zgHQd/images/teams/team-passthrough-light.png?fit=max&auto=format&n=i4nXCaAsJR5zgHQd&q=85&s=badf1c510d5f4ba340d79a775e83bd40)
![Route mode flow](https://mintcdn.com/agno-v2/i4nXCaAsJR5zgHQd/images/teams/team-passthrough-dark.png?fit=max&auto=format&n=i4nXCaAsJR5zgHQd&q=85&s=a6a7cb2997cea9eae541f879d2cce9be)

```
from agno.team import Team
from agno.agent import Agent
from agno.team.mode import TeamMode
from agno.models.openai import OpenAIResponses

team = Team(
    name="Language Router",
    model=OpenAIResponses(id="gpt-5.4-mini"),
    members=[
        Agent(name="English Agent", role="Answer questions in English"),
        Agent(name="Japanese Agent", role="Answer questions in Japanese"),
    ],
    mode=TeamMode.route,
    determine_input_for_members=False # Pass user input unchanged to member
)

team.print_response("How are you?")        # Routes to English Agent
team.print_response("お元気ですか?")        # Routes to Japanese Agent
```

Use this when:

- You have specialized agents and want automatic routing
- The member should receive the request unchanged
- You want lower latency (no synthesis step)

### [​](#legacy-configuration-flags) Legacy Configuration Flags

These flags still work, but are overridden by `mode` when set.
**`respond_directly=True`**: Return member responses without leader synthesis (maps to `TeamMode.route`).
![Direct response flow](https://mintcdn.com/agno-v2/i4nXCaAsJR5zgHQd/images/teams/team-direct-response-light.png?fit=max&auto=format&n=i4nXCaAsJR5zgHQd&q=85&s=a855fa91b944dceb3789755b812fe5c2)
![Direct response flow](https://mintcdn.com/agno-v2/i4nXCaAsJR5zgHQd/images/teams/team-direct-response-dark.png?fit=max&auto=format&n=i4nXCaAsJR5zgHQd&q=85&s=d9e2544a995856e07934634987e04b19)
**`determine_input_for_members=False`**: Send the user-message content to members instead of having the leader formulate a task. This applies to coordinate, route, and broadcast delegation.
![Raw input flow](https://mintcdn.com/agno-v2/i4nXCaAsJR5zgHQd/images/teams/team-raw-input-light.png?fit=max&auto=format&n=i4nXCaAsJR5zgHQd&q=85&s=50e30700e0ab7e2dee727e085960825a)
![Raw input flow](https://mintcdn.com/agno-v2/i4nXCaAsJR5zgHQd/images/teams/team-raw-input-dark.png?fit=max&auto=format&n=i4nXCaAsJR5zgHQd&q=85&s=e3d140d90d77da02c526c606c9446a52)
Combine both for a full passthrough:

```
team = Team(
    members=[...],
    respond_directly=True,
    determine_input_for_members=False,
)
```

## [​](#broadcast-mode) Broadcast Mode

The leader delegates the same task to all members. Synchronous runs execute members sequentially. Asynchronous runs execute them concurrently.
![Broadcast mode flow](https://mintcdn.com/agno-v2/i4nXCaAsJR5zgHQd/images/teams/team-delegate-to-all-members-light.png?fit=max&auto=format&n=i4nXCaAsJR5zgHQd&q=85&s=9db7cc875ebf53fc88ce5ef5ad900eb1)
![Broadcast mode flow](https://mintcdn.com/agno-v2/i4nXCaAsJR5zgHQd/images/teams/team-delegate-to-all-members-dark.png?fit=max&auto=format&n=i4nXCaAsJR5zgHQd&q=85&s=58079bd5c2876131bdc5c06da5dd2b8f)

```
import asyncio
from agno.team import Team
from agno.agent import Agent
from agno.team.mode import TeamMode
from agno.models.openai import OpenAIResponses
from agno.tools.hackernews import HackerNewsTools
from agno.tools.arxiv import ArxivTools
from agno.tools.duckduckgo import DuckDuckGoTools

team = Team(
    name="Research Team",
    model=OpenAIResponses(id="gpt-5.4-mini"),
    members=[
        Agent(name="HackerNews Researcher", role="Find discussions on HackerNews", tools=[HackerNewsTools()]),
        Agent(name="Academic Researcher", role="Find academic papers", tools=[ArxivTools()]),
        Agent(name="Web Researcher", role="Search the web", tools=[DuckDuckGoTools()]),
    ],
    mode=TeamMode.broadcast,
    instructions="Synthesize findings from all researchers into a comprehensive report."
)

# Use async for concurrent execution
asyncio.run(team.aprint_response("Research the current state of AI agents"))
```

Use this when:

- You want multiple perspectives on the same topic
- Members can work independently
- You can use `arun()` for concurrent member execution

If both `delegate_to_all_members=True` and `respond_directly=True` are set and `mode` is not set, Agno logs a warning and disables `respond_directly`. The task is still delegated to all members, but `team.mode` reports `TeamMode.route`. Set `mode` explicitly instead of combining these flags.

## [​](#tasks-mode) Tasks Mode

Tasks mode is an autonomous loop where the leader decomposes the goal into tasks, executes them, and marks the goal complete. The run stops if it reaches `max_iterations` first.

```
from agno.team import Team
from agno.agent import Agent
from agno.team.mode import TeamMode
from agno.models.openai import OpenAIResponses

team = Team(
    name="Ops Team",
    model=OpenAIResponses(id="gpt-5.4-mini"),
    members=[
        Agent(name="Research Agent", role="Collect findings"),
        Agent(name="Writer Agent", role="Draft the final report"),
    ],
    mode=TeamMode.tasks,
    max_iterations=6
)

team.print_response("Compile a short report on recent AI agent frameworks.")
```

## [​](#structured-input) Structured Input

When using `determine_input_for_members=False`, a Pydantic input is serialized to JSON in the user-message content sent to members:

```
from pydantic import BaseModel, Field
from agno.team import Team
from agno.agent import Agent
from agno.models.openai import OpenAIResponses
from agno.tools.hackernews import HackerNewsTools

class ResearchRequest(BaseModel):
    topic: str
    num_sources: int = Field(default=5)

research_agent = Agent(
    name="Research Agent",
    role="Research topics on HackerNews",
    tools=[HackerNewsTools()]
)

team = Team(
    name="Research Team",
    model=OpenAIResponses(id="gpt-5.4-mini"),
    members=[research_agent],
    determine_input_for_members=False  # Pass serialized user-message content to the member
)

request = ResearchRequest(topic="AI Agents", num_sources=10)
team.print_response(input=request)
```

## [​](#production-considerations) Production Considerations

### [​](#model-calls) Model Calls

| Mode | Delegated run pattern |
| --- | --- |
| Coordinate | Leader selection, one or more member runs, then leader synthesis |
| Route | Leader selection and one member run. The member response is returned directly |
| Broadcast | Leader delegation, every member run, then leader synthesis |
| Tasks | Repeated leader and member calls until completion or `max_iterations` |

### [​](#latency) Latency

- **Coordinate**: Selection and synthesis add leader model calls. Multiple async delegations can overlap.
- **Route**: Skips leader synthesis after a member is selected.
- **Broadcast**: Sync runs members sequentially. Async runs members concurrently before synthesis.
- **Tasks**: Runs multiple cycles until tasks are complete or `max_iterations` is reached.

### [​](#error-handling) Error Handling

Member and team retries are configured separately. Inspect `TeamToolCallError`, `TeamRunError`, member events, and member responses instead of assuming a partial result is complete. Test failure behavior for the selected mode and sync or async path.

## [​](#developer-resources) Developer Resources

- [Team reference](/reference/teams/team)
- [Team examples](/examples/teams/overview)

⌘I
