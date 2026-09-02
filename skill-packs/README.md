# skill-packs

Portable Grok / Hermes / Super Heavy skill documents.

This directory is **not** the OMP Hermes import dump. `bun run import:hermes` writes to `skills/` and must not clobber these packs.

| Pack | What it is |
|---|---|
| `ultrathink/` | Prompt Uplift then Graph of Thought then per-node Chain of Thought. Same XML contract as `src/uplift` + `src/think`. |

Pin origin: `swcstudiospace/plugin` @ SHA in each pack's `references/SOURCE.lock`.
Never load `raw.githubusercontent.com/.../main/...` as an include.
