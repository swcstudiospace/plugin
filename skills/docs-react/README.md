# docs-react

Exported documentation references.

- [page-1](references/001-page-1.md) — https://react.dev/reference/react/act.md
- [page-2](references/002-page-2.md) — https://react.dev/reference/react/apis.md
- [Streaming SSR](references/003-Streaming-SSR.md) — https://react.dev/reference/react/Suspense.md
- [Main content](references/004-Main-content.md) — https://react.dev/reference/react/Activity.md
- [page-5](references/005-page-5.md) — https://react.dev/reference/react/ViewTransition.md
- [` and `` DOM nodes appear as siblings without wrappers around them:```js
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

[Overview of all docs pages](/llms.txt)](references/006-and-DOM-nodes-appear-as-siblings-without-wrappers-around-the.md) — https://react.dev/reference/react/Fragment.md
- [page-7](references/007-page-7.md) — https://react.dev/reference/react/Profiler.md
- [Welcome to the {roomId} room!](references/008-Welcome-to-the-roomId-room.md) — https://react.dev/reference/react/StrictMode.md
- [page-9](references/009-page-9.md) — https://react.dev/reference/react/components.md
- [Checkout](references/010-Checkout.md) — https://react.dev/reference/react/useTransition.md
- [{isOnline ? '✅ Online' : '❌ Disconnected'}](references/011-isOnline-Online-Disconnected.md) — https://react.dev/reference/react/useSyncExternalStore.md
- [Your age: {age}](references/012-Your-age-age.md) — https://react.dev/reference/react/useState.md
- [page-13](references/013-page-13.md) — https://react.dev/reference/react/useMemo.md
- [page-14](references/014-page-14.md) — https://react.dev/reference/react/useOptimistic.md
- [Prague itinerary](references/015-Prague-itinerary.md) — https://react.dev/reference/react/useReducer.md
- [Time passed: {secondsPassed.toFixed(3)}](references/016-Time-passed-secondsPassed-toFixed-3.md) — https://react.dev/reference/react/useRef.md
- [page-17](references/017-page-17.md) — https://react.dev/reference/react/useInsertionEffect.md
- [page-18](references/018-page-18.md) — https://react.dev/reference/react/useLayoutEffect.md
- [Welcome to the {roomId} room!](references/019-Welcome-to-the-roomId-room.md) — https://react.dev/reference/react/useEffect.md
- [Counter: {count}setCount(0)}>Reset](references/020-Counter-count-setCount-0-Reset.md) — https://react.dev/reference/react/useEffectEvent.md
- [My app](references/021-My-app.md) — https://react.dev/reference/react/useId.md
- [page-22](references/022-page-22.md) — https://react.dev/reference/react/useImperativeHandle.md
- [{isOnline ? '✅ Online' : '❌ Disconnected'}](references/023-isOnline-Online-Disconnected.md) — https://react.dev/reference/react/useDebugValue.md
- [page-24](references/024-page-24.md) — https://react.dev/reference/react/useDeferredValue.md
- [page-25](references/025-page-25.md) — https://react.dev/reference/react/hooks.md
- [page-26](references/026-page-26.md) — https://react.dev/reference/react/useActionState.md
- [page-27](references/027-page-27.md) — https://react.dev/reference/react/useCallback.md
- [{title}](references/028-title.md) — https://react.dev/reference/react/useContext.md
- [page-29](references/029-page-29.md) — https://react.dev/reference/react.md
- [{isOnline ? '✅ Online' : '❌ Disconnected'}](references/030-isOnline-Online-Disconnected.md) — https://react.dev/learn/reusing-logic-with-custom-hooks.md
- [Welcome to the {roomId} room!](references/031-Welcome-to-the-roomId-room.md) — https://react.dev/learn/separating-events-from-effects.md
- [Welcome to the {roomId} room!](references/032-Welcome-to-the-roomId-room.md) — https://react.dev/learn/removing-effect-dependencies.md
- [Thanks for using our services!](references/033-Thanks-for-using-our-services.md) — https://react.dev/learn/you-might-not-need-an-effect.md
- [Welcome to the {roomId} room!](references/034-Welcome-to-the-roomId-room.md) — https://react.dev/learn/lifecycle-of-reactive-effects.md
- [Welcome to the chat!](references/035-Welcome-to-the-chat.md) — https://react.dev/learn/escape-hatches.md
- [Time passed: {secondsPassed.toFixed(3)}](references/036-Time-passed-secondsPassed-toFixed-3.md) — https://react.dev/learn/referencing-values-with-refs.md
- [page-37](references/037-page-37.md) — https://react.dev/learn/manipulating-the-dom-with-refs.md
- [Welcome to the chat!](references/038-Welcome-to-the-chat.md) — https://react.dev/learn/synchronizing-with-effects.md
- [Day off in Kyoto](references/039-Day-off-in-Kyoto.md) — https://react.dev/learn/scaling-up-with-reducer-and-context.md
- [{children}](references/040-children.md) — https://react.dev/learn/passing-data-deeply-with-context.md
- [{score}](references/041-score.md) — https://react.dev/learn/preserving-and-resetting-state.md
- [Prague itinerary](references/042-Prague-itinerary.md) — https://react.dev/learn/extracting-state-logic-into-a-reducer.md
- [That's right!](references/043-That-s-right.md) — https://react.dev/learn/reacting-to-input-with-state.md
- [Thanks for feedback!](references/044-Thanks-for-feedback.md) — https://react.dev/learn/choosing-the-state-structure.md
- [page-45](references/045-page-45.md) — https://react.dev/learn/sharing-state-between-components.md
- [page-46](references/046-page-46.md) — https://react.dev/learn/updating-objects-in-state.md
- [Inspiring sculptors:](references/047-Inspiring-sculptors.md) — https://react.dev/learn/updating-arrays-in-state.md
- [That's right!](references/048-That-s-right.md) — https://react.dev/learn/managing-state.md
- [{number}](references/049-number.md) — https://react.dev/learn/queueing-a-series-of-state-updates.md
- [Your message is on its way!](references/050-Your-message-is-on-its-way.md) — https://react.dev/learn/state-as-a-snapshot.md
- [Inspiring Sculptures](references/051-Inspiring-Sculptures.md) — https://react.dev/learn/render-and-commit.md
- [Hi, {firstName} {lastName}](references/052-Hi-firstName-lastName.md) — https://react.dev/learn/state-a-components-memory.md
- [{text}](references/053-text.md) — https://react.dev/learn/understanding-your-ui-as-a-tree.md
- [Spiced Chai Recipe](references/054-Spiced-Chai-Recipe.md) — https://react.dev/learn/keeping-components-pure.md
- [page-55](references/055-page-55.md) — https://react.dev/learn/adding-interactivity.md
- [page-56](references/056-page-56.md) — https://react.dev/learn/responding-to-events.md
- [Sally Ride's Packing List](references/057-Sally-Ride-s-Packing-List.md) — https://react.dev/learn/conditional-rendering.md
- [{person.name}](references/058-person-name.md) — https://react.dev/learn/rendering-lists.md
- [Amazing scientists](references/059-Amazing-scientists.md) — https://react.dev/learn/importing-and-exporting-components.md
- [Hedy Lamarr's Todos](references/060-Hedy-Lamarr-s-Todos.md) — https://react.dev/learn/writing-markup-with-jsx.md
- [{time}](references/061-time.md) — https://react.dev/learn/passing-props-to-a-component.md
- [`:```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return ({name}'s To Do List);
}
```Try changing the `name`'s value from `'Gregorio Y. Zara'` to `'Hedy Lamarr'`. See how the list title changes?

Any JavaScript expression will work between curly braces, including function calls like `formatDate()`:```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (To Do List for {formatDate(today)});
}
```### Where to use curly braces {/*where-to-use-curly-braces*/}

You can only use curly braces in two ways inside JSX:

1. **As text** directly inside a JSX tag: `{name}'s To Do List` works, but `<{tag}>Gregorio Y. Zara's To Do List`  will not.
2. **As attributes** immediately following the `=` sign: `src={avatar}` will read the `avatar` variable, but `src="{avatar}"` will pass the string `"{avatar}"`.

## Using "double curlies": CSS and other objects in JSX {/*using-double-curlies-css-and-other-objects-in-jsx*/}

In addition to strings, numbers, and other JavaScript expressions, you can even pass objects in JSX. Objects are also denoted with curly braces, like `{ name: "Hedy Lamarr", inventions: 5 }`. Therefore, to pass a JS object in JSX, you must wrap the object in another pair of curly braces: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

You may see this with inline CSS styles in JSX. React does not require you to use inline styles (CSS classes work great for most cases). But when you need an inline style, you pass an object to the `style` attribute:```js
export default function TodoList() {
  return (Improve the videophonePrepare aeronautics lecturesWork on the alcohol-fuelled engine);
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```Try changing the values of `backgroundColor` and `color`.

You can really see the JavaScript object inside the curly braces when you write it like this:

```js {2-5}```

The next time you see `{{` and `}}` in JSX, know that it's nothing more than an object inside the JSX curlies!Inline `style` properties are written in camelCase. For example, HTML `` would be written as ``  in your component.## More fun with JavaScript objects and curly braces {/*more-fun-with-javascript-objects-and-curly-braces*/}

You can move several expressions into one object, and reference them in your JSX inside curly braces:```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return ({person.name}'s TodosImprove the videophonePrepare aeronautics lecturesWork on the alcohol-fuelled engine);
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```In this example, the `person` JavaScript object contains a `name` string and a `theme` object:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

The component can use these values from `person` like so:

```js{person.name}'s Todos```

JSX is very minimal as a templating language because it lets you organize data and logic using JavaScript.Now you know almost everything about JSX:

* JSX attributes inside quotes are passed as strings.
* Curly braces let you bring JavaScript logic and variables into your markup.
* They work inside the JSX tag content or immediately after `=` in attributes.
* `{{` and `}}` is not special syntax: it's a JavaScript object tucked inside JSX curly braces.#### Fix the mistake {/*fix-the-mistake*/}

This code crashes with an error saying `Objects are not valid as a React child`:```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return ({person}'s TodosImprove the videophonePrepare aeronautics lecturesWork on the alcohol-fuelled engine);
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```Can you find the problem?Look for what's inside the curly braces. Are we putting the right thing there?This is happening because this example renders *an object itself* into the markup rather than a string: `{person}'s Todos` is trying to render the entire `person` object! Including raw objects as text content throws an error because React doesn't know how you want to display them.

To fix it, replace `{person}'s Todos` with `{person.name}'s Todos`:```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return ({person.name}'s TodosImprove the videophonePrepare aeronautics lecturesWork on the alcohol-fuelled engine);
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```#### Extract information into an object {/*extract-information-into-an-object*/}

Extract the image URL into the `person` object.```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return ({person.name}'s TodosImprove the videophonePrepare aeronautics lecturesWork on the alcohol-fuelled engine);
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```Move the image URL into a property called `person.imageUrl` and read it from the `` tag using the curlies:```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://react.dev/images/docs/scientists/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return ({person.name}'s TodosImprove the videophonePrepare aeronautics lecturesWork on the alcohol-fuelled engine);
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```#### Write an expression inside JSX curly braces {/*write-an-expression-inside-jsx-curly-braces*/}

In the object below, the full image URL is split into four parts: base URL, `imageId`, `imageSize`, and file extension.

We want the image URL to combine these attributes together: base URL (always `'https://react.dev/images/docs/scientists/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`), and file extension (always `'.jpg'`). However, something is wrong with how the `` tag specifies its `src`.

Can you fix it?```js

const baseUrl = 'https://react.dev/images/docs/scientists/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return ({person.name}'s TodosImprove the videophonePrepare aeronautics lecturesWork on the alcohol-fuelled engine);
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```To check that your fix worked, try changing the value of `imageSize` to `'b'`. The image should resize after your edit.You can write it as `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` opens the JavaScript expression
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` produces the correct URL string
3. `}` closes the JavaScript expression```js
const baseUrl = 'https://react.dev/images/docs/scientists/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return ({person.name}'s TodosImprove the videophonePrepare aeronautics lecturesWork on the alcohol-fuelled engine);
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```You can also move this expression into a separate function like `getImageUrl` below:```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return ({person.name}'s TodosImprove the videophonePrepare aeronautics lecturesWork on the alcohol-fuelled engine);
}
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```Variables and functions can help you keep the markup simple!---

## Sitemap

[Overview of all docs pages](/llms.txt)](references/062-js-export-default-function-TodoList-const-name-Gregorio-Y-Za.md) — https://react.dev/learn/javascript-in-jsx-with-curly-braces.md
- [Amazing scientists](references/063-Amazing-scientists.md) — https://react.dev/learn/describing-the-ui.md
- [` and `](references/064-and.md) — https://react.dev/learn/your-first-component.md
- [page-65](references/065-page-65.md) — https://react.dev/learn/react-compiler/introduction.md
- [page-66](references/066-page-66.md) — https://react.dev/learn/react-compiler/installation.md
- [page-67](references/067-page-67.md) — https://react.dev/learn/react-compiler/debugging.md
- [page-68](references/068-page-68.md) — https://react.dev/learn/react-compiler/incremental-adoption.md
- [Yarn](references/069-Yarn.md) — https://react.dev/learn/react-developer-tools.md
- [page-70](references/070-page-70.md) — https://react.dev/learn/react-compiler.md
- [My app](references/071-My-app.md) — https://react.dev/learn/add-react-to-an-existing-project.md
- [page-72](references/072-page-72.md) — https://react.dev/learn/setup.md
- [Welcome to my app](references/073-Welcome-to-my-app.md) — https://react.dev/learn/typescript.md
- [page-74](references/074-page-74.md) — https://react.dev/learn/editor-setup.md
- [page-75](references/075-page-75.md) — https://react.dev/learn/creating-a-react-app.md
- [page-76](references/076-page-76.md) — https://react.dev/learn/build-a-react-app-from-scratch.md
- [Quick Start – React](references/077-Quick-Start-React.md) — https://react.dev/learn
- [page-78](references/078-page-78.md) — https://react.dev/learn/tutorial-tic-tac-toe.md
- [Hello, {name}](references/079-Hello-name.md) — https://react.dev/learn/installation.md
- [page-80](references/080-page-80.md) — https://react.dev/learn/thinking-in-react.md
