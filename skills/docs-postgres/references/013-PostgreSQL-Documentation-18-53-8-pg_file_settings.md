# PostgreSQL: Documentation: 18: 53.8. pg_file_settings

Source: https://www.postgresql.org/docs/current/view-pg-file-settings.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/view-pg-file-settings.html "PostgreSQL 18 - 53.8. pg_file_settings")
([18](/docs/18/view-pg-file-settings.html "PostgreSQL 18 - 53.8. pg_file_settings"))
/
[17](/docs/17/view-pg-file-settings.html "PostgreSQL 17 - 53.8. pg_file_settings")
/
[16](/docs/16/view-pg-file-settings.html "PostgreSQL 16 - 53.8. pg_file_settings")
/
[15](/docs/15/view-pg-file-settings.html "PostgreSQL 15 - 53.8. pg_file_settings")
/
[14](/docs/14/view-pg-file-settings.html "PostgreSQL 14 - 53.8. pg_file_settings")

Development Versions:
[19](/docs/19/view-pg-file-settings.html "PostgreSQL 19 - 53.8. pg_file_settings")
/
[devel](/docs/devel/view-pg-file-settings.html "PostgreSQL devel - 53.8. pg_file_settings")

Unsupported versions:
[13](/docs/13/view-pg-file-settings.html "PostgreSQL 13 - 53.8. pg_file_settings")
/
[12](/docs/12/view-pg-file-settings.html "PostgreSQL 12 - 53.8. pg_file_settings")
/
[11](/docs/11/view-pg-file-settings.html "PostgreSQL 11 - 53.8. pg_file_settings")
/
[10](/docs/10/view-pg-file-settings.html "PostgreSQL 10 - 53.8. pg_file_settings")
/
[9.6](/docs/9.6/view-pg-file-settings.html "PostgreSQL 9.6 - 53.8. pg_file_settings")
/
[9.5](/docs/9.5/view-pg-file-settings.html "PostgreSQL 9.5 - 53.8. pg_file_settings")

## 53.8. `pg_file_settings` [#](#VIEW-PG-FILE-SETTINGS)

The view `pg_file_settings` provides a summary of the contents of the server's configuration file(s). A row appears in this view for each “name = value” entry appearing in the files, with annotations indicating whether the value could be applied successfully. Additional row(s) may appear for problems not linked to a “name = value” entry, such as syntax errors in the files.

This view is helpful for checking whether planned changes in the configuration files will work, or for diagnosing a previous failure. Note that this view reports on the *current* contents of the files, not on what was last applied by the server. (The [`pg_settings`](view-pg-settings.html "53.25. pg_settings") view is usually sufficient to determine that.)

By default, the `pg_file_settings` view can be read only by superusers.

**Table 53.8. `pg_file_settings` Columns**

| Column Type  Description |
| --- |
| `sourcefile` `text`  Full path name of the configuration file |
| `sourceline` `int4`  Line number within the configuration file where the entry appears |
| `seqno` `int4`  Order in which the entries are processed (1..*`n`*) |
| `name` `text`  Configuration parameter name |
| `setting` `text`  Value to be assigned to the parameter |
| `applied` `bool`  True if the value can be applied successfully |
| `error` `text`  If not null, an error message indicating why this entry could not be applied |

If the configuration file contains syntax errors or invalid parameter names, the server will not attempt to apply any settings from it, and therefore all the `applied` fields will read as false. In such a case there will be one or more rows with non-null `error` fields indicating the problem(s). Otherwise, individual settings will be applied if possible. If an individual setting cannot be applied (e.g., invalid value, or the setting cannot be changed after server start) it will have an appropriate message in the `error` field. Another way that an entry might have `applied` = false is that it is overridden by a later entry for the same parameter name; this case is not considered an error so nothing appears in the `error` field.

See [Section 19.1](config-setting.html "19.1. Setting Parameters") for more information about the various ways to change run-time parameters.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/view-pg-file-settings.html/)
to report a documentation issue.
