# File Attachments

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/responses/images

---
title: File Attachments
product: vercel
url: /docs/ai-gateway/sdks-and-apis/responses/images
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/responses/images"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/responses
- /docs/ai-gateway/sdks-and-apis
related:
- /docs/ai-gateway/sdks-and-apis/responses/text-generation
- /docs/ai-gateway/sdks-and-apis/responses/tool-calling
summary: Send images and PDF documents for analysis using the OpenAI Responses API through AI Gateway.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# File Attachments
Vision-capable models accept images and PDFs alongside your prompt. Replace the plain string in `input` with an array of content parts: `input\_text` for the prompt, `input\_image` for an image, `input\_file` for a document.
#### \['cURL'
```bash filename="image-input.sh"
curl https://ai-gateway.vercel.sh/v1/responses \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-opus-5",
"input": [
{
"role": "user",
"content": [
{ "type": "input\_text", "text": "Describe this image in one sentence." },
{
"type": "input\_image",
"image\_url": "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon\_light\_background.png",
"detail": "auto"
}
]
}
]
}'
```
#### 'TypeScript'
```typescript filename="image-input.ts"
import OpenAI from 'openai';
const client = new OpenAI({
apiKey: process.env.AI\_GATEWAY\_API\_KEY,
baseURL: 'https://ai-gateway.vercel.sh/v1',
});
const response = await client.responses.create({
model: 'anthropic/claude-opus-5',
input: [
{
role: 'user',
content: [
{ type: 'input\_text', text: 'Describe this image in one sentence.' },
{
type: 'input\_image',
image\_url:
'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon\_light\_background.png',
detail: 'auto',
},
],
},
],
});
console.log(response.output\_text);
```
#### 'Python']
```python filename="image\_input.py"
import os
from openai import OpenAI
client = OpenAI(
api\_key=os.getenv('AI\_GATEWAY\_API\_KEY'),
base\_url='https://ai-gateway.vercel.sh/v1',
)
response = client.responses.create(
model='anthropic/claude-opus-5',
input=[
{
'role': 'user',
'content': [
{'type': 'input\_text', 'text': 'Describe this image in one sentence.'},
{
'type': 'input\_image',
'image\_url': 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon\_light\_background.png',
'detail': 'auto',
},
],
},
],
)
print(response.output\_text)
```
## Base64-encoded images
For images that are not publicly reachable, send a data URI instead of a URL. The gateway forwards it to the provider, so no fetch happens from the provider's side:
```typescript filename="image-base64.ts"
import fs from 'node:fs';
import OpenAI from 'openai';
const client = new OpenAI({
apiKey: process.env.AI\_GATEWAY\_API\_KEY,
baseURL: 'https://ai-gateway.vercel.sh/v1',
});
const imageBase64 = fs.readFileSync('./diagram.png').toString('base64');
const response = await client.responses.create({
model: 'anthropic/claude-opus-5',
input: [
{
role: 'user',
content: [
{ type: 'input\_text', text: 'What does this diagram show?' },
{
type: 'input\_image',
image\_url: `data:image/png;base64,${imageBase64}`,
detail: 'auto',
},
],
},
],
});
```
A URL source must be reachable without authentication. If the host blocks the request, the gateway returns a 400 naming the upstream status rather than falling back, so use base64 for anything behind a login or a signed URL.
## PDF documents
Send a PDF with an `input\_file` part. The model reads the document's text directly rather than working from a rasterized page:
#### \['cURL'
```bash filename="pdf-input.sh"
PDF\_B64=$(base64 -i report.pdf)
curl https://ai-gateway.vercel.sh/v1/responses \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-opus-5",
"input": [
{
"role": "user",
"content": [
{ "type": "input\_text", "text": "What total does this document state?" },
{
"type": "input\_file",
"filename": "report.pdf",
"file\_data": "data:application/pdf;base64,'"$PDF\_B64"'"
}
]
}
]
}'
```
#### 'TypeScript'
```typescript filename="pdf-input.ts"
import fs from 'node:fs';
import OpenAI from 'openai';
const client = new OpenAI({
apiKey: process.env.AI\_GATEWAY\_API\_KEY,
baseURL: 'https://ai-gateway.vercel.sh/v1',
});
const pdfBase64 = fs.readFileSync('./report.pdf').toString('base64');
const response = await client.responses.create({
model: 'anthropic/claude-opus-5',
input: [
{
role: 'user',
content: [
{ type: 'input\_text', text: 'What total does this document state?' },
{
type: 'input\_file',
filename: 'report.pdf',
file\_data: `data:application/pdf;base64,${pdfBase64}`,
},
],
},
],
});
console.log(response.output\_text);
```
#### 'Python']
```python filename="pdf\_input.py"
import base64
import os
from openai import OpenAI
client = OpenAI(
api\_key=os.getenv('AI\_GATEWAY\_API\_KEY'),
base\_url='https://ai-gateway.vercel.sh/v1',
)
with open('report.pdf', 'rb') as f:
pdf\_base64 = base64.b64encode(f.read()).decode()
response = client.responses.create(
model='anthropic/claude-opus-5',
input=[
{
'role': 'user',
'content': [
{'type': 'input\_text', 'text': 'What total does this document state?'},
{
'type': 'input\_file',
'filename': 'report.pdf',
'file\_data': f'data:application/pdf;base64,{pdf\_base64}',
},
],
},
],
)
print(response.output\_text)
```
## Detail parameter
`detail` controls the resolution the model analyzes the image at:
- `auto` - Let the model decide
- `low` - Lower resolution, fewer input tokens, faster
- `high` - Higher resolution, more input tokens, better for small text and fine detail
## Next steps
- [Text generation](/docs/ai-gateway/sdks-and-apis/responses/text-generation) - Request and response shapes for text
- [Tool calling](/docs/ai-gateway/sdks-and-apis/responses/tool-calling) - Let the model call your functions
---
[View full sitemap](/docs/sitemap)
