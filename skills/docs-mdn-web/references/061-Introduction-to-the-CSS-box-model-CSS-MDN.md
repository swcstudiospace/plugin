# Introduction to the CSS box model - CSS | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_model/Introduction

## [Content area](#content_area)

The **content area**, bounded by the content edge, contains the "real" content of the element, such as text, an image, or a video player. Its dimensions are the *content width* (or *content-box width*) and the *content height* (or *content-box height*). It often has a background color or background image.

If the [`box-sizing`](/en-US/docs/Web/CSS/Reference/Properties/box-sizing) property is set to `content-box` (default) and if the element is a block element, the content area's size can be explicitly defined with the [`width`](/en-US/docs/Web/CSS/Reference/Properties/width), [`min-width`](/en-US/docs/Web/CSS/Reference/Properties/min-width), [`max-width`](/en-US/docs/Web/CSS/Reference/Properties/max-width), [`height`](/en-US/docs/Web/CSS/Reference/Properties/height), [`min-height`](/en-US/docs/Web/CSS/Reference/Properties/min-height), and [`max-height`](/en-US/docs/Web/CSS/Reference/Properties/max-height) properties.

## [Padding area](#padding_area)

The **padding area**, bounded by the padding edge, extends the content area to include the element's padding. Its dimensions are the *padding-box width* and the *padding-box height*.

The thickness of the padding is determined by the [`padding-top`](/en-US/docs/Web/CSS/Reference/Properties/padding-top), [`padding-right`](/en-US/docs/Web/CSS/Reference/Properties/padding-right), [`padding-bottom`](/en-US/docs/Web/CSS/Reference/Properties/padding-bottom), [`padding-left`](/en-US/docs/Web/CSS/Reference/Properties/padding-left), and shorthand [`padding`](/en-US/docs/Web/CSS/Reference/Properties/padding) properties.

## [Border area](#border_area)

The **border area**, bounded by the border edge, extends the padding area to include the element's borders. Its dimensions are the *border-box width* and the *border-box height*.

The thickness of the borders are determined by the [`border-width`](/en-US/docs/Web/CSS/Reference/Properties/border-width) and shorthand [`border`](/en-US/docs/Web/CSS/Reference/Properties/border) properties. If the [`box-sizing`](/en-US/docs/Web/CSS/Reference/Properties/box-sizing) property is set to `border-box`, the border area's size can be explicitly defined with the [`width`](/en-US/docs/Web/CSS/Reference/Properties/width), [`min-width`](/en-US/docs/Web/CSS/Reference/Properties/min-width), [`max-width`](/en-US/docs/Web/CSS/Reference/Properties/max-width), [`height`](/en-US/docs/Web/CSS/Reference/Properties/height), [`min-height`](/en-US/docs/Web/CSS/Reference/Properties/min-height), and [`max-height`](/en-US/docs/Web/CSS/Reference/Properties/max-height) properties. When there is a background ([`background-color`](/en-US/docs/Web/CSS/Reference/Properties/background-color) or [`background-image`](/en-US/docs/Web/CSS/Reference/Properties/background-image)) set on a box, it extends to the outer edge of the border (i.e., extends underneath the border in z-ordering). This default behavior can be altered with the [`background-clip`](/en-US/docs/Web/CSS/Reference/Properties/background-clip) CSS property.

## [Margin area](#margin_area)

The **margin area**, bounded by the margin edge, extends the border area to include an empty area used to separate the element from its neighbors. Its dimensions are the *margin box width* and the *margin box height*.

The size of the margin area is determined by the [`margin-top`](/en-US/docs/Web/CSS/Reference/Properties/margin-top), [`margin-right`](/en-US/docs/Web/CSS/Reference/Properties/margin-right), [`margin-bottom`](/en-US/docs/Web/CSS/Reference/Properties/margin-bottom), [`margin-left`](/en-US/docs/Web/CSS/Reference/Properties/margin-left), and shorthand [`margin`](/en-US/docs/Web/CSS/Reference/Properties/margin) properties. When [margin collapsing](/en-US/docs/Web/CSS/Guides/Box_model/Margin_collapsing) occurs, the margin area is not clearly defined since margins are shared between boxes.

Finally, note that for non-replaced inline elements, the amount of space taken up (the contribution to the height of the line) is determined by the [`line-height`](/en-US/docs/Web/CSS/Reference/Properties/line-height) property, even though the borders and padding are still displayed around the content.

## [See also](#see_also)

- [CSS box model](/en-US/docs/Web/CSS/Guides/Box_model) module
- [Layout and the containing block](/en-US/docs/Web/CSS/Guides/Display/Containing_block)
- [Introducing the CSS Cascade](/en-US/docs/Web/CSS/Guides/Cascade/Introduction)
- [Learn: Handling conflicts](/en-US/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts)
- CSS key concepts:
  - [CSS syntax](/en-US/docs/Web/CSS/Guides/Syntax/Introduction)
  - [At-rules](/en-US/docs/Web/CSS/Guides/Syntax/At-rules)
  - [Comments](/en-US/docs/Web/CSS/Guides/Syntax/Comments)
  - [Specificity](/en-US/docs/Web/CSS/Guides/Cascade/Specificity)
  - [Inheritance](/en-US/docs/Web/CSS/Guides/Cascade/Inheritance)
  - [Layout modes](/en-US/docs/Glossary/Layout_mode)
  - [Visual formatting model](/en-US/docs/Web/CSS/Guides/Display/Visual_formatting_model)
  - [Margin collapsing](/en-US/docs/Web/CSS/Guides/Box_model/Margin_collapsing)
  - Values:
    - [Initial values](/en-US/docs/Web/CSS/Guides/Cascade/Property_value_processing#initial_value)
    - [Computed values](/en-US/docs/Web/CSS/Guides/Cascade/Property_value_processing#computed_value)
    - [Used values](/en-US/docs/Web/CSS/Guides/Cascade/Property_value_processing#used_value)
    - [Actual values](/en-US/docs/Web/CSS/Guides/Cascade/Property_value_processing#actual_value)
  - [Value definition syntax](/en-US/docs/Web/CSS/Guides/Values_and_units/Value_definition_syntax)
  - [Shorthand properties](/en-US/docs/Web/CSS/Guides/Cascade/Shorthand_properties)
  - [Replaced elements](/en-US/docs/Glossary/Replaced_elements)
