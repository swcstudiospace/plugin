# PostgreSQL: Documentation: 18: 33.3. Client Interfaces

Source: https://www.postgresql.org/docs/current/lo-interfaces.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/lo-interfaces.html "PostgreSQL 18 - 33.3. Client Interfaces")
([18](/docs/18/lo-interfaces.html "PostgreSQL 18 - 33.3. Client Interfaces"))
/
[17](/docs/17/lo-interfaces.html "PostgreSQL 17 - 33.3. Client Interfaces")
/
[16](/docs/16/lo-interfaces.html "PostgreSQL 16 - 33.3. Client Interfaces")
/
[15](/docs/15/lo-interfaces.html "PostgreSQL 15 - 33.3. Client Interfaces")
/
[14](/docs/14/lo-interfaces.html "PostgreSQL 14 - 33.3. Client Interfaces")

Development Versions:
[19](/docs/19/lo-interfaces.html "PostgreSQL 19 - 33.3. Client Interfaces")
/
[devel](/docs/devel/lo-interfaces.html "PostgreSQL devel - 33.3. Client Interfaces")

Unsupported versions:
[13](/docs/13/lo-interfaces.html "PostgreSQL 13 - 33.3. Client Interfaces")
/
[12](/docs/12/lo-interfaces.html "PostgreSQL 12 - 33.3. Client Interfaces")
/
[11](/docs/11/lo-interfaces.html "PostgreSQL 11 - 33.3. Client Interfaces")
/
[10](/docs/10/lo-interfaces.html "PostgreSQL 10 - 33.3. Client Interfaces")
/
[9.6](/docs/9.6/lo-interfaces.html "PostgreSQL 9.6 - 33.3. Client Interfaces")
/
[9.5](/docs/9.5/lo-interfaces.html "PostgreSQL 9.5 - 33.3. Client Interfaces")
/
[9.4](/docs/9.4/lo-interfaces.html "PostgreSQL 9.4 - 33.3. Client Interfaces")
/
[9.3](/docs/9.3/lo-interfaces.html "PostgreSQL 9.3 - 33.3. Client Interfaces")
/
[9.2](/docs/9.2/lo-interfaces.html "PostgreSQL 9.2 - 33.3. Client Interfaces")
/
[9.1](/docs/9.1/lo-interfaces.html "PostgreSQL 9.1 - 33.3. Client Interfaces")
/
[9.0](/docs/9.0/lo-interfaces.html "PostgreSQL 9.0 - 33.3. Client Interfaces")
/
[8.4](/docs/8.4/lo-interfaces.html "PostgreSQL 8.4 - 33.3. Client Interfaces")
/
[8.3](/docs/8.3/lo-interfaces.html "PostgreSQL 8.3 - 33.3. Client Interfaces")
/
[8.2](/docs/8.2/lo-interfaces.html "PostgreSQL 8.2 - 33.3. Client Interfaces")
/
[8.1](/docs/8.1/lo-interfaces.html "PostgreSQL 8.1 - 33.3. Client Interfaces")
/
[8.0](/docs/8.0/lo-interfaces.html "PostgreSQL 8.0 - 33.3. Client Interfaces")
/
[7.4](/docs/7.4/lo-interfaces.html "PostgreSQL 7.4 - 33.3. Client Interfaces")
/
[7.3](/docs/7.3/lo-interfaces.html "PostgreSQL 7.3 - 33.3. Client Interfaces")
/
[7.2](/docs/7.2/lo-interfaces.html "PostgreSQL 7.2 - 33.3. Client Interfaces")
/
[7.1](/docs/7.1/lo-interfaces.html "PostgreSQL 7.1 - 33.3. Client Interfaces")

## 33.3. Client Interfaces [#](#LO-INTERFACES)

