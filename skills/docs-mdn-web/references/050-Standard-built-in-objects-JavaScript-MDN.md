# Standard built-in objects - JavaScript | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects

## [Standard objects by category](#standard_objects_by_category)

### [Value properties](#value_properties)

These global properties return a simple value. They have no properties or methods.

- [`globalThis`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis)
- [`Infinity`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity)
- [`NaN`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)
- [`undefined`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)

### [Function properties](#function_properties)

These global functions—functions which are called globally, rather than on an object—directly return their results to the caller.

- [`eval()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)
- [`isFinite()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
- [`isNaN()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN)
- [`parseFloat()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)
- [`parseInt()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)
- [`decodeURI()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI)
- [`decodeURIComponent()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
- [`encodeURI()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)
- [`encodeURIComponent()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
- [`escape()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape)
- [`unescape()`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/unescape)

### [Fundamental objects](#fundamental_objects)

These objects represent fundamental language constructs.

- [`Object`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [`Function`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- [`Boolean`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
- [`Symbol`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

### [Error objects](#error_objects)

Error objects are a special type of fundamental object. They include the basic [`Error`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) type, as well as several specialized error types.

- [`Error`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [`AggregateError`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
- [`EvalError`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError)
- [`RangeError`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
- [`ReferenceError`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)
- [`SuppressedError`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/SuppressedError)
- [`SyntaxError`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError)
- [`TypeError`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
- [`URIError`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError)
- [`InternalError`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/InternalError)

### [Numbers and dates](#numbers_and_dates)

These are the base objects representing numbers, dates, and mathematical calculations.

- [`Number`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
- [`BigInt`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- [`Math`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)
- [`Date`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [`Temporal`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)

### [Text processing](#text_processing)

These objects represent strings and support manipulating them.

- [`String`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [`RegExp`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

### [Indexed collections](#indexed_collections)

These objects represent collections of data which are ordered by an index value. This includes (typed) arrays and array-like constructs.

- [`Array`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [`TypedArray`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- [`Int8Array`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array)
- [`Uint8Array`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- [`Uint8ClampedArray`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray)
- [`Int16Array`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)
- [`Uint16Array`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array)
- [`Int32Array`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array)
- [`Uint32Array`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)
- [`BigInt64Array`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt64Array)
- [`BigUint64Array`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigUint64Array)
- [`Float16Array`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float16Array)
- [`Float32Array`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array)
- [`Float64Array`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array)

### [Keyed collections](#keyed_collections)

These objects represent collections which use keys. The iterable collections ([`Map`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [`Set`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)) contain elements which are easily iterated in the order of insertion.

- [`Map`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [`Set`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [`WeakMap`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [`WeakSet`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)

### [Structured data](#structured_data)

These objects represent and interact with structured data buffers and data coded using JavaScript Object Notation (JSON).

- [`ArrayBuffer`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- [`SharedArrayBuffer`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
- [`DataView`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- [`Atomics`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics)
- [`JSON`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)

### [Managing memory](#managing_memory)

These objects interact with the garbage collection mechanism.

- [`WeakRef`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef)
- [`FinalizationRegistry`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry)

### [Control abstraction objects](#control_abstraction_objects)

Control abstractions can help to structure code, especially async code (without using deeply nested callbacks, for example).

- [`Iterator`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator)
- [`AsyncIterator`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator)
- [`Promise`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`GeneratorFunction`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/GeneratorFunction)
- [`AsyncGeneratorFunction`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncGeneratorFunction)
- [`Generator`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)
- [`AsyncGenerator`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncGenerator)
- [`AsyncFunction`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction)
- [`DisposableStack`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/DisposableStack)
- [`AsyncDisposableStack`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncDisposableStack)

### [Reflection](#reflection)

- [`Reflect`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
- [`Proxy`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

### [Internationalization](#internationalization)

Additions to the ECMAScript core for language-sensitive functionalities.

- [`Intl`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [`Intl.Collator`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)
- [`Intl.DateTimeFormat`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
- [`Intl.DisplayNames`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames)
- [`Intl.DurationFormat`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat)
- [`Intl.ListFormat`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat)
- [`Intl.Locale`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
- [`Intl.NumberFormat`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [`Intl.PluralRules`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)
- [`Intl.RelativeTimeFormat`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat)
- [`Intl.Segmenter`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
