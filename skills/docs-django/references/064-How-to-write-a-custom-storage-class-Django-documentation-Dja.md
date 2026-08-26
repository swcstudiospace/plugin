# How to write a custom storage class | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/howto/custom-file-storage

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/howto/custom-file-storage/)
- [6.0](https://docs.djangoproject.com/en/6.0/howto/custom-file-storage/)
- [5.2](https://docs.djangoproject.com/en/5.2/howto/custom-file-storage/)
- [5.1](https://docs.djangoproject.com/en/5.1/howto/custom-file-storage/)
- [5.0](https://docs.djangoproject.com/en/5.0/howto/custom-file-storage/)
- [4.2](https://docs.djangoproject.com/en/4.2/howto/custom-file-storage/)
- [4.1](https://docs.djangoproject.com/en/4.1/howto/custom-file-storage/)
- [4.0](https://docs.djangoproject.com/en/4.0/howto/custom-file-storage/)
- [3.2](https://docs.djangoproject.com/en/3.2/howto/custom-file-storage/)
- [3.1](https://docs.djangoproject.com/en/3.1/howto/custom-file-storage/)
- [3.0](https://docs.djangoproject.com/en/3.0/howto/custom-file-storage/)
- [2.2](https://docs.djangoproject.com/en/2.2/howto/custom-file-storage/)
- [2.1](https://docs.djangoproject.com/en/2.1/howto/custom-file-storage/)
- [2.0](https://docs.djangoproject.com/en/2.0/howto/custom-file-storage/)
- [1.11](https://docs.djangoproject.com/en/1.11/howto/custom-file-storage/)
- [1.10](https://docs.djangoproject.com/en/1.10/howto/custom-file-storage/)
- [1.9](https://docs.djangoproject.com/en/1.9/howto/custom-file-storage/)
- [1.8](https://docs.djangoproject.com/en/1.8/howto/custom-file-storage/)

# How to write a custom storage class

If you need to provide custom file storage – a common example is storing files
on some remote system – you can do so by defining a custom storage class.
You’ll need to follow these steps:

1. Your custom storage system must be a subclass of
   `django.core.files.storage.Storage`:

   ```
   from django.core.files.storage import Storage

   class MyStorage(Storage): ...
   ```
2. Django must be able to instantiate your storage system without any
   arguments. This means that any settings should be taken from
   `django.conf.settings`:

   ```
   from django.conf import settings
   from django.core.files.storage import Storage

   class MyStorage(Storage):
       def __init__(self, option=None):
           if not option:
               option = settings.CUSTOM_STORAGE_OPTIONS
           ...
   ```
3. Your storage class must implement the [`_open()`](#django.core.files.storage._open "django.core.files.storage._open") and [`_save()`](#django.core.files.storage._save "django.core.files.storage._save")
   methods, along with any other methods appropriate to your storage class. See
   below for more on these methods.

   In addition, if your class provides local file storage, it must override
   the `path()` method.
4. Your storage class must be [deconstructible](../../topics/migrations/#custom-deconstruct-method) so it can be serialized when it’s used on a
   field in a migration. As long as your field has arguments that are
   themselves [serializable](../../topics/migrations/#migration-serializing), you can use the
   `django.utils.deconstruct.deconstructible` class decorator for this
   (that’s what Django uses on FileSystemStorage).

By default, the following methods raise `NotImplementedError` and will
typically have to be overridden:

- [`Storage.delete()`](../../ref/files/storage/#django.core.files.storage.Storage.delete "django.core.files.storage.Storage.delete")
- [`Storage.exists()`](../../ref/files/storage/#django.core.files.storage.Storage.exists "django.core.files.storage.Storage.exists")
- [`Storage.listdir()`](../../ref/files/storage/#django.core.files.storage.Storage.listdir "django.core.files.storage.Storage.listdir")
- [`Storage.size()`](../../ref/files/storage/#django.core.files.storage.Storage.size "django.core.files.storage.Storage.size")
- [`Storage.url()`](../../ref/files/storage/#django.core.files.storage.Storage.url "django.core.files.storage.Storage.url")

Note however that not all these methods are required and may be deliberately
omitted. As it happens, it is possible to leave each method unimplemented and
still have a working Storage.

By way of example, if listing the contents of certain storage backends turns
out to be expensive, you might decide not to implement `Storage.listdir()`.

Another example would be a backend that only handles writing to files. In this
case, you would not need to implement any of the above methods.

Ultimately, which of these methods are implemented is up to you. Leaving some
methods unimplemented will result in a partial (possibly broken) interface.

You’ll also usually want to use hooks specifically designed for custom storage
objects. These are:

\_open(*name*, *mode='rb'*)

**Required**.

Called by `Storage.open()`, this is the actual mechanism the storage class
uses to open the file. This must return a `File` object, though in most
cases, you’ll want to return some subclass here that implements logic specific
to the backend storage system. The [`FileNotFoundError`](https://docs.python.org/3/library/exceptions.html#FileNotFoundError "(in Python v3.14)") exception should be
raised when a file doesn’t exist.

\_save(*name*, *content*)

Called by `Storage.save()`. The `name` will already have gone through
`get_valid_name()` and `get_available_name()`, and the `content` will be
a `File` object itself.

Should return the actual name of the file saved (usually the `name` passed
in, but if the storage needs to change the file name return the new name
instead).

get\_valid\_name(*name*)

Returns a filename suitable for use with the underlying storage system. The
`name` argument passed to this method is either the original filename sent to
the server or, if `upload_to` is a callable, the filename returned by that
method after any path information is removed. Override this to customize how
non-standard characters are converted to safe filenames.

The code provided on `Storage` retains only alpha-numeric characters, periods
and underscores from the original filename, removing everything else.

get\_alternative\_name(*file\_root*, *file\_ext*)

Returns an alternative filename based on the `file_root` and `file_ext`
parameters. By default, an underscore plus a random 7 character alphanumeric
string is appended to the filename before the extension.

get\_available\_name(*name*, *max\_length=None*)

Returns a filename that is available in the storage mechanism, possibly taking
the provided filename into account. The `name` argument passed to this method
will have already cleaned to a filename valid for the storage system, according
to the `get_valid_name()` method described above.

The length of the filename will not exceed `max_length`, if provided. If a
free unique filename cannot be found, a [`SuspiciousFileOperation`](../../ref/exceptions/#django.core.exceptions.SuspiciousOperation "django.core.exceptions.SuspiciousOperation") exception is raised.

If a file with `name` already exists, `get_alternative_name()` is called to
obtain an alternative name.

## Use your custom storage engine

The first step to using your custom storage with Django is to tell Django about
the file storage backend you’ll be using. This is done using the
[`STORAGES`](../../ref/settings/#std-setting-STORAGES) setting. This setting maps storage aliases, which are a way
to refer to a specific storage throughout Django, to a dictionary of settings
for that specific storage backend. The settings in the inner dictionaries are
described fully in the [`STORAGES`](../../ref/settings/#std-setting-STORAGES) documentation.

Storages are then accessed by alias from the
[`django.core.files.storage.storages`](../../ref/files/storage/#django.core.files.storage.storages "django.core.files.storage.storages") dictionary:

```
from django.core.files.storage import storages

example_storage = storages["example"]
```

 [Back to Top](#top)
