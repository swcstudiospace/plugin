# PostgreSQL: Documentation: 18: F.45. test_decoding — SQL-based test/example module for WAL logical decoding

Source: https://www.postgresql.org/docs/current/test-decoding.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/test-decoding.html "PostgreSQL 18 - F.45. test_decoding — SQL-based test/example module for WAL logical decoding")
([18](/docs/18/test-decoding.html "PostgreSQL 18 - F.45. test_decoding — SQL-based test/example module for WAL logical decoding"))
/
[17](/docs/17/test-decoding.html "PostgreSQL 17 - F.45. test_decoding — SQL-based test/example module for WAL logical decoding")
/
[16](/docs/16/test-decoding.html "PostgreSQL 16 - F.45. test_decoding — SQL-based test/example module for WAL logical decoding")
/
[15](/docs/15/test-decoding.html "PostgreSQL 15 - F.45. test_decoding — SQL-based test/example module for WAL logical decoding")
/
[14](/docs/14/test-decoding.html "PostgreSQL 14 - F.45. test_decoding — SQL-based test/example module for WAL logical decoding")

Development Versions:
[19](/docs/19/test-decoding.html "PostgreSQL 19 - F.45. test_decoding — SQL-based test/example module for WAL logical decoding")
/
[devel](/docs/devel/test-decoding.html "PostgreSQL devel - F.45. test_decoding — SQL-based test/example module for WAL logical decoding")

Unsupported versions:
[13](/docs/13/test-decoding.html "PostgreSQL 13 - F.45. test_decoding — SQL-based test/example module for WAL logical decoding")
/
[12](/docs/12/test-decoding.html "PostgreSQL 12 - F.45. test_decoding — SQL-based test/example module for WAL logical decoding")
/
[11](/docs/11/test-decoding.html "PostgreSQL 11 - F.45. test_decoding — SQL-based test/example module for WAL logical decoding")
/
[10](/docs/10/test-decoding.html "PostgreSQL 10 - F.45. test_decoding — SQL-based test/example module for WAL logical decoding")
/
[9.6](/docs/9.6/test-decoding.html "PostgreSQL 9.6 - F.45. test_decoding — SQL-based test/example module for WAL logical decoding")
/
[9.5](/docs/9.5/test-decoding.html "PostgreSQL 9.5 - F.45. test_decoding — SQL-based test/example module for WAL logical decoding")
/
[9.4](/docs/9.4/test-decoding.html "PostgreSQL 9.4 - F.45. test_decoding — SQL-based test/example module for WAL logical decoding")

## F.45. test\_decoding — SQL-based test/example module for WAL logical decoding [#](#TEST-DECODING)

`test_decoding` is an example of a logical decoding output plugin. It doesn't do anything especially useful, but can serve as a starting point for developing your own output plugin.

`test_decoding` receives WAL through the logical decoding mechanism and decodes it into text representations of the operations performed.

Typical output from this plugin, used over the SQL logical decoding interface, might be:

```
postgres=# SELECT * FROM pg_logical_slot_get_changes('test_slot', NULL, NULL, 'include-xids', '0');
   lsn     | xid |                       data
-----------+-----+--------------------------------------------------
 0/16D30F8 | 691 | BEGIN
 0/16D32A0 | 691 | table public.data: INSERT: id[int4]:2 data[text]:'arg'
 0/16D32A0 | 691 | table public.data: INSERT: id[int4]:3 data[text]:'demo'
 0/16D32A0 | 691 | COMMIT
 0/16D32D8 | 692 | BEGIN
 0/16D3398 | 692 | table public.data: DELETE: id[int4]:2
 0/16D3398 | 692 | table public.data: DELETE: id[int4]:3
 0/16D3398 | 692 | COMMIT
(8 rows)
```

We can also get the changes of the in-progress transaction, and the typical output might be:

```
postgres[33712]=#* SELECT * FROM pg_logical_slot_get_changes('test_slot', NULL, NULL, 'stream-changes', '1');
    lsn    | xid |                       data
-----------+-----+--------------------------------------------------
 0/16B21F8 | 503 | opening a streamed block for transaction TXN 503
 0/16B21F8 | 503 | streaming change for TXN 503
 0/16B2300 | 503 | streaming change for TXN 503
 0/16B2408 | 503 | streaming change for TXN 503
 0/16BEBA0 | 503 | closing a streamed block for transaction TXN 503
 0/16B21F8 | 503 | opening a streamed block for transaction TXN 503
 0/16BECA8 | 503 | streaming change for TXN 503
 0/16BEDB0 | 503 | streaming change for TXN 503
 0/16BEEB8 | 503 | streaming change for TXN 503
 0/16BEBA0 | 503 | closing a streamed block for transaction TXN 503
(10 rows)
```

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/test-decoding.html/)
to report a documentation issue.
