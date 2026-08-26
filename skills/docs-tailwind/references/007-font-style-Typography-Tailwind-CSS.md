# font-style - Typography - Tailwind CSS

Source: https://tailwindcss.com/docs/font-style

v4.3

`⌘K``Ctrl K`[Docs](/docs)[Blog](/blog)[Showcase](/showcase)[Partners](/partners)[Plus](/plus?ref=top)

1. Typography
2. font-style

Typography

# font-style

Utilities for controlling the style of text.

| Class | Styles |
| --- | --- |
| `italic` | `font-style: italic;` |
| `not-italic` | `font-style: normal;` |

## [Examples](#examples)

### [Italicizing text](#italicizing-text)

Use the `italic` utility to make text italic:

The quick brown fox jumps over the lazy dog.

```
<p class="italic ...">The quick brown fox ...</p>
```

### [Displaying text normally](#displaying-text-normally)

Use the `not-italic` utility to display text normally:

The quick brown fox jumps over the lazy dog.

```
<p class="not-italic ...">The quick brown fox ...</p>
```

### [Responsive design](#responsive-design)

Prefix a `font-style` utility with a breakpoint variant like `md:` to only apply the utility at medium screen sizes and above:

```
<p class="italic md:not-italic ...">  Lorem ipsum dolor sit amet...</p>
```

Learn more about using variants in the [variants documentation](/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](#quick-reference)
- [Examples](#examples)
  - [Italicizing text](#italicizing-text)
  - [Displaying text normally](#displaying-text-normally)
  - [Responsive design](#responsive-design)

Copyright © 2026 Tailwind Labs Inc.·[Trademark Policy](/brand)
