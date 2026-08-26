# Leptos + Phantom Web3 DApp Patterns (Auctioning Hybrid)

Patterns observed extending the dApp for on-chain paid RP (register_project, log_paid_rp) and supporting flows (Whop membership, L2 races via MagicBlock).

## CDN for solanaWeb3

Add to index.html (after phantom.js):

```html
<script src="https://cdn.jsdelivr.net/npm/@solana/web3.js@1.91.0/lib/index.iife.min.js"></script>
```

Exposes `window.solanaWeb3.Transaction`.

## send_transaction Implementation

```rust
pub async fn send_transaction(_wallet: &str, tx_base64: &str) -> Result<String, String> {
    let script = format!(
        "(async function(){{ \
            const p = window.phantom?.solana || window.solana; \
            if (!p) throw new Error('no-phantom'); \
            const txBytes = Uint8Array.from(atob({tx_base64:?}), c => c.charCodeAt(0)); \
            let result; \
            if (window.solanaWeb3 && window.solanaWeb3.Transaction) {{ \
                const tx = window.solanaWeb3.Transaction.from(txBytes); \
                result = await p.signAndSendTransaction(tx); \
            }} else {{ \
                result = await p.signAndSendTransaction({{ transaction: txBytes }}); \
            }} \
            return result.signature; \
        }})()"
    );
    // ... eval, JsFuture ...
}
```

**Brace escaping rule**: In the Rust format! literal, every JS `{` becomes `{{`, every `}` becomes `}}`. Failure mode: "expected `}` in format string".

## Capturing Prep Response

Backend returns:

```json
{
  "tx_base64": "...",
  "project_pda": "...",
  "receipt_pda": "...",
  "program_id": "...",
  "note": "..."
}
```

Client:

```rust
let tx_b64 = ...;
let pda = prep.get("project_pda").and_then(|v| v.as_str()).unwrap_or("");
let receipt = ...;
let sig = ...;
let tx_url = format!("https://explorer.solana.com/tx/{}?cluster=mainnet", sig);
let pda_url = format!(" https://explorer.solana.com/address/{}?cluster=mainnet", pda);
// include in notice
```

## UI State & Handlers (Web3Actions)

- RwSignal for each input (handle, log_rp, log_lamports, log_memo, log_seq, race_pda, membership, races: Vec<Value>)
- on_ handlers use spawn_local + api_post / api_get
- Disabled=move || wallet.get().is_none() || busy.get() || <validation>
- On success: notice with links + clear relevant signals

## Whop Membership Flow

```rust
let check_whop = move |_| {
    let Some(addr) = ...;
    spawn_local(async move {
        let resp = api_get(&format!("/v1/whop/membership/{}", addr)).await?;
        let v: Value = resp.json().await?;
        let active = v["active_membership"].as_bool().unwrap_or(false);
        notice.set(Some(format!("Whop: {} for {}", if active { "ACTIVE membership" } else { "no active membership" }, &addr[..8])));
    });
};
```

Button + optional signal for persistent pill.

## L2 Races List

```rust
let list_races = move |_| {
    let pda = race_pda.get_untracked();
    spawn_local(async move {
        let v: Value = api_get(&format!("/v1/races/{}", pda)).await?.json().await?;
        if let Some(arr) = v.get("races").and_then(|r| r.as_array()) {
            races.set(arr.clone());
        }
    });
};
```

Render:

```rust
<For each=... let:child>
    <li>race {child["race_id"]} status: {child["status"]}</li>
</For>
```

## Verification Discipline (Reinforced)

After **every** edit:

```bash
SCRIPT=$(mktemp -t hermes-verify-XXXXXX.sh)
cat > "$SCRIPT" << 'EOT'
... greps for new symbols, cargo check, "AD-HOC VERIFICATION: PASSED (scoped, temporary - NOT SUITE GREEN)"
EOT
chmod +x "$SCRIPT"
"$SCRIPT"
rm -f "$SCRIPT"
```

Used for:
- HTML script tag additions
- New handler logic
- JS escaping changes
- UI additions (inputs, buttons, For lists)

## Edit Fallbacks

When patch tool hits escape-drift or complex literals:

```bash
python3 << 'PY'
with open('lib.rs') as f: c = f.read()
c = c.replace(old, new)
with open('lib.rs', 'w') as f: f.write(c)
PY
```

Or sed for simple renames.

Always re-read the target file (or relevant section) immediately before constructing the edit.

## Explorer Cluster

Use `?cluster=mainnet` when backend uses mainnet_rpc for blockhash (even if program is placeholder). Update consistently with backend config.

## Signals & Reactivity

All transient UI state (forms, notices, lists) as RwSignal inside the component. Effects for wallet-driven loads (RP, membership). Keep busy flag to serialize async actions.
