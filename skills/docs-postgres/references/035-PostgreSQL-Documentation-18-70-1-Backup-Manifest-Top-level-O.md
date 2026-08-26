# PostgreSQL: Documentation: 18: 70.1. Backup Manifest Top-level Object

Source: https://www.postgresql.org/docs/current/backup-manifest-toplevel.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/backup-manifest-toplevel.html "PostgreSQL 18 - 70.1. Backup Manifest Top-level Object")
([18](/docs/18/backup-manifest-toplevel.html "PostgreSQL 18 - 70.1. Backup Manifest Top-level Object"))
/
[17](/docs/17/backup-manifest-toplevel.html "PostgreSQL 17 - 70.1. Backup Manifest Top-level Object")
/
[16](/docs/16/backup-manifest-toplevel.html "PostgreSQL 16 - 70.1. Backup Manifest Top-level Object")
/
[15](/docs/15/backup-manifest-toplevel.html "PostgreSQL 15 - 70.1. Backup Manifest Top-level Object")
/
[14](/docs/14/backup-manifest-toplevel.html "PostgreSQL 14 - 70.1. Backup Manifest Top-level Object")

Development Versions:
[19](/docs/19/backup-manifest-toplevel.html "PostgreSQL 19 - 70.1. Backup Manifest Top-level Object")
/
[devel](/docs/devel/backup-manifest-toplevel.html "PostgreSQL devel - 70.1. Backup Manifest Top-level Object")

Unsupported versions:
[13](/docs/13/backup-manifest-toplevel.html "PostgreSQL 13 - 70.1. Backup Manifest Top-level Object")

## 70.1. Backup Manifest Top-level Object [#](#BACKUP-MANIFEST-TOPLEVEL)

The backup manifest JSON document contains the following keys.

`PostgreSQL-Backup-Manifest-Version`
:   The associated value is an integer. Beginning in PostgreSQL `17`, it is `2`; in older versions, it is `1`.

`System-Identifier`
:   The database system identifier of the PostgreSQL instance where the backup was taken. This field is present only when `PostgreSQL-Backup-Manifest-Version` is `2`.

`Files`
:   The associated value is always a list of objects, each describing one file that is present in the backup. No entries are present in this list for the WAL files that are needed in order to use the backup, or for the backup manifest itself. The structure of each object in the list is described in [Section 70.2](backup-manifest-files.html "70.2. Backup Manifest File Object").

`WAL-Ranges`
:   The associated value is always a list of objects, each describing a range of WAL records that must be readable from a particular timeline in order to make use of the backup. The structure of these objects is further described in [Section 70.3](backup-manifest-wal-ranges.html "70.3. Backup Manifest WAL Range Object").

`Manifest-Checksum`
:   This key is always present on the last line of the backup manifest file. The associated value is a SHA-256 checksum of all the preceding lines. We use a fixed checksum method here to make it possible for clients to do incremental parsing of the manifest. While a SHA-256 checksum is significantly more expensive than a CRC-32C checksum, the manifest should normally be small enough that the extra computation won't matter very much.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/backup-manifest-toplevel.html/)
to report a documentation issue.
