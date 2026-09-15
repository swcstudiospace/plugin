# [n5] Merge and write risks
## Node
`n5` · critique · deps: n2,n4

## Question
What write/merge hazards must be avoided: replacing Relume or resetting mcp.json to Greptile-only; duplicating vs updating an existing greptile key; non-atomic truncated JSON; mode not 600; secrets in world-readable files or shell history; writing a guessed URL if discovery fails closed; and which states apply (create with Relume+Greptile, merge-only, replace stale greptile object, abort write if Relume would be destroyed)?

## Chain of Thought
Abort any write that would drop or mutate Relume (or other existing servers). Read the canonical file first (n2 path only). Then:

    - CONFIG_MISSING: atomic create with prior Relume http entry + discovered greptile only.
    - CONFIG_PRESENT_NO_GREPTILE: merge-only — insert `greptile`, leave every other object byte-for-semantic-equivalence.
    - CONFIG_PRESENT_STALE_GREPTILE: replace the greptile object in place; do not add a second key (`greptile-mcp`, etc.).
    - Discovery fail closed (n3/n4: no published URL/command): write nothing; do not guess. PROBE_FAILS_NON_AUTH after a bad URL: iterate or delete only the greptile key.
    - Relume would be destroyed by rewrite: abort.

    Write hygiene: serialize valid JSON (no comments) to a temp file, parse-validate, then replace; `chmod 600`. Never echo tokens/headers into the shell. Unique name-only key `greptile`. If Relume object cannot be preserved verbatim in meaning, do not touch the file.

parent: mtd2vuwi

<!-- aio-id: add-the-greptile-mcp-into-this-o-5cf338ed/n5 -->
## Links
- tissue: mtd2vuwn
- github: https://github.com/swcstudiospace/plugin
- repo: swcstudiospace/plugin
