# Global attributes - HTML | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes

## [List of global attributes](#list_of_global_attributes)

[`accesskey`](/en-US/docs/Web/HTML/Reference/Global_attributes/accesskey)
:   Provides a hint for generating a keyboard shortcut for the current element. This attribute consists of a space-separated list of characters. The browser should use the first one that exists on the computer keyboard layout.

[`anchor`](/en-US/docs/Web/HTML/Reference/Global_attributes/anchor)
:   Associates a positioned element with an anchor element. The attribute's value is the [`id`](/en-US/docs/Web/HTML/Reference/Global_attributes/id) value of the element you want to anchor the positioned element to. The element can then be positioned [using CSS anchor positioning](/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using).
:   Controls whether inputted text is automatically capitalized and, if so, in what manner.
:   Controls whether input text is automatically corrected for spelling errors.
    This can be applied to elements that have editable text except for [`<input>`](/en-US/docs/Web/HTML/Reference/Elements/input) elements with the attribute: [`type="password"`](/en-US/docs/Web/HTML/Reference/Elements/input/password), [`type="email"`](/en-US/docs/Web/HTML/Reference/Elements/input/email), or [`type="url"`](/en-US/docs/Web/HTML/Reference/Elements/input/url).

[`autofocus`](/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus)
:   Indicates that an element is to be focused on page load, or as soon as the [`<dialog>`](/en-US/docs/Web/HTML/Reference/Elements/dialog) it is part of is displayed. This attribute is a boolean, initially false.

[`class`](/en-US/docs/Web/HTML/Reference/Global_attributes/class)
:   A space-separated list of the classes of the element. Classes allow CSS and JavaScript to select and access specific elements via the [class selectors](/en-US/docs/Web/CSS/Reference/Selectors/Class_selectors) or functions like the method [`Document.getElementsByClassName()`](/en-US/docs/Web/API/Document/getElementsByClassName).

[`contenteditable`](/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable)
:   An [enumerated](/en-US/docs/Glossary/Enumerated) attribute indicating if the element should be editable by the user. If so, the browser modifies its widget to allow editing. The attribute must take one of the following values:

    - `true` or the *empty string*, which indicates that the element must be editable;
    - `false`, which indicates that the element must not be editable.
    - `plaintext-only`, which indicates the element's raw text is editable, but rich text formatting is disabled.

[`data-*`](/en-US/docs/Web/HTML/Reference/Global_attributes/data-*)
:   Forms a class of attributes, called custom data attributes, that allow proprietary information to be exchanged between the [HTML](/en-US/docs/Web/HTML) and its [DOM](/en-US/docs/Glossary/DOM) representation that may be used by scripts. All such custom data are available via the [`HTMLElement`](/en-US/docs/Web/API/HTMLElement) interface of the element the attribute is set on. The [`HTMLElement.dataset`](/en-US/docs/Web/API/HTMLElement/dataset) property gives access to them.

[`dir`](/en-US/docs/Web/HTML/Reference/Global_attributes/dir)
:   An enumerated attribute indicating the directionality of the element's text. It can have the following values:

    - `ltr`, which means *left to right* and is to be used for languages that are written from the left to the right (like English);
    - `rtl`, which means *right to left* and is to be used for languages that are written from the right to the left (like Arabic);
    - `auto`, which lets the user agent decide. It uses a basic algorithm as it parses the characters inside the element until it finds a character with a strong directionality, then it applies that directionality to the whole element.

[`draggable`](/en-US/docs/Web/HTML/Reference/Global_attributes/draggable)
:   An enumerated attribute indicating whether the element can be dragged, using the [Drag and Drop API](/en-US/docs/Web/API/HTML_Drag_and_Drop_API). It can have the following values:

    - `true`, which indicates that the element may be dragged
    - `false`, which indicates that the element may not be dragged.

[`enterkeyhint`](/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint)
:   Hints what action label (or icon) to present for the enter key on virtual keyboards.

[`exportparts`](/en-US/docs/Web/HTML/Reference/Global_attributes/exportparts)
:   Used to transitively export shadow parts from a nested shadow tree into a containing light tree.

