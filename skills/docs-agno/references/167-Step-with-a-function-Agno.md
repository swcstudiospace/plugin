# Step with a function - Agno

Source: https://docs.agno.com/workflows/usage/step-with-function

A `Step` can run a Python function that accepts `StepInput` and returns `StepOutput`.

step\_with\_function.py

```
from agno.agent import Agent
from agno.db.sqlite import SqliteDb
from agno.models.openai import OpenAIChat
from agno.tools.hackernews import HackerNewsTools
from agno.workflow.step import Step, StepInput, StepOutput
from agno.workflow.workflow import Workflow

research_agent = Agent(
    name="Hacker News Researcher",
    model=OpenAIChat(id="gpt-4o"),
    tools=[HackerNewsTools()],
    instructions="Find relevant Hacker News stories and summarize the key points.",
)

content_planner = Agent(
    name="Content Planner",
    model=OpenAIChat(id="gpt-4o"),
    instructions="Create an actionable content plan from the supplied research.",
)

def create_content_plan(step_input: StepInput) -> StepOutput:
    """Create a content plan from the previous step's research."""
    message = step_input.input
    previous_step_content = step_input.previous_step_content

    planning_prompt = f"""
    Topic: {message}
    Research: {previous_step_content or "No research results"}

    Create a four-week content plan with three posts per week.
    """

    try:
        response = content_planner.run(planning_prompt)
        return StepOutput(content=response.content)
    except Exception as exc:
        return StepOutput(
            content=f"Content planning failed: {exc}",
            success=False,
        )

research_step = Step(
    name="Research Step",
    agent=research_agent,
)

content_planning_step = Step(
    name="Content Planning Step",
    executor=create_content_plan,
)

if __name__ == "__main__":
    content_creation_workflow = Workflow(
        name="Content Creation Workflow",
        db=SqliteDb(
            session_table="workflow_session",
            db_file="tmp/workflow.db",
        ),
        steps=[research_step, content_planning_step],
    )
    content_creation_workflow.print_response(
        input="AI agent trends",
        markdown=True,
    )
```

## [​](#install) Install

```
uv pip install agno openai sqlalchemy
```

## [​](#set-openai-key) Set OpenAI Key

Set your `OPENAI_API_KEY` as an environment variable. You can get one [from OpenAI](https://platform.openai.com/account/api-keys).

Mac

Windows

```
export OPENAI_API_KEY=sk-***
```

```
setx OPENAI_API_KEY sk-***
```

## [​](#how-it-works) How it works

1. `research_step` runs the agent and produces the first step output.
2. The workflow exposes that output through `step_input.previous_step_content`.
3. `create_content_plan` returns a `StepOutput`, which becomes the workflow’s final output.

## [​](#next-steps) Next steps

| Task | Guide |
| --- | --- |
| Stream a function step through AgentOS | [Function step streaming](/workflows/usage/step-with-function-streaming-agentos) |
| Combine steps into a sequence | [Sequence of steps](/workflows/usage/sequence-of-steps) |

⌘I
