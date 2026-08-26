# Auto-Fix Workflow

Source: https://www.greptile.com/docs/mcp-v2/auto-fix

Use Greptile MCP tools to fetch unaddressed comments and apply fixes directly from your IDE.

**Prerequisite:** [Configure MCP in your IDE](/docs/mcp-v2/setup) before following these workflows.

**Using Claude Code?** [Agent skills](/docs/mcp-v2/skills) automate the entire auto-fix loop for you. Run `/check-pr` to fix all review comments on a PR, or `/greploop` to iterate until Greptile gives a 5/5 confidence score.

## [​](#your-first-auto-fix) Your First Auto-Fix

1

Fetch unaddressed comments

Ask your AI assistant:

```
List unaddressed Greptile comments for PR #5 in owner/repo
```

The assistant calls `list_merge_request_comments` with `addressed: false`.

![Unaddressed PR comments](https://mintcdn.com/greptile/sJeefWhR1h6iqsSa/images/unaddressed-pr-comments.png?fit=max&auto=format&n=sJeefWhR1h6iqsSa&q=85&s=114391f9a32f37cd78fd2caf0728af39)

2

Review the response

You’ll see comments with their details including file path, issue type, and whether a fix is available.

3

Apply fixes

For comments with `hasSuggestion: true`:

```
Apply the suggested fix for the API token issue
```

The assistant applies the `suggestedCode` to your file.

![Code changes for review](https://mintcdn.com/greptile/pPDrEYn7_-Bi_2Mg/images/cursor-code-changes.png?fit=max&auto=format&n=pPDrEYn7_-Bi_2Mg&q=85&s=981de2dc2c1697c6f881907875d6d94e)

4

Accept changes

Review the changes, then click **Keep All** to apply them to your codebase.

5

Commit changes

After applying fixes, commit your changes. Greptile automatically marks comments as addressed when the file is modified.

---

## [​](#understanding-comment-fields) Understanding Comment Fields

When you fetch comments, each one includes these key fields:

| Field | Type | Description |
| --- | --- | --- |
| `isGreptileComment` | boolean | `true` if from Greptile |
| `addressed` | boolean | `true` if resolved by subsequent commit |
| `hasSuggestion` | boolean | `true` if includes a code fix |
| `suggestedCode` | string | The actual fix (when `hasSuggestion` is true) |
| `filePath` | string | File location (null for PR-level comments) |
| `lineStart` / `lineEnd` | number | Line range (null for general comments) |
| `linkedMemory` | object | Custom context that triggered this comment |

### [​](#how-comments-get-“addressed”) How Comments Get “Addressed”

A comment becomes addressed when there’s a **commit after the comment** that modifies the relevant file:

```
1. Greptile comments on src/auth.ts
2. Developer pushes commit touching src/auth.ts
3. Comment marked as addressed: true
```

Check progress via `reviewAnalysis.reviewCompleteness` (e.g., “2/5 Greptile comments addressed”).

---

## [​](#common-prompts) Common Prompts

Get all comments with fixes

```
List all Greptile comments on PR #5 that have suggested code fixes
```

The assistant filters for `hasSuggestion: true`.

Fix style issues only

```
Find Greptile comments about style or formatting and apply the fixes
```

Searches comment bodies for style-related keywords.

Check if PR is ready to merge

```
What's the review status for PR #5? Are there any unaddressed critical issues?
```

Uses `get_merge_request` and checks `reviewAnalysis.reviewCompleteness`.

Get comments for specific file

```
Show Greptile comments for src/auth/login.ts
```

Filters results by `filePath`.

See what custom context triggered a comment

```
Why did Greptile flag this issue? Show the linked coding pattern.
```

Checks the `linkedMemory` field for the associated custom context.

---

## [​](#next-steps) Next Steps

## Agent Skills

Automate the full auto-fix loop with `/check-pr` and `/greploop`

## Custom Context

Learn how `linkedMemory` connects comments to your patterns

## Tools Reference

Complete field documentation for all responses

⌘I
