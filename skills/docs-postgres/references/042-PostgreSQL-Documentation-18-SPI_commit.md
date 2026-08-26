# PostgreSQL: Documentation: 18: SPI_commit

Source: https://www.postgresql.org/docs/current/spi-spi-commit.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/spi-spi-commit.html "PostgreSQL 18 - SPI_commit")
([18](/docs/18/spi-spi-commit.html "PostgreSQL 18 - SPI_commit"))
/
[17](/docs/17/spi-spi-commit.html "PostgreSQL 17 - SPI_commit")
/
[16](/docs/16/spi-spi-commit.html "PostgreSQL 16 - SPI_commit")
/
[15](/docs/15/spi-spi-commit.html "PostgreSQL 15 - SPI_commit")
/
[14](/docs/14/spi-spi-commit.html "PostgreSQL 14 - SPI_commit")

Development Versions:
[19](/docs/19/spi-spi-commit.html "PostgreSQL 19 - SPI_commit")
/
[devel](/docs/devel/spi-spi-commit.html "PostgreSQL devel - SPI_commit")

Unsupported versions:
[13](/docs/13/spi-spi-commit.html "PostgreSQL 13 - SPI_commit")
/
[12](/docs/12/spi-spi-commit.html "PostgreSQL 12 - SPI_commit")
/
[11](/docs/11/spi-spi-commit.html "PostgreSQL 11 - SPI_commit")

## SPI\_commit

SPI\_commit, SPI\_commit\_and\_chain — commit the current transaction

## Synopsis

```
void SPI_commit(void)
```

```
void SPI_commit_and_chain(void)
```

## Description

`SPI_commit` commits the current transaction. It is approximately equivalent to running the SQL command `COMMIT`. After the transaction is committed, a new transaction is automatically started using default transaction characteristics, so that the caller can continue using SPI facilities. If there is a failure during commit, the current transaction is instead rolled back and a new transaction is started, after which the error is thrown in the usual way.

`SPI_commit_and_chain` is the same, but the new transaction is started with the same transaction characteristics as the just finished one, like with the SQL command `COMMIT AND CHAIN`.

These functions can only be executed if the SPI connection has been set as nonatomic in the call to `SPI_connect_ext`.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/spi-spi-commit.html/)
to report a documentation issue.
