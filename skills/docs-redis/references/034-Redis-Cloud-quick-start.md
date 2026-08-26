# Redis Cloud quick start

Source: https://redis.io/docs/latest/operate/rc/rc-quickstart/index.html.md

# Redis Cloud quick start
```json metadata
{
"title": "Redis Cloud quick start",
"description": "",
"categories": ["docs","operate","rc"],
"tableOfContents": {"sections":[{"id":"create-an-account","title":"Create an account"},{"children":[{"id":"redis-insightusing-redisinsight","title":"Redis Insight{#using-redisinsight}"},{"id":"redis-clientusing-redis-client","title":"Redis client{#using-redis-client}"},{"id":"redis-cli-using-rediscli","title":"redis-cli {#using-rediscli}"}],"id":"connect-to-a-database","title":"Connect to a database"},{"id":"more-info","title":"More info"},{"id":"continue-learning-with-redis-university","title":"Continue learning with Redis University"}]}
,
"codeExamples": []
}
```
If you're new to Redis Cloud, this quick start helps you get up and running.
You'll learn how to:
1. Create an account and a free database
1. Connect to your database
If you already have an account, see [Create an Essentials database](https://redis.io/docs/latest/operate/rc/databases/create-database/create-essentials-database) to create a Free 30 MB Essentials database. Free plans are a type of Essentials plans; this provides an easy upgrade path when you need it.
If you already have a database, see [Manage databases](https://redis.io/docs/latest/operate/rc/databases/).
## Create an account
To create a new account with a free database:
1. Go to the [Sign up](https://redis.io/try-free/) page.
1. There are two options available to get started with Redis Cloud:
\* Enter your information in the form and select \*\*Get Started\*\*.
\* Sign up with \*\*Google\*\* or \*\*Github\*\*.
1. After you enter your information, you should receive an activation email from Redis. Select \*\*Activate account\*\* to go to the \*\*Create your database\*\* page in the [Redis Cloud console](https://cloud.redis.io).
1. You'll go to the [create database](https://redis.io/docs/latest/operate/rc/databases/create-database) page with the \*\*Free\*\* plan selected.
![images/rc/create-database-subscription-free.png](https://redis.io/docs/latest/images/rc/create-database-subscription-free.png)
If you want to create a different type of database, see the following guides:
- [Create a Redis Flex database](https://redis.io/docs/latest/operate/rc/databases/create-database/create-flex-database)
- [Create an Essentials database](https://redis.io/docs/latest/operate/rc/databases/create-database/create-essentials-database)
- [Create a Pro database](https://redis.io/docs/latest/operate/rc/databases/create-database/create-pro-database-new)
1. Redis will generate a database name for you. If you want to change it, you can do so in the \*\*Database name\*\* field.
![images/rc/create-database-free-settings.png](https://redis.io/docs/latest/images/rc/create-database-free-settings.png)
1. Select the \*\*Database version\*\* you want to use.
1. Choose your \*\*Cloud vendor\*\* and \*\*Region\*\*. You can choose between \*\*Amazon Web Services (AWS)\*\*, \*\*Google Cloud\*\*, and \*\*Microsoft Azure\*\* for the Cloud Vendor.
See [Supported regions](https://redis.io/docs/latest/operate/rc/supported-regions) for a list of supported regions by cloud vendor.
1. Select \*\*Create database\*\*.
![images/rc/button-create-db.png](https://redis.io/docs/latest/images/rc/button-create-db.png)
When you create your database, there's a brief pause while your request is processed and then the \*\*Database details\*\* page appears.
1. In the upper corner, an icon shows the current status of the database. If the icon shows an orange clock, this means your database is still being created and its status is \_pending\_.
![images/rc/icon-database-update-status-pending.png#no-click](https://redis.io/docs/latest/images/rc/icon-database-update-status-pending.png#no-click) ![images/rc/icon-database-status-active.png#no-click](https://redis.io/docs/latest/images/rc/icon-database-status-active.png#no-click)
Once the database has been created, it becomes \_active\_ and the status indicator switches to a green circle containing a checkmark.
When your new database becomes active, you're ready to connect to it.
## Connect to a database
At this point, you're viewing the \*\*Configuration\*\* details for your new database. Go to the \*\*Security\*\* section of the page.
To connect to your database, you need your username and password. Each database is protected by a \*\*Default user\*\* called `default` and a masked \*\*Default user password\*\*. Select \*\*Default user > Configure\*\* and then select the eye icon to view your password.
![images/rc/database-essentials-default-user.png](https://redis.io/docs/latest/images/rc/database-essentials-default-user.png)
Once you have the username and password, select \*\*Connect\*\* to open the connection wizard.
![images/rc/button-connect.png#no-click](https://redis.io/docs/latest/images/rc/button-connect.png#no-click)
The connection wizard provides the following database connection methods:
- [Redis Insight](#using-redisinsight)
- [`redis-cli`](#using-rediscli) utility
- [Redis client](#using-redis-client) for your preferred programming language
![images/rc/connection-wizard.png](https://redis.io/docs/latest/images/rc/connection-wizard.png)
### Redis Insight{#using-redisinsight}
[Redis Insight](https://redis.io/docs/latest/develop/tools/insight) is a free Redis GUI that lets you visualize your Redis data and learn more about Redis.
You can connect to your database with Redis Insight in two ways:
1. [Open your database in Redis Insight in your browser](#ri-browser).
1. [Download and Install Redis Insight](#ri-app) on Windows, macOS, and Linux.
#### Open in your browser {#ri-browser}
Opening your database with Redis Insight in your browser is only available for Essentials databases. For all other databases, [Download and install Redis Insight](#ri-app) on your computer.
Select \*\*Launch Redis Insight web\*\* from the connection wizard to open it.
![images/rc/rc-ri-wizard-launch.png](https://redis.io/docs/latest/images/rc/rc-ri-wizard-launch.png)
You can also select \*\*Launch\*\* from the database page under \*\*View and manage data with Redis Insight\*\* to open Redis Insight in your browser.
![images/rc/rc-ri-open.png](https://redis.io/docs/latest/images/rc/rc-ri-open.png)
Redis Insight will open in a new tab.
From there, you can:
- Select \*\*Load sample data\*\* to add sample data into your database.
![images/rc/rc-ri-load-data.png](https://redis.io/docs/latest/images/rc/rc-ri-load-data.png)
- Select \*\*Insights\*\* to learn how to use Redis.
![images/rc/rc-ri-explore-icon.png](https://redis.io/docs/latest/images/rc/rc-ri-explore-icon.png)
For more information on how to use Redis Insight in your browser, see [Open with Redis Insight on Redis Cloud](https://redis.io/docs/latest/operate/rc/databases/connect/insight-cloud).
#### Install and open on your computer {#ri-app}
1. In the connection wizard, under \*\*Redis Insight\*\*, select \*\*Download\*\* to download Redis Insight.
1. [Install Redis Insight](https://redis.io/docs/latest/develop/tools/insight).
1. Once installed, select \*\*Open in desktop\*\*.
1. A pop-up asks if you wish to open the link with Redis Insight. Select \*\*Open Redis Insight\*\* to connect to your database with Redis Insight.
See the [Redis Insight docs](https://redis.io/docs/latest/develop/tools/insight) for more info.
### Redis client{#using-redis-client}
A Redis client is a software library or tool that enables applications to interact with a Redis server. Each client has its own syntax and installation process. For help with a specific client, see the client's documentation.
The connection wizard provides code snippets to connect to your database with the following programming languages:
- .NET using [StackExchange.Redis/NRedisStack](https://redis.io/docs/latest/develop/clients/dotnet)
- node.js using [node-redis](https://redis.io/docs/latest/develop/clients/nodejs)
- Python using [redis-py](https://redis.io/docs/latest/develop/clients/redis-py)
- Java using [Jedis](https://redis.io/docs/latest/develop/clients/jedis) and [Lettuce](https://redis.io/docs/latest/develop/clients/lettuce)
- Go using [go-redis](https://redis.io/docs/latest/develop/clients/go)
- PHP using [Predis](https://redis.io/docs/latest/develop/clients/php)
![images/rc/connection-wizard-clients.png](https://redis.io/docs/latest/images/rc/connection-wizard-clients.png)
See [Clients](https://redis.io/docs/latest/develop/clients) to learn how to connect with the official Redis clients.
See the following guides to get started with different Redis use cases:
- [Data structure store](https://redis.io/docs/latest/develop/get-started/data-store)
- [Document database](https://redis.io/docs/latest/develop/get-started/document-database)
- [Vector database](https://redis.io/docs/latest/develop/get-started/vector-database)
- [RAG with Redis](https://redis.io/docs/latest/develop/get-started/rag)
- [Redis for AI](https://redis.io/docs/latest/develop/ai)
### redis-cli {#using-rediscli}
The [`redis-cli`](https://redis.io/docs/latest/develop/tools/cli) utility is installed when you install Redis. It provides a command-line interface that lets you work with your database using core [Redis commands](https://redis.io/docs/latest/commands).
To run `redis-cli`, [install Redis](https://redis.io/docs/latest/operate/oss\_and\_stack/install/install-stack/) on your machine.
See [Redis CLI](https://redis.io/docs/latest/develop/tools/cli) to learn how to use `redis-cli`.
## More info
- [Connect your application](https://redis.io/docs/latest/develop/clients)
- [Import data](https://redis.io/docs/latest/operate/rc/databases/import-data.md)
- [Manage databases](https://redis.io/docs/latest/operate/rc/databases)
- [Data persistence](https://redis.io/docs/latest/operate/rc/databases/configuration/data-persistence.md)
- [Secure your Redis Cloud database](https://redis.io/docs/latest/operate/rc/security/)
- [Back-up databases](https://redis.io/docs/latest/operate/rc/databases/back-up-data.md)
- [Monitor Redis Cloud performance](https://redis.io/docs/latest/operate/rc/databases/monitor-performance.md)
## Continue learning with Redis University
