# Graph-based Codebase Context

Source: https://www.greptile.com/docs/how-greptile-works/graph-based-codebase-context

Greptile builds a complete graph of your codebase to understand how code changes affect other parts of your system, enabling context-aware code reviews that catch issues traditional tools miss.

## [​](#why-codebase-context-matters) Why Codebase Context Matters

Most code review tools analyze files in isolation, missing critical relationships:
**Without Context:**

```
// Reviewing this function alone
function updateUserEmail(userId: string, email: string) {
  return db.users.update(userId, { email });
}
// ❌ Misses: validation patterns, error handling, related functions
```

**With Context:**

```
// Greptile sees the bigger picture
function updateUserEmail(userId: string, email: string) {
  return db.users.update(userId, { email });
  // ✅ Notices: other update functions validate input
  // ✅ Notices: similar functions handle errors
  // ✅ Notices: email updates trigger notifications elsewhere
}
```

## [​](#codebase-indexing) Codebase Indexing

When you sign up, Greptile builds a complete graph of your repository containing every code element:

**Legend:** 🔵 Files • 🟢 Functions • 🟡 External calls/variables

### [​](#indexing-process) Indexing Process

1

Repository Scanning

Parses every file to extract directories, files, functions, classes, variables

2

Relationship Mapping

Connects all elements: function calls, imports, dependencies, variable usage

3

Graph Storage

Stores the complete graph for instant querying during code reviews

## [​](#how-greptile-analyzes-functions) How Greptile Analyzes Functions

When reviewing a changed function `foo(x)`, Greptile queries the graph to understand:

### [​](#1-function-dependencies) 1. Function Dependencies

### [​](#2-function-usage) 2. Function Usage

```
// Greptile finds everywhere foo() is called
function foo(x: string) {
  return processData(x);
}

// Usage sites discovered:
// ✅ components/UserForm.tsx:45
// ✅ services/DataService.ts:12
// ✅ tests/integration.test.ts:78
// → Impact analysis: changes will affect 3 files
```

### [​](#3-pattern-consistency) 3. Pattern Consistency

```
// When reviewing this SQL function:
function getUserById(id: string) {
  return db.query('SELECT * FROM users WHERE id = $1', [id]);
}

// Greptile checks other SQL functions:
// ✅ getUserByEmail() - uses parameterized queries ✓
// ❌ getOrderById() - uses string concatenation ⚠️
// → Suggests: "Use parameterized queries like other DB functions"
```

### [​](#real-time-graph-queries) Real-time Graph Queries

Every time a file is reviewed, Greptile queries the pre-built graph:

```
// When reviewing this change:
function updateUserProfile(userId: string, data: UserData) {
  // New code being reviewed
}

// Greptile instantly knows:
// 📍 Import dependencies: UserData interface, validation utils
// 📍 Function calls: database.update(), validateUserData()
// 📍 Callers: ProfileController.update(), AdminPanel.updateUser()
// 📍 Similar patterns: updateUserEmail(), updateUserSettings()
```

## [​](#why-this-approach-works) Why This Approach Works

## Complete Context

Reviews consider the entire codebase, not just changed files

## Pattern Recognition

Finds inconsistencies and suggests improvements based on existing code

## Impact Analysis

Identifies all code that could be affected by changes

The graph-based approach transforms code review from isolated file analysis into comprehensive system understanding, catching issues that would otherwise slip through traditional reviews.

⌘I
