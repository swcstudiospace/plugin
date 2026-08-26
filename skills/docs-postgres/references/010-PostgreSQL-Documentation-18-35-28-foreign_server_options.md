# PostgreSQL: Documentation: 18: 35.28. foreign_server_options

Source: https://www.postgresql.org/docs/current/infoschema-foreign-server-options.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/infoschema-foreign-server-options.html "PostgreSQL 18 - 35.28. foreign_server_options")
([18](/docs/18/infoschema-foreign-server-options.html "PostgreSQL 18 - 35.28. foreign_server_options"))
/
[17](/docs/17/infoschema-foreign-server-options.html "PostgreSQL 17 - 35.28. foreign_server_options")
/
[16](/docs/16/infoschema-foreign-server-options.html "PostgreSQL 16 - 35.28. foreign_server_options")
/
[15](/docs/15/infoschema-foreign-server-options.html "PostgreSQL 15 - 35.28. foreign_server_options")
/
[14](/docs/14/infoschema-foreign-server-options.html "PostgreSQL 14 - 35.28. foreign_server_options")

Development Versions:
[19](/docs/19/infoschema-foreign-server-options.html "PostgreSQL 19 - 35.28. foreign_server_options")
/
[devel](/docs/devel/infoschema-foreign-server-options.html "PostgreSQL devel - 35.28. foreign_server_options")

Unsupported versions:
[13](/docs/13/infoschema-foreign-server-options.html "PostgreSQL 13 - 35.28. foreign_server_options")
/
[12](/docs/12/infoschema-foreign-server-options.html "PostgreSQL 12 - 35.28. foreign_server_options")
/
[11](/docs/11/infoschema-foreign-server-options.html "PostgreSQL 11 - 35.28. foreign_server_options")
/
[10](/docs/10/infoschema-foreign-server-options.html "PostgreSQL 10 - 35.28. foreign_server_options")
/
[9.6](/docs/9.6/infoschema-foreign-server-options.html "PostgreSQL 9.6 - 35.28. foreign_server_options")
/
[9.5](/docs/9.5/infoschema-foreign-server-options.html "PostgreSQL 9.5 - 35.28. foreign_server_options")
/
[9.4](/docs/9.4/infoschema-foreign-server-options.html "PostgreSQL 9.4 - 35.28. foreign_server_options")
/
[9.3](/docs/9.3/infoschema-foreign-server-options.html "PostgreSQL 9.3 - 35.28. foreign_server_options")
/
[9.2](/docs/9.2/infoschema-foreign-server-options.html "PostgreSQL 9.2 - 35.28. foreign_server_options")
/
[9.1](/docs/9.1/infoschema-foreign-server-options.html "PostgreSQL 9.1 - 35.28. foreign_server_options")
/
[9.0](/docs/9.0/infoschema-foreign-server-options.html "PostgreSQL 9.0 - 35.28. foreign_server_options")
/
[8.4](/docs/8.4/infoschema-foreign-server-options.html "PostgreSQL 8.4 - 35.28. foreign_server_options")

## 35.28. `foreign_server_options` [#](#INFOSCHEMA-FOREIGN-SERVER-OPTIONS)

The view `foreign_server_options` contains all the options defined for foreign servers in the current database. Only those foreign servers are shown that the current user has access to (by way of being the owner or having some privilege).

**Table 35.26. `foreign_server_options` Columns**

| Column Type  Description |
| --- |
| `foreign_server_catalog` `sql_identifier`  Name of the database that the foreign server is defined in (always the current database) |
| `foreign_server_name` `sql_identifier`  Name of the foreign server |
| `option_name` `sql_identifier`  Name of an option |
| `option_value` `character_data`  Value of the option |

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/infoschema-foreign-server-options.html/)
to report a documentation issue.
