# PostgreSQL: Documentation: 18: 53.24. pg_sequences

Source: https://www.postgresql.org/docs/current/view-pg-sequences.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/view-pg-sequences.html "PostgreSQL 18 - 53.24. pg_sequences")
([18](/docs/18/view-pg-sequences.html "PostgreSQL 18 - 53.24. pg_sequences"))
/
[17](/docs/17/view-pg-sequences.html "PostgreSQL 17 - 53.24. pg_sequences")
/
[16](/docs/16/view-pg-sequences.html "PostgreSQL 16 - 53.24. pg_sequences")
/
[15](/docs/15/view-pg-sequences.html "PostgreSQL 15 - 53.24. pg_sequences")
/
[14](/docs/14/view-pg-sequences.html "PostgreSQL 14 - 53.24. pg_sequences")

Development Versions:
[19](/docs/19/view-pg-sequences.html "PostgreSQL 19 - 53.24. pg_sequences")
/
[devel](/docs/devel/view-pg-sequences.html "PostgreSQL devel - 53.24. pg_sequences")

Unsupported versions:
[13](/docs/13/view-pg-sequences.html "PostgreSQL 13 - 53.24. pg_sequences")
/
[12](/docs/12/view-pg-sequences.html "PostgreSQL 12 - 53.24. pg_sequences")
/
[11](/docs/11/view-pg-sequences.html "PostgreSQL 11 - 53.24. pg_sequences")
/
[10](/docs/10/view-pg-sequences.html "PostgreSQL 10 - 53.24. pg_sequences")

## 53.24. `pg_sequences` [#](#VIEW-PG-SEQUENCES)

The view `pg_sequences` provides access to useful information about each sequence in the database.

**Table 53.24. `pg_sequences` Columns**

| Column Type  Description |
| --- |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace.html "52.32. pg_namespace").`nspname`)  Name of schema containing sequence |
| `sequencename` `name` (references [`pg_class`](catalog-pg-class.html "52.11. pg_class").`relname`)  Name of sequence |
| `sequenceowner` `name` (references [`pg_authid`](catalog-pg-authid.html "52.8. pg_authid").`rolname`)  Name of sequence's owner |
| `data_type` `regtype` (references [`pg_type`](catalog-pg-type.html "52.64. pg_type").`oid`)  Data type of the sequence |
| `start_value` `int8`  Start value of the sequence |
| `min_value` `int8`  Minimum value of the sequence |
| `max_value` `int8`  Maximum value of the sequence |
| `increment_by` `int8`  Increment value of the sequence |
| `cycle` `bool`  Whether the sequence cycles |
| `cache_size` `int8`  Cache size of the sequence |
| `last_value` `int8`  The last sequence value written to disk. If caching is used, this value can be greater than the last value handed out from the sequence. |

The `last_value` column will read as null if any of the following are true:

- The sequence has not been read from yet.
- The current user does not have `USAGE` or `SELECT` privilege on the sequence.
- The sequence is unlogged and the server is a standby.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/view-pg-sequences.html/)
to report a documentation issue.
