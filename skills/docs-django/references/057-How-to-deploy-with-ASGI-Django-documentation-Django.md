# How to deploy with ASGI | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/howto/deployment/asgi

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/howto/deployment/asgi/)
- [6.0](https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/)
- [5.2](https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/)
- [5.1](https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/)
- [5.0](https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/)
- [4.2](https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/)
- [4.1](https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/)
- [4.0](https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/)
- [3.2](https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/)
- [3.1](https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/)
- [3.0](https://docs.djangoproject.com/en/3.0/howto/deployment/asgi/)

# How to deploy with ASGI

As well as WSGI, Django also supports deploying on [ASGI](https://asgi.readthedocs.io/en/latest/), the emerging Python
standard for asynchronous web servers and applications.

Django’s [`startproject`](../../../ref/django-admin/#django-admin-startproject) management command sets up a default ASGI
configuration for you, which you can tweak as needed for your project, and
direct any ASGI-compliant application server to use.

Django includes getting-started documentation for the following ASGI servers:

## The `application` object

Like WSGI, ASGI has you supply an `application` callable which
the application server uses to communicate with your code. It’s commonly
provided as an object named `application` in a Python module accessible to
the server.

The [`startproject`](../../../ref/django-admin/#django-admin-startproject) command creates a file
`<project_name>/asgi.py` that contains such an `application` callable.

It’s not used by the development server (`runserver`), but can be used by
any ASGI server either in development or in production.

ASGI servers usually take the path to the application callable as a string;
for most Django projects, this will look like `myproject.asgi:application`.

Warning

While Django’s default ASGI handler will run all your code in a synchronous
thread, if you choose to run your own async handler you must be aware of
async-safety.

Do not call blocking synchronous functions or libraries in any async code.
Django prevents you from doing this with the parts of Django that are not
async-safe, but the same may not be true of third-party apps or Python
libraries.

## Configuring the settings module

When the ASGI server loads your application, Django needs to import the
settings module — that’s where your entire application is defined.

Django uses the [`DJANGO_SETTINGS_MODULE`](../../../topics/settings/#envvar-DJANGO_SETTINGS_MODULE) environment variable to locate
the appropriate settings module. It must contain the dotted path to the
settings module. You can use a different value for development and production;
it all depends on how you organize your settings.

If this variable isn’t set, the default `asgi.py` sets it to
`mysite.settings`, where `mysite` is the name of your project.

## Applying ASGI middleware

To apply ASGI middleware, or to embed Django in another ASGI application, you
can wrap Django’s `application` object in the `asgi.py` file. For example:

```
from some_asgi_library import AmazingMiddleware

application = AmazingMiddleware(application)
```

 [Back to Top](#top)
