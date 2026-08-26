# HTML DOM API - Web APIs | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API

## [HTML DOM concepts and usage](#html_dom_concepts_and_usage)

In this article, we'll focus on the parts of the HTML DOM that involve engaging with HTML elements. Discussion of other areas, such as [Drag and Drop](/en-US/docs/Web/API/HTML_Drag_and_Drop_API "Drag and Drop"), [WebSockets](/en-US/docs/Web/API/WebSockets_API "WebSockets"), [Web Storage](/en-US/docs/Web/API/Web_Storage_API "Web Storage"), etc. can be found in the documentation for those APIs.

### [Structure of an HTML document](#structure_of_an_html_document)

The Document Object Model ([DOM](/en-US/docs/Glossary/DOM)) is an architecture that describes the structure of a [`document`](/en-US/docs/Web/API/Document); each document is represented by an instance of the interface [`Document`](/en-US/docs/Web/API/Document). A document, in turn, consists of a hierarchical tree of **nodes**, in which a node is a fundamental record representing a single object within the document (such as an element or text node).

Nodes may be strictly organizational, providing a means for grouping other nodes together or for providing a point at which a hierarchy can be constructed; other nodes may represent visible components of a document. Each node is based on the [`Node`](/en-US/docs/Web/API/Node) interface, which provides properties for getting information about the node as well as methods for creating, deleting, and organizing nodes within the DOM.

Nodes don't have any concept of including the content that is actually displayed in the document. They're empty vessels. The fundamental notion of a node that can represent visual content is introduced by the [`Element`](/en-US/docs/Web/API/Element) interface. An `Element` object instance represents a single element in a document created using either HTML or an [XML](/en-US/docs/Glossary/XML) vocabulary such as [SVG](/en-US/docs/Glossary/SVG).

For example, consider a document with two elements, one of which has two more elements nested inside it:

![Structure of a document with elements inside a document in a window](/en-US/docs/Web/API/HTML_DOM_API/dom-structure.svg)

While the [`Document`](/en-US/docs/Web/API/Document) interface is defined as part of the [DOM](/en-US/docs/Web/API/Document_Object_Model "DOM") specification, the HTML specification significantly enhances it to add information specific to using the DOM in the context of a web browser, as well as to using it to represent HTML documents specifically.

Among the things added to `Document` by the HTML standard are:

- Support for accessing various information provided by the [HTTP](/en-US/docs/Glossary/HTTP) headers when loading the page, such as the [location](/en-US/docs/Web/API/Document/location "location") from which the document was loaded, [cookies](/en-US/docs/Web/API/Document/cookie "cookies"), [modification date](/en-US/docs/Web/API/Document/lastModified "modification date"), [referring site](/en-US/docs/Web/API/Document/referrer "referring site"), and so forth.
- Access to lists of elements in the document's [`<head>`](/en-US/docs/Web/HTML/Reference/Elements/head) block and [body](/en-US/docs/Web/API/Document/body "body"), as well as lists of the [images](/en-US/docs/Web/API/Document/images "images"), [links](/en-US/docs/Web/API/Document/links "links"), [scripts](/en-US/docs/Web/API/Document/scripts "scripts"), etc. contained in the document.
- Support for interacting with the user by examining [focus](/en-US/docs/Web/API/Document/hasFocus "focus") and by executing commands on [editable content](/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable).
- Event handlers for document events defined by the HTML standard to allow access to [mouse](/en-US/docs/Web/API/MouseEvent "mouse") and [keyboard](/en-US/docs/Web/API/KeyboardEvent "keyboard") events, [drag and drop](/en-US/docs/Web/API/HTML_Drag_and_Drop_API "drag and drop"), [media control](/en-US/docs/Web/API/HTMLMediaElement "media control"), and more.
- Event handlers for events that can be delivered to both elements and documents; these presently include only [`copy`](/en-US/docs/Web/API/Element/copy_event "copy"), [`cut`](/en-US/docs/Web/API/Element/cut_event "cut"), and [`paste`](/en-US/docs/Web/API/Element/paste_event "paste") actions.

