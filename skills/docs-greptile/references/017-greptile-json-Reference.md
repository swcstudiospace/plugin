# greptile.json Reference

Source: https://www.greptile.com/docs/code-review/greptile-json-reference

Complete configuration reference for `greptile.json`. All parameters are optional.

**Looking for the recommended config format?** The [`.greptile/` folder](/docs/code-review/greptile-config) supports everything `greptile.json` does, plus cascading per-directory overrides, separate rules files, and structured rules with severity and disable-by-ID. `greptile.json` is still fully supported — if both exist in the same directory, `.greptile/` takes precedence.

Place `greptile.json` in your repository root. Settings are read from the source branch of the PR and override dashboard settings.

## [​](#review-behavior) Review Behavior

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `strictness` | number | `2` | Severity threshold. Must be `1`, `2`, or `3` |
| `commentTypes` | array | `["logic", "syntax", "style"]` | Comment types to provide. Options: `logic`, `syntax`, `style`. Prefer `.greptile/config.json` for this setting in new and existing repositories |
| `triggerOnUpdates` | boolean | `false` | Review every commit to the PR, not just when opened |
| `triggerOnDrafts` | boolean | `false` | If `true`, review draft PRs. Default is `false` |
| `skipReview` | string | - | Set to `"AUTOMATIC"` to skip auto-reviews but allow manual triggers |

## [​](#pr-filters) PR Filters

Control which PRs get reviewed:

