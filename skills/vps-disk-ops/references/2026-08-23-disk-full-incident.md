# 2026-08-23 Disk-Full Incident — full breakdown

## Presentation

- `/dev/sda1` 193G at **100%**, 139MB free. Writes on the verge of failing.
- User suspected devcontainers (had been building them). Devcontainers were a minor factor only.

## What du found (top consumers)

| Path | Size | Class |
|---|---|---|
| `/root/src/repos/aimeecodes/target` | **64G** | REGENERABLE — deleted |
| `/root/src/repos/anda-bot/target` | **13G** | REGENERABLE — deleted |
| `/root/src/repos/images` (HF snapshots hfs.main/hfs.sec + .zst) | 15G | DATA — kept |
| `/root/.cache/JetBrains` | 11G | Mostly LIVE (RustRover running); Rider RC1 dist 5.6G deletable-if-idle |
| `/root/.cache/uv` | 7.4G | REGENERABLE — deleted via rm (prune hung) |
| `/root/.npm` | 7.6G → 499M | REGENERABLE — `npm cache clean --force` |
| `/var/lib/docker` (~19G total docker) | 19G | LIVE — all 5 images attached to running containers; build cache prune yielded 0B |

## Sequence that worked

1. `df -h /` + `docker system df` / `docker system df -v` (image↔container mapping).
2. Repeated `du -xh -d1 … | sort -rh | head -15` descent: `/` → `/root` → `/root/src/repos` → `aimeecodes`.
3. Safety: `ps aux | grep cargo/rustc` (a build was running but exited before deletion), `lsof +D <target>` on both target dirs → empty.
4. `rm -rf` both targets → 139MB → **78GB free**.
5. Caches: npm clean, backgrounded `rm -rf ~/.cache/uv`, apt-get clean, docker builder prune.
6. End state ~80GB free; noted another agent session immediately re-ran `cargo check -p aimee_main`, rebuilding target/ to ~10GB within the session.

## Attribution lesson

User hypothesis (devcontainers) was reasonable but wrong: Docker total was ~19GB and mostly live services. The real cause was Cargo debug+incremental artifacts from repeated agent-driven builds. Lesson: run the du descent before forming conclusions; user hypotheses are leads, not findings.

## Refill attribution technique

When free space moves unexpectedly between commands: `ps -o ppid= -p <cargo-pid>` then walk up parents. The rebuild was traced to a *different* Hermes session (`tui_gateway.entry` python process spawning bash wrappers running cargo check). Multiple concurrent agent sessions share this disk — coordinate accordingly.
