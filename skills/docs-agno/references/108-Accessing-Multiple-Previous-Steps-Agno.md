# Accessing Multiple Previous Steps - Agno

Source: https://docs.agno.com/workflows/access-previous-steps

`StepInput` can retrieve any previous step output by name, including outputs nested in workflow primitives.

```
from agno.workflow import Step, Workflow
from agno.workflow.types import StepInput, StepOutput

def research_hackernews(step_input: StepInput) -> StepOutput:
    return StepOutput(content=f"HackerNews findings for {step_input.input}")

def research_web(step_input: StepInput) -> StepOutput:
    return StepOutput(content=f"Web findings for {step_input.input}")

def create_comprehensive_report(step_input: StepInput) -> StepOutput:
    original_topic = step_input.input or ""
    hackernews_data = step_input.get_step_content("research_hackernews") or ""
    web_data = step_input.get_step_content("research_web") or ""
    all_research = step_input.get_all_previous_content()

    return StepOutput(
        content=(
            f"Report: {original_topic}\n"
            f"HackerNews: {hackernews_data}\n"
            f"Web: {web_data}\n\n"
            f"All previous content:\n{all_research}"
        )
    )

workflow = Workflow(
    name="research_workflow",
    steps=[
        Step(name="research_hackernews", executor=research_hackernews),
        Step(name="research_web", executor=research_web),
        Step(name="comprehensive_report", executor=create_comprehensive_report),
    ],
)

workflow.print_response("agent infrastructure")
```

## [​](#available-methods) Available Methods

| Method or Field | Returns |
| --- | --- |
| `get_step_content("step_name")` | Content from a named previous step |
| `get_step_output("step_name")` | Full `StepOutput` from a named previous step |
| `get_all_previous_content()` | Top-level previous outputs joined into one string |
| `input` | Original workflow input |
| `previous_step_content` | Content from the immediate previous step |

## [​](#accessing-nested-steps) Accessing Nested Steps

You can directly access steps nested inside `Parallel`, `Condition`, `Router`, `Loop`, and `Steps` groups using their step name. The lookup performs a recursive search to find nested steps at any depth.

### [​](#direct-access-to-steps-in-parallel-groups) Direct Access to Steps in Parallel Groups

```
from agno.workflow.parallel import Parallel

def run_step_a(step_input: StepInput) -> StepOutput:
    return StepOutput(content="output from step_a")

def run_step_b(step_input: StepInput) -> StepOutput:
    return StepOutput(content="output from step_b")

def run_step_c(step_input: StepInput) -> StepOutput:
    return StepOutput(content="output from step_c")

def aggregator(step_input: StepInput) -> StepOutput:
    parallel_data = step_input.get_step_content("parallel_processing")
    step_a_output = step_input.get_step_output("step_a")
    step_a_content = step_input.get_step_content("step_a")

    return StepOutput(
        content=f"Parallel: {parallel_data}\nStep A: {step_a_content}\nFound: {step_a_output is not None}"
    )

workflow = Workflow(
    name="parallel_access",
    steps=[
        Parallel(
            Step(name="step_a", executor=run_step_a),
            Step(name="step_b", executor=run_step_b),
            Step(name="step_c", executor=run_step_c),
            name="parallel_processing",
        ),
        Step(name="aggregator", executor=aggregator),
    ],
)
```

### [​](#deeply-nested-steps) Deeply Nested Steps

The recursive search works at any depth level:

```
from agno.workflow.condition import Condition
from agno.workflow.parallel import Parallel
from agno.workflow.steps import Steps

def deep_nested_step(step_input: StepInput) -> StepOutput:
    return StepOutput(content="Deep nested content")

def verify_nested_access(step_input: StepInput) -> StepOutput:
    nested_output = step_input.get_step_output("deep_nested_step")
    nested_content = step_input.get_step_content("deep_nested_step")

    return StepOutput(
        content=f"Nested output found: {nested_output is not None}. Content: {nested_content}"
    )

def condition_evaluator(step_input: StepInput) -> bool:
    return True

workflow = Workflow(
    name="multiple_depth_access",
    steps=[
        Parallel(
            Condition(
                name="condition_layer",
                evaluator=condition_evaluator,
                steps=[
                    Steps(
                        name="steps_layer",
                        steps=[deep_nested_step],
                    )
                ],
            ),
            name="parallel_processing",
        ),
        Step(name="verifier", executor=verify_nested_access),
    ],
)
```

A top-level output takes priority when the same step name also exists in a nested group.

## [​](#parallel-group-output-format) Parallel Group Output Format

When accessing a `Parallel` group by its name, the output is a dictionary with each nested step’s name as the key:

```
parallel_output = step_input.get_step_content("parallel_processing")
# Returns:
# {
#     "step_a": "output from step_a",
#     "step_b": "output from step_b",
#     "step_c": "output from step_c",
# }
```

## [​](#developer-resources) Developer Resources

- [Access Multiple Previous Steps Output](/workflows/usage/access-multiple-previous-steps-output)

⌘I
