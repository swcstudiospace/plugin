# TypeScript: Documentation - Utility Types

Source: https://www.typescriptlang.org/docs/handbook/utility-types.html

Was this page helpful?

# Utility Types

TypeScript provides several utility types to facilitate common type transformations. These utilities are available globally.

## `Awaited<Type>`

> Released:
> [4.5](/docs/handbook/release-notes/typescript-4-5.html#the-awaited-type-and-promise-improvements)

This type is meant to model operations like `await` in `async` functions, or the
`.then()` method on `Promise`s - specifically, the way that they recursively
unwrap `Promise`s.

##### Example

```
ts

type A = Awaited<Promise<string>>;

type A = string

type B = Awaited<Promise<Promise<number>>>;

type B = number

type C = Awaited<boolean | Promise<number>>;

type C = number | boolean

Try
```

## `Partial<Type>`

> Released:
> [2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

Constructs a type with all properties of `Type` set to optional. This utility will return a type that represents all subsets of a given type.

##### Example

```
ts

interface Todo {

title: string;

description: string;

}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {

return { ...todo, ...fieldsToUpdate };

}

const todo1 = {

title: "organize desk",

description: "clear clutter",

};

const todo2 = updateTodo(todo1, {

description: "throw out trash",

});

Try
```

## `Required<Type>`

> Released:
> [2.8](/docs/handbook/release-notes/typescript-2-8.html#improved-control-over-mapped-type-modifiers)

Constructs a type consisting of all properties of `Type` set to required. The opposite of [`Partial`](#partialtype).

##### Example

```
ts

interface Props {

a?: number;

b?: string;

}

const obj: Props = { a: 5 };

const obj2: Required<Props> = { a: 5 };

Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.2741Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.Try
```

## `Readonly<Type>`

> Released:
> [2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

Constructs a type with all properties of `Type` set to `readonly`, meaning the properties of the constructed type cannot be reassigned.

##### Example

```
ts

interface Todo {

title: string;

}

const todo: Readonly<Todo> = {

title: "Delete inactive users",

};

todo.title = "Hello";

Cannot assign to 'title' because it is a read-only property.2540Cannot assign to 'title' because it is a read-only property.Try
```

This utility is useful for representing assignment expressions that will fail at runtime (i.e. when attempting to reassign properties of a [frozen object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)).

##### `Object.freeze`

```
ts

function freeze<Type>(obj: Type): Readonly<Type>;
```

## `Record<Keys, Type>`

> Released:
> [2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

Constructs an object type whose property keys are `Keys` and whose property values are `Type`. This utility can be used to map the properties of a type to another type.

##### Example

```
ts

type CatName = "miffy" | "boris" | "mordred";

interface CatInfo {

age: number;

breed: string;

}

const cats: Record<CatName, CatInfo> = {

miffy: { age: 10, breed: "Persian" },

boris: { age: 5, breed: "Maine Coon" },

mordred: { age: 16, breed: "British Shorthair" },

};

cats.boris;

const cats: Record<CatName, CatInfo>

Try
```

## `Pick<Type, Keys>`

> Released:
> [2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

Constructs a type by picking the set of properties `Keys` (string literal or union of string literals) from `Type`.

##### Example

```
ts

interface Todo {

title: string;

description: string;

completed: boolean;

}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {

title: "Clean room",

completed: false,

};

todo;

const todo: TodoPreview

Try
```

## `Omit<Type, Keys>`

> Released:
> [3.5](/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type)

Constructs a type by picking all properties from `Type` and then removing `Keys` (string literal or union of string literals). The opposite of [`Pick`](#picktype-keys).

##### Example

```
ts

interface Todo {

title: string;

description: string;

completed: boolean;

createdAt: number;

}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {

title: "Clean room",

completed: false,

createdAt: 1615544252770,

};

todo;

const todo: TodoPreview

type TodoInfo = Omit<Todo, "completed" | "createdAt">;

const todoInfo: TodoInfo = {

title: "Pick up kids",

description: "Kindergarten closes at 5pm",

};

todoInfo;

const todoInfo: TodoInfo

Try
```

## `Exclude<UnionType, ExcludedMembers>`

> Released:
> [2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

Constructs a type by excluding from `UnionType` all union members that are assignable to `ExcludedMembers`.

##### Example

```
ts

type T0 = Exclude<"a" | "b" | "c", "a">;

type T0 = "b" | "c"

type T1 = Exclude<"a" | "b" | "c", "a" | "b">;

type T1 = "c"

type T2 = Exclude<string | number | (() => void), Function>;

type T2 = string | number

type Shape =

| { kind: "circle"; radius: number }

| { kind: "square"; x: number }

| { kind: "triangle"; x: number; y: number };

type T3 = Exclude<Shape, { kind: "circle" }>

type T3 = {
    kind: "square";
    x: number;
} | {
    kind: "triangle";
    x: number;
    y: number;
}

Try
```

## `Extract<Type, Union>`

> Released:
> [2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

Constructs a type by extracting from `Type` all union members that are assignable to `Union`.

##### Example

```
ts

type T0 = Extract<"a" | "b" | "c", "a" | "f">;

type T0 = "a"

type T1 = Extract<string | number | (() => void), Function>;

type T1 = () => void

type Shape =

| { kind: "circle"; radius: number }

| { kind: "square"; x: number }

| { kind: "triangle"; x: number; y: number };

type T2 = Extract<Shape, { kind: "circle" }>

type T2 = {
    kind: "circle";
    radius: number;
}

Try
```

## `NonNullable<Type>`

> Released:
> [2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

Constructs a type by excluding `null` and `undefined` from `Type`.

##### Example

```
ts

type T0 = NonNullable<string | number | undefined>;

type T0 = string | number

type T1 = NonNullable<string[] | null | undefined>;

type T1 = string[]

Try
```

## `Parameters<Type>`

> Released:
> [3.1](https://github.com/microsoft/TypeScript/pull/26243)

Constructs a tuple type from the types used in the parameters of a function type `Type`.

For overloaded functions, this will be the parameters of the *last* signature; see [Inferring Within Conditional Types](/docs/handbook/2/conditional-types.html#inferring-within-conditional-types).

##### Example

```
ts

declare function f1(arg: { a: number; b: string }): void;

type T0 = Parameters<() => string>;

type T0 = []

type T1 = Parameters<(s: string) => void>;

type T1 = [s: string]

type T2 = Parameters<<T>(arg: T) => T>;

type T2 = [arg: unknown]

type T3 = Parameters<typeof f1>;

type T3 = [arg: {
    a: number;
    b: string;
}]

type T4 = Parameters<any>;

type T4 = unknown[]

type T5 = Parameters<never>;

type T5 = never

type T6 = Parameters<string>;

Type 'string' does not satisfy the constraint '(...args: any) => any'.2344Type 'string' does not satisfy the constraint '(...args: any) => any'.

type T6 = never

type T7 = Parameters<Function>;

Type 'Function' does not satisfy the constraint '(...args: any) => any'.
  Type 'Function' provides no match for the signature '(...args: any): any'.2344Type 'Function' does not satisfy the constraint '(...args: any) => any'.
  Type 'Function' provides no match for the signature '(...args: any): any'.

type T7 = never

Try
```

## `ConstructorParameters<Type>`

> Released:
> [3.1](https://github.com/microsoft/TypeScript/pull/26243)

Constructs a tuple or array type from the types of a constructor function type. It produces a tuple type with all the parameter types (or the type `never` if `Type` is not a function).

##### Example

```
ts

type T0 = ConstructorParameters<ErrorConstructor>;

type T0 = [message?: string]

type T1 = ConstructorParameters<FunctionConstructor>;

type T1 = string[]

type T2 = ConstructorParameters<RegExpConstructor>;

type T2 = [pattern: string | RegExp, flags?: string]

class C {

constructor(a: number, b: string) {}

}

type T3 = ConstructorParameters<typeof C>;

type T3 = [a: number, b: string]

type T4 = ConstructorParameters<any>;

type T4 = unknown[]

type T5 = ConstructorParameters<Function>;

Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
  Type 'Function' provides no match for the signature 'new (...args: any): any'.2344Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
  Type 'Function' provides no match for the signature 'new (...args: any): any'.

type T5 = never

Try
```

## `ReturnType<Type>`

> Released:
> [2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

Constructs a type consisting of the return type of function `Type`.

For overloaded functions, this will be the return type of the *last* signature; see [Inferring Within Conditional Types](/docs/handbook/2/conditional-types.html#inferring-within-conditional-types).

##### Example

```
ts

declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>;

type T0 = string

type T1 = ReturnType<(s: string) => void>;

type T1 = void

type T2 = ReturnType<<T>() => T>;

type T2 = unknown

type T3 = ReturnType<<T extends U, U extends number[]>() => T>;

type T3 = number[]

type T4 = ReturnType<typeof f1>;

type T4 = {
    a: number;
    b: string;
}

type T5 = ReturnType<any>;

type T5 = any

type T6 = ReturnType<never>;

type T6 = never

type T7 = ReturnType<string>;

Type 'string' does not satisfy the constraint '(...args: any) => any'.2344Type 'string' does not satisfy the constraint '(...args: any) => any'.

type T7 = any

type T8 = ReturnType<Function>;

Type 'Function' does not satisfy the constraint '(...args: any) => any'.
  Type 'Function' provides no match for the signature '(...args: any): any'.2344Type 'Function' does not satisfy the constraint '(...args: any) => any'.
  Type 'Function' provides no match for the signature '(...args: any): any'.

type T8 = any

Try
```

## `InstanceType<Type>`

> Released:
> [2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

Constructs a type consisting of the instance type of a constructor function in `Type`.

##### Example

```
ts

class C {

x = 0;

y = 0;

}

type T0 = InstanceType<typeof C>;

type T0 = C

type T1 = InstanceType<any>;

type T1 = any

type T2 = InstanceType<never>;

type T2 = never

type T3 = InstanceType<string>;

Type 'string' does not satisfy the constraint 'abstract new (...args: any) => any'.2344Type 'string' does not satisfy the constraint 'abstract new (...args: any) => any'.

type T3 = any

type T4 = InstanceType<Function>;

Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
  Type 'Function' provides no match for the signature 'new (...args: any): any'.2344Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
  Type 'Function' provides no match for the signature 'new (...args: any): any'.

type T4 = any

Try
```

## `NoInfer<Type>`

> Released:
> [5.4](/docs/handbook/release-notes/typescript-5-4.html#the-noinfer-utility-type)

Blocks inferences to the contained type. Other than blocking inferences, `NoInfer<Type>` is
identical to `Type`.

##### Example

```
ts

function createStreetLight<C extends string>(

colors: C[],

defaultColor?: NoInfer<C>,

) {

// ...

}

createStreetLight(["red", "yellow", "green"], "red");  // OK

createStreetLight(["red", "yellow", "green"], "blue");  // Error
```

## `ThisParameterType<Type>`

> Released:
> [3.3](https://github.com/microsoft/TypeScript/pull/28920)

Extracts the type of the [this](/docs/handbook/functions.html#this-parameters) parameter for a function type, or [unknown](/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) if the function type has no `this` parameter.

##### Example

```
ts

function toHex(this: Number) {

return this.toString(16);

}

function numberToString(n: ThisParameterType<typeof toHex>) {

return toHex.apply(n);

}

Try
```

## `OmitThisParameter<Type>`

> Released:
> [3.3](https://github.com/microsoft/TypeScript/pull/28920)

Removes the [`this`](/docs/handbook/functions.html#this-parameters) parameter from `Type`. If `Type` has no explicitly declared `this` parameter, the result is simply `Type`. Otherwise, a new function type with no `this` parameter is created from `Type`. Generics are erased and only the last overload signature is propagated into the new function type.

##### Example

```
ts

function toHex(this: Number) {

return this.toString(16);

}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);

console.log(fiveToHex());

Try
```

## `ThisType<Type>`

> Released:
> [2.3](https://github.com/microsoft/TypeScript/pull/14141)

This utility does not return a transformed type. Instead, it serves as a marker for a contextual [`this`](/docs/handbook/functions.html#this) type. Note that the [`noImplicitThis`](/tsconfig#noImplicitThis) flag must be enabled to use this utility.

##### Example

```
ts

type ObjectDescriptor<D, M> = {

data?: D;

methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M

};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {

let data: object = desc.data || {};

let methods: object = desc.methods || {};

return { ...data, ...methods } as D & M;

}

let obj = makeObject({

data: { x: 0, y: 0 },

methods: {

moveBy(dx: number, dy: number) {

this.x += dx; // Strongly typed this

this.y += dy; // Strongly typed this

},

},

});

obj.x = 10;

obj.y = 20;

obj.moveBy(5, 5);

Try
```

In the example above, the `methods` object in the argument to `makeObject` has a contextual type that includes `ThisType<D & M>` and therefore the type of [this](/docs/handbook/functions.html#this) in methods within the `methods` object is `{ x: number, y: number } & { moveBy(dx: number, dy: number): void }`. Notice how the type of the `methods` property simultaneously is an inference target and a source for the `this` type in methods.

The `ThisType<T>` marker interface is simply an empty interface declared in `lib.d.ts`. Beyond being recognized in the contextual type of an object literal, the interface acts like any empty interface.

## Intrinsic String Manipulation Types

### `Uppercase<StringType>`

### `Lowercase<StringType>`

### `Capitalize<StringType>`

### `Uncapitalize<StringType>`

To help with string manipulation around template string literals, TypeScript includes a set of types which can be used in string manipulation within the type system. You can find those in the [Template Literal Types](/docs/handbook/2/template-literal-types.html#uppercasestringtype) documentation.

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/reference/Utility Types.md) ❤

Contributors to this page:

C![christian  (54)](https://gravatar.com/avatar/1f58f226873fbbebcb8d4741b56fc99c?s=32&&d=blank)

OT![Orta Therox  (23)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

B![bob1983  (4)](https://gravatar.com/avatar/e0bb00ef33c5e6bb0e870142dab2e933ff59e37a35507771615de059e77e359a?s=32&&d=blank)

JB![Jack Bates  (3)](https://gravatar.com/avatar/98326ec560d25aebd787245a6c457afd24ed35b0ba578c2a5e38da41ff657152?s=32&&d=blank)

HX![Hong Xu  (2)](https://gravatar.com/avatar/7619e02c6acd87bfef3e32a066e4aaf76dd318a03e53233f2988eae0587c829c?s=32&&d=blank)

34+

Last updated: Jul 27, 2026
