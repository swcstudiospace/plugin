# kubectl reference | Kubernetes

Source: https://kubernetes.io/docs/reference/kubectl/generated

# kubectl reference

Expand all
Collapse all

[`kubectl annotate`](/docs/reference/kubectl/generated/kubectl_annotate/) Update the annotations on a resource

[View full reference →](/docs/reference/kubectl/generated/kubectl_annotate/)

[`kubectl api-resources`](/docs/reference/kubectl/generated/kubectl_api-resources/) Print the supported API resources on the server

[View full reference →](/docs/reference/kubectl/generated/kubectl_api-resources/)

[`kubectl api-versions`](/docs/reference/kubectl/generated/kubectl_api-versions/) Print the supported API versions on the server, in the form of "group/version"

[View full reference →](/docs/reference/kubectl/generated/kubectl_api-versions/)

[`kubectl apply`](/docs/reference/kubectl/generated/kubectl_apply/) Apply a configuration to a resource by file name or stdin

- [`kubectl apply edit-last-applied`](/docs/reference/kubectl/generated/kubectl_apply/kubectl_apply_edit-last-applied/) — Edit latest last-applied-configuration annotations of a resource/object
- [`kubectl apply set-last-applied`](/docs/reference/kubectl/generated/kubectl_apply/kubectl_apply_set-last-applied/) — Set the last-applied-configuration annotation on a live object to match the contents of a file
- [`kubectl apply view-last-applied`](/docs/reference/kubectl/generated/kubectl_apply/kubectl_apply_view-last-applied/) — View the latest last-applied-configuration annotations of a resource/object

[View full reference →](/docs/reference/kubectl/generated/kubectl_apply/)

[`kubectl attach`](/docs/reference/kubectl/generated/kubectl_attach/) Attach to a running container

[View full reference →](/docs/reference/kubectl/generated/kubectl_attach/)

[`kubectl auth`](/docs/reference/kubectl/generated/kubectl_auth/) Inspect authorization

- [`kubectl auth can-i`](/docs/reference/kubectl/generated/kubectl_auth/kubectl_auth_can-i/) — Check whether an action is allowed
- [`kubectl auth reconcile`](/docs/reference/kubectl/generated/kubectl_auth/kubectl_auth_reconcile/) — Reconciles rules for RBAC role, role binding, cluster role, and cluster role binding objects
- [`kubectl auth whoami`](/docs/reference/kubectl/generated/kubectl_auth/kubectl_auth_whoami/) — Experimental: Check self subject attributes

[View full reference →](/docs/reference/kubectl/generated/kubectl_auth/)

[`kubectl autoscale`](/docs/reference/kubectl/generated/kubectl_autoscale/) Auto-scale a deployment, replica set, stateful set, or replication controller

[View full reference →](/docs/reference/kubectl/generated/kubectl_autoscale/)

[`kubectl certificate`](/docs/reference/kubectl/generated/kubectl_certificate/) Modify certificate resources

- [`kubectl certificate approve`](/docs/reference/kubectl/generated/kubectl_certificate/kubectl_certificate_approve/) — Approve a certificate signing request
- [`kubectl certificate deny`](/docs/reference/kubectl/generated/kubectl_certificate/kubectl_certificate_deny/) — Deny a certificate signing request

[View full reference →](/docs/reference/kubectl/generated/kubectl_certificate/)

[`kubectl cluster-info`](/docs/reference/kubectl/generated/kubectl_cluster-info/) Display cluster information

- [`kubectl cluster-info dump`](/docs/reference/kubectl/generated/kubectl_cluster-info/kubectl_cluster-info_dump/) — Dump relevant information for debugging and diagnosis

[View full reference →](/docs/reference/kubectl/generated/kubectl_cluster-info/)

[`kubectl completion`](/docs/reference/kubectl/generated/kubectl_completion/) Output shell completion code for the specified shell (bash, zsh, fish, or powershell)

[View full reference →](/docs/reference/kubectl/generated/kubectl_completion/)

[`kubectl config`](/docs/reference/kubectl/generated/kubectl_config/) Modify kubeconfig files

