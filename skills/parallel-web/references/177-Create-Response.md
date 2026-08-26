# Create Response

Source: https://docs.parallel.ai/api-reference/responses-api/create-response.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Create Response
> Create a response.
Generates an answer to the given input, grounded in live web research and
annotated with URL citations. Set `model` to `parallel`; `reasoning.effort`
(`low`/`medium`/`high`) controls how much research is performed, trading
response time for answer quality. Returns an OpenAI-format `Response` as
`application/json`, or a `text/event-stream` of OpenAI Responses SSE
events when `stream=true`.
## OpenAPI
````yaml /public-openapi.json post /v1/responses
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
/v1/responses:
post:
tags:
- Responses API
summary: Create Response
description: >-
Create a response.
Generates an answer to the given input, grounded in live web research
and
annotated with URL citations. Set `model` to `parallel`;
`reasoning.effort`
(`low`/`medium`/`high`) controls how much research is performed, trading
response time for answer quality. Returns an OpenAI-format `Response` as
`application/json`, or a `text/event-stream` of OpenAI Responses SSE
events when `stream=true`.
operationId: create\_response\_v1\_responses\_post
requestBody:
content:
application/json:
schema:
$ref: '#/components/schemas/ResponseCreateRequest'
required: true
responses:
'200':
description: >-
Returns a Response object for non-streaming requests
(application/json), or a stream of OpenAI Responses streaming events
(text/event-stream) when `stream=true` is set in the request.
content:
application/json:
schema:
$ref: '#/components/schemas/Response'
text/event-stream:
schema:
$ref: '#/components/schemas/ResponseStreamEvent'
'422':
description: Validation Error
content:
application/json:
schema:
$ref: '#/components/schemas/HTTPValidationError'
components:
schemas:
ResponseCreateRequest:
properties:
model:
type: string
title: Model
description: >-
The model to run. `parallel` is the only supported value (matched
case-insensitively); any other value is rejected. To trade response
time for answer quality, set `reasoning.effort` (low/medium/high)
rather than changing the model name.
examples:
- parallel
input:
anyOf:
- type: string
- items:
$ref: '#/components/schemas/ResponseInputMessage'
type: array
title: Input
description: >-
The input to generate a response for: a plain string, or a list of
role/content messages that includes at least one `user` message.
Must be non-empty, and only text content is supported. `input` and
`instructions` together may total at most 20,000 characters.
examples:
- What are the latest developments in fusion energy?
instructions:
anyOf:
- type: string
- type: 'null'
title: Instructions
description: System instructions for the model.
previous\_response\_id:
anyOf:
- type: string
- type: 'null'
title: Previous Response Id
description: ID of a previous response to use as conversation context.
stream:
anyOf:
- type: boolean
- type: 'null'
title: Stream
description: Whether to stream the response.
text:
anyOf:
- $ref: '#/components/schemas/ResponseTextConfig'
- type: 'null'
description: Configuration for text output, including structured output.
metadata:
anyOf:
- additionalProperties:
type: string
type: object
maxProperties: 16
- type: 'null'
title: Metadata
description: >-
Arbitrary key-value pairs, echoed back on the Response object.
Useful for tagging requests. At most 16 keys; keys up to 64
characters, values up to 512 characters.
reasoning:
anyOf:
- $ref: '#/components/schemas/ResponseReasoningConfig'
- type: 'null'
description: >-
Reasoning configuration. `effort` (low/medium/high) controls how
much research is performed; defaults to `medium`.
background:
anyOf:
- type: boolean
- type: 'null'
title: Background
description: >-
Background mode is not supported: requests with `background=true`
are rejected with a 422 validation error. Use the Task API (POST
/v1/tasks/runs) for long-running work.
type: object
required:
- model
- input
title: ResponseCreateRequest
description: >-
Request body for the Responses API (`POST /v1/responses`).
OpenAI-Responses-compatible: point a standard OpenAI client at
`https://api.parallel.ai/v1` with your Parallel API key and set `model`
to
`parallel`. The fields below are the ones Parallel acts on; other OpenAI
request fields (`tools`, `tool\_choice`, `temperature`, `top\_p`,
`max\_output\_tokens`, `parallel\_tool\_calls`, `truncation`, `store`,
`user`,
`include`) are accepted for compatibility but have no effect.
Response:
additionalProperties: true
description: |-
A response from the `parallel` model. A completed response contains a
single assistant message whose text is annotated with URL citations
grounding the answer.
properties:
id:
title: Id
type: string
created\_at:
title: Created At
type: number
error:
anyOf:
- $ref: '#/components/schemas/ResponseError'
- type: 'null'
default: null
incomplete\_details:
anyOf:
- $ref: '#/components/schemas/IncompleteDetails'
- type: 'null'
default: null
instructions:
anyOf:
- type: string
- type: 'null'
default: null
title: Instructions
metadata:
anyOf:
- additionalProperties:
type: string
type: object
- type: 'null'
default: null
title: Metadata
model:
const: parallel
default: parallel
title: Model
type: string
object:
const: response
title: Object
type: string
output:
items:
$ref: '#/components/schemas/ResponseOutputMessage'
title: Output
type: array
parallel\_tool\_calls:
title: Parallel Tool Calls
type: boolean
temperature:
anyOf:
- type: number
- type: 'null'
default: null
title: Temperature
tool\_choice:
default: auto
title: Tool Choice
type: string
tools:
default: []
items: {}
title: Tools
type: array
top\_p:
anyOf:
- type: number
- type: 'null'
default: null
title: Top P
background:
anyOf:
- type: boolean
- type: 'null'
default: null
title: Background
completed\_at:
anyOf:
- type: number
- type: 'null'
default: null
title: Completed At
conversation:
default: null
title: Conversation
type: 'null'
max\_output\_tokens:
anyOf:
- type: integer
- type: 'null'
default: null
title: Max Output Tokens
max\_tool\_calls:
anyOf:
- type: integer
- type: 'null'
default: null
title: Max Tool Calls
moderation:
anyOf:
- $ref: '#/components/schemas/Moderation'
- type: 'null'
default: null
previous\_response\_id:
anyOf:
- type: string
- type: 'null'
default: null
title: Previous Response Id
prompt:
default: null
title: Prompt
type: 'null'
prompt\_cache\_key:
anyOf:
- type: string
- type: 'null'
default: null
title: Prompt Cache Key
prompt\_cache\_retention:
anyOf:
- enum:
- in\_memory
- 24h
type: string
- type: 'null'
default: null
title: Prompt Cache Retention
reasoning:
anyOf:
- $ref: '#/components/schemas/ResponseReasoningConfig'
- type: 'null'
default: null
safety\_identifier:
anyOf:
- type: string
- type: 'null'
default: null
title: Safety Identifier
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
status:
anyOf:
- enum:
- completed
- failed
- in\_progress
- cancelled
- queued
- incomplete
type: string
- type: 'null'
default: null
title: Status
text:
anyOf:
- $ref: '#/components/schemas/ResponseTextConfig'
- type: 'null'
default: null
top\_logprobs:
anyOf:
- type: integer
- type: 'null'
default: null
title: Top Logprobs
truncation:
anyOf:
- enum:
- auto
- disabled
type: string
- type: 'null'
default: null
title: Truncation
usage:
anyOf:
- $ref: '#/components/schemas/ResponseUsage'
- type: 'null'
default: null
user:
anyOf:
- type: string
- type: 'null'
default: null
title: User
required:
- id
- created\_at
- object
- output
- parallel\_tool\_calls
title: Response
type: object
ResponseStreamEvent:
anyOf:
- $ref: '#/components/schemas/ResponseCreatedEvent'
- $ref: '#/components/schemas/ResponseInProgressEvent'
- $ref: '#/components/schemas/ResponseOutputItemAddedEvent'
- $ref: '#/components/schemas/ResponseContentPartAddedEvent'
- $ref: '#/components/schemas/ResponseTextDeltaEvent'
- $ref: '#/components/schemas/ResponseTextDoneEvent'
- $ref: '#/components/schemas/ResponseOutputTextAnnotationAddedEvent'
- $ref: '#/components/schemas/ResponseContentPartDoneEvent'
- $ref: '#/components/schemas/ResponseOutputItemDoneEvent'
- $ref: '#/components/schemas/ResponseCompletedEvent'
- $ref: '#/components/schemas/ResponseFailedEvent'
- $ref: '#/components/schemas/ResponseIncompleteEvent'
description: An event in the Responses API SSE stream; `type` identifies the event.
title: ResponseStreamEvent
HTTPValidationError:
properties:
detail:
items:
$ref: '#/components/schemas/ValidationError'
type: array
title: Detail
type: object
title: HTTPValidationError
ResponseInputMessage:
properties:
role:
type: string
enum:
- user
- assistant
- system
- developer
title: Role
description: The role of the message author.
content:
anyOf:
- type: string
- items:
$ref: '#/components/schemas/ResponseInputContentPart'
type: array
title: Content
description: >-
Text content of the message. Either a string or a list of content
parts (`{text, type}` objects) for OpenAI SDK clients.
type: object
required:
- role
- content
title: ResponseInputMessage
description: |-
A single input message for the Responses API.
`content` accepts either a bare string (`"hi"`) or the canonical OpenAI
list-of-parts (`[{"text": "hi", "type": "input\_text"}]`).
ResponseTextConfig:
additionalProperties: true
description: >-
Text output configuration. By default the response is plain text; for
structured output set `format` to
`{"type": "json\_schema", "name": ..., "schema": {...}}`. The
`json\_object`
format is accepted for compatibility but produces plain text.
properties:
format:
anyOf:
- $ref: '#/components/schemas/ResponseFormatText'
- $ref: '#/components/schemas/ResponseFormatTextJSONSchemaConfig'
- $ref: '#/components/schemas/ResponseFormatJSONObject'
- type: 'null'
default: null
title: Format
verbosity:
anyOf:
- enum:
- low
- medium
- high
type: string
- type: 'null'
default: null
title: Verbosity
title: ResponseTextConfig
type: object
ResponseReasoningConfig:
description: Reasoning configuration (OpenAI-compatible subset).
properties:
effort:
anyOf:
- enum:
- low
- medium
- high
type: string
- type: 'null'
default: null
description: >-
Controls how much research is performed, trading response time for
answer quality. Defaults to `medium` when omitted.
examples:
- high
title: Effort
title: ResponseReasoningConfig
type: object
ResponseError:
additionalProperties: true
description: Details of a failed response.
properties:
code:
const: server\_error
description: Error code; currently always "server\_error".
title: Code
type: string
message:
title: Message
type: string
required:
- code
- message
title: ResponseError
type: object
IncompleteDetails:
additionalProperties: true
description: Details about why the response is incomplete.
properties:
reason:
anyOf:
- enum:
- max\_output\_tokens
- content\_filter
type: string
- type: 'null'
default: null
title: Reason
title: IncompleteDetails
type: object
ResponseOutputMessage:
additionalProperties: true
description: An assistant message produced by the model.
properties:
id:
title: Id
type: string
content:
items:
$ref: '#/components/schemas/ResponseOutputText'
title: Content
type: array
role:
const: assistant
title: Role
type: string
status:
enum:
- in\_progress
- completed
- incomplete
title: Status
type: string
type:
const: message
title: Type
type: string
phase:
anyOf:
- enum:
- commentary
- final\_answer
type: string
- type: 'null'
default: null
title: Phase
required:
- id
- content
- role
- status
- type
title: ResponseOutputMessage
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
ResponseUsage:
additionalProperties: true
description: |-
Estimated token usage, populated for OpenAI SDK compatibility. Counts
are approximate; Parallel bills per request, not per token.
properties:
input\_tokens:
title: Input Tokens
type: integer
input\_tokens\_details:
$ref: '#/components/schemas/InputTokensDetails'
output\_tokens:
title: Output Tokens
type: integer
output\_tokens\_details:
$ref: '#/components/schemas/OutputTokensDetails'
total\_tokens:
title: Total Tokens
type: integer
required:
- input\_tokens
- input\_tokens\_details
- output\_tokens
- output\_tokens\_details
- total\_tokens
title: ResponseUsage
type: object
ResponseCreatedEvent:
additionalProperties: true
properties:
response:
$ref: '#/components/schemas/Response'
sequence\_number:
title: Sequence Number
type: integer
type:
const: response.created
title: Type
type: string
required:
- response
- sequence\_number
- type
title: ResponseCreatedEvent
type: object
ResponseInProgressEvent:
additionalProperties: true
properties:
response:
$ref: '#/components/schemas/Response'
sequence\_number:
title: Sequence Number
type: integer
type:
const: response.in\_progress
title: Type
type: string
required:
- response
- sequence\_number
- type
title: ResponseInProgressEvent
type: object
ResponseOutputItemAddedEvent:
additionalProperties: true
properties:
item:
$ref: '#/components/schemas/ResponseOutputMessage'
output\_index:
title: Output Index
type: integer
sequence\_number:
title: Sequence Number
type: integer
type:
const: response.output\_item.added
title: Type
type: string
required:
- item
- output\_index
- sequence\_number
- type
title: ResponseOutputItemAddedEvent
type: object
ResponseContentPartAddedEvent:
additionalProperties: true
properties:
content\_index:
title: Content Index
type: integer
item\_id:
title: Item Id
type: string
output\_index:
title: Output Index
type: integer
part:
$ref: '#/components/schemas/ResponseOutputText'
sequence\_number:
title: Sequence Number
type: integer
type:
const: response.content\_part.added
title: Type
type: string
required:
- content\_index
- item\_id
- output\_index
- part
- sequence\_number
- type
title: ResponseContentPartAddedEvent
type: object
ResponseTextDeltaEvent:
additionalProperties: true
description: Emitted when there is an additional text delta.
properties:
content\_index:
title: Content Index
type: integer
delta:
title: Delta
type: string
item\_id:
title: Item Id
type: string
logprobs:
items:
$ref: >-
#/components/schemas/openai\_\_types\_\_responses\_\_response\_text\_delta\_event\_\_Logprob
title: Logprobs
type: array
output\_index:
title: Output Index
type: integer
sequence\_number:
title: Sequence Number
type: integer
type:
const: response.output\_text.delta
title: Type
type: string
required:
- content\_index
- delta
- item\_id
- logprobs
- output\_index
- sequence\_number
- type
title: ResponseTextDeltaEvent
type: object
ResponseTextDoneEvent:
additionalProperties: true
description: Emitted when text content is finalized.
properties:
content\_index:
title: Content Index
type: integer
item\_id:
title: Item Id
type: string
logprobs:
items:
$ref: >-
#/components/schemas/openai\_\_types\_\_responses\_\_response\_text\_done\_event\_\_Logprob
title: Logprobs
type: array
output\_index:
title: Output Index
type: integer
sequence\_number:
title: Sequence Number
type: integer
text:
title: Text
type: string
type:
const: response.output\_text.done
title: Type
type: string
required:
- content\_index
- item\_id
- logprobs
- output\_index
- sequence\_number
- text
- type
title: ResponseTextDoneEvent
type: object
ResponseOutputTextAnnotationAddedEvent:
additionalProperties: true
properties:
annotation:
$ref: '#/components/schemas/AnnotationURLCitation'
annotation\_index:
title: Annotation Index
type: integer
content\_index:
title: Content Index
type: integer
item\_id:
title: Item Id
type: string
output\_index:
title: Output Index
type: integer
sequence\_number:
title: Sequence Number
type: integer
type:
const: response.output\_text.annotation.added
title: Type
type: string
required:
- annotation
- annotation\_index
- content\_index
- item\_id
- output\_index
- sequence\_number
- type
title: ResponseOutputTextAnnotationAddedEvent
type: object
ResponseContentPartDoneEvent:
additionalProperties: true
properties:
content\_index:
title: Content Index
type: integer
item\_id:
title: Item Id
type: string
output\_index:
title: Output Index
type: integer
part:
$ref: '#/components/schemas/ResponseOutputText'
sequence\_number:
title: Sequence Number
type: integer
type:
const: response.content\_part.done
title: Type
type: string
required:
- content\_index
- item\_id
- output\_index
- part
- sequence\_number
- type
title: ResponseContentPartDoneEvent
type: object
ResponseOutputItemDoneEvent:
additionalProperties: true
properties:
item:
$ref: '#/components/schemas/ResponseOutputMessage'
output\_index:
title: Output Index
type: integer
sequence\_number:
title: Sequence Number
type: integer
type:
const: response.output\_item.done
title: Type
type: string
required:
- item
- output\_index
- sequence\_number
- type
title: ResponseOutputItemDoneEvent
type: object
ResponseCompletedEvent:
additionalProperties: true
properties:
response:
$ref: '#/components/schemas/Response'
sequence\_number:
title: Sequence Number
type: integer
type:
const: response.completed
title: Type
type: string
required:
- response
- sequence\_number
- type
title: ResponseCompletedEvent
type: object
ResponseFailedEvent:
additionalProperties: true
properties:
response:
$ref: '#/components/schemas/Response'
sequence\_number:
title: Sequence Number
type: integer
type:
const: response.failed
title: Type
type: string
required:
- response
- sequence\_number
- type
title: ResponseFailedEvent
type: object
ResponseIncompleteEvent:
additionalProperties: true
properties:
response:
$ref: '#/components/schemas/Response'
sequence\_number:
title: Sequence Number
type: integer
type:
const: response.incomplete
title: Type
type: string
required:
- response
- sequence\_number
- type
title: ResponseIncompleteEvent
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
ResponseInputContentPart:
properties:
type:
anyOf:
- type: string
- type: 'null'
title: Type
description: >-
The content part type. Supported: `input\_text`, `output\_text`, and
`text`. Multimodal types (`input\_image`, `input\_audio`,
`input\_file`) are rejected with a 422 error.
text:
anyOf:
- type: string
- type: 'null'
title: Text
description: The text payload, when the part carries one.
type: object
title: ResponseInputContentPart
description: |-
A single content part of a message, e.g.
`{"text": "hi", "type": "input\_text"}`. Only text parts are supported;
requests containing image, audio, or file parts fail with a 422 error.
ResponseFormatText:
additionalProperties: true
description: Default response format. Used to generate text responses.
properties:
type:
const: text
title: Type
type: string
required:
- type
title: ResponseFormatText
type: object
ResponseFormatTextJSONSchemaConfig:
additionalProperties: true
description: >-
JSON Schema output format: the response's output text conforms to
`schema`.
properties:
name:
type: string
title: Name
schema:
additionalProperties: true
title: Schema
type: object
type:
type: string
const: json\_schema
title: Type
description:
anyOf:
- type: string
- type: 'null'
default: null
title: Description
strict:
anyOf:
- type: boolean
- type: 'null'
default: null
title: Strict
required:
- name
- schema
- type
title: ResponseFormatTextJSONSchemaConfig
type: object
ResponseFormatJSONObject:
additionalProperties: true
description: >-
JSON object response format.
An older method of generating JSON responses.
Using `json\_schema` is recommended for models that support it. Note that
the
model will not generate JSON without a system or user message
instructing it
to do so.
properties:
type:
const: json\_object
title: Type
type: string
required:
- type
title: ResponseFormatJSONObject
type: object
ResponseOutputText:
additionalProperties: true
description: |-
A text content part of an output message. `annotations` carries the URL
citations grounding the answer.
properties:
annotations:
items:
$ref: '#/components/schemas/AnnotationURLCitation'
title: Annotations
type: array
text:
title: Text
type: string
type:
const: output\_text
title: Type
type: string
logprobs:
anyOf:
- items:
$ref: >-
#/components/schemas/openai\_\_types\_\_responses\_\_response\_output\_text\_\_Logprob
type: array
- type: 'null'
default: null
title: Logprobs
required:
- annotations
- text
- type
title: ResponseOutputText
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
InputTokensDetails:
additionalProperties: true
description: A detailed breakdown of the input tokens.
properties:
cached\_tokens:
title: Cached Tokens
type: integer
required:
- cached\_tokens
title: InputTokensDetails
type: object
OutputTokensDetails:
additionalProperties: true
description: A detailed breakdown of the output tokens.
properties:
reasoning\_tokens:
title: Reasoning Tokens
type: integer
required:
- reasoning\_tokens
title: OutputTokensDetails
type: object
openai\_\_types\_\_responses\_\_response\_text\_delta\_event\_\_Logprob:
additionalProperties: true
description: >-
A logprob is the logarithmic probability that the model assigns to
producing
a particular token at a given position in the sequence. Less-negative
(higher)
logprob values indicate greater model confidence in that token choice.
properties:
token:
title: Token
type: string
logprob:
title: Logprob
type: number
top\_logprobs:
anyOf:
- items:
$ref: >-
#/components/schemas/openai\_\_types\_\_responses\_\_response\_text\_delta\_event\_\_LogprobTopLogprob
type: array
- type: 'null'
default: null
title: Top Logprobs
required:
- token
- logprob
title: Logprob
type: object
openai\_\_types\_\_responses\_\_response\_text\_done\_event\_\_Logprob:
additionalProperties: true
description: >-
A logprob is the logarithmic probability that the model assigns to
producing
a particular token at a given position in the sequence. Less-negative
(higher)
logprob values indicate greater model confidence in that token choice.
properties:
token:
title: Token
type: string
logprob:
title: Logprob
type: number
top\_logprobs:
anyOf:
- items:
$ref: >-
#/components/schemas/openai\_\_types\_\_responses\_\_response\_text\_done\_event\_\_LogprobTopLogprob
type: array
- type: 'null'
default: null
title: Top Logprobs
required:
- token
- logprob
title: Logprob
type: object
AnnotationURLCitation:
additionalProperties: true
description: A citation for a web resource used to generate a model response.
properties:
end\_index:
title: End Index
type: integer
start\_index:
title: Start Index
type: integer
title:
title: Title
type: string
type:
const: url\_citation
title: Type
type: string
url:
type: string
title: Url
required:
- end\_index
- start\_index
- title
- type
- url
title: AnnotationURLCitation
type: object
openai\_\_types\_\_responses\_\_response\_output\_text\_\_Logprob:
additionalProperties: true
description: The log probability of a token.
properties:
token:
title: Token
type: string
bytes:
items:
type: integer
title: Bytes
type: array
logprob:
title: Logprob
type: number
top\_logprobs:
items:
$ref: >-
#/components/schemas/openai\_\_types\_\_responses\_\_response\_output\_text\_\_LogprobTopLogprob
title: Top Logprobs
type: array
required:
- token
- bytes
- logprob
- top\_logprobs
title: Logprob
type: object
openai\_\_types\_\_responses\_\_response\_text\_delta\_event\_\_LogprobTopLogprob:
additionalProperties: true
properties:
token:
anyOf:
- type: string
- type: 'null'
default: null
title: Token
logprob:
anyOf:
- type: number
- type: 'null'
default: null
title: Logprob
title: LogprobTopLogprob
type: object
openai\_\_types\_\_responses\_\_response\_text\_done\_event\_\_LogprobTopLogprob:
additionalProperties: true
properties:
token:
anyOf:
- type: string
- type: 'null'
default: null
title: Token
logprob:
anyOf:
- type: number
- type: 'null'
default: null
title: Logprob
title: LogprobTopLogprob
type: object
openai\_\_types\_\_responses\_\_response\_output\_text\_\_LogprobTopLogprob:
additionalProperties: true
description: The top log probability of a token.
properties:
token:
title: Token
type: string
bytes:
items:
type: integer
title: Bytes
type: array
logprob:
title: Logprob
type: number
required:
- token
- bytes
- logprob
title: LogprobTopLogprob
type: object
securitySchemes:
ApiKeyAuth:
type: apiKey
in: header
name: x-api-key
````
