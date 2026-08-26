# TypeScript: Documentation - Module: Plugin

Source: https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-plugin-d-ts.html

Was this page helpful?

# Module: Plugin

For example, when you want to work with JavaScript code which extends another library.

```
ts

import { greeter } from "super-greeter";

// Normal Greeter API

greeter(2);

greeter("Hello world");

// Now we extend the object with a new function at runtime

import "hyper-super-greeter";

greeter.hyperGreet();
```

The definition for “super-greeter”:

```
ts

/*~ This example shows how to have multiple overloads for your function */

export interface GreeterFunction {

(name: string): void

(time: number): void

}

/*~ This example shows how to export a function specified by an interface */

export const greeter: GreeterFunction;
```

We can extend the existing module like the following:

```
ts

// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]

// Project: [~THE PROJECT NAME~]

// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/*~ This is the module plugin template file. You should rename it to index.d.ts

*~ and place it in a folder with the same name as the module.

*~ For example, if you were writing a file for "super-greeter", this

*~ file should be 'super-greeter/index.d.ts'

*/

/*~ On this line, import the module which this module adds to */

import { greeter } from "super-greeter";

/*~ Here, declare the same module as the one you imported above

*~ then we expand the existing declaration of the greeter function

*/

export module "super-greeter" {

export interface GreeterFunction {

/** Greets even better! */

hyperGreet(): void;

}

}
```

This uses [declaration merging](/docs/handbook/declaration-merging.html)

## The Impact of ES6 on Module Plugins

Some plugins add or modify top-level exports on existing modules.
While this is legal in CommonJS and other loaders, ES6 modules are considered immutable and this pattern will not be possible.
Because TypeScript is loader-agnostic, there is no compile-time enforcement of this policy, but developers intending to transition to an ES6 module loader should be aware of this.

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/declaration-files/templates/module-plugin.d.ts.md) ❤

Contributors to this page:

MH![Mohamed Hegazy  (53)](https://gravatar.com/avatar/17e2da9785d45119a4c4cfed99e40d9c?s=32&&d=blank)

OT![Orta Therox  (14)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

B![B2D1  (1)](https://gravatar.com/avatar/1470171c917b7e9b977c19cd984e9c46c5fa8c49dd84394417b761464b9dc8f2?s=32&&d=blank)

1+

Last updated: Jul 27, 2026
