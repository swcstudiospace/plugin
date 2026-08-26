# Web application manifest - Progressive web apps | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest

## [Members](#members)

This section lists [reference pages for manifest members](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference) that are documented on MDN.
All members are optional in the specification, but some applications require some members to be present. For example, [PWAs must provide certain manifest members](/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable#required_manifest_members).

- [\*\_localized](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/*_localized)
- [background\_color](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/background_color)
- [categories](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/categories)
- [description](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/description)
- [display](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/display)
- [display\_override](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/display_override)
- [file\_handlers](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/file_handlers)
- [icons](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons)
- [id](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/id)
- [launch\_handler](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/launch_handler)
- [name](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/name)
- [note\_taking](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/note_taking)
- [orientation](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/orientation)
- [prefer\_related\_applications](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/prefer_related_applications)
- [protocol\_handlers](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/protocol_handlers)
- [related\_applications](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/related_applications)
- [scope](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/scope)
- [scope\_extensions](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/scope_extensions)
- [screenshots](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/screenshots)
- [serviceworker](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/serviceworker)
- [share\_target](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/share_target)
- [short\_name](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/short_name)
- [shortcuts](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/shortcuts)
- [start\_url](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/start_url)
- [theme\_color](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/theme_color)

**Note:**
The `dir`, `lang`, and `iarc_rating_id` members are not implemented.

## [Example manifest](#example_manifest)

```
{
  "short_name": "MDN",
  "name": "MDN Web Docs",
  "icons": [
    {
      "src": "/favicon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/favicon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "black",
  "background_color": "white"
}
```

## [Deploying a manifest](#deploying_a_manifest)

Web app manifests are deployed in your HTML pages using a [`<link>`](/en-US/docs/Web/HTML/Reference/Elements/link) element in the [`<head>`](/en-US/docs/Web/HTML/Reference/Elements/head) of a document:

```
<link rel="manifest" href="manifest.json" />
```

The `.webmanifest` extension is specified in the [Media type registration](https://w3c.github.io/manifest/#media-type-registration "External link (opens in new tab)") section of the specification (the response of the manifest file should return `Content-Type: application/manifest+json`). Browsers generally support manifests with other appropriate extensions like `.json` (`Content-Type: application/json`).

If the manifest requires credentials to fetch, the [`crossorigin`](/en-US/docs/Web/HTML/Reference/Attributes/crossorigin) attribute must be set to `use-credentials`, even if the manifest file is in the same origin as the current page.

```
<link rel="manifest" href="/app.webmanifest" crossorigin="use-credentials" />
```

## [Splash screens](#splash_screens)

In some browsers and operating systems, a splash screen is displayed when an installed PWA is launched. This splash screen is automatically generated and its appearance is defined by members in the web app manifest, specifically:

- [`name`](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/name)
- [`background_color`](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/background_color)
- [`icons`](/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons)

## [Browser compatibility](#browser_compatibility)

## [See also](#see_also)

- [Progressive Web Apps (PWAs)](/en-US/docs/Web/Progressive_web_apps)
