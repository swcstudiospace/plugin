# Account API

Source: https://docs.parallel.ai/integrations/account-api.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Account API
> Authenticate with the Parallel Account API using device-based OAuth 2.0

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

The \*\*Account API\*\* lets your application call Parallel programmatically on behalf of a user without prompting them to paste an API key. Authentication uses the [OAuth 2.0 Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628) (RFC 8628), which is designed for clients without a browser or with limited input — CLIs, IDE plugins, IoT devices, and similar.
The flow produces an \*\*access token\*\* that you pass as a `Bearer` token on every Account API request. See the full endpoint reference in the \*\*Account API\*\* tab in the navigation.
The [\*\*Parallel CLI\*\*](/integrations/cli) handles the entire device-OAuth flow for you — register, device code, polling, refresh, and revoke — and exposes every Account API endpoint as a regular CLI command. If you don't need to embed the flow in your own application, the CLI is the fastest way to use the Account API. The rest of this page describes what the CLI does under the hood, for clients that need to implement it themselves.
## Base URL
All endpoints below are rooted at:
```
https://platform.parallel.ai
```
## Overview
The full lifecycle is:
1. \*\*Register your client\*\* once, to obtain a `client\_id`.
2. \*\*Request a device code\*\* to start an authorization session.
3. \*\*Prompt the user to verify\*\* in their browser using the verification URL and user code returned in step 2.
4. \*\*Poll the token endpoint\*\* until the user approves and you receive an `access\_token` and `refresh\_token`.
5. \*\*Call the Account API\*\* with `Authorization: Bearer `.
6. \*\*Refresh\*\* the access token when it expires, or \*\*revoke\*\* the refresh token when the user signs out.
The `access\_token` returned by step 4 is what authorizes Account API calls. Without a valid bearer token, requests to the Account API will be rejected.
## 1. Register your client
Register your application once to receive a `client\_id`. Send a description of your client and the platform it runs on:
```http theme={"system"}
POST https://platform.parallel.ai/getServiceKeys/register
Content-Type: application/json
Accept: application/json
{
"client\_name": "your-app-name",
"platform": {
"machine": "arm64",
"os\_name": "posix",
"processor": "arm",
"release": "24.6.0",
"system": "Darwin",
"version": "Darwin Kernel Version 24.6.0"
}
}
```
The response contains a `client\_id` you reuse for all subsequent device-code requests from the same installation.
## 2. Request a device code
Start an authorization session by requesting a device code. The body is `application/x-www-form-urlencoded`:
```http theme={"system"}
POST https://platform.parallel.ai/getServiceKeys/device/code
Content-Type: application/x-www-form-urlencoded
Accept: application/json
client\_id={clientId}&scope={scope}
```
The response includes:
\* `device\_code` — opaque code your client uses when polling the token endpoint.
\* `user\_code` — short code the user types in the browser.
\* `verification\_uri` (and typically `verification\_uri\_complete`) — the URL to send the user to.
\* `expires\_in` — lifetime of the device code, in seconds.
\* `interval` — minimum number of seconds to wait between polls.
Display the `user\_code` and `verification\_uri` to the user, or open `verification\_uri\_complete` in their browser directly.
## 3. Poll for the access token
While the user completes verification in the browser, poll the token endpoint at the interval the server specified:
```http theme={"system"}
POST https://platform.parallel.ai/getServiceKeys/token
Content-Type: application/x-www-form-urlencoded
Accept: application/json
grant\_type=urn:ietf:params:oauth:grant-type:device\_code&client\_id={clientId}&device\_code={deviceCode}
```
Polling returns one of:
\* \*\*`authorization\_pending`\*\* — user has not yet approved. Wait `interval` seconds and try again.
\* \*\*`slow\_down`\*\* — you are polling too fast. Increase your interval.
\* \*\*`access\_denied`\*\* — the user rejected the request. Stop polling.
\* \*\*`expired\_token`\*\* — the device code expired. Restart from step 2.
\* \*\*Success\*\* — a JSON body containing `access\_token`, `refresh\_token`, `token\_type` (`Bearer`), and `expires\_in`.
Once you have the `access\_token`, you can call the Account API.
## 4. Call the Account API
Every Account API request must include an `Authorization` header with the access token from step 3:
```http theme={"system"}
GET https://api.parallel.ai/account/service/...
Authorization: Bearer {accessToken}
Accept: application/json
```
Requests without a valid bearer token are rejected. The endpoint catalogue is documented in the \*\*Account API\*\* tab in the navigation.
## 5. Refresh the access token
Access tokens are short-lived. When one expires, exchange your refresh token for a new pair without prompting the user again:
```http theme={"system"}
POST https://platform.parallel.ai/getServiceKeys/token
Content-Type: application/x-www-form-urlencoded
Accept: application/json
grant\_type=refresh\_token&refresh\_token={refreshToken}
```
The response contains a new `access\_token` and (typically) a new `refresh\_token`. Persist both and use the new pair going forward.
## 6. Revoke a refresh token
When the user signs out, or when you want to invalidate a session, revoke the refresh token:
```http theme={"system"}
POST https://platform.parallel.ai/getServiceKeys/token/revoke
Content-Type: application/x-www-form-urlencoded
Accept: application/json
refresh\_token={refreshToken}
```
After revocation, the refresh token can no longer be used to obtain new access tokens. Existing access tokens remain valid until they expire on their own.
## End-to-end example
```bash theme={"system"}
# 1. Register (once per installation)
curl -X POST https://platform.parallel.ai/getServiceKeys/register \
-H "Content-Type: application/json" \
-d '{
"client\_name": "my-app",
"platform": {
"machine": "arm64",
"os\_name": "posix",
"processor": "arm",
"release": "24.6.0",
"system": "Darwin",
"version": "Darwin Kernel Version 24.6.0"
}
}'
# 2. Request a device code
curl -X POST https://platform.parallel.ai/getServiceKeys/device/code \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "client\_id=$CLIENT\_ID&scope=$SCOPE"
# 3. Poll for the token (after user approves in browser)
curl -X POST https://platform.parallel.ai/getServiceKeys/token \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "grant\_type=urn:ietf:params:oauth:grant-type:device\_code&client\_id=$CLIENT\_ID&device\_code=$DEVICE\_CODE"
# 4. Call the Account API with the bearer token
curl https://api.parallel.ai/account/service/ \
-H "Authorization: Bearer $ACCESS\_TOKEN"
# 5. Refresh when expired
curl -X POST https://platform.parallel.ai/getServiceKeys/token \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "grant\_type=refresh\_token&refresh\_token=$REFRESH\_TOKEN"
# 6. Revoke on sign-out
curl -X POST https://platform.parallel.ai/getServiceKeys/token/revoke \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "refresh\_token=$REFRESH\_TOKEN"
```
