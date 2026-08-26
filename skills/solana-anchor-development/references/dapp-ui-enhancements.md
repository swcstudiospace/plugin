# DApp UI Enhancements for L2 and Program Visibility (Recent Session)

## Interactive Races List

Made the <For> list of races from /v1/races/{pda} actionable.

Added per-race "Settle this" button:

```rust
<li>
    {let c = child.clone(); move || format!("race {} status: {}", c.get("race_id").and_then(|v| v.as_i64()).unwrap_or(0), c.get("status").and_then(|v| v.as_str()).unwrap_or("")) }
    <button on:click={
        let c = child.clone();
        move |_| {
            if let Some(rid) = c.get("race_id").and_then(|v| v.as_i64()) {
                settle_race_id.set(rid as u64);
            }
        }
    }>"Settle this"</button>
</li>
```

**Key Leptos gotcha fixed**: serde_json::Value moves into closures. Clone explicitly for each consuming closure (format! and on:click) to prevent "use of moved value" / "borrow of moved value".

Use `let c = child.clone();` before the move || for format, and another for the button handler.

The key= uses stable race id from DB.

This allows users to list races then immediately use one for settle without typing the id.

## Program ID Display + Explorer Link

Added `current_program_id: RwSignal<String>` .

Set from prep in *all* success paths (register, log_paid, open, settle):

```rust
let prog = prep.get("program_id").and_then(|v| v.as_str()).unwrap_or("").to_string();
current_program_id.set(prog.clone());
```

UI:

```rust
<Show when=move || !current_program_id.get().is_empty()>
    <p class="onchain-program">
        "On-chain Program: " {move || current_program_id.get()} 
        <a href=move || format!("https://explorer.solana.com/address/{}?cluster=mainnet", current_program_id.get()) target="_blank">
            "(view on explorer)"
        </a>
        " (set PROGRAM_ID secret for real mainnet deploy)"
    </p>
</Show>
```

Also included prog in the success notices for immediate feedback.

This makes the dApp always reflect the backend's configured program ID (from Secrets / env) after any on-chain tx prep.

## Tie-in to Mainnet Readiness

Reinforces that after real deploy:
- Update PROGRAM_ID secret (and state.rs + Anchor.toml)
- dApp and backend flows automatically use the real ID for PDAs, responses, explorer links.
- No code changes needed for ID switch.

## Verification

After these UI changes, ran hermes-verify script checking for the new strings ("Settle this", explorer link, current_program_id) + cargo check.

Always do this for dApp changes.

## Related Pitfalls Reinforced

- Leptos For + Value requires clones for multiple closures.
- Not propagating program_id from every prep response leaves UI stale.
- Explorer links must use the live program_id where relevant (here for the program account itself).
- UI list enhancements are "behavior changes" — require ad-hoc verify script.

See main SKILL.md for core patterns and other references for tx prep / program ID refactor.
