# Iterative Workflow - Agno

Source: https://docs.agno.com/workflows/workflow-patterns/iterative-workflow

**Example use cases**: Quality improvement loops, retry mechanisms, iterative refinement
A `Loop` repeats its steps until the `end_condition` returns `True` or `max_iterations` (default 3) is reached. The end condition can be a Python function, a [CEL expression](/examples/workflows/cel-expressions/loop/cel-content-keyword) string, or omitted to always run the maximum number of iterations.
![Workflows loop steps diagram](https://mintcdn.com/agno-v2/JYIBgMrzFEujZh3_/images/workflows-loop-steps-light.png?fit=max&auto=format&n=JYIBgMrzFEujZh3_&q=85&s=edba198de555846a2ea8b2e5b65c6d8e)
![Workflows loop steps diagram](https://mintcdn.com/agno-v2/JYIBgMrzFEujZh3_/images/workflows-loop-steps.png?fit=max&auto=format&n=JYIBgMrzFEujZh3_&q=85&s=30027b401899598a38a73c6038d1d988)

## [​](#example) Example

iterative\_workflow.py

```
from agno.workflow import Loop, Step, StepInput, StepOutput, Workflow

def expand_research(step_input: StepInput) -> StepOutput:
    prior = step_input.previous_step_content or str(step_input.input)
    return StepOutput(content=f"{prior}\nAdditional verified research notes.")

def quality_check(outputs: list[StepOutput]) -> bool:
    return any(len(str(output.content or "")) > 120 for output in outputs)

def create_final_analysis(step_input: StepInput) -> StepOutput:
    research = step_input.previous_step_content or "No research returned"
    return StepOutput(content=f"Final analysis:\n{research}")

workflow = Workflow(
    name="Quality-Driven Research",
    steps=[
        Loop(
            name="Research Loop",
            steps=[Step(name="Deep Research", executor=expand_research)],
            end_condition=quality_check,
            max_iterations=3,
            forward_iteration_output=True,
        ),
        Step(name="Final Analysis", executor=create_final_analysis),
    ],
)

workflow.print_response("Research the impact of renewable energy on global markets", markdown=True)
```

## [​](#iteration-output-forwarding) Iteration Output Forwarding

By default, each iteration starts from the original loop `StepInput` (`forward_iteration_output=False`). With `forward_iteration_output=True`, the next iteration receives an updated `StepInput`: `input` remains the original workflow input, while `previous_step_content` and `previous_step_outputs` contain results from the preceding iteration.

## [​](#developer-resources) Developer Resources

- [Loop Steps Workflow](/workflows/usage/loop-steps-workflow)
- [Loop Iterative Accumulation](/workflows/usage/loop-iterative-accumulation)

## [​](#reference) Reference

For complete API documentation, see [Loop Steps Reference](/reference/workflows/loop-steps).

⌘I
