# Glossary | Kubernetes

Source: https://kubernetes.io/docs/reference/glossary

# Glossary

This glossary is intended to be a comprehensive, standardized list of Kubernetes terminology. It includes technical terms that are specific to Kubernetes, as well as more general terms that provide useful context.

*Filter terms according to their tags*

.

The inner components of Kubernetes.

Related to Kubernetes open-source development.

A resource type that Kubernetes supports by default.

Supported customizations of Kubernetes.

Relevant for a first-time user of Kubernetes.

How Kubernetes components talk to each other (and to programs outside the cluster).

Starting and maintaining Kubernetes.

Keeping Kubernetes applications safe and secure.

How Kubernetes applications handle persistent data.

Software that makes Kubernetes easier or better to use.

Represents a common type of Kubernetes user.

Applications running on Kubernetes.

[Architecture](javascript:void(0))
[Community](javascript:void(0))
[Core Object](javascript:void(0))
[Extension](javascript:void(0))
[Fundamental](javascript:void(0))
[Networking](javascript:void(0))
[Operation](javascript:void(0))
[Security](javascript:void(0))
[Storage](javascript:void(0))
[Tool](javascript:void(0))
[User Type](javascript:void(0))
[Workload](javascript:void(0))
[Select all](javascript:void(0))
[Deselect all](javascript:void(0))

Click on the [[+]](javascript:void(0)) indicators below to get a longer explanation for any particular term.

- Add-ons

  Resources that extend the functionality of Kubernetes.

  [[+]](javascript:void(0))

  [Installing addons](/docs/concepts/cluster-administration/addons/) explains more about using add-ons with your cluster, and lists some popular add-ons.
- Admission Controller

  A piece of code that intercepts requests to the Kubernetes API server prior to persistence of the object.

  [[+]](javascript:void(0))

  Admission controllers are configurable for the Kubernetes API server and may be "validating", "mutating", or
  both. Any admission controller may reject the request. Mutating controllers may modify the objects they admit;
  validating controllers may not.

  - [Admission controllers in the Kubernetes documentation](/docs/reference/access-authn-authz/admission-controllers/)
