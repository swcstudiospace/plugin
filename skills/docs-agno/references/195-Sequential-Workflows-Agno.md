# Sequential Workflows - Agno

Source: https://docs.agno.com/workflows/workflow-patterns/sequential

**Example Flow**: Research → Data Processing → Content Creation → Final Review
Sequential workflows provide a fixed execution order. A custom function reads the preceding result from `StepInput.previous_step_content` or a named result from `previous_step_outputs`.

sequential\_workflow.py

```
from agno.workflow import StepInput, StepOutput, Workflow

def collect_research(step_input: StepInput) -> StepOutput:
    topic = str(step_input.input)
    return StepOutput(content=f"Research notes for {topic}")

def process_research(step_input: StepInput) -> StepOutput:
    research = step_input.previous_step_content or "No research available"
    return StepOutput(content=f"Processed data:\n{research}")

def create_review(step_input: StepInput) -> StepOutput:
    processed = step_input.previous_step_content or "No processed data available"
    return StepOutput(content=f"Final review:\n{processed}")

workflow = Workflow(
    name="Sequential Analysis Pipeline",
    steps=[
        collect_research,
        process_research,
        create_review,
    ],
)

workflow.print_response("Analyze the competitive landscape for fintech startups", markdown=True)
```

See [Custom Functions in Workflows](/workflows/workflow-patterns/custom-function-step-workflow)
for function and class executors.

## [​](#developer-resources) Developer Resources

- [Sequential Workflow](/workflows/usage/sequence-of-steps)

`StepInput` and `StepOutput` provide standard interfaces for data flow between function steps.See [`StepInput`](/reference/workflows/step_input) and [`StepOutput`](/reference/workflows/step_output).

⌘I
