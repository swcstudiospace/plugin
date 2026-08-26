# PostgreSQL: Documentation: 18: SPI_cursor_open

Source: https://www.postgresql.org/docs/current/spi-spi-cursor-open.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/spi-spi-cursor-open.html "PostgreSQL 18 - SPI_cursor_open")
([18](/docs/18/spi-spi-cursor-open.html "PostgreSQL 18 - SPI_cursor_open"))
/
[17](/docs/17/spi-spi-cursor-open.html "PostgreSQL 17 - SPI_cursor_open")
/
[16](/docs/16/spi-spi-cursor-open.html "PostgreSQL 16 - SPI_cursor_open")
/
[15](/docs/15/spi-spi-cursor-open.html "PostgreSQL 15 - SPI_cursor_open")
/
[14](/docs/14/spi-spi-cursor-open.html "PostgreSQL 14 - SPI_cursor_open")

Development Versions:
[19](/docs/19/spi-spi-cursor-open.html "PostgreSQL 19 - SPI_cursor_open")
/
[devel](/docs/devel/spi-spi-cursor-open.html "PostgreSQL devel - SPI_cursor_open")

Unsupported versions:
[13](/docs/13/spi-spi-cursor-open.html "PostgreSQL 13 - SPI_cursor_open")
/
[12](/docs/12/spi-spi-cursor-open.html "PostgreSQL 12 - SPI_cursor_open")
/
[11](/docs/11/spi-spi-cursor-open.html "PostgreSQL 11 - SPI_cursor_open")
/
[10](/docs/10/spi-spi-cursor-open.html "PostgreSQL 10 - SPI_cursor_open")
/
[9.6](/docs/9.6/spi-spi-cursor-open.html "PostgreSQL 9.6 - SPI_cursor_open")
/
[9.5](/docs/9.5/spi-spi-cursor-open.html "PostgreSQL 9.5 - SPI_cursor_open")
/
[9.4](/docs/9.4/spi-spi-cursor-open.html "PostgreSQL 9.4 - SPI_cursor_open")
/
[9.3](/docs/9.3/spi-spi-cursor-open.html "PostgreSQL 9.3 - SPI_cursor_open")
/
[9.2](/docs/9.2/spi-spi-cursor-open.html "PostgreSQL 9.2 - SPI_cursor_open")
/
[9.1](/docs/9.1/spi-spi-cursor-open.html "PostgreSQL 9.1 - SPI_cursor_open")
/
[9.0](/docs/9.0/spi-spi-cursor-open.html "PostgreSQL 9.0 - SPI_cursor_open")
/
[8.4](/docs/8.4/spi-spi-cursor-open.html "PostgreSQL 8.4 - SPI_cursor_open")
/
[8.3](/docs/8.3/spi-spi-cursor-open.html "PostgreSQL 8.3 - SPI_cursor_open")
/
[8.2](/docs/8.2/spi-spi-cursor-open.html "PostgreSQL 8.2 - SPI_cursor_open")
/
[8.1](/docs/8.1/spi-spi-cursor-open.html "PostgreSQL 8.1 - SPI_cursor_open")
/
[8.0](/docs/8.0/spi-spi-cursor-open.html "PostgreSQL 8.0 - SPI_cursor_open")
/
[7.4](/docs/7.4/spi-spi-cursor-open.html "PostgreSQL 7.4 - SPI_cursor_open")

## SPI\_cursor\_open

SPI\_cursor\_open — set up a cursor using a statement created with `SPI_prepare`

## Synopsis

```
Portal SPI_cursor_open(const char * name, SPIPlanPtr plan,
                       Datum * values, const char * nulls,
                       bool read_only)
```

## Description

`SPI_cursor_open` sets up a cursor (internally, a portal) that will execute a statement prepared by `SPI_prepare`. The parameters have the same meanings as the corresponding parameters to `SPI_execute_plan`.

Using a cursor instead of executing the statement directly has two benefits. First, the result rows can be retrieved a few at a time, avoiding memory overrun for queries that return many rows. Second, a portal can outlive the current C function (it can, in fact, live to the end of the current transaction). Returning the portal name to the C function's caller provides a way of returning a row set as result.

The passed-in parameter data will be copied into the cursor's portal, so it can be freed while the cursor still exists.

## Arguments

`const char * name`
:   name for portal, or `NULL` to let the system select a name

`SPIPlanPtr plan`
:   prepared statement (returned by `SPI_prepare`)

`Datum * values`
:   An array of actual parameter values. Must have same length as the statement's number of arguments.

`const char * nulls`
:   An array describing which parameters are null. Must have same length as the statement's number of arguments.

    If *`nulls`* is `NULL` then `SPI_cursor_open` assumes that no parameters are null. Otherwise, each entry of the *`nulls`* array should be `' '` if the corresponding parameter value is non-null, or `'n'` if the corresponding parameter value is null. (In the latter case, the actual value in the corresponding *`values`* entry doesn't matter.) Note that *`nulls`* is not a text string, just an array: it does not need a `'\0'` terminator.

`bool read_only`
:   `true` for read-only execution

## Return Value

Pointer to portal containing the cursor. Note there is no error return convention; any error will be reported via `elog`.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/spi-spi-cursor-open.html/)
to report a documentation issue.
