# How to create PDF files | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/howto/outputting-pdf

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/howto/outputting-pdf/)
- [6.0](https://docs.djangoproject.com/en/6.0/howto/outputting-pdf/)
- [5.2](https://docs.djangoproject.com/en/5.2/howto/outputting-pdf/)
- [5.1](https://docs.djangoproject.com/en/5.1/howto/outputting-pdf/)
- [5.0](https://docs.djangoproject.com/en/5.0/howto/outputting-pdf/)
- [4.2](https://docs.djangoproject.com/en/4.2/howto/outputting-pdf/)
- [4.1](https://docs.djangoproject.com/en/4.1/howto/outputting-pdf/)
- [4.0](https://docs.djangoproject.com/en/4.0/howto/outputting-pdf/)
- [3.2](https://docs.djangoproject.com/en/3.2/howto/outputting-pdf/)
- [3.1](https://docs.djangoproject.com/en/3.1/howto/outputting-pdf/)
- [3.0](https://docs.djangoproject.com/en/3.0/howto/outputting-pdf/)
- [2.2](https://docs.djangoproject.com/en/2.2/howto/outputting-pdf/)
- [2.1](https://docs.djangoproject.com/en/2.1/howto/outputting-pdf/)
- [2.0](https://docs.djangoproject.com/en/2.0/howto/outputting-pdf/)
- [1.11](https://docs.djangoproject.com/en/1.11/howto/outputting-pdf/)
- [1.10](https://docs.djangoproject.com/en/1.10/howto/outputting-pdf/)
- [1.9](https://docs.djangoproject.com/en/1.9/howto/outputting-pdf/)
- [1.8](https://docs.djangoproject.com/en/1.8/howto/outputting-pdf/)

# How to create PDF files

This document explains how to output PDF files dynamically using Django views.
This is made possible by the excellent, open-source [ReportLab](https://docs.reportlab.com/) Python PDF
library.

The advantage of generating PDF files dynamically is that you can create
customized PDFs for different purposes – say, for different users or different
pieces of content.

For example, Django was used at [kusports.com](https://www2.kusports.com/) to generate customized,
printer-friendly NCAA tournament brackets, as PDF files, for people
participating in a March Madness contest.

## Install ReportLab

The ReportLab library is [available on PyPI](https://pypi.org/project/reportlab/). A [user guide](https://www.reportlab.com/docs/reportlab-userguide.pdf)
(not coincidentally, a PDF file) is also available for download.
You can install ReportLab with `pip`:

/



```
$ python -m pip install reportlab
```

```
...\> py -m pip install reportlab
```

Test your installation by importing it in the Python interactive interpreter:

```
>>> import reportlab
```

If that command doesn’t raise any errors, the installation worked.

## Write your view

The key to generating PDFs dynamically with Django is that the ReportLab API
acts on file-like objects, and Django’s [`FileResponse`](../../ref/request-response/#django.http.FileResponse "django.http.FileResponse")
objects accept file-like objects.

Here’s a “Hello World” example:

```
import io
from django.http import FileResponse
from reportlab.pdfgen import canvas

def some_view(request):
    # Create a file-like buffer to receive PDF data.
    buffer = io.BytesIO()

    # Create the PDF object, using the buffer as its "file."
    p = canvas.Canvas(buffer)

    # Draw things on the PDF. Here's where the PDF generation happens.
    # See the ReportLab documentation for the full list of functionality.
    p.drawString(100, 100, "Hello world.")

    # Close the PDF object cleanly, and we're done.
    p.showPage()
    p.save()

    # FileResponse sets the Content-Disposition header so that browsers
    # present the option to save the file.
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename="hello.pdf")
```

The code and comments should be self-explanatory, but a few things deserve a
mention:

- The response will automatically set the MIME type *application/pdf*
  based on the filename extension. This tells browsers that the document is a
  PDF file, rather than an HTML file or a generic
  *application/octet-stream* binary content.
- When `as_attachment=True` is passed to `FileResponse`, it sets the
  appropriate `Content-Disposition` header and that tells web browsers to
  pop-up a dialog box prompting/confirming how to handle the document even if a
  default is set on the machine. If the `as_attachment` parameter is omitted,
  browsers will handle the PDF using whatever program/plugin they’ve been
  configured to use for PDFs.
- You can provide an arbitrary `filename` parameter. It’ll be used by
  browsers in the “Save as…” dialog.
- You can hook into the ReportLab API: The same buffer passed as the first
  argument to `canvas.Canvas` can be fed to the
  [`FileResponse`](../../ref/request-response/#django.http.FileResponse "django.http.FileResponse") class.
- Note that all subsequent PDF-generation methods are called on the PDF
  object (in this case, `p`) – not on `buffer`.
- Finally, it’s important to call `showPage()` and `save()` on the PDF
  file.

Note

ReportLab is not thread-safe. Some of our users have reported odd issues
with building PDF-generating Django views that are accessed by many people
at the same time.

## Other formats

Notice that there isn’t a lot in these examples that’s PDF-specific – just the
bits using `reportlab`. You can use a similar technique to generate any
arbitrary format that you can find a Python library for. Also see
[How to create CSV output](../outputting-csv/) for another example and some techniques you can
use when generated text-based formats.

See also

Django Packages provides a [comparison of packages](https://djangopackages.org/grids/g/pdf/) that help generate PDF files
from Django.

 [Back to Top](#top)
