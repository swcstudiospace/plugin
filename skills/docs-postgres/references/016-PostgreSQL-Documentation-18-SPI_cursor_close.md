# PostgreSQL: Documentation: 18: SPI_cursor_close

Source: https://www.postgresql.org/docs/current/spi-spi-cursor-close.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/spi-spi-cursor-close.html "PostgreSQL 18 - SPI_cursor_close")
([18](/docs/18/spi-spi-cursor-close.html "PostgreSQL 18 - SPI_cursor_close"))
/
[17](/docs/17/spi-spi-cursor-close.html "PostgreSQL 17 - SPI_cursor_close")
/
[16](/docs/16/spi-spi-cursor-close.html "PostgreSQL 16 - SPI_cursor_close")
/
[15](/docs/15/spi-spi-cursor-close.html "PostgreSQL 15 - SPI_cursor_close")
/
[14](/docs/14/spi-spi-cursor-close.html "PostgreSQL 14 - SPI_cursor_close")

Development Versions:
[19](/docs/19/spi-spi-cursor-close.html "PostgreSQL 19 - SPI_cursor_close")
/
[devel](/docs/devel/spi-spi-cursor-close.html "PostgreSQL devel - SPI_cursor_close")

Unsupported versions:
[13](/docs/13/spi-spi-cursor-close.html "PostgreSQL 13 - SPI_cursor_close")
/
[12](/docs/12/spi-spi-cursor-close.html "PostgreSQL 12 - SPI_cursor_close")
/
[11](/docs/11/spi-spi-cursor-close.html "PostgreSQL 11 - SPI_cursor_close")
/
[10](/docs/10/spi-spi-cursor-close.html "PostgreSQL 10 - SPI_cursor_close")
/
[9.6](/docs/9.6/spi-spi-cursor-close.html "PostgreSQL 9.6 - SPI_cursor_close")
/
[9.5](/docs/9.5/spi-spi-cursor-close.html "PostgreSQL 9.5 - SPI_cursor_close")
/
[9.4](/docs/9.4/spi-spi-cursor-close.html "PostgreSQL 9.4 - SPI_cursor_close")
/
[9.3](/docs/9.3/spi-spi-cursor-close.html "PostgreSQL 9.3 - SPI_cursor_close")
/
[9.2](/docs/9.2/spi-spi-cursor-close.html "PostgreSQL 9.2 - SPI_cursor_close")
/
[9.1](/docs/9.1/spi-spi-cursor-close.html "PostgreSQL 9.1 - SPI_cursor_close")
/
[9.0](/docs/9.0/spi-spi-cursor-close.html "PostgreSQL 9.0 - SPI_cursor_close")
/
[8.4](/docs/8.4/spi-spi-cursor-close.html "PostgreSQL 8.4 - SPI_cursor_close")
/
[8.3](/docs/8.3/spi-spi-cursor-close.html "PostgreSQL 8.3 - SPI_cursor_close")
/
[8.2](/docs/8.2/spi-spi-cursor-close.html "PostgreSQL 8.2 - SPI_cursor_close")
/
[8.1](/docs/8.1/spi-spi-cursor-close.html "PostgreSQL 8.1 - SPI_cursor_close")
/
[8.0](/docs/8.0/spi-spi-cursor-close.html "PostgreSQL 8.0 - SPI_cursor_close")
/
[7.4](/docs/7.4/spi-spi-cursor-close.html "PostgreSQL 7.4 - SPI_cursor_close")

## SPI\_cursor\_close

SPI\_cursor\_close — close a cursor

## Synopsis

```
void SPI_cursor_close(Portal portal)
```

## Description

`SPI_cursor_close` closes a previously created cursor and releases its portal storage.

All open cursors are closed automatically at the end of a transaction. `SPI_cursor_close` need only be invoked if it is desirable to release resources sooner.

## Arguments

`Portal portal`
:   portal containing the cursor

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/spi-spi-cursor-close.html/)
to report a documentation issue.
