# Citations

Source: https://docs.parallel.ai/responses-api/features/citations.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Citations
> Source annotations on Responses API answers
Every Responses API answer is grounded in live web research, and the sources are returned as
OpenAI-style `url\_citation` annotations on the output text. Because this is the stock
wire format, existing OpenAI SDK code that reads `content[].annotations` works unchanged.
## Annotation format
Citations appear on the `message` output item's `output\_text` content part. Each annotation
carries the source `url` and `title`, plus `start\_index`/`end\_index` marking the span of
answer text it supports:
```json theme={"system"}
{
"type": "message",
"content": [
{
"type": "output\_text",
"text": "Jensen Huang has been the CEO of Nvidia since April 1993.",
"annotations": [
{
"type": "url\_citation",
"url": "https://nvidianews.nvidia.com/bios/jensen-huang",
"title": "Jensen Huang | NVIDIA Newsroom",
"start\_index": 0,
"end\_index": 56
},
{
"type": "url\_citation",
"url": "https://simplywall.st/stocks/de/semiconductors/etr-nvd/nvidia-shares/management",
"title": "NVIDIA Corporation (NVD) Leadership & Management Team Analysis - Simply Wall St",
"start\_index": 0,
"end\_index": 56
}
]
}
]
}
```
A span may carry multiple citations when several sources support the same claim.
## Reading citations
```python Python theme={"system"}
import os
from openai import OpenAI
client = OpenAI(
api\_key=os.environ["PARALLEL\_API\_KEY"],
base\_url="https://api.parallel.ai/v1",
)
response = client.responses.create(
model="parallel",
input="Who is the current CEO of Nvidia and when did he take the role?",
reasoning={"effort": "low"},
)
for item in response.output:
if item.type == "message":
for part in item.content:
if part.type == "output\_text":
print(part.text)
for a in part.annotations:
print(f" [{a.start\_index}:{a.end\_index}] {a.url}")
```
```typescript TypeScript theme={"system"}
import OpenAI from "openai";
const client = new OpenAI({
apiKey: process.env.PARALLEL\_API\_KEY,
baseURL: "https://api.parallel.ai/v1",
});
const response = await client.responses.create({
model: "parallel",
input: "Who is the current CEO of Nvidia and when did he take the role?",
reasoning: { effort: "low" },
});
for (const item of response.output) {
if (item.type === "message") {
for (const part of item.content) {
if (part.type === "output\_text") {
console.log(part.text);
for (const a of part.annotations) {
console.log(` [${a.start\_index}:${a.end\_index}] ${a.url}`);
}
}
}
}
}
```
## Citations while streaming
With [streaming](/responses-api/features/streaming-events) enabled, each citation arrives as
a standard `response.output\_text.annotation.added` event after the text delta:
```
event: response.output\_text.annotation.added
data: {"annotation": {"type": "url\_citation", "url": "https://…", "title": "…",
"start\_index": 0, "end\_index": 42}, "annotation\_index": 0, …}
```
The final `response.completed` event carries the complete annotations array on the message
content, so non-incremental consumers can also read citations from there.
## Richer evidence
Citations tell you which sources support the answer. If you need per-field evidence with
excerpts, reasoning, and confidence ratings, use the [Task API](/task-api/task-quickstart)'s
[Research Basis](/task-api/guides/access-research-basis).
