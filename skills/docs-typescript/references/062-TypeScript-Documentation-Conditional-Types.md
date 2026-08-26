# TypeScript: Documentation - Conditional Types

Source: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html

Was this page helpful?

# Conditional Types

At the heart of most useful programs, we have to make decisions based on input.
JavaScript programs are no different, but given the fact that values can be easily introspected, those decisions are also based on the types of the inputs.
*Conditional types* help describe the relation between the types of inputs and outputs.

```
ts

interface Animal {

live(): void;

}

interface Dog extends Animal {

woof(): void;

}

type Example1 = Dog extends Animal ? number : string;

type Example1 = number

type Example2 = RegExp extends Animal ? number : string;

type Example2 = string

Try
```

Conditional types take a form that looks a little like conditional expressions (`condition ? trueExpression : falseExpression`) in JavaScript:

```
ts

SomeType extends OtherType ? TrueType : FalseType;

Try
```

When the type on the left of the `extends` is assignable to the one on the right, then you’ll get the type in the first branch (the “true” branch); otherwise you’ll get the type in the latter branch (the “false” branch).

From the examples above, conditional types might not immediately seem useful - we can tell ourselves whether or not `Dog extends Animal` and pick `number` or `string`!
But the power of conditional types comes from using them with generics.

For example, let’s take the following `createLabel` function:

```
ts

interface IdLabel {

id: number /* some fields */;

}

interface NameLabel {

name: string /* other fields */;

}

function createLabel(id: number): IdLabel;

function createLabel(name: string): NameLabel;

function createLabel(nameOrId: string | number): IdLabel | NameLabel;

function createLabel(nameOrId: string | number): IdLabel | NameLabel {

throw "unimplemented";

}

Try
```

These overloads for createLabel describe a single JavaScript function that makes a choice based on the types of its inputs. Note a few things:

1. If a library has to make the same sort of choice over and over throughout its API, this becomes cumbersome.
2. We have to create three overloads: one for each case when we’re *sure* of the type (one for `string` and one for `number`), and one for the most general case (taking a `string | number`). For every new type `createLabel` can handle, the number of overloads grows exponentially.

Instead, we can encode that logic in a conditional type:

```
ts

type NameOrId<T extends number | string> = T extends number

? IdLabel

: NameLabel;

Try
```

We can then use that conditional type to simplify our overloads down to a single function with no overloads.

```
ts

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {

throw "unimplemented";

}

let a = createLabel("typescript");

let a: NameLabel

let b = createLabel(2.8);

let b: IdLabel

let c = createLabel(Math.random() ? "hello" : 42);

let c: NameLabel | IdLabel

Try
```

### Conditional Type Constraints

Often, the checks in a conditional type will provide us with some new information.
Just like narrowing with type guards can give us a more specific type, the true branch of a conditional type will further constrain generics by the type we check against.

For example, let’s take the following:

```
ts

type MessageOf<T> = T["message"];

Type '"message"' cannot be used to index type 'T'.2536Type '"message"' cannot be used to index type 'T'.Try
```

In this example, TypeScript errors because `T` isn’t known to have a property called `message`.
We could constrain `T`, and TypeScript would no longer complain:

```
ts

type MessageOf<T extends { message: unknown }> = T["message"];

interface Email {

message: string;

}

type EmailMessageContents = MessageOf<Email>;

type EmailMessageContents = string

Try
```

However, what if we wanted `MessageOf` to take any type, and default to something like `never` if a `message` property isn’t available?
We can do this by moving the constraint out and introducing a conditional type:

```
ts

type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {

message: string;

}

interface Dog {

bark(): void;

}

type EmailMessageContents = MessageOf<Email>;

type EmailMessageContents = string

type DogMessageContents = MessageOf<Dog>;

type DogMessageContents = never

Try
```

Within the true branch, TypeScript knows that `T` *will* have a `message` property.

As another example, we could also write a type called `Flatten` that flattens array types to their element types, but leaves them alone otherwise:

