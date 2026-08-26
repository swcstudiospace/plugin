# .greptile/ Configuration

Source: https://www.greptile.com/docs/code-review/greptile-config

Greptile’s review behavior has traditionally been configured through a single file called `greptile.json` at your repository root. It holds all your settings in one place — strictness, comment types, file ignore patterns, custom rules, context files — and Greptile reads it on every PR.
That works for a single repo with one team. But it doesn’t scale:

- **Monorepos with multiple teams** can’t express “strict about SQL injection in the database package, lenient about logging in scripts.” Everyone shares one file.
- **Ownership conflicts** happen when multiple teams need different review rules. They’re all editing the same `greptile.json`, and merge conflicts in config are not fun.
- **No visibility** into what rules actually apply to a specific file without mentally resolving the entire config.

The `.greptile/` folder is the recommended way to configure Greptile. It replaces the single-file approach with a folder you can place in **any directory** — not just the root. Each team owns their own config. Settings cascade from root to leaf, so child directories inherit from parents and override what they need to.

`greptile.json` is still supported for backwards compatibility. If both `.greptile/` and `greptile.json` exist in the same directory, `.greptile/` takes precedence and `greptile.json` is ignored. For the legacy format reference, see [greptile.json Reference](/docs/code-review/greptile-json-reference).

## [​](#the-folder-structure) The Folder Structure

A `.greptile/` folder contains up to three files:

```
.greptile/
├── config.json    # Review settings and structured rules
├── rules.md       # Rules written as plain markdown
└── files.json     # Existing files the reviewer should read for context
```

