# Storage bridge — Dashboard ↔ Social Machine persistence

Architecture (user-specified): the free-tier S3/IPFS bucket is THE persistent layer
between the Dashboard and the nested Daytona Social Machine. The machine mounts the
bucket as a network drive; files "copied between" the two sides are drop-zone transfers,
not VM-disk storage. Clips/assets never live on the VM disk as archive.

## Key modules

- `src/lib/social-machine.ts` — client-safe primitives: `WINDOWS_LIBRARY_DRIVE` ("Y:"),
  `LINUX_LIBRARY_MOUNT`, `MACHINE_DROP_PREFIX` ("machine-drops"), `machineDropPath/Key`
  (sanitize + traversal-proof), `windowsBucketMountScript` / `linuxBucketMountScript` /
  `bucketMountScript(os, s3config)`, `verifyMachineMountCommand`,
  `ensureBridgeDirsCommand`, `bridgeStatusNote(configured, mounted)`.
- `src/lib/server/storage-bridge.server.ts` — `applyStorageBridge()` (idempotent mount +
  probe, persists state to app_settings `LIBRARY_BRIDGE_MOUNTED`), `listMachineDrops()`,
  `ingestMachineDrop({actorId, dropName, clientId, title})` → standard library ingest as
  source AGENT with tag `machine-drop`.
- `src/lib/server/s3.server.ts` — hand-rolled SigV4 over fetch (`s3Put/s3Get/s3Delete` +
  `s3List` ListObjectsV2 with regex XML parsing). No AWS SDK by design (Vercel lean).
  Extend THIS file for new S3 verbs; reuse `signedFetch` patterns.

## Mount mechanics

rclone remote name `clippy-bridge`, provider Other, `--vfs-cache-mode writes --daemon`.
Windows script installs rclone to `C:\Users\Public\ClippyOS\rclone\` on first boot and
writes rclone.conf there (secrets only in that file — never in logs/results). Script
short-circuits with `mount-present` when the drive exists. Linux twin uses
`mountpoint -q` guard and `chmod 600` config under `/home/daytona/.config/rclone`.

## Wiring points

- `startSocialMachine()` applies the bridge best-effort AFTER locale/proxy setup; failure
  never blocks start. Status field `storageBridgeMounted: boolean | null` on
  `SocialMachineStatus`; the status probe reads it from app_settings so UI sees last-known
  state even while stopped.
- `daytona.server.ts` exports `createClient` (was module-private) so other server modules
  can get a sandbox handle for fs/process access.
- MCP tools `bridge.status / apply_mount / list_drops / ingest_drop` expose it to Hermes;
  apply_mount requires write:social AND a running machine (never starts one).

## Protocol

Machine side writes finished artifacts to `Y:\machine-drops\<name>.mp4|png|srt`;
dashboard ingests via `bridge.ingest_drop` (name only, no separators — traversal-safe key
build). Duplicates dedupe by checksum inside `ingestBytes` (returns duplicate=true).
IPFS pinning layers ON TOP per strategy settings (eager/on_publish/replicate/manual);
Pinata is best-effort and never the write backend.
