# API Rate Limits - Parallel

Source: https://docs.parallel.ai/getting-started/rate-limits

The following table shows the default rate limits for each Parallel API product:

| Product | Default Quota | What Counts as a Request |
| --- | --- | --- |
| Search | 600 per min | Each POST to `/v1/search` |
| Extract | 600 per min | Each POST to `/v1/extract` |
| Tasks/TaskGroups | 2,000 per min | Each POST to `/v1/tasks/runs` or `/v1/tasks/groups/{taskgroup_id}/runs` (creating tasks) |
| Chat | 300 per min | Each POST to `/v1beta/chat/completions` |
| FindAll | 300 per hour | Each POST to `/v1beta/findall/runs` (creating a generator) |
| Entity Search | 600 per min | Each POST to `/v1beta/findall/entity-search` |
| Monitor | 300 per min | Each POST to `/v1alpha/monitors` |

**Rate limits apply to POST requests that create new resources.** GET requests
(retrieving results, checking status) do not count against these limits. For
example, polling a task’s status with `GET /v1/tasks/runs/{run_id}` does not
consume your Tasks rate limit—only creating new tasks does.

## [​](#pricing) Pricing

Rate limits are separate from pricing. For cost information, see [Pricing](/getting-started/pricing).

## [​](#need-higher-limits) Need higher limits?

If you need to expand your rate limits, please contact **[support@parallel.ai](mailto:support@parallel.ai)** with your use case and requirements.

[Pricing](/getting-started/pricing)[Glossary](/getting-started/glossary)

⌘I
