# Submit for review | Developers

Source: https://gitbook.com/docs/developers/integrations/submit-your-app-for-review

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

For the complete documentation index, see [llms.txt](https://gitbook.com/docs/llms.txt). This page is also available as [Markdown](https://gitbook.com/docs/developers/integrations/submit-your-app-for-review.md).

Ask

On this page

1. [Developers](/docs/developers)
2. [Build a custom component](/docs/developers/integrations)

# Submit for review

List your integration on GitBook’s verified integration page

After [bootstrapping](/docs/developers/integrations/quickstart) and [publishing](/docs/developers/integrations/publishing) an integration, you’re already able to install and use it [via the install link](/docs/developers/integrations/quickstart#install-and-use-your-integration) returned from the CLI.

If you’d like to add your integration to the public, verified integrations page in GitBook, you’ll need to go through a few more steps.

### Publish your integration publicly

After you've built your integration you'll need to publish it to GitBook's Integration Platform. This will allow you to install your app in any spaces you're a part of, or share your app with others.

Before submitting your app, you'll need to make sure you set your app's `visibility` to `public` in the `gitbook-manifest.yaml` file. This is required so we can test and see your application outside of your organization.

See the [Publishing section](/docs/developers/integrations/publishing) to learn more.

### Test your integration with others

We want the best experience for our GitBook users, and want the integrations they use to enhance the way they work in the app.

After publishing your app, it's important to test it with others outside of your organization, to collect feedback and help identify any bugs or issues that might have been missed during the initial development of your app.

Some considerations and areas to keep in mind when testing:

- How is the end user experience of my integration?
- Is the integration fully functional?
- Are there any edge cases that weren't considered?
- Does the integration expose any private or insecure data?

### Prepare assets

Once you're happy with your integration, you'll need to provide some metadata with your submission before it's accepted. All metadata can be specified and added in your integration's [`gitbook-manifest.yaml`](/docs/developers/integrations/configurations) file, which will be displayed in the integration's listing page after it's published.

To make things easier, we've [created a website](https://integrate-vs.lovable.app/) you can use to create preview images and icons for your integration that meet our design requirements.

#### **Name**

This is the name for your integration — and **must be unique across all GitBook integrations**. This name should also be descriptive and specific for your integration. A good rule of thumb is to not include the following things to your integration’s name:

- `-gitbook`
- `-integration`

#### **Icon**

The main icon for your integration. It should be high-resolution, and a 1:1 aspect ratio — we recommend and image size of 512 × 512px.

#### **Preview images**

Any images you would like to include with your integration. Each image should be high-resolution. (recommended: `1600px` × `800px`, aspect ratio: `2:1`)

#### **Summary**

A summary for your integration that will be displayed under any provided preview images. Supports markdown.

#### **Description**

A short description for your integration. Will be displayed on the right side of your integration's listing page, under the name.

#### **Categories**

A list of categories your integration falls into. Will be used to sort and filter through integrations from GitBook's integration page.

#### **External links**

A list of external links for your integration. Will be displayed on the left side of your integration's listing page.

### Submit your integration

Once you've reviewed your integration, tested it with others, and prepared assets, you're ready to submit it to GitBook's integration marketplace!

You will need to provide some details for us, such as:

- Name
- Contact email address
- Published integration name
- Link to code repository (Must be public, or access for GitBook staff if private)
- Installation link for your integration

When you have everything prepared, you can submit your integration using [this form](https://forms.gle/SXBdguvquFsCUtDX8).

Last updated 9 months ago

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

- [Publish your integration publicly](#publish-your-integration-publicly)
- [Test your integration with others](#test-your-integration-with-others)
- [Prepare assets](#prepare-assets)
- [Submit your integration](#submit-your-integration)

Was this helpful?
