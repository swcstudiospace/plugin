# TypeScript: Documentation - What is a tsconfig.json

Source: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html

Was this page helpful?

# What is a tsconfig.json

## Overview

The presence of a `tsconfig.json` file in a directory indicates that the directory is the root of a TypeScript project.
The `tsconfig.json` file specifies the root files and the compiler options required to compile the project.

JavaScript projects can use a `jsconfig.json` file instead, which acts almost the same but has some JavaScript-related compiler flags enabled by default.

A project is compiled in one of the following ways:

## Using `tsconfig.json` or `jsconfig.json`

- By invoking tsc with no input files, in which case the compiler searches for the `tsconfig.json` file starting in the current directory and continuing up the parent directory chain.
- By invoking tsc with no input files and a `--project` (or just `-p`) command line option that specifies the path of a directory containing a `tsconfig.json` file, or a path to a valid `.json` file containing the configurations.

When input files are specified on the command line, `tsconfig.json` files are ignored.

## Examples

Example `tsconfig.json` files:

- Using the [`files`](/tsconfig#files) property

  ```
  {

  "compilerOptions": {

  "module": "commonjs",

  "noImplicitAny": true,

  "removeComments": true,

  "preserveConstEnums": true,

  "sourceMap": true

  },

  "files": [

  "core.ts",

  "sys.ts",

  "types.ts",

  "scanner.ts",

  "parser.ts",

  "utilities.ts",

  "binder.ts",

  "checker.ts",

  "emitter.ts",

  "program.ts",

  "commandLineParser.ts",

  "tsc.ts",

  "diagnosticInformationMap.generated.ts"

  ]

  }
  ```
- Using the [`include`](/tsconfig#include) and [`exclude`](/tsconfig#exclude) properties

  ```
  {

  "compilerOptions": {

  "module": "system",

  "noImplicitAny": true,

  "removeComments": true,

  "preserveConstEnums": true,

  "outFile": "../../built/local/tsc.js",

  "sourceMap": true

  },

  "include": ["src/**/*"],

  "exclude": ["**/*.spec.ts"]

  }
  ```

## TSConfig Bases

Depending on the JavaScript runtime environment which you intend to run your code in, there may be a base configuration which you can use at [github.com/tsconfig/bases](https://github.com/tsconfig/bases/).
These are `tsconfig.json` files which your project extends from which simplifies your `tsconfig.json` by handling the runtime support.

For example, if you were writing a project which uses Node.js version 12 and above, then you could use the npm module [`@tsconfig/node12`](https://www.npmjs.com/package/@tsconfig/node12):

```
{

"extends": "@tsconfig/node12/tsconfig.json",

"compilerOptions": {

"preserveConstEnums": true

},

"include": ["src/**/*"],

"exclude": ["**/*.spec.ts"]

}
```

This lets your `tsconfig.json` focus on the unique choices for your project, and not all of the runtime mechanics. There are a few tsconfig bases already, and we’re hoping the community can add more for different environments.

## Details

The `"compilerOptions"` property can be omitted, in which case the compiler’s defaults are used. See our full list of supported [Compiler Options](/tsconfig).

## TSConfig Reference

To learn more about the hundreds of configuration options in the [TSConfig Reference](/tsconfig).

## Schema

The `tsconfig.json` Schema can be found at [the JSON Schema Store](https://json.schemastore.org/tsconfig).

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/project-config/tsconfig.json.md) ❤

Contributors to this page:

OT![Orta Therox  (19)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

LG![Lucas Garron  (1)](https://gravatar.com/avatar/de1f8db7fa8047a5a774b15c33489ad25df383510742a0457f4156b5f75f6d49?s=32&&d=blank)

JB![Jake Bailey  (1)](https://gravatar.com/avatar/127e9f47eb2768eae31eb5809ae4f1ca44336bc51e45473c68ebb9648608f590?s=32&&d=blank)

L☺![Loren ☺️  (1)](https://gravatar.com/avatar/b8eaa4ee5719bf17b085b89caae0e4c260b44072c703ff9ad6bc37112bb4b4e7?s=32&&d=blank)

AG![Anton Gilgur  (1)](https://gravatar.com/avatar/14cf8bfc7e9486a5c6c0acc08682cfef8de31d40c2634eb4099fe3fc008a3492?s=32&&d=blank)

4+

Last updated: Jul 27, 2026
