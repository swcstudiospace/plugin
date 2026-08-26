# Create Agent Run

Source: https://docs.agno.com/api-reference/agents/create-agent-run.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Create Agent Run
> Execute an agent with a message and optional media files. Supports both streaming and non-streaming responses.
\*\*Features:\*\*
- Text message input with optional session management
- Multi-media support: images (PNG, JPEG, WebP), audio (WAV, MP3), video (MP4, WebM, etc.)
- Document processing: PDF, CSV, DOCX, TXT, JSON
- Real-time streaming responses with Server-Sent Events (SSE)
- User and session context preservation
\*\*Streaming Response:\*\*
When `stream=true`, returns SSE events with `event` and `data` fields.
## OpenAPI
````yaml /reference-api/openapi.yaml post /agents/{agent\_id}/runs
openapi: 3.1.0
info:
title: Agno API Reference
description: The all-in-one, private, secure agent platform that runs in your cloud.
version: 2.7.2
servers: []
security: []
paths:
/agents/{agent\_id}/runs:
post:
tags:
- Agents
summary: Create Agent Run
description: >-
Execute an agent with a message and optional media files. Supports both
streaming and non-streaming responses.
\*\*Features:\*\*
- Text message input with optional session management
- Multi-media support: images (PNG, JPEG, WebP), audio (WAV, MP3), video
(MP4, WebM, etc.)
- Document processing: PDF, CSV, DOCX, TXT, JSON
- Real-time streaming responses with Server-Sent Events (SSE)
- User and session context preservation
\*\*Streaming Response:\*\*
When `stream=true`, returns SSE events with `event` and `data` fields.
operationId: create\_agent\_run
parameters:
- name: agent\_id
in: path
required: true
schema:
type: string
title: Agent Id
requestBody:
required: true
content:
multipart/form-data:
schema:
$ref: '#/components/schemas/Body\_create\_agent\_run'
responses:
'200':
description: Agent run executed successfully
content:
application/json:
schema: {}
text/event-stream:
examples:
event\_stream:
summary: Example event stream response
value: |+
event: RunStarted
data: {"content": "Hello!", "run\_id": "123..."}
'400':
description: Invalid request or unsupported file type
content:
application/json:
schema:
$ref: '#/components/schemas/BadRequestResponse'
'401':
description: Unauthorized
content:
application/json:
schema:
$ref: '#/components/schemas/UnauthenticatedResponse'
'404':
description: Agent not found
content:
application/json:
schema:
$ref: '#/components/schemas/NotFoundResponse'
'422':
description: Validation Error
content:
application/json:
schema:
$ref: '#/components/schemas/ValidationErrorResponse'
'500':
description: Internal Server Error
content:
application/json:
schema:
$ref: '#/components/schemas/InternalServerErrorResponse'
security:
- HTTPBearer: []
components:
schemas:
Body\_create\_agent\_run:
properties:
message:
type: string
title: Message
description: The input message or prompt to send to the agent
stream:
type: boolean
title: Stream
description: Enable streaming responses via Server-Sent Events (SSE)
default: true
session\_id:
anyOf:
- type: string
- type: 'null'
title: Session Id
description: >-
Session ID for conversation continuity. If not provided, a new
session is created
user\_id:
anyOf:
- type: string
- type: 'null'
title: User Id
description: User identifier for tracking and personalization
files:
anyOf:
- items:
type: string
contentMediaType: application/octet-stream
type: array
- type: 'null'
title: Files
description: Files to upload (images, audio, video, or documents)
version:
anyOf:
- type: string
- type: 'null'
title: Version
description: Agent version to use for this run
background:
type: boolean
title: Background
description: >-
Run in background and return immediately with run metadata (requires
database)
default: false
factory\_input:
anyOf:
- type: string
- type: 'null'
title: Factory Input
description: >-
JSON object with factory-specific parameters for dynamic agent
construction
type: object
required:
- message
title: Body\_create\_agent\_run
BadRequestResponse:
properties:
detail:
type: string
title: Detail
description: Error detail message
error\_code:
anyOf:
- type: string
- type: 'null'
title: Error Code
description: Error code for categorization
type: object
required:
- detail
title: BadRequestResponse
example:
detail: Bad request
error\_code: BAD\_REQUEST
UnauthenticatedResponse:
properties:
detail:
type: string
title: Detail
description: Error detail message
error\_code:
anyOf:
- type: string
- type: 'null'
title: Error Code
description: Error code for categorization
type: object
required:
- detail
title: UnauthenticatedResponse
example:
detail: Unauthenticated access
error\_code: UNAUTHENTICATED
NotFoundResponse:
properties:
detail:
type: string
title: Detail
description: Error detail message
error\_code:
anyOf:
- type: string
- type: 'null'
title: Error Code
description: Error code for categorization
type: object
required:
- detail
title: NotFoundResponse
example:
detail: Not found
error\_code: NOT\_FOUND
ValidationErrorResponse:
properties:
detail:
type: string
title: Detail
description: Error detail message
error\_code:
anyOf:
- type: string
- type: 'null'
title: Error Code
description: Error code for categorization
type: object
required:
- detail
title: ValidationErrorResponse
example:
detail: Validation error
error\_code: VALIDATION\_ERROR
InternalServerErrorResponse:
properties:
detail:
type: string
title: Detail
description: Error detail message
error\_code:
anyOf:
- type: string
- type: 'null'
title: Error Code
description: Error code for categorization
type: object
required:
- detail
title: InternalServerErrorResponse
example:
detail: Internal server error
error\_code: INTERNAL\_SERVER\_ERROR
securitySchemes:
HTTPBearer:
type: http
scheme: bearer
````
