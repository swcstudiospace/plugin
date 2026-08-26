# ` and `` DOM nodes appear as siblings without wrappers around them:```js
export default function Blog() {
  return (
    <>)
}

function Post({ title, body }) {
  return (
    <>);
}

function PostTitle({ title }) {
  return{title}}

function PostBody({ body }) {
  return ({body});
}
```#### How to write a Fragment without the special syntax? {/*how-to-write-a-fragment-without-the-special-syntax*/}

The example above is equivalent to importing `Fragment` from React:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return ();
}
```

Usually you won't need this unless you need to [pass a `key` to your `Fragment`.](#rendering-a-list-of-fragments)---

### Assigning multiple elements to a variable {/*assigning-multiple-elements-to-a-variable*/}

Like any other element, you can assign Fragment elements to variables, pass them as props, and so on:

```js
function CloseDialog() {
  const buttons = (
    <>);
  return (Are you sure you want to leave this page?);
}
```

---

### Grouping elements with text {/*grouping-elements-with-text*/}

You can use `Fragment` to group text together with components:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      Fromto);
}
```

---

### Rendering a list of Fragments {/*rendering-a-list-of-fragments*/}

Here's a situation where you need to write `Fragment` explicitly instead of using the `<>` syntax. When you [render multiple elements in a loop](/learn/rendering-lists), you need to assign a `key` to each element. If the elements within the loop are Fragments, you need to use the normal JSX element syntax in order to provide the `key` attribute:

```js {3,6}
function Blog() {
  return posts.map(post =>);
}
```

You can inspect the DOM to verify that there are no wrapper elements around the Fragment children:```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>);
}

function PostTitle({ title }) {
  return{title}}

function PostBody({ body }) {
  return ({body});
}
```---

###Adding event listeners without a wrapper element {/*adding-event-listeners-without-wrapper*/}

Fragment `ref`s let you add event listeners to a group of elements without adding a wrapper DOM node. Use a [ref callback](/reference/react-dom/components/common#ref-callback) to attach and clean up listeners:```js
import { Fragment, useState, useRef, useEffect } from 'react';

function ClickableFragment({ children, onClick }) {
  const fragmentRef = useRef(null);
  useEffect(() => {
    const fragmentInstance = fragmentRef.current;
    if (fragmentInstance === null) {
      return;
    }
    fragmentInstance.addEventListener('click', onClick);
    return () => {
      fragmentInstance.removeEventListener(
        'click',
        onClick
      );
    };
  }, [onClick])
  return ({children});
}

export default function App() {
  const [clicks, setClicks] = useState(0);

  return (
    <>Total clicks: {clicks}{
        setClicks(c => c + 1);
      }}>Button AButton BButton C);
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```The `addEventListener` call applies the listener to every first-level DOM child of the Fragment. When children are dynamically added or removed, the `FragmentInstance` automatically adds or removes the listener.#### Which children does a Fragment ref target? {/*which-children-does-a-fragment-ref-target*/}

A `FragmentInstance` targets the **first-level host (DOM) children** of the Fragment. Consider this tree:

```js```

`Wrapper` is a React component, so the `FragmentInstance` looks through it to find DOM nodes. The targeted children are `A`, `B`, and `D`. `C` is not targeted because it is nested inside the DOM element `B`.

Methods like `addEventListener`, `observeUsing`, and `getClientRects` operate on these first-level DOM children. `focus` and `focusLast` are different—they search *all* nested children depth-first to find focusable elements.---

###Managing focus across a group of elements {/*managing-focus-across-elements*/}

Fragment `ref`s provide `focus`, `focusLast`, and `blur` methods that operate across all DOM nodes within the Fragment:```js
import { Fragment, useRef } from 'react';

function FormFields({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>{
          fragmentRef.current.focus();
        }}>
          Focus first{
          fragmentRef.current.focusLast();
        }}>
          Focus last{
          fragmentRef.current.blur();
        }}>
          Blur{children});
}

