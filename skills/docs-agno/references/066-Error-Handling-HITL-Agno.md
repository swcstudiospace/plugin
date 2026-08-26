# Error Handling HITL - Agno

Source: https://docs.agno.com/workflows/hitl/error-handling

`Step` and `Condition` can pause when execution fails, letting users decide to retry or skip the failed component.

## [​](#error-pause-mode) Error Pause Mode

Set `on_error=OnError.pause` to pause when a step fails:

```
import random

from agno.db.sqlite import SqliteDb
from agno.workflow import Workflow, OnError
from agno.workflow.step import Step
from agno.workflow.types import StepInput, StepOutput

def unreliable_api_call(step_input: StepInput) -> StepOutput:
    if random.random() < 0.7:  # 70% failure rate
        raise Exception("API call failed: Connection timeout")
    return StepOutput(content="API call succeeded")

def process_data(step_input: StepInput) -> StepOutput:
    return StepOutput(content=f"Processed: {step_input.previous_step_content}")

workflow = Workflow(
    name="api_workflow",
    db=SqliteDb(db_file="workflow.db"),
    steps=[
        Step(
            name="fetch_data",
            executor=unreliable_api_call,
            max_retries=0,
            on_error=OnError.pause,
        ),
        Step(name="process", executor=process_data),
    ],
)

run_output = workflow.run("Fetch and process")

while run_output.is_paused:
    for req in run_output.steps_with_errors:
        print(f"Step '{req.step_name}' failed")
        print(f"Error: {req.error_message}")

        choice = input("Retry or skip? (r/s): ").lower()
        if choice == "r":
            req.retry()
        else:
            req.skip()

    run_output = workflow.continue_run(run_output)

print(run_output.content)
```

`Step` retries executor failures up to `max_retries` times before applying `on_error`. The default, `max_retries=3`, allows four total execution attempts. Set `max_retries=0` to apply the error policy after the first failed attempt.

## [​](#onerror-options) OnError Options

| Value | Behavior |
| --- | --- |
| `OnError.fail` | Re-raise the error after automatic retries |
| `OnError.skip` | Skip the component after automatic retries and continue (default) |
| `OnError.pause` | Pause after automatic retries for a retry-or-skip decision |

## [​](#errorrequirement-properties) ErrorRequirement Properties

When a `Step` or `Condition` fails with `on_error=OnError.pause`, an `ErrorRequirement` is created:

| Property | Type | Description |
| --- | --- | --- |
| `step_name` | `str` | Name of the failed step |
| `error_message` | `str` | The exception message |
| `error_type` | `str` | Exception class name (e.g., “ValueError”) |
| `retry_count` | `int` | Currently always `0`. Track attempts in your resolution loop |

## [​](#errorrequirement-methods) ErrorRequirement Methods

| Method | Description |
| --- | --- |
| `req.retry()` | Retry the failed step |
| `req.skip()` | Skip the failed component and continue |

## [​](#retry-behavior) Retry Behavior

When you call `req.retry()`:

1. The component executes again with the same input, including its configured automatic retries.
2. If it still fails, the workflow pauses again.
3. You can retry again or skip.

Track attempts in your resolution loop to cap retries:

```
attempts = 0
while run_output.is_paused:
    for req in run_output.steps_with_errors:
        if attempts < 3:
            attempts += 1
            print(f"Retrying (attempt {attempts}/3)")
            req.retry()
        else:
            print("Max retries reached, skipping")
            req.skip()

    run_output = workflow.continue_run(run_output)
```

## [​](#skip-behavior) Skip Behavior

When you call `req.skip()`:

1. The failed component is not re-executed.
2. The workflow continues with the next top-level step.
3. The next step’s `step_input.previous_step_content` comes from the last successful top-level step, or is `None` if there is none.

## [​](#combining-with-confirmation) Combining with Confirmation

A step can have both error handling and confirmation:

```
Step(
    name="risky_operation",
    executor=risky_function,
    requires_confirmation=True,
    confirmation_message="Execute risky operation?",
    on_error=OnError.pause,
)
```

The confirmation happens first. If confirmed and the step fails, the error pause activates.

## [​](#condition-errors) Condition Errors

Set `on_error` on a `Condition` to control failures raised by its selected branch. `OnError.pause` creates an `ErrorRequirement` for the Condition after the failing inner Step exhausts its own `max_retries`.

```
from agno.workflow.condition import Condition

Condition(
    name="validate_if_needed",
    evaluator=should_validate,
    steps=[Step(name="validate", executor=validate_data, max_retries=0)],
    on_error=OnError.pause,
)
```

## [​](#streaming) Streaming

Handle error HITL in streaming workflows:

```
from agno.run.workflow import StepErrorEvent

for event in workflow.run("input", stream=True, stream_events=True):
    if isinstance(event, StepErrorEvent):
        print(f"Failed at: {event.step_name} ({event.error})")

session = workflow.get_session()
run_output = session.runs[-1]

while run_output.is_paused:
    for req in run_output.steps_with_errors:
        print(f"Error: {req.error_message}")
        req.retry()  # or req.skip()

    for event in workflow.continue_run(run_output, stream=True, stream_events=True):
        pass

    session = workflow.get_session()
    run_output = session.runs[-1]
```

## [​](#error-types) Error Types

Common error scenarios and handling:

| Scenario | Recommended Action |
| --- | --- |
| Network timeout | Retry a few times, then skip |
| Rate limit | Retry after delay |
| Invalid input | Skip (retry won’t help) |
| Resource unavailable | Retry or skip based on criticality |

```
for req in run_output.steps_with_errors:
    if "timeout" in req.error_message.lower():
        if timeout_attempts < 3:  # counter tracked in your resolution loop
            timeout_attempts += 1
            req.retry()
        else:
            req.skip()
    elif "rate limit" in req.error_message.lower():
        import time
        time.sleep(5)  # Wait before retry
        req.retry()
    else:
        req.skip()  # Unknown error, skip
```

## [​](#developer-resources) Developer Resources

- [Workflow HITL overview](/workflows/hitl/overview)
- [Step reference](/reference/workflows/step)

⌘I
