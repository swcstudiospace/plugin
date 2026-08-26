# min-block-size - Sizing - Tailwind CSS

Source: https://tailwindcss.com/docs/min-block-size

v4.3

`⌘K``Ctrl K`[Docs](/docs)[Blog](/blog)[Showcase](/showcase)[Partners](/partners)[Plus](/plus?ref=top)

1. Sizing
2. min-block-size

Sizing

# min-block-size

Utilities for setting the minimum block size of an element.

| Class | Styles |
| --- | --- |
| `min-block-<number>` | `min-block-size: calc(var(--spacing) * <number>);` |
| `min-block-<fraction>` | `min-block-size: calc(<fraction> * 100%);` |
| `min-block-px` | `min-block-size: 1px;` |
| `min-block-full` | `min-block-size: 100%;` |
| `min-block-screen` | `min-block-size: 100vh;` |
| `min-block-dvh` | `min-block-size: 100dvh;` |
| `min-block-dvw` | `min-block-size: 100dvw;` |
| `min-block-lvh` | `min-block-size: 100lvh;` |
| `min-block-lvw` | `min-block-size: 100lvw;` |
| `min-block-svw` | `min-block-size: 100svw;` |
| `min-block-svh` | `min-block-size: 100svh;` |
| `min-block-auto` | `min-block-size: auto;` |
| `min-block-min` | `min-block-size: min-content;` |
| `min-block-max` | `min-block-size: max-content;` |
| `min-block-fit` | `min-block-size: fit-content;` |
| `min-block-lh` | `min-block-size: 1lh;` |
| `min-block-(<custom-property>)` | `min-block-size: var(<custom-property>);` |
| `min-block-[<value>]` | `min-block-size: <value>;` |

Show more

## [Examples](#examples)

### [Basic example](#basic-example)

Use `min-block-<number>` utilities like `min-block-24` and `min-block-64` to set an element to a fixed minimum block size based on the spacing scale:

min-block-96

min-block-80

min-block-64

min-block-48

min-block-40

min-block-32

```
<div class="block-20 ...">  <div class="min-block-80 ...">min-block-80</div>  <div class="min-block-64 ...">min-block-64</div>  <div class="min-block-48 ...">min-block-48</div>  <div class="min-block-40 ...">min-block-40</div>  <div class="min-block-32 ...">min-block-32</div></div>
```

### [Using a percentage](#using-a-percentage)

Use `min-block-full` or `min-block-<fraction>` utilities like `min-block-1/2`, and `min-block-2/5` to give an element a percentage-based minimum block size:

min-block-full

min-block-9/10

min-block-3/4

min-block-1/2

min-block-1/3

```
<div class="min-block-full ...">min-block-full</div><div class="min-block-9/10 ...">min-block-9/10</div><div class="min-block-3/4 ...">min-block-3/4</div><div class="min-block-1/2 ...">min-block-1/2</div><div class="min-block-1/3 ...">min-block-1/3</div>
```

### [Using a custom value](#using-a-custom-value)

Use the `min-block-[<value>]` syntax to set the minimum block size based on a completely custom value:

```
<div class="min-block-[220px] ...">  <!-- ... --></div>
```

For CSS variables, you can also use the `min-block-(<custom-property>)` syntax:

```
<div class="min-block-(--my-min-block-size) ...">  <!-- ... --></div>
```

This is just a shorthand for `min-block-[var(<custom-property>)]` that adds the `var()` function for you automatically.

### [Responsive design](#responsive-design)

Prefix a `min-block-size` utility with a breakpoint variant like `md:` to only apply the utility at medium screen sizes and above:

```
<div class="block-24 min-block-0 md:min-block-full ...">  <!-- ... --></div>
```

Learn more about using variants in the [variants documentation](/docs/hover-focus-and-other-states).

## [Customizing your theme](#customizing-your-theme)

The `min-block-<number>` utilities are driven by the `--spacing` theme variable, which can be customized in your own theme:

```
@theme {  --spacing: 1px; }
```

Learn more about customizing the spacing scale in the [theme variable documentation](/docs/theme).

### On this page

- [Quick reference](#quick-reference)
- [Examples](#examples)
  - [Basic example](#basic-example)
  - [Using a percentage](#using-a-percentage)
  - [Using a custom value](#using-a-custom-value)
  - [Responsive design](#responsive-design)
- [Customizing your theme](#customizing-your-theme)

Copyright © 2026 Tailwind Labs Inc.·[Trademark Policy](/brand)
