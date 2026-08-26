# Analytics Dashboard

Source: https://www.greptile.com/docs/analytics

The Analytics dashboard gives you visibility into review activity, comment quality, and team performance. Access it from the **Analytics** tab.

![Analytics dashboard overview](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/analytics-dashboard.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=76f271e5daad30ce08b392094aead173)

## [​](#filters) Filters

Use the filter bar at the top to scope analytics data.

| Filter | Options | Notes |
| --- | --- | --- |
| Teams | All teams, or select specific teams | Organization level only |
| Repositories | All repositories, or select specific repos |  |
| Authors | All authors, or select specific authors |  |
| Time period | Last 7 days, Last 30 days, Last 60 days, Last 90 days |  |

Click **Export** to download the current analytics data.
At the team level, the Teams filter is hidden since data is already scoped to that team.

## [​](#summary-cards) Summary cards

Four headline metrics appear at the top:

| Metric | Description |
| --- | --- |
| **PRs Reviewed** | Total pull requests reviewed by Greptile in the selected period |
| **Avg Merge Time** | Average time from PR open to merge |
| **Addressed rate** | Percentage of Greptile comments that were addressed by authors |
| **Critical bugs caught** | Number of critical issues flagged by Greptile |

## [​](#charts) Charts

Each chart includes a time series and a leaderboard sidebar showing the top repositories for that metric.

### [​](#prs-reviewed) PRs reviewed

A time series of pull requests reviewed per day. The leaderboard shows **Top repos by review count**.

### [​](#critical-bugs-caught) Critical bugs caught

Tracks critical issues flagged over time. Filter by severity level:

| Severity | Description |
| --- | --- |
| All Severity | All issues regardless of priority |
| P0 | Highest severity |
| P1 | High severity |
| P2 | Medium severity |

The leaderboard shows **Repos with most critical bugs**.

### [​](#addressed-rate) Addressed rate

Shows the percentage of Greptile comments addressed by PR authors over time, with an average trend line. The leaderboard shows **Top repos by addressed rate**.

### [​](#average-time-to-merge) Average time to merge

Tracks how long PRs take to merge. Toggle between **Mean** and other aggregation methods. The leaderboard shows **Top repos by merge time**.

### [​](#greptile-comments) Greptile comments

Displays upvote and downvote percentages for Greptile’s review comments, with a ratio chart over time. Switch between **Upvote/Downvote Ratio** and other comment metrics. The leaderboard shows **Most upvoted comments**.

## [​](#using-analytics-to-improve-reviews) Using analytics to improve reviews

- **Low addressed rate?** Your rules may be too noisy. [Adjust strictness](/docs/code-review/controlling-nitpickiness) or refine [custom standards](/docs/code-review/custom-standards).
- **High critical bug count in a repo?** Consider lowering the strictness threshold for that repo to catch more issues early.
- **High downvote ratio?** Review your [custom context](/docs/code-review/custom-standards) rules and [train the learning system](/docs/code-review/training-the-learning-system) with consistent reactions.
- **Long merge times?** Identify bottleneck repos from the leaderboard and investigate process or review load issues.

⌘I
