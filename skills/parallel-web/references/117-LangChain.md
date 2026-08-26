# LangChain

Source: https://docs.parallel.ai/integrations/langchain.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# LangChain
> LangChain integrations for Parallel, enabling real-time web research and AI capabilities

For AI agents: a documentation index is available at [https://docs.parallel.ai/llms.txt](https://docs.parallel.ai/llms.txt). The full text of all docs is at [https://docs.parallel.ai/llms-full.txt](https://docs.parallel.ai/llms-full.txt). You may also fetch any page as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.

Add Parallel's search and extract tools and search-powered chat model to your LangChain applications.
 View the complete repository for this integration [here](https://github.com/parallel-web/langchain-parallel)
## Features
\* \*\*Chat Models\*\*: `ChatParallelWeb` - Real-time web research chat completions
\* \*\*Search Tools\*\*: `ParallelWebSearchTool` - Direct access to Parallel's Search API
\* \*\*Extract Tools\*\*: `ParallelExtractTool` - Clean content extraction from web pages
\* \*\*Streaming Support\*\*: Real-time response streaming
\* \*\*Async/Await\*\*: Full asynchronous operation support
\* \*\*OpenAI Compatible\*\*: Uses familiar OpenAI SDK patterns
\* \*\*LangChain Integration\*\*: Seamless integration with LangChain ecosystem
## Installation
```bash theme={"system"}
pip install langchain-parallel
```
## Setup
1. Get your API key from [Parallel](https://platform.parallel.ai)
2. Set your API key as an environment variable:
```bash theme={"system"}
export PARALLEL\_API\_KEY="your-api-key-here"
```
## Chat Models
### ChatParallelWeb
The `ChatParallelWeb` class provides access to Parallel's Chat API, which combines language models with real-time web research capabilities.
#### Basic Usage
```python theme={"system"}
from langchain\_core.messages import HumanMessage, SystemMessage
from langchain\_parallel.chat\_models import ChatParallelWeb
# Initialize the chat model
chat = ChatParallelWeb(
model="speed", # Parallel's chat model
temperature=0.7, # Optional: ignored by Parallel
max\_tokens=None, # Optional: ignored by Parallel
)
# Create messages
messages = [
SystemMessage(content="You are a helpful assistant with access to real-time web information."),
HumanMessage(content="What are the latest developments in artificial intelligence?")
]
# Get response
response = chat.invoke(messages)
print(response.content)
```
#### Streaming Responses
```python theme={"system"}
# Stream responses for real-time output
for chunk in chat.stream(messages):
if chunk.content:
print(chunk.content, end="", flush=True)
```
#### Async Operations
```python theme={"system"}
import asyncio
async def main():
# Async invoke
response = await chat.ainvoke(messages)
print(response.content)
# Async streaming
async for chunk in chat.astream(messages):
if chunk.content:
print(chunk.content, end="", flush=True)
asyncio.run(main())
```
#### Conversation Context
```python theme={"system"}
# Maintain conversation history
messages = [
SystemMessage(content="You are a helpful assistant.")
]
# First turn
messages.append(HumanMessage(content="What is machine learning?"))
response = chat.invoke(messages)
messages.append(response) # Add assistant response
# Second turn with context
messages.append(HumanMessage(content="How does it work?"))
response = chat.invoke(messages)
print(response.content)
```
#### Configuration Options
| Parameter | Type | Default | Description |
| ------------- | -------------------- | --------------------------- | --------------------------------------------------------- |
| `model` | str | `"speed"` | Parallel model name |
| `api\_key` | Optional\[SecretStr] | None | API key (uses `PARALLEL\_API\_KEY` env var if not provided) |
| `base\_url` | str | `"https://api.parallel.ai"` | API base URL |
| `temperature` | Optional\[float] | None | Sampling temperature (ignored by Parallel) |
| `max\_tokens` | Optional\[int] | None | Max tokens (ignored by Parallel) |
| `timeout` | Optional\[float] | None | Request timeout |
| `max\_retries` | int | 2 | Max retry attempts |
### Real-Time Web Research
Parallel's Chat API provides real-time access to web information, making it perfect for:
\* \*\*Current Events\*\*: Get up-to-date information about recent events
\* \*\*Market Data\*\*: Access current stock prices, market trends
\* \*\*Research\*\*: Find the latest research papers, developments
\* \*\*Weather\*\*: Get current weather conditions
\* \*\*News\*\*: Access breaking news and recent articles
```python theme={"system"}
# Example: Current events
messages = [
SystemMessage(content="You are a research assistant with access to real-time web data."),
HumanMessage(content="What happened in the stock market today?")
]
response = chat.invoke(messages)
print(response.content) # Gets real-time market information
```
### Integration with LangChain
#### Chains
```python theme={"system"}
from langchain\_core.prompts import ChatPromptTemplate
from langchain\_core.output\_parsers import StrOutputParser
# Create a chain
prompt = ChatPromptTemplate.from\_messages([
("system", "You are a helpful research assistant with access to real-time web information."),
("human", "{question}")
])
chain = prompt | chat | StrOutputParser()
# Use the chain
result = chain.invoke({"question": "What are the latest AI breakthroughs?"})
print(result)
```
#### Agents
```python theme={"system"}
from langchain.agents import create\_openai\_functions\_agent, AgentExecutor
from langchain\_core.prompts import ChatPromptTemplate
# Create an agent with web research capabilities
prompt = ChatPromptTemplate.from\_messages([
("system", "You are a helpful assistant with access to real-time web information."),
("human", "{input}"),
("placeholder", "{agent\_scratchpad}"),
])
# Use with tools for additional capabilities
# agent = create\_openai\_functions\_agent(chat, tools, prompt)
# agent\_executor = AgentExecutor(agent=agent, tools=tools)
```
## Search API
The Search API provides direct access to Parallel's web search capabilities, returning structured, compressed excerpts optimized for LLM consumption.
### ParallelWebSearchTool
The search tool provides direct access to Parallel's Search API:
```python theme={"system"}
from langchain\_parallel import ParallelWebSearchTool
# Initialize the search tool
search\_tool = ParallelWebSearchTool()
# Search with queries and an objective
result = search\_tool.invoke({
"search\_queries": [
"renewable energy technology developments 2026",
"renewable energy policy updates 2026"
],
"objective": "What are the latest developments in renewable energy?",
"mode": "advanced"
})
print(result)
# {
# "search\_id": "search\_123...",
# "results": [
# {
# "url": "https://example.com/renewable-energy",
# "title": "Latest Renewable Energy Developments",
# "excerpts": [
# "Solar energy has seen remarkable growth...",
# "Wind power capacity increased by 15%..."
# ]
# }
# ]
# }
```
#### Search API Configuration
| Parameter | Type | Default | Description |
| ---------------- | -------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `objective` | Optional\[str] | None | Natural-language description of research goal |
| `search\_queries` | List\[str] | Required | Specific search queries (1-5 queries, 200 chars each) |
| `max\_results` | int | 10 | Maximum requested results. The Search API caps results at 20 and reduces higher values with a warning |
| `excerpts` | Optional\[dict] | None | Excerpt settings (e.g., `{'max\_chars\_per\_result': 1500}`) |
| `mode` | Optional\[str] | None | Search mode: 'turbo' for the lowest latency and cost, 'basic' for quick retrieval, 'advanced' (default) for the highest-quality results |
| `fetch\_policy` | Optional\[dict] | None | Policy for cached vs live content (e.g., `{'max\_age\_seconds': 86400, 'timeout\_seconds': 60}`) |
| `api\_key` | Optional\[SecretStr] | None | API key (uses env var if not provided) |
| `base\_url` | str | `"https://api.parallel.ai"` | API base URL |
`turbo` mode requires `langchain-parallel` v0.5.0 or later.
#### Search with Specific Queries
You can provide specific search queries instead of an objective:
```python theme={"system"}
# Search with specific queries
result = search\_tool.invoke({
"search\_queries": [
"renewable energy 2024",
"solar power developments",
"wind energy statistics"
],
"mode": "advanced"
})
```
#### Tool Usage in Agents
The search tool works seamlessly with LangChain agents:
```python theme={"system"}
from langchain.agents import create\_openai\_functions\_agent, AgentExecutor
from langchain\_core.prompts import ChatPromptTemplate
# Create agent with search capabilities
tools = [search\_tool]
prompt = ChatPromptTemplate.from\_messages([
("system", "You are a research assistant. Use the search tool to find current information."),
("human", "{input}"),
("placeholder", "{agent\_scratchpad}"),
])
agent = create\_openai\_functions\_agent(chat, tools, prompt)
agent\_executor = AgentExecutor(agent=agent, tools=tools)
# Run the agent
result = agent\_executor.invoke({
"input": "What are the latest developments in artificial intelligence?"
})
print(result["output"])
```
## Extract API
The Extract API provides clean content extraction from web pages, returning structured markdown-formatted content optimized for LLM consumption.
### ParallelExtractTool
The extract tool extracts clean, structured content from web pages:
```python theme={"system"}
from langchain\_parallel import ParallelExtractTool
# Initialize the extract tool
extract\_tool = ParallelExtractTool()
# Extract from a single URL
result = extract\_tool.invoke({
"urls": ["https://en.wikipedia.org/wiki/Artificial\_intelligence"]
})
print(result)
# [
# {
# "url": "https://en.wikipedia.org/wiki/Artificial\_intelligence",
# "title": "Artificial intelligence - Wikipedia",
# "content": "# Artificial intelligence\n\nMain content in markdown...",
# "publish\_date": "2024-01-15" # Optional
# }
# ]
```
#### Extract with Search Objective and Advanced Options
Focus extraction on specific topics using search objectives, with control over excerpts and fetch policy:
```python theme={"system"}
# Extract content focused on a specific objective with excerpt settings
result = extract\_tool.invoke({
"urls": ["https://en.wikipedia.org/wiki/Artificial\_intelligence"],
"search\_objective": "What are the main applications and ethical concerns of AI?",
"excerpts": {"max\_chars\_per\_result": 2000},
"full\_content": False,
"fetch\_policy": {
"max\_age\_seconds": 86400,
"timeout\_seconds": 60,
"disable\_cache\_fallback": False
}
})
# Returns relevant excerpts focused on the objective
print(result[0]["excerpts"]) # List of relevant text excerpts
```
#### Extract with Search Queries
Extract content relevant to specific search queries:
```python theme={"system"}
# Extract content focused on specific queries
result = extract\_tool.invoke({
"urls": [
"https://en.wikipedia.org/wiki/Machine\_learning",
"https://en.wikipedia.org/wiki/Deep\_learning"
],
"search\_queries": ["neural networks", "training algorithms", "applications"],
"excerpts": True
})
for item in result:
print(f"Title: {item['title']}")
print(f"Relevant excerpts: {len(item['excerpts'])}")
print()
```
#### Content Length Control
```python theme={"system"}
# Control full content length per extraction
result = extract\_tool.invoke({
"urls": ["https://en.wikipedia.org/wiki/Quantum\_computing"],
"full\_content": {"max\_chars\_per\_result": 3000}
})
print(f"Content length: {len(result[0]['content'])} characters")
```
#### Extract API Configuration
| Parameter | Type | Default | Description |
| ----------------------- | --------------------------------- | --------------------------- | -------------------------------------------------------------------- |
| `urls` | List\[str] | Required | List of URLs to extract content from |
| `search\_objective` | Optional\[str] | None | Natural language objective to focus extraction |
| `search\_queries` | Optional\[List\[str]] | None | Specific keyword queries to focus extraction |
| `excerpts` | Union\[bool, ExcerptSettings] | True | Include relevant excerpts (focused on objective/queries if provided) |
| `full\_content` | Union\[bool, FullContentSettings] | False | Include full page content |
| `fetch\_policy` | Optional\[FetchPolicy] | None | Cache vs live content policy |
| `max\_chars\_per\_extract` | Optional\[int] | None | Maximum characters per extraction (tool-level setting) |
| `api\_key` | Optional\[SecretStr] | None | API key (uses env var if not provided) |
| `base\_url` | str | `"https://api.parallel.ai"` | API base URL |
#### Extract Error Handling
The extract tool gracefully handles failed extractions:
```python theme={"system"}
# Mix of valid and invalid URLs
result = extract\_tool.invoke({
"urls": [
"https://en.wikipedia.org/wiki/Python\_(programming\_language)",
"https://this-domain-does-not-exist-12345.com/"
]
})
for item in result:
if "error\_type" in item:
print(f"Failed: {item['url']} - {item['content']}")
else:
print(f"Success: {item['url']} - {len(item['content'])} chars")
```
#### Async Extract
```python theme={"system"}
import asyncio
async def extract\_async():
result = await extract\_tool.ainvoke({
"urls": ["https://en.wikipedia.org/wiki/Artificial\_intelligence"]
})
return result
# Run async extraction
result = asyncio.run(extract\_async())
```
## Error Handling
```python theme={"system"}
try:
response = chat.invoke(messages)
print(response.content)
except ValueError as e:
if "API key not found" in str(e):
print("Please set your PARALLEL\_API\_KEY environment variable")
else:
print(f"API Error: {e}")
except Exception as e:
print(f"Unexpected error: {e}")
```
## Examples
See the `examples/` and `docs/` directories for complete working examples:
\* `examples/chat\_example.py` - Chat model usage examples
\* `docs/search\_tool.ipynb` - Search tool examples and tutorials
\* `docs/extract\_tool.ipynb` - Extract tool examples and tutorials
Examples include:
\* Basic synchronous usage
\* Streaming responses
\* Async operations
\* Conversation management
\* Tool usage in agents
