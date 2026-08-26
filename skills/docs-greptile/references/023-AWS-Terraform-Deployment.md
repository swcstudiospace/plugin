# AWS Terraform Deployment

Source: https://www.greptile.com/docs/docker-compose/aws-terraform

The [Terraform stack](https://github.com/greptileai/akupara/tree/main/terraform/stacks/aws-ec2) provisions all AWS infrastructure and bootstraps Greptile automatically.

## [​](#what-gets-created) What Gets Created

| Resource | Purpose |
| --- | --- |
| VPC | Private network with public/private subnets |
| EC2 | Server running Docker Compose |
| RDS PostgreSQL | Application database with pgvector |
| ElastiCache Redis | Caching layer |
| S3 Bucket | Secrets storage |
| Security Groups | Network access control |
| IAM Roles | Service permissions |

## [​](#prerequisites) Prerequisites

AWS Permissions

Your AWS user/role needs permissions for:

- EC2 (instances, security groups, key pairs)
- RDS (instances, subnet groups, parameter groups)
- ElastiCache (clusters, subnet groups)
- VPC (VPCs, subnets, route tables, NAT gateways, internet gateways)
- S3 (buckets, objects)
- IAM (roles, policies, instance profiles)

Local Tools

- [Terraform](https://developer.hashicorp.com/terraform/install) 1.0+
- [AWS CLI](https://aws.amazon.com/cli/) configured (`aws configure`)

From Greptile

- Container registry credentials (`CONTAINER_REGISTRY`, `GREPTILE_TAG`)
- License (contact [hello@greptile.com](mailto:hello@greptile.com))

GitHub App

Create a GitHub App with:

- Webhook URL: `http://<EC2_IP>:3007/webhook` (update after deployment)
- Permissions: Contents (read), Pull requests (read/write), Issues (read/write)
- Events: Pull request, Push, Issue comment

You’ll need: App ID, Client ID, Client Secret, Private Key, Webhook Secret

LLM Provider

API keys for at least one provider:

- [Anthropic](https://console.anthropic.com/) — Claude models
- [OpenAI](https://platform.openai.com/) — GPT models
- [AWS Bedrock](https://aws.amazon.com/bedrock/) — Various models

## [​](#setup) Setup

1

Clone the repository

```
git clone https://github.com/greptileai/akupara.git
cd akupara/terraform/stacks/aws-ec2
```

2

Create configuration file

```
cp terraform.tfvars.example terraform.tfvars
```

3

Edit terraform.tfvars

```
# AWS
aws_region  = "us-east-1"
aws_profile = "default"
app_name    = "greptile"

# GitHub App
github_client_id      = "Iv1.xxx"
github_client_secret  = "xxx"
github_webhook_secret = "xxx"
github_private_key    = <<-EOT
-----BEGIN RSA PRIVATE KEY-----
...your private key...
-----END RSA PRIVATE KEY-----
EOT

# LLM (set the ones you use)
openai_api_key    = "sk-..."
anthropic_api_key = "sk-ant-..."
```

See [terraform.tfvars.example](https://github.com/greptileai/akupara/blob/main/terraform/stacks/aws-ec2/terraform.tfvars.example) for all options.

4

Initialize and deploy

```
terraform init
terraform plan    # Review what will be created
terraform apply   # Type 'yes' to confirm
```

Deployment takes 10-15 minutes.

5

Get the URL

```
terraform output greptile_url
```

Update your GitHub App webhook URL to `http://<EC2_IP>:3007/webhook`.

## [​](#access) Access

| Service | URL |
| --- | --- |
| Web UI | `http://<EC2_IP>:3000` |
| Hatchet Admin | `http://<EC2_IP>:8080` |

## [​](#configuration) Configuration

Instance Sizing

Modify `ec2_instance_type` in `terraform.tfvars`:

| Team Size | Instance | vCPU | RAM |
| --- | --- | --- | --- |
| 5-10 devs | `t3.xlarge` | 4 | 16GB |
| ~50 devs | `m5.2xlarge` | 8 | 32GB |
| 100 devs | `m5.8xlarge` | 32 | 128GB |

```
ec2_instance_type = "m5.2xlarge"
```

Database Sizing

Modify `db_instance_class`:

```
db_instance_class = "db.r5.large"   # Default
db_instance_class = "db.r5.xlarge"  # Larger teams
```

Custom VPC CIDR

```
vpc_cidr = "10.0.0.0/16"  # Default
```

SSH Key

To enable SSH access:

```
key_name = "your-ec2-keypair-name"
```

## [​](#operations) Operations

SSH into EC2

```
ssh -i your-key.pem ec2-user@<EC2_IP>
cd /opt/greptile
```

View logs

```
ssh ec2-user@<EC2_IP>
cd /opt/greptile
docker compose logs -f              # All services
docker compose logs -f greptile-api # Specific service
```

Update Greptile

```
ssh ec2-user@<EC2_IP>
cd /opt/greptile
docker compose pull
docker compose up -d
```

Check service status

```
docker compose ps
sudo systemctl status greptile-app
```

## [​](#destroy) Destroy

To remove all infrastructure:

```
terraform destroy
```

This deletes everything including the database. Export data first if needed.

## [​](#troubleshooting) Troubleshooting

EC2 not accessible

- Verify security group allows inbound on ports 3000, 3007, 8080
- Check EC2 is in public subnet with internet gateway
- Confirm EC2 instance is running: `aws ec2 describe-instances`

Services not starting

SSH in and check:

```
sudo journalctl -u greptile-app -f
docker compose ps
docker compose logs
```

Database connection failed

- Verify RDS security group allows traffic from EC2 security group
- Check RDS instance is available: `aws rds describe-db-instances`

Webhooks not working

- Update GitHub App webhook URL to `http://<EC2_IP>:3007/webhook`
- Check security group allows inbound on port 3007
- Verify webhook secret matches `github_webhook_secret` in tfvars

## [​](#resources) Resources

- [Terraform stack source](https://github.com/greptileai/akupara/tree/main/terraform/stacks/aws-ec2)
- [Terraform modules](https://github.com/greptileai/akupara/tree/main/terraform/modules/aws)

⌘I
