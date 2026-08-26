# Column layouts - CSS | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/CSS/How_to/Layout_cookbook/Column_layouts

## [Requirements](#requirements)

There are a number of design patterns you might want to achieve with your columns:

- [A continuous thread of content broken up into newspaper-style columns](#a_continuous_thread_of_content_—_multi-column_layout).
- [A single row of items arranged as columns, with all heights being equal](#a_single_row_of_items_with_equal_heights_—_flexbox).
- [Multiple rows of columns lined up by row and column](#lining_items_up_in_rows_and_columns_—_grid_layout).

## [The recipes](#the_recipes)

You need to choose different layout methods in order to achieve your requirements.

### [A continuous thread of content — multi-column layout](#a_continuous_thread_of_content_—_multi-column_layout)

If you create columns using multi-column layout your text will remain as a continuous stream filling each column in turn. The columns must all be the same size, and you are unable to target an individual column or the content of an individual column.

You can control the gaps between columns with the [`column-gap`](/en-US/docs/Web/CSS/Reference/Properties/column-gap) or [`gap`](/en-US/docs/Web/CSS/Reference/Properties/gap) properties, and add a rule between columns using [`column-rule`](/en-US/docs/Web/CSS/Reference/Properties/column-rule).

Click "Play" in the code blocks below to edit the example in the MDN Playground:

```
<div class="container">
  <p>
    Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion
    daikon amaranth tatsoi tomatillo melon azuki bean garlic.
  </p>
  <p>
    Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette
    tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato.
    Dandelion cucumber earthnut pea peanut soko zucchini.
  </p>
  <p>
    Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce
    kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter
    purslane kale. Celery potato scallion desert raisin horseradish spinach
  </p>
</div>
```

```
.container {
  border: 2px solid rgb(75 70 74);
  border-radius: 0.5em;
  padding: 20px;
  font: 1.2em sans-serif;

  column-width: 10em;
  column-rule: 1px solid rgb(75 70 74);
}
```

In this example, we used the [`column-width`](/en-US/docs/Web/CSS/Reference/Properties/column-width) property to set a minimum width that the columns need to be before the browser adds an additional column. The [`columns`](/en-US/docs/Web/CSS/Reference/Properties/columns) shorthand property can be used to set the `column-width` and [`column-count`](/en-US/docs/Web/CSS/Reference/Properties/column-count) properties, either of which can define the maximum number of columns allowed.

Use multicol when:

- You want your text to display in newspaper-like columns.
- You have a set of small items you want to break into columns.
- You do not need to target individual column boxes for styling.

### [A single row of items with equal heights — flexbox](#a_single_row_of_items_with_equal_heights_—_flexbox)

Flexbox can be used to break content into columns by setting [`display: flex;`](/en-US/docs/Web/CSS/Reference/Properties/display) to make a parent element a flex-container. Just adding this one property turns all the children (child elements, pseudo-elements, and text nodes) into flex items along a single line. Setting the same [`flex`](/en-US/docs/Web/CSS/Reference/Properties/flex) shorthand property with a single numeric value distributes all the available space equally, generally making all the flex items the same size as long as none have non-wrapping content forcing the item to be larger.

Margins or the `gap` property can be used to create gaps between items, but there is currently no CSS property that adds rules between flex items.

```
<div class="container">
  <p>
    Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion
    daikon amaranth tatsoi tomatillo melon azuki bean garlic.
  </p>

  <p>
    Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette
    tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato.
    Dandelion cucumber earthnut pea peanut soko zucchini.
  </p>

  <p>
    Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce
    kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter
    purslane kale. Celery potato scallion desert raisin horseradish spinach
    carrot soko.
  </p>
</div>
```

```
.container {
  border: 2px solid rgb(75 70 74);
  border-radius: 0.5em;
  padding: 20px 10px;
  font: 1.2em sans-serif;

  display: flex;
}

.container > * {
  padding: 10px;
  border: 2px solid rgb(95 97 110);
  border-radius: 0.5em;

  margin: 0 10px;
  flex: 1;
}
```

To create a layout with flex items that wrap onto new rows, set the [`flex-wrap`](/en-US/docs/Web/CSS/Reference/Properties/flex-wrap) property on the container to `wrap`. Note that each flex line distributes space for that line only. Items in one line will not necessarily line up with items on other lines, as you'll see in the example below. This is why flexbox is described as one-dimensional. It is designed for controlling layout as a row or a column, but not both at the same time.

```
<div class="container">
  <p>
    Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion
    daikon amaranth tatsoi tomatillo melon azuki bean garlic.
  </p>

  <p>
    Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette
    tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato.
    Dandelion cucumber earthnut pea peanut soko zucchini.
  </p>

  <p>
    Turnip greens yarrow ricebean rutabaga endive cauliflower sea lettuce
    kohlrabi amaranth water spinach avocado daikon napa cabbage asparagus winter
    purslane kale. Celery potato scallion desert raisin horseradish spinach
    carrot soko.
  </p>
</div>
```

```
.container {
  border: 2px solid rgb(75 70 74);
  border-radius: 0.5em;
  padding: 20px 10px;
  width: 500px;
  font: 1.2em sans-serif;

  display: flex;
  flex-wrap: wrap;
}

.container > * {
  padding: 10px;
  border: 2px solid rgb(95 97 110);
  border-radius: 0.5em;

  margin: 0 10px;
  flex: 1 1 200px;
}
```

Use flexbox:

- For single rows or columns of items.
- When you want to do alignment on the cross axis after laying out your items.
- When you are happy for wrapped items to share out space along their line only and not line up with items in other lines.

### [Lining items up in rows and columns — grid layout](#lining_items_up_in_rows_and_columns_—_grid_layout)

If you want a two-dimensional grid where items line up in rows *and* columns, then you should choose CSS grid layout. Similar to how flexbox works on the direct children of the flex container, grid layout works on the direct children of the grid container. Just set [`display: grid;`](/en-US/docs/Web/CSS/Reference/Properties/display) on the container. Properties set on this container — like [`grid-template-columns`](/en-US/docs/Web/CSS/Reference/Properties/grid-template-columns) and [`grid-template-rows`](/en-US/docs/Web/CSS/Reference/Properties/grid-template-rows) — define how the items are distributed along rows and columns.

Click "Play" in the code blocks below to edit the example in the MDN Playground:

```
<div class="container">
  <p>
    Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion
    daikon amaranth tatsoi.
  </p>

  <p>
    Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette
    tatsoi pea sprouts fava bean collard greens.
  </p>

  <p>
    Nori grape silver beet broccoli kombu beet greens fava bean potato quandong
    celery. Bunya nuts black-eyed pea prairie turnip leek lentil turnip greens
    parsnip. .
  </p>
</div>
```

```
.container {
  border: 2px solid rgb(75 70 74);
  border-radius: 0.5em;
  padding: 20px;
  width: 500px;
  font: 1.2em sans-serif;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
}

.container > * {
  padding: 10px;
  border: 2px solid rgb(95 97 110);
  border-radius: 0.5em;
  margin: 0;
}
```

Use grid:

- For multiple rows or columns of items.
- When you want to be able to align the items on the block and inline axes.
- When you want items to line up in rows and columns.

## [Resources on MDN](#resources_on_mdn)

- [Guide to Multi-column Layout](/en-US/docs/Web/CSS/Guides/Multicol_layout)
- [Guide to flexbox](/en-US/docs/Web/CSS/Guides/Flexible_box_layout)
- [Guide to CSS grid layout](/en-US/docs/Web/CSS/Guides/Grid_layout)
