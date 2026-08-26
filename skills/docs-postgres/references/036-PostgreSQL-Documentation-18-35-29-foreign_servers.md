# PostgreSQL: Documentation: 18: 35.29. foreign_servers

Source: https://www.postgresql.org/docs/current/infoschema-foreign-servers.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/infoschema-foreign-servers.html "PostgreSQL 18 - 35.29. foreign_servers")
([18](/docs/18/infoschema-foreign-servers.html "PostgreSQL 18 - 35.29. foreign_servers"))
/
[17](/docs/17/infoschema-foreign-servers.html "PostgreSQL 17 - 35.29. foreign_servers")
/
[16](/docs/16/infoschema-foreign-servers.html "PostgreSQL 16 - 35.29. foreign_servers")
/
[15](/docs/15/infoschema-foreign-servers.html "PostgreSQL 15 - 35.29. foreign_servers")
/
[14](/docs/14/infoschema-foreign-servers.html "PostgreSQL 14 - 35.29. foreign_servers")

Development Versions:
[19](/docs/19/infoschema-foreign-servers.html "PostgreSQL 19 - 35.29. foreign_servers")
/
[devel](/docs/devel/infoschema-foreign-servers.html "PostgreSQL devel - 35.29. foreign_servers")

Unsupported versions:
[13](/docs/13/infoschema-foreign-servers.html "PostgreSQL 13 - 35.29. foreign_servers")
/
[12](/docs/12/infoschema-foreign-servers.html "PostgreSQL 12 - 35.29. foreign_servers")
/
[11](/docs/11/infoschema-foreign-servers.html "PostgreSQL 11 - 35.29. foreign_servers")
/
[10](/docs/10/infoschema-foreign-servers.html "PostgreSQL 10 - 35.29. foreign_servers")
/
[9.6](/docs/9.6/infoschema-foreign-servers.html "PostgreSQL 9.6 - 35.29. foreign_servers")
/
[9.5](/docs/9.5/infoschema-foreign-servers.html "PostgreSQL 9.5 - 35.29. foreign_servers")
/
[9.4](/docs/9.4/infoschema-foreign-servers.html "PostgreSQL 9.4 - 35.29. foreign_servers")
/
[9.3](/docs/9.3/infoschema-foreign-servers.html "PostgreSQL 9.3 - 35.29. foreign_servers")
/
[9.2](/docs/9.2/infoschema-foreign-servers.html "PostgreSQL 9.2 - 35.29. foreign_servers")
/
[9.1](/docs/9.1/infoschema-foreign-servers.html "PostgreSQL 9.1 - 35.29. foreign_servers")
/
[9.0](/docs/9.0/infoschema-foreign-servers.html "PostgreSQL 9.0 - 35.29. foreign_servers")
/
[8.4](/docs/8.4/infoschema-foreign-servers.html "PostgreSQL 8.4 - 35.29. foreign_servers")

## 35.29. `foreign_servers` [#](#INFOSCHEMA-FOREIGN-SERVERS)

The view `foreign_servers` contains all foreign servers defined in the current database. Only those foreign servers are shown that the current user has access to (by way of being the owner or having some privilege).

**Table 35.27. `foreign_servers` Columns**

| Column Type  Description |
| --- |
| `foreign_server_catalog` `sql_identifier`  Name of the database that the foreign server is defined in (always the current database) |
| `foreign_server_name` `sql_identifier`  Name of the foreign server |
| `foreign_data_wrapper_catalog` `sql_identifier`  Name of the database that contains the foreign-data wrapper used by the foreign server (always the current database) |
| `foreign_data_wrapper_name` `sql_identifier`  Name of the foreign-data wrapper used by the foreign server |
| `foreign_server_type` `character_data`  Foreign server type information, if specified upon creation |
| `foreign_server_version` `character_data`  Foreign server version information, if specified upon creation |
| `authorization_identifier` `sql_identifier`  Name of the owner of the foreign server |

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/infoschema-foreign-servers.html/)
to report a documentation issue.
