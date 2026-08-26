# TypeScript: Documentation - Consumption

Source: https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html

Was this page helpful?

# Consumption

## Downloading

Getting type declarations requires no tools apart from npm.

As an example, getting the declarations for a library like lodash takes nothing more than the following command

```
cmd

npm install --save-dev @types/lodash
```

It is worth noting that if the npm package already includes its declaration file as described in [Publishing](/docs/handbook/declaration-files/publishing.html), downloading the corresponding `@types` package is not needed.

## Consuming

From there you’ll be able to use lodash in your TypeScript code with no fuss.
This works for both modules and global code.

For example, once you’ve `npm install`-ed your type declarations, you can use imports and write

```
ts

import * as _ from "lodash";

_.padStart("Hello TypeScript!", 20, " ");
```

or if you’re not using modules, you can just use the global variable `_`.

```
ts

_.padStart("Hello TypeScript!", 20, " ");
```

## Searching

For the most part, type declaration packages should always have the same name as the package name on `npm`, but prefixed with `@types/`,
but if you need, you can use the [Yarn package search](https://yarnpkg.com/) to find the package for your favorite library.

> Note: if the declaration file you are searching for is not present, you can always contribute one back and help out the next developer looking for it.
> Please see the DefinitelyTyped [contribution guidelines page](https://definitelytyped.org/guides/contributing.html) for details.

[### Publishing

How to get your d.ts files to users](/docs/handbook/declaration-files/publishing.html)

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/declaration-files/Consumption.md) ❤

Contributors to this page:

MH![Mohamed Hegazy  (52)](https://gravatar.com/avatar/17e2da9785d45119a4c4cfed99e40d9c?s=32&&d=blank)

OT![Orta Therox  (14)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

IO![Iván Ovejero  (1)](https://gravatar.com/avatar/295845dcef2f47d9aa1059793f23f36ceb739f1772ac1b487f11a1094e733655?s=32&&d=blank)

KO![Kristján Oddsson  (1)](https://gravatar.com/avatar/c7938b0536fb43f750fe08c73f804272349f01d9a97a59548c557706ae7cbee4?s=32&&d=blank)

EB![Eli Barzilay  (1)](https://gravatar.com/avatar/7384b5fcebe0e04cdd109255e1189e5135524f0ebc6ff0ff807b0b9d6ebd3976?s=32&&d=blank)

5+

Last updated: Jul 27, 2026
