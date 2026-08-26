# Util | Node.js v26.5.0 Documentation

Source: https://nodejs.org/api/util.html

## Util[#](#util)

**Source Code:** [lib/util.js](https://github.com/nodejs/node/blob/main/lib/util.js)

[Stability: 2](documentation.html#stability-index) - Stable

The `node:util` module supports the needs of Node.js internal APIs. Many of the
utilities are useful for application and module developers as well. To access
it:

```
import util from 'node:util';
const util = require('node:util');

javascriptcopy
```

### `util.callbackify(original)`[#](#utilcallbackifyoriginal)

Added in: v8.2.0

- `original` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) An `async` function
- Returns: [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) a callback style function

Takes an `async` function (or a function that returns a `Promise`) and returns a
function following the error-first callback style, i.e. taking
an `(err, value) => ...` callback as the last argument. In the callback, the
first argument will be the rejection reason (or `null` if the `Promise`
resolved), and the second argument will be the resolved value.

```
import { callbackify } from 'node:util';

async function fn() {
  return 'hello world';
}
const callbackFunction = callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
const { callbackify } = require('node:util');

async function fn() {
  return 'hello world';
}
const callbackFunction = callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});

javascriptcopy
```

Will print:

```
hello world

textcopy
```

The callback is executed asynchronously, and will have a limited stack trace.
If the callback throws, the process will emit an [`'uncaughtException'`](process.html#event-uncaughtexception)
event, and if not handled will exit.

Since `null` has a special meaning as the first argument to a callback, if a
wrapped function rejects a `Promise` with a falsy value as a reason, the value
is wrapped in an `Error` with the original value stored in a field named
`reason`.

```
import util from 'node:util';

function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // When the Promise was rejected with `null` it is wrapped with an Error and
  // the original value is stored in `reason`.
  err && Object.hasOwn(err, 'reason') && err.reason === null;  // true
});
const util = require('node:util');

function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // When the Promise was rejected with `null` it is wrapped with an Error and
  // the original value is stored in `reason`.
  err && Object.hasOwn(err, 'reason') && err.reason === null;  // true
});

javascriptcopy
```

### `util.convertProcessSignalToExitCode(signal)`[#](#utilconvertprocesssignaltoexitcodesignal)

Added in: v25.4.0, v24.14.0

- `signal` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) A signal name (e.g. `'SIGTERM'`)
- Returns: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The exit code corresponding to `signal`

The `util.convertProcessSignalToExitCode()` method converts a signal name to its
corresponding POSIX exit code. Following the POSIX standard, the exit code
for a process terminated by a signal is calculated as `128 + signal number`.

If `signal` is not a valid signal name, then an error will be thrown. See
[`signal(7)`](https://man7.org/linux/man-pages/man7/signal.7.html) for a list of valid signals.

```
import { convertProcessSignalToExitCode } from 'node:util';

console.log(convertProcessSignalToExitCode('SIGTERM')); // 143 (128 + 15)
console.log(convertProcessSignalToExitCode('SIGKILL')); // 137 (128 + 9)
const { convertProcessSignalToExitCode } = require('node:util');

console.log(convertProcessSignalToExitCode('SIGTERM')); // 143 (128 + 15)
console.log(convertProcessSignalToExitCode('SIGKILL')); // 137 (128 + 9)

javascriptcopy
```

This is particularly useful when working with processes to determine
the exit code based on the signal that terminated the process.

### `util.debuglog(section[, callback])`[#](#utildebuglogsection-callback)

Added in: v0.11.3

- `section` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) A string identifying the portion of the application for
  which the `debuglog` function is being created.
- `callback` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) A callback invoked the first time the logging function
  is called with a function argument that is a more optimized logging function.
- Returns: [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The logging function

The `util.debuglog()` method is used to create a function that conditionally
writes debug messages to `stderr` based on the existence of the `NODE_DEBUG`
environment variable. If the `section` name appears within the value of that
environment variable, then the returned function operates similar to
[`console.error()`](console.html#consoleerrordata-args). If not, then the returned function is a no-op.

```
import { debuglog } from 'node:util';
const log = debuglog('foo');

log('hello from foo [%d]', 123);
const { debuglog } = require('node:util');
const log = debuglog('foo');

log('hello from foo [%d]', 123);

javascriptcopy
```

If this program is run with `NODE_DEBUG=foo` in the environment, then
it will output something like:

```
FOO 3245: hello from foo [123]

consolecopy
```

where `3245` is the process id. If it is not run with that
environment variable set, then it will not print anything.

The `section` supports wildcard also:

```
import { debuglog } from 'node:util';
const log = debuglog('foo-bar');

log('hi there, it\'s foo-bar [%d]', 2333);
const { debuglog } = require('node:util');
const log = debuglog('foo-bar');

log('hi there, it\'s foo-bar [%d]', 2333);

javascriptcopy
```

if it is run with `NODE_DEBUG=foo*` in the environment, then it will output
something like:

```
FOO-BAR 3257: hi there, it's foo-bar [2333]

consolecopy
```

Multiple comma-separated `section` names may be specified in the `NODE_DEBUG`
environment variable: `NODE_DEBUG=fs,net,tls`.

The optional `callback` argument can be used to replace the logging function
with a different function that doesn't have any initialization or
unnecessary wrapping.

```
import { debuglog } from 'node:util';
let log = debuglog('internals', (debug) => {
  // Replace with a logging function that optimizes out
  // testing if the section is enabled
  log = debug;
});
const { debuglog } = require('node:util');
let log = debuglog('internals', (debug) => {
  // Replace with a logging function that optimizes out
  // testing if the section is enabled
  log = debug;
});

javascriptcopy
```

#### `debuglog().enabled`[#](#debuglogenabled)

Added in: v14.9.0

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

The `util.debuglog().enabled` getter is used to create a test that can be used
in conditionals based on the existence of the `NODE_DEBUG` environment variable.
If the `section` name appears within the value of that environment variable,
then the returned value will be `true`. If not, then the returned value will be
`false`.

```
import { debuglog } from 'node:util';
const enabled = debuglog('foo').enabled;
if (enabled) {
  console.log('hello from foo [%d]', 123);
}
const { debuglog } = require('node:util');
const enabled = debuglog('foo').enabled;
if (enabled) {
  console.log('hello from foo [%d]', 123);
}

javascriptcopy
```

If this program is run with `NODE_DEBUG=foo` in the environment, then it will
output something like:

```
hello from foo [123]

consolecopy
```

### `util.debug(section)`[#](#utildebugsection)

Added in: v14.9.0

Alias for `util.debuglog`. Usage allows for readability of that doesn't imply
logging when only using `util.debuglog().enabled`.

### `util.deprecate(fn, msg[, code[, options]])`[#](#utildeprecatefn-msg-code-options)

Added in: v0.8.0History

| Version | Changes |
| --- | --- |
| v25.2.0, v24.12.0 | Add options object with modifyPrototype to conditionally modify the prototype of the deprecated object. |
| v10.0.0 | Deprecation warnings are only emitted once for each code. |

- `fn` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The function that is being deprecated.
- `msg` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) A warning message to display when the deprecated function is
  invoked.
- `code` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) A deprecation code. See the [list of deprecated APIs](deprecations.html#list-of-deprecated-apis) for a
  list of codes.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `modifyPrototype` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) When false do not change the prototype of object
    while emitting the deprecation warning. **Default:** `true`.
