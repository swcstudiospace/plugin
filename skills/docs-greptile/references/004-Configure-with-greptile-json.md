# Configure with greptile.json

Source: https://www.greptile.com/docs/code-review-bot/greptile-json

You can have custom settings at the repo level by adding a `greptile.json` file to the root of the
repo. Settings will be read from the source branch of the PR.
You can grab your global settings in the correct format
[here](https://app.greptile.com/review/github?tab=config) by clicking on the `copy` or `download` icons
on the top right of the Settings panel.

### [​](#configuration-hierarchy) Configuration Hierarchy

Settings in `greptile.json` **override** dashboard settings for that repository. The hierarchy is:

1. **greptile.json** (highest priority) - Repository-specific configuration
2. **Dashboard settings** (lower priority) - Organization-wide defaults

This allows you to set organization-wide defaults in the dashboard while customizing specific repositories with greptile.json.

The `ignorePatterns` field follows `.gitignore`
[syntax](https://git-scm.com/docs/gitignore).

greptile.json

```
{
  "labels": ["feature", "bug"],
  "commentTypes": ["logic", "syntax"],
  "instructions": "Ensure style_guide.md is enforced.",
  "ignoreKeywords": "rename\nlinter\nprettier\ngreptile-ignor",
  "ignorePatterns": "greptile.json\ntesting/**/*.py\n*.md\n*.txt\n*.json",
  "patternRepositories": ["acme/backend"],
  "triggerOnUpdates": true,
  "shouldUpdateDescription": false,
  "disabledLabels": ["docs"],
  "includeAuthors": ["dakshgup", "schoi"],
  "excludeAuthors": ["cool-dev"],
  "strictness": 2,
  "fixWithAI": false,
  "includeKeywords": "bug\nfeature",
  "includeBranches": ["main", "develop"],
  "excludeBranches": ["draft", "wip"],
  "statusCheck": true,
  "statusCommentsEnabled": true,
  "summarySection": {
    "included": true,
    "collapsible": false,
    "defaultOpen": false
  },
  "issuesTableSection": {
    "included": true,
    "collapsible": false,
    "defaultOpen": false
  },
  "confidenceScoreSection": {
    "included": true,
    "collapsible": false,
    "defaultOpen": false
  },
  "sequenceDiagramSection": {
    "included": true,
    "collapsible": false,
    "defaultOpen": false
  },
  "customContext": {
    "rules": [
      {
        "scope": ["src/**/*.py"],
        "rule": "Specific coding rule to enforce"
      }
    ],
    "files": [
      {
        "scope": ["*.md"],
        "path": "docs/style-guide.md",
        "description": "Style guide reference"
      }
    ],
    "other": [
      {
        "scope": ["*.ts", "*.js"],
        "content": "Custom instruction or context"
      }
    ]
  }
}
```

### [​](#configuration-parameters) Configuration Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `labels` | array | Labels that will trigger a Greptile review when added to a PR. In the example above, adding “feature” or “bug” label will trigger a review. |
| `commentTypes` | array | Types of comments Greptile should make. Options: “logic” (business logic issues), “syntax” (language-specific best practices), “style” (formatting, naming conventions). All enabled by default. |
| `instructions` | string | Natural language custom instructions for Greptile to follow when reviewing code. Can reference files in your repo or contain specific rules. |
| `ignoreKeywords` | string | Newline-separated list of keywords. PRs with these keywords in their title or description will be ignored. |
| `ignorePatterns` | string | Newline-separated list of file patterns to ignore, following .gitignore syntax. Files matching these patterns will not be reviewed. |
| `patternRepositories` | array | List of repositories to learn patterns from. Greptile will analyze these repos to understand your codebase’s patterns. |
| `triggerOnUpdates` | boolean | If true, Greptile will review code every time a PR is updated with a new commit. |
| `triggerOnDrafts` | boolean | If true, review draft PRs. Default is false. |
| `shouldUpdateDescription` | boolean | If true, Greptile will update the PR description with a summary of changes. If false, posts the summary as a review comment instead. |
| `disabledLabels` | array | PRs with these labels will not be reviewed by Greptile, even if other trigger conditions are met. |
| `includeAuthors` | array | Only PRs from these authors will be reviewed. If empty, reviews PRs from all authors (except excluded ones). |
| `excludeAuthors` | array | PRs from these authors will not be reviewed, even if other trigger conditions are met. |
| `strictness` | number | Severity threshold for Greptile comments (1-3). 1 = comment on all issues, 2 = moderate filtering, 3 = only most critical issues. Defaults to 2. |
| `fixWithAI` | boolean | If true, adds AI fix prompts to code review comments to help AI tools understand how to fix the issues. |
| `includeKeywords` | string | Newline-separated list of keywords. Only PRs containing these keywords in their title or description will be reviewed. |
| `includeBranches` | array | Only PRs targeting these branches will be reviewed. If empty, reviews PRs to all branches (except excluded ones). |
| `excludeBranches` | array | PRs targeting these branches will not be reviewed, even if other trigger conditions are met. |
| `statusCheck` | boolean | If true, creates a GitHub status check for each PR review. GitHub only. |
| `statusCommentsEnabled` | boolean | If true, enables status comments on PRs. |
| `skipReview` | string | Controls automatic code review behavior. When set to `AUTOMATIC`, skips reviews triggered automatically but still allows intentional triggers like @-mentions. Gives you manual control over when reviews run. |
| `summarySection` | object | Controls PR summary section. Properties: included (boolean), collapsible (boolean), defaultOpen (boolean). |
| `issuesTableSection` | object | Controls issues table section. Properties: included (boolean), collapsible (boolean), defaultOpen (boolean). |
| `confidenceScoreSection` | object | Controls confidence score section. Properties: included (boolean), collapsible (boolean), defaultOpen (boolean). |
| `sequenceDiagramSection` | object | Controls sequence diagram section. Properties: included (boolean), collapsible (boolean), defaultOpen (boolean). |
| `customContext` | object | Advanced context configuration with three arrays: other, rules, and files. Each supports optional scope and file pattern matching. |

`labels`, `disabledLabels`, `includeAuthors`, `excludeAuthors`, `includeBranches`, and `excludeBranches` accept glob patterns mixed with literals: `*`, `**`, `?`, and `{a,b}` brace expansion. Matching is case-insensitive. `[`, `]`, and leading `!` are literal — so `dependabot[bot]` works as-is; negation is not supported.

```
{
  "excludeBranches": ["dependabot/**"],
  "disabledLabels": ["wip-*"],
  "excludeAuthors": ["*-bot", "dependabot[bot]"]
}
```

## [​](#comment-types-explained) Comment Types Explained

### [​](#available-comment-types) Available Comment Types

- **`logic`** - Business logic issues, algorithmic problems, potential bugs
- **`syntax`** - Language-specific best practices, proper usage patterns
- **`style`** - Code formatting, naming conventions, structural consistency

All comment types are **enabled by default**. You can restrict reviews to specific types by setting `commentTypes` to a subset.

### [​](#example-configurations) Example Configurations

```
// Only check for logic issues (most critical)
{
  "commentTypes": ["logic"]
}

// Focus on code quality without style nitpicks
{
  "commentTypes": ["logic", "syntax"]
}
```

## [​](#custom-context-explained) Custom Context Explained

The `customContext` field allows you to provide additional context to help Greptile make more informed
code review decisions. It supports three types of context, each with optional scope targeting:

### [​](#custom-context-types) Custom Context Types

**`rules`** - Specific coding rules to enforce

- Define custom coding standards, best practices, or project-specific requirements
- More specific than general instructions, focused on enforceable coding practices

**`files`** - Reference existing documentation files

- Point Greptile to existing documentation, style guides, or reference files in your repository
- Includes a `path` field to specify the file location and optional `description` for context

**`other`** - General instructions or context

- Provide additional background information about your codebase, team practices, or specific
  requirements
- Use for high-level guidance that doesn’t fit into rules or file references

### [​](#scope-targeting) Scope Targeting

Each context item supports an optional `scope` array that uses glob patterns to target specific files:

```
"scope": ["*.ts", "*.js"]        // Apply to TypeScript and JavaScript files
"scope": ["src/**/*.py"]         // Apply to Python files in src directory
"scope": ["tests/**/*"]          // Apply to all files in tests directory
"scope": ["*.md", "docs/**/*"]   // Apply to markdown files and docs folder
```

If no scope is specified, the context applies to all files in the review.

⌘I
