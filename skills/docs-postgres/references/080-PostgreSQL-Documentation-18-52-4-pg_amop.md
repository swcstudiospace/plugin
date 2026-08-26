# PostgreSQL: Documentation: 18: 52.4. pg_amop

Source: https://www.postgresql.org/docs/current/catalog-pg-amop.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/catalog-pg-amop.html "PostgreSQL 18 - 52.4. pg_amop")
([18](/docs/18/catalog-pg-amop.html "PostgreSQL 18 - 52.4. pg_amop"))
/
[17](/docs/17/catalog-pg-amop.html "PostgreSQL 17 - 52.4. pg_amop")
/
[16](/docs/16/catalog-pg-amop.html "PostgreSQL 16 - 52.4. pg_amop")
/
[15](/docs/15/catalog-pg-amop.html "PostgreSQL 15 - 52.4. pg_amop")
/
[14](/docs/14/catalog-pg-amop.html "PostgreSQL 14 - 52.4. pg_amop")

Development Versions:
[19](/docs/19/catalog-pg-amop.html "PostgreSQL 19 - 52.4. pg_amop")
/
[devel](/docs/devel/catalog-pg-amop.html "PostgreSQL devel - 52.4. pg_amop")

Unsupported versions:
[13](/docs/13/catalog-pg-amop.html "PostgreSQL 13 - 52.4. pg_amop")
/
[12](/docs/12/catalog-pg-amop.html "PostgreSQL 12 - 52.4. pg_amop")
/
[11](/docs/11/catalog-pg-amop.html "PostgreSQL 11 - 52.4. pg_amop")
/
[10](/docs/10/catalog-pg-amop.html "PostgreSQL 10 - 52.4. pg_amop")
/
[9.6](/docs/9.6/catalog-pg-amop.html "PostgreSQL 9.6 - 52.4. pg_amop")
/
[9.5](/docs/9.5/catalog-pg-amop.html "PostgreSQL 9.5 - 52.4. pg_amop")
/
[9.4](/docs/9.4/catalog-pg-amop.html "PostgreSQL 9.4 - 52.4. pg_amop")
/
[9.3](/docs/9.3/catalog-pg-amop.html "PostgreSQL 9.3 - 52.4. pg_amop")
/
[9.2](/docs/9.2/catalog-pg-amop.html "PostgreSQL 9.2 - 52.4. pg_amop")
/
[9.1](/docs/9.1/catalog-pg-amop.html "PostgreSQL 9.1 - 52.4. pg_amop")
/
[9.0](/docs/9.0/catalog-pg-amop.html "PostgreSQL 9.0 - 52.4. pg_amop")
/
[8.4](/docs/8.4/catalog-pg-amop.html "PostgreSQL 8.4 - 52.4. pg_amop")
/
[8.3](/docs/8.3/catalog-pg-amop.html "PostgreSQL 8.3 - 52.4. pg_amop")
/
[8.2](/docs/8.2/catalog-pg-amop.html "PostgreSQL 8.2 - 52.4. pg_amop")
/
[8.1](/docs/8.1/catalog-pg-amop.html "PostgreSQL 8.1 - 52.4. pg_amop")
/
[8.0](/docs/8.0/catalog-pg-amop.html "PostgreSQL 8.0 - 52.4. pg_amop")
/
[7.4](/docs/7.4/catalog-pg-amop.html "PostgreSQL 7.4 - 52.4. pg_amop")
/
[7.3](/docs/7.3/catalog-pg-amop.html "PostgreSQL 7.3 - 52.4. pg_amop")

## 52.4. `pg_amop` [#](#CATALOG-PG-AMOP)

The catalog `pg_amop` stores information about operators associated with access method operator families. There is one row for each operator that is a member of an operator family. A family member can be either a *search* operator or an *ordering* operator. An operator can appear in more than one family, but cannot appear in more than one search position nor more than one ordering position within a family. (It is allowed, though unlikely, for an operator to be used for both search and ordering purposes.)

**Table 52.4. `pg_amop` Columns**

| Column Type  Description |
| --- |
| `oid` `oid`  Row identifier |
| `amopfamily` `oid` (references [`pg_opfamily`](catalog-pg-opfamily.html "52.35. pg_opfamily").`oid`)  The operator family this entry is for |
| `amoplefttype` `oid` (references [`pg_type`](catalog-pg-type.html "52.64. pg_type").`oid`)  Left-hand input data type of operator |
| `amoprighttype` `oid` (references [`pg_type`](catalog-pg-type.html "52.64. pg_type").`oid`)  Right-hand input data type of operator |
| `amopstrategy` `int2`  Operator strategy number |
| `amoppurpose` `char`  Operator purpose, either `s` for search or `o` for ordering |
| `amopopr` `oid` (references [`pg_operator`](catalog-pg-operator.html "52.34. pg_operator").`oid`)  OID of the operator |
| `amopmethod` `oid` (references [`pg_am`](catalog-pg-am.html "52.3. pg_am").`oid`)  Index access method operator family is for |
| `amopsortfamily` `oid` (references [`pg_opfamily`](catalog-pg-opfamily.html "52.35. pg_opfamily").`oid`)  The B-tree operator family this entry sorts according to, if an ordering operator; zero if a search operator |

A “search” operator entry indicates that an index of this operator family can be searched to find all rows satisfying `WHERE` *`indexed_column`* *`operator`* *`constant`*. Obviously, such an operator must return `boolean`, and its left-hand input type must match the index's column data type.

An “ordering” operator entry indicates that an index of this operator family can be scanned to return rows in the order represented by `ORDER BY` *`indexed_column`* *`operator`* *`constant`*. Such an operator could return any sortable data type, though again its left-hand input type must match the index's column data type. The exact semantics of the `ORDER BY` are specified by the `amopsortfamily` column, which must reference a B-tree operator family for the operator's result type.

### Note

At present, it's assumed that the sort order for an ordering operator is the default for the referenced operator family, i.e., `ASC NULLS LAST`. This might someday be relaxed by adding additional columns to specify sort options explicitly.

An entry's `amopmethod` must match the `opfmethod` of its containing operator family (including `amopmethod` here is an intentional denormalization of the catalog structure for performance reasons). Also, `amoplefttype` and `amoprighttype` must match the `oprleft` and `oprright` fields of the referenced [`pg_operator`](catalog-pg-operator.html "52.34. pg_operator") entry.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/catalog-pg-amop.html/)
to report a documentation issue.
