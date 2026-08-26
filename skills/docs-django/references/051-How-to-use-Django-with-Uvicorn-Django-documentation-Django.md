# How to use Django with Uvicorn | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/howto/deployment/asgi/uvicorn

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/howto/deployment/asgi/uvicorn/)
- [6.0](https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/uvicorn/)
- [5.2](https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/uvicorn/)
- [5.1](https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/uvicorn/)
- [5.0](https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/uvicorn/)
- [4.2](https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/uvicorn/)
- [4.1](https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/uvicorn/)
- [4.0](https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/uvicorn/)
- [3.2](https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/uvicorn/)
- [3.1](https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/uvicorn/)
- [3.0](https://docs.djangoproject.com/en/3.0/howto/deployment/asgi/uvicorn/)

# How to use Django with Uvicorn

[Uvicorn](https://www.uvicorn.dev/) is an ASGI server based on `uvloop` and `httptools`, with an
emphasis on speed.

## Installing Uvicorn

You can install Uvicorn with `pip`:

```
python -m pip install uvicorn
```

## Running Django in Uvicorn

When Uvicorn is installed, a `uvicorn` command is available which runs ASGI
applications. Uvicorn needs to be called with the location of a module
containing an ASGI application object, followed by what the application is
called (separated by a colon).

For a typical Django project, invoking Uvicorn would look like:

```
python -m uvicorn myproject.asgi:application
```

This will start one process listening on `127.0.0.1:8000`. It requires that
your project be on the Python path; to ensure that run this command from the
same directory as your `manage.py` file.

In development mode, you can add `--reload` to cause the server to reload any
time a file is changed on disk.

For more advanced usage, please read the [Uvicorn documentation](https://www.uvicorn.dev/).

## Deploying Django using Uvicorn and Gunicorn

[Gunicorn](https://gunicorn.org/) is a robust web server that implements process monitoring and
automatic restarts. This can be useful when running Uvicorn in a production
environment.

To install Uvicorn and Gunicorn, use the following:

```
python -m pip install uvicorn uvicorn-worker gunicorn
```

Then start Gunicorn using the Uvicorn worker class like this:

```
python -m gunicorn myproject.asgi:application -k uvicorn_worker.UvicornWorker
```

 [Back to Top](#top)
