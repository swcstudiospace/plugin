# Developer Essentials

Source: https://www.greptile.com/docs/code-review/developer-essentials

This guide covers what you need to know when working with Greptile in your day-to-day workflow.

## [​](#triggering-reviews) Triggering Reviews

Tag Greptile in a GitHub/GitLab comment to trigger a review:

```
@greptileai
```

You can also ask specific questions:

```
@greptileai check for memory leaks
@greptileai review the database queries
@greptileai is this thread-safe?
```

If `@greptileai` doesn’t trigger a review, check:

1. Repository is enabled in dashboard
2. PR isn’t in an excluded branch

### [​](#draft-prs) Draft PRs

By default, Greptile **skips draft PRs** to reduce noise.
To review a draft:

```
@greptileai review this draft
```

---

## [​](#example-prompts) Example Prompts

### [​](#code-improvements) Code improvements

```
@greptileai are there code improvements I can make?
```

![Follow-up question](https://mintcdn.com/greptile/pPDrEYn7_-Bi_2Mg/images/follow-up-question.png?fit=max&auto=format&n=pPDrEYn7_-Bi_2Mg&q=85&s=d202b42e4479f9fca7e3cd257c3ce77a)

### [​](#explain-code) Explain code

```
@greptileai can you explain the code in this file?
```

![Greptile explains code](https://mintcdn.com/greptile/pPDrEYn7_-Bi_2Mg/images/greptile-explain-code.png?fit=max&auto=format&n=pPDrEYn7_-Bi_2Mg&q=85&s=67b5ed0ec9b699107f15b372d6c88ebf)

### [​](#generate-tests) Generate tests

```
@greptileai can you create a test for this file?
```

![Greptile generates tests](https://mintcdn.com/greptile/pPDrEYn7_-Bi_2Mg/images/greptile-create-test-code.png?fit=max&auto=format&n=pPDrEYn7_-Bi_2Mg&q=85&s=0256c50563b0cc1dd9dcee76a826d298)

---

## [​](#training-greptile) Training Greptile

Your reactions shape future reviews:

| Action | What Greptile Learns |
| --- | --- |
| 👍 on a comment | ”Keep flagging issues like this” |
| 👎 on a comment | ”Stop mentioning this pattern” |
| Reply with context | ”This is our pattern because…” |

It takes 2-3 weeks of consistent reactions for Greptile to adapt to your team’s preferences.

### [​](#providing-context) Providing Context

When Greptile flags something intentional, explain why:

```
@greptileai This is intentional - we use sync calls here
because the webhook requires immediate response
```

When Greptile misses something:

```
@greptileai you missed a null check on line 45
```

Both help Greptile learn your patterns.

---

## [​](#troubleshooting) Troubleshooting

Review didn't appear

**Check:**

1. Repo enabled in dashboard
2. Not a draft PR
3. Branch not excluded by filters

**Fix:** Comment `@greptileai` to force a review

Too many/too few comments

**Too many?** Ask admin to increase severity threshold, or 👎 unwanted patterns consistently.**Too few?** Lower the severity threshold.

Reviews taking too long

- Small PR: ~1-2 minutes
- Medium PR: ~3 minutes
- Large PR: 3-5 minutes

---

## [​](#what’s-next) What’s Next

- [Training the learning system →](/docs/code-review/training-the-learning-system)
- [Auto-fix with MCP →](/docs/mcp-v2/overview)
- [Control nitpickiness →](/docs/code-review/controlling-nitpickiness)

⌘I
