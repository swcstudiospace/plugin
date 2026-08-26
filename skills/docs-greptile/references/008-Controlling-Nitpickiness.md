# Controlling Nitpickiness

Source: https://www.greptile.com/docs/code-review/controlling-nitpickiness

With noise control, Greptile limits reviews to high-signal insights, skipping low impact or repetitive feedback.

## [​](#configuration-options-overview) Configuration Options Overview

You can **configure** review behavior with these options in `.greptile/config.json` or `greptile.json`:

| Parameter | Type | Description |
| --- | --- | --- |
| `strictness` | number | Filters comments by importance (1-3 scale) |
| `commentTypes` | array | Categories of feedback to generate |
| `ignorePatterns` | string | Files/folders to skip (newline-separated patterns) |
| `triggerOnUpdates` | boolean | Review on every commit, not just PR open |
| `skipReview` | string | Set to `"AUTOMATIC"` for manual-only reviews |

## [​](#severity-threshold-settings) Severity Threshold Settings

Control how strict Greptile is about leaving comments with the strictness setting (1–3).

1

1. Low (Verbose)

**Comments on everything (low threshold).**Perfect for initial setup or deep reviews where you want every potential issue flagged.

2

2. Default (Recommended)

**Provides moderate filtering (default).**Balanced approach highlighting real issues while filtering common noise. We recommend starting here.

3

3. High (Critical)

**Shows only the most critical issues (high threshold).**Ideal for final reviews or teams that want minimal interruption.

### [​](#how-to-configure) How to Configure

- .greptile/ (Recommended)
- greptile.json
- Dashboard

Set `strictness` in `.greptile/config.json` at your repository root or any subdirectory:

.greptile/config.json

```
{
  "strictness": 2
}
```

- `1` = verbose (all issues)
- `2` = balanced (default)
- `3` = critical only

