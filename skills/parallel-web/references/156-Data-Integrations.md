# Data Integrations

Source: https://docs.parallel.ai/data-integrations/overview.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Data Integrations
> Enrich your data with web intelligence directly in your favorite data tools

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

Parallel's data integrations let you enrich datasets with web intelligence without leaving your existing data workflows. Whether you're working with DataFrames in Python, SQL queries in a data warehouse, or analytics databases, there's an integration that fits your stack.
## How it works
All data integrations follow the same pattern:
1. \*\*Define inputs\*\*: Specify which columns contain the data to research (company name, website, etc.)
2. \*\*Define outputs\*\*: Describe what information you want to extract ("CEO name", "Founding year", etc.)
3. \*\*Choose a processor\*\*: Select speed vs thoroughness based on your needs
4. \*\*Get enriched data\*\*: Receive structured results with optional citations
## Available integrations

Distributed enrichment for large-scale data processing with PySpark UDFs

SQL-native remote functions for enrichment directly in BigQuery queries

SQL-native UDTF with batched processing via External Access Integration

Batch processing and SQL UDFs for local analytics databases

DataFrame-native enrichment with batch processing and LazyFrame support

Edge Functions for enrichment in Supabase applications
## Choosing an integration
| Integration | Best for | Processing model |
| ------------- | ----------------------------------- | -------------------------------------------- |
| \*\*Spark\*\* | Large-scale distributed processing | UDF with concurrent processing per partition |
| \*\*BigQuery\*\* | Google Cloud data warehouses | Remote function with batched API calls |
| \*\*Snowflake\*\* | Snowflake data warehouses | Batched UDTF (partition-based) |
| \*\*DuckDB\*\* | Local analytics, embedded databases | Batch processing (recommended) or SQL UDF |
| \*\*Polars\*\* | Python DataFrame workflows | Batch processing |
| \*\*Supabase\*\* | PostgreSQL/Supabase applications | Edge Function |
## Installation
All Python-based integrations are available via the `parallel-web-tools` package:
```bash theme={"system"}
# Install with specific integration
pip install parallel-web-tools[polars]
pip install parallel-web-tools[duckdb]
pip install parallel-web-tools[spark]
# Install with all integrations
pip install parallel-web-tools[all]
```
For BigQuery and Snowflake, additional deployment steps are required to set up cloud functions and permissions. See the individual integration guides for details.
## Common patterns
### Input column mapping
All integrations use the same input mapping format—a dictionary where keys describe the data semantically and values reference your actual column names:
```python theme={"system"}
input\_columns = {
"company\_name": "name", # "name" is the column in your data
"website": "domain", # "domain" is the column in your data
"headquarters": "location", # "location" is the column in your data
}
```
### Output column descriptions
Describe what you want to extract in plain language. Column names are automatically converted to valid identifiers:
```python theme={"system"}
output\_columns = [
"CEO name", # → ceo\_name
"Founding year (YYYY format)", # → founding\_year
"Annual revenue (USD, most recent)", # → annual\_revenue
]
```
## Next steps

Select the right processor based on speed vs thoroughness requirements

Learn about the underlying Task API that powers all data integrations

View detailed pricing for all processors and API endpoints
