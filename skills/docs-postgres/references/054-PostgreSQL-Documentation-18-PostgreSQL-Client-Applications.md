# PostgreSQL: Documentation: 18: PostgreSQL Client Applications

Source: https://www.postgresql.org/docs/current/reference-client.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/reference-client.html "PostgreSQL 18 - PostgreSQL Client Applications")
([18](/docs/18/reference-client.html "PostgreSQL 18 - PostgreSQL Client Applications"))
/
[17](/docs/17/reference-client.html "PostgreSQL 17 - PostgreSQL Client Applications")
/
[16](/docs/16/reference-client.html "PostgreSQL 16 - PostgreSQL Client Applications")
/
[15](/docs/15/reference-client.html "PostgreSQL 15 - PostgreSQL Client Applications")
/
[14](/docs/14/reference-client.html "PostgreSQL 14 - PostgreSQL Client Applications")

Development Versions:
[19](/docs/19/reference-client.html "PostgreSQL 19 - PostgreSQL Client Applications")
/
[devel](/docs/devel/reference-client.html "PostgreSQL devel - PostgreSQL Client Applications")

Unsupported versions:
[13](/docs/13/reference-client.html "PostgreSQL 13 - PostgreSQL Client Applications")
/
[12](/docs/12/reference-client.html "PostgreSQL 12 - PostgreSQL Client Applications")
/
[11](/docs/11/reference-client.html "PostgreSQL 11 - PostgreSQL Client Applications")
/
[10](/docs/10/reference-client.html "PostgreSQL 10 - PostgreSQL Client Applications")
/
[9.6](/docs/9.6/reference-client.html "PostgreSQL 9.6 - PostgreSQL Client Applications")
/
[9.5](/docs/9.5/reference-client.html "PostgreSQL 9.5 - PostgreSQL Client Applications")
/
[9.4](/docs/9.4/reference-client.html "PostgreSQL 9.4 - PostgreSQL Client Applications")
/
[9.3](/docs/9.3/reference-client.html "PostgreSQL 9.3 - PostgreSQL Client Applications")
/
[9.2](/docs/9.2/reference-client.html "PostgreSQL 9.2 - PostgreSQL Client Applications")
/
[9.1](/docs/9.1/reference-client.html "PostgreSQL 9.1 - PostgreSQL Client Applications")
/
[9.0](/docs/9.0/reference-client.html "PostgreSQL 9.0 - PostgreSQL Client Applications")
/
[8.4](/docs/8.4/reference-client.html "PostgreSQL 8.4 - PostgreSQL Client Applications")
/
[8.3](/docs/8.3/reference-client.html "PostgreSQL 8.3 - PostgreSQL Client Applications")
/
[8.2](/docs/8.2/reference-client.html "PostgreSQL 8.2 - PostgreSQL Client Applications")
/
[8.1](/docs/8.1/reference-client.html "PostgreSQL 8.1 - PostgreSQL Client Applications")
/
[8.0](/docs/8.0/reference-client.html "PostgreSQL 8.0 - PostgreSQL Client Applications")
/
[7.4](/docs/7.4/reference-client.html "PostgreSQL 7.4 - PostgreSQL Client Applications")
/
[7.3](/docs/7.3/reference-client.html "PostgreSQL 7.3 - PostgreSQL Client Applications")
/
[7.2](/docs/7.2/reference-client.html "PostgreSQL 7.2 - PostgreSQL Client Applications")
/
[7.1](/docs/7.1/reference-client.html "PostgreSQL 7.1 - PostgreSQL Client Applications")

# PostgreSQL Client Applications

---

This part contains reference information for PostgreSQL client applications and utilities. Not all of these commands are of general utility; some might require special privileges. The common feature of these applications is that they can be run on any host, independent of where the database server resides.

When specified on the command line, user and database names have their case preserved — the presence of spaces or special characters might require quoting. Table names and other identifiers do not have their case preserved, except where documented, and might require quoting.

**Table of Contents**

[clusterdb](app-clusterdb.html) — cluster a PostgreSQL database

[createdb](app-createdb.html) — create a new PostgreSQL database

[createuser](app-createuser.html) — define a new PostgreSQL user account

[dropdb](app-dropdb.html) — remove a PostgreSQL database

[dropuser](app-dropuser.html) — remove a PostgreSQL user account

[ecpg](app-ecpg.html) — embedded SQL C preprocessor

[pg\_amcheck](app-pgamcheck.html) — checks for corruption in one or more PostgreSQL databases

[pg\_basebackup](app-pgbasebackup.html) — take a base backup of a PostgreSQL cluster

[pgbench](pgbench.html) — run a benchmark test on PostgreSQL

[pg\_combinebackup](app-pgcombinebackup.html) — reconstruct a full backup from an incremental backup and dependent backups

[pg\_config](app-pgconfig.html) — retrieve information about the installed version of PostgreSQL

[pg\_dump](app-pgdump.html) — export a PostgreSQL database as an SQL script or to other formats

[pg\_dumpall](app-pg-dumpall.html) — extract a PostgreSQL database cluster into a script file

[pg\_isready](app-pg-isready.html) — check the connection status of a PostgreSQL server

[pg\_receivewal](app-pgreceivewal.html) — stream write-ahead logs from a PostgreSQL server

[pg\_recvlogical](app-pgrecvlogical.html) — control PostgreSQL logical decoding streams

[pg\_restore](app-pgrestore.html) — restore a PostgreSQL database from an archive file created by pg\_dump

[pg\_verifybackup](app-pgverifybackup.html) — verify the integrity of a base backup of a PostgreSQL cluster

[psql](app-psql.html) — PostgreSQL interactive terminal

[reindexdb](app-reindexdb.html) — reindex a PostgreSQL database

[vacuumdb](app-vacuumdb.html) — garbage-collect and analyze a PostgreSQL database

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/reference-client.html/)
to report a documentation issue.
