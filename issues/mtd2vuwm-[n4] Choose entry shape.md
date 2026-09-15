# [n4] Choose entry shape
## Node
`n4` · compare · deps: n3

## Question
If Greptile offers multiple official transports, should the agent prefer Relume's remote http pattern only when Greptile publishes an equivalent remote MCP, otherwise the documented default; and should the server key be greptile (lowercase name-only) unless OMP docs require another canonical id, never copying Relume's URL or OAuth metadata?

## Chain of Thought
Yes. Decision rule for the agent:

    - Server key: `greptile` unless a live OMP recipe/docs file names a different canonical id. Name-addressable only; do not invent `greptile-mcp` or copy Relume’s key.
    - Transport: if n3 quotes a published remote MCP (Streamable HTTP or SSE), write that exact URL with OMP’s matching `type` (`http` if Relume-equivalent remote HTTP; SSE only if docs say SSE). If both remote and stdio are official, pick remote HTTP to match Relume. If only stdio is published, use that documented `command`+`args` (and only documented `env`). If n3 finds neither, write nothing.
    - Shape: reuse Relume as a key template only (`type`/`url` vs `command`/`args`), never Relume’s URL, OAuth metadata, or headers. Include `headers`/`auth`/`env` only when Greptile/OMP docs name them. Unique key; leave Relume byte-for-semantic-equivalence.

    After this pass the coding agent should: read `~/.omp/agent/mcp.json` (or the canonical path n2 finds) and the OMP MCP skill for exact keys; quote Greptile’s published URL or command from n3; draft the greptile object in memory only — do not write the file until n5/n7.

parent: mtd2vuwi

<!-- aio-id: add-the-greptile-mcp-into-this-o-5cf338ed/n4 -->
## Links
- tissue: mtd2vuwm
- github: https://github.com/swcstudiospace/plugin
- repo: swcstudiospace/plugin
