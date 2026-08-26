# Diagnostics Channel | Node.js v26.5.0 Documentation

Source: https://nodejs.org/api/diagnostics_channel.html

## Diagnostics Channel[#](#diagnostics-channel)

**Source Code:** [lib/diagnostics\_channel.js](https://github.com/nodejs/node/blob/main/lib/diagnostics_channel.js)Added in: v15.1.0, v14.17.0History

| Version | Changes |
| --- | --- |
| v19.2.0, v18.13.0 | diagnostics\_channel is now Stable. |

[Stability: 2](documentation.html#stability-index) - Stable

The `node:diagnostics_channel` module provides an API to create named channels
to report arbitrary message data for diagnostics purposes.

It can be accessed using:

```
import diagnostics_channel from 'node:diagnostics_channel';
const diagnostics_channel = require('node:diagnostics_channel');

javascriptcopy
```

It is intended that a module writer wanting to report diagnostics messages
will create one or many top-level channels to report messages through.
Channels may also be acquired at runtime but it is not encouraged
due to the additional overhead of doing so. Channels may be exported for
convenience, but as long as the name is known it can be acquired anywhere.

If you intend for your module to produce diagnostics data for others to
consume it is recommended that you include documentation of what named
channels are used along with the shape of the message data. Channel names
should generally include the module name to avoid collisions with data from
other modules.

### Public API[#](#public-api)

#### Overview[#](#overview)

Following is a simple overview of the public API.

```
import diagnostics_channel from 'node:diagnostics_channel';

// Get a reusable channel object
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

// Subscribe to the channel
diagnostics_channel.subscribe('my-channel', onMessage);

// Check if the channel has an active subscriber
if (channel.hasSubscribers) {
  // Publish data to the channel
  channel.publish({
    some: 'data',
  });
}

// Unsubscribe from the channel
diagnostics_channel.unsubscribe('my-channel', onMessage);
const diagnostics_channel = require('node:diagnostics_channel');

// Get a reusable channel object
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

// Subscribe to the channel
diagnostics_channel.subscribe('my-channel', onMessage);

// Check if the channel has an active subscriber
if (channel.hasSubscribers) {
  // Publish data to the channel
  channel.publish({
    some: 'data',
  });
}

// Unsubscribe from the channel
diagnostics_channel.unsubscribe('my-channel', onMessage);

javascriptcopy
```

##### `diagnostics_channel.hasSubscribers(name)`[#](#diagnostics_channelhassubscribersname)

Added in: v15.1.0, v14.17.0

- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) The channel name
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If there are active subscribers

Check if there are active subscribers to the named channel. This is helpful if
the message you want to send might be expensive to prepare.

This API is optional but helpful when trying to publish messages from very
performance-sensitive code.

```
import diagnostics_channel from 'node:diagnostics_channel';

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // There are subscribers, prepare and publish message
}
const diagnostics_channel = require('node:diagnostics_channel');

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // There are subscribers, prepare and publish message
}

javascriptcopy
```

##### `diagnostics_channel.channel(name)`[#](#diagnostics_channelchannelname)

Added in: v15.1.0, v14.17.0

- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) The channel name
- Returns: [`<Channel>`](diagnostics_channel.html#class-channel) The named channel object

This is the primary entry-point for anyone wanting to publish to a named
channel. It produces a channel object which is optimized to reduce overhead at
publish time as much as possible.

```
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

javascriptcopy
```

##### `diagnostics_channel.subscribe(name, onMessage)`[#](#diagnostics_channelsubscribename-onmessage)

Added in: v18.7.0, v16.17.0

- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) The channel name
- `onMessage` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The handler to receive channel messages
  - `message` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) The message data
  - `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) The name of the channel

Register a message handler to subscribe to this channel. This message handler
will be run synchronously whenever a message is published to the channel. Any
errors thrown in the message handler will trigger an [`'uncaughtException'`](process.html#event-uncaughtexception).

```
import diagnostics_channel from 'node:diagnostics_channel';

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Received data
});
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Received data
});

javascriptcopy
```

##### `diagnostics_channel.unsubscribe(name, onMessage)`[#](#diagnostics_channelunsubscribename-onmessage)

Added in: v18.7.0, v16.17.0

- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) The channel name
- `onMessage` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The previous subscribed handler to remove
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) `true` if the handler was found, `false` otherwise.

Remove a message handler previously registered to this channel with
[`diagnostics_channel.subscribe(name, onMessage)`](#diagnostics_channelsubscribename-onmessage).

```
import diagnostics_channel from 'node:diagnostics_channel';

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
const diagnostics_channel = require('node:diagnostics_channel');

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);