| Parameter | Type | Description |
| --- | --- | --- |
| `labels` | array | Review only PRs with these labels. Supports [glob patterns](#glob-patterns-in-filters). |
| `disabledLabels` | array | Skip PRs with these labels. Supports [glob patterns](#glob-patterns-in-filters). |
| `includeAuthors` | array | Review only PRs from these authors. Empty = all authors (except excluded). Supports [glob patterns](#glob-patterns-in-filters). |
| `excludeAuthors` | array | Never review PRs from these authors. Supports [glob patterns](#glob-patterns-in-filters). |
| `includeBranches` | array | Review only PRs to these branches. Empty = all branches (except excluded). Supports [glob patterns](#glob-patterns-in-filters). |
| `excludeBranches` | array | Never review PRs to these branches. Supports [glob patterns](#glob-patterns-in-filters). |
| `includeKeywords` | string | Newline-separated keywords. Review only PRs with these in title/description |
| `ignoreKeywords` | string | Newline-separated keywords. Skip PRs with these in title/description |
| `fileChangeLimit` | number | Skip PRs with more than this many changed files (minimum: 1) |

### [​](#glob-patterns-in-filters) Glob patterns in filters

Label, author, and branch fields accept globs alongside literals. Matching is case-insensitive.

- `*` — any chars in a segment
- `**` — any chars across segments
- `?` — one char
- `{a,b}` — `a` or `b`
- `[`, `]`, and leading `!` are literal. `dependabot[bot]` works as-is. Negation is not supported.

```
{
  "includeBranches": ["main", "release/*"],
  "excludeBranches": ["dependabot/**"],
  "disabledLabels": ["wip-*"],
  "excludeAuthors": ["*-bot", "*@dependabot.com", "dependabot[bot]"]
}
```

## [​](#file-patterns) File Patterns

| Parameter | Type | Description |
| --- | --- | --- |
| `ignorePatterns` | string | Newline-separated file patterns to skip (follows `.gitignore` syntax) |

**Example:**

```
{
  "ignorePatterns": "**/*.generated.*\ndist/**\nnode_modules/**"
}
```

## [​](#cross-repository-context) Cross-Repository Context

Configure related repositories Greptile should read during reviews (e.g., shared libraries or SDKs) under the `context` namespace.

| Parameter | Type | Description |
| --- | --- | --- |
| `context` | object | Namespace for context-related settings. |
| `context.repos` | array | Related repositories Greptile should read during reviews. Each entry must be in `owner/repo` format, on the same SCM host as the primary repository, and accessible with the same credentials. |

**Example:**

```
{
  "context": {
    "repos": ["acme/shared-types", "acme/payment-sdk"]
  }
}
```

## [​](#custom-context) Custom Context

| Parameter | Type | Description |
| --- | --- | --- |
| `instructions` | string | Natural language instructions for code reviews |
| `customContext` | object | Advanced context with `rules`, `files`, and `other` arrays |
| `patternRepositories` | array | Related repos to reference (format: `org/repo`) |

**customContext structure:**

```
{
  "customContext": {
    "rules": [
      {
        "rule": "Use async/await instead of callbacks",
        "scope": ["src/**/*.ts"]
      }
    ],
    "files": [
      {
        "path": "docs/style-guide.md",
        "description": "Company style guide",
        "scope": ["src/**"]
      }
    ],
    "other": [
      {
        "content": "This is a legacy codebase - be cautious with changes",
        "scope": ["legacy/**"]
      }
    ]
  }
}
```

## [​](#review-output) Review Output

Control how reviews appear:

| Parameter | Type | Description |
| --- | --- | --- |
| `shouldUpdateDescription` | boolean | If `true`, updates PR description. If `false`, posts as review comment |
| `updateSummaryOnly` | boolean | Only update summary, don’t post individual inline comments |
| `fixWithAI` | boolean | Add AI fix prompts to help AI tools understand fixes |
| `hideFooter` | boolean | Hide Greptile footer from review comments |

### [​](#review-components) Review Components

Control visibility of individual review components:

| Parameter | Type | Description |
| --- | --- | --- |
| `includeIssuesTable` | boolean | Include issues table in review |
| `includeConfidenceScore` | boolean | Include confidence scores in review |
| `includeSequenceDiagram` | boolean | Include diagrams in review (sequence, ER, class, or flow — auto-selected based on changes) |

### [​](#review-sections) Review Sections

Fine-grained control over section visibility and behavior:

| Parameter | Type | Properties |
| --- | --- | --- |
| `summarySection` | object | `included` (boolean), `collapsible` (boolean), `defaultOpen` (boolean) |
| `issuesTableSection` | object | `included` (boolean), `collapsible` (boolean), `defaultOpen` (boolean) |
| `confidenceScoreSection` | object | `included` (boolean), `collapsible` (boolean), `defaultOpen` (boolean) |
| `sequenceDiagramSection` | object | Controls the diagram section (sequence, ER, class, or flow). Properties: `included` (boolean), `collapsible` (boolean), `defaultOpen` (boolean) |

**Example:**

```
{
  "summarySection": {
    "included": true,
    "collapsible": true,
    "defaultOpen": false
  }
}
```

## [​](#github-specific) GitHub-Specific

| Parameter | Type | Description |
| --- | --- | --- |
| `statusCheck` | boolean | Create a GitHub status check for each review. When enabled, Greptile posts a status check (pass/fail indicator) instead of a comment like “X files reviewed, no comments”. Set to `true` to disable the “X files reviewed” comments. |
| `statusCommentsEnabled` | boolean | Post a summary comment on PRs after review. This controls the main review summary comment, not the “X files reviewed” status message. |

**Common confusion:** To disable the “X files reviewed, no comments” message, set `statusCheck: true` (not `statusCommentsEnabled: false`). When `statusCheck` is enabled, Greptile uses GitHub’s status check system instead of posting status comments.

## [​](#complete-example) Complete Example

greptile.json

```
{
  "strictness": 2,
  "commentTypes": ["logic", "syntax"],
  "context": {
    "repos": ["acme/shared-types", "acme/payment-sdk"]
  },
  "instructions": "Focus on security and maintainability",
  "ignorePatterns": "**/*.generated.*\ndist/**\n*.md",
  "patternRepositories": ["acme/shared-utils"],
  "triggerOnUpdates": false,
  "fileChangeLimit": 100,
  "includeAuthors": [],
  "excludeAuthors": ["dependabot[bot]"],
  "includeBranches": ["main", "develop"],
  "excludeBranches": ["draft/**"],
  "customContext": {
    "rules": [
      {
        "rule": "All API endpoints must have rate limiting",
        "scope": ["src/api/**/*.ts"]
      }
    ],
    "files": [
      {
        "path": "docs/architecture.md",
        "description": "System architecture"
      }
    ]
  },
  "shouldUpdateDescription": false,
  "statusCheck": true,
  "includeConfidenceScore": true,
  "summarySection": {
    "included": true,
    "collapsible": false,
    "defaultOpen": true
  }
}
```

## [​](#parameter-reference-by-category) Parameter Reference by Category

All parameters alphabetically

- `commentTypes` - array
- `context` - object (with `repos` array)
- `customContext` - object
- `disabledLabels` - array
- `excludeAuthors` - array
- `excludeBranches` - array
- `fileChangeLimit` - number
- `fixWithAI` - boolean
- `hideFooter` - boolean
- `ignoreKeywords` - string
- `ignorePatterns` - string
- `includeAuthors` - array
- `includeBranches` - array
- `includeConfidenceScore` - boolean
- `includeIssuesTable` - boolean
- `includeKeywords` - string
- `includeSequenceDiagram` - boolean (controls all diagram types)
- `instructions` - string
- `labels` - array
- `patternRepositories` - array
- `shouldUpdateDescription` - boolean
- `skipReview` - string (literal `"AUTOMATIC"`)
- `statusCheck` - boolean
- `statusCommentsEnabled` - boolean
- `strictness` - number (1, 2, or 3)
- `triggerOnDrafts` - boolean
- `triggerOnUpdates` - boolean
- `updateSummaryOnly` - boolean
- **Section objects:** `summarySection`, `issuesTableSection`, `confidenceScoreSection`, `sequenceDiagramSection`

## [​](#validation) Validation

JSON syntax errors

**Common mistakes:**❌ **Trailing commas:**

```
{
  "strictness": 2,
  "commentTypes": ["logic"],
}
```

✅ **No trailing comma:**

```
{
  "strictness": 2,
  "commentTypes": ["logic"]
}
```

**Validate your JSON:**

```
npx jsonlint greptile.json
```

Invalid parameter values

**strictness must be 1, 2, or 3:**

```
{
  "strictness": 4
}
```

❌ Invalid - only 1, 2, or 3 allowed**commentTypes must be valid:**

```
{
  "commentTypes": ["logic", "syntax", "style"]
}
```

✅ Valid options: `logic`, `syntax`, `style`**skipReview must be exactly “AUTOMATIC”:**

```
{
  "skipReview": "AUTO"
}
```

❌ Invalid - must be `"AUTOMATIC"` exactly

File location

**✅ Correct:** Repository root

```
your-repo/
├── greptile.json
├── src/
└── package.json
```

**❌ Wrong:** Subdirectory

```
your-repo/
├── src/
│   └── greptile.json
└── package.json
```

Configuration not taking effect

**Check:**

1. File is in repository root
2. File exists in the source branch of the PR
3. JSON is valid (use jsonlint)
4. Parameter names are spelled correctly
5. Waiting for new PR (changes don’t affect existing reviews)

Export dashboard settings: Go to [app.greptile.com/review/github](https://app.greptile.com/review/github?tab=config) → Click copy/download icon

## [​](#configuration-hierarchy) Configuration Hierarchy

Settings priority (highest to lowest):

1. **`.greptile/` folder** (per-directory and repo-wide settings)
2. **`greptile.json`** in repository root
3. **Dashboard settings** (organization defaults)

Rules from the dashboard and from config files all apply. A config file can turn off a dashboard rule by ID.
If both `.greptile/` and `greptile.json` exist in the same directory, `.greptile/` takes precedence and `greptile.json` is ignored. See [Customization Overview](/docs/code-review/customization-overview) for details.

## [​](#what’s-next) What’s Next

- [Custom Standards →](/docs/code-review/custom-standards) - Enforce team-specific rules
- [Cross Repo Context →](/docs/code-review/cross-repo-context) - Reference related codebases
- [Controlling Nitpickiness →](/docs/code-review/controlling-nitpickiness) - Configure review behavior

⌘I
