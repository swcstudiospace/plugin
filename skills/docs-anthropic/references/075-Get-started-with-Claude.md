# Get started with Claude

Source: https://platform.claude.com/docs/en/get-started.md

# Get started with Claude
Make your first API call to Claude and build a simple web search assistant.
---
## Prerequisites
\* A [Claude Console account](https://platform.claude.com)
\* An [API key](/settings/keys)
## Call the API

Export your API key as an environment variable. The cURL command below reads it from `$ANTHROPIC\_API\_KEY`.
```bash
export ANTHROPIC\_API\_KEY="your-api-key-here"
```

Send a `POST` request to the Messages API:
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1000,
"messages": [
{
"role": "user",
"content": "What should I search for to find the latest developments in renewable energy?"
}
]
}'
```
Claude returns a JSON response containing the assistant's message:
```json Output
{
"model": "claude-opus-5",
"id": "msg\_013mHbppMPd2PrVJzGMZPt2D",
"type": "message",
"role": "assistant",
"content": [
{
"type": "text",
"text": "Here are some effective search strategies to find the latest developments in renewable energy:\n\n## General Search Terms\n- \"Renewable energy news 2025\"\n- ..."
}
],
"stop\_reason": "end\_turn",
"stop\_sequence": null,
"stop\_details": null,
"usage": {
"input\_tokens": 21,
"output\_tokens": 305
}
}
```

Install the Anthropic CLI with Homebrew:
```bash
brew install anthropics/tap/ant
```
For other installation methods, see [Installation](/docs/en/cli-sdks-libraries/cli/quickstart#installation) in the CLI quickstart.

Log in with your Anthropic account:
```bash
ant auth login
```
This opens a browser-based OAuth flow. After authorizing, confirm your credential with:
```bash
ant auth status
```
On a remote host without a browser, pass `--no-browser` to get a URL you can open on another device, then paste the returned code back into the terminal. If `ANTHROPIC\_API\_KEY` is set in your environment, it takes precedence over the login credentials. For non-interactive environments such as CI, see [CLI authentication options](/docs/en/cli-sdks-libraries/cli/authentication).

Run `ant messages create` from your terminal:
```bash CLI
ant messages create \
--model claude-opus-5 \
--max-tokens 1000 \
--message '{
role: user,
content: "What should I search for to find the latest developments in renewable energy?"
}'
```
The CLI prints the JSON response:
```json Output
{
"model": "claude-opus-5",
"id": "msg\_01N1ycuCkM5Mzd7WhTU4fwST",
"type": "message",
"role": "assistant",
"content": [
{
"type": "text",
"text": "Here are some effective search strategies to find the latest developments in renewable energy:\n\n## General Search Terms\n- \"Renewable energy news 2025\"\n- ..."
}
],
"stop\_reason": "end\_turn",
"stop\_sequence": null,
"stop\_details": null,
"usage": { "input\_tokens": 21, "output\_tokens": 305 }
}
```

Export your API key as an environment variable. The SDK reads `ANTHROPIC\_API\_KEY` automatically.
```bash
export ANTHROPIC\_API\_KEY="your-api-key-here"
```

```bash
mkdir claude-quickstart && cd claude-quickstart
python3 -m venv .venv && source .venv/bin/activate
pip install anthropic
```

Create a file called `quickstart.py`:
```python Python
import anthropic
client = anthropic.Anthropic()
message = client.messages.create(
model="claude-opus-5",
max\_tokens=1000,
messages=[
{
"role": "user",
"content": "What should I search for to find the latest developments in renewable energy?",
}
],
)
for block in message.content:
if block.type == "text":
print(block.text)
```

```bash
python quickstart.py
```
```text Output wrap
Here are some effective search strategies to find the latest developments in renewable energy:
## General Search Terms
- "Renewable energy news 2025"
- ...
```

Export your API key as an environment variable. The SDK reads `ANTHROPIC\_API\_KEY` automatically.
```bash
export ANTHROPIC\_API\_KEY="your-api-key-here"
```

```bash
mkdir claude-quickstart && cd claude-quickstart
npm init -y
npm pkg set type=module
npm install @anthropic-ai/sdk
```

Create a file called `quickstart.ts`:
```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();
const message = await client.messages.create({
model: "claude-opus-5",
max\_tokens: 1000,
messages: [
{
role: "user",
content: "What should I search for to find the latest developments in renewable energy?"
}
]
});
for (const block of message.content) {
if (block.type === "text") {
console.log(block.text);
}
}
```

```bash
npx tsx quickstart.ts
```
```text Output wrap
Here are some effective search strategies to find the latest developments in renewable energy:
## General Search Terms
- "Renewable energy news 2025"
- ...
```

Export your API key as an environment variable. The SDK reads `ANTHROPIC\_API\_KEY` automatically.
```bash
export ANTHROPIC\_API\_KEY="your-api-key-here"
```

Create a new console project and add the Anthropic package:
```bash
dotnet new console -n ClaudeQuickstart
cd ClaudeQuickstart
dotnet add package Anthropic
```

Replace the contents of `Program.cs`:
```csharp C#
using Anthropic;
using Anthropic.Models.Messages;
var client = new AnthropicClient();
var message = await client.Messages.Create(new MessageCreateParams
{
Model = Model.ClaudeOpus5,
MaxTokens = 1000,
Messages =
[
new()
{
Role = Role.User,
Content = "What should I search for to find the latest developments in renewable energy?",
},
],
});
foreach (var block in message.Content)
{
if (block.TryPickText(out var textBlock))
{
Console.WriteLine(textBlock.Text);
}
}
```

```bash
dotnet run
```
```text Output wrap
Here are some effective search strategies to find the latest developments in renewable energy:
## General Search Terms
- "Renewable energy news 2025"
- ...
```

Export your API key as an environment variable. The SDK reads `ANTHROPIC\_API\_KEY` automatically.
```bash
export ANTHROPIC\_API\_KEY="your-api-key-here"
```

Create a new module and add the Anthropic SDK:
```bash
mkdir claude-quickstart && cd claude-quickstart
go mod init claude-quickstart
go get github.com/anthropics/anthropic-sdk-go
```

Create a file called `main.go`:
```go Go
package main
import (
"context"
"fmt"
"log"
"github.com/anthropics/anthropic-sdk-go"
)
func main() {
client := anthropic.NewClient()
message, err := client.Messages.New(context.Background(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1000,
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("What should I search for to find the latest developments in renewable energy?")),
},
})
if err != nil {
log.Fatal(err)
}
for \_, block := range message.Content {
if textBlock, ok := block.AsAny().(anthropic.TextBlock); ok {
fmt.Println(textBlock.Text)
}
}
}
```

```bash
go run .
```
```text Output wrap
Here are some effective search strategies to find the latest developments in renewable energy:
## General Search Terms
- "Renewable energy news 2025"
- ...
```

Export your API key as an environment variable. The SDK reads `ANTHROPIC\_API\_KEY` automatically.
```bash
export ANTHROPIC\_API\_KEY="your-api-key-here"
```

You need a JDK (25 or later) and either [Gradle](https://gradle.org/install/) or [Maven](https://maven.apache.org/install.html) on your `PATH`. Create a directory for your project with a Java source directory inside it:
```bash
mkdir -p claude-quickstart/src/main/java && cd claude-quickstart
```
Then add a build file. Find the current SDK version on [Maven Central](https://central.sonatype.com/artifact/com.anthropic/anthropic-java).

Save this as `build.gradle.kts`:
```kotlin
plugins {
application
}
repositories {
mavenCentral()
}
java {
toolchain {
languageVersion = JavaLanguageVersion.of(25)
}
}
dependencies {
implementation("com.anthropic:anthropic-java:2.52.0")
}
application {
mainClass = "QuickStart"
}
```

Save this as `pom.xml`:
```xml
4.0.0
com.example
quickstart
1.0-SNAPSHOT