javascriptcopy
```

##### `diagnostics_channel.tracingChannel(nameOrChannels)`[#](#diagnostics_channeltracingchannelnameorchannels)

Added in: v19.9.0, v18.19.0

Stability: 1 - Experimental

- `nameOrChannels` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<TracingChannel>`](diagnostics_channel.html#class-tracingchannel) Channel name or
  object containing all the [TracingChannel Channels](#tracingchannel-channels)
- Returns: [`<TracingChannel>`](diagnostics_channel.html#class-tracingchannel) Collection of channels to trace with

Creates a [`TracingChannel`](#class-tracingchannel) wrapper for the given
[TracingChannel Channels](#tracingchannel-channels). If a name is given, the corresponding tracing
channels will be created in the form of `tracing:${name}:${eventType}` where
`eventType` corresponds to the types of [TracingChannel Channels](#tracingchannel-channels).

```
import diagnostics_channel from 'node:diagnostics_channel';

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
const diagnostics_channel = require('node:diagnostics_channel');

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});

javascriptcopy
```

##### `diagnostics_channel.boundedChannel(nameOrChannels)`[#](#diagnostics_channelboundedchannelnameorchannels)

Added in: v26.1.0

Stability: 1 - Experimental

- `nameOrChannels` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | `<BoundedChannel>` Channel name or
  object containing all the [BoundedChannel Channels](#boundedchannel-channels)
- Returns: {BoundedChannel} Collection of channels to trace with

Creates a [`BoundedChannel`](#class-boundedchannel) wrapper for the given channels. If a name is
given, the corresponding channels will be created in the form of
`tracing:${name}:${eventType}` where `eventType` is `start` or `end`.

A `BoundedChannel` is a simplified version of [`TracingChannel`](#class-tracingchannel) that only
traces synchronous operations. It only has `start` and `end` events, without
`asyncStart`, `asyncEnd`, or `error` events, making it suitable for tracing
operations that don't involve asynchronous continuations or error handling.

```
import { boundedChannel, channel } from 'node:diagnostics_channel';

const wc = boundedChannel('my-operation');

// or...

const wc2 = boundedChannel({
  start: channel('tracing:my-operation:start'),
  end: channel('tracing:my-operation:end'),
});
const { boundedChannel, channel } = require('node:diagnostics_channel');

const wc = boundedChannel('my-operation');

// or...

const wc2 = boundedChannel({
  start: channel('tracing:my-operation:start'),
  end: channel('tracing:my-operation:end'),
});

javascriptcopy
```

#### Class: `Channel`[#](#class-channel)

Added in: v15.1.0, v14.17.0

The class `Channel` represents an individual named channel within the data
pipeline. It is used to track subscribers and to publish messages when there
are subscribers present. It exists as a separate object to avoid channel
lookups at publish time, enabling very fast publish speeds and allowing
for heavy use while incurring very minimal cost. Channels are created with
[`diagnostics_channel.channel(name)`](#diagnostics_channelchannelname), constructing a channel directly
with `new Channel(name)` is not supported.

##### `channel.hasSubscribers`[#](#channelhassubscribers)

Added in: v15.1.0, v14.17.0

- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) If there are active subscribers

Check if there are active subscribers to this channel. This is helpful if
the message you want to send might be expensive to prepare.

This API is optional but helpful when trying to publish messages from very
performance-sensitive code.

```
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // There are subscribers, prepare and publish message
}
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // There are subscribers, prepare and publish message
}

javascriptcopy
```

##### `channel.publish(message)`[#](#channelpublishmessage)

Added in: v15.1.0, v14.17.0

- `message` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) The message to send to the channel subscribers

Publish a message to any subscribers to the channel. This will trigger
message handlers synchronously so they will execute within the same context.

```
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});

javascriptcopy
```

##### `channel.subscribe(onMessage)`[#](#channelsubscribeonmessage)

Added in: v15.1.0, v14.17.0History

| Version | Changes |
| --- | --- |
| v24.8.0, v22.20.0 | Deprecation revoked. |
| v18.7.0, v16.17.0 | Documentation-only deprecation. |

- `onMessage` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The handler to receive channel messages
  - `message` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) The message data
  - `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<symbol>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#symbol_type) The name of the channel

Register a message handler to subscribe to this channel. This message handler
will be run synchronously whenever a message is published to the channel. Any
errors thrown in the message handler will trigger an [`'uncaughtException'`](process.html#event-uncaughtexception).

```
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});

javascriptcopy
```

##### `channel.unsubscribe(onMessage)`[#](#channelunsubscribeonmessage)

Added in: v15.1.0, v14.17.0History

| Version | Changes |
| --- | --- |
| v24.8.0, v22.20.0 | Deprecation revoked. |
| v18.7.0, v16.17.0 | Documentation-only deprecation. |
| v17.1.0, v16.14.0, v14.19.0 | Added return value. Added to channels without subscribers. |

- `onMessage` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The previous subscribed handler to remove
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) `true` if the handler was found, `false` otherwise.

Remove a message handler previously registered to this channel with
[`channel.subscribe(onMessage)`](#channelsubscribeonmessage).

```
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);

javascriptcopy
```

##### `channel.bindStore(store[, transform])`[#](#channelbindstorestore-transform)

Added in: v19.9.0, v18.19.0

Stability: 1 - Experimental

- `store` [`<AsyncLocalStorage>`](async_context.html#class-asynclocalstorage) The store to which to bind the context data
- `transform` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) Transform context data before setting the store context

When [`channel.runStores(context, ...)`](#channelrunstorescontext-fn-thisarg-args) is called, the given context data
will be applied to any store bound to the channel. If the store has already been
bound the previous `transform` function will be replaced with the new one.
The `transform` function may be omitted to set the given context data as the
context directly.

```
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});

javascriptcopy
```

##### `channel.unbindStore(store)`[#](#channelunbindstorestore)

Added in: v19.9.0, v18.19.0

Stability: 1 - Experimental

- `store` [`<AsyncLocalStorage>`](async_context.html#class-asynclocalstorage) The store to unbind from the channel.
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) `true` if the store was found, `false` otherwise.

Remove a message handler previously registered to this channel with
[`channel.bindStore(store)`](#channelbindstorestore-transform).

```
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);

javascriptcopy
```

##### `channel.runStores(context, fn[, thisArg[, ...args]])`[#](#channelrunstorescontext-fn-thisarg-args)

Added in: v19.9.0, v18.19.0

Stability: 1 - Experimental

- `context` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) Message to send to subscribers and bind to stores
- `fn` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) Handler to run within the entered storage context
- `thisArg` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) The receiver to be used for the function call.
- `...args` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) Optional arguments to pass to the function.

Applies the given data to any AsyncLocalStorage instances bound to the channel
for the duration of the given function, then publishes to the channel within
the scope of that data is applied to the stores.

If a transform function was given to [`channel.bindStore(store)`](#channelbindstorestore-transform) it will be
applied to transform the message data before it becomes the context value for
the store. The prior storage context is accessible from within the transform
function in cases where context linking is required.

The context applied to the store should be accessible in any async code which
continues from execution which began during the given function, however
there are some situations in which [context loss](async_context.html#troubleshooting-context-loss) may occur.

```
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});

