---
description: Control Prompt Uplift — on, off, skip (next prompt), status, last
argument-hint: "[on|off|skip|status|last|think on|think off|think last]"
allowed-tools: Bash(bun *)
---

Run this exact command and show the user its output verbatim, then stop:

```
bun "${CLAUDE_PLUGIN_ROOT}/hooks/uplift.ts" --ctl $ARGUMENTS
```

Do not run anything else and do not interpret the arguments yourself.
