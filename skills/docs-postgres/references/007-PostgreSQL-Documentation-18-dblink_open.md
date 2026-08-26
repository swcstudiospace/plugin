# PostgreSQL: Documentation: 18: dblink_open

Source: https://www.postgresql.org/docs/current/contrib-dblink-open.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/contrib-dblink-open.html "PostgreSQL 18 - dblink_open")
([18](/docs/18/contrib-dblink-open.html "PostgreSQL 18 - dblink_open"))
/
[17](/docs/17/contrib-dblink-open.html "PostgreSQL 17 - dblink_open")
/
[16](/docs/16/contrib-dblink-open.html "PostgreSQL 16 - dblink_open")
/
[15](/docs/15/contrib-dblink-open.html "PostgreSQL 15 - dblink_open")
/
[14](/docs/14/contrib-dblink-open.html "PostgreSQL 14 - dblink_open")

Development Versions:
[19](/docs/19/contrib-dblink-open.html "PostgreSQL 19 - dblink_open")
/
[devel](/docs/devel/contrib-dblink-open.html "PostgreSQL devel - dblink_open")

Unsupported versions:
[13](/docs/13/contrib-dblink-open.html "PostgreSQL 13 - dblink_open")
/
[12](/docs/12/contrib-dblink-open.html "PostgreSQL 12 - dblink_open")
/
[11](/docs/11/contrib-dblink-open.html "PostgreSQL 11 - dblink_open")
/
[10](/docs/10/contrib-dblink-open.html "PostgreSQL 10 - dblink_open")
/
[9.6](/docs/9.6/contrib-dblink-open.html "PostgreSQL 9.6 - dblink_open")
/
[9.5](/docs/9.5/contrib-dblink-open.html "PostgreSQL 9.5 - dblink_open")
/
[9.4](/docs/9.4/contrib-dblink-open.html "PostgreSQL 9.4 - dblink_open")
/
[9.3](/docs/9.3/contrib-dblink-open.html "PostgreSQL 9.3 - dblink_open")
/
[9.2](/docs/9.2/contrib-dblink-open.html "PostgreSQL 9.2 - dblink_open")
/
[9.1](/docs/9.1/contrib-dblink-open.html "PostgreSQL 9.1 - dblink_open")
/
[9.0](/docs/9.0/contrib-dblink-open.html "PostgreSQL 9.0 - dblink_open")
/
[8.4](/docs/8.4/contrib-dblink-open.html "PostgreSQL 8.4 - dblink_open")
/
[8.3](/docs/8.3/contrib-dblink-open.html "PostgreSQL 8.3 - dblink_open")

## dblink\_open

dblink\_open — opens a cursor in a remote database

## Synopsis

```
dblink_open(text cursorname, text sql [, bool fail_on_error]) returns text
dblink_open(text connname, text cursorname, text sql [, bool fail_on_error]) returns text
```

## Description

`dblink_open()` opens a cursor in a remote database. The cursor can subsequently be manipulated with `dblink_fetch()` and `dblink_close()`.

## Arguments

*`connname`*
:   Name of the connection to use; omit this parameter to use the unnamed connection.

*`cursorname`*
:   The name to assign to this cursor.

*`sql`*
:   The `SELECT` statement that you wish to execute in the remote database, for example `select * from pg_class`.

*`fail_on_error`*
:   If true (the default when omitted) then an error thrown on the remote side of the connection causes an error to also be thrown locally. If false, the remote error is locally reported as a NOTICE, and the function's return value is set to `ERROR`.

## Return Value

Returns status, either `OK` or `ERROR`.

## Notes

Since a cursor can only persist within a transaction, `dblink_open` starts an explicit transaction block (`BEGIN`) on the remote side, if the remote side was not already within a transaction. This transaction will be closed again when the matching `dblink_close` is executed. Note that if you use `dblink_exec` to change data between `dblink_open` and `dblink_close`, and then an error occurs or you use `dblink_disconnect` before `dblink_close`, your change *will be lost* because the transaction will be aborted.

## Examples

```
SELECT dblink_connect('dbname=postgres options=-csearch_path=');
 dblink_connect
----------------
 OK
(1 row)

SELECT dblink_open('foo', 'select proname, prosrc from pg_proc');
 dblink_open
-------------
 OK
(1 row)
```

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/contrib-dblink-open.html/)
to report a documentation issue.