[`hidden`](/en-US/docs/Web/HTML/Reference/Global_attributes/hidden)
:   An enumerated attribute indicating that the element is not yet, or is no longer, *relevant*. For example, it can be used to hide elements of the page that can't be used until the login process has been completed. The browser won't render such elements. This attribute must not be used to hide content that could legitimately be shown.

[`id`](/en-US/docs/Web/HTML/Reference/Global_attributes/id)
:   Defines a unique identifier (ID) which must be unique in the whole document. Its purpose is to identify the element when linking (using a fragment identifier), scripting, or styling (with CSS).

[`inert`](/en-US/docs/Web/HTML/Reference/Global_attributes/inert)
:   A boolean value that makes the browser disregard user input events for the element. Useful when click events are present.

[`inputmode`](/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode)
:   Provides a hint to browsers about the type of virtual keyboard configuration to use when editing this element or its contents. Used primarily on [`<input>`](/en-US/docs/Web/HTML/Reference/Elements/input) elements, but is usable on any element while in [`contenteditable`](/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable) mode.

[`is`](/en-US/docs/Web/HTML/Reference/Global_attributes/is)
:   Allows you to specify that a standard HTML element should behave like a registered customized built-in element (see [Using custom elements](/en-US/docs/Web/API/Web_components/Using_custom_elements) for more details).

