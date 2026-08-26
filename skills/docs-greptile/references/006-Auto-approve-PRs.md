# Auto-approve PRs

Source: https://www.greptile.com/docs/code-review/auto-approve-prs

Auto-approve lets Greptile approve pull requests that it rates as low-risk and bug-free.
It only approves PRs with a clean **5/5 Greptile review**. You choose the maximum risk level Greptile can approve, and you can add filters to keep certain PRs out of auto-approval.
Auto-approve is in beta. We recommend using it only for low-risk changes, not as a universal rule for every PR.

### [​](#configure-auto-approve) Configure auto-approve

1

Open Auto-approve settings

On the [Greptile dashboard](https://app.greptile.com/review#auto-approve), go to **Code Review Settings -> Auto-approve**.

![Auto-approve settings: toggle auto-approve, set the maximum risk to auto-approve, and add filters](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/auto-approve.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=873cf7e99adf91f2e3787e481818d92c)

2

Enable auto-approve

Turn on **Auto-approve pull requests**.

3

Set the maximum risk

Choose the highest risk level Greptile is allowed to approve. Greptile only auto-approves PRs at or below this level.Use **Low** for docs, tests, styling, and small code changes. Use higher levels only when you are comfortable with Greptile approving those changes without another human review. Critical-risk changes are never auto-approved.

4

Add filters

Add filters for labels, branches, files, or authors that should never be auto-approved. Add per-repo filters in your `.greptile` file.

[](https://mintcdn.com/greptile/iieqH0ZJAoZq407h/images/auto-approve-demo.mp4?fit=max&auto=format&n=iieqH0ZJAoZq407h&q=85&s=d2fb3d4e28ed03063764f91c0596a555)

Auto-approval still requires a clean 5/5 Greptile review. If Greptile finds an issue, or the PR does not meet the configured risk threshold, it will not approve the PR.

### [​](#how-risk-levels-work) How risk levels work

The risk level controls the broadest class of changes Greptile can approve.

- **Low**: docs, tests, styling, and small code changes assessed as low-risk
- **Medium**: ordinary application or business-logic changes
- **High**: dependency updates, build or runtime config, and core shared modules

Greptile never auto-approves critical-risk changes, including changes to auth, secrets, billing, database migrations, infra or CI, and public APIs.
Start with **Low**. Raise the maximum risk only after your team has seen enough auto-approved PRs to trust the behavior for that class of change.

### [​](#filters) Filters

Filters let you exclude PRs from auto-approval even when Greptile rates them as safe.
Use filters for changes that need a human reviewer every time, such as:

- Sensitive branches
- Release or migration labels
- Critical files or directories
- Authors whose PRs need extra review

Add per-repo filters in your `.greptile` file.

#### [​](#protect-specific-file-paths) Protect specific file paths

Use `excludePaths` to list paths that always require a human approval. A PR that touches any matching path is never auto-approved, even if the rest of the diff qualifies:

```
{
  "autoApprove": {
    "enabled": true,
    "riskCeiling": "low",
    "filters": {
      "excludePaths": ["src/auth/**", "db/migrations", ".github/workflows/**"]
    }
  }
}
```

Entries are glob patterns or plain directory paths (a directory entry covers everything under it, like a CODEOWNERS rule). Renames count on both sides, so moving a file out of a protected path still requires human review.
See the [config reference](/docs/code-review/greptile-config-reference#auto-approve) for all auto-approve fields.

### [​](#when-to-use-it) When to use it

Auto-approve is useful when the cost of waiting for a human review is higher than the risk of the change. Good candidates include docs updates, test-only changes, formatting, and small changes Greptile rates as low-risk.
Do not enable it broadly across all PRs. It is meant to save time on low-risk changes while keeping normal review paths for everything else.

⌘I
