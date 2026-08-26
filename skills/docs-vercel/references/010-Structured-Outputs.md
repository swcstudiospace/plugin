# Structured Outputs

Source: https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/structured-outputs

---
title: Structured Outputs
product: vercel
url: /docs/ai-gateway/sdks-and-apis/anthropic-messages-api/structured-outputs
canonical\_url: "https://vercel.com/docs/ai-gateway/sdks-and-apis/anthropic-messages-api/structured-outputs"
last\_updated: 2026-07-27
type: conceptual
prerequisites:
- /docs/ai-gateway/sdks-and-apis/anthropic-messages-api
- /docs/ai-gateway/sdks-and-apis
related:
[]
summary: Get JSON responses conforming to a JSON Schema from Anthropic models through AI Gateway.
install\_vercel\_plugin: npx plugins add vercel/vercel-plugin
---
# Structured Outputs
Structured outputs let you constrain model responses to follow a specific JSON Schema, guaranteeing valid, parseable JSON every time. This is useful when you need to extract structured data, build reliable pipelines, or integrate model responses directly into your application.
AI Gateway supports two approaches for structured outputs with Anthropic models:
- \*\*GA API\*\* (`output\_config.format`): The stable, generally available path
- \*\*Beta API\*\* (`output\_format` with the `structured-outputs-2025-11-13` beta header): The original beta path
For full details on structured outputs, see the [Anthropic structured outputs documentation](https://platform.claude.com/docs/en/build-with-claude/structured-outputs).
## Using `output\_config.format` (GA)
The GA API uses the `output\_config.format` field to specify a JSON Schema. No beta header is required.
Example request
#### cURL
```bash filename="structured-output.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/messages" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "anthropic/claude-sonnet-5",
"max\_tokens": 1024,
"messages": [
{
"role": "user",
"content": "Generate a profile for a software engineer in Austin, TX."
}
],
"output\_config": {
"format": {
"type": "json\_schema",
"schema": {
"type": "object",
"additionalProperties": false,
"properties": {
"name": { "type": "string" },
"age": { "type": "number" },
"email": { "type": "string" },
"skills": { "type": "array", "items": { "type": "string" } }
},
"required": ["name", "age", "email", "skills"]
}
}
}
}'
```
#### TypeScript
```typescript filename="structured-output.ts"
import Anthropic from '@anthropic-ai/sdk';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const anthropic = new Anthropic({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh',
});
const personSchema = {
type: 'object',
additionalProperties: false,
properties: {
name: { type: 'string' },
age: { type: 'number' },
email: { type: 'string' },
skills: {
type: 'array',
items: { type: 'string' },
},
},
required: ['name', 'age', 'email', 'skills'],
};
const message = await anthropic.messages.create({
model: 'anthropic/claude-sonnet-5',
max\_tokens: 1024,
messages: [
{
role: 'user',
content: 'Generate a profile for a software engineer in Austin, TX.',
},
],
// @ts-expect-error -- output\_config is not yet in the TS SDK types
output\_config: {
format: {
type: 'json\_schema',
schema: personSchema,
},
},
});
const textBlock = message.content.find((b) => b.type === 'text');
if (textBlock?.type === 'text') {
const person = JSON.parse(textBlock.text);
console.log(person.name, person.skills);
}
```
#### Python
```python filename="structured\_output.py"
import os
import json
import anthropic
api\_key = os.getenv('AI\_GATEWAY\_API\_KEY') or os.getenv('VERCEL\_OIDC\_TOKEN')
client = anthropic.Anthropic(
api\_key=api\_key,
base\_url='https://ai-gateway.vercel.sh'
)
person\_schema = {
'type': 'object',
'additionalProperties': False,
'properties': {
'name': {'type': 'string'},
'age': {'type': 'number'},
'email': {'type': 'string'},
'skills': {
'type': 'array',
'items': {'type': 'string'},
},
},
'required': ['name', 'age', 'email', 'skills'],
}
message = client.messages.create(
model='anthropic/claude-sonnet-5',
max\_tokens=1024,
messages=[
{
'role': 'user',
'content': 'Generate a profile for a software engineer in Austin, TX.'
}
],
output\_config={
'format': {
'type': 'json\_schema',
'schema': person\_schema,
},
},
)
text\_block = next(b for b in message.content if b.type == 'text')
person = json.loads(text\_block.text)
print(person['name'], person['skills'])
```
You can combine `format` with `effort` in the same `output\_config` object:
```typescript
output\_config: {
effort: 'high',
format: {
type: 'json\_schema',
schema: personSchema,
},
},
```
## Using `output\_format` (beta)
The beta API uses the `output\_format` field along with the `structured-outputs-2025-11-13` beta header.
Example request
#### cURL
```bash filename="structured-output-beta.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/messages" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-H "anthropic-beta: structured-outputs-2025-11-13" \
-d '{
"model": "anthropic/claude-sonnet-5",
"max\_tokens": 1024,
"messages": [
{ "role": "user", "content": "Give me a weather forecast for San Francisco, CA." }
],
"output\_format": {
"type": "json\_schema",
"schema": {
"type": "object",
"additionalProperties": false,
"properties": {
"location": { "type": "string" },
"temperature": { "type": "number" },
"conditions": { "type": "string" },
"forecast": {
"type": "array",
"items": {
"type": "object",
"additionalProperties": false,
"properties": {
"day": { "type": "string" },
"high": { "type": "number" },
"low": { "type": "number" },
"conditions": { "type": "string" }
},
"required": ["day", "high", "low", "conditions"]
}
}
},
"required": ["location", "temperature", "conditions", "forecast"]
}
}
}'
```
#### TypeScript
```typescript filename="structured-output-beta.ts"
import Anthropic from '@anthropic-ai/sdk';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const anthropic = new Anthropic({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh',
});
const forecastSchema = {
type: 'object',
additionalProperties: false,
properties: {
location: { type: 'string' },
temperature: { type: 'number' },
conditions: { type: 'string' },
forecast: {
type: 'array',
items: {
type: 'object',
additionalProperties: false,
properties: {
day: { type: 'string' },
high: { type: 'number' },
low: { type: 'number' },
conditions: { type: 'string' },
},
required: ['day', 'high', 'low', 'conditions'],
},
},
},
required: ['location', 'temperature', 'conditions', 'forecast'],
};
const message = await anthropic.messages.create({
model: 'anthropic/claude-sonnet-5',
max\_tokens: 1024,
messages: [
{
role: 'user',
content: 'Give me a weather forecast for San Francisco, CA.',
},
],
// @ts-expect-error -- output\_format is not yet in the TS SDK types
output\_format: {
type: 'json\_schema',
schema: forecastSchema,
},
betas: ['structured-outputs-2025-11-13'],
});
const textBlock = message.content.find((b) => b.type === 'text');
if (textBlock?.type === 'text') {
const forecast = JSON.parse(textBlock.text);
console.log(forecast.location, forecast.temperature);
}
```
#### Python
```python filename="structured\_output\_beta.py"
import os
import json
import anthropic
api\_key = os.getenv('AI\_GATEWAY\_API\_KEY') or os.getenv('VERCEL\_OIDC\_TOKEN')
client = anthropic.Anthropic(
api\_key=api\_key,
base\_url='https://ai-gateway.vercel.sh'
)
forecast\_schema = {
'type': 'object',
'additionalProperties': False,
'properties': {
'location': {'type': 'string'},
'temperature': {'type': 'number'},
'conditions': {'type': 'string'},
'forecast': {
'type': 'array',
'items': {
'type': 'object',
'additionalProperties': False,
'properties': {
'day': {'type': 'string'},
'high': {'type': 'number'},
'low': {'type': 'number'},
'conditions': {'type': 'string'},
},
'required': ['day', 'high', 'low', 'conditions'],
},
},
},
'required': ['location', 'temperature', 'conditions', 'forecast'],
}
message = client.messages.create(
model='anthropic/claude-sonnet-5',
max\_tokens=1024,
messages=[
{
'role': 'user',
'content': 'Give me a weather forecast for San Francisco, CA.'
}
],
extra\_body={
'output\_format': {
'type': 'json\_schema',
'schema': forecast\_schema,
},
},
extra\_headers={
'anthropic-beta': 'structured-outputs-2025-11-13',
},
)
text\_block = next(b for b in message.content if b.type == 'text')
forecast = json.loads(text\_block.text)
print(forecast['location'], forecast['temperature'])
```
## Streaming structured outputs
Structured outputs work with streaming. The model produces valid JSON incrementally, and each `text\_delta` event contains a fragment of the JSON. Accumulate the fragments and parse the complete JSON when the stream ends.
Example request
#### cURL
```bash filename="structured-output-stream.sh"
curl -X POST "https://ai-gateway.vercel.sh/v1/messages" \
-H "Authorization: Bearer $AI\_GATEWAY\_API\_KEY" \
-H "Content-Type: application/json" \
-H "anthropic-beta: structured-outputs-2025-11-13" \
-d '{
"model": "anthropic/claude-sonnet-5",
"max\_tokens": 1024,
"stream": true,
"messages": [
{ "role": "user", "content": "Give me a weather forecast for San Francisco, CA." }
],
"output\_format": {
"type": "json\_schema",
"schema": {
"type": "object",
"additionalProperties": false,
"properties": {
"location": { "type": "string" },
"temperature": { "type": "number" },
"conditions": { "type": "string" },
"forecast": {
"type": "array",
"items": {
"type": "object",
"additionalProperties": false,
"properties": {
"day": { "type": "string" },
"high": { "type": "number" },
"low": { "type": "number" },
"conditions": { "type": "string" }
},
"required": ["day", "high", "low", "conditions"]
}
}
},
"required": ["location", "temperature", "conditions", "forecast"]
}
}
}'
```
#### TypeScript
```typescript filename="structured-output-stream.ts"
import Anthropic from '@anthropic-ai/sdk';
const apiKey = process.env.AI\_GATEWAY\_API\_KEY || process.env.VERCEL\_OIDC\_TOKEN;
const anthropic = new Anthropic({
apiKey,
baseURL: 'https://ai-gateway.vercel.sh',
});
const recipeSchema = {
type: 'object',
additionalProperties: false,
properties: {
name: { type: 'string' },
cuisine: { type: 'string' },
difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
servings: { type: 'number' },
ingredients: {
type: 'array',
items: {
type: 'object',
additionalProperties: false,
properties: {
name: { type: 'string' },
amount: { type: 'string' },
},
required: ['name', 'amount'],
},
},
steps: { type: 'array', items: { type: 'string' } },
},
required: ['name', 'cuisine', 'difficulty', 'servings', 'ingredients', 'steps'],
};
const stream = await anthropic.messages.create({
model: 'anthropic/claude-sonnet-5',
max\_tokens: 2048,
stream: true,
messages: [
{
role: 'user',
content: 'Give me a recipe for classic Italian lasagna.',
},
],
// @ts-expect-error -- output\_format is not yet in the TS SDK types
output\_format: {
type: 'json\_schema',
schema: recipeSchema,
},
betas: ['structured-outputs-2025-11-13'],
});
let fullJson = '';
for await (const event of stream) {
if (
event.type === 'content\_block\_delta' &&
event.delta.type === 'text\_delta'
) {
fullJson += event.delta.text;
}
}
const recipe = JSON.parse(fullJson);
console.log(recipe.name, recipe.cuisine);
```
#### Python
```python filename="structured\_output\_stream.py"
import os
import json
import anthropic
api\_key = os.getenv('AI\_GATEWAY\_API\_KEY') or os.getenv('VERCEL\_OIDC\_TOKEN')
client = anthropic.Anthropic(
api\_key=api\_key,
base\_url='https://ai-gateway.vercel.sh'
)
recipe\_schema = {
'type': 'object',
'additionalProperties': False,
'properties': {
'name': {'type': 'string'},
'cuisine': {'type': 'string'},
'difficulty': {'type': 'string', 'enum': ['easy', 'medium', 'hard']},
'servings': {'type': 'number'},
'ingredients': {
'type': 'array',
'items': {
'type': 'object',
'additionalProperties': False,
'properties': {
'name': {'type': 'string'},
'amount': {'type': 'string'},
},
'required': ['name', 'amount'],
},
},
'steps': {'type': 'array', 'items': {'type': 'string'}},
},
'required': ['name', 'cuisine', 'difficulty', 'servings', 'ingredients', 'steps'],
}
full\_json = ''
with client.messages.stream(
model='anthropic/claude-sonnet-5',
max\_tokens=2048,
messages=[
{
'role': 'user',
'content': 'Give me a recipe for classic Italian lasagna.'
}
],
extra\_body={
'output\_format': {
'type': 'json\_schema',
'schema': recipe\_schema,
},
},
extra\_headers={
'anthropic-beta': 'structured-outputs-2025-11-13',
},
) as stream:
for text in stream.text\_stream:
full\_json += text
recipe = json.loads(full\_json)
print(recipe['name'], recipe['cuisine'])
```
## Response format
When structured outputs are enabled, the model returns valid JSON in a `text` content block:
```json
{
"id": "msg\_123",
"type": "message",
"role": "assistant",
"content": [
{
"type": "text",
"text": "{\"name\":\"Alex Chen\",\"age\":29,\"email\":\"alex@example.com\",\"skills\":[\"TypeScript\",\"React\",\"Node.js\"]}"
}
],
"model": "anthropic/claude-sonnet-5",
"stop\_reason": "end\_turn",
"usage": {
"input\_tokens": 25,
"output\_tokens": 80
}
}
```
## Schema requirements
- Set `additionalProperties: false` on all object types in your schema
- Include a `required` array listing all properties on each object
- Supported types: `string`, `number`, `boolean`, `array`, `object`, and `enum`
> \*\*💡 Note:\*\* For complete schema requirements and best practices, see the [Anthropic structured outputs documentation](https://platform.claude.com/docs/en/build-with-claude/structured-outputs).
---
[View full sitemap](/docs/sitemap)
