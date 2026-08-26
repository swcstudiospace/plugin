# PostgreSQL: Documentation: 18: 9.22. Window Functions

Source: https://www.postgresql.org/docs/current/functions-window.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/functions-window.html "PostgreSQL 18 - 9.22. Window Functions")
([18](/docs/18/functions-window.html "PostgreSQL 18 - 9.22. Window Functions"))
/
[17](/docs/17/functions-window.html "PostgreSQL 17 - 9.22. Window Functions")
/
[16](/docs/16/functions-window.html "PostgreSQL 16 - 9.22. Window Functions")
/
[15](/docs/15/functions-window.html "PostgreSQL 15 - 9.22. Window Functions")
/
[14](/docs/14/functions-window.html "PostgreSQL 14 - 9.22. Window Functions")

Development Versions:
[19](/docs/19/functions-window.html "PostgreSQL 19 - 9.22. Window Functions")
/
[devel](/docs/devel/functions-window.html "PostgreSQL devel - 9.22. Window Functions")

Unsupported versions:
[13](/docs/13/functions-window.html "PostgreSQL 13 - 9.22. Window Functions")
/
[12](/docs/12/functions-window.html "PostgreSQL 12 - 9.22. Window Functions")
/
[11](/docs/11/functions-window.html "PostgreSQL 11 - 9.22. Window Functions")
/
[10](/docs/10/functions-window.html "PostgreSQL 10 - 9.22. Window Functions")
/
[9.6](/docs/9.6/functions-window.html "PostgreSQL 9.6 - 9.22. Window Functions")
/
[9.5](/docs/9.5/functions-window.html "PostgreSQL 9.5 - 9.22. Window Functions")
/
[9.4](/docs/9.4/functions-window.html "PostgreSQL 9.4 - 9.22. Window Functions")
/
[9.3](/docs/9.3/functions-window.html "PostgreSQL 9.3 - 9.22. Window Functions")
/
[9.2](/docs/9.2/functions-window.html "PostgreSQL 9.2 - 9.22. Window Functions")
/
[9.1](/docs/9.1/functions-window.html "PostgreSQL 9.1 - 9.22. Window Functions")
/
[9.0](/docs/9.0/functions-window.html "PostgreSQL 9.0 - 9.22. Window Functions")
/
[8.4](/docs/8.4/functions-window.html "PostgreSQL 8.4 - 9.22. Window Functions")

## 9.22. Window Functions [#](#FUNCTIONS-WINDOW)

*Window functions* provide the ability to perform calculations across sets of rows that are related to the current query row. See [Section 3.5](tutorial-window.html "3.5. Window Functions") for an introduction to this feature, and [Section 4.2.8](sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS "4.2.8. Window Function Calls") for syntax details.

The built-in window functions are listed in [Table 9.67](functions-window.html#FUNCTIONS-WINDOW-TABLE "Table 9.67. General-Purpose Window Functions"). Note that these functions *must* be invoked using window function syntax, i.e., an `OVER` clause is required.

In addition to these functions, any built-in or user-defined ordinary aggregate (i.e., not ordered-set or hypothetical-set aggregates) can be used as a window function; see [Section 9.21](functions-aggregate.html "9.21. Aggregate Functions") for a list of the built-in aggregates. Aggregate functions act as window functions only when an `OVER` clause follows the call; otherwise they act as plain aggregates and return a single row for the entire set.

**Table 9.67. General-Purpose Window Functions**

| Function  Description |
| --- |
| `row_number` () → `bigint`  Returns the number of the current row within its partition, counting from 1. |
| `rank` () → `bigint`  Returns the rank of the current row, with gaps; that is, the `row_number` of the first row in its peer group. |
| `dense_rank` () → `bigint`  Returns the rank of the current row, without gaps; this function effectively counts peer groups. |
| `percent_rank` () → `double precision`  Returns the relative rank of the current row, that is (`rank` - 1) / (total partition rows - 1). The value thus ranges from 0 to 1 inclusive. |
| `cume_dist` () → `double precision`  Returns the cumulative distribution, that is (number of partition rows preceding or peers with current row) / (total partition rows). The value thus ranges from 1/*`N`* to 1. |
| `ntile` ( *`num_buckets`* `integer` ) → `integer`  Returns an integer ranging from 1 to the argument value, dividing the partition as equally as possible. |
| `lag` ( *`value`* `anycompatible` [, *`offset`* `integer` [, *`default`* `anycompatible` ]] ) → `anycompatible`  Returns *`value`* evaluated at the row that is *`offset`* rows before the current row within the partition; if there is no such row, instead returns *`default`* (which must be of a type compatible with *`value`*). Both *`offset`* and *`default`* are evaluated with respect to the current row. If omitted, *`offset`* defaults to 1 and *`default`* to `NULL`. |
| `lead` ( *`value`* `anycompatible` [, *`offset`* `integer` [, *`default`* `anycompatible` ]] ) → `anycompatible`  Returns *`value`* evaluated at the row that is *`offset`* rows after the current row within the partition; if there is no such row, instead returns *`default`* (which must be of a type compatible with *`value`*). Both *`offset`* and *`default`* are evaluated with respect to the current row. If omitted, *`offset`* defaults to 1 and *`default`* to `NULL`. |
| `first_value` ( *`value`* `anyelement` ) → `anyelement`  Returns *`value`* evaluated at the row that is the first row of the window frame. |
| `last_value` ( *`value`* `anyelement` ) → `anyelement`  Returns *`value`* evaluated at the row that is the last row of the window frame. |
| `nth_value` ( *`value`* `anyelement`, *`n`* `integer` ) → `anyelement`  Returns *`value`* evaluated at the row that is the *`n`*'th row of the window frame (counting from 1); returns `NULL` if there is no such row. |

All of the functions listed in [Table 9.67](functions-window.html#FUNCTIONS-WINDOW-TABLE "Table 9.67. General-Purpose Window Functions") depend on the sort ordering specified by the `ORDER BY` clause of the associated window definition. Rows that are not distinct when considering only the `ORDER BY` columns are said to be *peers*. The four ranking functions (including `cume_dist`) are defined so that they give the same answer for all rows of a peer group.

Note that `first_value`, `last_value`, and `nth_value` consider only the rows within the “window frame”, which by default contains the rows from the start of the partition through the last peer of the current row. This is likely to give unhelpful results for `last_value` and sometimes also `nth_value`. You can redefine the frame by adding a suitable frame specification (`RANGE`, `ROWS` or `GROUPS`) to the `OVER` clause. See [Section 4.2.8](sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS "4.2.8. Window Function Calls") for more information about frame specifications.

When an aggregate function is used as a window function, it aggregates over the rows within the current row's window frame. An aggregate used with `ORDER BY` and the default window frame definition produces a “running sum” type of behavior, which may or may not be what's wanted. To obtain aggregation over the whole partition, omit `ORDER BY` or use `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`. Other frame specifications can be used to obtain other effects.

### Note

The SQL standard defines a `RESPECT NULLS` or `IGNORE NULLS` option for `lead`, `lag`, `first_value`, `last_value`, and `nth_value`. This is not implemented in PostgreSQL: the behavior is always the same as the standard's default, namely `RESPECT NULLS`. Likewise, the standard's `FROM FIRST` or `FROM LAST` option for `nth_value` is not implemented: only the default `FROM FIRST` behavior is supported. (You can achieve the result of `FROM LAST` by reversing the `ORDER BY` ordering.)

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/functions-window.html/)
to report a documentation issue.
