# How to authenticate against Django’s user database from Apache | Django documentation | Django

Source: https://docs.djangoproject.com/en/dev/howto/deployment/wsgi/apache-auth

- [Getting Help](https://docs.djangoproject.com/en/dev/faq/help/)

- Language: **en**

- Documentation version:
  **development**
- [6.1](https://docs.djangoproject.com/en/6.1/howto/deployment/wsgi/apache-auth/)
- [6.0](https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/apache-auth/)
- [5.2](https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/apache-auth/)
- [5.1](https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/apache-auth/)
- [5.0](https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/apache-auth/)
- [4.2](https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/apache-auth/)
- [4.1](https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/apache-auth/)
- [4.0](https://docs.djangoproject.com/en/4.0/howto/deployment/wsgi/apache-auth/)
- [3.2](https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/apache-auth/)
- [3.1](https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/apache-auth/)
- [3.0](https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/apache-auth/)
- [2.2](https://docs.djangoproject.com/en/2.2/howto/deployment/wsgi/apache-auth/)
- [2.1](https://docs.djangoproject.com/en/2.1/howto/deployment/wsgi/apache-auth/)
- [2.0](https://docs.djangoproject.com/en/2.0/howto/deployment/wsgi/apache-auth/)
- [1.11](https://docs.djangoproject.com/en/1.11/howto/deployment/wsgi/apache-auth/)
- [1.10](https://docs.djangoproject.com/en/1.10/howto/deployment/wsgi/apache-auth/)
- [1.9](https://docs.djangoproject.com/en/1.9/howto/deployment/wsgi/apache-auth/)
- [1.8](https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/apache-auth/)

# How to authenticate against Django’s user database from Apache

Since keeping multiple authentication databases in sync is a common problem
when dealing with Apache, you can configure Apache to authenticate against
Django’s [authentication system](../../../../topics/auth/) directly. This
requires Apache version >= 2.2 and `mod_wsgi` >= 2.0. For example, you could:

- Serve static/media files directly from Apache only to authenticated users.
- Authenticate access to a [Subversion](https://subversion.apache.org/) repository against Django users with
  a certain permission.
- Allow certain users to connect to a WebDAV share created with [mod\_dav](https://httpd.apache.org/docs/current/mod/mod_dav.html).

Note

If you have installed a [custom user model](../../../../topics/auth/customizing/#auth-custom-user) and
want to use this default auth handler, it must support an `is_active`
attribute. If you want to use group based authorization, your custom user
must have a relation named ‘groups’, referring to a related object that has
a ‘name’ field. You can also specify your own custom mod\_wsgi
auth handler if your custom cannot conform to these requirements.

## Authentication with `mod_wsgi`

Note

The use of `WSGIApplicationGroup %{GLOBAL}` in the configurations below
presumes that your Apache instance is running only one Django application.
If you are running more than one Django application, please refer to the
[Defining Application Groups](https://modwsgi.readthedocs.io/en/develop/user-guides/configuration-guidelines.html#defining-application-groups) section of the mod\_wsgi docs for more
information about this setting.

Make sure that mod\_wsgi is installed and activated and that you have
followed the steps to set up [Apache with mod\_wsgi](../modwsgi/).

Next, edit your Apache configuration to add a location that you want
only authenticated users to be able to view:

```
WSGIScriptAlias / /path/to/mysite.com/mysite/wsgi.py
WSGIPythonPath /path/to/mysite.com

WSGIProcessGroup %{GLOBAL}
WSGIApplicationGroup %{GLOBAL}

<Location "/secret">
    AuthType Basic
    AuthName "Top Secret"
    Require valid-user
    AuthBasicProvider wsgi
    WSGIAuthUserScript /path/to/mysite.com/mysite/wsgi.py
</Location>
```

The `WSGIAuthUserScript` directive tells mod\_wsgi to execute the
`check_password` function in specified wsgi script, passing the user name and
password that it receives from the prompt. In this example, the
`WSGIAuthUserScript` is the same as the `WSGIScriptAlias` that defines your
application [that is created by django-admin startproject](../).

Using Apache 2.2+ with authentication

Make sure that `mod_auth_basic` and `mod_authz_user` are loaded.

These might be compiled statically into Apache, or you might need to use
LoadModule to load them dynamically in your `httpd.conf`:

```
LoadModule auth_basic_module modules/mod_auth_basic.so
LoadModule authz_user_module modules/mod_authz_user.so
```

Finally, edit your WSGI script `mysite.wsgi` to tie Apache’s authentication
to your site’s authentication mechanisms by importing the `check_password`
function:

```
import os

os.environ["DJANGO_SETTINGS_MODULE"] = "mysite.settings"

from django.contrib.auth.handlers.modwsgi import check_password

from django.core.handlers.wsgi import WSGIHandler

application = WSGIHandler()
```

Requests beginning with `/secret/` will now require a user to authenticate.

The mod\_wsgi [access control mechanisms documentation](https://modwsgi.readthedocs.io/en/develop/user-guides/access-control-mechanisms.html) provides additional
details and information about alternative methods of authentication.

### Authorization with `mod_wsgi` and Django groups

mod\_wsgi also provides functionality to restrict a particular location to
members of a group.

In this case, the Apache configuration should look like this:

```
WSGIScriptAlias / /path/to/mysite.com/mysite/wsgi.py

WSGIProcessGroup %{GLOBAL}
WSGIApplicationGroup %{GLOBAL}

<Location "/secret">
    AuthType Basic
    AuthName "Top Secret"
    AuthBasicProvider wsgi
    WSGIAuthUserScript /path/to/mysite.com/mysite/wsgi.py
    WSGIAuthGroupScript /path/to/mysite.com/mysite/wsgi.py
    Require group secret-agents
    Require valid-user
</Location>
```

To support the `WSGIAuthGroupScript` directive, the same WSGI script
`mysite.wsgi` must also import the `groups_for_user` function which
returns a list of groups the given user belongs to.

```
from django.contrib.auth.handlers.modwsgi import check_password, groups_for_user
```

Requests for `/secret/` will now also require user to be a member of the
“secret-agents” group.

 [Back to Top](#top)
