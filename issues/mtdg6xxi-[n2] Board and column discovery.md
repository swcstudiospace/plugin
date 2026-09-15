# [n2] Board and column discovery
## Node
`n2` · decompose · deps: n1

## Question
How should the agent discover the active team Kanban from the live workspace without inventing board IDs, project keys, API routes, file paths, or schemas: map column/status labels case-insensitively to Ready and Done, require disambiguation if multiple boards have Ready, include only items the shared Ready column currently shows, and stop if Ready or Done cannot be resolved uniquely on one board?

## Chain of Thought
Treat discovery as a read-only, no-write gate. Do not invent a tracker, board ID, project key, API route, or schema. After this pass the coding agent should: (1) inventory already-authenticated tracker clients/tools in the live session (CLIs, MCP, env-backed SDKs) and only then search the workspace for corroborating board references (config, docs, scripts)—never treat a guessed product name as fact; (2) list boards the current principal can access and collect each board’s live column/status labels; (3) case-insensitively match a column named Ready (user’s “Ready's”); (4) if zero Ready columns, or two-plus boards each have Ready, STOP and report candidates—do not merge boards or guess “the team Kanban”; (5) on the unique board, resolve Done from that board’s live labels only—if no unique Done (or only a lookalike like Closed/Complete without an actual Done), STOP; (6) query only items currently shown in that shared Ready column (exclude other columns, archived/hidden unless still Ready, and personal-view-only cards). Output of discovery must be: one board identity as returned by the tracker, exact Ready and Done label strings, and a statement that columns are uniquely resolved—or an abort with the ambiguous list. No mutations in this step.

parent: mtdg6xxg

<!-- aio-id: please-move-all-of-our-ready-s-4-fc7638f8/n2 -->
## Links
- tissue: mtdg6xxi
- github: https://github.com/swcstudiospace/plugin
- repo: swcstudiospace/plugin
