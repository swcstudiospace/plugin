# Manage service accounts with Terraform

Source: https://developers.openai.com/api/docs/guides/terraform/service-accounts.md

# Manage service accounts with Terraform
> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.
An OpenAI service account is a nonhuman identity owned by a project. Terraform can create the account without a default role, define a least-privilege permission bundle, and assign that bundle through a group. Create and manage service-account API keys outside Terraform through the Administration API.
This guide follows a typical service-account onboarding workflow:
1. Create a service account without a default project role or API key.
2. Assign a custom project role through a group, granting only the permissions the workload needs.
3. Create a scoped API key and store it in your secrets manager.
## Before you begin
Complete the [Terraform provider setup](https://developers.openai.com/api/docs/guides/terraform), export an Admin API key as `OPENAI\_ADMIN\_KEY`, and export the existing project's ID as `PROJECT\_ID`.
Use a test organization when evaluating service-account creation, import, replacement, and deletion.
## Create a service account without a default role
Create the service account with Terraform:
```terraform
resource "openai\_project\_service\_account" "application" {
project\_id = "proj\_123"
name = "example-application-development-service-account"
}
output "service\_account\_id" {
value = openai\_project\_service\_account.application.service\_account\_id
}
```
Replace `proj\_123` with the ID of the existing project that will own the service account.
The provider creates the service-account identity without generating an API key or assigning a default project role. Terraform stores the service-account ID and other nonsensitive metadata in state. At this stage, the service account has no project permissions.
## Assign least-privilege permissions
Define a custom project role with only the permissions the workload requires. Create a group, add the service account to it, and assign the role to the group. This example allows group members to create responses:
```terraform
resource "openai\_project\_role" "application" {
project\_id = openai\_project\_service\_account.application.project\_id
role\_name = "Application response writer"
description = "Allows the application to create responses"
permissions = ["api.responses.write"]
}
resource "openai\_group" "application\_access" {
name = "example-application-development-access"
}
resource "openai\_group\_user" "application" {
group\_id = openai\_group.application\_access.group\_id
user\_id = openai\_project\_service\_account.application.id
}
resource "openai\_project\_group\_role" "application\_access" {
project\_id = openai\_project\_service\_account.application.project\_id
group\_id = openai\_group.application\_access.group\_id
role\_id = openai\_project\_role.application.role\_id
}
```
The `openai\_project\_role` resource defines the least-privilege permission bundle, `openai\_group\_user` adds the service account to the group, and `openai\_project\_group\_role` assigns the role to that group. Every service account added to the group inherits the same project role. Replace `api.responses.write` with the smallest set of permissions approved for your workload. See [Projects and access](https://developers.openai.com/api/docs/guides/terraform/projects-and-access) for more information about group-based project access.
Review and apply the configuration:
```bash
terraform plan
terraform apply
```
Don't assign the built-in `member` or `owner` role when a custom project role
provides the permissions your workload needs. Keep access limited to the
approved permission bundle.
## Create a scoped API key
After applying the Terraform configuration, create an API key through the [Create project service account API key](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects/subresources/service\_accounts/subresources/api\_keys/methods/create) endpoint. The API returns the key's full value only once, so protect the response file before making the request:
```bash
SERVICE\_ACCOUNT\_ID="$(terraform output -raw service\_account\_id)"
umask 077
curl -X POST \
"https://api.openai.com/v1/organization/projects/$PROJECT\_ID/service\_accounts/$SERVICE\_ACCOUNT\_ID/api\_keys" \
-H "Authorization: Bearer $OPENAI\_ADMIN\_KEY" \
-H "Content-Type: application/json" \
-d '{
"name": "Production App",
"scopes": ["api.responses.write"]
}' \
--output service-account-api-key.json
```
Choose the narrowest scopes the workload needs. API-key scopes can further restrict the service account's permissions, but they can't grant permissions outside its assigned project role.
Pass the `value` from `service-account-api-key.json` to your approved secrets-manager workflow without printing it. After your secrets manager stores and verifies the secret, remove the response file:
```bash
rm service-account-api-key.json
```
Treat `service-account-api-key.json` as a secret for as long as it exists. Don't commit it, write the key to Terraform configuration, expose it through a Terraform output, or pass it as a Terraform variable.
The [API reference](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects/subresources/service\_accounts/subresources/api\_keys/methods/create) includes the response shape and language-specific examples. Workloads that support [workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation) can use the same service account and least-privilege role without creating an API key.
## Import an existing service account
You don't need to import a service account that Terraform created. To adopt a service account created outside Terraform, declare it with the same project ID and name:
```terraform
resource "openai\_project\_service\_account" "application" {
project\_id = "proj\_123"
name = "example-application-development-service-account"
}
```
Import the existing identity before running a normal apply:
```bash
SERVICE\_ACCOUNT\_ID=""
terraform import \
openai\_project\_service\_account.application \
"$PROJECT\_ID/$SERVICE\_ACCOUNT\_ID"
terraform plan
```
The first plan after import should propose no changes to the service account. If it proposes replacement, make the configured name and project match the existing account before applying.
Import doesn't recover or store an API key, change the service account's existing project role, or import its group membership. Declare and import the existing `openai\_project\_role`, `openai\_group`, `openai\_group\_user`, and `openai\_project\_group\_role` resources if Terraform should manage them. The workload continues to read any existing secret from your secrets manager.
Import the service account before applying the resource declaration. If you
apply first, Terraform creates a different service account instead of adopting
the existing identity.
## Recover or rotate credentials
The full API-key value is available only in the API-key create response. Later project API-key retrieval returns a redacted value, so you can't recover a lost key.
Replace a lost or rotating credential without interrupting the workload:
1. Declare the replacement as a new `openai\_project\_service\_account` resource, using a different Terraform resource name from the old account.
2. Apply the configuration to create the replacement service account.
3. Add the replacement to the existing group with `openai\_group\_user` so it inherits the least-privilege project role.
4. Create an API key for the replacement through the Administration API and store the key with your approved secrets-manager workflow.
5. Deploy the replacement key and verify the workload with the replacement account.
6. Remove the old `openai\_project\_service\_account` and its `openai\_group\_user` resource from the Terraform configuration. Keep the role, group, and group role assignment that the replacement service account still uses.
7. Review and apply the plan that deletes the old service account and its group membership, then run `terraform plan` and require a no-op result.
Deleting an `openai\_project\_service\_account` resource deletes the remote service account. Require explicit review for that change, especially while the old credential is still serving traffic.
For broader state adoption and removal behavior, see [Import and reconciliation](https://developers.openai.com/api/docs/guides/terraform/import-and-reconcile).
## Run the complete example
The focused examples use concrete values to explain service-account creation, role assignment, and API-key creation. The complete configuration replaces project-specific values and permissions with variables so you can reuse it across environments.
Save the following configuration as `main.tf`:
```terraform
terraform {
required\_version = ">= 1.0"
required\_providers {
openai = {
source = "openai/openai"
version = ">= 1.0.0"
}
}
}
provider "openai" {}
variable "project\_id" {
type = string
description = "ID of the existing OpenAI project."
}
variable "service\_account\_name" {
type = string
description = "Name of the application service account."
}
variable "project\_role\_permissions" {
type = list(string)
description = "Least-privilege project permissions for the application."
validation {
condition = length(var.project\_role\_permissions) > 0
error\_message = "Provide at least one approved project permission."
}
}
resource "openai\_project\_service\_account" "application" {
project\_id = var.project\_id
name = var.service\_account\_name
}
resource "openai\_project\_role" "application" {
project\_id = var.project\_id
role\_name = "Application API access"
description = "Least-privilege permissions approved for the application"
permissions = var.project\_role\_permissions
}
resource "openai\_group" "application\_access" {
name = "${var.service\_account\_name}-access"
}
resource "openai\_group\_user" "application" {
group\_id = openai\_group.application\_access.group\_id
user\_id = openai\_project\_service\_account.application.id
}
resource "openai\_project\_group\_role" "application\_access" {
project\_id = var.project\_id
group\_id = openai\_group.application\_access.group\_id
role\_id = openai\_project\_role.application.role\_id
}
output "project\_id" {
value = var.project\_id
}
output "service\_account\_id" {
value = openai\_project\_service\_account.application.service\_account\_id
}
output "group\_id" {
value = openai\_group.application\_access.group\_id
}
output "project\_role\_id" {
value = openai\_project\_role.application.role\_id
}
```
Create `terraform.tfvars` with an existing project ID, a unique service-account name, and the smallest set of approved project permissions:
```terraform
project\_id = "proj\_123"
service\_account\_name = "example-application-development-service-account"
project\_role\_permissions = [
"api.responses.write",
]
```
Initialize Terraform, then review and apply a saved plan:
```bash
terraform init
terraform fmt
terraform validate
terraform plan -out=tfplan
terraform show tfplan
terraform apply tfplan
```
The first plan should contain five resources to add: the service account, its custom project role, the group, the group membership, and the group role assignment. Run `terraform plan` again to confirm that the configuration produces no further changes.
Create the service-account API key outside Terraform:
```bash
PROJECT\_ID="$(terraform output -raw project\_id)"
SERVICE\_ACCOUNT\_ID="$(terraform output -raw service\_account\_id)"
umask 077
curl -X POST \
"https://api.openai.com/v1/organization/projects/$PROJECT\_ID/service\_accounts/$SERVICE\_ACCOUNT\_ID/api\_keys" \
-H "Authorization: Bearer $OPENAI\_ADMIN\_KEY" \
-H "Content-Type: application/json" \
-d '{
"name": "Production App",
"scopes": ["api.responses.write"]
}' \
--output service-account-api-key.json
```
Move the returned API-key value into your approved secrets manager, then delete `service-account-api-key.json`. Don't store the key in Terraform configuration, state, or outputs.
