# [n2] Decompose preflight sequence
## Node
`n2` · decompose · deps: n1

## Question
In what order should the agent run preflight: (1) detect `greptile` on PATH, (2) capture CLI version only if the binary prints it, (3) run the CLI whoami/status equivalent, (4) note `GREPTILE_API_KEY` as set/unset without echoing the value, (5) query MCP/plugin signed-in if that status is available—and what should happen immediately if the CLI is missing?

## Chain of Thought
Run preflight in this order and stop at the first hard block:

    1. Detect `greptile` on PATH (`which greptile` / `command -v greptile`). If absent: state CLI_MISSING, login cannot proceed, do not invent install methods, do not run login or whoami. Optionally still note `GREPTILE_API_KEY` as set/unset (no value). End preflight.
    2. If present: capture version only if the binary prints it (`greptile --version` or equivalent). If that flag errors, ignore version and continue; do not invent flags.
    3. Run the CLI whoami/status equivalent. Record signed-in boolean, account, org only if printed. Treat command failure that is not clearly signed-out as AMBIGUOUS_STATUS (report stderr/exit, do not loop login).
    4. Note `GREPTILE_API_KEY` as set/unset only (never echo). This check does not require the CLI.
    5. Query MCP/plugin signed-in only if that status is already available from step 3 or another known query; otherwise report MCP status unknown. Do not invent MCP commands.

    Coding agent checks after this pass: PATH probe; version only if printed; whoami/status; env-key presence test; MCP signed-in iff queryable. No repo files to edit.

parent: mtd4rnms

<!-- aio-id: greptile-login-5cbafaae/n2 -->
## Links
- tissue: mtd4rnmu
