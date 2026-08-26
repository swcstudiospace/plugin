# Key Features

Source: https://www.greptile.com/docs/code-review/key-features

## [​](#full-codebase-context) Full codebase context

Greptile builds a graph of your repository (functions, classes, imports, dependencies) and uses it during reviews to reason about ripple effects beyond the diff.

- Surfaces impacted callers and contracts
- Detects cross-file inconsistencies and missing validations
- References similar patterns already in your codebase

Learn more: [Graph-based context](/docs/how-greptile-works/graph-based-codebase-context)

## [​](#runtime-validation-witht-rex-beta) Runtime validation with T-Rex (Beta)

Short for Test, Run, EXecute, enabling **T-REX** lets Greptile run your code changes in a sandboxed environment to catch more bugs.

- Writes targeted tests for the PR, including changes and edge cases
- Runs tests in an isolated sandbox against your repo’s services, dependencies, and framework
- Attaches logs, screenshots, traces, scripts, or videos to failed PR comments so reviewers can verify what happened

![T-Rex settings: enable runtime validation, choose when it runs, and filter which PRs run T-Rex](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/t-rex.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=a749e422cd5b73cedfbe4e08ddb4b278)

Turn it on in [T-Rex settings](https://app.greptile.com/manicule/-/review#trex).

## [​](#high-signal-findings-not-nitpicks) High-signal findings (not nitpicks)

Focus on issues that matter by default; control verbosity with strictness and comment-type filters.

- Logic, security, performance, architectural issues by default
- Style and syntax can be reduced or disabled
- Per-repository rules with `greptile.json`

See: [Controlling nitpickiness](/docs/code-review/controlling-nitpickiness)

## [​](#learns-your-team’s-standards) Learns your team’s standards

Greptile adapts over time using thumbs up/down and short replies.

- Suppresses suggestions your team routinely ignores
- Reinforces patterns your team prefers
- Auto-discovers custom rules from team discussions

See: [Memory and learning](/docs/how-greptile-works/memory-and-learning)

## [​](#fix-all-with-ai) Fix All with AI

Every review comment includes a **Fix with your Agent** button that sends the issue — with file paths, line numbers, and suggested code — directly to your coding agent. A **Fix All** button in the review summary sends every issue at once.

- Supports Claude Code, OpenAI Codex, Conductor, Cursor, and Devin
- Agent receives full context and applies fixes automatically
- Comments resolve when you push the fix

![Default Coding Agents settings: prompt to Fix with AI and org-wide agent defaults](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/default-coding-agents.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=9ed967105b5b55bd87ceefedb9ee4c30)

Get started: [Fix with your Agent →](/docs/integrations/fix-with-your-agent)

## [​](#auto-resolution-from-your-ide-mcp) Auto-resolution from your IDE (MCP)

Resolve Greptile comments without leaving your editor.

- Open files, apply suggested fixes, mark threads resolved
- Works with Cursor, Windsurf, Claude Desktop, Codex CLI

Get started: [Auto-resolve with MCP](/docs/mcp-v2/overview)

## [​](#auto-approve-low-risk-prs-beta) Auto-approve low-risk PRs (Beta)

Auto-approve lets Greptile approve pull requests that it rates as low-risk and bug-free. It only approves PRs with a clean 5/5 Greptile review. Use it for changes where an automatic approval is acceptable, like docs, tests, styling, or small code changes.

- Set the **maximum risk level** Greptile can approve
- Add **filters** to exclude specific labels, branches, files, and authors from auto-approval
- Leave it off for broad or high-risk review flows. We recommend auto-approve only for low-risk changes

![Auto-approve settings: toggle auto-approve, set the maximum risk to auto-approve, and add filters](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/auto-approve.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=873cf7e99adf91f2e3787e481818d92c)

Turn it on in [Auto-approve settings](https://app.greptile.com/review#auto-approve).

## [​](#enterprise-grade-deployment) Enterprise-grade deployment

- Cloud (SOC2 Type II), self-hosted Docker/Kubernetes, air-gapped
- SSO/SAML, audit logging, role-based access
- Customer-managed PostgreSQL + pgvector, Redis (self-hosted)

See: [Self-hosting overview](/docs/deployment-options)

## [​](#configuration-you-control) Configuration you control

Use `greptile.json` for repo-level behavior.

greptile.json

```
{
  "strictness": 2,
  "commentTypes": ["logic", "syntax", "style"],
  "triggerOnUpdates": true,
  "ignorePatterns": "**/*.test.js\n**/vendor/**"
}
```

Reference: [greptile.json configuration](/docs/code-review/greptile-json-reference)

⌘I
