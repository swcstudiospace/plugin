# <body> HTML document body element - HTML | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/body

## [Attributes](#attributes)

This element includes the [global attributes](/en-US/docs/Web/HTML/Reference/Global_attributes), event attributes, and deprecated attributes:

### [Event attributes](#event_attributes)

**Note:**
Each of the below event attribute names is linked to its equivalent [`Window`](/en-US/docs/Web/API/Window) interface event. You can listen to these events using [`addEventListener()`](/en-US/docs/Web/API/EventTarget/addEventListener) instead of adding the `oneventname` attribute to the `<body>` element.

[`onafterprint`](/en-US/docs/Web/API/Window/afterprint_event)
:   Function to call after the user has printed the document.

[`onbeforeprint`](/en-US/docs/Web/API/Window/beforeprint_event)
:   Function to call when the user requests printing of the document.

[`onbeforeunload`](/en-US/docs/Web/API/Window/beforeunload_event)
:   Function to call when the document is about to be unloaded.

[`onblur`](/en-US/docs/Web/API/Window/blur_event)
:   Function to call when the document loses focus.

[`onerror`](/en-US/docs/Web/API/Window/error_event)
:   Function to call when the document fails to load properly.

[`onfocus`](/en-US/docs/Web/API/Window/focus_event)
:   Function to call when the document receives focus.

[`onhashchange`](/en-US/docs/Web/API/Window/hashchange_event)
:   Function to call when the fragment identifier part (starting with the hash (`'#'`) character) of the document's current address has changed.

[`onlanguagechange`](/en-US/docs/Web/API/Window/languagechange_event)
:   Function to call when the preferred languages changed.

[`onload`](/en-US/docs/Web/API/Window/load_event)
:   Function to call when the document has finished loading.

[`onmessage`](/en-US/docs/Web/API/Window/message_event)
:   Function to call when the document has received a message.

[`onmessageerror`](/en-US/docs/Web/API/Window/messageerror_event)
:   Function to call when the document has received a message that cannot be deserialized.

[`onoffline`](/en-US/docs/Web/API/Window/offline_event)
:   Function to call when network communication has failed.

[`ononline`](/en-US/docs/Web/API/Window/online_event)
:   Function to call when network communication has been restored.

[`onpageswap`](/en-US/docs/Web/API/Window/pageswap_event)
:   Function to call when you navigate across documents, when the previous document is about to unload.

[`onpagehide`](/en-US/docs/Web/API/Window/pagehide_event)
:   Function to call when the browser hides the current page in the process of presenting a different page from the session's history.

[`onpagereveal`](/en-US/docs/Web/API/Window/pagereveal_event)
:   Function to call when a document is first rendered, either when loading a fresh document from the network or activating a document.

[`onpageshow`](/en-US/docs/Web/API/Window/pageshow_event)
:   Function to call when the browser displays the window's document due to navigation.

[`onpopstate`](/en-US/docs/Web/API/Window/popstate_event)
:   Function to call when the user has navigated session history.

[`onresize`](/en-US/docs/Web/API/Window/resize_event)
:   Function to call when the document has been resized.

[`onrejectionhandled`](/en-US/docs/Web/API/Window/rejectionhandled_event)
:   Function to call when a JavaScript [`Promise`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) is handled late.

[`onstorage`](/en-US/docs/Web/API/Window/storage_event)
:   Function to call when the storage area has changed.

