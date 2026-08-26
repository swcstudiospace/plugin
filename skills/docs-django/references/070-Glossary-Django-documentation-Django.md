# Glossary | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/glossary

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/glossary/)
- [6.0](https://docs.djangoproject.com/en/6.0/glossary/)
- [5.2](https://docs.djangoproject.com/en/5.2/glossary/)
- [5.1](https://docs.djangoproject.com/en/5.1/glossary/)
- [5.0](https://docs.djangoproject.com/en/5.0/glossary/)
- [4.2](https://docs.djangoproject.com/en/4.2/glossary/)
- [4.1](https://docs.djangoproject.com/en/4.1/glossary/)
- [4.0](https://docs.djangoproject.com/en/4.0/glossary/)
- [3.2](https://docs.djangoproject.com/en/3.2/glossary/)
- [3.1](https://docs.djangoproject.com/en/3.1/glossary/)
- [3.0](https://docs.djangoproject.com/en/3.0/glossary/)
- [2.2](https://docs.djangoproject.com/en/2.2/glossary/)
- [2.1](https://docs.djangoproject.com/en/2.1/glossary/)
- [2.0](https://docs.djangoproject.com/en/2.0/glossary/)
- [1.11](https://docs.djangoproject.com/en/1.11/glossary/)
- [1.10](https://docs.djangoproject.com/en/1.10/glossary/)
- [1.9](https://docs.djangoproject.com/en/1.9/glossary/)
- [1.8](https://docs.djangoproject.com/en/1.8/glossary/)

# Glossary

concrete model
:   A non-abstract ([`abstract=False`](../ref/models/options/#django.db.models.Options.abstract "django.db.models.Options.abstract")) model.

field
:   An attribute on a [model](#term-model); a given field usually maps directly to
    a single database column.

    See [Models](../topics/db/models/).

generic view
:   A higher-order [view](#term-view) function that provides an abstract/generic
    implementation of a common idiom or pattern found in view development.

    See [Class-based views](../topics/class-based-views/).

model
:   Models store your application’s data.

    See [Models](../topics/db/models/).

MTV
:   “Model-template-view”; a software pattern, similar in style to MVC, but
    a better description of the way Django does things.

    See [the FAQ entry](../faq/general/#faq-mtv).

MVC
:   [Model-view-controller](https://en.wikipedia.org/wiki/Model-view-controller); a software pattern. Django [follows MVC
    to some extent](../faq/general/#faq-mtv).

project
:   A Python package – i.e. a directory of code – that contains all the
    settings for an instance of Django. This would include database
    configuration, Django-specific options and application-specific
    settings.

property
:   Also known as “managed attributes”, and a feature of Python since
    version 2.2. This is a neat way to implement attributes whose usage
    resembles attribute access, but whose implementation uses method calls.

    See [`property`](https://docs.python.org/3/library/functions.html#property "(in Python v3.14)").

queryset
:   An object representing some set of rows to be fetched from the
    database.

    See [Making queries](../topics/db/queries/).

slug
:   A short label for something, containing only letters, numbers,
    underscores or hyphens. They’re generally used in URLs. For
    example, in a typical blog entry URL:

    ```
    https://www.djangoproject.com/weblog/2008/apr/12/spring/
    ```

    the last bit (`spring`) is the slug.

template
:   A chunk of text that acts as formatting for representing data. A
    template helps to abstract the presentation of data from the data
    itself.

    See [Templates](../topics/templates/).

view
:   A function responsible for rendering a page.

 [Back to Top](#top)
