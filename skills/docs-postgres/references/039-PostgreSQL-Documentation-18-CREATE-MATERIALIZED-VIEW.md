# PostgreSQL: Documentation: 18: CREATE MATERIALIZED VIEW

Source: https://www.postgresql.org/docs/current/sql-creatematerializedview.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/sql-creatematerializedview.html "PostgreSQL 18 - CREATE MATERIALIZED VIEW")
([18](/docs/18/sql-creatematerializedview.html "PostgreSQL 18 - CREATE MATERIALIZED VIEW"))
/
[17](/docs/17/sql-creatematerializedview.html "PostgreSQL 17 - CREATE MATERIALIZED VIEW")
/
[16](/docs/16/sql-creatematerializedview.html "PostgreSQL 16 - CREATE MATERIALIZED VIEW")
/
[15](/docs/15/sql-creatematerializedview.html "PostgreSQL 15 - CREATE MATERIALIZED VIEW")
/
[14](/docs/14/sql-creatematerializedview.html "PostgreSQL 14 - CREATE MATERIALIZED VIEW")

Development Versions:
[19](/docs/19/sql-creatematerializedview.html "PostgreSQL 19 - CREATE MATERIALIZED VIEW")
/
[devel](/docs/devel/sql-creatematerializedview.html "PostgreSQL devel - CREATE MATERIALIZED VIEW")

Unsupported versions:
[13](/docs/13/sql-creatematerializedview.html "PostgreSQL 13 - CREATE MATERIALIZED VIEW")
/
[12](/docs/12/sql-creatematerializedview.html "PostgreSQL 12 - CREATE MATERIALIZED VIEW")
/
[11](/docs/11/sql-creatematerializedview.html "PostgreSQL 11 - CREATE MATERIALIZED VIEW")
/
[10](/docs/10/sql-creatematerializedview.html "PostgreSQL 10 - CREATE MATERIALIZED VIEW")
/
[9.6](/docs/9.6/sql-creatematerializedview.html "PostgreSQL 9.6 - CREATE MATERIALIZED VIEW")
/
[9.5](/docs/9.5/sql-creatematerializedview.html "PostgreSQL 9.5 - CREATE MATERIALIZED VIEW")
/
[9.4](/docs/9.4/sql-creatematerializedview.html "PostgreSQL 9.4 - CREATE MATERIALIZED VIEW")
/
[9.3](/docs/9.3/sql-creatematerializedview.html "PostgreSQL 9.3 - CREATE MATERIALIZED VIEW")

## CREATE MATERIALIZED VIEW

CREATE MATERIALIZED VIEW — define a new materialized view

## Synopsis

```
CREATE MATERIALIZED VIEW [ IF NOT EXISTS ] table_name
    [ (column_name [, ...] ) ]
    [ USING method ]
    [ WITH ( storage_parameter [= value] [, ... ] ) ]
    [ TABLESPACE tablespace_name ]
    AS query
    [ WITH [ NO ] DATA ]
```

## Description

`CREATE MATERIALIZED VIEW` defines a materialized view of a query. The query is executed and used to populate the view at the time the command is issued (unless `WITH NO DATA` is used) and may be refreshed later using `REFRESH MATERIALIZED VIEW`.

`CREATE MATERIALIZED VIEW` is similar to `CREATE TABLE AS`, except that it also remembers the query used to initialize the view, so that it can be refreshed later upon demand. A materialized view has many of the same properties as a table, but there is no support for temporary materialized views.

`CREATE MATERIALIZED VIEW` requires `CREATE` privilege on the schema used for the materialized view.

## Parameters

`IF NOT EXISTS`
:   Do not throw an error if a materialized view with the same name already exists. A notice is issued in this case. Note that there is no guarantee that the existing materialized view is anything like the one that would have been created.

*`table_name`*
:   The name (optionally schema-qualified) of the materialized view to be created. The name must be distinct from the name of any other relation (table, sequence, index, view, materialized view, or foreign table) in the same schema.

*`column_name`*
:   The name of a column in the new materialized view. If column names are not provided, they are taken from the output column names of the query.

`USING method`
:   This optional clause specifies the table access method to use to store the contents for the new materialized view; the method needs be an access method of type `TABLE`. See [Chapter 62](tableam.html "Chapter 62. Table Access Method Interface Definition") for more information. If this option is not specified, the default table access method is chosen for the new materialized view. See [default\_table\_access\_method](runtime-config-client.html#GUC-DEFAULT-TABLE-ACCESS-METHOD) for more information.

`WITH ( storage_parameter [= value] [, ... ] )`
:   This clause specifies optional storage parameters for the new materialized view; see [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS "Storage Parameters") in the [CREATE TABLE](sql-createtable.html "CREATE TABLE") documentation for more information. All parameters supported for `CREATE TABLE` are also supported for `CREATE MATERIALIZED VIEW`. See [CREATE TABLE](sql-createtable.html "CREATE TABLE") for more information.

`TABLESPACE tablespace_name`
:   The *`tablespace_name`* is the name of the tablespace in which the new materialized view is to be created. If not specified, [default\_tablespace](runtime-config-client.html#GUC-DEFAULT-TABLESPACE) is consulted.

*`query`*
:   A [`SELECT`](sql-select.html "SELECT"), [`TABLE`](sql-select.html#SQL-TABLE "TABLE Command"), or [`VALUES`](sql-values.html "VALUES") command. This query will run within a security-restricted operation; in particular, calls to functions that themselves create temporary tables will fail. Also, while the query is running, the [search\_path](runtime-config-client.html#GUC-SEARCH-PATH) is temporarily changed to `pg_catalog, pg_temp`.

`WITH [ NO ] DATA`
:   This clause specifies whether or not the materialized view should be populated at creation time. If not, the materialized view will be flagged as unscannable and cannot be queried until `REFRESH MATERIALIZED VIEW` is used.

## Compatibility

`CREATE MATERIALIZED VIEW` is a PostgreSQL extension.

## See Also

[ALTER MATERIALIZED VIEW](sql-altermaterializedview.html "ALTER MATERIALIZED VIEW"), [CREATE TABLE AS](sql-createtableas.html "CREATE TABLE AS"), [CREATE VIEW](sql-createview.html "CREATE VIEW"), [DROP MATERIALIZED VIEW](sql-dropmaterializedview.html "DROP MATERIALIZED VIEW"), [REFRESH MATERIALIZED VIEW](sql-refreshmaterializedview.html "REFRESH MATERIALIZED VIEW")

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/sql-creatematerializedview.html/)
to report a documentation issue.
