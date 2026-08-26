# Rate limiting | Developers

Source: https://gitbook.com/docs/developers/gitbook-api/rate-limiting

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

For the complete documentation index, see [llms.txt](https://gitbook.com/docs/llms.txt). This page is also available as [Markdown](https://gitbook.com/docs/developers/gitbook-api/rate-limiting.md).

Ask

On this page

1. [Developers](/docs/developers)
2. [GitBook API](/docs/developers/gitbook-api)

# Rate limiting

Learn about the rate limits the GitBook API enforces

Different types of API methods are subject to different rate limits.

The response's HTTP headers are the authoritative source for the current number of API calls available to you or your app at any given time. The returned HTTP headers of any API request show your current rate limit status, as described below.

Header Name

Description

`X-RateLimit-Limit`

The maximum number of requests you're permitted to make in the current rate limit window.

`X-RateLimit-Remaining`

The number of requests remaining in the current rate limit window.

`X-RateLimit-Reset`

The time at which the current rate limit window resets in [UTC epoch seconds](http://en.wikipedia.org/wiki/Unix_time).

If you exceed the rate limit, an API error response is returned:

AskCopy

```
> HTTP/2 429
> X-RateLimit-Limit: 60
> X-RateLimit-Remaining: 0
> X-RateLimit-Reset: 1377013266

> {
>    "error": {
>        "code": 429
>        "message": "API rate limit exceeded. Please try again in 60 seconds"
>    }
> }
```

Last updated 2 years ago

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
