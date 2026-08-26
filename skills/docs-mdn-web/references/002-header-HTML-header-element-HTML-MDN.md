# <header> HTML header element - HTML | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/header

## [Try it](#try_it)

```
<header>
  <a class="logo" href="#">Cute Puppies Express!</a>
</header>

<article>
  <header>
    <h1>Beagles</h1>
    <time>08.12.2014</time>
  </header>
  <p>
    I love beagles <em>so</em> much! Like, really, a lot. They're adorable and
    their ears are so, so snugly soft!
  </p>
</article>
```

```
.logo {
  background: left / cover
    url("/shared-assets/images/examples/puppy-header.jpg");
  display: flex;
  height: 120px;
  align-items: center;
  justify-content: center;
  font:
    bold calc(1em + 2 * (100vw - 120px) / 100) "Dancing Script",
    fantasy;
  color: #ff0083;
  text-shadow: black 2px 2px 0.2rem;
}

header > h1 {
  margin-bottom: 0;
}

header > time {
  font: italic 0.7rem sans-serif;
}
```

## [Usage notes](#usage_notes)

When not nested within [sectioning content](/en-US/docs/Web/HTML/Guides/Content_categories#sectioning_content), [`<main>`](/en-US/docs/Web/HTML/Reference/Elements/main), or an element with the same ARIA role as these elements' implicit ARIA role, then the `<header>` element has an identical meaning to the site-wide [`banner`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/banner_role) landmark role. It defines a global site header, which usually includes a logo, company name, search feature, and possibly the global navigation or a slogan. It is generally located at the top of the page.

Otherwise, when nested within said elements, it loses its landmark status and represents a group of introductory or navigational aids for the surrounding section. It usually contains the surrounding section's heading (an `h1` – `h6` element) and optional subheading, but this is **not** required.

### [Historical Usage](#historical_usage)

The `<header>` element originally existed at the very beginning of HTML for headings. It is seen in [the very first website](https://info.cern.ch/ "External link (opens in new tab)"). At some point, headings became [`<h1>` through `<h6>`](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), allowing `<header>` to be free to fill a different role.

## [Attributes](#attributes)

This element only includes the [global attributes](/en-US/docs/Web/HTML/Reference/Global_attributes).

## [Accessibility](#accessibility)

The `<header>` element defines a [`banner`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/banner_role) landmark when its context is the [`<body>`](/en-US/docs/Web/HTML/Reference/Elements/body) element.

When placed inside an [`<article>`](/en-US/docs/Web/HTML/Reference/Elements/article), [`<main>`](/en-US/docs/Web/HTML/Reference/Elements/main), [`<section>`](/en-US/docs/Web/HTML/Reference/Elements/section), [`<nav>`](/en-US/docs/Web/HTML/Reference/Elements/nav), [`<aside>`](/en-US/docs/Web/HTML/Reference/Elements/aside), or an element with the same ARIA role as these elements' implicit ARIA role, the `<header>` element has the [`generic`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/generic_role) role instead, and is no longer considered a landmark. In this case, it cannot be labeled with [`aria-label`](/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label) or [`aria-labelledby`](/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby).

## [Examples](#examples)

#### Result

#### Result

## [Technical summary](#technical_summary)

|  |  |
| --- | --- |
| [Content categories](/en-US/docs/Web/HTML/Guides/Content_categories) | [Flow content](/en-US/docs/Web/HTML/Guides/Content_categories#flow_content), [palpable content](/en-US/docs/Web/HTML/Guides/Content_categories#palpable_content). |
| Permitted content | [Flow content](/en-US/docs/Web/HTML/Guides/Content_categories#flow_content), but with no `<header>` or [`<footer>`](/en-US/docs/Web/HTML/Reference/Elements/footer) descendant. |
| Tag omission | None, both the starting and ending tag are mandatory. |
| Permitted parents | Any element that accepts [flow content](/en-US/docs/Web/HTML/Guides/Content_categories#flow_content). Note that a `<header>` element must not be a descendant of an [`<address>`](/en-US/docs/Web/HTML/Reference/Elements/address), [`<footer>`](/en-US/docs/Web/HTML/Reference/Elements/footer) or another `<header>` element. |
| Implicit ARIA role | [banner](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/banner_role), or [generic](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/generic_role) if a descendant of an `article`, `aside`, `main`, `nav` or `section` element, or an element with `article`, `complementary`, `main`, `navigation` or `region` role |
| Permitted ARIA roles | [`group`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/group_role), [`presentation`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/presentation_role) or [`none`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/none_role) |
| DOM interface | [`HTMLElement`](/en-US/docs/Web/API/HTMLElement) |

## [Specifications](#specifications)

| Specification |
| --- |
| [HTML # the-header-element](https://html.spec.whatwg.org/multipage/sections.html#the-header-element) |

## [Browser compatibility](#browser_compatibility)

## [See also](#see_also)

- Other section-related elements: [`<body>`](/en-US/docs/Web/HTML/Reference/Elements/body), [`<nav>`](/en-US/docs/Web/HTML/Reference/Elements/nav), [`<article>`](/en-US/docs/Web/HTML/Reference/Elements/article), [`<aside>`](/en-US/docs/Web/HTML/Reference/Elements/aside), [h1](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h2](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h3](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h4](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h5](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h6](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [`<footer>`](/en-US/docs/Web/HTML/Reference/Elements/footer), [`<section>`](/en-US/docs/Web/HTML/Reference/Elements/section), [`<address>`](/en-US/docs/Web/HTML/Reference/Elements/address).
