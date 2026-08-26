# Distributed RAG with PgVector - Agno

Source: https://docs.agno.com/knowledge/teams/distributed-rag-pgvector

A coordinating team delegates retrieval and response tasks across agents with separate PgVector knowledge tables.

distributed\_rag\_pgvector.py

```
from agno.agent import Agent
from agno.knowledge.embedder.openai import OpenAIEmbedder
from agno.knowledge.knowledge import Knowledge
from agno.models.openai import OpenAIResponses
from agno.team import Team
from agno.vectordb.pgvector import PgVector, SearchType

db_url = "postgresql+psycopg://ai:ai@localhost:5532/ai"

vector_knowledge = Knowledge(
    vector_db=PgVector(
        table_name="recipes_vector",
        db_url=db_url,
        search_type=SearchType.vector,
        embedder=OpenAIEmbedder(id="text-embedding-3-small"),
    ),
)

hybrid_knowledge = Knowledge(
    vector_db=PgVector(
        table_name="recipes_hybrid",
        db_url=db_url,
        search_type=SearchType.hybrid,
        embedder=OpenAIEmbedder(id="text-embedding-3-small"),
    ),
)

vector_retriever = Agent(
    name="Vector Retriever",
    model=OpenAIResponses(id="gpt-5-mini"),
    role="Retrieve information using vector similarity search in PostgreSQL",
    knowledge=vector_knowledge,
    search_knowledge=True,
    instructions=[
        "Search the knowledge base with vector similarity.",
        "Return the matching recipe details and source context.",
    ],
    markdown=True,
)

hybrid_searcher = Agent(
    name="Hybrid Searcher",
    model=OpenAIResponses(id="gpt-5-mini"),
    role="Perform hybrid search combining vector and text search",
    knowledge=hybrid_knowledge,
    search_knowledge=True,
    instructions=[
        "Search the knowledge base with hybrid retrieval.",
        "Return the matching recipe details and source context.",
    ],
    markdown=True,
)

data_validator = Agent(
    name="Data Validator",
    model=OpenAIResponses(id="gpt-5-mini"),
    role="Validate retrieved data quality and relevance",
    instructions=[
        "Compare the retrieved information with the user's question.",
        "Identify conflicts and unsupported details.",
    ],
    markdown=True,
)

response_composer = Agent(
    name="Response Composer",
    model=OpenAIResponses(id="gpt-5-mini"),
    role="Compose responses with source attribution",
    instructions=[
        "Combine the team members' findings.",
        "Cite the supplied sources.",
    ],
    markdown=True,
)

distributed_pgvector_team = Team(
    name="Distributed PgVector RAG Team",
    model=OpenAIResponses(id="gpt-5-mini"),
    members=[vector_retriever, hybrid_searcher, data_validator, response_composer],
    instructions=[
        "Vector Retriever: First perform vector similarity search.",
        "Hybrid Searcher: Then perform hybrid search.",
        "Data Validator: Check the retrieved information for conflicts.",
        "Response Composer: Compose the response with source attribution.",
    ],
    show_members_responses=True,
    markdown=True,
)

if __name__ == "__main__":
    query = "How do I make chicken and galangal in coconut milk soup? What are the key ingredients and techniques?"
    source_url = "https://agno-public.s3.amazonaws.com/recipes/ThaiRecipes.pdf"

    vector_knowledge.insert(name="Thai Recipes Vector", url=source_url)
    hybrid_knowledge.insert(name="Thai Recipes Hybrid", url=source_url)
    distributed_pgvector_team.print_response(input=query)
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

Run PgVector

macOS / Linux

Windows

```
docker run -d \
  -e POSTGRES_DB=ai \
  -e POSTGRES_USER=ai \
  -e POSTGRES_PASSWORD=ai \
  -e PGDATA=/var/lib/postgresql \
  -v pgvolume:/var/lib/postgresql \
  -p 5532:5432 \
  --name pgvector \
  agnohq/pgvector:18
```

```
docker run -d `
  -e POSTGRES_DB=ai `
  -e POSTGRES_USER=ai `
  -e POSTGRES_PASSWORD=ai `
  -e PGDATA=/var/lib/postgresql `
  -v pgvolume:/var/lib/postgresql `
  -p 5532:5432 `
  --name pgvector `
  agnohq/pgvector:18
```

3

Install required libraries

```
uv pip install -U agno openai pgvector psycopg pypdf sqlalchemy
```

4

Export the API key

```
export OPENAI_API_KEY=your_openai_api_key_here
```

5

Run the team

```
python distributed_rag_pgvector.py
```

## [​](#next-steps) Next Steps

| Task | Guide |
| --- | --- |
| Run the pattern with a local vector database | [Distributed RAG with LanceDB](/knowledge/teams/distributed-rag-lancedb) |
| Attach one knowledge base to a team | [Team with Knowledge Base](/knowledge/teams/team-with-knowledge) |

⌘I
