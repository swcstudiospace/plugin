# Agent with Structured Output - Agno

Source: https://docs.agno.com/agents/usage/agent-with-structured-output

Use `output_schema` to get structured, typed responses. The agent returns a Pydantic model instead of free-form text.

1

Create a Python file

structured\_output.py

```
from typing import List, Optional

from agno.agent import Agent
from agno.models.openai import OpenAIResponses
from agno.tools.yfinance import YFinanceTools
from pydantic import BaseModel, Field

class StockAnalysis(BaseModel):
    ticker: str = Field(..., description="Stock ticker symbol")
    company_name: str = Field(..., description="Full company name")
    current_price: float = Field(..., description="Current price in USD")
    pe_ratio: Optional[float] = Field(None, description="P/E ratio")
    summary: str = Field(..., description="One-line summary")
    key_drivers: List[str] = Field(..., description="2-3 key growth drivers")
    key_risks: List[str] = Field(..., description="2-3 key risks")

agent = Agent(
    model=OpenAIResponses(id="gpt-5.2"),
    tools=[YFinanceTools(all=True)],
    output_schema=StockAnalysis,
)

response = agent.run("Analyze NVIDIA stock")

# Access typed data directly
analysis: StockAnalysis = response.content
print(f"{analysis.company_name} ({analysis.ticker})")
print(f"Price: ${analysis.current_price}")
print(f"P/E Ratio: {analysis.pe_ratio or 'N/A'}")
print(f"Summary: {analysis.summary}")
print("Key Drivers:")
for driver in analysis.key_drivers:
    print(f"  - {driver}")
print("Key Risks:")
for risk in analysis.key_risks:
    print(f"  - {risk}")
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

Run Agent

```
python structured_output.py
```

⌘I
