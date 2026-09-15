# [n7] Execution plan for agent
## Node
`n7` · synthesize · deps: n1,n6

## Question
What is the ordered coding-agent plan: discover path/schema/Greptile transport from docs+live files; merge greptile into ~/.omp/agent/mcp.json (or the documented canonical path) preserving Relume byte-for-semantic-equivalence; atomic write, chmod 600, validate JSON; reload; verify MCP list/probe/auth (or print exact reload/reauth commands and do not claim signed-in if browser OAuth is required); stop without guessed endpoints if discovery fails?

## Chain of Thought
Ordered agent plan (do not skip discovery; do not invent URLs):

    1. Confirm the canonical MCP path from OMP MCP wiring skill/docs on this machine. Expected: `~/.omp/agent/mcp.json`. If docs name a different user file and it exists, use that one only — never write a second competing config. Read current contents first. Note Relume exactly: type `"http"`, url `https://relume-library-mcp.relume.io/mcp`, mode 600.

    2. Read OMP schema from that file + skill/docs: keys actually used (`type`, `url`, `command`, `args`, `env`, `headers`, `auth`). Record reload/list/reauth/status verbs as documented (historically `/mcp reload`, `/mcp reauth &lt;name&gt;`). Do not assume chat strings if the skill differs.

    3. Discover Greptile MCP transport from official Greptile MCP docs, OMP-known recipe, or a live probe of a published URL/command. Classify HTTP/SSE vs stdio. Use the published URL/command exactly; include only documented headers. Prefer remote HTTP matching Relume’s `http` pattern only if Greptile officially offers it; otherwise use Greptile’s documented default. If discovery fails closed: do not write greptile; leave Relume; report what was searched and what URL/command is still needed. Stop.

    4. Entry: key `"greptile"` (lowercase, name-only) unless docs require another canonical id. Mirror OMP keys observed in Relume + docs — do not copy Relume’s URL or OAuth onto Greptile. If a greptile key already exists, replace that object only.

    5. Merge: preserve every other server byte-for-semantic-equivalence. If file missing, create with Relume (prior known http entry) + discovered greptile. Atomic write: temp → `python`/`jq` JSON parse → replace canonical path → `chmod 600`. Abort the write if Relume would be destroyed. Never echo tokens.

    6. Reload with the documented command. If this session cannot invoke it, keep the file and print that exact command — do not claim servers are live.

    7. List by name only. Require both `greptile` and `relume`. Missing `relume` → restore pre-write contents and stop. Missing `greptile` → fix path/schema/reload in this session.

    8. Probe Greptile only (initialize / OMP status / HTTP to the discovered URL). Unknown-server = config failure. Do not use `greptile whoami` or plugin whoami as proof.

    9. Auth: tools/list or signed-in identity → AUTH_ALREADY_VALID for the MCP (not CLI). 401/403 + OAuth → keep entry; run documented `/mcp reauth greptile` if possible; if browser OAuth, print that exact command and success signals (list has greptile; probe is not unknown-server); do not claim signed-in. DNS/refused/404 → re-discover; if still wrong, delete only the `greptile` key (atomic rewrite). Invalid JSON → fix the file now.

    Agent should read after this pass: OMP MCP skill/docs; `~/.omp/agent/mcp.json` (or n2 path) before and after write; official Greptile MCP connection page. Out of scope: Relume OAuth, PRs, plugin lanes, extra MCPs, committing mcp.json.

parent: mtd2vuwi

<!-- aio-id: add-the-greptile-mcp-into-this-o-5cf338ed/n7 -->
## Links
- tissue: mtd2vuwp
- github: https://github.com/swcstudiospace/plugin
- repo: swcstudiospace/plugin
