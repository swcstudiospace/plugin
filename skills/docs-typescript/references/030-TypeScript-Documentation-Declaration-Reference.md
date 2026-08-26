# TypeScript: Documentation - Declaration Reference

Source: https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html

Was this page helpful?

# Declaration Reference

The purpose of this guide is to teach you how to write a high-quality definition file.
This guide is structured by showing documentation for some API, along with sample usage of that API,
and explaining how to write the corresponding declaration.

These examples are ordered in approximately increasing order of complexity.

## Objects with Properties

*Documentation*

> The global variable `myLib` has a function `makeGreeting` for creating greetings,
> and a property `numberOfGreetings` indicating the number of greetings made so far.

*Code*

```
ts

let result = myLib.makeGreeting("hello, world");

console.log("The computed greeting is:" + result);

let count = myLib.numberOfGreetings;
```

*Declaration*

Use `declare namespace` to describe types or values accessed by dotted notation.

```
ts

declare namespace myLib {

function makeGreeting(s: string): string;

let numberOfGreetings: number;

}
```

## Overloaded Functions

*Documentation*

The `getWidget` function accepts a number and returns a Widget, or accepts a string and returns a Widget array.

*Code*

```
ts

let x: Widget = getWidget(43);

let arr: Widget[] = getWidget("all of them");
```

*Declaration*

```
ts

declare function getWidget(n: number): Widget;

declare function getWidget(s: string): Widget[];
```

## Reusable Types (Interfaces)

*Documentation*

> When specifying a greeting, you must pass a `GreetingSettings` object.
> This object has the following properties:
>
> 1 - greeting: Mandatory string
>
> 2 - duration: Optional length of time (in milliseconds)
>
> 3 - color: Optional string, e.g. ‘#ff00ff’

*Code*

```
ts

greet({

greeting: "hello world",

duration: 4000

});
```

*Declaration*

Use an `interface` to define a type with properties.

```
ts

interface GreetingSettings {

greeting: string;

duration?: number;

color?: string;

}

declare function greet(setting: GreetingSettings): void;
```

## Reusable Types (Type Aliases)

*Documentation*

> Anywhere a greeting is expected, you can provide a `string`, a function returning a `string`, or a `Greeter` instance.

*Code*

```
ts

function getGreeting() {

return "howdy";

}

class MyGreeter extends Greeter {}

greet("hello");

greet(getGreeting);

greet(new MyGreeter());
```

*Declaration*

You can use a type alias to make a shorthand for a type:

```
ts

type GreetingLike = string | (() => string) | MyGreeter;

declare function greet(g: GreetingLike): void;
```

## Organizing Types

*Documentation*

> The `greeter` object can log to a file or display an alert.
> You can provide LogOptions to `.log(...)` and alert options to `.alert(...)`

*Code*

```
ts

const g = new Greeter("Hello");

g.log({ verbose: true });

g.alert({ modal: false, title: "Current Greeting" });
```

*Declaration*

Use namespaces to organize types.

```
ts

declare namespace GreetingLib {

interface LogOptions {

verbose?: boolean;

}

interface AlertOptions {

modal: boolean;

title?: string;

color?: string;

}

}
```

You can also create nested namespaces in one declaration:

```
ts

declare namespace GreetingLib.Options {

// Refer to via GreetingLib.Options.Log

interface Log {

verbose?: boolean;

}

interface Alert {

modal: boolean;

title?: string;

color?: string;

}

}
```

## Classes

*Documentation*

> You can create a greeter by instantiating the `Greeter` object, or create a customized greeter by extending from it.

*Code*

```
ts

const myGreeter = new Greeter("hello, world");

myGreeter.greeting = "howdy";

myGreeter.showGreeting();

class SpecialGreeter extends Greeter {

constructor() {

super("Very special greetings");

}

}
```

*Declaration*

Use `declare class` to describe a class or class-like object.
Classes can have properties and methods as well as a constructor.

```
ts

declare class Greeter {

constructor(greeting: string);

greeting: string;

showGreeting(): void;

}
```

## Global Variables

*Documentation*

> The global variable `foo` contains the number of widgets present.

*Code*

```
ts

console.log("Half the number of widgets is " + foo / 2);
```

*Declaration*

Use `declare var` to declare variables.
If the variable is read-only, you can use `declare const`.
You can also use `declare let` if the variable is block-scoped.

```
ts

/** The number of widgets present */

declare var foo: number;
```

## Global Functions

*Documentation*

> You can call the function `greet` with a string to show a greeting to the user.

*Code*

```
ts

greet("hello, world");
```

*Declaration*

Use `declare function` to declare functions.

```
ts

declare function greet(greeting: string): void;
```

[### Introduction

How to write a high-quality TypeScript Declaration (d.ts) file](/docs/handbook/declaration-files/introduction.html)[### Library Structures

How to structure your d.ts files](/docs/handbook/declaration-files/library-structures.html)

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/declaration-files/By Example.md) ❤

Contributors to this page:

MH![Mohamed Hegazy  (57)](https://gravatar.com/avatar/17e2da9785d45119a4c4cfed99e40d9c?s=32&&d=blank)

OT![Orta Therox  (13)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

Y![ydz-one  (1)](https://gravatar.com/avatar/a1cf7e5d7e4c2f73a2789d9d1d3fe001?s=32&&d=blank)

PB![Pylyp Borysov  (1)](https://gravatar.com/avatar/a89473e7a895bc87515a5b3e9fbe207d?s=32&&d=blank)

RK![Rafał Krupiński  (1)](https://gravatar.com/avatar/20c66d3b08e6e3d858973b2a1c66d9a8?s=32&&d=blank)

7+

Last updated: Jul 27, 2026