- [`kubectl config current-context`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_current-context/) — Display the current-context
- [`kubectl config delete-cluster`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_delete-cluster/) — Delete the specified cluster from the kubeconfig
- [`kubectl config delete-context`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_delete-context/) — Delete the specified context from the kubeconfig
- [`kubectl config delete-user`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_delete-user/) — Delete the specified user from the kubeconfig
- [`kubectl config get-clusters`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_get-clusters/) — Display clusters defined in the kubeconfig
- [`kubectl config get-contexts`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_get-contexts/) — Describe one or many contexts
- [`kubectl config get-users`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_get-users/) — Display users defined in the kubeconfig
- [`kubectl config rename-context`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_rename-context/) — Rename a context from the kubeconfig file
- [`kubectl config set`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_set/) — Set an individual value in a kubeconfig file
- [`kubectl config set-cluster`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_set-cluster/) — Set a cluster entry in kubeconfig
- [`kubectl config set-context`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_set-context/) — Set a context entry in kubeconfig
- [`kubectl config set-credentials`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_set-credentials/) — Set a user entry in kubeconfig
- [`kubectl config unset`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_unset/) — Unset an individual value in a kubeconfig file
- [`kubectl config use-context`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_use-context/) — Set the current-context in a kubeconfig file
- [`kubectl config view`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_view/) — Display merged kubeconfig settings or a specified kubeconfig file

[View full reference →](/docs/reference/kubectl/generated/kubectl_config/)

[`kubectl cordon`](/docs/reference/kubectl/generated/kubectl_cordon/) Mark node as unschedulable

[View full reference →](/docs/reference/kubectl/generated/kubectl_cordon/)

[`kubectl cp`](/docs/reference/kubectl/generated/kubectl_cp/) Copy files and directories to and from containers

[View full reference →](/docs/reference/kubectl/generated/kubectl_cp/)

[`kubectl create`](/docs/reference/kubectl/generated/kubectl_create/) Create a resource from a file or from stdin

- [`kubectl create clusterrole`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_clusterrole/) — Create a cluster role
- [`kubectl create clusterrolebinding`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_clusterrolebinding/) — Create a cluster role binding for a particular cluster role
- [`kubectl create configmap`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_configmap/) — Create a config map from a local file, directory or literal value
- [`kubectl create cronjob`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_cronjob/) — Create a cron job with the specified name
- [`kubectl create deployment`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_deployment/) — Create a deployment with the specified name
- [`kubectl create ingress`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_ingress/) — Create an ingress with the specified name
- [`kubectl create job`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_job/) — Create a job with the specified name
- [`kubectl create namespace`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_namespace/) — Create a namespace with the specified name
- [`kubectl create poddisruptionbudget`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_poddisruptionbudget/) — Create a pod disruption budget with the specified name
- [`kubectl create priorityclass`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_priorityclass/) — Create a priority class with the specified name
- [`kubectl create quota`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_quota/) — Create a quota with the specified name
- [`kubectl create role`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_role/) — Create a role with single rule
- [`kubectl create rolebinding`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_rolebinding/) — Create a role binding for a particular role or cluster role
- [`kubectl create secret`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_secret/) — Create a secret using a specified subcommand
- [`kubectl create secret docker-registry`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_secret_docker-registry/) — Create a secret for use with a Docker registry
- [`kubectl create secret generic`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_secret_generic/) — Create a secret from a local file, directory, or literal value
- [`kubectl create secret tls`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_secret_tls/) — Create a TLS secret
- [`kubectl create service`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_service/) — Create a service using a specified subcommand
- [`kubectl create service clusterip`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_service_clusterip/) — Create a ClusterIP service
- [`kubectl create service externalname`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_service_externalname/) — Create an ExternalName service
- [`kubectl create service loadbalancer`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_service_loadbalancer/) — Create a LoadBalancer service
- [`kubectl create service nodeport`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_service_nodeport/) — Create a NodePort service
- [`kubectl create serviceaccount`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_serviceaccount/) — Create a service account with the specified name
- [`kubectl create token`](/docs/reference/kubectl/generated/kubectl_create/kubectl_create_token/) — Request a service account token

[View full reference →](/docs/reference/kubectl/generated/kubectl_create/)

