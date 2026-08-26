# Quickstart | Developers

Source: https://gitbook.com/docs/developers/integrations/quickstart

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

- [Developer documentation](/docs/developers)
- Build a custom component

  - [Quickstart](/docs/developers/integrations/quickstart)
  - [Install the CLI](/docs/developers/integrations/reference)
  - [Configure](/docs/developers/integrations/configurations)
  - [Develop](/docs/developers/integrations/development)
  - [Publish your component](/docs/developers/integrations/publishing)
  - [Submit for review](/docs/developers/integrations/submit-your-app-for-review)
  - [Concepts](/docs/developers/integrations/concepts)
  - [Guides](/docs/developers/integrations/guides)
- GitBook API

  - [Quickstart](/docs/developers/gitbook-api/quickstart)
  - [API reference](/docs/developers/gitbook-api/api-reference)
  - [Authentication](/docs/developers/gitbook-api/authentication)
  - [Rate limiting](/docs/developers/gitbook-api/rate-limiting)
  - [Pagination](/docs/developers/gitbook-api/pagination)
  - [Errors](/docs/developers/gitbook-api/errors)
  - [Concepts](/docs/developers/gitbook-api/concepts)
  - [Find your IDs](/docs/developers/gitbook-api/find-your-ids)
  - [Guides](/docs/developers/gitbook-api/guides)
- Resources

  - [ContentKit playground](https://app.gitbook.com/dev/contentkit/)
  - [GitHub examples](https://github.com/GitbookIO/integrations)

[Powered by GitBook](https://www.gitbook.com/?utm_source=content&utm_medium=trademark&utm_campaign=2SyQSbIa1iYS7z6Dx5di&utm_content=site_p4Xo4)

On this page

For the complete documentation index, see [llms.txt](https://gitbook.com/docs/llms.txt). This page is also available as [Markdown](https://gitbook.com/docs/developers/integrations/quickstart.md).

Ask

On this page

1. [Developers](/docs/developers)
2. [Build a custom component](/docs/developers/integrations)

# Quickstart

Build an integration with GitBook’s developer platform in minutes

GitBook’s developer platform allows you to build integrations that seamlessly connect GitBook to internal tools, third‑party services, custom workflows and more.

1

### Getting started

You’ll need a GitBook account to start using the developer platform. If you don’t already have an account, you can sign up for free [here](https://app.gitbook.com/join).

2

### Create a personal access token

After creating a GitBook account, you'll be able to create a personal access token in your [developer settings](https://app.gitbook.com/account/developer).

This token represents your user in GitBook, and allows you to make API calls, create integrations, and publish them to any GitBook spaces you're a part of to test them.

As always with access tokens, this token is specific to your user and should not be shared for use outside of your personal account.

Once you have your personal access token, you'll want to understand the differences between the pieces of the GitBook Integrations Platform in order to start developing your first app.

3

### Install the GitBook CLI

The [GitBook CLI](/docs/developers/integrations/reference) requires Node v18 or later. It can be installed from NPM using:

AskCopy

```
npm install @gitbook/cli -g
```

#### Authenticate with your account

Once you have the CLI installed, you can run the following command and authenticate yourself with your personal access token using the following command:

AskCopy

```
gitbook auth
```

4

### Create your integration

You can bootstrap your first integration by running the following command in your terminal:

AskCopy

```
gitbook integrations new
```

The prompts will ask you for a `name`, `title`, `organization`, and `scopes` for your integration.

In order to publish your integration, your integration must:

- Include a unique `name`
- Include an `organization` id that your authenticated user is a member of.

After bootstrapping your integration, you’re ready to open your integration in an IDE and start building.

5

### Develop your integration locally

In order to [develop your integration](/docs/developers/integrations/development) on your local machine, you’ll first need to publish your integration. In the root of your integration, run:

If you use an AI coding assistant, add GitBook’s [`build-integration`](https://github.com/GitbookIO/gitbook-skills/tree/main/skills/build-integration) skill. It gives your assistant integration-specific guidance.

1. In your integration repository’s root directory, run:

AskCopy

```
npx skills add GitBookIO/gitbook-skills
```

1. Start a new agent session after the installation completes.
2. Ask your assistant to read the `build-integration` skill before building your integration.

AskCopy

```
gitbook integrations publish
```

This will publish your integration to GitBook, and return a link with which you can install your integration. After installing your integration into your organization, space, or site, you can then run the development command to work on your integration locally.

Return to your integration on your local machine, and in the root of the integration, run the following development command:

AskCopy

```
gitbook integrations dev
```

After running the development script, you’re ready to start building your integration. Any changes made in your local version of the integration will be sent to the space you have your integration installed in. You’ll also be able to see logs in your console where applicable.

6

### Install and use your integration

Once you’re ready to start using your integration in GitBook, you’ll need to install your integration into a space or site.

You can find your integration’s install link returned in your terminal after publishing your integration with the `gitbook integrations publish` command.

### Continue building your integration

Continue with one of these integration guides:

####

#### Create interactive blocks

Build a custom block with a button that updates its text.

####

#### Receive webhook notifications

Receive external events and handle them in your integration.

####

#### Handle an HTTP request

Return a JSON response from your integration’s public endpoint.

### Explore the integration platform

####

#### Configure your integration

Define your integration’s metadata, scopes, blocks, and settings.

####

#### Build components

Create custom blocks with ContentKit and add interactive behavior.

####

#### Publish your integration

Publish, install, and submit your integration for review.

Last updated 4 days ago

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

- [Getting started](#getting-started)
- [Create a personal access token](#create-a-personal-access-token)
- [Install the GitBook CLI](#install-the-gitbook-cli)
- [Create your integration](#create-your-integration)
- [Develop your integration locally](#develop-your-integration-locally)
- [Install and use your integration](#install-and-use-your-integration)
- [Continue building your integration](#continue-building-your-integration)
- [Explore the integration platform](#explore-the-integration-platform)

Was this helpful?
