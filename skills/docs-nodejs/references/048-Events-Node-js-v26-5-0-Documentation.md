# Events | Node.js v26.5.0 Documentation

Source: https://nodejs.org/api/events.html

## Events[#](#events)

**Source Code:** [lib/events.js](https://github.com/nodejs/node/blob/main/lib/events.js)

[Stability: 2](documentation.html#stability-index) - Stable

Much of the Node.js core API is built around an idiomatic asynchronous
event-driven architecture in which certain kinds of objects (called "emitters")
emit named events that cause `Function` objects ("listeners") to be called.

For instance: a [`net.Server`](net.html#class-netserver) object emits an event each time a peer
connects to it; a [`fs.ReadStream`](fs.html#class-fsreadstream) emits an event when the file is opened;
a [stream](stream.html) emits an event whenever data is available to be read.

All objects that emit events are instances of the `EventEmitter` class. These
objects expose an `eventEmitter.on()` function that allows one or more
functions to be attached to named events emitted by the object. Typically,
event names are camel-cased strings but any valid JavaScript property key
can be used.

When the `EventEmitter` object emits an event, all of the functions attached
to that specific event are called *synchronously*. Any values returned by the
called listeners are *ignored* and discarded.

The following example shows a simple `EventEmitter` instance with a single
listener. The `eventEmitter.on()` method is used to register listeners, while
the `eventEmitter.emit()` method is used to trigger the event.

```
import { EventEmitter } from 'node:events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');

javascriptcopy
```

### Passing arguments and `this` to listeners[#](#passing-arguments-and-this-to-listeners)

The `eventEmitter.emit()` method allows an arbitrary set of arguments to be
passed to the listener functions. Keep in mind that when
an ordinary listener function is called, the standard `this` keyword
is intentionally set to reference the `EventEmitter` instance to which the
listener is attached.

```
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     Symbol(shapeMode): false,
  //     Symbol(kCapture): false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     Symbol(shapeMode): false,
  //     Symbol(kCapture): false
  //   } true
});
myEmitter.emit('event', 'a', 'b');

javascriptcopy
```

It is possible to use ES6 Arrow Functions as listeners, however, when doing so,
the `this` keyword will no longer reference the `EventEmitter` instance:

```
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b undefined
});
myEmitter.emit('event', 'a', 'b');
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b {}
});
myEmitter.emit('event', 'a', 'b');

javascriptcopy
```

### Asynchronous vs. synchronous[#](#asynchronous-vs-synchronous)

The `EventEmitter` calls all listeners synchronously in the order in which
they were registered. This ensures the proper sequencing of
events and helps avoid race conditions and logic errors. When appropriate,
listener functions can switch to an asynchronous mode of operation using
the `setImmediate()` or `process.nextTick()` methods:

```
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');

javascriptcopy
```

### Handling events only once[#](#handling-events-only-once)

When a listener is registered using the `eventEmitter.on()` method, that
listener is invoked *every time* the named event is emitted.

```
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2

javascriptcopy
```

Using the `eventEmitter.once()` method, it is possible to register a listener
that is called at most once for a particular event. Once the event is emitted,
the listener is unregistered and *then* called.

```
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored

javascriptcopy
```

### Error events[#](#error-events)

When an error occurs within an `EventEmitter` instance, the typical action is
for an `'error'` event to be emitted. These are treated as special cases
within Node.js.

If an `EventEmitter` does *not* have at least one listener registered for the
`'error'` event, and an `'error'` event is emitted, the error is thrown, a
stack trace is printed, and the Node.js process exits.

```
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Throws and crashes Node.js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Throws and crashes Node.js

javascriptcopy
```

To guard against crashing the Node.js process the [`domain`](domain.html) module can be
used. (Note, however, that the `node:domain` module is deprecated.)

As a best practice, listeners should always be added for the `'error'` events.

```
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Prints: whoops! there was an error
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Prints: whoops! there was an error

javascriptcopy
```

It is possible to monitor `'error'` events without consuming the emitted error
by installing a listener using the symbol `events.errorMonitor`.

```
import { EventEmitter, errorMonitor } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Still throws and crashes Node.js
const { EventEmitter, errorMonitor } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Still throws and crashes Node.js

javascriptcopy
```

### Capture rejections of promises[#](#capture-rejections-of-promises)

Using `async` functions with event handlers is problematic, because it
can lead to an unhandled rejection in case of a thrown exception:

```
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
const EventEmitter = require('node:events');
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});

javascriptcopy
```

The `captureRejections` option in the `EventEmitter` constructor or the global
setting change this behavior, installing a `.then(undefined, handler)`
handler on the `Promise`. This handler routes the exception
asynchronously to the [`Symbol.for('nodejs.rejection')`](#emittersymbolfornodejsrejectionerr-eventname-args) method
if there is one, or to [`'error'`](#error-events) event handler if there is none.

```
import { EventEmitter } from 'node:events';
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
const EventEmitter = require('node:events');
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;

javascriptcopy
```

Setting `events.captureRejections = true` will change the default for all
new instances of `EventEmitter`.

```
import { EventEmitter } from 'node:events';

EventEmitter.captureRejections = true;
const ee1 = new EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
const events = require('node:events');
events.captureRejections = true;
const ee1 = new events.EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

javascriptcopy
```

The `'error'` events that are generated by the `captureRejections` behavior
do not have a catch handler to avoid infinite error loops: the
recommendation is to **not use `async` functions as `'error'` event handlers**.

### Class: `EventEmitter`[#](#class-eventemitter)

Added in: v0.1.26History

| Version | Changes |
| --- | --- |
| v13.4.0, v12.16.0 | Added captureRejections option. |

The `EventEmitter` class is defined and exposed by the `node:events` module:

```
import { EventEmitter } from 'node:events';
const EventEmitter = require('node:events');

javascriptcopy
```

All `EventEmitter`s emit the event `'newListener'` when new listeners are
added and `'removeListener'` when existing listeners are removed.

It supports the following option:

- `captureRejections` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) It enables [automatic capturing of promise rejection](#capture-rejections-of-promises).
  **Default:** `false`.

#### Event: `'newListener'`[#](#event-newlistener)

Added in: v0.1.26

- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) The name of the event being listened for
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The event handler function

The `EventEmitter` instance will emit its own `'newListener'` event *before*
a listener is added to its internal array of listeners.

Listeners registered for the `'newListener'` event are passed the event
name and a reference to the listener being added.

The fact that the event is triggered before adding the listener has a subtle
but important side effect: any *additional* listeners registered to the same
`name` *within* the `'newListener'` callback are inserted *before* the
listener that is in the process of being added.

```
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Only do this once so we don't loop forever
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Insert a new listener in front
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Prints:
//   B
//   A
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Only do this once so we don't loop forever
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Insert a new listener in front
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Prints:
//   B
//   A

javascriptcopy
```

#### Event: `'removeListener'`[#](#event-removelistener)

Added in: v0.9.3History

| Version | Changes |
| --- | --- |
| v6.1.0, v4.7.0 | For listeners attached using `.once()`, the `listener` argument now yields the original listener function. |

- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) The event name
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The event handler function

The `'removeListener'` event is emitted *after* the `listener` is removed.

#### `emitter.addListener(eventName, listener)`[#](#emitteraddlistenereventname-listener)

Added in: v0.1.26

- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type)
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

Alias for `emitter.on(eventName, listener)`.

#### `emitter.emit(eventName[, ...args])`[#](#emitteremiteventname-args)

Added in: v0.1.26

- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type)
- `...args` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Synchronously calls each of the listeners registered for the event named
`eventName`, in the order they were registered, passing the supplied arguments
to each.

Returns `true` if the event had listeners, `false` otherwise.

```
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
const EventEmitter = require('node:events');
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener

javascriptcopy
```

#### `emitter.eventNames()`[#](#emittereventnames)

Added in: v6.0.0

- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type)[]

Returns an array listing the events for which the emitter has registered
listeners.

```
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
const EventEmitter = require('node:events');

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]

javascriptcopy
```

#### `emitter.getMaxListeners()`[#](#emittergetmaxlisteners)

Added in: v1.0.0

- Returns: [`<integer>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

Returns the current max listener value for the `EventEmitter` which is either
set by [`emitter.setMaxListeners(n)`](#emittersetmaxlistenersn) or defaults to
[`events.defaultMaxListeners`](#eventsdefaultmaxlisteners).

#### `emitter.listenerCount(eventName[, listener])`[#](#emitterlistenercounteventname-listener)

Added in: v3.2.0History

| Version | Changes |
| --- | --- |
| v19.8.0, v18.16.0 | Added the `listener` argument. |

- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) The name of the event being listened for
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The event handler function
- Returns: [`<integer>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

Returns the number of listeners listening for the event named `eventName`.
If `listener` is provided, it will return how many times the listener is found
in the list of the listeners of the event.

#### `emitter.listeners(eventName)`[#](#emitterlistenerseventname)

Added in: v0.1.26History

| Version | Changes |
| --- | --- |
| v7.0.0 | For listeners attached using `.once()` this returns the original listeners instead of wrapper functions now. |

- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type)
- Returns: [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)[]

Returns a copy of the array of listeners for the event named `eventName`.

```
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]

jscopy
```

#### `emitter.off(eventName, listener)`[#](#emitteroffeventname-listener)

Added in: v10.0.0

- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type)
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [`<EventEmitter>`](events.html#class-eventemitter)

Alias for [`emitter.removeListener()`](#emitterremovelistenereventname-listener).

#### `emitter.on(eventName, listener)`[#](#emitteroneventname-listener)

Added in: v0.1.101

- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) The name of the event.
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The callback function
- Returns: [`<EventEmitter>`](events.html#class-eventemitter)

Adds the `listener` function to the end of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`
and `listener` will result in the `listener` being added, and called, multiple
times.

```
server.on('connection', (stream) => {
  console.log('someone connected!');
});

jscopy
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The
`emitter.prependListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a

javascriptcopy
```

#### `emitter.once(eventName, listener)`[#](#emitteronceeventname-listener)

Added in: v0.3.0

- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) The name of the event.
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The callback function
- Returns: [`<EventEmitter>`](events.html#class-eventemitter)

Adds a **one-time** `listener` function for the event named `eventName`. The
next time `eventName` is triggered, this listener is removed and then invoked.

```
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});

jscopy
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The
`emitter.prependOnceListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a

javascriptcopy
```

#### `emitter.prependListener(eventName, listener)`[#](#emitterprependlistenereventname-listener)

Added in: v6.0.0

- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) The name of the event.
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The callback function
- Returns: [`<EventEmitter>`](events.html#class-eventemitter)

Adds the `listener` function to the *beginning* of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`
and `listener` will result in the `listener` being added, and called, multiple
times.

```
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});

jscopy
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### `emitter.prependOnceListener(eventName, listener)`[#](#emitterprependoncelistenereventname-listener)

Added in: v6.0.0

- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) The name of the event.
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The callback function
- Returns: [`<EventEmitter>`](events.html#class-eventemitter)

Adds a **one-time** `listener` function for the event named `eventName` to the
*beginning* of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});

jscopy
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### `emitter.removeAllListeners([eventName])`[#](#emitterremovealllistenerseventname)

Added in: v0.1.26

- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type)
- Returns: [`<EventEmitter>`](events.html#class-eventemitter)

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### `emitter.removeListener(eventName, listener)`[#](#emitterremovelistenereventname-listener)

Added in: v0.1.26

- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type)
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [`<EventEmitter>`](events.html#class-eventemitter)

Removes the specified `listener` from the listener array for the event named
`eventName`.

```
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);

jscopy
```

`removeListener()` will remove, at most, one instance of a listener from the
listener array. If any single listener has been added multiple times to the
listener array for the specified `eventName`, then `removeListener()` must be
called multiple times to remove each instance.

Once an event is emitted, all listeners attached to it at the
time of emitting are called in order. This implies that any
`removeListener()` or `removeAllListeners()` calls *after* emitting and
*before* the last listener finishes execution will not remove them from
`emit()` in progress. Subsequent events behave as expected.

```
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A

javascriptcopy
```

Because listeners are managed using an internal array, calling this will
change the position indexes of any listener registered *after* the listener
being removed. This will not impact the order in which listeners are called,
but it means that any copies of the listener array as returned by
the `emitter.listeners()` method will need to be recreated.

When a single function has been added as a handler multiple times for a single
event (as in the example below), `removeListener()` will remove the most
recently added instance. In the example the `once('ping')`
listener is removed:

```
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
const EventEmitter = require('node:events');
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');

javascriptcopy
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### `emitter.setMaxListeners(n)`[#](#emittersetmaxlistenersn)

Added in: v0.3.5

- `n` [`<integer>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)
- Returns: [`<EventEmitter>`](events.html#class-eventemitter)

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to
`Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### `emitter.rawListeners(eventName)`[#](#emitterrawlistenerseventname)

Added in: v9.4.0

- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type)
- Returns: [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)[]

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');

javascriptcopy
```

#### `emitter[Symbol.for('nodejs.rejection')](err, eventName[, ...args])`[#](#emittersymbolfornodejsrejectionerr-eventname-args)

Added in: v13.4.0, v12.16.0History

| Version | Changes |
| --- | --- |
| v17.4.0, v16.14.0 | No longer experimental. |

- `err` [`<Error>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type)
- `...args` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)