[`kubectl debug`](/docs/reference/kubectl/generated/kubectl_debug/) Create debugging sessions for troubleshooting workloads and nodes

[View full reference →](/docs/reference/kubectl/generated/kubectl_debug/)

[`kubectl delete`](/docs/reference/kubectl/generated/kubectl_delete/) Delete resources by file names, stdin, resources and names, or by resources and label selector

[View full reference →](/docs/reference/kubectl/generated/kubectl_delete/)

[`kubectl describe`](/docs/reference/kubectl/generated/kubectl_describe/) Show details of a specific resource or group of resources

[View full reference →](/docs/reference/kubectl/generated/kubectl_describe/)

[`kubectl diff`](/docs/reference/kubectl/generated/kubectl_diff/) Diff the live version against a would-be applied version

[View full reference →](/docs/reference/kubectl/generated/kubectl_diff/)

[`kubectl drain`](/docs/reference/kubectl/generated/kubectl_drain/) Drain node in preparation for maintenance

[View full reference →](/docs/reference/kubectl/generated/kubectl_drain/)

[`kubectl edit`](/docs/reference/kubectl/generated/kubectl_edit/) Edit a resource on the server

[View full reference →](/docs/reference/kubectl/generated/kubectl_edit/)

[`kubectl events`](/docs/reference/kubectl/generated/kubectl_events/) List events

[View full reference →](/docs/reference/kubectl/generated/kubectl_events/)

[`kubectl exec`](/docs/reference/kubectl/generated/kubectl_exec/) Execute a command in a container

[View full reference →](/docs/reference/kubectl/generated/kubectl_exec/)

[`kubectl explain`](/docs/reference/kubectl/generated/kubectl_explain/) Get documentation for a resource

[View full reference →](/docs/reference/kubectl/generated/kubectl_explain/)

[`kubectl expose`](/docs/reference/kubectl/generated/kubectl_expose/) Take a replication controller, service, deployment or pod and expose it as a new Kubernetes service

[View full reference →](/docs/reference/kubectl/generated/kubectl_expose/)

[`kubectl get`](/docs/reference/kubectl/generated/kubectl_get/) Display one or many resources

[View full reference →](/docs/reference/kubectl/generated/kubectl_get/)

[`kubectl kuberc`](/docs/reference/kubectl/generated/kubectl_kuberc/) Manage kuberc configuration files

- [`kubectl kuberc set`](/docs/reference/kubectl/generated/kubectl_kuberc/kubectl_kuberc_set/) — Set values in the kuberc configuration
- [`kubectl kuberc view`](/docs/reference/kubectl/generated/kubectl_kuberc/kubectl_kuberc_view/) — Display the current kuberc configuration

[View full reference →](/docs/reference/kubectl/generated/kubectl_kuberc/)

[`kubectl kustomize`](/docs/reference/kubectl/generated/kubectl_kustomize/) Build a kustomization target from a directory or URL

[View full reference →](/docs/reference/kubectl/generated/kubectl_kustomize/)

[`kubectl label`](/docs/reference/kubectl/generated/kubectl_label/) Update the labels on a resource

[View full reference →](/docs/reference/kubectl/generated/kubectl_label/)

[`kubectl logs`](/docs/reference/kubectl/generated/kubectl_logs/) Print the logs for a container in a pod

[View full reference →](/docs/reference/kubectl/generated/kubectl_logs/)

[`kubectl options`](/docs/reference/kubectl/generated/kubectl_options/) Print the list of flags inherited by all commands

[View full reference →](/docs/reference/kubectl/generated/kubectl_options/)

[`kubectl patch`](/docs/reference/kubectl/generated/kubectl_patch/) Update fields of a resource

[View full reference →](/docs/reference/kubectl/generated/kubectl_patch/)

[`kubectl plugin`](/docs/reference/kubectl/generated/kubectl_plugin/) Provides utilities for interacting with plugins

- [`kubectl plugin list`](/docs/reference/kubectl/generated/kubectl_plugin/kubectl_plugin_list/) — List all visible plugin executables on a user's PATH

[View full reference →](/docs/reference/kubectl/generated/kubectl_plugin/)

[`kubectl port-forward`](/docs/reference/kubectl/generated/kubectl_port-forward/) Forward one or more local ports to a pod

