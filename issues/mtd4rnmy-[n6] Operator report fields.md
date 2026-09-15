# [n6] Operator report fields
## Node
`n6` · refine · deps: n4,n5

## Question
What concise factual report must the agent emit after checks: signed-in true/false; account; org only if the CLI printed it; auth mode (browser session vs env key present/absent); CLI version only if printed; whether browser flow was started, skipped, or deferred; MCP/plugin review/merge auth blocked/unknown; and the next user action if login cannot complete here?

## Chain of Thought
Emit one short operator report after the post-action whoami/status (never from PATH/help exit 0 or prior-turn context). Include only:
    • signed-in: true/false (true only if that whoami/status shows a usable identity)
    • account: the identifier the CLI printed; omit if none
    • org: name/id only if the CLI printed it; never invent
    • auth mode: browser session vs env key set/unset (presence only; never the value)
    • CLI version: only if the binary/help already printed it
    • browser flow: started | skipped (valid session) | deferred to user terminal
    • MCP/plugin review/merge auth: blocked | not blocked | unknown
    • blocking error: verbatim stderr/exit if any; no success hedging
    If login cannot complete here: next action is run `greptile login` in the user’s terminal, then re-check whoami/status. Do not invent `/greptile`, flags, installers, or org names.

parent: mtd4rnms

<!-- aio-id: greptile-login-5cbafaae/n6 -->
## Links
- tissue: mtd4rnmy
