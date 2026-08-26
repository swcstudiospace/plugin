# redis-cli

Source: https://redis.io/docs/latest/operate/rs/references/cli-utilities/redis-cli/index.html.md

# redis-cli
```json metadata
{
"title": "redis-cli",
"description": "Run Redis commands.",
"categories": ["docs","operate","rs","rc"],
"tableOfContents": {"sections":[{"id":"install-redis-cli","title":"Install redis-cli"},{"children":[{"id":"connect-remotely","title":"Connect remotely"},{"id":"connect-over-tls","title":"Connect over TLS"},{"id":"connect-with-docker","title":"Connect with Docker"}],"id":"connect-to-a-database","title":"Connect to a database"},{"id":"basic-use","title":"Basic use"},{"id":"interactive-mode","title":"Interactive mode"},{"children":[{"id":"check-slowlog","title":"Check slowlog"},{"id":"scan-for-big-keys","title":"Scan for big keys"}],"id":"examples","title":"Examples"},{"id":"more-info","title":"More info"}]}
,
"codeExamples": []
}
```
The `redis-cli` command-line utility lets you interact with a Redis database. With `redis-cli`, you can run [Redis commands](https://redis.io/docs/latest/commands) directly from the command-line terminal or with [interactive mode](#interactive-mode).
If you want to run Redis commands without `redis-cli`, you can [connect to a database with Redis Insight](https://redis.io/docs/latest/develop/tools/insight) and use the built-in [CLI](https://redis.io/docs/latest/develop/tools/insight) prompt instead.
## Install `redis-cli`
When you install Redis Software or Redis Open Source, it also installs the `redis-cli` command-line utility.
To learn how to install Redis and `redis-cli`, see the following installation guides:
- [Redis Open Source](https://redis.io/docs/latest/operate/oss\_and\_stack/install/install-stack/)
- [Redis Software](https://redis.io/docs/latest/operate/rs/installing-upgrading/quickstarts/redis-enterprise-software-quickstart)
- [Redis Software with Docker](https://redis.io/docs/latest/operate/rs/installing-upgrading/quickstarts/docker-quickstart)
## Connect to a database
To run Redis commands with `redis-cli`, you need to connect to your Redis database.
You can find endpoint and port details in the \*\*Databases\*\* list or the database’s \*\*Configuration\*\* screen.
### Connect remotely
If you have `redis-cli` installed on your local machine, you can use it to connect to a remote Redis database. You will need to provide the database's connection details, such as the hostname or IP address, port, and password.
```sh
$ redis-cli -h  -p  -a
```
You can also provide the password with the `REDISCLI\_AUTH` environment variable instead of the `-a` option:
```sh
$ export REDISCLI\_AUTH=
$ redis-cli -h  -p
```
### Connect over TLS
To connect to a Redis Software or Redis Cloud database over TLS:
1. Download or copy the Redis Software server (or proxy) certificates.
- For Redis Cloud, see [Download certificates](https://redis.io/docs/latest/operate/rc/security/database-security/tls-ssl#download-certificates) for detailed instructions on how to download the server certificates (`redis\_ca.pem`) from the [Redis Cloud console](https://cloud.redis.io/).
- For Redis Software, copy the proxy certificate from the Cluster Manager UI (\*\*Cluster > Security > Certificates > Server authentication\*\*) or from a cluster node (`/etc/opt/redislabs/proxy\_cert.pem`).
1. Copy the certificate to each client machine.
1. If your database doesn't require client authentication, provide the Redis Software server certificate (`redis\_ca.pem` for Cloud or `proxy\_cert.pem` for Software) when you connect:
```sh
redis-cli -h  -p  --tls --cacert .pem
```
1. If your database requires client authentication, provide your client's private and public keys along with the Redis Software server certificate (`redis\_ca.pem` for Cloud or `proxy\_cert.pem` for Software) when you connect:
```sh
redis-cli -h  -p  --tls --cacert .pem \
--cert redis\_user.crt --key redis\_user\_private.key
```
### Connect with Docker
If your Redis database runs in a Docker container, you can use `docker exec` to run `redis-cli` commands:
```sh
$ docker exec -it  redis-cli -p
```
## Basic use
You can run `redis-cli` commands directly from the command-line terminal:
```sh
$ redis-cli -h  -p
```
For example, you can use `redis-cli` to test your database connection and store a new Redis string in the database:
```sh
$ redis-cli -h  -p 12000 PING
PONG
$ redis-cli -h  -p 12000 SET mykey "Hello world"
OK
$ redis-cli -h  -p 12000 GET mykey
"Hello world"
```
For more information, see [Command line usage](https://redis.io/docs/latest/develop/tools/cli#command-line-usage).
## Interactive mode
In `redis-cli` [interactive mode](https://redis.io/docs/latest/develop/tools/cli#interactive-mode), you can:
- Run any `redis-cli` command without prefacing it with `redis-cli`.
- Enter `?` for more information about how to use the `HELP` command and [set `redis-cli` preferences](https://redis.io/docs/latest/develop/tools/cli#preferences).
- Enter [`HELP`](https://redis.io/docs/latest/develop/tools/cli#showing-help-about-redis-commands) followed by the name of a command for more information about the command and its options.
- Press the `Tab` key for command completion.
- Enter `exit` or `quit` or press `Control+D` to exit interactive mode and return to the terminal prompt.
This example shows how to start interactive mode and run Redis commands:
```sh
$ redis-cli -p 12000
127.0.0.1:12000> PING
PONG
127.0.0.1:12000> SET mykey "Hello world"
OK
127.0.0.1:12000> GET mykey
"Hello world"
```
## Examples
### Check slowlog
Run [`slowlog get`](https://redis.io/docs/latest/commands/slowlog-get) for a list of recent slow commands:
```sh
redis-cli -h  -p  slowlog get
```
### Scan for big keys
Scan the database for big keys:
```sh
redis-cli -h  -p  --bigkeys
```
See [Scanning for big keys](https://redis.io/docs/latest/develop/tools/cli#scanning-for-big-keys) for more information.
## More info
- [Redis CLI documentation](https://redis.io/docs/latest/develop/tools/cli)
- [Redis commands reference](https://redis.io/docs/latest/commands/)
