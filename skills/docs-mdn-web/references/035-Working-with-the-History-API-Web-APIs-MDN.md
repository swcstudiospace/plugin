# Working with the History API - Web APIs | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API

## [Single-page applications and session history](#single-page_applications_and_session_history)

Traditionally, websites are implemented as a collection of pages. When users navigate to different parts of the site by clicking links, the browser loads a whole new page each time.

While this is great for many sites, it can have some disadvantages:

- It can be inefficient to load a whole page every time, when only part of the page needs to be updated.
- It is hard to maintain application state when navigating across pages.

For these reasons, a popular pattern for web apps is the [single-page application](/en-US/docs/Glossary/SPA) (SPA). When a user clicks a link, the SPA performs the following steps:

1. Prevents the default behavior of loading a new page.
2. [Fetches](/en-US/docs/Web/API/Window/fetch "Fetches") new content to display.
3. Updates the page with the new content.

For example:

```
document.addEventListener("click", async (event) => {
  const creature = event.target.getAttribute("data-creature");
  if (creature) {
    // Prevent a new page from loading
    event.preventDefault();
    try {
      // Fetch new content
      const response = await fetch(`creatures/${creature}.json`);
      const result = await response.json();
      // Update the page with the new content
      displayContent(result);
    } catch (err) {
      console.error(err);
    }
  }
});
```

In this click handler, if the link contains a data attribute `"data-creature"`, then we use the value of that attribute to fetch a JSON file containing the new content for the page.

The JSON file might look like this:

```
{
  "description": "Bald eagles are not actually bald.",
  "image": {
    "src": "images/eagle.jpg",
    "alt": "A bald eagle"
  },
  "name": "Eagle"
}
```

Our `displayContent()` function updates the page with the JSON:

```
// Update the page with the new content
function displayContent(content) {
  document.title = `Creatures: ${content.name}`;

  const description = document.querySelector("#description");
  description.textContent = content.description;

  const photo = document.querySelector("#photo");
  photo.setAttribute("src", content.image.src);
  photo.setAttribute("alt", content.image.alt);
}
```

The problem is that it breaks the expected behavior of the browser's "Back" and "Forward" buttons.

From the user's point of view, they clicked a link and the page updated, so it looks like a new page. If they then press the browser's "Back" button, they expect to go to the state before they clicked the link.

But as far as the browser is concerned, the last link didn't load a new page, so "Back" will take the browser to whichever page was loaded before the user opened the SPA.

This is essentially the problem that `pushState()`, `replaceState()`, and the `popstate` event solve. They enable us to synthesize history entries, and to be notified when the current session history entry changes to one of these entries (for example, because the user pressed the "Back" or "Forward" buttons).

## [Using `pushState()`](#using_pushstate)

We can add a history entry to the click handler above as follows:

```
document.addEventListener("click", async (event) => {
  const creature = event.target.getAttribute("data-creature");
  if (creature) {
    event.preventDefault();
    try {
      const response = await fetch(`creatures/${creature}.json`);
      const result = await response.json();
      displayContent(result);
      // Add a new entry to the history.
      // This simulates loading a new page.
      history.pushState(result, "", creature);
    } catch (err) {
      console.error(err);
    }
  }
});
```

Here, we're calling `pushState()` with three arguments:

- `result`: This is the content we just fetched. It will be stored with the history entry, and later included as the [`state`](/en-US/docs/Web/API/PopStateEvent/state "state") property of the argument passed to the `popstate` event handler.
- `""`: This is needed for backward compatibility with legacy sites, and should always be an empty string.
- `creature`: This will be used as the URL for the entry. It will be shown in the browser's URL bar, and will be used as the value of the [`Referer`](/en-US/docs/Web/HTTP/Reference/Headers/Referer) header in any HTTP requests that the page makes. Note that this must be [same-origin](/en-US/docs/Glossary/Same-origin_policy) with the page.

## [Using the `popstate` event](#using_the_popstate_event)

Suppose the user performs the following steps:

1. Clicks a link in our SPA, so we update the page and add history entry A using `pushState()`.
2. Clicks another link in our SPA, so we update the page and add history entry B using `pushState()`.
3. Presses the "Back" button.

Now the new current history entry is A, so the browser fires the `popstate` event, and the event handler argument includes the JSON that we passed to `pushState()` when we handled the navigation to A. This means we can restore the correct content with an event handler like this:

```
// Handle forward/back buttons
window.addEventListener("popstate", (event) => {
  // If a state has been provided, we have a "simulated" page
  // and we update the current page.
  if (event.state) {
    // Simulate the loading of the previous page
    displayContent(event.state);
  }
});
```

## [Using `replaceState()`](#using_replacestate)

There's one more piece we need to add. When the user loads the SPA, the browser adds a history entry. Because this was an actual page load, the entry has no state associated with it. So suppose the user does the following:

1. Loads the SPA, so the browser adds a history entry.
2. Clicks a link inside the SPA, so the click handler updates the page and adds a history entry with `pushState()`.
3. Presses the "Back" button.

Now we want to go back to the SPA's initial state, but since this is a navigation in the same document, the page will not be reloaded, and since the history entry for the initial page has no state, we can't use `popstate` to restore it.

The solution here is to use `replaceState()` to set the state object for the initial page. For example:

```
// Create state on page load and replace the current history with it
const image = document.querySelector("#photo");
const initialState = {
  description: document.querySelector("#description").textContent,
  image: {
    src: image.getAttribute("src"),
    alt: image.getAttribute("alt"),
  },
  name: "Home",
};
history.replaceState(initialState, "", document.location.href);
```

On page load, we collect all the parts of the page that we need to restore when the user returns to the starting point for the SPA. This has the same structure as the JSON we fetch when handling other navigations. We pass this `initialState` object into `replaceState()`, which effectively adds the state object to the current history entry.

When the user returns to our starting point, the `popstate` event will contain this initial state, and we can use our `displayContent()` function to update the page.

## [Complete History API example](#complete_history_api_example)

You can find this complete example at [https://github.com/mdn/dom-examples/tree/main/history-api](https://github.com/mdn/dom-examples/tree/main/history-api "External link (opens in new tab)"), and see the demo live at [https://mdn.github.io/dom-examples/history-api/](https://mdn.github.io/dom-examples/history-api/ "External link (opens in new tab)").

## [See also](#see_also)

- [History API](/en-US/docs/Web/API/History_API)
- [`history`](/en-US/docs/Web/API/Window/history "history") global object
