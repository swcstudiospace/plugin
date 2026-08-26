# How to configure and use logging | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/howto/logging

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/howto/logging/)
- [6.0](https://docs.djangoproject.com/en/6.0/howto/logging/)
- [5.2](https://docs.djangoproject.com/en/5.2/howto/logging/)
- [5.1](https://docs.djangoproject.com/en/5.1/howto/logging/)
- [5.0](https://docs.djangoproject.com/en/5.0/howto/logging/)
- [4.2](https://docs.djangoproject.com/en/4.2/howto/logging/)
- [4.1](https://docs.djangoproject.com/en/4.1/howto/logging/)
- [4.0](https://docs.djangoproject.com/en/4.0/howto/logging/)

# How to configure and use logging

See also

- [Django logging reference](../../ref/logging/#logging-ref)
- [Django logging overview](../../topics/logging/#logging-explanation)

Django provides a working [default logging configuration](../../ref/logging/#default-logging-configuration) that is readily extended.

## Make a basic logging call

To send a log message from within your code, you place a logging call into it.

Don’t be tempted to use logging calls in `settings.py`.

The way that Django logging is configured as part of the `setup()`
function means that logging calls placed in `settings.py` may not work as
expected, because *logging will not be set up at that point*. To explore
logging, use a view function as suggested in the example below.

First, import the Python logging library, and then obtain a logger instance
with [`logging.getLogger()`](https://docs.python.org/3/library/logging.html#logging.getLogger "(in Python v3.14)"). Provide the `getLogger()` method with a
name to identify it and the records it emits. A good option is to use
`__name__` (see [Use logger namespacing](#naming-loggers) below for more on this) which will
provide the name of the current Python module as a dotted path:

```
import logging

logger = logging.getLogger(__name__)
```

It’s a good convention to perform this declaration at module level.

And then in a function, for example in a view, send a record to the logger:

```
def some_view(request):
    ...
    if some_risky_state:
        logger.warning("Platform is running at risk")
```

When this code is executed, a [`LogRecord`](https://docs.python.org/3/library/logging.html#logging.LogRecord "(in Python v3.14)") containing that
message will be sent to the logger. If you’re using Django’s default logging
configuration, the message will appear in the console.

The `WARNING` level used in the example above is one of several
[logging severity levels](../../topics/logging/#topic-logging-parts-loggers): `DEBUG`,
`INFO`, `WARNING`, `ERROR`, `CRITICAL`. So, another example might be:

```
logger.critical("Payment system is not responding")
```

Important

Records with a level lower than `WARNING` will not appear in the console
by default. Changing this behavior requires additional configuration.

## Customize logging configuration

Although Django’s logging configuration works out of the box, you can control
exactly how your logs are sent to various destinations - to log files, external
services, email and so on - with some additional configuration.

You can configure:

- logger mappings, to determine which records are sent to which handlers
- handlers, to determine what they do with the records they receive
- filters, to provide additional control over the transfer of records, and
  even modify records in-place
- formatters, to convert [`LogRecord`](https://docs.python.org/3/library/logging.html#logging.LogRecord "(in Python v3.14)") objects to a string or
  other form for consumption by human beings or another system

There are various ways of configuring logging. In Django, the
[`LOGGING`](../../ref/settings/#std-setting-LOGGING) setting is most commonly used. The setting uses the
[dictConfig format](https://docs.python.org/3/library/logging.config.html#logging-config-dictschema "(in Python v3.14)"), and extends the
[default logging configuration](../../ref/logging/#default-logging-definition).

See [Configuring logging](../../topics/logging/#configuring-logging) for an explanation of how your custom settings
are merged with Django’s defaults.

See the [`Python logging documentation`](https://docs.python.org/3/library/logging.config.html#module-logging.config "(in Python v3.14)") for
details of other ways of configuring logging. For the sake of simplicity, this
documentation will only consider configuration via the `LOGGING` setting.

### Basic logging configuration

When configuring logging, it makes sense to

#### Create a `LOGGING` dictionary

In your `settings.py`:

```
LOGGING = {
    "version": 1,  # the dictConfig format version
    "disable_existing_loggers": False,  # retain the default loggers
}
```

It nearly always makes sense to retain and extend the default logging
configuration by setting `disable_existing_loggers` to `False`.

#### Configure a handler

This example configures a single handler named `file`, that uses Python’s
[`FileHandler`](https://docs.python.org/3/library/logging.handlers.html#logging.FileHandler "(in Python v3.14)") to save logs of level `DEBUG` and higher to the
file `general.log` (at the project root):

```
LOGGING = {
    # ...
    "handlers": {
        "file": {
            "class": "logging.FileHandler",
            "filename": "general.log",
        },
    },
}
```

Different handler classes take different configuration options. For more
information on available handler classes, see the
[`AdminEmailHandler`](../../ref/logging/#django.utils.log.AdminEmailHandler "django.utils.log.AdminEmailHandler") provided by Django and the various
[`handler classes`](https://docs.python.org/3/library/logging.handlers.html#module-logging.handlers "(in Python v3.14)") provided by Python.

Logging levels can also be set on the handlers (by default, they accept log
messages of all levels). Using the example above, adding:

```
{
    "class": "logging.FileHandler",
    "filename": "general.log",
    "level": "DEBUG",
}
```

would define a handler configuration that only accepts records of level
`DEBUG` and higher.

#### Configure a logger mapping

To send records to this handler, configure a logger mapping to use it for
example:

```
LOGGING = {
    # ...
    "loggers": {
        "": {
            "level": "DEBUG",
            "handlers": ["file"],
        },
    },
}
```

The mapping’s name determines which log records it will process. This
configuration (`''`) is *unnamed*. That means that it will process records
from *all* loggers (see [Use logger namespacing](#naming-loggers) below on how to use the mapping
name to determine the loggers for which it will process records).

It will forward messages of levels `DEBUG` and higher to the handler named
`file`.

Note that a logger can forward messages to multiple handlers, so the relation
between loggers and handlers is many-to-many.

If you execute:

```
logger.debug("Attempting to connect to API")
```

in your code, you will find that message in the file `general.log` in the
root of the project.

#### Configure a formatter

By default, the final log output contains the message part of each
[`LogRecord`](https://docs.python.org/3/library/logging.html#logging.LogRecord "(in Python v3.14)") object. Use a formatter if you want to include
additional data. First name and define your formatters - this example defines
formatters named `verbose` and `simple`:

```
LOGGING = {
    # ...
    "formatters": {
        "verbose": {
            "format": "{name} {levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
}
```

The `style` keyword allows you to specify `{` for [`str.format()`](https://docs.python.org/3/library/stdtypes.html#str.format "(in Python v3.14)") or
`$` for [`string.Template`](https://docs.python.org/3/library/string.html#string.Template "(in Python v3.14)") formatting; the default is `$`.

See [LogRecord attributes](https://docs.python.org/3/library/logging.html#logrecord-attributes "(in Python v3.14)") for the [`LogRecord`](https://docs.python.org/3/library/logging.html#logging.LogRecord "(in Python v3.14)") attributes
you can include.

To apply a formatter to a handler, add a `formatter` entry to the handler’s
dictionary referring to the formatter by name, for example:

```
"handlers": {
    "file": {
        "class": "logging.FileHandler",
        "filename": "general.log",
        "formatter": "verbose",
    },
}
```

#### Use logger namespacing

The unnamed logging configuration `''` captures logs from any Python
application. A named logging configuration will capture logs only from loggers
with matching names.

The namespace of a logger instance is defined using
[`getLogger()`](https://docs.python.org/3/library/logging.html#logging.getLogger "(in Python v3.14)"). For example in `views.py` of `my_app`:

```
logger = logging.getLogger(__name__)
```

will create a logger in the `my_app.views` namespace. `__name__` allows you
to organize log messages according to their provenance within your project’s
applications automatically. It also ensures that you will not experience name
collisions.

A logger mapping named `my_app.views` will capture records from this logger:

```
LOGGING = {
    # ...
    "loggers": {
        "my_app.views": {...},
    },
}
```

A logger mapping named `my_app` will be more permissive, capturing records
from loggers anywhere within the `my_app` namespace (including
`my_app.views`, `my_app.utils`, and so on):

```
LOGGING = {
    # ...
    "loggers": {
        "my_app": {...},
    },
}
```

You can also define logger namespacing explicitly:

```
logger = logging.getLogger("project.payment")
```

and set up logger mappings accordingly.

##### Using logger hierarchies and propagation

Logger naming is *hierarchical*. `my_app` is the parent of `my_app.views`,
which is the parent of `my_app.views.private`. Unless specified otherwise,
logger mappings will propagate the records they process to their parents - a
record from a logger in the `my_app.views.private` namespace will be handled
by a mapping for both `my_app` and `my_app.views`.

To manage this behavior, set the propagation key on the mappings you define:

```
LOGGING = {
    # ...
    "loggers": {
        "my_app": {
            # ...
        },
        "my_app.views": {
            # ...
        },
        "my_app.views.private": {
            # ...
            "propagate": False,
        },
    },
}
```

`propagate` defaults to `True`. In this example, the logs from
`my_app.views.private` will not be handled by the parent, but logs from
`my_app.views` will.

### Configure responsive logging

Logging is most useful when it contains as much information as possible, but
not information that you don’t need - and how much you need depends upon what
you’re doing. When you’re debugging, you need a level of information that would
be excessive and unhelpful if you had to deal with it in production.

You can configure logging to provide you with the level of detail you need,
when you need it. Rather than manually change configuration to achieve this, a
better way is to apply configuration automatically according to the
environment.

For example, you could set an environment variable `DJANGO_LOG_LEVEL`
appropriately in your development and staging environments, and make use of it
in a logger mapping thus:

```
"level": os.getenv("DJANGO_LOG_LEVEL", "WARNING")
```

- so that unless the environment specifies a lower log level, this
configuration will only forward records of severity `WARNING` and above to
its handler.

Other options in the configuration (such as the `level` or `formatter`
option of handlers) can be similarly managed.

 [Back to Top](#top)
