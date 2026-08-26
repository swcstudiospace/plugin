# PostgreSQL: Documentation: 18: Chapter 30. Just-in-Time Compilation (JIT)

Source: https://www.postgresql.org/docs/current/jit.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/jit.html "PostgreSQL 18 - Chapter 30. Just-in-Time Compilation (JIT)")
([18](/docs/18/jit.html "PostgreSQL 18 - Chapter 30. Just-in-Time Compilation (JIT)"))
/
[17](/docs/17/jit.html "PostgreSQL 17 - Chapter 30. Just-in-Time Compilation (JIT)")
/
[16](/docs/16/jit.html "PostgreSQL 16 - Chapter 30. Just-in-Time Compilation (JIT)")
/
[15](/docs/15/jit.html "PostgreSQL 15 - Chapter 30. Just-in-Time Compilation (JIT)")
/
[14](/docs/14/jit.html "PostgreSQL 14 - Chapter 30. Just-in-Time Compilation (JIT)")

Development Versions:
[19](/docs/19/jit.html "PostgreSQL 19 - Chapter 30. Just-in-Time Compilation (JIT)")
/
[devel](/docs/devel/jit.html "PostgreSQL devel - Chapter 30. Just-in-Time Compilation (JIT)")

Unsupported versions:
[13](/docs/13/jit.html "PostgreSQL 13 - Chapter 30. Just-in-Time Compilation (JIT)")
/
[12](/docs/12/jit.html "PostgreSQL 12 - Chapter 30. Just-in-Time Compilation (JIT)")
/
[11](/docs/11/jit.html "PostgreSQL 11 - Chapter 30. Just-in-Time Compilation (JIT)")

## Chapter 30. Just-in-Time Compilation (JIT)

**Table of Contents**

[30.1. What Is JIT compilation?](jit-reason.html)
:   [30.1.1. JIT Accelerated Operations](jit-reason.html#JIT-ACCELERATED-OPERATIONS)

    [30.1.2. Inlining](jit-reason.html#JIT-INLINING)

    [30.1.3. Optimization](jit-reason.html#JIT-OPTIMIZATION)

[30.2. When to JIT?](jit-decision.html)

[30.3. Configuration](jit-configuration.html)

[30.4. Extensibility](jit-extensibility.html)
:   [30.4.1. Inlining Support for Extensions](jit-extensibility.html#JIT-EXTENSIBILITY-BITCODE)

    [30.4.2. Pluggable JIT Providers](jit-extensibility.html#JIT-PLUGGABLE)

This chapter explains what just-in-time compilation is, and how it can be configured in PostgreSQL.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/jit.html/)
to report a documentation issue.
