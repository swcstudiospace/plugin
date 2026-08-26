# Structured Outputs

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/openresponses/structured-outputs

---
title: Structured Outputs
product: vercel
url: /docs/ai-gateway/sdks-and-apis/openresponses/structured-outputs
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/openresponses/structured-outputs"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/openresponses
- /docs/ai-gateway/sdks-and-apis
related:
- /docs/ai-gateway/sdks-and-apis/openresponses
- /docs/ai-gateway/sdks-and-apis/openresponses/reasoning
- /docs/ai-gateway/sdks-and-apis/openresponses/tool-calling
- /docs/ai-gateway/sdks-and-apis/openresponses/advanced
summary: Constrain OpenResponses API output to a JSON schema so every response parses.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Structured Outputs
The [OpenResponses API](/docs/ai-gateway/sdks-and-apis/openresponses) can constrain a response to a JSON schema, so you get parseable data instead of prose you have to extract from. Set `text.format` to a `json\_schema` object with your schema, and the model returns JSON matching it.
#### \['cURL'
```bash filename="structured-outputs.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/responses" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "openai/gpt-5.6-sol",
"input": [
{
"type": "message",
"role": "user",
"content": "Extract: John is 30 years old and lives in NYC."
}
],
"text": {
"format": {
"type": "json\_schema",
"name": "person",
"schema": {
"type": "object",
"properties": {
"name": {
"type": "string"
},
"age": {
"type": "integer"
},
"city": {
"type": "string"
}
},
"required": [
"name",
"age",
"city"
],
"additionalProperties": false
}
}
}
}'
```
#### 'TypeScript'
```typescript filename="structured.ts"
const apiKey = process.env.AI\_GATEWAY\_API\_KEY;
const response = await fetch('https://ai-gateway.vercel.sh/v1/responses', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
Authorization: `Bearer ${apiKey}`,
},
body: JSON.stringify({
model: 'openai/gpt-5.6-sol',
input: [
{
type: 'message',
role: 'user',
content: 'Extract: John is 30 years old and lives in NYC.',
},
],
text: {
format: {
type: 'json\_schema',
name: 'person',
schema: {
type: 'object',
properties: {
name: { type: 'string' },
age: { type: 'integer' },
city: { type: 'string' },
},
required: ['name', 'age', 'city'],
additionalProperties: false,
},
},
},
}),
});
const result = await response.json();
const message = result.output.find((item) => item.type === 'message');
console.log(JSON.parse(message.content[0].text));
// { name: 'John', age: 30, city: 'NYC' }
```
#### 'Python']
```python filename="structured.py"
import json
import os
import requests
api\_key = os.environ["AI\_GATEWAY\_API\_KEY"]
response = requests.post(
"https://ai-gateway.vercel.sh/v1/responses",
headers={
"Content-Type": "application/json",
"Authorization": f"Bearer {api\_key}",
},
json={
"model": "openai/gpt-5.6-sol",
"input": [
{
"type": "message",
"role": "user",
"content": "Extract: John is 30 years old and lives in NYC.",
}
],
"text": {
"format": {
"type": "json\_schema",
"name": "person",
"schema": {
"type": "object",
"properties": {
"name": {"type": "string"},
"age": {"type": "integer"},
"city": {"type": "string"},
},
"required": ["name", "age", "city"],
"additionalProperties": False,
},
}
},
},
)
result = response.json()
message = next(item for item in result["output"] if item["type"] == "message")
print(json.loads(message["content"][0]["text"]))
# {'name': 'John', 'age': 30, 'city': 'NYC'}
```
## Reading the response
The JSON arrives as text inside the output message, not as a parsed object. The `output` array can also carry other item types before the message, such as a `reasoning` item on a reasoning model, so find the message by type rather than taking `output[0]`:
```typescript
const message = result.output.find((item) => item.type === 'message');
const data = JSON.parse(message.content[0].text);
```
## Schema requirements
| Field | Required | Notes |
| ----- | -------- | ----- |
| `type` | Yes | Always `json\_schema` |
| `name` | Yes | A name for the schema, such as `person` |
| `schema` | Yes | A JSON Schema object describing the shape you want |
Set `additionalProperties` to `false` and list every property in `required` for the strictest results. Models follow a schema more reliably when each property has a clear name, and when nesting stays shallow.
> \*\*💡 Note:\*\* Schema support varies by model. If a model doesn't support structured outputs,
> the request still succeeds but the response may not match your schema, so parse
> defensively rather than assuming the shape.
## Next steps
- [Reasoning](/docs/ai-gateway/sdks-and-apis/openresponses/reasoning) - Combine a schema with a reasoning model
- [Tool calling](/docs/ai-gateway/sdks-and-apis/openresponses/tool-calling) - Let the model call your functions
- [Advanced](/docs/ai-gateway/sdks-and-apis/openresponses/advanced) - Configure fallbacks and provider-specific settings
---
[View full sitemap](/docs/sitemap)
