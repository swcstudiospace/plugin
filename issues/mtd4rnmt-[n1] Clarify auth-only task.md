# [n1] Clarify auth-only task
## Node
`n1` · understand · deps: none

## Question
What exactly must the coding agent do for `greptile login` versus what is forbidden: confirm this is CLI/PKCE (or env-key presence) authentication only, reuse a valid session, never invent a `/greptile` slash command, never print or set `GREPTILE_API_KEY`, and treat prior MCP signedIn/true and unset key as stale context that must be re-checked?

## Chain of Thought
Auth-only job: confirm/establish a Greptile CLI session. Check CLI on PATH, run whoami/status first, treat prior MCP `signedIn: true` and unset `GREPTILE_API_KEY` as stale. If the session is valid, reuse it and do not open a browser. If unsigned/invalid and this host can complete PKCE, run `greptile login`; if not, tell the user to run that command locally, then re-check. Report signed-in boolean, account, org if the CLI prints it, browser-session vs env-key presence (set/unset only), and any block.

    Do not invent `/greptile`, install the CLI, set/print keys, edit config, switch orgs, or claim success without a fresh identity check. Coding agent next: `which greptile` / `greptile --version` if it prints version, then the CLI’s whoami/status equivalent, and env presence of `GREPTILE_API_KEY` without echoing the value.

parent: mtd4rnms

<!-- aio-id: greptile-login-5cbafaae/n1 -->
## Links
- tissue: mtd4rnmt
