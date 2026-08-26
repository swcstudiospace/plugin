# Agent with Memory

Source: https://docs.agno.com/agents/usage/agent-with-memory.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Agent with Memory
> Store user preferences that persist across conversations.
Memory lets your agent remember facts about users across conversations. Unlike storage (which persists conversation history), memory stores user-level information like preferences and context.

```python agent\_with\_memory.py theme={null}
from agno.agent import Agent
from agno.db.sqlite import SqliteDb
from agno.memory import MemoryManager
from agno.models.openai import OpenAIResponses
from agno.tools.yfinance import YFinanceTools
from rich.pretty import pprint
db = SqliteDb(db\_file="tmp/agents.db")
memory\_manager = MemoryManager(
model=OpenAIResponses(id="gpt-5.2"),
db=db,
)
agent = Agent(
model=OpenAIResponses(id="gpt-5.2"),
tools=[YFinanceTools(all=True)],
db=db,
memory\_manager=memory\_manager,
enable\_agentic\_memory=True,
markdown=True,
)
user\_id = "investor@example.com"
# Tell the agent about yourself
agent.print\_response(
"I'm interested in AI and semiconductor stocks. My risk tolerance is moderate.",
user\_id=user\_id,
stream=True,
)
# The agent now knows your preferences
agent.print\_response(
"What stocks would you recommend for me?",
user\_id=user\_id,
stream=True,
)
# View stored memories
memories = agent.get\_user\_memories(user\_id=user\_id)
print("\nStored Memories:")
pprint(memories)
```

```bash theme={null}
uv pip install -U agno openai yfinance sqlalchemy rich
```

```bash Mac/Linux theme={null}
export OPENAI\_API\_KEY="your\_openai\_api\_key\_here"
```
```powershell Windows theme={null}
$Env:OPENAI\_API\_KEY="your\_openai\_api\_key\_here"
```

```bash theme={null}
python agent\_with\_memory.py
```
## Memory vs Storage
| Feature | Storage | Memory |
| -------------- | ---------------------- | ------------------------------ |
| What it stores | Conversation history | User preferences and facts |
| Scope | Per session | Per user (across all sessions) |
| Use case | "What did we discuss?" | "What do you know about me?" |
## Enabling Memory
1. \*\*`enable\_agentic\_memory=True`\*\* (used above): Adds an `update\_user\_memory` tool. The model decides whether to call it. Existing memories are added to context.
2. \*\*`update\_memory\_on\_run=True`\*\*: Runs the memory manager for each non-empty user input. This adds a model call and does not guarantee that every detail becomes a memory.
