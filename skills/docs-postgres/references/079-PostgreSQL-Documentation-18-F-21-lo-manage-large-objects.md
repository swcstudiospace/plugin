# PostgreSQL: Documentation: 18: F.21. lo — manage large objects

Source: https://www.postgresql.org/docs/current/lo.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/lo.html "PostgreSQL 18 - F.21. lo — manage large objects")
([18](/docs/18/lo.html "PostgreSQL 18 - F.21. lo — manage large objects"))
/
[17](/docs/17/lo.html "PostgreSQL 17 - F.21. lo — manage large objects")
/
[16](/docs/16/lo.html "PostgreSQL 16 - F.21. lo — manage large objects")
/
[15](/docs/15/lo.html "PostgreSQL 15 - F.21. lo — manage large objects")
/
[14](/docs/14/lo.html "PostgreSQL 14 - F.21. lo — manage large objects")

Development Versions:
[19](/docs/19/lo.html "PostgreSQL 19 - F.21. lo — manage large objects")
/
[devel](/docs/devel/lo.html "PostgreSQL devel - F.21. lo — manage large objects")

Unsupported versions:
[13](/docs/13/lo.html "PostgreSQL 13 - F.21. lo — manage large objects")
/
[12](/docs/12/lo.html "PostgreSQL 12 - F.21. lo — manage large objects")
/
[11](/docs/11/lo.html "PostgreSQL 11 - F.21. lo — manage large objects")
/
[10](/docs/10/lo.html "PostgreSQL 10 - F.21. lo — manage large objects")
/
[9.6](/docs/9.6/lo.html "PostgreSQL 9.6 - F.21. lo — manage large objects")
/
[9.5](/docs/9.5/lo.html "PostgreSQL 9.5 - F.21. lo — manage large objects")
/
[9.4](/docs/9.4/lo.html "PostgreSQL 9.4 - F.21. lo — manage large objects")
/
[9.3](/docs/9.3/lo.html "PostgreSQL 9.3 - F.21. lo — manage large objects")
/
[9.2](/docs/9.2/lo.html "PostgreSQL 9.2 - F.21. lo — manage large objects")
/
[9.1](/docs/9.1/lo.html "PostgreSQL 9.1 - F.21. lo — manage large objects")
/
[9.0](/docs/9.0/lo.html "PostgreSQL 9.0 - F.21. lo — manage large objects")
/
[8.4](/docs/8.4/lo.html "PostgreSQL 8.4 - F.21. lo — manage large objects")
/
[8.3](/docs/8.3/lo.html "PostgreSQL 8.3 - F.21. lo — manage large objects")

## F.21. lo — manage large objects [#](#LO)

[F.21.1. Rationale](lo.html#LO-RATIONALE)

[F.21.2. How to Use It](lo.html#LO-HOW-TO-USE)

[F.21.3. Limitations](lo.html#LO-LIMITATIONS)

[F.21.4. Author](lo.html#LO-AUTHOR)

The `lo` module provides support for managing Large Objects (also called LOs or BLOBs). This includes a data type `lo` and a trigger `lo_manage`.

This module is considered “trusted”, that is, it can be installed by non-superusers who have `CREATE` privilege on the current database.

### F.21.1. Rationale [#](#LO-RATIONALE)

One of the problems with the JDBC driver (and this affects the ODBC driver also), is that the specification assumes that references to BLOBs (Binary Large OBjects) are stored within a table, and if that entry is changed, the associated BLOB is deleted from the database.

As PostgreSQL stands, this doesn't occur. Large objects are treated as objects in their own right; a table entry can reference a large object by OID, but there can be multiple table entries referencing the same large object OID, so the system doesn't delete the large object just because you change or remove one such entry.

Now this is fine for PostgreSQL-specific applications, but standard code using JDBC or ODBC won't delete the objects, resulting in orphan objects — objects that are not referenced by anything, and simply occupy disk space.

The `lo` module allows fixing this by attaching a trigger to tables that contain LO reference columns. The trigger essentially just does a `lo_unlink` whenever you delete or modify a value referencing a large object. When you use this trigger, you are assuming that there is only one database reference to any large object that is referenced in a trigger-controlled column!

The module also provides a data type `lo`, which is really just a [domain](glossary.html#GLOSSARY-DOMAIN "Domain") over the `oid` type. This is useful for differentiating database columns that hold large object references from those that are OIDs of other things. You don't have to use the `lo` type to use the trigger, but it may be convenient to use it to keep track of which columns in your database represent large objects that you are managing with the trigger. It is also rumored that the ODBC driver gets confused if you don't use `lo` for BLOB columns.

### F.21.2. How to Use It [#](#LO-HOW-TO-USE)

Here's a simple example of usage:

```
CREATE TABLE image (title text, raster lo);

CREATE TRIGGER t_raster BEFORE UPDATE OR DELETE ON image
    FOR EACH ROW EXECUTE FUNCTION lo_manage(raster);
```

For each column that will contain unique references to large objects, create a `BEFORE UPDATE OR DELETE` trigger, and give the column name as the sole trigger argument. You can also restrict the trigger to only execute on updates to the column by using `BEFORE UPDATE OF` *`column_name`*. If you need multiple `lo` columns in the same table, create a separate trigger for each one, remembering to give a different name to each trigger on the same table.

### F.21.3. Limitations [#](#LO-LIMITATIONS)

- Dropping a table will still orphan any objects it contains, as the trigger is not executed. You can avoid this by preceding the `DROP TABLE` with `DELETE FROM table`.

  `TRUNCATE` has the same hazard.

  If you already have, or suspect you have, orphaned large objects, see the [vacuumlo](vacuumlo.html "vacuumlo") module to help you clean them up. It's a good idea to run vacuumlo occasionally as a back-stop to the `lo_manage` trigger.
- Some frontends may create their own tables, and will not create the associated trigger(s). Also, users may not remember (or know) to create the triggers.

### F.21.4. Author [#](#LO-AUTHOR)

Peter Mount `<peter@retep.org.uk>`

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/lo.html/)
to report a documentation issue.
