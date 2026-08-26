# Text editor tool

Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/text-editor-tool.md

# Text editor tool
Give Claude the Anthropic-defined text editor tool to view, create, and edit files, and handle its view, str\_replace, create, and insert commands.
---
For how zero data retention (ZDR) applies to this feature, see [API and data retention](/docs/en/manage-claude/api-and-data-retention).
Claude can use an Anthropic-schema text editor tool to view and modify text files, helping you debug, fix, and improve your code or other text documents. This allows Claude to directly interact with your files, providing hands-on assistance rather than just suggesting changes.
For model support, see the [Tool reference](/docs/en/agents-and-tools/tool-use/tool-reference).
## When to use the text editor tool
Some examples of when to use the text editor tool are:
\* \*\*Code debugging:\*\* Have Claude identify and fix bugs in your code, from syntax errors to logic issues.
\* \*\*Code refactoring:\*\* Let Claude improve your code structure, readability, and performance through targeted edits.
\* \*\*Documentation generation:\*\* Ask Claude to add docstrings, comments, or README files to your code base.
\* \*\*Test creation:\*\* Have Claude create unit tests for your code based on its analysis of the implementation.
## Use the text editor tool
Provide the text editor tool (named `str\_replace\_based\_edit\_tool`) to Claude using the Messages API.
You can optionally specify a `max\_characters` parameter to control truncation when viewing large files.
`max\_characters` is only compatible with `text\_editor\_20250728` and later versions of the text editor tool.

```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"tools": [
{
"type": "text\_editor\_20250728",
"name": "str\_replace\_based\_edit\_tool",
"max\_characters": 10000
}
],
"messages": [
{
"role": "user",
"content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
}
]
}'
```
```bash CLI
ant messages create \
--model claude-opus-5 \
--max-tokens 1024 \
--tool '{type: text\_editor\_20250728, name: str\_replace\_based\_edit\_tool, max\_characters: 10000}' \
--message '{role: user, content: There is a syntax error in my primes.py file. Can you help me fix it?}'
```
```python Python
client = anthropic.Anthropic()
response = client.messages.create(
model="claude-opus-5",
max\_tokens=1024,
tools=[
{
"type": "text\_editor\_20250728",
"name": "str\_replace\_based\_edit\_tool",
"max\_characters": 10000,
}
],
messages=[
{
"role": "user",
"content": "There's a syntax error in my primes.py file. Can you help me fix it?",
}
],
)
print(response)
```
```typescript TypeScript
const anthropic = new Anthropic();
const response = await anthropic.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
tools: [
{
type: "text\_editor\_20250728",
name: "str\_replace\_based\_edit\_tool",
max\_characters: 10000
}
],
messages: [
{
role: "user",
content: "There's a syntax error in my primes.py file. Can you help me fix it?"
}
]
});
console.log(response);
```
```csharp C#
var client = new AnthropicClient();
var response = await client.Messages.Create(
new()
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Tools = [new ToolTextEditor20250728 { MaxCharacters = 10000 }],
Messages =
[
new()
{
Role = Role.User,
Content = "There's a syntax error in my primes.py file. Can you help me fix it?",
},
],
}
);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Tools: []anthropic.ToolUnionParam{
{OfTextEditor20250728: &anthropic.ToolTextEditor20250728Param{
MaxCharacters: anthropic.Int(10000),
}},
},
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("There's a syntax error in my primes.py file. Can you help me fix it?")),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
import com.anthropic.models.messages.ToolTextEditor20250728;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
ToolTextEditor20250728 editorTool =
ToolTextEditor20250728.builder()
.maxCharacters(10000L)
.build();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024)
.addTool(editorTool)
.addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
.build();
Message message = client.messages().create(params);
IO.println(message);
}
```
```php PHP
$client = new Client();
$response = $client->messages->create(
model: 'claude-opus-5',
maxTokens: 1024,
tools: [ToolTextEditor20250728::with(maxCharacters: 10000)],
messages: [
[
'role' => 'user',
'content' => "There's a syntax error in my primes.py file. Can you help me fix it?",
],
],
);
echo $response;
```
```ruby Ruby
client = Anthropic::Client.new
response = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
tools: [
{
type: "text\_editor\_20250728",
name: "str\_replace\_based\_edit\_tool",
max\_characters: 10000
}
],
messages: [
{
role: "user",
content: "There's a syntax error in my primes.py file. Can you help me fix it?"
}
]
)
puts response
```
Use the text editor tool in the following way:

\* Include the text editor tool in your API request
\* Provide a user prompt that may require examining or modifying files, such as "Can you fix the syntax error in my code?"

\* Claude assesses what it needs to look at and uses the `view` command to examine file contents or list directory contents
\* The API response will contain a `tool\_use` content block with the `view` command

\* Extract the file or directory path from Claude's tool use request
\* Read the file's contents or list the directory contents
\* If a `max\_characters` parameter was specified in the tool configuration, truncate the file contents to that length
\* Return the results to Claude by continuing the conversation with a new `user` message containing a `tool\_result` content block

\* After examining the file or directory, Claude may use a command such as `str\_replace` to make changes or `insert` to add text at a specific line number.
\* If Claude uses the `str\_replace` command, Claude constructs a properly formatted tool use request with the old text and new text to replace it with

\* Extract the file path, old text, and new text from Claude's tool use request
\* Perform the text replacement in the file
\* Return the results to Claude

