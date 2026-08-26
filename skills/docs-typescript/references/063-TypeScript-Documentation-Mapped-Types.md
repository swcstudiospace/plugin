# TypeScript: Documentation - Mapped Types

Source: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html

Was this page helpful?

# Mapped Types

When you don’t want to repeat yourself, sometimes a type needs to be based on another type.

Mapped types build on the syntax for index signatures, which are used to declare the types of properties which have not been declared ahead of time:

```
ts

type OnlyBoolsAndHorses = {

[key: string]: boolean | Horse;

};

const conforms: OnlyBoolsAndHorses = {

del: true,

rodney: false,

};

Try
```

A mapped type is a generic type which uses a union of `PropertyKey`s (frequently created [via a `keyof`](/docs/handbook/2/indexed-access-types.html)) to iterate through keys to create a type:

```
ts

type OptionsFlags<Type> = {

[Property in keyof Type]: boolean;

};

Try
```

In this example, `OptionsFlags` will take all the properties from the type `Type` and change their values to be a boolean.

```
ts

type Features = {

darkMode: () => void;

newUserProfile: () => void;

};

type FeatureOptions = OptionsFlags<Features>;

type FeatureOptions = {
    darkMode: boolean;
    newUserProfile: boolean;
}

Try
```

### Mapping Modifiers

There are two additional modifiers which can be applied during mapping: `readonly` and `?` which affect mutability and optionality respectively.

You can remove or add these modifiers by prefixing with `-` or `+`. If you don’t add a prefix, then `+` is assumed.

```
ts

// Removes 'readonly' attributes from a type's properties

type CreateMutable<Type> = {

-readonly [Property in keyof Type]: Type[Property];

};

type LockedAccount = {

readonly id: string;

readonly name: string;

};

type UnlockedAccount = CreateMutable<LockedAccount>;

type UnlockedAccount = {
    id: string;
    name: string;
}

Try
```

```
ts

// Removes 'optional' attributes from a type's properties

type Concrete<Type> = {

[Property in keyof Type]-?: Type[Property];

};

type MaybeUser = {

id: string;

name?: string;

age?: number;

};

type User = Concrete<MaybeUser>;

type User = {
    id: string;
    name: string;
    age: number;
}

Try
```

## Key Remapping via `as`

In TypeScript 4.1 and onwards, you can re-map keys in mapped types with an `as` clause in a mapped type:

```
ts

type MappedTypeWithNewProperties<Type> = {

[Properties in keyof Type as NewKeyType]: Type[Properties]

}
```

You can leverage features like [template literal types](/docs/handbook/2/template-literal-types.html) to create new property names from prior ones:

```
ts

type Getters<Type> = {

[Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]

};

interface Person {

name: string;

age: number;

location: string;

}

type LazyPerson = Getters<Person>;

type LazyPerson = {
    getName: () => string;
    getAge: () => number;
    getLocation: () => string;
}

Try
```

You can filter out keys by producing `never` via a conditional type:

```
ts

// Remove the 'kind' property

type RemoveKindField<Type> = {

[Property in keyof Type as Exclude<Property, "kind">]: Type[Property]

};

interface Circle {

kind: "circle";

radius: number;

}

type KindlessCircle = RemoveKindField<Circle>;

type KindlessCircle = {
    radius: number;
}

Try
```

You can map over arbitrary unions, not just unions of `string | number | symbol`, but unions of any type:

```
ts

type EventConfig<Events extends { kind: string }> = {

[E in Events as E["kind"]]: (event: E) => void;

}

type SquareEvent = { kind: "square", x: number, y: number };

type CircleEvent = { kind: "circle", radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>

type Config = {
    square: (event: SquareEvent) => void;
    circle: (event: CircleEvent) => void;
}

Try
```

### Further Exploration

Mapped types work well with other features in this type manipulation section, for example here is [a mapped type using a conditional type](/docs/handbook/2/conditional-types.html) which returns either a `true` or `false` depending on whether an object has the property `pii` set to the literal `true`:

```
ts

type ExtractPII<Type> = {

[Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;

};

type DBFields = {

id: { format: "incrementing" };

name: { type: string; pii: true };

};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;

type ObjectsNeedingGDPRDeletion = {
    id: false;
    name: true;
}

Try
```

[### Conditional Types

Create types which act like if statements in the type system.](/docs/handbook/2/conditional-types.html)[### Template Literal Types

Generating mapping types which change properties via template literal strings.](/docs/handbook/2/template-literal-types.html)

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/handbook-v2/Type Manipulation/Mapped Types.md) ❤

Contributors to this page:

OT![Orta Therox  (7)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

SF![Sergey Falinsky  (2)](https://gravatar.com/avatar/5d9c75b281592131230095bf81dcbf654a69e1ca47af5c275f0687e5da571d36?s=32&&d=blank)

L![Luke  (1)](https://gravatar.com/avatar/1778698e15015967ad965a26b75d42e60fa3663ca5aac74bde74e0368f512f84?s=32&&d=blank)

W![webstrand  (1)](https://gravatar.com/avatar/3da8825d4970df9c88573b8b96aee80257783f6e6088d54228bb6e4023287190?s=32&&d=blank)

SGH![Steven G. Harms  (1)](https://gravatar.com/avatar/707f428bf9077bef7087dd3237e2df39f1853397977155a59c0cec4b3c2d21e9?s=32&&d=blank)

5+

Last updated: Jul 27, 2026
