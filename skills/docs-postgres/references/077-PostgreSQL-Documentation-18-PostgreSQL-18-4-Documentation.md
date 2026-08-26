# PostgreSQL: Documentation: 18: PostgreSQL 18.4 Documentation

Source: https://www.postgresql.org/docs/current

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/index.html "PostgreSQL 18 - PostgreSQL 18.4 Documentation")
([18](/docs/18/index.html "PostgreSQL 18 - PostgreSQL 18.4 Documentation"))
/
[17](/docs/17/index.html "PostgreSQL 17 - PostgreSQL 18.4 Documentation")
/
[16](/docs/16/index.html "PostgreSQL 16 - PostgreSQL 18.4 Documentation")
/
[15](/docs/15/index.html "PostgreSQL 15 - PostgreSQL 18.4 Documentation")
/
[14](/docs/14/index.html "PostgreSQL 14 - PostgreSQL 18.4 Documentation")

Development Versions:
[19](/docs/19/index.html "PostgreSQL 19 - PostgreSQL 18.4 Documentation")
/
[devel](/docs/devel/index.html "PostgreSQL devel - PostgreSQL 18.4 Documentation")

Unsupported versions:
[13](/docs/13/index.html "PostgreSQL 13 - PostgreSQL 18.4 Documentation")
/
[12](/docs/12/index.html "PostgreSQL 12 - PostgreSQL 18.4 Documentation")
/
[11](/docs/11/index.html "PostgreSQL 11 - PostgreSQL 18.4 Documentation")
/
[10](/docs/10/index.html "PostgreSQL 10 - PostgreSQL 18.4 Documentation")
/
[9.6](/docs/9.6/index.html "PostgreSQL 9.6 - PostgreSQL 18.4 Documentation")
/
[9.5](/docs/9.5/index.html "PostgreSQL 9.5 - PostgreSQL 18.4 Documentation")
/
[9.4](/docs/9.4/index.html "PostgreSQL 9.4 - PostgreSQL 18.4 Documentation")
/
[9.3](/docs/9.3/index.html "PostgreSQL 9.3 - PostgreSQL 18.4 Documentation")
/
[9.2](/docs/9.2/index.html "PostgreSQL 9.2 - PostgreSQL 18.4 Documentation")
/
[9.1](/docs/9.1/index.html "PostgreSQL 9.1 - PostgreSQL 18.4 Documentation")
/
[9.0](/docs/9.0/index.html "PostgreSQL 9.0 - PostgreSQL 18.4 Documentation")
/
[8.4](/docs/8.4/index.html "PostgreSQL 8.4 - PostgreSQL 18.4 Documentation")
/
[8.3](/docs/8.3/index.html "PostgreSQL 8.3 - PostgreSQL 18.4 Documentation")
/
[8.2](/docs/8.2/index.html "PostgreSQL 8.2 - PostgreSQL 18.4 Documentation")
/
[8.1](/docs/8.1/index.html "PostgreSQL 8.1 - PostgreSQL 18.4 Documentation")
/
[8.0](/docs/8.0/index.html "PostgreSQL 8.0 - PostgreSQL 18.4 Documentation")
/
[7.4](/docs/7.4/index.html "PostgreSQL 7.4 - PostgreSQL 18.4 Documentation")
/
[7.3](/docs/7.3/index.html "PostgreSQL 7.3 - PostgreSQL 18.4 Documentation")
/
[7.2](/docs/7.2/index.html "PostgreSQL 7.2 - PostgreSQL 18.4 Documentation")

# PostgreSQL 18.4 Documentation

### The PostgreSQL Global Development Group

Copyright © 1996–2026 The PostgreSQL Global Development Group

[Legal Notice](legalnotice.html)

---

**Table of Contents**

[Preface](preface.html)
:   [1. What Is PostgreSQL?](intro-whatis.html)

    [2. A Brief History of PostgreSQL](history.html)

    [3. Conventions](notation.html)

    [4. Further Information](resources.html)

    [5. Bug Reporting Guidelines](bug-reporting.html)

[I. Tutorial](tutorial.html)
:   [1. Getting Started](tutorial-start.html)

    [2. The SQL Language](tutorial-sql.html)

    [3. Advanced Features](tutorial-advanced.html)

[II. The SQL Language](sql.html)
:   [4. SQL Syntax](sql-syntax.html)

    [5. Data Definition](ddl.html)

    [6. Data Manipulation](dml.html)

    [7. Queries](queries.html)

    [8. Data Types](datatype.html)

    [9. Functions and Operators](functions.html)

    [10. Type Conversion](typeconv.html)

    [11. Indexes](indexes.html)

    [12. Full Text Search](textsearch.html)

    [13. Concurrency Control](mvcc.html)

    [14. Performance Tips](performance-tips.html)

    [15. Parallel Query](parallel-query.html)

