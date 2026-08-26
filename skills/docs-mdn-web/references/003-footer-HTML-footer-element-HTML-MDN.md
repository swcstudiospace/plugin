# <footer> HTML footer element - HTML | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/footer

## [Try it](#try_it)

```
<article>
  <h1>How to be a wizard</h1>
  <ol>
    <li>Grow a long, majestic beard.</li>
    <li>Wear a tall, pointed hat.</li>
    <li>Have I mentioned the beard?</li>
  </ol>
  <footer>
    <p>© 2018 Gandalf</p>
  </footer>
</article>
```

```
article {
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

footer {
  display: flex;
  justify-content: center;
  padding: 5px;
  background-color: #45a1ff;
  color: white;
}
```

## [Attributes](#attributes)

This element only includes the [global attributes](/en-US/docs/Web/HTML/Reference/Global_attributes).

## [Usage notes](#usage_notes)

- Enclose information about the author in an [`<address>`](/en-US/docs/Web/HTML/Reference/Elements/address) element that can be included into the `<footer>` element.
- When the nearest ancestor sectioning content or sectioning root element is the body element the footer applies to the whole page.
- The `<footer>` element is not sectioning content and therefore doesn't introduce a new section in the [outline](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements).

## [Accessibility](#accessibility)

Prior to the release of Safari 13, the `contentinfo` [landmark role](/en-US/docs/Learn_web_development/Core/Accessibility/WAI-ARIA_basics#signpostslandmarks) was not properly exposed by [VoiceOver](https://help.apple.com/voiceover/info/guide/ "External link (opens in new tab)"). If needing to support legacy Safari browsers, add `role="contentinfo"` to the `footer` element to ensure the landmark will be properly exposed.

- Related: [WebKit Bugzilla: 146930 – AX: HTML native elements (header, footer, main, aside, nav) should work the same as ARIA landmarks, sometimes they don't](https://webkit.org/b/146930 "External link (opens in new tab)")

## [Examples](#examples)

```
<body>
  <h3>FIFA World Cup top goalscorers</h3>
  <ol>
    <li>Miroslav Klose, 16</li>
    <li>Ronaldo Nazário, 15</li>
    <li>Gerd Müller, 14</li>
  </ol>

  <footer>
    <small>
      Copyright © 2023 Football History Archives. All Rights Reserved.
    </small>
  </footer>
</body>
```

```
footer {
  text-align: center;
  padding: 5px;
  background-color: #abbaba;
  color: black;
}
```

## [Technical summary](#technical_summary)

|  |  |
| --- | --- |
| [Content categories](/en-US/docs/Web/HTML/Guides/Content_categories) | [Flow content](/en-US/docs/Web/HTML/Guides/Content_categories#flow_content), palpable content. |
| Permitted content | [Flow content](/en-US/docs/Web/HTML/Guides/Content_categories#flow_content), but with no `<footer>` or [`<header>`](/en-US/docs/Web/HTML/Reference/Elements/header) descendants. |
| Tag omission | None, both the starting and ending tag are mandatory. |
| Permitted parents | Any element that accepts [flow content](/en-US/docs/Web/HTML/Guides/Content_categories#flow_content). Note that a `<footer>` element must not be a descendant of an [`<address>`](/en-US/docs/Web/HTML/Reference/Elements/address), [`<header>`](/en-US/docs/Web/HTML/Reference/Elements/header) or another `<footer>` element. |
| Implicit ARIA role | [contentinfo](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/contentinfo_role), or [generic](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/generic_role) if a descendant of an [article](/en-US/docs/Web/HTML/Reference/Elements/article), [aside](/en-US/docs/Web/HTML/Reference/Elements/aside), [main](/en-US/docs/Web/HTML/Reference/Elements/main), [nav](/en-US/docs/Web/HTML/Reference/Elements/nav) or [section](/en-US/docs/Web/HTML/Reference/Elements/section) element, or an element with `article`, `complementary`, `main`, `navigation` or `region` role |
| Permitted ARIA roles | [`group`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/group_role), [`presentation`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/presentation_role) or [`none`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/none_role) |
| DOM interface | [`HTMLElement`](/en-US/docs/Web/API/HTMLElement) |

## [Specifications](#specifications)

| Specification |
| --- |
| [HTML # the-footer-element](https://html.spec.whatwg.org/multipage/sections.html#the-footer-element) |

## [Browser compatibility](#browser_compatibility)

## [See also](#see_also)

- Other section-related elements: [`<body>`](/en-US/docs/Web/HTML/Reference/Elements/body), [`<nav>`](/en-US/docs/Web/HTML/Reference/Elements/nav), [`<article>`](/en-US/docs/Web/HTML/Reference/Elements/article), [`<aside>`](/en-US/docs/Web/HTML/Reference/Elements/aside), [h1](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h2](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h3](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h4](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h5](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h6](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [`<hgroup>`](/en-US/docs/Web/HTML/Reference/Elements/hgroup), [`<header>`](/en-US/docs/Web/HTML/Reference/Elements/header), [`<section>`](/en-US/docs/Web/HTML/Reference/Elements/section), [`<address>`](/en-US/docs/Web/HTML/Reference/Elements/address);
- [Using HTML sections and outlines](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements)
- [ARIA: Contentinfo role](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/contentinfo_role)
