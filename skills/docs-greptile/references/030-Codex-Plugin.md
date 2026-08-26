# Codex Plugin

Source: https://www.greptile.com/docs/integrations/codex

Use Greptile in Codex to inspect pull requests, run local reviews, and fix review feedback.

**Prerequisites:** Install Codex and `git`. Create a [Greptile account](https://app.greptile.com/signup) and connect your repositories. Install `gh` for GitHub or `glab` for GitLab.

## [​](#installation) Installation

1

Set your Greptile API key

Create a key in [Settings > Organization > API Keys](https://app.greptile.com/settings/organization/api). Export it in the shell that starts Codex:

```
export GREPTILE_API_KEY="your-api-key"
```

Add the export to your shell profile if you want it available in new terminals. Do not commit the key.

2

Add the Greptile marketplace

```
codex plugin marketplace add greptileai/greptile-codex-plugin
```

3

Install the Greptile plugin

```
codex plugin add greptile@greptile-codex-plugins
```

The plugin configures Greptile MCP and installs the `$check-pr`, `$cli-review`, and `$greploop`
skills. Start a new Codex task after installation.

4

Authenticate your code-host CLI

Sign in to your code-host CLI:

```
gh auth login
```

Use `glab auth login` for GitLab.

5

Verify the installation

Check the marketplace, plugin, and MCP server:

```
codex plugin marketplace list
codex plugin list
codex mcp list
```

The output should include the `greptile-codex-plugins` marketplace, the enabled `greptile`
plugin, and the `greptile` MCP server with `GREPTILE_API_KEY` as its bearer token environment
variable.Open a repository in a new Codex task. Test the skill and MCP connections:

```
Use $check-pr to inspect the pull request for this branch. Do not change files or resolve threads.
```

```
Use Greptile MCP to list my open pull requests.
```

## [​](#what-you-can-do) What You Can Do

Once installed, ask Codex to work with Greptile reviews and local changes.

### [​](#check-a-pull-request) Check a Pull Request

```
Use $check-pr on PR 42. Fix only actionable issues, then summarize the changes.
```

`$check-pr` checks a GitHub PR or GitLab MR for unresolved comments, failed checks, and an incomplete description. It can fix issues and resolve threads when asked.

### [​](#review-a-local-branch) Review a Local Branch

`$cli-review` requires the [Greptile CLI](/docs/code-review/greptile-cli). Install it, then run
`greptile whoami` to verify that `GREPTILE_API_KEY` is available.

```
Use $cli-review on this branch. List the highest-severity findings first.
```

`$cli-review` runs a Greptile CLI review against the current local branch and summarizes the findings.

### [​](#run-the-full-review-loop) Run the Full Review Loop

```
Use $greploop on this PR. Stop when the review is clean or after five iterations.
```

`$greploop` fixes feedback, triggers another review, and repeats until Greptile reaches 5/5 confidence with no unresolved comments. It stops after five iterations.

`$check-pr` and `$greploop` can change code, commit, push, and resolve review threads. Run them from the branch you want to update.

## [​](#example-prompts) Example Prompts

```
Use $check-pr on PR 42. Fix only actionable issues, then summarize the changes.
```

```
Use $cli-review on this branch. List the highest-severity findings first.
```

```
Use $greploop on this PR. Stop when the review is clean or after five iterations.
```

```
Use Greptile MCP to list my open pull requests and summarize any blocking comments.
```

## [​](#available-tools) Available Tools

The plugin gives Codex access to Greptile’s [MCP server](/docs/mcp-v2/overview) and three public skills:

| Tool | Use it for |
| --- | --- |
| Greptile MCP | Read review data, comments, custom context, and reports. See all [MCP tools](/docs/mcp-v2/tools). |
| `$check-pr` | Inspect hosted reviews, checks, and PR descriptions. Fix issues and resolve threads when asked. |
| `$cli-review` | Review the current local branch with the Greptile CLI. |
| `$greploop` | Fix feedback and repeat reviews until the PR is clean or the five-iteration limit is reached. |

## [​](#troubleshooting) Troubleshooting

A skill is not found

Start a new Codex task after installation. If the skill is still missing, reinstall the plugin:

```
codex plugin add greptile@greptile-codex-plugins
```

The MCP server cannot authenticate

Check that the key is available in the shell that launched Codex:

```
test -n "$GREPTILE_API_KEY" && echo "GREPTILE_API_KEY is set"
```

Create a new API key if the current key was revoked.

The MCP server is disconnected

Run `codex plugin list` and `codex mcp list`. Confirm the plugin is enabled, the MCP URL is `https://api.greptile.com/mcp`, and the bearer token environment variable is `GREPTILE_API_KEY`. Then restart Codex.

A hosted review workflow cannot read the PR

Confirm your code-host CLI is installed and signed in. Run `gh auth status` for GitHub or `glab auth status` for GitLab.

A local review cannot start

Run `greptile whoami` and `greptile --version`. The review must run from a Git repository with committed changes.

## [​](#next-steps) Next Steps

## MCP setup

Configure Greptile MCP in other coding tools.

## Agent skills

Learn how the review skills work.

## Greptile CLI

Install the CLI and run local reviews.

## Skills source

Review the public skill source.

## Codex plugin source

Review the marketplace package and installation instructions.

⌘I
