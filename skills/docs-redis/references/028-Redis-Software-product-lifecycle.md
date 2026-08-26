# Redis Software product lifecycle

Source: https://redis.io/docs/latest/operate/rs/installing-upgrading/product-lifecycle/index.html.md

# Redis Software product lifecycle
```json metadata
{
"title": "Redis Software product lifecycle",
"description": "The product lifecycle of Redis Software cluster versions.",
"categories": ["docs","operate","rs"],
"tableOfContents": {"sections":[{"children":[{"id":"cluster-version-release-numbers","title":"Cluster version release numbers"},{"id":"cluster-version-end-of-life-schedule-endoflife-schedule","title":"Cluster version end-of-life schedule {#endoflife-schedule}"},{"id":"supported-cluster-version-upgrade-paths","title":"Supported cluster version upgrade paths"}],"id":"redis-software-cluster-version-lifecycle","title":"Redis Software cluster version lifecycle"},{"id":"bundled-redis-database-versions","title":"Bundled Redis database versions"}]}
,
"codeExamples": []
}
```The Redis Software product lifecycle fully reflects the [subscription agreement](https://redis.io/legal/software-agreement/).
However, for any discrepancy between the two policies, the subscription agreement prevails.
Redis Software modules follow the [modules lifecycle](https://redis.io/docs/latest/operate/oss\_and\_stack/stack-with-enterprise/modules-lifecycle).
## Redis Software cluster version lifecycle
This section describes the lifecycle policy for Redis Software cluster versions.
### Cluster version release numbers
Redis Software uses a four-place numbering scheme to designate released cluster versions.
The format is "Major1.Major2.Minor-Build".
- Major sections of the version number represents fundamental changes and additions in
capabilities to Redis Software. The Major1 and Major2 part of the
version number are incremented based on the size and scale of the changes in each
release.
- The Minor section of the version number represents quality improvements, fixes to
existing capabilities, and new capabilities which are typically minor, feature-flagged, or optional.
- Build number is incremented with any changes to the product. Build number is
incremented with each build when any change is made to the binaries.
Redis Software typically gets two major releases every year but the product shipping cycles may vary.
Maintenance releases, typically available on the last minor release of the current major1.major2 release are typically made available on a monthly cadence, although cycles may vary.
### Cluster version end-of-life schedule {#endoflife-schedule}
For Redis Software cluster versions 6.2 and later, the end-of-life (EOL) for each major release occurs 24 months after the formal release of the subsequent major version. Monthly maintenance will be provided on the last minor release of the major1.major2 releases.
This update to the EOL policy allows a lead time of at least 24 months to upgrade to the new cluster version after it is available.
| Version - Release date | End of Life (EOL) |
| ----------------------------------------- | ------------------ |
| 8.2 – July 2026 | - |
| 8.0 – October 2025 | July 31, 2028 |
| 7.22 – May 2025 | October 30, 2027 |
| 7.8 – November 2024 | May 30, 2027 |
| 7.4 – February 2024 | November 30, 2026 |
| 7.2 – August 2023 | February 28, 2026 |
| 6.4 – February 2023 | August 31, 2025 |
| 6.2 – August 2021 | February 28, 2025 |
| 6.0 – May 2020 | May 31, 2022 |
| 5.6 – April 2020 | October 31, 2021 |
| 5.4 – December 2018 | December 31, 2020 |
| 5.2 – June 2018 | December 31, 2019 |
The following timeline chart visualizes the Redis Software product lifecycle, showing release dates and end-of-life dates for each major version:
```timeline {title="Redis Software product lifecycle"}
8.2: Jul 2026 - TBD
8.0: Oct 2025 - Jul 31, 2028
7.22: May 2025 - Oct 30, 2027
7.8: Nov 2024 - May 30, 2027
7.4: Feb 2024 - Nov 30, 2026
7.2: Aug 2023 - Feb 28, 2026
6.4: Feb 2023 - Aug 31, 2025
6.2: Aug 2021 - Feb 28, 2025
6.0: May 2020 - May 31, 2022
5.6: Apr 2020 - Oct 31, 2021
5.4: Dec 2018 - Dec 31, 2020
5.2: June 2018 - Dec 31, 2019
```
### Supported cluster version upgrade paths
✅ Supported – You can upgrade directly from the current Redis Software cluster version.
:x: Not supported – You cannot upgrade directly from the current Redis Software cluster version. You must first upgrade to a supported intermediate version.
| Current Redis Software cluster version | Upgrade to Redis Software 7.2.x | Upgrade to Redis Software 7.4.x | Upgrade to Redis Software 7.8.x | Upgrade to Redis Software 7.22.x | Upgrade to Redis Software 8.0.2-8.0.10 | Upgrade to Redis Software 8.0.16-8.0.20 | Upgrade to Redis Software 8.2.x |
|:-----------------------:|:----------------:|:----------------:|:----------------:|:----------------:|:----------------:|:----------------:|:----------------:|
| 6.0.x | ✅ | :x: | :x: | :x: | :x: | :x: | :x: |
| 6.2.4
6.2.8 | ✅ | ✅ | :x: | :x: | :x: | :x: | :x: |
| 6.2.10
6.2.12
6.2.18 | ✅ | ✅ | ✅ | :x: | :x: | :x: | :x: |
| 6.4.x | ✅ | ✅ | ✅ | ✅ | ✅ | :x: | :x: |
| 7.2.x | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 7.4.x | – | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 7.8.x | – | – | ✅ | ✅ | ✅ | ✅ | ✅ |
| 7.22.x | – | – | – | ✅ | ✅ | ✅ | ✅ |
| 8.0.2
8.0.6
8.0.10 | – | – | – | – | ✅ | ✅ | ✅ |
| 8.0.16
8.0.18
8.0.20 | – | – | – | – | - | ✅ | ✅ |
| 8.2.x | – | – | – | – | – | – | ✅ |
For detailed upgrade instructions, see [Upgrade a Redis Software cluster](https://redis.io/docs/latest/operate/rs/installing-upgrading/upgrading/upgrade-cluster).
Redis Enterprise for Kubernetes has its own support lifecycle, which accounts for the Kubernetes distribution lifecycle. For details, see [Supported Kubernetes distributions](https://redis.io/docs/latest/operate/kubernetes/reference/supported\_k8s\_distributions).
## Bundled Redis database versions
Each cluster version of Redis Software includes a set of Redis database versions as follows:
| Redis Software
cluster version | Bundled Redis
DB versions | Default DB version
(upgraded/new databases) |
|-------|----------|-----|
| 8.2.0 | 6.2, 7.2, 7.4, 8.0, 8.2, 8.4, 8.6 | 8.6 |
| 8.0.20 | 6.2, 7.2, 7.4, 8.0, 8.2, 8.4, 8.6 | 8.6 |
| 8.0.18 | 6.2, 7.2, 7.4, 8.0, 8.2, 8.4, 8.6 | 8.6 |
| 8.0.16 | 6.2, 7.2, 7.4, 8.0, 8.2, 8.4 | 8.4 |
| 8.0.10 | 6.2, 7.2, 7.4, 8.0, 8.2, 8.4 | 8.4 |
| 8.0.6 | 6.2, 7.2, 7.4, 8.0, 8.2 | 8.2 |
| 8.0.2 | 6.2, 7.2, 7.4, 8.0, 8.2 | 8.2 |
| 7.22.x | 6.2, 7.2, 7.4 | 7.4 |
| 7.8.x | 6.2, 7.2, 7.4 | 7.4 |
| 7.4.x | 6.0, 6.2, 7.2 | 7.2 |
| 7.2.4 | 6.0, 6.2, 7.2 | 7.2 |
| 6.4.2 | 6.0, 6.2 | 6.2 |
| 6.2.x | 6.0, 6.2 | 6.0 |
