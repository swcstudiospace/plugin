---
description: Tissue issue tracking — list, status, sync (to ktui board), on, off
argument-hint: "[list|status|sync|on|off]"
allowed-tools: Bash(bun *)
---

Run this exact command and show the user its output verbatim, then stop:

```
bun "${CLAUDE_PLUGIN_ROOT}/hooks/uplift.ts" --ctl issues $ARGUMENTS
```

Do not run anything else and do not interpret the arguments yourself.