\* After examining and possibly editing the files, Claude provides a complete explanation of what it found and what changes it made
### Text editor tool commands
The text editor tool supports several commands for viewing and modifying files:
#### view
The `view` command allows Claude to examine the contents of a file or list the contents of a directory. It can read the entire file or a specific range of lines.
Parameters:
\* `command`: Must be "view"
\* `path`: The path to the file or directory to view
\* `view\_range` (optional): An array of two integers specifying the start and end line numbers to view. Line numbers are 1-indexed, and -1 for the end line means read to the end of the file. This parameter only applies when viewing files, not directories.
Example for viewing a file:
```json
{
"type": "tool\_use",
"id": "toolu\_01A09q90qw90lq917835lq9",
"name": "str\_replace\_based\_edit\_tool",
"input": {
"command": "view",
"path": "primes.py"
}
}
```
Example for viewing a directory:
```json
{
"type": "tool\_use",
"id": "toolu\_02B19r91rw91mr917835mr9",
"name": "str\_replace\_based\_edit\_tool",
"input": {
"command": "view",
"path": "src/"
}
}
```
#### str\\_replace
The `str\_replace` command allows Claude to replace a specific string in a file with a new string. This is used for making precise edits.
Parameters:
\* `command`: Must be "str\\_replace"
\* `path`: The path to the file to modify
\* `old\_str`: The text to replace (must match exactly, including whitespace and indentation)
\* `new\_str`: The new text to insert in place of the old text
```json
{
"type": "tool\_use",
"id": "toolu\_01A09q90qw90lq917835lq9",
"name": "str\_replace\_based\_edit\_tool",
"input": {
"command": "str\_replace",
"path": "primes.py",
"old\_str": "for num in range(2, limit + 1)",
"new\_str": "for num in range(2, limit + 1):"
}
}
```
#### create
The `create` command allows Claude to create a new file with specified content.
Parameters:
\* `command`: Must be "create"
\* `path`: The path where the new file should be created
\* `file\_text`: The content to write to the new file
```json
{
"type": "tool\_use",
"id": "toolu\_01A09q90qw90lq917835lq9",
"name": "str\_replace\_based\_edit\_tool",
"input": {
"command": "create",
"path": "test\_primes.py",
"file\_text": "import unittest\nimport primes\n\nclass TestPrimes(unittest.TestCase):\n def test\_is\_prime(self):\n self.assertTrue(primes.is\_prime(2))\n self.assertTrue(primes.is\_prime(3))\n self.assertFalse(primes.is\_prime(4))\n\nif \_\_name\_\_ == '\_\_main\_\_':\n unittest.main()"
}
}
```
#### insert
The `insert` command allows Claude to insert text at a specific location in a file.
Parameters:
\* `command`: Must be "insert"
\* `path`: The path to the file to modify
\* `insert\_line`: The line number after which to insert the text (0 for beginning of file)
\* `insert\_text`: The text to insert
```json
{
"type": "tool\_use",
"id": "toolu\_01A09q90qw90lq917835lq9",
"name": "str\_replace\_based\_edit\_tool",
"input": {
"command": "insert",
"path": "primes.py",
"insert\_line": 0,
"insert\_text": "\"\"\"Module for working with prime numbers.\n\nThis module provides functions to check if a number is prime\nand to generate a list of prime numbers up to a given limit.\n\"\"\"\n"
}
}
```
### Example: Fixing a syntax error with the text editor tool
This example demonstrates how Claude uses the text editor tool to fix a syntax error in a Python file.
First, your application provides Claude with the text editor tool and a prompt to fix a syntax error:
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"tools": [
{
"type": "text\_editor\_20250728",
"name": "str\_replace\_based\_edit\_tool"
}
],
"messages": [
{
"role": "user",
"content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
}
]
}'
```
```bash CLI
ant messages create \
--model claude-opus-5 \
--max-tokens 1024 \
--tool '{type: text\_editor\_20250728, name: str\_replace\_based\_edit\_tool}' \
--message '{role: user, content: There is a syntax error in my primes.py file. Can you help me fix it?}'
```
```python Python
client = anthropic.Anthropic()
response = client.messages.create(
model="claude-opus-5",
max\_tokens=1024,
tools=[{"type": "text\_editor\_20250728", "name": "str\_replace\_based\_edit\_tool"}],
messages=[
{
"role": "user",
"content": "There's a syntax error in my primes.py file. Can you help me fix it?",
}
],
)
print(response)
```
```typescript TypeScript
const anthropic = new Anthropic();
const response = await anthropic.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
tools: [
{
type: "text\_editor\_20250728",
name: "str\_replace\_based\_edit\_tool"
}
],
messages: [
{
role: "user",
content: "There's a syntax error in my primes.py file. Can you help me fix it?"
}
]
});
console.log(response);
```
```csharp C#
var client = new AnthropicClient();
var response = await client.Messages.Create(
new()
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Tools = [new ToolTextEditor20250728()],
Messages =
[
new()
{
Role = Role.User,
Content = "There's a syntax error in my primes.py file. Can you help me fix it?",
},
],
}
);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Tools: []anthropic.ToolUnionParam{
{OfTextEditor20250728: &anthropic.ToolTextEditor20250728Param{}},
},
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("There's a syntax error in my primes.py file. Can you help me fix it?")),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
import com.anthropic.models.messages.ToolTextEditor20250728;
// ...
void main() {
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
ToolTextEditor20250728 editorTool =
ToolTextEditor20250728.builder().build();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024)
.addTool(editorTool)
.addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
.build();
Message message = client.messages().create(params);
IO.println(message);
}
```
```php PHP
$client = new Client();
$response = $client->messages->create(
model: 'claude-opus-5',
maxTokens: 1024,
tools: [new ToolTextEditor20250728()],
messages: [
[
'role' => 'user',
'content' => "There's a syntax error in my primes.py file. Can you help me fix it?",
],
],
);
echo $response;
```
```ruby Ruby
client = Anthropic::Client.new
response = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
tools: [{type: "text\_editor\_20250728", name: "str\_replace\_based\_edit\_tool"}],
messages: [
{
role: "user",
content: "There's a syntax error in my primes.py file. Can you help me fix it?"
}
]
)
puts response
```
Claude uses the text editor tool first to view the file:
```json Output
{
"id": "msg\_01XAbCDeFgHiJkLmNoPQrStU",
"model": "claude-opus-5",
"stop\_reason": "tool\_use",
"role": "assistant",
"content": [
{
"type": "text",
"text": "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
},
{
"type": "tool\_use",
"id": "toolu\_01AbCdEfGhIjKlMnOpQrStU",
"name": "str\_replace\_based\_edit\_tool",
"input": {
"command": "view",
"path": "primes.py"
}
}
]
}
```
Your application should then read the file and return its contents to Claude:
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"tools": [
{
"type": "text\_editor\_20250728",
"name": "str\_replace\_based\_edit\_tool"
}
],
"messages": [
{
"role": "user",
"content": "There'\''s a syntax error in my primes.py file. Can you help me fix it?"
},
{
"role": "assistant",
"content": [
{
"type": "text",
"text": "I'\''ll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
},
{
"type": "tool\_use",
"id": "toolu\_01AbCdEfGhIjKlMnOpQrStU",
"name": "str\_replace\_based\_edit\_tool",
"input": {
"command": "view",
"path": "primes.py"
}
}
]
},
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01AbCdEfGhIjKlMnOpQrStU",
"content": "1: def is\_prime(n):\n2: \"\"\"Check if a number is prime.\"\"\"\n3: if n <= 1:\n4: return False\n5: if n <= 3:\n6: return True\n7: if n % 2 == 0 or n % 3 == 0:\n8: return False\n9: i = 5\n10: while i \* i <= n:\n11: if n % i == 0 or n % (i + 2) == 0:\n12: return False\n13: i += 6\n14: return True\n15: \n16: def get\_primes(limit):\n17: \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18: primes = []\n19: for num in range(2, limit + 1)\n20: if is\_prime(num):\n21: primes.append(num)\n22: return primes\n23: \n24: def main():\n25: \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26: limit = 100\n27: prime\_list = get\_primes(limit)\n28: print(f\"Prime numbers up to {limit}:\")\n29: print(prime\_list)\n30: print(f\"Found {len(prime\_list)} prime numbers.\")\n31: \n32: if \_\_name\_\_ == \"\_\_main\_\_\":\n33: main()"
}
]
}
]
}'
```
```bash CLI
ant messages create <<'YAML'
model: claude-opus-5
max\_tokens: 1024
tools:
- type: text\_editor\_20250728
name: str\_replace\_based\_edit\_tool
messages:
- role: user
content: There's a syntax error in my primes.py file. Can you help me fix it?
- role: assistant
content:
- type: text
text: >-
I'll help you fix the syntax error in your primes.py file. First,
let me take a look at the file to identify the issue.
- type: tool\_use
id: toolu\_01AbCdEfGhIjKlMnOpQrStU
name: str\_replace\_based\_edit\_tool
input:
command: view
path: primes.py
- role: user
content:
- type: tool\_result
tool\_use\_id: toolu\_01AbCdEfGhIjKlMnOpQrStU
content: |-
1: def is\_prime(n):
2: """Check if a number is prime."""
3: if n <= 1:
4: return False
5: if n <= 3:
6: return True
7: if n % 2 == 0 or n % 3 == 0:
8: return False
9: i = 5
10: while i \* i <= n:
11: if n % i == 0 or n % (i + 2) == 0:
12: return False
13: i += 6
14: return True
15:
16: def get\_primes(limit):
17: """Generate a list of prime numbers up to the given limit."""
18: primes = []
19: for num in range(2, limit + 1)
20: if is\_prime(num):
21: primes.append(num)
22: return primes
23:
24: def main():
25: """Main function to demonstrate prime number generation."""
26: limit = 100
27: prime\_list = get\_primes(limit)
28: print(f"Prime numbers up to {limit}:")
29: print(prime\_list)
30: print(f"Found {len(prime\_list)} prime numbers.")
31:
32: if \_\_name\_\_ == "\_\_main\_\_":
33: main()
YAML
```
```python Python
response = client.messages.create(
model="claude-opus-5",
max\_tokens=1024,
tools=[{"type": "text\_editor\_20250728", "name": "str\_replace\_based\_edit\_tool"}],
messages=[
{
"role": "user",
"content": "There's a syntax error in my primes.py file. Can you help me fix it?",
},
{
"role": "assistant",
"content": [
{
"type": "text",
"text": "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue.",
},
{
"type": "tool\_use",
"id": "toolu\_01AbCdEfGhIjKlMnOpQrStU",
"name": "str\_replace\_based\_edit\_tool",
"input": {"command": "view", "path": "primes.py"},
},
],
},
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01AbCdEfGhIjKlMnOpQrStU",
"content": '1: def is\_prime(n):\n2: """Check if a number is prime."""\n3: if n <= 1:\n4: return False\n5: if n <= 3:\n6: return True\n7: if n % 2 == 0 or n % 3 == 0:\n8: return False\n9: i = 5\n10: while i \* i <= n:\n11: if n % i == 0 or n % (i + 2) == 0:\n12: return False\n13: i += 6\n14: return True\n15: \n16: def get\_primes(limit):\n17: """Generate a list of prime numbers up to the given limit."""\n18: primes = []\n19: for num in range(2, limit + 1)\n20: if is\_prime(num):\n21: primes.append(num)\n22: return primes\n23: \n24: def main():\n25: """Main function to demonstrate prime number generation."""\n26: limit = 100\n27: prime\_list = get\_primes(limit)\n28: print(f"Prime numbers up to {limit}:")\n29: print(prime\_list)\n30: print(f"Found {len(prime\_list)} prime numbers.")\n31: \n32: if \_\_name\_\_ == "\_\_main\_\_":\n33: main()',
}
],
},
],
)
print(response)
```
```typescript TypeScript
const anthropic = new Anthropic();
const response = await anthropic.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
tools: [
{
type: "text\_editor\_20250728",
name: "str\_replace\_based\_edit\_tool"
}
],
messages: [
{
role: "user",
content: "There's a syntax error in my primes.py file. Can you help me fix it?"
},
{
role: "assistant",
content: [
{
type: "text",
text: "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
},
{
type: "tool\_use",
id: "toolu\_01AbCdEfGhIjKlMnOpQrStU",
name: "str\_replace\_based\_edit\_tool",
input: {
command: "view",
path: "primes.py"
}
}
]
},
{
role: "user",
content: [
{
type: "tool\_result",
tool\_use\_id: "toolu\_01AbCdEfGhIjKlMnOpQrStU",
content:
'1: def is\_prime(n):\n2: """Check if a number is prime."""\n3: if n <= 1:\n4: return False\n5: if n <= 3:\n6: return True\n7: if n % 2 == 0 or n % 3 == 0:\n8: return False\n9: i = 5\n10: while i \* i <= n:\n11: if n % i == 0 or n % (i + 2) == 0:\n12: return False\n13: i += 6\n14: return True\n15: \n16: def get\_primes(limit):\n17: """Generate a list of prime numbers up to the given limit."""\n18: primes = []\n19: for num in range(2, limit + 1)\n20: if is\_prime(num):\n21: primes.append(num)\n22: return primes\n23: \n24: def main():\n25: """Main function to demonstrate prime number generation."""\n26: limit = 100\n27: prime\_list = get\_primes(limit)\n28: print(f"Prime numbers up to {limit}:")\n29: print(prime\_list)\n30: print(f"Found {len(prime\_list)} prime numbers.")\n31: \n32: if \_\_name\_\_ == "\_\_main\_\_":\n33: main()'
}
]
}
]
});
console.log(response);
```
```csharp C#
var client = new AnthropicClient();
var response = await client.Messages.Create(
new()
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Tools = [new ToolTextEditor20250728()],
Messages =
[
new()
{
Role = Role.User,
Content = "There's a syntax error in my primes.py file. Can you help me fix it?",
},
new()
{
Role = Role.Assistant,
Content = new MessageParamContent(new List
{
new ContentBlockParam(new TextBlockParam()
{
Text = "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue.",
}),
new ContentBlockParam(new ToolUseBlockParam()
{
ID = "toolu\_01AbCdEfGhIjKlMnOpQrStU",
Name = "str\_replace\_based\_edit\_tool",
Input = new Dictionary
{
["command"] = JsonSerializer.SerializeToElement("view"),
["path"] = JsonSerializer.SerializeToElement("primes.py"),
},
}),
}),
},
new()
{
Role = Role.User,
Content = new MessageParamContent(new List
{
new ContentBlockParam(new ToolResultBlockParam()
{
ToolUseID = "toolu\_01AbCdEfGhIjKlMnOpQrStU",
Content = "1: def is\_prime(n):\n2: \"\"\"Check if a number is prime.\"\"\"\n3: if n <= 1:\n4: return False\n5: if n <= 3:\n6: return True\n7: if n % 2 == 0 or n % 3 == 0:\n8: return False\n9: i = 5\n10: while i \* i <= n:\n11: if n % i == 0 or n % (i + 2) == 0:\n12: return False\n13: i += 6\n14: return True\n15: \n16: def get\_primes(limit):\n17: \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18: primes = []\n19: for num in range(2, limit + 1)\n20: if is\_prime(num):\n21: primes.append(num)\n22: return primes\n23: \n24: def main():\n25: \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26: limit = 100\n27: prime\_list = get\_primes(limit)\n28: print(f\"Prime numbers up to {limit}:\")\n29: print(prime\_list)\n30: print(f\"Found {len(prime\_list)} prime numbers.\")\n31: \n32: if \_\_name\_\_ == \"\_\_main\_\_\":\n33: main()",
}),
}),
},
],
}
);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Tools: []anthropic.ToolUnionParam{
{OfTextEditor20250728: &anthropic.ToolTextEditor20250728Param{}},
},
Messages: []anthropic.MessageParam{
anthropic.NewUserMessage(anthropic.NewTextBlock("There's a syntax error in my primes.py file. Can you help me fix it?")),
anthropic.NewAssistantMessage(
anthropic.NewTextBlock("I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."),
anthropic.NewToolUseBlock(
"toolu\_01AbCdEfGhIjKlMnOpQrStU",
map[string]any{"command": "view", "path": "primes.py"},
"str\_replace\_based\_edit\_tool",
),
),
anthropic.NewUserMessage(
anthropic.NewToolResultBlock(
"toolu\_01AbCdEfGhIjKlMnOpQrStU",
"1: def is\_prime(n):\n2: \"\"\"Check if a number is prime.\"\"\"\n3: if n <= 1:\n4: return False\n5: if n <= 3:\n6: return True\n7: if n % 2 == 0 or n % 3 == 0:\n8: return False\n9: i = 5\n10: while i \* i <= n:\n11: if n % i == 0 or n % (i + 2) == 0:\n12: return False\n13: i += 6\n14: return True\n15: \n16: def get\_primes(limit):\n17: \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18: primes = []\n19: for num in range(2, limit + 1)\n20: if is\_prime(num):\n21: primes.append(num)\n22: return primes\n23: \n24: def main():\n25: \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26: limit = 100\n27: prime\_list = get\_primes(limit)\n28: print(f\"Prime numbers up to {limit}:\")\n29: print(prime\_list)\n30: print(f\"Found {len(prime\_list)} prime numbers.\")\n31: \n32: if \_\_name\_\_ == \"\_\_main\_\_\":\n33: main()",
false,
),
),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024)
.addTool(ToolTextEditor20250728.builder().build())
.addUserMessage("There's a syntax error in my primes.py file. Can you help me fix it?")
.addAssistantMessageOfBlockParams(
List.of(
ContentBlockParam.ofText(
TextBlockParam.builder()
.text("I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue.")
.build()
),
ContentBlockParam.ofToolUse(
ToolUseBlockParam.builder()
.id("toolu\_01AbCdEfGhIjKlMnOpQrStU")
.name("str\_replace\_based\_edit\_tool")
.input(
ToolUseBlockParam.Input.builder()
.putAdditionalProperty("command", JsonValue.from("view"))
.putAdditionalProperty("path", JsonValue.from("primes.py"))
.build()
)
.build()
)
)
)
.addUserMessageOfBlockParams(
List.of(
ContentBlockParam.ofToolResult(
ToolResultBlockParam.builder()
.toolUseId("toolu\_01AbCdEfGhIjKlMnOpQrStU")
.content("1: def is\_prime(n):\n2: \"\"\"Check if a number is prime.\"\"\"\n3: if n <= 1:\n4: return False\n5: if n <= 3:\n6: return True\n7: if n % 2 == 0 or n % 3 == 0:\n8: return False\n9: i = 5\n10: while i \* i <= n:\n11: if n % i == 0 or n % (i + 2) == 0:\n12: return False\n13: i += 6\n14: return True\n15: \n16: def get\_primes(limit):\n17: \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18: primes = []\n19: for num in range(2, limit + 1)\n20: if is\_prime(num):\n21: primes.append(num)\n22: return primes\n23: \n24: def main():\n25: \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26: limit = 100\n27: prime\_list = get\_primes(limit)\n28: print(f\"Prime numbers up to {limit}:\")\n29: print(prime\_list)\n30: print(f\"Found {len(prime\_list)} prime numbers.\")\n31: \n32: if \_\_name\_\_ == \"\_\_main\_\_\":\n33: main()")
.build()
)
)
)
.build();
Message message = client.messages().create(params);
System.out.println(message);
```
```php PHP
$client = new Client();
$response = $client->messages->create(
model: 'claude-opus-5',
maxTokens: 1024,
tools: [new ToolTextEditor20250728()],
messages: [
[
'role' => 'user',
'content' => "There's a syntax error in my primes.py file. Can you help me fix it?",
],
[
'role' => 'assistant',
'content' => [
[
'type' => 'text',
'text' => "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue.",
],
[
'type' => 'tool\_use',
'id' => 'toolu\_01AbCdEfGhIjKlMnOpQrStU',
'name' => 'str\_replace\_based\_edit\_tool',
'input' => ['command' => 'view', 'path' => 'primes.py'],
],
],
],
[
'role' => 'user',
'content' => [
[
'type' => 'tool\_result',
'tool\_use\_id' => 'toolu\_01AbCdEfGhIjKlMnOpQrStU',
'content' => "1: def is\_prime(n):\n2: \"\"\"Check if a number is prime.\"\"\"\n3: if n <= 1:\n4: return False\n5: if n <= 3:\n6: return True\n7: if n % 2 == 0 or n % 3 == 0:\n8: return False\n9: i = 5\n10: while i \* i <= n:\n11: if n % i == 0 or n % (i + 2) == 0:\n12: return False\n13: i += 6\n14: return True\n15: \n16: def get\_primes(limit):\n17: \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18: primes = []\n19: for num in range(2, limit + 1)\n20: if is\_prime(num):\n21: primes.append(num)\n22: return primes\n23: \n24: def main():\n25: \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26: limit = 100\n27: prime\_list = get\_primes(limit)\n28: print(f\"Prime numbers up to {limit}:\")\n29: print(prime\_list)\n30: print(f\"Found {len(prime\_list)} prime numbers.\")\n31: \n32: if \_\_name\_\_ == \"\_\_main\_\_\":\n33: main()",
],
],
],
],
);
echo $response;
```
```ruby Ruby
client = Anthropic::Client.new
response = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
tools: [{type: "text\_editor\_20250728", name: "str\_replace\_based\_edit\_tool"}],
messages: [
{
role: "user",
content: "There's a syntax error in my primes.py file. Can you help me fix it?"
},
{
role: "assistant",
content: [
{
type: "text",
text: "I'll help you fix the syntax error in your primes.py file. First, let me take a look at the file to identify the issue."
},
{
type: "tool\_use",
id: "toolu\_01AbCdEfGhIjKlMnOpQrStU",
name: "str\_replace\_based\_edit\_tool",
input: {command: "view", path: "primes.py"}
}
]
},
{
role: "user",
content: [
{
type: "tool\_result",
tool\_use\_id: "toolu\_01AbCdEfGhIjKlMnOpQrStU",
content: "1: def is\_prime(n):\n2: \"\"\"Check if a number is prime.\"\"\"\n3: if n <= 1:\n4: return False\n5: if n <= 3:\n6: return True\n7: if n % 2 == 0 or n % 3 == 0:\n8: return False\n9: i = 5\n10: while i \* i <= n:\n11: if n % i == 0 or n % (i + 2) == 0:\n12: return False\n13: i += 6\n14: return True\n15: \n16: def get\_primes(limit):\n17: \"\"\"Generate a list of prime numbers up to the given limit.\"\"\"\n18: primes = []\n19: for num in range(2, limit + 1)\n20: if is\_prime(num):\n21: primes.append(num)\n22: return primes\n23: \n24: def main():\n25: \"\"\"Main function to demonstrate prime number generation.\"\"\"\n26: limit = 100\n27: prime\_list = get\_primes(limit)\n28: print(f\"Prime numbers up to {limit}:\")\n29: print(prime\_list)\n30: print(f\"Found {len(prime\_list)} prime numbers.\")\n31: \n32: if \_\_name\_\_ == \"\_\_main\_\_\":\n33: main()"
}
]
}
]
)
puts response
```

