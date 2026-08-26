# PostgreSQL: Documentation: 18: 52.2. pg_aggregate

Source: https://www.postgresql.org/docs/current/catalog-pg-aggregate.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/catalog-pg-aggregate.html "PostgreSQL 18 - 52.2. pg_aggregate")
([18](/docs/18/catalog-pg-aggregate.html "PostgreSQL 18 - 52.2. pg_aggregate"))
/
[17](/docs/17/catalog-pg-aggregate.html "PostgreSQL 17 - 52.2. pg_aggregate")
/
[16](/docs/16/catalog-pg-aggregate.html "PostgreSQL 16 - 52.2. pg_aggregate")
/
[15](/docs/15/catalog-pg-aggregate.html "PostgreSQL 15 - 52.2. pg_aggregate")
/
[14](/docs/14/catalog-pg-aggregate.html "PostgreSQL 14 - 52.2. pg_aggregate")

Development Versions:
[19](/docs/19/catalog-pg-aggregate.html "PostgreSQL 19 - 52.2. pg_aggregate")
/
[devel](/docs/devel/catalog-pg-aggregate.html "PostgreSQL devel - 52.2. pg_aggregate")

Unsupported versions:
[13](/docs/13/catalog-pg-aggregate.html "PostgreSQL 13 - 52.2. pg_aggregate")
/
[12](/docs/12/catalog-pg-aggregate.html "PostgreSQL 12 - 52.2. pg_aggregate")
/
[11](/docs/11/catalog-pg-aggregate.html "PostgreSQL 11 - 52.2. pg_aggregate")
/
[10](/docs/10/catalog-pg-aggregate.html "PostgreSQL 10 - 52.2. pg_aggregate")
/
[9.6](/docs/9.6/catalog-pg-aggregate.html "PostgreSQL 9.6 - 52.2. pg_aggregate")
/
[9.5](/docs/9.5/catalog-pg-aggregate.html "PostgreSQL 9.5 - 52.2. pg_aggregate")
/
[9.4](/docs/9.4/catalog-pg-aggregate.html "PostgreSQL 9.4 - 52.2. pg_aggregate")
/
[9.3](/docs/9.3/catalog-pg-aggregate.html "PostgreSQL 9.3 - 52.2. pg_aggregate")
/
[9.2](/docs/9.2/catalog-pg-aggregate.html "PostgreSQL 9.2 - 52.2. pg_aggregate")
/
[9.1](/docs/9.1/catalog-pg-aggregate.html "PostgreSQL 9.1 - 52.2. pg_aggregate")
/
[9.0](/docs/9.0/catalog-pg-aggregate.html "PostgreSQL 9.0 - 52.2. pg_aggregate")
/
[8.4](/docs/8.4/catalog-pg-aggregate.html "PostgreSQL 8.4 - 52.2. pg_aggregate")
/
[8.3](/docs/8.3/catalog-pg-aggregate.html "PostgreSQL 8.3 - 52.2. pg_aggregate")
/
[8.2](/docs/8.2/catalog-pg-aggregate.html "PostgreSQL 8.2 - 52.2. pg_aggregate")
/
[8.1](/docs/8.1/catalog-pg-aggregate.html "PostgreSQL 8.1 - 52.2. pg_aggregate")
/
[8.0](/docs/8.0/catalog-pg-aggregate.html "PostgreSQL 8.0 - 52.2. pg_aggregate")
/
[7.4](/docs/7.4/catalog-pg-aggregate.html "PostgreSQL 7.4 - 52.2. pg_aggregate")
/
[7.3](/docs/7.3/catalog-pg-aggregate.html "PostgreSQL 7.3 - 52.2. pg_aggregate")
/
[7.2](/docs/7.2/catalog-pg-aggregate.html "PostgreSQL 7.2 - 52.2. pg_aggregate")
/
[7.1](/docs/7.1/catalog-pg-aggregate.html "PostgreSQL 7.1 - 52.2. pg_aggregate")

## 52.2. `pg_aggregate` [#](#CATALOG-PG-AGGREGATE)

The catalog `pg_aggregate` stores information about aggregate functions. An aggregate function is a function that operates on a set of values (typically one column from each row that matches a query condition) and returns a single value computed from all these values. Typical aggregate functions are `sum`, `count`, and `max`. Each entry in `pg_aggregate` is an extension of an entry in [`pg_proc`](catalog-pg-proc.html "52.39. pg_proc"). The `pg_proc` entry carries the aggregate's name, input and output data types, and other information that is similar to ordinary functions.

