# Customization Overview

Source: https://www.greptile.com/docs/code-review/customization-overview

Greptile gives you three ways to customize review behavior. Pick the one that fits how your team works — or combine them.

## [​](#configuration-methods) Configuration Methods

- .greptile/ folder (Recommended)
- greptile.json
- Dashboard UI

A folder you place in any directory of your repo. Supports cascading — root-level defaults with per-directory overrides.

- Version controlled and reviewed in PRs
- Separate files for settings, rules, and context
- Per-directory overrides for monorepos
- Structured rules with scoping, severity, and disable-by-ID

A single JSON file in your repository root. Everything in one file — settings, rules, and context.

- Version controlled and reviewed in PRs
- Repository-wide settings only (no per-directory overrides)
- Good for simpler repos that don’t need cascading

Organization-wide defaults at [app.greptile.com](https://app.greptile.com/).

- Changes apply immediately, no commits needed
- Affects all repositories in the organization
- Good for quick experiments and org-wide defaults

## [​](#how-they-interact) How They Interact

When multiple methods are used, the closest config wins (highest priority first):

1. **Nested `.greptile/`** — per-directory settings, closest to the file
2. **Root `.greptile/` or `greptile.json`** — repo-wide settings
3. **Dashboard** — org defaults

Settings override. Rules from the dashboard and from config files all apply. A config file can turn off a dashboard or parent rule by ID.

If both `.greptile/` and `greptile.json` exist in the repository root, `.greptile/` takes precedence and `greptile.json` is ignored.

## [​](#in-this-section) In This Section

## .greptile/ Configuration

How cascading works, merge rules, monorepo examples

## .greptile/ File Reference

Complete schema for config.json, rules.md, and files.json

## Controlling Nitpickiness

Adjust strictness, filter comment types, ignore files

## Training the Learning System

Use reactions and feedback to improve reviews

## Custom Standards

Enforce team-specific coding rules

## Cross Repo Context

Reference related codebases

## greptile.json Reference

Legacy format — complete parameter documentation

⌘I
