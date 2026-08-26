# Registering a dashboard route without the router plugin

`npm run typecheck` does NOT regenerate `src/routeTree.gen.ts`. Adding
`src/routes/_app/<name>.tsx` by hand requires patching the generated file in every
place the plugin would emit. Verified adding `/studio`.

## The 8 patch sites (in file order)

For a new route `/name` with import `AppNameRouteImport`, insert alphabetically among
the `_app` siblings (e.g. between `social` and `team`):

1. **Import block (top)**:
   `import { Route as AppNameRouteImport } from './routes/_app/name'`
2. **Route const**: after the sibling's `.update({...})` block:
   ```ts
   const AppNameRoute = AppNameRouteImport.update({
     id: '/name',
     path: '/name',
     getParentRoute: () => AppRoute,
   } as any)
   ```
3. **`FileRoutesByFullPath` interface**: `'/name': typeof AppNameRoute`
4. **`FileRoutesByTo` interface** (same shape): `'/name': typeof AppNameRoute`
5. **`FileRoutesById` interface**: `'/_app/name': typeof AppNameRoute`
6. **`fullPaths` union type**: `| '/name'` — NOTE: this union appears TWICE
   (`fullPaths` and `to`); a non-unique old_string will fail. Use replace_all or more context.
7. **`ids` union type**: `| '/_app/name'`
8. **Tail — two blocks**: `AppRouteChildren` interface entry
   (`AppNameRoute: typeof AppNameRoute`) AND the `AppRouteChildren` const object
   (`AppNameRoute: AppNameRoute,`). Both live near line 1220–1260.

## Symptom of a missed site

- Missed #3 (the `FileRoutesByPath` INTERFACE block, ~line 780, with
  `id:/path:/fullPath:/preLoaderRoute:/parentRoute:` fields): error
  `'/_app/name' is not assignable to parameter of type 'keyof FileRoutesByPath'`
  at the `createFileRoute("/_app/name")` call site.
- Grep `grep -n "name" src/routeTree.gen.ts` — a fully registered route appears 8+ times.

## Also update

- Sidebar nav: `src/lib/nav.ts` (icon imported from lucide-react there).
- UI verification: boot `npm run dev`, hit the route via an inline Playwright script
  (see repo-gotchas.md for why curl+grep is unreliable).
