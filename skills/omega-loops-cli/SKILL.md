---
name: omega-loops-cli
description: "Build, package, or smoke-test the Aimee/Omega CLI."
version: 1.6.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [omega, omegaloops, cli, cargo, smoke, install, debug]
    related_skills: [omega-loops-providers, omega-anda-pathways, omega-loops-agents, rust-cli-binary-rename, hermes-project-soul, ratatui-agent-tui]
---

# Omega Loops — CLI from source

How to **run the CLI against the working tree** without a release package. Current checkout: `/root/src/repos/aimeecodes` (older notes may still say `omegaloops`). **Do not assume the binary is `omega`.** Read `crates/*/Cargo.toml` `[[bin]] name` (this tree is `aimee`; it has been `omega`). Same for crate prefixes (`aimee_*` / `omega_*`) and the install script (`scripts/dev-aimee.sh`, not `dev-omega.sh`).

Don't use for: provider/OAuth wiring (`omega-loops-providers`), Anda/KIP pathways (`omega-anda-pathways`), built-in agent/template rewrites (`omega-loops-agents`), renaming the command (`rust-cli-binary-rename`), crate/folder rebrand (`rust-workspace-rebrand`). DevPod/codespace wrap lives here (`aimee pod` / `--pod`). Do **not** invent Anda dTEE — it is not in this tree.

## When to use

- User wants to install, package, or keep the local CLI on PATH after source updates so they can type `aimee …`
- Need to smoke-test subcommands after crate or `include_dir!` changes
- `aimee` / `omega` is missing from PATH, still points at a stale or dangling binary, or the checkout moved
- Porting Hermes Agent loops (`/goal`, SOUL.md, teams/workflows, `/learn`, channels) into this Rust CLI

## Install model (debug, not release)

AGENTS.md: **never** `cargo build --release` unless the task is a release binary or a measured benchmark. Debug `target/debug/aimee` is ~800MB; do **not** `cargo install --path` (that copies the fat binary).

Canonical loop (read `[[bin]]` + script name first):

```bash
cd /root/src/repos/aimeecodes
scripts/dev-aimee.sh              # cargo build -p aimee_main + PATH shim + smoke
scripts/dev-aimee.sh install      # force rebuild + ~/.local/bin/aimee symlink
scripts/dev-aimee.sh sync         # rebuild only when sources or the link are stale
scripts/dev-aimee.sh watch        # debounce + sync on crate/template/plugin changes
scripts/dev-aimee.sh smoke        # isolated AIMEE_CONFIG, no rebuild
```

What install does: `ln -sfn $REPO/target/debug/aimee ~/.local/bin/aimee`. Incremental `cargo build -p aimee_main` is enough. After crate or `include_dir!` edits (`templates/`, `shell-plugin/lib`), run `sync` — do not assume `target/debug/aimee` is current.

No-install: `./target/debug/aimee <args>`.

**Fast test loop (user preference: test updated code without waiting on builds):**
the `watch` daemon rebuilds + relinks automatically ~20–30 s after a source
save, and `~/.local/bin/aimee` symlinks to `target/debug/aimee`, so the next
`aimee …` invocation just runs it — edit, pause a beat, run. Certainty when
needed: `scripts/dev-aimee.sh sync` is instant when fresh (`find crates -name
'*.rs' -newer target/debug/aimee` shows staleness), `cargo check -p aimee_main
--offline` gives ~10 s type feedback with no link step, `smoke` gates CLI
behavior against a throwaway config. A cold build (wiped/missing `target/`) is
a 10+ minute, ~830 MB rebuild — don't delete `target/`.

**Keep PATH current after code updates** with `watch` (or the user systemd unit), not Hermes cron. Cron jobs have a 3-minute hard interrupt — cargo incremental can exceed that and die mid-link. systemd `PathChanged=` is not recursive, so it will miss `.rs` edits under `crates/*`. Details: `references/local-package-watch.md`.

## Smoke vs porcelain dump

| Script | Role |
|--------|------|
| `scripts/dev-aimee.sh` | Asserts exit 0 + key substrings. Isolated `AIMEE_CONFIG` temp dir. |
| `scripts/list-all-porcelain.sh` | Visual dump of `list * --porcelain`. Not a gate. |
| `scripts/test-zsh-utils.sh` | Zsh `omega zsh format` e2e. Needs zsh. |
| `scripts/test-400-error-message.sh` | Live provider 400 body. Needs creds. |

