# Continue Team Run

Source: https://docs.agno.com/api-reference/teams/continue-team-run.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Continue Team Run
> Continue a paused or incomplete team run with updated requirements.
\*\*Use Cases:\*\*
- Resume execution after tool approval/rejection
- Provide manual tool execution results
- Resume after admin approval (requirements can be empty; resolution fetched from DB)
\*\*Requirements Parameter:\*\*
JSON string containing array of requirement objects with tool execution results.
Can be empty when an admin-required approval has been resolved.
## OpenAPI
````yaml /reference-api/openapi.yaml post /teams/{team\_id}/runs/{run\_id}/continue
openapi: 3.1.0
info:
title: Agno API Reference
description: The all-in-one, private, secure agent platform that runs in your cloud.
version: 2.7.2
servers: []
security: []
paths:
/teams/{team\_id}/runs/{run\_id}/continue:
post:
tags:
- Teams
summary: Continue Team Run
description: >-
Continue a paused or incomplete team run with updated requirements.
\*\*Use Cases:\*\*
- Resume execution after tool approval/rejection
- Provide manual tool execution results
- Resume after admin approval (requirements can be empty; resolution
fetched from DB)
\*\*Requirements Parameter:\*\*
JSON string containing array of requirement objects with tool execution
results.
Can be empty when an admin-required approval has been resolved.
operationId: continue\_team\_run
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
$ref: '#/components/schemas/Body\_continue\_team\_run'
responses:
'200':
description: Team run continued successfully
content:
application/json:
schema: {}
text/event-stream:
example: |+
event: RunContent
data: {"created\_at": 1757348314, "run\_id": "123..."}
'400':
description: Invalid JSON in requirements field or invalid requirement structure
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
'403':
description: >-
Run has a pending admin approval and cannot be continued by the user
yet.
'404':
description: Team not found
content:
application/json:
schema:
$ref: '#/components/schemas/NotFoundResponse'
'409':
description: >-
Run is not paused (e.g. run is already running, continued, or
errored). Only PAUSED runs can be continued.
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
Body\_continue\_team\_run:
properties:
requirements:
type: string
title: Requirements
default: ''
input:
anyOf:
- type: string
- type: 'null'
title: Input
continue\_from:
type: string
title: Continue From
description: >-
Continuation boundary. Use 'end', 'last\_user', or a numeric message
index.
default: end
fork:
type: boolean
title: Fork
default: false
regenerate:
type: boolean
title: Regenerate
default: false
replace\_original:
anyOf:
- type: boolean
- type: 'null'
title: Replace Original
additional\_instructions:
anyOf:
- type: string
- type: 'null'
title: Additional Instructions
session\_id:
anyOf:
- type: string
- type: 'null'
title: Session Id
user\_id:
anyOf:
- type: string
- type: 'null'
title: User Id
stream:
type: boolean
title: Stream
default: true
background:
type: boolean
title: Background
default: false
type: object
title: Body\_continue\_team\_run
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
