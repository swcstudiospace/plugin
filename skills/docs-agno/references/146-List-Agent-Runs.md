# List Agent Runs

Source: https://docs.agno.com/api-reference/agents/list-agent-runs.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# List Agent Runs
> List runs for an agent within a session, optionally filtered by status.
Useful for monitoring background runs and viewing run history.
## OpenAPI
````yaml /reference-api/openapi.yaml get /agents/{agent\_id}/runs
openapi: 3.1.0
info:
title: Agno API Reference
description: The all-in-one, private, secure agent platform that runs in your cloud.
version: 2.7.2
servers: []
security: []
paths:
/agents/{agent\_id}/runs:
get:
tags:
- Agents
summary: List Agent Runs
description: |-
List runs for an agent within a session, optionally filtered by status.
Useful for monitoring background runs and viewing run history.
operationId: list\_agent\_runs
parameters:
- name: agent\_id
in: path
required: true
schema:
type: string
title: Agent Id
- name: session\_id
in: query
required: true
schema:
type: string
description: Session ID to list runs for
title: Session Id
description: Session ID to list runs for
- name: status
in: query
required: false
schema:
anyOf:
- type: string
- type: 'null'
description: Filter by run status (PENDING, RUNNING, COMPLETED, ERROR)
title: Status
description: Filter by run status (PENDING, RUNNING, COMPLETED, ERROR)
responses:
'200':
description: List of runs retrieved successfully
content:
application/json:
schema: {}
'400':
description: Bad Request
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
