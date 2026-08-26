# PostgreSQL: Documentation: 18: 52.45. pg_rewrite

Source: https://www.postgresql.org/docs/current/catalog-pg-rewrite.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/catalog-pg-rewrite.html "PostgreSQL 18 - 52.45. pg_rewrite")
([18](/docs/18/catalog-pg-rewrite.html "PostgreSQL 18 - 52.45. pg_rewrite"))
/
[17](/docs/17/catalog-pg-rewrite.html "PostgreSQL 17 - 52.45. pg_rewrite")
/
[16](/docs/16/catalog-pg-rewrite.html "PostgreSQL 16 - 52.45. pg_rewrite")
/
[15](/docs/15/catalog-pg-rewrite.html "PostgreSQL 15 - 52.45. pg_rewrite")
/
[14](/docs/14/catalog-pg-rewrite.html "PostgreSQL 14 - 52.45. pg_rewrite")

Development Versions:
[19](/docs/19/catalog-pg-rewrite.html "PostgreSQL 19 - 52.45. pg_rewrite")
/
[devel](/docs/devel/catalog-pg-rewrite.html "PostgreSQL devel - 52.45. pg_rewrite")

Unsupported versions:
[13](/docs/13/catalog-pg-rewrite.html "PostgreSQL 13 - 52.45. pg_rewrite")
/
[12](/docs/12/catalog-pg-rewrite.html "PostgreSQL 12 - 52.45. pg_rewrite")
/
[11](/docs/11/catalog-pg-rewrite.html "PostgreSQL 11 - 52.45. pg_rewrite")
/
[10](/docs/10/catalog-pg-rewrite.html "PostgreSQL 10 - 52.45. pg_rewrite")
/
[9.6](/docs/9.6/catalog-pg-rewrite.html "PostgreSQL 9.6 - 52.45. pg_rewrite")
/
[9.5](/docs/9.5/catalog-pg-rewrite.html "PostgreSQL 9.5 - 52.45. pg_rewrite")
/
[9.4](/docs/9.4/catalog-pg-rewrite.html "PostgreSQL 9.4 - 52.45. pg_rewrite")
/
[9.3](/docs/9.3/catalog-pg-rewrite.html "PostgreSQL 9.3 - 52.45. pg_rewrite")
/
[9.2](/docs/9.2/catalog-pg-rewrite.html "PostgreSQL 9.2 - 52.45. pg_rewrite")
/
[9.1](/docs/9.1/catalog-pg-rewrite.html "PostgreSQL 9.1 - 52.45. pg_rewrite")
/
[9.0](/docs/9.0/catalog-pg-rewrite.html "PostgreSQL 9.0 - 52.45. pg_rewrite")
/
[8.4](/docs/8.4/catalog-pg-rewrite.html "PostgreSQL 8.4 - 52.45. pg_rewrite")
/
[8.3](/docs/8.3/catalog-pg-rewrite.html "PostgreSQL 8.3 - 52.45. pg_rewrite")
/
[8.2](/docs/8.2/catalog-pg-rewrite.html "PostgreSQL 8.2 - 52.45. pg_rewrite")
/
[8.1](/docs/8.1/catalog-pg-rewrite.html "PostgreSQL 8.1 - 52.45. pg_rewrite")
/
[8.0](/docs/8.0/catalog-pg-rewrite.html "PostgreSQL 8.0 - 52.45. pg_rewrite")
/
[7.4](/docs/7.4/catalog-pg-rewrite.html "PostgreSQL 7.4 - 52.45. pg_rewrite")
/
[7.3](/docs/7.3/catalog-pg-rewrite.html "PostgreSQL 7.3 - 52.45. pg_rewrite")
/
[7.2](/docs/7.2/catalog-pg-rewrite.html "PostgreSQL 7.2 - 52.45. pg_rewrite")

## 52.45. `pg_rewrite` [#](#CATALOG-PG-REWRITE)

The catalog `pg_rewrite` stores rewrite rules for tables and views.

**Table 52.45. `pg_rewrite` Columns**

| Column Type  Description |
| --- |
| `oid` `oid`  Row identifier |
| `rulename` `name`  Rule name |
| `ev_class` `oid` (references [`pg_class`](catalog-pg-class.html "52.11. pg_class").`oid`)  The table this rule is for |
| `ev_type` `char`  Event type that the rule is for: 1 = [SELECT](sql-select.html "SELECT"), 2 = [UPDATE](sql-update.html "UPDATE"), 3 = [INSERT](sql-insert.html "INSERT"), 4 = [DELETE](sql-delete.html "DELETE") |
| `ev_enabled` `char`  Controls in which [session\_replication\_role](runtime-config-client.html#GUC-SESSION-REPLICATION-ROLE) modes the rule fires. `O` = rule fires in “origin” and “local” modes, `D` = rule is disabled, `R` = rule fires in “replica” mode, `A` = rule fires always. |
| `is_instead` `bool`  True if the rule is an `INSTEAD` rule |
| `ev_qual` `pg_node_tree`  Expression tree (in the form of a `nodeToString()` representation) for the rule's qualifying condition |
| `ev_action` `pg_node_tree`  Query tree (in the form of a `nodeToString()` representation) for the rule's action |

### Note

`pg_class.relhasrules` must be true if a table has any rules in this catalog.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/catalog-pg-rewrite.html/)
to report a documentation issue.
