# MCP tool registration ladder (ClippyOS)

Adding a new `domain.*` tool that Hermes (and the in-app agent) can call requires
touching 5 files in this order. Skipping any one leaves the tool invisible, untyped,
unauthorized, or dead at dispatch.

## 1. Catalog — `src/lib/autonomy.ts`

Append to `MCP_TOOLS`:
```ts
{ name: "domain.action", domain: "Domain", description: "...", scopes: ["read"] /* or ["write:social"] */ },
```
Scopes come from `API_KEY_SCOPES` (same file). Reads use `["read"]`; anything mutating
social/stream/storage uses `["write:social"]`. This entry is what `tools/list` exposes.

## 2. JSON Schema — `src/lib/server/mcp.server.ts`

Add to `TOOL_INPUTS`: `"domain.action": { type: "object", required: [...], properties: {...} }`.
Missing entries fall back to an empty object schema — the tool still "works" but is
undocumented to callers.

## 3. Scope gate — `src/lib/server/autonomy-actions.server.ts`

Add a branch before the catch-all (next to the existing `library.` branch):
```ts
if (action.startsWith("domain.")) {
  const write = action === "domain.mutating_thing";
  if (write && !need(actor, "write:social")) return deny();
  if (!write && !need(actor, "read")) return deny();
  const { handleDomainAction } = await import("@/lib/server/domain-tools.server");
  const data = await handleDomainAction(action, payload, `agent:${actor.keyId ?? actor.source}`);
  if (data === undefined) return { ok: false, status: 404, code: "UNKNOWN_ACTION", message: "Unknown action." };
  return { ok: true, data };
}
```

## 4. Handler — new `src/lib/server/<domain>-tools.server.ts`

Mirror `library-tools.server.ts`: a `handle<Domain>Action(action, payload, actorId)`
switch returning `undefined` for unknown actions. Sanitize all strings (`sanitizeText`),
clamp numbers, never return storage keys or secrets.

## 5. In-app agent exposure

- Allowlist: add names to `DOMAIN_AGENT_TOOLS` in `src/lib/agent.ts` (custom preset gets
  everything; preset skeletons get only their listed steps).
- Dispatch: in `src/lib/server/agent-tools.server.ts`, extend the `default:` case with
  `if (name.startsWith("domain.")) { ... }`. IMPORTANT: it must end in `throw new
  Error("UNKNOWN_ACTION")` on every path — the function's return type excludes undefined,
  and a bare `break` is a type error.
- LLM tool descriptions live in `AGENT_LLM_TOOLS` in the same file if the agent should
  see them with rich parameter docs.

## Conventions

- Naming: `stream.*` for Twitch VOD/clip records, `bridge.*` for the Dashboard↔Social
  Machine storage bridge, `library.*` for assets/renders.
- Addons gate: `addonIdForTool` in `src/lib/addons.ts` returns null for always-on core
  tools; only touch it when the tool belongs behind an optional addon.
- Verify with typecheck + full test run after all five edits.
