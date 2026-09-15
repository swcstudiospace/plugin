# [n6] Write, verify, report procedure
## Node
`n6` · refine · deps: n4,n5

## Question
What write-and-verify sequence meets acceptance: transition only preflighted Ready snapshot IDs; skip if no longer Ready; continue after per-item failures; re-query Ready and those IDs; report moved/skipped/failed with reasons, final Ready count, Done presence, and all identifiers; treat a later run with empty Ready as no-op zero moves; and name only live-discovered tracker checks (no invented files or routes) for the coding agent to use?

## Chain of Thought
Write only after PREFLIGHT_OK (unique board, unique Ready/Done labels, live Ready count == 47, permissions sufficient, no destructive Done automations). Freeze that snapshot as the closed ID set (id/key/url + title). Do not start a second Ready query as the write source.

    Write loop (bulk if the live client’s bulk transition is status-only, same-board, identity-preserving, and honors workflow; otherwise sequential):
    - For each frozen ID, re-read current status on that board. If not Ready → skip (reason: concurrent status change). If already Done → no-op, not a second move.
    - Else call the tracker’s issue/card transition or column-move for that ID to the exact live Done label; default position = end/last unless the board already defines Done ordering. Do not rewrite board JSON, recreate cards, or patch unrelated fields.
    - On workflow/permission/required-field rejection: record tracker error + missing fields; do not fabricate resolution/comment/estimate; continue remaining frozen IDs.
    - Rate limit: backoff and resume only remaining snapshot IDs. Mid-run arrivals to Ready are excluded.
    - Halt the whole write phase (zero further updates) only for TRACKER_UNAVAILABLE or if continuing would require disabling automations / escalating permissions.

    Verify (same board, same IDs): re-query Ready count and membership; re-query each snapshot ID’s status/column. Classify: moved (now Done, not Ready), skipped, failed. FULL_SUCCESS iff all 47 are Done and Ready count for that set is 0. Later run with empty Ready = EMPTY_READY no-op, zero moves.

    Report must list every snapshot identifier + title, per-item outcome and reason, final Ready count, Done presence for those IDs, and overall state (PREFLIGHT_BLOCKED / PARTIAL_SUCCESS / FULL_SUCCESS / EMPTY_READY). No secrets.

    Coding agent after this pass (no invented paths/routes): confirm n2 uniqueness + n3 N==47; list the authenticated client’s actual bulk vs per-item transition methods and Done-required fields/automations; then execute this closed-set write+re-query only. Do not call move/update until those checks pass.

parent: mtdg6xxg

<!-- aio-id: please-move-all-of-our-ready-s-4-fc7638f8/n6 -->
## Links
- tissue: mtdg6xxm
- github: https://github.com/swcstudiospace/plugin
- repo: swcstudiospace/plugin