javascriptcopy
```

##### `channel.withStoreScope(data)`[#](#channelwithstorescopedata)

Added in: v26.1.0

Stability: 1 - Experimental

- `data` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) Message to bind to stores
- Returns: {RunStoresScope} Disposable scope object

Creates a disposable scope that binds the given data to any AsyncLocalStorage
instances bound to the channel and publishes it to subscribers. The scope
automatically restores the previous storage contexts when disposed.

This method enables the use of JavaScript's explicit resource management
(`using` syntax with `Symbol.dispose`) to manage store contexts without
closure wrapping.

```
import { channel } from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();
const ch = channel('my-channel');

ch.bindStore(store, (message) => {
  return { ...message, timestamp: Date.now() };
});

{
  using scope = ch.withStoreScope({ request: 'data' });
  // Store is entered, data is published
  console.log(store.getStore()); // { request: 'data', timestamp: ... }
}
// Store is automatically restored on scope exit
const { channel } = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();
const ch = channel('my-channel');

ch.bindStore(store, (message) => {
  return { ...message, timestamp: Date.now() };
});

{
  using scope = ch.withStoreScope({ request: 'data' });
  // Store is entered, data is published
  console.log(store.getStore()); // { request: 'data', timestamp: ... }
}
// Store is automatically restored on scope exit

javascriptcopy
```

#### Class: `RunStoresScope`[#](#class-runstoresscope)

Added in: v26.1.0

Stability: 1 - Experimental

The class `RunStoresScope` represents a disposable scope created by
[`channel.withStoreScope(data)`](#channelwithstorescopedata). It manages the lifecycle of store
contexts and ensures they are properly restored when the scope exits.

The scope must be used with the `using` syntax to ensure proper disposal.

#### Class: `TracingChannel`[#](#class-tracingchannel)

Added in: v19.9.0, v18.19.0

Stability: 1 - Experimental

The class `TracingChannel` is a collection of [TracingChannel Channels](#tracingchannel-channels) which
together express a single traceable action. It is used to formalize and
simplify the process of producing events for tracing application flow.
[`diagnostics_channel.tracingChannel()`](#diagnostics_channeltracingchannelnameorchannels) is used to construct a
`TracingChannel`. As with `Channel` it is recommended to create and reuse a
single `TracingChannel` at the top-level of the file rather than creating them
dynamically.

##### `tracingChannel.subscribe(subscribers)`[#](#tracingchannelsubscribesubscribers)

Added in: v19.9.0, v18.19.0

- `subscribers` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Set of [TracingChannel Channels](#tracingchannel-channels) subscribers
  - `start` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`start` event](#startevent) subscriber
  - `end` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`end` event](#endevent) subscriber
  - `asyncStart` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`asyncStart` event](#asyncstartevent) subscriber
  - `asyncEnd` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`asyncEnd` event](#asyncendevent) subscriber
  - `error` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`error` event](#errorevent) subscriber

Helper to subscribe a collection of functions to the corresponding channels.
This is the same as calling [`channel.subscribe(onMessage)`](#channelsubscribeonmessage) on each channel
individually.

```
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});

javascriptcopy
```

##### `tracingChannel.unsubscribe(subscribers)`[#](#tracingchannelunsubscribesubscribers)

Added in: v19.9.0, v18.19.0

- `subscribers` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Set of [TracingChannel Channels](#tracingchannel-channels) subscribers
  - `start` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`start` event](#startevent) subscriber
  - `end` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`end` event](#endevent) subscriber
  - `asyncStart` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`asyncStart` event](#asyncstartevent) subscriber
  - `asyncEnd` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`asyncEnd` event](#asyncendevent) subscriber
  - `error` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The [`error` event](#errorevent) subscriber
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) `true` if all handlers were successfully unsubscribed,
  and `false` otherwise.

Helper to unsubscribe a collection of functions from the corresponding channels.
This is the same as calling [`channel.unsubscribe(onMessage)`](#channelunsubscribeonmessage) on each channel
individually.

```
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});

javascriptcopy
```

##### `tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])`[#](#tracingchanneltracesyncfn-context-thisarg-args)

Added in: v19.9.0, v18.19.0

- `fn` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) Function to wrap a trace around
- `context` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Shared object to correlate events through
- `thisArg` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) The receiver to be used for the function call
- `...args` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) Optional arguments to pass to the function
- Returns: [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) The return value of the given function

Trace a synchronous function call. This will always produce a [`start` event](#startevent)
and [`end` event](#endevent) around the execution and may produce an [`error` event](#errorevent)
if the given function throws an error. This will run the given function using
[`channel.runStores(context, ...)`](#channelrunstorescontext-fn-thisarg-args) on the `start` channel which ensures all
events should have any bound stores set to match this trace context.

To ensure only correct trace graphs are formed, events will only be published
if subscribers are present prior to starting the trace. Subscriptions which are
added after the trace begins will not receive future events from that trace,
only future traces will be seen.

```
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});