- Affinity

  In Kubernetes, *affinity* is a set of rules that give hints to the scheduler about where to place pods.

  [[+]](javascript:void(0))

  There are two kinds of affinity:

  - [node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
  - [pod-to-pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

  The rules are defined using the Kubernetes [labels](/docs/concepts/overview/working-with-objects/labels "Tags objects with identifying attributes that are meaningful and relevant to users."),
  and [selectors](/docs/concepts/overview/working-with-objects/labels/ "Allows users to filter a list of resources based on labels.") specified in [pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster."),
  and they can be either required or preferred, depending on how strictly you want the scheduler to enforce them.
- Aggregation Layer

  The aggregation layer lets you install additional Kubernetes-style APIs in your cluster.

  [[+]](javascript:void(0))

  When you've configured the [Kubernetes API Server](/docs/concepts/architecture/#kube-apiserver "Control plane component that serves the Kubernetes API.") to [support additional APIs](/docs/tasks/extend-kubernetes/configure-aggregation-layer/), you can add `APIService` objects to "claim" a URL path in the Kubernetes API.
- Annotation

  A key-value pair that is used to attach arbitrary non-identifying metadata to objects.

  [[+]](javascript:void(0))

  The metadata in an annotation can be small or large, structured or unstructured, and can include characters not permitted by [labels](/docs/concepts/overview/working-with-objects/labels "Tags objects with identifying attributes that are meaningful and relevant to users."). Clients such as tools and libraries can retrieve this metadata.
- API Group

  A set of related paths in Kubernetes API.

  [[+]](javascript:void(0))

  You can enable or disable each API group by changing the configuration of your API server. You can also disable or enable paths to specific
  [resources](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server."). An API group makes it easier to extend the Kubernetes API.
  The API group is specified in a REST path and in the `apiVersion` field of a serialized [object](/docs/concepts/overview/working-with-objects/#kubernetes-objects "An entity in the Kubernetes system, representing part of the state of your cluster.").

  - Read [API Group](/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning) for more information.
- API resource

  Also known as: Resource

  An entity in the Kubernetes type system, corresponding to an endpoint on the [Kubernetes API](/docs/concepts/overview/kubernetes-api/ "The application that serves Kubernetes functionality through a RESTful interface and stores the state of the cluster.").
  A resource typically represents an [object](/docs/concepts/overview/working-with-objects/#kubernetes-objects "An entity in the Kubernetes system, representing part of the state of your cluster.").
  Some resources represent an operation on other objects, such as a permission check.

  [[+]](javascript:void(0))

  Each resource represents an HTTP endpoint (URI) on the Kubernetes API server, defining the schema for the objects or operations on that resource.
- API server

  Also known as: kube-apiserver

  The API server is a component of the Kubernetes
  [control plane](/docs/reference/glossary/?all=true#term-control-plane "The container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers.") that exposes the Kubernetes API.
  The API server is the front end for the Kubernetes control plane.

  [[+]](javascript:void(0))

  The main implementation of a Kubernetes API server is [kube-apiserver](/docs/reference/generated/kube-apiserver/).
  kube-apiserver is designed to scale horizontally—that is, it scales by deploying more instances.
  You can run several instances of kube-apiserver and balance traffic between those instances.
- API-initiated eviction

  API-initiated eviction is the process by which you use the [Eviction API](/docs/reference/generated/kubernetes-api/v1.36/#create-eviction-pod-v1-core)
  to create an `Eviction` object that triggers graceful pod termination.

  [[+]](javascript:void(0))

  You can request eviction either by directly calling the Eviction API
  using a client of the kube-apiserver, like the `kubectl drain` command.
  When an `Eviction` object is created, the API server terminates the Pod.

  API-initiated evictions respect your configured [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)
  and [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).

  API-initiated eviction is not the same as [node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/).

  - See [API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/) for more information.
- App Container

  Application containers (or app containers) are the [containers](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.") in a [pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") that are started after any [init containers](/docs/concepts/workloads/pods/init-containers/ "One or more initialization containers that must run to completion before any app containers run.") have completed.

  [[+]](javascript:void(0))

  An init container lets you separate initialization details that are important for the overall
  [workload](/docs/concepts/workloads/ "A workload is an application running on Kubernetes."), and that don't need to keep running
  once the application container has started.
  If a pod doesn't have any init containers configured, all the containers in that pod are app containers.
- Application Architect

  A person responsible for the high-level design of an application.

  [[+]](javascript:void(0))

  An architect ensures that an app's implementation allows it to interact with its surrounding components in a scalable, maintainable way. Surrounding components include databases, logging infrastructure, and other microservices.
- Application Developer

  A person who writes an application that runs in a Kubernetes cluster.

  [[+]](javascript:void(0))

  An application developer focuses on one part of an application. The scale of their focus may vary significantly in size.
- Applications

  The layer where various containerized applications run.

  [[+]](javascript:void(0))
- Approver

  A person who can review and approve Kubernetes code contributions.

  [[+]](javascript:void(0))

  While code review is focused on code quality and correctness, approval is focused on the holistic acceptance of a contribution. Holistic acceptance includes backwards/forwards compatibility, adhering to API and flag conventions, subtle performance and correctness issues, interactions with other parts of the system, and others. Approver status is scoped to a part of the codebase. Approvers were previously referred to as maintainers.
- cAdvisor

  cAdvisor (Container Advisor) provides container users an understanding of the [resource](/docs/reference/glossary/?all=true#term-infrastructure-resource "A defined amount of infrastructure available for consumption (CPU, memory, etc).")
  usage and performance characteristics of their running [containers](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.").

  [[+]](javascript:void(0))

  It is a running daemon that collects, aggregates, processes, and exports information about running containers. Specifically, for each container it keeps resource isolation parameters, historical resource usage, histograms of complete historical resource usage and network statistics. This data is exported by container and machine-wide.
- Certificate

  A cryptographically secure file used to validate access to the Kubernetes cluster.

  [[+]](javascript:void(0))

  Certificates enable applications within a Kubernetes cluster to access the Kubernetes API securely. Certificates validate that clients are allowed to access the API.
- cgroup (control group)

  A group of Linux processes with optional [resource](/docs/reference/glossary/?all=true#term-infrastructure-resource "A defined amount of infrastructure available for consumption (CPU, memory, etc).") isolation, accounting and limits.

  [[+]](javascript:void(0))

  cgroup is a Linux kernel feature that limits, accounts for, and isolates the resource usage (CPU, memory, disk I/O, network) for a collection of processes.
- CIDR

  CIDR (Classless Inter-Domain Routing) is a notation for describing blocks of IP addresses and is used heavily in various networking configurations.

  [[+]](javascript:void(0))

  In the context of Kubernetes, each [Node](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.") is assigned a range of IP addresses through the start address and a subnet mask using CIDR. This allows Nodes to assign each [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") a unique IP address. Although originally a concept for IPv4, CIDR has also been expanded to include IPv6.
- CLA (Contributor License Agreement)

  Terms under which a [contributor](/docs/reference/glossary/?all=true#term-contributor "Someone who donates code, documentation, or their time to help the Kubernetes project or community.") grants a license to an open source project for their contributions.

  [[+]](javascript:void(0))

  CLAs help resolve legal disputes involving contributed material and intellectual property (IP).
- Cloud Controller Manager

  A Kubernetes [control plane](/docs/reference/glossary/?all=true#term-control-plane "The container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers.") component
  that embeds cloud-specific control logic. The cloud controller manager lets you link your
  cluster into your cloud provider's API, and separates out the components that interact
  with that cloud platform from components that only interact with your cluster.

  [[+]](javascript:void(0))

  By decoupling the interoperability logic between Kubernetes and the underlying cloud
  infrastructure, the cloud-controller-manager component enables cloud providers to release
  features at a different pace compared to the main Kubernetes project.
- Cloud Native Computing Foundation (CNCF)

  The Cloud Native Computing Foundation (CNCF) builds sustainable ecosystems and
  fosters a community around [projects](https://www.cncf.io/projects/) that
  orchestrate containers as part of a microservices architecture.

  Kubernetes is a CNCF project.

  [[+]](javascript:void(0))

  The CNCF is a sub-foundation of [the Linux Foundation](https://www.linuxfoundation.org/).
  Its mission is to make cloud native computing ubiquitous.
- Cloud Provider

  Also known as: Cloud Service Provider

  A business or other organization that offers a cloud computing platform.

  [[+]](javascript:void(0))

  Cloud providers, sometimes called Cloud Service Providers (CSPs), offer
  cloud computing platforms or services.

  Many cloud providers offer managed infrastructure (also called
  Infrastructure as a Service or IaaS).
  With managed infrastructure the cloud provider is responsible for
  servers, storage, and networking while you manage layers on top of that
  such as running a Kubernetes cluster.

  You can also find Kubernetes as a managed service; sometimes called
  Platform as a Service, or PaaS. With managed Kubernetes, your
  cloud provider is responsible for the Kubernetes control plane as well
  as the [nodes](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.") and the
  infrastructure they rely on: networking, storage, and possibly other
  elements such as load balancers.
- Cluster

  A set of worker machines, called [nodes](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes."),
  that run containerized applications. Every cluster has at least one worker node.

  [[+]](javascript:void(0))

  The worker node(s) host the [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") that are
  the components of the application workload. The
  [control plane](/docs/reference/glossary/?all=true#term-control-plane "The container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers.") manages the worker
  nodes and the Pods in the cluster. In production environments, the control plane usually
  runs across multiple computers and a cluster usually runs multiple nodes, providing
  fault-tolerance and high availability.
- Cluster Architect

  A person who designs infrastructure that involves one or more Kubernetes clusters.

  [[+]](javascript:void(0))

  Cluster architects are concerned with best practices for distributed systems, for example: high availability and security.
- Cluster Infrastructure

  The infrastructure layer provides and maintains VMs, networking, security groups and others.

  [[+]](javascript:void(0))
- Cluster Operations

  The work involved in managing a Kubernetes cluster: managing
  day-to-day operations, and co-ordinating upgrades.

  [[+]](javascript:void(0))

  Examples of cluster operations work include: deploying new Nodes to
  scale the cluster; performing software upgrades; implementing security
  controls; adding or removing storage; configuring cluster networking;
  managing cluster-wide observability; and responding to events.
- Cluster Operator

  A person who configures, controls, and monitors clusters.

  [[+]](javascript:void(0))

  Their primary responsibility is keeping a cluster up and running, which may involve periodic maintenance activities or upgrades.

  #### Note:

  Cluster operators are different from the [Operator pattern](/docs/concepts/extend-kubernetes/operator/) that extends the Kubernetes API.
- Code Contributor

  A person who develops and contributes code to the Kubernetes open source codebase.

  [[+]](javascript:void(0))

  They are also an active [community member](/docs/reference/glossary/?all=true#term-member "A continuously active contributor in the K8s community.") who participates in one or more [Special Interest Groups (SIGs)](https://github.com/kubernetes/community/blob/main/sig-list.md#special-interest-groups "Community members who collectively manage an ongoing piece or aspect of the larger Kubernetes open source project.").
- Common Expression Language

  Also known as: CEL

  A general-purpose expression language that's designed to be fast, portable, and
  safe to execute.

  [[+]](javascript:void(0))

  In Kubernetes, CEL can be used to run queries and perform fine-grained
  filtering. For example, you can use CEL expressions with
  [dynamic admission control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
  to filter for specific fields in requests, and with
  [dynamic resource allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
  to select resources based on specific attributes.
- Condition

  A condition is a field in a Kubernetes resource's status that describes the current state of that resource.

  [[+]](javascript:void(0))

  Conditions provide a standardized way for Kubernetes components to communicate the status of resources. Each condition has a `type`, a `status` (True, False, or Unknown), and optional fields like `reason` and `message` that provide additional details. For example, a Pod might have conditions like `Ready`, `ContainersReady`, or `PodScheduled`.
- ConfigMap

  An API object used to store non-confidential data in key-value pairs.
  [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") can consume ConfigMaps as
  environment variables, command-line arguments, or as configuration files in a
  [volume](/docs/concepts/storage/volumes/ "A directory containing data, accessible to the containers in a pod.").

  [[+]](javascript:void(0))

  A ConfigMap allows you to decouple environment-specific configuration from your [container images](/docs/reference/glossary/?all=true#term-image "Stored instance of a container that holds a set of software needed to run an application."), so that your applications are easily portable.
- Container

  A lightweight and portable executable image that contains software and all of its dependencies.

  [[+]](javascript:void(0))

  Containers decouple applications from underlying host infrastructure to make deployment easier in different cloud or OS environments, and for easier scaling.
  The applications that run inside containers are called containerized applications. The process of bundling these applications and their dependencies into a container image is called containerization.
- Container Device Interface (CDI)

  The Container Device Interface (CDI) is a specification for how to configure
  devices inside containers. Kubernetes uses CDI together with device plugins and
  with Dynamic Resource Allocation so that workloads receive device setup such as
  bind mounts or environment variables from the runtime.

  [[+]](javascript:void(0))

  - [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  - [Container Device Interface](https://github.com/cncf-tags/container-device-interface)
    specification repository
- Container Environment Variables

  Container environment variables are name=value pairs that provide useful information into containers running in a [pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.")

  [[+]](javascript:void(0))

  Container environment variables provide information that is required by the running containerized applications along with information about important related details to the [containers](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies."). For example, file system details, information about the container itself, and other cluster resources such as service endpoints.
- Container Lifecycle Hooks

  The lifecycle hooks expose events in the [Container](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.") management lifecycle and let the user run code when the events occur.

  [[+]](javascript:void(0))

  Two hooks are exposed to Containers: PostStart which executes immediately after a container is created and PreStop which is blocking and is called immediately before a container is terminated.
- Container network interface (CNI)

  Container network interface (CNI) plugins are a type of Network plugin that adheres to the appc/CNI specification.

  [[+]](javascript:void(0))

  - For information on Kubernetes and CNI, see [**Network Plugins**](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).
- Container Runtime

  A fundamental component that empowers Kubernetes to run containers effectively.
  It is responsible for managing the execution and lifecycle of containers within the Kubernetes environment.

  [[+]](javascript:void(0))

  Kubernetes supports container runtimes such as
  [containerd](https://containerd.io/docs/ "A container runtime with an emphasis on simplicity, robustness and portability"), [CRI-O](https://cri-o.io/#what-is-cri-o "A lightweight container runtime specifically for Kubernetes"),
  and any other implementation of the [Kubernetes CRI (Container Runtime
  Interface)](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-node/container-runtime-interface.md).
- Container Runtime Interface (CRI)

  The main protocol for the communication between the [kubelet](/docs/reference/command-line-tools-reference/kubelet "An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.") and Container Runtime.

  [[+]](javascript:void(0))

  The Kubernetes Container Runtime Interface (CRI) defines the main
  [gRPC](https://grpc.io) protocol for the communication between the
  [node components](/docs/concepts/architecture/#node-components)
  [kubelet](/docs/reference/command-line-tools-reference/kubelet "An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.") and
  [container runtime](/docs/setup/production-environment/container-runtimes "The container runtime is the software that is responsible for running containers.").
- Container Storage Interface (CSI)

  The Container Storage Interface (CSI) defines a standard interface to expose storage systems to containers.

  [[+]](javascript:void(0))

  CSI allows vendors to create custom storage plugins for Kubernetes without adding them to the Kubernetes repository (out-of-tree plugins). To use a CSI driver from a storage provider, you must first [deploy it to your cluster](https://kubernetes-csi.github.io/docs/deploying.html). You will then be able to create a [Storage Class](/docs/concepts/storage/storage-classes "A StorageClass provides a way for administrators to describe different available storage types.") that uses that CSI driver.

  - [CSI in the Kubernetes documentation](/docs/concepts/storage/volumes/#csi)
  - [List of available CSI drivers](https://kubernetes-csi.github.io/docs/drivers.html)
- containerd

  A container runtime with an emphasis on simplicity, robustness and portability

  [[+]](javascript:void(0))

  containerd is a [container](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.") runtime
  that runs as a daemon on Linux or Windows. containerd takes care of fetching and
  storing container images, executing containers, providing network access, and more.
- Contributor

  Someone who donates code, documentation, or their time to help the Kubernetes project or community.

  [[+]](javascript:void(0))

  Contributions include pull requests (PRs), issues, feedback, [special interest groups (SIG)](https://github.com/kubernetes/community/blob/main/sig-list.md#special-interest-groups "Community members who collectively manage an ongoing piece or aspect of the larger Kubernetes open source project.") participation, or organizing community events.
- Control Plane

  The container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers.

  [[+]](javascript:void(0))

  This layer is composed by many different components, such as (but not restricted to):

  - [etcd](/docs/tasks/administer-cluster/configure-upgrade-etcd/ "Consistent and highly-available key value store used as backing store of Kubernetes for all cluster data.")
  - [API Server](/docs/concepts/architecture/#kube-apiserver "Control plane component that serves the Kubernetes API.")
  - [Scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/ "Control plane component that watches for newly created pods with no assigned node, and selects a node for them to run on.")
  - [Controller Manager](/docs/reference/command-line-tools-reference/kube-controller-manager/ "Control Plane component that runs controller processes.")
  - [Cloud Controller Manager](/docs/concepts/architecture/cloud-controller/ "Control plane component that integrates Kubernetes with third-party cloud providers.")

  These components can be run as traditional operating system services (daemons) or as containers. The hosts running these components were historically called [masters](/docs/reference/glossary/?all=true#term-master "Legacy term, used as synonym for nodes running the control plane.").
- Controller

  In Kubernetes, controllers are control loops that watch the state of your
  [cluster](/docs/reference/glossary/?all=true#term-cluster "A set of worker machines, called nodes, that run containerized applications. Every cluster has at least one worker node."), then make or request
  changes where needed.
  Each controller tries to move the current cluster state closer to the desired
  state.

  [[+]](javascript:void(0))

  Controllers watch the shared state of your cluster through the
  [apiserver](/docs/concepts/architecture/#kube-apiserver "Control plane component that serves the Kubernetes API.") (part of the
  [Control Plane](/docs/reference/glossary/?all=true#term-control-plane "The container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers.")).

  Some controllers also run inside the control plane, providing control loops that
  are core to Kubernetes' operations. For example: the deployment controller, the
  daemonset controller, the namespace controller, and the persistent volume
  controller (and others) all run within the
  [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/ "Control Plane component that runs controller processes.").
- CRI-O

  A tool that lets you use OCI container runtimes with Kubernetes CRI.

  [[+]](javascript:void(0))

  CRI-O is an implementation of the [Container Runtime Interface (CRI)](/docs/concepts/architecture/cri "Protocol for communication between the kubelet and the local container runtime.")
  to enable using [container](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.")
  runtimes that are compatible with the Open Container Initiative (OCI)
  [runtime spec](https://www.github.com/opencontainers/runtime-spec).

  Deploying CRI-O allows Kubernetes to use any OCI-compliant runtime as the container
  runtime for running [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster."), and to fetch
  OCI container images from remote registries.
- CronJob

  Manages a [Job](/docs/concepts/workloads/controllers/job/) that runs on a periodic schedule.

  [[+]](javascript:void(0))

  Similar to a line in a *crontab* file, a CronJob object specifies a schedule using the [cron](https://en.wikipedia.org/wiki/Cron) format.
- CustomResourceDefinition

  A kind of [API object](/docs/concepts/overview/working-with-objects/#kubernetes-objects "An entity in the Kubernetes system, representing part of the state of your cluster.") that defines a new custom API to add
  to your Kubernetes API server, without building a complete custom server.

  [[+]](javascript:void(0))

  CustomResourceDefinitions let you extend the Kubernetes API for your environment if the built-in
  [API resources](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server.") can't meet your needs.
- DaemonSet

  Ensures a copy of a [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") is running across a set of nodes in a [cluster](/docs/reference/glossary/?all=true#term-cluster "A set of worker machines, called nodes, that run containerized applications. Every cluster has at least one worker node.").

  [[+]](javascript:void(0))

  Used to deploy system daemons such as log collectors and monitoring agents that typically must run on every [Node](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.").
- Data Plane

  The layer that provides capacity such as CPU, memory, network, and storage so that the containers can run and connect to a network.

  [[+]](javascript:void(0))
- Deployment

  An API object that manages a replicated application, typically by running Pods with no local state.

  [[+]](javascript:void(0))

  Each replica is represented by a [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster."), and the Pods are distributed among the
  [nodes](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.") of a cluster.
  For workloads that do require local state, consider using a [StatefulSet](/docs/concepts/workloads/controllers/statefulset/ "A StatefulSet manages deployment and scaling of a set of Pods, with durable storage and persistent identifiers for each Pod.").
- Developer (disambiguation)

  May refer to: [Application Developer](/docs/reference/glossary/?all=true#term-application-developer "A person who writes an application that runs in a Kubernetes cluster."), [Code Contributor](https://github.com/kubernetes/community/tree/main/contributors/devel "A person who develops and contributes code to the Kubernetes open source codebase."), or [Platform Developer](/docs/reference/glossary/?all=true#term-platform-developer "A person who customizes the Kubernetes platform to fit the needs of their project.").

  [[+]](javascript:void(0))

  This overloaded term may have different meanings depending on the context
- Device

  One or more
  [infrastructure resources](/docs/reference/glossary/?all=true#term-infrastructure-resource "A defined amount of infrastructure available for consumption (CPU, memory, etc).")
  that are directly or indirectly attached to your
  [nodes](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.").

  [[+]](javascript:void(0))

  Devices might be commercial products like GPUs, or custom hardware like
  [ASIC boards](https://en.wikipedia.org/wiki/Application-specific_integrated_circuit).
  Attached devices usually require device drivers that let Kubernetes
  [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") access the devices.
- Device Plugin

  Device plugins run on worker
  [Nodes](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.") and provide
  [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") with access to
  infrastructure [resources](/docs/reference/glossary/?all=true#term-infrastructure-resource "A defined amount of infrastructure available for consumption (CPU, memory, etc)."),
  such as local hardware, that require vendor-specific initialization or setup
  steps.

  [[+]](javascript:void(0))

  Device plugins advertise resources to the
  [kubelet](/docs/reference/command-line-tools-reference/kubelet "An agent that runs on each node in the cluster. It makes sure that containers are running in a pod."), so that workload
  Pods can access hardware features that relate to the Node where that Pod is running.
  You can deploy a device plugin as a [DaemonSet](/docs/concepts/workloads/controllers/daemonset "Ensures a copy of a Pod is running across a set of nodes in a cluster."),
  or install the device plugin software directly on each target Node.

  See
  [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  for more information.
- DeviceClass

  A category of [devices](/docs/reference/glossary/?all=true#term-device "Any resource that's directly or indirectly attached your cluster's nodes, like GPUs or circuit boards.") in the
  cluster that can be used with dynamic resource allocation (DRA).

  [[+]](javascript:void(0))

  Administrators or device owners use DeviceClasses to define a set of devices
  that can be claimed and used in workloads. Devices are claimed by creating
  [ResourceClaims](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates "Describes the resources that a workload needs, such as devices. ResourceClaims can request devices from DeviceClasses.")
  that filter for specific device parameters in a DeviceClass.

  For more information, see
  [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass)
- Disruption

  Disruptions are events that lead to one or more
  [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") going out of service.
  A disruption has consequences for workload management [resources](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server."),
  such as [Deployment](/docs/concepts/workloads/controllers/deployment/ "Manages a replicated application on your cluster."), that rely on the affected
  Pods.

  [[+]](javascript:void(0))

  If you, as cluster operator, destroy a Pod that belongs to an application,
  Kubernetes terms that a *voluntary disruption*. If a Pod goes offline
  because of a Node failure, or an outage affecting a wider failure zone,
  Kubernetes terms that an *involuntary disruption*.

  See [Disruptions](/docs/concepts/workloads/pods/disruptions/) for more information.
- Docker

  Docker (specifically, Docker Engine) is a software technology providing operating-system-level virtualization also known as [containers](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.").

  [[+]](javascript:void(0))

  Docker uses the resource isolation features of the Linux kernel such as cgroups and kernel namespaces, and a union-capable file system such as OverlayFS and others to allow independent containers to run within a single Linux instance, avoiding the overhead of starting and maintaining virtual machines (VMs).
- Dockershim

  The dockershim is a component of Kubernetes version 1.23 and earlier. It allows the [kubelet](/docs/reference/command-line-tools-reference/kubelet "An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.")
  to communicate with [Docker Engine](https://docs.docker.com/engine/ "Docker is a software technology providing operating-system-level virtualization also known as containers.").

  [[+]](javascript:void(0))

  Starting with version 1.24, dockershim has been removed from Kubernetes. For more information, see [Dockershim FAQ](/dockershim).
- Downstream (disambiguation)

  May refer to: code in the Kubernetes ecosystem that depends upon the core Kubernetes codebase or a forked repo.

  [[+]](javascript:void(0))

  - In the **Kubernetes Community**: Conversations often use *downstream* to mean the ecosystem, code, or third-party tools that rely on the core Kubernetes codebase. For example, a new feature in Kubernetes may be adopted by applications *downstream* to improve their functionality.
  - In **GitHub** or **git**: The convention is to refer to a forked repo as *downstream*, whereas the source repo is considered *upstream*.
- Downward API

  Kubernetes' mechanism to expose Pod and container field values to code running in a container.

  [[+]](javascript:void(0))

  It is sometimes useful for a container to have information about itself, without
  needing to make changes to the container code that directly couple it to Kubernetes.

  The Kubernetes downward API allows containers to consume information about themselves
  or their context in a Kubernetes cluster. Applications in containers can have
  access to that information, without the application needing to act as a client of
  the Kubernetes API.

  There are two ways to expose Pod and container fields to a running container:

  - using [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
  - using [a `downwardAPI` volume](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

  Together, these two ways of exposing Pod and container fields are called the *downward API*.
- Drain

  The process of safely evicting [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") from a [Node](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.") to prepare it for maintenance or removal from a [cluster](/docs/reference/glossary/?all=true#term-cluster "A set of worker machines, called nodes, that run containerized applications. Every cluster has at least one worker node.").

  [[+]](javascript:void(0))

  The `kubectl drain` command is used to mark a [Node](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.") as going out of service.
  When executed, it evicts all [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") from the [Node](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.").
  If an eviction request is temporarily rejected, `kubectl drain` retries until all [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") are terminated or a configurable timeout is reached.
- Duration

  A string value representing an amount of time.

  [[+]](javascript:void(0))

  The format of a (Kubernetes) duration is based on the
  [`time.Duration`](https://pkg.go.dev/time#Duration) type from the Go programming language.

  In Kubernetes APIs that use durations, the value is expressed as series of a non-negative
  integers combined with a time unit suffix. You can have more than one time quantity and
  the duration is the sum of those time quantities.
  The valid time units are "ns", "µs" (or "us"), "ms", "s", "m", and "h".

  For example: `5s` represents a duration of five seconds, and `1m30s` represents a duration
  of one minute and thirty seconds.
- Dynamic Resource Allocation

  Also known as: DRA

  A Kubernetes feature that lets you request and share resources among Pods.
  These resources are often attached
  [devices](/docs/reference/glossary/?all=true#term-device "Any resource that's directly or indirectly attached your cluster's nodes, like GPUs or circuit boards.") like hardware
  accelerators.

  [[+]](javascript:void(0))

  With DRA, device drivers and cluster admins define device *classes* that are
  available to *claim* in workloads. Kubernetes allocates matching devices to
  specific claims and places the corresponding Pods on nodes that can access the
  allocated devices.
- Dynamic Volume Provisioning

  Allows users to request automatic creation of storage [Volumes](/docs/concepts/storage/volumes/ "A directory containing data, accessible to the containers in a pod.").

  [[+]](javascript:void(0))

  Dynamic provisioning eliminates the need for cluster administrators to pre-provision storage. Instead, it automatically provisions storage by user request. Dynamic volume provisioning is based on an API object, [StorageClass](/docs/concepts/storage/storage-classes "A StorageClass provides a way for administrators to describe different available storage types."), referring to a [Volume Plugin](/docs/reference/glossary/?all=true#term-volume-plugin "A Volume Plugin enables integration of storage within a Pod.") that provisions a [Volume](/docs/concepts/storage/volumes/ "A directory containing data, accessible to the containers in a pod.") and the set of parameters to pass to the Volume Plugin.
- Endpoints

  A deprecated API that represents the set of all endpoints for a
  [Service](/docs/concepts/services-networking/service/ "A way to expose an application running on a set of Pods as a network service.").

  [[+]](javascript:void(0))

  Since v1.21, Kubernetes uses
  [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/ "EndpointSlices track the IP addresses of Pods for Services.")
  rather than Endpoints; the original Endpoints API was deprecated due to
  concerns about scalability.

  To learn more about Endpoints, read [Endpoints](/docs/concepts/services-networking/service/#endpoints).
- EndpointSlice

  EndpointSlices track the IP addresses of backend endpoints.
  EndpointSlices are normally associated with a
  [Service](/docs/concepts/services-networking/service/ "A way to expose an application running on a set of Pods as a network service.") and the backend endpoints typically represent
  [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.").

  [[+]](javascript:void(0))

  One Service can be backed by multiple Pods. Kubernetes represents the backing endpoints of a Service
  with a set of EndpointSlices that are associated with that Service.
  The backing endpoints are usually, but not always, pods running in the cluster.

  The control plane usually manages EndpointSlices for you automatically. However,
  EndpointSlices can be defined manually for [Services](/docs/concepts/services-networking/service/ "A way to expose an application running on a set of Pods as a network service.") without
  [selectors](/docs/concepts/overview/working-with-objects/labels/ "Allows users to filter a list of resources based on labels.") specified.
- Ephemeral Container

  A [Container](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.") type that you can temporarily run inside a [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.").

  [[+]](javascript:void(0))

  If you want to investigate a Pod that's running with problems, you can add an ephemeral container to that Pod and carry out diagnostics.
  Ephemeral containers have no [resource](/docs/reference/glossary/?all=true#term-infrastructure-resource "A defined amount of infrastructure available for consumption (CPU, memory, etc).") or scheduling guarantees,
  and you should not use them to run any part of the workload itself.

  Ephemeral containers are not supported by [static pods](/docs/tasks/configure-pod-container/static-pod/ "A pod managed directly by the kubelet daemon on a specific node.").
- etcd

  Consistent and highly-available key value store used as Kubernetes' backing store for all cluster data.

  [[+]](javascript:void(0))

  If your Kubernetes cluster uses etcd as its backing store, make sure you have a
  [back up](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster) plan
  for the data.

  You can find in-depth information about etcd in the official [documentation](https://etcd.io/docs/).
- Event

  A Kubernetes [object](/docs/concepts/overview/working-with-objects/#kubernetes-objects "An entity in the Kubernetes system, representing part of the state of your cluster.") that describes state changes
  or notable occurrences in the cluster.

  [[+]](javascript:void(0))

  Events have a limited retention time and triggers and messages may evolve with time.
  Event consumers should not rely on the timing of an event with a given reason reflecting a consistent underlying trigger,
  or the continued existence of events with that reason.

  Events should be treated as informative, best-effort, supplemental data.

  In Kubernetes, [auditing](/docs/tasks/debug/debug-cluster/audit/) generates a different kind of
  Event record (API group `audit.k8s.io`).
- Eviction

  Eviction is the process of terminating one or more Pods on Nodes.

  [[+]](javascript:void(0))

  There are two kinds of eviction:

  - [Node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
  - [API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/)
- Extensions

  Extensions are software components that extend and deeply integrate with Kubernetes to support new types of hardware.

  [[+]](javascript:void(0))

  Many cluster administrators use a hosted or distribution instance of Kubernetes. These clusters
  come with extensions pre-installed. As a result, most Kubernetes users will not need to install
  [extensions](/docs/concepts/extend-kubernetes/) and even fewer users will need to author new ones.
- Feature gate

  Feature gates are a set of keys (opaque string values) that you can use to control which
  Kubernetes features are enabled in your cluster.

  [[+]](javascript:void(0))

  You can turn these features on or off using the `--feature-gates` command line flag on each Kubernetes component.
  Each Kubernetes component lets you enable or disable a set of feature gates that are relevant to that component.
  The Kubernetes documentation lists all current
  [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) and what they control.
- Finalizer

  Finalizers are namespaced keys that tell Kubernetes to wait until specific
  conditions are met before it fully deletes [resources](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server.")
  that are marked for deletion.
  Finalizers alert [controllers](/docs/concepts/architecture/controller/ "A control loop that watches the shared state of the cluster through the apiserver and makes changes attempting to move the current state towards the desired state.")
  to clean up resources the deleted object owned.

  [[+]](javascript:void(0))

  When you tell Kubernetes to delete an object that has finalizers specified for
  it, the Kubernetes API marks the object for deletion by populating `.metadata.deletionTimestamp`,
  and returns a `202` status code (HTTP "Accepted"). The target object remains in a terminating state while the
  control plane, or other components, take the actions defined by the finalizers.
  After these actions are complete, the controller removes the relevant finalizers
  from the target object. When the `metadata.finalizers` field is empty,
  Kubernetes considers the deletion complete and deletes the object.

  You can use finalizers to control [garbage collection](/docs/concepts/architecture/garbage-collection/ "A collective term for the various mechanisms Kubernetes uses to clean up cluster resources.")
  of resources. For example, you can define a finalizer to clean up related
  [API resources](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server.") or infrastructure before the controller
  deletes the object being finalized.
- FlexVolume

  FlexVolume is a deprecated interface for creating out-of-tree volume plugins. The [Container Storage Interface](/docs/concepts/storage/volumes/#csi "The Container Storage Interface (CSI) defines a standard interface to expose storage systems to containers.") is a newer interface that addresses several problems with FlexVolume.

  [[+]](javascript:void(0))

  FlexVolumes enable users to write their own drivers and add support for their volumes in Kubernetes. FlexVolume driver binaries and dependencies must be installed on host machines. This requires root access. The Storage SIG suggests implementing a [CSI](/docs/concepts/storage/volumes/#csi "The Container Storage Interface (CSI) defines a standard interface to expose storage systems to containers.") driver if possible since it addresses the limitations with FlexVolumes.

  - [FlexVolume in the Kubernetes documentation](/docs/concepts/storage/volumes/#flexvolume)
  - [More information on FlexVolumes](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-storage/flexvolume.md)
  - [Volume Plugin FAQ for Storage Vendors](https://github.com/kubernetes/community/blob/main/sig-storage/volume-plugin-faq.md)
- Garbage Collection

  Garbage collection is a collective term for the various mechanisms Kubernetes uses to clean up
  cluster resources.

  [[+]](javascript:void(0))

  Kubernetes uses garbage collection to clean up resources like
  [unused containers and images](/docs/concepts/architecture/garbage-collection/#containers-images),
  [failed Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection),
  [objects owned by the targeted resource](/docs/concepts/overview/working-with-objects/owners-dependents/),
  [completed Jobs](/docs/concepts/workloads/controllers/ttlafterfinished/), and resources
  that have expired or failed.
- Gateway API

  A family of API kinds for modeling service networking in Kubernetes.

  [[+]](javascript:void(0))

  Gateway API provides a family of extensible, role-oriented, protocol-aware
  API kinds for modeling service networking in Kubernetes.
- Group Version Resource

  Also known as: GVR

  Means of representing specific Kubernetes APIs uniquely.

  [[+]](javascript:void(0))

  Group Version Resources (GVRs) specify the API group, API version, and *resource* (name for the object kind as it appears in the URI) associated with accessing a particular id of object in Kubernetes.
  GVRs let you define and distinguish different Kubernetes objects, and to specify a way of accessing
  objects that is stable even as APIs change.

  In this usage, *resource* refers to an HTTP resource. Because some APIs are namespaced, a GVR may
  not refer to a specific [API resource](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server.").
- Helm Chart

  A package of pre-configured Kubernetes configurations that can be managed with the Helm tool.

  [[+]](javascript:void(0))

  Charts provide a reproducible way of creating and sharing Kubernetes applications.
  A single chart can be used to deploy something simple, like a memcached Pod, or something complex, like a full web app stack with HTTP servers, databases, caches, and so on.
- Horizontal Pod Autoscaler

  Also known as: HPA

  An [object](/docs/concepts/overview/working-with-objects/#kubernetes-objects "An entity in the Kubernetes system, representing part of the state of your cluster.") that automatically scales the number of [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") replicas,
  based on targeted [resource](/docs/reference/glossary/?all=true#term-infrastructure-resource "A defined amount of infrastructure available for consumption (CPU, memory, etc).") utilization or custom metric targets.

  [[+]](javascript:void(0))

  HorizontalPodAutoscaler (HPA) is typically used with [Deployments](/docs/concepts/workloads/controllers/deployment/ "Manages a replicated application on your cluster."), or [ReplicaSets](/docs/concepts/workloads/controllers/replicaset/ "ReplicaSet ensures that a specified number of Pod replicas are running at one time"). It cannot be applied to objects that cannot be scaled, for example [DaemonSets](/docs/concepts/workloads/controllers/daemonset "Ensures a copy of a Pod is running across a set of nodes in a cluster.").
- HostAliases

  A HostAliases is a mapping between the IP address and hostname to be injected into a [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.")'s hosts file.

  [[+]](javascript:void(0))

  [HostAliases](/docs/reference/generated/kubernetes-api/v1.36/#hostalias-v1-core) is an optional list of hostnames and IP addresses that will be injected into the Pod's hosts file if specified. This is only valid for non-hostNetwork Pods.
- Image

  Stored instance of a [Container](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.") that holds a set of software needed to run an application.

  [[+]](javascript:void(0))

  A way of packaging software that allows it to be stored in a container registry, pulled to a local system, and run as an application. Meta data is included in the image that can indicate what executable to run, who built it, and other information.
- Immutable Infrastructure

  Immutable Infrastructure refers to computer infrastructure (virtual machines, containers, network appliances) that cannot be changed once deployed.

  [[+]](javascript:void(0))

  Immutability can be enforced by an automated process that overwrites unauthorized changes or through a system that won’t allow changes in the first place.
  [Containers](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.") are a good example of immutable infrastructure because persistent changes to containers
  can only be made by creating a new version of the container or recreating the existing container from its image.

  By preventing or identifying unauthorized changes, immutable infrastructures make it easier to identify and mitigate security risks.
  Operating such a system becomes a lot more straightforward because administrators can make assumptions about it.
  After all, they know no one made mistakes or changes they forgot to communicate.
  Immutable infrastructure goes hand-in-hand with infrastructure as code where all automation needed
  to create infrastructure is stored in version control (such as Git).
  This combination of immutability and version control means that there is a durable audit log of every authorized change to a system.
- Ingress

  An API object that manages external access to the services in a cluster, typically HTTP.

  [[+]](javascript:void(0))

  Ingress may provide load balancing, SSL termination and name-based virtual hosting.
- Init Container

  One or more initialization [containers](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.") that must run to completion before any app containers run.

  [[+]](javascript:void(0))

  Initialization (init) containers are like regular app containers, with one difference: init containers must run to completion before any app containers can start. Init containers run in series: each init container must run to completion before the next init container begins.

  Unlike [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/ "An auxilliary container that stays running throughout the lifecycle of a Pod."), init containers do not remain running after Pod startup.

  For more information, read [init containers](/docs/concepts/workloads/pods/init-containers/).
- Istio

  An open platform (not Kubernetes-specific) that provides a uniform way to integrate microservices, manage traffic flow, enforce policies, and aggregate telemetry data.

  [[+]](javascript:void(0))

  Adding Istio does not require changing application code. It is a layer of infrastructure between a service and the network, which when combined with service deployments, is commonly referred to as a service mesh. Istio's control plane abstracts away the underlying cluster management platform, which may be Kubernetes, Mesosphere, etc.
- Job

  A finite or batch task that runs to completion.

  [[+]](javascript:void(0))

  Creates one or more [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") objects and ensures that a specified number of them successfully terminate. As Pods successfully complete, the Job tracks the successful completions.
- JSON Web Token (JWT)

  A means of representing claims to be transferred between two parties.

  [[+]](javascript:void(0))

  JWTs can be digitally signed and encrypted. Kubernetes uses JWTs as
  authentication tokens to verify the identity of entities that want to perform
  actions in a cluster.
- kOps (Kubernetes Operations)

  `kOps` will not only help you create, destroy, upgrade and maintain production-grade, highly available, Kubernetes cluster, but it will also provision the necessary cloud infrastructure.

  [[+]](javascript:void(0))

  #### Note:

  AWS (Amazon Web Services) is currently officially supported, with DigitalOcean, GCE and OpenStack in beta support, and Azure in alpha.

  `kOps` is an automated provisioning system:

  - Fully automated installation
  - Uses DNS to identify clusters
  - Self-healing: everything runs in Auto-Scaling Groups
  - Multiple OS support (Amazon Linux, Debian, Flatcar, RHEL, Rocky and Ubuntu)
  - High-Availability support
  - Can directly provision, or generate terraform manifests
- kube-controller-manager

  Control plane component that runs [controller](/docs/concepts/architecture/controller/ "A control loop that watches the shared state of the cluster through the apiserver and makes changes attempting to move the current state towards the desired state.") processes.

  [[+]](javascript:void(0))

  Logically, each [controller](/docs/concepts/architecture/controller/ "A control loop that watches the shared state of the cluster through the apiserver and makes changes attempting to move the current state towards the desired state.") is a separate process, but to reduce complexity, they are all compiled into a single binary and run in a single process.
- kube-proxy

  kube-proxy is a network proxy that runs on each
  [node](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.") in your cluster,
  implementing part of the Kubernetes
  [Service](/docs/concepts/services-networking/service/ "A way to expose an application running on a set of Pods as a network service.") concept.

  [[+]](javascript:void(0))

  [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
  maintains network rules on nodes. These network rules allow network
  communication to your Pods from network sessions inside or outside of
  your cluster.

  kube-proxy uses the operating system packet filtering layer if there is one
  and it's available. Otherwise, kube-proxy forwards the traffic itself.
- kube-scheduler

  Control plane component that watches for newly created
  [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") with no assigned
  [node](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes."), and selects a node for them
  to run on.

  [[+]](javascript:void(0))

  Factors taken into account for scheduling decisions include:
  individual and collective [resource](/docs/reference/glossary/?all=true#term-infrastructure-resource "A defined amount of infrastructure available for consumption (CPU, memory, etc).")
  requirements, hardware/software/policy constraints, affinity and anti-affinity specifications,
  data locality, inter-workload interference, and deadlines.
- Kubeadm

  A tool for quickly installing Kubernetes and setting up a secure cluster.

  [[+]](javascript:void(0))

  You can use kubeadm to install both the control plane and the [worker node](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.") components.
- Kubectl

  Also known as: kubectl

  Command line tool for communicating with a Kubernetes cluster's
  [control plane](/docs/reference/glossary/?all=true#term-control-plane "The container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers."),
  using the Kubernetes API.

  [[+]](javascript:void(0))

  You can use `kubectl` to create, inspect, update, and delete Kubernetes objects.

  In English, `kubectl` is (officially) pronounced /kjuːb/ /kənˈtɹəʊl/ (like "cube control").
- Kubelet

  An agent that runs on each [node](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.") in the cluster. It makes sure that [containers](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.") are running in a [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.").

  [[+]](javascript:void(0))

  The [kubelet](/docs/reference/command-line-tools-reference/kubelet/) takes a set of PodSpecs that
  are provided through various mechanisms and ensures that the containers described in those
  PodSpecs are running and healthy. The kubelet doesn't manage containers which were not created by
  Kubernetes.
- Kubernetes API

  The application that serves Kubernetes functionality through a RESTful interface and stores the state of the cluster.

  [[+]](javascript:void(0))

  Kubernetes resources and "records of intent" are all stored as API objects, and modified via RESTful calls to the API. The API allows configuration to be managed in a declarative way. Users can interact with the Kubernetes API directly, or via tools like `kubectl`. The core Kubernetes API is flexible and can also be extended to support custom resources.
- Label

  Tags objects with identifying attributes that are meaningful and relevant to users.

  [[+]](javascript:void(0))

  Labels are key/value pairs that are attached to objects such as [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster."). They are used to organize and to select subsets of objects.
- LimitRange

  Constraints resource consumption per [container](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.") or [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster."),
  specified for a particular [namespace](/docs/concepts/overview/working-with-objects/namespaces "An abstraction used by Kubernetes to support isolation of groups of resources within a single cluster.").

  [[+]](javascript:void(0))

  A [LimitRange](/docs/concepts/policy/limit-range/) either limits the quantity of [API resources](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server.")
  that can be created (for a particular resource type),
  or the amount of [infrastructure resources](/docs/reference/glossary/?all=true#term-infrastructure-resource "A defined amount of infrastructure available for consumption (CPU, memory, etc).")
  that may be requested/consumed by individual containers or Pods within a namespace.
- Logging

  Logs are the list of events that are logged by [cluster](/docs/reference/glossary/?all=true#term-cluster "A set of worker machines, called nodes, that run containerized applications. Every cluster has at least one worker node.") or application.

  [[+]](javascript:void(0))

  Application and systems logs can help you understand what is happening inside your cluster. The logs are particularly useful for debugging problems and monitoring cluster activity.
- Managed Service

  A software offering maintained by a third-party provider.

  [[+]](javascript:void(0))

  Some examples of Managed Services are AWS EC2, Azure SQL Database, and
  GCP Pub/Sub, but they can be any software offering that can be used by an application.
- Manifest

  Specification of a Kubernetes API object in [JSON](https://www.json.org/json-en.html)
  or [YAML](https://yaml.org/) format.

  [[+]](javascript:void(0))

  A manifest specifies the desired state of an object that Kubernetes will maintain when you apply the manifest.
  For YAML format, each file can contain multiple manifests.
- Master

  Legacy term, used as synonym for [nodes](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.") hosting the [control plane](/docs/reference/glossary/?all=true#term-control-plane "The container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers.").

  [[+]](javascript:void(0))

  The term is still being used by some provisioning tools, such as [kubeadm](/docs/reference/setup-tools/kubeadm/ "A tool for quickly installing Kubernetes and setting up a secure cluster."), and managed services, to [label](/docs/concepts/overview/working-with-objects/labels "Tags objects with identifying attributes that are meaningful and relevant to users.") [nodes](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.") with `kubernetes.io/role` and control placement of [control plane](/docs/reference/glossary/?all=true#term-control-plane "The container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers.") [pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.").
- Member

  A continuously active [contributor](/docs/reference/glossary/?all=true#term-contributor "Someone who donates code, documentation, or their time to help the Kubernetes project or community.") in the K8s community.

  [[+]](javascript:void(0))

  Members can have issues and PRs assigned to them and participate in [special interest groups (SIGs)](https://github.com/kubernetes/community/blob/main/sig-list.md#special-interest-groups "Community members who collectively manage an ongoing piece or aspect of the larger Kubernetes open source project.") through GitHub teams. Pre-submit tests are automatically run for members' PRs. A member is expected to remain an active contributor to the community.
- Minikube

  A tool for running Kubernetes locally.

  [[+]](javascript:void(0))

  Minikube runs an all-in-one or a multi-node local Kubernetes cluster inside a VM on your computer.
  You can use Minikube to
  [try Kubernetes in a learning environment](/docs/tasks/tools/#minikube).
- Mirror Pod

  A [pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") object that a [kubelet](/docs/reference/command-line-tools-reference/kubelet "An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.") uses
  to represent a [static pod](/docs/tasks/configure-pod-container/static-pod/ "A pod managed directly by the kubelet daemon on a specific node.")

  [[+]](javascript:void(0))

  When the kubelet finds a static pod in its configuration, it automatically tries to
  create a Pod object on the Kubernetes API server for it. This means that the pod
  will be visible on the API server, but cannot be controlled from there.

  (For example, removing a mirror pod will not stop the kubelet daemon from running it).
- Mixed Version Proxy (MVP)

  Also known as: MVP

  Feature to let a kube-apiserver proxy a resource request to a different peer API server.

  [[+]](javascript:void(0))

  When a cluster has multiple API servers running different versions of Kubernetes, this
  feature enables [resource](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server.")
  requests to be served by the correct API server.

  MVP is disabled by default and can be activated by enabling
  the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) named `UnknownVersionInteroperabilityProxy` when
  the [API Server](/docs/concepts/architecture/#kube-apiserver "Control plane component that serves the Kubernetes API.") is started.
- Name

  A client-provided string that refers to an object in a [resource](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server.")
  URL, such as `/api/v1/pods/some-name`.

  [[+]](javascript:void(0))

  Only one object of a given kind can have a given name at a time. However, if you delete the object, you can make a new object with the same name.
- Namespace

  An abstraction used by Kubernetes to support isolation of groups of [API resources](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server.")
  within a single [cluster](/docs/reference/glossary/?all=true#term-cluster "A set of worker machines, called nodes, that run containerized applications. Every cluster has at least one worker node.").

  [[+]](javascript:void(0))

  Namespaces are used to organize objects in a cluster and provide a way to divide cluster resources. Names of resources need to be unique within a namespace, but not across namespaces. Namespace-based scoping is applicable only for namespaced resources *(for example: Pods, Deployments, Services)* and not for cluster-wide resources *(for example: StorageClasses, Nodes, PersistentVolumes)*.
- Network Policy

  A specification of how groups of Pods are allowed to communicate with each other and with other network endpoints.

  [[+]](javascript:void(0))

  NetworkPolicies help you declaratively configure which Pods are allowed to connect to each other, which namespaces are allowed to communicate,
  and more specifically which port numbers to enforce each policy on. NetworkPolicy objects use [labels](/docs/concepts/overview/working-with-objects/labels "Tags objects with identifying attributes that are meaningful and relevant to users.")
  to select Pods and define rules which specify what traffic is allowed to the selected Pods.

  NetworkPolicies are implemented by a supported network plugin provided by a network provider.
  Be aware that creating a NetworkPolicy object without a controller to implement it will have no effect.
- Node

  A node is a worker machine in Kubernetes.

  [[+]](javascript:void(0))

  A worker node may be a VM or physical machine, depending on the cluster. It has local daemons or services necessary to run [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") and is managed by the control plane. The daemons on a node include [kubelet](/docs/reference/command-line-tools-reference/kubelet "An agent that runs on each node in the cluster. It makes sure that containers are running in a pod."), [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/ "kube-proxy is a network proxy that runs on each node in the cluster."), and a container runtime implementing the [CRI](/docs/concepts/architecture/cri "Protocol for communication between the kubelet and the local container runtime.") such as [Docker](https://docs.docker.com/engine/ "Docker is a software technology providing operating-system-level virtualization also known as containers.").

  In early Kubernetes versions, Nodes were called "Minions".
- Node-pressure eviction

  Also known as: kubelet eviction

  Node-pressure eviction is the process by which the [kubelet](/docs/reference/command-line-tools-reference/kubelet "An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.") proactively terminates
  pods to reclaim [resource](/docs/reference/glossary/?all=true#term-infrastructure-resource "A defined amount of infrastructure available for consumption (CPU, memory, etc).")
  on nodes.

  [[+]](javascript:void(0))

  The kubelet monitors resources like CPU, memory, disk space, and filesystem
  inodes on your cluster's nodes. When one or more of these resources reach
  specific consumption levels, the kubelet can proactively fail one or more pods
  on the node to reclaim resources and prevent starvation.

  Node-pressure eviction is not the same as [API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/).
- Object

  An entity in the Kubernetes system. An object is an
  [API resource](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server.") that the Kubernetes API
  uses to represent the state of your cluster.

  [[+]](javascript:void(0))

  A Kubernetes object is typically a “record of intent”—once you create the object, the Kubernetes
  [control plane](/docs/reference/glossary/?all=true#term-control-plane "The container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers.") works constantly to ensure
  that the item it represents actually exists.
  By creating an object, you're effectively telling the Kubernetes system what you want that part of
  your cluster's workload to look like; this is your cluster's desired state.
- Operator pattern

  The [operator pattern](/docs/concepts/extend-kubernetes/operator/) is a system
  design that links a [Controller](/docs/concepts/architecture/controller/ "A control loop that watches the shared state of the cluster through the apiserver and makes changes attempting to move the current state towards the desired state.") to one or more custom
  resources.

  [[+]](javascript:void(0))

  You can extend Kubernetes by adding controllers to your cluster, beyond the built-in
  controllers that come as part of Kubernetes itself.

  If a running application acts as a controller and has API access to carry out tasks
  against a custom resource that's defined in the control plane, that's an example of
  the Operator pattern.
- Persistent Volume

  An API object that represents a piece of storage in the cluster. Representation of as a general, pluggable storage
  [resource](/docs/reference/glossary/?all=true#term-infrastructure-resource "A defined amount of infrastructure available for consumption (CPU, memory, etc).") that can persist beyond the lifecycle of any
  individual [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.").

  [[+]](javascript:void(0))

  PersistentVolumes (PVs) provide an API that abstracts details of how storage is provided from how it is consumed.
  PVs are used directly in scenarios where storage can be created ahead of time (static provisioning).
  For scenarios that require on-demand storage (dynamic provisioning), PersistentVolumeClaims (PVCs) are used instead.
- Persistent Volume Claim

  Claims storage [resources](/docs/reference/glossary/?all=true#term-infrastructure-resource "A defined amount of infrastructure available for consumption (CPU, memory, etc).") defined in a
  [PersistentVolume](/docs/concepts/storage/persistent-volumes/ "API object that represents a piece of storage in the cluster."), so that the storage can be mounted as
  a volume in a [container](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.").

  [[+]](javascript:void(0))

  Specifies the amount of storage, how the storage will be accessed (read-only, read-write and/or exclusive) and how it is reclaimed (retained, recycled or deleted). Details of the storage itself are described in the PersistentVolume object.
- Platform Developer

  A person who customizes the Kubernetes platform to fit the needs of their project.

  [[+]](javascript:void(0))

  A platform developer may, for example, use [Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) or
  [Extend the Kubernetes API with the aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
  to add functionality to their instance of Kubernetes, specifically for their application.
  Some Platform Developers are also [contributors](/docs/reference/glossary/?all=true#term-contributor "Someone who donates code, documentation, or their time to help the Kubernetes project or community.") and
  develop extensions which are contributed to the Kubernetes community.
  Others develop closed-source commercial or site-specific extensions.
- Pod

  The smallest and simplest Kubernetes object. A Pod represents a set of running [containers](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.") on your cluster.

  [[+]](javascript:void(0))

  A Pod is typically set up to run a single primary container. It can also run optional sidecar containers that add supplementary features like logging. Pods are commonly managed by a [Deployment](/docs/concepts/workloads/controllers/deployment/ "Manages a replicated application on your cluster.").
- Pod Disruption

  [Pod disruption](/docs/concepts/workloads/pods/disruptions/) is the process by which
  Pods on Nodes are terminated either voluntarily or involuntarily.

  [[+]](javascript:void(0))

  Voluntary disruptions are started intentionally by application owners or cluster
  administrators. Involuntary disruptions are unintentional and can be triggered by
  unavoidable issues like Nodes running out of [resources](/docs/reference/glossary/?all=true#term-infrastructure-resource "A defined amount of infrastructure available for consumption (CPU, memory, etc)."),
  or by accidental deletions.
- Pod Disruption Budget

  Also known as: PDB

  A [Pod Disruption Budget](/docs/concepts/workloads/pods/disruptions/) allows an
  application owner to create an object for a replicated application, that ensures
  a certain number or percentage of [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.")
  with an assigned label will not be voluntarily evicted at any point in time.

  [[+]](javascript:void(0))

  Involuntary disruptions cannot be prevented by PDBs; however they
  do count against the budget.
- Pod Lifecycle

  The sequence of states through which a Pod passes during its lifetime.

  [[+]](javascript:void(0))

  The [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/) is defined by the states or phases of a Pod. There are five possible Pod phases: Pending, Running, Succeeded, Failed, and Unknown. A high-level description of the Pod state is summarized in the [PodStatus](/docs/reference/generated/kubernetes-api/v1.36/#podstatus-v1-core) `phase` field.
- Pod Priority

  Pod Priority indicates the importance of a [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") relative to other Pods.

  [[+]](javascript:void(0))

  [Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority) gives the ability to set scheduling priority of a Pod to be higher and lower than other Pods — an important feature for production clusters workload.
- Pod Security Policy

  A former Kubernetes API that enforced security restrictions during [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") creation and updates.

  [[+]](javascript:void(0))

  PodSecurityPolicy was deprecated as of Kubernetes v1.21, and removed in v1.25.
  As an alternative, use [Pod Security Admission](/docs/concepts/security/pod-security-admission/) or a 3rd party admission plugin.
- PodGroup

  A PodGroup is a runtime object that represents a group of Pods scheduled
  together as a single unit. While the
  [Workload API](/docs/concepts/workloads/workload-api/) defines scheduling policy
  templates, PodGroups are the runtime counterparts that carry both the policy and
  the scheduling status for a specific instance of that group.

  [[+]](javascript:void(0))
- PodTemplate

  Also known as: pod template

  An API object that defines a template for creating [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.").
  The PodTemplate API is also embedded in API definitions for workload management, such as
  [Deployment](/docs/concepts/workloads/controllers/deployment/ "Manages a replicated application on your cluster.") or
  [StatefulSets](/docs/concepts/workloads/controllers/statefulset/ "A StatefulSet manages deployment and scaling of a set of Pods, with durable storage and persistent identifiers for each Pod.").

  [[+]](javascript:void(0))

  Pod templates allow you to define common metadata (such as labels, or a template for the name of a
  new Pod) as well as to specify a pod's desired state.
  [Workload management](/docs/concepts/workloads/controllers/) controllers use Pod templates
  (embedded into another object, such as a Deployment or StatefulSet)
  to define and manage one or more [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.").
  When there can be multiple Pods based on the same template, these are called
  [replicas](/docs/reference/glossary/?all=true#term-replica "Replicas are copies of pods, ensuring availability, scalability, and fault tolerance by maintaining identical instances.").
  Although you can create a PodTemplate object directly, you rarely need to do so.
- Preemption

  Preemption logic in Kubernetes helps a pending [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") to find a suitable [Node](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.") by evicting low priority Pods existing on that Node.

  [[+]](javascript:void(0))

  If a Pod cannot be scheduled, the scheduler tries to [preempt](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption) lower priority Pods to make scheduling of the pending Pod possible.
- PriorityClass

  A PriorityClass is a named class for the scheduling priority that should be assigned to a Pod
  in that class.

  [[+]](javascript:void(0))

  A [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#how-to-use-priority-and-preemption)
  is a non-namespaced object mapping a name to an integer priority, used for a Pod. The name is
  specified in the `metadata.name` field, and the priority value in the `value` field. Priorities range from
  -2147483648 to 1000000000 inclusive. Higher values indicate higher priority.
- Probe

  A check that the [kubelet](/docs/reference/command-line-tools-reference/kubelet "An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.") periodically performs against a container that is
  running in a pod, that will define container's state and health and informing container's lifecycle.

  [[+]](javascript:void(0))

  To learn more, read [container probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).
- Proxy

  In computing, a proxy is a server that acts as an intermediary for a remote
  service.

  [[+]](javascript:void(0))

  A client interacts with the proxy; the proxy copies the client's data to the
  actual server; the actual server replies to the proxy; the proxy sends the
  actual server's reply to the client.

  [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) is a
  network proxy that runs on each node in your cluster, implementing part of
  the Kubernetes [Service](/docs/concepts/services-networking/service/ "A way to expose an application running on a set of Pods as a network service.") concept.

  You can run kube-proxy as a plain userland proxy service. If your operating
  system supports it, you can instead run kube-proxy in a hybrid mode that
  achieves the same overall effect using less system resources.
- QoS Class

  QoS Class (Quality of Service Class) provides a way for Kubernetes to classify Pods within the cluster into several classes and make decisions about scheduling and eviction.

  [[+]](javascript:void(0))

  QoS Class of a Pod is set at creation time based on its [infrastructure resource](/docs/reference/glossary/?all=true#term-infrastructure-resource "A defined amount of infrastructure available for consumption (CPU, memory, etc).")
  requests and limits settings. QoS classes are used to make decisions about Pods scheduling and eviction.
  Kubernetes can assign one of the following QoS classes to a Pod: `Guaranteed`, `Burstable` or `BestEffort`.
- Quantity

  A whole-number representation of small or large numbers using [SI](https://en.wikipedia.org/wiki/International_System_of_Units) suffixes.

  [[+]](javascript:void(0))

  Quantities are representations of small or large numbers using a compact,
  whole-number notation with SI suffixes. Fractional numbers are represented
  using milli units, while large numbers can be represented using kilo,
  mega, or giga units.

  For instance, the number `1.5` is represented as `1500m`, while the number `1000`
  can be represented as `1k`, and `1000000` as `1M`. You can also specify
  [binary-notation](https://en.wikipedia.org/wiki/Binary_prefix) suffixes; the number 2048 can be written as `2Ki`.

  The accepted decimal (power-of-10) units are `m` (milli), `k` (kilo,
  intentionally lowercase), `M` (mega), `G` (giga), `T` (tera), `P` (peta),
  `E` (exa).

  The accepted binary (power-of-2) units are `Ki` (kibi), `Mi` (mebi), `Gi` (gibi),
  `Ti` (tebi), `Pi` (pebi), `Ei` (exbi).
- RBAC (Role-Based Access Control)

  Manages authorization decisions, allowing admins to dynamically configure access policies through the [Kubernetes API](/docs/concepts/overview/kubernetes-api/ "The application that serves Kubernetes functionality through a RESTful interface and stores the state of the cluster.").

  [[+]](javascript:void(0))

  RBAC utilizes four kinds of Kubernetes objects:

  Role
  :   Defines permission rules in a specific namespace.

  ClusterRole
  :   Defines permission rules cluster-wide.

  RoleBinding
  :   Grants the permissions defined in a role to a set of users in a specific namespace.

  ClusterRoleBinding
  :   Grants the permissions defined in a role to a set of users cluster-wide.

  For more information, see [RBAC](/docs/reference/access-authn-authz/rbac/).
- Replica

  A copy or duplicate of a [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") or
  a set of pods. Replicas ensure high availability, scalability, and fault tolerance
  by maintaining multiple identical instances of a pod.

  [[+]](javascript:void(0))

  Replicas are commonly used in Kubernetes to achieve the desired application state and reliability.
  They enable workload scaling and distribution across multiple nodes in a cluster.

  By defining the number of replicas in a Deployment or ReplicaSet, Kubernetes ensures that
  the specified number of instances are running, automatically adjusting the count as needed.

  Replica management allows for efficient load balancing, rolling updates, and
  self-healing capabilities in a Kubernetes cluster.
- ReplicaSet

  A ReplicaSet (aims to) maintain a set of replica Pods running at any given time.

  [[+]](javascript:void(0))

  Workload objects such as [Deployment](/docs/concepts/workloads/controllers/deployment/ "Manages a replicated application on your cluster.") make use of ReplicaSets
  to ensure that the configured number of [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") are
  running in your cluster, based on the spec of that ReplicaSet.
- ReplicationController

  A workload management [object](/docs/concepts/overview/working-with-objects/#kubernetes-objects "An entity in the Kubernetes system, representing part of the state of your cluster.")
  that manages a replicated application, ensuring that
  a specific number of instances of a [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") are running.

  [[+]](javascript:void(0))

  The control plane ensures that the defined number of Pods are running, even if some
  Pods fail, if you delete Pods manually, or if too many are started by mistake.

  #### Note:

  ReplicationController is deprecated. See
  [Deployment](/docs/concepts/workloads/controllers/deployment/ "Manages a replicated application on your cluster."), which is similar.
- Resource (infrastructure)

  Capabilities provided to one or more [nodes](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.") (CPU, memory, GPUs, etc), and made available for consumption by
  [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") running on those nodes.

  Kubernetes also uses the term *resource* to describe an [API resource](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server.").

  [[+]](javascript:void(0))

  Computers provide fundamental hardware facilities: processing power, storage memory, network, etc.
  These resources have finite capacity, measured in a unit applicable to that resource (number of CPUs, bytes of memory, etc).
  Kubernetes abstracts common [resources](/docs/concepts/configuration/manage-resources-containers/)
  for allocation to workloads and utilizes operating system primitives (for example, Linux [cgroups](/docs/reference/glossary/?all=true#term-cgroup "A group of Linux processes with optional resource isolation, accounting and limits.")) to manage consumption by [workloads](/docs/concepts/workloads/ "A workload is an application running on Kubernetes.")).

  You can also use [dynamic resource allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) to
  manage complex resource allocations automatically.
- ResourceClaim

  Describes the resources that a workload needs, such as
  [devices](/docs/reference/glossary/?all=true#term-device "Any resource that's directly or indirectly attached your cluster's nodes, like GPUs or circuit boards."). ResourceClaims are
  used in
  [dynamic resource allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
  to provide Pods with access to a specific resource.

  [[+]](javascript:void(0))

  ResourceClaims can be created by workload operators or generated by Kubernetes
  based on a
  [ResourceClaimTemplate](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates "Defines a template for Kubernetes to create ResourceClaims. Used to provide per-Pod or per-PodGroup access to separate, similar resources.").
- ResourceClaimTemplate

  Defines a template that Kubernetes uses to create
  [ResourceClaims](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates "Describes the resources that a workload needs, such as devices. ResourceClaims can request devices from DeviceClasses.").
  ResourceClaimTemplates are used in
  [dynamic resource allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
  to provide *per-Pod or per-[PodGroup](/docs/concepts/workloads/podgroup-api/ "A PodGroup represents a set of Pods with common scheduling policy and constraints.") access to separate, similar resources*.

  [[+]](javascript:void(0))

  When a ResourceClaimTemplate is referenced in a workload specification,
  Kubernetes automatically creates ResourceClaim objects based on the template.
  Each ResourceClaim is bound to a specific Pod or PodGroup. When the Pod
  terminates or the PodGroup is deleted, Kubernetes deletes the corresponding
  ResourceClaim. PodGroup ResourceClaimTemplates require the
  [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
  feature to be enabled.
- ResourceQuota

  Object that constrains aggregate resource
  consumption, per [Namespace](/docs/concepts/overview/working-with-objects/namespaces "An abstraction used by Kubernetes to support isolation of groups of resources within a single cluster.").

  [[+]](javascript:void(0))

  A ResourceQuota can either limit the quantity of [API resources](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server.")
  that can be created in a namespace by type, or it can set a limit on the total amount of
  [infrastructure resources](/docs/reference/glossary/?all=true#term-infrastructure-resource "A defined amount of infrastructure available for consumption (CPU, memory, etc).")
  that may be consumed on behalf of the namespace (and the objects within it).
- ResourceSlice

  Represents one or more infrastructure resources, such as
  [devices](/docs/reference/glossary/?all=true#term-device "Any resource that's directly or indirectly attached your cluster's nodes, like GPUs or circuit boards."), that are attached to
  nodes. Drivers create and manage ResourceSlices in the cluster. ResourceSlices
  are used for
  [dynamic resource allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).

  [[+]](javascript:void(0))

  When a [ResourceClaim](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates "Describes the resources that a workload needs, such as devices. ResourceClaims can request devices from DeviceClasses.") is
  created, Kubernetes uses ResourceSlices to find nodes that have access to
  resources that can satisfy the claim. Kubernetes allocates resources to the
  ResourceClaim and schedules the Pod onto a node that can access the resources.
- Reviewer

  A person who reviews code for quality and correctness on some part of the project.

  [[+]](javascript:void(0))

  Reviewers are knowledgeable about both the codebase and software engineering principles. Reviewer status is scoped to a part of the codebase.
- Secret

  Stores sensitive information, such as passwords, OAuth tokens, and SSH keys.

  [[+]](javascript:void(0))

  Secrets give you more control over how sensitive information is used and reduces
  the risk of accidental exposure. Secret values are encoded as base64 strings and
  are stored unencrypted by default, but can be configured to be
  [encrypted at rest](/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted).

  A [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") can reference the Secret in
  a variety of ways, such as in a volume mount or as an environment variable.
  Secrets are designed for confidential data and
  [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) are
  designed for non-confidential data.
- Security Context

  The `securityContext` field defines privilege and access control settings for
  a [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") or
  [container](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.").

  [[+]](javascript:void(0))

  In a `securityContext`, you can define: the user that processes run as,
  the group that processes run as, and privilege settings.
  You can also configure security policies (for example: SELinux, AppArmor or seccomp).

  The `PodSpec.securityContext` setting applies to all containers in a Pod.
- Selector

  Allows users to filter a list of [API resources](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server.")
  based on [labels](/docs/concepts/overview/working-with-objects/labels "Tags objects with identifying attributes that are meaningful and relevant to users.").

  [[+]](javascript:void(0))

  Selectors are applied when querying lists of resources to filter them by labels.
- Service

  A method for exposing a network application that is running as one or more
  [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") in your cluster.

  [[+]](javascript:void(0))

  The set of Pods targeted by a Service is (usually) determined by a
  [selector](/docs/concepts/overview/working-with-objects/labels/ "Allows users to filter a list of resources based on labels."). If more Pods are added or removed,
  the set of Pods matching the selector will change. The Service makes sure that network traffic
  can be directed to the current set of Pods for the workload.

  Kubernetes Services either use IP networking (IPv4, IPv6, or both), or reference an external name in
  the Domain Name System (DNS).

  The Service abstraction enables other mechanisms, such as Ingress and Gateway.
- Service Catalog

  A former extension API that enabled applications running in Kubernetes clusters to easily use external managed software offerings, such as a datastore service offered by a cloud provider.

  [[+]](javascript:void(0))

  It provided a way to list, provision, and bind with external [Managed Services](/docs/reference/glossary/?all=true#term-managed-service "A software offering maintained by a third-party provider.") without needing detailed knowledge about how those services would be created or managed.
- ServiceAccount

  Provides an identity for processes that run in a [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.").

  [[+]](javascript:void(0))

  When processes inside Pods access the cluster, they are authenticated by the API server as a particular service account, for example, `default`. When you create a Pod, if you do not specify a service account, it is automatically assigned the default service account in the same [Namespace](/docs/concepts/overview/working-with-objects/namespaces "An abstraction used by Kubernetes to support isolation of groups of resources within a single cluster.").
- Shuffle-sharding

  A technique for assigning requests to queues that provides better isolation than hashing modulo the number of queues.

  [[+]](javascript:void(0))

  We are often concerned with insulating different flows of requests
  from each other, so that a high-intensity flow does not crowd out low-intensity flows.
  A simple way to put requests into queues is to hash some
  characteristics of the request, modulo the number of queues, to get
  the index of the queue to use. The hash function uses as input
  characteristics of the request that align with flows. For example, in
  the Internet this is often the 5-tuple of source and destination
  address, protocol, and source and destination port.

  That simple hash-based scheme has the property that any high-intensity flow
  will crowd out all the low-intensity flows that hash to the same queue.
  Providing good insulation for a large number of flows requires a large
  number of queues, which is problematic. Shuffle-sharding is a more
  nimble technique that can do a better job of insulating the low-intensity
  flows from the high-intensity flows. The terminology of shuffle-sharding uses
  the metaphor of dealing a hand from a deck of cards; each queue is a
  metaphorical card. The shuffle-sharding technique starts with hashing
  the flow-identifying characteristics of the request, to produce a hash
  value with dozens or more of bits. Then the hash value is used as a
  source of entropy to shuffle the deck and deal a hand of cards
  (queues). All the dealt queues are examined, and the request is put
  into one of the examined queues with the shortest length. With a
  modest hand size, it does not cost much to examine all the dealt cards
  and a given low-intensity flow has a good chance to dodge the effects of a
  given high-intensity flow. With a large hand size it is expensive to examine
  the dealt queues and more difficult for the low-intensity flows to dodge the
  collective effects of a set of high-intensity flows. Thus, the hand size
  should be chosen judiciously.
- Sidecar Container

  One or more [containers](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.") that are typically started before any app containers run.

  [[+]](javascript:void(0))

  Sidecar containers are like regular app containers, but with a different purpose: the sidecar provides a Pod-local service to the main app container.
  Unlike [init containers](/docs/concepts/workloads/pods/init-containers/ "One or more initialization containers that must run to completion before any app containers run."), sidecar containers
  continue running after Pod startup.

  Read [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) for more information.
- SIG (special interest group)

  [Community members](/docs/reference/glossary/?all=true#term-member "A continuously active contributor in the K8s community.") who collectively manage an ongoing piece or aspect of the larger Kubernetes open source project.

  [[+]](javascript:void(0))

  Members within a SIG have a shared interest in advancing a specific area, such as architecture, API machinery, or documentation.
  SIGs must follow the SIG [governance guidelines](https://github.com/kubernetes/community/blob/main/committee-steering/governance/sig-governance.md), but can have their own contribution policy and channels of communication.

  For more information, see the [kubernetes/community](https://github.com/kubernetes/community) repo and the current list of [SIGs and Working Groups](https://github.com/kubernetes/community/blob/main/sig-list.md).
- Spec

  Defines how each object, like Pods or Services, should be configured and its desired state.

  [[+]](javascript:void(0))

  Almost every Kubernetes object includes two nested object fields that govern the object's configuration: the object spec and the object status. For objects that have a spec, you have to set this when you create the object, providing a description of the characteristics you want the [resource](/docs/reference/using-api/api-concepts/#standard-api-terminology "A Kubernetes entity, representing an endpoint on the Kubernetes API server.") to have: its desired state.

  It varies for different objects like Pods, StatefulSets, and Services, detailing settings such as containers, volumes, replicas, ports,
  and other specifications unique to each object type. This field encapsulates what state Kubernetes should maintain for the defined
  object.
- StatefulSet

  Manages the deployment and scaling of a set of [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster."), *and provides guarantees about the ordering and uniqueness* of these Pods.

  [[+]](javascript:void(0))

  Like a [Deployment](/docs/concepts/workloads/controllers/deployment/ "Manages a replicated application on your cluster."), a StatefulSet manages Pods that are based on an identical container spec. Unlike a Deployment, a StatefulSet maintains a sticky identity for each of its Pods. These pods are created from the same spec, but are not interchangeable: each has a persistent identifier that it maintains across any rescheduling.

  If you want to use storage volumes to provide persistence for your workload, you can use a StatefulSet as part of the solution. Although individual Pods in a StatefulSet are susceptible to failure, the persistent Pod identifiers make it easier to match existing volumes to the new Pods that replace any that have failed.
- Static Pod

  A [pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") managed directly by the [kubelet](/docs/reference/command-line-tools-reference/kubelet "An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.")
  daemon on a specific node,

  [[+]](javascript:void(0))

  without the API server observing it.

  Static Pods do not support [ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/ "A type of container type that you can temporarily run inside a Pod").
- Storage Class

  A StorageClass provides a way for administrators to describe different available storage types.

  [[+]](javascript:void(0))

  StorageClasses can map to quality-of-service levels, backup policies, or to arbitrary policies determined by cluster administrators. Each StorageClass contains the fields `provisioner`, `parameters`, and `reclaimPolicy`, which are used when a [Persistent Volume](/docs/concepts/storage/persistent-volumes/ "API object that represents a piece of storage in the cluster.") belonging to the class needs to be dynamically provisioned. Users can request a particular class using the name of a StorageClass object.
- Subject Alternative Name

  Subject Alternative Name is an [X.509 certificate](/docs/tasks/tls/managing-tls-in-a-cluster/ "A cryptographically secure file used to validate access to the Kubernetes cluster.")
  extension that allows identities to be bound to the subject of the certificate.

  [[+]](javascript:void(0))

  The [standard](https://datatracker.ietf.org/doc/html/rfc4985) defines identities represented
  as an email address, a DNS name, an IP address or a Uniform Resource Identifier (URI).
- sysctl

  `sysctl` is a semi-standardized interface for reading or changing the
  attributes of the running Unix kernel.

  [[+]](javascript:void(0))

  On Unix-like systems, `sysctl` is both the name of the tool that administrators
  use to view and modify these settings, and also the system call that the tool
  uses.

  [Container](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.") runtimes and
  network plugins may rely on `sysctl` values being set a certain way.
- Taint

  A core object consisting of three required properties: key, value, and effect. Taints prevent the scheduling of [Pods](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") on [nodes](/docs/concepts/architecture/nodes/ "A node is a worker machine in Kubernetes.") or node groups.

  [[+]](javascript:void(0))

  Taints and [tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/ "A core object consisting of three required properties: key, value, and effect. Tolerations enable the scheduling of pods on nodes or node groups that have a matching taint.") work together to ensure that pods are not scheduled onto inappropriate nodes. One or more taints are applied to a node. A node should only schedule a Pod with the matching tolerations for the configured taints.
- Toleration

  A core object consisting of three required properties: key, value, and effect. Tolerations enable the scheduling of pods on nodes or node groups that have matching [taints](/docs/concepts/scheduling-eviction/taint-and-toleration/ "A core object consisting of three required properties: key, value, and effect. Taints prevent the scheduling of pods on nodes or node groups.").

  [[+]](javascript:void(0))

  Tolerations and [taints](/docs/concepts/scheduling-eviction/taint-and-toleration/ "A core object consisting of three required properties: key, value, and effect. Taints prevent the scheduling of pods on nodes or node groups.") work together to ensure that pods are not scheduled onto inappropriate nodes. One or more tolerations are applied to a [pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster."). A toleration indicates that the [pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.") is allowed (but not required) to be scheduled on nodes or node groups with matching [taints](/docs/concepts/scheduling-eviction/taint-and-toleration/ "A core object consisting of three required properties: key, value, and effect. Taints prevent the scheduling of pods on nodes or node groups.").
- UID

  A Kubernetes systems-generated string to uniquely identify objects.

  [[+]](javascript:void(0))

  Every object created over the whole lifetime of a Kubernetes cluster has a distinct UID. It is intended to distinguish between historical occurrences of similar entities.
- Upstream (disambiguation)

  May refer to: core Kubernetes or the source repo from which a repo was forked.

  [[+]](javascript:void(0))

  - In the **Kubernetes Community**: Conversations often use *upstream* to mean the core Kubernetes codebase, which the general ecosystem, other code, or third-party tools rely upon. For example, [community members](#term-member) may suggest that a feature is moved upstream so that it is in the core codebase instead of in a plugin or third-party tool.
  - In **GitHub** or **git**: The convention is to refer to a source repo as *upstream*, whereas the forked repo is considered *downstream*.
- user namespace

  A kernel feature to emulate root. Used for "rootless containers".

  [[+]](javascript:void(0))

  User namespaces are a Linux kernel feature that allows a non-root user to
  emulate superuser ("root") privileges,
  for example in order to run containers without being a superuser outside the container.

  User namespace is effective for mitigating damage of potential container break-out attacks.

  In the context of user namespaces, the namespace is a Linux kernel feature, and not a
  [namespace](/docs/concepts/overview/working-with-objects/namespaces "An abstraction used by Kubernetes to support isolation of groups of resources within a single cluster.") in the Kubernetes sense
  of the term.
- Volume

  A directory containing data, accessible to the [containers](/docs/concepts/containers/ "A lightweight and portable executable image that contains software and all of its dependencies.") in a [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.").

  [[+]](javascript:void(0))

  A Kubernetes volume lives as long as the Pod that encloses it. Consequently, a volume outlives any containers that run within the Pod, and data in the volume is preserved across container restarts.

  See [storage](/docs/concepts/storage/) for more information.
- Volume Plugin

  A Volume Plugin enables integration of storage within a [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster.").

  [[+]](javascript:void(0))

  A Volume Plugin lets you attach and mount storage volumes for use by a [Pod](/docs/concepts/workloads/pods/ "A Pod represents a set of running containers in your cluster."). Volume plugins can be *in tree* or *out of tree*. *In tree* plugins are part of the Kubernetes code repository and follow its release cycle. *Out of tree* plugins are developed independently.
- Watch

  A verb that is used to track changes to an object in Kubernetes as a stream.
  It is used for the efficient detection of changes.

  [[+]](javascript:void(0))

  A verb that is used to track changes to an object in Kubernetes as a stream. Watches allow
  efficient detection of changes; for example, a
  [controller](/docs/concepts/architecture/controller/ "A control loop that watches the shared state of the cluster through the apiserver and makes changes attempting to move the current state towards the desired state.") that needs to know whenever a
  ConfigMap has changed can use a watch rather than polling.

  See [Efficient Detection of Changes in API Concepts](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes) for more information.
- WG (working group)

  Facilitates the discussion and/or implementation of a short-lived, narrow, or decoupled project for a committee, [SIG](https://github.com/kubernetes/community/blob/main/sig-list.md#special-interest-groups "Community members who collectively manage an ongoing piece or aspect of the larger Kubernetes open source project."), or cross-SIG effort.

  [[+]](javascript:void(0))

  Working groups are a way of organizing people to accomplish a discrete task.

  For more information, see the [kubernetes/community](https://github.com/kubernetes/community) repo and the current list of [SIGs and working groups](https://github.com/kubernetes/community/blob/main/sig-list.md).
- Workload

  A workload is an application running on Kubernetes.

  [[+]](javascript:void(0))

  Various core objects that represent different types or parts of a workload
  include the DaemonSet, Deployment, Job, ReplicaSet, and StatefulSet objects.

  For example, a workload that has a web server and a database might run the
  database in one [StatefulSet](/docs/concepts/workloads/controllers/statefulset/ "A StatefulSet manages deployment and scaling of a set of Pods, with durable storage and persistent identifiers for each Pod.") and the web server
  in a [Deployment](/docs/concepts/workloads/controllers/deployment/ "Manages a replicated application on your cluster.").