### [HTML element interfaces](#html_element_interfaces)

The `Element` interface has been further adapted to represent HTML elements specifically by introducing the [`HTMLElement`](/en-US/docs/Web/API/HTMLElement) interface, which all more specific HTML element classes inherit from. This expands the `Element` class to add HTML-specific general features to the element nodes. Properties added by `HTMLElement` include for example [`hidden`](/en-US/docs/Web/API/HTMLElement/hidden "hidden") and [`innerText`](/en-US/docs/Web/API/HTMLElement/innerText "innerText").

An [HTML](/en-US/docs/Glossary/HTML) document is a DOM tree in which each of the nodes is an HTML element, represented by the [`HTMLElement`](/en-US/docs/Web/API/HTMLElement) interface. The `HTMLElement` class, in turn, implements `Node`, so every element is also a node (but not the other way around). This way, the structural features implemented by the [`Node`](/en-US/docs/Web/API/Node) interface are also available to HTML elements, allowing them to be nested within each other, created and deleted, moved around, and so forth.

The `HTMLElement` interface is generic, however, providing only the functionality common to all HTML elements such as the element's ID, its coordinates, the HTML making up the element, information about scroll position, and so forth.

In order to expand upon the functionality of the core `HTMLElement` interface to provide the features needed by a specific element, the `HTMLElement` class is subclassed to add the needed properties and methods. For example, the [`<canvas>`](/en-US/docs/Web/HTML/Reference/Elements/canvas) element is represented by an object of type [`HTMLCanvasElement`](/en-US/docs/Web/API/HTMLCanvasElement). `HTMLCanvasElement` augments the `HTMLElement` type by adding properties such as [`height`](/en-US/docs/Web/API/HTMLCanvasElement/height "height") and methods like [`getContext()`](/en-US/docs/Web/API/HTMLCanvasElement/getContext "getContext()") to provide canvas-specific features.

The overall inheritance for HTML element classes looks like this:

![Hierarchy of interfaces for HTML elements](/en-US/docs/Web/API/HTML_DOM_API/html-dom-hierarchy.svg)

As such, an element inherits the properties and methods of all of its ancestors. For example, consider an [`<a>`](/en-US/docs/Web/HTML/Reference/Elements/a) element, which is represented in the DOM by an object of type [`HTMLAnchorElement`](/en-US/docs/Web/API/HTMLAnchorElement). The element, then, includes the anchor-specific properties and methods described in that class's documentation, but also those defined by [`HTMLElement`](/en-US/docs/Web/API/HTMLElement) and [`Element`](/en-US/docs/Web/API/Element), as well as from [`Node`](/en-US/docs/Web/API/Node) and, finally, [`EventTarget`](/en-US/docs/Web/API/EventTarget).

Each level defines a key aspect of the utility of the element. From `Node`, the element inherits concepts surrounding the ability for the element to be contained by another element, and to contain other elements itself. Of special importance is what is gained by inheriting from `EventTarget`: the ability to receive and handle events such as mouse clicks, play and pause events, and so forth.

There are elements that share commonalities and thus have an additional intermediary type. For example, the [`<audio>`](/en-US/docs/Web/HTML/Reference/Elements/audio) and [`<video>`](/en-US/docs/Web/HTML/Reference/Elements/video) elements both present audiovisual media. The corresponding types, [`HTMLAudioElement`](/en-US/docs/Web/API/HTMLAudioElement) and [`HTMLVideoElement`](/en-US/docs/Web/API/HTMLVideoElement), are both based upon the common type [`HTMLMediaElement`](/en-US/docs/Web/API/HTMLMediaElement), which in turn is based upon [`HTMLElement`](/en-US/docs/Web/API/HTMLElement) and so forth. `HTMLMediaElement` defines the methods and properties held in common between audio and video elements.

