# [n3] Discover Greptile transport
## Node
`n3` · generate · deps: n2

## Question
Where must official Greptile MCP connection details be taken from (Greptile MCP docs, OMP-known Greptile recipe, live probe) to classify transport as Streamable HTTP, SSE, or stdio, and which exact published URL or documented command/args/headers/auth should be used without inventing a URL, npx package, or header schema?

## Chain of Thought
Do not write mcp.json yet. Take Greptile transport only from evidence, in this order:

    1. Local OMP recipe (highest trust for schema fit): search `~/.omp/**` (skills, docs, agent, README) and any `*mcp*` skill for greptile/MCP. Record any named server id, `type`/`url`/`command`/`args`/`env`/`headers`/`auth`. If a recipe exists, that is the entry shape — still confirm the URL/command against Greptile’s own docs before writing.
    2. Official Greptile MCP docs (source of URL/command): fetch/search greptile.com / docs.greptile.com / GitHub greptile org for “MCP” (cursor/claude/omp connect pages). Copy the published Streamable HTTP or SSE URL byte-for-byte, or the documented stdio `command`+`args` (and only documented headers/auth). Do not derive `npx @greptile/...` or `https://…/mcp` by analogy with Relume.
    3. Live local hints, not proof: if `greptile` CLI or plugin is installed, run help/`mcp` subcommands and config paths; treat output as a pointer to docs, not as OMP registration. Ignore `whoami` for this node.
    4. Probe only after a named endpoint/command exists: HTTP/SSE GET/initialize against that exact URL; stdio dry-run the documented binary. Classify: Streamable HTTP if docs say MCP HTTP + Relume-like remote; SSE if docs say SSE; stdio if only a local command is published. If both remote HTTP and stdio exist, pick remote HTTP to match Relume; otherwise Greptile’s documented default.
    5. Closed failure: if steps 1–3 yield no published URL and no documented command, do not invent an entry; hand the searched paths/pages to n5/n7.

    Agent checks after this pass: list files/hits from `~/.omp` greptile/mcp search; quote the doc paragraph with the URL or command/args; note auth scheme (OAuth vs token vs CLI reuse) without pasting secrets; state one of HTTP | SSE | stdio plus the exact string to merge.

parent: mtd2vuwi

<!-- aio-id: add-the-greptile-mcp-into-this-o-5cf338ed/n3 -->
## Links
- tissue: mtd2vuwl
- github: https://github.com/swcstudiospace/plugin
- repo: swcstudiospace/plugin
