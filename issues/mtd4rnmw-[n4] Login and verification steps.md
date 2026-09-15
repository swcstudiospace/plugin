# [n4] Login and verification steps
## Node
`n4` · generate · deps: n3

## Question
What exact later checks and commands should the coding agent use: `which greptile` or equivalent PATH probe, `greptile` help/status/whoami as actually printed by the binary (no invented flags), `greptile login` only when unsigned/invalid, one retry only for transient network/IdP failures, then a mandatory post-login whoami/status plus MCP/plugin auth-blocked check if queryable?

## Chain of Thought
Coding agent command sequence (run in this order; do not invent flags):

    1. PATH: `command -v greptile` (or `which greptile`). If empty → CLI_MISSING; stop. Do not guess installers.
    2. Presence-only env: test whether `GREPTILE_API_KEY` is set; report set/unset; never print or write the value.
    3. Discover verbs from the binary: `greptile --help` and/or `greptile help`. Capture version only if that output already prints it. From help, pick the printed identity/status command (likely `whoami` or `status`—use the name the binary shows, nothing else). If help fails, treat as AMBIGUOUS_STATUS (stderr + exit); do not login.
    4. Preflight identity: run that discovered whoami/status once. Also note MCP/plugin auth-blocked / `signedIn` only if that same command (or another help-listed status command) prints it. Fresh check required; ignore prior-turn account strings.
    5. Branch (n3): valid usable session → skip login. Unsigned/invalid + this host can open a browser and wait for Approve → run exactly `greptile login`. Unsigned/invalid + non-interactive host → do not start PKCE; tell the user to run `greptile login` locally. Ambiguous error → report and stop.
    6. Failures: browser not opened / no Approve → fail closed, keep prior session. CLI not found or unexpected exit → report stderr/exit. Network/IdP: one retry of `greptile login` only if the error looks transient; otherwise stop. Never construct keys or edit unknown config.
    7. Mandatory verification after login, skip, or user-terminal deferral (once they confirm they ran it): re-run the same whoami/status. Claim signed-in only if that output shows a usable identity. Re-check MCP/plugin auth-blocked if queryable; if not queryable, say MCP status unknown.
    8. Next agent checks: PATH probe, help dump, env-key presence, whoami/status twice around any login; no repo files, no `/greptile` slash command, no key writes.

parent: mtd4rnms

<!-- aio-id: greptile-login-5cbafaae/n4 -->
## Links
- tissue: mtd4rnmw