These element-specific interfaces make up the majority of the HTML DOM API, and are the focus of this article. The [DOM](/en-US/docs/Web/API/Document_Object_Model) article provides a general introduction to the DOM and its concepts.

## [HTML DOM target audience](#html_dom_target_audience)

The features exposed by the HTML DOM are among the most commonly-used APIs in a web developer's toolkit.
All but the most simple web applications will use some features of the HTML DOM.

## [HTML DOM API interfaces](#html_dom_api_interfaces)

The majority of the interfaces that comprise the HTML DOM API map almost one-to-one to individual HTML elements, or to a small group of elements with similar functionality. In addition, the HTML DOM API includes a few interfaces and types to support the HTML element interfaces.

### [HTML element interfaces](#html_element_interfaces_2)

These interfaces represent specific HTML elements (or sets of related elements which have the same properties and methods associated with them).

- [`HTMLAnchorElement`](/en-US/docs/Web/API/HTMLAnchorElement)
- [`HTMLAreaElement`](/en-US/docs/Web/API/HTMLAreaElement)
- [`HTMLAudioElement`](/en-US/docs/Web/API/HTMLAudioElement)
- [`HTMLBaseElement`](/en-US/docs/Web/API/HTMLBaseElement)
- [`HTMLBodyElement`](/en-US/docs/Web/API/HTMLBodyElement)
- [`HTMLBRElement`](/en-US/docs/Web/API/HTMLBRElement)
- [`HTMLButtonElement`](/en-US/docs/Web/API/HTMLButtonElement)
- [`HTMLCanvasElement`](/en-US/docs/Web/API/HTMLCanvasElement)
- [`HTMLDataElement`](/en-US/docs/Web/API/HTMLDataElement)
- [`HTMLDataListElement`](/en-US/docs/Web/API/HTMLDataListElement)
- [`HTMLDetailsElement`](/en-US/docs/Web/API/HTMLDetailsElement)
- [`HTMLDialogElement`](/en-US/docs/Web/API/HTMLDialogElement)
- `HTMLDirectoryElement`
- [`HTMLDivElement`](/en-US/docs/Web/API/HTMLDivElement)
- [`HTMLDListElement`](/en-US/docs/Web/API/HTMLDListElement)
- [`HTMLElement`](/en-US/docs/Web/API/HTMLElement)
- [`HTMLEmbedElement`](/en-US/docs/Web/API/HTMLEmbedElement)
- [`HTMLFieldSetElement`](/en-US/docs/Web/API/HTMLFieldSetElement)
- [`HTMLFormElement`](/en-US/docs/Web/API/HTMLFormElement)
- [`HTMLHRElement`](/en-US/docs/Web/API/HTMLHRElement)
- [`HTMLHeadElement`](/en-US/docs/Web/API/HTMLHeadElement)
- [`HTMLHeadingElement`](/en-US/docs/Web/API/HTMLHeadingElement)
- [`HTMLHtmlElement`](/en-US/docs/Web/API/HTMLHtmlElement)
- [`HTMLIFrameElement`](/en-US/docs/Web/API/HTMLIFrameElement)
- [`HTMLImageElement`](/en-US/docs/Web/API/HTMLImageElement)
- [`HTMLInputElement`](/en-US/docs/Web/API/HTMLInputElement)
- [`HTMLLabelElement`](/en-US/docs/Web/API/HTMLLabelElement)
- [`HTMLLegendElement`](/en-US/docs/Web/API/HTMLLegendElement)
- [`HTMLLIElement`](/en-US/docs/Web/API/HTMLLIElement)
- [`HTMLLinkElement`](/en-US/docs/Web/API/HTMLLinkElement)
- [`HTMLMapElement`](/en-US/docs/Web/API/HTMLMapElement)
- [`HTMLMediaElement`](/en-US/docs/Web/API/HTMLMediaElement)
- [`HTMLMenuElement`](/en-US/docs/Web/API/HTMLMenuElement)
- [`HTMLMetaElement`](/en-US/docs/Web/API/HTMLMetaElement)
- [`HTMLMeterElement`](/en-US/docs/Web/API/HTMLMeterElement)
- [`HTMLModElement`](/en-US/docs/Web/API/HTMLModElement)
- [`HTMLObjectElement`](/en-US/docs/Web/API/HTMLObjectElement)
- [`HTMLOListElement`](/en-US/docs/Web/API/HTMLOListElement)
- [`HTMLOptGroupElement`](/en-US/docs/Web/API/HTMLOptGroupElement)
- [`HTMLOptionElement`](/en-US/docs/Web/API/HTMLOptionElement)
- [`HTMLOutputElement`](/en-US/docs/Web/API/HTMLOutputElement)
- [`HTMLParagraphElement`](/en-US/docs/Web/API/HTMLParagraphElement)
- [`HTMLPictureElement`](/en-US/docs/Web/API/HTMLPictureElement)
- [`HTMLPreElement`](/en-US/docs/Web/API/HTMLPreElement)
- [`HTMLProgressElement`](/en-US/docs/Web/API/HTMLProgressElement)
- [`HTMLQuoteElement`](/en-US/docs/Web/API/HTMLQuoteElement)
- [`HTMLScriptElement`](/en-US/docs/Web/API/HTMLScriptElement)
- [`HTMLSelectElement`](/en-US/docs/Web/API/HTMLSelectElement)
- [`HTMLSlotElement`](/en-US/docs/Web/API/HTMLSlotElement)
- [`HTMLSourceElement`](/en-US/docs/Web/API/HTMLSourceElement)
- [`HTMLSpanElement`](/en-US/docs/Web/API/HTMLSpanElement)
- [`HTMLStyleElement`](/en-US/docs/Web/API/HTMLStyleElement)
- [`HTMLTableCaptionElement`](/en-US/docs/Web/API/HTMLTableCaptionElement)
- [`HTMLTableCellElement`](/en-US/docs/Web/API/HTMLTableCellElement)
- [`HTMLTableColElement`](/en-US/docs/Web/API/HTMLTableColElement)
- [`HTMLTableElement`](/en-US/docs/Web/API/HTMLTableElement)
- [`HTMLTableRowElement`](/en-US/docs/Web/API/HTMLTableRowElement)
- [`HTMLTableSectionElement`](/en-US/docs/Web/API/HTMLTableSectionElement)
- [`HTMLTemplateElement`](/en-US/docs/Web/API/HTMLTemplateElement)
- [`HTMLTextAreaElement`](/en-US/docs/Web/API/HTMLTextAreaElement)
- [`HTMLTimeElement`](/en-US/docs/Web/API/HTMLTimeElement)
- [`HTMLTitleElement`](/en-US/docs/Web/API/HTMLTitleElement)
- [`HTMLTrackElement`](/en-US/docs/Web/API/HTMLTrackElement)
- [`HTMLUListElement`](/en-US/docs/Web/API/HTMLUListElement)
- [`HTMLUnknownElement`](/en-US/docs/Web/API/HTMLUnknownElement)
- [`HTMLVideoElement`](/en-US/docs/Web/API/HTMLVideoElement)

