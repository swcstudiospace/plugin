# PostgreSQL: Documentation: 18: DROP TABLE

Source: https://www.postgresql.org/docs/current/sql-droptable.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/sql-droptable.html "PostgreSQL 18 - DROP TABLE")
([18](/docs/18/sql-droptable.html "PostgreSQL 18 - DROP TABLE"))
/
[17](/docs/17/sql-droptable.html "PostgreSQL 17 - DROP TABLE")
/
[16](/docs/16/sql-droptable.html "PostgreSQL 16 - DROP TABLE")
/
[15](/docs/15/sql-droptable.html "PostgreSQL 15 - DROP TABLE")
/
[14](/docs/14/sql-droptable.html "PostgreSQL 14 - DROP TABLE")

Development Versions:
[19](/docs/19/sql-droptable.html "PostgreSQL 19 - DROP TABLE")
/
[devel](/docs/devel/sql-droptable.html "PostgreSQL devel - DROP TABLE")

Unsupported versions:
[13](/docs/13/sql-droptable.html "PostgreSQL 13 - DROP TABLE")
/
[12](/docs/12/sql-droptable.html "PostgreSQL 12 - DROP TABLE")
/
[11](/docs/11/sql-droptable.html "PostgreSQL 11 - DROP TABLE")
/
[10](/docs/10/sql-droptable.html "PostgreSQL 10 - DROP TABLE")
/
[9.6](/docs/9.6/sql-droptable.html "PostgreSQL 9.6 - DROP TABLE")
/
[9.5](/docs/9.5/sql-droptable.html "PostgreSQL 9.5 - DROP TABLE")
/
[9.4](/docs/9.4/sql-droptable.html "PostgreSQL 9.4 - DROP TABLE")
/
[9.3](/docs/9.3/sql-droptable.html "PostgreSQL 9.3 - DROP TABLE")
/
[9.2](/docs/9.2/sql-droptable.html "PostgreSQL 9.2 - DROP TABLE")
/
[9.1](/docs/9.1/sql-droptable.html "PostgreSQL 9.1 - DROP TABLE")
/
[9.0](/docs/9.0/sql-droptable.html "PostgreSQL 9.0 - DROP TABLE")
/
[8.4](/docs/8.4/sql-droptable.html "PostgreSQL 8.4 - DROP TABLE")
/
[8.3](/docs/8.3/sql-droptable.html "PostgreSQL 8.3 - DROP TABLE")
/
[8.2](/docs/8.2/sql-droptable.html "PostgreSQL 8.2 - DROP TABLE")
/
[8.1](/docs/8.1/sql-droptable.html "PostgreSQL 8.1 - DROP TABLE")
/
[8.0](/docs/8.0/sql-droptable.html "PostgreSQL 8.0 - DROP TABLE")
/
[7.4](/docs/7.4/sql-droptable.html "PostgreSQL 7.4 - DROP TABLE")
/
[7.3](/docs/7.3/sql-droptable.html "PostgreSQL 7.3 - DROP TABLE")
/
[7.2](/docs/7.2/sql-droptable.html "PostgreSQL 7.2 - DROP TABLE")
/
[7.1](/docs/7.1/sql-droptable.html "PostgreSQL 7.1 - DROP TABLE")

## DROP TABLE

DROP TABLE — remove a table

## Synopsis

```
DROP TABLE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description

`DROP TABLE` removes tables from the database. Only the table owner, the schema owner, and superuser can drop a table. To empty a table of rows without destroying the table, use [`DELETE`](sql-delete.html "DELETE") or [`TRUNCATE`](sql-truncate.html "TRUNCATE").

`DROP TABLE` always removes any indexes, rules, triggers, and constraints that exist for the target table. However, to drop a table that is referenced by a view or a foreign-key constraint of another table, `CASCADE` must be specified. (`CASCADE` will remove a dependent view entirely, but in the foreign-key case it will only remove the foreign-key constraint, not the other table entirely.)

## Parameters

`IF EXISTS`
:   Do not throw an error if the table does not exist. A notice is issued in this case.

*`name`*
:   The name (optionally schema-qualified) of the table to drop.

`CASCADE`
:   Automatically drop objects that depend on the table (such as views), and in turn all objects that depend on those objects (see [Section 5.15](ddl-depend.html "5.15. Dependency Tracking")).

`RESTRICT`
:   Refuse to drop the table if any objects depend on it. This is the default.

## Examples

To destroy two tables, `films` and `distributors`:

```
DROP TABLE films, distributors;
```

## Compatibility

This command conforms to the SQL standard, except that the standard only allows one table to be dropped per command, and apart from the `IF EXISTS` option, which is a PostgreSQL extension.

## See Also

[ALTER TABLE](sql-altertable.html "ALTER TABLE"), [CREATE TABLE](sql-createtable.html "CREATE TABLE")

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/sql-droptable.html/)
to report a documentation issue.