25
UTF-8

com.anthropic
anthropic-java
2.52.0
```

Save this as `QuickStart.java` in your project's Java source directory (usually `src/main/java/`):
```java Java
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
static void main() {
var client = AnthropicOkHttpClient.fromEnv();
var params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1000)
.addUserMessage(
"What should I search for to find the latest developments in renewable energy?"
)
.build();
Message message = client.messages().create(params);
for (var block : message.content()) {
block.text().ifPresent(textBlock -> IO.println(textBlock.text()));
}
}
```

```bash
gradle run
```

```bash
mvn compile exec:java -Dexec.mainClass=QuickStart
```
```text Output wrap
Here are some effective search strategies to find the latest developments in renewable energy:
## General Search Terms
- "Renewable energy news 2025"
- ...
```

Export your API key as an environment variable. The SDK reads `ANTHROPIC\_API\_KEY` automatically.
```bash
export ANTHROPIC\_API\_KEY="your-api-key-here"
```

```bash
mkdir claude-quickstart && cd claude-quickstart
composer require "anthropic-ai/sdk" "guzzlehttp/guzzle:^7"
```

Create a file called `quickstart.php`:
```php PHP
messages->create(
model: Model::CLAUDE\_OPUS\_5,
maxTokens: 1000,
messages: [
[
'role' => 'user',
'content' => 'What should I search for to find the latest developments in renewable energy?',
],
],
);
foreach ($message->content as $block) {
if ($block instanceof TextBlock) {
echo $block->text . PHP\_EOL;
}
}
```

```bash
php quickstart.php
```
```text Output wrap
Here are some effective search strategies to find the latest developments in renewable energy:
## General Search Terms
- "Renewable energy news 2025"
- ...
```

Export your API key as an environment variable. The SDK reads `ANTHROPIC\_API\_KEY` automatically.
```bash
export ANTHROPIC\_API\_KEY="your-api-key-here"
```

```bash
mkdir claude-quickstart && cd claude-quickstart
bundle init
bundle add anthropic
```

Create a file called `quickstart.rb`:
```ruby Ruby
require "anthropic"
client = Anthropic::Client.new
message = client.messages.create(
model: Anthropic::Model::CLAUDE\_OPUS\_5,
max\_tokens: 1000,
messages: [
{
role: "user",
content: "What should I search for to find the latest developments in renewable energy?"
}
]
)
message.content.each do |block|
puts block.text if block.type == :text
end
```

```bash
bundle exec ruby quickstart.rb
```
```text Output wrap
Here are some effective search strategies to find the latest developments in renewable energy:
## General Search Terms
- "Renewable energy news 2025"
- ...
```
## Next steps
You made your first API call. Next, learn the Messages API patterns you'll use in every Claude integration.
Learn multi-turn conversations, system prompts, stop reasons, and other core patterns.
Once you're comfortable with the basics, explore further:

Compare Claude models by capability and cost.

Browse all Claude capabilities: tools, context management, structured outputs, and more.

Reference documentation for Python, TypeScript, C#, and other client libraries.
