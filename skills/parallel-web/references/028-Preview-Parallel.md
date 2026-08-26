# Preview - Parallel

Source: https://docs.parallel.ai/findall-api/features/findall-preview

Preview mode lets you quickly and inexpensively test your FindAll queries with a small sample of candidates before committing to a full run. It’s ideal for validating your match conditions and enrichments.
**When to use preview:**

- Test query structure before running on large datasets
- Validate match conditions work as expected
- Iterate quickly on FindAll schema and descriptions

## [​](#how-preview-works) How Preview Works

Preview mode uses the same API endpoint as regular FindAll runs, but with `generator: "preview"`. Set `match_limit` from 5 to 10 to control how many candidates are evaluated. Preview results can include both matched and unmatched candidates.

## [​](#preview-vs-full-run) Preview vs. Full Run

| Feature | Preview Mode | Full Run |
| --- | --- | --- |
| **Generator** | `preview` | `base`, `core`, `pro` |
| **Candidates Evaluated** | `match_limit` candidates | Until `match_limit` matches found |
| **Match Limit** | 5 to 10 (inclusive) | 5 to 1000 (inclusive) |
| **Speed** | Fast (minutes) | Slower (varies by generator) |
| **Cost** | Flat, cheap | Variable, higher |
| **Outputs** | Same candidate schema | Same candidate schema |
| **Enrichments** | ✅ Yes | ✅ Yes |
| **Can Extend** | ❌ No | ✅ Yes |
| **Can Cancel** | ✅ While active | ✅ While active |

### [​](#key-characteristics) Key Characteristics

- **Fast & Cost-Effective**: Much faster and cheaper than full runs
- **Sample Size**: Evaluates 5–10 candidates, based on `match_limit`, with no guarantee of match rate
- **Output Contract**: Preview candidates use the same `output` and `basis` fields as regular candidates; reasoning and citations are included when available
- **Preview Limit Semantics**: `match_limit` must be between 5 and 10 and is interpreted as candidates to evaluate, not matches to find
- **No Extensions**: Preview runs cannot be extended, but they can be enriched and cancelled while active

Preview candidates follow the same structure as full run candidates. See [Candidates](/findall-api/core-concepts/findall-candidates) for details on candidate object structure and fields.

## [​](#quick-example) Quick Example

cURL

Python

TypeScript

```
curl -X POST "https://api.parallel.ai/v1beta/findall/runs" \
  -H "x-api-key: $PARALLEL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "FindAll portfolio companies of Khosla Ventures founded after 2020",
    "entity_type": "companies",
    "match_conditions": [
      {
        "name": "khosla_ventures_portfolio_check",
        "description": "Company must be a portfolio company of Khosla Ventures."
      },
      {
        "name": "founded_after_2020_check",
        "description": "Company must have been founded after 2020."
      }
    ],
    "generator": "preview",
    "match_limit": 10
  }'
```

```
from parallel import Parallel

client = Parallel(api_key="YOUR_API_KEY")

findall_run = client.beta.findall.create(
    objective="FindAll portfolio companies of Khosla Ventures founded after 2020",
    entity_type="companies",
    match_conditions=[
        {
            "name": "khosla_ventures_portfolio_check",
            "description": "Company must be a portfolio company of Khosla Ventures."
        },
        {
            "name": "founded_after_2020_check",
            "description": "Company must have been founded after 2020."
        }
    ],
    generator="preview",
    match_limit=10
)
```

```
import Parallel from 'parallel-web';

const client = new Parallel({
  apiKey: process.env.PARALLEL_API_KEY
});

const run = await client.beta.findall.create({
  objective: "FindAll portfolio companies of Khosla Ventures founded after 2020",
  entity_type: "companies",
  match_conditions: [
    {
      name: "khosla_ventures_portfolio_check",
      description: "Company must be a portfolio company of Khosla Ventures."
    },
    {
      name: "founded_after_2020_check",
      description: "Company must have been founded after 2020."
    }
  ],
  generator: "preview",
  match_limit: 10
});
```

## [​](#best-practices) Best Practices

1. **Always Preview First**: Run preview to validate match conditions before committing to full searches
2. **Review Both Results**: Check matched and unmatched candidates to refine your query logic
3. **Test Enrichments Early**: Validate enrichment outputs in preview before running at scale
4. **Examine Reasoning**: Review the `basis` field to understand how matches were determined
5. **Iterate Quickly**: Use preview’s fast feedback loop to refine queries before full runs

## [​](#related-topics) Related Topics

- **[Quickstart Guide](/findall-api/findall-quickstart)**: Get started with FindAll API
- **[Generators and Pricing](/findall-api/core-concepts/findall-generator-pricing)**: Understand generator options and pricing
- **[Enrichments](/findall-api/features/findall-enrich)**: Extract additional structured data for matched candidates
- **[Extend Runs](/findall-api/features/findall-extend)**: Increase match limits without paying new fixed costs
- **[Streaming Events](/findall-api/features/findall-sse)**: Receive real-time updates via Server-Sent Events
- **[Webhooks](/findall-api/features/findall-webhook)**: Configure HTTP callbacks for run completion and matches
- **[Run Lifecycle](/findall-api/core-concepts/findall-lifecycle)**: Understand run statuses and how to cancel runs
- **[API Reference](/api-reference/findall/create-findall-run)**: Complete endpoint documentation

[Run Lifecycle](/findall-api/core-concepts/findall-lifecycle)[Enrichments](/findall-api/features/findall-enrich)

⌘I
