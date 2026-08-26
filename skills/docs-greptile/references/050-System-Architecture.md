# System Architecture

Source: https://www.greptile.com/docs/system-architecture

## [​](#deployment-guides) Deployment Guides

## Docker Compose

Single VM, up to 100 developers

## Kubernetes

Clustered, 100+ developers

---

## [​](#docker-compose-architecture) Docker Compose Architecture

All services run as containers on a single Linux host, orchestrated by Docker Compose.

![Greptile architecture overview](https://mintcdn.com/greptile/pPDrEYn7_-Bi_2Mg/images/greptile-architecture.jpg?fit=max&auto=format&n=pPDrEYn7_-Bi_2Mg&q=85&s=d34499718ba1cddcb0609f2eef2f7d39)

### [​](#core-services) Core Services

| Service | Port | Function |
| --- | --- | --- |
| `greptile-web` | 3000 | Web UI |
| `greptile-api` | 3001 | REST API, business logic |
| `greptile-auth` | 3002 | Internal authentication |
| `greptile-webhook` | 3007 | Receives GitHub/GitLab webhooks |
| `saml-jackson` | 5225 | SAML SSO (Okta, Azure AD, etc.) |

### [​](#background-workers) Background Workers

| Service | Port | Function |
| --- | --- | --- |
| `greptile-indexer-chunker` | - | Splits repositories into chunks for indexing |
| `greptile-indexer-summarizer` | - | Generates repository summaries |
| `greptile-reviews` | 3005 | Generates PR reviews using LLMs |
| `greptile-jobs` | 8086 | Scheduled tasks (analytics, cleanup) |
| `greptile-llmproxy` | 4000 | Routes requests to configured LLM providers |

### [​](#infrastructure-services) Infrastructure Services

| Service | Port | Function |
| --- | --- | --- |
| `hatchet-api` | 8080 | Workflow orchestration API |
| `hatchet-frontend` | 8080 | Hatchet admin UI (via caddy) |
| `hatchet-engine` | 7077 | Executes background workflows |
| `hatchet-postgres` | - | Hatchet’s PostgreSQL database |
| `hatchet-rabbitmq` | 5673 | Message queue for Hatchet |
| `greptile-postgres` | 5432 | Application database (pgvector enabled) |
| `hatchet-caddy` | 80/443/8080 | Reverse proxy for Hatchet |

### [​](#data-flow) Data Flow

1. **Webhook received** → `greptile-webhook` validates and queues the event
2. **Hatchet** picks up the job and dispatches to appropriate worker
3. **Workers** (`chunker`, `summarizer`, `reviews`) process via `llmproxy`
4. **Results** stored in PostgreSQL, response posted back to SCM

### [​](#network-requirements) Network Requirements

**Must expose:**

- Port `3007` for SCM webhooks (or route through Caddy on 443)
- Port `3000` for web UI access
- Port `8080` for Hatchet admin (optional, can restrict to internal)

**Must reach outbound:**

- LLM provider APIs (OpenAI, Anthropic, Bedrock, etc.)
- SCM provider APIs (GitHub, GitLab, etc.)
- Container registry for image pulls

### [​](#storage) Storage

PostgreSQL stores all application data including:

- Repository metadata and summaries
- Code embeddings (via pgvector)
- Review history and analytics
- User accounts and settings

Plan storage based on repository sizes. Embeddings are the largest component.

---

## [​](#kubernetes-architecture) Kubernetes Architecture

Services deployed as pods across a Kubernetes cluster, managed by Helm charts. External PostgreSQL and Redis recommended for production.

![Kubernetes architecture](https://mintcdn.com/greptile/sJeefWhR1h6iqsSa/images/kubernetes-sys-architecture.jpg?fit=max&auto=format&n=sJeefWhR1h6iqsSa&q=85&s=10ac09b77914136d26a3b8e8b928159a)

### [​](#pod-deployments) Pod Deployments

Same services as Docker Compose, deployed as separate Kubernetes Deployments:

| Deployment | Replicas (prod) | Notes |
| --- | --- | --- |
| web | 3 | Stateless, scales horizontally |
| api | 20 | High traffic, scales horizontally |
| auth | 1 | Low traffic |
| webhook | 5 | Scales with PR volume |
| chunker | 10 | CPU/memory intensive |
| summarizer | 50 | LLM-bound, scales with indexing load |
| reviews | 36 | LLM-bound, scales with review volume |
| jobs | 1 | Single instance |

### [​](#external-services) External Services

Unlike Docker Compose, Kubernetes deployments typically use managed services:

| Component | Recommended | Purpose |
| --- | --- | --- |
| PostgreSQL | RDS with pgvector | Application data, embeddings |
| Redis | ElastiCache | Caching, rate limiting |
| Hatchet | Deployed via Helm | Workflow orchestration |

### [​](#networking) Networking

**Ingress:** LoadBalancer or Ingress controller exposes web and webhook services.
**Service mesh:** Optional. mTLS between services if using Istio/Linkerd.
**Egress:** NAT gateway for outbound traffic to LLM/SCM providers.

### [​](#scaling-considerations) Scaling Considerations

- **API and Webhook** scale with traffic volume
- **Chunker** scales with new repository indexing load
- **Summarizer and Reviews** scale with LLM throughput requirements
- Use HPA (Horizontal Pod Autoscaler) for dynamic scaling based on CPU/memory

---

## [​](#security-model) Security Model

### [​](#authentication) Authentication

| Method | Use Case |
| --- | --- |
| SAML SSO | Enterprise IdP (Okta, Azure AD, etc.) |
| Internal auth | Username/password for smaller deployments |
| GitHub/GitLab OAuth | Developer authentication |

### [​](#secrets-management) Secrets Management

**Docker Compose:** Environment variables in `.env` file. For production, use a secrets manager and inject at runtime.
**Kubernetes:** External Secrets Operator syncing from AWS Secrets Manager, Vault, or similar.

### [​](#network-security) Network Security

- Deploy in private subnet, expose only webhook port externally
- Database and Redis should not have public IPs
- Use security groups/firewall rules to restrict access
- All external traffic over TLS

---

## [​](#monitoring) Monitoring

### [​](#key-metrics) Key Metrics

| What | Why |
| --- | --- |
| Hatchet dashboard | Workflow success/failure rates, queue depth |
| Container health | Restarts, OOM kills |
| CPU/Memory | Capacity planning, scaling triggers |
| Disk usage | Embedding storage growth |
| LLM latency | Provider performance |

### [​](#recommended-stack) Recommended Stack

- **Logs:** CloudWatch, ELK, or Loki
- **Metrics:** Prometheus + Grafana, or CloudWatch
- **Alerting:** PagerDuty, Opsgenie, or native cloud alerting

Greptile’s Hatchet dashboard (port 8080) provides workflow-level visibility without additional setup.

⌘I
