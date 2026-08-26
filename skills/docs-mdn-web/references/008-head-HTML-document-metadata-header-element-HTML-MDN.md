# <head> HTML document metadata (header) element - HTML | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/head

## [Attributes](#attributes)

This element includes the [global attributes](/en-US/docs/Web/HTML/Reference/Global_attributes).

[`profile`](#profile)
:   The [URI](/en-US/docs/Glossary/URI)s of one or more metadata profiles, separated by [white space](/en-US/docs/Glossary/Whitespace).

## [Examples](#examples)

```
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Document title</title>
  </head>
</html>
```

## [Technical summary](#technical_summary)

|  |  |
| --- | --- |
| [Content categories](/en-US/docs/Web/HTML/Guides/Content_categories) | None. |
| Permitted content | If the document is an [`<iframe>`](/en-US/docs/Web/HTML/Reference/Elements/iframe) [`srcdoc`](/en-US/docs/Web/HTML/Reference/Elements/iframe#srcdoc) document, or if title information is available from a higher level protocol (like the subject line in HTML email), zero or more elements of metadata content.  Otherwise, one or more elements of metadata content where exactly one is a [`<title>`](/en-US/docs/Web/HTML/Reference/Elements/title) element. |
| Tag omission | The start tag may be omitted if the first thing inside the `<head>` element is an element. The end tag may be omitted if the first thing following the `<head>` element is not a space character or a comment. |
| Permitted parents | An [`<html>`](/en-US/docs/Web/HTML/Reference/Elements/html) element, as its first child. |
| Implicit ARIA role | [No corresponding role](https://w3c.github.io/html-aria/#dfn-no-corresponding-role "External link (opens in new tab)") |
| Permitted ARIA roles | No `role` permitted |
| DOM interface | [`HTMLHeadElement`](/en-US/docs/Web/API/HTMLHeadElement) |

## [Specifications](#specifications)

| Specification |
| --- |
| [HTML # the-head-element](https://html.spec.whatwg.org/multipage/semantics.html#the-head-element) |

## [Browser compatibility](#browser_compatibility)

## [See also](#see_also)

- Elements that can be used inside the `<head>`:
  - [`<title>`](/en-US/docs/Web/HTML/Reference/Elements/title)
  - [`<base>`](/en-US/docs/Web/HTML/Reference/Elements/base)
  - [`<link>`](/en-US/docs/Web/HTML/Reference/Elements/link)
  - [`<style>`](/en-US/docs/Web/HTML/Reference/Elements/style)
  - [`<meta>`](/en-US/docs/Web/HTML/Reference/Elements/meta)
  - [`<script>`](/en-US/docs/Web/HTML/Reference/Elements/script)
  - [`<noscript>`](/en-US/docs/Web/HTML/Reference/Elements/noscript)
  - [`<template>`](/en-US/docs/Web/HTML/Reference/Elements/template)
