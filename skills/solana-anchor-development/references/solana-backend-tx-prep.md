# Backend Transaction Preparation for Client-Side Phantom Signing

Pattern used when extending Leptos dApp to drive real Anchor instructions (register_project, future log_paid_rp) without shipping heavy JS Anchor client or WASM solana-sdk.

## Backend Side (solana-sdk + reqwest)

- Compute discriminator once (sha256("global:register_project")[0:8] = 82 96 79 d8 b7 e1 f3 c0).
- Derive PDA on server: `Pubkey::find_program_address(&[b"project", owner.as_ref()], &program_id)`.
- Build Instruction with exact AccountMeta order from the Accounts struct (project writable, owner signer+writable, system readonly).
- Borsh data: disc + u32_le(len) + bytes.
- Fetch blockhash: POST JSON-RPC `getLatestBlockhash` with commitment, extract `result.value.blockhash`.
- `let mut tx = Transaction::new_with_payer(&[ix], Some(&owner)); tx.message.recent_blockhash = Hash::from_str(&bh)?;`
- `let bytes = bincode::serialize(&tx)?;`  // critical: not tx.serialize()
- `let b64 = general_purpose::STANDARD.encode(bytes);`
- Return struct with tx_base64 + pda + program_id.

## Client Side (Leptos)

```rust
let prep = api_post("/v1/onchain/prepare-register", &PrepReq { wallet: addr.clone(), handle }).await?...;
let tx_b64 = prep["tx_base64"].as_str().unwrap();
match Phantom::send_transaction(&addr, tx_b64).await { ... }
```

JS interop (inside eval or phantom.js facade):

```js
const txBytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
const result = await p.signAndSendTransaction({ transaction: txBytes });
return result.signature;
```

## Why This Shape

- Server has easy access to recent blockhash + full PDA logic + Anchor constants.
- Client only needs to sign and broadcast (keeps WASM small, reuses existing Phantom bridge).
- Works for any instruction; future log_paid_rp will follow identical prepare → sign → send.

## Pitfalls Observed

- serde conflict: `tx.serialize()` resolves to serde::Serialize in mixed-dep crates. bincode is reliable.
- Blockhash must be fresh; old one fails on send.
- PDA derivation must match program exactly (use the same seeds + program_id).
- For init instructions, the PDA account must be listed as writable but not signer (Anchor derives it).
- Base64 roundtrip: atob + Uint8Array must produce exact bytes the program expects.

## Verification

- Backend unit test that the produced ix has correct disc + data length.
- Integration: call prepare, decode, inspect accounts, send via test keypair or Phantom in browser.
- On success: use explorer or `solana confirm` to see the project account created with correct handle.
- Re-run prepare after send to confirm counter advanced (for race nonce etc.).

See the concrete `src/onchain.rs` and Leptos `Web3Actions` + `Phantom::send_transaction` in the auctioning repo for the live implementation.
