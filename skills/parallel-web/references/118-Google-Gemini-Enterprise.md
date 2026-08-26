# Google Gemini Enterprise

Source: https://docs.parallel.ai/integrations/google-gemini-enterprise.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Google Gemini Enterprise
> Use Parallel as a grounding provider in Google Gemini Enterprise Agent Platform (formerly Vertex AI)

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

The Parallel Search API is available in the Google Gemini Enterprise Agent Platform (formerly Vertex AI) as an external grounding provider. Use it to ground Gemini model responses with up-to-date context from the public web.
Grounding with Parallel on the Gemini Enterprise Agent Platform is currently in \*\*Preview\*\* (Pre-GA) per Google's [Service Specific Terms](https://cloud.google.com/terms/service-terms).
There are two ways to get started:
| | Google Cloud Marketplace | Bring Your Own Key (BYOK) |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| \*\*Setup\*\* | Subscribe via Google Cloud Marketplace | Get an API key from [Parallel Platform](https://platform.parallel.ai) |
| \*\*Authentication\*\* | Automatic — no API key needed | API key passed in each request |
| \*\*Billing\*\* | Consolidated through Google Cloud | Billed through Parallel |
| \*\*Quota\*\* | 200 prompts per minute | 200 prompts per minute |
| \*\*Zero Data Retention\*\* | Available via the [ZDR offering](https://console.cloud.google.com/marketplace/product/parallel-web-systems-public/parallel-web-systems-zdr) | Not available |
Read Google's official documentation [here](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/grounding/grounding-with-parallel).
## Use cases
\* Using web data for information completion or enrichment.
\* Multi-hop agents that require deeper web searches for complex questions.
\* Building APIs that integrate web search data.
\* Employee-facing assistants for up-to-date analysis and reporting.
\* Consumer apps (retail, travel) supporting informed purchase decisions.
\* Automated agents (e.g., news analysis, KYC checks).
\* Vertical agents (sales, coding, finance) fetching the latest context from the web.
## Example
Who won the 2025 Las Vegas F1 Grand Prix?
| Without Grounding | With Grounding |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The 2025 Las Vegas Grand Prix has not happened yet. The race is scheduled to take place on the weekend of November 20-22, 2025. Therefore, the winner is currently unknown. | The winner of the 2025 Las Vegas F1 Grand Prix was Max Verstappen of Red Bull Racing. The race took place on November 22, 2025. Sources: domain1.com, domain2.com, ... |
## Supported models
The following models support Grounding with Parallel web search:
\* Gemini 2.5 Flash (`gemini-2.5-flash`)
\* Gemini 2.5 Flash-Lite (`gemini-2.5-flash-lite`)
\* Gemini 2.5 Pro (`gemini-2.5-pro`)
\* Gemini 3.1 Pro (`gemini-3.1-pro-preview`)
\* Gemini 3.1 Flash-Lite (`gemini-3.1-flash-lite`)
\* Gemini 3.5 Flash (`gemini-3.5-flash`)
## Setup

The fastest way to get started is through the Google Cloud Marketplace. This approach requires no API key — authentication is handled automatically through your Google Cloud project.
1. Go to the [Parallel Web Search listing](https://console.cloud.google.com/marketplace/product/parallel-web-systems-public/parallel-web-systems) on Google Cloud Marketplace.
2. Click \*\*Subscribe\*\*.
3. Review the pricing, accept the terms of service, and confirm your subscription.
4. Ensure the subscription is active in the Google Cloud project you plan to use with Gemini Enterprise.
Once subscribed, you can start making grounded requests immediately — no API key is needed in your request body.
For sensitive workloads, a separate [Zero Data Retention (ZDR) offering](https://console.cloud.google.com/marketplace/product/parallel-web-systems-public/parallel-web-systems-zdr) is available on Google Cloud Marketplace. To use ZDR, you must be subscribed to the ZDR offering \*\*and\*\* set `enable\_zero\_data\_retention: true` in your requests (see [Make a grounded request](#make-a-grounded-request)). ZDR is only available through Google Cloud Marketplace.

1. Sign up at [Parallel Platform](https://platform.parallel.ai).
2. Create an API key from your dashboard.
3. Include the API key in your Gemini Enterprise requests.
## Agent Platform Studio
You can also use Parallel as a grounding source directly in the [Agent Platform Studio](https://console.cloud.google.com/agent-platform/studio/multimodal;mode=prompt?model=gemini-3.1-flash-lite\®ion=global) UI (formerly Vertex AI Studio) — no code required. This requires an active Google Cloud Marketplace subscription.
[](https://mintcdn.com/parallel-6fabab31-mtje7p526we/WIFxCwqMrt1Ku5Fv/images/Parallel_AgentPlatformStudio.mp4?fit=max&auto=format&n=WIFxCwqMrt1Ku5Fv&q=85&s=30c3ffbe9c0bd53708a262ebc86d7360)
1. Open [Agent Platform Studio](https://console.cloud.google.com/agent-platform/studio/multimodal;mode=prompt?model=gemini-3.1-flash-lite\®ion=global) in the Google Cloud Console.
2. Select a supported Gemini model.
3. Deselect \*\*Google Search, Maps\*\*, and select \*\*Partners\*\* instead.
4. When the partners modal opens, confirm \*\*Parallel Web Search\*\* by clicking \*\*Apply\*\*.
5. Enter your prompt and send — the model response will be grounded with web results from Parallel.
Agent Platform Studio is a great way to experiment with grounded responses before integrating via the API.
## Make a grounded request
Use the Gemini REST API to request grounded responses from Gemini:
```
POST https://LOCATION-aiplatform.googleapis.com/v1/projects/PROJECT\_ID/locations/LOCATION/publishers/google/models/MODEL\_ID:generateContent
```
\* `PROJECT\_ID`: Your Google Cloud project ID.
\* `LOCATION`: The region to process the request (e.g., `us-central1`). Omit from the endpoint to use the global endpoint.
\* `MODEL\_ID`: The Gemini model to use (e.g., `gemini-3.5-flash`).

No `api\_key` field is needed when using the Marketplace subscription. Set `enable\_zero\_data\_retention` to `true` to use the [ZDR offering](https://console.cloud.google.com/marketplace/product/parallel-web-systems-public/parallel-web-systems-zdr) for the request (requires an active ZDR subscription); if unspecified, the standard offering is used:
```json theme={"system"}
{
"contents": [{
"role": "user",
"parts": [{
"text": "MODEL\_PROMPT\_TEXT"
}]
}],
"tools": [{
"parallelAiSearch": {
"enable\_zero\_data\_retention": ENABLE\_ZERO\_DATA\_RETENTION,
"customConfigs": {
"mode": "MODE",
"location": "SEARCH\_LOCATION",
"max\_results": MAX\_RESULTS,
"source\_policy": {
"exclude\_domains": ["EXCLUDE\_DOMAINS"],
"include\_domains": ["INCLUDE\_DOMAINS"]
},
"excerpts": {
"max\_chars\_per\_result": MAX\_CHARS\_PER\_RESULT,
"max\_chars\_total": MAX\_CHARS\_TOTAL
}
}
}
}],
"model": "projects/PROJECT\_ID/locations/LOCATION/publishers/google/models/MODEL\_ID"
}
```

Include your API key in the `parallelAiSearch` object:
```json theme={"system"}
{
"contents": [{
"role": "user",
"parts": [{
"text": "MODEL\_PROMPT\_TEXT"
}]
}],
"tools": [{
"parallelAiSearch": {
"api\_key": "PARALLEL\_API\_KEY",
"customConfigs": {
"mode": "MODE",
"location": "SEARCH\_LOCATION",
"max\_results": MAX\_RESULTS,
"source\_policy": {
"exclude\_domains": ["EXCLUDE\_DOMAINS"],
"include\_domains": ["INCLUDE\_DOMAINS"]
},
"excerpts": {
"max\_chars\_per\_result": MAX\_CHARS\_PER\_RESULT,
"max\_chars\_total": MAX\_CHARS\_TOTAL
}
}
}
}],
"model": "projects/PROJECT\_ID/locations/LOCATION/publishers/google/models/MODEL\_ID"
}
```
Execute the request:
```bash theme={"system"}
curl -X POST \
-H "Authorization: Bearer $(gcloud auth print-access-token)" \
-H "Content-Type: application/json; charset=utf-8" \
-d @request.json \
"https://LOCATION-aiplatform.googleapis.com/v1/projects/PROJECT\_ID/locations/LOCATION/publishers/google/models/MODEL\_ID:generateContent"
```
If both a Marketplace subscription and an API key are present in a request, the API key takes precedence.
## Configuration options
All `customConfigs` fields are optional. For best performance, use defaults unless you have specific requirements.
In addition, the `parallelAiSearch` object accepts an optional `enable\_zero\_data\_retention` field (a sibling of `customConfigs`, not nested inside it). Set it to `true` to route the request through the [ZDR offering](https://console.cloud.google.com/marketplace/product/parallel-web-systems-public/parallel-web-systems-zdr) for sensitive workloads — this requires an active ZDR subscription on Google Cloud Marketplace and is not available with Bring Your Own Key.
| Parameter | Default | Range | Description |
| ------------------------------- | ---------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `max\_results` | 10 | 1–20 | Number of search results used for grounding |
| `excerpts.max\_chars\_per\_result` | 30,000 | 1,000–100,000 | Maximum characters per excerpt |
| `excerpts.max\_chars\_total` | 100,000 | 1,000–1,000,000 | Maximum total excerpt characters |
| `source\_policy.include\_domains` | — | Up to 10 | Only return results from these domains |
| `source\_policy.exclude\_domains` | — | Up to 10 | Exclude results from these domains |
| `location` | — | ISO 3166-1 alpha-2 | Country code for geo-targeted search results (e.g., `us`) |
| `mode` | `advanced` | `turbo` \| `basic` \| `advanced` | Search mode. Use `turbo` for the lowest latency, or `advanced` (default) for more thorough results at the expense of higher latency. |
For guidance on search queries and configuration, see [Search API Best Practices](/search/best-practices).
For a complete working example, see the [Vertex AI demo](https://github.com/parallel-web/parallel-cookbook/tree/main/python-recipes/vertex\_ai\_demo) in the Parallel Cookbook.
## Quota
The default quota is 200 prompts per minute. If you need higher rate limits, contact your Google account team (Marketplace) or `support@parallel.ai` (BYOK) with your use case and requirements.
## Billing
Using Gemini with Parallel incurs charges from both Gemini token consumption and use of Parallel's Search API.
\* \*\*Google Cloud Marketplace\*\*: Search API charges are consolidated into your Google Cloud billing.
\* \*\*Bring Your Own Key\*\*: Search API charges are billed through [Parallel's pricing](/resources/pricing).
