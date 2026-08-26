# Get Team Details

Source: https://docs.agno.com/api-reference/teams/get-team-details.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Get Team Details
> Retrieve detailed configuration and member information for a specific team.
## OpenAPI
````yaml /reference-api/openapi.yaml get /teams/{team\_id}
openapi: 3.1.0
info:
title: Agno API Reference
description: The all-in-one, private, secure agent platform that runs in your cloud.
version: 2.7.2
servers: []
security: []
paths:
/teams/{team\_id}:
get:
tags:
- Teams
summary: Get Team Details
description: >-
Retrieve detailed configuration and member information for a specific
team.
operationId: get\_team
parameters:
- name: team\_id
in: path
required: true
schema:
type: string
title: Team Id
responses:
'200':
description: Team details retrieved successfully
content:
application/json:
schema:
$ref: '#/components/schemas/TeamResponse'
example:
team\_id: basic-team
name: Basic Team
mode: coordinate
model:
name: OpenAIChat
model: gpt-4o
provider: OpenAI
tools:
- name: transfer\_task\_to\_member
description: >-
Use this function to transfer a task to the selected team
member.
You must provide a clear and concise description of the
task the member should achieve AND the expected output.
parameters:
type: object
properties:
member\_id:
type: string
description: >-
(str) The ID of the member to transfer the task to.
Use only the ID of the member, not the ID of the
team followed by the ID of the member.
task\_description:
type: string
description: >-
(str) A clear and concise description of the task
the member should achieve.
expected\_output:
type: string
description: >-
(str) The expected output from the member
(optional).
additionalProperties: false
required:
- member\_id
- task\_description
members:
- agent\_id: basic-agent
name: Basic Agent
model:
name: OpenAIChat
model: gpt-4o
provider: OpenAI gpt-4o
memory:
app\_name: Memory
model:
name: OpenAIChat
model: gpt-4o
provider: OpenAI
session\_table: agno\_sessions
memory\_table: agno\_memories
enable\_agentic\_context: false
memory:
app\_name: Memory
model:
name: OpenAIChat
model: gpt-4o
provider: OpenAI
async\_mode: false
session\_table: agno\_sessions
memory\_table: agno\_memories
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
description: Internal Server Error
content:
application/json:
schema:
$ref: '#/components/schemas/InternalServerErrorResponse'
security:
- HTTPBearer: []
components:
schemas:
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
securitySchemes:
HTTPBearer:
type: http
scheme: bearer
````
