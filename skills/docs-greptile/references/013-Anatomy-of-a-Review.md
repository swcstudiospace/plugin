# Anatomy of a Review

Source: https://www.greptile.com/docs/code-review/first-pr-review

This page breaks down every component of a Greptile review so you know exactly what to expect and how to interpret the feedback.

**New to Greptile?** Start with the [Quickstart](/docs/quickstart) to set up your first review.

## [​](#the-review-process) The Review Process

When you open a PR, Greptile:

1. **Detects the PR** and starts analyzing (you’ll see 👀)
2. **Builds context** from your entire codebase, not just the diff
3. **Posts feedback** as a PR summary + inline comments (you’ll see 👍)

- Analyzing
- Complete

![Greptile analyzing](https://mintcdn.com/greptile/pPDrEYn7_-Bi_2Mg/images/greptile-eyes-emoji.png?fit=max&auto=format&n=pPDrEYn7_-Bi_2Mg&q=85&s=b5fae72be2828d1b2d7373abf22a19a5)

![Greptile complete](https://mintcdn.com/greptile/pPDrEYn7_-Bi_2Mg/images/greptile-thumbs-up-emoji.png?fit=max&auto=format&n=pPDrEYn7_-Bi_2Mg&q=85&s=039b0f7ca1913ce90d4196a0eeec5309)

| Status | Emoji | Typical Duration |
| --- | --- | --- |
| Analyzing | 👀 | ~3 minutes |
| Complete | 👍 | - |
| Failed | 😕 | Tag `@greptileai` to retry |

---

## [​](#pr-summary) PR Summary

The PR summary is a top-level comment that gives you the big picture.

### [​](#components) Components

#### [​](#summary) Summary

Plain-language explanation of what the PR does, who it affects, and why. Includes major improvements and any issues found.

![PR Summary](https://mintcdn.com/greptile/pPDrEYn7_-Bi_2Mg/images/greptile-summary-issues.png?fit=max&auto=format&n=pPDrEYn7_-Bi_2Mg&q=85&s=51f18e12a169e35e21dd9183338e0d13)

#### [​](#confidence-score) Confidence Score

A 0-5 rating that tells you at a glance whether the PR is ready to merge. Greptile calculates this based on the severity and quantity of issues found, the complexity of changes, and how well the code aligns with your codebase patterns.

| Score | Meaning | Action |
| --- | --- | --- |
| **5/5** | Production ready | Merge |
| **4/5** | Minor polish needed | Merge after small fixes |
| **3/5** | Implementation issues | Address feedback first |
| **2/5** | Significant bugs | Needs rework |
| **0-1/5** | Critical problems | Major rethink needed |

Scores are contextual. A 3/5 on a payments feature is more serious than a 3/5 on an internal script.

#### [​](#files-changed-&-issues) Files Changed & Issues

File-by-file breakdown showing what changed and issues found per file.

![Files Changed](https://mintcdn.com/greptile/pPDrEYn7_-Bi_2Mg/images/greptile-files-changed.png?fit=max&auto=format&n=pPDrEYn7_-Bi_2Mg&q=85&s=a67852e044bc5636ad140797c7d33f27)

#### [​](#diagrams) Diagrams

Greptile automatically generates a diagram to visualize the changes in your PR. The diagram type is selected based on what changed:

| Type | When Generated |
| --- | --- |
| **Sequence** | Multi-service interactions, API flows |
| **Entity Relation** | Schema or data model changes |
| **Class** | Class hierarchy changes |
| **Flow** | Control flow or business logic changes |

For minimal or trivial changes, no diagram is generated.
**Example** (sequence diagram for an API flow):

You can request a specific diagram type by replying to the review or tagging `@greptileai` — for example, “generate a class diagram for this PR”.

Configure which components appear in your [dashboard](https://app.greptile.com):

![PR summary settings](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/pr-summary-settings.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=e7b0e1d6b6896cdda84cc43c51dcd3be)

The footer of the PR summary shows review metadata and actions:

![Review footer with counter, commit link, and re-trigger button](https://mintcdn.com/greptile/kTEOEt_jfh6iINFC/images/review-footer.png?fit=max&auto=format&n=kTEOEt_jfh6iINFC&q=85&s=6fc528467dd782b42ffe284e2261069c)

| Element | Description |
| --- | --- |
| **Review counter** | Shows how many times Greptile has reviewed this PR (e.g. “Reviews (2)“) |
| **Last reviewed commit** | Links to the most recent commit that was reviewed, with a longer commit message preview |
| **Re-trigger Greptile** | Click to manually re-run a review on the current PR state |

---

## [​](#inline-comments) Inline Comments

Greptile posts comments directly on specific lines where it finds issues.

![Inline Comment](https://mintcdn.com/greptile/sJeefWhR1h6iqsSa/images/issue-fixes.png?fit=max&auto=format&n=sJeefWhR1h6iqsSa&q=85&s=0a0084ab113ad1bb8c39c767c548b44e)

### [​](#severity-badges) Severity Badges

Each inline comment includes a severity badge indicating its priority:

![Inline comment with P2 severity badge](https://mintcdn.com/greptile/kTEOEt_jfh6iINFC/images/severity-badges.png?fit=max&auto=format&n=kTEOEt_jfh6iINFC&q=85&s=495e1b5bfa239d8e1b61b3115e63d008)

| Badge | Severity | Description |
| --- | --- | --- |
| **P0** | Critical | Must fix before merging — security vulnerabilities, data loss, crashes |
| **P1** | High | Should fix — bugs, incorrect behavior, edge cases |
| **P2** | Medium | Consider fixing — code quality, maintainability, best practices |

### [​](#comment-types) Comment Types

Comment types are controlled with the `commentTypes` field in `.greptile/config.json`.

| Type | What it catches | Examples |
| --- | --- | --- |
| **Logic** | Bugs, incorrect behavior, edge cases | Null pointer, race condition, wrong return value |
| **Syntax** | Code that won’t compile/run | Missing import, typo, invalid syntax |
| **Style** | Code quality, best practices | Naming conventions, dead code, complexity |

.greptile/config.json

```
{
  "commentTypes": ["logic", "syntax"]
}
```

All types are enabled by default. To focus reviews, list only the types you want Greptile to leave. See [Controlling Nitpickiness](/docs/code-review/controlling-nitpickiness#comment-type-filtering) for examples.

### [​](#suggested-fixes) Suggested Fixes

Most comments include a code suggestion you can apply:

```
- const data = fetchData()
+ const data = await fetchData()
```

With [MCP](/docs/mcp-v2/overview), apply fixes directly from your IDE without copy-pasting.

---

## [​](#troubleshooting) Troubleshooting

Review didn't appear

**Check:**

- Repository enabled in dashboard
- Not a draft PR (skipped by default)
- Branch not excluded by filters

**Fix:** Comment `@greptileai` to trigger manually

---

## [​](#what’s-next) What’s Next

Now that you understand what a review looks like, learn how to interact with Greptile:

## Developer Essentials

Reactions, follow-ups, training, and daily workflows

## Control Nitpickiness

Control what Greptile flags

## Auto-fix in IDE

Apply fixes without leaving your editor

## Custom Standards

Enforce your team’s rules

⌘I
