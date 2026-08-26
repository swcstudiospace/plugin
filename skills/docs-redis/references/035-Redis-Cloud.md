# Redis Cloud

Source: https://redis.io/docs/latest/operate/rc/index.html.md

# Redis Cloud
```json metadata
{
"title": "Redis Cloud",
"description": "The fastest way to set up Redis - a fully managed Redis database on major public cloud services.",
"categories": ["docs","operate","rc"],
"tableOfContents": {"sections":[{"id":"get-started","title":"Get started"},{"id":"databases","title":"Databases"},{"id":"subscriptions","title":"Subscriptions"},{"id":"accounts-settings","title":"Accounts \u0026 settings"},{"id":"security","title":"Security"},{"id":"rest-api","title":"REST API"},{"id":"migrate-to-redis-cloud","title":"Migrate to Redis Cloud"},{"id":"migrate-to-azure-managed-redis","title":"Migrate to Azure Managed Redis"},{"id":"related-info","title":"Related info"}]}
,
"codeExamples": []
}
```[Redis Cloud](https://redis.io/cloud/) is a fully managed database-as-a-service that brings the speed and reliability of Redis to the cloud, offering seamless scalability and high availability for modern applications.
With Redis Cloud, you get all of the features of Redis Software, including:
- [Redis](https://redis.io/docs/latest/develop/) and [Redis Stack](https://redis.io/docs/latest/operate/oss\_and\_stack/stack-with-enterprise) support
- Linear scalability
- Instant failover, backups, and recovery
- Predictable performance
- 24/7 monitoring and support
[Try Redis Cloud](https://redis.io/try-free/) to set up your free 30MB database.
## Get started
Use the [Quick start](https://redis.io/docs/latest/operate/rc/rc-quickstart) to learn how to create your free database.
- [Connect with redis-cli](https://redis.io/docs/latest/operate/rc/rc-quickstart#using-rediscli)
- [Connect with Redis client](https://redis.io/docs/latest/operate/rc/rc-quickstart#using-redis-client)
- [Connect with Redis Insight](https://redis.io/docs/latest/operate/rc/rc-quickstart#using-redisinsight)
You can also use [Vercel's Redis Cloud integration](https://vercel.com/marketplace/redis-cloud) or [Heroku's Redis Cloud add-on](https://elements.heroku.com/addons/rediscloud) to quickly add a Redis database to your project.
## Databases
Create and manage [Redis databases](https://redis.io/docs/latest/operate/rc/databases) in the cloud.
- [Create database](https://redis.io/docs/latest/operate/rc/databases/create-database)
- [View and edit databases](https://redis.io/docs/latest/operate/rc/databases/view-edit-database)
- [Monitor performance](https://redis.io/docs/latest/operate/rc/databases/monitor-performance)
- [Manage databases](https://redis.io/docs/latest/operate/rc/databases/configuration)
- [Redis commands](https://redis.io/docs/latest/commands) & [compatibility](https://redis.io/docs/latest/operate/rc/compatibility)
## Subscriptions
Learn about the [types of subscriptions](https://redis.io/docs/latest/operate/rc/subscriptions).
- [View and upgrade Essentials plan](https://redis.io/docs/latest/operate/rc/subscriptions/view-essentials-subscription)
- [Essentials plans](https://redis.io/docs/latest/operate/rc/subscriptions/view-essentials-subscription/essentials-plan-details)
- [View and edit Pro plan](https://redis.io/docs/latest/operate/rc/subscriptions/view-pro-subscription)
## Accounts & settings
Manage Redis Cloud [accounts and settings](https://redis.io/docs/latest/operate/rc/accounts).
- [Billing and payments](https://redis.io/docs/latest/operate/rc/billing-and-payments)
- [Manage marketplace integrations](https://redis.io/docs/latest/operate/rc/cloud-integrations)
## Security
Manage [secure connections](https://redis.io/docs/latest/operate/rc/security) to cloud databases.
- [Access management](https://redis.io/docs/latest/operate/rc/security/access-control/access-management) for Redis Cloud console security and account management
- [Cloud database security](https://redis.io/docs/latest/operate/rc/security/database-security)
- [Multi-factor authentication](https://redis.io/docs/latest/operate/rc/security/access-control/multi-factor-authentication)
- [Single sign-on](https://redis.io/docs/latest/operate/rc/security/access-control/saml-sso) and [social login](https://redis.io/docs/latest/operate/rc/security/access-control/social-login)
- [Data access control](https://redis.io/docs/latest/operate/rc/security/access-control/data-access-control)
## REST API
Use the [REST API](https://redis.io/docs/latest/operate/rc/api) to manage Redis Cloud databases and subscriptions.
- [Get started with the REST API](https://redis.io/docs/latest/operate/rc/api/get-started)
- REST API [reference](https://redis.io/docs/latest/operate/rc/api/api-reference) & [examples](https://redis.io/docs/latest/operate/rc/api/examples)
- [`redisctl`](https://github.com/redis/redisctl) — a CLI tool that wraps the Redis Cloud and Redis Software APIs for terminal-based management
## Migrate to Redis Cloud
Follow the step-by-step guide for your source environment:
- [ElastiCache to Redis Cloud](https://redis.io/tutorials/migration/elasticache-to-redis-cloud/) — offline and live migration from AWS ElastiCache
- [Memorystore to Redis Cloud](https://redis.io/tutorials/migration/memorystore-to-redis-cloud/) — offline and live migration from Google Cloud Memorystore
- [Open source Redis to Redis Cloud](https://redis.io/tutorials/migration/redis-open-source-to-redis-cloud/) — migrate from a self-hosted Redis instance
## Migrate to Azure Managed Redis
- [ElastiCache to Azure Managed Redis (AMR)](https://redis.io/tutorials/learn/migration/elasti-cache-to-azure-managed-redis/) — move your workload from AWS to Azure
- [Memorystore to Azure Managed Redis (AMR)](https://redis.io/tutorials/learn/migration/memorystore-to-azure-managed-redis/) — move your workload from Google Cloud to Azure
## Related info
- [Redis Software](https://redis.io/docs/latest/operate/rs)
- [Develop with Redis](https://redis.io/docs/latest/develop/)
- [Redis Stack](https://redis.io/docs/latest/operate/oss\_and\_stack/stack-with-enterprise)
- [Glossary](https://redis.io/docs/latest/glossary)
