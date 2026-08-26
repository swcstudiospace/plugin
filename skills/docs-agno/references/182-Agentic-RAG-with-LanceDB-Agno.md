# Agentic RAG with LanceDB - Agno

Source: https://docs.agno.com/knowledge/agents/agentic-rag-lancedb

Implement Agentic RAG using the LanceDB vector database with OpenAI embeddings. The agent searches the knowledge base and retrieves relevant information dynamically.

## [​](#code) Code

agentic\_rag\_lancedb.py

```
"""
1. Run: `pip install openai lancedb pypdf agno` to install the dependencies
2. Run: `python agentic_rag_lancedb.py` to run the agent
"""

from agno.agent import Agent
from agno.knowledge.embedder.openai import OpenAIEmbedder
from agno.knowledge.knowledge import Knowledge
from agno.models.openai import OpenAIResponses
from agno.vectordb.lancedb import LanceDb, SearchType

knowledge = Knowledge(
    # Use LanceDB as the vector database and store embeddings in the `recipes` table
    vector_db=LanceDb(
        table_name="recipes",
        uri="tmp/lancedb",
        search_type=SearchType.vector,
        embedder=OpenAIEmbedder(id="text-embedding-3-small"),
    ),
)

knowledge.insert(
    url="https://agno-public.s3.amazonaws.com/recipes/ThaiRecipes.pdf"
)

agent = Agent(
    model=OpenAIResponses(id="gpt-5.2"),
    knowledge=knowledge,
    # Add a tool to search the knowledge base which enables agentic RAG.
    # This is enabled by default when `knowledge` is provided to the Agent.
    search_knowledge=True,
    markdown=True,
)
agent.print_response(
    "How do I make chicken and galangal in coconut milk soup", stream=True
)
```

## [​](#usage) Usage

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
uv pip install -U agno openai lancedb pypdf
```

3

Export your OpenAI API key

```
export OPENAI_API_KEY=your_openai_api_key_here
```

4

Run Agent

```
python agentic_rag_lancedb.py
```

## [​](#next-steps) Next Steps

| Task | Guide |
| --- | --- |
| Retrieve before the first model call instead | [Traditional RAG with LanceDB](/knowledge/agents/traditional-rag-lancedb) |
| Change the retrieval signal | [Search and Retrieval](/knowledge/concepts/search-and-retrieval/overview) |
| Apply metadata filters | [Filtering](/knowledge/concepts/filters/overview) |

⌘I