javascriptcopy
```

##### `tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])`[#](#tracingchanneltracepromisefn-context-thisarg-args)

Added in: v19.9.0, v18.19.0History

| Version | Changes |
| --- | --- |
| v26.5.0 | Non-native-Promise thenables are now returned as-is, preserving their original type and methods. |
| v26.0.0 | Non-thenables will be returned with a warning. |

- `fn` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) Function to wrap a trace around
- `context` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Shared object to correlate trace events through
- `thisArg` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) The receiver to be used for the function call
- `...args` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) Optional arguments to pass to the function
- Returns: [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) The return value of the given function. If the return value
  is a Promise or thenable, tracing events will be published when it settles.
  If the return value is not a Promise or thenable, it is returned as-is and
  a warning is emitted.

Trace an asynchronous function call which returns a [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [thenable object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#thenables). This will always produce a [`start` event](#startevent) and
[`end` event](#endevent) around the synchronous portion of the function execution, and
will produce an [`asyncStart` event](#asyncstartevent) and [`asyncEnd` event](#asyncendevent) when the
returned promise is resolved or rejected. It may also produce an
[`error` event](#errorevent) if the given function throws an error or the returned promise
is rejected. This will run the given function using
[`channel.runStores(context, ...)`](#channelrunstorescontext-fn-thisarg-args) on the `start` channel which ensures all
events should have any bound stores set to match this trace context.

If the value returned by `fn` is not a Promise or thenable, then it will be
returned with a warning, and no `asyncStart` or `asyncEnd` events will be
produced.

To ensure only correct trace graphs are formed, events will only be published
if subscribers are present prior to starting the trace. Subscriptions which are
added after the trace begins will not receive future events from that trace,
only future traces will be seen.

```
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});

javascriptcopy
```

##### `tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])`[#](#tracingchanneltracecallbackfn-position-context-thisarg-args)

Added in: v19.9.0, v18.19.0

- `fn` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) callback using function to wrap a trace around
- `position` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) Zero-indexed argument position of expected callback
  (defaults to last argument if `undefined` is passed)
- `context` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Shared object to correlate trace events through (defaults
  to `{}` if `undefined` is passed)
- `thisArg` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) The receiver to be used for the function call
- `...args` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) arguments to pass to the function (must include the callback)
- Returns: [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) The return value of the given function

Trace a callback-receiving function call. The callback is expected to follow
the error as first arg convention typically used. This will always produce a
[`start` event](#startevent) and [`end` event](#endevent) around the synchronous portion of the
function execution, and will produce a [`asyncStart` event](#asyncstartevent) and
[`asyncEnd` event](#asyncendevent) around the callback execution. It may also produce an
[`error` event](#errorevent) if the given function throws or the first argument passed to
the callback is set. This will run the given function using
[`channel.runStores(context, ...)`](#channelrunstorescontext-fn-thisarg-args) on the `start` channel which ensures all
events should have any bound stores set to match this trace context.

To ensure only correct trace graphs are formed, events will only be published
if subscribers are present prior to starting the trace. Subscriptions which are
added after the trace begins will not receive future events from that trace,
only future traces will be seen.

```
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);

javascriptcopy
```

The callback will also be run with [`channel.runStores(context, ...)`](#channelrunstorescontext-fn-thisarg-args) which
enables context loss recovery in some cases.

```
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});

javascriptcopy
```

##### `tracingChannel.hasSubscribers`[#](#tracingchannelhassubscribers)

Added in: v22.0.0, v20.13.0

- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) `true` if any of the individual channels has a subscriber,
  `false` if not.

This is a helper method available on a [`TracingChannel`](#class-tracingchannel) instance to check if
any of the [TracingChannel Channels](#tracingchannel-channels) have subscribers. A `true` is returned if
any of them have at least one subscriber, a `false` is returned otherwise.

```
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}

javascriptcopy
```

#### Class: `BoundedChannel`[#](#class-boundedchannel)

Added in: v26.1.0

Stability: 1 - Experimental

The class `BoundedChannel` is a simplified version of [`TracingChannel`](#class-tracingchannel) that
only traces synchronous operations. It consists of two channels (`start` and
`end`) instead of five, omitting the `asyncStart`, `asyncEnd`, and `error`
events. This makes it suitable for tracing operations that don't involve
asynchronous continuations or error handling.

Like `TracingChannel`, it is recommended to create and reuse a single
`BoundedChannel` at the top-level of the file rather than creating them
dynamically.

##### `boundedChannel.hasSubscribers`[#](#boundedchannelhassubscribers)

Added in: v26.1.0

- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) `true` if any of the individual channels has a subscriber,
  `false` if not.

Check if any of the `start` or `end` channels have subscribers.

```
import { boundedChannel } from 'node:diagnostics_channel';

const wc = boundedChannel('my-operation');

if (wc.hasSubscribers) {
  // There are subscribers, perform traced operation
}
const { boundedChannel } = require('node:diagnostics_channel');

const wc = boundedChannel('my-operation');

if (wc.hasSubscribers) {
  // There are subscribers, perform traced operation
}

javascriptcopy
```

##### `boundedChannel.subscribe(handlers)`[#](#boundedchannelsubscribehandlers)

Added in: v26.1.0

- `handlers` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Set of channel subscribers
  - `start` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The start event subscriber
  - `end` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The end event subscriber

Subscribe to the bounded channel events. This is equivalent to calling
[`channel.subscribe(onMessage)`](#channelsubscribeonmessage) on each channel individually.

```
import { boundedChannel } from 'node:diagnostics_channel';

const wc = boundedChannel('my-operation');

wc.subscribe({
  start(message) {
    // Handle start
  },
  end(message) {
    // Handle end
  },
});
const { boundedChannel } = require('node:diagnostics_channel');