#### Deprecated HTML Element Interfaces

- [`HTMLMarqueeElement`](/en-US/docs/Web/API/HTMLMarqueeElement)

#### Obsolete HTML Element Interfaces

- [`HTMLFontElement`](/en-US/docs/Web/API/HTMLFontElement)
- `HTMLFrameElement`
- [`HTMLFrameSetElement`](/en-US/docs/Web/API/HTMLFrameSetElement)

### [Web app and browser integration interfaces](#web_app_and_browser_integration_interfaces)

These interfaces offer access to the browser window and document that contain the HTML, as well as to the browser's state, available plugins (if any), and various configuration options.

- [`BarProp`](/en-US/docs/Web/API/BarProp)
- [`Navigator`](/en-US/docs/Web/API/Navigator)
- [`Window`](/en-US/docs/Web/API/Window)

#### Obsolete web app and browser integration interfaces

- [`Plugin`](/en-US/docs/Web/API/Plugin)
- [`PluginArray`](/en-US/docs/Web/API/PluginArray)

### [Form support interfaces](#form_support_interfaces)

These interfaces provide structure and functionality required by the elements used to create and manage forms, including the [`<form>`](/en-US/docs/Web/HTML/Reference/Elements/form) and [`<input>`](/en-US/docs/Web/HTML/Reference/Elements/input) elements.

