# [n7] Executable one-shot plan
## Node
`n7` · synthesize · deps: n1,n5,n6

## Question
What is the ordered execution plan the coding agent should follow: discover board/columns → snapshot Ready IDs/titles/count → halt unless count is 47 and Ready/Done unique → transition snapshot to Done via tracker-native move → re-query → emit completion report covering PREFLIGHT_OK/BLOCKED, FULL_SUCCESS, PARTIAL_SUCCESS, or EMPTY_READY, with no unrelated ticket edits or future automations?

## Chain of Thought
Ordered one-shot plan (no writes until gates pass; no new UI, no extra fields, no other columns):

    1. Discover (n2): In the live workspace, locate the team Kanban the user is already using. Map columns/statuses case-insensitively to Ready and Done. If 0 or &gt;1 boards with Ready, or Ready/Done not unique, stop: PREFLIGHT_BLOCKED, no writes. Do not invent board IDs, routes, or column names.

    2. Snapshot (n3): Query only the live Ready column on that board. Capture a frozen list of stable IDs (id/key/url) + titles. Count N. Preview the full ID list even if aborting. Exclude non-Ready, archived/hidden, other columns, and personal-view-only items.

    3. Preflight gates: Halt all writes if N ≠ 47, board/columns ambiguous, Done missing, tracker unavailable, principal cannot transition the set, Done would need fabricated resolution/comment/estimate, or Done automations would delete/archive extra/close related/move non-Ready work. State PREFLIGHT_BLOCKED + discrepancy; do not disable automations or escalate permissions.

    4. Write (closed set only): If PREFLIGHT_OK, transition only the frozen 47 IDs via the tracker’s native issue/card move or status transition (bulk only if it is status-only, same-board, identity-preserving). Per ID: re-read status; skip if no longer Ready; no-op if already Done; else move to the exact live Done label at default end/last position. On per-item rejection, record error + missing fields and continue remaining frozen IDs. Rate-limit: backoff, resume remaining snapshot IDs only. Do not rewrite board JSON, recreate cards, or patch unrelated fields.

    5. Verify: Re-query Ready membership/count and each snapshot ID’s column on the same board. Classify moved / skipped / failed. FULL_SUCCESS iff all 47 are Done and that set is absent from Ready. Repeat with empty Ready = EMPTY_READY, zero moves.

    6. Report: Every snapshot ID + title, per-item outcome/reason, final Ready count, Done presence, overall state (PREFLIGHT_BLOCKED | PARTIAL_SUCCESS | FULL_SUCCESS | EMPTY_READY). No secrets, no dummy Done values, no future automations.

    Coding agent after this pass: confirm unique board + Ready/Done labels and live Ready N==47; list the authenticated client’s actual bulk vs per-item transition methods and Done required fields/automations; only then run the closed-set write + re-query. Do not call move/update APIs until those checks pass.

parent: mtdg6xxg

<!-- aio-id: please-move-all-of-our-ready-s-4-fc7638f8/n7 -->
## Links
- tissue: mtdg6xxn
- github: https://github.com/swcstudiospace/plugin
- repo: swcstudiospace/plugin
