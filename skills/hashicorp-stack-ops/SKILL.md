---
name: hashicorp-stack-ops
description: Use when running Nomad/Consul/Vault on Tailscale hosts.
version: 1.0.0
metadata:
  tags: [hashicorp, nomad, consul, vault, tailscale, devops]
---

# HashiCorp Stack Ops (Tailscale-hosted control planes)

## When to Use
Standing up, hardening, or fixing a Nomad (+Consul+Vault) control plane on a Linux host — especially multi-homed hosts (Tailscale + Docker bridges), e.g. the ai-cluster repo's `bootstrap/install.sh` Day-0 path.

## Bootstrap sequence (ai-cluster pattern)
1. Pre-flight: OS/arch, systemd running, disk free, ports 4646/4647/8500/8200 unused, package repos reachable.
2. Run the repo bootstrap (`bootstrap/install.sh`) — installs nomad/consul/vault/tailscale, writes `/etc/*.d` configs, enables units.
3. Expect Consul to fail first boot on multi-homed hosts → apply Pitfall 1 before anything depends on it.
4. Harden all three listeners per Pitfall 6 (tailnet/loopback only) before calling it done.
5. Vault: `operator init -key-shares=N -key-threshold=N -format=json` → chmod 600 root-only file; unseal (Pitfall 3); `secrets enable -path=secret kv-v2`; seed app secrets; write least-privilege ACL policies.
6. Nomad: `acl bootstrap` once, save SecretID 0600; export `NOMAD_ADDR` (Pitfall 4).

## Pitfalls

**1. Consul: "Multiple private IPv4 addresses found. Please configure one with 'bind' and/or 'advertise'."**
Cause: `bind_addr = "0.0.0.0"` is ambiguous when the host has several private ranges (Tailscale 100.x + Docker 172.x bridges).
Fix: pin to the tailnet NIC with a sockaddr template — `bind_addr = "{{ GetAllInterfaces | include \"name\" \"tailscale0\" | attr \"address\" }}"`, and set `client_addr = "127.0.0.1"`. Do NOT use `GetInterfaceIPs` (requires an argument; parse error). Validate with `consul validate /etc/consul.d` before restarting. See `templates/consul-server.hcl`.

**2. Single-node Raft election exceeds systemd's start timeout.**
Symptom: unit flaps `activating`/`failed` while the service is actually healthy — `consul members` shows `alive` and the leader API answers.
Fix: drop-in `TimeoutStartSec=600` (see `templates/systemd-timeout-dropin.conf`), `daemon-reload`, `systemctl reset-failed <unit>`, restart with `--no-block`, then verify by polling `consul members` + `curl /v1/status/leader` — never trust `is-active` alone during startup windows. Never sit blocked on `systemctl restart` for these units in autonomous sessions; it can hold a foreground command hostage past any timeout.

**3. `vault operator unseal -` with a piped key can fail with "'key' must be a valid hex or base64 string".**
Pass the key as an argument instead: `vault operator unseal "$KEY"`. Verify with `vault status | grep Sealed`. If init succeeded but unseal failed, the seal state persists — just retry the unseal; never re-run `operator init`.

**4. Binding Nomad to the tailnet IP moves its HTTP API off loopback.**
After `bind_addr = "{{ GetInterfaceIP \"tailscale0\" }}"`, the CLI needs `export NOMAD_ADDR=http://<tailscale-ip>:4646` — `127.0.0.1:4646` silently fails (e.g. `acl bootstrap -json` returning an empty SecretID). Drop an env helper in `/etc/profile.d/`.

**5. Don't batch privileged mutations into one mega-command in autonomous sessions.**
A consent/approval gate on any single piece (service restarts, `rm`, writes outside the repo such as `/etc/profile.d`) blocks or kills the WHOLE chain, losing completed sub-steps' outputs. Split flagged/system-touching operations into minimal separate commands; keep read-only verification batched freely.

**6. Zero public exposure, always.**
On a public VPS with the firewall off, default configs listen on `0.0.0.0` (Vault 8200, Consul 8300/8500, Nomad 4646/4647). Pin: Vault listener + Consul client_addr → `127.0.0.1`; Nomad bind_addr → tailnet IP; Consul serf/LAN → tailnet via sockaddr template. Verify with `ss -tlnp | grep -E ':(8200|8500|4646|4647)\b'` — everything should show `127.0.0.1` or the tailnet IP only.

## Verification
- `consul members` → `alive`; `curl -s http://127.0.0.1:8500/v1/status/leader` → an address, not `""`.
- `vault status` → `Sealed false`; `vault policy list` shows app policies.
- `nomad node status` (with NOMAD_ADDR) → node `ready`; jobspec gate: `nomad job validate <file>`.

## Support files
- `references/single-node-deployment-notes.md` — worked deployment log (exact commands, error strings, host context, open items).
- `templates/consul-server.hcl` — known-good single-node Consul config pinned to tailscale0.
- `templates/systemd-timeout-dropin.conf` — drop-in for units whose Raft election outlives the default start timeout.
