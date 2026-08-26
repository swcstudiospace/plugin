# SQLite | Node.js v26.5.0 Documentation

Source: https://nodejs.org/api/sqlite.html

## SQLite[#](#sqlite)

**Source Code:** [lib/sqlite.js](https://github.com/nodejs/node/blob/main/lib/sqlite.js)Added in: v22.5.0History

| Version | Changes |
| --- | --- |
| v25.7.0 | SQLite is now a release candidate. |
| v23.4.0, v22.13.0 | SQLite is no longer behind `--experimental-sqlite` but still experimental. |

[Stability: 1.2](documentation.html#stability-index) - Release candidate.

The `node:sqlite` module facilitates working with SQLite databases.
To access it:

```
import sqlite from 'node:sqlite';
const sqlite = require('node:sqlite');

javascriptcopy
```

This module is only available under the `node:` scheme.

The following example shows the basic usage of the `node:sqlite` module to open
an in-memory database, write data to the database, and then read the data back.

```
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync(':memory:');

// Execute SQL statements from strings.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Create a prepared statement to insert data into the database.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Execute the prepared statement with bound values.
insert.run(1, 'hello');
insert.run(2, 'world');
// Create a prepared statement to read data from the database.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Execute the prepared statement and log the result set.
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');

// Execute SQL statements from strings.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Create a prepared statement to insert data into the database.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Execute the prepared statement with bound values.
insert.run(1, 'hello');
insert.run(2, 'world');
// Create a prepared statement to read data from the database.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Execute the prepared statement and log the result set.
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]

javascriptcopy
```

### Type conversion between JavaScript and SQLite[#](#type-conversion-between-javascript-and-sqlite)

When Node.js writes to or reads from SQLite, it is necessary to convert between
JavaScript data types and SQLite's [data types](https://www.sqlite.org/datatype3.html). Because JavaScript supports
more data types than SQLite, only a subset of JavaScript types are supported.
Attempting to write an unsupported data type to SQLite will result in an
exception.

| Storage class | JavaScript to SQLite | SQLite to JavaScript |
| --- | --- | --- |
| `NULL` | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) |
| `INTEGER` | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) or [`<bigint>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#bigint_type) | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) or [`<bigint>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#bigint_type) *(configurable)* |
| `REAL` | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) |
| `TEXT` | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) |
| `BLOB` | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) or [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |

APIs that read values from SQLite have a configuration option that determines
whether `INTEGER` values are converted to `number` or `bigint` in JavaScript,
such as the `readBigInts` option for statements and the `useBigIntArguments`
option for user-defined functions. If Node.js reads an `INTEGER` value from
SQLite that is outside the JavaScript [safe integer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger) range, and the option to
read BigInts is not enabled, then an `ERR_OUT_OF_RANGE` error will be thrown.

### Class: `DatabaseSync`[#](#class-databasesync)

Added in: v22.5.0History

| Version | Changes |
| --- | --- |
| v24.0.0, v22.16.0 | Add `timeout` option. |
| v23.10.0, v22.15.0 | The `path` argument now supports Buffer and URL objects. |

This class represents a single [connection](https://www.sqlite.org/c3ref/sqlite3.html) to a SQLite database. All APIs
exposed by this class execute synchronously.

#### `new DatabaseSync(path[, options])`[#](#new-databasesyncpath-options)

Added in: v22.5.0History

| Version | Changes |
| --- | --- |
| v25.5.0, v24.14.0 | Enable `defensive` by default. |
| v25.1.0, v24.12.0 | Add `defensive` option. |
| v24.4.0, v22.18.0 | Add new SQLite database options. |

- `path` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Buffer>`](buffer.html#class-buffer) | [`<URL>`](url.html#the-whatwg-url-api) The path of the database. A SQLite database can be
  stored in a file or completely [in memory](https://www.sqlite.org/inmemorydb.html). To use a file-backed database,
  the path should be a file path. To use an in-memory database, the path
  should be the special name `':memory:'`.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Configuration options for the database connection. The
  following options are supported:
  - `open` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, the database is opened by the constructor. When
    this value is `false`, the database must be opened via the `open()` method.
    **Default:** `true`.
  - `readOnly` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, the database is opened in read-only mode.
    If the database does not exist, opening it will fail. **Default:** `false`.
  - `enableForeignKeyConstraints` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, foreign key constraints
    are enabled. This is recommended but can be disabled for compatibility with
    legacy database schemas. The enforcement of foreign key constraints can be
    enabled and disabled after opening the database using
    [`PRAGMA foreign_keys`](https://www.sqlite.org/pragma.html#pragma_foreign_keys). **Default:** `true`.
  - `enableDoubleQuotedStringLiterals` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, SQLite will accept
    [double-quoted string literals](https://www.sqlite.org/quirks.html#dblquote). This is not recommended but can be
    enabled for compatibility with legacy database schemas.
    **Default:** `false`.
  - `allowExtension` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, the `loadExtension` SQL function
    and the `loadExtension()` method are enabled.
    You can call `enableLoadExtension(false)` later to disable this feature.
    **Default:** `false`.
  - `timeout` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The [busy timeout](https://sqlite.org/c3ref/busy_timeout.html) in milliseconds. This is the maximum amount of
    time that SQLite will wait for a database lock to be released before
    returning an error. **Default:** `0`.
  - `readBigInts` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, integer fields are read as JavaScript `BigInt` values. If `false`,
    integer fields are read as JavaScript numbers. **Default:** `false`.
  - `returnArrays` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, query results are returned as arrays instead of objects.
    **Default:** `false`.
  - `allowBareNamedParameters` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, allows binding named parameters without the prefix
    character (e.g., `foo` instead of `:foo`). **Default:** `true`.
  - `allowUnknownNamedParameters` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, unknown named parameters are ignored when binding.
    If `false`, an exception is thrown for unknown named parameters. **Default:** `false`.
  - `defensive` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, enables the defensive flag. When the defensive flag is enabled,
    language features that allow ordinary SQL to deliberately corrupt the database file are disabled.
    The defensive flag can also be set using `enableDefensive()`.
    **Default:** `true`.
  - `limits` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Configuration for various SQLite limits. These limits
    can be used to prevent excessive resource consumption when handling
    potentially malicious input. See [Run-Time Limits](https://www.sqlite.org/c3ref/limit.html) and [Limit Constants](https://www.sqlite.org/c3ref/c_limit_attached.html)
    in the SQLite documentation for details. Default values are determined by
    SQLite's compile-time defaults and may vary depending on how SQLite was
    built. The following properties are supported:
    - `length` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum length of a string or BLOB.
    - `sqlLength` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum length of an SQL statement.
    - `column` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of columns.
    - `exprDepth` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum depth of an expression tree.
    - `compoundSelect` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of terms in a compound SELECT.
    - `vdbeOp` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of VDBE instructions.
    - `functionArg` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of function arguments.
    - `attach` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of attached databases.
    - `likePatternLength` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum length of a LIKE pattern.
    - `variableNumber` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of SQL variables.
    - `triggerDepth` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum trigger recursion depth.

Constructs a new `DatabaseSync` instance.

#### `database.aggregate(name, options)`[#](#databaseaggregatename-options)

Added in: v24.0.0, v22.16.0

Registers a new aggregate function with the SQLite database. This method is a wrapper around
[`sqlite3_create_window_function()`](https://www.sqlite.org/c3ref/create_function.html).

- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The name of the SQLite function to create.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Function configuration settings.
  - `deterministic` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, the [`SQLITE_DETERMINISTIC`](https://www.sqlite.org/c3ref/c_deterministic.html) flag is
    set on the created function. **Default:** `false`.
  - `directOnly` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, the [`SQLITE_DIRECTONLY`](https://www.sqlite.org/c3ref/c_deterministic.html) flag is set on
    the created function. **Default:** `false`.
  - `useBigIntArguments` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, integer arguments to `options.step` and `options.inverse`
    are converted to `BigInt`s. If `false`, integer arguments are passed as
    JavaScript numbers. **Default:** `false`.
  - `varargs` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, `options.step` and `options.inverse` may be invoked with any number of
    arguments (between zero and [`SQLITE_MAX_FUNCTION_ARG`](https://www.sqlite.org/limits.html#max_function_arg)). If `false`,
    `inverse` and `step` must be invoked with exactly `length` arguments.
    **Default:** `false`.
  - `start` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) | [`<Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The identity
    value for the aggregation function. This value is used when the aggregation
    function is initialized. When a [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) is passed the identity will be its return value.
  - `step` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The function to call for each row in the aggregation. The
    function receives the current state and the row value. The return value of
    this function should be the new state.
  - `result` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The function to call to get the result of the
    aggregation. The function receives the final state and should return the
    result of the aggregation.
  - `inverse` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) When this function is provided, the `aggregate` method will work as a window function.
    The function receives the current state and the dropped row value. The return value of this function should be the
    new state.

When used as a window function, the `result` function will be called multiple times.

```
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(':memory:');
db.exec(`
  CREATE TABLE t3(x, y);
  INSERT INTO t3 VALUES ('a', 4),
                        ('b', 5),
                        ('c', 3),
                        ('d', 8),
                        ('e', 1);
`);

db.aggregate('sumint', {
  start: 0,
  step: (acc, value) => acc + value,
});

db.prepare('SELECT sumint(y) as total FROM t3').get(); // { total: 21 }
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');
db.exec(`
  CREATE TABLE t3(x, y);
  INSERT INTO t3 VALUES ('a', 4),
                        ('b', 5),
                        ('c', 3),
                        ('d', 8),
                        ('e', 1);
`);

db.aggregate('sumint', {
  start: 0,
  step: (acc, value) => acc + value,
});

db.prepare('SELECT sumint(y) as total FROM t3').get(); // { total: 21 }

javascriptcopy
```

#### `database.close()`[#](#databaseclose)

Added in: v22.5.0

Closes the database connection. An exception is thrown if the database is not
open. This method is a wrapper around [`sqlite3_close_v2()`](https://www.sqlite.org/c3ref/close.html).

#### `database.loadExtension(path[, entryPoint])`[#](#databaseloadextensionpath-entrypoint)

Added in: v23.5.0, v22.13.0

- `path` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The path to the shared library to load.
- `entryPoint` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The name of the extension's entry-point function. When
  omitted, SQLite derives the entry point from the shared library's filename;
  pass this argument explicitly when the derived name does not match.

Loads a shared library into the database connection. This method is a wrapper
around [`sqlite3_load_extension()`](https://www.sqlite.org/c3ref/load_extension.html). It is required to enable the
`allowExtension` option when constructing the `DatabaseSync` instance.

```
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync(':memory:', { allowExtension: true });

// Load using the entry point derived from the filename.
database.loadExtension('./decimal.dylib');

// Override the entry point when the derived name does not match.
database.loadExtension('./base64.dylib', 'sqlite3_base64_init');
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:', { allowExtension: true });

// Load using the entry point derived from the filename.
database.loadExtension('./decimal.dylib');

// Override the entry point when the derived name does not match.
database.loadExtension('./base64.dylib', 'sqlite3_base64_init');

javascriptcopy
```

#### `database.enableLoadExtension(allow)`[#](#databaseenableloadextensionallow)

Added in: v23.5.0, v22.13.0

- `allow` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Whether to allow loading extensions.

Enables or disables the `loadExtension` SQL function, and the `loadExtension()`
method. When `allowExtension` is `false` when constructing, you cannot enable
loading extensions for security reasons.

#### `database.enableDefensive(active)`[#](#databaseenabledefensiveactive)

Added in: v25.1.0, v24.12.0

- `active` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Whether to set the defensive flag.

Enables or disables the defensive flag. When the defensive flag is active,
language features that allow ordinary SQL to deliberately corrupt the database file are disabled.
See [`SQLITE_DBCONFIG_DEFENSIVE`](https://www.sqlite.org/c3ref/c_dbconfig_defensive.html#sqlitedbconfigdefensive) in the SQLite documentation for details.

#### `database.location([dbName])`[#](#databaselocationdbname)

Added in: v24.0.0, v22.16.0

- `dbName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Name of the database. This can be `'main'` (the default primary database) or any other
  database that has been added with [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach.html) **Default:** `'main'`.
- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) The location of the database file. When using an in-memory database,
  this method returns null.

This method is a wrapper around [`sqlite3_db_filename()`](https://sqlite.org/c3ref/db_filename.html)

#### `database.exec(sql)`[#](#databaseexecsql)

Added in: v22.5.0

- `sql` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) A SQL string to execute.

This method allows one or more SQL statements to be executed without returning
any results. This method is useful when executing SQL statements read from a
file. This method is a wrapper around [`sqlite3_exec()`](https://www.sqlite.org/c3ref/exec.html).

#### `database.function(name[, options], fn)`[#](#databasefunctionname-options-fn)

Added in: v23.5.0, v22.13.0

- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The name of the SQLite function to create.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional configuration settings for the function. The
  following properties are supported:
  - `deterministic` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, the [`SQLITE_DETERMINISTIC`](https://www.sqlite.org/c3ref/c_deterministic.html) flag is
    set on the created function. **Default:** `false`.
  - `directOnly` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, the [`SQLITE_DIRECTONLY`](https://www.sqlite.org/c3ref/c_deterministic.html) flag is set on
    the created function. **Default:** `false`.
  - `useBigIntArguments` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, integer arguments to `function`
    are converted to `BigInt`s. If `false`, integer arguments are passed as
    JavaScript numbers. **Default:** `false`.
  - `varargs` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, `function` may be invoked with any number of
    arguments (between zero and [`SQLITE_MAX_FUNCTION_ARG`](https://www.sqlite.org/limits.html#max_function_arg)). If `false`,
    `function` must be invoked with exactly `function.length` arguments.
    **Default:** `false`.
- `fn` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The JavaScript function to call when the SQLite function is
  invoked. The return value of this function should be a valid SQLite data type:
  see [Type conversion between JavaScript and SQLite](#type-conversion-between-javascript-and-sqlite). The result defaults to
  `NULL` if the return value is `undefined`.

This method is used to create SQLite user-defined functions. This method is a
wrapper around [`sqlite3_create_function_v2()`](https://www.sqlite.org/c3ref/create_function.html).

#### `database.setAuthorizer(callback)`[#](#databasesetauthorizercallback)

Added in: v24.10.0

- `callback` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) The authorizer function to set, or `null` to
  clear the current authorizer.

Sets an authorizer callback that SQLite will invoke whenever it attempts to
access data or modify the database schema through prepared statements.
This can be used to implement security policies, audit access, or restrict certain operations.
This method is a wrapper around [`sqlite3_set_authorizer()`](https://sqlite.org/c3ref/set_authorizer.html).

When invoked, the callback receives five arguments:

- `actionCode` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The type of operation being performed (e.g., `SQLITE_INSERT`, `SQLITE_UPDATE`, `SQLITE_SELECT`).
- `arg1` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) The first argument (context-dependent, often a table name).
- `arg2` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) The second argument (context-dependent, often a column name).
- `dbName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) The name of the database.
- `triggerOrView` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) The name of the trigger or view causing the access.

The callback must return one of the following constants:

- `SQLITE_OK` - Allow the operation.
- `SQLITE_DENY` - Deny the operation (causes an error).
- `SQLITE_IGNORE` - Ignore the operation (silently skip).

```
const { DatabaseSync, constants } = require('node:sqlite');
const db = new DatabaseSync(':memory:');

// Set up an authorizer that denies all table creation
db.setAuthorizer((actionCode) => {
  if (actionCode === constants.SQLITE_CREATE_TABLE) {
    return constants.SQLITE_DENY;
  }
  return constants.SQLITE_OK;
});

// This will work
db.prepare('SELECT 1').get();

// This will throw an error due to authorization denial
try {
  db.exec('CREATE TABLE blocked (id INTEGER)');
} catch (err) {
  console.log('Operation blocked:', err.message);
}
import { DatabaseSync, constants } from 'node:sqlite';
const db = new DatabaseSync(':memory:');

// Set up an authorizer that denies all table creation
db.setAuthorizer((actionCode) => {
  if (actionCode === constants.SQLITE_CREATE_TABLE) {
    return constants.SQLITE_DENY;
  }
  return constants.SQLITE_OK;
});

// This will work
db.prepare('SELECT 1').get();

// This will throw an error due to authorization denial
try {
  db.exec('CREATE TABLE blocked (id INTEGER)');
} catch (err) {
  console.log('Operation blocked:', err.message);
}

javascriptcopy
```

#### `database.isOpen`[#](#databaseisopen)

Added in: v23.11.0, v22.15.0

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Whether the database is currently open or not.

#### `database.isTransaction`[#](#databaseistransaction)

Added in: v24.0.0, v22.16.0

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Whether the database is currently within a transaction. This method
  is a wrapper around [`sqlite3_get_autocommit()`](https://sqlite.org/c3ref/get_autocommit.html).

#### `database.limits`[#](#databaselimits)

Added in: v25.8.0

- Type: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

An object for getting and setting SQLite database limits at runtime.
Each property corresponds to an SQLite limit and can be read or written.

```
const db = new DatabaseSync(':memory:');

// Read current limit
console.log(db.limits.length);

// Set a new limit
db.limits.sqlLength = 100000;

// Reset a limit to its compile-time maximum
db.limits.sqlLength = Infinity;

jscopy
```

Available properties: `length`, `sqlLength`, `column`, `exprDepth`,
`compoundSelect`, `vdbeOp`, `functionArg`, `attach`, `likePatternLength`,
`variableNumber`, `triggerDepth`.

Setting a property to `Infinity` resets the limit to its compile-time maximum value.

#### `database.open()`[#](#databaseopen)

Added in: v22.5.0

Opens the database specified in the `path` argument of the `DatabaseSync`
constructor. This method should only be used when the database is not opened via
the constructor. An exception is thrown if the database is already open.

#### `database.serialize([dbName])`[#](#databaseserializedbname)

Added in: v26.1.0

- `dbName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Name of the database to serialize. This can be `'main'`
  (the default primary database) or any other database that has been added with
  [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach.html). **Default:** `'main'`.
- Returns: [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) A binary representation of the database.

Serializes the database into a binary representation, returned as a
`Uint8Array`. This is useful for saving, cloning, or transferring an in-memory
database. This method is a wrapper around [`sqlite3_serialize()`](https://sqlite.org/c3ref/serialize.html).

```
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');
db.exec('CREATE TABLE t(key INTEGER PRIMARY KEY, value TEXT)');
db.exec("INSERT INTO t VALUES (1, 'hello')");
const buffer = db.serialize();
console.log(buffer.length); // Prints the byte length of the database
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(':memory:');
db.exec('CREATE TABLE t(key INTEGER PRIMARY KEY, value TEXT)');
db.exec("INSERT INTO t VALUES (1, 'hello')");
const buffer = db.serialize();
console.log(buffer.length); // Prints the byte length of the database

javascriptcopy
```

#### `database.deserialize(buffer[, options])`[#](#databasedeserializebuffer-options)

Added in: v26.1.0

- `buffer` [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) A binary representation of a database, such as the
  output of [`database.serialize()`](#databaseserializedbname).
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional configuration for the deserialization.
  - `dbName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Name of the database to deserialize into. **Default:** `'main'`.

Loads a serialized database into this connection, replacing the current
database. The deserialized database is writable. Existing prepared statements
are finalized before deserialization is attempted, even if the operation
subsequently fails. This method is a wrapper around
[`sqlite3_deserialize()`](https://sqlite.org/c3ref/deserialize.html).

```
import { DatabaseSync } from 'node:sqlite';

const original = new DatabaseSync(':memory:');
original.exec('CREATE TABLE t(key INTEGER PRIMARY KEY, value TEXT)');
original.exec("INSERT INTO t VALUES (1, 'hello')");
const buffer = original.serialize();
original.close();

const clone = new DatabaseSync(':memory:');
clone.deserialize(buffer);
console.log(clone.prepare('SELECT value FROM t').get());
// Prints: { value: 'hello' }
const { DatabaseSync } = require('node:sqlite');

const original = new DatabaseSync(':memory:');
original.exec('CREATE TABLE t(key INTEGER PRIMARY KEY, value TEXT)');
original.exec("INSERT INTO t VALUES (1, 'hello')");
const buffer = original.serialize();
original.close();

const clone = new DatabaseSync(':memory:');
clone.deserialize(buffer);
console.log(clone.prepare('SELECT value FROM t').get());
// Prints: { value: 'hello' }

javascriptcopy
```

#### `database.prepare(sql[, options])`[#](#databasepreparesql-options)

Added in: v22.5.0

- `sql` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) A SQL string to compile to a prepared statement.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional configuration for the prepared statement.
  - `readBigInts` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, integer fields are read as `BigInt`s.
    **Default:** inherited from database options or `false`.
  - `returnArrays` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, results are returned as arrays.
    **Default:** inherited from database options or `false`.
  - `allowBareNamedParameters` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, allows binding named
    parameters without the prefix character. **Default:** inherited from
    database options or `true`.
  - `allowUnknownNamedParameters` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, unknown named parameters
    are ignored. **Default:** inherited from database options or `false`.
- Returns: [`<StatementSync>`](sqlite.html#class-statementsync) The prepared statement.

Compiles a SQL statement into a [prepared statement](https://www.sqlite.org/c3ref/stmt.html). This method is a wrapper
around [`sqlite3_prepare_v2()`](https://www.sqlite.org/c3ref/prepare.html).

#### `database.createTagStore([maxSize])`[#](#databasecreatetagstoremaxsize)

Added in: v24.9.0

- `maxSize` [`<integer>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The maximum number of prepared statements to cache. **Default:** `1000`.
- Returns: {SQLTagStore} A new SQL tag store for caching prepared statements.

Creates a new [`SQLTagStore`](#class-sqltagstore), which is a Least Recently Used (LRU) cache
for storing prepared statements. This allows for the efficient reuse of
prepared statements by tagging them with a unique identifier.

When a tagged SQL literal is executed, the `SQLTagStore` checks if a prepared
statement for the corresponding SQL query string already exists in the cache.
If it does, the cached statement is used. If not, a new prepared statement is
created, executed, and then stored in the cache for future use. This mechanism
helps to avoid the overhead of repeatedly parsing and preparing the same SQL
statements.

Tagged statements bind the placeholder values from the template literal as
parameters to the underlying prepared statement. For example:

```
sqlTagStore.get`SELECT ${value}`;

jscopy
```

is equivalent to:

```
db.prepare('SELECT ?').get(value);

jscopy
```

However, in the first example, the tag store will cache the underlying prepared
statement for future use.

> **Note:** The `${value}` syntax in tagged statements *binds* a parameter to
> the prepared statement. This differs from its behavior in *untagged* template
> literals, where it performs string interpolation.
>
> ```
> // This a safe example of binding a parameter to a tagged statement.
> sqlTagStore.run`INSERT INTO t1 (id) VALUES (${id})`;
>
> // This is an *unsafe* example of an untagged template string.
> // `id` is interpolated into the query text as a string.
> // This can lead to SQL injection and data corruption.
> db.run(`INSERT INTO t1 (id) VALUES (${id})`);
>
>
> jscopy
> ```

The tag store will match a statement from the cache if the query strings
(including the positions of any bound placeholders) are identical.

```
// The following statements will match in the cache:
sqlTagStore.get`SELECT * FROM t1 WHERE id = ${id} AND active = 1`;
sqlTagStore.get`SELECT * FROM t1 WHERE id = ${12345} AND active = 1`;

// The following statements will not match, as the query strings
// and bound placeholders differ:
sqlTagStore.get`SELECT * FROM t1 WHERE id = ${id} AND active = 1`;
sqlTagStore.get`SELECT * FROM t1 WHERE id = 12345 AND active = 1`;

// The following statements will not match, as matches are case-sensitive:
sqlTagStore.get`SELECT * FROM t1 WHERE id = ${id} AND active = 1`;
sqlTagStore.get`select * from t1 where id = ${id} and active = 1`;

jscopy
```

The only way of binding parameters in tagged statements is with the `${value}`
syntax. Do not add parameter binding placeholders (`?` etc.) to the SQL query
string itself.

```
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');
const sql = db.createTagStore();

db.exec('CREATE TABLE users (id INT, name TEXT)');

// Using the 'run' method to insert data.
// The tagged literal is used to identify the prepared statement.
sql.run`INSERT INTO users VALUES (1, 'Alice')`;
sql.run`INSERT INTO users VALUES (2, 'Bob')`;

// Using the 'get' method to retrieve a single row.
const name = 'Alice';
const user = sql.get`SELECT * FROM users WHERE name = ${name}`;
console.log(user); // { id: 1, name: 'Alice' }

// Using the 'all' method to retrieve all rows.
const allUsers = sql.all`SELECT * FROM users ORDER BY id`;
console.log(allUsers);
// [
//   { id: 1, name: 'Alice' },
//   { id: 2, name: 'Bob' }
// ]
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(':memory:');
const sql = db.createTagStore();

db.exec('CREATE TABLE users (id INT, name TEXT)');

// Using the 'run' method to insert data.
// The tagged literal is used to identify the prepared statement.
sql.run`INSERT INTO users VALUES (1, 'Alice')`;
sql.run`INSERT INTO users VALUES (2, 'Bob')`;

// Using the 'get' method to retrieve a single row.
const name = 'Alice';
const user = sql.get`SELECT * FROM users WHERE name = ${name}`;
console.log(user); // { id: 1, name: 'Alice' }

// Using the 'all' method to retrieve all rows.
const allUsers = sql.all`SELECT * FROM users ORDER BY id`;
console.log(allUsers);
// [
//   { id: 1, name: 'Alice' },
//   { id: 2, name: 'Bob' }
// ]

javascriptcopy
```

#### `database.createSession([options])`[#](#databasecreatesessionoptions)

Added in: v23.3.0, v22.12.0

- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) The configuration options for the session.
  - `table` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) A specific table to track changes for. By default, changes to all tables are tracked.
  - `db` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Name of the database to track. This is useful when multiple databases have been added using [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach.html). **Default**: `'main'`.
- Returns: [`<Session>`](sqlite.html#class-session) A session handle.

Creates and attaches a session to the database. This method is a wrapper around [`sqlite3session_create()`](https://www.sqlite.org/session/sqlite3session_create.html) and [`sqlite3session_attach()`](https://www.sqlite.org/session/sqlite3session_attach.html).

#### `database.applyChangeset(changeset[, options])`[#](#databaseapplychangesetchangeset-options)

Added in: v23.3.0, v22.12.0

- `changeset` [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) A binary changeset or patchset.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) The configuration options for how the changes will be applied.
  - `filter` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) for each table affected by at least
    one change in the changeset, the `filter` callback is invoked with the
    table name as the first argument. If the return value is falsy, then no
    attempt is made to apply any changes to the table.
    Otherwise, if the return value is truthy or no `filter` callback is provided,
    all changes related to the table are attempted.
  - `onConflict` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) A function that determines how to handle conflicts. The function receives one argument,
    which can be one of the following values:

    - `SQLITE_CHANGESET_DATA`: A `DELETE` or `UPDATE` change does not contain the expected "before" values.
    - `SQLITE_CHANGESET_NOTFOUND`: A row matching the primary key of the `DELETE` or `UPDATE` change does not exist.
    - `SQLITE_CHANGESET_CONFLICT`: An `INSERT` change results in a duplicate primary key.
    - `SQLITE_CHANGESET_FOREIGN_KEY`: Applying a change would result in a foreign key violation.
    - `SQLITE_CHANGESET_CONSTRAINT`: Applying a change results in a `UNIQUE`, `CHECK`, or `NOT NULL` constraint
      violation.

    The function should return one of the following values:

    - `SQLITE_CHANGESET_OMIT`: Omit conflicting changes.
    - `SQLITE_CHANGESET_REPLACE`: Replace existing values with conflicting changes (only valid with
      `SQLITE_CHANGESET_DATA` or `SQLITE_CHANGESET_CONFLICT` conflicts).
    - `SQLITE_CHANGESET_ABORT`: Abort on conflict and roll back the database.

    When an error is thrown in the conflict handler or when any other value is returned from the handler,
    applying the changeset is aborted and the database is rolled back.

    **Default**: A function that returns `SQLITE_CHANGESET_ABORT`.
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Whether the changeset was applied successfully without being aborted.

An exception is thrown if the database is not
open. This method is a wrapper around [`sqlite3changeset_apply()`](https://www.sqlite.org/session/sqlite3changeset_apply.html).

```
import { DatabaseSync } from 'node:sqlite';

const sourceDb = new DatabaseSync(':memory:');
const targetDb = new DatabaseSync(':memory:');

sourceDb.exec('CREATE TABLE data(key INTEGER PRIMARY KEY, value TEXT)');
targetDb.exec('CREATE TABLE data(key INTEGER PRIMARY KEY, value TEXT)');

const session = sourceDb.createSession();

const insert = sourceDb.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
insert.run(1, 'hello');
insert.run(2, 'world');

const changeset = session.changeset();
targetDb.applyChangeset(changeset);
// Now that the changeset has been applied, targetDb contains the same data as sourceDb.
const { DatabaseSync } = require('node:sqlite');

const sourceDb = new DatabaseSync(':memory:');
const targetDb = new DatabaseSync(':memory:');

sourceDb.exec('CREATE TABLE data(key INTEGER PRIMARY KEY, value TEXT)');
targetDb.exec('CREATE TABLE data(key INTEGER PRIMARY KEY, value TEXT)');

const session = sourceDb.createSession();

const insert = sourceDb.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
insert.run(1, 'hello');
insert.run(2, 'world');

const changeset = session.changeset();
targetDb.applyChangeset(changeset);
// Now that the changeset has been applied, targetDb contains the same data as sourceDb.

javascriptcopy
```

#### `database[Symbol.dispose]()`[#](#databasesymboldispose)

Added in: v23.11.0, v22.15.0History

| Version | Changes |
| --- | --- |
| v24.2.0 | No longer experimental. |

Closes the database connection. If the database connection is already closed
then this is a no-op.

### Class: `Session`[#](#class-session)

Added in: v23.3.0, v22.12.0

#### `session.changeset()`[#](#sessionchangeset)

Added in: v23.3.0, v22.12.0

- Returns: [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Binary changeset that can be applied to other databases.

Retrieves a changeset containing all changes since the changeset was created. Can be called multiple times.
An exception is thrown if the database or the session is not open. This method is a wrapper around [`sqlite3session_changeset()`](https://www.sqlite.org/session/sqlite3session_changeset.html).

#### `session.patchset()`[#](#sessionpatchset)

Added in: v23.3.0, v22.12.0

- Returns: [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Binary patchset that can be applied to other databases.

Similar to the method above, but generates a more compact patchset. See [Changesets and Patchsets](https://www.sqlite.org/sessionintro.html#changesets_and_patchsets)
in the documentation of SQLite. An exception is thrown if the database or the session is not open. This method is a
wrapper around [`sqlite3session_patchset()`](https://www.sqlite.org/session/sqlite3session_patchset.html).

#### `session.close()`[#](#sessionclose)

Closes the session. An exception is thrown if the database or the session is not open. This method is a
wrapper around [`sqlite3session_delete()`](https://www.sqlite.org/session/sqlite3session_delete.html).

#### `session[Symbol.dispose]()`[#](#sessionsymboldispose)

Added in: v24.9.0

Closes the session. If the session is already closed, does nothing.

### Class: `StatementSync`[#](#class-statementsync)

Added in: v22.5.0

This class represents a single [prepared statement](https://www.sqlite.org/c3ref/stmt.html). This class cannot be
instantiated via its constructor. Instead, instances are created via the
`database.prepare()` method. All APIs exposed by this class execute
synchronously.

A prepared statement is an efficient binary representation of the SQL used to
create it. Prepared statements are parameterizable, and can be invoked multiple
times with different bound values. Parameters also offer protection against
[SQL injection](https://en.wikipedia.org/wiki/SQL_injection) attacks. For these reasons, prepared statements are preferred
over hand-crafted SQL strings when handling user input.

#### `statement.all([namedParameters][, ...anonymousParameters])`[#](#statementallnamedparameters-anonymousparameters)

Added in: v22.5.0History

| Version | Changes |
| --- | --- |
| v23.7.0, v22.14.0 | Add support for `DataView` and typed array objects for `anonymousParameters`. |

- `namedParameters` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) An optional object used to bind named parameters.
  The keys of this object are used to configure the mapping.
- `...anonymousParameters` [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<bigint>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#bigint_type) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Buffer>`](buffer.html#class-buffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) Zero or
  more values to bind to anonymous parameters.
- Returns: [`<Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of objects. Each object corresponds to a row
  returned by executing the prepared statement. The keys and values of each
  object correspond to the column names and values of the row.

This method executes a prepared statement and returns all results as an array of
objects. If the prepared statement does not return any results, this method
returns an empty array. The prepared statement [parameters are bound](https://www.sqlite.org/c3ref/bind_blob.html) using
the values in `namedParameters` and `anonymousParameters`.

#### `statement.columns()`[#](#statementcolumns)

Added in: v23.11.0, v22.16.0

- Returns: [`<Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of objects. Each object corresponds to a column
  in the prepared statement, and contains the following properties:

  - `column` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) The unaliased name of the column in the origin
    table, or `null` if the column is the result of an expression or subquery.
    This property is the result of [`sqlite3_column_origin_name()`](https://www.sqlite.org/c3ref/column_database_name.html).
  - `database` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) The unaliased name of the origin database, or `null` if the column is the result of an expression or subquery. This
    property is the result of [`sqlite3_column_database_name()`](https://www.sqlite.org/c3ref/column_database_name.html).
  - `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The name assigned to the column in the result set of a `SELECT` statement. This property is the result of
    [`sqlite3_column_name()`](https://www.sqlite.org/c3ref/column_name.html).
  - `table` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) The unaliased name of the origin table, or `null` if
    the column is the result of an expression or subquery. This property is the
    result of [`sqlite3_column_table_name()`](https://www.sqlite.org/c3ref/column_database_name.html).
  - `type` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) The declared data type of the column, or `null` if the
    column is the result of an expression or subquery. This property is the
    result of [`sqlite3_column_decltype()`](https://www.sqlite.org/c3ref/column_decltype.html).

This method is used to retrieve information about the columns returned by the
prepared statement.

#### `statement.expandedSQL`[#](#statementexpandedsql)

Added in: v22.5.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The source SQL expanded to include parameter values.

The source SQL text of the prepared statement with parameter
placeholders replaced by the values that were used during the most recent
execution of this prepared statement. This property is a wrapper around
[`sqlite3_expanded_sql()`](https://www.sqlite.org/c3ref/expanded_sql.html).

#### `statement.get([namedParameters][, ...anonymousParameters])`[#](#statementgetnamedparameters-anonymousparameters)

Added in: v22.5.0History

| Version | Changes |
| --- | --- |
| v23.7.0, v22.14.0 | Add support for `DataView` and typed array objects for `anonymousParameters`. |

- `namedParameters` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) An optional object used to bind named parameters.
  The keys of this object are used to configure the mapping.
- `...anonymousParameters` [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<bigint>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#bigint_type) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Buffer>`](buffer.html#class-buffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) Zero or
  more values to bind to anonymous parameters.
- Returns: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`<undefined>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#undefined_type) An object corresponding to the first row returned
  by executing the prepared statement. The keys and values of the object
  correspond to the column names and values of the row. If no rows were returned
  from the database then this method returns `undefined`.

This method executes a prepared statement and returns the first result as an
object. If the prepared statement does not return any results, this method
returns `undefined`. The prepared statement [parameters are bound](https://www.sqlite.org/c3ref/bind_blob.html) using the
values in `namedParameters` and `anonymousParameters`.

#### `statement.iterate([namedParameters][, ...anonymousParameters])`[#](#statementiteratenamedparameters-anonymousparameters)

Added in: v23.4.0, v22.13.0History

| Version | Changes |
| --- | --- |
| v23.7.0, v22.14.0 | Add support for `DataView` and typed array objects for `anonymousParameters`. |

- `namedParameters` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) An optional object used to bind named parameters.
  The keys of this object are used to configure the mapping.
- `...anonymousParameters` [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<bigint>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#bigint_type) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Buffer>`](buffer.html#class-buffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) Zero or
  more values to bind to anonymous parameters.
- Returns: [`<Iterator>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Iterator) An iterable iterator of objects. Each object corresponds to a row
  returned by executing the prepared statement. The keys and values of each
  object correspond to the column names and values of the row.

This method executes a prepared statement and returns an iterator of
objects. If the prepared statement does not return any results, this method
returns an empty iterator. The prepared statement [parameters are bound](https://www.sqlite.org/c3ref/bind_blob.html) using
the values in `namedParameters` and `anonymousParameters`.

#### `statement.run([namedParameters][, ...anonymousParameters])`[#](#statementrunnamedparameters-anonymousparameters)

Added in: v22.5.0History

| Version | Changes |
| --- | --- |
| v23.7.0, v22.14.0 | Add support for `DataView` and typed array objects for `anonymousParameters`. |

- `namedParameters` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) An optional object used to bind named parameters.
  The keys of this object are used to configure the mapping.
- `...anonymousParameters` [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<bigint>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#bigint_type) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Buffer>`](buffer.html#class-buffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) Zero or
  more values to bind to anonymous parameters.
- Returns: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `changes` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<bigint>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#bigint_type) The number of rows modified, inserted, or deleted
    by the most recently completed `INSERT`, `UPDATE`, or `DELETE` statement.
    This field is either a number or a `BigInt` depending on the prepared
    statement's configuration. This property is the result of
    [`sqlite3_changes64()`](https://www.sqlite.org/c3ref/changes.html).
  - `lastInsertRowid` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<bigint>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#bigint_type) The most recently inserted rowid. This
    field is either a number or a `BigInt` depending on the prepared statement's
    configuration. This property is the result of
    [`sqlite3_last_insert_rowid()`](https://www.sqlite.org/c3ref/last_insert_rowid.html).

This method executes a prepared statement and returns an object summarizing the
resulting changes. The prepared statement [parameters are bound](https://www.sqlite.org/c3ref/bind_blob.html) using the
values in `namedParameters` and `anonymousParameters`.

#### `statement.setAllowBareNamedParameters(enabled)`[#](#statementsetallowbarenamedparametersenabled)

Added in: v22.5.0

- `enabled` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Enables or disables support for binding named parameters
  without the prefix character.

The names of SQLite parameters begin with a prefix character. By default,
`node:sqlite` requires that this prefix character is present when binding
parameters. However, with the exception of dollar sign character, these
prefix characters also require extra quoting when used in object keys.

To improve ergonomics, this method can be used to also allow bare named
parameters, which do not require the prefix character in JavaScript code. There
are several caveats to be aware of when enabling bare named parameters:

- The prefix character is still required in SQL.
- The prefix character is still allowed in JavaScript. In fact, prefixed names
  will have slightly better binding performance.
- Using ambiguous named parameters, such as `$k` and `@k`, in the same prepared
  statement will result in an exception as it cannot be determined how to bind
  a bare name.

#### `statement.setAllowUnknownNamedParameters(enabled)`[#](#statementsetallowunknownnamedparametersenabled)

Added in: v23.11.0, v22.15.0

- `enabled` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Enables or disables support for unknown named parameters.

By default, if an unknown name is encountered while binding parameters, an
exception is thrown. This method allows unknown named parameters to be ignored.

#### `statement.setReturnArrays(enabled)`[#](#statementsetreturnarraysenabled)

Added in: v24.0.0, v22.16.0

- `enabled` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Enables or disables the return of query results as arrays.

When enabled, query results returned by the `all()`, `get()`, and `iterate()` methods will be returned as arrays instead
of objects.

#### `statement.setReadBigInts(enabled)`[#](#statementsetreadbigintsenabled)

Added in: v22.5.0

- `enabled` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Enables or disables the use of `BigInt`s when reading
  `INTEGER` fields from the database.

When reading from the database, SQLite `INTEGER`s are mapped to JavaScript
numbers by default. However, SQLite `INTEGER`s can store values larger than
JavaScript numbers are capable of representing. In such cases, this method can
be used to read `INTEGER` data using JavaScript `BigInt`s. This method has no
impact on database write operations where numbers and `BigInt`s are both
supported at all times.

#### `statement.sourceSQL`[#](#statementsourcesql)

Added in: v22.5.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The source SQL used to create this prepared statement.

The source SQL text of the prepared statement. This property is a
wrapper around [`sqlite3_sql()`](https://www.sqlite.org/c3ref/expanded_sql.html).

### Class: `SQLTagStore`[#](#class-sqltagstore)

Added in: v24.9.0

This class represents a single LRU (Least Recently Used) cache for storing
prepared statements.

Instances of this class are created via the [`database.createTagStore()`](#databasecreatetagstoremaxsize)
method, not by using a constructor. The store caches prepared statements based
on the provided SQL query string. When the same query is seen again, the store
retrieves the cached statement and safely applies the new values through
parameter binding, thereby preventing attacks like SQL injection.

The cache has a maxSize that defaults to 1000 statements, but a custom size can
be provided (e.g., `database.createTagStore(100)`). All APIs exposed by this
class execute synchronously.

#### `sqlTagStore.all(stringElements[, ...boundParameters])`[#](#sqltagstoreallstringelements-boundparameters)

Added in: v24.9.0

- `stringElements` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] Template literal elements containing the SQL
  query.
- `...boundParameters` [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<bigint>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#bigint_type) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Buffer>`](buffer.html#class-buffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView)
  Parameter values to be bound to placeholders in the template string.
- Returns: [`<Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of objects representing the rows returned by the query.

Executes the given SQL query and returns all resulting rows as an array of
objects.

This function is intended to be used as a template literal tag, not to be
called directly.

#### `sqlTagStore.get(stringElements[, ...boundParameters])`[#](#sqltagstoregetstringelements-boundparameters)

Added in: v24.9.0

- `stringElements` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] Template literal elements containing the SQL
  query.
- `...boundParameters` [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<bigint>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#bigint_type) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Buffer>`](buffer.html#class-buffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView)
  Parameter values to be bound to placeholders in the template string.
- Returns: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`<undefined>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#undefined_type) An object representing the first row returned by
  the query, or `undefined` if no rows are returned.

Executes the given SQL query and returns the first resulting row as an object.

This function is intended to be used as a template literal tag, not to be
called directly.

#### `sqlTagStore.iterate(stringElements[, ...boundParameters])`[#](#sqltagstoreiteratestringelements-boundparameters)

Added in: v24.9.0

- `stringElements` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] Template literal elements containing the SQL
  query.
- `...boundParameters` [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<bigint>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#bigint_type) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Buffer>`](buffer.html#class-buffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView)
  Parameter values to be bound to placeholders in the template string.
- Returns: [`<Iterator>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Iterator) An iterator that yields objects representing the rows returned by the query.

Executes the given SQL query and returns an iterator over the resulting rows.

This function is intended to be used as a template literal tag, not to be
called directly.

#### `sqlTagStore.run(stringElements[, ...boundParameters])`[#](#sqltagstorerunstringelements-boundparameters)

Added in: v24.9.0

- `stringElements` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] Template literal elements containing the SQL
  query.
- `...boundParameters` [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<bigint>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#bigint_type) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Buffer>`](buffer.html#class-buffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView)
  Parameter values to be bound to placeholders in the template string.
- Returns: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) An object containing information about the execution, including `changes` and `lastInsertRowid`.

Executes the given SQL query, which is expected to not return any rows (e.g., INSERT, UPDATE, DELETE).

This function is intended to be used as a template literal tag, not to be
called directly.

#### `sqlTagStore.size`[#](#sqltagstoresize)

Added in: v24.9.0History

| Version | Changes |
| --- | --- |
| v25.5.0, v24.13.1 | Changed from a method to a getter. |

- Type: [`<integer>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

A read-only property that returns the number of prepared statements currently in the cache.

#### `sqlTagStore.capacity`[#](#sqltagstorecapacity)

Added in: v24.9.0

- Type: [`<integer>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

A read-only property that returns the maximum number of prepared statements the cache can hold.

#### `sqlTagStore.db`[#](#sqltagstoredb)

Added in: v24.9.0

- Type: [`<DatabaseSync>`](sqlite.html#class-databasesync)

A read-only property that returns the `DatabaseSync` object associated with this `SQLTagStore`.

#### `sqlTagStore.clear()`[#](#sqltagstoreclear)

Added in: v24.9.0

Resets the LRU cache, clearing all stored prepared statements.

### `sqlite.backup(sourceDb, path[, options])`[#](#sqlitebackupsourcedb-path-options)

Added in: v23.8.0, v22.16.0History

| Version | Changes |
| --- | --- |
| v23.10.0 | The `path` argument now supports Buffer and URL objects. |

- `sourceDb` [`<DatabaseSync>`](sqlite.html#class-databasesync) The database to backup. The source database must be open.
- `path` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Buffer>`](buffer.html#class-buffer) | [`<URL>`](url.html#the-whatwg-url-api) The path where the backup will be created. If the file already exists,
  the contents will be overwritten.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional configuration for the backup. The
  following properties are supported:
  - `source` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Name of the source database. This can be `'main'` (the default primary database) or any other
    database that have been added with [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach.html) **Default:** `'main'`.
  - `target` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Name of the target database. This can be `'main'` (the default primary database) or any other
    database that have been added with [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach.html) **Default:** `'main'`.
  - `rate` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Number of pages to be transmitted in each batch of the backup. **Default:** `100`.
  - `progress` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) An optional callback function that will be called after each backup step. The argument passed
    to this callback is an [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) with `remainingPages` and `totalPages` properties, describing the current progress
    of the backup operation.
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) A promise that fulfills with the total number of backed-up pages upon completion, or rejects if an
  error occurs.

This method makes a database backup. This method abstracts the [`sqlite3_backup_init()`](https://www.sqlite.org/c3ref/backup_finish.html#sqlite3backupinit), [`sqlite3_backup_step()`](https://www.sqlite.org/c3ref/backup_finish.html#sqlite3backupstep)
and [`sqlite3_backup_finish()`](https://www.sqlite.org/c3ref/backup_finish.html#sqlite3backupfinish) functions.

The backed-up database can be used normally during the backup process. Mutations coming from the same connection - same
[`<DatabaseSync>`](sqlite.html#class-databasesync) - object will be reflected in the backup right away. However, mutations from other connections will cause
the backup process to restart.

```
const { backup, DatabaseSync } = require('node:sqlite');

(async () => {
  const sourceDb = new DatabaseSync('source.db');
  const totalPagesTransferred = await backup(sourceDb, 'backup.db', {
    rate: 1, // Copy one page at a time.
    progress: ({ totalPages, remainingPages }) => {
      console.log('Backup in progress', { totalPages, remainingPages });
    },
  });

  console.log('Backup completed', totalPagesTransferred);
})();
import { backup, DatabaseSync } from 'node:sqlite';

const sourceDb = new DatabaseSync('source.db');
const totalPagesTransferred = await backup(sourceDb, 'backup.db', {
  rate: 1, // Copy one page at a time.
  progress: ({ totalPages, remainingPages }) => {
    console.log('Backup in progress', { totalPages, remainingPages });
  },
});

console.log('Backup completed', totalPagesTransferred);

javascriptcopy
```

### `sqlite.constants`[#](#sqliteconstants)

Added in: v23.5.0, v22.13.0

- Type: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

An object containing commonly used constants for SQLite operations.

#### SQLite constants[#](#sqlite-constants)

The following constants are exported by the `sqlite.constants` object.

##### Conflict resolution constants[#](#conflict-resolution-constants)

One of the following constants is available as an argument to the `onConflict`
conflict resolution handler passed to [`database.applyChangeset()`](#databaseapplychangesetchangeset-options). See also
[Constants Passed To The Conflict Handler](https://www.sqlite.org/session/c_changeset_conflict.html) in the SQLite documentation.

| Constant | Description |
| --- | --- |
| `SQLITE_CHANGESET_DATA` | The conflict handler is invoked with this constant when processing a DELETE or UPDATE change if a row with the required PRIMARY KEY fields is present in the database, but one or more other (non primary-key) fields modified by the update do not contain the expected "before" values. |
| `SQLITE_CHANGESET_NOTFOUND` | The conflict handler is invoked with this constant when processing a DELETE or UPDATE change if a row with the required PRIMARY KEY fields is not present in the database. |
| `SQLITE_CHANGESET_CONFLICT` | This constant is passed to the conflict handler while processing an INSERT change if the operation would result in duplicate primary key values. |
| `SQLITE_CHANGESET_CONSTRAINT` | If foreign key handling is enabled, and applying a changeset leaves the database in a state containing foreign key violations, the conflict handler is invoked with this constant exactly once before the changeset is committed. If the conflict handler returns `SQLITE_CHANGESET_OMIT`, the changes, including those that caused the foreign key constraint violation, are committed. Or, if it returns `SQLITE_CHANGESET_ABORT`, the changeset is rolled back. |
| `SQLITE_CHANGESET_FOREIGN_KEY` | If any other constraint violation occurs while applying a change (i.e. a UNIQUE, CHECK or NOT NULL constraint), the conflict handler is invoked with this constant. |

One of the following constants must be returned from the `onConflict` conflict
resolution handler passed to [`database.applyChangeset()`](#databaseapplychangesetchangeset-options). See also
[Constants Returned From The Conflict Handler](https://www.sqlite.org/session/c_changeset_abort.html) in the SQLite documentation.

| Constant | Description |
| --- | --- |
| `SQLITE_CHANGESET_OMIT` | Conflicting changes are omitted. |
| `SQLITE_CHANGESET_REPLACE` | Conflicting changes replace existing values. Note that this value can only be returned when the type of conflict is either `SQLITE_CHANGESET_DATA` or `SQLITE_CHANGESET_CONFLICT`. |
| `SQLITE_CHANGESET_ABORT` | Abort when a change encounters a conflict and roll back database. |

##### Authorization constants[#](#authorization-constants)

The following constants are used with the [`database.setAuthorizer()`](#databasesetauthorizercallback) method.

###### Authorization result codes[#](#authorization-result-codes)

One of the following constants must be returned from the authorizer callback
function passed to [`database.setAuthorizer()`](#databasesetauthorizercallback).

| Constant | Description |
| --- | --- |
| `SQLITE_OK` | Allow the operation to proceed normally. |
| `SQLITE_DENY` | Deny the operation and cause an error to be returned. |
| `SQLITE_IGNORE` | Ignore the operation and continue as if it had never been requested. |

###### Authorization action codes[#](#authorization-action-codes)

The following constants are passed as the first argument to the authorizer
callback function to indicate what type of operation is being authorized.

| Constant | Description |
| --- | --- |
| `SQLITE_CREATE_INDEX` | Create an index |
| `SQLITE_CREATE_TABLE` | Create a table |
| `SQLITE_CREATE_TEMP_INDEX` | Create a temporary index |
| `SQLITE_CREATE_TEMP_TABLE` | Create a temporary table |
| `SQLITE_CREATE_TEMP_TRIGGER` | Create a temporary trigger |
| `SQLITE_CREATE_TEMP_VIEW` | Create a temporary view |
| `SQLITE_CREATE_TRIGGER` | Create a trigger |
| `SQLITE_CREATE_VIEW` | Create a view |
| `SQLITE_DELETE` | Delete from a table |
| `SQLITE_DROP_INDEX` | Drop an index |
| `SQLITE_DROP_TABLE` | Drop a table |
| `SQLITE_DROP_TEMP_INDEX` | Drop a temporary index |
| `SQLITE_DROP_TEMP_TABLE` | Drop a temporary table |
| `SQLITE_DROP_TEMP_TRIGGER` | Drop a temporary trigger |
| `SQLITE_DROP_TEMP_VIEW` | Drop a temporary view |
| `SQLITE_DROP_TRIGGER` | Drop a trigger |
| `SQLITE_DROP_VIEW` | Drop a view |
| `SQLITE_INSERT` | Insert into a table |
| `SQLITE_PRAGMA` | Execute a PRAGMA statement |
| `SQLITE_READ` | Read from a table |
| `SQLITE_SELECT` | Execute a SELECT statement |
| `SQLITE_TRANSACTION` | Begin, commit, or rollback a transaction |
| `SQLITE_UPDATE` | Update a table |
| `SQLITE_ATTACH` | Attach a database |
| `SQLITE_DETACH` | Detach a database |
| `SQLITE_ALTER_TABLE` | Alter a table |
| `SQLITE_REINDEX` | Reindex |
| `SQLITE_ANALYZE` | Analyze the database |
| `SQLITE_CREATE_VTABLE` | Create a virtual table |
| `SQLITE_DROP_VTABLE` | Drop a virtual table |
| `SQLITE_FUNCTION` | Use a function |
| `SQLITE_SAVEPOINT` | Create, release, or rollback a savepoint |
| `SQLITE_COPY` | Copy data (legacy) |
| `SQLITE_RECURSIVE` | Recursive query |
