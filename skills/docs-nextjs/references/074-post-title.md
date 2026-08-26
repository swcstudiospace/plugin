# {post.title}

Source: https://nextjs.org/docs/app/getting-started/server-and-client-components

---
title: Server and Client Components
description: Learn how you can use React Server and Client Components to render parts of your application on the server or the client.
url: "https://nextjs.org/docs/app/getting-started/server-and-client-components"
docs\_index: /docs/llms.txt
version: 16.2.12
lastUpdated: 2026-06-23
prerequisites:
- "Getting Started: /docs/app/getting-started"
related:
- app/api-reference/directives/use-client
---
> For an index of all Next.js documentation, see [/docs/llms.txt](/docs/llms.txt).
By default, layouts and pages are [Server Components](https://react.dev/reference/rsc/server-components), which lets you fetch data and render parts of your UI on the server, optionally cache the result, and stream it to the client. When you need interactivity or browser APIs, you can use [Client Components](https://react.dev/reference/rsc/use-client) to layer in functionality.
This page explains how Server and Client Components work in Next.js and when to use them, with examples of how to compose them together in your application.
## When to use Server and Client Components?
The client and server environments have different capabilities. Server and Client Components allow you to run logic in each environment depending on your use case.
Use \*\*Client Components\*\* when you need:
\* [State](https://react.dev/learn/managing-state) and [event handlers](https://react.dev/learn/responding-to-events). E.g. `onClick`, `onChange`.
\* [Lifecycle logic](https://react.dev/learn/lifecycle-of-reactive-effects). E.g. `useEffect`.
\* Browser-only APIs. E.g. `localStorage`, `window`, `Navigator.geolocation`, etc.
\* [Custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks).
Use \*\*Server Components\*\* when you need:
\* Fetch data from databases or APIs close to the source.
\* Use API keys, tokens, and other secrets without exposing them to the client.
\* Reduce the amount of JavaScript sent to the browser.
\* Improve the [First Contentful Paint (FCP)](https://web.dev/fcp/), and stream content progressively to the client.
For example, the `` component is a Server Component that fetches data about a post, and passes it as props to the `` which handles client-side interactivity.
```tsx filename="app/[id]/page.tsx" highlight={1,17} switcher
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'
export default async function Page({
params,
}: {
params: Promise<{ id: string }>
}) {
const { id } = await params
const post = await getPost(id)
return (

# {post.title}

{/\* ... \*/}

)
}
```
```jsx filename="app/[id]/page.js" highlight={1,12} switcher
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'
export default async function Page({ params }) {
const post = await getPost(params.id)
return (

# {post.title}

{/\* ... \*/}

)
}
```
```tsx filename="app/ui/like-button.tsx" highlight={1} switcher
'use client'
import { useState } from 'react'
export default function LikeButton({ likes }: { likes: number }) {
// ...
}
```
```jsx filename="app/ui/like-button.js" highlight={1} switcher
'use client'
import { useState } from 'react'
export default function LikeButton({ likes }) {
// ...
}
```
## How do Server and Client Components work in Next.js?
### On the server
On the server, Next.js uses React's APIs to orchestrate rendering. The rendering work is split into chunks, by individual route segments ([layouts and pages](/docs/app/getting-started/layouts-and-pages)):
\* \*\*Server Components\*\* are rendered into a special data format called the React Server Component Payload (RSC Payload).
\* \*\*Client Components\*\* and the RSC Payload are used to [prerender](/docs/app/glossary#prerendering) HTML.
> \*\*What is the React Server Component Payload (RSC)?\*\*
>
> The RSC Payload is a compact binary representation of the rendered React Server Components tree. It's used by React on the client to update the browser's DOM. The RSC Payload contains:
>
> \* The rendered result of Server Components
> \* Placeholders for where Client Components should be rendered and references to their JavaScript files
> \* Any props passed from a Server Component to a Client Component
### On the client (first load)
Then, on the client:
1. \*\*HTML\*\* is used to immediately show a fast non-interactive preview of the route to the user.
2. \*\*RSC Payload\*\* is used to reconcile the Client and Server Component trees.
3. \*\*JavaScript\*\* is used to hydrate Client Components and make the application interactive.
> \*\*What is hydration?\*\*
>
> Hydration is React's process for attaching [event handlers](https://react.dev/learn/responding-to-events) to the DOM, to make the static HTML interactive.
### Subsequent Navigations
On subsequent navigations:
\* The \*\*RSC Payload\*\* is prefetched and cached for instant navigation.
\* \*\*Client Components\*\* are rendered entirely on the client, without the server-rendered HTML.
## Examples
### Using Client Components
You can create a Client Component by adding the [`"use client"`](https://react.dev/reference/react/use-client) directive at the top of the file, above your imports.
```tsx filename="app/ui/counter.tsx" highlight={1} switcher
'use client'
import { useState } from 'react'
export default function Counter() {
const [count, setCount] = useState(0)
return (

{count} likes

 setCount(count + 1)}>Click me

)
}
```
```jsx filename="app/ui/counter.js" highlight={1} switcher
'use client'
import { useState } from 'react'
export default function Counter() {
const [count, setCount] = useState(0)
return (

{count} likes

 setCount(count + 1)}>Click me

)
}
```
`"use client"` is used to declare a \*\*boundary\*\* between the Server and Client module graphs (trees).
Once a file is marked with `"use client"`, \*\*all of its imports and the components it directly renders are included in the client bundle\*\*. This means you don’t need to add the directive to every component that is intended for the client.
This behavior applies to components that are part of the Client Component’s [module graph](/docs/app/glossary#module-graph), which includes the modules it imports and the components it renders directly. It does not apply to Server Components passed as children or other props. Those components are not imported into the Client Component’s module graph. They are rendered on the server and passed to the Client Component as rendered output.
See [Interleaving Server and Client Components](/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components) for how Server and Client Components can be combined.
### Reducing JS bundle size
To reduce the size of your client JavaScript bundles, add `'use client'` to specific interactive components instead of marking large parts of your UI as Client Components.
For example, the `` component contains mostly static elements like a logo and navigation links, but includes an interactive search bar. `` is interactive and needs to be a Client Component, however, the rest of the layout can remain a Server Component.
```tsx filename="app/layout.tsx" highlight={12} switcher
// Client Component
import Search from './search'
// Server Component
import Logo from './logo'
// Layout is a Server Component by default
export default function Layout({ children }: { children: React.ReactNode }) {
return (
<>
{children}
)
}
```
```jsx filename="app/layout.js" highlight={12} switcher
// Client Component
import Search from './search'
// Server Component
import Logo from './logo'
// Layout is a Server Component by default
export default function Layout({ children }) {
return (
<>
{children}
)
}
```
```tsx filename="app/ui/search.tsx" highlight={1} switcher
'use client'
export default function Search() {
// ...
}
```
```jsx filename="app/ui/search.js" highlight={1} switcher
'use client'
export default function Search() {
// ...
}
```
### Passing data from Server to Client Components
You can pass data from Server Components to Client Components using props.
```tsx filename="app/[id]/page.tsx" highlight={1,12} switcher
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'
export default async function Page({
params,
}: {
params: Promise<{ id: string }>
}) {
const { id } = await params
const post = await getPost(id)
return
}
```
```jsx filename="app/[id]/page.js" highlight={1,7} switcher
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'
export default async function Page({ params }) {
const post = await getPost(params.id)
return
}
```
```tsx filename="app/ui/like-button.tsx" highlight={1} switcher
'use client'
export default function LikeButton({ likes }: { likes: number }) {
// ...
}
```
```jsx filename="app/ui/like-button.js" highlight={1} switcher
'use client'
export default function LikeButton({ likes }) {
// ...
}
```
Alternatively, you can stream data from a Server Component to a Client Component with the [`use` API](https://react.dev/reference/react/use). See an [example](/docs/app/getting-started/fetching-data#streaming-data-with-the-use-api).
> \*\*Good to know\*\*: Props passed to Client Components need to be [serializable](https://react.dev/reference/react/use-server#serializable-parameters-and-return-values) by React.
### Interleaving Server and Client Components
You can pass Server Components as a prop to a Client Component. This allows you to visually nest server-rendered UI within Client components.
A common pattern is to use `children` to create a \*slot\* in a ``. For example, a `` component that fetches data on the server, inside a `` component that uses client state to toggle visibility.
```tsx filename="app/ui/modal.tsx" switcher
'use client'
export default function Modal({ children }: { children: React.ReactNode }) {
return

{children}

}
```
```jsx filename="app/ui/modal.js" switcher
'use client'
export default function Modal({ children }) {
return

{children}

}
```
Then, in a parent Server Component (e.g.``), you can pass a `` as the child of the ``:
```tsx filename="app/page.tsx" highlight={7} switcher
import Modal from './ui/modal'
import Cart from './ui/cart'
export default function Page() {
return (

)
}
```
```jsx filename="app/page.js" highlight={7} switcher
import Modal from './ui/modal'
import Cart from './ui/cart'
export default function Page() {
return (

)
}
```
In this pattern, Server Components are rendered on the server ahead of time, even when passed as props to Client Components. The React Server Component Payload contains the rendered result of those Server Components, plus placeholders for where Client Components should be rendered and references to their JavaScript files.
### Context providers
[React context](https://react.dev/learn/passing-data-deeply-with-context) is commonly used to share global state like the current theme. However, React context is not supported in Server Components.
To use context, create a Client Component that accepts `children`:
```tsx filename="app/theme-provider.tsx" switcher
'use client'
import { createContext } from 'react'
export const ThemeContext = createContext({})
export default function ThemeProvider({
children,
}: {
children: React.ReactNode
}) {
return {children}
}
```
```jsx filename="app/theme-provider.js" switcher
'use client'
import { createContext } from 'react'
export const ThemeContext = createContext({})
export default function ThemeProvider({ children }) {
return {children}
}
```
Then, import it into a Server Component (e.g. `layout`):
```tsx filename="app/layout.tsx" switcher
import ThemeProvider from './theme-provider'
export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (
{children}
)
}
```
```jsx filename="app/layout.js" switcher
import ThemeProvider from './theme-provider'
export default function RootLayout({ children }) {
return (
{children}
)
}
```
Your Server Component will now be able to directly render your provider, and all other Client Components throughout your app will be able to consume this context.
> \*\*Good to know\*\*: You should render providers as deep as possible in the tree – notice how `ThemeProvider` only wraps `{children}` instead of the entire `` document. This makes it easier for Next.js to optimize the static parts of your Server Components.
### Third-party components
When using a third-party component that relies on client-only features, you can wrap it in a Client Component to ensure it works as expected.
For example, the `` can be imported from the `acme-carousel` package. This component uses `useState`, but it doesn't yet have the `"use client"` directive.
If you use `` within a Client Component, it will work as expected:
```tsx filename="app/gallery.tsx" switcher
'use client'
import { useState } from 'react'
import { Carousel } from 'acme-carousel'
export default function Gallery() {
const [isOpen, setIsOpen] = useState(false)
return (

setIsOpen(true)}>View pictures
{/\* Works, since Carousel is used within a Client Component \*/}
{isOpen && }

)
}
```
```jsx filename="app/gallery.js" switcher
'use client'
import { useState } from 'react'
import { Carousel } from 'acme-carousel'
export default function Gallery() {
const [isOpen, setIsOpen] = useState(false)
return (

setIsOpen(true)}>View pictures
{/\* Works, since Carousel is used within a Client Component \*/}
{isOpen && }

)
}
```
However, if you try to use it directly within a Server Component, you'll see an error. This is because Next.js doesn't know `` is using client-only features.
To fix this, you can wrap third-party components that rely on client-only features in your own Client Components:
```tsx filename="app/carousel.tsx" switcher
'use client'
import { Carousel } from 'acme-carousel'
export default Carousel
```
```jsx filename="app/carousel.js" switcher
'use client'
import { Carousel } from 'acme-carousel'
export default Carousel
```
Now, you can use `` directly within a Server Component:
```tsx filename="app/page.tsx" switcher
import Carousel from './carousel'
export default function Page() {
return (

View pictures

{/\* Works, since Carousel is a Client Component \*/}

)
}
```
```jsx filename="app/page.js" switcher
import Carousel from './carousel'
export default function Page() {
return (

View pictures

{/\* Works, since Carousel is a Client Component \*/}

)
}
```
> \*\*Advice for Library Authors\*\*
>
> If you’re building a component library, add the `"use client"` directive to entry points that rely on client-only features. This lets your users import components into Server Components without needing to create wrappers.
>
> It's worth noting some bundlers might strip out `"use client"` directives. You can find an example of how to configure esbuild to include the `"use client"` directive in the [React Wrap Balancer](https://github.com/shuding/react-wrap-balancer/blob/main/tsup.config.ts#L10-L13) and [Vercel Analytics](https://github.com/vercel/analytics/blob/main/packages/web/tsup.config.js#L26-L30) repositories.
### Preventing environment poisoning
JavaScript modules can be shared between both Server and Client Components modules. This means it's possible to accidentally import server-only code into the client. For example, consider the following function:
```ts filename="lib/data.ts" switcher
export async function getData() {
const res = await fetch('https://external-service.com/data', {
headers: {
authorization: process.env.API\_KEY,
},
})
return res.json()
}
```
```js filename="lib/data.js" switcher
export async function getData() {
const res = await fetch('https://external-service.com/data', {
headers: {
authorization: process.env.API\_KEY,
},
})
return res.json()
}
```
This function contains an `API\_KEY` that should never be exposed to the client.
In Next.js, only environment variables prefixed with `NEXT\_PUBLIC\_` are included in the client bundle. If variables are not prefixed, Next.js replaces them with an empty string.
As a result, even though `getData()` can be imported and executed on the client, it won't work as expected.
To prevent accidental usage in Client Components, you can use the [`server-only` package](https://www.npmjs.com/package/server-only).
Then, import the package into a file that contains server-only code:
```js filename="lib/data.js"
import 'server-only'
export async function getData() {
const res = await fetch('https://external-service.com/data', {
headers: {
authorization: process.env.API\_KEY,
},
})
return res.json()
}
```
Now, if you try to import the module into a Client Component, there will be a build-time error.
The corresponding [`client-only` package](https://www.npmjs.com/package/client-only) can be used to mark modules that contain client-only logic like code that accesses the `window` object.
In Next.js, installing `server-only` or `client-only` is \*\*optional\*\*. However, if your linting rules flag extraneous dependencies, you may install them to avoid issues.
```bash package="npm"
npm install server-only
```
```bash package="yarn"
yarn add server-only
```
```bash package="pnpm"
pnpm add server-only
```
```bash package="bun"
bun add server-only
```
Next.js handles `server-only` and `client-only` imports internally to provide clearer error messages when a module is used in the wrong environment. The contents of these packages from NPM are not used by Next.js.
Next.js also provides its own type declarations for `server-only` and `client-only`, for TypeScript configurations where [`noUncheckedSideEffectImports`](https://www.typescriptlang.org/tsconfig/#noUncheckedSideEffectImports) is active.
## Next Steps
Learn more about the APIs mentioned in this page.
- [use client](/docs/app/api-reference/directives/use-client)
- Learn how to use the use client directive to render a component on the client.
---
For a semantic overview of all documentation, see [/docs/sitemap.md](/docs/sitemap.md)
For an index of all available documentation, see [/docs/llms.txt](/docs/llms.txt)
