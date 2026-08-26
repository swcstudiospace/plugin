# Get Workflow Details

Source: https://docs.agno.com/api-reference/workflows/get-workflow-details.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Get Workflow Details
> Retrieve detailed configuration and step information for a specific workflow.
## OpenAPI
````yaml /reference-api/openapi.yaml get /workflows/{workflow\_id}
openapi: 3.1.0
info:
title: Agno API Reference
description: The all-in-one, private, secure agent platform that runs in your cloud.
version: 2.7.2
servers: []
security: []
paths:
/workflows/{workflow\_id}:
get:
tags:
- Workflows
summary: Get Workflow Details
description: >-
Retrieve detailed configuration and step information for a specific
workflow.
operationId: get\_workflow
parameters:
- name: workflow\_id
in: path
required: true
schema:
type: string
title: Workflow Id
- name: version
in: query
required: false
schema:
anyOf:
- type: integer
- type: 'null'
description: Workflow version to retrieve
title: Version
description: Workflow version to retrieve
responses:
'200':
description: Workflow details retrieved successfully
content:
application/json:
schema:
$ref: '#/components/schemas/WorkflowResponse'
example:
id: content-creation-workflow
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
description: Internal Server Error
content:
application/json:
schema:
$ref: '#/components/schemas/InternalServerErrorResponse'
security:
- HTTPBearer: []
components:
schemas:
WorkflowResponse:
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
db\_id:
anyOf:
- type: string
- type: 'null'
title: Db Id
description: Database identifier
description:
anyOf:
- type: string
- type: 'null'
title: Description
description: Description of the workflow
input\_schema:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Input Schema
description: Input schema for the workflow
steps:
anyOf:
- items:
additionalProperties: true
type: object
type: array
- type: 'null'
title: Steps
description: List of workflow steps
agent:
anyOf:
- $ref: '#/components/schemas/AgentResponse'
- type: 'null'
description: Agent configuration if used
team:
anyOf:
- $ref: '#/components/schemas/TeamResponse'
- type: 'null'
description: Team configuration if used
metadata:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Metadata
description: Additional metadata
workflow\_agent:
type: boolean
title: Workflow Agent
description: Whether this workflow uses a WorkflowAgent
default: false
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
title: WorkflowResponse
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
AgentResponse:
properties:
id:
anyOf:
- type: string
- type: 'null'
title: Id
name:
anyOf:
- type: string
- type: 'null'
title: Name
db\_id:
anyOf:
- type: string
- type: 'null'
title: Db Id
description:
anyOf:
- type: string
- type: 'null'
title: Description
role:
anyOf:
- type: string
- type: 'null'
title: Role
is\_factory:
type: boolean
title: Is Factory
default: false
model:
anyOf:
- $ref: '#/components/schemas/ModelResponse'
- type: 'null'
tools:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Tools
sessions:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Sessions
knowledge:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Knowledge
memory:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Memory
reasoning:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Reasoning
default\_tools:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Default Tools
system\_message:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: System Message
extra\_messages:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Extra Messages
response\_settings:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Response Settings
introduction:
anyOf:
- type: string
- type: 'null'
title: Introduction
streaming:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Streaming
metadata:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Metadata
input\_schema:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Input Schema
factory\_input\_schema:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Factory Input Schema
is\_component:
type: boolean
title: Is Component
default: false
current\_version:
anyOf:
- type: integer
- type: 'null'
title: Current Version
stage:
anyOf:
- type: string
- type: 'null'
title: Stage
type: object
title: AgentResponse
TeamResponse:
properties:
id:
anyOf:
- type: string
- type: 'null'
title: Id
name:
anyOf:
- type: string
- type: 'null'
title: Name
db\_id:
anyOf:
- type: string
- type: 'null'
title: Db Id
description:
anyOf:
- type: string
- type: 'null'
title: Description
role:
anyOf:
- type: string
- type: 'null'
title: Role
mode:
anyOf:
- type: string
- type: 'null'
title: Mode
model:
anyOf:
- $ref: '#/components/schemas/ModelResponse'
- type: 'null'
tools:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Tools
sessions:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Sessions
knowledge:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Knowledge
memory:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Memory
reasoning:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Reasoning
default\_tools:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Default Tools
system\_message:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: System Message
response\_settings:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Response Settings
introduction:
anyOf:
- type: string
- type: 'null'
title: Introduction
streaming:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Streaming
members:
anyOf:
- items:
anyOf:
- $ref: '#/components/schemas/AgentResponse'
- $ref: '#/components/schemas/TeamResponse'
type: array
- type: 'null'
title: Members
metadata:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Metadata
input\_schema:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Input Schema
is\_factory:
type: boolean
title: Is Factory
default: false
factory\_input\_schema:
anyOf:
- additionalProperties: true
type: object
- type: 'null'
title: Factory Input Schema
is\_component:
type: boolean
title: Is Component
default: false
current\_version:
anyOf:
- type: integer
- type: 'null'
title: Current Version
stage:
anyOf:
- type: string
- type: 'null'
title: Stage
type: object
title: TeamResponse
ModelResponse:
properties:
name:
anyOf:
- type: string
- type: 'null'
title: Name
description: Name of the model
model:
anyOf:
- type: string
- type: 'null'
title: Model
description: Model identifier
provider:
anyOf:
- type: string
- type: 'null'
title: Provider
description: Model provider name
type: object
title: ModelResponse
securitySchemes:
HTTPBearer:
type: http
scheme: bearer
````
