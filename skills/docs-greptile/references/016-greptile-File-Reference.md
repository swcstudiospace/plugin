# .greptile/ File Reference

Source: https://www.greptile.com/docs/code-review/greptile-config-reference

Complete field reference for the three files in a `.greptile/` folder. For how cascading works and monorepo examples, see [.greptile/ Configuration](/docs/code-review/greptile-config).

## [​](#config-json) config.json

Your review settings and structured rules. All fields are optional — only include what you want to configure.

### [​](#review-settings) Review Settings

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `strictness` | `1 | 2 | 3` | `2` | Comment threshold. `1` = verbose (flags more issues), `3` = critical only (flags fewer issues) |
| `commentTypes` | `string[]` | `["syntax", "logic", "style"]` | Which comment categories to include |
| `fileChangeLimit` | `number` | — | Maximum number of changed files to review |

### [​](#filters) Filters

Control which PRs get reviewed.

| Field | Type | Description |
| --- | --- | --- |
| `labels` | `string[]` | Only review PRs with these labels. Supports [glob patterns](#glob-patterns-in-filters). |
| `disabledLabels` | `string[]` | Skip review for PRs with these labels. Supports [glob patterns](#glob-patterns-in-filters). |
| `includeAuthors` | `string[]` | Only review PRs from these authors. Supports [glob patterns](#glob-patterns-in-filters). |
| `excludeAuthors` | `string[]` | Skip review for PRs from these authors. Supports [glob patterns](#glob-patterns-in-filters). |
| `includeBranches` | `string[]` | Only review PRs targeting these branches. Supports [glob patterns](#glob-patterns-in-filters). |
| `excludeBranches` | `string[]` | Skip review for PRs targeting these branches. Supports [glob patterns](#glob-patterns-in-filters). |
| `includeKeywords` | `string` | Newline-separated keywords. Only review PRs with these in title/description |
| `ignoreKeywords` | `string` | Newline-separated keywords. Skip PRs with these in title/description |
| `ignorePatterns` | `string` | File patterns to skip, using `.gitignore` syntax (newline-separated) |

#### [​](#glob-patterns-in-filters) Glob patterns in filters

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

### [​](#behavior) Behavior

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `triggerOnUpdates` | `boolean` | `false` | Re-run the review when the PR is updated |
| `statusCheck` | `boolean` | `false` | Post a GitHub status check with the review result |
| `statusCommentsEnabled` | `boolean` | — | Enable status comments on PRs |
| `skipReview` | `"AUTOMATIC"` | — | Set to `"AUTOMATIC"` to skip review entirely for files in this directory |
| `shouldUpdateDescription` | `boolean` | — | If `true`, updates PR description instead of posting a review comment |
| `updateSummaryOnly` | `boolean` | — | Only update the summary, don’t post individual inline comments |
| `fixWithAI` | `boolean` | — | Add AI fix prompts to help AI coding assistants understand suggested fixes |
| `hideFooter` | `boolean` | — | Hide the Greptile footer from review comments |

### [​](#auto-approve) Auto-approve

Controls [auto-approval](/docs/code-review/auto-approve-prs) of low-risk PRs. All fields live under a single `autoApprove` object.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `autoApprove.enabled` | `boolean` | `false` | Let Greptile approve PRs that pass a clean 5/5 review and every check below |
| `autoApprove.riskCeiling` | `"low" | "medium" | "high" | "critical"` | `"low"` | Highest risk level Greptile is allowed to approve |
| `autoApprove.filters` | `object` | — | Exclude PRs from auto-approval even when they pass the risk check |

Filter fields (all optional, inside `autoApprove.filters`):

| Field | Type | Description |
| --- | --- | --- |
| `excludePaths` | `string[]` | Never auto-approve a PR that touches a matching path. Entries are glob patterns (`src/auth/**`) or plain directory/file paths (`db/migrations`, which also covers everything under it). Both sides of a rename count. |
| `includeAuthors` / `excludeAuthors` | `string[]` | Only auto-approve PRs from / never auto-approve PRs from these authors. Supports [glob patterns](#glob-patterns-in-filters). |
| `includeBranches` / `excludeBranches` | `string[]` | Only auto-approve PRs targeting / never auto-approve PRs targeting these branches. Supports [glob patterns](#glob-patterns-in-filters). |
| `labels` / `disabledLabels` | `string[]` | Only auto-approve PRs with / never auto-approve PRs with these labels. Supports [glob patterns](#glob-patterns-in-filters). |
| `includeKeywords` / `ignoreKeywords` | `string` | Newline-separated keywords matched against the PR title and description |
| `fileChangeLimit` | `number` | Never auto-approve PRs that change more than this many files |
| `includeRepositories` / `excludeRepositories` | `string[]` | Limit auto-approval to / exclude specific repositories. Supports [glob patterns](#glob-patterns-in-filters). |

```
{
  "autoApprove": {
    "enabled": true,
    "riskCeiling": "low",
    "filters": {
      "excludePaths": ["src/auth/**", "db/migrations", ".github/workflows/**"],
      "excludeAuthors": ["dependabot[bot]"]
    }
  }
}
```

In [cascading configuration](/docs/code-review/greptile-config#cascading-configuration), auto-approve merges strictest-wins across every directory a PR touches: `enabled` must be true in every touched scope, exclude lists union, include lists intersect, numeric limits take the minimum, and the strictest `riskCeiling` wins.

### [​](#output-sections) Output Sections

Each section controls a part of the review output. All sub-fields are optional booleans.

| Field | Description |
| --- | --- |
| `summarySection` | PR summary at the top of the review |
| `issuesTableSection` | Table of all issues found |
| `confidenceScoreSection` | Confidence score for each comment |
| `sequenceDiagramSection` | Sequence diagram of the changes |

Each accepts an object with these sub-fields:

| Sub-field | Type | Description |
| --- | --- | --- |
| `included` | `boolean` | Whether to show this section |
| `collapsible` | `boolean` | Whether the section can be collapsed |
| `defaultOpen` | `boolean` | Whether the section starts expanded |

### [​](#cross-repository-context) Cross-Repository Context

Configure related repositories Greptile should read during reviews (e.g., shared libraries or SDKs) under the `context` namespace.

| Field | Type | Description |
| --- | --- | --- |
| `context` | `object` | Namespace for context-related settings. |
| `context.repos` | `string[]` | Related repositories Greptile should read during reviews. Each entry must be in `owner/repo` format, on the same SCM host as the primary repository, and accessible with the same credentials. |

**Example:**

```
{
  "context": {
    "repos": ["acme/shared-types", "acme/payment-sdk"]
  }
}
```

### [​](#instructions) Instructions

| Field | Type | Description |
| --- | --- | --- |
| `instructions` | `string` | Free-form instructions for the reviewer. When cascading, instructions from all parent configs are concatenated together. |

### [​](#rules) Rules

Structured rules let you define what the reviewer should check for, with optional scoping and severity.

| Field | Type | Description |
| --- | --- | --- |
| `rules` | `Rule[]` | Array of structured rules. See schema below. |
| `disabledRules` | `string[]` | IDs of rules inherited from parent configs that should not apply in this directory. See [Disabling Inherited Rules](/docs/code-review/greptile-config#disabling-inherited-rules). |

#### [​](#rule-schema) Rule Schema

Each entry in the `rules` array:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `rule` | `string` | **Yes** | The rule instruction shown to the reviewer |
| `id` | `string` | No | Stable identifier. Required if a child config needs to disable this rule via `disabledRules`. |
| `scope` | `string[]` | No | Glob patterns for files this rule applies to, relative to the `.greptile/` directory. Avoid `../` patterns — rules should apply within their own directory tree. |
| `severity` | `"low" | "medium" | "high"` | No | Severity level for violations |
| `enabled` | `boolean` | No | Whether the rule is active. Default: `true` |

### [​](#complete-example) Complete Example

.greptile/config.json

```
{
  "strictness": 2,
  "commentTypes": ["logic", "syntax"],
  "triggerOnUpdates": true,
  "ignorePatterns": "**/*.generated.*\ndist/**\nnode_modules/**",
  "summarySection": {
    "included": true,
    "collapsible": true,
    "defaultOpen": false
  },
  "context": {
    "repos": ["acme/shared-types", "acme/payment-sdk"]
  },
  "instructions": "This is a TypeScript monorepo using pnpm workspaces. We use Prisma for database access and zod for validation.",
  "rules": [
    {
      "id": "no-console",
      "rule": "Do not use console.log in production code. Use the logger service instead.",
      "scope": ["src/**"],
      "severity": "medium"
    },
    {
      "rule": "All async functions must have error handling.",
      "severity": "high"
    }
  ],
  "disabledRules": []
}
```

The first rule has an `id` so it can be disabled by child configs. The second rule has no `id` — it applies everywhere and can’t be selectively turned off.

---

## [​](#rules-md) rules.md

Plain markdown passed to the reviewer as context. The entire file is scoped to the directory containing the `.greptile/` folder — it applies to all files reviewed within that directory tree.
There is no special syntax or parsing. Write standard markdown with headings, lists, code blocks, and any other formatting that helps communicate your rules clearly.

### [​](#example) Example

.greptile/rules.md

```
# Code Review Rules

## Error Handling

All async functions must use try-catch blocks. Never swallow errors silently.
At minimum, log the error with context:

​```typescript
try {
  await operation();
} catch (error) {
  logger.error('Operation failed', { error, context });
  throw error;
}
​```

## SQL Injection Prevention

Always use parameterized queries. Never interpolate user input into SQL strings.

- Use prepared statements
- Validate input types before queries
- Use Prisma's query builder instead of raw SQL where possible

## API Input Validation

Validate all API inputs using zod schemas before processing. Define the schema
next to the route handler.
```

### [​](#rules-md-vs-config-json-rules) rules.md vs config.json rules

Both define review rules. The difference is structure and granularity:

|  | `rules.md` | `config.json` rules |
| --- | --- | --- |
| **Format** | Free-form markdown | Structured JSON |
| **Scoping** | Entire file applies to its directory tree | Per-rule scope via glob patterns |
| **Severity** | Not supported | `low` / `medium` / `high` |
| **Disable by ID** | Not supported | Supported via `disabledRules` |
| **Best for** | Prose explanations, code examples, guidelines | Precise, individually scoped and disableable rules |

You can use both in the same `.greptile/` folder. They’re additive — the reviewer sees rules from both sources.

---

## [​](#files-json) files.json

Points the reviewer to existing files in your repository that it should read for context — database schemas, API specs, architecture docs, or anything that helps the reviewer understand your codebase.

### [​](#schema) Schema

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | `string` | **Yes** | Path to the file, relative to the directory containing the `.greptile/` folder (the same directory the config governs). For a root `.greptile/`, this is the repo root; for nested configs (e.g., `packages/db/.greptile/`), `schema.prisma` resolves to `packages/db/schema.prisma`. |
| `description` | `string` | No | What the file contains and why it’s relevant to reviews |
| `scope` | `string[]` | No | Glob patterns — only include this file when reviewing files matching these patterns. Patterns are relative to the `.greptile/` directory; avoid `../` patterns. |

### [​](#example-2) Example

.greptile/files.json

```
{
  "files": [
    {
      "path": "prisma/schema.prisma",
      "description": "Database schema — reference for model relationships and field types"
    },
    {
      "path": "docs/api-contracts.yaml",
      "description": "OpenAPI specification for all public endpoints",
      "scope": ["src/api/**"]
    },
    {
      "path": "docs/auth-flow.md",
      "description": "Authentication and authorization flow documentation",
      "scope": ["src/auth/**", "src/middleware/auth*"]
    }
  ]
}
```

Files without a `scope` are included in every review within the directory tree. Files with a `scope` are only included when the file being reviewed matches one of the glob patterns.
File references are accumulated from all parent configs — a child config doesn’t replace the parent’s file list, it adds to it.

---

## [​](#what’s-next) What’s Next

## .greptile/ Configuration

How cascading works, precedence model, monorepo examples

## Custom Standards

Enforce coding standards via dashboard or .greptile/

⌘I
