# Company FAQs | Docker Docs

Source: https://docs.docker.com/admin/company/company-faqs

Back

[Manuals](https://docs.docker.com/manuals/)

- [Get started](/get-started/)
- [Guides](/guides/)
- [Reference](/reference/)

# Company FAQs

Ask Gordon

Copy Markdown

View Markdown

---

Table of contents

---

### [Some of my organizations don’t have a Docker Business subscription. Can I still use a parent company?](#some-of-my-organizations-dont-have-a-docker-business-subscription-can-i-still-use-a-parent-company)

Yes, but you can only add organizations with a Docker Business subscription
to a company. For more details, see
[Add more organizations](https://docs.docker.com/admin/company/manage/#add-more-organizations).

### [What happens if one of my organizations downgrades from Docker Business, but I still need access as a company owner?](#what-happens-if-one-of-my-organizations-downgrades-from-docker-business-but-i-still-need-access-as-a-company-owner)

To access and manage a nested organization, it must have a Docker Business
subscription. If an organization downgrades from Docker Business, its owner must
manage it outside of the company. For more details, see
[Add more organizations](https://docs.docker.com/admin/company/manage/#add-more-organizations).

### [Do company owners occupy a subscription seat?](#do-company-owners-occupy-a-subscription-seat)

Company owners don't occupy a seat unless one of the following is true:

- They are added as a member of an organization under your company
- SSO is enabled and the company owner signs in through SSO, which
  automatically adds them as an organization member

When you first create a company, your account is both a company owner and an
organization owner, so it occupies a seat as long as you remain an organization
owner. To free up that seat,
[assign another user as the organization owner](https://docs.docker.com/admin/organization/manage/members/#update-a-member-role)
and remove yourself from the organization. You keep full administrative access
as a company owner without using a subscription seat.

### [What permissions does the company owner have in the associated/nested organizations?](#what-permissions-does-the-company-owner-have-in-the-associatednested-organizations)

Company owners can navigate to the **Organizations** page to view all their
nested organizations in a single location. They can also view or edit
organization members and change single sign-on (SSO) and System for
Cross-domain Identity Management (SCIM) settings. Changes to company settings
impact all users in each organization under the company.

For more information, see
[Roles and permissions](https://docs.docker.com/enterprise/security/roles-and-permissions/).
