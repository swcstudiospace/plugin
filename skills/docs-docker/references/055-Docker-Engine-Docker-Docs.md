# Docker Engine | Docker Docs

Source: https://docs.docker.com/engine

Back

[Manuals](https://docs.docker.com/manuals/)

- [Get started](/get-started/)
- [Guides](/guides/)
- [Reference](/reference/)

# Docker Engine

Ask Gordon

Copy Markdown

View Markdown

---

Table of contents

---

Docker Engine is an open source containerization technology for building and
containerizing your applications. Docker Engine acts as a client-server
application with:

- A server with a long-running daemon process
  [`dockerd`](/reference/cli/dockerd).
- APIs which specify interfaces that programs can use to talk to and instruct
  the Docker daemon.
- A command line interface (CLI) client
  [`docker`](/reference/cli/docker/).

The CLI uses
[Docker APIs](https://docs.docker.com/reference/api/engine/) to control or interact with the Docker
daemon through scripting or direct CLI commands. Many other Docker applications
use the underlying API and CLI. The daemon creates and manages Docker objects,
such as images, containers, networks, and volumes.

For more details, see
[Docker Architecture](https://docs.docker.com/get-started/docker-overview/#docker-architecture).

[Learn how to install the open source Docker Engine for your distribution.](/engine/install)

[Use persistent data with Docker containers.](/storage)

[Manage network connections between containers.](/network)

[Learn how to view and read container logs.](/config/containers/logging/)

[Tidy up unused resources.](/config/pruning)

[Delve into the configuration options of the Docker daemon.](/config/daemon)

[Run Docker without root privileges.](/engine/security/rootless)

[Find out what features of Docker Engine you should stop using.](/engine/deprecated/)

[Read the release notes for the latest version.](/engine/release-notes)

## [Licensing](#licensing)

Commercial use of Docker Engine obtained via Docker Desktop
within larger enterprises (exceeding 250 employees OR with annual revenue surpassing
$10 million USD), requires a [paid subscription](https://www.docker.com/pricing?ref=Docs&refAction=DocsEngine).
Apache License, Version 2.0. See [LICENSE](https://github.com/moby/moby/blob/master/LICENSE) for the full license.
