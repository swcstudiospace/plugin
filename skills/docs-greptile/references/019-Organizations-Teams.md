# Organizations & Teams

Source: https://www.greptile.com/docs/code-review/team-setup-basics

Greptile has **organizations** (your workspace) and **teams** (each GitHub org or GitLab group you connect).

## [​](#one-org-vs-multiple) One org vs. multiple

**One connected org or group** — most workspaces look like this. The top-left breadcrumb shows your workspace name only. Use **Organization Settings** for members, billing, and providers. There is no **Team Settings** tab.
**Two or more connected orgs or groups** — the breadcrumb shows `Workspace / team-name`. Pick a team from the dropdown to switch context. **Team Settings** appears for team-specific member access.

![Workspace dropdown showing org and team hierarchy](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/workspace-dropdown.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=f3c1a6966ddd2cbe284db8aece5fcfa9)

Steps below that mention **Team Settings** only apply when you have multiple teams connected. Otherwise, use **Organization Settings**.

## [​](#roles) Roles

### [​](#organization-roles) Organization roles

Set under **Settings → People**.

- **Admin** — Billing, members, code providers, integrations, and organization-wide review settings.
- **Member** — Day-to-day use: analytics, repos, pull requests, and custom context. Cannot change billing, providers, or org-wide settings.

At least one admin must remain. The last admin cannot be removed until another is promoted.

### [​](#team-roles) Team roles

Only relevant with multiple teams connected. Set under **Team Settings → People**.

- **Admin** — Manage members for that team. Cannot edit **Code Review Settings** (organization admins only).
- **Member** — View team repos, pull requests, and custom context; enable or disable repos for that team.

Organization admins always have full access to every team.

## [​](#adding-members) Adding members

1

Go to Settings

Open **Settings → People**.

2

Invite members

Click **Invite people**, or use **Member link** to share an invite link.

![Organization people management](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/org-settings-people.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=9eda6c89505475d9f1952980b3ff51e8)

3

Assign roles

Choose **Admin** or **Member**.

To limit someone to a specific GitHub org or GitLab group, select that team in the breadcrumb, then open **Team Settings → People**.

![Team people management](https://mintcdn.com/greptile/kTEOEt_jfh6iINFC/images/team-settings-people.png?fit=max&auto=format&n=kTEOEt_jfh6iINFC&q=85&s=796eda3d01a8fffd3bdd8fa608d50b03)

## [​](#managing-repositories) Managing repositories

Open **Settings → Add/Remove Repos** to enable or disable repos.

![Add/Remove Repos page with repository list and status](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/manage-repos.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=4dde12b24b84686446895387ea8e5956)

Select repositories in the list, then enable or disable them. The **Status** column shows which repos Greptile currently reviews.
Organization admins can manage repos across the whole workspace. With multiple teams, team members can also manage repos for their team.

### [​](#auto-enable-new-repositories) Auto-enable new repositories

1. Go to **Settings → Repo Settings** (under **Repositories**)
2. Toggle **Auto-enable new repos**

Only organization admins can change this.

![Repo Settings with the Auto-enable new repos toggle](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/auto-enable-and-sync.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=d6a3c88eace2f8a403fb5bbb812c3ad4)

## [​](#syncing-settings-across-teams) Syncing settings across teams

With multiple teams, each team can inherit review settings from the organization. On a team’s **Code Review Settings** page, use **Inheritance & Sync**:

- **Sync from Parent** — match organization defaults
- **Sync Now** — sync immediately (disabled when already in sync)

Organization-level custom rules also appear on each team’s **Memory → Custom rules** page as inherited.

## [​](#onboarding-for-invited-members) Onboarding for invited members

New members land in the org dashboard and are guided through **Personal Settings → Review Settings**:

1. Link GitHub or GitLab profile
2. Install the bridge app
3. Choose coding agents for Fix with your Agent

Members can also set personal preferences for summaries, diagrams, collapsible sections, and comments outside the diff.

**Members** do not see **Code Providers** or **Integrations** — admins only.

## [​](#code-providers) Code providers

Admins connect GitHub or GitLab under **Code Providers**. Click **Add Provider** to connect more orgs or groups.

![Code providers page](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/code-providers.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=770aa44a04067026f30f435aa0f021dd)

If a GitHub organization does not appear when you add a provider, see [GitHub organization not listed](/docs/troubleshooting/common-issues#github-organization-not-listed-on-greptile).

## [​](#what’s-next) What’s next?

- [Configure review settings](/docs/code-review/controlling-nitpickiness)
- [Add custom standards](/docs/code-review/custom-standards)
- [View analytics](/docs/analytics)

⌘I
