# Search Modes

Source: https://docs.parallel.ai/search/modes.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Search Modes
> Configure the Search API mode for your use case

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

Search offers three modes. Use `turbo` for the lowest latency and cost in real-time, high-volume workloads; `basic` for quick retrieval across most agent workloads; and `advanced` for the highest-quality, multi-hop results. If `mode` isn't set, requests default to `advanced`.
Not sure which mode to pick? Start with `basic`. It is the right choice for most applications and use cases. Reach for `turbo` when latency and cost matter most for simple, high-volume lookups, and `advanced` when result quality matters more than latency.
## Available modes
| Mode | What it does | Latency | Cost | Best for |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `turbo` | Lowest latency and cost; built to ground every call. | \~200ms | \$1 per 1,000 requests | Latency-sensitive, high-volume workloads (e.g. chat, web search tools, RAG pre-filtering, high-volume lookups) |
| `basic` | Optimized for quick retrieval; returns deeper context per call than Turbo. Works best with 2-3 high-quality `search\_queries`. | \~1s | \$5 per 1,000 requests | Most agent workloads |
| `advanced` (default) | Uses a more advanced retrieval and compression pipeline for higher-quality results. | \~3s | \$5 per 1,000 requests | Multi-hop background agents that can tolerate extra latency for better depth and cost-efficiency (e.g., code review agents, deep research) |
Turbo currently supports English and Japanese-language queries. For broader multilingual coverage, use `basic` or `advanced`.
## Example
Switching modes is a single parameter change. The rest of your request stays the same:
```json theme={"system"}
{
"mode": "turbo",
"objective": "What is the current price of NVIDIA stock?",
"search\_queries": ["NVIDIA stock price", "NVDA quote today"]
}
```
