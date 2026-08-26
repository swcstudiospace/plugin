---
name: vps-disk-ops
description: Clean full VPS disks safely — builds, caches, refill risk.
---

# VPS Disk Ops

Diagnose and recover from disk pressure on the headless Linux VPS (single `/dev/sda1` root holding everything: Docker overlays, k3s, DevPod workspaces, repos). Load when disk is >90% full, writes fail, before kicking off large builds, or for periodic cleanup passes.

## Triage order — measure first, never guess

1. `df -h /` — confirm which mount is actually full. On this host everything shares one root FS; k3s/overlay/tmpfs entries in later output are noise, not separate volumes.
2. `docker system df` — images / containers / volumes / build cache with a RECLAIMABLE column. Cross-check against `docker ps`: an image "reclaimable" by size may still back a running service (vikunja, uvdesk) — those are LIVE, not free space.
3. Top-down descent with `du -xh -d1 <dir> | sort -rh | head -15`, drilling into the largest child each round (`/` → `/root` → `/root/src` → …). The `-x` flag is essential here: without it, du walks k3s tmpfs/overlay mounts and double-counts the whole disk many times over.
4. Classify every big consumer before touching it:
   - **REGENERABLE** — Cargo `target/`, `node_modules/`, package caches (`~/.cache/{uv,npm,pypoetry,pip}`, `ms-playwright`), `/var/cache/apt`, Docker build cache, journal logs. Deletable.
   - **DATA** — repo source trees, `/root/src/repos/images` HF snapshots (including `.zst` copies — user keeps both formats), `/var/backups/agent-restic`, Docker named volumes. Never delete unprompted.
   - **LIVE** — images with running containers, DevPod workspace containers with grown writable layers, IDE dists with active processes (`~/.cache/JetBrains/RemoteDev/dist/*` while RustRover runs).

## Safety checks before any bulk `rm`

- `ps aux | grep -E 'cargo|rustc|docker build|node-gyp'` — confirm nothing is actively writing into the tree you're about to remove.
- `lsof +D <dir>` (slow on huge dirs; acceptable one-time cost) — confirm no open file handles.
- If a build IS running into the target tree: deleting mid-build corrupts it and wastes the work. Either wait, or consciously decide the rebuild is cheaper than the space (only viable when there's room for it to finish — see refill pattern below).
- Report deletions with before/after `df -h /` numbers so the user sees real reclaimed space.

## Refill pattern — freeing space is not durable by itself

Multiple Hermes agent sessions run concurrently on this host and launch builds autonomously (via tui_gateway): during the Aug 2026 cleanup, a fresh `cargo check` started within minutes of space being freed and rebuilt `target/` to ~10GB before the session ended. Consequences:

- Expect free-space numbers to drift downward between your own commands; re-check `ps aux | grep cargo` if space drops unexpectedly.
- A 64GB `aimeecodes/target` regrows from full debug+incremental build cycles; `anda-bot/target` reached 13GB. Periodic pruning of `target/debug/incremental` (usually the fattest chunk) is the sustainable fix, not one-off deletions.
- DevPod containers accumulate multi-GB writable layers (4.1GB observed on the aimeecodes workspace); recreating the workspace resets it — ask first, it loses uncommitted container state.

## Gotchas

- `uv cache prune` hung past 300s on a 7.4GB cache; plain backgrounded `rm -rf /root/.cache/uv` finished in ~100s. For multi-GB caches, skip the tool's own GC and just delete the directory.
- `npm cache clean --force` took 7.6GB → 0.5GB almost instantly — always worth it.
- Known deletable-if-idle candidates on this host: `~/.cache/JetBrains/RemoteDev/dist/` Rider RC1 download (5.6GB, no live process needs it), old `pypoetry` cache if poetry unused.
- Session-specific findings and the exact incident breakdown live in `references/2026-08-23-disk-full-incident.md`.
