# Aimee TS monorepo — setup, auth seeding, and known-failure triage

Session detail from 2026-08-25. Facts may drift; re-verify timings and failure lists before relying on them.

## Gate timings observed

| Command | Cold | Warm |
|---|---|---|
| `bun install` | ~3 s + tool-views gen | instant |
| `bun run check` (TS+RS parallel) | ~7 min | ~2 min |
| `bun run lint` | ~30 s | — |
| `bunx biome format .` (check only) | ~15 s | — |
| `bun run build` | ~13 min (natives dominates) | ~3 min |
| `bun run test` (`local`) | ~22 min (1316 s: 173 commands) | — |
| `bun run test:rs` | ~2.5 min after nextest compile | — |
| `--smoke-test` | fails cold, ~3 s warm | 3 s |

## SuperGrok (xai-oauth) auth seeding — verified recipe

Context: the user's grok-cli stores OIDC creds at `~/.grok/auth.json`:
`{ "<issuer>::<id>": { key, refresh_token, expires_at, email, ... } }`. Aimee
stores provider credentials in `~/.aimee/agent/agent.db` table
`auth_credentials(provider, credential_type, data JSON)`. The OAuth credential
shape is `{type:"oauth", access, refresh, expires, email?, authorizedAt}` per
`packages/ai/src/registry/oauth/types.ts`.

Steps that worked:

1. Refresh the expired token using aimee's own code (field mapping matters —
   see gotcha below):

```bash
cd /root/src/repos/aimee && bun -e '
const { refreshXAIOAuthToken } = await import("./packages/ai/src/registry/oauth/xai-oauth.ts");
const f = process.env.HOME + "/.grok/auth.json";
const a = await Bun.file(f).json(); const k = Object.keys(a)[0];
const fresh = await refreshXAIOAuthToken(a[k].refresh_token);
a[k].key = fresh.access;          // "key" is what grok-cli reads
a[k].refresh_token = fresh.refresh;
await Bun.write(f, JSON.stringify(a, null, 2));
console.log("refreshed, new len:", fresh.access.length);
'
```

   **Gotcha:** `refreshXAIOAuthToken` returns camelCase-less `{access, refresh,
   expires}` — NOT `{accessToken, refreshToken}`. First attempt wrote nothing
   back because the field names didn't match; the stale token kept failing with
   403 `unauthenticated:bad-credentials` until BOTH fields were written.

2. Seed aimee's credential store:

```bash
bun -e '
const { Database } = await import("bun:sqlite");
const { AuthStorage, SqliteAuthCredentialStore } = await import("./packages/ai/src/auth-storage.ts");
const g = Object.values(await Bun.file(process.env.HOME + "/.grok/auth.json").json())[0];
const store = new SqliteAuthCredentialStore(new Database(process.env.HOME + "/.aimee/agent/agent.db"));
await new AuthStorage(store).set("xai-oauth", {
  type: "oauth", refresh: g.refresh_token, access: g.key,
  expires: Date.now() + 3600_000, email: g.email, authorizedAt: Date.now(),
});
'
```

3. Default model — `~/.aimee/agent/config.yml`:

```yaml
modelRoles:
  default: xai-oauth/grok-4
```

4. Verify: `aimee -p "Reply OK"` → expect `OK`. List models: `aimee models`
   (shows the 9 xai-oauth models incl. grok-4.3/4.5/4.6, grok-build).

Token lifetime ≈ daily. Symptom of expiry: `403 The OAuth2 access token could
not be validated.` Re-run step 1 (stored credential in agent.db also carries
the old access token; if only env-var auth is used, re-seeding step 2 fixes it).

### Auth traps that did NOT work

- `ANTHROPIC_AUTH_TOKEN` in this shell = OpenRouter proxy key
  (`sk-or-...`, base URL openrouter.ai). Passing it as `ANTHROPIC_API_KEY` →
  Anthropic 401 invalid key. Not usable for direct Anthropic.
- `XAI_OAUTH_TOKEN=<stale token>` env path works mechanically but 403s once
  expired; the DB-stored credential is the durable route.
- No KILO_API_KEY in env → catalog's default-model picker can land on
  `kilo`'s stealth models via OpenRouter and hit shared-pool 429s; explicit
  `modelRoles.default` avoids the surprise.

## Known pre-existing test failures (baseline 2026-08-25)

TS side — all in `packages/coding-agent/test/` unless noted:

| Test file | Failing tests | Nature |
|---|---|---|
| `utils/qrcode.test.ts` | 2 golden-vector hashes + auto-mask pick | encoder output ≠ committed goldens (got `9489b…`/mask 6 vs expected `4af2f…`/mask 1); pure-TS impl, no native involvement |
| `tools/browser-relay-bridge.test.ts` | 4–5 RelayBridge grouping counts | RPC-count assertions off by one |
| `ssh-control-path.test.ts` | 3 | test hardcodes fallback hash `/tmp/aimee-5434354bc38f9a50fbbd`; impl deterministically produces `b66b4dcb7e4493b368a2` for uid 501 + the canonical dir (verified independently via Bun.CryptoHasher AND python hashlib). Committed test constant disagrees with committed code |
| `profile-cli.test.ts` | 1 stderr assertion | expects `Invalid AIMEE profile` on stderr; got empty |
| `update-cli.test.ts` | 1 prune count | removedEntries 3 vs expected 4 |
| `agent-session-model-persistence.test.ts` | 1 error-string | test says `"Previous OMP process exited…"`, impl emits `"Previous Aimee process exited…"` (rebrand leftover) |
| `utils/changelog-static-import.test.ts` | 1 | fallback probe can't find native addon in its tmp bundle layout |

Rust side (4 of 3149):

- `utok::tests::claude::matches_reference_counts` and
  `matches_ctok_reference_counts` — golden counts off by 7 on the AGENTS.md
  fixture (676 vs 683), i.e. exactly FRAME_V3; suspect fixture/frame-overhead drift.
- `aimee-domain tools::call::args::test_serialize_parsed_object` — serde_json
  key ordering (`{"enabled":...}` alphabetical expectation).
- `aimee-domain tools::catalog::tests::tool_definition_json` — insta snapshot
  drift: start_line/end_line order swapped + one `nullable: true` removed.
  New snapshot written to `*.snap.new`; do not blind-accept.

Baseline counts: TS 8 failed chunks / 17 individual tests (with NODE_ENV fix
in place); Rust 4 failures / 3149 pass. A run that exceeds these added regressions.

## Daemon broker cold-start (why first smoke fails)

`smokeTestDaemonBroker` spawns the broker worker with `stderr: "ignore"`.
Manual repro with visible stderr shows the sequence: PID-lease acquire →
scope.json write → socket listen → idle-exit after DEFAULT_IDLE_GRACE_MS=3000.
On a cold box the parent's 10 s CONNECT_TIMEOUT_MS can lapse before the
worker finishes its module-graph load; second attempt always passes. If it
ever reproduces warm, strace with
`strace -f -e trace=openat,connect,bind,listen,unlink -o /tmp/x.strace bun packages/coding-agent/src/cli.ts __aimee_worker_daemon_broker`
(after pre-creating runtimeDir/broker.token) — but retry-before-debugging first.
