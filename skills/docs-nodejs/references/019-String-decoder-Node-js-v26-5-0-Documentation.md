# String decoder | Node.js v26.5.0 Documentation

Source: https://nodejs.org/api/string_decoder.html

## String decoder[#](#string-decoder)

**Source Code:** [lib/string\_decoder.js](https://github.com/nodejs/node/blob/main/lib/string_decoder.js)

[Stability: 2](documentation.html#stability-index) - Stable

The `node:string_decoder` module provides an API for decoding `Buffer` objects
into strings in a manner that preserves encoded multi-byte UTF-8 and UTF-16
characters. It can be accessed using:

```
import { StringDecoder } from 'node:string_decoder';
const { StringDecoder } = require('node:string_decoder');

javascriptcopy
```

The following example shows the basic use of the `StringDecoder` class.

```
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Prints: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Prints: €
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Prints: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Prints: €

javascriptcopy
```

When a `Buffer` instance is written to the `StringDecoder` instance, an
internal buffer is used to ensure that the decoded string does not contain
any incomplete multibyte characters. These are held in the buffer until the
next call to `stringDecoder.write()` or until `stringDecoder.end()` is called.

In the following example, the three UTF-8 encoded bytes of the European Euro
symbol (`€`) are written over three separate operations:

```
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Prints: €
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Prints: €

javascriptcopy
```

### Class: `StringDecoder`[#](#class-stringdecoder)

#### `new StringDecoder([encoding])`[#](#new-stringdecoderencoding)

Added in: v0.1.99

- `encoding` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The character [encoding](buffer.html#buffers-and-character-encodings) the `StringDecoder` will use.
  **Default:** `'utf8'`.

Creates a new `StringDecoder` instance.

#### `stringDecoder.end([buffer])`[#](#stringdecoderendbuffer)

Added in: v0.9.3

- `buffer` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Buffer>`](buffer.html#class-buffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) The bytes to decode.
- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Returns any remaining input stored in the internal buffer as a string. Bytes
representing incomplete UTF-8 and UTF-16 characters will be replaced with
substitution characters appropriate for the character encoding.

If the `buffer` argument is provided, one final call to `stringDecoder.write()`
is performed before returning the remaining input.
After `end()` is called, the `stringDecoder` object can be reused for new input.

#### `stringDecoder.write(buffer)`[#](#stringdecoderwritebuffer)

Added in: v0.1.99History

| Version | Changes |
| --- | --- |
| v8.0.0 | Each invalid character is now replaced by a single replacement character instead of one for each individual byte. |

- `buffer` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Buffer>`](buffer.html#class-buffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) The bytes to decode.
- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Returns a decoded string, ensuring that any incomplete multibyte characters at
the end of the `Buffer`, or `TypedArray`, or `DataView` are omitted from the
returned string and stored in an internal buffer for the next call to
`stringDecoder.write()` or `stringDecoder.end()`.
