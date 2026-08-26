# Parallel Workflow - Agno

Source: https://docs.agno.com/workflows/workflow-patterns/parallel-workflow

**Example use cases**: Multi-source research, parallel analysis, concurrent data processing
Steps inside a `Parallel` block run concurrently. Their outputs are aggregated in the configured step order and passed to the next step in the workflow.
![Workflows parallel steps diagram](https://mintcdn.com/agno-v2/JYIBgMrzFEujZh3_/images/workflows-parallel-steps-light.png?fit=max&auto=format&n=JYIBgMrzFEujZh3_&q=85&s=afda5268ab0637c6064ace8edd6f35e5)
![Workflows parallel steps diagram](https://mintcdn.com/agno-v2/JYIBgMrzFEujZh3_/images/workflows-parallel-steps.png?fit=max&auto=format&n=JYIBgMrzFEujZh3_&q=85&s=ec4f6c7c9a6ef76cec8f0866eb1acc5b)

## [​](#example) Example

parallel\_workflow.py

```
from agno.workflow import Parallel, Step, StepInput, StepOutput, Workflow

def research_hackernews(step_input: StepInput) -> StepOutput:
    return StepOutput(content=f"HackerNews notes for {step_input.input}")

def research_web(step_input: StepInput) -> StepOutput:
    return StepOutput(content=f"Web notes for {step_input.input}")

def research_papers(step_input: StepInput) -> StepOutput:
    return StepOutput(content=f"Paper notes for {step_input.input}")

def synthesize(step_input: StepInput) -> StepOutput:
    combined = step_input.previous_step_content or "No research returned"
    return StepOutput(content=f"Synthesis:\n{combined}")

workflow = Workflow(
    name="Parallel Research Pipeline",
    steps=[
        Parallel(
            Step(name="HackerNews Research", executor=research_hackernews),
            Step(name="Web Research", executor=research_web),
            Step(name="Academic Research", executor=research_papers),
            name="Research Step",
        ),
        Step(name="Synthesis", executor=synthesize),
    ],
)

workflow.print_response("Write about the latest AI developments", markdown=True)
```

## [​](#handling-session-state-data-in-parallel-steps) Handling Session State Data in Parallel Steps

Custom Python functions can accept a `run_context` parameter and update `run_context.session_state`.
Parallel branches share that session-state dictionary. Coordinate writes to the same keys, or assign separate keys to each branch, to avoid races.

## [​](#developer-resources) Developer Resources

- [Parallel Steps Workflow](/workflows/usage/parallel-steps-workflow)
- [Session State in a Function](/examples/workflows/advanced-concepts/session-state/state-in-function)

## [​](#reference) Reference

For complete API documentation, see [Parallel Steps Reference](/reference/workflows/parallel-steps).

⌘I