// Even though the inputs are deeply nested,
// focus() searches depth-first to find them.
export default function App() {
  return (ShippingStreet:City:);
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

label {
  display: inline-block;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```Calling `focus()` focuses the `street` input—even though it is nested inside a `` and ``. `focus()` searches depth-first through all nested children, not just direct children of the Fragment. `focusLast()` does the same in reverse, and `blur()` removes focus if the currently focused element is within the Fragment.

---

###Scrolling a group of elements into view {/*scrolling-group-into-view*/}

Use `scrollIntoView` to scroll a Fragment's children into view without a wrapper element. Pass `true` (or omit the argument) to scroll the first child to the top. Pass `false` to scroll the last child to the bottom:```js
import { Fragment, useRef } from 'react';

function ScrollableSection({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>{
          fragmentRef.current.scrollIntoView();
        }}>
          Scroll to top{
          fragmentRef.current.scrollIntoView(false);
        }}>
          Scroll to bottom{children});
}

const items = [];
for (let i = 1; i <= 25; i++) {
  items.push('Item ' + i);
}

export default function App() {
  return (Section Start{items.map((item) => ({item}))}Section End);
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.container {
  height: 200px;
  overflow-y: auto;
  border: 2px solid #c4c4c4;
  border-radius: 4px;
  padding: 10px;
}

h3 {
  margin: 4px 0;
  /* Padding to handle offset of global sticky nav when scrolling for example */
  padding-top: 4em;
  color: #1a73e8;
}

p {
  margin: 4px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```---

###Observing visibility without a wrapper element {/*observing-visibility-without-wrapper*/}

Use `observeUsing` to attach an `IntersectionObserver` to all first-level DOM children of a Fragment. This lets you track visibility without requiring child components to expose `ref`s or adding a wrapper element:```js
import {
  Fragment,
  useRef,
  useLayoutEffect,
  useState,
} from 'react';
import Card from './Card';

function VisibleGroup({ onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const visibleElements = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleElements.add(e.target);
          } else {
            visibleElements.delete(e.target);
          }
        });
        onVisibilityChange(visibleElements.size > 0);
      }
    );
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
    };
  }, [onVisibilityChange]);

  return ({children});
}

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (Scroll downScroll up);
}
```

```css
.page {
  transition: background 0.3s;
}

.page.visible {
  background: #d4edda;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}
```

```js src/Card.js hidden
export default function Card({ title }) {
  return{title};
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```---

###Caching a global IntersectionObserver {/*caching-global-intersection-observer*/}

A common performance optimization for sites with many observers is to share a single IntersectionObserver per config and route its entries to the correct callbacks based on which element intersected. Fragment `ref`s support this same pattern through the `reactFragments` property.

Each first-level DOM child of a Fragment with a `ref` has a `reactFragments` property: a `Set` of `FragmentInstance` objects that contain that element. When the shared observer fires, you can use this property to look up which `FragmentInstance` owns the intersecting element and run the right callbacks.```js src/App.js active
import { useState, useCallback } from 'react';
import ObservedGroup from './ObservedGroup';
import Card from './Card';

export default function App() {
  const [bgColor, setBgColor] = useState(null);

  const onGreen = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#d4edda');
    }
  }, []);

  const onBlue = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#cce5ff');
    }
  }, []);

  return (Scroll downScroll up);
}
```

```js src/ObservedGroup.js
import {
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';

const callbackMap = new WeakMap();
const observerCache = new Map();

function getOptionsKey(options) {
  const root = options?.root ?? null;
  const rootMargin = options?.rootMargin ?? '0px';
  const threshold = options?.threshold ?? 0;
  return `${rootMargin}|${threshold}`;
}

function getSharedObserver(
  fragmentInstance,
  onIntersection,
  options,
) {
  // Register this callback for the
  // fragment instance.
  const existing =
    callbackMap.get(fragmentInstance);
  callbackMap.set(
    fragmentInstance,
    existing
      ? [...existing, onIntersection]
      : [onIntersection],
  );

  const key = getOptionsKey(options);
  if (observerCache.has(key)) {
    return observerCache.get(key);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Look up which FragmentInstances own
        // this element.
        const fragmentInstances =
          entry.target.reactFragments;
        if (fragmentInstances) {
          for (const inst of fragmentInstances) {
            const callbacks =
              callbackMap.get(inst) || [];
            callbacks.forEach(cb => cb(entry));
          }
        }
      }
    },
    options,
  );

  observerCache.set(key, observer);
  return observer;
}

export default function ObservedGroup({
  onIntersection,
  options,
  children,
}) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const fragmentInstance = fragmentRef.current;
    const observer = getSharedObserver(
      fragmentInstance,
      onIntersection,
      options,
    );
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
      callbackMap.delete(fragmentInstance);
    };
  }, [onIntersection, options]);

  return ({children});
}
```

```css
.page {
  transition: background 0.3s;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 0 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}

