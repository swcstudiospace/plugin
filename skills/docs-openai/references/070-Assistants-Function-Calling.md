# Assistants Function Calling

Source: https://developers.openai.com/api/docs/assistants/tools/function-calling.md

# Assistants Function Calling
> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.
After achieving feature parity in the Responses API, we've deprecated the Assistants API. It will shut down on August 26, 2026. Follow the [migration guide](https://developers.openai.com/platform/assistants/migration) to update your integration. [Learn more](https://platform.openai.com/docs/guides/migrate-to-responses).
## Overview
Similar to the Chat Completions API, the Assistants API supports function calling. Function calling allows you to describe functions to the Assistants API and have it intelligently return the functions that need to be called along with their arguments.
## Quickstart
In this example, we'll create a weather assistant and define two functions,
`get\_current\_temperature` and `get\_rain\_probability`, as tools that the Assistant can call.
Depending on the user query, the model will invoke parallel function calling if using our
latest models released on or after Nov 6, 2023.
In our example that uses parallel function calling, we will ask the Assistant what the weather in
San Francisco is like today and the chances of rain. We also show how to output the Assistant's response with streaming.
With the launch of Structured Outputs, you can now use the parameter `strict:
true` when using function calling with the Assistants API. For more
information, refer to the [Function calling
guide](https://developers.openai.com/api/docs/guides/function-calling#function-calling-with-structured-outputs).
Please note that Structured Outputs are not supported in the Assistants API
when using vision.
### Step 1: Define functions
When creating your assistant, you will first define the functions under the `tools` param of the assistant.
```python
from openai import OpenAI
client = OpenAI()
assistant = client.beta.assistants.create(
instructions="You are a weather bot. Use the provided functions to answer questions.",
model="gpt-4o",
tools=[
{
"type": "function",
"function": {
"name": "get\_current\_temperature",
"description": "Get the current temperature for a specific location",
"parameters": {
"type": "object",
"properties": {
"location": {
"type": "string",
"description": "The city and state, e.g., San Francisco, CA",
},
"unit": {
"type": "string",
"enum": ["Celsius", "Fahrenheit"],
"description": "The temperature unit to use. Infer this from the user's location.",
},
},
"required": ["location", "unit"],
},
},
},
{
"type": "function",
"function": {
"name": "get\_rain\_probability",
"description": "Get the probability of rain for a specific location",
"parameters": {
"type": "object",
"properties": {
"location": {
"type": "string",
"description": "The city and state, e.g., San Francisco, CA",
}
},
"required": ["location"],
},
},
},
],
)
```
```javascript
const assistant = await client.beta.assistants.create({
model: "gpt-4o",
instructions:
"You are a weather bot. Use the provided functions to answer questions.",
tools: [
{
type: "function",
function: {
name: "getCurrentTemperature",
description: "Get the current temperature for a specific location",
parameters: {
type: "object",
properties: {
location: {
type: "string",
description: "The city and state, e.g., San Francisco, CA",
},
unit: {
type: "string",
enum: ["Celsius", "Fahrenheit"],
description:
"The temperature unit to use. Infer this from the user's location.",
},
},
required: ["location", "unit"],
},
},
},
{
type: "function",
function: {
name: "getRainProbability",
description: "Get the probability of rain for a specific location",
parameters: {
type: "object",
properties: {
location: {
type: "string",
description: "The city and state, e.g., San Francisco, CA",
},
},
required: ["location"],
},
},
},
],
});
```
### Step 2: Create a Thread and add Messages
Create a Thread when a user starts a conversation and add Messages to the Thread as the user asks questions.
```python
thread = client.beta.threads.create()
message = client.beta.threads.messages.create(
thread\_id=thread.id,
role="user",
content="What's the weather in San Francisco today and the likelihood it'll rain?",
)
```
```javascript
const thread = await client.beta.threads.create();
const message = client.beta.threads.messages.create(thread.id, {
role: "user",
content: "What's the weather in San Francisco today and the likelihood it'll rain?",
});
```
### Step 3: Initiate a Run
When you initiate a Run on a Thread containing a user Message that triggers one or more functions,
the Run will enter a `pending` status. After it processes, the run will enter a `requires\_action` state which you can
verify by checking the Run’s `status`. This indicates that you need to run tools and submit their outputs to the
Assistant to continue Run execution. In our case, we will see two `tool\_calls`, which indicates that the
user query resulted in parallel function calling.
Note that a runs expire ten minutes after creation. Be sure to submit your
tool outputs before the 10 min mark.
You will see two `tool\_calls` within `required\_action`, which indicates the user query triggered parallel function calling.
```json
{
"id": "run\_qJL1kI9xxWlfE0z1yfL0fGg9",
...
"status": "requires\_action",
"required\_action": {
"submit\_tool\_outputs": {
"tool\_calls": [
{
"id": "call\_FthC9qRpsL5kBpwwyw6c7j4k",
"function": {
"arguments": "{"location": "San Francisco, CA"}",
"name": "get\_rain\_probability"
},
"type": "function"
},
{
"id": "call\_RpEDoB8O0FTL9JoKTuCVFOyR",
"function": {
"arguments": "{"location": "San Francisco, CA", "unit": "Fahrenheit"}",
"name": "get\_current\_temperature"
},
"type": "function"
}
]
},
...
"type": "submit\_tool\_outputs"
}
}
```

Run object truncated here for readability

How you initiate a Run and submit `tool\_calls` will differ depending on whether you are using streaming or not,
although in both cases all `tool\_calls` need to be submitted at the same time.
You can then complete the Run by submitting the tool outputs from the functions you called.
Pass each `tool\_call\_id` referenced in the `required\_action` object to match outputs to each function call.
With streaming
For the streaming case, we create an EventHandler class to handle events in the response stream and submit all tool outputs at once with the “submit tool outputs stream” helper in the Python and Node SDKs.
```python
from typing\_extensions import override
from openai import AssistantEventHandler
class EventHandler(AssistantEventHandler):
@override
def on\_event(self, event):
# Retrieve events that are denoted with 'requires\_action'
# since these will have our tool\_calls
if event.event == "thread.run.requires\_action":
run\_id = event.data.id # Retrieve the run ID from the event data
self.handle\_requires\_action(event.data, run\_id)
def handle\_requires\_action(self, data, run\_id):
tool\_outputs = []
for tool in data.required\_action.submit\_tool\_outputs.tool\_calls:
if tool.function.name == "get\_current\_temperature":
tool\_outputs.append({"tool\_call\_id": tool.id, "output": "57"})
elif tool.function.name == "get\_rain\_probability":
tool\_outputs.append({"tool\_call\_id": tool.id, "output": "0.06"})
# Submit all tool\_outputs at the same time
self.submit\_tool\_outputs(tool\_outputs, run\_id)
def submit\_tool\_outputs(self, tool\_outputs, run\_id):
# Use the submit\_tool\_outputs\_stream helper
with client.beta.threads.runs.submit\_tool\_outputs\_stream(
thread\_id=self.current\_run.thread\_id,
run\_id=self.current\_run.id,
tool\_outputs=tool\_outputs,
event\_handler=EventHandler(),
) as stream:
for text in stream.text\_deltas:
print(text, end="", flush=True)
print()
with client.beta.threads.runs.stream(
thread\_id=thread.id,
assistant\_id=assistant.id,
event\_handler=EventHandler(),
) as stream:
stream.until\_done()
```
```javascript
class EventHandler extends EventEmitter {
constructor(client) {
super();
this.client = client;
}
async onEvent(event) {
try {
console.log(event);
// Retrieve events that are denoted with 'requires\_action'
// since these will have our tool\_calls
if (event.event === "thread.run.requires\_action") {
await this.handleRequiresAction(
event.data,
event.data.id,
event.data.thread\_id,
);
}
} catch (error) {
console.error("Error handling event:", error);
}
}
async handleRequiresAction(data, runId, threadId) {
try {
const toolOutputs =
data.required\_action.submit\_tool\_outputs.tool\_calls.map((toolCall) => {
if (toolCall.function.name === "getCurrentTemperature") {
return {
tool\_call\_id: toolCall.id,
output: "57",
};
} else if (toolCall.function.name === "getRainProbability") {
return {
tool\_call\_id: toolCall.id,
output: "0.06",
};
}
});
// Submit all the tool outputs at the same time
await this.submitToolOutputs(toolOutputs, runId, threadId);
} catch (error) {
console.error("Error processing required action:", error);
}
}
async submitToolOutputs(toolOutputs, runId, threadId) {
try {
// Use the submitToolOutputsStream helper
const stream = this.client.beta.threads.runs.submitToolOutputsStream(
threadId,
runId,
{ tool\_outputs: toolOutputs },
);
for await (const event of stream) {
this.emit("event", event);
}
} catch (error) {
console.error("Error submitting tool outputs:", error);
}
}
}
const eventHandler = new EventHandler(client);
eventHandler.on("event", eventHandler.onEvent.bind(eventHandler));
const stream = await client.beta.threads.runs.stream(
threadId,
{ assistant\_id: assistantId },
eventHandler,
);
for await (const event of stream) {
eventHandler.emit("event", event);
}
```
Without streaming
Runs are asynchronous, which means you'll want to monitor their `status` by polling the Run object until a
[terminal status](https://developers.openai.com/api/docs/assistants/deep-dive#runs-and-run-steps) is reached. For convenience, the 'create and poll' SDK helpers assist both in
creating the run and then polling for its completion. Once the Run completes, you can list the
Messages added to the Thread by the Assistant. Finally, you would retrieve all the `tool\_outputs` from
`required\_action` and submit them at the same time to the 'submit tool outputs and poll' helper.
```python
run = client.beta.threads.runs.create\_and\_poll(
thread\_id=thread.id,
assistant\_id=assistant.id,
)
if run.status == "completed":
messages = client.beta.threads.messages.list(thread\_id=thread.id)
print(messages)
# Define the list to store tool outputs
tool\_outputs = []
# Loop through each tool in the required action section
if run.required\_action:
for tool in run.required\_action.submit\_tool\_outputs.tool\_calls:
if tool.function.name == "get\_current\_temperature":
tool\_outputs.append({"tool\_call\_id": tool.id, "output": "57"})
elif tool.function.name == "get\_rain\_probability":
tool\_outputs.append({"tool\_call\_id": tool.id, "output": "0.06"})
# Submit all tool outputs at once after collecting them in a list
if tool\_outputs:
try:
run = client.beta.threads.runs.submit\_tool\_outputs\_and\_poll(
thread\_id=thread.id,
run\_id=run.id,
tool\_outputs=tool\_outputs,
)
print("Tool outputs submitted successfully.")
except Exception as e:
print("Failed to submit tool outputs:", e)
else:
print("No tool outputs to submit.")
if run.status == "completed":
messages = client.beta.threads.messages.list(thread\_id=thread.id)
print(messages)
else:
print(run.status)
```
```javascript
const handleRequiresAction = async (run) => {
// Check if there are tools that require outputs
if (
run.required\_action &&
run.required\_action.submit\_tool\_outputs &&
run.required\_action.submit\_tool\_outputs.tool\_calls
) {
// Loop through each tool in the required action section
const toolOutputs = run.required\_action.submit\_tool\_outputs.tool\_calls.map(
(tool) => {
if (tool.function.name === "getCurrentTemperature") {
return {
tool\_call\_id: tool.id,
output: "57",
};
} else if (tool.function.name === "getRainProbability") {
return {
tool\_call\_id: tool.id,
output: "0.06",
};
}
},
);
// Submit all tool outputs at once after collecting them in a list
if (toolOutputs.length > 0) {
run = await client.beta.threads.runs.submitToolOutputsAndPoll(
thread.id,
run.id,
{ tool\_outputs: toolOutputs },
);
console.log("Tool outputs submitted successfully.");
} else {
console.log("No tool outputs to submit.");
}
// Check status after submitting tool outputs
return handleRunStatus(run);
}
};
const handleRunStatus = async (run) => {
// Check if the run is completed
if (run.status === "completed") {
let messages = await client.beta.threads.messages.list(thread.id);
console.log(messages.data);
return messages.data;
} else if (run.status === "requires\_action") {
console.log(run.status);
return await handleRequiresAction(run);
} else {
console.error("Run did not complete:", run);
}
};
// Create and poll run
let run = await client.beta.threads.runs.createAndPoll(thread.id, {
assistant\_id: assistant.id,
});
handleRunStatus(run);
```
### Using Structured Outputs
When you enable [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) by supplying `strict: true`, the OpenAI API will pre-process your supplied schema on your first request, and then use this artifact to constrain the model to your schema.
```python
from openai import OpenAI
client = OpenAI()
assistant = client.beta.assistants.create(
instructions="You are a weather bot. Use the provided functions to answer questions.",
model="gpt-4o-2024-08-06",
tools=[
{
"type": "function",
"function": {
"name": "get\_current\_temperature",
"description": "Get the current temperature for a specific location",
"parameters": {
"type": "object",
"properties": {
"location": {
"type": "string",
"description": "The city and state, e.g., San Francisco, CA",
},
"unit": {
"type": "string",
"enum": ["Celsius", "Fahrenheit"],
"description": "The temperature unit to use. Infer this from the user's location.",
},
},
"required": ["location", "unit"],
# highlight-start
"additionalProperties": False,
# highlight-end
},
# highlight-start
"strict": True,
# highlight-end
},
},
{
"type": "function",
"function": {
"name": "get\_rain\_probability",
"description": "Get the probability of rain for a specific location",
"parameters": {
"type": "object",
"properties": {
"location": {
"type": "string",
"description": "The city and state, e.g., San Francisco, CA",
}
},
"required": ["location"],
# highlight-start
"additionalProperties": False,
# highlight-end
},
# highlight-start
"strict": True,
# highlight-end
},
},
],
)
```
```javascript
const assistant = await client.beta.assistants.create({
model: "gpt-4o-2024-08-06",
instructions:
"You are a weather bot. Use the provided functions to answer questions.",
tools: [
{
type: "function",
function: {
name: "getCurrentTemperature",
description: "Get the current temperature for a specific location",
parameters: {
type: "object",
properties: {
location: {
type: "string",
description: "The city and state, e.g., San Francisco, CA",
},
unit: {
type: "string",
enum: ["Celsius", "Fahrenheit"],
description:
"The temperature unit to use. Infer this from the user's location.",
},
},
required: ["location", "unit"],
// highlight-start
additionalProperties: false
// highlight-end
},
// highlight-start
strict: true
// highlight-end
},
},
{
type: "function",
function: {
name: "getRainProbability",
description: "Get the probability of rain for a specific location",
parameters: {
type: "object",
properties: {
location: {
type: "string",
description: "The city and state, e.g., San Francisco, CA",
},
},
required: ["location"],
// highlight-start
additionalProperties: false
// highlight-end
},
// highlight-start
strict: true
// highlight-end
},
},
],
});
```
