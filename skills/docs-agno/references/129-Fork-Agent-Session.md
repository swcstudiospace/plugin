# Fork Agent Session

Source: https://docs.agno.com/api-reference/agents/fork-agent-session.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Fork Agent Session
> Deep-copy a session into a new independent session. Every run is copied with a fresh ``run\_id``; the new session has a fresh ``session\_id``. The original is untouched. Use to explore alternative conversation paths without mutating the source.
Distinct from ``/continue?fork=true``: that creates a sibling \*\*run\*\* inside the \*\*same\*\* session. This creates a sibling \*\*session\*\*.
## OpenAPI
````yaml /reference-api/openapi.yaml post /agents/{agent\_id}/sessions/{session\_id}/fork
openapi: 3.1.0
info:
title: Agno API Reference
description: The all-in-one, private, secure agent platform that runs in your cloud.
version: 2.7.2
servers: []
security: []
paths:
/agents/{agent\_id}/sessions/{session\_id}/fork:
post:
tags:
- Agents
summary: Fork Agent Session
description: >-
Deep-copy a session into a new independent session. Every run is copied
with a fresh ``run\_id``; the new session has a fresh ``session\_id``. The
original is untouched. Use to explore alternative conversation paths
without mutating the source.
Distinct from ``/continue?fork=true``: that creates a sibling \*\*run\*\*
inside the \*\*same\*\* session. This creates a sibling \*\*session\*\*.
operationId: fork\_agent\_session
parameters:
- name: agent\_id
in: path
required: true
schema:
type: string
title: Agent Id
- name: session\_id
in: path
required: true
schema:
type: string
title: Session Id
- name: user\_id
in: query
required: false
schema:
anyOf:
- type: string
- type: 'null'
title: User Id
responses:
'200':
description: Session forked successfully
content:
application/json:
schema: {}
'400':
description: Source session is empty or missing
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
