# PostgreSQL: Documentation: 18: Chapter 34. ECPG — Embedded SQL in C

Source: https://www.postgresql.org/docs/current/ecpg.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/ecpg.html "PostgreSQL 18 - Chapter 34. ECPG — Embedded SQL in C")
([18](/docs/18/ecpg.html "PostgreSQL 18 - Chapter 34. ECPG — Embedded SQL in C"))
/
[17](/docs/17/ecpg.html "PostgreSQL 17 - Chapter 34. ECPG — Embedded SQL in C")
/
[16](/docs/16/ecpg.html "PostgreSQL 16 - Chapter 34. ECPG — Embedded SQL in C")
/
[15](/docs/15/ecpg.html "PostgreSQL 15 - Chapter 34. ECPG — Embedded SQL in C")
/
[14](/docs/14/ecpg.html "PostgreSQL 14 - Chapter 34. ECPG — Embedded SQL in C")

Development Versions:
[19](/docs/19/ecpg.html "PostgreSQL 19 - Chapter 34. ECPG — Embedded SQL in C")
/
[devel](/docs/devel/ecpg.html "PostgreSQL devel - Chapter 34. ECPG — Embedded SQL in C")

Unsupported versions:
[13](/docs/13/ecpg.html "PostgreSQL 13 - Chapter 34. ECPG — Embedded SQL in C")
/
[12](/docs/12/ecpg.html "PostgreSQL 12 - Chapter 34. ECPG — Embedded SQL in C")
/
[11](/docs/11/ecpg.html "PostgreSQL 11 - Chapter 34. ECPG — Embedded SQL in C")
/
[10](/docs/10/ecpg.html "PostgreSQL 10 - Chapter 34. ECPG — Embedded SQL in C")
/
[9.6](/docs/9.6/ecpg.html "PostgreSQL 9.6 - Chapter 34. ECPG — Embedded SQL in C")
/
[9.5](/docs/9.5/ecpg.html "PostgreSQL 9.5 - Chapter 34. ECPG — Embedded SQL in C")
/
[9.4](/docs/9.4/ecpg.html "PostgreSQL 9.4 - Chapter 34. ECPG — Embedded SQL in C")
/
[9.3](/docs/9.3/ecpg.html "PostgreSQL 9.3 - Chapter 34. ECPG — Embedded SQL in C")
/
[9.2](/docs/9.2/ecpg.html "PostgreSQL 9.2 - Chapter 34. ECPG — Embedded SQL in C")
/
[9.1](/docs/9.1/ecpg.html "PostgreSQL 9.1 - Chapter 34. ECPG — Embedded SQL in C")
/
[9.0](/docs/9.0/ecpg.html "PostgreSQL 9.0 - Chapter 34. ECPG — Embedded SQL in C")
/
[8.4](/docs/8.4/ecpg.html "PostgreSQL 8.4 - Chapter 34. ECPG — Embedded SQL in C")
/
[8.3](/docs/8.3/ecpg.html "PostgreSQL 8.3 - Chapter 34. ECPG — Embedded SQL in C")
/
[8.2](/docs/8.2/ecpg.html "PostgreSQL 8.2 - Chapter 34. ECPG — Embedded SQL in C")
/
[8.1](/docs/8.1/ecpg.html "PostgreSQL 8.1 - Chapter 34. ECPG — Embedded SQL in C")
/
[8.0](/docs/8.0/ecpg.html "PostgreSQL 8.0 - Chapter 34. ECPG — Embedded SQL in C")
/
[7.4](/docs/7.4/ecpg.html "PostgreSQL 7.4 - Chapter 34. ECPG — Embedded SQL in C")
/
[7.3](/docs/7.3/ecpg.html "PostgreSQL 7.3 - Chapter 34. ECPG — Embedded SQL in C")
/
[7.2](/docs/7.2/ecpg.html "PostgreSQL 7.2 - Chapter 34. ECPG — Embedded SQL in C")
/
[7.1](/docs/7.1/ecpg.html "PostgreSQL 7.1 - Chapter 34. ECPG — Embedded SQL in C")

