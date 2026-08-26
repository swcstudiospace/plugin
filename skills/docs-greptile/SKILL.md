---
name: docs-greptile
description: Offline documentation skill for Greptile (https://www.greptile.com/docs/). Use for Greptile PR review, CLI, MCP, config files, integrations, self-hosting, and security.
version: 1.0.0
metadata:
  hermes:
    tags: [docs, greptile, code-review, mcp, cli]
---

# docs-greptile

Offline corpus of **[Greptile](https://www.greptile.com/docs/)** public docs (AI code review, TREX, MCP, CLI, self-host).

## When to use
- Setting up Greptile code review on GitHub/GitLab
- `greptile.json` / `.greptile/` config, nitpicks, auto-approve, custom standards
- MCP server, IDE plugins, CLI onboarding
- Linear/Jira integrations, analytics
- Self-host (Docker Compose, Kubernetes, AWS Terraform), SSO/SAML, network rules

## How to answer
1. Prefer files under `references/` and cite the **Source:** URL in each file.
2. For broader recall, query the SQLite corpus:
   ```bash
   cd /root/.openclaw/workspace/projects/docs-scraper && source .venv/bin/activate
   python scripts/query.py "your question" --db data/db/skills/docs-greptile.sqlite -k 8 --mode fts
   ```
3. Do **not** invent APIs missing from references/corpus.

## Corpus stats
- Source: https://www.greptile.com/docs/ (Mintlify)
- Full DB: `data/db/skills/docs-greptile.sqlite` (100 pages; 956 FTS chunks)
- Skill package references: 51 unique HTML pages (`.md` duplicates and `llms-full.txt` excluded)
- Scraped: 2026-08-22
- Excluded from index as too large: `/docs/llms-full.txt`

## Contents
- [Analytics Dashboard](references/001-Analytics-Dashboard.md) — https://www.greptile.com/docs/analytics
- [Changelog](references/002-Changelog.md) — https://www.greptile.com/docs/changelog
- [Billing](references/003-Billing.md) — https://www.greptile.com/docs/code-review-bot/billing-seats
- [Configure with greptile.json](references/004-Configure-with-greptile-json.md) — https://www.greptile.com/docs/code-review-bot/greptile-json
- [Configure Which PRs Should Be Reviewed](references/005-Configure-Which-PRs-Should-Be-Reviewed.md) — https://www.greptile.com/docs/code-review-bot/trigger-code-review
- [Auto-approve PRs](references/006-Auto-approve-PRs.md) — https://www.greptile.com/docs/code-review/auto-approve-prs
- [CLI Onboarding](references/007-CLI-Onboarding.md) — https://www.greptile.com/docs/code-review/cli-onboarding
- [Controlling Nitpickiness](references/008-Controlling-Nitpickiness.md) — https://www.greptile.com/docs/code-review/controlling-nitpickiness
- [Cross Repo Context](references/009-Cross-Repo-Context.md) — https://www.greptile.com/docs/code-review/cross-repo-context
- [Custom Standards & Rules](references/010-Custom-Standards-Rules.md) — https://www.greptile.com/docs/code-review/custom-standards
- [Customization Overview](references/011-Customization-Overview.md) — https://www.greptile.com/docs/code-review/customization-overview
- [Developer Essentials](references/012-Developer-Essentials.md) — https://www.greptile.com/docs/code-review/developer-essentials
- [Anatomy of a Review](references/013-Anatomy-of-a-Review.md) — https://www.greptile.com/docs/code-review/first-pr-review
- [Greptile CLI](references/014-Greptile-CLI.md) — https://www.greptile.com/docs/code-review/greptile-cli
- [.greptile/ Configuration](references/015-greptile-Configuration.md) — https://www.greptile.com/docs/code-review/greptile-config
- [.greptile/ File Reference](references/016-greptile-File-Reference.md) — https://www.greptile.com/docs/code-review/greptile-config-reference
- [greptile.json Reference](references/017-greptile-json-Reference.md) — https://www.greptile.com/docs/code-review/greptile-json-reference
- [Key Features](references/018-Key-Features.md) — https://www.greptile.com/docs/code-review/key-features
- [Organizations & Teams](references/019-Organizations-Teams.md) — https://www.greptile.com/docs/code-review/team-setup-basics
- [Tips & Recipes](references/020-Tips-Recipes.md) — https://www.greptile.com/docs/code-review/tips-recipes
- [Training the Learning System](references/021-Training-the-Learning-System.md) — https://www.greptile.com/docs/code-review/training-the-learning-system
- [Deployment Options](references/022-Deployment-Options.md) — https://www.greptile.com/docs/deployment-options
- [AWS Terraform Deployment](references/023-AWS-Terraform-Deployment.md) — https://www.greptile.com/docs/docker-compose/aws-terraform
- [Manual Setup](references/024-Manual-Setup.md) — https://www.greptile.com/docs/docker-compose/manual-setup
- [Docker Compose Overview](references/025-Docker-Compose-Overview.md) — https://www.greptile.com/docs/docker-compose/overview
- [Custom Rules](references/026-Custom-Rules.md) — https://www.greptile.com/docs/how-greptile-works/custom-rules
- [Graph-based Codebase Context](references/027-Graph-based-Codebase-Context.md) — https://www.greptile.com/docs/how-greptile-works/graph-based-codebase-context
- [Memory and Learning](references/028-Memory-and-Learning.md) — https://www.greptile.com/docs/how-greptile-works/memory-and-learning
- [Reducing Nitpicks](references/029-Reducing-Nitpicks.md) — https://www.greptile.com/docs/how-greptile-works/nitpicks
- [Codex Plugin](references/030-Codex-Plugin.md) — https://www.greptile.com/docs/integrations/codex
- [Fix with your Agent](references/031-Fix-with-your-Agent.md) — https://www.greptile.com/docs/integrations/fix-with-your-agent
- [GitHub and GitLab Integration](references/032-GitHub-and-GitLab-Integration.md) — https://www.greptile.com/docs/integrations/github-gitlab-integration
- [Overview - What is Greptile?](references/033-Overview-What-is-Greptile.md) — https://www.greptile.com/docs/introduction
- [Jira Integration](references/034-Jira-Integration.md) — https://www.greptile.com/docs/jira-integration
- [Kubernetes Deployment](references/035-Kubernetes-Deployment.md) — https://www.greptile.com/docs/kubernetes-new
- [Linear Integration](references/036-Linear-Integration.md) — https://www.greptile.com/docs/linear-integration
- [Auto-Fix Workflow](references/037-Auto-Fix-Workflow.md) — https://www.greptile.com/docs/mcp-v2/auto-fix
- [Custom Context](references/038-Custom-Context.md) — https://www.greptile.com/docs/mcp-v2/custom-context
- [MCP Overview](references/039-MCP-Overview.md) — https://www.greptile.com/docs/mcp-v2/overview
- [Reports & Analytics](references/040-Reports-Analytics.md) — https://www.greptile.com/docs/mcp-v2/reports
- [IDE Setup](references/041-IDE-Setup.md) — https://www.greptile.com/docs/mcp-v2/setup
- [Agent Skills](references/042-Agent-Skills.md) — https://www.greptile.com/docs/mcp-v2/skills
- [Tools Reference](references/043-Tools-Reference.md) — https://www.greptile.com/docs/mcp-v2/tools
- [5-Minute Quickstart](references/044-5-Minute-Quickstart.md) — https://www.greptile.com/docs/quickstart
- [Network Rules](references/045-Network-Rules.md) — https://www.greptile.com/docs/security/network-rules
- [Self-Hosted Greptile](references/046-Self-Hosted-Greptile.md) — https://www.greptile.com/docs/security/selfhost
- [SSO/SAML](references/047-SSO-SAML.md) — https://www.greptile.com/docs/security/sso
- [SSO & Identity](references/048-SSO-Identity.md) — https://www.greptile.com/docs/security/sso-and-identity
- [CLI Reviews on Self-Hosted Greptile](references/049-CLI-Reviews-on-Self-Hosted-Greptile.md) — https://www.greptile.com/docs/self-hosting/cli-reviews
- [System Architecture](references/050-System-Architecture.md) — https://www.greptile.com/docs/system-architecture
- [Troubleshooting Common Issues](references/051-Troubleshooting-Common-Issues.md) — https://www.greptile.com/docs/troubleshooting/common-issues

## Notes
- Prefer `references/` over memory.
- Live docs may change; re-crawl with `python scripts/crawl.py --config configs/greptile-docs.yaml --resume`.
