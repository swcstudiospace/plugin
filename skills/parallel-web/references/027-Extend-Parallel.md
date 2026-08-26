# Extend - Parallel

Source: https://docs.parallel.ai/findall-api/features/findall-extend

## [​](#overview) Overview

Extend allows you to increase the `match_limit` of an existing FindAll run to get more results using the same evaluation criteria—without paying the fixed cost again. Start with a small limit (10-20) to validate your criteria, then extend to get more matches.

cURL

Python

TypeScript

```
curl -X POST "https://api.parallel.ai/v1beta/findall/runs/findall_40e0ab8c10754be0b7a16477abb38a2f/extend" \
  -H "x-api-key: $PARALLEL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "additional_match_limit": 40 }'
```

```
from parallel import Parallel

client = Parallel(api_key="YOUR_API_KEY")

client.beta.findall.extend(
    findall_id="findall_40e0ab8c10754be0b7a16477abb38a2f",
    additional_match_limit=40
)
```

```
import Parallel from 'parallel-web';

const client = new Parallel({
  apiKey: process.env.PARALLEL_API_KEY
});

await client.beta.findall.extend(
  "findall_40e0ab8c10754be0b7a16477abb38a2f",
  {
    additional_match_limit: 40
  }
);
```

### [​](#how-extend-works) How Extend Works

- **Increases match limit:** The `additional_match_limit` you set is the **incremental** number of matches to add (not the total). For example, to go from 10 to 50 matches, set `additional_match_limit: 40`, not `50`.
- **Continues the same evaluation:** The **objective**, **entity type**, **generator**, and **match conditions** stay the same. Existing enrichments continue to run on new matches.
- **Handles run status automatically:**
  - If the run is *active*, it continues seamlessly up to the new match limit.
  - If the run is *completed*, it automatically “respawns” and resumes until reaching the new limit.
- **Pricing:** Extending has **no fixed cost—you only pay for the additional matches beyond the original run**. For example, extending from 10 to 100 matches means paying for 90 additional matches (plus evaluation costs).

### [​](#limitations) Limitations

- **Preview runs:** Cannot be extended. Use a full generator (`base`, `core`, or `pro`) if you plan to extend.
- **Total limit:** The current `match_limit` plus `additional_match_limit` cannot exceed 1,000.
- **Termination reason:** A completed run can be extended only when `termination_reason` is `match_limit_met`. Runs stopped for low match rate, exhausted candidates, insufficient funds, cancellation, timeout, or error must be replaced with a new run.
- **Fixed parameters:** Extend changes only `match_limit`. Use `/enrich` to add an enrichment; start a new run to change the objective, entity type, generator, match conditions, or an existing enrichment definition.

## [​](#related-topics) Related Topics

- **[Preview](/findall-api/features/findall-preview)**: Test queries with 5–10 evaluated candidates before running full searches
- **[Generators and Pricing](/findall-api/core-concepts/findall-generator-pricing)**: Understand generator options and pricing
- **[Enrichments](/findall-api/features/findall-enrich)**: Extract additional structured data for matched candidates
- **[Streaming Events](/findall-api/features/findall-sse)**: Receive real-time updates via Server-Sent Events
- **[Webhooks](/findall-api/features/findall-webhook)**: Configure HTTP callbacks for run completion and matches
- **[Run Lifecycle](/findall-api/core-concepts/findall-lifecycle)**: Understand run statuses and how to cancel runs
- **[API Reference](/api-reference/findall/extend-findall-run)**: Complete endpoint documentation

[Webhooks](/findall-api/features/findall-webhook)[Cancel](/findall-api/features/findall-cancel)

⌘I
