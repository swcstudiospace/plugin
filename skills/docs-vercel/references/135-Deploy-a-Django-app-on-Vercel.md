# Deploy a Django app on Vercel

Source: https://vercel.com/docs/frameworks/full-stack/django

---
title: Deploy a Django app on Vercel
product: vercel
url: /docs/frameworks/full-stack/django
canonical\_url: "https://vercel.com/docs/frameworks/full-stack/django"
last\_updated: 2026-07-06
type: how-to
prerequisites:
- /docs/frameworks/full-stack
- /docs/frameworks
related:
- /docs/cli/init
- /docs/project-configuration/vercel-json
- /docs/cli/deploy
- /docs/cdn
- /docs/environment-variables
summary: Deploy a Django app on Vercel. Learn how the Python runtime, WSGI, ASGI, static assets, and Vercel Functions work together.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Deploy a Django app on Vercel
Deploy a Django app to Vercel with the Python runtime and Vercel Functions.
Vercel detects `manage.py` and reads your WSGI or ASGI entrypoint from your
project settings.
## Create or import your project
Create a Django project or use an existing one:
### Get started with Vercel CLI
Initialize a new Django project with the [Vercel CLI `init` command](/docs/cli/init):
```bash filename="terminal"
vc init django
```
This clones the [Django example repository](https://github.com/vercel/vercel/tree/main/examples/django) into a directory called `django`.
## Configure the Django entrypoint
Vercel automatically detects Django projects by locating `manage.py` in your repository. Vercel then executes `manage.py` to discover your `DJANGO\_SETTINGS\_MODULE` and determines the entrypoint from `WSGI\_APPLICATION` or `ASGI\_APPLICATION`.
For a WSGI app (the default), configure your settings and `wsgi.py`:
```py filename="myproject/settings.py"
WSGI\_APPLICATION = 'myproject.wsgi.application'
```
```py filename="myproject/wsgi.py"
import os
from django.core.wsgi import get\_wsgi\_application
os.environ.setdefault('DJANGO\_SETTINGS\_MODULE', 'myproject.settings')
application = get\_wsgi\_application()
```
For an ASGI app, set `ASGI\_APPLICATION` instead and define `application` in `asgi.py`:
```py filename="myproject/settings.py"
ASGI\_APPLICATION = 'myproject.asgi.application'
```
```py filename="myproject/asgi.py"
import os
from django.core.asgi import get\_asgi\_application
os.environ.setdefault('DJANGO\_SETTINGS\_MODULE', 'myproject.settings')
application = get\_asgi\_application()
```
> \*\*💡 Note:\*\* When both `ASGI\_APPLICATION` and `WSGI\_APPLICATION` are set in your Django
> settings, Vercel uses the ASGI entrypoint.
To point Vercel to a Django app in a custom module, set `tool.vercel.entrypoint` in `pyproject.toml`:
```toml filename="pyproject.toml"
[tool.vercel]
entrypoint = "myproject.wsgi:application"
```
The `tool.vercel.entrypoint` value tells Vercel to look for a WSGI instance named `application` in `./myproject/wsgi.py`.
### Build command
The `build` property in `[tool.vercel.scripts]` defines the Build Command for Django deployments. It runs after dependencies are installed and before Vercel deploys your application:
```toml filename="pyproject.toml"
[tool.vercel.scripts]
build = "python build.py"
```
For example:
```py filename="build.py"
def main():
print("Running build command...")
with open("build.txt", "w") as f:
f.write("BUILD\_COMMAND")
if \_\_name\_\_ == "\_\_main\_\_":
main()
```
A [Build Command](/docs/project-configuration/vercel-json#buildcommand) defined in `vercel.json` or in the Project Settings dashboard takes precedence over a build script in `pyproject.toml`.
> \*\*💡 Note:\*\* There is no need to call `collectstatic` in a build script. Vercel runs it
> automatically. See [Serving static assets](#serving-static-assets) for more
> details.
### Local development
Use `vercel dev` to run your application locally:
```bash filename="terminal"
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
vercel dev
```
> \*\*💡 Note:\*\* Minimum CLI version required: 50.38.0
### Deploying the application
Deploy the project by connecting your Git repository or by using the [Vercel CLI](/docs/cli/deploy):
```bash filename="terminal"
vc deploy
```
> \*\*💡 Note:\*\* Minimum CLI version required: 50.38.0
## Serving static assets
When your Django project has `STATIC\_ROOT` configured, Vercel automatically runs `collectstatic` during the build and serves the collected files from the [Vercel CDN](/docs/cdn). Files are served at `STATIC\_URL` (Django's default is `/static/`).
No additional configuration is needed. `{% static %}` template tags work in both production and local development with `vercel dev`.
Supported storage backends:
- `StaticFilesStorage` (default)
- `ManifestStaticFilesStorage`
- WhiteNoise `CompressedManifestStaticFilesStorage`
### django-storages
If Vercel detects `django-storages` as the storage backend, it runs `collectstatic` with your original settings so files are uploaded directly to your storage provider during the build. Set any required environment variables for your storage provider in your [Vercel project environment variables](/docs/environment-variables).
### WhiteNoise
[WhiteNoise](https://whitenoise.readthedocs.io/) is compatible with Vercel. In production, static files are served from the CDN. WhiteNoise is only active when running locally with `vercel dev`.
> \*\*💡 Note:\*\* If `WHITENOISE\_USE\_FINDERS = True` is set, then `STATIC\_ROOT` is not required
> and Vercel will collect static files directly from your app directories.
## Environment variables
When you add a database or other integration to your Vercel project, Vercel automatically sets environment variables like `DATABASE\_URL`. You can access these in your Django settings through `os.environ`. See [environment variables](/docs/environment-variables) for more details.
### Using environment variables in settings.py
For example, to configure a PostgreSQL database using `DATABASE\_URL`:
```py filename="myproject/settings.py"
import os
import urllib.parse
if os.environ.get("DATABASE\_URL"):
url = urllib.parse.urlparse(os.environ["DATABASE\_URL"])
DATABASES = {
"default": {
"ENGINE": "django.db.backends.postgresql",
"NAME": url.path.lstrip("/"),
"USER": url.username,
"PASSWORD": url.password,
"HOST": url.hostname,
"PORT": url.port,
}
}
else:
# Fall back to SQLite for local development
DATABASES = {
"default": {
"ENGINE": "django.db.backends.sqlite3",
"NAME": BASE\_DIR / "db.sqlite3",
}
}
```
### Loading environment variables locally
To use environment variables locally (for example, to run migrations), first pull them with [`vercel pull`](/docs/cli/pull):
```bash filename="terminal"
vercel pull
```
This saves your environment variables to `.env.local`. Then load them in `manage.py` using `dotenv` or `django-environ`:
```py filename="manage.py (dotenv)"
from dotenv import load\_dotenv
load\_dotenv(".env.local")
```
```py filename="manage.py (django-environ)"
import environ
environ.Env.read\_env(".env.local")
```
> \*\*💡 Note:\*\* Never commit `.env.local` to version control. Add it to your `.gitignore` file
> to avoid exposing secrets.
## Vercel Functions
When you deploy a Django app to Vercel, it becomes a single [Vercel
Function](/docs/functions). Vercel uses [Fluid
compute](/docs/fluid-compute) by default, so the function scales with traffic.
To configure that function, add an entry to the [`functions`
object](/docs/project-configuration/vercel-json#functions) in `vercel.json` keyed by your
resolved entrypoint file. For example, to let a WSGI app defined in
`myproject/wsgi.py` run for up to 60 seconds, set `maxDuration`:
```json filename="vercel.json"
{
"$schema": "https://openapi.vercel.sh/vercel.json",
"functions": {
"myproject/wsgi.py": {
"maxDuration": 60
}
}
}
```
For an ASGI app, key the entry on `myproject/asgi.py` instead. If your
`manage.py` lives in a subdirectory, prefix the key with that directory (for
example `backend/myproject/wsgi.py`). For more options, see [Configuring
functions](/docs/functions/configuring-functions) and the [`functions`
property](/docs/project-configuration/vercel-json#functions).
## WebSockets
Use Django Channels to add [WebSocket](/docs/functions/websockets) consumers and routing to your Django ASGI
application. Vercel serves the WebSocket connection from the same Vercel
Function as your Django application.
Follow the steps below to get started with WebSockets and Django.
- ### Install Django Channels
Add `Django` and `channels` to your `pyproject.toml`:
```toml filename="pyproject.toml"
[project]
name = "my-django-app"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
"channels>=4.2",
"Django>=5.1",
]
```
Install the dependencies from `pyproject.toml` with `uv`:
```bash filename="terminal"
uv sync
```
- ### Create a WebSocket consumer
```py filename="myproject/consumers.py"
from channels.generic.websocket import AsyncWebsocketConsumer
class EchoConsumer(AsyncWebsocketConsumer):
async def connect(self):
await self.accept()
async def receive(self, text\_data=None, bytes\_data=None):
if text\_data is not None:
await self.send(text\_data=text\_data)
elif bytes\_data is not None:
await self.send(bytes\_data=bytes\_data)
```
- ### Route WebSocket connections
Route WebSocket connections to the consumer from your ASGI entrypoint:
```py filename="myproject/asgi.py"
import os
os.environ.setdefault("DJANGO\_SETTINGS\_MODULE", "myproject.settings")
from django.core.asgi import get\_asgi\_application
# Initialize Django before importing code that may use the app registry.
django\_asgi\_application = get\_asgi\_application()
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from myproject.consumers import EchoConsumer
application = ProtocolTypeRouter(
{
"http": django\_asgi\_application,
"websocket": URLRouter(
[
path("api/ws", EchoConsumer.as\_asgi()),
]
),
}
)
```
- ### Configure the ASGI application
Set `ASGI\_APPLICATION` in your Django settings so Vercel loads the ASGI
entrypoint:
```py filename="myproject/settings.py"
ASGI\_APPLICATION = "myproject.asgi.application"
```
For group broadcasts across Vercel Function instances, configure an external
channel layer. `InMemoryChannelLayer` only coordinates connections within one
function instance. Learn more about [managing persistent state](/docs/functions/websockets#manage-persistent-state), [handling
reconnects](/docs/functions/websockets#handle-disconnections-and-reconnects), and [WebSocket limits](/docs/functions/websockets#limits-and-pricing).
## Limitations
All [Vercel Functions limitations](/docs/functions/limitations) apply to Django applications, including:
- \*\*Application size\*\*: The Django application becomes a single bundle, which has a standard bundle size limit of 500MB. [Large Functions](/docs/functions/limitations#large-functions-beta) support Python bundles up to 5GB on Fluid compute when enabled (public beta).
## More resources
For more about deploying Django on Vercel, see:
- [Django official documentation](https://docs.djangoproject.com/)
- [Vercel Functions documentation](/docs/functions)
- [Backend templates on Vercel](https://vercel.com/templates?type=backend)
---
[View full sitemap](/docs/sitemap)
