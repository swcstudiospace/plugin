# PostgreSQL: Documentation: 18: 34.5. Dynamic SQL

Source: https://www.postgresql.org/docs/current/ecpg-dynamic.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/ecpg-dynamic.html "PostgreSQL 18 - 34.5. Dynamic SQL")
([18](/docs/18/ecpg-dynamic.html "PostgreSQL 18 - 34.5. Dynamic SQL"))
/
[17](/docs/17/ecpg-dynamic.html "PostgreSQL 17 - 34.5. Dynamic SQL")
/
[16](/docs/16/ecpg-dynamic.html "PostgreSQL 16 - 34.5. Dynamic SQL")
/
[15](/docs/15/ecpg-dynamic.html "PostgreSQL 15 - 34.5. Dynamic SQL")
/
[14](/docs/14/ecpg-dynamic.html "PostgreSQL 14 - 34.5. Dynamic SQL")

Development Versions:
[19](/docs/19/ecpg-dynamic.html "PostgreSQL 19 - 34.5. Dynamic SQL")
/
[devel](/docs/devel/ecpg-dynamic.html "PostgreSQL devel - 34.5. Dynamic SQL")

Unsupported versions:
[13](/docs/13/ecpg-dynamic.html "PostgreSQL 13 - 34.5. Dynamic SQL")
/
[12](/docs/12/ecpg-dynamic.html "PostgreSQL 12 - 34.5. Dynamic SQL")
/
[11](/docs/11/ecpg-dynamic.html "PostgreSQL 11 - 34.5. Dynamic SQL")
/
[10](/docs/10/ecpg-dynamic.html "PostgreSQL 10 - 34.5. Dynamic SQL")
/
[9.6](/docs/9.6/ecpg-dynamic.html "PostgreSQL 9.6 - 34.5. Dynamic SQL")
/
[9.5](/docs/9.5/ecpg-dynamic.html "PostgreSQL 9.5 - 34.5. Dynamic SQL")
/
[9.4](/docs/9.4/ecpg-dynamic.html "PostgreSQL 9.4 - 34.5. Dynamic SQL")
/
[9.3](/docs/9.3/ecpg-dynamic.html "PostgreSQL 9.3 - 34.5. Dynamic SQL")
/
[9.2](/docs/9.2/ecpg-dynamic.html "PostgreSQL 9.2 - 34.5. Dynamic SQL")
/
[9.1](/docs/9.1/ecpg-dynamic.html "PostgreSQL 9.1 - 34.5. Dynamic SQL")
/
[9.0](/docs/9.0/ecpg-dynamic.html "PostgreSQL 9.0 - 34.5. Dynamic SQL")
/
[8.4](/docs/8.4/ecpg-dynamic.html "PostgreSQL 8.4 - 34.5. Dynamic SQL")
/
[8.3](/docs/8.3/ecpg-dynamic.html "PostgreSQL 8.3 - 34.5. Dynamic SQL")
/
[8.2](/docs/8.2/ecpg-dynamic.html "PostgreSQL 8.2 - 34.5. Dynamic SQL")
/
[8.1](/docs/8.1/ecpg-dynamic.html "PostgreSQL 8.1 - 34.5. Dynamic SQL")
/
[8.0](/docs/8.0/ecpg-dynamic.html "PostgreSQL 8.0 - 34.5. Dynamic SQL")
/
[7.4](/docs/7.4/ecpg-dynamic.html "PostgreSQL 7.4 - 34.5. Dynamic SQL")

## 34.5. Dynamic SQL [#](#ECPG-DYNAMIC)

