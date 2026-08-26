# Human-in-the-Loop in Workflows - Agno

Source: https://docs.agno.com/workflows/hitl/overview

Workflows pause for user action at three levels:

| Level | What pauses | Configured on | Guide |
| --- | --- | --- | --- |
| **Step-level** | The workflow primitive, before or after it executes | `Step`, `Loop`, `Router`, `Condition`, `Steps` | [Step HITL](/workflows/hitl/step) |
| **Executor-level** | A tool call inside the agent or team running the step | The `@tool` decorator | [Executor HITL](/workflows/hitl/executor) |
| **Nested** | Both gates on the same step, in sequence | Both of the above | [Nested HITL](/workflows/hitl/nested) |

Pause state is persisted to the workflow’s database. When the user resolves the requirement, call `workflow.continue_run(run_output)` to resume from where it left off.

```
from agno.workflow import Workflow, OnReject
from agno.workflow.step import Step
from agno.workflow.types import HumanReview
from agno.db.sqlite import SqliteDb

workflow = Workflow(
    name="data_pipeline",
    db=SqliteDb(db_file="workflow.db"),  # Required for HITL
    steps=[
        Step(name="fetch_data", agent=fetch_agent),
        Step(
            name="process_data",
            agent=process_agent,
            human_review=HumanReview(
                requires_confirmation=True,
                confirmation_message="Process sensitive data?",
                on_reject=OnReject.skip,
            ),
        ),
    ],
)

run_output = workflow.run("Process user data")

if run_output.is_paused:
    for req in run_output.steps_requiring_confirmation:
        req.confirm()  # or req.reject()
    run_output = workflow.continue_run(run_output)
```

## [​](#pick-a-level) Pick a Level