.card.green {
  border-left: 3px solid #28a745;
}

.card.blue {
  border-left: 3px solid #007bff;
}
```

```js src/Card.js hidden
export default function Card({ title, className }) {
  return{title};
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```Multiple `ObservedGroup` components with the same options reuse a single `IntersectionObserver`. When either section scrolls into view, the shared observer fires and uses `reactFragments` to route the entry to the correct callback.

---

## Sitemap

[Overview of all docs pages](/llms.txt)

Source: https://react.dev/reference/react/Fragment.md

` DOM nodes appear as siblings without wrappers around them:
```js
export default function Blog() {
return (
<>

)
}
function Post({ title, body }) {
return (
<>

);
}
function PostTitle({ title }) {
return

# {title}

}
function PostBody({ body }) {
return (

{body}

);
}
```

#### How to write a Fragment without the special syntax? {/\*how-to-write-a-fragment-without-the-special-syntax\*/}
The example above is equivalent to importing `Fragment` from React:
```js {1,5,8}
import { Fragment } from 'react';
function Post() {
return (

);
}
```
Usually you won't need this unless you need to [pass a `key` to your `Fragment`.](#rendering-a-list-of-fragments)
---
### Assigning multiple elements to a variable {/\*assigning-multiple-elements-to-a-variable\*/}
Like any other element, you can assign Fragment elements to variables, pass them as props, and so on:
```js
function CloseDialog() {
const buttons = (
<>

);
return (
Are you sure you want to leave this page?
);
}
```
---
### Grouping elements with text {/\*grouping-elements-with-text\*/}
You can use `Fragment` to group text together with components:
```js
function DateRangePicker({ start, end }) {
return (
<>
From
to
);
}
```
---
### Rendering a list of Fragments {/\*rendering-a-list-of-fragments\*/}
Here's a situation where you need to write `Fragment` explicitly instead of using the `<>` syntax. When you [render multiple elements in a loop](/learn/rendering-lists), you need to assign a `key` to each element. If the elements within the loop are Fragments, you need to use the normal JSX element syntax in order to provide the `key` attribute:
```js {3,6}
function Blog() {
return posts.map(post =>

);
}
```
You can inspect the DOM to verify that there are no wrapper elements around the Fragment children:
```js
import { Fragment } from 'react';
const posts = [
{ id: 1, title: 'An update', body: "It's been a while since I posted..." },
{ id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];
export default function Blog() {
return posts.map(post =>

);
}
function PostTitle({ title }) {
return

# {title}

}
function PostBody({ body }) {
return (

{body}

);
}
```
---
###  Adding event listeners without a wrapper element {/\*adding-event-listeners-without-wrapper\*/}
Fragment `ref`s let you add event listeners to a group of elements without adding a wrapper DOM node. Use a [ref callback](/reference/react-dom/components/common#ref-callback) to attach and clean up listeners:
```js
import { Fragment, useState, useRef, useEffect } from 'react';
function ClickableFragment({ children, onClick }) {
const fragmentRef = useRef(null);
useEffect(() => {
const fragmentInstance = fragmentRef.current;
if (fragmentInstance === null) {
return;
}
fragmentInstance.addEventListener('click', onClick);
return () => {
fragmentInstance.removeEventListener(
'click',
onClick
);
};
}, [onClick])
return (
{children}
);
}
export default function App() {
const [clicks, setClicks] = useState(0);
return (
<>

Total clicks: {clicks}

 {
setClicks(c => c + 1);
}}>
Button A
Button B
Button C
);
}
```
```json package.json hidden
{
"dependencies": {
"react": "canary",
"react-dom": "canary",
"react-scripts": "latest"
}
}
```
The `addEventListener` call applies the listener to every first-level DOM child of the Fragment. When children are dynamically added or removed, the `FragmentInstance` automatically adds or removes the listener.
#### Which children does a Fragment ref target? {/\*which-children-does-a-fragment-ref-target\*/}
A `FragmentInstance` targets the \*\*first-level host (DOM) children\*\* of the Fragment. Consider this tree:
```js
```
`Wrapper` is a React component, so the `FragmentInstance` looks through it to find DOM nodes. The targeted children are `A`, `B`, and `D`. `C` is not targeted because it is nested inside the DOM element `B`.
Methods like `addEventListener`, `observeUsing`, and `getClientRects` operate on these first-level DOM children. `focus` and `focusLast` are different—they search \*all\* nested children depth-first to find focusable elements.
---
###  Managing focus across a group of elements {/\*managing-focus-across-elements\*/}
Fragment `ref`s provide `focus`, `focusLast`, and `blur` methods that operate across all DOM nodes within the Fragment:
```js
import { Fragment, useRef } from 'react';
function FormFields({ children }) {
const fragmentRef = useRef(null);
return (
<>

{
fragmentRef.current.focus();
}}>
Focus first
 {
fragmentRef.current.focusLast();
}}>
Focus last
 {
fragmentRef.current.blur();
}}>
Blur

{children}
);
}
// Even though the inputs are deeply nested,
// focus() searches depth-first to find them.
export default function App() {
return (

Shipping

Street:

City:
);
}
```
```css
.buttons {
display: flex;
gap: 8px;
margin-bottom: 10px;
}
label {
display: inline-block;
}
```
```json package.json hidden
{
"dependencies": {
"react": "canary",
"react-dom": "canary",
"react-scripts": "latest"
}
}
```
Calling `focus()` focuses the `street` input—even though it is nested inside a `` and ``. `focus()` searches depth-first through all nested children, not just direct children of the Fragment. `focusLast()` does the same in reverse, and `blur()` removes focus if the currently focused element is within the Fragment.
---
###  Scrolling a group of elements into view {/\*scrolling-group-into-view\*/}
Use `scrollIntoView` to scroll a Fragment's children into view without a wrapper element. Pass `true` (or omit the argument) to scroll the first child to the top. Pass `false` to scroll the last child to the bottom:
```js
import { Fragment, useRef } from 'react';
function ScrollableSection({ children }) {
const fragmentRef = useRef(null);
return (
<>

{
fragmentRef.current.scrollIntoView();
}}>
Scroll to top
 {
fragmentRef.current.scrollIntoView(false);
}}>
Scroll to bottom

{children}

);
}
const items = [];
for (let i = 1; i <= 25; i++) {
items.push('Item ' + i);
}
export default function App() {
return (

### Section Start

{items.map((item) => (

{item}

))}

### Section End

);
}
```
```css
.buttons {
display: flex;
gap: 8px;
margin-bottom: 10px;
}
.container {
height: 200px;
overflow-y: auto;
border: 2px solid #c4c4c4;
border-radius: 4px;
padding: 10px;
}
h3 {
margin: 4px 0;
/\* Padding to handle offset of global sticky nav when scrolling for example \*/
padding-top: 4em;
color: #1a73e8;
}
p {
margin: 4px 0;
}
```
```json package.json hidden
{
"dependencies": {
"react": "canary",
"react-dom": "canary",
"react-scripts": "latest"
}
}
```
---
###  Observing visibility without a wrapper element {/\*observing-visibility-without-wrapper\*/}
Use `observeUsing` to attach an `IntersectionObserver` to all first-level DOM children of a Fragment. This lets you track visibility without requiring child components to expose `ref`s or adding a wrapper element:
```js
import {
Fragment,
useRef,
useLayoutEffect,
useState,
} from 'react';
import Card from './Card';
function VisibleGroup({ onVisibilityChange, children }) {
const fragmentRef = useRef(null);
useLayoutEffect(() => {
const visibleElements = new Set();
const observer = new IntersectionObserver(
(entries) => {
entries.forEach(e => {
if (e.isIntersecting) {
visibleElements.add(e.target);
} else {
visibleElements.delete(e.target);
}
});
onVisibilityChange(visibleElements.size > 0);
}
);
const fragmentInstance = fragmentRef.current;
fragmentInstance.observeUsing(observer);
return () => {
fragmentInstance.unobserveUsing(observer);
};
}, [onVisibilityChange]);
return (
{children}
);
}
export default function App() {
const [isVisible, setIsVisible] = useState(true);
return (

Scroll down

Scroll up

);
}
```
```css
.page {
transition: background 0.3s;
}
.page.visible {
background: #d4edda;
}
.filler {
height: 500px;
display: flex;
align-items: center;
justify-content: center;
color: #aaa;
font-size: 14px;
}
.card {
padding: 16px;
background: white;
border: 1px solid #ddd;
border-radius: 8px;
margin: 8px 16px;
box-shadow: 0 1px 3px rgba(0,0,0,0.08);
font-weight: 600;
font-size: 14px;
}
```
```js src/Card.js hidden
export default function Card({ title }) {
return

{title}

;
}
```
```json package.json hidden
{
"dependencies": {
"react": "canary",
"react-dom": "canary",
"react-scripts": "latest"
}
}
```
---
###  Caching a global IntersectionObserver {/\*caching-global-intersection-observer\*/}
A common performance optimization for sites with many observers is to share a single IntersectionObserver per config and route its entries to the correct callbacks based on which element intersected. Fragment `ref`s support this same pattern through the `reactFragments` property.
Each first-level DOM child of a Fragment with a `ref` has a `reactFragments` property: a `Set` of `FragmentInstance` objects that contain that element. When the shared observer fires, you can use this property to look up which `FragmentInstance` owns the intersecting element and run the right callbacks.
```js src/App.js active
import { useState, useCallback } from 'react';
import ObservedGroup from './ObservedGroup';
import Card from './Card';
export default function App() {
const [bgColor, setBgColor] = useState(null);
const onGreen = useCallback((entry) => {
if (entry.isIntersecting) {
setBgColor('#d4edda');
}
}, []);
const onBlue = useCallback((entry) => {
if (entry.isIntersecting) {
setBgColor('#cce5ff');
}
}, []);
return (

Scroll down

Scroll up

);
}
```
```js src/ObservedGroup.js
import {
Fragment,
useRef,
useLayoutEffect,
} from 'react';
const callbackMap = new WeakMap();
const observerCache = new Map();
function getOptionsKey(options) {
const root = options?.root ?? null;
const rootMargin = options?.rootMargin ?? '0px';
const threshold = options?.threshold ?? 0;
return `${rootMargin}|${threshold}`;
}
function getSharedObserver(
fragmentInstance,
onIntersection,
options,
) {
// Register this callback for the
// fragment instance.
const existing =
callbackMap.get(fragmentInstance);
callbackMap.set(
fragmentInstance,
existing
? [...existing, onIntersection]
: [onIntersection],
);
const key = getOptionsKey(options);
if (observerCache.has(key)) {
return observerCache.get(key);
}
const observer = new IntersectionObserver(
(entries) => {
for (const entry of entries) {
// Look up which FragmentInstances own
// this element.
const fragmentInstances =
entry.target.reactFragments;
if (fragmentInstances) {
for (const inst of fragmentInstances) {
const callbacks =
callbackMap.get(inst) || [];
callbacks.forEach(cb => cb(entry));
}
}
}
},
options,
);
observerCache.set(key, observer);
return observer;
}
export default function ObservedGroup({
onIntersection,
options,
children,
}) {
const fragmentRef = useRef(null);
useLayoutEffect(() => {
const fragmentInstance = fragmentRef.current;
const observer = getSharedObserver(
fragmentInstance,
onIntersection,
options,
);
fragmentInstance.observeUsing(observer);
return () => {
fragmentInstance.unobserveUsing(observer);
callbackMap.delete(fragmentInstance);
};
}, [onIntersection, options]);
return (
{children}
);
}
```
```css
.page {
transition: background 0.3s;
}
.filler {
height: 500px;
display: flex;
align-items: center;
justify-content: center;
color: #aaa;
font-size: 14px;
}
.card {
padding: 16px;
background: white;
border: 1px solid #ddd;
border-radius: 8px;
margin: 0 16px;
box-shadow: 0 1px 3px rgba(0,0,0,0.08);
font-weight: 600;
font-size: 14px;
}
.card.green {
border-left: 3px solid #28a745;
}
.card.blue {
border-left: 3px solid #007bff;
}
```
```js src/Card.js hidden
export default function Card({ title, className }) {
return

{title}

;
}
```
```json package.json hidden
{
"dependencies": {
"react": "canary",
"react-dom": "canary",
"react-scripts": "latest"
}
}
```
Multiple `ObservedGroup` components with the same options reuse a single `IntersectionObserver`. When either section scrolls into view, the shared observer fires and uses `reactFragments` to route the entry to the correct callback.
---
## Sitemap
[Overview of all docs pages](/llms.txt)
