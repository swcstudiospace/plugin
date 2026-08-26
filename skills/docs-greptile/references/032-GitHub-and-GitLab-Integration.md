# GitHub and GitLab Integration

Source: https://www.greptile.com/docs/integrations/github-gitlab-integration

## [​](#overview) Overview

Greptile integrates with GitHub and GitLab to provide automated code reviews on your pull requests and merge requests. The setup process differs between the two platforms.

GitHub, GitLab, and GitHub Enterprise Server are supported (email [hello@greptile.com](mailto:hello@greptile.com) for GHES access)

---

## [​](#github-integration) GitHub Integration

GitHub integration uses the **Greptile Apps** GitHub App, which handles authentication and permissions automatically.

### [​](#setup) Setup

**You’ll be guided through GitHub App installation during onboarding.** The process includes:

1. **Installing the GitHub App** - You’ll be redirected to GitHub to authorize the Greptile Apps installation
2. **Granting repository access** - Select which repositories Greptile can access:
   - **All repositories** - Grant access to all current and future repos
   - **Select repositories** - Choose specific repos to enable
3. **Configuring reviews** - Select which repositories to actively review at [app.greptile.com/review/github](https://app.greptile.com/review/github)

### [​](#managing-your-installation) Managing Your Installation

After initial setup, you can manage your GitHub integration:

- **Modify repository access**: Visit [github.com/apps/greptile-apps](https://github.com/apps/greptile-apps) to add/remove repository permissions
- **Configure review settings**: Go to [app.greptile.com/review/github](https://app.greptile.com/review/github) to enable/disable reviews per repository

All Greptile actions (comments, reviews, reactions) are performed as the GitHub App.

---

## [​](#gitlab-integration) GitLab Integration

**You’ll be guided through GitLab integration during onboarding.** The setup requires a GitLab access token and webhook configuration for automatic reviews. Greptile supports service account personal access tokens, group access tokens, and project access tokens. We recommend a service account because its credentials are not tied to a person.

### [​](#prerequisites) Prerequisites

Ensure HTTP(S) git access is enabled for your GitLab group:

1. Navigate to your GitLab group
2. Go to **Settings → General → Permissions and group features**
3. Under **Enabled git access protocols**, select **Both SSH and HTTP(S)** or **Only HTTP(S)**

### [​](#authentication-setup) Authentication Setup

1

Create a Service Account Personal Access Token

Create a GitLab **service account personal access token**. GitLab designed service accounts for automated processes and third-party integrations.

1. Navigate to your GitLab group
2. Go to **Settings → Service accounts**
3. Create a service account or select an existing one
4. Add the service account to the groups or projects Greptile needs to access with the **Developer** role
5. From the service account’s menu, select **Manage access tokens → Add new token**
6. Create a personal access token with:
   - **Name**: `Greptile` (or your preferred name)
   - **Scope**: `api`
   - **Expiration**: Follow your GitLab policy
7. Copy the token immediately. GitLab only shows it once.

See [GitLab’s service account documentation](https://docs.gitlab.com/user/profile/service_accounts/) for details.

You can also use a group or project access token. Create it under **Settings → Access tokens** with the **Developer** role and `api` scope.

2

Add Token to Greptile Dashboard

You’ll be prompted to add your token during onboarding. You can update it later at [app.greptile.com/connections/code-providers](https://app.greptile.com/connections/code-providers).

### [​](#webhook-configuration) Webhook Configuration

Webhooks enable **automatic code reviews** when merge requests are opened or updated. Without webhooks, you can still trigger reviews manually.
We recommend setting up webhooks at the group level to apply to all repositories in the group.

1

Get Webhook Details

Retrieve your webhook URL and secret from the Greptile dashboard:

1. Go to [app.greptile.com/review/gitlab](https://app.greptile.com/review/gitlab)
2. Copy the **webhook secret** displayed on the page (unique to your Greptile organization - do not share)
3. Note the webhook URL: `https://talon.greptile.com/webhook`

You can retrieve your webhook secret anytime by clicking the gear icon at [app.greptile.com/review/gitlab](https://app.greptile.com/review/gitlab)

2

Configure GitLab Webhook

Set up the webhook in your GitLab group:

1. Navigate to your GitLab group
2. Go to **Settings → Webhooks**
3. Add a new webhook with:
   - **URL**: `https://talon.greptile.com/webhook`
   - **Secret Token**: Paste the secret from Greptile dashboard
   - **Trigger events**: Enable the following:
     - **Comments**
     - **Issue events**
     - **Merge request events**
     - **Emoji events**
   - **Enable SSL verification**: Recommended
4. Click **Add webhook**

### [​](#troubleshooting-automatic-reviews-not-triggering) Troubleshooting: Automatic Reviews Not Triggering

If Greptile on GitLab isn’t running automatically on an open merge request even though the repository is enabled, a misconfigured or missing webhook is the most common cause.

1

Verify the webhook configuration

In GitLab, go to **Group/Project Settings → Webhooks** and confirm the configuration:

- **Greptile Webhook URL**: `https://talon.greptile.com/webhook`
- **Required triggers**:
  - **Comments**
  - **Issues events**
  - **Merge request events**
  - **Emoji events**

If the webhook is misconfigured or missing, get the webhook URL and secret from the Greptile dashboard. Go to the **Code Providers** tab, click the **⋮** menu on your GitLab provider card, and choose **Webhook Configuration**. Both values are shown there with **Copy** buttons.

2

Test the webhook

Back in GitLab, test the webhook with a **Push event**, then check **Recent events** at the bottom of the page.

3

Inspect a failing delivery

If it fails, click **View details** on the failing event and share the request/response payload with us through the support widget in the app.

⌘I
