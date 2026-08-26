# PostgreSQL: Documentation: 18: ALTER TABLESPACE

Source: https://www.postgresql.org/docs/current/sql-altertablespace.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/sql-altertablespace.html "PostgreSQL 18 - ALTER TABLESPACE")
([18](/docs/18/sql-altertablespace.html "PostgreSQL 18 - ALTER TABLESPACE"))
/
[17](/docs/17/sql-altertablespace.html "PostgreSQL 17 - ALTER TABLESPACE")
/
[16](/docs/16/sql-altertablespace.html "PostgreSQL 16 - ALTER TABLESPACE")
/
[15](/docs/15/sql-altertablespace.html "PostgreSQL 15 - ALTER TABLESPACE")
/
[14](/docs/14/sql-altertablespace.html "PostgreSQL 14 - ALTER TABLESPACE")

Development Versions:
[19](/docs/19/sql-altertablespace.html "PostgreSQL 19 - ALTER TABLESPACE")
/
[devel](/docs/devel/sql-altertablespace.html "PostgreSQL devel - ALTER TABLESPACE")

Unsupported versions:
[13](/docs/13/sql-altertablespace.html "PostgreSQL 13 - ALTER TABLESPACE")
/
[12](/docs/12/sql-altertablespace.html "PostgreSQL 12 - ALTER TABLESPACE")
/
[11](/docs/11/sql-altertablespace.html "PostgreSQL 11 - ALTER TABLESPACE")
/
[10](/docs/10/sql-altertablespace.html "PostgreSQL 10 - ALTER TABLESPACE")
/
[9.6](/docs/9.6/sql-altertablespace.html "PostgreSQL 9.6 - ALTER TABLESPACE")
/
[9.5](/docs/9.5/sql-altertablespace.html "PostgreSQL 9.5 - ALTER TABLESPACE")
/
[9.4](/docs/9.4/sql-altertablespace.html "PostgreSQL 9.4 - ALTER TABLESPACE")
/
[9.3](/docs/9.3/sql-altertablespace.html "PostgreSQL 9.3 - ALTER TABLESPACE")
/
[9.2](/docs/9.2/sql-altertablespace.html "PostgreSQL 9.2 - ALTER TABLESPACE")
/
[9.1](/docs/9.1/sql-altertablespace.html "PostgreSQL 9.1 - ALTER TABLESPACE")
/
[9.0](/docs/9.0/sql-altertablespace.html "PostgreSQL 9.0 - ALTER TABLESPACE")
/
[8.4](/docs/8.4/sql-altertablespace.html "PostgreSQL 8.4 - ALTER TABLESPACE")
/
[8.3](/docs/8.3/sql-altertablespace.html "PostgreSQL 8.3 - ALTER TABLESPACE")
/
[8.2](/docs/8.2/sql-altertablespace.html "PostgreSQL 8.2 - ALTER TABLESPACE")
/
[8.1](/docs/8.1/sql-altertablespace.html "PostgreSQL 8.1 - ALTER TABLESPACE")
/
[8.0](/docs/8.0/sql-altertablespace.html "PostgreSQL 8.0 - ALTER TABLESPACE")

## ALTER TABLESPACE

ALTER TABLESPACE — change the definition of a tablespace

## Synopsis

```
ALTER TABLESPACE name RENAME TO new_name
ALTER TABLESPACE name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER TABLESPACE name SET ( tablespace_option = value [, ... ] )
ALTER TABLESPACE name RESET ( tablespace_option [, ... ] )
```

## Description

`ALTER TABLESPACE` can be used to change the definition of a tablespace.

You must own the tablespace to change the definition of a tablespace. To alter the owner, you must also be able to `SET ROLE` to the new owning role. (Note that superusers have these privileges automatically.)

## Parameters

*`name`*
:   The name of an existing tablespace.

*`new_name`*
:   The new name of the tablespace. The new name cannot begin with `pg_`, as such names are reserved for system tablespaces.

*`new_owner`*
:   The new owner of the tablespace.

*`tablespace_option`*
:   A tablespace parameter to be set or reset. Currently, the only available parameters are `seq_page_cost`, `random_page_cost`, `effective_io_concurrency` and `maintenance_io_concurrency`. Setting these values for a particular tablespace will override the planner's usual estimate of the cost of reading pages from tables in that tablespace, and how many concurrent I/Os are issued, as established by the configuration parameters of the same name (see [seq\_page\_cost](runtime-config-query.html#GUC-SEQ-PAGE-COST), [random\_page\_cost](runtime-config-query.html#GUC-RANDOM-PAGE-COST), [effective\_io\_concurrency](runtime-config-resource.html#GUC-EFFECTIVE-IO-CONCURRENCY), [maintenance\_io\_concurrency](runtime-config-resource.html#GUC-MAINTENANCE-IO-CONCURRENCY)). This may be useful if one tablespace is located on a disk which is faster or slower than the remainder of the I/O subsystem.

## Examples

Rename tablespace `index_space` to `fast_raid`:

```
ALTER TABLESPACE index_space RENAME TO fast_raid;
```

Change the owner of tablespace `index_space`:

```
ALTER TABLESPACE index_space OWNER TO mary;
```

## Compatibility

There is no `ALTER TABLESPACE` statement in the SQL standard.

## See Also

[CREATE TABLESPACE](sql-createtablespace.html "CREATE TABLESPACE"), [DROP TABLESPACE](sql-droptablespace.html "DROP TABLESPACE")

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/sql-altertablespace.html/)
to report a documentation issue.
