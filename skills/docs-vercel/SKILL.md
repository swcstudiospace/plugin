---
name: docs-vercel
description: Offline Vercel documentation (vercel.com/docs). Use for deployments, serverless/edge functions, middleware, domains, env vars, monorepos, cron, storage, and Vercel platform config. Prefer references/ and cite Source URLs.
version: 0.2.0
metadata:
  openclaw:
    emoji: "▲"
    requires:
      bins: [python3]
  hermes:
    tags: [docs, vercel, nextjs, edge, serverless, deploy]
---

# Vercel docs

Offline documentation package for **Vercel** (`https://vercel.com/docs`).

- Pages packaged: see `manifest.json` / `references/`
- Local hybrid corpus DB: `/root/.openclaw/workspace/projects/docs-scraper/data/db/skills/docs-vercel.sqlite`

## When to use
- Deploying Next.js / frontend apps on Vercel
- Serverless Functions, Edge Functions, Middleware, Cron
- Domains, env vars, monorepos, project settings
- Vercel Blob/KV/Postgres, deployment protection, previews

## How to answer (agent workflow)
1. **Load this skill** when the user asks about Vercel.
2. Search `references/` for matching guides (filenames + body text).
3. Prefer quoting/paraphrasing with the **Source:** URL at the top of each file.
4. Do **not** invent CLI flags, env var names, or API fields not in the refs.
5. For deeper retrieval against the live corpus on this VPS:

```bash
cd /root/.openclaw/workspace/projects/docs-scraper
source .venv/bin/activate
DB=data/db/skills/docs-vercel.sqlite

python scripts/query.py "edge middleware rewrite" --db "$DB" -k 8 --mode fts
python scripts/query.py "environment variables preview production" --db "$DB" -k 5
python scripts/stats.py --db "$DB"
```

## Common topics → look in references/
- Deploy / Build / Framework presets
- Functions (Node / Edge) and Routing Middleware
- Environment variables & secrets
- Domains, DNS, SSL
- Cron jobs, Speed Insights, Analytics
- Storage (Blob, KV, Postgres)
- Deployment protection / preview URLs
- Monorepos & Turborepo

## Refresh
```bash
cd /root/.openclaw/workspace/projects/docs-scraper && source .venv/bin/activate
python scripts/batch_docs_skills.py --only vercel --max-pages 150 --force
```

## Safety
Public docs only. Cite Source URLs. Confirm redistribution if publishing outside this VPS.