[`onunhandledrejection`](/en-US/docs/Web/API/Window/unhandledrejection_event)
:   Function to call when a JavaScript [`Promise`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that has no rejection handler is rejected.

[`onunload`](/en-US/docs/Web/API/Window/unload_event)
:   Function to call when the document is going away.

### [Deprecated attributes](#deprecated_attributes)

**Warning:**
Do not use these deprecated attributes; opt for the CSS alternatives listed with each deprecated attribute instead.

[`alink`](#alink)
:   Color of text for hyperlinks when selected.
    Use the CSS [`color`](/en-US/docs/Web/CSS/Reference/Properties/color) property in conjunction with the [`:active`](/en-US/docs/Web/CSS/Reference/Selectors/:active) and [`:focus`](/en-US/docs/Web/CSS/Reference/Selectors/:focus) pseudo-classes instead.

[`background`](#background)
:   URI of an image to use as a background.
    Use the CSS [`background-image`](/en-US/docs/Web/CSS/Reference/Properties/background-image) property instead.

[`bgcolor`](#bgcolor)
:   Background color for the document.
    Use the CSS [`background-color`](/en-US/docs/Web/CSS/Reference/Properties/background-color) property instead.

[`bottommargin`](#bottommargin)
:   Ignored.

[`leftmargin`](#leftmargin)
:   The margin of the left and right of the body.
    Use the CSS [`margin-left`](/en-US/docs/Web/CSS/Reference/Properties/margin-left) and [`margin-right`](/en-US/docs/Web/CSS/Reference/Properties/margin-right) properties (or the logical [`margin-inline`](/en-US/docs/Web/CSS/Reference/Properties/margin-inline) property) instead.

[`link`](#link)
:   Color of text for unvisited hypertext links.
    Use the CSS [`color`](/en-US/docs/Web/CSS/Reference/Properties/color) property in conjunction with the [`:link`](/en-US/docs/Web/CSS/Reference/Selectors/:link) pseudo-class instead.

[`rightmargin`](#rightmargin)
:   Ignored.

[`text`](#text)
:   Foreground color of text.
    Use the CSS [`color`](/en-US/docs/Web/CSS/Reference/Properties/color) property instead.

[`topmargin`](#topmargin)
:   The margin of the top and bottom of the body.
    Use the CSS [`margin-top`](/en-US/docs/Web/CSS/Reference/Properties/margin-top) and [`margin-bottom`](/en-US/docs/Web/CSS/Reference/Properties/margin-bottom) properties (or the logical [`margin-block`](/en-US/docs/Web/CSS/Reference/Properties/margin-block) property) instead.

[`vlink`](#vlink)
:   Color of text for visited hypertext links.
    Use the CSS [`color`](/en-US/docs/Web/CSS/Reference/Properties/color) property in conjunction with the [`:visited`](/en-US/docs/Web/CSS/Reference/Selectors/:visited) pseudo-class instead.

## [Examples](#examples)

```
<html lang="en">
  <head>
    <title>Document title</title>
  </head>
  <body>
    <p>
      The <code>&lt;body&gt;</code> HTML element represents the content of an
      HTML document. There can be only one <code>&lt;body&gt;</code> element in
      a document.
    </p>
  </body>
</html>
```

### [Result](#result)

## [Technical summary](#technical_summary)

|  |  |
| --- | --- |
| [Content categories](/en-US/docs/Web/HTML/Guides/Content_categories) | None. |
| Permitted content | [Flow content](/en-US/docs/Web/HTML/Guides/Content_categories#flow_content). |
| Tag omission | The start tag may be omitted if the first thing inside it is not a space character, comment, [`<script>`](/en-US/docs/Web/HTML/Reference/Elements/script) element or [`<style>`](/en-US/docs/Web/HTML/Reference/Elements/style) element. The end tag may be omitted if the `<body>` element has contents or has a start tag, and is not immediately followed by a comment. |
| Permitted parents | It must be the second element of an [`<html>`](/en-US/docs/Web/HTML/Reference/Elements/html) element. |
| Implicit ARIA role | `generic` |
| Permitted ARIA roles | No `role` permitted |
| DOM interface | [`HTMLBodyElement`](/en-US/docs/Web/API/HTMLBodyElement)  - The `<body>` element exposes the   [`HTMLBodyElement`](/en-US/docs/Web/API/HTMLBodyElement) interface. - You can access the `<body>` element through the   [`document.body`](/en-US/docs/Web/API/Document/body) property. |

## [Specifications](#specifications)

| Specification |
| --- |
| [HTML # the-body-element](https://html.spec.whatwg.org/multipage/sections.html#the-body-element) |

## [Browser compatibility](#browser_compatibility)

## [See also](#see_also)

- [`<html>`](/en-US/docs/Web/HTML/Reference/Elements/html)
- [`<head>`](/en-US/docs/Web/HTML/Reference/Elements/head)
- [Event handling overview](/en-US/docs/Web/API/Document_Object_Model/Events#registering_event_handlers)
