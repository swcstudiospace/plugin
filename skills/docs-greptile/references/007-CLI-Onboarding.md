# CLI Onboarding

Source: https://www.greptile.com/docs/code-review/cli-onboarding

Set up Greptile without leaving your terminal. `greptile onboard` creates your organization, connects GitHub or GitLab, enables repositories, and imports your existing AI rules files — the same setup the dashboard does.
This page is written to be **handed to a coding agent**. Paste the prompt below into Claude Code, Cursor, Codex, or any agent that can read a URL and run shell commands, and it will do the setup for you.

Requires **Greptile CLI v3.2.0 or newer** and **Node 22+**. The `onboard` command does not exist in earlier versions — if you see `Unknown command onboard`, you are on an old build. See [Upgrade](#upgrade).

## [​](#onboard-with-your-coding-agent) Onboard with your coding agent

Copy this prompt into your agent:

Prompt

```
Onboard me to Greptile. Read the agent playbook at
https://www.greptile.com/docs/code-review/cli-onboarding and follow it exactly.

Work in the git repository I currently have open.

Run the machine steps yourself. When you reach a step that needs my browser
or an interactive terminal, stop, print the exact command or URL I need, and
wait for me to confirm before continuing. Do not guess my organization name —
ask me.

Finish by running a review on my current branch and summarizing the findings.
```

Run it from inside the repository you want reviewed.

Your agent handles installation, checks, sign-in, verification, and your first review. You handle the two things it cannot: approving the browser sign-in, and answering the wizard.

## [​](#onboard-yourself) Onboard yourself

If you would rather do it by hand, it is three commands:

```
npm i -g greptile@latest
cd path/to/your/repo
greptile onboard
```

Then, once setup finishes:

```
greptile review
```

---

## [​](#prerequisites) Prerequisites

- **Node 22+** — check with `node --version`
- A **local git repository** with at least one commit, and a remote on GitHub or GitLab
- Permission to **install a GitHub App** on your organization (or, for GitLab, to create an access token and a webhook)

You do **not** need a Greptile account yet. `greptile login` creates one.

## [​](#install) Install

- npm
- Homebrew
- Install script

```
npm i -g greptile@latest
```

```
brew install greptileai/tap/greptile
```

```
curl -fsSL https://raw.githubusercontent.com/greptileai/cli/main/install.sh | bash
```

### [​](#upgrade) Upgrade

`onboard` shipped in **v3.2.0**. Confirm your version:

```
greptile --version
```

If it is below `3.2.0`, upgrade with the same method you installed with:

```
npm i -g greptile@latest   # or: brew upgrade greptile
```

If `GREPTILE_API_KEY` is set, it overrides your browser sign-in and onboarding fails with `API key invalid or revoked` — even when the key is valid. API keys are org-scoped and cannot create an organization, so they cannot onboard.Unset it, and check your shell rc files for a lingering export:

```
unset GREPTILE_API_KEY
```

`greptile whoami` marks an environment key with `(via GREPTILE_API_KEY)`.

## [​](#run-the-wizard) Run the wizard

1

Run it from your repository root

```
cd path/to/your/repo
greptile onboard
```

Run this **inside the repo you want reviewed**. The wizard scans your checkout for AI rules files. Run it from your home directory and that step silently finds nothing.

If you are not signed in, the wizard opens your browser. Approve the sign-in and it continues. That sign-in creates your Greptile account.

2

Create your organization

Answer the wizard’s prompts. Leave the URL handle blank and Greptile derives one from your organization name.

3

Connect your code provider

Pick **GitHub** or **GitLab**. Greptile opens your browser to finish the connection.

- **GitHub** — authorize Greptile and complete the App install, choosing which repositories it can access.
- **GitLab** — paste a service account personal access token (recommended), group access token, or project access token. The account must have the Developer role and the token must have the `api` scope. Set up the webhook, then click `Done, I’ve set up the webhook`.

Leave the terminal open. Greptile polls and continues on its own once the connection lands.

No graphical browser (SSH, container, remote dev box)? The CLI prints the URL instead so you can open it on another device, and keeps polling.You have **10 minutes** to finish. Every 60 seconds the wizard offers **Keep waiting**, **Pick organization manually**, or **Skip for now**.

When the connection lands, pick the organization to link. If you only have one and it is unclaimed, Greptile links it automatically.

4

Enable repositories

Select the repositories Greptile should review.

**At least one repository is required.** Onboarding cannot finish without one.

The list can pause on a spinner while a new organization syncs. Wait it out.Indexing starts in the background. You do not have to wait for it.

5

AI rules are imported automatically

Greptile scans your checkout and imports **every** match as org-wide custom context:

- `CLAUDE.md` and `.claude/rules/**/*.md`
- `AGENTS.md`
- `.cursorrules` and `.cursor/rules/**/*.mdc`

There is no picker — anything it finds, it takes. Add more context later from the dashboard.

6

Done

You will see:

```
Greptile is ready to review your first PR!
  1 repo added
  2 AI-rules files imported
```

Your **14-day free trial** starts here. No payment method required.

## [​](#verify) Verify

```
greptile whoami   # who you are, and your organizations
greptile onboard  # prints setup status when output is not a terminal
greptile review   # review the current branch
```

Open a pull request and Greptile reviews it automatically.

---

## [​](#agent-playbook) Agent playbook

**This section is the contract an AI agent should follow.** Human readers can skip to [Troubleshooting](#troubleshooting).

### [​](#what-you-can-and-cannot-automate) What you can and cannot automate

Two steps are interactive by design and **cannot** be driven by an agent:

1. **Approving the browser sign-in** — a human must click Approve.
2. **The `greptile onboard` wizard itself** — it refuses to run when it detects an agent environment (`CLAUDECODE`, `CLAUDE_CODE`, `CURSOR_AGENT`, `CODEX_*`) or a non-TTY stdout. Run non-interactively, it prints setup status and exits `0` instead.

Do not try to defeat these. Do not spawn a pseudo-TTY, unset agent environment variables, or call internal API endpoints. **Instead, use `greptile onboard`’s non-interactive output as a read-only state probe**, do every other step yourself, and hand off cleanly for the two that need a human.

### [​](#steps) Steps

1

Preflight

```
node --version
greptile --version || echo "NOT_INSTALLED"
```

Require Node **22+**. Require greptile **≥ 3.2.0**; if missing or older, run `npm i -g greptile@latest` and re-check. If `greptile onboard --help` reports `Unknown command`, the upgrade did not take effect — stop and report it.

2

Check for a conflicting API key

```
[ -n "$GREPTILE_API_KEY" ] && echo "API_KEY_SET"
```

If set, warn the user: it **overrides browser sign-in**, and a stale key produces a misleading `API key invalid or revoked` on every command. Ask them to `unset GREPTILE_API_KEY` and remove it from their shell rc. Do not proceed while a failing key is set.

3

Locate the repository

```
git rev-parse --show-toplevel
```

Run everything from there. If this fails, the user is not in a git repository — stop and ask where their repo is. Both the AI-rules import and the review depend on it.

4

Check sign-in

```
greptile whoami
```

- `Signed in as <email>` with an org listed → already set up. Skip to **Run the first review**.
- `Signed in as <email>` with no organizations → signed in, not onboarded. Go to **Hand off the wizard**.
- `Not signed in` → continue below.

To sign in, run `greptile login`. It prints a URL and waits. **Surface that URL to the user and stop.** Do not proceed until `greptile whoami` reports a signed-in account.

5

Probe onboarding state

```
greptile onboard
```

Because you are an agent, this does not open the wizard. It prints status and exits `0`:

| Output | Meaning | Do this |
| --- | --- | --- |
| `Greptile onboarding: complete.` | Fully set up | Skip to **Run the first review** |
| `Greptile onboarding: in progress.` | Started, unfinished | **Hand off the wizard** |
| `Greptile onboarding: dismissed.` | Skipped earlier | **Hand off the wizard** |
| `error: not signed in.` | No credentials | Go back to **Check sign-in** |

6

Hand off the wizard

**Stop here and wait for the user.** Print this, verbatim:
> Run this in your own terminal — I can’t drive an interactive wizard:
>
> ```
> cd <repo-root> && greptile onboard
> ```
>
> You’ll be asked for: your name, an organization name, a URL handle (blank is fine), company website (optional), and company size. Then pick GitHub or GitLab, finish the connection in the browser that opens, and choose which repositories to enable. Tell me when it says “Greptile is ready to review your first PR!”

Then poll until it completes:

```
greptile onboard
```

Proceed only when it prints `Greptile onboarding: complete.` If the user reports an error, match it against [Troubleshooting](#troubleshooting) and tell them the fix — do not attempt to work around it yourself.

7

Run the first review

```
greptile review --agent
```

Use `--agent` (plain text) or `--json` (structured). Summarize the findings for the user.Exit codes: `0` finished · `1` could not finish (or signed out) · `2` invalid invocation (not a git repo) · `130` interrupted.If it fails with a billing error, report it and stop — see [Troubleshooting](#troubleshooting).

### [​](#rules) Rules

- **Never invent answers to the wizard.** The organization name and handle are the user’s to choose.
- **Every command is safe to re-run.** Each step is gated on server state, so a repeated `greptile onboard` skips what is already done. If you are unsure of the state, probe again.
- **Do not create a second organization.** If the user is already onboarded, `greptile onboard` offers “Create a new organization” — that is not a retry, and it is not what they want.

---

## [​](#troubleshooting) Troubleshooting

Unknown command onboard

Your CLI predates v3.2.0. Run `greptile --version`, then upgrade with `npm i -g greptile@latest` (or `brew upgrade greptile`).If you installed via npm but `greptile` resolves through Homebrew’s Node, `brew upgrade` will not help — use npm.

API key invalid or revoked

Your key is fine; it is the wrong credential. `GREPTILE_API_KEY` overrides browser sign-in, and API keys cannot create an organization.

```
unset GREPTILE_API_KEY
greptile whoami
```

Remove the export from `~/.zshrc`, `~/.zprofile`, or `~/.bashrc` too, or it returns in your next shell.

We didn't detect a completed GitHub connection

The browser step did not finish. Re-run `greptile onboard` and complete the GitHub App install — authorizing Greptile is not enough. You must finish the install and grant repository access.

Every organization is already linked to another workspace

Someone at your company already connected that organization to a different Greptile workspace. Ask them to invite you, or install Greptile on an organization you own and refresh the list.

Greptile needs at least one repository to finish onboarding

No repository was enabled. If the list was empty, your organization was probably still syncing — re-run `greptile onboard` and choose **Add repositories**.

The review fails with a billing or trial error

CLI reviews require an active trial or a paid plan; the free plan includes pull request reviews only. New organizations start a 14-day trial automatically. Add a payment method in the [dashboard](https://app.greptile.com/).

I'm on SSH, a container, or a remote dev box

The CLI prints a URL you can open on any device, and a code to paste back if it cannot reach your machine. API keys work for reviews but cannot onboard, so run `greptile onboard` somewhere with a browser first.

## [​](#command-reference) Command reference

| Command | What it does |
| --- | --- |
| `greptile onboard` | Interactive setup wizard. Prints setup status when output is not a terminal. |
| `greptile login` | Sign in through your browser |
| `greptile whoami` | Show your account and organizations |
| `greptile review` | Review the current branch against its base |
| `greptile settings` | Change review settings, members, and team config |
| `greptile update` | Update the CLI |

Review strictness, PR summary sections, and team invitations are **not** part of onboarding. Configure them after setup with `greptile settings`, or in the dashboard.

## [​](#what’s-next) What’s next?

## Greptile CLI

Review flags, output formats, and exit codes.

## Custom Standards & Rules

Teach Greptile your team’s conventions.

## MCP

Use Greptile from your editor or coding agent.

## Anatomy of a Review

Understand what Greptile posts on a PR.

⌘I
