# Apache Spark

Source: https://docs.parallel.ai/data-integrations/spark.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Apache Spark
> Enrich data at scale using Parallel's SQL-native UDFs for Apache Spark

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

This integration is ideal for data engineers who need to enrich large datasets with web intelligence directly in their Spark pipelines—without leaving SQL or building custom API integrations.
Parallel provides SQL-native User Defined Functions (UDFs) for Apache Spark that enable data enrichment directly in your SQL queries. The UDFs process rows concurrently within each partition for optimal performance.
View the complete demo notebooks:
\* [Spark Enrichment Demo](https://github.com/parallel-web/parallel-web-tools/blob/main/notebooks/spark\_enrichment\_demo.ipynb)
\* [Spark Streaming Demo](https://github.com/parallel-web/parallel-web-tools/blob/main/notebooks/spark\_streaming\_demo.ipynb)
## Features
\* \*\*SQL-Native\*\*: Use `parallel\_enrich()` directly in Spark SQL queries
\* \*\*Concurrent Processing\*\*: All rows in each partition are processed concurrently using asyncio
\* \*\*Configurable Processors\*\*: Choose from lite-fast to ultra for speed vs thoroughness tradeoffs
\* \*\*Structured Output\*\*: Returns JSON that can be parsed with Spark's `from\_json()`
## Installation
```bash theme={"system"}
pip install parallel-web-tools[spark]
```
## Setup
1. Get your API key from [Parallel](https://platform.parallel.ai)
2. Register the UDFs with your Spark session:
```python theme={"system"}
from pyspark.sql import SparkSession
from parallel\_web\_tools.integrations.spark import register\_parallel\_udfs
# Create Spark session
spark = SparkSession.builder.appName("parallel-enrichment").getOrCreate()
# Register UDFs (uses PARALLEL\_API\_KEY env var by default)
register\_parallel\_udfs(spark)
# Or pass API key explicitly
register\_parallel\_udfs(spark, api\_key="your-api-key")
```
### Configuration Options
```python theme={"system"}
register\_parallel\_udfs(
spark,
api\_key="your-api-key", # Optional: defaults to PARALLEL\_API\_KEY env var
processor="lite-fast", # Processor tier (default: lite-fast)
timeout=300, # Timeout per API call in seconds (default: 300)
include\_basis=False, # Include citations in response (default: False)
udf\_name="parallel\_enrich", # Custom UDF name (default: parallel\_enrich)
)
```
## Basic Usage
Once registered, use `parallel\_enrich()` in any SQL query:
```python theme={"system"}
# Create sample data
spark.sql("""
CREATE OR REPLACE TEMP VIEW companies AS
SELECT 'Google' as company\_name, 'https://google.com' as website
UNION ALL
SELECT 'Apple', 'https://apple.com'
""")
# Enrich with Parallel
result = spark.sql("""
SELECT
company\_name,
parallel\_enrich(
map('company\_name', company\_name, 'website', website),
array('CEO name', 'company description', 'founding year')
) as enriched\_data
FROM companies
""")
result.show(truncate=False)
```
Output:
```
+------------+-------------------------------------------------------------------------------------------------------------+
|company\_name|enriched\_data |
+------------+-------------------------------------------------------------------------------------------------------------+
|Google |{"ceo\_name": "Sundar Pichai", "founding\_year": "1998", "company\_description": "Google is an American..."} |
|Apple |{"ceo\_name": "Tim Cook", "founding\_year": "1976", "company\_description": "Apple Inc. is an American..."} |
+------------+-------------------------------------------------------------------------------------------------------------+
```
### UDF Parameters
| Parameter | Type | Description |
| ---------------- | --------------------- | ---------------------------------------------- |
| `input\_data` | `map` | Key-value pairs of input data for enrichment |
| `output\_columns` | `array` | Descriptions of the columns you want to enrich |
### Parsing Results
The UDF returns JSON strings. Field names are converted to snake\\_case (e.g., "CEO name" → `ceo\_name`).
Use `get\_json\_object()` to extract individual fields:
```python theme={"system"}
from pyspark.sql.functions import get\_json\_object
result = spark.sql("""
SELECT
company\_name,
get\_json\_object(enriched\_data, '$.ceo\_name') as ceo,
get\_json\_object(enriched\_data, '$.founding\_year') as founded
FROM (
SELECT
company\_name,
parallel\_enrich(
map('company\_name', company\_name),
array('CEO name', 'founding year')
) as enriched\_data
FROM companies
)
""")
result.show()
```
Output:
```
+------------+-------------+-------+
|company\_name| ceo|founded|
+------------+-------------+-------+
| Google|Sundar Pichai| 1998|
| Apple| Tim Cook| 1976|
+------------+-------------+-------+
```
Or use `from\_json()` with a schema for structured parsing:
```python theme={"system"}
from pyspark.sql.functions import col, from\_json
from pyspark.sql.types import StructType, StructField, StringType
schema = StructType([
StructField("ceo\_name", StringType()),
StructField("founding\_year", StringType()),
])
parsed = result.withColumn("parsed", from\_json(col("enriched\_data"), schema))
parsed.select("company\_name", "parsed.\*").show()
```
Output:
```
+------------+-------------+-------------+
|company\_name| ceo\_name|founding\_year|
+------------+-------------+-------------+
| Google|Sundar Pichai| 1998|
| Apple| Tim Cook| 1976|
+------------+-------------+-------------+
```
## Including Basis/Citations
To include source citations in your enrichment results, set `include\_basis=True`:
```python theme={"system"}
register\_parallel\_udfs(
spark,
include\_basis=True,
udf\_name="parallel\_enrich\_with\_basis",
)
result = spark.sql("""
SELECT parallel\_enrich\_with\_basis(
map('company\_name', company\_name),
array('CEO name')
) as enriched
FROM companies
""")
result.show(truncate=False)
```
Output (truncated):
```
+---------------------------------------------------------------------------------------------+
|enriched |
+---------------------------------------------------------------------------------------------+
|{"ceo\_name": "Sundar Pichai", "\_basis": [{"field": "ceo\_name", "citations": [...]}]} |
|{"ceo\_name": "Tim Cook", "\_basis": [{"field": "ceo\_name", "citations": [...]}]} |
+---------------------------------------------------------------------------------------------+
```
When enabled, each result includes a `\_basis` field with citations:
```json theme={"system"}
{
"ceo\_name": "Sundar Pichai",
"\_basis": [
{
"field": "ceo\_name",
"citations": [
{"url": "https://...", "excerpts": ["..."]}
]
}
]
}
```
## Processor Selection
Choose a processor based on your speed vs thoroughness requirements. See [Choose a Processor](/task-api/guides/choose-a-processor) for detailed guidance and [Pricing](/resources/pricing) for cost information.
Use the `parallel\_enrich\_with\_processor` UDF to override per query:
```sql theme={"system"}
SELECT parallel\_enrich\_with\_processor(
map('company\_name', company\_name),
array('CEO name'),
'pro-fast' -- Override processor
) as enriched
FROM companies
LIMIT 1
```
Output:
```
+-----------------------------+
|enriched |
+-----------------------------+
|{"ceo\_name": "Sundar Pichai"}|
+-----------------------------+
```
## Best Practices

The UDF processes all rows in a partition concurrently. For optimal performance:
\* Use `repartition()` to control partition sizes
\* Aim for 10-100 rows per partition for balanced concurrency

Failed enrichments return JSON with an `error` field:
```json theme={"system"}
{"error": "error message here"}
```
Filter these in your downstream processing.

Concurrent processing respects Parallel's rate limits. For large datasets, consider:
\* Reducing partition sizes
\* Using slower processors that have higher rate limits
