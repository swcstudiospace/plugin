# CronJob | Kubernetes

Source: https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1

# CronJob

CronJob represents the configuration of a single cron job.

`apiVersion: batch/v1`

`import "k8s.io/api/batch/v1"`

## CronJob

CronJob represents the configuration of a single cron job.

---

| Field | Description |
| --- | --- |
| `apiVersion` *string* | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources |
| `kind` *string* | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds |
| `metadata` *[ObjectMeta](https://kubernetes.io/docs/reference/kubernetes-api/definitions/object-meta-v1-meta/#ObjectMeta)* | Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata |
| `spec` **\*** *[CronJobSpec](#CronJobSpec)* | Specification of the desired behavior of a cron job, including the schedule. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status |
| `status` *[CronJobStatus](#CronJobStatus)* | Current status of a cron job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status |

## CronJobSpec

CronJobSpec describes how the job execution will look like and when it will actually run.

---

| Field | Description |
| --- | --- |
| `concurrencyPolicy` *string* | Specifies how to treat concurrent executions of a Job. Valid values are: - "Allow" (default): allows CronJobs to run concurrently; - "Forbid": forbids concurrent runs, skipping next run if previous run hasn't finished yet; - "Replace": cancels currently running job and replaces it with a new one  Possible enum values: - `"Allow"` allows CronJobs to run concurrently. - `"Forbid"` forbids concurrent runs, skipping next run if previous hasn't finished yet. - `"Replace"` cancels currently running job and replaces it with a new one. |
| `failedJobsHistoryLimit` *integer* | The number of failed finished jobs to retain. Value must be non-negative integer. Defaults to 1. |
| `jobTemplate` **\*** *[JobTemplateSpec](#JobTemplateSpec)* | Specifies the job that will be created when executing a CronJob. |
| `schedule` **\*** *string* | The schedule in Cron format, see https://en.wikipedia.org/wiki/Cron. |
| `startingDeadlineSeconds` *integer* | Optional deadline in seconds for starting the job if it misses scheduled time for any reason. Missed jobs executions will be counted as failed ones. |
| `successfulJobsHistoryLimit` *integer* | The number of successful finished jobs to retain. Value must be non-negative integer. Defaults to 3. |
| `suspend` *boolean* | This flag tells the controller to suspend subsequent executions, it does not apply to already started executions. Defaults to false. |
| `timeZone` *string* | The time zone name for the given schedule, see https://en.wikipedia.org/wiki/List\_of\_tz\_database\_time\_zones. If not specified, this will default to the time zone of the kube-controller-manager process. The set of valid time zone names and the time zone offset is loaded from the system-wide time zone database by the API server during CronJob validation and the controller manager during execution. If no system-wide time zone database can be found a bundled version of the database is used instead. If the time zone name becomes invalid during the lifetime of a CronJob or due to a change in host configuration, the controller will stop creating new new Jobs and will create a system event with the reason UnknownTimeZone. More information can be found in https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/#time-zones |

## CronJobStatus

CronJobStatus represents the current state of a cron job.

---

| Field | Description |
| --- | --- |
| `active` *[ObjectReference array](https://kubernetes.io/docs/reference/kubernetes-api/definitions/object-reference-v1/#ObjectReference)* | A list of pointers to currently running jobs. |
| `lastScheduleTime` *[Time](https://kubernetes.io/docs/reference/kubernetes-api/definitions/time-v1-meta/#Time)* | Information when was the last time the job was successfully scheduled. |
| `lastSuccessfulTime` *[Time](https://kubernetes.io/docs/reference/kubernetes-api/definitions/time-v1-meta/#Time)* | Information when was the last time the job successfully completed. |

## CronJobList

CronJobList is a collection of cron jobs.

---

| Field | Description |
| --- | --- |
| `apiVersion` *string* | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources |
| `items` **\*** *[CronJob array](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* | items is the list of CronJobs. |
| `kind` *string* | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds |
| `metadata` *[ListMeta](https://kubernetes.io/docs/reference/kubernetes-api/definitions/list-meta-v1-meta/#ListMeta)* | Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata |

## JobTemplateSpec

JobTemplateSpec describes the data a Job should have when created from a template

---

| Field | Description |
| --- | --- |
| `metadata` *[ObjectMeta](https://kubernetes.io/docs/reference/kubernetes-api/definitions/object-meta-v1-meta/#ObjectMeta)* | Standard object's metadata of the jobs created from this template. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata |
| `spec` *[JobSpec](https://kubernetes.io/docs/reference/kubernetes-api/batch/job-v1/#JobSpec)* | Specification of the desired behavior of the job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status |

## Operations

---

### `post` Create

#### HTTP Request

POST /apis/batch/v1/namespaces/{namespace}/cronjobs

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `namespace` | *string* | object name and auth scope, such as for teams and projects |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |
| `dryRun` | *string* | When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed |
| `fieldManager` | *string* | fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint. |
| `fieldValidation` | *string* | fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered. |

#### Body Parameters

| Name | Type | Description |
| --- | --- | --- |
| `body` | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |  |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |
| 201 | Created | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |
| 202 | Accepted | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |

### `patch` Patch

#### HTTP Request

PATCH /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the CronJob |
| `namespace` | *string* | object name and auth scope, such as for teams and projects |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |
| `dryRun` | *string* | When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed |
| `fieldManager` | *string* | fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint. This field is required for apply requests (application/apply-patch) but optional for non-apply patch types (JsonPatch, MergePatch, StrategicMergePatch). |
| `fieldValidation` | *string* | fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered. |
| `force` | *boolean* | Force is going to "force" Apply requests. It means user will re-acquire conflicting fields owned by other people. Force flag must be unset for non-apply patch requests. |

#### Body Parameters

| Name | Type | Description |
| --- | --- | --- |
| `body` | *[Patch](https://kubernetes.io/docs/reference/kubernetes-api/definitions/patch-v1-meta/#Patch)* |  |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |
| 201 | Created | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |

### `put` Replace

#### HTTP Request

PUT /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the CronJob |
| `namespace` | *string* | object name and auth scope, such as for teams and projects |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |
| `dryRun` | *string* | When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed |
| `fieldManager` | *string* | fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint. |
| `fieldValidation` | *string* | fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered. |

#### Body Parameters

| Name | Type | Description |
| --- | --- | --- |
| `body` | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |  |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |
| 201 | Created | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |

### `delete` Delete

#### HTTP Request

DELETE /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the CronJob |
| `namespace` | *string* | object name and auth scope, such as for teams and projects |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |
| `dryRun` | *string* | When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed |
| `gracePeriodSeconds` | *integer* | The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately. |
| `ignoreStoreReadErrorWithClusterBreakingPotential` | *boolean* | if set to true, it will trigger an unsafe deletion of the resource in case the normal deletion flow fails with a corrupt object error. A resource is considered corrupt if it can not be retrieved from the underlying storage successfully because of a) its data can not be transformed e.g. decryption failure, or b) it fails to decode into an object. NOTE: unsafe deletion ignores finalizer constraints, skips precondition checks, and removes the object from the storage. WARNING: This may potentially break the cluster if the workload associated with the resource being unsafe-deleted relies on normal deletion flow. Use only if you REALLY know what you are doing. The default value is false, and the user must opt in to enable it |
| `orphanDependents` | *boolean* | Deprecated: please use the PropagationPolicy, this field will be deprecated in 1.7. Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object's finalizers list. Either this field or PropagationPolicy may be set, but not both. |
| `propagationPolicy` | *string* | Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground. |

#### Body Parameters

| Name | Type | Description |
| --- | --- | --- |
| `body` | *[DeleteOptions](https://kubernetes.io/docs/reference/kubernetes-api/definitions/delete-options-v1-meta/#DeleteOptions)* |  |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[Status](https://kubernetes.io/docs/reference/kubernetes-api/definitions/status-v1-meta/#Status)* |
| 202 | Accepted | *[Status](https://kubernetes.io/docs/reference/kubernetes-api/definitions/status-v1-meta/#Status)* |

### `delete` Delete Collection

#### HTTP Request

DELETE /apis/batch/v1/namespaces/{namespace}/cronjobs

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `namespace` | *string* | object name and auth scope, such as for teams and projects |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |
| `continue` | *string* | The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key". This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications. |
| `dryRun` | *string* | When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed |
| `fieldSelector` | *string* | A selector to restrict the list of returned objects by their fields. Defaults to everything. |
| `gracePeriodSeconds` | *integer* | The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately. |
| `ignoreStoreReadErrorWithClusterBreakingPotential` | *boolean* | if set to true, it will trigger an unsafe deletion of the resource in case the normal deletion flow fails with a corrupt object error. A resource is considered corrupt if it can not be retrieved from the underlying storage successfully because of a) its data can not be transformed e.g. decryption failure, or b) it fails to decode into an object. NOTE: unsafe deletion ignores finalizer constraints, skips precondition checks, and removes the object from the storage. WARNING: This may potentially break the cluster if the workload associated with the resource being unsafe-deleted relies on normal deletion flow. Use only if you REALLY know what you are doing. The default value is false, and the user must opt in to enable it |
| `labelSelector` | *string* | A selector to restrict the list of returned objects by their labels. Defaults to everything. |
| `limit` | *integer* | limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true. The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned. |
| `orphanDependents` | *boolean* | Deprecated: please use the PropagationPolicy, this field will be deprecated in 1.7. Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object's finalizers list. Either this field or PropagationPolicy may be set, but not both. |
| `propagationPolicy` | *string* | Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground. |
| `resourceVersion` | *string* | resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details. Defaults to unset |
| `resourceVersionMatch` | *string* | resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details. Defaults to unset |
| `sendInitialEvents` | *boolean* | `sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched. When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following: - `resourceVersionMatch` = NotOlderThan is interpreted as "data at least as new as the provided `resourceVersion`" and the bookmark event is send when the state is synced to a `resourceVersion` at least as fresh as the one provided by the ListOptions. If `resourceVersion` is unset, this is interpreted as "consistent read" and the bookmark event is send when the state is synced at least to the moment when request started being processed. - `resourceVersionMatch` set to any other value or unset Invalid error is returned. Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise. |
| `shardSelector` | *string* | shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges: shardRange(object.metadata.uid, '0x0', '0x8000000000000000') shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000') Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths: - object.metadata.uid - object.metadata.namespace hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64. Examples: 2-shard split: shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000') shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000') 4-shard split: shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000') shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000') shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000') shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000') This is an alpha field and requires enabling the ShardedListAndWatch feature gate. |
| `timeoutSeconds` | *integer* | Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity. |

#### Body Parameters

| Name | Type | Description |
| --- | --- | --- |
| `body` | *[DeleteOptions](https://kubernetes.io/docs/reference/kubernetes-api/definitions/delete-options-v1-meta/#DeleteOptions)* |  |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[Status](https://kubernetes.io/docs/reference/kubernetes-api/definitions/status-v1-meta/#Status)* |

### `get` Read

#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the CronJob |
| `namespace` | *string* | object name and auth scope, such as for teams and projects |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |

### `get` List

#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/cronjobs

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `namespace` | *string* | object name and auth scope, such as for teams and projects |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |
| `allowWatchBookmarks` | *boolean* | allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored. |
| `continue` | *string* | The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key". This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications. |
| `fieldSelector` | *string* | A selector to restrict the list of returned objects by their fields. Defaults to everything. |
| `labelSelector` | *string* | A selector to restrict the list of returned objects by their labels. Defaults to everything. |
| `limit` | *integer* | limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true. The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned. |
| `resourceVersion` | *string* | resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details. Defaults to unset |
| `resourceVersionMatch` | *string* | resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details. Defaults to unset |
| `sendInitialEvents` | *boolean* | `sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched. When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following: - `resourceVersionMatch` = NotOlderThan is interpreted as "data at least as new as the provided `resourceVersion`" and the bookmark event is send when the state is synced to a `resourceVersion` at least as fresh as the one provided by the ListOptions. If `resourceVersion` is unset, this is interpreted as "consistent read" and the bookmark event is send when the state is synced at least to the moment when request started being processed. - `resourceVersionMatch` set to any other value or unset Invalid error is returned. Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise. |
| `shardSelector` | *string* | shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges: shardRange(object.metadata.uid, '0x0', '0x8000000000000000') shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000') Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths: - object.metadata.uid - object.metadata.namespace hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64. Examples: 2-shard split: shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000') shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000') 4-shard split: shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000') shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000') shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000') shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000') This is an alpha field and requires enabling the ShardedListAndWatch feature gate. |
| `timeoutSeconds` | *integer* | Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity. |
| `watch` | *boolean* | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion. |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[CronJobList](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJobList)* |

### `get` List All Namespaces

#### HTTP Request

GET /apis/batch/v1/cronjobs

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `allowWatchBookmarks` | *boolean* | allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored. |
| `continue` | *string* | The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key". This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications. |
| `fieldSelector` | *string* | A selector to restrict the list of returned objects by their fields. Defaults to everything. |
| `labelSelector` | *string* | A selector to restrict the list of returned objects by their labels. Defaults to everything. |
| `limit` | *integer* | limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true. The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned. |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |
| `resourceVersion` | *string* | resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details. Defaults to unset |
| `resourceVersionMatch` | *string* | resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details. Defaults to unset |
| `sendInitialEvents` | *boolean* | `sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched. When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following: - `resourceVersionMatch` = NotOlderThan is interpreted as "data at least as new as the provided `resourceVersion`" and the bookmark event is send when the state is synced to a `resourceVersion` at least as fresh as the one provided by the ListOptions. If `resourceVersion` is unset, this is interpreted as "consistent read" and the bookmark event is send when the state is synced at least to the moment when request started being processed. - `resourceVersionMatch` set to any other value or unset Invalid error is returned. Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise. |
| `shardSelector` | *string* | shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges: shardRange(object.metadata.uid, '0x0', '0x8000000000000000') shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000') Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths: - object.metadata.uid - object.metadata.namespace hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64. Examples: 2-shard split: shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000') shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000') 4-shard split: shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000') shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000') shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000') shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000') This is an alpha field and requires enabling the ShardedListAndWatch feature gate. |
| `timeoutSeconds` | *integer* | Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity. |
| `watch` | *boolean* | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion. |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[CronJobList](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJobList)* |

### `get` Watch

#### HTTP Request

GET /apis/batch/v1/watch/namespaces/{namespace}/cronjobs/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the CronJob |
| `namespace` | *string* | object name and auth scope, such as for teams and projects |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `allowWatchBookmarks` | *boolean* | allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored. |
| `continue` | *string* | The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key". This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications. |
| `fieldSelector` | *string* | A selector to restrict the list of returned objects by their fields. Defaults to everything. |
| `labelSelector` | *string* | A selector to restrict the list of returned objects by their labels. Defaults to everything. |
| `limit` | *integer* | limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true. The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned. |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |
| `resourceVersion` | *string* | resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details. Defaults to unset |
| `resourceVersionMatch` | *string* | resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details. Defaults to unset |
| `sendInitialEvents` | *boolean* | `sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched. When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following: - `resourceVersionMatch` = NotOlderThan is interpreted as "data at least as new as the provided `resourceVersion`" and the bookmark event is send when the state is synced to a `resourceVersion` at least as fresh as the one provided by the ListOptions. If `resourceVersion` is unset, this is interpreted as "consistent read" and the bookmark event is send when the state is synced at least to the moment when request started being processed. - `resourceVersionMatch` set to any other value or unset Invalid error is returned. Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise. |
| `shardSelector` | *string* | shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges: shardRange(object.metadata.uid, '0x0', '0x8000000000000000') shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000') Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths: - object.metadata.uid - object.metadata.namespace hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64. Examples: 2-shard split: shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000') shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000') 4-shard split: shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000') shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000') shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000') shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000') This is an alpha field and requires enabling the ShardedListAndWatch feature gate. |
| `timeoutSeconds` | *integer* | Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity. |
| `watch` | *boolean* | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion. |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[WatchEvent](https://kubernetes.io/docs/reference/kubernetes-api/definitions/watch-event-v1-meta/#WatchEvent)* |

### `get` Watch List

#### HTTP Request

GET /apis/batch/v1/watch/namespaces/{namespace}/cronjobs

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `namespace` | *string* | object name and auth scope, such as for teams and projects |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `allowWatchBookmarks` | *boolean* | allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored. |
| `continue` | *string* | The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key". This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications. |
| `fieldSelector` | *string* | A selector to restrict the list of returned objects by their fields. Defaults to everything. |
| `labelSelector` | *string* | A selector to restrict the list of returned objects by their labels. Defaults to everything. |
| `limit` | *integer* | limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true. The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned. |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |
| `resourceVersion` | *string* | resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details. Defaults to unset |
| `resourceVersionMatch` | *string* | resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details. Defaults to unset |
| `sendInitialEvents` | *boolean* | `sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched. When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following: - `resourceVersionMatch` = NotOlderThan is interpreted as "data at least as new as the provided `resourceVersion`" and the bookmark event is send when the state is synced to a `resourceVersion` at least as fresh as the one provided by the ListOptions. If `resourceVersion` is unset, this is interpreted as "consistent read" and the bookmark event is send when the state is synced at least to the moment when request started being processed. - `resourceVersionMatch` set to any other value or unset Invalid error is returned. Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise. |
| `shardSelector` | *string* | shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges: shardRange(object.metadata.uid, '0x0', '0x8000000000000000') shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000') Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths: - object.metadata.uid - object.metadata.namespace hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64. Examples: 2-shard split: shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000') shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000') 4-shard split: shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000') shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000') shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000') shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000') This is an alpha field and requires enabling the ShardedListAndWatch feature gate. |
| `timeoutSeconds` | *integer* | Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity. |
| `watch` | *boolean* | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion. |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[WatchEvent](https://kubernetes.io/docs/reference/kubernetes-api/definitions/watch-event-v1-meta/#WatchEvent)* |

### `get` Watch List All Namespaces

#### HTTP Request

GET /apis/batch/v1/watch/cronjobs

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `allowWatchBookmarks` | *boolean* | allowWatchBookmarks requests watch events with type "BOOKMARK". Servers that do not implement bookmarks may ignore this flag and bookmarks are sent at the server's discretion. Clients should not assume bookmarks are returned at any specific interval, nor may they assume the server will send any BOOKMARK event during a session. If this is not a watch, this field is ignored. |
| `continue` | *string* | The continue option should be set when retrieving more results from the server. Since this value is server defined, clients may only use the continue value from a previous query result with identical query parameters (except for the value of continue) and the server may reject a continue value it does not recognize. If the specified continue value is no longer valid whether due to expiration (generally five to fifteen minutes) or a configuration change on the server, the server will respond with a 410 ResourceExpired error together with a continue token. If the client needs a consistent list, it must restart their list without the continue field. Otherwise, the client may send another list request with the token received with the 410 error, the server will respond with a list starting from the next key, but from the latest snapshot, which is inconsistent from the previous list results - objects that are created, modified, or deleted after the first list request will be included in the response, as long as their keys are after the "next key". This field is not supported when watch is true. Clients may start a watch from the last resourceVersion value returned by the server and not miss any modifications. |
| `fieldSelector` | *string* | A selector to restrict the list of returned objects by their fields. Defaults to everything. |
| `labelSelector` | *string* | A selector to restrict the list of returned objects by their labels. Defaults to everything. |
| `limit` | *integer* | limit is a maximum number of responses to return for a list call. If more items exist, the server will set the `continue` field on the list metadata to a value that can be used with the same initial query to retrieve the next set of results. Setting a limit may return fewer than the requested amount of items (up to zero items) in the event all requested objects are filtered out and clients should only use the presence of the continue field to determine whether more results are available. Servers may choose not to support the limit argument and will return all of the available results. If limit is specified and the continue field is empty, clients may assume that no more results are available. This field is not supported if watch is true. The server guarantees that the objects returned when using continue will be identical to issuing a single list call without a limit - that is, no objects created, modified, or deleted after the first request is issued will be included in any subsequent continued requests. This is sometimes referred to as a consistent snapshot, and ensures that a client that is using limit to receive smaller chunks of a very large result can ensure they see all possible objects. If objects are updated during a chunked list the version of the object that was present at the time the first list result was calculated is returned. |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |
| `resourceVersion` | *string* | resourceVersion sets a constraint on what resource versions a request may be served from. See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details. Defaults to unset |
| `resourceVersionMatch` | *string* | resourceVersionMatch determines how resourceVersion is applied to list calls. It is highly recommended that resourceVersionMatch be set for list calls where resourceVersion is set See https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions for details. Defaults to unset |
| `sendInitialEvents` | *boolean* | `sendInitialEvents=true` may be set together with `watch=true`. In that case, the watch stream will begin with synthetic events to produce the current state of objects in the collection. Once all such events have been sent, a synthetic "Bookmark" event will be sent. The bookmark will report the ResourceVersion (RV) corresponding to the set of objects, and be marked with `"k8s.io/initial-events-end": "true"` annotation. Afterwards, the watch stream will proceed as usual, sending watch events corresponding to changes (subsequent to the RV) to objects watched. When `sendInitialEvents` option is set, we require `resourceVersionMatch` option to also be set. The semantic of the watch request is as following: - `resourceVersionMatch` = NotOlderThan is interpreted as "data at least as new as the provided `resourceVersion`" and the bookmark event is send when the state is synced to a `resourceVersion` at least as fresh as the one provided by the ListOptions. If `resourceVersion` is unset, this is interpreted as "consistent read" and the bookmark event is send when the state is synced at least to the moment when request started being processed. - `resourceVersionMatch` set to any other value or unset Invalid error is returned. Defaults to true if `resourceVersion=""` or `resourceVersion="0"` (for backward compatibility reasons) and to false otherwise. |
| `shardSelector` | *string* | shardSelector restricts the list of returned objects using a CEL-based shard selector expression. The format uses the shardRange() function combined with || (logical OR) to specify one or more hash ranges: shardRange(object.metadata.uid, '0x0', '0x8000000000000000') shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000') Field paths use CEL-style object-rooted syntax (e.g. "object.metadata.uid"), NOT the fieldSelector format ("metadata.uid"). Currently supported paths: - object.metadata.uid - object.metadata.namespace hexStart and hexEnd are single-quoted CEL string literals with a '0x' prefix, defining the inclusive lower and exclusive upper bounds over the 64-bit FNV-1a hash space. The full range is [0x0, 0x10000000000000000), where the exclusive upper bound equals 2^64. Examples: 2-shard split: shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000') shard 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000') 4-shard split: shard 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000') shard 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000') shard 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000') shard 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000') This is an alpha field and requires enabling the ShardedListAndWatch feature gate. |
| `timeoutSeconds` | *integer* | Timeout for the list/watch call. This limits the duration of the call, regardless of any activity or inactivity. |
| `watch` | *boolean* | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion. |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[WatchEvent](https://kubernetes.io/docs/reference/kubernetes-api/definitions/watch-event-v1-meta/#WatchEvent)* |

### `patch` Patch Status

#### HTTP Request

PATCH /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the CronJob |
| `namespace` | *string* | object name and auth scope, such as for teams and projects |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |
| `dryRun` | *string* | When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed |
| `fieldManager` | *string* | fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint. This field is required for apply requests (application/apply-patch) but optional for non-apply patch types (JsonPatch, MergePatch, StrategicMergePatch). |
| `fieldValidation` | *string* | fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered. |
| `force` | *boolean* | Force is going to "force" Apply requests. It means user will re-acquire conflicting fields owned by other people. Force flag must be unset for non-apply patch requests. |

#### Body Parameters

| Name | Type | Description |
| --- | --- | --- |
| `body` | *[Patch](https://kubernetes.io/docs/reference/kubernetes-api/definitions/patch-v1-meta/#Patch)* |  |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |
| 201 | Created | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |

### `get` Read Status

#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the CronJob |
| `namespace` | *string* | object name and auth scope, such as for teams and projects |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |

### `put` Replace Status

#### HTTP Request

PUT /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the CronJob |
| `namespace` | *string* | object name and auth scope, such as for teams and projects |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |
| `dryRun` | *string* | When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed |
| `fieldManager` | *string* | fieldManager is a name associated with the actor or entity that is making these changes. The value must be less than or 128 characters long, and only contain printable characters, as defined by https://golang.org/pkg/unicode/#IsPrint. |
| `fieldValidation` | *string* | fieldValidation instructs the server on how to handle objects in the request (POST/PUT/PATCH) containing unknown or duplicate fields. Valid values are: - Ignore: This will ignore any unknown fields that are silently dropped from the object, and will ignore all but the last duplicate field that the decoder encounters. This is the default behavior prior to v1.23. - Warn: This will send a warning via the standard warning response header for each unknown field that is dropped from the object, and for each duplicate field that is encountered. The request will still succeed if there are no other errors, and will only persist the last of any duplicate fields. This is the default in v1.23+ - Strict: This will fail the request with a BadRequest error if any unknown fields would be dropped from the object, or if any duplicate fields are present. The error returned from the server will contain all unknown and duplicate fields encountered. |

#### Body Parameters

| Name | Type | Description |
| --- | --- | --- |
| `body` | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |  |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |
| 201 | Created | *[CronJob](https://kubernetes.io/docs/reference/kubernetes-api/batch/cron-job-v1/#CronJob)* |

Last modified May 13, 2026 at 6:59 PM PST: [switch kubernetes-api content to gen-apidocs markdown backend (7dffa41ae2)](https://github.com/kubernetes/website/commit/7dffa41ae2e6ae0376a5580760c74f45e910948c)

This page is automatically generated.

If you plan to report an issue with this page, mention that the page is auto-generated in your issue description. The fix may need to happen elsewhere in the Kubernetes project.
