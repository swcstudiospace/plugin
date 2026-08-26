# Execute Workflow

Source: https://docs.agno.com/api-reference/workflows/execute-workflow.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Execute Workflow
> Execute a workflow with the provided input data. Workflows can run in streaming or batch mode.
\*\*Execution Modes:\*\*
- \*\*Streaming (`stream=true`)\*\*: Real-time step-by-step execution updates via SSE
- \*\*Non-Streaming (`stream=false`)\*\*: Complete workflow execution with final result
\*\*Workflow Execution Process:\*\*
1. Input validation against workflow schema
2. Sequential or parallel step execution based on workflow design
3. Data flow between steps with transformation
4. Error handling and automatic retries where configured
5. Final result compilation and response
\*\*Session Management:\*\*
Workflows support session continuity for stateful execution across multiple runs.
## OpenAPI
````yaml /reference-api/openapi.yaml post /workflows/{workflow\_id}/runs
openapi: 3.1.0
info:
title: Agno API Reference
description: The all-in-one, private, secure agent platform that runs in your cloud.
version: 2.7.2
servers: []
security: []
paths:
/workflows/{workflow\_id}/runs:
post:
tags:
- Workflows
summary: Execute Workflow
description: >-
Execute a workflow with the provided input data. Workflows can run in
streaming or batch mode.
\*\*Execution Modes:\*\*
- \*\*Streaming (`stream=true`)\*\*: Real-time step-by-step execution
updates via SSE
- \*\*Non-Streaming (`stream=false`)\*\*: Complete workflow execution with
final result
\*\*Workflow Execution Process:\*\*
1. Input validation against workflow schema
2. Sequential or parallel step execution based on workflow design
3. Data flow between steps with transformation
4. Error handling and automatic retries where configured
5. Final result compilation and response
\*\*Session Management:\*\*
Workflows support session continuity for stateful execution across
multiple runs.
operationId: create\_workflow\_run
parameters:
- name: workflow\_id
in: path
required: true
schema:
type: string
title: Workflow Id
requestBody:
required: true
content:
application/x-www-form-urlencoded:
schema:
$ref: '#/components/schemas/Body\_create\_workflow\_run'
responses:
'200':
description: Workflow executed successfully
content:
application/json:
schema: {}
text/event-stream:
example: |+
event: RunStarted
data: {"content": "Hello!", "run\_id": "123..."}
'400':
description: Invalid input data or workflow configuration
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
'422':
description: Validation Error
content:
application/json:
schema:
$ref: '#/components/schemas/ValidationErrorResponse'
'500':
description: Workflow execution error
content:
application/json:
schema:
$ref: '#/components/schemas/InternalServerErrorResponse'
security:
- HTTPBearer: []
components:
schemas:
Body\_create\_workflow\_run:
properties:
message:
type: string
title: Message
description: The input message or prompt to send to the workflow
stream:
type: boolean
title: Stream
description: Enable streaming responses via Server-Sent Events (SSE)
default: true
background:
type: boolean
title: Background
description: >-
Run workflow in background (survives client disconnect). Requires
database. Use /resume to reconnect.
default: false
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
version:
anyOf:
- type: integer
- type: 'null'
title: Version
description: Workflow version to use for this run
factory\_input:
anyOf:
- type: string
- type: 'null'
title: Factory Input
description: >-
JSON object with factory-specific parameters for dynamic workflow
construction
type: object
required:
- message
title: Body\_create\_workflow\_run
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
