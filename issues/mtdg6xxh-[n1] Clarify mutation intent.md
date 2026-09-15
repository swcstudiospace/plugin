# [n1] Clarify mutation intent
## Node
`n1` · understand · deps: none

## Question
What exactly must the coding agent do and not do: a one-shot status/column move of current Ready cards to Done on the existing team Kanban (not a new bulk-move feature, not deletion/archive/recreate, not other columns), treating 47 as a live verification gate rather than a number to force, and preserving card identity, comments, attachments, assignees, labels, and history except tracker-native Done metadata?

## Chain of Thought
One-shot data mutation: on the team’s already-used Kanban only, move every item whose live status/column is Ready into the existing Done column/status using the tracker’s normal transition (not recreate, not archive, not delete). Preserve card IDs and all non-status fields (comments, attachments, assignees, labels, history); accept only tracker-native Done side effects (completed-at, activity log, default Done position). Treat 47 as a hard preflight gate—enumerate live Ready IDs+titles first; if count ≠ 47, board/columns are not unique, or permissions fail, write nothing. Do not touch other columns, WIP/config, or unrelated fields; do not invent a bulk-move product, dummy required Done values, or extra custom fields. After any writes, re-query and report moved/skipped/failed IDs plus final Ready count; a repeat after success must move zero items.

parent: mtdg6xxg

<!-- aio-id: please-move-all-of-our-ready-s-4-fc7638f8/n1 -->
## Links
- tissue: mtdg6xxh
- github: https://github.com/swcstudiospace/plugin
- repo: swcstudiospace/plugin