[View full reference →](/docs/reference/kubectl/generated/kubectl_port-forward/)

[`kubectl proxy`](/docs/reference/kubectl/generated/kubectl_proxy/) Run a proxy to the Kubernetes API server

[View full reference →](/docs/reference/kubectl/generated/kubectl_proxy/)

[`kubectl replace`](/docs/reference/kubectl/generated/kubectl_replace/) Replace a resource by file name or stdin

[View full reference →](/docs/reference/kubectl/generated/kubectl_replace/)

[`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) Manage the rollout of a resource

- [`kubectl rollout history`](/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_history/) — View rollout history
- [`kubectl rollout pause`](/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_pause/) — Mark the provided resource as paused
- [`kubectl rollout restart`](/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_restart/) — Restart a resource
- [`kubectl rollout resume`](/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_resume/) — Resume a paused resource
- [`kubectl rollout status`](/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_status/) — Show the status of the rollout
- [`kubectl rollout undo`](/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_undo/) — Undo a previous rollout

[View full reference →](/docs/reference/kubectl/generated/kubectl_rollout/)

[`kubectl run`](/docs/reference/kubectl/generated/kubectl_run/) Run a particular image on the cluster

[View full reference →](/docs/reference/kubectl/generated/kubectl_run/)

[`kubectl scale`](/docs/reference/kubectl/generated/kubectl_scale/) Set a new size for a deployment, replica set, or replication controller

[View full reference →](/docs/reference/kubectl/generated/kubectl_scale/)

[`kubectl set`](/docs/reference/kubectl/generated/kubectl_set/) Set specific features on objects

- [`kubectl set env`](/docs/reference/kubectl/generated/kubectl_set/kubectl_set_env/) — Update environment variables on a pod template
- [`kubectl set image`](/docs/reference/kubectl/generated/kubectl_set/kubectl_set_image/) — Update the image of a pod template
- [`kubectl set resources`](/docs/reference/kubectl/generated/kubectl_set/kubectl_set_resources/) — Update resource requests/limits on objects with pod templates
- [`kubectl set selector`](/docs/reference/kubectl/generated/kubectl_set/kubectl_set_selector/) — Set the selector on a resource
- [`kubectl set serviceaccount`](/docs/reference/kubectl/generated/kubectl_set/kubectl_set_serviceaccount/) — Update the service account of a resource
- [`kubectl set subject`](/docs/reference/kubectl/generated/kubectl_set/kubectl_set_subject/) — Update the user, group, or service account in a role binding or cluster role binding

[View full reference →](/docs/reference/kubectl/generated/kubectl_set/)

[`kubectl taint`](/docs/reference/kubectl/generated/kubectl_taint/) Update the taints on one or more nodes

[View full reference →](/docs/reference/kubectl/generated/kubectl_taint/)

[`kubectl top`](/docs/reference/kubectl/generated/kubectl_top/) Display resource (CPU/memory) usage

- [`kubectl top node`](/docs/reference/kubectl/generated/kubectl_top/kubectl_top_node/) — Display resource (CPU/memory) usage of nodes
- [`kubectl top pod`](/docs/reference/kubectl/generated/kubectl_top/kubectl_top_pod/) — Display resource (CPU/memory) usage of pods

[View full reference →](/docs/reference/kubectl/generated/kubectl_top/)

[`kubectl uncordon`](/docs/reference/kubectl/generated/kubectl_uncordon/) Mark node as schedulable

[View full reference →](/docs/reference/kubectl/generated/kubectl_uncordon/)

[`kubectl version`](/docs/reference/kubectl/generated/kubectl_version/) Print the client and server version information

[View full reference →](/docs/reference/kubectl/generated/kubectl_version/)

[`kubectl wait`](/docs/reference/kubectl/generated/kubectl_wait/) Wait for a specific condition on one or many resources

[View full reference →](/docs/reference/kubectl/generated/kubectl_wait/)

Last modified March 22, 2026 at 3:35 PM PST: [Switch to Hugo page discovery and add description field to kubectl command front matter (83100f9a0d)](https://github.com/kubernetes/website/commit/83100f9a0db1c9a1954de0d9552c4733e73029ae)
