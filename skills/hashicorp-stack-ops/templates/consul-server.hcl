# Known-good single-node Consul server config for multi-homed (Tailscale) hosts.
# Copy to /etc/consul.d/server.hcl and adjust DC/bootstrap_expect as needed.
# Validate before restarting: consul validate /etc/consul.d
#
# Why not bind_addr = "0.0.0.0": hosts with several private ranges
# (tailscale0 100.x + docker0 172.x) abort startup with
# "Multiple private IPv4 addresses found".
#
# sockaddr note: use GetAllInterfaces (no args). GetInterfaceIPs requires an
# argument and fails to parse in this template position.

data_dir    = "/opt/consul/data"
bind_addr   = "{{ GetAllInterfaces | include \"name\" \"tailscale0\" | attr \"address\" }}"
client_addr = "127.0.0.1"
server      = true
bootstrap_expect = 1
ui_config { enabled = true }
connect { enabled = true }
ports { grpc = 8502 }

# Production TODOs (per repo security rules):
# - TLS on all listeners (Consul PKI / Vault-issued certs), verify_incoming
# - gossip encryption key from Vault
# - default-deny intentions once Connect services exist
