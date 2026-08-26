# Verify forwarded Passport tokens

Source: https://vercel.com/docs/passport/verify-identity

---
title: Verify forwarded Passport tokens
product: vercel
url: /docs/passport/verify-identity
canonical\_url: "https://vercel.com/docs/passport/verify-identity"
last\_updated: 2018-10-20
type: how-to
prerequisites:
- /docs/passport
related:
- /docs/passport/token-claims
- /docs/passport/additional-identity-scopes
summary: Verify a Passport token forwarded to your backend as a signed JWT.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Verify forwarded Passport tokens
When a Passport-protected app forwards a token to another backend, the receiving backend must verify it before trusting its claims. The `verifyIdentity()` helper verifies the Passport JWT signature, validates its Passport-specific claims, and checks that it came from the expected source project and environment.
Install `@vercel/passport` in the receiving service:
```bash package-manager
pnpm add @vercel/passport
```
`verifyIdentity()` is available in `@vercel/passport` version 0.1.3 and later.
Pass the owner ID, project ID, and environment from the Passport-protected deployment that minted the token. `verifyIdentity()` reads the bearer token directly from the request and always verifies it:
```js filename="app/api/do-stuff/route.js"
import { verifyIdentity } from '@vercel/passport';
const ownerId = 'team\_your\_team\_id\_here';
const projectId = 'prj\_your\_project\_id\_here';
const environment = 'production';
export async function POST(request) {
try {
const identity = await verifyIdentity(request, {
ownerId,
projectId,
environment,
});
return Response.json({
issuer: identity.payload.iss,
subject: identity.subject,
externalSubject: identity.externalSubject,
email: identity.email,
});
} catch {
return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
}
```
If the receiving backend runs in another Vercel project, keep validating the issuer and audience of the \*\*source\*\* Passport-protected deployment. Do not derive them from the receiving project.
## Verify tokens outside JavaScript
For non-JavaScript services, verify the Passport token as a signed JWT. The service should check:
- The signature with the Passport issuer's JSON Web Key Set (JWKS).
- The `iss` claim, such as `https://passport.vercel.com/your\_team\_slug\_here`.
- The `aud` claim for the expected owner, project, and environment.
- The `exp` and `nbf` claims.
- The `typ` claim equals `passport`.
- The `iss` and `sub` claims together identify the Passport visitor.
- The `project\_id`, `environment`, and optional `owner\_id` claims.
Passport exposes OpenID Connect discovery at `https://passport.vercel.com/your\_team\_slug\_here/.well-known/openid-configuration`. Its `jwks\_uri` is `https://passport.vercel.com/.well-known/jwks.json`.
See the [Passport token claims reference](/docs/passport/token-claims) for the complete schema and guidance on choosing a visitor identifier.
## Troubleshooting
### The bearer token is missing
Confirm that the source application sends the Passport token unchanged in `Authorization: Bearer `, then pass the receiving request to `verifyIdentity()`. Do not forward the decoded payload or the Passport session cookie value in another format.
### The source deployment does not match
Pass the owner ID, project ID, and environment of the Passport-protected \*\*source deployment\*\* that minted the token. A receiving backend in another project must not substitute its own project ID or environment.
### Signature verification fails
Confirm that `verifyIdentity()` receives the complete token and that the server can reach the Passport JWKS. Also confirm that the server clock is accurate so `exp` and `nbf` checks are reliable. Treat every verification failure as an unauthenticated request, and do not log the raw token.
### Expected identity claims are missing
Profile and additional claims are optional. Base the authorization decision on required, validated claims and deny access when a required claim is absent or has an unexpected type. See [Configure additional identity scopes](/docs/passport/additional-identity-scopes).
---
[View full sitemap](/docs/sitemap)
