# [n2] Decompose preflight checks
## Node
`n2` · decompose · deps: n1

## Question
Which live checks must run first, and in what order: is the `greptile` binary on PATH and invocable; what does `greptile whoami` or equivalent status print (account, org name/id, CLI version, session vs env-key) only if those fields appear; is `GREPTILE_API_KEY` set without printing its value; and how do those results map to CLI missing vs unsigned/expired vs already signed in?

## Chain of Thought
Run preflight strictly in this order; do not start `greptile login` until the mapping is known.

    1. Binary: `command -v greptile` (fallback `which greptile`). Missing or not executable → CLI_MISSING; stop with high-level install/login guidance; do not invent package managers or paths.
    2. Invocable: `greptile --help` or `greptile version` only if needed to prove the binary runs. Non-zero with “not found” still CLI_MISSING; other failures → ERROR, retry once then stop.
    3. Identity: `greptile whoami` (or the CLI’s documented status equivalent). Record only printed fields: account, org name/id, CLI version, and any session-vs-key hint. Partial output is allowed; unprinted fields stay unknown. Do not pass emails/orgs from chat as arguments.
    4. Env-key boolean: check whether `GREPTILE_API_KEY` is set (e.g. `[ -n "${GREPTILE_API_KEY+x}" ]` or equivalent). Report set/unset only; never print, log, or persist the value. CLI whoami remains source of truth over MCP `signedIn`.
    5. Map: no binary → CLI_MISSING; binary + whoami unsigned/expired/auth-error → unsigned (LOGIN_REQUIRED next node); binary + whoami shows an account → already signed in (skip login). If whoami succeeds via env key, still report signed-in plus “API key env var is set,” without treating that as a reason to force browser login.

parent: mtd4r4p2

<!-- aio-id: greptile-login-c35e403f/n2 -->
## Links
- tissue: mtd4r4p4
