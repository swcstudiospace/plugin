# ClippyOS repo gotchas

Session-verified pitfalls. Check here before debugging anything "broken".

## Baseline-failing tests (do NOT chase)

9 failures in `scripts/grok-pwa-plugin.test.mjs` fail on a clean tree: they expect the
generic Grok template's app name ("Wild Race") in og:title / apple-mobile-web-app-title,
but platform chrome injects "ClippyOS". The middleware is do-not-modify (AGENTS.md §3.6).
Baseline is **219–222 pass / 9 fail**. Anything at-or-better than baseline = done.
The failing assertions look like:
`expected: /apple-mobile-web-app-app-title" content="Wild Race"/` — ignore them.

## Test environment

- `npm test` reads `.grok/app-env.json` via `scripts/with-app-env.mjs`. It ships with
  `{"VITE_AUTH_ENABLED": "false"}` — do not reset it to `{}`; auth-on test drift follows.
- `scripts/migration-plan.test.mjs` asserts `migrations/auth/` exists (auth schema lives
  outside the globbed dir on purpose). If it fails, check the dir exists before touching code.

## Dev server & ports (AGENTS.md §2 port contracts are load-bearing)

- dev `0.0.0.0:8080`, preview `127.0.0.1:8081`, both strictPort. Never change them.
- Start dev ONLY via `npm run dev` — invoking vite directly desyncs VITE_AUTH_ENABLED
  (`scripts/check-auth-invariant.mjs` exists to catch exactly that).
- Stale dev servers from interrupted sessions hold port 8080 and serve OLD route trees.
  A new `npm run dev` fails with "Port 8080 already in use" while smoke tests silently hit
  the stale server. Fix: `ss -tlnp | grep 8080`, kill the holder PIDs, re-run.

## Playwright in this sandbox

- `playwright` resolves only from inside the repo working dir, not `/tmp`. Copy ad-hoc
  smoke scripts into the repo root, run, then delete.
- `scripts/browser-smoke.mjs` takes no path flag; it always hits `/`. For other routes use
  a small inline Playwright script that checks status + body text + pageerror per viewport
  (desktop 1280x800, mobile 390x844).
- SSR HTML for app routes contains an auth-gate shell ("Checking access"), so grepping raw
  HTML for page content misleads — verify with a real browser render, not curl+grep.

## Route tree generation

No router plugin runs during typecheck. New routes must be hand-registered in
`src/routeTree.gen.ts` or typecheck fails with `'/_app/x' is not assignable to parameter
of type 'keyof FileRoutesByPath'`. See `route-registration.md`.

## Lint

Bar is 0 errors; ~50 warnings are baseline noise. Control-char sanitization regexes are
intentional — carry their `// eslint-disable-next-line no-control-regex` comments when
touching `cleanUserMessage`/`cleanTrainingInput`/`cleanThumbnailMessage`.
