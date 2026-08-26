# Cancel Team Run

Source: https://docs.agno.com/api-reference/teams/cancel-team-run.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Cancel Team Run
> Cancel a currently executing team run. This will attempt to stop the team's execution gracefully.
\*\*Note:\*\* Cancellation may not be immediate for all operations.
## OpenAPI
````yaml /reference-api/openapi.yaml post /teams/{team\_id}/runs/{run\_id}/cancel
openapi: 3.1.0
info:
title: Agno API Reference
description: The all-in-one, private, secure agent platform that runs in your cloud.
version: 2.7.2
servers: []
security: []
paths:
/teams/{team\_id}/runs/{run\_id}/cancel:
post:
tags:
- Teams
summary: Cancel Team Run
description: >-
Cancel a currently executing team run. This will attempt to stop the
team's execution gracefully.
\*\*Note:\*\* Cancellation may not be immediate for all operations.
operationId: cancel\_team\_run
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
- name: session\_id
in: query
required: false
schema:
anyOf:
- type: string
- type: 'null'
description: Session ID the run belongs to. Required for non-admin JWT users.
title: Session Id
description: Session ID the run belongs to. Required for non-admin JWT users.
responses:
'200':
description: Successful Response
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
description: Failed to cancel team run
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
