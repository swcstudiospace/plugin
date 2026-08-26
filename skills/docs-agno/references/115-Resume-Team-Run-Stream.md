# Resume Team Run Stream

Source: https://docs.agno.com/api-reference/teams/resume-team-run-stream.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Resume Team Run Stream
> Resume an SSE stream for a team run after disconnection.
Sends missed events since `last\_event\_index`, then continues streaming live events if the run is still active.
\*\*Three reconnection paths:\*\*
1. \*\*Run still active\*\*: Sends catch-up events + continues live streaming
2. \*\*Run completed (in buffer)\*\*: Replays missed buffered events
3. \*\*Run completed (in database)\*\*: Replays events from database
\*\*Client usage:\*\*
Track `event\_index` from each SSE event. On reconnection, pass the last received `event\_index` as `last\_event\_index`.
## OpenAPI
````yaml /reference-api/openapi.yaml post /teams/{team\_id}/runs/{run\_id}/resume
openapi: 3.1.0
info:
title: Agno API Reference
description: The all-in-one, private, secure agent platform that runs in your cloud.
version: 2.7.2
servers: []
security: []
paths:
/teams/{team\_id}/runs/{run\_id}/resume:
post:
tags:
- Teams
summary: Resume Team Run Stream
description: >-
Resume an SSE stream for a team run after disconnection.
Sends missed events since `last\_event\_index`, then continues streaming
live events if the run is still active.
\*\*Three reconnection paths:\*\*
1. \*\*Run still active\*\*: Sends catch-up events + continues live
streaming
2. \*\*Run completed (in buffer)\*\*: Replays missed buffered events
3. \*\*Run completed (in database)\*\*: Replays events from database
\*\*Client usage:\*\*
Track `event\_index` from each SSE event. On reconnection, pass the last
received `event\_index` as `last\_event\_index`.
operationId: resume\_team\_run\_stream
parameters:
- name: team\_id
in: path
required: true
schema:
type: string
title: Team Id
- name: run\_id
in: path
required: true
schema:
type: string
title: Run Id
requestBody:
content:
application/x-www-form-urlencoded:
schema:
$ref: '#/components/schemas/Body\_resume\_team\_run\_stream'
responses:
'200':
description: SSE stream of catch-up and/or live events
content:
application/json:
schema: {}
text/event-stream: {}
'400':
description: Not supported for remote teams
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
Body\_resume\_team\_run\_stream:
properties:
last\_event\_index:
anyOf:
- type: integer
- type: 'null'
title: Last Event Index
description: Index of last event received by client (0-based)
session\_id:
anyOf:
- type: string
- type: 'null'
title: Session Id
description: Session ID for database fallback
type: object
title: Body\_resume\_team\_run\_stream
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
