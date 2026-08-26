# Docker MCP Catalog and Toolkit | Docker Docs

Source: https://docs.docker.com/ai/mcp-catalog-and-toolkit

Back

[Manuals](https://docs.docker.com/manuals/)

- [Get started](/get-started/)
- [Guides](/guides/)
- [Reference](/reference/)

# Docker MCP Catalog and Toolkit

Ask Gordon

Copy Markdown

View Markdown

---

Table of contents

---

Availability:
Beta

[Model Context Protocol](https://modelcontextprotocol.io/introduction) (MCP) is
an open protocol that standardizes how AI applications access external tools
and data sources. By connecting LLMs to local development tools, databases,
APIs, and other resources, MCP extends their capabilities beyond their base
training.

The challenge is that running MCP servers locally creates operational friction.
Each server requires separate installation and configuration for every
application you use. You run untrusted code directly on your machine, manage
updates manually, and troubleshoot dependency conflicts yourself. Configure a
GitHub server for Claude, then configure it again for Cursor, and so on. Each
time you manage credentials, permissions, and environment setup.

## [Docker MCP features](#docker-mcp-features)

The
[MCP Toolkit](/ai/mcp-catalog-and-toolkit/toolkit/) and
[MCP
Gateway](/ai/mcp-catalog-and-toolkit/mcp-gateway/) solve these challenges
through centralized management. Instead of configuring each server for every AI
application separately, you set things up once and connect all your clients to
it. The workflow centers on three concepts: catalogs, profiles, and clients.

![MCP overview](https://docs.docker.com/ai/mcp-catalog-and-toolkit/images/mcp_toolkit.avif)

[Catalogs](/ai/mcp-catalog-and-toolkit/catalog/) are curated collections of
MCP servers. The Docker MCP Catalog provides 300+ verified servers packaged as
container images with versioning, provenance, and security updates. Organizations
can create
[custom
catalogs](/ai/mcp-catalog-and-toolkit/catalog/#custom-catalogs) with approved
servers for their teams.

[Profiles](/ai/mcp-catalog-and-toolkit/profiles/) organize servers into named
collections for different projects. Your "web-dev" profile might use GitHub and
Playwright; your "backend" profile, database tools. Profiles support both
containerized servers from catalogs and remote MCP servers. Configure a profile
once, then share it across clients or with your team.

Clients are the AI applications that connect to your profiles. Claude Code,
Cursor, Zed, and others connect through the MCP Gateway, which routes requests
to the right server and handles authentication and lifecycle management.

> MCP Gateway as part of Docker AI Governance is an invite-only feature. [Contact Docker Sales](https://www.docker.com/pricing/contact-sales/) to learn more.

## [Learn more](#learn-more)

[Learn how to quickly install and use the MCP Toolkit to set up servers and clients.](/ai/mcp-catalog-and-toolkit/get-started/)

[Browse Docker's curated collection of verified MCP servers](/ai/mcp-catalog-and-toolkit/catalog/)

[Organize servers into profiles for different projects and share configurations](/ai/mcp-catalog-and-toolkit/profiles/)

[Use Docker Desktop's UI to discover, configure, and manage MCP servers](/ai/mcp-catalog-and-toolkit/toolkit/)

[Use the CLI and Gateway to run MCP servers with custom configurations](/ai/mcp-catalog-and-toolkit/mcp-gateway/)

[Discover and add MCP servers on-demand using natural language. This feature is experimental.](/ai/mcp-catalog-and-toolkit/dynamic-mcp/)

[Common questions about MCP security, credentials, and server verification](/ai/mcp-catalog-and-toolkit/faqs/)

[Cloud sandboxes for AI agents with built-in MCP Catalog access](/ai/mcp-catalog-and-toolkit/e2b-sandboxes/)
