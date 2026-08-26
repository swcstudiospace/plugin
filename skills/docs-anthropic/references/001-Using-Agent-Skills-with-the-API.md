# Using Agent Skills with the API

Source: https://platform.claude.com/docs/en/build-with-claude/skills-guide.md

# Using Agent Skills with the API
Learn how to use Agent Skills to extend Claude's capabilities through the API.
---
Agent Skills extend Claude's capabilities through organized folders of instructions, scripts, and resources. This guide shows you how to use both pre-built and custom Skills with the Claude API.
For complete API reference including request/response schemas and all parameters, see:
\* [Skill Management API Reference](/docs/en/api/beta/skills/list) - CRUD operations for Skills
\* [Skill Versions API Reference](/docs/en/api/beta/skills/versions/list) - Version management

For how zero data retention (ZDR) applies to this feature, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
## Quick links

Create your first Skill

Best practices for authoring Skills
## Overview
For a detailed look at the architecture and real-world applications of Agent Skills, read the engineering blog post: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).
Skills integrate with the Messages API through the [code execution tool](/docs/en/agents-and-tools/tool-use/code-execution-tool). Whether using pre-built Skills managed by Anthropic or custom Skills you've uploaded, the integration shape is identical: both require code execution and use the same `container` structure.
### Using Skills
Skills integrate identically in the Messages API regardless of source. You specify Skills in the `container` parameter with a `skill\_id`, `type`, and optional `version`, and they execute in the code execution environment.
\*\*You can use Skills from two sources:\*\*
| Aspect | Anthropic Skills | Custom Skills |
| ------------------ | ------------------------------------------ | --------------------------------------------------------------------------- |
| \*\*Type value\*\* | `anthropic` | `custom` |
| \*\*Skill IDs\*\* | Short names: `pptx`, `xlsx`, `docx`, `pdf` | Generated: `skill\_01AbCdEfGhIjKlMnOpQrStUv` |
| \*\*Version format\*\* | Date-based: `20251013` or `latest` | Epoch timestamp: `1759178010641129` or `latest` |
| \*\*Management\*\* | Pre-built and maintained by Anthropic | Upload and manage through the [Skills API](/docs/en/api/beta/skills/create) |
| \*\*Availability\*\* | Available to all users | Private to your workspace |
Both skill sources are returned by the [List Skills endpoint](/docs/en/api/beta/skills/list) (use the `source` parameter to filter). The integration shape and execution environment are identical. The only difference is where the Skills come from and how they're managed.
### Prerequisites
To use Skills, you need:
1. \*\*Claude API key\*\* from the [Claude Console](/settings/keys)
2. \*\*Beta headers:\*\*
\* `code-execution-2025-08-25` - Enables code execution (required for Skills)
\* `skills-2025-10-02` - Enables Skills API
\* `files-api-2025-04-14` - For uploading/downloading files to/from container
3. \*\*[Code execution tool](/docs/en/agents-and-tools/tool-use/code-execution-tool)\*\* enabled in your requests
\*\*\*
## Using Skills in Messages
### Container parameter
Skills are specified using the `container` parameter in the Messages API. You can include up to 8 Skills for each request.
The structure is identical for both Anthropic and custom Skills. Specify the required `type` and `skill\_id`, and optionally include `version` to pin to a specific version:
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 4096,
"container": {
"skills": [
{
"type": "anthropic",
"skill\_id": "pptx",
"version": "latest"
}
]
},
"messages": [{
"role": "user",
"content": "Create a presentation about renewable energy"
}],
"tools": [{
"type": "code\_execution\_20250825",
"name": "code\_execution"
}]
}'
```
```bash CLI
ant beta:messages create \
--beta code-execution-2025-08-25,skills-2025-10-02 <<'YAML'
model: claude-opus-5
max\_tokens: 4096
container:
skills:
- type: anthropic
skill\_id: pptx
version: latest
messages:
- role: user
content: Create a presentation about renewable energy
tools:
- type: code\_execution\_20250825
name: code\_execution
YAML
```
```python Python
client = anthropic.Anthropic()
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=4096,
betas=["code-execution-2025-08-25", "skills-2025-10-02"],
container={
"skills": [{"type": "anthropic", "skill\_id": "pptx", "version": "latest"}]
},
messages=[
{"role": "user", "content": "Create a presentation about renewable energy"}
],
tools=[{"type": "code\_execution\_20250825", "name": "code\_execution"}],
)
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [
{
type: "anthropic",
skill\_id: "pptx",
version: "latest"
}
]
},
messages: [
{
role: "user",
content: "Create a presentation about renewable energy"
}
],
tools: [
{
type: "code\_execution\_20250825",
name: "code\_execution"
}
]
});
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = "claude-opus-5",
MaxTokens = 4096,
Betas = ["code-execution-2025-08-25", "skills-2025-10-02"],
Container = new BetaContainerParams
{
Skills =
[
new BetaSkillParams
{
Type = BetaSkillParamsType.Anthropic,
SkillID = "pptx",
Version = "latest",
},
],
},
Messages = [new() { Role = Role.User, Content = "Create a presentation about renewable energy" }],
Tools = [new BetaCodeExecutionTool20250825()],
};
var message = await client.Beta.Messages.Create(parameters);
Console.WriteLine(message);
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: "claude-opus-5",
MaxTokens: 4096,
Betas: []anthropic.AnthropicBeta{
"code-execution-2025-08-25",
anthropic.AnthropicBetaSkills2025\_10\_02,
},
Container: anthropic.BetaMessageNewParamsContainerUnion{
OfContainers: &anthropic.BetaContainerParams{
Skills: []anthropic.BetaSkillParams{
{
Type: anthropic.BetaSkillParamsTypeAnthropic,
SkillID: "pptx",
Version: anthropic.String("latest"),
},
},
},
},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Create a presentation about renewable energy")),
},
Tools: []anthropic.BetaToolUnionParam{
{OfCodeExecutionTool20250825: &anthropic.BetaCodeExecutionTool20250825Param{}},
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
import com.anthropic.models.beta.messages.BetaContainerParams;
import com.anthropic.models.beta.messages.BetaSkillParams;
import com.anthropic.models.beta.messages.BetaCodeExecutionTool20250825;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addBeta("code-execution-2025-08-25")
.addBeta("skills-2025-10-02")
.container(BetaContainerParams.builder()
.addSkill(BetaSkillParams.builder()
.type(BetaSkillParams.Type.ANTHROPIC)
.skillId("pptx")
.version("latest")
.build())
.build())
.addUserMessage("Create a presentation about renewable energy")
.addTool(BetaCodeExecutionTool20250825.builder().build())
.build();
BetaMessage response = client.beta().messages().create(params);
System.out.println(response);
}
```
```php PHP
$client = new Client();
$message = $client->beta->messages->create(
maxTokens: 4096,
messages: [
['role' => 'user', 'content' => 'Create a presentation about renewable energy']
],
model: 'claude-opus-5',
betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
container: [
'skills' => [
[
'type' => 'anthropic',
'skill\_id' => 'pptx',
'version' => 'latest'
]
]
],
tools: [
['type' => 'code\_execution\_20250825', 'name' => 'code\_execution']
]
);
echo $message;
```
```ruby Ruby
client = Anthropic::Client.new
message = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [
{
type: "anthropic",
skill\_id: "pptx",
version: "latest"
}
]
},
messages: [
{ role: "user", content: "Create a presentation about renewable energy" }
],
tools: [
{ type: "code\_execution\_20250825", name: "code\_execution" }
]
)
puts message
```
### Downloading generated files
When Skills create documents (Excel, PowerPoint, PDF, Word), they return `file\_id` attributes in the response. You must use the Files API to download these files.
\*\*How it works:\*\*
1. Skills create files during code execution.
2. Response includes `file\_id` for each created file.
3. Use the Files API to download the actual file content.
4. Save locally or process as needed.
\*\*Example: Creating and downloading an Excel file\*\*
```bash cURL
# Step 1: Use a Skill to create a file
RESPONSE=$(curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 4096,
"container": {
"skills": [
{"type": "anthropic", "skill\_id": "xlsx", "version": "latest"}
]
},
"messages": [{
"role": "user",
"content": "Create an Excel file with a simple budget spreadsheet"
}],
"tools": [{
"type": "code\_execution\_20250825",
"name": "code\_execution"
}]
}')
# Step 2: Extract file\_id from response (using jq)
FILE\_ID=$(echo "$RESPONSE" | jq -r '.content[] | select(.type=="bash\_code\_execution\_tool\_result") | .content | select(.type=="bash\_code\_execution\_result") | .content[] | select(.file\_id) | .file\_id')
# Step 3: Get filename from metadata
FILENAME=$(curl "https://api.anthropic.com/v1/files/$FILE\_ID" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: files-api-2025-04-14" | jq -r '.filename')
# Step 4: Download the file using Files API
curl "https://api.anthropic.com/v1/files/$FILE\_ID/content" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: files-api-2025-04-14" \
--output "$FILENAME"
echo "Downloaded: $FILENAME"
```
```bash CLI
# Step 1: Use the xlsx Skill to create a file
# Step 2: Extract file\_id from the response with --transform (GJSON path)
FILE\_ID=$(ant beta:messages create \
--beta code-execution-2025-08-25,skills-2025-10-02 \
--transform 'content.#.content.content.#.file\_id|@flatten|0' \
--raw-output <<'YAML'
model: claude-opus-5
max\_tokens: 4096
container:
skills:
- type: anthropic
skill\_id: xlsx
version: latest
messages:
- role: user
content: Create an Excel file with a simple budget spreadsheet
tools:
- type: code\_execution\_20250825
name: code\_execution
YAML
)
# Step 3: Get the filename from file metadata
FILENAME=$(ant beta:files retrieve-metadata \
--file-id "$FILE\_ID" \
--transform filename --raw-output)
# Step 4: Download the file using Files API
ant beta:files download \
--file-id "$FILE\_ID" \
--output "$FILENAME" > /dev/null
printf 'Downloaded: %s\n' "$FILENAME"
```
```python Python
client = anthropic.Anthropic()
# Step 1: Use a Skill to create a file
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=4096,
betas=["code-execution-2025-08-25", "skills-2025-10-02"],
container={
"skills": [{"type": "anthropic", "skill\_id": "xlsx", "version": "latest"}]
},
messages=[
{
"role": "user",
"content": "Create an Excel file with a simple budget spreadsheet",
}
],
tools=[{"type": "code\_execution\_20250825", "name": "code\_execution"}],
)
# Step 2: Extract file IDs from the response
def extract\_file\_ids(response):
file\_ids = []
for item in response.content:
if item.type == "bash\_code\_execution\_tool\_result":
content\_item = item.content
if content\_item.type == "bash\_code\_execution\_result":
# each content item is a bash\_code\_execution\_output block carrying a file\_id
for file in content\_item.content:
file\_ids.append(file.file\_id)
return file\_ids
# Step 3: Download the file using Files API
for file\_id in extract\_file\_ids(response):
file\_metadata = client.beta.files.retrieve\_metadata(file\_id=file\_id)
file\_content = client.beta.files.download(file\_id=file\_id)
# Step 4: Save to disk
file\_content.write\_to\_file(file\_metadata.filename)
print(f"Downloaded: {file\_metadata.filename}")
```
```typescript TypeScript
import { writeFile } from "node:fs/promises";
const client = new Anthropic();
// Step 1: Use a Skill to create a file
const response = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [{ type: "anthropic", skill\_id: "xlsx", version: "latest" }]
},
messages: [
{
role: "user",
content: "Create an Excel file with a simple budget spreadsheet"
}
],
tools: [{ type: "code\_execution\_20250825", name: "code\_execution" }]
});
// Step 2: Extract file IDs from the response
const fileIds: string[] = [];
for (const block of response.content) {
if (
block.type === "bash\_code\_execution\_tool\_result" &&
block.content.type === "bash\_code\_execution\_result"
) {
for (const outputBlock of block.content.content) {
fileIds.push(outputBlock.file\_id);
}
}
}
// Step 3: Download each file and save to disk
for (const fileId of fileIds) {
const fileMetadata = await client.beta.files.retrieveMetadata(fileId);
const fileResponse = await client.beta.files.download(fileId);
await writeFile(fileMetadata.filename, Buffer.from(await fileResponse.arrayBuffer()));
console.log(`Downloaded: ${fileMetadata.filename}`);
}
```
```csharp C#
AnthropicClient client = new();
// Step 1: Use a Skill to create a file
var parameters = new MessageCreateParams
{
Model = "claude-opus-5",
MaxTokens = 4096,
Betas = ["code-execution-2025-08-25", "skills-2025-10-02"],
Container = new BetaContainerParams
{
Skills =
[
new BetaSkillParams
{
Type = BetaSkillParamsType.Anthropic,
SkillID = "xlsx",
Version = "latest",
},
],
},
Messages = [new() { Role = Role.User, Content = "Create an Excel file with a simple budget spreadsheet" }],
Tools = [new BetaCodeExecutionTool20250825()],
};
var response = await client.Beta.Messages.Create(parameters);
// Step 2: Extract file IDs from the response
List fileIds = [];
foreach (var block in response.Content)
{
if (block.TryPickBashCodeExecutionToolResult(out var toolResult)
&& toolResult.Content.TryPickBetaBashCodeExecutionResultBlock(out var result))
{
foreach (var output in result.Content)
{
fileIds.Add(output.FileID);
}
}
}
// Step 3: Download each file and save to disk
foreach (var fileId in fileIds)
{
var fileMetadata = await client.Beta.Files.RetrieveMetadata(fileId);
using var download = await client.Beta.Files.Download(fileId);
using var downloadStream = await download.ReadAsStream();
using var outputFile = File.Create(fileMetadata.Filename);
await downloadStream.CopyToAsync(outputFile);
Console.WriteLine($"Downloaded: {fileMetadata.Filename}");
}
```
```go Go
func main() {
client := anthropic.NewClient()
// Step 1: Use a Skill to create a file
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: "claude-opus-5",
MaxTokens: 4096,
Betas: []anthropic.AnthropicBeta{"code-execution-2025-08-25", anthropic.AnthropicBetaSkills2025\_10\_02},
Container: anthropic.BetaMessageNewParamsContainerUnion{
OfContainers: &anthropic.BetaContainerParams{
Skills: []anthropic.BetaSkillParams{
{
Type: anthropic.BetaSkillParamsTypeAnthropic,
SkillID: "xlsx",
Version: anthropic.String("latest"),
},
},
},
},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Create an Excel file with a simple budget spreadsheet")),
},
Tools: []anthropic.BetaToolUnionParam{
{OfCodeExecutionTool20250825: &anthropic.BetaCodeExecutionTool20250825Param{}},
},
})
if err != nil {
log.Fatal(err)
}
// Step 2: Extract file IDs from the response
fileIDs := extractFileIDs(response)
// Step 3: Download the file using Files API
for \_, fileID := range fileIDs {
fileMetadata, err := client.Beta.Files.GetMetadata(context.TODO(), fileID, anthropic.BetaFileGetMetadataParams{})
if err != nil {
log.Fatal(err)
}
fileContent, err := client.Beta.Files.Download(context.TODO(), fileID, anthropic.BetaFileDownloadParams{})
if err != nil {
log.Fatal(err)
}
// Step 4: Save to disk
out, err := os.Create(fileMetadata.Filename)
if err != nil {
log.Fatal(err)
}
if \_, err := io.Copy(out, fileContent.Body); err != nil {
log.Fatal(err)
}
out.Close()
fileContent.Body.Close()
fmt.Printf("Downloaded: %s\n", fileMetadata.Filename)
}
}
func extractFileIDs(response \*anthropic.BetaMessage) []string {
var fileIDs []string
for \_, item := range response.Content {
switch v := item.AsAny().(type) {
case anthropic.BetaBashCodeExecutionToolResultBlock:
if v.Content.Type == "bash\_code\_execution\_result" {
for \_, output := range v.Content.Content {
fileIDs = append(fileIDs, output.FileID)
}
}
}
}
return fileIDs
}
```
```java Java
import com.anthropic.models.beta.messages.BetaContainerParams;
import com.anthropic.models.beta.messages.BetaSkillParams;
import com.anthropic.models.beta.messages.BetaCodeExecutionTool20250825;
import com.anthropic.models.beta.messages.BetaContentBlock;
import com.anthropic.models.beta.files.FileMetadata;
import com.anthropic.core.http.HttpResponse;
// ...
void main() throws Exception {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
// Step 1: Use a Skill to create a file
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addBeta("code-execution-2025-08-25")
.addBeta("skills-2025-10-02")
.container(BetaContainerParams.builder()
.addSkill(BetaSkillParams.builder()
.type(BetaSkillParams.Type.ANTHROPIC)
.skillId("xlsx")
.version("latest")
.build())
.build())
.addUserMessage("Create an Excel file with a simple budget spreadsheet")
.addTool(BetaCodeExecutionTool20250825.builder().build())
.build();
BetaMessage response = client.beta().messages().create(params);
// Step 2: Extract file IDs from the response
List fileIds = new ArrayList<>();
for (BetaContentBlock block : response.content()) {
if (block.isBashCodeExecutionToolResult()) {
var content = block.asBashCodeExecutionToolResult().content();
if (content.isBetaBashCodeExecutionResultBlock()) {
for (var outputBlock : content.asBetaBashCodeExecutionResultBlock().content()) {
fileIds.add(outputBlock.fileId());
}
}
}
}
// Step 3: Download the file using Files API
for (String fileId : fileIds) {
FileMetadata fileMetadata = client.beta().files().retrieveMetadata(fileId);
HttpResponse fileContent = client.beta().files().download(fileId);
// Step 4: Save to disk
try (InputStream is = fileContent.body();
FileOutputStream fos = new FileOutputStream(fileMetadata.filename())) {
is.transferTo(fos);
}
System.out.println("Downloaded: " + fileMetadata.filename());
}
}
```
```php PHP
$client = new Client();
// Step 1: Use a Skill to create a file
$response = $client->beta->messages->create(
maxTokens: 4096,
messages: [
['role' => 'user', 'content' => 'Create an Excel file with a simple budget spreadsheet']
],
model: 'claude-opus-5',
betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
container: [
'skills' => [
['type' => 'anthropic', 'skill\_id' => 'xlsx', 'version' => 'latest']
]
],
tools: [
['type' => 'code\_execution\_20250825', 'name' => 'code\_execution']
]
);
// Step 2: Extract file IDs from the response
function extractFileIds($response) {
$fileIds = [];
foreach ($response->content as $item) {
if ($item->type === 'bash\_code\_execution\_tool\_result') {
$contentItem = $item->content;
if ($contentItem->type === 'bash\_code\_execution\_result') {
foreach ($contentItem->content as $file) {
$fileIds[] = $file->fileID;
}
}
}
}
return $fileIds;
}
// Step 3: Download the file using Files API
foreach (extractFileIds($response) as $fileId) {
$fileMetadata = $client->beta->files->retrieveMetadata($fileId);
$fileContent = $client->beta->files->download($fileId);
// Step 4: Save to disk
file\_put\_contents($fileMetadata->filename, $fileContent);
echo "Downloaded: {$fileMetadata->filename}\n";
}
```
```ruby Ruby
client = Anthropic::Client.new
# Step 1: Use a Skill to create a file
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [{ type: "anthropic", skill\_id: "xlsx", version: "latest" }]
},
messages: [
{
role: "user",
content: "Create an Excel file with a simple budget spreadsheet"
}
],
tools: [{ type: "code\_execution\_20250825", name: "code\_execution" }]
)
# Step 2: Extract file IDs from the response
def extract\_file\_ids(response)
file\_ids = []
response.content.each do |item|
if item.type == :bash\_code\_execution\_tool\_result
content\_item = item.content
if content\_item.type == :bash\_code\_execution\_result
content\_item.content.each do |file|
file\_ids << file.file\_id
end
end
end
end
file\_ids
end
# Step 3: Download the file using Files API
extract\_file\_ids(response).each do |file\_id|
file\_metadata = client.beta.files.retrieve\_metadata(file\_id)
file\_content = client.beta.files.download(file\_id)
# Step 4: Save to disk
File.binwrite(file\_metadata.filename, file\_content.read)
puts "Downloaded: #{file\_metadata.filename}"
end
```
\*\*Additional Files API operations:\*\*
```bash cURL
# Get file metadata
curl "https://api.anthropic.com/v1/files/$FILE\_ID" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: files-api-2025-04-14"
# List all files
curl "https://api.anthropic.com/v1/files" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: files-api-2025-04-14"
# Delete a file
curl -X DELETE "https://api.anthropic.com/v1/files/$FILE\_ID" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: files-api-2025-04-14"
```
```bash CLI
# Get file metadata
ant beta:files retrieve-metadata --file-id "$FILE\_ID" \
--transform '{filename,size\_bytes}' --format yaml
# List all files
ant beta:files list \
--transform '{filename,created\_at}' --format yaml
# Delete a file
ant beta:files delete --file-id "$FILE\_ID" >/dev/null
```
```python Python
client = anthropic.Anthropic()
file\_id = "file\_011CNha8iCJcU1wXNR6q4V8w"
# Get file metadata
file\_info = client.beta.files.retrieve\_metadata(file\_id=file\_id)
print(f"Filename: {file\_info.filename}, Size: {file\_info.size\_bytes} bytes")
# List all files
for file in client.beta.files.list():
print(f"{file.filename} - {file.created\_at}")
# Delete a file
client.beta.files.delete(file\_id=file\_id)
```
```typescript TypeScript
const client = new Anthropic();
const fileId = "file\_011CNha8iCJcU1wXNR6q4V8w";
// Get file metadata
const fileInfo = await client.beta.files.retrieveMetadata(fileId);
console.log(`Filename: ${fileInfo.filename}, Size: ${fileInfo.size\_bytes} bytes`);
// List all files
for await (const file of client.beta.files.list()) {
console.log(`${file.filename} - ${file.created\_at}`);
}
// Delete a file
await client.beta.files.delete(fileId);
```
```csharp C#
AnthropicClient client = new();
var fileId = "file\_011CNha8iCJcU1wXNR6q4V8w";
// Get file metadata
var fileInfo = await client.Beta.Files.RetrieveMetadata(fileId);
Console.WriteLine($"Filename: {fileInfo.Filename}, Size: {fileInfo.SizeBytes} bytes");
// List files
await foreach (var file in (await client.Beta.Files.List()).Paginate())
{
Console.WriteLine($"{file.Filename} - {file.CreatedAt}");
}
// Delete the file
await client.Beta.Files.Delete(fileId);
```
```go Go
client := anthropic.NewClient()
fileID := "file\_011CNha8iCJcU1wXNR6q4V8w"
// Get file metadata
fileInfo, err := client.Beta.Files.GetMetadata(context.TODO(), fileID, anthropic.BetaFileGetMetadataParams{})
if err != nil {
log.Fatal(err)
}
fmt.Printf("Filename: %s, Size: %d bytes\n", fileInfo.Filename, fileInfo.SizeBytes)
// List all files
files := client.Beta.Files.ListAutoPaging(context.TODO(), anthropic.BetaFileListParams{})
for files.Next() {
file := files.Current()
fmt.Printf("%s - %s\n", file.Filename, file.CreatedAt)
}
if files.Err() != nil {
log.Fatal(files.Err())
}
// Delete a file
\_, err = client.Beta.Files.Delete(context.TODO(), fileID, anthropic.BetaFileDeleteParams{})
if err != nil {
log.Fatal(err)
}
```
```java Java
import com.anthropic.models.beta.files.FileMetadata;
import com.anthropic.models.beta.files.FileListPage;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
String fileId = "file\_011CNha8iCJcU1wXNR6q4V8w";
// Get file metadata
FileMetadata fileInfo = client.beta().files().retrieveMetadata(fileId);
System.out.println("Filename: " + fileInfo.filename() + ", Size: " + fileInfo.sizeBytes() + " bytes");
// List files (first page)
FileListPage files = client.beta().files().list();
for (var file : files.data()) {
System.out.println(file.filename() + " - " + file.createdAt());
}
// Delete a file
client.beta().files().delete(fileId);
}
```
```php PHP
$client = new Client();
$fileId = 'file\_011CNha8iCJcU1wXNR6q4V8w';
// Get file metadata
$fileInfo = $client->beta->files->retrieveMetadata($fileId);
echo "Filename: {$fileInfo->filename}, Size: {$fileInfo->sizeBytes} bytes\n";
// List files (first page)
$files = $client->beta->files->list();
foreach ($files->data as $file) {
echo "{$file->filename} - {$file->createdAt->format(DATE\_ATOM)}\n";
}
// Delete a file
$client->beta->files->delete($fileId);
```
```ruby Ruby
client = Anthropic::Client.new
file\_id = "file\_011CNha8iCJcU1wXNR6q4V8w"
# Get file metadata
file\_info = client.beta.files.retrieve\_metadata(file\_id)
puts "Filename: #{file\_info.filename}, Size: #{file\_info.size\_bytes} bytes"
# List all files
client.beta.files.list.auto\_paging\_each do |file|
puts "#{file.filename} - #{file.created\_at}"
end
# Delete a file
client.beta.files.delete(file\_id)
```

For complete details on the Files API, see the [Files API](/docs/en/api/beta/files/download) documentation.
### Multi-turn conversations
Reuse the same container across multiple messages by specifying the container ID:
```bash cURL
# Multi-turn container reuse doesn't translate well to a one-off shell
# command; one of the SDK options would be a better fit. Capture
# container.id from the first response, then pass it in the next request as
# "container": {"id": "...", "skills": [...]} with the conversation history.
```
```bash CLI
# First request creates container
CONTAINER\_ID=$(ant beta:messages create \
--beta code-execution-2025-08-25,skills-2025-10-02 \
--transform container.id --raw-output <<'YAML'
model: claude-opus-5
max\_tokens: 4096
container:
skills:
- {type: anthropic, skill\_id: xlsx, version: latest}
messages:
- role: user
content: Create a sample sales dataset and analyze it
tools:
- {type: code\_execution\_20250825, name: code\_execution}
YAML
)
# Continue conversation with same container
ant beta:messages create \
--beta code-execution-2025-08-25,skills-2025-10-02 < block.type === "text")
.map((block) => block.text)
.join("\n")
},
{ role: "user", content: "What was the total revenue?" }
];
const response2 = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
id: response1.container!.id, // Reuse container
skills: [{ type: "anthropic", skill\_id: "xlsx", version: "latest" }]
},
messages,
tools: [{ type: "code\_execution\_20250825", name: "code\_execution" }]
});
```
```csharp C#
AnthropicClient client = new();
// First request with a Skill
var parameters1 = new MessageCreateParams
{
Model = "claude-opus-5",
MaxTokens = 4096,
Betas = ["code-execution-2025-08-25", "skills-2025-10-02"],
Container = new BetaContainerParams
{
Skills =
[
new BetaSkillParams
{
Type = BetaSkillParamsType.Anthropic,
SkillID = "xlsx",
Version = "latest",
},
],
},
Messages = [new() { Role = Role.User, Content = "Create a sample sales dataset and analyze it" }],
Tools = [new BetaCodeExecutionTool20250825()],
};
var response1 = await client.Beta.Messages.Create(parameters1);
// Continue the conversation in the same container
// Carry the assistant's text forward; container.id carries the execution state
var assistantText = string.Join(
"\n",
response1.Content.Select(block => block.TryPickText(out var text) ? text.Text : null).Where(text => text is not null)
);
var parameters2 = new MessageCreateParams
{
Model = "claude-opus-5",
MaxTokens = 4096,
Betas = ["code-execution-2025-08-25", "skills-2025-10-02"],
Container = new BetaContainerParams
{
ID = response1.Container!.ID,
Skills =
[
new BetaSkillParams
{
Type = BetaSkillParamsType.Anthropic,
SkillID = "xlsx",
Version = "latest",
},
],
},
Messages =
[
new() { Role = Role.User, Content = "Create a sample sales dataset and analyze it" },
new() { Role = Role.Assistant, Content = assistantText },
new() { Role = Role.User, Content = "What was the total revenue?" },
],
Tools = [new BetaCodeExecutionTool20250825()],
};
var response2 = await client.Beta.Messages.Create(parameters2);
Console.WriteLine(response2);
```
```go Go
client := anthropic.NewClient()
response1, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: "claude-opus-5",
MaxTokens: 4096,
Betas: []anthropic.AnthropicBeta{"code-execution-2025-08-25", anthropic.AnthropicBetaSkills2025\_10\_02},
Container: anthropic.BetaMessageNewParamsContainerUnion{
OfContainers: &anthropic.BetaContainerParams{
Skills: []anthropic.BetaSkillParams{
{
Type: anthropic.BetaSkillParamsTypeAnthropic,
SkillID: "xlsx",
Version: anthropic.String("latest"),
},
},
},
},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Create a sample sales dataset and analyze it")),
},
Tools: []anthropic.BetaToolUnionParam{
{OfCodeExecutionTool20250825: &anthropic.BetaCodeExecutionTool20250825Param{}},
},
})
if err != nil {
log.Fatal(err)
}
// Carry the assistant's text forward; container.id carries the execution state
var textParts []string
for \_, block := range response1.Content {
if block.Type == "text" {
textParts = append(textParts, block.Text)
}
}
assistantText := strings.Join(textParts, "\n")
response2, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: "claude-opus-5",
MaxTokens: 4096,
Betas: []anthropic.AnthropicBeta{"code-execution-2025-08-25", anthropic.AnthropicBetaSkills2025\_10\_02},
Container: anthropic.BetaMessageNewParamsContainerUnion{
OfContainers: &anthropic.BetaContainerParams{
ID: anthropic.String(response1.Container.ID), // Reuse container
Skills: []anthropic.BetaSkillParams{
{
Type: anthropic.BetaSkillParamsTypeAnthropic,
SkillID: "xlsx",
Version: anthropic.String("latest"),
},
},
},
},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Create a sample sales dataset and analyze it")),
{
Role: anthropic.BetaMessageParamRoleAssistant,
Content: []anthropic.BetaContentBlockParamUnion{anthropic.NewBetaTextBlock(assistantText)},
},
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("What was the total revenue?")),
},
Tools: []anthropic.BetaToolUnionParam{
{OfCodeExecutionTool20250825: &anthropic.BetaCodeExecutionTool20250825Param{}},
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response2)
```
```java Java
import com.anthropic.models.beta.messages.BetaContainerParams;
import com.anthropic.models.beta.messages.BetaSkillParams;
import com.anthropic.models.beta.messages.BetaCodeExecutionTool20250825;
import com.anthropic.models.beta.messages.BetaContentBlock;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params1 = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addBeta("code-execution-2025-08-25")
.addBeta("skills-2025-10-02")
.container(BetaContainerParams.builder()
.addSkill(BetaSkillParams.builder()
.type(BetaSkillParams.Type.ANTHROPIC)
.skillId("xlsx")
.version("latest")
.build())
.build())
.addUserMessage("Create a sample sales dataset and analyze it")
.addTool(BetaCodeExecutionTool20250825.builder().build())
.build();
BetaMessage response1 = client.beta().messages().create(params1);
MessageCreateParams params2 = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addBeta("code-execution-2025-08-25")
.addBeta("skills-2025-10-02")
.container(BetaContainerParams.builder()
.id(response1.container().get().id())
.addSkill(BetaSkillParams.builder()
.type(BetaSkillParams.Type.ANTHROPIC)
.skillId("xlsx")
.version("latest")
.build())
.build())
.addUserMessage("Create a sample sales dataset and analyze it")
// Carry the assistant's text forward; container.id carries the execution state
.addAssistantMessage(response1.content().stream()
.filter(BetaContentBlock::isText)
.map(block -> block.asText().text())
.collect(Collectors.joining("\n")))
.addUserMessage("What was the total revenue?")
.addTool(BetaCodeExecutionTool20250825.builder().build())
.build();
BetaMessage response2 = client.beta().messages().create(params2);
System.out.println(response2);
}
```
```php PHP
$client = new Client();
$response1 = $client->beta->messages->create(
maxTokens: 4096,
messages: [
['role' => 'user', 'content' => 'Create a sample sales dataset and analyze it']
],
model: 'claude-opus-5',
betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
container: [
'skills' => [
['type' => 'anthropic', 'skill\_id' => 'xlsx', 'version' => 'latest']
]
],
tools: [
['type' => 'code\_execution\_20250825', 'name' => 'code\_execution']
]
);
$messages = [
['role' => 'user', 'content' => 'Create a sample sales dataset and analyze it'],
// Carry the assistant's text forward; container.id carries the execution state
['role' => 'assistant', 'content' => implode("\n", array\_map(
fn ($block) => $block->text,
array\_filter($response1->content, fn ($block) => $block->type === 'text'),
))],
['role' => 'user', 'content' => 'What was the total revenue?']
];
$response2 = $client->beta->messages->create(
maxTokens: 4096,
messages: $messages,
model: 'claude-opus-5',
betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
container: [
'id' => $response1->container->id,
'skills' => [
['type' => 'anthropic', 'skill\_id' => 'xlsx', 'version' => 'latest']
]
],
tools: [
['type' => 'code\_execution\_20250825', 'name' => 'code\_execution']
]
);
echo $response2;
```
```ruby Ruby
client = Anthropic::Client.new
response1 = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [{ type: "anthropic", skill\_id: "xlsx", version: "latest" }]
},
messages: [
{ role: "user", content: "Create a sample sales dataset and analyze it" }
],
tools: [
{ type: "code\_execution\_20250825", name: "code\_execution" }
]
)
messages = [
{ role: "user", content: "Create a sample sales dataset and analyze it" },
{
# Carry the assistant's text forward; container.id carries the execution state
role: "assistant",
content: response1.content.filter\_map { |block| block.text if block.type == :text }.join("\n")
},
{ role: "user", content: "What was the total revenue?" }
]
response2 = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
id: response1.container.id,
skills: [
{ type: "anthropic", skill\_id: "xlsx", version: "latest" }
]
},
messages: messages,
tools: [
{ type: "code\_execution\_20250825", name: "code\_execution" }
]
)
puts response2
```
### Long-running operations
Skills may perform operations that require multiple turns. Handle `pause\_turn` stop reasons:
```bash cURL
# Initial request
RESPONSE=$(curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 4096,
"container": {
"skills": [
{
"type": "custom",
"skill\_id": "skill\_01AbCdEfGhIjKlMnOpQrStUv",
"version": "latest"
}
]
},
"messages": [{
"role": "user",
"content": "Generate and process a large sample dataset"
}],
"tools": [{
"type": "code\_execution\_20250825",
"name": "code\_execution"
}]
}')
# If stop\_reason is "pause\_turn", continue in the same container, appending
# the prior response's content array to messages as the assistant turn.
# Repeat this continuation request until stop\_reason is no longer "pause\_turn".
STOP\_REASON=$(echo "$RESPONSE" | jq -r '.stop\_reason')
CONTAINER\_ID=$(echo "$RESPONSE" | jq -r '.container.id')
RESPONSE=$(curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
-H "content-type: application/json" \
-d "{
\"model\": \"claude-opus-5\",
\"max\_tokens\": 4096,
\"container\": {
\"id\": \"$CONTAINER\_ID\",
\"skills\": [{
\"type\": \"custom\",
\"skill\_id\": \"skill\_01AbCdEfGhIjKlMnOpQrStUv\",
\"version\": \"latest\"
}]
},
\"messages\": [],
\"tools\": [{
\"type\": \"code\_execution\_20250825\",
\"name\": \"code\_execution\"
}]
}")
```
```bash CLI
RESP=$(mktemp)
# Initial request: capture the full JSON response to a temp file
ant beta:messages create \
--beta code-execution-2025-08-25,skills-2025-10-02 \
> "$RESP" <<'YAML'
model: claude-opus-5
max\_tokens: 4096
container:
skills:
- type: custom
skill\_id: skill\_01AbCdEfGhIjKlMnOpQrStUv
version: latest
messages:
- role: user
content: Generate and process a large sample dataset
tools:
- type: code\_execution\_20250825
name: code\_execution
YAML
# If stop\_reason is "pause\_turn", continue in the same container,
# appending the prior response's content array to messages as the
# assistant turn. Repeat until stop\_reason is no longer "pause\_turn".
CONTAINER\_ID=$(jq -r '.container.id' "$RESP")
ant beta:messages create \
--beta code-execution-2025-08-25,skills-2025-10-02 \
> "$RESP" < messages =
[
new() { Role = Role.User, Content = "Generate and process a large sample dataset" },
];
var maxRetries = 10;
string? containerId = null;
BetaMessage? response = null;
for (var i = 0; i < maxRetries; i++)
{
var parameters = new MessageCreateParams
{
Model = "claude-opus-5",
MaxTokens = 4096,
Betas = ["code-execution-2025-08-25", "skills-2025-10-02"],
Container = containerId is null
? new BetaContainerParams
{
Skills =
[
new BetaSkillParams
{
Type = BetaSkillParamsType.Custom,
SkillID = "skill\_01AbCdEfGhIjKlMnOpQrStUv",
Version = "latest",
},
],
}
: new BetaContainerParams
{
ID = containerId,
Skills =
[
new BetaSkillParams
{
Type = BetaSkillParamsType.Custom,
SkillID = "skill\_01AbCdEfGhIjKlMnOpQrStUv",
Version = "latest",
},
],
},
Messages = messages,
Tools = [new BetaCodeExecutionTool20250825()],
};
response = await client.Beta.Messages.Create(parameters);
containerId = response.Container!.ID;
if (response.StopReason != BetaStopReason.PauseTurn)
{
break;
}
// Append the paused turn's content and continue
var assistantContent = JsonSerializer.SerializeToElement(
response.Content.Select(block => block.Json).ToArray()
);
messages.Add(new() { Role = Role.Assistant, Content = new BetaMessageParamContent(assistantContent) });
}
```
```go Go
client := anthropic.NewClient()
messages := []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Generate and process a large sample dataset")),
}
maxRetries := 10
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: "claude-opus-5",
MaxTokens: 4096,
Betas: []anthropic.AnthropicBeta{"code-execution-2025-08-25", anthropic.AnthropicBetaSkills2025\_10\_02},
Container: anthropic.BetaMessageNewParamsContainerUnion{
OfContainers: &anthropic.BetaContainerParams{
Skills: []anthropic.BetaSkillParams{
{
Type: anthropic.BetaSkillParamsTypeCustom,
SkillID: "skill\_01AbCdEfGhIjKlMnOpQrStUv",
Version: anthropic.String("latest"),
},
},
},
},
Messages: messages,
Tools: []anthropic.BetaToolUnionParam{
{OfCodeExecutionTool20250825: &anthropic.BetaCodeExecutionTool20250825Param{}},
},
})
if err != nil {
log.Fatal(err)
}
for i := 0; i < maxRetries; i++ {
if response.StopReason != anthropic.BetaStopReasonPauseTurn {
break
}
messages = append(messages, response.ToParam())
response, err = client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: "claude-opus-5",
MaxTokens: 4096,
Betas: []anthropic.AnthropicBeta{"code-execution-2025-08-25", anthropic.AnthropicBetaSkills2025\_10\_02},
Container: anthropic.BetaMessageNewParamsContainerUnion{
OfContainers: &anthropic.BetaContainerParams{
ID: anthropic.String(response.Container.ID), // Reuse container
Skills: []anthropic.BetaSkillParams{
{
Type: anthropic.BetaSkillParamsTypeCustom,
SkillID: "skill\_01AbCdEfGhIjKlMnOpQrStUv",
Version: anthropic.String("latest"),
},
},
},
},
Messages: messages,
Tools: []anthropic.BetaToolUnionParam{
{OfCodeExecutionTool20250825: &anthropic.BetaCodeExecutionTool20250825Param{}},
},
})
if err != nil {
log.Fatal(err)
}
}
fmt.Println(response)
```
```java Java
import com.anthropic.models.beta.messages.BetaContainerParams;
import com.anthropic.models.beta.messages.BetaSkillParams;
import com.anthropic.models.beta.messages.BetaCodeExecutionTool20250825;
import com.anthropic.models.beta.messages.BetaStopReason;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
List messages = new ArrayList<>();
messages.add(
BetaMessageParam.builder()
.role(BetaMessageParam.Role.USER)
.content("Generate and process a large sample dataset")
.build()
);
int maxRetries = 10;
BetaMessage response = client.beta().messages().create(
MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addBeta("code-execution-2025-08-25")
.addBeta("skills-2025-10-02")
.container(BetaContainerParams.builder()
.addSkill(BetaSkillParams.builder()
.type(BetaSkillParams.Type.CUSTOM)
.skillId("skill\_01AbCdEfGhIjKlMnOpQrStUv")
.version("latest")
.build())
.build())
.messages(messages)
.addTool(BetaCodeExecutionTool20250825.builder().build())
.build());
for (int i = 0; i < maxRetries; i++) {
if (!response.stopReason().isPresent()
|| !response.stopReason().get().equals(BetaStopReason.PAUSE\_TURN)) {
break;
}
messages.add(response.toParam());
response = client.beta().messages().create(
MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addBeta("code-execution-2025-08-25")
.addBeta("skills-2025-10-02")
.container(BetaContainerParams.builder()
.id(response.container().get().id())
.addSkill(BetaSkillParams.builder()
.type(BetaSkillParams.Type.CUSTOM)
.skillId("skill\_01AbCdEfGhIjKlMnOpQrStUv")
.version("latest")
.build())
.build())
.messages(messages)
.addTool(BetaCodeExecutionTool20250825.builder().build())
.build());
}
}
```
```php PHP
$client = new Client();
$messages = [
['role' => 'user', 'content' => 'Generate and process a large sample dataset']
];
$maxRetries = 10;
$response = $client->beta->messages->create(
maxTokens: 4096,
messages: $messages,
model: 'claude-opus-5',
betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
container: [
'skills' => [
[
'type' => 'custom',
'skill\_id' => 'skill\_01AbCdEfGhIjKlMnOpQrStUv',
'version' => 'latest'
]
]
],
tools: [['type' => 'code\_execution\_20250825', 'name' => 'code\_execution']]
);
for ($i = 0; $i < $maxRetries; $i++) {
if ($response->stopReason !== 'pause\_turn') {
break;
}
$messages[] = ['role' => 'assistant', 'content' => $response->content];
$response = $client->beta->messages->create(
maxTokens: 4096,
messages: $messages,
model: 'claude-opus-5',
betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
container: [
'id' => $response->container->id,
'skills' => [
[
'type' => 'custom',
'skill\_id' => 'skill\_01AbCdEfGhIjKlMnOpQrStUv',
'version' => 'latest'
]
]
],
tools: [['type' => 'code\_execution\_20250825', 'name' => 'code\_execution']]
);
}
```
```ruby Ruby
client = Anthropic::Client.new
messages = [
{ role: "user", content: "Generate and process a large sample dataset" }
]
max\_retries = 10
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [
{
type: "custom",
skill\_id: "skill\_01AbCdEfGhIjKlMnOpQrStUv",
version: "latest"
}
]
},
messages: messages,
tools: [{ type: "code\_execution\_20250825", name: "code\_execution" }]
)
max\_retries.times do
break if response.stop\_reason != :pause\_turn
messages << { role: "assistant", content: response.content }
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
id: response.container.id,
skills: [
{
type: "custom",
skill\_id: "skill\_01AbCdEfGhIjKlMnOpQrStUv",
version: "latest"
}
]
},
messages: messages,
tools: [{ type: "code\_execution\_20250825", name: "code\_execution" }]
)
end
```

The response may include a `pause\_turn` stop reason, which indicates that the API paused a long-running Skill operation. You can provide the response back as-is in a subsequent request to let Claude continue its turn, or modify the content if you want to interrupt the conversation and provide additional guidance.
### Using multiple Skills
Combine multiple Skills in a single request to handle complex workflows:
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 4096,
"container": {
"skills": [
{
"type": "anthropic",
"skill\_id": "xlsx",
"version": "latest"
},
{
"type": "anthropic",
"skill\_id": "pptx",
"version": "latest"
},
{
"type": "custom",
"skill\_id": "skill\_01AbCdEfGhIjKlMnOpQrStUv",
"version": "latest"
}
]
},
"messages": [{
"role": "user",
"content": "Analyze sales data and create a presentation"
}],
"tools": [{
"type": "code\_execution\_20250825",
"name": "code\_execution"
}]
}'
```
```bash CLI
ant beta:messages create \
--beta code-execution-2025-08-25,skills-2025-10-02 <<'YAML'
model: claude-opus-5
max\_tokens: 4096
container:
skills:
- type: anthropic
skill\_id: xlsx
version: latest
- type: anthropic
skill\_id: pptx
version: latest
- type: custom
skill\_id: skill\_01AbCdEfGhIjKlMnOpQrStUv
version: latest
messages:
- role: user
content: Analyze sales data and create a presentation
tools:
- type: code\_execution\_20250825
name: code\_execution
YAML
```
```python Python
client = anthropic.Anthropic()
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=4096,
betas=["code-execution-2025-08-25", "skills-2025-10-02"],
container={
"skills": [
{"type": "anthropic", "skill\_id": "xlsx", "version": "latest"},
{"type": "anthropic", "skill\_id": "pptx", "version": "latest"},
{
"type": "custom",
"skill\_id": "skill\_01AbCdEfGhIjKlMnOpQrStUv",
"version": "latest",
},
]
},
messages=[
{"role": "user", "content": "Analyze sales data and create a presentation"}
],
tools=[{"type": "code\_execution\_20250825", "name": "code\_execution"}],
)
```
```typescript TypeScript
const client = new Anthropic();
const response = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [
{
type: "anthropic",
skill\_id: "xlsx",
version: "latest"
},
{
type: "anthropic",
skill\_id: "pptx",
version: "latest"
},
{
type: "custom",
skill\_id: "skill\_01AbCdEfGhIjKlMnOpQrStUv",
version: "latest"
}
]
},
messages: [
{
role: "user",
content: "Analyze sales data and create a presentation"
}
],
tools: [
{
type: "code\_execution\_20250825",
name: "code\_execution"
}
]
});
```
```csharp C#
AnthropicClient client = new();
var parameters = new MessageCreateParams
{
Model = "claude-opus-5",
MaxTokens = 4096,
Betas = ["code-execution-2025-08-25", "skills-2025-10-02"],
Container = new BetaContainerParams
{
Skills =
[
new BetaSkillParams
{
Type = BetaSkillParamsType.Anthropic,
SkillID = "xlsx",
Version = "latest",
},
new BetaSkillParams
{
Type = BetaSkillParamsType.Anthropic,
SkillID = "pptx",
Version = "latest",
},
new BetaSkillParams
{
Type = BetaSkillParamsType.Custom,
SkillID = "skill\_01AbCdEfGhIjKlMnOpQrStUv",
Version = "latest",
},
],
},
Messages = [new() { Role = Role.User, Content = "Analyze sales data and create a presentation" }],
Tools = [new BetaCodeExecutionTool20250825()],
};
var message = await client.Beta.Messages.Create(parameters);
Console.WriteLine(message);
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: "claude-opus-5",
MaxTokens: 4096,
Betas: []anthropic.AnthropicBeta{
"code-execution-2025-08-25",
anthropic.AnthropicBetaSkills2025\_10\_02,
},
Container: anthropic.BetaMessageNewParamsContainerUnion{
OfContainers: &anthropic.BetaContainerParams{
Skills: []anthropic.BetaSkillParams{
{
Type: anthropic.BetaSkillParamsTypeAnthropic,
SkillID: "xlsx",
Version: anthropic.String("latest"),
},
{
Type: anthropic.BetaSkillParamsTypeAnthropic,
SkillID: "pptx",
Version: anthropic.String("latest"),
},
{
Type: anthropic.BetaSkillParamsTypeCustom,
SkillID: "skill\_01AbCdEfGhIjKlMnOpQrStUv",
Version: anthropic.String("latest"),
},
},
},
},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Analyze sales data and create a presentation")),
},
Tools: []anthropic.BetaToolUnionParam{
{OfCodeExecutionTool20250825: &anthropic.BetaCodeExecutionTool20250825Param{}},
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
import com.anthropic.models.beta.messages.BetaContainerParams;
import com.anthropic.models.beta.messages.BetaSkillParams;
import com.anthropic.models.beta.messages.BetaCodeExecutionTool20250825;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addBeta("code-execution-2025-08-25")
.addBeta("skills-2025-10-02")
.container(BetaContainerParams.builder()
.skills(List.of(
BetaSkillParams.builder()
.type(BetaSkillParams.Type.ANTHROPIC)
.skillId("xlsx")
.version("latest")
.build(),
BetaSkillParams.builder()
.type(BetaSkillParams.Type.ANTHROPIC)
.skillId("pptx")
.version("latest")
.build(),
BetaSkillParams.builder()
.type(BetaSkillParams.Type.CUSTOM)
.skillId("skill\_01AbCdEfGhIjKlMnOpQrStUv")
.version("latest")
.build()
))
.build())
.addUserMessage("Analyze sales data and create a presentation")
.addTool(BetaCodeExecutionTool20250825.builder().build())
.build();
BetaMessage response = client.beta().messages().create(params);
System.out.println(response);
}
```
```php PHP
$client = new Client();
$message = $client->beta->messages->create(
maxTokens: 4096,
messages: [
['role' => 'user', 'content' => 'Analyze sales data and create a presentation']
],
model: 'claude-opus-5',
betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
container: [
'skills' => [
[
'type' => 'anthropic',
'skill\_id' => 'xlsx',
'version' => 'latest'
],
[
'type' => 'anthropic',
'skill\_id' => 'pptx',
'version' => 'latest'
],
[
'type' => 'custom',
'skill\_id' => 'skill\_01AbCdEfGhIjKlMnOpQrStUv',
'version' => 'latest'
]
]
],
tools: [
['type' => 'code\_execution\_20250825', 'name' => 'code\_execution']
]
);
echo $message;
```
```ruby Ruby
client = Anthropic::Client.new
message = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [
{
type: "anthropic",
skill\_id: "xlsx",
version: "latest"
},
{
type: "anthropic",
skill\_id: "pptx",
version: "latest"
},
{
type: "custom",
skill\_id: "skill\_01AbCdEfGhIjKlMnOpQrStUv",
version: "latest"
}
]
},
messages: [
{ role: "user", content: "Analyze sales data and create a presentation" }
],
tools: [
{ type: "code\_execution\_20250825", name: "code\_execution" }
]
)
puts message
```
\*\*\*
## Managing custom Skills
### Creating a Skill
A Skill bundle is a directory containing a `SKILL.md` file at the top level with `name` and `description` YAML frontmatter, plus any supporting scripts or resources. See [Get started with Agent Skills in the API](/docs/en/agents-and-tools/agent-skills/quickstart) to author one, and the \*\*Requirements\*\* list following the examples for the full constraints.
Upload your custom Skill to make it available in your workspace. You can upload a zip archive or individual file objects; the Python SDK additionally provides a `files\_from\_dir` helper that accepts a directory path.
Files are identified by the filename you attach. Per-file uploads must keep a common top-level directory in their paths (the `;filename=` suffix in the cURL example and the filename arguments in the SDK examples), and a zip archive must contain the skill directory as its single top-level entry.
```bash cURL
curl -X POST "https://api.anthropic.com/v1/skills" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: skills-2025-10-02" \
-F "files[]=@financial\_skill/SKILL.md;filename=financial\_skill/SKILL.md" \
-F "files[]=@financial\_skill/analyze.py;filename=financial\_skill/analyze.py"
```
```bash CLI
ant beta:skills create \
--file example\_skill.zip \
--beta skills-2025-10-02
# Per-file upload requires path-qualified filenames, which the CLI
# can't currently set. Upload a zip archive instead.
```
```python Python
from anthropic.lib import files\_from\_dir
client = anthropic.Anthropic()
# Option 1: Using a zip file
skill = client.beta.skills.create(
files=[open("example\_skill.zip", "rb")],
)
# Option 2: Using file tuples (filename, file\_content, mime\_type)
skill = client.beta.skills.create(
files=[
(
"financial\_skill/SKILL.md",
open("financial\_skill/SKILL.md", "rb"),
"text/markdown",
),
(
"financial\_skill/analyze.py",
open("financial\_skill/analyze.py", "rb"),
"text/x-python",
),
],
)
# Option 3: Using the files\_from\_dir helper (Python only)
skill = client.beta.skills.create(
files=files\_from\_dir("financial\_skill"),
)
print(f"Created skill: {skill.id}")
print(f"Latest version: {skill.latest\_version}")
```
```typescript TypeScript
import { toFile } from "@anthropic-ai/sdk";
import fs from "node:fs";
// ...
const client = new Anthropic();
// Option 1: Using a zip file
const skillFromZip = await client.beta.skills.create({
files: [await toFile(fs.createReadStream("example\_skill.zip"), "example\_skill.zip")]
});
// Option 2: Using individual file objects
const skill = await client.beta.skills.create({
files: [
await toFile(fs.createReadStream("financial\_skill/SKILL.md"), "financial\_skill/SKILL.md", {
type: "text/markdown"
}),
await toFile(
fs.createReadStream("financial\_skill/analyze.py"),
"financial\_skill/analyze.py",
{ type: "text/x-python" }
)
]
});
console.log(`Created skill: ${skill.id}`);
console.log(`Latest version: ${skill.latest\_version}`);
```
```csharp C#
using Anthropic.Core;
// ...
AnthropicClient client = new();
// Option 1: Using a zip file
var parameters = new SkillCreateParams
{
Files = [File.OpenRead("example\_skill.zip")],
};
var skill = await client.Beta.Skills.Create(parameters);
// Option 2: Using individual files (path-qualified filenames preserve the Skill's directory layout)
var parameters2 = new SkillCreateParams
{
Files =
[
new BinaryContent
{
Stream = File.OpenRead("financial\_skill/SKILL.md"),
FileName = "financial\_skill/SKILL.md",
},
new BinaryContent
{
Stream = File.OpenRead("financial\_skill/analyze.py"),
FileName = "financial\_skill/analyze.py",
},
],
};
var skill2 = await client.Beta.Skills.Create(parameters2);
Console.WriteLine($"Created skill: {skill.ID}");
Console.WriteLine($"Latest version: {skill.LatestVersion}");
Console.WriteLine($"Created skill 2: {skill2.ID}");
```
```go Go
client := anthropic.NewClient()
// Option 1: Using a zip file
zipFile, err := os.Open("example\_skill.zip")
if err != nil {
log.Fatal(err)
}
defer zipFile.Close()
skill, err := client.Beta.Skills.New(context.TODO(), anthropic.BetaSkillNewParams{
Files: []io.Reader{zipFile},
})
if err != nil {
log.Fatal(err)
}
// Option 2: Using individual files
skillMd, err := os.Open("financial\_skill/SKILL.md")
if err != nil {
log.Fatal(err)
}
defer skillMd.Close()
analyzePy, err := os.Open("financial\_skill/analyze.py")
if err != nil {
log.Fatal(err)
}
defer analyzePy.Close()
skill2, err := client.Beta.Skills.New(context.TODO(), anthropic.BetaSkillNewParams{
Files: []io.Reader{
anthropic.File(skillMd, "financial\_skill/SKILL.md", "text/markdown"),
anthropic.File(analyzePy, "financial\_skill/analyze.py", "text/x-python"),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Printf("Created skill: %s\n", skill.ID)
fmt.Printf("Latest version: %s\n", skill.LatestVersion)
fmt.Printf("Created skill 2: %s\n", skill2.ID)
```
```java Java
import com.anthropic.core.MultipartField;
import com.anthropic.models.beta.skills.SkillCreateParams;
import com.anthropic.models.beta.skills.SkillCreateResponse;
// ...
void main() throws Exception {
// ...
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
// Option 1: Using a zip file
SkillCreateParams params = SkillCreateParams.builder()
.addFile(MultipartField.builder()
.value(Files.newInputStream(Path.of("example\_skill.zip")))
.filename("example\_skill.zip")
.contentType("application/zip")
.build())
.build();
SkillCreateResponse skill = client.beta().skills().create(params);
// Option 2: Using individual files (path-qualified filenames preserve the Skill's directory layout)
SkillCreateParams params2 = SkillCreateParams.builder()
.addFile(MultipartField.builder()
.value(Files.newInputStream(Path.of("financial\_skill/SKILL.md")))
.filename("financial\_skill/SKILL.md")
.contentType("text/markdown")
.build())
.addFile(MultipartField.builder()
.value(Files.newInputStream(Path.of("financial\_skill/analyze.py")))
.filename("financial\_skill/analyze.py")
.contentType("text/x-python")
.build())
.build();
SkillCreateResponse skill2 = client.beta().skills().create(params2);
System.out.println("Created skill: " + skill.id());
System.out.println("Latest version: " + skill.latestVersion().orElseThrow());
System.out.println("Created skill 2: " + skill2.id());
}
```
```php PHP
use Anthropic\Core\FileParam;
// ...
$client = new Client();
// Option 1: Using a zip file
$skill = $client->beta->skills->create(
files: [
FileParam::fromResource(fopen('example\_skill.zip', 'r'))
],
);
// Option 2: Using individual files
$skill = $client->beta->skills->create(
files: [
FileParam::fromResource(fopen('financial\_skill/SKILL.md', 'r'), 'financial\_skill/SKILL.md', 'text/markdown'),
FileParam::fromResource(fopen('financial\_skill/analyze.py', 'r'), 'financial\_skill/analyze.py', 'text/x-python')
],
);
echo "Created skill: {$skill->id}\n";
echo "Latest version: {$skill->latestVersion}\n";
```
```ruby Ruby
client = Anthropic::Client.new
# Option 1: Using a zip file
skill = client.beta.skills.create(
files: [
File.open("example\_skill.zip", "rb")
]
)
# Option 2: Using individual files
skill = client.beta.skills.create(
files: [
Anthropic::FilePart.new(
Pathname("financial\_skill/SKILL.md"),
filename: "financial\_skill/SKILL.md",
content\_type: "text/markdown"
),
Anthropic::FilePart.new(
Pathname("financial\_skill/analyze.py"),
filename: "financial\_skill/analyze.py",
content\_type: "text/x-python"
)
]
)
puts "Created skill: #{skill.id}"
puts "Latest version: #{skill.latest\_version}"
```
\*\*Requirements:\*\*
\* Must include a SKILL.md file at the top level
\* All files must specify a common root directory in their paths
\* The top-level directory name must match the `name` in SKILL.md frontmatter (case and underscore insensitive: `Financial\_Skill` matches `financial-skill`)
\* `display\_title` is optional: when omitted, it derives from the SKILL.md `name`; an explicit value must be unique among the custom skills in your workspace
\* Total upload size must be under 30 MB
\* YAML frontmatter requirements:
\* `name`: Maximum 64 characters, lowercase letters/numbers/hyphens only, no XML tags, no reserved words ("anthropic", "claude")
\* `description`: Maximum 1024 characters, non-empty, no XML tags
For complete request/response schemas, see the [Create Skill API reference](/docs/en/api/beta/skills/create).
### Listing Skills
Retrieve all Skills available to your workspace, including both Anthropic pre-built Skills and your custom Skills. Use the `source` parameter to filter by skill type:
```bash cURL
# List all Skills
curl "https://api.anthropic.com/v1/skills" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: skills-2025-10-02"
# List only custom Skills
curl "https://api.anthropic.com/v1/skills?source=custom" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: skills-2025-10-02"
```
```bash CLI
# List all Skills
ant beta:skills list
# List only custom Skills
ant beta:skills list --source custom
```
```python Python
client = anthropic.Anthropic()
# List all Skills
for skill in client.beta.skills.list():
print(f"{skill.id}: {skill.display\_title} (source: {skill.source})")
# List only custom Skills
custom\_skills = client.beta.skills.list(source="custom")
```
```typescript TypeScript
const client = new Anthropic();
// List all Skills
for await (const skill of client.beta.skills.list()) {
console.log(`${skill.id}: ${skill.display\_title} (source: ${skill.source})`);
}
// List only custom Skills
const customSkills = await client.beta.skills.list({
source: "custom"
});
```
```csharp C#
AnthropicClient client = new();
// List all Skills
await foreach (var skill in (await client.Beta.Skills.List()).Paginate())
{
Console.WriteLine($"{skill.ID}: {skill.DisplayTitle} (source: {skill.Source})");
}
// List only custom Skills
var customSkills = await client.Beta.Skills.List(new SkillListParams { Source = "custom" });
```
```go Go
client := anthropic.NewClient()
// List all Skills
skills := client.Beta.Skills.ListAutoPaging(context.TODO(), anthropic.BetaSkillListParams{})
for skills.Next() {
skill := skills.Current()
fmt.Printf("%s: %s (source: %s)\n", skill.ID, skill.DisplayTitle, skill.Source)
}
if skills.Err() != nil {
log.Fatal(skills.Err())
}
// List only custom Skills
customSkills := client.Beta.Skills.ListAutoPaging(context.TODO(), anthropic.BetaSkillListParams{
Source: anthropic.String("custom"),
})
for customSkills.Next() {
skill := customSkills.Current()
fmt.Printf("%s: %s (source: %s)\n", skill.ID, skill.DisplayTitle, skill.Source)
}
if customSkills.Err() != nil {
log.Fatal(customSkills.Err())
}
```
```java Java
import com.anthropic.models.beta.skills.SkillListParams;
import com.anthropic.models.beta.skills.SkillListPage;
import com.anthropic.models.beta.skills.SkillListResponse;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
// List Skills (first page)
SkillListPage skills = client.beta().skills().list();
for (SkillListResponse skill : skills.data()) {
System.out.println(skill.id() + ": " + skill.displayTitle().orElseThrow() + " (source: " + skill.source() + ")");
}
// List only custom Skills
SkillListParams customParams = SkillListParams.builder()
.source("custom")
.build();
SkillListPage customSkills = client.beta().skills().list(customParams);
}
```
```php PHP
$client = new Client();
// List Skills (first page)
$skills = $client->beta->skills->list();
foreach ($skills->data as $skill) {
echo "{$skill->id}: {$skill->displayTitle} (source: {$skill->source})\n";
}
// List only custom Skills
$customSkills = $client->beta->skills->list(
source: 'custom',
);
```
```ruby Ruby
client = Anthropic::Client.new
# List all Skills
client.beta.skills.list.auto\_paging\_each do |skill|
puts "#{skill.id}: #{skill.display\_title} (source: #{skill.source})"
end
# List only custom Skills
custom\_skills = client.beta.skills.list(
source: "custom"
)
```
See the [List Skills API reference](/docs/en/api/beta/skills/list) for pagination and filtering options.
### Retrieving a Skill
Get details about a specific Skill:
```bash cURL
curl "https://api.anthropic.com/v1/skills/skill\_01AbCdEfGhIjKlMnOpQrStUv" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: skills-2025-10-02"
```
```bash CLI
ant beta:skills retrieve \
--skill-id skill\_01AbCdEfGhIjKlMnOpQrStUv
```
```python Python
client = anthropic.Anthropic()
skill = client.beta.skills.retrieve(skill\_id="skill\_01AbCdEfGhIjKlMnOpQrStUv")
print(f"Skill: {skill.display\_title}")
print(f"Latest version: {skill.latest\_version}")
print(f"Created: {skill.created\_at}")
```
```typescript TypeScript
const client = new Anthropic();
const skill = await client.beta.skills.retrieve("skill\_01AbCdEfGhIjKlMnOpQrStUv");
console.log(`Skill: ${skill.display\_title}`);
console.log(`Latest version: ${skill.latest\_version}`);
console.log(`Created: ${skill.created\_at}`);
```
```csharp C#
AnthropicClient client = new();
var skill = await client.Beta.Skills.Retrieve("skill\_01AbCdEfGhIjKlMnOpQrStUv");
Console.WriteLine($"Skill: {skill.DisplayTitle}");
Console.WriteLine($"Latest version: {skill.LatestVersion}");
Console.WriteLine($"Created: {skill.CreatedAt}");
```
```go Go
client := anthropic.NewClient()
skill, err := client.Beta.Skills.Get(
context.TODO(),
"skill\_01AbCdEfGhIjKlMnOpQrStUv",
anthropic.BetaSkillGetParams{},
)
if err != nil {
log.Fatal(err)
}
fmt.Printf("Skill: %s\n", skill.DisplayTitle)
fmt.Printf("Latest version: %s\n", skill.LatestVersion)
fmt.Printf("Created: %s\n", skill.CreatedAt)
```
```java Java
import com.anthropic.models.beta.skills.SkillRetrieveResponse;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
SkillRetrieveResponse skill = client.beta().skills().retrieve("skill\_01AbCdEfGhIjKlMnOpQrStUv");
System.out.println("Skill: " + skill.displayTitle().orElseThrow());
System.out.println("Latest version: " + skill.latestVersion().orElseThrow());
System.out.println("Created: " + skill.createdAt());
}
```
```php PHP
$client = new Client();
$skill = $client->beta->skills->retrieve(
skillID: 'skill\_01AbCdEfGhIjKlMnOpQrStUv',
);
echo "Skill: " . $skill->displayTitle . "\n";
echo "Latest version: " . $skill->latestVersion . "\n";
echo "Created: " . $skill->createdAt . "\n";
```
```ruby Ruby
client = Anthropic::Client.new
skill = client.beta.skills.retrieve("skill\_01AbCdEfGhIjKlMnOpQrStUv")
puts "Skill: #{skill.display\_title}"
puts "Latest version: #{skill.latest\_version}"
puts "Created: #{skill.created\_at}"
```
### Deleting a Skill
To delete a Skill, you must first delete all its versions:
```bash cURL
# Step 1: List the versions, then delete each one
curl "https://api.anthropic.com/v1/skills/skill\_01AbCdEfGhIjKlMnOpQrStUv/versions" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: skills-2025-10-02"
# Repeat for each version the list returned
curl -X DELETE "https://api.anthropic.com/v1/skills/skill\_01AbCdEfGhIjKlMnOpQrStUv/versions/1759178010641129" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: skills-2025-10-02"
# Step 2: Delete the Skill
curl -X DELETE "https://api.anthropic.com/v1/skills/skill\_01AbCdEfGhIjKlMnOpQrStUv" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: skills-2025-10-02"
```
```bash CLI
# Step 1: List the versions, then delete each one
ant beta:skills:versions list \
--skill-id skill\_01AbCdEfGhIjKlMnOpQrStUv \
--transform version --raw-output
# Repeat for each version id the list returned
ant beta:skills:versions delete \
--skill-id skill\_01AbCdEfGhIjKlMnOpQrStUv \
--version 1759178010641129 >/dev/null
# Step 2: Delete the Skill
ant beta:skills delete \
--skill-id skill\_01AbCdEfGhIjKlMnOpQrStUv >/dev/null
```
```python Python
client = anthropic.Anthropic()
# Step 1: Delete all versions
for version in client.beta.skills.versions.list(
skill\_id="skill\_01AbCdEfGhIjKlMnOpQrStUv"
):
client.beta.skills.versions.delete(
skill\_id="skill\_01AbCdEfGhIjKlMnOpQrStUv",
version=version.version,
)
# Step 2: Delete the Skill
client.beta.skills.delete(skill\_id="skill\_01AbCdEfGhIjKlMnOpQrStUv")
```
```typescript TypeScript
const client = new Anthropic();
// Step 1: Delete all versions
for await (const version of client.beta.skills.versions.list(
"skill\_01AbCdEfGhIjKlMnOpQrStUv"
)) {
await client.beta.skills.versions.delete(version.version, {
skill\_id: "skill\_01AbCdEfGhIjKlMnOpQrStUv"
});
}
// Step 2: Delete the Skill
await client.beta.skills.delete("skill\_01AbCdEfGhIjKlMnOpQrStUv");
```
```csharp C#
using Anthropic.Models.Beta.Skills.Versions;
// ...
AnthropicClient client = new();
// Step 1: Delete all versions
await foreach (var version in (await client.Beta.Skills.Versions.List("skill\_01AbCdEfGhIjKlMnOpQrStUv")).Paginate())
{
await client.Beta.Skills.Versions.Delete(
version.Version,
new VersionDeleteParams { SkillID = "skill\_01AbCdEfGhIjKlMnOpQrStUv" }
);
}
// Step 2: Delete the Skill
await client.Beta.Skills.Delete("skill\_01AbCdEfGhIjKlMnOpQrStUv");
```
```go Go
client := anthropic.NewClient()
// Step 1: Delete all versions
versions := client.Beta.Skills.Versions.ListAutoPaging(
context.TODO(),
"skill\_01AbCdEfGhIjKlMnOpQrStUv",
anthropic.BetaSkillVersionListParams{},
)
for versions.Next() {
version := versions.Current()
\_, err := client.Beta.Skills.Versions.Delete(
context.TODO(),
version.Version,
anthropic.BetaSkillVersionDeleteParams{
SkillID: "skill\_01AbCdEfGhIjKlMnOpQrStUv",
},
)
if err != nil {
log.Fatal(err)
}
}
if versions.Err() != nil {
log.Fatal(versions.Err())
}
// Step 2: Delete the Skill
\_, err := client.Beta.Skills.Delete(
context.TODO(),
"skill\_01AbCdEfGhIjKlMnOpQrStUv",
anthropic.BetaSkillDeleteParams{},
)
if err != nil {
log.Fatal(err)
}
```
```java Java
import com.anthropic.models.beta.skills.versions.VersionListPage;
import com.anthropic.models.beta.skills.versions.VersionDeleteParams;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
// Step 1: Delete all versions
VersionListPage versions = client.beta().skills().versions().list("skill\_01AbCdEfGhIjKlMnOpQrStUv");
for (var version : versions.autoPager()) {
client.beta().skills().versions().delete(
version.version(),
VersionDeleteParams.builder()
.skillId("skill\_01AbCdEfGhIjKlMnOpQrStUv")
.build()
);
}
// Step 2: Delete the Skill
client.beta().skills().delete("skill\_01AbCdEfGhIjKlMnOpQrStUv");
}
```
```php PHP
$client = new Client();
// Step 1: Delete all versions
$versions = $client->beta->skills->versions->list(
skillID: 'skill\_01AbCdEfGhIjKlMnOpQrStUv',
);
foreach ($versions->pagingEachItem() as $version) {
$client->beta->skills->versions->delete(
skillID: 'skill\_01AbCdEfGhIjKlMnOpQrStUv',
version: $version->version,
);
}
// Step 2: Delete the Skill
$client->beta->skills->delete(
skillID: 'skill\_01AbCdEfGhIjKlMnOpQrStUv',
);
```
```ruby Ruby
client = Anthropic::Client.new
# Step 1: Delete all versions
client.beta.skills.versions.list("skill\_01AbCdEfGhIjKlMnOpQrStUv").auto\_paging\_each do |version|
client.beta.skills.versions.delete(
version.version,
skill\_id: "skill\_01AbCdEfGhIjKlMnOpQrStUv"
)
end
# Step 2: Delete the Skill
client.beta.skills.delete("skill\_01AbCdEfGhIjKlMnOpQrStUv")
```
Attempting to delete a Skill with existing versions returns a 400 error.
### Versioning
Skills support versioning to manage updates safely:
\*\*Anthropic Skills:\*\*
\* Versions use date format: `20251013`
\* New versions released as updates are made
\* Specify exact versions for stability
\*\*Custom Skills:\*\*
\* Auto-generated epoch timestamps: `1759178010641129`
\* Use `"latest"` to always get the most recent version
\* Create new versions when updating Skill files
```bash cURL
# Create a new version
NEW\_VERSION=$(curl -X POST "https://api.anthropic.com/v1/skills/skill\_01AbCdEfGhIjKlMnOpQrStUv/versions" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: skills-2025-10-02" \
-F "files[]=@updated\_skill/SKILL.md;filename=updated\_skill/SKILL.md")
VERSION\_NUMBER=$(echo "$NEW\_VERSION" | jq -r '.version')
# Use specific version
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
-H "content-type: application/json" \
-d "{
\"model\": \"claude-opus-5\",
\"max\_tokens\": 4096,
\"container\": {
\"skills\": [{
\"type\": \"custom\",
\"skill\_id\": \"skill\_01AbCdEfGhIjKlMnOpQrStUv\",
\"version\": \"$VERSION\_NUMBER\"
}]
},
\"messages\": [{\"role\": \"user\", \"content\": \"Use updated Skill\"}],
\"tools\": [{\"type\": \"code\_execution\_20250825\", \"name\": \"code\_execution\"}]
}"
# Use latest version
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 4096,
"container": {
"skills": [{
"type": "custom",
"skill\_id": "skill\_01AbCdEfGhIjKlMnOpQrStUv",
"version": "latest"
}]
},
"messages": [{"role": "user", "content": "Use latest Skill version"}],
"tools": [{"type": "code\_execution\_20250825", "name": "code\_execution"}]
}'
```
```bash CLI
# Create a new version
VERSION\_NUMBER=$(ant beta:skills:versions create \
--skill-id skill\_01AbCdEfGhIjKlMnOpQrStUv \
--file updated\_skill.zip \
--transform version --raw-output)
# Use specific version
ant beta:messages create \
--beta code-execution-2025-08-25,skills-2025-10-02 <builder()
.value(Files.newInputStream(Path.of("/path/to/updated\_skill/SKILL.md")))
.filename("updated\_skill/SKILL.md")
.contentType("text/markdown")
.build())
.build();
VersionCreateResponse newVersion = client.beta().skills().versions()
.create("skill\_01AbCdEfGhIjKlMnOpQrStUv", versionParams);
// Use specific version
MessageCreateParams specificVersionParams = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addBeta("code-execution-2025-08-25")
.addBeta("skills-2025-10-02")
.container(BetaContainerParams.builder()
.addSkill(BetaSkillParams.builder()
.type(BetaSkillParams.Type.CUSTOM)
.skillId("skill\_01AbCdEfGhIjKlMnOpQrStUv")
.version(newVersion.version())
.build())
.build())
.addUserMessage("Use updated Skill")
.addTool(BetaCodeExecutionTool20250825.builder().build())
.build();
BetaMessage response = client.beta().messages().create(specificVersionParams);
System.out.println(response);
// Use latest version
MessageCreateParams latestVersionParams = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addBeta("code-execution-2025-08-25")
.addBeta("skills-2025-10-02")
.container(BetaContainerParams.builder()
.addSkill(BetaSkillParams.builder()
.type(BetaSkillParams.Type.CUSTOM)
.skillId("skill\_01AbCdEfGhIjKlMnOpQrStUv")
.version("latest")
.build())
.build())
.addUserMessage("Use latest Skill version")
.addTool(BetaCodeExecutionTool20250825.builder().build())
.build();
BetaMessage latestResponse = client.beta().messages().create(latestVersionParams);
System.out.println(latestResponse);
}
```
```php PHP
use Anthropic\Core\FileParam;
$client = new Client();
// Create a new version
$newVersion = $client->beta->skills->versions->create(
skillID: 'skill\_01AbCdEfGhIjKlMnOpQrStUv',
files: [FileParam::fromResource(fopen('/path/to/updated\_skill/SKILL.md', 'r'), 'updated\_skill/SKILL.md', 'text/markdown')],
);
// Use specific version
$response = $client->beta->messages->create(
maxTokens: 4096,
messages: [['role' => 'user', 'content' => 'Use updated Skill']],
model: 'claude-opus-5',
betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
container: [
'skills' => [[
'type' => 'custom',
'skill\_id' => 'skill\_01AbCdEfGhIjKlMnOpQrStUv',
'version' => $newVersion->version
]]
],
tools: [['type' => 'code\_execution\_20250825', 'name' => 'code\_execution']]
);
echo $response;
// Use latest version
$latestResponse = $client->beta->messages->create(
maxTokens: 4096,
messages: [['role' => 'user', 'content' => 'Use latest Skill version']],
model: 'claude-opus-5',
betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
container: [
'skills' => [[
'type' => 'custom',
'skill\_id' => 'skill\_01AbCdEfGhIjKlMnOpQrStUv',
'version' => 'latest'
]]
],
tools: [['type' => 'code\_execution\_20250825', 'name' => 'code\_execution']]
);
echo $latestResponse;
```
```ruby Ruby
client = Anthropic::Client.new
# Create a new version
new\_version = client.beta.skills.versions.create(
"skill\_01AbCdEfGhIjKlMnOpQrStUv",
files: [
Anthropic::FilePart.new(
Pathname("/path/to/updated\_skill/SKILL.md"),
filename: "updated\_skill/SKILL.md",
content\_type: "text/markdown"
)
]
)
# Use specific version
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [{
type: "custom",
skill\_id: "skill\_01AbCdEfGhIjKlMnOpQrStUv",
version: new\_version.version
}]
},
messages: [{ role: "user", content: "Use updated Skill" }],
tools: [{ type: "code\_execution\_20250825", name: "code\_execution" }]
)
puts response
# Use latest version
latest\_response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [{
type: "custom",
skill\_id: "skill\_01AbCdEfGhIjKlMnOpQrStUv",
version: "latest"
}]
},
messages: [{ role: "user", content: "Use latest Skill version" }],
tools: [{ type: "code\_execution\_20250825", name: "code\_execution" }]
)
puts latest\_response
```
See the [Create Skill Version API reference](/docs/en/api/beta/skills/versions/create) for complete details.
\*\*\*
## How Skills are loaded
When you specify Skills in a container:
1. \*\*Metadata discovery:\*\* Claude sees metadata for each Skill (name, description) in the system prompt.
2. \*\*File loading:\*\* Skill files are copied into the container at `/skills/{directory}/`.
3. \*\*Automatic use:\*\* Claude automatically loads and uses Skills when relevant to your request.
4. \*\*Composition:\*\* Multiple Skills compose together for complex workflows.
The progressive disclosure architecture ensures efficient context usage: Claude only loads full Skill instructions when needed.
\*\*\*
## Use cases
### Organizational Skills
\*\*Brand & Communications\*\*
\* Apply company-specific formatting (colors, fonts, layouts) to documents
\* Generate communications following organizational templates
\* Ensure consistent brand guidelines across all outputs
\*\*Project Management\*\*
\* Structure notes with company-specific formats (OKRs, decision logs)
\* Generate tasks following team conventions
\* Create standardized meeting recaps and status updates
\*\*Business Operations\*\*
\* Create company-standard reports, proposals, and analyses
\* Execute company-specific analytical procedures
\* Generate financial models following organizational templates
### Personal Skills
\*\*Content Creation\*\*
\* Custom document templates
\* Specialized formatting and styling
\* Domain-specific content generation
\*\*Data Analysis\*\*
\* Custom data processing pipelines
\* Specialized visualization templates
\* Industry-specific analytical methods
\*\*Development & Automation\*\*
\* Code generation templates
\* Testing frameworks
\* Deployment workflows
### Example: financial modeling
Combine Excel and custom DCF analysis Skills:
```bash cURL
# Create custom DCF analysis Skill
DCF\_SKILL=$(curl -X POST "https://api.anthropic.com/v1/skills" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: skills-2025-10-02" \
-F "files[]=@dcf\_skill/SKILL.md;filename=dcf\_skill/SKILL.md")
DCF\_SKILL\_ID=$(echo "$DCF\_SKILL" | jq -r '.id')
# Use with Excel to create financial model
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
-H "content-type: application/json" \
-d "{
\"model\": \"claude-opus-5\",
\"max\_tokens\": 4096,
\"container\": {
\"skills\": [
{
\"type\": \"anthropic\",
\"skill\_id\": \"xlsx\",
\"version\": \"latest\"
},
{
\"type\": \"custom\",
\"skill\_id\": \"$DCF\_SKILL\_ID\",
\"version\": \"latest\"
}
]
},
\"messages\": [{
\"role\": \"user\",
\"content\": \"Build a DCF valuation model for a SaaS company\"
}],
\"tools\": [{
\"type\": \"code\_execution\_20250825\",
\"name\": \"code\_execution\"
}]
}"
```
```bash CLI
# Create custom DCF analysis Skill
DCF\_SKILL\_ID=$(ant beta:skills create \
--file dcf\_skill.zip \
--transform id --raw-output)
# Use with Excel to create financial model
ant beta:messages create \
--beta code-execution-2025-08-25,skills-2025-10-02 <beta->messages->create(
maxTokens: 4096,
messages: [
['role' => 'user', 'content' => 'Build a DCF valuation model for a SaaS company']
],
model: 'claude-opus-5',
betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
container: [
'skills' => [
['type' => 'anthropic', 'skill\_id' => 'xlsx', 'version' => 'latest'],
['type' => 'custom', 'skill\_id' => $dcfSkillId, 'version' => 'latest']
]
],
tools: [
['type' => 'code\_execution\_20250825', 'name' => 'code\_execution']
]
);
echo $message;
```
```ruby Ruby
client = Anthropic::Client.new
# Create custom DCF analysis Skill
dcf\_skill = client.beta.skills.create(
files: [
Anthropic::FilePart.new(
Pathname("dcf\_skill/SKILL.md"),
filename: "dcf\_skill/SKILL.md",
content\_type: "text/markdown"
)
]
)
# Use with Excel to create financial model
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [
{ type: "anthropic", skill\_id: "xlsx", version: "latest" },
{ type: "custom", skill\_id: dcf\_skill.id, version: "latest" }
]
},
messages: [
{ role: "user", content: "Build a DCF valuation model for a SaaS company" }
],
tools: [{ type: "code\_execution\_20250825", name: "code\_execution" }]
)
puts response
```
\*\*\*
## Limits and constraints
### Request limits
\* \*\*Maximum Skills per request:\*\* 8
\* \*\*Maximum Skill upload size:\*\* 30 MB (all files combined)
\* \*\*YAML frontmatter requirements:\*\*
\* `name`: Maximum 64 characters, lowercase letters/numbers/hyphens only, no XML tags, no reserved words ("anthropic", "claude")
\* `description`: Maximum 1024 characters, non-empty, no XML tags
### Environment constraints
Skills run in the code execution container with these limitations:
\* \*\*No network access:\*\* Cannot make external API calls
\* \*\*No runtime package installation:\*\* Only pre-installed packages available
\* \*\*Isolated environment:\*\* Containers are isolated; a fresh container is created unless you specify an existing container ID
See [Code execution tool](/docs/en/agents-and-tools/tool-use/code-execution-tool) for available packages.
\*\*\*
## Best practices
### When to use multiple Skills
Combine Skills when tasks involve multiple document types or domains:
\*\*Good use cases:\*\*
\* Data analysis (Excel) + presentation creation (PowerPoint)
\* Report generation (Word) + export to PDF
\* Custom domain logic + document generation
\*\*Avoid:\*\*
\* Including unused Skills (impacts performance)
### Version management strategy
\*\*For production:\*\*
```python
# Pin to specific versions for stability
container = {
"skills": [
{
"type": "custom",
"skill\_id": "skill\_01AbCdEfGhIjKlMnOpQrStUv",
"version": "1759178010641129", # Specific version
}
]
}
```
\*\*For development:\*\*
```python
# Use latest for active development
container = {
"skills": [
{
"type": "custom",
"skill\_id": "skill\_01AbCdEfGhIjKlMnOpQrStUv",
"version": "latest", # Always get newest
}
]
}
```
### Prompt caching considerations
When using prompt caching, note that changing the Skills list in your container breaks the cache:
```bash cURL
# First request creates cache
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 4096,
"container": {
"skills": [
{"type": "anthropic", "skill\_id": "xlsx", "version": "latest"}
]
},
"messages": [{"role": "user", "content": "Analyze sales data"}],
"tools": [{"type": "code\_execution\_20250825", "name": "code\_execution"}]
}'
# Adding/removing Skills breaks cache
curl https://api.anthropic.com/v1/messages \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
-H "content-type: application/json" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 4096,
"container": {
"skills": [
{"type": "anthropic", "skill\_id": "xlsx", "version": "latest"},
{"type": "anthropic", "skill\_id": "pptx", "version": "latest"}
]
},
"messages": [{"role": "user", "content": "Create a presentation"}],
"tools": [{"type": "code\_execution\_20250825", "name": "code\_execution"}]
}'
```
```bash CLI
# First request creates cache
ant beta:messages create \
--beta code-execution-2025-08-25,skills-2025-10-02 <<'YAML'
model: claude-opus-5
max\_tokens: 4096
container:
skills:
- type: anthropic
skill\_id: xlsx
version: latest
messages:
- role: user
content: Analyze sales data
tools:
- type: code\_execution\_20250825
name: code\_execution
YAML
# Adding/removing Skills breaks cache
ant beta:messages create \
--beta code-execution-2025-08-25,skills-2025-10-02 <<'YAML'
model: claude-opus-5
max\_tokens: 4096
container:
skills:
- type: anthropic
skill\_id: xlsx
version: latest
- type: anthropic
skill\_id: pptx
version: latest
messages:
- role: user
content: Create a presentation
tools:
- type: code\_execution\_20250825
name: code\_execution
YAML
```
```python Python
client = anthropic.Anthropic()
# First request creates cache
response1 = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=4096,
betas=[
"code-execution-2025-08-25",
"skills-2025-10-02",
],
container={
"skills": [{"type": "anthropic", "skill\_id": "xlsx", "version": "latest"}]
},
messages=[{"role": "user", "content": "Analyze sales data"}],
tools=[{"type": "code\_execution\_20250825", "name": "code\_execution"}],
)
# Adding/removing Skills breaks cache
response2 = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=4096,
betas=[
"code-execution-2025-08-25",
"skills-2025-10-02",
],
container={
"skills": [
{"type": "anthropic", "skill\_id": "xlsx", "version": "latest"},
{
"type": "anthropic",
"skill\_id": "pptx",
"version": "latest",
}, # Cache miss
]
},
messages=[{"role": "user", "content": "Create a presentation"}],
tools=[{"type": "code\_execution\_20250825", "name": "code\_execution"}],
)
```
```typescript TypeScript
const client = new Anthropic();
// First request creates cache
const response1 = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [{ type: "anthropic", skill\_id: "xlsx", version: "latest" }]
},
messages: [{ role: "user", content: "Analyze sales data" }],
tools: [{ type: "code\_execution\_20250825", name: "code\_execution" }]
});
// Adding/removing Skills breaks cache
const response2 = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [
{ type: "anthropic", skill\_id: "xlsx", version: "latest" },
{ type: "anthropic", skill\_id: "pptx", version: "latest" } // Cache miss
]
},
messages: [{ role: "user", content: "Create a presentation" }],
tools: [{ type: "code\_execution\_20250825", name: "code\_execution" }]
});
```
```csharp C#
AnthropicClient client = new();
// First request creates cache
var parameters1 = new MessageCreateParams
{
Model = "claude-opus-5",
MaxTokens = 4096,
Betas = ["code-execution-2025-08-25", "skills-2025-10-02"],
Container = new BetaContainerParams
{
Skills =
[
new BetaSkillParams
{
Type = BetaSkillParamsType.Anthropic,
SkillID = "xlsx",
Version = "latest",
},
],
},
Messages = [new() { Role = Role.User, Content = "Analyze sales data" }],
Tools = [new BetaCodeExecutionTool20250825()],
};
var response1 = await client.Beta.Messages.Create(parameters1);
Console.WriteLine(response1);
// Different Skill set = cache miss
var parameters2 = new MessageCreateParams
{
Model = "claude-opus-5",
MaxTokens = 4096,
Betas = ["code-execution-2025-08-25", "skills-2025-10-02"],
Container = new BetaContainerParams
{
Skills =
[
new BetaSkillParams
{
Type = BetaSkillParamsType.Anthropic,
SkillID = "xlsx",
Version = "latest",
},
new BetaSkillParams
{
Type = BetaSkillParamsType.Anthropic,
SkillID = "pptx",
Version = "latest",
},
],
},
Messages = [new() { Role = Role.User, Content = "Create a presentation" }],
Tools = [new BetaCodeExecutionTool20250825()],
};
var response2 = await client.Beta.Messages.Create(parameters2);
Console.WriteLine(response2);
```
```go Go
client := anthropic.NewClient()
// First request creates cache
response1, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: "claude-opus-5",
MaxTokens: 4096,
Betas: []anthropic.AnthropicBeta{
"code-execution-2025-08-25",
anthropic.AnthropicBetaSkills2025\_10\_02,
},
Container: anthropic.BetaMessageNewParamsContainerUnion{
OfContainers: &anthropic.BetaContainerParams{
Skills: []anthropic.BetaSkillParams{
{
Type: anthropic.BetaSkillParamsTypeAnthropic,
SkillID: "xlsx",
Version: anthropic.String("latest"),
},
},
},
},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Analyze sales data")),
},
Tools: []anthropic.BetaToolUnionParam{
{OfCodeExecutionTool20250825: &anthropic.BetaCodeExecutionTool20250825Param{}},
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response1)
// Adding/removing Skills breaks cache
response2, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: "claude-opus-5",
MaxTokens: 4096,
Betas: []anthropic.AnthropicBeta{
"code-execution-2025-08-25",
anthropic.AnthropicBetaSkills2025\_10\_02,
},
Container: anthropic.BetaMessageNewParamsContainerUnion{
OfContainers: &anthropic.BetaContainerParams{
Skills: []anthropic.BetaSkillParams{
{
Type: anthropic.BetaSkillParamsTypeAnthropic,
SkillID: "xlsx",
Version: anthropic.String("latest"),
},
{
Type: anthropic.BetaSkillParamsTypeAnthropic,
SkillID: "pptx",
Version: anthropic.String("latest"),
},
},
},
},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Create a presentation")),
},
Tools: []anthropic.BetaToolUnionParam{
{OfCodeExecutionTool20250825: &anthropic.BetaCodeExecutionTool20250825Param{}},
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response2)
```
```java Java
import com.anthropic.models.beta.messages.BetaContainerParams;
import com.anthropic.models.beta.messages.BetaSkillParams;
import com.anthropic.models.beta.messages.BetaCodeExecutionTool20250825;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
// First request creates cache
MessageCreateParams params1 = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addBeta("code-execution-2025-08-25")
.addBeta("skills-2025-10-02")
.container(BetaContainerParams.builder()
.skills(List.of(
BetaSkillParams.builder()
.type(BetaSkillParams.Type.ANTHROPIC)
.skillId("xlsx")
.version("latest")
.build()
))
.build())
.addUserMessage("Analyze sales data")
.addTool(BetaCodeExecutionTool20250825.builder().build())
.build();
BetaMessage response1 = client.beta().messages().create(params1);
System.out.println(response1);
// Adding/removing Skills breaks cache
MessageCreateParams params2 = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addBeta("code-execution-2025-08-25")
.addBeta("skills-2025-10-02")
.container(BetaContainerParams.builder()
.skills(List.of(
BetaSkillParams.builder()
.type(BetaSkillParams.Type.ANTHROPIC)
.skillId("xlsx")
.version("latest")
.build(),
BetaSkillParams.builder()
.type(BetaSkillParams.Type.ANTHROPIC)
.skillId("pptx")
.version("latest")
.build()
))
.build())
.addUserMessage("Create a presentation")
.addTool(BetaCodeExecutionTool20250825.builder().build())
.build();
BetaMessage response2 = client.beta().messages().create(params2);
System.out.println(response2);
}
```
```php PHP
$client = new Client();
// First request creates cache
$response1 = $client->beta->messages->create(
maxTokens: 4096,
messages: [
['role' => 'user', 'content' => 'Analyze sales data']
],
model: 'claude-opus-5',
betas: [
'code-execution-2025-08-25',
'skills-2025-10-02',
],
container: [
'skills' => [
['type' => 'anthropic', 'skill\_id' => 'xlsx', 'version' => 'latest']
]
],
tools: [
['type' => 'code\_execution\_20250825', 'name' => 'code\_execution']
]
);
echo $response1;
// Adding/removing Skills breaks cache
$response2 = $client->beta->messages->create(
maxTokens: 4096,
messages: [
['role' => 'user', 'content' => 'Create a presentation']
],
model: 'claude-opus-5',
betas: [
'code-execution-2025-08-25',
'skills-2025-10-02',
],
container: [
'skills' => [
['type' => 'anthropic', 'skill\_id' => 'xlsx', 'version' => 'latest'],
['type' => 'anthropic', 'skill\_id' => 'pptx', 'version' => 'latest']
]
],
tools: [
['type' => 'code\_execution\_20250825', 'name' => 'code\_execution']
]
);
echo $response2;
```
```ruby Ruby
client = Anthropic::Client.new
# First request creates cache
response1 = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
betas: [
"code-execution-2025-08-25",
"skills-2025-10-02",
],
container: {
skills: [{ type: "anthropic", skill\_id: "xlsx", version: "latest" }]
},
messages: [{ role: "user", content: "Analyze sales data" }],
tools: [{ type: "code\_execution\_20250825", name: "code\_execution" }]
)
puts response1
# Adding/removing Skills breaks cache
response2 = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
betas: [
"code-execution-2025-08-25",
"skills-2025-10-02",
],
container: {
skills: [
{ type: "anthropic", skill\_id: "xlsx", version: "latest" },
{ type: "anthropic", skill\_id: "pptx", version: "latest" } # Cache miss
]
},
messages: [{ role: "user", content: "Create a presentation" }],
tools: [{ type: "code\_execution\_20250825", name: "code\_execution" }]
)
puts response2
```
For best caching performance, keep your Skills list consistent across requests.
### Error handling
Handle Skill-related errors gracefully:
```bash cURL
# This error-handling flow doesn't translate well to a one-off shell
# command; one of the SDK options would be a better fit. A failing request
# returns HTTP 400 with an error JSON whose .error.message names the
# Skill problem.
```
```bash CLI
if ! RESULT=$(ant beta:messages create \
--beta code-execution-2025-08-25,skills-2025-10-02 \
--transform-error error.message --format-error yaml 2>&1 <<'YAML'
model: claude-opus-5
max\_tokens: 4096
container:
skills:
- type: custom
skill\_id: skill\_01AbCdEfGhIjKlMnOpQrStUv
version: latest
messages:
- role: user
content: Process data
tools:
- type: code\_execution\_20250825
name: code\_execution
YAML
); then
case "$RESULT" in
\*skill\*)
printf 'Skill error: %s\n' "$RESULT"
# Handle skill-specific errors
;;
\*)
printf '%s\n' "$RESULT" >&2
exit 1
;;
esac
fi
```
```python Python
client = anthropic.Anthropic()
try:
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=4096,
betas=["code-execution-2025-08-25", "skills-2025-10-02"],
container={
"skills": [
{
"type": "custom",
"skill\_id": "skill\_01AbCdEfGhIjKlMnOpQrStUv",
"version": "latest",
}
]
},
messages=[{"role": "user", "content": "Process data"}],
tools=[{"type": "code\_execution\_20250825", "name": "code\_execution"}],
)
except anthropic.BadRequestError as e:
if "skill" in str(e):
print(f"Skill error: {e}")
# Handle skill-specific errors
else:
raise
```
```typescript TypeScript
const client = new Anthropic();
try {
const response = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [
{ type: "custom", skill\_id: "skill\_01AbCdEfGhIjKlMnOpQrStUv", version: "latest" }
]
},
messages: [{ role: "user", content: "Process data" }],
tools: [{ type: "code\_execution\_20250825", name: "code\_execution" }]
});
console.log(response);
} catch (error) {
if (error instanceof Anthropic.BadRequestError && error.message.includes("skill")) {
console.error(`Skill error: ${error.message}`);
// Handle skill-specific errors
} else {
throw error;
}
}
```
```csharp C#
using Anthropic.Exceptions;
// ...
AnthropicClient client = new();
try
{
var parameters = new MessageCreateParams
{
Model = "claude-opus-5",
MaxTokens = 4096,
Betas = ["code-execution-2025-08-25", "skills-2025-10-02"],
Container = new BetaContainerParams
{
Skills =
[
new BetaSkillParams
{
Type = BetaSkillParamsType.Custom,
SkillID = "skill\_01AbCdEfGhIjKlMnOpQrStUv",
Version = "latest",
},
],
},
Messages = [new() { Role = Role.User, Content = "Process data" }],
Tools = [new BetaCodeExecutionTool20250825()],
};
var response = await client.Beta.Messages.Create(parameters);
Console.WriteLine(response);
}
catch (AnthropicBadRequestException e) when (e.Message.Contains("skill"))
{
Console.WriteLine($"Skill error: {e.Message}");
}
```
```go Go
client := anthropic.NewClient()
response, err := client.Beta.Messages.New(context.TODO(), anthropic.BetaMessageNewParams{
Model: "claude-opus-5",
MaxTokens: 4096,
Betas: []anthropic.AnthropicBeta{"code-execution-2025-08-25", anthropic.AnthropicBetaSkills2025\_10\_02},
Container: anthropic.BetaMessageNewParamsContainerUnion{
OfContainers: &anthropic.BetaContainerParams{
Skills: []anthropic.BetaSkillParams{
{
Type: anthropic.BetaSkillParamsTypeCustom,
SkillID: "skill\_01AbCdEfGhIjKlMnOpQrStUv",
Version: anthropic.String("latest"),
},
},
},
},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Process data")),
},
Tools: []anthropic.BetaToolUnionParam{
{OfCodeExecutionTool20250825: &anthropic.BetaCodeExecutionTool20250825Param{}},
},
})
if err != nil {
var apierr \*anthropic.Error
if errors.As(err, &apierr) && apierr.Type() == anthropic.ErrorTypeInvalidRequestError &&
strings.Contains(apierr.Error(), "skill") {
fmt.Printf("Skill error: %v\n", apierr)
} else {
log.Fatal(err)
}
return
}
fmt.Println(response)
```
```java Java
import com.anthropic.errors.BadRequestException;
import com.anthropic.models.beta.messages.BetaContainerParams;
import com.anthropic.models.beta.messages.BetaSkillParams;
import com.anthropic.models.beta.messages.BetaCodeExecutionTool20250825;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
try {
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(4096L)
.addBeta("code-execution-2025-08-25")
.addBeta("skills-2025-10-02")
.container(BetaContainerParams.builder()
.addSkill(BetaSkillParams.builder()
.type(BetaSkillParams.Type.CUSTOM)
.skillId("skill\_01AbCdEfGhIjKlMnOpQrStUv")
.version("latest")
.build())
.build())
.addUserMessage("Process data")
.addTool(BetaCodeExecutionTool20250825.builder().build())
.build();
BetaMessage response = client.beta().messages().create(params);
System.out.println(response);
} catch (BadRequestException e) {
if (e.getMessage().contains("skill")) {
System.err.println("Skill error: " + e.getMessage());
} else {
throw e;
}
}
}
```
```php PHP
use Anthropic\Core\Exceptions\BadRequestException;
$client = new Client();
try {
$message = $client->beta->messages->create(
maxTokens: 4096,
messages: [
['role' => 'user', 'content' => 'Process data']
],
model: 'claude-opus-5',
betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
container: [
'skills' => [
[
'type' => 'custom',
'skill\_id' => 'skill\_01AbCdEfGhIjKlMnOpQrStUv',
'version' => 'latest'
]
]
],
tools: [
['type' => 'code\_execution\_20250825', 'name' => 'code\_execution']
]
);
echo $message;
} catch (BadRequestException $e) {
if (str\_contains($e->getMessage(), 'skill')) {
echo "Skill error: " . $e->getMessage();
} else {
throw $e;
}
}
```
```ruby Ruby
client = Anthropic::Client.new
begin
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 4096,
betas: ["code-execution-2025-08-25", "skills-2025-10-02"],
container: {
skills: [
{
type: "custom",
skill\_id: "skill\_01AbCdEfGhIjKlMnOpQrStUv",
version: "latest"
}
]
},
messages: [{ role: "user", content: "Process data" }],
tools: [{ type: "code\_execution\_20250825", name: "code\_execution" }]
)
rescue Anthropic::Errors::BadRequestError => e
if e.message.include?("skill")
puts "Skill error: #{e.message}"
else
raise
end
end
```
\*\*\*
## Data retention
Agent Skills are not covered by ZDR arrangements. Skill definitions and execution data are retained according to Anthropic's standard data retention policy.
For ZDR eligibility across all features, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
## Next steps

Complete API reference with all endpoints

Learn how to write effective Skills that Claude can discover and use successfully

Run Python and bash code in a sandboxed container to analyze data, generate files, and iterate on solutions
