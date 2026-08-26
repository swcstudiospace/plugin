# Files API

Source: https://platform.claude.com/docs/en/build-with-claude/files.md

# Files API
Upload files once, reference them by file\_id in Messages requests, and download outputs created by skills or the code execution tool.
---
The Files API lets you upload and manage files to use with the Claude API without re-uploading content with each request. This is particularly useful when using the [code execution tool](/docs/en/agents-and-tools/tool-use/code-execution-tool) to provide inputs (for example, datasets and documents) and then download outputs (for example, charts). You can [explore the API reference directly](/docs/en/api/beta/files/upload), in addition to this guide.
The Files API is in beta. Reach out through the [feedback form](https://forms.gle/tisHyierGwgN4DUE9) to share your experience with the Files API.

For how zero data retention (ZDR) applies to this feature, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
## Supported models
Referencing a `file\_id` in a Messages request is supported on all models that support the given file type. [Images](/docs/en/build-with-claude/vision) are supported on all current Claude models. For [PDFs](/docs/en/build-with-claude/pdf-support) and [other file types with the code execution tool](/docs/en/agents-and-tools/tool-use/code-execution-tool#model-compatibility), see the linked pages for model support.
The Files API is available on the Claude API, [Claude Platform on AWS](/docs/en/build-with-claude/claude-platform-on-aws), and [Microsoft Foundry](/docs/en/build-with-claude/claude-in-microsoft-foundry). On Microsoft Foundry, the Files API requires a [Hosted on Anthropic deployment](/docs/en/build-with-claude/claude-in-microsoft-foundry#additional-features-not-supported-when-hosted-on-azure). It is not currently available on Amazon Bedrock or Google Cloud.
## How the Files API works
The Files API provides a create-once, use-many-times approach for working with files:
\* \*\*Upload files\*\* to Anthropic's secure storage and receive a unique `file\_id`
\* \*\*Download files\*\* that are created by skills or the code execution tool
\* \*\*Reference files\*\* in [Messages](/docs/en/api/messages/create) requests using the `file\_id` instead of re-uploading content
\* \*\*Manage your files\*\* with list, retrieve, and delete operations
## How to use the Files API
To use the Files API, you'll need to include the beta feature header: `anthropic-beta: files-api-2025-04-14`. The SDKs add this header automatically when you call methods on the `beta.files` namespace, so the SDK examples on this page don't pass it explicitly for file operations. Messages requests that reference a file do need it, which the SDK examples pass through their `betas` parameter.
### Uploading a file
Upload a file to be referenced in future API calls:
```bash cURL
FILE\_ID=$(curl -X POST https://api.anthropic.com/v1/files \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: files-api-2025-04-14" \
-F "file=@/path/to/document.pdf" | jq -r '.id')
echo "$FILE\_ID"
```
```bash CLI
FILE\_ID=$(ant beta:files upload \
--file /path/to/document.pdf \
--transform id \
--raw-output)
echo "$FILE\_ID"
```
```python Python
uploaded = client.beta.files.upload(
file=("document.pdf", open("/path/to/document.pdf", "rb"), "application/pdf"),
)
file\_id = uploaded.id
print(file\_id)
```
```typescript TypeScript
const uploaded = await client.beta.files.upload({
file: await toFile(
fs.createReadStream("/path/to/document.pdf"),
undefined,
{ type: "application/pdf" },
),
});
console.log(uploaded.id);
```
```csharp C#
var uploaded = await client.Beta.Files.Upload(
new FileUploadParams
{
File = new BinaryContent
{
Stream = File.OpenRead("/path/to/document.pdf"),
FileName = "document.pdf",
ContentType = new("application/pdf")
}
});
var fileId = uploaded.ID;
Console.WriteLine(fileId);
```
```go Go
f, err := os.Open("/path/to/document.pdf")
if err != nil {
log.Fatal(err)
}
defer f.Close()
response, err := client.Beta.Files.Upload(context.Background(),
anthropic.BetaFileUploadParams{
File: anthropic.File(f, "document.pdf", "application/pdf"),
})
if err != nil {
log.Fatal(err)
}
fileID := response.ID
fmt.Println(fileID)
```
```java Java
FileMetadata file = client.beta().files().upload(
FileUploadParams.builder()
.file(MultipartField.builder()
.value(Files.newInputStream(Path.of("/path/to/document.pdf")))
.filename("document.pdf")
.contentType("application/pdf")
.build())
.build()
);
String fileId = file.id();
System.out.println(fileId);
```
```php PHP
$file = $client->beta->files->upload(
FileParam::fromResource(fopen('/path/to/document.pdf', 'rb'), contentType: 'application/pdf'),
);
$fileId = $file->id;
echo $fileId;
```
```ruby Ruby
file = client.beta.files.upload(
file: Anthropic::FilePart.new(
Pathname("/path/to/document.pdf"),
content\_type: "application/pdf"
)
)
file\_id = file.id
puts file\_id
```
The response from uploading a file includes:
```json Response
{
"id": "file\_011CNha8iCJcU1wXNR6q4V8w",
"type": "file",
"filename": "document.pdf",
"mime\_type": "application/pdf",
"size\_bytes": 1024000,
"created\_at": "2025-01-01T00:00:00Z",
"downloadable": false
}
```
`downloadable` is `false` for files you upload. Only files created by [skills](/docs/en/build-with-claude/skills-guide) or the [code execution tool](/docs/en/agents-and-tools/tool-use/code-execution-tool) can be downloaded. See [Downloading a file](#downloading-a-file).
### Using a file in messages
Once uploaded, reference the file by passing the `id` from the upload response as `file\_id`:
```bash cURL
curl -X POST https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: files-api-2025-04-14" \
-H "content-type: application/json" \
-d @- <
{
new BetaTextBlockParam { Text = "Please summarize this document for me." },
new BetaRequestDocumentBlock
{
Source = new BetaFileDocumentSource { FileID = fileId }
}
}
}
]
});
Console.WriteLine(response);
```
```go Go
msg, err := client.Beta.Messages.New(context.Background(),
anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Betas: []anthropic.AnthropicBeta{anthropic.AnthropicBetaFilesAPI2025\_04\_14},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(
anthropic.NewBetaTextBlock("Please summarize this document for me."),
anthropic.NewBetaDocumentBlock(anthropic.BetaFileDocumentSourceParam{
FileID: fileID,
}),
),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(msg)
```
```java Java
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.addBeta("files-api-2025-04-14")
.maxTokens(1024)
.addUserMessageOfBetaContentBlockParams(List.of(
BetaContentBlockParam.ofText(BetaTextBlockParam.builder()
.text("Please summarize this document for me.")
.build()),
BetaContentBlockParam.ofDocument(BetaRequestDocumentBlock.builder()
.source(BetaFileDocumentSource.builder()
.fileId(fileId)
.build())
.build())
))
.build();
BetaMessage message = client.beta().messages().create(params);
System.out.println(message);
```
```php PHP
$response = $client->beta->messages->create(
maxTokens: 1024,
messages: [
[
'role' => 'user',
'content' => [
['type' => 'text', 'text' => 'Please summarize this document for me.'],
[
'type' => 'document',
'source' => [
'type' => 'file',
'file\_id' => $fileId
]
]
]
]
],
model: 'claude-opus-5',
betas: ['files-api-2025-04-14'],
);
print\_r($response);
```
```ruby Ruby
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
betas: ["files-api-2025-04-14"],
messages: [
{
role: "user",
content: [
{ type: "text", text: "Please summarize this document for me." },
{
type: "document",
source: {
type: "file",
file\_id: file\_id
}
}
]
}
]
)
puts response
```
### File types and content blocks
The Files API supports different file types that correspond to different content block types:
| File type | MIME type | Content block type | Use case |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | ------------------ | ----------------------------------- |
| PDF | `application/pdf` | `document` | Text analysis, document processing |
| Plain text | `text/plain` | `document` | Text analysis, processing |
| Images | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | `image` | Image analysis, visual tasks |
| [Datasets, others](/docs/en/agents-and-tools/tool-use/code-execution-tool#upload-and-analyze-your-own-files) | Varies | `container\_upload` | Analyze data, create visualizations |
#### Document blocks
For PDFs and text files, use the `document` content block:
```json
{
"type": "document",
"source": {
"type": "file",
"file\_id": "file\_011CNha8iCJcU1wXNR6q4V8w"
},
"title": "Document Title", // Optional
"context": "Context about the document", // Optional
"citations": { "enabled": true } // Optional, enables citations
}
```
#### Image blocks
For images, use the `image` content block:
```json
{
"type": "image",
"source": {
"type": "file",
"file\_id": "file\_011CPMxVD3fHLUhvTqtsQA5w"
}
}
```
#### Container upload blocks
To send a file to the [code execution tool](/docs/en/agents-and-tools/tool-use/code-execution-tool#upload-and-analyze-your-own-files), use the `container\_upload` content block:
```json
{
"type": "container\_upload",
"file\_id": "file\_011CNha8iCJcU1wXNR6q4V8w"
}
```
### Working with other file formats
For file types that the `document` block doesn't support (for example, .docx and .xlsx), convert the files to plain text and include the content directly in your message. Files that are already plain text, such as .csv and .md files, can either be read in this way or uploaded through the Files API with an explicit `text/plain` content type. To analyze datasets instead of reading them as text, upload them for the [code execution tool](/docs/en/agents-and-tools/tool-use/code-execution-tool#upload-and-analyze-your-own-files) using a `container\_upload` block.
The following examples read a text file and send its contents as plain text:
```bash cURL
# Read the text file
# Note: For files with special characters, consider base64 encoding
TEXT\_CONTENT=$(cat document.txt)
curl https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-d @- < block.type === "text"
);
console.log(textBlock?.text);
```
```csharp C#
AnthropicClient client = new();
// Read the text file
string textContent = await File.ReadAllTextAsync("document.txt");
var parameters = new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Messages = [new()
{
Role = Role.User,
Content = $"Here's the document content:\n\n{textContent}\n\nPlease summarize this document."
}]
};
var message = await client.Messages.Create(parameters);
Console.WriteLine(message);
```
```go Go
client := anthropic.NewClient()
// Read the text file
textContent, err := os.ReadFile("document.txt")
if err != nil {
log.Fatal(err)
}
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock(
fmt.Sprintf("Here's the document content:\n\n%s\n\nPlease summarize this document.", string(textContent)),
)),
},
})
if err != nil {
log.Fatal(err)
}
for \_, block := range response.Content {
if textBlock, ok := block.AsAny().(anthropic.TextBlock); ok {
fmt.Println(textBlock.Text)
}
}
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
// Read the text file
String textContent = Files.readString(Path.of("document.txt"));
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024L)
.addUserMessage("Here's the document content:\n\n" + textContent + "\n\nPlease summarize this document.")
.build();
Message response = client.messages().create(params);
response.content().stream()
.flatMap(block -> block.text().stream())
.forEach(textBlock -> System.out.println(textBlock.text()));
```
```php PHP
$client = new Client();
// Read the text file
$textContent = file\_get\_contents("document.txt");
$message = $client->messages->create(
maxTokens: 1024,
messages: [
[
'role' => 'user',
'content' => [
[
'type' => 'text',
'text' => "Here's the document content:\n\n{$textContent}\n\nPlease summarize this document."
]
]
]
],
model: 'claude-opus-5',
);
foreach ($message->content as $block) {
if ($block->type === 'text') {
echo $block->text, PHP\_EOL;
}
}
```
```ruby Ruby
client = Anthropic::Client.new
# Read the text file
text\_content = File.read("document.txt")
message = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
messages: [
{
role: "user",
content: [
{
type: "text",
text: "Here's the document content:\n\n#{text\_content}\n\nPlease summarize this document."
}
]
}
]
)
message.content.each do |block|
puts block.text if block.type == :text
end
```

For .docx files containing images, convert them to PDF format first, then use [PDF support](/docs/en/build-with-claude/pdf-support) to take advantage of the built-in image parsing. This allows using citations from the PDF document.
### Managing files
#### List files
Retrieve a list of your uploaded files. The endpoint is paginated: each request returns up to `limit` files (20 by default), and the `before\_id` and `after\_id` parameters fetch the adjacent page. See the [List Files API reference](/docs/en/api/beta/files/list). The SDKs return the first page and provide auto-pagination helpers. The CLI example bounds the total with `--max-items`:
```bash cURL
curl https://api.anthropic.com/v1/files \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: files-api-2025-04-14"
```
```bash CLI
ant beta:files list \
--max-items 10
```
```python Python
client = anthropic.Anthropic()
files = client.beta.files.list()
print(files)
```
```typescript TypeScript
const client = new Anthropic();
const files = await client.beta.files.list();
console.log(files);
```
```csharp C#
AnthropicClient client = new();
var files = await client.Beta.Files.List();
Console.WriteLine(files);
```
```go Go
client := anthropic.NewClient()
files, err := client.Beta.Files.List(context.TODO(), anthropic.BetaFileListParams{})
if err != nil {
log.Fatal(err)
}
fmt.Println(files)
```
```java Java
import com.anthropic.models.beta.files.FileListPage;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
FileListPage files = client.beta().files().list();
System.out.println(files);
}
```
```php PHP
$client = new Client();
$files = $client->beta->files->list();
print\_r($files);
```
```ruby Ruby
client = Anthropic::Client.new
files = client.beta.files.list
puts files
```
#### Get file metadata
Retrieve information about a specific file:
```bash cURL
curl "https://api.anthropic.com/v1/files/$FILE\_ID" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: files-api-2025-04-14"
```
```bash CLI
ant beta:files retrieve-metadata \
--file-id "$FILE\_ID"
```
```python Python
file = client.beta.files.retrieve\_metadata(file\_id)
print(file)
```
```typescript TypeScript
const file = await client.beta.files.retrieveMetadata(uploaded.id);
console.log(file);
```
```csharp C#
var file = await client.Beta.Files.RetrieveMetadata(fileId);
Console.WriteLine(file);
```
```go Go
metadata, err := client.Beta.Files.GetMetadata(
context.TODO(),
fileID,
anthropic.BetaFileGetMetadataParams{},
)
if err != nil {
log.Fatal(err)
}
fmt.Println(metadata)
```
```java Java
FileMetadata metadata = client.beta().files().retrieveMetadata(fileId);
System.out.println(metadata);
```
```php PHP
$file = $client->beta->files->retrieveMetadata($fileId);
echo $file;
```
```ruby Ruby
file = client.beta.files.retrieve\_metadata(file\_id)
puts file
```
#### Delete a file
Remove a file from your workspace:
```bash cURL
curl -X DELETE "https://api.anthropic.com/v1/files/$FILE\_ID" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: files-api-2025-04-14"
```
```bash CLI
ant beta:files delete \
--file-id "$FILE\_ID"
```
```python Python
client.beta.files.delete(file\_id)
```
```typescript TypeScript
await client.beta.files.delete(uploaded.id);
```
```csharp C#
await client.Beta.Files.Delete(fileId);
```
```go Go
\_, err = client.Beta.Files.Delete(
context.TODO(),
fileID,
anthropic.BetaFileDeleteParams{},
)
if err != nil {
log.Fatal(err)
}
```
```java Java
client.beta().files().delete(fileId);
```
```php PHP
$client->beta->files->delete($fileId);
```
```ruby Ruby
client.beta.files.delete(file\_id)
```
### Downloading a file
Download files that were created by [skills](/docs/en/build-with-claude/skills-guide) or the [code execution tool](/docs/en/agents-and-tools/tool-use/code-execution-tool). Files you upload cannot be downloaded. The `file\_id` of a generated file appears in the [`bash\_code\_execution\_tool\_result` content block](/docs/en/agents-and-tools/tool-use/code-execution-tool#retrieve-generated-files) of the Messages response that created it:
```bash cURL
curl -X GET "https://api.anthropic.com/v1/files/$FILE\_ID/content" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: files-api-2025-04-14" \
--output downloaded\_file.txt
```
```bash CLI
ant beta:files download \
--file-id "$FILE\_ID" \
--output downloaded\_file.txt
```
```python Python
file\_content = client.beta.files.download(file\_id)
file\_content.write\_to\_file("downloaded\_file.txt")
```
```typescript TypeScript
const content = await client.beta.files.download(uploaded.id);
const bytes = Buffer.from(await content.arrayBuffer());
await fsp.writeFile("downloaded\_file.txt", bytes);
```
```csharp C#
using var fileContent = await client.Beta.Files.Download(fileId);
await using var source = await fileContent.ReadAsStream();
await using var destination = File.Create("downloaded\_file.txt");
await source.CopyToAsync(destination);
```
```go Go
func downloadFile(client anthropic.Client, fileID string) error {
resp, err := client.Beta.Files.Download(
context.TODO(),
fileID,
anthropic.BetaFileDownloadParams{},
)
if err != nil {
return err
}
defer resp.Body.Close()
out, err := os.Create("downloaded\_file.txt")
if err != nil {
return err
}
defer out.Close()
\_, err = io.Copy(out, resp.Body)
return err
}
```
```java Java
try (HttpResponse response = client.beta().files().download(fileId)) {
try (InputStream body = response.body()) {
Files.copy(body, Path.of("downloaded\_file.txt"),
StandardCopyOption.REPLACE\_EXISTING);
}
}
```
```php PHP
$fileContent = $client->beta->files->download($fileId);
file\_put\_contents("downloaded\_file.txt", $fileContent);
```
```ruby Ruby
file\_content = client.beta.files.download(file\_id)
File.binwrite("downloaded\_file.txt", file\_content.read)
```

A file is downloadable only when its metadata shows `"downloadable": true`, which is the case for files created by skills or the code execution tool. Downloading a file you uploaded returns a 400 error.
## File storage and limits
### Storage limits
\* \*\*Maximum file size:\*\* 500 MB per file
\* \*\*Total storage:\*\* 500 GB per organization
### File lifecycle
\* Files are scoped to the workspace of the API key that uploaded them. Any API key in the same workspace can reference them
\* Files cannot be modified or renamed after upload. To change a file's content, upload a new file and delete the old one
\* Files persist until you delete them with the `DELETE /v1/files/{file\_id}` endpoint
\* Deleted files cannot be recovered
\* Files are inaccessible through the API shortly after deletion, but they may persist in active Messages API calls and associated tool uses
\* Files that users delete will be deleted in accordance with Anthropic's [data retention policy](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data). For ZDR eligibility across all features, see [API and data retention](/docs/en/manage-claude/api-and-data-retention)
## Error handling
Common errors when using the Files API include:
\* \*\*File not found (404):\*\* The specified `file\_id` doesn't exist or you don't have access to it
\* \*\*Invalid file type (400):\*\* The file type doesn't match the content block type (for example, using an image file in a document block)
\* \*\*Not downloadable (400):\*\* Files you upload have `"downloadable": false` and cannot be downloaded. Only files created by skills or the code execution tool can be downloaded
\* \*\*Exceeds context window size (400):\*\* The file is larger than the context window size (for example, using a 500 MB plain text file in a `/v1/messages` request)
\* \*\*Invalid filename (400):\*\* The file name doesn't meet the length requirements (1-255 characters) or contains forbidden characters (`<`, `>`, `:`, `"`, `|`, `?`, `\*`, `\`, `/`, or Unicode characters 0-31)
\* \*\*File too large (413):\*\* File exceeds the 500 MB limit
\* \*\*Storage limit exceeded (400):\*\* Your organization has reached the 500 GB storage limit
```json Output
{
"type": "error",
"error": {
"type": "not\_found\_error",
"message": "File `file\_011CNha8iCJcU1wXNR6q4V8w` not found."
},
"request\_id": "req\_011CQFYcrRp7mCHLDsAYT8Qt"
}
```
## Usage and billing
Files API operations are free:
\* Uploading files
\* Downloading files
\* Listing files
\* Getting file metadata
\* Deleting files
File content used in Messages requests is priced as input tokens.
### Rate limits
During the beta period:
\* File-related API calls are limited to approximately 100 requests per minute
\* [Contact us](mailto:sales@anthropic.com) if you need higher limits for your use case
## Next steps

Process PDFs with Claude. Extract text, analyze charts, and understand visual content from your documents.

Run Python and bash code in a sandboxed container to analyze data, generate files, and iterate on solutions.

Process and analyze visual input and generate text and code from images.