[33.3.1. Creating a Large Object](lo-interfaces.html#LO-CREATE)

[33.3.2. Importing a Large Object](lo-interfaces.html#LO-IMPORT)

[33.3.3. Exporting a Large Object](lo-interfaces.html#LO-EXPORT)

[33.3.4. Opening an Existing Large Object](lo-interfaces.html#LO-OPEN)

[33.3.5. Writing Data to a Large Object](lo-interfaces.html#LO-WRITE)

[33.3.6. Reading Data from a Large Object](lo-interfaces.html#LO-READ)

[33.3.7. Seeking in a Large Object](lo-interfaces.html#LO-SEEK)

[33.3.8. Obtaining the Seek Position of a Large Object](lo-interfaces.html#LO-TELL)

[33.3.9. Truncating a Large Object](lo-interfaces.html#LO-TRUNCATE)

[33.3.10. Closing a Large Object Descriptor](lo-interfaces.html#LO-CLOSE)

[33.3.11. Removing a Large Object](lo-interfaces.html#LO-UNLINK)

This section describes the facilities that PostgreSQL's libpq client interface library provides for accessing large objects. The PostgreSQL large object interface is modeled after the Unix file-system interface, with analogues of `open`, `read`, `write`, `lseek`, etc.

All large object manipulation using these functions *must* take place within an SQL transaction block, since large object file descriptors are only valid for the duration of a transaction. Write operations, including `lo_open` with the `INV_WRITE` mode, are not allowed in a read-only transaction.

If an error occurs while executing any one of these functions, the function will return an otherwise-impossible value, typically 0 or -1. A message describing the error is stored in the connection object and can be retrieved with [`PQerrorMessage`](libpq-status.html#LIBPQ-PQERRORMESSAGE) .

Client applications that use these functions should include the header file `libpq/libpq-fs.h` and link with the libpq library.

Client applications cannot use these functions while a libpq connection is in pipeline mode.

### 33.3.1. Creating a Large Object [#](#LO-CREATE)

The function

```
Oid lo_create(PGconn *conn, Oid lobjId);
```

creates a new large object. The OID to be assigned can be specified by *`lobjId`*; if so, failure occurs if that OID is already in use for some large object. If *`lobjId`* is `InvalidOid` (zero) then `lo_create` assigns an unused OID. The return value is the OID that was assigned to the new large object, or `InvalidOid` (zero) on failure.

An example:

```
inv_oid = lo_create(conn, desired_oid);
```

The older function

```
Oid lo_creat(PGconn *conn, int mode);
```

also creates a new large object, always assigning an unused OID. The return value is the OID that was assigned to the new large object, or `InvalidOid` (zero) on failure.

In PostgreSQL releases 8.1 and later, the *`mode`* is ignored, so that `lo_creat` is exactly equivalent to `lo_create` with a zero second argument. However, there is little reason to use `lo_creat` unless you need to work with servers older than 8.1. To work with such an old server, you must use `lo_creat` not `lo_create`, and you must set *`mode`* to one of `INV_READ`, `INV_WRITE`, or `INV_READ` `|` `INV_WRITE`. (These symbolic constants are defined in the header file `libpq/libpq-fs.h`.)

An example:

```
inv_oid = lo_creat(conn, INV_READ|INV_WRITE);
```

### 33.3.2. Importing a Large Object [#](#LO-IMPORT)

To import an operating system file as a large object, call

```
Oid lo_import(PGconn *conn, const char *filename);
```

*`filename`* specifies the operating system name of the file to be imported as a large object. The return value is the OID that was assigned to the new large object, or `InvalidOid` (zero) on failure. Note that the file is read by the client interface library, not by the server; so it must exist in the client file system and be readable by the client application.

The function

```
Oid lo_import_with_oid(PGconn *conn, const char *filename, Oid lobjId);
```

also imports a new large object. The OID to be assigned can be specified by *`lobjId`*; if so, failure occurs if that OID is already in use for some large object. If *`lobjId`* is `InvalidOid` (zero) then `lo_import_with_oid` assigns an unused OID (this is the same behavior as `lo_import`). The return value is the OID that was assigned to the new large object, or `InvalidOid` (zero) on failure.

`lo_import_with_oid` is new as of PostgreSQL 8.4 and uses `lo_create` internally which is new in 8.1; if this function is run against 8.0 or before, it will fail and return `InvalidOid`.

### 33.3.3. Exporting a Large Object [#](#LO-EXPORT)

To export a large object into an operating system file, call

```
int lo_export(PGconn *conn, Oid lobjId, const char *filename);
```

The *`lobjId`* argument specifies the OID of the large object to export and the *`filename`* argument specifies the operating system name of the file. Note that the file is written by the client interface library, not by the server. Returns 1 on success, -1 on failure.

### 33.3.4. Opening an Existing Large Object [#](#LO-OPEN)

To open an existing large object for reading or writing, call

```
int lo_open(PGconn *conn, Oid lobjId, int mode);
```

The *`lobjId`* argument specifies the OID of the large object to open. The *`mode`* bits control whether the object is opened for reading (`INV_READ`), writing (`INV_WRITE`), or both. (These symbolic constants are defined in the header file `libpq/libpq-fs.h`.) `lo_open` returns a (non-negative) large object descriptor for later use in `lo_read`, `lo_write`, `lo_lseek`, `lo_lseek64`, `lo_tell`, `lo_tell64`, `lo_truncate`, `lo_truncate64`, and `lo_close`. The descriptor is only valid for the duration of the current transaction. On failure, -1 is returned.

The server currently does not distinguish between modes `INV_WRITE` and `INV_READ` `|` `INV_WRITE`: you are allowed to read from the descriptor in either case. However there is a significant difference between these modes and `INV_READ` alone: with `INV_READ` you cannot write on the descriptor, and the data read from it will reflect the contents of the large object at the time of the transaction snapshot that was active when `lo_open` was executed, regardless of later writes by this or other transactions. Reading from a descriptor opened with `INV_WRITE` returns data that reflects all writes of other committed transactions as well as writes of the current transaction. This is similar to the behavior of `REPEATABLE READ` versus `READ COMMITTED` transaction modes for ordinary SQL `SELECT` commands.

`lo_open` will fail if `SELECT` privilege is not available for the large object, or if `INV_WRITE` is specified and `UPDATE` privilege is not available. (Prior to PostgreSQL 11, these privilege checks were instead performed at the first actual read or write call using the descriptor.) These privilege checks can be disabled with the [lo\_compat\_privileges](runtime-config-compatible.html#GUC-LO-COMPAT-PRIVILEGES) run-time parameter.

An example:

```
inv_fd = lo_open(conn, inv_oid, INV_READ|INV_WRITE);
```

### 33.3.5. Writing Data to a Large Object [#](#LO-WRITE)

The function

```
int lo_write(PGconn *conn, int fd, const char *buf, size_t len);
```

writes *`len`* bytes from *`buf`* (which must be of size *`len`*) to large object descriptor *`fd`*. The *`fd`* argument must have been returned by a previous `lo_open`. The number of bytes actually written is returned (in the current implementation, this will always equal *`len`* unless there is an error). In the event of an error, the return value is -1.

Although the *`len`* parameter is declared as `size_t`, this function will reject length values larger than `INT_MAX`. In practice, it's best to transfer data in chunks of at most a few megabytes anyway.

### 33.3.6. Reading Data from a Large Object [#](#LO-READ)

The function

```
int lo_read(PGconn *conn, int fd, char *buf, size_t len);
```

reads up to *`len`* bytes from large object descriptor *`fd`* into *`buf`* (which must be of size *`len`*). The *`fd`* argument must have been returned by a previous `lo_open`. The number of bytes actually read is returned; this will be less than *`len`* if the end of the large object is reached first. In the event of an error, the return value is -1.

Although the *`len`* parameter is declared as `size_t`, this function will reject length values larger than `INT_MAX`. In practice, it's best to transfer data in chunks of at most a few megabytes anyway.

### 33.3.7. Seeking in a Large Object [#](#LO-SEEK)

To change the current read or write location associated with a large object descriptor, call

```
int lo_lseek(PGconn *conn, int fd, int offset, int whence);
```

This function moves the current location pointer for the large object descriptor identified by *`fd`* to the new location specified by *`offset`*. The valid values for *`whence`* are `SEEK_SET` (seek from object start), `SEEK_CUR` (seek from current position), and `SEEK_END` (seek from object end). The return value is the new location pointer, or -1 on error.

When dealing with large objects that might exceed 2GB in size, instead use

```
int64_t lo_lseek64(PGconn *conn, int fd, int64_t offset, int whence);
```

This function has the same behavior as `lo_lseek`, but it can accept an *`offset`* larger than 2GB and/or deliver a result larger than 2GB. Note that `lo_lseek` will fail if the new location pointer would be greater than 2GB.

`lo_lseek64` is new as of PostgreSQL 9.3. If this function is run against an older server version, it will fail and return -1.

### 33.3.8. Obtaining the Seek Position of a Large Object [#](#LO-TELL)

To obtain the current read or write location of a large object descriptor, call

```
int lo_tell(PGconn *conn, int fd);
```

If there is an error, the return value is -1.

When dealing with large objects that might exceed 2GB in size, instead use

```
int64_t lo_tell64(PGconn *conn, int fd);
```

This function has the same behavior as `lo_tell`, but it can deliver a result larger than 2GB. Note that `lo_tell` will fail if the current read/write location is greater than 2GB.

`lo_tell64` is new as of PostgreSQL 9.3. If this function is run against an older server version, it will fail and return -1.

### 33.3.9. Truncating a Large Object [#](#LO-TRUNCATE)

To truncate a large object to a given length, call

```
int lo_truncate(PGconn *conn, int fd, size_t len);
```

This function truncates the large object descriptor *`fd`* to length *`len`*. The *`fd`* argument must have been returned by a previous `lo_open`. If *`len`* is greater than the large object's current length, the large object is extended to the specified length with null bytes ('\0'). On success, `lo_truncate` returns zero. On error, the return value is -1.

The read/write location associated with the descriptor *`fd`* is not changed.

Although the *`len`* parameter is declared as `size_t`, `lo_truncate` will reject length values larger than `INT_MAX`.

When dealing with large objects that might exceed 2GB in size, instead use

```
int lo_truncate64(PGconn *conn, int fd, int64_t len);
```

This function has the same behavior as `lo_truncate`, but it can accept a *`len`* value exceeding 2GB.

`lo_truncate` is new as of PostgreSQL 8.3; if this function is run against an older server version, it will fail and return -1.

`lo_truncate64` is new as of PostgreSQL 9.3; if this function is run against an older server version, it will fail and return -1.

### 33.3.10. Closing a Large Object Descriptor [#](#LO-CLOSE)

A large object descriptor can be closed by calling

```
int lo_close(PGconn *conn, int fd);
```

where *`fd`* is a large object descriptor returned by `lo_open`. On success, `lo_close` returns zero. On error, the return value is -1.

Any large object descriptors that remain open at the end of a transaction will be closed automatically.

### 33.3.11. Removing a Large Object [#](#LO-UNLINK)

To remove a large object from the database, call

```
int lo_unlink(PGconn *conn, Oid lobjId);
```

The *`lobjId`* argument specifies the OID of the large object to remove. Returns 1 if successful, -1 on failure.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/lo-interfaces.html/)
to report a documentation issue.
