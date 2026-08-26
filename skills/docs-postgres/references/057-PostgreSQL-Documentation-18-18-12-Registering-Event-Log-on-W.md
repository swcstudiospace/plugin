# PostgreSQL: Documentation: 18: 18.12. Registering Event Log on Windows

Source: https://www.postgresql.org/docs/current/event-log-registration.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/event-log-registration.html "PostgreSQL 18 - 18.12. Registering Event Log on Windows")
([18](/docs/18/event-log-registration.html "PostgreSQL 18 - 18.12. Registering Event Log on Windows"))
/
[17](/docs/17/event-log-registration.html "PostgreSQL 17 - 18.12. Registering Event Log on Windows")
/
[16](/docs/16/event-log-registration.html "PostgreSQL 16 - 18.12. Registering Event Log on Windows")
/
[15](/docs/15/event-log-registration.html "PostgreSQL 15 - 18.12. Registering Event Log on Windows")
/
[14](/docs/14/event-log-registration.html "PostgreSQL 14 - 18.12. Registering Event Log on Windows")

Development Versions:
[19](/docs/19/event-log-registration.html "PostgreSQL 19 - 18.12. Registering Event Log on Windows")
/
[devel](/docs/devel/event-log-registration.html "PostgreSQL devel - 18.12. Registering Event Log on Windows")

Unsupported versions:
[13](/docs/13/event-log-registration.html "PostgreSQL 13 - 18.12. Registering Event Log on Windows")
/
[12](/docs/12/event-log-registration.html "PostgreSQL 12 - 18.12. Registering Event Log on Windows")
/
[11](/docs/11/event-log-registration.html "PostgreSQL 11 - 18.12. Registering Event Log on Windows")
/
[10](/docs/10/event-log-registration.html "PostgreSQL 10 - 18.12. Registering Event Log on Windows")
/
[9.6](/docs/9.6/event-log-registration.html "PostgreSQL 9.6 - 18.12. Registering Event Log on Windows")
/
[9.5](/docs/9.5/event-log-registration.html "PostgreSQL 9.5 - 18.12. Registering Event Log on Windows")
/
[9.4](/docs/9.4/event-log-registration.html "PostgreSQL 9.4 - 18.12. Registering Event Log on Windows")
/
[9.3](/docs/9.3/event-log-registration.html "PostgreSQL 9.3 - 18.12. Registering Event Log on Windows")
/
[9.2](/docs/9.2/event-log-registration.html "PostgreSQL 9.2 - 18.12. Registering Event Log on Windows")

## 18.12. Registering Event Log on Windows [#](#EVENT-LOG-REGISTRATION)

To register a Windows event log library with the operating system, issue this command:

```
regsvr32 pgsql_library_directory/pgevent.dll
```

This creates registry entries used by the event viewer, under the default event source named `PostgreSQL`.

To specify a different event source name (see [event\_source](runtime-config-logging.html#GUC-EVENT-SOURCE)), use the `/n` and `/i` options:

```
regsvr32 /n /i:event_source_name pgsql_library_directory/pgevent.dll
```

To unregister the event log library from the operating system, issue this command:

```
regsvr32 /u [/i:event_source_name] pgsql_library_directory/pgevent.dll
```

### Note

To enable event logging in the database server, modify [log\_destination](runtime-config-logging.html#GUC-LOG-DESTINATION) to include `eventlog` in `postgresql.conf`.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/event-log-registration.html/)
to report a documentation issue.