\*\*Line numbers\*\*
In the preceding example, the `view` tool result includes file contents with line numbers prepended to each line (for example, "1: def is\\_prime(n):"). Line numbers are not required, but they are essential for successfully using the `view\_range` parameter to examine specific sections of files and the `insert\_line` parameter to add content at precise locations.
Claude identifies the syntax error and uses the `str\_replace` command to fix it:
```json Output
{
"id": "msg\_01VwXyZAbCdEfGhIjKlMnO",
"model": "claude-opus-5",
"stop\_reason": "tool\_use",
"role": "assistant",
"content": [
{
"type": "text",
"text": "I found the syntax error in your primes.py file. In the `get\_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
},
{
"type": "tool\_use",
"id": "toolu\_01PqRsTuVwXyZAbCdEfGh",
"name": "str\_replace\_based\_edit\_tool",
"input": {
"command": "str\_replace",
"path": "primes.py",
"old\_str": " for num in range(2, limit + 1)",
"new\_str": " for num in range(2, limit + 1):"
}
}
]
}
```
Your application should then make the edit and return the result:
```bash cURL
curl https://api.anthropic.com/v1/messages \
-H "content-type: application/json" \
-H "x-api-key: $ANTHROPIC\_API\_KEY" \
-H "anthropic-version: 2023-06-01" \
-d '{
"model": "claude-opus-5",
"max\_tokens": 1024,
"tools": [
{
"type": "text\_editor\_20250728",
"name": "str\_replace\_based\_edit\_tool"
}
],
"messages": [
{
"role": "assistant",
"content": [
{
"type": "text",
"text": "I found the syntax error in your primes.py file. In the `get\_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
},
{
"type": "tool\_use",
"id": "toolu\_01PqRsTuVwXyZAbCdEfGh",
"name": "str\_replace\_based\_edit\_tool",
"input": {
"command": "str\_replace",
"path": "primes.py",
"old\_str": " for num in range(2, limit + 1)",
"new\_str": " for num in range(2, limit + 1):"
}
}
]
},
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01PqRsTuVwXyZAbCdEfGh",
"content": "Successfully replaced text at exactly one location."
}
]
}
]
}'
```
```bash CLI
ant messages create <<'YAML'
model: claude-opus-5
max\_tokens: 1024
tools:
- type: text\_editor\_20250728
name: str\_replace\_based\_edit\_tool
messages:
# Previous messages...
- role: assistant
content:
- type: text
text: >-
I found the syntax error in your primes.py file. In the `get\_primes`
function, there is a missing colon (:) at the end of the for loop
line. Let me fix that for you.
- type: tool\_use
id: toolu\_01PqRsTuVwXyZAbCdEfGh
name: str\_replace\_based\_edit\_tool
input:
command: str\_replace
path: primes.py
old\_str: " for num in range(2, limit + 1)"
new\_str: " for num in range(2, limit + 1):"
- role: user
content:
- type: tool\_result
tool\_use\_id: toolu\_01PqRsTuVwXyZAbCdEfGh
content: Successfully replaced text at exactly one location.
YAML
```
```python Python
response = client.messages.create(
model="claude-opus-5",
max\_tokens=1024,
tools=[{"type": "text\_editor\_20250728", "name": "str\_replace\_based\_edit\_tool"}],
messages=[
# Previous messages...
{
"role": "assistant",
"content": [
{
"type": "text",
"text": "I found the syntax error in your primes.py file. In the `get\_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you.",
},
{
"type": "tool\_use",
"id": "toolu\_01PqRsTuVwXyZAbCdEfGh",
"name": "str\_replace\_based\_edit\_tool",
"input": {
"command": "str\_replace",
"path": "primes.py",
"old\_str": " for num in range(2, limit + 1)",
"new\_str": " for num in range(2, limit + 1):",
},
},
],
},
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01PqRsTuVwXyZAbCdEfGh",
"content": "Successfully replaced text at exactly one location.",
}
],
},
],
)
print(response)
```
```typescript TypeScript
const response = await client.messages.create({
model: "claude-opus-5",
max\_tokens: 1024,
tools: [
{
type: "text\_editor\_20250728",
name: "str\_replace\_based\_edit\_tool"
}
],
messages: [
// Previous messages...
{
role: "assistant",
content: [
{
type: "text",
text: "I found the syntax error in your primes.py file. In the `get\_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
},
{
type: "tool\_use",
id: "toolu\_01PqRsTuVwXyZAbCdEfGh",
name: "str\_replace\_based\_edit\_tool",
input: {
command: "str\_replace",
path: "primes.py",
old\_str: " for num in range(2, limit + 1)",
new\_str: " for num in range(2, limit + 1):"
}
}
]
},
{
role: "user",
content: [
{
type: "tool\_result",
tool\_use\_id: "toolu\_01PqRsTuVwXyZAbCdEfGh",
content: "Successfully replaced text at exactly one location."
}
]
}
]
});
console.log(response);
```
```csharp C#
var client = new AnthropicClient();
var response = await client.Messages.Create(
new()
{
Model = Model.ClaudeOpus5,
MaxTokens = 1024,
Tools = [new ToolTextEditor20250728()],
Messages =
[
// Previous messages...
new()
{
Role = Role.Assistant,
Content = new MessageParamContent(new List
{
new ContentBlockParam(new TextBlockParam()
{
Text = "I found the syntax error in your primes.py file. In the `get\_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you.",
}),
new ContentBlockParam(new ToolUseBlockParam()
{
ID = "toolu\_01PqRsTuVwXyZAbCdEfGh",
Name = "str\_replace\_based\_edit\_tool",
Input = new Dictionary
{
["command"] = JsonSerializer.SerializeToElement("str\_replace"),
["path"] = JsonSerializer.SerializeToElement("primes.py"),
["old\_str"] = JsonSerializer.SerializeToElement(" for num in range(2, limit + 1)"),
["new\_str"] = JsonSerializer.SerializeToElement(" for num in range(2, limit + 1):"),
},
}),
}),
},
new()
{
Role = Role.User,
Content = new MessageParamContent(new List
{
new ContentBlockParam(new ToolResultBlockParam()
{
ToolUseID = "toolu\_01PqRsTuVwXyZAbCdEfGh",
Content = "Successfully replaced text at exactly one location.",
}),
}),
},
],
}
);
Console.WriteLine(response);
```
```go Go
client := anthropic.NewClient()
response, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
Model: anthropic.ModelClaudeOpus5,
MaxTokens: 1024,
Tools: []anthropic.ToolUnionParam{
{OfTextEditor20250728: &anthropic.ToolTextEditor20250728Param{}},
},
Messages: []anthropic.MessageParam{
// Previous messages...
anthropic.NewAssistantMessage(
anthropic.NewTextBlock("I found the syntax error in your primes.py file. In the `get\_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."),
anthropic.NewToolUseBlock(
"toolu\_01PqRsTuVwXyZAbCdEfGh",
map[string]any{
"command": "str\_replace",
"path": "primes.py",
"old\_str": " for num in range(2, limit + 1)",
"new\_str": " for num in range(2, limit + 1):",
},
"str\_replace\_based\_edit\_tool",
),
),
anthropic.NewUserMessage(
anthropic.NewToolResultBlock(
"toolu\_01PqRsTuVwXyZAbCdEfGh",
"Successfully replaced text at exactly one location.",
false,
),
),
},
})
if err != nil {
log.Fatal(err)
}
fmt.Println(response)
```
```java Java
AnthropicClient client = AnthropicOkHttpClient.fromEnv();
MessageCreateParams params = MessageCreateParams.builder()
.model(Model.CLAUDE\_OPUS\_5)
.maxTokens(1024)
.addTool(ToolTextEditor20250728.builder().build())
// Previous messages would go here
.addAssistantMessageOfBlockParams(
List.of(
ContentBlockParam.ofText(
TextBlockParam.builder()
.text(
"I found the syntax error in your primes.py file. In the `get\_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
)
.build()
),
ContentBlockParam.ofToolUse(
ToolUseBlockParam.builder()
.id("toolu\_01PqRsTuVwXyZAbCdEfGh")
.name("str\_replace\_based\_edit\_tool")
.input(
ToolUseBlockParam.Input.builder()
.putAdditionalProperty("command", JsonValue.from("str\_replace"))
.putAdditionalProperty("path", JsonValue.from("primes.py"))
.putAdditionalProperty(
"old\_str",
JsonValue.from(" for num in range(2, limit + 1)")
)
.putAdditionalProperty(
"new\_str",
JsonValue.from(" for num in range(2, limit + 1):")
)
.build()
)
.build()
)
)
)
.addUserMessageOfBlockParams(
List.of(
ContentBlockParam.ofToolResult(
ToolResultBlockParam.builder()
.toolUseId("toolu\_01PqRsTuVwXyZAbCdEfGh")
.content("Successfully replaced text at exactly one location.")
.build()
)
)
)
.build();
Message message = client.messages().create(params);
System.out.println(message);
```
```php PHP
$client = new Client();
$response = $client->messages->create(
model: 'claude-opus-5',
maxTokens: 1024,
tools: [new ToolTextEditor20250728()],
messages: [
// Previous messages...
[
'role' => 'assistant',
'content' => [
[
'type' => 'text',
'text' => 'I found the syntax error in your primes.py file. In the `get\_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you.',
],
[
'type' => 'tool\_use',
'id' => 'toolu\_01PqRsTuVwXyZAbCdEfGh',
'name' => 'str\_replace\_based\_edit\_tool',
'input' => [
'command' => 'str\_replace',
'path' => 'primes.py',
'old\_str' => ' for num in range(2, limit + 1)',
'new\_str' => ' for num in range(2, limit + 1):',
],
],
],
],
[
'role' => 'user',
'content' => [
[
'type' => 'tool\_result',
'tool\_use\_id' => 'toolu\_01PqRsTuVwXyZAbCdEfGh',
'content' => 'Successfully replaced text at exactly one location.',
],
],
],
],
);
echo $response;
```
```ruby Ruby
client = Anthropic::Client.new
response = client.messages.create(
model: "claude-opus-5",
max\_tokens: 1024,
tools: [{type: "text\_editor\_20250728", name: "str\_replace\_based\_edit\_tool"}],
messages: [
# Previous messages...
{
role: "assistant",
content: [
{
type: "text",
text: "I found the syntax error in your primes.py file. In the `get\_primes` function, there is a missing colon (:) at the end of the for loop line. Let me fix that for you."
},
{
type: "tool\_use",
id: "toolu\_01PqRsTuVwXyZAbCdEfGh",
name: "str\_replace\_based\_edit\_tool",
input: {
command: "str\_replace",
path: "primes.py",
old\_str: " for num in range(2, limit + 1)",
new\_str: " for num in range(2, limit + 1):"
}
}
]
},
{
role: "user",
content: [
{
type: "tool\_result",
tool\_use\_id: "toolu\_01PqRsTuVwXyZAbCdEfGh",
content: "Successfully replaced text at exactly one location."
}
]
}
]
)
puts response
```
Finally, Claude provides a complete explanation of the fix:
````json Output
{
"id": "msg\_01IjKlMnOpQrStUvWxYzAb",
"model": "claude-opus-5",
"stop\_reason": "end\_turn",
"role": "assistant",
"content": [
{
"type": "text",
"text": "I've fixed the syntax error in your primes.py file. The issue was in the `get\_primes` function at line 19. There was a missing colon (:) at the end of the for loop line.\n\nHere's what I changed:\n\nFrom:\n```python\nfor num in range(2, limit + 1)\n```\n\nTo:\n```python\nfor num in range(2, limit + 1):\n```\n\nIn Python, a colon is required at the end of statements that start a new code block, such as for loops, if statements, function definitions, etc. Without the colon, Python raises a syntax error because it doesn't know where the code block begins.\n\nYour code should now run correctly. The function will properly generate a list of prime numbers up to the specified limit."
}
]
}
````
## Implement the text editor tool
The text editor tool is implemented as a schema-less tool. When using this tool, you don't need to provide an input schema as with other tools; the schema is built into Claude's model and can't be modified.
The tool type is `type: "text\_editor\_20250728"` for Claude 4 and later models.

Create helper functions to handle file operations like reading, writing, and modifying files. Consider implementing backup functionality to recover from mistakes.

Create a function that processes tool calls from Claude based on the command type:
```python Python
def handle\_editor\_tool(tool\_call):
input\_params = tool\_call.input
command = input\_params.get("command", "")
file\_path = input\_params.get("path", "")
if command == "view":
# Read and return file contents
pass
elif command == "str\_replace":
# Replace text in file
pass
elif command == "create":
# Create new file
pass
elif command == "insert":
# Insert text at location
pass
```
```typescript TypeScript
function handleEditorTool(toolCall: { input: { command?: string; path?: string } }): void {
const inputParams = toolCall.input;
const command = inputParams.command ?? "";
const filePath = inputParams.path ?? "";
if (command === "view") {
// Read and return file contents
} else if (command === "str\_replace") {
// Replace text in file
} else if (command === "create") {
// Create new file
} else if (command === "insert") {
// Insert text at location
}
}
```
```csharp C#
static string HandleEditorTool(IReadOnlyDictionary input)
{
input.TryGetValue("command", out var commandEl);
input.TryGetValue("path", out var pathEl);
var command = commandEl.ValueKind == JsonValueKind.String ? commandEl.GetString() : null;
var filePath = pathEl.ValueKind == JsonValueKind.String ? pathEl.GetString() : null;
if (command == "view")
{
// Read and return file contents
}
else if (command == "str\_replace")
{
// Replace text in file
}
else if (command == "create")
{
// Create new file
}
else if (command == "insert")
{
// Insert text at location
}
return "";
}
```
```go Go
func handleEditorTool(input map[string]any) string {
command, \_ := input["command"].(string)
filePath, \_ := input["path"].(string)
// ...
switch command {
case "view":
// Read and return file contents
case "str\_replace":
// Replace text in file
case "create":
// Create new file
case "insert":
// Insert text at location
}
return ""
}
```
```java Java
static void handleEditorTool(Map input) {
var command = (String) input.getOrDefault("command", "");
var filePath = (String) input.getOrDefault("path", "");
if (command.equals("view")) {
// Read and return file contents
} else if (command.equals("str\_replace")) {
// Replace text in file
} else if (command.equals("create")) {
// Create new file
} else if (command.equals("insert")) {
// Insert text at location
}
}
```
```php PHP
function handle\_editor\_tool(array $input): string
{
$command = $input['command'] ?? '';
$filePath = $input['path'] ?? '';
if ($command === 'view') {
// Read and return file contents
} elseif ($command === 'str\_replace') {
// Replace text in file
} elseif ($command === 'create') {
// Create new file
} elseif ($command === 'insert') {
// Insert text at location
}
return '';
}
```
```ruby Ruby
def handle\_editor\_tool(input)
command = input[:command] || ""
file\_path = input[:path] || ""
case command
when "view"
# Read and return file contents
when "str\_replace"
# Replace text in file
when "create"
# Create new file
when "insert"
# Insert text at location
end
end
```

Add validation and security checks:
\* Validate file paths to prevent directory traversal
\* Create backups before making changes
\* Handle errors gracefully
\* Implement permissions checks

Extract and handle tool calls from Claude's responses:
```python Python
# Process tool use in Claude's response
for content in response.content:
if content.type == "tool\_use":
# Execute the tool based on command
result = handle\_editor\_tool(content)
# Return result to Claude
tool\_result = {
"type": "tool\_result",
"tool\_use\_id": content.id,
"content": result,
}
```
```typescript TypeScript
// Process tool use in Claude's response
for (const block of response.content) {
if (block.type === "tool\_use") {
// Execute the tool based on command
const result = handleEditorTool(block);
// Return result to Claude
const toolResult = {
type: "tool\_result",
tool\_use\_id: block.id,
content: result
};
}
}
```
```csharp C#
// Process tool use in Claude's response
foreach (var block in response.Content)
{
if (block.TryPickToolUse(out var toolUse))
{
var result = HandleEditorTool(toolUse.Input);
var toolResult = new ToolResultBlockParam
{
ToolUseID = toolUse.ID,
Content = result,
};
}
}
```
```go Go
// Process tool use in Claude's response
for \_, block := range response.Content {
if block.Type == "tool\_use" {
var input map[string]any
if err := json.Unmarshal(block.Input, &input); err != nil {
log.Fatal(err)
}
result := handleEditorTool(input)
toolResult := anthropic.NewToolResultBlock(block.ID, result, false)
// ...
}
}
```
```java Java
// Process tool use in Claude's response
for (var block : response.content()) {
if (block.type().equals("tool\_use")) {
// Execute the tool based on command
var result = handleEditorTool(block);
// Return result to Claude
var toolResult = Map.of(
"type", "tool\_result",
"tool\_use\_id", block.id(),
"content", result
);
}
}
```
```php PHP
// Process tool use in Claude's response
foreach ($response->content as $block) {
if ($block->type === 'tool\_use') {
// Execute the tool based on command
$result = handle\_editor\_tool($block->input);
// Return result to Claude
$toolResult = [
'type' => 'tool\_result',
'tool\_use\_id' => $block->id,
'content' => $result,
];
}
}
```
```ruby Ruby
# Process tool use in Claude's response
tool\_results = response.content.filter\_map do |block|
next unless block.type == :tool\_use
{type: "tool\_result", tool\_use\_id: block.id, content: handle\_editor\_tool(block.input)}
end
```

When implementing the text editor tool, keep in mind:
1. \*\*Security:\*\* The tool has access to your local filesystem, so implement proper security measures.
2. \*\*Backup:\*\* Always create backups before allowing edits to important files.
3. \*\*Validation:\*\* Validate all inputs to prevent unintended changes.
4. \*\*Unique matching:\*\* Make sure replacements match exactly one location to avoid unintended edits.
### Handle errors
When using the text editor tool, various errors may occur. Here is guidance on how to handle them:

If Claude tries to view or modify a file that doesn't exist, return an appropriate error message in the `tool\_result`:
```json
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01A09q90qw90lq917835lq9",
"content": "Error: File not found",
"is\_error": true
}
]
}
```

If Claude's `str\_replace` command matches multiple locations in the file, return an appropriate error message:
```json
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01A09q90qw90lq917835lq9",
"content": "Error: Found 3 matches for replacement text. Please provide more context to make a unique match.",
"is\_error": true
}
]
}
```

If Claude's `str\_replace` command doesn't match any text in the file, return an appropriate error message:
```json
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01A09q90qw90lq917835lq9",
"content": "Error: No match found for replacement. Please check your text and try again.",
"is\_error": true
}
]
}
```

If there are permission issues with creating, reading, or modifying files, return an appropriate error message:
```json
{
"role": "user",
"content": [
{
"type": "tool\_result",
"tool\_use\_id": "toolu\_01A09q90qw90lq917835lq9",
"content": "Error: Permission denied. Cannot write to file.",
"is\_error": true
}
]
}
```
### Follow implementation best practices

When asking Claude to fix or modify code, be specific about what files need to be examined or what issues need to be addressed. Clear context helps Claude identify the right files and make appropriate changes.
\*\*Less helpful prompt:\*\* "Can you fix my code?"
\*\*Better prompt:\*\* "There's a syntax error in my primes.py file that prevents it from running. Can you fix it?"

Specify file paths clearly when needed, especially if you're working with multiple files or files in different directories.
\*\*Less helpful prompt:\*\* "Review my helper file"
\*\*Better prompt:\*\* "Can you check my utils/helpers.py file for any performance issues?"

Implement a backup system in your application that creates copies of files before allowing Claude to edit them, especially for important or production code.
```python Python
def backup\_file(file\_path):
"""Create a backup of a file before editing."""
backup\_path = f"{file\_path}.backup"
if os.path.exists(file\_path):
with open(file\_path, "r") as src, open(backup\_path, "w") as dst:
dst.write(src.read())
```
```typescript TypeScript
async function backupFile(filePath: string): Promise {
const backupPath = `${filePath}.backup`;
try {
await access(filePath);
await copyFile(filePath, backupPath);
} catch {
// File does not exist; nothing to back up
}
}
```
```csharp C#
static void BackupFile(string filePath)
{
var backupPath = $"{filePath}.backup";
if (File.Exists(filePath))
{
File.Copy(filePath, backupPath, overwrite: true);
}
}
```
```go Go
func backupFile(filePath string) error {
backupPath := filePath + ".backup"
data, err := os.ReadFile(filePath)
if err != nil {
if os.IsNotExist(err) {
return nil
}
return err
}
return os.WriteFile(backupPath, data, 0o644)
}
```
```java Java
static void backupFile(String filePath) throws IOException {
Path source = Path.of(filePath);
Path backupPath = Path.of(filePath + ".backup");
if (Files.exists(source)) {
Files.copy(source, backupPath, StandardCopyOption.REPLACE\_EXISTING);
}
}
```
```php PHP
function backup\_file(string $filePath): void
{
$backupPath = $filePath . '.backup';
if (file\_exists($filePath)) {
copy($filePath, $backupPath);
}
}
```
```ruby Ruby
def backup\_file(file\_path)
backup\_path = "#{file\_path}.backup"
FileUtils.cp(file\_path, backup\_path) if File.exist?(file\_path)
end
```

The `str\_replace` command requires an exact match for the text to be replaced. Your application should ensure that there is exactly one match for the old text or provide appropriate error messages.
```python Python
def safe\_replace(file\_path, old\_text, new\_text):
"""Replace text only if there's exactly one match."""
with open(file\_path, "r") as f:
content = f.read()
count = content.count(old\_text)
if count == 0:
return "Error: No match found"
elif count > 1:
return f"Error: Found {count} matches"
else:
new\_content = content.replace(old\_text, new\_text)
with open(file\_path, "w") as f:
f.write(new\_content)
return "Successfully replaced text"
```
```typescript TypeScript
async function safeReplace(
filePath: string,
oldText: string,
newText: string
): Promise {
const content = await readFile(filePath, "utf8");
const count = content.split(oldText).length - 1;
if (count === 0) {
return "Error: No match found";
} else if (count > 1) {
return `Error: Found ${count} matches`;
} else {
const newContent = content.replace(oldText, newText);
await writeFile(filePath, newContent, "utf8");
return "Successfully replaced text";
}
}
```
```csharp C#
static string SafeReplace(string filePath, string oldText, string newText)
{
var content = File.ReadAllText(filePath);
var count = content.Split(oldText).Length - 1;
if (count == 0)
{
return "Error: No match found";
}
else if (count > 1)
{
return $"Error: Found {count} matches";
}
else
{
var newContent = content.Replace(oldText, newText);
File.WriteAllText(filePath, newContent);
return "Successfully replaced text";
}
}
```
```go Go
func safeReplace(filePath, oldText, newText string) string {
data, err := os.ReadFile(filePath)
if err != nil {
return fmt.Sprintf("Error: %v", err)
}
content := string(data)
count := strings.Count(content, oldText)
if count == 0 {
return "Error: No match found"
} else if count > 1 {
return fmt.Sprintf("Error: Found %d matches", count)
}
newContent := strings.Replace(content, oldText, newText, 1)
if err := os.WriteFile(filePath, []byte(newContent), 0o644); err != nil {
return fmt.Sprintf("Error: %v", err)
}
return "Successfully replaced text"
}
```
```java Java
static String safeReplace(String filePath, String oldText, String newText) throws IOException {
String content = Files.readString(Path.of(filePath));
int count = content.split(Pattern.quote(oldText), -1).length - 1;
if (count == 0) {
return "Error: No match found";
} else if (count > 1) {
return "Error: Found " + count + " matches";
} else {
String newContent = content.replace(oldText, newText);
Files.writeString(Path.of(filePath), newContent);
return "Successfully replaced text";
}
}
```
```php PHP
function safe\_replace(string $filePath, string $oldText, string $newText): string
{
$content = file\_get\_contents($filePath);
$count = substr\_count($content, $oldText);
if ($count === 0) {
return 'Error: No match found';
} elseif ($count > 1) {
return "Error: Found {$count} matches";
} else {
$newContent = str\_replace($oldText, $newText, $content);
file\_put\_contents($filePath, $newContent);
return 'Successfully replaced text';
}
}
```
```ruby Ruby
def safe\_replace(file\_path, old\_text, new\_text)
content = File.read(file\_path)
count = content.scan(old\_text).length
if count == 0
"Error: No match found"
elsif count > 1
"Error: Found #{count} matches"
else
new\_content = content.sub(old\_text) { new\_text }
File.write(file\_path, new\_content)
"Successfully replaced text"
end
end
```

After Claude makes changes to a file, verify the changes by running tests or checking that the code still works as expected.
```python Python
def verify\_changes(file\_path):
"""Run tests or checks after making changes."""
try:
# For Python files, check for syntax errors
if file\_path.endswith(".py"):
import ast
with open(file\_path, "r") as f:
ast.parse(f.read())
return "Syntax check passed"
except Exception as e:
return f"Verification failed: {str(e)}"
```
```typescript TypeScript
function verifyChanges(filePath: string): string {
try {
// For Python files, check for syntax errors
if (filePath.endsWith(".py")) {
execFileSync("python3", ["-m", "py\_compile", filePath]);
return "Syntax check passed";
}
return "No checks defined for this file type";
} catch (err) {
return `Verification failed: ${err}`;
}
}
```
```csharp C#
static string VerifyChanges(string filePath)
{
try
{
// For Python files, check for syntax errors
if (filePath.EndsWith(".py"))
{
var psi = new ProcessStartInfo("python3")
{
RedirectStandardError = true,
};
psi.ArgumentList.Add("-m");
psi.ArgumentList.Add("py\_compile");
psi.ArgumentList.Add(filePath);
using var proc = Process.Start(psi)!;
proc.WaitForExit();
if (proc.ExitCode != 0)
{
return $"Verification failed: {proc.StandardError.ReadToEnd()}";
}
return "Syntax check passed";
}
return "No checks defined for this file type";
}
catch (Exception e)
{
return $"Verification failed: {e.Message}";
}
}
```
```go Go
func verifyChanges(filePath string) string {
// For Python files, check for syntax errors
if strings.HasSuffix(filePath, ".py") {
cmd := exec.Command("python3", "-m", "py\_compile", filePath)
if out, err := cmd.CombinedOutput(); err != nil {
return fmt.Sprintf("Verification failed: %v: %s", err, out)
}
return "Syntax check passed"
}
return "No checks defined for this file type"
}
```
```java Java
static String verifyChanges(String filePath) {
try {
// For Python files, check for syntax errors
if (filePath.endsWith(".py")) {
Process proc = new ProcessBuilder("python3", "-m", "py\_compile", filePath)
.redirectErrorStream(true)
.start();
if (proc.waitFor() != 0) {
return "Verification failed: " + new String(proc.getInputStream().readAllBytes());
}
return "Syntax check passed";
}
return "No checks defined for this file type";
} catch (IOException | InterruptedException e) {
return "Verification failed: " + e.getMessage();
}
}
```
```php PHP
function verify\_changes(string $filePath): string
{
// For Python files, check for syntax errors
if (str\_ends\_with($filePath, '.py')) {
exec('python3 -m py\_compile ' . escapeshellarg($filePath) . ' 2>&1', $output, $exitCode);
if ($exitCode !== 0) {
return 'Verification failed: ' . implode("\n", $output);
}
return 'Syntax check passed';
}
return 'No checks defined for this file type';
}
```
```ruby Ruby
def verify\_changes(file\_path)
# For Python files, check for syntax errors
if file\_path.end\_with?(".py")
if system("python3", "-m", "py\_compile", file\_path)
"Syntax check passed"
else
"Verification failed: syntax error in #{file\_path}"
end
else
"No checks defined for this file type"
end
end
```
\*\*\*
## Pricing and token usage
The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.
In addition to the base tokens, the following additional input tokens are needed for the text editor tool:
| Tool | Additional input tokens |
| ----------------------------------- | ----------------------- |
| `text\_editor\_20250429` (Claude 4.x) | 700 tokens |
For more detailed information about tool pricing, see [Tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing).
## Integrate the text editor tool with other tools
You can use the text editor tool alongside other Claude tools. When combining tools, ensure you:
\* Match the tool version with the model you're using
\* Account for the additional token usage for all tools included in your request
## Change log
| Date | Version | Changes |
| ---------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| July 28, 2025 | `text\_editor\_20250728` | Release of an updated text editor tool that fixes some issues and adds an optional `max\_characters` parameter. It is otherwise identical to `text\_editor\_20250429`. |
| April 29, 2025 | `text\_editor\_20250429` | Release of the text editor tool for Claude 4. This version removes the `undo\_edit` command but maintains all other capabilities. The tool name has been updated to reflect its str\\_replace-based architecture. |
| March 13, 2025 | `text\_editor\_20250124` | Introduction of standalone text editor tool documentation. This version is optimized for Claude Sonnet 3.7 but has identical capabilities to the previous version. |
| October 22, 2024 | `text\_editor\_20241022` | Initial release of the text editor tool with Claude Sonnet 3.5 (retired; see [Model deprecations](/docs/en/about-claude/model-deprecations)). Provides capabilities for viewing, creating, and editing files through the `view`, `create`, `str\_replace`, `insert`, and `undo\_edit` commands. |
## Next steps
Here are some ideas for how to use the text editor tool in more convenient and powerful ways:
\* \*\*Integrate with your development workflow\*\*: Build the text editor tool into your development tools or IDE
\* \*\*Create a code review system\*\*: Have Claude review your code and make improvements
\* \*\*Build a debugging assistant\*\*: Create a system where Claude can help you diagnose and fix issues in your code
\* \*\*Implement file format conversion\*\*: Let Claude help you convert files from one format to another
\* \*\*Automate documentation\*\*: Set up workflows for Claude to automatically document your code
The text editor tool enables Claude to work directly with your code base, supporting workflows from debugging to automated documentation.

Learn how to implement tool workflows for use with Claude.

Execute shell commands with Claude.
