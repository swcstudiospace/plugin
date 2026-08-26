---
name: solana-anchor-development
description: "Use for Solana Anchor programs in hybrid ledger + L2 setups."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos]
metadata:
  hermes:
    tags: [solana, anchor, rust, dapp, leptos, phantom, magicblock, receipts, races]
    related_skills: [rust-postgres-integration-testing, systematic-debugging]
---

# Solana Anchor Program Development (Hybrid Ledger + L2)

## Overview

Anchor programs that provide public immutable layer for selected flows (paid RP receipts, race settlements) while the bulk of state (free RP, promos, live ticks) lives in a private high-performance ledger.

## When to Use

- Any work in `/root/src/repos/auctioning` (auctioning.lol).
- Adding or modifying instructions like `log_paid_rp`, `register_project`, `open_race`, `settle_race`.
- Implementing client (Leptos/Phantom) flows that sign and send program instructions.
- Wiring MagicBlock ER for real-time sessions with mainnet settlement.
- Preparing mainnet deploy artifacts (Anchor.toml, program ID, initialize, authority).

Product intent (do not flatten into a static bid board): advertised **1 RP = $1**; events change *pace per dollar* not the dollar; **windowed races produce news** (overtake in a GP ≠ lifetime #1). See `references/auctioning-lol-product.md` and repo `AUCTIONING.md`.

## Core Patterns

### Pre-increment Counter for PDA Seeds

Capture the counter *before* mutating it; use that value both for the emitted PDA and the Accounts seed constraint.

Client fetches the account to learn the current counter before building the tx.

### Hybrid Accounting

Private ledger (typed `RpSource`, `free_rp_lots` FIFO, expiry, cache) is authoritative for balances and spends.

On-chain only for:
- Immutable paid receipts (`RpReceipt` PDA + event).
- Race opening and final results.

### Client Interop

Leptos WASM + raw JS for Phantom:
- connect → address
- sign + sendTransaction (base64 or constructed tx)

For complex PDAs, have backend return serialized ix data.

Note browser polyfill requirements for Buffer / web3 objects.

### Race Opening (L2)

For `open_race`:
- Client provides `current_race_nonce` (pre-bump value from on-chain Project.race_nonce or UI input).
- Backend derives race PDA as `["race", project_pda, nonce.to_le_bytes()]`.
- Ix has no args data (just discriminator); accounts: project(mut), race(init), payer(signer), system.
- DApp pattern: race_pda + nonce inputs in races section; "Open Race (Solana L2)" button calls `/v1/onchain/prepare-open-race`, then Phantom send.
- Success notice: "Race opened on L2! sig ..."

Client must supply the exact pre-increment nonce for PDA match.

### Race Settlement (L2)

Completes the race flow (open → live in ER → settle back to mainnet).

For `settle_race`:
- Requires `race_id` (from races list or known nonce).
- `results: Vec<RaceResult>` where `RaceResult { entrant: Pubkey, score: u64, rank: u16 }`.
- Backend must manually Borsh the vec: disc + u32(len) + (32-byte pubkey + u64_le + u16_le) * N.
- Accounts (from SettleRace): config (readonly, seeds=["config"]), race (mut, seeds=["race", project, race_id_le]), settler (signer, readonly).
- No system program.
- Authority check on-chain (race.authority || protocol.authority).
- Prep request includes the results (for UI demos, send sample vec using connected wallet as entrant + fixed score/rank).
- DApp pattern: extend races section with `settle_race_id` input + "Settle Race (on-chain)" button; handler builds sample results, posts `/v1/onchain/prepare-settle-race`, feeds tx_b64 to Phantom.
- Response includes race_pda for explorer link.
- Success notice: "Race settled on-chain! sig ..."

Use for committing final L2 results as immutable on-chain record.

Always match the exact serialization the program expects (test with small vec).

### Deployment

- Keep `declare_id!` and `Anchor.toml` [programs.*] in sync.
- One-time initialize with authority + fee vault.
- Document ER program IDs.
- Use KMS/multisig for prod authority.

## Config-Driven Program ID (Mainnet Readiness)

The backend no longer hardcodes the program ID in `onchain.rs`. Instead:

- `AppConfig` (from `config.rs`) loads `program_id` from `SecretStore.get("PROGRAM_ID")` (fallback to placeholder).
- All `prepare_*` functions parse `Pubkey::from_str(&cfg.program_id)?`.
- Pass the `program_id: Pubkey` into every `build_*_ix(...)` (register, log_paid, open_race, settle_race).
- PDA derivations and responses use the live value.
- `Prepare*Response` always includes the resolved `program_id` (dApp uses it for explorer links where applicable).
- The old `PROGRAM_ID_STR` const remains only as documented fallback/default.

This means:
- After real mainnet deploy, set `PROGRAM_ID` secret (and update `state.rs` + `Anchor.toml` to match).
- No code changes needed to switch devnet/mainnet/placeholder.
- Explorer links in dApp (via prep) and public ledger endpoint stay consistent with backend RPC.

Update all four build fns and their callers in `prepare_register_project`, `prepare_log_paid_rp`, `prepare_open_race`, `prepare_settle_race`.

In `serialize_race_results` and account lists for settle, use the passed program_id for consistency (config PDA etc.).

Pitfall: forgetting to thread `program_id` through a new build fn or response assembly leads to mixed IDs. Always derive responses from the parsed `program_id` var.

## Program ID in DApp Responses

Prep responses now reliably surface the configured ID:
```json
{ "program_id": "<from-cfg>", "project_pda": "...", "tx_base64": "...", ... }
```
DApp can (and should) use `prep.get("program_id")` for any address links or future IDL loading.

## Pitfalls

- Post-increment PDA seeds (derivation mismatch).
- Writing free RP on-chain.
- Committing keypairs.
- Assuming WASM send "just works".
- Drift between program and client PDA derivation logic.

## Verification

PDA tests, full flow integration (private + on-chain), client tx success, explorer verification.

In agent sessions use hermes-verify- scripts for changes.

## References

See target repo `programs/auctioning/Anchor.toml`, `DEPLOY.md`, `instructions.rs` (detailed comments on counter PDA), and Leptos Phantom/Web3Actions code for live examples.

- `references/leptos-phantom-dapp.md` — full Leptos + Phantom patterns, CDN, escaping, UI signals, Whop, races list, verify discipline.
- `references/solana-backend-tx-prep.md` — tx prep, Borsh, blockhash, bincode.
- `references/program-id-and-borsh-serialization.md` — config-driven program_id refactor, serialize_race_results helper, threading through builds, mainnet readiness.
- `references/dapp-ui-enhancements.md` — races list settle buttons, program-id explorer link, Leptos For clone gotcha.
- `references/auctioning-lol-product.md` — product north star: 1:1 sticker vs event pace, windowed vs lifetime news, AUCTIONING.md map.

### Leptos + Phantom Client DApp Patterns (Hybrid On-Chain)

- Add `<script src="https://cdn.jsdelivr.net/npm/@solana/web3.js@1.91.0/lib/index.iife.min.js">` in index.html after phantom.js to expose `window.solanaWeb3`.
- Update `Phantom::send_transaction` to:
  if (window.solanaWeb3 && window.solanaWeb3.Transaction) {
    const tx = window.solanaWeb3.Transaction.from(txBytes);
    result = await p.signAndSendTransaction(tx);
  } else {
    result = await p.signAndSendTransaction({ transaction: txBytes });
  }
- In Rust `format!` strings containing JS, double all braces: `{{` / `}}` for literal JS `{` / `}` (single triggers "expected `}` in format string").
- Always parse the full prep JSON (tx_base64 + project_pda + receipt_pda + program_id + note).
- On success, emit explorer links for tx (`/tx/{sig}?cluster=mainnet`) and accounts (`/address/{pda}`).
- Form state via RwSignal (handle, rp/lamports/memo/seq, race_pda, membership, races vec).
- Buttons: disabled guards on wallet/busy/invalid; clear state on success.
- Whop: button → api_get /v1/whop/membership/{wallet} → notice + signal.
- L2 Races: pda input + button → /v1/races/{pda} → <For> render of races (race_id, status).
- Re-read full file content immediately before every patch/write_file.
- For escaping-heavy or multi-line edits, use python3 << 'PY' heredoc (more reliable than patch in this env).
- After *every* edit (HTML, .rs, config), create `mktemp -t hermes-verify-XXXXXX.sh`, implement greps + cargo check, label "AD-HOC VERIFICATION: PASSED (scoped, temporary - NOT SUITE GREEN)", rm.

### Edit & Verification Discipline

This session reinforced: every behavior change gets an ad-hoc hermes-verify script. Use for HTML additions (CDN script), JS-in-Rust, new UI handlers, etc. The script is temporary evidence, not a permanent test.

## Pitfalls (updated)

- Post-increment PDA seeds (derivation mismatch).
- Writing free RP on-chain.
- Committing keypairs.
- Assuming WASM send "just works".
- Drift between program and client PDA derivation logic.
- Brace escaping in format! for JS code.
- Extracting prep fields but not using them (unused var warnings; use _ or integrate).
- Cluster mismatch in explorer links vs backend RPC.
- Only pulling tx_b64 (user gets no PDA visibility).
- Skipping re-read before edit in concurrent/handoff sessions.
- Using patch for everything; fall back to python heredoc for complex cases.
- Forgetting hermes-verify script after any edit (even small UI or script tag).

## Verification

PDA tests, full flow integration (private + on-chain), client tx success, explorer verification.

**Mandatory in agent sessions**: after any edit, produce hermes-verify- script (mktemp, checks, explicit ad-hoc label, cleanup).

See references for details.

