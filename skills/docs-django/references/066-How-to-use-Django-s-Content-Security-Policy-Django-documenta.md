# How to use Django’s Content Security Policy | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/howto/csp

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/howto/csp/)
- [6.0](https://docs.djangoproject.com/en/6.0/howto/csp/)

# How to use Django’s Content Security Policy

## Basic config

To enable Content Security Policy (CSP) in your Django project:

1. Add the CSP middleware to your [`MIDDLEWARE`](../../ref/settings/#std-setting-MIDDLEWARE) setting:

   ```
   MIDDLEWARE = [
       # ...
       "django.middleware.csp.ContentSecurityPolicyMiddleware",
       # ...
   ]
   ```
2. Configure the CSP policies in your `settings.py` using either
   [`SECURE_CSP`](../../ref/settings/#std-setting-SECURE_CSP) or [`SECURE_CSP_REPORT_ONLY`](../../ref/settings/#std-setting-SECURE_CSP_REPORT_ONLY) (or both). The
   [CSP Settings docs](../../ref/csp/#csp-settings) provide more details about the
   differences between these two:

   ```
   from django.utils.csp import CSP

   # To enforce a CSP policy:
   SECURE_CSP = {
       "default-src": [CSP.SELF],
       # Add more directives to be enforced.
   }

   # Or for report-only mode:
   SECURE_CSP_REPORT_ONLY = {
       "default-src": [CSP.SELF],
       # Add more directives as needed.
       "report-uri": "/path/to/reports-endpoint/",
   }
   ```

## Nonce config

To use nonces in your CSP policy, beside the basic config, you need to:

1. Include the [`NONCE`](../../ref/csp/#django.utils.csp.CSP.NONCE "django.utils.csp.CSP.NONCE") placeholder value in the CSP
   settings. This only applies to `script-src` or `style-src` directives:

   ```
   from django.utils.csp import CSP

   SECURE_CSP = {
       "default-src": [CSP.SELF],
       # Allow self-hosted scripts and script tags with matching `nonce` attr.
       "script-src": [CSP.SELF, CSP.NONCE],
       # Example of the less secure 'unsafe-inline' option.
       "style-src": [CSP.SELF, CSP.UNSAFE_INLINE],
   }
   ```
2. Add the [`csp()`](../../ref/templates/api/#django.template.context_processors.csp "django.template.context_processors.csp") context processor to
   your [`TEMPLATES`](../../ref/settings/#std-setting-TEMPLATES) setting. This makes the generated nonce value
   available in the Django templates as the `csp_nonce` context variable:

   ```
   TEMPLATES = [
       {
           "BACKEND": "django.template.backends.django.DjangoTemplates",
           "OPTIONS": {
               "context_processors": [
                   # ...
                   "django.template.context_processors.csp",
               ],
           },
       },
   ]
   ```
3. In your templates, add the nonce to elements that require it:

   For inline `<style>` or `<script>` tags, use the `csp_nonce` context
   variable directly:

   ```
   <style nonce="{{ csp_nonce }}">
     /* These inline styles will be allowed. */
   </style>

   <script nonce="{{ csp_nonce }}">
     // This inline JavaScript will be allowed.
   </script>
   ```

   For external `<script src="...">` and `<link rel="stylesheet">`
   elements, use the [`csp_nonce_attr`](../../ref/templates/builtins/#std-templatetag-csp_nonce_attr) template tag:

   ```
   <script src="/path/to/script.js" {% csp_nonce_attr %}></script>
   <link rel="stylesheet" href="/path/to/style.css" {% csp_nonce_attr %}>
   ```

   To render a [`Media`](../../topics/forms/media/#django.forms.Media "django.forms.Media") object’s assets with the nonce
   applied to each element, pass the object to the [`csp_nonce_attr`](../../ref/templates/builtins/#std-templatetag-csp_nonce_attr) tag:

   ```
   {% csp_nonce_attr form.media %}
   ```

   Changed in Django 6.1:

   The [`csp_nonce_attr`](../../ref/templates/builtins/#std-templatetag-csp_nonce_attr) template tag was added, including support for
   rendering [`Media`](../../topics/forms/media/#django.forms.Media "django.forms.Media") objects.

Caching and Nonce Reuse

The [`ContentSecurityPolicyMiddleware`](../../ref/middleware/#django.middleware.csp.ContentSecurityPolicyMiddleware "django.middleware.csp.ContentSecurityPolicyMiddleware")
automatically handles generating a unique nonce and inserting the
appropriate `nonce-<value>` source expression into the
`Content-Security-Policy` (or `Content-Security-Policy-Report-Only`)
header when the nonce is used in a template.

To ensure correct behavior, make sure both the HTML and the header are
generated within the same request and not served from cache. See the
reference documentation on [Nonce usage](../../ref/csp/#csp-nonce) for implementation details and
important caching considerations.

 [Back to Top](#top)
