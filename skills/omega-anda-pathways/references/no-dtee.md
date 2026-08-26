# Anda dTEE is not a local workspace runtime

Do not invent a dTEE/TEE runtime for `/goal` agents or `aimee pod up`.

- People say “iclabs”; correct to **ldclabs**.
- **Live-verified 2026-08-23** against upstream (GitHub REST + raw files; Parallel
  web tools may 402 on credit — plain `curl` works):
  - `ldclabs/anda` = Rust agent framework (`anda_core`, `anda_engine`,
    `anda_engine_server`, `anda_web3_client`). `docs/architecture.md` states
    TEE/ICP are *implementation choices behind `Web3SDK`*, not mandatory layers.
  - `ldclabs/ic-tee` ("make TEEs work with the Internet Computer") is ICP-side;
    there is still **no public dTEE remote-connect API**.
  - `ldclabs/KIP` = Knowledge Interaction Protocol used by Anda memory tools;
    products: `anda-brain`, `anda-bot`.
  - Re-verify with:
    `curl -fsS https://raw.githubusercontent.com/ldclabs/anda/main/docs/architecture.md`
    then grep for tee/dtee — retires this note if they ship a connect API.
- In-tree memory path: Nexus `:8091` + pathways / KIP / eternal local receipts.
- Agent sandboxes are **DevPod pods** (`aimee pod`, skill `omega-loops-cli`).
  `pod doctor` must report dTEE missing.
- Do not stub a TEE crate or claim pods are confidential execution.

## Honest bridge pattern (shipped: Aimee `pod connect`, aimeecodes PR #5)

When asked to "connect via the Anda Engine", use probe + existing carrier:

1. Probe activity: `curl -fsS -m 2 $ANDA_NEXUS_URL` (default
   `http://127.0.0.1:8091`) → render `active (<url>)` / `inactive`.
2. Carry the session over the existing DevPod ssh transport
   (`aimee pod connect <workspace>`).
3. Copy states plainly that dTEE waits on upstream. Presence-only observability
   is by design, not a limitation to hide.
