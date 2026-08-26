# Cross Repo Context

Source: https://www.greptile.com/docs/code-review/cross-repo-context

Repo Clusters let you group related repositories so that whenever Greptile reviews a PR in one of them, it automatically reads the others as read-only context.
It’s the dashboard equivalent of the `context.repos` field in [greptile.json](/docs/code-review/greptile-json-reference#cross-repository-context), but instead of pointing one repo at others, you define a group once and every member shares context with every other member.
Clusters are useful when a set of repos are tightly coupled, for example a service, its SDK, and its shared types, where a change in one often can’t be reviewed well without the others.

### [​](#creating-a-cluster) Creating a cluster

1

Open Cross-repo context

On the [Greptile dashboard](https://app.greptile.com), go to **Memory → Cross-repo context**. Managing clusters requires admin access.

2

Start a new cluster

Click **Create Repo Cluster**.

![New repo cluster form with name and member repositories](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/new-repo-cluster.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=9a9e4112b5dfa9eeec663202ad3957b3)

3

Name the cluster

Give the cluster a name.

4

Add repositories

Add at least 2 repositories. A cluster can hold up to 20 GB of repositories by total size.

### [​](#suggested-clusters) Suggested clusters

Greptile suggests clusters for you based on shared contributors, meaning repositories the same people have committed to over the last 90 days. Suggestions appear with a confidence indicator; click **Use this** to create the cluster, or **Discard** to dismiss it.

### [​](#how-clusters-affect-reviews) How clusters affect reviews

When Greptile reviews a PR in a clustered repo, it clones the other members read-only and makes them available to the reviewer, exactly like `context.repos`. Repos listed explicitly in `context.repos` take priority.

⌘I