The `Symbol.for('nodejs.rejection')` method is called in case a
promise rejection happens when emitting an event and
[`captureRejections`](#capture-rejections-of-promises) is enabled on the emitter.
It is possible to use [`events.captureRejectionSymbol`](#eventscapturerejectionsymbol) in
place of `Symbol.for('nodejs.rejection')`.

```
import { EventEmitter, captureRejectionSymbol } from 'node:events';

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
const { EventEmitter, captureRejectionSymbol } = require('node:events');

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}

javascriptcopy
```

### `events.defaultMaxListeners`[#](#eventsdefaultmaxlisteners)

Added in: v0.11.2

By default, a maximum of `10` listeners can be registered for any single
event. This limit can be changed for individual `EventEmitter` instances
using the [`emitter.setMaxListeners(n)`](#emittersetmaxlistenersn) method. To change the default
for *all* `EventEmitter` instances, the `events.defaultMaxListeners`
property can be used. If this value is not a positive number, a `RangeError`
is thrown.

Take caution when setting the `events.defaultMaxListeners` because the
change affects *all* `EventEmitter` instances, including those created before
the change is made. However, calling [`emitter.setMaxListeners(n)`](#emittersetmaxlistenersn) still has
precedence over `events.defaultMaxListeners`.

This is not a hard limit. The `EventEmitter` instance will allow
more listeners to be added but will output a trace warning to stderr indicating
that a "possible EventEmitter memory leak" has been detected. For any single
`EventEmitter`, the `emitter.getMaxListeners()` and `emitter.setMaxListeners()`
methods can be used to temporarily avoid this warning:

`defaultMaxListeners` has no effect on `AbortSignal` instances. While it is
still possible to use [`emitter.setMaxListeners(n)`](#emittersetmaxlistenersn) to set a warning limit
for individual `AbortSignal` instances, per default `AbortSignal` instances will not warn.

```
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});

javascriptcopy
```

The [`--trace-warnings`](cli.html#--trace-warnings) command-line flag can be used to display the
stack trace for such warnings.

The emitted warning can be inspected with [`process.on('warning')`](process.html#event-warning) and will
have the additional `emitter`, `type`, and `count` properties, referring to
the event emitter instance, the event's name and the number of attached
listeners, respectively.
Its `name` property is set to `'MaxListenersExceededWarning'`.

### `events.errorMonitor`[#](#eventserrormonitor)

Added in: v13.6.0, v12.17.0

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted. Therefore, the process will still crash if no
regular `'error'` listener is installed.

### `events.getEventListeners(emitterOrTarget, eventName)`[#](#eventsgeteventlistenersemitterortarget-eventname)

Added in: v15.2.0, v14.17.0

- `emitterOrTarget` [`<EventEmitter>`](events.html#class-eventemitter) | [`<EventTarget>`](events.html#class-eventtarget)
- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type)
- Returns: [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)[]

Returns a copy of the array of listeners for the event named `eventName`.

For `EventEmitter`s this behaves exactly the same as calling `.listeners` on
the emitter.

For `EventTarget`s this is the only way to get the event listeners for the
event target. This is useful for debugging and diagnostic purposes.

```
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
const { getEventListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}

javascriptcopy
```

### `events.getMaxListeners(emitterOrTarget)`[#](#eventsgetmaxlistenersemitterortarget)

Added in: v19.9.0, v18.17.0

- `emitterOrTarget` [`<EventEmitter>`](events.html#class-eventemitter) | [`<EventTarget>`](events.html#class-eventtarget)
- Returns: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

Returns the currently set max amount of listeners.

For `EventEmitter`s this behaves exactly the same as calling `.getMaxListeners` on
the emitter.

For `EventTarget`s this is the only way to get the max event listeners for the
event target. If the number of event handlers on a single EventTarget exceeds
the max set, the EventTarget will print a warning.

```
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
const { getMaxListeners, setMaxListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}

javascriptcopy
```

### `events.once(emitter, name[, options])`[#](#eventsonceemitter-name-options)

Added in: v11.13.0, v10.16.0History

| Version | Changes |
| --- | --- |
| v15.0.0 | The `signal` option is supported now. |

- `emitter` [`<EventEmitter>`](events.html#class-eventemitter)
- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type)
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal) Can be used to cancel waiting for the event.
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Creates a `Promise` that is fulfilled when the `EventEmitter` emits the given
event or that is rejected if the `EventEmitter` emits `'error'` while waiting.
The `Promise` will resolve with an array of all the arguments emitted to the
given event.

This method is intentionally generic and works with the web platform
[EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) interface, which has no special
`'error'` event semantics and does not listen to the `'error'` event.

```
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
const { once, EventEmitter } = require('node:events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('kaboom');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.error('error happened', err);
  }
}

run();

javascriptcopy
```

The special handling of the `'error'` event is only used when `events.once()`
is used to wait for another event. If `events.once()` is used to wait for the
'`error'` event itself, then it is treated as any other kind of event without
special handling:

```
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom

javascriptcopy
```

An [`<AbortSignal>`](globals.html#class-abortsignal) can be used to cancel waiting for the event:

```
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!

javascriptcopy
```

#### Caveats when awaiting multiple events[#](#caveats-when-awaiting-multiple-events)

It is important to be aware of execution order when using the `events.once()`
method to await multiple events.

Conventional event listeners are called synchronously when the event is
emitted. This guarantees that execution will not proceed beyond the emitted
event until all listeners have finished executing.

The same is *not* true when awaiting Promises returned by `events.once()`.
Promise tasks are not handled until after the current execution stack runs to
completion, which means that multiple events could be emitted before
asynchronous execution continues from the relevant `await` statement.

As a result, events can be "missed" if a series of `await events.once()`
statements is used to listen to multiple events, since there might be times
where more than one event is emitted during the same phase of the event loop.
(The same is true when using `process.nextTick()` to emit events, because the
tasks queued by `process.nextTick()` are executed before Promise tasks.)

```
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function listen() {
  await once(myEE, 'foo');
  console.log('foo');

  // This Promise will never resolve, because the 'bar' event will
  // have already been emitted before the next line is executed.
  await once(myEE, 'bar');
  console.log('bar');
}

process.nextTick(() => {
  myEE.emit('foo');
  myEE.emit('bar');
});

listen().then(() => console.log('done'));
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function listen() {
  await once(myEE, 'foo');
  console.log('foo');

  // This Promise will never resolve, because the 'bar' event will
  // have already been emitted before the next line is executed.
  await once(myEE, 'bar');
  console.log('bar');
}

process.nextTick(() => {
  myEE.emit('foo');
  myEE.emit('bar');
});

listen().then(() => console.log('done'));

javascriptcopy
```

To catch multiple events, create all of the Promises *before* awaiting any of
them. This is usually made easier by using `Promise.all()`, `Promise.race()`,
or `Promise.allSettled()`:

```
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function listen() {
  await Promise.all([
    once(myEE, 'foo'),
    once(myEE, 'bar'),
  ]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('foo');
  myEE.emit('bar');
});

listen().then(() => console.log('done'));
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function listen() {
  await Promise.all([
    once(myEE, 'bar'),
    once(myEE, 'foo'),
  ]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('foo');
  myEE.emit('bar');
});

listen().then(() => console.log('done'));

javascriptcopy
```

### `events.captureRejections`[#](#eventscapturerejections)

Added in: v13.4.0, v12.16.0History

| Version | Changes |
| --- | --- |
| v17.4.0, v16.14.0 | No longer experimental. |

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Change the default `captureRejections` option on all new `EventEmitter` objects.

### `events.captureRejectionSymbol`[#](#eventscapturerejectionsymbol)

Added in: v13.4.0, v12.16.0History

| Version | Changes |
| --- | --- |
| v17.4.0, v16.14.0 | No longer experimental. |

- Type: [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) `Symbol.for('nodejs.rejection')`

See how to write a custom [rejection handler](#emittersymbolfornodejsrejectionerr-eventname-args).

### `events.listenerCount(emitterOrTarget, eventName)`[#](#eventslistenercountemitterortarget-eventname)

Added in: v0.9.12History

| Version | Changes |
| --- | --- |
| v25.4.0, v24.14.0 | Now accepts EventTarget arguments. |
| v25.4.0, v24.14.0 | Deprecation revoked. |
| v3.2.0 | Documentation-only deprecation. |

- `emitterOrTarget` [`<EventEmitter>`](events.html#class-eventemitter) | [`<EventTarget>`](events.html#class-eventtarget)
- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type)
- Returns: [`<integer>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

Returns the number of registered listeners for the event named `eventName`.

For `EventEmitter`s this behaves exactly the same as calling `.listenerCount`
on the emitter.

For `EventTarget`s this is the only way to obtain the listener count. This can
be useful for debugging and diagnostic purposes.

```
import { EventEmitter, listenerCount } from 'node:events';

{
  const ee = new EventEmitter();
  ee.on('event', () => {});
  ee.on('event', () => {});
  console.log(listenerCount(ee, 'event')); // 2
}
{
  const et = new EventTarget();
  et.addEventListener('event', () => {});
  et.addEventListener('event', () => {});
  console.log(listenerCount(et, 'event')); // 2
}
const { EventEmitter, listenerCount } = require('node:events');

{
  const ee = new EventEmitter();
  ee.on('event', () => {});
  ee.on('event', () => {});
  console.log(listenerCount(ee, 'event')); // 2
}
{
  const et = new EventTarget();
  et.addEventListener('event', () => {});
  et.addEventListener('event', () => {});
  console.log(listenerCount(et, 'event')); // 2
}

javascriptcopy
```

### `events.on(emitter, eventName[, options])`[#](#eventsonemitter-eventname-options)

Added in: v13.6.0, v12.16.0History

| Version | Changes |
| --- | --- |
| v22.0.0, v20.13.0 | Support `highWaterMark` and `lowWaterMark` options, For consistency. Old options are still supported. |
| v20.0.0 | The `close`, `highWatermark`, and `lowWatermark` options are supported now. |

- `emitter` [`<EventEmitter>`](events.html#class-eventemitter)
- `eventName` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) The name of the event being listened for
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal) Can be used to cancel awaiting events.
  - `close` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] Names of events that will end the iteration.
  - `highWaterMark` [`<integer>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) **Default:** `Number.MAX_SAFE_INTEGER`
    The high watermark. The emitter is paused every time the size of events
    being buffered is higher than it. Supported only on emitters implementing
    `pause()` and `resume()` methods.
  - `lowWaterMark` [`<integer>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) **Default:** `1`
    The low watermark. The emitter is resumed every time the size of events
    being buffered is lower than it. Supported only on emitters implementing
    `pause()` and `resume()` methods.
- Returns: [`<AsyncIterator>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator) that iterates `eventName` events emitted by the `emitter`

```
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emit later on
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // The execution of this inner block is synchronous and it
  // processes one event at a time (even with await). Do not use
  // if concurrent execution is required.
  console.log(event); // prints ['bar'] [42]
}
// Unreachable here
const { on, EventEmitter } = require('node:events');

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

javascriptcopy
```

Returns an `AsyncIterator` that iterates `eventName` events. It will throw
if the `EventEmitter` emits `'error'`. It removes all listeners when
exiting the loop. The `value` returned by each iteration is an array
composed of the emitted event arguments.

An [`<AbortSignal>`](globals.html#class-abortsignal) can be used to cancel waiting on events:

```
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
const { on, EventEmitter } = require('node:events');

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());

javascriptcopy
```

### `events.setMaxListeners(n[, ...eventTargets])`[#](#eventssetmaxlistenersn-eventtargets)

Added in: v15.4.0

- `n` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) A non-negative number. The maximum number of listeners per `EventTarget` event.
- `...eventsTargets` [`<EventTarget>`](events.html#class-eventtarget)[] | [`<EventEmitter>`](events.html#class-eventemitter)[] Zero or more [`<EventTarget>`](events.html#class-eventtarget)
  or [`<EventEmitter>`](events.html#class-eventemitter) instances. If none are specified, `n` is set as the default
  max for all newly created [`<EventTarget>`](events.html#class-eventtarget) and [`<EventEmitter>`](events.html#class-eventemitter) objects.

```
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
const {
  setMaxListeners,
  EventEmitter,
} = require('node:events');

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);

javascriptcopy
```

### `events.addAbortListener(signal, listener)`[#](#eventsaddabortlistenersignal-listener)

Added in: v20.5.0, v18.18.0History

| Version | Changes |
| --- | --- |
| v24.0.0, v22.16.0 | Change stability index for this feature from Experimental to Stable. |

- `signal` [`<AbortSignal>`](globals.html#class-abortsignal)
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<EventListener>`](events.html#event-listener)
- Returns: [`<Disposable>`](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) A Disposable that removes the `abort` listener.

Listens once to the `abort` event on the provided `signal`.

Listening to the `abort` event on abort signals is unsafe and may
lead to resource leaks since another third party with the signal can
call [`e.stopImmediatePropagation()`](#eventstopimmediatepropagation). Unfortunately Node.js cannot change
this since it would violate the web standard. Additionally, the original
API makes it easy to forget to remove listeners.

This API allows safely using `AbortSignal`s in Node.js APIs by solving these
two issues by listening to the event such that `stopImmediatePropagation` does
not prevent the listener from running.

Returns a disposable so that it may be unsubscribed from more easily.

```
const { addAbortListener } = require('node:events');

function example(signal) {
  signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
  // addAbortListener() returns a disposable, so the `using` keyword ensures
  // the abort listener is automatically removed when this scope exits.
  using _ = addAbortListener(signal, (e) => {
    // Do something when signal is aborted.
  });
}
import { addAbortListener } from 'node:events';

function example(signal) {
  signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
  // addAbortListener() returns a disposable, so the `using` keyword ensures
  // the abort listener is automatically removed when this scope exits.
  using _ = addAbortListener(signal, (e) => {
    // Do something when signal is aborted.
  });
}

javascriptcopy
```

### Class: `events.EventEmitterAsyncResource extends EventEmitter`[#](#class-eventseventemitterasyncresource-extends-eventemitter)

Added in: v17.4.0, v16.14.0

Integrates `EventEmitter` with [`<AsyncResource>`](async_hooks.html#class-asyncresource) for `EventEmitter`s that
require manual async tracking. Specifically, all events emitted by instances
of `events.EventEmitterAsyncResource` will run within its [async context](async_context.html).

```
import { EventEmitterAsyncResource, EventEmitter } from 'node:events';
import { notStrictEqual, strictEqual } from 'node:assert';
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

// Async tracking tooling will identify this as 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// 'foo' listeners will run in the EventEmitters async context.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// 'foo' listeners on ordinary EventEmitters that do not track async
// context, however, run in the same async context as the emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
const { EventEmitterAsyncResource, EventEmitter } = require('node:events');
const { notStrictEqual, strictEqual } = require('node:assert');
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

// Async tracking tooling will identify this as 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// 'foo' listeners will run in the EventEmitters async context.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// 'foo' listeners on ordinary EventEmitters that do not track async
// context, however, run in the same async context as the emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});

javascriptcopy
```

The `EventEmitterAsyncResource` class has the same methods and takes the
same options as `EventEmitter` and `AsyncResource` themselves.

#### `new events.EventEmitterAsyncResource([options])`[#](#new-eventseventemitterasyncresourceoptions)

- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `captureRejections` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) It enables [automatic capturing of promise rejection](#capture-rejections-of-promises).
    **Default:** `false`.
  - `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The type of async event. **Default:** [`new.target.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target).
  - `triggerAsyncId` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The ID of the execution context that created this
    async event. **Default:** `executionAsyncId()`.
  - `requireManualDestroy` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If set to `true`, disables `emitDestroy`
    when the object is garbage collected. This usually does not need to be set
    (even if `emitDestroy` is called manually), unless the resource's `asyncId`
    is retrieved and the sensitive API's `emitDestroy` is called with it.
    When set to `false`, the `emitDestroy` call on garbage collection
    will only take place if there is at least one active `destroy` hook.
    **Default:** `false`.

#### `eventemitterasyncresource.asyncId`[#](#eventemitterasyncresourceasyncid)

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The unique `asyncId` assigned to the resource.

#### `eventemitterasyncresource.asyncResource`[#](#eventemitterasyncresourceasyncresource)

- Type: [`<AsyncResource>`](async_hooks.html#class-asyncresource) The underlying [`<AsyncResource>`](async_hooks.html#class-asyncresource).

The returned `AsyncResource` object has an additional `eventEmitter` property
that provides a reference to this `EventEmitterAsyncResource`.

#### `eventemitterasyncresource.emitDestroy()`[#](#eventemitterasyncresourceemitdestroy)

Call all `destroy` hooks. This should only ever be called once. An error will
be thrown if it is called more than once. This **must** be manually called. If
the resource is left to be collected by the GC then the `destroy` hooks will
never be called.

#### `eventemitterasyncresource.triggerAsyncId`[#](#eventemitterasyncresourcetriggerasyncid)

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The same `triggerAsyncId` that is passed to the
  `AsyncResource` constructor.

### `EventTarget` and `Event` API[#](#eventtarget-and-event-api)

Added in: v14.5.0History

| Version | Changes |
| --- | --- |
| v16.0.0 | changed EventTarget error handling. |
| v15.4.0 | No longer experimental. |
| v15.0.0 | The `EventTarget` and `Event` classes are now available as globals. |

The `EventTarget` and `Event` objects are a Node.js-specific implementation
of the [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget) that are exposed by some Node.js core APIs.

```
const target = new EventTarget();

target.addEventListener('foo', (event) => {
  console.log('foo event happened!');
});

jscopy
```

#### Node.js `EventTarget` vs. DOM `EventTarget`[#](#nodejs-eventtarget-vs-dom-eventtarget)

There are two key differences between the Node.js `EventTarget` and the
[`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget):

1. Whereas DOM `EventTarget` instances *may* be hierarchical, there is no
   concept of hierarchy and event propagation in Node.js. That is, an event
   dispatched to an `EventTarget` does not propagate through a hierarchy of
   nested target objects that may each have their own set of handlers for the
   event.
2. In the Node.js `EventTarget`, if an event listener is an async function
   or returns a `Promise`, and the returned `Promise` rejects, the rejection
   is automatically captured and handled the same way as a listener that
   throws synchronously (see [`EventTarget` error handling](#eventtarget-error-handling) for details).

#### `NodeEventTarget` vs. `EventEmitter`[#](#nodeeventtarget-vs-eventemitter)

The `NodeEventTarget` object implements a modified subset of the
`EventEmitter` API that allows it to closely *emulate* an `EventEmitter` in
certain situations. A `NodeEventTarget` is *not* an instance of `EventEmitter`
and cannot be used in place of an `EventEmitter` in most cases.

1. Unlike `EventEmitter`, any given `listener` can be registered at most once
   per event `type`. Attempts to register a `listener` multiple times are
   ignored.
2. The `NodeEventTarget` does not emulate the full `EventEmitter` API.
   Specifically the `prependListener()`, `prependOnceListener()`,
   `rawListeners()`, and `errorMonitor` APIs are not emulated.
   The `'newListener'` and `'removeListener'` events will also not be emitted.
3. The `NodeEventTarget` does not implement any special default behavior
   for events with type `'error'`.
4. The `NodeEventTarget` supports `EventListener` objects as well as
   functions as handlers for all event types.

#### Event listener[#](#event-listener)

Event listeners registered for an event `type` may either be JavaScript
functions or objects with a `handleEvent` property whose value is a function.

In either case, the handler function is invoked with the `event` argument
passed to the `eventTarget.dispatchEvent()` function.

Async functions may be used as event listeners. If an async handler function
rejects, the rejection is captured and handled as described in
[`EventTarget` error handling](#eventtarget-error-handling).

An error thrown by one handler function does not prevent the other handlers
from being invoked.

The return value of a handler function is ignored.

Handlers are always invoked in the order they were added.

Handler functions may mutate the `event` object.

```
function handler1(event) {
  console.log(event.type);  // Prints 'foo'
  event.a = 1;
}

async function handler2(event) {
  console.log(event.type);  // Prints 'foo'
  console.log(event.a);  // Prints 1
}

const handler3 = {
  handleEvent(event) {
    console.log(event.type);  // Prints 'foo'
  },
};

const handler4 = {
  async handleEvent(event) {
    console.log(event.type);  // Prints 'foo'
  },
};

const target = new EventTarget();

target.addEventListener('foo', handler1);
target.addEventListener('foo', handler2);
target.addEventListener('foo', handler3);
target.addEventListener('foo', handler4, { once: true });

jscopy
```

#### `EventTarget` error handling[#](#eventtarget-error-handling)

When a registered event listener throws (or returns a Promise that rejects),
by default the error is treated as an uncaught exception on
`process.nextTick()`. This means uncaught exceptions in `EventTarget`s will
terminate the Node.js process by default.

Throwing within an event listener will *not* stop the other registered handlers
from being invoked.

The `EventTarget` does not implement any special default handling for `'error'`
type events like `EventEmitter`.

Currently errors are first forwarded to the `process.on('error')` event
before reaching `process.on('uncaughtException')`. This behavior is
deprecated and will change in a future release to align `EventTarget` with
other Node.js APIs. Any code relying on the `process.on('error')` event should
be aligned with the new behavior.

#### Class: `Event`[#](#class-event)

Added in: v14.5.0History

| Version | Changes |
| --- | --- |
| v15.0.0 | The `Event` class is now available through the global object. |

The `Event` object is an adaptation of the [`Event` Web API](https://dom.spec.whatwg.org/#event). Instances
are created internally by Node.js.

##### `event.bubbles`[#](#eventbubbles)

Added in: v14.5.0

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Always returns `false`.

This is not used in Node.js and is provided purely for completeness.

##### `event.cancelBubble`[#](#eventcancelbubble)

Added in: v14.5.0

Stability: 3 - Legacy: Use [`event.stopPropagation()`](#eventstoppropagation) instead.

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Alias for `event.stopPropagation()` if set to `true`. This is not used
in Node.js and is provided purely for completeness.

##### `event.cancelable`[#](#eventcancelable)

Added in: v14.5.0

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) True if the event was created with the `cancelable` option.

##### `event.composed`[#](#eventcomposed)

Added in: v14.5.0

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Always returns `false`.

This is not used in Node.js and is provided purely for completeness.

##### `event.composedPath()`[#](#eventcomposedpath)

Added in: v14.5.0

Returns an array containing the current `EventTarget` as the only entry or
empty if the event is not being dispatched. This is not used in
Node.js and is provided purely for completeness.

##### `event.currentTarget`[#](#eventcurrenttarget)

Added in: v14.5.0

- Type: [`<EventTarget>`](events.html#class-eventtarget) The `EventTarget` dispatching the event.

Alias for `event.target`.

##### `event.defaultPrevented`[#](#eventdefaultprevented)

Added in: v14.5.0

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Is `true` if `cancelable` is `true` and `event.preventDefault()` has been
called.

##### `event.eventPhase`[#](#eventeventphase)

Added in: v14.5.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Returns `0` while an event is not being dispatched, `2` while
  it is being dispatched.

This is not used in Node.js and is provided purely for completeness.

##### `event.initEvent(type[, bubbles[, cancelable]])`[#](#eventiniteventtype-bubbles-cancelable)

Added in: v19.5.0

Stability: 3 - Legacy: The WHATWG spec considers it deprecated and users
shouldn't use it at all.

- `type` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- `bubbles` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)
- `cancelable` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Redundant with event constructors and incapable of setting `composed`.
This is not used in Node.js and is provided purely for completeness.

##### `event.isTrusted`[#](#eventistrusted)

Added in: v14.5.0

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

The [`<AbortSignal>`](globals.html#class-abortsignal) `"abort"` event is emitted with `isTrusted` set to `true`. The
value is `false` in all other cases.

##### `event.preventDefault()`[#](#eventpreventdefault)

Added in: v14.5.0

Sets the `defaultPrevented` property to `true` if `cancelable` is `true`.

##### `event.returnValue`[#](#eventreturnvalue)

Added in: v14.5.0

Stability: 3 - Legacy: Use [`event.defaultPrevented`](#eventdefaultprevented) instead.

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) True if the event has not been canceled.

The value of `event.returnValue` is always the opposite of `event.defaultPrevented`.
This is not used in Node.js and is provided purely for completeness.

##### `event.srcElement`[#](#eventsrcelement)

Added in: v14.5.0

Stability: 3 - Legacy: Use [`event.target`](#eventtarget) instead.

- Type: [`<EventTarget>`](events.html#class-eventtarget) The `EventTarget` dispatching the event.

Alias for `event.target`.

##### `event.stopImmediatePropagation()`[#](#eventstopimmediatepropagation)

Added in: v14.5.0

Stops the invocation of event listeners after the current one completes.

##### `event.stopPropagation()`[#](#eventstoppropagation)

Added in: v14.5.0

This is not used in Node.js and is provided purely for completeness.

##### `event.target`[#](#eventtarget)

Added in: v14.5.0

- Type: [`<EventTarget>`](events.html#class-eventtarget) The `EventTarget` dispatching the event.

##### `event.timeStamp`[#](#eventtimestamp)

Added in: v14.5.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The millisecond timestamp when the `Event` object was created.

##### `event.type`[#](#eventtype)

Added in: v14.5.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

The event type identifier.

#### Class: `EventTarget`[#](#class-eventtarget)

Added in: v14.5.0History

| Version | Changes |
| --- | --- |
| v15.0.0 | The `EventTarget` class is now available through the global object. |

##### `eventTarget.addEventListener(type, listener[, options])`[#](#eventtargetaddeventlistenertype-listener-options)

Added in: v14.5.0History

| Version | Changes |
| --- | --- |
| v15.4.0 | add support for `signal` option. |

- `type` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<EventListener>`](events.html#event-listener)
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `once` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) When `true`, the listener is automatically removed
    when it is first invoked. **Default:** `false`.
  - `passive` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) When `true`, serves as a hint that the listener will
    not call the `Event` object's `preventDefault()` method.
    **Default:** `false`.
  - `capture` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Not directly used by Node.js. Added for API
    completeness. **Default:** `false`.
  - `signal` [`<AbortSignal>`](globals.html#class-abortsignal) The listener will be removed when the given
    AbortSignal object's `abort()` method is called.

Adds a new handler for the `type` event. Any given `listener` is added
only once per `type` and per `capture` option value.

If the `once` option is `true`, the `listener` is removed after the
next time a `type` event is dispatched.

The `capture` option is not used by Node.js in any functional way other than
tracking registered event listeners per the `EventTarget` specification.
Specifically, the `capture` option is used as part of the key when registering
a `listener`. Any individual `listener` may be added once with
`capture = false`, and once with `capture = true`.

```
function handler(event) {}

const target = new EventTarget();
target.addEventListener('foo', handler, { capture: true });  // first
target.addEventListener('foo', handler, { capture: false }); // second

// Removes the second instance of handler
target.removeEventListener('foo', handler);

// Removes the first instance of handler
target.removeEventListener('foo', handler, { capture: true });

jscopy
```

##### `eventTarget.dispatchEvent(event)`[#](#eventtargetdispatcheventevent)

Added in: v14.5.0

- `event` [`<Event>`](events.html#class-event)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) `true` if either event's `cancelable` attribute value is
  false or its `preventDefault()` method was not invoked, otherwise `false`.

Dispatches the `event` to the list of handlers for `event.type`.

The registered event listeners is synchronously invoked in the order they
were registered.

##### `eventTarget.removeEventListener(type, listener[, options])`[#](#eventtargetremoveeventlistenertype-listener-options)

Added in: v14.5.0

- `type` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<EventListener>`](events.html#event-listener)
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `capture` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

Removes the `listener` from the list of handlers for event `type`.

#### Class: `CustomEvent`[#](#class-customevent)

Added in: v18.7.0, v16.17.0History

| Version | Changes |
| --- | --- |
| v23.0.0 | No longer experimental. |
| v22.1.0, v20.13.0 | CustomEvent is now stable. |
| v19.0.0 | No longer behind `--experimental-global-customevent` CLI flag. |

- Extends: [`<Event>`](events.html#class-event)

The `CustomEvent` object is an adaptation of the [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent).
Instances are created internally by Node.js.

##### `event.detail`[#](#eventdetail)

Added in: v18.7.0, v16.17.0History

| Version | Changes |
| --- | --- |
| v22.1.0, v20.13.0 | CustomEvent is now stable. |

- Type: [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) Returns custom data passed when initializing.

Read-only.

#### Class: `NodeEventTarget`[#](#class-nodeeventtarget)

Added in: v14.5.0

- Extends: [`<EventTarget>`](events.html#class-eventtarget)

The `NodeEventTarget` is a Node.js-specific extension to `EventTarget`
that emulates a subset of the `EventEmitter` API.

##### `nodeEventTarget.addListener(type, listener)`[#](#nodeeventtargetaddlistenertype-listener)

Added in: v14.5.0

- `type` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<EventListener>`](events.html#event-listener)
- Returns: [`<EventTarget>`](events.html#class-eventtarget) this

Node.js-specific extension to the `EventTarget` class that emulates the
equivalent `EventEmitter` API. The only difference between `addListener()` and
`addEventListener()` is that `addListener()` will return a reference to the
`EventTarget`.

##### `nodeEventTarget.emit(type, arg)`[#](#nodeeventtargetemittype-arg)

Added in: v15.2.0

- `type` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- `arg` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) `true` if event listeners registered for the `type` exist,
  otherwise `false`.

Node.js-specific extension to the `EventTarget` class that dispatches the
`arg` to the list of handlers for `type`.

##### `nodeEventTarget.eventNames()`[#](#nodeeventtargeteventnames)

Added in: v14.5.0

- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[]

Node.js-specific extension to the `EventTarget` class that returns an array
of event `type` names for which event listeners are registered.

##### `nodeEventTarget.listenerCount(type)`[#](#nodeeventtargetlistenercounttype)

Added in: v14.5.0

- `type` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- Returns: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

Node.js-specific extension to the `EventTarget` class that returns the number
of event listeners registered for the `type`.

##### `nodeEventTarget.setMaxListeners(n)`[#](#nodeeventtargetsetmaxlistenersn)

Added in: v14.5.0

- `n` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

Node.js-specific extension to the `EventTarget` class that sets the number
of max event listeners as `n`.

##### `nodeEventTarget.getMaxListeners()`[#](#nodeeventtargetgetmaxlisteners)

Added in: v14.5.0

- Returns: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

Node.js-specific extension to the `EventTarget` class that returns the number
of max event listeners.

##### `nodeEventTarget.off(type, listener[, options])`[#](#nodeeventtargetofftype-listener-options)

Added in: v14.5.0

- `type` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<EventListener>`](events.html#event-listener)
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

  - `capture` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)
- Returns: [`<EventTarget>`](events.html#class-eventtarget) this

Node.js-specific alias for `eventTarget.removeEventListener()`.

##### `nodeEventTarget.on(type, listener)`[#](#nodeeventtargetontype-listener)

Added in: v14.5.0

- `type` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<EventListener>`](events.html#event-listener)
- Returns: [`<EventTarget>`](events.html#class-eventtarget) this

Node.js-specific alias for `eventTarget.addEventListener()`.

##### `nodeEventTarget.once(type, listener)`[#](#nodeeventtargetoncetype-listener)

Added in: v14.5.0

- `type` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<EventListener>`](events.html#event-listener)
- Returns: [`<EventTarget>`](events.html#class-eventtarget) this

Node.js-specific extension to the `EventTarget` class that adds a `once`
listener for the given event `type`. This is equivalent to calling `on`
with the `once` option set to `true`.

##### `nodeEventTarget.removeAllListeners([type])`[#](#nodeeventtargetremovealllistenerstype)

Added in: v14.5.0

- `type` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- Returns: [`<EventTarget>`](events.html#class-eventtarget) this

Node.js-specific extension to the `EventTarget` class. If `type` is specified,
removes all registered listeners for `type`, otherwise removes all registered
listeners.

##### `nodeEventTarget.removeListener(type, listener[, options])`[#](#nodeeventtargetremovelistenertype-listener-options)

Added in: v14.5.0

- `type` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- `listener` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) | [`<EventListener>`](events.html#event-listener)
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

  - `capture` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)
- Returns: [`<EventTarget>`](events.html#class-eventtarget) this

Node.js-specific extension to the `EventTarget` class that removes the
`listener` for the given `type`. The only difference between `removeListener()`
and `removeEventListener()` is that `removeListener()` will return a reference
to the `EventTarget`.
