# Get your Claude API key

Source: https://platform.claude.com/docs/en/get-api-key.md

# Get your Claude API key
Find, create, and manage your API keys for the Claude API in the Claude Console.
---
API keys for the Claude API (also called Anthropic API keys) live in the Claude Console. To view your existing keys or create a new one, go to [Settings → API keys](https://platform.claude.com/settings/keys).
## Create an API key

Go to [platform.claude.com](https://platform.claude.com/) and sign in, or create an account if you don't have one yet.

Go to [Settings → API keys](https://platform.claude.com/settings/keys).

Click \*\*Create key\*\*, then give the key a name. You can also choose a [workspace](https://platform.claude.com/settings/workspaces) to scope the key to, and an expiration.

The Console shows the full key, which starts with `sk-ant-`, only once, at creation. Copy it and store it somewhere safe, such as a secrets manager. If you lose a key, you can't view it again in the Console. Create a new key instead.
If the \*\*Create key\*\* button is disabled, you may not have permission to create keys in that workspace. Ask an organization admin to grant you access or to create a key for you.
## Use your API key
Set the key as an environment variable:
```bash
export ANTHROPIC\_API\_KEY="sk-ant-api03-..."
```
The [client SDKs](/docs/en/cli-sdks-libraries/overview) read `ANTHROPIC\_API\_KEY` automatically. Direct HTTP requests send the key in the `x-api-key` header. To make your first request, follow the [Quickstart](/docs/en/get-started), and see [Authentication](/docs/en/manage-claude/authentication) for the full picture, including short-lived credentials with Workload Identity Federation.
## API keys and the Admin API
The [Admin API](/docs/en/api/admin) includes endpoints for managing your organization's API keys programmatically, such as [Retrieve API Key](/docs/en/api/admin/api\_keys/retrieve) and [List API Keys](/docs/en/api/admin/api\_keys/list). These endpoints are for organization admins automating key management. They require a separate [Admin API key](/docs/en/manage-claude/admin-api-keys), and they never return a key's secret value, only a partially redacted hint.
The Admin API can't recover a lost key or give you a key to call the Claude API with. To get a usable API key, create one in [Settings → API keys](https://platform.claude.com/settings/keys) in the Claude Console.
