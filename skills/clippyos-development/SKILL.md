---
name: clippyos-development
description: Use for any task in the ClippyOS repo — gates and ladders.
version: 1.0.0
tags: [clippyos, tanstack-start, mcp, daytona]
category: software-development
provenance: builtin
---

# ClippyOS development

Use whenever the task touches `/root/src/repos/clippyos` — uplifting code quality,
adding routes/screens, registering MCP tools for Hermes, editing agent/ideation/thumbnail
prompts, or wiring the Dashboard ↔ Social Machine storage chain. AGENTS.md in the repo is
the operating contract; this skill carries what sessions learned BEYOND AGENTS.md.

## Non-negotiable workflow

1. Read AGENTS.md sections relevant to the area (§3 architecture contracts are bug-class:
   dual-backend data layer, server-only boundary, leashed autonomy, platform chrome).
2. Verify with real output before claiming done: `npm run typecheck`, `npm run lint`
   (bar = 0 errors), `npm test`. UI work additionally needs `scripts/browser-smoke.mjs`.
   Auth/route changes need `npm run check:auth` against a running dev server.
3. Never commit unless asked; never touch `.env`; platform chrome (`server/middleware/grok-pwa.ts`,
   `grokPwaPlugin()`) is do-not-modify even when its tests fail.

## References (read the one matching your task before starting)

- `references/repo-gotchas.md` — START HERE. Baseline-failing tests, test-env quirks,
  port contracts, stale-dev-server and Playwright-resolution pitfalls.
- `references/route-registration.md` — adding a dashboard route WITHOUT the router plugin:
  every section of `routeTree.gen.ts` that must be hand-patched, in order.
- `references/mcp-tool-ladder.md` — the 5-file ladder to register a new `domain.*` MCP/agent
  tool (catalog → schema → scope gate → handler → agent allowlist).
- `references/prompt-conventions.md` — mandated XML-tagged prompt house style for ideation,
  thumbnails, and the clipping agent, with the tag vocabulary each uses.
- `references/storage-bridge.md` — the S3/IPFS bucket as persistent layer between Dashboard
  and the nested Social Machine: rclone network-drive mount, `machine-drops/` protocol,
  status plumbing, and the hand-rolled SigV4 list helper.

## Quick rules

- Hardcoded values → `app_settings` via `src/lib/config.ts` / workspace control keys;
  secrets resolve from env or operator Settings only (§3.3).
- New autonomous capabilities need a scope in `API_KEY_SCOPES`, an audit trail, and stay
  conservative by default (draft social jobs, no auto-start VM) per §3.4.
- Cron and Test Connection never start the Social Machine; idle ⇒ pause, never destroy (§3.5).
- Node test runner conventions: bare behavioral `test("...", ...)` sentences, co-located
  `*.test.ts`/`*.test.mjs`, whole-value assertions, no describe/it nesting.
