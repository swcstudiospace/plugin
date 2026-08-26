# DevPod wrap (Aimee / Omega Loops)

Upstream clone: `/root/src/repos/devpod` (`loft-sh/devpod`). Runtime: `/usr/local/bin/devpod` (not compiled into Rust). CLI crate is `aimee_main`, binary `aimee` (repo dir still `omegaloops`).

## Commands

| User | DevPod |
|------|--------|
| `aimee pod up …` | `devpod up …` |
| `aimee pod list [--porcelain]` | `devpod list` (`--output json` if porcelain) |
| `aimee pod exec <id> <cmd>` | `devpod ssh <id> --command "<cmd>"` |
| `aimee pod connect <id>` | Aimee-native; **no DevPod spawn** (see below) |
| `!aimee pod connect <id>` (`!aaimee` typo accepted too) | attach the *current* TUI session to `<id>` |
| `aimee pod ui` / `doctor` | Omega-native; do not spawn DevPod |
| `aimee --pod <id>` | `devpod up <cwd> --id <id> --open-ide=false` then TUI |
| `/goal <text>` | persist `pod_id` slug `aimee-…` (max 40); budget = unlimited turns |
| `/goal pod` | `provision_for_goal` |
| `/goal exec <cmd>` | `exec_in_workspace` |
| `/goal pr` | `gh pr create --fill` |

## pod connect = local TUI attach, never remote SSH

The pod image has no `aimee` binary — a plain `devpod ssh` session cannot start
the TUI. `connect` instead probes Anda/KIP, resolves the workspace from
`devpod list --output json` (needs `source.localFolder` for file tools),
auto-`up`s with `--open-ide=false` when not Running, pins
`AIMEE_POD_WORKSPACE`, and opens the local TUI with cwd at that host folder.

While attached: shell and `!` commands route through
`devpod ssh <id> --command …`. The routing seam is `prepare_command()` in
`crates/aimee_infra/src/executor.rs`, keyed on the `AIMEE_POD_WORKSPACE`
env var (`AIMEE_POD_BIN` overrides the runtime binary). File tools keep using
the host-side bind-mount folder — same files as inside the container.
Raw interactive SSH stays available as `aimee pod ssh <id>`.
There is no `devpod start`; bring workspaces up with
`devpod up <id> --open-ide=false`.

`--sandbox` remains git worktree. Docker is the default provider on this host once `devpod provider add docker` has run.

## Headless → Mac Mini

No DevPod Desktop on this Linux box. `aimee pod ui` prints SSH target (`user@host`). Mini: DevPod Desktop → Providers → SSH, or `ssh -N -L 8080:127.0.0.1:8080 user@host`.

## Not wired

Anda **dTEE** is not in this tree. Do not claim `/goal` auto-opens a PR or auto-`up`s a workspace; those are explicit `/goal pr` and `/goal pod`.
