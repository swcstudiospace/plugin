# PostgreSQL: Documentation: 18: DROP SUBSCRIPTION

Source: https://www.postgresql.org/docs/current/sql-dropsubscription.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/sql-dropsubscription.html "PostgreSQL 18 - DROP SUBSCRIPTION")
([18](/docs/18/sql-dropsubscription.html "PostgreSQL 18 - DROP SUBSCRIPTION"))
/
[17](/docs/17/sql-dropsubscription.html "PostgreSQL 17 - DROP SUBSCRIPTION")
/
[16](/docs/16/sql-dropsubscription.html "PostgreSQL 16 - DROP SUBSCRIPTION")
/
[15](/docs/15/sql-dropsubscription.html "PostgreSQL 15 - DROP SUBSCRIPTION")
/
[14](/docs/14/sql-dropsubscription.html "PostgreSQL 14 - DROP SUBSCRIPTION")

Development Versions:
[19](/docs/19/sql-dropsubscription.html "PostgreSQL 19 - DROP SUBSCRIPTION")
/
[devel](/docs/devel/sql-dropsubscription.html "PostgreSQL devel - DROP SUBSCRIPTION")

Unsupported versions:
[13](/docs/13/sql-dropsubscription.html "PostgreSQL 13 - DROP SUBSCRIPTION")
/
[12](/docs/12/sql-dropsubscription.html "PostgreSQL 12 - DROP SUBSCRIPTION")
/
[11](/docs/11/sql-dropsubscription.html "PostgreSQL 11 - DROP SUBSCRIPTION")
/
[10](/docs/10/sql-dropsubscription.html "PostgreSQL 10 - DROP SUBSCRIPTION")

## DROP SUBSCRIPTION

DROP SUBSCRIPTION — remove a subscription

## Synopsis

```
DROP SUBSCRIPTION [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

## Description

`DROP SUBSCRIPTION` removes a subscription from the database cluster.

To execute this command the user must be the owner of the subscription.

`DROP SUBSCRIPTION` cannot be executed inside a transaction block if the subscription is associated with a replication slot. (You can use [`ALTER SUBSCRIPTION`](sql-altersubscription.html "ALTER SUBSCRIPTION") to unset the slot.)

## Parameters

`IF EXISTS`
:   Do not throw an error if the subscription does not exist. A notice is issued in this case.

*`name`*
:   The name of a subscription to be dropped.

`CASCADE` `RESTRICT`
:   These key words do not have any effect, since there are no dependencies on subscriptions.

## Notes

When dropping a subscription that is associated with a replication slot on the remote host (the normal state), `DROP SUBSCRIPTION` will connect to the remote host and try to drop the replication slot (and any remaining table synchronization slots) as part of its operation. This is necessary so that the resources allocated for the subscription on the remote host are released. If this fails, either because the remote host is not reachable or because the remote replication slot cannot be dropped or does not exist or never existed, the `DROP SUBSCRIPTION` command will fail. To proceed in this situation, first disable the subscription by executing [`ALTER SUBSCRIPTION ... DISABLE`](sql-altersubscription.html#SQL-ALTERSUBSCRIPTION-PARAMS-DISABLE), and then disassociate it from the replication slot by executing [`ALTER SUBSCRIPTION ... SET (slot_name = NONE)`](sql-altersubscription.html#SQL-ALTERSUBSCRIPTION-PARAMS-SET). After that, `DROP SUBSCRIPTION` will no longer attempt any actions on a remote host. Note that if the remote replication slot still exists, it (and any related table synchronization slots) should then be dropped manually; otherwise it/they will continue to reserve WAL and might eventually cause the disk to fill up. See also [Section 29.2.1](logical-replication-subscription.html#LOGICAL-REPLICATION-SUBSCRIPTION-SLOT "29.2.1. Replication Slot Management").

If a subscription is associated with a replication slot, then `DROP SUBSCRIPTION` cannot be executed inside a transaction block.

## Examples

Drop a subscription:

```
DROP SUBSCRIPTION mysub;
```

## Compatibility

`DROP SUBSCRIPTION` is a PostgreSQL extension.

## See Also

[CREATE SUBSCRIPTION](sql-createsubscription.html "CREATE SUBSCRIPTION"), [ALTER SUBSCRIPTION](sql-altersubscription.html "ALTER SUBSCRIPTION")

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/sql-dropsubscription.html/)
to report a documentation issue.
