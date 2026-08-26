# How to create CSV output | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/howto/outputting-csv

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/howto/outputting-csv/)
- [6.0](https://docs.djangoproject.com/en/6.0/howto/outputting-csv/)
- [5.2](https://docs.djangoproject.com/en/5.2/howto/outputting-csv/)
- [5.1](https://docs.djangoproject.com/en/5.1/howto/outputting-csv/)
- [5.0](https://docs.djangoproject.com/en/5.0/howto/outputting-csv/)
- [4.2](https://docs.djangoproject.com/en/4.2/howto/outputting-csv/)
- [4.1](https://docs.djangoproject.com/en/4.1/howto/outputting-csv/)
- [4.0](https://docs.djangoproject.com/en/4.0/howto/outputting-csv/)
- [3.2](https://docs.djangoproject.com/en/3.2/howto/outputting-csv/)
- [3.1](https://docs.djangoproject.com/en/3.1/howto/outputting-csv/)
- [3.0](https://docs.djangoproject.com/en/3.0/howto/outputting-csv/)
- [2.2](https://docs.djangoproject.com/en/2.2/howto/outputting-csv/)
- [2.1](https://docs.djangoproject.com/en/2.1/howto/outputting-csv/)
- [2.0](https://docs.djangoproject.com/en/2.0/howto/outputting-csv/)
- [1.11](https://docs.djangoproject.com/en/1.11/howto/outputting-csv/)
- [1.10](https://docs.djangoproject.com/en/1.10/howto/outputting-csv/)
- [1.9](https://docs.djangoproject.com/en/1.9/howto/outputting-csv/)
- [1.8](https://docs.djangoproject.com/en/1.8/howto/outputting-csv/)

# How to create CSV output

This document explains how to output CSV (Comma Separated Values) dynamically
using Django views. To do this, you can either use the Python CSV library or
the Django template system.

## Using the Python CSV library

Python comes with a CSV library, [`csv`](https://docs.python.org/3/library/csv.html#module-csv "(in Python v3.14)"). The key to using it with Django is
that the [`csv`](https://docs.python.org/3/library/csv.html#module-csv "(in Python v3.14)") module’s CSV-creation capability acts on file-like objects,
and Django’s [`HttpResponse`](../../ref/request-response/#django.http.HttpResponse "django.http.HttpResponse") objects are file-like objects.

Here’s an example:

```
import csv
from django.http import HttpResponse

def some_view(request):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(
        content_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="somefilename.csv"'},
    )

    writer = csv.writer(response)
    writer.writerow(["First row", "Foo", "Bar", "Baz"])
    writer.writerow(["Second row", "A", "B", "C", '"Testing"', "Here's a quote"])

    return response
```

The code and comments should be self-explanatory, but a few things deserve a
mention:

- The response gets a special MIME type, *text/csv*. This tells
  browsers that the document is a CSV file, rather than an HTML file. If
  you leave this off, browsers will probably interpret the output as HTML,
  which will result in ugly, scary gobbledygook in the browser window.
- The response gets an additional `Content-Disposition` header, which
  contains the name of the CSV file. This filename is arbitrary; call it
  whatever you want. It’ll be used by browsers in the “Save as…” dialog, etc.
- You can hook into the CSV-generation API by passing `response` as the first
  argument to `csv.writer`. The `csv.writer` function expects a file-like
  object, and [`HttpResponse`](../../ref/request-response/#django.http.HttpResponse "django.http.HttpResponse") objects fit the bill.
- For each row in your CSV file, call `writer.writerow`, passing it an
  [iterable](https://docs.python.org/3/glossary.html#term-iterable "(in Python v3.14)").
- The CSV module takes care of quoting for you, so you don’t have to worry
  about escaping strings with quotes or commas in them. Pass `writerow()`
  your raw strings, and it’ll do the right thing.

### Streaming large CSV files

When dealing with views that generate very large responses, you might want to
consider using Django’s [`StreamingHttpResponse`](../../ref/request-response/#django.http.StreamingHttpResponse "django.http.StreamingHttpResponse") instead.
For example, by streaming a file that takes a long time to generate you can
avoid a load balancer dropping a connection that might have otherwise timed out
while the server was generating the response.

In this example, we make full use of Python generators to efficiently handle
the assembly and transmission of a large CSV file. Rows are batched together
to reduce HTTP overhead and improve compression efficiency when used with
[`GZipMiddleware`](../../ref/middleware/#django.middleware.gzip.GZipMiddleware "django.middleware.gzip.GZipMiddleware"):

```
import csv
from itertools import batched

from django.http import StreamingHttpResponse

class Echo:
    """An object that implements just the write method of the file-like
    interface.
    """

    def write(self, value):
        """Write the value by returning it, instead of storing in a buffer."""
        return value

def some_streaming_csv_view(request):
    """A view that streams a large CSV file."""
    # Generate a sequence of rows. The range is based on the maximum number of
    # rows that can be handled by a single sheet in most spreadsheet
    # applications.
    rows = (["Row {}".format(idx), str(idx)] for idx in range(65536))
    pseudo_buffer = Echo()
    writer = csv.writer(pseudo_buffer)

    def stream_batched_rows():
        for batch in batched(rows, 100):
            yield "".join(writer.writerow(row) for row in batch)

    return StreamingHttpResponse(
        stream_batched_rows(),
        content_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="somefilename.csv"'},
    )
```

## Using the template system

Alternatively, you can use the [Django template system](../../topics/templates/) to generate CSV. This is lower-level than using the
convenient Python [`csv`](https://docs.python.org/3/library/csv.html#module-csv "(in Python v3.14)") module, but the solution is presented here for
completeness.

The idea here is to pass a list of items to your template, and have the
template output the commas in a [`for`](../../ref/templates/builtins/#std-templatetag-for) loop.

Here’s an example, which generates the same CSV file as above:

```
from django.http import HttpResponse
from django.template import loader

def some_view(request):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(
        content_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="somefilename.csv"'},
    )

    # The data is hardcoded here, but you could load it from a database or
    # some other source.
    csv_data = (
        ("First row", "Foo", "Bar", "Baz"),
        ("Second row", "A", "B", "C", '"Testing"', "Here's a quote"),
    )

    t = loader.get_template("my_template_name.txt")
    c = {"data": csv_data}
    response.write(t.render(c))
    return response
```

The only difference between this example and the previous example is that this
one uses template loading instead of the CSV module. The rest of the code –
such as the `content_type='text/csv'` – is the same.

Then, create the template `my_template_name.txt`, with this template code:

```
{% for row in data %}"{{ row.0|addslashes }}", "{{ row.1|addslashes }}", "{{ row.2|addslashes }}", "{{ row.3|addslashes }}", "{{ row.4|addslashes }}"
{% endfor %}
```

This short template iterates over the given data and displays a line of CSV for
each row. It uses the [`addslashes`](../../ref/templates/builtins/#std-templatefilter-addslashes) template filter to ensure there
aren’t any problems with quotes.

## Other text-based formats

Notice that there isn’t very much specific to CSV here – just the specific
output format. You can use either of these techniques to output any text-based
format you can dream of. You can also use a similar technique to generate
arbitrary binary data; see [How to create PDF files](../outputting-pdf/) for an example.

 [Back to Top](#top)
