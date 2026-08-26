# Import and reconcile OpenAI resources

Source: https://developers.openai.com/api/docs/guides/terraform/import-and-reconcile.md

# Import and reconcile OpenAI resources
> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.
Import existing OpenAI resources instead of recreating them. A safe adoption starts with configuration that matches the remote resource, previews and applies the import, and produces a no-op plan before any intended update.
Import blocks require Terraform 1.5 or later.
## Declare and import resources
Declare each existing resource using its current settings, then add an `import` block with the ID format from the provider reference:
```terraform
resource "openai\_project" "existing" {
name = "existing-project"
}
resource "openai\_group" "existing" {
name = "existing-group"
}
resource "openai\_project\_service\_account" "existing" {
project\_id = openai\_project.existing.project\_id
name = "existing-service-account"
}
import {
to = openai\_project.existing
id = "proj\_123"
}
import {
to = openai\_group.existing
id = "group\_123"
}
import {
to = openai\_project\_service\_account.existing
id = "proj\_123/svc\_acct\_123"
}
```
Preview the imports in a saved plan:
```bash
terraform plan -out=tfplan
terraform show tfplan
```
The plan should show the imports without proposing updates to the remote resources. If it proposes updates, make the configuration match the current settings before continuing. Apply the saved plan to perform the imports, then run another plan:
```bash
terraform apply tfplan
terraform plan
```
The second plan should report no changes. You can keep the import blocks in your configuration as a record of how Terraform adopted the resources.
Common import ID formats include:
| Resource | Import ID format |
| ----------------------- | ----------------------------------- |
| Project | `` |
| Organization group | `` |
| Project role | `/` |
| Project service account | `/` |
| Project group role | `//` |
| Project user role | `//` |
| Project rate limit | `/` |
Check the [provider reference](https://registry.terraform.io/providers/openai/openai/latest/docs) for the exact format of every resource.
## Read resources without adopting them
Use data sources when Terraform needs current information but another system owns the resource. The provider includes data sources for projects, groups, roles, users, role assignments, rate limits, model permissions, hosted-tool permissions, spend alerts, data retention, and certificates.
For example, read an existing project and its current groups:
```terraform
data "openai\_project" "existing" {
project\_id = var.project\_id
}
data "openai\_project\_groups" "existing" {
project\_id = data.openai\_project.existing.project\_id
}
output "project\_groups" {
value = data.openai\_project\_groups.existing.groups
}
```
The provider can import an existing project service account by ID, but it
doesn't currently provide a service-account data source. Keep the project and
service-account IDs in your approved inventory when you need to adopt an
existing service account. See [Service
accounts](https://developers.openai.com/api/docs/guides/terraform/service-accounts) for the API-key
bootstrap and import sequence.
## Detect and reconcile drift
Run a normal plan to read the current OpenAI settings and compare them with the desired values in your Terraform configuration:
```bash
terraform plan -detailed-exitcode
```
Exit code `0` means there are no changes, `2` means the plan contains changes, and `1` means Terraform encountered an error.
If the plan shows a setting that changed outside Terraform:
1. Determine whether the change was intentional.
2. To keep the remote change, update the Terraform configuration to match it.
3. To undo the remote change, review and apply the plan to restore the configured value.
4. Run another plan and require a no-op result.
## Understand removal behavior
Removing a resource block removes the resource from Terraform state, but it doesn't always delete or reset the same kind of remote object:
| Resource type | Removal behavior |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `openai\_project` | Archives the project. You can't restore an archived project. |
| `openai\_project\_service\_account` | Deletes the service account. |
| Role, group, membership, and assignment resources | Deletes the corresponding managed object or assignment. |
| `openai\_project\_model\_permissions` | Deletes the project model-permission configuration. |
| Project rate limit, hosted-tool permissions, and data-retention resources | Removes the resource from Terraform state without resetting the remote setting. |
