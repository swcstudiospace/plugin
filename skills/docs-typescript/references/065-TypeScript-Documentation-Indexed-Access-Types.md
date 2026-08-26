# TypeScript: Documentation - Indexed Access Types

Source: https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html

Was this page helpful?

# Indexed Access Types

We can use an *indexed access type* to look up a specific property on another type:

```
ts

type Person = { age: number; name: string; alive: boolean };

type Age = Person["age"];

type Age = number

Try
```

The indexing type is itself a type, so we can use unions, `keyof`, or other types entirely:

```
ts

type I1 = Person["age" | "name"];

type I1 = string | number

type I2 = Person[keyof Person];

type I2 = string | number | boolean

type AliveOrName = "alive" | "name";

type I3 = Person[AliveOrName];

type I3 = string | boolean

Try
```

You’ll even see an error if you try to index a property that doesn’t exist:

```
ts

type I1 = Person["alve"];

Property 'alve' does not exist on type 'Person'.2339Property 'alve' does not exist on type 'Person'.Try
```

Another example of indexing with an arbitrary type is using `number` to get the type of an array’s elements.
We can combine this with `typeof` to conveniently capture the element type of an array literal:

```
ts

const MyArray = [

{ name: "Alice", age: 15 },

{ name: "Bob", age: 23 },

{ name: "Eve", age: 38 },

];

type Person = typeof MyArray[number];

type Person = {
    name: string;
    age: number;
}

type Age = typeof MyArray[number]["age"];

type Age = number

// Or

type Age2 = Person["age"];

type Age2 = number

Try
```

You can only use types when indexing, meaning you can’t use a `const` to make a variable reference:

```
ts

const key = "age";

type Age = Person[key];

Type 'key' cannot be used as an index type.'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?2538
2749Type 'key' cannot be used as an index type.'key' refers to a value, but is being used as a type here. Did you mean 'typeof key'?Try
```

However, you can use a type alias for a similar style of refactor:

```
ts

type key = "age";

type Age = Person[key];

Try
```

[### Typeof Type Operator

Using the typeof operator in type contexts.](/docs/handbook/2/typeof-types.html)[### Conditional Types

Create types which act like if statements in the type system.](/docs/handbook/2/conditional-types.html)

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/handbook-v2/Type Manipulation/Indexed Access Types.md) ❤

Contributors to this page:

OT![Orta Therox  (5)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

Last updated: Jul 27, 2026
