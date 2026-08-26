# Hello World

Source: https://nextjs.org/docs/app/guides/environment-variables

---
title: How to use environment variables in Next.js
description: Learn to add and access environment variables in your Next.js application.
url: "https://nextjs.org/docs/app/guides/environment-variables"
docs\_index: /docs/llms.txt
version: 16.2.12
lastUpdated: 2026-03-03
prerequisites:
- "Guides: /docs/app/guides"
---
> For an index of all Next.js documentation, see [/docs/llms.txt](/docs/llms.txt).
Next.js comes with built-in support for environment variables, which allows you to do the following:
\* [Use `.env` to load environment variables](#loading-environment-variables)
\* [Bundle environment variables for the browser by prefixing with `NEXT\_PUBLIC\_`](#bundling-environment-variables-for-the-browser)
> \*\*Warning:\*\* The default `create-next-app` template ensures all `.env` files are added to your `.gitignore`. You almost never want to commit these files to your repository.
## Loading Environment Variables
Next.js has built-in support for loading environment variables from `.env\*` files into `process.env`.
```txt filename=".env"
DB\_HOST=localhost
DB\_USER=myuser
DB\_PASS=mypassword
```
> \*\*Note\*\*: Next.js also supports multiline variables inside of your `.env\*` files:
>
> ```bash
> # .env
>
> # you can write with line breaks
> PRIVATE\_KEY="-----BEGIN RSA PRIVATE KEY-----
> ...
> Kh9NV...
> ...
> -----END DSA PRIVATE KEY-----"
>
> # or with `\n` inside double quotes
> PRIVATE\_KEY="-----BEGIN RSA PRIVATE KEY-----\nKh9NV...\n-----END DSA PRIVATE KEY-----\n"
> ```
> \*\*Note\*\*: If you are using a `/src` folder, please note that Next.js will load the .env files \*\*only\*\* from the parent folder and \*\*not\*\* from the `/src` folder.
> This loads `process.env.DB\_HOST`, `process.env.DB\_USER`, and `process.env.DB\_PASS` into the Node.js environment automatically allowing you to use them in [Route Handlers](/docs/app/api-reference/file-conventions/route).
For example:
```js filename="app/api/route.js"
export async function GET() {
const db = await myDB.connect({
host: process.env.DB\_HOST,
username: process.env.DB\_USER,
password: process.env.DB\_PASS,
})
// ...
}
```
### Loading Environment Variables with `@next/env`
If you need to load environment variables outside of the Next.js runtime, such as in a root config file for an ORM or test runner, you can use the `@next/env` package.
This package is used internally by Next.js to load environment variables from `.env\*` files.
To use it, install the package and use the `loadEnvConfig` function to load the environment variables:
```bash package="pnpm"
pnpm add @next/env
```
```bash package="npm"
npm install @next/env
```
```bash package="yarn"
yarn add @next/env
```
```bash package="bun"
bun add @next/env
```
```tsx filename="envConfig.ts" switcher
import { loadEnvConfig } from '@next/env'
const projectDir = process.cwd()
loadEnvConfig(projectDir)
```
```jsx filename="envConfig.js" switcher
import { loadEnvConfig } from '@next/env'
const projectDir = process.cwd()
loadEnvConfig(projectDir)
```
Then, you can import the configuration where needed. For example:
```tsx filename="orm.config.ts" switcher
import './envConfig.ts'
export default defineConfig({
dbCredentials: {
connectionString: process.env.DATABASE\_URL!,
},
})
```
```jsx filename="orm.config.js" switcher
import './envConfig.js'
export default defineConfig({
dbCredentials: {
connectionString: process.env.DATABASE\_URL,
},
})
```
### Referencing Other Variables
Next.js will automatically expand variables that use `$` to reference other variables e.g. `$VARIABLE` inside of your `.env\*` files. This allows you to reference other secrets. For example:
```txt filename=".env"
TWITTER\_USER=nextjs
TWITTER\_URL=https://x.com/$TWITTER\_USER
```
In the above example, `process.env.TWITTER\_URL` would be set to `https://x.com/nextjs`.
> \*\*Good to know\*\*: If you need to use variable with a `$` in the actual value, it needs to be escaped e.g. `\$`.
## Bundling Environment Variables for the Browser
Non-`NEXT\_PUBLIC\_` environment variables are only available in the Node.js environment, meaning they aren't accessible to the browser (the client runs in a different \*environment\*).
In order to make the value of an environment variable accessible in the browser, Next.js can "inline" a value, at build time, into the js bundle that is delivered to the client, replacing all references to `process.env.[variable]` with a hard-coded value. To tell it to do this, you just have to prefix the variable with `NEXT\_PUBLIC\_`. For example:
```txt filename=".env"
NEXT\_PUBLIC\_ANALYTICS\_ID=abcdefghijk
```
This will tell Next.js to replace all references to `process.env.NEXT\_PUBLIC\_ANALYTICS\_ID` in the Node.js environment with the value from the environment in which you run `next build`, allowing you to use it anywhere in your code. It will be inlined into any JavaScript sent to the browser.
> \*\*Note\*\*: After being built, your app will no longer respond to changes to these environment variables. For instance, if you use a Heroku pipeline to promote slugs built in one environment to another environment, or if you build and deploy a single Docker image to multiple environments, all `NEXT\_PUBLIC\_` variables will be frozen with the value evaluated at build time, so these values need to be set appropriately when the project is built. If you need access to runtime environment values, you'll have to setup your own API to provide them to the client (either on demand or during initialization).
```js filename="pages/index.js"
import setupAnalyticsService from '../lib/my-analytics-service'
// 'NEXT\_PUBLIC\_ANALYTICS\_ID' can be used here as it's prefixed by 'NEXT\_PUBLIC\_'.
// It will be transformed at build time to `setupAnalyticsService('abcdefghijk')`.
setupAnalyticsService(process.env.NEXT\_PUBLIC\_ANALYTICS\_ID)
function HomePage() {
return

# Hello World

}
export default HomePage
```
Note that dynamic lookups will \*not\* be inlined, such as:
```js
// This will NOT be inlined, because it uses a variable
const varName = 'NEXT\_PUBLIC\_ANALYTICS\_ID'
setupAnalyticsService(process.env[varName])
// This will NOT be inlined, because it uses a variable
const env = process.env
setupAnalyticsService(env.NEXT\_PUBLIC\_ANALYTICS\_ID)
```
### Runtime Environment Variables
Next.js can support both build time and runtime environment variables.
\*\*By default, environment variables are only available on the server\*\*. To expose an environment variable to the browser, it must be prefixed with `NEXT\_PUBLIC\_`. However, these public environment variables will be inlined into the JavaScript bundle during `next build`.
You can safely read environment variables on the server during dynamic rendering:
```tsx filename="app/page.ts" switcher
import { connection } from 'next/server'
export default async function Component() {
await connection()
// cookies, headers, and other Request-time APIs
// will also opt into dynamic rendering, meaning
// this env variable is evaluated at runtime
const value = process.env.MY\_VALUE
// ...
}
```
```jsx filename="app/page.js" switcher
import { connection } from 'next/server'
export default async function Component() {
await connection()
// cookies, headers, and other Request-time APIs
// will also opt into dynamic rendering, meaning
// this env variable is evaluated at runtime
const value = process.env.MY\_VALUE
// ...
}
```
This allows you to use a singular Docker image that can be promoted through multiple environments with different values.
\*\*Good to know:\*\*
\* You can run code on server startup using the [`register` function](/docs/app/guides/instrumentation).
## Test Environment Variables
Apart from `development` and `production` environments, there is a 3rd option available: `test`. In the same way you can set defaults for development or production environments, you can do the same with a `.env.test` file for the `testing` environment (though this one is not as common as the previous two). Next.js will not load environment variables from `.env.development` or `.env.production` in the `testing` environment.
This one is useful when running tests with tools like `jest` or `cypress` where you need to set specific environment vars only for testing purposes. Test default values will be loaded if `NODE\_ENV` is set to `test`, though you usually don't need to do this manually as testing tools will address it for you.
There is a small difference between `test` environment, and both `development` and `production` that you need to bear in mind: `.env.local` won't be loaded, as you expect tests to produce the same results for everyone. This way every test execution will use the same env defaults across different executions by ignoring your `.env.local` (which is intended to override the default set).
> \*\*Good to know\*\*: similar to Default Environment Variables, `.env.test` file should be included in your repository, but `.env.test.local` shouldn't, as `.env\*.local` are intended to be ignored through `.gitignore`.
While running unit tests you can make sure to load your environment variables the same way Next.js does by leveraging the `loadEnvConfig` function from the `@next/env` package.
```js
// The below can be used in a Jest global setup file or similar for your testing set-up
import { loadEnvConfig } from '@next/env'
export default async () => {
const projectDir = process.cwd()
loadEnvConfig(projectDir)
}
```
## Environment Variable Load Order
Environment variables are looked up in the following places, in order, stopping once the variable is found.
1. `process.env`
2. `.env.$(NODE\_ENV).local`
3. `.env.local` (Not checked when `NODE\_ENV` is `test`.)
4. `.env.$(NODE\_ENV)`
5. `.env`
For example, if `NODE\_ENV` is `development` and you define a variable in both `.env.development.local` and `.env`, the value in `.env.development.local` will be used.
> \*\*Good to know\*\*: The allowed values for `NODE\_ENV` are `production`, `development` and `test`.
## Good to know
\* If you are using a [`/src` directory](/docs/app/api-reference/file-conventions/src-folder), `.env.\*` files should remain in the root of your project.
\* If the environment variable `NODE\_ENV` is unassigned, Next.js automatically assigns `development` when running the `next dev` command, or `production` for all other commands.
## Version History
| Version | Changes |
| -------- | --------------------------------------------- |
| `v9.4.0` | Support `.env` and `NEXT\_PUBLIC\_` introduced. |
---
For a semantic overview of all documentation, see [/docs/sitemap.md](/docs/sitemap.md)
For an index of all available documentation, see [/docs/llms.txt](/docs/llms.txt)
