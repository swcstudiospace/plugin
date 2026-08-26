# Center an element - CSS | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/CSS/How_to/Layout_cookbook/Center_an_element

## [Requirements](#requirements)

To place an item into the center of another box horizontally and vertically.

## [Recipe](#recipe)

Click "Play" in the code blocks below to edit the example in the MDN Playground:

```
<div class="container">
  <div class="item">I am centered!</div>
</div>
```

```
.item {
  border: 2px solid rgb(95 97 110);
  border-radius: 0.5em;
  padding: 20px;
  width: 10em;
}

.container {
  border: 2px solid rgb(75 70 74);
  border-radius: 0.5em;
  font: 1.2em sans-serif;

  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## [Using flexbox](#using_flexbox)

To center a box within another box, first turn the containing box into a [flex container](/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts#the_flex_container) by setting its [`display`](/en-US/docs/Web/CSS/Reference/Properties/display) property to `flex`. Then set [`align-items`](/en-US/docs/Web/CSS/Reference/Properties/align-items) to `center` for vertical centering (on the block axis) and [`justify-content`](/en-US/docs/Web/CSS/Reference/Properties/justify-content) to `center` for horizontal centering (on the inline axis). And that's all it takes to center one box inside another!

### [HTML](#html)

```
<div class="container">
  <div class="item">I am centered!</div>
</div>
```

### [CSS](#css)

```
div {
  border: solid 3px;
  padding: 1em;
  max-width: 75%;
}

.item {
  border: 2px solid rgb(95 97 110);
  border-radius: 0.5em;
  padding: 20px;
  width: 10em;
}

.container {
  height: 8em;
  border: 2px solid rgb(75 70 74);
  border-radius: 0.5em;
  font: 1.2em sans-serif;

  display: flex;
  align-items: center;
  justify-content: center;
}
```

We set a height for the container to demonstrate that the inner item is indeed vertically centered within the container.

### [Result](#result)

Instead of applying `align-items: center;` on the container, you can also vertically center the inner item by setting [`align-self`](/en-US/docs/Web/CSS/Reference/Properties/align-self) to `center` on the inner item itself.

## [Using grid](#using_grid)

Another method you can use for centering one box inside another is to first make the containing box a [grid container](/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts#grid_container) and then set its [`place-items`](/en-US/docs/Web/CSS/Reference/Properties/place-items) property to `center` to center align its items on both the block and inline axes.

### [HTML](#html_2)

```
<div class="container">
  <div class="item">I am centered!</div>
</div>
```

### [CSS](#css_2)

```
div {
  border: solid 3px;
  padding: 1em;
  max-width: 75%;
}

.item {
  border: 2px solid rgb(95 97 110);
  border-radius: 0.5em;
  padding: 20px;
  width: 10em;
}

.container {
  height: 8em;
  border: 2px solid rgb(75 70 74);
  border-radius: 0.5em;
  font: 1.2em sans-serif;

  display: grid;
  place-items: center;
}
```

### [Result](#result_2)

Instead of applying `place-items: center;` on the container, you can achieve the same centering by setting [`place-content: center;`](/en-US/docs/Web/CSS/Reference/Properties/place-content) on the container or by applying either [`place-self: center`](/en-US/docs/Web/CSS/Reference/Properties/place-self) or [`margin: auto;`](/en-US/docs/Web/CSS/Reference/Properties/margin) on the inner item itself.

## [Resources on MDN](#resources_on_mdn)

- [Box alignment in flexbox](/en-US/docs/Web/CSS/Guides/Box_alignment/In_flexbox)
- [CSS box alignment guide](/en-US/docs/Web/CSS/Guides/Box_alignment)
