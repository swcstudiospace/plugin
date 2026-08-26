# TypeScript: Documentation - Iterators and Generators

Source: https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html

Was this page helpful?

# Iterators and Generators

## Iterables

An object is deemed iterable if it has an implementation for the [`Symbol.iterator`](symbols.html#symboliterator) property.
Some built-in types like `Array`, `Map`, `Set`, `String`, `Int32Array`, `Uint32Array`, etc. have their `Symbol.iterator` property already implemented.
`Symbol.iterator` function on an object is responsible for returning the list of values to iterate on.

### `Iterable` interface

`Iterable` is a type we can use if we want to take in types listed above which are iterable. Here is an example:

```
ts

function toArray<X>(xs: Iterable<X>): X[] {

return [...xs]

}
```

### `for..of` statements

`for..of` loops over an iterable object, invoking the `Symbol.iterator` property on the object.
Here is a simple `for..of` loop on an array:

```
ts

let someArray = [1, "string", false];

for (let entry of someArray) {

console.log(entry); // 1, "string", false

}
```

### `for..of` vs. `for..in` statements

Both `for..of` and `for..in` statements iterate over lists; the values iterated on are different though, `for..in` returns a list of *keys* on the object being iterated, whereas `for..of` returns a list of *values* of the numeric properties of the object being iterated.

Here is an example that demonstrates this distinction:

```
ts

let list = [4, 5, 6];

for (let i in list) {

console.log(i); // "0", "1", "2",

}

for (let i of list) {

console.log(i); // 4, 5, 6

}
```

Another distinction is that `for..in` operates on any object; it serves as a way to inspect properties on this object.
`for..of` on the other hand, is mainly interested in values of iterable objects. Built-in objects like `Map` and `Set` implement `Symbol.iterator` property allowing access to stored values.

```
ts

let pets = new Set(["Cat", "Dog", "Hamster"]);

pets["species"] = "mammals";

for (let pet in pets) {

console.log(pet); // "species"

}

for (let pet of pets) {

console.log(pet); // "Cat", "Dog", "Hamster"

}
```

### Code generation

#### Targeting ES5

When targeting an ES5-compliant engine, iterators are only allowed on values of `Array` type.
It is an error to use `for..of` loops on non-Array values, even if these non-Array values implement the `Symbol.iterator` property.

The compiler will generate a simple `for` loop for a `for..of` loop, for instance:

```
ts

let numbers = [1, 2, 3];

for (let num of numbers) {

console.log(num);

}
```

will be generated as:

```
js

var numbers = [1, 2, 3];

for (var _i = 0; _i < numbers.length; _i++) {

var num = numbers[_i];

console.log(num);

}
```

#### Targeting ECMAScript 2015 and higher

When targeting an ECMAScript 2015-compliant engine, the compiler will generate `for..of` loops to target the built-in iterator implementation in the engine.

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/reference/Iterators and Generators.md) ❤

Contributors to this page:

MH![Mohamed Hegazy  (57)](https://gravatar.com/avatar/17e2da9785d45119a4c4cfed99e40d9c?s=32&&d=blank)

OT![Orta Therox  (15)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

GB![Gabriel Burdeti  (3)](https://gravatar.com/avatar/28ff7ada33ca80bfae575ae1321176ca?s=32&&d=blank)

JB![Jake Bailey  (1)](https://gravatar.com/avatar/127e9f47eb2768eae31eb5809ae4f1ca44336bc51e45473c68ebb9648608f590?s=32&&d=blank)

NS![Nick Schonning  (1)](https://gravatar.com/avatar/a490b76edb21047df004539971c9258a6c3bd8da6bc3ca94c89da3e6398ef08e?s=32&&d=blank)

12+

Last updated: Jul 27, 2026
