# Workflow Patterns - Agno

Source: https://docs.agno.com/workflows/workflow-patterns/overview

Workflows orchestrate agents, teams, and functions through defined control-flow patterns. Each pattern covers a specific control flow, from sequential steps to branching, loops, and parallel execution, and patterns can be combined in the same workflow.

## [​](#building-blocks) Building Blocks

The core building blocks of Agno Workflows are:

| Component | Purpose |
| --- | --- |
| **Step** | Basic execution unit |
| **Agent** | AI assistant with specific role |
| **Team** | Coordinated group of agents |
| **Function** | Custom Python logic |
| **Steps** | Named sequential group |
| **Parallel** | Concurrent execution |
| **Condition** | Conditional execution |
| **Loop** | Iterative execution |
| **Router** | Dynamic routing |
| **Workflow** | Nested workflow |

## Sequential Workflows

Linear execution with step-by-step processing

## Parallel Workflows

Concurrent execution for independent tasks

## Conditional Workflows

Branching logic based on conditions

## Iterative Workflows

Repeat steps until an exit condition or iteration cap

## Branching Workflows

Dynamic routing and path selection

## Grouped Steps

Named sequences for use in larger control flows

## [​](#advanced-patterns) Advanced Patterns

## Step-Based Workflows

Name steps for event tracking and output lookup

## Custom Function Steps

Custom Python functions as workflow steps

## Fully Python Workflow

Replace the step list with one orchestration function

## Nested Workflows

Run one workflow as a step inside another

## Multi-Pattern Combinations

Complex workflows combining multiple patterns

⌘I
