# Agent with Knowledge

Source: https://docs.agno.com/agents/usage/agent-with-knowledge.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Agent with Knowledge
> Give your agent a searchable knowledge base (Agentic RAG).
Knowledge gives your agent information it can search at runtime. This pattern is known as Agentic RAG. The agent decides when to search based on the user's question.

```python agent\_with\_knowledge.py theme={null}
from agno.agent import Agent
from agno.knowledge.embedder.openai import OpenAIEmbedder
from agno.knowledge.knowledge import Knowledge
from agno.models.openai import OpenAIResponses
from agno.vectordb.lancedb import LanceDb, SearchType
knowledge = Knowledge(
vector\_db=LanceDb(
uri="tmp/lancedb",
table\_name="recipes",
search\_type=SearchType.hybrid,
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
agent.print\_response("How do I make Pad Thai?", stream=True)
agent.print\_response("What ingredients do I need for green curry?", stream=True)
```

```bash theme={null}
uv pip install -U agno openai lancedb pypdf
```

```bash Mac/Linux theme={null}
export OPENAI\_API\_KEY="your\_openai\_api\_key\_here"
```
```powershell Windows theme={null}
$Env:OPENAI\_API\_KEY="your\_openai\_api\_key\_here"
```

```bash theme={null}
python agent\_with\_knowledge.py
```
## How It Works
1. \*\*Knowledge base:\*\* Documents are chunked, embedded, and stored in a vector database
2. \*\*Search:\*\* Agent searches the knowledge base using hybrid search (semantic + keyword)
3. \*\*Context:\*\* Relevant chunks are added to context before generating a response
## Adding Different Content Types
```python theme={null}
# From a URL
knowledge.insert(url="https://example.com/document.pdf")
# From a local file
knowledge.insert(path="./documents/guide.pdf")
# From text
knowledge.insert(text\_content="Your content here...")
```