| You want to… | Use |
| --- | --- |
| Approve a whole step before it runs | [Step confirmation](/workflows/hitl/step#confirmation) |
| Collect parameters before a step runs | [Step user input](/workflows/hitl/step#user-input) |
| Review a step’s output after it runs | [Output review](/workflows/hitl/output-review) |
| Let the user pick which Router branch executes | [Router selection](/workflows/hitl/router#user-selection) |
| Review each iteration of a Loop | [Loop iteration review](/workflows/hitl/loop#iteration-review) |
| Pause a specific tool call inside an agent | [Executor confirmation](/workflows/hitl/executor#confirmation) |
| Have an agent’s tool ask the user for argument values | [Executor user input](/workflows/hitl/executor#user-input) |
| Defer a tool’s execution to an external system | [External execution](/workflows/hitl/executor#external-execution) |
| Combine a step gate and a tool gate on the same step | [Nested HITL](/workflows/hitl/nested) |
| Pause when a step errors | [Error handling](/workflows/hitl/error-handling) |
| Auto-resolve a pause if the user is slow | [Timeout](/workflows/hitl/timeout) |

## [​](#step-level-vs-executor-level) Step-Level vs Executor-Level

| Aspect | Step-Level | Executor-Level |
| --- | --- | --- |
| Configured on | The workflow primitive (`Step`, `Loop`, etc.) | The tool, via `@tool(...)` |
| When it pauses | Before or after the step executes | During the step, when the agent calls the tool |
| `pause_kind` | `"step"` | `"executor"` |
| Pause event | `StepPausedEvent`, `RouterPausedEvent`, `StepOutputReviewEvent` | `StepExecutorPausedEvent` |
| Continue event | `StepContinuedEvent` | `StepExecutorContinuedEvent` |
| Use case | Gate the whole step | Gate a specific tool call |
| Resolved by | `req.confirm()`, `req.set_user_input(...)`, `req.select(...)` | Mutating the requirement dicts (see [Executor HITL](/workflows/hitl/executor)) |

## [​](#supported-primitives) Supported Primitives

| Primitive | Confirmation | User Input | Output Review | Iteration Review | Route Selection | Executor HITL |
| --- | --- | --- | --- | --- | --- | --- |
| [Step](/workflows/hitl/step) | ✓ | ✓ | [✓](/workflows/hitl/output-review) | - | - | [✓](/workflows/hitl/executor) (when `agent` / `team` is set) |
| [Steps](/workflows/hitl/steps) | ✓ | - | - | - | - | [✓](/workflows/hitl/executor#composite-steps) (via inner Step) |
| [Condition](/workflows/hitl/condition) | ✓ | - | - | - | - | [✓](/workflows/hitl/executor#composite-steps) (via inner Step) |
| [Loop](/workflows/hitl/loop) | ✓ | - | - | [✓](/workflows/hitl/loop#iteration-review) | - | [✓](/workflows/hitl/executor#composite-steps) (via inner Step) |
| [Router](/workflows/hitl/router) | ✓ | - | [✓](/workflows/hitl/router#output-review) | - | ✓ | [✓](/workflows/hitl/executor#composite-steps) (via selected branch) |

User input is currently supported on `Step` (to collect parameters) and `Router` (to select routes). `Steps` and `Condition` support confirmation only; `Loop` adds iteration review.

## [​](#requirements) Requirements

HITL workflows need a database to persist state between pauses.

```
from agno.db.sqlite import SqliteDb       # SQLite for development
from agno.db.postgres import PostgresDb   # PostgreSQL for production

workflow = Workflow(db=SqliteDb(db_file="workflow.db"))
workflow = Workflow(db=PostgresDb(db_url="postgresql+psycopg://user:password@localhost:5432/dbname"))
```

## [​](#run-output-properties) Run Output Properties

When a workflow pauses, inspect `WorkflowRunOutput`:

| Property | Description |
| --- | --- |
| `is_paused` | `True` if waiting for user action |
| `pause_kind` | `"step"` or `"executor"` |
| `paused_step_name` | Name of the step where the pause occurred |
| `step_requirements` | All requirements for the run (last entry is the active one) |
| `steps_requiring_confirmation` | Filter: steps needing confirm/reject |
| `steps_requiring_user_input` | Filter: steps needing user input values |
| `steps_requiring_output_review` | Filter: steps needing output review |
| `steps_requiring_route` | Filter: routers needing route selection |
| `steps_with_errors` | Steps that failed with `on_error="pause"` |

For nested HITL, always read the **last** entry in `step_requirements` to determine the current pause type. Earlier entries are history. See [Nested HITL](/workflows/hitl/nested).
For the full structure of every pause object (`WorkflowRunOutput`, `StepRequirement`, and executor requirements) and the methods that resolve each, see [Pause Anatomy](/workflows/hitl/pause-anatomy).

## [​](#onreject-behavior) OnReject Behavior

`on_reject` controls what happens when a user rejects a step.

| Value | Behavior |
| --- | --- |
| `OnReject.skip` | Skip the step and continue (default for most primitives) |
| `OnReject.cancel` | Cancel the entire workflow |
| `OnReject.retry` | Re-execute the step. Pair with `reject(feedback=...)` to send feedback. See [Output Review](/workflows/hitl/output-review#reject-with-retry) |
| `OnReject.else_branch` | For `Condition` only: execute `else_steps` (default for `Condition`) |

## [​](#timeout) Timeout

Step confirmation and output-review pauses can have a deadline. If the user does not respond in time, `on_timeout` decides what happens. Other primitives ignore the timeout fields.

```
from agno.workflow import OnTimeout
from agno.workflow.types import HumanReview

Step(
    name="approve_deploy",
    agent=deploy_agent,
    human_review=HumanReview(
        requires_confirmation=True,
        confirmation_message="Approve deployment?",
        timeout=300,                       # 5 minutes
        on_timeout=OnTimeout.approve,      # approve | skip | cancel
    ),
)
```

See [Timeout](/workflows/hitl/timeout) for the full set of behaviors.

## [​](#streaming) Streaming

HITL works with streaming. Watch for pause events; read the paused run from the session.

```
from agno.run.workflow import StepPausedEvent, StepExecutorPausedEvent

for event in workflow.run("input", stream=True):
    if isinstance(event, (StepPausedEvent, StepExecutorPausedEvent)):
        pass

session = workflow.get_session()
run_output = session.runs[-1]

if run_output.is_paused:
    # resolve requirements...
    for event in workflow.continue_run(run_output, stream=True):
        pass
```

The full `WorkflowRunOutput` (including `step_requirements`) is persisted to the database, not yielded as a stream event.

## [​](#the-@pause-decorator) The @pause Decorator

Mark custom function steps with HITL configuration.

```
from agno.workflow.decorators import pause
from agno.workflow.types import StepInput, StepOutput, UserInputField

@pause(
    requires_user_input=True,
    user_input_message="Enter parameters:",
    user_input_schema=[
        UserInputField(name="threshold", field_type="float", required=True),
    ],
)
def process_data(step_input: StepInput) -> StepOutput:
    threshold = step_input.additional_data["user_input"]["threshold"]
    return StepOutput(content=f"Processed with threshold {threshold}")

Step(name="process", executor=process_data)
```

## [​](#guides) Guides

## HumanReview Config

All HITL settings in a single config object

## Step HITL

Confirmation, user input, and output review on steps

## Executor HITL

Tool-level HITL inside agents and teams

## Nested HITL

Combine step-level and executor-level on the same step

## Pause Anatomy

The objects a paused run exposes and how to resolve them

## Output Review

Review, edit, or reject output after a step runs

## Router HITL

Route selection, confirmation, and output review

## Condition HITL

User-controlled branching decisions

## Loop HITL

Start confirmation and per-iteration review

## Steps HITL

Confirm before executing a pipeline

## Timeout

Auto-resolve HITL pauses after a deadline

## Error Handling

Retry or skip failed steps

## [​](#developer-resources) Developer Resources

- [HumanReview Config](/workflows/hitl/human-review)
- [Cookbooks](https://github.com/agno-agi/agno/tree/main/cookbook/04_workflows/08_human_in_the_loop)
- [Step reference](/reference/workflows/step)
- [Router reference](/reference/workflows/router-steps)
- [Condition reference](/reference/workflows/conditional-steps)
- [Loop reference](/reference/workflows/loop-steps)
- [Steps reference](/reference/workflows/steps-step)

⌘I
