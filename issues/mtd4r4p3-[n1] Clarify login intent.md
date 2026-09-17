# [n1] Clarify login intent
## Node
`n1` · understand · deps: none

## Question
What does `! greptile login` require here: re-verify live Greptile CLI auth in the current session (not assume prior-chat account/org), use only vendor CLI (`greptile login` / `greptile whoami`), and never build a `/greptile` slash command, wrapper, CI secret, or custom OAuth?

## Chain of Thought
Intent is ensure-session, not build-login and not force-reauth. Re-verify live CLI identity this turn; do not reuse prior-chat emails/orgs. Use only `greptile whoami` then `greptile login` if unsigned. Never invent CLI/install/repo facts, never print tokens or `GREPTILE_API_KEY` values, never create slash commands, wrappers, CI secrets, MCP config edits, or custom OAuth. If already signed in, report account/org and stop; if interactive browser PKCE cannot complete here, hand off `greptile login` to the user’s terminal. Coding agent next: check PATH for `greptile`, then whoami/status—no login until that live check.

parent: mtd4r4p2

<!-- aio-id: greptile-login-c35e403f/n1 -->
## Links
- tissue: mtd4r4p3
