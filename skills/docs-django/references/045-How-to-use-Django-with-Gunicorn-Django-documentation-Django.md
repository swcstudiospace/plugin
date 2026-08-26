# How to use Django with Gunicorn | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/howto/deployment/wsgi/gunicorn

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/howto/deployment/wsgi/gunicorn/)
- [6.0](https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/gunicorn/)
- [5.2](https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/gunicorn/)
- [5.1](https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/gunicorn/)
- [5.0](https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/gunicorn/)
- [4.2](https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/gunicorn/)
- [4.1](https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/gunicorn/)
- [4.0](https://docs.djangoproject.com/en/4.0/howto/deployment/wsgi/gunicorn/)
- [3.2](https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/gunicorn/)
- [3.1](https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/gunicorn/)
- [3.0](https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/gunicorn/)
- [2.2](https://docs.djangoproject.com/en/2.2/howto/deployment/wsgi/gunicorn/)
- [2.1](https://docs.djangoproject.com/en/2.1/howto/deployment/wsgi/gunicorn/)
- [2.0](https://docs.djangoproject.com/en/2.0/howto/deployment/wsgi/gunicorn/)
- [1.11](https://docs.djangoproject.com/en/1.11/howto/deployment/wsgi/gunicorn/)
- [1.10](https://docs.djangoproject.com/en/1.10/howto/deployment/wsgi/gunicorn/)
- [1.9](https://docs.djangoproject.com/en/1.9/howto/deployment/wsgi/gunicorn/)
- [1.8](https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/gunicorn/)

# How to use Django with Gunicorn

[Gunicorn](https://gunicorn.org/) (‘Green Unicorn’) is a pure-Python WSGI server for UNIX. It has no
dependencies and can be installed using `pip`.

## Installing Gunicorn

Install gunicorn by running `python -m pip install gunicorn`. For more
details, see the [gunicorn documentation](https://gunicorn.org/).

## Running Django in Gunicorn as a generic WSGI application

When Gunicorn is installed, a `gunicorn` command is available which starts
the Gunicorn server process. The simplest invocation of gunicorn is to pass the
location of a module containing a WSGI application object named
`application`, which for a typical Django project would look like:

```
gunicorn myproject.wsgi
```

This will start one process running one thread listening on `127.0.0.1:8000`.
It requires that your project be on the Python path; the simplest way to ensure
that is to run this command from the same directory as your `manage.py` file.

See Gunicorn’s [deployment documentation](https://gunicorn.org/deploy/) for additional tips.

 [Back to Top](#top)