- [`FormDataEvent`](/en-US/docs/Web/API/FormDataEvent)
- [`HTMLFormControlsCollection`](/en-US/docs/Web/API/HTMLFormControlsCollection)
- [`HTMLOptionsCollection`](/en-US/docs/Web/API/HTMLOptionsCollection)
- [`RadioNodeList`](/en-US/docs/Web/API/RadioNodeList)
- [`ValidityState`](/en-US/docs/Web/API/ValidityState)

### [Canvas and image interfaces](#canvas_and_image_interfaces)

These interfaces represent objects used by the Canvas API as well as the [`<img>`](/en-US/docs/Web/HTML/Reference/Elements/img) element and [`<picture>`](/en-US/docs/Web/HTML/Reference/Elements/picture) elements.

- [`CanvasGradient`](/en-US/docs/Web/API/CanvasGradient)
- [`CanvasPattern`](/en-US/docs/Web/API/CanvasPattern)
- [`CanvasRenderingContext2D`](/en-US/docs/Web/API/CanvasRenderingContext2D)
- [`ImageBitmap`](/en-US/docs/Web/API/ImageBitmap)
- [`ImageBitmapRenderingContext`](/en-US/docs/Web/API/ImageBitmapRenderingContext)
- [`ImageData`](/en-US/docs/Web/API/ImageData)
- [`OffscreenCanvas`](/en-US/docs/Web/API/OffscreenCanvas)
- [`OffscreenCanvasRenderingContext2D`](/en-US/docs/Web/API/OffscreenCanvasRenderingContext2D)
- [`Path2D`](/en-US/docs/Web/API/Path2D)
- [`TextMetrics`](/en-US/docs/Web/API/TextMetrics)

### [Media interfaces](#media_interfaces)

The media interfaces provide HTML access to the contents of the media elements: [`<audio>`](/en-US/docs/Web/HTML/Reference/Elements/audio) and [`<video>`](/en-US/docs/Web/HTML/Reference/Elements/video).

- [`AudioTrack`](/en-US/docs/Web/API/AudioTrack)
- [`AudioTrackList`](/en-US/docs/Web/API/AudioTrackList)
- [`MediaError`](/en-US/docs/Web/API/MediaError)
- [`TextTrack`](/en-US/docs/Web/API/TextTrack)
- [`TextTrackCue`](/en-US/docs/Web/API/TextTrackCue)
- [`TextTrackCueList`](/en-US/docs/Web/API/TextTrackCueList)
- [`TextTrackList`](/en-US/docs/Web/API/TextTrackList)
- [`TimeRanges`](/en-US/docs/Web/API/TimeRanges)
- [`TrackEvent`](/en-US/docs/Web/API/TrackEvent)
- [`VideoTrack`](/en-US/docs/Web/API/VideoTrack)
- [`VideoTrackList`](/en-US/docs/Web/API/VideoTrackList)

### [Drag and drop interfaces](#drag_and_drop_interfaces)

These interfaces are used by the [HTML Drag and Drop API](/en-US/docs/Web/API/HTML_Drag_and_Drop_API) to represent individual draggable (or dragged) items, groups of dragged or draggable items, and to handle the drag and drop process.

- [`DataTransfer`](/en-US/docs/Web/API/DataTransfer)
- [`DataTransferItem`](/en-US/docs/Web/API/DataTransferItem)
- [`DataTransferItemList`](/en-US/docs/Web/API/DataTransferItemList)
- [`DragEvent`](/en-US/docs/Web/API/DragEvent)

