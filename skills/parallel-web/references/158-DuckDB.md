# DuckDB

Source: https://docs.parallel.ai/data-integrations/duckdb.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# DuckDB
> Enrich data at scale using Parallel's native DuckDB integration with batch processing

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

This integration is ideal for data engineers and analysts who work with DuckDB and need to enrich data with web intelligence directly in their SQL or Python workflows.
Parallel provides a native DuckDB integration with two approaches: batch processing for efficiency, and SQL UDFs for flexibility.
View the complete demo notebook:
\* [DuckDB Enrichment Demo](https://github.com/parallel-web/parallel-web-tools/blob/main/notebooks/duckdb\_enrichment\_demo.ipynb)
## Features
\* \*\*Batch Processing\*\*: Process all rows in parallel with a single API call (recommended)
\* \*\*SQL UDF\*\*: Use `parallel\_enrich()` directly in SQL queries
\* \*\*Progress Callbacks\*\*: Track enrichment progress for large datasets
\* \*\*Permanent Tables\*\*: Optionally save results to a new table
## Installation
```bash theme={"system"}
pip install parallel-web-tools[duckdb]
```
Or with all dependencies:
```bash theme={"system"}
pip install parallel-web-tools[all]
```
## Basic Usage - Batch Processing
Batch processing is the recommended approach for enriching multiple rows efficiently.
```python theme={"system"}
import duckdb
from parallel\_web\_tools.integrations.duckdb import enrich\_table
# Create a connection and sample data
conn = duckdb.connect()
conn.execute("""
CREATE TABLE companies AS SELECT \* FROM (VALUES
('Google', 'google.com'),
('Microsoft', 'microsoft.com'),
('Apple', 'apple.com')
) AS t(name, website)
""")
# Enrich the table
result = enrich\_table(
conn,
source\_table="companies",
input\_columns={
"company\_name": "name",
"website": "website",
},
output\_columns=[
"CEO name",
"Founding year",
"Headquarters city",
],
)
# Access results
print(result.relation.fetchdf())
print(f"Success: {result.success\_count}, Errors: {result.error\_count}")
```
Output:
| name | website | ceo\\_name | founding\\_year | headquarters\\_city |
| --------- | ------------- | ------------- | -------------- | ------------------ |
| Google | google.com | Sundar Pichai | 1998 | Mountain View |
| Microsoft | microsoft.com | Satya Nadella | 1975 | Redmond |
| Apple | apple.com | Tim Cook | 1976 | Cupertino |
### Function Parameters
| Parameter | Type | Default | Description |
| ------------------- | -------------------- | ------------- | --------------------------------------------------------- |
| `conn` | `DuckDBPyConnection` | required | DuckDB connection |
| `source\_table` | `str` | required | Table name or SQL query |
| `input\_columns` | `dict[str, str]` | required | Mapping of input descriptions to column names |
| `output\_columns` | `list[str]` | required | List of output column descriptions |
| `result\_table` | `str \| None` | `None` | Optional permanent table to create |
| `api\_key` | `str \| None` | `None` | API key (uses `PARALLEL\_API\_KEY` env var if not provided) |
| `processor` | `str` | `"lite-fast"` | Parallel processor to use |
| `timeout` | `int` | `600` | Timeout in seconds |
| `include\_basis` | `bool` | `False` | Include citations in results |
| `progress\_callback` | `Callable` | `None` | Callback for progress updates |
### Return Value
The function returns an `EnrichmentResult` dataclass:
```python theme={"system"}
@dataclass
class EnrichmentResult:
relation: duckdb.DuckDBPyRelation # Enriched data as DuckDB relation
success\_count: int # Number of successful rows
error\_count: int # Number of failed rows
errors: list[dict] # Error details with row index
elapsed\_time: float # Processing time in seconds
```
### Column Name Mapping
Output column descriptions are automatically converted to valid SQL identifiers. Field names are converted to snake\\_case:
| Description | Column Name |
| ------------------------ | ---------------- |
| `"CEO name"` | `ceo\_name` |
| `"Founding year (YYYY)"` | `founding\_year` |
| `"Annual revenue [USD]"` | `annual\_revenue` |
## SQL Query as Source
You can pass a SQL query instead of a table name:
```python theme={"system"}
result = enrich\_table(
conn,
source\_table="""
SELECT name, website
FROM companies
WHERE active = true
LIMIT 100
""",
input\_columns={"company\_name": "name", "website": "website"},
output\_columns=["CEO name"],
)
```
## Creating Permanent Tables
Save enriched results to a permanent table:
```python theme={"system"}
result = enrich\_table(
conn,
source\_table="companies",
input\_columns={"company\_name": "name"},
output\_columns=["CEO name", "Founding year"],
result\_table="enriched\_companies",
)
# Query the permanent table later
conn.execute("SELECT \* FROM enriched\_companies").fetchall()
```
## Progress Tracking
Track progress for large enrichment jobs:
```python theme={"system"}
def on\_progress(completed: int, total: int):
print(f"Progress: {completed}/{total} ({100\*completed/total:.0f}%)")
result = enrich\_table(
conn,
source\_table="companies",
input\_columns={"company\_name": "name"},
output\_columns=["CEO name"],
progress\_callback=on\_progress,
)
```
## SQL UDF Usage
For flexibility in SQL queries, you can register a `parallel\_enrich()` function:
```python theme={"system"}
import duckdb
import json
from parallel\_web\_tools.integrations.duckdb import register\_parallel\_functions
conn = duckdb.connect()
conn.execute("CREATE TABLE companies AS SELECT 'Google' as name")
# Register the UDF
register\_parallel\_functions(conn, processor="lite-fast")
# Use in SQL
results = conn.execute("""
SELECT
name,
parallel\_enrich(
json\_object('company\_name', name),
json\_array('CEO name', 'Founding year')
) as enriched
FROM companies
""").fetchall()
# Parse the JSON result
for name, enriched\_json in results:
data = json.loads(enriched\_json)
print(f"{name}: CEO = {data.get('ceo\_name')}")
```
The SQL UDF processes rows individually. For better performance with multiple rows, use batch processing with `enrich\_table()`.
## Including Citations
```python theme={"system"}
result = enrich\_table(
conn,
source\_table="companies",
input\_columns={"company\_name": "name"},
output\_columns=["CEO name"],
include\_basis=True,
)
# Access citations in the \_basis column
df = result.relation.fetchdf()
for \_, row in df.iterrows():
print(f"CEO: {row['ceo\_name']}")
print(f"Sources: {row['\_basis']}")
```
## Processor Selection
Choose a processor based on your speed vs thoroughness requirements. See [Choose a Processor](/task-api/guides/choose-a-processor) for detailed guidance and [Pricing](/resources/pricing) for cost information.
| Processor | Speed | Best For |
| ----------- | ------- | --------------------------- |
| `lite-fast` | Fastest | Basic metadata, high volume |
| `base-fast` | Fast | Standard enrichments |
| `core-fast` | Medium | Cross-referenced data |
| `pro-fast` | Slower | Deep research |
## Best Practices

Batch processing is significantly faster (4-5x or more) than the SQL UDF for multiple rows:
```python theme={"system"}
# Recommended - processes all rows in parallel
result = enrich\_table(conn, "companies", ...)
# Slower - one API call per row
conn.execute("SELECT \*, parallel\_enrich(...) FROM companies")
```

Be specific in your output column descriptions for better results:
```python theme={"system"}
output\_columns = [
"CEO name (current CEO or equivalent leader)",
"Founding year (YYYY format)",
"Annual revenue (USD, most recent fiscal year)",
]
```

Errors don't stop processing - partial results are returned:
```python theme={"system"}
result = enrich\_table(conn, ...)
if result.error\_count > 0:
print(f"Failed rows: {result.error\_count}")
for error in result.errors:
print(f" Row {error['row']}: {error['error']}")
# Errors appear as NULL in the result
df = result.relation.fetchdf()
successful = df[df['ceo\_name'].notna()]
```

\* Use `lite-fast` for high-volume, basic enrichments
\* Test with small batches before processing large tables
\* Store results in permanent tables to avoid re-enriching
