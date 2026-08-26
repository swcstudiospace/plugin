# APIService | Kubernetes

Source: https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1

# APIService

APIService represents a server for a particular GroupVersion. Name must be "version.group".

`apiVersion: apiregistration.k8s.io/v1`

`import "k8s.io/kube-aggregator/pkg/apis/apiregistration/v1"`

## APIService

APIService represents a server for a particular GroupVersion. Name must be "version.group".

---

| Field | Description |
| --- | --- |
| `apiVersion` *string* | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources |
| `kind` *string* | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds |
| `metadata` *[ObjectMeta](https://kubernetes.io/docs/reference/kubernetes-api/definitions/object-meta-v1-meta/#ObjectMeta)* | Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata |
| `spec` *[APIServiceSpec](#APIServiceSpec)* | Spec contains information for locating and communicating with a server |
| `status` *[APIServiceStatus](#APIServiceStatus)* | Status contains derived information about an API server |

## APIServiceSpec

APIServiceSpec contains information for locating and communicating with a server. Only https is supported, though you are able to disable certificate verification.

---

| Field | Description |
| --- | --- |
| `caBundle` *string* | CABundle is a PEM encoded CA bundle which will be used to validate an API server's serving certificate. If unspecified, system trust roots on the apiserver are used. |
| `group` *string* | Group is the API group name this server hosts |
| `groupPriorityMinimum` **\*** *integer* | GroupPriorityMinimum is the priority this group should have at least. Higher priority means that the group is preferred by clients over lower priority ones. Note that other versions of this group might specify even higher GroupPriorityMinimum values such that the whole group gets a higher priority. The primary sort is based on GroupPriorityMinimum, ordered highest number to lowest (20 before 10). The secondary sort is based on the alphabetical comparison of the name of the object. (v1.bar before v1.foo) We'd recommend something like: \*.k8s.io (except extensions) at 18000 and PaaSes (OpenShift, Deis) are recommended to be in the 2000s |
| `insecureSkipTLSVerify` *boolean* | InsecureSkipTLSVerify disables TLS certificate verification when communicating with this server. This is strongly discouraged. You should use the CABundle instead. |
| `service` *[ServiceReference](#ServiceReference)* | Service is a reference to the service for this API server. It must communicate on port 443. If the Service is nil, that means the handling for the API groupversion is handled locally on this server. The call will simply delegate to the normal handler chain to be fulfilled. |
| `version` *string* | Version is the API version this server hosts. For example, "v1" |
| `versionPriority` **\*** *integer* | VersionPriority controls the ordering of this API version inside of its group. Must be greater than zero. The primary sort is based on VersionPriority, ordered highest to lowest (20 before 10). Since it's inside of a group, the number can be small, probably in the 10s. In case of equal version priorities, the version string will be used to compute the order inside a group. If the version string is "kube-like", it will sort above non "kube-like" version strings, which are ordered lexicographically. "Kube-like" versions start with a "v", then are followed by a number (the major version), then optionally the string "alpha" or "beta" and another number (the minor version). These are sorted first by GA > beta > alpha (where GA is a version with no suffix such as beta or alpha), and then by comparing major version, then minor version. An example sorted list of versions: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10. |

## APIServiceStatus

APIServiceStatus contains derived information about an API server

---

| Field | Description |
| --- | --- |
| `conditions` *[APIServiceCondition array](#APIServiceCondition)* *patch strategy: merge on key `type`* | Current service state of apiService. |

## APIServiceList

APIServiceList is a list of APIService objects.

---

| Field | Description |
| --- | --- |
| `apiVersion` *string* | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources |
| `items` **\*** *[APIService array](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* | Items is the list of APIService |
| `kind` *string* | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds |
| `metadata` *[ListMeta](https://kubernetes.io/docs/reference/kubernetes-api/definitions/list-meta-v1-meta/#ListMeta)* | Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata |

## APIServiceCondition

APIServiceCondition describes the state of an APIService at a particular point

---

| Field | Description |
| --- | --- |
| `lastTransitionTime` *[Time](https://kubernetes.io/docs/reference/kubernetes-api/definitions/time-v1-meta/#Time)* | Last time the condition transitioned from one status to another. |
| `message` *string* | Human-readable message indicating details about last transition. |
| `reason` *string* | Unique, one-word, CamelCase reason for the condition's last transition. |
| `status` **\*** *string* | Status is the status of the condition. Can be True, False, Unknown. |
| `type` **\*** *string* | Type is the type of the condition. |

## ServiceReference

ServiceReference holds a reference to Service.legacy.k8s.io

---

| Field | Description |
| --- | --- |
| `name` *string* | Name is the name of the service |
| `namespace` *string* | Namespace is the namespace of the service |
| `port` *integer* | If specified, the port on the service that hosting webhook. Default to 443 for backward compatibility. `port` should be a valid port number (1-65535, inclusive). |

## Operations

---

### `post` Create

#### HTTP Request

POST /apis/apiregistration.k8s.io/v1/apiservices

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
| `body` | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |  |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |
| 201 | Created | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |
| 202 | Accepted | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |

### `patch` Patch

#### HTTP Request

PATCH /apis/apiregistration.k8s.io/v1/apiservices/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the APIService |

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
| 200 | OK | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |
| 201 | Created | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |

### `put` Replace

#### HTTP Request

PUT /apis/apiregistration.k8s.io/v1/apiservices/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the APIService |

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
| `body` | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |  |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |
| 201 | Created | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |

### `delete` Delete

#### HTTP Request

DELETE /apis/apiregistration.k8s.io/v1/apiservices/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the APIService |

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

DELETE /apis/apiregistration.k8s.io/v1/apiservices

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

GET /apis/apiregistration.k8s.io/v1/apiservices/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the APIService |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |

### `get` List

#### HTTP Request

GET /apis/apiregistration.k8s.io/v1/apiservices

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
| 200 | OK | *[APIServiceList](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIServiceList)* |

### `get` Watch

#### HTTP Request

GET /apis/apiregistration.k8s.io/v1/watch/apiservices/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the APIService |

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

GET /apis/apiregistration.k8s.io/v1/watch/apiservices

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

PATCH /apis/apiregistration.k8s.io/v1/apiservices/{name}/status

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the APIService |

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
| 200 | OK | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |
| 201 | Created | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |

### `get` Read Status

#### HTTP Request

GET /apis/apiregistration.k8s.io/v1/apiservices/{name}/status

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the APIService |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |

### `put` Replace Status

#### HTTP Request

PUT /apis/apiregistration.k8s.io/v1/apiservices/{name}/status

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the APIService |

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
| `body` | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |  |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |
| 201 | Created | *[APIService](https://kubernetes.io/docs/reference/kubernetes-api/apiregistration/api-service-v1/#APIService)* |

Last modified May 13, 2026 at 6:59 PM PST: [switch kubernetes-api content to gen-apidocs markdown backend (7dffa41ae2)](https://github.com/kubernetes/website/commit/7dffa41ae2e6ae0376a5580760c74f45e910948c)

This page is automatically generated.

If you plan to report an issue with this page, mention that the page is auto-generated in your issue description. The fix may need to happen elsewhere in the Kubernetes project.
