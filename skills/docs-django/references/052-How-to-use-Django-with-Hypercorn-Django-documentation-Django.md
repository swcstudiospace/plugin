# How to use Django with Hypercorn | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/howto/deployment/asgi/hypercorn

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/howto/deployment/asgi/hypercorn/)
- [6.0](https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/hypercorn/)
- [5.2](https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/hypercorn/)
- [5.1](https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/hypercorn/)
- [5.0](https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/hypercorn/)
- [4.2](https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/hypercorn/)
- [4.1](https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/hypercorn/)
- [4.0](https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/hypercorn/)
- [3.2](https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/hypercorn/)
- [3.1](https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/hypercorn/)

# How to use Django with Hypercorn

[Hypercorn](https://hypercorn.readthedocs.io/) is an ASGI server that supports HTTP/1, HTTP/2, and HTTP/3
with an emphasis on protocol support.

## Installing Hypercorn

You can install Hypercorn with `pip`:

```
python -m pip install hypercorn
```

## Running Django in Hypercorn

When [Hypercorn](https://pypi.org/project/Hypercorn/) is installed, a `hypercorn` command is available
which runs ASGI applications. Hypercorn needs to be called with the
location of a module containing an ASGI application object, followed
by what the application is called (separated by a colon).

For a typical Django project, invoking Hypercorn would look like:

```
hypercorn myproject.asgi:application
```

This will start one process listening on `127.0.0.1:8000`. It
requires that your project be on the Python path; to ensure that run
this command from the same directory as your `manage.py` file.

For more advanced usage, please read the [Hypercorn documentation](https://hypercorn.readthedocs.io/).

 [Back to Top](#top)
