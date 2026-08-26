# How to upgrade Django to a newer version | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/howto/upgrade-version

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/howto/upgrade-version/)
- [6.0](https://docs.djangoproject.com/en/6.0/howto/upgrade-version/)
- [5.2](https://docs.djangoproject.com/en/5.2/howto/upgrade-version/)
- [5.1](https://docs.djangoproject.com/en/5.1/howto/upgrade-version/)
- [5.0](https://docs.djangoproject.com/en/5.0/howto/upgrade-version/)
- [4.2](https://docs.djangoproject.com/en/4.2/howto/upgrade-version/)
- [4.1](https://docs.djangoproject.com/en/4.1/howto/upgrade-version/)
- [4.0](https://docs.djangoproject.com/en/4.0/howto/upgrade-version/)
- [3.2](https://docs.djangoproject.com/en/3.2/howto/upgrade-version/)
- [3.1](https://docs.djangoproject.com/en/3.1/howto/upgrade-version/)
- [3.0](https://docs.djangoproject.com/en/3.0/howto/upgrade-version/)
- [2.2](https://docs.djangoproject.com/en/2.2/howto/upgrade-version/)
- [2.1](https://docs.djangoproject.com/en/2.1/howto/upgrade-version/)
- [2.0](https://docs.djangoproject.com/en/2.0/howto/upgrade-version/)
- [1.11](https://docs.djangoproject.com/en/1.11/howto/upgrade-version/)
- [1.10](https://docs.djangoproject.com/en/1.10/howto/upgrade-version/)
- [1.9](https://docs.djangoproject.com/en/1.9/howto/upgrade-version/)
- [1.8](https://docs.djangoproject.com/en/1.8/howto/upgrade-version/)

# How to upgrade Django to a newer version

Upgrading Django to the latest version offers several benefits:

- New features and improvements become available.
- Bugs are fixed.
- Older versions of Django eventually stop receiving security updates
  (see [Supported versions](../../internals/release-process/#supported-versions-policy)).
- Upgrading with each new release helps keep your code base current and makes
  future upgrades smoother.

Tools to help with version upgrades

Django has a vibrant ecosystem. There are automated upgrade helpers
highlighted on the [Community Ecosystem](https://www.djangoproject.com/community/ecosystem/#upgrade-utilities)
page.

Here are some things to consider to help make your upgrade process as smooth as
possible.

## Required Reading

If it’s your first time doing an upgrade, it is useful to read the [guide
on the different release processes](../../internals/release-process/).

Afterward, you should familiarize yourself with the changes that were made in
the new Django version(s):

- Read the [release notes](../../releases/) for each ‘final’ release from
  the one after your current Django version, up to and including the version to
  which you plan to upgrade.
- Look at the [deprecation timeline](../../internals/deprecation/) for the
  relevant versions.

Pay particular attention to backwards incompatible changes to get a clear idea
of what will be needed for a successful upgrade.

If you’re upgrading through more than one feature version (e.g. 2.0 to 2.2),
it’s usually easier to upgrade through each feature release incrementally
(2.0 to 2.1 to 2.2) rather than to make all the changes for each feature
release at once. For each feature release, use the latest patch release (e.g.
for 2.1, use 2.1.15).

The same incremental upgrade approach is recommended when upgrading from one
LTS to the next.

## Dependencies

In most cases it will be necessary to upgrade to the latest version of your
Django-related dependencies as well. If the Django version was recently
released or if some of your dependencies are not well-maintained, some of your
dependencies may not yet support the new Django version. In these cases you may
have to wait until new versions of your dependencies are released.

## Resolving deprecation warnings

Before upgrading, it’s a good idea to resolve any deprecation warnings raised
by your project while using your current version of Django. Fixing these
warnings before upgrading ensures that you’re informed about areas of the code
that need altering.

In Python, deprecation warnings are silenced by default. You must turn them on
using the `-Wa` Python command line option or the [`PYTHONWARNINGS`](https://docs.python.org/3/using/cmdline.html#envvar-PYTHONWARNINGS "(in Python v3.14)")
environment variable. For example, to show warnings while running tests:

/



```
$ python -Wa manage.py test
```

```
...\> py -Wa manage.py test
```

If you’re not using the Django test runner, you may need to also ensure that
any console output is not captured which would hide deprecation warnings. For
example, if you use [pytest](https://docs.pytest.org/):

```
$ PYTHONWARNINGS=always pytest tests --capture=no
```

Resolve any deprecation warnings with your current version of Django before
continuing the upgrade process.

Third party applications might use deprecated APIs in order to support multiple
versions of Django, so deprecation warnings in packages you’ve installed don’t
necessarily indicate a problem. If a package doesn’t support the latest version
of Django, consider raising an issue or sending a pull request for it.

## Installation

Once you’re ready, it is time to [install the new Django version](../../topics/install/). If you are using a [`virtual environment`](https://docs.python.org/3/library/venv.html#module-venv "(in Python v3.14)") and it
is a major upgrade, you might want to set up a new environment with all the
dependencies first.

If you installed Django with [pip](https://pip.pypa.io/), you can use the `--upgrade` or `-U`
flag:

/



```
$ python -m pip install -U Django
```

```
...\> py -m pip install -U Django
```

## Testing

When the new environment is set up, [run the full test suite](../../topics/testing/overview/) for your application. Again, it’s useful to turn
on deprecation warnings on so they’re shown in the test output (you can also
use the flag if you test your app manually using `manage.py runserver`):

/



```
$ python -Wa manage.py test
```

```
...\> py -Wa manage.py test
```

After you have run the tests, fix any failures. While you have the release
notes fresh in your mind, it may also be a good time to take advantage of new
features in Django by refactoring your code to eliminate any deprecation
warnings.

If you are upgrading to an alpha, beta, or release candidate, please see our
guide on [How to test pre-release versions of Django](../../internals/contributing/bugs-and-features/#testing-pre-releases) for more specific tips about catching
regressions and reporting bugs.

## Deployment

When you are sufficiently confident your app works with the new version of
Django, you’re ready to go ahead and [deploy](../deployment/)
your upgraded Django project.

If you are using caching provided by Django, you should consider clearing your
cache after upgrading. Otherwise you may run into problems, for example, if you
are caching pickled objects as these objects are not guaranteed to be
pickle-compatible across Django versions. A past instance of incompatibility
was caching pickled [`HttpResponse`](../../ref/request-response/#django.http.HttpResponse "django.http.HttpResponse") objects, either directly
or indirectly via the [`cache_page()`](../../topics/cache/#django.views.decorators.cache.cache_page "django.views.decorators.cache.cache_page")
decorator.

 [Back to Top](#top)
