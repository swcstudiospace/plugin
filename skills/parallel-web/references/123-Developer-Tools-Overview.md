# Developer Tools Overview

Source: https://docs.parallel.ai/integrations/developer-quickstart.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Developer Tools Overview
> Choose the right way to integrate Parallel into your AI workflow — CLI, MCP, or SDK

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

Parallel offers three integration paths for developers. The right choice depends on where your agent runs, how it authenticates, and how much control you need.
| Integration | Best for | Auth model | Docs |
| ----------------------------- | -------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| \*\*CLI + Skills\*\* | Coding agents with terminal access | API key or OAuth login | [CLI](/integrations/cli), [Agent Skills](/integrations/agent-skills) |
| \*\*MCP Servers\*\* | Chat assistants and LLM-powered apps | OAuth or API key | [MCP Quickstart](/integrations/mcp/quickstart), [Programmatic Use](/integrations/mcp/programmatic-use) |
| \*\*SDK / Native Tool Calling\*\* | Production agents needing full control | API key | [Python](https://pypi.org/project/parallel-web/), [TypeScript](https://www.npmjs.com/package/parallel-web/) |
## Decision guide

\*\*Use the CLI with a plugin or Agent Skills.\*\*
If your agent has terminal access — Claude Code, Cursor, Windsurf, Cline, GitHub Copilot — the CLI is the most capable integration. It exposes all Parallel APIs (search, extract, research, enrich, findall, monitor) and produces structured JSON that agents parse natively.
CLI commands are also deeply embedded in LLM training data. Models already know how to compose shell commands, pipe output, and handle JSON — no schema overhead required.
\*\*Why not MCP?\*\* In terminal-based agents, CLI tools consume far fewer context tokens than MCP tool schemas. An MCP server dumps its full tool catalog into the context window upfront. A CLI call like `parallel-cli search "query" --json` costs only the tokens for the command and its output.
| Agent | Recommended setup |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| Claude Code | [Claude Code Plugin](/integrations/claude-code-marketplace) (installs CLI + slash commands + auto-skills) |
| Cursor | [Cursor Plugin](/integrations/cursor-marketplace) or [Agent Skills](/integrations/agent-skills) |
| Cline, Copilot, Windsurf | [Agent Skills](/integrations/agent-skills) (uses CLI under the hood) |
| Other CLI agents | [Install the CLI](/integrations/cli) directly and use `--json` output |

\*\*Use MCP servers.\*\*
Chat-based assistants like Claude Desktop, Claude Web, ChatGPT, and Gemini don't have terminal access — they connect to external tools through MCP. Parallel's MCP servers also handle OAuth automatically, so users authenticate through their browser without managing API keys.
| MCP Server | Tools | Use case |
| ------------------------------------------ | ------------------------------------- | --------------------------------------- |
| [Search MCP](/integrations/mcp/search-mcp) | `web\_search`, `web\_fetch` | Real-time search and content extraction |
| [Task MCP](/integrations/mcp/task-mcp) | Create task, Create group, Get result | Deep research, data enrichment |
\*\*Server URLs:\*\*
\* Search: `https://search.parallel.ai/mcp`
\* Tasks: `https://task-mcp.parallel.ai/mcp`
See the [MCP Quickstart](/integrations/mcp/quickstart) for one-click install links for your platform.

\*\*Use MCP servers programmatically for speed, or the SDK for full control.\*\*
If you're building an LLM-powered application, you have two production-ready paths:
### MCP (fastest integration)
Both OpenAI and Anthropic support connecting to Parallel's hosted MCP servers directly from their APIs. You pass the server URL and your API key — the model gets tool calling with no custom schemas to write or maintain.
| Platform | How it works | Guide |
| ---------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| OpenAI Responses API | Pass MCP server URL as a `type: "mcp"` tool | [Programmatic Use](/integrations/mcp/programmatic-use#openai-integration) |
| Anthropic Messages API | Pass MCP server URL via `mcp\_servers` parameter | [Programmatic Use](/integrations/mcp/programmatic-use#anthropic-integration) |
### SDK (full control)
When you need fine-grained control over tool schemas, custom response formatting, or access to APIs not available via MCP (FindAll, Monitor), import the Parallel SDK and define your own tool functions.
| Framework | Integration |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| OpenAI function calling | [OpenAI Tool Calling guide](/integrations/openai-tool-calling) |
| LangChain | [LangChain integration](/integrations/langchain) (`langchain-parallel` package) |
| Vercel AI SDK | [Vercel integration](/integrations/vercel) |
| Any framework | Use the [Python SDK](https://pypi.org/project/parallel-web/) or [TypeScript SDK](https://www.npmjs.com/package/parallel-web/) directly |
MCP and SDK are not mutually exclusive. Many teams start with MCP for speed, then move specific tools to SDK-based definitions as they need more control.
## Quick comparison
### API coverage
| Capability | CLI | MCP | SDK |
| --------------- | --- | ---------------------------- | --- |
| Search | Yes | Yes (Search MCP) | Yes |
| Extract | Yes | Yes (Search MCP `web\_fetch`) | Yes |
| Deep Research | Yes | Yes (Task MCP) | Yes |
| Data Enrichment | Yes | Yes (Task MCP) | Yes |
| FindAll | Yes | No | Yes |
| Monitor | Yes | No | Yes |
### Authentication
| Method | How it works |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| \*\*CLI\*\* | `parallel-cli login` opens a browser for OAuth, or `parallel-cli login --device` for headless/SSH environments. You can also set `PARALLEL\_API\_KEY` as an environment variable. Credentials are stored locally. |
| \*\*MCP\*\* | In chat assistants, OAuth is built in — your client handles the browser-based auth flow automatically. For [programmatic use](/integrations/mcp/programmatic-use), pass your `PARALLEL\_API\_KEY` as a Bearer token. |
| \*\*SDK\*\* | Set `PARALLEL\_API\_KEY` in your environment. For multi-user apps, use the [OAuth Provider](/integrations/oauth-provider) to obtain keys on behalf of users. |
## Get started

Install the CLI, authenticate, and add agent skills for your coding environment.

Connect Search MCP or Task MCP to a chat assistant or your own app.

Define Parallel as a native tool in your agent framework. See also: [LangChain](/integrations/langchain), [Vercel](/integrations/vercel).
## Can I use multiple integration methods?
Yes. Many teams use CLI for local development and coding agents, MCP for chat assistants and LLM-powered apps, and the SDK for custom agent loops that need full control. They all hit the same Parallel APIs with the same API key.
