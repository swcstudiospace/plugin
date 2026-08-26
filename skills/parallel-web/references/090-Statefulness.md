# Statefulness

Source: https://docs.parallel.ai/responses-api/features/statefulness.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Statefulness
> Multi-turn conversations with the Responses API using `previous\_response\_id`
The Responses API is stateful: it supports multi-turn conversations through the standard OpenAI
`previous\_response\_id` parameter. Pass the `id` of a prior response and the model inherits
that conversation's context, so follow-up questions can use pronouns and references
("its population", "the second one") without restating the original question.
## Usage
Create an initial response, then reference its `id` in the follow-up:
```bash cURL theme={"system"}
# First turn
curl https://api.parallel.ai/v1/responses \
-H "Authorization: Bearer $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "parallel",
"input": "What is the capital of Australia?",
"reasoning": {"effort": "low"}
}'
# => {"id": "resp\_abc123", ..., "output": [{"type": "message", "content": [{"type": "output\_text", "text": "Canberra"}]}]}
# Follow-up turn
curl https://api.parallel.ai/v1/responses \
-H "Authorization: Bearer $PARALLEL\_API\_KEY" \
-H "Content-Type: application/json" \
-d '{
"model": "parallel",
"input": "And what is its population?",
"reasoning": {"effort": "low"},
"previous\_response\_id": "resp\_abc123"
}'
```
```python Python theme={"system"}
import os
from openai import OpenAI
client = OpenAI(
api\_key=os.environ["PARALLEL\_API\_KEY"],
base\_url="https://api.parallel.ai/v1",
)
first = client.responses.create(
model="parallel",
input="What is the capital of Australia?",
reasoning={"effort": "low"},
)
print(first.output\_text) # Canberra
follow\_up = client.responses.create(
model="parallel",
input="And what is its population?",
reasoning={"effort": "low"},
previous\_response\_id=first.id,
)
print(follow\_up.output\_text) # Canberra's population is about ...
```
```typescript TypeScript theme={"system"}
import OpenAI from "openai";
const client = new OpenAI({
apiKey: process.env.PARALLEL\_API\_KEY,
baseURL: "https://api.parallel.ai/v1",
});
const first = await client.responses.create({
model: "parallel",
input: "What is the capital of Australia?",
reasoning: { effort: "low" },
});
console.log(first.output\_text); // Canberra
const followUp = await client.responses.create({
model: "parallel",
input: "And what is its population?",
reasoning: { effort: "low" },
previous\_response\_id: first.id,
});
console.log(followUp.output\_text);
```
## Building a research chat loop
Chain each turn to the previous response id to build an interactive research session:
```python Python theme={"system"}
previous\_id = None
while True:
question = input("Ask: ")
response = client.responses.create(
model="parallel",
input=question,
reasoning={"effort": "medium"},
previous\_response\_id=previous\_id,
)
print(response.output\_text)
previous\_id = response.id
```
## Notes
\* Responses are stored server-side to support follow-ups — you don't need to pass
`store: true` (the field is accepted but has no effect; see
[OpenAI Responses Compatibility](/responses-api/openai-compatibility)).
\* Each turn performs fresh web research; the conversation context informs what to research,
and answers stay grounded in live sources.
\* Tiers can vary across turns — for example, open with a `high`-effort research question and
ask cheap `low`-effort follow-ups.
