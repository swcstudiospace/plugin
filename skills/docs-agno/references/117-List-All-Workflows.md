# List All Workflows

Source: https://docs.agno.com/api-reference/workflows/list-all-workflows.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# List All Workflows
> Retrieve a comprehensive list of all workflows configured in this OS instance.
\*\*Return Information:\*\*
- Workflow metadata (ID, name, description)
- Input schema requirements
- Step sequence and execution flow
- Associated agents and teams
## OpenAPI
````yaml /reference-api/openapi.yaml get /workflows
openapi: 3.1.0
info:
title: Agno API Reference
description: The all-in-one, private, secure agent platform that runs in your cloud.
version: 2.7.2
servers: []
security: []
paths:
/workflows:
get:
tags:
- Workflows
summary: List All Workflows
description: >-
Retrieve a comprehensive list of all workflows configured in this OS
instance.
\*\*Return Information:\*\*
- Workflow metadata (ID, name, description)
- Input schema requirements
- Step sequence and execution flow
- Associated agents and teams
operationId: get\_workflows
responses:
'200':
description: List of workflows retrieved successfully
content:
application/json:
schema:
items:
$ref: '#/components/schemas/WorkflowSummaryResponse'
type: array
title: Response Get Workflows
example:
- id: content-creation-workflow
name: Content Creation Workflow
description: Automated content creation from blog posts to social media
db\_id: '123'
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
description: Not Found
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
WorkflowSummaryResponse:
properties:
id:
anyOf:
- type: string
- type: 'null'
title: Id
description: Unique identifier for the workflow
name:
anyOf:
- type: string
- type: 'null'
title: Name
description: Name of the workflow
description:
anyOf:
- type: string
- type: 'null'
title: Description
description: Description of the workflow
db\_id:
anyOf:
- type: string
- type: 'null'
title: Db Id
description: Database identifier
is\_factory:
type: boolean
title: Is Factory
description: Whether this workflow is a factory
default: false
factory\_input\_schema:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Factory Input Schema
description: JSON Schema for factory\_input
is\_component:
type: boolean
title: Is Component
description: Whether this workflow was created via Builder
default: false
current\_version:
anyOf:
- type: integer
- type: 'null'
title: Current Version
description: Current published version number
stage:
anyOf:
- type: string
- type: 'null'
title: Stage
description: Stage of the loaded config (draft/published)
type: object
title: WorkflowSummaryResponse
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
