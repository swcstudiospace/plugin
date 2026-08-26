# Permissions required for fine-grained personal access tokens - GitHub Docs

Source: https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens

# Permissions required for fine-grained personal access tokens

For each permission granted to a fine-grained personal access token, these are the REST API endpoints that the app can use.

## [About permissions required for fine-grained personal access token](#about-permissions-required-for-fine-grained-personal-access-token)

When you create a fine-grained personal access token, you grant it a set of permissions. Permissions define what resources the token can access via the API. For more information, see [Managing your personal access tokens](/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

To help you choose the correct permissions, you will receive the `X-Accepted-GitHub-Permissions` header in the REST API response. The header will tell you what permissions are required in order to access the endpoint. For more information, see [Troubleshooting the REST API](/en/rest/using-the-rest-api/troubleshooting-the-rest-api#resource-not-accessible).

These permissions are required to access private resources. Some endpoints can also be used to access public resources without these permissions. To see whether an endpoint can access public resources without a permission, see the documentation for that endpoint.

Some endpoints require more than one permission. Other endpoints work with any one permission from a set of permissions. In these cases, the "Additional permissions" column will include a checkmark. For full details about the permissions that are required to use the endpoint, see the documentation for that endpoint.

## [Organization permissions for "API Insights"](#organization-permissions-for-api-insights)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [GET /orgs/{org}/insights/api/route-stats/{actor\_type}/{actor\_id}](/en/rest/orgs/api-insights#get-route-stats-by-actor) | read |  |
| [GET /orgs/{org}/insights/api/subject-stats](/en/rest/orgs/api-insights#get-subject-stats) | read |  |
| [GET /orgs/{org}/insights/api/summary-stats](/en/rest/orgs/api-insights#get-summary-stats) | read |  |
| [GET /orgs/{org}/insights/api/summary-stats/users/{user\_id}](/en/rest/orgs/api-insights#get-summary-stats-by-user) | read |  |
| [GET /orgs/{org}/insights/api/summary-stats/{actor\_type}/{actor\_id}](/en/rest/orgs/api-insights#get-summary-stats-by-actor) | read |  |
| [GET /orgs/{org}/insights/api/time-stats](/en/rest/orgs/api-insights#get-time-stats) | read |  |
| [GET /orgs/{org}/insights/api/time-stats/users/{user\_id}](/en/rest/orgs/api-insights#get-time-stats-by-user) | read |  |
| [GET /orgs/{org}/insights/api/time-stats/{actor\_type}/{actor\_id}](/en/rest/orgs/api-insights#get-time-stats-by-actor) | read |  |
| [GET /orgs/{org}/insights/api/user-stats/{user\_id}](/en/rest/orgs/api-insights#get-user-stats) | read |  |

## [Organization permissions for "Administration"](#organization-permissions-for-administration)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /organizations/{org}/actions/cache/retention-limit](/en/rest/actions/cache#set-github-actions-cache-retention-limit-for-an-organization) | write |  |
| [PUT /organizations/{org}/actions/cache/storage-limit](/en/rest/actions/cache#set-github-actions-cache-storage-limit-for-an-organization) | write |  |
| [POST /organizations/{org}/settings/billing/budgets](/en/rest/billing/budgets#create-a-budget-for-an-organization) | write |  |
| [PATCH /organizations/{org}/settings/billing/budgets/{budget\_id}](/en/rest/billing/budgets#update-a-budget-for-an-organization) | write |  |
| [DELETE /organizations/{org}/settings/billing/budgets/{budget\_id}](/en/rest/billing/budgets#delete-a-budget-for-an-organization) | write |  |
| [PATCH /orgs/{org}](/en/rest/orgs/orgs#update-an-organization) | write |  |
| [DELETE /orgs/{org}](/en/rest/orgs/orgs#delete-an-organization) | write |  |
| [POST /orgs/{org}/actions/hosted-runners](/en/rest/actions/hosted-runners#create-a-github-hosted-runner-for-an-organization) | write |  |
| [PATCH /orgs/{org}/actions/hosted-runners/{hosted\_runner\_id}](/en/rest/actions/hosted-runners#update-a-github-hosted-runner-for-an-organization) | write |  |
| [DELETE /orgs/{org}/actions/hosted-runners/{hosted\_runner\_id}](/en/rest/actions/hosted-runners#delete-a-github-hosted-runner-for-an-organization) | write |  |
| [POST /orgs/{org}/actions/oidc/customization/properties/repo](/en/rest/actions/oidc#create-an-oidc-custom-property-inclusion-for-an-organization) | write |  |
| [DELETE /orgs/{org}/actions/oidc/customization/properties/repo/{custom\_property\_name}](/en/rest/actions/oidc#delete-an-oidc-custom-property-inclusion-for-an-organization) | write |  |
| [PUT /orgs/{org}/actions/oidc/customization/sub](/en/rest/actions/oidc#set-the-customization-template-for-an-oidc-subject-claim-for-an-organization) | write |  |
| [PUT /orgs/{org}/actions/permissions](/en/rest/actions/permissions#set-github-actions-permissions-for-an-organization) | write |  |
| [PUT /orgs/{org}/actions/permissions/artifact-and-log-retention](/en/rest/actions/permissions#set-artifact-and-log-retention-settings-for-an-organization) | write |  |
| [PUT /orgs/{org}/actions/permissions/fork-pr-contributor-approval](/en/rest/actions/permissions#set-fork-pr-contributor-approval-permissions-for-an-organization) | write |  |
| [PUT /orgs/{org}/actions/permissions/fork-pr-workflows-private-repos](/en/rest/actions/permissions#set-private-repo-fork-pr-workflow-settings-for-an-organization) | write |  |
| [PUT /orgs/{org}/actions/permissions/repositories](/en/rest/actions/permissions#set-selected-repositories-enabled-for-github-actions-in-an-organization) | write |  |
| [PUT /orgs/{org}/actions/permissions/repositories/{repository\_id}](/en/rest/actions/permissions#enable-a-selected-repository-for-github-actions-in-an-organization) | write |  |
| [DELETE /orgs/{org}/actions/permissions/repositories/{repository\_id}](/en/rest/actions/permissions#disable-a-selected-repository-for-github-actions-in-an-organization) | write |  |
| [PUT /orgs/{org}/actions/permissions/selected-actions](/en/rest/actions/permissions#set-allowed-actions-and-reusable-workflows-for-an-organization) | write |  |
| [PUT /orgs/{org}/actions/permissions/self-hosted-runners](/en/rest/actions/permissions#set-self-hosted-runners-settings-for-an-organization) | write |  |
| [PUT /orgs/{org}/actions/permissions/self-hosted-runners/repositories](/en/rest/actions/permissions#set-repositories-allowed-to-use-self-hosted-runners-in-an-organization) | write |  |
| [PUT /orgs/{org}/actions/permissions/self-hosted-runners/repositories/{repository\_id}](/en/rest/actions/permissions#add-a-repository-to-the-list-of-repositories-allowed-to-use-self-hosted-runners-in-an-organization) | write |  |
| [DELETE /orgs/{org}/actions/permissions/self-hosted-runners/repositories/{repository\_id}](/en/rest/actions/permissions#remove-a-repository-from-the-list-of-repositories-allowed-to-use-self-hosted-runners-in-an-organization) | write |  |
| [PUT /orgs/{org}/actions/permissions/workflow](/en/rest/actions/permissions#set-default-workflow-permissions-for-an-organization) | write |  |
| [POST /orgs/{org}/code-security/configurations](/en/rest/code-security/configurations#create-a-code-security-configuration) | write |  |
| [DELETE /orgs/{org}/code-security/configurations/detach](/en/rest/code-security/configurations#detach-configurations-from-repositories) | write |  |
| [PATCH /orgs/{org}/code-security/configurations/{configuration\_id}](/en/rest/code-security/configurations#update-a-code-security-configuration) | write |  |
| [DELETE /orgs/{org}/code-security/configurations/{configuration\_id}](/en/rest/code-security/configurations#delete-a-code-security-configuration) | write |  |
| [POST /orgs/{org}/code-security/configurations/{configuration\_id}/attach](/en/rest/code-security/configurations#attach-a-configuration-to-repositories) | write |  |
| [PUT /orgs/{org}/code-security/configurations/{configuration\_id}/defaults](/en/rest/code-security/configurations#set-a-code-security-configuration-as-a-default-for-an-organization) | write |  |
| [POST /orgs/{org}/copilot/billing/selected\_teams](/en/rest/copilot/copilot-user-management#add-teams-to-the-copilot-subscription-for-an-organization) | write |  |
| [DELETE /orgs/{org}/copilot/billing/selected\_teams](/en/rest/copilot/copilot-user-management#remove-teams-from-the-copilot-subscription-for-an-organization) | write |  |
| [POST /orgs/{org}/copilot/billing/selected\_users](/en/rest/copilot/copilot-user-management#add-users-to-the-copilot-subscription-for-an-organization) | write |  |
| [DELETE /orgs/{org}/copilot/billing/selected\_users](/en/rest/copilot/copilot-user-management#remove-users-from-the-copilot-subscription-for-an-organization) | write |  |
| [PATCH /orgs/{org}/dependabot/repository-access](/en/rest/dependabot/repository-access#updates-dependabots-repository-access-list-for-an-organization) | write |  |
| [PUT /orgs/{org}/dependabot/repository-access/default-level](/en/rest/dependabot/repository-access#set-the-default-repository-access-level-for-dependabot) | write |  |
| [PUT /orgs/{org}/interaction-limits](/en/rest/interactions/orgs#set-interaction-restrictions-for-an-organization) | write |  |
| [DELETE /orgs/{org}/interaction-limits](/en/rest/interactions/orgs#remove-interaction-restrictions-for-an-organization) | write |  |
| [GET /orgs/{org}/rulesets](/en/rest/orgs/rules#get-all-organization-repository-rulesets) | write |  |
| [POST /orgs/{org}/rulesets](/en/rest/orgs/rules#create-an-organization-repository-ruleset) | write |  |
| [GET /orgs/{org}/rulesets/rule-suites](/en/rest/orgs/rule-suites#list-organization-rule-suites) | write |  |
| [GET /orgs/{org}/rulesets/rule-suites/{rule\_suite\_id}](/en/rest/orgs/rule-suites#get-an-organization-rule-suite) | write |  |
| [GET /orgs/{org}/rulesets/{ruleset\_id}](/en/rest/orgs/rules#get-an-organization-repository-ruleset) | write |  |
| [PUT /orgs/{org}/rulesets/{ruleset\_id}](/en/rest/orgs/rules#update-an-organization-repository-ruleset) | write |  |
| [DELETE /orgs/{org}/rulesets/{ruleset\_id}](/en/rest/orgs/rules#delete-an-organization-repository-ruleset) | write |  |
| [GET /orgs/{org}/rulesets/{ruleset\_id}/history](/en/rest/orgs/rules#get-organization-ruleset-history) | write |  |
| [GET /orgs/{org}/rulesets/{ruleset\_id}/history/{version\_id}](/en/rest/orgs/rules#get-organization-ruleset-version) | write |  |
| [POST /orgs/{org}/secret-scanning/custom-patterns](/en/rest/secret-scanning/custom-patterns#bulk-create-organization-custom-patterns) | write |  |
| [DELETE /orgs/{org}/secret-scanning/custom-patterns](/en/rest/secret-scanning/custom-patterns#bulk-delete-organization-custom-patterns) | write |  |
| [PATCH /orgs/{org}/secret-scanning/custom-patterns/{pattern\_id}](/en/rest/secret-scanning/custom-patterns#update-an-organization-custom-pattern) | write |  |
| [PATCH /orgs/{org}/secret-scanning/pattern-configurations](/en/rest/secret-scanning/push-protection#update-organization-pattern-configurations) | write |  |
| [PUT /orgs/{org}/security-managers/teams/{team\_slug}](/en/rest/orgs/security-managers#add-a-security-manager-team) | write |  |
| [DELETE /orgs/{org}/security-managers/teams/{team\_slug}](/en/rest/orgs/security-managers#remove-a-security-manager-team) | write |  |
| [PUT /orgs/{org}/settings/immutable-releases](/en/rest/orgs/orgs#set-immutable-releases-settings-for-an-organization) | write |  |
| [PUT /orgs/{org}/settings/immutable-releases/repositories](/en/rest/orgs/orgs#set-selected-repositories-for-immutable-releases-enforcement) | write |  |
| [PUT /orgs/{org}/settings/immutable-releases/repositories/{repository\_id}](/en/rest/orgs/orgs#enable-a-selected-repository-for-immutable-releases-in-an-organization) | write |  |
| [DELETE /orgs/{org}/settings/immutable-releases/repositories/{repository\_id}](/en/rest/orgs/orgs#disable-a-selected-repository-for-immutable-releases-in-an-organization) | write |  |
| [POST /orgs/{org}/{security\_product}/{enablement}](/en/rest/orgs/orgs#enable-or-disable-a-security-feature-for-an-organization) | write |  |
| [GET /organizations/{org}/actions/cache/retention-limit](/en/rest/actions/cache#get-github-actions-cache-retention-limit-for-an-organization) | read |  |
| [GET /organizations/{org}/actions/cache/storage-limit](/en/rest/actions/cache#get-github-actions-cache-storage-limit-for-an-organization) | read |  |
| [GET /organizations/{org}/settings/billing/ai\_credit/usage](/en/rest/billing/usage#get-billing-ai-credit-usage-report-for-an-organization) | read |  |
| [GET /organizations/{org}/settings/billing/budgets](/en/rest/billing/budgets#get-all-budgets-for-an-organization) | read |  |
| [GET /organizations/{org}/settings/billing/budgets/{budget\_id}](/en/rest/billing/budgets#get-a-budget-by-id-for-an-organization) | read |  |
| [GET /organizations/{org}/settings/billing/premium\_request/usage](/en/rest/billing/usage#get-billing-premium-request-usage-report-for-an-organization) | read |  |
| [GET /organizations/{org}/settings/billing/usage](/en/rest/billing/usage#get-billing-usage-report-for-an-organization) | read |  |
| [GET /organizations/{org}/settings/billing/usage/summary](/en/rest/billing/usage#get-billing-usage-summary-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/cache/usage](/en/rest/actions/cache#get-github-actions-cache-usage-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/cache/usage-by-repository](/en/rest/actions/cache#list-repositories-with-github-actions-cache-usage-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/hosted-runners](/en/rest/actions/hosted-runners#list-github-hosted-runners-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/hosted-runners/images/github-owned](/en/rest/actions/hosted-runners#get-github-owned-images-for-github-hosted-runners-in-an-organization) | read |  |
| [GET /orgs/{org}/actions/hosted-runners/images/partner](/en/rest/actions/hosted-runners#get-partner-images-for-github-hosted-runners-in-an-organization) | read |  |
| [GET /orgs/{org}/actions/hosted-runners/limits](/en/rest/actions/hosted-runners#get-limits-on-github-hosted-runners-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/hosted-runners/machine-sizes](/en/rest/actions/hosted-runners#get-github-hosted-runners-machine-specs-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/hosted-runners/platforms](/en/rest/actions/hosted-runners#get-platforms-for-github-hosted-runners-in-an-organization) | read |  |
| [GET /orgs/{org}/actions/hosted-runners/{hosted\_runner\_id}](/en/rest/actions/hosted-runners#get-a-github-hosted-runner-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/oidc/customization/properties/repo](/en/rest/actions/oidc#list-oidc-custom-property-inclusions-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/oidc/customization/sub](/en/rest/actions/oidc#get-the-customization-template-for-an-oidc-subject-claim-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/permissions](/en/rest/actions/permissions#get-github-actions-permissions-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/permissions/artifact-and-log-retention](/en/rest/actions/permissions#get-artifact-and-log-retention-settings-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/permissions/fork-pr-contributor-approval](/en/rest/actions/permissions#get-fork-pr-contributor-approval-permissions-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/permissions/fork-pr-workflows-private-repos](/en/rest/actions/permissions#get-private-repo-fork-pr-workflow-settings-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/permissions/repositories](/en/rest/actions/permissions#list-selected-repositories-enabled-for-github-actions-in-an-organization) | read |  |
| [GET /orgs/{org}/actions/permissions/selected-actions](/en/rest/actions/permissions#get-allowed-actions-and-reusable-workflows-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/permissions/self-hosted-runners](/en/rest/actions/permissions#get-self-hosted-runners-settings-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/permissions/self-hosted-runners/repositories](/en/rest/actions/permissions#list-repositories-allowed-to-use-self-hosted-runners-in-an-organization) | read |  |
| [GET /orgs/{org}/actions/permissions/workflow](/en/rest/actions/permissions#get-default-workflow-permissions-for-an-organization) | read |  |
| [GET /orgs/{org}/code-security/configurations](/en/rest/code-security/configurations#get-code-security-configurations-for-an-organization) | read |  |
| [GET /orgs/{org}/code-security/configurations/defaults](/en/rest/code-security/configurations#get-default-code-security-configurations) | read |  |
| [GET /orgs/{org}/code-security/configurations/{configuration\_id}](/en/rest/code-security/configurations#get-a-code-security-configuration) | read |  |
| [GET /orgs/{org}/code-security/configurations/{configuration\_id}/repositories](/en/rest/code-security/configurations#get-repositories-associated-with-a-code-security-configuration) | read |  |
| [GET /orgs/{org}/copilot/billing](/en/rest/copilot/copilot-user-management#get-copilot-seat-information-and-settings-for-an-organization) | read |  |
| [GET /orgs/{org}/copilot/billing/seats](/en/rest/copilot/copilot-user-management#list-all-copilot-seat-assignments-for-an-organization) | read |  |
| [GET /orgs/{org}/dependabot/repository-access](/en/rest/dependabot/repository-access#lists-the-repositories-dependabot-can-access-in-an-organization) | read |  |
| [GET /orgs/{org}/installations](/en/rest/orgs/orgs#list-app-installations-for-an-organization) | read |  |
| [GET /orgs/{org}/interaction-limits](/en/rest/interactions/orgs#get-interaction-restrictions-for-an-organization) | read |  |
| [GET /orgs/{org}/members/{username}/copilot](/en/rest/copilot/copilot-user-management#get-copilot-seat-assignment-details-for-a-user) | read |  |
| [GET /orgs/{org}/secret-scanning/custom-patterns](/en/rest/secret-scanning/custom-patterns#list-organization-custom-patterns) | read |  |
| [GET /orgs/{org}/secret-scanning/pattern-configurations](/en/rest/secret-scanning/push-protection#list-organization-pattern-configurations) | read |  |
| [GET /orgs/{org}/security-managers](/en/rest/orgs/security-managers#list-security-manager-teams) | read |  |
| [GET /orgs/{org}/settings/immutable-releases](/en/rest/orgs/orgs#get-immutable-releases-settings-for-an-organization) | read |  |
| [GET /orgs/{org}/settings/immutable-releases/repositories](/en/rest/orgs/orgs#list-selected-repositories-for-immutable-releases-enforcement) | read |  |

## [Organization permissions for "Agent secrets"](#organization-permissions-for-agent-secrets)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /orgs/{org}/agents/secrets/{secret\_name}](/en/rest/agents/secrets#create-or-update-an-organization-secret) | write |  |
| [DELETE /orgs/{org}/agents/secrets/{secret\_name}](/en/rest/agents/secrets#delete-an-organization-secret) | write |  |
| [PUT /orgs/{org}/agents/secrets/{secret\_name}/repositories](/en/rest/agents/secrets#set-selected-repositories-for-an-organization-secret) | write |  |
| [PUT /orgs/{org}/agents/secrets/{secret\_name}/repositories/{repository\_id}](/en/rest/agents/secrets#add-selected-repository-to-an-organization-secret) | write |  |
| [DELETE /orgs/{org}/agents/secrets/{secret\_name}/repositories/{repository\_id}](/en/rest/agents/secrets#remove-selected-repository-from-an-organization-secret) | write |  |
| [GET /orgs/{org}/agents/secrets](/en/rest/agents/secrets#list-organization-secrets) | read |  |
| [GET /orgs/{org}/agents/secrets/public-key](/en/rest/agents/secrets#get-an-organization-public-key) | read |  |
| [GET /orgs/{org}/agents/secrets/{secret\_name}](/en/rest/agents/secrets#get-an-organization-secret) | read |  |
| [GET /orgs/{org}/agents/secrets/{secret\_name}/repositories](/en/rest/agents/secrets#list-selected-repositories-for-an-organization-secret) | read |  |

## [Organization permissions for "Agent variables"](#organization-permissions-for-agent-variables)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/agents/variables](/en/rest/agents/variables#create-an-organization-variable) | write |  |
| [PATCH /orgs/{org}/agents/variables/{name}](/en/rest/agents/variables#update-an-organization-variable) | write |  |
| [DELETE /orgs/{org}/agents/variables/{name}](/en/rest/agents/variables#delete-an-organization-variable) | write |  |
| [PUT /orgs/{org}/agents/variables/{name}/repositories](/en/rest/agents/variables#set-selected-repositories-for-an-organization-variable) | write |  |
| [PUT /orgs/{org}/agents/variables/{name}/repositories/{repository\_id}](/en/rest/agents/variables#add-selected-repository-to-an-organization-variable) | write |  |
| [DELETE /orgs/{org}/agents/variables/{name}/repositories/{repository\_id}](/en/rest/agents/variables#remove-selected-repository-from-an-organization-variable) | write |  |
| [GET /orgs/{org}/agents/variables](/en/rest/agents/variables#list-organization-variables) | read |  |
| [GET /orgs/{org}/agents/variables/{name}](/en/rest/agents/variables#get-an-organization-variable) | read |  |
| [GET /orgs/{org}/agents/variables/{name}/repositories](/en/rest/agents/variables#list-selected-repositories-for-an-organization-variable) | read |  |

## [Organization permissions for "Blocking users"](#organization-permissions-for-blocking-users)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /orgs/{org}/blocks/{username}](/en/rest/orgs/blocking#block-a-user-from-an-organization) | write |  |
| [DELETE /orgs/{org}/blocks/{username}](/en/rest/orgs/blocking#unblock-a-user-from-an-organization) | write |  |
| [GET /orgs/{org}/blocks](/en/rest/orgs/blocking#list-users-blocked-by-an-organization) | read |  |
| [GET /orgs/{org}/blocks/{username}](/en/rest/orgs/blocking#check-if-a-user-is-blocked-by-an-organization) | read |  |

## [Organization permissions for "Campaigns"](#organization-permissions-for-campaigns)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/campaigns](/en/rest/campaigns/campaigns#create-a-campaign-for-an-organization) | write |  |
| [PATCH /orgs/{org}/campaigns/{campaign\_number}](/en/rest/campaigns/campaigns#update-a-campaign) | write |  |
| [DELETE /orgs/{org}/campaigns/{campaign\_number}](/en/rest/campaigns/campaigns#delete-a-campaign-for-an-organization) | write |  |
| [GET /orgs/{org}/campaigns](/en/rest/campaigns/campaigns#list-campaigns-for-an-organization) | read |  |
| [GET /orgs/{org}/campaigns/{campaign\_number}](/en/rest/campaigns/campaigns#get-a-campaign-for-an-organization) | read |  |

## [Organization permissions for "Copilot Spaces"](#organization-permissions-for-copilot-spaces)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/copilot-spaces](/en/rest/copilot-spaces/copilot-spaces#create-an-organization-copilot-space) | write |  |
| [PUT /orgs/{org}/copilot-spaces/{space\_number}](/en/rest/copilot-spaces/copilot-spaces#set-an-organization-copilot-space) | write |  |
| [DELETE /orgs/{org}/copilot-spaces/{space\_number}](/en/rest/copilot-spaces/copilot-spaces#delete-an-organization-copilot-space) | write |  |
| [POST /orgs/{org}/copilot-spaces/{space\_number}/resources](/en/rest/copilot-spaces/resources#create-a-resource-for-an-organization-copilot-space) | write |  |
| [PUT /orgs/{org}/copilot-spaces/{space\_number}/resources/{space\_resource\_id}](/en/rest/copilot-spaces/resources#set-a-resource-for-an-organization-copilot-space) | write |  |
| [DELETE /orgs/{org}/copilot-spaces/{space\_number}/resources/{space\_resource\_id}](/en/rest/copilot-spaces/resources#delete-a-resource-from-an-organization-copilot-space) | write |  |
| [GET /orgs/{org}/copilot-spaces](/en/rest/copilot-spaces/copilot-spaces#list-organization-copilot-spaces) | read |  |
| [GET /orgs/{org}/copilot-spaces/{space\_number}](/en/rest/copilot-spaces/copilot-spaces#get-an-organization-copilot-space) | read |  |
| [GET /orgs/{org}/copilot-spaces/{space\_number}/resources](/en/rest/copilot-spaces/resources#list-resources-for-an-organization-copilot-space) | read |  |
| [GET /orgs/{org}/copilot-spaces/{space\_number}/resources/{space\_resource\_id}](/en/rest/copilot-spaces/resources#get-a-resource-for-an-organization-copilot-space) | read |  |

## [Organization permissions for "Copilot agent settings"](#organization-permissions-for-copilot-agent-settings)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /orgs/{org}/copilot/coding-agent/permissions](/en/rest/copilot/copilot-coding-agent-management#set-copilot-cloud-agent-permissions-for-an-organization) | write |  |
| [PUT /orgs/{org}/copilot/coding-agent/permissions/repositories](/en/rest/copilot/copilot-coding-agent-management#set-selected-repositories-for-copilot-cloud-agent-in-an-organization) | write |  |
| [PUT /orgs/{org}/copilot/coding-agent/permissions/repositories/{repository\_id}](/en/rest/copilot/copilot-coding-agent-management#enable-a-repository-for-copilot-cloud-agent-in-an-organization) | write |  |
| [DELETE /orgs/{org}/copilot/coding-agent/permissions/repositories/{repository\_id}](/en/rest/copilot/copilot-coding-agent-management#disable-a-repository-for-copilot-cloud-agent-in-an-organization) | write |  |
| [GET /orgs/{org}/copilot/coding-agent/permissions](/en/rest/copilot/copilot-coding-agent-management#get-copilot-cloud-agent-permissions-for-an-organization) | read |  |
| [GET /orgs/{org}/copilot/coding-agent/permissions/repositories](/en/rest/copilot/copilot-coding-agent-management#list-repositories-enabled-for-copilot-cloud-agent-in-an-organization) | read |  |

## [Organization permissions for "Copilot content exclusion"](#organization-permissions-for-copilot-content-exclusion)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /orgs/{org}/copilot/content\_exclusion](/en/rest/copilot/copilot-content-exclusion-management#set-copilot-content-exclusion-rules-for-an-organization) | write |  |
| [GET /orgs/{org}/copilot/content\_exclusion](/en/rest/copilot/copilot-content-exclusion-management#get-copilot-content-exclusion-rules-for-an-organization) | read |  |

## [Organization permissions for "Custom organization roles"](#organization-permissions-for-custom-organization-roles)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [GET /orgs/{org}/organization-roles](/en/rest/orgs/organization-roles#get-all-organization-roles-for-an-organization) | read |  |
| [GET /orgs/{org}/organization-roles/{role\_id}](/en/rest/orgs/organization-roles#get-an-organization-role) | read |  |

## [Organization permissions for "Custom properties"](#organization-permissions-for-custom-properties)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PATCH /orgs/{org}/properties/schema](/en/rest/orgs/custom-properties#create-or-update-custom-properties-for-an-organization) | admin |  |
| [PUT /orgs/{org}/properties/schema/{custom\_property\_name}](/en/rest/orgs/custom-properties#create-or-update-a-custom-property-for-an-organization) | admin |  |
| [DELETE /orgs/{org}/properties/schema/{custom\_property\_name}](/en/rest/orgs/custom-properties#remove-a-custom-property-for-an-organization) | admin |  |
| [PATCH /orgs/{org}/properties/values](/en/rest/orgs/custom-properties#create-or-update-custom-property-values-for-organization-repositories) | write |  |
| [GET /orgs/{org}/properties/schema](/en/rest/orgs/custom-properties#get-all-custom-properties-for-an-organization) | read |  |
| [GET /orgs/{org}/properties/schema/{custom\_property\_name}](/en/rest/orgs/custom-properties#get-a-custom-property-for-an-organization) | read |  |
| [GET /orgs/{org}/properties/values](/en/rest/orgs/custom-properties#list-custom-property-values-for-organization-repositories) | read |  |

## [Organization permissions for "Events"](#organization-permissions-for-events)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [GET /users/{username}/events/orgs/{org}](/en/rest/activity/events#list-organization-events-for-the-authenticated-user) | read |  |

## [Organization permissions for "GitHub Copilot Business"](#organization-permissions-for-github-copilot-business)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/copilot-spaces/{space\_number}/collaborators](/en/rest/copilot-spaces/collaborators#add-a-collaborator-to-an-organization-copilot-space) | write |  |
| [PUT /orgs/{org}/copilot-spaces/{space\_number}/collaborators/{actor\_type}/{actor\_identifier}](/en/rest/copilot-spaces/collaborators#set-a-collaborator-role-for-an-organization-copilot-space) | write |  |
| [DELETE /orgs/{org}/copilot-spaces/{space\_number}/collaborators/{actor\_type}/{actor\_identifier}](/en/rest/copilot-spaces/collaborators#remove-a-collaborator-from-an-organization-copilot-space) | write |  |
| [POST /orgs/{org}/copilot/billing/selected\_teams](/en/rest/copilot/copilot-user-management#add-teams-to-the-copilot-subscription-for-an-organization) | write |  |
| [DELETE /orgs/{org}/copilot/billing/selected\_teams](/en/rest/copilot/copilot-user-management#remove-teams-from-the-copilot-subscription-for-an-organization) | write |  |
| [POST /orgs/{org}/copilot/billing/selected\_users](/en/rest/copilot/copilot-user-management#add-users-to-the-copilot-subscription-for-an-organization) | write |  |
| [DELETE /orgs/{org}/copilot/billing/selected\_users](/en/rest/copilot/copilot-user-management#remove-users-from-the-copilot-subscription-for-an-organization) | write |  |
| [GET /orgs/{org}/copilot-spaces/{space\_number}/collaborators](/en/rest/copilot-spaces/collaborators#list-collaborators-for-an-organization-copilot-space) | read |  |
| [GET /orgs/{org}/copilot/billing](/en/rest/copilot/copilot-user-management#get-copilot-seat-information-and-settings-for-an-organization) | read |  |
| [GET /orgs/{org}/copilot/billing/seats](/en/rest/copilot/copilot-user-management#list-all-copilot-seat-assignments-for-an-organization) | read |  |
| [GET /orgs/{org}/members/{username}/copilot](/en/rest/copilot/copilot-user-management#get-copilot-seat-assignment-details-for-a-user) | read |  |

## [Organization permissions for "Hosted runner custom images"](#organization-permissions-for-hosted-runner-custom-images)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [DELETE /orgs/{org}/actions/hosted-runners/images/custom/{image\_definition\_id}](/en/rest/actions/hosted-runners#delete-a-custom-image-from-the-organization) | write |  |
| [DELETE /orgs/{org}/actions/hosted-runners/images/custom/{image\_definition\_id}/versions/{version}](/en/rest/actions/hosted-runners#delete-an-image-version-of-custom-image-from-the-organization) | write |  |
| [GET /orgs/{org}/actions/hosted-runners/images/custom](/en/rest/actions/hosted-runners#list-custom-images-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/hosted-runners/images/custom/{image\_definition\_id}](/en/rest/actions/hosted-runners#get-a-custom-image-definition-for-github-actions-hosted-runners) | read |  |
| [GET /orgs/{org}/actions/hosted-runners/images/custom/{image\_definition\_id}/versions](/en/rest/actions/hosted-runners#list-image-versions-of-a-custom-image-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/hosted-runners/images/custom/{image\_definition\_id}/versions/{version}](/en/rest/actions/hosted-runners#get-an-image-version-of-a-custom-image-for-github-actions-hosted-runners) | read |  |

## [Organization permissions for "Issue Fields"](#organization-permissions-for-issue-fields)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/issue-fields](/en/rest/orgs/issue-fields#create-issue-field-for-an-organization) | write |  |
| [PATCH /orgs/{org}/issue-fields/{issue\_field\_id}](/en/rest/orgs/issue-fields#update-issue-field-for-an-organization) | write |  |
| [DELETE /orgs/{org}/issue-fields/{issue\_field\_id}](/en/rest/orgs/issue-fields#delete-issue-field-for-an-organization) | write |  |
| [GET /orgs/{org}/issue-fields](/en/rest/orgs/issue-fields#list-issue-fields-for-an-organization) | read |  |

## [Organization permissions for "Issue Types"](#organization-permissions-for-issue-types)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/issue-types](/en/rest/orgs/issue-types#create-issue-type-for-an-organization) | write |  |
| [PUT /orgs/{org}/issue-types/{issue\_type\_id}](/en/rest/orgs/issue-types#update-issue-type-for-an-organization) | write |  |
| [DELETE /orgs/{org}/issue-types/{issue\_type\_id}](/en/rest/orgs/issue-types#delete-issue-type-for-an-organization) | write |  |
| [GET /orgs/{org}/issue-types](/en/rest/orgs/issue-types#list-issue-types-for-an-organization) | read |  |

## [Organization permissions for "Members"](#organization-permissions-for-members)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/invitations](/en/rest/orgs/members#create-an-organization-invitation) | write |  |
| [DELETE /orgs/{org}/invitations/{invitation\_id}](/en/rest/orgs/members#cancel-an-organization-invitation) | write |  |
| [DELETE /orgs/{org}/members/{username}](/en/rest/orgs/members#remove-an-organization-member) | write |  |
| [PUT /orgs/{org}/memberships/{username}](/en/rest/orgs/members#set-organization-membership-for-a-user) | write |  |
| [DELETE /orgs/{org}/memberships/{username}](/en/rest/orgs/members#remove-organization-membership-for-a-user) | write |  |
| [DELETE /orgs/{org}/organization-roles/teams/{team\_slug}](/en/rest/orgs/organization-roles#remove-all-organization-roles-for-a-team) | write |  |
| [PUT /orgs/{org}/organization-roles/teams/{team\_slug}/{role\_id}](/en/rest/orgs/organization-roles#assign-an-organization-role-to-a-team) | write |  |
| [DELETE /orgs/{org}/organization-roles/teams/{team\_slug}/{role\_id}](/en/rest/orgs/organization-roles#remove-an-organization-role-from-a-team) | write |  |
| [DELETE /orgs/{org}/organization-roles/users/{username}](/en/rest/orgs/organization-roles#remove-all-organization-roles-for-a-user) | write |  |
| [PUT /orgs/{org}/organization-roles/users/{username}/{role\_id}](/en/rest/orgs/organization-roles#assign-an-organization-role-to-a-user) | write |  |
| [DELETE /orgs/{org}/organization-roles/users/{username}/{role\_id}](/en/rest/orgs/organization-roles#remove-an-organization-role-from-a-user) | write |  |
| [PUT /orgs/{org}/outside\_collaborators/{username}](/en/rest/orgs/outside-collaborators#convert-an-organization-member-to-outside-collaborator) | write |  |
| [DELETE /orgs/{org}/outside\_collaborators/{username}](/en/rest/orgs/outside-collaborators#remove-outside-collaborator-from-an-organization) | write |  |
| [PUT /orgs/{org}/public\_members/{username}](/en/rest/orgs/members#set-public-organization-membership-for-the-authenticated-user) | write |  |
| [DELETE /orgs/{org}/public\_members/{username}](/en/rest/orgs/members#remove-public-organization-membership-for-the-authenticated-user) | write |  |
| [POST /orgs/{org}/teams](/en/rest/teams/teams#create-a-team) | write |  |
| [PATCH /orgs/{org}/teams/{team\_slug}](/en/rest/teams/teams#update-a-team) | write |  |
| [DELETE /orgs/{org}/teams/{team\_slug}](/en/rest/teams/teams#delete-a-team) | write |  |
| [PUT /orgs/{org}/teams/{team\_slug}/memberships/{username}](/en/rest/teams/members#add-or-update-team-membership-for-a-user) | write |  |
| [DELETE /orgs/{org}/teams/{team\_slug}/memberships/{username}](/en/rest/teams/members#remove-team-membership-for-a-user) | write |  |
| [PATCH /teams/{team\_id}](/en/rest/teams/teams#update-a-team-legacy) | write |  |
| [DELETE /teams/{team\_id}](/en/rest/teams/teams#delete-a-team-legacy) | write |  |
| [PUT /teams/{team\_id}/members/{username}](/en/rest/teams/members#add-team-member-legacy) | write |  |
| [DELETE /teams/{team\_id}/members/{username}](/en/rest/teams/members#remove-team-member-legacy) | write |  |
| [PUT /teams/{team\_id}/memberships/{username}](/en/rest/teams/members#add-or-update-team-membership-for-a-user-legacy) | write |  |
| [DELETE /teams/{team\_id}/memberships/{username}](/en/rest/teams/members#remove-team-membership-for-a-user-legacy) | write |  |
| [PATCH /user/memberships/orgs/{org}](/en/rest/orgs/members#update-an-organization-membership-for-the-authenticated-user) | write |  |
| [GET /orgs/{org}/failed\_invitations](/en/rest/orgs/members#list-failed-organization-invitations) | read |  |
| [GET /orgs/{org}/invitations](/en/rest/orgs/members#list-pending-organization-invitations) | read |  |
| [GET /orgs/{org}/invitations/{invitation\_id}/teams](/en/rest/orgs/members#list-organization-invitation-teams) | read |  |
| [GET /orgs/{org}/members](/en/rest/orgs/members#list-organization-members) | read |  |
| [GET /orgs/{org}/members/{username}](/en/rest/orgs/members#check-organization-membership-for-a-user) | read |  |
| [GET /orgs/{org}/memberships/{username}](/en/rest/orgs/members#get-organization-membership-for-a-user) | read |  |
| [GET /orgs/{org}/organization-roles/{role\_id}/teams](/en/rest/orgs/organization-roles#list-teams-that-are-assigned-to-an-organization-role) | read |  |
| [GET /orgs/{org}/organization-roles/{role\_id}/users](/en/rest/orgs/organization-roles#list-users-that-are-assigned-to-an-organization-role) | read |  |
| [GET /orgs/{org}/outside\_collaborators](/en/rest/orgs/outside-collaborators#list-outside-collaborators-for-an-organization) | read |  |
| [GET /orgs/{org}/public\_members](/en/rest/orgs/members#list-public-organization-members) | read |  |
| [GET /orgs/{org}/public\_members/{username}](/en/rest/orgs/members#check-public-organization-membership-for-a-user) | read |  |
| [GET /orgs/{org}/teams](/en/rest/teams/teams#list-teams) | read |  |
| [GET /orgs/{org}/teams/{team\_slug}](/en/rest/teams/teams#get-a-team-by-name) | read |  |
| [GET /orgs/{org}/teams/{team\_slug}/invitations](/en/rest/teams/members#list-pending-team-invitations) | read |  |
| [GET /orgs/{org}/teams/{team\_slug}/members](/en/rest/teams/members#list-team-members) | read |  |
| [GET /orgs/{org}/teams/{team\_slug}/memberships/{username}](/en/rest/teams/members#get-team-membership-for-a-user) | read |  |
| [GET /orgs/{org}/teams/{team\_slug}/repos](/en/rest/teams/teams#list-team-repositories) | read |  |
| [GET /orgs/{org}/teams/{team\_slug}/repos/{owner}/{repo}](/en/rest/teams/teams#check-team-permissions-for-a-repository) | read |  |
| [PUT /orgs/{org}/teams/{team\_slug}/repos/{owner}/{repo}](/en/rest/teams/teams#add-or-update-team-repository-permissions) | read |  |
| [DELETE /orgs/{org}/teams/{team\_slug}/repos/{owner}/{repo}](/en/rest/teams/teams#remove-a-repository-from-a-team) | read |  |
| [GET /orgs/{org}/teams/{team\_slug}/teams](/en/rest/teams/teams#list-child-teams) | read |  |
| [GET /teams/{team\_id}](/en/rest/teams/teams#get-a-team-legacy) | read |  |
| [GET /teams/{team\_id}/invitations](/en/rest/teams/members#list-pending-team-invitations-legacy) | read |  |
| [GET /teams/{team\_id}/members](/en/rest/teams/members#list-team-members-legacy) | read |  |
| [GET /teams/{team\_id}/members/{username}](/en/rest/teams/members#get-team-member-legacy) | read |  |
| [GET /teams/{team\_id}/memberships/{username}](/en/rest/teams/members#get-team-membership-for-a-user-legacy) | read |  |
| [GET /teams/{team\_id}/repos](/en/rest/teams/teams#list-team-repositories-legacy) | read |  |
| [GET /teams/{team\_id}/repos/{owner}/{repo}](/en/rest/teams/teams#check-team-permissions-for-a-repository-legacy) | read |  |
| [PUT /teams/{team\_id}/repos/{owner}/{repo}](/en/rest/teams/teams#add-or-update-team-repository-permissions-legacy) | read |  |
| [DELETE /teams/{team\_id}/repos/{owner}/{repo}](/en/rest/teams/teams#remove-a-repository-from-a-team-legacy) | read |  |
| [GET /teams/{team\_id}/teams](/en/rest/teams/teams#list-child-teams-legacy) | read |  |
| [GET /user/memberships/orgs/{org}](/en/rest/orgs/members#get-an-organization-membership-for-the-authenticated-user) | read |  |

## [Organization permissions for "Network configurations"](#organization-permissions-for-network-configurations)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/settings/network-configurations](/en/rest/orgs/network-configurations#create-a-hosted-compute-network-configuration-for-an-organization) | write |  |
| [PATCH /orgs/{org}/settings/network-configurations/{network\_configuration\_id}](/en/rest/orgs/network-configurations#update-a-hosted-compute-network-configuration-for-an-organization) | write |  |
| [DELETE /orgs/{org}/settings/network-configurations/{network\_configuration\_id}](/en/rest/orgs/network-configurations#delete-a-hosted-compute-network-configuration-from-an-organization) | write |  |
| [GET /orgs/{org}/settings/network-configurations](/en/rest/orgs/network-configurations#list-hosted-compute-network-configurations-for-an-organization) | read |  |
| [GET /orgs/{org}/settings/network-configurations/{network\_configuration\_id}](/en/rest/orgs/network-configurations#get-a-hosted-compute-network-configuration-for-an-organization) | read |  |
| [GET /orgs/{org}/settings/network-settings/{network\_settings\_id}](/en/rest/orgs/network-configurations#get-a-hosted-compute-network-settings-resource-for-an-organization) | read |  |

## [Organization permissions for "Organization Copilot metrics"](#organization-permissions-for-organization-copilot-metrics)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [GET /orgs/{org}/copilot/metrics/reports/organization-1-day](/en/rest/copilot/copilot-usage-metrics#get-copilot-organization-usage-metrics-for-a-specific-day) | read |  |
| [GET /orgs/{org}/copilot/metrics/reports/organization-28-day/latest](/en/rest/copilot/copilot-usage-metrics#get-copilot-organization-usage-metrics) | read |  |
| [GET /orgs/{org}/copilot/metrics/reports/repos-1-day](/en/rest/copilot/copilot-usage-metrics#get-copilot-organization-repository-report-for-a-specific-day) | read |  |
| [GET /orgs/{org}/copilot/metrics/reports/user-teams-1-day](/en/rest/copilot/copilot-usage-metrics#get-copilot-organization-user-teams-report-for-a-specific-day) | read |  |
| [GET /orgs/{org}/copilot/metrics/reports/users-1-day](/en/rest/copilot/copilot-usage-metrics#get-copilot-organization-users-usage-metrics-for-a-specific-day) | read |  |
| [GET /orgs/{org}/copilot/metrics/reports/users-28-day/latest](/en/rest/copilot/copilot-usage-metrics#get-copilot-organization-users-usage-metrics) | read |  |

## [Organization permissions for "Organization codespaces secrets"](#organization-permissions-for-organization-codespaces-secrets)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /orgs/{org}/codespaces/secrets/{secret\_name}](/en/rest/codespaces/organization-secrets#create-or-update-an-organization-secret) | write |  |
| [DELETE /orgs/{org}/codespaces/secrets/{secret\_name}](/en/rest/codespaces/organization-secrets#delete-an-organization-secret) | write |  |
| [PUT /orgs/{org}/codespaces/secrets/{secret\_name}/repositories](/en/rest/codespaces/organization-secrets#set-selected-repositories-for-an-organization-secret) | write |  |
| [PUT /orgs/{org}/codespaces/secrets/{secret\_name}/repositories/{repository\_id}](/en/rest/codespaces/organization-secrets#add-selected-repository-to-an-organization-secret) | write |  |
| [DELETE /orgs/{org}/codespaces/secrets/{secret\_name}/repositories/{repository\_id}](/en/rest/codespaces/organization-secrets#remove-selected-repository-from-an-organization-secret) | write |  |
| [GET /orgs/{org}/codespaces/secrets](/en/rest/codespaces/organization-secrets#list-organization-secrets) | read |  |
| [GET /orgs/{org}/codespaces/secrets/public-key](/en/rest/codespaces/organization-secrets#get-an-organization-public-key) | read |  |
| [GET /orgs/{org}/codespaces/secrets/{secret\_name}](/en/rest/codespaces/organization-secrets#get-an-organization-secret) | read |  |
| [GET /orgs/{org}/codespaces/secrets/{secret\_name}/repositories](/en/rest/codespaces/organization-secrets#list-selected-repositories-for-an-organization-secret) | read |  |

## [Organization permissions for "Organization codespaces settings"](#organization-permissions-for-organization-codespaces-settings)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /orgs/{org}/codespaces/access](/en/rest/codespaces/organizations#manage-access-control-for-organization-codespaces) | write |  |
| [POST /orgs/{org}/codespaces/access/selected\_users](/en/rest/codespaces/organizations#add-users-to-codespaces-access-for-an-organization) | write |  |
| [DELETE /orgs/{org}/codespaces/access/selected\_users](/en/rest/codespaces/organizations#remove-users-from-codespaces-access-for-an-organization) | write |  |

## [Organization permissions for "Organization codespaces"](#organization-permissions-for-organization-codespaces)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [DELETE /orgs/{org}/members/{username}/codespaces/{codespace\_name}](/en/rest/codespaces/organizations#delete-a-codespace-from-the-organization) | write |  |
| [POST /orgs/{org}/members/{username}/codespaces/{codespace\_name}/stop](/en/rest/codespaces/organizations#stop-a-codespace-for-an-organization-user) | write |  |
| [GET /orgs/{org}/codespaces](/en/rest/codespaces/organizations#list-codespaces-for-the-organization) | read |  |
| [GET /orgs/{org}/members/{username}/codespaces](/en/rest/codespaces/organizations#list-codespaces-for-a-user-in-organization) | read |  |

## [Organization permissions for "Organization dependabot secrets"](#organization-permissions-for-organization-dependabot-secrets)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /orgs/{org}/dependabot/secrets/{secret\_name}](/en/rest/dependabot/secrets#create-or-update-an-organization-secret) | write |  |
| [DELETE /orgs/{org}/dependabot/secrets/{secret\_name}](/en/rest/dependabot/secrets#delete-an-organization-secret) | write |  |
| [PUT /orgs/{org}/dependabot/secrets/{secret\_name}/repositories](/en/rest/dependabot/secrets#set-selected-repositories-for-an-organization-secret) | write |  |
| [PUT /orgs/{org}/dependabot/secrets/{secret\_name}/repositories/{repository\_id}](/en/rest/dependabot/secrets#add-selected-repository-to-an-organization-secret) | write |  |
| [DELETE /orgs/{org}/dependabot/secrets/{secret\_name}/repositories/{repository\_id}](/en/rest/dependabot/secrets#remove-selected-repository-from-an-organization-secret) | write |  |
| [GET /orgs/{org}/dependabot/secrets](/en/rest/dependabot/secrets#list-organization-secrets) | read |  |
| [GET /orgs/{org}/dependabot/secrets/public-key](/en/rest/dependabot/secrets#get-an-organization-public-key) | read |  |
| [GET /orgs/{org}/dependabot/secrets/{secret\_name}](/en/rest/dependabot/secrets#get-an-organization-secret) | read |  |
| [GET /orgs/{org}/dependabot/secrets/{secret\_name}/repositories](/en/rest/dependabot/secrets#list-selected-repositories-for-an-organization-secret) | read |  |

## [Organization permissions for "Organization private registries"](#organization-permissions-for-organization-private-registries)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/private-registries](/en/rest/private-registries/organization-configurations#create-a-private-registry-for-an-organization) | write |  |
| [PATCH /orgs/{org}/private-registries/{secret\_name}](/en/rest/private-registries/organization-configurations#update-a-private-registry-for-an-organization) | write |  |
| [DELETE /orgs/{org}/private-registries/{secret\_name}](/en/rest/private-registries/organization-configurations#delete-a-private-registry-for-an-organization) | write |  |
| [GET /orgs/{org}/private-registries](/en/rest/private-registries/organization-configurations#list-private-registries-for-an-organization) | read |  |
| [GET /orgs/{org}/private-registries/public-key](/en/rest/private-registries/organization-configurations#get-private-registries-public-key-for-an-organization) | read |  |
| [GET /orgs/{org}/private-registries/{secret\_name}](/en/rest/private-registries/organization-configurations#get-a-private-registry-for-an-organization) | read |  |

## [Organization permissions for "Projects"](#organization-permissions-for-projects)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/projectsV2/{project\_number}/drafts](/en/rest/projects/drafts#create-draft-item-for-organization-owned-project) | write |  |
| [POST /orgs/{org}/projectsV2/{project\_number}/fields](/en/rest/projects/fields#add-a-field-to-an-organization-owned-project) | write |  |
| [POST /orgs/{org}/projectsV2/{project\_number}/items](/en/rest/projects/items#add-item-to-organization-owned-project) | write |  |
| [PATCH /orgs/{org}/projectsV2/{project\_number}/items/{item\_id}](/en/rest/projects/items#update-project-item-for-organization) | write |  |
| [DELETE /orgs/{org}/projectsV2/{project\_number}/items/{item\_id}](/en/rest/projects/items#delete-project-item-for-organization) | write |  |
| [POST /orgs/{org}/projectsV2/{project\_number}/views](/en/rest/projects/views#create-a-view-for-an-organization-owned-project) | write |  |
| [GET /orgs/{org}/projectsV2](/en/rest/projects/projects#list-projects-for-organization) | read |  |
| [GET /orgs/{org}/projectsV2/{project\_number}](/en/rest/projects/projects#get-project-for-organization) | read |  |
| [GET /orgs/{org}/projectsV2/{project\_number}/fields](/en/rest/projects/fields#list-project-fields-for-organization) | read |  |
| [GET /orgs/{org}/projectsV2/{project\_number}/fields/{field\_id}](/en/rest/projects/fields#get-project-field-for-organization) | read |  |
| [GET /orgs/{org}/projectsV2/{project\_number}/items](/en/rest/projects/items#list-items-for-an-organization-owned-project) | read |  |
| [GET /orgs/{org}/projectsV2/{project\_number}/items/{item\_id}](/en/rest/projects/items#get-an-item-for-an-organization-owned-project) | read |  |
| [GET /orgs/{org}/projectsV2/{project\_number}/views/{view\_number}/items](/en/rest/projects/items#list-items-for-an-organization-project-view) | read |  |

## [Organization permissions for "Secrets"](#organization-permissions-for-secrets)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /orgs/{org}/actions/secrets/{secret\_name}](/en/rest/actions/secrets#create-or-update-an-organization-secret) | write |  |
| [DELETE /orgs/{org}/actions/secrets/{secret\_name}](/en/rest/actions/secrets#delete-an-organization-secret) | write |  |
| [PUT /orgs/{org}/actions/secrets/{secret\_name}/repositories](/en/rest/actions/secrets#set-selected-repositories-for-an-organization-secret) | write |  |
| [PUT /orgs/{org}/actions/secrets/{secret\_name}/repositories/{repository\_id}](/en/rest/actions/secrets#add-selected-repository-to-an-organization-secret) | write |  |
| [DELETE /orgs/{org}/actions/secrets/{secret\_name}/repositories/{repository\_id}](/en/rest/actions/secrets#remove-selected-repository-from-an-organization-secret) | write |  |
| [GET /orgs/{org}/actions/secrets](/en/rest/actions/secrets#list-organization-secrets) | read |  |
| [GET /orgs/{org}/actions/secrets/public-key](/en/rest/actions/secrets#get-an-organization-public-key) | read |  |
| [GET /orgs/{org}/actions/secrets/{secret\_name}](/en/rest/actions/secrets#get-an-organization-secret) | read |  |
| [GET /orgs/{org}/actions/secrets/{secret\_name}/repositories](/en/rest/actions/secrets#list-selected-repositories-for-an-organization-secret) | read |  |

## [Organization permissions for "Self-hosted runners"](#organization-permissions-for-self-hosted-runners)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/actions/runner-groups](/en/rest/actions/self-hosted-runner-groups#create-a-self-hosted-runner-group-for-an-organization) | write |  |
| [PATCH /orgs/{org}/actions/runner-groups/{runner\_group\_id}](/en/rest/actions/self-hosted-runner-groups#update-a-self-hosted-runner-group-for-an-organization) | write |  |
| [DELETE /orgs/{org}/actions/runner-groups/{runner\_group\_id}](/en/rest/actions/self-hosted-runner-groups#delete-a-self-hosted-runner-group-from-an-organization) | write |  |
| [PUT /orgs/{org}/actions/runner-groups/{runner\_group\_id}/repositories](/en/rest/actions/self-hosted-runner-groups#set-repository-access-for-a-self-hosted-runner-group-in-an-organization) | write |  |
| [PUT /orgs/{org}/actions/runner-groups/{runner\_group\_id}/repositories/{repository\_id}](/en/rest/actions/self-hosted-runner-groups#add-repository-access-to-a-self-hosted-runner-group-in-an-organization) | write |  |
| [DELETE /orgs/{org}/actions/runner-groups/{runner\_group\_id}/repositories/{repository\_id}](/en/rest/actions/self-hosted-runner-groups#remove-repository-access-to-a-self-hosted-runner-group-in-an-organization) | write |  |
| [PUT /orgs/{org}/actions/runner-groups/{runner\_group\_id}/runners](/en/rest/actions/self-hosted-runner-groups#set-self-hosted-runners-in-a-group-for-an-organization) | write |  |
| [PUT /orgs/{org}/actions/runner-groups/{runner\_group\_id}/runners/{runner\_id}](/en/rest/actions/self-hosted-runner-groups#add-a-self-hosted-runner-to-a-group-for-an-organization) | write |  |
| [DELETE /orgs/{org}/actions/runner-groups/{runner\_group\_id}/runners/{runner\_id}](/en/rest/actions/self-hosted-runner-groups#remove-a-self-hosted-runner-from-a-group-for-an-organization) | write |  |
| [POST /orgs/{org}/actions/runners/generate-jitconfig](/en/rest/actions/self-hosted-runners#create-configuration-for-a-just-in-time-runner-for-an-organization) | write |  |
| [POST /orgs/{org}/actions/runners/registration-token](/en/rest/actions/self-hosted-runners#create-a-registration-token-for-an-organization) | write |  |
| [POST /orgs/{org}/actions/runners/remove-token](/en/rest/actions/self-hosted-runners#create-a-remove-token-for-an-organization) | write |  |
| [DELETE /orgs/{org}/actions/runners/{runner\_id}](/en/rest/actions/self-hosted-runners#delete-a-self-hosted-runner-from-an-organization) | write |  |
| [POST /orgs/{org}/actions/runners/{runner\_id}/labels](/en/rest/actions/self-hosted-runners#add-custom-labels-to-a-self-hosted-runner-for-an-organization) | write |  |
| [PUT /orgs/{org}/actions/runners/{runner\_id}/labels](/en/rest/actions/self-hosted-runners#set-custom-labels-for-a-self-hosted-runner-for-an-organization) | write |  |
| [DELETE /orgs/{org}/actions/runners/{runner\_id}/labels](/en/rest/actions/self-hosted-runners#remove-all-custom-labels-from-a-self-hosted-runner-for-an-organization) | write |  |
| [DELETE /orgs/{org}/actions/runners/{runner\_id}/labels/{name}](/en/rest/actions/self-hosted-runners#remove-a-custom-label-from-a-self-hosted-runner-for-an-organization) | write |  |
| [GET /orgs/{org}/actions/runner-groups](/en/rest/actions/self-hosted-runner-groups#list-self-hosted-runner-groups-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/runner-groups/{runner\_group\_id}](/en/rest/actions/self-hosted-runner-groups#get-a-self-hosted-runner-group-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/runner-groups/{runner\_group\_id}/hosted-runners](/en/rest/actions/self-hosted-runner-groups#list-github-hosted-runners-in-a-group-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/runner-groups/{runner\_group\_id}/repositories](/en/rest/actions/self-hosted-runner-groups#list-repository-access-to-a-self-hosted-runner-group-in-an-organization) | read |  |
| [GET /orgs/{org}/actions/runner-groups/{runner\_group\_id}/runners](/en/rest/actions/self-hosted-runner-groups#list-self-hosted-runners-in-a-group-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/runners](/en/rest/actions/self-hosted-runners#list-self-hosted-runners-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/runners/downloads](/en/rest/actions/self-hosted-runners#list-runner-applications-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/runners/{runner\_id}](/en/rest/actions/self-hosted-runners#get-a-self-hosted-runner-for-an-organization) | read |  |
| [GET /orgs/{org}/actions/runners/{runner\_id}/labels](/en/rest/actions/self-hosted-runners#list-labels-for-a-self-hosted-runner-for-an-organization) | read |  |

## [Organization permissions for "Variables"](#organization-permissions-for-variables)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/actions/variables](/en/rest/actions/variables#create-an-organization-variable) | write |  |
| [PATCH /orgs/{org}/actions/variables/{name}](/en/rest/actions/variables#update-an-organization-variable) | write |  |
| [DELETE /orgs/{org}/actions/variables/{name}](/en/rest/actions/variables#delete-an-organization-variable) | write |  |
| [PUT /orgs/{org}/actions/variables/{name}/repositories](/en/rest/actions/variables#set-selected-repositories-for-an-organization-variable) | write |  |
| [PUT /orgs/{org}/actions/variables/{name}/repositories/{repository\_id}](/en/rest/actions/variables#add-selected-repository-to-an-organization-variable) | write |  |
| [DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository\_id}](/en/rest/actions/variables#remove-selected-repository-from-an-organization-variable) | write |  |
| [GET /orgs/{org}/actions/variables](/en/rest/actions/variables#list-organization-variables) | read |  |
| [GET /orgs/{org}/actions/variables/{name}](/en/rest/actions/variables#get-an-organization-variable) | read |  |
| [GET /orgs/{org}/actions/variables/{name}/repositories](/en/rest/actions/variables#list-selected-repositories-for-an-organization-variable) | read |  |

## [Organization permissions for "Webhooks"](#organization-permissions-for-webhooks)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/hooks](/en/rest/orgs/webhooks#create-an-organization-webhook) | write |  |
| [PATCH /orgs/{org}/hooks/{hook\_id}](/en/rest/orgs/webhooks#update-an-organization-webhook) | write |  |
| [DELETE /orgs/{org}/hooks/{hook\_id}](/en/rest/orgs/webhooks#delete-an-organization-webhook) | write |  |
| [PATCH /orgs/{org}/hooks/{hook\_id}/config](/en/rest/orgs/webhooks#update-a-webhook-configuration-for-an-organization) | write |  |
| [POST /orgs/{org}/hooks/{hook\_id}/deliveries/{delivery\_id}/attempts](/en/rest/orgs/webhooks#redeliver-a-delivery-for-an-organization-webhook) | write |  |
| [POST /orgs/{org}/hooks/{hook\_id}/pings](/en/rest/orgs/webhooks#ping-an-organization-webhook) | write |  |
| [GET /orgs/{org}/hooks](/en/rest/orgs/webhooks#list-organization-webhooks) | read |  |
| [GET /orgs/{org}/hooks/{hook\_id}](/en/rest/orgs/webhooks#get-an-organization-webhook) | read |  |
| [GET /orgs/{org}/hooks/{hook\_id}/config](/en/rest/orgs/webhooks#get-a-webhook-configuration-for-an-organization) | read |  |
| [GET /orgs/{org}/hooks/{hook\_id}/deliveries](/en/rest/orgs/webhooks#list-deliveries-for-an-organization-webhook) | read |  |
| [GET /orgs/{org}/hooks/{hook\_id}/deliveries/{delivery\_id}](/en/rest/orgs/webhooks#get-a-webhook-delivery-for-an-organization-webhook) | read |  |

## [Repository permissions for "Actions"](#repository-permissions-for-actions)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact\_id}](/en/rest/actions/artifacts#delete-an-artifact) | write |  |
| [DELETE /repos/{owner}/{repo}/actions/caches](/en/rest/actions/cache#delete-github-actions-caches-for-a-repository-using-a-cache-key) | write |  |
| [DELETE /repos/{owner}/{repo}/actions/caches/{cache\_id}](/en/rest/actions/cache#delete-a-github-actions-cache-for-a-repository-using-a-cache-id) | write |  |
| [POST /repos/{owner}/{repo}/actions/jobs/{job\_id}/rerun](/en/rest/actions/workflow-runs#re-run-a-job-from-a-workflow-run) | write |  |
| [PUT /repos/{owner}/{repo}/actions/oidc/customization/sub](/en/rest/actions/oidc#set-the-customization-template-for-an-oidc-subject-claim-for-a-repository) | write |  |
| [DELETE /repos/{owner}/{repo}/actions/runs/{run\_id}](/en/rest/actions/workflow-runs#delete-a-workflow-run) | write |  |
| [POST /repos/{owner}/{repo}/actions/runs/{run\_id}/approve](/en/rest/actions/workflow-runs#approve-a-workflow-run-for-a-fork-pull-request) | write |  |
| [POST /repos/{owner}/{repo}/actions/runs/{run\_id}/cancel](/en/rest/actions/workflow-runs#cancel-a-workflow-run) | write |  |
| [POST /repos/{owner}/{repo}/actions/runs/{run\_id}/force-cancel](/en/rest/actions/workflow-runs#force-cancel-a-workflow-run) | write |  |
| [DELETE /repos/{owner}/{repo}/actions/runs/{run\_id}/logs](/en/rest/actions/workflow-runs#delete-workflow-run-logs) | write |  |
| [POST /repos/{owner}/{repo}/actions/runs/{run\_id}/rerun](/en/rest/actions/workflow-runs#re-run-a-workflow) | write |  |
| [POST /repos/{owner}/{repo}/actions/runs/{run\_id}/rerun-failed-jobs](/en/rest/actions/workflow-runs#re-run-failed-jobs-from-a-workflow-run) | write |  |
| [PUT /repos/{owner}/{repo}/actions/workflows/{workflow\_id}/disable](/en/rest/actions/workflows#disable-a-workflow) | write |  |
| [POST /repos/{owner}/{repo}/actions/workflows/{workflow\_id}/dispatches](/en/rest/actions/workflows#create-a-workflow-dispatch-event) | write |  |
| [PUT /repos/{owner}/{repo}/actions/workflows/{workflow\_id}/enable](/en/rest/actions/workflows#enable-a-workflow) | write |  |
| [GET /repos/{owner}/{repo}/actions/artifacts](/en/rest/actions/artifacts#list-artifacts-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/artifacts/{artifact\_id}](/en/rest/actions/artifacts#get-an-artifact) | read |  |
| [GET /repos/{owner}/{repo}/actions/artifacts/{artifact\_id}/{archive\_format}](/en/rest/actions/artifacts#download-an-artifact) | read |  |
| [GET /repos/{owner}/{repo}/actions/cache/storage-limit](/en/rest/actions/cache#get-github-actions-cache-storage-limit-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/cache/usage](/en/rest/actions/cache#get-github-actions-cache-usage-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/caches](/en/rest/actions/cache#list-github-actions-caches-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/concurrency\_groups](/en/rest/actions/concurrency-groups#list-concurrency-groups-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/concurrency\_groups/{concurrency\_group\_name}](/en/rest/actions/concurrency-groups#get-a-concurrency-group-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/jobs/{job\_id}](/en/rest/actions/workflow-jobs#get-a-job-for-a-workflow-run) | read |  |
| [GET /repos/{owner}/{repo}/actions/jobs/{job\_id}/logs](/en/rest/actions/workflow-jobs#download-job-logs-for-a-workflow-run) | read |  |
| [GET /repos/{owner}/{repo}/actions/oidc/customization/sub](/en/rest/actions/oidc#get-the-customization-template-for-an-oidc-subject-claim-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/runs](/en/rest/actions/workflow-runs#list-workflow-runs-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/runs/{run\_id}](/en/rest/actions/workflow-runs#get-a-workflow-run) | read |  |
| [GET /repos/{owner}/{repo}/actions/runs/{run\_id}/approvals](/en/rest/actions/workflow-runs#get-the-review-history-for-a-workflow-run) | read |  |
| [GET /repos/{owner}/{repo}/actions/runs/{run\_id}/artifacts](/en/rest/actions/artifacts#list-workflow-run-artifacts) | read |  |
| [GET /repos/{owner}/{repo}/actions/runs/{run\_id}/attempts/{attempt\_number}](/en/rest/actions/workflow-runs#get-a-workflow-run-attempt) | read |  |
| [GET /repos/{owner}/{repo}/actions/runs/{run\_id}/attempts/{attempt\_number}/jobs](/en/rest/actions/workflow-jobs#list-jobs-for-a-workflow-run-attempt) | read |  |
| [GET /repos/{owner}/{repo}/actions/runs/{run\_id}/attempts/{attempt\_number}/logs](/en/rest/actions/workflow-runs#download-workflow-run-attempt-logs) | read |  |
| [GET /repos/{owner}/{repo}/actions/runs/{run\_id}/concurrency\_groups](/en/rest/actions/concurrency-groups#list-concurrency-groups-for-a-workflow-run) | read |  |
| [GET /repos/{owner}/{repo}/actions/runs/{run\_id}/jobs](/en/rest/actions/workflow-jobs#list-jobs-for-a-workflow-run) | read |  |
| [GET /repos/{owner}/{repo}/actions/runs/{run\_id}/logs](/en/rest/actions/workflow-runs#download-workflow-run-logs) | read |  |
| [GET /repos/{owner}/{repo}/actions/runs/{run\_id}/pending\_deployments](/en/rest/actions/workflow-runs#get-pending-deployments-for-a-workflow-run) | read |  |
| [GET /repos/{owner}/{repo}/actions/runs/{run\_id}/timing](/en/rest/actions/workflow-runs#get-workflow-run-usage) | read |  |
| [GET /repos/{owner}/{repo}/actions/workflows](/en/rest/actions/workflows#list-repository-workflows) | read |  |
| [GET /repos/{owner}/{repo}/actions/workflows/{workflow\_id}](/en/rest/actions/workflows#get-a-workflow) | read |  |
| [GET /repos/{owner}/{repo}/actions/workflows/{workflow\_id}/runs](/en/rest/actions/workflow-runs#list-workflow-runs-for-a-workflow) | read |  |
| [GET /repos/{owner}/{repo}/actions/workflows/{workflow\_id}/timing](/en/rest/actions/workflows#get-workflow-usage) | read |  |
| [GET /repos/{owner}/{repo}/environments](/en/rest/deployments/environments#list-environments) | read |  |
| [GET /repos/{owner}/{repo}/environments/{environment\_name}](/en/rest/deployments/environments#get-an-environment) | read |  |
| [GET /repos/{owner}/{repo}/environments/{environment\_name}/deployment-branch-policies](/en/rest/deployments/branch-policies#list-deployment-branch-policies) | read |  |
| [GET /repos/{owner}/{repo}/environments/{environment\_name}/deployment-branch-policies/{branch\_policy\_id}](/en/rest/deployments/branch-policies#get-a-deployment-branch-policy) | read |  |
| [GET /repos/{owner}/{repo}/environments/{environment\_name}/deployment\_protection\_rules](/en/rest/deployments/protection-rules#get-all-deployment-protection-rules-for-an-environment) | read |  |
| [GET /repos/{owner}/{repo}/environments/{environment\_name}/deployment\_protection\_rules/{protection\_rule\_id}](/en/rest/deployments/protection-rules#get-a-custom-deployment-protection-rule) | read |  |

## [Repository permissions for "Administration"](#repository-permissions-for-administration)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/repos](/en/rest/repos/repos#create-an-organization-repository) | write |  |
| [PUT /orgs/{org}/teams/{team\_slug}/repos/{owner}/{repo}](/en/rest/teams/teams#add-or-update-team-repository-permissions) | write |  |
| [DELETE /orgs/{org}/teams/{team\_slug}/repos/{owner}/{repo}](/en/rest/teams/teams#remove-a-repository-from-a-team) | write |  |
| [PATCH /repos/{owner}/{repo}](/en/rest/repos/repos#update-a-repository) | write |  |
| [DELETE /repos/{owner}/{repo}](/en/rest/repos/repos#delete-a-repository) | write |  |
| [PUT /repos/{owner}/{repo}/actions/cache/retention-limit](/en/rest/actions/cache#set-github-actions-cache-retention-limit-for-a-repository) | write |  |
| [PUT /repos/{owner}/{repo}/actions/cache/storage-limit](/en/rest/actions/cache#set-github-actions-cache-storage-limit-for-a-repository) | write |  |
| [PUT /repos/{owner}/{repo}/actions/permissions](/en/rest/actions/permissions#set-github-actions-permissions-for-a-repository) | write |  |
| [PUT /repos/{owner}/{repo}/actions/permissions/access](/en/rest/actions/permissions#set-the-level-of-access-for-workflows-outside-of-the-repository) | write |  |
| [PUT /repos/{owner}/{repo}/actions/permissions/artifact-and-log-retention](/en/rest/actions/permissions#set-artifact-and-log-retention-settings-for-a-repository) | write |  |
| [PUT /repos/{owner}/{repo}/actions/permissions/fork-pr-contributor-approval](/en/rest/actions/permissions#set-fork-pr-contributor-approval-permissions-for-a-repository) | write |  |
| [PUT /repos/{owner}/{repo}/actions/permissions/fork-pr-workflows-private-repos](/en/rest/actions/permissions#set-private-repo-fork-pr-workflow-settings-for-a-repository) | write |  |
| [PUT /repos/{owner}/{repo}/actions/permissions/selected-actions](/en/rest/actions/permissions#set-allowed-actions-and-reusable-workflows-for-a-repository) | write |  |
| [PUT /repos/{owner}/{repo}/actions/permissions/workflow](/en/rest/actions/permissions#set-default-workflow-permissions-for-a-repository) | write |  |
| [POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig](/en/rest/actions/self-hosted-runners#create-configuration-for-a-just-in-time-runner-for-a-repository) | write |  |
| [POST /repos/{owner}/{repo}/actions/runners/registration-token](/en/rest/actions/self-hosted-runners#create-a-registration-token-for-a-repository) | write |  |
| [POST /repos/{owner}/{repo}/actions/runners/remove-token](/en/rest/actions/self-hosted-runners#create-a-remove-token-for-a-repository) | write |  |
| [DELETE /repos/{owner}/{repo}/actions/runners/{runner\_id}](/en/rest/actions/self-hosted-runners#delete-a-self-hosted-runner-from-a-repository) | write |  |
| [POST /repos/{owner}/{repo}/actions/runners/{runner\_id}/labels](/en/rest/actions/self-hosted-runners#add-custom-labels-to-a-self-hosted-runner-for-a-repository) | write |  |
| [PUT /repos/{owner}/{repo}/actions/runners/{runner\_id}/labels](/en/rest/actions/self-hosted-runners#set-custom-labels-for-a-self-hosted-runner-for-a-repository) | write |  |
| [DELETE /repos/{owner}/{repo}/actions/runners/{runner\_id}/labels](/en/rest/actions/self-hosted-runners#remove-all-custom-labels-from-a-self-hosted-runner-for-a-repository) | write |  |
| [DELETE /repos/{owner}/{repo}/actions/runners/{runner\_id}/labels/{name}](/en/rest/actions/self-hosted-runners#remove-a-custom-label-from-a-self-hosted-runner-for-a-repository) | write |  |
| [POST /repos/{owner}/{repo}/autolinks](/en/rest/repos/autolinks#create-an-autolink-reference-for-a-repository) | write |  |
| [DELETE /repos/{owner}/{repo}/autolinks/{autolink\_id}](/en/rest/repos/autolinks#delete-an-autolink-reference-from-a-repository) | write |  |
| [PUT /repos/{owner}/{repo}/automated-security-fixes](/en/rest/repos/repos#enable-dependabot-security-updates) | write |  |
| [DELETE /repos/{owner}/{repo}/automated-security-fixes](/en/rest/repos/repos#disable-dependabot-security-updates) | write |  |
| [PUT /repos/{owner}/{repo}/branches/{branch}/protection](/en/rest/branches/branch-protection#update-branch-protection) | write |  |
| [DELETE /repos/{owner}/{repo}/branches/{branch}/protection](/en/rest/branches/branch-protection#delete-branch-protection) | write |  |
| [POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce\_admins](/en/rest/branches/branch-protection#set-admin-branch-protection) | write |  |
| [DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce\_admins](/en/rest/branches/branch-protection#delete-admin-branch-protection) | write |  |
| [PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required\_pull\_request\_reviews](/en/rest/branches/branch-protection#update-pull-request-review-protection) | write |  |
| [DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required\_pull\_request\_reviews](/en/rest/branches/branch-protection#delete-pull-request-review-protection) | write |  |
| [POST /repos/{owner}/{repo}/branches/{branch}/protection/required\_signatures](/en/rest/branches/branch-protection#create-commit-signature-protection) | write |  |
| [DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required\_signatures](/en/rest/branches/branch-protection#delete-commit-signature-protection) | write |  |
| [PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required\_status\_checks](/en/rest/branches/branch-protection#update-status-check-protection) | write |  |
| [DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required\_status\_checks](/en/rest/branches/branch-protection#remove-status-check-protection) | write |  |
| [POST /repos/{owner}/{repo}/branches/{branch}/protection/required\_status\_checks/contexts](/en/rest/branches/branch-protection#add-status-check-contexts) | write |  |
| [PUT /repos/{owner}/{repo}/branches/{branch}/protection/required\_status\_checks/contexts](/en/rest/branches/branch-protection#set-status-check-contexts) | write |  |
| [DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required\_status\_checks/contexts](/en/rest/branches/branch-protection#remove-status-check-contexts) | write |  |
| [DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions](/en/rest/branches/branch-protection#delete-access-restrictions) | write |  |
| [POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps](/en/rest/branches/branch-protection#add-app-access-restrictions) | write |  |
| [PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps](/en/rest/branches/branch-protection#set-app-access-restrictions) | write |  |
| [DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps](/en/rest/branches/branch-protection#remove-app-access-restrictions) | write |  |
| [POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams](/en/rest/branches/branch-protection#add-team-access-restrictions) | write |  |
| [PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams](/en/rest/branches/branch-protection#set-team-access-restrictions) | write |  |
| [DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams](/en/rest/branches/branch-protection#remove-team-access-restrictions) | write |  |
| [POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users](/en/rest/branches/branch-protection#add-user-access-restrictions) | write |  |
| [PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users](/en/rest/branches/branch-protection#set-user-access-restrictions) | write |  |
| [DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users](/en/rest/branches/branch-protection#remove-user-access-restrictions) | write |  |
| [GET /repos/{owner}/{repo}/code-quality/setup](/en/rest/code-quality/code-quality#get-a-code-quality-setup-configuration) | write |  |
| [PATCH /repos/{owner}/{repo}/code-quality/setup](/en/rest/code-quality/code-quality#update-a-code-quality-setup-configuration) | write |  |
| [PATCH /repos/{owner}/{repo}/code-scanning/default-setup](/en/rest/code-scanning/code-scanning#update-a-code-scanning-default-setup-configuration) | write |  |
| [PUT /repos/{owner}/{repo}/collaborators/{username}](/en/rest/collaborators/collaborators#add-a-repository-collaborator) | write |  |
| [DELETE /repos/{owner}/{repo}/collaborators/{username}](/en/rest/collaborators/collaborators#remove-a-repository-collaborator) | write |  |
| [PUT /repos/{owner}/{repo}/environments/{environment\_name}](/en/rest/deployments/environments#create-or-update-an-environment) | write |  |
| [DELETE /repos/{owner}/{repo}/environments/{environment\_name}](/en/rest/deployments/environments#delete-an-environment) | write |  |
| [POST /repos/{owner}/{repo}/environments/{environment\_name}/deployment-branch-policies](/en/rest/deployments/branch-policies#create-a-deployment-branch-policy) | write |  |
| [PUT /repos/{owner}/{repo}/environments/{environment\_name}/deployment-branch-policies/{branch\_policy\_id}](/en/rest/deployments/branch-policies#update-a-deployment-branch-policy) | write |  |
| [DELETE /repos/{owner}/{repo}/environments/{environment\_name}/deployment-branch-policies/{branch\_policy\_id}](/en/rest/deployments/branch-policies#delete-a-deployment-branch-policy) | write |  |
| [POST /repos/{owner}/{repo}/environments/{environment\_name}/deployment\_protection\_rules](/en/rest/deployments/protection-rules#create-a-custom-deployment-protection-rule-on-an-environment) | write |  |
| [DELETE /repos/{owner}/{repo}/environments/{environment\_name}/deployment\_protection\_rules/{protection\_rule\_id}](/en/rest/deployments/protection-rules#disable-a-custom-protection-rule-for-an-environment) | write |  |
| [POST /repos/{owner}/{repo}/forks](/en/rest/repos/forks#create-a-fork) | write |  |
| [PUT /repos/{owner}/{repo}/immutable-releases](/en/rest/repos/repos#enable-immutable-releases) | write |  |
| [DELETE /repos/{owner}/{repo}/immutable-releases](/en/rest/repos/repos#disable-immutable-releases) | write |  |
| [PUT /repos/{owner}/{repo}/interaction-limits](/en/rest/interactions/repos#set-interaction-restrictions-for-a-repository) | write |  |
| [DELETE /repos/{owner}/{repo}/interaction-limits](/en/rest/interactions/repos#remove-interaction-restrictions-for-a-repository) | write |  |
| [GET /repos/{owner}/{repo}/interaction-limits/pulls/bypass-list](/en/rest/interactions/repos#get-pull-request-creation-cap-bypass-list-for-a-repository) | write |  |
| [PUT /repos/{owner}/{repo}/interaction-limits/pulls/bypass-list](/en/rest/interactions/repos#add-users-to-the-pull-request-creation-cap-bypass-list-for-a-repository) | write |  |
| [DELETE /repos/{owner}/{repo}/interaction-limits/pulls/bypass-list](/en/rest/interactions/repos#remove-users-from-the-pull-request-creation-cap-bypass-list-for-a-repository) | write |  |
| [GET /repos/{owner}/{repo}/interaction-limits/pulls/creation-cap](/en/rest/interactions/repos#get-pull-request-creation-cap-for-a-repository) | write |  |
| [PATCH /repos/{owner}/{repo}/interaction-limits/pulls/creation-cap](/en/rest/interactions/repos#update-pull-request-creation-cap-for-a-repository) | write |  |
| [PATCH /repos/{owner}/{repo}/invitations/{invitation\_id}](/en/rest/collaborators/invitations#update-a-repository-invitation) | write |  |
| [DELETE /repos/{owner}/{repo}/invitations/{invitation\_id}](/en/rest/collaborators/invitations#delete-a-repository-invitation) | write |  |
| [POST /repos/{owner}/{repo}/keys](/en/rest/deploy-keys/deploy-keys#create-a-deploy-key) | write |  |
| [DELETE /repos/{owner}/{repo}/keys/{key\_id}](/en/rest/deploy-keys/deploy-keys#delete-a-deploy-key) | write |  |
| [POST /repos/{owner}/{repo}/pages](/en/rest/pages/pages#create-a-github-pages-site) | write |  |
| [PUT /repos/{owner}/{repo}/pages](/en/rest/pages/pages#update-information-about-a-github-pages-site) | write |  |
| [DELETE /repos/{owner}/{repo}/pages](/en/rest/pages/pages#delete-a-github-pages-site) | write |  |
| [GET /repos/{owner}/{repo}/pages/health](/en/rest/pages/pages#get-a-dns-health-check-for-github-pages) | write |  |
| [PUT /repos/{owner}/{repo}/private-vulnerability-reporting](/en/rest/repos/repos#enable-private-vulnerability-reporting-for-a-repository) | write |  |
| [DELETE /repos/{owner}/{repo}/private-vulnerability-reporting](/en/rest/repos/repos#disable-private-vulnerability-reporting-for-a-repository) | write |  |
| [POST /repos/{owner}/{repo}/rulesets](/en/rest/repos/rules#create-a-repository-ruleset) | write |  |
| [PUT /repos/{owner}/{repo}/rulesets/{ruleset\_id}](/en/rest/repos/rules#update-a-repository-ruleset) | write |  |
| [DELETE /repos/{owner}/{repo}/rulesets/{ruleset\_id}](/en/rest/repos/rules#delete-a-repository-ruleset) | write |  |
| [GET /repos/{owner}/{repo}/rulesets/{ruleset\_id}/history](/en/rest/repos/rules#get-repository-ruleset-history) | write |  |
| [GET /repos/{owner}/{repo}/rulesets/{ruleset\_id}/history/{version\_id}](/en/rest/repos/rules#get-repository-ruleset-version) | write |  |
| [POST /repos/{owner}/{repo}/security-advisories/{ghsa\_id}/forks](/en/rest/security-advisories/repository-advisories#create-a-temporary-private-fork) | write |  |
| [PUT /repos/{owner}/{repo}/topics](/en/rest/repos/repos#replace-all-repository-topics) | write |  |
| [PUT /repos/{owner}/{repo}/vulnerability-alerts](/en/rest/repos/repos#enable-vulnerability-alerts) | write |  |
| [DELETE /repos/{owner}/{repo}/vulnerability-alerts](/en/rest/repos/repos#disable-vulnerability-alerts) | write |  |
| [POST /repos/{template\_owner}/{template\_repo}/generate](/en/rest/repos/repos#create-a-repository-using-a-template) | write |  |
| [PUT /teams/{team\_id}/repos/{owner}/{repo}](/en/rest/teams/teams#add-or-update-team-repository-permissions-legacy) | write |  |
| [DELETE /teams/{team\_id}/repos/{owner}/{repo}](/en/rest/teams/teams#remove-a-repository-from-a-team-legacy) | write |  |
| [POST /user/repos](/en/rest/repos/repos#create-a-repository-for-the-authenticated-user) | write |  |
| [DELETE /user/repository\_invitations/{invitation\_id}](/en/rest/collaborators/invitations#decline-a-repository-invitation) | write |  |
| [GET /repos/{owner}/{repo}/actions/cache/retention-limit](/en/rest/actions/cache#get-github-actions-cache-retention-limit-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/permissions](/en/rest/actions/permissions#get-github-actions-permissions-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/permissions/access](/en/rest/actions/permissions#get-the-level-of-access-for-workflows-outside-of-the-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/permissions/artifact-and-log-retention](/en/rest/actions/permissions#get-artifact-and-log-retention-settings-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/permissions/fork-pr-contributor-approval](/en/rest/actions/permissions#get-fork-pr-contributor-approval-permissions-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/permissions/fork-pr-workflows-private-repos](/en/rest/actions/permissions#get-private-repo-fork-pr-workflow-settings-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/permissions/selected-actions](/en/rest/actions/permissions#get-allowed-actions-and-reusable-workflows-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/permissions/workflow](/en/rest/actions/permissions#get-default-workflow-permissions-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/runners](/en/rest/actions/self-hosted-runners#list-self-hosted-runners-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/runners/downloads](/en/rest/actions/self-hosted-runners#list-runner-applications-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/runners/{runner\_id}](/en/rest/actions/self-hosted-runners#get-a-self-hosted-runner-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/actions/runners/{runner\_id}/labels](/en/rest/actions/self-hosted-runners#list-labels-for-a-self-hosted-runner-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/autolinks](/en/rest/repos/autolinks#get-all-autolinks-of-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/autolinks/{autolink\_id}](/en/rest/repos/autolinks#get-an-autolink-reference-of-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/automated-security-fixes](/en/rest/repos/repos#check-if-dependabot-security-updates-are-enabled-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/branches/{branch}/protection](/en/rest/branches/branch-protection#get-branch-protection) | read |  |
| [GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce\_admins](/en/rest/branches/branch-protection#get-admin-branch-protection) | read |  |
| [GET /repos/{owner}/{repo}/branches/{branch}/protection/required\_pull\_request\_reviews](/en/rest/branches/branch-protection#get-pull-request-review-protection) | read |  |
| [GET /repos/{owner}/{repo}/branches/{branch}/protection/required\_signatures](/en/rest/branches/branch-protection#get-commit-signature-protection) | read |  |
| [GET /repos/{owner}/{repo}/branches/{branch}/protection/required\_status\_checks](/en/rest/branches/branch-protection#get-status-checks-protection) | read |  |
| [GET /repos/{owner}/{repo}/branches/{branch}/protection/required\_status\_checks/contexts](/en/rest/branches/branch-protection#get-all-status-check-contexts) | read |  |
| [GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions](/en/rest/branches/branch-protection#get-access-restrictions) | read |  |
| [GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps](/en/rest/branches/branch-protection#get-apps-with-access-to-the-protected-branch) | read |  |
| [GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams](/en/rest/branches/branch-protection#get-teams-with-access-to-the-protected-branch) | read |  |
| [GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users](/en/rest/branches/branch-protection#get-users-with-access-to-the-protected-branch) | read |  |
| [GET /repos/{owner}/{repo}/code-scanning/default-setup](/en/rest/code-scanning/code-scanning#get-a-code-scanning-default-setup-configuration) | read |  |
| [GET /repos/{owner}/{repo}/code-security-configuration](/en/rest/code-security/configurations#get-the-code-security-configuration-associated-with-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/environments/{environment\_name}/deployment\_protection\_rules/apps](/en/rest/deployments/protection-rules#list-custom-deployment-rule-integrations-available-for-an-environment) | read |  |
| [GET /repos/{owner}/{repo}/immutable-releases](/en/rest/repos/repos#check-if-immutable-releases-are-enabled-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/interaction-limits](/en/rest/interactions/repos#get-interaction-restrictions-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/invitations](/en/rest/collaborators/invitations#list-repository-invitations) | read |  |
| [GET /repos/{owner}/{repo}/keys](/en/rest/deploy-keys/deploy-keys#list-deploy-keys) | read |  |
| [GET /repos/{owner}/{repo}/keys/{key\_id}](/en/rest/deploy-keys/deploy-keys#get-a-deploy-key) | read |  |
| [GET /repos/{owner}/{repo}/rulesets/rule-suites](/en/rest/repos/rule-suites#list-repository-rule-suites) | read |  |
| [GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule\_suite\_id}](/en/rest/repos/rule-suites#get-a-repository-rule-suite) | read |  |
| [GET /repos/{owner}/{repo}/teams](/en/rest/repos/repos#list-repository-teams) | read |  |
| [GET /repos/{owner}/{repo}/traffic/clones](/en/rest/metrics/traffic#get-repository-clones) | read |  |
| [GET /repos/{owner}/{repo}/traffic/popular/paths](/en/rest/metrics/traffic#get-top-referral-paths) | read |  |
| [GET /repos/{owner}/{repo}/traffic/popular/referrers](/en/rest/metrics/traffic#get-top-referral-sources) | read |  |
| [GET /repos/{owner}/{repo}/traffic/views](/en/rest/metrics/traffic#get-page-views) | read |  |
| [GET /repos/{owner}/{repo}/vulnerability-alerts](/en/rest/repos/repos#check-if-vulnerability-alerts-are-enabled-for-a-repository) | read |  |
| [GET /user/repository\_invitations](/en/rest/collaborators/invitations#list-repository-invitations-for-the-authenticated-user) | read |  |

## [Repository permissions for "Agent secrets"](#repository-permissions-for-agent-secrets)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /repos/{owner}/{repo}/agents/secrets/{secret\_name}](/en/rest/agents/secrets#create-or-update-a-repository-secret) | write |  |
| [DELETE /repos/{owner}/{repo}/agents/secrets/{secret\_name}](/en/rest/agents/secrets#delete-a-repository-secret) | write |  |
| [GET /repos/{owner}/{repo}/agents/organization-secrets](/en/rest/agents/secrets#list-repository-organization-secrets) | read |  |
| [GET /repos/{owner}/{repo}/agents/secrets](/en/rest/agents/secrets#list-repository-secrets) | read |  |
| [GET /repos/{owner}/{repo}/agents/secrets/public-key](/en/rest/agents/secrets#get-a-repository-public-key) | read |  |
| [GET /repos/{owner}/{repo}/agents/secrets/{secret\_name}](/en/rest/agents/secrets#get-a-repository-secret) | read |  |

## [Repository permissions for "Agent variables"](#repository-permissions-for-agent-variables)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /repos/{owner}/{repo}/agents/variables](/en/rest/agents/variables#create-a-repository-variable) | write |  |
| [PATCH /repos/{owner}/{repo}/agents/variables/{name}](/en/rest/agents/variables#update-a-repository-variable) | write |  |
| [DELETE /repos/{owner}/{repo}/agents/variables/{name}](/en/rest/agents/variables#delete-a-repository-variable) | write |  |
| [GET /repos/{owner}/{repo}/agents/organization-variables](/en/rest/agents/variables#list-repository-organization-variables) | read |  |
| [GET /repos/{owner}/{repo}/agents/variables](/en/rest/agents/variables#list-repository-variables) | read |  |
| [GET /repos/{owner}/{repo}/agents/variables/{name}](/en/rest/agents/variables#get-a-repository-variable) | read |  |

## [Repository permissions for "Artifact metadata"](#repository-permissions-for-artifact-metadata)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/artifacts/metadata/deployment-record](/en/rest/orgs/artifact-metadata#create-an-artifact-deployment-record) | write |  |
| [POST /orgs/{org}/artifacts/metadata/deployment-record/cluster/{cluster}](/en/rest/orgs/artifact-metadata#set-cluster-deployment-records) | write |  |
| [POST /orgs/{org}/artifacts/metadata/storage-record](/en/rest/orgs/artifact-metadata#create-artifact-metadata-storage-record) | write |  |
| [GET /orgs/{org}/artifacts/{subject\_digest}/metadata/deployment-records](/en/rest/orgs/artifact-metadata#list-artifact-deployment-records) | read |  |
| [GET /orgs/{org}/artifacts/{subject\_digest}/metadata/storage-records](/en/rest/orgs/artifact-metadata#list-artifact-storage-records) | read |  |

## [Repository permissions for "Attestations"](#repository-permissions-for-attestations)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/attestations/delete-request](/en/rest/orgs/attestations#delete-attestations-in-bulk) | write |  |
| [DELETE /orgs/{org}/attestations/digest/{subject\_digest}](/en/rest/orgs/attestations#delete-attestations-by-subject-digest) | write |  |
| [DELETE /orgs/{org}/attestations/{attestation\_id}](/en/rest/orgs/attestations#delete-attestations-by-id) | write |  |
| [POST /repos/{owner}/{repo}/attestations](/en/rest/repos/attestations#create-an-attestation) | write |  |
| [POST /users/{username}/attestations/delete-request](/en/rest/users/attestations#delete-attestations-in-bulk) | write |  |
| [DELETE /users/{username}/attestations/digest/{subject\_digest}](/en/rest/users/attestations#delete-attestations-by-subject-digest) | write |  |
| [DELETE /users/{username}/attestations/{attestation\_id}](/en/rest/users/attestations#delete-attestations-by-id) | write |  |
| [GET /orgs/{org}/attestations/repositories](/en/rest/orgs/attestations#list-attestation-repositories) | read |  |
| [GET /repos/{owner}/{repo}/attestations/{subject\_digest}](/en/rest/repos/attestations#list-attestations) | read |  |

## [Repository permissions for "Code quality"](#repository-permissions-for-code-quality)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [GET /repos/{owner}/{repo}/code-quality/findings](/en/rest/code-quality/code-quality#list-code-quality-findings-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/code-quality/findings/{finding\_number}](/en/rest/code-quality/code-quality#get-a-code-quality-finding) | read |  |

## [Repository permissions for "Code scanning alerts"](#repository-permissions-for-code-scanning-alerts)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert\_number}](/en/rest/code-scanning/code-scanning#update-a-code-scanning-alert) | write |  |
| [POST /repos/{owner}/{repo}/code-scanning/alerts/{alert\_number}/autofix](/en/rest/code-scanning/code-scanning#create-an-autofix-for-a-code-scanning-alert) | write |  |
| [DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis\_id}](/en/rest/code-scanning/code-scanning#delete-a-code-scanning-analysis-from-a-repository) | write |  |
| [POST /repos/{owner}/{repo}/code-scanning/sarifs](/en/rest/code-scanning/code-scanning#upload-an-analysis-as-sarif-data) | write |  |
| [GET /orgs/{org}/code-scanning/alerts](/en/rest/code-scanning/code-scanning#list-code-scanning-alerts-for-an-organization) | read |  |
| [GET /repos/{owner}/{repo}/code-scanning/alerts](/en/rest/code-scanning/code-scanning#list-code-scanning-alerts-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/code-scanning/alerts/{alert\_number}](/en/rest/code-scanning/code-scanning#get-a-code-scanning-alert) | read |  |
| [GET /repos/{owner}/{repo}/code-scanning/alerts/{alert\_number}/autofix](/en/rest/code-scanning/code-scanning#get-the-status-of-an-autofix-for-a-code-scanning-alert) | read |  |
| [GET /repos/{owner}/{repo}/code-scanning/alerts/{alert\_number}/instances](/en/rest/code-scanning/code-scanning#list-instances-of-a-code-scanning-alert) | read |  |
| [GET /repos/{owner}/{repo}/code-scanning/analyses](/en/rest/code-scanning/code-scanning#list-code-scanning-analyses-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis\_id}](/en/rest/code-scanning/code-scanning#get-a-code-scanning-analysis-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif\_id}](/en/rest/code-scanning/code-scanning#get-information-about-a-sarif-upload) | read |  |

## [Repository permissions for "Codespaces lifecycle admin"](#repository-permissions-for-codespaces-lifecycle-admin)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /orgs/{org}/members/{username}/codespaces/{codespace\_name}/stop](/en/rest/codespaces/organizations#stop-a-codespace-for-an-organization-user) | write |  |
| [POST /user/codespaces/{codespace\_name}/exports](/en/rest/codespaces/codespaces#export-a-codespace-for-the-authenticated-user) | write |  |
| [POST /user/codespaces/{codespace\_name}/start](/en/rest/codespaces/codespaces#start-a-codespace-for-the-authenticated-user) | write |  |
| [POST /user/codespaces/{codespace\_name}/stop](/en/rest/codespaces/codespaces#stop-a-codespace-for-the-authenticated-user) | write |  |
| [GET /user/codespaces/{codespace\_name}/exports/{export\_id}](/en/rest/codespaces/codespaces#get-details-about-a-codespace-export) | read |  |

## [Repository permissions for "Codespaces metadata"](#repository-permissions-for-codespaces-metadata)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [GET /repos/{owner}/{repo}/codespaces/devcontainers](/en/rest/codespaces/codespaces#list-devcontainer-configurations-in-a-repository-for-the-authenticated-user) | read |  |
| [GET /repos/{owner}/{repo}/codespaces/machines](/en/rest/codespaces/machines#list-available-machine-types-for-a-repository) | read |  |
| [GET /user/codespaces/{codespace\_name}/machines](/en/rest/codespaces/machines#list-machine-types-for-a-codespace) | read |  |

## [Repository permissions for "Codespaces secrets"](#repository-permissions-for-codespaces-secrets)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [GET /repos/{owner}/{repo}/codespaces/secrets](/en/rest/codespaces/repository-secrets#list-repository-secrets) | write |  |
| [GET /repos/{owner}/{repo}/codespaces/secrets/public-key](/en/rest/codespaces/repository-secrets#get-a-repository-public-key) | write |  |
| [GET /repos/{owner}/{repo}/codespaces/secrets/{secret\_name}](/en/rest/codespaces/repository-secrets#get-a-repository-secret) | write |  |
| [PUT /repos/{owner}/{repo}/codespaces/secrets/{secret\_name}](/en/rest/codespaces/repository-secrets#create-or-update-a-repository-secret) | write |  |
| [DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret\_name}](/en/rest/codespaces/repository-secrets#delete-a-repository-secret) | write |  |

## [Repository permissions for "Codespaces"](#repository-permissions-for-codespaces)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [DELETE /orgs/{org}/members/{username}/codespaces/{codespace\_name}](/en/rest/codespaces/organizations#delete-a-codespace-from-the-organization) | write |  |
| [POST /repos/{owner}/{repo}/codespaces](/en/rest/codespaces/codespaces#create-a-codespace-in-a-repository) | write |  |
| [GET /repos/{owner}/{repo}/codespaces/new](/en/rest/codespaces/codespaces#get-default-attributes-for-a-codespace) | write |  |
| [GET /repos/{owner}/{repo}/codespaces/permissions\_check](/en/rest/codespaces/codespaces#check-if-permissions-defined-by-a-devcontainer-have-been-accepted-by-the-authenticated-user) | write |  |
| [POST /repos/{owner}/{repo}/pulls/{pull\_number}/codespaces](/en/rest/codespaces/codespaces#create-a-codespace-from-a-pull-request) | write |  |
| [POST /user/codespaces](/en/rest/codespaces/codespaces#create-a-codespace-for-the-authenticated-user) | write |  |
| [PATCH /user/codespaces/{codespace\_name}](/en/rest/codespaces/codespaces#update-a-codespace-for-the-authenticated-user) | write |  |
| [DELETE /user/codespaces/{codespace\_name}](/en/rest/codespaces/codespaces#delete-a-codespace-for-the-authenticated-user) | write |  |
| [POST /user/codespaces/{codespace\_name}/publish](/en/rest/codespaces/codespaces#create-a-repository-from-an-unpublished-codespace) | write |  |
| [GET /orgs/{org}/codespaces](/en/rest/codespaces/organizations#list-codespaces-for-the-organization) | read |  |
| [GET /orgs/{org}/members/{username}/codespaces](/en/rest/codespaces/organizations#list-codespaces-for-a-user-in-organization) | read |  |
| [GET /repos/{owner}/{repo}/codespaces](/en/rest/codespaces/codespaces#list-codespaces-in-a-repository-for-the-authenticated-user) | read |  |
| [GET /user/codespaces](/en/rest/codespaces/codespaces#list-codespaces-for-the-authenticated-user) | read |  |
| [GET /user/codespaces/{codespace\_name}](/en/rest/codespaces/codespaces#get-a-codespace-for-the-authenticated-user) | read |  |

## [Repository permissions for "Commit statuses"](#repository-permissions-for-commit-statuses)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /repos/{owner}/{repo}/statuses/{sha}](/en/rest/commits/statuses#create-a-commit-status) | write |  |
| [GET /repos/{owner}/{repo}/commits/{ref}/status](/en/rest/commits/statuses#get-the-combined-status-for-a-specific-reference) | read |  |
| [GET /repos/{owner}/{repo}/commits/{ref}/statuses](/en/rest/commits/statuses#list-commit-statuses-for-a-reference) | read |  |

## [Repository permissions for "Contents"](#repository-permissions-for-contents)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /repos/{owner}/{repo}/branches/{branch}/rename](/en/rest/branches/branches#rename-a-branch) | write |  |
| [POST /repos/{owner}/{repo}/code-scanning/alerts/{alert\_number}/autofix/commits](/en/rest/code-scanning/code-scanning#commit-an-autofix-for-a-code-scanning-alert) | write |  |
| [DELETE /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}](/en/rest/code-scanning/code-scanning#delete-a-codeql-database) | write |  |
| [POST /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses](/en/rest/code-scanning/code-scanning#create-a-codeql-variant-analysis) | write |  |
| [PATCH /repos/{owner}/{repo}/comments/{comment\_id}](/en/rest/commits/comments#update-a-commit-comment) | write |  |
| [DELETE /repos/{owner}/{repo}/comments/{comment\_id}](/en/rest/commits/comments#delete-a-commit-comment) | write |  |
| [POST /repos/{owner}/{repo}/comments/{comment\_id}/reactions](/en/rest/reactions/reactions#create-reaction-for-a-commit-comment) | write |  |
| [DELETE /repos/{owner}/{repo}/comments/{comment\_id}/reactions/{reaction\_id}](/en/rest/reactions/reactions#delete-a-commit-comment-reaction) | write |  |
| [PUT /repos/{owner}/{repo}/contents/{path}](/en/rest/repos/contents#create-or-update-file-contents) | write |  |
| [PUT /repos/{owner}/{repo}/contents/{path}](/en/rest/repos/contents#create-or-update-file-contents) | write |  |
| [DELETE /repos/{owner}/{repo}/contents/{path}](/en/rest/repos/contents#delete-a-file) | write |  |
| [DELETE /repos/{owner}/{repo}/contents/{path}](/en/rest/repos/contents#delete-a-file) | write |  |
| [POST /repos/{owner}/{repo}/dependency-graph/snapshots](/en/rest/dependency-graph/dependency-submission#create-a-snapshot-of-dependencies-for-a-repository) | write |  |
| [POST /repos/{owner}/{repo}/dispatches](/en/rest/repos/repos#create-a-repository-dispatch-event) | write |  |
| [POST /repos/{owner}/{repo}/git/blobs](/en/rest/git/blobs#create-a-blob) | write |  |
| [POST /repos/{owner}/{repo}/git/commits](/en/rest/git/commits#create-a-commit) | write |  |
| [POST /repos/{owner}/{repo}/git/refs](/en/rest/git/refs#create-a-reference) | write |  |
| [POST /repos/{owner}/{repo}/git/refs](/en/rest/git/refs#create-a-reference) | write |  |
| [PATCH /repos/{owner}/{repo}/git/refs/{ref}](/en/rest/git/refs#update-a-reference) | write |  |
| [PATCH /repos/{owner}/{repo}/git/refs/{ref}](/en/rest/git/refs#update-a-reference) | write |  |
| [DELETE /repos/{owner}/{repo}/git/refs/{ref}](/en/rest/git/refs#delete-a-reference) | write |  |
| [POST /repos/{owner}/{repo}/git/tags](/en/rest/git/tags#create-a-tag-object) | write |  |
| [POST /repos/{owner}/{repo}/git/trees](/en/rest/git/trees#create-a-tree) | write |  |
| [PUT /repos/{owner}/{repo}/import](/en/rest/migrations/source-imports#start-an-import) | write |  |
| [PATCH /repos/{owner}/{repo}/import](/en/rest/migrations/source-imports#update-an-import) | write |  |
| [DELETE /repos/{owner}/{repo}/import](/en/rest/migrations/source-imports#cancel-an-import) | write |  |
| [PATCH /repos/{owner}/{repo}/import/authors/{author\_id}](/en/rest/migrations/source-imports#map-a-commit-author) | write |  |
| [PATCH /repos/{owner}/{repo}/import/lfs](/en/rest/migrations/source-imports#update-git-lfs-preference) | write |  |
| [POST /repos/{owner}/{repo}/merge-upstream](/en/rest/branches/branches#sync-a-fork-branch-with-the-upstream-repository) | write |  |
| [POST /repos/{owner}/{repo}/merges](/en/rest/branches/branches#merge-a-branch) | write |  |
| [PUT /repos/{owner}/{repo}/pulls/{pull\_number}/merge](/en/rest/pulls/pulls#merge-a-pull-request) | write |  |
| [POST /repos/{owner}/{repo}/releases](/en/rest/releases/releases#create-a-release) | write |  |
| [POST /repos/{owner}/{repo}/releases](/en/rest/releases/releases#create-a-release) | write |  |
| [PATCH /repos/{owner}/{repo}/releases/assets/{asset\_id}](/en/rest/releases/assets#update-a-release-asset) | write |  |
| [DELETE /repos/{owner}/{repo}/releases/assets/{asset\_id}](/en/rest/releases/assets#delete-a-release-asset) | write |  |
| [POST /repos/{owner}/{repo}/releases/generate-notes](/en/rest/releases/releases#generate-release-notes-content-for-a-release) | write |  |
| [PATCH /repos/{owner}/{repo}/releases/{release\_id}](/en/rest/releases/releases#update-a-release) | write |  |
| [PATCH /repos/{owner}/{repo}/releases/{release\_id}](/en/rest/releases/releases#update-a-release) | write |  |
| [DELETE /repos/{owner}/{repo}/releases/{release\_id}](/en/rest/releases/releases#delete-a-release) | write |  |
| [POST /repos/{owner}/{repo}/secret-scanning/push-protection-bypasses](/en/rest/secret-scanning/secret-scanning#create-a-push-protection-bypass) | write |  |
| [GET /repos/{owner}/{repo}/stargazers](/en/rest/activity/starring#list-stargazers) | write |  |
| [GET /repos/{owner}/{repo}/subscribers](/en/rest/activity/watching#list-watchers) | write |  |
| [POST /markdown](/en/rest/markdown/markdown#render-a-markdown-document) | read |  |
| [GET /repos/{owner}/{repo}/activity](/en/rest/repos/repos#list-repository-activities) | read |  |
| [GET /repos/{owner}/{repo}/branches](/en/rest/branches/branches#list-branches) | read |  |
| [GET /repos/{owner}/{repo}/branches/{branch}](/en/rest/branches/branches#get-a-branch) | read |  |
| [GET /repos/{owner}/{repo}/code-scanning/codeql/databases](/en/rest/code-scanning/code-scanning#list-codeql-databases-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}](/en/rest/code-scanning/code-scanning#get-a-codeql-database-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql\_variant\_analysis\_id}](/en/rest/code-scanning/code-scanning#get-the-summary-of-a-codeql-variant-analysis) | read |  |
| [GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql\_variant\_analysis\_id}/repos/{repo\_owner}/{repo\_name}](/en/rest/code-scanning/code-scanning#get-the-analysis-status-of-a-repository-in-a-codeql-variant-analysis) | read |  |
| [GET /repos/{owner}/{repo}/codeowners/errors](/en/rest/repos/repos#list-codeowners-errors) | read |  |
| [GET /repos/{owner}/{repo}/commits](/en/rest/commits/commits#list-commits) | read |  |
| [GET /repos/{owner}/{repo}/commits/{commit\_sha}/branches-where-head](/en/rest/commits/commits#list-branches-for-head-commit) | read |  |
| [POST /repos/{owner}/{repo}/commits/{commit\_sha}/comments](/en/rest/commits/comments#create-a-commit-comment) | read |  |
| [GET /repos/{owner}/{repo}/commits/{ref}](/en/rest/commits/commits#get-a-commit) | read |  |
| [GET /repos/{owner}/{repo}/community/profile](/en/rest/metrics/community#get-community-profile-metrics) | read |  |
| [GET /repos/{owner}/{repo}/compare/{basehead}](/en/rest/commits/commits#compare-two-commits) | read |  |
| [GET /repos/{owner}/{repo}/contents/{path}](/en/rest/repos/contents#get-repository-content) | read |  |
| [GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}](/en/rest/dependency-graph/dependency-review#get-a-diff-of-the-dependencies-between-commits) | read |  |
| [GET /repos/{owner}/{repo}/dependency-graph/sbom](/en/rest/dependency-graph/sboms#export-a-software-bill-of-materials-sbom-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/dependency-graph/sbom/fetch-report/{sbom\_uuid}](/en/rest/dependency-graph/sboms#fetch-a-software-bill-of-materials-sbom-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/dependency-graph/sbom/generate-report](/en/rest/dependency-graph/sboms#request-generation-of-a-software-bill-of-materials-sbom-for-a-repository) | read |  |
| [POST /repos/{owner}/{repo}/forks](/en/rest/repos/forks#create-a-fork) | read |  |
| [GET /repos/{owner}/{repo}/git/blobs/{file\_sha}](/en/rest/git/blobs#get-a-blob) | read |  |
| [GET /repos/{owner}/{repo}/git/commits/{commit\_sha}](/en/rest/git/commits#get-a-commit-object) | read |  |
| [GET /repos/{owner}/{repo}/git/matching-refs/{ref}](/en/rest/git/refs#list-matching-references) | read |  |
| [GET /repos/{owner}/{repo}/git/ref/{ref}](/en/rest/git/refs#get-a-reference) | read |  |
| [GET /repos/{owner}/{repo}/git/tags/{tag\_sha}](/en/rest/git/tags#get-a-tag) | read |  |
| [GET /repos/{owner}/{repo}/git/trees/{tree\_sha}](/en/rest/git/trees#get-a-tree) | read |  |
| [GET /repos/{owner}/{repo}/import](/en/rest/migrations/source-imports#get-an-import-status) | read |  |
| [GET /repos/{owner}/{repo}/import/authors](/en/rest/migrations/source-imports#get-commit-authors) | read |  |
| [GET /repos/{owner}/{repo}/import/large\_files](/en/rest/migrations/source-imports#get-large-files) | read |  |
| [GET /repos/{owner}/{repo}/pulls/{pull\_number}](/en/rest/pulls/pulls#get-a-pull-request) | read |  |
| [GET /repos/{owner}/{repo}/readme](/en/rest/repos/contents#get-a-repository-readme) | read |  |
| [GET /repos/{owner}/{repo}/readme/{dir}](/en/rest/repos/contents#get-a-repository-readme-for-a-directory) | read |  |
| [GET /repos/{owner}/{repo}/releases](/en/rest/releases/releases#list-releases) | read |  |
| [GET /repos/{owner}/{repo}/releases/assets/{asset\_id}](/en/rest/releases/assets#get-a-release-asset) | read |  |
| [GET /repos/{owner}/{repo}/releases/latest](/en/rest/releases/releases#get-the-latest-release) | read |  |
| [GET /repos/{owner}/{repo}/releases/tags/{tag}](/en/rest/releases/releases#get-a-release-by-tag-name) | read |  |
| [GET /repos/{owner}/{repo}/releases/{release\_id}](/en/rest/releases/releases#get-a-release) | read |  |
| [GET /repos/{owner}/{repo}/releases/{release\_id}/assets](/en/rest/releases/assets#list-release-assets) | read |  |
| [GET /repos/{owner}/{repo}/tarball/{ref}](/en/rest/repos/contents#download-a-repository-archive-tar) | read |  |
| [GET /repos/{owner}/{repo}/zipball/{ref}](/en/rest/repos/contents#download-a-repository-archive-zip) | read |  |
| [POST /repos/{template\_owner}/{template\_repo}/generate](/en/rest/repos/repos#create-a-repository-using-a-template) | read |  |

## [Repository permissions for "Copilot agent settings"](#repository-permissions-for-copilot-agent-settings)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [GET /repos/{owner}/{repo}/copilot/cloud-agent/configuration](/en/rest/copilot/copilot-cloud-agent-management#get-copilot-cloud-agent-configuration-for-a-repository) | read |  |

## [Repository permissions for "Custom properties"](#repository-permissions-for-custom-properties)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PATCH /repos/{owner}/{repo}/properties/values](/en/rest/repos/custom-properties#create-or-update-custom-property-values-for-a-repository) | write |  |

## [Repository permissions for "Dependabot alerts"](#repository-permissions-for-dependabot-alerts)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert\_number}](/en/rest/dependabot/alerts#update-a-dependabot-alert) | write |  |
| [GET /orgs/{org}/dependabot/alerts](/en/rest/dependabot/alerts#list-dependabot-alerts-for-an-organization) | read |  |
| [GET /repos/{owner}/{repo}/dependabot/alerts](/en/rest/dependabot/alerts#list-dependabot-alerts-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/dependabot/alerts/{alert\_number}](/en/rest/dependabot/alerts#get-a-dependabot-alert) | read |  |

## [Repository permissions for "Dependabot secrets"](#repository-permissions-for-dependabot-secrets)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /repos/{owner}/{repo}/dependabot/secrets/{secret\_name}](/en/rest/dependabot/secrets#create-or-update-a-repository-secret) | write |  |
| [DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret\_name}](/en/rest/dependabot/secrets#delete-a-repository-secret) | write |  |
| [GET /repos/{owner}/{repo}/dependabot/secrets](/en/rest/dependabot/secrets#list-repository-secrets) | read |  |
| [GET /repos/{owner}/{repo}/dependabot/secrets/public-key](/en/rest/dependabot/secrets#get-a-repository-public-key) | read |  |
| [GET /repos/{owner}/{repo}/dependabot/secrets/{secret\_name}](/en/rest/dependabot/secrets#get-a-repository-secret) | read |  |

## [Repository permissions for "Deployments"](#repository-permissions-for-deployments)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /repos/{owner}/{repo}/actions/runs/{run\_id}/pending\_deployments](/en/rest/actions/workflow-runs#review-pending-deployments-for-a-workflow-run) | write |  |
| [POST /repos/{owner}/{repo}/deployments](/en/rest/deployments/deployments#create-a-deployment) | write |  |
| [DELETE /repos/{owner}/{repo}/deployments/{deployment\_id}](/en/rest/deployments/deployments#delete-a-deployment) | write |  |
| [POST /repos/{owner}/{repo}/deployments/{deployment\_id}/statuses](/en/rest/deployments/statuses#create-a-deployment-status) | write |  |
| [GET /repos/{owner}/{repo}/deployments](/en/rest/deployments/deployments#list-deployments) | read |  |
| [GET /repos/{owner}/{repo}/deployments/{deployment\_id}](/en/rest/deployments/deployments#get-a-deployment) | read |  |
| [GET /repos/{owner}/{repo}/deployments/{deployment\_id}/statuses](/en/rest/deployments/statuses#list-deployment-statuses) | read |  |
| [GET /repos/{owner}/{repo}/deployments/{deployment\_id}/statuses/{status\_id}](/en/rest/deployments/statuses#get-a-deployment-status) | read |  |

## [Repository permissions for "Environments"](#repository-permissions-for-environments)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /repos/{owner}/{repo}/environments/{environment\_name}/secrets/{secret\_name}](/en/rest/actions/secrets#create-or-update-an-environment-secret) | write |  |
| [DELETE /repos/{owner}/{repo}/environments/{environment\_name}/secrets/{secret\_name}](/en/rest/actions/secrets#delete-an-environment-secret) | write |  |
| [POST /repos/{owner}/{repo}/environments/{environment\_name}/variables](/en/rest/actions/variables#create-an-environment-variable) | write |  |
| [PATCH /repos/{owner}/{repo}/environments/{environment\_name}/variables/{name}](/en/rest/actions/variables#update-an-environment-variable) | write |  |
| [DELETE /repos/{owner}/{repo}/environments/{environment\_name}/variables/{name}](/en/rest/actions/variables#delete-an-environment-variable) | write |  |
| [GET /repos/{owner}/{repo}/environments/{environment\_name}/secrets](/en/rest/actions/secrets#list-environment-secrets) | read |  |
| [GET /repos/{owner}/{repo}/environments/{environment\_name}/secrets/public-key](/en/rest/actions/secrets#get-an-environment-public-key) | read |  |
| [GET /repos/{owner}/{repo}/environments/{environment\_name}/secrets/{secret\_name}](/en/rest/actions/secrets#get-an-environment-secret) | read |  |
| [GET /repos/{owner}/{repo}/environments/{environment\_name}/variables](/en/rest/actions/variables#list-environment-variables) | read |  |
| [GET /repos/{owner}/{repo}/environments/{environment\_name}/variables/{name}](/en/rest/actions/variables#get-an-environment-variable) | read |  |

## [Repository permissions for "Issues"](#repository-permissions-for-issues)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /repos/{owner}/{repo}/issues](/en/rest/issues/issues#create-an-issue) | write |  |
| [PATCH /repos/{owner}/{repo}/issues/comments/{comment\_id}](/en/rest/issues/comments#update-an-issue-comment) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/comments/{comment\_id}](/en/rest/issues/comments#delete-an-issue-comment) | write |  |
| [PUT /repos/{owner}/{repo}/issues/comments/{comment\_id}/pin](/en/rest/issues/comments#pin-an-issue-comment) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/comments/{comment\_id}/pin](/en/rest/issues/comments#unpin-an-issue-comment) | write |  |
| [POST /repos/{owner}/{repo}/issues/comments/{comment\_id}/reactions](/en/rest/reactions/reactions#create-reaction-for-an-issue-comment) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/comments/{comment\_id}/reactions/{reaction\_id}](/en/rest/reactions/reactions#delete-an-issue-comment-reaction) | write |  |
| [PATCH /repos/{owner}/{repo}/issues/{issue\_number}](/en/rest/issues/issues#update-an-issue) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/assignees](/en/rest/issues/assignees#add-assignees-to-an-issue) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/{issue\_number}/assignees](/en/rest/issues/assignees#remove-assignees-from-an-issue) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/comments](/en/rest/issues/comments#create-an-issue-comment) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/dependencies/blocked\_by](/en/rest/issues/issue-dependencies#add-a-dependency-an-issue-is-blocked-by) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/{issue\_number}/dependencies/blocked\_by/{issue\_id}](/en/rest/issues/issue-dependencies#remove-dependency-an-issue-is-blocked-by) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/issue-field-values](/en/rest/issues/issue-field-values#add-issue-field-values-to-an-issue) | write |  |
| [PUT /repos/{owner}/{repo}/issues/{issue\_number}/issue-field-values](/en/rest/issues/issue-field-values#set-issue-field-values-for-an-issue) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/{issue\_number}/issue-field-values/{issue\_field\_id}](/en/rest/issues/issue-field-values#delete-an-issue-field-value-from-an-issue) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/labels](/en/rest/issues/labels#add-labels-to-an-issue) | write |  |
| [PUT /repos/{owner}/{repo}/issues/{issue\_number}/labels](/en/rest/issues/labels#set-labels-for-an-issue) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/{issue\_number}/labels](/en/rest/issues/labels#remove-all-labels-from-an-issue) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/{issue\_number}/labels/{name}](/en/rest/issues/labels#remove-a-label-from-an-issue) | write |  |
| [PUT /repos/{owner}/{repo}/issues/{issue\_number}/lock](/en/rest/issues/issues#lock-an-issue) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/{issue\_number}/lock](/en/rest/issues/issues#unlock-an-issue) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/reactions](/en/rest/reactions/reactions#create-reaction-for-an-issue) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/{issue\_number}/reactions/{reaction\_id}](/en/rest/reactions/reactions#delete-an-issue-reaction) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/{issue\_number}/sub\_issue](/en/rest/issues/sub-issues#remove-sub-issue) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/sub\_issues](/en/rest/issues/sub-issues#add-sub-issue) | write |  |
| [PATCH /repos/{owner}/{repo}/issues/{issue\_number}/sub\_issues/priority](/en/rest/issues/sub-issues#reprioritize-sub-issue) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/suggestions/{suggestion\_id}/approve](/en/rest/issues/issues#approve-an-issue-suggestion) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/suggestions/{suggestion\_id}/dismiss](/en/rest/issues/issues#dismiss-an-issue-suggestion) | write |  |
| [POST /repos/{owner}/{repo}/labels](/en/rest/issues/labels#create-a-label) | write |  |
| [PATCH /repos/{owner}/{repo}/labels/{name}](/en/rest/issues/labels#update-a-label) | write |  |
| [DELETE /repos/{owner}/{repo}/labels/{name}](/en/rest/issues/labels#delete-a-label) | write |  |
| [POST /repos/{owner}/{repo}/milestones](/en/rest/issues/milestones#create-a-milestone) | write |  |
| [PATCH /repos/{owner}/{repo}/milestones/{milestone\_number}](/en/rest/issues/milestones#update-a-milestone) | write |  |
| [DELETE /repos/{owner}/{repo}/milestones/{milestone\_number}](/en/rest/issues/milestones#delete-a-milestone) | write |  |
| [GET /repos/{owner}/{repo}/assignees](/en/rest/issues/assignees#list-assignees) | read |  |
| [GET /repos/{owner}/{repo}/assignees/{assignee}](/en/rest/issues/assignees#check-if-a-user-can-be-assigned) | read |  |
| [GET /repos/{owner}/{repo}/issues](/en/rest/issues/issues#list-repository-issues) | read |  |
| [GET /repos/{owner}/{repo}/issues/comments](/en/rest/issues/comments#list-issue-comments-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/issues/comments/{comment\_id}](/en/rest/issues/comments#get-an-issue-comment) | read |  |
| [GET /repos/{owner}/{repo}/issues/comments/{comment\_id}/reactions](/en/rest/reactions/reactions#list-reactions-for-an-issue-comment) | read |  |
| [GET /repos/{owner}/{repo}/issues/events](/en/rest/issues/events#list-issue-events-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/issues/events/{event\_id}](/en/rest/issues/events#get-an-issue-event) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}](/en/rest/issues/issues#get-an-issue) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/assignees/{assignee}](/en/rest/issues/assignees#check-if-a-user-can-be-assigned-to-a-issue) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/comments](/en/rest/issues/comments#list-issue-comments) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/dependencies/blocked\_by](/en/rest/issues/issue-dependencies#list-dependencies-an-issue-is-blocked-by) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/dependencies/blocking](/en/rest/issues/issue-dependencies#list-dependencies-an-issue-is-blocking) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/events](/en/rest/issues/events#list-issue-events) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/issue-field-values](/en/rest/issues/issue-field-values#list-issue-field-values-for-an-issue) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/labels](/en/rest/issues/labels#list-labels-for-an-issue) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/parent](/en/rest/issues/sub-issues#get-parent-issue) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/reactions](/en/rest/reactions/reactions#list-reactions-for-an-issue) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/sub\_issues](/en/rest/issues/sub-issues#list-sub-issues) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/suggestions](/en/rest/issues/issues#list-issue-suggestions) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/timeline](/en/rest/issues/timeline#list-timeline-events-for-an-issue) | read |  |
| [GET /repos/{owner}/{repo}/labels](/en/rest/issues/labels#list-labels-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/labels/{name}](/en/rest/issues/labels#get-a-label) | read |  |
| [GET /repos/{owner}/{repo}/milestones](/en/rest/issues/milestones#list-milestones) | read |  |
| [GET /repos/{owner}/{repo}/milestones/{milestone\_number}](/en/rest/issues/milestones#get-a-milestone) | read |  |
| [GET /repos/{owner}/{repo}/milestones/{milestone\_number}/labels](/en/rest/issues/labels#list-labels-for-issues-in-a-milestone) | read |  |

## [Repository permissions for "Metadata"](#repository-permissions-for-metadata)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [GET /orgs/{org}/repos](/en/rest/repos/repos#list-organization-repositories) | read |  |
| [GET /repos/{owner}/{repo}](/en/rest/repos/repos#get-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/collaborators](/en/rest/collaborators/collaborators#list-repository-collaborators) | read |  |
| [GET /repos/{owner}/{repo}/collaborators/{username}](/en/rest/collaborators/collaborators#check-if-a-user-is-a-repository-collaborator) | read |  |
| [GET /repos/{owner}/{repo}/collaborators/{username}/permission](/en/rest/collaborators/collaborators#get-repository-permissions-for-a-user) | read |  |
| [GET /repos/{owner}/{repo}/comments](/en/rest/commits/comments#list-commit-comments-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/comments/{comment\_id}](/en/rest/commits/comments#get-a-commit-comment) | read |  |
| [GET /repos/{owner}/{repo}/comments/{comment\_id}/reactions](/en/rest/reactions/reactions#list-reactions-for-a-commit-comment) | read |  |
| [GET /repos/{owner}/{repo}/commits/{commit\_sha}/comments](/en/rest/commits/comments#list-commit-comments) | read |  |
| [GET /repos/{owner}/{repo}/contributors](/en/rest/repos/repos#list-repository-contributors) | read |  |
| [GET /repos/{owner}/{repo}/events](/en/rest/activity/events#list-repository-events) | read |  |
| [GET /repos/{owner}/{repo}/forks](/en/rest/repos/forks#list-forks) | read |  |
| [GET /repos/{owner}/{repo}/hash-algorithm](/en/rest/repos/repos#get-the-hash-algorithm-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/issue-types](/en/rest/repos/issue-types#list-issue-types-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/languages](/en/rest/repos/repos#list-repository-languages) | read |  |
| [GET /repos/{owner}/{repo}/license](/en/rest/licenses/licenses#get-the-license-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/private-vulnerability-reporting](/en/rest/repos/repos#check-if-private-vulnerability-reporting-is-enabled-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/properties/values](/en/rest/repos/custom-properties#get-all-custom-property-values-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/rules/branches/{branch}](/en/rest/repos/rules#get-rules-for-a-branch) | read |  |
| [GET /repos/{owner}/{repo}/rulesets](/en/rest/repos/rules#get-all-repository-rulesets) | read |  |
| [GET /repos/{owner}/{repo}/rulesets/{ruleset\_id}](/en/rest/repos/rules#get-a-repository-ruleset) | read |  |
| [GET /repos/{owner}/{repo}/stats/code\_frequency](/en/rest/metrics/statistics#get-the-weekly-commit-activity) | read |  |
| [GET /repos/{owner}/{repo}/stats/commit\_activity](/en/rest/metrics/statistics#get-the-last-year-of-commit-activity) | read |  |
| [GET /repos/{owner}/{repo}/stats/contributors](/en/rest/metrics/statistics#get-all-contributor-commit-activity) | read |  |
| [GET /repos/{owner}/{repo}/stats/participation](/en/rest/metrics/statistics#get-the-weekly-commit-count) | read |  |
| [GET /repos/{owner}/{repo}/stats/punch\_card](/en/rest/metrics/statistics#get-the-hourly-commit-count-for-each-day) | read |  |
| [GET /repos/{owner}/{repo}/tags](/en/rest/repos/repos#list-repository-tags) | read |  |
| [GET /repos/{owner}/{repo}/topics](/en/rest/repos/repos#get-all-repository-topics) | read |  |
| [GET /repositories](/en/rest/repos/repos#list-public-repositories) | read |  |
| [GET /search/labels](/en/rest/search/search#search-labels) | read |  |
| [GET /user/repos](/en/rest/repos/repos#list-repositories-for-the-authenticated-user) | read |  |
| [GET /users/{username}/repos](/en/rest/repos/repos#list-repositories-for-a-user) | read |  |

## [Repository permissions for "Pages"](#repository-permissions-for-pages)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /repos/{owner}/{repo}/pages](/en/rest/pages/pages#create-a-github-pages-site) | write |  |
| [PUT /repos/{owner}/{repo}/pages](/en/rest/pages/pages#update-information-about-a-github-pages-site) | write |  |
| [DELETE /repos/{owner}/{repo}/pages](/en/rest/pages/pages#delete-a-github-pages-site) | write |  |
| [POST /repos/{owner}/{repo}/pages/builds](/en/rest/pages/pages#request-a-github-pages-build) | write |  |
| [POST /repos/{owner}/{repo}/pages/deployments](/en/rest/pages/pages#create-a-github-pages-deployment) | write |  |
| [POST /repos/{owner}/{repo}/pages/deployments/{pages\_deployment\_id}/cancel](/en/rest/pages/pages#cancel-a-github-pages-deployment) | write |  |
| [GET /repos/{owner}/{repo}/pages/health](/en/rest/pages/pages#get-a-dns-health-check-for-github-pages) | write |  |
| [GET /repos/{owner}/{repo}/pages](/en/rest/pages/pages#get-a-github-pages-site) | read |  |
| [GET /repos/{owner}/{repo}/pages/builds](/en/rest/pages/pages#list-github-pages-builds) | read |  |
| [GET /repos/{owner}/{repo}/pages/builds/latest](/en/rest/pages/pages#get-latest-pages-build) | read |  |
| [GET /repos/{owner}/{repo}/pages/builds/{build\_id}](/en/rest/pages/pages#get-github-pages-build) | read |  |
| [GET /repos/{owner}/{repo}/pages/deployments/{pages\_deployment\_id}](/en/rest/pages/pages#get-the-status-of-a-github-pages-deployment) | read |  |

## [Repository permissions for "Pull requests"](#repository-permissions-for-pull-requests)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PATCH /repos/{owner}/{repo}/issues/comments/{comment\_id}](/en/rest/issues/comments#update-an-issue-comment) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/comments/{comment\_id}](/en/rest/issues/comments#delete-an-issue-comment) | write |  |
| [PATCH /repos/{owner}/{repo}/issues/{issue\_number}](/en/rest/issues/issues#update-an-issue) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/assignees](/en/rest/issues/assignees#add-assignees-to-an-issue) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/{issue\_number}/assignees](/en/rest/issues/assignees#remove-assignees-from-an-issue) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/comments](/en/rest/issues/comments#create-an-issue-comment) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/issue-field-values](/en/rest/issues/issue-field-values#add-issue-field-values-to-an-issue) | write |  |
| [PUT /repos/{owner}/{repo}/issues/{issue\_number}/issue-field-values](/en/rest/issues/issue-field-values#set-issue-field-values-for-an-issue) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/{issue\_number}/issue-field-values/{issue\_field\_id}](/en/rest/issues/issue-field-values#delete-an-issue-field-value-from-an-issue) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/labels](/en/rest/issues/labels#add-labels-to-an-issue) | write |  |
| [PUT /repos/{owner}/{repo}/issues/{issue\_number}/labels](/en/rest/issues/labels#set-labels-for-an-issue) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/{issue\_number}/labels](/en/rest/issues/labels#remove-all-labels-from-an-issue) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/{issue\_number}/labels/{name}](/en/rest/issues/labels#remove-a-label-from-an-issue) | write |  |
| [PUT /repos/{owner}/{repo}/issues/{issue\_number}/lock](/en/rest/issues/issues#lock-an-issue) | write |  |
| [DELETE /repos/{owner}/{repo}/issues/{issue\_number}/lock](/en/rest/issues/issues#unlock-an-issue) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/suggestions/{suggestion\_id}/approve](/en/rest/issues/issues#approve-an-issue-suggestion) | write |  |
| [POST /repos/{owner}/{repo}/issues/{issue\_number}/suggestions/{suggestion\_id}/dismiss](/en/rest/issues/issues#dismiss-an-issue-suggestion) | write |  |
| [POST /repos/{owner}/{repo}/labels](/en/rest/issues/labels#create-a-label) | write |  |
| [PATCH /repos/{owner}/{repo}/labels/{name}](/en/rest/issues/labels#update-a-label) | write |  |
| [DELETE /repos/{owner}/{repo}/labels/{name}](/en/rest/issues/labels#delete-a-label) | write |  |
| [POST /repos/{owner}/{repo}/milestones](/en/rest/issues/milestones#create-a-milestone) | write |  |
| [PATCH /repos/{owner}/{repo}/milestones/{milestone\_number}](/en/rest/issues/milestones#update-a-milestone) | write |  |
| [DELETE /repos/{owner}/{repo}/milestones/{milestone\_number}](/en/rest/issues/milestones#delete-a-milestone) | write |  |
| [POST /repos/{owner}/{repo}/pulls](/en/rest/pulls/pulls#create-a-pull-request) | write |  |
| [PATCH /repos/{owner}/{repo}/pulls/comments/{comment\_id}](/en/rest/pulls/comments#update-a-review-comment-for-a-pull-request) | write |  |
| [DELETE /repos/{owner}/{repo}/pulls/comments/{comment\_id}](/en/rest/pulls/comments#delete-a-review-comment-for-a-pull-request) | write |  |
| [POST /repos/{owner}/{repo}/pulls/comments/{comment\_id}/reactions](/en/rest/reactions/reactions#create-reaction-for-a-pull-request-review-comment) | write |  |
| [DELETE /repos/{owner}/{repo}/pulls/comments/{comment\_id}/reactions/{reaction\_id}](/en/rest/reactions/reactions#delete-a-pull-request-comment-reaction) | write |  |
| [PATCH /repos/{owner}/{repo}/pulls/{pull\_number}](/en/rest/pulls/pulls#update-a-pull-request) | write |  |
| [POST /repos/{owner}/{repo}/pulls/{pull\_number}/comments](/en/rest/pulls/comments#create-a-review-comment-for-a-pull-request) | write |  |
| [POST /repos/{owner}/{repo}/pulls/{pull\_number}/comments/{comment\_id}/replies](/en/rest/pulls/comments#create-a-reply-for-a-review-comment) | write |  |
| [POST /repos/{owner}/{repo}/pulls/{pull\_number}/requested\_reviewers](/en/rest/pulls/review-requests#request-reviewers-for-a-pull-request) | write |  |
| [DELETE /repos/{owner}/{repo}/pulls/{pull\_number}/requested\_reviewers](/en/rest/pulls/review-requests#remove-requested-reviewers-from-a-pull-request) | write |  |
| [POST /repos/{owner}/{repo}/pulls/{pull\_number}/reviews](/en/rest/pulls/reviews#create-a-review-for-a-pull-request) | write |  |
| [PUT /repos/{owner}/{repo}/pulls/{pull\_number}/reviews/{review\_id}](/en/rest/pulls/reviews#update-a-review-for-a-pull-request) | write |  |
| [DELETE /repos/{owner}/{repo}/pulls/{pull\_number}/reviews/{review\_id}](/en/rest/pulls/reviews#delete-a-pending-review-for-a-pull-request) | write |  |
| [PUT /repos/{owner}/{repo}/pulls/{pull\_number}/reviews/{review\_id}/dismissals](/en/rest/pulls/reviews#dismiss-a-review-for-a-pull-request) | write |  |
| [POST /repos/{owner}/{repo}/pulls/{pull\_number}/reviews/{review\_id}/events](/en/rest/pulls/reviews#submit-a-review-for-a-pull-request) | write |  |
| [PUT /repos/{owner}/{repo}/pulls/{pull\_number}/update-branch](/en/rest/pulls/pulls#update-a-pull-request-branch) | write |  |
| [GET /repos/{owner}/{repo}/assignees](/en/rest/issues/assignees#list-assignees) | read |  |
| [GET /repos/{owner}/{repo}/assignees/{assignee}](/en/rest/issues/assignees#check-if-a-user-can-be-assigned) | read |  |
| [GET /repos/{owner}/{repo}/commits/{commit\_sha}/pulls](/en/rest/commits/commits#list-pull-requests-associated-with-a-commit) | read |  |
| [GET /repos/{owner}/{repo}/issues/comments](/en/rest/issues/comments#list-issue-comments-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/issues/comments/{comment\_id}](/en/rest/issues/comments#get-an-issue-comment) | read |  |
| [GET /repos/{owner}/{repo}/issues/events/{event\_id}](/en/rest/issues/events#get-an-issue-event) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/assignees/{assignee}](/en/rest/issues/assignees#check-if-a-user-can-be-assigned-to-a-issue) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/comments](/en/rest/issues/comments#list-issue-comments) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/events](/en/rest/issues/events#list-issue-events) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/labels](/en/rest/issues/labels#list-labels-for-an-issue) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/suggestions](/en/rest/issues/issues#list-issue-suggestions) | read |  |
| [GET /repos/{owner}/{repo}/issues/{issue\_number}/timeline](/en/rest/issues/timeline#list-timeline-events-for-an-issue) | read |  |
| [GET /repos/{owner}/{repo}/labels](/en/rest/issues/labels#list-labels-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/labels/{name}](/en/rest/issues/labels#get-a-label) | read |  |
| [GET /repos/{owner}/{repo}/milestones](/en/rest/issues/milestones#list-milestones) | read |  |
| [GET /repos/{owner}/{repo}/milestones/{milestone\_number}](/en/rest/issues/milestones#get-a-milestone) | read |  |
| [GET /repos/{owner}/{repo}/milestones/{milestone\_number}/labels](/en/rest/issues/labels#list-labels-for-issues-in-a-milestone) | read |  |
| [GET /repos/{owner}/{repo}/pulls](/en/rest/pulls/pulls#list-pull-requests) | read |  |
| [GET /repos/{owner}/{repo}/pulls/comments](/en/rest/pulls/comments#list-review-comments-in-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/pulls/comments/{comment\_id}](/en/rest/pulls/comments#get-a-review-comment-for-a-pull-request) | read |  |
| [GET /repos/{owner}/{repo}/pulls/comments/{comment\_id}/reactions](/en/rest/reactions/reactions#list-reactions-for-a-pull-request-review-comment) | read |  |
| [GET /repos/{owner}/{repo}/pulls/{pull\_number}](/en/rest/pulls/pulls#get-a-pull-request) | read |  |
| [GET /repos/{owner}/{repo}/pulls/{pull\_number}/comments](/en/rest/pulls/comments#list-review-comments-on-a-pull-request) | read |  |
| [GET /repos/{owner}/{repo}/pulls/{pull\_number}/commits](/en/rest/pulls/pulls#list-commits-on-a-pull-request) | read |  |
| [GET /repos/{owner}/{repo}/pulls/{pull\_number}/files](/en/rest/pulls/pulls#list-pull-requests-files) | read |  |
| [GET /repos/{owner}/{repo}/pulls/{pull\_number}/merge](/en/rest/pulls/pulls#check-if-a-pull-request-has-been-merged) | read |  |
| [GET /repos/{owner}/{repo}/pulls/{pull\_number}/requested\_reviewers](/en/rest/pulls/review-requests#get-all-requested-reviewers-for-a-pull-request) | read |  |
| [GET /repos/{owner}/{repo}/pulls/{pull\_number}/reviews](/en/rest/pulls/reviews#list-reviews-for-a-pull-request) | read |  |
| [GET /repos/{owner}/{repo}/pulls/{pull\_number}/reviews/{review\_id}](/en/rest/pulls/reviews#get-a-review-for-a-pull-request) | read |  |
| [GET /repos/{owner}/{repo}/pulls/{pull\_number}/reviews/{review\_id}/comments](/en/rest/pulls/reviews#list-comments-for-a-pull-request-review) | read |  |

## [Repository permissions for "Repository security advisories"](#repository-permissions-for-repository-security-advisories)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [GET /orgs/{org}/security-advisories](/en/rest/security-advisories/repository-advisories#list-repository-security-advisories-for-an-organization) | write |  |
| [POST /repos/{owner}/{repo}/security-advisories](/en/rest/security-advisories/repository-advisories#create-a-repository-security-advisory) | write |  |
| [POST /repos/{owner}/{repo}/security-advisories/reports](/en/rest/security-advisories/repository-advisories#privately-report-a-security-vulnerability) | write |  |
| [PATCH /repos/{owner}/{repo}/security-advisories/{ghsa\_id}](/en/rest/security-advisories/repository-advisories#update-a-repository-security-advisory) | write |  |
| [POST /repos/{owner}/{repo}/security-advisories/{ghsa\_id}/cve](/en/rest/security-advisories/repository-advisories#request-a-cve-for-a-repository-security-advisory) | write |  |
| [GET /repos/{owner}/{repo}/security-advisories](/en/rest/security-advisories/repository-advisories#list-repository-security-advisories) | read |  |
| [GET /repos/{owner}/{repo}/security-advisories/{ghsa\_id}](/en/rest/security-advisories/repository-advisories#get-a-repository-security-advisory) | read |  |
| [POST /repos/{owner}/{repo}/security-advisories/{ghsa\_id}/forks](/en/rest/security-advisories/repository-advisories#create-a-temporary-private-fork) | read |  |

## [Repository permissions for "Secret scanning alerts"](#repository-permissions-for-secret-scanning-alerts)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert\_number}](/en/rest/secret-scanning/secret-scanning#update-a-secret-scanning-alert) | write |  |
| [POST /repos/{owner}/{repo}/secret-scanning/custom-patterns](/en/rest/secret-scanning/custom-patterns#bulk-create-repository-custom-patterns) | write |  |
| [DELETE /repos/{owner}/{repo}/secret-scanning/custom-patterns](/en/rest/secret-scanning/custom-patterns#bulk-delete-repository-custom-patterns) | write |  |
| [PATCH /repos/{owner}/{repo}/secret-scanning/custom-patterns/{pattern\_id}](/en/rest/secret-scanning/custom-patterns#update-a-repository-custom-pattern) | write |  |
| [GET /orgs/{org}/secret-scanning/alerts](/en/rest/secret-scanning/secret-scanning#list-secret-scanning-alerts-for-an-organization) | read |  |
| [GET /repos/{owner}/{repo}/secret-scanning/alerts](/en/rest/secret-scanning/secret-scanning#list-secret-scanning-alerts-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert\_number}](/en/rest/secret-scanning/secret-scanning#get-a-secret-scanning-alert) | read |  |
| [GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert\_number}/locations](/en/rest/secret-scanning/secret-scanning#list-locations-for-a-secret-scanning-alert) | read |  |
| [GET /repos/{owner}/{repo}/secret-scanning/custom-patterns](/en/rest/secret-scanning/custom-patterns#list-repository-custom-patterns) | read |  |
| [GET /repos/{owner}/{repo}/secret-scanning/scan-history](/en/rest/secret-scanning/secret-scanning#get-secret-scanning-scan-history-for-a-repository) | read |  |

## [Repository permissions for "Secrets"](#repository-permissions-for-secrets)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /repos/{owner}/{repo}/actions/secrets/{secret\_name}](/en/rest/actions/secrets#create-or-update-a-repository-secret) | write |  |
| [DELETE /repos/{owner}/{repo}/actions/secrets/{secret\_name}](/en/rest/actions/secrets#delete-a-repository-secret) | write |  |
| [GET /repos/{owner}/{repo}/actions/organization-secrets](/en/rest/actions/secrets#list-repository-organization-secrets) | read |  |
| [GET /repos/{owner}/{repo}/actions/secrets](/en/rest/actions/secrets#list-repository-secrets) | read |  |
| [GET /repos/{owner}/{repo}/actions/secrets/public-key](/en/rest/actions/secrets#get-a-repository-public-key) | read |  |
| [GET /repos/{owner}/{repo}/actions/secrets/{secret\_name}](/en/rest/actions/secrets#get-a-repository-secret) | read |  |

## [Repository permissions for "Variables"](#repository-permissions-for-variables)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /repos/{owner}/{repo}/actions/variables](/en/rest/actions/variables#create-a-repository-variable) | write |  |
| [PATCH /repos/{owner}/{repo}/actions/variables/{name}](/en/rest/actions/variables#update-a-repository-variable) | write |  |
| [DELETE /repos/{owner}/{repo}/actions/variables/{name}](/en/rest/actions/variables#delete-a-repository-variable) | write |  |
| [GET /repos/{owner}/{repo}/actions/organization-variables](/en/rest/actions/variables#list-repository-organization-variables) | read |  |
| [GET /repos/{owner}/{repo}/actions/variables](/en/rest/actions/variables#list-repository-variables) | read |  |
| [GET /repos/{owner}/{repo}/actions/variables/{name}](/en/rest/actions/variables#get-a-repository-variable) | read |  |

## [Repository permissions for "Webhooks"](#repository-permissions-for-webhooks)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /repos/{owner}/{repo}/hooks](/en/rest/repos/webhooks#create-a-repository-webhook) | write |  |
| [PATCH /repos/{owner}/{repo}/hooks/{hook\_id}](/en/rest/repos/webhooks#update-a-repository-webhook) | write |  |
| [DELETE /repos/{owner}/{repo}/hooks/{hook\_id}](/en/rest/repos/webhooks#delete-a-repository-webhook) | write |  |
| [PATCH /repos/{owner}/{repo}/hooks/{hook\_id}/config](/en/rest/repos/webhooks#update-a-webhook-configuration-for-a-repository) | write |  |
| [POST /repos/{owner}/{repo}/hooks/{hook\_id}/deliveries/{delivery\_id}/attempts](/en/rest/repos/webhooks#redeliver-a-delivery-for-a-repository-webhook) | write |  |
| [GET /repos/{owner}/{repo}/hooks](/en/rest/repos/webhooks#list-repository-webhooks) | read |  |
| [GET /repos/{owner}/{repo}/hooks/{hook\_id}](/en/rest/repos/webhooks#get-a-repository-webhook) | read |  |
| [GET /repos/{owner}/{repo}/hooks/{hook\_id}/config](/en/rest/repos/webhooks#get-a-webhook-configuration-for-a-repository) | read |  |
| [GET /repos/{owner}/{repo}/hooks/{hook\_id}/deliveries](/en/rest/repos/webhooks#list-deliveries-for-a-repository-webhook) | read |  |
| [GET /repos/{owner}/{repo}/hooks/{hook\_id}/deliveries/{delivery\_id}](/en/rest/repos/webhooks#get-a-delivery-for-a-repository-webhook) | read |  |
| [POST /repos/{owner}/{repo}/hooks/{hook\_id}/pings](/en/rest/repos/webhooks#ping-a-repository-webhook) | read |  |
| [POST /repos/{owner}/{repo}/hooks/{hook\_id}/tests](/en/rest/repos/webhooks#test-the-push-repository-webhook) | read |  |

## [Repository permissions for "Workflows"](#repository-permissions-for-workflows)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /repos/{owner}/{repo}/contents/{path}](/en/rest/repos/contents#create-or-update-file-contents) | write |  |
| [DELETE /repos/{owner}/{repo}/contents/{path}](/en/rest/repos/contents#delete-a-file) | write |  |
| [POST /repos/{owner}/{repo}/git/refs](/en/rest/git/refs#create-a-reference) | write |  |
| [PATCH /repos/{owner}/{repo}/git/refs/{ref}](/en/rest/git/refs#update-a-reference) | write |  |
| [POST /repos/{owner}/{repo}/releases](/en/rest/releases/releases#create-a-release) | write |  |
| [PATCH /repos/{owner}/{repo}/releases/{release\_id}](/en/rest/releases/releases#update-a-release) | write |  |

## [User permissions for "Block another user"](#user-permissions-for-block-another-user)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /user/blocks/{username}](/en/rest/users/blocking#block-a-user) | write |  |
| [DELETE /user/blocks/{username}](/en/rest/users/blocking#unblock-a-user) | write |  |
| [GET /user/blocks](/en/rest/users/blocking#list-users-blocked-by-the-authenticated-user) | read |  |
| [GET /user/blocks/{username}](/en/rest/users/blocking#check-if-a-user-is-blocked-by-the-authenticated-user) | read |  |

## [User permissions for "Codespaces user secrets"](#user-permissions-for-codespaces-user-secrets)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /user/codespaces/secrets/{secret\_name}](/en/rest/codespaces/secrets#create-or-update-a-secret-for-the-authenticated-user) | write |  |
| [DELETE /user/codespaces/secrets/{secret\_name}](/en/rest/codespaces/secrets#delete-a-secret-for-the-authenticated-user) | write |  |
| [PUT /user/codespaces/secrets/{secret\_name}/repositories](/en/rest/codespaces/secrets#set-selected-repositories-for-a-user-secret) | write |  |
| [PUT /user/codespaces/secrets/{secret\_name}/repositories/{repository\_id}](/en/rest/codespaces/secrets#add-a-selected-repository-to-a-user-secret) | write |  |
| [DELETE /user/codespaces/secrets/{secret\_name}/repositories/{repository\_id}](/en/rest/codespaces/secrets#remove-a-selected-repository-from-a-user-secret) | write |  |
| [GET /user/codespaces/secrets](/en/rest/codespaces/secrets#list-secrets-for-the-authenticated-user) | read |  |
| [GET /user/codespaces/secrets/public-key](/en/rest/codespaces/secrets#get-public-key-for-the-authenticated-user) | read |  |
| [GET /user/codespaces/secrets/{secret\_name}](/en/rest/codespaces/secrets#get-a-secret-for-the-authenticated-user) | read |  |
| [GET /user/codespaces/secrets/{secret\_name}/repositories](/en/rest/codespaces/secrets#list-selected-repositories-for-a-user-secret) | read |  |

## [User permissions for "Email addresses"](#user-permissions-for-email-addresses)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PATCH /user/email/visibility](/en/rest/users/emails#set-primary-email-visibility-for-the-authenticated-user) | write |  |
| [POST /user/emails](/en/rest/users/emails#add-an-email-address-for-the-authenticated-user) | write |  |
| [DELETE /user/emails](/en/rest/users/emails#delete-an-email-address-for-the-authenticated-user) | write |  |
| [GET /user/emails](/en/rest/users/emails#list-email-addresses-for-the-authenticated-user) | read |  |
| [GET /user/public\_emails](/en/rest/users/emails#list-public-email-addresses-for-the-authenticated-user) | read |  |

## [User permissions for "Followers"](#user-permissions-for-followers)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /user/following/{username}](/en/rest/users/followers#follow-a-user) | write |  |
| [DELETE /user/following/{username}](/en/rest/users/followers#unfollow-a-user) | write |  |
| [GET /user/followers](/en/rest/users/followers#list-followers-of-the-authenticated-user) | read |  |
| [GET /user/following](/en/rest/users/followers#list-the-people-the-authenticated-user-follows) | read |  |
| [GET /user/following/{username}](/en/rest/users/followers#check-if-a-person-is-followed-by-the-authenticated-user) | read |  |

## [User permissions for "GPG keys"](#user-permissions-for-gpg-keys)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /user/gpg\_keys](/en/rest/users/gpg-keys#create-a-gpg-key-for-the-authenticated-user) | write |  |
| [DELETE /user/gpg\_keys/{gpg\_key\_id}](/en/rest/users/gpg-keys#delete-a-gpg-key-for-the-authenticated-user) | write |  |
| [GET /user/gpg\_keys](/en/rest/users/gpg-keys#list-gpg-keys-for-the-authenticated-user) | read |  |
| [GET /user/gpg\_keys/{gpg\_key\_id}](/en/rest/users/gpg-keys#get-a-gpg-key-for-the-authenticated-user) | read |  |

## [User permissions for "Gists"](#user-permissions-for-gists)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /gists](/en/rest/gists/gists#create-a-gist) | write |  |
| [PATCH /gists/{gist\_id}](/en/rest/gists/gists#update-a-gist) | write |  |
| [DELETE /gists/{gist\_id}](/en/rest/gists/gists#delete-a-gist) | write |  |
| [POST /gists/{gist\_id}/comments](/en/rest/gists/comments#create-a-gist-comment) | write |  |
| [PATCH /gists/{gist\_id}/comments/{comment\_id}](/en/rest/gists/comments#update-a-gist-comment) | write |  |
| [DELETE /gists/{gist\_id}/comments/{comment\_id}](/en/rest/gists/comments#delete-a-gist-comment) | write |  |
| [POST /gists/{gist\_id}/forks](/en/rest/gists/gists#fork-a-gist) | write |  |
| [PUT /gists/{gist\_id}/star](/en/rest/gists/gists#star-a-gist) | write |  |
| [DELETE /gists/{gist\_id}/star](/en/rest/gists/gists#unstar-a-gist) | write |  |

## [User permissions for "Git SSH keys"](#user-permissions-for-git-ssh-keys)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /user/keys](/en/rest/users/keys#create-a-public-ssh-key-for-the-authenticated-user) | write |  |
| [DELETE /user/keys/{key\_id}](/en/rest/users/keys#delete-a-public-ssh-key-for-the-authenticated-user) | write |  |
| [GET /user/keys](/en/rest/users/keys#list-public-ssh-keys-for-the-authenticated-user) | read |  |
| [GET /user/keys/{key\_id}](/en/rest/users/keys#get-a-public-ssh-key-for-the-authenticated-user) | read |  |
| [GET /users/{username}/keys](/en/rest/users/keys#list-public-keys-for-a-user) | read |  |

## [User permissions for "Interaction limits"](#user-permissions-for-interaction-limits)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /user/interaction-limits](/en/rest/interactions/user#set-interaction-restrictions-for-your-public-repositories) | write |  |
| [DELETE /user/interaction-limits](/en/rest/interactions/user#remove-interaction-restrictions-from-your-public-repositories) | write |  |
| [GET /user/interaction-limits](/en/rest/interactions/user#get-interaction-restrictions-for-your-public-repositories) | read |  |

## [User permissions for "Plan"](#user-permissions-for-plan)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [GET /users/{username}/settings/billing/ai\_credit/usage](/en/rest/billing/usage#get-billing-ai-credit-usage-report-for-a-user) | read |  |
| [GET /users/{username}/settings/billing/premium\_request/usage](/en/rest/billing/usage#get-billing-premium-request-usage-report-for-a-user) | read |  |
| [GET /users/{username}/settings/billing/usage](/en/rest/billing/usage#get-billing-usage-report-for-a-user) | read |  |
| [GET /users/{username}/settings/billing/usage/summary](/en/rest/billing/usage#get-billing-usage-summary-for-a-user) | read |  |

## [User permissions for "Private repository invitations"](#user-permissions-for-private-repository-invitations)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [GET /repos/{owner}/{repo}/invitations](/en/rest/collaborators/invitations#list-repository-invitations) | read |  |

## [User permissions for "Profile"](#user-permissions-for-profile)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PATCH /user](/en/rest/users/users#update-the-authenticated-user) | write |  |
| [POST /user/social\_accounts](/en/rest/users/social-accounts#add-social-accounts-for-the-authenticated-user) | write |  |
| [DELETE /user/social\_accounts](/en/rest/users/social-accounts#delete-social-accounts-for-the-authenticated-user) | write |  |

## [User permissions for "SSH signing keys"](#user-permissions-for-ssh-signing-keys)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [POST /user/ssh\_signing\_keys](/en/rest/users/ssh-signing-keys#create-a-ssh-signing-key-for-the-authenticated-user) | write |  |
| [DELETE /user/ssh\_signing\_keys/{ssh\_signing\_key\_id}](/en/rest/users/ssh-signing-keys#delete-an-ssh-signing-key-for-the-authenticated-user) | write |  |
| [GET /user/ssh\_signing\_keys](/en/rest/users/ssh-signing-keys#list-ssh-signing-keys-for-the-authenticated-user) | read |  |
| [GET /user/ssh\_signing\_keys/{ssh\_signing\_key\_id}](/en/rest/users/ssh-signing-keys#get-an-ssh-signing-key-for-the-authenticated-user) | read |  |

## [User permissions for "Starring"](#user-permissions-for-starring)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [PUT /user/starred/{owner}/{repo}](/en/rest/activity/starring#star-a-repository-for-the-authenticated-user) | write |  |
| [DELETE /user/starred/{owner}/{repo}](/en/rest/activity/starring#unstar-a-repository-for-the-authenticated-user) | write |  |
| [GET /user/starred](/en/rest/activity/starring#list-repositories-starred-by-the-authenticated-user) | read |  |
| [GET /user/starred/{owner}/{repo}](/en/rest/activity/starring#check-if-a-repository-is-starred-by-the-authenticated-user) | read |  |
| [GET /users/{username}/starred](/en/rest/activity/starring#list-repositories-starred-by-a-user) | read |  |

## [User permissions for "Watching"](#user-permissions-for-watching)

| Endpoint | Access | Additional permissions |
| --- | --- | --- |
| [GET /user/subscriptions](/en/rest/activity/watching#list-repositories-watched-by-the-authenticated-user) | read |  |
| [GET /users/{username}/subscriptions](/en/rest/activity/watching#list-repositories-watched-by-a-user) | read |  |