**Note:**
The `item*` attributes are part of the [WHATWG HTML Microdata feature](https://html.spec.whatwg.org/multipage/microdata.html#microdata "External link (opens in new tab)").

[`itemid`](/en-US/docs/Web/HTML/Reference/Global_attributes/itemid)
:   The unique, global identifier of an item.

[`itemprop`](/en-US/docs/Web/HTML/Reference/Global_attributes/itemprop)
:   Used to add properties to an item. Every HTML element may have an `itemprop` attribute specified, where an `itemprop` consists of a name and value pair.

[`itemref`](/en-US/docs/Web/HTML/Reference/Global_attributes/itemref)
:   Properties that are not descendants of an element with the `itemscope` attribute can be associated with the item using an `itemref`. It provides a list of element ids (not `itemid`s) with additional properties elsewhere in the document.

[`itemscope`](/en-US/docs/Web/HTML/Reference/Global_attributes/itemscope)
:   `itemscope` (usually) works along with [`itemtype`](/en-US/docs/Web/HTML/Reference/Global_attributes/itemtype) to specify that the HTML contained in a block is about a particular item. `itemscope` creates the Item and defines the scope of the `itemtype` associated with it. `itemtype` is a valid URL of a vocabulary (such as [schema.org](https://schema.org/ "External link (opens in new tab)")) that describes the item and its properties context.

[`itemtype`](/en-US/docs/Web/HTML/Reference/Global_attributes/itemtype)
:   Specifies the URL of the vocabulary that will be used to define `itemprop`s (item properties) in the data structure. [`itemscope`](/en-US/docs/Web/HTML/Reference/Global_attributes/itemscope) is used to set the scope of where in the data structure the vocabulary set by `itemtype` will be active.

[`lang`](/en-US/docs/Web/HTML/Reference/Global_attributes/lang)
:   Helps define the language of an element: the language that non-editable elements are in, or the language that editable elements should be written in by the user. The attribute should contain a valid [BCP 47 language tag](/en-US/docs/Glossary/BCP_47_language_tag). `xml:lang` has priority over it.

[`nonce`](/en-US/docs/Web/HTML/Reference/Global_attributes/nonce)
:   A cryptographic [nonce](/en-US/docs/Glossary/Nonce) ("number used once") which can be used by [Content Security Policy](/en-US/docs/Web/HTTP/Guides/CSP) to determine whether or not a given fetch will be allowed to proceed.

[`part`](/en-US/docs/Web/HTML/Reference/Global_attributes/part)
:   A space-separated list of the part names of the element. Part names allows CSS to select and style specific elements in a shadow tree via the [`::part`](/en-US/docs/Web/CSS/Reference/Selectors/::part) pseudo-element.

[`popover`](/en-US/docs/Web/HTML/Reference/Global_attributes/popover)
:   Used to designate an element as a popover element (see [Popover API](/en-US/docs/Web/API/Popover_API "Popover API")). Popover elements are hidden via `display: none` until opened via an invoking/control element (i.e., a `<button>` or `<input type="button">` with a [`popovertarget`](/en-US/docs/Web/HTML/Reference/Elements/button#popovertarget) attribute) or a [`HTMLElement.showPopover()`](/en-US/docs/Web/API/HTMLElement/showPopover) call.

[`role`](/en-US/docs/Web/Accessibility/ARIA/Reference/Roles)
:   Roles define the semantic meaning of content, allowing screen readers and other tools to present and support interaction with an object in a way that is consistent with user expectations of that type of object. `roles` are added to HTML elements using `role="role_type"`, where `role_type` is the name of a role in the ARIA specification.

[`slot`](/en-US/docs/Web/HTML/Reference/Global_attributes/slot)
:   Assigns a slot in a [shadow DOM](/en-US/docs/Web/API/Web_components/Using_shadow_DOM) shadow tree to an element: An element with a `slot` attribute is assigned to the slot created by the [`<slot>`](/en-US/docs/Web/HTML/Reference/Elements/slot) element whose [`name`](/en-US/docs/Web/HTML/Reference/Elements/slot#name) attribute's value matches that `slot` attribute's value.

[`spellcheck`](/en-US/docs/Web/HTML/Reference/Global_attributes/spellcheck)
:   An enumerated attribute defines whether the element may be checked for spelling errors. It may have the following values:

    - empty string or `true`, which indicates that the element should be, if possible, checked for spelling errors;
    - `false`, which indicates that the element should not be checked for spelling errors.

[`style`](/en-US/docs/Web/HTML/Reference/Global_attributes/style)
:   Contains [CSS](/en-US/docs/Web/CSS) styling declarations to be applied to the element. Note that it is recommended for styles to be defined in a separate file or files. This attribute and the [`<style>`](/en-US/docs/Web/HTML/Reference/Elements/style) element have mainly the purpose of allowing for quick styling, for example for testing purposes.

[`tabindex`](/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex)
:   An integer attribute indicating if the element can take input focus (is *focusable*), if it should participate to sequential keyboard navigation, and if so, at what position. It can take several values:

    - a *negative value* means that the element should be focusable, but should not be reachable via sequential keyboard navigation;
    - `0` means that the element should be focusable and reachable via sequential keyboard navigation, but its relative order is defined by the platform convention;
    - a *positive value* means that the element should be focusable and reachable via sequential keyboard navigation; the order in which the elements are focused is the increasing value of the [`tabindex`](/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex). If several elements share the same tabindex, their relative order follows their relative positions in the document.

[`title`](/en-US/docs/Web/HTML/Reference/Global_attributes/title)
:   Contains a text representing advisory information related to the element it belongs to. Such information can typically, but not necessarily, be presented to the user as a tooltip.

[`translate`](/en-US/docs/Web/HTML/Reference/Global_attributes/translate)
:   An enumerated attribute that is used to specify whether an element's attribute values and the values of its [`Text`](/en-US/docs/Web/API/Text) node children are to be translated when the page is localized, or whether to leave them unchanged. It can have the following values:

    - empty string or `yes`, which indicates that the element will be translated.
    - `no`, which indicates that the element will not be translated.

[`virtualkeyboardpolicy`](/en-US/docs/Web/HTML/Reference/Global_attributes/virtualkeyboardpolicy)
:   An [enumerated](/en-US/docs/Glossary/Enumerated) attribute used to control the on-screen virtual keyboard behavior on devices such as tablets, mobile phones, or other devices where a hardware keyboard may not be available for elements that its content is editable (for example, it is an [`<input>`](/en-US/docs/Web/HTML/Reference/Elements/input) or [`<textarea>`](/en-US/docs/Web/HTML/Reference/Elements/textarea) element, or an element with the [`contenteditable`](/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable) attribute set).

    - `auto` or an *empty string*, which automatically shows the virtual keyboard when the element is focused or tapped.
    - `manual`, which decouples focus and tap on the element from the virtual keyboard's state.

[`writingsuggestions`](/en-US/docs/Web/HTML/Reference/Global_attributes/writingsuggestions)
:   An [enumerated](/en-US/docs/Glossary/Enumerated) attribute indicating if browser-provided writing suggestions should be enabled under the scope of the element or not.

    - `false`, which disables the browser's writing suggestions.
    - `true` or an *empty string*, which enables writing suggestions.

## [List of global event handler attributes](#list_of_global_event_handler_attributes)

HTML event handler attributes are discouraged; see [HTML attribute reference](/en-US/docs/Web/HTML/Reference/Attributes#event_handler_attributes) for how they work.

While the attributes listed below apply to all elements, they are not useful on all elements. For example, `onvolumechange` HTML attribute is accepted by all elements and attaches an event listener for `volumechange`, but only media elements will ever receive a `volumechange` event fired by the browser. For other elements, you can only use [`EventTarget.dispatchEvent()`](/en-US/docs/Web/API/EventTarget/dispatchEvent) to manually dispatch one. [Some attributes](/en-US/docs/Web/HTML/Reference/Elements/body#event_attributes) can be specified on [`<body>`](/en-US/docs/Web/HTML/Reference/Elements/body), but they would instead listen to events on `window`.

- [`onabort`](/en-US/docs/Web/API/HTMLMediaElement/abort_event)
- [`onanimationcancel`](/en-US/docs/Web/API/Element/animationcancel_event)
- [`onanimationend`](/en-US/docs/Web/API/Element/animationend_event)
- [`onanimationiteration`](/en-US/docs/Web/API/Element/animationiteration_event)
- [`onanimationstart`](/en-US/docs/Web/API/Element/animationstart_event)
- [`onauxclick`](/en-US/docs/Web/API/Element/auxclick_event)
- [`onbeforeinput`](/en-US/docs/Web/API/Element/beforeinput_event)
- [`onbeforematch`](/en-US/docs/Web/API/Element/beforematch_event)
- [`onbeforetoggle`](/en-US/docs/Web/API/HTMLElement/beforetoggle_event)
- [`onblur`](/en-US/docs/Web/API/Element/blur_event)
- [`oncancel`](/en-US/docs/Web/API/HTMLInputElement/cancel_event)
- [`oncanplay`](/en-US/docs/Web/API/HTMLMediaElement/canplay_event)
- [`oncanplaythrough`](/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event)
- [`onchange`](/en-US/docs/Web/API/HTMLElement/change_event)
- [`onclick`](/en-US/docs/Web/API/Element/click_event)
- [`onclose`](/en-US/docs/Web/API/HTMLDialogElement/close_event)
- [`oncommand`](/en-US/docs/Web/API/HTMLElement/command_event)
- [`oncontentvisibilityautostatechange`](/en-US/docs/Web/API/Element/contentvisibilityautostatechange_event)
- [`oncontextlost`](/en-US/docs/Web/API/HTMLCanvasElement/contextlost_event)
- [`oncontextmenu`](/en-US/docs/Web/API/Element/contextmenu_event)
- [`oncontextrestored`](/en-US/docs/Web/API/HTMLCanvasElement/contextrestored_event)
- [`oncopy`](/en-US/docs/Web/API/Element/copy_event)
- [`oncuechange`](/en-US/docs/Web/API/HTMLTrackElement/cuechange_event)
- [`oncut`](/en-US/docs/Web/API/Element/cut_event)
- [`ondblclick`](/en-US/docs/Web/API/Element/dblclick_event)
- [`ondrag`](/en-US/docs/Web/API/HTMLElement/drag_event)
- [`ondragend`](/en-US/docs/Web/API/HTMLElement/dragend_event)
- [`ondragenter`](/en-US/docs/Web/API/HTMLElement/dragenter_event)
- [`ondragleave`](/en-US/docs/Web/API/HTMLElement/dragleave_event)
- [`ondragover`](/en-US/docs/Web/API/HTMLElement/dragover_event)
- [`ondragstart`](/en-US/docs/Web/API/HTMLElement/dragstart_event)
- [`ondrop`](/en-US/docs/Web/API/HTMLElement/drop_event)
- [`ondurationchange`](/en-US/docs/Web/API/HTMLMediaElement/durationchange_event)
- [`onemptied`](/en-US/docs/Web/API/HTMLMediaElement/emptied_event)
- [`onended`](/en-US/docs/Web/API/HTMLMediaElement/ended_event)
- [`onerror`](/en-US/docs/Web/API/HTMLElement/error_event)
- [`onfocus`](/en-US/docs/Web/API/Element/focus_event)
- [`onfocusin`](/en-US/docs/Web/API/Element/focusin_event)
- [`onfocusout`](/en-US/docs/Web/API/Element/focusout_event)
- [`onformdata`](/en-US/docs/Web/API/HTMLFormElement/formdata_event)
- [`onfullscreenchange`](/en-US/docs/Web/API/Element/fullscreenchange_event)
- [`onfullscreenerror`](/en-US/docs/Web/API/Element/fullscreenerror_event)
- [`ongesturechange`](/en-US/docs/Web/API/Element/gesturechange_event)
- [`ongestureend`](/en-US/docs/Web/API/Element/gestureend_event)
- [`ongesturestart`](/en-US/docs/Web/API/Element/gesturestart_event)
- [`ongotpointercapture`](/en-US/docs/Web/API/Element/gotpointercapture_event)
- [`oninput`](/en-US/docs/Web/API/Element/input_event)
- [`oninvalid`](/en-US/docs/Web/API/HTMLInputElement/invalid_event)
- [`onkeydown`](/en-US/docs/Web/API/Element/keydown_event)
- [`onkeypress`](/en-US/docs/Web/API/Element/keypress_event)
- [`onkeyup`](/en-US/docs/Web/API/Element/keyup_event)
- [`onload`](/en-US/docs/Web/API/HTMLElement/load_event)
- [`onloadeddata`](/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event)
- [`onloadedmetadata`](/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event)
- [`onloadstart`](/en-US/docs/Web/API/HTMLMediaElement/loadstart_event)
- [`onlostpointercapture`](/en-US/docs/Web/API/Element/lostpointercapture_event)
- [`onmousedown`](/en-US/docs/Web/API/Element/mousedown_event)
- [`onmouseenter`](/en-US/docs/Web/API/Element/mouseenter_event)
- [`onmouseleave`](/en-US/docs/Web/API/Element/mouseleave_event)
- [`onmousemove`](/en-US/docs/Web/API/Element/mousemove_event)
- [`onmouseout`](/en-US/docs/Web/API/Element/mouseout_event)
- [`onmouseover`](/en-US/docs/Web/API/Element/mouseover_event)
- [`onmouseup`](/en-US/docs/Web/API/Element/mouseup_event)
- [`onmousewheel`](/en-US/docs/Web/API/Element/mousewheel_event)
- [`onpaste`](/en-US/docs/Web/API/Element/paste_event)
- [`onpause`](/en-US/docs/Web/API/HTMLMediaElement/pause_event)
- [`onplay`](/en-US/docs/Web/API/HTMLMediaElement/play_event)
- [`onplaying`](/en-US/docs/Web/API/HTMLMediaElement/playing_event)
- [`onpointercancel`](/en-US/docs/Web/API/Element/pointercancel_event)
- [`onpointerdown`](/en-US/docs/Web/API/Element/pointerdown_event)
- [`onpointerenter`](/en-US/docs/Web/API/Element/pointerenter_event)
- [`onpointerleave`](/en-US/docs/Web/API/Element/pointerleave_event)
- [`onpointermove`](/en-US/docs/Web/API/Element/pointermove_event)
- [`onpointerout`](/en-US/docs/Web/API/Element/pointerout_event)
- [`onpointerover`](/en-US/docs/Web/API/Element/pointerover_event)
- [`onpointerrawupdate`](/en-US/docs/Web/API/Element/pointerrawupdate_event)
- [`onpointerup`](/en-US/docs/Web/API/Element/pointerup_event)
- [`onprogress`](/en-US/docs/Web/API/HTMLMediaElement/progress_event)
- [`onratechange`](/en-US/docs/Web/API/HTMLMediaElement/ratechange_event)
- [`onreset`](/en-US/docs/Web/API/HTMLFormElement/reset_event)
- [`onresize`](/en-US/docs/Web/API/HTMLVideoElement/resize_event)
- [`onscroll`](/en-US/docs/Web/API/Element/scroll_event)
- [`onscrollend`](/en-US/docs/Web/API/Element/scrollend_event)
- [`onscrollsnapchange`](/en-US/docs/Web/API/Element/scrollsnapchange_event)
- [`onscrollsnapchanging`](/en-US/docs/Web/API/Element/scrollsnapchanging_event)
- [`onsecuritypolicyviolation`](/en-US/docs/Web/API/Element/securitypolicyviolation_event)
- [`onseeked`](/en-US/docs/Web/API/HTMLMediaElement/seeked_event)
- [`onseeking`](/en-US/docs/Web/API/HTMLMediaElement/seeking_event)
- [`onselect`](/en-US/docs/Web/API/HTMLInputElement/select_event)
- [`onselectionchange`](/en-US/docs/Web/API/HTMLInputElement/selectionchange_event)
- [`onselectstart`](/en-US/docs/Web/API/Node/selectstart_event)
- [`onslotchange`](/en-US/docs/Web/API/HTMLSlotElement/slotchange_event)
- [`onstalled`](/en-US/docs/Web/API/HTMLMediaElement/stalled_event)
- [`onsubmit`](/en-US/docs/Web/API/HTMLFormElement/submit_event)
- [`onsuspend`](/en-US/docs/Web/API/HTMLMediaElement/suspend_event)
- [`ontimeupdate`](/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event)
- [`ontoggle`](/en-US/docs/Web/API/HTMLElement/toggle_event)
- [`ontouchcancel`](/en-US/docs/Web/API/Element/touchcancel_event)
- [`ontouchend`](/en-US/docs/Web/API/Element/touchend_event)
- [`ontouchmove`](/en-US/docs/Web/API/Element/touchmove_event)
- [`ontouchstart`](/en-US/docs/Web/API/Element/touchstart_event)
- [`ontransitioncancel`](/en-US/docs/Web/API/Element/transitioncancel_event)
- [`ontransitionend`](/en-US/docs/Web/API/Element/transitionend_event)
- [`ontransitionrun`](/en-US/docs/Web/API/Element/transitionrun_event)
- [`ontransitionstart`](/en-US/docs/Web/API/Element/transitionstart_event)
- [`onvolumechange`](/en-US/docs/Web/API/HTMLMediaElement/volumechange_event)
- [`onwaiting`](/en-US/docs/Web/API/HTMLMediaElement/waiting_event)
- [`onwebkitmouseforcechanged`](/en-US/docs/Web/API/Element/webkitmouseforcechanged_event)
- [`onwebkitmouseforcedown`](/en-US/docs/Web/API/Element/webkitmouseforcedown_event)
- [`onwebkitmouseforceup`](/en-US/docs/Web/API/Element/webkitmouseforceup_event)
- [`onwebkitmouseforcewillbegin`](/en-US/docs/Web/API/Element/webkitmouseforcewillbegin_event)
- [`onwheel`](/en-US/docs/Web/API/Element/wheel_event)

## [Specifications](#specifications)

| Specification |
| --- |
| [HTML # the-title-attribute](https://html.spec.whatwg.org/multipage/dom.html#the-title-attribute) |
| [HTML # the-hidden-attribute](https://html.spec.whatwg.org/multipage/interaction.html#the-hidden-attribute) |
| [HTML # inert-subtrees](https://html.spec.whatwg.org/multipage/interaction.html#inert-subtrees) |
| [HTML # attr-popover-hint](https://html.spec.whatwg.org/multipage/popover.html#attr-popover-hint) |
| [HTML # attr-contenteditable](https://html.spec.whatwg.org/multipage/interaction.html#attr-contenteditable) |
| [HTML # the-id-attribute](https://html.spec.whatwg.org/multipage/dom.html#the-id-attribute) |
| [HTML # heading-levels-&-offsets](https://html.spec.whatwg.org/multipage/sections.html#heading-levels-&-offsets) |
| [HTML # attr-data-\*](https://html.spec.whatwg.org/multipage/dom.html#attr-data-*) |
| [HTML # attr-nonce](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#attr-nonce) |
| [HTML # writing-suggestions](https://html.spec.whatwg.org/multipage/interaction.html#writing-suggestions) |
| [HTML # attr-contenteditable-plaintextonly](https://html.spec.whatwg.org/multipage/interaction.html#attr-contenteditable-plaintextonly) |
| [HTML # attr-lang](https://html.spec.whatwg.org/multipage/dom.html#attr-lang) |
| [HTML # attr-enterkeyhint](https://html.spec.whatwg.org/multipage/interaction.html#attr-enterkeyhint) |
| [HTML # classes](https://html.spec.whatwg.org/multipage/dom.html#classes) |
| [HTML # the-style-attribute](https://html.spec.whatwg.org/multipage/dom.html#the-style-attribute) |
| [HTML # attr-autocorrect](https://html.spec.whatwg.org/multipage/interaction.html#attr-autocorrect) |
| [HTML # attr-translate](https://html.spec.whatwg.org/multipage/dom.html#attr-translate) |
| [HTML # the-accesskey-attribute](https://html.spec.whatwg.org/multipage/interaction.html#the-accesskey-attribute) |
| [HTML # the-inert-attribute](https://html.spec.whatwg.org/multipage/interaction.html#the-inert-attribute) |
| [HTML # attr-spellcheck](https://html.spec.whatwg.org/multipage/interaction.html#attr-spellcheck) |
| [HTML # attr-autocapitalize](https://html.spec.whatwg.org/multipage/interaction.html#attr-autocapitalize) |
| [HTML # the-dir-attribute](https://html.spec.whatwg.org/multipage/dom.html#the-dir-attribute) |
| [HTML # the-popover-attribute](https://html.spec.whatwg.org/multipage/popover.html#the-popover-attribute) |
| [HTML # attr-tabindex](https://html.spec.whatwg.org/multipage/interaction.html#attr-tabindex) |
| [HTML # attr-inputmode](https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode) |
| [HTML # attr-slot](https://html.spec.whatwg.org/multipage/dom.html#attr-slot) |
| [HTML # attr-is](https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is) |
| [HTML # the-autofocus-attribute](https://html.spec.whatwg.org/multipage/interaction.html#the-autofocus-attribute) |
| [HTML # the-draggable-attribute](https://html.spec.whatwg.org/multipage/dnd.html#the-draggable-attribute) |
| [VirtualKeyboard API # dom-elementcontenteditable-virtualkeyboardpolicy](https://w3c.github.io/virtual-keyboard/#dom-elementcontenteditable-virtualkeyboardpolicy) |
| [CSS Style Attributes # style-attribute](https://drafts.csswg.org/css-style-attr/#style-attribute) |
| [CSS Shadow Module Level 1 # part-attr](https://drafts.csswg.org/css-shadow/#part-attr) |
| [CSS Shadow Module Level 1 # element-attrdef-html-global-exportparts](https://drafts.csswg.org/css-shadow/#element-attrdef-html-global-exportparts) |
| [DOM # ref-for-dom-element-slot①](https://dom.spec.whatwg.org/#ref-for-dom-element-slot①) |

## [Browser compatibility](#browser_compatibility)

## [See also](#see_also)

- [`Element`](/en-US/docs/Web/API/Element) interface that allows querying most global attributes.