## Chapter 34. ECPG — Embedded SQL in C

**Table of Contents**

[34.1. The Concept](ecpg-concept.html)

[34.2. Managing Database Connections](ecpg-connect.html)
:   [34.2.1. Connecting to the Database Server](ecpg-connect.html#ECPG-CONNECTING)

    [34.2.2. Choosing a Connection](ecpg-connect.html#ECPG-SET-CONNECTION)

    [34.2.3. Closing a Connection](ecpg-connect.html#ECPG-DISCONNECT)

[34.3. Running SQL Commands](ecpg-commands.html)
:   [34.3.1. Executing SQL Statements](ecpg-commands.html#ECPG-EXECUTING)

    [34.3.2. Using Cursors](ecpg-commands.html#ECPG-CURSORS)

    [34.3.3. Managing Transactions](ecpg-commands.html#ECPG-TRANSACTIONS)

    [34.3.4. Prepared Statements](ecpg-commands.html#ECPG-PREPARED)

[34.4. Using Host Variables](ecpg-variables.html)
:   [34.4.1. Overview](ecpg-variables.html#ECPG-VARIABLES-OVERVIEW)

    [34.4.2. Declare Sections](ecpg-variables.html#ECPG-DECLARE-SECTIONS)

    [34.4.3. Retrieving Query Results](ecpg-variables.html#ECPG-RETRIEVING)

    [34.4.4. Type Mapping](ecpg-variables.html#ECPG-VARIABLES-TYPE-MAPPING)

    [34.4.5. Handling Nonprimitive SQL Data Types](ecpg-variables.html#ECPG-VARIABLES-NONPRIMITIVE-SQL)

    [34.4.6. Indicators](ecpg-variables.html#ECPG-INDICATORS)

[34.5. Dynamic SQL](ecpg-dynamic.html)
:   [34.5.1. Executing Statements without a Result Set](ecpg-dynamic.html#ECPG-DYNAMIC-WITHOUT-RESULT)

    [34.5.2. Executing a Statement with Input Parameters](ecpg-dynamic.html#ECPG-DYNAMIC-INPUT)

    [34.5.3. Executing a Statement with a Result Set](ecpg-dynamic.html#ECPG-DYNAMIC-WITH-RESULT)

[34.6. pgtypes Library](ecpg-pgtypes.html)
:   [34.6.1. Character Strings](ecpg-pgtypes.html#ECPG-PGTYPES-CSTRINGS)

    [34.6.2. The numeric Type](ecpg-pgtypes.html#ECPG-PGTYPES-NUMERIC)

    [34.6.3. The date Type](ecpg-pgtypes.html#ECPG-PGTYPES-DATE)

    [34.6.4. The timestamp Type](ecpg-pgtypes.html#ECPG-PGTYPES-TIMESTAMP)

    [34.6.5. The interval Type](ecpg-pgtypes.html#ECPG-PGTYPES-INTERVAL)

    [34.6.6. The decimal Type](ecpg-pgtypes.html#ECPG-PGTYPES-DECIMAL)

    [34.6.7. errno Values of pgtypeslib](ecpg-pgtypes.html#ECPG-PGTYPES-ERRNO)

    [34.6.8. Special Constants of pgtypeslib](ecpg-pgtypes.html#ECPG-PGTYPES-CONSTANTS)

[34.7. Using Descriptor Areas](ecpg-descriptors.html)
:   [34.7.1. Named SQL Descriptor Areas](ecpg-descriptors.html#ECPG-NAMED-DESCRIPTORS)

    [34.7.2. SQLDA Descriptor Areas](ecpg-descriptors.html#ECPG-SQLDA-DESCRIPTORS)

[34.8. Error Handling](ecpg-errors.html)
:   [34.8.1. Setting Callbacks](ecpg-errors.html#ECPG-WHENEVER)

    [34.8.2. sqlca](ecpg-errors.html#ECPG-SQLCA)

    [34.8.3. `SQLSTATE` vs. `SQLCODE`](ecpg-errors.html#ECPG-SQLSTATE-SQLCODE)

[34.9. Preprocessor Directives](ecpg-preproc.html)
:   [34.9.1. Including Files](ecpg-preproc.html#ECPG-INCLUDE)

    [34.9.2. The define and undef Directives](ecpg-preproc.html#ECPG-DEFINE)

    [34.9.3. ifdef, ifndef, elif, else, and endif Directives](ecpg-preproc.html#ECPG-IFDEF)

[34.10. Processing Embedded SQL Programs](ecpg-process.html)

[34.11. Library Functions](ecpg-library.html)

[34.12. Large Objects](ecpg-lo.html)

[34.13. C++ Applications](ecpg-cpp.html)
:   [34.13.1. Scope for Host Variables](ecpg-cpp.html#ECPG-CPP-SCOPE)

    [34.13.2. C++ Application Development with External C Module](ecpg-cpp.html#ECPG-CPP-AND-C)

[34.14. Embedded SQL Commands](ecpg-sql-commands.html)
:   [ALLOCATE DESCRIPTOR](ecpg-sql-allocate-descriptor.html) — allocate an SQL descriptor area

    [CONNECT](ecpg-sql-connect.html) — establish a database connection

    [DEALLOCATE DESCRIPTOR](ecpg-sql-deallocate-descriptor.html) — deallocate an SQL descriptor area

    [DECLARE](ecpg-sql-declare.html) — define a cursor

    [DECLARE STATEMENT](ecpg-sql-declare-statement.html) — declare SQL statement identifier

    [DESCRIBE](ecpg-sql-describe.html) — obtain information about a prepared statement or result set

    [DISCONNECT](ecpg-sql-disconnect.html) — terminate a database connection

    [EXECUTE IMMEDIATE](ecpg-sql-execute-immediate.html) — dynamically prepare and execute a statement

    [GET DESCRIPTOR](ecpg-sql-get-descriptor.html) — get information from an SQL descriptor area

    [OPEN](ecpg-sql-open.html) — open a dynamic cursor

    [PREPARE](ecpg-sql-prepare.html) — prepare a statement for execution

    [SET AUTOCOMMIT](ecpg-sql-set-autocommit.html) — set the autocommit behavior of the current session

    [SET CONNECTION](ecpg-sql-set-connection.html) — select a database connection

    [SET DESCRIPTOR](ecpg-sql-set-descriptor.html) — set information in an SQL descriptor area

    [TYPE](ecpg-sql-type.html) — define a new data type

    [VAR](ecpg-sql-var.html) — define a variable

    [WHENEVER](ecpg-sql-whenever.html) — specify the action to be taken when an SQL statement causes a specific class condition to be raised

[34.15. Informix Compatibility Mode](ecpg-informix-compat.html)
:   [34.15.1. Additional Types](ecpg-informix-compat.html#ECPG-INFORMIX-TYPES)

    [34.15.2. Additional/Missing Embedded SQL Statements](ecpg-informix-compat.html#ECPG-INFORMIX-STATEMENTS)

    [34.15.3. Informix-compatible SQLDA Descriptor Areas](ecpg-informix-compat.html#ECPG-INFORMIX-SQLDA)

    [34.15.4. Additional Functions](ecpg-informix-compat.html#ECPG-INFORMIX-FUNCTIONS)

    [34.15.5. Additional Constants](ecpg-informix-compat.html#ECPG-INFORMIX-CONSTANTS)

[34.16. Oracle Compatibility Mode](ecpg-oracle-compat.html)

[34.17. Internals](ecpg-develop.html)

This chapter describes the embedded SQL package for PostgreSQL. It was written by Linus Tolke (`<linus@epact.se>`) and Michael Meskes (`<meskes@postgresql.org>`). Originally it was written to work with C. It also works with C++, but it does not recognize all C++ constructs yet.

This documentation is quite incomplete. But since this interface is standardized, additional information can be found in many resources about SQL.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/ecpg.html/)
to report a documentation issue.
