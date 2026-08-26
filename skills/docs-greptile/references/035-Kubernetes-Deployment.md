# Kubernetes Deployment

Source: https://www.greptile.com/docs/kubernetes-new

Kubernetes deployment for teams with **100+ developers** or requiring high availability and horizontal scaling.

The Helm chart and deployment docs live in the [akupara repo](https://github.com/greptileai/akupara/tree/main/deploy/kubernetes) in `/deploy/kubernetes`.

## [​](#how-it-fits-together) How it fits together

The Greptile chart deploys **application workloads only**:

- **Services**: web, auth, api, chunker, summarizer, worker, webhook, jobs, llmproxy
- **Optional**: jackson (for SAML SSO)
- **Bundled by default**: PostgreSQL and PgBouncer (transaction pooling)

Two things live **outside** the Greptile chart and must be in place first:

- **Ingress controller**: the chart creates `Ingress` resources but does not install a controller. You install `ingress-nginx` yourself, once per cluster.
- **Hatchet**: Greptile’s workflow orchestration runs as a separate Helm release, connected through the `hatchet.*` values and a `HATCHET_CLIENT_TOKEN`.

## [​](#prerequisites) Prerequisites

**Cluster:**

- Kubernetes 1.21+ (1.25+ recommended)
- `kubectl` configured
- `helm` 3.0+

**From Greptile:**

- Container registry credentials and an image tag
- License (contact [sales@greptile.com](mailto:sales@greptile.com))

**External:**

- LLM provider API keys (see [requirements](/docs/deployment-options#llm-provider))
- GitHub App or GitLab OAuth configured

The `worker` deployment runs **privileged** with `SYS_ADMIN` and a `/sys/fs/cgroup` host mount so review sandboxing works. Clusters with restrictive Pod Security Standards must allow this. Plan storage too: the bundled Postgres PVC (`postgres.primary.persistence.size`, default `40Gi`) and the shared workdir PVC (`storage.sharedWorkdir.size`, default `1Ti`) need real backing storage.

## [​](#setup) Setup

1

Clone the repository

```
git clone https://github.com/greptileai/akupara.git
cd akupara/deploy/kubernetes
```

2

Install the ingress controller (required, once per cluster)

```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm upgrade --install nginx-ingress ingress-nginx/ingress-nginx \
  -n ingress-nginx --create-namespace
```

Verify an `nginx` ingress class and a controller service exist:

```
kubectl get ingressclass
kubectl get pods,svc -n ingress-nginx
```

3

Install Hatchet

Hatchet is the workflow orchestration system. Install it before bootstrapping Greptile so the next step can mint a client token automatically:

```
helm repo add hatchet https://hatchet-dev.github.io/hatchet-charts
helm upgrade --install hatchet-stack hatchet/hatchet-stack \
  -f ./charts/profiles/hatchet-values.yaml
```

Verify Hatchet is healthy before continuing:

```
kubectl get pods
kubectl get svc hatchet-stack-api hatchet-stack-engine
```

Change the default Hatchet admin credentials before exposing the Hatchet UI/API.

4

Create the registry secret

Greptile’s images are pulled from a private registry. Create the pull secret referenced by `global.imagePullSecrets` (defaults to `regcred`):

```
kubectl create secret docker-registry regcred \
  --docker-server=<REGISTRY_FROM_GREPTILE> \
  --docker-username=<USERNAME_FROM_GREPTILE> \
  --docker-password=<TOKEN_FROM_GREPTILE> \
  --docker-email=<YOUR_EMAIL>
```

5

Validate the chart

```
./scripts/validate.sh
```

This runs `helm dependency update`, `helm lint`, and `helm template` against the bundled profiles to catch problems before you deploy.

6

Bootstrap your values file

```
./scripts/init-values.sh
```

This creates `./charts/profiles/values.user.yaml` from the example and auto-generates the secrets you’d otherwise set by hand:

- `JWT_SECRET`
- `TOKEN_ENCRYPTION_KEY` (32 characters)
- `LITELLM_MASTER_KEY`
- `HATCHET_CLIENT_TOKEN` (pulled from the running `hatchet-stack` release)

Hatchet must already be deployed and reachable for automatic `HATCHET_CLIENT_TOKEN` generation to succeed.

7

Configure values.user.yaml

Open `./charts/profiles/values.user.yaml` and set the values the bootstrap script can’t infer:

```
global:
  registry: "<REGISTRY_FROM_GREPTILE>"
  tag: "<IMAGE_TAG>"
  imagePullSecrets:
    - name: regcred

network:
  appUrl: "https://greptile.yourcompany.com"
  webhookUrl: "https://greptile.yourcompany.com/webhook"

github:
  appId: "123456"
  appUrl: "https://github.com/apps/your-greptile-app"

secrets:
  mode: native
  native:
    # Auto-filled by init-values.sh; only fill the provider/integration keys.
    ANTHROPIC_KEY: "sk-ant-..."
    GITHUB_WEBHOOK_SECRET: "your-webhook-secret"
    WEBHOOK_SECRET: "your-webhook-secret"
    GITHUB_PRIVATE_KEY: "-----BEGIN RSA PRIVATE KEY-----..."
    GITHUB_CLIENT_ID: "Iv1.xxx"
    GITHUB_CLIENT_SECRET: "xxx"

ingress:
  enabled: true
  className: nginx
```

See [`values.user.example.yaml`](https://github.com/greptileai/akupara/blob/main/deploy/kubernetes/charts/profiles/values.user.example.yaml) for the annotated template and [`values.yaml`](https://github.com/greptileai/akupara/blob/main/deploy/kubernetes/charts/greptile/values.yaml) for every available key. See [Configuration](#configuration) below for the schema.

8

Deploy Greptile

```
helm dependency update ./charts/greptile
helm upgrade --install greptile ./charts/greptile -f ./charts/profiles/values.user.yaml
```

9

Verify the rollout

```
kubectl get pods -l app.kubernetes.io/instance=greptile
kubectl get svc
kubectl get ingress
kubectl logs deploy/greptile-web
```

The minimum healthy set for a bundled-database install:`greptile-postgres` · `greptile-pgbouncer` · `greptile-api` · `greptile-auth` · `greptile-web` · `greptile-webhook` · `greptile-worker` · `greptile-summarizer` · `greptile-chunker` · `greptile-jobs` · `greptile-llmproxy`Reach the web UI through your ingress host (`network.appUrl`), or port-forward for a quick check:

```
kubectl port-forward svc/greptile-web 3000:3000
```

## [​](#configuration) Configuration

`values.user.yaml` overrides the chart defaults in [`charts/greptile/values.yaml`](https://github.com/greptileai/akupara/blob/main/deploy/kubernetes/charts/greptile/values.yaml). The top-level keys:

| Key | Purpose |
| --- | --- |
| `global` | Image registry/tag, pull secrets, pod security context, scheduling (`nodeSelector`/`tolerations`/`affinity`) |
| `network` | `appUrl` and `webhookUrl` — the public URLs for the app and webhook receiver |
| `hatchet` | `apiUrl`, `grpcUrl`, `tlsStrategy` for the external Hatchet release |
| `github` | GitHub App / GitHub Enterprise IDs and URLs |
| `secrets` | `mode` (`native` or `external`) plus the secret values themselves |
| `postgres` | Bundled PostgreSQL (enabled by default) |
| `externalDatabase` | Connection details when using managed Postgres instead |
| `pgbouncer` | Connection pooling (enabled by default, transaction mode) |
| `ingress` | Ingress class and per-service (`web`, `webhook`) host/path/TLS |
| `components` | Per-service `replicas`, image repo/tag, ports, and env |
| `storage` | Shared workdir PVC (`sharedWorkdir`) |
| `email`, `integrations`, `saml`, `llm` | Optional features and LLM base URLs |

### [​](#bundled-vs-managed-database) Bundled vs. managed database

Postgres is bundled and enabled by default. To use a managed database (e.g. RDS, Cloud SQL) instead:

```
postgres:
  enabled: false
externalDatabase:
  host: "your-db-host"
  port: 5432
  user: "greptile"
  password: "..."
  database: "greptile"
  vectorDatabase: "vector"
  sslDisable: "false"
```

The database must have the `pgvector` extension available (`CREATE EXTENSION IF NOT EXISTS vector;`).

### [​](#secret-modes) Secret modes

- **`native`** (default) — values live in `secrets.native.*`. Best filled by `init-values.sh`.
- **`external`** — set `secrets.mode: external` and configure `secrets.external.secretStoreRef` / `secrets.external.data`. The chart renders an `ExternalSecret` (via the [External Secrets Operator](https://external-secrets.io)) targeting the secret all workloads consume.

## [​](#aws-eks-with-terraform) AWS (EKS) with Terraform

If you don’t already have a cluster, the akupara repo ships a Terraform stack that provisions a full EKS environment and installs Greptile for you. It’s consumed from a customer-owned **root module** — start from the copy/paste example at [`terraform/examples/aws-eks-module`](https://github.com/greptileai/akupara/tree/main/terraform/examples/aws-eks-module).
The [`aws-eks` stack](https://github.com/greptileai/akupara/tree/main/terraform/stacks/aws-eks) provisions:

- **EKS Auto Mode** cluster + OIDC provider for IRSA
- **RDS PostgreSQL** and **ElastiCache Redis**
- **AWS Load Balancer Controller**
- **External Secrets Operator**, with secrets stored in **SSM Parameter Store** (`/${name_prefix}/config/*`, `/${name_prefix}/secrets/*`) and a **KMS** key for SecureString params
- **Hatchet** stack + a token-generation Job
- The **Greptile** services + DB migration Job
- An optional **CloudWatch** log group + agent (see [Monitoring](#monitoring-and-observability))

It installs Kubernetes resources through the Terraform `helm` and `kubernetes` providers — there is **no separate `helm install` step**.

```
# main.tf (in your root module)
module "greptile_aws_eks" {
  source = "github.com/greptileai/akupara//terraform/stacks/aws-eks?ref=main"

  vpc_id             = var.vpc_id
  private_subnet_ids = var.private_subnet_ids
  ecr_registry       = var.ecr_registry   # <registry>/<service>:<tag>
  greptile_tag       = var.greptile_tag

  db_password          = var.db_password
  jwt_secret           = var.jwt_secret           # >= 32 chars
  token_encryption_key = var.token_encryption_key # >= 32 chars
}
```

```
terraform init
terraform apply -var-file="terraform.tfvars"

# Configure kubectl from the stack output
$(terraform output -raw kubeconfig_command)
kubectl get pods
```

Terraform stores these secret values in **Terraform state**. Treat your state backend (local or remote) as sensitive. Pin the module `source` to a tag/commit (`?ref=v0.1.0`) for production rather than `main`.

Pin the EKS-specific tunables in [`terraform.tfvars`](https://github.com/greptileai/akupara/blob/main/terraform/examples/aws-eks-module/terraform.tfvars.example) — region, `kubernetes_version`, `db_instance_class` (default `db.m5.large`), CloudWatch retention, and Hatchet ingress exposure. See the [stack README](https://github.com/greptileai/akupara/blob/main/terraform/stacks/aws-eks/README.md) for the full variables reference.

## [​](#other-environments) Other environments

There is **no GCP or Azure Terraform** in the repo today. For GKE, AKS, on-prem, k3s, Rancher, or OpenShift, bring your own Kubernetes cluster and use the generic `deploy/kubernetes` chart in [Setup](#setup) above:

- Kubernetes 1.21+ required
- The chart deploys PostgreSQL and PgBouncer by default (or point at a managed database via `externalDatabase`)
- Install an ingress controller and a Hatchet release first
- Allow the privileged `worker` pod (`SYS_ADMIN` + `/sys/fs/cgroup`)

## [​](#operations) Operations

### [​](#scaling) Scaling

Each component defaults to `replicas: 1`. Scale via chart values:

```
components:
  api:
    replicas: 5
  summarizer:
    replicas: 10
```

```
helm upgrade greptile ./charts/greptile -f ./charts/profiles/values.user.yaml
# or, for a quick manual bump:
kubectl scale deployment greptile-api --replicas=5
```

### [​](#updating) Updating

```
helm upgrade greptile ./charts/greptile -f ./charts/profiles/values.user.yaml \
  --set global.tag=<new_version>
kubectl rollout status deployment/greptile-api

# Roll back if needed
helm rollback greptile
```

### [​](#validating-workers) Validating workers

After deploy, confirm the worker deployments (`chunker`, `summarizer`, `worker`) appear as registered workers in the Hatchet UI. If they don’t, reviews won’t run — check `HATCHET_CLIENT_TOKEN` and the Hatchet endpoints.

## [​](#monitoring-and-observability) Monitoring and observability

The chart’s operational visibility is **Kubernetes-native** — there is no bundled metrics or dashboard stack.
**Built-in:**

- **Rollout and log inspection** via `kubectl`:

  ```
  kubectl get pods -l app.kubernetes.io/instance=greptile
  kubectl logs deploy/greptile-web
  kubectl top pods
  kubectl get events --sort-by='.lastTimestamp'
  ```
- **Worker health** via the Hatchet dashboard — workflow status, queue depth, and registered workers (`chunker`, `summarizer`, `worker`).

**Not bundled in the shipped chart:**
The `deploy/kubernetes` Helm chart does **not** ship Prometheus scraping (no `ServiceMonitor` or `PodMonitor`), Grafana, bundled dashboards, or Fluentd/Elasticsearch log forwarding. If you want metrics scraping or dashboards, deploy and wire up Prometheus/Grafana yourself as a separate operator concern.
**Optional log shipping (AWS EKS only):**
The [`aws-eks` Terraform stack](#aws-eks-with-terraform) — and only that stack — can ship container logs to **CloudWatch**. It runs a CloudWatch-agent DaemonSet against a Terraform-managed log group (`/greptile/<name_prefix>/application`), toggled by `cloudwatch_logs_enabled` (default `true`). This is not part of the generic `deploy/kubernetes` chart.

## [​](#troubleshooting) Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `ImagePullBackOff` | Bad registry/tag/pull secret | Verify `global.registry`, `global.tag`, and the `regcred` secret |
| `CrashLoopBackOff` | App/env error | Inspect container env and secret keys: `kubectl logs <pod>` |
| `DB migration job failed` | DB unreachable or bad credentials | Validate DB connectivity and credentials |
| Worker review sandbox failed | Pod security blocks privileged mode | Allow the `greptile-worker` pod to run privileged with `SYS_ADMIN` and mount `/sys/fs/cgroup` |
| No reviews generated | Hatchet not connected | Verify `HATCHET_CLIENT_TOKEN` and Hatchet endpoints; check workers in the Hatchet UI |
| Pods stuck in `Init:` | DB not ready (EKS `wait-for-db` init container) | `kubectl logs deploy/api -c wait-for-db`; confirm RDS endpoint + security groups |

Webhook issues: confirm `network.webhookUrl` is publicly reachable and matches the URL in your GitHub App / GitLab webhook.
LLM errors: check the proxy logs and verify keys/model names:

```
kubectl logs deploy/greptile-llmproxy --tail=100
```

## [​](#resources) Resources

- [Deployment docs](https://github.com/greptileai/akupara/tree/main/deploy/kubernetes/docs) — install, secrets, ingress, operations, troubleshooting
- [Helm chart](https://github.com/greptileai/akupara/tree/main/deploy/kubernetes/charts/greptile) and [`values.yaml`](https://github.com/greptileai/akupara/blob/main/deploy/kubernetes/charts/greptile/values.yaml)
- [`values.user.example.yaml`](https://github.com/greptileai/akupara/blob/main/deploy/kubernetes/charts/profiles/values.user.example.yaml)
- [AWS EKS Terraform stack](https://github.com/greptileai/akupara/tree/main/terraform/stacks/aws-eks)

⌘I
