# Linear Integration

Source: https://www.greptile.com/docs/linear-integration

When you connect Linear, Greptile finds Linear issues related to your pull requests and reviews the code against the requirements.

**Prerequisites:** Authorizing the connection to Linear requires admin access. Once authorized, the context applies to every repository in the organization.

## [​](#what-greptile-does-with-your-issues) What Greptile Does with Your Issues

- **Greptile finds the issue.** It reads identifiers and links from the pull request title, description, and branch name, and it can search Linear for related work.
- **Greptile reviews the code against the issue.** The description, comments, and acceptance criteria become review context, so Greptile can point out where a change does not do what the issue asked for.
- **Greptile answers follow-up questions.** Ask about a Linear issue in a reply to a Greptile comment, and Greptile looks it up.
- **Greptile shows what it read.** Every issue it opened is linked in the review.

## [​](#connect-linear) Connect Linear

1

Open Integrations

Go to [Memory → Integrations](https://app.greptile.com/-/custom-context/integrations) in the Greptile dashboard.

2

Add Linear

Click **Add new data source** and select **Linear**.

3

Authorize Greptile

Linear asks you to grant Greptile read access to your workspace. Approve the request, and Linear returns you to the Integrations page.

4

Confirm the connection

Linear now appears in your list of connected data sources. Greptile uses issue context on the next review.

## [​](#where-issues-appear-in-reviews) Where Issues Appear in Reviews

A comment that depends on an issue ends with a **Source Used** line linking to it, and the review summary lists everything Greptile read under **Context used**.
Greptile cites only the issues it actually opened, and it says when an issue came from its own search rather than from your pull request.

## [​](#what-greptile-can-read) What Greptile Can Read

The connection is read-only, so Greptile never writes to Linear. Greptile reads Linear as the account that authorized the connection, which means it sees any issue that account can see, narrowed to the Linear teams you select.

## [​](#limit-greptile-to-specific-linear-teams) Limit Greptile to Specific Linear Teams

By default, Greptile can read your entire Linear workspace. To narrow that, click the edit icon on the **Linear** row to open **Configure Linear**, then select the Linear teams whose issues Greptile may read. If you select none, the whole workspace stays available.
The same dialog has an **Instructions** field for telling Greptile how your organization uses Linear, for example that acceptance criteria live in the issue description.

## [​](#manage-the-connection) Manage the Connection

Any member of your organization can see the connected data sources under [Memory → Integrations](https://app.greptile.com/-/custom-context/integrations), and admins can add or remove them there.
To turn the integration off, click the disconnect icon on the **Linear** row and confirm. Greptile deletes the stored credentials, and reviews continue without issue context.

## [​](#next-steps) Next Steps

## Jira Integration

Connect Jira to give reviews the same kind of ticket context.

## Common Issues

Troubleshoot reviews that are not picking up issue context.

⌘I