Smoke covers clap + non-interactive porcelain only: `--version`, `--help`, `provider --help`, `list --help`, `banner`, `info --porcelain`, `list {provider,agent,config,mcp,conversation,cmd,skill} --porcelain`, `workspace list --porcelain`, `conversation list --porcelain`.

`--help` / `--version` exit inside clap **before** config. Other subcommands call `AimeeConfig::read()` — defaults work with no real home. Set `AIMEE_CONFIG` to a temp dir so smoke never writes `~/.forge`.

`omega info --porcelain` uses `init_state` only (not `on_new`) to avoid hydrate-cache join panics on exit.

## Procedure

1. Confirm checkout + binary crate: `/root/src/repos/aimeecodes` `crates/aimee_main` `[[bin]] name = "aimee"`.
2. `scripts/dev-aimee.sh` (or `sync` / `install` then a specific command).
3. Done when `command -v aimee` is the symlink and `aimee --version` prints `0.1.0-dev`.
4. After code changes, `sync` (or rely on `watch`). Do not assume `target/debug/aimee` is current.
5. Hermes-port slash commands live in `{prefix}_domain` + `{prefix}_main` (`/goal`, `/soul`, `/team run`, `/learn`, `/channel`). See `references/hermes-port.md` and `references/loop-autonomy.md`. `/goal` requires **five HITL probes** before `set_loop`. Auto-continues on TaskComplete after the judge. `/team run` advances muse→omega→sage before the goal loop. `/channel poll` is one-shot `getUpdates`, not a 24/7 gateway.
6. DevPod is wrapped, not vendored (Go binary on PATH). Rebranded surface: `{bin} pod …` (aliases `codespace`, `devpod`). Session flag `--pod <id>` provisions a container **before** TUI; `--sandbox` stays a git worktree. `/goal` stores `pod_id`; `/goal pod` runs `devpod up --open-ide=false`; `/goal exec <cmd>` → `devpod ssh --command`; `/goal pr` → `gh pr create --fill`. Headless: `{bin} pod ui` / `pod doctor` (Mac Mini SSH; no DevPod Desktop on this Linux host). See `references/devpod-pod.md`.

## Pitfalls

