# Non-Reasoning Model Agent - Agno

Source: https://docs.agno.com/reasoning/usage/agents/non-reasoning-model-cot

Example showing how to use a non-reasoning model as a reasoning model.
For reasoning, we recommend using a Reasoning Agent (with `reasoning=True`), or using an appropriate reasoning model with `reasoning_model`.

1

Add the following code to your Python file

non-reasoning-model-cot.py

```
from agno.agent import Agent
from agno.models.openai import OpenAIResponses

reasoning_agent = Agent(
    model=OpenAIResponses(id="gpt-5.2"),
    reasoning_model=OpenAIResponses(
        id="gpt-4.1", # This model will be used for reasoning, although it is not a native reasoning model.
        max_output_tokens=1200,
    ),
    markdown=True,
)
reasoning_agent.print_response(
    "Give me steps to write a python script for fibonacci series",
    stream=True,
    show_full_reasoning=True,
)

# It uses the default model of the Agent
reasoning_agent = Agent(
    model=OpenAIResponses(id="gpt-4.1", max_output_tokens=1200),
    reasoning=True,
    markdown=True,
)
reasoning_agent.print_response(
    "Give me steps to write a python script for fibonacci series",
    stream=True,
    show_full_reasoning=True,
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
uv pip install -U openai agno
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
python non-reasoning-model-cot.py
```

⌘I
