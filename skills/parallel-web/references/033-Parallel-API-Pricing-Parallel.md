# Parallel API Pricing - Parallel

Source: https://docs.parallel.ai/getting-started/pricing

## [​](#summary) Summary

| API | Price | Use case | Reasoning | Type | Latency |
| --- | --- | --- | --- | --- | --- |
| Search | $ | Page and excerpt retrieval, latency-sensitive queries | - | Synchronous | 200ms-3s |
| Extract | $ | Page content retrieval | - | Synchronous | 1-20s |
| Task | $-$$$$ | Deep research, enrichment, custom research | Low-High | Asynchronous | 10s - 2hr |
| Responses | $-$$$ | Grounded answers with live web research (OpenAI-compatible) | Low-High | Synchronous | 5-60s |
| Monitor | $-$$ | Always-on web monitoring | Low | Asynchronous | Ambient |
| FindAll | $-$$$$ | Verified list / database building | Low-High | Asynchronous | 10s - 2hr |
| Entity Search | $ | People & company search | - | Synchronous | 1-3s |
| Chat | $ | Grounded chat completions | Low | Synchronous | 1-3s |

## [​](#web-tools) Web Tools

### [​](#search-api) Search API

By default, the Search API returns 10 page results and their excerpts per request. Pricing varies by [mode](/search/modes).

| Component | Cost ($/1000) |
| --- | --- |
| Per 1,000 `turbo` requests (default 10 results) | 1 |
| Per 1,000 `basic` or `advanced` requests (default 10 results) | 5 |
| Per 1,000 additional page results & excerpts | 1 |

**Cost formula (`turbo`):**
total cost=0.001+(0.001×additional results & excerpts)\text{total cost} = 0.001 + (0.001 \times \text{additional results \& excerpts})total cost=0.001+(0.001×additional results & excerpts)
**Cost formula (`basic` / `advanced`):**
total cost=0.005+(0.001×additional results & excerpts)\text{total cost} = 0.005 + (0.001 \times \text{additional results \& excerpts})total cost=0.005+(0.001×additional results & excerpts)

### [​](#extract-api) Extract API

| Component | Cost ($/1000) |
| --- | --- |
| Per 1,000 URLs | 1 |

## [​](#web-agents) Web Agents

### [​](#task-api) Task API

Task API pricing is based on the [processor](/task-api/guides/choose-a-processor) you select. Cost is per 1,000 Task Runs. Fast processors have the same pricing as their standard counterparts.

- Standard
- Fast

| Processor | Cost ($/1000) | Latency | Strengths |
| --- | --- | --- | --- |
| `lite` | 5 | 10s - 60s | Basic metadata, fallback, low latency |
| `base` | 10 | 15s - 100s | Reliable standard enrichments |
| `core` | 25 | 60s - 5min | Cross-referenced, moderately complex outputs |
| `core2x` | 50 | 60s - 10min | High complexity cross referenced outputs |
| `pro` | 100 | 2min - 10min | Exploratory web research |
| `ultra` | 300 | 5min - 25min | Advanced multi-source deep research |
| `ultra2x` | 600 | 5min - 50min | Difficult deep research |
| `ultra4x` | 1200 | 5min - 90min | Very difficult deep research |
| `ultra8x` | 2400 | 5min - 2hr | The most difficult deep research |

| Processor | Cost ($/1000) | Latency | Strengths |
| --- | --- | --- | --- |
| `lite-fast` | 5 | 10s - 20s | Basic metadata, fallback, lowest latency |
| `base-fast` | 10 | 15s - 50s | Reliable standard enrichments |
| `core-fast` | 25 | 15s - 100s | Cross-referenced, moderately complex outputs |
| `core2x-fast` | 50 | 15s - 3min | High complexity cross referenced outputs |
| `pro-fast` | 100 | 30s - 5min | Exploratory web research |
| `ultra-fast` | 300 | 1min - 10min | Advanced multi-source deep research |
| `ultra2x-fast` | 600 | 1min - 20min | Difficult deep research |
| `ultra4x-fast` | 1200 | 1min - 40min | Very difficult deep research |
| `ultra8x-fast` | 2400 | 1min - 1hr | The most difficult deep research |

Pricing is per Task Run (row), not per output field (cell). A single Task Run can populate many output fields—whether you request 1 field or 20 fields, the cost is the same.

You are only charged for successfully completed runs. Failed runs are not billed.

### [​](#responses-api) Responses API

[Responses API](/responses-api/responses-quickstart) pricing is based on the `reasoning.effort` tier you select. Cost is per 1,000 requests. You are only charged for successful responses.

| Reasoning effort | Cost ($/1000) | Latency | Designed for |
| --- | --- | --- | --- |
| `low` | 10 | ~5-10s | Simple fact-retrieval questions |
| `medium` (default) | 50 | ~15-20s | Multi-hop fact-retrieval questions |
| `high` | 250 | ~30-60s | Deep-research questions requiring extensive search and synthesis |

### [​](#monitor-api) Monitor API

Monitor requests are priced per execution on a per-thousand (CPM) basis. Choose a processor based on query scope; both tiers deduplicate and reason over results.

| Processor | Cost ($/1000) | Best for |
| --- | --- | --- |
| `lite` | 3 | Narrow queries — a single entity, domain, or signal type |
| `base` | 10 | Wide queries — entity classes, topic areas, regions |

**Cost formula:**
total cost=cost per 1,000×number of executions/1000\text{total cost} = \text{cost per 1,000} \times \text{number of executions} / 1000total cost=cost per 1,000×number of executions/1000

### [​](#findall-api) FindAll API

FindAll API pricing is based on the [generator](/findall-api/core-concepts/findall-generator-pricing) you select, with a fixed cost plus a per-match cost.

| Generator | Fixed Cost | Per Match | Best For |
| --- | --- | --- | --- |
| `preview` | $0.10 | $0.00 | Testing queries (~10 candidates) |
| `base` | $0.25 | $0.03 | Broad, common queries where you expect many matches |
| `core` | $2.00 | $0.15 | Specific queries with moderate expected matches |
| `pro` | $10.00 | $1.00 | Highly specific queries with rare or hard-to-find matches |

**Cost formula:**
total cost=fixed cost+(cost per match×# matches)\text{total cost} = \text{fixed cost} + (\text{cost per match} \times \text{\# matches})total cost=fixed cost+(cost per match×# matches)
If you add [enrichments](/findall-api/features/findall-enrich), each enrichment adds its own per-match cost based on the Task API processor you choose (see Task API pricing above).

#### [​](#entity-search) Entity Search

[Entity Search](/findall-api/entity-search) is a fast, synchronous people-and-company search, the real-time counterpart to FindAll. It is priced per request, including 100 results by default.

| Component | Cost ($/1000) |
| --- | --- |
| Per 1,000 requests (default 100 results) | 5 |
| Per 1,000 additional results | 0.05 |

**Cost formula:**
total cost=0.005+(0.00005×additional results)\text{total cost} = 0.005 + (0.00005 \times \text{additional results})total cost=0.005+(0.00005×additional results)

### [​](#chat-api) Chat API

Chat API pricing is based on the model you select. Research models (`lite`, `base`, `core`) are Chat API wrappers over [Task API processors](/task-api/guides/choose-a-processor) and share the same pricing.

| Model | Type | Processor | Cost ($/1000) |
| --- | --- | --- | --- |
| `speed` | Simple completions | - | 5 |
| `lite` | Research | `lite` | 5 |
| `base` | Research | `base` | 10 |
| `core` | Research | `core` | 25 |

[Overview](/getting-started/overview)[Rate limits](/getting-started/rate-limits)

⌘I