- Returns: [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The deprecated function wrapped to emit a warning.

The `util.deprecate()` method wraps `fn` (which may be a function or class) in
such a way that it is marked as deprecated.

```
import { deprecate } from 'node:util';

export const obsoleteFunction = deprecate(() => {
  // Do something here.
}, 'obsoleteFunction() is deprecated. Use newShinyFunction() instead.');
const { deprecate } = require('node:util');

exports.obsoleteFunction = deprecate(() => {
  // Do something here.
}, 'obsoleteFunction() is deprecated. Use newShinyFunction() instead.');

javascriptcopy
```

When called, `util.deprecate()` will return a function that will emit a
`DeprecationWarning` using the [`'warning'`](process.html#event-warning) event. The warning will
be emitted and printed to `stderr` the first time the returned function is
called. After the warning is emitted, the wrapped function is called without
emitting a warning.

If the same optional `code` is supplied in multiple calls to `util.deprecate()`,
the warning will be emitted only once for that `code`.

```
import { deprecate } from 'node:util';

const fn1 = deprecate(
  () => 'a value',
  'deprecation message',
  'DEP0001',
);
const fn2 = deprecate(
  () => 'a  different value',
  'other dep message',
  'DEP0001',
);
fn1(); // Emits a deprecation warning with code DEP0001
fn2(); // Does not emit a deprecation warning because it has the same code
const { deprecate } = require('node:util');

const fn1 = deprecate(
  function() {
    return 'a value';
  },
  'deprecation message',
  'DEP0001',
);
const fn2 = deprecate(
  function() {
    return 'a  different value';
  },
  'other dep message',
  'DEP0001',
);
fn1(); // Emits a deprecation warning with code DEP0001
fn2(); // Does not emit a deprecation warning because it has the same code

javascriptcopy
```

If either the `--no-deprecation` or `--no-warnings` command-line flags are
used, or if the `process.noDeprecation` property is set to `true` *prior* to
the first deprecation warning, the `util.deprecate()` method does nothing.

If the `--trace-deprecation` or `--trace-warnings` command-line flags are set,
or the `process.traceDeprecation` property is set to `true`, a warning and a
stack trace are printed to `stderr` the first time the deprecated function is
called.

If the `--throw-deprecation` command-line flag is set, or the
`process.throwDeprecation` property is set to `true`, then an exception will be
thrown when the deprecated function is called.

The `--throw-deprecation` command-line flag and `process.throwDeprecation`
property take precedence over `--trace-deprecation` and
`process.traceDeprecation`.

### `util.diff(actual, expected)`[#](#utildiffactual-expected)

Added in: v23.11.0, v22.15.0

Stability: 1 - Experimental

- `actual` [`<Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The first value to compare
- `expected` [`<Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The second value to compare
- Returns: [`<Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of difference entries. Each entry is an array with two elements:

  - `0` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Operation code: `-1` for delete, `0` for no-op/unchanged, `1` for insert
  - `1` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The value associated with the operation
- Algorithm complexity: O(N\*D), where:
- N is the total length of the two sequences combined (N = actual.length + expected.length)
- D is the edit distance (the minimum number of operations required to transform one sequence into the other).

[`util.diff()`](#utildiffactual-expected) compares two string or array values and returns an array of difference entries.
It uses the Myers diff algorithm to compute minimal differences, which is the same algorithm
used internally by assertion error messages.

If the values are equal, an empty array is returned.

```
const { diff } = require('node:util');

// Comparing strings
const actualString = '12345678';
const expectedString = '12!!5!7!';
console.log(diff(actualString, expectedString));
// [
//   [0, '1'],
//   [0, '2'],
//   [1, '3'],
//   [1, '4'],
//   [-1, '!'],
//   [-1, '!'],
//   [0, '5'],
//   [1, '6'],
//   [-1, '!'],
//   [0, '7'],
//   [1, '8'],
//   [-1, '!'],
// ]
// Comparing arrays
const actualArray = ['1', '2', '3'];
const expectedArray = ['1', '3', '4'];
console.log(diff(actualArray, expectedArray));
// [
//   [0, '1'],
//   [1, '2'],
//   [0, '3'],
//   [-1, '4'],
// ]
// Equal values return empty array
console.log(diff('same', 'same'));
// []

jscopy
```

### `util.format(format[, ...args])`[#](#utilformatformat-args)

Added in: v0.5.3History

| Version | Changes |
| --- | --- |
| v12.11.0 | The `%c` specifier is ignored now. |
| v12.0.0 | The `format` argument is now only taken as such if it actually contains format specifiers. |
| v12.0.0 | If the `format` argument is not a format string, the output string's formatting is no longer dependent on the type of the first argument. This change removes previously present quotes from strings that were being output when the first argument was not a string. |
| v11.4.0 | The `%d`, `%f`, and `%i` specifiers now support Symbols properly. |
| v11.4.0 | The `%o` specifier's `depth` has default depth of 4 again. |
| v11.0.0 | The `%o` specifier's `depth` option will now fall back to the default depth. |
| v10.12.0 | The `%d` and `%i` specifiers now support BigInt. |
| v8.4.0 | The `%o` and `%O` specifiers are supported now. |

- `format` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) A `printf`-like format string.

The `util.format()` method returns a formatted string using the first argument
as a `printf`-like format string which can contain zero or more format
specifiers. Each specifier is replaced with the converted value from the
corresponding argument. Supported specifiers are:

- `%s`: `String` will be used to convert all values except `BigInt`, `Object`
  and `-0`. `BigInt` values will be represented with an `n` and Objects that
  have neither a user defined `toString` function nor `Symbol.toPrimitive` function are inspected using `util.inspect()`
  with options `{ depth: 0, colors: false, compact: 3 }`.
- `%d`: `Number` will be used to convert all values except `BigInt` and
  `Symbol`.
- `%i`: `parseInt(value, 10)` is used for all values except `BigInt` and
  `Symbol`.
- `%f`: `parseFloat(value)` is used for all values except `Symbol`.
- `%j`: JSON. Replaced with the string `'[Circular]'` if the argument contains
  circular references.
- `%o`: `Object`. A string representation of an object with generic JavaScript
  object formatting. Similar to `util.inspect()` with options
  `{ showHidden: true, showProxy: true }`. This will show the full object
  including non-enumerable properties and proxies.
- `%O`: `Object`. A string representation of an object with generic JavaScript
  object formatting. Similar to `util.inspect()` without options. This will show
  the full object not including non-enumerable properties and proxies.
- `%c`: `CSS`. This specifier is ignored and will skip any CSS passed in.
- `%%`: single percent sign (`'%'`). This does not consume an argument.
- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The formatted string

If a specifier does not have a corresponding argument, it is not replaced:

```
util.format('%s:%s', 'foo');
// Returns: 'foo:%s'

jscopy
```

Values that are not part of the format string are formatted using
`util.inspect()` if their type is not `string`.

If there are more arguments passed to the `util.format()` method than the
number of specifiers, the extra arguments are concatenated to the returned
string, separated by spaces:

```
util.format('%s:%s', 'foo', 'bar', 'baz');
// Returns: 'foo:bar baz'

jscopy
```

If the first argument does not contain a valid format specifier, `util.format()`
returns a string that is the concatenation of all arguments separated by spaces:

```
util.format(1, 2, 3);
// Returns: '1 2 3'

jscopy
```

If only one argument is passed to `util.format()`, it is returned as it is
without any formatting:

```
util.format('%% %s');
// Returns: '%% %s'

jscopy
```

`util.format()` is a synchronous method that is intended as a debugging tool.
Some input values can have a significant performance overhead that can block the
event loop. Use this function with care and never in a hot code path.

### `util.formatWithOptions(inspectOptions, format[, ...args])`[#](#utilformatwithoptionsinspectoptions-format-args)

Added in: v10.0.0

- `inspectOptions` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `format` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

This function is identical to [`util.format()`](#utilformatformat-args), except in that it takes
an `inspectOptions` argument which specifies options that are passed along to
[`util.inspect()`](#utilinspectobject-options).

```
util.formatWithOptions({ colors: true }, 'See object %O', { foo: 42 });
// Returns 'See object { foo: 42 }', where `42` is colored as a number
// when printed to a terminal.

jscopy
```

### `util.getCallSites([frameCount][, options])`[#](#utilgetcallsitesframecount-options)

Added in: v22.9.0History

| Version | Changes |
| --- | --- |
| v23.7.0, v22.14.0 | Property `column` is deprecated in favor of `columnNumber`. |
| v23.7.0, v22.14.0 | Property `CallSite.scriptId` is exposed. |
| v23.3.0, v22.12.0 | The API is renamed from `util.getCallSite` to `util.getCallSites()`. |

Stability: 1.1 - Active development

- `frameCount` [`<integer>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Optional number of frames to capture as call site objects. **Default:** `10`. Allowable range is between 1 and 200.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional
  - `sourceMap` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Reconstruct the original location in the stacktrace from the source-map.
    Enabled by default with the flag `--enable-source-maps`.
- Returns: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)[] An array of call site objects
  - `functionName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Returns the name of the function associated with this call site.
  - `scriptName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Returns the name of the resource that contains the script for the
    function for this call site.
  - `scriptId` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Returns the unique id of the script, as in Chrome DevTools protocol [`Runtime.ScriptId`](https://chromedevtools.github.io/devtools-protocol/1-3/Runtime/#type-ScriptId).
  - `lineNumber` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Returns the JavaScript script line number (1-based).
  - `columnNumber` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Returns the JavaScript script column number (1-based).

Returns an array of call site objects containing the stack of
the caller function.

Unlike accessing an `error.stack`, the result returned from this API is not
interfered with `Error.prepareStackTrace`.

```
import { getCallSites } from 'node:util';

function exampleFunction() {
  const callSites = getCallSites();

  console.log('Call Sites:');
  callSites.forEach((callSite, index) => {
    console.log(`CallSite ${index + 1}:`);
    console.log(`Function Name: ${callSite.functionName}`);
    console.log(`Script Name: ${callSite.scriptName}`);
    console.log(`Line Number: ${callSite.lineNumber}`);
    console.log(`Column Number: ${callSite.columnNumber}`);
  });
  // CallSite 1:
  // Function Name: exampleFunction
  // Script Name: /home/example.js
  // Line Number: 5
  // Column Number: 26

  // CallSite 2:
  // Function Name: anotherFunction
  // Script Name: /home/example.js
  // Line Number: 22
  // Column Number: 3

  // ...
}

// A function to simulate another stack layer
function anotherFunction() {
  exampleFunction();
}

anotherFunction();
const { getCallSites } = require('node:util');

function exampleFunction() {
  const callSites = getCallSites();

  console.log('Call Sites:');
  callSites.forEach((callSite, index) => {
    console.log(`CallSite ${index + 1}:`);
    console.log(`Function Name: ${callSite.functionName}`);
    console.log(`Script Name: ${callSite.scriptName}`);
    console.log(`Line Number: ${callSite.lineNumber}`);
    console.log(`Column Number: ${callSite.columnNumber}`);
  });
  // CallSite 1:
  // Function Name: exampleFunction
  // Script Name: /home/example.js
  // Line Number: 5
  // Column Number: 26

  // CallSite 2:
  // Function Name: anotherFunction
  // Script Name: /home/example.js
  // Line Number: 22
  // Column Number: 3

  // ...
}

// A function to simulate another stack layer
function anotherFunction() {
  exampleFunction();
}

anotherFunction();

javascriptcopy
```

It is possible to reconstruct the original locations by setting the option `sourceMap` to `true`.
If the source map is not available, the original location will be the same as the current location.
When the `--enable-source-maps` flag is enabled,`sourceMap` will be true by default.

```
import { getCallSites } from 'node:util';

interface Foo {
  foo: string;
}

const callSites = getCallSites({ sourceMap: true });

// With sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 7
// Column Number: 26

// Without sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 2
// Column Number: 26

tscopy
```

```
const { getCallSites } = require('node:util');

const callSites = getCallSites({ sourceMap: true });

// With sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 7
// Column Number: 26

// Without sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 2
// Column Number: 26

cjscopy
```

### `util.getSystemErrorName(err)`[#](#utilgetsystemerrornameerr)

Added in: v9.7.0

- `err` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)
- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Returns the string name for a numeric error code that comes from a Node.js API.
The mapping between error codes and error names is platform-dependent.
See [Common System Errors](errors.html#common-system-errors) for the names of common errors.

```
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorName(err.errno);
  console.error(name);  // ENOENT
});

jscopy
```

### `util.getSystemErrorMap()`[#](#utilgetsystemerrormap)

Added in: v16.0.0, v14.17.0

- Returns: [`<Map>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)

Returns a Map of all system error codes available from the Node.js API.
The mapping between error codes and error names is platform-dependent.
See [Common System Errors](errors.html#common-system-errors) for the names of common errors.

```
fs.access('file/that/does/not/exist', (err) => {
  const errorMap = util.getSystemErrorMap();
  const name = errorMap.get(err.errno);
  console.error(name);  // ENOENT
});

jscopy
```

### `util.getSystemErrorMessage(err)`[#](#utilgetsystemerrormessageerr)

Added in: v23.1.0, v22.12.0

- `err` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)
- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Returns the string message for a numeric error code that comes from a Node.js
API.
The mapping between error codes and string messages is platform-dependent.

```
fs.access('file/that/does/not/exist', (err) => {
  const message = util.getSystemErrorMessage(err.errno);
  console.error(message);  // No such file or directory
});

jscopy
```

### `util.setTraceSigInt(enable)`[#](#utilsettracesigintenable)

Added in: v24.6.0, v22.19.0

- `enable` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Enable or disable printing a stack trace on `SIGINT`. The API is only available on the main thread.

### `util.inherits(constructor, superConstructor)`[#](#utilinheritsconstructor-superconstructor)

Added in: v0.3.0History

| Version | Changes |
| --- | --- |
| v5.0.0 | The `constructor` parameter can refer to an ES6 class now. |

Stability: 3 - Legacy: Use ES2015 class syntax and `extends` keyword instead.

- `constructor` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `superConstructor` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

Usage of `util.inherits()` is discouraged. Please use the ES6 `class` and
`extends` keywords to get language level inheritance support. Also note
that the two styles are [semantically incompatible](https://github.com/nodejs/node/issues/4179).

Inherit the prototype methods from one [constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor) into another. The
prototype of `constructor` will be set to a new object created from
`superConstructor`.

This mainly adds some input validation on top of
`Object.setPrototypeOf(constructor.prototype, superConstructor.prototype)`.
As an additional convenience, `superConstructor` will be accessible
through the `constructor.super_` property.

```
const util = require('node:util');
const EventEmitter = require('node:events');

function MyStream() {
  EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);

MyStream.prototype.write = function(data) {
  this.emit('data', data);
};

const stream = new MyStream();

console.log(stream instanceof EventEmitter); // true
console.log(MyStream.super_ === EventEmitter); // true

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('It works!'); // Received data: "It works!"

jscopy
```

ES6 example using `class` and `extends`:

```
import EventEmitter from 'node:events';

class MyStream extends EventEmitter {
  write(data) {
    this.emit('data', data);
  }
}

const stream = new MyStream();

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('With ES6');
const EventEmitter = require('node:events');

class MyStream extends EventEmitter {
  write(data) {
    this.emit('data', data);
  }
}

const stream = new MyStream();

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('With ES6');

javascriptcopy
```

### `util.inspect(object[, options])`[#](#utilinspectobject-options)

### `util.inspect(object[, showHidden[, depth[, colors]]])`[#](#utilinspectobject-showhidden-depth-colors)

Added in: v0.3.0History

| Version | Changes |
| --- | --- |
| v25.0.0 | The util.inspect.styles.regexp style is now a method that is invoked for coloring the stringified regular expression. |
| v17.3.0, v16.14.0 | The `numericSeparator` option is supported now. |
| v16.18.0 | add support for `maxArrayLength` when inspecting `Set` and `Map`. |
| v14.6.0, v12.19.0 | If `object` is from a different `vm.Context` now, a custom inspection function on it will not receive context-specific arguments anymore. |
| v13.13.0, v12.17.0 | The `maxStringLength` option is supported now. |
| v13.5.0, v12.16.0 | User defined prototype properties are inspected in case `showHidden` is `true`. |
| v13.0.0 | Circular references now include a marker to the reference. |
| v12.0.0 | The `compact` options default is changed to `3` and the `breakLength` options default is changed to `80`. |
| v12.0.0 | Internal properties no longer appear in the context argument of a custom inspection function. |
| v11.11.0 | The `compact` option accepts numbers for a new output mode. |
| v11.7.0 | ArrayBuffers now also show their binary contents. |
| v11.5.0 | The `getters` option is supported now. |
| v11.4.0 | The `depth` default changed back to `2`. |
| v11.0.0 | The `depth` default changed to `20`. |
| v11.0.0 | The inspection output is now limited to about 128 MiB. Data above that size will not be fully inspected. |
| v10.12.0 | The `sorted` option is supported now. |
| v10.6.0 | Inspecting linked lists and similar objects is now possible up to the maximum call stack size. |
| v10.0.0 | The `WeakMap` and `WeakSet` entries can now be inspected as well. |
| v9.9.0 | The `compact` option is supported now. |
| v6.6.0 | Custom inspection functions can now return `this`. |
| v6.3.0 | The `breakLength` option is supported now. |
| v6.1.0 | The `maxArrayLength` option is supported now; in particular, long arrays are truncated by default. |
| v6.1.0 | The `showProxy` option is supported now. |

- `object` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) Any JavaScript primitive or `Object`.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `showHidden` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, `object`'s non-enumerable symbols and
    properties are included in the formatted result. [`<WeakMap>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) and
    [`<WeakSet>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) entries are also included as well as user defined prototype
    properties (excluding method properties). **Default:** `false`.
  - `depth` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Specifies the number of times to recurse while formatting `object`. This is useful for inspecting large objects. To recurse up to
    the maximum call stack size pass `Infinity` or `null`.
    **Default:** `2`.
  - `colors` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, the output is styled with ANSI color
    codes. Colors are customizable. See [Customizing `util.inspect` colors](#customizing-utilinspect-colors).
    **Default:** `false`.
  - `customInspect` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `false`,
    `[util.inspect.custom](depth, opts, inspect)` functions are not invoked.
    **Default:** `true`.
  - `showProxy` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, `Proxy` inspection includes
    the [`target` and `handler`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#terminology) objects. **Default:** `false`.
  - `maxArrayLength` [`<integer>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Specifies the maximum number of `Array`,
    [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`<Map>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map), [`<WeakMap>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakMap), and [`<WeakSet>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) elements to include when formatting.
    Set to `null` or `Infinity` to show all elements. Set to `0` or
    negative to show no elements. **Default:** `100`.
  - `maxStringLength` [`<integer>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Specifies the maximum number of characters to
    include when formatting. Set to `null` or `Infinity` to show all elements.
    Set to `0` or negative to show no characters. **Default:** `10000`.
  - `breakLength` [`<integer>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The length at which input values are split across
    multiple lines. Set to `Infinity` to format the input as a single line
    (in combination with `compact` set to `true` or any number >= `1`).
    **Default:** `80`.
  - `compact` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) | [`<integer>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Setting this to `false` causes each object key
    to be displayed on a new line. It will break on new lines in text that is
    longer than `breakLength`. If set to a number, the most `n` inner elements
    are united on a single line as long as all properties fit into
    `breakLength`. Short array elements are also grouped together. For more
    information, see the example below. **Default:** `3`.
  - `sorted` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) | [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) If set to `true` or a function, all properties
    of an object, and `Set` and `Map` entries are sorted in the resulting
    string. If set to `true` the [default sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) is used. If set to a function,
    it is used as a [compare function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#parameters).
  - `getters` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) If set to `true`, getters are inspected. If set
    to `'get'`, only getters without a corresponding setter are inspected. If
    set to `'set'`, only getters with a corresponding setter are inspected.
    This might cause side effects depending on the getter function.
    **Default:** `false`.
  - `numericSeparator` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If set to `true`, an underscore is used to
    separate every three digits in all bigints and numbers.
    **Default:** `false`.
- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The representation of `object`.

The `util.inspect()` method returns a string representation of `object` that is
intended for debugging. The output of `util.inspect` may change at any time
and should not be depended upon programmatically. Additional `options` may be
passed that alter the result.
`util.inspect()` will use the constructor's name and/or `Symbol.toStringTag`
property to make an identifiable tag for an inspected value.

```
class Foo {
  get [Symbol.toStringTag]() {
    return 'bar';
  }
}

class Bar {}

const baz = Object.create(null, { [Symbol.toStringTag]: { value: 'foo' } });

util.inspect(new Foo()); // 'Foo [bar] {}'
util.inspect(new Bar()); // 'Bar {}'
util.inspect(baz);       // '[foo] {}'

jscopy
```

Circular references point to their anchor by using a reference index:

```
import { inspect } from 'node:util';

const obj = {};
obj.a = [obj];
obj.b = {};
obj.b.inner = obj.b;
obj.b.obj = obj;

console.log(inspect(obj));
// <ref *1> {
//   a: [ [Circular *1] ],
//   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
// }
const { inspect } = require('node:util');

const obj = {};
obj.a = [obj];
obj.b = {};
obj.b.inner = obj.b;
obj.b.obj = obj;

console.log(inspect(obj));
// <ref *1> {
//   a: [ [Circular *1] ],
//   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
// }

javascriptcopy
```

The following example inspects all properties of the `util` object:

```
import util from 'node:util';

console.log(util.inspect(util, { showHidden: true, depth: null }));
const util = require('node:util');

console.log(util.inspect(util, { showHidden: true, depth: null }));

javascriptcopy
```

The following example highlights the effect of the `compact` option:

```
import { inspect } from 'node:util';

const o = {
  a: [1, 2, [[
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
      'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
    'test',
    'foo']], 4],
  b: new Map([['za', 1], ['zb', 'test']]),
};
console.log(inspect(o, { compact: true, depth: 5, breakLength: 80 }));

// { a:
//   [ 1,
//     2,
//     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // A long line
//           'test',
//           'foo' ] ],
//     4 ],
//   b: Map(2) { 'za' => 1, 'zb' => 'test' } }

// Setting `compact` to false or an integer creates more reader friendly output.
console.log(inspect(o, { compact: false, depth: 5, breakLength: 80 }));

// {
//   a: [
//     1,
//     2,
//     [
//       [
//         'Lorem ipsum dolor sit amet,\n' +
//           'consectetur adipiscing elit, sed do eiusmod \n' +
//           'tempor incididunt ut labore et dolore magna aliqua.',
//         'test',
//         'foo'
//       ]
//     ],
//     4
//   ],
//   b: Map(2) {
//     'za' => 1,
//     'zb' => 'test'
//   }
// }

// Setting `breakLength` to e.g. 150 will print the "Lorem ipsum" text in a
// single line.
const { inspect } = require('node:util');

const o = {
  a: [1, 2, [[
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
      'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
    'test',
    'foo']], 4],
  b: new Map([['za', 1], ['zb', 'test']]),
};
console.log(inspect(o, { compact: true, depth: 5, breakLength: 80 }));

// { a:
//   [ 1,
//     2,
//     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // A long line
//           'test',
//           'foo' ] ],
//     4 ],
//   b: Map(2) { 'za' => 1, 'zb' => 'test' } }

// Setting `compact` to false or an integer creates more reader friendly output.
console.log(inspect(o, { compact: false, depth: 5, breakLength: 80 }));

// {
//   a: [
//     1,
//     2,
//     [
//       [
//         'Lorem ipsum dolor sit amet,\n' +
//           'consectetur adipiscing elit, sed do eiusmod \n' +
//           'tempor incididunt ut labore et dolore magna aliqua.',
//         'test',
//         'foo'
//       ]
//     ],
//     4
//   ],
//   b: Map(2) {
//     'za' => 1,
//     'zb' => 'test'
//   }
// }

// Setting `breakLength` to e.g. 150 will print the "Lorem ipsum" text in a
// single line.

javascriptcopy
```

The `showHidden` option allows [`<WeakMap>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) and [`<WeakSet>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) entries to be
inspected. If there are more entries than `maxArrayLength`, there is no
guarantee which entries are displayed. That means retrieving the same
[`<WeakSet>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) entries twice may result in different output. Furthermore, entries
with no remaining strong references may be garbage collected at any time.

```
import { inspect } from 'node:util';

const obj = { a: 1 };
const obj2 = { b: 2 };
const weakSet = new WeakSet([obj, obj2]);

console.log(inspect(weakSet, { showHidden: true }));
// WeakSet { { a: 1 }, { b: 2 } }
const { inspect } = require('node:util');

const obj = { a: 1 };
const obj2 = { b: 2 };
const weakSet = new WeakSet([obj, obj2]);

console.log(inspect(weakSet, { showHidden: true }));
// WeakSet { { a: 1 }, { b: 2 } }

javascriptcopy
```

The `sorted` option ensures that an object's property insertion order does not
impact the result of `util.inspect()`.

```
import { inspect } from 'node:util';
import assert from 'node:assert';

const o1 = {
  b: [2, 3, 1],
  a: '`a` comes before `b`',
  c: new Set([2, 3, 1]),
};
console.log(inspect(o1, { sorted: true }));
// { a: '`a` comes before `b`', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
// { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a` comes before `b`' }

const o2 = {
  c: new Set([2, 1, 3]),
  a: '`a` comes before `b`',
  b: [2, 3, 1],
};
assert.strict.equal(
  inspect(o1, { sorted: true }),
  inspect(o2, { sorted: true }),
);
const { inspect } = require('node:util');
const assert = require('node:assert');

const o1 = {
  b: [2, 3, 1],
  a: '`a` comes before `b`',
  c: new Set([2, 3, 1]),
};
console.log(inspect(o1, { sorted: true }));
// { a: '`a` comes before `b`', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
// { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a` comes before `b`' }

const o2 = {
  c: new Set([2, 1, 3]),
  a: '`a` comes before `b`',
  b: [2, 3, 1],
};
assert.strict.equal(
  inspect(o1, { sorted: true }),
  inspect(o2, { sorted: true }),
);

javascriptcopy
```

The `numericSeparator` option adds an underscore every three digits to all
numbers.

```
import { inspect } from 'node:util';

const thousand = 1000;
const million = 1000000;
const bigNumber = 123456789n;
const bigDecimal = 1234.12345;

console.log(inspect(thousand, { numericSeparator: true }));
// 1_000
console.log(inspect(million, { numericSeparator: true }));
// 1_000_000
console.log(inspect(bigNumber, { numericSeparator: true }));
// 123_456_789n
console.log(inspect(bigDecimal, { numericSeparator: true }));
// 1_234.123_45
const { inspect } = require('node:util');

const thousand = 1000;
const million = 1000000;
const bigNumber = 123456789n;
const bigDecimal = 1234.12345;

console.log(inspect(thousand, { numericSeparator: true }));
// 1_000
console.log(inspect(million, { numericSeparator: true }));
// 1_000_000
console.log(inspect(bigNumber, { numericSeparator: true }));
// 123_456_789n
console.log(inspect(bigDecimal, { numericSeparator: true }));
// 1_234.123_45

javascriptcopy
```

`util.inspect()` is a synchronous method intended for debugging. Its maximum
output length is approximately 128 MiB. Inputs that result in longer output will
be truncated.

#### Customizing `util.inspect` colors[#](#customizing-utilinspect-colors)

Color output (if enabled) of `util.inspect` is customizable globally
via the `util.inspect.styles` and `util.inspect.colors` properties.

`util.inspect.styles` is a map associating a style name to a color from
`util.inspect.colors`.

The default styles and associated colors are:

- `bigint`: `yellow`
- `boolean`: `yellow`
- `date`: `magenta`
- `module`: `underline`
- `name`: (no styling)
- `null`: `bold`
- `number`: `yellow`
- `regexp`: A method that colors character classes, groups, assertions, and
  other parts for improved readability. To customize the coloring, change the
  `colors` property. It is set to
  `['red', 'green', 'yellow', 'cyan', 'magenta']` by default and may be
  adjusted as needed. The array is repetitively iterated through depending on
  the "depth".
- `special`: `cyan` (e.g., `Proxies`)
- `string`: `green`
- `symbol`: `green`
- `undefined`: `grey`

Color styling uses ANSI control codes that may not be supported on all
terminals. To verify color support use [`tty.hasColors()`](tty.html#writestreamhascolorscount-env).

Predefined control codes are listed below (grouped as "Modifiers", "Foreground
colors", and "Background colors").

##### Complex custom coloring[#](#complex-custom-coloring)

It is possible to define a method as style. It receives the stringified value
of the input. It is invoked in case coloring is active and the type is
inspected.

Example: `util.inspect.styles.regexp(value)`

- `value` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The string representation of the input type.
- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The adjusted representation of `object`.

##### Modifiers[#](#modifiers)

Modifier support varies throughout different terminals. They will mostly be
ignored, if not supported.

- `reset` - Resets all (color) modifiers to their defaults
- **bold** - Make text bold
- *italic* - Make text italic
- underline - Make text underlined
- ~~strikethrough~~ - Puts a horizontal line through the center of the text
  (Alias: `strikeThrough`, `crossedout`, `crossedOut`)
- `hidden` - Prints the text, but makes it invisible (Alias: conceal)
- dim - Decreased color intensity (Alias:
  `faint`)
- overlined - Make text overlined
- blink - Hides and shows the text in an interval
- inverse - Swap foreground and
  background colors (Alias: `swapcolors`, `swapColors`)
- doubleunderline - Make text
  double underlined (Alias: `doubleUnderline`)
- framed - Draw a frame around the text

##### Foreground colors[#](#foreground-colors)

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `gray` (alias: `grey`, `blackBright`)
- `redBright`
- `greenBright`
- `yellowBright`
- `blueBright`
- `magentaBright`
- `cyanBright`
- `whiteBright`

##### Background colors[#](#background-colors)

- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`
- `bgGray` (alias: `bgGrey`, `bgBlackBright`)
- `bgRedBright`
- `bgGreenBright`
- `bgYellowBright`
- `bgBlueBright`
- `bgMagentaBright`
- `bgCyanBright`
- `bgWhiteBright`

#### Custom inspection functions on objects[#](#custom-inspection-functions-on-objects)

Added in: v0.1.97History

| Version | Changes |
| --- | --- |
| v17.3.0, v16.14.0 | The inspect argument is added for more interoperability. |

Objects may also define their own
[`[util.inspect.custom](depth, opts, inspect)`](#utilinspectcustom) function,
which `util.inspect()` will invoke and use the result of when inspecting
the object.

```
import { inspect } from 'node:util';

class Box {
  constructor(value) {
    this.value = value;
  }

  [inspect.custom](depth, options, inspect) {
    if (depth < 0) {
      return options.stylize('[Box]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1,
    });

    // Five space padding because that's the size of "Box< ".
    const padding = ' '.repeat(5);
    const inner = inspect(this.value, newOptions)
                  .replace(/\n/g, `\n${padding}`);
    return `${options.stylize('Box', 'special')}< ${inner} >`;
  }
}

const box = new Box(true);

console.log(inspect(box));
// "Box< true >"
const { inspect } = require('node:util');

class Box {
  constructor(value) {
    this.value = value;
  }

  [inspect.custom](depth, options, inspect) {
    if (depth < 0) {
      return options.stylize('[Box]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1,
    });

    // Five space padding because that's the size of "Box< ".
    const padding = ' '.repeat(5);
    const inner = inspect(this.value, newOptions)
                  .replace(/\n/g, `\n${padding}`);
    return `${options.stylize('Box', 'special')}< ${inner} >`;
  }
}

const box = new Box(true);

console.log(inspect(box));
// "Box< true >"

javascriptcopy
```

Custom `[util.inspect.custom](depth, opts, inspect)` functions typically return
a string but may return a value of any type that will be formatted accordingly
by `util.inspect()`.

```
import { inspect } from 'node:util';

const obj = { foo: 'this will not show up in the inspect() output' };
obj[inspect.custom] = (depth) => {
  return { bar: 'baz' };
};

console.log(inspect(obj));
// "{ bar: 'baz' }"
const { inspect } = require('node:util');

const obj = { foo: 'this will not show up in the inspect() output' };
obj[inspect.custom] = (depth) => {
  return { bar: 'baz' };
};

console.log(inspect(obj));
// "{ bar: 'baz' }"

javascriptcopy
```

#### `util.inspect.custom`[#](#utilinspectcustom)

Added in: v6.6.0History

| Version | Changes |
| --- | --- |
| v10.12.0 | This is now defined as a shared symbol. |

- Type: [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) that can be used to declare custom inspect functions.

In addition to being accessible through `util.inspect.custom`, this
symbol is [registered globally](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) and can be
accessed in any environment as `Symbol.for('nodejs.util.inspect.custom')`.

Using this allows code to be written in a portable fashion, so that the custom
inspect function is used in a Node.js environment and ignored in the browser.
The `util.inspect()` function itself is passed as third argument to the custom
inspect function to allow further portability.

```
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

class Password {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return 'xxxxxxxx';
  }

  [customInspectSymbol](depth, inspectOptions, inspect) {
    return `Password <${this.toString()}>`;
  }
}

const password = new Password('r0sebud');
console.log(password);
// Prints Password <xxxxxxxx>

jscopy
```

See [Custom inspection functions on Objects](#custom-inspection-functions-on-objects) for more details.

#### `util.inspect.defaultOptions`[#](#utilinspectdefaultoptions)

Added in: v6.4.0

The `defaultOptions` value allows customization of the default options used by
`util.inspect`. This is useful for functions like `console.log` or
`util.format` which implicitly call into `util.inspect`. It shall be set to an
object containing one or more valid [`util.inspect()`](#utilinspectobject-options) options. Setting
option properties directly is also supported.

```
import { inspect } from 'node:util';
const arr = Array(156).fill(0);

console.log(arr); // Logs the truncated array
inspect.defaultOptions.maxArrayLength = null;
console.log(arr); // logs the full array
const { inspect } = require('node:util');
const arr = Array(156).fill(0);

console.log(arr); // Logs the truncated array
inspect.defaultOptions.maxArrayLength = null;
console.log(arr); // logs the full array

javascriptcopy
```

### `util.isDeepStrictEqual(val1, val2[, options])`[#](#utilisdeepstrictequalval1-val2-options)

Added in: v9.0.0History

| Version | Changes |
| --- | --- |
| v24.9.0 | Added `options` parameter to allow skipping prototype comparison. |

- `val1` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- `val2` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- `skipPrototype` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, prototype and constructor
  comparison is skipped during deep strict equality check. **Default:** `false`.
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if there is deep strict equality between `val1` and `val2`.
Otherwise, returns `false`.

By default, deep strict equality includes comparison of object prototypes and
constructors. When `skipPrototype` is `true`, objects with
different prototypes or constructors can still be considered equal if their
enumerable properties are deeply strictly equal.

```
const util = require('node:util');

class Foo {
  constructor(a) {
    this.a = a;
  }
}

class Bar {
  constructor(a) {
    this.a = a;
  }
}

const foo = new Foo(1);
const bar = new Bar(1);

// Different constructors, same properties
console.log(util.isDeepStrictEqual(foo, bar));
// false

console.log(util.isDeepStrictEqual(foo, bar, true));
// true

jscopy
```

See [`assert.deepStrictEqual()`](assert.html#assertdeepstrictequalactual-expected-message) for more information about deep strict
equality.

### Class: `util.MIMEType`[#](#class-utilmimetype)

Added in: v19.1.0, v18.13.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

An implementation of [the MIMEType class](https://bmeck.github.io/node-proposal-mime-api/).

In accordance with browser conventions, all properties of `MIMEType` objects
are implemented as getters and setters on the class prototype, rather than as
data properties on the object itself.

A MIME string is a structured string containing multiple meaningful
components. When parsed, a `MIMEType` object is returned containing
properties for each of these components.

#### `new MIMEType(input)`[#](#new-mimetypeinput)

- `input` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The input MIME to parse

Creates a new `MIMEType` object by parsing the `input`.

```
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/plain');
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/plain');

javascriptcopy
```

A `TypeError` will be thrown if the `input` is not a valid MIME. Note
that an effort will be made to coerce the given values into strings. For
instance:

```
import { MIMEType } from 'node:util';
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
const { MIMEType } = require('node:util');
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain

javascriptcopy
```

#### `mime.type`[#](#mimetype)

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Gets and sets the type portion of the MIME.

```
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript

javascriptcopy
```

#### `mime.subtype`[#](#mimesubtype)

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Gets and sets the subtype portion of the MIME.

```
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript

javascriptcopy
```

#### `mime.essence`[#](#mimeessence)

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Gets the essence of the MIME. This property is read only.
Use `mime.type` or `mime.subtype` to alter the MIME.

```
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value

javascriptcopy
```

#### `mime.params`[#](#mimeparams)

- Type: [`<MIMEParams>`](util.html#class-utilmimeparams)

Gets the [`MIMEParams`](#class-utilmimeparams) object representing the
parameters of the MIME. This property is read-only. See
[`MIMEParams`](#class-utilmimeparams) documentation for details.

#### `mime.toString()`[#](#mimetostring)

- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

The `toString()` method on the `MIMEType` object returns the serialized MIME.

Because of the need for standard compliance, this method does not allow users
to customize the serialization process of the MIME.

#### `mime.toJSON()`[#](#mimetojson)

- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Alias for [`mime.toString()`](#mimetostring).

This method is automatically called when an `MIMEType` object is serialized
with [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

```
import { MIMEType } from 'node:util';

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
const { MIMEType } = require('node:util');

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]

javascriptcopy
```

### Class: `util.MIMEParams`[#](#class-utilmimeparams)

Added in: v19.1.0, v18.13.0

The `MIMEParams` API provides read and write access to the parameters of a
`MIMEType`.

#### `new MIMEParams()`[#](#new-mimeparams)

Creates a new `MIMEParams` object by with empty parameters

```
import { MIMEParams } from 'node:util';

const myParams = new MIMEParams();
const { MIMEParams } = require('node:util');

const myParams = new MIMEParams();

javascriptcopy
```

#### `mimeParams.delete(name)`[#](#mimeparamsdeletename)

- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Remove all name-value pairs whose name is `name`.

#### `mimeParams.entries()`[#](#mimeparamsentries)

- Returns: [`<Iterator>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Iterator)

Returns an iterator over each of the name-value pairs in the parameters.
Each item of the iterator is a JavaScript `Array`. The first item of the array
is the `name`, the second item of the array is the `value`.

#### `mimeParams.get(name)`[#](#mimeparamsgetname)

- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) A string or `null` if there is no name-value pair
  with the given `name`.

Returns the value of the first name-value pair whose name is `name`. If there
are no such pairs, `null` is returned.

#### `mimeParams.has(name)`[#](#mimeparamshasname)

- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if there is at least one name-value pair whose name is `name`.

#### `mimeParams.keys()`[#](#mimeparamskeys)

- Returns: [`<Iterator>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Iterator)

Returns an iterator over the names of each name-value pair.

```
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar

javascriptcopy
```

#### `mimeParams.set(name, value)`[#](#mimeparamssetname-value)

- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- `value` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Sets the value in the `MIMEParams` object associated with `name` to
`value`. If there are any pre-existing name-value pairs whose names are `name`,
set the first such pair's value to `value`.

```
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz

javascriptcopy
```

#### `mimeParams.values()`[#](#mimeparamsvalues)

- Returns: [`<Iterator>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Iterator)

Returns an iterator over the values of each name-value pair.

#### `mimeParams[Symbol.iterator]()`[#](#mimeparamssymboliterator)

- Returns: [`<Iterator>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Iterator)

Alias for [`mimeParams.entries()`](#mimeparamsentries).

```
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz

javascriptcopy
```

### `util.parseArgs([config])`[#](#utilparseargsconfig)

Added in: v18.3.0, v16.17.0History

| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | add support for allowing negative options in input `config`. |
| v20.0.0 | The API is no longer experimental. |
| v18.11.0, v16.19.0 | Add support for default values in input `config`. |
| v18.7.0, v16.17.0 | add support for returning detailed parse information using `tokens` in input `config` and returned properties. |

- `config` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Used to provide arguments for parsing and to configure
  the parser. `config` supports the following properties:

  - `args` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] array of argument strings. **Default:** `process.argv`
    with `execPath` and `filename` removed.
  - `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Used to describe arguments known to the parser.
    Keys of `options` are the long names of options and values are an
    [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) accepting the following properties:
    - `type` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Type of argument, which must be either `boolean` or `string`.
    - `multiple` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Whether this option can be provided multiple
      times. If `true`, all values will be collected in an array. If
      `false`, values for the option are last-wins. **Default:** `false`.
    - `short` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) A single character alias for the option.
    - `default` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] | [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)[] The value to assign to
      the option if it does not appear in the arguments to be parsed. The value
      must match the type specified by the `type` property. If `multiple` is
      `true`, it must be an array. No default value is applied when the option
      does appear in the arguments to be parsed, even if the provided value
      is falsy.
  - `strict` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Should an error be thrown when unknown arguments
    are encountered, or when arguments are passed that do not match the `type` configured in `options`.
    **Default:** `true`.
  - `allowPositionals` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Whether this command accepts positional
    arguments. **Default:** `false` if `strict` is `true`, otherwise `true`.
  - `allowNegative` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, allows explicitly setting boolean
    options to `false` by prefixing the option name with `--no-`.
    **Default:** `false`.
  - `tokens` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Return the parsed tokens. This is useful for extending
    the built-in behavior, from adding additional checks through to reprocessing
    the tokens in different ways. **Default:** `false`.
- Returns: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) The parsed command line arguments:

  - `values` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) A mapping of parsed option names with their [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
    or [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) values.
  - `positionals` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] Positional arguments.
  - `tokens` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)[] | [`<undefined>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#undefined_type) See [parseArgs tokens](#parseargs-tokens)
    section. Only returned if `config` includes `tokens: true`.

Provides a higher level API for command-line argument parsing than interacting
with `process.argv` directly. Takes a specification for the expected arguments
and returns a structured object with the parsed options and positionals.

```
import { parseArgs } from 'node:util';
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
const { parseArgs } = require('node:util');
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []

javascriptcopy
```

#### `parseArgs` `tokens`[#](#parseargs-tokens)

Detailed parse information is available for adding custom behaviors by
specifying `tokens: true` in the configuration.
The returned tokens have properties describing:

- all tokens
  - `kind` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) One of 'option', 'positional', or 'option-terminator'.
  - `index` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Index of element in `args` containing token. So the
    source argument for a token is `args[token.index]`.
- option tokens
  - `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Long name of option.
  - `rawName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) How option used in args, like `-f` of `--foo`.
  - `value` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<undefined>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#undefined_type) Option value specified in args.
    Undefined for boolean options.
  - `inlineValue` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) | [`<undefined>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#undefined_type) Whether option value specified inline,
    like `--foo=bar`.
- positional tokens
  - `value` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The value of the positional argument in args (i.e. `args[index]`).
- option-terminator token

The returned tokens are in the order encountered in the input args. Options
that appear more than once in args produce a token for each use. Short option
groups like `-xy` expand to a token for each option. So `-xxx` produces
three tokens.

For example, to add support for a negated option like `--no-color` (which
`allowNegative` supports when the option is of `boolean` type), the returned
tokens can be reprocessed to change the value stored for the negated option.

```
import { parseArgs } from 'node:util';

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Reprocess the option tokens and overwrite the returned values.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Store foo:false for --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Resave value so last one wins if both --foo and --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
const { parseArgs } = require('node:util');

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Reprocess the option tokens and overwrite the returned values.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Store foo:false for --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Resave value so last one wins if both --foo and --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });

javascriptcopy
```

Example usage showing negated options, and when an option is used
multiple ways then last one wins.

```
$ node negate.js
{ logfile: 'default.log', color: undefined }
$ node negate.js --no-logfile --no-color
{ logfile: false, color: false }
$ node negate.js --logfile=test.log --color
{ logfile: 'test.log', color: true }
$ node negate.js --no-logfile --logfile=test.log --color --no-color
{ logfile: 'test.log', color: false }

consolecopy
```

### `util.parseEnv(content)`[#](#utilparseenvcontent)

Added in: v21.7.0, v20.12.0History

| Version | Changes |
| --- | --- |
| v24.10.0, v22.21.0 | This API is no longer experimental. |

- `content` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

The raw contents of a `.env` file.

- Returns: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

Given an example `.env` file:

```
const { parseEnv } = require('node:util');

parseEnv('HELLO=world\nHELLO=oh my\n');
// Returns: { HELLO: 'oh my' }
import { parseEnv } from 'node:util';

parseEnv('HELLO=world\nHELLO=oh my\n');
// Returns: { HELLO: 'oh my' }

javascriptcopy
```

### `util.promisify(original)`[#](#utilpromisifyoriginal)

Added in: v8.0.0History

| Version | Changes |
| --- | --- |
| v20.8.0 | Calling `promisify` on a function that returns a `Promise` is deprecated. |

- `original` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

Takes a function following the common error-first callback style, i.e. taking
an `(err, value) => ...` callback as the last argument, and returns a version
that returns promises.

```
import { promisify } from 'node:util';
import { stat } from 'node:fs';

const promisifiedStat = promisify(stat);
promisifiedStat('.').then((stats) => {
  // Do something with `stats`
}).catch((error) => {
  // Handle the error.
});
const { promisify } = require('node:util');
const { stat } = require('node:fs');

const promisifiedStat = promisify(stat);
promisifiedStat('.').then((stats) => {
  // Do something with `stats`
}).catch((error) => {
  // Handle the error.
});

javascriptcopy
```

Or, equivalently using `async function`s:

```
import { promisify } from 'node:util';
import { stat } from 'node:fs';

const promisifiedStat = promisify(stat);

async function callStat() {
  const stats = await promisifiedStat('.');
  console.log(`This directory is owned by ${stats.uid}`);
}

callStat();
const { promisify } = require('node:util');
const { stat } = require('node:fs');

const promisifiedStat = promisify(stat);

async function callStat() {
  const stats = await promisifiedStat('.');
  console.log(`This directory is owned by ${stats.uid}`);
}

callStat();

javascriptcopy
```

If there is an `original[util.promisify.custom]` property present, `promisify`
will return its value, see [Custom promisified functions](#custom-promisified-functions).

`promisify()` assumes that `original` is a function taking a callback as its
final argument in all cases. If `original` is not a function, `promisify()`
will throw an error. If `original` is a function but its last argument is not
an error-first callback, it will still be passed an error-first
callback as its last argument.

Using `promisify()` on class methods or other methods that use `this` may not
work as expected unless handled specially:

```
import { promisify } from 'node:util';

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = promisify(foo.bar);
// TypeError: Cannot read properties of undefined (reading 'a')
// naiveBar().then(a => console.log(a));

naiveBar.call(foo).then((a) => console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) => console.log(a)); // '42'
const { promisify } = require('node:util');

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = promisify(foo.bar);
// TypeError: Cannot read properties of undefined (reading 'a')
// naiveBar().then(a => console.log(a));

naiveBar.call(foo).then((a) => console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) => console.log(a)); // '42'

javascriptcopy
```

#### Custom promisified functions[#](#custom-promisified-functions)

Using the `util.promisify.custom` symbol one can override the return value of
[`util.promisify()`](#utilpromisifyoriginal):

```
import { promisify } from 'node:util';

function doSomething(foo, callback) {
  // ...
}

doSomething[promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = promisify(doSomething);
console.log(promisified === doSomething[promisify.custom]);
// prints 'true'
const { promisify } = require('node:util');

function doSomething(foo, callback) {
  // ...
}

doSomething[promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = promisify(doSomething);
console.log(promisified === doSomething[promisify.custom]);
// prints 'true'

javascriptcopy
```

This can be useful for cases where the original function does not follow the
standard format of taking an error-first callback as the last argument.

For example, with a function that takes in
`(foo, onSuccessCallback, onErrorCallback)`:

```
doSomething[util.promisify.custom] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};

jscopy
```

If `promisify.custom` is defined but is not a function, `promisify()` will
throw an error.

#### `util.promisify.custom`[#](#utilpromisifycustom)

Added in: v8.0.0History

| Version | Changes |
| --- | --- |
| v13.12.0, v12.16.2 | This is now defined as a shared symbol. |

- Type: [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) that can be used to declare custom promisified variants of functions,
  see [Custom promisified functions](#custom-promisified-functions).

In addition to being accessible through `util.promisify.custom`, this
symbol is [registered globally](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) and can be
accessed in any environment as `Symbol.for('nodejs.util.promisify.custom')`.

For example, with a function that takes in
`(foo, onSuccessCallback, onErrorCallback)`:

```
const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');

doSomething[kCustomPromisifiedSymbol] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};

jscopy
```

### `util.stripVTControlCharacters(str)`[#](#utilstripvtcontrolcharactersstr)

Added in: v16.11.0

- `str` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Returns `str` with any ANSI escape codes removed.

```
console.log(util.stripVTControlCharacters('\u001B[4mvalue\u001B[0m'));
// Prints "value"

jscopy
```

### `util.styleText(format, text[, options])`[#](#utilstyletextformat-text-options)

Added in: v21.7.0, v20.12.0History

| Version | Changes |
| --- | --- |
| v26.1.0 | Add support for hexadecimal colors. |
| v24.2.0, v22.17.0 | Added the `'none'` format as a non-op format. |
| v23.5.0, v22.13.0 | styleText is now stable. |
| v22.8.0, v20.18.0 | Respect isTTY and environment variables such as NO\_COLOR, NODE\_DISABLE\_COLORS, and FORCE\_COLOR. |

- `format` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) A text format or an Array
  of text formats defined in `util.inspect.colors`, or a hex color in `#RGB`
  or `#RRGGBB` form.
- `text` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The text to be formatted.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `validateStream` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) When true, `stream` is checked to see if it can handle colors. **Default:** `true`.
  - `stream` [`<Stream>`](stream.html#stream) A stream that will be validated if it can be colored. **Default:** `process.stdout`.

This function returns a formatted text considering the `format` passed
for printing in a terminal. It is aware of the terminal's capabilities
and acts according to the configuration set via `NO_COLOR`,
`NODE_DISABLE_COLORS` and `FORCE_COLOR` environment variables.

```
import { styleText } from 'node:util';
import { stderr } from 'node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Validate if process.stderr has TTY
  { stream: stderr },
);
console.error(errorMessage);
const { styleText } = require('node:util');
const { stderr } = require('node:process');

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Validate if process.stderr has TTY
  { stream: stderr },
);
console.error(errorMessage);

javascriptcopy
```

`util.inspect.colors` also provides text formats such as `italic`, and
`underline` and you can combine both:

```
console.log(
  util.styleText(['underline', 'italic'], 'My italic underlined message'),
);

cjscopy
```

When passing an array of formats, the order of the format applied
is left to right so the following style might overwrite the previous one.

```
console.log(
  util.styleText(['red', 'green'], 'text'), // green
);

cjscopy
```

The special format value `none` applies no additional styling to the text.

In addition to predefined color names, `util.styleText()` supports hex color
strings using ANSI TrueColor (24-bit) escape sequences. Hex colors can be
specified in either 3-digit (`#RGB`) or 6-digit (`#RRGGBB`) format:

```
import { styleText } from 'node:util';

// 6-digit hex color
console.log(styleText('#ff5733', 'Orange text'));

// 3-digit hex color (shorthand)
console.log(styleText('#f00', 'Red text'));
const { styleText } = require('node:util');

// 6-digit hex color
console.log(styleText('#ff5733', 'Orange text'));

// 3-digit hex color (shorthand)
console.log(styleText('#f00', 'Red text'));

javascriptcopy
```

The full list of formats can be found in [modifiers](#modifiers).

### Class: `util.TextDecoder`[#](#class-utiltextdecoder)

Added in: v8.3.0History

| Version | Changes |
| --- | --- |
| v11.0.0 | The class is now available on the global object. |

An implementation of the [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) `TextDecoder` API.

```
const decoder = new TextDecoder();
const u8arr = new Uint8Array([72, 101, 108, 108, 111]);
console.log(decoder.decode(u8arr)); // Hello

jscopy
```

#### WHATWG supported encodings[#](#whatwg-supported-encodings)

Per the [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/), the encodings supported by the
`TextDecoder` API are outlined in the tables below. For each encoding,
one or more aliases may be used.

Different Node.js build configurations support different sets of encodings.
(see [Internationalization](intl.html))

##### Encodings supported by default (with full ICU data)[#](#encodings-supported-by-default-with-full-icu-data)

| Encoding | Aliases |
| --- | --- |
| `'ibm866'` | `'866'`, `'cp866'`, `'csibm866'` |
| `'iso-8859-2'` | `'csisolatin2'`, `'iso-ir-101'`, `'iso8859-2'`, `'iso88592'`, `'iso_8859-2'`, `'iso_8859-2:1987'`, `'l2'`, `'latin2'` |
| `'iso-8859-3'` | `'csisolatin3'`, `'iso-ir-109'`, `'iso8859-3'`, `'iso88593'`, `'iso_8859-3'`, `'iso_8859-3:1988'`, `'l3'`, `'latin3'` |
| `'iso-8859-4'` | `'csisolatin4'`, `'iso-ir-110'`, `'iso8859-4'`, `'iso88594'`, `'iso_8859-4'`, `'iso_8859-4:1988'`, `'l4'`, `'latin4'` |
| `'iso-8859-5'` | `'csisolatincyrillic'`, `'cyrillic'`, `'iso-ir-144'`, `'iso8859-5'`, `'iso88595'`, `'iso_8859-5'`, `'iso_8859-5:1988'` |
| `'iso-8859-6'` | `'arabic'`, `'asmo-708'`, `'csiso88596e'`, `'csiso88596i'`, `'csisolatinarabic'`, `'ecma-114'`, `'iso-8859-6-e'`, `'iso-8859-6-i'`, `'iso-ir-127'`, `'iso8859-6'`, `'iso88596'`, `'iso_8859-6'`, `'iso_8859-6:1987'` |
| `'iso-8859-7'` | `'csisolatingreek'`, `'ecma-118'`, `'elot_928'`, `'greek'`, `'greek8'`, `'iso-ir-126'`, `'iso8859-7'`, `'iso88597'`, `'iso_8859-7'`, `'iso_8859-7:1987'`, `'sun_eu_greek'` |
| `'iso-8859-8'` | `'csiso88598e'`, `'csisolatinhebrew'`, `'hebrew'`, `'iso-8859-8-e'`, `'iso-ir-138'`, `'iso8859-8'`, `'iso88598'`, `'iso_8859-8'`, `'iso_8859-8:1988'`, `'visual'` |
| `'iso-8859-8-i'` | `'csiso88598i'`, `'logical'` |
| `'iso-8859-10'` | `'csisolatin6'`, `'iso-ir-157'`, `'iso8859-10'`, `'iso885910'`, `'l6'`, `'latin6'` |
| `'iso-8859-13'` | `'iso8859-13'`, `'iso885913'` |
| `'iso-8859-14'` | `'iso8859-14'`, `'iso885914'` |
| `'iso-8859-15'` | `'csisolatin9'`, `'iso8859-15'`, `'iso885915'`, `'iso_8859-15'`, `'l9'` |
| `'koi8-r'` | `'cskoi8r'`, `'koi'`, `'koi8'`, `'koi8_r'` |
| `'koi8-u'` | `'koi8-ru'` |
| `'macintosh'` | `'csmacintosh'`, `'mac'`, `'x-mac-roman'` |
| `'windows-874'` | `'dos-874'`, `'iso-8859-11'`, `'iso8859-11'`, `'iso885911'`, `'tis-620'` |
| `'windows-1250'` | `'cp1250'`, `'x-cp1250'` |
| `'windows-1251'` | `'cp1251'`, `'x-cp1251'` |
| `'windows-1252'` | `'ansi_x3.4-1968'`, `'ascii'`, `'cp1252'`, `'cp819'`, `'csisolatin1'`, `'ibm819'`, `'iso-8859-1'`, `'iso-ir-100'`, `'iso8859-1'`, `'iso88591'`, `'iso_8859-1'`, `'iso_8859-1:1987'`, `'l1'`, `'latin1'`, `'us-ascii'`, `'x-cp1252'` |
| `'windows-1253'` | `'cp1253'`, `'x-cp1253'` |
| `'windows-1254'` | `'cp1254'`, `'csisolatin5'`, `'iso-8859-9'`, `'iso-ir-148'`, `'iso8859-9'`, `'iso88599'`, `'iso_8859-9'`, `'iso_8859-9:1989'`, `'l5'`, `'latin5'`, `'x-cp1254'` |
| `'windows-1255'` | `'cp1255'`, `'x-cp1255'` |
| `'windows-1256'` | `'cp1256'`, `'x-cp1256'` |
| `'windows-1257'` | `'cp1257'`, `'x-cp1257'` |
| `'windows-1258'` | `'cp1258'`, `'x-cp1258'` |
| `'x-mac-cyrillic'` | `'x-mac-ukrainian'` |
| `'gbk'` | `'chinese'`, `'csgb2312'`, `'csiso58gb231280'`, `'gb2312'`, `'gb_2312'`, `'gb_2312-80'`, `'iso-ir-58'`, `'x-gbk'` |
| `'gb18030'` |  |
| `'big5'` | `'big5-hkscs'`, `'cn-big5'`, `'csbig5'`, `'x-x-big5'` |
| `'euc-jp'` | `'cseucpkdfmtjapanese'`, `'x-euc-jp'` |
| `'iso-2022-jp'` | `'csiso2022jp'` |
| `'shift_jis'` | `'csshiftjis'`, `'ms932'`, `'ms_kanji'`, `'shift-jis'`, `'sjis'`, `'windows-31j'`, `'x-sjis'` |
| `'euc-kr'` | `'cseuckr'`, `'csksc56011987'`, `'iso-ir-149'`, `'korean'`, `'ks_c_5601-1987'`, `'ks_c_5601-1989'`, `'ksc5601'`, `'ksc_5601'`, `'windows-949'` |

##### Encodings supported when Node.js is built with the `small-icu` option[#](#encodings-supported-when-nodejs-is-built-with-the-small-icu-option)

| Encoding | Aliases |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`, `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
| `'utf-16be'` |  |

##### Encodings supported when ICU is disabled[#](#encodings-supported-when-icu-is-disabled)

| Encoding | Aliases |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`, `'utf8'` |
| `'utf-16le'` | `'utf-16'` |

The `'iso-8859-16'` encoding listed in the [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/)
is not supported.

#### `new TextDecoder([encoding[, options]])`[#](#new-textdecoderencoding-options)

- `encoding` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Identifies the `encoding` that this `TextDecoder` instance
  supports. **Default:** `'utf-8'`.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `fatal` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) `true` if decoding failures are fatal.
    This option is not supported when ICU is disabled
    (see [Internationalization](intl.html)). **Default:** `false`.
  - `ignoreBOM` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) When `true`, the `TextDecoder` will include the byte
    order mark in the decoded result. When `false`, the byte order mark will
    be removed from the output. This option is only used when `encoding` is
    `'utf-8'`, `'utf-16be'`, or `'utf-16le'`. **Default:** `false`.

Creates a new `TextDecoder` instance. The `encoding` may specify one of the
supported encodings or an alias.

The `TextDecoder` class is also available on the global object.

#### `textDecoder.decode([input[, options]])`[#](#textdecoderdecodeinput-options)

- `input` [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) An `ArrayBuffer`, `DataView`, or
  `TypedArray` instance containing the encoded data.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `stream` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) `true` if additional chunks of data are expected.
    **Default:** `false`.
- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Decodes the `input` and returns a string. If `options.stream` is `true`, any
incomplete byte sequences occurring at the end of the `input` are buffered
internally and emitted after the next call to `textDecoder.decode()`.

If `textDecoder.fatal` is `true`, decoding errors that occur will result in a
`TypeError` being thrown.

#### `textDecoder.encoding`[#](#textdecoderencoding)

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

The encoding supported by the `TextDecoder` instance.

#### `textDecoder.fatal`[#](#textdecoderfatal)

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

The value will be `true` if decoding errors result in a `TypeError` being
thrown.

#### `textDecoder.ignoreBOM`[#](#textdecoderignorebom)

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

The value will be `true` if the decoding result will include the byte order
mark.

### Class: `util.TextEncoder`[#](#class-utiltextencoder)

Added in: v8.3.0History

| Version | Changes |
| --- | --- |
| v11.0.0 | The class is now available on the global object. |

An implementation of the [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) `TextEncoder` API. All
instances of `TextEncoder` only support UTF-8 encoding.

```
const encoder = new TextEncoder();
const uint8array = encoder.encode('this is some data');

jscopy
```

The `TextEncoder` class is also available on the global object.

#### `textEncoder.encode([input])`[#](#textencoderencodeinput)

- `input` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The text to encode. **Default:** an empty string.
- Returns: [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

UTF-8 encodes the `input` string and returns a `Uint8Array` containing the
encoded bytes.

#### `textEncoder.encodeInto(src, dest)`[#](#textencoderencodeintosrc-dest)

Added in: v12.11.0

- `src` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The text to encode.
- `dest` [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) The array to hold the encode result.
- Returns: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `read` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The read Unicode code units of src.
  - `written` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The written UTF-8 bytes of dest.

UTF-8 encodes the `src` string to the `dest` Uint8Array and returns an object
containing the read Unicode code units and written UTF-8 bytes.

```
const encoder = new TextEncoder();
const src = 'this is some data';
const dest = new Uint8Array(10);
const { read, written } = encoder.encodeInto(src, dest);

jscopy
```

#### `textEncoder.encoding`[#](#textencoderencoding)

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

The encoding supported by the `TextEncoder` instance. Always set to `'utf-8'`.

### `util.toUSVString(string)`[#](#utiltousvstringstring)

Added in: v16.8.0, v14.18.0

- `string` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Returns the `string` after replacing any surrogate code points
(or equivalently, any unpaired surrogate code units) with the
Unicode "replacement character" U+FFFD.

### `util.transferableAbortController()`[#](#utiltransferableabortcontroller)

Added in: v18.11.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

Creates and returns an [`<AbortController>`](globals.html#class-abortcontroller) instance whose [`<AbortSignal>`](globals.html#class-abortsignal) is marked
as transferable and can be used with `structuredClone()` or `postMessage()`.

### `util.transferableAbortSignal(signal)`[#](#utiltransferableabortsignalsignal)

Added in: v18.11.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

- `signal` [`<AbortSignal>`](globals.html#class-abortsignal)
- Returns: [`<AbortSignal>`](globals.html#class-abortsignal)

Marks the given [`<AbortSignal>`](globals.html#class-abortsignal) as transferable so that it can be used with `structuredClone()` and `postMessage()`.

```
const signal = transferableAbortSignal(AbortSignal.timeout(100));
const channel = new MessageChannel();
channel.port2.postMessage(signal, [signal]);

jscopy
```

### `util.aborted(signal, resource)`[#](#utilabortedsignal-resource)

Added in: v19.7.0, v18.16.0History

| Version | Changes |
| --- | --- |
| v24.0.0, v22.16.0 | Change stability index for this feature from Experimental to Stable. |

- `signal` [`<AbortSignal>`](globals.html#class-abortsignal)
- `resource` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Any non-null object tied to the abortable operation and held weakly.
  If `resource` is garbage collected before the `signal` aborts, the promise remains pending,
  allowing Node.js to stop tracking it.
  This helps prevent memory leaks in long-running or non-cancelable operations.
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Listens to abort event on the provided `signal` and returns a promise that resolves when the `signal` is aborted.
If `resource` is provided, it weakly references the operation's associated object,
so if `resource` is garbage collected before the `signal` aborts,
then returned promise shall remain pending.
This prevents memory leaks in long-running or non-cancelable operations.

```
const { aborted } = require('node:util');

// Obtain an object with an abortable signal, like a custom resource or operation.
const dependent = obtainSomethingAbortable();

// Pass `dependent` as the resource, indicating the promise should only resolve
// if `dependent` is still in memory when the signal is aborted.
aborted(dependent.signal, dependent).then(() => {

  // This code runs when `dependent` is aborted.
  console.log('Dependent resource was aborted.');
});

// Simulate an event that triggers the abort.
dependent.on('event', () => {
  dependent.abort(); // This will cause the `aborted` promise to resolve.
});
import { aborted } from 'node:util';

// Obtain an object with an abortable signal, like a custom resource or operation.
const dependent = obtainSomethingAbortable();

// Pass `dependent` as the resource, indicating the promise should only resolve
// if `dependent` is still in memory when the signal is aborted.
aborted(dependent.signal, dependent).then(() => {

  // This code runs when `dependent` is aborted.
  console.log('Dependent resource was aborted.');
});

// Simulate an event that triggers the abort.
dependent.on('event', () => {
  dependent.abort(); // This will cause the `aborted` promise to resolve.
});

javascriptcopy
```

### `util.types`[#](#utiltypes)

Added in: v10.0.0History

| Version | Changes |
| --- | --- |
| v15.3.0 | Exposed as `require('util/types')`. |

`util.types` provides type checks for different kinds of built-in objects.
Unlike `instanceof` or `Object.prototype.toString.call(value)`, these checks do
not inspect properties of the object that are accessible from JavaScript (like
their prototype), and usually have the overhead of calling into C++.

The result generally does not make any guarantees about what kinds of
properties or behavior a value exposes in JavaScript. They are primarily
useful for addon developers who prefer to do type checking in JavaScript.

The API is accessible via `require('node:util').types` or `require('node:util/types')`.

#### `util.types.isAnyArrayBuffer(value)`[#](#utiltypesisanyarraybuffervalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) or
[`<SharedArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) instance.

See also [`util.types.isArrayBuffer()`](#utiltypesisarraybuffervalue) and
[`util.types.isSharedArrayBuffer()`](#utiltypesissharedarraybuffervalue).

```
util.types.isAnyArrayBuffer(new ArrayBuffer());  // Returns true
util.types.isAnyArrayBuffer(new SharedArrayBuffer());  // Returns true

jscopy
```

#### `util.types.isArrayBufferView(value)`[#](#utiltypesisarraybufferviewvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is an instance of one of the [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
views, such as typed array objects or [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView). Equivalent to [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

```
util.types.isArrayBufferView(new Int8Array());  // true
util.types.isArrayBufferView(Buffer.from('hello world')); // true
util.types.isArrayBufferView(new DataView(new ArrayBuffer(16)));  // true
util.types.isArrayBufferView(new ArrayBuffer());  // false

jscopy
```

#### `util.types.isArgumentsObject(value)`[#](#utiltypesisargumentsobjectvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is an `arguments` object.

```
function foo() {
  util.types.isArgumentsObject(arguments);  // Returns true
}

jscopy
```

#### `util.types.isArrayBuffer(value)`[#](#utiltypesisarraybuffervalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) instance.
This does *not* include [`<SharedArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) instances. Usually, it is
desirable to test for both; See [`util.types.isAnyArrayBuffer()`](#utiltypesisanyarraybuffervalue) for that.

```
util.types.isArrayBuffer(new ArrayBuffer());  // Returns true
util.types.isArrayBuffer(new SharedArrayBuffer());  // Returns false

jscopy
```

#### `util.types.isAsyncFunction(value)`[#](#utiltypesisasyncfunctionvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is an [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).
This only reports back what the JavaScript engine is seeing;
in particular, the return value may not match the original source code if
a transpilation tool was used.

```
util.types.isAsyncFunction(function foo() {});  // Returns false
util.types.isAsyncFunction(async function foo() {});  // Returns true

jscopy
```

#### `util.types.isBigInt64Array(value)`[#](#utiltypesisbigint64arrayvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a `BigInt64Array` instance.

```
util.types.isBigInt64Array(new BigInt64Array());   // Returns true
util.types.isBigInt64Array(new BigUint64Array());  // Returns false

jscopy
```

#### `util.types.isBigIntObject(value)`[#](#utiltypesisbigintobjectvalue)

Added in: v10.4.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a BigInt object, e.g. created
by `Object(BigInt(123))`.

```
util.types.isBigIntObject(Object(BigInt(123)));   // Returns true
util.types.isBigIntObject(BigInt(123));   // Returns false
util.types.isBigIntObject(123);  // Returns false

jscopy
```

#### `util.types.isBigUint64Array(value)`[#](#utiltypesisbiguint64arrayvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a `BigUint64Array` instance.

```
util.types.isBigUint64Array(new BigInt64Array());   // Returns false
util.types.isBigUint64Array(new BigUint64Array());  // Returns true

jscopy
```

#### `util.types.isBooleanObject(value)`[#](#utiltypesisbooleanobjectvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a boolean object, e.g. created
by `new Boolean()`.

```
util.types.isBooleanObject(false);  // Returns false
util.types.isBooleanObject(true);   // Returns false
util.types.isBooleanObject(new Boolean(false)); // Returns true
util.types.isBooleanObject(new Boolean(true));  // Returns true
util.types.isBooleanObject(Boolean(false)); // Returns false
util.types.isBooleanObject(Boolean(true));  // Returns false

jscopy
```

#### `util.types.isBoxedPrimitive(value)`[#](#utiltypesisboxedprimitivevalue)

Added in: v10.11.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is any boxed primitive object, e.g. created
by `new Boolean()`, `new String()` or `Object(Symbol())`.

For example:

```
util.types.isBoxedPrimitive(false); // Returns false
util.types.isBoxedPrimitive(new Boolean(false)); // Returns true
util.types.isBoxedPrimitive(Symbol('foo')); // Returns false
util.types.isBoxedPrimitive(Object(Symbol('foo'))); // Returns true
util.types.isBoxedPrimitive(Object(BigInt(5))); // Returns true

jscopy
```

#### `util.types.isCryptoKey(value)`[#](#utiltypesiscryptokeyvalue)

Added in: v16.2.0

- `value` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if `value` is a [`<CryptoKey>`](webcrypto.html#class-cryptokey), `false` otherwise.

#### `util.types.isDataView(value)`[#](#utiltypesisdataviewvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) instance.

```
const ab = new ArrayBuffer(20);
util.types.isDataView(new DataView(ab));  // Returns true
util.types.isDataView(new Float64Array());  // Returns false

jscopy
```

See also [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

#### `util.types.isDate(value)`[#](#utiltypesisdatevalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<Date>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) instance.

```
util.types.isDate(new Date());  // Returns true

jscopy
```

#### `util.types.isExternal(value)`[#](#utiltypesisexternalvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a native `External` value.

A native `External` value is a special type of object that contains a
raw C++ pointer (`void*`) for access from native code, and has no other
properties. Such objects are created either by Node.js internals or native
addons. In JavaScript, they are [frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) objects with a
`null` prototype.

```
import native from 'napi_addon.node';
import { types } from 'node:util';

const data = native.myNapi();
types.isExternal(data); // returns true
types.isExternal(0); // returns false
types.isExternal(new String('foo')); // returns false
const native = require('napi_addon.node');
const { types } = require('node:util');

const data = native.myNapi();
types.isExternal(data); // returns true
types.isExternal(0); // returns false
types.isExternal(new String('foo')); // returns false

javascriptcopy
```

For further information on `napi_create_external`, refer to
[`napi_create_external()`](n-api.html#napi_create_external).

#### `util.types.isFloat16Array(value)`[#](#utiltypesisfloat16arrayvalue)

Added in: v24.0.0, v22.16.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<Float16Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Float16Array) instance.

```
util.types.isFloat16Array(new ArrayBuffer());  // Returns false
util.types.isFloat16Array(new Float16Array());  // Returns true
util.types.isFloat16Array(new Float32Array());  // Returns false

jscopy
```

#### `util.types.isFloat32Array(value)`[#](#utiltypesisfloat32arrayvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<Float32Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Float32Array) instance.

```
util.types.isFloat32Array(new ArrayBuffer());  // Returns false
util.types.isFloat32Array(new Float32Array());  // Returns true
util.types.isFloat32Array(new Float64Array());  // Returns false

jscopy
```

#### `util.types.isFloat64Array(value)`[#](#utiltypesisfloat64arrayvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<Float64Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Float64Array) instance.

```
util.types.isFloat64Array(new ArrayBuffer());  // Returns false
util.types.isFloat64Array(new Uint8Array());  // Returns false
util.types.isFloat64Array(new Float64Array());  // Returns true

jscopy
```

#### `util.types.isGeneratorFunction(value)`[#](#utiltypesisgeneratorfunctionvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a generator function.
This only reports back what the JavaScript engine is seeing;
in particular, the return value may not match the original source code if
a transpilation tool was used.

```
util.types.isGeneratorFunction(function foo() {});  // Returns false
util.types.isGeneratorFunction(function* foo() {});  // Returns true

jscopy
```

#### `util.types.isGeneratorObject(value)`[#](#utiltypesisgeneratorobjectvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a generator object as returned from a
built-in generator function.
This only reports back what the JavaScript engine is seeing;
in particular, the return value may not match the original source code if
a transpilation tool was used.

```
function* foo() {}
const generator = foo();
util.types.isGeneratorObject(generator);  // Returns true

jscopy
```

#### `util.types.isInt8Array(value)`[#](#utiltypesisint8arrayvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<Int8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int8Array) instance.

```
util.types.isInt8Array(new ArrayBuffer());  // Returns false
util.types.isInt8Array(new Int8Array());  // Returns true
util.types.isInt8Array(new Float64Array());  // Returns false

jscopy
```

#### `util.types.isInt16Array(value)`[#](#utiltypesisint16arrayvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<Int16Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int16Array) instance.

```
util.types.isInt16Array(new ArrayBuffer());  // Returns false
util.types.isInt16Array(new Int16Array());  // Returns true
util.types.isInt16Array(new Float64Array());  // Returns false

jscopy
```

#### `util.types.isInt32Array(value)`[#](#utiltypesisint32arrayvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<Int32Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Int32Array) instance.

```
util.types.isInt32Array(new ArrayBuffer());  // Returns false
util.types.isInt32Array(new Int32Array());  // Returns true
util.types.isInt32Array(new Float64Array());  // Returns false

jscopy
```

#### `util.types.isKeyObject(value)`[#](#utiltypesiskeyobjectvalue)

Added in: v16.2.0

- `value` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if `value` is a [`<KeyObject>`](crypto.html#class-keyobject), `false` otherwise.

#### `util.types.isMap(value)`[#](#utiltypesismapvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<Map>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) instance.

```
util.types.isMap(new Map());  // Returns true

jscopy
```

#### `util.types.isMapIterator(value)`[#](#utiltypesismapiteratorvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is an iterator returned for a built-in
[`<Map>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) instance.

```
const map = new Map();
util.types.isMapIterator(map.keys());  // Returns true
util.types.isMapIterator(map.values());  // Returns true
util.types.isMapIterator(map.entries());  // Returns true
util.types.isMapIterator(map[Symbol.iterator]());  // Returns true

jscopy
```

#### `util.types.isModuleNamespaceObject(value)`[#](#utiltypesismodulenamespaceobjectvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is an instance of a [Module Namespace Object](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects).

```
import * as ns from './a.js';

util.types.isModuleNamespaceObject(ns);  // Returns true

mjscopy
```

#### `util.types.isNativeError(value)`[#](#utiltypesisnativeerrorvalue)

Added in: v10.0.0Deprecated in: v24.2.0

Stability: 0 - Deprecated: Use [`Error.isError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/isError) instead.

**Note:** As of Node.js 24, `Error.isError()` is currently slower than `util.types.isNativeError()`.
If performance is critical, consider benchmarking both in your environment.

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value was returned by the constructor of a
[built-in `Error` type](https://tc39.es/ecma262/#sec-error-objects).

```
console.log(util.types.isNativeError(new Error()));  // true
console.log(util.types.isNativeError(new TypeError()));  // true
console.log(util.types.isNativeError(new RangeError()));  // true

jscopy
```

Subclasses of the native error types are also native errors:

```
class MyError extends Error {}
console.log(util.types.isNativeError(new MyError()));  // true

jscopy
```

A value being `instanceof` a native error class is not equivalent to `isNativeError()`
returning `true` for that value. `isNativeError()` returns `true` for errors
which come from a different [realm](https://tc39.es/ecma262/#realm) while `instanceof Error` returns `false`
for these errors:

```
import { createContext, runInContext } from 'node:vm';
import { types } from 'node:util';

const context = createContext({});
const myError = runInContext('new Error()', context);
console.log(types.isNativeError(myError)); // true
console.log(myError instanceof Error); // false
const { createContext, runInContext } = require('node:vm');
const { types } = require('node:util');

const context = createContext({});
const myError = runInContext('new Error()', context);
console.log(types.isNativeError(myError)); // true
console.log(myError instanceof Error); // false

javascriptcopy
```

Conversely, `isNativeError()` returns `false` for all objects which were not
returned by the constructor of a native error. That includes values
which are `instanceof` native errors:

```
const myError = { __proto__: Error.prototype };
console.log(util.types.isNativeError(myError)); // false
console.log(myError instanceof Error); // true

jscopy
```

#### `util.types.isNumberObject(value)`[#](#utiltypesisnumberobjectvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a number object, e.g. created
by `new Number()`.

```
util.types.isNumberObject(0);  // Returns false
util.types.isNumberObject(new Number(0));   // Returns true

jscopy
```

#### `util.types.isPromise(value)`[#](#utiltypesispromisevalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```
util.types.isPromise(Promise.resolve(42));  // Returns true

jscopy
```

#### `util.types.isProxy(value)`[#](#utiltypesisproxyvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a [`<Proxy>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy) instance.

```
const target = {};
const proxy = new Proxy(target, {});
util.types.isProxy(target);  // Returns false
util.types.isProxy(proxy);  // Returns true

jscopy
```

#### `util.types.isRegExp(value)`[#](#utiltypesisregexpvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a regular expression object.

```
util.types.isRegExp(/abc/);  // Returns true
util.types.isRegExp(new RegExp('abc'));  // Returns true

jscopy
```

#### `util.types.isSet(value)`[#](#utiltypesissetvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<Set>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set) instance.

```
util.types.isSet(new Set());  // Returns true

jscopy
```

#### `util.types.isSetIterator(value)`[#](#utiltypesissetiteratorvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is an iterator returned for a built-in
[`<Set>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set) instance.

```
const set = new Set();
util.types.isSetIterator(set.keys());  // Returns true
util.types.isSetIterator(set.values());  // Returns true
util.types.isSetIterator(set.entries());  // Returns true
util.types.isSetIterator(set[Symbol.iterator]());  // Returns true

jscopy
```

#### `util.types.isSharedArrayBuffer(value)`[#](#utiltypesissharedarraybuffervalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<SharedArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) instance.
This does *not* include [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) instances. Usually, it is
desirable to test for both; See [`util.types.isAnyArrayBuffer()`](#utiltypesisanyarraybuffervalue) for that.

```
util.types.isSharedArrayBuffer(new ArrayBuffer());  // Returns false
util.types.isSharedArrayBuffer(new SharedArrayBuffer());  // Returns true

jscopy
```

#### `util.types.isStringObject(value)`[#](#utiltypesisstringobjectvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a string object, e.g. created
by `new String()`.

```
util.types.isStringObject('foo');  // Returns false
util.types.isStringObject(new String('foo'));   // Returns true

jscopy
```

#### `util.types.isSymbolObject(value)`[#](#utiltypesissymbolobjectvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a symbol object, created
by calling `Object()` on a `Symbol` primitive.

```
const symbol = Symbol('foo');
util.types.isSymbolObject(symbol);  // Returns false
util.types.isSymbolObject(Object(symbol));   // Returns true

jscopy
```

#### `util.types.isTypedArray(value)`[#](#utiltypesistypedarrayvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) instance.

```
util.types.isTypedArray(new ArrayBuffer());  // Returns false
util.types.isTypedArray(new Uint8Array());  // Returns true
util.types.isTypedArray(new Float64Array());  // Returns true

jscopy
```

See also [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

#### `util.types.isUint8Array(value)`[#](#utiltypesisuint8arrayvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) instance.

```
util.types.isUint8Array(new ArrayBuffer());  // Returns false
util.types.isUint8Array(new Uint8Array());  // Returns true
util.types.isUint8Array(new Float64Array());  // Returns false

jscopy
```

#### `util.types.isUint8ClampedArray(value)`[#](#utiltypesisuint8clampedarrayvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<Uint8ClampedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray) instance.

```
util.types.isUint8ClampedArray(new ArrayBuffer());  // Returns false
util.types.isUint8ClampedArray(new Uint8ClampedArray());  // Returns true
util.types.isUint8ClampedArray(new Float64Array());  // Returns false

jscopy
```

#### `util.types.isUint16Array(value)`[#](#utiltypesisuint16arrayvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<Uint16Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array) instance.

```
util.types.isUint16Array(new ArrayBuffer());  // Returns false
util.types.isUint16Array(new Uint16Array());  // Returns true
util.types.isUint16Array(new Float64Array());  // Returns false

jscopy
```

#### `util.types.isUint32Array(value)`[#](#utiltypesisuint32arrayvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<Uint32Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) instance.

```
util.types.isUint32Array(new ArrayBuffer());  // Returns false
util.types.isUint32Array(new Uint32Array());  // Returns true
util.types.isUint32Array(new Float64Array());  // Returns false

jscopy
```

#### `util.types.isWeakMap(value)`[#](#utiltypesisweakmapvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<WeakMap>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) instance.

```
util.types.isWeakMap(new WeakMap());  // Returns true

jscopy
```

#### `util.types.isWeakSet(value)`[#](#utiltypesisweaksetvalue)

Added in: v10.0.0

- `value` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Returns `true` if the value is a built-in [`<WeakSet>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) instance.

```
util.types.isWeakSet(new WeakSet());  // Returns true

jscopy
```

### Deprecated APIs[#](#deprecated-apis)

The following APIs are deprecated and should no longer be used. Existing
applications and modules should be updated to find alternative approaches.

#### `util._extend(target, source)`[#](#util_extendtarget-source)

Added in: v0.7.5Deprecated in: v6.0.0

Stability: 0 - Deprecated: Use [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) instead.

- `target` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `source` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

The `util._extend()` method was never intended to be used outside of internal
Node.js modules. The community found and used it anyway.

It is deprecated and should not be used in new code. JavaScript comes with very
similar built-in functionality through [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

An automated migration is available ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-extend-to-object-assign)):

```
npx codemod@latest @nodejs/util-extend-to-object-assign

bashcopy
```

#### `util.isArray(object)`[#](#utilisarrayobject)

Added in: v0.6.0Deprecated in: v4.0.0

Stability: 0 - Deprecated: Use [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) instead.

- `object` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Alias for [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray).

Returns `true` if the given `object` is an `Array`. Otherwise, returns `false`.

```
const util = require('node:util');

util.isArray([]);
// Returns: true
util.isArray(new Array());
// Returns: true
util.isArray({});
// Returns: false

jscopy
```

An automated migration is available ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```
npx codemod@latest @nodejs/util-is

bashcopy
```
