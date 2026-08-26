# Get started with Agent Skills in the API

Source: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart.md

# Get started with Agent Skills in the API
Learn how to use Agent Skills to create documents with the Claude API in under 10 minutes.
---
This tutorial shows you how to use Agent Skills to create a PowerPoint presentation. You'll learn how to enable Skills, make a request, and access the generated file.
## Prerequisites
\* A [Claude API key](/settings/keys) or a logged-in [ant CLI](/docs/en/cli-sdks-libraries/cli/authentication)
\* A [client SDK](/docs/en/cli-sdks-libraries/overview) for your language, or `curl` and `jq`
\* Basic familiarity with making API requests
## Agent Skills overview
Pre-built Agent Skills extend Claude's capabilities with specialized expertise for tasks such as creating documents, analyzing data, and processing files. Anthropic provides the following pre-built Agent Skills in the API:
\* \*\*PowerPoint (pptx):\*\* Create and edit presentations
\* \*\*Excel (xlsx):\*\* Create and analyze spreadsheets
\* \*\*Word (docx):\*\* Create and edit documents
\* \*\*PDF (pdf):\*\* Generate PDF documents
To create custom Skills, see the [Agent Skills Cookbook](https://platform.claude.com/cookbook/skills-notebooks-01-skills-introduction) for examples of building your own Skills with domain-specific expertise.
## Step 1: List available Skills
First, check what Skills are available. Use the Skills API to list all Anthropic-managed Skills. Each language tab is an excerpt from one continuous script, with any imports and client setup at the top:
```bash cURL
# List Anthropic-managed Skills
curl --fail-with-body -sS "https://api.anthropic.com/v1/skills?source=anthropic" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: skills-2025-10-02" |
jq -r '.data[] | "\(.id): \(.display\_title)"'
```
```bash CLI
# List Anthropic-managed Skills
ant beta:skills list --source anthropic
```
```python Python
# List Anthropic-managed Skills
skills = client.beta.skills.list(source="anthropic")
for skill in skills.data:
print(f"{skill.id}: {skill.display\_title}")
```
```typescript TypeScript
// List Anthropic-managed Skills
const skills = await client.beta.skills.list({ source: "anthropic" });
for (const skill of skills.data) {
console.log(`${skill.id}: ${skill.display\_title}`);
}
```
```csharp C#
// List Anthropic-managed Skills
var skills = await client.Beta.Skills.List(new SkillListParams { Source = "anthropic" });
foreach (var skill in skills.Items)
{
Console.WriteLine($"{skill.ID}: {skill.DisplayTitle}");
}
```
```go Go
// List Anthropic-managed Skills
skills, err := client.Beta.Skills.List(ctx, anthropic.BetaSkillListParams{
Source: anthropic.String("anthropic"),
})
if err != nil {
panic(err)
}
for \_, skill := range skills.Data {
fmt.Printf("%s: %s\n", skill.ID, skill.DisplayTitle)
}
```
```java Java
// List Anthropic-managed Skills
SkillListPage skills = client.beta().skills().list(
SkillListParams.builder().source("anthropic").build()
);
for (SkillListResponse skill : skills.data()) {
IO.println(skill.id() + ": " + skill.displayTitle().orElse(""));
}
```
```php PHP
// List Anthropic-managed Skills
$skills = $client->beta->skills->list(source: 'anthropic');
foreach ($skills->data as $skill) {
echo "{$skill->id}: {$skill->displayTitle}\n";
}
```
```ruby Ruby
# List Anthropic-managed Skills
skills = client.beta.skills.list(source: "anthropic")
skills.data.each do |skill|
puts "#{skill.id}: #{skill.display\_title}"
end
```
You see the following Skills: `pptx`, `xlsx`, `docx`, and `pdf`.
This API returns each Skill's metadata: its name and description. Claude loads this metadata at startup to determine which Skills are available. This is the first level of \*\*progressive disclosure\*\*, where Claude discovers Skills without loading their full instructions yet.
## Step 2: Create a presentation
Use the PowerPoint Skill to create a presentation about renewable energy. Specify Skills using the `container` parameter in the Messages API:
```bash cURL
# Create a message with the PowerPoint Skill
response=$(
curl --fail-with-body -sS https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: skills-2025-10-02" \
-d @- <<'EOF'
{
"model": "claude-opus-5",
"max\_tokens": 16000,
"container": {
"skills": [{"type": "anthropic", "skill\_id": "pptx", "version": "latest"}]
},
"messages": [
{"role": "user", "content": "Create a presentation about renewable energy with 5 slides"}
],
"tools": [{"type": "code\_execution\_20260521", "name": "code\_execution"}]
}
EOF
)
jq -r '"stop\_reason=\(.stop\_reason), blocks=\(.content | length)"' <<<"$response"
```
```bash CLI
# Create a message with the PowerPoint Skill
response=$(ant beta:messages create --format json \
--beta skills-2025-10-02 <<'YAML'
model: claude-opus-5
max\_tokens: 16000
container:
skills:
- type: anthropic
skill\_id: pptx
version: latest
messages:
- role: user
content: Create a presentation about renewable energy with 5 slides
tools:
- type: code\_execution\_20260521
name: code\_execution
YAML
)
jq -r '"stop\_reason=\(.stop\_reason), blocks=\(.content | length)"' <<<"$response"
```
```python Python
# Create a message with the PowerPoint Skill
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=16000,
betas=["skills-2025-10-02"],
container={
"skills": [{"type": "anthropic", "skill\_id": "pptx", "version": "latest"}]
},
messages=[
{
"role": "user",
"content": "Create a presentation about renewable energy with 5 slides",
}
],
tools=[{"type": "code\_execution\_20260521", "name": "code\_execution"}],
)
print(f"stop\_reason={response.stop\_reason}, blocks={len(response.content)}")
```
```typescript TypeScript
// Create a message with the PowerPoint Skill
const response = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 16000,
betas: ["skills-2025-10-02"],
container: {
skills: [{ type: "anthropic", skill\_id: "pptx", version: "latest" }],
},
messages: [
{
role: "user",
content: "Create a presentation about renewable energy with 5 slides",
},
],
tools: [{ type: "code\_execution\_20260521", name: "code\_execution" }],
});
console.log(
`stop\_reason=${response.stop\_reason}, blocks=${response.content.length}`,
);
```
```csharp C#
// Create a message with the PowerPoint Skill
var response = await client.Beta.Messages.Create(new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 16000,
Betas = ["skills-2025-10-02"],
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
Messages =
[
new BetaMessageParam
{
Role = Role.User,
Content = "Create a presentation about renewable energy with 5 slides",
},
],
Tools = [new BetaCodeExecutionTool20260521()],
});
Console.WriteLine($"stop\_reason={response.StopReason?.Raw()}, blocks={response.Content.Count}");
```
```go Go
// Create a message with the PowerPoint Skill
response, err := client.Beta.Messages.New(ctx, anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 16000,
Betas: []anthropic.AnthropicBeta{
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
anthropic.NewBetaUserMessage(
anthropic.NewBetaTextBlock("Create a presentation about renewable energy with 5 slides"),
),
},
Tools: []anthropic.BetaToolUnionParam{
{OfCodeExecutionTool20260521: &anthropic.BetaCodeExecutionTool20260521Param{}},
},
})
if err != nil {
panic(err)
}
fmt.Printf("stop\_reason=%s, blocks=%d\n", response.StopReason, len(response.Content))
```
```java Java
// Create a message with the PowerPoint Skill
BetaMessage response = client.beta().messages().create(
MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(16000)
.addBeta(AnthropicBeta.SKILLS\_2025\_10\_02)
.container(
BetaContainerParams.builder()
.addSkill(
BetaSkillParams.builder()
.type(BetaSkillParams.Type.ANTHROPIC)
.skillId("pptx")
.version("latest")
.build()
)
.build()
)
.addUserMessage("Create a presentation about renewable energy with 5 slides")
.addTool(BetaCodeExecutionTool20260521.builder().build())
.build()
);
IO.println(
"stop\_reason=" + response.stopReason().orElse(null)
+ ", blocks=" + response.content().size()
);
```
```php PHP
// Create a message with the PowerPoint Skill
$response = $client->beta->messages->create(
model: 'claude-opus-5',
maxTokens: 16000,
betas: ['skills-2025-10-02'],
container: [
'skills' => [['type' => 'anthropic', 'skill\_id' => 'pptx', 'version' => 'latest']],
],
messages: [
[
'role' => 'user',
'content' => 'Create a presentation about renewable energy with 5 slides',
],
],
tools: [['type' => 'code\_execution\_20260521', 'name' => 'code\_execution']],
);
printf("stop\_reason=%s, blocks=%d\n", $response->stopReason, count($response->content));
```
```ruby Ruby
# Create a message with the PowerPoint Skill
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 16\_000,
betas: ["skills-2025-10-02"],
container: {
skills: [{type: "anthropic", skill\_id: "pptx", version: "latest"}]
},
messages: [
{
role: "user",
content: "Create a presentation about renewable energy with 5 slides"
}
],
tools: [{type: "code\_execution\_20260521", name: "code\_execution"}]
)
puts "stop\_reason=#{response.stop\_reason}, blocks=#{response.content.length}"
```
The request includes the following parts:
\* \*\*`model`:\*\* A [model that supports the code execution tool](/docs/en/agents-and-tools/tool-use/code-execution-tool#model-compatibility)
\* \*\*`container.skills`:\*\* Specifies which Skills Claude can use
\* \*\*`type: "anthropic"`:\*\* Indicates this is an Anthropic-managed Skill
\* \*\*`skill\_id: "pptx"`:\*\* The PowerPoint Skill identifier
\* \*\*`version: "latest"`:\*\* The Skill version set to the most recently published
\* \*\*`tools`:\*\* Enables code execution (required for Skills)
\* \*\*Beta header:\*\* `skills-2025-10-02`
The examples on this page use the `code\_execution\_20260521` tool version, which is generally available and needs only the `skills-2025-10-02` beta header. The Step 3 code parses the result types that current tool versions return. Skills also work with older [code execution tool](/docs/en/agents-and-tools/tool-use/code-execution-tool) versions such as `code\_execution\_20250825`: any current code execution tool version satisfies the Skills requirement. If you use a different version, keep its tool `type` and any beta header consistent with the code execution tool page, and always include `skills-2025-10-02`.
When you make this request, Claude automatically matches your task to the relevant Skill. Because you asked for a presentation, Claude determines the PowerPoint Skill is relevant and loads its full instructions: the second level of progressive disclosure. Then Claude runs the Skill's code to create your presentation.
## Step 3: Download the created file
The presentation was created in the code execution container and saved as a file. The Step 2 `response` includes a file reference with a file ID. Extract the file ID and download the file with the Files API. The example saves it to your system temp directory:
```bash cURL
# Extract the file ID. The code execution tool runs the Skill's code through
# its Bash sub-tool, and generated files appear as bash\_code\_execution\_output
# items inside the bash\_code\_execution\_tool\_result block.
file\_id=$(jq -r '
last(
.content[]
| select(.type == "bash\_code\_execution\_tool\_result")
| .content
| select(.type == "bash\_code\_execution\_result")
| .content[].file\_id
) // empty
' <<<"$response")
if [[ -n "$file\_id" ]]; then
# Download the file and save it
output\_path="${TMPDIR:-/tmp}/renewable\_energy.pptx"
curl --fail-with-body -sS "https://api.anthropic.com/v1/files/$file\_id/content" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: files-api-2025-04-14" \
-o "$output\_path"
echo "Presentation saved to $output\_path"
fi
```
```bash CLI
# Extract the file ID. The code execution tool runs the Skill's code through
# its Bash sub-tool, and generated files appear as bash\_code\_execution\_output
# items inside the bash\_code\_execution\_tool\_result block.
file\_id=$(jq -r '
last(
.content[]
| select(.type == "bash\_code\_execution\_tool\_result")
| .content
| select(.type == "bash\_code\_execution\_result")
| .content[].file\_id
) // empty
' <<<"$response")
if [[ -n "$file\_id" ]]; then
# Download the file and save it
output\_path="${TMPDIR:-/tmp}/renewable\_energy.pptx"
ant beta:files download --file-id "$file\_id" --output "$output\_path"
echo "Presentation saved to $output\_path"
fi
```
```python Python
# Extract the file ID. The code execution tool runs the Skill's code through
# its Bash sub-tool, and generated files appear as bash\_code\_execution\_output
# items inside the bash\_code\_execution\_tool\_result block.
file\_id = None
for block in response.content:
if block.type == "bash\_code\_execution\_tool\_result":
if block.content.type == "bash\_code\_execution\_result":
for output in block.content.content:
file\_id = output.file\_id
if file\_id:
# Download the file and save it
output\_path = Path(tempfile.gettempdir()) / "renewable\_energy.pptx"
file\_content = client.beta.files.download(file\_id=file\_id)
file\_content.write\_to\_file(output\_path)
print(f"Presentation saved to {output\_path}")
```
```typescript TypeScript
// Extract the file ID. The code execution tool runs the Skill's code through
// its Bash sub-tool, and generated files appear as bash\_code\_execution\_output
// items inside the bash\_code\_execution\_tool\_result block.
let fileId: string | undefined;
for (const block of response.content) {
if (
block.type === "bash\_code\_execution\_tool\_result" &&
block.content.type === "bash\_code\_execution\_result"
) {
for (const output of block.content.content) {
fileId = output.file\_id;
}
}
}
if (fileId) {
// Download the file and save it
const outputPath = path.join(os.tmpdir(), "renewable\_energy.pptx");
const fileContent = await client.beta.files.download(fileId);
await fs.writeFile(outputPath, Buffer.from(await fileContent.arrayBuffer()));
console.log(`Presentation saved to ${outputPath}`);
}
```
```csharp C#
// Extract the file ID. The code execution tool runs the Skill's code through
// its Bash sub-tool, and generated files appear as bash\_code\_execution\_output
// items inside the bash\_code\_execution\_tool\_result block.
string? fileId = null;
foreach (var block in response.Content)
{
if (block.TryPickBashCodeExecutionToolResult(out var bashResult)
&& bashResult.Content.TryPickBetaBashCodeExecutionResultBlock(out var bashResultBlock))
{
foreach (var output in bashResultBlock.Content)
{
fileId = output.FileID;
}
}
}
if (fileId is not null)
{
// Download the file and save it
var outputPath = Path.Combine(Path.GetTempPath(), "renewable\_energy.pptx");
using var download = await client.Beta.Files.Download(fileId);
await using var source = await download.ReadAsStream();
await using var destination = File.Create(outputPath);
await source.CopyToAsync(destination);
Console.WriteLine($"Presentation saved to {outputPath}");
}
```
```go Go
// Extract the file ID. The code execution tool runs the Skill's code through
// its Bash sub-tool, and generated files appear as bash\_code\_execution\_output
// items inside the bash\_code\_execution\_tool\_result block.
var fileID string
for \_, block := range response.Content {
switch result := block.AsAny().(type) {
case anthropic.BetaBashCodeExecutionToolResultBlock:
if result.Content.Type == "bash\_code\_execution\_result" {
for \_, output := range result.Content.Content {
fileID = output.FileID
}
}
}
}
if fileID != "" {
// Download the file and save it
outputPath := filepath.Join(os.TempDir(), "renewable\_energy.pptx")
fileContent, err := client.Beta.Files.Download(ctx, fileID, anthropic.BetaFileDownloadParams{})
if err != nil {
panic(err)
}
defer fileContent.Body.Close()
outFile, err := os.Create(outputPath)
if err != nil {
panic(err)
}
defer outFile.Close()
if \_, err := io.Copy(outFile, fileContent.Body); err != nil {
panic(err)
}
fmt.Printf("Presentation saved to %s\n", outputPath)
}
```
```java Java
// Extract the file ID. The code execution tool runs the Skill's code through
// its Bash sub-tool, and generated files appear as bash\_code\_execution\_output
// items inside the bash\_code\_execution\_tool\_result block.
String fileId = null;
for (BetaContentBlock block : response.content()) {
if (block.isBashCodeExecutionToolResult()) {
var content = block.asBashCodeExecutionToolResult().content();
if (content.isBetaBashCodeExecutionResultBlock()) {
for (var output : content.asBetaBashCodeExecutionResultBlock().content()) {
fileId = output.fileId();
}
}
}
}
if (fileId != null) {
// Download the file and save it
Path outputPath = Files.createTempFile("renewable\_energy", ".pptx");
try (HttpResponse fileContent = client.beta().files().download(fileId)) {
Files.copy(fileContent.body(), outputPath, StandardCopyOption.REPLACE\_EXISTING);
}
IO.println("Presentation saved to " + outputPath);
}
```
```php PHP
// Extract the file ID. The code execution tool runs the Skill's code through
// its Bash sub-tool, and generated files appear as bash\_code\_execution\_output
// items inside the bash\_code\_execution\_tool\_result block.
$fileId = null;
foreach ($response->content as $block) {
if ($block->type !== 'bash\_code\_execution\_tool\_result') {
continue;
}
$resultBlock = $block->content;
if ($resultBlock->type !== 'bash\_code\_execution\_result') {
continue;
}
foreach ($resultBlock->content as $output) {
$fileId = $output->fileID;
}
}
if ($fileId !== null) {
// Download the file and save it
$outputPath = sys\_get\_temp\_dir() . '/renewable\_energy.pptx';
$fileContent = $client->beta->files->download($fileId);
file\_put\_contents($outputPath, $fileContent);
echo "Presentation saved to {$outputPath}\n";
}
```
```ruby Ruby
# Extract the file ID. The code execution tool runs the Skill's code through
# its Bash sub-tool, and generated files appear as bash\_code\_execution\_output
# items inside the bash\_code\_execution\_tool\_result block.
file\_id = nil
response.content.each do |block|
next unless block.type == :bash\_code\_execution\_tool\_result
if block.content[:type].to\_s == "bash\_code\_execution\_result"
Array(block.content[:content]).each { |output| file\_id = output[:file\_id] }
end
end
if file\_id
# Download the file and save it
output\_path = File.join(Dir.tmpdir, "renewable\_energy.pptx")
file\_content = client.beta.files.download(file\_id)
File.binwrite(output\_path, file\_content.read)
puts "Presentation saved to #{output\_path}"
end
```

For complete details on working with generated files, see [Retrieve generated files](/docs/en/agents-and-tools/tool-use/code-execution-tool#retrieve-generated-files) in the code execution tool documentation.
## Try more examples
Try these variations:
### Create a spreadsheet
```bash cURL
curl --fail-with-body -sS https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: skills-2025-10-02" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 16000,
"container": {
"skills": [{"type": "anthropic", "skill\_id": "xlsx", "version": "latest"}]
},
"messages": [
{"role": "user", "content": "Create a quarterly sales tracking spreadsheet with sample data"}
],
"tools": [{"type": "code\_execution\_20260521", "name": "code\_execution"}]
}' | jq -r '"stop\_reason=\(.stop\_reason)"'
```
```bash CLI
ant beta:messages create --format json \
--beta skills-2025-10-02 <<'YAML' | jq -r '"stop\_reason=\(.stop\_reason)"'
model: claude-opus-5
max\_tokens: 16000
container:
skills:
- type: anthropic
skill\_id: xlsx
version: latest
messages:
- role: user
content: Create a quarterly sales tracking spreadsheet with sample data
tools:
- type: code\_execution\_20260521
name: code\_execution
YAML
```
```python Python
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=16000,
betas=["skills-2025-10-02"],
container={
"skills": [{"type": "anthropic", "skill\_id": "xlsx", "version": "latest"}]
},
messages=[
{
"role": "user",
"content": "Create a quarterly sales tracking spreadsheet with sample data",
}
],
tools=[{"type": "code\_execution\_20260521", "name": "code\_execution"}],
)
```
```typescript TypeScript
const response = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 16000,
betas: ["skills-2025-10-02"],
container: {
skills: [{ type: "anthropic", skill\_id: "xlsx", version: "latest" }]
},
messages: [
{
role: "user",
content: "Create a quarterly sales tracking spreadsheet with sample data"
}
],
tools: [{ type: "code\_execution\_20260521", name: "code\_execution" }]
});
```
```csharp C#
var response = await client.Beta.Messages.Create(
new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 16000,
Betas = ["skills-2025-10-02"],
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
Messages =
[
new BetaMessageParam
{
Role = Role.User,
Content = "Create a quarterly sales tracking spreadsheet with sample data",
},
],
Tools = [new BetaCodeExecutionTool20260521()],
}
);
```
```go Go
response, err := client.Beta.Messages.New(context.Background(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 16000,
Betas: []anthropic.AnthropicBeta{
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
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Create a quarterly sales tracking spreadsheet with sample data")),
},
Tools: []anthropic.BetaToolUnionParam{
{
OfCodeExecutionTool20260521: &anthropic.BetaCodeExecutionTool20260521Param{},
},
},
})
if err != nil {
panic(err)
}
```
```java Java
BetaMessage response = client.beta().messages().create(
MessageCreateParams.builder()
.model(CLAUDE\_OPUS\_5)
.maxTokens(16000)
.addBeta(AnthropicBeta.SKILLS\_2025\_10\_02)
.container(
BetaContainerParams.builder()
.addSkill(
BetaSkillParams.builder()
.type(ANTHROPIC)
.skillId("xlsx")
.version("latest")
.build()
)
.build()
)
.addUserMessage("Create a quarterly sales tracking spreadsheet with sample data")
.addTool(BetaCodeExecutionTool20260521.builder().build())
.build()
);
```
```php PHP
$response = $client->beta->messages->create(
model: 'claude-opus-5',
maxTokens: 16000,
betas: ['skills-2025-10-02'],
container: [
'skills' => [
['type' => 'anthropic', 'skill\_id' => 'xlsx', 'version' => 'latest'],
],
],
messages: [
[
'role' => 'user',
'content' => 'Create a quarterly sales tracking spreadsheet with sample data',
],
],
tools: [new BetaCodeExecutionTool20260521()],
);
```
```ruby Ruby
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 16\_000,
betas: ["skills-2025-10-02"],
container: {
skills: [{type: "anthropic", skill\_id: "xlsx", version: "latest"}]
},
messages: [
{
role: "user",
content: "Create a quarterly sales tracking spreadsheet with sample data"
}
],
tools: [{type: "code\_execution\_20260521", name: "code\_execution"}]
)
```
### Create a Word document
```bash cURL
curl --fail-with-body -sS https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: skills-2025-10-02" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 16000,
"container": {
"skills": [{"type": "anthropic", "skill\_id": "docx", "version": "latest"}]
},
"messages": [
{"role": "user", "content": "Write a 2-page report on the benefits of renewable energy"}
],
"tools": [{"type": "code\_execution\_20260521", "name": "code\_execution"}]
}' | jq -r '"stop\_reason=\(.stop\_reason)"'
```
```bash CLI
ant beta:messages create --format json \
--beta skills-2025-10-02 <<'YAML' | jq -r '"stop\_reason=\(.stop\_reason)"'
model: claude-opus-5
max\_tokens: 16000
container:
skills:
- type: anthropic
skill\_id: docx
version: latest
messages:
- role: user
content: Write a 2-page report on the benefits of renewable energy
tools:
- type: code\_execution\_20260521
name: code\_execution
YAML
```
```python Python
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=16000,
betas=["skills-2025-10-02"],
container={
"skills": [{"type": "anthropic", "skill\_id": "docx", "version": "latest"}]
},
messages=[
{
"role": "user",
"content": "Write a 2-page report on the benefits of renewable energy",
}
],
tools=[{"type": "code\_execution\_20260521", "name": "code\_execution"}],
)
```
```typescript TypeScript
const response = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 16000,
betas: ["skills-2025-10-02"],
container: {
skills: [{ type: "anthropic", skill\_id: "docx", version: "latest" }]
},
messages: [
{
role: "user",
content: "Write a 2-page report on the benefits of renewable energy"
}
],
tools: [{ type: "code\_execution\_20260521", name: "code\_execution" }]
});
```
```csharp C#
var response = await client.Beta.Messages.Create(
new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 16000,
Betas = ["skills-2025-10-02"],
Container = new BetaContainerParams
{
Skills =
[
new BetaSkillParams
{
Type = BetaSkillParamsType.Anthropic,
SkillID = "docx",
Version = "latest",
},
],
},
Messages =
[
new BetaMessageParam
{
Role = Role.User,
Content = "Write a 2-page report on the benefits of renewable energy",
},
],
Tools = [new BetaCodeExecutionTool20260521()],
}
);
```
```go Go
response, err := client.Beta.Messages.New(context.Background(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 16000,
Betas: []anthropic.AnthropicBeta{
anthropic.AnthropicBetaSkills2025\_10\_02,
},
Container: anthropic.BetaMessageNewParamsContainerUnion{
OfContainers: &anthropic.BetaContainerParams{
Skills: []anthropic.BetaSkillParams{
{
Type: anthropic.BetaSkillParamsTypeAnthropic,
SkillID: "docx",
Version: anthropic.String("latest"),
},
},
},
},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Write a 2-page report on the benefits of renewable energy")),
},
Tools: []anthropic.BetaToolUnionParam{
{
OfCodeExecutionTool20260521: &anthropic.BetaCodeExecutionTool20260521Param{},
},
},
})
if err != nil {
panic(err)
}
```
```java Java
BetaMessage response = client.beta().messages().create(
MessageCreateParams.builder()
.model(CLAUDE\_OPUS\_5)
.maxTokens(16000)
.addBeta(AnthropicBeta.SKILLS\_2025\_10\_02)
.container(
BetaContainerParams.builder()
.addSkill(
BetaSkillParams.builder()
.type(ANTHROPIC)
.skillId("docx")
.version("latest")
.build()
)
.build()
)
.addUserMessage("Write a 2-page report on the benefits of renewable energy")
.addTool(BetaCodeExecutionTool20260521.builder().build())
.build()
);
```
```php PHP
$response = $client->beta->messages->create(
model: 'claude-opus-5',
maxTokens: 16000,
betas: ['skills-2025-10-02'],
container: [
'skills' => [
['type' => 'anthropic', 'skill\_id' => 'docx', 'version' => 'latest'],
],
],
messages: [
[
'role' => 'user',
'content' => 'Write a 2-page report on the benefits of renewable energy',
],
],
tools: [new BetaCodeExecutionTool20260521()],
);
```
```ruby Ruby
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 16\_000,
betas: ["skills-2025-10-02"],
container: {
skills: [{type: "anthropic", skill\_id: "docx", version: "latest"}]
},
messages: [
{
role: "user",
content: "Write a 2-page report on the benefits of renewable energy"
}
],
tools: [{type: "code\_execution\_20260521", name: "code\_execution"}]
)
```
### Generate a PDF
```bash cURL
curl --fail-with-body -sS https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-H "anthropic-beta: skills-2025-10-02" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 16000,
"container": {
"skills": [{"type": "anthropic", "skill\_id": "pdf", "version": "latest"}]
},
"messages": [
{"role": "user", "content": "Generate a PDF invoice template"}
],
"tools": [{"type": "code\_execution\_20260521", "name": "code\_execution"}]
}' | jq -r '"stop\_reason=\(.stop\_reason)"'
```
```bash CLI
ant beta:messages create --format json \
--beta skills-2025-10-02 <<'YAML' | jq -r '"stop\_reason=\(.stop\_reason)"'
model: claude-opus-5
max\_tokens: 16000
container:
skills:
- type: anthropic
skill\_id: pdf
version: latest
messages:
- role: user
content: Generate a PDF invoice template
tools:
- type: code\_execution\_20260521
name: code\_execution
YAML
```
```python Python
response = client.beta.messages.create(
model="claude-opus-5",
max\_tokens=16000,
betas=["skills-2025-10-02"],
container={
"skills": [{"type": "anthropic", "skill\_id": "pdf", "version": "latest"}]
},
messages=[
{
"role": "user",
"content": "Generate a PDF invoice template",
}
],
tools=[{"type": "code\_execution\_20260521", "name": "code\_execution"}],
)
```
```typescript TypeScript
const response = await client.beta.messages.create({
model: "claude-opus-5",
max\_tokens: 16000,
betas: ["skills-2025-10-02"],
container: {
skills: [{ type: "anthropic", skill\_id: "pdf", version: "latest" }]
},
messages: [
{
role: "user",
content: "Generate a PDF invoice template"
}
],
tools: [{ type: "code\_execution\_20260521", name: "code\_execution" }]
});
```
```csharp C#
var response = await client.Beta.Messages.Create(
new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 16000,
Betas = ["skills-2025-10-02"],
Container = new BetaContainerParams
{
Skills =
[
new BetaSkillParams
{
Type = BetaSkillParamsType.Anthropic,
SkillID = "pdf",
Version = "latest",
},
],
},
Messages =
[
new BetaMessageParam
{
Role = Role.User,
Content = "Generate a PDF invoice template",
},
],
Tools = [new BetaCodeExecutionTool20260521()],
}
);
```
```go Go
response, err := client.Beta.Messages.New(context.Background(), anthropic.BetaMessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 16000,
Betas: []anthropic.AnthropicBeta{
anthropic.AnthropicBetaSkills2025\_10\_02,
},
Container: anthropic.BetaMessageNewParamsContainerUnion{
OfContainers: &anthropic.BetaContainerParams{
Skills: []anthropic.BetaSkillParams{
{
Type: anthropic.BetaSkillParamsTypeAnthropic,
SkillID: "pdf",
Version: anthropic.String("latest"),
},
},
},
},
Messages: []anthropic.BetaMessageParam{
anthropic.NewBetaUserMessage(anthropic.NewBetaTextBlock("Generate a PDF invoice template")),
},
Tools: []anthropic.BetaToolUnionParam{
{
OfCodeExecutionTool20260521: &anthropic.BetaCodeExecutionTool20260521Param{},
},
},
})
if err != nil {
panic(err)
}
```
```java Java
BetaMessage response = client.beta().messages().create(
MessageCreateParams.builder()
.model(CLAUDE\_OPUS\_5)
.maxTokens(16000)
.addBeta(AnthropicBeta.SKILLS\_2025\_10\_02)
.container(
BetaContainerParams.builder()
.addSkill(
BetaSkillParams.builder()
.type(ANTHROPIC)
.skillId("pdf")
.version("latest")
.build()
)
.build()
)
.addUserMessage("Generate a PDF invoice template")
.addTool(BetaCodeExecutionTool20260521.builder().build())
.build()
);
```
```php PHP
$response = $client->beta->messages->create(
model: 'claude-opus-5',
maxTokens: 16000,
betas: ['skills-2025-10-02'],
container: [
'skills' => [
['type' => 'anthropic', 'skill\_id' => 'pdf', 'version' => 'latest'],
],
],
messages: [
[
'role' => 'user',
'content' => 'Generate a PDF invoice template',
],
],
tools: [new BetaCodeExecutionTool20260521()],
);
```
```ruby Ruby
response = client.beta.messages.create(
model: "claude-opus-5",
max\_tokens: 16\_000,
betas: ["skills-2025-10-02"],
container: {
skills: [{type: "anthropic", skill\_id: "pdf", version: "latest"}]
},
messages: [
{
role: "user",
content: "Generate a PDF invoice template"
}
],
tools: [{type: "code\_execution\_20260521", name: "code\_execution"}]
)
```
## Next steps

Learn how to write effective Skills that Claude can discover and use successfully.

Learn how to use Agent Skills to extend Claude's capabilities through the API.

Upload your own Skills for specialized tasks.

Learn about Skills in Claude Code.

Explore example Skills and implementation patterns.
