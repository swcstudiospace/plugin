# [n2] Discover config and schema
## Node
`n2` · decompose · deps: n1

## Question
Which files and docs should be read first on the machine: confirm whether ~/.omp/agent/mcp.json is the canonical user MCP path via OMP MCP wiring skill/docs; read current mcp.json contents; extract OMP's real server keys (type, url, command, args, env, headers, auth) from the Relume object and docs so the Greptile entry uses only observed schema, not a guessed superset?

## Chain of Thought
Read in this order; do not write yet.

    Path confirmation (stop if docs name a different single canonical file):
    - Search OMP MCP wiring skill/docs: `~/.omp/**` (especially `agent/`, `skills/`, `docs/`), plus any `*mcp*` skill/README on disk. Extract the documented user MCP path, reload/reauth commands, and server object schema.
    - If docs confirm `~/.omp/agent/mcp.json`, use only that. If they name another existing canonical path, use that instead and do not create a competing file.
    - Working assumption until docs contradict: `~/.omp/agent/mcp.json`.

    Live config + schema extraction:
    - `ls -l ~/.omp/agent/mcp.json` (mode, exists vs missing).
    - Read full JSON. Treat missing as create-later; present as merge-later.
    - From the Relume object, record the exact key set and values (prior: `"type": "http"`, `"url": "https://relume-library-mcp.relume.io/mcp"`). Note sibling keys if present: `command`, `args`, `env`, `headers`, `auth`, `name`.
    - Align that set to the skill/docs schema. Allowed Greptile fields later = intersection of observed Relume keys + documented keys. Do not add a guessed superset.
    - Capture top-level shape (`mcpServers` vs `servers` vs other) and existing server key names so `greptile` can be unique and name-only.

    Agent checks after this pass: parse JSON; list server keys; print Relume object keys (redact any secrets); record documented reload/reauth command names; confirm file mode 600 if present.

parent: mtd2vuwi

<!-- aio-id: add-the-greptile-mcp-into-this-o-5cf338ed/n2 -->
## Links
- tissue: mtd2vuwk
- github: https://github.com/swcstudiospace/plugin
- repo: swcstudiospace/plugin
