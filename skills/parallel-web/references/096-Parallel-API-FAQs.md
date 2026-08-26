# Parallel API FAQs

Source: https://docs.parallel.ai/resources/faqs.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Parallel API FAQs
> Frequently asked questions about Parallel APIs, billing, security, and platform features

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

## Platform
A default API key is generated when you signup to
[Platform](https://platform.parallel.ai). You can create and manage keys via
Settings.

Go to \*\*Platform > Usage\*\* for real-time request counts, and spend.

Owners can invite users under \*\*Settings\*\* in
[Platform](https://platform.parallel.ai). Choose "Admin" or "Member" roles.

Subject to our [Terms of Service](https://www.parallel.ai/customer-terms) -
you own the output you create with Parallel, including the right to reprint,
sell, and merchandise.
## APIs
Yes -- Task Run Results from one execution can map to Task Run Input fields in
another execution. For example, in one Task Run, you can identify the address
of a business using a simple processor. Then, in the next Task Run you
identify additional details about the business, given business name and
address.

Yes, you can do this with [Source Policy](/search/source-policy). This is
available for the Task API and the Search API today.

Parallel is focused on reasoning and retrieval over the public web. For now,
we only access what can be reached on the public web without authentication
(e.g. signing in with credentials).

Our strength is reasoning and retrieval over text. We can recognize some
on‑page images (e.g. detect customer logos), but we don't accept images as
inputs or return them as outputs yet.

| \*\*API\*\* | \*\*Default Rate Limit\*\* |
| --------- | ---------------------- |
| Tasks | 2000 per min |
| Web Tools | 600 per min |
| Chat | 300 per min |
| FindAll | 300 per hour |
| Monitor | 300 per min |

With the Task API, our web research is up to date to the current day. We are
able to access live web links at the time of your query to ensure data is as
real time as possible. For lower end processors in the Search API and Chat
API, our systems prioritize reduced latency over freshness.

Parallel focuses on public web information. You can pass private data into a
task as an input variable or post‑process the output on your side, but we
don't pull it natively.
## Billing & Payments
Parallel Processors incorporate usage-based pricing. All pricing details for
API and Processor are available [here](https://parallel.ai/pricing).
## Security & Compliance
Yes. Parallel is SOC-II Type 1 and Type II certified as of April 2025. Email
us at [partnerships@parallel.ai](mailto:partnerships@parallel.ai) to request
access to our full report in Trust Center.

All data is encrypted in transit (TLS 1.2+) and at rest in US-based data
centers.

No. Parallel focuses on public web information. You can pass private data into
a task as an input variable or post‑process the output on your side, but we
don't pull it natively. In the future we plan on building tools that will
allow you to more easily point Parallel to your own sources.

Private‑cloud and on‑prem options are available for qualified enterprise
customers—ask our team at
[partnerships@parallel.ai](mailto:partnerships@parallel.ai).

Never. Inputs and outputs remain yours. We do not use customer data to train
any models. See our [Terms of Service](https://www.parallel.ai/customer-terms)
for details.
