# Google BigQuery

Source: https://docs.parallel.ai/data-integrations/bigquery.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Google BigQuery
> Enrich data at scale using Parallel's SQL-native remote functions for BigQuery

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

This integration is ideal for data engineers who need to enrich large datasets with web intelligence directly in their BigQuery pipelines—without leaving SQL or building custom API integrations.
Parallel provides SQL-native remote functions for Google BigQuery that enable data enrichment directly in your SQL queries. The integration uses Cloud Functions to securely connect BigQuery to the Parallel API.
View the complete demo notebook:
\* [BigQuery Enrichment Demo](https://github.com/parallel-web/parallel-web-tools/blob/main/notebooks/bigquery\_enrichment\_demo.ipynb)
## Features
\* \*\*SQL-Native\*\*: Use `parallel\_enrich()` directly in BigQuery SQL queries
\* \*\*Secure\*\*: API key stored in Secret Manager, accessed via Cloud Functions
\* \*\*Configurable Processors\*\*: Choose from lite-fast to ultra for speed vs thoroughness tradeoffs
\* \*\*Structured Output\*\*: Returns JSON that can be parsed with BigQuery's `JSON\_EXTRACT\_SCALAR()`
## Installation
```bash theme={"system"}
pip install parallel-web-tools
```
The standalone [`parallel-cli`](/integrations/cli) binary does not include deployment commands. You must install via pip to deploy the BigQuery integration.
## Deployment
Unlike Spark, the BigQuery integration requires a one-time deployment step to set up Cloud Functions and remote function definitions in your GCP project.
### Prerequisites
1. \*\*Google Cloud Project\*\* with billing enabled
2. \*\*Parallel API Key\*\* from [Parallel](https://platform.parallel.ai)
3. \*\*Google Cloud SDK\*\* installed and authenticated:
```bash theme={"system"}
gcloud auth login
gcloud auth application-default login
```
### Deploy with CLI
```bash theme={"system"}
parallel-cli enrich deploy --system bigquery \
--project=your-gcp-project \
--region=us-central1 \
--api-key=your-parallel-api-key
```
This creates:
\* Secret in Secret Manager for your API key
\* Cloud Function (Gen2) that handles enrichment requests
\* BigQuery Connection for remote function calls
\* BigQuery Dataset (`parallel\_functions`)
\* Remote functions: `parallel\_enrich()` and `parallel\_enrich\_company()`
For manual deployment options, troubleshooting, and cleanup instructions, see the [complete BigQuery setup guide](https://github.com/parallel-web/parallel-web-tools/blob/main/docs/bigquery-setup.md).
## Basic Usage
Once deployed, use `parallel\_enrich()` in any BigQuery SQL query:
```sql theme={"system"}
SELECT
name,
`your-project.parallel\_functions.parallel\_enrich`(
JSON\_OBJECT('company\_name', name, 'website', website),
JSON\_ARRAY('CEO name', 'Founding year', 'Brief description')
) as enriched\_data
FROM your\_dataset.companies
LIMIT 10;
```
Output:
```
+--------+----------------------------------------------------------------------------------------------------------------------+
| name | enriched\_data |
+--------+----------------------------------------------------------------------------------------------------------------------+
| Google | {"ceo\_name": "Sundar Pichai", "founding\_year": "1998", "brief\_description": "Google is an American...", "basis": []} |
| Apple | {"ceo\_name": "Tim Cook", "founding\_year": "1976", "brief\_description": "Apple Inc. is an American...", "basis": []} |
+--------+----------------------------------------------------------------------------------------------------------------------+
```
### Function Parameters
| Parameter | Type | Description |
| ---------------- | ------ | ------------------------------------------------------------- |
| `input\_data` | `JSON` | JSON object with key-value pairs of input data for enrichment |
| `output\_columns` | `JSON` | JSON array of descriptions for columns you want to enrich |
### Parsing Results
The function returns JSON strings. Field names are converted to snake\\_case (e.g., "CEO name" → `ceo\_name`).
Use `JSON\_EXTRACT\_SCALAR()` to extract individual fields:
```sql theme={"system"}
WITH enriched AS (
SELECT
name,
`your-project.parallel\_functions.parallel\_enrich`(
JSON\_OBJECT('company\_name', name),
JSON\_ARRAY('CEO name', 'Industry', 'Headquarters')
) as info
FROM your\_dataset.companies
)
SELECT
name,
JSON\_EXTRACT\_SCALAR(info, '$.ceo\_name') as ceo,
JSON\_EXTRACT\_SCALAR(info, '$.industry') as industry,
JSON\_EXTRACT\_SCALAR(info, '$.headquarters') as hq
FROM enriched;
```
Output:
```
+--------+-------------+------------+---------------+
| name | ceo | industry | hq |
+--------+-------------+------------+---------------+
| Google | Sundar Pichai| Technology | Mountain View |
| Apple | Tim Cook | Technology | Cupertino |
+--------+-------------+------------+---------------+
```
### Company Convenience Function
For common company enrichment use cases:
```sql theme={"system"}
SELECT
`your-project.parallel\_functions.parallel\_enrich\_company`(
'Google',
'google.com',
JSON\_ARRAY('CEO name', 'Employee count', 'Stock ticker')
) as company\_info;
```
## Processor Selection
Choose a processor based on your speed vs thoroughness requirements. See [Choose a Processor](/task-api/guides/choose-a-processor) for detailed guidance and [Pricing](/resources/pricing) for cost information.
To use a different processor, create a custom remote function with the desired processor in the `user\_defined\_context`:
```sql theme={"system"}
CREATE OR REPLACE FUNCTION `your-project.parallel\_functions.parallel\_enrich\_pro`(
input\_data STRING,
output\_columns STRING
)
RETURNS STRING
REMOTE WITH CONNECTION `your-project.us-central1.parallel-connection`
OPTIONS (
endpoint = 'YOUR\_FUNCTION\_URL',
user\_defined\_context = [("processor", "pro-fast")]
);
```
## Best Practices

Process data in batches to manage costs and avoid timeouts:
```sql theme={"system"}
SELECT parallel\_enrich(...) FROM companies LIMIT 100;
```

Failed enrichments return JSON with an `error` field:
```json theme={"system"}
{"error": "error message here"}
```
Filter these in your downstream processing.

\* Use `lite-fast` for high-volume, basic enrichments
\* Test with small batches before processing large tables
\* Store results to avoid re-enriching the same data
