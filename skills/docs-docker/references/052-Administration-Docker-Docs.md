# Administration | Docker Docs

Source: https://docs.docker.com/admin

Back

[Manuals](https://docs.docker.com/manuals/)

- [Get started](/get-started/)
- [Guides](/guides/)
- [Reference](/reference/)

# Administration

Ask Gordon

Copy Markdown

View Markdown

---

Table of contents

---

Organization and company owners can manage members, control access, and enforce
security across their Docker environments. You perform these tasks in Docker
Home, which provides centralized observability, access management, and security
controls.

As an organization or company owner, you can:

- Create and manage companies and organizations
- Assign roles and permissions to members
- Group members into teams to manage access by project or role
- Set company-wide policies, including SCIM provisioning and security
  enforcement

## [Company and organization hierarchy](#company-and-organization-hierarchy)

To provide centralized administration, Docker organizes companies and
organizations into the following hierarchy and roles.

![Diagram showing Docker’s administration hierarchy with Company at the top, followed by Organizations, Teams, and Members](https://docs.docker.com/admin/images/docker-admin-structure.webp)

### [Company](#company)

A company groups multiple Docker organizations for centralized configuration. A
company owner can view and manage every organization in the company and its
company-wide settings, with the same access rights as an organization owner. For
the company owner role and how it affects seats, see
[Company roles](https://docs.docker.com/admin/company/#company-roles).

Companies are only available for Docker Business subscribers.

### [Organization](#organization)

An organization sits below the company and is where you group teams and
members and assign access to repositories. Every Docker Team and Business
subscriber has at least one organization.

Organization owners hold the organization owner administrator role and manage
organization settings, users, and access controls. Each owner occupies a
[seat](https://docs.docker.com/admin/organization/organization-faqs/#what-is-the-difference-between-user-invitee-seat-and-member).

[Upgrading to a Docker Business plan](https://www.docker.com/pricing?ref=Docs&refAction=DocsAdmin)
grants you the company owner role so you can manage multiple organizations.

### [Team](#team)

Teams are optional and let you group members to assign repository permissions
collectively. Teams simplify permission management across projects
or functions.

### [Member](#member)

A member is any Docker user added to an organization. Organization and company
owners can assign roles to members to define their level of access.

## [What's next](#whats-next)

Learn how to manage companies and organizations in the following sections.

[Explore how to manage a company.](/admin/company/)

[Learn about organization administration.](/admin/organization/)

[Learn how to onboard and secure your organization.](/admin/organization/setup/onboard)

[Explore security features for administrators.](/enterprise/security/)
