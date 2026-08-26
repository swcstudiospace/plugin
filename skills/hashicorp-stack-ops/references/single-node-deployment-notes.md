# Single-node control-plane deployment notes (ai-cluster, srv1778002, 2026-08-24)

Worked log from a real bootstrap via `bootstrap/install.sh` on Ubuntu 24.04 x86_64,
4 vCPU / 15GiB RAM, no local GPU (GPU capacity joins later via ASG/Daytona).
Host is multi-homed: tailscale0 (100.90.229.45) + public NIC + Docker 172.x bridges.
All fixes below were verified against live services.

## Timeline of what actually happened

1. Pre-flight: systemd running, 63G disk free, ports 4646/4647/8500/8200 free,
   apt.releases.hashicorp.com + archive.ubuntu.com reachable, ufw INACTIVE.
2. `bash bootstrap/install.sh` → packages installed; **consul.service failed**:
   `==> Multiple private IPv4 addresses found. Please configure one with 'bind' and/or 'advertise'.`
   Nomad + Vault started fine (Nomad's config already pinned to tailscale0; Vault tolerated 0.0.0.0).
3. First fix attempt used `GetInterfaceIPs` in the sockaddr template → parse error
   (`wrong number of args for GetInterfaceIPs: want 1 got 0`). Correct function:
   `GetAllInterfaces` (no args).
4. Corrected `/etc/consul.d/server.hcl`, `consul validate` OK, restart → systemd
   reported timeout, BUT `consul members` showed `alive` and
   `curl http://127.0.0.1:8500/v1/status/leader` returned `"100.90.229.45:8300"`.
   Root cause: single-node Raft election outlives the unit's 90s TimeoutStartSec;
   systemd kept killing a healthy server (restart counter climbed to 5).
5. Added drop-in `TimeoutStartSec=600`. A subsequent blocking
   `systemctl restart consul` then held a foreground command past its 180s tool
   timeout even though the service was fine — use `--no-block` + poll instead.
6. Exposure hardening: sed'd `/etc/vault.d/vault.hcl` listener to 127.0.0.1:8200 and
   `/etc/nomad.d/server.hcl` bind_addr to the GetInterfaceIP tailscale0 form.
   Verified with `ss -tlnp`: 4646/4647 on 100.90.229.45 only; 8500/8200 loopback only.
7. Vault init: `vault operator init -key-shares=1 -key-threshold=1 -format=json`
   → `/root/vault-init.json` (chmod 600). Piped unseal (`vault operator unseal -`)
   failed with `'key' must be a valid hex or base64 string`; passing as argument worked.
   Root token → `/root/.vault-token` (600). Enabled kv-v2 at secret/, seeded
   `secret/data/facefusion/model key="REPLACE_WITH_REAL_MODEL_KEY"`, wrote policy
   `facefusion-job` (read on `secret/data/facefusion/*`).
8. `nomad acl bootstrap -json | jq -r .SecretID` returned EMPTY: Nomad API had moved
   off loopback after step 6 and NOMAD_ADDR wasn't set. Fix = export
   `NOMAD_ADDR=http://100.90.229.45:4646` first. ACL bootstrap itself remained
   consent-blocked at session end (see Open items).

## Open items at session end

- Nomad ACLs NOT bootstrapped yet; `/root/.nomad-token` absent. Next session:
  export NOMAD_ADDR, run `nomad acl bootstrap -json > tmp`, jq SecretID →
  `/root/.nomad-token` 600, self-test with `nomad acl token self`.
- Jobspec gate not run: `nomad job validate nomad/jobs/facefusion/facefusion-signed.nomad.hcl`
  (will fail on placeholder image digest until a real registry image exists).
- Env helper `/etc/profile.d/hashicorp.sh` (VAULT_ADDR + NOMAD_ADDR) not written (consent).
- Repo patch pending: bootstrap/install.sh Consul bind_addr bug + TimeoutStartSec
  guidance (AGENTS.md wants shellcheck + commit trailer `Co-Authored-By: AimeeCodes <noreply@aimeecodes.dev>`).

## FaceFusion app build — info still needed from user (asked 2026-08-24)

1. Container image: registry + digest or build definition (no conda needed anywhere — deps live in the image).
2. Models/weights: which FaceFusion models, where stored, what MODEL_KEY gates.
3. Governance inputs for facefusion-submit lineage: submitter identity source, consent flags, hash scheme, retention periods; Vault Transit wiring for biometric data.
4. GPU capacity route: AWS ASG (needs creds + Packer build) vs existing daytona-sandbox node rejoining tailnet as Nomad client.
5. Interface: web UI :7865 over tailnet, batch submissions via Hermes skill, or both; operator Tailscale identities for access scoping.
