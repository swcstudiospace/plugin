# PostgreSQL: Documentation: 18: Chapter 36. Extending SQL

Source: https://www.postgresql.org/docs/current/extend.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/extend.html "PostgreSQL 18 - Chapter 36. Extending SQL")
([18](/docs/18/extend.html "PostgreSQL 18 - Chapter 36. Extending SQL"))
/
[17](/docs/17/extend.html "PostgreSQL 17 - Chapter 36. Extending SQL")
/
[16](/docs/16/extend.html "PostgreSQL 16 - Chapter 36. Extending SQL")
/
[15](/docs/15/extend.html "PostgreSQL 15 - Chapter 36. Extending SQL")
/
[14](/docs/14/extend.html "PostgreSQL 14 - Chapter 36. Extending SQL")

Development Versions:
[19](/docs/19/extend.html "PostgreSQL 19 - Chapter 36. Extending SQL")
/
[devel](/docs/devel/extend.html "PostgreSQL devel - Chapter 36. Extending SQL")

Unsupported versions:
[13](/docs/13/extend.html "PostgreSQL 13 - Chapter 36. Extending SQL")
/
[12](/docs/12/extend.html "PostgreSQL 12 - Chapter 36. Extending SQL")
/
[11](/docs/11/extend.html "PostgreSQL 11 - Chapter 36. Extending SQL")
/
[10](/docs/10/extend.html "PostgreSQL 10 - Chapter 36. Extending SQL")
/
[9.6](/docs/9.6/extend.html "PostgreSQL 9.6 - Chapter 36. Extending SQL")
/
[9.5](/docs/9.5/extend.html "PostgreSQL 9.5 - Chapter 36. Extending SQL")
/
[9.4](/docs/9.4/extend.html "PostgreSQL 9.4 - Chapter 36. Extending SQL")
/
[9.3](/docs/9.3/extend.html "PostgreSQL 9.3 - Chapter 36. Extending SQL")
/
[9.2](/docs/9.2/extend.html "PostgreSQL 9.2 - Chapter 36. Extending SQL")
/
[9.1](/docs/9.1/extend.html "PostgreSQL 9.1 - Chapter 36. Extending SQL")
/
[9.0](/docs/9.0/extend.html "PostgreSQL 9.0 - Chapter 36. Extending SQL")
/
[8.4](/docs/8.4/extend.html "PostgreSQL 8.4 - Chapter 36. Extending SQL")
/
[8.3](/docs/8.3/extend.html "PostgreSQL 8.3 - Chapter 36. Extending SQL")
/
[8.2](/docs/8.2/extend.html "PostgreSQL 8.2 - Chapter 36. Extending SQL")
/
[8.1](/docs/8.1/extend.html "PostgreSQL 8.1 - Chapter 36. Extending SQL")
/
[8.0](/docs/8.0/extend.html "PostgreSQL 8.0 - Chapter 36. Extending SQL")
/
[7.4](/docs/7.4/extend.html "PostgreSQL 7.4 - Chapter 36. Extending SQL")
/
[7.3](/docs/7.3/extend.html "PostgreSQL 7.3 - Chapter 36. Extending SQL")
/
[7.2](/docs/7.2/extend.html "PostgreSQL 7.2 - Chapter 36. Extending SQL")
/
[7.1](/docs/7.1/extend.html "PostgreSQL 7.1 - Chapter 36. Extending SQL")

## Chapter 36. Extending SQL

**Table of Contents**

[36.1. How Extensibility Works](extend-how.html)

