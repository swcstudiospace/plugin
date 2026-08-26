# Manage your company | Docker Docs

Source: https://docs.docker.com/admin/company/manage

Back

[Manuals](https://docs.docker.com/manuals/)

- [Get started](/get-started/)
- [Guides](/guides/)
- [Reference](/reference/)

# Manage your company

Ask Gordon

Copy Markdown

View Markdown

---

Table of contents

---

Subscription:
Business

For:
Administrators

After creating a company, you can manage multiple organizations from Docker
Home. Company owners can use the company portal to invite users to specific
organizations, view seat availability across organizations, and add new
company owners.

## [Add more organizations](#add-more-organizations)

Company owners can add Docker organizations with a Docker Business plan to
their company, so long as they're also the organization owners for that
organization. There's no limit to the number of organizations you add to a
company.

> Once you add an organization to a company, you can't remove it from the
> company.

1. Sign in to [Docker Home](https://app.docker.com) and select
   your company.
2. Select **Managed organizations**.
3. Select **Add organization**, then choose an organization from the dropdown.

A nested organization must keep its Docker Business subscription to stay managed
by the company. If an organization downgrades from Docker Business, you can no
longer manage it through the company, and its owner must manage it separately.

## [Company owners](#company-owners)

A company can have multiple owners who manage the company and all of its
organizations. For details about the company owner role and how it affects
seats, see
[Company roles](https://docs.docker.com/admin/company/#company-roles).

### [Add a company owner](#add-a-company-owner)

1. Sign in to [Docker Home](https://app.docker.com) and select your company.
2. Select **Company owners**, then choose **Add owner**.
3. Specify the user's Docker ID, then finish by selecting **Add company owner**.

### [Remove a company owner](#remove-a-company-owner)

1. Sign in to [Docker Home](https://app.docker.com) and select your company.
2. Select **Company owners**.
3. Find the company owner you want to remove and select the **Actions** menu,
   then choose **Remove as company owner**.

## [Company invitations](#company-invitations)

You add a user to your company by inviting them to an organization within the
company. Company owners can invite members to any organization in the company
using a Docker ID, email address, or in bulk with a CSV file of email addresses.

Members and invitations belong to individual organizations, not to the company
itself. A pending invitation occupies a seat in the organization the user is
invited to.

### [Invite members to an organization](#invite-members-to-an-organization)

1. Sign in to [Docker Home](https://app.docker.com) and select your company.
2. Select **Users**, then choose **Invite**.
3. Choose how you want to invite members:
   - To invite individual users, select **Emails or usernames**.
   - To invite groups of users, select **CSV upload**.
4. Add user(s) to an organization by choosing **Select an organization**.

Users receive invitations in their email with instructions to accept the
invitation. After accepting the invitation, new members appear on the
**Users** page. The table specifies how many organizations they're members of.

### [Resend invitations](#resend-invitations)

Company owners can resend invitations from the company-level **Users** page.
To resend individual invitations:

1. Select your company from [Docker Home](https://app.docker.com/).
2. Select **Users**, then locate the invitee from the users table.
3. Select the **Actions** menu, then choose **Resend**.
   - Before resending, confirm you are resending the invitation to the correct
     invitee.
   - The resend invitation modal displays the date you originally invited the
     invitee.
4. Choose **Invite** to confirm.

To bulk resend invitations:

1. From the users table, use the multi-select checkboxes next to the invitees
   you want to invite.
2. Select **Resend invites**, then choose **Resend** to confirm.

## [Add seats to an organization](#add-seats-to-an-organization)

If you have a self-serve subscription that has no pending subscription changes,
you can add seats using Docker Home. For more information about adding seats,
see
[Manage seats](https://docs.docker.com/admin/organization/manage/manage-seats/#add-seats-to-your-subscription).

If you have a sales-assisted subscription, you must contact Docker support or
sales to add seats.

## [Manage teams](#manage-teams)

Teams exist at the organization level, not the company level. After inviting
members to an organization, you can add them to teams within that organization.
For more details, see
[Manage members on a team](https://docs.docker.com/admin/organization/manage/members/#manage-members-on-a-team).
