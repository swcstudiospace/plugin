# Develop | Developers

Source: https://gitbook.com/docs/developers/integrations/development

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

    - [ContentKit](/docs/developers/integrations/development/contentkit)
    - [Integration runtime](/docs/developers/integrations/development/runtime)
    - [Client library](/docs/developers/integrations/development/client-library)
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

For the complete documentation index, see [llms.txt](https://gitbook.com/docs/llms.txt). This page is also available as [Markdown](https://gitbook.com/docs/developers/integrations/development.md).

Ask

On this page

1. [Developers](/docs/developers)
2. [Build a custom component](/docs/developers/integrations)

# Develop

Develop and test integrations locally on your machine

After [bootstrapping your integration with the GitBook CLI](/docs/developers/integrations/quickstart#bootstrap-your-app), you can continue using the CLI to develop and test your app.

1

#### Publish your integration

Before you're able to develop your integration, you will first need to publish it. You can do this by running the following command in the root directory for your integration:

AskCopy

```
gitbook publish
```

By default (defined in the CLI-generated `gitbook-manifest.yaml`), your integration will be published privately, and owned by the organization specified in the manifest.

After publishing your integration, the CLI will give you a link to install your integration into the organization you’ve set.

You need to install your app into at least 1 space or site in order to develop it locally.

2

#### Start your integration’s development server

While inside the root directory of your integration, run:

AskCopy

```
gitbook dev
```

This will start a development server tied to your organization.

Running this command will start a development server for use by the integration only. **You do not need to navigate to the port the server is running on.**
All integration traffic will automatically be served from your local server instead of the published version.

3

#### Develop your integration

If you use an AI coding assistant, add GitBook’s [`build-integration`](https://github.com/GitbookIO/gitbook-skills/tree/main/skills/build-integration) skill. It gives your assistant integration-specific guidance.

1. In your integration repository’s root directory, run:

AskCopy

```
npx skills add GitBookIO/gitbook-skills
```

1. Start a new agent session after the installation completes.
2. Ask your assistant to read the `build-integration` skill before building your integration.

It's recommended that you [disable browser caching](https://stackoverflow.com/a/7000899) for the most optimal experience when developing your app.

Any logs sent to the console or made through your integration's `RuntimeContext` will be surfaced in your browser's console.

Any UI changes made to your integration will need a browser refresh in order to be visible.

### FAQ

Why don't I see any logs in my console?

Depending on where your console log is run in your integration, you may see it in your machine's console or your browser's console. Please check both to ensure your logs are working correctly.

I'm getting an error when visiting the URL listed in the console.

The URL provided in the console is used as a server for your integration. You do not need to visit this URL.

Instead, visit the GitBook space you provided in the dev command when starting your development server (i.e. `app.gitbook.com/o/org_id/s/space_id`).

Last updated 16 days ago

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

Was this helpful?
