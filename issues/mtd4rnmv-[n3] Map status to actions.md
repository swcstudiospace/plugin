# [n3] Map status to actions
## Node
`n3` · compare · deps: n2

## Question
How should each preflight outcome be handled: CLI missing (stop, no invented install); already signed in with usable session (report account/org, skip browser login, mention how the user can switch via their own `greptile login`); unsigned/invalid/auth-blocked (attempt `greptile login`); ambiguous CLI error (report stderr/exit, do not loop login); non-interactive host that cannot open a browser or wait for Approve (defer `greptile login` to the user terminal then re-whoami)?

## Chain of Thought
Map preflight to a single next action:

    • CLI_MISSING (no `greptile` on PATH): stop. Report CLI not installed/not on PATH; login cannot proceed. Do not invent install paths, flags, or whoami. Optionally note GREPTILE_API_KEY set/unset only. No browser flow.

    • ALREADY_SIGNED_IN (whoami/status shows valid identity and usable session; plugin/MCP not auth-blocked if that was queryable): skip `greptile login`. Report account and org only if the CLI printed them; auth mode is browser session vs env-key present/absent. Mention switch path: user runs `greptile login` in their own terminal (PKCE/Approve), then re-whoami. Do not logout or pick an org.

    • SIGNED_OUT_OR_INVALID (no identity, expired/error session, or review/merge auth-blocked): attempt `greptile login` only if this host can open a browser and wait for Approve. Then re-run whoami/status before claiming success.

    • AMBIGUOUS_STATUS (whoami/status failed without a clear signed-out meaning): report stderr and exit code; do not loop login; do not treat as signed-in.

    • NEEDS_USER_TERMINAL (login is required but browser/redirect/Approve cannot complete here): do not start or fake PKCE. Tell the user to run `greptile login` locally, then re-check with whoami/status. Keep any prior session.

    Decision order after n2: missing CLI → stop; ambiguous error → stop and report; valid session → report/skip login; unsigned/invalid → login if interactive else defer. Env-key presence is status only—never set, print, or rotate keys. Coding agent next: PATH probe, whoami/status, env-key presence test; run `greptile login` only on unsigned/invalid + interactive host.

parent: mtd4rnms

<!-- aio-id: greptile-login-5cbafaae/n3 -->
## Links
- tissue: mtd4rnmv
