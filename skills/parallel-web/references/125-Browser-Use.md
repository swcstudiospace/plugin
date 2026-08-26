# Browser Use

Source: https://docs.parallel.ai/integrations/browseruse.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Browser Use
> Access private web data in Tasks using Browser Use MCP

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

Integrate Browser Use with the Parallel Task API to access authenticated web content and private data during task execution. The Browser Use MCP server enables Parallel to interact with websites through a browser that you configure, allowing access to content behind logins, paywalls, or other authentication barriers.
## Overview
By connecting the [Browser Use](https://browser-use.com) MCP server to your Parallel tasks, you can:
\* \*\*Access authenticated content\*\*: Research data behind logins, such as internal dashboards, CRM systems, or subscription services
\* \*\*Interact with dynamic web applications\*\*: Navigate SPAs and JavaScript-heavy sites that require browser rendering
\* \*\*Automate browser workflows\*\*: Fill forms, click buttons, and navigate multi-step processes as part of research tasks
\* \*\*Extract private data\*\*: Pull information from accounts and services that require authentication
## Prerequisites
\* A Parallel API key from [Platform](https://platform.parallel.ai)
\* A Browser Use API key from [Browser Use](https://browser-use.com)
\* For authenticated content: A Browser Use profile with saved login sessions. Profiles are persistent storage containers that maintain your credentials and cookies across browser sessions. See the [Browser Use Profile Documentation](https://docs.cloud.browser-use.com/concepts/profile) for setup instructions.
The `browser\_task` and `monitor\_task` tools are required for basic browser functionality. To access authenticated content via profiles, `list\_browser\_profiles` must also be included in your `allowed\_tools` configuration. Without it, the browser will function but cannot access your saved authenticated sessions.
## Configuration
Add the Browser Use MCP server to your Task API requests using the `mcp\_servers` field. See [MCP Tool Calling](/task-api/mcp-tool-call) for complete documentation on using MCP servers with the Task API.
```bash cURL theme={"system"}
curl -X POST "https://api.parallel.ai/v1/tasks/runs" \
-H "x-api-key: $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
--data '{
"input": "Go to https://www.nxp.com/products/K66\_180 and extract only the migration-related information for the K66-180 chip, specifically documentation on Migration from Kinetis K Series to MCXNx4x Series.",
"processor": "ultra",
"mcp\_servers": [
{
"type": "url",
"url": "https://api.browser-use.com/mcp",
"name": "browseruse",
"headers": {
"Authorization": "Bearer YOUR\_BROWSERUSE\_API\_KEY"
}
}
]
}'
```
```python Python theme={"system"}
import requests
response = requests.post(
"https://api.parallel.ai/v1/tasks/runs",
headers={
"x-api-key": "YOUR\_PARALLEL\_API\_KEY",
"Content-Type": "application/json"
},
json={
"input": "Go to https://www.nxp.com/products/K66\_180 and extract only the "
"migration-related information for the K66-180 chip, specifically "
"documentation on Migration from Kinetis K Series to MCXNx4x Series.",
"processor": "ultra",
"mcp\_servers": [
{
"type": "url",
"url": "https://api.browser-use.com/mcp",
"name": "browseruse",
"headers": {
"Authorization": "Bearer YOUR\_BROWSERUSE\_API\_KEY"
}
}
]
}
)
print(response.json())
```
```typescript TypeScript theme={"system"}
const response = await fetch("https://api.parallel.ai/v1/tasks/runs", {
method: "POST",
headers: {
"x-api-key": process.env.PARALLEL\_API\_KEY,
"Content-Type": "application/json",
},
body: JSON.stringify({
input:
"Go to https://www.nxp.com/products/K66\_180 and extract only the migration-related information for the K66-180 chip, specifically documentation on Migration from Kinetis K Series to MCXNx4x Series.",
processor: "ultra",
mcp\_servers: [
{
type: "url",
url: "https://api.browser-use.com/mcp",
name: "browseruse",
headers: {
Authorization: `Bearer ${process.env.BROWSERUSE\_API\_KEY}`,
},
},
],
}),
});
console.log(await response.json());
```
## Best Practices
\* \*\*Use appropriate processors\*\*: Browser interactions require `ultra` or higher processors that support multiple tool calls
\* \*\*Be specific with instructions\*\*: Provide clear steps for authentication and navigation when the path is complex
\* \*\*Combine with web research\*\*: Browser Use handles private data while Parallel's built-in capabilities handle public web research
\* \*\*Manage credentials securely\*\*: Store your Browser Use API key securely and rotate it regularly
## Limitations
\* Browser interactions add latency compared to direct API calls
\* Complex multi-step workflows may require higher-tier processors for optimal results
For more details on MCP server configuration and response handling, see the [MCP Tool Calling](/task-api/mcp-tool-call) documentation.
