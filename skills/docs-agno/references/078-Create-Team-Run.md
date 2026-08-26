# Create Team Run

Source: https://docs.agno.com/api-reference/teams/create-team-run.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Create Team Run
> Execute a team collaboration with multiple agents working together on a task.
\*\*Features:\*\*
- Text message input with optional session management
- Multi-media support: images (PNG, JPEG, WebP), audio (WAV, MP3), video (MP4, WebM, etc.)
- Document processing: PDF, CSV, DOCX, TXT, JSON
- Real-time streaming responses with Server-Sent Events (SSE)
- User and session context preservation
\*\*Streaming Response:\*\*
When `stream=true`, returns SSE events with `event` and `data` fields.
## OpenAPI
````yaml /reference-api/openapi.yaml post /teams/{team\_id}/runs
openapi: 3.1.0
info:
title: Agno API Reference
description: The all-in-one, private, secure agent platform that runs in your cloud.
version: 2.7.2
servers: []
security: []
paths:
/teams/{team\_id}/runs:
post:
tags:
- Teams
summary: Create Team Run
description: >-
Execute a team collaboration with multiple agents working together on a
task.
\*\*Features:\*\*
- Text message input with optional session management
- Multi-media support: images (PNG, JPEG, WebP), audio (WAV, MP3), video
(MP4, WebM, etc.)
- Document processing: PDF, CSV, DOCX, TXT, JSON
- Real-time streaming responses with Server-Sent Events (SSE)
- User and session context preservation
\*\*Streaming Response:\*\*
When `stream=true`, returns SSE events with `event` and `data` fields.
operationId: create\_team\_run
parameters:
- name: team\_id
in: path
required: true
schema:
type: string
title: Team Id
requestBody:
required: true
content:
multipart/form-data:
schema:
$ref: '#/components/schemas/Body\_create\_team\_run'
responses:
'200':
description: Team run executed successfully
content:
application/json:
schema: {}
text/event-stream:
example: |+
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
description: Team not found
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
Body\_create\_team\_run:
properties:
message:
type: string
title: Message
description: The input message or prompt to send to the team
stream:
type: boolean
title: Stream
description: Enable streaming responses via Server-Sent Events (SSE)
default: true
monitor:
type: boolean
title: Monitor
description: Enable monitoring and logging for this run
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
- type: integer
- type: 'null'
title: Version
description: Team version to use for this run
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
JSON object with factory-specific parameters for dynamic team
construction
type: object
required:
- message
title: Body\_create\_team\_run
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
