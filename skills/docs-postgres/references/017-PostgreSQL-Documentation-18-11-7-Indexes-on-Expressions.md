# PostgreSQL: Documentation: 18: 11.7. Indexes on Expressions

Source: https://www.postgresql.org/docs/current/indexes-expressional.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/indexes-expressional.html "PostgreSQL 18 - 11.7. Indexes on Expressions")
([18](/docs/18/indexes-expressional.html "PostgreSQL 18 - 11.7. Indexes on Expressions"))
/
[17](/docs/17/indexes-expressional.html "PostgreSQL 17 - 11.7. Indexes on Expressions")
/
[16](/docs/16/indexes-expressional.html "PostgreSQL 16 - 11.7. Indexes on Expressions")
/
[15](/docs/15/indexes-expressional.html "PostgreSQL 15 - 11.7. Indexes on Expressions")
/
[14](/docs/14/indexes-expressional.html "PostgreSQL 14 - 11.7. Indexes on Expressions")

Development Versions:
[19](/docs/19/indexes-expressional.html "PostgreSQL 19 - 11.7. Indexes on Expressions")
/
[devel](/docs/devel/indexes-expressional.html "PostgreSQL devel - 11.7. Indexes on Expressions")

Unsupported versions:
[13](/docs/13/indexes-expressional.html "PostgreSQL 13 - 11.7. Indexes on Expressions")
/
[12](/docs/12/indexes-expressional.html "PostgreSQL 12 - 11.7. Indexes on Expressions")
/
[11](/docs/11/indexes-expressional.html "PostgreSQL 11 - 11.7. Indexes on Expressions")
/
[10](/docs/10/indexes-expressional.html "PostgreSQL 10 - 11.7. Indexes on Expressions")
/
[9.6](/docs/9.6/indexes-expressional.html "PostgreSQL 9.6 - 11.7. Indexes on Expressions")
/
[9.5](/docs/9.5/indexes-expressional.html "PostgreSQL 9.5 - 11.7. Indexes on Expressions")
/
[9.4](/docs/9.4/indexes-expressional.html "PostgreSQL 9.4 - 11.7. Indexes on Expressions")
/
[9.3](/docs/9.3/indexes-expressional.html "PostgreSQL 9.3 - 11.7. Indexes on Expressions")
/
[9.2](/docs/9.2/indexes-expressional.html "PostgreSQL 9.2 - 11.7. Indexes on Expressions")
/
[9.1](/docs/9.1/indexes-expressional.html "PostgreSQL 9.1 - 11.7. Indexes on Expressions")
/
[9.0](/docs/9.0/indexes-expressional.html "PostgreSQL 9.0 - 11.7. Indexes on Expressions")
/
[8.4](/docs/8.4/indexes-expressional.html "PostgreSQL 8.4 - 11.7. Indexes on Expressions")
/
[8.3](/docs/8.3/indexes-expressional.html "PostgreSQL 8.3 - 11.7. Indexes on Expressions")
/
[8.2](/docs/8.2/indexes-expressional.html "PostgreSQL 8.2 - 11.7. Indexes on Expressions")
/
[8.1](/docs/8.1/indexes-expressional.html "PostgreSQL 8.1 - 11.7. Indexes on Expressions")
/
[8.0](/docs/8.0/indexes-expressional.html "PostgreSQL 8.0 - 11.7. Indexes on Expressions")
/
[7.4](/docs/7.4/indexes-expressional.html "PostgreSQL 7.4 - 11.7. Indexes on Expressions")

## 11.7. Indexes on Expressions [#](#INDEXES-EXPRESSIONAL)

An index column need not be just a column of the underlying table, but can be a function or scalar expression computed from one or more columns of the table. This feature is useful to obtain fast access to tables based on the results of computations.

For example, a common way to do case-insensitive comparisons is to use the `lower` function:

```
SELECT * FROM test1 WHERE lower(col1) = 'value';
```

This query can use an index if one has been defined on the result of the `lower(col1)` function:

```
CREATE INDEX test1_lower_col1_idx ON test1 (lower(col1));
```

If we were to declare this index `UNIQUE`, it would prevent creation of rows whose `col1` values differ only in case, as well as rows whose `col1` values are actually identical. Thus, indexes on expressions can be used to enforce constraints that are not definable as simple unique constraints.

As another example, if one often does queries like:

```
SELECT * FROM people WHERE (first_name || ' ' || last_name) = 'John Smith';
```

then it might be worth creating an index like this:

```
CREATE INDEX people_names ON people ((first_name || ' ' || last_name));
```

The syntax of the `CREATE INDEX` command normally requires writing parentheses around index expressions, as shown in the second example. The parentheses can be omitted when the expression is just a function call, as in the first example.

Index expressions are relatively expensive to maintain, because the derived expression(s) must be computed for each row insertion and [non-HOT update](storage-hot.html "66.7. Heap-Only Tuples (HOT)"). However, the index expressions are *not* recomputed during an indexed search, since they are already stored in the index. In both examples above, the system sees the query as just `WHERE indexedcolumn = 'constant'` and so the speed of the search is equivalent to any other simple index query. Thus, indexes on expressions are useful when retrieval speed is more important than insertion and update speed.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/indexes-expressional.html/)
to report a documentation issue.
