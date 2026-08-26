# TypeScript: Documentation - Using Babel with TypeScript

Source: https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html

Was this page helpful?

# Using Babel with TypeScript

## Babel vs `tsc` for TypeScript

When making a modern JavaScript project, you might ask yourself what is the right way to convert files from TypeScript to JavaScript?

A lot of the time the answer is *“it depends”*, or *“someone may have decided for you”* depending on the project. If you are building your project with an existing framework like [tsdx](https://tsdx.io), [Angular](https://angular.io/), [NestJS](https://nestjs.com/) or any framework mentioned in the [Getting Started](/docs) then this decision is handled for you.

However, a useful heuristic could be:

- Is your build output mostly the same as your source input files? Use `tsc`
- Do you need a build pipeline with multiple potential outputs? Use `babel` for transpiling and `tsc` for type checking

## Babel for transpiling, `tsc` for types

This is a common pattern for projects with existing build infrastructure which may have been ported from a JavaScript codebase to TypeScript.

This technique is a hybrid approach, using Babel’s [preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript) to generate your JS files, and then using TypeScript to do type checking and `.d.ts` file generation.

By using babel’s support for TypeScript, you get the ability to work with existing build pipelines and are more likely to have a faster JS emit time because Babel does not type check your code.

#### Type Checking and d.ts file generation

The downside to using babel is that you don’t get type checking during the transition from TS to JS. This can mean that type errors which you miss in your editor could sneak through into production code.

In addition to that, Babel cannot create `.d.ts` files for your TypeScript which can make it harder to work with your project if it is a library.

To fix these issues, you would probably want to set up a command to type check your project using TSC. This likely means duplicating some of your babel config into a corresponding [`tsconfig.json`](/tsconfig) and ensuring these flags are enabled:

```
"compilerOptions": {

// Ensure that .d.ts files are created by tsc, but not .js files

"declaration": true,

"emitDeclarationOnly": true,

// Ensure that Babel can safely transpile files in the TypeScript project

"isolatedModules": true

}
```

For more information on these flags:

- [`isolatedModules`](/tsconfig#isolatedModules)
- [`declaration`](/tsconfig#declaration), [`emitDeclarationOnly`](/tsconfig#emitDeclarationOnly)

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/tutorials/Babel with TypeScript.md) ❤

Contributors to this page:

OT![Orta Therox  (13)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

SU![Samet UCA  (1)](https://gravatar.com/avatar/f226af3f80e5142d63f4c1e03785f717ce1ce2e1f8a1fc2b9a6e83bd0d9c86a8?s=32&&d=blank)

R![Rob  (1)](https://gravatar.com/avatar/19a177473e5958cea093bea7febb418e797d70f30f4e2c0f2b5f25a464b5356a?s=32&&d=blank)

US![Udayan Shevade  (1)](https://gravatar.com/avatar/3073884199081d11f216d5e514f08f916a57af1a93595b8b7421f2753184ae9d?s=32&&d=blank)

Last updated: Jul 27, 2026
