# Get Workflow Run

Source: https://docs.agno.com/api-reference/workflows/get-workflow-run.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Get Workflow Run
> Retrieve the status and output of a workflow run. Use this to poll for run completion.
Requires the `session\_id` that was returned when the run was created.
## OpenAPI
````yaml /reference-api/openapi.yaml get /workflows/{workflow\_id}/runs/{run\_id}
openapi: 3.1.0
info:
title: Agno API Reference
description: The all-in-one, private, secure agent platform that runs in your cloud.
version: 2.7.2
servers: []
security: []
paths:
/workflows/{workflow\_id}/runs/{run\_id}:
get:
tags:
- Workflows
summary: Get Workflow Run
description: >-
Retrieve the status and output of a workflow run. Use this to poll for
run completion.
Requires the `session\_id` that was returned when the run was created.
operationId: get\_workflow\_run
parameters:
- name: workflow\_id
in: path
required: true
schema:
type: string
title: Workflow Id
- name: run\_id
in: path
required: true
schema:
type: string
title: Run Id
- name: session\_id
in: query
required: true
schema:
type: string
description: Session ID for the run
title: Session Id
description: Session ID for the run
- name: factory\_input
in: query
required: false
schema:
anyOf:
- type: string
- type: 'null'
title: Factory Input
description: >-
JSON object with factory-specific parameters for dynamic workflow
reconstruction
description: >-
JSON object with factory-specific parameters for dynamic workflow
reconstruction
responses:
'200':
description: Run output retrieved successfully
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
description: Workflow or run not found
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
