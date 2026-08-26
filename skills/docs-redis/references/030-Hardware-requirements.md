# Hardware requirements

Source: https://redis.io/docs/latest/operate/rs/installing-upgrading/install/plan-deployment/hardware-requirements/index.html.md

# Hardware requirements
```json metadata
{
"title": "Hardware requirements",
"description": "Redis Software hardware requirements for development and production environments.",
"categories": ["docs","operate","rs","kubernetes"],
"tableOfContents": {"sections":[{"children":[{"id":"general-database-sizing-general-sizing","title":"General database sizing {#general-sizing}"},{"id":"active-active-database-sizing-active-active-sizing","title":"Active-Active database sizing {#active-active-sizing}"},{"id":"sizing-databases-with-auto-tiering-enabled-redis-on-flash-sizing","title":"Sizing databases with Auto Tiering enabled {#redis-on-flash-sizing}"}],"id":"sizing-considerations","title":"Sizing considerations"}]}
,
"codeExamples": []
}
```The hardware requirements for Redis Software are different for development and production environments.
- In a development environment, you can test your application with a live database.
If you want to test your application under production conditions, use the production environment requirements.
- In a production environment, you must have enough resources to handle the load on the database and recover from failures.
## Architecture
Redis Software supports AMD64 (x86\_64) and ARM64 architectures as shown in the following table:
| Operating system | AMD64 (x86\_64) support | ARM64 support |
|------------------|------------------------|---------------|
| RHEL 9 | :white\_check\_mark: Redis Software 7.4.2 and later | :white\_check\_mark: Redis Software 8.0.10 and later |
| RHEL 8 | :white\_check\_mark: Redis Software 6.2.8 and later | :x: Not supported |
| Ubuntu 22 | :white\_check\_mark: Redis Software 7.8.4-66 and later | :white\_check\_mark: Redis Software 8.0.10 and later |
| Ubuntu 20 | :white\_check\_mark: Redis Software 6.4.2-43 and later | :x: Not supported |
| Amazon Linux 2 | :white\_check\_mark: Redis Software 6.4.2-69 and later | :x: Not supported |
## Development environment
You can build your development environment with non-production hardware, such as a laptop, desktop, or small VM or instance,
and with these hardware requirements:
| Item | Description | Minimum requirements | Recommended |
|------------|-----------------|------------|-----------------|
| Nodes per cluster | You can install on one node but many features require at least two nodes. | 1 node | >= 2 nodes |
| RAM per node | The amount of RAM for each node. | 4GB | >= 10GB |
| Storage per node | The amount of storage space for each node. | 10GB | >= 20GB |
## Production environment
We recommend these hardware requirements for production systems or for development systems that are designed to demonstrate production use cases:
| Item | Description | Minimum requirements | Recommended |
|------------|-----------------|------------|-----------------|
| Nodes[1](#table-note-1) per cluster | At least three nodes are required to support a reliable, highly available deployment that handles process failure, node failure, and network split events in a consistent manner. | 3 nodes | >= 3 nodes (Must be an odd number of nodes) |
| Cores[2](#table-note-2) per node | Redis Software is based on a multi-tenant architecture and can run multiple Redis processes (or shards) on the same core without significant performance degradation. | 2 cores | >=8 cores |
| RAM[3](#table-note-3) per node | Defining your RAM size must be part of the capacity planning for your Redis usage. | 8GB | >=32GB |
| Ephemeral storage | Used for storing [replication files (RDB format) and cluster log files](https://redis.io/docs/latest/operate/rs/installing-upgrading/install/plan-deployment/persistent-ephemeral-storage). | RAM x 2 | >= RAM x 4 |
| Persistent storage[4](#table-note-4) | Used for storing [snapshot (RDB format) and AOF files](https://redis.io/docs/latest/operate/rs/installing-upgrading/install/plan-deployment/persistent-ephemeral-storage) over a persistent storage media, such as AWS Elastic Block Storage (EBS) or Azure Data Disk. | RAM x 3 | In-memory >= RAM x 4 (except for [extreme 'write' scenarios](https://redis.io/docs/latest/operate/rs/clusters/optimize/disk-sizing-heavy-write-scenarios))

 [Redis Flex and Auto Tiering](https://redis.io/docs/latest/operate/rs/databases/flash/) >= (RAM + Flash) x 4. |
| Network[5](#table-note-5) | We recommend using multiple NICs per node where each NIC is >1Gbps, but Redis Software can also run over a single 1Gbps interface network used for processing application requests, inter-cluster communication, and storage access. | 1G | >=10G |
| Local disk for [Auto Tiering](https://redis.io/docs/latest/operate/rs/databases/flash/) | Used to extend an Auto Tiering database's DRAM capacity with solid state drives (SSDs). Flash memory must be locally attached. [Read more](https://redis.io/docs/latest/operate/rs/databases/flash/) | (RAM+Flash) x 1.6 | (RAM+Flash) x 2.5 |
| Local disk for [Flex](https://redis.io/docs/latest/operate/rs/flex/)[6](#table-note-6) | Used to extend a Flex database's DRAM capacity with solid state drives (SSDs). Flash memory must be locally attached. [Read more](https://redis.io/docs/latest/operate/rs/flex/) | (Total memory limit of all Flex databases on the node) x 3 | (Total memory limit of all Flex databases on the node) x 3 |
Additional considerations:
1. Nodes per cluster:
- Clusters with more than 35 nodes are not supported. Please contact the Redis support team for assistance if your sizing calls for deploying a larger number of nodes.
- Quorum nodes also must comply with the above minimal hardware requirements.
- To ensure synchronization and consistency, Active-Active deployments with three-node clusters should not use quorum nodes. Because quorum nodes do not store data shards, they cannot support replication. In case of a node failure, replica shards aren't available for Active-Active synchronization.
2. Cores:
- When the CPU load reaches a certain level, Redis Software sends an alert to the operator.
- If your application is designed to put a lot of load on your Redis database, make sure that you have at least one available core for each shard of your database.
- If some of the cluster nodes are utilizing more than 80% of the CPU, consider migrating busy resources to less busy nodes.
- If all the cluster nodes are utilizing over 80% of the CPU, highly consider scaling out the cluster by [adding a node](https://redis.io/docs/latest/operate/rs/clusters/add-node).
3.  RAM:
- Redis uses a relatively large number of buffers, which enable replica communication, client communication, pub/sub commands, and more. As a result, you should ensure that 30% of the RAM is available on each node at any given time.
- If one or more cluster nodes utilizes more than 65% of the RAM, consider migrating resources to less active nodes.
- If all cluster nodes are utilizing more than 70% of available RAM, highly consider [adding a node](https://redis.io/docs/latest/operate/rs/clusters/add-node).
- Do not run any other memory-intensive processes on the Redis Software node.
4. Persistent storage:
- If no databases on the cluster have [persistence](https://redis.io/docs/latest/operate/rs/installing-upgrading/install/plan-deployment/persistent-ephemeral-storage) enabled, minimum persistent storage is RAM x 1.1 and the recommended persistent storage is RAM x 2. Persistent storage is essential because Redis Software also uses it to maintain the cluster and database health, configurations, recovery procedures, and more.
5. Network:
- Only static IP addresses are supported to ensure nodes remain part of the cluster after a reboot.
6. Local disk for Flex:
- Because you can increase a database's memory limit after creation, size the local disk for the expected peak memory limit.
## Sizing considerations
### General database sizing {#general-sizing}
Factors to consider when sizing your database.
- \*\*Dataset size\*\* – Your limit should be greater than your dataset size to leave room for overhead.
- \*\*Database throughput\*\* – High throughput needs more shards, leading to a higher memory limit.
- [\*\*Modules\*\*](https://redis.io/docs/latest/operate/oss\_and\_stack/stack-with-enterprise) – Using modules with your database consumes more memory.
- [\*\*Database clustering\*\*](https://redis.io/docs/latest/operate/rs/databases/durability-ha/clustering) – Allows you to spread your data into shards across multiple nodes.
- [\*\*Database replication\*\*](https://redis.io/docs/latest/operate/rs/databases/durability-ha/replication) – Enabling replication doubles memory consumption.
### Active-Active database sizing {#active-active-sizing}
Additional factors for sizing Active-Active databases:
- [\*\*Active-Active replication\*\*](https://redis.io/docs/latest/operate/rs/databases/active-active) – Requires double the memory of regular replication, which can be up to two times (2x) the original data size per instance.
- [\*\*Database replication backlog\*\*](https://redis.io/docs/latest/operate/rs/databases/durability-ha/replication#database-replication-backlog) – For synchronization between shards. By default, this is set to 1% of the database size.
- [\*\*Active-Active replication backlog\*\*](https://redis.io/docs/latest/operate/rs/databases/active-active/manage#replication-backlog) – For synchronization between clusters. By default, this is set to 1% of the database size.
Active-Active databases have a lower threshold for activating the eviction policy, because it requires propagation to all participating clusters. The eviction policy starts to evict keys when one of the Active-Active instances reaches 80% of its memory limit.
### Sizing databases with Auto Tiering enabled {#redis-on-flash-sizing}
Additional factors for sizing databases with Auto Tiering enabled:
- [\*\*Database persistence\*\*](https://redis.io/docs/latest/operate/rs/databases/configure/database-persistence#redis-on-flash-data-persistence) – Auto Tiering uses dual database persistence where both the primary and replica shards persist to disk. This may add some processor and network overhead, especially in cloud configurations with network-attached storage.
