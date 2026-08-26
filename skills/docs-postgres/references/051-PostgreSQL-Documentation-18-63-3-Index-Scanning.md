# PostgreSQL: Documentation: 18: 63.3. Index Scanning

Source: https://www.postgresql.org/docs/current/index-scanning.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/index-scanning.html "PostgreSQL 18 - 63.3. Index Scanning")
([18](/docs/18/index-scanning.html "PostgreSQL 18 - 63.3. Index Scanning"))
/
[17](/docs/17/index-scanning.html "PostgreSQL 17 - 63.3. Index Scanning")
/
[16](/docs/16/index-scanning.html "PostgreSQL 16 - 63.3. Index Scanning")
/
[15](/docs/15/index-scanning.html "PostgreSQL 15 - 63.3. Index Scanning")
/
[14](/docs/14/index-scanning.html "PostgreSQL 14 - 63.3. Index Scanning")

Development Versions:
[19](/docs/19/index-scanning.html "PostgreSQL 19 - 63.3. Index Scanning")
/
[devel](/docs/devel/index-scanning.html "PostgreSQL devel - 63.3. Index Scanning")

Unsupported versions:
[13](/docs/13/index-scanning.html "PostgreSQL 13 - 63.3. Index Scanning")
/
[12](/docs/12/index-scanning.html "PostgreSQL 12 - 63.3. Index Scanning")
/
[11](/docs/11/index-scanning.html "PostgreSQL 11 - 63.3. Index Scanning")
/
[10](/docs/10/index-scanning.html "PostgreSQL 10 - 63.3. Index Scanning")
/
[9.6](/docs/9.6/index-scanning.html "PostgreSQL 9.6 - 63.3. Index Scanning")
/
[9.5](/docs/9.5/index-scanning.html "PostgreSQL 9.5 - 63.3. Index Scanning")
/
[9.4](/docs/9.4/index-scanning.html "PostgreSQL 9.4 - 63.3. Index Scanning")
/
[9.3](/docs/9.3/index-scanning.html "PostgreSQL 9.3 - 63.3. Index Scanning")
/
[9.2](/docs/9.2/index-scanning.html "PostgreSQL 9.2 - 63.3. Index Scanning")
/
[9.1](/docs/9.1/index-scanning.html "PostgreSQL 9.1 - 63.3. Index Scanning")
/
[9.0](/docs/9.0/index-scanning.html "PostgreSQL 9.0 - 63.3. Index Scanning")
/
[8.4](/docs/8.4/index-scanning.html "PostgreSQL 8.4 - 63.3. Index Scanning")
/
[8.3](/docs/8.3/index-scanning.html "PostgreSQL 8.3 - 63.3. Index Scanning")
/
[8.2](/docs/8.2/index-scanning.html "PostgreSQL 8.2 - 63.3. Index Scanning")
/
[8.1](/docs/8.1/index-scanning.html "PostgreSQL 8.1 - 63.3. Index Scanning")

## 63.3. Index Scanning [#](#INDEX-SCANNING)

In an index scan, the index access method is responsible for regurgitating the TIDs of all the tuples it has been told about that match the *scan keys*. The access method is *not* involved in actually fetching those tuples from the index's parent table, nor in determining whether they pass the scan's visibility test or other conditions.

A scan key is the internal representation of a `WHERE` clause of the form *`index_key`* *`operator`* *`constant`*, where the index key is one of the columns of the index and the operator is one of the members of the operator family associated with that index column. An index scan has zero or more scan keys, which are implicitly ANDed — the returned tuples are expected to satisfy all the indicated conditions.

The access method can report that the index is *lossy*, or requires rechecks, for a particular query. This implies that the index scan will return all the entries that pass the scan key, plus possibly additional entries that do not. The core system's index-scan machinery will then apply the index conditions again to the heap tuple to verify whether or not it really should be selected. If the recheck option is not specified, the index scan must return exactly the set of matching entries.

