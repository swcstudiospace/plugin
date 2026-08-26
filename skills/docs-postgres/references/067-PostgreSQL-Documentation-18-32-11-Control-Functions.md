# PostgreSQL: Documentation: 18: 32.11. Control Functions

Source: https://www.postgresql.org/docs/current/libpq-control.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/libpq-control.html "PostgreSQL 18 - 32.11. Control Functions")
([18](/docs/18/libpq-control.html "PostgreSQL 18 - 32.11. Control Functions"))
/
[17](/docs/17/libpq-control.html "PostgreSQL 17 - 32.11. Control Functions")
/
[16](/docs/16/libpq-control.html "PostgreSQL 16 - 32.11. Control Functions")
/
[15](/docs/15/libpq-control.html "PostgreSQL 15 - 32.11. Control Functions")
/
[14](/docs/14/libpq-control.html "PostgreSQL 14 - 32.11. Control Functions")

Development Versions:
[19](/docs/19/libpq-control.html "PostgreSQL 19 - 32.11. Control Functions")
/
[devel](/docs/devel/libpq-control.html "PostgreSQL devel - 32.11. Control Functions")

Unsupported versions:
[13](/docs/13/libpq-control.html "PostgreSQL 13 - 32.11. Control Functions")
/
[12](/docs/12/libpq-control.html "PostgreSQL 12 - 32.11. Control Functions")
/
[11](/docs/11/libpq-control.html "PostgreSQL 11 - 32.11. Control Functions")
/
[10](/docs/10/libpq-control.html "PostgreSQL 10 - 32.11. Control Functions")
/
[9.6](/docs/9.6/libpq-control.html "PostgreSQL 9.6 - 32.11. Control Functions")
/
[9.5](/docs/9.5/libpq-control.html "PostgreSQL 9.5 - 32.11. Control Functions")
/
[9.4](/docs/9.4/libpq-control.html "PostgreSQL 9.4 - 32.11. Control Functions")
/
[9.3](/docs/9.3/libpq-control.html "PostgreSQL 9.3 - 32.11. Control Functions")
/
[9.2](/docs/9.2/libpq-control.html "PostgreSQL 9.2 - 32.11. Control Functions")
/
[9.1](/docs/9.1/libpq-control.html "PostgreSQL 9.1 - 32.11. Control Functions")
/
[9.0](/docs/9.0/libpq-control.html "PostgreSQL 9.0 - 32.11. Control Functions")
/
[8.4](/docs/8.4/libpq-control.html "PostgreSQL 8.4 - 32.11. Control Functions")
/
[8.3](/docs/8.3/libpq-control.html "PostgreSQL 8.3 - 32.11. Control Functions")
/
[8.2](/docs/8.2/libpq-control.html "PostgreSQL 8.2 - 32.11. Control Functions")
/
[8.1](/docs/8.1/libpq-control.html "PostgreSQL 8.1 - 32.11. Control Functions")
/
[8.0](/docs/8.0/libpq-control.html "PostgreSQL 8.0 - 32.11. Control Functions")
/
[7.4](/docs/7.4/libpq-control.html "PostgreSQL 7.4 - 32.11. Control Functions")
/
[7.3](/docs/7.3/libpq-control.html "PostgreSQL 7.3 - 32.11. Control Functions")
/
[7.2](/docs/7.2/libpq-control.html "PostgreSQL 7.2 - 32.11. Control Functions")
/
[7.1](/docs/7.1/libpq-control.html "PostgreSQL 7.1 - 32.11. Control Functions")

## 32.11. Control Functions [#](#LIBPQ-CONTROL)

These functions control miscellaneous details of libpq's behavior.

