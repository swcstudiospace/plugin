# Config-Driven Program ID + Borsh Serialization for Race Results

## Program ID from Config

In `config.rs`:
```rust
program_id: store.get("PROGRAM_ID")
    .unwrap_or_else(|| "AuCT1oN1Ng...".to_string()),
```

In `onchain.rs` prepares (register, log_paid_rp, open_race, settle_race):

```rust
let program_id = Pubkey::from_str(&cfg.program_id)?;
// pass to build_*
let ix = build_xxx(..., program_id)?;
// use for all find_program_address
// responses: program_id: cfg.program_id.clone()
```

Update build_* signatures to accept `program_id: Pubkey` (remove internal `from_str(PROGRAM_ID_STR)`).

This decouples code from any specific ID. Deploy = set secret + sync Anchor files.

## Borsh for Vec<RaceResult> in settle_race

`RaceResult { entrant: Pubkey, score: u64, rank: u16 }`

Manual serialization (no Anchor in backend for ix data):

```rust
fn serialize_race_results(results: &[RaceResultInput]) -> Result<Vec<u8>> {
    let mut data = Vec::new();
    data.extend_from_slice(&(results.len() as u32).to_le_bytes());
    for r in results {
        let entrant = Pubkey::from_str(&r.entrant)?;
        data.extend_from_slice(entrant.as_ref());  // 32
        data.extend_from_slice(&r.score.to_le_bytes()); // 8
        data.extend_from_slice(&r.rank.to_le_bytes()); // 2
    }
    Ok(data)
}
```

Then in build:
```rust
let mut data = SETTLE_RACE_DISCRIMINATOR.to_vec();
data.extend_from_slice(&results_bytes);
```

Accounts for settle (no system):
- config (readonly, seeds=["config"])
- race (mut, seeds=["race", project, race_id_le])
- settler (signer)

## DApp Side (sample for demo)
```rust
let sample = vec![Res { entrant: addr.clone(), score: 100, rank: 0 }];
let req = SettleReq { ..., results: sample };
```

Always match exact layout the program expects (u32 len prefix + fixed-size items).

## Mainnet Readiness
- Set `PROGRAM_ID` secret to real deployed ID.
- Update `state.rs` declare_id! and `Anchor.toml` [programs.mainnet].
- Explorer links use `?cluster=mainnet` (consistent with backend mainnet_rpc).
- Responses now carry correct ID for client.

See onchain.rs changes for threading the var through all 4 flows.