[III. Server Administration](admin.html)
:   [16. Installation from Binaries](install-binaries.html)

    [17. Installation from Source Code](installation.html)

    [18. Server Setup and Operation](runtime.html)

    [19. Server Configuration](runtime-config.html)

    [20. Client Authentication](client-authentication.html)

    [21. Database Roles](user-manag.html)

    [22. Managing Databases](managing-databases.html)

    [23. Localization](charset.html)

    [24. Routine Database Maintenance Tasks](maintenance.html)

    [25. Backup and Restore](backup.html)

    [26. High Availability, Load Balancing, and Replication](high-availability.html)

    [27. Monitoring Database Activity](monitoring.html)

    [28. Reliability and the Write-Ahead Log](wal.html)

    [29. Logical Replication](logical-replication.html)

    [30. Just-in-Time Compilation (JIT)](jit.html)

    [31. Regression Tests](regress.html)

[IV. Client Interfaces](client-interfaces.html)
:   [32. libpq — C Library](libpq.html)

    [33. Large Objects](largeobjects.html)

    [34. ECPG — Embedded SQL in C](ecpg.html)

    [35. The Information Schema](information-schema.html)

[V. Server Programming](server-programming.html)
:   [36. Extending SQL](extend.html)

    [37. Triggers](triggers.html)

    [38. Event Triggers](event-triggers.html)

    [39. The Rule System](rules.html)

    [40. Procedural Languages](xplang.html)

    [41. PL/pgSQL — SQL Procedural Language](plpgsql.html)

    [42. PL/Tcl — Tcl Procedural Language](pltcl.html)

    [43. PL/Perl — Perl Procedural Language](plperl.html)

    [44. PL/Python — Python Procedural Language](plpython.html)

    [45. Server Programming Interface](spi.html)

    [46. Background Worker Processes](bgworker.html)

    [47. Logical Decoding](logicaldecoding.html)

    [48. Replication Progress Tracking](replication-origins.html)

    [49. Archive Modules](archive-modules.html)

    [50. OAuth Validator Modules](oauth-validators.html)

[VI. Reference](reference.html)
:   [I. SQL Commands](sql-commands.html)

    [II. PostgreSQL Client Applications](reference-client.html)

    [III. PostgreSQL Server Applications](reference-server.html)

[VII. Internals](internals.html)
:   [51. Overview of PostgreSQL Internals](overview.html)

    [52. System Catalogs](catalogs.html)

    [53. System Views](views.html)

    [54. Frontend/Backend Protocol](protocol.html)

    [55. PostgreSQL Coding Conventions](source.html)

    [56. Native Language Support](nls.html)

    [57. Writing a Procedural Language Handler](plhandler.html)

    [58. Writing a Foreign Data Wrapper](fdwhandler.html)

    [59. Writing a Table Sampling Method](tablesample-method.html)

    [60. Writing a Custom Scan Provider](custom-scan.html)

    [61. Genetic Query Optimizer](geqo.html)

    [62. Table Access Method Interface Definition](tableam.html)

    [63. Index Access Method Interface Definition](indexam.html)

    [64. Write Ahead Logging for Extensions](wal-for-extensions.html)

    [65. Built-in Index Access Methods](indextypes.html)

    [66. Database Physical Storage](storage.html)

    [67. Transaction Processing](transactions.html)

    [68. System Catalog Declarations and Initial Contents](bki.html)

    [69. How the Planner Uses Statistics](planner-stats-details.html)

    [70. Backup Manifest Format](backup-manifest-format.html)

[VIII. Appendixes](appendixes.html)
:   [A. PostgreSQL Error Codes](errcodes-appendix.html)

    [B. Date/Time Support](datetime-appendix.html)

    [C. SQL Key Words](sql-keywords-appendix.html)

    [D. SQL Conformance](features.html)

    [E. Release Notes](release.html)

    [F. Additional Supplied Modules and Extensions](contrib.html)

    [G. Additional Supplied Programs](contrib-prog.html)

    [H. External Projects](external-projects.html)

    [I. The Source Code Repository](sourcerepo.html)

    [J. Documentation](docguide.html)

    [K. PostgreSQL Limits](limits.html)

    [L. Acronyms](acronyms.html)

    [M. Glossary](glossary.html)

    [N. Color Support](color.html)

    [O. Obsolete or Renamed Features](appendix-obsolete.html)

[Bibliography](biblio.html)

[Index](bookindex.html)

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/index.html/)
to report a documentation issue.
