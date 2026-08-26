# TypeScript: Documentation - Typeof Type Operator

Source: https://www.typescriptlang.org/docs/handbook/2/typeof-types.html

Was this page helpful?

# Typeof Type Operator

## The `typeof` type operator

JavaScript already has a `typeof` operator you can use in an *expression* context:

```
ts

// Prints "string"

console.log(typeof "Hello world");

Try
```

TypeScript adds a `typeof` operator you can use in a *type* context to refer to the *type* of a variable or property:

```
ts

let s = "hello";

let n: typeof s;

let n: string

Try
```

This isn’t very useful for basic types, but combined with other type operators, you can use `typeof` to conveniently express many patterns.
For an example, let’s start by looking at the predefined type `ReturnType<T>`.
It takes a *function type* and produces its return type:

```
ts

type Predicate = (x: unknown) => boolean;

type K = ReturnType<Predicate>;

type K = boolean

Try
```

If we try to use `ReturnType` on a function name, we see an instructive error:

```
ts

function f() {

return { x: 10, y: 3 };

}

type P = ReturnType<f>;

'f' refers to a value, but is being used as a type here. Did you mean 'typeof f'?2749'f' refers to a value, but is being used as a type here. Did you mean 'typeof f'?Try
```

Remember that *values* and *types* aren’t the same thing.
To refer to the *type* that the *value `f`* has, we use `typeof`:

```
ts

function f() {

return { x: 10, y: 3 };

}

type P = ReturnType<typeof f>;

type P = {
    x: number;
    y: number;
}

Try
```

### Limitations

TypeScript intentionally limits the sorts of expressions you can use `typeof` on.

Specifically, it’s only legal to use `typeof` on identifiers (i.e. variable names) or their properties.
This helps avoid the confusing trap of writing code you think is executing, but isn’t:

```
ts

// Meant to use = ReturnType<typeof msgbox>

let shouldContinue: typeof msgbox("Are you sure you want to continue?");

',' expected.1005',' expected.Try
```

[### Keyof Type Operator

Using the keyof operator in type contexts.](/docs/handbook/2/keyof-types.html)[### Indexed Access Types

Using Type['a'] syntax to access a subset of a type.](/docs/handbook/2/indexed-access-types.html)

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/handbook-v2/Type Manipulation/Typeof Type Operator.md) ❤

Contributors to this page:

OT![Orta Therox  (4)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

JL![Jimmy Liao  (1)](https://gravatar.com/avatar/8c59c4db936a9403aa7d7db331c932f0de8a81c84e215a502dfac1288d37b2ea?s=32&&d=blank)

Last updated: Jul 27, 2026
