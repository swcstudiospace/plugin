# PostgreSQL: Documentation: 18: dblink_close

Source: https://www.postgresql.org/docs/current/contrib-dblink-close.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/contrib-dblink-close.html "PostgreSQL 18 - dblink_close")
([18](/docs/18/contrib-dblink-close.html "PostgreSQL 18 - dblink_close"))
/
[17](/docs/17/contrib-dblink-close.html "PostgreSQL 17 - dblink_close")
/
[16](/docs/16/contrib-dblink-close.html "PostgreSQL 16 - dblink_close")
/
[15](/docs/15/contrib-dblink-close.html "PostgreSQL 15 - dblink_close")
/
[14](/docs/14/contrib-dblink-close.html "PostgreSQL 14 - dblink_close")

Development Versions:
[19](/docs/19/contrib-dblink-close.html "PostgreSQL 19 - dblink_close")
/
[devel](/docs/devel/contrib-dblink-close.html "PostgreSQL devel - dblink_close")

Unsupported versions:
[13](/docs/13/contrib-dblink-close.html "PostgreSQL 13 - dblink_close")
/
[12](/docs/12/contrib-dblink-close.html "PostgreSQL 12 - dblink_close")
/
[11](/docs/11/contrib-dblink-close.html "PostgreSQL 11 - dblink_close")
/
[10](/docs/10/contrib-dblink-close.html "PostgreSQL 10 - dblink_close")
/
[9.6](/docs/9.6/contrib-dblink-close.html "PostgreSQL 9.6 - dblink_close")
/
[9.5](/docs/9.5/contrib-dblink-close.html "PostgreSQL 9.5 - dblink_close")
/
[9.4](/docs/9.4/contrib-dblink-close.html "PostgreSQL 9.4 - dblink_close")
/
[9.3](/docs/9.3/contrib-dblink-close.html "PostgreSQL 9.3 - dblink_close")
/
[9.2](/docs/9.2/contrib-dblink-close.html "PostgreSQL 9.2 - dblink_close")
/
[9.1](/docs/9.1/contrib-dblink-close.html "PostgreSQL 9.1 - dblink_close")
/
[9.0](/docs/9.0/contrib-dblink-close.html "PostgreSQL 9.0 - dblink_close")
/
[8.4](/docs/8.4/contrib-dblink-close.html "PostgreSQL 8.4 - dblink_close")
/
[8.3](/docs/8.3/contrib-dblink-close.html "PostgreSQL 8.3 - dblink_close")

## dblink\_close

dblink\_close — closes a cursor in a remote database

## Synopsis

```
dblink_close(text cursorname [, bool fail_on_error]) returns text
dblink_close(text connname, text cursorname [, bool fail_on_error]) returns text
```

## Description

`dblink_close` closes a cursor previously opened with `dblink_open`.

## Arguments

*`connname`*
:   Name of the connection to use; omit this parameter to use the unnamed connection.

*`cursorname`*
:   The name of the cursor to close.

*`fail_on_error`*
:   If true (the default when omitted) then an error thrown on the remote side of the connection causes an error to also be thrown locally. If false, the remote error is locally reported as a NOTICE, and the function's return value is set to `ERROR`.

## Return Value

Returns status, either `OK` or `ERROR`.

## Notes

If `dblink_open` started an explicit transaction block, and this is the last remaining open cursor in this connection, `dblink_close` will issue the matching `COMMIT`.

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

SELECT dblink_close('foo');
 dblink_close
--------------
 OK
(1 row)
```

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/contrib-dblink-close.html/)
to report a documentation issue.
