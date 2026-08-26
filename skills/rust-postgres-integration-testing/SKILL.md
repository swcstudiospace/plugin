---
name: rust-postgres-integration-testing
description: "Use for Rust Postgres sqlx integration tests."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [rust, testing, postgres, sqlx, shuttle, integration-tests, ledger, migrations, debugging]
    related_skills: [test-driven-development, systematic-debugging]
---

# Rust + Postgres Integration Testing

## Overview

Stateful Rust backends (ledgers, reputation points with multiple sources, FIFO expiry lots, provenance-carrying allocations, idempotent seeding) only show correct behavior against a real database. Mocks hide migration ordering, CHECK constraints, cache reconciliation, and event audit details.

This skill captures the harness patterns, gotchas, and reliable workarounds that let you write fast, repeatable, deterministic integration tests for such systems.

## When to Use

- Implementing or modifying append-only ledgers, dual-source balances, expiring promos, or allocation provenance.
- Adding sqlx migrations that introduce new tables, CHECKs, or triggers.
- The feature involves time-based or ordering constraints (expiry, FIFO).
- Private crate modules must be exercised from a `--test` binary.
- The project uses Shuttle (or similar) and you hit framework + driver version skew.
- Concurrent edits (parallel agents, handoffs) are likely.

## Core Patterns

### 1. Version pinning for Shuttle + sqlx
Shuttle 0.57 `shuttle-shared-db` only implements the resource bridge for sqlx 0.8. sqlx 0.9 produces "IntoResource not satisfied" at the shuttle macro.

Pin and document:

```toml
# NOTE: pinned to sqlx 0.8 because shuttle-shared-db 0.57 implements its
# PgPool bridge against sqlx 0.8; mixing 0.9 here breaks the shuttle macro.
sqlx = { version = "0.8", features = ["runtime-tokio", "tls-rustls", "postgres", "chrono", "uuid", "macros"] }
```

### 2. Clean schema reset at start of every DB test
Use separate statements:

```rust
sqlx::query("DROP SCHEMA IF EXISTS public CASCADE;").execute(&pool).await?;
sqlx::query("CREATE SCHEMA public;").execute(&pool).await?;
sqlx::migrate!("./migrations").run(&pool).await?;
```

Multi-statement in one query fails with "cannot insert multiple commands into a prepared statement".

### 3. Private modules in --test binaries
`include!("../src/ledger.rs");` fails on `//!` docs.

Generate stripped copies in `tests/inc/` (sed `//!` → `//`), include the copies, re-export needed items.

Keep in sync with a generator script.

### 4. Testing CHECK constraints (e.g. expires_at > granted_at)
Grant paths set `granted_at = now()`. Cannot pass past expires_at.

For expiry tests: direct INSERT of lot with past timestamps that still satisfy relative CHECK, manual ledger_events row if needed for audit, manual wallet cache bump, then call expiry and assert side effects.

### 5. Use derived handles, not seed keys
After import by stable_id, use the sanitized `handle` for all subsequent calls and assertions.

### 6. Re-read before edit under concurrent changes
In handoff or parallel-agent environments, read the current file bytes immediately before any patch or write_file.

## Pitfalls

- Assuming test DB starts empty or at known migration state.
- Using stable_id where code expects sanitized handle.
- Trying to pass past expiry through normal grant path.
- Single-statement schema resets.
- Letting inc/ copies drift.
- Missing the sqlx pin with Shuttle.
- Writing tests after the code.
- Forgetting the `hermes-verify-*.sh` ad-hoc verification script requirement when the runtime demands fresh evidence for test or config changes.
- Relying exclusively on `patch` for complex test bodies (large literals or concurrent-edit drift); use `python3 << 'PY'` heredoc for reliable multi-line replaces, then verify.

## References

`references/rust-shuttle-sqlx-postgres-testing.md` — patterns, errors, script example, and Hermes agent ad-hoc verification + edit fallback techniques.

## Verification

Good test:
- Seeds via public import.
- Exercises every source.
- Crosses lots on allocate.
- Triggers expiry + audit.
- Asserts return values + DB state.
- Passes after full reset and on re-run.

See references for details and generator example.

## References

`references/rust-shuttle-sqlx-postgres-testing.md` — patterns, errors, script example.