### [Page history interfaces](#page_history_interfaces)

The History API interfaces let you access information about the browser's history, as well as to shift the browser's current tab forward and backward through that history.

- [`BeforeUnloadEvent`](/en-US/docs/Web/API/BeforeUnloadEvent)
- [`HashChangeEvent`](/en-US/docs/Web/API/HashChangeEvent)
- [`History`](/en-US/docs/Web/API/History)
- [`Location`](/en-US/docs/Web/API/Location)
- [`PageRevealEvent`](/en-US/docs/Web/API/PageRevealEvent)
- [`PageSwapEvent`](/en-US/docs/Web/API/PageSwapEvent)
- [`PageTransitionEvent`](/en-US/docs/Web/API/PageTransitionEvent)
- [`PopStateEvent`](/en-US/docs/Web/API/PopStateEvent)

### [Web Components interfaces](#web_components_interfaces)

These interfaces are used by the [Web Components API](/en-US/docs/Web/API/Web_components) to create and manage the available [custom elements](/en-US/docs/Web/API/Web_components/Using_custom_elements).

- [`CustomElementRegistry`](/en-US/docs/Web/API/CustomElementRegistry)

### [Miscellaneous and supporting interfaces](#miscellaneous_and_supporting_interfaces)

These supporting object types are used in a variety of ways in the HTML DOM API. In addition, [`PromiseRejectionEvent`](/en-US/docs/Web/API/PromiseRejectionEvent) represents the event delivered when a [JavaScript](/en-US/docs/Glossary/JavaScript) [`Promise`](/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) is rejected.

- [`DOMStringList`](/en-US/docs/Web/API/DOMStringList)
- [`DOMStringMap`](/en-US/docs/Web/API/DOMStringMap)
- [`ErrorEvent`](/en-US/docs/Web/API/ErrorEvent)
- [`HTMLAllCollection`](/en-US/docs/Web/API/HTMLAllCollection)
- [`MimeType`](/en-US/docs/Web/API/MimeType)
- [`MimeTypeArray`](/en-US/docs/Web/API/MimeTypeArray)
- [`PromiseRejectionEvent`](/en-US/docs/Web/API/PromiseRejectionEvent)

### [Interfaces belonging to other APIs](#interfaces_belonging_to_other_apis)

Several interfaces are technically defined in the HTML specification while actually being part of other APIs.

#### Web storage interfaces

The [Web Storage API](/en-US/docs/Web/API/Web_Storage_API "Web Storage API") provides the ability for websites to store data either temporarily or permanently on the user's device for later re-use.

- [`Storage`](/en-US/docs/Web/API/Storage)
- [`StorageEvent`](/en-US/docs/Web/API/StorageEvent)

#### Web Workers interfaces

These interfaces are used by the [Web Workers API](/en-US/docs/Web/API/Web_Workers_API "Web Workers API") both to establish the ability for workers to interact with an app and its content, but also to support messaging between windows or apps.

- [`BroadcastChannel`](/en-US/docs/Web/API/BroadcastChannel)
- [`DedicatedWorkerGlobalScope`](/en-US/docs/Web/API/DedicatedWorkerGlobalScope)
- [`MessageChannel`](/en-US/docs/Web/API/MessageChannel)
- [`MessageEvent`](/en-US/docs/Web/API/MessageEvent)
- [`MessagePort`](/en-US/docs/Web/API/MessagePort)
- [`SharedWorker`](/en-US/docs/Web/API/SharedWorker)
- [`SharedWorkerGlobalScope`](/en-US/docs/Web/API/SharedWorkerGlobalScope)
- [`Worker`](/en-US/docs/Web/API/Worker)
- [`WorkerGlobalScope`](/en-US/docs/Web/API/WorkerGlobalScope)
- [`WorkerLocation`](/en-US/docs/Web/API/WorkerLocation)
- [`WorkerNavigator`](/en-US/docs/Web/API/WorkerNavigator)