In a monorepo, child directories can override the root setting — for example, a `packages/db/.greptile/config.json` with `"strictness": 1` makes database reviews stricter while the rest of the repo stays at `2`. See [Cascading Configuration](/docs/code-review/greptile-config#cascading-configuration).

Create `greptile.json` at your repository root:

```
{
  "strictness": 2
}
```

- `1` = verbose (all issues)
- `2` = balanced (default)
- `3` = critical only

This overrides dashboard settings for this repository.

Go to **Settings → Code Review → Greptile Comments** and set the **Strictness Level** (Low, Medium, or High).![Code Review Settings](https://mintcdn.com/greptile/Y8YwftlC0YkMide_/images/code-review-settings.png?fit=max&auto=format&n=Y8YwftlC0YkMide_&q=85&s=7cad2008ec82f628a55c0ea127feecdb)

## [​](#comment-type-filtering) Comment Type Filtering

Filter which categories of feedback Greptile provides with `commentTypes` in `.greptile/config.json`. All types are **enabled by default**.
**Available comment types:**

- `logic` - Business logic issues, algorithmic problems, potential bugs
- `syntax` - Language-specific best practices, proper usage patterns
- `style` - Code formatting, naming conventions, structural consistency

### [​](#how-to-configure-2) How to Configure

- .greptile/ (Recommended)
- greptile.json

Set `commentTypes` in `.greptile/config.json` at your repository root or any subdirectory:

.greptile/config.json

```
{
  "commentTypes": ["logic", "syntax"]
}
```

This array replaces the default — only the types you list will appear. Like strictness, child directories can override this for their own scope.

If you still use the legacy root config file, set the same field in `greptile.json`:**Only critical issues:**

```
{
  "commentTypes": ["logic"]
}
```

**Code quality without style nitpicks:**

```
{
  "commentTypes": ["logic", "syntax"]
}
```

**Everything (default):**

```
{
  "commentTypes": ["logic", "syntax", "style"]
}
```

## [​](#ignore-patterns) Ignore Patterns

Exclude files that don’t need review to speed up analysis and reduce noise.

```
{
  "ignorePatterns": "*.generated.*\n**/*.test.js\n**/node_modules/**\n*.config.js\npackage-lock.json\n*.md"
}
```

**Common patterns to ignore:**

- `*.generated.*` - Generated code
- `**/*.test.js` - Test files
- `**/node_modules/**` - Dependencies
- `*.config.js` - Config files
- `package-lock.json` - Lock files
- `*.md` - Documentation

**Impact:** Ignoring generated/vendor files can speed up reviews by 30-50% and eliminate irrelevant comments.

`ignorePatterns` will only ignore those files during PR review. Greptile will still index them while indexing your repository, which can lead to other errors. For instance, in the case of large binary files. Reach out to Greptile support.

## [​](#trigger-configuration) Trigger Configuration

Control when Greptile performs reviews. This affects developer workflow and review frequency.

- .greptile/ (Recommended)
- greptile.json
- Dashboard

Set trigger behavior in `.greptile/config.json`:

.greptile/config.json

```
{
  "triggerOnUpdates": true
}
```

To disable automatic reviews entirely (manual trigger via `@greptileai` only):

.greptile/config.json

```
{
  "skipReview": "AUTOMATIC"
}
```

**Review on every commit:**

```
{
  "triggerOnUpdates": true
}
```

**Manual trigger only (skip automatic reviews):**

```
{
  "skipReview": "AUTOMATIC"
}
```

- `triggerOnUpdates` - When `true`, reviews on each push (not just PR open)
- `skipReview: "AUTOMATIC"` - Skips automatic reviews, only triggers via `@greptileai`

Go to **Code Review Settings** in the sidebar. Toggle **Auto-review on new commits** and **Review draft pull requests** in the **When Greptile Reviews** section.

Start with dashboard defaults, then add a `.greptile/` folder to repos that need custom settings.

## [​](#troubleshooting) Troubleshooting

Settings not taking effect

**Check these in order:**

1. If using `greptile.json`, did you commit and push it?
2. Are you looking at a new PR? Settings don’t affect existing reviews
3. Wait 2-3 minutes - config changes aren’t always instant

**Dashboard settings not working?**

- Check if the repo has a `greptile.json` (it overrides dashboard)
- Verify you saved the settings (look for confirmation message)

Still too many comments with strictness: 3

**Progressive solutions:**

1. Reduce comment types to `["logic"]` only
2. Add more ignore patterns for generated/test files
3. Consider `skipReview: "AUTOMATIC"` for non-critical repos
4. Give the learning system 2-3 weeks to adapt to your reactions

Missing important issues

**Check these settings:**

1. Is strictness too high? Try reducing by 1
2. Are all comment types enabled that you need?
3. Check ignore patterns - are they too broad?
4. Has the team been giving 👍 to important catches?

Different teams want different settings

**Best practice:**

1. Set organization-wide defaults in **Code Review Settings** at the org level
2. Teams inherit org settings by default. Customize specific teams in their own **Code Review Settings**
3. Use **Inheritance & Sync** on the team settings page to reset a team to match the org when needed
4. For per-directory overrides within a repo, use `.greptile/` folders — each package in a monorepo can have its own strictness and comment types

See [Organizations & Teams](/docs/code-review/team-setup-basics#syncing-settings-across-teams) for how inheritance works, and [Cascading Configuration](/docs/code-review/greptile-config#cascading-configuration) for per-directory overrides.

Excluded authors still getting reviewed

**In Dashboard:**
Go to **Code Review Settings** > **Greptile Comments**. Set the filter to **Authors** / **Exclude** and add:

- `dependabot[bot]`
- `renovate[bot]`
- Any other bot accounts

**Note:** This is dashboard-only, not available in greptile.json

Reviews triggering on disabled/release branches

**Solutions:**

1. Add release branches to excluded branches in dashboard
2. Use `greptile.json` with branch-specific rules
3. Set `skipReview: "AUTOMATIC"` for release repos

## [​](#what’s-next) What’s next?

- [.greptile/ Configuration →](/docs/code-review/greptile-config) for cascading per-directory settings
- [Train the learning system →](/docs/code-review/training-the-learning-system) to automatically reduce noise over time
- [Add custom standards →](/docs/code-review/custom-standards) for team-specific rules
- [Set up cross-repo context →](/docs/code-review/cross-repo-context) for related repositories

⌘I
