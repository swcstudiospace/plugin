# Debugging Agents

Source: https://docs.agno.com/agents/debugging-agents.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Debugging Agents
> Inspect execution flow, tool calls, and intermediate steps.
Debug mode helps you understand the flow of execution and intermediate steps:
\* Inspect the messages sent to the model and the response it generates
\* Trace intermediate steps and monitor metrics like token usage and execution time
\* Inspect tool calls, errors, and their results
## Debug Mode
To enable debug mode:
1. Set `debug\_mode=True` on your agent to enable it for all runs.
2. Set `debug\_mode=True` on the `run` method to enable it for a single run.
3. Set the `AGNO\_DEBUG=True` environment variable to enable debug mode globally.
```python theme={null}
from agno.agent import Agent
from agno.models.anthropic import Claude
from agno.tools.hackernews import HackerNewsTools
agent = Agent(
model=Claude(id="claude-sonnet-4-5"),
tools=[HackerNewsTools()],
instructions="Write a report on the topic. Output only the report.",
markdown=True,
debug\_mode=True,
# debug\_level=2, # Uncomment for more detailed logs
)
# Run agent and print response to the terminal
agent.print\_response("Trending startups and products.")
```
Set `debug\_level=2` for more detailed logs.

[

](https://mintcdn.com/agno-v2/Xc0-_OHxxYe_vtGw/videos/debug_mode.mp4?fit=max&auto=format&n=Xc0-_OHxxYe_vtGw&q=85&s=67b080deec475663e285c22130987541)
## Interactive CLI
Agno includes a pre-built interactive CLI that runs your Agent as a command-line application. Use it to test multi-turn conversations:
```python theme={null}
from agno.agent import Agent
from agno.db.sqlite import SqliteDb
from agno.models.anthropic import Claude
from agno.tools.hackernews import HackerNewsTools
agent = Agent(
model=Claude(id="claude-sonnet-4-5"),
tools=[HackerNewsTools()],
db=SqliteDb(db\_file="tmp/data.db"),
add\_history\_to\_context=True,
num\_history\_runs=3,
markdown=True,
)
# Run agent as an interactive CLI app
agent.cli\_app(stream=True)
```
