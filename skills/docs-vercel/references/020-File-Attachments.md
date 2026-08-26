# File Attachments

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions/images

---
title: File Attachments
product: vercel
url: /docs/ai-gateway/sdks-and-apis/openai-chat-completions/images
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions/images"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/openai-chat-completions
- /docs/ai-gateway/sdks-and-apis
related:
- /docs/ai-gateway/sdks-and-apis/openai-chat-completions/chat-completions
- /docs/ai-gateway/sdks-and-apis/openai-chat-completions/image-generation
summary: Send images and PDF documents to a model using the OpenAI Chat Completions API.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# File Attachments
Send images and PDFs alongside your text prompt by using an array of content parts in place of a plain string. Every part carries its own `type`, so one message can mix text, images, and documents.
Model support varies. Check the [models list](/ai-gateway/models) for a model's input modalities before sending an attachment.
## Image attachments
Send images as part of your chat completion request.
Example request
#### cURL
```bash filename="image-analysis.sh"
IMAGE\_B64=$(base64 -i image.png)
curl -X POST "https://ai-gateway.vercel.sh/v1/chat/completions" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-opus-5",
"messages": [
{
"role": "user",
"content": [
{ "type": "text", "text": "What is in this image?" },
{
"type": "image\_url",
"image\_url": { "url": "data:image/png;base64,'"$IMAGE\_B64"'" }
}
]
}
]
}'
```
#### TypeScript
```typescript filename="image-analysis.ts"
import fs from 'node:fs';
import OpenAI from 'openai';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const openai = new OpenAI({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh/v1',
});
// Read the image file as base64
const imageBuffer = fs.readFileSync('./image.png');
const imageBase64 = imageBuffer.toString('base64');
const completion = await openai.chat.completions.create({
model: 'anthropic/claude-opus-5',
messages: [
{
role: 'user',
content: [
{ type: 'text', text: 'Describe this image in detail.' },
{
type: 'image\_url',
image\_url: {
url: `data:image/png;base64,${imageBase64}`,
detail: 'auto',
},
},
],
},
],
stream: false,
});
console.log('Assistant:', completion.choices[0].message.content);
console.log('Tokens used:', completion.usage);
```
#### Python
```python filename="image-analysis.py"
import os
import base64
from openai import OpenAI
api\_key = os.getenv('AI\_GATEWAY\_API\_KEY') or os.getenv('VERCEL\_OIDC\_TOKEN')
client = OpenAI(
api\_key=api\_key,
base\_url='https://ai-gateway.vercel.sh/v1'
)
# Read the image file as base64
with open('./image.png', 'rb') as image\_file:
image\_base64 = base64.b64encode(image\_file.read()).decode('utf-8')
completion = client.chat.completions.create(
model='anthropic/claude-opus-5',
messages=[
{
'role': 'user',
'content': [
{'type': 'text', 'text': 'Describe this image in detail.'},
{
'type': 'image\_url',
'image\_url': {
'url': f'data:image/png;base64,{image\_base64}',
'detail': 'auto'
}
}
]
}
],
stream=False,
)
print('Assistant:', completion.choices[0].message.content)
print('Tokens used:', completion.usage)
```
## PDF attachments
Send PDF documents as part of your chat completion request.
Example request
#### cURL
```bash filename="pdf-analysis.sh"
PDF\_B64=$(base64 -i document.pdf)
curl -X POST "https://ai-gateway.vercel.sh/v1/chat/completions" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-opus-5",
"messages": [
{
"role": "user",
"content": [
{ "type": "text", "text": "Summarize this document." },
{
"type": "file",
"file": {
"filename": "document.pdf",
"file\_data": "data:application/pdf;base64,'"$PDF\_B64"'"
}
}
]
}
]
}'
```
#### TypeScript
```typescript filename="pdf-analysis.ts"
import fs from 'node:fs';
import OpenAI from 'openai';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const openai = new OpenAI({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh/v1',
});
// Read the PDF file as base64
const pdfBuffer = fs.readFileSync('./document.pdf');
const pdfBase64 = pdfBuffer.toString('base64');
const completion = await openai.chat.completions.create({
model: 'anthropic/claude-opus-5',
messages: [
{
role: 'user',
content: [
{
type: 'text',
text: 'What is the main topic of this document? Please summarize the key points.',
},
{
type: 'file',
file: {
data: pdfBase64,
media\_type: 'application/pdf',
filename: 'document.pdf',
},
},
],
},
],
stream: false,
});
console.log('Assistant:', completion.choices[0].message.content);
console.log('Tokens used:', completion.usage);
```
#### Python
```python filename="pdf-analysis.py"
import os
import base64
from openai import OpenAI
api\_key = os.getenv('AI\_GATEWAY\_API\_KEY') or os.getenv('VERCEL\_OIDC\_TOKEN')
client = OpenAI(
api\_key=api\_key,
base\_url='https://ai-gateway.vercel.sh/v1'
)
# Read the PDF file as base64
with open('./document.pdf', 'rb') as pdf\_file:
pdf\_base64 = base64.b64encode(pdf\_file.read()).decode('utf-8')
completion = client.chat.completions.create(
model='anthropic/claude-opus-5',
messages=[
{
'role': 'user',
'content': [
{
'type': 'text',
'text': 'What is the main topic of this document? Please summarize the key points.'
},
{
'type': 'file',
'file': {
'data': pdf\_base64,
'media\_type': 'application/pdf',
'filename': 'document.pdf'
}
}
]
}
],
stream=False,
)
print('Assistant:', completion.choices[0].message.content)
print('Tokens used:', completion.usage)
```
## Next steps
- [Chat completions](/docs/ai-gateway/sdks-and-apis/openai-chat-completions/chat-completions) - Request and response shapes for text
- [Image generation](/docs/ai-gateway/sdks-and-apis/openai-chat-completions/image-generation) - Generate images rather than send them
---
[View full sitemap](/docs/sitemap)
