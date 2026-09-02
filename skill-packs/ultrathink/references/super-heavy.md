# Super Heavy mapping (planning roles only)

Grok Super Heavy is the harness. This skill is a document the harness loads.
Super Heavy cannot host omp.extensions and cannot intercept OMP input hooks.
OMP plugin link remains the turn-rewriting runtime when Ove is inside omp.

## Node to specialist (fan-out depth 1)

| kind | default owner |
|---|---|
| understand | Grok |
| decompose | NexusKube when cluster / runtime / CI / disruption; Grok otherwise |
| generate | AethirForge when contracts / tokens / standards; NexusKube when topology |
| compare | same owner as the options being compared |
| critique | SentinelSec when trust / supply-chain / secrets / admission; AethirForge when invariant / storage / reentrancy |
| refine | owner of the surface being refined |
| aggregate | owner of the merged surface |
| synthesize | Grok |

## Hard rules

- Node owners MUST NOT invoke ultrathink.
- If PI_ULTRATHINK_CHILD=1 or PI_AIO_CHILD=1, skip Stages 1-3.
- Do not fetch or execute plugin TypeScript.
- Do not treat four agents as four security tenants.
- Visual Mermaid is output-only and must not trigger another planner call.
- kubectl apply/delete/scale, force-push to main, and secret commits stay approval-gated.

## WEB3 extras (inject into CONSTRAINTS, never as new kinds)

When the request is contracts, tokens, or cluster-hosted chain infra, add these to CONSTRAINTS / PLATFORM_CONSTRAINTS / SECURITY_AND_VALIDATION:

- Do not invent addresses, ABIs, selectors, chain IDs, RPC URLs, or token decimals
- No privileged pods. No hostPath for key material
- NetworkPolicy default-deny egress except declared oracles/RPC
- PVC for indexer or chain-data state. No EmptyDir for canonical chain data
- Events indexable. No anonymous events for value or state changes
- Upgradeable storage layout documented. No slot collisions. OZ UUPS/Transparent only when upgradeability is justified
- Reject tx.origin, unbounded loops, and missing access control
- Keys stay off-chain with VaultCipher. Contracts see only addresses and roles
