# TypeScript: Documentation - Nightly Builds

Source: https://www.typescriptlang.org/docs/handbook/nightly-builds.html

Was this page helpful?

# Nightly Builds

A nightly build from the [TypeScript’s `main`](https://github.com/Microsoft/TypeScript/tree/main) branch is published by midnight PST to npm.
Here is how you can get it and use it with your tools.

## Using npm

```
shell

npm install -D typescript@next
```

## Updating your IDE to use the nightly builds

You can also update your editor/IDE to use the nightly drop.
You will typically need to install the package through npm.
The rest of this section mostly assumes `typescript@next` is already installed.

### Visual Studio Code

The VS Code website [has documentation on selecting a workspace version of TypeScript](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions).
After installing a nightly version of TypeScript in your workspace, you can follow directions there, or simply update your workspace settings in the JSON view.
A direct way to do this is to open or create your workspace’s `.vscode/settings.json` and add the following property:

```
json

"typescript.tsdk": "<path to your folder>/node_modules/typescript/lib"
```

Alternatively, if you simply want to run the nightly editing experience for JavaScript and TypeScript in Visual Studio Code without changing your workspace version, you can run the [JavaScript and TypeScript Nightly Extension](https://marketplace.visualstudio.com/items?itemName%253Dms-vscode.vscode-typescript-next)

### Sublime Text

Update the `Settings - User` file with the following:

```
json

"typescript_tsdk": "<path to your folder>/node_modules/typescript/lib"
```

More information is available at the [TypeScript Plugin for Sublime Text installation documentation](https://github.com/Microsoft/TypeScript-Sublime-Plugin#installation).

### Visual Studio 2013 and 2015

> Note: Most changes do not require you to install a new version of the VS TypeScript plugin.

The nightly build currently does not include the full plugin setup, but we are working on publishing an installer on a nightly basis as well.

1. Download the [VSDevMode.ps1](https://github.com/Microsoft/TypeScript/blob/main/scripts/VSDevMode.ps1) script.

   > Also see our wiki page on [using a custom language service file](https://github.com/Microsoft/TypeScript/wiki/Dev-Mode-in-Visual-Studio#using-a-custom-language-service-file).
2. From a PowerShell command window, run:

For VS 2015:

```
VSDevMode.ps1 14 -tsScript <path to your folder>/node_modules/typescript/lib
```

For VS 2013:

```
VSDevMode.ps1 12 -tsScript <path to your folder>/node_modules/typescript/lib
```

### IntelliJ IDEA (Mac)

Go to `Preferences` > `Languages & Frameworks` > `TypeScript`:

> TypeScript Version: If you installed with npm: `/usr/local/lib/node_modules/typescript/lib`

### IntelliJ IDEA (Windows)

Go to `File` > `Settings` > `Languages & Frameworks` > `TypeScript`:

> TypeScript Version: If you installed with npm: `C:\Users\USERNAME\AppData\Roaming\npm\node_modules\typescript\lib`

The TypeScript docs are an open source project. Help us improve these pages [by sending a Pull Request](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/documentation/copy/en/Nightly Builds.md) ❤

Contributors to this page:

MH![Mohamed Hegazy  (52)](https://gravatar.com/avatar/17e2da9785d45119a4c4cfed99e40d9c?s=32&&d=blank)

OT![Orta Therox  (13)](https://avatars.githubusercontent.com/u/49038?s=100&u=0b9ac5bf42a8ea2543a05191e150e0213456744e&v=4)

S![StefanRein  (2)](https://gravatar.com/avatar/078daaad2c37d829a53e4db1827c0961?s=32&&d=blank)

DR![Daniel Rosenwasser  (1)](https://gravatar.com/avatar/3cb42391bbae78f84e416c9407fb9ef82c008ab291b8193611b0a77946c499d8?s=32&&d=blank)

NS![Nihaal Sangha  (1)](https://gravatar.com/avatar/6f0e1006521ebd927661b94fed3058d9133446051988f6f6ef5f2abe7ad7be01?s=32&&d=blank)

4+

Last updated: Jul 27, 2026