Note that it is entirely up to the access method to ensure that it correctly finds all and only the entries passing all the given scan keys. Also, the core system will simply hand off all the `WHERE` clauses that match the index keys and operator families, without any semantic analysis to determine whether they are redundant or contradictory. As an example, given `WHERE x > 4 AND x > 14` where `x` is a b-tree indexed column, it is left to the b-tree `amrescan` function to realize that the first scan key is redundant and can be discarded. The extent of preprocessing needed during `amrescan` will depend on the extent to which the index access method needs to reduce the scan keys to a “normalized” form.

Some access methods return index entries in a well-defined order, others do not. There are actually two different ways that an access method can support sorted output:

- Access methods that always return entries in the natural ordering of their data (such as btree) should set `amcanorder` to true. Currently, such access methods must use btree-compatible strategy numbers for their equality and ordering operators.
- Access methods that support ordering operators should set `amcanorderbyop` to true. This indicates that the index is capable of returning entries in an order satisfying `ORDER BY` *`index_key`* *`operator`* *`constant`*. Scan modifiers of that form can be passed to `amrescan` as described previously.

The `amgettuple` function has a `direction` argument, which can be either `ForwardScanDirection` (the normal case) or `BackwardScanDirection`. If the first call after `amrescan` specifies `BackwardScanDirection`, then the set of matching index entries is to be scanned back-to-front rather than in the normal front-to-back direction, so `amgettuple` must return the last matching tuple in the index, rather than the first one as it normally would. (This will only occur for access methods that set `amcanorder` to true.) After the first call, `amgettuple` must be prepared to advance the scan in either direction from the most recently returned entry. (But if `amcanbackward` is false, all subsequent calls will have the same direction as the first one.)

Access methods that support ordered scans must support “marking” a position in a scan and later returning to the marked position. The same position might be restored multiple times. However, only one position need be remembered per scan; a new `ammarkpos` call overrides the previously marked position. An access method that does not support ordered scans need not provide `ammarkpos` and `amrestrpos` functions in `IndexAmRoutine`; set those pointers to NULL instead.

Both the scan position and the mark position (if any) must be maintained consistently in the face of concurrent insertions or deletions in the index. It is OK if a freshly-inserted entry is not returned by a scan that would have found the entry if it had existed when the scan started, or for the scan to return such an entry upon rescanning or backing up even though it had not been returned the first time through. Similarly, a concurrent delete might or might not be reflected in the results of a scan. What is important is that insertions or deletions not cause the scan to miss or multiply return entries that were not themselves being inserted or deleted.

If the index stores the original indexed data values (and not some lossy representation of them), it is useful to support [index-only scans](indexes-index-only-scans.html "11.9. Index-Only Scans and Covering Indexes"), in which the index returns the actual data not just the TID of the heap tuple. This will only avoid I/O if the visibility map shows that the TID is on an all-visible page; else the heap tuple must be visited anyway to check MVCC visibility. But that is no concern of the access method's.

Instead of using `amgettuple`, an index scan can be done with `amgetbitmap` to fetch all tuples in one call. This can be noticeably more efficient than `amgettuple` because it allows avoiding lock/unlock cycles within the access method. In principle `amgetbitmap` should have the same effects as repeated `amgettuple` calls, but we impose several restrictions to simplify matters. First of all, `amgetbitmap` returns all tuples at once and marking or restoring scan positions isn't supported. Secondly, the tuples are returned in a bitmap which doesn't have any specific ordering, which is why `amgetbitmap` doesn't take a `direction` argument. (Ordering operators will never be supplied for such a scan, either.) Also, there is no provision for index-only scans with `amgetbitmap`, since there is no way to return the contents of index tuples. Finally, `amgetbitmap` does not guarantee any locking of the returned tuples, with implications spelled out in [Section 63.4](index-locking.html "63.4. Index Locking Considerations").

Note that it is permitted for an access method to implement only `amgetbitmap` and not `amgettuple`, or vice versa, if its internal implementation is unsuited to one API or the other.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/index-scanning.html/)
to report a documentation issue.