- **Hermes cron to “package after every update”** — 3-minute hard interrupt kills cargo. Use `scripts/dev-aimee.sh watch` or the user unit `aimee-local-package.service`.
- **systemd `PathChanged=` on `crates/`** — not recursive; misses `.rs` edits. `inotifywait -r` + a quiet debounce (default 20s) is the watcher.
- **Git hooks on this checkout** — `/root/src/repos/aimeecodes` may have no `.git`. Do not `git init`; use the file watcher. See `references/rustyline-backtab-and-config-home.md`.
- **Release “to package periodically”** — slow, unused for correctness, forbidden by AGENTS.md.
- **`cargo install --path crates/omega_main --debug --force`** — copies ~800MB into `~/.cargo/bin`. Symlink instead.
- **Bare `omega` with no shim** — debug binary exists but is not on PATH until install.
- **Claiming suite green** from smoke — 15 CLI checks ≠ `cargo insta test`. Say ad-hoc / smoke.
- **Interactive commands in smoke** — `select`, `provider login`, TUI `omega` with no args hang. Don't add them.
- **`list-all-porcelain.sh` as a test** — it prints; it does not fail on wrong output.
- **`writeln_title` while holding `&GoalState`** — `on_goal` must clone the label/count first; otherwise E0502/E0499.
- **Channel files must never store bot tokens** — `~/.omega/channels.json` holds kind + address only.
- **SOUL is extra custom instructions** — discover `cwd/SOUL.md`, `cwd/SOUL/SOUL.md`, `~/.omega/SOUL.md`; do not replace `AGENTS.md`.
- **Tick once per completed turn** — `tick()` lives in `maybe_continue_goal` (TaskComplete), not in the `Message` handler. Budget itself is unlimited by default now — see `references/loop-autonomy.md`.
- **Workflow before goal** — `after_turn_loops` advances `/team run` first; only then auto-continues `/goal`.
- **`Box::pin` for turn recursion** — `on_message` → TaskComplete → `dispatch_workflow_step` / `maybe_continue_goal` → `on_message` is a self-call; compile fails without pin.
- **Ignore rustfmt edition-2015 noise on `ui.rs`** — the file is edition 2024; `cargo check -p omega_main --bin omega` is the gate.
- **`UIState` has no `Default`** after `GoalStore` / `WorkflowRun` were added — always `UIState::new(env)`.
- **Crate/bin rename mid-session** — `omega_*` may become `aimee_*` (bin `aimee`). `cargo test -p omega_domain` then fails with "did not match any packages". Re-read `[[bin]]` and `crates/` before every verify.
- **Five probes are mandatory on `/goal`** — `GoalStore::set_loop`, not `set`. TTY: `collect_goal_probes`. Non-TTY: five `probe: …` lines or refuse.
- **XML wrap every user turn** — `PromptUpgrade::wrap` on `AppCommand::Message`. Skip if `<omega_prompt` already present. Structural envelope, not a second LLM call.
- **Tool-failure default is unlimited** — `unwrap_or_else(unlimited_tool_failures)` (`usize::MAX`). Do not restore `unwrap_or(3)`. `ToolErrorTracker::new(0)` is not unlimited.
- **Linear telemetry is fail-open** — POST `http://127.0.0.1:8792/v1/ensure-issue` after prompts. Connector health ≠ issue filed. Linear MCP is the cockpit (`hermes-linear-kanban-sync`).
- **Drop CoT×GoT is `.mcp.json`** — `http://127.0.0.1:7788/mcp`.
- **Do not claim 95% coverage for the whole workspace** — `QualityPolicy` + `scripts/tdd-gate.sh` are the gate. Measure first.
- **Git commit every prompt only if `.git` exists** — skip otherwise. `/goal pr` is the PR path.
- **Greptile pre-push** — `scripts/greptile-pre-push.sh` exits 0 if the CLI is missing.
- **CodeRabbit lives in `{prefix}_ci`** — `generate_coderabbit_workflow()` writes `.github/workflows/coderabbit.yml`. Edit the generator, not the YAML, when both exist.
- **Do not invent Anda dTEE** — no type/crate/API in this repo. `pod doctor` must say missing; do not stub a TEE.
- **Do not vendor DevPod Go into the Rust workspace** — wrap `devpod` via `std::process::Command`.
- **`--sandbox` ≠ `--pod`** — git worktree vs DevPod container. Do not silently replace worktree with `devpod up`.
- **Clap about strings must not say DevPod** — `aimee pod --help` is Aimee-branded. Hidden alias `devpod` is fine; user-facing `///` comments are not. Gate: `test_pod_help_is_aimee_branded`.
- **`.devcontainer` postCreate must use `cargo install --locked cargo-nextest`** — unlocked source install fails with `locked-tripwire` and `aimee pod up` exits 1. Hook lives in `.devcontainer/post-create.sh`.
- **Shift+Tab cycles approval** — Confirm → Auto → Yolo (`ApprovalMode` in `aimee_domain`). Auto/Yolo skip permission prompts and the “continue anyway?” interrupt. Default is Yolo (matches unrestricted config).
- **`/swarm <text>` starts `/goal`** — same five probes, then the swarm template; the standing loop continues until the judge completes.
- **Do not PyO3-import Hermes tools** — Hermes is already cloned; load `~/.hermes/skills` (depth 3) via `hermes_skills_path`. Skill authoring is `/learn`, not a dump of Python tools into the Rust catalog.
- **Secrets pasted in chat** — write `~/.config/aimee/secrets.env` mode 600 (`LINEAR_API_KEY`, `GREPTILE_API_KEY`); `load_aimee_secrets()` at startup; never commit. Tell the user to rotate.
- **Watcher owns the package lock** — a manual `dev-aimee.sh install` while the watch daemon is mid-rebuild exits with "another aimee package run holds …". Let it finish; do not kill the daemon.
- **Smoke EXPECT needles are literal** — intentional help-text wording changes (e.g. `pod connect` now says "does not SSH") trip hardcoded needles in `scripts/dev-aimee.sh` until the expected string is updated.
- **Foreign commits clobber uncommitted edits** — a parallel agent's commit silently reverted shared-surface fixes mid-session (`ui.rs` restyle ate pod-connect + goal work). After any new HEAD lands, re-grep your change markers before rebuilding; commit shared-surface work promptly.
- **Gate on `cargo check`, not patch lint output** — str_replace on this tree's `.rs` files reports pre-existing edition-2015 "errors" in its lint blob; ignore it entirely. Two failed patches on one region → rewrite the enclosing function or whole file with `write_file` instead of a third patch.
- **MCP `list` green ≠ auth green** — remote MCP servers serve tool manifests to unauthenticated clients; auth happens per tool call. One server failing all calls while siblings work usually means its stored token is bad. See `references/mcp-connectors-and-secrets.md`.
- **A stored credential can itself be a redaction artifact** — a real case had `Bearer ghp_nM...9bGH` literally saved in `~/.forge/.mcp.json`. When exactly one connector fails every tool call but lists fine, read the config file and check whether the value is a truncation.
- **Linear MCP needs `Bearer `, Linear GraphQL does not** — verified 2026-08-24: raw `lin_api_…` on mcp.linear.app → 401; `Bearer lin_api_…` → 200. The classic GraphQL endpoint takes the raw key. Don't "fix" one convention into the other.
- **Security-scan approval timeout = stop, not retry** — a terminal command embedding a pasted API key that times out at the approval gate must not be re-run or rephrased; silence is not consent. Ask the user, then proceed on the approved path.
- See `references/pod-devcontainer-and-approval.md`.
- **xAI SuperGrok `/models`** can include Imagine `pricing` as an **array**; tolerate it or SuperGrok vanishes. One dead sibling (Anthropic 401) must not abort `get_all_provider_models`. See `omega-loops-providers`.

