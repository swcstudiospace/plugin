# CLI Reviews on Self-Hosted Greptile

Source: https://www.greptile.com/docs/self-hosting/cli-reviews

The Greptile CLI can run reviews against a self-hosted deployment using an **API key**. Browser OAuth sign-in becomes available automatically once your deployment bundles an authorization server that the API advertises — no CLI changes needed.

Requires a server release from **2026-05-14 or later** (the `/v1/headless-review` surface). Older servers return a “not supported” error to the CLI.

## [​](#server-setup) Server setup

1

Enable headless reviews on the API

Set `services.reviews.headless: true` in your deployment yaml (emitted to the API as `HEADLESS_REVIEW_ENABLED=true`), or set the environment variable directly on the `api` service if your packaging doesn’t emit it yet. The default is off.

2

Keep the sandbox backend as bwrap

`review_backend: bwrap` (the default) runs reviews in local sandboxes with zero cloud dependencies. Do **not** copy `grepbox` from Greptile Cloud configs — it is a cloud-only backend.

3

Onboard the repository

CLI reviews require the repository’s organization to be onboarded through your deployment’s web dashboard first. Repository onboarding from the CLI is OAuth-only and arrives with the on-prem authorization server.

4

Mint an API key

An org admin creates the API key in the web dashboard. Keys are tenant-scoped; reviews run under the identity that owns the key.

## [​](#cli-setup) CLI setup

Point the CLI at your deployment **once per machine**, then authenticate:

```
greptile settings set apiBaseUrl https://greptile-api.acme.internal
greptile login --api-key        # prompts for the key (reads stdin when piped)
greptile whoami                 # verify identity + target
```

`greptile login --api-key` prompts for the key on a terminal and reads one line from stdin otherwise; unattended jobs should set `GREPTILE_API_KEY` instead of invoking the prompt.
The target line is printed on every credential-bearing command (`Using Greptile at https://greptile-api.acme.internal (from settings)`), so a misdirected CLI is always visible.

Environment variables can never introduce a new deployment by themselves: `GREPTILE_API_BASE_URL` pointing at an origin your settings don’t trust is refused loudly. This is deliberate — it stops a hostile repo’s `.envrc` or CI env from silently redirecting your API key. Trust an origin with `greptile settings set apiBaseUrl`, or accept the interactive first-contact prompt.

### [​](#ci-recipe) CI recipe

```
# one-time, in the CI image or a setup step:
greptile settings set apiBaseUrl https://greptile-api.acme.internal
# per job:
export GREPTILE_API_KEY=<key>
greptile review --json
```

If your CI runs under a user with no passwd database entry (distroless images, OpenShift random UIDs), the CLI falls back to `$XDG_CONFIG_HOME`/`$HOME` for its settings file — ensure the file is owned by the job user and not group/other-writable, and lives outside the checked-out repository.

## [​](#private-certificate-authorities) Private certificate authorities

Point Node at your CA bundle — never disable TLS validation:

```
export NODE_EXTRA_CA_CERTS=/etc/ssl/corp-ca.pem
# or, on Node >= 22.15:
export NODE_USE_SYSTEM_CA=1
```

`NODE_TLS_REJECT_UNAUTHORIZED=0` is refused by the CLI on every credential-bearing command.

## [​](#verification-sequence) Verification sequence

```
greptile whoami                          # target + identity
greptile review                          # from a repo whose org is onboarded
greptile review status                   # 0 complete, 1 none, 3 running, 4 failed, 5 cancelled
curl https://greptile-api.acme.internal/.well-known/greptile-deployment
                                         # → { "webBaseUrl": ... } on current releases
```

## [​](#oauth-sign-in-when-your-deployment-bundles-an-authorization-server) OAuth sign-in (when your deployment bundles an authorization server)

When the API’s RFC 9728 protected-resource document advertises an authorization server, `greptile login` discovers it and runs a browser PKCE flow against it directly. The API’s advertised OAuth resource is coupled to its public URL (`OAUTH_AUDIENCE` defaults to `<api-url>/mcp`, where `<api-url>` is the API’s `URL` env var — make sure it is set to the API’s public origin, or the advertised resource is malformed); if you override `OAUTH_AUDIENCE`, it must stay equal to `<api-url>/mcp` or the CLI will refuse with an alignment error. Until an authorization server ships, `greptile login` on a self-hosted target points users to `greptile login --api-key`.

## [​](#notes-and-limits) Notes and limits

- **Providers**: GitHub and GitLab repositories only (remote URL detection).
- **Air-gapped installs**: `greptile update` and the update notifier talk to the public npm registry; mirror the `greptile` npm package into your internal registry or pin versions in your image, and set `GREPTILE_NO_UPDATE_CHECK=1` to silence the notifier. Diagram rendering auto-installs a mermaid renderer on first use — set `GREPTILE_NO_AUTO_INSTALL=1` (or pre-install `mmdr`) on machines without registry access.
- **Network**: the CLI needs direct HTTPS reach to your API origin **and** your web dashboard (plus your IdP for the OAuth era) — VPN or internal DNS as appropriate. The CLI’s own request path has **no `HTTP(S)_PROXY` support**. It never calls Greptile Cloud when targeting a custom deployment.
- **`sudo -E`** is unsupported for custom targets: it splits the credential home from the trust-anchor home.
- **Windows**: the settings-file permission check is skipped (POSIX modes aren’t meaningful there); use NTFS ACLs to protect the file.
- **One deployment at a time**: credentials are bound to the deployment they were minted for. Switching targets requires signing in again, and `greptile review show` history is identity-scoped per deployment.
- **Version skew**: downgrading the CLI below this feature strips the deployment binding from stored credentials; the older CLI then refuses to send them to a custom origin and asks for a fresh sign-in.

⌘I
