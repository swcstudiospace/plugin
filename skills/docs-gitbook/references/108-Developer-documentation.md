# Developer documentation

Source: https://gitbook.com/docs/developers/readme.md

> For the complete documentation index, see [llms.txt](https://gitbook.com/docs/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://gitbook.com/docs/developers/readme.md).
# Developer documentation
## Integrate GitBook into your workflow
Use GitBook’s API, SDK, and developer tools to build custom integrations, streamline workflows, and create tailored solutions for your docs.
[Create an access token](https://app.gitbook.com/account/developer)[Developer dashboard](https://app.gitbook.com/account/developer)

### What do you want to build?

Choose a path to extend GitBook for your workflow.

|  |  |  |  |  | Cover image | Cover image (dark) |
| --- | --- | --- | --- | --- | --- | --- |
| *:puzzle-piece:* | Custom components | [Quickstart](/pages/8NXeJopb23sUEmeeAgqG) | [ContentKit](/pages/WlSC8EW1d53AlhIt5VGM) | [Create interactive blocks](/pages/KjMg5KpVuCoy8cBMeZQR) |  |  |
| *:gears:* | Automate tasks | [Quickstart](/pages/8NXeJopb23sUEmeeAgqG) | [Integration runtime](/pages/qUUhbveADO2RbiC3fhat) | [Receive webhook notifications](/pages/OU70FDTSaoxYJ1j88iCm) |  |  |
| *:code:* | Build on the API | [Quickstart](/pages/6OzUWR95VKSzFiOfDRak) | [Authentication](/pages/4nqP8H2LlWSpZkTg0tx5) | [API reference](/pages/RUvdmIKeuCU1QCU5Uett) |  |  |

---
# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.
## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.
Perform an HTTP GET request on the current page URL with the `ask` query parameter, and the optional `goal` query parameter:
```
GET https://gitbook.com/docs/developers/readme.md?ask=&goal=
```
`ask` is the immediate question: it should be specific, self-contained, and written in natural language.
`goal` is optional and describes the broader end goal you are ultimately trying to accomplish on behalf of the user. GitBook uses it to tailor the answer towards what is most useful for that goal.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.
Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
