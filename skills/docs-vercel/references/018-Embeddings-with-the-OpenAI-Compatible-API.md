# Embeddings with the OpenAI-Compatible API

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions/embeddings

---
title: Embeddings with the OpenAI-Compatible API
product: vercel
url: /docs/ai-gateway/sdks-and-apis/openai-chat-completions/embeddings
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions/embeddings"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/openai-chat-completions
- /docs/ai-gateway/sdks-and-apis
related:
- /docs/ai-gateway/modalities/embeddings
summary: Generate vector embeddings with the OpenAI-compatible /embeddings endpoint through Vercel AI Gateway, including the dimensions parameter and response...
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Embeddings with the OpenAI-Compatible API
Generate vector embeddings from input text using the OpenAI-compatible `/embeddings` endpoint, for semantic search, similarity matching, and retrieval-augmented generation (RAG).
For an overview of embedding models and the AI SDK (`embed`, `embedMany`), see [Embeddings](/docs/ai-gateway/modalities/embeddings). This page covers the OpenAI-compatible REST endpoint.
Endpoint
```
POST /embeddings
```
Example request
#### cURL
```bash filename="embeddings.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/embeddings" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "openai/text-embedding-3-small",
"input": "Sunny day at the beach"
}'
```
#### TypeScript
```typescript filename="embeddings.ts"
import OpenAI from 'openai';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const openai = new OpenAI({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh/v1',
});
const response = await openai.embeddings.create({
model: 'openai/text-embedding-3-small',
input: 'Sunny day at the beach',
});
console.log(response.data[0].embedding);
```
#### Python
```python filename="embeddings.py"
import os
from openai import OpenAI
api\_key = os.getenv("AI\_GATEWAY\_API\_KEY") or os.getenv("VERCEL\_OIDC\_TOKEN")
client = OpenAI(
api\_key=api\_key,
base\_url="https://ai-gateway.vercel.sh/v1",
)
response = client.embeddings.create(
model="openai/text-embedding-3-small",
input="Sunny day at the beach",
)
print(response.data[0].embedding)
```
Response format
```json
{
"object": "list",
"data": [
{
"object": "embedding",
"index": 0,
"embedding": [-0.0038, 0.021, ...]
},
],
"model": "openai/text-embedding-3-small",
"usage": {
"prompt\_tokens": 6,
"total\_tokens": 6
},
"providerMetadata": {
"gateway": {
"routing": { ... }, // Detailed routing info
"cost": "0.00000012"
}
}
}
```
Dimensions parameter
You can set the root-level `dimensions` field (from the [OpenAI Embeddings API spec](https://platform.openai.com/docs/api-reference/embeddings/create)) and the gateway will auto-map it to each provider's expected field; `providerOptions.[provider]` still passes through as-is and isn't required for `dimensions` to work.
#### cURL
```bash filename="embeddings-dimensions.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/embeddings" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "openai/text-embedding-3-small",
"input": "Sunny day at the beach",
"dimensions": 768
}'
```
#### TypeScript
```typescript filename="embeddings-dimensions.ts"
import OpenAI from 'openai';
const openai = new OpenAI({
apiKey: process.env.AI\_GATEWAY\_API\_KEY,
baseURL: 'https://ai-gateway.vercel.sh/v1',
});
const response = await openai.embeddings.create({
model: 'openai/text-embedding-3-small',
input: 'Sunny day at the beach',
dimensions: 768,
});
```
#### Python
```python filename="embeddings-dimensions.py"
import os
from openai import OpenAI
client = OpenAI(
api\_key=os.getenv('AI\_GATEWAY\_API\_KEY'),
base\_url='https://ai-gateway.vercel.sh/v1'
)
response = client.embeddings.create(
model='openai/text-embedding-3-small',
input='Sunny day at the beach',
dimensions=768,
)
```
---
[View full sitemap](/docs/sitemap)
