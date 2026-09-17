---
description: Grok thinking engine — status, engine grok|claude, proxy status
argument-hint: "[status|engine grok|engine claude|proxy status]"
allowed-tools: Bash(bun *)
---

Run this exact command and show the user its output verbatim, then stop:

```
bun "${CLAUDE_PLUGIN_ROOT}/hooks/uplift.ts" --ctl grok $ARGUMENTS
```

Do not run anything else and do not interpret the arguments yourself.
