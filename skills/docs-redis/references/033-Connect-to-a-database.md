# Connect to a database

Source: https://redis.io/docs/latest/operate/rs/databases/connect/index.html.md

# Connect to a database
```json metadata
{
"title": "Connect to a database",
"description": "Learn how to connect your application to a Redis database hosted by Redis Enterprise Software and test your connection.",
"categories": ["docs","operate","rs"],
"tableOfContents": {"sections":[{"id":"connect-to-a-database","title":"Connect to a database"},{"id":"continue-learning-with-redis-university","title":"Continue learning with Redis University"}]}
,
"codeExamples": []
}
```
After you [set up a cluster](https://redis.io/docs/latest/operate/rs/clusters/new-cluster-setup) and [create a Redis database](https://redis.io/docs/latest/operate/rs/databases/create), you can connect to your database.
To connect to your database, you need the database endpoint, which includes the cluster name (FQDN) and the database port. To view and copy public and private endpoints for a database in the cluster, see the database’s \*\*Configuration > General\*\* section in the Cluster Manager UI.
![images/rs/screenshots/databases/config-general-endpoints.png](https://redis.io/docs/latest/images/rs/screenshots/databases/config-general-endpoints.png)
If you try to connect with the FQDN, and the database does not respond, try connecting with the IP address. If this succeeds, DNS is not properly configured. To set up DNS, see [Configure cluster DNS](https://redis.io/docs/latest/operate/rs/networking/cluster-dns).
If you want to secure your connection, set up [TLS](https://redis.io/docs/latest/operate/rs/security/encryption/tls/).
## Connect to a database
Use one of the following connection methods to connect to your database:
- [`redis-cli`](https://redis.io/docs/latest/operate/rs/references/cli-utilities/redis-cli/) utility
- [Redis Insight](https://redis.com/redis-enterprise/redis-insight/)
- [Redis client](https://redis.io/docs/latest/develop/clients) for your preferred programming language
For examples, see [Test client connection](https://redis.io/docs/latest/operate/rs/databases/connect/test-client-connectivity).
## Continue learning with Redis University
See the [Connect to a database on Redis Software](https://university.redis.io/course/zyxx6fdkcm5ahd) for the course.
