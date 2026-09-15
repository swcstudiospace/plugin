# [n6] Auth reload verify plan
## Node
`n6` · refine · deps: n4,n5

## Question
After an atomic temp-then-replace write and chmod 600 plus JSON parse check, which live OMP commands (from the MCP skill, historically /mcp reload and /mcp reauth greptile) should list both greptile and relume, probe handshake without treating CLI whoami as proof, keep a 401/OAuth outcome as valid with the exact user reauth command, and iterate discovery or revert only the greptile key on DNS/404/connection-refused?

## Chain of Thought
After n5’s write (temp → parse JSON → replace canonical mcp.json → chmod 600), verify commands from the live OMP MCP skill/docs on this machine (do not assume chat strings). Then:

    1. Reload with the documented MCP reload (historically `/mcp reload`). If this session cannot invoke it, still keep the file and print that exact command — do not claim servers are live.
    2. List configured servers by name only. Require both `greptile` and `relume`. Missing `relume` → restore from pre-write contents; never continue. Missing `greptile` → fix path/schema/reload, do not tell the user to “try again”.
    3. Probe Greptile only (initialize / OMP status / HTTP to the n3 URL — whichever the skill documents). Unknown-server = config/name failure. Do not use `greptile whoami` or plugin whoami as registration or auth proof.
    4. Auth: if signed-in identity or tools/list works, report AUTH_ALREADY_VALID for the MCP server. If 401/403 + OAuth metadata, keep the entry; run documented name-only reauth (historically `/mcp reauth greptile`) if this session can; if browser OAuth is required, stop and print that exact command plus what success looks like (list shows greptile; probe is not “unknown server”). Do not paste tokens into mcp.json or the terminal.
    5. Non-auth probe fail (DNS, connection refused, 404, wrong transport): do not leave a dead URL. Re-run n3 discovery; if still wrong, delete only the `greptile` key (atomic rewrite, Relume untouched). Invalid JSON after write: fix the file in this session.

    Agent should read: OMP MCP wiring skill/docs for reload/list/reauth/status verbs; `~/.omp/agent/mcp.json` (or n2 canonical path) post-write; n3’s published URL/command for the probe target. Do not reauth Relume unless it disappeared from the list.

parent: mtd2vuwi

<!-- aio-id: add-the-greptile-mcp-into-this-o-5cf338ed/n6 -->
## Links
- tissue: mtd2vuwo
- github: https://github.com/swcstudiospace/plugin
- repo: swcstudiospace/plugin
