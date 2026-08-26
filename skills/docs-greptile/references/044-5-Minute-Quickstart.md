# 5-Minute Quickstart

Source: https://www.greptile.com/docs/quickstart

This guide covers GitHub/GitLab setup, repository configuration, and your first automated code review.

## [​](#installation-&-setup) Installation & Setup

GitHub or GitLab users can follow the outlined steps to successfully enable Greptile within their repositories.
[Log in](https://app.greptile.com/login) to your Greptile account or [sign up](https://app.greptile.com/signup) via email, Google, Github, or GitLab.
Ensure you have the required permissions to allow the AI code reviewer access to all or specific repos. Each platform offers a different procedure for integration.

### [​](#github-app-installation) GitHub App installation

The GitHub app gives Greptile access to your repositories and lets it post reviews on pull requests.

1

Open Code Providers

Go to **Code Providers**. Click `Connect GitHub Cloud` or `Add Provider`, then select GitHub.

![GitHub installation page listing accounts and organizations for Greptile Apps](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/code-providers.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=770aa44a04067026f30f435aa0f021dd)

2

Choose a GitHub account or organization

In GitHub, choose the account or organization where you want to install **Greptile Apps**. Use **Configure** for an existing installation.

![GitHub Greptile Apps install page with account and organization options](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/github-install-account-selection.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=0c699dc8e85597d2a21fe09998a48422)

3

Grant repository access

Select which repositories GitHub lets Greptile access:

- **All repositories**: Grant access to all current and future repositories in the account or organization.
- **Only select repositories**: Grant access only to selected repositories. Select at least one repository.

Click `Install` or `Update access`.

![GitHub App install page with repository access and permissions](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/github-install-repository-access.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=5ab74a8170ff504e6a30b3d70038ec37)

4

Link the GitHub organization in Greptile

After you click `Install`, GitHub automatically returns you to Greptile. Select the GitHub organization, then click `Link`.You can add more organizations later from **Code Providers**.

![Greptile onboarding screen for selecting a GitHub organization to link](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/github-link-organization.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=c0dbbe9ba78a5ff7663aa20707158d44)

If your GitHub organization is missing from this list, see [Troubleshooting: GitHub organization not listed](/docs/troubleshooting/common-issues#github-organization-not-listed-on-greptile).

5

Enable repositories for review

Select the repositories you want Greptile to review, then click `Enable`.Use `Enable All` to turn on all repositories that GitHub granted access to.

![Greptile onboarding screen for enabling GitHub repositories for review](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/github-enable-repositories.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=8f72cfd5ee1474b376a0a6404b6f7ad6)

### [​](#gitlab-integration) GitLab Integration

Greptile supports GitLab service account personal access tokens, group access tokens, and project access tokens. We recommend a service account because its credentials are not tied to a person. The service account must have the **Developer** role for the groups or projects Greptile will review. Its personal access token must have the `api` scope.

1

Open GitLab integration

Go to **Code Providers** in Greptile and click **Add Provider**, then select GitLab. Greptile shows the token requirements and a field for the generated token.

![Greptile modal with GitLab integration token instructions](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/gitlab-integration-token-modal.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=015a27c00c3e4125d8474eaad4c087d0)

2

Create or select a service account

In GitLab, open the group that contains the projects Greptile needs to review, then go to **Settings** → **Service accounts**. Create a service account or select an existing one. Add it to every group or project Greptile needs to access with the **Developer** role.See [GitLab’s service account documentation](https://docs.gitlab.com/user/profile/service_accounts/) for details.

3

Create the service account personal access token

From the service account’s menu, select **Manage access tokens**, then **Add new token**. Create a personal access token with:

- **Token name**: `Greptile`
- **Scope**: `api`
- **Expiration date**: follow your GitLab policy

You can also use a group or project access token. Create it under **Settings** → **Access tokens** with the **Developer** role and `api` scope.

4

Copy the generated token

Copy the token. GitLab only shows it once.

5

Submit the token in Greptile

Paste the token into the GitLab integration modal, then click `Submit`.

![Greptile GitLab integration modal with token field and Submit button](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/gitlab-integration-token-modal.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=015a27c00c3e4125d8474eaad4c087d0)

6

Configure the webhook in GitLab

Greptile generates the details you need to create a GitLab webhook — a **URL**, a **secret token**, and the required **triggers**. The webhook is what lets Greptile review merge requests automatically.

![Greptile-generated GitLab webhook details: URL, secret token, and triggers](https://mintcdn.com/greptile/n1DJD5Cq07WZmn2N/images/greptile-gitlab-details-for-webhook.png?fit=max&auto=format&n=n1DJD5Cq07WZmn2N&q=85&s=13c4e5cb641dc44e5553d11678d97409)

1. In GitLab, open your project or group, then go to **Settings** → **Webhooks** → **Add new webhook**.
2. Fill in the **URL** and **Secret token** from Greptile, and enable the required **triggers**: **Comments**, **Issues events**, **Merge request events**, and **Emoji events**.
3. Click `Add webhook`.
4. Back in Greptile, click `Done, I’ve made the changes`.

7

Link the GitLab group

Select the GitLab group, then click `Link`.

![Greptile onboarding screen for selecting a GitLab group to link](https://mintcdn.com/greptile/KNJdf4DwzT1-8n6L/images/gitlab-link-group.png?fit=max&auto=format&n=KNJdf4DwzT1-8n6L&q=85&s=bd70cb8eb84c8d03e890a1a194480cba)

8

Enable repositories for review

Select the GitLab repositories you want Greptile to review, then click `Enable`.Use `Enable All` to turn on every listed repository.

![Greptile onboarding screen for enabling GitLab repositories for review](https://mintcdn.com/greptile/8PzYIxBdzrtuAyXk/images/gitlab-enable-repositories.png?fit=max&auto=format&n=8PzYIxBdzrtuAyXk&q=85&s=400835f09108912e80b2e630b89ce5fa)

### [​](#repository-selection-&-configuration) Repository Selection & Configuration

The following configuration steps are common to GitHub and GitLab:

1

Add or change repositories later

After onboarding, change which repositories Greptile reviews from your team’s **Repositories** page. Click **Manage Repos**, select repositories, then click **Enable Repos** (or **Enable All**).To automatically enable future repos, go to **Settings → Repo Settings** and toggle **Auto-enable new repos**.

![Repo Settings modal for enabling and disabling repositories](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/repositories-manage-repos-modal.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=26f2f080af96cab8bad2db6b7ff9694c)

2

Configure PR Summary

Customize how Greptile summarizes pull requests:

- **PR Summary**: Include a text summary of the changes
- **Confidence Score**: Show confidence levels for each PR
- **Issue Table**: Show important changed files with ratings
- **Sequence Diagram**: Add a diagram of the changes

[Learn more about PR summaries →](/docs/code-review/first-pr-review#pr-summary)

![PR Summary settings in Code Review Settings](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/code-review-pr-summary-settings.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=b5718e026d676224961fdbb95e901988)

3

Control Review Behavior

Configure when Greptile reviews in **Code Review Settings**:

- **Auto-review on new commits**: Review new commits after a PR is opened
- **Review draft pull requests**: Review drafts before they are marked ready
- **File change limit**: Set the largest PR Greptile reviews automatically
- **Filters**: Include/exclude PRs by author, label, branch, or keyword

[Learn more about controlling nitpickiness →](/docs/code-review/controlling-nitpickiness)

![When Greptile Reviews settings with review trigger options and filters](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/code-review-review-trigger-settings.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=41d0b1f59a22eb128edd282ed8a7fc20)

4

Set Comment Strictness

Choose how strict Greptile is in **Code Review Settings** under **Greptile Comments**:

- **Low**: Greptile will comment on all issues
- **Medium**: Greptile will comment on P2s less often
- **High**: Greptile will never comment on P2s

[Learn more about strictness levels →](/docs/code-review/controlling-nitpickiness#severity-threshold-settings)

![Greptile Comments settings with strictness level options](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/code-review-add-filter.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=798b2d2e19ff20471623d04437d9072d)

Once a repository is enabled, new pull and merge requests are reviewed automatically.

---

## [​](#create-your-first-test-pr) Create Your First Test PR

Try Greptile on a test pull request to see it in action:

1

Create a pull request

Make a test PR to an enabled repo with some code changes.

2

Wait for review (~3 minutes)

Greptile analyzes your PR with full codebase context and posts a comprehensive review.

![PR Summary](https://mintcdn.com/greptile/pPDrEYn7_-Bi_2Mg/images/greptile-pr-comment.png?fit=max&auto=format&n=pPDrEYn7_-Bi_2Mg&q=85&s=b8e0b17c33779d085e4952c302952b43)

3

Review the feedback

You’ll see a summary of changes, inline comments on issues, and suggested fixes.

![pr summary](https://mintcdn.com/greptile/sJeefWhR1h6iqsSa/images/pr-summary.png?fit=max&auto=format&n=sJeefWhR1h6iqsSa&q=85&s=6464ca32169feabc1024e9bebd94d643)

When issues are spotted, Greptile suggests potential code fixes:

![code fixes](https://mintcdn.com/greptile/sJeefWhR1h6iqsSa/images/issue-fixes.png?fit=max&auto=format&n=sJeefWhR1h6iqsSa&q=85&s=0a0084ab113ad1bb8c39c767c548b44e)

You can trigger a code review manually by tagging **@greptileai** with a comment. This is helpful for reviewing older PRs from before Greptile was integrated.

---

## [​](#what’s-next) What’s next?

- **For developers**: Learn how to [work with Greptile reviews →](/docs/code-review/developer-essentials)
- **For team admins**: Set up [organizations and teams →](/docs/code-review/team-setup-basics)
- **Deep dive**: Understand the [anatomy of a review →](/docs/code-review/first-pr-review)

⌘I
