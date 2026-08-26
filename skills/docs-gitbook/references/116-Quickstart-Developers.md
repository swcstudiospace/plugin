# Quickstart | Developers

Source: https://gitbook.com/docs/developers/gitbook-api/quickstart

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

For the complete documentation index, see [llms.txt](https://gitbook.com/docs/llms.txt). This page is also available as [Markdown](https://gitbook.com/docs/developers/gitbook-api/quickstart.md).

Ask

On this page

1. [Developers](/docs/developers)
2. [GitBook API](/docs/developers/gitbook-api)

# Quickstart

Get started with the GitBook API in minutes

The GitBook API allows you to read and write information across the spaces and pages you have access to in GitBook.

Use this guide to authenticate and make your first API call.

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

### Make your first API call

The example below shows how to make an API call that asks GitBook Assistant a question in a site within your organization.

This example requires your organization ID and site ID. [Find them here](/docs/developers/gitbook-api/find-your-ids).

HTTP

JavaScript

Python

To query a GitBook site using the Ask API, send a POST request to the `/v1/orgs/{organizationId}/sites/{siteId}/ask` endpoint. Include your developer token for authentication, provide the question you want answered, and optionally pass context and scope settings.

**Make a basic Ask API request**

1. Set your required headers:

   - `Authorization: Bearer YOUR_SECRET_TOKEN`
   - `Content-Type: application/json`
2. Send a POST request with your query details:

AskCopy

```
POST /v1/orgs/{organizationId}/sites/{siteId}/ask HTTP/1.1
Host: api.gitbook.com
Authorization: Bearer YOUR_SECRET_TOKEN
Content-Type: application/json
Accept: */*

{
  "question": "How do I get started?",
  "scope": {
    "mode": "default",
  }
}
```

The API will return an answer generated from your site’s content.

To send a question to the Ask API from JavaScript, you can use [GitBook’s client library](/docs/developers/integrations/development/client-library). After initializing the client with your personal access token, call the `askQueryInSpace()` method with your organization ID, site ID, and query payload.

**Ask a question using GitBook’s JavaScript SDK**

1. Install the GitBook API client:

1. Initialize the client and send your Ask query:

The response will contain the generated answer based on your site’s content.

To send a question to the Ask API using Python, make a POST request to the `/v1/orgs/{organizationId}/sites/{siteId}/ask` endpoint. Include your API token for authentication and pass the question, context, and scope in the request body.

**Ask a question using Python**

This will return the Ask API’s generated answer based on your site’s content.

GitBook’s API has many different API calls that allow you to interact with GitBook in different ways. After sending your first request, head to the API reference to explore the different endpoints GitBook offers.

### Build on the GitBook API

Build a complete workflow with one of these guides:

####

#### Pull analytics from your site

Query event data to find your site’s most-visited pages.

####

#### Work on your site with an AI agent

Use a coding agent and GitBook skills to update your site.

####

#### Manage your team with the API

Create a team from existing organization members.

### Explore GitBook’s API

####

#### Create and edit content

Create and manage spaces, pages, and their content.

####

#### Update a site

Manage a published site’s settings, structure, and content.

####

#### Work with analytics

Retrieve analytics data to understand content performance.

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

- [Getting started](#getting-started)
- [Create a personal access token](#create-a-personal-access-token)
- [Make your first API call](#make-your-first-api-call)
- [Build on the GitBook API](#build-on-the-gitbook-api)
- [Explore GitBook’s API](#explore-gitbooks-api)

Was this helpful?

AskCopy

```
npm install @gitbook/api
```

index.js

AskCopy

```
import { GitBookAPI } from "@gitbook/api";

const ORGANIZATION_ID = "<your organization id>"
const SITE_ID = "<your site id>"
const API_TOKEN = "<your gitbook api token>"

const client = new GitBookAPI({
    authToken: API_TOKEN
});

const stream = await client.orgs.streamAskInSite(
    ORGANIZATION_ID,
    SITE_ID,
    {
        question: "How do I get started?",
        scope: {
            mode: "default",
    },
);

// Stream chunks as they arrive
for await (const chunk of stream) {
    console.log(chunk);
}
```

ask\_query.py

AskCopy

```
import json
import requests

ORGANIZATION_ID = "<your organization id>"
SITE_ID = "<your site id>"
API_TOKEN = "<your gitbook api token>"

response = requests.post(
    f"https://api.gitbook.com/v1/orgs/{ORGANIZATION_ID}/sites/{SITE_ID}/ask",
    headers={
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    },
    json={
        "question": "How do I get started?",
        "scope": {"mode": "default"}
    },
    stream=True
)

# Get the last response before "done"
final = None
for line in response.iter_lines():
    if line:
        line = line.decode('utf-8')
        if line.startswith('data: ') and line[6:] != 'done':
            final = json.loads(line[6:])

print(final)
```