const wc = boundedChannel('my-operation');

wc.subscribe({
  start(message) {
    // Handle start
  },
  end(message) {
    // Handle end
  },
});

javascriptcopy
```

##### `boundedChannel.unsubscribe(handlers)`[#](#boundedchannelunsubscribehandlers)

Added in: v26.1.0

- `handlers` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Set of channel subscribers
  - `start` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The start event subscriber
  - `end` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) The end event subscriber
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) `true` if all handlers were successfully unsubscribed,
  `false` otherwise.

Unsubscribe from the bounded channel events. This is equivalent to calling
[`channel.unsubscribe(onMessage)`](#channelunsubscribeonmessage) on each channel individually.

```
import { boundedChannel } from 'node:diagnostics_channel';

const wc = boundedChannel('my-operation');

const handlers = {
  start(message) {},
  end(message) {},
};

wc.subscribe(handlers);
wc.unsubscribe(handlers);
const { boundedChannel } = require('node:diagnostics_channel');

const wc = boundedChannel('my-operation');

const handlers = {
  start(message) {},
  end(message) {},
};

wc.subscribe(handlers);
wc.unsubscribe(handlers);

javascriptcopy
```

##### `boundedChannel.run(context, fn[, thisArg[, ...args]])`[#](#boundedchannelruncontext-fn-thisarg-args)

Added in: v26.1.0

- `context` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Shared object to correlate events through
- `fn` [`<Function>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function) Function to wrap a trace around
- `thisArg` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) The receiver to be used for the function call
- `...args` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) Optional arguments to pass to the function
- Returns: [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types) The return value of the given function

Trace a synchronous function call. This will produce a `start` event and `end`
event around the execution. This runs the given function using
[`channel.runStores(context, ...)`](#channelrunstorescontext-fn-thisarg-args) on the `start` channel which ensures all
events have any bound stores set to match this trace context.

```
import { boundedChannel } from 'node:diagnostics_channel';

const wc = boundedChannel('my-operation');

const result = wc.run({ operationId: '123' }, () => {
  // Perform operation
  return 42;
});
const { boundedChannel } = require('node:diagnostics_channel');

const wc = boundedChannel('my-operation');

const result = wc.run({ operationId: '123' }, () => {
  // Perform operation
  return 42;
});

javascriptcopy
```

##### `boundedChannel.withScope([context])`[#](#boundedchannelwithscopecontext)

Added in: v26.1.0

- `context` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) Shared object to correlate events through
- Returns: {BoundedChannelScope} Disposable scope object

Create a disposable scope for tracing a synchronous operation using JavaScript's
explicit resource management (`using` syntax). The scope automatically publishes
`start` and `end` events, enters bound stores, and handles cleanup when disposed.

```
import { boundedChannel } from 'node:diagnostics_channel';

const wc = boundedChannel('my-operation');

const context = { operationId: '123' };
{
  using scope = wc.withScope(context);
  // Stores are entered, start event is published

  // Perform work and set result on context
  context.result = 42;
}
// End event is published, stores are restored automatically
const { boundedChannel } = require('node:diagnostics_channel');

const wc = boundedChannel('my-operation');

const context = { operationId: '123' };
{
  using scope = wc.withScope(context);
  // Stores are entered, start event is published

  // Perform work and set result on context
  context.result = 42;
}
// End event is published, stores are restored automatically

javascriptcopy
```

#### Class: `BoundedChannelScope`[#](#class-boundedchannelscope)

Added in: v26.1.0

Stability: 1 - Experimental

