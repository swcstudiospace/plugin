# IDE Setup

Source: https://www.greptile.com/docs/mcp-v2/setup

Configure the Greptile MCP server in your IDE to access code review tools and custom context.

**Prerequisite:** Get your API key from [app.greptile.com/settings/organization/api](https://app.greptile.com/settings/organization/api) (Settings > Organization > API Keys)

## [​](#setup-by-ide) Setup by IDE

- Cursor
- Claude Code (CLI)
- VS Code
- Codex (CLI)

1

Open Settings

Click the ‘Settings’ icon or press `Ctrl + Shift + J` (Windows/Linux) or `Cmd + Shift + J` (macOS).

2

Go to Tools & MCP

Click **Tools & MCP** in the left sidebar.

![Cursor Tools and MCP settings](https://mintcdn.com/greptile/pPDrEYn7_-Bi_2Mg/images/cursor-tools-mcp.png?fit=max&auto=format&n=pPDrEYn7_-Bi_2Mg&q=85&s=e35ed3a88fd1275f6c5daac82cb0eba3)

3

Add Custom MCP

Click **Add Custom MCP**.

![Add custom MCP button](https://mintcdn.com/greptile/UPpVJVb6MO4m3Pv2/images/cursor-add-custom-mcp.png?fit=max&auto=format&n=UPpVJVb6MO4m3Pv2&q=85&s=193acc7fde5827f55d9c7fefd55bec7f)

4

Configure mcp.json

Add the following configuration:

```
{
  "mcpServers": {
    "greptile": {
      "type": "http",
      "url": "https://api.greptile.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_GREPTILE_API_KEY"
      }
    }
  }
}
```

Replace `YOUR_GREPTILE_API_KEY` with your actual API key. Save the file.

5

Verify Connection

Return to **Tools & MCP**. You should see Greptile with all 16 tools enabled. `list_pull_requests` and `list_merge_requests` are listed separately here; the reference documents them under one heading.

![Greptile MCP enabled in Cursor](https://mintcdn.com/greptile/pPDrEYn7_-Bi_2Mg/images/cursor-greptile-mcp-enabled.png?fit=max&auto=format&n=pPDrEYn7_-Bi_2Mg&q=85&s=627f418c9fa4c2381fe9cc644fa8e0aa)

1

Add Greptile MCP Server

Run the following command in your terminal:

```
claude mcp add --transport http greptile https://api.greptile.com/mcp \
  --header "Authorization: Bearer YOUR_GREPTILE_API_KEY"
```

Replace `YOUR_GREPTILE_API_KEY` with your actual API key.

2

Verify Installation

Check that the server was added:

```
claude mcp list
```

You should see:

```
greptile: https://api.greptile.com/mcp (HTTP) - ✓ Connected
```

3

Start Using

Open Claude Code. The Greptile MCP tools are now available automatically.

### [​](#project-level-configuration) Project-Level Configuration

For team-shared configuration, create a `.mcp.json` file in your project root:

```
{
  "servers": {
    "greptile": {
      "transport": "http",
      "url": "https://api.greptile.com/mcp",
      "headers": {
        "Authorization": "Bearer ${GREPTILE_API_KEY}"
      }
    }
  }
}
```

Then set the environment variable:

```
export GREPTILE_API_KEY=your-api-key-here
```

1

Open Command Palette

Press `Ctrl + Shift + P` (Windows/Linux) or `Cmd + Shift + P` (macOS).

2

Add MCP Server

Type `MCP` and select **MCP: Add Server**.

![Add MCP Server in VS Code](https://mintcdn.com/greptile/sJeefWhR1h6iqsSa/images/vscode-mcp-add.png?fit=max&auto=format&n=sJeefWhR1h6iqsSa&q=85&s=d4dc25696fa020f32d381229e808a33b)

3

Select HTTP Type

Choose **HTTP (HTTP or Server-Sent-Events)**.

![Select HTTP type](https://mintcdn.com/greptile/sJeefWhR1h6iqsSa/images/vscode-mcp-type.png?fit=max&auto=format&n=sJeefWhR1h6iqsSa&q=85&s=5384a6058f8c4e93f9dfc0996410d9e9)

4

Enter URL

Enter: `https://api.greptile.com/mcp`

5

Select Scope

Choose **Global** or **Workspace**.

![Select scope](https://mintcdn.com/greptile/sJeefWhR1h6iqsSa/images/vscode-mcp-scope.png?fit=max&auto=format&n=sJeefWhR1h6iqsSa&q=85&s=4b0caed12d7183c975e3fb4a353fc0d8)

6

Add Authorization Header

An `mcp.json` file will be created. Add the Authorization header:

```
{
  "servers": {
    "greptile": {
      "url": "https://api.greptile.com/mcp",
      "type": "http",
      "headers": {
        "Authorization": "Bearer YOUR_GREPTILE_API_KEY"
      }
    }
  }
}
```

Replace `YOUR_GREPTILE_API_KEY` with your actual API key.

7

Verify Installation

Run **MCP: List Servers** from Command Palette. You should see Greptile with status **Running**.

![MCP server status](https://mintcdn.com/greptile/sJeefWhR1h6iqsSa/images/vscode-mcp-status.png?fit=max&auto=format&n=sJeefWhR1h6iqsSa&q=85&s=f307621c9cc4b023773547e48b9a6056)

1

Add Greptile MCP Server

Run the following command in your terminal:

```
codex mcp add greptile --url https://api.greptile.com/mcp \
  --bearer-token-env-var GREPTILE_API_KEY
```

Then set your API key as an environment variable:

```
export GREPTILE_API_KEY=your-api-key-here
```

2

Verify Installation

Check that the server was added:

```
codex mcp list
```

You should see:

```
Name      Url                           Bearer Token Env Var  Status   Auth
greptile  https://api.greptile.com/mcp  GREPTILE_API_KEY      enabled  Bearer token
```

3

Start Using

Open Codex. The Greptile MCP tools are available automatically.

### [​](#project-level-configuration-2) Project-Level Configuration

For team-shared configuration, create a `.codex/config.toml` file in your project root:

```
[mcp_servers.greptile]
url = "https://api.greptile.com/mcp"
bearer_token_env_var = "GREPTILE_API_KEY"
```

Then set the environment variable:

```
export GREPTILE_API_KEY=your-api-key-here
```

## [​](#verify-connection) Verify Connection

Test your setup with curl:

```
curl -X POST https://api.greptile.com/mcp \
  -H "Authorization: Bearer YOUR_GREPTILE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"ping"}'
```

Expected response:

```
{"jsonrpc":"2.0","id":1,"result":{}}
```

## [​](#troubleshooting) Troubleshooting

Server shows as disconnected

**Check:**

- API key is correct and hasn’t expired
- URL is exactly `https://api.greptile.com/mcp`
- Authorization header format: `Bearer YOUR_API_KEY` (with Bearer prefix)

**Fix:** Restart your IDE after making configuration changes.

Authentication failed

**Verify:**

- API key was copied without extra spaces
- Your account has access to the repositories you’re querying
- API key hasn’t been revoked

**Test:** Use the curl command above to verify your API key works.

No tools available

**Solutions:**

1. Restart your IDE completely
2. Check server shows “Connected” or “Running” status
3. Verify MCP is enabled in IDE settings

Tools return empty results

**Check:**

- You have repositories indexed with Greptile
- Your API key has access to those repositories
- There are actual Greptile comments on your PRs

## [​](#configuration-file-locations) Configuration File Locations

| IDE | Config File |
| --- | --- |
| Claude Code | `~/.mcp.json` or project `.mcp.json` |
| Cursor | `~/.cursor/mcp.json` |
| VS Code | `~/.config/Code/User/mcp.json` (Linux) `~/Library/Application Support/Code/User/mcp.json` (macOS) |
| Codex CLI | `~/.codex/config.toml` or project `.codex/config.toml` |

## [​](#next-steps) Next Steps

## Auto-Fix Workflow

Learn to resolve Greptile comments from your IDE

## Tools Reference

Complete API documentation for all 16 tools

⌘I
