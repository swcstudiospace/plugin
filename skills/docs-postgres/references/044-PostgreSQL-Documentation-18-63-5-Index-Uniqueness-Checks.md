# PostgreSQL: Documentation: 18: 63.5. Index Uniqueness Checks

Source: https://www.postgresql.org/docs/current/index-unique-checks.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/index-unique-checks.html "PostgreSQL 18 - 63.5. Index Uniqueness Checks")
([18](/docs/18/index-unique-checks.html "PostgreSQL 18 - 63.5. Index Uniqueness Checks"))
/
[17](/docs/17/index-unique-checks.html "PostgreSQL 17 - 63.5. Index Uniqueness Checks")
/
[16](/docs/16/index-unique-checks.html "PostgreSQL 16 - 63.5. Index Uniqueness Checks")
/
[15](/docs/15/index-unique-checks.html "PostgreSQL 15 - 63.5. Index Uniqueness Checks")
/
[14](/docs/14/index-unique-checks.html "PostgreSQL 14 - 63.5. Index Uniqueness Checks")

Development Versions:
[19](/docs/19/index-unique-checks.html "PostgreSQL 19 - 63.5. Index Uniqueness Checks")
/
[devel](/docs/devel/index-unique-checks.html "PostgreSQL devel - 63.5. Index Uniqueness Checks")

Unsupported versions:
[13](/docs/13/index-unique-checks.html "PostgreSQL 13 - 63.5. Index Uniqueness Checks")
/
[12](/docs/12/index-unique-checks.html "PostgreSQL 12 - 63.5. Index Uniqueness Checks")
/
[11](/docs/11/index-unique-checks.html "PostgreSQL 11 - 63.5. Index Uniqueness Checks")
/
[10](/docs/10/index-unique-checks.html "PostgreSQL 10 - 63.5. Index Uniqueness Checks")
/
[9.6](/docs/9.6/index-unique-checks.html "PostgreSQL 9.6 - 63.5. Index Uniqueness Checks")
/
[9.5](/docs/9.5/index-unique-checks.html "PostgreSQL 9.5 - 63.5. Index Uniqueness Checks")
/
[9.4](/docs/9.4/index-unique-checks.html "PostgreSQL 9.4 - 63.5. Index Uniqueness Checks")
/
[9.3](/docs/9.3/index-unique-checks.html "PostgreSQL 9.3 - 63.5. Index Uniqueness Checks")
/
[9.2](/docs/9.2/index-unique-checks.html "PostgreSQL 9.2 - 63.5. Index Uniqueness Checks")
/
[9.1](/docs/9.1/index-unique-checks.html "PostgreSQL 9.1 - 63.5. Index Uniqueness Checks")
/
[9.0](/docs/9.0/index-unique-checks.html "PostgreSQL 9.0 - 63.5. Index Uniqueness Checks")
/
[8.4](/docs/8.4/index-unique-checks.html "PostgreSQL 8.4 - 63.5. Index Uniqueness Checks")
/
[8.3](/docs/8.3/index-unique-checks.html "PostgreSQL 8.3 - 63.5. Index Uniqueness Checks")
/
[8.2](/docs/8.2/index-unique-checks.html "PostgreSQL 8.2 - 63.5. Index Uniqueness Checks")
/
[8.1](/docs/8.1/index-unique-checks.html "PostgreSQL 8.1 - 63.5. Index Uniqueness Checks")

## 63.5. Index Uniqueness Checks [#](#INDEX-UNIQUE-CHECKS)

PostgreSQL enforces SQL uniqueness constraints using *unique indexes*, which are indexes that disallow multiple entries with identical keys. An access method that supports this feature sets `amcanunique` true. (At present, only b-tree supports it.) Columns listed in the `INCLUDE` clause are not considered when enforcing uniqueness.

