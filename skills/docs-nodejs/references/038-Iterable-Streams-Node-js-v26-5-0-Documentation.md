# Iterable Streams | Node.js v26.5.0 Documentation

Source: https://nodejs.org/api/stream_iter.html

## Iterable Streams[#](#iterable-streams)

**Source Code:** [lib/stream/iter.js](https://github.com/nodejs/node/blob/main/lib/stream/iter.js)

[Stability: 1](documentation.html#stability-index) - Experimental

The `node:stream/iter` module provides a streaming API built on iterables
rather than the event-driven `Readable`/`Writable`/`Transform` class hierarchy,
or the Web Streams `ReadableStream`/`WritableStream`/`TransformStream` interfaces.

This module is available only when the `--experimental-stream-iter` CLI flag
is enabled.

Streams are represented as `AsyncIterable<Uint8Array[]>` (async) or
`Iterable<Uint8Array[]>` (sync). There are no base classes to extend -- any
object implementing the iterable protocol can participate. Transforms are plain
functions or objects with a `transform` method.

Data flows in **batches** (`Uint8Array[]` per iteration) to amortize the cost
of async operations.

```
import { from, pull, text } from 'node:stream/iter';
import { compressGzip, decompressGzip } from 'node:zlib/iter';

// Compress and decompress a string
const compressed = pull(from('Hello, world!'), compressGzip());
const result = await text(pull(compressed, decompressGzip()));
console.log(result); // 'Hello, world!'
const { from, pull, text } = require('node:stream/iter');
const { compressGzip, decompressGzip } = require('node:zlib/iter');

async function run() {
  // Compress and decompress a string
  const compressed = pull(from('Hello, world!'), compressGzip());
  const result = await text(pull(compressed, decompressGzip()));
  console.log(result); // 'Hello, world!'
}

run().catch(console.error);

javascriptcopy
```

```
import { open } from 'node:fs/promises';
import { text, pipeTo } from 'node:stream/iter';
import { compressGzip, decompressGzip } from 'node:zlib/iter';

// Read a file, compress, write to another file
const src = await open('input.txt', 'r');
const dst = await open('output.gz', 'w');
await pipeTo(src.pull(), compressGzip(), dst.writer({ autoClose: true }));
await src.close();

// Read it back
const gz = await open('output.gz', 'r');
console.log(await text(gz.pull(decompressGzip(), { autoClose: true })));
const { open } = require('node:fs/promises');
const { text, pipeTo } = require('node:stream/iter');
const { compressGzip, decompressGzip } = require('node:zlib/iter');

async function run() {
  // Read a file, compress, write to another file
  const src = await open('input.txt', 'r');
  const dst = await open('output.gz', 'w');
  await pipeTo(src.pull(), compressGzip(), dst.writer({ autoClose: true }));
  await src.close();

  // Read it back
  const gz = await open('output.gz', 'r');
  console.log(await text(gz.pull(decompressGzip(), { autoClose: true })));
}

run().catch(console.error);

javascriptcopy
```

### Concepts[#](#concepts)

#### Byte streams[#](#byte-streams)

All data in this API is represented as `Uint8Array` bytes. Strings
are automatically UTF-8 encoded when passed to `from()`, `push()`, or
`pipeTo()`. This removes ambiguity around encodings and enables zero-copy
transfers between streams and native code.

#### Batching[#](#batching)

Each iteration yields a **batch** -- an array of `Uint8Array` chunks
(`Uint8Array[]`). Batching amortizes the cost of `await` and Promise creation
across multiple chunks. A consumer that processes one chunk at a time can
simply iterate the inner array:

```
for await (const batch of source) {
  for (const chunk of batch) {
    handle(chunk);
  }
}
async function run() {
  for await (const batch of source) {
    for (const chunk of batch) {
      handle(chunk);
    }
  }
}

javascriptcopy
```

#### Transforms[#](#transforms)

Transforms come in two forms:

- **Stateless** -- a function `(chunks, options) => result` called once per
  batch. Receives `Uint8Array[]` (or `null` as the flush signal) and an
  `options` object. Returns `Uint8Array[]`, `null`, or an iterable of chunks.
- **Stateful** -- an object `{ transform(source, options) }` where `transform`
  is a generator (sync or async) that receives the entire upstream iterable
  and an `options` object, and yields output. This form is used for
  compression, encryption, and any transform that needs to buffer across
  batches.

Both forms receive an `options` parameter with the following property:

- `options.signal` [`<AbortSignal>`](globals.html#class-abortsignal) An AbortSignal that fires when the pipeline
  is cancelled, encounters an error, or the consumer stops reading. Transforms
  can check `signal.aborted` or listen for the `'abort'` event to perform
  early cleanup.

The flush signal (`null`) is sent after the source ends, giving transforms
a chance to emit trailing data (e.g., compression footers).

```
// Stateless: uppercase transform
const upper = (chunks) => {
  if (chunks === null) return null; // flush
  return chunks.map((c) => new TextEncoder().encode(
    new TextDecoder().decode(c).toUpperCase(),
  ));
};

// Stateful: line splitter
const lines = {
  transform: async function*(source) {
    let partial = '';
    for await (const chunks of source) {
      if (chunks === null) {
        if (partial) yield [new TextEncoder().encode(partial)];
        continue;
      }
      for (const chunk of chunks) {
        const str = partial + new TextDecoder().decode(chunk);
        const parts = str.split('\n');
        partial = parts.pop();
        for (const line of parts) {
          yield [new TextEncoder().encode(`${line}\n`)];
        }
      }
    }
  },
};

jscopy
```

#### Pull vs. push[#](#pull-vs-push)

The API supports two models:

- **Pull** -- data flows on demand. `pull()` and `pullSync()` create lazy
  pipelines that only read from the source when the consumer iterates.
- **Push** -- data is written explicitly. `push()` creates a writer/readable
  pair with backpressure. The writer pushes data in; the readable is consumed
  as an async iterable.

#### Backpressure[#](#backpressure)

Pull streams have natural backpressure -- the consumer drives the pace, so
the source is never read faster than the consumer can process. Push streams
need explicit backpressure because the producer and consumer run
independently. The `highWaterMark` and `backpressure` options on `push()`,
`broadcast()`, and `share()` control how this works.

##### The two-buffer model[#](#the-two-buffer-model)

Push streams use a two-part buffering system. Think of it like a bucket
(slots) being filled through a hose (pending writes), with a float valve
that closes when the bucket is full:

```
                          highWaterMark (e.g., 3)
                                 |
    Producer                     v
       |                    +---------+
       v                    |         |
  [ write() ] ----+    +--->| slots   |---> Consumer pulls
  [ write() ]     |    |    | (bucket)|     for await (...)
  [ write() ]     v    |    +---------+
              +--------+         ^
              | pending|         |
              | writes |    float valve
              | (hose) |    (backpressure)
              +--------+
                   ^
                   |
          'strict' mode limits this too!

textcopy
```

- **Slots (the bucket)** -- data ready for the consumer, capped at
  `highWaterMark`. When the consumer pulls, it drains all slots at once
  into a single batch.
- **Pending writes (the hose)** -- writes waiting for slot space. After
  the consumer drains, pending writes are promoted into the now-empty
  slots and their promises settle.

How each policy uses these buffers:

| Policy | Slots limit | Pending writes limit |
| --- | --- | --- |
| `'strict'` | `highWaterMark` | `highWaterMark` |
| `'block'` | `highWaterMark` | Unbounded |
| `'drop-oldest'` | `highWaterMark` | N/A (never waits) |
| `'drop-newest'` | `highWaterMark` | N/A (never waits) |

##### Strict (default)[#](#strict-default)

Strict mode catches "fire-and-forget" patterns where the producer calls
`write()` without awaiting, which would cause unbounded memory growth.
It limits both the slots buffer and the pending writes queue to
`highWaterMark`.

If you properly await each write, you can only ever have one pending
write at a time (yours), so you never hit the pending writes limit.
Unawaited writes accumulate in the pending queue and throw once it
overflows:

```
import { push, text } from 'node:stream/iter';

const { writer, readable } = push({ highWaterMark: 16 });

// Consumer must run concurrently -- without it, the first write
// that fills the buffer blocks the producer forever.
const consuming = text(readable);

// GOOD: awaited writes. The producer waits for the consumer to
// make room when the buffer is full.
for (const item of dataset) {
  await writer.write(item);
}
await writer.end();
console.log(await consuming);
const { push, text } = require('node:stream/iter');

async function run() {
  const { writer, readable } = push({ highWaterMark: 16 });

  // Consumer must run concurrently -- without it, the first write
  // that fills the buffer blocks the producer forever.
  const consuming = text(readable);

  // GOOD: awaited writes. The producer waits for the consumer to
  // make room when the buffer is full.
  for (const item of dataset) {
    await writer.write(item);
  }
  await writer.end();
  console.log(await consuming);
}

run().catch(console.error);

javascriptcopy
```

Forgetting to `await` will eventually throw:

```
// BAD: fire-and-forget. Strict mode throws once both buffers fill.
for (const item of dataset) {
  writer.write(item); // Not awaited -- queues without bound
}
// --> throws "Backpressure violation: too many pending writes"

jscopy
```

##### Block[#](#block)

Block mode caps slots at `highWaterMark` but places no limit on the
pending writes queue. Awaited writes block until the consumer makes room,
just like strict mode. The difference is that unawaited writes silently
queue forever instead of throwing -- a potential memory leak if the
producer forgets to `await`.

This is the mode that existing Node.js classic streams and Web Streams
default to. Use it when you control the producer and know it awaits
properly, or when migrating code from those APIs.

```
import { push, text } from 'node:stream/iter';

const { writer, readable } = push({
  highWaterMark: 16,
  backpressure: 'block',
});

const consuming = text(readable);

// Safe -- awaited writes block until the consumer reads.
for (const item of dataset) {
  await writer.write(item);
}
await writer.end();
console.log(await consuming);
const { push, text } = require('node:stream/iter');

async function run() {
  const { writer, readable } = push({
    highWaterMark: 16,
    backpressure: 'block',
  });

  const consuming = text(readable);

  // Safe -- awaited writes block until the consumer reads.
  for (const item of dataset) {
    await writer.write(item);
  }
  await writer.end();
  console.log(await consuming);
}

run().catch(console.error);

javascriptcopy
```

##### Drop-oldest[#](#drop-oldest)

Writes never wait. When the slots buffer is full, the oldest buffered
chunk is evicted to make room for the incoming write. The consumer
always sees the most recent data. Useful for live feeds, telemetry, or
any scenario where stale data is less valuable than current data.

```
import { push } from 'node:stream/iter';

// Keep only the 5 most recent readings
const { writer, readable } = push({
  highWaterMark: 5,
  backpressure: 'drop-oldest',
});
const { push } = require('node:stream/iter');

// Keep only the 5 most recent readings
const { writer, readable } = push({
  highWaterMark: 5,
  backpressure: 'drop-oldest',
});

javascriptcopy
```

##### Drop-newest[#](#drop-newest)

Writes never wait. When the slots buffer is full, the incoming write is
silently discarded. The consumer processes what is already buffered
without being overwhelmed by new data. Useful for rate-limiting or
shedding load under pressure.

```
import { push } from 'node:stream/iter';

// Accept up to 10 buffered items; discard anything beyond that
const { writer, readable } = push({
  highWaterMark: 10,
  backpressure: 'drop-newest',
});
const { push } = require('node:stream/iter');

// Accept up to 10 buffered items; discard anything beyond that
const { writer, readable } = push({
  highWaterMark: 10,
  backpressure: 'drop-newest',
});

javascriptcopy
```

#### Writer interface[#](#writer-interface)

A writer is any object conforming to the Writer interface. Only `write()` is
required; all other methods are optional.

Each async method has a synchronous `*Sync` counterpart designed for a
try-fallback pattern: attempt the fast synchronous path first, and fall back
to the async version only when the synchronous call indicates it could not
complete:

```
if (!writer.writeSync(chunk)) await writer.write(chunk);
if (!writer.writevSync(chunks)) await writer.writev(chunks);
if (writer.endSync() < 0) await writer.end();
writer.fail(err);  // Always synchronous, no fallback needed

mjscopy
```

##### `writer.desiredSize`[#](#writerdesiredsize)

- [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type)

The number of buffer slots available before the high water mark is reached.
Returns `null` if the writer is closed or the consumer has disconnected.

The value is always non-negative.

##### `writer.end([options])`[#](#writerendoptions)

- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal) Cancel just this operation. The signal cancels only
    the pending `end()` call; it does not fail the writer itself.
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with the total number of bytes written.

Signal that no more data will be written.

##### `writer.endSync()`[#](#writerendsync)

- Returns: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Total bytes written, or `-1` if the writer is not open.

Synchronous variant of `writer.end()`. Returns `-1` if the writer is already
closed or errored. Can be used as a try-fallback pattern:

```
const result = writer.endSync();
if (result < 0) {
  writer.end();
}

cjscopy
```

##### `writer.fail(reason)`[#](#writerfailreason)

- `reason` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)

Put the writer into a terminal error state. If the writer is already closed
or errored, this is a no-op. Unlike `write()` and `end()`, `fail()` is
unconditionally synchronous because failing a writer is a pure state
transition with no async work to perform.

##### `writer.write(chunk[, options])`[#](#writerwritechunk-options)

- `chunk` [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal) Cancel just this write operation. The signal cancels
    only the pending `write()` call; it does not fail the writer itself.
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with `undefined` when buffer space is available.

Write a chunk.

##### `writer.writeSync(chunk)`[#](#writerwritesyncchunk)

- `chunk` [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) `true` if the write was accepted, `false` if the
  buffer is full.

Synchronous write. Does not block; returns `false` if backpressure is active.

##### `writer.writev(chunks[, options])`[#](#writerwritevchunks-options)

- `chunks` [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[] | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[]
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal) Cancel just this write operation. The signal cancels
    only the pending `writev()` call; it does not fail the writer itself.
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Write multiple chunks as a single batch.

##### `writer.writevSync(chunks)`[#](#writerwritevsyncchunks)

- `chunks` [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[] | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[]
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) `true` if the write was accepted, `false` if the
  buffer is full.

Synchronous batch write.

### The `stream/iter` module[#](#the-streamiter-module)

All functions are available both as named exports and as properties of the
`Stream` namespace object:

```
// Named exports
import { from, pull, bytes, Stream } from 'node:stream/iter';

// Namespace access
Stream.from('hello');
// Named exports
const { from, pull, bytes, Stream } = require('node:stream/iter');

// Namespace access
Stream.from('hello');

javascriptcopy
```

Including the `node:` prefix on the module specifier is optional.

### Sources[#](#sources)

#### `from(input)`[#](#frominput)

Added in: v25.9.0

- `input` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | `<ArrayBufferView>` | [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) | [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  Must not be `null` or `undefined`.
- Returns: [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>

Create an async byte stream from the given input. Strings are UTF-8 encoded.
`ArrayBuffer` and `ArrayBufferView` values are wrapped as `Uint8Array`. Arrays
and iterables are recursively flattened and normalized.

Objects implementing `Symbol.for('Stream.toAsyncStreamable')` or
`Symbol.for('Stream.toStreamable')` are converted via those protocols. The
`toAsyncStreamable` protocol takes precedence over `toStreamable`, which takes
precedence over the iteration protocols (`Symbol.asyncIterator`,
`Symbol.iterator`).

```
import { Buffer } from 'node:buffer';
import { from, text } from 'node:stream/iter';

console.log(await text(from('hello')));       // 'hello'
console.log(await text(from(Buffer.from('hello')))); // 'hello'
const { Buffer } = require('node:buffer');
const { from, text } = require('node:stream/iter');

async function run() {
  console.log(await text(from('hello')));       // 'hello'
  console.log(await text(from(Buffer.from('hello')))); // 'hello'
}

run().catch(console.error);

javascriptcopy
```

#### `fromSync(input)`[#](#fromsyncinput)

Added in: v25.9.0

- `input` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | `<ArrayBufferView>` | [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  Must not be `null` or `undefined`.
- Returns: [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>

Synchronous version of [`from()`](#frominput). Returns a sync iterable. Cannot accept
async iterables or promises. Objects implementing
`Symbol.for('Stream.toStreamable')` are converted via that protocol (takes
precedence over `Symbol.iterator`). The `toAsyncStreamable` protocol is
ignored entirely.

```
import { fromSync, textSync } from 'node:stream/iter';

console.log(textSync(fromSync('hello'))); // 'hello'
const { fromSync, textSync } = require('node:stream/iter');

console.log(textSync(fromSync('hello'))); // 'hello'

javascriptcopy
```

### Pipelines[#](#pipelines)

#### `pipeTo(source[, ...transforms], writer[, options])`[#](#pipetosource-transforms-writer-options)

Added in: v25.9.0

- `source` [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) The data source.
- `...transforms` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Zero or more transforms to apply.
- `writer` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Destination with `write(chunk)` method.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal) Abort the pipeline.
  - `preventClose` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, do not call `writer.end()` when
    the source ends. **Default:** `false`.
  - `preventFail` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If `true`, do not call `writer.fail()` on
    error. **Default:** `false`.
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with the total number of bytes written.

Pipe a source through transforms into a writer. If the writer has a
`writev(chunks)` method, entire batches are passed in a single call (enabling
scatter/gather I/O).

If the writer implements the optional `*Sync` methods (`writeSync`, `writevSync`,
`endSync`), `pipeTo()` will attempt to use the synchronous methods
first as a fast path, and fall back to the async versions only when the sync
methods indicate they cannot complete (e.g., backpressure or waiting for the
next tick). `fail()` is always called synchronously.

```
import { from, pipeTo } from 'node:stream/iter';
import { compressGzip } from 'node:zlib/iter';
import { open } from 'node:fs/promises';

const fh = await open('output.gz', 'w');
const totalBytes = await pipeTo(
  from('Hello, world!'),
  compressGzip(),
  fh.writer({ autoClose: true }),
);
const { from, pipeTo } = require('node:stream/iter');
const { compressGzip } = require('node:zlib/iter');
const { open } = require('node:fs/promises');

async function run() {
  const fh = await open('output.gz', 'w');
  const totalBytes = await pipeTo(
    from('Hello, world!'),
    compressGzip(),
    fh.writer({ autoClose: true }),
  );
}

run().catch(console.error);

javascriptcopy
```

#### `pipeToSync(source[, ...transforms], writer[, options])`[#](#pipetosyncsource-transforms-writer-options)

Added in: v25.9.0

- `source` [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) The sync data source.
- `...transforms` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Zero or more sync transforms.
- `writer` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Destination with `write(chunk)` method.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `preventClose` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) **Default:** `false`.
  - `preventFail` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) **Default:** `false`.
- Returns: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Total bytes written.

Synchronous version of [`pipeTo()`](#pipetosource-transforms-writer-options). The `source`, all transforms, and the
`writer` must be synchronous. Cannot accept async iterables or promises.

The `writer` must have the `*Sync` methods (`writeSync`, `writevSync`,
`endSync`) and `fail()` for this to work.

#### `pull(source[, ...transforms][, options])`[#](#pullsource-transforms-options)

Added in: v25.9.0

- `source` [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) The data source.
- `...transforms` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Zero or more transforms to apply.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal) Abort the pipeline.
- Returns: [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>

Create a lazy async pipeline. Data is not read from `source` until the
returned iterable is consumed. Transforms are applied in order.

```
import { from, pull, text } from 'node:stream/iter';

const asciiUpper = (chunks) => {
  if (chunks === null) return null;
  return chunks.map((c) => {
    for (let i = 0; i < c.length; i++) {
      c[i] -= (c[i] >= 97 && c[i] <= 122) * 32;
    }
    return c;
  });
};

const result = pull(from('hello'), asciiUpper);
console.log(await text(result)); // 'HELLO'
const { from, pull, text } = require('node:stream/iter');

const asciiUpper = (chunks) => {
  if (chunks === null) return null;
  return chunks.map((c) => {
    for (let i = 0; i < c.length; i++) {
      c[i] -= (c[i] >= 97 && c[i] <= 122) * 32;
    }
    return c;
  });
};

async function run() {
  const result = pull(from('hello'), asciiUpper);
  console.log(await text(result)); // 'HELLO'
}

run().catch(console.error);

javascriptcopy
```

Using an `AbortSignal`:

```
import { pull } from 'node:stream/iter';

const ac = new AbortController();
const result = pull(source, transform, { signal: ac.signal });
ac.abort(); // Pipeline throws AbortError on next iteration
const { pull } = require('node:stream/iter');

const ac = new AbortController();
const result = pull(source, transform, { signal: ac.signal });
ac.abort(); // Pipeline throws AbortError on next iteration

javascriptcopy
```

#### `pullSync(source[, ...transforms])`[#](#pullsyncsource-transforms)

Added in: v25.9.0

- `source` [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) The sync data source.
- `...transforms` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Zero or more sync transforms.
- Returns: [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>

Synchronous version of [`pull()`](#pullsource-transforms-options). All transforms must be synchronous.

### Push streams[#](#push-streams)

#### `push([...transforms][, options])`[#](#pushtransforms-options)

Added in: v25.9.0

- `...transforms` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional transforms applied to the
  readable side.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `highWaterMark` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of buffered slots before
    backpressure is applied. Must be >= 1; values below 1 are clamped to 1. **Default:** `4`.
  - `backpressure` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Backpressure policy: `'strict'`, `'block'`,
    `'drop-oldest'`, or `'drop-newest'`. **Default:** `'strict'`.
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal) Abort the stream.
- Returns: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `writer` {PushWriter} The writer side.
  - `readable` [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]> The readable side.

Create a push stream with backpressure. The writer pushes data in; the
readable side is consumed as an async iterable.

```
import { push, text } from 'node:stream/iter';

const { writer, readable } = push();

// Producer and consumer must run concurrently. With strict backpressure
// (the default), awaited writes block until the consumer reads.
const producing = (async () => {
  await writer.write('hello');
  await writer.write(' world');
  await writer.end();
})();

console.log(await text(readable)); // 'hello world'
await producing;
const { push, text } = require('node:stream/iter');

async function run() {
  const { writer, readable } = push();

  // Producer and consumer must run concurrently. With strict backpressure
  // (the default), awaited writes block until the consumer reads.
  const producing = (async () => {
    await writer.write('hello');
    await writer.write(' world');
    await writer.end();
  })();

  console.log(await text(readable)); // 'hello world'
  await producing;
}

run().catch(console.error);

javascriptcopy
```

The writer returned by `push()` conforms to the [Writer interface][].

### Duplex channels[#](#duplex-channels)

#### `duplex([options])`[#](#duplexoptions)

Added in: v25.9.0

- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `highWaterMark` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Buffer size for both directions. **Default:** `4`.
  - `backpressure` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Policy for both directions. **Default:** `'strict'`.
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal) Cancellation signal for both channels.
  - `a` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Options specific to the A-to-B direction. Overrides
    shared options.
    - `highWaterMark` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)
    - `backpressure` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
  - `b` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Options specific to the B-to-A direction. Overrides
    shared options.
    - `highWaterMark` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)
    - `backpressure` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- Returns: [`<Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) A pair `[channelA, channelB]` of duplex channels.

Create a pair of connected duplex channels for bidirectional communication,
similar to `socketpair()`. Data written to one channel's writer appears in
the other channel's readable.

Each channel has:

- `writer` — a [Writer interface][] object for sending data to the peer.
- `readable` — an `AsyncIterable<Uint8Array[]>` for reading data from
  the peer.
- `close()` — close this end of the channel (idempotent).
- `[Symbol.asyncDispose]()` — async dispose support for `await using`.

```
import { duplex, text } from 'node:stream/iter';

const [client, server] = duplex();

// Server echoes back
const serving = (async () => {
  for await (const chunks of server.readable) {
    await server.writer.writev(chunks);
  }
})();

await client.writer.write('hello');
await client.writer.end();

console.log(await text(server.readable)); // handled by echo
await serving;
const { duplex, text } = require('node:stream/iter');

async function run() {
  const [client, server] = duplex();

  // Server echoes back
  const serving = (async () => {
    for await (const chunks of server.readable) {
      await server.writer.writev(chunks);
    }
  })();

  await client.writer.write('hello');
  await client.writer.end();

  console.log(await text(server.readable)); // handled by echo
  await serving;
}

run().catch(console.error);

javascriptcopy
```

### Consumers[#](#consumers)

#### `array(source[, options])`[#](#arraysource-options)

Added in: v25.9.0

- `source` [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]> | [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal)
  - `limit` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of bytes to consume. If the total bytes
    collected exceeds limit, an `ERR_OUT_OF_RANGE` error is thrown
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an array of `Uint8Array` objects.

Collect all chunks as an array of `Uint8Array` values (without concatenating).

#### `arrayBuffer(source[, options])`[#](#arraybuffersource-options)

Added in: v25.9.0

- `source` [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]> | [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal)
  - `limit` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of bytes to consume. If the total bytes
    collected exceeds limit, an `ERR_OUT_OF_RANGE` error is thrown
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an `ArrayBuffer` object.

Collect all bytes into an `ArrayBuffer`.

#### `arrayBufferSync(source[, options])`[#](#arraybuffersyncsource-options)

Added in: v25.9.0

- `source` [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `limit` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of bytes to consume. If the total bytes
    collected exceeds limit, an `ERR_OUT_OF_RANGE` error is thrown
- Returns: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Synchronous version of [`arrayBuffer()`](#arraybuffersource-options).

#### `arraySync(source[, options])`[#](#arraysyncsource-options)

Added in: v25.9.0

- `source` [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `limit` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of bytes to consume. If the total bytes
    collected exceeds limit, an `ERR_OUT_OF_RANGE` error is thrown
- Returns: [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]

Synchronous version of [`array()`](#arraysource-options).

#### `bytes(source[, options])`[#](#bytessource-options)

Added in: v25.9.0

- `source` [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]> | [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal)
  - `limit` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of bytes to consume. If the total bytes
    collected exceeds limit, an `ERR_OUT_OF_RANGE` error is thrown
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an `Uint8Array` object.

Collect all bytes from a stream into a single `Uint8Array`.

```
import { from, bytes } from 'node:stream/iter';

const data = await bytes(from('hello'));
console.log(data); // Uint8Array(5) [ 104, 101, 108, 108, 111 ]
const { from, bytes } = require('node:stream/iter');

async function run() {
  const data = await bytes(from('hello'));
  console.log(data); // Uint8Array(5) [ 104, 101, 108, 108, 111 ]
}

run().catch(console.error);

javascriptcopy
```

#### `bytesSync(source[, options])`[#](#bytessyncsource-options)

Added in: v25.9.0

- `source` [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `limit` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of bytes to consume. If the total bytes
    collected exceeds limit, an `ERR_OUT_OF_RANGE` error is thrown
- Returns: [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Synchronous version of [`bytes()`](#bytessource-options).

#### `text(source[, options])`[#](#textsource-options)

Added in: v25.9.0

- `source` [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]> | [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `encoding` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Text encoding. **Default:** `'utf-8'`.
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal)
  - `limit` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of bytes to consume. If the total bytes
    collected exceeds limit, an `ERR_OUT_OF_RANGE` error is thrown
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with a `string`.

Collect all bytes and decode as text.

```
import { from, text } from 'node:stream/iter';

console.log(await text(from('hello'))); // 'hello'
const { from, text } = require('node:stream/iter');

async function run() {
  console.log(await text(from('hello'))); // 'hello'
}

run().catch(console.error);

javascriptcopy
```

#### `textSync(source[, options])`[#](#textsyncsource-options)

Added in: v25.9.0

- `source` [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `encoding` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) **Default:** `'utf-8'`.
  - `limit` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Maximum number of bytes to consume. If the total bytes
    collected exceeds limit, an `ERR_OUT_OF_RANGE` error is thrown
- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Synchronous version of [`text()`](#textsource-options).

### Utilities[#](#utilities)

#### `ondrain(drainable)`[#](#ondraindrainable)

Added in: v25.9.0

- `drainable` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) An object implementing the drainable protocol.
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type)

Wait for a drainable writer's backpressure to clear. Returns `null` if
the object does not implement the drainable protocol, or a promise that
fulfills with `true` when the writer can accept more data.

```
import { push, ondrain, text } from 'node:stream/iter';

const { writer, readable } = push({ highWaterMark: 2 });
writer.writeSync('a');
writer.writeSync('b');

// Start consuming so the buffer can actually drain
const consuming = text(readable);

// Buffer is full -- wait for drain
const canWrite = await ondrain(writer);
if (canWrite) {
  await writer.write('c');
}
await writer.end();
await consuming;
const { push, ondrain, text } = require('node:stream/iter');

async function run() {
  const { writer, readable } = push({ highWaterMark: 2 });
  writer.writeSync('a');
  writer.writeSync('b');

  // Start consuming so the buffer can actually drain
  const consuming = text(readable);

  // Buffer is full -- wait for drain
  const canWrite = await ondrain(writer);
  if (canWrite) {
    await writer.write('c');
  }
  await writer.end();
  await consuming;
}

run().catch(console.error);

javascriptcopy
```

#### `merge(...sources[, options])`[#](#mergesources-options)

Added in: v25.9.0

- `...sources` [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]> | [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]> Two or more iterables.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal)
- Returns: [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>

Merge multiple async iterables by yielding batches in temporal order
(whichever source produces data first). All sources are consumed
concurrently.

```
import { from, merge, text } from 'node:stream/iter';

const merged = merge(from('hello '), from('world'));
console.log(await text(merged)); // Order depends on timing
const { from, merge, text } = require('node:stream/iter');

async function run() {
  const merged = merge(from('hello '), from('world'));
  console.log(await text(merged)); // Order depends on timing
}

run().catch(console.error);

javascriptcopy
```

#### `tap(callback)`[#](#tapcallback)

Added in: v25.9.0

- `callback` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) `(chunks) => void` Called with each batch.
- Returns: [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) A stateless transform.

Create a pass-through transform that observes batches without modifying them.
Useful for logging, metrics, or debugging.

```
import { from, pull, text, tap } from 'node:stream/iter';

const result = pull(
  from('hello'),
  tap((chunks) => console.log('Batch size:', chunks.length)),
);
console.log(await text(result));
const { from, pull, text, tap } = require('node:stream/iter');

async function run() {
  const result = pull(
    from('hello'),
    tap((chunks) => console.log('Batch size:', chunks.length)),
  );
  console.log(await text(result));
}

run().catch(console.error);

javascriptcopy
```

`tap()` intentionally does not prevent in-place modification of the
chunks by the tapping callback; but return values are ignored.

#### `tapSync(callback)`[#](#tapsynccallback)

Added in: v25.9.0

- `callback` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

Synchronous version of [`tap()`](#tapcallback).

### Multi-consumer[#](#multi-consumer)

#### `broadcast([options])`[#](#broadcastoptions)

Added in: v25.9.0

- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `highWaterMark` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Buffer size in slots. Must be >= 1; values
    below 1 are clamped to 1. **Default:** `16`.
  - `backpressure` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) `'strict'`, `'block'`, `'drop-oldest'`, or
    `'drop-newest'`. **Default:** `'strict'`.
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal)
- Returns: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `writer` {BroadcastWriter}
  - `broadcast` {Broadcast}

Create a push-model multi-consumer broadcast channel. A single writer pushes
data to multiple consumers. Each consumer has an independent cursor into a
shared buffer.

```
import { broadcast, text } from 'node:stream/iter';

const { writer, broadcast: bc } = broadcast();

// Create consumers before writing
const c1 = bc.push();  // Consumer 1
const c2 = bc.push();  // Consumer 2

// Producer and consumers must run concurrently. Awaited writes
// block when the buffer fills until consumers read.
const producing = (async () => {
  await writer.write('hello');
  await writer.end();
})();

const [r1, r2] = await Promise.all([text(c1), text(c2)]);
console.log(r1); // 'hello'
console.log(r2); // 'hello'
await producing;
const { broadcast, text } = require('node:stream/iter');

async function run() {
  const { writer, broadcast: bc } = broadcast();

  // Create consumers before writing
  const c1 = bc.push();  // Consumer 1
  const c2 = bc.push();  // Consumer 2

  // Producer and consumers must run concurrently. Awaited writes
  // block when the buffer fills until consumers read.
  const producing = (async () => {
    await writer.write('hello');
    await writer.end();
  })();

  const [r1, r2] = await Promise.all([text(c1), text(c2)]);
  console.log(r1); // 'hello'
  console.log(r2); // 'hello'
  await producing;
}

run().catch(console.error);

javascriptcopy
```

##### `broadcast.bufferSize`[#](#broadcastbuffersize)

- [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The number of chunks currently buffered.

##### `broadcast.cancel([reason])`[#](#broadcastcancelreason)

- `reason` [`<Error>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)

Cancel the broadcast. All consumers receive an error.

##### `broadcast.consumerCount`[#](#broadcastconsumercount)

- [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The number of active consumers.

##### `broadcast.push([...transforms][, options])`[#](#broadcastpushtransforms-options)

- `...transforms` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal)
- Returns: [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>

Create a new consumer. Each consumer receives all data written to the
broadcast from the point of subscription onward. Optional transforms are
applied to this consumer's view of the data.

##### `broadcast[Symbol.dispose]()`[#](#broadcastsymboldispose)

Alias for `broadcast.cancel()`.

#### `Broadcast.from(input[, options])`[#](#broadcastfrominput-options)

Added in: v25.9.0

- `input` [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) | `<Broadcastable>`
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Same as `broadcast()`.
- Returns: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) `{ writer, broadcast }`

Create a {Broadcast} from an existing source. The source is consumed
automatically and pushed to all subscribers.

#### `share(source[, options])`[#](#sharesource-options)

Added in: v25.9.0

- `source` [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface) The source to share.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `highWaterMark` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Buffer size. Must be >= 1; values below 1
    are clamped to 1. **Default:** `16`.
  - `backpressure` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) `'strict'`, `'block'`, `'drop-oldest'`, or
    `'drop-newest'`. **Default:** `'strict'`.
- Returns: {Share}

Create a pull-model multi-consumer shared stream. Unlike `broadcast()`, the
source is only read when a consumer pulls. Multiple consumers share a single
buffer.

```
import { from, share, text } from 'node:stream/iter';

const shared = share(from('hello'));

const c1 = shared.pull();
const c2 = shared.pull();

// Consume concurrently to avoid deadlock with small buffers.
const [r1, r2] = await Promise.all([text(c1), text(c2)]);
console.log(r1); // 'hello'
console.log(r2); // 'hello'
const { from, share, text } = require('node:stream/iter');

async function run() {
  const shared = share(from('hello'));

  const c1 = shared.pull();
  const c2 = shared.pull();

  // Consume concurrently to avoid deadlock with small buffers.
  const [r1, r2] = await Promise.all([text(c1), text(c2)]);
  console.log(r1); // 'hello'
  console.log(r2); // 'hello'
}

run().catch(console.error);

javascriptcopy
```

##### `share.bufferSize`[#](#sharebuffersize)

- [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The number of chunks currently buffered.

##### `share.cancel([reason])`[#](#sharecancelreason)

- `reason` [`<Error>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)

Cancel the share. All consumers receive an error.

##### `share.consumerCount`[#](#shareconsumercount)

- [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The number of active consumers.

##### `share.pull([...transforms][, options])`[#](#sharepulltransforms-options)

- `...transforms` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal)
- Returns: [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]>

Create a new consumer of the shared source.

##### `share[Symbol.dispose]()`[#](#sharesymboldispose)

Alias for `share.cancel()`.

#### `Share.from(input[, options])`[#](#sharefrominput-options)

Added in: v25.9.0

- `input` [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | `<Shareable>`
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Same as `share()`.
- Returns: {Share}

Create a {Share} from an existing source.

#### `shareSync(source[, options])`[#](#sharesyncsource-options)

Added in: v25.9.0

- `source` [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) The sync source to share.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `highWaterMark` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Must be >= 1; values below 1 are clamped
    to 1. **Default:** `16`.
  - `backpressure` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) **Default:** `'strict'`.
- Returns: {SyncShare}

Synchronous version of [`share()`](#sharesource-options).

#### `SyncShare.fromSync(input[, options])`[#](#syncsharefromsyncinput-options)

Added in: v25.9.0

- `input` [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) | `<SyncShareable>`
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Returns: {SyncShare}

### Compression and decompression transforms[#](#compression-and-decompression-transforms)

Compression and decompression transforms for use with `pull()`, `pullSync()`,
`pipeTo()`, and `pipeToSync()` are available via the [`node:zlib/iter`](zlib.html#iterable-compression)
module. See the [`node:zlib/iter` documentation](zlib.html#iterable-compression) for details.

### Classic stream interop[#](#classic-stream-interop)

These utility functions bridge between classic
[`stream.Readable`](stream.html#class-streamreadable)/[`stream.Writable`](stream.html#class-streamwritable) streams and the `stream/iter`
API.

Both `fromReadable()` and `fromWritable()` accept duck-typed objects -- they
do not require the input to extend `stream.Readable` or `stream.Writable`
directly. The minimum contract is described below for each function.

#### `fromReadable(readable)`[#](#fromreadablereadable)

Added in: v26.1.0

Stability: 1 - Experimental

- `readable` [`<stream.Readable>`](stream.html#class-streamreadable) | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) A classic Readable stream or any object
  with `read()`, `on()`, and `off()` methods.
- Returns: [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface)<[`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)[]> A stream/iter async iterable source.

Converts a classic Readable stream (or duck-typed equivalent) into a
stream/iter async iterable source that can be passed to [`from()`](#frominput),
[`pull()`](#pullsource-transforms-options), [`text()`](#textsource-options), etc.

If the object implements the [`toAsyncStreamable`](#streamtoasyncstreamable) protocol (as
`stream.Readable` does), that protocol is used. Otherwise, the function
duck-types on `read()`, `on()`, and `off()` (EventEmitter) and wraps the
stream with a batched async iterator.

The result is cached per instance -- calling `fromReadable()` twice with the
same stream returns the same iterable.

For object-mode or encoded Readable streams, chunks are automatically
normalized to `Uint8Array`.

```
import { Readable } from 'node:stream';
import { fromReadable, text } from 'node:stream/iter';

const readable = new Readable({
  read() { this.push('hello world'); this.push(null); },
});

const result = await text(fromReadable(readable));
console.log(result); // 'hello world'
const { Readable } = require('node:stream');
const { fromReadable, text } = require('node:stream/iter');

const readable = new Readable({
  read() { this.push('hello world'); this.push(null); },
});

async function run() {
  const result = await text(fromReadable(readable));
  console.log(result); // 'hello world'
}
run();

javascriptcopy
```

#### `fromWritable(writable[, options])`[#](#fromwritablewritable-options)

Added in: v26.1.0

Stability: 1 - Experimental

- `writable` [`<stream.Writable>`](stream.html#class-streamwritable) | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) A classic Writable stream or any object
  with `write()` and `on()` methods.
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `backpressure` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Backpressure policy. **Default:** `'strict'`.
    - `'strict'` -- writes are rejected when the buffer is full. Catches
      callers that ignore backpressure.
    - `'block'` -- writes wait for drain when the buffer is full. Recommended
      for use with [`pipeTo()`](#pipetosource-transforms-writer-options).
    - `'drop-newest'` -- writes are silently discarded when the buffer is full.
    - `'drop-oldest'` -- **not supported**. Throws `ERR_INVALID_ARG_VALUE`.
- Returns: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) A stream/iter Writer adapter.

Creates a stream/iter Writer adapter from a classic Writable stream (or
duck-typed equivalent). The adapter can be passed to [`pipeTo()`](#pipetosource-transforms-writer-options) as a
destination.

Since all writes on a classic Writable are fundamentally asynchronous,
the synchronous Writer methods (`writeSync`, `writevSync`, `endSync`) always
return `false` or `-1`, deferring to the async path. The per-write
`options.signal` parameter from the Writer interface is also ignored.

The result is cached per instance and backpressure policy -- calling
`fromWritable()` twice with the same stream and `backpressure` option returns
the same Writer.

For duck-typed streams that do not expose `writableHighWaterMark`,
`writableLength`, or similar properties, sensible defaults are used.
Object-mode writables (if detectable) are rejected since the Writer
interface is bytes-only.

```
import { Writable } from 'node:stream';
import { from, fromWritable, pipeTo } from 'node:stream/iter';

const writable = new Writable({
  write(chunk, encoding, cb) { console.log(chunk.toString()); cb(); },
});

await pipeTo(from('hello world'),
             fromWritable(writable, { backpressure: 'block' }));
const { Writable } = require('node:stream');
const { from, fromWritable, pipeTo } = require('node:stream/iter');

async function run() {
  const writable = new Writable({
    write(chunk, encoding, cb) { console.log(chunk.toString()); cb(); },
  });

  await pipeTo(from('hello world'),
               fromWritable(writable, { backpressure: 'block' }));
}
run();

javascriptcopy
```

#### `toReadable(source[, options])`[#](#toreadablesource-options)

Added in: v26.1.0

Stability: 1 - Experimental

- `source` [`<AsyncIterable>`](https://tc39.github.io/ecma262/#sec-asynciterable-interface) An `AsyncIterable<Uint8Array[]>` source, such as
  the return value of [`pull()`](#pullsource-transforms-options) or [`from()`](#frominput).
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `highWaterMark` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The internal buffer size in bytes before
    backpressure is applied. **Default:** `65536` (64 KB).
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal) An optional signal to abort the readable.
- Returns: [`<stream.Readable>`](stream.html#class-streamreadable)

Creates a byte-mode [`stream.Readable`](stream.html#class-streamreadable) from an `AsyncIterable<Uint8Array[]>`
(the native batch format used by the stream/iter API). Each `Uint8Array` in a
yielded batch is pushed as a separate chunk into the Readable.

```
import { createWriteStream } from 'node:fs';
import { from, pull, toReadable } from 'node:stream/iter';
import { compressGzip } from 'node:zlib/iter';

const source = pull(from('hello world'), compressGzip());
const readable = toReadable(source);

readable.pipe(createWriteStream('output.gz'));
const { createWriteStream } = require('node:fs');
const { from, pull, toReadable } = require('node:stream/iter');
const { compressGzip } = require('node:zlib/iter');

const source = pull(from('hello world'), compressGzip());
const readable = toReadable(source);

readable.pipe(createWriteStream('output.gz'));

javascriptcopy
```

#### `toReadableSync(source[, options])`[#](#toreadablesyncsource-options)

Added in: v26.1.0

Stability: 1 - Experimental

- `source` [`<Iterable>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) An `Iterable<Uint8Array[]>` source, such as the
  return value of [`pullSync()`](#pullsyncsource-transforms-options) or [`fromSync()`](#fromsyncinput).
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `highWaterMark` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The internal buffer size in bytes before
    backpressure is applied. **Default:** `65536` (64 KB).
- Returns: [`<stream.Readable>`](stream.html#class-streamreadable)

Creates a byte-mode [`stream.Readable`](stream.html#class-streamreadable) from a synchronous
`Iterable<Uint8Array[]>`. The `_read()` method pulls from the iterator
synchronously, so data is available immediately via `readable.read()`.

```
import { fromSync, toReadableSync } from 'node:stream/iter';

const source = fromSync('hello world');
const readable = toReadableSync(source);

console.log(readable.read().toString()); // 'hello world'
const { fromSync, toReadableSync } = require('node:stream/iter');

const source = fromSync('hello world');
const readable = toReadableSync(source);

console.log(readable.read().toString()); // 'hello world'

javascriptcopy
```

#### `toWritable(writer)`[#](#towritablewriter)

Added in: v26.1.0

Stability: 1 - Experimental

- `writer` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) A stream/iter Writer. Only the `write()` method is
  required; `end()`, `fail()`, `writeSync()`, `writevSync()`, `endSync()`,
  and `writev()` are optional.
- Returns: [`<stream.Writable>`](stream.html#class-streamwritable)

Creates a classic [`stream.Writable`](stream.html#class-streamwritable) backed by a stream/iter Writer.

Each `_write()` / `_writev()` call attempts the Writer's synchronous method
first (`writeSync` / `writevSync`), falling back to the async method if the
sync path returns `false`. Similarly, `_final()` tries `endSync()`
before `end()`. When the sync path succeeds, the callback is deferred via
`queueMicrotask` to preserve the async resolution contract.

The Writable's `highWaterMark` is set to `Number.MAX_SAFE_INTEGER` to
effectively disable its internal buffering, allowing the underlying Writer
to manage backpressure directly.

```
import { push, toWritable } from 'node:stream/iter';

const { writer, readable } = push();
const writable = toWritable(writer);

writable.write('hello');
writable.end();
const { push, toWritable } = require('node:stream/iter');

const { writer, readable } = push();
const writable = toWritable(writer);

writable.write('hello');
writable.end();

javascriptcopy
```

### Protocol symbols

These well-known symbols allow third-party objects to participate in the
streaming protocol without importing from `node:stream/iter` directly.

#### `Stream.broadcastProtocol`

- Value: `Symbol.for('Stream.broadcastProtocol')`

The value must be a function. When called by `Broadcast.from()`, it receives
the options passed to `Broadcast.from()` and must return an object conforming
to the {Broadcast} interface. The implementation is fully custom -- it can
manage consumers, buffering, and backpressure however it wants.

```
import { Broadcast, text } from 'node:stream/iter';

// This example defers to the built-in Broadcast, but a custom
// implementation could use any mechanism.
class MessageBus {
  #broadcast;
  #writer;

  constructor() {
    const { writer, broadcast } = Broadcast();
    this.#writer = writer;
    this.#broadcast = broadcast;
  }

  [Symbol.for('Stream.broadcastProtocol')](options) {
    return this.#broadcast;
  }

  send(data) {
    this.#writer.write(new TextEncoder().encode(data));
  }

  close() {
    this.#writer.end();
  }
}

const bus = new MessageBus();
const { broadcast } = Broadcast.from(bus);
const consumer = broadcast.push();
bus.send('hello');
bus.close();
console.log(await text(consumer)); // 'hello'
const { Broadcast, text } = require('node:stream/iter');

// This example defers to the built-in Broadcast, but a custom
// implementation could use any mechanism.
class MessageBus {
  #broadcast;
  #writer;

  constructor() {
    const { writer, broadcast } = Broadcast();
    this.#writer = writer;
    this.#broadcast = broadcast;
  }

  [Symbol.for('Stream.broadcastProtocol')](options) {
    return this.#broadcast;
  }

  send(data) {
    this.#writer.write(new TextEncoder().encode(data));
  }

  close() {
    this.#writer.end();
  }
}

const bus = new MessageBus();
const { broadcast } = Broadcast.from(bus);
const consumer = broadcast.push();
bus.send('hello');
bus.close();
text(consumer).then(console.log); // 'hello'

javascriptcopy
```

#### `Stream.drainableProtocol`

- Value: `Symbol.for('Stream.drainableProtocol')`

Implement to make a writer compatible with `ondrain()`. The method should
return `null` if no backpressure, or a promise that fulfills with a truthy value
when backpressure clears.

```
import { ondrain } from 'node:stream/iter';

class CustomWriter {
  #queue = [];
  #drain = null;
  #closed = false;
  [Symbol.for('Stream.drainableProtocol')]() {
    if (this.#closed) return null;
    if (this.#queue.length < 3) return Promise.resolve(true);
    this.#drain ??= Promise.withResolvers();
    return this.#drain.promise;
  }
  write(chunk) {
    this.#queue.push(chunk);
  }
  flush() {
    this.#queue.length = 0;
    this.#drain?.resolve(true);
    this.#drain = null;
  }
  close() {
    this.#closed = true;
  }
}
const writer = new CustomWriter();
const ready = ondrain(writer);
console.log(ready); // Promise { true } -- no backpressure
const { ondrain } = require('node:stream/iter');

class CustomWriter {
  #queue = [];
  #drain = null;
  #closed = false;

  [Symbol.for('Stream.drainableProtocol')]() {
    if (this.#closed) return null;
    if (this.#queue.length < 3) return Promise.resolve(true);
    this.#drain ??= Promise.withResolvers();
    return this.#drain.promise;
  }

  write(chunk) {
    this.#queue.push(chunk);
  }

  flush() {
    this.#queue.length = 0;
    this.#drain?.resolve(true);
    this.#drain = null;
  }

  close() {
    this.#closed = true;
  }
}

const writer = new CustomWriter();
const ready = ondrain(writer);
console.log(ready); // Promise { true } -- no backpressure

javascriptcopy
```

#### `Stream.shareProtocol`

- Value: `Symbol.for('Stream.shareProtocol')`

The value must be a function. When called by `Share.from()`, it receives the
options passed to `Share.from()` and must return an object conforming to the
{Share} interface. The implementation is fully custom -- it can manage the shared
source, consumers, buffering, and backpressure however it wants.

```
import { share, Share, text } from 'node:stream/iter';

// This example defers to the built-in share(), but a custom
// implementation could use any mechanism.
class DataPool {
  #share;

  constructor(source) {
    this.#share = share(source);
  }

  [Symbol.for('Stream.shareProtocol')](options) {
    return this.#share;
  }
}

const pool = new DataPool(
  (async function* () {
    yield 'hello';
  })(),
);

const shared = Share.from(pool);
const consumer = shared.pull();
console.log(await text(consumer)); // 'hello'
const { share, Share, text } = require('node:stream/iter');

// This example defers to the built-in share(), but a custom
// implementation could use any mechanism.
class DataPool {
  #share;

  constructor(source) {
    this.#share = share(source);
  }

  [Symbol.for('Stream.shareProtocol')](options) {
    return this.#share;
  }
}

const pool = new DataPool(
  (async function* () {
    yield 'hello';
  })(),
);

const shared = Share.from(pool);
const consumer = shared.pull();
text(consumer).then(console.log); // 'hello'

javascriptcopy
```

#### `Stream.shareSyncProtocol`

- Value: `Symbol.for('Stream.shareSyncProtocol')`

The value must be a function. When called by `SyncShare.fromSync()`, it receives
the options passed to `SyncShare.fromSync()` and must return an object conforming
to the {SyncShare} interface. The implementation is fully custom -- it can manage
the shared source, consumers, and buffering however it wants.

```
import { shareSync, SyncShare, textSync } from 'node:stream/iter';

// This example defers to the built-in shareSync(), but a custom
// implementation could use any mechanism.
class SyncDataPool {
  #share;

  constructor(source) {
    this.#share = shareSync(source);
  }

  [Symbol.for('Stream.shareSyncProtocol')](options) {
    return this.#share;
  }
}

const encoder = new TextEncoder();
const pool = new SyncDataPool(
  function* () {
    yield [encoder.encode('hello')];
  }(),
);

const shared = SyncShare.fromSync(pool);
const consumer = shared.pull();
console.log(textSync(consumer)); // 'hello'
const { shareSync, SyncShare, textSync } = require('node:stream/iter');

// This example defers to the built-in shareSync(), but a custom
// implementation could use any mechanism.
class SyncDataPool {
  #share;

  constructor(source) {
    this.#share = shareSync(source);
  }

  [Symbol.for('Stream.shareSyncProtocol')](options) {
    return this.#share;
  }
}

const encoder = new TextEncoder();
const pool = new SyncDataPool(
  function* () {
    yield [encoder.encode('hello')];
  }(),
);

const shared = SyncShare.fromSync(pool);
const consumer = shared.pull();
console.log(textSync(consumer)); // 'hello'

javascriptcopy
```

#### `Stream.toAsyncStreamable`[#](#streamtoasyncstreamable)

- Value: `Symbol.for('Stream.toAsyncStreamable')`

The value must be a function that converts the object into a streamable value.
When the object is encountered anywhere in the streaming pipeline (as a source
passed to `from()`, or as a value returned from a transform), this method is
called to produce the actual data. It may return any value that resolves to:
a string, `Uint8Array`, `AsyncIterable`, `Iterable`, or another streamable
object.

```
import { from, text } from 'node:stream/iter';

class Greeting {
  #name;

  constructor(name) {
    this.#name = name;
  }

  [Symbol.for('Stream.toAsyncStreamable')]() {
    return `hello ${this.#name}`;
  }
}

const stream = from(new Greeting('world'));
console.log(await text(stream)); // 'hello world'
const { from, text } = require('node:stream/iter');

class Greeting {
  #name;

  constructor(name) {
    this.#name = name;
  }

  [Symbol.for('Stream.toAsyncStreamable')]() {
    return `hello ${this.#name}`;
  }
}

const stream = from(new Greeting('world'));
text(stream).then(console.log); // 'hello world'

javascriptcopy
```

#### `Stream.toStreamable`[#](#streamtostreamable)

- Value: `Symbol.for('Stream.toStreamable')`

The value must be a function that synchronously converts the object into a
streamable value. When the object is encountered anywhere in the streaming
pipeline (as a source passed to `fromSync()`, or as a value returned from a
sync transform), this method is called to produce the actual data. It must
synchronously return a streamable value: a string, `Uint8Array`, or `Iterable`.

```
import { fromSync, textSync } from 'node:stream/iter';

class Greeting {
  #name;

  constructor(name) {
    this.#name = name;
  }

  [Symbol.for('Stream.toStreamable')]() {
    return `hello ${this.#name}`;
  }
}

const stream = fromSync(new Greeting('world'));
console.log(textSync(stream)); // 'hello world'
const { fromSync, textSync } = require('node:stream/iter');

class Greeting {
  #name;

  constructor(name) {
    this.#name = name;
  }

  [Symbol.for('Stream.toStreamable')]() {
    return `hello ${this.#name}`;
  }
}

const stream = fromSync(new Greeting('world'));
console.log(textSync(stream)); // 'hello world'

javascriptcopy
```
