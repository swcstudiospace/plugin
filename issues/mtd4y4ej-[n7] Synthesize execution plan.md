# [n7] Synthesize execution plan
## Node
`n7` · synthesize · deps: n6

## Question
What ordered actions should the coding agent run now: inspect live CLI/MCP status first; skip login if already usable; else one official browser login if a browser tool exists; else one CLI URL plus docs-based MCP connect; re-run status; then report connected vs not, account/org at prior identifiability, signed-in flags, remaining human action, and no secrets?

## Chain of Thought
Run in this order; stop at the first terminal state.

    1. Inspect only (no login): PATH/`greptile --help`; identity/whoami/status if those subcommands exist; MCP tool list + `signedIn`/usable; boolean `GREPTILE_API_KEY` set (never print value). Treat live payloads as truth; ignore prior-chat signed-in claims.
    2. If identity signed-in AND MCP usable AND no Greptile MCP tool is auth-blocked → STOP. Report connected.
    3. If an OAuth URL/challenge is already pending or host has no display → do not start another `greptile login`. Surface that single authorize URL once; ask for paste-back only if the official CLI callback requires it. Wait.
    4. Else if signed-out/MCP auth-blocked AND a real browser tool can load Greptile auth pages → start exactly one official login/PKCE flow in that browser; complete consent/org select for the existing account context; do not harvest passwords in chat.
    5. Else (no browser tool / cannot finish OAuth): one `greptile login` (or documented CLI equivalent) to emit one authorize URL; web-search official Greptile MCP connect / CLI login / client config only; apply only steps this env can run. Do not invent config filenames, packages, or API keys. Do not write repo files or store secrets.
    6. Re-run the same status checks as step 1. Connected = signed-in identity + MCP usable + not auth-blocked. Otherwise name one blocker: signed-out; waiting on browser approve; CLI missing; identity OK but MCP not registered; key required and unset; org/SSO/network error.
    7. Report: connected vs not; account/org at prior identifiability (`oveshen.govender@gmail.com` / Spectrum Web Co only if live output still shows it); CLI/MCP signed-in flags; key-env boolean; remaining human action if any. No tokens, cookies, or codes.

    Coding agent checks after this pass: `which greptile` / `greptile --help`; env presence of `GREPTILE_API_KEY` without dumping; MCP tool list and auth errors. No new OAuth if a URL is outstanding. No product code, MCP server implementation, or `/greptile` slash command.

parent: mtd4y4ec

<!-- aio-id: orchestrate-ultrathink-please-us-5c845379/n7 -->
## Links
- tissue: mtd4y4ej
