# File Attachments

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/images

---
title: File Attachments
product: vercel
url: /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/images
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/images"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api
- /docs/ai-gateway/sdks-and-apis
related:
[]
summary: Send images and PDF documents as part of your Anthropic API message requests.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# File Attachments
Send images and PDF documents as part of your message request.
Example request
#### cURL
```bash filename="attachments.sh"
PDF\_B64=$(base64 -i document.pdf)
IMAGE\_B64=$(base64 -i image.png)
curl -X POST "https://ai-gateway.vercel.sh/v1/messages" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-opus-5",
"max\_tokens": 1024,
"messages": [
{
"role": "user",
"content": [
{
"type": "document",
"source": {
"type": "base64",
"media\_type": "application/pdf",
"data": "'"$PDF\_B64"'"
}
},
{
"type": "image",
"source": {
"type": "base64",
"media\_type": "image/png",
"data": "'"$IMAGE\_B64"'"
}
},
{
"type": "text",
"text": "What do this document and image show?"
}
]
}
]
}'
```
#### TypeScript
```typescript filename="file-attachment.ts"
import Anthropic from '@anthropic-ai/sdk';
import fs from 'node:fs';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const anthropic = new Anthropic({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh',
});
// Read files as base64
const pdfData = fs.readFileSync('./document.pdf');
const imageData = fs.readFileSync('./image.png');
const pdfBase64 = pdfData.toString('base64');
const imageBase64 = imageData.toString('base64');
const message = await anthropic.messages.create({
model: 'anthropic/claude-opus-5',
max\_tokens: 1024,
messages: [
{
role: 'user',
content: [
{
type: 'document',
source: {
type: 'base64',
media\_type: 'application/pdf',
data: pdfBase64,
},
},
{
type: 'image',
source: {
type: 'base64',
media\_type: 'image/png',
data: imageBase64,
},
},
{
type: 'text',
text: 'Please summarize the PDF and describe the image.',
},
],
},
],
});
console.log('Response:', message.content[0].text);
```
#### Python
```python filename="file-attachment.py"
import os
import base64
import anthropic
api\_key = os.getenv('AI\_GATEWAY\_API\_KEY') or os.getenv('VERCEL\_OIDC\_TOKEN')
client = anthropic.Anthropic(
api\_key=api\_key,
base\_url='https://ai-gateway.vercel.sh'
)
# Read files as base64
with open('./document.pdf', 'rb') as f:
pdf\_base64 = base64.b64encode(f.read()).decode('utf-8')
with open('./image.png', 'rb') as f:
image\_base64 = base64.b64encode(f.read()).decode('utf-8')
message = client.messages.create(
model='anthropic/claude-opus-5',
max\_tokens=1024,
messages=[
{
'role': 'user',
'content': [
{
'type': 'document',
'source': {
'type': 'base64',
'media\_type': 'application/pdf',
'data': pdf\_base64,
},
},
{
'type': 'image',
'source': {
'type': 'base64',
'media\_type': 'image/png',
'data': image\_base64,
},
},
{
'type': 'text',
'text': 'Please summarize the PDF and describe the image.',
},
],
}
],
)
print('Response:', message.content[0].text)
```
### Supported file types
- \*\*Images\*\*: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- \*\*Documents\*\*: `application/pdf`
---
[View full sitemap](/docs/sitemap)
