# Agent with Knowledge - Agno

Source: https://docs.agno.com/agents/usage/agent-with-knowledge

Knowledge gives your agent information it can search at runtime. This pattern is known as Agentic RAG. The agent decides when to search based on the user’s question.

1

Create a Python file

agent\_with\_knowledge.py

```
from agno.agent import Agent
from agno.knowledge.embedder.openai import OpenAIEmbedder
from agno.knowledge.knowledge import Knowledge
from agno.models.openai import OpenAIResponses
from agno.vectordb.lancedb import LanceDb, SearchType

knowledge = Knowledge(
    vector_db=LanceDb(
        uri="tmp/lancedb",
        table_name="recipes",
        search_type=SearchType.hybrid,
        embedder=OpenAIEmbedder(id="text-embedding-3-small"),
    ),
)

# Load a PDF into the knowledge base
knowledge.insert(
    url="https://agno-public.s3.amazonaws.com/recipes/ThaiRecipes.pdf",
)

agent = Agent(
    model=OpenAIResponses(id="gpt-5.2"),
    knowledge=knowledge,
    instructions="Search your knowledge base for Thai recipes. Be concise.",
    markdown=True,
)

agent.print_response("How do I make Pad Thai?", stream=True)
agent.print_response("What ingredients do I need for green curry?", stream=True)
```

2

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

3

Install dependencies

```
uv pip install -U agno openai lancedb pypdf
```

4

Export your OpenAI API key

Mac/Linux

Windows

```
export OPENAI_API_KEY="your_openai_api_key_here"
```

```
$Env:OPENAI_API_KEY="your_openai_api_key_here"
```

5

Run Agent

```
python agent_with_knowledge.py
```

## [​](#how-it-works) How It Works

1. **Knowledge base:** Documents are chunked, embedded, and stored in a vector database
2. **Search:** Agent searches the knowledge base using hybrid search (semantic + keyword)
3. **Context:** Relevant chunks are added to context before generating a response

## [​](#adding-different-content-types) Adding Different Content Types

```
# From a URL
knowledge.insert(url="https://example.com/document.pdf")

# From a local file
knowledge.insert(path="./documents/guide.pdf")

# From text
knowledge.insert(text_content="Your content here...")
```

⌘I
