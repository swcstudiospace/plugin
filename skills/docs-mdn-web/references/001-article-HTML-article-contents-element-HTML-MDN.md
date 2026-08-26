# <article> HTML article contents element - HTML | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/article

## [Try it](#try_it)

```
<article class="forecast">
  <h1>Weather forecast for Seattle</h1>
  <article class="day-forecast">
    <h2>03 March 2018</h2>
    <p>Rain.</p>
  </article>
  <article class="day-forecast">
    <h2>04 March 2018</h2>
    <p>Periods of rain.</p>
  </article>
  <article class="day-forecast">
    <h2>05 March 2018</h2>
    <p>Heavy rain.</p>
  </article>
</article>
```

```
.forecast {
  margin: 0;
  padding: 0.3rem;
  background-color: #eeeeee;
}

.forecast > h1,
.day-forecast {
  margin: 0.5rem;
  padding: 0.3rem;
  font-size: 1.2rem;
}

.day-forecast {
  background: right/contain content-box border-box no-repeat
    url("/shared-assets/images/examples/rain.svg") white;
}

.day-forecast > h2,
.day-forecast > p {
  margin: 0.2rem;
  font-size: 1rem;
}
```

A given document can have multiple articles in it; for example, on a blog that shows the text of each article one after another as the reader scrolls, each post would be contained in an `<article>` element, possibly with one or more `<section>`s within.

## [Attributes](#attributes)

This element only includes the [global attributes](/en-US/docs/Web/HTML/Reference/Global_attributes).

## [Usage notes](#usage_notes)

- Each `<article>` should be identified, typically by including a heading ([`<h1>` - `<h6>`](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements) element) as a child of the `<article>` element.
- When an `<article>` element is nested, the inner element represents an article related to the outer element. For example, the comments of a blog post can be `<article>` elements nested in the `<article>` representing the blog post.
- Author information of an `<article>` element can be provided through the [`<address>`](/en-US/docs/Web/HTML/Reference/Elements/address) element, but it doesn't apply to nested `<article>` elements.
- The publication date and time of an `<article>` element can be described using the [`datetime`](/en-US/docs/Web/HTML/Reference/Elements/time#datetime) attribute of a [`<time>`](/en-US/docs/Web/HTML/Reference/Elements/time) element.

## [Examples](#examples)

```
<article class="film_review">
  <h2>Jurassic Park</h2>
  <section class="main_review">
    <h3>Review</h3>
    <p>Dinos were great!</p>
  </section>
  <section class="user_reviews">
    <h3>User reviews</h3>
    <article class="user_review">
      <h4>Too scary!</h4>
      <p>Way too scary for me.</p>
      <footer>
        <p>
          Posted on
          <time datetime="2015-05-16 19:00">May 16</time>
          by Lisa.
        </p>
      </footer>
    </article>
    <article class="user_review">
      <h4>Love the dinos!</h4>
      <p>I agree, dinos are my favorite.</p>
      <footer>
        <p>
          Posted on
          <time datetime="2015-05-17 19:00">May 17</time>
          by Tom.
        </p>
      </footer>
    </article>
  </section>
  <footer>
    <p>
      Posted on
      <time datetime="2015-05-15 19:00">May 15</time>
      by Staff.
    </p>
  </footer>
</article>
```

### [Result](#result)

## [Technical summary](#technical_summary)

|  |  |
| --- | --- |
| [Content categories](/en-US/docs/Web/HTML/Guides/Content_categories) | [Flow content](/en-US/docs/Web/HTML/Guides/Content_categories#flow_content), [sectioning content](/en-US/docs/Web/HTML/Guides/Content_categories#sectioning_content), [palpable content](/en-US/docs/Web/HTML/Guides/Content_categories#palpable_content) |
| Permitted content | [Flow content](/en-US/docs/Web/HTML/Guides/Content_categories#flow_content). |
| Tag omission | None, both the starting and ending tag are mandatory. |
| Permitted parents | Any element that accepts [flow content](/en-US/docs/Web/HTML/Guides/Content_categories#flow_content). Note that an `<article>` element must not be a descendant of an [`<address>`](/en-US/docs/Web/HTML/Reference/Elements/address) element. |
| Implicit ARIA role | `article` |
| Permitted ARIA roles | [`application`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/application_role), [`document`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/document_role), [`feed`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/feed_role), [`main`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/main_role), [`none`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/none_role), [`presentation`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/presentation_role), [`region`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/region_role) |
| DOM interface | [`HTMLElement`](/en-US/docs/Web/API/HTMLElement) |

## [Specifications](#specifications)

| Specification |
| --- |
| [HTML # the-article-element](https://html.spec.whatwg.org/multipage/sections.html#the-article-element) |

## [Browser compatibility](#browser_compatibility)

## [See also](#see_also)

- Other section-related elements: [`<body>`](/en-US/docs/Web/HTML/Reference/Elements/body), [`<nav>`](/en-US/docs/Web/HTML/Reference/Elements/nav), [`<section>`](/en-US/docs/Web/HTML/Reference/Elements/section), [`<aside>`](/en-US/docs/Web/HTML/Reference/Elements/aside), [h1](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h2](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h3](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h4](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h5](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [h6](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements), [`<hgroup>`](/en-US/docs/Web/HTML/Reference/Elements/hgroup), [`<header>`](/en-US/docs/Web/HTML/Reference/Elements/header), [`<footer>`](/en-US/docs/Web/HTML/Reference/Elements/footer), [`<address>`](/en-US/docs/Web/HTML/Reference/Elements/address)
- [Using HTML sections and outlines](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements)
