# Using It as a Research Subagent

Source: https://docs.parallel.ai/responses-api/examples/research-subagent.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Using It as a Research Subagent
> Expose the Responses API as a web-research tool that another LLM can call
A powerful pattern is to let an orchestrator LLM call the Responses API as a
\*\*`web\_research` function tool\*\*: the orchestrator decomposes the user's problem and plans,
and each tool call is delegated to Parallel as a full grounded-research answer. The
orchestrator sees \*\*finished, synthesized answers\*\* — not raw search results — so its job
reduces to planning sub-questions and reconciling what comes back.
## The tool definition
The tool takes a single argument — a complete, self-contained question — and returns an
answer:
```json theme={"system"}
{
"type": "function",
"name": "web\_research",
"description": "Answers a question using the live web. Delegates to an autonomous web-research agent that runs its own multi-step searches, reads pages, cross-checks sources, and returns a synthesized answer (not raw results). A single call already performs thorough multi-hop research, so pass the COMPLETE question in one call and only make focused follow-up calls for parts left unresolved.",
"parameters": {
"type": "object",
"properties": {
"query": {
"type": "string",
"description": "The complete, self-contained natural-language question to answer, including every constraint (dates, units, qualifiers)."
}
},
"required": ["query"]
}
}
```
## Writing the tool description
The tool description is the contract that shapes how the orchestrator uses the tool — it is
the highest-leverage text in this pattern. Best practices:
\* \*\*Say it returns a synthesized answer, not search results.\*\* Orchestrators trained on
`web\_search`-style tools will otherwise issue keyword queries and plan to read results
themselves. Words like "answers a question" and "(not raw results)" flip it into asking
full questions.
\* \*\*Demand the complete, self-contained question.\*\* The subagent has no conversation
context — every constraint (dates, units, qualifiers, ambiguity resolution) must travel
inside the one `query` string. Repeat this in both the tool description and the parameter
description.
\* \*\*Bias toward one thorough call first.\*\* State that a single call already performs
multi-hop research, so the orchestrator doesn't pre-decompose a question the subagent
could answer whole — decomposition should be reserved for genuinely independent parts or
gaps left after the first answer. This is your main lever on cost and latency.
\* \*\*Keep one required parameter.\*\* A single `query` string is hard to misuse. If you want
the orchestrator to control research depth, add an optional `effort` enum
(`low` | `medium` | `high`) with guidance like "use high only for questions that require
extensive research" — and default it to `low` in your handler.
## Executing the tool
The handler is just a Responses API call:
```python Python theme={"system"}
def web\_research(query: str, effort: str = "low") -> dict:
r = parallel.responses.create(
model="parallel", input=query, reasoning={"effort": effort}
)
return {"answer": r.output\_text}
```
## Full orchestrator loop
One client for the orchestrator (here OpenAI), one for the Parallel tool backend:
```python Python theme={"system"}
import json
import os
from openai import OpenAI
orchestrator = OpenAI(api\_key=os.environ["OPENAI\_API\_KEY"])
parallel = OpenAI(
api\_key=os.environ["PARALLEL\_API\_KEY"],
base\_url="https://api.parallel.ai/v1",
)
WEB\_RESEARCH\_TOOL = {
"type": "function",
"name": "web\_research",
"description": (
"Answers a question using the live web. Delegates to an autonomous "
"web-research agent that runs its own multi-step searches, reads pages, "
"cross-checks sources, and returns a synthesized answer (not raw results). "
"A single call already performs thorough multi-hop research, so pass the "
"COMPLETE question in one call and only make focused follow-up calls for "
"parts left unresolved."
),
"parameters": {
"type": "object",
"properties": {
"query": {
"type": "string",
"description": (
"The complete, self-contained natural-language question to "
"answer, including every constraint (dates, units, qualifiers)."
),
}
},
"required": ["query"],
},
}
def web\_research(query: str) -> dict:
r = parallel.responses.create(
model="parallel", input=query, reasoning={"effort": "low"}
)
return {"answer": r.output\_text}
def answer(question: str, max\_tool\_calls: int = 20) -> str:
input\_list = [{"role": "user", "content": question}]
tool\_calls\_used = 0
while True:
# Once the tool budget is spent, force a final answer.
out\_of\_budget = tool\_calls\_used >= max\_tool\_calls
resp = orchestrator.responses.create(
model="gpt-5.5",
input=input\_list,
tools=[WEB\_RESEARCH\_TOOL],
tool\_choice="none" if out\_of\_budget else "auto",
reasoning={"effort": "high"},
)
input\_list += resp.output
final = None
for item in resp.output:
if item.type == "function\_call" and item.name == "web\_research":
tool\_calls\_used += 1
out = web\_research(\*\*json.loads(item.arguments))
input\_list.append({
"type": "function\_call\_output",
"call\_id": item.call\_id,
"output": json.dumps(out),
})
elif item.type == "message":
final = item.content[0].text
if final is not None:
return final
print(answer("Which universities did the 2018 Fields Medalists get their PhDs from?"))
```
## Operational guidance
\* \*\*Execute independent tool calls concurrently.\*\* When a question has independent parts,
the orchestrator should issue those `web\_research` calls in the same turn and your handler
should run them concurrently (e.g. `asyncio.gather`) — wall-clock stays close to a single
call instead of the sum.
\* \*\*Pick the tier per call\*\*: `low` for cheap breadth across many sub-questions, `high` for
the hardest single lookups.
\* \*\*Cap the tool budget\*\* and force a final answer when it is exhausted (as above), so a
runaway orchestrator can't loop indefinitely.
\* The same pattern works with any tool-calling orchestrator — see
[Anthropic Tool Calling](/integrations/anthropic-tool-calling) and
[OpenAI Tool Calling](/integrations/openai-tool-calling) for provider-specific wiring.
## Next steps
\* [Statefulness](/responses-api/features/statefulness) — an alternative to orchestration
when all you need is follow-up questions on a prior answer
