# Deactivate an organization | Docker Docs

Source: https://docs.docker.com/admin/organization/deactivate-account

Back

[Manuals](https://docs.docker.com/manuals/)

- [Get started](/get-started/)
- [Guides](/guides/)
- [Reference](/reference/)

# Deactivate an organization

Ask Gordon

Copy Markdown

View Markdown

---

Table of contents

---

For:
Administrators

Learn how to deactivate a Docker organization, including required prerequisite
steps. For information about deactivating user accounts, see
[Deactivate a Docker
account](https://docs.docker.com/accounts/deactivate-user-account/).

> All Docker products and services that use this organization are
> inaccessible after you deactivate it. Your individual Docker account
> remains active.

## [Prerequisites](#prerequisites)

You must complete all the following steps before you can deactivate your
organization:

- Download any images and tags you want to keep. Use `docker pull -a <image>`
  to pull all tags, or `docker pull <image>:<tag>` to pull a specific tag.
- If you have an active Docker subscription,
  [downgrade it to a basic
  organization
  account](https://docs.docker.com/subscription/plans/docker/#cancel-a-docker-plan).
- Remove all other members within the organization.
- Unlink your
  [GitHub and Bitbucket
  accounts](https://docs.docker.com/docker-hub/repos/manage/builds/link-source/#unlink-a-github-user-account).
- For Business organizations,
  [remove your SSO
  connection](https://docs.docker.com/enterprise/security/single-sign-on/manage/#delete-a-connection).

## [Deactivate](#deactivate)

> Deactivating an organization is permanent and can't be undone. Make sure
> you've gathered all the data you need before you deactivate it.

1. Sign in to [Docker Home](https://app.docker.com) and select the organization
   you want to deactivate.
2. Select **Organization settings**, then **Deactivate**. If the **Deactivate**
   button is unavailable, confirm you've completed all
   [Prerequisites](#prerequisites).
3. Enter the organization name to confirm deactivation.
4. Select **Deactivate organization**.
