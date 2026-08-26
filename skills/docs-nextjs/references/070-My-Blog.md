# My Blog

Source: https://nextjs.org/docs/app/getting-started/caching

---
title: Caching
description: Learn how to cache data and UI in Next.js
url: "https://nextjs.org/docs/app/getting-started/caching"
docs\_index: /docs/llms.txt
version: 16.2.12
lastUpdated: 2026-05-13
prerequisites:
- "Getting Started: /docs/app/getting-started"
related:
- app/getting-started/revalidating
- app/api-reference/directives/use-cache
- app/api-reference/config/next-config-js/cacheComponents
- app/guides/preserving-ui-state
---
> For an index of all Next.js documentation, see [/docs/llms.txt](/docs/llms.txt).
> This page covers caching with [Cache Components](/docs/app/api-reference/config/next-config-js/cacheComponents), enabled by setting [`cacheComponents: true`](/docs/app/api-reference/config/next-config-js/cacheComponents) in your `next.config.ts` file. If you're not using Cache Components, see the [Caching and Revalidating (Previous Model)](/docs/app/guides/caching-without-cache-components) guide.
Caching is a technique for storing the result of data fetching and other computations so that future requests for the same data can be served faster, without doing the work again.
## Enabling Cache Components
You can enable Cache Components by adding the [`cacheComponents`](/docs/app/api-reference/config/next-config-js/cacheComponents) option to your Next config file:
```ts filename="next.config.ts" highlight={4} switcher
import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
cacheComponents: true,
}
export default nextConfig
```
```js filename="next.config.js" highlight={3} switcher
/\*\* @type {import('next').NextConfig} \*/
const nextConfig = {
cacheComponents: true,
}
module.exports = nextConfig
```
> \*\*Good to know:\*\* When Cache Components is enabled, `GET` Route Handlers follow the same prerendering model as pages. See [Route Handlers with Cache Components](/docs/app/getting-started/route-handlers#with-cache-components) for details.
## Usage
The [`use cache`](/docs/app/api-reference/directives/use-cache) directive caches the return value of async functions and components. You can apply it at two levels:
\* \*\*Data-level\*\*: Cache a function that fetches or computes data (e.g., `getProducts()`, `getUser(id)`)
\* \*\*UI-level\*\*: Cache an entire component or page (e.g., `async function BlogPosts()`)
> Arguments and any closed-over values from parent scopes automatically become part of the [cache key](/docs/app/api-reference/directives/use-cache#cache-keys), which means different inputs will produce separate cache entries. This enables personalized or parameterized cached content. See [serialization requirements and constraints](/docs/app/api-reference/directives/use-cache#constraints) for details on what can be cached and how arguments work.
### Data-level caching
To cache an asynchronous function that fetches data, add the `use cache` directive at the top of the function body:
```tsx filename="app/lib/data.ts" highlight={3,4,5}
import { cacheLife } from 'next/cache'
export async function getUsers() {
'use cache'
cacheLife('hours')
return db.query('SELECT \* FROM users')
}
```
Data-level caching is useful when the same data is used across multiple components, or when you want to cache the data independently from the UI.
### UI-level caching
To cache an entire component, page, or layout, add the `use cache` directive at the top of the component or page body:
```tsx filename="app/page.tsx" highlight={1,4,5}
import { cacheLife } from 'next/cache'
export default async function Page() {
'use cache'
cacheLife('hours')
const users = await db.query('SELECT \* FROM users')
return (

{users.map((user) => (- {user.name}
))}
)
}
```
> If you add "`use cache`" at the top of a file, all exported functions in the file will be cached.
### Streaming uncached data
For components that fetch data from an asynchronous source such as an API, a database, or any other async operation, and require fresh data on every request, do not use `"use cache"`.
Instead, wrap the component in [``](https://react.dev/reference/react/Suspense) and provide a fallback UI. At request time, React renders the fallback first, then streams in the resolved content once the async work completes.
```tsx filename="page.tsx"
import { Suspense } from 'react'
async function LatestPosts() {
const data = await fetch('https://api.example.com/posts')
const posts = await data.json()
return (

{posts.map((post) => (- {post.title}
))}
)
}
export default function Page() {
return (
<>

# My Blog

Loading posts...}>
)
}
```
The fallback (`

Loading posts...

`) is included in the static shell, while the component's content streams in at request time.
`` provides a fallback UI while async work completes, but it does not itself opt a component into dynamic rendering. If a component only performs synchronous work, it will complete during prerendering regardless of whether it is wrapped in ``.
## Working with runtime APIs
Runtime APIs require information that is only available when a user makes a request. These include:
\* [`cookies`](/docs/app/api-reference/functions/cookies) - User's cookie data
\* [`headers`](/docs/app/api-reference/functions/headers) - Request headers
\* [`searchParams`](/docs/app/api-reference/file-conventions/page#searchparams-optional) - URL query parameters
\* [`params`](/docs/app/api-reference/file-conventions/page#params-optional) - Dynamic route parameters (unless at least one sample is provided via [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params)).
Components that access runtime APIs should be wrapped in ``:
```tsx filename="page.tsx"
import { cookies } from 'next/headers'
import { Suspense } from 'react'
async function UserGreeting() {
const cookieStore = await cookies()
const theme = cookieStore.get('theme')?.value || 'light'
return

Your theme: {theme}

}
export default function Page() {
return (
<>

# Dashboard

Loading...}>
)
}
```
### Passing runtime values to cached functions
You can extract values from runtime APIs and pass them as arguments to cached functions:
```tsx filename="app/profile/page.tsx"
import { cookies } from 'next/headers'
import { Suspense } from 'react'
export default function Page() {
return (
Loading...}>
)
}
// Component (not cached) reads runtime data
async function ProfileContent() {
const session = (await cookies()).get('session')?.value
return
}
// Cached component receives extracted value as a prop
async function CachedContent({ sessionId }: { sessionId: string }) {
'use cache'
// sessionId becomes part of the cache key
const data = await fetchUserData(sessionId)
return

{data}

}
```
At request time, `CachedContent` executes if no matching cache entry is found, and stores the result for future requests with the same `sessionId`.
By default, `use cache` stores entries [in-memory](/docs/app/api-reference/directives/use-cache#runtime-caching-considerations). In serverless environments where memory doesn't persist across requests, `CachedContent` may re-evaluate on every request. Consider [`'use cache: remote'`](/docs/app/api-reference/directives/use-cache-remote) for durable, shared caching.
## Working with non-deterministic operations
Operations like `Math.random()`, `Date.now()`, or `crypto.randomUUID()` produce different values each time they execute. Cache Components requires you to explicitly handle these.
\*\*To generate unique values per request\*\*, defer to request time by calling [`connection()`](/docs/app/api-reference/functions/connection) before these operations, and wrap the component in ``:
```tsx filename="page.tsx"
import { connection } from 'next/server'
import { Suspense } from 'react'
async function UniqueContent() {
await connection()
const uuid = crypto.randomUUID()
return

Request ID: {uuid}

}
export default function Page() {
return (
Loading...}>
)
}
```
Alternatively, you can \*\*cache the result\*\* so all users see the same value until revalidation:
```tsx filename="page.tsx"
export default async function Page() {
'use cache'
const buildId = crypto.randomUUID()
return

Build ID: {buildId}

}
```
## Working with deterministic operations
Operations like synchronous I/O, module imports, and pure computations can complete during prerendering. Components using only these operations have their rendered output automatically included in the static HTML shell.
```tsx filename="page.tsx"
import fs from 'node:fs'
export default async function Page() {
const content = fs.readFileSync('./config.json', 'utf-8')
const constants = await import('./constants.json')
const processed = JSON.parse(content).items.map((item) => item.value \* 2)
return (

# {constants.appName}

{processed.map((value, i) => (- {value}
))}

)
}
```
> \*\*Good to know:\*\* This includes queries to embedded databases with synchronous APIs, such as `better-sqlite3` or Node.js's built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html). If you need per-request data from a synchronous source, call [`connection()`](/docs/app/api-reference/functions/connection) before the query.
## How rendering works
At build time, Next.js renders your route's component tree. How each component is handled depends on the APIs it uses:
\* [`use cache`](#usage): the result is cached and included in the static shell
\* [``](#streaming-uncached-data): fallback UI is included in the static shell while the content streams at request time
\* [Deterministic operations](#working-with-deterministic-operations): like pure computations and module imports are automatically included in the static shell
This generates a static shell consisting of HTML for initial page loads and a serialized [RSC Payload](/docs/app/getting-started/server-and-client-components#on-the-server) for client-side navigation, ensuring the browser receives fully rendered content instantly whether users navigate directly to the URL or transition from another page.
![Partially re-rendered Product Page showing static nav and product information, and dynamic cart and recommended products](https://h8DxKfmAPhn8O0p3.public.blob.vercel-storage.com/learn/light/thinking-in-ppr.png)
This rendering approach is called \*\*Partial Prerendering (PPR)\*\*, and it's the default behavior with Cache Components.
> You can verify that a route was fully prerendered by checking the [build output summary](/docs/app/api-reference/cli/next#next-build-options). Alternatively, see what content was added to the static shell of any page by viewing the page source in your browser.
![Diagram showing partially rendered page on the client, with loading UI for chunks that are being streamed.](https://h8DxKfmAPhn8O0p3.public.blob.vercel-storage.com/docs/light/server-rendering-with-streaming.png)
Next.js requires you to explicitly handle components that can't complete during prerendering. If they aren't wrapped in `` or marked with `use cache`, you'll see an [`Uncached data was accessed outside of `](https://nextjs.org/docs/messages/blocking-route) error during development and build time.
> \*\*🎥 Watch:\*\* Why Partial Prerendering and how it works → [YouTube (10 minutes)](https://www.youtube.com/watch?v=MTcPrTIBkpA).
### Opting out of the static shell
Placing a `` boundary with an empty fallback above the document body in your Root Layout causes the entire app to defer to request time. Because the fallback is empty, there is no static shell to send immediately, so every request blocks until the page is fully rendered. To limit this to specific routes, use [multiple root layouts](/docs/app/api-reference/file-conventions/layout#root-layout).
```tsx filename="app/layout.tsx" highlight={1,10-12}
import { Suspense } from 'react'
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
> \*\*Good to know\*\*: This same pattern applies when `generateViewport` accesses uncached dynamic data. See [Viewport with Cache Components](/docs/app/api-reference/functions/generate-viewport#with-cache-components) for a detailed example.
### Putting it all together
Here's a complete example showing static content, cached dynamic content, and streaming dynamic content working together on a single page:
```tsx filename="app/blog/page.tsx"
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag, updateTag } from 'next/cache'
import Link from 'next/link'
export default function BlogPage() {
return (
<>
{/\* Static content - prerendered automatically \*/}

# Our Blog

{/\* Cached dynamic content - included in the static shell \*/}
{/\* Runtime dynamic content - streams at request time \*/}
Loading your preferences...}>
{/\* Mutation - server action that revalidates the cache \*/}
Loading...}>
)
}
// Everyone sees the same blog posts (revalidated every hour)
async function BlogPosts() {
'use cache'
cacheLife('hours')
cacheTag('posts')
const res = await fetch('https://api.vercel.app/blog')
const posts = await res.json()
return (

## Latest Posts

{posts.slice(0, 5).map((post: any) => (- ### {post.title}

  By {post.author} on {post.date}
))}

)
}
// Personalized per user based on their cookie
async function UserPreferences() {
const theme = (await cookies()).get('theme')?.value || 'light'
const favoriteCategory = (await cookies()).get('category')?.value
return (
)
}
// Admin-only form that creates a post and revalidates the cache
async function CreatePost() {
const isAdmin = (await cookies()).get('role')?.value === 'admin'
if (!isAdmin) return null
async function createPost(formData: FormData) {
'use server'
await db.post.create({ data: { title: formData.get('title') } })
updateTag('posts')
}
return (

Publish
)
}
```
During prerendering, the header (static) and blog posts (cached with `use cache`) become part of the static shell along with the fallback UI for user preferences. Only the personalized preferences stream in at request time. When an admin publishes a new post, the [`updateTag`](/docs/app/getting-started/revalidating#updatetag) call immediately expires the blog posts cache so the next visitor sees it.
> \*\*Good to know:\*\* `generateMetadata` and `generateViewport` track runtime data access separately from the page. See [Metadata with Cache Components](/docs/app/api-reference/functions/generate-metadata#with-cache-components) and [Viewport with Cache Components](/docs/app/api-reference/functions/generate-viewport#with-cache-components) for how to handle this.
## Next Steps
Learn more about revalidation and the APIs mentioned on this page.
- [Revalidating](/docs/app/getting-started/revalidating)
- Learn how to revalidate cached data using time-based and on-demand strategies.
- [use cache](/docs/app/api-reference/directives/use-cache)
- Learn how to use the "use cache" directive to cache data in your Next.js application.
- [cacheComponents](/docs/app/api-reference/config/next-config-js/cacheComponents)
- Learn how to enable the cacheComponents flag in Next.js.
- [Preserving UI state](/docs/app/guides/preserving-ui-state)
- Learn how React's Activity component preserves UI state across navigations in Next.js and how to control what resets.
---
For a semantic overview of all documentation, see [/docs/sitemap.md](/docs/sitemap.md)
For an index of all available documentation, see [/docs/llms.txt](/docs/llms.txt)
