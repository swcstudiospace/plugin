# Assistants migration guide

Source: https://developers.openai.com/api/docs/assistants/migration.md

# Assistants migration guide
> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.
After achieving feature parity in the Responses API, we've deprecated the Assistants API. It will shut down on August 26, 2026. Follow the [migration guide](https://developers.openai.com/platform/assistants/migration) to update your integration. [Learn more](https://platform.openai.com/docs/guides/migrate-to-responses).
We're moving from the Assistants API to the new [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) for a simpler and more flexible mental model.
Responses are simpler—send input items and get output items back. With the Responses API, you also get better performance and new features like [deep research](https://developers.openai.com/api/docs/guides/deep-research), [MCP](https://developers.openai.com/api/docs/guides/tools-connectors-mcp), and [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use). This change also lets you manage conversations instead of passing back `previous\_response\_id`.
### What's changed?

| Before | Now | Why? |
| --- | --- | --- |
| `Assistants` | `Prompts` | Prompts hold configuration (model, tools, instructions) and are easier to version and update |
| `Threads` | `Conversations` | Streams of items instead of just messages |
| `Runs` | `Responses` | Responses send input items or use a conversation object and receive output items; tool call loops are explicitly managed |
| `Run steps` | `Items` | Generalized objects—can be messages, tool calls, outputs, and more |

## From assistants to prompts
Assistants were persistent API objects that bundled model choice, instructions, and tool declarations—created and managed entirely through the API. Their replacement, prompts, can only be created in the dashboard, where you can version them as you develop your product.
### Why this is helpful
- \*\*Portability and versioning\*\*: You can snapshot, review, diff, and roll back prompt specs. You can also version a prompt, so your code can just point the latest version.
- \*\*Separation of concerns\*\*: Your application code now handles orchestration (history pruning, tool loop, retries) while your prompt focuses on high‑level behavior and constraints (system guidance, tool availability, structured output schema, temperature defaults).
- \*\*Realtime compatibility\*\*: The same prompt configuration can be reused when you connect through the Realtime API, giving you a single definition of behavior across chat, streaming, and low‑latency interactive sessions.
- \*\*Tool and output consistency\*\*: Using prompts, every Responses or Realtime session you start inherits a consistent contract because prompts encapsulate tool schemas and structured output expectations.
### Practical migration steps
1. Identify each existing Assistant’s \_instruction + tool\_ bundle.
2. In the dashboard, recreate that bundle as a named prompt.
3. Store the prompt ID (or its exported spec) in source control so application code can refer to a stable identifier.
4. During rollout, run A/B tests by swapping prompt IDs—no need to create or delete assistant objects programmatically.
Think of a prompt as a \*\*versioned behavioral profile\*\* to plug into either Responses or Realtime API.
---
## From threads to conversations
A thread was a collection of messages stored server-side. Threads could \_only\_ store messages. Conversations store items, which can include messages, tool calls, tool outputs, and other data.
### Request example
### Response example
#### Thread object
```json
{
"id": "thread\_CrXtCzcyEQbkAcXuNmVSKFs1",
"object": "thread",
"created\_at": 1752855924,
"metadata": {
"user\_id": "peter\_le\_fleur"
},
"tool\_resources": {}
}
```
#### Conversation object
```json
{
"id": "conv\_68542dc602388199a30af27d040cefd4087a04b576bfeb24",
"object": "conversation",
"created\_at": 1752855924,
"metadata": {
"user\_id": "peter\_le\_fleur"
}
}
```
---
## From runs to responses
Runs were asynchronous processes that executed against threads. See the example below. Responses are simpler: provide a set of input items to execute, and get a list of output items back.
Responses are designed to be used alone, but you can also use them with prompt and conversation objects for storing context and configuration.
### Request example
### Response example
#### Run object
```json
{
"id": "run\_FKIpcs5ECSwuCmehBqsqkORj",
"assistant\_id": "asst\_8fVY45hU3IM6creFkVi5MBKB",
"cancelled\_at": null,
"completed\_at": 1752857327,
"created\_at": 1752857322,
"expires\_at": null,
"failed\_at": null,
"incomplete\_details": null,
"instructions": null,
"last\_error": null,
"max\_completion\_tokens": null,
"max\_prompt\_tokens": null,
"metadata": {},
"model": "gpt-4.1",
"object": "thread.run",
"parallel\_tool\_calls": true,
"required\_action": null,
"response\_format": "auto",
"started\_at": 1752857324,
"status": "completed",
"thread\_id": "thread\_CrXtCzcyEQbkAcXuNmVSKFs1",
"tool\_choice": "auto",
"tools": [],
"truncation\_strategy": {
"type": "auto",
"last\_messages": null
},
"usage": {
"completion\_tokens": 130,
"prompt\_tokens": 34,
"total\_tokens": 164,
"prompt\_token\_details": {
"cached\_tokens": 0
},
"completion\_tokens\_details": {
"reasoning\_tokens": 0
}
},
"temperature": 1.0,
"top\_p": 1.0,
"tool\_resources": {},
"reasoning\_effort": null
}
```
#### Response object
```json
{
"id": "resp\_687a7b53036c819baad6012d58b39bcb074adcd9e24850fc",
"created\_at": 1752857427,
"conversation": {
"id": "conv\_689667905b048191b4740501625afd940c7533ace33a2dab"
},
"error": null,
"incomplete\_details": null,
"instructions": null,
"metadata": {},
"model": "gpt-5.5",
"object": "response",
"output": [
{
"id": "msg\_687a7b542948819ba79e77e14791ef83074adcd9e24850fc",
"content": [
{
"annotations": [],
"text": "The \"5 Ds of Dodgeball\" are a humorous set of rules made famous by the 2004 comedy film \*\*\"Dodgeball: A True Underdog Story.\"\*\* In the movie, dodgeball coach Patches O’Houlihan teaches these basics to his team. The \*\*5 Ds\*\* are:\n\n1. \*\*Dodge\*\*\n2. \*\*Duck\*\*\n3. \*\*Dip\*\*\n4. \*\*Dive\*\*\n5. \*\*Dodge\*\* (yes, dodge is listed twice for emphasis!)\n\nIn summary: \n> \*\*“If you can dodge a wrench, you can dodge a ball!”\*\*\n\nThese 5 Ds are not official competitive rules, but have become a fun and memorable pop culture reference for the sport of dodgeball.",
"type": "output\_text",
"logprobs": []
}
],
"role": "assistant",
"status": "completed",
"type": "message"
}
],
"parallel\_tool\_calls": true,
"temperature": 1.0,
"tool\_choice": "auto",
"tools": [],
"top\_p": 1.0,
"background": false,
"max\_output\_tokens": null,
"previous\_response\_id": null,
"reasoning": {
"effort": null,
"generate\_summary": null,
"summary": null
},
"service\_tier": "scale",
"status": "completed",
"text": {
"format": {
"type": "text"
}
},
"truncation": "disabled",
"usage": {
"input\_tokens": 17,
"input\_tokens\_details": {
"cached\_tokens": 0
},
"output\_tokens": 150,
"output\_tokens\_details": {
"reasoning\_tokens": 0
},
"total\_tokens": 167
},
"user": null,
"max\_tool\_calls": null,
"store": true,
"top\_logprobs": 0
}
```
---
## Migrating your integration
Follow the migration steps below to move from the Assistants API to the Responses API, without losing any feature support.
### 1. Create prompts from your assistants
1. Identify the most important assistant objects in your application.
1. Find these in the dashboard and click `Create prompt`.
This will create a prompt object out of each existing assistant object.
Reusable prompt objects are also being deprecated. If you use this migration
path, review the [prompts deprecation
timeline](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) before adopting
prompt objects in a long-lived integration.
### 2. Move new user chats over to conversations and responses
We will not provide an automated tool for migrating Threads to Conversations. Instead, we recommend migrating new user threads onto conversations and migrating older ones as necessary.
Here's an example for how you might backfill a thread:
```python
import os
from openai import OpenAI
openai = OpenAI()
messages = []
thread\_id = os.environ["OPENAI\_THREAD\_ID"]
for page in openai.beta.threads.messages.list(
thread\_id=thread\_id, order="asc"
).iter\_pages():
messages += page.data
items = []
for m in messages:
item = {"role": m.role}
item\_content = []
for content in m.content:
match content.type:
case "text":
item\_content\_type = "input\_text" if m.role == "user" else "output\_text"
item\_content += [
{"type": item\_content\_type, "text": content.text.value}
]
case "image\_url":
item\_content += [
{
"type": "input\_image",
"image\_url": content.image\_url.url,
"detail": content.image\_url.detail,
}
]
item |= {"content": item\_content}
items.append(item)
# create a conversation with your converted items
conversation = openai.conversations.create(items=items)
```
## Comparing full examples
Here are a few examples of integrations using both the Assistants API and the Responses API so you can see how they compare.
### User chat app
Assistants API
```python
threads\_by\_session: dict[str, str] = {}
@app.post("/messages")
async def message(message: Message):
thread\_id = threads\_by\_session.get(message.session\_id)
if thread\_id is None:
thread\_id = openai.beta.threads.create().id
threads\_by\_session[message.session\_id] = thread\_id
openai.beta.threads.messages.create(
thread\_id=thread\_id,
role="user",
content=message.content,
)
run = openai.beta.threads.runs.create(
assistant\_id=os.environ["OPENAI\_ASSISTANT\_ID"],
thread\_id=thread\_id,
)
while run.status in ("queued", "in\_progress"):
await asyncio.sleep(1)
run = openai.beta.threads.runs.retrieve(
thread\_id=thread\_id,
run\_id=run.id,
)
messages = openai.beta.threads.messages.list(
order="desc",
limit=1,
thread\_id=thread\_id,
)
return {"content": messages.data[0].content}
```
Responses API
```python
conversations\_by\_session: dict[str, str] = {}
@app.post("/messages")
async def message(message: Message):
conversation\_id = conversations\_by\_session.get(message.session\_id)
if conversation\_id is None:
conversation\_id = openai.conversations.create().id
conversations\_by\_session[message.session\_id] = conversation\_id
response = openai.responses.create(
prompt={"id": os.environ["OPENAI\_PROMPT\_ID"]},
input=[{"role": "user", "content": message.content}],
conversation=conversation\_id,
)
return {"content": response.output\_text}
```
