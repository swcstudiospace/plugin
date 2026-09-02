# Node kinds and fallback graph (vendored from swcstudiospace/plugin)

Pinned: swcstudiospace/plugin@c1742dbed157bbb24279a5c3a45c10dc0fa59663
runtime_fetch: false

Source: src/think/types.ts plus normalizeGraph in src/think/graph.ts

MIN_NODES = 3
MAX_NODES = 8

Closed enum. Do not invent kinds such as security or web3.

- understand
- decompose
- generate
- compare
- critique
- aggregate
- refine
- synthesize

Normalize rules (match src/think/graph.ts):

- Drop entries that are not objects.
- id defaults to n{index+1}. Deduplicate ids (first wins).
- Unknown kind becomes first node understand, others generate.
- depends_on accepts array or comma/space string. Keep only ids that exist and are not self.
- Stop adding nodes at MAX_NODES.
- If valid nodes < MIN_NODES, replace the whole graph with FALLBACK_GRAPH.
- Force the last remaining node kind to synthesize.
- Topo-sort before filling. Append leftover nodes if a cycle slipped through.

## FALLBACK_GRAPH

Use when the planner throws, returns unparseable JSON, or yields fewer than minNodes (default 3) valid nodes.

```json
{
  "goal": "Understand the request, decompose it, weigh approaches, and produce an execution plan",
  "nodes": [
    {
      "id": "n1",
      "title": "Understand",
      "kind": "understand",
      "question": "What is the user actually asking for, including implicit goals and quality bar?",
      "depends_on": []
    },
    {
      "id": "n2",
      "title": "Decompose",
      "kind": "decompose",
      "question": "What subproblems must be solved, in what order, and what does each depend on?",
      "depends_on": ["n1"]
    },
    {
      "id": "n3",
      "title": "Approaches",
      "kind": "generate",
      "question": "What are 2-3 viable approaches and the tradeoffs of each for this specific task?",
      "depends_on": ["n2"]
    },
    {
      "id": "n4",
      "title": "Risks",
      "kind": "critique",
      "question": "What could go wrong: missing constraints, edge cases, regressions, or over-scoping?",
      "depends_on": ["n3"]
    },
    {
      "id": "n5",
      "title": "Plan",
      "kind": "synthesize",
      "question": "What is the concrete execution plan for the coding agent, in order?",
      "depends_on": ["n4"]
    }
  ]
}
```

Audit fallback graphs as `source: fallback`. Never present them as model-produced.
