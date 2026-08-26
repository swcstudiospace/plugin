# TypeScript: Documentation - Module: Class

Source: https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html

Was this page helpful?

# Module: Class

For example, when you want to work with JavaScript code which looks like:

```
ts

const Greeter = require("super-greeter");

const greeter = new Greeter();

greeter.greet();
```

To handle both importing via UMD and modules:

```
ts

// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]

// Project: [~THE PROJECT NAME~]

// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/*~ This is the module template file for class modules.

*~ You should rename it to index.d.ts and place it in a folder with the same name as the module.

*~ For example, if you were writing a file for "super-greeter", this

*~ file should be 'super-greeter/index.d.ts'

*/

// Note that ES6 modules cannot directly export class objects.

// This file should be imported using the CommonJS-style:

//   import x = require('[~THE MODULE~]');

//

// Alternatively, if --allowSyntheticDefaultImports or

// --esModuleInterop is turned on, this file can also be

// imported as a default import:

//   import x from '[~THE MODULE~]';

//

// Refer to the TypeScript documentation at

// https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require

// to understand common workarounds for this limitation of ES6 modules.

/*~ If this module is a UMD module that exposes a global variable 'myClassLib' when

*~ loaded outside a module loader environment, declare that global here.

*~ Otherwise, delete this declaration.

*/

export as namespace myClassLib;

/*~ This declaration specifies that the class constructor function

*~ is the exported object from the file

*/

export = Greeter;

/*~ Write your module's methods and properties in this class */

declare class Greeter {

constructor(customGreeting?: string);

greet: void;

myMethod(opts: MyClass.MyClassMethodOptions): number;

}

/*~ If you want to expose types from your module as well, you can

*~ place them in this block.

*~

*~ Note that if you decide to include this namespace, the module can be

*~ incorrectly imported as a namespace object, unless

*~ --esModuleInterop is turned on:

*~   import * as x from '[~THE MODULE~]'; // WRONG! DO NOT DO THIS!

*/

declare namespace MyClass {

export interface MyClassMethodOptions {

width?: number;

height?: number;

}

}
```

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/declaration-files/templates/module-class.d.ts.md) ❤

Contributors to this page:

MH![Mohamed Hegazy  (53)](https://gravatar.com/avatar/17e2da9785d45119a4c4cfed99e40d9c?s=32&&d=blank)

OT![Orta Therox  (16)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

W![Waua  (1)](https://gravatar.com/avatar/4f0071ce89cd4cc768dfdd555c9d45c6afcb5dae1002b18073cc021e1ad78ec4?s=32&&d=blank)

AC![Alper Cugun  (1)](https://gravatar.com/avatar/8b2cb77caf52e16805b5c06be7415835cfd7bba5c68fa6ab2ace789345f0ba3e?s=32&&d=blank)

DR![Daniel Rose  (1)](https://gravatar.com/avatar/a818e7f65a790fe4ba3da95110749a30?s=32&&d=blank)

2+

Last updated: Jul 27, 2026
