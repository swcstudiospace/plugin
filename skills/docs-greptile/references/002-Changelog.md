# Changelog

Source: https://www.greptile.com/docs/changelog

[​](#july-24-2026)

July 24, 2026

Dashboard

![New navigation bar on Greptile Dashboard](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/new-nav.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=ba644d93c63c0476ff02013d3b487e2f)

- **Unified Settings page** — All of your settings now live in one place.
- **Simplified top-bar** — The top bar is simplified to four tabs: Analytics, Memory, Pull Requests, and Settings — making space for new features.

Settings that have moved to new places:

- **Code review settings** — now in **Settings → Code Review**
- **T-Rex** — now in **Settings → T-Rex**
- **Enable/disable repos** — now in **Settings → Add/Remove Repos**
- **Code providers** — now in **Settings → Code Providers**

[Go to Dashboard →](https://app.greptile.com/)

[​](#april-30-2026)

April 30, 2026

Billing

## [​](#usage-limits) Usage Limits

You can now set a dollar cap for additional review spend. Reviews beyond the 50 credits included per active developer in a billing period are billed at $1/credit.When projected spend reaches the cap, Greptile skips new reviews until the next billing period or until you raise the limit.[Learn about billing and usage limits →](/docs/code-review-bot/billing-seats#usage-limits)

[​](#april-15-2026)

April 15, 2026

Dashboard

## [​](#redesigned-web-app) Redesigned Web App

The Greptile dashboard has been rebuilt with a new organization and team hierarchy. Key changes:

- **Breadcrumb navigation** — Switch between organizations and teams from a single dropdown. The sidebar adapts to show organization-level or team-level pages.
- **Auto-enable repositories** — Toggle in Code Review Settings to automatically enable Greptile on new repos as they’re created in a GitHub org or GitLab group.
- **Inheritance & Sync** — Team-level settings inherit from the organization. Sync a team back to org defaults with one click.
- **Analytics dashboard** — Track PRs reviewed, addressed rate, critical bugs caught, merge times, and upvote/downvote ratios. Filter by team, repository, author, and time period. Export data.
- **Redesigned onboarding** — New users joining an existing organization get a guided setup in Personal Settings: link a GitHub/GitLab profile, install the bridge app, and choose coding agents. Personal review preferences (summary, diagram, collapsible sections) are configured in the same flow.

[Learn about organizations & teams →](/docs/code-review/team-setup-basics)
[View the analytics dashboard →](/docs/analytics)

[​](#april-15-2026-2)

April 15, 2026

Config

## [​](#multi-repo-context) Multi-Repo Context

You can now give Greptile read-only access to related repositories during reviews. Add a `context.repos` field to your `.greptile/config.json` or `greptile.json` to reference shared libraries, SDKs, or other repos that help Greptile understand your code.

```
{
  "context": {
    "repos": ["acme/shared-types", "acme/payment-sdk"]
  }
}
```

[.greptile/ reference →](/docs/code-review/greptile-config-reference#cross-repository-context) | [greptile.json reference →](/docs/code-review/greptile-json-reference#cross-repository-context)

[​](#march-28-2026)

March 28, 2026

Code Review

## [​](#severity-badges) Severity Badges

Inline review comments now display a severity badge — **P0** (critical), **P1** (high), or **P2** (medium) — so you can triage feedback at a glance.[Learn about severity levels →](/docs/code-review/first-pr-review#severity-badges)

[​](#march-25-2026)

March 25, 2026

Code Review

The review summary footer has been updated with new controls:

- **Review counter** — Shows how many times Greptile has reviewed the PR (e.g. “Reviews (2)”)
- **Longer commit messages** — The “Last reviewed commit” link now shows more of the commit message for easier identification
- **Re-trigger button** — Click “Re-trigger Greptile” in the footer to re-run a review without tagging @greptileai

[See the anatomy of a review →](/docs/code-review/first-pr-review#review-footer)

[​](#march-6-2026)

March 6, 2026

Code Review

## [​](#greptile-v4) Greptile v4

Major upgrade to the review engine. v4 delivers significantly more actionable feedback across the board:

| Metric | Before | After | Change |
| --- | --- | --- | --- |
| Addressed comments per PR | 0.92 | 1.60 | **+74%** |
| Comments addressed by author | 30% | 43% | **+43%** |
| Positive replies per PR | 0.31 | 0.52 | **+68%** |
| Upvote reactions per PR | 0.05 | 0.08 | **+60%** |

“Addressed” is determined by an LLM-as-judge evaluating whether the author acted on each comment.

[​](#march-6-2026-2)

March 6, 2026

Integrations

## [​](#fix-in-claude-code-codex-and-cursor) Fix in Claude Code, Codex, and Cursor

Every Greptile review comment now includes a **Fix in X** button. Click it, and the issue gets sent straight to your coding agent — Claude Code, OpenAI Codex, or Cursor — with full context: file paths, line numbers, the review comment, and suggested fixes. Your agent opens, applies the fix, and you review the diff. A **Fix All** button in the review summary sends every issue at once.

![Greptile PR summary with Fix All button](https://mintcdn.com/greptile/NbRtsLvWVCnO7zAK/images/fix-in-x-pr-summary.png?fit=max&auto=format&n=NbRtsLvWVCnO7zAK&q=85&s=8b2cfc23233015db04acc8a3ab2e0b31)

[Set up Fix in X →](/docs/integrations/fix-with-your-agent)

[​](#february-10-2026)

February 10, 2026

Config

## [​](#cascading-config-files) Cascading Config Files

`greptile.json` files can now be placed in subdirectories to override parent-level review configuration. Settings cascade from root to subdirectory, allowing teams to define org-wide defaults while customizing review behavior for specific folders or modules.[Read the configuration reference →](/docs/code-review/greptile-config-reference)

[​](#january-5-2026)

January 5, 2026

Integrations

## [​](#greptile-plugin-for-claude-code) Greptile Plugin for Claude Code

Address Greptile review comments, manage custom context, and trigger reviews directly from Claude Code. Available in the official Anthropic plugin marketplace.

[](https://mintcdn.com/greptile/CnQscq2HVa0gyXSi/images/claude-code-plugin-demo.mp4?fit=max&auto=format&n=CnQscq2HVa0gyXSi&q=85&s=3a560ee0a0ae3220e3d6907c16d0d7ac)

[Set up the Claude Code integration →](/docs/mcp-v2/setup#claude-code-cli)

[​](#december-15-2025)

December 15, 2025

Code Review

## [​](#feature-discovery) Feature Discovery

Code reviews now surface contextual tips highlighting relevant Greptile features based on the content of each review, such as custom rules, `greptile.json` configuration options, and integration capabilities.

[​](#december-2-2025)

December 2, 2025

Config

## [​](#wildcard-repository-scopes) Wildcard Repository Scopes

Apply rules across all repositories in an organization or group using wildcards (e.g., `myorg/*` or `groupa/subgroupb/*`). Wildcard options are automatically generated based on your connected repositories.[Learn about custom standards →](/docs/code-review/custom-standards)

[​](#november-24-2025)

November 24, 2025

Config

## [​](#rule-optimization) Rule Optimization

Rules can now be generated and refined using AI directly from the custom context dashboard. Try it in the **+ Add Context** dialog at [app.greptile.com/review/custom-context](https://app.greptile.com/review/custom-context).

[](https://mintcdn.com/greptile/8Cym9aHLqh5ZsjNo/images/rule-optimization-demo.mov?fit=max&auto=format&n=8Cym9aHLqh5ZsjNo&q=85&s=7c5e1ff1f1d1416c7530b99674a3b382)

[Learn about custom standards →](/docs/code-review/custom-standards)

[​](#november-18-2025)

November 18, 2025

Config

## [​](#greptile-json-v3-support) greptile.json v3 Support

`greptile.json` configuration file now supports v3 code review settings, including custom instructions, skip rules, comment types, and review triggers.[See the full configuration reference →](/docs/code-review/greptile-json-reference)

[​](#october-29-2025)

October 29, 2025

Self-Hosting

## [​](#gitlab-reverse-proxy-support) GitLab Reverse Proxy Support

Greptile can now connect to self-hosted GitLab instances routed through reverse proxies, supporting environments where GitLab is not directly accessible from the public internet. Configure your reverse proxy URL in your integration settings.[View deployment options →](/docs/deployment-options)

[​](#october-16-2025)

October 16, 2025

Code Review

## [​](#clarification-questions) Clarification Questions

Reviews can now append a clarification question to an inline comment when change intent is ambiguous. Follow-up discussion happens in the same thread via implicit thread replies, with no retrigger required.[See developer essentials →](/docs/code-review/developer-essentials)

[​](#september-29-2025)

September 29, 2025

Code Review

## [​](#thread-replies) Thread Replies

Greptile now responds to follow-up comments in review threads. Ask a question, request a revision, or push back on a suggestion and Greptile replies in-thread. A classifier decides whether to respond and skips acknowledgments, approvals, or human-to-human discussion.[See developer essentials →](/docs/code-review/developer-essentials)

[​](#september-26-2025)

September 26, 2025

Config

## [​](#configurable-models-and-turns) Configurable Models and Turns

Choose which AI model powers your reviews and set the maximum number of agentic turns per review. Configure both in your review settings to balance speed, depth, and cost.[Configure your review settings →](/docs/code-review/greptile-config)

[​](#september-22-2025)

September 22, 2025

Code Review

## [​](#code-review-v3) Code Review v3

Completely rebuilt review engine around an agentic workflow. Reviews now learn your team’s standards from past GitHub and GitLab PR comments, pull context from tools like Jira and Notion, auto-detect project rule files (e.g., `CLAUDE.md`, `.cursor/rules`), and include a copy-prompt action on each comment for quick fixes in your editor.[Explore key features →](/docs/code-review/key-features)

[​](#september-15-2025)

September 15, 2025

MCP

## [​](#greptile-mcp-server) Greptile MCP Server

Greptile is now available as an MCP server, bringing code reviews into your AI-powered development environment. Trigger and re-run reviews, inspect results, manage custom context, and update repository rules without leaving your editor.[Get started with the MCP server →](/docs/mcp-v2/overview)

⌘I

FiltersClear

Code ReviewConfigDashboardIntegrationsBillingSelf-HostingMCP
