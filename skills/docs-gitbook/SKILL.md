---
name: docs-gitbook
description: Offline documentation skill for GitBook (https://gitbook.com/docs/). Use for GitBook sites, Git Sync, OpenAPI, publishing, Adaptive Content, and the GitBook API.
version: 1.0.0
metadata:
  hermes:
    tags: [docs, gitbook, git-sync, openapi, publishing]
---

# docs-gitbook

Offline corpus of **[GitBook docs](https://gitbook.com/docs/)** (product + developers). English only; locale mirrors (fr/zh/ja) were excluded.

## When to use
- Creating/publishing GitBook sites, spaces, pages, blocks
- Git Sync / docs-as-code, OpenAPI API references, Adaptive Content
- Visitor auth, embedding, customization, member management
- GitBook REST API, integrations, MCP on sites
- Plans, policies, migration from Confluence/Notion/Git

## How to answer
1. Prefer files under `references/` and cite the **Source:** URL in each file.
2. For broader recall (especially individual API endpoints), query the SQLite corpus:
   ```bash
   cd /root/.openclaw/workspace/projects/docs-scraper && source .venv/bin/activate
   python scripts/query.py "your question" --db data/db/skills/docs-gitbook.sqlite -k 8 --mode fts
   ```
3. Do **not** invent APIs missing from references/corpus.

## Corpus stats
- Source: https://gitbook.com/docs/ (GitBook-hosted)
- Full DB: `data/db/skills/docs-gitbook.sqlite` (1358 pages; 11178 FTS chunks)
- Skill package references: 183 unique English pages, quota-balanced across product + developers
- Scraped: 2026-08-22
- Excluded: locale mirrors (`/docs/documentation/fr|zh|ja-*`); mega `llms-full.txt` and the 228k 2025 changelog HTML

## Contents
- [Migrate to GitBook](references/001-Migrate-to-GitBook.md) — https://gitbook.com/docs/getting-started/import
- [LLM-ready docs](references/002-LLM-ready-docs.md) — https://gitbook.com/docs/getting-started/llm-ready-docs
- [Quickstart](references/003-Quickstart.md) — https://gitbook.com/docs/getting-started/quickstart
- [Site workspace](references/004-Site-workspace.md) — https://gitbook.com/docs/getting-started/sites-first
- [Blocks](references/005-Blocks.md) — https://gitbook.com/docs/create-content/blocks
- [Content structure](references/006-Content-structure.md) — https://gitbook.com/docs/create-content/content-structure
- [Format content](references/007-Format-content.md) — https://gitbook.com/docs/create-content/formatting
- [Guides](references/008-Guides.md) — https://gitbook.com/docs/create-content/guides
- [Document an API](references/009-Document-an-API.md) — https://gitbook.com/docs/create-content/openapi
- [Reusable content](references/010-Reusable-content.md) — https://gitbook.com/docs/create-content/reusable-content
- [Searching internal content](references/011-Searching-internal-content.md) — https://gitbook.com/docs/create-content/searching-your-content
- [Style guide](references/012-Style-guide.md) — https://gitbook.com/docs/create-content/styleguide
- [Variables and expressions](references/013-Variables-and-expressions.md) — https://gitbook.com/docs/create-content/variables-and-expressions
- [Version control](references/014-Version-control.md) — https://gitbook.com/docs/create-content/version-control
- [Cards](references/015-Cards.md) — https://gitbook.com/docs/create-content/blocks/cards
- [Code blocks](references/016-Code-blocks.md) — https://gitbook.com/docs/create-content/blocks/code-block
- [Columns](references/017-Columns.md) — https://gitbook.com/docs/create-content/blocks/columns
- [Conditional content](references/018-Conditional-content.md) — https://gitbook.com/docs/create-content/blocks/conditional-content
- [Drawings](references/019-Drawings.md) — https://gitbook.com/docs/create-content/blocks/drawing
- [Embedded URLs](references/020-Embedded-URLs.md) — https://gitbook.com/docs/create-content/blocks/embed-a-url
- [Expandable](references/021-Expandable.md) — https://gitbook.com/docs/create-content/blocks/expandable
- [Headings](references/022-Headings.md) — https://gitbook.com/docs/create-content/blocks/heading
- [Hints](references/023-Hints.md) — https://gitbook.com/docs/create-content/blocks/hint
- [Files](references/024-Files.md) — https://gitbook.com/docs/create-content/blocks/insert-files
- [Images](references/025-Images.md) — https://gitbook.com/docs/create-content/blocks/insert-images
- [Math & TeX](references/026-Math-TeX.md) — https://gitbook.com/docs/create-content/blocks/math-and-tex
- [Mermaid blocks](references/027-Mermaid-blocks.md) — https://gitbook.com/docs/create-content/blocks/mermaid-blocks
- [Ordered lists](references/028-Ordered-lists.md) — https://gitbook.com/docs/create-content/blocks/ordered-list
- [Adaptive content](references/029-Adaptive-content.md) — https://gitbook.com/docs/publish/adaptive-content
- [Set a custom domain](references/030-Set-a-custom-domain.md) — https://gitbook.com/docs/publish/custom-domain
- [Embed in your product](references/031-Embed-in-your-product.md) — https://gitbook.com/docs/publish/embedding
- [Guides](references/032-Guides.md) — https://gitbook.com/docs/publish/guides
- [PDF export](references/033-PDF-export.md) — https://gitbook.com/docs/publish/pdf-export
- [Publish a docs site](references/034-Publish-a-docs-site.md) — https://gitbook.com/docs/publish/publish-a-docs-site
- [SEO](references/035-SEO.md) — https://gitbook.com/docs/publish/seo
- [Site audience](references/036-Site-audience.md) — https://gitbook.com/docs/publish/site-audience
- [Site redirects](references/037-Site-redirects.md) — https://gitbook.com/docs/publish/site-redirects
- [Adapting your content](references/038-Adapting-your-content.md) — https://gitbook.com/docs/publish/adaptive-content/adapting-your-content
- [Enabling adaptive content](references/039-Enabling-adaptive-content.md) — https://gitbook.com/docs/publish/adaptive-content/enabling-adaptive-content
- [FAQ and troubleshooting](references/040-FAQ-and-troubleshooting.md) — https://gitbook.com/docs/publish/adaptive-content/faq-and-troubleshooting
- [Testing with segments](references/041-Testing-with-segments.md) — https://gitbook.com/docs/publish/adaptive-content/testing-with-segments
- [Setting a custom subdirectory](references/042-Setting-a-custom-subdirectory.md) — https://gitbook.com/docs/publish/custom-domain/setting-a-custom-subdirectory
- [Configuration](references/043-Configuration.md) — https://gitbook.com/docs/publish/embedding/configuration
- [Implementation](references/044-Implementation.md) — https://gitbook.com/docs/publish/embedding/implementation
- [Authentication](references/045-Authentication.md) — https://gitbook.com/docs/publish/embedding/using-with-authenticated-docs
- [Public publishing](references/046-Public-publishing.md) — https://gitbook.com/docs/publish/publish-a-docs-site/public-publishing
- [GitBook guides | Guides](references/047-GitBook-guides-Guides.md) — https://gitbook.com/docs/guides
- [GitBook guides](references/048-GitBook-guides.md) — https://gitbook.com/docs/guides/readme.md
- [API docs: The seven principles of great API docs and how to apply them | Guides](references/049-API-docs-The-seven-principles-of-great-API-docs-and-how-to-a.md) — https://gitbook.com/docs/guides/api-documentation/api-documentation-principles
- [Document your API in GitBook in 5 simple steps | Guides](references/050-Document-your-API-in-GitBook-in-5-simple-steps-Guides.md) — https://gitbook.com/docs/guides/api-documentation/document-your-api-in-gitbook-in-5-simple-steps
- [How to write incredible API documentation | Guides](references/051-How-to-write-incredible-API-documentation-Guides.md) — https://gitbook.com/docs/guides/api-documentation/how-to-write-incredible-api-documentation
- [Combine multiple existing sites into one using site sections | Guides](references/052-Combine-multiple-existing-sites-into-one-using-site-sections.md) — https://gitbook.com/docs/guides/content-organization-and-localization/combine-multiple-docs-sites-using-sections
- [Localize your docs with variants in GitBook | Guides](references/053-Localize-your-docs-with-variants-in-GitBook-Guides.md) — https://gitbook.com/docs/guides/content-organization-and-localization/localize-your-docs-with-variants-in-gitbook
- [Use GitHub Actions to translate GitBook pages | Guides](references/054-Use-GitHub-Actions-to-translate-GitBook-pages-Guides.md) — https://gitbook.com/docs/guides/content-organization-and-localization/use-github-actions-to-translate-gitbook-pages
- [How to customize your site’s configuration | Guides](references/055-How-to-customize-your-site-s-configuration-Guides.md) — https://gitbook.com/docs/guides/customizing-your-site/how-to-customize-your-sites-configuration
- [How to customize your site’s layout | Guides](references/056-How-to-customize-your-site-s-layout-Guides.md) — https://gitbook.com/docs/guides/customizing-your-site/how-to-customize-your-sites-layout
- [How to customize your site’s theme | Guides](references/057-How-to-customize-your-site-s-theme-Guides.md) — https://gitbook.com/docs/guides/customizing-your-site/how-to-customize-your-sites-theme
- [How to make a great-looking docs site | Guides](references/058-How-to-make-a-great-looking-docs-site-Guides.md) — https://gitbook.com/docs/guides/customizing-your-site/how-to-make-a-great-looking-docs-site
- [Analyze change request contributors with GitBook’s API | Guides](references/059-Analyze-change-request-contributors-with-GitBook-s-API-Guide.md) — https://gitbook.com/docs/guides/docs-analytics/analyze-change-request-contributors-with-gitbooks-api
- [Documentation analytics: which metrics to track and how to measure success | Guides](references/060-Documentation-analytics-which-metrics-to-track-and-how-to-me.md) — https://gitbook.com/docs/guides/docs-analytics/documentation-analytics
- [Track advanced analytics with GitBook's Events Aggregation API | Guides](references/061-Track-advanced-analytics-with-GitBook-s-Events-Aggregation-A.md) — https://gitbook.com/docs/guides/docs-analytics/track-advanced-analytics-with-gitbooks-events-aggregation-api
- [Track documentation analytics with Google Analytics | Guides](references/062-Track-documentation-analytics-with-Google-Analytics-Guides.md) — https://gitbook.com/docs/guides/docs-analytics/track-documentation-analytics-with-google-analytics
- [Agent skills](references/063-Agent-skills.md) — https://gitbook.com/docs/docs-as-code/ai-coding-assistants-and-skillmd
- [GitHub & GitLab Sync](references/064-GitHub-GitLab-Sync.md) — https://gitbook.com/docs/docs-as-code/git-sync
- [GitBook CLI](references/065-GitBook-CLI.md) — https://gitbook.com/docs/docs-as-code/gitbook-cli
- [GitBook MCP](references/066-GitBook-MCP.md) — https://gitbook.com/docs/docs-as-code/gitbook-mcp
- [Guides](references/067-Guides.md) — https://gitbook.com/docs/docs-as-code/guides
- [Commit messages & Autolink](references/068-Commit-messages-Autolink.md) — https://gitbook.com/docs/docs-as-code/git-sync/commits
- [Content configuration](references/069-Content-configuration.md) — https://gitbook.com/docs/docs-as-code/git-sync/content-configuration
- [Enabling GitHub Sync](references/070-Enabling-GitHub-Sync.md) — https://gitbook.com/docs/docs-as-code/git-sync/enabling-github-sync
- [Enabling GitLab Sync](references/071-Enabling-GitLab-Sync.md) — https://gitbook.com/docs/docs-as-code/git-sync/enabling-gitlab-sync
- [GitHub pull request preview](references/072-GitHub-pull-request-preview.md) — https://gitbook.com/docs/docs-as-code/git-sync/github-pull-request-preview
- [Monorepos](references/073-Monorepos.md) — https://gitbook.com/docs/docs-as-code/git-sync/monorepos
- [Troubleshooting](references/074-Troubleshooting.md) — https://gitbook.com/docs/docs-as-code/git-sync/troubleshooting
- [Change requests](references/075-Change-requests.md) — https://gitbook.com/docs/collaborate/change-requests
- [Comments](references/076-Comments.md) — https://gitbook.com/docs/collaborate/comments
- [Guides](references/077-Guides.md) — https://gitbook.com/docs/collaborate/guides
- [Live edits](references/078-Live-edits.md) — https://gitbook.com/docs/collaborate/live-edits
- [Member management](references/079-Member-management.md) — https://gitbook.com/docs/collaborate/member-management
- [Merge rules](references/080-Merge-rules.md) — https://gitbook.com/docs/collaborate/merge-rules
- [Notifications](references/081-Notifications.md) — https://gitbook.com/docs/collaborate/notifications
- [Inviting your team](references/082-Inviting-your-team.md) — https://gitbook.com/docs/collaborate/share
- [Change requests in a section](references/083-Change-requests-in-a-section.md) — https://gitbook.com/docs/collaborate/change-requests/change-requests-in-a-space
- [Change requests screen](references/084-Change-requests-screen.md) — https://gitbook.com/docs/collaborate/change-requests/change-requests-screen
- [Manage or remove members](references/085-Manage-or-remove-members.md) — https://gitbook.com/docs/collaborate/member-management/invite-members-to-your-organization
- [Permissions and inheritance](references/086-Permissions-and-inheritance.md) — https://gitbook.com/docs/collaborate/member-management/permissions-and-inheritance
- [Site customization](references/087-Site-customization.md) — https://gitbook.com/docs/manage-your-site/customization
- [Guides](references/088-Guides.md) — https://gitbook.com/docs/manage-your-site/guides
- [Install and manage integrations](references/089-Install-and-manage-integrations.md) — https://gitbook.com/docs/manage-your-site/install-an-integration
- [Site settings](references/090-Site-settings.md) — https://gitbook.com/docs/manage-your-site/site-settings
- [Site structure](references/091-Site-structure.md) — https://gitbook.com/docs/manage-your-site/site-structure
- [Extra configuration](references/092-Extra-configuration.md) — https://gitbook.com/docs/manage-your-site/customization/extra-configuration
- [Icons, colors, and themes](references/093-Icons-colors-and-themes.md) — https://gitbook.com/docs/manage-your-site/customization/icons-colors-and-themes
- [Layout and structure](references/094-Layout-and-structure.md) — https://gitbook.com/docs/manage-your-site/customization/layout-and-structure
- [Sharing and social](references/095-Sharing-and-social.md) — https://gitbook.com/docs/manage-your-site/customization/sharing-and-social
- [Toolbar on published sites and site previews](references/096-Toolbar-on-published-sites-and-site-previews.md) — https://gitbook.com/docs/manage-your-site/customization/toolbar-on-published-sites-and-site-previews
- [Personal settings](references/097-Personal-settings.md) — https://gitbook.com/docs/account-and-billing/account-settings
- [Billing FAQ](references/098-Billing-FAQ.md) — https://gitbook.com/docs/account-and-billing/billing-faq
- [Organization settings](references/099-Organization-settings.md) — https://gitbook.com/docs/account-and-billing/organization-settings
- [Plans](references/100-Plans.md) — https://gitbook.com/docs/account-and-billing/plans
- [SSO & SAML](references/101-SSO-SAML.md) — https://gitbook.com/docs/account-and-billing/sso-and-saml
- [Free trials](references/102-Free-trials.md) — https://gitbook.com/docs/account-and-billing/billing-faq/free-trial
- [Payments and invoices](references/103-Payments-and-invoices.md) — https://gitbook.com/docs/account-and-billing/billing-faq/payments-and-invoices
- [Site and member costs](references/104-Site-and-member-costs.md) — https://gitbook.com/docs/account-and-billing/billing-faq/plan-and-member-costs
- [Billing policy](references/105-Billing-policy.md) — https://gitbook.com/docs/account-and-billing/plans/billing-policy
- [Subscription cancellations](references/106-Subscription-cancellations.md) — https://gitbook.com/docs/account-and-billing/plans/cancelling-a-plan
- [Developer documentation | Developers](references/107-Developer-documentation-Developers.md) — https://gitbook.com/docs/developers
- [Developer documentation](references/108-Developer-documentation.md) — https://gitbook.com/docs/developers/readme.md
- [API reference | Developers](references/109-API-reference-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference
- [Authentication | Developers](references/110-Authentication-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/authentication
- [Concepts | Developers](references/111-Concepts-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/concepts
- [Errors | Developers](references/112-Errors-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/errors
- [Find your IDs | Developers](references/113-Find-your-IDs-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/find-your-ids
- [Guides | Developers](references/114-Guides-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/guides
- [Pagination | Developers](references/115-Pagination-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/pagination
- [Quickstart | Developers](references/116-Quickstart-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/quickstart
- [Rate limiting | Developers](references/117-Rate-limiting-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/rate-limiting
- [Concepts | Developers](references/118-Concepts-Developers.md) — https://gitbook.com/docs/developers/integrations/concepts
- [Configure | Developers](references/119-Configure-Developers.md) — https://gitbook.com/docs/developers/integrations/configurations
- [Develop | Developers](references/120-Develop-Developers.md) — https://gitbook.com/docs/developers/integrations/development
- [Guides | Developers](references/121-Guides-Developers.md) — https://gitbook.com/docs/developers/integrations/guides
- [Publish your component | Developers](references/122-Publish-your-component-Developers.md) — https://gitbook.com/docs/developers/integrations/publishing
- [Quickstart | Developers](references/123-Quickstart-Developers.md) — https://gitbook.com/docs/developers/integrations/quickstart
- [Install the CLI | Developers](references/124-Install-the-CLI-Developers.md) — https://gitbook.com/docs/developers/integrations/reference
- [Submit for review | Developers](references/125-Submit-for-review-Developers.md) — https://gitbook.com/docs/developers/integrations/submit-your-app-for-review
- [Change requests | Developers](references/126-Change-requests-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/change-requests
- [Collections | Developers](references/127-Collections-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/collections
- [Custom fonts | Developers](references/128-Custom-fonts-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/custom-fonts
- [Custom hostnames | Developers](references/129-Custom-hostnames-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/custom-hostnames
- [Docs sites | Developers](references/130-Docs-sites-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/docs-sites
- [GitBook API | Developers](references/131-GitBook-API-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/gitbook-api
- [Imports | Developers](references/132-Imports-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/imports
- [Integrations | Developers](references/133-Integrations-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/integrations
- [OpenAPI | Developers](references/134-OpenAPI-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/openapi
- [Organizations | Developers](references/135-Organizations-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/organizations
- [Spaces | Developers](references/136-Spaces-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/spaces
- [SSO | Developers](references/137-SSO-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/sso
- [Storage | Developers](references/138-Storage-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/storage
- [Subdomains | Developers](references/139-Subdomains-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/subdomains
- [System info | Developers](references/140-System-info-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/system-info
- [Teams | Developers](references/141-Teams-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/teams
- [Translations | Developers](references/142-Translations-Developers.md) — https://gitbook.com/docs/developers/gitbook-api/api-reference/translations
- [Site Policy on GitBook | Policies](references/143-Site-Policy-on-GitBook-Policies.md) — https://gitbook.com/docs/policies
- [Site Policy on GitBook](references/144-Site-Policy-on-GitBook.md) — https://gitbook.com/docs/policies/master.md
- [Terms of Service | Policies](references/145-Terms-of-Service-Policies.md) — https://gitbook.com/docs/policies/terms
- [DMCA Takedown Policy | Policies](references/146-DMCA-Takedown-Policy-Policies.md) — https://gitbook.com/docs/policies/policies/dmca-takedown-policy
- [GitBook AI Policy | Policies](references/147-GitBook-AI-Policy-Policies.md) — https://gitbook.com/docs/policies/policies/gitbook-ai-policy
- [Name Squatting Policy | Policies](references/148-Name-Squatting-Policy-Policies.md) — https://gitbook.com/docs/policies/policies/name-squatting-policy
- [Private Spaces | Policies](references/149-Private-Spaces-Policies.md) — https://gitbook.com/docs/policies/policies/private-spaces
- [Trademark Policy | Policies](references/150-Trademark-Policy-Policies.md) — https://gitbook.com/docs/policies/policies/trademark-policy
- [Product updates | Changelog](references/151-Product-updates-Changelog.md) — https://gitbook.com/docs/changelog
- [2022 and earlier | Changelog](references/152-2022-and-earlier-Changelog.md) — https://gitbook.com/docs/changelog/2022-and-earlier-product-updates
- [2023 | Changelog](references/153-2023-Changelog.md) — https://gitbook.com/docs/changelog/2023-product-updates
- [Automatic docs improvements](references/154-Automatic-docs-improvements.md) — https://gitbook.com/docs/gitbook-agent/automatic-docs-improvements
- [Channels](references/155-Channels.md) — https://gitbook.com/docs/gitbook-agent/channels
- [Guides](references/156-Guides.md) — https://gitbook.com/docs/gitbook-agent/guides
- [Overview](references/157-Overview.md) — https://gitbook.com/docs/gitbook-agent/overview
- [Review change requests with GitBook Agent](references/158-Review-change-requests-with-GitBook-Agent.md) — https://gitbook.com/docs/gitbook-agent/review-change-requests-with-gitbook-agent
- [Translations](references/159-Translations.md) — https://gitbook.com/docs/gitbook-agent/translations
- [Writing with GitBook Agent](references/160-Writing-with-GitBook-Agent.md) — https://gitbook.com/docs/gitbook-agent/write-and-edit-with-ai
- [Skill](references/161-Skill.md) — https://gitbook.com/docs/skill
- [Build an Integration](references/162-Build-an-Integration.md) — https://gitbook.com/docs/skill/build-integration
- [Configure a Site](references/163-Configure-a-Site.md) — https://gitbook.com/docs/skill/configure-site
- [Create & Manage Change Requests](references/164-Create-Manage-Change-Requests.md) — https://gitbook.com/docs/skill/cr-create
- [Review Change Requests](references/165-Review-Change-Requests.md) — https://gitbook.com/docs/skill/cr-review
- [Write & Edit Docs](references/166-Write-Edit-Docs.md) — https://gitbook.com/docs/skill/write-docs
- [Write OpenAPI Reference Docs](references/167-Write-OpenAPI-Reference-Docs.md) — https://gitbook.com/docs/skill/write-openapi
- [AI Search](references/168-AI-Search.md) — https://gitbook.com/docs/ai-for-your-readers/ai-search
- [Connections](references/169-Connections.md) — https://gitbook.com/docs/ai-for-your-readers/connections
- [GitBook Assistant](references/170-GitBook-Assistant.md) — https://gitbook.com/docs/ai-for-your-readers/gitbook-ai-assistant
- [MCP servers for published docs](references/171-MCP-servers-for-published-docs.md) — https://gitbook.com/docs/ai-for-your-readers/mcp-servers-for-published-docs
- [Contact support](references/172-Contact-support.md) — https://gitbook.com/docs/help/contact-support
- [Contribute to the docs](references/173-Contribute-to-the-docs.md) — https://gitbook.com/docs/help/contribute
- [Report a bug](references/174-Report-a-bug.md) — https://gitbook.com/docs/help/report-a-bug
- [Troubleshooting](references/175-Troubleshooting.md) — https://gitbook.com/docs/help/troubleshooting
- [Core concepts](references/176-Core-concepts.md) — https://gitbook.com/docs/reference/concepts
- [GitBook UI](references/177-GitBook-UI.md) — https://gitbook.com/docs/reference/gitbook-ui
- [Glossary](references/178-Glossary.md) — https://gitbook.com/docs/reference/glossary
- [Keyboard shortcuts](references/179-Keyboard-shortcuts.md) — https://gitbook.com/docs/reference/keyboard-shortcuts
- [AI insights](references/180-AI-insights.md) — https://gitbook.com/docs/analytics/ai-insights
- [Guides](references/181-Guides.md) — https://gitbook.com/docs/analytics/guides
- [Site analytics](references/182-Site-analytics.md) — https://gitbook.com/docs/analytics/insights
- [GitBook documentation](references/183-GitBook-documentation.md) — https://gitbook.com/docs

## Notes
- Prefer `references/` over memory. Short FTS queries (2–4 tokens) work better than long AND chains.
- Live docs may change; re-crawl with `python scripts/crawl.py --config configs/gitbook-docs.yaml --resume`.
