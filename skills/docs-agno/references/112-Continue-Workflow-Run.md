# Continue Workflow Run

Source: https://docs.agno.com/api-reference/workflows/continue-workflow-run.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Continue Workflow Run
> Continue a paused workflow run with resolved requirements.
\*\*Use Cases:\*\*
- Resume after step-level HITL (confirmation, user input, router selection)
- Resume after executor-level HITL (agent/team tool confirmation within a step)
\*\*Requirements Parameter:\*\*
JSON string containing the resolved step requirements.
## OpenAPI
````yaml /reference-api/openapi.yaml post /workflows/{workflow\_id}/runs/{run\_id}/continue
openapi: 3.1.0
info:
title: Agno API Reference
description: The all-in-one, private, secure agent platform that runs in your cloud.
version: 2.7.2
servers: []
security: []
paths:
/workflows/{workflow\_id}/runs/{run\_id}/continue:
post:
tags:
- Workflows
summary: Continue Workflow Run
description: >-
Continue a paused workflow run with resolved requirements.
\*\*Use Cases:\*\*
- Resume after step-level HITL (confirmation, user input, router
selection)
- Resume after executor-level HITL (agent/team tool confirmation within
a step)
\*\*Requirements Parameter:\*\*
JSON string containing the resolved step requirements.
operationId: continue\_workflow\_run
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
requestBody:
content:
application/x-www-form-urlencoded:
schema:
$ref: '#/components/schemas/Body\_continue\_workflow\_run'
responses:
'200':
description: Workflow run continued successfully
content:
application/json:
schema: {}
text/event-stream:
example: |+
event: StepCompleted
data: {"step\_name": "step1"}
'400':
description: Invalid JSON in requirements field
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
description: Workflow not found
content:
application/json:
schema:
$ref: '#/components/schemas/NotFoundResponse'
'409':
description: Run is not paused. Only PAUSED runs can be continued.
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
Body\_continue\_workflow\_run:
properties:
step\_requirements:
type: string
title: Step Requirements
description: JSON string of step requirement objects with resolution status
default: ''
session\_id:
anyOf:
- type: string
- type: 'null'
title: Session Id
description: Session ID for the paused run
user\_id:
anyOf:
- type: string
- type: 'null'
title: User Id
description: User identifier for tracking and personalization
stream:
type: boolean
title: Stream
description: Enable streaming responses via Server-Sent Events (SSE)
default: true
factory\_input:
anyOf:
- type: string
- type: 'null'
title: Factory Input
description: >-
JSON object with factory-specific parameters for dynamic workflow
reconstruction
type: object
title: Body\_continue\_workflow\_run
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