#### WebSocket interfaces

These interfaces, defined by the HTML specification, are used by the [WebSockets API](/en-US/docs/Web/API/WebSockets_API "WebSockets API").

- [`CloseEvent`](/en-US/docs/Web/API/CloseEvent)
- [`WebSocket`](/en-US/docs/Web/API/WebSocket)

#### Server-sent events interfaces

The [`EventSource`](/en-US/docs/Web/API/EventSource) interface represents the source which sent or is sending [server-sent events](/en-US/docs/Web/API/Server-sent_events "server-sent events").

- [`EventSource`](/en-US/docs/Web/API/EventSource)

## [Examples](#examples)

In this example, an [`<input>`](/en-US/docs/Web/HTML/Reference/Elements/input) element's [`input`](/en-US/docs/Web/API/Element/input_event "input") event is monitored in order to update the state of a form's "submit" button based on whether or not a given field currently has a value.

### [JavaScript](#javascript)

```
const nameField = document.getElementById("userName");
const sendButton = document.getElementById("sendButton");

sendButton.disabled = true;
// [note: this is disabled since it causes this article to always load with this example focused and scrolled into view]
// nameField.focus();

nameField.addEventListener("input", (event) => {
  const elem = event.target;
  const valid = elem.value.length !== 0;

  if (valid && sendButton.disabled) {
    sendButton.disabled = false;
  } else if (!valid && !sendButton.disabled) {
    sendButton.disabled = true;
  }
});
```

This code uses the [`Document`](/en-US/docs/Web/API/Document) interface's [`getElementById()`](/en-US/docs/Web/API/Document/getElementById "getElementById()") method to get the DOM object representing the [`<input>`](/en-US/docs/Web/HTML/Reference/Elements/input) elements whose IDs are `userName` and `sendButton`. With these, we can access the properties and methods that provide information about and grant control over these elements.

The [`HTMLInputElement`](/en-US/docs/Web/API/HTMLInputElement) object for the "Send" button's [`disabled`](/en-US/docs/Web/API/HTMLInputElement/disabled "disabled") property is set to `true`, which disables the "Send" button so it can't be clicked. In addition, the user name input field is made the active focus by calling the [`focus()`](/en-US/docs/Web/API/HTMLElement/focus "focus()") method it inherits from [`HTMLElement`](/en-US/docs/Web/API/HTMLElement).

Then [`addEventListener()`](/en-US/docs/Web/API/EventTarget/addEventListener "addEventListener()") is called to add a handler for the `input` event to the user name input. This code looks at the length of the current value of the input; if it's zero, then the "Send" button is disabled if it's not already disabled. Otherwise, the code ensures that the button is enabled.

With this in place, the "Send" button is always enabled whenever the user name input field has a value, and disabled when it's empty.

### [HTML](#html)

The HTML for the form looks like this:

```
<p>Please provide the information below. Items marked with "*" are required.</p>
<form action="" method="get">
  <p>
    <label for="userName" required>Your name:</label>
    <input type="text" id="userName" /> (*)
  </p>
  <p>
    <label for="userEmail">Email:</label>
    <input type="email" id="userEmail" />
  </p>
  <input type="submit" value="Send" id="sendButton" />
</form>
```

### [Result](#result)

## [Specifications](#specifications)

| Specification |
| --- |
| [HTML # htmlelement](https://html.spec.whatwg.org/multipage/dom.html#htmlelement) |

## [Browser compatibility](#browser_compatibility)

## [See also](#see_also)

### [References](#references)

- [HTML elements reference](/en-US/docs/Web/HTML/Reference/Elements)
- [HTML attribute reference](/en-US/docs/Web/HTML/Reference/Attributes)
- [Document Object Model (DOM)](/en-US/docs/Web/API/Document_Object_Model "Document Object Model (DOM)") reference

### [Guides](#guides)

- [DOM scripting introduction](/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting)
