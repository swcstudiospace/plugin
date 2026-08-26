# Reports & Analytics

Source: https://www.greptile.com/docs/mcp-v2/reports

Use MCP tools to generate reports on review activity and track team progress.

## [​](#pr-status) PR Status

Get a quick status check for any PR:

```
What's the review status for PR #5 in owner/repo?
```

![Individual PR stats](https://mintcdn.com/greptile/sJeefWhR1h6iqsSa/images/individual-pr-stats-mcp.png?fit=max&auto=format&n=sJeefWhR1h6iqsSa&q=85&s=e89663c29becbde8fb048a0154af6abe)

**Tool:** [`get_merge_request`](/docs/mcp-v2/tools#get_merge_request)
Response includes:

- `reviewCompleteness`: “2/5 Greptile comments addressed”
- `hasNewCommitsSinceReview`: Whether re-review needed
- `addressedComments` / `unaddressedComments`: Full lists

---

## [​](#weekly-summary) Weekly Summary

Generate a report of open PR status:

```
Give me a weekly summary of all open PRs with their review status and make a nice visual graph for important stats.
```

![PR report visualization](https://mintcdn.com/greptile/sJeefWhR1h6iqsSa/images/pr-report-mcp.png?fit=max&auto=format&n=sJeefWhR1h6iqsSa&q=85&s=06200c301ea59e4e7a0388a14f9207c0)

The assistant:

1. Calls `list_pull_requests` with `state: "open"`
2. For each PR, calls `get_merge_request` to get `reviewAnalysis`
3. Compiles: PR number, title, author, age, completeness, unaddressed count

Claude took the MCP data and whipped up a basic webpage to visualize it.

---

## [​](#team-metrics) Team Metrics

Comments by repository

```
How many unaddressed Greptile comments do we have per repository?
```

**Tool:** [`list_pull_requests`](/docs/mcp-v2/tools#list_pull_requests) + [`list_merge_request_comments`](/docs/mcp-v2/tools#list_merge_request_comments) for each

Review completion rate

```
What percentage of Greptile comments have been addressed across all open PRs?
```

**Tool:** [`get_merge_request`](/docs/mcp-v2/tools#get_merge_request) → aggregates `reviewAnalysis` across PRs

Stale PRs

```
Which open PRs are older than 7 days and still have unaddressed comments?
```

**Tool:** [`list_pull_requests`](/docs/mcp-v2/tools#list_pull_requests) → filters by `createdAt`

Issues with fixes available

```
How many unaddressed comments have suggested code fixes?
```

**Tool:** [`search_greptile_comments`](/docs/mcp-v2/tools#search_greptile_comments) → checks `summary.withSuggestions`

Issues by file

```
Which files have the most unaddressed Greptile comments?
```

**Tool:** [`search_greptile_comments`](/docs/mcp-v2/tools#search_greptile_comments) → groups by `filePath`

---

## [​](#code-review-history) Code Review History

Recent reviews

```
Show me the last 10 completed code reviews
```

**Tool:** [`list_code_reviews`](/docs/mcp-v2/tools#list_code_reviews) with `status: "COMPLETED"` and `limit: 10`

Review details

```
Get details for code review 1382118
```

**Tool:** [`get_code_review`](/docs/mcp-v2/tools#get_code_review)Returns `strictness`, `totalFiles`, `completedFiles`, full PR info.

Failed reviews

```
Are there any failed or skipped code reviews?
```

**Tool:** [`list_code_reviews`](/docs/mcp-v2/tools#list_code_reviews) with `status: "FAILED"` or `"SKIPPED"`

---

## [​](#next-steps) Next Steps

## Auto-Fix Workflow

Fix issues identified in your reports

## Custom Context

Track which patterns trigger the most comments

⌘I
