# Early Stopping - Agno

Source: https://docs.agno.com/workflows/early-stop

Return `StepOutput(stop=True)` from a custom step to skip the remaining workflow steps.

```
from agno.workflow import Step, Workflow, StepInput, StepOutput

def security_scan(step_input: StepInput) -> StepOutput:
    source = str(step_input.input)
    result = "VULNERABLE" if "exec(" in source else "SECURE"
    return StepOutput(content=result)

def security_gate(step_input: StepInput) -> StepOutput:
    security_result = step_input.previous_step_content or ""

    if "VULNERABLE" in security_result.upper():
        return StepOutput(
            content="SECURITY ALERT: Critical vulnerabilities detected. Deployment blocked.",
            stop=True,
        )

    return StepOutput(content="Security check passed.")

def deploy_code(step_input: StepInput) -> StepOutput:
    return StepOutput(content="Code deployed")

def configure_monitoring(step_input: StepInput) -> StepOutput:
    return StepOutput(content="Monitoring configured")

workflow = Workflow(
    name="secure_deployment",
    steps=[
        Step(name="security_scan", executor=security_scan),
        Step(name="security_gate", executor=security_gate),
        Step(name="deploy_code", executor=deploy_code),
        Step(name="configure_monitoring", executor=configure_monitoring),
    ],
)

run_output = workflow.run("exec(input('Enter command: '))")
print(run_output.content)
# SECURITY ALERT: Critical vulnerabilities detected. Deployment blocked.
```

The workflow records the stopping step’s output and does not start later top-level steps. `Steps`, `Condition`, `Router`, and `Loop` propagate `stop=True` from nested steps. Other branches in a `Parallel` may already be running when one branch requests a stop.
![Workflows early stop diagram](https://mintcdn.com/agno-v2/JYIBgMrzFEujZh3_/images/workflows-early-stop-light.png?fit=max&auto=format&n=JYIBgMrzFEujZh3_&q=85&s=8d2d411a2853e475b18e4a195a9d65df)
![Workflows early stop diagram](https://mintcdn.com/agno-v2/JYIBgMrzFEujZh3_/images/workflows-early-stop.png?fit=max&auto=format&n=JYIBgMrzFEujZh3_&q=85&s=6c2609a237ba9a60fde24fb6ef3c25dc)

## [​](#developer-resources) Developer Resources

- [Early Stop Workflow](/workflows/usage/early-stop-workflow)

⌘I
