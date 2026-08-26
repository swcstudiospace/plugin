# Local shell

Source: https://developers.openai.com/api/docs/guides/tools-local-shell.md

# Local shell
> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.
The local shell tool is outdated. For new use cases, use the
[`shell`](https://developers.openai.com/api/docs/guides/tools-shell) tool with GPT-5.1 instead. [Learn
more](https://developers.openai.com/api/docs/guides/tools-shell).
Local shell is a tool that allows agents to run shell commands locally on a machine you or the user provides. It's designed to work with [Codex CLI](https://github.com/openai/codex) and [`codex-mini-latest`](https://developers.openai.com/api/docs/models/codex-mini-latest). Commands are executed inside your own runtime, \*\*you are fully in control of which commands actually run\*\* —the API only returns the instructions, but does not execute them on OpenAI infrastructure.
Local shell is available through the [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) for use with [`codex-mini-latest`](https://developers.openai.com/api/docs/models/codex-mini-latest). It is not available on other models, or via the Chat Completions API.
Running arbitrary shell commands can be dangerous. Always sandbox execution
or add strict allow- / deny-lists before forwarding a command to the system
shell.
See [Codex CLI](https://github.com/openai/codex) for reference implementation.
## How it works
The local shell tool enables agents to run in a continuous loop with access to a terminal.
It sends shell commands, which your code executes on a local machine and then returns the output back to the model. This loop allows the model to complete the build-test-run loop without additional intervention by a user.
As part of your code, you'll need to implement a loop that listens for `local\_shell\_call` output items and executes the commands they contain. We strongly recommend sandboxing the execution of these commands to prevent any unexpected commands from being executed.
Integrating the local shell tool
These are the high-level steps you need to follow to integrate the computer use tool in your application:
1. \*\*Send a request to the model\*\*:
Include the `local\_shell` tool as part of the available tools.
2. \*\*Receive a response from the model\*\*:
Check if the response has any `local\_shell\_call` items.
This tool call contains an action like `exec` with a command to execute.
3. \*\*Execute the requested action\*\*:
Execute through code the corresponding action in the computer or container environment.
4. \*\*Return the action output\*\*:
After executing the action, return the command output and metadata like status code to the model.
5. \*\*Repeat\*\*:
Send a new request with the updated state as a `local\_shell\_call\_output`, and repeat this loop until the model stops requesting actions or you decide to stop.
## Example workflow
Below is a minimal (Python) example showing the request/response loop. For
brevity, error handling and security checks are omitted—\*\*do not execute
untrusted commands in production without additional safeguards\*\*.
```python
import os
import shlex
import subprocess
from openai import OpenAI
client = OpenAI()
# 1) Create the initial response request with the tool enabled
response = client.responses.create(
model="codex-mini-latest",
tools=[{"type": "local\_shell"}],
input=[
{
"role": "user",
"content": [
{"type": "input\_text", "text": "List files in the current directory"},
],
}
],
)
while True:
# 2) Look for a local\_shell\_call in the model's output items
shell\_calls = []
for item in response.output:
item\_type = getattr(item, "type", None)
if item\_type == "local\_shell\_call":
shell\_calls.append(item)
elif (
item\_type == "tool\_call"
and getattr(item, "tool\_name", None) == "local\_shell"
):
shell\_calls.append(item)
if not shell\_calls:
# No more commands — the assistant is done.
break
call = shell\_calls[0]
args = getattr(call, "action", None) or getattr(call, "arguments", None)
# 3) Execute the command locally (here we just trust the command!)
# The command is already split into argv tokens.
def \_get(obj, key, default=None):
if isinstance(obj, dict):
return obj.get(key, default)
return getattr(obj, key, default)
timeout\_ms = \_get(args, "timeout\_ms")
command = \_get(args, "command")
if not command:
break
if isinstance(command, str):
command = shlex.split(command)
completed = subprocess.run(
command,
cwd=\_get(args, "working\_directory") or os.getcwd(),
env={\*\*os.environ, \*\*(\_get(args, "env") or {})},
capture\_output=True,
text=True,
timeout=(timeout\_ms / 1000) if timeout\_ms else None,
)
output\_item = {
"type": "local\_shell\_call\_output",
"call\_id": getattr(call, "call\_id", None),
"output": completed.stdout + completed.stderr,
}
# 4) Send the output back to the model to continue the conversation
response = client.responses.create(
model="codex-mini-latest",
tools=[{"type": "local\_shell"}],
previous\_response\_id=response.id,
input=[output\_item],
)
# Print the assistant's final answer
print(response.output\_text)
```
## Best practices
- \*\*Sandbox or containerize\*\* execution. Consider using Docker, firejail, or a
jailed user account.
- \*\*Impose resource limits\*\* (time, memory, network). The `timeout\_ms`
provided by the model is only a hint—you should enforce your own limits.
- \*\*Filter or scrutinize\*\* high-risk commands (e.g. `rm`, `curl`, network
utilities).
- \*\*Log every command and its output\*\* for auditability and debugging.
### Error handling
If the command fails on your side (non-zero exit code, timeout, etc.) you can still send a `local\_shell\_call\_output`; include the error message in the `output` field.
The model can choose to recover or try executing a different command. If you send malformed data (e.g. missing `call\_id`) the API returns a standard `400` validation error.