All three are optional. Include only what you need.
**config.json** holds your review settings — strictness, comment types, filters, output sections, ignore patterns — and structured rules. The settings use the same field names and types as `greptile.json`, so migrating is straightforward. On top of that, `config.json` adds fields that enable cascading: `disabledRules` to turn off inherited rules, and `id`, `severity`, and `enabled` on individual rules. See the [full schema](/docs/code-review/greptile-config-reference#config-json).
**rules.md** is plain markdown passed to the reviewer as context, scoped to the directory containing the `.greptile/` folder. No special syntax — write headings, lists, code blocks, whatever communicates your rules clearly. See [rules.md reference](/docs/code-review/greptile-config-reference#rules-md).
**files.json** points the reviewer to existing files in your repo — database schemas, API specs, architecture docs — so it has the context it needs for useful reviews. See [files.json reference](/docs/code-review/greptile-config-reference#files-json).

## [​](#cascading-configuration) Cascading Configuration

This is the core concept. When Greptile reviews a file, it walks from the repository root to the file’s directory, collecting every `.greptile/` folder along the way, and merges them together.
For a file at `packages/api/src/handler.ts`, Greptile collects:

```
/.greptile/                    → repo-wide defaults
/packages/.greptile/           → shared package settings (if it exists)
/packages/api/.greptile/       → API-specific overrides
```

Each level can override settings from its parent, add new rules, or disable inherited rules.

### [​](#how-settings-merge) How Settings Merge

When a child config sets something the parent already set, Greptile needs to decide which value wins. The short version: **settings are overridden, but rules and context are combined.**
**Settings the child overrides** — if the child specifies a value, it replaces the parent’s:

- `strictness`, `fileChangeLimit`, `skipReview`
- `commentTypes`, `labels`, `disabledLabels`, and other array fields (the child’s list replaces the parent’s entirely)
- Output sections like `summarySection` (the child’s fields are merged into the parent’s — a child setting `collapsible: false` won’t erase the parent’s `included: true`)

**Content that gets combined** — these accumulate across all levels, so nothing is lost:

- **Rules** from `config.json` and `rules.md` — parent rules + child rules all apply
- **File references** from `files.json` — parent files + child files are all included
- **Instructions** — parent and child instructions are concatenated together

This means a child directory automatically inherits all the rules and context from its parents. It only needs to specify what’s different — like a stricter `strictness` value or additional rules specific to that directory.

### [​](#disabling-inherited-rules) Disabling Inherited Rules

If a parent defines a rule you don’t want in a specific directory, the child can disable it by referencing its `id`.
The parent gives the rule an explicit `id`:

/.greptile/config.json

```
{
  "rules": [
    {
      "id": "no-console",
      "rule": "Do not use console.log in production code.",
      "severity": "medium"
    }
  ]
}
```

The child references that ID in `disabledRules`:

/packages/scripts/.greptile/config.json

```
{
  "disabledRules": ["no-console"]
}
```

Now `no-console` applies everywhere except under `packages/scripts/`. Rules without an `id` cannot be selectively disabled — if you think a rule might need to be turned off somewhere, give it an ID upfront.

## [​](#precedence) Precedence

Closest config wins for settings. Rules from every level still apply.

```
Dashboard settings              ← base defaults from the UI
─────────────────────────
Root .greptile/                 ← /.greptile/
Intermediate .greptile/         ← e.g., /packages/.greptile/
Most specific .greptile/        ← e.g., /packages/api/.greptile/
```

Dashboard rules apply along with file rules. A child config can turn one off with `disabledRules`.

## [​](#monorepo-example) Monorepo Example

A monorepo with shared root config and a stricter database package:

```
monorepo/
├── .greptile/
│   ├── config.json       → strictness: 2, triggerOnUpdates: true
│   ├── rules.md          → "No console.log", "Error handling required"
│   └── files.json        → [{ path: "docs/architecture.md" }]
│
├── packages/
│   ├── api/
│   │   └── .greptile/
│   │       └── rules.md  → "Validate all inputs with zod schemas"
│   │
│   └── db/
│       └── .greptile/
│           ├── config.json   → strictness: 1, disabledRules: ["no-console"]
│           ├── rules.md      → "Use parameterized queries", "Use $transaction for multi-table ops"
│           └── files.json    → [{ path: "prisma/schema.prisma" }]
```

**What `packages/db/src/users.ts` gets:**

- **strictness**: `1` — overridden by the db config (stricter than root)
- **triggerOnUpdates**: `true` — inherited from root (db doesn’t override it)
- **rules**: root rules + db rules, minus `no-console` (disabled by db)
- **files**: `docs/architecture.md` (root) + `prisma/schema.prisma` (db)

**What `packages/api/src/handler.ts` gets:**

- **strictness**: `2` — inherited from root (api has no override)
- **triggerOnUpdates**: `true` — inherited from root
- **rules**: root rules + api rules
- **files**: `docs/architecture.md` (root only)

File paths in `files.json` are relative to the directory containing the `.greptile/` folder. So `prisma/schema.prisma` declared in `packages/db/.greptile/files.json` resolves to `packages/db/prisma/schema.prisma`.

Each directory gets exactly the config it needs without duplicating shared settings.

When a PR touches files from different directories with different configs, each file is reviewed using its own resolved config. PR-level settings are merged across all applicable configs:

- **`strictness`**: uses the maximum value (`3` if any file has `3`)
- **`fileChangeLimit`**: uses the minimum value (most restrictive wins)
- **`commentTypes`**: union of all specified types
- **Output sections** (`summarySection`, etc.): shown if any config enables them
- **Boolean settings**: OR logic (enabled if any config enables it)
- **`skipReview`**: only skips if all applicable configs specify `"AUTOMATIC"`

## [​](#getting-started) Getting Started

1

Create the folder

Create `.greptile/` in your repository root (or any directory you want to configure).

2

Add config.json

Start with your review settings. If you have an existing `greptile.json`, you can copy it directly — the fields are the same.

.greptile/config.json

```
{
  "strictness": 2,
  "commentTypes": ["logic", "syntax"]
}
```

3

Add rules (optional)

Write your team’s review rules in `rules.md`:

.greptile/rules.md

```
## Error Handling

All async functions must use try-catch blocks.

## Naming Conventions

Use camelCase for variables and functions, PascalCase for classes and types.
```

Or as structured rules in `config.json` if you need scoping, severity, or disable-by-ID:

```
{
  "rules": [
    {
      "id": "no-raw-sql",
      "rule": "Use parameterized queries. Never interpolate user input into SQL.",
      "scope": ["src/db/**"],
      "severity": "high"
    }
  ]
}
```

4

Add context files (optional)

Point the reviewer to files it should reference:

.greptile/files.json

```
{
  "files": [
    { "path": "docs/architecture.md", "description": "System architecture overview" }
  ]
}
```

5

Commit and push

Commit the `.greptile/` folder. Your next PR uses the new config immediately — no reindexing required.

## [​](#what’s-next) What’s Next

## File Reference

Complete schema for config.json, rules.md, and files.json

## Custom Standards

Enforce team-specific coding standards

## Controlling Nitpickiness

Configure strictness and comment types

## greptile.json Reference

Legacy single-file format (still supported)

⌘I
