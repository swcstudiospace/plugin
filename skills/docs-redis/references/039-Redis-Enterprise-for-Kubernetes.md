# Redis Enterprise for Kubernetes

Source: https://redis.io/docs/latest/operate/kubernetes/index.html.md

# Redis Enterprise for Kubernetes
```json metadata
{
"title": "Redis Enterprise for Kubernetes",
"description": "Deploy and manage Redis Enterprise on Kubernetes with the Redis Enterprise operator.",
"categories": ["docs","operate","kubernetes"],
"tableOfContents": {"sections":[{"id":"get-started","title":"Get started"},{"id":"redis-enterprise-clusters-rec","title":"Redis Enterprise clusters (REC)"},{"id":"redis-enterprise-databases-redb","title":"Redis Enterprise databases (REDB)"},{"id":"active-active-databases","title":"Active-Active databases"},{"id":"security","title":"Security"},{"id":"reference","title":"Reference"},{"id":"logs-monitoring","title":"Logs \u0026 monitoring"},{"id":"upgrade","title":"Upgrade"},{"id":"release-notes","title":"Release notes"},{"id":"related-info","title":"Related info"}]}
,
"codeExamples": []
}
```
Redis Enterprise for Kubernetes brings Redis Enterprise to Kubernetes environments through the Redis Enterprise operator. You can deploy, scale, and manage Redis Enterprise clusters and databases by using native Kubernetes resources and workflows.
Redis Enterprise for Kubernetes provides all the enterprise features of Redis Software:
- Linear scalability with Redis clustering
- High availability with automatic failover
- Active-Active geo-distribution
- Redis Flex for cost optimization
- Enterprise-grade security and encryption
- 24/7 support
The Redis Enterprise operator simplifies deployment and management by providing custom resource definitions (CRDs) for Redis Enterprise clusters (REC) and databases (REDB). This approach enables GitOps workflows and Kubernetes-native operations.
Redis Enterprise for Kubernetes is compatible with [CNCF-conformant](https://www.cncf.io/training/certification/software-conformance/) Kubernetes platforms. The operator follows standard Kubernetes APIs and practices and is designed to run consistently across certified Kubernetes environments.
## Get started
Deploy Redis Enterprise on your Kubernetes cluster and create your first database.
- [Quick start deployment](https://redis.io/docs/latest/operate/kubernetes/deployment/quick-start)
- [Deploy with Helm](https://redis.io/docs/latest/operate/kubernetes/deployment/helm)
- [Deploy on OpenShift](https://redis.io/docs/latest/operate/kubernetes/deployment/openshift)
- [Supported Kubernetes distributions](https://redis.io/docs/latest/operate/kubernetes/reference/supported\_k8s\_distributions)
## Redis Enterprise clusters (REC)
Create and manage [Redis Enterprise clusters](https://redis.io/docs/latest/operate/kubernetes/re-clusters) on Kubernetes.
- [Connect to admin console](https://redis.io/docs/latest/operate/kubernetes/re-clusters/connect-to-admin-console)
- [Redis Flex](https://redis.io/docs/latest/operate/kubernetes/flex)
- [Multi-namespace deployment](https://redis.io/docs/latest/operate/kubernetes/re-clusters/multi-namespace)
- [Cluster recovery](https://redis.io/docs/latest/operate/kubernetes/re-clusters/cluster-recovery)
- [REC API reference](https://redis.io/docs/latest/operate/kubernetes/reference/api/redis\_enterprise\_cluster\_api)
## Redis Enterprise databases (REDB)
Create and manage [Redis Enterprise databases](https://redis.io/docs/latest/operate/kubernetes/re-databases) using Kubernetes resources.
- [Database controller](https://redis.io/docs/latest/operate/kubernetes/re-databases/db-controller)
- [Create replica databases](https://redis.io/docs/latest/operate/kubernetes/re-databases/replica-redb)
- [REDB API reference](https://redis.io/docs/latest/operate/kubernetes/reference/api/redis\_enterprise\_database\_api)
## Active-Active databases
Set up globally distributed [Active-Active databases](https://redis.io/docs/latest/operate/kubernetes/active-active) across multiple Kubernetes clusters.
- [Prepare participating clusters](https://redis.io/docs/latest/operate/kubernetes/active-active/prepare-clusters)
- [Create Active-Active database](https://redis.io/docs/latest/operate/kubernetes/active-active/create-reaadb)
- [Global configuration](https://redis.io/docs/latest/operate/kubernetes/active-active/global-config)
- [REAADB API reference](https://redis.io/docs/latest/operate/kubernetes/reference/api/redis\_enterprise\_active\_active\_database\_api)
- [Remote cluster API reference](https://redis.io/docs/latest/operate/kubernetes/reference/api/redis\_enterprise\_remote\_cluster\_api)
## Security
Manage [secure connections](https://redis.io/docs/latest/operate/kubernetes/security) and access control for your Redis Enterprise deployment.
- [Access control](https://redis.io/docs/latest/operate/kubernetes/security/access-control)
- [Manage REC credentials](https://redis.io/docs/latest/operate/kubernetes/security/authentication/manage-rec-credentials)
- [Manage REC certificates](https://redis.io/docs/latest/operate/kubernetes/security/certificates/manage-rec-certificates)
- [Internode encryption](https://redis.io/docs/latest/operate/kubernetes/security/certificates/internode-encryption)
- [LDAP authentication](https://redis.io/docs/latest/operate/kubernetes/security/authentication/ldap)
## Reference
Use the Kubernetes API and command-line tools to manage your Redis Enterprise deployment.
- [Redis Enterprise cluster API (REC)](https://redis.io/docs/latest/operate/kubernetes/reference/api/redis\_enterprise\_cluster\_api)
- [Redis Enterprise database API (REDB)](https://redis.io/docs/latest/operate/kubernetes/reference/api/redis\_enterprise\_database\_api)
- [Active-Active database API (REAADB)](https://redis.io/docs/latest/operate/kubernetes/reference/api/redis\_enterprise\_active\_active\_database\_api)
- [Remote cluster API (RERC)](https://redis.io/docs/latest/operate/kubernetes/reference/api/redis\_enterprise\_remote\_cluster\_api)
## Logs & monitoring
Monitor and troubleshoot your Redis Enterprise deployment.
- [Collect logs](https://redis.io/docs/latest/operate/kubernetes/logs/collect-logs)
- [Connect to Prometheus operator](https://redis.io/docs/latest/operate/kubernetes/re-clusters/connect-prometheus-operator)
## Upgrade
Keep your Redis Enterprise deployment up to date.
- [Upgrade Redis cluster](https://redis.io/docs/latest/operate/kubernetes/upgrade/upgrade-redis-cluster)
- [Upgrade with OpenShift CLI](https://redis.io/docs/latest/operate/kubernetes/upgrade/openshift-cli)
- [Upgrade with OLM](https://redis.io/docs/latest/operate/kubernetes/upgrade/upgrade-olm)
## Release notes
Stay informed about new features, enhancements, and fixes.
- [Release notes](https://redis.io/docs/latest/operate/kubernetes/release-notes)
## Related info
- [Redis Enterprise Software](https://redis.io/docs/latest/operate/rs)
- [Redis Cloud](https://redis.io/docs/latest/operate/rc)
- [Redis Open Source](https://redis.io/docs/latest/operate/oss\_and\_stack)
- [Glossary](https://redis.io/docs/latest/glossary)
