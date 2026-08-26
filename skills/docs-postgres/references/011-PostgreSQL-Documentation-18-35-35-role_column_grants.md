# PostgreSQL: Documentation: 18: 35.35. role_column_grants

Source: https://www.postgresql.org/docs/current/infoschema-role-column-grants.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/infoschema-role-column-grants.html "PostgreSQL 18 - 35.35. role_column_grants")
([18](/docs/18/infoschema-role-column-grants.html "PostgreSQL 18 - 35.35. role_column_grants"))
/
[17](/docs/17/infoschema-role-column-grants.html "PostgreSQL 17 - 35.35. role_column_grants")
/
[16](/docs/16/infoschema-role-column-grants.html "PostgreSQL 16 - 35.35. role_column_grants")
/
[15](/docs/15/infoschema-role-column-grants.html "PostgreSQL 15 - 35.35. role_column_grants")
/
[14](/docs/14/infoschema-role-column-grants.html "PostgreSQL 14 - 35.35. role_column_grants")

Development Versions:
[19](/docs/19/infoschema-role-column-grants.html "PostgreSQL 19 - 35.35. role_column_grants")
/
[devel](/docs/devel/infoschema-role-column-grants.html "PostgreSQL devel - 35.35. role_column_grants")

Unsupported versions:
[13](/docs/13/infoschema-role-column-grants.html "PostgreSQL 13 - 35.35. role_column_grants")
/
[12](/docs/12/infoschema-role-column-grants.html "PostgreSQL 12 - 35.35. role_column_grants")
/
[11](/docs/11/infoschema-role-column-grants.html "PostgreSQL 11 - 35.35. role_column_grants")
/
[10](/docs/10/infoschema-role-column-grants.html "PostgreSQL 10 - 35.35. role_column_grants")
/
[9.6](/docs/9.6/infoschema-role-column-grants.html "PostgreSQL 9.6 - 35.35. role_column_grants")
/
[9.5](/docs/9.5/infoschema-role-column-grants.html "PostgreSQL 9.5 - 35.35. role_column_grants")
/
[9.4](/docs/9.4/infoschema-role-column-grants.html "PostgreSQL 9.4 - 35.35. role_column_grants")
/
[9.3](/docs/9.3/infoschema-role-column-grants.html "PostgreSQL 9.3 - 35.35. role_column_grants")
/
[9.2](/docs/9.2/infoschema-role-column-grants.html "PostgreSQL 9.2 - 35.35. role_column_grants")
/
[9.1](/docs/9.1/infoschema-role-column-grants.html "PostgreSQL 9.1 - 35.35. role_column_grants")
/
[9.0](/docs/9.0/infoschema-role-column-grants.html "PostgreSQL 9.0 - 35.35. role_column_grants")
/
[8.4](/docs/8.4/infoschema-role-column-grants.html "PostgreSQL 8.4 - 35.35. role_column_grants")
/
[8.3](/docs/8.3/infoschema-role-column-grants.html "PostgreSQL 8.3 - 35.35. role_column_grants")
/
[8.2](/docs/8.2/infoschema-role-column-grants.html "PostgreSQL 8.2 - 35.35. role_column_grants")
/
[8.1](/docs/8.1/infoschema-role-column-grants.html "PostgreSQL 8.1 - 35.35. role_column_grants")
/
[8.0](/docs/8.0/infoschema-role-column-grants.html "PostgreSQL 8.0 - 35.35. role_column_grants")
/
[7.4](/docs/7.4/infoschema-role-column-grants.html "PostgreSQL 7.4 - 35.35. role_column_grants")

## 35.35. `role_column_grants` [#](#INFOSCHEMA-ROLE-COLUMN-GRANTS)

The view `role_column_grants` identifies all privileges granted on columns where the grantor or grantee is a currently enabled role. Further information can be found under `column_privileges`. The only effective difference between this view and `column_privileges` is that this view omits columns that have been made accessible to the current user by way of a grant to `PUBLIC`.

**Table 35.33. `role_column_grants` Columns**

| Column Type  Description |
| --- |
| `grantor` `sql_identifier`  Name of the role that granted the privilege |
| `grantee` `sql_identifier`  Name of the role that the privilege was granted to |
| `table_catalog` `sql_identifier`  Name of the database that contains the table that contains the column (always the current database) |
| `table_schema` `sql_identifier`  Name of the schema that contains the table that contains the column |
| `table_name` `sql_identifier`  Name of the table that contains the column |
| `column_name` `sql_identifier`  Name of the column |
| `privilege_type` `character_data`  Type of the privilege: `SELECT`, `INSERT`, `UPDATE`, or `REFERENCES` |
| `is_grantable` `yes_or_no`  `YES` if the privilege is grantable, `NO` if not |

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/infoschema-role-column-grants.html/)
to report a documentation issue.
