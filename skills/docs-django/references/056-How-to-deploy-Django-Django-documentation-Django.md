# How to deploy Django | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/howto/deployment

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/howto/deployment/)
- [6.0](https://docs.djangoproject.com/en/6.0/howto/deployment/)
- [5.2](https://docs.djangoproject.com/en/5.2/howto/deployment/)
- [5.1](https://docs.djangoproject.com/en/5.1/howto/deployment/)
- [5.0](https://docs.djangoproject.com/en/5.0/howto/deployment/)
- [4.2](https://docs.djangoproject.com/en/4.2/howto/deployment/)
- [4.1](https://docs.djangoproject.com/en/4.1/howto/deployment/)
- [4.0](https://docs.djangoproject.com/en/4.0/howto/deployment/)
- [3.2](https://docs.djangoproject.com/en/3.2/howto/deployment/)
- [3.1](https://docs.djangoproject.com/en/3.1/howto/deployment/)
- [3.0](https://docs.djangoproject.com/en/3.0/howto/deployment/)
- [2.2](https://docs.djangoproject.com/en/2.2/howto/deployment/)
- [2.1](https://docs.djangoproject.com/en/2.1/howto/deployment/)
- [2.0](https://docs.djangoproject.com/en/2.0/howto/deployment/)
- [1.11](https://docs.djangoproject.com/en/1.11/howto/deployment/)
- [1.10](https://docs.djangoproject.com/en/1.10/howto/deployment/)
- [1.9](https://docs.djangoproject.com/en/1.9/howto/deployment/)
- [1.8](https://docs.djangoproject.com/en/1.8/howto/deployment/)

# How to deploy Django

Django is full of shortcuts to make web developers’ lives easier, but all
those tools are of no use if you can’t easily deploy your sites. Since Django’s
inception, ease of deployment has been a major goal.

There are many options for deploying your Django application, based on your
architecture or your particular business needs, but that discussion is outside
the scope of what Django can give you as guidance.

Django, being a web framework, needs a web server in order to operate. And
since most web servers don’t natively speak Python, we need an interface to
make that communication happen. The [`runserver`](../../ref/django-admin/#django-admin-runserver) command starts a
lightweight development server, which is not suitable for production.

Django currently supports two interfaces: WSGI and ASGI.

- [WSGI](https://wsgi.readthedocs.io/en/latest/) is the main Python standard for communicating between web servers and
  applications, but it only supports synchronous code.
- [ASGI](https://asgi.readthedocs.io/en/latest/) is the new, asynchronous-friendly standard that will allow your
  Django site to use asynchronous Python features, and asynchronous Django
  features as they are developed.

You should also consider how you will handle [static files](../static-files/deployment/) for your application, and how to handle
[error reporting](../error-reporting/).

Finally, before you deploy your application to production, you should run
through our [deployment checklist](checklist/) to ensure
that your configurations are suitable.

 [Back to Top](#top)
