# Prometheus metrics v2

Source: https://redis.io/docs/latest/integrate/prometheus-with-redis-enterprise/prometheus-metrics-definitions/index.html.md

# Prometheus metrics v2
```json metadata
{
"title": "Prometheus metrics v2",
"description": "V2 metrics available to Prometheus as of Redis Software version 7.8.2.",
"categories": ["docs","integrate","rs"],
"group": "observability",
"tableOfContents": {"sections":[]}
,
"codeExamples": []
}
```
You can [integrate Redis Software with Prometheus and Grafana](https://redis.io/docs/latest/integrate/prometheus-with-redis-enterprise/) to create dashboards for important metrics.
The v2 metrics in the following tables are available as of Redis Software version 7.8.0. For help transitioning from v1 metrics to v2 PromQL, see [Prometheus v1 metrics and equivalent v2 PromQL](https://redis.io/docs/latest/integrate/prometheus-with-redis-enterprise/prometheus-metrics-v1-to-v2).
The v2 scraping endpoint also exposes metrics for `node\_exporter` version 1.8.1. For more information, see the [Prometheus node\_exporter GitHub repository](https://github.com/prometheus/node\_exporter).
## Database metrics
| Metric | Type | Unit | Description |
| :-------- | :--- | :--- | :---------- |
| endpoint\_accepted\_connections | counter | count | Number of incoming accepted client connections |
| endpoint\_client\_connections | counter | count | Number of client connection establishment events |
| endpoint\_client\_disconnections | counter | count | Number of client disconnections initiated by the client |
| endpoint\_client\_connection\_expired | counter | count | Total number of client connections with expired TTL (Time To Live) |
| endpoint\_client\_establishment\_failures | counter | count | Number of client connections that failed to establish properly |
| endpoint\_client\_expiration\_refresh | counter | count | Number of expiration time changes of clients |
| endpoint\_client\_tracking\_off\_requests | counter | count | Total number of `CLIENT TRACKING OFF` requests |
| endpoint\_client\_tracking\_on\_requests | counter | count | Total number of `CLIENT TRACKING ON` requests |
| endpoint\_connections\_rate | gauge | connections/second | The rate of incoming connections. Computed as `n\_accepted / N` for the last interval where `n\_accepted` is the number of accepted connections in this interval, and `N` is the interval in seconds. |
| endpoint\_disconnected\_cba\_client | counter | count | Number of certificate-based clients disconnected |
| endpoint\_disconnected\_ldap\_client | counter | count | Number of LDAP clients disconnected |
| endpoint\_disconnected\_user\_password\_client | counter | count | Number of user&password clients disconnected |
| endpoint\_dispatch\_failures | counter | count | Number of clients closed due to failure to be dispatched to workers |
| endpoint\_disposed\_commands\_after\_client\_caching | counter | count | Total number of client caching commands that were disposed due to misuse |
| endpoint\_egress | counter | bytes | Number of egress bytes |
| endpoint\_egress\_pending | counter | bytes | Number of send-pending bytes |
| endpoint\_egress\_pending\_discarded | counter | bytes | Number of send-pending bytes that were discarded due to disconnection |
| endpoint\_failed\_cba\_authentication | counter | count | Number of clients that failed certificate-based authentication |
| endpoint\_failed\_ldap\_authentication | counter | count | Number of clients that failed LDAP authentication |
| endpoint\_failed\_user\_password\_authentication | counter | count | Number of clients that failed user password authentication |
| endpoint\_ingress | counter | bytes | Number of ingress bytes |
| endpoint\_longest\_pipeline\_histogram | histogram | count | Tracks the distribution of longest observed pipeline lengths, where a pipeline is a sequence of client commands sent without waiting for responses. |
| endpoint\_other\_requests | counter | count | Number of other requests |
| endpoint\_other\_requests\_latency\_histogram | histogram | microseconds | Latency (in µs) histogram of other commands |
| endpoint\_other\_requests\_latency\_histogram\_bucket | histogram | microseconds | Latency histograms for commands other than read or write commands. Can be used to represent different latency percentiles.
p99.9 example:
`histogram\_quantile(0.999, sum(rate(endpoint\_other\_requests\_latency\_histogram\_bucket{cluster="$cluster", db="$db"}[$\_\_rate\_interval]) ) by (le, db))` |
| endpoint\_other\_responses | counter | count | Number of other responses |
| endpoint\_ping\_failures | gauge | count | Number of consecutive endpoint ping failures. Labels: endpoint\_uid |
| endpoint\_ping\_failure\_duration\_seconds | gauge | seconds | Duration of ongoing endpoint failures (0 when healthy). Labels: endpoint\_uid |
| endpoint\_proxy\_disconnections | counter | count | Number of client disconnections initiated by the proxy |
| endpoint\_rate\_limit\_ok | gauge | — | Rate limit status based on the last 2 intervals.
0 = rate limit was recently exceeded
1 = rate limit was not recently exceeded |
| endpoint\_rate\_limit\_overflows | counter | count | Total number of rate limit overflows |
| endpoint\_read\_requests | counter | count | Number of read requests |
| endpoint\_read\_requests\_latency\_histogram | histogram | microseconds | Latency (in µs) histogram of read commands |
| endpoint\_read\_requests\_latency\_histogram\_bucket | histogram | microseconds | Latency histograms for read commands. Can be used to represent different latency percentiles.
p99.9 example:
`histogram\_quantile(0.999, sum(rate(endpoint\_read\_requests\_latency\_histogram\_bucket{cluster="$cluster", db="$db"}[$\_\_rate\_interval]) ) by (le, db))` |
| endpoint\_read\_responses | counter | count | Number of read responses |
| endpoint\_successful\_cba\_authentication | counter | count | Number of clients that successfully authenticated with certificate-based authentication |
| endpoint\_successful\_ldap\_authentication | counter | count | Number of clients that successfully authenticated with LDAP |
| endpoint\_successful\_user\_password\_authentication | counter | count | Number of clients that successfully authenticated with user&password |
| endpoint\_write\_requests | counter | count | Number of write requests |
| endpoint\_write\_requests\_latency\_histogram | histogram | microseconds | Latency (in µs) histogram of write commands |
| endpoint\_write\_requests\_latency\_histogram\_bucket | histogram | microseconds | Latency histograms for write commands. Can be used to represent different latency percentiles.
p99.9 example:
`histogram\_quantile(0.999, sum(rate(endpoint\_write\_requests\_latency\_histogram\_bucket{cluster="$cluster", db="$db"}[$\_\_rate\_interval]) ) by (le, db))` |
| endpoint\_write\_responses | counter | count | Number of write responses |
| db\_config | gauge | — | This is an information metric that holds database configuration within labels such as: db\_name, db\_version, db\_port, tls\_mode |
| db\_status | gauge | — | This is a status metric that reports on various database statuses: 0 = active, 1 = active-change-pending, 2 = pending, 3 = import-pending, 4 = delete-pending, 5 = recovery, 99 = unknown |
| db\_tags | gauge | — | Information metric that exposes database tags as labels; the value is always `1`. See [Database tags in metrics](https://redis.io/docs/latest/operate/rs/monitoring/metrics\_stream\_engine/db-tags-in-metrics). |
## Node metrics
| Metric | Type | Unit | Description |
| :-------- | :--- | :--- | :---------- |
| node\_available\_flash\_bytes | gauge | bytes | Available flash in the node (bytes) |
| node\_available\_flash\_no\_overbooking\_bytes | gauge | bytes | Available flash in the node (bytes), without taking into account overbooking |
| node\_available\_memory\_bytes | gauge | bytes | Amount of free memory in the node (bytes) |
| node\_available\_memory\_no\_overbooking\_bytes | gauge | bytes | Available RAM in the node (bytes) without taking into account overbooking |
| node\_bigstore\_free\_bytes | gauge | bytes | Sum of free space of back-end flash (used by flash database's [BigRedis]) on all cluster nodes (bytes); returned only when BigRedis is enabled |
| node\_cert\_expires\_in\_seconds | gauge | seconds | Certificate expiration (in seconds) per given node; read more about [certificates in Redis Software](https://redis.io/docs/latest/operate/rs/security/certificates) and [monitoring certificates](https://redis.io/docs/latest/operate/rs/security/certificates/monitor-certificates) |
| customer\_managed\_ine\_certificates | gauge | — | Indicates whether customer-provided internode encryption certificates are in use
0=No
1=Yes |
| node\_ephemeral\_storage\_avail\_bytes | gauge | bytes | Disk space available to RLEC processes on configured ephemeral disk (bytes) |
| node\_ephemeral\_storage\_free\_bytes | gauge | bytes | Free disk space on configured ephemeral disk (bytes) |
| node\_memory\_MemFree\_bytes | gauge | bytes | Free memory in the node (bytes) |
| node\_persistent\_storage\_avail\_bytes | gauge | bytes | Disk space available to RLEC processes on configured persistent disk (bytes) |
| node\_persistent\_storage\_free\_bytes | gauge | bytes | Free disk space on configured persistent disk (bytes) |
| node\_provisional\_flash\_bytes | gauge | bytes | Amount of flash available for new shards on this node, taking into account overbooking, max Redis servers, reserved flash, and provision and migration thresholds (bytes) |
| node\_provisional\_flash\_no\_overbooking\_bytes | gauge | bytes | Amount of flash available for new shards on this node, without taking into account overbooking, max Redis servers, reserved flash, and provision and migration thresholds (bytes) |
| node\_provisional\_memory\_bytes | gauge | bytes | Amount of RAM that is available for provisioning to databases out of the total RAM allocated for databases |
| node\_provisional\_memory\_no\_overbooking\_bytes | gauge | bytes | Amount of RAM that is available for provisioning to databases out of the total RAM allocated for databases, without taking into account overbooking |
| node\_metrics\_up | gauge | — | Node is part of the cluster and is connected (1 = connected, 0 = not connected) |
| dmc\_ping\_failures | gauge | count | Number of consecutive DMC ping failures |
| dmc\_ping\_failure\_duration\_seconds | gauge | seconds | Duration of ongoing DMC failures (0 when healthy) |
## Cluster metrics
| Metric | Type | Unit | Description |
| :-------- | :--- | :--- | :---------- |
| generation{node=} | gauge | — | Current generation (state-version) number of the cluster watchdog on the specific node |
| has\_quorum{node=, has\_witness\_disk=BOOL} | gauge | — | Has\_quorum = 1
No quorum = 0 |
| is\_primary{node=} | gauge | — | primary = 1
secondary = 0 |
| license\_expiration\_days | gauge | days | Number of days until the license expires |
| license\_shards\_limit | gauge | count | Total shard limit by the license by shard type (ram / flash) |
| total\_live\_nodes\_count{node=} | gauge | count | Number of live nodes |
| total\_nodes\_count{node=} | gauge | count | Number of nodes |
| primary\_selections\_total{node=} | counter | count | Monotonic counter for each selection process that started |
| users\_count | gauge | count | Current number of users on the cluster |
## Replication metrics
| Metric | Type | Unit | Description |
| :-------- | :--- | :--- | :---------- |
| database\_syncer\_config | gauge | — | Used as a placeholder for configuration labels |
| database\_syncer\_current\_status | gauge | — | Syncer status for traffic; 0 = in-sync, 1 = out of sync |
| database\_syncer\_dst\_connectivity\_state | gauge | — | Destination connectivity state (1 = connected, 0 = disconnected) |
| database\_syncer\_dst\_connectivity\_state\_ms | gauge | milliseconds | Destination connectivity state duration |
| database\_syncer\_dst\_lag | gauge | milliseconds | Lag in milliseconds between the syncer and the destination |
| database\_syncer\_dst\_repl\_offset | gauge | bytes | Offset of the last command acknowledged |
| database\_syncer\_flush\_counter | gauge | count | Number of destination flushes |
| database\_syncer\_ingress\_bytes | gauge | bytes | Number of bytes read from source shard |
| database\_syncer\_ingress\_bytes\_decompressed | gauge | bytes | Number of bytes read from source shard |
| database\_syncer\_internal\_state | gauge | — | Internal state of the syncer |
| database\_syncer\_lag\_ms | gauge | milliseconds | Lag time between the source and the destination for traffic in milliseconds |
| database\_syncer\_rdb\_size | gauge | bytes | The source's RDB size in bytes to be transferred during the syncing phase |
| database\_syncer\_rdb\_transferred | gauge | bytes | Number of bytes transferred from the source's RDB during the syncing phase |
| database\_syncer\_src\_connectivity\_state | gauge | — | Source connectivity state (1 = connected, 0 = disconnected) |
| database\_syncer\_src\_connectivity\_state\_ms | gauge | milliseconds | Source connectivity state duration |
| database\_syncer\_src\_repl\_offset | gauge | bytes | Last known source offset |
| database\_syncer\_state | gauge | — | Internal state of the shard syncer |
| database\_syncer\_syncer\_repl\_offset | gauge | bytes | Offset of the last command handled by the syncer |
| database\_syncer\_total\_requests | gauge | count | Number of destination writes |
| database\_syncer\_total\_responses | gauge | count | Number of destination writes acknowledged |
## Shard metrics
| Metric | Type | Unit | Description |
| :-------- | :--- | :--- | :---------- |
| redis\_server\_active\_defrag\_running | gauge | percent | Automatic memory defragmentation current aggressiveness (% cpu) |
| redis\_server\_allocator\_active | gauge | bytes | Total used memory, including external fragmentation |
| redis\_server\_allocator\_allocated | gauge | bytes | Total allocated memory |
| redis\_server\_allocator\_resident | gauge | bytes | Total resident memory (RSS) |
| redis\_server\_aof\_last\_cow\_size | gauge | bytes | Last AOFR, CopyOnWrite memory |
| redis\_server\_aof\_rewrite\_in\_progress | gauge | — | Indicates whether an AOF rewrite is in progress (1 = in progress, 0 = otherwise) |
| redis\_server\_aof\_rewrites | gauge | count | Number of AOF rewrites this process executed |
| redis\_server\_aof\_delayed\_fsync | gauge | count | Number of times an AOF fsync caused delays in the main Redis thread (inducing latency); this can indicate that the disk is slow or overloaded |
| redis\_server\_blocked\_clients | gauge | count | Count the clients waiting on a blocking call |
| redis\_server\_connected\_clients | gauge | count | Number of client connections to the specific shard |
| redis\_server\_connected\_slaves | gauge | count | Number of connected replicas |
| redis\_server\_db\_avg\_ttl | gauge | milliseconds | Average TTL of all volatile keys |
| redis\_server\_db0\_avg\_ttl | gauge | milliseconds | Average TTL of all volatile keys. Deprecated. |
| redis\_server\_db\_keys | gauge | count | Total key count. |
| redis\_server\_db0\_keys | gauge | count | Total key count. Deprecated. |
| redis\_server\_evicted\_keys | gauge | count | Keys evicted so far (since restart) |
| redis\_server\_expire\_cycle\_cpu\_milliseconds | gauge | milliseconds | The cumulative amount of time spent on active expiry cycles |
| redis\_server\_expired\_keys | gauge | count | Keys expired so far since restart |
| redis\_server\_forwarding\_state | gauge | — | Shard forwarding state (1 = on, 0 = off) |
| redis\_server\_hashes\_items\_under\_1M | gauge | count | Number of hash keys with under 1 million elements |
| redis\_server\_hashes\_items\_1M\_to\_8M | gauge | count | Number of hash keys with an element count between 1 million and 8 million |
| redis\_server\_hashes\_items\_over\_8M | gauge | count | Number of hash keys with over 8 million elements |
| redis\_server\_keys\_trimmed | gauge | count | The number of keys that were trimmed in the current or last resharding process |
| redis\_server\_keyspace\_read\_hits | gauge | count | Number of read operations accessing an existing keyspace |
| redis\_server\_keyspace\_read\_misses | gauge | count | Number of read operations accessing a non-existing keyspace |
| redis\_server\_keyspace\_write\_hits | gauge | count | Number of write operations accessing an existing keyspace |
| redis\_server\_keyspace\_write\_misses | gauge | count | Number of write operations accessing a non-existing keyspace |
| redis\_server\_lists\_items\_under\_1M | gauge | count | Number of list keys with under 1 million elements |
| redis\_server\_lists\_items\_1M\_to\_8M | gauge | count | Number of list keys with an element count between 1 million and 8 million |
| redis\_server\_lists\_items\_over\_8M | gauge | count | Number of list keys with over 8 million elements |
| redis\_server\_master\_link\_status | gauge | — | Indicates whether the replica is connected to its master (1 = up, 2 = down, 3 = none, 99 = unknown) |
| redis\_server\_master\_repl\_offset | gauge | bytes | Number of bytes sent to replicas by the shard; calculate the throughput for a time period by comparing the value at different times |
| redis\_server\_master\_sync\_in\_progress | gauge | — | The primary shard is synchronizing (1 true; 0 false) |
| redis\_server\_max\_process\_mem | gauge | bytes | Current memory limit configured by redis\_mgr according to node free memory |
| redis\_server\_maxmemory | gauge | bytes | Current memory limit configured by redis\_mgr according to database memory limits.

To calculate the percent memory usage:
`sum by (cluster,db)(redis\_server\_used\_memory{role="master"}) / (avg by(cluster,db)(db\_memory\_limit\_bytes) / max by(cluster,db)(db\_replication\_factor))` |
| redis\_server\_mem\_aof\_buffer | gauge | bytes | Current size of AOF buffer |
| redis\_server\_mem\_clients\_normal | gauge | bytes | Current memory used for input and output buffers of non-replica clients |
| redis\_server\_mem\_clients\_slaves | gauge | bytes | Current memory used for input and output buffers of replica clients |
| redis\_server\_mem\_fragmentation\_ratio | gauge | ratio | Memory fragmentation ratio (1.3 means 30% overhead) |
| redis\_server\_mem\_not\_counted\_for\_evict | gauge | bytes | Portion of used\_memory (in bytes) that's not counted for eviction and OOM error |
| redis\_server\_mem\_replication\_backlog | gauge | bytes | Size of replication backlog |
| redis\_server\_slave\_buffer | gauge | bytes | Reports the effective replica output buffer hard limit for a shard, derived from the database slave\_buffer configuration. For slave\_buffer=auto, the hard limit is calculated as used\_memory \* auto\_slavebuf\_ratio / 100, then bounded by auto\_slavebuf\_min and auto\_slavebuf\_max. |
| redis\_server\_module\_fork\_in\_progress | gauge | — | A binary value that indicates if there is an active fork spawned by a module (1) or not (0) |
| namedprocess\_namegroup\_cpu\_seconds\_total | counter | seconds | Shard process CPU usage in seconds |
| namedprocess\_namegroup\_thread\_cpu\_seconds\_total | counter | seconds | Shard main thread CPU time spent in seconds |
| namedprocess\_namegroup\_open\_filedesc | gauge | count | Shard number of open file descriptors |
| namedprocess\_namegroup\_memory\_bytes | gauge | bytes | Shard memory size in bytes |
| namedprocess\_namegroup\_oldest\_start\_time\_seconds | gauge | timestamp seconds | Shard start time of the process since unix epoch in seconds |
| redis\_server\_rdb\_bgsave\_in\_progress | gauge | — | Indicates whether bgsave is currently in progress (1 = in progress, 0 = otherwise) |
| redis\_server\_rdb\_last\_cow\_size | gauge | bytes | Last bgsave (or SYNC fork) used CopyOnWrite memory |
| redis\_server\_rdb\_saves | gauge | count | Total count of bgsaves since the process was restarted (including replica fullsync and persistence) |
| redis\_server\_sets\_items\_under\_1M | gauge | count | Number of set keys with under 1 million elements |
| redis\_server\_sets\_items\_1M\_to\_8M | gauge | count | Number of set keys with an element count between 1 million and 8 million |
| redis\_server\_sets\_items\_over\_8M | gauge | count | Number of set keys with over 8 million elements |
| redis\_server\_repl\_touch\_bytes | gauge | bytes | Number of bytes sent to replicas as TOUCH commands by the shard as a result of a READ command that was processed; calculate the throughput for a time period by comparing the value at different times |
| redis\_server\_total\_commands\_processed | gauge | count | Number of commands processed by the shard; calculate the number of commands for a time period by comparing the value at different times |
| redis\_server\_total\_connections\_received | gauge | count | Number of connections received by the shard; calculate the number of connections for a time period by comparing the value at different times |
| redis\_server\_total\_net\_input\_bytes | gauge | bytes | Number of bytes received by the shard; calculate the throughput for a time period by comparing the value at different times |
| redis\_server\_total\_net\_output\_bytes | gauge | bytes | Number of bytes sent by the shard; calculate the throughput for a time period by comparing the value at different times |
| redis\_server\_up | gauge | — | Shard is up and running (1 = up, 0 = down) |
| redis\_server\_strings\_sizes\_under\_128M | gauge | count | Number of string keys with a memory size under 128 megabytes |
| redis\_server\_strings\_sizes\_128M\_to\_512M | gauge | count | Number of string keys with a memory size between 128 and 512 megabytes |
| redis\_server\_strings\_sizes\_over\_512M | gauge | count | Number of string keys with a memory size over 512 megabytes |
| redis\_server\_used\_memory | gauge | bytes | Memory used by shard (in BigRedis this includes flash) (bytes) |
| redis\_server\_zsets\_items\_under\_1M | gauge | count | Number of sorted set keys with under 1 million elements |
| redis\_server\_zsets\_items\_1M\_to\_8M | gauge | count | Number of sorted set keys with an element count between 1 million and 8 million |
| redis\_server\_zsets\_items\_over\_8M | gauge | count | Number of sorted set keys with over 8 million elements |
| redis\_server\_search\_gc\_bytes\_collected | gauge | bytes | The total amount of memory freed by the garbage collectors from indexes in the shard's memory in bytes. [4](#tnote-4) |
| redis\_server\_search\_bytes\_collected | gauge | bytes | The total amount of memory freed by the garbage collectors from indexes in the shard's memory in bytes. Deprecated in 8.0 (renamed redis\_server\_search\_gc\_bytes\_collected), but still available in older versions. [1](#tnote-1) |
| redis\_server\_search\_gc\_marked\_deleted\_vectors | gauge | count | The number of vectors marked as deleted in the vector indexes that have not yet been cleaned. [4](#tnote-4) |
| redis\_server\_search\_marked\_deleted\_vectors | gauge | count | The number of vectors marked as deleted in the vector indexes that have not yet been cleaned. Deprecated in 8.0 (renamed redis\_server\_search\_gc\_marked\_deleted\_vectors), but still available in older versions. [1](#tnote-1) |
| redis\_server\_search\_gc\_total\_cycles | gauge | count | The total number of garbage collection cycles executed. [4](#tnote-4) |
| redis\_server\_search\_total\_cycles | gauge | count | The total number of garbage collection cycles executed. Deprecated in 8.0 (renamed redis\_server\_search\_gc\_total\_cycles), but still available in older versions. [1](#tnote-1) |
| redis\_server\_search\_gc\_total\_docs\_not\_collected\_by\_gc | gauge | count | The number of documents marked as deleted, whose memory has not yet been freed by the garbage collector. [4](#tnote-4) |
| redis\_server\_search\_total\_docs\_not\_collected\_by\_gc | gauge | count | The number of documents marked as deleted, whose memory has not yet been freed by the garbage collector. Deprecated in 8.0 (renamed redis\_server\_search\_gc\_total\_docs\_not\_collected\_by\_gc), but still available in older versions. [1](#tnote-1) |
| redis\_server\_search\_gc\_total\_ms\_run | gauge | milliseconds | The total duration of all garbage collection cycles in the shard, measured in milliseconds. [4](#tnote-4) |
| redis\_server\_search\_total\_ms\_run | gauge | milliseconds | The total duration of all garbage collection cycles in the shard, measured in milliseconds. Deprecated in 8.0 (renamed redis\_server\_search\_gc\_total\_ms\_run), but still available in older versions. [1](#tnote-1) |
| redis\_server\_search\_cursors\_internal\_idle | gauge | count | The total number of coordinator cursors that are currently holding pending results in the shard. [4](#tnote-4) |
| redis\_server\_search\_cursors\_user\_idle | gauge | count | The total number of cursors that were explicitly requested by users, that are currently holding pending results in the shard. [4](#tnote-4) |
| redis\_server\_search\_global\_idle | gauge | count | The total number of user and internal cursors currently holding pending results in the shard. Deprecated in 8.0 (split into redis\_server\_search\_cursors\_internal\_idle and redis\_server\_search\_cursors\_user\_idle), but still available in older versions. [1](#tnote-1) |
| redis\_server\_search\_cursors\_internal\_active | gauge | count | The total number of coordinator cursors in the shard, either holding pending results or actively executing `FT.CURSOR READ`. [4](#tnote-4) |
| redis\_server\_search\_cursors\_user\_active | gauge | count | The total number of user cursors in the shard, either holding pending results or actively executing `FT.CURSOR READ`. [4](#tnote-4) |
| redis\_server\_search\_global\_total | gauge | count | The total number of user and internal cursors in the shard, either holding pending results or actively executing `FT.CURSOR READ`. Deprecated in 8.0 (split into redis\_server\_search\_cursors\_internal\_active and redis\_server\_search\_cursors\_user\_active), but still available in older versions. [1](#tnote-1) |
| redis\_server\_search\_number\_of\_indexes | gauge | count | Total number of indexes in the shard [1](#tnote-1) |
| redis\_server\_search\_number\_of\_active\_indexes | gauge | count | The total number of indexes running a background indexing and/or background query processing operation. Background indexing refers to vector ingestion process, or in-progress background indexer. [1](#tnote-1) |
| redis\_server\_search\_total\_num\_docs\_in\_indexes | gauge | count | The total number of documents currently indexed across all indexes in the shard. [2](#tnote-2) |
| redis\_server\_search\_number\_of\_active\_indexes\_running\_queries | gauge | count | Total count of indexes currently running a background query process. [1](#tnote-1) |
| redis\_server\_search\_number\_of\_active\_indexes\_indexing | gauge | count | Total count of indexes currently undergoing a background indexing process. Background indexing refers to vector ingestion process, or in-progress background indexer. This metric is limited by the number of WORKER threads allocated for writing operations + the number of indexes. [1](#tnote-1) |
| redis\_server\_search\_total\_active\_write\_threads | gauge | count | Total count of background write (indexing) processes currently running in the shard. Background indexing refers to vector ingestion process, or in-progress background indexer. This metric is limited by the number of threads allocated for writing operations. [1](#tnote-1) |
| redis\_server\_search\_fields\_text\_Text | gauge | count | The total number of `TEXT` fields across all indexes in the shard. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_text\_Sortable | gauge | count | The total number of `SORTABLE TEXT` fields across all indexes in the shard. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_text\_NoIndex | gauge | count | The total number of `NOINDEX TEXT` fields across all indexes in the shard; i.e., used for sorting only but not indexed. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_text\_IndexErrors | gauge | count | The total number of indexing failures caused by attempts to index a document containing a `TEXT` field. This field appears only if `TEXT` fields exist. [1](#tnote-1) |
| redis\_server\_search\_fields\_numeric\_Numeric | gauge | count | The total number of `NUMERIC` fields across all indexes in the shard. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_numeric\_Sortable | gauge | count | The total number of `SORTABLE NUMERIC` fields across all indexes in the shard. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_numeric\_NoIndex | gauge | count | The total number of `NOINDEX NUMERIC` fields across all indexes in the shard, which are used for sorting only but not indexed. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_numeric\_IndexErrors | gauge | count | The total number of indexing failures caused by attempts to index a document containing a `NUMERIC` field. This field appears only if `NUMERIC` fields exist. [1](#tnote-1) |
| redis\_server\_search\_fields\_tag\_Tag | gauge | count | The total number of `TAG` fields across all indexes in the shard. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_tag\_Sortable | gauge | count | The total number of `SORTABLE TAG` fields across all indexes in the shard. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_tag\_NoIndex | gauge | count | The total number of `NOINDEX TAG` fields across all indexes in the shard; i.e., used for sorting only but not indexed. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_tag\_CaseSensitive | gauge | count | The total number of `CASESENSITIVE TAG` fields across all indexes in the shard. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_tag\_IndexErrors | gauge | count | The total number of indexing failures caused by attempts to index a document containing a `TAG` field. This field appears only if `TAG` fields exist. [1](#tnote-1) |
| redis\_server\_search\_fields\_geo\_Geo | gauge | count | The total number of `GEO` fields across all indexes in the shard. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_geo\_Sortable | gauge | count | The total number of `SORTABLE GEO` fields across all indexes in the shard. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_geo\_NoIndex | gauge | count | The total number of `NOINDEX GEO` fields across all indexes in the shard; i.e., used for sorting only but not indexed. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_geo\_IndexErrors | gauge | count | The total number of indexing failures caused by attempts to index a document containing a `GEO` field. This field appears only if `GEO` fields exist. [1](#tnote-1) |
| redis\_server\_search\_fields\_vector\_Vector | gauge | count | The total number of `VECTOR` fields across all indexes in the shard. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_vector\_Flat | gauge | count | The total number of `FLAT VECTOR` fields across all indexes in the shard. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_vector\_HNSW | gauge | count | The total number of `HNSW VECTOR` fields across all indexes in the shard. This field appears only if its value is larger than 0. [1](#tnote-1) |
| redis\_server\_search\_fields\_vector\_SVS\_VAMANA | gauge | count | The total number of `SVS-VAMANA VECTOR` fields across all indexes in the shard. This field appears only if its value is larger than 0. [4](#tnote-4) |
| redis\_server\_search\_fields\_vector\_SVS\_VAMANA\_Compressed | gauge | count | The total number of `SVS-VAMANA VECTOR` fields with `COMPRESSION` enabled (e.g., `LVQ8`) across all indexes in the shard. This field appears only if its value is larger than 0. [4](#tnote-4) |
| redis\_server\_search\_fields\_vector\_IndexErrors | gauge | count | The total number of indexing failures caused by attempts to index a document containing a `VECTOR` field. This field appears only if `VECTOR` fields exist. [1](#tnote-1) |
| redis\_server\_search\_fields\_geoshape\_Geoshape | gauge | count | The total number of `GEOSHAPE` fields across all indexes in the shard. This field appears only if its value is larger than 0. [2](#tnote-2) |
| redis\_server\_search\_fields\_geoshape\_Sortable | gauge | count | The total number of `SORTABLE GEOSHAPE` fields across all indexes in the shard. This field appears only if its value is larger than 0. [2](#tnote-2) |
| redis\_server\_search\_fields\_geoshape\_NoIndex | gauge | count | The total number of `NOINDEX GEOSHAPE` fields across all indexes in the shard; i.e., used for sorting only but not indexed. This field appears only if its value is larger than 0. [2](#tnote-2) |
| redis\_server\_search\_fields\_geoshape\_IndexErrors | gauge | count | The total number of indexing failures caused by attempts to index a document containing a `GEOSHAPE` field. This field appears only if `GEOSHAPE` fields exist. [2](#tnote-2) |
| redis\_server\_search\_total\_indexing\_ops\_text\_fields | gauge | count | The total number of indexing operations performed on `TEXT` fields across all indexes in the shard. [2](#tnote-2) |
| redis\_server\_search\_total\_indexing\_ops\_tag\_fields | gauge | count | The total number of indexing operations performed on `TAG` fields across all indexes in the shard. [2](#tnote-2) |
| redis\_server\_search\_total\_indexing\_ops\_numeric\_fields | gauge | count | The total number of indexing operations performed on `NUMERIC` fields across all indexes in the shard. [2](#tnote-2) |
| redis\_server\_search\_total\_indexing\_ops\_geo\_fields | gauge | count | The total number of indexing operations performed on `GEO` fields across all indexes in the shard. [2](#tnote-2) |
| redis\_server\_search\_total\_indexing\_ops\_geoshape\_fields | gauge | count | The total number of indexing operations performed on `GEOSHAPE` fields across all indexes in the shard. [2](#tnote-2) |
| redis\_server\_search\_total\_indexing\_ops\_vector\_fields | gauge | count | The total number of indexing operations performed on `VECTOR` fields across all indexes in the shard. [2](#tnote-2) |
| redis\_server\_search\_used\_memory\_indexes | gauge | bytes | The total memory allocated by all indexes in the shard in bytes. [1](#tnote-1) |
| redis\_server\_search\_smallest\_memory\_index | gauge | bytes | The memory usage of the index with the smallest memory usage in the shard in bytes. [1](#tnote-1) |
| redis\_server\_search\_largest\_memory\_index | gauge | bytes | The memory usage of the index with the largest memory usage in the shard in bytes. [1](#tnote-1) |
| redis\_server\_search\_total\_indexing\_time | gauge | milliseconds | The total time spent on indexing operations, excluding the background indexing of vectors in the `HNSW` graph. [1](#tnote-1) |
| redis\_server\_search\_used\_memory\_vector\_index | gauge | bytes | The total memory usage of all vector indexes in the shard. [1](#tnote-1) |
| redis\_server\_search\_total\_queries\_processed | gauge | count | The total number of successful query executions (When using cursors, not counting reading from existing cursors) in the shard. [1](#tnote-1) |
| redis\_server\_search\_total\_query\_commands | gauge | count | The total number of successful query command executions (including `FT.SEARCH`, `FT.AGGREGATE`, and `FT.CURSOR READ`). [1](#tnote-1) |
| redis\_server\_search\_total\_query\_execution\_time\_ms | gauge | milliseconds | The cumulative execution time of all query commands, including `FT.SEARCH`, `FT.AGGREGATE`, and `FT.CURSOR READ`, measured in ms. [1](#tnote-1) |
| redis\_server\_search\_total\_active\_queries | gauge | count | The total number of background queries currently being executed in the shard, excluding `FT.CURSOR READ`. [1](#tnote-1) |
| redis\_server\_search\_total\_coord\_dispatch\_time\_ms | gauge | milliseconds | The cumulative time the coordinator spent building and dispatching query commands (`FT.SEARCH`, `FT.AGGREGATE`, and `FT.HYBRID`) to the shards, measured in ms. [4](#tnote-4) |
| redis\_server\_search\_errors\_indexing\_failures | gauge | count | The total number of indexing failures recorded across all indexes in the shard. [1](#tnote-1) |
| redis\_server\_search\_errors\_for\_index\_with\_max\_failures | gauge | count | The number of indexing failures in the index with the highest count of failures. [1](#tnote-1) |
| redis\_server\_search\_OOM\_indexing\_failures\_indexes\_count | gauge | count | The count of indexes that experienced out-of-memory (OOM) failures during background indexing. [2](#tnote-2) |
| redis\_server\_search\_shard\_total\_query\_errors\_syntax | gauge | count | The total number of query syntax errors occurred in the shard. [2](#tnote-2) |
| redis\_server\_search\_shard\_total\_query\_errors\_arguments | gauge | count | The total number of queries in the shard that failed due to missing or invalid arguments. [2](#tnote-2) |
| redis\_server\_search\_shard\_total\_query\_errors\_timeout | gauge | count | The total number of query timeout errors occurred in the shard (when timeout policy is 'fail'). [2](#tnote-2) |
| redis\_server\_search\_shard\_total\_query\_warnings\_timeout | gauge | count | The total number of query timeout warnings occurred in the shard (when timeout policy is 'return partial results'). [2](#tnote-2) |
| redis\_server\_search\_shard\_total\_query\_errors\_oom | gauge | count | The total number of query out-of-memory errors occurred in the shard. [4](#tnote-4) |
| redis\_server\_search\_shard\_total\_query\_warnings\_oom | gauge | count | The total number of query out-of-memory warnings occurred in the shard. [4](#tnote-4) |
| redis\_server\_search\_shard\_total\_query\_warnings\_max\_prefix\_expansions | gauge | count | The total number of max prefix expansion warnings occurred in the shard. [2](#tnote-2) |
| redis\_server\_search\_coord\_total\_query\_errors\_syntax | gauge | count | The total number of query syntax errors occurred at the coordinator. [2](#tnote-2) |
| redis\_server\_search\_coord\_total\_query\_errors\_arguments | gauge | count | The total number of query argument errors encountered by the shard's coordinator. [2](#tnote-2) |
| redis\_server\_search\_coord\_total\_query\_errors\_timeout | gauge | count | The total number of query timeout errors encountered by the shard's coordinator (when timeout policy is 'fail'). [2](#tnote-2) |
| redis\_server\_search\_coord\_total\_query\_warnings\_timeout | gauge | count | The total number of query timeout warnings encountered by the shard's coordinator (when timeout policy is 'return partial results'). [2](#tnote-2) |
| redis\_server\_search\_coord\_total\_query\_errors\_oom | gauge | count | The total number of query out-of-memory errors encountered by the shard's coordinator. [4](#tnote-4) |
| redis\_server\_search\_coord\_total\_query\_warnings\_oom | gauge | count | The total number of query out-of-memory warnings encountered by the shard's coordinator. [4](#tnote-4) |
| redis\_server\_search\_coord\_total\_query\_warnings\_max\_prefix\_expansions | gauge | count | The total number of max prefix expansion warnings encountered by the shard's coordinator. [2](#tnote-2) |
| redis\_server\_search\_uv\_threads\_running\_queries | gauge | count | The number of I/O threads currently handling query distribution to shards in cluster environments. [2](#tnote-2) |
| redis\_server\_search\_uv\_threads\_running\_topology\_update | gauge | count | The number of UV threads currently running topology updates. [3](#tnote-3) |
| redis\_server\_search\_active\_worker\_threads | gauge | count | The number of active worker threads. [2](#tnote-2) |
| redis\_server\_search\_active\_coord\_threads | gauge | count | The number of active coordinator threads. [2](#tnote-2) |
| redis\_server\_search\_workers\_low\_priority\_pending\_jobs | gauge | count | The number of pending low-priority jobs in worker threads, such as vector background indexing, graph updates, and vector garbage collection in graph-based indexes. [2](#tnote-2) |
| redis\_server\_search\_workers\_high\_priority\_pending\_jobs | gauge | count | The number of pending high-priority jobs in worker threads, such as query execution. [2](#tnote-2) |
| redis\_server\_search\_workers\_admin\_priority\_pending\_jobs | gauge | count | The number of pending admin-priority jobs in worker threads, such as threadpool configuration changes. [3](#tnote-3) |
| redis\_server\_search\_coord\_high\_priority\_pending\_jobs | gauge | count | The number of pending jobs in the coordinator thread queue. Coordinator threads only have a high-priority queue and are primarily used for query distribution. [2](#tnote-2) |
| shard\_ping\_failures | gauge | count | Number of consecutive ping failures for a shard. Labels: shard\_uid, role |
| shard\_ping\_failure\_duration\_seconds | gauge | seconds | Duration of ongoing failures (0 when healthy). Labels: shard\_uid, role |
1.  Available since RediSearch 2.6.
2.  Available since RediSearch 2.8.
3.  Available since RediSearch 2.10.
4.  Available since RediSearch 8.0.
