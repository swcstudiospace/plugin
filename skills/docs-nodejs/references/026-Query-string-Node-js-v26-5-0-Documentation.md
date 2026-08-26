# Query string | Node.js v26.5.0 Documentation

Source: https://nodejs.org/api/querystring.html

## Query string[#](#query-string)

**Source Code:** [lib/querystring.js](https://github.com/nodejs/node/blob/main/lib/querystring.js)

[Stability: 2](documentation.html#stability-index) - Stable

The `node:querystring` module provides utilities for parsing and formatting URL
query strings. It can be accessed using:

```
const querystring = require('node:querystring');

jscopy
```

`querystring` is more performant than [`<URLSearchParams>`](url.html#class-urlsearchparams) but is not a
standardized API. Use [`<URLSearchParams>`](url.html#class-urlsearchparams) when performance is not critical or
when compatibility with browser code is desirable.

### `querystring.decode()`[#](#querystringdecode)

Added in: v0.1.99

The `querystring.decode()` function is an alias for `querystring.parse()`.

### `querystring.encode()`[#](#querystringencode)

Added in: v0.1.99

The `querystring.encode()` function is an alias for `querystring.stringify()`.

### `querystring.escape(str)`[#](#querystringescapestr)

Added in: v0.1.25

- `str` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

The `querystring.escape()` method performs URL percent-encoding on the given
`str` in a manner that is optimized for the specific requirements of URL
query strings.

The `querystring.escape()` method is used by `querystring.stringify()` and is
generally not expected to be used directly. It is exported primarily to allow
application code to provide a replacement percent-encoding implementation if
necessary by assigning `querystring.escape` to an alternative function.

### `querystring.parse(str[, sep[, eq[, options]]])`[#](#querystringparsestr-sep-eq-options)

Added in: v0.1.25History

| Version | Changes |
| --- | --- |
| v8.0.0 | Multiple empty entries are now parsed correctly (e.g. `&=&=`). |
| v6.0.0 | The returned object no longer inherits from `Object.prototype`. |
| v6.0.0, v4.2.4 | The `eq` parameter may now have a length of more than `1`. |

- `str` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The URL query string to parse
- `sep` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The substring used to delimit key and value pairs in the
  query string. **Default:** `'&'`.
- `eq` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type). The substring used to delimit keys and values in the
  query string. **Default:** `'='`.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `decodeURIComponent` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The function to use when decoding
    percent-encoded characters in the query string. **Default:**
    `querystring.unescape()`.
  - `maxKeys` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Specifies the maximum number of keys to parse.
    Specify `0` to remove key counting limitations. **Default:** `1000`.

The `querystring.parse()` method parses a URL query string (`str`) into a
collection of key and value pairs.

For example, the query string `'foo=bar&abc=xyz&abc=123'` is parsed into:

```
{
  "foo": "bar",
  "abc": ["xyz", "123"]
}

jsoncopy
```

The object returned by the `querystring.parse()` method *does not*
prototypically inherit from the JavaScript `Object`. This means that typical
`Object` methods such as `obj.toString()`, `obj.hasOwnProperty()`, and others
are not defined and *will not work*.

By default, percent-encoded characters within the query string will be assumed
to use UTF-8 encoding. If an alternative character encoding is used, then an
alternative `decodeURIComponent` option will need to be specified:

```
// Assuming gbkDecodeURIComponent function already exists...

querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null,
                  { decodeURIComponent: gbkDecodeURIComponent });

jscopy
```

### `querystring.stringify(obj[, sep[, eq[, options]]])`[#](#querystringstringifyobj-sep-eq-options)

Added in: v0.1.25

- `obj` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) The object to serialize into a URL query string
- `sep` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The substring used to delimit key and value pairs in the
  query string. **Default:** `'&'`.
- `eq` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type). The substring used to delimit keys and values in the
  query string. **Default:** `'='`.
- `options`
  - `encodeURIComponent` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The function to use when converting
    URL-unsafe characters to percent-encoding in the query string. **Default:**
    `querystring.escape()`.

The `querystring.stringify()` method produces a URL query string from a
given `obj` by iterating through the object's "own properties".

It serializes the following types of values passed in `obj`:
[`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<bigint>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#bigint_type) | [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)[] | [`<bigint>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#bigint_type)[] | [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)[]
The numeric values must be finite. Any other input values will be coerced to
empty strings.

```
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// Returns 'foo=bar&baz=qux&baz=quux&corge='

querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
// Returns 'foo:bar;baz:qux'

jscopy
```

By default, characters requiring percent-encoding within the query string will
be encoded as UTF-8. If an alternative encoding is required, then an alternative
`encodeURIComponent` option will need to be specified:

```
// Assuming gbkEncodeURIComponent function already exists,

querystring.stringify({ w: '中文', foo: 'bar' }, null, null,
                      { encodeURIComponent: gbkEncodeURIComponent });

jscopy
```

### `querystring.unescape(str)`[#](#querystringunescapestr)

Added in: v0.1.25

- `str` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

The `querystring.unescape()` method performs decoding of URL percent-encoded
characters on the given `str`.

The `querystring.unescape()` method is used by `querystring.parse()` and is
generally not expected to be used directly. It is exported primarily to allow
application code to provide a replacement decoding implementation if
necessary by assigning `querystring.unescape` to an alternative function.

By default, the `querystring.unescape()` method will attempt to use the
JavaScript built-in `decodeURIComponent()` method to decode. If that fails,
a safer equivalent that does not throw on malformed URLs will be used.
