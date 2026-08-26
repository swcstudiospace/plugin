# GitBook AI Policy | Policies

Source: https://gitbook.com/docs/policies/policies/gitbook-ai-policy

[New: The GitBook MCP server is here.

Connect your AI agent](/docs/docs-as-code/gitbook-mcp)

[![Logo](https://gitbook.com/docs/~gitbook/image?url=https%3A%2F%2F4045551102-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252Fd8f63b60-89ae-11e7-8574-5927d48c4877%252Fsites%252Fsite_p4Xo4%252Flogo%252FQiQ01JRaxVbpTVczX2Eu%252FGitBook%2520-%2520Dark.svg%3Falt%3Dmedia%26token%3D5e460027-d257-44bc-8a3b-3ebffba1b3eb&width=260&dpr=3&quality=100&sign=cf4edc76&sv=2)![Logo](https://gitbook.com/docs/~gitbook/image?url=https%3A%2F%2F4045551102-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252Fd8f63b60-89ae-11e7-8574-5927d48c4877%252Fsites%252Fsite_p4Xo4%252Flogo%252FjeMEyot5xbWcWdbY8fAL%252FGitBook%2520-%2520Light.svg%3Falt%3Dmedia%26token%3D3c87464e-c48d-4bab-accf-cb5070bbf2c4&width=260&dpr=3&quality=100&sign=b5e2ad2&sv=2)](https://www.gitbook.com/)

`⌘Ctrl``k`

Ask

Product[Pricing](https://www.gitbook.com/pricing)[Book a demo](https://www.gitbook.com/enterprise)[Log in](https://app.gitbook.com/join?utm_content=header_log_in&utm_source=gitbook_docs)[Sign up](https://app.gitbook.com/join?utm_content=header_sign_up&utm_source=gitbook_docs)

More

- [Documentation](/docs)
- [Developers](/docs/developers)
- Resources

GitBook Assistant

#####

I'm here to help you with the docs.

How do I migrate my docs to GitBook?Give me an overview of GitBook's AI features.What has GitBook shipped in the last month?

`⌘Ctrl``i`

AI Based on your context

Send

[![Logo](https://gitbook.com/docs/~gitbook/image?url=https%3A%2F%2F4045551102-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252Fd8f63b60-89ae-11e7-8574-5927d48c4877%252Fsites%252Fsite_p4Xo4%252Flogo%252FQiQ01JRaxVbpTVczX2Eu%252FGitBook%2520-%2520Dark.svg%3Falt%3Dmedia%26token%3D5e460027-d257-44bc-8a3b-3ebffba1b3eb&width=260&dpr=3&quality=100&sign=cf4edc76&sv=2)![Logo](https://gitbook.com/docs/~gitbook/image?url=https%3A%2F%2F4045551102-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252Fd8f63b60-89ae-11e7-8574-5927d48c4877%252Fsites%252Fsite_p4Xo4%252Flogo%252FjeMEyot5xbWcWdbY8fAL%252FGitBook%2520-%2520Light.svg%3Falt%3Dmedia%26token%3D3c87464e-c48d-4bab-accf-cb5070bbf2c4&width=260&dpr=3&quality=100&sign=b5e2ad2&sv=2)](https://www.gitbook.com/)

- [Site Policy on GitBook](/docs/policies)
- [Terms of Service](/docs/policies/terms)
- Policies

  - [GitBook AI Policy](/docs/policies/policies/gitbook-ai-policy)
  - [DMCA Takedown Policy](/docs/policies/policies/dmca-takedown-policy)
  - [Name Squatting Policy](/docs/policies/policies/name-squatting-policy)
  - [Trademark Policy](/docs/policies/policies/trademark-policy)
  - [Private Spaces](/docs/policies/policies/private-spaces)
- Privacy and security

  - [Security](/docs/policies/privacy-and-security/security)
  - [Privacy Statement](/docs/policies/privacy-and-security/statement)

[Powered by GitBook](https://www.gitbook.com/?utm_source=content&utm_medium=trademark&utm_campaign=-LBUnokgAHp7SX9tJUrr&utm_content=site_p4Xo4)

On this page

For the complete documentation index, see [llms.txt](https://gitbook.com/docs/llms.txt). This page is also available as [Markdown](https://gitbook.com/docs/policies/policies/gitbook-ai-policy.md).

Ask

On this page

1. Resources
2. [Policies](/docs/policies)
3. [Policies](/docs/policies/policies)

# GitBook AI Policy

## Overview

GitBook uses AI across the product. Features include AI Search, GitBook Assistant, editor writing tools, and AI Insights.

This policy explains data handling, providers, and available controls.

Our core commitments are:

- GitBook never uses customer content to train its models or third-party models.
- Organization admins can disable AI features at the site level.
- GitBook applies the same security and privacy standards to AI processing.

## AI providers and data processing

### Providers

GitBook uses OpenAI’s enterprise API for AI features. OpenAI does not train, improve, or fine-tune models with customer data sent through this API.

OpenAI is a [subprocessor](/docs/policies/privacy-and-security/security/subprocessors).

### Zero data retention

Zero data retention coverage varies by endpoint:

- GitBook runs the content-scrubbing pipeline with `store=false`. It removes sensitive data before further AI processing.
- GitBook Agent and Channels use `store=true`. These endpoints do not have zero data retention coverage.

GitBook enables zero data retention per endpoint. It does not use one formal OpenAI agreement.

## How data flows through AI features

### GitBook Assistant on published sites

When a visitor asks GitBook Assistant a question:

1. The browser sends the question to GitBook’s backend.
2. GitBook retrieves relevant indexed site content for context.
3. GitBook sends the question and context to OpenAI.
4. GitBook streams the response to the visitor’s browser.

GitBook stores the question, response, sources, and metadata for AI Insights. Metadata includes the model ID, session identifiers, and timestamp.

GitBook does not include visitor personal data beyond the submitted question.

### AI Search

GitBook uses OpenAI and Turbopuffer for AI Search. When GitBook indexes content, it sends documentation pages to OpenAI in large chunks. A chunk can contain a full page.

OpenAI creates vector embeddings. GitBook stores the embeddings in Turbopuffer, a third-party vector database.

When someone searches, GitBook sends their query to OpenAI for embedding. GitBook sends the resulting vector to Turbopuffer for similarity matching.

OpenAI creates embeddings only. Turbopuffer performs all similarity matching.

### AI writing features and GitBook Agent

Editor writing features send selected content and surrounding page context to OpenAI. These features include rewriting, summarization, and translation.

GitBook Agent receives tools for searching, reading, and editing pages. It independently selects the tools needed to fulfill a request.

During a session, GitBook Agent can access content within the current site or space. Existing permissions control access beyond the current site or space. GitBook Agent cannot access content unavailable to the requester.

### Content indexing

GitBook indexes published documentation for AI Search and GitBook Assistant. GitBook sends page content chunks to OpenAI’s embeddings API.

OpenAI converts the content into vector embeddings. GitBook stores the embeddings in Turbopuffer.

GitBook routes embedding requests through Cloudflare AI Gateway. Cloudflare caches embedding results for performance and cost efficiency. This caching can retain page content chunks.

OpenAI handles input retention as described in [Zero data retention](/docs/policies/policies/gitbook-ai-policy#zero-data-retention). Cloudflare does not link cached data to an organization.

### Open in ChatGPT or Claude

The “Open in ChatGPT / Claude” action sends the current page directly to ChatGPT or Claude. The visitor’s account settings govern this transfer.

This action does not use GitBook’s OpenAI enterprise agreement. GitBook’s zero-retention, retention, and no-training terms do not apply.

## Data retention and logging

### Data GitBook stores

Data type

Purpose

Retention

Question text and AI-generated response

AI Insights analytics

Indefinite

Response ID, model ID, and sources

AI Insights analytics

Indefinite

Session and visitor identifiers

AI Insights analytics

Indefinite

Operational metadata, including token usage, service tier, and errors

Operational monitoring

Indefinite

Vector embeddings of published content

AI Search and GitBook Assistant

Updated on publish and deleted when content is removed

GitBook does not store visitor IP addresses with AI interaction records.

## AI security protections

### Input handling

GitBook sends user inputs to the AI provider as entered. GitBook does not filter or redact queries before they reach the LLM.

External connector content, such as Intercom content, is an exception. GitBook runs that content through the content-scrubbing pipeline before it reaches the LLM.

Published-site AI features include site content in LLM context. Organizations that publish sensitive or access-restricted content can consider this before enabling AI features.

### Infrastructure

GitBook encrypts all communication with OpenAI using TLS. GitBook securely stores AI provider API keys and rotates them regularly.

GitBook’s SOC 2 Type II certification and GDPR compliance cover AI processing.

## Customer controls

### Disabling AI features

GitBook offers two control levels:

- **Organization level:** Organization admins can turn off **Enable GitBook AI** in organization settings. This disables AI writing and editing tools and **Ask AI** for every organization member.
- **Site level:** Site owners can separately enable or disable AI Search and GitBook Assistant in site settings.

When you disable AI features, GitBook does not send that site’s content to AI providers.

### Open in ChatGPT or Claude

Site owners can disable the “Open in ChatGPT / Claude” action. To configure it, select **Site customization** → **Page actions** → **Open in AI providers**.

Turning off **Page actions** removes this action. It also disables the MCP server at `~gitbook/mcp`.

To keep MCP available, leave **Page actions** enabled. Then disable only **Open in AI providers**.

See [Open in ChatGPT or Claude](/docs/policies/policies/gitbook-ai-policy#open-in-chatgpt-or-claude) for data handling details.

## Compliance and legal

### GDPR

GitBook’s [Data Processing Agreement](/docs/policies/privacy-and-security/statement#dpa) covers AI data processing. OpenAI processes visitor queries as a subprocessor.

GitBook’s DPA and standard contractual clauses cover this transfer.

### No training commitment

GitBook does not use customer data to train AI or machine learning models. GitBook will not do so without prior written consent.

This commitment covers all GitBook content. It includes documentation, API specifications, and internal knowledge bases. It applies whether AI features are enabled or disabled.

### Related policies

- [Subprocessors](/docs/policies/privacy-and-security/security/subprocessors)
- [Terms of Service](/docs/policies/terms)
- [Privacy Statement](/docs/policies/privacy-and-security/statement)
- [Data Processing Agreement](/docs/policies/privacy-and-security/statement#dpa)
- [Security FAQ](/docs/policies/privacy-and-security/security/security-faq)

Last updated 9 days ago

Was this helpful?

![Logo](https://gitbook.com/docs/~gitbook/image?url=https%3A%2F%2F4045551102-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252Fd8f63b60-89ae-11e7-8574-5927d48c4877%252Fsites%252Fsite_p4Xo4%252Flogo%252Fqc0Iuu7eh3D2m5qRdXG4%252FGitBook%2520-%2520Dark.png%3Falt%3Dmedia%26token%3D872d1d88-a108-47e3-a82d-876419cf4898&width=320&dpr=3&quality=100&sign=f643efe8&sv=2)![Logo](https://gitbook.com/docs/~gitbook/image?url=https%3A%2F%2F4045551102-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252Fd8f63b60-89ae-11e7-8574-5927d48c4877%252Fsites%252Fsite_p4Xo4%252Flogo%252FevmAcBgVVSyku2cQUdu1%252FGitBook%2520-%2520Light.png%3Falt%3Dmedia%26token%3Dbb57af6c-e24a-45d8-9490-23cd69cf1443&width=320&dpr=3&quality=100&sign=3f4471a&sv=2)

#### Resources

- [Showcase](https://www.gitbook.com/customers)
- [Enterprise](https://www.gitbook.com/enterprise)
- [Status](https://www.gitbookstatus.com/)

#### Company

- [Careers](https://www.gitbook.com/about#open-roles)
- [Blog](https://www.gitbook.com/blog)
- [Community](https://github.com/GitbookIO/community)

#### Policies

- [Subprocessors](/docs/policies)
- [Terms of Service](/docs/policies/terms)

- [Overview](#overview)
- [AI providers and data processing](#ai-providers-and-data-processing)
- [Providers](#providers)
- [Zero data retention](#zero-data-retention)
- [How data flows through AI features](#how-data-flows-through-ai-features)
- [GitBook Assistant on published sites](#gitbook-assistant-on-published-sites)
- [AI Search](#ai-search)
- [AI writing features and GitBook Agent](#ai-writing-features-and-gitbook-agent)
- [Content indexing](#content-indexing)
- [Open in ChatGPT or Claude](#open-in-chatgpt-or-claude)
- [Data retention and logging](#data-retention-and-logging)
- [Data GitBook stores](#data-gitbook-stores)
- [AI security protections](#ai-security-protections)
- [Input handling](#input-handling)
- [Infrastructure](#infrastructure)
- [Customer controls](#customer-controls)
- [Disabling AI features](#disabling-ai-features)
- [Open in ChatGPT or Claude](#open-in-chatgpt-or-claude-1)
- [Compliance and legal](#compliance-and-legal)
- [GDPR](#gdpr)
- [No training commitment](#no-training-commitment)
- [Related policies](#related-policies)

Was this helpful?
