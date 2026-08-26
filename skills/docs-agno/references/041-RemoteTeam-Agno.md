# RemoteTeam - Agno

Source: https://docs.agno.com/reference/teams/remote-team

`RemoteTeam` allows you to run teams that are hosted on a remote AgentOS instance. It provides the same interface as a local team, making it easy to integrate remote teams into your applications.

## [​](#installation) Installation

```
pip install 'agno[os]'
```

## [​](#basic-usage) Basic Usage

```
from agno.team import RemoteTeam

# Create a remote team pointing to a remote AgentOS instance
team = RemoteTeam(
    base_url="http://localhost:7777",
    team_id="research-team",
)

# Run the team (async)
response = await team.arun("Research the latest AI trends")
print(response.content)
```

## [​](#parameters) Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `base_url` | `str` | Required | Base URL of the remote AgentOS instance (e.g., `"http://localhost:7777"`) |
| `team_id` | `str` | Required | ID of the remote team to execute |
| `timeout` | `float` | `300.0` | Request timeout in seconds |
| `protocol` | `Literal["agentos", "a2a"]` | `"agentos"` | Communication protocol: AgentOS REST API or A2A for cross-framework communication |
| `a2a_protocol` | `Literal["json-rpc", "rest"]` | `"rest"` | Transport used when `protocol="a2a"`: JSON-RPC or REST |
| `config_ttl` | `float` | `300.0` | Time-to-live for cached configuration in seconds |

## [​](#properties) Properties

### [​](#id) `id`

Returns the team ID.

```
print(team.id)  # "research-team"
```

### [​](#name) `name`

Returns the team’s name from the remote configuration.

```
print(team.name)  # "Research Team"
```

### [​](#description) `description`

Returns the team’s description from the remote configuration.

```
print(team.description)  # "A team of research specialists"
```

### [​](#role) `role`

Returns the team’s role from the remote configuration. Unlike the other accessors, `role` is a method, so call it.

```
print(team.role())  # "researcher"
```

### [​](#tools) `tools`

Returns the team’s tools as a list of dictionaries.

```
tools = team.tools
if tools:
    for tool in tools:
        print(tool["name"])
```

### [​](#db) `db`

Returns a `RemoteDb` instance if the team has a database configured.

```
if team.db:
    print(f"Database ID: {team.db.id}")
```

### [​](#knowledge) `knowledge`

Returns a `RemoteKnowledge` instance if the team has knowledge configured.

```
if team.knowledge:
    print("Team has knowledge enabled")
```

## [​](#methods) Methods

### [​](#arun) `arun`

Execute the remote team asynchronously.

```
# Non-streaming
response = await team.arun(
    "Research AI trends",
    user_id="user-123",
    session_id="session-456",
)
print(response.content)

# Streaming
async for event in team.arun(
    "Analyze this topic",
    stream=True,
    user_id="user-123",
):
    if hasattr(event, "content") and event.content:
        print(event.content, end="", flush=True)
```

**Parameters:**

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `str | List | Dict | Message | BaseModel` | Required | The input message for the team |
| `stream` | `bool` | `False` | Whether to stream the response |
| `user_id` | `Optional[str]` | `None` | User ID for the run |
| `session_id` | `Optional[str]` | `None` | Session ID for context persistence |
| `session_state` | `Optional[Dict]` | `None` | Session state dictionary |
| `images` | `Optional[Sequence[Image]]` | `None` | Images to include |
| `audio` | `Optional[Sequence[Audio]]` | `None` | Audio to include |
| `videos` | `Optional[Sequence[Video]]` | `None` | Videos to include |
| `files` | `Optional[Sequence[File]]` | `None` | Files to include |
| `stream_events` | `Optional[bool]` | `None` | Whether to stream events |
| `retries` | `Optional[int]` | `None` | Number of retries |
| `knowledge_filters` | `Optional[Dict]` | `None` | Filters for knowledge search |
| `add_history_to_context` | `Optional[bool]` | `None` | Add history to context |
| `add_dependencies_to_context` | `Optional[bool]` | `None` | Add dependencies to context |
| `add_session_state_to_context` | `Optional[bool]` | `None` | Add session state to context |
| `dependencies` | `Optional[Dict]` | `None` | Dependencies dictionary |
| `metadata` | `Optional[Dict]` | `None` | Metadata dictionary |
| `auth_token` | `Optional[str]` | `None` | JWT token for authentication |

