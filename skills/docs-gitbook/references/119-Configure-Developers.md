# Configure | Developers

Source: https://gitbook.com/docs/developers/integrations/configurations

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

For the complete documentation index, see [llms.txt](https://gitbook.com/docs/llms.txt). This page is also available as [Markdown](https://gitbook.com/docs/developers/integrations/configurations.md).

Ask

On this page

1. [Developers](/docs/developers)
2. [Build a custom component](/docs/developers/integrations)

# Configure

Learn about the gitbook-manifest.yaml file used to configure your integration

Integrations are defined through a file called `gitbook-manifest.yaml`. This file is automatically created through the CLI when creating a new integration.

Use this reference to configure your integration and its installation flow.

### Manifest fields

Field

Required

Use it to

[`name`](/docs/developers/integrations/configurations#name)

Yes

Set a unique integration identifier.

[`title`](/docs/developers/integrations/configurations#title)

Yes

Set the integration name shown in GitBook.

[`description`](/docs/developers/integrations/configurations#description)

Yes

Describe the integration.

[`summary`](/docs/developers/integrations/configurations#summary)

No

Add Markdown content to the installation page.

[`organization`](/docs/developers/integrations/configurations#organization)

Yes

Identify the organization that owns the integration.

[`visibility`](/docs/developers/integrations/configurations#visibility)

Yes

Control who can install the integration.

[`scopes`](/docs/developers/integrations/configurations#scopes)

Yes

Request GitBook permissions.

[`script`](/docs/developers/integrations/configurations#script)

No

Set the integration entrypoint.

[`blocks`](/docs/developers/integrations/configurations#blocks)

No

Register components in the inline palette.

[`categories`](/docs/developers/integrations/configurations#categories)

No

Categorize the integration.

[`icon`](/docs/developers/integrations/configurations#icon)

No

Add an installation-page icon.

[`previewImages`](/docs/developers/integrations/configurations#preview-images)

No

Add installation-page preview images.

[`externalLinks`](/docs/developers/integrations/configurations#external-links)

No

Add installation-page links.

[`configurations`](/docs/developers/integrations/configurations#configurations)

No

Collect installation settings.

[`secrets`](/docs/developers/integrations/configurations#secrets)

No

Pass environment variables to the manifest.

### Name\*

The name of your integration. Must be unique across all GitBook integrations.

**Example:**

### Title\*

The title of your integration.

**Example:**

### Description\*

A short description for your integration.

**Example:**

### Summary

A summary for your integration displayed on the installation page. Supports Markdown.

The summary field is limited to 2048 characters.

**Example:**

### Organization\*

The [`id`](/docs/developers/integrations/concepts) or `subdomain` of the organization that owns this integration.

**Example:**

### Visibility\*

The visibility for your integration.

Visibility

Description

`private`

Default for new integrations. Only members from the organization defined in the integration's manifest will be able to install the integration.

`unlisted`

Members from any organization can install the integration. The integration will only be available to install via it's shared install link.

`public`

Members from any organization can install the integration. You need this visibility to [submit your integration to the marketplace](/docs/developers/integrations/submit-your-app-for-review)."

**Example:**

### Scopes\*

The scopes your integration has permissions for.

**Example:**

You may see the scope `site:script:inject` throughout GitBook owned integrations — This scope is only available for internal GitBook use.

Building integrations that inject JavaScript into a site or space is not possible at this time.

### Script

The main script to execute for your integration. Should contain the call [`createIntegration()`](/docs/developers/integrations/development/runtime#createintegration).

**Example:**

### Blocks

Component block(s) referenced by `name` to render in the ( ⌘ + / ) menu. See [`createComponent()`](/docs/developers/integrations/development/runtime#createcomponent) to learn more.

**Example:**

### Categories

A list of categories your integration falls into.

**Example:**

### Icon

A locally referenced icon for your integration. Asset must be located alongside the code for your integration.

**Example:**

### Preview Images

A list of locally referenced assets to display on the installation page for your integration. (recommended: 1600px × 800px, aspect ratio: `2:1`)

**Example:**

### External Links

A list of URLs to display on the installation page for your integration. Each link requires a `label` and a `url`.

**Example:**

### Configurations

The configurations key allows you to specify specific steps and configurations for your integration through it's `environment`.

You're able to set up default configurations under the `configurations.account` key, and site-specific configurations through the `configurations.site` key.

All configurations accept `properties`, which are named keys used to describe the different steps your user will go through as they install your integration. You can also name these properties in a `required` key to enforce certain configurations.

You can create as many properties as you would like, and can be of the following:

`string`

String configurations can be used to collect user input. You can use optional keys `enum` or `completion_url` to provide a list of items from a dropdown list instead than an input.

`enum` allows you to specify a list of items, while `completion_url` allows you to fetch options from an endpoint. See the [Slack configuration](https://github.com/GitbookIO/integrations/tree/main/integrations/slack/gitbook-manifest.yaml) to learn more.

`number`

`boolean`

`button`

Button configurations can be used if you need to set up an OAuth connection with a provider in order to use your integration. See [`createOAuthHandler()`](/docs/developers/integrations/development/runtime#createoauthhandler) for more information.

**Example Configuration:**

### Secrets

A list of secrets or environment variables that your integration might need in order to function. By default, environment variables are not loaded into GitBook's Manifest file.

We recommend using a package like [`dotenv-cli`](https://www.npmjs.com/package/dotenv-cli) to include environment variables in your integrations configuration through an `.env` file when using the `cli`.

See the [Linear integration](https://github.com/GitbookIO/integrations/tree/main/integrations/linear/package.json) for an example.

**Example:**

### Installation & Configuration flow

During the installation flow, an event `installation_setup` is triggered as soon as the integration is installed for the first time. You can identify the configuration as being incomplete by checking `environment.installation.status != 'active'`.

This event (`installation_setup`) is triggered every time the user edits one property of the configuration. The status will become `active` once the configuration pass the validation with the schema.

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

- [Manifest fields](#manifest-fields)
- [Name\*](#name)
- [Title\*](#title)
- [Description\*](#description)
- [Summary](#summary)
- [Organization\*](#organization)
- [Visibility\*](#visibility)
- [Scopes\*](#scopes)
- [Script](#script)
- [Blocks](#blocks)
- [Categories](#categories)
- [Icon](#icon)
- [Preview Images](#preview-images)
- [External Links](#external-links)
- [Configurations](#configurations)
- [Secrets](#secrets)
- [Installation & Configuration flow](#installation-and-configuration-flow)

Was this helpful?

AskCopy

```
name: unique-integration-name
```

AskCopy

```
title: My Integration
```

AskCopy

```
description: A short, descriptive overview of my integration.
```

AskCopy

```
summary: |
    # Overview
    The GitBook Slack integration brings the power of GitBook to your Slack workspace. Your teams have instant access to your GitBook knowledge base, without leaving Slack.
    # Configure
    You can install the integration on a single space by clicking the integrations button in sub-navigation panel. If you prefer to install the Slack integration on multiple on all spaces you can enable this through organization settings. To configure the integration you will have to authorize the connection between Slack and GitBook. You can also select the default channel to post messages to.
```

AskCopy

```
organization: <org_id>
```

AskCopy

```
visibility: private
```

AskCopy

```
scopes:
    # Spaces
    - space:content:read ## Read space content
    - space:content:write ### Write space content
    - space:metadata:read ## Read metadata related to a space
    - space:metadata:write ## Write metadata related to a space
    - space:git:sync ## Manage Git Sync within a space
    # Sites
    - site:metadata:read ## Read metadata related to a site
    - site:views:read ## Read analytics related to a site
    - site:script:inject ## Internal scope - see note below
    - site:script:cookies ## Internal scope - see note below
    - site:visitor:auth ## Enable workflows related to authenticated access
    - site:visitor:claims ## Expose visitor claims to webframes
    - site:adaptive:read ## Read claims available from Adaptive Content
    - site:adaptive:write ## Write claims avaiable to Adaptive Content
    # OpenAPI
    - openapi:read ## Read information from a sites OpenAPI spec
    - openapi:write ## Write information to a sites OpenAPI spec
    # Conversations
    - conversations:ingest
```

AskCopy

```
script: ./src/index.ts
```

AskCopy

```
blocks:
  - id: example-block
    title: Exmple Block
    description: An example block for a GitBook Integration
```

AskCopy

```
categories:
    - analytics
    - collaboration
    - content
    - marketing
    - authenticated-access
    - other
```

AskCopy

```
icon: ./assets/icon.png
```

AskCopy

```
previewImages:
    - ./assets/integration-preview-image.png
```

AskCopy

```
externalLinks:
    - label: Documentation
      url: https://example.com/docs
    - label: Homepage
      url: https://example.com/
```

AskCopy

```
string_property:
    type: string
    title: String Property
    description: A short description
    default: A default Value

    # Optional key to provide a list of options
    enum:
      - item 1
      - item 2
      - item 3
      - item 4

    # Optional key to fetch a list of entries from an endpoint.
    completion_url: /completion-endpoint
```

AskCopy

```
number_property:
    type: number
    title: Number Property
    description: A short description
    default: 1
```

AskCopy

```
boolean_property:
    type: boolean
    title: Boolean Property
    description: A short description
    default: true
```

AskCopy

```
button_property:
    type: button
    title: Button Property
    description: A short description
    button_text: Authorize
    callback_url: /callback-url
```

AskCopy

```
configurations:
    account:
        properties:
            oauth_credentials:
                type: button
                title: Connection
                description: Authorization between my app and GitBook.
                button_text: Authorize
                callback_url: /oauth
            default_channel:
                type: string
                title: Default Channel
                description: Select a channel to post messages to, when none is configured for a specific space.
                completion_url: /channels
        required:
            - oauth_credentials
            - default_channel
    site:
        properties:
            channel:
                type: string
                title: Channel
                description: Select a channel to post messages related to this space.
                completion_url: /channels
            notify_content_update:
                type: boolean
                title: Notify Content Update
                description: Post a notification message every time the content of the space is updated.
                default: true
            notify_visibility_update:
                type: boolean
                title: Notify Visibility Update
                description: Post a notification message every time the visibility of the space is updated.
                default: true
```

AskCopy

```
secrets:
    CLIENT_ID: ${{ env.CLIENT_ID }}
```
