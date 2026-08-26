# ClippyOS enterprise uplift + Clipping Studio (session learnings)

Repo: `/root/src/repos/clippyos` · TanStack Start + Better Auth + Supabase/PGLite · AGENTS.md is the operating contract.
Gates: `npm run typecheck` · `npm run lint` (0 errors) · `npm test` · `npm run check:auth` (auth changes) · browser-smoke/qa-*.mjs (UI).

## Config-driven constants pattern (NIST/FedRAMP)

Hardcoded thresholds → validated config module:

- `src/lib/config.ts`: `loadConfig()` reads each key via `readAppSetting`, validates with min/max bounds, falls back to the constant in `src/lib/constants.ts`. Memoized; `clearConfigCache()` for tests. Client-safe `clientConfig` re-exports defaults for browser use.
- Register every overridable key in `WORKSPACE_CONTROL_KEYS` (`src/lib/server/secret-scope.server.ts`) so admin scope writes land in workspace `app_settings` instead of per-operator secrets. Keys added: GUARANTEE_WINDOW_DAYS, GUARANTEE_WARNING_DAY, PIPELINE_STALL_DAYS, CAPACITY_OVERLOAD_THRESHOLD, MARK_COLLECTED_CONFIRM_THRESHOLD, DISCORD_AGENT_STALE_MS, DASHBOARD_ACTIVITY_LIMIT, BRAND_ACCENT_HEX.
- Server-side derivations live under `src/lib/server/` (e.g. `dashboard.ts`) when they need `await loadConfig()`; keep client-safe derivations pure in `src/lib/`.
- Document the mapping in root `COMPLIANCE.md` (control family → implementation → evidence artifact).

## Integration module pattern (Crayo.ai example)

Follow `higgsfield.server.ts` shape exactly: credential resolution order = process env pair → combined `KEY:SECRET` setting → split settings keys; TTL cache (~30s); `looksRedacted()` guard against placeholder values; best-effort persist preview creds; poll job status with capped attempts + timeout classification (`missing|rate_limit|timeout|failed`). Expose `<provider>Available()` + `<provider>ErrorMessage()`. Never embed keys in source; degrade gracefully and surface availability in `/health`.

## Studio/server-function pattern

New authenticated mutations follow: `createServerFn({method})` → `.middleware([authMiddleware])` → `.validator(zodSchema.parse)` → handler does `requireUser(context.userId)` (via `getUserRole`) → dynamic-import the heavy server module inside the handler. Wrap results in typed discriminated unions (`{ok:true,...}|{ok:false,error}`) exported from the fns file so client `onSuccess` narrowing compiles.

## ⚠️ TanStack Router: adding a route file by hand

`src/routes/_app/studio.tsx` does NOT register itself — `routeTree.gen.ts` must be patched in **9 places** (alphabetical among `_app/*`, i.e. after `social`, before `team`):

1. import `Route as AppStudioRouteImport`
2. `const AppStudioRoute = AppStudioRouteImport.update({id:'/studio', path:'/studio', getParentRoute:()=>AppRoute})`
3. `FileRoutesByFullPath` interface: `'/studio': typeof AppStudioRoute`
4. `FileRoutesByTo`: same entry
5. `FileRoutesById`: `'/_app/studio': typeof AppStudioRoute`
6. `FileRouteTypes.fullPaths` union: `| '/studio'`
7. `FileRouteTypes.to` union: same
8. `FileRouteTypes.id` union: `| '/_app/studio'`
9. **Easy to miss:** the `FileRoutesByPath` *interface* block (~L970) — `'/_app/studio': { id, path, fullPath, preLoaderRoute: typeof AppStudioRouteImport, parentRoute: typeof AppRoute }` — plus `AppRouteChildren` interface AND object at the tail.

Symptom if step 9 is missed: `error TS2345: Argument of type '"/_app/studio"' is not assignable to parameter of type 'keyof FileRoutesByPath'` on `createFileRoute("/_app/studio")`.

`npx tsr generate` is broken on this host (`tsr` npx package crashes reading config) — hand-patch the gen file; the vite dev server regenerates it on next real start. Also add nav entry in `src/lib/nav.ts`.

## Build UI from existing primitives (user preference)

Do NOT scaffold parallel Card/Tabs/Drawer components when the repo has them. Studio reuses `AssetCard`, `AssetDrawer`, `RenderQueue`, `UploadDropzone`, `SectionBoundary`, `PageHeader` from `@/components/library|clients|ui`. Check the component's actual prop contract first (`AssetCard` takes `onOpen`, not `onClick`; `RenderQueue` takes `jobs/onCancel/onRetry/onOpenOutput`; `exportCaptionsFn` returns `{filename,body}` not `{content}`). Read the source before writing JSX — guessing props caused ~50 type errors that had to be thrown away once already.

Match Button variants exactly: `primary|secondary|ghost|destructive|rainbow` (no `outline`/`lg` size); Badge tones are `neutral|blue|green|orange|red|purple|teal` (use `tone=`, no `variant=`); Radix Select `onValueChange` gives `string` — cast for literal unions.

## Smoke-testing a single route

`scripts/browser-smoke.mjs` accepts ANY url argument — `node scripts/browser-smoke.mjs http://127.0.0.1:8080/studio` renders desktop+mobile (1280x800, 390x844) headlessly and prints per-viewport JSON (status, title, bodyTextPrefix, bodyTextHash, horizontalOverflow, consoleErrors, pageErrors, screenshot path). Verified per-route; no custom Playwright harness needed. Pipe stdout through python3 json.load for compact comparison of viewport stats.

**Baseline-comparison trick:** in the same session, run the identical command against a known-good sibling route (e.g. `/library`). If the new route matches the old route's error profile (same count of `ERR_BLOCKED_BY_RESPONSE` font-fetch console noise, zero `pageErrors`, no horizontal overflow), the route is clean — don't chase environmental console noise as a feature regression. Auth-gated pages show "Checking access" placeholder in raw SSR HTML — judge readiness from `bodyTextPrefix` / hydrated innerText.

## Environment gotchas

- `.grok/app-env.json` must ship `{"VITE_AUTH_ENABLED":"false"}` — empty `{}` breaks `with-app-env.test.mjs` (template-ships-auth-off contract).
- `no-control-regex` is off in eslint.config.mjs — sanitizers legitimately strip control chars; don't re-enable or add per-line disables.
- **Orphaned dev server trap:** interrupted turns leave `vite dev` bound to 8080. A later smoke test silently runs against STALE code (my new dev server failed port-bind but curl still returned 200). Check `ss -tlnp | grep 8080`, kill PIDs, re-verify before trusting smoke output.
- Pre-existing test failures: 9 grok-pwa og:title/og:image brand tests fail independent of feature work — know the baseline, never let new work add failures.
- `curl -s <ssr-page> | grep <term>` can print "binary file matches" (grep treats the SSR payload as binary). Use `curl -s … | strings | grep -oE "…"` to extract text matches from HTML responses.
- Final-state verification habit: after killing a background dev server, re-run all three gates (`typecheck`, `lint | grep problems`, `test | grep -E "^ℹ (pass|fail)"`) and `git status --short | wc -l` in one command so the closing report cites real, current output rather than numbers from mid-session.
