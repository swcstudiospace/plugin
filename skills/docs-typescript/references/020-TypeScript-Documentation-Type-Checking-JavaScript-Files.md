# TypeScript: Documentation - Type Checking JavaScript Files

Source: https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html

Was this page helpful?

# Type Checking JavaScript Files

Here are some notable differences on how checking works in `.js` files compared to `.ts` files.

## Properties are inferred from assignments in class bodies

ES2015 does not have a means for declaring properties on classes. Properties are dynamically assigned, just like object literals.

In a `.js` file, the compiler infers properties from property assignments inside the class body.
The type of a property is the type given in the constructor, unless it’s not defined there, or the type in the constructor is undefined or null.
In that case, the type is the union of the types of all the right-hand values in these assignments.
Properties defined in the constructor are always assumed to exist, whereas ones defined just in methods, getters, or setters are considered optional.

```
js

class C {

constructor() {

this.constructorOnly = 0;

this.constructorUnknown = undefined;

}

method() {

this.constructorOnly = false;

Type 'boolean' is not assignable to type 'number'.2322Type 'boolean' is not assignable to type 'number'.

this.constructorUnknown = "plunkbat"; // ok, constructorUnknown is string | undefined

this.methodOnly = "ok"; // ok, but methodOnly could also be undefined

}

method2() {

this.methodOnly = true; // also, ok, methodOnly's type is string | boolean | undefined

}

}

Try
```

If properties are never set in the class body, they are considered unknown.
If your class has properties that are only read from, add and then annotate a declaration in the constructor with JSDoc to specify the type.
You don’t even have to give a value if it will be initialized later:

```
js

class C {

constructor() {

/** @type {number | undefined} */

this.prop = undefined;

/** @type {number | undefined} */

this.count;

}

}

let c = new C();

c.prop = 0; // OK

c.count = "string";

Type 'string' is not assignable to type 'number'.2322Type 'string' is not assignable to type 'number'.Try
```

## Constructor functions are equivalent to classes

Before ES2015, JavaScript used constructor functions instead of classes.
The compiler supports this pattern and understands constructor functions as equivalent to ES2015 classes.
The property inference rules described above work exactly the same way.

```
js

function C() {

this.constructorOnly = 0;

this.constructorUnknown = undefined;

}

C.prototype.method = function () {

this.constructorOnly = false;

Type 'boolean' is not assignable to type 'number'.2322Type 'boolean' is not assignable to type 'number'.

this.constructorUnknown = "plunkbat"; // OK, the type is string | undefined

};

Try
```

## CommonJS modules are supported

In a `.js` file, TypeScript understands the CommonJS module format.
Assignments to `exports` and `module.exports` are recognized as export declarations.
Similarly, `require` function calls are recognized as module imports. For example:

```
js

// same as `import module "fs"`

const fs = require("fs");

// same as `export function readFile`

module.exports.readFile = function (f) {

return fs.readFileSync(f);

};
```

The module support in JavaScript is much more syntactically forgiving than TypeScript’s module support.
Most combinations of assignments and declarations are supported.

## Classes, functions, and object literals are namespaces

Classes are namespaces in `.js` files.
This can be used to nest classes, for example:

```
js

class C {}

C.D = class {};

Try
```

And, for pre-ES2015 code, it can be used to simulate static methods:

```
js

function Outer() {

this.y = 2;

}

Outer.Inner = function () {

this.yy = 2;

};

Outer.Inner();

Try
```

It can also be used to create simple namespaces:

```
js

var ns = {};

ns.C = class {};

ns.func = function () {};

ns;

Try
```

Other variants are allowed as well:

```
js

// IIFE

var ns = (function (n) {

return n || {};

})();

ns.CONST = 1;

// defaulting to global

var assign =

assign ||

function () {

// code goes here

};

assign.extra = 1;

Try
```

## Object literals are open-ended

In a `.ts` file, an object literal that initializes a variable declaration gives its type to the declaration.
No new members can be added that were not specified in the original literal.
This rule is relaxed in a `.js` file; object literals have an open-ended type (an index signature) that allows adding and looking up properties that were not defined originally.
For instance:

```
js

var obj = { a: 1 };

obj.b = 2; // Allowed

Try
```

Object literals behave as if they have an index signature `[x:string]: any` that allows them to be treated as open maps instead of closed objects.

Like other special JS checking behaviors, this behavior can be changed by specifying a JSDoc type for the variable. For example:

```
js

/** @type {{a: number}} */

var obj = { a: 1 };

obj.b = 2;

Property 'b' does not exist on type '{ a: number; }'.2339Property 'b' does not exist on type '{ a: number; }'.Try
```