**Table 52.2. `pg_aggregate` Columns**

| Column Type  Description |
| --- |
| `aggfnoid` `regproc` (references [`pg_proc`](catalog-pg-proc.html "52.39. pg_proc").`oid`)  `pg_proc` OID of the aggregate function |
| `aggkind` `char`  Aggregate kind: `n` for “normal” aggregates, `o` for “ordered-set” aggregates, or `h` for “hypothetical-set” aggregates |
| `aggnumdirectargs` `int2`  Number of direct (non-aggregated) arguments of an ordered-set or hypothetical-set aggregate, counting a variadic array as one argument. If equal to `pronargs`, the aggregate must be variadic and the variadic array describes the aggregated arguments as well as the final direct arguments. Always zero for normal aggregates. |
| `aggtransfn` `regproc` (references [`pg_proc`](catalog-pg-proc.html "52.39. pg_proc").`oid`)  Transition function |
| `aggfinalfn` `regproc` (references [`pg_proc`](catalog-pg-proc.html "52.39. pg_proc").`oid`)  Final function (zero if none) |
| `aggcombinefn` `regproc` (references [`pg_proc`](catalog-pg-proc.html "52.39. pg_proc").`oid`)  Combine function (zero if none) |
| `aggserialfn` `regproc` (references [`pg_proc`](catalog-pg-proc.html "52.39. pg_proc").`oid`)  Serialization function (zero if none) |
| `aggdeserialfn` `regproc` (references [`pg_proc`](catalog-pg-proc.html "52.39. pg_proc").`oid`)  Deserialization function (zero if none) |
| `aggmtransfn` `regproc` (references [`pg_proc`](catalog-pg-proc.html "52.39. pg_proc").`oid`)  Forward transition function for moving-aggregate mode (zero if none) |
| `aggminvtransfn` `regproc` (references [`pg_proc`](catalog-pg-proc.html "52.39. pg_proc").`oid`)  Inverse transition function for moving-aggregate mode (zero if none) |
| `aggmfinalfn` `regproc` (references [`pg_proc`](catalog-pg-proc.html "52.39. pg_proc").`oid`)  Final function for moving-aggregate mode (zero if none) |
| `aggfinalextra` `bool`  True to pass extra dummy arguments to `aggfinalfn` |
| `aggmfinalextra` `bool`  True to pass extra dummy arguments to `aggmfinalfn` |
| `aggfinalmodify` `char`  Whether `aggfinalfn` modifies the transition state value: `r` if it is read-only, `s` if the `aggtransfn` cannot be applied after the `aggfinalfn`, or `w` if it writes on the value |
| `aggmfinalmodify` `char`  Like `aggfinalmodify`, but for the `aggmfinalfn` |
| `aggsortop` `oid` (references [`pg_operator`](catalog-pg-operator.html "52.34. pg_operator").`oid`)  Associated sort operator (zero if none) |
| `aggtranstype` `oid` (references [`pg_type`](catalog-pg-type.html "52.64. pg_type").`oid`)  Data type of the aggregate function's internal transition (state) data |
| `aggtransspace` `int4`  Approximate average size (in bytes) of the transition state data, or zero to use a default estimate |
| `aggmtranstype` `oid` (references [`pg_type`](catalog-pg-type.html "52.64. pg_type").`oid`)  Data type of the aggregate function's internal transition (state) data for moving-aggregate mode (zero if none) |
| `aggmtransspace` `int4`  Approximate average size (in bytes) of the transition state data for moving-aggregate mode, or zero to use a default estimate |
| `agginitval` `text`  The initial value of the transition state. This is a text field containing the initial value in its external string representation. If this field is null, the transition state value starts out null. |
| `aggminitval` `text`  The initial value of the transition state for moving-aggregate mode. This is a text field containing the initial value in its external string representation. If this field is null, the transition state value starts out null. |

New aggregate functions are registered with the [`CREATE AGGREGATE`](sql-createaggregate.html "CREATE AGGREGATE") command. See [Section 36.12](xaggr.html "36.12. User-Defined Aggregates") for more information about writing aggregate functions and the meaning of the transition functions, etc.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/catalog-pg-aggregate.html/)
to report a documentation issue.