```
ts

type Flatten<T> = T extends any[] ? T[number] : T;

// Extracts out the element type.

type Str = Flatten<string[]>;

type Str = string

// Leaves the type alone.

type Num = Flatten<number>;

type Num = number

Try
```

When `Flatten` is given an array type, it uses an indexed access with `number` to fetch out `string[]`’s element type.
Otherwise, it just returns the type it was given.

### Inferring Within Conditional Types

We just found ourselves using conditional types to apply constraints and then extract out types.
This ends up being such a common operation that conditional types make it easier.

Conditional types provide us with a way to infer from types we compare against in the true branch using the `infer` keyword.
For example, we could have inferred the element type in `Flatten` instead of fetching it out “manually” with an indexed access type:

```
ts

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

Try
```

Here, we used the `infer` keyword to declaratively introduce a new generic type variable named `Item` instead of specifying how to retrieve the element type of `Type` within the true branch.
This frees us from having to think about how to dig through and probing apart the structure of the types we’re interested in.

We can write some useful helper type aliases using the `infer` keyword.
For example, for simple cases, we can extract the return type out from function types:

```
ts

type GetReturnType<Type> = Type extends (...args: never[]) => infer Return

? Return

: never;

type Num = GetReturnType<() => number>;

type Num = number

type Str = GetReturnType<(x: string) => string>;

type Str = string

type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;

type Bools = boolean[]

Try
```

When inferring from a type with multiple call signatures (such as the type of an overloaded function), inferences are made from the *last* signature (which, presumably, is the most permissive catch-all case). It is not possible to perform overload resolution based on a list of argument types.

```
ts

declare function stringOrNum(x: string): number;

declare function stringOrNum(x: number): string;

declare function stringOrNum(x: string | number): string | number;

type T1 = ReturnType<typeof stringOrNum>;

type T1 = string | number

Try
```

## Distributive Conditional Types

When conditional types act on a generic type, they become *distributive* when given a union type.
For example, take the following:

```
ts

type ToArray<Type> = Type extends any ? Type[] : never;

Try
```

If we plug a union type into `ToArray`, then the conditional type will be applied to each member of that union.

```
ts

type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;

type StrArrOrNumArr = string[] | number[]

Try
```

What happens here is that `ToArray` distributes on:

```
ts

string | number;

Try
```

and maps over each member type of the union, to what is effectively:

```
ts

ToArray<string> | ToArray<number>;

Try
```

which leaves us with:

```
ts

string[] | number[];

Try
```

Typically, distributivity is the desired behavior.
To avoid that behavior, you can surround each side of the `extends` keyword with square brackets.

```
ts

type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'ArrOfStrOrNum' is no longer a union.

type ArrOfStrOrNum = ToArrayNonDist<string | number>;

type ArrOfStrOrNum = (string | number)[]

Try
```

[### Indexed Access Types

Using Type['a'] syntax to access a subset of a type.](/docs/handbook/2/indexed-access-types.html)[### Mapped Types

Generating types by re-using an existing type.](/docs/handbook/2/mapped-types.html)

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/handbook-v2/Type Manipulation/Conditional Types.md) ❤

Contributors to this page:

OT![Orta Therox  (10)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

BK![Benedikt König  (1)](https://gravatar.com/avatar/617858d12f0f8fff5df2ac0b8b72da2a9314a651e3eaba381217274133e0ce37?s=32&&d=blank)

GF![George Flinn  (1)](https://gravatar.com/avatar/8c0a84b063728dfaae111d46396b88817bd339a3b67784e446f0b9839d312713?s=32&&d=blank)

SF![Shinya Fujino  (1)](https://gravatar.com/avatar/1820714c7b464d87937b6d63073002cffe11cbdf39df45400a9e49650603b48b?s=32&&d=blank)

NM![Nicolás Montone  (1)](https://gravatar.com/avatar/8aab40d5666d4171c6fc9d263a34152116c817c6ddd0c8c51b9c59ebb28ff5a0?s=32&&d=blank)

9+

Last updated: Jul 27, 2026
