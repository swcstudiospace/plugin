# Agent with Structured Output

Source: https://docs.agno.com/agents/usage/agent-with-structured-output.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Agent with Structured Output
> Get typed Pydantic responses instead of free-form text.
Use `output\_schema` to get structured, typed responses. The agent returns a Pydantic model instead of free-form text.

```python structured\_output.py theme={null}
from typing import List, Optional
from agno.agent import Agent
from agno.models.openai import OpenAIResponses
from agno.tools.yfinance import YFinanceTools
from pydantic import BaseModel, Field
class StockAnalysis(BaseModel):
ticker: str = Field(..., description="Stock ticker symbol")
company\_name: str = Field(..., description="Full company name")
current\_price: float = Field(..., description="Current price in USD")
pe\_ratio: Optional[float] = Field(None, description="P/E ratio")
summary: str = Field(..., description="One-line summary")
key\_drivers: List[str] = Field(..., description="2-3 key growth drivers")
key\_risks: List[str] = Field(..., description="2-3 key risks")
agent = Agent(
model=OpenAIResponses(id="gpt-5.2"),
tools=[YFinanceTools(all=True)],
output\_schema=StockAnalysis,
)
response = agent.run("Analyze NVIDIA stock")
# Access typed data directly
analysis: StockAnalysis = response.content
print(f"{analysis.company\_name} ({analysis.ticker})")
print(f"Price: ${analysis.current\_price}")
print(f"P/E Ratio: {analysis.pe\_ratio or 'N/A'}")
print(f"Summary: {analysis.summary}")
print("Key Drivers:")
for driver in analysis.key\_drivers:
print(f" - {driver}")
print("Key Risks:")
for risk in analysis.key\_risks:
print(f" - {risk}")
```

```bash theme={null}
uv pip install -U agno openai yfinance
```

```bash Mac/Linux theme={null}
export OPENAI\_API\_KEY="your\_openai\_api\_key\_here"
```
```powershell Windows theme={null}
$Env:OPENAI\_API\_KEY="your\_openai\_api\_key\_here"
```

```bash theme={null}
python structured\_output.py
```
