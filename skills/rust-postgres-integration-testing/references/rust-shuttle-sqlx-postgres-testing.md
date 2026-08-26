# Rust + Shuttle + Sqlx + Postgres Integration Testing Patterns

Durable techniques observed while implementing and verifying a dual-source RP ledger (paid + free_weekly + bonus + event_multiplier), FIFO lots with expiry, atomic allocations to projects, idempotent seeding by stable_id, cache reconciliation, and event audit trail.

## Version Compatibility Trap
Shuttle 0.57 (`shuttle-shared-db`) only provides `IntoResource<sqlx::PgPool>` for sqlx 0.8. Using sqlx 0.9 (even if the rest of the workspace wants it) produces:

```
the trait `IntoResource<Pool<sqlx::Postgres>>` is not satisfied
```

**Fix**: Pin explicitly in the Shuttle crate's Cargo.toml and document why:

```toml
sqlx = { version = "0.8", features = ["runtime-tokio", "tls-rustls", "postgres", "chrono", "uuid", "macros"] }
```

## Schema Reset for Repeatable Tests
`sqlx::migrate!()` records applied versions in `_sqlx_migrations`. To get a pristine DB every run:

```rust
sqlx::query("DROP SCHEMA IF EXISTS public CASCADE;").execute(&pool).await?;
sqlx::query("CREATE SCHEMA public;").execute(&pool).await?;
sqlx::migrate!("./migrations").run(&pool).await?;
```

**Separate statements are mandatory.** A single multi-statement query fails with "cannot insert multiple commands into a prepared statement".

## Private Modules in Integration Test Crates
`include!("../src/ledger.rs");` inside a test crate fails on `//!` inner documentation comments.

Standard workaround:
1. Create `tests/inc/`.
2. Pre-process:
   ```sh
   sed -e 's|^//!|    //|' src/ledger.rs > tests/inc/ledger.rs
   ```
3. In the test:
   ```rust
   include!("inc/ledger.rs");
   ```
4. Re-export the items you need so the test body looks normal.

Maintain the copies with a small checked-in generator script and invoke it before test runs that need the spliced sources.

## Testing Expiry / CHECK (expires_at > granted_at)
`grant_free_lot` always uses `DEFAULT now()` for `granted_at`. You cannot pass an already-expired `expires_at` without violating the table CHECK.

For expiry sweep / audit tests:
- `INSERT` the lot row directly using past timestamps that still satisfy the relative CHECK.
- `INSERT` a matching `ledger_events` row if your test asserts on sources or provenance.
- Manually `UPDATE wallets SET free_rp = free_rp + 25` so the "before" snapshot matches what the test expects.
- Call `expire_due_lots()`, then assert cache drop, `remaining=0` on the lot, and an 'expire' event was written.

## Use Derived Handles, Not the Import Keys
Seeding code often inserts by `stable_id`. The persisted `handle` is the result of sanitization (rsplit on ':', lower, keep alphanum-_, cap length, pad if short).

All API calls and assertions (`allocate_to_project`, `get_project`, rank checks, `allocations_for`) must use the handle ("alpha"), never the stable_id or a hand-crafted "it-alpha".

Failing this produces:
- "no such project"
- Wrong `total_rp`
- Rank order assertions that flip

Always look up or hard-code the expected handle after an import step in the test.

## Re-Read Before Edit (Concurrent Edit Environments)
When the repo may be touched by parallel agents, handoff continuations, or other processes:

Read the file (full or relevant section) with the exact current contents *immediately before* constructing a patch or write_file.

Stale reads are the dominant source of lost/duplicated changes in these sessions.

## Wallet / Base58 Test Data
Projects and users use Solana-style base58 addresses. The loose validator rejects 0, O, I, l (both cases).

When synthesizing test wallets:
```rust
let w = format!("9xQe...{suffix}");
let w: String = w.chars().map(|c| match c {
    '0'|'O'|'o'|'I'|'i'|'l'|'L' => '1',
    c if c.is_ascii_alphanumeric() => c,
    _ => 'a',
}).collect();
if w.len() > 44 { w.truncate(44); }
```

## General Advice
- After every allocation/spend/claim/expire, assert the function return *and* re-query the affected tables.
- Keep the generator script and the inc/ copies under version control for the project.
- Comment every non-obvious pin or workaround in the code that future readers (or agents) will hit.

These patterns allow a single integration test to exercise the entire dual-source RP model, FIFO expiry, provenance, and ranking logic reliably.