Because of MVCC, it is always necessary to allow duplicate entries to exist physically in an index: the entries might refer to successive versions of a single logical row. The behavior we actually want to enforce is that no MVCC snapshot could include two rows with equal index keys. This breaks down into the following cases that must be checked when inserting a new row into a unique index:

- If a conflicting valid row has been deleted by the current transaction, it's okay. (In particular, since an UPDATE always deletes the old row version before inserting the new version, this will allow an UPDATE on a row without changing the key.)
- If a conflicting row has been inserted by an as-yet-uncommitted transaction, the would-be inserter must wait to see if that transaction commits. If it rolls back then there is no conflict. If it commits without deleting the conflicting row again, there is a uniqueness violation. (In practice we just wait for the other transaction to end and then redo the visibility check in toto.)
- Similarly, if a conflicting valid row has been deleted by an as-yet-uncommitted transaction, the would-be inserter must wait for that transaction to commit or abort, and then repeat the test.

Furthermore, immediately before reporting a uniqueness violation according to the above rules, the access method must recheck the liveness of the row being inserted. If it is committed dead then no violation should be reported. (This case cannot occur during the ordinary scenario of inserting a row that's just been created by the current transaction. It can happen during `CREATE UNIQUE INDEX CONCURRENTLY`, however.)

We require the index access method to apply these tests itself, which means that it must reach into the heap to check the commit status of any row that is shown to have a duplicate key according to the index contents. This is without a doubt ugly and non-modular, but it saves redundant work: if we did a separate probe then the index lookup for a conflicting row would be essentially repeated while finding the place to insert the new row's index entry. What's more, there is no obvious way to avoid race conditions unless the conflict check is an integral part of insertion of the new index entry.

If the unique constraint is deferrable, there is additional complexity: we need to be able to insert an index entry for a new row, but defer any uniqueness-violation error until end of statement or even later. To avoid unnecessary repeat searches of the index, the index access method should do a preliminary uniqueness check during the initial insertion. If this shows that there is definitely no conflicting live tuple, we are done. Otherwise, we schedule a recheck to occur when it is time to enforce the constraint. If, at the time of the recheck, both the inserted tuple and some other tuple with the same key are live, then the error must be reported. (Note that for this purpose, “live” actually means “any tuple in the index entry's HOT chain is live”.) To implement this, the `aminsert` function is passed a `checkUnique` parameter having one of the following values:

- `UNIQUE_CHECK_NO` indicates that no uniqueness checking should be done (this is not a unique index).
- `UNIQUE_CHECK_YES` indicates that this is a non-deferrable unique index, and the uniqueness check must be done immediately, as described above.
- `UNIQUE_CHECK_PARTIAL` indicates that the unique constraint is deferrable. PostgreSQL will use this mode to insert each row's index entry. The access method must allow duplicate entries into the index, and report any potential duplicates by returning false from `aminsert`. For each row for which false is returned, a deferred recheck will be scheduled.

  The access method must identify any rows which might violate the unique constraint, but it is not an error for it to report false positives. This allows the check to be done without waiting for other transactions to finish; conflicts reported here are not treated as errors and will be rechecked later, by which time they may no longer be conflicts.
- `UNIQUE_CHECK_EXISTING` indicates that this is a deferred recheck of a row that was reported as a potential uniqueness violation. Although this is implemented by calling `aminsert`, the access method must *not* insert a new index entry in this case. The index entry is already present. Rather, the access method must check to see if there is another live index entry. If so, and if the target row is also still live, report error.

  It is recommended that in a `UNIQUE_CHECK_EXISTING` call, the access method further verify that the target row actually does have an existing entry in the index, and report error if not. This is a good idea because the index tuple values passed to `aminsert` will have been recomputed. If the index definition involves functions that are not really immutable, we might be checking the wrong area of the index. Checking that the target row is found in the recheck verifies that we are scanning for the same tuple values as were used in the original insertion.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/index-unique-checks.html/)
to report a documentation issue.
