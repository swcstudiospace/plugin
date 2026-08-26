# Redis products

Source: https://redis.io/docs/latest/operate/index.html.md

# Redis products
```json metadata
{
"title": "Redis products",
"description": "Products, services, and tools to operate a Redis database.",
"categories": null,
"tableOfContents": {"sections":[{"children":[{"id":"high-availability-and-durability","title":"High availability and durability"},{"id":"logging-and-monitoring","title":"Logging and monitoring"},{"id":"security","title":"Security"}],"id":"product-features","title":"Product features"}]}
,
"codeExamples": []
}
```
| Redis Cloud | Redis Software |
|:-----------|:--------------|
|

- [Get started with Redis Cloud](https://redis.io/docs/latest/operate/rc/rc-quickstart)
- [Create a database](https://redis.io/docs/latest/operate/rc/databases/create-database)
- [Connect to your database](https://redis.io/docs/latest/operate/rc/databases/connect)
- [Subscriptions](https://redis.io/docs/latest/operate/rc/subscriptions)
- [REST API](https://redis.io/docs/latest/operate/rc/api/)

|

- [Install Redis Software](https://redis.io/docs/latest/operate/rs/installing-upgrading)
- [Set up a new cluster](https://redis.io/docs/latest/operate/rs/clusters/new-cluster-setup)
- [Create a database](https://redis.io/docs/latest/operate/rs/databases/create)
- [Connect to your database](https://redis.io/docs/latest/operate/rs/databases/connect)
- [REST API](https://redis.io/docs/latest/operate/rs/references/rest-api/)

|
| \*\*Redis Open Source\*\* | \*\*Redis for Kubernetes\*\* |
|

- [Install Redis 8 in Redis Open Source](https://redis.io/docs/latest/operate/oss\_and\_stack/install/install-stack)
- [Install Redis Stack](https://redis.io/docs/latest/operate/oss\_and\_stack/install/archive/install-stack/) (≤ 7.4)
- [Manage Redis](https://redis.io/docs/latest/operate/oss\_and\_stack/management)

|

- [Deploy Redis for Kubernetes](https://redis.io/docs/latest/operate/kubernetes/deployment)
- [Architecture](https://redis.io/docs/latest/operate/kubernetes/architecture)
- [API Reference](https://redis.io/docs/latest/operate/kubernetes/reference)

|
| \*\*Redis Insight\*\* | \*\*Redis Data Integration (RDI)\*\* |
|

- [Install Redis Insight](https://redis.io/docs/latest/operate/redisinsight/install)
- [Use Redis Insight](https://redis.io/docs/latest/develop/tools/insight)
- [Download Redis Insight](https://redis.io/downloads/#insight)

|

- [RDI overview](https://redis.io/docs/latest/integrate/redis-data-integration/)
- [Install RDI](https://redis.io/docs/latest/integrate/redis-data-integration/installation)
- [RDI pipelines](https://redis.io/docs/latest/integrate/redis-data-integration/data-pipelines)

|
| \*\*Redis Iris\*\* | \*\*Redis Feature Form\*\* |
|

- [Redis Iris overview](https://redis.io/docs/latest/operate/iris)
- [Agent Memory](https://redis.io/docs/latest/develop/ai/context-engine/agent-memory)
- [Context Retriever](https://redis.io/docs/latest/develop/ai/context-engine/context-retriever)
- [Redis Iris on Redis Cloud](https://redis.io/docs/latest/operate/rc/context-engine)

|

- [Feature Form overview](https://redis.io/docs/latest/operate/featureform)
- [Deploy Feature Form](https://redis.io/docs/latest/operate/featureform/deploy)
- [Configure authentication](https://redis.io/docs/latest/operate/featureform/configure-auth)

|
## Product features
### High availability and durability
| |  Redis Cloud |  Redis Software |  Redis Open Source |  Redis for Kubernetes |
|:-----------|:--------------|:-----------|:--------------|:--------------|
| Clustering | [Clustering](https://redis.io/docs/latest/operate/rc/databases/configuration/clustering) | [Clustering](https://redis.io/docs/latest/operate/rs/databases/durability-ha/clustering) | [Scale with Redis Cluster](https://redis.io/docs/latest/operate/oss\_and\_stack/management/scaling) | [Redis Enterprise clusters (REC)](https://redis.io/docs/latest/operate/kubernetes/re-clusters) |
| Replication | [Replication](https://redis.io/docs/latest/operate/rc/databases/configuration/high-availability) | [Replication](https://redis.io/docs/latest/operate/rs/databases/durability-ha/replication) | [Replication](https://redis.io/docs/latest/operate/oss\_and\_stack/management/replication) | [Create replica databases](https://redis.io/docs/latest/operate/kubernetes/re-databases/replica-redb/)|
| Active-Active geo-distribution | [Active-Active Redis](https://redis.io/docs/latest/operate/rc/databases/active-active) | [Active-Active Redis](https://redis.io/docs/latest/operate/rs/databases/active-active) | | [Active-Active databases](https://redis.io/docs/latest/operate/kubernetes/active-active/) |
| Rolling upgrades | [Upgrade database version](https://redis.io/docs/latest/operate/rc/databases/version-management/upgrade-version) | [Upgrade Redis Software](https://redis.io/docs/latest/operate/rs/installing-upgrading/upgrading) | | [Upgrade Redis for K8s](https://redis.io/docs/latest/operate/kubernetes/upgrade/) |
| Redis Flex/Auto tiering | [Create a Redis Flex database](https://redis.io/docs/latest/operate/rc/databases/create-database/create-flex-database) | [Redis Flex](https://redis.io/docs/latest/operate/rs/databases/flash) | | [Redis Flex](https://redis.io/docs/latest/operate/kubernetes/flex/) |
| Persistence | [Data persistence](https://redis.io/docs/latest/operate/rc/databases/configuration/data-persistence) | [Persistence](https://redis.io/docs/latest/operate/rs/databases/configure/database-persistence) | [Persistence](https://redis.io/docs/latest/operate/oss\_and\_stack/management/replication) | [Persistence volumes](https://redis.io/docs/latest/operate/kubernetes/recommendations/persistent-volumes/)|
| Recovery | Automatic | [Recover cluster](https://redis.io/docs/latest/operate/rs/clusters/cluster-recovery) | [Manual failover](https://redis.io/docs/latest/operate/oss\_and\_stack/management/scaling#manual-failover) | [Cluster recovery](https://redis.io/docs/latest/operate/kubernetes/re-clusters/cluster-recovery/) |
| Backups | [Back up a database](https://redis.io/docs/latest/operate/rc/databases/back-up-data) | [Schedule backups](https://redis.io/docs/latest/operate/rs/databases/import-export/schedule-backups) | [Persistence](https://redis.io/docs/latest/operate/oss\_and\_stack/management/replication) | [REDB spec.backup](https://redis.io/docs/latest/operate/kubernetes/reference/api/redis\_enterprise\_database\_api/#specbackup) |
### Logging and monitoring
| |  Redis Cloud |  Redis Software |  Redis Open Source |  Redis for Kubernetes |
|:-----------|:--------------|:-----------|:--------------|:--------------|
| Monitoring | [Monitor performance](https://redis.io/docs/latest/operate/rc/databases/monitor-performance) | [Monitoring](https://redis.io/docs/latest/operate/rs/monitoring) | [INFO](https://redis.io/docs/latest/commands/info), [MONITOR](https://redis.io/docs/latest/commands/monitor), and [LATENCY DOCTOR](https://redis.io/docs/latest/commands/latency-doctor)
[Analysis with Redis Insight](https://redis.io/docs/latest/develop/tools/insight#database-analysis) | [Export metrics to Prometheus](https://redis.io/docs/latest/operate/kubernetes/re-clusters/connect-prometheus-operator/) |
| Logging | [System logs](https://redis.io/docs/latest/operate/rc/logs-reports/system-logs) | [Logging](https://redis.io/docs/latest/operate/rs/clusters/logging) | `/var/log/redis/redis.log`
[SLOWLOG](https://redis.io/docs/latest/commands/slowlog)
[Keyspace notifications](https://redis.io/docs/latest/develop/pubsub/keyspace-notifications) | [Logs](https://redis.io/docs/latest/operate/kubernetes/logs/) |
| Alerts | [Alerts](https://redis.io/docs/latest/operate/rc/databases/monitor-performance#configure-metric-alerts) | [Alerts and events](https://redis.io/docs/latest/operate/rs/clusters/logging/alerts-events) | [Pub/sub with Redis Sentinel](https://redis.io/docs/latest/operate/oss\_and\_stack/management/sentinel#pubsub-messages) | [REDB alertSettings](https://redis.io/docs/latest/operate/kubernetes/reference/api/redis\_enterprise\_database\_api/#specalertsettings) |
| Support | [Contact support](https://redis.io/support/) | [Create support package](https://redis.io/docs/latest/operate/rs/installing-upgrading/creating-support-package) | | [Contact support](https://redis.io/support/) |
### Security
| |  Redis Cloud |  Redis Software |  Redis Open Source | Redis for Kubernetes |
|:-----------|:--------------|:-----------|:--------------|:--------------|
| Transport Layer Security (TLS) | [TLS](https://redis.io/docs/latest/operate/rc/security/database-security/tls-ssl) | [TLS](https://redis.io/docs/latest/operate/rs/security/encryption/tls) | [TLS](https://redis.io/docs/latest/operate/oss\_and\_stack/management/security/encryption) | [REDB tlsMode](https://redis.io/docs/latest/operate/kubernetes/reference/api/redis\_enterprise\_database\_api/#spec) |
| Role-based access control (RBAC) | [Role-based access control](https://redis.io/docs/latest/operate/rc/security/access-control/data-access-control/role-based-access-control) | [Access control](https://redis.io/docs/latest/operate/rs/security/access-control) | [Access control list](https://redis.io/docs/latest/operate/oss\_and\_stack/management/security/acl) | [REC credentials](https://redis.io/docs/latest/operate/kubernetes/security/authentication/manage-rec-credentials/) |
| Lightweight Directory Access Protocol (LDAP) | | [LDAP authentication](https://redis.io/docs/latest/operate/rs/security/access-control/ldap) | | [Enable LDAP](https://redis.io/docs/latest/operate/kubernetes/security/authentication/ldap/) |
| Single sign-on (SSO) | [SAML SSO](https://redis.io/docs/latest/operate/rc/security/access-control/saml-sso) | | | |
| Self-signed certificates | | [Certificates](https://redis.io/docs/latest/operate/rs/security/certificates) | [Certificate configuration](https://redis.io/docs/latest/operate/oss\_and\_stack/management/security/encryption#certificate-configuration) | [REC certificates](https://redis.io/docs/latest/operate/kubernetes/security/certificates/manage-rec-certificates/) |
| Internode encryption | [Encryption at rest](https://redis.io/docs/latest/operate/rc/security/encryption-at-rest) | [Internode encryption](https://redis.io/docs/latest/operate/rs/security/encryption/internode-encryption) | | [Enable internode encryption](https://redis.io/docs/latest/operate/kubernetes/security/certificates/internode-encryption/) |
| Auditing | | [Audit events](https://redis.io/docs/latest/operate/rs/security/audit-events) | [Keyspace notifications](https://redis.io/docs/latest/develop/pubsub/keyspace-notifications) | |
