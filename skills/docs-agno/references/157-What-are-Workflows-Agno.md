# What are Workflows? - Agno

Source: https://docs.agno.com/workflows/overview

A Workflow orchestrates agents, teams, and functions through a defined control flow. Steps can run sequentially, in parallel, in loops, or conditionally based on results. Function steps can access all prior outputs through `StepInput`. Agent, team, and nested-workflow steps receive the most recent output as their input.
![Workflows flow diagram](https://mintcdn.com/agno-v2/JYIBgMrzFEujZh3_/images/workflows-flow-light.png?fit=max&auto=format&n=JYIBgMrzFEujZh3_&q=85&s=a308215dbae7c8e9050d03af47cfcf1b)
![Workflows flow diagram](https://mintcdn.com/agno-v2/JYIBgMrzFEujZh3_/images/workflows-flow.png?fit=max&auto=format&n=JYIBgMrzFEujZh3_&q=85&s=e9ef16c48420b7eee9312561ab56098e)

## [​](#your-first-workflow) Your First Workflow

This workflow takes a topic, collects relevant HackerNews stories, and writes an article:

```
from agno.agent import Agent
from agno.workflow import Workflow
from agno.tools.hackernews import HackerNewsTools

researcher = Agent(
    name="Researcher",
    instructions="Find relevant information about the topic",
    tools=[HackerNewsTools()]
)

writer = Agent(
    name="Writer",
    instructions="Write a clear, engaging article based on the research"
)

content_workflow = Workflow(
    name="Content Creation",
    steps=[researcher, writer]
)

content_workflow.print_response("Write an article about AI trends", stream=True)
```

The agents use Agno’s default OpenAI model. Install the dependencies and export your API key before running the example:

1

Install dependencies

```
uv pip install -U agno openai
```

2

Export your OpenAI API key

Mac/Linux

Windows

```
export OPENAI_API_KEY="your_openai_api_key_here"
```

```
$Env:OPENAI_API_KEY="your_openai_api_key_here"
```

## [​](#when-to-use-workflows) When to Use Workflows

| Requirement | Use |
| --- | --- |
| Fixed ordering, branches, loops, or parallel groups | Workflow |
| Dynamic delegation among model-driven members | [Team](/teams/overview) |

Workflow control flow is repeatable. Agent and team outputs can still vary between runs. Configure a database when you need persisted run records.

## [​](#step-executors) Step Executors

A `Step` wraps exactly one executor:

| Executor | Description |
| --- | --- |
| **Agent** | Individual AI executor with specific tools and instructions |
| **Team** | Coordinated group of agents for complex sub-tasks |
| **Function** | Custom Python function for specialized logic |
| **Workflow** | Nested workflow for composable, reusable sub-pipelines |

The workflow’s `steps` list also accepts `Steps`, `Parallel`, `Loop`, `Condition`, and `Router` containers. Agents, teams, functions, and nested workflows are auto-wrapped when passed directly.

## [​](#controlling-workflows) Controlling Workflows

Workflows support conditional logic, parallel execution, loops, and conversational interactions. See [Workflow patterns](/workflows/workflow-patterns/overview) and the guides below.

## [​](#guides) Guides

## Build Workflows

Define steps, inputs, and outputs.

## Run Workflows

Execute workflows and handle responses.

## Conversational Workflows

Enable chat interactions on your workflows.

## [​](#developer-resources) Developer Resources

- [Workflow patterns](/workflows/workflow-patterns/overview)
- [Workflow examples](/examples/workflows/overview)
- [Workflow reference](/reference/workflows/workflow)

⌘I
