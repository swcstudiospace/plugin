# Global objects | Node.js v26.5.0 Documentation

Source: https://nodejs.org/api/globals.html

## Global objects[#](#global-objects)

[Stability: 2](documentation.html#stability-index) - Stable

These objects are available in all modules.

The following variables may appear to be global but are not. They exist only in
the scope of [CommonJS modules](modules.html):

- [`__dirname`](modules.html#__dirname)
- [`__filename`](modules.html#__filename)
- [`exports`](modules.html#exports)
- [`module`](modules.html#module)
- [`require()`](modules.html#requireid)

The objects listed here are specific to Node.js. There are [built-in objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)
that are part of the JavaScript language itself, which are also globally
accessible.

### `__dirname`[#](#__dirname)

This variable may appear to be global but is not. See [`__dirname`](modules.html#__dirname).

### `__filename`[#](#__filename)

This variable may appear to be global but is not. See [`__filename`](modules.html#__filename).

### Class: `AbortController`[#](#class-abortcontroller)

Added in: v15.0.0, v14.17.0History

| Version | Changes |
| --- | --- |
| v15.4.0 | No longer experimental. |

A utility class used to signal cancelation in selected `Promise`-based APIs.
The API is based on the Web API [`<AbortController>`](globals.html#class-abortcontroller).

```
const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('Aborted!'),
                           { once: true });

ac.abort();

console.log(ac.signal.aborted);  // Prints true

jscopy
```

#### `abortController.abort([reason])`[#](#abortcontrollerabortreason)

Added in: v15.0.0, v14.17.0History

| Version | Changes |
| --- | --- |
| v17.2.0, v16.14.0 | Added the new optional reason argument. |

- `reason` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) An optional reason, retrievable on the `AbortSignal`'s
  `reason` property.

Triggers the abort signal, causing the `abortController.signal` to emit
the `'abort'` event.

#### `abortController.signal`[#](#abortcontrollersignal)

Added in: v15.0.0, v14.17.0

- Type: [`<AbortSignal>`](globals.html#class-abortsignal)

### Class: `AbortSignal`[#](#class-abortsignal)

Added in: v15.0.0, v14.17.0

- Extends: [`<EventTarget>`](events.html#class-eventtarget)

The `AbortSignal` is used to notify observers when the
`abortController.abort()` method is called.

#### Static method: `AbortSignal.abort([reason])`[#](#static-method-abortsignalabortreason)

Added in: v15.12.0, v14.17.0History

| Version | Changes |
| --- | --- |
| v17.2.0, v16.14.0 | Added the new optional reason argument. |

- `reason` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<AbortSignal>`](globals.html#class-abortsignal)

Returns a new already aborted `AbortSignal`.

#### Static method: `AbortSignal.timeout(delay)`[#](#static-method-abortsignaltimeoutdelay)

Added in: v17.3.0, v16.14.0

- `delay` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The number of milliseconds to wait before triggering
  the AbortSignal.

Returns a new `AbortSignal` which will be aborted in `delay` milliseconds.

#### Static method: `AbortSignal.any(signals)`[#](#static-method-abortsignalanysignals)

Added in: v20.3.0, v18.17.0

- `signals` [`<AbortSignal>`](globals.html#class-abortsignal)[] The `AbortSignal`s of which to compose a new `AbortSignal`.

Returns a new `AbortSignal` which will be aborted if any of the provided
signals are aborted. Its [`abortSignal.reason`](#abortsignalreason) will be set to whichever
one of the `signals` caused it to be aborted.

#### Event: `'abort'`[#](#event-abort)

Added in: v15.0.0, v14.17.0

The `'abort'` event is emitted when the `abortController.abort()` method
is called. The callback is invoked with a single object argument with a
single `type` property set to `'abort'`:

```
const ac = new AbortController();

// Use either the onabort property...
ac.signal.onabort = () => console.log('aborted!');

// Or the EventTarget API...
ac.signal.addEventListener('abort', (event) => {
  console.log(event.type);  // Prints 'abort'
}, { once: true });

ac.abort();

jscopy
```

The `AbortController` with which the `AbortSignal` is associated will only
ever trigger the `'abort'` event once. We recommended that code check
that the `abortSignal.aborted` attribute is `false` before adding an `'abort'`
event listener.

Any event listeners attached to the `AbortSignal` should use the
`{ once: true }` option (or, if using the `EventEmitter` APIs to attach a
listener, use the `once()` method) to ensure that the event listener is
removed as soon as the `'abort'` event is handled. Failure to do so may
result in memory leaks.

#### `abortSignal.aborted`[#](#abortsignalaborted)

Added in: v15.0.0, v14.17.0

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

True after the `AbortController` has been aborted.

#### `abortSignal.onabort`[#](#abortsignalonabort)

Added in: v15.0.0, v14.17.0

- Type: [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

An optional callback function that may be set by user code to be notified
when the `abortController.abort()` function has been called.

#### `abortSignal.reason`[#](#abortsignalreason)

Added in: v17.2.0, v16.14.0

- Type: [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)

An optional reason specified when the `AbortSignal` was triggered.

```
const ac = new AbortController();
ac.abort(new Error('boom!'));
console.log(ac.signal.reason);  // Error: boom!

jscopy
```

#### `abortSignal.throwIfAborted()`[#](#abortsignalthrowifaborted)

Added in: v17.3.0, v16.17.0

If `abortSignal.aborted` is `true`, throws `abortSignal.reason`.

### `atob(data)`[#](#atobdata)

Added in: v16.0.0

Stability: 3 - Legacy. Use `Buffer.from(data, 'base64')` instead.

Global alias for [`buffer.atob()`](buffer.html#bufferatobdata).

An automated migration is available ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/buffer-atob-btoa)):

```
npx codemod@latest @nodejs/buffer-atob-btoa

bashcopy
```

### Class: `Blob`[#](#class-blob)

Added in: v18.0.0

See [`<Blob>`](buffer.html#class-blob).

### Class: `BroadcastChannel`[#](#class-broadcastchannel)

Added in: v18.0.0

See [`<BroadcastChannel>`](worker_threads.html#class-broadcastchannel-extends-eventtarget).

### `btoa(data)`[#](#btoadata)

Added in: v16.0.0

Stability: 3 - Legacy. Use `buf.toString('base64')` instead.

Global alias for [`buffer.btoa()`](buffer.html#bufferbtoadata).

An automated migration is available ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/buffer-atob-btoa)):

```
npx codemod@latest @nodejs/buffer-atob-btoa

bashcopy
```

### Class: `Buffer`[#](#class-buffer)

Added in: v0.1.103

- Type: [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

Used to handle binary data. See the [buffer section](buffer.html).

### Class: `ByteLengthQueuingStrategy`[#](#class-bytelengthqueuingstrategy)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`ByteLengthQueuingStrategy`](webstreams.html#class-bytelengthqueuingstrategy).

### `clearImmediate(immediateObject)`[#](#clearimmediateimmediateobject)

Added in: v0.9.1

[`clearImmediate`](timers.html#clearimmediateimmediate) is described in the [timers](timers.html) section.

### `clearInterval(intervalObject)`[#](#clearintervalintervalobject)

Added in: v0.0.1

[`clearInterval`](timers.html#clearintervaltimeout) is described in the [timers](timers.html) section.

### `clearTimeout(timeoutObject)`[#](#cleartimeouttimeoutobject)

Added in: v0.0.1

[`clearTimeout`](timers.html#cleartimeouttimeout) is described in the [timers](timers.html) section.

### Class: `CloseEvent`[#](#class-closeevent)

Added in: v23.0.0

A browser-compatible implementation of [`<CloseEvent>`](https://developer.mozilla.org/docs/Web/API/CloseEvent). Disable this API
with the [`--no-experimental-websocket`](cli.html#--no-experimental-websocket) CLI flag.

### Class: `CompressionStream`[#](#class-compressionstream)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v24.7.0, v22.20.0 | format now accepts `brotli` value. |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`CompressionStream`](webstreams.html#class-compressionstream).

### `console`[#](#console)

Added in: v0.1.100

- Type: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

Used to print to stdout and stderr. See the [`console`](console.html) section.

### Class: `CountQueuingStrategy`[#](#class-countqueuingstrategy)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`CountQueuingStrategy`](webstreams.html#class-countqueuingstrategy).

### Class: `Crypto`[#](#class-crypto)

Added in: v17.6.0, v16.15.0History

| Version | Changes |
| --- | --- |
| v23.0.0 | No longer experimental. |
| v19.0.0 | No longer behind `--experimental-global-webcrypto` CLI flag. |

A browser-compatible implementation of [`<Crypto>`](webcrypto.html#class-crypto). This global is available
only if the Node.js binary was compiled with including support for the `node:crypto` module.

### `crypto`[#](#crypto)

Added in: v17.6.0, v16.15.0History

| Version | Changes |
| --- | --- |
| v23.0.0 | No longer experimental. |
| v19.0.0 | No longer behind `--experimental-global-webcrypto` CLI flag. |

A browser-compatible implementation of the [Web Crypto API](webcrypto.html).

### Class: `CryptoKey`[#](#class-cryptokey)

Added in: v17.6.0, v16.15.0History

| Version | Changes |
| --- | --- |
| v23.0.0 | No longer experimental. |
| v19.0.0 | No longer behind `--experimental-global-webcrypto` CLI flag. |

A browser-compatible implementation of [`<CryptoKey>`](webcrypto.html#class-cryptokey). This global is available
only if the Node.js binary was compiled with including support for the `node:crypto` module.

### Class: `CustomEvent`[#](#class-customevent)

Added in: v18.7.0, v16.17.0History

| Version | Changes |
| --- | --- |
| v23.0.0 | No longer experimental. |
| v22.1.0, v20.13.0 | CustomEvent is now stable. |
| v19.0.0 | No longer behind `--experimental-global-customevent` CLI flag. |

A browser-compatible implementation of [`<CustomEvent>`](events.html#class-customevent).

### Class: `DecompressionStream`[#](#class-decompressionstream)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v24.7.0, v22.20.0 | format now accepts `brotli` value. |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`DecompressionStream`](webstreams.html#class-decompressionstream).

### Class: `DOMException`[#](#class-domexception)

Added in: v17.0.0

The WHATWG [`<DOMException>`](https://developer.mozilla.org/docs/Web/API/DOMException) class.

### `ErrorEvent`[#](#errorevent)

Added in: v25.0.0

A browser-compatible implementation of [`<ErrorEvent>`](https://developer.mozilla.org/docs/Web/API/ErrorEvent).

### Class: `Event`[#](#class-event)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v15.4.0 | No longer experimental. |

A browser-compatible implementation of the `Event` class. See
[`EventTarget` and `Event` API](events.html#eventtarget-and-event-api) for more details.

### Class: `EventSource`[#](#class-eventsource)

Added in: v22.3.0, v20.18.0

Stability: 1 - Experimental. Enable this API with the [`--experimental-eventsource`](cli.html#--experimental-eventsource)
CLI flag.

A browser-compatible implementation of [`<EventSource>`](https://developer.mozilla.org/docs/Web/API/EventSource).

### Class: `EventTarget`[#](#class-eventtarget)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v15.4.0 | No longer experimental. |

A browser-compatible implementation of the `EventTarget` class. See
[`EventTarget` and `Event` API](events.html#eventtarget-and-event-api) for more details.

### `exports`[#](#exports)

This variable may appear to be global but is not. See [`exports`](modules.html#exports).

### `fetch`[#](#fetch)

Added in: v17.5.0, v16.15.0History

| Version | Changes |
| --- | --- |
| v21.0.0 | No longer experimental. |
| v18.0.0 | No longer behind `--experimental-fetch` CLI flag. |

A browser-compatible implementation of the [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch) function.

```
const res = await fetch('https://nodejs.org/api/documentation.json');
if (res.ok) {
  const data = await res.json();
  console.log(data);
}

mjscopy
```

The implementation is based upon [undici](https://undici.nodejs.org), an HTTP/1.1 client
written from scratch for Node.js. You can figure out which version of `undici` is bundled
in your Node.js process reading the `process.versions.undici` property.

#### Custom dispatcher[#](#custom-dispatcher)

You can use a custom dispatcher to dispatch requests passing it in fetch's options object.
The dispatcher must be compatible with `undici`'s
[`Dispatcher` class](https://undici.nodejs.org/#/docs/api/Dispatcher.md).

```
fetch(url, { dispatcher: new MyAgent() });

jscopy
```

It is possible to change the global dispatcher in Node.js by installing `undici` and using
the `setGlobalDispatcher()` method. Calling this method will affect both `undici` and
Node.js.

```
import { setGlobalDispatcher } from 'undici';
setGlobalDispatcher(new MyAgent());

mjscopy
```

#### Related classes[#](#related-classes)

The following globals are available to use with `fetch`:

- [`FormData`](#class-formdata)
- [`Headers`](#class-headers)
- [`Request`](#class-request)
- [`Response`](#class-response)

### Class: `File`[#](#class-file)

Added in: v20.0.0

See [`<File>`](buffer.html#class-file).

### Class: `FormData`[#](#class-formdata)

Added in: v17.6.0, v16.15.0History

| Version | Changes |
| --- | --- |
| v21.0.0 | No longer experimental. |
| v18.0.0 | No longer behind `--experimental-fetch` CLI flag. |

A browser-compatible implementation of [`<FormData>`](https://developer.mozilla.org/docs/Web/API/FormData).

### `global`[#](#global)

Added in: v0.1.27

Stability: 3 - Legacy. Use [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) instead.

- Type: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) The global namespace object.

In browsers, the top-level scope has traditionally been the global scope. This
means that `var something` will define a new global variable, except within
ECMAScript modules. In Node.js, this is different. The top-level scope is not
the global scope; `var something` inside a Node.js module will be local to that
module, regardless of whether it is a [CommonJS module](modules.html) or an
[ECMAScript module](esm.html).

### Class: `Headers`

Added in: v17.5.0, v16.15.0History

| Version | Changes |
| --- | --- |
| v21.0.0 | No longer experimental. |
| v18.0.0 | No longer behind `--experimental-fetch` CLI flag. |

A browser-compatible implementation of [`<Headers>`](https://developer.mozilla.org/docs/Web/API/Headers).

### `localStorage`[#](#localstorage)

Added in: v22.4.0History

| Version | Changes |
| --- | --- |
| v26.0.0 | Accessing the `localStorage` global without providing `--localstorage-file` now throws a `DOMException`, for compliance with the Web Storage specification. |
| v25.0.0 | When webstorage is enabled and `--localstorage-file` is not provided, accessing the `localStorage` global now returns an empty object. |
| v25.0.0 | This API is no longer behind `--experimental-webstorage` runtime flag. |

Stability: 1.2 - Release candidate. Disable this API with [`--no-experimental-webstorage`](cli.html#--no-experimental-webstorage).

A browser-compatible implementation of [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Data is stored
unencrypted in the file specified by the [`--localstorage-file`](cli.html#--localstorage-filefile) CLI flag.
The maximum amount of data that can be stored is 10 MB.
Any modification of this data outside of the Web Storage API is not supported.
`localStorage` data is not stored per user or per request when used in the context
of a server, it is shared across all users and requests.

### Class: `MessageChannel`[#](#class-messagechannel)

Added in: v15.0.0

The `MessageChannel` class. See [`MessageChannel`](worker_threads.html#class-messagechannel) for more details.

### Class: `MessageEvent`[#](#class-messageevent)

Added in: v15.0.0

A browser-compatible implementation of [`<MessageEvent>`](https://developer.mozilla.org/docs/Web/API/MessageEvent).

### Class: `MessagePort`[#](#class-messageport)

Added in: v15.0.0

The `MessagePort` class. See [`MessagePort`](worker_threads.html#class-messageport) for more details.

### `module`[#](#module)

This variable may appear to be global but is not. See [`module`](modules.html#module).

### Class: `Navigator`

Added in: v21.0.0

Stability: 1.1 - Active development. Disable this API with the
[`--no-experimental-global-navigator`](cli.html#--no-experimental-global-navigator) CLI flag.

A partial implementation of the [Navigator API](https://html.spec.whatwg.org/multipage/system-state.html#the-navigator-object).

### `navigator`

Added in: v21.0.0

Stability: 1.1 - Active development. Disable this API with the
[`--no-experimental-global-navigator`](cli.html#--no-experimental-global-navigator) CLI flag.

A partial implementation of [`window.navigator`](https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator).

#### `navigator.hardwareConcurrency`

Added in: v21.0.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The `navigator.hardwareConcurrency` read-only property returns the number of
logical processors available to the current Node.js instance.

```
console.log(`This process is running on ${navigator.hardwareConcurrency} logical processors`);

jscopy
```

#### `navigator.language`

Added in: v21.2.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

The `navigator.language` read-only property returns a string representing the
preferred language of the Node.js instance. The language will be determined by
the ICU library used by Node.js at runtime based on the
default language of the operating system.

The value is representing the language version as defined in [RFC 5646](https://www.rfc-editor.org/rfc/rfc5646.txt).

The fallback value on builds without ICU is `'en-US'`.

```
console.log(`The preferred language of the Node.js instance has the tag '${navigator.language}'`);

jscopy
```

#### `navigator.languages`

Added in: v21.2.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[]

The `navigator.languages` read-only property returns an array of strings
representing the preferred languages of the Node.js instance.
By default `navigator.languages` contains only the value of
`navigator.language`, which will be determined by the ICU library used by
Node.js at runtime based on the default language of the operating system.

The fallback value on builds without ICU is `['en-US']`.

```
console.log(`The preferred languages are '${navigator.languages}'`);

jscopy
```

#### `navigator.locks`

Added in: v24.5.0

Stability: 1 - Experimental

The `navigator.locks` read-only property returns a [`LockManager`](worker_threads.html#class-lockmanager) instance that
can be used to coordinate access to resources that may be shared across multiple
threads within the same process. This global implementation matches the semantics
of the [browser `LockManager`](https://developer.mozilla.org/en-US/docs/Web/API/LockManager) API.

```
// Request an exclusive lock
await navigator.locks.request('my_resource', async (lock) => {
  // The lock has been acquired.
  console.log(`Lock acquired: ${lock.name}`);
  // Lock is automatically released when the function returns
});

// Request a shared lock
await navigator.locks.request('shared_resource', { mode: 'shared' }, async (lock) => {
  // Multiple shared locks can be held simultaneously
  console.log(`Shared lock acquired: ${lock.name}`);
});
// Request an exclusive lock
navigator.locks.request('my_resource', async (lock) => {
  // The lock has been acquired.
  console.log(`Lock acquired: ${lock.name}`);
  // Lock is automatically released when the function returns
}).then(() => {
  console.log('Lock released');
});

// Request a shared lock
navigator.locks.request('shared_resource', { mode: 'shared' }, async (lock) => {
  // Multiple shared locks can be held simultaneously
  console.log(`Shared lock acquired: ${lock.name}`);
}).then(() => {
  console.log('Shared lock released');
});

javascriptcopy
```

See [`worker_threads.locks`](worker_threads.html#worker_threadslocks) for detailed API documentation.

#### `navigator.platform`

Added in: v21.2.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

The `navigator.platform` read-only property returns a string identifying the
platform on which the Node.js instance is running.

```
console.log(`This process is running on ${navigator.platform}`);

jscopy
```

#### `navigator.userAgent`

Added in: v21.1.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

The `navigator.userAgent` read-only property returns user agent
consisting of the runtime name and major version number.

```
console.log(`The user-agent is ${navigator.userAgent}`); // Prints "Node.js/21"

jscopy
```

### `performance`[#](#performance)

Added in: v16.0.0

The [`perf_hooks.performance`](perf_hooks.html#perf_hooksperformance) object.

### Class: `PerformanceEntry`[#](#class-performanceentry)

Added in: v19.0.0

The `PerformanceEntry` class. See [`PerformanceEntry`](perf_hooks.html#class-performanceentry) for more details.

### Class: `PerformanceMark`[#](#class-performancemark)

Added in: v19.0.0

The `PerformanceMark` class. See [`PerformanceMark`](perf_hooks.html#class-performancemark) for more details.

### Class: `PerformanceMeasure`[#](#class-performancemeasure)

Added in: v19.0.0

The `PerformanceMeasure` class. See [`PerformanceMeasure`](perf_hooks.html#class-performancemeasure) for more details.

### Class: `PerformanceObserver`[#](#class-performanceobserver)

Added in: v19.0.0

The `PerformanceObserver` class. See [`PerformanceObserver`](perf_hooks.html#class-performanceobserver) for more details.

### Class: `PerformanceObserverEntryList`[#](#class-performanceobserverentrylist)

Added in: v19.0.0

The `PerformanceObserverEntryList` class. See
[`PerformanceObserverEntryList`](perf_hooks.html#class-performanceobserverentrylist) for more details.

### Class: `PerformanceResourceTiming`[#](#class-performanceresourcetiming)

Added in: v19.0.0

The `PerformanceResourceTiming` class. See [`PerformanceResourceTiming`](perf_hooks.html#class-performanceresourcetiming) for
more details.

### `process`[#](#process)

Added in: v0.1.7

- Type: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

The process object. See the [`process` object](process.html#process) section.

### `queueMicrotask(callback)`[#](#queuemicrotaskcallback)

Added in: v11.0.0

- `callback` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) Function to be queued.

The `queueMicrotask()` method queues a microtask to invoke `callback`. If
`callback` throws an exception, the [`process` object](process.html#process) `'uncaughtException'`
event will be emitted.

The microtask queue is managed by V8 and may be used in a similar manner to
the [`process.nextTick()`](process.html#processnexttickcallback-args) queue, which is managed by Node.js. The
`process.nextTick()` queue is always processed before the microtask queue
within each turn of the Node.js event loop.

```
// Here, `queueMicrotask()` is used to ensure the 'load' event is always
// emitted asynchronously, and therefore consistently. Using
// `process.nextTick()` here would result in the 'load' event always emitting
// before any other promise jobs.

DataHandler.prototype.load = async function load(key) {
  const hit = this._cache.get(key);
  if (hit !== undefined) {
    queueMicrotask(() => {
      this.emit('load', hit);
    });
    return;
  }

  const data = await fetchData(key);
  this._cache.set(key, data);
  this.emit('load', data);
};

jscopy
```

### Class: `QuotaExceededError`[#](#class-quotaexceedederror)

Added in: v26.0.0

The WHATWG [`<QuotaExceededError>`](https://developer.mozilla.org/docs/Web/API/QuotaExceededError) class. Extends [`<DOMException>`](https://developer.mozilla.org/docs/Web/API/DOMException).

### Class: `ReadableByteStreamController`[#](#class-readablebytestreamcontroller)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`ReadableByteStreamController`](webstreams.html#class-readablebytestreamcontroller).

### Class: `ReadableStream`[#](#class-readablestream)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`ReadableStream`](webstreams.html#class-readablestream).

### Class: `ReadableStreamBYOBReader`[#](#class-readablestreambyobreader)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`ReadableStreamBYOBReader`](webstreams.html#class-readablestreambyobreader).

### Class: `ReadableStreamBYOBRequest`[#](#class-readablestreambyobrequest)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`ReadableStreamBYOBRequest`](webstreams.html#class-readablestreambyobrequest).

### Class: `ReadableStreamDefaultController`[#](#class-readablestreamdefaultcontroller)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`ReadableStreamDefaultController`](webstreams.html#class-readablestreamdefaultcontroller).

### Class: `ReadableStreamDefaultReader`[#](#class-readablestreamdefaultreader)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`ReadableStreamDefaultReader`](webstreams.html#class-readablestreamdefaultreader).

### Class: `Request`[#](#class-request)

Added in: v17.5.0, v16.15.0History

| Version | Changes |
| --- | --- |
| v21.0.0 | No longer experimental. |
| v18.0.0 | No longer behind `--experimental-fetch` CLI flag. |

A browser-compatible implementation of [`<Request>`](https://developer.mozilla.org/docs/Web/API/Request).

### `require()`[#](#require)

This variable may appear to be global but is not. See [`require()`](modules.html#requireid).

### Class: `Response`[#](#class-response)

Added in: v17.5.0, v16.15.0History

| Version | Changes |
| --- | --- |
| v21.0.0 | No longer experimental. |
| v18.0.0 | No longer behind `--experimental-fetch` CLI flag. |

A browser-compatible implementation of [`<Response>`](https://developer.mozilla.org/docs/Web/API/Response).

### `sessionStorage`[#](#sessionstorage)

Added in: v22.4.0History

| Version | Changes |
| --- | --- |
| v25.0.0 | This API is no longer behind `--experimental-webstorage` runtime flag. |

Stability: 1.2 - Release candidate. Disable this API with [`--no-experimental-webstorage`](cli.html#--no-experimental-webstorage).

A browser-compatible implementation of [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage). Data is stored in
memory, with a storage quota of 10 MB. `sessionStorage` data persists only within
the currently running process, and is not shared between workers.

### `setImmediate(callback[, ...args])`[#](#setimmediatecallback-args)

Added in: v0.9.1

[`setImmediate`](timers.html#setimmediatecallback-args) is described in the [timers](timers.html) section.

### `setInterval(callback, delay[, ...args])`[#](#setintervalcallback-delay-args)

Added in: v0.0.1

[`setInterval`](timers.html#setintervalcallback-delay-args) is described in the [timers](timers.html) section.

### `setTimeout(callback, delay[, ...args])`[#](#settimeoutcallback-delay-args)

Added in: v0.0.1

[`setTimeout`](timers.html#settimeoutcallback-delay-args) is described in the [timers](timers.html) section.

### Class: `Storage`[#](#class-storage)

Added in: v22.4.0

Stability: 1.2 - Release candidate. Disable this API with [`--no-experimental-webstorage`](cli.html#--no-experimental-webstorage).

A browser-compatible implementation of [`<Storage>`](https://developer.mozilla.org/docs/Web/API/Storage).

### `structuredClone(value[, options])`[#](#structuredclonevalue-options)

Added in: v17.0.0

The WHATWG [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) method.

### Class: `SubtleCrypto`[#](#class-subtlecrypto)

Added in: v17.6.0, v16.15.0History

| Version | Changes |
| --- | --- |
| v19.0.0 | No longer behind `--experimental-global-webcrypto` CLI flag. |

A browser-compatible implementation of [`<SubtleCrypto>`](webcrypto.html#class-subtlecrypto). This global is available
only if the Node.js binary was compiled with including support for the `node:crypto` module.

### Class: `TextDecoder`[#](#class-textdecoder)

Added in: v11.0.0

The WHATWG `TextDecoder` class. See the [`TextDecoder`](util.html#class-utiltextdecoder) section.

### Class: `TextDecoderStream`[#](#class-textdecoderstream)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`TextDecoderStream`](webstreams.html#class-textdecoderstream).

### Class: `TextEncoder`[#](#class-textencoder)

Added in: v11.0.0

The WHATWG `TextEncoder` class. See the [`TextEncoder`](util.html#class-utiltextencoder) section.

### Class: `TextEncoderStream`[#](#class-textencoderstream)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`TextEncoderStream`](webstreams.html#class-textencoderstream).

### Class: `TransformStream`[#](#class-transformstream)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`TransformStream`](webstreams.html#class-transformstream).

### Class: `TransformStreamDefaultController`[#](#class-transformstreamdefaultcontroller)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`TransformStreamDefaultController`](webstreams.html#class-transformstreamdefaultcontroller).

### Class: `URL`[#](#class-url)

Added in: v10.0.0

The WHATWG `URL` class. See the [`URL`](url.html#class-url) section.

### Class: `URLPattern`[#](#class-urlpattern)

Added in: v24.0.0

Stability: 1 - Experimental

The WHATWG `URLPattern` class. See the [`URLPattern`](url.html#class-urlpattern) section.

### Class: `URLSearchParams`[#](#class-urlsearchparams)

Added in: v10.0.0

The WHATWG `URLSearchParams` class. See the [`URLSearchParams`](url.html#class-urlsearchparams) section.

### Class: `WebAssembly`[#](#class-webassembly)

Added in: v8.0.0

- Type: [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

The object that acts as the namespace for all W3C
[WebAssembly](https://webassembly.org) related functionality. See the
[Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/WebAssembly) for usage and compatibility.

### Class: `WebSocket`[#](#class-websocket)

Added in: v21.0.0, v20.10.0History

| Version | Changes |
| --- | --- |
| v22.4.0 | No longer experimental. |
| v22.0.0 | No longer behind `--experimental-websocket` CLI flag. |

A browser-compatible implementation of [`<WebSocket>`](https://developer.mozilla.org/docs/Web/API/WebSocket). Disable this API
with the [`--no-experimental-websocket`](cli.html#--no-experimental-websocket) CLI flag.

### Class: `WritableStream`[#](#class-writablestream)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`WritableStream`](webstreams.html#class-writablestream).

### Class: `WritableStreamDefaultController`[#](#class-writablestreamdefaultcontroller)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`WritableStreamDefaultController`](webstreams.html#class-writablestreamdefaultcontroller).

### Class: `WritableStreamDefaultWriter`[#](#class-writablestreamdefaultwriter)

Added in: v18.0.0History

| Version | Changes |
| --- | --- |
| v23.11.0, v22.15.0 | Marking the API stable. |

A browser-compatible implementation of [`WritableStreamDefaultWriter`](webstreams.html#class-writablestreamdefaultwriter).