[36.2. The PostgreSQL Type System](extend-type-system.html)
:   [36.2.1. Base Types](extend-type-system.html#EXTEND-TYPE-SYSTEM-BASE)

    [36.2.2. Container Types](extend-type-system.html#EXTEND-TYPE-SYSTEM-CONTAINER)

    [36.2.3. Domains](extend-type-system.html#EXTEND-TYPE-SYSTEM-DOMAINS)

    [36.2.4. Pseudo-Types](extend-type-system.html#EXTEND-TYPE-SYSTEM-PSEUDO)

    [36.2.5. Polymorphic Types](extend-type-system.html#EXTEND-TYPES-POLYMORPHIC)

[36.3. User-Defined Functions](xfunc.html)

[36.4. User-Defined Procedures](xproc.html)

[36.5. Query Language (SQL) Functions](xfunc-sql.html)
:   [36.5.1. Arguments for SQL Functions](xfunc-sql.html#XFUNC-SQL-FUNCTION-ARGUMENTS)

    [36.5.2. SQL Functions on Base Types](xfunc-sql.html#XFUNC-SQL-BASE-FUNCTIONS)

    [36.5.3. SQL Functions on Composite Types](xfunc-sql.html#XFUNC-SQL-COMPOSITE-FUNCTIONS)

    [36.5.4. SQL Functions with Output Parameters](xfunc-sql.html#XFUNC-OUTPUT-PARAMETERS)

    [36.5.5. SQL Procedures with Output Parameters](xfunc-sql.html#XFUNC-OUTPUT-PARAMETERS-PROC)

    [36.5.6. SQL Functions with Variable Numbers of Arguments](xfunc-sql.html#XFUNC-SQL-VARIADIC-FUNCTIONS)

    [36.5.7. SQL Functions with Default Values for Arguments](xfunc-sql.html#XFUNC-SQL-PARAMETER-DEFAULTS)

    [36.5.8. SQL Functions as Table Sources](xfunc-sql.html#XFUNC-SQL-TABLE-FUNCTIONS)

    [36.5.9. SQL Functions Returning Sets](xfunc-sql.html#XFUNC-SQL-FUNCTIONS-RETURNING-SET)

    [36.5.10. SQL Functions Returning `TABLE`](xfunc-sql.html#XFUNC-SQL-FUNCTIONS-RETURNING-TABLE)

    [36.5.11. Polymorphic SQL Functions](xfunc-sql.html#XFUNC-SQL-POLYMORPHIC-FUNCTIONS)

    [36.5.12. SQL Functions with Collations](xfunc-sql.html#XFUNC-SQL-COLLATIONS)

[36.6. Function Overloading](xfunc-overload.html)

[36.7. Function Volatility Categories](xfunc-volatility.html)

[36.8. Procedural Language Functions](xfunc-pl.html)

[36.9. Internal Functions](xfunc-internal.html)

[36.10. C-Language Functions](xfunc-c.html)
:   [36.10.1. Dynamic Loading](xfunc-c.html#XFUNC-C-DYNLOAD)

    [36.10.2. Base Types in C-Language Functions](xfunc-c.html#XFUNC-C-BASETYPE)

    [36.10.3. Version 1 Calling Conventions](xfunc-c.html#XFUNC-C-V1-CALL-CONV)

    [36.10.4. Writing Code](xfunc-c.html#XFUNC-C-CODE)

    [36.10.5. Compiling and Linking Dynamically-Loaded Functions](xfunc-c.html#DFUNC)

    [36.10.6. Server API and ABI Stability Guidance](xfunc-c.html#XFUNC-API-ABI-STABILITY-GUIDANCE)

    [36.10.7. Composite-Type Arguments](xfunc-c.html#XFUNC-C-COMPOSITE-TYPE-ARGS)

    [36.10.8. Returning Rows (Composite Types)](xfunc-c.html#XFUNC-C-RETURNING-ROWS)

    [36.10.9. Returning Sets](xfunc-c.html#XFUNC-C-RETURN-SET)

    [36.10.10. Polymorphic Arguments and Return Types](xfunc-c.html#XFUNC-C-POLYMORPHIC)

    [36.10.11. Shared Memory](xfunc-c.html#XFUNC-SHARED-ADDIN)

    [36.10.12. LWLocks](xfunc-c.html#XFUNC-ADDIN-LWLOCKS)

    [36.10.13. Custom Wait Events](xfunc-c.html#XFUNC-ADDIN-WAIT-EVENTS)

    [36.10.14. Injection Points](xfunc-c.html#XFUNC-ADDIN-INJECTION-POINTS)

    [36.10.15. Custom Cumulative Statistics](xfunc-c.html#XFUNC-ADDIN-CUSTOM-CUMULATIVE-STATISTICS)

    [36.10.16. Using C++ for Extensibility](xfunc-c.html#EXTEND-CPP)

[36.11. Function Optimization Information](xfunc-optimization.html)

[36.12. User-Defined Aggregates](xaggr.html)
:   [36.12.1. Moving-Aggregate Mode](xaggr.html#XAGGR-MOVING-AGGREGATES)

    [36.12.2. Polymorphic and Variadic Aggregates](xaggr.html#XAGGR-POLYMORPHIC-AGGREGATES)

    [36.12.3. Ordered-Set Aggregates](xaggr.html#XAGGR-ORDERED-SET-AGGREGATES)

    [36.12.4. Partial Aggregation](xaggr.html#XAGGR-PARTIAL-AGGREGATES)

    [36.12.5. Support Functions for Aggregates](xaggr.html#XAGGR-SUPPORT-FUNCTIONS)

[36.13. User-Defined Types](xtypes.html)
:   [36.13.1. TOAST Considerations](xtypes.html#XTYPES-TOAST)

[36.14. User-Defined Operators](xoper.html)

[36.15. Operator Optimization Information](xoper-optimization.html)
:   [36.15.1. `COMMUTATOR`](xoper-optimization.html#XOPER-COMMUTATOR)

    [36.15.2. `NEGATOR`](xoper-optimization.html#XOPER-NEGATOR)

    [36.15.3. `RESTRICT`](xoper-optimization.html#XOPER-RESTRICT)

    [36.15.4. `JOIN`](xoper-optimization.html#XOPER-JOIN)

    [36.15.5. `HASHES`](xoper-optimization.html#XOPER-HASHES)

    [36.15.6. `MERGES`](xoper-optimization.html#XOPER-MERGES)

[36.16. Interfacing Extensions to Indexes](xindex.html)
:   [36.16.1. Index Methods and Operator Classes](xindex.html#XINDEX-OPCLASS)

    [36.16.2. Index Method Strategies](xindex.html#XINDEX-STRATEGIES)

    [36.16.3. Index Method Support Routines](xindex.html#XINDEX-SUPPORT)

    [36.16.4. An Example](xindex.html#XINDEX-EXAMPLE)

    [36.16.5. Operator Classes and Operator Families](xindex.html#XINDEX-OPFAMILY)

    [36.16.6. System Dependencies on Operator Classes](xindex.html#XINDEX-OPCLASS-DEPENDENCIES)

    [36.16.7. Ordering Operators](xindex.html#XINDEX-ORDERING-OPS)

    [36.16.8. Special Features of Operator Classes](xindex.html#XINDEX-OPCLASS-FEATURES)

[36.17. Packaging Related Objects into an Extension](extend-extensions.html)
:   [36.17.1. Extension Files](extend-extensions.html#EXTEND-EXTENSIONS-FILES)

    [36.17.2. Extension Relocatability](extend-extensions.html#EXTEND-EXTENSIONS-RELOCATION)

    [36.17.3. Extension Configuration Tables](extend-extensions.html#EXTEND-EXTENSIONS-CONFIG-TABLES)

    [36.17.4. Extension Updates](extend-extensions.html#EXTEND-EXTENSIONS-UPDATES)

    [36.17.5. Installing Extensions Using Update Scripts](extend-extensions.html#EXTEND-EXTENSIONS-UPDATE-SCRIPTS)

    [36.17.6. Security Considerations for Extensions](extend-extensions.html#EXTEND-EXTENSIONS-SECURITY)

    [36.17.7. Extension Example](extend-extensions.html#EXTEND-EXTENSIONS-EXAMPLE)

[36.18. Extension Building Infrastructure](extend-pgxs.html)

In the sections that follow, we will discuss how you can extend the PostgreSQL SQL query language by adding:

- functions (starting in [Section 36.3](xfunc.html "36.3. User-Defined Functions"))
- aggregates (starting in [Section 36.12](xaggr.html "36.12. User-Defined Aggregates"))
- data types (starting in [Section 36.13](xtypes.html "36.13. User-Defined Types"))
- operators (starting in [Section 36.14](xoper.html "36.14. User-Defined Operators"))
- operator classes for indexes (starting in [Section 36.16](xindex.html "36.16. Interfacing Extensions to Indexes"))
- packages of related objects (starting in [Section 36.17](extend-extensions.html "36.17. Packaging Related Objects into an Extension"))

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/extend.html/)
to report a documentation issue.