`PQclientEncoding` [#](#LIBPQ-PQCLIENTENCODING)
:   Returns the client encoding.

    ```
    int PQclientEncoding(const PGconn *conn);
    ```

    Note that it returns the encoding ID, not a symbolic string such as `EUC_JP`. If unsuccessful, it returns -1. To convert an encoding ID to an encoding name, you can use:

    ```
    char *pg_encoding_to_char(int encoding_id);
    ```

`PQsetClientEncoding` [#](#LIBPQ-PQSETCLIENTENCODING)
:   Sets the client encoding.

    ```
    int PQsetClientEncoding(PGconn *conn, const char *encoding);
    ```

    *`conn`* is a connection to the server, and *`encoding`* is the encoding you want to use. If the function successfully sets the encoding, it returns 0, otherwise -1. The current encoding for this connection can be determined by using [`PQclientEncoding`](libpq-control.html#LIBPQ-PQCLIENTENCODING).

`PQsetErrorVerbosity` [#](#LIBPQ-PQSETERRORVERBOSITY)
:   Determines the verbosity of messages returned by [`PQerrorMessage`](libpq-status.html#LIBPQ-PQERRORMESSAGE) and [`PQresultErrorMessage`](libpq-exec.html#LIBPQ-PQRESULTERRORMESSAGE).

    ```
    typedef enum
    {
        PQERRORS_TERSE,
        PQERRORS_DEFAULT,
        PQERRORS_VERBOSE,
        PQERRORS_SQLSTATE
    } PGVerbosity;

    PGVerbosity PQsetErrorVerbosity(PGconn *conn, PGVerbosity verbosity);
    ```

    [`PQsetErrorVerbosity`](libpq-control.html#LIBPQ-PQSETERRORVERBOSITY) sets the verbosity mode, returning the connection's previous setting. In *TERSE* mode, returned messages include severity, primary text, and position only; this will normally fit on a single line. The *DEFAULT* mode produces messages that include the above plus any detail, hint, or context fields (these might span multiple lines). The *VERBOSE* mode includes all available fields. The *SQLSTATE* mode includes only the error severity and the `SQLSTATE` error code, if one is available (if not, the output is like *TERSE* mode).

    Changing the verbosity setting does not affect the messages available from already-existing `PGresult` objects, only subsequently-created ones. (But see [`PQresultVerboseErrorMessage`](libpq-exec.html#LIBPQ-PQRESULTVERBOSEERRORMESSAGE) if you want to print a previous error with a different verbosity.)

`PQsetErrorContextVisibility` [#](#LIBPQ-PQSETERRORCONTEXTVISIBILITY)
:   Determines the handling of `CONTEXT` fields in messages returned by [`PQerrorMessage`](libpq-status.html#LIBPQ-PQERRORMESSAGE) and [`PQresultErrorMessage`](libpq-exec.html#LIBPQ-PQRESULTERRORMESSAGE).

    ```
    typedef enum
    {
        PQSHOW_CONTEXT_NEVER,
        PQSHOW_CONTEXT_ERRORS,
        PQSHOW_CONTEXT_ALWAYS
    } PGContextVisibility;

    PGContextVisibility PQsetErrorContextVisibility(PGconn *conn, PGContextVisibility show_context);
    ```

    [`PQsetErrorContextVisibility`](libpq-control.html#LIBPQ-PQSETERRORCONTEXTVISIBILITY) sets the context display mode, returning the connection's previous setting. This mode controls whether the `CONTEXT` field is included in messages. The *NEVER* mode never includes `CONTEXT`, while *ALWAYS* always includes it if available. In *ERRORS* mode (the default), `CONTEXT` fields are included only in error messages, not in notices and warnings. (However, if the verbosity setting is *TERSE* or *SQLSTATE*, `CONTEXT` fields are omitted regardless of the context display mode.)

    Changing this mode does not affect the messages available from already-existing `PGresult` objects, only subsequently-created ones. (But see [`PQresultVerboseErrorMessage`](libpq-exec.html#LIBPQ-PQRESULTVERBOSEERRORMESSAGE) if you want to print a previous error with a different display mode.)

`PQtrace` [#](#LIBPQ-PQTRACE)
:   Enables tracing of the client/server communication to a debugging file stream.

    ```
    void PQtrace(PGconn *conn, FILE *stream);
    ```

    Each line consists of: an optional timestamp, a direction indicator (`F` for messages from client to server or `B` for messages from server to client), message length, message type, and message contents. Non-message contents fields (timestamp, direction, length and message type) are separated by a tab. Message contents are separated by a space. Protocol strings are enclosed in double quotes, while strings used as data values are enclosed in single quotes. Non-printable chars are printed as hexadecimal escapes. Further message-type-specific detail can be found in [Section 54.7](protocol-message-formats.html "54.7. Message Formats").

    ### Note

    On Windows, if the libpq library and an application are compiled with different flags, this function call will crash the application because the internal representation of the `FILE` pointers differ. Specifically, multithreaded/single-threaded, release/debug, and static/dynamic flags should be the same for the library and all applications using that library.

`PQsetTraceFlags` [#](#LIBPQ-PQSETTRACEFLAGS)
:   Controls the tracing behavior of client/server communication.

    ```
    void PQsetTraceFlags(PGconn *conn, int flags);
    ```

    `flags` contains flag bits describing the operating mode of tracing. If `flags` contains `PQTRACE_SUPPRESS_TIMESTAMPS`, then the timestamp is not included when printing each message. If `flags` contains `PQTRACE_REGRESS_MODE`, then some fields are redacted when printing each message, such as object OIDs, to make the output more convenient to use in testing frameworks. This function must be called after calling `PQtrace`.

`PQuntrace` [#](#LIBPQ-PQUNTRACE)
:   Disables tracing started by [`PQtrace`](libpq-control.html#LIBPQ-PQTRACE).

    ```
    void PQuntrace(PGconn *conn);
    ```

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/libpq-control.html/)
to report a documentation issue.
