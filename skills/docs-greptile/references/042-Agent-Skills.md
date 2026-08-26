# Agent Skills

Source: https://www.greptile.com/docs/mcp-v2/skills

Agent skills automate the full auto-fix workflow in [Claude Code](https://claude.ai/download). Instead of manually prompting your assistant to fetch comments and apply fixes, invoke a skill and let it handle the entire loop.
Both skills are open source and available at [github.com/greptileai/skills](https://github.com/greptileai/skills).

**Prerequisites:**

- [Claude Code](https://claude.ai/download) installed
- `git` and `gh` (GitHub CLI) installed and authenticated
- [Greptile installed](https://app.greptile.com/signup) on your repository
- [Greptile MCP server configured](/docs/mcp-v2/setup) in Claude Code

## [​](#install) Install

Clone the skills into your Claude Code skills directory. See the [Claude Code skills docs](https://docs.anthropic.com/en/docs/claude-code/skills) for more on how skill discovery works.

```
git clone https://github.com/greptileai/skills.git ~/.claude/skills/greptile
```

Or add as a submodule in your project:

```
git submodule add https://github.com/greptileai/skills.git .skills/greptile
```

---

## [​](#check-pr) check-pr

Checks a pull request for unresolved review comments, failing status checks, and incomplete descriptions — then fixes and resolves them.

### [​](#usage) Usage

```
/check-pr
```

Or with a specific PR number:

```
/check-pr 42
```

If no PR number is given, the skill auto-detects the PR for your current branch.

### [​](#what-it-does) What It Does

1

Waits for pending checks

Polls until all CI and review bot checks (Greptile, linters, etc.) reach a terminal state. This ensures all comments are available before analysis.

2

Analyzes the PR

Evaluates four areas:

- **Status checks** — Are CI checks passing or failing?
- **PR description** — Is it complete? Any TODOs or placeholders?
- **Review comments** — Inline comments from Greptile, linters, and human reviewers
- **General comments** — Discussion threads and bot notifications

3

Categorizes issues

Each issue is classified as:

| Category | Meaning |
| --- | --- |
| **Actionable** | Code changes, test improvements, or fixes needed |
| **Informational** | Verification notes, questions, or FYIs |
| **Already addressed** | Resolved by subsequent commits |

4

Fixes and resolves

If there are actionable items, the skill makes the fixes, commits, pushes, and resolves the corresponding review threads.

---

## [​](#greploop) greploop

Iteratively improves a PR until Greptile gives it a 5/5 confidence score with zero unresolved comments. Triggers a Greptile review, fixes all actionable comments, pushes, re-triggers, and repeats.

### [​](#usage-2) Usage

```
/greploop
```

Or with a specific PR number:

```
/greploop 42
```

### [​](#what-it-does-2) What It Does

1

Triggers a Greptile review

Pushes the latest changes and waits for the Greptile review check to complete.

2

Parses review results

Reads the confidence score (e.g. `3/5`) and fetches all unresolved inline comments from Greptile.

3

Fixes actionable comments

For each unresolved comment, reads the file in context, determines if a code change is needed, and applies the fix. Informational comments and false positives are noted and resolved.

4

Commits, pushes, and loops

Commits the fixes, pushes, and goes back to step 1. The loop runs up to **5 iterations** to avoid runaway cycles.

5

Exits when clean

Stops when Greptile returns **5/5 confidence** with **zero unresolved comments**, or after the max iterations.

### [​](#output) Output

On success:

```
Greploop complete.
  Iterations:    2
  Confidence:    5/5
  Resolved:      7 comments
  Remaining:     0
```

If the loop hits the iteration limit:

```
Greploop stopped after 5 iterations.
  Confidence:    4/5
  Resolved:      12 comments
  Remaining:     2

Remaining issues:
  - src/auth.ts:45 — "Consider rate limiting this endpoint"
  - src/db.ts:112 — "Missing index on user_id column"
```

---

## [​](#next-steps) Next Steps

## Auto-Fix Workflow

Manual auto-fix patterns using MCP tools

## Claude Code Setup

Set up the Greptile MCP server for Claude Code

⌘I
