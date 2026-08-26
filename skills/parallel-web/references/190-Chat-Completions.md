# Chat Completions

Source: https://docs.parallel.ai/api-reference/chat-api-beta/chat-completions.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Chat Completions
> Chat completions.
This endpoint can be used to get realtime chat completions. It can also be used
with the Task API processors to get structured, research outputs via a chat
interface.
## OpenAPI
````yaml /public-openapi.json post /v1beta/chat/completions
openapi: 3.1.0
info:
title: Parallel API
description: Parallel API
contact:
name: Parallel Support
url: https://parallel.ai
email: support@parallel.ai
version: 0.1.2
servers:
- url: https://api.parallel.ai
description: Parallel API
security:
- ApiKeyAuth: []
tags:
- name: Search
description: >-
Search returns ranked URLs with extended excerpts suitable for LLM
consumption. Inputs are a natural-language objective and optional keyword
queries. Source policies allow including or excluding specific domains and
have configurable output sizes. The returned extended snippets contain
dense, relevant information from relevant pages.
- Result: ranked list with URL, title, and long text excerpts
- name: Extract
description: >-
Extract returns excerpts or full content from one or more URLs. Inputs are
a list of URLs and an optional search objective and keyword queries. The
returned excerpts or full content is formatted as markdown and suitable
for LLM consumption.
- Result: excerpts or full content from the URL formatted as markdown
- name: Tasks
description: >-
The Task API executes web research and extraction tasks. Clients submit a
natural-language objective with an optional input schema; the service
plans retrieval, fetches relevant URLs, and returns outputs that conform
to a provided or inferred JSON schema. Supports deep research style
queries and can return rich structured JSON outputs. Processors trade-off
between cost, latency, and quality. Each processor supports calibrated
confidences.
- Output metadata: citations, excerpts, reasoning, and confidence per
field
Task Groups enable batch execution of many independent Task runs with
group-level monitoring and failure handling.
- Submit hundreds or thousands of Tasks as a single group
- Observe group progress and receive results as they complete
- Real-time updates via Server-Sent Events (SSE)
- Add tasks to an existing group while it is running
- Group-level retry and error aggregation
- name: FindAll
description: >-
The FindAll API discovers and evaluates entities that match complex
criteria from natural language objectives. Submit a high-level goal and
the service automatically generates structured match conditions, discovers
relevant candidates, and evaluates each against the criteria. Returns
comprehensive results with detailed reasoning, citations, and confidence
scores for each match decision. Streaming events and webhooks are
supported.
- name: Monitor
description: >-
The Monitor API watches the web for material changes on a fixed frequency.
Each monitor runs once on creation and then on its configured schedule,
emitting events when meaningful changes are detected.
- `event\_stream` monitors track a search query and emit an event for each
new material change.
- `snapshot` monitors track a specific task run's output and emit an event
when the output changes.
Results can be polled via the events endpoint or delivered via webhooks.
- name: Chat API (Beta)
description: >-
The Chat API provides a programmatic chat-style text generation interface.
It accepts a sequence of messages and returns model responses. Intended
for assistant-like interactions and evaluation. Streaming responses are
supported.
- name: Responses API
description: >-
An OpenAI-Responses-compatible interface for answers grounded in live web
research, with URL citations. Point any Responses-API client — the OpenAI
Python SDK, OpenAI TypeScript SDK, the Agents SDK, or raw HTTP — at
`https://api.parallel.ai` with your Parallel API key, set `model` to
`parallel`, and call `/v1/responses`.
- `input` accepts a plain string or an array of role/content messages
(canonical OpenAI shape; text content only).
- `reasoning.effort` (`low`/`medium`/`high`) controls how much research is
performed, trading response time for answer quality.
- Multi-turn via `previous\_response\_id`.
- Structured outputs via `text.format = {"type": "json\_schema", "name":
..., "schema": {...}}`.
- Streaming (`stream=true`) emits the standard OpenAI Responses SSE
lifecycle: `response.created` and `response.in\_progress`, then output item
/ content part / text delta events with URL-citation annotations, the
matching `\*.done` events, and a terminal `response.completed` — or
`response.failed` if the request fails mid-stream.
paths:
/v1beta/chat/completions:
post:
tags:
- Chat API (Beta)
summary: Chat Completions
description: >-
Chat completions.
This endpoint can be used to get realtime chat completions. It can also
be used
with the Task API processors to get structured, research outputs via a
chat
interface.
operationId: chat\_completions\_v1beta\_chat\_completions\_post
requestBody:
content:
application/json:
schema:
$ref: '#/components/schemas/ChatCompletionRequest'
required: true
responses:
'200':
description: >-
Returns a ChatCompletion object for non-streaming requests
(application/json), or a stream of ChatCompletionResponseChunk
objects for streaming requests (text/event-stream) when
`stream=true` is set in the request.
content:
application/json:
schema:
$ref: '#/components/schemas/ChatCompletion'
text/event-stream:
schema:
$ref: '#/components/schemas/ChatCompletionResponseChunk'
'422':
description: Validation Error
content:
application/json:
schema:
$ref: '#/components/schemas/HTTPValidationError'
components:
schemas:
ChatCompletionRequest:
properties:
model:
type: string
title: Model
description: The model to use for chat completions.
messages:
items:
$ref: '#/components/schemas/ChatMessage'
type: array
title: Messages
description: The messages to use for chat completions.
stream:
anyOf:
- type: boolean
- type: 'null'
title: Stream
description: Whether to stream the chat completions.
response\_format:
anyOf:
- $ref: >-
#/components/schemas/openai\_\_types\_\_shared\_params\_\_response\_format\_text\_\_ResponseFormatText
- $ref: '#/components/schemas/ResponseFormatJSONSchema'
- $ref: >-
#/components/schemas/openai\_\_types\_\_shared\_params\_\_response\_format\_json\_object\_\_ResponseFormatJSONObject
- type: 'null'
title: Response Format
description: The response format to use for chat completions. OpenAI compatible.
max\_tokens:
anyOf:
- type: integer
- type: 'null'
title: Max Tokens
description: The maximum number of tokens to generate. Unsupported.
temperature:
anyOf:
- type: number
- type: 'null'
title: Temperature
description: The temperature to use for chat completions. Unsupported.
top\_p:
anyOf:
- type: number
- type: 'null'
title: Top P
description: The top p to use for chat completions. Unsupported.
'n':
anyOf:
- type: integer
- type: 'null'
title: 'N'
description: The number of chat completions to generate. Unsupported.
presence\_penalty:
anyOf:
- type: number
- type: 'null'
title: Presence Penalty
description: The presence penalty to use for chat completions. Unsupported.
frequency\_penalty:
anyOf:
- type: number
- type: 'null'
title: Frequency Penalty
description: The frequency penalty to use for chat completions. Unsupported.
previous\_interaction\_id:
anyOf:
- type: string
- type: 'null'
title: Previous Interaction Id
description: Interaction ID from a previous chat completion to use as context.
type: object
required:
- model
- messages
title: ChatCompletionRequest
description: >-
Request for the chat completions endpoint.
Note that all parameters except for `model`, `stream`, and
`response\_format`
are ignored.
ChatCompletion:
properties:
id:
type: string
title: Id
description: The id of the chat completion.
choices:
items:
$ref: '#/components/schemas/Choice'
type: array
title: Choices
created:
type: integer
title: Created
model:
type: string
title: Model
object:
type: string
const: chat.completion
title: Object
moderation:
anyOf:
- $ref: >-
#/components/schemas/openai\_\_types\_\_chat\_\_chat\_completion\_\_Moderation
- type: 'null'
service\_tier:
anyOf:
- type: string
enum:
- auto
- default
- flex
- scale
- priority
- type: 'null'
title: Service Tier
system\_fingerprint:
anyOf:
- type: string
- type: 'null'
title: System Fingerprint
usage:
anyOf:
- $ref: '#/components/schemas/CompletionUsage'
- type: 'null'
basis:
items:
$ref: '#/components/schemas/FieldBasis'
type: array
title: Basis
description: >-
Basis for the chat completion, including citations and reasoning
supporting the output.
default: []
interaction\_id:
anyOf:
- type: string
- type: 'null'
title: Interaction Id
description: >-
Identifier for this interaction. Pass as previous\_interaction\_id for
follow-ups.
additionalProperties: true
type: object
required:
- id
- choices
- created
- model
- object
title: ChatCompletion
description: Chat completion response.
ChatCompletionResponseChunk:
additionalProperties: true
description: Chat completion response chunk.
properties:
type:
const: chat.completion.chunk
description: >-
The type of the chat completion chunk. Always
`chat.completion.chunk`.
title: Type
type: string
id:
description: The id of the chat completion response chunk.
title: Id
type: string
choices:
items:
$ref: '#/components/schemas/Choice'
type: array
title: Choices
created:
type: integer
title: Created
model:
type: string
title: Model
object:
const: chat.completion.chunk
title: Object
type: string
moderation:
anyOf:
- $ref: '#/components/schemas/Moderation'
- type: 'null'
default: null
service\_tier:
anyOf:
- type: string
enum:
- auto
- default
- flex
- scale
- priority
- type: 'null'
default: null
title: Service Tier
system\_fingerprint:
anyOf:
- type: string
- type: 'null'
default: null
title: System Fingerprint
usage:
anyOf:
- $ref: '#/components/schemas/CompletionUsage'
- type: 'null'
default: null
basis:
default: []
description: >-
Basis for the chat completion chunk, including citations and
reasoning supporting the output.
items:
$ref: '#/components/schemas/FieldBasis'
title: Basis
type: array
interaction\_id:
anyOf:
- type: string
- type: 'null'
default: null
description: >-
Identifier for this interaction. Pass as previous\_interaction\_id for
follow-ups.
title: Interaction Id
required:
- type
- id
- choices
- created
- model
- object
title: ChatCompletionResponseChunk
type: object
HTTPValidationError:
properties:
detail:
items:
$ref: '#/components/schemas/ValidationError'
type: array
title: Detail
type: object
title: HTTPValidationError
ChatMessage:
properties:
role:
type: string
enum:
- system
- user
- assistant
title: Role
description: The role of the chat message.
content:
type: string
title: Content
description: The content of the chat message.
name:
anyOf:
- type: string
- type: 'null'
title: Name
description: >-
An optional name for the participant. Provides the model information
to differentiate between participants of the same role.
type: object
required:
- role
- content
title: ChatMessage
description: Chat message for OpenAI API.
openai\_\_types\_\_shared\_params\_\_response\_format\_text\_\_ResponseFormatText:
properties:
type:
const: text
title: Type
type: string
type: object
required:
- type
title: ResponseFormatText
description: Default response format. Used to generate text responses.
ResponseFormatJSONSchema:
properties:
json\_schema:
$ref: '#/components/schemas/JSONSchema'
type:
type: string
const: json\_schema
title: Type
type: object
required:
- json\_schema
- type
title: ResponseFormatJSONSchema
description: >-
JSON Schema response format.
Used to generate structured JSON responses.
Learn more about [Structured
Outputs](https://platform.openai.com/docs/guides/structured-outputs).
openai\_\_types\_\_shared\_params\_\_response\_format\_json\_object\_\_ResponseFormatJSONObject:
properties:
type:
const: json\_object
title: Type
type: string
type: object
required:
- type
title: ResponseFormatJSONObject
description: >-
JSON object response format.
An older method of generating JSON responses.
Using `json\_schema` is recommended for models that support it. Note that
the
model will not generate JSON without a system or user message
instructing it
to do so.
Choice:
additionalProperties: true
properties:
delta:
$ref: '#/components/schemas/ChoiceDelta'
finish\_reason:
anyOf:
- enum:
- stop
- length
- tool\_calls
- content\_filter
- function\_call
type: string
- type: 'null'
default: null
title: Finish Reason
index:
title: Index
type: integer
logprobs:
anyOf:
- $ref: '#/components/schemas/ChoiceLogprobs'
- type: 'null'
default: null
required:
- delta
- index
title: Choice
type: object
openai\_\_types\_\_chat\_\_chat\_completion\_\_Moderation:
properties:
input:
anyOf:
- $ref: '#/components/schemas/ModerationInputModerationResults'
- $ref: >-
#/components/schemas/openai\_\_types\_\_chat\_\_chat\_completion\_\_ModerationInputError
title: Input
output:
anyOf:
- $ref: '#/components/schemas/ModerationOutputModerationResults'
- $ref: >-
#/components/schemas/openai\_\_types\_\_chat\_\_chat\_completion\_\_ModerationOutputError
title: Output
additionalProperties: true
type: object
required:
- input
- output
title: Moderation
description: >-
Moderation results for the request input and generated output, if
moderated
completions were requested.
CompletionUsage:
additionalProperties: true
description: Usage statistics for the completion request.
properties:
completion\_tokens:
title: Completion Tokens
type: integer
prompt\_tokens:
title: Prompt Tokens
type: integer
total\_tokens:
title: Total Tokens
type: integer
completion\_tokens\_details:
anyOf:
- $ref: '#/components/schemas/CompletionTokensDetails'
- type: 'null'
default: null
prompt\_tokens\_details:
anyOf:
- $ref: '#/components/schemas/PromptTokensDetails'
- type: 'null'
default: null
required:
- completion\_tokens
- prompt\_tokens
- total\_tokens
title: CompletionUsage
type: object
FieldBasis:
description: Citations and reasoning supporting one field of a task output.
properties:
field:
description: Name of the output field.
title: Field
type: string
citations:
default: []
description: List of citations supporting the output field.
items:
$ref: '#/components/schemas/Citation'
title: Citations
type: array
reasoning:
description: Reasoning for the output field.
title: Reasoning
type: string
confidence:
anyOf:
- type: string
- type: 'null'
default: null
description: >-
Confidence level for the output field. Only certain processors
provide confidence levels.
examples:
- low
- medium
- high
title: Confidence
required:
- field
- reasoning
title: FieldBasis
type: object
Moderation:
additionalProperties: true
description: >-
Moderation results for the response input and output, if moderated
completions were requested.
properties:
input:
anyOf:
- $ref: '#/components/schemas/ModerationInputModerationResult'
- $ref: '#/components/schemas/ModerationInputError'
title: Input
output:
anyOf:
- $ref: '#/components/schemas/ModerationOutputModerationResult'
- $ref: '#/components/schemas/ModerationOutputError'
title: Output
required:
- input
- output
title: Moderation
type: object
ValidationError:
properties:
loc:
items:
anyOf:
- type: string
- type: integer
type: array
title: Location
msg:
title: Message
type: string
type:
type: string
title: Error Type
type: object
required:
- loc
- msg
- type
title: ValidationError
JSONSchema:
properties:
name:
type: string
title: Name
description:
type: string
title: Description
schema:
additionalProperties: false
type: object
title: Schema
strict:
anyOf:
- type: boolean
- type: 'null'
title: Strict
type: object
required:
- name
title: JSONSchema
description: Structured Outputs configuration options, including a JSON Schema.
ChoiceDelta:
additionalProperties: true
description: A chat completion delta generated by streamed model responses.
properties:
content:
anyOf:
- type: string
- type: 'null'
default: null
title: Content
function\_call:
anyOf:
- $ref: '#/components/schemas/ChoiceDeltaFunctionCall'
- type: 'null'
default: null
refusal:
anyOf:
- type: string
- type: 'null'
default: null
title: Refusal
role:
anyOf:
- enum:
- developer
- system
- user
- assistant
- tool
type: string
- type: 'null'
default: null
title: Role
tool\_calls:
anyOf:
- items:
$ref: '#/components/schemas/ChoiceDeltaToolCall'
type: array
- type: 'null'
default: null
title: Tool Calls
title: ChoiceDelta
type: object
ChoiceLogprobs:
additionalProperties: true
description: Log probability information for the choice.
properties:
content:
anyOf:
- items:
$ref: '#/components/schemas/ChatCompletionTokenLogprob'
type: array
- type: 'null'
default: null
title: Content
refusal:
anyOf:
- items:
$ref: '#/components/schemas/ChatCompletionTokenLogprob'
type: array
- type: 'null'
default: null
title: Refusal
title: ChoiceLogprobs
type: object
ModerationInputModerationResults:
additionalProperties: true
description: Successful moderation results for the request input or generated output.
properties:
model:
type: string
title: Model
results:
items:
$ref: '#/components/schemas/ModerationInputModerationResultsResult'
title: Results
type: array
type:
const: moderation\_results
title: Type
type: string
required:
- model
- results
- type
title: ModerationInputModerationResults
type: object
openai\_\_types\_\_chat\_\_chat\_completion\_\_ModerationInputError:
properties:
code:
type: string
title: Code
message:
title: Message
type: string
type:
type: string
const: error
title: Type
additionalProperties: true
type: object
required:
- code
- message
- type
title: ModerationInputError
description: An error produced while attempting moderation.
ModerationOutputModerationResults:
additionalProperties: true
description: Successful moderation results for the request input or generated output.
properties:
model:
type: string
title: Model
results:
items:
$ref: '#/components/schemas/ModerationOutputModerationResultsResult'
title: Results
type: array
type:
const: moderation\_results
title: Type
type: string
required:
- model
- results
- type
title: ModerationOutputModerationResults
type: object
openai\_\_types\_\_chat\_\_chat\_completion\_\_ModerationOutputError:
properties:
code:
type: string
title: Code
message:
title: Message
type: string
type:
type: string
const: error
title: Type
additionalProperties: true
type: object
required:
- code
- message
- type
title: ModerationOutputError
description: An error produced while attempting moderation.
CompletionTokensDetails:
additionalProperties: true
description: Breakdown of tokens used in a completion.
properties:
accepted\_prediction\_tokens:
anyOf:
- type: integer
- type: 'null'
default: null
title: Accepted Prediction Tokens
audio\_tokens:
anyOf:
- type: integer
- type: 'null'
default: null
title: Audio Tokens
reasoning\_tokens:
anyOf:
- type: integer
- type: 'null'
default: null
title: Reasoning Tokens
rejected\_prediction\_tokens:
anyOf:
- type: integer
- type: 'null'
default: null
title: Rejected Prediction Tokens
title: CompletionTokensDetails
type: object
PromptTokensDetails:
additionalProperties: true
description: Breakdown of tokens used in the prompt.
properties:
audio\_tokens:
anyOf:
- type: integer
- type: 'null'
default: null
title: Audio Tokens
cached\_tokens:
anyOf:
- type: integer
- type: 'null'
default: null
title: Cached Tokens
title: PromptTokensDetails
type: object
Citation:
description: A citation for a task output.
properties:
title:
anyOf:
- type: string
- type: 'null'
default: null
description: Title of the citation.
title: Title
url:
description: URL of the citation.
title: Url
type: string
excerpts:
anyOf:
- items:
type: string
type: array
- type: 'null'
default: null
description: >-
Excerpts from the citation supporting the output. Only certain
processors provide excerpts.
title: Excerpts
required:
- url
title: Citation
type: object
ModerationInputModerationResult:
additionalProperties: true
description: A moderation result produced for the response input or output.
properties:
categories:
additionalProperties:
type: boolean
title: Categories
type: object
category\_applied\_input\_types:
additionalProperties:
items:
enum:
- text
- image
type: string
type: array
title: Category Applied Input Types
type: object
category\_scores:
additionalProperties:
type: number
title: Category Scores
type: object
flagged:
title: Flagged
type: boolean
model:
type: string
title: Model
type:
const: moderation\_result
title: Type
type: string
required:
- categories
- category\_applied\_input\_types
- category\_scores
- flagged
- model
- type
title: ModerationInputModerationResult
type: object
ModerationInputError:
additionalProperties: true
description: >-
An error produced while attempting moderation for the response input or
output.
properties:
code:
type: string
title: Code
message:
title: Message
type: string
type:
type: string
const: error
title: Type
required:
- code
- message
- type
title: ModerationInputError
type: object
ModerationOutputModerationResult:
additionalProperties: true
description: A moderation result produced for the response input or output.
properties:
categories:
additionalProperties:
type: boolean
title: Categories
type: object
category\_applied\_input\_types:
additionalProperties:
items:
enum:
- text
- image
type: string
type: array
title: Category Applied Input Types
type: object
category\_scores:
additionalProperties:
type: number
title: Category Scores
type: object
flagged:
title: Flagged
type: boolean
model:
type: string
title: Model
type:
const: moderation\_result
title: Type
type: string
required:
- categories
- category\_applied\_input\_types
- category\_scores
- flagged
- model
- type
title: ModerationOutputModerationResult
type: object
ModerationOutputError:
additionalProperties: true
description: >-
An error produced while attempting moderation for the response input or
output.
properties:
code:
type: string
title: Code
message:
title: Message
type: string
type:
type: string
const: error
title: Type
required:
- code
- message
- type
title: ModerationOutputError
type: object
ChoiceDeltaFunctionCall:
additionalProperties: true
description: >-
Deprecated and replaced by `tool\_calls`.
The name and arguments of a function that should be called, as generated
by the model.
properties:
arguments:
anyOf:
- type: string
- type: 'null'
default: null
title: Arguments
name:
anyOf:
- type: string
- type: 'null'
default: null
title: Name
title: ChoiceDeltaFunctionCall
type: object
ChoiceDeltaToolCall:
additionalProperties: true
properties:
index:
title: Index
type: integer
id:
anyOf:
- type: string
- type: 'null'
default: null
title: Id
function:
anyOf:
- $ref: '#/components/schemas/ChoiceDeltaToolCallFunction'
- type: 'null'
default: null
type:
anyOf:
- const: function
type: string
- type: 'null'
default: null
title: Type
required:
- index
title: ChoiceDeltaToolCall
type: object
ChatCompletionTokenLogprob:
additionalProperties: true
properties:
token:
title: Token
type: string
bytes:
anyOf:
- items:
type: integer
type: array
- type: 'null'
default: null
title: Bytes
logprob:
title: Logprob
type: number
top\_logprobs:
items:
$ref: '#/components/schemas/TopLogprob'
title: Top Logprobs
type: array
required:
- token
- logprob
- top\_logprobs
title: ChatCompletionTokenLogprob
type: object
ModerationInputModerationResultsResult:
additionalProperties: true
description: A moderation result produced for the response input or output.
properties:
categories:
additionalProperties:
type: boolean
title: Categories
type: object
category\_applied\_input\_types:
additionalProperties:
items:
enum:
- text
- image
type: string
type: array
title: Category Applied Input Types
type: object
category\_scores:
additionalProperties:
type: number
title: Category Scores
type: object
flagged:
title: Flagged
type: boolean
model:
type: string
title: Model
type:
const: moderation\_result
title: Type
type: string
required:
- categories
- category\_applied\_input\_types
- category\_scores
- flagged
- model
- type
title: ModerationInputModerationResultsResult
type: object
ModerationOutputModerationResultsResult:
additionalProperties: true
description: A moderation result produced for the response input or output.
properties:
categories:
additionalProperties:
type: boolean
title: Categories
type: object
category\_applied\_input\_types:
additionalProperties:
items:
enum:
- text
- image
type: string
type: array
title: Category Applied Input Types
type: object
category\_scores:
additionalProperties:
type: number
title: Category Scores
type: object
flagged:
title: Flagged
type: boolean
model:
type: string
title: Model
type:
const: moderation\_result
title: Type
type: string
required:
- categories
- category\_applied\_input\_types
- category\_scores
- flagged
- model
- type
title: ModerationOutputModerationResultsResult
type: object
ChoiceDeltaToolCallFunction:
additionalProperties: true
properties:
arguments:
anyOf:
- type: string
- type: 'null'
default: null
title: Arguments
name:
anyOf:
- type: string
- type: 'null'
default: null
title: Name
title: ChoiceDeltaToolCallFunction
type: object
TopLogprob:
additionalProperties: true
properties:
token:
title: Token
type: string
bytes:
anyOf:
- items:
type: integer
type: array
- type: 'null'
default: null
title: Bytes
logprob:
title: Logprob
type: number
required:
- token
- logprob
title: TopLogprob
type: object
securitySchemes:
ApiKeyAuth:
type: apiKey
in: header
name: x-api-key
````
