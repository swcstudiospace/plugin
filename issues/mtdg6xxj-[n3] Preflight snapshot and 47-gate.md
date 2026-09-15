# [n3] Preflight snapshot and 47-gate
## Node
`n3` · generate · deps: n2

## Question
What preflight snapshot is required before any write: enumerate live Ready items with stable tracker identifiers plus titles, count them, abort all writes if count ≠ 47 or permissions are insufficient, keep the ID set closed so mid-run arrivals are excluded, and still preview the ID list in the report on abort?

## Chain of Thought
After n2 uniquely resolves one board plus exact Ready/Done labels (else skip writes and still print whatever Ready list was found): query only that board’s live shared Ready column. For each card record {stableId, title} using the tracker’s native identifier; do not invent keys. Count = N.

    Gate: if N ≠ 47, or any snapshot item cannot be transitioned to Done by the current principal, or Ready/Done are not unique → PREFLIGHT_BLOCKED, zero writes. Always include the full ID+title preview in the report (abort or proceed). If N = 47 and permissions hold → freeze that ID set as the closed write set (mid-run Ready arrivals excluded). Coding agent next: run the live Ready list+count against the n2 board; compare to 47; check transition permission per id; do not call any move/update API in this pass.

parent: mtdg6xxg

<!-- aio-id: please-move-all-of-our-ready-s-4-fc7638f8/n3 -->
## Links
- tissue: mtdg6xxj
- github: https://github.com/swcstudiospace/plugin
- repo: swcstudiospace/plugin
