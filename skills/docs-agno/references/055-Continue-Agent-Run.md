# Continue Agent Run

Source: https://docs.agno.com/api-reference/agents/continue-agent-run.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.agno.com/llms.txt
> Use this file to discover all available pages before exploring further.
# Continue Agent Run
> Advance a persisted agent run from its current state. Dispatches on the body shape and the persisted run state (see ADR-003 in specs/agno/features/checkpointing/decisions.md).
\*\*Variants:\*\*
- PAUSED + tools provided → apply HITL tool results, resume
- PAUSED + resolved admin approval (empty tools) → apply resolution, resume
- RUNNING / ERROR (no unresolved HITL requirements) → resume from last persisted state
- COMPLETED + new tools → continue with appended messages
\*\*Tools Parameter:\*\*
JSON string containing array of tool execution objects with results. Optional — only required when the persisted run has unresolved HITL requirements.
## OpenAPI
````yaml /reference-api/openapi.yaml post /agents/{agent\_id}/runs/{run\_id}/continue
openapi: 3.1.0
info:
title: Agno API Reference
description: The all-in-one, private, secure agent platform that runs in your cloud.
version: 2.7.2
servers: []
security: []
paths:
/agents/{agent\_id}/runs/{run\_id}/continue:
post:
tags:
- Agents
summary: Continue Agent Run
description: >-
Advance a persisted agent run from its current state. Dispatches on the
body shape and the persisted run state (see ADR-003 in
specs/agno/features/checkpointing/decisions.md).
\*\*Variants:\*\*
- PAUSED + tools provided → apply HITL tool results, resume
- PAUSED + resolved admin approval (empty tools) → apply resolution,
resume
- RUNNING / ERROR (no unresolved HITL requirements) → resume from last
persisted state
- COMPLETED + new tools → continue with appended messages
\*\*Tools Parameter:\*\*
JSON string containing array of tool execution objects with results.
Optional — only required when the persisted run has unresolved HITL
requirements.
operationId: continue\_agent\_run
parameters:
- name: agent\_id
in: path
required: true
schema:
type: string
title: Agent Id
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
$ref: '#/components/schemas/Body\_continue\_agent\_run'
responses:
'200':
description: Agent run continued successfully
content:
application/json:
schema: {}
text/event-stream:
example: |+
event: RunContent
data: {"created\_at": 1757348314, "run\_id": "123..."}
'400':
description: Invalid JSON in tools field or invalid tool structure
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
Body\_continue\_agent\_run:
properties:
tools:
type: string
title: Tools
description: JSON string of tool call results to continue the paused run
default: ''
input:
anyOf:
- type: string
- type: 'null'
title: Input
description: >-
Optional new user-message text to append to the run before resuming.
Use for continuing a COMPLETED run with a follow-up, or adding
context to a RUNNING/ERROR resume.
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
description: >-
When true, clone the run with a new ``run\_id`` before resuming. The
original is untouched; the clone becomes a sibling within the same
session, with ``forked\_from\_run\_id`` set.
default: false
regenerate:
type: boolean
title: Regenerate
description: >-
Sugar: regenerate the last response of this run. Auto-computes
``continue\_from='last\_user'`` to land just after the last user
message. Pair with ``additional\_instructions`` to steer the new
output. By default the original response is hidden from history
(replaced); pass ``replace\_original=false`` to keep both the
original and the regenerated response visible side by side.
default: false
replace\_original:
anyOf:
- type: boolean
- type: 'null'
title: Replace Original
description: >-
Only valid with ``regenerate=true``. Controls history visibility of
the original response; the original run is always retained in
storage. Defaults to true: the original is marked REGENERATED and
hidden from history so the new response replaces it. Pass false to
keep both the original and regenerated responses visible.
additional\_instructions:
anyOf:
- type: string
- type: 'null'
title: Additional Instructions
description: >-
Only valid with ``regenerate=true``: extra guidance appended as a
user message before re-generation. Friendly alias for ``input``.
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
background:
type: boolean
title: Background
description: >-
Run continue in background (survives client disconnect). Requires
database. Use /resume to reconnect.
default: false
type: object
title: Body\_continue\_agent\_run
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
