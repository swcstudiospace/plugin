# HorizontalPodAutoscaler | Kubernetes

Source: https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2

# HorizontalPodAutoscaler

HorizontalPodAutoscaler is the configuration for a horizontal pod autoscaler, which automatically manages the replica count of any resource implementing the scale subresource based on the metrics specified.

`apiVersion: autoscaling/v2`

`import "k8s.io/api/autoscaling/v2"`

## HorizontalPodAutoscaler

HorizontalPodAutoscaler is the configuration for a horizontal pod autoscaler, which automatically manages the replica count of any resource implementing the scale subresource based on the metrics specified.

---

| Field | Description |
| --- | --- |
| `apiVersion` *string* | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources |
| `kind` *string* | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds |
| `metadata` *[ObjectMeta](https://kubernetes.io/docs/reference/kubernetes-api/definitions/object-meta-v1-meta/#ObjectMeta)* | metadata is the standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata |
| `spec` **\*** *[HorizontalPodAutoscalerSpec](#HorizontalPodAutoscalerSpec)* | spec is the specification for the behaviour of the autoscaler. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status. |
| `status` *[HorizontalPodAutoscalerStatus](#HorizontalPodAutoscalerStatus)* | status is the current information about the autoscaler. |

## HorizontalPodAutoscalerSpec

HorizontalPodAutoscalerSpec describes the desired functionality of the HorizontalPodAutoscaler.

---

| Field | Description |
| --- | --- |
| `behavior` *[HorizontalPodAutoscalerBehavior](#HorizontalPodAutoscalerBehavior)* | behavior configures the scaling behavior of the target in both Up and Down directions (scaleUp and scaleDown fields respectively). If not set, the default HPAScalingRules for scale up and scale down are used. |
| `maxReplicas` **\*** *integer* | maxReplicas is the upper limit for the number of replicas to which the autoscaler can scale up. It cannot be less that minReplicas. |
| `metrics` *[MetricSpec array](#MetricSpec)* | metrics contains the specifications for which to use to calculate the desired replica count (the maximum replica count across all metrics will be used). The desired replica count is calculated multiplying the ratio between the target value and the current value by the current number of pods. Ergo, metrics used must decrease as the pod count is increased, and vice-versa. See the individual metric source types for more information about how each type of metric must respond. If not set, the default metric will be set to 80% average CPU utilization. |
| `minReplicas` *integer* | minReplicas is the lower limit for the number of replicas to which the autoscaler can scale down. It defaults to 1 pod. minReplicas is allowed to be 0 if the alpha feature gate HPAScaleToZero is enabled and at least one Object or External metric is configured. Scaling is active as long as at least one metric value is available. |
| `scaleTargetRef` **\*** *[CrossVersionObjectReference](#CrossVersionObjectReference)* | scaleTargetRef points to the target resource to scale, and is used to the pods for which metrics should be collected, as well as to actually change the replica count. |

## HorizontalPodAutoscalerStatus

HorizontalPodAutoscalerStatus describes the current status of a horizontal pod autoscaler.

---

| Field | Description |
| --- | --- |
| `conditions` *[HorizontalPodAutoscalerCondition array](#HorizontalPodAutoscalerCondition)* *patch strategy: merge on key `type`* | conditions is the set of conditions required for this autoscaler to scale its target, and indicates whether or not those conditions are met. |
| `currentMetrics` *[MetricStatus array](#MetricStatus)* | currentMetrics is the last read state of the metrics used by this autoscaler. |
| `currentReplicas` *integer* | currentReplicas is current number of replicas of pods managed by this autoscaler, as last seen by the autoscaler. |
| `desiredReplicas` **\*** *integer* | desiredReplicas is the desired number of replicas of pods managed by this autoscaler, as last calculated by the autoscaler. |
| `lastScaleTime` *[Time](https://kubernetes.io/docs/reference/kubernetes-api/definitions/time-v1-meta/#Time)* | lastScaleTime is the last time the HorizontalPodAutoscaler scaled the number of pods, used by the autoscaler to control how often the number of pods is changed. |
| `observedGeneration` *integer* | observedGeneration is the most recent generation observed by this autoscaler. |

## HorizontalPodAutoscalerList

HorizontalPodAutoscalerList is a list of horizontal pod autoscaler objects.

---

| Field | Description |
| --- | --- |
| `apiVersion` *string* | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources |
| `items` **\*** *[HorizontalPodAutoscaler array](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* | items is the list of horizontal pod autoscaler objects. |
| `kind` *string* | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds |
| `metadata` *[ListMeta](https://kubernetes.io/docs/reference/kubernetes-api/definitions/list-meta-v1-meta/#ListMeta)* | metadata is the standard list metadata. |

## ContainerResourceMetricSource

ContainerResourceMetricSource indicates how to scale on a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory). The values will be averaged together before being compared to the target. Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source. Only one "target" type should be set.

---

| Field | Description |
| --- | --- |
| `container` **\*** *string* | container is the name of the container in the pods of the scaling target |
| `name` **\*** *string* | name is the name of the resource in question. |
| `target` **\*** *[MetricTarget](#MetricTarget)* | target specifies the target value for the given metric |

## ContainerResourceMetricStatus

ContainerResourceMetricStatus indicates the current value of a resource metric known to Kubernetes, as specified in requests and limits, describing a single container in each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.

---

| Field | Description |
| --- | --- |
| `container` **\*** *string* | container is the name of the container in the pods of the scaling target |
| `current` **\*** *[MetricValueStatus](#MetricValueStatus)* | current contains the current value for the given metric |
| `name` **\*** *string* | name is the name of the resource in question. |

## CrossVersionObjectReference

CrossVersionObjectReference contains enough information to let you identify the referred resource.

---

| Field | Description |
| --- | --- |
| `apiVersion` *string* | apiVersion is the API version of the referent |
| `kind` **\*** *string* | kind is the kind of the referent; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds |
| `name` **\*** *string* | name is the name of the referent; More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names |

## ExternalMetricSource

ExternalMetricSource indicates how to scale on a metric not associated with any Kubernetes object (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster).

---

| Field | Description |
| --- | --- |
| `metric` **\*** *[MetricIdentifier](#MetricIdentifier)* | metric identifies the target metric by name and selector |
| `target` **\*** *[MetricTarget](#MetricTarget)* | target specifies the target value for the given metric |

## ExternalMetricStatus

ExternalMetricStatus indicates the current value of a global metric not associated with any Kubernetes object.

---

| Field | Description |
| --- | --- |
| `current` **\*** *[MetricValueStatus](#MetricValueStatus)* | current contains the current value for the given metric |
| `metric` **\*** *[MetricIdentifier](#MetricIdentifier)* | metric identifies the target metric by name and selector |

## HPAScalingPolicy

HPAScalingPolicy is a single policy which must hold true for a specified past interval.

---

| Field | Description |
| --- | --- |
| `periodSeconds` **\*** *integer* | periodSeconds specifies the window of time for which the policy should hold true. PeriodSeconds must be greater than zero and less than or equal to 1800 (30 min). |
| `type` **\*** *string* | type is used to specify the scaling policy. |
| `value` **\*** *integer* | value contains the amount of change which is permitted by the policy. It must be greater than zero |

## HPAScalingRules

HPAScalingRules configures the scaling behavior for one direction via scaling Policy Rules and a configurable metric tolerance.

Scaling Policy Rules are applied after calculating DesiredReplicas from metrics for the HPA. They can limit the scaling velocity by specifying scaling policies. They can prevent flapping by specifying the stabilization window, so that the number of replicas is not set instantly, instead, the safest value from the stabilization window is chosen.

The tolerance is applied to the metric values and prevents scaling too eagerly for small metric variations. (Note that setting a tolerance requires the beta HPAConfigurableTolerance feature gate to be enabled.)

---

| Field | Description |
| --- | --- |
| `policies` *[HPAScalingPolicy array](#HPAScalingPolicy)* | policies is a list of potential scaling polices which can be used during scaling. If not set, use the default values: - For scale up: allow doubling the number of pods, or an absolute change of 4 pods in a 15s window. - For scale down: allow all pods to be removed in a 15s window. |
| `selectPolicy` *string* | selectPolicy is used to specify which policy should be used. If not set, the default value Max is used. |
| `stabilizationWindowSeconds` *integer* | stabilizationWindowSeconds is the number of seconds for which past recommendations should be considered while scaling up or scaling down. StabilizationWindowSeconds must be greater than or equal to zero and less than or equal to 3600 (one hour). If not set, use the default values: - For scale up: 0 (i.e. no stabilization is done). - For scale down: 300 (i.e. the stabilization window is 300 seconds long). |
| `tolerance` *[Quantity](https://kubernetes.io/docs/reference/kubernetes-api/definitions/quantity-resource/#Quantity)* | tolerance is the tolerance on the ratio between the current and desired metric value under which no updates are made to the desired number of replicas (e.g. 0.01 for 1%). Must be greater than or equal to zero. If not set, the default cluster-wide tolerance is applied (by default 10%). For example, if autoscaling is configured with a memory consumption target of 100Mi, and scale-down and scale-up tolerances of 5% and 1% respectively, scaling will be triggered when the actual consumption falls below 95Mi or exceeds 101Mi. This is an beta field and requires the HPAConfigurableTolerance feature gate to be enabled. |

## HorizontalPodAutoscalerBehavior

HorizontalPodAutoscalerBehavior configures the scaling behavior of the target in both Up and Down directions (scaleUp and scaleDown fields respectively).

---

| Field | Description |
| --- | --- |
| `scaleDown` *[HPAScalingRules](#HPAScalingRules)* | scaleDown is scaling policy for scaling Down. If not set, the default value is to allow to scale down to minReplicas pods, with a 300 second stabilization window (i.e., the highest recommendation for the last 300sec is used). |
| `scaleUp` *[HPAScalingRules](#HPAScalingRules)* | scaleUp is scaling policy for scaling Up. If not set, the default value is the higher of: \* increase no more than 4 pods per 60 seconds \* double the number of pods per 60 seconds No stabilization is used. |

## HorizontalPodAutoscalerCondition

HorizontalPodAutoscalerCondition describes the state of a HorizontalPodAutoscaler at a certain point.

---

| Field | Description |
| --- | --- |
| `lastTransitionTime` *[Time](https://kubernetes.io/docs/reference/kubernetes-api/definitions/time-v1-meta/#Time)* | lastTransitionTime is the last time the condition transitioned from one status to another |
| `message` *string* | message is a human-readable explanation containing details about the transition |
| `reason` *string* | reason is the reason for the condition's last transition. |
| `status` **\*** *string* | status is the status of the condition (True, False, Unknown) |
| `type` **\*** *string* | type describes the current condition |

## MetricIdentifier

MetricIdentifier defines the name and optionally selector for a metric

---

| Field | Description |
| --- | --- |
| `name` **\*** *string* | name is the name of the given metric |
| `selector` *[LabelSelector](https://kubernetes.io/docs/reference/kubernetes-api/definitions/label-selector-v1-meta/#LabelSelector)* | selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics. |

## MetricSpec

MetricSpec specifies how to scale based on a single metric (only `type` and one other matching field should be set at once).

---

| Field | Description |
| --- | --- |
| `containerResource` *[ContainerResourceMetricSource](#ContainerResourceMetricSource)* | containerResource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing a single container in each pod of the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source. |
| `external` *[ExternalMetricSource](#ExternalMetricSource)* | external refers to a global metric that is not associated with any Kubernetes object. It allows autoscaling based on information coming from components running outside of cluster (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster). |
| `object` *[ObjectMetricSource](#ObjectMetricSource)* | object refers to a metric describing a single kubernetes object (for example, hits-per-second on an Ingress object). |
| `pods` *[PodsMetricSource](#PodsMetricSource)* | pods refers to a metric describing each pod in the current scale target (for example, transactions-processed-per-second). The values will be averaged together before being compared to the target value. |
| `resource` *[ResourceMetricSource](#ResourceMetricSource)* | resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source. |
| `type` **\*** *string* | type is the type of metric source. It should be one of "ContainerResource", "External", "Object", "Pods" or "Resource", each mapping to a matching field in the object. |

## MetricStatus

MetricStatus describes the last-read state of a single metric.

---

| Field | Description |
| --- | --- |
| `containerResource` *[ContainerResourceMetricStatus](#ContainerResourceMetricStatus)* | container resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing a single container in each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source. |
| `external` *[ExternalMetricStatus](#ExternalMetricStatus)* | external refers to a global metric that is not associated with any Kubernetes object. It allows autoscaling based on information coming from components running outside of cluster (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster). |
| `object` *[ObjectMetricStatus](#ObjectMetricStatus)* | object refers to a metric describing a single kubernetes object (for example, hits-per-second on an Ingress object). |
| `pods` *[PodsMetricStatus](#PodsMetricStatus)* | pods refers to a metric describing each pod in the current scale target (for example, transactions-processed-per-second). The values will be averaged together before being compared to the target value. |
| `resource` *[ResourceMetricStatus](#ResourceMetricStatus)* | resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source. |
| `type` **\*** *string* | type is the type of metric source. It will be one of "ContainerResource", "External", "Object", "Pods" or "Resource", each corresponds to a matching field in the object. |

## MetricTarget

MetricTarget defines the target value, average value, or average utilization of a specific metric

---

| Field | Description |
| --- | --- |
| `averageUtilization` *integer* | averageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. Currently only valid for Resource metric source type |
| `averageValue` *[Quantity](https://kubernetes.io/docs/reference/kubernetes-api/definitions/quantity-resource/#Quantity)* | averageValue is the target value of the average of the metric across all relevant pods (as a quantity) |
| `type` **\*** *string* | type represents whether the metric type is Utilization, Value, or AverageValue |
| `value` *[Quantity](https://kubernetes.io/docs/reference/kubernetes-api/definitions/quantity-resource/#Quantity)* | value is the target value of the metric (as a quantity). |

## MetricValueStatus

MetricValueStatus holds the current value for a metric

---

| Field | Description |
| --- | --- |
| `averageUtilization` *integer* | currentAverageUtilization is the current value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. |
| `averageValue` *[Quantity](https://kubernetes.io/docs/reference/kubernetes-api/definitions/quantity-resource/#Quantity)* | averageValue is the current value of the average of the metric across all relevant pods (as a quantity) |
| `value` *[Quantity](https://kubernetes.io/docs/reference/kubernetes-api/definitions/quantity-resource/#Quantity)* | value is the current value of the metric (as a quantity). |

## ObjectMetricSource

ObjectMetricSource indicates how to scale on a metric describing a kubernetes object (for example, hits-per-second on an Ingress object).

---

| Field | Description |
| --- | --- |
| `describedObject` **\*** *[CrossVersionObjectReference](#CrossVersionObjectReference)* | describedObject specifies the descriptions of a object,such as kind,name apiVersion |
| `metric` **\*** *[MetricIdentifier](#MetricIdentifier)* | metric identifies the target metric by name and selector |
| `target` **\*** *[MetricTarget](#MetricTarget)* | target specifies the target value for the given metric |

## ObjectMetricStatus

ObjectMetricStatus indicates the current value of a metric describing a kubernetes object (for example, hits-per-second on an Ingress object).

---

| Field | Description |
| --- | --- |
| `current` **\*** *[MetricValueStatus](#MetricValueStatus)* | current contains the current value for the given metric |
| `describedObject` **\*** *[CrossVersionObjectReference](#CrossVersionObjectReference)* | DescribedObject specifies the descriptions of a object,such as kind,name apiVersion |
| `metric` **\*** *[MetricIdentifier](#MetricIdentifier)* | metric identifies the target metric by name and selector |

## PodsMetricSource

PodsMetricSource indicates how to scale on a metric describing each pod in the current scale target (for example, transactions-processed-per-second). The values will be averaged together before being compared to the target value.

---

| Field | Description |
| --- | --- |
| `metric` **\*** *[MetricIdentifier](#MetricIdentifier)* | metric identifies the target metric by name and selector |
| `target` **\*** *[MetricTarget](#MetricTarget)* | target specifies the target value for the given metric |

## PodsMetricStatus

PodsMetricStatus indicates the current value of a metric describing each pod in the current scale target (for example, transactions-processed-per-second).

---

| Field | Description |
| --- | --- |
| `current` **\*** *[MetricValueStatus](#MetricValueStatus)* | current contains the current value for the given metric |
| `metric` **\*** *[MetricIdentifier](#MetricIdentifier)* | metric identifies the target metric by name and selector |

## ResourceMetricSource

ResourceMetricSource indicates how to scale on a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory). The values will be averaged together before being compared to the target. Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source. Only one "target" type should be set.

---

| Field | Description |
| --- | --- |
| `name` **\*** *string* | name is the name of the resource in question. |
| `target` **\*** *[MetricTarget](#MetricTarget)* | target specifies the target value for the given metric |

## ResourceMetricStatus

ResourceMetricStatus indicates the current value of a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.

---

| Field | Description |
| --- | --- |
| `current` **\*** *[MetricValueStatus](#MetricValueStatus)* | current contains the current value for the given metric |
| `name` **\*** *string* | name is the name of the resource in question. |

## Operations

---

### `post` Create

#### HTTP Request

POST /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

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
| `body` | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |  |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |
| 201 | Created | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |
| 202 | Accepted | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |

### `patch` Patch

#### HTTP Request

PATCH /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the HorizontalPodAutoscaler |
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
| 200 | OK | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |
| 201 | Created | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |

### `put` Replace

#### HTTP Request

PUT /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the HorizontalPodAutoscaler |
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
| `body` | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |  |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |
| 201 | Created | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |

### `delete` Delete

#### HTTP Request

DELETE /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the HorizontalPodAutoscaler |
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

DELETE /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

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

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the HorizontalPodAutoscaler |
| `namespace` | *string* | object name and auth scope, such as for teams and projects |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |

### `get` List

#### HTTP Request

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers

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
| 200 | OK | *[HorizontalPodAutoscalerList](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscalerList)* |

### `get` List All Namespaces

#### HTTP Request

GET /apis/autoscaling/v2/horizontalpodautoscalers

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
| 200 | OK | *[HorizontalPodAutoscalerList](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscalerList)* |

### `get` Watch

#### HTTP Request

GET /apis/autoscaling/v2/watch/namespaces/{namespace}/horizontalpodautoscalers/{name}

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the HorizontalPodAutoscaler |
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

GET /apis/autoscaling/v2/watch/namespaces/{namespace}/horizontalpodautoscalers

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

GET /apis/autoscaling/v2/watch/horizontalpodautoscalers

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

PATCH /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the HorizontalPodAutoscaler |
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
| 200 | OK | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |
| 201 | Created | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |

### `get` Read Status

#### HTTP Request

GET /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the HorizontalPodAutoscaler |
| `namespace` | *string* | object name and auth scope, such as for teams and projects |

#### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `pretty` | *string* | If 'true', then the output is pretty printed. Defaults to 'false' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |

### `put` Replace Status

#### HTTP Request

PUT /apis/autoscaling/v2/namespaces/{namespace}/horizontalpodautoscalers/{name}/status

#### Path Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` | *string* | name of the HorizontalPodAutoscaler |
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
| `body` | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |  |

#### Response

| Status | Description | Response |
| --- | --- | --- |
| 200 | OK | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |
| 201 | Created | *[HorizontalPodAutoscaler](https://kubernetes.io/docs/reference/kubernetes-api/autoscaling/horizontal-pod-autoscaler-v2/#HorizontalPodAutoscaler)* |

Last modified May 13, 2026 at 6:59 PM PST: [switch kubernetes-api content to gen-apidocs markdown backend (7dffa41ae2)](https://github.com/kubernetes/website/commit/7dffa41ae2e6ae0376a5580760c74f45e910948c)

This page is automatically generated.

If you plan to report an issue with this page, mention that the page is auto-generated in your issue description. The fix may need to happen elsewhere in the Kubernetes project.
