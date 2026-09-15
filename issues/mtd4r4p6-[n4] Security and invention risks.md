# [n4] Security and invention risks
## Node
`n4` · critique · deps: n1,n3

## Question
What must the coding agent refuse: inventing emails, org IDs, file paths, CLI versions, or env values; echoing tokens/cookies/PKCE/API keys; writing credentials to repo files; scraping/automating the Approve click; forcing account switch when already signed in; ad-hoc HTTP auth; or treating MCP `signedIn` as source of truth over CLI whoami?

## Chain of Thought
Refuse all of the following; none are optional if whoami/login later runs:
- Invent emails, org IDs/names, file paths, package names, API routes, CLI versions, install paths/package managers, or env values. Identity and version only if the live CLI prints them this turn; prior-chat org/email is stale.
- Echo or persist tokens, cookies, authorization codes, PKCE verifiers, refresh material, or `GREPTILE_API_KEY` values. If the key is present, report only set vs unset (`[ -n "${GREPTILE_API_KEY+x}" ]`); never print or write the value.
- Write credentials to repo files, logs, screenshots, wrappers, CI secrets, MCP config, or chat beyond CLI-printed account/org.
- Scrape/automate the browser Approve click, intercept redirects, or implement custom OAuth/HTTP auth. Vendor `greptile login` only.
- Force re-login or account/org switch when whoami already shows a session. Switching = user runs `greptile login` in their own terminal, then whoami.
- Treat MCP `signedIn` as source of truth. CLI whoami/status wins; MCP is a secondary status line only—do not hack MCP config if they disagree.
- Create `/greptile` slash commands, wrapper scripts, or app login surfaces.

Coding agent after this pass: `command -v greptile` then `greptile whoami` only; redact any secret-shaped output; do not run login until that live check.

parent: mtd4r4p2

<!-- aio-id: greptile-login-c35e403f/n4 -->
## Links
- tissue: mtd4r4p6
