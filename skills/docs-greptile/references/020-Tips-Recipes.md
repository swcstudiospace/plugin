# Tips & Recipes

Source: https://www.greptile.com/docs/code-review/tips-recipes

Practical recipes from teams using Greptile daily. Each tip links to full documentation if you need more detail.

## [​](#local-review-before-opening-a-pr) Local review before opening a PR

Several teams asked us:
> “Is it possible to have Greptile review a PR locally before opening it for manual review?”

**Current workaround:** Create a draft PR to get Greptile’s feedback, then convert to a real PR when ready.

```
@greptileai review this draft before I make it official
```

Full local review without creating a PR is on our roadmap. The draft PR workaround works well in the meantime.

---

## [​](#rfc-and-documentation-review) RFC and documentation review

One team asked us:
> “I’d like to automate generating technical RFC document feedback from Greptile. The documents live in our codebase.”

**The workflow:**

1. Create a PR containing only the RFC/design doc
2. Tag Greptile for targeted feedback

```
@greptileai review this RFC for completeness
@greptileai does this architecture match our existing patterns?
@greptileai what edge cases am I missing in this design?
```

They specifically wanted this in GitHub PRs (not issues) for better visibility - “We can see how designs evolved over time.”

---

## [​](#multi-language-reviews) Multi-language reviews

Teams use Greptile in their native language by configuring language preferences.

- Dashboard
- greptile.json

Add to Custom Instructions:

```
Always respond in Japanese
```

```
{
  "instructions": "必ず日本語で回答してください。"
}
```

**Inline override:**

```
@greptileai このコードの問題を日本語で説明してください
```

Set language in **both** dashboard and greptile.json for consistent results across all reviews.

---

## [​](#security-focused-reviews) Security-focused reviews

Several teams use Greptile with stricter settings for critical paths like payment infrastructure and authentication flows.
**For ad-hoc security checks:**

```
@greptileai check this PR for security vulnerabilities
@greptileai review authentication flow for common attack vectors
@greptileai are there any SQL injection risks here?
```

**For automatic stricter reviews**, configure global strictness in your `greptile.json`:

```
{
  "strictness": 1,
  "commentTypes": ["logic", "syntax"]
}
```

→ [Full strictness guide](/docs/code-review/controlling-nitpickiness)

---

## [​](#targeted-partial-reviews) Targeted partial reviews

For large PRs that hit file limits, or when you only need feedback on specific areas:

```
@greptileai review only the API changes
@greptileai focus on the database queries
@greptileai check the error handling in src/services/
```

---

## [​](#draft-pr-workflow) Draft PR workflow

One developer mentioned:
> “I often use draft PRs to put up half-finished work. It’s annoying to have it jump in and point out stuff I know is wrong.”

| Goal | How |
| --- | --- |
| Work without reviews | Keep PR as draft (Greptile skips by default) |
| Get early feedback on draft | `@greptileai review this draft` |

→ [Full draft PR docs](/docs/code-review/developer-essentials#working-with-draft-prs)

---

## [​](#preventing-unwanted-comment-replies) Preventing unwanted comment replies

One team asked:
> “Is it possible to stop the AI from responding to comments? We want to have normal conversations with other developers.”

Don’t tag `@greptile` or `@greptileai`. Greptile ignores other comments. In a Greptile review thread, tag your teammate — Greptile usually stays out, but may reply or react with 👍.

---

## [​](#team-quick-tips) Team quick tips

## Exclude bots on day one

Add `dependabot[bot]` and `renovate[bot]` to excluded authors. They don’t count toward billing either.→ [How to exclude](/docs/code-review/controlling-nitpickiness#excluded-authors-still-getting-reviewed)

## Batch your commits

Push multiple commits at once to avoid triggering reviews on every push.

## Be specific with questions

`@greptileai check for memory leaks` gets better results than just `@greptileai review`.

## Train consistently

Team should align on 👍/👎 reactions - inconsistent feedback confuses the learning system.→ [Training guide](/docs/code-review/training-the-learning-system)

---

## [​](#have-a-workflow-to-share) Have a workflow to share?

These recipes came from real support tickets. Share yours:

- [support@greptile.com](mailto:support@greptile.com)
- [Discord community](https://discord.gg/greptile)

⌘I
