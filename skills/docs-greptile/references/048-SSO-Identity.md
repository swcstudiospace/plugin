# SSO & Identity

Source: https://www.greptile.com/docs/security/sso-and-identity

SSO & Identity is an Enterprise feature. Contact [support@greptile.com](mailto:support@greptile.com) to set it up for your organization.

## [​](#single-sign-on-sso) Single Sign-On (SSO)

Members sign in to Greptile through your SAML 2.0 identity provider, such as Okta, Microsoft Entra ID, Google Workspace, OneLogin, or JumpCloud. Your admins manage access from the IdP.
Before you can configure SSO, verify the domain your members sign in with. Greptile gives you a TXT record to add at your DNS provider, and verifies it once the record propagates.

## [​](#auto-join) Auto Join

When Auto Join is on, anyone who signs in with a verified email on your organization’s domain is added to the organization automatically. When it’s off, members join by invitation.

## [​](#require-sso-beta) Require SSO (Beta)

Require SSO restricts access to members who signed in through your SAML identity provider. Password and Google logins still work as sign-in methods, but a session created with them can’t access the organization until the user authenticates via SSO.
Enforcement is per-organization. A member who also belongs to a non-SSO organization keeps normal access to that organization.

## [​](#scim-/-directory-sync-beta) SCIM / Directory Sync (Beta)

Directory Sync provisions your organization from your identity provider over SCIM 2.0. People assigned in the IdP are added to Greptile, or invited if they don’t have an account yet, and people removed from the IdP lose access automatically. Existing members in the IdP are adopted by the sync and keep their current roles. Members outside the IdP are unaffected.

1

Connect a directory

In your Greptile organization settings, connect a directory. Greptile generates a SCIM 2.0 base URL and a bearer token.

2

Configure your identity provider

Enter the base URL and token in your identity provider’s provisioning settings, and set the `userName` attribute to each user’s work email. Greptile matches accounts by email.

3

Enable provisioning

Enable provisioning of user creates, updates, and deactivations. Greptile uses updates to track account status, not to sync profile details. Deactivation in the IdP is what removes access.

4

Assign people

Assign the users or groups you want in Greptile to the app. Only assigned people are synced.

### [​](#group-mappings-beta) Group Mappings (Beta)

Map a group from your identity provider onto a Greptile team, and team membership stays in sync automatically. Members of the group are added to the team with the role the mapping sets, and people who leave the group are removed. A mapping can raise a member’s role in the team but never lowers it.

Group mappings need your identity provider to push group memberships to Greptile in addition to provisioning users. Most providers configure this separately from user assignment, and the members of a pushed group must also be assigned to the app.

⌘I
