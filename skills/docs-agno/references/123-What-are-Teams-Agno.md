# What are Teams? - Agno

Source: https://docs.agno.com/teams/overview

A Team coordinates agents or nested teams. In the default coordinate mode, the leader can delegate tasks based on member roles and synthesize their results.
![Team structure](https://mintcdn.com/agno-v2/i4nXCaAsJR5zgHQd/images/teams/team-structure-light.png?fit=max&auto=format&n=i4nXCaAsJR5zgHQd&q=85&s=0bbb6a84e04b9201746b0ff3495243e3)
![Team structure](https://mintcdn.com/agno-v2/i4nXCaAsJR5zgHQd/images/teams/team-structure-dark.png?fit=max&auto=format&n=i4nXCaAsJR5zgHQd&q=85&s=c4a60d21db7ffcd568b1d40c6eeb6866)

```
from agno.team import Team
from agno.agent import Agent

team = Team(members=[
    Agent(name="English Agent", role="You answer questions in English"),
    Agent(name="Chinese Agent", role="You answer questions in Chinese"),
    Team(
        name="Germanic Team",
        role="You coordinate the team members to answer questions in German and Dutch",
        members=[
            Agent(name="German Agent", role="You answer questions in German"),
            Agent(name="Dutch Agent", role="You answer questions in Dutch"),
        ],
    ),
])
```

## [​](#why-teams) Why Teams?

Use a team when separate roles, tools, or execution paths make a task easier to control.

| Benefit | Description |
| --- | --- |
| Specialization | Give each member a focused role and toolset |
| Coordination | Select coordinate, route, broadcast, or tasks mode |
| Composition | Nest teams when a sub-team needs its own leader and members |
| Inspection | Keep member responses and metrics separate from the leader response |

The leader and members make separate model calls. This adds latency, token usage, and coordination state.

## [​](#when-to-use-teams) When to Use Teams

**Use a team when:**

- A task requires multiple specialized agents with different tools or expertise
- You need an explicit routing, broadcast, or task-list pattern
- Member runs need separate outputs or metrics

**Use a single agent when:**

- The task fits one domain of expertise
- Minimizing token costs matters
- The extra coordination does not improve the result

## [​](#team-capabilities) Team Capabilities

### [​](#callable-factories) Callable Factories

Pass a function instead of a static list for `tools`, `knowledge`, or `members`. Agno calls it at the start of each run, injecting context based on the function's parameter names.

| Behavior | Details |
| --- | --- |
| Injected parameters | `agent`, `team`, `run_context`, `session_state` |
| Caching | Cached by custom key > `user_id` > `session_id`. Disable with `cache_callables=False` |
| Return types | Tools and members return a list or tuple. Knowledge returns a `KnowledgeProtocol` instance or `None` |

`knowledge`, `tools`, and `members` all accept callable factories. Agents also support callable factories for `knowledge` and `tools`. See [callable factories](/teams/building-teams#callable-factories) for examples and [caching settings](/teams/building-teams#callable-caching-settings) for cache key configuration.

## [​](#team-modes) Team Modes

`TeamMode` makes collaboration styles explicit. Prefer `mode=` instead of toggling `respond_directly` or `delegate_to_all_members` directly.

```
from agno.team import Team, TeamMode

team = Team(
    name="Research Team",
    members=[...],
    mode=TeamMode.broadcast,
)
```

Mode selection controls how the leader delegates. The leader can still answer directly or use its own tools. `mode` overrides legacy flags. If `mode` is not set, `respond_directly=True` maps to `TeamMode.route` and `delegate_to_all_members=True` maps to `TeamMode.broadcast`. Otherwise the team uses `TeamMode.coordinate`.

| Mode | Configuration | Use case |
| --- | --- | --- |
| **Coordinate** | `mode=TeamMode.coordinate` (default) | Decompose work, delegate to members, synthesize results |
| **Route** | `mode=TeamMode.route` | Route to a single specialist and return their response directly |
| **Broadcast** | `mode=TeamMode.broadcast` | Delegate the same task to all members and synthesize |
| **Tasks** | `mode=TeamMode.tasks` | Run a task list loop until the goal is complete |

Modes define the delegation path without changing member configuration. See [Delegation](/teams/delegation).

## [​](#guides) Guides

## Build Teams

Define members, roles, and structure.

## Run Teams

Execute teams and handle responses.

## Debug Teams

Inspect and troubleshoot team behavior.

## [​](#resources) Resources

- [Examples](/examples/teams/overview)
- [Reference](/reference/teams/team)

⌘I
