# TypeScript: Documentation - Symbols

Source: https://www.typescriptlang.org/docs/handbook/symbols.html

Was this page helpful?

# Symbols

Starting with ECMAScript 2015, `symbol` is a primitive data type, just like `number` and `string`.

`symbol` values are created by calling the `Symbol` constructor.

```
ts

let sym1 = Symbol();

let sym2 = Symbol("key"); // optional string key
```

Symbols are immutable, and unique.

```
ts

let sym2 = Symbol("key");

let sym3 = Symbol("key");

sym2 === sym3; // false, symbols are unique
```

Just like strings, symbols can be used as keys for object properties.

```
ts

const sym = Symbol();

let obj = {

[sym]: "value",

};

console.log(obj[sym]); // "value"
```

Symbols can also be combined with computed property declarations to declare object properties and class members.

```
ts

const getClassNameSymbol = Symbol();

class C {

[getClassNameSymbol]() {

return "C";

}

}

let c = new C();

let className = c[getClassNameSymbol](); // "C"
```

## `unique symbol`

To enable treating symbols as unique literals a special type `unique symbol` is available. `unique symbol` is a subtype of `symbol`, and are produced only from calling `Symbol()` or `Symbol.for()`, or from explicit type annotations. This type is only allowed on `const` declarations and `readonly static` properties, and in order to reference a specific unique symbol, you’ll have to use the `typeof` operator. Each reference to a unique symbol implies a completely unique identity that’s tied to a given declaration.

```
ts

declare const sym1: unique symbol;

// sym2 can only be a constant reference.

let sym2: unique symbol = Symbol();

A variable whose type is a 'unique symbol' type must be 'const'.1332A variable whose type is a 'unique symbol' type must be 'const'.

// Works - refers to a unique symbol, but its identity is tied to 'sym1'.

let sym3: typeof sym1 = sym1;

// Also works.

class C {

static readonly StaticSymbol: unique symbol = Symbol();

}

Try
```

Because each `unique symbol` has a completely separate identity, no two `unique symbol` types are assignable or comparable to each other.

```
ts

const sym2 = Symbol();

const sym3 = Symbol();

if (sym2 === sym3) {

This comparison appears to be unintentional because the types 'typeof sym2' and 'typeof sym3' have no overlap.2367This comparison appears to be unintentional because the types 'typeof sym2' and 'typeof sym3' have no overlap.

// ...

}

Try
```

## Well-known Symbols

In addition to user-defined symbols, there are well-known built-in symbols.
Built-in symbols are used to represent internal language behaviors.

Here is a list of well-known symbols:

### `Symbol.asyncIterator`

A method that returns async iterator for an object, compatible to be used with for await..of loop.

### `Symbol.hasInstance`

A method that determines if a constructor object recognizes an object as one of the constructor’s instances. Called by the semantics of the instanceof operator.

### `Symbol.isConcatSpreadable`

A Boolean value indicating that an object should be flattened to its array elements by Array.prototype.concat.

### `Symbol.iterator`

A method that returns the default iterator for an object. Called by the semantics of the for-of statement.

### `Symbol.match`

A regular expression method that matches the regular expression against a string. Called by the `String.prototype.match` method.

### `Symbol.replace`

A regular expression method that replaces matched substrings of a string. Called by the `String.prototype.replace` method.

### `Symbol.search`

A regular expression method that returns the index within a string that matches the regular expression. Called by the `String.prototype.search` method.

### `Symbol.species`

A function valued property that is the constructor function that is used to create derived objects.

### `Symbol.split`

A regular expression method that splits a string at the indices that match the regular expression.
Called by the `String.prototype.split` method.

### `Symbol.toPrimitive`

A method that converts an object to a corresponding primitive value.
Called by the `ToPrimitive` abstract operation.

### `Symbol.toStringTag`

A String value that is used in the creation of the default string description of an object.
Called by the built-in method `Object.prototype.toString`.

### `Symbol.unscopables`

An Object whose own property names are property names that are excluded from the ‘with’ environment bindings of the associated objects.

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/reference/Symbols.md) ❤

Contributors to this page:

MH![Mohamed Hegazy  (52)](https://gravatar.com/avatar/17e2da9785d45119a4c4cfed99e40d9c?s=32&&d=blank)

OT![Orta Therox  (15)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

GB![Gabriel Burdeti  (2)](https://gravatar.com/avatar/28ff7ada33ca80bfae575ae1321176ca?s=32&&d=blank)

MF![Martin Fischer  (1)](https://gravatar.com/avatar/dc885100e48a5949f1a44bcd6fce398735ff3294f20607ddee8bb45acb29601a?s=32&&d=blank)

MN![Michał Niedziółka  (1)](https://gravatar.com/avatar/a81dcd12df064679e9cac9bea9ec537be93967fb2f04b256aef9f338e97c3183?s=32&&d=blank)

9+

Last updated: Jul 27, 2026
