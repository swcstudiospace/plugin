# Manage projects and access with Terraform

Source: https://developers.openai.com/api/docs/guides/terraform/projects-and-access.md

# Manage projects and access with Terraform
> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.
Use this guide to create an OpenAI project and establish reusable access controls. You will define what identities can do with a project role, collect identities in an organization group, and connect the group to the project.
After completing the main workflow, you will have a repeatable configuration that:
- Creates an OpenAI project for an application.
- Defines a least-privilege project role.
- Creates an organization group for identities that need access.
- Grants the group access to the project through the role.
- Adds an existing organization user to the group.
## Before you begin
Complete the [Terraform provider setup](https://developers.openai.com/api/docs/guides/terraform) and export an Admin API key as `OPENAI\_ADMIN\_KEY`. You also need the ID of an existing organization user and the permission identifiers approved for the application. Use a test organization when evaluating the workflow.
Destroying an `openai\_project` archives the project instead of permanently deleting it. You can't restore an archived project.
## Create the project boundary
Create a project for the application:
```terraform
resource "openai\_project" "application" {
name = "example-application-development"
}
```
The project creates the boundary for the application's API usage, service accounts, rate limits, spend alerts, and project settings. Terraform makes the generated ID available as `openai\_project.application.project\_id`. Project-level resources can reference that value, so Terraform creates the project before them.
This focused example uses a concrete name. The complete example later replaces it with a variable so you can reuse the configuration across environments.
## Define project permissions
Create a project role with the permissions approved for the application:
```terraform
resource "openai\_project\_role" "application" {
project\_id = openai\_project.application.project\_id
role\_name = "Application API access"
description = "Permissions approved for this application"
permissions = ["api.webhooks.read"]
}
```
The `openai\_project\_role` resource defines what an identity can do inside the project. This example grants permission to read webhook configuration. Replace `api.webhooks.read` with the permission identifiers approved for your application, and start with only the permissions it needs.
Changing `permissions` updates the role. Run `terraform plan` to review every added or removed permission before applying the change.
## Create or reuse a group
Create an organization group when Terraform should own its lifecycle:
```terraform
resource "openai\_group" "application\_access" {
name = "example-application-development-access"
}
```
Groups exist at the organization level, and you can reuse them across projects. A name ending in `-access` communicates that membership grants access rather than merely describing a team.
If another system owns an existing group, read it instead:
```terraform
data "openai\_group" "application\_access" {
group\_id = "group\_123"
}
```
The data source reads the group without making this configuration responsible for its lifecycle. You can read SCIM-managed groups, but keep membership changes in the identity system that owns them.
## Grant the group project access
Connect the group to the custom role inside the project:
```terraform
resource "openai\_project\_group\_role" "application\_access" {
project\_id = openai\_project.application.project\_id
group\_id = openai\_group.application\_access.group\_id
role\_id = openai\_project\_role.application.role\_id
}
```
This example uses the Terraform-managed group. If you reused an existing group through the data source, replace the `group\_id` expression with `data.openai\_group.application\_access.group\_id`.
The assignment connects three objects:
- `project\_id` identifies where the group receives access.
- `group\_id` identifies which collection of identities receives access.
- `role\_id` identifies which permissions the group receives.
Group members inherit the custom role in this project. Adding a role or a group alone doesn't grant access; the assignment is the link between them.
## Add users and other identities
Add an identity to a Terraform-managed organization group with `openai\_group\_user`:
```terraform
resource "openai\_group\_user" "application\_developer" {
group\_id = openai\_group.application\_access.group\_id
user\_id = "user\_123"
}
```
The `user\_id` can identify an existing organization user or service account. To add a service account, use `openai\_project\_service\_account.application.id` as the `user\_id`. See [Service accounts](https://developers.openai.com/api/docs/guides/terraform/service-accounts) for group-based service-account access, authentication, and credential-lifecycle requirements.
Use direct role assignments when group-based access isn't appropriate:
```terraform
resource "openai\_project\_user\_role" "application\_developer" {
project\_id = openai\_project.application.project\_id
user\_id = "user\_123"
role\_id = openai\_project\_role.application.role\_id
}
```
For organization-wide permissions, create an organization role and assign it directly or through a group:
```terraform
variable "organization\_role\_permissions" {
type = list(string)
}
resource "openai\_role" "platform\_operator" {
role\_name = "Platform operator"
description = "Organization permissions for the platform team"
permissions = var.organization\_role\_permissions
}
resource "openai\_user\_role" "platform\_operator" {
user\_id = "user\_123"
role\_id = openai\_role.platform\_operator.role\_id
}
```
Set `organization\_role\_permissions` to the approved organization-level permission identifiers. Keep organization permissions separate from project permissions so each assignment has the narrowest required scope.
## Inspect current assignments
Read the organization and project roles assigned to an identity before changing access:
```terraform
data "openai\_user\_roles" "current" {
user\_id = "user\_123"
}
data "openai\_project\_user\_roles" "current" {
project\_id = openai\_project.application.project\_id
user\_id = "user\_123"
}
output "organization\_roles" {
value = data.openai\_user\_roles.current.roles
}
output "project\_roles" {
value = data.openai\_project\_user\_roles.current.roles
}
```
Data sources report current assignments but don't make Terraform responsible for them.
## Remove assignments
When Terraform already manages an assignment, removing its resource block makes the next plan propose deleting the remote assignment. Review the plan and verify that another path still grants any required access.
For a pre-existing assignment, first declare the matching resource and import it using the documented composite ID. Confirm that the first plan is a no-op before removing it from configuration and applying the deletion.
Terraform can remove only assignments recorded in its state. To remove an
existing default assignment, first import it into the corresponding Terraform
resource. Then remove that resource from your configuration and apply the
resulting destroy plan. If your organization doesn't allow this
import-and-destroy workflow, remove the assignment through an approved
dashboard or Administration API process.
See [Import and reconciliation](https://developers.openai.com/api/docs/guides/terraform/import-and-reconcile) for import formats and a safe adoption sequence.
## Run the complete example
The focused examples use concrete values to make each relationship clear. The complete configuration replaces repeated, environment-specific values with variables so you can reuse it without changing the resource definitions.
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
variable "project\_name" {
type = string
}
variable "project\_role\_permissions" {
type = list(string)
}
variable "user\_id" {
type = string
}
resource "openai\_project" "application" {
name = var.project\_name
}
resource "openai\_project\_role" "application" {
project\_id = openai\_project.application.project\_id
role\_name = "Application API access"
description = "Permissions approved for this application"
permissions = var.project\_role\_permissions
}
resource "openai\_group" "application\_access" {
name = "${var.project\_name}-access"
}
resource "openai\_project\_group\_role" "application\_access" {
project\_id = openai\_project.application.project\_id
group\_id = openai\_group.application\_access.group\_id
role\_id = openai\_project\_role.application.role\_id
}
resource "openai\_group\_user" "application\_developer" {
group\_id = openai\_group.application\_access.group\_id
user\_id = var.user\_id
}
output "project\_id" {
value = openai\_project.application.project\_id
}
output "group\_id" {
value = openai\_group.application\_access.group\_id
}
output "project\_role\_id" {
value = openai\_project\_role.application.role\_id
}
```
Create `terraform.tfvars` with a unique project name, an existing organization user ID, and the approved permissions:
```terraform
project\_name = "example-application-development"
user\_id = "user\_123"
project\_role\_permissions = [
"api.webhooks.read",
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
The first plan should contain five resources to add. After the apply, the user inherits the custom project role through the group, and `terraform output` prints the project, group, and project-role IDs. Run `terraform plan` again to confirm that the configuration produces no further changes.
To add more human users, repeat the group membership pattern with a unique Terraform resource name for each user. To configure a nonhuman identity, see [Service accounts](https://developers.openai.com/api/docs/guides/terraform/service-accounts). Use [Model, tool, and data controls](https://developers.openai.com/api/docs/guides/terraform/project-controls) and [Rate limits and spend](https://developers.openai.com/api/docs/guides/terraform/rate-limits-and-spend) to add project guardrails.
