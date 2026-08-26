# Custom Context

Source: https://www.greptile.com/docs/mcp-v2/custom-context

Custom context refers to your team’s coding standards that Greptile checks during reviews. Rules like “use async/await instead of promises” or “API endpoints must validate input.” When code doesn’t follow a pattern, Greptile comments on the PR.
With MCP, you can view, search, and create patterns from your IDE.

## [​](#view-your-patterns) View Your Patterns

```
What coding patterns does my organization have?
```

**Tool used:** [`list_custom_context`](/docs/mcp-v2/tools#list_custom_context)

![List org coding standards with mcp](https://mintcdn.com/greptile/sJeefWhR1h6iqsSa/images/org-coding-rules-mcp.png?fit=max&auto=format&n=sJeefWhR1h6iqsSa&q=85&s=18173489ee170b96a995e6fcda97cdc6)

---

## [​](#search-patterns) Search Patterns

```
Search our coding patterns for error handling
```

**Tool used:** [`search_custom_context`](/docs/mcp-v2/tools#search_custom_context)

---

## [​](#get-pattern-details) Get Pattern Details

```
Show details for pattern 9c29e7ed-2d3f-45bd-846d-a61a59f10dd9
```

**Tool used:** [`get_custom_context`](/docs/mcp-v2/tools#get_custom_context)
Returns the full pattern including `linkedComments`—PRs where this pattern triggered feedback.

---

## [​](#create-a-pattern) Create a Pattern

```
Create a coding pattern: "All React components must have TypeScript interfaces for props"
Apply it to .tsx files only.
```

**Tool used:** [`create_custom_context`](/docs/mcp-v2/tools#create_custom_context)

![Create custom context using the MCP](https://mintcdn.com/greptile/UPpVJVb6MO4m3Pv2/images/create-rule-mcp.png?fit=max&auto=format&n=UPpVJVb6MO4m3Pv2&q=85&s=4132f7f7dd03021d7f410d618cd8a781)

### [​](#scope-examples) Scope Examples

| You Say | Pattern Applies To |
| --- | --- |
| ”Apply everywhere” | All files in all repos |
| ”Apply to TypeScript files” | `**/*.ts` |
| ”Apply to the api folder” | `**/api/**` |
| ”Apply to owner/repo only” | That specific repository |

---

## [​](#disable-a-pattern) Disable a Pattern

There’s no delete. Set status to inactive:

```
Disable the pattern about console.log statements
```

---

## [​](#workflow-turn-recurring-feedback-into-a-pattern) Workflow: Turn Recurring Feedback Into a Pattern

When you notice Greptile making the same comment repeatedly:

1

Identify the pattern

```
Search Greptile comments for "error handling"
```

Find comments that keep appearing across PRs.

2

Create the custom context

```
Create a pattern: "All catch blocks must log the error before re-throwing"
Apply to all TypeScript files.
```

3

Verify it's active

```
List my custom contexts and confirm the new pattern is ACTIVE
```

---

## [​](#field-reference) Field Reference

| Field | Description |
| --- | --- |
| `body` | The rule text |
| `type` | `CUSTOM_INSTRUCTION` (explicit rule) or `PATTERN` (code pattern) |
| `status` | `ACTIVE`, `INACTIVE`, or `SUGGESTED` |
| `scopes` | Where it applies (see [tools reference](/docs/mcp-v2/tools#create_custom_context) for format) |
| `commentsCount` | Times this pattern triggered a comment |
| `linkedComments` | PRs where this pattern was applied |

---

## [​](#next-steps) Next Steps

## Auto-Fix Workflow

Fix comments triggered by your patterns

## Tools Reference

Full parameter documentation

⌘I
