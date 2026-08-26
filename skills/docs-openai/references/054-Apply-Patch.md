# Apply Patch

Source: https://developers.openai.com/api/docs/guides/tools-apply-patch.md

# Apply Patch
> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.
The `apply\_patch` tool lets GPT-5.1 create, update, and delete files in your codebase using structured diffs. Instead of just suggesting edits, the model emits patch operations that your application applies and then reports back on, enabling iterative, multi-step code editing workflows.
## When to use
Some common scenarios where you would use apply\_patch:
- \*\*Multi-file refactors\*\* – Rename symbols, extract helpers, or reorganize modules across many files at once.
- \*\*Bug fixes\*\* – Have the model both diagnose issues and emit precise patches.
- \*\*Tests & docs generation\*\* – Create new test files, fixtures, and documentation alongside code changes.
- \*\*Migrations & mechanical edits\*\* – Apply repetitive, structured updates (API migrations, type annotations, formatting fixes, etc.).
If you can describe your repo and desired change in text, apply\_patch can usually generate the corresponding diffs.
## Use apply patch tool with Responses API
At a high level, using `apply\_patch` with the Responses API looks like this:
1. \*\*Call the Responses API with the `apply\_patch` tool\*\*
- Provide the model with context about available files (or a summary) in your `input`, or give the model tools for exploring your file system.
- Enable the tool with `tools=[{"type": "apply\_patch"}]`.
2. \*\*Let the model return one or more patch operations\*\*
- The Response output includes one or more `apply\_patch\_call` objects.
- Each call describes a single file operation: create, update, or delete.
3. \*\*Apply patches in your environment\*\*
- Run a patch harness or script that:
- Interprets the `operation` diff for each `apply\_patch\_call`.
- Applies the patch to your working directory or repo.
- Records whether each patch succeeded and any logs or error messages.
4. \*\*Report patch results back to the model\*\*
- Call the Responses API again, either with `previous\_response\_id` or by passing back your conversation items into `input`.
- Include an `apply\_patch\_call\_output` event for each `call\_id`, with a `status` and optional `output` string.
- Keep `tools=[{"type": "apply\_patch"}]` so the model can continue editing if needed.
5. \*\*Let the model continue or explain changes\*\*
- The model may issue more `apply\_patch\_call` operations, or
- Provide a human-facing explanation of what it changed and why.
## Example: Renaming a function with Apply Patch Tool
\*\*Step 1: Ask the model to plan and emit patches\*\*
Ask the model to plan and emit patches
```python
from openai import OpenAI
client = OpenAI()
# For brevity, we are including file context in the example input.
# Most agentic use cases should instead equip the model with tools
# for exploring file system state.
RESPONSE\_INPUT = """
The user has the following files:
===== lib/fib.py
def fib(n):
if n <= 1:
return n
return fib(n-1) + fib(n-2)
===== run.py
from lib.fib import fib
def main():
print(fib(42))
You are a helpful coding assistant that should assist the user with whatever they
ask.
User query:
Help me rename the fib() function to fibonacci()
"""
response = client.responses.create(
model="gpt-5.6",
input=RESPONSE\_INPUT,
tools=[{"type": "apply\_patch"}],
)
# response.output may contain multiple apply\_patch\_call entries, e.g.:
# - update lib/fib.py
# - update run.py
patch\_calls = [
item.model\_dump() for item in response.output if item.type == "apply\_patch\_call"
]
```
\*\*Example `apply\_patch\_call` object\*\*
Example apply\_patch\_call object
```json
{
"id": "apc\_08f3d96c87a585390069118b594f7481a088b16cda7d9415fe",
"type": "apply\_patch\_call",
"status": "completed",
"call\_id": "call\_Rjsqzz96C5xzPb0jUWJFRTNW",
"operation": {
"type": "update\_file",
"diff": "
@@
-def fib(n):
+def fibonacci(n):
if n <= 1:
return n
- return fib(n-1) + fib(n-2) + return fibonacci(n-1) + fibonacci(n-2),
",
"path": "lib/fib.py"
}
}
```
\*\*Step 2: Apply the patch and send results back\*\*
Apply the patch and return results
```python
from apply\_patch\_harness import apply\_operation # your implementation
results = []
for call in patch\_calls:
op = call["operation"]
success, maybe\_log\_output = apply\_operation(op)
results.append(
{
"type": "apply\_patch\_call\_output",
"call\_id": call["call\_id"],
"status": "completed" if success else "failed",
"output": maybe\_log\_output,
}
)
followup = client.responses.create(
model="gpt-5.6",
previous\_response\_id=response.id,
input=results,
tools=[{"type": "apply\_patch"}],
)
```
If a patch fails (for example, file not found), set `status: "failed"` and include a helpful `output` string so the model can recover:
Report a failed apply\_patch call
```json
{
"type": "apply\_patch\_call\_output",
"call\_id": "call\_cNWm41dB3RyQcLNOVTIPBWZU",
"status": "failed",
"output": "Could not apply patch to lib/foo.py — file not found on disk"
}
```
## Apply patch operations
| Operation Type | Purpose | Payload |
| -------------- | ---------------------------------- | ---------------------------------------------------------------- |
| `create\_file` | Create a new file at `path`. | `diff` is a V4A diff representing the full file contents. |
| `update\_file` | Modify an existing file at `path`. | `diff` is a V4A diff with additions, deletions, or replacements. |
| `delete\_file` | Remove a file at `path`. | No `diff`; delete the file entirely. |
Your patch harness is responsible for interpreting the V4A diff format and applying changes. For reference implementations, see the [Python Agents SDK](https://github.com/openai/openai-agents-python/blob/main/src/agents/apply\_diff.py) or [TypeScript Agents SDK](https://github.com/openai/openai-agents-js/blob/main/packages/agents-core/src/utils/applyDiff.ts) code.
## Implementing the patch harness
When using the `apply\_patch` tool, you don’t provide an input schema; the model knows how to construct `operation` objects. Your job is to:
1. \*\*Parse operations from the Response\*\*
- Scan the Response for items with `type: "apply\_patch\_call"`.
- For each call, inspect `operation.type`, `operation.path`, and any potential `diff`.
2. \*\*Apply file operations\*\*
- For `create\_file` and `update\_file`, apply the V4A diff to the file system or in-memory workspace.
- For `delete\_file`, remove the file at `path`.
- Record whether each operation succeeded and any logs or error messages.
3. \*\*Return `apply\_patch\_call\_output` events\*\*
- For each `call\_id`, emit exactly one `apply\_patch\_call\_output` event with:
- `status: "completed"` if the operation was applied successfully.
- `status: "failed"` if you encountered an error (include a short human-readable `output` string).
### Safety and robustness
- \*\*Path validation\*\*: Prevent directory traversal and restrict edits to allowed directories.
- \*\*Backups\*\*: Consider backing up files (or working in a scratch copy) before applying patches.
- \*\*Error handling\*\*: Always return a `failed` status with an informative `output` string when patches cannot be applied.
- \*\*Atomicity\*\*: Decide whether you want “all-or-nothing” semantics (rollback if any patch fails) or per-file success/failure.
## Use the apply patch tool with the Agents SDK
Alternatively, you can use the [Agents SDK](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) to use the apply patch tool. You'll still have to implement the harness that handles the actual file operations but you can use the `applyDiff` function to handle the diff processing.
Use the apply patch tool with the Agents SDK
```javascript
import {
applyDiff,
Agent,
run,
applyPatchTool,
type ApplyPatchOperation,
type ApplyPatchResult,
type Editor,
} from "@openai/agents";
class WorkspaceEditor implements Editor {
async createFile(
operation: Extract
): Promise {
// convert the diff to the file content
const content = applyDiff("", operation.diff, "create");
// write the file content to the file system
return { status: "completed", output: `Created ${operation.path}` };
}
async updateFile(
operation: Extract
): Promise {
// read the file content from the file system
const current = "";
// convert the diff to the new file content
const newContent = applyDiff(current, operation.diff);
// write the updated file content to the file system
return { status: "completed", output: `Updated ${operation.path}` };
}
async deleteFile(
operation: Extract
): Promise {
// delete the file from the file system
return { status: "completed", output: `Deleted ${operation.path}` };
}
}
const editor = new WorkspaceEditor();
const agent = new Agent({
name: "Patch Assistant",
model: "gpt-5.6",
instructions:
"You can edit files inside the /tmp directory using the apply\_patch tool.",
tools: [
applyPatchTool({
editor,
// could also be a function for you to determine if approval is needed
needsApproval: true,
onApproval: async (\_ctx, \_approvalItem) => {
// create your own approval logic
return { approve: true };
},
}),
],
});
const result = await run(
agent,
"Create tasks.md with a shopping checklist of 5 entries."
);
console.log(`\nFinal response:\n${result.finalOutput}`);
```
```python
from agents import Agent, ApplyPatchTool, Runner, apply\_diff
class WorkspaceEditor:
async def create\_file(self, operation):
# convert the diff to the file content
content = apply\_diff("", operation.diff, mode="create")
# write the file content to the file system
return {"status": "completed", "output": f"Created {operation.path}"}
async def update\_file(self, operation):
# read the file content from the file system
current = ""
# convert the diff to the new file content
new\_content = apply\_diff(current, operation.diff)
# write the updated file content to the file system
return {"status": "completed", "output": f"Updated {operation.path}"}
async def delete\_file(self, operation):
# delete the file from the file system
return {"status": "completed", "output": f"Deleted {operation.path}"}
editor = WorkspaceEditor()
agent = Agent(
name="Patch Assistant",
model="gpt-5.6",
instructions="You can edit files inside the /tmp directory using the apply\_patch tool.",
tools=[
ApplyPatchTool(
editor=editor,
# could also be a function for you to determine if approval is needed
needs\_approval=True,
# Implement your own approval logic
on\_approval=lambda \_ctx, \_approval\_item: {"approve": True},
),
],
)
async def main():
result = await Runner.run(
agent,
input="Create tasks.md with a shopping checklist of 5 entries.",
)
print(f"\nFinal response:\n{result.final\_output}")
if \_\_name\_\_ == "\_\_main\_\_":
import asyncio
asyncio.run(main())
```
You can find full working examples on GitHub.
[Apply patch tool example - TypeScript
Example of how to use the apply patch tool with the Agents SDK in TypeScript](https://github.com/openai/openai-agents-js/blob/main/examples/tools/applyPatch.ts)
[Apply patch tool example - Python
Example of how to use the apply patch tool with the Agents SDK in Python](https://github.com/openai/openai-agents-python/blob/main/examples/tools/apply\_patch.py)
## Handling common errors
Use `status: "failed"` plus a clear `output` message to help the model recover.
File not found
File not found error
```json
{
"type": "apply\_patch\_call\_output",
"call\_id": "call\_abc",
"status": "failed",
"output": "Error: File not found at path 'lib/baz.py'"
}
```
Patch conflict
Patch conflict error
```json
{
"type": "apply\_patch\_call\_output",
"call\_id": "call\_abc",
"status": "failed",
"output": "Error: Invalid Context:\n@@ def fib(n):"
}
```
The model can then adjust future diffs (for example, by re-reading a file in your prompt or simplifying a change) based on these error messages.
## Best practices
- \*\*Give clear file context\*\*
- When you call the Responses API, include either an inline snapshot of your files (as in the example), or give the model tools for exploring your filesystem (like the `shell` tool).
- \*\*Consider using with the `shell` tool\*\*
- When used in conjunction with the `shell` tool, the model can explore file system directories, read files, and grep for keywords, enabling agentic file discovery and editing.
- \*\*Encourage small, focused diffs\*\*
- In your system instructions, nudge the model toward minimal, targeted edits rather than huge rewrites.
- \*\*Make sure changes apply cleanly\*\*
- After a series of patches, run your tests or linters and share failures back in the next `input` so the model can fix them.
## Usage notes

| API Availability | Supported models |
| --- | --- |
| [Responses](https://developers.openai.com/api/reference/resources/responses) [Chat Completions](https://developers.openai.com/api/reference/resources/chat) [Assistants](https://developers.openai.com/api/reference/resources/beta/subresources/assistants) | [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5) [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4) [GPT-5.2](https://developers.openai.com/api/docs/models/gpt-5.2) [GPT-5.1](https://developers.openai.com/api/docs/models/gpt-5.1) |
