# Troubleshooting | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/faq/troubleshooting

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/faq/troubleshooting/)
- [6.0](https://docs.djangoproject.com/en/6.0/faq/troubleshooting/)
- [5.2](https://docs.djangoproject.com/en/5.2/faq/troubleshooting/)
- [5.1](https://docs.djangoproject.com/en/5.1/faq/troubleshooting/)
- [5.0](https://docs.djangoproject.com/en/5.0/faq/troubleshooting/)
- [4.2](https://docs.djangoproject.com/en/4.2/faq/troubleshooting/)
- [4.1](https://docs.djangoproject.com/en/4.1/faq/troubleshooting/)
- [4.0](https://docs.djangoproject.com/en/4.0/faq/troubleshooting/)
- [3.2](https://docs.djangoproject.com/en/3.2/faq/troubleshooting/)
- [3.1](https://docs.djangoproject.com/en/3.1/faq/troubleshooting/)
- [3.0](https://docs.djangoproject.com/en/3.0/faq/troubleshooting/)
- [2.2](https://docs.djangoproject.com/en/2.2/faq/troubleshooting/)
- [2.1](https://docs.djangoproject.com/en/2.1/faq/troubleshooting/)
- [2.0](https://docs.djangoproject.com/en/2.0/faq/troubleshooting/)
- [1.11](https://docs.djangoproject.com/en/1.11/faq/troubleshooting/)
- [1.10](https://docs.djangoproject.com/en/1.10/faq/troubleshooting/)
- [1.9](https://docs.djangoproject.com/en/1.9/faq/troubleshooting/)
- [1.8](https://docs.djangoproject.com/en/1.8/faq/troubleshooting/)

# Troubleshooting

This page contains some advice about errors and problems commonly encountered
during the development of Django applications.

## Problems running `django-admin`

### `command not found: django-admin`

[django-admin](../../ref/django-admin/) should be on your system path if you
installed Django via `pip`. If it’s not in your path, ensure you have your
virtual environment activated and you can try running the equivalent command
`python -m django`.

### macOS permissions

If you’re using macOS, you may see the message “permission denied” when
you try to run `django-admin`. This is because, on Unix-based systems like
macOS, a file must be marked as “executable” before it can be run as a program.
To do this, open Terminal.app and navigate (using the `cd` command) to the
directory where [django-admin](../../ref/django-admin/) is installed, then
run the command `sudo chmod +x django-admin`.

## Miscellaneous

### I’m getting a `UnicodeDecodeError`. What am I doing wrong?

This class of errors happen when a bytestring containing non-ASCII sequences is
transformed into a Unicode string and the specified encoding is incorrect. The
output generally looks like this:

```
UnicodeDecodeError: 'ascii' codec can't decode byte 0x?? in position ?:
ordinal not in range(128)
```

The resolution mostly depends on the context, however here are two common
pitfalls producing this error:

- Your system locale may be a default ASCII locale, like the “C” locale on
  UNIX-like systems (can be checked by the `locale` command). If it’s the
  case, please refer to your system documentation to learn how you can change
  this to a UTF-8 locale.

Related resources:

- [Unicode in Django](../../ref/unicode/)
- <https://wiki.python.org/moin/UnicodeDecodeError>

 [Back to Top](#top)
