---
name: repo-hygiene
description: Use when making a repo enterprise-ready on GitHub.
---

# Repository hygiene & enterprise-readiness

Class-level workflow for bringing a repo (IaC, CLI, service) up to
enterprise-ready GitHub standard: complete governance file set, verified
locally, pushed cleanly. Conventions below were established working on
`ai-cluster` (Aug 2026) and reflect this org's defaults.

## Triggers

- "make this repo enterprise-ready", "we don't have a LICENSE/README", "add standard starting files"
- Requests for AGENTS.md ("so LLMs can understand this repo")
- First push of a local tree to a new GitHub remote
- Adding community/health files (.github/, CoC, SECURITY, dependabot)

## Standard file set

| File | Requirements |
|---|---|
| `README.md` | Overview, architecture ASCII diagram, **honest implementation-status table** (✅ implemented / 🚧 scaffold / design intent — never claim a scaffold is done), quick start, links to runbooks + AGENTS.md |
| `LICENSE` | AGPL-3.0 is the org default for infra repos (user explicitly chose it); paste the canonical GNU text verbatim (~660 lines), never paraphrase |
| `AGENTS.md` | House rules for LLM agents: decision order (nested AGENTS.md → root → existing code), repo-map table, per-stack rules, verification commands. User requires this on serious repos. |
| `NOTICE.md` | Copyright line (Spectrum Web Co) + third-party license notes (e.g. HashiCorp BUSL entitlements) |
| `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `CHANGELOG.md` | Standard content; CHANGELOG follows Keep-a-Changelog |
| `CODE_OF_CONDUCT.md` | Contributor Covenant 2.1 with a REAL enforcement contact filled in |
| `.gitignore` | Stack-specific plus broad secret catch-all: `*.tfstate*`, `*.tfvars`, `tskey-*`, `*.token`, `*id_rsa*`, `*.gpg`, `.env*` |
| `.editorconfig` | See `references/editorconfig-validation.md` before programmatically validating one |
| `.github/` | `workflows/ci.yml` (fmt+validate per stack; shellcheck scope must match CI's own find-glob exactly), `CODEOWNERS` (real account with write access), issue templates, `PULL_REQUEST_TEMPLATE.md`, `dependabot.yml` |

## Verification before commit/push

1. Link-check: every path referenced in README/AGENTS.md must exist on disk.
2. Shell: `bash -n` every `*.sh`; run shellcheck with **exactly the same
   find-scope the CI workflow uses**, not a broader one (broader scope fails
   on scripts CI intentionally excludes, e.g. Packer provisioners).
3. YAML: `yaml.safe_load` every file under `.github/`.
4. `terraform fmt -check -recursive` / `packer fmt -check -recursive` when the
   binaries exist; if they don't, say CI will cover it instead of skipping silently.
5. **Auth/env invariants** — if the project uses a wrapper like `scripts/with-app-env.mjs`
   to inject build flags (e.g. `VITE_AUTH_ENABLED`), verify:
   - `.grok/app-env.json` exists with the shipped defaults (even if empty `{}`)
   - `npm run check:auth` passes against a running dev server
   - The wrapper is used by `dev`, `build`, `preview` scripts — never bypassed
6. **TypeScript + Lint + Tests** — run the project's exact CI gate commands:
   - `npm run typecheck` (or project equivalent)
   - `npm run lint` (0 errors; warnings are org policy)
   - `npm test` (pre-existing failures documented, not new ones)

## Pitfalls

- **Git identity on fresh VMs**: commits get auto-derived `root@hostname`
  committers. Fix BEFORE committing:
  `gh api user --jq '.id'` and `.login` →
  `git config --global user.email "<id>+<login>@users.noreply.github.com"`.
  Already committed? `git commit --amend --reset-author --no-edit`.
- **Remote may already exist with history**: run `gh repo view org/repo` and
  compare `gh api repos/org/repo/commits` against local log before pushing;
  expect a clean fast-forward. `git remote add` errors if origin exists —
  just push.
- **CI red ≠ code broken**: `gh run view <run-id>` and READ THE ANNOTATIONS.
  Billing failures render as "The job was not started because recent account
  payments have failed or your spending limit needs to be increased", all
  jobs fail in seconds, and `--log-failed` returns empty. Report to the user;
  do not debug code or retry pushes.
- **Truthful status over polish**: this org values honest
  implemented-vs-scaffold tables in READMEs. Do not inflate readiness.

## References

- `references/editorconfig-validation.md` — how to programmatically verify a
  .editorconfig (INI preamble gotcha, brace-expansion globs, behavioral checks)
