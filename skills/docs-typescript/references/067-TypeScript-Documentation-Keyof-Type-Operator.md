# TypeScript: Documentation - Keyof Type Operator

Source: https://www.typescriptlang.org/docs/handbook/2/keyof-types.html

Was this page helpful?

# Keyof Type Operator

## The `keyof` type operator

The `keyof` operator takes an object type and produces a string or numeric literal union of its keys.
The following type `P` is the same type as `type P = "x" | "y"`:

```
ts

type Point = { x: number; y: number };

type P = keyof Point;

type P = keyof Point

Try
```

If the type has a `string` or `number` index signature, `keyof` will return those types instead:

```
ts

type Arrayish = { [n: number]: unknown };

type A = keyof Arrayish;

type A = number

type Mapish = { [k: string]: boolean };

type M = keyof Mapish;

type M = string | number

Try
```

Note that in this example, `M` is `string | number` — this is because JavaScript object keys are always coerced to a string, so `obj[0]` is always the same as `obj["0"]`.

`keyof` types become especially useful when combined with mapped types, which we’ll learn more about later.

[### Generics

Types which take parameters](/docs/handbook/2/generics.html)[### Typeof Type Operator

Using the typeof operator in type contexts.](/docs/handbook/2/typeof-types.html)

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/handbook-v2/Type Manipulation/Keyof Type Operator.md) ❤

Contributors to this page:

OT![Orta Therox  (3)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

RM![Roman Mahotskyi  (1)](https://gravatar.com/avatar/9fc6be1e7979f236d91d5cab8bc8b9e1f368d3e1883ce814b9c26c6c0f467230?s=32&&d=blank)

MM![Masashi Miyazaki  (1)](https://gravatar.com/avatar/a8e503d907b24698d2730471024b9d63d1c0fcd9761020957a45ccc8dee60d60?s=32&&d=blank)

S![suica  (1)](https://gravatar.com/avatar/9586efba9706e1ac318402527b273c2e9206a8ac8ffbb789c8f70b451c33c974?s=32&&d=blank)

Last updated: Jul 27, 2026