The class `BoundedChannelScope` represents a disposable scope created by
[`boundedChannel.withScope(context)`](#boundedchannelwithscopecontext). It manages the lifecycle of a traced
operation, automatically publishing events and managing store contexts.

The scope must be used with the `using` syntax to ensure proper disposal.

```
import { boundedChannel } from 'node:diagnostics_channel';

const wc = boundedChannel('my-operation');

const context = {};
{
  using scope = wc.withScope(context);
  // Start event is published, stores are entered
  context.result = performOperation();
  // End event is automatically published at end of block
}
const { boundedChannel } = require('node:diagnostics_channel');

const wc = boundedChannel('my-operation');

const context = {};
{
  using scope = wc.withScope(context);
  // Start event is published, stores are entered
  context.result = performOperation();
  // End event is automatically published at end of block
}

javascriptcopy
```

#### BoundedChannel Channels[#](#boundedchannel-channels)

A `BoundedChannel` consists of two diagnostics channels representing the
lifecycle of a scope created with the `using` syntax:

- `tracing:${name}:start` - Published when the `using` statement executes (scope creation)
- `tracing:${name}:end` - Published when exiting the block (scope disposal)

When using the `using` syntax with [`boundedChannel.withScope([context])`][], the `start`
event is published immediately when the statement executes, and the `end` event
is automatically published when disposal occurs at the end of the block. All
events share the same context object, which can be extended with additional
properties like `result` during scope execution.

#### TracingChannel Channels[#](#tracingchannel-channels)

A TracingChannel is a collection of several diagnostics\_channels representing
specific points in the execution lifecycle of a single traceable action. The
behavior is split into five diagnostics\_channels consisting of `start`,
`end`, `asyncStart`, `asyncEnd`, and `error`. A single traceable action will
share the same event object between all events, this can be helpful for
managing correlation through a weakmap.

These event objects will be extended with `result` or `error` values when
the task "completes". In the case of a synchronous task the `result` will be
the return value and the `error` will be anything thrown from the function.
With callback-based async functions the `result` will be the second argument
of the callback while the `error` will either be a thrown error visible in the
`end` event or the first callback argument in either of the `asyncStart` or
`asyncEnd` events.

To ensure only correct trace graphs are formed, events should only be published
if subscribers are present prior to starting the trace. Subscriptions which are
added after the trace begins should not receive future events from that trace,
only future traces will be seen.

Tracing channels should follow a naming pattern of:

- `tracing:module.class.method:start` or `tracing:module.function:start`
- `tracing:module.class.method:end` or `tracing:module.function:end`
- `tracing:module.class.method:asyncStart` or `tracing:module.function:asyncStart`
- `tracing:module.class.method:asyncEnd` or `tracing:module.function:asyncEnd`
- `tracing:module.class.method:error` or `tracing:module.function:error`

##### `start(event)`[#](#startevent)

- Name: `tracing:${name}:start`

The `start` event represents the point at which a function is called. At this
point the event data may contain function arguments or anything else available
at the very start of the execution of the function.

##### `end(event)`[#](#endevent)

- Name: `tracing:${name}:end`

The `end` event represents the point at which a function call returns a value.
In the case of an async function this is when the promise returned not when the
function itself makes a return statement internally. At this point, if the
traced function was synchronous the `result` field will be set to the return
value of the function. Alternatively, the `error` field may be present to
represent any thrown errors.

It is recommended to listen specifically to the `error` event to track errors
as it may be possible for a traceable action to produce multiple errors. For
example, an async task which fails may be started internally before the sync
part of the task then throws an error.

##### `asyncStart(event)`[#](#asyncstartevent)

- Name: `tracing:${name}:asyncStart`

The `asyncStart` event represents the callback or continuation of a traceable
function being reached. At this point things like callback arguments may be
available, or anything else expressing the "result" of the action.

For callbacks-based functions, the first argument of the callback will be
assigned to the `error` field, if not `undefined` or `null`, and the second
argument will be assigned to the `result` field.

For promises, the argument to the `resolve` path will be assigned to `result`
or the argument to the `reject` path will be assign to `error`.

It is recommended to listen specifically to the `error` event to track errors
as it may be possible for a traceable action to produce multiple errors. For
example, an async task which fails may be started internally before the sync
part of the task then throws an error.

##### `asyncEnd(event)`[#](#asyncendevent)

- Name: `tracing:${name}:asyncEnd`

The `asyncEnd` event represents the callback of an asynchronous function
returning. It's not likely event data will change after the `asyncStart` event,
however it may be useful to see the point where the callback completes.

##### `error(event)`[#](#errorevent)

- Name: `tracing:${name}:error`

The `error` event represents any error produced by the traceable function
either synchronously or asynchronously. If an error is thrown in the
synchronous portion of the traced function the error will be assigned to the
`error` field of the event and the `error` event will be triggered. If an error
is received asynchronously through a callback or promise rejection it will also
be assigned to the `error` field of the event and trigger the `error` event.

It is possible for a single traceable function call to produce errors multiple
times so this should be considered when consuming this event. For example, if
another async task is triggered internally which fails and then the sync part
of the function then throws and error two `error` events will be emitted, one
for the sync error and one for the async error.

#### Built-in Channels[#](#built-in-channels)

##### Console[#](#console)

Stability: 1 - Experimental

###### Event: `'console.log'`[#](#event-consolelog)

- `args` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)[]

Emitted when `console.log()` is called. Receives and array of the arguments
passed to `console.log()`.

###### Event: `'console.info'`[#](#event-consoleinfo)

- `args` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)[]

Emitted when `console.info()` is called. Receives and array of the arguments
passed to `console.info()`.

###### Event: `'console.debug'`[#](#event-consoledebug)

- `args` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)[]

Emitted when `console.debug()` is called. Receives and array of the arguments
passed to `console.debug()`.

###### Event: `'console.warn'`[#](#event-consolewarn)

- `args` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)[]

Emitted when `console.warn()` is called. Receives and array of the arguments
passed to `console.warn()`.

###### Event: `'console.error'`[#](#event-consoleerror)