**Returns:**

- `TeamRunOutput` when `stream=False`
- `AsyncIterator[TeamRunOutputEvent]` when `stream=True`

### [​](#acontinue_run) `acontinue_run`

Continue a paused team run with requirements (e.g., tool approval results).
**Parameters:**

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `run_id` | `str` | Required | ID of the run to continue |
| `requirements` | `List[Any]` | Required | `RunRequirement` objects with tool execution results |
| `stream` | `bool` | `False` | Whether to stream the response |
| `user_id` | `Optional[str]` | `None` | User ID |
| `session_id` | `Optional[str]` | `None` | Session ID |
| `auth_token` | `Optional[str]` | `None` | JWT token for authentication |

**Returns:**

- `TeamRunOutput` when `stream=False`
- `AsyncIterator[TeamRunOutputEvent]` when `stream=True`

### [​](#acancel_run) `acancel_run`

Cancel a running team execution.

```
success = await team.acancel_run(run_id="run-123")
if success:
    print("Run cancelled")
```

**Parameters:**

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `run_id` | `str` | Required | ID of the run to cancel |
| `auth_token` | `Optional[str]` | `None` | JWT token for authentication |

**Returns:** `bool` - True if successfully cancelled

### [​](#get_team_config) `get_team_config`

Get the team configuration from the remote server (always fetches fresh).

```
config = await team.get_team_config()
print(f"Team name: {config.name}")
print(f"Members: {config.members}")
```

**Returns:** `TeamResponse`

### [​](#refresh_config) `refresh_config`

Force refresh the cached team configuration.

```
config = await team.refresh_config()
```

**Returns:** `Optional[TeamResponse]` (`None` when using the A2A protocol)
`RemoteTeam` can connect to any A2A-compatible server using the `protocol="a2a"` parameter:

### [​](#connecting-to-agno-a2a-servers) Connecting to Agno A2A Servers

```
from agno.team import RemoteTeam

# Connect to an Agno AgentOS with A2A interface
team = RemoteTeam(
    base_url="http://localhost:7001/a2a/teams/my-team",
    team_id="my-team",
    protocol="a2a",
)

response = await team.arun("Hello!")
print(response.content)
```

| Protocol | a2a\_protocol | Use Case |
| --- | --- | --- |
| `"agentos"` | N/A | Default. Connect to Agno AgentOS REST API |
| `"a2a"` | `"rest"` | Connect to A2A servers using REST endpoints |
| `"a2a"` | `"json-rpc"` | Connect to Google ADK or pure JSON-RPC A2A servers |

## [​](#using-in-agentos-gateway) Using in AgentOS Gateway

Remote teams can be registered in a local AgentOS to create a gateway:

```
from agno.team import RemoteTeam
from agno.os import AgentOS

agent_os = AgentOS(
    teams=[
        RemoteTeam(base_url="http://server-1:7777", team_id="research-team"),
        RemoteTeam(base_url="http://server-2:7777", team_id="analysis-team"),
    ],
)
```

See [AgentOS Gateway](/agent-os/remote-execution/gateway) for more details.

## [​](#streaming-example) Streaming Example

```
from agno.team import RemoteTeam
from agno.run.team import RunContentEvent, RunCompletedEvent

team = RemoteTeam(
    base_url="http://localhost:7777",
    team_id="research-team",
)

print("Response: ", end="", flush=True)
async for event in team.arun(
    "Analyze the current state of AI",
    stream=True,
    user_id="user-123",
):
    if isinstance(event, RunContentEvent):
        print(event.content, end="", flush=True)
    elif isinstance(event, RunCompletedEvent):
        print(f"\n\nCompleted: {event.run_id}")
```

## [​](#error-handling) Error Handling

```
from agno.exceptions import RemoteServerUnavailableError

try:
    response = await team.arun("Hello")
except RemoteServerUnavailableError as e:
    print(f"Remote server unavailable: {e.message}")
```

## [​](#authentication) Authentication

For authenticated AgentOS instances, pass the `auth_token` parameter:

```
response = await team.arun(
    "Research this topic",
    auth_token="your-jwt-token",
)
```

⌘I