## null, undefined, and empty array initializers are of type any or any[]

Any variable, parameter or property that is initialized with null or undefined will have type any, even if strict null checks is turned on.
Any variable, parameter or property that is initialized with [] will have type any[], even if strict null checks is turned on.
The only exception is for properties that have multiple initializers as described above.

```
js

function Foo(i = null) {

if (!i) i = 1;

var j = undefined;

j = 2;

this.l = [];

}

var foo = new Foo();

foo.l.push(foo.i);

foo.l.push("end");

Try
```

## Function parameters are optional by default

Since there is no way to specify optionality on parameters in pre-ES2015 JavaScript, all function parameters in `.js` file are considered optional.
Calls with fewer arguments than the declared number of parameters are allowed.

It is important to note that it is an error to call a function with too many arguments.

For instance:

```
js

function bar(a, b) {

console.log(a + " " + b);

}

bar(1); // OK, second argument considered optional

bar(1, 2);

bar(1, 2, 3); // Error, too many arguments

Expected 0-2 arguments, but got 3.2554Expected 0-2 arguments, but got 3.Try
```

JSDoc annotated functions are excluded from this rule.
Use JSDoc optional parameter syntax (`[` `]`) to express optionality. e.g.:

```
js

/**

* @param {string} [somebody] - Somebody's name.

*/

function sayHello(somebody) {

if (!somebody) {

somebody = "John Doe";

}

console.log("Hello " + somebody);

}

sayHello();

Try
```

## Var-args parameter declaration inferred from use of `arguments`

A function whose body has a reference to the `arguments` reference is implicitly considered to have a var-arg parameter (i.e. `(...arg: any[]) => any`). Use JSDoc var-arg syntax to specify the type of the arguments.

```
js

/** @param {...number} args */

function sum(/* numbers */) {

var total = 0;

for (var i = 0; i < arguments.length; i++) {

total += arguments[i];

}

return total;

}

Try
```

## Unspecified type parameters default to `any`

Since there is no natural syntax for specifying generic type parameters in JavaScript, an unspecified type parameter defaults to `any`.

### In extends clause

For instance, `React.Component` is defined to have two type parameters, `Props` and `State`.
In a `.js` file, there is no legal way to specify these in the extends clause. By default the type arguments will be `any`:

```
js

import { Component } from "react";

class MyComponent extends Component {

render() {

this.props.b; // Allowed, since this.props is of type any

}

}
```

Use JSDoc `@augments` to specify the types explicitly. for instance:

```
js

import { Component } from "react";

/**

* @augments {Component<{a: number}, State>}

*/

class MyComponent extends Component {

render() {

this.props.b; // Error: b does not exist on {a:number}

}

}
```

### In JSDoc references

An unspecified type argument in JSDoc defaults to any:

```
js

/** @type{Array} */

var x = [];

x.push(1); // OK

x.push("string"); // OK, x is of type Array<any>

/** @type{Array.<number>} */

var y = [];

y.push(1); // OK

y.push("string"); // Error, string is not assignable to number

Try
```

### In function calls

A call to a generic function uses the arguments to infer the type parameters. Sometimes this process fails to infer any types, mainly because of lack of inference sources; in these cases, the type parameters will default to `any`. For example:

```
js

var p = new Promise((resolve, reject) => {

reject();

});

p; // Promise<any>;
```

To learn all of the features available in JSDoc, see [the reference](/docs/handbook/jsdoc-supported-types.html).

[### JS Projects Utilizing TypeScript

How to add type checking to JavaScript files using TypeScript](/docs/handbook/intro-to-js-ts.html)[### JSDoc Reference

What JSDoc does TypeScript-powered JavaScript support?](/docs/handbook/jsdoc-supported-types.html)

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/javascript/Type Checking JavaScript Files.md) ❤

Contributors to this page:

HN![Harry Nguyen  (51)](https://gravatar.com/avatar/386e27141a29f5c1076619afc140ffb4?s=32&&d=blank)

OT![Orta Therox  (17)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

RC![Ryan Cavanaugh  (3)](https://gravatar.com/avatar/2484d99c8a58bc51ae587e07a05ba6e2?s=32&&d=blank)

NS![Nathan Shively-Sanders  (2)](https://gravatar.com/avatar/8c5596e6ef2b41132cee585c9b146116?s=32&&d=blank)

MH![Mohamed Hegazy  (2)](https://gravatar.com/avatar/17e2da9785d45119a4c4cfed99e40d9c?s=32&&d=blank)

15+

Last updated: Jul 27, 2026
