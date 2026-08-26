# Configuring workload identity federation for Microsoft Azure

Source: https://developers.openai.com/api/docs/guides/workload-identity-federation/microsoft-azure.md

# Configuring workload identity federation for Microsoft Azure
> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.
Use Microsoft Azure as a Workload Identity Provider in either of these scenarios:
- \*\*Azure managed identity:\*\* Exchange a Microsoft Entra ID access token issued for a managed identity for a short-lived OpenAI access token.
- \*\*AKS:\*\* Exchange a projected Azure Kubernetes Service (AKS) service account token for a short-lived OpenAI access token.
## Azure managed identity
Azure managed identities let Azure-hosted workloads request Microsoft Entra tokens without storing long-lived secrets. In OpenAI workload identity federation, the managed identity token is the subject token that OpenAI validates before issuing an OpenAI access token.
### Setting up Azure managed identity
Create or use a Microsoft Entra application registration that represents the token audience OpenAI should trust. Configure its \*\*Application ID URI\*\*; this URI is the `resource` value your workload requests from Azure Instance Metadata Service (IMDS), and it appears as the `aud` claim in the issued token. For the Microsoft setup steps, see the Microsoft Entra guide to [create a new Entra ID application and service principal](https://learn.microsoft.com/en-au/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-azure-ad-and-create-a-service-principal).
The Application ID URI configured in Microsoft Entra ID, the IMDS `resource`
parameter, the resulting token's `aud` claim, and the OpenAI Workload Identity
Provider audience must all match.
[Create](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal?pivots=identity-mi-methods-azp) a managed identity, then [assign](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#user-assigned-managed-identity) that managed identity to the Azure resource running your application, such as a virtual machine. The resource must be able to call IMDS at runtime. For Azure setup details, see Microsoft's [managed identities overview](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview) and the relevant Azure resource documentation for assigning the identity.
### Getting an Azure managed identity token
From the Azure resource with the managed identity assigned, request a token from IMDS with the Application ID URI as the `resource` parameter. This token is the subject token that OpenAI exchanges for an OpenAI-issued access token.
```bash
APPLICATION\_ID\_URI="api://"
TOKEN=$(curl -sS -G -H "Metadata: true" \
"http://169.254.169.254/metadata/identity/oauth2/token" \
--data-urlencode "api-version=2018-02-01" \
--data-urlencode "resource=${APPLICATION\_ID\_URI}" \
| jq -r .access\_token)
export TOKEN
```
If the resource has multiple user-assigned managed identities, add the `client\_id`, `object\_id`, or `msi\_res\_id` query parameter for the managed identity you want to use. Microsoft documents the IMDS token request parameters in [Use managed identities on a virtual machine to acquire access token](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/how-to-use-vm-token).
### Verify the token
Before configuring workload identity federation, export the Microsoft Entra token as `TOKEN`, then run this script locally to inspect its claims:
```python
import base64
import json
import os
payload = os.environ["TOKEN"].split(".")[1]
payload += "=" \* (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe\_b64decode(payload)), indent=2))
```
This command decodes the JWT payload without verifying the token signature. Use a local decoder for production tokens, and avoid pasting production tokens into third-party tools.
A decoded Microsoft Entra ID managed identity token will look similar to:
```json
{
"iss": "https://login.microsoftonline.com/11111111-2222-3333-4444-555555555555/v2.0",
"aud": "api://00000000-1111-2222-3333-444444444444",
"tid": "11111111-2222-3333-4444-555555555555",
"appid": "22222222-3333-4444-5555-666666666666",
"oid": "33333333-4444-5555-6666-777777777777",
"sub": "33333333-4444-5555-6666-777777777777",
"xms\_mirid": "/subscriptions//resourcegroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/openai-wif-vm",
"iat": 1716235422,
"exp": 1716239022
}
```
Verify the claims you plan to configure in OpenAI:
- `iss`: Use the exact issuer value from the token. The issuer may be `https://login.microsoftonline.com//v2.0`, but do not assume that suffix.
- `aud`: Must match the Application ID URI, the IMDS `resource` parameter, and the OpenAI Workload Identity Provider audience.
- `tid`: The Microsoft Entra tenant ID.
- `appid`: The managed identity's application/client ID, when present.
Managed identity tokens can also contain claims such as `azp`, `oid`, `sub`, or `xms\_mirid`. Use the decoded token as the source of truth, and choose claims that identify the exact managed identity and resource boundary you trust.
Use the decoded payload to compare the token you received with the issuer, audience, and mapping values configured in OpenAI. Most configuration issues are visible in the `iss`, `aud`, `tid`, and managed identity claims before you exchange the token.
### Setting up workload identity federation
Create a Workload Identity Provider in OpenAI for the Microsoft Entra ID issuer, then add a service account mapping that matches stable claims from the managed identity token.
Configure the Workload Identity Provider first, then create the service account mapping.
#### Set up the Workload Identity Provider
1. \*\*Create the Workload Identity Provider.\*\* Set \*\*Name\*\* to a unique value, such as `azure-managed-identity-prod`. Use \*\*Description\*\*, such as `Production Azure managed identity workloads`, to help admins identify the provider.
2. \*\*Set the issuer and audience.\*\* Set \*\*OIDC Issuer URL\*\* to the exact value of the token's `iss` claim. Obtain a sample managed identity token and inspect its claims first. For example, the issuer may be `https://login.microsoftonline.com//v2.0`. Set \*\*Audience\*\* to the Microsoft Entra Application ID URI you configured, such as `api://`. This value must match the token's `aud` claim.
3. \*\*Use Microsoft Entra token verification.\*\* Leave \*\*Use uploaded JWKS for token verification\*\* disabled. OpenAI uses Microsoft Entra issuer metadata and JWKS to verify the managed identity token.
4. \*\*Add attribute transformations if you need derived mapping attributes.\*\* For example, enter `managed\_identity\_client\_id` with expression `assertion.appid` to create `openai.managed\_identity\_client\_id` from the managed identity application/client ID claim. The dashboard applies the `openai.` prefix automatically. Raw token claims that already start with `openai.` are ignored for `openai.` mapping keys unless a matching transformation is configured.
#### Set up the service account mapping
1. \*\*Create a service account mapping.\*\* Set \*\*Name\*\* to a value that is unique within that Workload Identity Provider, such as `vm-openai-wif`. Use \*\*Description\*\*, such as `Production VM Azure managed identity workload`, to explain which workload can use the mapping.
2. \*\*Match stable managed identity claims.\*\* Add one \*\*Key\*\* and \*\*Value\*\* row for each claim that must match. If the token contains `appid`, set \*\*Key\*\* to `appid` and \*\*Value\*\* to the managed identity client ID. The `appid` claim identifies the managed identity's application/client ID and is generally the most stable claim for binding a mapping to a specific managed identity. If your token does not contain `appid`, use another stable claim from the decoded token, such as `azp`, `oid`, `sub`, or `xms\_mirid`. To bind the mapping to one tenant, also set \*\*Key\*\* to `tid` and \*\*Value\*\* to the Microsoft Entra tenant ID. Decode a sample token from IMDS and use claims that are stable for the managed identity and resource you trust.
3. \*\*Choose the OpenAI target.\*\* Set \*\*Project\*\* to the OpenAI project that owns the target service account. Set \*\*Service account\*\* to the OpenAI service account the Azure workload can use, such as `azure-managed-identity-prod-openai-wif`.
4. \*\*Narrow API permissions if needed.\*\* Select appropriate \*\*Permissions\*\* such as `api.model.request` and `api.vector\_store.read` to further narrow access tokens minted from this mapping. Leave permissions blank to avoid adding a WIF-specific scope restriction; the token still authorizes as the mapped service account.
### Using the token in code
Configure your OpenAI SDK client to request an Azure managed identity token from IMDS and exchange it for an OpenAI-issued access token.
Set `OPENAI\_WIF\_AUDIENCE` to the Microsoft Entra Application ID URI configured as the Workload Identity Provider audience. The SDK requests a managed identity token for that audience, exchanges it for an OpenAI-issued access token, and uses the OpenAI token to authenticate API requests.
Authenticate from an Azure managed identity token
```typescript
import OpenAI from "openai";
import type { SubjectTokenProvider } from "openai/auth/index";
const imdsEndpoint = "http://169.254.169.254/metadata/identity/oauth2/token";
const identityProviderId = process.env.OPENAI\_IDENTITY\_PROVIDER\_ID;
const serviceAccountId = process.env.OPENAI\_SERVICE\_ACCOUNT\_ID;
const audience = process.env.OPENAI\_WIF\_AUDIENCE;
if (!identityProviderId || !serviceAccountId || !audience) {
throw new Error(
"Set OPENAI\_IDENTITY\_PROVIDER\_ID, OPENAI\_SERVICE\_ACCOUNT\_ID, and OPENAI\_WIF\_AUDIENCE"
);
}
function azureManagedIdentityTokenProvider(
resource: string
): SubjectTokenProvider {
return {
tokenType: "jwt",
getToken: async () => {
const url = new URL(imdsEndpoint);
url.searchParams.set("api-version", "2018-02-01");
url.searchParams.set("resource", resource);
const clientId = process.env.AZURE\_CLIENT\_ID;
if (clientId) {
url.searchParams.set("client\_id", clientId);
}
const response = await fetch(url, {
headers: { Metadata: "true" },
});
if (!response.ok) {
throw new Error(
`Azure IMDS token request failed with status ${response.status}.`
);
}
const body = (await response.json()) as { access\_token?: string };
if (!body.access\_token) {
throw new Error("Azure IMDS did not return an access token.");
}
return body.access\_token;
},
};
}
const client = new OpenAI({
workloadIdentity: {
identityProviderId,
serviceAccountId,
provider: azureManagedIdentityTokenProvider(audience),
},
});
const response = await client.responses.create({
model: "gpt-5.6-terra",
input: "Say hello from Azure managed identity workload identity federation.",
});
console.log(response.output\_text);
```
```python
import json
import os
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from openai import OpenAI
from openai.auth import SubjectTokenProvider
IMDS\_ENDPOINT = "http://169.254.169.254/metadata/identity/oauth2/token"
def azure\_managed\_identity\_token\_provider(resource: str) -> SubjectTokenProvider:
def get\_token() -> str:
params = {
"api-version": "2018-02-01",
"resource": resource,
}
client\_id = os.environ.get("AZURE\_CLIENT\_ID")
if client\_id:
params["client\_id"] = client\_id
request = Request(
f"{IMDS\_ENDPOINT}?{urlencode(params)}",
headers={"Metadata": "true"},
)
with urlopen(request, timeout=10) as response:
body = json.loads(response.read().decode("utf-8"))
token = body.get("access\_token", "")
if not token:
raise RuntimeError("Azure IMDS did not return an access token.")
return token
return {"token\_type": "jwt", "get\_token": get\_token}
client = OpenAI(
workload\_identity={
"identity\_provider\_id": os.environ["OPENAI\_IDENTITY\_PROVIDER\_ID"],
"service\_account\_id": os.environ["OPENAI\_SERVICE\_ACCOUNT\_ID"],
"provider": azure\_managed\_identity\_token\_provider(
os.environ["OPENAI\_WIF\_AUDIENCE"]
),
},
)
response = client.responses.create(
model="gpt-5.6-terra",
input="Say hello from Azure managed identity workload identity federation.",
)
print(response.output\_text)
```
```go
package main
import (
"context"
"encoding/json"
"fmt"
"log"
"net/http"
"net/url"
"os"
"github.com/openai/openai-go/v3"
"github.com/openai/openai-go/v3/auth"
"github.com/openai/openai-go/v3/option"
"github.com/openai/openai-go/v3/responses"
)
const azureIMDSEndpoint = "http://169.254.169.254/metadata/identity/oauth2/token"
type azureManagedIdentityTokenProvider struct {
resource string
}
func (p azureManagedIdentityTokenProvider) TokenType() auth.SubjectTokenType {
return auth.SubjectTokenTypeJWT
}
func (p azureManagedIdentityTokenProvider) GetToken(ctx context.Context, httpClient auth.HTTPDoer) (string, error) {
values := url.Values{}
values.Set("api-version", "2018-02-01")
values.Set("resource", p.resource)
if clientID := os.Getenv("AZURE\_CLIENT\_ID"); clientID != "" {
values.Set("client\_id", clientID)
}
req, err := http.NewRequestWithContext(ctx, http.MethodGet, azureIMDSEndpoint+"?"+values.Encode(), nil)
if err != nil {
return "", &auth.SubjectTokenProviderError{
Provider: "azure-managed-identity",
Message: "failed to build Azure IMDS token request",
Cause: err,
}
}
req.Header.Set("Metadata", "true")
resp, err := httpClient.Do(req)
if err != nil {
return "", &auth.SubjectTokenProviderError{
Provider: "azure-managed-identity",
Message: "failed to request Azure managed identity token",
Cause: err,
}
}
defer resp.Body.Close()
if resp.StatusCode < 200 || resp.StatusCode >= 300 {
return "", &auth.SubjectTokenProviderError{
Provider: "azure-managed-identity",
Message: fmt.Sprintf("Azure IMDS token request failed with status %d", resp.StatusCode),
}
}
var body struct {
AccessToken string `json:"access\_token"`
}
if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
return "", &auth.SubjectTokenProviderError{
Provider: "azure-managed-identity",
Message: "failed to decode Azure IMDS token response",
Cause: err,
}
}
if body.AccessToken == "" {
return "", &auth.SubjectTokenProviderError{
Provider: "azure-managed-identity",
Message: "Azure IMDS did not return an access token",
}
}
return body.AccessToken, nil
}
func main() {
audience := os.Getenv("OPENAI\_WIF\_AUDIENCE")
if audience == "" {
log.Fatal("Set OPENAI\_WIF\_AUDIENCE")
}
client := openai.NewClient(
option.WithWorkloadIdentity(auth.WorkloadIdentity{
IdentityProviderID: os.Getenv("OPENAI\_IDENTITY\_PROVIDER\_ID"),
ServiceAccountID: os.Getenv("OPENAI\_SERVICE\_ACCOUNT\_ID"),
Provider: azureManagedIdentityTokenProvider{
resource: audience,
},
}),
)
response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
Model: openai.ChatModelGPT4\_1Mini,
Input: responses.ResponseNewParamsInputUnion{
OfString: openai.String("Say hello from Azure managed identity workload identity federation."),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response.OutputText())
}
```
```java
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.auth.SubjectTokenProvider;
import com.openai.auth.SubjectTokenType;
import com.openai.auth.WorkloadIdentity;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.HttpClient;
import com.openai.errors.SubjectTokenProviderException;
import com.openai.models.responses.ResponseCreateParams;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;
public final class AzureManagedIdentityWorkloadIdentityExample {
private static final String IMDS\_ENDPOINT =
"http://169.254.169.254/metadata/identity/oauth2/token";
private AzureManagedIdentityWorkloadIdentityExample() {}
static final class AzureManagedIdentityTokenProvider implements SubjectTokenProvider {
private final String resource;
AzureManagedIdentityTokenProvider(String resource) {
this.resource = resource;
}
@Override
public SubjectTokenType tokenType() {
return SubjectTokenType.JWT;
}
@Override
public String getToken(HttpClient httpClient, JsonMapper jsonMapper) {
try {
String query =
"api-version=2018-02-01&resource="
+ URLEncoder.encode(resource, StandardCharsets.UTF\_8);
String clientId = System.getenv("AZURE\_CLIENT\_ID");
if (clientId != null && !clientId.isEmpty()) {
query += "&client\_id=" + URLEncoder.encode(clientId, StandardCharsets.UTF\_8);
}
HttpRequest request =
HttpRequest.newBuilder()
.uri(URI.create(IMDS\_ENDPOINT + "?" + query))
.header("Metadata", "true")
.GET()
.build();
HttpResponse response =
java.net.http.HttpClient.newHttpClient()
.send(request, HttpResponse.BodyHandlers.ofString());
if (response.statusCode() < 200 || response.statusCode() >= 300) {
throw new SubjectTokenProviderException(
"azure-managed-identity",
"Azure IMDS token request failed with status " + response.statusCode(),
null);
}
JsonNode body = jsonMapper.readTree(response.body());
String token = body.path("access\_token").asText();
if (token.isEmpty()) {
throw new SubjectTokenProviderException(
"azure-managed-identity", "Azure IMDS did not return an access token", null);
}
return token;
} catch (SubjectTokenProviderException e) {
throw e;
} catch (Exception e) {
throw new SubjectTokenProviderException(
"azure-managed-identity", "failed to request Azure managed identity token", e);
}
}
@Override
public CompletableFuture getTokenAsync(HttpClient httpClient, JsonMapper jsonMapper) {
return CompletableFuture.supplyAsync(() -> getToken(httpClient, jsonMapper));
}
}
public static void main(String[] args) {
WorkloadIdentity workloadIdentity =
WorkloadIdentity.builder()
.identityProviderId(System.getenv("OPENAI\_IDENTITY\_PROVIDER\_ID"))
.serviceAccountId(System.getenv("OPENAI\_SERVICE\_ACCOUNT\_ID"))
.provider(new AzureManagedIdentityTokenProvider(System.getenv("OPENAI\_WIF\_AUDIENCE")))
.build();
OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();
ResponseCreateParams params =
ResponseCreateParams.builder()
.model("gpt-5.6-terra")
.input("Say hello from Azure managed identity workload identity federation.")
.build();
client.responses().create(params).output().stream()
.flatMap(item -> item.message().stream())
.flatMap(message -> message.content().stream())
.flatMap(content -> content.outputText().stream())
.forEach(outputText -> System.out.println(outputText.text()));
}
}
```
```ruby
require "json"
require "net/http"
require "openai"
require "uri"
class AzureManagedIdentityTokenProvider
include OpenAI::Auth::SubjectTokenProvider
IMDS\_ENDPOINT = "http://169.254.169.254/metadata/identity/oauth2/token"
def initialize(resource:)
@resource = resource
end
def token\_type
OpenAI::Auth::TokenType::JWT
end
def get\_token
uri = URI(IMDS\_ENDPOINT)
params = {
"api-version" => "2018-02-01",
"resource" => @resource
}
params["client\_id"] = ENV["AZURE\_CLIENT\_ID"] if ENV["AZURE\_CLIENT\_ID"]
uri.query = URI.encode\_www\_form(params)
request = Net::HTTP::Get.new(uri)
request["Metadata"] = "true"
response = Net::HTTP.start(uri.hostname, uri.port, read\_timeout: 10) do |http|
http.request(request)
end
unless response.is\_a?(Net::HTTPSuccess)
raise OpenAI::Errors::SubjectTokenProviderError.new(
message: "Azure IMDS token request failed with status #{response.code}",
provider: "azure-managed-identity"
)
end
token = JSON.parse(response.body).fetch("access\_token", "")
if token.empty?
raise OpenAI::Errors::SubjectTokenProviderError.new(
message: "Azure IMDS did not return an access token",
provider: "azure-managed-identity"
)
end
token
rescue JSON::ParserError, SystemCallError => e
raise OpenAI::Errors::SubjectTokenProviderError.new(
message: "Failed to request Azure managed identity token: #{e.message}",
provider: "azure-managed-identity",
cause: e
)
end
end
provider = AzureManagedIdentityTokenProvider.new(
resource: ENV.fetch("OPENAI\_WIF\_AUDIENCE")
)
workload\_identity = OpenAI::Auth::WorkloadIdentity.new(
identity\_provider\_id: ENV.fetch("OPENAI\_IDENTITY\_PROVIDER\_ID"),
service\_account\_id: ENV.fetch("OPENAI\_SERVICE\_ACCOUNT\_ID"),
provider: provider
)
client = OpenAI::Client.new(workload\_identity: workload\_identity)
response = client.responses.create(
model: "gpt-5.6-terra",
input: "Say hello from Azure managed identity workload identity federation."
)
puts(response.output\_text)
```
## Azure Kubernetes Service (AKS)
Use AKS as a Workload Identity Provider by exchanging an AKS-issued projected service account token for a short-lived OpenAI access token.
AKS workloads can also use Azure Workload Identity to obtain a Microsoft Entra
ID access token for a managed identity attached to the workload. In that
configuration, OpenAI validates the Microsoft Entra token rather than the
projected Kubernetes service account token. Configure OpenAI workload identity
federation using the steps in [Azure managed
identity](#azure-managed-identity), and configure Azure Workload Identity
according to Microsoft's documentation.
### Setting up AKS
Retrieve the OIDC issuer URL associated with the AKS cluster:
```bash
az aks show \
--name  \
--resource-group  \
--query "oidcIssuerProfile.issuerUrl" \
--output tsv
```
If the issuer URL is empty, enable the AKS OIDC issuer for the cluster. Use the following command:
```bash
az aks update \
--resource-group  \
--name  \
--enable-oidc-issuer
```
The issuer you configure in the OpenAI Workload Identity Provider must match this issuer URL and the `iss` claim in the projected AKS service account token.
Use a Kubernetes `ServiceAccount` for the AKS workload that needs to call the OpenAI API. If you do not already have one, create it:
```bash
kubectl create serviceaccount openai-wif --namespace default
```
Configure the projected service account token with the audience OpenAI expects and an expiration suitable for your workload. OpenAI validates the token's issuer, signature, audience, and expiration. In this example, the token file is mounted at `/var/run/secrets/tokens/token`, uses the audience `https://api.openai.com/v1`, and expires after 3600 seconds. You may use a different audience if the projected token audience and OpenAI Workload Identity Provider audience match.
```yaml
apiVersion: v1
kind: Pod
metadata:
name: openai-wif-app
namespace: default
spec:
serviceAccountName: openai-wif
containers:
- name: app
image: my-image
volumeMounts:
- name: aks-sa-token
mountPath: /var/run/secrets/tokens
readOnly: true
volumes:
- name: aks-sa-token
projected:
sources:
- serviceAccountToken:
path: token
audience: "https://api.openai.com/v1"
expirationSeconds: 3600
```
### Verify the token
Before configuring workload identity federation, decode a sample projected service account token locally and inspect its claims. From a running pod with the projected token mounted, retrieve the token and export it as `TOKEN`:
```bash
TOKEN=$(kubectl exec -n default openai-wif-app -- cat /var/run/secrets/tokens/token)
export TOKEN
```
Then run this script:
```python
import base64
import json
import os
payload = os.environ["TOKEN"].split(".")[1]
payload += "=" \* (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe\_b64decode(payload)), indent=2))
```
This command decodes the JWT payload without verifying the token signature. Use a local decoder for production tokens, and avoid pasting production tokens into third-party tools.
A decoded AKS projected service account token will look similar to:
```json
{
"iss": "https://eastus.oic.prod-aks.azure.com/11111111-2222-3333-4444-555555555555/22222222-3333-4444-5555-666666666666/",
"aud": ["https://api.openai.com/v1"],
"sub": "system:serviceaccount:default:openai-wif",
"iat": 1716235422,
"exp": 1716239022,
"kubernetes.io": {
"namespace": "default",
"serviceaccount": {
"name": "openai-wif",
"uid": "11111111-2222-3333-4444-555555555555"
}
}
}
```
Verify the claims you plan to configure in OpenAI:
- `iss`: Must match the AKS issuer URL configured in the OpenAI Workload Identity Provider.
- `aud`: Must match the projected service account token audience and the OpenAI Workload Identity Provider audience.
- `sub`: Must match the Kubernetes service account subject you configure in the service account mapping.
Use the decoded payload to compare the token you received with the issuer, audience, and mapping values configured in OpenAI. Most configuration issues are visible in the `iss`, `aud`, and `sub` claims before you exchange the token.
### Setting up workload identity federation
Create a Workload Identity Provider in OpenAI for the AKS issuer, then add a service account mapping that matches attributes from the projected token.
Configure the Workload Identity Provider first, then create the service account mapping.
#### Set up the Workload Identity Provider
1. \*\*Create the Workload Identity Provider.\*\* Set \*\*Name\*\* to a unique value, such as `azure-aks-prod`. Use \*\*Description\*\*, such as `Production AKS cluster`, to help admins identify the cluster.
2. \*\*Set the issuer and audience.\*\* Set \*\*OIDC Issuer URL\*\* to the issuer returned by `az aks show --query "oidcIssuerProfile.issuerUrl"`. This value must match the `iss` claim in the projected AKS service account token. Set \*\*Audience\*\* to the same audience configured on the projected service account token volume. In this example, that value is `https://api.openai.com/v1`.
3. \*\*Use AKS OIDC discovery.\*\* Leave \*\*Use uploaded JWKS for token verification\*\* disabled. OpenAI uses the AKS issuer's OIDC discovery metadata and JWKS to verify the projected service account token.
4. \*\*Add attribute transformations if you need derived mapping attributes.\*\* For example, enter `aks\_subject` with expression `assertion.sub` to create `openai.aks\_subject`. The dashboard applies the `openai.` prefix automatically. Raw token claims that already start with `openai.` are ignored for `openai.` mapping keys unless a matching transformation is configured.
#### Set up the service account mapping
1. \*\*Create a service account mapping.\*\* Set \*\*Name\*\* to a value that is unique within that Workload Identity Provider, such as `default-openai-wif`. Use \*\*Description\*\*, such as `Default namespace AKS OpenAI API workload`, to explain which workload can use the mapping.
2. \*\*Match the AKS service account subject.\*\* Set \*\*Key\*\* to `sub` and \*\*Value\*\* to `system:serviceaccount:default:openai-wif`. For AKS service accounts, the subject format is `system:serviceaccount::`.
The Workload Identity Provider restricts tokens to the configured AKS issuer. The service account mapping further restricts access to the specified Kubernetes service account subject.
3. \*\*Choose the OpenAI target.\*\* Set \*\*Project\*\* to the OpenAI project that owns the target service account. Set \*\*Service account\*\* to the OpenAI service account the AKS workload can use, such as `azure-aks-prod-openai-wif`.
4. \*\*Narrow API permissions if needed.\*\* Select appropriate \*\*Permissions\*\* such as `api.model.request` and `api.vector\_store.read` to further narrow access tokens minted from this mapping. Leave permissions blank to avoid adding a WIF-specific scope restriction; the token still authorizes as the mapped service account.
### Using the token in code
Configure your OpenAI SDK client to read the projected AKS service account token and exchange it for an OpenAI-issued access token.
Use the mounted token path, such as `/var/run/secrets/tokens/token`, as the subject token source for the SDK workload identity federation provider. The SDK exchanges that AKS token for an OpenAI-issued access token and uses the OpenAI token to authenticate API requests.
The following examples initialize an OpenAI client with a custom subject token provider. The provider reads the projected AKS service account token from the mounted file path and uses it as the subject token for workload identity federation.
Authenticate from an AKS projected service account token
```typescript
import { readFile } from "node:fs/promises";
import OpenAI from "openai";
import type { SubjectTokenProvider } from "openai/auth/index";
const tokenPath = "/var/run/secrets/tokens/token";
const identityProviderId = process.env.OPENAI\_IDENTITY\_PROVIDER\_ID;
const serviceAccountId = process.env.OPENAI\_SERVICE\_ACCOUNT\_ID;
if (!identityProviderId || !serviceAccountId) {
throw new Error(
"Set OPENAI\_IDENTITY\_PROVIDER\_ID and OPENAI\_SERVICE\_ACCOUNT\_ID"
);
}
function mountedAksServiceAccountTokenProvider(
path: string
): SubjectTokenProvider {
return {
tokenType: "jwt",
getToken: async () => {
const token = (await readFile(path, "utf8")).trim();
if (!token) {
throw new Error("The mounted AKS service account token file is empty.");
}
return token;
},
};
}
const client = new OpenAI({
workloadIdentity: {
identityProviderId,
serviceAccountId,
provider: mountedAksServiceAccountTokenProvider(tokenPath),
},
});
const response = await client.responses.create({
model: "gpt-5.6-terra",
input: "Say hello from AKS workload identity federation.",
});
console.log(response.output\_text);
```
```python
import os
from pathlib import Path
from openai import OpenAI
from openai.auth import SubjectTokenProvider
TOKEN\_PATH = "/var/run/secrets/tokens/token"
def mounted\_aks\_service\_account\_token\_provider(token\_path: str) -> SubjectTokenProvider:
def get\_token() -> str:
token = Path(token\_path).read\_text().strip()
if not token:
raise RuntimeError("The mounted AKS service account token file is empty.")
return token
return {"token\_type": "jwt", "get\_token": get\_token}
client = OpenAI(
workload\_identity={
"identity\_provider\_id": os.environ["OPENAI\_IDENTITY\_PROVIDER\_ID"],
"service\_account\_id": os.environ["OPENAI\_SERVICE\_ACCOUNT\_ID"],
"provider": mounted\_aks\_service\_account\_token\_provider(TOKEN\_PATH),
},
)
response = client.responses.create(
model="gpt-5.6-terra",
input="Say hello from AKS workload identity federation.",
)
print(response.output\_text)
```
```go
package main
import (
"context"
"fmt"
"log"
"os"
"strings"
"github.com/openai/openai-go/v3"
"github.com/openai/openai-go/v3/auth"
"github.com/openai/openai-go/v3/option"
"github.com/openai/openai-go/v3/responses"
)
const tokenPath = "/var/run/secrets/tokens/token"
type mountedAksServiceAccountTokenProvider struct {
path string
}
func (p mountedAksServiceAccountTokenProvider) TokenType() auth.SubjectTokenType {
return auth.SubjectTokenTypeJWT
}
func (p mountedAksServiceAccountTokenProvider) GetToken(\_ context.Context, \_ auth.HTTPDoer) (string, error) {
data, err := os.ReadFile(p.path)
if err != nil {
return "", &auth.SubjectTokenProviderError{
Provider: "azure-aks",
Message: "failed to read mounted AKS service account token",
Cause: err,
}
}
token := strings.TrimSpace(string(data))
if token == "" {
return "", &auth.SubjectTokenProviderError{
Provider: "azure-aks",
Message: "mounted AKS service account token is empty",
}
}
return token, nil
}
func main() {
client := openai.NewClient(
option.WithWorkloadIdentity(auth.WorkloadIdentity{
IdentityProviderID: os.Getenv("OPENAI\_IDENTITY\_PROVIDER\_ID"),
ServiceAccountID: os.Getenv("OPENAI\_SERVICE\_ACCOUNT\_ID"),
Provider: mountedAksServiceAccountTokenProvider{
path: tokenPath,
},
}),
)
response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
Model: openai.ChatModelGPT4\_1Mini,
Input: responses.ResponseNewParamsInputUnion{
OfString: openai.String("Say hello from AKS workload identity federation."),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response.OutputText())
}
```
```java
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.auth.SubjectTokenProvider;
import com.openai.auth.SubjectTokenType;
import com.openai.auth.WorkloadIdentity;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.HttpClient;
import com.openai.errors.SubjectTokenProviderException;
import com.openai.models.responses.ResponseCreateParams;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.CompletableFuture;
public final class AzureAksWorkloadIdentityExample {
private static final String TOKEN\_PATH = "/var/run/secrets/tokens/token";
private AzureAksWorkloadIdentityExample() {}
static final class MountedAksServiceAccountTokenProvider implements SubjectTokenProvider {
private final Path tokenPath;
MountedAksServiceAccountTokenProvider(String tokenPath) {
this.tokenPath = Path.of(tokenPath);
}
@Override
public SubjectTokenType tokenType() {
return SubjectTokenType.JWT;
}
@Override
public String getToken(HttpClient httpClient, JsonMapper jsonMapper) {
String token;
try {
token = Files.readString(tokenPath).trim();
} catch (Exception e) {
throw new SubjectTokenProviderException(
"azure-aks", "failed to read mounted AKS service account token", e);
}
if (token.isEmpty()) {
throw new SubjectTokenProviderException(
"azure-aks", "mounted AKS service account token is empty", null);
}
return token;
}
@Override
public CompletableFuture getTokenAsync(HttpClient httpClient, JsonMapper jsonMapper) {
return CompletableFuture.supplyAsync(() -> getToken(httpClient, jsonMapper));
}
}
public static void main(String[] args) {
WorkloadIdentity workloadIdentity =
WorkloadIdentity.builder()
.identityProviderId(System.getenv("OPENAI\_IDENTITY\_PROVIDER\_ID"))
.serviceAccountId(System.getenv("OPENAI\_SERVICE\_ACCOUNT\_ID"))
.provider(new MountedAksServiceAccountTokenProvider(TOKEN\_PATH))
.build();
OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();
ResponseCreateParams params =
ResponseCreateParams.builder()
.model("gpt-5.6-terra")
.input("Say hello from AKS workload identity federation.")
.build();
client.responses().create(params).output().stream()
.flatMap(item -> item.message().stream())
.flatMap(message -> message.content().stream())
.flatMap(content -> content.outputText().stream())
.forEach(outputText -> System.out.println(outputText.text()));
}
}
```
```ruby
require "openai"
TOKEN\_PATH = "/var/run/secrets/tokens/token"
class MountedAksServiceAccountTokenProvider
include OpenAI::Auth::SubjectTokenProvider
def initialize(token\_path:)
@token\_path = token\_path
end
def token\_type
OpenAI::Auth::TokenType::JWT
end
def get\_token
token = File.read(@token\_path).strip
if token.empty?
raise OpenAI::Errors::SubjectTokenProviderError.new(
message: "Mounted AKS service account token is empty",
provider: "azure-aks"
)
end
token
rescue SystemCallError => e
raise OpenAI::Errors::SubjectTokenProviderError.new(
message: "Failed to read mounted AKS service account token: #{e.message}",
provider: "azure-aks",
cause: e
)
end
end
provider = MountedAksServiceAccountTokenProvider.new(token\_path: TOKEN\_PATH)
workload\_identity = OpenAI::Auth::WorkloadIdentity.new(
identity\_provider\_id: ENV.fetch("OPENAI\_IDENTITY\_PROVIDER\_ID"),
service\_account\_id: ENV.fetch("OPENAI\_SERVICE\_ACCOUNT\_ID"),
provider: provider
)
client = OpenAI::Client.new(workload\_identity: workload\_identity)
response = client.responses.create(
model: "gpt-5.6-terra",
input: "Say hello from AKS workload identity federation."
)
puts(response.output\_text)
```
## Microsoft Azure best practices
- Use managed identities whenever possible. Managed identities provide a simpler and more secure authentication model than distributing credentials manually.
- Use separate managed identities, Microsoft Entra applications, and OpenAI mappings for different applications and environments. Avoid sharing one identity across development, staging, and production workloads.
- Restrict accepted audiences. Configure only the audiences required for OpenAI workload identity federation.
- Use dedicated Microsoft Entra ID applications for security boundaries. Separate applications provide clearer ownership, auditing, and access management.
- Prefer workload-specific mappings. Match on workload-specific claims rather than broad tenant-wide attributes.
- Review federated credential configurations regularly. Stale federated credentials can unintentionally continue granting access long after workloads are retired.
- Separate production and non-production identities. Production workloads should authenticate through distinct federated identities and OpenAI service accounts.
