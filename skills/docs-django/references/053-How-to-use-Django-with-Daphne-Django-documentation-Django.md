# How to use Django with Daphne | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/howto/deployment/asgi/daphne

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/howto/deployment/asgi/daphne/)
- [6.0](https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/daphne/)
- [5.2](https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/daphne/)
- [5.1](https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/daphne/)
- [5.0](https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/daphne/)
- [4.2](https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/daphne/)
- [4.1](https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/daphne/)
- [4.0](https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/daphne/)
- [3.2](https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/daphne/)
- [3.1](https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/daphne/)
- [3.0](https://docs.djangoproject.com/en/3.0/howto/deployment/asgi/daphne/)

# How to use Django with Daphne

[Daphne](https://pypi.org/project/daphne/) is a pure-Python ASGI server for UNIX, maintained by
members of the Django project. It acts as the reference server for ASGI.

## Installing Daphne

You can install Daphne with `pip`:

```
python -m pip install daphne
```

## Running Django in Daphne

When Daphne is installed, a `daphne` command is available which starts the
Daphne server process. At its simplest, Daphne needs to be called with the
location of a module containing an ASGI application object, followed by what
the application is called (separated by a colon).

For a typical Django project, invoking Daphne would look like:

```
daphne myproject.asgi:application
```

This will start one process listening on `127.0.0.1:8000`. It requires that
your project be on the Python path; to ensure that run this command from the
same directory as your `manage.py` file.

## Integration with `runserver`

Daphne provides a [`runserver`](../../../../ref/django-admin/#django-admin-runserver) command to serve your site under ASGI
during development.

This can be enabled by adding `daphne` to the start of your
[`INSTALLED_APPS`](../../../../ref/settings/#std-setting-INSTALLED_APPS) and adding an `ASGI_APPLICATION` setting pointing
to your ASGI application object:

```
INSTALLED_APPS = [
    "daphne",
    ...,
]

ASGI_APPLICATION = "myproject.asgi.application"
```

 [Back to Top](#top)
