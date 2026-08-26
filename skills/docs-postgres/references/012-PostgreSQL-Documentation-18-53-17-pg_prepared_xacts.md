# PostgreSQL: Documentation: 18: 53.17. pg_prepared_xacts

Source: https://www.postgresql.org/docs/current/view-pg-prepared-xacts.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/view-pg-prepared-xacts.html "PostgreSQL 18 - 53.17. pg_prepared_xacts")
([18](/docs/18/view-pg-prepared-xacts.html "PostgreSQL 18 - 53.17. pg_prepared_xacts"))
/
[17](/docs/17/view-pg-prepared-xacts.html "PostgreSQL 17 - 53.17. pg_prepared_xacts")
/
[16](/docs/16/view-pg-prepared-xacts.html "PostgreSQL 16 - 53.17. pg_prepared_xacts")
/
[15](/docs/15/view-pg-prepared-xacts.html "PostgreSQL 15 - 53.17. pg_prepared_xacts")
/
[14](/docs/14/view-pg-prepared-xacts.html "PostgreSQL 14 - 53.17. pg_prepared_xacts")

Development Versions:
[19](/docs/19/view-pg-prepared-xacts.html "PostgreSQL 19 - 53.17. pg_prepared_xacts")
/
[devel](/docs/devel/view-pg-prepared-xacts.html "PostgreSQL devel - 53.17. pg_prepared_xacts")

Unsupported versions:
[13](/docs/13/view-pg-prepared-xacts.html "PostgreSQL 13 - 53.17. pg_prepared_xacts")
/
[12](/docs/12/view-pg-prepared-xacts.html "PostgreSQL 12 - 53.17. pg_prepared_xacts")
/
[11](/docs/11/view-pg-prepared-xacts.html "PostgreSQL 11 - 53.17. pg_prepared_xacts")
/
[10](/docs/10/view-pg-prepared-xacts.html "PostgreSQL 10 - 53.17. pg_prepared_xacts")
/
[9.6](/docs/9.6/view-pg-prepared-xacts.html "PostgreSQL 9.6 - 53.17. pg_prepared_xacts")
/
[9.5](/docs/9.5/view-pg-prepared-xacts.html "PostgreSQL 9.5 - 53.17. pg_prepared_xacts")
/
[9.4](/docs/9.4/view-pg-prepared-xacts.html "PostgreSQL 9.4 - 53.17. pg_prepared_xacts")
/
[9.3](/docs/9.3/view-pg-prepared-xacts.html "PostgreSQL 9.3 - 53.17. pg_prepared_xacts")
/
[9.2](/docs/9.2/view-pg-prepared-xacts.html "PostgreSQL 9.2 - 53.17. pg_prepared_xacts")
/
[9.1](/docs/9.1/view-pg-prepared-xacts.html "PostgreSQL 9.1 - 53.17. pg_prepared_xacts")
/
[9.0](/docs/9.0/view-pg-prepared-xacts.html "PostgreSQL 9.0 - 53.17. pg_prepared_xacts")
/
[8.4](/docs/8.4/view-pg-prepared-xacts.html "PostgreSQL 8.4 - 53.17. pg_prepared_xacts")
/
[8.3](/docs/8.3/view-pg-prepared-xacts.html "PostgreSQL 8.3 - 53.17. pg_prepared_xacts")
/
[8.2](/docs/8.2/view-pg-prepared-xacts.html "PostgreSQL 8.2 - 53.17. pg_prepared_xacts")
/
[8.1](/docs/8.1/view-pg-prepared-xacts.html "PostgreSQL 8.1 - 53.17. pg_prepared_xacts")

## 53.17. `pg_prepared_xacts` [#](#VIEW-PG-PREPARED-XACTS)

The view `pg_prepared_xacts` displays information about transactions that are currently prepared for two-phase commit (see [PREPARE TRANSACTION](sql-prepare-transaction.html "PREPARE TRANSACTION") for details).

`pg_prepared_xacts` contains one row per prepared transaction. An entry is removed when the transaction is committed or rolled back.

**Table 53.17. `pg_prepared_xacts` Columns**

| Column Type  Description |
| --- |
| `transaction` `xid`  Numeric transaction identifier of the prepared transaction |
| `gid` `text`  Global transaction identifier that was assigned to the transaction |
| `prepared` `timestamptz`  Time at which the transaction was prepared for commit |
| `owner` `name` (references [`pg_authid`](catalog-pg-authid.html "52.8. pg_authid").`rolname`)  Name of the user that executed the transaction |
| `database` `name` (references [`pg_database`](catalog-pg-database.html "52.15. pg_database").`datname`)  Name of the database in which the transaction was executed |

When the `pg_prepared_xacts` view is accessed, the internal transaction manager data structures are momentarily locked, and a copy is made for the view to display. This ensures that the view produces a consistent set of results, while not blocking normal operations longer than necessary. Nonetheless there could be some impact on database performance if this view is frequently accessed.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/view-pg-prepared-xacts.html/)
to report a documentation issue.
