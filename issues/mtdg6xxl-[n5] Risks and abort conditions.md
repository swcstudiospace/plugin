# [n5] Risks and abort conditions
## Node
`n5` · critique · deps: n3,n4

## Question
Which conditions must halt writes or skip items rather than proceed: count mismatch, ambiguous board/column, missing Done, tracker unavailable, destructive board automations/sprint hooks, concurrent status no longer Ready, item-level workflow/permission rejections, rate limits (backoff remaining snapshot IDs only), and never impersonating users, disabling automations, or inventing dummy field values?

## Chain of Thought
Halt all writes (PREFLIGHT_BLOCKED / TRACKER_UNAVAILABLE): Ready count ≠ 47; board or Ready/Done labels not unique; Done missing; tracker/client unavailable; current principal cannot transition any snapshot ID; Done would require invented resolution/comment/estimate; automations/sprint/close hooks would delete, archive extra, close related work, or move non-Ready items—do not disable those automations, stop and report. Never impersonate, never escalate workflow/permission schemes.

    Skip item, continue remaining frozen IDs: status no longer Ready between snapshot and write; per-item workflow/permission rejection; required Done fields missing on that card (list fields, do not fabricate). Record reason; do not retry with dummy values.

    Rate limits: backoff and resume only remaining snapshot IDs; no second unscoped Ready sweep. Mid-run arrivals to Ready are excluded. Items already Done: no-op, not a second move.

    Coding agent next: confirm n2 uniqueness + n3 N==47; list Done-transition automations/hooks and any per-ID permission/required-field gaps; do not call move/update APIs this pass.

parent: mtdg6xxg

<!-- aio-id: please-move-all-of-our-ready-s-4-fc7638f8/n5 -->
## Links
- tissue: mtdg6xxl
- github: https://github.com/swcstudiospace/plugin
- repo: swcstudiospace/plugin
