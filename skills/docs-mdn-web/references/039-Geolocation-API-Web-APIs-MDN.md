# Geolocation API - Web APIs | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

## [Concepts and usage](#concepts_and_usage)

You will often want to retrieve a user's location information in your web app, for example to plot their location on a map, or display personalized information relevant to their location.

The Geolocation API is accessed via a call to [`navigator.geolocation`](/en-US/docs/Web/API/Navigator/geolocation "navigator.geolocation"); this will cause the user's browser to ask them for permission to access their location data. If they accept, then the browser will use the best available functionality on the device to access this information (for example, GPS).

The developer can now access this location information in a couple of different ways:

- [`Geolocation.getCurrentPosition()`](/en-US/docs/Web/API/Geolocation/getCurrentPosition): Retrieves the device's current location.
- [`Geolocation.watchPosition()`](/en-US/docs/Web/API/Geolocation/watchPosition): Registers a handler function that will be called automatically each time the position of the device changes, returning the updated location.

In both cases, the method call takes up to three arguments:

- A mandatory success callback: If the location retrieval is successful, the callback executes with a [`GeolocationPosition`](/en-US/docs/Web/API/GeolocationPosition) object as its only parameter, providing access to the location data.
- An optional error callback: If the location retrieval is unsuccessful, the callback executes with a [`GeolocationPositionError`](/en-US/docs/Web/API/GeolocationPositionError) object as its only parameter, providing access information on what went wrong.
- An optional object which provides options for retrieval of the position data.

For further information on Geolocation usage, read [Using the Geolocation API](/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API).

## [Interfaces](#interfaces)

[`Geolocation`](/en-US/docs/Web/API/Geolocation)
:   The main class of this API — contains methods to retrieve the user's current position, watch for changes in their position, and clear a previously-set watch.

[`GeolocationPosition`](/en-US/docs/Web/API/GeolocationPosition)
:   Represents the position of a user. A `GeolocationPosition` instance is returned by a successful call to one of the methods contained inside [`Geolocation`](/en-US/docs/Web/API/Geolocation), inside a success callback, and contains a timestamp plus a [`GeolocationCoordinates`](/en-US/docs/Web/API/GeolocationCoordinates) object instance.

[`GeolocationCoordinates`](/en-US/docs/Web/API/GeolocationCoordinates)
:   Represents the coordinates of a user's position; a `GeolocationCoordinates` instance contains latitude, longitude, and other important related information.

[`GeolocationPositionError`](/en-US/docs/Web/API/GeolocationPositionError)
:   A `GeolocationPositionError` is returned by an unsuccessful call to one of the methods contained inside [`Geolocation`](/en-US/docs/Web/API/Geolocation), inside an error callback, and contains an error code and message.

### [Extensions to other interfaces](#extensions_to_other_interfaces)

:   The entry point into the API. Returns a [`Geolocation`](/en-US/docs/Web/API/Geolocation) object instance, from which all other functionality can be accessed.

## [Security considerations](#security_considerations)

The Geolocation API allows users to programmatically access location information in [secure contexts](/en-US/docs/Web/Security/Defenses/Secure_Contexts).

Access may further be controlled by the [Permissions Policy](/en-US/docs/Web/HTTP/Guides/Permissions_Policy) directive [`geolocation`](/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy/geolocation).
The default allowlist for `geolocation` is `self`, which allows access to location information in same-origin nested frames only.
Third party usage is enabled by setting a `Permissions-Policy` response header to grant permission to a particular third party origin:

```
Permissions-Policy: geolocation=(self b.example.com)
```

The `allow="geolocation"` attribute must then be added to the iframe element with sources from that origin:

```
<iframe src="https://b.example.com" allow="geolocation"></iframe>
```

Geolocation data may reveal information that the device owner does not want to share.
Therefore, users must grant explicit permission via a prompt when either [`Geolocation.getCurrentPosition()`](/en-US/docs/Web/API/Geolocation/getCurrentPosition) or [`Geolocation.watchPosition()`](/en-US/docs/Web/API/Geolocation/watchPosition) is called (unless the permission state is already `granted` or `denied`).
The lifetime of a granted permission depends on the user agent, and may be time based, session based, or even permanent.
The [Permissions API](/en-US/docs/Web/API/Permissions_API) `geolocation` permission can be used to test whether access to use location information is `granted`, `denied` or `prompt` (requires user acknowledgement of a prompt).

## [Examples](#examples)

See [Using the Geolocation API](/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API#examples) for example code.

## [Specifications](#specifications)

| Specification |
| --- |
| [Geolocation # geolocation\_interface](https://w3c.github.io/geolocation/#geolocation_interface) |

## [Browser compatibility](#browser_compatibility)

### [Availability](#availability)

As Wi-Fi-based locating is often provided by Google, the vanilla Geolocation API may be unavailable in China. You may use local third-party providers such as [Baidu](https://lbsyun.baidu.com/index.php?title=jspopular/guide/geolocation "External link (opens in new tab)"), [Autonavi](https://lbs.amap.com/api/javascript-api/guide/services/geolocation#geolocation "External link (opens in new tab)"), or [Tencent](https://lbs.qq.com/service/webService/webServiceGuide/position/webServiceIp "External link (opens in new tab)"). These services use the user's IP address and/or a local app to provide enhanced positioning.

## [See also](#see_also)

- [`<geolocation>`](/en-US/docs/Web/HTML/Reference/Elements/geolocation) element
- [Using the Geolocation API](/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API)
- [Who moved my geolocation?](https://hacks.mozilla.org/2013/10/who-moved-my-geolocation/ "External link (opens in new tab)") (Hacks blog)