[34.5.1. Executing Statements without a Result Set](ecpg-dynamic.html#ECPG-DYNAMIC-WITHOUT-RESULT)

[34.5.2. Executing a Statement with Input Parameters](ecpg-dynamic.html#ECPG-DYNAMIC-INPUT)

[34.5.3. Executing a Statement with a Result Set](ecpg-dynamic.html#ECPG-DYNAMIC-WITH-RESULT)

In many cases, the particular SQL statements that an application has to execute are known at the time the application is written. In some cases, however, the SQL statements are composed at run time or provided by an external source. In these cases you cannot embed the SQL statements directly into the C source code, but there is a facility that allows you to call arbitrary SQL statements that you provide in a string variable.

### 34.5.1. Executing Statements without a Result Set [#](#ECPG-DYNAMIC-WITHOUT-RESULT)

The simplest way to execute an arbitrary SQL statement is to use the command `EXECUTE IMMEDIATE`. For example:

```
EXEC SQL BEGIN DECLARE SECTION;
const char *stmt = "CREATE TABLE test1 (...);";
EXEC SQL END DECLARE SECTION;

EXEC SQL EXECUTE IMMEDIATE :stmt;
```

`EXECUTE IMMEDIATE` can be used for SQL statements that do not return a result set (e.g., DDL, `INSERT`, `UPDATE`, `DELETE`). You cannot execute statements that retrieve data (e.g., `SELECT`) this way. The next section describes how to do that.

### 34.5.2. Executing a Statement with Input Parameters [#](#ECPG-DYNAMIC-INPUT)

A more powerful way to execute arbitrary SQL statements is to prepare them once and execute the prepared statement as often as you like. It is also possible to prepare a generalized version of a statement and then execute specific versions of it by substituting parameters. When preparing the statement, write question marks where you want to substitute parameters later. For example:

```
EXEC SQL BEGIN DECLARE SECTION;
const char *stmt = "INSERT INTO test1 VALUES(?, ?);";
EXEC SQL END DECLARE SECTION;

EXEC SQL PREPARE mystmt FROM :stmt;
 ...
EXEC SQL EXECUTE mystmt USING 42, 'foobar';
```

When you don't need the prepared statement anymore, you should deallocate it:

```
EXEC SQL DEALLOCATE PREPARE name;
```

### 34.5.3. Executing a Statement with a Result Set [#](#ECPG-DYNAMIC-WITH-RESULT)

To execute an SQL statement with a single result row, `EXECUTE` can be used. To save the result, add an `INTO` clause.

```
EXEC SQL BEGIN DECLARE SECTION;
const char *stmt = "SELECT a, b, c FROM test1 WHERE a > ?";
int v1, v2;
VARCHAR v3[50];
EXEC SQL END DECLARE SECTION;

EXEC SQL PREPARE mystmt FROM :stmt;
 ...
EXEC SQL EXECUTE mystmt INTO :v1, :v2, :v3 USING 37;
```

An `EXECUTE` command can have an `INTO` clause, a `USING` clause, both, or neither.

If a query is expected to return more than one result row, a cursor should be used, as in the following example. (See [Section 34.3.2](ecpg-commands.html#ECPG-CURSORS "34.3.2. Using Cursors") for more details about the cursor.)

```
EXEC SQL BEGIN DECLARE SECTION;
char dbaname[128];
char datname[128];
char *stmt = "SELECT u.usename as dbaname, d.datname "
             "  FROM pg_database d, pg_user u "
             "  WHERE d.datdba = u.usesysid";
EXEC SQL END DECLARE SECTION;

EXEC SQL CONNECT TO testdb AS con1 USER testuser;
EXEC SQL SELECT pg_catalog.set_config('search_path', '', false); EXEC SQL COMMIT;

EXEC SQL PREPARE stmt1 FROM :stmt;

EXEC SQL DECLARE cursor1 CURSOR FOR stmt1;
EXEC SQL OPEN cursor1;

EXEC SQL WHENEVER NOT FOUND DO BREAK;

while (1)
{
    EXEC SQL FETCH cursor1 INTO :dbaname,:datname;
    printf("dbaname=%s, datname=%s\n", dbaname, datname);
}

EXEC SQL CLOSE cursor1;

EXEC SQL COMMIT;
EXEC SQL DISCONNECT ALL;
```

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/ecpg-dynamic.html/)
to report a documentation issue.