- `args` [`<any>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#Data_types)[]

Emitted when `console.error()` is called. Receives and array of the arguments
passed to `console.error()`.

##### HTTP[#](#http)

Stability: 1 - Experimental

###### Event: `'http.client.request.created'`[#](#event-httpclientrequestcreated)

- `request` [`<http.ClientRequest>`](http.html#class-httpclientrequest)

Emitted when client creates a request object.
Unlike `http.client.request.start`, this event is emitted before the request has been sent.

###### Event: `'http.client.request.start'`[#](#event-httpclientrequeststart)

- `request` [`<http.ClientRequest>`](http.html#class-httpclientrequest)

Emitted when client starts a request.

###### Event: `'http.client.request.error'`[#](#event-httpclientrequesterror)

- `request` [`<http.ClientRequest>`](http.html#class-httpclientrequest)
- `error` [`<Error>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitted when an error occurs during a client request.

###### Event: `'http.client.response.finish'`[#](#event-httpclientresponsefinish)

- `request` [`<http.ClientRequest>`](http.html#class-httpclientrequest)
- `response` [`<http.IncomingMessage>`](http.html#class-httpincomingmessage)

Emitted when client receives a response.

###### Event: `'http.server.request.start'`[#](#event-httpserverrequeststart)

- `request` [`<http.IncomingMessage>`](http.html#class-httpincomingmessage)
- `response` [`<http.ServerResponse>`](http.html#class-httpserverresponse)
- `socket` [`<net.Socket>`](net.html#class-netsocket)
- `server` [`<http.Server>`](http.html#class-httpserver)

Emitted when server receives a request.

###### Event: `'http.server.response.created'`[#](#event-httpserverresponsecreated)

- `request` [`<http.IncomingMessage>`](http.html#class-httpincomingmessage)
- `response` [`<http.ServerResponse>`](http.html#class-httpserverresponse)

Emitted when server creates a response.
The event is emitted before the response is sent.

###### Event: `'http.server.response.finish'`[#](#event-httpserverresponsefinish)

- `request` [`<http.IncomingMessage>`](http.html#class-httpincomingmessage)
- `response` [`<http.ServerResponse>`](http.html#class-httpserverresponse)
- `socket` [`<net.Socket>`](net.html#class-netsocket)
- `server` [`<http.Server>`](http.html#class-httpserver)

Emitted when server sends a response.

##### HTTP/2[#](#http2)

Stability: 1 - Experimental

###### Event: `'http2.client.stream.created'`[#](#event-http2clientstreamcreated)

- `stream` [`<ClientHttp2Stream>`](http2.html#class-clienthttp2stream)
- `headers` [`<HTTP/2 Headers Object>`](http2.html#headers-object)

Emitted when a stream is created on the client.

###### Event: `'http2.client.stream.start'`[#](#event-http2clientstreamstart)

- `stream` [`<ClientHttp2Stream>`](http2.html#class-clienthttp2stream)
- `headers` [`<HTTP/2 Headers Object>`](http2.html#headers-object)

Emitted when a stream is started on the client.

###### Event: `'http2.client.stream.error'`[#](#event-http2clientstreamerror)

- `stream` [`<ClientHttp2Stream>`](http2.html#class-clienthttp2stream)
- `error` [`<Error>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitted when an error occurs during the processing of a stream on the client.

###### Event: `'http2.client.stream.finish'`[#](#event-http2clientstreamfinish)

- `stream` [`<ClientHttp2Stream>`](http2.html#class-clienthttp2stream)
- `headers` [`<HTTP/2 Headers Object>`](http2.html#headers-object)
- `flags` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

Emitted when a stream is received on the client.

###### Event: `'http2.client.stream.bodyChunkSent'`[#](#event-http2clientstreambodychunksent)

- `stream` [`<ClientHttp2Stream>`](http2.html#class-clienthttp2stream)
- `writev` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)
- `data` [`<Buffer>`](buffer.html#class-buffer) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Buffer>`](buffer.html#class-buffer)[] | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)[]
  - `chunk` [`<Buffer>`](buffer.html#class-buffer) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
  - `encoding` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- `encoding` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Emitted when a chunk of the client stream body is being sent.

###### Event: `'http2.client.stream.bodySent'`[#](#event-http2clientstreambodysent)

- `stream` [`<ClientHttp2Stream>`](http2.html#class-clienthttp2stream)

Emitted after the client stream body has been fully sent.

###### Event: `'http2.client.stream.close'`[#](#event-http2clientstreamclose)

- `stream` [`<ClientHttp2Stream>`](http2.html#class-clienthttp2stream)

Emitted when a stream is closed on the client. The HTTP/2 error code used when
closing the stream can be retrieved using the `stream.rstCode` property.

###### Event: `'http2.server.stream.created'`[#](#event-http2serverstreamcreated)

- `stream` [`<ServerHttp2Stream>`](http2.html#class-serverhttp2stream)
- `headers` [`<HTTP/2 Headers Object>`](http2.html#headers-object)

Emitted when a stream is created on the server.

###### Event: `'http2.server.stream.start'`[#](#event-http2serverstreamstart)

- `stream` [`<ServerHttp2Stream>`](http2.html#class-serverhttp2stream)
- `headers` [`<HTTP/2 Headers Object>`](http2.html#headers-object)

Emitted when a stream is started on the server.

###### Event: `'http2.server.stream.error'`[#](#event-http2serverstreamerror)

- `stream` [`<ServerHttp2Stream>`](http2.html#class-serverhttp2stream)
- `error` [`<Error>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitted when an error occurs during the processing of a stream on the server.

###### Event: `'http2.server.stream.finish'`[#](#event-http2serverstreamfinish)

- `stream` [`<ServerHttp2Stream>`](http2.html#class-serverhttp2stream)
- `headers` [`<HTTP/2 Headers Object>`](http2.html#headers-object)
- `flags` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

Emitted when a stream is sent on the server.

###### Event: `'http2.server.stream.close'`[#](#event-http2serverstreamclose)

- `stream` [`<ServerHttp2Stream>`](http2.html#class-serverhttp2stream)

Emitted when a stream is closed on the server. The HTTP/2 error code used when
closing the stream can be retrieved using the `stream.rstCode` property.

##### Modules[#](#modules)

Stability: 1 - Experimental

###### Event: `'tracing:module.require:start'`[#](#event-tracingmodulerequirestart)

- `event` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) containing the following properties
  - `id` Argument passed to `require()`. Module name.
  - `parentFilename` Name of the module that attempted to require(id).

Emitted when `require()` is executed. See [`start` event](#startevent).

###### Event: `'tracing:module.require:end'`[#](#event-tracingmodulerequireend)

- `event` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) containing the following properties
  - `id` Argument passed to `require()`. Module name.
  - `parentFilename` Name of the module that attempted to require(id).

Emitted when a `require()` call returns. See [`end` event](#endevent).

###### Event: `'tracing:module.require:error'`[#](#event-tracingmodulerequireerror)

- `event` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) containing the following properties
  - `id` Argument passed to `require()`. Module name.
  - `parentFilename` Name of the module that attempted to require(id).
- `error` [`<Error>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitted when a `require()` throws an error. See [`error` event](#errorevent).

###### Event: `'tracing:module.import:asyncStart'`[#](#event-tracingmoduleimportasyncstart)

- `event` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) containing the following properties
  - `id` Argument passed to `import()`. Module name.
  - `parentURL` URL object of the module that attempted to import(id).

Emitted when `import()` is invoked. See [`asyncStart` event](#asyncstartevent).

###### Event: `'tracing:module.import:asyncEnd'`[#](#event-tracingmoduleimportasyncend)

- `event` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) containing the following properties
  - `id` Argument passed to `import()`. Module name.
  - `parentURL` URL object of the module that attempted to import(id).

Emitted when `import()` has completed. See [`asyncEnd` event](#asyncendevent).

###### Event: `'tracing:module.import:error'`[#](#event-tracingmoduleimporterror)

- `event` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) containing the following properties
  - `id` Argument passed to `import()`. Module name.
  - `parentURL` URL object of the module that attempted to import(id).
- `error` [`<Error>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitted when a `import()` throws an error. See [`error` event](#errorevent).

##### NET[#](#net)

Stability: 1 - Experimental

###### Event: `'net.client.socket'`[#](#event-netclientsocket)

- `socket` [`<net.Socket>`](net.html#class-netsocket) | [`<tls.TLSSocket>`](tls.html#tlstlssocket)

Emitted when a new TCP or pipe client socket connection is created.

###### Event: `'net.server.socket'`[#](#event-netserversocket)

- `socket` [`<net.Socket>`](net.html#class-netsocket)

Emitted when a new TCP or pipe connection is received.

###### Event: `'tracing:net.server.listen:asyncStart'`[#](#event-tracingnetserverlistenasyncstart)

- `server` [`<net.Server>`](net.html#class-netserver)
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

Emitted when [`net.Server.listen()`](net.html#serverlisten) is invoked, before the port or pipe is actually setup.

###### Event: `'tracing:net.server.listen:asyncEnd'`[#](#event-tracingnetserverlistenasyncend)

- `server` [`<net.Server>`](net.html#class-netserver)

Emitted when [`net.Server.listen()`](net.html#serverlisten) has completed and thus the server is ready to accept connection.

###### Event: `'tracing:net.server.listen:error'`[#](#event-tracingnetserverlistenerror)

- `server` [`<net.Server>`](net.html#class-netserver)
- `error` [`<Error>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitted when [`net.Server.listen()`](net.html#serverlisten) is returning an error.

##### UDP[#](#udp)

Stability: 1 - Experimental

###### Event: `'udp.socket'`[#](#event-udpsocket)

- `socket` [`<dgram.Socket>`](dgram.html#class-dgramsocket)

Emitted when a new UDP socket is created.

##### Process[#](#process)

Added in: v16.18.0

Stability: 1 - Experimental

###### Event: `'child_process'`[#](#event-child_process)

- `process` [`<ChildProcess>`](child_process.html#class-childprocess)

Emitted when a new process is created.

`tracing:child_process.spawn:start`

- `process` [`<ChildProcess>`](child_process.html#class-childprocess)
- `options` [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

Emitted when [`child_process.spawn()`](child_process.html#child_processspawncommand-args-options) is invoked, before the process is
actually spawned.

`tracing:child_process.spawn:end`

- `process` [`<ChildProcess>`](child_process.html#class-childprocess)

Emitted when [`child_process.spawn()`](child_process.html#child_processspawncommand-args-options) has completed successfully and the
process has been created.

`tracing:child_process.spawn:error`

- `process` [`<ChildProcess>`](child_process.html#class-childprocess)
- `error` [`<Error>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitted when [`child_process.spawn()`](child_process.html#child_processspawncommand-args-options) encounters an error.

###### Event: `'process.execve'`[#](#event-processexecve)

- `execPath` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)
- `args` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[]
- `env` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[]

Emitted when [`process.execve()`](process.html#processexecvefile-args-env) is invoked.

##### Web Locks[#](#web-locks)

Added in: v25.9.0

Stability: 1 - Experimental

These channels are emitted for each [`locks.request()`](worker_threads.html#locksrequestname-options-callback) call. See
[`worker_threads.locks`](worker_threads.html#worker_threadslocks) for details on Web Locks.

###### Event: `'locks.request.start'`[#](#event-locksrequeststart)

- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The name of the requested lock resource.
- `mode` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The lock mode: `'exclusive'` or `'shared'`.

Emitted when a lock request is initiated, before the lock is granted.

###### Event: `'locks.request.grant'`[#](#event-locksrequestgrant)

- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The name of the requested lock resource.
- `mode` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The lock mode: `'exclusive'` or `'shared'`.

Emitted when a lock is successfully granted and the callback is about to run.

###### Event: `'locks.request.miss'`[#](#event-locksrequestmiss)

- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The name of the requested lock resource.
- `mode` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The lock mode: `'exclusive'` or `'shared'`.

Emitted when `ifAvailable` is `true` and the lock is not immediately available,
and the request callback is invoked with `null` instead of a `Lock` object.

###### Event: `'locks.request.end'`[#](#event-locksrequestend)

- `name` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The name of the requested lock resource.
- `mode` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) The lock mode: `'exclusive'` or `'shared'`.
- `steal` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Whether the request uses steal semantics.
- `ifAvailable` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Whether the request uses ifAvailable semantics.
- `error` [`<Error>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error) | [`<undefined>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#undefined_type) The error thrown by the callback, if any.

Emitted when a lock request has finished, whether the callback succeeded,
threw an error, or the lock was stolen.

##### Worker Thread[#](#worker-thread)

Added in: v16.18.0

Stability: 1 - Experimental

###### Event: `'worker_threads'`[#](#event-worker_threads)

- `worker` [`<Worker>`](worker_threads.html#class-worker)

Emitted when a new thread is created.
