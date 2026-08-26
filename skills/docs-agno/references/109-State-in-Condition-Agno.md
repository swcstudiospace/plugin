# State in Condition - Agno

Source: https://docs.agno.com/state/workflows/access-session-state-in-condition-evaluator-function

This example shows:

1. Using `run_context.session_state` in a Condition evaluator function
2. Reading and modifying session state based on condition logic
3. Accessing `current_user_id` and `current_session_id` from `run_context.session_state`
4. Making conditional decisions based on session state

Accepting a `session_state` parameter directly is deprecated. Accept `run_context: RunContext` and use `run_context.session_state` instead.

1

Create a Python file

access\_session\_state\_in\_condition\_evaluator\_function.py

```
from agno.agent import Agent
from agno.db.in_memory import InMemoryDb
from agno.models.openai import OpenAIResponses
from agno.run import RunContext
from agno.workflow.condition import Condition
from agno.workflow.step import Step, StepInput, StepOutput
from agno.workflow.workflow import Workflow

def check_user_has_context(step_input: StepInput, run_context: RunContext) -> bool:
    """
    Condition evaluator that checks if user has been greeted before.

    Args:
        step_input: The input for this step (contains workflow context)
        run_context: The run context holding the workflow session state

    Returns:
        bool: True if user has context, False otherwise
    """
    print("\n=== Evaluating Condition ===")
    print(f"User ID: {run_context.session_state.get('current_user_id')}")
    print(f"Session ID: {run_context.session_state.get('current_session_id')}")
    print(f"Has been greeted: {run_context.session_state.get('has_been_greeted', False)}")

    # Check if user has been greeted before
    return run_context.session_state.get("has_been_greeted", False)

def mark_user_as_greeted(step_input: StepInput, run_context: RunContext) -> StepOutput:
    """Custom function that marks user as greeted in session state."""
    print("\n=== Marking User as Greeted ===")
    run_context.session_state["has_been_greeted"] = True
    run_context.session_state["greeting_count"] = run_context.session_state.get("greeting_count", 0) + 1

    return StepOutput(
        content=f"User has been greeted. Total greetings: {run_context.session_state['greeting_count']}"
    )

# Create agents
greeter_agent = Agent(
    name="Greeter",
    model=OpenAIResponses(id="gpt-5.2"),
    instructions="Greet the user warmly and introduce yourself.",
    markdown=True,
)

contextual_agent = Agent(
    name="Contextual Assistant",
    model=OpenAIResponses(id="gpt-5.2"),
    instructions="Continue the conversation with context. You already know the user.",
    markdown=True,
)

# Create workflow with condition
workflow = Workflow(
    name="Conditional Greeting Workflow",
    db=InMemoryDb(),
    steps=[
        # First, check if user has been greeted before
        Condition(
            name="Check If New User",
            description="Check if this is a new user who needs greeting",
            # Condition returns True if user has context, so we negate it
            evaluator=lambda step_input, run_context: not check_user_has_context(
                step_input, run_context
            ),
            steps=[
                # Only execute these steps for new users
                Step(
                    name="Greet User",
                    description="Greet the new user",
                    agent=greeter_agent,
                ),
                Step(
                    name="Mark as Greeted",
                    description="Mark user as greeted in session",
                    executor=mark_user_as_greeted,
                ),
            ],
        ),
        # This step always executes
        Step(
            name="Handle Query",
            description="Handle the user's query with or without greeting",
            agent=contextual_agent,
        ),
    ],
    session_state={
        "has_been_greeted": False,
        "greeting_count": 0,
    },
)

def run_example():
    """Run the example workflow multiple times to see conditional behavior."""

    print("=" * 80)
    print("First Run - New User (Condition will be True, greeting will happen)")
    print("=" * 80)

    workflow.print_response(
        input="Hi, can you help me with something?",
        session_id="user-123",
        user_id="user-123",
        stream=True,
    )

    print("\n" + "=" * 80)
    print("Second Run - Same Session (Skips greeting)")
    print("=" * 80)

    workflow.print_response(
        input="Tell me a joke",
        session_id="user-123",
        user_id="user-123",
        stream=True,
    )

if __name__ == "__main__":
    run_example()
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
uv pip install -U agno openai
```

4

Export your OpenAI API key

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

5

Run Workflow

```
python access_session_state_in_condition_evaluator_function.py
```

⌘I
