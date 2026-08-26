# Agent with Storage

Source: https://docs.agno.com/agents/usage/agent-with-storage.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Agent with Storage
> Persist conversation history across runs.
Storage lets your agent remember conversations. With the same `session\_id`, it picks up where you left off, even after restarting.

```python agent\_with\_storage.py theme={null}
from agno.agent import Agent
from agno.db.sqlite import SqliteDb
from agno.models.openai import OpenAIResponses
from agno.tools.yfinance import YFinanceTools
db = SqliteDb(db\_file="tmp/agents.db")
agent = Agent(
model=OpenAIResponses(id="gpt-5.2"),
tools=[YFinanceTools(all=True)],
db=db,
add\_history\_to\_context=True,
num\_history\_runs=5,
markdown=True,
)
session\_id = "finance-session"
# Turn 1: Analyze a stock
agent.print\_response(
"Give me a quick analysis of NVIDIA",
session\_id=session\_id,
stream=True,
)
# Turn 2: The agent remembers NVDA from turn 1
agent.print\_response(
"Compare that to AMD",
session\_id=session\_id,
stream=True,
)
# Turn 3: Ask based on full conversation
agent.print\_response(
"Which looks like the better investment?",
session\_id=session\_id,
stream=True,
)
```

```bash theme={null}
uv pip install -U agno openai yfinance sqlalchemy
```

```bash Mac/Linux theme={null}
export OPENAI\_API\_KEY="your\_openai\_api\_key\_here"
```
```powershell Windows theme={null}
$Env:OPENAI\_API\_KEY="your\_openai\_api\_key\_here"
```

```bash theme={null}
python agent\_with\_storage.py
```
## Key Concepts
\* \*\*Session:\*\* A conversation thread identified by `session\_id`
\* \*\*Same `session\_id` = continuous conversation\*\*, even across script runs
\* \*\*`add\_history\_to\_context=True`:\*\* Includes previous messages in context
\* \*\*`num\_history\_runs=5`:\*\* Number of previous runs to include
