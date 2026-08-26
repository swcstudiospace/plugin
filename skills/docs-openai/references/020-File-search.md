# File search

Source: https://developers.openai.com/api/docs/guides/tools-file-search.md

# File search
> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.
File search is a tool available in the [Responses API](https://developers.openai.com/api/reference/resources/responses).
It enables models to retrieve information in a knowledge base of previously uploaded files through semantic and keyword search.
By creating vector stores and uploading files to them, you can augment the models' inherent knowledge by giving them access to these knowledge bases or `vector\_stores`.
To learn more about how vector stores and semantic search work, refer to our
[retrieval guide](https://developers.openai.com/api/docs/guides/retrieval).
This is a hosted tool managed by OpenAI, meaning you don't have to implement code on your end to handle its execution.
When the model decides to use it, it will automatically call the tool, retrieve information from your files, and return an output.
## How to use
Prior to using file search with the Responses API, you need to have set up a knowledge base in a vector store and uploaded files to it.
Create a vector store and upload a file
Follow these steps to create a vector store and upload a file to it. You can use [this example file](https://cdn.openai.com/API/docs/deep\_research\_blog.pdf) or upload your own.
#### Upload the file to the File API
Upload a file
```python
from io import BytesIO
import requests
from openai import OpenAI
client = OpenAI()
def create\_file(client, file\_path):
if file\_path.startswith(("http://", "https://")):
response = requests.get(file\_path, timeout=30)
response.raise\_for\_status()
file\_content = BytesIO(response.content)
file\_name = file\_path.rsplit("/", 1)[-1]
result = client.files.create(
file=(file\_name, file\_content),
purpose="assistants",
)
else:
with open(file\_path, "rb") as file\_content:
result = client.files.create(
file=file\_content,
purpose="assistants",
)
return result.id
file\_id = create\_file(
client,
"https://cdn.openai.com/API/docs/deep\_research\_blog.pdf",
)
print(file\_id)
```
```javascript
import fs from "fs";
import OpenAI from "openai";
const openai = new OpenAI();
async function createFile(filePath) {
let result;
if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
// Download the file content from the URL
const res = await fetch(filePath);
const buffer = await res.arrayBuffer();
const urlParts = filePath.split("/");
const fileName = urlParts[urlParts.length - 1];
const file = new File([buffer], fileName);
result = await openai.files.create({
file: file,
purpose: "assistants",
});
} else {
// Handle local file path
const fileContent = fs.createReadStream(filePath);
result = await openai.files.create({
file: fileContent,
purpose: "assistants",
});
}
return result.id;
}
// Replace with your own file path or URL
const fileId = await createFile(
"https://cdn.openai.com/API/docs/deep\_research\_blog.pdf"
);
console.log(fileId);
```
#### Create a vector store
Create a vector store
```python
vector\_store = client.vector\_stores.create(name="knowledge\_base")
print(vector\_store.id)
```
```javascript
const vectorStore = await openai.vectorStores.create({
name: "knowledge\_base",
});
console.log(vectorStore.id);
```
#### Add the file to the vector store
Add a file to a vector store
```python
result = client.vector\_stores.files.create(
vector\_store\_id=vector\_store.id,
file\_id=file\_id,
)
print(result)
```
```javascript
await openai.vectorStores.files.create(vectorStore.id, {
file\_id: fileId,
});
```
#### Check status
Run this code until the file is ready to be used (i.e., when the status is `completed`).
Check status
```python
result = client.vector\_stores.files.list(vector\_store\_id=vector\_store.id)
print(result)
```
```javascript
const result = await openai.vectorStores.files.list(vectorStore.id);
console.log(result);
```
Once your knowledge base is set up, you can include the `file\_search` tool in the list of tools available to the model, along with the list of vector stores in which to search.
File search tool
```python
from openai import OpenAI
client = OpenAI()
response = client.responses.create(
model="gpt-5.6",
input="What is deep research by OpenAI?",
tools=[{"type": "file\_search", "vector\_store\_ids": [""]}],
)
print(response)
```
```javascript
import OpenAI from "openai";
const openai = new OpenAI();
const response = await openai.responses.create({
model: "gpt-5.6",
input: "What is deep research by OpenAI?",
tools: [
{
type: "file\_search",
vector\_store\_ids: [""],
},
],
});
console.log(response);
```
```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001
string key = Environment.GetEnvironmentVariable("OPENAI\_API\_KEY")!;
ResponsesClient client = new(key);
CreateResponseOptions options = new() { Model = "gpt-5.6" };
options.Tools.Add(
ResponseTool.CreateFileSearchTool([""])
);
options.InputItems.Add(
ResponseItem.CreateUserMessageItem("What is deep research by OpenAI?")
);
ResponseResult response = await client.CreateResponseAsync(options);
Console.WriteLine(response.GetOutputText());
```
```ruby
require "openai"
openai = OpenAI::Client.new
response = openai.responses.create(
model: "gpt-5.6",
input: "What is deep research by OpenAI?",
tools: [
{
type: "file\_search",
vector\_store\_ids: [""]
}
]
)
puts(response)
```
When this tool is called by the model, you will receive a response with multiple outputs:
1. A `file\_search\_call` output item, which contains the id of the file search call.
2. A `message` output item, which contains the response from the model, along with the file citations.
File search response
```json
{
"output": [
{
"type": "file\_search\_call",
"id": "fs\_67c09ccea8c48191ade9367e3ba71515",
"status": "completed",
"queries": ["What is deep research?"],
"search\_results": null
},
{
"id": "msg\_67c09cd3091c819185af2be5d13d87de",
"type": "message",
"role": "assistant",
"content": [
{
"type": "output\_text",
"text": "Deep research is a sophisticated capability that allows for extensive inquiry and synthesis of information across various domains. It is designed to conduct multi-step research tasks, gather data from multiple online sources, and provide comprehensive reports similar to what a research analyst would produce. This functionality is particularly useful in fields requiring detailed and accurate information...",
"annotations": [
{
"type": "file\_citation",
"index": 992,
"file\_id": "file-2dtbBZdjtDKS8eqWxqbgDi",
"filename": "deep\_research\_blog.pdf"
},
{
"type": "file\_citation",
"index": 992,
"file\_id": "file-2dtbBZdjtDKS8eqWxqbgDi",
"filename": "deep\_research\_blog.pdf"
},
{
"type": "file\_citation",
"index": 1176,
"file\_id": "file-2dtbBZdjtDKS8eqWxqbgDi",
"filename": "deep\_research\_blog.pdf"
},
{
"type": "file\_citation",
"index": 1176,
"file\_id": "file-2dtbBZdjtDKS8eqWxqbgDi",
"filename": "deep\_research\_blog.pdf"
}
]
}
]
}
]
}
```
## Retrieval customization
### Limiting the number of results
Using the file search tool with the Responses API, you can customize the number of results you want to retrieve from the vector stores. This can help reduce both token usage and latency, but may come at the cost of reduced answer quality.
Limit the number of results
```python
response = client.responses.create(
model="gpt-5.6",
input="What is deep research by OpenAI?",
tools=[
{
"type": "file\_search",
"vector\_store\_ids": [""],
# highlight-start
"max\_num\_results": 2,
# highlight-end
}
],
)
print(response)
```
```javascript
const response = await openai.responses.create({
model: "gpt-5.6",
input: "What is deep research by OpenAI?",
tools: [
{
type: "file\_search",
vector\_store\_ids: [""],
// highlight-start
max\_num\_results: 2,
// highlight-end
},
],
});
console.log(response);
```
### Include search results in the response
While you can see annotations (references to files) in the output text, the file search call will not return search results by default.
To include search results in the response, you can use the `include` parameter when creating the response.
Include search results
```python
response = client.responses.create(
model="gpt-5.6",
input="What is deep research by OpenAI?",
tools=[
{
"type": "file\_search",
"vector\_store\_ids": [""],
}
],
# highlight-start
include=["file\_search\_call.results"],
# highlight-end
)
print(response)
```
```javascript
const response = await openai.responses.create({
model: "gpt-5.6",
input: "What is deep research by OpenAI?",
tools: [
{
type: "file\_search",
vector\_store\_ids: [""],
},
],
// highlight-start
include: ["file\_search\_call.results"],
// highlight-end
});
console.log(response);
```
### Metadata filtering
You can filter the search results based on the metadata of the files. For more details, refer to our [retrieval guide](https://developers.openai.com/api/docs/guides/retrieval), which covers:
- How to [set attributes on vector store files](https://developers.openai.com/api/docs/guides/retrieval#attributes)
- How to [define filters](https://developers.openai.com/api/docs/guides/retrieval#attribute-filtering)
Metadata filtering
```python
response = client.responses.create(
model="gpt-5.6",
input="What is deep research by OpenAI?",
tools=[
{
"type": "file\_search",
"vector\_store\_ids": [""],
# highlight-start
"filters": {
"type": "in",
"key": "category",
"value": ["blog", "announcement"],
},
# highlight-end
}
],
)
print(response)
```
```javascript
const response = await openai.responses.create({
model: "gpt-5.6",
input: "What is deep research by OpenAI?",
tools: [
{
type: "file\_search",
vector\_store\_ids: [""],
// highlight-start
filters: {
type: "in",
key: "category",
value: ["blog", "announcement"],
},
// highlight-end
},
],
});
console.log(response);
```
## Supported files
\_For `text/` MIME types, the encoding must be one of `utf-8`, `utf-16`, or `ascii`.\_
{/\* Keep this table in sync with RETRIEVAL\_SUPPORTED\_EXTENSIONS in the agentapi service \*/}
| File format | MIME type |
| ----------- | --------------------------------------------------------------------------- |
| `.c` | `text/x-c` |
| `.cpp` | `text/x-c++` |
| `.cs` | `text/x-csharp` |
| `.css` | `text/css` |
| `.doc` | `application/msword` |
| `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| `.go` | `text/x-golang` |
| `.html` | `text/html` |
| `.java` | `text/x-java` |
| `.js` | `text/javascript` |
| `.json` | `application/json` |
| `.md` | `text/markdown` |
| `.pdf` | `application/pdf` |
| `.php` | `text/x-php` |
| `.pptx` | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
| `.py` | `text/x-python` |
| `.py` | `text/x-script.python` |
| `.rb` | `text/x-ruby` |
| `.sh` | `application/x-sh` |
| `.tex` | `text/x-tex` |
| `.ts` | `application/typescript` |
| `.txt` | `text/plain` |
## Usage notes

| API Availability | Rate limits | Notes |
| --- | --- | --- |
| [Responses](https://developers.openai.com/api/reference/resources/responses) [Chat Completions](https://developers.openai.com/api/reference/resources/chat) [Assistants](https://developers.openai.com/api/reference/resources/beta/subresources/assistants) | \*\*Tier 1\*\* 100 RPM \*\*Tier 2 and 3\*\* 500 RPM \*\*Tier 4 and 5\*\* 1000 RPM | [Pricing](https://developers.openai.com/api/docs/pricing#built-in-tools) [ZDR and data residency](https://developers.openai.com/api/docs/guides/your-data) |
