# PostgreSQL: Documentation: 18: 29.9. Architecture

Source: https://www.postgresql.org/docs/current/logical-replication-architecture.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/logical-replication-architecture.html "PostgreSQL 18 - 29.9. Architecture")
([18](/docs/18/logical-replication-architecture.html "PostgreSQL 18 - 29.9. Architecture"))
/
[17](/docs/17/logical-replication-architecture.html "PostgreSQL 17 - 29.9. Architecture")
/
[16](/docs/16/logical-replication-architecture.html "PostgreSQL 16 - 29.9. Architecture")
/
[15](/docs/15/logical-replication-architecture.html "PostgreSQL 15 - 29.9. Architecture")
/
[14](/docs/14/logical-replication-architecture.html "PostgreSQL 14 - 29.9. Architecture")

Development Versions:
[19](/docs/19/logical-replication-architecture.html "PostgreSQL 19 - 29.9. Architecture")
/
[devel](/docs/devel/logical-replication-architecture.html "PostgreSQL devel - 29.9. Architecture")

Unsupported versions:
[13](/docs/13/logical-replication-architecture.html "PostgreSQL 13 - 29.9. Architecture")
/
[12](/docs/12/logical-replication-architecture.html "PostgreSQL 12 - 29.9. Architecture")
/
[11](/docs/11/logical-replication-architecture.html "PostgreSQL 11 - 29.9. Architecture")
/
[10](/docs/10/logical-replication-architecture.html "PostgreSQL 10 - 29.9. Architecture")

## 29.9. Architecture [#](#LOGICAL-REPLICATION-ARCHITECTURE)

[29.9.1. Initial Snapshot](logical-replication-architecture.html#LOGICAL-REPLICATION-SNAPSHOT)

Logical replication is built with an architecture similar to physical streaming replication (see [Section 26.2.5](warm-standby.html#STREAMING-REPLICATION "26.2.5. Streaming Replication")). It is implemented by `walsender` and `apply` processes. The walsender process starts logical decoding (described in [Chapter 47](logicaldecoding.html "Chapter 47. Logical Decoding")) of the WAL and loads the standard logical decoding output plugin (`pgoutput`). The plugin transforms the changes read from WAL to the logical replication protocol (see [Section 54.5](protocol-logical-replication.html "54.5. Logical Streaming Replication Protocol")) and filters the data according to the publication specification. The data is then continuously transferred using the streaming replication protocol to the apply worker, which maps the data to local tables and applies the individual changes as they are received, in correct transactional order.

The apply process on the subscriber database always runs with [`session_replication_role`](runtime-config-client.html#GUC-SESSION-REPLICATION-ROLE) set to `replica`. This means that, by default, triggers and rules will not fire on a subscriber. Users can optionally choose to enable triggers and rules on a table using the [`ALTER TABLE`](sql-altertable.html "ALTER TABLE") command and the `ENABLE TRIGGER` and `ENABLE RULE` clauses.

The logical replication apply process currently only fires row triggers, not statement triggers. The initial table synchronization, however, is implemented like a `COPY` command and thus fires both row and statement triggers for `INSERT`.

### 29.9.1. Initial Snapshot [#](#LOGICAL-REPLICATION-SNAPSHOT)

The initial data in existing subscribed tables is snapshotted and copied in parallel instances of a special kind of apply process. These special apply processes are dedicated table synchronization workers, spawned for each table to be synchronized. Each table synchronization process will create its own replication slot and copy the existing data. As soon as the copy is finished the table contents will become visible to other backends. Once existing data is copied, the worker enters synchronization mode, which ensures that the table is brought up to a synchronized state with the main apply process by streaming any changes that happened during the initial data copy using standard logical replication. During this synchronization phase, the changes are applied and committed in the same order as they happened on the publisher. Once synchronization is done, control of the replication of the table is given back to the main apply process where replication continues as normal.

### Note

The publication [`publish`](sql-createpublication.html#SQL-CREATEPUBLICATION-PARAMS-WITH-PUBLISH) parameter only affects what DML operations will be replicated. The initial data synchronization does not take this parameter into account when copying the existing table data.

### Note

If a table synchronization worker fails during copy, the apply worker detects the failure and respawns the table synchronization worker to continue the synchronization process. This behaviour ensures that transient errors do not permanently disrupt the replication setup. See also [`wal_retrieve_retry_interval`](runtime-config-replication.html#GUC-WAL-RETRIEVE-RETRY-INTERVAL).

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/logical-replication-architecture.html/)
to report a documentation issue.
