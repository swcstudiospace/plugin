# Docker Sandboxes | Docker Docs

Source: https://docs.docker.com/ai/sandboxes

Back

[Manuals](https://docs.docker.com/manuals/)

- [Get started](/get-started/)
- [Guides](/guides/)
- [Reference](/reference/)

# Docker Sandboxes

Ask Gordon

Copy Markdown

View Markdown

---

Table of contents

---

Docker Sandboxes run AI coding agents in isolated microVM sandboxes. Each
sandbox gets its own Docker daemon, filesystem, and network — the agent can
build containers, install packages, and modify files without touching your host
system.

> The `sbx` CLI is free to use, including for commercial work. Only
> [organization governance](https://docs.docker.com/ai/sandboxes/governance/) requires a separate paid subscription.

Organization admins can
[centrally manage sandbox network and filesystem policies](https://docs.docker.com/ai/sandboxes/governance/org/),
so the same rules apply uniformly across every developer's machine. Available
on a separate paid subscription.

## [Get started](#get-started)

For complete system requirements, see the
[get started prerequisites](https://docs.docker.com/ai/sandboxes/get-started/#prerequisites).

Install the `sbx` CLI and sign in:

macOS

Windows

Linux (Ubuntu)

```
$ brew trust docker/tap
$ brew install docker/tap/sbx
$ sbx login
```

```
> winget install -h Docker.sbx
> sbx login
```

```
$ curl -fsSL https://get.docker.com | sudo REPO_ONLY=1 sh
$ sudo apt-get install docker-sbx
$ sudo usermod -aG kvm $USER
$ newgrp kvm
$ sbx login
```

Then launch an agent in a sandbox:

```
$ cd ~/my-project
$ sbx run claude
```

See the [get started guide](https://docs.docker.com/ai/sandboxes/get-started/) for a full walkthrough, or jump to
the [usage guide](https://docs.docker.com/ai/sandboxes/usage/) for basic commands.

## [Learn more](#learn-more)

- [Agents](https://docs.docker.com/ai/sandboxes/agents/) — supported agents and per-agent configuration
- [Integrations](https://docs.docker.com/ai/sandboxes/integrations/) — connect editors and apps like VS Code and
  Cursor to a sandbox over SSH
- [Customize](https://docs.docker.com/ai/sandboxes/customize/) — reusable templates and declarative kits for
  extending or tailoring sandboxes
- [Architecture](https://docs.docker.com/ai/sandboxes/architecture/) — microVM isolation, workspace mounting,
  networking
- [Security](https://docs.docker.com/ai/sandboxes/security/) — isolation model, credential handling, and
  network policies
- [CLI reference](/reference/cli/sbx/) — full list of `sbx` commands and options
- [Troubleshooting](https://docs.docker.com/ai/sandboxes/troubleshooting/) — common issues and fixes
- [FAQ](https://docs.docker.com/ai/sandboxes/faq/) — login requirements, telemetry, etc

## [Feedback](#feedback)

Your feedback shapes what gets built next. If you run into a bug, hit a
missing feature, or have a suggestion, open an issue at
[github.com/docker/sbx-releases/issues](https://github.com/docker/sbx-releases/issues).
