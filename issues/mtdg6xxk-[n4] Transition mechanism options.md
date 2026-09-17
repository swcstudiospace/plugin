# [n4] Transition mechanism options
## Node
`n4` · compare · deps: n2,n3

## Question
Given the existing tracker only, should the agent use a first-class bulk move/status-update API if it exists, otherwise sequential per-item transitions with success/failure capture, always placing cards via default Done ordering on the same board, never rewriting board JSON by hand, never creating columns, and never fabricating required Done fields (resolution, comment, estimate) if the tracker rejects the transition?

## Chain of Thought
Use the existing tracker’s first-class same-board move/status API only. Preference order: (1) native bulk transition of the frozen 47-ID set to the exact Done label, default Done column order (end/last unless the board already defines position); (2) if no safe bulk, sequential per-ID transitions with success/failure/skip capture, closed set only. Never rewrite board JSON, never create/rename columns, never recreate cards, never invent resolution/comment/estimate when Done validation rejects.

    Working assumption: tracker unknown until n2 client inventory; choose A vs B from that client’s real methods (issue transition, card move, bulk update), not a guessed product. If bulk cannot guarantee identity-preserving status-only change or would bypass workflow, fall back to sequential. Mid-run non-Ready IDs are skips, not retries with fabricated fields. After this pass the coding agent should list the authenticated client’s candidate APIs (bulk vs per-item) and which one matches these rules—no move/update calls yet.

parent: mtdg6xxg

<!-- aio-id: please-move-all-of-our-ready-s-4-fc7638f8/n4 -->
## Links
- tissue: mtdg6xxk
- github: https://github.com/swcstudiospace/plugin
- repo: swcstudiospace/plugin
