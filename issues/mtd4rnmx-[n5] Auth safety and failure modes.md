# [n5] Auth safety and failure modes
## Node
`n5` · critique · deps: n3,n4

## Question
What risks would make a run invalid: claiming success from exit code 0 without whoami; faking PKCE in a headless environment; writing tokens/cookies/keys to repo files, logs, or chat; inventing logout/org-switch/config-file edits; changing plugin config beyond login/status; or treating prior-turn account strings as current truth?

## Chain of Thought
Treat a run as invalid (fail closed, no success claim) if any of these fire:

    • Success without identity: `greptile login` or help/PATH exit 0 is not proof. Signed-in only after a post-action whoami/status that prints a usable account. Prior-turn account/org/`signedIn: true` is operational context only—re-check every time.
    • Faked or hung PKCE: do not start `greptile login` on a headless/non-interactive host; do not invent redirects, cookies, or unofficial auth HTTP. Defer: user runs `greptile login` locally, then re-whoami. Browser not opened / no Approve → keep prior session, report retry.
    • Secret leakage or key work: never echo tokens/cookies/refresh/`GREPTILE_API_KEY` values; never write them to repo, logs, chat, or `.env`; never set/rotate/construct keys. Report env-key as set/unset only.
    • Scope creep / invented ops: no logout unless the CLI itself already documented it and current session is the proven blocker; no org-switch, config-file edits, plugin changes beyond login/status, no `/greptile` slash command, no guessed flags/installers/whoami names. Help-failed or unclear whoami → AMBIGUOUS_STATUS (stderr + exit), do not loop login.
    • Retry discipline: one `greptile login` retry only for clearly transient network/IdP errors; otherwise stop with failure text. MCP unknown if not queryable—do not invent `signedIn`.

    Coding agent after this pass: PATH probe (`command -v greptile` / `which greptile`), env-key presence test (no value), `greptile --help`/`help`, whoami/status twice around any login; no repo writes.

parent: mtd4rnms

<!-- aio-id: greptile-login-5cbafaae/n5 -->
## Links
- tissue: mtd4rnmx
