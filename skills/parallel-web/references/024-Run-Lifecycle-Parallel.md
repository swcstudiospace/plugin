# Run Lifecycle - Parallel

Source: https://docs.parallel.ai/findall-api/core-concepts/findall-lifecycle

## [​](#run-statuses-and-termination-reasons) Run Statuses and Termination Reasons

FindAll runs normally progress from `queued` → `running` → a terminal state (`completed`, `failed`, or `cancelled`). The response schema also defines `cancelling` and `action_required` for compatibility with the shared run-status contract.
A run is **active** when `status.is_active` is `true`. The shared status schema treats `queued`, `running`, and `cancelling` as active, although current FindAll cancellation moves directly from an active state to `cancelled`.

### [​](#status-definitions) Status Definitions

| Status | `is_active` | Description |
| --- | --- | --- |
| `queued` | `true` | Run is waiting to start processing |
| `running` | `true` | Run is actively generating, evaluating, or enriching candidates |
| `cancelling` | `true` | Shared transitional status; current FindAll runs do not emit it |
| `action_required` | `false` | Run is halted because its state requires attention |
| `completed` | `false` | Run finished; inspect `termination_reason` for why |
| `failed` | `false` | Run failed or timed out |
| `cancelled` | `false` | Run was cancelled by the user |

You can extend a non-preview run while it is queued or running. A completed run can be extended only when its `termination_reason` is `match_limit_met`. Enrichments can be added after creation; adding one to any terminal run requeues that run while the enrichment is processed. Cancellation applies to active runs.

### [​](#termination-reasons) Termination Reasons

When a run reaches a terminal state, it will have one of these termination reasons:

| Termination Reason | Description | Can Extend? |
| --- | --- | --- |
| `match_limit_met` | Successfully found the requested number of matches | ✅ Yes |
| `low_match_rate` | Match rate too low to continue efficiently | ❌ No - try a more powerful generator |
| `candidates_exhausted` | All available candidates have been processed | ❌ No - broaden query |
| `error_occurred` | Run encountered an error and cannot be continued | ❌ No |
| `timeout` | Run timed out and cannot be continued | ❌ No |
| `user_cancelled` | Run was cancelled by the user | ❌ No |
| `insufficient_funds` | Account balance was exhausted before more work could be scheduled | ❌ No — add funds and create a new run |

## [​](#related-topics) Related Topics

- **[Generators and Pricing](/findall-api/core-concepts/findall-generator-pricing)**: Understand generator options and pricing
- **[Preview](/findall-api/features/findall-preview)**: Test queries with 5–10 evaluated candidates before running full searches
- **[Enrichments](/findall-api/features/findall-enrich)**: Extract additional structured data for matched candidates
- **[Extend Runs](/findall-api/features/findall-extend)**: Increase match limits without paying new fixed costs
- **[Streaming Events](/findall-api/features/findall-sse)**: Receive real-time updates via Server-Sent Events
- **[Webhooks](/findall-api/features/findall-webhook)**: Configure HTTP callbacks for run completion and matches
- **[API Reference](/api-reference/findall/create-findall-run#response-status)**: Complete endpoint documentation

[Candidates](/findall-api/core-concepts/findall-candidates)[Preview](/findall-api/features/findall-preview)

⌘I
