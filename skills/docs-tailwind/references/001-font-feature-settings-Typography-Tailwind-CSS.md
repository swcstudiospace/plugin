# font-feature-settings - Typography - Tailwind CSS

Source: https://tailwindcss.com/docs/font-feature-settings

v4.3

`⌘K``Ctrl K`[Docs](/docs)[Blog](/blog)[Showcase](/showcase)[Partners](/partners)[Plus](/plus?ref=top)

1. Typography
2. font-feature-settings

Typography

# font-feature-settings

Utilities for controlling advanced typographic features.

| Class | Styles |
| --- | --- |
| `font-features-[<value>]` | `font-feature-settings: <value>;` |
| `font-features-(<custom-property>)` | `font-feature-settings: var(<custom-property>);` |

## [Examples](#examples)

### [Basic example](#basic-example)

Use the `font-features-[<value>]` utility to enable OpenType features in fonts that support them:

```
<p class="font-features-['smcp'] ...">This text uses small caps.</p>
```

### [Enabling multiple features](#enabling-multiple-features)

You can enable multiple OpenType features by separating them with commas:

```
<p class="font-features-['smcp','onum'] ...">This text uses small caps and oldstyle numbers.</p>
```

### [Using CSS variables](#using-css-variables)

Use the `font-features-(<custom-property>)` syntax to apply font feature settings from a CSS variable:

```
<p class="font-features-(--my-features) ...">  <!-- ... --></p>
```

### [Responsive design](#responsive-design)

Prefix a `font-feature-settings` utility with a breakpoint variant like `md:` to only apply the utility at medium screen sizes and above:

```
<p class="font-features-['tnum'] md:font-features-['smcp'] ...">  Lorem ipsum dolor sit amet...</p>
```

Learn more about using variants in the [variants documentation](/docs/hover-focus-and-other-states).

### On this page

- [Quick reference](#quick-reference)
- [Examples](#examples)
  - [Basic example](#basic-example)
  - [Enabling multiple features](#enabling-multiple-features)
  - [Using CSS variables](#using-css-variables)
  - [Responsive design](#responsive-design)

Copyright © 2026 Tailwind Labs Inc.·[Trademark Policy](/brand)
