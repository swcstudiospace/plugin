# Billing

Source: https://www.greptile.com/docs/code-review-bot/billing-seats

## [​](#pricing) Pricing

| Unit | Price |
| --- | --- |
| Active developer / month | **$30/seat** (includes 50 credits) |
| Additional credits (flex usage) | **$1/credit** |

**1 credit = 1 standard review.****3 credits = 1 [T-Rex](/docs/code-review/key-features#runtime-validation-with-t-rex-beta) review.**

An **active developer** is anyone with at least one completed review charged to them in the billing period. Overages are per-author, not pooled across the team.

## [​](#additional-credits) Additional credits

Each active developer gets 50 included credits per billing period, one credit per completed review. Usage beyond that appears as **flex usage**, billed at **$1/credit**: once a developer has used their 50 included credits, every further review they receive is flex, so their cost scales with actual review activity. It’s the same **flex usage** figure shown in your billing and usage dashboard.
Flex is calculated per developer, not from a shared team pool. Each author works through their own 50 included credits first before any of their reviews count as flex. Discounts and promotional credits are shown in the billing dashboard.

## [​](#how-reviews-are-counted) How reviews are counted

Billing counts **completed reviews**, not PRs. Skipped reviews don’t count.
**Pull request reviews** are charged to the **PR author**, not to the person who triggered the review. They run when a PR is opened, on a [manual trigger](/docs/code-review-bot/trigger-code-review) from a comment or the web app, or when commits are pushed with [`triggerOnUpdates`](/docs/code-review-bot/trigger-code-review#auto-review-on-every-commit) enabled.
**[CLI](/docs/code-review/greptile-cli) reviews** are either attributed or unattributed.
An **attributed** CLI review is charged to the Greptile user who ran it and shares that user’s seat and included credits. To attribute CLI reviews, sign in with [`greptile login`](/docs/code-review/greptile-cli#sign-in) and connect your GitHub or GitLab account in [Personal Settings → Account](https://app.greptile.com/user/settings/account).
An **unattributed** CLI review bills as flex usage and does not count as an active developer. API-key reviews are unattributed unless the key is bound to a user with a linked account.

## [​](#usage-limits) Usage limits

Organizations can cap flex usage in [**Organization Settings → Billing → Flex Usage Limit**](https://app.greptile.com/-/settings/billing) to control spend. When projected spend hits the cap, Greptile skips reviews that would incur flex usage until the next billing period or until you raise the cap. Set the limit to **$0** to disable flex usage.
Authors still within their 50 included credits can continue to receive reviews even after the cap is reached.

## [​](#excluding-bots) Excluding bots

Excluded authors are not reviewed and don’t count as active developers.

- Dashboard
- greptile.json

In [Code Review → Greptile Comments](https://app.greptile.com/review#greptile-comments), set **Authors** / **Exclude** and add:

- `dependabot[bot]`
- `renovate[bot]`
- Any service accounts

```
{
  "excludeAuthors": ["dependabot[bot]", "renovate[bot]"]
}
```

## [​](#dashboard) Dashboard

- [Settings → Usage](https://app.greptile.com/-/settings/usage): review counts and active developers
- [Settings → Billing](https://app.greptile.com/-/settings/billing): usage limits, payment methods, **Billing Portal** (plan status, invoices, cancellation)

For billing questions or enterprise pricing, contact [hello@greptile.com](mailto:hello@greptile.com).

⌘I
