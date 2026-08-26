---
name: aimee-ts-monorepo
description: "Tasks in the Aimee TS monorepo at /root/src/repos/aimee."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [aimee, bun, typescript, coding-agent, monorepo, cli, testing]
    related_skills: [omega-loops-cli, omega-loops-providers, framework-monorepo-streamline]
---

# Aimee TS Monorepo — build, test, run the coding-agent CLI

Working tree: `/root/src/repos/aimee`. Bun 1.4 workspaces; `packages/coding-agent` is the primary package per AGENTS.md. Rust lives only in `crates/` (natives addon + aimee-pod), built through bun scripts, never bare `cargo test`.

## Which "aimee" is which (three repos share this VPS)

| Path | What | CLI on PATH |
|---|---|---|
| `/root/src/repos/aimee` | **TS monorepo (this skill)** — bun workspaces | `~/.local/share/reflex/bun/bin/aimee` → source CLI, prints `aimee/18.x` |
| `/root/src/repos/aimeecodes` | Rust CLI port — see `omega-loops-cli` | none since 2026-08-25 (user removed `~/.local/bin/aimee` shim); prints `0.1.0-dev` |
| `/root/src/repos/deno-aimee-codes` | Deno variant | `/root/.deno/bin/aimee`, prints `0.1.0` |

Confirm ownership with `aimee --version` before assuming anything about a command's behavior. PATH order: reflex bun bin beats `.deno/bin`. The repo is **not a git checkout** (no `.git`) — no branch/diff/stash operations possible.

## One-time setup

```bash
cd /root/src/repos/aimee && bun install   # or full `bun setup`: install + build:native + coding-agent link + aimee link
```

Native addon ships prebuilt at `packages/natives/native/aimee_natives.linux-x64-modern.node`. Rebuild only after Rust edits: `bun run build:native` (~13 min, uses the `local` cargo profile — expect a cache-invalidating profile switch after a `dev`-profile `cargo check`).

**First-run smoke is flaky, not broken:** the very first `bun packages/coding-agent/src/cli.ts --smoke-test` after install can fail with `Failed to start daemon broker: connect ENOENT .../broker.sock` — the daemon-broker cold start exceeds the 10 s connect deadline on first boot (stderr is swallowed; strace shows a benign lease/unlink race). Re-run once warm caches exist: it passes in ~3 s. Do not debug the broker on a cold box before retrying.

## Gates (verified green 2026-08-25)

| Command | Notes |
|---|---|
| `bun run check` | tsgo per package + `cargo check`; ~4–7 min cold |
| `bun run lint` | biome; one pre-existing warning in `@aimee/utils` does not fail |
| format check | `bunx biome format .` — read-only; real `bun run fmt` rewrites |
| `bun run build` | all workspaces incl. natives (~13 min when cargo profile flips) |
| `bun run test` | `scripts/ci-test-ts.ts local` = full TS suite + cargo nextest, ~22 min |

Runner details: default mode hides passing tests (`--only-failures` implied; `--full` replays everything). Chunks over 600 s are SIGKILLed (`AIMEE_TEST_CHUNK_TIMEOUT`). Bun hides failing test names in summary mode — rerun the named file directly, or `bun test --only-failures <file>`, to see assertions.

## Known pre-existing test failures — do NOT chase

~17 individual tests across 8–9 chunks fail deterministically as content drift (as of 2026-08-25). Triage table with exact files lives in `references/setup-auth-triage.md`. Headlines: QR golden vectors (`test/utils/qrcode.test.ts`), RelayBridge grouping counts, `ssh-control-path.test.ts` hardcoded hash constant that disagrees with the committed implementation, `profile-cli.test.ts` stderr assertion, `update-cli.test.ts` prune count, OMP→Aimee rebrand string in `agent-session-model-persistence.test.ts`; Rust: two `utok` Claude tokenizer goldens, serde key-order in `args.rs`, one insta snapshot (`tool_definition_json`). Verify your changes didn't ADD failures by comparing against this baseline, not by demanding zero.

## Pitfalls

- **Hermes TUI injects `NODE_ENV=production` into every tool shell** → `bun test` inherits it → React resolves to its production build, which exports no `act` → `SyntaxError: Export named 'act' not found`. Fixed durably in `scripts/ci-test-ts.ts` `buildChildEnv()` (deletes the var). When running `bun test` directly outside the runner, use `env -u NODE_ENV bun test`.
- **`zip` is required by `@aimee/browser-relay`'s build** (apt-installed 2026-08-25). Missing → build exits 1 with only `bun: command not found: zip` buried mid-log.
- **Build/test logs bury the real error** — root `bun run` fans out with prefixed lines; grep for `exited with code [1-9]` rather than reading the tail.
- **`pkill -f "bun test"` matches your own probe shell** — the harness wraps commands in bash `-c` strings containing the pattern. `ps -eo pid,args | grep X | grep -v grep` first.
- **Global `bun link` state persists** — `bun --cwd=packages/coding-agent link` rewires `~/.local/share/reflex/bun/install/global/node_modules/@aimee/coding-agent` to this tree; other projects using that global bin inherit it.
- **Env-var auth traps**: `ANTHROPIC_AUTH_TOKEN` in this shell is an OpenRouter proxy key — passing it as `ANTHROPIC_API_KEY` yields Anthropic 401. `aimee models` shows nothing until a provider key exists.

## Running the CLI + provider auth

Link once: `bun --cwd=packages/coding-agent link`. Then seed SuperGrok auth (recipe in `references/setup-auth-triage.md`): refresh the OIDC token via `packages/ai/src/registry/oauth/xai-oauth.ts` `refreshXAIOAuthToken()` (returns `{access, refresh, expires}` — write back BOTH grok-cli fields), upsert into `~/.aimee/agent/agent.db` `auth_credentials` via `AuthStorage` from `packages/ai/src/auth-storage.ts`, set `modelRoles.default: xai-oauth/grok-4` in `~/.aimee/agent/config.yml`. Access tokens expire ~daily; a 403 `OAuth2 access token could not be validated` means refresh again. Non-interactive probe: `aimee -p "..."` (filter spinner noise with `tr '\r' '\n'`).

## References

- `references/setup-auth-triage.md` — auth-seeding script, token-refresh field-mapping gotcha, full known-failure triage table, gate timings