## Verification

```bash
cd /root/src/repos/aimeecodes
bash -n scripts/dev-aimee.sh
scripts/dev-aimee.sh
./target/debug/aimee --version    # 0.1.0-dev
systemctl --user is-active aimee-local-package.service   # when watch should be durable
```

Expect **19 passed** from `dev-aimee.sh` smoke (15 clap/porcelain + pod help/doctor). Ad-hoc extra checks go in `/tmp/hermes-verify-*.sh` and get deleted.

**PATH ownership changed 2026-08-25:** the user removed `~/.local/bin/aimee` (the debug symlink) because it shadowed the TypeScript monorepo's CLI — see `aimee-ts-monorepo`. Bare `aimee` now resolves to `/root/.local/share/reflex/bun/bin/aimee`, which prints `aimee/18.x` (TS coding-agent), NOT this Rust binary (`0.1.0-dev`). Always verify this repo via `./target/debug/aimee …` from the checkout, and re-check which binary you are actually testing before drawing conclusions about CLI behavior. To restore the shim: `scripts/dev-aimee.sh install`.

## References

- `references/local-package-watch.md` — debug symlink, `sync`/`watch`, systemd unit, why not Hermes cron
- `references/smoke-commands.md` — exact smoke argv + expected needles
- Repo script: `scripts/dev-aimee.sh`
- `references/hermes-port.md` — `/goal` auto-continue + judge, `/team run`, SOUL, `/learn`, channels send/poll
- `references/loop-autonomy.md` — five probes, XML upgrade, Linear :8792, Drop MCP, TDD/Greptile/CodeRabbit
- `references/devpod-pod.md` — DevPod wrap, `/goal pod|exec|pr`, `--pod` vs `--sandbox`, Mac Mini SSH, dTEE not in tree
- `references/pod-devcontainer-and-approval.md` — clap branding, nextest `--locked`, Shift+Tab YOLO, `/swarm`→`/goal`, Hermes skills load, secrets.env
- `references/mcp-connectors-and-secrets.md` — GitHub/Linear/Greptile MCP connectors: credential files (`~/.forge/.mcp.json` + `~/.config/aimee/secrets.env`), verified auth shapes (Linear MCP wants `Bearer `, GraphQL raw), why green `mcp list` ≠ working auth, redaction-artifact tokens, key rotation steps
- Repo script: `scripts/dev-omega.sh`
- Config isolation: `OMEGA_CONFIG` → `ConfigReader::resolve_base_path`
