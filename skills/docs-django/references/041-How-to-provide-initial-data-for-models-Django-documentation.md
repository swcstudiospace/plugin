# How to provide initial data for models | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/howto/initial-data

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/howto/initial-data/)
- [6.0](https://docs.djangoproject.com/en/6.0/howto/initial-data/)
- [5.2](https://docs.djangoproject.com/en/5.2/howto/initial-data/)
- [5.1](https://docs.djangoproject.com/en/5.1/howto/initial-data/)
- [5.0](https://docs.djangoproject.com/en/5.0/howto/initial-data/)
- [4.2](https://docs.djangoproject.com/en/4.2/howto/initial-data/)
- [4.1](https://docs.djangoproject.com/en/4.1/howto/initial-data/)
- [4.0](https://docs.djangoproject.com/en/4.0/howto/initial-data/)
- [3.2](https://docs.djangoproject.com/en/3.2/howto/initial-data/)
- [3.1](https://docs.djangoproject.com/en/3.1/howto/initial-data/)
- [3.0](https://docs.djangoproject.com/en/3.0/howto/initial-data/)
- [2.2](https://docs.djangoproject.com/en/2.2/howto/initial-data/)
- [2.1](https://docs.djangoproject.com/en/2.1/howto/initial-data/)
- [2.0](https://docs.djangoproject.com/en/2.0/howto/initial-data/)
- [1.11](https://docs.djangoproject.com/en/1.11/howto/initial-data/)
- [1.10](https://docs.djangoproject.com/en/1.10/howto/initial-data/)
- [1.9](https://docs.djangoproject.com/en/1.9/howto/initial-data/)
- [1.8](https://docs.djangoproject.com/en/1.8/howto/initial-data/)

# How to provide initial data for models

It’s sometimes useful to prepopulate your database with hardcoded data when
you’re first setting up an app. You can provide initial data with migrations or
fixtures.

## Provide initial data with migrations

To automatically load initial data for an app, create a
[data migration](../../topics/migrations/#data-migrations). Migrations are run when setting up the
test database, so the data will be available there, subject to [some
limitations](../../topics/testing/overview/#test-case-serialized-rollback).

## Provide data with fixtures

You can also provide data using [fixtures](../../topics/db/fixtures/#fixtures-explanation),
however, this data isn’t loaded automatically, except if you use
[`TransactionTestCase.fixtures`](../../topics/testing/tools/#django.test.TransactionTestCase.fixtures "django.test.TransactionTestCase.fixtures").

A fixture is a collection of data that Django knows how to import into a
database. The most straightforward way of creating a fixture if you’ve already
got some data is to use the [`manage.py dumpdata`](../../ref/django-admin/#django-admin-dumpdata) command.
Or, you can write fixtures by hand; fixtures can be written as JSON, XML or
YAML (with [PyYAML](https://pyyaml.org/) installed) documents. The [serialization documentation](../../topics/serialization/) has more details about each of these supported
[serialization formats](../../topics/serialization/#serialization-formats).

As an example, though, here’s what a fixture for a `Person` model might look
like in JSON:

```
[
  {
    "model": "myapp.person",
    "pk": 1,
    "fields": {
      "first_name": "John",
      "last_name": "Lennon"
    }
  },
  {
    "model": "myapp.person",
    "pk": 2,
    "fields": {
      "first_name": "Paul",
      "last_name": "McCartney"
    }
  }
]
```

And here’s that same fixture as YAML:

```
- model: myapp.person
  pk: 1
  fields:
    first_name: John
    last_name: Lennon
- model: myapp.person
  pk: 2
  fields:
    first_name: Paul
    last_name: McCartney
```

You’ll store this data in a `fixtures` directory inside your app.

You can load data by calling [`manage.py loaddata`](../../ref/django-admin/#django-admin-loaddata)
`<fixturename>`, where `<fixturename>` is the name of the fixture file
you’ve created. Each time you run [`loaddata`](../../ref/django-admin/#django-admin-loaddata), the data will be read
from the fixture and reloaded into the database. Note this means that if you
change one of the rows created by a fixture and then run [`loaddata`](../../ref/django-admin/#django-admin-loaddata)
again, you’ll wipe out any changes you’ve made.

### Tell Django where to look for fixture files

By default, Django looks for fixtures in the `fixtures` directory inside each
app, so the command `loaddata sample` will find the file
`my_app/fixtures/sample.json`. This works with relative paths as well, so
`loaddata my_app/sample` will find the file
`my_app/fixtures/my_app/sample.json`.

Django also looks for fixtures in the list of directories provided in the
[`FIXTURE_DIRS`](../../ref/settings/#std-setting-FIXTURE_DIRS) setting.

To completely prevent default search from happening, use an absolute path to
specify the location of your fixture file, e.g. `loaddata /path/to/sample`.

Namespace your fixture files

Django will use the first fixture file it finds whose name matches, so if
you have fixture files with the same name in different applications, you
will be unable to distinguish between them in your `loaddata` commands.
The easiest way to avoid this problem is by *namespacing* your fixture
files. That is, by putting them inside a directory named for their
application, as in the relative path example above.

See also

Fixtures are also used by the [testing framework](../../topics/testing/tools/#topics-testing-fixtures) to help set up a consistent test environment.

 [Back to Top](#top)
