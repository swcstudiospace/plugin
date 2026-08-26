# Webhook Setup

Source: https://docs.parallel.ai/resources/webhook-setup.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Webhook Setup
> Guide to configuring and verifying webhooks for Parallel APIs

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

## Overview
Webhooks allow you to receive real-time notifications when events occur in your Parallel API operations, eliminating the need for constant polling. Our webhooks follow [standard webhook conventions](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md) to ensure security and interoperability.
## Setup
### 1. Record your webhook secret
Go to \*\*Settings → Webhooks\*\* to view your account webhook secret. You'll need this to verify webhook signatures.
Keep your webhook secret secure. Anyone with access to your secret can forge webhook requests.
### 2. Configure webhook in API request
When creating a task run or FindAll run, include a `webhook` parameter in your request:
```json theme={"system"}
{
"webhook": {
"url": "https://your-domain.com/webhooks/parallel",
"event\_types": ["event.type"]
}
}
```
| Parameter | Type | Required | Description |
| ------------- | -------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `url` | string | Yes | Your webhook endpoint URL. Can be any domain. |
| `event\_types` | array\[string] | Yes | Array of event types to subscribe to. See API-specific documentation for available event types. |
### 3. Webhook request headers
Your webhook endpoint will receive requests with these headers:
\* `webhook-id`: Unique identifier for each webhook event
\* `webhook-timestamp`: Unix timestamp in seconds
\* `webhook-signature`: One or more versioned signatures (e.g., `v1,`)
```json theme={"system"}
{
"Content-Type": "application/json",
"webhook-id": "whevent\_abc123def456",
"webhook-timestamp": "1751498975",
"webhook-signature": "v1,K5oZfzN95Z9UVu1EsfQmfVNQhnkZ2pj9o9NDN/H/pI4="
}
```
Signatures are space-delimited per the Standard Webhooks format. Under normal circumstances there will only be one signature, but there may be multiple if you rotate your webhook secret without immediately expiring the old secrets.
```text theme={"system"}
webhook-signature: v1,BASE64SIG\_A v1,BASE64SIG\_B
```
## Security & Verification
### HMAC Signature Verification
Webhook signing follows the [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md) specification (as implemented by [Svix](https://docs.svix.com/receiving/verifying-payloads/how-manual)). Webhook requests are signed using HMAC-SHA256 with \*\*standard Base64 (RFC 4648) encoding with padding\*\*. The signature header is formatted as `v1,` where `` is computed over the payload below:
```text theme={"system"}
..
```
Where:
\* ``: The value of the `webhook-id` header
\* ``: The value of the `webhook-timestamp` header
\* ``: The exact JSON body of the webhook request
Per the Standard Webhooks specification, the `whsec\_` prefix is stripped from your webhook secret and the remainder is Base64-decoded before being used as the HMAC key. For example, a secret of `whsec\_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw` becomes `MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw`, which is then Base64-decoded to obtain the raw signing key.
You must parse the version and the signature before verifying. The `webhook-signature` header uses space-delimited signatures; check each signature until one matches.
You can use any [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks#implementations)-compatible library (such as the [Svix libraries](https://github.com/svix/svix-webhooks)) to verify signatures without implementing verification manually.
### Verification Examples
```typescript TypeScript (Node.js) theme={"system"}
import crypto from "crypto";
// Per Standard Webhooks: strip the `whsec\_` prefix and Base64-decode the
// remainder to obtain the raw HMAC signing key.
function getSigningKey(secret: string): Buffer {
const trimmed = secret.startsWith("whsec\_") ? secret.slice("whsec\_".length) : secret;
return Buffer.from(trimmed, "base64");
}
function computeSignature(
secret: string,
webhookId: string,
webhookTimestamp: string,
body: string | Buffer
): string {
const payload = `${webhookId}.${webhookTimestamp}.${body.toString()}`;
const key = getSigningKey(secret);
const digest = crypto.createHmac("sha256", key).update(payload).digest();
return digest.toString("base64"); // standard Base64 with padding
}
function isValidSignature(
webhookSignatureHeader: string,
expectedSignature: string
): boolean {
// Header may contain multiple space-delimited entries; each is "v1,"
const signatures = webhookSignatureHeader.split(" ");
for (const part of signatures) {
const [, sig] = part.split(",", 2);
if (
crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSignature))
) {
return true;
}
}
return false;
}
// Example usage in an Express endpoint
import express from "express";
const app = express();
app.post(
"/webhooks/parallel",
express.raw({ type: "application/json" }),
(req, res) => {
const webhookId = req.headers["webhook-id"] as string;
const webhookTimestamp = req.headers["webhook-timestamp"] as string;
const webhookSignature = req.headers["webhook-signature"] as string;
const secret = process.env.PARALLEL\_WEBHOOK\_SECRET!;
const expectedSignature = computeSignature(
secret,
webhookId,
webhookTimestamp,
req.body
);
if (!isValidSignature(webhookSignature, expectedSignature)) {
return res.status(401).send("Invalid signature");
}
// Parse and process the webhook payload
const payload = JSON.parse(req.body.toString());
console.log("Webhook received:", payload);
// Your business logic here
res.status(200).send("OK");
}
);
```
```typescript TypeScript (Web API / Cloudflare Workers) theme={"system"}
// Example for environments without Node.js crypto module
// Per Standard Webhooks: strip the `whsec\_` prefix and Base64-decode the
// remainder to obtain the raw HMAC signing key.
function getSigningKey(secret: string): Uint8Array {
const trimmed = secret.startsWith("whsec\_") ? secret.slice("whsec\_".length) : secret;
const binary = atob(trimmed);
const bytes = new Uint8Array(binary.length);
for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
return bytes;
}
async function computeSignature(
secret: string,
webhookId: string,
webhookTimestamp: string,
body: string
): Promise {
const payload = `${webhookId}.${webhookTimestamp}.${body}`;
const encoder = new TextEncoder();
const key = await crypto.subtle.importKey(
"raw",
getSigningKey(secret),
{ name: "HMAC", hash: "SHA-256" },
false,
["sign"]
);
const signature = await crypto.subtle.sign(
"HMAC",
key,
encoder.encode(payload)
);
// Convert to base64
const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
return base64;
}
function isValidSignature(
webhookSignatureHeader: string,
expectedSignature: string
): boolean {
const signatures = webhookSignatureHeader.split(" ");
for (const part of signatures) {
const [, sig] = part.split(",", 2);
if (sig === expectedSignature) {
return true;
}
}
return false;
}
// Example Cloudflare Worker
export default {
async fetch(request: Request): Promise {
if (request.method !== "POST") {
return new Response("Method not allowed", { status: 405 });
}
const webhookId = request.headers.get("webhook-id")!;
const webhookTimestamp = request.headers.get("webhook-timestamp")!;
const webhookSignature = request.headers.get("webhook-signature")!;
const secret = "your-webhook-secret";
const body = await request.text();
const expectedSignature = await computeSignature(
secret,
webhookId,
webhookTimestamp,
body
);
if (!isValidSignature(webhookSignature, expectedSignature)) {
return new Response("Invalid signature", { status: 401 });
}
const payload = JSON.parse(body);
console.log("Webhook received:", payload);
return new Response("OK", { status: 200 });
},
};
```
```python Python theme={"system"}
import base64
import hashlib
import hmac
# Per Standard Webhooks: strip the `whsec\_` prefix and Base64-decode the
# remainder to obtain the raw HMAC signing key.
def get\_signing\_key(secret: str) -> bytes:
trimmed = secret[len("whsec\_"):] if secret.startswith("whsec\_") else secret
return base64.b64decode(trimmed)
def compute\_signature(secret: str, webhook\_id: str, webhook\_timestamp: str, body: bytes) -> str:
payload = f"{webhook\_id}.{webhook\_timestamp}.{body.decode()}".encode()
key = get\_signing\_key(secret)
digest = hmac.new(key, payload, hashlib.sha256).digest()
return base64.b64encode(digest).decode() # standard Base64 with padding
def is\_valid\_signature(webhook\_signature\_header: str, expected\_signature: str) -> bool:
# Header may contain multiple space-delimited entries; each is "v1,"
for part in webhook\_signature\_header.split():
\_, sig = part.split(",", 1)
if hmac.compare\_digest(sig, expected\_signature):
return True
return False
# Example usage
webhook\_secret = "your\_webhook\_secret\_from\_settings"
webhook\_id = request.headers.get("webhook-id")
webhook\_timestamp = request.headers.get("webhook-timestamp")
signature\_header = request.headers.get("webhook-signature")
body = request.get\_data()
expected\_sig = compute\_signature(webhook\_secret, webhook\_id, webhook\_timestamp, body)
if is\_valid\_signature(signature\_header, expected\_sig):
print("✓ Signature verified")
else:
print("✗ Signature verification failed")
```
```bash Bash theme={"system"}
#!/bin/bash
# Inputs: HEADER\_SIGNATURE (e.g. "v1,BASE64..."), WEBHOOK\_ID, WEBHOOK\_TIMESTAMP, PAYLOAD (minified JSON), SECRET
RECEIVED\_SIGNATURE=$(printf "%s" "$HEADER\_SIGNATURE" | cut -d',' -f2)
TO\_SIGN="$WEBHOOK\_ID.$WEBHOOK\_TIMESTAMP.$PAYLOAD"
# Per Standard Webhooks: strip the `whsec\_` prefix and Base64-decode the
# remainder to obtain the raw HMAC signing key (passed to openssl as hex).
SIGNING\_KEY\_HEX=$(printf "%s" "${SECRET#whsec\_}" | base64 -d | xxd -p -c 256 | tr -d '\n')
EXPECTED\_SIGNATURE=$(printf "%s" "$TO\_SIGN" | openssl dgst -sha256 -mac HMAC -macopt "hexkey:$SIGNING\_KEY\_HEX" -binary | base64 | tr -d '\n')
if [ "$EXPECTED\_SIGNATURE" = "$RECEIVED\_SIGNATURE" ]; then
echo "✅ Signature verification successful"
else
echo "❌ Signature verification failed"
exit 1
fi
```

\*\*Backward compatibility.\*\* Prior to the switch to the Standard Webhooks specification, Parallel signed webhooks using the entire secret (including the `whsec\_` prefix) as the raw HMAC key. For existing customers, this legacy signing scheme continues to be supported so that webhook handlers written against the previous format keep working. New integrations should follow the Standard Webhooks specification described above.
## Retry Policy
Webhook delivery uses the following retry configuration:
\* \*\*Initial delay\*\*: 5 seconds
\* \*\*Backoff strategy\*\*: Exponential backoff (doubles per failed request)
\* \*\*Maximum retries\*\*: Multiple attempts over 48 hours
After exhausting all retry attempts, webhook delivery for that event is terminated.
## Best Practices
### 1. Always Return 2xx Status
Your webhook endpoint should return a 2xx HTTP status code to acknowledge receipt. Any other status code will trigger retries.
### 2. Verify Signatures
Always verify HMAC signatures using your account webhook secret from \*\*Settings → Webhooks\*\* to ensure webhook authenticity. Ensure that you are calculating signatures using the proper process as shown above.
### 3. Handle Duplicates
Although not common, duplicate events may be sent to the configured webhook URL. Ensure your webhook handler can detect and safely ignore duplicate events using the `webhook-id` header.
### 4. Process Asynchronously
Process webhook events asynchronously to avoid timeouts and ensure quick response times. For example, immediately return a 200 response, then queue the event for background processing.
### 5. Rotate Secrets Carefully
When rotating webhook secrets in \*\*Settings → Webhooks\*\*, consider keeping the old secret active temporarily to avoid verification failures during the transition period.
### 6. Monitor Webhook Health
Track webhook delivery failures and response times. Set up alerts for repeated failures that might indicate issues with your endpoint.
## API-Specific Documentation
For details on specific webhook events and payloads for each API:
\* \*\*[Task API Webhooks](/task-api/webhooks)\*\*: Task run completion events
\* \*\*[FindAll Webhooks](/findall-api/features/findall-webhook)\*\*: Candidate and run events
\* \*\*[Monitor API Webhooks](/monitor-api/monitor-webhooks)\*\*: Events and completions
