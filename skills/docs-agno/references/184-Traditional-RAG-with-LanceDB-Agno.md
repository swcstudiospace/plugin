# Traditional RAG with LanceDB - Agno

Source: https://docs.agno.com/knowledge/agents/traditional-rag-lancedb

For a string-input run, set `add_knowledge_to_context=True` to retrieve before the first model call.

traditional\_rag\_lancedb.py

```
from agno.agent import Agent
from agno.knowledge.embedder.openai import OpenAIEmbedder
from agno.knowledge.knowledge import Knowledge
from agno.models.openai import OpenAIResponses
from agno.vectordb.lancedb import LanceDb, SearchType

knowledge = Knowledge(
    vector_db=LanceDb(
        table_name="recipes",
        uri="tmp/lancedb",
        search_type=SearchType.vector,
        embedder=OpenAIEmbedder(id="text-embedding-3-small"),
    ),
)

agent = Agent(
    model=OpenAIResponses(id="gpt-5.2"),
    knowledge=knowledge,
    add_knowledge_to_context=True,
    search_knowledge=False,
    markdown=True,
)

if __name__ == "__main__":
    knowledge.insert(
        name="Thai Recipes",
        url="https://agno-public.s3.amazonaws.com/recipes/ThaiRecipes.pdf",
    )
    agent.print_response(
        "How do I make chicken and galangal in coconut milk soup?",
        stream=True,
    )
```

## [​](#run-the-agent) Run the Agent

1

Set up your virtual environment

Mac

Windows

```
uv venv --python 3.12
source .venv/bin/activate
```

```
uv venv --python 3.12
.venv\Scripts\activate
```

2

Install dependencies

```
uv pip install -U agno lancedb openai pypdf
```

3

Export the API key

```
export OPENAI_API_KEY=your_openai_api_key_here
```

4

Run the agent

```
python traditional_rag_lancedb.py
```

## [​](#how-it-works) How It Works

1. `add_knowledge_to_context=True` searches with the run’s string input.
2. Returned documents are appended to the user message inside a `<references>` block.
3. `search_knowledge=False` removes the model-callable search tool.

## [​](#next-steps) Next Steps

| Task | Guide |
| --- | --- |
| Let the model choose when to search | [Agentic RAG with LanceDB](/knowledge/agents/agentic-rag-lancedb) |
| Change the retrieval signal | [Search and Retrieval](/knowledge/concepts/search-and-retrieval/overview) |
| Apply metadata filters | [Filtering](/knowledge/concepts/filters/overview) |

⌘I
