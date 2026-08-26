---
name: auctioning-hybrid-ledger
description: Postgres free RP, Anchor paid receipts, MagicBlock races.
version: 0.1.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [auctioning, solana, whop, phantom, magicblock]
    related_skills: [auctioning-news-flywheel, auctioning-race-card]
---

# Hybrid ledger (web3 + private)

Grok share 3 went deep into TON, then ZK/Halo2/Circom. Do not implement that. This repo is native Rust: paid provenance on-chain, free/promo and race math off-chain.

## When to Use

- Phantom, Whop, Anchor, MagicBlock, or unsigned-tx prep
- Dual-write paid RP (webhook + optional log_paid_rp)
- Changing PROGRAM_ID, PDAs, or Shuttle secrets

Don't use for: race names or narrative templates.

## Split of truth

| Concern | Store | Notes |
|---|---|---|
| Paid RP dollars | wallets.paid_rp + ledger_events source=paid | 1 USD = 1 RP |
| Paid provenance | Anchor RpReceipt | Payer signs; backend prepares unsigned tx |
| Free / weekly / bonus / multiplier | free_rp_lots FIFO, Monday 00:00 UTC | Never on-chain |
| Project catalog + allocations | Postgres | Ranks derived here |
| Live ticks | MagicBlock ER + er_ticks | Settle via settle_race |
| On-chain race PDA | Anchor Race | Max 16 results |

Backend never holds user keys. Flow: prepare-* then Phantom signAndSendTransaction.

Ignore from Grok chats: TON chain, Groth16, Halo2, Circom, SPL compression CPI, Next/Supabase as the app.

## Procedure

1. Paid Whop webhook: HMAC, credit_paid (idempotent tx_id). If a race card is active, extra EventMultiplier lot.
2. Optional public receipt: prepare-log-paid then Phantom. Receipt amount is paid RP only, not multiplier.
3. Register: prepare-register. Open/settle: prepare-open-race / prepare-settle-race.
4. sqlx stays 0.8. Integration tests reset schema with two statements.

Completion: paid dollar matches on-chain receipt; bonus pace exists only in lots.

## Pitfalls

- Multiplier RP in log_paid_rp (lies about dollars).
- sqlx 0.9 vs Shuttle 0.57.
- CORS still permissive.

## Verification

- Discriminators = sha256(global:ix) first 8 bytes
- PDA tests in programs/auctioning/tests/pda_contract.rs
- cargo test -p shuttle-auctioning and cargo test -p auctioning
